(function(){

	function JsonRdr(pSub){
		this.fSub = pSub;
	}
	JsonRdr.prototype = {

		/**
		 *
		 * @param pDomBd DomBuilder pour produire le résultat.
		 * @param pJson Source
		 * @param pAncestors [optionnel] contexte ancêtres de pJson : tableau de couples [Object, propName] ou [Array, index]
		 * @returns {JsonRdr} this
		 */
		render: function(pDomBd, pJson, pAncestors){
			if(!pAncestors) pAncestors = [];
			if(!pJson) {
				this.getValueRdr(pJson, pAncestors).renderVal(this, pDomBd, pJson, pAncestors);
			} else if(Array.isArray(pJson)) {
				this.getArrayRdr(pJson, pAncestors).renderArr(this, pDomBd, pJson, pAncestors);
			} else if(typeof pJson === "object") {
				this.getObjectRdr(pJson, pAncestors).renderObj(this, pDomBd, pJson, pAncestors);
			} else {
				this.getValueRdr(pJson, pAncestors).renderVal(this, pDomBd, pJson, pAncestors);
			}
			return this;
		},

		newJsonRdr: function(){
			return new JsonRdr(this);
		},

		addRenderers: function(pRenderers) {
			if(!pRenderers) return;
			if(Array.isArray(pRenderers)) {
				for(var i=0; i< pRenderers.length; i++) this.addRenderer(pRenderers[i]);
			} else {
				this.addRenderer(pRenderers);
			}
			return this;
		},
		addRenderer: function(pRenderer) {
			if(pRenderer.renderObj) {
				if(this.fObjRdrs) this.fObjRdrs.push(pRenderer);
				else this.fObjRdrs = [pRenderer];
			}
			if(pRenderer.renderArr) {
				if(this.fArrRdrs) this.fArrRdrs.push(pRenderer);
				else this.fArrRdrs = [pRenderer];
			}
			if(pRenderer.renderVal) {
				if(this.fValRdrs) this.fValRdrs.push(pRenderer);
				else this.fValRdrs = [pRenderer];
			}
			if(pRenderer.renderKey) {
				if(this.fKeyRdrs) this.fKeyRdrs.push(pRenderer);
				else this.fKeyRdrs = [pRenderer];
			}
			if(pRenderer.renderIdx) {
				if(this.fIdxRdrs) this.fIdxRdrs.push(pRenderer);
				else this.fIdxRdrs = [pRenderer];
			}
			return this;
		},

		getObjectRdr : function(pObject, pAncestors){
			if(this.fObjRdrs) for(var i=this.fObjRdrs.length-1; i>=0; i--) {
				if(this.fObjRdrs[i].rdrMatch(this, pObject, pAncestors)) return this.fObjRdrs[i];
			}
			return this.fSub.getObjectRdr(pObject, pAncestors);
		},
		getArrayRdr : function(pArray, pAncestors){
			if(this.fArrRdrs) for(var i=this.fArrRdrs.length-1; i>=0; i--) {
				if(this.fArrRdrs[i].rdrMatch(this, pArray, pAncestors)) return this.fArrRdrs[i];
			}
			return this.fSub.getArrayRdr(pArray, pAncestors);
		},
		getValueRdr : function(pValue, pAncestors){
			if(this.fValRdrs) for(var i=this.fValRdrs.length-1; i>=0; i--) {
				if(this.fValRdrs[i].rdrMatch(this, pValue, pAncestors)) return this.fValRdrs[i];
			}
			return this.fSub.getValueRdr(pValue, pAncestors);
		},
		getKeyRdr : function(pKey, pAncestors){
			if(this.fKeyRdrs) for(var i=this.fKeyRdrs.length-1; i>=0; i--) {
				if(this.fKeyRdrs[i].rdrMatch(this, pKey, pAncestors)) return this.fKeyRdrs[i];
			}
			return this.fSub.getKeyRdr(pKey, pAncestors);
		},
		getIdxRdr : function(pIdx, pAncestors){
			if(this.fIdxRdrs) for(var i=this.fIdxRdrs.length-1; i>=0; i--) {
				if(this.fIdxRdrs[i].rdrMatch(this, pIdx, pAncestors)) return this.fIdxRdrs[i];
			}
			return this.fSub.getIdxRdr(pIdx, pAncestors);
		}
	};

	function onToggle(pEvt){
		var vToggle = pEvt.target;
		if(vToggle.classList.contains("closed")) {
			vToggle.classList.remove("closed");
			vToggle.nextElementSibling.style.display = "";
		} else {
			vToggle.classList.add("closed");
			vToggle.nextElementSibling.style.display = "none";
		}
	}

	var vObjectRdr = {
		renderObj : function(pJsonRdr, pDomBd, pObj, pAncestors){
			pDomBd.elt("span", "jsonToggle").listen("click", onToggle).up();
			pDomBd.elt("div", "jsonObj");
			pAncestors.push(pObj);
			for(var vKey in pObj) {
				pJsonRdr.getKeyRdr(vKey, pAncestors).renderKey(pJsonRdr, pDomBd, vKey, pAncestors);
			}
			pAncestors.pop();
			pDomBd.up();
		}
	};
	var vArrayRdr = {
		renderArr : function(pJsonRdr, pDomBd, pArr, pAncestors){
			pDomBd.elt("span", "jsonToggle").listen("click", onToggle).up();
			pDomBd.elt("div", "jsonArr");
			pAncestors.push(pArr);
			for(var vIdx in pArr) {
				pJsonRdr.getIdxRdr(vIdx, pAncestors).renderIdx(pJsonRdr, pDomBd, vIdx, pAncestors);
			}
			pAncestors.pop();
			pDomBd.up();
		}
	};
	var vValueRdr = {
		renderVal : function(pJsonRdr, pDomBd, pValue, pAncestors){
			if(pValue==null) {
				pDomBd.elt("span", "jsonNull").text("null").up();
			} else if( typeof pValue === "string") {
				pDomBd.elt("span", "jsonStr").text(pValue).up();
			} else if( typeof pValue === "number") {
				pDomBd.elt("span", "jsonNum").text(pValue).up();
			} else if( typeof pValue === "boolean") {
				pDomBd.elt("span", "jsonBool").text(pValue ? "true" : "false").up();
			} else {
				//autre type ?
				pDomBd.elt("span", "jsonStr").text(pValue).up();
			}
		}
	};
	var vKeyRdr = {
		renderKey : function(pJsonRdr, pDomBd, pKey, pAncestors){
			pDomBd.elt("div", "jsonKey").elt("span", "jsonKeyLabel").text(pKey).up();
			var vCh = pAncestors[pAncestors.length-1][pKey];
			pAncestors.push(pKey);
			pJsonRdr.render(pDomBd, vCh, pAncestors);
			pAncestors.pop();
			pDomBd.up();
		}
	};
	var vIdxRdr = {
		renderIdx : function(pJsonRdr, pDomBd, pIdx, pAncestors){
			pDomBd.elt("div", "jsonIdx").elt("span", "jsonIdxLabel").text(pIdx).up();
			var vCh = pAncestors[pAncestors.length-1][pIdx];
			pAncestors.push(pIdx);
			pJsonRdr.render(pDomBd, vCh, pAncestors);
			pAncestors.pop();
			pDomBd.up();
		}
	};

	var jsonRdr = new JsonRdr();
	jsonRdr.getObjectRdr = function(){return vObjectRdr};
	jsonRdr.getArrayRdr = function(){return vArrayRdr};
	jsonRdr.getValueRdr = function(){return vValueRdr};
	jsonRdr.getKeyRdr = function(){return vKeyRdr};
	jsonRdr.getIdxRdr = function(){return vIdxRdr};
	jsonRdr.addRenderer = function(){throw "Call .newJsonRdr() required before .addRenderers()"};

	/** Value Renderer pour un champs date cf https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat. */
	jsonRdr.DateRdr = function(pRdrMatch, pIntlDateTimeFormat, pAddTimeMs){
		this.rdrMatch = pRdrMatch; //function(pJsonRdr, pValue, pAncestors)
		this.fFormatter = pIntlDateTimeFormat;
		this.fAddTimeMs = pAddTimeMs;
	};
	jsonRdr.DateRdr.prototype = {
		renderVal : function(pJsonRdr, pDomBd, pValue, pAncestors){
			if(pValue <= 0) {
				pDomBd.elt("span", "jsonNum").text(pValue).up();
			} else if(this.fFormatter) {
				pDomBd.elt("span", "jsonNum").text(pValue).up();
			} else {
				pDomBd.elt("span", "jsonNum").text(new Date(pValue).toISOString()).up();
			}
			if(this.fAddTimeMs) pDomBd.elt("span", "jsonNum").text(" ("+pValue+")").up();
		}
	};
if(!window.extPoints || !extPoints.initSvcLazy("jsonRdr", jsonRdr)) window.jsonRdr = jsonRdr;
})();
