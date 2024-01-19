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
 * Portions created by the Initial Developer are Copyright (C) 2014
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
 * Implémentation d'objets de type Enum permettant la gestion d'enumérations.
 * Ces objets Enum peuvent être placés dans des Svc extPoints pour un accès mutualisé.
 * Toutes les méthodes d'accès au contenu de l'énumération sont conçues pour permettre
 * un retour asynchrone en cas de chargement distant.
 * 
 * Api des objets de type Enum :
 * - getId() Id de l'énumération.
 * - returnLabel(pKey, pOptions, pCb, pCbThis) Fournit un label pour une clé donnée.
 * - fillSelectOptions(pDomRoot, pOptions) complète une balise HTML select avec des balises option.
 * 			pDomRoot peut être l'élément select ou un DomBuilder pointant l'élément select.
 * 
 * @dependances commons/commons.js commons/dom.js
 */
var enums = {};

/**
 */
enums.StaticEnum = function(pId){
	this.fId = pId;
}
enums.StaticEnum.prototype = {
	
	getId : function(){return this.fId;},
	
	setSimpleMap : function(pEnum){
		this.fEnum = pEnum;
		return this;
	},
	
	returnLabel : function(pKey, pOptions, pCb, pCbThis){
		pCb.call(pCbThis, this.fEnum[pKey]);
	},
	
	fillSelectOptions : function(pDomRoot, pOptions){
		var vDomBd = (pDomRoot instanceof dom.DomBuilder) ? pDomRoot : dom.newBd(pDomRoot);
		if(this.fEnum instanceof Array)
			this.fEnum.forEach(function(pEntry){vDomBd.elt("option").att("value", pEntry).up();});
		else {
			for (var vKey in this.fEnum) {
				if (typeof this.fEnum[vKey] === "string") vDomBd.elt("option").att("value", vKey).text(this.fEnum[vKey]).up();
				else {
					vDomBd.elt("optgroup").att("label", vKey);
					for (var vSubKey in this.fEnum[vKey]) vDomBd.elt("option").att("value", vSubKey).text(this.fEnum[vKey][vSubKey]).up();
					vDomBd.up();
				}
			}
		}
	}
};

