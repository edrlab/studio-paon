/**
 * AuthProvider en lien avec l'authentification simple par cookie de Scenari.
 * 
 * Cette implémentation doit être associée à un extPoint svc "area.login" de type Area et implémentant une méthode
 * d'initialisation initLoginDialog(pCtx, pOptions, pCbLogin). Voir exemple : back/commons/dialogs/loginDialog.html.
 * 
 * La pref extpoint "auth.serverUrl" doit avoit été définie (url du server d'auth, sans l'execFrame (web/public))
 */
 
var authProv=(function(){ //Commenter pour dev.

var authProv={}

/**
 * 
 * 
 * <pre>
 * {
 *   anonymousUser : null			//[optionnel] Exemple : {account="anonyme", grantedRoles:["webUser"]}
 *   paths : {xx : ""}				//Surcharge les paths par défaut pour accéder aux services exploités par cet authProvider (cf authProv.fPaths).
 * }
 * </pre>
 * 
 */
authProv.initAuthProv = function(pParams) {
	this.fAnonymousUser = pParams.anonymousUser;
	if(pParams.paths) {
		for(var k in pParams.paths) authProv.fPaths[k] = pParams.paths[k];
	}
	this.fUser = null;
}
authProv.fPaths = {
	login : "/public/u/loginWeb",
	renewPwd : "/public/u/renewPwdWeb",
	checkPwd : "/public/u/checkPwdWeb",
	pwdLost : "/public/u/pwdLost?cdaction=AskForUpdate",
	logout : "/web/u/logoutWeb",
	currentUser : "/web/u/adminUsers?cdaction=CurrentUser",
}

/** @API AuthProv. Nom du user courant. */
authProv.getAccount = function() {
	if(this.fUser) return this.fUser.account;
	if(this.fAnonymousUser) return this.fAnonymousUser.account;
	return "";
}

/** @API AuthProv. Propriétés (json) du user actuellement connecté ou null si pas de user authentifié en cours. */
authProv.getUser = function() {
	return this.fUser;
}

/** @API AuthProv. Propriétés (json) du user anonyme non connecté. Retourne null si le user anonyme n'est pas permis. */
authProv.getAnonymousUser = function() {
	return this.fAnonymousUser;
}

/** 
 * @API AuthProv. Charge et ou vérifie la validité du user connecté et retourne ses propriétés en callback. 
 * Aucun écran de login n'est proposé.
 * Paramètre de la callback : user connecté ou null.
 * 
 * @param pForceCheckServer si true, force un controle auprès du server de la validité du user, même si le user est déjà localement disponible.
 */
authProv.loadUser = function(pCb, pCbThis, pForceCheckServer) {
	if(this.fUser==null || pForceCheckServer) {
		//controle de l'auth par le serveur
		var vThis = this;
		xLoadUser(function(pEvt){
			try {
				if (pEvt.target.status == 200) {
					var vNewTxt = pEvt.target.responseText;
					//console.log("authProv.loadUser:::::::::::"+vNewTxt);
					if(vNewTxt != vThis.fTxtUser) {
						vThis.fUser = JSON.parse(vNewTxt);
						vThis.fTxtUser = vNewTxt;
						vThis.authListeners.dispatch(vThis.fUser);
					}
				} else {
					vThis.fTxtUser = null;
					vThis.fUser = null;
					console.log("authProv.loadUser failed:"+pEvt.target.status +" - " + pEvt.target.responseText);
				}
			}catch(e){
					vThis.fTxtUser = null;
					vThis.fUser = null;
					console.log("load user info failed::"+e);
			}
			if(pCb) pCb.call(pCbThis, vThis.fUser);
		});
	} else {
		if (pCb) pCb.call(pCbThis, this.fUser);
	}
}

/** 
 * @API AuthProv. Charge et ou vérifie la validité du user connecté ou, si nécessaire,
 * affiche l'écran de login et retourne les propriétés du user connecté en callback. 
 * Paramètre de la callback : user connecté ou null.
 * 
 */
authProv.loadUserOrLogin = function(pCb, pCbThis, pForceCheckServer, pLoginOptions) {
	if(!this.fUser || pForceCheckServer) {
		//controle de l'auth par le serveur
		var vThis = this;
		xLoadUser(function(pEvt){
			if (pEvt.target.status == 200) {
				try {
					var vNewTxt = pEvt.target.responseText;
					//console.log("authProv.loadUserOrLogin:::::::::::"+vNewTxt);
					if (vNewTxt != vThis.fTxtUser) {
						vThis.fUser = JSON.parse(vNewTxt);
						vThis.fTxtUser = vNewTxt;
						vThis.authListeners.dispatch(vThis.fUser);
					}
					if (pCb) pCb.call(pCbThis, vThis.fUser);
				} catch (e) {
					console.log(e);
					vThis.fTxtUser = null;
					vThis.fUser = null;
					if (pCb) vThis.forceLogin(pCb, pCbThis, pLoginOptions);
				}
			} else if (pEvt.target.status == 403) {
				var vOpts = pLoginOptions ? Object.create(pLoginOptions) : {};
				vOpts.cause = pEvt.target.getResponseHeader("scAuthFailed") || "otherFailure";
				vThis.forceLogin(pCb, pCbThis, vOpts);
			} else {
				vThis.forceLogin(pCb, pCbThis, pLoginOptions);
			}
		});
	} else if(this.fUser) {
		if (pCb) pCb.call(pCbThis, this.fUser);
	} else {
		this.forceLogin(pCb, pCbThis, pLoginOptions);
	}
}

/** 
 * @API AuthProv. Impose l'écran de login, même si un user est déjà connecté : le user actuel n' a 
 * pas les droits requis, on propose à l'utilisateur de se connecter avec un autre compte. 
 * Paramètre de la callback : user connecté ou null.
 * 
 * @param pLoginOptions : voir Web_Commons/back/commons/dialogs/loginDialog.html
 * 
 */
authProv.forceLogin = function(pCb, pCbThis, pLoginOptions) {
	var vCtx = {
		lastAccount : utils.getLocalStorage().scUserAccount
	}

	var vAuthProv = this;
	var vCbLogin = {
		/**
		 * Méthode appelée par l'écran de login.
		 * Données dans pUiDatas :
		 * - account
		 * - password
		 * - maxAge : [optionnel] durée de vie du cookie
		 */
		tryAuth : function(pUiDatas, pCbIfError, pCbIfErrorThis) {
			var vJson = {nickOrAccount: pUiDatas.account, currentPwd: pUiDatas.password};
			if(pUiDatas.maxAge) vJson.cookieMaxAge = pUiDatas.maxAge;
 			var vReq = io.openHttpRequest(vAuthProv.getAuthServerUrl() + vAuthProv.fPaths.login, "POST");
			vReq.onloadend = function(pEvt){
				try {
					if (pEvt.target.status == 200) {
						//console.log("authProv.tryAuth::::"+pEvt.target.responseText);
						var vResp = JSON.parse(pEvt.target.responseText);
						if(vResp.result === "logged" || typeof vResp.result == "object" /* session infos (distrib) */) {
							vCbLogin.fDialogNode.removeDialog();
							utils.getLocalStorage().scUserAccount = pUiDatas.account;
							vAuthProv.loadUser(pCb, pCbThis, true);
							return;
						}
						switch (vResp.result){
							case "accountDisabled" :
								pCbIfError.call(pCbIfErrorThis, vResp.result, vResp.secondaryResults ? vResp.secondaryResults.disabledEndDt : null);
								return;
							default :
								pCbIfError.call(pCbIfErrorThis, vResp.result);
								return;
						}
					}
				} catch(e){
					console.log(e);
				}
				//echec
				pCbIfError.call(pCbIfErrorThis, "otherFailure");
			};
			vReq.send(JSON.stringify(vJson));
		},
		tryRenewPwd : function(pUiDatas, pCbIfError, pCbIfErrorThis){
			var vJson = {account: pUiDatas.account, currentPwd: pUiDatas.currentPwd, password: pUiDatas.password};
			if(pUiDatas.maxAge) vJson.cookieMaxAge = pUiDatas.maxAge;
			var vReq = io.openHttpRequest(vAuthProv.getAuthServerUrl() + vAuthProv.fPaths.renewPwd, "POST");
			vReq.onloadend = function(pEvt){
				try {
					if(pEvt.target.status==200) {
						var vResp = JSON.parse(pEvt.target.responseText);
						if(vResp.result == "updated" || typeof vResp.result == "object" /* session infos (distrib) */) {
							vCbLogin.fDialogNode.removeDialog();
							vAuthProv.loadUser(pCb, pCbThis, true);
							return;
						}
						switch(vResp.result) {
							case "accountDisabled" :
								var vDisabledDt = vResp.secondaryResults ? vResp.secondaryResults.disabledEndDt : null;
								pCbIfError.call(pCbIfErrorThis, vResp.result, vDisabledDt);
								break;
							case "failedInvalidDatas" :
								pCbIfError.call(pCbIfErrorThis, vResp.result, vResp.secondaryResults ? vResp.secondaryResults.msgs : null);
								break;
							default:
								pCbIfError.call(pCbIfErrorThis, vResp.result);
						}
					} else {
						pCbIfError.call(pCbIfErrorThis, "otherFailure");
					}
				} catch(e) { pCbIfError.call(pCbIfErrorThis, "otherFailure"); console.log(e);}
			};
			vReq.send(JSON.stringify(vJson));
		},
		checkPwd : function(pDatas, pCbIfError, pCbIfErrorThis){
			var vReq = io.openHttpRequest(vAuthProv.getAuthServerUrl() + vAuthProv.fPaths.checkPwd, "POST");
			vReq.onloadend = function(pEvt){
				try {
					if(pEvt.target.status==200) {
						var vResp = JSON.parse(pEvt.target.responseText);
						switch(vResp.result) {
							case "accountDisabled" :
								pCbIfError.call(pCbIfErrorThis, vResp.result, vResp.secondaryResults ? vResp.secondaryResults.disabledEndDt : null);
								break;
							case "failedInvalidDatas" :
								pCbIfError.call(pCbIfErrorThis, vResp.result, vResp.secondaryResults ? vResp.secondaryResults.msgs : null);
								break;
							default:
								pCbIfError.call(pCbIfErrorThis, vResp.result);
						}
					} else {
						pCbIfError.call(pCbIfErrorThis, "otherFailure");
					}
				} catch(e) { pCbIfError.call(pCbIfErrorThis, "otherFailure"); console.log(e);}
			};
			vReq.send(JSON.stringify({account: pDatas.account, password: pDatas.password, currentPwd: pDatas.currentPwd}));
		},

		/**
		 * Paramètre de la cb :
		 * 	pResult : {result:"xxx"} où xxx est : "instructionsSent", "accountNotFound", "authRejected", "datasNotAvailable" , "otherFailure"
		 */
		askForPasswordLost : function(pAccount, pCbIfError, pCbIfErrorThis) {
			if(!pAccount) throw "askForPasswordLost : no account";
			var vPasswordLostUrl = "";
			if(extPoints.getPref("auth.foreignPasswordLostUrl")){
				vPasswordLostUrl = extPoints.getPref("auth.foreignPasswordLostUrl");
			}else{
				vPasswordLostUrl = extPoints.getPref("auth.serverUrl") + vAuthProv.fPaths.pwdLost;
			}
			var vReq = io.openHttpRequest(vPasswordLostUrl + "&param="+encodeURIComponent(pAccount));
			vReq.onloadend = io.jsonXhrCb(function(pJson, pErr){ 
				if(pErr) console.log("askForPasswordLost failed : "+pErr);
				if(!pJson) pJson = {result:"otherFailure"};
				if(pCbIfError) pCbIfError.call(pCbIfErrorThis, pJson);
			});
			vReq.send();
		},
		
		/** Demande d'abandon de l'auth par le user. */
		cancel : function() {
			vCbLogin.fDialogNode.removeDialog();
		}
	}
	var vBd = dom.newBd(document.body);
	vCbLogin.fDialogNode = vBd.elt("sc-dialog").current();
	var vArea = extPoints.getSvc("area.login");
	vArea.loadLibs(function(){
		var vWidget = vArea.buildBody(vBd, vCtx, pLoginOptions);
		vWidget.initLoginDialog(vCtx, pLoginOptions, vCbLogin);
	}, this);
}

/** @API AuthProv. Déconnecte le user en cours. */
authProv.logout = function(){
	this.fUser = null;
	this.fTxtUser = null;
	var vReq = io.openHttpRequest(this.getAuthServerUrl() + this.fPaths.logout, "POST");
	vReq.setRequestHeader("X-SC-AUTH", "403");
	var vThis = this;
	vReq.onloadend = function(pEvt){
		vThis.authListeners.dispatch(null);
	}
	vReq.send();
}

/** @API AuthProv. Listeners pour les chagements relatif au user connecté. 
 * Les listeners implémentent la function onCurrentUserChange(pNewUser)
 * où pNewUser est null dans le cas d'un logout ou d'une perte d'auth.
 */
authProv.authListeners = new utils.ListenerMgr(function(pNewUser){
	try {
		this.onCurrentUserChange(pNewUser);
	} catch(e){
		console.log("onCurrentUserChange() failed in '" + this + "'\n" + e);
	}
});

/** @API AuthProv. URL du serveur d'auth utilisé.
 */
authProv.getAuthServerUrl = function(){
	return extPoints.getPref("auth.serverUrl");
}



//  ###   internal  ###
xLoadUser = function(pCb) {
	var vReq = io.openHttpRequest(authProv.getAuthServerUrl() + authProv.fPaths.currentUser);
	vReq.setRequestHeader("X-SC-AUTH", "403");
	vReq.onloadend = pCb;
	vReq.send();
}

return authProv})();  //Commenter pour dev.
