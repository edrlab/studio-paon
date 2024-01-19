/**
 * Utilitaires pour la construction d'un objet global "window.desk" destiné à coordonner les actions au niveau de la window.
 * 
 * L'objetcif de cette librairie est de centraliser / mutualiser le code définissant le comportement d'un desk 
 * tout en permettant une très grande souplesse dans l'adaptation de l'objet desk à chaque situation. 
 * 
 * Le principe général pour l'initialisation d'un desk est de toujours distinguer la déclaration
 * de l'exécution en deux phases isolées afin de permettre d'injecter des modifications par rapport
 * au comportement standard avant la phase d'exécution.
 * 
 * Exemple minimal d'usage :
 *<pre>
 *		//Création du desk et de son contexte
 *		deskUtils.createDesk(window);
 *
 *		//Ajout de features
 *		deskUtils.addFeatureCanCloseDesk(window);
 *		
 *		//Lancement du desk
 *		deskUtils.launchDesk(window);		
 *</pre>
 *
 */
 
//var deskUtils = (function(){ //Commenter pour dev.
	
var deskUtils = {};

/**
 * Création du desk.
 * 
 * @param pWindow Fenêtre à laquelle associer un desk. 
 * @param pDeskName [optionnel] force un nom de desk différent du nom de la page HTML associé à ce desk.
 */
deskUtils.createDesk = function(pWindow, pDeskName) {
	pWindow.desk = new DeskBase(pWindow, pDeskName);
}

/**
 * Ajoute la feature canCloseDesk à un desk.
 * 
 * Pour interroger si le desk peut être clos (retourne true ou false) :
 * desk.canCloseDesk(pSilentMode);
 * 
 * Pour ajouter un listener pour empecher la fermeture du desk :
 * desk.canCloseDeskListeners.add({canCloseDesk:function(pSilentMode){return true;}});
 * 
 * Pour supprimer un listener :
 * desk.canCloseDeskListeners.remove(vListener);
 */
deskUtils.addFeatureCanCloseDesk = function(pWindow) {
	var desk = pWindow.desk;
	desk.canCloseDesk = function canCloseDesk(pSilentMode){
		return this.canCloseDeskListeners.dispatch(pSilentMode);
	};
	desk.canCloseDeskListeners = new utils.ListenerMgr();
	desk.canCloseDeskListeners.dispatch = function (pSilentMode) {
		if(!this.fListeners) return true;
		for(var vK in this.fListeners) {
			try {
				if( ! this.fListeners[vK].canCloseDesk(pSilentMode)) return false;
			} catch(e){
				log.debug("canCloseDesk() failed in '" + this.fListeners[vK] + "' : " + e);
			}
		}
		return true;
	};
	pWindow.extPoints.addToList("initCloseWindowController", 1, function initCloseWindowController(){
		//this=initDesk
		this.fWindow.document.addEventListener("beforeunload", function onWindowClose(pEvent){
				if(! pEvent.currentTarget.desk.canCloseDesk(true)) {
					pEvent.preventDefault(); 
					return "Vos actions en cours seront perdues, souhaitez-vous vraiment fermer cette page ?";
				}
		}, false);	
	}, 0);
}


/**
 * Ajoute la feature de gestion du user connecté à un desk, en complément
 * des méthodes offertes par "authProv".
 * Initialise le user au début du chargement.
 * Ajoute les méthodes suivantes : 
 * desk.userAnonmymousAllowed boolean
 * desk.authListeners ListenerMgr équivalent à authProv.authListeners, mais local à ce desk.
 * desk.onAuthFailed() [ ! pAllowAnonymous] appelable lorsque l'authentification a échouée.
 * desk.onAuthLost() appelable lorsque l'authentification n'apparait plus valide.
 * desk.onPermDenied() appelable lorsque les permissions sont insuffisantes pour accéder à ce desk.
 * 
 */
deskUtils.addFeatureUserMgr = function(pWindow, pAllowAnonymous, pPermsToCheck) {
	var desk = pWindow.desk;
	var authProv = pWindow.authProv;
	if(!authProv) throw "no authProv defined, deskUtils.addFeatureUserMgr() not available!";
	desk.userAnonmymousAllowed = pAllowAnonymous;
	desk.authListeners = authProv.authListeners //XXX si desk et authProv ne partagent pas le même ctx window, créer un listenerMgr avec abonnement à authProv.authListeners et redispatch.
	desk.onAuthFailed = function() {
		//L'auth est obligatoire, on retourne sur l'écran d'auth.
		if(!desk.userAnonmymousAllowed) authProv.forceLogin();
	}
	desk.onAuthLost = function() {
		authProv.loadUserOrLogin();
	}
	desk.onPermDenied = function() {
		var vAccount = authProv.getAccount();
		if(vAccount) {
			authProv.forceLogin(null, null, {account:"", msg: i18n.formatStr("Votre compte \'%s\' ne vous permet pas d\'accéder à cet écran.", vAccount)});
		} else {
			authProv.forceLogin(null, null, {msg: "Vous devez vous authentifier pour accéder à cet écran."});
		}
	}
	desk.authListeners.add({
		onCurrentUserChange : function(pUser) {
			if(pWindow.scSecurityCtx) {
				//on est plus en init, besoin de tout recharger.
				pWindow.location.reload(true);
				return;
			}
			if(!pUser && !desk.userAnonmymousAllowed) {
				desk.onAuthFailed();
				return;
			}
			var vUser = pUser || pWindow.authProv.getAnonymousUser();
			var vRoles;
			if(vUser) {
				if(vUser.inheritedRoles) {
					vRoles = vUser.refusedRoles ? vUser.inheritedRoles.filter((r) => vUser.refusedRoles.indexOf(r) === -1) : vUser.inheritedRoles.concat();
					if (vUser.grantedRoles) {
						vUser.grantedRoles.forEach((r) => {
							const sep = r.indexOf(':');
							if (sep > 0) {
								const categ = r.substring(0, sep + 1);
								vRoles = vRoles.filter((r2) => !r2.startsWith(categ));
								vRoles.push(r);
							} else {
								if (vRoles.indexOf(r) === -1) vRoles.push(r);
							}
						});
					}
				} else {
					vRoles = vUser.grantedRoles || [];
				}
			} else {
				vRoles = [];
			}
			pWindow.scSecurityCtx = new security.SecurityCtx(pWindow.extPoints, vUser ? vUser.account || "" : "", vRoles, null, vUser && vUser.isSuperAdmin);
			if(pPermsToCheck && ! pWindow.scSecurityCtx.hasPermForObjectRoot(pPermsToCheck)) {
				pWindow.desk.onPermDenied();
			}
		}
	});
	pWindow.extPoints.addToList(desk.fEventLoadDeskCode, "initUser", 1, function(pFcts, pOffset){
		function onUserInited(pUser) {
			// on continue le load
			pWindow.extPoints.callFunctions(pFcts, pOffset+1, 3, this);
		}
		if(desk.userAnonmymousAllowed) {
			authProv.loadUser(onUserInited);
		} else {
			authProv.loadUserOrLogin(onUserInited);
		}
		return false; //On stop le processus de load jusqu'à obtention des infos du user.
	}, -100 /* Le user courant doit être init très tôt, donc ordre de tri -100.*/);
}

/**
 * Initialise le scSecurityCtx pour la window sans user.
 * XXX autre usage que SCchain local ?
 */
deskUtils.initScSecurityCtxNoUser = function(pWindow) {
	pWindow.extPoints.addToList(pWindow.desk.fEventLoadDeskCode, "initScSecurityCtx", 1, function(){
		if(!pWindow.scSecurityCtx) pWindow.scSecurityCtx = new security.SecurityCtx(pWindow.extPoints);
	}, -10);
}

/**
 * Après l'ajout et la surcharge des features du desk et des extPoints, 
 * lance l'init global du desk.
 * 
 * IMPORTANT: cette méthode DOIT être appelée dans un script en fin de page.
 */
deskUtils.launchDesk = function(pWindow) {
		var desk = pWindow.desk;
		var extPoints = pWindow.extPoints;
		try {
			pWindow.addEventListener("WebComponentsReady", extPoints.callFunctionsFromLists.bind(extPoints, [desk.fEventLoadDeskCode, 'event:load:*'], 3, pWindow, null), false);	
			pWindow.addEventListener("unload", extPoints.callFunctionsFromLists.bind(extPoints, [desk.fEventUnloadDeskCode, 'event:unload:*'], 0, pWindow, null), false);
			extPoints.callFunctionsFromLists([desk.fEventInitWinDeskCode, 'event:initWin:*'], 0, pWindow);
		} catch(e){
			desk.onLaunchError(e);
		}
}

//#################### interne à deskUtils ##################

/**
 * Implémentation de base d'un desk.
 * Assume les features de base suivantes :
 * - getDeskName()
 * - getLaunchContext()
 * - getController() & isControllerExist()
 * - addDeskInfoListener() & removeDeskInfoListener()  & dispatchDeskInfo()
 * - isReadOnly()
 * - canCloseDesk(pSilentMode) en retournant toujours true.
 * 
 * @param pDeskName [optionnel] force un nom de desk différent du nom du fichier xul associé à ce desk.
 */
function DeskBase(pWindow, pDeskName) {
	this.fWindow = pWindow;
	this.fDeskName = pDeskName || pWindow.location.href.replace(/.*\/([^?]*)\..*(.*)?/, "$1") //pWindow.location.href.replace(/.*\/(.*)\..*(\?.*)?/, "$1");
	this.fEventInitWinDeskCode = "event:initWin:" + this.fDeskName;
	this.fEventLoadDeskCode = "event:load:" + this.fDeskName;
	this.fEventUnloadDeskCode = "event:unload:" + this.fDeskName;
	this.fController = {};
}

DeskBase.prototype = {
	
	/**
	 * Nom de ce desk à partir duquel les keys des extPoints vont être défnis :
	 * - "event:initWin:"+desk.getDeskName()
	 * - "event:load:"+desk.getDeskName()
	 * - "event:unload:"+desk.getDeskName()
	 * - etc
	 */
	getDeskName : function(){
		return this.fDeskName;
	},
	
	/** 
	 * Retourne un Controller de code pCd. 
	 * Un controller est un objet singleton pour le desk identifié par son code.
	 * Un controller est une instance d'une class obtenue par extPoints.getSvc(pCd).
	 * Le constructeur des class de type Controller admettent l'objet window du desk et le code du controller en paramètres.
	 */
	getController : function(pCd){
		var vCtrl = this.fController[pCd];
		if(!vCtrl) {
			//On cherche à instancier ce controller à partir de l'extPoints
			var vClass = this.fWindow.extPoints.getSvc(pCd);
			if(vClass) {
				this.fController[pCd] = vCtrl = new vClass(this.fWindow, pCd);
			} else {
				log.info("Controller '"+pCd+"' undefined in extPoints.");
			}
		}
		return vCtrl;
	},
	isControllerExist : function(pCd){
		return this.fController[pCd]!=null;
	},
	
	/**
	 * Dispatch une info relative à une évolution du desk.
	 * L'objet pInfoEvent doit au moins disposer d'une propriété "type" de type String
	 * spécifiant la nature de l'info.
	 * 
	 * Exemple d'objet InfoEvent : 
	 * {
	 * 	type : "contentViewChange",
	 *  fromSlot : ...,
	 *  newUriObject : ...
	 * }
	 * 
	 * Pour ajouter un listener à ces events :
	 * desk.addDeskInfoListener({onDeskInfo:function(pInfoEvent){...}});
	 * 
	 * Pour supprimer un listener :
	 * desk.removeDeskInfoListener(vListener);
	 * 
	 * Pour dispatcher un event susceptible d'interresser les autres composants du desk :
	 * desk.dispatchDeskInfo({type:"x"});
	 */
	addDeskInfoListener : function(pListener){
		if(!this.fDeskInfoListeners) {
			this.fDeskInfoListeners = new utils.ListenerMgr(function callDeskInfoListener(pInfoEvent){
				try {
					this.onDeskInfo(pInfoEvent);
				} catch(e){
					console.log("onDeskInfo() failed in '" + this + "'\n" + e);
				}
			});
		}
		this.fDeskInfoListeners.add(pListener);
	},
	removeDeskInfoListener : function(pListener){
		if(!this.fDeskInfoListeners) return;
		this.fDeskInfoListeners.remove(pListener);
	},
	dispatchDeskInfo : function(pInfoEvent){
		if(!this.fDeskInfoListeners) return;
		this.fDeskInfoListeners.dispatch(pInfoEvent);
	},
	
	/** Peut forcer tout le desk en mode readOnly (indépendamment des droits du user). */
	isReadOnly : function(){
		return this.fWindow.extPoints.getPref("desk.isReadOnly", false);
	},
	
	/** 
	 * Récupère le contexte de lancement de ce desk. 
	 **/
	getLaunchContext : function(){
		if( ! this.fLaunchContext) {
			// Recherche du contexte dans la queryString de l'URL de la fenetre.
			this.fLaunchContext = io.parseQueryString(this.fWindow.location.search);
		}
		return this.fLaunchContext;
	},
	
	/**
	 * Retourne la window du desk.
	 */
	getWindow : function(){
		return this.fWindow;
	},
	
	/**
	 * Fake qui retourne toujours true.
	 * Utiliser deskUtils.addFeatureCanCloseDesk(window) pour obtenir une implémentation
	 * avec listeners...
	 */
	canCloseDesk : function(){
		return true;
	},
	
	/**
	 * Traitement en cas d'exception au cours de launchDesk().
	 * Par défaut, l'exception est publiée dans les logs.
	 * Les messages d'erreurs pour les utilisateurs doivent être effectués
	 * en amont.
	 * La méthode peut-etre surchargée pour rediriger vers une autre page.
	 * 
	 * @param e Exception.
	 */
	onLaunchError : function(e){
		console.log("deskInit.launchDesk failed:: "+e);
	}
}

//return deskUtils;})();  //Commenter pour dev.
