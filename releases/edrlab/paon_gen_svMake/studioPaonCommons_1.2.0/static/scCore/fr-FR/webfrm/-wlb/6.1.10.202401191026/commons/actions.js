/*
 * LICENCE[[
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1/CeCILL 2.O 
 *
 * The contents of this file are subject to the Mozilla Public License Version 
 * 1.1 (the "License"); you may not use this file except in compliance with 
 * the License. You may obtain a copy of the License at http://www.mozilla.org/MPL/ 
 * 
 * Software distributed under the License is distributed on an "AS IS" basis, 
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License 
 * for the specific language governing rights and limitations under the 
 * License. 
 * 
 * The Original Code is kelis.fr code. 
 * 
 * The Initial Developer of the Original Code is 
 * sylvain.spinelli@kelis.fr 
 * 
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved. 
 * 
 * Contributor(s): 
 * 
 * 
 * Alternatively, the contents of this file may be used under the terms of 
 * either of the GNU General Public License Version 2 or later (the "GPL"), 
 * or the GNU Lesser General Public License Version 2.1 or later (the "LGPL"), 
 * or the CeCILL Licence Version 2.0 (http://www.cecill.info/licences.en.html), 
 * in which case the provisions of the GPL, the LGPL or the CeCILL are applicable 
 * instead of those above. If you wish to allow use of your version of this file 
 * only under the terms of either the GPL or the LGPL, and not to allow others 
 * to use your version of this file under the terms of the MPL, indicate your 
 * decision by deleting the provisions above and replace them with the notice 
 * and other provisions required by the GPL or the LGPL. If you do not delete 
 * the provisions above, a recipient may use your version of this file under 
 * the terms of any one of the MPL, the GPL, the LGPL or the CeCILL.
 * ]]LICENCE
 */

/**
 * Gestion des actions Scenari.
 * 
 * Une action est objet javascript décrivant une action possible et permettant d'exécuter cette action.
 * 
 * Une action a besoin d'un "actionContext" pour être affiché et exécuté. L'actionContext 
 * est un objet possédant à minima une propriété "window" faisant référence à la fenêtre en cours.
 * Lorsque l'action concerne un objet plus précis (un item d'une liste, etc...) l'actionContext 
 * doit être enrichi de propriétés supplémentaires. Chaque action doit documenter les propriétés
 * du contextAction nécessaires à son bon fonctionnement.
 * 
 * Les racoucis-claviers (accelKey) sont gérés par une ou plusieurs instance(s) de la 
 * classe actions.AccelKeyMgr. Un accelKeyMgr gère l'association entre un racourci clavier
 * et une action. Plusieurs racourcis peuvent être associés à un même action.
 * 
 * Pour permettre l'affichage automatique d'un racourci clavier dans la construction des
 * menus, l'actionContext doit posséder une propriété supplémentaire "accelKeyMgr".
 * 
 * @dependances commons/commons.js commons/extPoints.js
 * 
 */

var actions = {};

/**
 * Classe de base pour les objets Action.
 * 
 * Chaque action possède :
 * - les propriétés pour spécifier un bouton ou un item de menu (label, icon, etc.),
 * - les propriétés pour afficher/masquer et activer/désactiver le bouton ou item de menu,
 * - la fonction pour executer l'action.
 */
actions.Action = function(pId){
	this.fId = pId;
}
actions.Action.prototype = {
	
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
	
	getShortLabel : function(pContext){
		return (typeof this.fShortLabel === 'function') ? this.fShortLabel.apply(this, arguments): ("fShortLabel" in this) ? this.fShortLabel : this.getLabel(pContext);
	},
	setShortLabel : function(pLabel){
		this.fShortLabel = pLabel;
		return this;
	},
	
	/**
	 * Ajoute une ou plusieures permission à l'ensemble des permissions sans lesquelles 
	 * l'action ne peut s'exécuter (impacte la propriété Enabled).
	 * 
	 * @param pPermList Tableau de permissions ou permission seule à ajouter à l'ensemble
	 * 			si pPermList est null, alors aucune erreur n'est retournée
	 * @return this
	 */
	requirePermission : function (pPermList) {
		if(pPermList){
			if(Array.isArray(pPermList)) {
				for (var i=0; i<pPermList.length; i++) this.requirePermission(pPermList[i]); 
				return this;
			}
			if (!this.fPerms) this.fPerms = [];
			if (this.fPerms.indexOf(pPermList) == -1) this.fPerms.push(pPermList);
		}
		return this;
	},
	
	/**
	 * Ajoute une ou plusieures permission à l'ensemble des permissions sans lesquelles 
	 * l'action ne peut s'afficher (impacte la propriété Visible).
	 * 
	 * @param pPermList Tableau de permissions ou permission seule à ajouter à l'ensemble
	 * 			si pPermList est null, alors aucune erreur n'est retournée
	 * @return this
	 */
	requireVisiblePerm : function (pPermList) {
		if(pPermList){
			if(Array.isArray(pPermList)) {
				for (var i=0; i<pPermList.length; i++) this.requireVisiblePerm(pPermList[i]); 
				return this;
			}
			if (!this.fVisPerms) this.fVisPerms = [];
			if (this.fVisPerms.indexOf(pPermList) == -1) this.fVisPerms.push(pPermList);
		}
		return this;
	},
	
	/*
	 * Description de l'action : exploité en tooltip lorsque celà est possible
	 * @type string
	 */
	setDescription: function (pDescription) {
		this.fDescription = pDescription;
		return this;
	},
	getDescription: function (pContext) {
		return (typeof this.fDescription === 'function') ? this.fDescription.apply(this, arguments): this.fDescription;
	},
	
	getIcon : function(pContext){
		return (typeof this.fIcon === 'function') ? this.fIcon.apply(this, arguments): this.fIcon;
	},
	setIcon : function(pIcon){
		this.fIcon = pIcon;
		return this;
	},
	
	getGroup : function(pContext){
		return (typeof this.fGroup === 'function') ? this.fGroup.apply(this, arguments): this.fGroup;
	},
	setGroup : function(pGroup){
		this.fGroup = pGroup;
		return this;
	},
	/* Recherche le score d'affichage affecté à cette action de façon asynchron,
	 * et affecte le display score avec le resultat obtenu
	 * @param pContext
	 * @param pCb(pDisplayScore)
	 * @param pCbThis
	 */
	findDisplayScore : function(pContext, pCb, pCbThis){
		var vAction = this;
		if(pCb) pCb.call(pCbThis, vAction.fDisplayScore!=null ? vAction.fDisplayScore : -Infinity);
	},
	setDisplayScore : function(pDisplayScore){
		this.fDisplayScore = pDisplayScore;
		return this;
	},
	
	isVisible : function(pContext){
		if(typeof this.fVisible === 'function') return this.fVisible.apply(this, arguments);
		if(this.fVisible==false) return false;
		return this.checkObjectRootVisiblePerm(pContext);
	},
	setVisible : function(pVisible){
		this.fVisible = pVisible;
		return this;
	},
	
	isEnabled : function(pContext){
		if(typeof this.fEnabled === 'function') return this.fEnabled.apply(this, arguments);
		if(this.fEnabled==false) return false;
		return this.checkObjectRootPerm(pContext);
	},
	setEnabled : function(pEnabled){
		this.fEnabled = pEnabled;
		return this;
	},
	
	/**
	 * Teste les permissions de l'action sur l'objectRoot.
	 * 
	 * @param pContext Le contexte de l'action
	 * @param pPermList [optionnel] Liste des permissions ou permission seule à tester
	 * @return true si les rôles du contexte de sécurité ont la ou les permissions 
	 */
	checkObjectRootPerm : function (pContext, pPermList) {
		var vPermList = pPermList || this.fPerms;
		if(!vPermList) return true;
		var vScSecurityCtx = pContext.scSecurityCtx || pContext.window.scSecurityCtx;
		if(!vScSecurityCtx) return true;
		return vScSecurityCtx.hasPermForObjectRoot(vPermList);
	},
	
	/**
	 * Teste les permissions de visibilité de l'action sur l'objectRoot.
	 * 
	 * @param pContext Le contexte de l'action
	 * @param pPermList [optionnel] Liste des permissions ou permission seule à tester
	 * @return true si les rôles du contexte de sécurité ont la ou les permissions 
	 */
	checkObjectRootVisiblePerm : function (pContext, pPermList) {
		var vPermList = pPermList || this.fVisPerms;
		if(!vPermList) return true;
		var vScSecurityCtx = pContext.scSecurityCtx || pContext.window.scSecurityCtx;
		if(!vScSecurityCtx) return true;
		return vScSecurityCtx.hasPermForObjectRoot(vPermList);
	},
	
	/**
	 * Méthode utilitaire pour controler si l'action peut être executée,
	 * à savoir si l'action est visible et active.
	 */
	isAvailable : function(pContext){
		return this.isVisible(pContext) && this.isEnabled(pContext);
	},
	
	/**
	 * Retourne true si cette action doit prendre la forme d'un menu.
	 */
	isMenu : function(pContext){
		return false;
	},
	
	/**
	 * Permet à l'action d'enrichir le bouton (noeud DOM) avec des propriétés particulières non gérées en standard.
	 */
	initButtonNode : function(pButtonNode, pContext){	
	},
	
	/**
	 * Exécute l'action.
	 */
	execute : function(pEvent, pContext){
		log.info("Action.execute() method not overridden : "+this.getId());
	},
	
	/**
	 * Exécute l'action si elle est permise (visible et enabled).
	 */
	executeIfAllowed : function(pEvent, pContext){
		if(this.isAvailable(pContext)) {
			this.execute(pEvent, pContext);
			return true;
		}
		return false;
	},
	
	override : function(pName, pVal){
		this[pName] = pVal;
		return this;
	},
	
	toString : function(){
		return this.fId;
	}

};

/**
 * Wrapper d'une action.
 * L'action wrappée peut être initialisée par setOverridenSvc() via le mécanisme de surcharge
 * des svc des extPoints ou appelé explicitement.
 * La méthode getWrappedAction(pContext) peut aussi être surchargée.
 */
actions.ActionWrapper = function(pId){
	this.fId = pId;
}
actions.ActionWrapper.NULL = new actions.Action("#NULL");
actions.ActionWrapper.NULL.isVisible = actions.ActionWrapper.NULL.isEnabled = function(pCtx){return false;}
actions.ActionWrapper.prototype = js.create(actions.Action.prototype, {
	/** 
	 * Doit renvoyer actions.ActionWrapper.NULL si pas de wrappedAction.
	 */
	getWrappedAction : function(pContext) {
		return this.fWrappedAction || actions.ActionWrapper.NULL;
	},
	
	/** Méthode utilisée par ExtPoints.getSvc() pour affecter le svc surchargé avant de retourner le svc surchargeant. */
	setOverridenSvc : function(pSvc) {
		this.fWrappedAction = pSvc;
		return this;
	},
	
	getLabel : function(pContext){
		return ("fLabel" in this) ? actions.Action.prototype.getLabel.apply(this, arguments) : this.getWrappedAction(pContext).getLabel();
	},
	
	getShortLabel : function(pContext){
		return ("fShortLabel" in this) ? actions.Action.prototype.getShortLabel.apply(this, arguments) : this.getWrappedAction(pContext).getShortLabel();
	},
	
	getDescription : function(pContext){
		return ("fDescription" in this) ? actions.Action.prototype.getDescription.apply(this, arguments) : this.getWrappedAction(pContext).getDescription();
	},
	
	getIcon : function(pContext){
		return ("fIcon" in this) ? actions.Action.prototype.getIcon.apply(this, arguments): this.getWrappedAction(pContext).getIcon();
	},
	
	getGroup : function(pContext){
		return ("fGroup" in this) ? actions.Action.prototype.getGroup.apply(this, arguments) : this.getWrappedAction(pContext).getGroup();
	},
	
	isVisible : function(pContext){
		if("fVisible" in this) return actions.Action.prototype.isVisible.apply(this, arguments);
		if( ! this.checkObjectRootVisiblePerm(pContext)) return false;
		return this.getWrappedAction(pContext).isVisible(pContext);
	},
	
	isEnabled : function(pContext){
		if("fEnabled" in this) return actions.Action.prototype.isEnabled.apply(this, arguments);
		if( ! this.checkObjectRootPerm(pContext)) return false;
		return this.getWrappedAction(pContext).isEnabled(pContext);
	},
	
	isMenu : function(pContext){
		return this.getWrappedAction(pContext).isMenu(pContext);
	},

	initButtonNode : function(pButtonNode, pContext){	
		this.getWrappedAction(pContext).initButtonNode(pButtonNode, pContext);
	},

	execute : function(pEvent, pContext){
		this.getWrappedAction(pContext).execute(pEvent, pContext);
	}
});

/**
 * Wrapper d'une action obtenue dynamiquement via un svc d'un extPoints.
 * La méthode setWrappedSvc(pSvcCd) permet d'initialiser ce wrapper.
 */
actions.SvcActionWrapper = function(pId){
	this.fId = pId;
}

actions.SvcActionWrapper.prototype = js.create(actions.ActionWrapper.prototype, {
	getWrappedSvcCd : function(){
		return this.fSvcCd;
	},
	setWrappedSvcCd : function(pSvcCd){
		this.fSvcCd = pSvcCd;
		return this;
	},
	
	getWrappedAction : function(pContext) {
		if(!pContext) {
			log.debug("actions.SvcActionWrapper.getWrappedAction(pContext) :: pContext is "+pContext);
			return actions.ActionWrapper.NULL;
		}
		return (pContext.extPoints || (pContext.window ? pContext.window.extPoints : extPoints)).getSvc(this.fSvcCd) || actions.ActionWrapper.NULL;
	}
});


/**
 * La classe IsoActions regroupe un ensemble d'actions iso-fonctionnelles correspondant à une seule action
 * vue d'un menu ou d'un racourci clavier mais impliquant diverses implémentations en fonction du contexte.
 * La liste des sous-actions est définie par une liste extPoints. L'ordre des actions dans la liste est importante
 * car la première action isAvailable() sera choisie (ou à défaut la 1ère isVisible()).
 * 
 */
actions.IsoActions = function(pId){
	this.fId = pId;
}

actions.IsoActions.prototype = js.create(actions.Action.prototype, {
	
	getActionsList : function(pContext){
		return this.fActionsList;
	},
	
	setActionsList : function(pActionsList){
		this.fActionsList = pActionsList;
		return this;
	},
	
	getLabel : function(pContext){
		if("fLabel" in this) return this.fLabel;
		var vSubAction = this.xSelectSubAction(pContext);
		return vSubAction ? vSubAction.getLabel(pContext) : this.fId;
	},
	
	getIcon : function(pContext){
		if("fIcon" in this) return this.fIcon;
		var vSubAction = this.xSelectSubAction(pContext);
		return vSubAction ? vSubAction.getIcon(pContext) : null;
	},
	
	isVisible : function(pContext){
		return this.xSelectSubAction(pContext) != null;
	},
	
	isEnabled : function(pContext){
		return this.xSelectSubAction(pContext, true) != null;
	},
	
	isAvailable : function(pContext){
		return this.xSelectSubAction(pContext, true) != null;
	},
	execute : function(pEvent, pContext){
		var vSubAction = this.xSelectSubAction(pContext, true);
		if(vSubAction) vSubAction.execute(pEvent, pContext);
	},
	
	xSelectSubAction : function(pContext, pOnlyIfAvailable){
		var vList = this.xGetList(pContext);
		var vFirstVisible = null;
		for(var i=0; i < vList.length; i++) {
			var vSubAction = vList[i];
			if(vSubAction.isVisible(pContext)) {
				vFirstVisible = vSubAction;
				if(vSubAction.isEnabled(pContext)) return vSubAction;
			}
		}
		return pOnlyIfAvailable ? null : vFirstVisible;
	},
	xGetList : function(pContext){
		if(!this.fActionsList) return [];
		return pContext.window.extPoints.getList(this.fActionsList) || [];
	}
});


/**
 * Tri un tableau d'actions en les regroupant pas "group" des actions.
 * L'ordre de tri des groupes eux-mêmes est spécifié dans pGroupsOrder.
 * 
 * @param pActions Tableau JS d'objets de type Action à trier.
 * @param pGroupsOrder String représentant l'ordre des groupes séparés par des espaces, 
 * 			"*" pour spécifier le point d'insertion des des groupes inconnus : 
 * 			Exemple: "group1 group2 * groupEnd"
 * 			
 */
actions.orderActionsByGroup = function(pActions, pGroupsOrder, pContext) {
	var vFreeOffset = 1;
	//vGroups : associe un Idx à chaque groupe
	var vGroups = {};
	if(pGroupsOrder && pGroupsOrder!="*") {
		var vGroupsOrder = pGroupsOrder.split(" ");
		var vGroupIdx = 2;
		for(var i = 0; i< vGroupsOrder.length; i++) {
			if(vGroupsOrder[i] == "*") {
				//Point d'insertion des groupes inconnus
				vFreeOffset = vGroupIdx;
				vGroupIdx += 1000000;
			} else {
				vGroups[vGroupsOrder[i]] = vGroupIdx++;
			}
		}
		if(vFreeOffset==1) vFreeOffset = vGroupIdx;
	}
	function sortActions(pAction1, pAction2){
		var vGroup1 = pAction1.getGroup(pContext) || "#none";
		var vGroup2 = pAction2.getGroup(pContext) || "#none";
		var vIdx1 = vGroups[vGroup1];
		var vIdx2 = vGroups[vGroup2];
		if(!vIdx1) {
			vIdx1 = vFreeOffset++;
			vGroups[vGroup1] = vIdx1;
		}
		if(!vIdx2) {
			vIdx2 = vFreeOffset++;
			vGroups[vGroup2] = vIdx2;
		}
		return vIdx1 - vIdx2;
	}
	pActions.sort(sortActions);
}

/**
 * Tri asynchrone un tableau d'actions selon leur display score décroissant en réinterrogeant son findDisplayScore
 * 
 * @param pActions Tableau JS d'objets de type Action à trier.
 * @param pContext
 * @param pCb(pActions)
 * @param pCbThis
 * @param pMin : borne min du score des actions retenues (incluse)
 * @param pMax : borne max du score des actions retenues (incluse)
 */
actions.orderActionsByDisplayScore = function(pActions, pContext, pCb, pCbThis, pMin, pMax) {
	// Recherche du displayScore si la fonction findDisplayScore est présente
	var vMin = pMin ? pMin : -Infinity;
	var vMax = pMax ? pMax : +Infinity;
	var vAsyncSearchPending = pActions.length;
	var vFilteredActionList = [];
	for (var i=0; i<pActions.length; i++) {
		var vAction = pActions[i];
		var vCb = function(pScore){
			//log.info("orderActionsByDisplayScore :: "+this.getLabel() + " - "+pScore);
			this.fDisplayScore = pScore;
			if(pScore>=vMin && pScore<=vMax){
				vFilteredActionList.push(this);
			}
			vAsyncSearchPending--;
			// Fin de traitement : Tous les scores ont été calculés
			if(vAsyncSearchPending==0){
				function sortActions(pAction1, pAction2){
					var vScore1 = pAction1.fDisplayScore;
					var vScore2 = pAction2.fDisplayScore;
					return vScore2 - vScore1;
				}
				vFilteredActionList.sort(sortActions);
				if(pCb) pCb.call(pCbThis, vFilteredActionList)
			}
		}
		vAction.findDisplayScore(pContext, vCb, vAction);
	}
}

/**
 * TODO xul -> html
 * Passe en revue les xul:menu / xul:menuitem et xul:toolbar / xul:toolbarbutton contenus dans pParentElt pour gérer
 * l'insertion / suppression automatique des séparators en fonction des attributs "group".
 */
actions.injectMenuSeparators = function(pParentElt){
	var vSepAllowed = false;
	var vLastGroup = "";
	var vItem = pParentElt.firstElementChild;
	var vFoundSep = null;
	checkItem:
	while(vItem) {
		if(vItem.namespaceURI==dom.XULNS && ! vItem.collapsed) switch(vItem.localName) {
			case "toolbar" :
			case "toolbarbutton" :
			case "menu" :
			case "menuitem" :
				var vIsVisible = vItem.style.display != "none" && !vItem.collapsed;
				if(vIsVisible){
					if(vSepAllowed) {
						var vSeparatorTagName = (vItem.localName=="toolbar" || vItem.localName=="toolbarbutton") ? "toolbarseparator" : "menuseparator";
						var vNewGroup = vItem.getAttribute("group") || "";
						if(vNewGroup != vLastGroup) {
							if(!vFoundSep) {
								//pas de sépararteur trouvé
								pParentElt.insertBefore(pParentElt.ownerDocument.createElementNS(dom.XULNS, vSeparatorTagName), vItem);
							} else {
								//on préserve le séparateur trouvé
								vFoundSep = null;
							}
							vSepAllowed = true;
							vLastGroup = vNewGroup;
						}
					} else {
						vLastGroup = vItem.getAttribute("group") || "";
						vSepAllowed = true;
					}
					if(vFoundSep) {
						pParentElt.removeChild(vFoundSep);
						vFoundSep = null;
					}
				}
				break;
			case "toolbarseparator" :
			case "menuseparator" :
				if(vFoundSep) {
					//2ème séparator successif, on vire.
					var vSep = vItem;
					vItem = vItem.nextElementSibling;
					pParentElt.removeChild(vSep);
					continue checkItem;
				} else {
					vFoundSep = vItem;
				}
				break;
			default: //autre balise ?
				break;
		}
		vItem = vItem.nextElementSibling;
	}
	if(vFoundSep) pParentElt.removeChild(vFoundSep);
}

