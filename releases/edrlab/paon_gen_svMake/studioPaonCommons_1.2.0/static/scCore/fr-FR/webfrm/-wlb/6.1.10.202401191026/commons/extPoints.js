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
 * Portions created by the Initial Developer are Copyright (C) 2009
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
 * Gestion centralisée des points d'extensions dans un scope donné (généralement l'objet window).
 * 
 * Les points d'extensions sont de différentes natures :
 * <ul>
 * <li>Pref : Simples valeurs (string, int, bolean). 
 * 		Syntaxe des codes de prefs : "aaa.bbb.ccc".
 * <li>List : Liste ordonnée d'objets JS. Chaque entrée dans la liste possède un code (CdEntry) et peut donc 
 * 		être surchargé individuellement.
 * 		Syntaxe des codes de listes : "aaa:bbb:ccc".
 * 		Syntaxe des codes des entrées de listes : "aaaBbbCcc".
 * <li>Svc : Service, ie un objet JS singleton (object, function ou class). 
 * 		Un Svc est chargé à l'init, accessible en synchrone.
 * 		Syntaxe des codes de Svc en camelCase : "aaaBbbCcc".
 * <li>SvcLazy : Svc dont le chargement a lieu à la 1ère utilisation.
 * 		Son accès est donc toujours asynchone par une callback.
 * 		Svc et SvcLazy partagent le même espace de noms ().
 * 		Tout Svc peut-etre accédé via getSvcLazy().
 * 		Tout SvcLazy peut-être accédé via getSvc() si on est sûr qu'il a déjà été chargé une 1ère fois.
 * </ul>
 * 
 * Les points d'extension sont déclarés avec un niveau d'autorité (LevelAuthority).
 * Le LevelAuthority permet de préserver uniquement la déclaration du point d'extension avec le niveau le plus élevé.
 * L'ordre chronologique de déclaration des surcharges d'un extPoint n'est donc pas important (avant sa 1ère utilisation). 
 * 
 * Des sous-contexte peuvent être définis permettant de surcharger / enrichir un extPoints parent dans un sous-contexte
 * (iframe, sur-fenetre...). Les modifications apportées à l'extPoints de ce sous-contexte restent localisées à celui-ci
 * tout en bénéficiant des caractéristiques du contexte parent. Les sous-contextes sont récurisifs et
 * peuvent donc constituer un arbre de sous-contextes.
 * 
 * Utitlisation :
 * après l'import du js, appeler :
 * extPoints.initAsRoot()
 * ou pour récupérer l'extPoints de la window parent ou appelante :
 * extPoints.initAsSubExtPoints()
 * ou plus spécifiquement : 
 * extPoints.initAsSubExtPoints(vExtPoints)
 * 
 * @dependances commons/commons.js
 */


(function(window){

/**
 * Construteur de l'ExtPoints
 */
function ExtPoints(){
	//Données internes
	this.fPrefLevels = {};
	this.fPrefs = {};
	this.fLists = {};
	this.fSvcs = {};
	this.fLibs = {};
	this.fRoles = {};
	/* Role ~default
	 * 	> porte le paramétrage applicatif via le systeme de droits
	 *  > role utilisé qd le contexte ne gère pas de droits (chain, home, ...)
	 */
	var vDefaultRole = typeof security === 'undefined' ? "~default" : security.defaultRoleName;
	// La définition du rôle doit etre en phase avec le backend java (eu.scenari.commons.extpoints.ExtPoints.ExtPoints)
	this.addRolePermList ({ role: vDefaultRole, title: vDefaultRole, priority:0, allow:["DO", "DATA"] }, 0);
}

ExtPoints.prototype = {
	
	
	
	//############################ Affectations des extPoints #############################
	
	/**
	 * Affecte la valeur à une pref pour un certain niveau d'autorité.
	 * Le format des codes des prefs est de type "aaa.bbb.ccc".
	 * 
	 * @param pCd Code de la pref à affecter.
	 * @param pLevelAuthority Niveau d'autorité associée à cette affectation.
	 * @param pValue Valeur à associer à la pref (string, number, boolean ou null)
	 * @param pOverwriteParent [Optionnel] utilisé uniquement par les SubExtPoints pour écraser la valeur 
	 * 				de l'extPoints parent quelquesoit le niveau d'autorité.
	 * @return true si la valeur a été prise en compte, false si une valeur de niveau supérieur ou égal existe déjà.
	 */
	setPref : function(pCd, pLevelAuthority, pValue, pOverwriteParent){
		var vCurrentLevel = this.fPrefLevels[pCd];
		if(vCurrentLevel==null || vCurrentLevel < pLevelAuthority) {
			this.fPrefLevels[pCd] = pLevelAuthority;
			this.fPrefs[pCd] = pValue;
			return true;
		}
		return false;
	},
	
	/**
	 * Déclare une nouvelle entrée dans une liste pour un certain niveau d'autorité.
	 * 
	 * @param pCdList Code la liste dans laquelle ajouter l'entrée.
	 * @param pCdEntry Code de l'entrée dans la liste.
	 * @param pLevelAuthority Niveau d'autorité associée à cette affectation.
	 * @param pValueEntry Valeur de l'entrée, null est autorisé et élimine l'entrée de la liste. 
	 * @param pSortKey Clé pour trier la liste, 0 par défaut.
	 * @param pOverwriteParent [Optionnel] utilisé uniquement par les SubExtPoints pour écraser la valeur 
	 * 				de l'extPoints parent quelquesoit le niveau d'autorité.
	 * @return true si la valeur a été prise en compte, false si une valeur de niveau supérieur ou égal existe déjà.
	 */
	addToList : function(pCdList, pCdEntry, pLevelAuthority, pValueEntry, pSortKey, pOverwriteParent){
		var vList = this.fLists[pCdList];
		if( ! vList) {
			vList = this.fLists[pCdList] = {};
		}
		var vEntry = vList[pCdEntry];
		if(!vEntry || vEntry.fLevel < pLevelAuthority) {
			vList[pCdEntry] = {
				fLevel : pLevelAuthority,
				fCd : pCdEntry,
				fValue : pValueEntry,
				fSortKey : pSortKey || 0
			}
			return true;
		}
		return false;
	},
	
	/**
	 * Déclare une nouvelle entrée sous forme de redisrection vers un svc
	 * dans une liste pour un certain niveau d'autorité.
	 * 
	 * @param pCdList Code la liste dans laquelle ajouter l'entrée.
	 * @param pCdEntry Code de l'entrée dans la liste correspondant au code de service.
	 * @param pLevelAuthority Niveau d'autorité associée à cette affectation.
	 * @param pCdSvc Code du service pointé, null est autorisé et élimine l'entrée de la liste. 
	 * @param pSortKey Clé pour trier la liste, 0 par défaut.
	 * @param pOverwriteParent [Optionnel] utilisé uniquement par les SubExtPoints pour écraser la valeur 
	 * 				de l'extPoints parent quelquesoit le niveau d'autorité.
	 * @return true si la valeur a été prise en compte, false si une valeur de niveau supérieur ou égal existe déjà.
	 */
	addSvcToList : function(pCdList, pCdEntry, pLevelAuthority, pCdSvc, pSortKey, pOverwriteParent){
		var vList = this.fLists[pCdList];
		if( ! vList) {
			vList = this.fLists[pCdList] = {};
		}
		var vEntry = vList[pCdEntry];
		if(!vEntry || vEntry.fLevel < pLevelAuthority) {
			vList[pCdEntry] = {
				fLevel : pLevelAuthority,
				fCd : pCdEntry,
				fCdSvc : pCdSvc,
				fValue : pCdSvc!=null ? REDIRECT_TO_SVC : null,
				fSortKey : pSortKey || 0
			}
			return true;
		}
		return false;
	},
		
	/**
	 * Déclare un service pour un certain niveau d'autorité.
	 * 
	 * @param pCd Code du service.
	 * @param pLevelAuthority Niveau d'autorité associée à cette affectation.
	 * @param pSvc Objet JS correspondant à ce service.
	 * @param pOverwriteParent [Optionnel] utilisé uniquement par les SubExtPoints pour écraser la valeur 
	 * 				de l'extPoints parent quelquesoit le niveau d'autorité.
	 * @return true si ce svc a été pris en compte, false si un svc de niveau supérieur ou égal existe déjà.
	 */
	registerSvc : function(pCd, pLevelAuthority, pSvc, pOverwriteParent) {
		var vSvcDef = this.fSvcs[pCd];
		if(!vSvcDef || vSvcDef.fLevel < pLevelAuthority) {
			this.fSvcs[pCd] = {
				fSvc : pSvc,
				fLevel : pLevelAuthority
			}
			return true;
		} else if("fOverride" in vSvcDef) {
			return this.xInsertSvcInOverrideChain(vSvcDef, pSvc, pLevelAuthority);
		}
		return false;
	},
	
	/**
	 * Déclare un service pour un certain niveau d'autorité qui est un wrapper 
	 * du Svc de niveau d'autorité inférieur.
	 * Ces Svc de type surcharge *doivent* avoir une méthode setOverridenSvc(pSvc) qui sera
	 * appelé à chaque récupération de ce service via getSvc(pCd).
	 * 
	 * @param pCd Code du service.
	 * @param pLevelAuthority Niveau d'autorité associée à cette affectation.
	 * @param pSvc Objet JS correspondant à ce service.
	 * @param pOverwriteParent [Optionnel] utilisé uniquement par les SubExtPoints pour écraser la valeur 
	 * 				de l'extPoints parent quelquesoit le niveau d'autorité.
	 * @return true si ce svc a été pris en compte, false si un svc de niveau supérieur ou égal existe déjà.
	 */
	overrideSvc : function(pCd, pLevelAuthority, pSvc, pOverwriteParent) {
		var vSvcDef = this.fSvcs[pCd];
		if(!vSvcDef || vSvcDef.fLevel < pLevelAuthority) {
			this.fSvcs[pCd] = {
				fSvc : pSvc,
				fLevel : pLevelAuthority,
				fOverride : vSvcDef
			}
			return true;
		} else if("fOverride" in vSvcDef) {
			return this.xInsertSvcInOverrideChain(vSvcDef, pSvc, pLevelAuthority, true);
		}
		return false;
	},
	
	/**
	 * Déclare un service lazy pour un certain niveau d'autorité par une url d'une librairie qui sera
	 * chargée à la 1ère demande.
	 * 
	 * Une lib ne peut contenir qu'un seul service et doit être de la forme : 
	 * extPoints.initSvcLazy(pCdSvc, {...});
	 * 
	 * @param pCd Code du service.
	 * @param pLevelAuthority Niveau d'autorité associée à cette affectation.
	 * @param pUrlLib URL de la librairie à charger.
	 * @param pOverwriteParent [optionnel] utilisé uniquement par les SubExtPoints pour écraser la valeur 
	 * 				de l'extPoints parent quelquesoit le niveau d'autorité.
	 * @return true si ce svc a été pris en compte, false si un svc de niveau supérieur ou égal est déjà déclaré.
	 */
	registerSvcLazy : function(pCd, pLevelAuthority, pUrlLib, pOverwriteParent) {
		var vSvcDef = this.fSvcs[pCd];
		if(!vSvcDef || vSvcDef.fLevel < pLevelAuthority) {
			this.fSvcs[pCd] = {
				fUrlLib : pUrlLib,
				fLevel : pLevelAuthority
			}
			return true;
		} else if("fOverride" in vSvcDef) {
			return this.xInsertSvcLazyInOverrideChain(vSvcDef, pUrlLib, pLevelAuthority);
		}
		return false;
	},
	
	
	/**
	 * Déclare un service lazy pour un certain niveau d'autorité qui est un wrapper 
	 * du Svc de niveau d'autorité inférieur.
	 * Ces Svc de type surcharge *doivent* avoir une méthode setOverridenSvc(pSvc) qui sera
	 * appelé à chaque récupération de ce service via getSvc(pCd).
	 * 
	 * @see #registerSvcLazy(pCd, pLevelAuthority, pUrlLib, pOverwriteParent).
	 */
	overrideSvcLazy : function(pCd, pLevelAuthority, pUrlLib, pOverwriteParent) {
		var vSvcDef = this.fSvcs[pCd];
		if(!vSvcDef || vSvcDef.fLevel < pLevelAuthority) {
			this.fSvcs[pCd] = {
				fUrlLib : pUrlLib,
				fLevel : pLevelAuthority,
				fOverride : vSvcDef
			}
			return true;
		} else if("fOverride" in vSvcDef) {
			return this.xInsertSvcLazyInOverrideChain(vSvcDef, pUrlLib, pLevelAuthority, true);
		}
		return false;
	},
	
	/** Méthode à appeler dans une lib pour initialiser le svcLazy.
	 * @see extPoints.registerSvcLazy(pCd, pLevelAuthority, pUrlLib, pOverwriteParent)
	 */
	initSvcLazy : function(pCd, pSvc) {
		var vSvcDef = this.fSvcsLoading ? this.fSvcsLoading[pCd] : null;
		if(vSvcDef && vSvcDef.fCbs) {
			//un chargement est bien en attente (pour ce override svcDef précis, quelquesoit l'override).
			vSvcDef.fSvc = pSvc;
			return true;
		}
		return false;
	},
	
	/**
	 * Ajoute ou surcharge un ou plusieurs rôles dans cet extPoints.
	 * Chaque propriété du role et chaque permission sont associés au niveau d'autorité pLevelAuthority.
	 * Il est donc possible de surcharger précisément une propriété d'un role ou un triplet role-perm-access
	 * (le tableau "erase" n'est utilisé que pour annuler un triplet d'un levelAuthority inférieur).
	 * 
	 * Structure interne :
	 * extPoints.fRoles {
	 * 	 "role": {
	 * 		title 		: {fValue, fLevel}
	 * 		priority 	: {fValue, fLevel}
	 * 		superRole	: {fValue, fLevel}
	 * 		fPREs : {
	 * 		  "permName" : {fValue, fLevel}
	 * 		}
	 *    }, 
	 *    ...
	 * }
	 * 
  	 * @param pRolePermList tableau d'objets JSON (ou objet JSON seul) caractérisant les roles et les permissions associées.
	 *     {role:"", title:"", priority:1, superRole="", deny:[""], allow:[""], erase:[""]}
	 *     
	 * @param pLevelAuthority Niveau d'autorité associée à cette affectation.
	 * 
	 * @param pOverwriteParent [Optionnel] utilisé uniquement par les SubExtPoints pour écraser la valeur 
	 * 				de l'extPoints parent quelquesoit le niveau d'autorité.
	 * 
	 */
	addRolePermList : function(pRolePermList, pLevelAuthority, pOverwriteParent) {
		if(Array.isArray(pRolePermList)) {
			for(var i in pRolePermList) this.addRolePermList(pRolePermList[i], pLevelAuthority, pOverwriteParent);
			return;
		}
		//log.info("will Add role::::::::::::\n"+JSON.stringify(pRolePermList));
		if(!pRolePermList.role) return;
		var vR = this.fRoles[pRolePermList.role];
		if(!vR) vR = this.fRoles[pRolePermList.role] = {role:pRolePermList.role, fPREs:{}};
		if("title" in pRolePermList) {
			if(!vR.title || vR.title.fLevel < pLevelAuthority) {
				vR.title = {fLevel : pLevelAuthority, fValue : pRolePermList.title}
			}
		}
		if("priority" in pRolePermList) {
			if(!vR.priority || vR.priority.fLevel < pLevelAuthority) {
				vR.priority = {fLevel : pLevelAuthority, fValue : pRolePermList.priority}
			}
		}
		if("superRole" in pRolePermList) {
			if(!vR.superRole || vR.superRole.fLevel < pLevelAuthority) {
				vR.superRole = {fLevel : pLevelAuthority, fValue : pRolePermList.superRole}
			}
		}
		if(pRolePermList.deny) for(var i=0, l=pRolePermList.deny.length; i<l; i++) {
			var vPermName = pRolePermList.deny[i];
			var vPRE = vR.fPREs[vPermName];
			if(!vPRE || vPRE.fLevel < pLevelAuthority) {
				vR.fPREs[vPermName] = {fLevel : pLevelAuthority, fValue : false}
			}
		}
		if(pRolePermList.allow) for(var i=0, l=pRolePermList.allow.length; i<l; i++) {
			var vPermName = pRolePermList.allow[i];
			var vPRE = vR.fPREs[vPermName];
			if(!vPRE || vPRE.fLevel < pLevelAuthority) {
				vR.fPREs[vPermName] = {fLevel : pLevelAuthority, fValue : true}
			}
		}
		if(pRolePermList.erase) for(var i=0, l=pRolePermList.erase.length; i<l; i++) {
			var vPermName = pRolePermList.erase[i];
			var vPRE = vR.fPREs[vPermName];
			if(!vPRE || vPRE.fLevel < pLevelAuthority) {
				vR.fPREs[vPermName] = {fLevel : pLevelAuthority, fValue : null}
			}
		}
		//log.info("Role:::\n"+JSON.stringify(vR));
	},
	
	//############################ Lecture des extPoints #############################
	
	/**
	 * Retourne une pref de type String, Int ou Boolean.
	 * 
	 * @param pCd Code de la pref 
	 * @param pDefaultValue Valeur par défaut si cette pref n'existe pas
	 * @return La pref recherchée ou pDefaultValue, sinon undefined.
	 */
	getPref : function(pCd, pDefaultValue){
		return (pCd in this.fPrefs) ?  this.fPrefs[pCd] : pDefaultValue;
	},
	
	/**
	 * Retourne une pref de type String, Int ou Boolean. 
	 * Recherche en priorité dans les Prefs du user (api storage ?)
	 * recherche dans l'extPoints ou retourne pDefaultValue par défaut.
	 * 
	 * TODO Prefs du user (api storage ?)
	 * 
	 * @param pCd Code de la pref 
	 * @return La pref recherchée ou pDefaultValue.
	 */
	readPref : function(pCd, pDefaultValue){
		var vCurrLevel = this.fPrefLevels[pCd];
		//TODO api storage
		//if(vCurrLevel > this.USER_LEVELAUTHORITY) return this.fPrefs[pCd];
		//...api storage 
		if(pCd in this.fPrefs) return this.fPrefs[pCd];
		return pDefaultValue;
	},

	/**
	 * Retourne une liste ordonnée d'objets sous forme d'un tableau JS.
	 * @return un tableau ou null si la liste n'existe pas.
	 */
	getList : function(pCdList){
		var vList = this.xGetListEntries(pCdList);
		if( ! vList) return null;
		
		var vResult = [];
		for(var vCd in vList) {
			if(vList[vCd].fValue != null) vResult.push(vList[vCd]);
		}
		vResult.sort(sortEntries);
		for(var i=0, k=0; i < vResult.length; i++) {
			var vVal = vResult[i].fValue;
			if(vVal===REDIRECT_TO_SVC) {
				vVal = this.getSvc(vResult[i].fCdSvc);
				if(vVal) vResult[k++] = vVal;
			} else {
				vResult[k++] = vVal;
			}
		}
		if(k < i) vResult.splice(k);
		
		return vResult;
	},

	/**
	 * Retourne une map d'objets sous forme d'un objet JS.
	 * @return un objet Js ou null si la liste n'existe pas.
	 */
	getListAsMap : function(pCdList){
		var vList = this.xGetListEntries(pCdList);
		if( ! vList) return null;
		
		var vResult = {};
		for(var vCd in vList) {
			var vEntry = vList[vCd];
			if(vEntry.fValue != null) vResult[vEntry.fCd] = vEntry.fValue === REDIRECT_TO_SVC ? this.getSvc(vEntry.fCdSvc) : vEntry.fValue;
		}
		return vResult;
	},

	/**
	 * Retourne true si la liste existe et contient au moins une entrée.
	 */
	isListFilled : function(pCdList){
		var vList = this.xGetListEntries(pCdList);
		if( ! vList) return false;
		for(var vCd in vList) {
			if(vList[vCd].fValue != null) return true;
		}
		return false;
	},
	
	/**
	 * Retourne une liste ordonnée d'objets (sous forme d'un tableau JS) issue d'une fusion de plusieurs listes.
	 * Lorsque plusieurs liste définissent la même entrée (cdEntry identique), c'est le niveau d'autorité le plus
	 * élevé qui l'emporte et l'entrée de la 1ère liste si le niveau d'autorité est identique.
	 * @param pCdLists Tableau de codes de listes à fusionner.
	 * @return un tableau ordonné des entrées (ou un tableau vide).
	 */
	mergeLists : function(pCdLists){
		var vMergedList = {};
		for (var i = 0; i < pCdLists.length; i++) {
			var vList = this.xGetListEntries(pCdLists[i]);
			if(vList) {
				for(var vCd in vList) {
					var vEntry = vList[vCd];
					var vMergedEntry = vMergedList[vEntry.fCd];
					if(!vMergedEntry || vMergedEntry.fLevel < vEntry.fLevel) {
						vMergedList[vEntry.fCd] = vEntry;
					}
				}
			}
		}
		
		var vResult = [];
		for(var vCd in vMergedList) {
			var vEntry = vMergedList[vCd];
			if(vEntry.fValue != null) vResult.push(vEntry);
		}
		vResult.sort(sortEntries);
		for(var i=0, k=0; i < vResult.length; i++) {
			var vVal = vResult[i].fValue;
			if(vVal===REDIRECT_TO_SVC) {
				vVal = this.getSvc(vResult[i].fCdSvc);
				if(vVal) vResult[k++] = vVal;
			} else {
				vResult[k++] = vVal;
			}
		}
		if(k < i) vResult.splice(k);
		
		return vResult;
	},

	/**
	 * Retourne une map d'objets (sous forme d'un objet JS) issue d'une fusion de plusieurs listes.
	 * Lorsque plusieurs liste définissent la même entrée (cdEntry identique), c'est le niveau d'autorité le plus
	 * élevé qui l'emporte et l'entrée de la 1ère liste si le niveau d'autorité est identique.
	 * @param pCdLists un tableau de codes de listes à fusionner.
	 * @return un tableau ou null si aucune liste n'existe.
	 */
	mergeListsAsMap : function(pCdLists){
		var vMergedList = {};
		for (var i = 0; i < pCdLists.length; i++) {
			var vList = this.xGetListEntries(pCdLists[i]);
			if(vList) {
				for(var vCd in vList) {
					var vEntry = vList[vCd];
					var vMergedEntry = vMergedList[vEntry.fCd];
					if(!vMergedEntry || vMergedEntry.fLevel < vEntry.fLevel) {
						vMergedList[vEntry.fCd] = vEntry;
					}
				}
			}
		}
		var vResult = {};
		for(var vCd in vMergedList) {
			var vEntry = vMergedList[vCd];
			if(vEntry.fValue != null) vResult[vEntry.fCd] = vEntry.fValue === REDIRECT_TO_SVC ? this.getSvc(vEntry.fCdSvc) : vEntry.fValue;
		}
		return vResult;
	},
	
	/**
	 * Retourne un service (Objet Js singletion dans le contexte de cet extPoints).
	 * 
	 * @param pCd Code du service.
	 */
	getSvc : function(pCd){
		try {
			var vSvcDef = this.fSvcs[pCd];
			if(!vSvcDef || !vSvcDef.fSvc) return null;
			if("fOverride" in vSvcDef) this.xSetOverridenSvc(pCd, vSvcDef);
			return vSvcDef.fSvc;
		}catch(e){
			log.debug("Load lib "+pCd+" failed::" + e);
			return null;
		}
	},
	
	/**
	 * Retourne un service "lazy".
	 * 
	 * @param pCd Code du service.
	 * @param pCb function qui admet en paramètre le service une fois chargé ou null si le chargement a échoué.
	 * @param pCbThis "this" de la function callback.
	 * @param pDefaultUrl url de chargement du svc si non spécifié.
	 */
	getSvcLazy : function(pCd, pCb, pCbThis, pDefaultUrl){
		var vSvcDef = this.fSvcs[pCd];
		if(!vSvcDef) {
			if(pDefaultUrl) {
				this.registerSvcLazy(pCd, 0, pDefaultUrl, true);
				this.getSvcLazy(pCd, pCb, pCbThis);
			} else {
				pCb.call(pCbThis, null);
			}
		} else if(! vSvcDef.fSvc) {
			this.xLoadScript(pCd, vSvcDef, pCb, pCbThis);
		} else if(this.xSetOverridenSvcLazy(pCd, vSvcDef, pCb, pCbThis)) {
			pCb.call(pCbThis, vSvcDef.fSvc);
		}
	},

	/**
	 * Evalue une ou plusieurs permissions en fonction de roles et de droits systèmes associés à un objet.
	 * 
	 * @param pPerms Objet ou tableau d'objet de type Perm issu de module security.
	 * @param pRoleNames Tableau JS de names de roles (string).
	 * @param pSystemRights Integer correspondant aux droits systèmes (voir Api Src)
	 * 
	 * @return boolean true, false ou null (ce qui correpond normalement à une erreur de paramétrage).
	 */
	hasPermission : function(pPerms, pRoleNames, pSystemRights){
		//Init perms
		var vPerm, vOffset;
		if(Array.isArray(pPerms)) {
			vPerm = pPerms[0];
			vOffset = 1;
		} else {
			vPerm = pPerms;
		}
		
		var vIsDebug = false;//vPerm.fName=="ui.adminView";
		
		//System rights
		if(pSystemRights != null) {
			while(vPerm) {
				if(vIsDebug) log.info("hasPermission:::"+pPerms+" for roles:::"+pRoleNames);
				var vPermRi = vPerm;
				while(vPermRi) {
					if(vPermRi.getSystemRights()>0 && ~(~vPermRi.getSystemRights() | pSystemRights)!=0) return false;
					vPermRi = vPermRi.getParent();
				}
				vPerm = vOffset>0 ? pPerms[vOffset++] : null;
			}
			//reinit des perm pour les roles.
			if(Array.isArray(pPerms)) {
				vPerm = pPerms[0];
				vOffset = 1;
			} else {
				vPerm = pPerms;
				vOffset = 0;
			}
		}
		
		//Si aucun role de paramétré dans l'extPoints, on est dans un contexte hors gestion de droits, on valide la perm.
		if (!this.hasRoles()) return true;
		if(!pRoleNames || pRoleNames.length==0) return false;
		if(pRoleNames.length > 1 ) {
			var vExtPoints = this;
			pRoleNames.sort(function sortRoles(pR1, pR2){
				var vP1 = vExtPoints.getRoleProperty(pR1, "priority") || 0;
				var vP2 = vExtPoints.getRoleProperty(pR2, "priority") || 0;
				return vP2 - vP1;
			});
		}
		while(vPerm) {
			if(vIsDebug) log.info("hasPermission:::"+pPerms+" for roles:::"+pRoleNames);
			if(pSystemRights != null) {
				var vPermRi = vPerm;
				while(vPermRi) {
					if(vPermRi.getSystemRights()>0 && ~(~vPermRi.getSystemRights() | pSystemRights)!=0) return false;
					vPermRi = vPermRi.getParent();
				}
			}
			for(var i=0, l=pRoleNames.length; i < l; i++) {
				var vPermHier = vPerm;
				while(vPermHier) {
					var vR = pRoleNames[i];
					while(vR) {
						var vAccess = this.getRolePermAccess(vR, vPermHier.getName());
						if(vIsDebug) log.info("hasPermission:::"+vPermHier+" for role:::"+vR+" result:::"+vAccess+" --\n"+JSON.stringify(this.fRoles[vR]));
						if(vAccess == true) return true;
						if(vAccess == false) return false;
						vR = this.getRoleProperty(vR, "superRole");
					}
					vPermHier = vPermHier.getParent();
				}
			}
			vPerm = vOffset>0 ? pPerms[vOffset++] : null;
		}
		return null;
	},

	//############################ Utilitaires exploitant les extPoints #############################

	/**
	 * Execute toutes les fonctions js issues d'une liste ordonnée : extPoints.getList().
	 * Utilisé notamment pour gérer les surcharges et ordonancement des events handlers (onload, onunloaod...)
	 * 
	 * @see callFunctions() pour les paramètres.
	 */
	callFunctionsFromList : function(pCdList, pFlags, pThis, pArguments){	
		var vFcts = this.getList(pCdList);
		return this.callFunctions(vFcts, 0, pFlags, pThis, pArguments);
	},
	
	/**
	 * Execute toutes les fonctions js issues de plusieurs listes ordonnées et fusionnées via extPoints.mergeLists().
	 * Si une des fonctions de la liste retourne false, le parcours de la liste s'interrompt.
	 * Utilisé notamment pour gérer les surcharges et ordonancement des events handlers (onload, onunloaod...)
	 * 
	 * @see callFunctions() pour les paramètres.
	 */
	callFunctionsFromLists : function(pCdLists, pFlags, pThis, pArguments){	
		var vFcts = this.mergeLists(pCdLists);
		return this.callFunctions(vFcts, 0, pFlags, pThis, pArguments);
	},
	
	
	/**
	 * Execute un tableau de fonctions js.
	 * 
	 * @param pFunctions Tableau des fonctions JS à exécuter.
	 * @param pOffset Offset de départ du tableau.
	 * @param pFlags Flags précisant le comportement de l'exécution.
	 * 			1 : dès qu'une fonction retourne false, le traitement est arreté et false est retourné.
	 * 			2 : affecte le tableau des functions en cours d'execution et l'offset en cours en 1ers arguments 
	 * 				à l'appel de chaque fonction. Utilisé pour poursuivre le traitement des fonctions suivantes en asynchone.
	 * @param pThis [Optionnel] Objet correspondant à 'this' lors de l'appel de la fonction.
	 * @param pArguments [Optionnel] Tableau des arguemnts passés à l'appel de la fonction.
	 * @return true, sauf si pFlags & 1 == 1 : false si une des fonctions a explicitement retourné false pour arrêter le traitement.
	 */
	callFunctions : function(pFunctions, pOffset, pFlags, pThis, pArguments) {
		if(pFlags & 2) {
			if(!pArguments) pArguments = [];
			pArguments[0] = pFunctions;
		}
		if(pFunctions) for (var i = pOffset; i < pFunctions.length; i++){
			if(pFlags & 2) pArguments[1] = i;
			if(pFunctions[i].apply(pThis, pArguments)==false && (pFlags & 1)) return false;
		}
		return true;
	},
	
	
	//##################### Usages avancés / internes ######################
	
	
	/**
	 * Retourne le niveau d'autorité actuel d'une pref.
	 * 
	 * @return null si indifini.
	 */
	getPrefLevel : function(pCd){
		return this.fPrefLevels[pCd];
	},
	
	/**
	 * Retourne le niveau d'autorité actuel d'un service.
	 * 
	 * @return null si indifini.
	 */
	getSvcLevel : function(pCd){
		var vSvc = this.fSvcs[pCd]
		return vSvc ? vSvc.fLevel : null;
	},

	/**
	 * Retourne le niveau d'autorité actuel d'une entrée d'une liste.
	 * 
	 * @return null si indifini.
	 */
	getEntryListLevel : function(pCdList, pCdEntry){
		var vList = this.fLists[pCdList];
		if(!vList) return null;
		var vEntry = vList[pCdEntry];
		if(!vEntry) return null;
		return vEntry.fLevel;
	},
	
	/**
	 * Usage avancé / interne
	 * Teste s'il existe des rôles
	 * 
	 * @return true si au moins un role est défini 
	 */
	hasRoles : function() {
		for (var i in this.fRoles) {
			return true;
		}
		return false;
	},
	
	/**
	 * Usage avancé / interne
	 * Retourne la liste des rôles définies
	 * 
	 * @return tableau des noms de rôles
	 */
	getRoleNames : function () {
		return this.fRoles;
	},

	/**
	 * Usage avancé / interne. 
	 * Retourne une propriété (title, priority, superRole...) d'un role.
	 * 
	 * @return null si cette propriété ou ce role n'existe pas.
	 */
	getRoleProperty : function(pRoleName, pPropName) {
		var vR = this.fRoles[pRoleName];
		if(!vR) return null;
		var vP = vR[pPropName];
		if(!vP) return null;
		return vP.fValue;
	},

	/**
	 * Usage avancé / interne. 
	 * Retourne un accès pour un couple role / permission.
	 * 
	 * @return true, false ou null si ce couple n'exite pas ou le level force à null.
	 */
	getRolePermAccess : function(pRoleName, pPermName) {
		var vR = this.fRoles[pRoleName];
		if(!vR) return null;
		var vP = vR.fPREs[pPermName];
		if(!vP) return null;
		return vP.fValue;
	},
	
	/**
	 * Usage avancé / interne. Retourne le level une propriété (title, priority, extend, alternateGrou, visible, ...) d'un role.
	 * 
	 * @return null si cette propriété ou ce role n'existe pas.
	 */
	getRolePropertyLevel : function(pRoleName, pPropName) {
		var vR = this.fRoles[pRoleName];
		if(!vR) return null;
		var vP = vR[pPropName];
		if(!vP) return null;
		return vP.fLevel;
	},

	/**
	 * Usage avancé / interne. Retourne le level d'une permission associée à un role.
	 * 
	 * @return null si ce couple role-permission n'est pas définit.
	 */
	getRolePermLevel : function(pRoleName, pPermName) {
		var vR = this.fRoles[pRoleName];
		if(!vR) return null;
		var vP = vR.fPREs[pPermName];
		if(!vP) return null;
		return vP.fLevel;
	},
	
	/** Retourne un tableau avec toutes les prefs. Chaque entrée du tableau
	 * est un objet avec les propriétés suivantes :
	 * - cd : code de la pref.
	 * - value : valeur de la pref.
	 * - level : niveau d'autorité de la valeur actuelle.
	 * TODO @param pWithInherited intègre les valeurs des extPoints des parents.
	 */
	dumpPrefs : function() {
		var vResult = [];
		for (var vCd in this.fPrefs) {
			vResult.push({cd:vCd, value:this.fPrefs[vCd], level:this.fPrefLevels[vCd]});
		}
		return vResult;
	},
	
	/** Retourne un tableau avec tous les Svc. Chaque entrée du tableau
	 * est un objet avec les propriétés suivantes :
	 * - cd : code du svc.
	 * - value : svc.
	 * - level : niveau d'autorité du svc actuel.
	 * TODO @param pWithInherited intègre les valeurs des extPoints des parents.
	 */
	dumpSvcs : function() {
		var vResult = [];
		for(var vCd in this.fSvcs) {
			var vSvc = this.fSvcs[vCd];
			vResult.push({cd:vCd, value:vSvc.fSvc, level:vSvc.fLevel});
		}
		return vResult;
	},
	
	/** Retourne un tableau avec toutes les List. Chaque entrée du tableau
	 * est un objet avec les propriétés suivantes :
	 * - cd : code de la liste.
	 * - cdEntry : code de l'entrée dans la liste
	 * - sortKey : clé de tri de l'entrée dans la liste
	 * - value : Valeur de l'entrée dans la liste.
	 * - level : niveau d'autorité de l'entrée dans la liste actuelle.
	 * TODO @param pWithInherited intègre les valeurs des extPoints des parents.
	 */
	dumpLists : function() {
		var vResult = [];
		for(var vCd in this.fLists) {
			var vList = this.fLists[vCd]; //this.xGetListEntries(pCdList);
			for(var vCdEntry in vList) {
				var vEntry = vList[vCdEntry];
				var vObj = {cd:vCd, cdEntry:vCdEntry, sortKey:vEntry.fSortKey, value:vEntry.fValue, level:vEntry.fLevel};
				if(vObj.value === REDIRECT_TO_SVC) vObj.value = this.getSvc(vEntry.fCdSvc);
				vResult.push(vObj);
			}
		}
		return vResult;
	},
	
	/** 
	 * Retourne un tableau des roles avac leurs permissions associées :
	 * [
	 *   {roleName:"",
	 *    priority:1,
	 *    superRole:"",
	 *    perms: [
	 *      {permName:"",
	 *       allowed:true,
	 *       level:1
	 *    ]
	 *   }
	 * ]
	 * TODO @param pWithInherited intègre les valeurs des extPoints des parents.
	 */
	dumpRolePermList : function() {
		var vResult = [];
		for(var vRoleName in this.fRoles) {
			var vRole = this.fRoles[vRoleName];
			var vNewRole = {roleName: vRoleName, priority: this.getRoleProperty(vRoleName, "priority"), superRole: this.getRoleProperty(vRoleName, "superRole"), perms:[]};
			vResult.push(vNewRole);
			for(var vPermName in vRole.fPREs) {
				var vPRE = vRole.fPREs[vPermName];
				var vEntry = {permName:vPermName, allowed:vPRE.fValue, level:vPRE.fLevel};
				vNewRole.perms.push(vEntry);
			}
		}
		return vResult;
	},
	
	
	xLoadScript : function(pCd, pSvcDef, pCb, pCbThis){
		if(pSvcDef.fError) {
			//chargement déjà tenté.
			pCb.call(pCbThis, null, pSvcDef.fError);
			return;
		}
		if(!this.fSvcsLoading) this.fSvcsLoading = {};
		if(this.fSvcsLoading[pCd]) {
			//Chargement d'un élément de la chaine en cours...
			this.fSvcsLoading[pCd].fCbs.push(pCb, pCbThis);
		} else {
			pSvcDef.fCbs = [pCb, pCbThis];
			var vScript = document.createElement("script");
			vScript.charset = "UTF-8";
			vScript.src = pSvcDef.fUrlLib;
			var vThis = this;
			var vHead = document.head;
			function onEndLoaded() {
				var vSvcDef = vThis.fSvcsLoading[pCd];
				if(vSvcDef !== pSvcDef) return;
				delete vThis.fSvcsLoading[pCd];
				if( ! vSvcDef.fSvc) vSvcDef.fError = "Init lazy svc '" + pCd + "' from '" + pSvcDef.fUrlLib+"' failed.";
				for(var i=0; i< vSvcDef.fCbs.length; i=i+2) {
					//On repasse par la méthode publique pour la gestion des override des Svc.
					vThis.getSvcLazy(pCd, vSvcDef.fCbs[i], vSvcDef.fCbs[i+1]);
				}
				delete vSvcDef.fCbs;
				vHead.removeChild(vScript);
			}
			vScript.addEventListener("load", onEndLoaded);
			vScript.addEventListener("error", onEndLoaded);
			this.fSvcsLoading[pCd] = pSvcDef;
			vHead.appendChild(vScript);
		}
	},
	
	/**
	 * Isolement du getter d'une liste pour permettre la fusion dans SubExtPoints.
	 */
	xGetListEntries : function(pCdList) {
		return this.fLists[pCdList];
	},
	
	/** Utilié par l'enregistrement de Svc */
	xInsertSvcInOverrideChain : function(pParent, pSvc, pLevelAuthority, pIsOverride){
		if(!pParent.fOverride || pParent.fOverride.fLevel < pLevelAuthority) {
			if(pIsOverride) {
				pParent.fOverride = {
					fSvc : pSvc,
					fLevel : pLevelAuthority,
					fOverride : pParent.fOverride
				}
			} else {
				pParent.fOverride = {
					fSvc : pSvc,
					fLevel : pLevelAuthority
				}
			}
			return true;
		} else if("fOverride" in pParent.fOverride) {
			return this.xInsertSvcInOverrideChain(pParent.fOverride, pSvc, pLevelAuthority);
		}
		return false;
	},
	
	/** Utilié par l'enregistrement de Svc */
	xInsertSvcLazyInOverrideChain : function(pParent, pUrlLib, pLevelAuthority, pIsOverride){
		if(!pParent.fOverride || pParent.fOverride.fLevel < pLevelAuthority) {
			if(pIsOverride) {
				pParent.fOverride = {
					fUrlLib : pUrlLib,
					fLevel : pLevelAuthority,
					fOverride : pParent.fOverride
				}				
			} else {
				pParent.fOverride = {
					fUrlLib : pUrlLib,
					fLevel : pLevelAuthority
				}
			}
			return true;
		} else if("fOverride" in pParent.fOverride) {
			return this.xInsertSvcInOverrideChain(pParent.fOverride, pSvc, pLevelAuthority);
		}
		return false;
	},
		
	/** Affectation du svc surchargé au svc courant. */
	xSetOverridenSvc : function(pCd, pSvcDef){
		var vSubSvcDef = pSvcDef.fOverride;
		if(vSubSvcDef && vSubSvcDef.fSvc) {
			this.xSetOverridenSvc(pCd, vSubSvcDef); //chainage des override
			pSvcDef.fSvc.setOverridenSvc(vSubSvcDef.fSvc);
		}
	},
	
	/** Affectation du svc surchargé au svc courant avec gestion des chargements lazy. 
	 * @return true si aucun chargement asynchrone nécessaire
	 */
	xSetOverridenSvcLazy : function	(pCd, pSvcDef, pCb, pCbThis){
		var vSubSvcDef = pSvcDef.fOverride;
		if(!vSubSvcDef) return true;
		if(vSubSvcDef.fSvc) {
			if(this.xSetOverridenSvcLazy(pCd, vSubSvcDef, pCb, pCbThis)) {
				//chainage des override
				pSvcDef.fSvc.setOverridenSvc(vSubSvcDef.fSvc);
				return true;
			}
			return false;
		}
		this.xLoadScript(pCd, vSubSvcDef, pCb, pCbThis);
		return false;
	}
};

/** 
 * Level authority correspondant aux spécifications du user (prefs users)). 
 * Un level supérieur rend les prefs personnelles inutiles.
 */
ExtPoints.prototype.USER_LEVELAUTHORITY = 1000;


/**
 * SubExtPoints : extPoints qui surcharge un extPoints parent.
 * 
 * Un paramètre supplémentaire aux méthodes d'affectation permet de forcer l'écrasement
 * de la valeur de l'extPoints parent quelquesoit le niveau d'autorité.
 * 
 * XXX Attention, avec cette impl, une modification ultérieure de l'extPoints parent 
 * (avec un niveau d'autorité supérieur) sur un point d'extension surchargé dans 
 * le SubExtPoints ne sera pas pris en compte. Est-ce un pb ou une feature ? discutable, 
 * pas forcément abérrant...
 */
function SubExtPoints(pParentExtPoints){
	this.fPrefLevels = {};
	this.fPrefs = {};
	this.fLists = {};
	this.fSvcs = {};
	this.fLibs = {};
	this.fRoles = {};
	this.fParentExtPoints = pParentExtPoints;
}

SubExtPoints.prototype = {
	
	//SubExtPoints extends ExtPoints
	__proto__ : ExtPoints.prototype,
	
	setPref : function(pCd, pLevelAuthority, pValue, pOverwriteParent){
		if(! pOverwriteParent && this.fParentExtPoints.getPrefLevel(pCd) >= pLevelAuthority) return false;
		return ExtPoints.prototype.setPref.apply(this, arguments); //call super
	},
	
	addToList : function(pCdList, pCdEntry, pLevelAuthority, pValueEntry, pSortKey, pOverwriteParent){
		if(! pOverwriteParent && this.fParentExtPoints.getEntryListLevel(pCdList, pCdEntry) >= pLevelAuthority) return false;
		return ExtPoints.prototype.addToList.apply(this, arguments); //call super
	},
	
	addSvcToList : function(pCdList, pCdEntry, pLevelAuthority, pCdSvc, pSortKey, pOverwriteParent){
		if(! pOverwriteParent && this.fParentExtPoints.getEntryListLevel(pCdList, pCdEntry) >= pLevelAuthority) return false;
		return ExtPoints.prototype.addSvcToList.apply(this, arguments); //call super
	},
	
	registerSvc : function(pCd, pLevelAuthority, pSvc, pOverwriteParent) {
		if(! pOverwriteParent && this.fParentExtPoints.getSvcLevel(pCd) >= pLevelAuthority) return false;
		return ExtPoints.prototype.registerSvc.apply(this, arguments); //call super
	},
	
	overrideSvc : function(pCd, pLevelAuthority, pSvc, pOverwriteParent) {
		if(! pOverwriteParent && this.fParentExtPoints.getSvcLevel(pCd) >= pLevelAuthority) return false;
		return ExtPoints.prototype.overrideSvc.apply(this, arguments); //call super
	},
	
	registerSvcLazy : function(pCd, pLevelAuthority, pUrlLib, pOverwriteParent) {
		if(! pOverwriteParent && this.fParentExtPoints.getSvcLevel(pCd) >= pLevelAuthority) return false;
		return ExtPoints.prototype.registerSvcLazy.apply(this, arguments); //call super
	},
	
	overrideSvcLazy : function(pCd, pLevelAuthority, pUrlLib, pOverwriteParent) {
		if(! pOverwriteParent && this.fParentExtPoints.getSvcLevel(pCd) >= pLevelAuthority) return false;
		return ExtPoints.prototype.overrideSvcLazy.apply(this, arguments); //call super
	},
	
	initSvcLazy : function(pCd, pSvc) {
		if(ExtPoints.prototype.initSvcLazy.apply(this, arguments)) return true;
		return this.fParentExtPoints.initSvcLazy(pCd, pSvc);
	},
	
	addRolePermList : function(pRolePermList, pLevelAuthority, pOverwriteParent) {
		if(Array.isArray(pRolePermList)) {
			for(var i=0; i<pRolePermList.length; i++) this.addRolePermList(pRolePermList[i], pLevelAuthority, pOverwriteParent);
			return;
		}
		var vRoleName = pRolePermList.role;
		if(!vRoleName) return;
		var vR = this.fRoles[vRoleName];
		if(!vR) vR = this.fRoles[vRoleName] = {role:vRoleName, fPREs:{}};
		if("sortKey" in pRolePermList) {
			if(pOverwriteParent || this.fParentExtPoints.getRolePropertyLevel(vRoleName, "sortKey") < pLevelAuthority) {
				if(!vR.sortKey || vR.sortKey.fLevel < pLevelAuthority) {
					vR.sortKey = {fLevel : pLevelAuthority, fValue : pRolePermList.sortKey}
				}
			}
		}
		if("description" in pRolePermList) {
			if(pOverwriteParent || this.fParentExtPoints.getRolePropertyLevel(vRoleName, "description") < pLevelAuthority) {
				if(!vR.description || vR.description.fLevel < pLevelAuthority) {
					vR.description = {fLevel : pLevelAuthority, fValue : pRolePermList.description}
				}
			}
		}
		if("title" in pRolePermList) {
			if(pOverwriteParent || this.fParentExtPoints.getRolePropertyLevel(vRoleName, "title") < pLevelAuthority) {
				if(!vR.title || vR.title.fLevel < pLevelAuthority) {
					vR.title = {fLevel : pLevelAuthority, fValue : pRolePermList.title}
				}
			}
		}
		if("priority" in pRolePermList) {
			if(pOverwriteParent || this.fParentExtPoints.getRolePropertyLevel(vRoleName, "priority") < pLevelAuthority) {
				if(!vR.priority || vR.priority.fLevel < pLevelAuthority) {
					vR.priority = {fLevel : pLevelAuthority, fValue : pRolePermList.priority}
				}
			}
		}
		if("superRole" in pRolePermList) {
			if(pOverwriteParent || this.fParentExtPoints.getRolePropertyLevel(vRoleName, "superRole") < pLevelAuthority) {
				if(!vR.superRole || vR.superRole.fLevel < pLevelAuthority) {
					vR.superRole = {fLevel : pLevelAuthority, fValue : pRolePermList.superRole}
				}
			}
		}
		if(pRolePermList.deny) for(var i=0, l=pRolePermList.deny.length; i<l; i++) {
			var vPermName = pRolePermList.deny[i];
			if(pOverwriteParent || this.fParentExtPoints.getRolePermLevel(vRoleName, vPermName) < pLevelAuthority) {
				var vPRE = vR.fPREs[vPermName];
				if(!vPRE || vPRE.fLevel < pLevelAuthority) {
					vR.fPREs[vPermName] = {fLevel : pLevelAuthority, fValue : false}
				}
			}
		}
		if(pRolePermList.allow)  for(var i=0, l=pRolePermList.allow.length; i<l; i++) {
			var vPermName = pRolePermList.allow[i];
			if(pOverwriteParent || this.fParentExtPoints.getRolePermLevel(vRoleName, vPermName) < pLevelAuthority) {
				var vPRE = vR.fPREs[vPermName];
				if(!vPRE || vPRE.fLevel < pLevelAuthority) {
					vR.fPREs[vPermName] = {fLevel : pLevelAuthority, fValue : true}
				}
			}
		}
		if(pRolePermList.erase)  for(var i=0, l=pRolePermList.erase.length; i<l; i++) {
			var vPermName = pRolePermList.erase[i];
			if(pOverwriteParent || this.fParentExtPoints.getRolePermLevel(vRoleName, vPermName) < pLevelAuthority) {
				var vPRE = vR.fPREs[vPermName];
				if(!vPRE || vPRE.fLevel < pLevelAuthority) {
					vR.fPREs[vPermName] = {fLevel : pLevelAuthority, fValue : null}
				}
			}
		}
	},
	
	getPref : function(pCd, pDefaultValue){
		return (pCd in this.fPrefs) ?  this.fPrefs[pCd] : this.fParentExtPoints.getPref(pCd, pDefaultValue);
	},
	
	readPref : function(pCd, pDefaultValue){
		return (pCd in this.fPrefs) ?  ExtPoints.prototype.readPref.apply(this, arguments) : this.fParentExtPoints.readPref(pCd, pDefaultValue);
	},
	
	getSvc : function(pCd){
		return (pCd in this.fSvcs) ? ExtPoints.prototype.getSvc.apply(this, arguments) : this.fParentExtPoints.getSvc(pCd);
	},
	
	getSvcLazy : function(pCd, pCb, pCbThis, pDefaultUrl) {
		return (pCd in this.fSvcs) ? ExtPoints.prototype.getSvcLazy.apply(this, arguments) : this.fParentExtPoints.getSvcLazy(pCd, pCb, pCbThis, pDefaultUrl);
	},
	
	getPrefLevel : function(pCd){
		return (pCd in this.fPrefLevels) ? ExtPoints.prototype.getPrefLevel.apply(this, arguments) : this.fParentExtPoints.getPrefLevel(pCd);
	},
	
	getSvcLevel : function(pCd){
		return (pCd in this.fSvcs) ? ExtPoints.prototype.getSvcLevel.apply(this, arguments) : this.fParentExtPoints.getSvcLevel(pCd);
	},

	getEntryListLevel : function(pCdList, pCdEntry){
		var vList = this.fLists[pCdList];
		if(!vList) return this.fParentExtPoints.getEntryListLevel(pCdList, pCdEntry);
		var vEntry = vList[pCdEntry];
		if(!vEntry) return this.fParentExtPoints.getEntryListLevel(pCdList, pCdEntry);
		return vEntry.fLevel;
	},
	
	xGetListEntries : function(pCdList) {
		var vParentList = this.fParentExtPoints.xGetListEntries(pCdList);
		if(!vParentList) return this.fLists[pCdList];
		var vList = this.fLists[pCdList];
		if(!vList) return vParentList;
		//on fusionne les 2 listes
		var vResult = {};
		for(var vCd in vList) {
			var vEntry = vList[vCd];
			vResult[vEntry.fCd] = vEntry;
		}
		for(var vCd in vParentList) {
			var vEntry = vParentList[vCd];
			if(! (vEntry.fCd in vResult)) vResult[vEntry.fCd] = vEntry;
		}
		return vResult;
	},	
	
	xSetOverridenSvc : function(pCd, pSvcDef){
		var vSubSvcDef = pSvcDef.fOverride;
		if(vSubSvcDef) {
			ExtPoints.prototype.xSetOverridenSvc.apply(this, arguments);
		} else {
			pSvcDef.fSvc.setOverridenSvc(this.fParentExtPoints.getSvc(pCd));
		}
	},


	hasRoles : function() {
		for (var i in this.fRoles) {
			return true;
		}
		return this.fParentExtPoints.hasRoles();
	},
	
	getRoleNames : function() {
		var vRoles = Object.keys(this.fParentExtPoints.getRoleNames());
		for (var i in this.fRoles) {
			if (vRoles.indexOf(i) == -1) vRoles.push(i);
		}
		return vRoles;
	},

	getRoleProperty : function(pRoleName, pPropName) {
		var vR = this.fRoles[pRoleName];
		if(!vR) return this.fParentExtPoints.getRoleProperty(pRoleName, pPropName);
		var vP = vR[pPropName];
		if(!vP) return this.fParentExtPoints.getRoleProperty(pRoleName, pPropName);
		return vP.fValue;
	},

	getRolePermAccess : function(pRoleName, pPermName) {
		var vR = this.fRoles[pRoleName];
		if(!vR) return this.fParentExtPoints.getRolePermAccess(pRoleName, pPermName);
		var vP = vR.fPREs[pPermName];
		if(!vP) return this.fParentExtPoints.getRolePermAccess(pRoleName, pPermName);
		return vP.fValue;
	},
	
	getRolePropertyLevel : function(pRoleName, pPropName) {
		var vR = this.fRoles[pRoleName];
		if(!vR) return this.fParentExtPoints.getRolePropertyLevel(pRoleName, pPropName);
		var vP = vR[pPropName];
		if(!vP) return this.fParentExtPoints.getRolePropertyLevel(pRoleName, pPropName);
		return vP.fLevel;
	},

	getRolePermLevel : function(pRoleName, pPermName) {
		var vR = this.fRoles[pRoleName];
		if(!vR) return this.fParentExtPoints.getRolePermLevel(pRoleName, pPermName);
		var vP = vR.fPREs[pPermName];
		if(!vP) return this.fParentExtPoints.getRolePermLevel(pRoleName, pPermName);
		return vP.fLevel;
	}
}

//pre-init de window.extPoints
window.extPoints = {
	initAsRoot : function(){
		window.extPoints = new ExtPoints();
	},
	initAsSubExtPoints : function(pSuperExtPoints){
		if(!pSuperExtPoints) pSuperExtPoints = (window.opener || window.parent).extPoints;
		if(!pSuperExtPoints) throw "no super extPoints found.";
		window.extPoints = new SubExtPoints(pSuperExtPoints);
	},
	/** en cas de chargement de svc directement dans une page js.*/
	initSvcLazy: function(pCd, pSvc){
		return false;
	}
}
	
var REDIRECT_TO_SVC = {};

function sortEntries(pE1, pE2){
	return pE1.fSortKey <= pE2.fSortKey?-1:1;
}
	
})(window);

