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
 * david.rivron@utc.fr 
 * 
 * Portions created by the Initial Developer are Copyright (C) 2011
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
 * 
 * @dependances commons/commons.js
 */
 
var security = {
	sPerms : {}
};

security.Perm  = function(pPermName, pParentPerm, pGlobal, pSystemRights){
	this.fName = pPermName;
	this.fParent = pParentPerm;
	this.fGlobal = pGlobal;
	this.fSystemRights = pSystemRights || 0;
}

security.Perm.prototype = {
	getName: function () { return this.fName; },
	getParent: function () { return this.fParent; },
	getSystemRights: function () { return this.fSystemRights; },
	isGlobal: function () { return this.fGlobal; },
	toString: function() {
		var vResult = (this.fParent) ? this.fParent.toString() : "";
		return vResult + "/" + this.getName();
	}
}

/**
 * Créé une permission public qui peut être retrouvée via security.getGPerm(pPermName).
 * Attention, ces permissions globales sont communes à l'ensemble de l'application. Elles ne peuvent
 * être contextuelles (à un modèle documentaire ou autre).
 *
 * @param pParentPerm Peut-être un objet Perm issu de ce module security ou le name (string) d'une permission.
 *    Dans tous les cas,  pParentPerm *doit* être une permission globale.
 * @return Un objet de type Perm.
 */
security.newGPerm = function (pPermName, pParentPerm, pSystemRights) {
	var vPerm = this.sPerms[pPermName];
	if (vPerm) return vPerm;
	var vParentPerm = (pParentPerm != null && pParentPerm.__proto__ == String.prototype)
		? security.getGPerm(pParentPerm)
		: pParentPerm;
	if (pParentPerm && !vParentPerm) log.debug("Parent permission of '" + pPermName + "' not found : " + (vParentPerm ? vParentPerm.getName() : pParentPerm));
	var vPerm = new security.Perm (pPermName, vParentPerm, true, pSystemRights);
	this.sPerms[pPermName] = vPerm;
	return vPerm;
}

/**
 * Retrouve une permission publique par son name.
 * @return Un objet de type Perm.
 */
security.getGPerm = function (pPermName) {
	return this.sPerms[pPermName];
}

/**
 * Crée une permission dédiée / contextuelle qui n'a pas vocation à être un parent de permissions
 * issues d'autres modules de codes.
 *
 * @param pParentPerm Peut-être un objet Perm issu de ce module security ou le name (string) d'une permission qui *doit* être globale.
 * @return Un objet de type Perm.
 **/
security.newLPerm = function (pPermName, pParentPerm, pSystemRights) {
	var vParentPerm = (pParentPerm != null && pParentPerm.__proto__ == String.prototype)
		? this.sPerms[pParentPerm]
		: pParentPerm;
	if (pParentPerm && !vParentPerm) log.debug("Parent permission of '" + pPermName + "' not found : " + (vParentPerm ? vParentPerm.getName() : pParentPerm));
	return new security.Perm(pPermName, vParentPerm, false, pSystemRights);
}

security.dumpPermsTree = function (pRootPermName) {
	var vPermName = pRootPermName || "DO";
	var vPerm = this.sPerms[vPermName];
	var vPermDump = {
		name: vPerm.getName(),
		systemRights: vPerm.getSystemRights()
	};
	for (var vKey in this.sPerms) {
		var vParent = this.sPerms[vKey].getParent();
		if (vParent && vParent.getName() == vPermName) {
			if(!vPermDump.children) vPermDump.children = [];
			vPermDump.children.push(security.dumpPermsTree(this.sPerms[vKey].getName()));
		}
	}
	return vPermDump;
}

/** 
 * La classe SecurityCtx permet de gérer un contexte de sécurité associé à un extPoints.
 * Cette classe gère une table des permissions locales.
 * @param pSrcRoles : 
 * 		- (string) liste de rôles séparés par des espaces
 * 		- (array)  liste de rôles
 * 		- (string) chaine vide : aucun rôle de défini dans ce contexte. hasPermForObjectRoot retournera donc toujours false
 * 		- null ou undefined : le contexte ne gère pas les rôles. Le rôle ~default est donc utilisé
 */
security.defaultRoleName = "~default";
security.SecurityCtx = function(pExtPoints, pAccount, pSrcRoles, pSystemRights, pIsSuperAdmin){
	//log.debug("SecurityCtx:::::::");
	//Public properties
	this.account = pAccount || "";
	if(pSrcRoles==="") {
		this.srcRoles=[];
	}else if(pSrcRoles!=null) {
		this.srcRoles = Array.isArray(pSrcRoles) ? pSrcRoles : pSrcRoles.split(" ");
	} else {
		this.srcRoles = [security.defaultRoleName];
	}
	this.srcRi = pSystemRights == null ? security.RIGHTS_ALL : pSystemRights;
	this.isSuperAdmin = pIsSuperAdmin==true || pIsSuperAdmin=="true";
	//Propriétés internes
	this.fExtPoints = pExtPoints;
	this.fLocalPerms = [];
	this.fParent = null;
}
security.SecurityCtx.prototype = {

	/** Récupère ou crée une nouvelle permission locale. */
	getOrCreateLPerm : function(pPermName, pParentPerm, pSystemRights){
		var vPerm = this.getLPerm(pPermName);
		if (!vPerm) {
			vPerm = this.fLocalPerms[pPermName] = security.createLocalPerm(pPermName, pParentPerm, pSystemRights);
		}
		return vPerm;
	},
	
	getLPerm : function(pPermName){
		var vPerm = this.fLocalPerms[pPermName];
		if (vPerm) return vPerm;
		return (this.fParentSecurityCtx) ? this.fParentSecurityCtx.getLPerm(pPermName) : null;
	},
	
	/** Récupère une permission locale ou globale. */
	getPerm : function(pPermName){
		return this.getLPerm(pPermName) || security.getGPerm(pPermName);
	},
	
	/** 
	 * Récupère un tableau de permissions locales ou globales à partir d'une chaine string 
	 * où les noms des permissions sont séparées par des espaces. 
	 */
	getPerms : function(pPermNames){
		var vPerms = pPermNames.split(' ');
		for (var i=0, l=vPerms.length; i<l; i++) {
			var vPerm = this.getPerm(vPerms[i]);
			if( ! vPerm) log.debug("Perm '"+vPerms[i]+"' unknown.");
			vPerms[i] = vPerm;
		}
		return vPerms;
	},
	
	/**
	 * Evalue une permission en fonction de roles et de droits systèmes d'un objet
	 * qui n'est pas l'objet racine de ce securityCtx.
	 * 
	 * @param pPerms Objet ou tableau d'objet de type Perm issu de module security.
	 * @param pRoleNames Tableau JS de names de roles (string).
	 * 		si null ou undefined : les permission sont testées sur objectRoot
	 * @param pSystemRights Integer correspondant aux droits systèmes (voir Api Src)
	 * 
	 * @return boolean true / false 
	 *   (si extPoints.hasPermission() retourne null, true est retourné : erreur de paramétrage).
	 */
	hasPerm : function(pPerms, pRoleNames, pSystemRights) {
		if(this.isSuperAdmin) return true;
		var vRolesNames = (pRoleNames==null || pRoleNames==undefined) ? [security.defaultRoleName] :  pRoleNames;
		var vResult = this.fExtPoints.hasPermission(pPerms, vRolesNames, pSystemRights);	
		if(vResult==null) log.debug("Permissions '"+pPerms+"' not declared for roles : "+vRolesNames);
		return vResult!=false;
	},
	
	/**
	 * Evalue une ou plusieurs permissions pour l'objet racine de ce securityCtx.
	 * 
	 * @param pPerms  Objet ou tableau d'objet de type Perm issu de module security.
	 * @param pRoleNames Tableau JS de names de roles (string).
	 * @param pSystemRights Integer correspondant aux droits systèmes (voir Api Src)
	 * 
	 * @return boolean true / false 
	 *   (si extPoints.hasPermission() retourne null, true est retourné : erreur de paramétrage).
	 */
	hasPermForObjectRoot: function(pPerms){
		if(this.isSuperAdmin) return true;
		var vResult = this.fExtPoints.hasPermission(pPerms, this.srcRoles, this.srcRi);
		if(vResult==null) log.debug("Permissions '"+pPerms+"' not declared for roles : "+this.srcRoles);
		return vResult!=false;
	},
	
	/**
	 * Crée un sous contexte avec héritage des localPerm.
	 */
	createSubSecurityCtx : function(pExtPoints, pSrcRoles, pSystemRights) {
		var vNewSecCtx = new security.SecurityCtx(pExtPoints, this.account, (pSrcRoles==null || pSrcRoles==undefined) ? this.srcRoles : pSrcRoles, pSystemRights || this.srcRi, this.isSuperAdmin);
		vNewSecCtx.fParentSecurityCtx = this;
		return vNewSecCtx;
	},
	
	/** Construit un arbre json des perms combinant les perms blobales et locales.*/
	dumpPermsTree : function (pRootPermName) {
		var vPermName = pRootPermName || "DO";
		var vPerm = this.getPerm(vPermName);
		var vPermDump = {
			name: vPerm.getName(),
			systemRights: vPerm.getSystemRights()
		};
		for (var vKey in this.sPerms) {
			var vParent = this.sPerms[vKey].getParent();
			if (vParent && vParent.getName() == vPermName) {
				if(!vPermDump.children) vPermDump.children = [];
				vPermDump.children.push(this.dumpPermsTree(this.sPerms[vKey].getName()));
			}
		}
		var vCtx = this;
		while(vCtx) {
			for (var vKey in vCtx.fLocalPerms) {
				var vParent = vCtx.fLocalPerms[vKey].getParent();
				if (vParent && vParent.getName() == vPermName) {
					if(!vPermDump.children) vPermDump.children = [];
					vPermDump.children.push(this.dumpPermsTree(vCtx.fLocalPerms[vKey].getName()));
				}
			}
			vCtx = vCtx.fParent;
		}
		return vPermDump;
	}
}

/* Droits systèmes */
security.RIGHT_READ = 1;
security.RIGHT_LISTCHILDREN = 2;
security.RIGHT_WRITE = 4;
security.RIGHT_REMOVE = 8;
security.RIGHTONCHILDREN_REMOVE = 16;
security.RIGHT_CREATEFILE = 32;
security.RIGHT_CREATEFOLDER = 64;
security.RIGHTONCHILDREN_CREATE = 128;
security.RIGHT_MOVE = 256;

security.getReadableAllowedSystemRights = function(pRight){
	var vResult = [];
	if((pRight & 1) == 1) vResult.push("read");
	if((pRight & 2) == 2) vResult.push("listChildren");
	if((pRight & 4) == 4) vResult.push("write");
	if((pRight & 8) == 8) vResult.push("remove");
	if((pRight & 16) == 16) vResult.push("onChildren_Remove");
	if((pRight & 32) == 32) vResult.push("createFile");
	if((pRight & 64) == 64) vResult.push("createFolder");
	if((pRight & 128) == 128) vResult.push("onChildren_Create");
	if((pRight & 256) == 256) vResult.push("move");
	return vResult.join(", ");
}
security.getReadableDeniedSystemRights = function(pRight){
	var vResult = [];
	if((pRight & 1) == 0) vResult.push("read");
	if((pRight & 2) == 0) vResult.push("listChildren");
	if((pRight & 4) == 0) vResult.push("write");
	if((pRight & 8) == 0) vResult.push("remove");
	if((pRight & 16) == 0) vResult.push("onChildren_Remove");
	if((pRight & 32) == 0) vResult.push("createFile");
	if((pRight & 64) == 0) vResult.push("createFolder");
	if((pRight & 128) == 0) vResult.push("onChildren_Create");
	if((pRight & 256) == 0) vResult.push("move");
	return vResult.join(", ");
}
