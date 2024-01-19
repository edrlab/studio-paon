
				import "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/basis_Perms.js"
				import {LANG} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js";
				import {Desk} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js";
				import * as LITHTML from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/htmlLit.js";
				import { AuthEndPoint, IO, PublicEndPoint } from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js";
				import * as ACTIONS from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js";
				import { DepotUniverse } from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/depot.js";
				import { ResType } from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/res.js";
				import * as RES_VIEW_AREAS from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/areas/resViewAreas.js";
				import * as RES_ACTIONS from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/actions/resActions.js";
				import * as AREAS from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js";
			
import "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/store_Perms.js";
export function init(reg, authReg, allPrlRegs, ovrUnivConf){

					
reg.newPerm("~actionsSystem", "admin.UTNode", null);
reg.newPerm("roles.use", "DATA", null);
reg.newPerm("roles.use#set", "roles.use", null);
reg.newPerm("roles.use#show", "roles.use", null);
reg.newPerm("roles.adminSyst", "DATA", null);
reg.newPerm("roles.adminSyst#set", "roles.adminSyst", null);
reg.newPerm("roles.adminSyst#show", "roles.adminSyst", null);
reg.newPerm("role.main:author#set", "roles.use#set", null);
reg.newPerm("role.main:author#show", "roles.use#show", null);
reg.newPerm("role.main:manager#set", "roles.use#set", null);
reg.newPerm("role.main:manager#show", "roles.use#show", null);
reg.newPerm("role.main:admin#set", "roles.adminSyst#set", null);
reg.newPerm("role.main:admin#show", "roles.adminSyst#show", null);
reg.newPerm("role.main:none#set", "roles.use#set", null);
reg.newPerm("role.main:none#show", "roles.use#show", null);
reg.newPerm("role.main:reader#set", "roles.use#set", null);
reg.newPerm("role.main:reader#show", "roles.use#show", null);
reg.addRolePermList([{"role":"~default","priority":0,"allow":["DATA","dialog.adminUser#List"],"deny":["DO","role.main:admin.applyOn.group#show","role.hideWspApp.applyOn.wsp#show","role.hideWspDocApp.applyOn.wsp#show","role.main:admin.applyOn.wsp#show","role.hideWspApp.applyOn.space#show","role.hideWspDocApp.applyOn.space#show","role.main:admin.applyOn.space#show"]}], 21);
reg.addRolePermList([{"role":"main:author","title":"Auteur","sortKey":"20","priority":1,"setPerm":"role.main:author#set","superRole":"main:reader","allow":["write"]}], 21);
reg.addRolePermList([{"role":"main:manager","title":"Gestionnaire fonctionnel","sortKey":"30","priority":1,"setPerm":"role.main:manager#set","superRole":"main:author","allow":["admin"],"deny":["roles.adminSyst#set","admin.props.isHidden.user"]}], 21);
reg.addRolePermList([{"role":"main:system","priority":1,"allow":["adminSyst","deploy","dialog.ping#Ping","admin.liaise","install.skinPack","admin.Container"],"deny":["DO"]}], 21);
reg.addRolePermList([{"role":"main:admin","title":"Administrateur technique","sortKey":"40","priority":1,"setPerm":"role.main:admin#set","superRole":"~default","allow":["DO","~actionsSystem"]}], 21);
reg.addRolePermList([{"role":"main:none","title":"Aucun","sortKey":"1","priority":1,"setPerm":"role.main:none#set","superRole":"main:~fallback"}], 21);
reg.addRolePermList([{"role":"main:reader","title":"Lecteur","sortKey":"10","priority":1,"setPerm":"role.main:reader#set","superRole":"~default","allow":["read","use","server.storeChanges#Listen"],"deny":["ui.app.wspDoc.create.doc","ui.app.wspDoc.change.doc","ui.wspApp","ui.wspsPlg","view.depot"]}], 21);
				
					
reg.addToList("user:roles", "main:author", 21, new Promise(async function(resolve){
const {RoleEditUiHandler} = await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/roles.js");
resolve(new RoleEditUiHandler("main:author").setLabel("Auteur"));
}),20);
			
reg.addToList("user:roles", "main:manager", 21, new Promise(async function(resolve){
const {RoleEditUiHandler} = await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/roles.js");
resolve(new RoleEditUiHandler("main:manager").setLabel("Gestionnaire fonctionnel"));
}),30);
			
reg.addToList("user:roles", "main:admin", 21, new Promise(async function(resolve){
const {RoleEditUiHandler} = await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/roles.js");
resolve(new RoleEditUiHandler("main:admin").setLabel("Administrateur technique"));
}),40);
			
reg.addToList("user:roles", "main:none", 21, new Promise(async function(resolve){
const {RoleEditUiHandler} = await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/roles.js");
resolve(new RoleEditUiHandler("main:none").setLabel("Aucun"));
}),1);
			
reg.addToList("user:roles", "main:reader", 21, new Promise(async function(resolve){
const {RoleEditUiHandler} = await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/roles.js");
resolve(new RoleEditUiHandler("main:reader").setLabel("Lecteur"));
}),10);
			
				
					// - clean trashed
					reg.addToList("executor:jobs:factories",
						"md-removeTrashed",
						21,
						new Promise(async (resolve)=>{
							const {RemoveTrashedJobFactory} = await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/jobs.js");
							resolve(new RemoveTrashedJobFactory());
						})
					);
					
					
						reg.addToList("executor:jobs:factories",
							"md-updtRes2Ready",
							21,
							new Promise(async (resolve)=>{
								const {UiJobFactory} = await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/executor.js");
								const jobFactory = new UiJobFactory();
								jobFactory
									.setLabel("Construction des vues...")
									.setDescription((ctx)=>{
										const path = (ctx.job && ctx.job.jobProps) ? ctx.job.jobProps.path : "";
										return `Ressource : '${path}'`}
									)
									.setUiJobSng(['updtRes2Ready'])
									.setJobFactoryCode('updtRes2Ready');
								resolve(jobFactory);
							})
						);
						reg.addToList("executor:jobs:factories",
							"md-updtRes2Failure",
							21,
							new Promise(async (resolve)=>{
								const {UiJobFactory} = await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/executor.js");
								const jobFactory = new UiJobFactory();
								jobFactory
									.setLabel("Construction des vues - échec")
									.setDescription((ctx)=>{
										const path = (ctx.job && ctx.job.jobProps) ? ctx.job.jobProps.path : "";
										return `Ressource : '${path}'`}
									)
									.setUiJobSng(['updtRes2Failure'])
									.setJobFactoryCode('updtRes2Failure');
								resolve(jobFactory);
							})
						);
					

					
						// - Rebuild ES
						reg.addToList("executor:jobs:factories",
							"md-rebuildEsIndex",
							21,
							new Promise(async (resolve)=>{
								const {RebuildEsIndexJobFactory} = await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/jobs.js");
								let jobFactory = new RebuildEsIndexJobFactory();
								
									
									jobFactory.addChoiceProcessing("dtmodel", "DT Modèle", false);
								
									
									jobFactory.addChoiceProcessing("file", "Fichier", false);
								
								
								resolve(jobFactory);
							})
						);
					
					
		
		reg.addToList("executor:jobs:factories",
		"md-remakeAllAsNewContent",
		21,
		new Promise(async (resolve)=>{
		const {ContentAsNewJobFactory} = await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/jobs.js");
		let jobFactory = new ContentAsNewJobFactory();
		const jobBuilder = jobFactory.getJobBuilder();
		
			jobFactory.addChoiceProcessing("dtmodel", "DT Modèle", false);
		
			jobFactory.addChoiceProcessing("file", "Fichier", false);
		
		jobBuilder.addBaseJobDatas({cidMetas:{currentJobCode:"md-remakeAllAsNewContent",},});
		jobFactory.addChoiceRebuildVersions(true);
		resolve(jobFactory);
		})
		);
	
				
					reg.setPref("plg.code", 101, "depot");
					reg.setPref("depot.web.front.url", 101, IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/depot/fr-FR/depot.xhtml"));
				
					let universe = new DepotUniverse(Object.assign({
						reg,
						id:"depot",
						name:"Export",
						
						
						authSrv:authReg.env.universe.auth,
						adminUsers:authReg.env.universe.config.adminUsers,
						useUsers:authReg.env.universe.config.useUsers,
						executor:{
							
						},
						storeAspects:[
							
							
						],
						
						
						
						urlTree:new AuthEndPoint("https://studio-paon.edrlab.org/"),
						universeUrl:new AuthEndPoint("https://studio-paon.edrlab.org/~~write/"),
						libUrl:new PublicEndPoint(IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/")),
						skinUrl:new PublicEndPoint(IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/")),
						backUrl:new PublicEndPoint(IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/")),
						frontUrl:new PublicEndPoint(IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/depot/fr-FR/")),
						
						wsFrames:{
								ws:{
									keepAlive:"userActive",
								},
						},
					}, ovrUnivConf));
				
let resType
resType = universe.resTypes.addPrcResType(new ResType(reg,"dtmodel",).override("prcLabel","DT Modèle",).override("prcNoCreator",true,).override("prcExts",[".scar",],).override("prcMimes",["application/scenari.scar",],).override("prcIsFolder",true,),)
resType.addView("main",new RES_VIEW_AREAS.ResMainArea(reg,).setContent(new RES_VIEW_AREAS.ResChildrenArea(),),)
resType.addView("infos",new RES_VIEW_AREAS.ResInfoArea().addDefaultLines().addLines(new RES_VIEW_AREAS.RESINFO.BasicResLine().setLabel("Disponibilité",).setValues((ctx)=>{
					const metas = ctx.reg.env.nodeInfos.metas;
					const mState = metas ? metas.state : null;
					switch (mState) {
						case 'ready' :
							return "Disponible";
						case 'new' :
							return "Construction en cours...";
						case 'failure' :
							return LITHTML.xhtml`<xhtml:c-msg label="Des transformations ont échoué" level="error" xmlns:xhtml="http://www.w3.org/1999/xhtml"></xhtml:c-msg>`;
						default:
							return LITHTML.xhtml`<xhtml:i xmlns:xhtml="http://www.w3.org/1999/xhtml">Information non disponible</xhtml:i>`;
					}
				},),).addLines(new RES_VIEW_AREAS.RESINFO.ResFormAreaLine("srcUri",).setArea(new AREAS.StringInputArea("srcUri","text",).setLabel("srcUri",).setRequired(false,).setReadOnly(true,).setEnabled(false,),),new RES_VIEW_AREAS.RESINFO.ResFormAreaLine("uid",).setArea(new AREAS.StringInputArea("uid","text",).setLabel("UID",).setRequired(true,).setReadOnly(true,).setEnabled(false,),),),)
resType.reg.addToList("actions:depot:resMainView:infos","download",21,new ACTIONS.ActionMenuDep().setLabel("Télécharger",).setIcon(resType.reg.env.resolver.resolvePath(":skin:store/views/resViews/downloadRes.svg"),).setActions([new RES_ACTIONS.DownloadRes("?V=dtbook","xmlDTBook-dwn",).setLabel(LANG.formatStr("Télécharger \'%s\'",["DTBook",],),),new RES_ACTIONS.DownloadRes("?V=daisy2Pre.zip","daisy2Pre-dwn",).setLabel(LANG.formatStr("Télécharger \'%s\'",["Pre-build Daisy 2 ",],),),new RES_ACTIONS.DownloadRes("?V=daisy3Pre.zip","daisy3Pre-dwn",).setLabel(LANG.formatStr("Télécharger \'%s\'",["Pre-build Daisy 3",],),),new RES_ACTIONS.DownloadRes("?V=epub3Pre.zip","epub3Pre-dwn",).setLabel(LANG.formatStr("Télécharger \'%s\'",["Pre-build Epub 3",],),),new RES_ACTIONS.DownloadRes("?V=odtDuxbury","odtDuxbury-dwn",).setLabel(LANG.formatStr("Télécharger \'%s\'",["Export ODT pour Duxbury",],),),new RES_ACTIONS.DownloadRes("?V=daisy2.zip","-freeView-\\portal\\depot\\prc\\dtmodel\\dtmodel.processing;105-dwn",).setLabel(LANG.formatStr("Télécharger \'%s\'",["Daisy 2",],),),new RES_ACTIONS.DownloadRes("?V=daisy3.zip","-freeView-\\portal\\depot\\prc\\dtmodel\\dtmodel.processing;106-dwn",).setLabel(LANG.formatStr("Télécharger \'%s\'",["Daisy 3",],),),new RES_ACTIONS.DownloadRes("?V=epub3.zip","-freeView-\\portal\\depot\\prc\\dtmodel\\dtmodel.processing;107-dwn",).setLabel(LANG.formatStr("Télécharger \'%s\'",["Epub 3",],),),],),)
resType.reg.addToList("actions:depot:resMainView:infos","openViewRes",21,new RES_ACTIONS.OpenViewRes("?V=dtbook",null,"xmlDTBook-open",).setLabel(LANG.formatStr("Ouvrir \'%s\'",["DTBook",],),),)
resType.addEditView("editMetas",new RES_VIEW_AREAS.ResFormMetasArea("editMetas",).setBody(new AREAS.StringInputArea("srcUri","text",).setLabel("srcUri",).setRequired(false,),),)
resType.addEditView("editIdent",new RES_VIEW_AREAS.ResIdentFieldSetArea().setCustomFields([new AREAS.StringInputArea("uid","text",).setLabel("UID",).setRequired(true,),],
(metasInOut, resIdentFields)=>{

try{metasInOut.path =`/${metasInOut.uid}`}catch(e){}
											}
,true,true,),)
resType.reg.addToList("md:contentres:dtmodel:acts","importRes",21,new RES_ACTIONS.ImportRes(),)
resType = universe.resTypes.addPrcResType(new ResType(reg,"file",).override("prcLabel","Fichier",),)
resType.addView("main",new RES_VIEW_AREAS.ResMainArea(reg,).setContent(),)
resType.addView("infos",new RES_VIEW_AREAS.ResInfoArea().addDefaultLines().addLines(),)
resType.reg.addToList("actions:depot:resMainView:infos","download",21,new RES_ACTIONS.DownloadRes("","file-dwn",),)
resType.reg.addToList("actions:depot:resMainView:infos","openViewRes",21,null,)
resType.reg.addToList("md:contentres:file:acts","importRes",21,new RES_ACTIONS.ImportRes(),)
universe.resTypes.setDefaultFolderType(new ResType(reg,"folder",).override("prcLabel","Dossier",).override("prcIsFolder",true,).override("prcIsNoContent",true,).setIcon(":skin:store/objects/res/folder.svg",).setIconOpened(":skin:store/objects/res/folderOpened.svg",).addView("main",new RES_VIEW_AREAS.ResMainArea().setContent(new RES_VIEW_AREAS.ResChildrenArea(),),),)
universe.resTypes.initDefaults(reg,)
					authReg.addToList("plg:packs:universes", "depot", 101, universe);
				
					authReg.addToList("plg:jobs:universes", "depot", 101, universe);
				
					authReg.addToList("plg:logs:entries", "scenari", 101,
						{
							universe:universe,
							name:"Studio Paon 1 : Studio Paon",
						});
				}
