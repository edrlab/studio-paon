var areas = {};

/**
 * Classe de base pour les objets Area.
 * 
 * Chaque Area possède : 
 * 	- les propriétés d'affichage de la zone,
 *  - la fonction pour construire le contenu de la zone.
 *  
 */
areas.Area = function(pId){
	this.fId = pId;
}

areas.Area.prototype = {
	getId : function(){
		return this.fId;
	},
	
	getLabel : function(pContext){
		return (typeof this.fLabel === 'function') ? this.fLabel.apply(this, arguments): ("fLabel" in this) ? this.fLabel : this.fId;
	},
	setLabel : function(pLabel){
		this.fLabel = pLabel;
		return this;
	},

	/**
	 * Description de l'area, généralement affiché sous forme de tooltip
	 */
	setDescription: function (pDesc) {
		this.fDescription = pDesc;
		return this;
	},
	
	getDescription: function (pContext) {
		return (typeof this.fDescription === 'function') ? this.fDescription.apply(this, arguments): this.fDescription;
	},
	
	/** Le groupe est utilisé par l'api de layout pour organiser les widgets. */
	getGroup : function(pContext){
		return (typeof this.fGroup === 'function') ? this.fGroup.apply(this, arguments): this.fGroup;
	},
	setGroup : function(pGroup){
		this.fGroup = pGroup;
		return this;
	},
	
	isVisible : function(pContext){
		if(typeof this.fVisible === 'function') return this.fVisible.apply(this, arguments);
		if(this.fVisible==false) return false;
		return this.checkPermissions(pContext);
	},
	setVisible : function(pVisible){
		this.fVisible = pVisible;
		return this;
	},
	
	/** Objet ou tableau d'objet de type Perm issu de module security contrôlant la visibilité de l'area. */
	setPermissions: function (pPermissions) {
		this.fPerms = pPermissions;
		return this;
	},
	
	getPermissions: function () {
		return this.fPerms;
	},
	
	checkPermissions: function (pContext) {
		var vPerms = this.getPermissions(pContext);
		if (!vPerms) return true;
		var vSecurityCtx = pContext.scSecurityCtx || pContext.window.scSecurityCtx;
		if (!vSecurityCtx) return true;
		return vSecurityCtx.hasPermForObjectRoot(vPerms);
	},
	
	/**
	 * Construit une zone graphique.
	 * @param pDomBuilder Constructeur DOM pour ajouter les noeuds représentant les instances de cet area.
	 * @param pContext Données permettant de construire et initialiser l'area.
	 * @param pOptions Options d'affichage
	 * @return Node créé
	 */
	buildBody : function(pDomBuilder, pContext, pOptions){
		//A surcharger
		// return widget
	},
	setBuildBody : function (pFct) {
		this.buildBody = pFct;
		return this;
	},
	
	/** Chargement asycnhrone des librairies nécessaires à la construction de cet area. 
	 * @param pCb callback(pErrors) où pErrors est null ou un tableau des urls à télécharger qui ont échouées.
	 */
	loadLibs : function(pCb, pCbThis) {
		if(this.fMapLibs) page.loadTags(this.fMapLibs, pCb, pCbThis);
		else pCb.call(pCbThis);
	},
	setLibs : function(pMapLibs) {
		this.fMapLibs = pMapLibs;
		return this;
	},

	/** Surcharge d'une function ou d'une propriété. */
	override : function(pKey, pVal){
		this[pKey] = pVal;
		return this;
	}
	
};



/**
 * Wrapper d'une area.
 * L'area wrappée peut être initialisée par setOverridenSvc() via le mécanisme de surcharge
 * des svc des extPoints ou appelé explicitement.
 * La méthode getWrappedAction(pContext) peut aussi être surchargée.
 */
areas.AreaWrapper = function(pId){
	this.fId = pId;
}
areas.AreaWrapper.NULL = new areas.Area("#NULL");
areas.AreaWrapper.NULL.isVisible = areas.AreaWrapper.NULL.isEnabled = function(pCtx){return false;}
areas.AreaWrapper.prototype = js.create(areas.Area.prototype, {
	/** 
	 * Doit renvoyer areas.AreaWrapper.NULL si pas de wrappedAction.
	 */
	getWrappedAction : function(pContext) {
		return this.fWrappedArea || areas.AreaWrapper.NULL;
	},
	
	/** Méthode utilisée par ExtPoints.getSvc() pour affecter le svc surchargé avant de retourner le svc surchargeant. */
	setOverridenSvc : function(pSvc) {
		this.fWrappedArea = pSvc;
		return this;
	},
	
	getLabel : function(pContext){
		return ("fLabel" in this) ? areas.Area.prototype.getLabel.apply(this, arguments) : this.getWrappedAction(pContext).getLabel();
	},
		
	getDescription : function(pContext){
		return ("fDescription" in this) ? areas.Area.prototype.getDescription.apply(this, arguments) : this.getWrappedAction(pContext).getDescription();
	},
		
	getGroup : function(pContext){
		return ("fGroup" in this) ? areas.Area.prototype.getGroup.apply(this, arguments) : this.getWrappedAction(pContext).getGroup();
	},
	
	isVisible : function(pContext){
		if("fVisible" in this) return areas.Area.prototype.isVisible.apply(this, arguments);
		if( ! this.checkPermissions(pContext)) return false;
		return this.getWrappedAction(pContext).isVisible(pContext);
	},
	
	getPermissions: function(pContext){
		return ("fPerms" in this) ? areas.Area.prototype.getPermissions.apply(this, arguments) : this.getWrappedAction(pContext).getPermissions(pContext);
	},
	
	buildBody : function(pDomBuilder, pContext, pOptions){
		this.getWrappedAction(pContext).buildBody.call(this, pDomBuilder, pContext, pOptions);
	},
	
	loadLibs : function(pCb, pCbThis) {
		return ("fMapLibs" in this) ? areas.Area.prototype.loadLibs.apply(this, arguments) : this.getWrappedAction(pContext).loadLibs(arguments);
	}
});

/**
 * Wrapper d'une area obtenue dynamiquement via un svc d'un extPoints.
 * La méthode setWrappedSvc(pSvcCd) permet d'initialiser ce wrapper.
 */
areas.SvcAreaWrapper = function(pId){
	this.fId = pId;
}

areas.SvcAreaWrapper.prototype = js.create(areas.AreaWrapper.prototype, {
	getWrappedSvcCd : function(){
		return this.fSvcCd;
	},
	setWrappedSvcCd : function(pSvcCd){
		this.fSvcCd = pSvcCd;
		return this;
	},
	
	getWrappedAction : function(pContext) {
		if(!pContext) {
			log.debug("areas.SvcAreaWrapper.getWrappedAction(pContext) :: pContext is "+pContext);
			return areas.AreaWrapper.NULL;
		}
		return (pContext.extPoints || (pContext.window ? pContext.window.extPoints : extPoints)).getSvc(this.fSvcCd) || areas.AreaWrapper.NULL;
	}
});


areas.InputArea = function(pId){
	this.fId = pId;
}
areas.InputArea.prototype = js.create(areas.Area.prototype, {
	
	/** Définition du tag pour instancier l'inputArea. */
	setTag: function(pTagName, pTypeExtension, pAtts) {
		this.fTagName = pTagName;
		this.fTypeExtension = pTypeExtension;
		this.fTagAtts = pAtts;
		return this;
	},
	
	getTagName: function(pContext) {
		return this.fTagName;
	},
	
	getTypeExtension: function(pContext) {
		return this.fTypeExtension;
	},
	
	getTagAtts: function(pContext) {
		return this.fTagAtts;
	},
	
	/**
	 * Etat de lecture seule de l'inputArea 
	 * @type boolean
	 */
	setReadOnly: function(pReadOnly) {
		this.fReadOnly = pReadOnly;
		return this;
	},
	
	isReadOnly: function(pContext) {
		if(this.fReadOnly == true) return true;
		var vSecurityCtx = pContext ? pContext.scSecurityCtx || pContext.window.scSecurityCtx : null;
		if (!vSecurityCtx) return false;
		var vPerms = this.getWritePerms(pContext);
		return vPerms && !vSecurityCtx.hasPermForObjectRoot(vPerms);
	},
	
	/** Objet ou tableau d'objet de type Perm issu de module security contrôlant isReadOnly(). */
	setWritePerms: function (pPermissions) {
		this.fWritePerms = pPermissions;
		return this;
	},
	
	/** Ajoute une permission locale par son nom. La perm sera résolue en fonction du contexte à l'exécution du isReadOnly(pContext). */
	addWritePermName:function(pPermName){
		if(!this.fWritePermsNameArray) this.fWritePermsNameArray=[];
		this.fWritePermsNameArray.push(pPermName);
		return this;
	},
	
	getWritePerms: function (pContext) {
		try{
			if(this.fWritePermsNameArray && pContext){
				//Permissions locales à résoudre en fonction du contexte
				var vSecurityCtx = pContext.scSecurityCtx || pContext.window.scSecurityCtx;
				if(vSecurityCtx) {
					var vPermsArray = vSecurityCtx.getPerms(this.fWritePermsNameArray);
					if(this.fWritePerms) vPermsArray.concat(this.fWritePerms);
					return vPermsArray;
				}
			}
			return this.fWritePerms;
		}catch(e){log.debug("jsForm.InputArea.getWritePerms::"+e)}
	},
	
	/**
	 * Caractère obligatoire de l'inputArea
	 * @type boolean
	 */
	setRequired: function(pRequired) {
		this.fRequired = pRequired;
		return this;
	},
	
	isRequired: function(pContext) {
		return this.fRequired == true;
	},
	
	/**
	 * Valeur par défaut de l'inputArea
	 * @type object
	 */
	setDefaultValue: function (pDefaultValue) {
		this.fDefaultValue = pDefaultValue;
		return this;
	},
	
	getDefaultValue: function (pContext) {
		return this.fDefaultValue;
	},

	/** Surcharge une méthode ou une propriété sur l'elt input qui sera créé lors de l'appel à buildBody(). */
	overrideTagInput: function(pKey, pValue) {
		if(!this.fOverrideInput) this.fOverrideInput = {};
		this.fOverrideInput[pKey] = pValue;
		return this;
	},
	
	/** Construction de base de l'inputArea par défaut. */
	buildDefaultBody: function (pDomBd, pContext, pOptions) {
		var vAtts = this.getTagAtts(pContext);
		var vIdVal = (vAtts && vAtts.id) || this.getId() + '~' + Math.floor(Math.random()*100000).toString(36);
		areas.buildLabelFrame(this, pDomBd, pContext, pOptions, vIdVal);
		var vInput = pDomBd.current().ownerDocument.createElement(this.getTagName(pContext), this.getTypeExtension(pContext));
		vInput.setAttribute("id", vIdVal);
		if(vAtts) for(var vKey in vAtts) vInput.setAttribute(vKey, vAtts[vKey]);
		if(this.fOverrideInput) {
			for(var vK in this.fOverrideInput) vInput[vK] = this.fOverrideInput[vK];
		}
		vInput.setAttribute('key', this.getId());
		if(!this.isVisible(pContext)) vInput.setAttribute('hidden', 'true');
		if (this.isReadOnly(pContext)) vInput.setAttribute('readonly', 'readonly');
		if (this.isRequired(pContext)) vInput.setAttribute('required', 'true');
		pDomBd.current().appendChild(vInput);
		vInput.initBuildContext(this, pContext, pOptions);
		return vInput;
	},
	
	/** Construction l'inputArea et retourne le noeud implémentant l'api InputAreaNode. */
	buildBody: function(pDomBd, pContext, pOptions){
		var vInput = this.buildDefaultBody(pDomBd, pContext, pOptions);
		var vDefaultValue = this.getDefaultValue(pContext);
		if (vDefaultValue !== undefined) vInput.initValue(vDefaultValue);
		return vInput;
	}
});



/** Construction des noeuds du label et positionnement de pDomBd pour l'insertion de l'area. */
areas.buildLabelFrame = function (pArea, pDomBd, pContext, pOptions, pId) {
	var vFieldLayout = (pOptions ? pOptions.labelFrame : null) || "row";
	if(vFieldLayout === "row") {
		//ligne de tableau avec 2 cells.
		pDomBd.elt("div", "inputRow").att("title", pArea.getDescription(pContext))
			.elt("div", "inputCellLabel").elt("label", "inputLabel").att("for", pId).text(pArea.getLabel(pContext)||"").up().up()
			.elt("div", "inputCellValue");
	} else if(vFieldLayout === "inline") {
		//label + input
		pDomBd.elt("label", "inlineLabel").att("for", pId).elt("span").text(pArea.getLabel(pContext)||"").up();
	} else if(vFieldLayout === "inlineAfter") {
		//input + label
		pDomBd.elt("label", "inlineLabelAfter").att("for", pId).elt("span", "inlineInput").up().text(pArea.getLabel(pContext)||"");
		pDomBd.setCurrent(pDomBd.current().firstElementChild);
	}
};


/**
 * Gestion de layouts Dom pour l'organisation spatiale d'une liste d'area.
 * 
 * [div xmlns:sal="scenari.eu:areaLayout:1.0"]
 *  [div sal:areaIds="xx"/]
 *  [div sal:areaGroups="xx"/]
 *  [div sal:areaIds="*"/]
 * [/div]
 * 
 * @param pDomRoot Noeud racine  qui contient les balises enrichies de directives d'insertion des areas ou DomBuilder pointant ce noeud.
 * @param pListAreas Tableau JS d'objets areas à injecter.
 * @param pContext Contexte pour construire les areas.
 * @param pOptions Options de layout.
 * 				pOptions.clear : si true supprime les précédents contenus.
 * @return Liste des noeuds ajoutés issus de pListAreas.
 */
areas.applyLayout = function(pDomRoot, pListAreas, pContext, pOptions) {
	var vDomBd, vEltRoot;
	if(pDomRoot instanceof dom.DomBuilder) {
		vEltRoot = pDomRoot.current();
		vDomBd = pDomRoot;
	} else  {
		vEltRoot = pDomRoot;
		vDomBd = dom.newBd(pDomRoot);
	}
	var vListAreas = pListAreas.slice(0);
	var vAreaBodies = [];
	var vDoc = vEltRoot.ownerDocument;
	var vIt, vElt;
	var vIdsParents = [], vGroupsParents = [], vRemainParent = null;

	vIt = vDoc.createNodeIterator(vEltRoot, NodeFilter.SHOW_ELEMENT, null, false);
	var vClear = pOptions && pOptions.clear;
	while(vElt = vIt.nextNode()) {
		var vId = vElt.getAttributeNS(dom.SALNS, 'areaIds');
		if (vId) {
			if (vId != '*') vIdsParents.push(vElt);
			else if (!vRemainParent) vRemainParent = vElt;
			if(vClear) vElt.innerHTML = "";
		}
		var vGroups = vElt.getAttributeNS(dom.SALNS, 'areaGroups');
		if (vGroups) {
			vGroupsParents.push(vElt);
			if(vClear) vElt.innerHTML = "";
		}
	}
	if (!vRemainParent) {
		vRemainParent = vEltRoot;
		if(vClear) vRemainParent.innerHTML = "";
	}
	
	for (var i in vIdsParents) {
		var vIds = vIdsParents[i].getAttributeNS(dom.SALNS, 'areaIds').split(' ');
		for (var j in vListAreas) {
			if (vIds.indexOf(vListAreas[j].getId()) != -1) {
				vDomBd.setCurrent(vIdsParents[i]);
				var vWidget = this.xBuildArea(vListAreas[j], vDomBd, pContext, pOptions);
				if(vWidget) vAreaBodies.push(vWidget);
				delete vListAreas[j];
			}	
		}
	}
	
	if (vListAreas.length) {
		for (var i in vGroupsParents) {
			var vGroups = vGroupsParents[i].getAttributeNS(dom.SALNS, 'areaGroups').split(' ');
			for (var j in vListAreas) {
				var vAreaGroup = vListAreas[j].getGroup();
				if (vAreaGroup && vGroups.indexOf(vAreaGroup) != -1) {
					vDomBd.setCurrent(vGroupsParents[i]);
					var vWidget = this.xBuildArea(vListAreas[j],vDomBd, pContext, pOptions);
					if(vWidget) vAreaBodies.push(vWidget);
					delete vListAreas[j];
				}
			}
		}
	}

	if (vListAreas.length) {
		for (var i in vListAreas) {
			vDomBd.setCurrent(vRemainParent);
			var vWidget = 	this.xBuildArea(vListAreas[i], vDomBd, pContext, pOptions);
			if(vWidget) vAreaBodies.push(vWidget);
		}
	}
	
	return vAreaBodies;
}

/**
 * Equivalent à areas.applyLayout() en s'assurant du préchargement des libs nécessaires.
 * 
 * @param pCb callback(pErrors) où pErrors est null ou un tableau des urls à télécharger qui ont échouées.
 */
areas.loadAndApplyLayout = function(pCb, pCbThis, pDomRoot, pListAreas, pContext, pOptions) {
	if (!pListAreas || !pListAreas.length) return;
	var vCountAreas = pListAreas.length;
	var vErrors;
	function cbLoad(pErrors){
		vCountAreas--;
		if(pErrors) vErrors = vErrors ? vErrors.concat(pErrors) : pErrors;
		if(vCountAreas==0) {
			if(!vErrors) this.applyLayout(pDomRoot, pListAreas, pContext, pOptions);
			pCb.call(pCbThis, vErrors);
		}
	}
	for(var i=0; i < pListAreas.length; i++) {
		pListAreas[i].loadLibs(cbLoad, this);
	}
}

/**
 * Application d'un template.
 * En plus des possibilités de applyLayout(), il est possible d'ajouter des directives conditionnelles :
 * <sal:if areaId="myArea">...</sal:if>
 */
areas.cloneLayout = function(pTemplate, pRootTarget, pListAreas, pContext, pOptions) {
	//pRootTarget.appendChild(dom.cloneContents(pTemplate));
	if(!pTemplate) return areas.applyLayout(pRootTarget, pListAreas, pContext, pOptions);

	var vTplRoot = pTemplate.content || pTemplate;

	var vFilter={acceptNode : function(pNode){
		if(pNode.nodeType==1 && pNode.namespaceURI==dom.SALNS && pNode.localName=="if") {
			var vAreaId = pNode.getAttribute("areaId");
			if(vAreaId) for(var i=0; i<pListAreas.length; i++) if(pListAreas[i].getId()==vAreaId) return NodeFilter.FILTER_SKIP;
			return NodeFilter.FILTER_REJECT;
		}
		return NodeFilter.FILTER_ACCEPT;
	}};

	var vCurTarget = pRootTarget;
	
	var vTw = vTplRoot.ownerDocument.createTreeWalker(vTplRoot, NodeFilter.SHOW_ALL, vFilter, false);
	try {
		vTw.firstChild();
	} catch(e){
		//FALLBACK BUG IE11 (exception si doc XML ou issu de XHR ?) : implementation partielle TreeWalker
		function TreeWalker(pRoot, /* TODO */pWhatToShow, pFilter){
			this.fRoot = pRoot;
			this.fFilter = pFilter;
			this.currentNode = pRoot;
		}
		TreeWalker.prototype = {
			firstChild: function(){
				var vR = this.xFirstChild(this.currentNode);
				if(vR) {this.currentNode = vR; return true;}
				return false;
			},
			nextSibling: function(){
				var vR = this.xNextSibling(this.currentNode);
				if(vR) {this.currentNode = vR; return true;}
				return false;
			},
			parentNode: function(){
				var vR = this.xParentNode(this.currentNode);
				if(vR) {this.currentNode = vR; return true;}
				return false;
			},
			xFirstChild: function(pN){
				var vCh = pN.firstChild;
				while(vCh) {
					switch(this.xFilter(vCh)) {
						case NodeFilter.FILTER_ACCEPT: return vCh;
						case NodeFilter.FILTER_SKIP:
							var vR = this.xFirstChild(vCh);
							if(vR) return vR;
						case NodeFilter.FILTER_REJECT:
							vCh = vCh.nextSibling;
							break;
						default: throw "NodeFilter return unknown";
					}
				}
				return null;
			},
			xNextSibling: function(pN){
				if(pN===this.fRoot) return null;
				var vN = pN.nextSibling;
				while(vN) {
					switch(this.xFilter(vN)) {
						case NodeFilter.FILTER_ACCEPT: return vN;
						case NodeFilter.FILTER_SKIP:
							var vR = this.xFirstChild(vN);
							if(vR) return vR;
						case NodeFilter.FILTER_REJECT:
							vN = vN.nextSibling;
							break;
						default: throw "NodeFilter return unknown";
					}
				}
				if(pN.parentNode!==this.fRoot && this.xFilter(pN.parentNode)!=NodeFilter.FILTER_ACCEPT) {
					var vR = this.xNextSibling(pN.parentNode);
					if(vR) return vR;
				}
				return null;
			},
			xParentNode: function(pN){
				if(pN===this.fRoot) return null;
				var vN = pN.parentNode;
				while(vN) {
					switch(this.xFilter(vN)) {
						case NodeFilter.FILTER_ACCEPT: return vN;
						case NodeFilter.FILTER_SKIP:
						case NodeFilter.FILTER_REJECT:
							vN = vN.parentNode;
							break;
						default: throw "NodeFilter return unknown";
					}
				}
				return null;
			},
			xFilter: function(pNode) {
				//TODO whatToShow
				if(!this.fFilter) return NodeFilter.FILTER_ACCEPT;
				return this.fFilter.acceptNode(pNode);
			}
		}
		vTw = new TreeWalker(vTplRoot, NodeFilter.SHOW_ALL, vFilter);
		vTw.firstChild();
		// FIN FALLBACK BUG IE11
	}

	while(vTw.currentNode !== vTplRoot) {
		var vNewTarget = vCurTarget.appendChild(vTw.currentNode.cloneNode(false));
		if(vTw.firstChild()) {
			vCurTarget = vNewTarget;
		} else {
			while(!vTw.nextSibling()){
				if(!vTw.parentNode()) break;
				vCurTarget = vCurTarget.parentNode;
			}
		}
	}
	return areas.applyLayout(pRootTarget, pListAreas, pContext, pOptions);
}

/**
 * Chargement asynchrone et application d'un template.
 * @param pTemplateOrUrl Node template ou url de chargement pouvant contenir un #myId pour extraire le template recherché.
 * @param pCb callback(pErrors) où pErrors est null ou un tableau des urls à télécharger qui ont échouées.
 */
areas.loadAndCloneLayout = function(pCb, pCbThis, pTemplateOrUrl, pRootTarget, pListAreas, pContext, pOptions) {
	var vTpl=pTemplateOrUrl;
	var vErrors;
	function cbLoad(pErrors){
		vCountLoads--;
		if(vCountLoads==0) {
		if(pErrors) vErrors = vErrors ? vErrors.concat(pErrors) : pErrors;
			if(!vErrors) areas.cloneLayout(vTpl, pRootTarget, pListAreas, pContext, pOptions);
			pCb.call(pCbThis, vErrors);
		}
	}
	var vCountLoads = pListAreas ? pListAreas.length : 0;
	if(typeof pTemplateOrUrl == "string") {
		vCountLoads++;
		var vReq = io.openHttpRequest(pTemplateOrUrl);
		vReq.onloadend = function(pEvt){
			if(pEvt.target.status < 300) {
				//console.log("tpl:::::::::::::"+pTemplateOrUrl+":::\n"+log.getXml(pEvt.target.responseXML));
				var vHash = pTemplateOrUrl.indexOf("#");
				vTpl = vHash>0 ? pEvt.target.responseXML.getElementById(pTemplateOrUrl.substring(vHash+1)) : pEvt.target.responseXML.documentElement;
				cbLoad(!vTpl ? [pTemplateOrUrl] : null);
			} else {
				cbLoad([pTemplateOrUrl]);
			}
		}
		vReq.send();
	}
	for(var i=0; i < pListAreas.length; i++) {
		pListAreas[i].loadLibs(cbLoad, this);
	}
}


areas.xBuildArea = function (pArea, pDomBd, pContext, pOptions) {
	return pArea.isVisible(pContext) ? pArea.buildBody(pDomBd, pContext, pOptions) : null;
}

