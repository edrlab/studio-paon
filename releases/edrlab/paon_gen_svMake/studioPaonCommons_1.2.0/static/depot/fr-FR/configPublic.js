
// # Déclaration des rôles
	extPoints.addRolePermList([{"role":"~default","priority":0,"allow":["DATA","dialog.adminUser#List"],"deny":["DO","role.main:admin.applyOn.group#show","role.hideWspApp.applyOn.wsp#show","role.hideWspDocApp.applyOn.wsp#show","role.main:admin.applyOn.wsp#show","role.hideWspApp.applyOn.space#show","role.hideWspDocApp.applyOn.space#show","role.main:admin.applyOn.space#show"]}], 21);extPoints.addRolePermList([{"role":"main:author","title":"Auteur","sortKey":"20","priority":1,"setPerm":"role.main:author#set","superRole":"main:reader","allow":["write"]}], 21);extPoints.addRolePermList([{"role":"main:manager","title":"Gestionnaire fonctionnel","sortKey":"30","priority":1,"setPerm":"role.main:manager#set","superRole":"main:author","allow":["admin"],"deny":["roles.adminSyst#set","admin.props.isHidden.user"]}], 21);extPoints.addRolePermList([{"role":"main:system","priority":1,"allow":["adminSyst","deploy","dialog.ping#Ping","admin.liaise","install.skinPack","admin.Container"],"deny":["DO"]}], 21);extPoints.addRolePermList([{"role":"main:admin","title":"Administrateur technique","sortKey":"40","priority":1,"setPerm":"role.main:admin#set","superRole":"~default","allow":["DO","~actionsSystem"]}], 21);extPoints.addRolePermList([{"role":"main:none","title":"Aucun","sortKey":"1","priority":1,"setPerm":"role.main:none#set","superRole":"main:~fallback"}], 21);extPoints.addRolePermList([{"role":"main:reader","title":"Lecteur","sortKey":"10","priority":1,"setPerm":"role.main:reader#set","superRole":"~default","allow":["read","use","server.storeChanges#Listen"],"deny":["ui.app.wspDoc.create.doc","ui.app.wspDoc.change.doc","ui.wspApp","ui.wspsPlg","view.depot"]}], 21);

//
extPoints.setPref("auth.serverUrl", 1, "https://studio-paon.edrlab.org/~~write");



//
							//
							extPoints.setPref("password.lost.label", 1, "Mot de passe perdu ?");
							extPoints.setPref("auth.foreignPasswordLostUrl", 1, "https://studio-paon.edrlab.org/~~chain/public/u/pwdLost?cdaction=AskForUpdate");
							//
						