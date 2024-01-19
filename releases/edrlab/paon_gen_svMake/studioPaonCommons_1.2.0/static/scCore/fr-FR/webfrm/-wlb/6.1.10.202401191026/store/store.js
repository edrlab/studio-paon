var store={};


/**
 * Gestion d'accès aux données du server.
 * Idée de l'API : privilégier les accès asynchone (et non des getUrlXxx())  aux différents serveurs pour permettre une initlaisation asynchrone
 * et une gestion plus souple des différents auth possibles.
 */
store.StoreProvider = function(){
}
store.StoreProvider.prototype= {

	getUrlTreeRoot : function(){
		return this.fUrlTreeUrl;
	},

	getAdminUrlTreeRoot : function(){
		return this.fAdminUrlTreeUrl;
	},

	/**
	 * Retourne true si le store gère l'état "trashed" (en corbeille) des ressources
	 */
	canTrashRes : function(){
		return this.fCanTrashRes;
	},

	/**
	 * Retourne true si le store gère l'état "unlisted" (masqué des listes de fils) des ressources
	 */
	canUnlistRes : function(){
		return this.fCanUnlistRes;
	},

	/**
	 * @API
	 * @param pDirective Fragment à ajouter à l'URL en querystring : "nodeInfos", "infoViews", etc.
	 */
	dialogUrlTree : function(pPathNode, pDirective, pCb){
		var vUrl = this.fUrlTreeUrl + encodeURI(pPathNode);
		if(pDirective) vUrl += (pPathNode.indexOf('?')>=0 ? "&" : "?") + pDirective;
		var vReq = io.openHttpRequest(vUrl);
		vReq.setRequestHeader("X-SC-AUTH", "403"); //pour éviter un retour de page web d'auth en cas de perte d'auth ou insuffisance de droit.
		vReq.onloadend = pCb;
		vReq.send();
	},

	/**
	 * @API
	 * @param pDirective Fragment à ajouter à l'URL en querystring : "nodeInfos", etc.
	 */
	dialogAdminUrlTree : function(pPathNode, pDirective, pCb){
		var vUrl = this.fAdminUrlTreeUrl + encodeURI(pPathNode);
		if(pDirective) vUrl += (pPathNode.indexOf('?')>=0 ? "&" : "?") + pDirective;
		var vReq = io.openHttpRequest(vUrl);
		vReq.onloadend = pCb;
		vReq.send();
	},

	extractPathFromUrl:function(pUrl){
		if(!pUrl) return null;
		var vL = this.fUrlTreeUrl.length;
		if(pUrl.substring(0, vL) != this.fUrlTreeUrl) {
			if(pUrl.substring(0, vL) != this.fAdminUrlTreeUrl) return null;
			var vEnd = pUrl.indexOf("?");
			if(vEnd==-1) vEnd = pUrl.length;
			return decodeURI(pUrl.substring(this.fAdminUrlTreeUrl.charAt(vL-1)=='/' ? vL-1 : vL, vEnd));
		}
		var vEnd = pUrl.indexOf("?");
		if(vEnd==-1) vEnd = pUrl.length;
		return decodeURI(pUrl.substring(this.fUrlTreeUrl.charAt(vL-1)=='/' ? vL-1 : vL, vEnd));
	},

	/**
	 * @API
	 */
	dialogWriteServer : function(pSvcUrl, pBody, pOnLoadEndCb, pOnProgressCb){
		var vReq = io.openHttpRequest(this.fWriteUrl + pSvcUrl, pBody ? "POST" : "GET");
		vReq.onloadend = pOnLoadEndCb;
		if(pOnProgressCb) vReq.onprogress = pOnProgressCb;
		vReq.send(pBody);
	},

	/**
	 * @API
	 */
	dialogCid : function(pQueryString, pBody, pOnLoadEndCb, pOnProgressCb){
		var vUrl = this.fWriteUrl + "/u/cid";
		if(pQueryString) vUrl += pQueryString;
		var vReq = io.openHttpRequest(vUrl, pBody ? "POST" : "GET");
		vReq.onloadend = pOnLoadEndCb;
		if(pOnProgressCb) vReq.onprogress = pOnProgressCb;
		vReq.send(pBody);
	},

	/**
	 * @param pIndex Role  de l'index à interroger. Exemple : "depot"
	 * @param pRequestUrl Exemple : "/res,page/_search"
	 * @API
	 */
	dialogSearch : function(pIndexRole, pRequestUrl, pBody, pOnLoadEndCb, pOnProgressCb){
		if(!this.fSearchUrl) {
			log.debug("Search service not available");
		}
		//		
		var vUrl = this.fSearchUrl + (this.fEsIndexMap[pIndexRole] || "") + pRequestUrl;
		var vReq = io.openHttpRequest(vUrl, pBody ? "POST" : "GET");
		vReq.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		vReq.onloadend = pOnLoadEndCb;
		if(pOnProgressCb) vReq.onprogress = pOnProgressCb;
		vReq.send(pBody);
	},

	/**
	 * Config:
	 * {
	 *  urlTreeUrl : ""
	 *  writeUrl : ""
	 *  esUrl : "Optionnal, si vide, interrogera le writeUrl."
	 *  esIndexMap : {"indexRoleName" : "/indexName" ... }
	 * }
	 */
	initStore : function(pConfig){
		this.fUrlTreeUrl = pConfig.urlTreeUrl;
		this.fAdminUrlTreeUrl = pConfig.adminUrlTreeUrl;
		this.fWriteUrl = pConfig.writeUrl;
		this.fSearchUrl = pConfig.searchUrl;
		this.fEsIndexMap = pConfig.esIndexMap || {};
		this.fCanTrashRes = pConfig.canTrashRes;
		this.fCanUnlistRes = pConfig.canUnlistRes;
		return this;
	}
}

/** */
store.getPatternNodeName = function(){
	return "[^\\/\\\\@;:|\\*!][^\\/\\\\@;:|?\\*!]*";
}

/** */
store.extractContentIdFromResId = function(pResId){
	return pResId.substring(0, pResId.length-3);
}

/**
 *
 */
store.StPath = function(pPath) {
	this.fPath= pPath;
}
store.StPath.prototype = {
	getPath : function(){return this.fPath},
	isRoot : function(){return this.fPath=="/" || (this.fPath.charAt(0)=="@" && this.fPath.indexOf('/')<0)},
	isPermaPath : function(){return this.fPath.indexOf("@")>=0},
	extractLivePath : function(){return this.fPath.replace(/(^\/@[^\/]*)/, "").replace(/(@[^\/]*)/g, "");},
	extractLiveName : function(){return /([^\/]*$)/.exec(this.fPath)[0].replace(/(@[^\/]*)/g, "");},
	extractLiveFolder : function(){return this.fPath.replace(/(\/[^\/]*$)/, "").replace(/(^\/@[^\/]*)/, "").replace(/(@[^\/]*)/g, "") || "/";},
	extractLiveLeaf : function(){return this.fPath.replace(/(@[^\/]*$)/, "");},
	extractPermaName : function() {return /([^\/]*$)/.exec(this.fPath)[0];},
	extractVersionName : function(){var vR=/@([^\/]*$)/.exec(this.fPath); return vR ? vR[1]:null},
	extractPermaFolder : function(){return this.fPath.replace(/(\/[^\/]*$)/, "") || "/";},
	switchResVersion : function(pNewVersion){return this.fPath.replace(/(@[^\/]*\/?$|(?!^)\/$)/, "") + "@" + pNewVersion;}
}
store.buildPath = function(pFolder, pName, pVersion) {
	if(pVersion) pName = pName + "@" + pVersion;
	if(pFolder.charAt(pFolder.length-1)=='/') return pFolder + pName;
	return  pFolder + "/"  + pName;
}
store.buildUrlFromPath = function(pRootUrl, pPath) {
	return pRootUrl + encodeURI(pPath);
}

store.Versionning = {
	"none" : "none",
	"VCS" : "VCS",
	"VCB" : "VCB"
}

/** pour compat ascendante des anciens infoView sans tag "subPath" **/
store.migrateInfoViews = function(pInfoViews) {
	if( ! pInfoViews.version) {
		//transformation du path de chaque view en subPaths
		if(pInfoViews.views) for(var k in pInfoViews.views) {
			var vView = pInfoViews.views[k];
			if(!vView.subPaths){
				vView.subPaths=[];
				if(vView.path) vView.subPaths.push(vView.path.replace(/[^\/\?]*(.*)/, "$1")); //élimination du nom de la res
			}
		}
	}
	return pInfoViews;
},

	/**
	 * Spécifie un champ généralement utilisé pour représenter une meta d'une ressource.
	 * Un store.Field encapsule un ou plusieurs Area
	 */
	store.Field = function(pKey) {
		this.fKey= pKey;
	}
store.Field.prototype = {
	getKey : function(){return this.fKey;},
	getLabel : areas.Area.prototype.getLabel,
	setLabel : areas.Area.prototype.setLabel,
	getDescription : areas.Area.prototype.getDescription,
	setDescription : areas.Area.prototype.setDescription,
	setDefaultValue : areas.InputArea.prototype.setDefaultValue,
	getDefaultValue : areas.InputArea.prototype.getDefaultValue,

	getShowArea : function(pContext, pOptions){
		if(pOptions && pOptions.viewKey)
			return this.fShowAreas ? this.fShowAreas[pOptions.viewKey] : null;
		return this.fShowArea;
	},
	setShowArea : function(pShowArea, pCopyProps, pViewKey){
		if(pCopyProps) this.xCopy2Area(pShowArea);
		if(pViewKey) {
			if(!this.fShowAreas) this.fShowAreas = {};
			this.fShowAreas[pViewKey] = pShowArea;
		} else {
			this.fShowArea = pShowArea;
		}
		return this;
	},

	getInputArea : function(pContext, pOptions){
		if(pOptions && pOptions.editorKey)
			return this.fInputAreas ? this.fInputAreas[pOptions.editorKey] : null;
		return this.fInputArea;
	},
	setInputArea : function(pInputArea, pCopyProps, pEditorKey){
		if(pCopyProps) this.xCopy2Area(pInputArea);
		if(pEditorKey) {
			if(!this.fInputAreas) this.fInputAreas = {};
			this.fInputAreas[pEditorKey] = pInputArea;
		} else {
			this.fInputArea = pInputArea;
		}
		return this;
	},

	setArea : function(pInputArea, pCopyProps, pKey){
		this.setInputArea(pInputArea, pCopyProps, pKey);
		this.setShowArea(js.create(pInputArea).setReadOnly(true), false, pKey);
		return this;
	},

	/**
	 * Appelé par store.Processing.buildDefaultProps().
	 * Cherche à initialiser pContext.defaultProps[this.fKey].
	 * @param pAsynchCallback appelée lorsque la valeur a été renseignée suite à un traitement asynchrone.
	 * @return true si réponse asynchrone, undefined sinon.
	 */
	fillDefaultValue : function (pContext, pAsynchCallback){
		//implémentation par défaut
		if(pContext.nodeInfos && pContext.nodeInfos.metas && (this.fKey in pContext.nodeInfos.metas)) {
			//recopie la valeur courante en cas de modification d'une ressource existante.
			pContext.defaultProps[this.fKey] = this.xNormPropValue(pContext.nodeInfos.metas[this.fKey]);
		} else if(pContext.propsFromCaller && (this.fKey in pContext.propsFromCaller)) {
			//sinon, on regarde si le contexte appelant a spécifié une valeur pour ce field.
			pContext.defaultProps[this.fKey] = this.xNormPropValue(pContext.propsFromCaller[this.fKey]);
		} else {
			//sinon, valeur par défaut de ce field.
			var vDefV = this.getDefaultValue(pContext);
			if(vDefV !== undefined) pContext.defaultProps[this.fKey] = vDefV;
		}
	},

	/** Normalise une valeur issue des metas de la res en cours d'édition ou des propsFromCaller. */
	xNormPropValue : function(pValue) {return pValue;},

	override : function (pKey, pValue){
		this[pKey] = pValue;
		return this;
	},

	xCopy2Area : function(pArea){
		if(this.fLabel) pArea.setLabel(this.fLabel);
		if(this.fDescription) pArea.setDescription(this.fDescription);
	}
}

/**
 * Field "path" des ressources.
 */
store.DepotPathField = function() {
	this.fKey= "path";
	this.setInputArea(new store.DepotPathField.PathInputArea(this));
}
store.DepotPathField.prototype =  js.create(store.Field.prototype, {
	setLabels : function(pNameLabel, pFolderLabel){
		this.setLabel(pNameLabel);
		this.fNameLabel = pNameLabel;
		this.fFolderLabel = pFolderLabel;
		return this;
	},
	setDescriptions : function(pNameDesc, pFolderDesc){
		this.setDescription(pNameDesc);
		this.fNameDesc = pNameDesc;
		this.fFolderDesc = pFolderDesc;
		return this;
	},
	fillDefaultValue : function (pContext, pAsynchCallback){
		var vFromPath;
		if(pContext.nodeInfos && pContext.nodeInfos.path) {
			//Modif d'une res.
			vFromPath = pContext.processing.getVersionning() == store.Versionning.VCS ? pContext.nodeInfos.path : pContext.nodeInfos.permaPath;
			//On élimine le / de fin si c'est un dossier.
			if(vFromPath.length>1 && vFromPath.charAt(vFromPath.length-1)=="/") vFromPath = vFromPath.substring(0, vFromPath.length-1);
		} else if(pContext.fileName || pContext.file){
			//Création d'une res à partir d'un nouveau contenu.
			var vFileName = pContext.fileName || pContext.file.name;
			vFromPath = store.buildPath(pContext.currentFolderPath || "/", vFileName);
		} else {
			vFromPath = pContext.currentFolderPath || "/";
		}
		pContext.defaultProps[this.fKey] = vFromPath;
	}
});

/**
 * PathInputArea. Options d'affichage :
 * pOptions.pathName : "none", "readonly"
 * pOptions.pathFolder : "none", "readonly"
 */
store.DepotPathField.PathInputArea = function(pField){
	this.fId = "path";
	this.fField = pField;
}
store.DepotPathField.PathInputArea.prototype = js.create(areas.InputArea.prototype, {
	setReadOnlyOnFolder : function(pReadOnlyOnFolder){
		this.fReadOnlyOnFolder = pReadOnlyOnFolder;
	},
	isReadOnly : function(pContext){
		if(areas.InputArea.prototype.isReadOnly.call(this, pContext)) return true;
		if(pContext.nodeInfos && new store.StPath(pContext.nodeInfos.path).isRoot()) return true; //racine de l'arbre non déplaçable.
		if(this.fReadOnlyOnFolder && pContext.nodeInfos && (pContext.nodeInfos.t=="noContent" || pContext.nodeInfos.t=="home")) return true;
		return false;
	},
	buildBody : function(pDomBd, pContext, pOptions){
		var vOptName = pOptions ? pOptions.pathName : "";
		if(vOptName == "none") return null;
		var vOptFolder = pOptions ? pOptions.pathFolder : "";
		var vRoot = pDomBd.current();
		var vFolderInput;
		if(vOptFolder != "none") {
			this.setLabel(this.fField.fFolderLabel);
			this.setDescription(this.fField.fFolderDesc);
			areas.buildLabelFrame(this, pDomBd, pContext, pOptions);
			vFolderInput = pDomBd.elt("sc-hbox").elt("input", "fieldValue").att("readonly", "readonly").currentUp();
			if(vOptFolder != "readonly" && !this.isReadOnly(pContext)) {
				var vChgFolder =  pDomBd.elt("sc-btn").att("data-action","chgFolder").style({width:"60px"}).currentUp();
				page.loadTags({"btn-selNode": "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/webfrm/-wbk/6.1.10.202401191026/store/dialogs/selNode.html"}, function(pErrors) {
					if(pErrors) {console.log(pErrors); return;}
					vChgFolder.action = new SelNodeAction("chgFolder")
						.setLabel("Déplacer")
						.setDescription("Déplacer dans un autre dossier...")
						.setSelNodeOptions({ignoreRes: true});
					vChgFolder.actionContext = {
						selNodeCb: function(pDatas){
							if(pDatas){
								vFolderInput.value = pDatas.nodeInfos.permaPath || "/";
								if(vNameInput) vNameInput.dispatchDirtyEvent();
							}
						}
					}
				}, this);
			}
			pDomBd.setCurrent(vRoot);
		}
		this.setLabel(this.fField.fNameLabel);
		this.setDescription(this.fField.fNameDesc);
		areas.buildLabelFrame(this, pDomBd, pContext, pOptions);
		var vNameInput = pDomBd.elt("input", "fieldValue", "input-text").att("type", "text").att("required", "required").att("key", "path").att("pattern", store.getPatternNodeName()).current();
		if(vOptName == "readonly" || this.isReadOnly(pContext)) pDomBd.att("readonly", "readonly");
		pDomBd.setCurrent(vRoot);
		vNameInput.initValue = function(pValue) {
			var vStPath = new store.StPath(pValue);
			this.fOriginalFolderPath = vStPath.extractPermaFolder();
			if(vFolderInput) vFolderInput.value = this.fOriginalFolderPath;
			this.fOriginalName = vStPath.extractLiveName();
			this.value = this.fOriginalName;
		};
		vNameInput.getValue = function() {
			return store.buildPath(vFolderInput ? vFolderInput.value : this.fOriginalFolderPath, this.value);
		};
		this.buildBodyExt(pDomBd, pContext, pOptions, vFolderInput, vNameInput);
		return vNameInput;
	},
	/** enrichissements des widgets (controles supplémentaires, ajout de messages...) */
	buildBodyExt : function(pDomBd, pContext, pOptions, pFolderInput, pNameInput){}
});

/**
 *  Permet d'ajouter les méthodes de l'API Field à un Area utilisé uniquement en affichage :
 *  js.create(new areas.Area("..."), store.mixinShowFieldForArea);
 */
store.mixinShowFieldForArea = {
	_key : "",
	getShowArea : function(pContext, pOptions){
		if(pOptions && "viewKey" in pOptions){
			return pOptions.viewKey == this._key ? this : null;
		}else
			return this
	},
	getInputArea : function(pContext, pOptions){return null},
	fillDefaultValue : function (pContext, pAsynchCallback){},
	setKey : function(pKey){this._key = pKey}
}

/**
 *  Permet d'ajouter les méthodes de l'API Field à un Area utilisé uniquement en édition :
 *  js.create(new areas.Area("..."), store.mixinShowFieldForArea);
 */
store.mixinInputFieldForArea = {
	_key : "",
	getInputArea : function(pContext, pOptions){
		if(pOptions && "editorKey" in pOptions){
			return pOptions.viewKey == this._key ? this : null;
		}else
			return this
	},
	getShowArea : function(pContext, pOptions){return null},
	fillDefaultValue : function (pContext, pAsynchCallback){},
	setKey : function(pKey){this._key = pKey}
}

/** Champ d'affichage de dates de sdernières modif d'une ressource. */
store.ModifDatesField = function(pKey){
	this.fKey = pKey || "dates";
}
store.ModifDatesField.prototype = js.create(areas.Area.prototype, store.mixinShowFieldForArea);
store.ModifDatesField.prototype.buildBody = function(pBd, pContext, pOptions){
	areas.buildLabelFrame(this, pBd, pContext, pOptions);
	pBd.elt("span", "fieldValue");
	this.buildModifInfo(pBd, pContext.nodeInfos.metas.deployDate, pContext.nodeInfos.metas.deployedBy);
	if(pContext.nodeInfos.metas.updateDate) {
		pBd.text(" (métadonnées : ");
		this.buildModifInfo(pBd, pContext.nodeInfos.metas.updateDate, pContext.nodeInfos.metas.updatedBy);
		pBd.text(")");
	}
	return pBd.current();
}
store.ModifDatesField.prototype.buildModifInfo = function(pBd, pDt, pUser) {
	if(!pDt) return;
	pBd.text(this.buildDate(new Date(parseInt(pDt, 10)), new Date()));
	if(pUser) pBd.text(" par "+pUser);
}
store.ModifDatesField.prototype.buildDate = function(pDate, pNow) {
	if (pDate.getYear() == pNow.getYear() && pDate.getMonth() == pNow.getMonth() && pDate.getDate() == pNow.getDate()) return " aujourd\'hui à " + pDate.toLocaleTimeString();
	return pDate.toLocaleString();
}

/** Champ d'affichage du processing d'une ressource. */
store.ShowProcessingField = function(pKey){
	this.fKey = pKey || "showPrc";
}
store.ShowProcessingField.prototype = js.create(areas.Area.prototype, store.mixinShowFieldForArea);
store.ShowProcessingField.prototype.buildBody = function(pBd, pContext, pOptions){
	areas.buildLabelFrame(this, pBd, pContext, pOptions);
	pBd.elt("span", "fieldValue");
	pBd.text(store.getProcessingFromNodeInfos(pContext.nodeInfos).getLabel());
	return pBd.current();
}

/** Retourne un objet Processing par son code. */
store.getProcessing = function(pPrcCode) {
	var vPrc = extPoints.getSvc("prc_" + pPrcCode);
	if(vPrc==null) vPrc = extPoints.getSvc("prc_undefined"); //prc system.
	return vPrc;
}

store.getProcessingFromNodeInfos = function(pNodeInfos) {
	var vPrcCd = pNodeInfos.prc || (pNodeInfos.metas ? pNodeInfos.metas.processing : null);
	if(!vPrcCd && pNodeInfos.path && new store.StPath(pNodeInfos.path).extractLivePath()=="/") vPrcCd = "folder"; //"folder" pour le cas particulier de "/" qui peut ne pas avoir de metas.
	return store.getProcessing(vPrcCd);
}

/**
 *
 */
store.Processing = function(pCode) {
	this.fCode = pCode;
	this.fVersionning = store.Versionning.VCS;
	this.fShowArea = store.Processing.sDefaultLayoutArea;
	this.fInputArea = store.Processing.sDefaultLayoutArea;
}

store.Processing.prototype = {
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

	getExts: function() {
		return this.fExts;
	},

	setExts: function(pExts) {
		this.fExts = pExts;
		return this;
	},

	handleExt: function (pExt) {
		if(pExt==null || this.fExts==null) return false;
		if (this.fExts == "*") return true;
		return this.fExts.indexOf(pExt.toLowerCase()) != -1;
	},

	getIcon: function() {
		if (this.fIcon) return this.fIcon;
		if (this.isFolder())
			return "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/webfrm/-wsk/6.1.10.202401191026/commons/fileIcon/folder.png"
		else
			return "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/webfrm/-wsk/6.1.10.202401191026/commons/fileIcon/default.png"
	},

	setIcon: function(pIcon) {
		this.fIcon = pIcon;
		return this;
	},

	isFolder: function(){
		return this.fIsFolder || false;
	},

	setFolder: function(pIsFolder) {
		this.fIsFolder = pIsFolder;
		return this;
	},

	isVersionnable: function(){
		return this.fVersionning !== store.Versionning.none;
	},

	getVersionning: function(){
		return this.fVersionning;
	},

	/** @deprecated */
	setVersionnable: function(pIsVersionnable) {
		this.fVersionning = pIsVersionnable ? store.Versionning.VCS : store.Versionning.none;
		return this;
	},

	setVersionning: function(pVersionning) {
		this.fVersionning = store.Versionning[pVersionning];
		if( ! this.fVersionning) {
			console.log("Unknown versionning : "+pVersionning+" for processing "+this.getCode());
			this.fVersionning = store.Versionning.none;
		}
		return this;
	},

	/** processing sans content comme folder.*/
	isNoContent: function(){
		return this.fIsNoContent || false;
	},

	setNoContent: function(pIsNoContent) {
		this.fIsNoContent = pIsNoContent;
		return this;
	},

	/** [optional] Area d'organisation des champs en consultation ou d'autres vues. */
	getViewArea : store.Field.prototype.getShowArea,
	setViewArea : store.Field.prototype.setShowArea,

	/** [optional] Area d'organisation des champs d'édition */
	getEditorArea : store.Field.prototype.getInputArea,
	setEditorArea : store.Field.prototype.setInputArea,

	/** Retourne la liste des champs pour ce processing. */
	getListFields : function(){
		if(!this.fListFields) this.fListFields = extPoints.mergeLists(["store:fields:prc:"+this.getCode(), "store:fields:common", "store:fields:system"]);
		return this.fListFields;
	},
	/** Retourne la liste des onglets pour la showRes view. */
	getListShowResTabs : function(){
		if(!this.fListShowResTabs) this.fListShowResTabs = extPoints.mergeLists(["store:showRes:tabs:common", "store:showRes:tabs:prc:"+this.getCode()]);
		return this.fListShowResTabs;
	},

	/**
	 * Construction des propriétés Metas par défaut en fonction du contexte, avant une possible édition de ces champs.
	 *
	 * @param pContext : {
	 *  window
	 *  storeProv
	 *  nodeInfos : [optional] noeud courant à remplacer.
	 *  currentFolderPath : [optional] path du dossier courant (approche UI depot). Inutile si nodeInfos renseigné.
	 *  file [objet File] : [optional]  à uploader en cas de création / maj du content.
	 *  fileName [string] : [optional]  nom du fichier à uploader en cas de création / maj du content.
	 *  propsFromCaller : [optional] propriétés issues du contexte d'appel (filtre / thèmes sélectionnés dans une UI DAM par exemple).
	 * }
	 * @param pCb callback avec pContext en paramètre enrichi de la propriété "defaultProps".
	 */
	buildDefaultProps : function (pContext, pCb, pCbThis){
		//Props "system" : processing, originalName et olderResId.
		pContext.defaultProps = {processing: this.fCode};
		if(pContext.fileName) pContext.defaultProps.originalName = pContext.fileName;
		else if(pContext.file) pContext.defaultProps.originalName = pContext.file.name;
		if(pContext.nodeInfos) {
			pContext.defaultProps.olderResId = pContext.nodeInfos.resId;
			pContext.defaultProps.path = pContext.processing.getVersionning() == store.Versionning.VCS ? pContext.nodeInfos.path : pContext.nodeInfos.permaPath;
		}

		var vCountAsynch = 1001;
		function asynchCb(){
			vCountAsynch--;
			if(vCountAsynch==0) pCb.call(pCbThis, pContext);
		}
		//Props issus des Fields configurés.
		var vFields = this.getListFields();
		for(var i=0; i<vFields.length; i++) {
			if(vFields[i].fillDefaultValue(pContext, asynchCb)) vCountAsynch++;
		}
		vCountAsynch -= 1000;
		asynchCb();
	},

	/**
	 * Construit le contenu d'un éditeur correspondant à ce processing et le layout associé
	 * configurable via pOptions.editorKey.
	 *
	 *  @return une map des éléments Html implémentant l'api InputAreaNode (cf /back/desk/widgets/areas.html).
	 */
	buildBodyEditor : function(pDomBd, pContext, pOptions){
		pDomBd.clear();
		var vLayoutArea = this.getEditorArea(pContext, pOptions);
		if(vLayoutArea) vLayoutArea.buildBody(pDomBd, pContext, pOptions);
		var vFieldAreas = [];
		var vFields = this.getListFields();
		for(var i=0; i < vFields.length; i++) {
			var vArea = vFields[i].getInputArea(pContext, pOptions);
			if(vArea) vFieldAreas.push(vArea);
		}
		return areas.applyLayout(pDomBd, vFieldAreas, pContext, pOptions);
	},

	buildBodyView : function(pDomBd, pContext, pOptions){
		pDomBd.clear();
		var vLayoutArea = this.getViewArea(pContext, pOptions);
		if(vLayoutArea) vLayoutArea.buildBody(pDomBd, pContext, pOptions);
		var vFieldAreas = [];
		var vFields = this.getListFields();
		for(var i=0; i < vFields.length; i++) {
			var vArea = vFields[i].getShowArea(pContext, pOptions);
			if(vArea) vFieldAreas.push(vArea);
		}
		return areas.applyLayout(pDomBd, vFieldAreas, pContext, pOptions);
	},

	toString : function(){
		return "prc:"+this.fCode;
	}

}
store.Processing.sDefaultLayoutArea = new areas.Area("layout").setBuildBody(function(pBd, pContext, pOptions){
	var vRoot = pBd.elt('div', 'inputTable').currentUp();
	vRoot.setAttributeNS("scenari.eu:areaLayout:1.0", "sal:areaIds", "*");
	return vRoot;
});

/**
 * NodeAction : résoud les permissions en fonction de nodeInfos
 * @pContext : nodeInfos
 */
function NodeAction(pId) {
	this.fId = pId;
}
NodeAction.prototype = {
	__proto__ : actions.Action.prototype,
	isEnabled : function (pContext) {
		if(!this.fPerms && scSecurityCtx && pContext.nodeInfos)
			if(!scSecurityCtx.hasPerm(this.fPerms, pContext.nodeInfos.roles))
				return false;
		return actions.Action.prototype.isVisible.call(this, pContext);
	},
	isVisible : function (pContext) {
		if(!this.fVisPerms && scSecurityCtx && pContext.nodeInfos)
			if(!scSecurityCtx.hasPerm(this.fPerms, pContext.nodeInfos.roles))
				return false;
		return actions.Action.prototype.isVisible.call(this, pContext);
	}
}




/**
 * Déclare dans le extPoints toutes les actions par défaut avec un niveau d'autorité 1.
 * @param pWindow Contexte pour le extPoints
 */
store.registerActions_All = function(pWindow){
	pWindow.extPoints.registerSvc("actionStoreMoveToTrash", 1, store.actions.moveToTrash);
	pWindow.extPoints.registerSvc("actionStoreRestoreFromTrash", 1, store.actions.restoreFromTrash);
	pWindow.extPoints.registerSvc("actionStoreRemoveRes", 1, store.actions.removeRes);
	pWindow.extPoints.registerSvc("actionStoreUnlist", 1, store.actions.unlist);
	pWindow.extPoints.registerSvc("actionStoreRelist", 1, store.actions.relist);
}
store.actions = {};

/* Action "moveToTrash"
 * Suppression d'une ressource pour mise en corbeille
 * pContext : actionCb([bool]pSuccess), actionCbThis
 */
store.actions.moveToTrash = new NodeAction("actionStoreMoveToTrash")
	.setGroup("update")
	.setLabel("Mettre en corbeille")
	.setDescription("Mettre en corbeille")
	.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/webfrm/-wsk/6.1.10.202401191026/store/img/trash.png")
	.requirePermission(security.getGPerm("action.depot#trash.resource"));
store.actions.moveToTrash.isVisible = function(pContext) {
	if(pContext.storeProv && !pContext.storeProv.canTrashRes())	return false;
	if(!NodeAction.prototype.isVisible.call(this, pContext)) return false;
	return pContext.nodeInfos && pContext.nodeInfos.t != "moved" && !pContext.nodeInfos.trashed;
}
store.actions.moveToTrash.execute = function(pEvent, pContext) {
	pEvent.stopPropagation();
	var vName = pContext.nodeInfos.n;
	var vPrc = store.getProcessingFromNodeInfos(pContext.nodeInfos);
	if(vPrc && vPrc.getVersionning()===store.Versionning.VCB){
		vName += i18n.formatStr(" (version %s)", pContext.nodeInfos.v);
	}
	if(confirm("Confirmez la suppression de : "+vName)){
		var vPath = pContext.nodeInfos.permaPath || store.buildPath(pContext.browser.fCurrentDatas.permaPath, vName);
		function target4trashCb(pJson, pErr) {
			try{
				if(!pJson) {
					alert("Accès au serveur impossible. Recommencez ultérieurement.");
					console.log(pErr);
					if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, false);
					return;
				}
				if(pJson.path != vPath)  {
					alert("Cette ressource est introuvable.");
					if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, false);
					return;
				} else if(pJson.trashed) {
					alert("Cette ressource est déjà en corbeille.");
					if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, false);
					return;
				}
				var vParams;
				if(!pContext.nodeInfos.resId){
					// Noeud virtuel
					// FIXME : on ne récupère que le processing par approximation.
					// => gérer cette mutation virtuel>normal plutot coté java (nodeInfos n'a pas vocation à fournir toutes les props)
					vParams = "?synch=true&trashed=true&scContent=none&createMetas=true&processing=" + pContext.nodeInfos.prc + "&path=" + encodeURIComponent(vPath);
				}else{
					// Noeud normal
					vParams = "?synch=true&trashed=true&scContent=none&createMetas=true&olderResId=" + pContext.nodeInfos.resId + "&path=" + encodeURIComponent(vPath);
				}
				pContext.storeProv.dialogCid(vParams, null, function(pEvent){
					if (pEvent.target.status >= 400) {
						alert("L\'action a échoué. Recommencez ultérieurement.");
						if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, false);
					} else
					if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, true);
				});
			}catch(e){
				log.debug("store-moveToTrash:: "+e);
				if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, false);
				return false;
			}
		}
		pContext.storeProv.dialogAdminUrlTree(vPath, "nodeInfos&props=path*trashed&persistMetas=&historyProps=", io.jsonXhrCb(target4trashCb, this));

	}
	return false;
}

/* Action "removeRes"
 * Suppression définitive d'une ressource en corbeille
 * pContext : actionCb([bool]pSuccess), actionCbThis
 */
store.actions.removeRes = new NodeAction("actionStoreRemoveRes")
	.setGroup("trash")
	.setDescription("Supprimer définitivement cette ressource")
	.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/webfrm/-wsk/6.1.10.202401191026/store/img/remove.png")
	.requirePermission(security.getGPerm("action.depot#remove.resource"))
	.override("getLabel", function(pContext) {
		var vPrc = store.getProcessingFromNodeInfos(pContext.nodeInfos);
		return (vPrc && vPrc.getVersionning()===store.Versionning.VCB) ? "Supprimer définitivement cette version" : "Supprimer définitivement";
	})
	.override("isVisible", function(pContext) {
		var vCanTrashRes = pContext.storeProv && pContext.storeProv.canTrashRes();
		if(!NodeAction.prototype.isVisible.call(this, pContext)) return false;
		return pContext.nodeInfos && (!vCanTrashRes || pContext.nodeInfos.t == "moved" || pContext.nodeInfos.trashed);
	})
	.override("execute", function(pEvt, pContext){
		pEvt.stopPropagation();
		var vName = pContext.nodeInfos.n;
		var vPrc = store.getProcessingFromNodeInfos(pContext.nodeInfos);
		if(vPrc && vPrc.getVersionning()===store.Versionning.VCB){
			vName += i18n.formatStr(" (version %s)", pContext.nodeInfos.v);
		}
		if(confirm("Confirmez la suppression définitive de : "+vName)){
			var vPath = pContext.nodeInfos.permaPath || store.buildPath(pContext.browser.fCurrentDatas.permaPath, vName);
			var vParams = "?synch=true&scContent=none&createMetas=true&action=remove&path=" + encodeURIComponent(vPath);
			if (pContext.nodeInfos.resId && pContext.nodeInfos.t != "moved") vParams += "&olderResId=" + pContext.nodeInfos.resId;
			pContext.storeProv.dialogCid(vParams, null, function (pEvent) {
				if (pEvent.target.status >= 400) {
					alert("L\'action a échoué. Recommencez ultérieurement.");
					if (pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, false);
				}
				if (pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, true);
			});
		}
	});

/* Action "restoreFromTrash"
 * Restauration d'une ressource en corbeille
 * pContext : actionCb([bool]pSuccess), actionCbThis
 */
store.actions.restoreFromTrash = new NodeAction("actionStoreRestoreFromTrash")
	.setGroup("trash")
	.setLabel("Restaurer depuis la corbeille")
	.setDescription("Restaurer depuis la corbeille")
	.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/webfrm/-wsk/6.1.10.202401191026/store/img/untrash.png")
	.requirePermission(security.getGPerm("action.depot#untrash.resource"))
	.override("isVisible", function(pContext) {
		if(!NodeAction.prototype.isVisible.call(this, pContext)) return false;
		return pContext.nodeInfos && pContext.nodeInfos.resId && pContext.nodeInfos.t != "moved" && pContext.nodeInfos.trashed;
	})
	.override("execute", function(pEvent, pContext) {
		pEvent.stopPropagation();
		var vName = pContext.nodeInfos.n;
		var vPrc = store.getProcessingFromNodeInfos(pContext.nodeInfos);
		if(vPrc && vPrc.getVersionning()===store.Versionning.VCB){
			vName += i18n.formatStr(" (version %s)", pContext.nodeInfos.v);
		}
		if(confirm("Confirmez la restauration de : "+vName)){
			var vPath = pContext.nodeInfos.permaPath || store.buildPath(pContext.browser.fCurrentDatas.permaPath, vName);
			function target4restoreCb(pJson, pErr) {
				try{
					if(!pJson) {
						alert("Accès au serveur impossible. Recommencez ultérieurement.");
						console.log(pErr);
						if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, false);
						return;
					}
					if(pJson.path != vPath)  {
						alert("Cette ressource est introuvable.");
						if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, false);
						return;
					} else if(!pJson.trashed) {
						alert("Cette ressource n\'est plus en corbeille.");
						if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, false);
						return;
					}
					var vParams = "?synch=true&trashed=false&scContent=none&createMetas=true&olderResId=" + pContext.nodeInfos.resId + "&path=" + encodeURIComponent(vPath);
					pContext.storeProv.dialogCid(vParams, null, function(pEvent){
						if (pEvent.target.status >= 400) {
							alert("L\'action a échoué. Recommencez ultérieurement.");
						}
						if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, true);
					});
				}catch(e){
					log.debug("store-restoreFromTrash:: "+e);
					if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, false);
					return false;
				}
			}
			pContext.storeProv.dialogAdminUrlTree(vPath, "nodeInfos&props=path*trashed&persistMetas=&historyProps=", io.jsonXhrCb(target4restoreCb, this));
		}
		return false;
	});


/* Action "unlist"
 * Passage d'une ressource en flag unlisted
 * pContext : actionCb([bool]pSuccess), actionCbThis
 */
store.actions.unlist = new NodeAction("actionStoreUnlist")
	.setGroup("update")
	.setLabel("Masquer la navigation vers cette ressource")
	.setDescription("Masquer la navigation vers cette ressource")
	.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/webfrm/-wsk/6.1.10.202401191026/store/img/unlist.png")
	.requirePermission(security.getGPerm("action.depot#unlist.resource"));
store.actions.unlist.isVisible = function(pContext) {
	if(pContext.storeProv && !pContext.storeProv.canUnlistRes())	return false;
	if(!NodeAction.prototype.isVisible.call(this, pContext)) return false;
	return pContext.nodeInfos && pContext.nodeInfos.t != "moved" && !pContext.nodeInfos.unlisted;
}
store.actions.unlist.execute = function(pEvent, pContext) {
	pEvent.stopPropagation();
	var vName = pContext.nodeInfos.n;
	var vPrc = store.getProcessingFromNodeInfos(pContext.nodeInfos);
	if(vPrc && vPrc.getVersionning()===store.Versionning.VCB){
		vName += i18n.formatStr(" (version %s)", pContext.nodeInfos.v);
	}
	if(confirm("Confirmez la modification (navigation masquée) de : "+vName)){
		var vPath = pContext.nodeInfos.permaPath || store.buildPath(pContext.browser.fCurrentDatas.permaPath, vName);
		function target4unlistCb(pJson, pErr) {
			try{
				if(!pJson) {
					alert("Accès au serveur impossible. Recommencez ultérieurement.");
					console.log(pErr);
					if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, false);
					return;
				}
				if(pJson.path != vPath)  {
					alert("Cette ressource est introuvable.");
					if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, false);
					return;
				} else if(pJson.unlisted) {
					alert("La navigation vers cette ressource est déjà masquée.");
					if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, false);
					return;
				}
				var vParams;
				if(!pContext.nodeInfos.resId){
					// Noeud virtuel
					// FIXME : on ne récupère que le processing par approximation.
					// => gérer cette mutation virtuel>normal plutot coté java (nodeInfos n'a pas vocation à fournir toutes les props)
					vParams = "?synch=true&unlisted=true&scContent=none&createMetas=true&processing=" + pContext.nodeInfos.prc + "&path=" + encodeURIComponent(vPath);
				}else{
					// Noeud normal
					vParams = "?synch=true&unlisted=true&scContent=none&createMetas=true&olderResId=" + pContext.nodeInfos.resId + "&path=" + encodeURIComponent(vPath);
				}
				pContext.storeProv.dialogCid(vParams, null, function(pEvent){
					if (pEvent.target.status >= 400) {
						alert("L\'action a échoué. Recommencez ultérieurement.");
						if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, false);
					} else
					if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, true);
				});
			}catch(e){
				log.debug("store-unlist:: "+e);
				if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, false);
				return false;
			}
		}
		pContext.storeProv.dialogAdminUrlTree(vPath, "nodeInfos&props=path*unlisted&persistMetas=&historyProps=", io.jsonXhrCb(target4unlistCb, this));
	}
	return false;
}



/* Action "relist"
 * Supp du flag unlisted. La ressource peut à nouveaux être listée depuis ses contextes parents
 * pContext : actionCb([bool]pSuccess), actionCbThis
 */
store.actions.relist = new NodeAction("actionStoreRelist")
	.setGroup("update")
	.setLabel("Ne plus masquer la navigation vers cette ressource")
	.setDescription("Ne plus masquer la navigation vers cette ressource")
	.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/webfrm/-wsk/6.1.10.202401191026/store/img/relist.png")
	.requirePermission(security.getGPerm("action.depot#relist.resource"))
	.override("isVisible", function(pContext) {
		if(!NodeAction.prototype.isVisible.call(this, pContext)) return false;
		return pContext.nodeInfos && pContext.nodeInfos.resId && pContext.nodeInfos.t != "moved" && pContext.nodeInfos.unlisted;
	})
	.override("execute", function(pEvent, pContext) {
		pEvent.stopPropagation();
		var vName = pContext.nodeInfos.n;
		var vPrc = store.getProcessingFromNodeInfos(pContext.nodeInfos);
		if(vPrc && vPrc.getVersionning()===store.Versionning.VCB){
			vName += i18n.formatStr(" (version %s)", pContext.nodeInfos.v);
		}
		if(confirm("Confirmez la modification (navigation ré-affichée) de : "+vName)){
			var vPath = pContext.nodeInfos.permaPath || store.buildPath(pContext.browser.fCurrentDatas.permaPath, vName);
			function target4relistCb(pJson, pErr) {
				try{
					if(!pJson) {
						alert("Accès au serveur impossible. Recommencez ultérieurement.");
						console.log(pErr);
						if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, false);
						return;
					}
					if(pJson.path != vPath)  {
						alert("Cette ressource est introuvable.");
						if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, false);
						return;
					} else if(!pJson.unlisted) {
						alert("La navigation vers cette ressource n\'est plus masquée.");
						if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, false);
						return;
					}
					var vParams = "?synch=true&unlisted=false&scContent=none&createMetas=true&olderResId=" + pContext.nodeInfos.resId + "&path=" + encodeURIComponent(vPath);
					pContext.storeProv.dialogCid(vParams, null, function(pEvent){
						if (pEvent.target.status >= 400) {
							alert("L\'action a échoué. Recommencez ultérieurement.");
						}
						if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, true);
					});
				}catch(e){
					log.debug("store-relist:: "+e);
					if(pContext.actionCb) pContext.actionCb.call(pContext.actionCbThis, false);
					return false;
				}
			}
			pContext.storeProv.dialogAdminUrlTree(vPath, "nodeInfos&props=path*unlisted&persistMetas=&historyProps=", io.jsonXhrCb(target4relistCb, this));
		}
		return false;
	});