
	extPoints.initAsRoot();
//

		extPoints.addToList("store:navigateViews", "browser", 1, new areas.Area("browser")
			.setPermissions(security.getGPerm("ui.depotBrowseView"))
			.setLibs({"sc-browseview": "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/webfrm/-wbk/6.1.10.202401191026/store/views/browseView.html"})
			.setBuildBody(function(pBd, pCtx, pOpts) {
				return pBd.elt("sc-browseview").att("labelTitle", "Parcourir" ).att("flex", "1").att("icon", "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/webfrm/-wsk/6.1.10.202401191026/store/img/browseTree.png").currentUp();
			})
		, 10);
	



	extPoints.addSvcToList("dptbrowser:global:actions", "actionCreateFolder", 11, "actionCreateCustomFolder", 30);

////
			extPoints.registerSvc("prc_folder", 1, new store.Processing("folder").setFolder(true).setNoContent(true).setVersionning("none")
			.setLabel("Dossier")
			.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/webfrm/-wsk/6.1.10.202401191026/commons/fileIcon/folder.png"));
			
				
				extPoints.addSvcToList("store:showRes:tabs:prc:folder", "infos", 1, "showResInfosTab", 100);
				
				extPoints.addSvcToList("store:showRes:tabs:prc:folder", "import", 1, "showResImportTab", 300);
			
			
				extPoints.addToList("store:showRes:tabs:prc:folder", "edit", 11, null);
			
			extPoints.addSvcToList("store:prcs", "folder", 21, "prc_folder", 1);
			extPoints.addToList("searchRes:prcs", "folder", 21, null);

			////
		extPoints.registerSvc("prc_undefined", 1, new store.Processing("undefined").setFolder(null)
		.setLabel("Inconnu")
		.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/webfrm/-wsk/6.1.10.202401191026/commons/fileIcon/default.png"));
		
			
			extPoints.addSvcToList("store:showRes:tabs:prc:undefined", "infos", 1, "showResInfosTab", 100);
			
			extPoints.addSvcToList("store:showRes:tabs:prc:undefined", "edit", 1, "showResEditTab", 200);
			
			extPoints.addSvcToList("store:showRes:tabs:prc:undefined", "import", 1, "showResImportTab", 300);
		
		extPoints.addToList("store:fields:prc:undefined", "download", 1, js.create(new areas.Area("download").setLabel("Téléchargement").setBuildBody(function(pBd, pContext, pOptions){
			areas.buildLabelFrame(this, pBd, pContext, pOptions);
			return pBd.elt("a", "download").att("href", pContext.nodeInfos.publicUrl + "?download").text("Fichier original").currentUp();
		}), store.mixinShowFieldForArea), 1000);
		//
		
					extPoints.registerSvc("prc_dtmodel", 21, new store.Processing("dtmodel")
						.setLabel("DT Modèle")
						.setExts(["scar"])
						.setVersionning("none")
						
						.setFolder(true)
						
					);
					extPoints.addSvcToList("store:prcs", "dtmodel", 21, "prc_dtmodel", 1);
					
						extPoints.addToList("uploadRes:prcs", "dtmodel", 21, null);
					
	
		
					extPoints.registerSvc("prc_file", 21, new store.Processing("file")
						.setLabel("Fichier")
						
						.setVersionning("none")
						
					);
					extPoints.addSvcToList("store:prcs", "file", 21, "prc_file", 2);
					
	
		
		extPoints.addToList("store:showRes:tabs:prc:dtmodel", "infosTabFW4vjOVNgKsBvqJJTL9uj", 1, new areas.SvcAreaWrapper("showResInfosTab_prc")
			.setWrappedSvcCd("showResInfosTab")
			.setLabel("Informations")
		, 1);
	
	
		
		extPoints.addToList("store:showRes:tabs:prc:file", "infosTabiBBug6yzVLe8xvc2m6v7Si", 1, new areas.SvcAreaWrapper("showResInfosTab_prc")
			.setWrappedSvcCd("showResInfosTab")
			.setLabel("Informations")
		, 1);
	
	
	
	
	
	
	
	
	
	
	

		
		extPoints.addToList("store:fields:prc:dtmodel", "srcUri__info",
			1,
			new store.Field("srcUri")
				.setLabel("srcUri")
				
				.setShowArea(
		new areas.InputArea("srcUri").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1001);
	
		extPoints.addToList("store:fields:prc:dtmodel", "uid__info",
			1,
			new store.Field("uid")
				.setLabel("UID")
				
				.setShowArea(
		new areas.InputArea("uid").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true)
					.setRequired(true)
				, true, '')
				,
		1002);
	
			//
			extPoints.addToList("store:fields:prc:dtmodel", "_holderFieldN15",
				1,
				js.create(new areas.Area("state").setLabel("Traitements").setVisible(function(pContext){
					var vState = pContext.nodeInfos.metas.state;
					return vState=="new" || vState=="failure";
				}).setBuildBody(function(pBd, pContext, pOptions){
				areas.buildLabelFrame(this, pBd, pContext, pOptions);
				pBd.elt("span");
				switch(pContext.nodeInfos.metas.state) {
				case "new" :
					pBd.elt("span", "downloadInfo").text("Transformations en cours...").up();
					break;
				case "failure" :
					pBd.elt("span", "downloadInfo").text("Des transformations ont échoué").up();
					break;
				}
				return pBd.currentUp();
			}), store.mixinShowFieldForArea), 1000);
			//
		
	
		
	//
(function(){
var vPathField = new store.DepotPathField()
	.setLabels("Nom", "Dossier parent")
	.setDescriptions(function(pCtx){return pCtx.processing.isFolder() ? "Nom du dossier" : "Nom du document"},
					function(pCtx){return pCtx.processing.isFolder() ? "Dossier parent contenant ce dossier" : "Dossier contenant le document"})
	.setShowArea(new areas.InputArea("path")
					.setLabel("Chemin")
					.setDescription(function(pCtx){return pCtx.processing.isFolder() ? "Chemin du dossier": "Chemin du document"})
					.setReadOnly(true)
					.setTag("input", "input-text", {"class":"fieldValue"})
	);
vPathField.getInputArea().setReadOnlyOnFolder(true);

extPoints.registerSvc("field_path", 1, vPathField);
extPoints.addSvcToList("store:fields:system", "path", 1, "field_path", 10);

extPoints.addToList("store:fields:system", "publicLink", 1, js.create(new areas.Area("publicLink").setLabel("URL").setBuildBody(function(pBd, pContext, pOptions){
	areas.buildLabelFrame(this, pBd, pContext, pOptions);
	return pBd.elt("a", "fieldValue").att("href", pContext.nodeInfos.publicUrl).att("title", this.getLabel(pContext)).att("target", "_blank").text(pContext.nodeInfos.publicUrl).currentUp();
}), store.mixinShowFieldForArea), 20);

extPoints.addToList("store:fields:system", "permaLink", 1, js.create(new areas.Area("permaLink").setLabel("Lien permanent").setBuildBody(function(pBd, pContext, pOptions){
	areas.buildLabelFrame(this, pBd, pContext, pOptions);
	return pBd.elt("a", "fieldValue").att("href", pContext.nodeInfos.permaLink).att("title", this.getLabel(pContext)).att("target", "_blank").text(pContext.nodeInfos.permaLink).currentUp();
}).setVisible(function(pContext){
	if(pContext.nodeInfos.permaLink==pContext.nodeInfos.publicUrl) return false;
	return this.checkPermissions(pContext);
}), store.mixinShowFieldForArea), 30);

extPoints.addToList("store:fields:system", "dates", 1, new store.ModifDatesField().setLabel("Modification").setDescription("Date de dernière modification"), 40);

extPoints.addToList("store:fields:system", "trashed", 1, js.create(new areas.Area("trashed").setLabel("État").setVisible(function(pContext){
	var vPrc = store.getProcessing(pContext.nodeInfos.prc);
	if(!extPoints.getPref("store.field.forceShowResActions", false) && vPrc.getVersionning()!==store.Versionning.VCB && !pContext.nodeInfos.trashed) {
		return false;
	}
	return areas.Area.prototype.isVisible(pContext);
}).setBuildBody(function(pBd, pContext, pOptions){
	var vPrc = store.getProcessing(pContext.nodeInfos.prc);
	areas.buildLabelFrame(this, pBd, pContext, pOptions);
	var vBd = pBd.elt("sc-hbox", "align-center");
	vBd.elt("span", "fieldValue").text(pContext.nodeInfos.trashed ? "En corbeille" : "Visible").up();
	//pContext.browser.openFolder(pContext.browser.fCurrentPath);
	if(extPoints.getPref("store.field.forceShowResActions", false) || vPrc.getVersionning()===store.Versionning.VCB){
		var vContext = {};
		Object.assign(vContext, pContext);
		vContext.actionCb = function(pSuccess){
			pContext.showResView.showResPath(pContext.nodeInfos.path, vPrc.getVersionning()!==store.Versionning.none, true);
		}
		vContext.actionCbThis = this;
		vBd.elt("sc-btn").prop("actionContext", vContext).att("svcAction", "actionStoreMoveToTrash").style("margin", "3px").up();
		vBd.elt("sc-btn").prop("actionContext", vContext).att("svcAction", "actionStoreRestoreFromTrash").style("margin", "3px").up();	
		vBd.elt("sc-btn").prop("actionContext", vContext).att("svcAction", "actionStoreRemoveRes").style("margin", "3px").up();
	}				
	return vBd.currentUp();
}), store.mixinShowFieldForArea), 1);

extPoints.addToList("store:fields:system", "showPrc", 1, new store.ShowProcessingField()	.setLabel("Traitement"), 50);
})();
//

// # Déclaration des rôles
// - Rôles imposés par le portlet
extPoints.addRolePermList([
			{ "role": "webUser", "priority":1, "superRole": "~default", "allow":["read.UTNode.webView"], "deny":["DO"]}
		], 1);
	
// -  Rôles spécifiés
	extPoints.addRolePermList([{"role":"~default","priority":0,"allow":["DATA","dialog.adminUser#List"],"deny":["DO","role.main:admin.applyOn.group#show","role.hideWspApp.applyOn.wsp#show","role.hideWspDocApp.applyOn.wsp#show","role.main:admin.applyOn.wsp#show","role.hideWspApp.applyOn.space#show","role.hideWspDocApp.applyOn.space#show","role.main:admin.applyOn.space#show"]}], 21);extPoints.addRolePermList([{"role":"main:author","title":"Auteur","sortKey":"20","priority":1,"setPerm":"role.main:author#set","superRole":"main:reader","allow":["write"]}], 21);extPoints.addRolePermList([{"role":"main:manager","title":"Gestionnaire fonctionnel","sortKey":"30","priority":1,"setPerm":"role.main:manager#set","superRole":"main:author","allow":["admin"],"deny":["roles.adminSyst#set","admin.props.isHidden.user"]}], 21);extPoints.addRolePermList([{"role":"main:system","priority":1,"allow":["adminSyst","deploy","dialog.ping#Ping","admin.liaise","install.skinPack","admin.Container"],"deny":["DO"]}], 21);extPoints.addRolePermList([{"role":"main:admin","title":"Administrateur technique","sortKey":"40","priority":1,"setPerm":"role.main:admin#set","superRole":"~default","allow":["DO","~actionsSystem"]}], 21);extPoints.addRolePermList([{"role":"main:none","title":"Aucun","sortKey":"1","priority":1,"setPerm":"role.main:none#set","superRole":"main:~fallback"}], 21);extPoints.addRolePermList([{"role":"main:reader","title":"Lecteur","sortKey":"10","priority":1,"setPerm":"role.main:reader#set","superRole":"~default","allow":["read","use","server.storeChanges#Listen"],"deny":["ui.app.wspDoc.create.doc","ui.app.wspDoc.change.doc","ui.wspApp","ui.wspsPlg","view.depot"]}], 21);
	
//


	
extPoints.registerSvc("area.login", 11, new areas.Area("login").setBuildBody(function(pBd, pCtx, pOptions){
		return pBd.elt("sc-loginDialog").currentUp();
}).setLibs({"sc-loginDialog": "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/webfrm/-wbk/6.1.10.202401191026/commons/dialogs/loginDialog.html"}));
extPoints.setPref("auth.serverUrl", 1, "https://studio-paon.edrlab.org/~~write");
authProv.initAuthProv({});

//
							//
							extPoints.setPref("password.lost.label", 1, "Mot de passe perdu ?");
							extPoints.setPref("auth.foreignPasswordLostUrl", 1, "https://studio-paon.edrlab.org/~~chain/public/u/pwdLost?cdaction=AskForUpdate");
							//
						//
	// # Déclaration des rôles UI
	extPoints.addToList(	"user:roles",	"main:author",	21, new areas.InputArea("main:author").setLabel("Auteur").setTag("input", "input-radio", {class:"fieldValue -uu",group:"main"}),	"a_20");extPoints.addToList(	"user:roles",	"main:manager",	21, new areas.InputArea("main:manager").setLabel("Gestionnaire fonctionnel").setTag("input", "input-radio", {class:"fieldValue -uu",group:"main"}),	"a_30");extPoints.addToList(	"user:roles",	"main:admin",	21, new areas.InputArea("main:admin").setLabel("Administrateur technique").setTag("input", "input-radio", {class:"fieldValue -uu",group:"main"}),	"a_40");extPoints.addToList(	"user:roles",	"main:none",	21, new areas.InputArea("main:none").setLabel("Aucun").setTag("input", "input-radio", {class:"fieldValue -uu",group:"main"}),	"a_1");extPoints.addToList(	"user:roles",	"main:reader",	21, new areas.InputArea("main:reader").setLabel("Lecteur").setTag("input", "input-radio", {class:"fieldValue -uu",group:"main"}),	"a_10");
//
//
	extPoints.getSvcLazy("jobs", function(pSvc) {
		// - Recalcul des vues
		
		
		// - Supprimer les documents en corbeille
		extPoints.addToList("adminView:jobs", "removeTrashed", 1, new pSvc.RelaunchCidTasksJob("removeTrashed")
			.setLabel("Supprimer les documents en corbeille")
			.setFilterTrashedRes(false)
			.setCreateJobBtnLabel("Supprimer")
			.setCreateJobConfirmMsg("Confirmez-vous la suppression définitive des documents en corbeille ?")
			.appendFreeJobData(function(pDataObj){
				if(!pDataObj.preconditions){
					pDataObj.preconditions = "persistMeta(trashed,true)";
				}else{
					pDataObj.preconditions += "&persistMeta(trashed,true)";
				}
				pDataObj.updatePersistMetas = [{action: "replace", key:"action", value:"remove"}];
			})
			.addChoiceCondPersistMeta("path", "Chemin du document")
			.setStopAfterFailures(50)
		, 20);
		
		
			// - Rebuild ES
			extPoints.addToList("adminView:jobs", "rebuildIndexES", 1, new pSvc.RelaunchCidTasksJob("rebuildIndexES")
				.setLabel("Indexation Elasticsearch")
				.setCreateJobBtnLabel("Réindexer")
				.setCreateJobConfirmMsg("Confirmez-vous la réindexation des documents ?")
				
				
					
					.addChoiceProcessing("dtmodel", "DT Modèle", false)
				
					
					.addChoiceProcessing("file", "Fichier", false)
				
				.setForceContentIndexValue(true)
				.setStopAfterFailures(50)
			, 20);
		
				
	}, this, "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/webfrm/-wlb/6.1.10.202401191026/desk/svcs/jobs.js");	
////
window.urlTreeUrl = "https://studio-paon.edrlab.org";
window.writeServerUrl = "https://studio-paon.edrlab.org/~~write/web";
window.storeProv = new store.StoreProvider().initStore({
	urlTreeUrl :  "https://studio-paon.edrlab.org",
	writeUrl : "https://studio-paon.edrlab.org/~~write/web",
	adminUrlTreeUrl : "https://studio-paon.edrlab.org/~~write/adminTree",
	
	esIndexMap : {"depot" : "/depot"},
	searchUrl : "https://studio-paon.edrlab.org/~~search",
	
	canTrashRes : false,
	canUnlistRes : false
});
//