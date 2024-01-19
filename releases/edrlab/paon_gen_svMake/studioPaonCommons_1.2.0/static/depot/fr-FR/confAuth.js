
				import "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/basis_Perms.js"
				import { AuthEndPoint, IO, PublicEndPoint } from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js";
				import { CoreUniverse } from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/universe.js";
			
import "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/store_Perms.js";
export function init(reg, allPrlRegs, ovrUnivConf){
reg.addToList("userProps:create:users", 'authMethod', 21, new Promise(async (resolve)=>{
				const {SelectSubPanelArea, ActionBtnArea, SubControlsArea, InputArea, HiddenInputArea, MsgArea} = await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js");
				const {PasswordInputArea, userAreaIsVisible, userAreaIsEnabled} = await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/userAreas.js");
				
						let area = new SubControlsArea("auths")
							.setVisible(userAreaIsVisible)
							.setEnabled(userAreaIsEnabled)
							.setHideLevel(true)
							.setAreas(
							[new HiddenInputArea("authMethod").setDefaultValue(""),
						new SubControlsArea("password")
						.setHideLevel("formOnly")
						.setLabel("Mot de passe")
							.setVisible(userAreaIsVisible)
							.setEnabled(userAreaIsEnabled)
							.setAreas(
							[new PasswordInputArea("password", "placeholder").setLabel("Mot de passe").setRequired(true),]
						)
					,]
						)
					
				resolve(area);
			}), 51);

			
			reg.addToList("userProps:update:single:users", 'authMethod', 21, new Promise(async (resolve)=>{
				const {SelectSubPanelArea, ActionBtnArea, SubControlsArea, InputArea, HiddenInputArea, MsgArea} = await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js");
				const {PasswordInputArea, userAreaIsVisible, userAreaIsEnabled} = await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/userAreas.js");
				
						let area = new SubControlsArea("auths")
							.setVisible(userAreaIsVisible)
							.setEnabled(userAreaIsEnabled)
							.setHideLevel(true)
							.setAreas(
							[new HiddenInputArea("authMethod").setDefaultValue(""),
				new SelectSubPanelArea('passwordSetMode')
					.setLabel("Mot de passe")
					.setVisible(userAreaIsVisible)
					.setEnabled(userAreaIsEnabled)
					.setDefaultValue("")
					.setDataset(
						{"":{label:"",},byValue:{label:"[modifier] saisir un nouveau mot de passe",areas:[new PasswordInputArea("password", "placeholder").setLabel("Nouveau mot de passe").setRequired(true),],},}
					)
			,]
						)
					
				resolve(area);
			}), 51);

			
			reg.addToList("userProps:profile", 'authMethod', 21, new Promise(async (resolve)=>{
				const {SelectSubPanelArea, ActionBtnArea, SubControlsArea, InputArea, HiddenInputArea, MsgArea} = await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js");
				const {PasswordInputArea, userAreaIsVisible, userAreaIsEnabled} = await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/userAreas.js");
				
						let area = new SubControlsArea("auths")
							.setVisible(userAreaIsVisible)
							.setEnabled(userAreaIsEnabled)
							.setHideLevel(true)
							.setAreas(
							[new HiddenInputArea("authMethod").setDefaultValue(""),
				new ActionBtnArea('changePwd').setVisible(userAreaIsVisible).setEnabled(userAreaIsEnabled).setSvcAction("actionChangePwd").setUiContext("dialog")
			,]
						)
					
				resolve(area);
			}), 51);
		
					
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
			
				
					new CoreUniverse(Object.assign({
						reg,
						id:"_auth",
						srvCode:"depot",
						authSrv:reg.parentReg ? reg.parentReg.env.universe.auth : null,
						
						userSelf:{
							
								pwdLostUrl:null,
							
							usersAspects:["rolable","groupable",],
						},
						adminUsers:{
							usersAspects:["rolable","groupable",],
						},
						useUsers:{
							usersAspects:["rolable","groupable",],
						},
						
						
						universeUrl:new AuthEndPoint("https://studio-paon.edrlab.org/~~write/"),
						libUrl:new PublicEndPoint(IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/")),
						skinUrl:new PublicEndPoint(IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/")),
						backUrl:new PublicEndPoint(IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/")),
						frontUrl:new PublicEndPoint(IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/depot/fr-FR/")),
					}, ovrUnivConf));
				}
