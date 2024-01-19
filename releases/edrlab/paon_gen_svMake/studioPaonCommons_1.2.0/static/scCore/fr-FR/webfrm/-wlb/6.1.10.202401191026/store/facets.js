var facets = {}

facets.Facet = function(pCode) {
	this.fCode = pCode;
}
facets.Facet.prototype = {
	getCode: function() {
		return this.fCode;
	},
	
	getLabel: function() {
		return this.fLabel;
	},
	
	setLabel: function(pLabel) {
		this.fLabel = pLabel;
		return this;
	},
	
	getDescription: function() {
		return this.fDescription;
	},
	
	setDescription: function(pDescription) {
		this.fDescription = pDescription;
		return this;
	},
	
	getIcon: function() {
		return this.fIcon;
	},
	
	setIcon: function(pIcon) {
		this.fIcon = pIcon;
		return this;
	},
	
	getQueryFilter: function(pElement) {
		return null;
	},

	getQueryAggs:function(){
		return {
			"terms": {
				"field": this.getCode()
			}
		};
	},
	
	buildBody: function(pContext) {
		
	},
	
	xDispatchChangeEvent: function(pElement) {
		dom.createAndDispatchEvent(pElement, 'SCFacetChange', this);
	}
};

facets.EnumFacet = function(pCode) {
	this.fCode = pCode;
};
facets.EnumFacet.prototype = js.create(facets.Facet.prototype, {
	getLabelMap: function () {
		return this.fLabelMap;
	},
	
	setLabelMap: function (pLabelMap) {
		this.fLabelMap = pLabelMap;
		return this;
	},
	
	getQueryFilter: function(pElement) {
		var vValue = [];
		var vInputs = pElement.querySelectorAll('input')
		for (var i=0; i<vInputs.length; i++) {
			var vInput = vInputs.item(i); 
			if (vInput.checked) vValue.push(vInput.name);
		}
		if (!vValue.length) return null;
		
		var vFilter = { terms: {} };
		vFilter.terms[this.getCode()] = vValue;
		return vFilter;
	},
	
	buildBody: function(pBd, pAggCounts, pFilters) {
		var vSelection = [];
		if (pFilters) for (var i=0; i<pFilters.length; i++) {
			var vFilter = pFilters[i];
			vSelection = vFilter.terms && vFilter.terms[this.getCode()];
			if (vSelection) break;
		}
		var vLabelMap = this.getLabelMap();

		pBd.elt("fieldset", "vbox facet")
			.elt("legend").text(this.getLabel()).up();
		for (var vKey in vLabelMap) {
			var vAggCount = pAggCounts && pAggCounts[vKey];
			var vSelected = vSelection && vSelection.indexOf(vKey) != -1;
			var vLabel = vLabelMap[vKey];
			pBd.elt('label', 'hbox align-center ' + (pAggCounts && !vAggCount ? 'disabled' : ''))
				.elt('input').att('type', 'checkbox').att('name', vKey).prop("checked", vSelected).up();
			if (typeof vLabel == "string") pBd.elt('sc-label').att("label", vLabel).up();
			else pBd.elt('sc-label').att('icon', vLabel.icon).att("label", vLabel.label).up();
			if (vAggCount) pBd.elt("span", "aggCount").text('(' + (vAggCount || 0) + ')').up();
			pBd.up();
		}
		
		var vElement = pBd.currentUp();
		var vSelf = this;
		vElement.addEventListener('change', function() {
			vSelf.xDispatchChangeEvent(vElement);
		});
		return vElement;
	},
	
	xBuildEntry: function (pBd, vLabel, pAggCount, pSelected) {
		pBd.elt('label', 'hbox align-center')
			.elt('input').att('type', 'checkbox').att('name', vKey).prop("checked", pSelected).up();
		if (typeof vLabel == "string") pBd.elt('sc-label').att("label", vLabel).up();
		else pBd.elt('sc-label').att('icon', vLabel.icon).att("label", vLabel.label).up();
		if (pAggCount) pBd.elt("span", "aggCount").text('(' + pAggCount + ')').up();
		pBd.up();
	}
});

/**
 * Facette dynamique. Adapte le nombre de valeurs affichées en fonction du contexte (map de
 * label trop volumineuse ou absence de map de labels.
 *
 * fCode => String, code du field
 *
 * fValueNumber => Number, nombre préférentiel de labels à afficher (les labels suivants sont
 * disponibles dans une liste déroulante. Dans le cas où il y a fValueNumber+1 labels à afficher,
 * la liste déroulante est remplacée par un label supplémentaire.
 *
 * fLabelMap => map de label pour constuire des facettes signifiantes
 *
 * fNormalizer => objet de normalisation des values dans le cas où aucune map n'est disponible.
 * Doit contenenir une fonction normalize(pSring){ / *** /return vNormalizedString};
 */
facets.DynEnumFacet = function(pCode) {
	this.fCode = pCode;
	this.fValueNumber = 5;
};
facets.DynEnumFacet.prototype = js.create(facets.Facet.prototype, {
	getLabelMap: function () {
		return this.fLabelMap;
	},

	setLabelMap: function (pLabelMap) {
		this.fLabelMap = pLabelMap;
		return this;
	},

	getNormalizer : function(){
		return this.fNormalizer;
	},

	setNormalizer : function(pNormalizer){
		this.fNormalizer = pNormalizer;
		return this;
	},

	setValueNumber : function(pValueNumber){
		this.fValueNumber = pValueNumber;
		return this;
	},

	getQueryFilter: function() {
		if (!this.fElt) return null;
		var vValue = [];
		var vInputs = this.fElt.querySelectorAll('input');
		for (var i=0; i<vInputs.length; i++) {
			var vInput = vInputs.item(i);
			if (vInput.checked) vValue.push(vInput.name);
		}
		var vOther = this.fElt.querySelector("select");
		if(vOther && vOther.value) vValue.push(vOther.value);
		if (!vValue.length) return null;

		var vFilter = { "terms": {} };
		vFilter.terms[this.getCode()] = vValue;
		return vFilter;
	},

	buildBody: function(pBd, pAggs, pFilters) {
		//on stocke la sélection sous forme d'objet pour simplifier la recherche de valeurs sélectionnées.
		var vSelection = null;
		if (pFilters) for (var i=0; i<pFilters.length; i++) {
			var vTmpSelection = [];
			var vFilter = pFilters[i];
			vTmpSelection = vFilter.terms && vFilter.terms[this.getCode()];
			if (vTmpSelection) {
				vSelection = {};
				vTmpSelection.forEach(function(pEntry){vSelection[pEntry]=true});
				break;
			}
		}
		//Le normalizer n'est utilisé que lorsqu'aucune map n'est disponible
		var vLabelMap = this.getLabelMap(),
			vNormalizer = vLabelMap?null:this.getNormalizer(),
			vAggs = null;

		if(vNormalizer){
			for(var vKey in pAggs){
				var vNormKey = vNormalizer.normalize(vKey);
				vAggs[vNormKey] = (vAggs[vNormKey] || 0) + pAggs[vKey];
			}
		}
		else vAggs = pAggs;

		//Aucune info ne permet de construire une vue
		if(!vAggs && !pFilters && !vLabelMap) return pBd;

		pBd.elt("fieldset", "vbox facet")
			.elt("legend").text(this.getLabel()).up();
		//Cas 1 => On connait la taille de la map, elle est affichable. On affiche tout.
		if(vLabelMap && this.fValueNumber+1 >= Object.keys(vLabelMap).length ){
			for(vKey in vLabelMap) this.xBuildEntry(pBd,vKey, vAggs[vKey]||0,vSelection[vKey],vLabelMap[vKey]);
		}
		//Cas 2 => Le nb de sélection est identique (modulo 1) à la taille de la map. On affiche tout.
		else if(vLabelMap && vSelection && Object.keys(vSelection).length +1 >= Object.keys(vLabelMap).length ){
			for(vKey in vLabelMap) this.xBuildEntry(pBd,vKey, vAggs[vKey]||0,vSelection[vKey],vLabelMap[vKey]);
		}
		//Cas 3 => Des sélections mais pas de map. On affiche toutes les sélections.
		else if(!vLabelMap && vSelection){
			for(vKey in vSelection) this.xBuildEntry(pBd,vKey, vAggs[vKey]||0,vSelection[vKey],vKey);
		}
		//Cas 4 => La nb de sélection est plus petit que la map. On affiche les sélection + other avec le reste de la map
		else if(vLabelMap && vSelection && Object.keys(vSelection).length < Object.keys(vLabelMap).length ){
			for(vKey in vSelection) this.xBuildEntry(pBd,vKey, vAggs[vKey]||0,true,vLabelMap[vKey]);
			this.xBuildOthers(pBd,vLabelMap,vSelection,vAggs);
		}
		//Cas 5 => Pas de sélection et une map. On affiche les n première entrées et le reste en other.
		else if(vLabelMap){
			var vSortedAggs = [];
			for (var vKey in vAggs)	vSortedAggs.push({"key":vKey,"count":vAggs[vKey]});
			vSortedAggs.sort(function(a,b){return b.count - a.count});
			var vBuiltValues={};
			for(var i = 0 ; i < Math.min(this.fValueNumber, vSortedAggs.length); i++){
				this.xBuildEntry(pBd,vSortedAggs[i].key, vSortedAggs[i].count,false,vLabelMap[vSortedAggs[i].key]);
				vBuiltValues[vSortedAggs[i].key] = true;
			}
			this.xBuildOthers(pBd,vLabelMap,vBuiltValues,vAggs);
		}
		//cas 6 => Pas de sélection, pas de map, nb aggs affichable
		else if(Object.keys(vAggs).length <= this.fValueNumber+1) {
			for (var vAgg in vAggs) this.xBuildEntry(pBd, vAgg, vAggs[vAgg], false, vAgg);
		}
		//Cas 7 => Pas de sélection, pas de map, trop d'aggs pour un affichage.
		else{
			var vSortedAggs = [];
			for (var vKey in vAggs)	vSortedAggs.push({"key":vKey,"count":vAggs[vKey]});
			vSortedAggs.sort(function(a,b){return b.count - a.count});
			var vBuiltValues = {};
			for (var i = 0; i < this.fValueNumber; i++) {
				this.xBuildEntry(pBd, vSortedAggs[i].key, vSortedAggs[i].count, false, vSortedAggs[i].key);
				vBuiltValues[vSortedAggs[i].key] = true;
			}
			this.xBuildOthers(pBd, vAggs, vBuiltValues, vAggs);

		}

		var vElement = pBd.currentUp();
		var vSelf = this;
		vElement.addEventListener('change', function() {
			vSelf.xDispatchChangeEvent(vElement);
		});
		this.fElt = vElement;
		return vElement;
	},

	xBuildEntry : function(pBd, pKey, pAggCount, pSelected, pLabel){
		var vLabel = pLabel ? pLabel : "Aucun";
		pBd.elt('label', 'hbox align-center ' + (!pAggCount ? 'disabled' : ''))
			.elt('input').att('type', 'checkbox').att('name', pKey).prop("checked", pSelected).up();
		if (typeof vLabel == "string") pBd.elt('sc-label').att("label", vLabel).up();
		else pBd.elt('sc-label').att('icon', vLabel.icon).att("label", vLabel.label).up();
		if (pAggCount) pBd.elt("span", "aggCount").text('(' + (pAggCount || 0) + ')').up();
		pBd.up();
	},

	xBuildOthers : function(pBd, pMapToBuild, pMapToExclude, pAggs){
		var vTotal = 0;
		pBd.elt("select",  'hbox align-center' )
			.elt("option").att("value", "").up();
		for(var vKey in pMapToBuild){
			if(!pMapToExclude || !pMapToExclude[vKey]){
				pBd.elt("option").att("value", vKey);
				var vTxt = typeof pMapToBuild[vKey] == "string"? pMapToBuild[vKey]: vKey;
				if(!vTxt) vTxt = "Aucun";
				if(pAggs && pAggs[vKey]){
					vTotal += pAggs[vKey];
					pBd.text(vTxt  +" : "+pAggs[vKey]).up();
				}
				else pBd.text(vTxt).up();
			}
		}
		pBd.setCurrent(pBd.current().firstElementChild).text("Autre"+'('+vTotal+')').up().up();
	}
});
