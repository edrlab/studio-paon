import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{ActionBtn,ButtonActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{LoginDialog}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/login.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{USER}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
var showDialog=POPUP.showDialog
export class LoggedUser extends BaseElement{_initialize(init){this.reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
const auth=this.reg.env.universe.auth
if(!auth.config.noAuthentication){this._initAndInstallSkin(this.localName,init)
this.defaultIcon=init.icon
this.connectBtn=new ActionBtn
const connectInit=Object.create(init||null)
connectInit.action=this.reg.getSvc("userLogin")
sr.appendChild(this.connectBtn.initialize(connectInit))
const actionsInit=Object.create(init)
actionsInit.groupOrder="me * logout"
actionsInit.actions=this.reg.getList("actions:loggedUser")
actionsInit.actionContext=this
this.userBtn=(new ButtonActions).initialize(actionsInit)
sr.appendChild(this.userBtn)
auth.listeners.on("loggedUserChanged",(oldUser,newUser)=>{this.setNewUser(newUser)},100)
this.setNewUser(auth.currentUser)}}setNewUser(newUser){if(newUser){this.connectBtn.hidden=true
this.userBtn.hidden=false
this.userBtn.label=USER.getPrimaryName(newUser)
this.userBtn.title=USER.getLongName(newUser)
this.userBtn.icon=this.defaultIcon||"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/user.svg"}else{this.userBtn.hidden=true
this.connectBtn.hidden=false}}}REG.reg.registerSkin("c-loggeduser",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n`)
customElements.define("c-loggeduser",LoggedUser)
REG.reg.registerSvc("userLogin",1,new Action("userLogin").setLabel("Se connecter...").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/widgets/loggedUser/login.svg").setVisible(ctx=>{const auth=REG.findReg(ctx).env.universe.auth
return auth.currentAuthenticatedUser==null}).setExecute(ctx=>{const dialog=POPUP.showDialog(new LoginDialog,ctx,{fixSize:false,titleBar:{barLabel:{label:"Connexion"}}})
const universe=REG.findReg(ctx).env.universe
const onUserChange=()=>{dialog.close()}
universe.auth.listeners.on("loggedUserChanged",onUserChange)
dialog.onNextClose().then(()=>{universe.auth.listeners.removeListener("loggedUserChanged",onUserChange)})}))
REG.reg.registerSvc("userLogout",1,new Action("userLogout").setGroup("logout").setLabel("Se déconnecter").setVisible(ctx=>{const auth=REG.findReg(ctx).env.universe.auth
return auth.currentAuthenticatedUser!=null}).setExecute(ctx=>{const userSelf=REG.findReg(ctx).env.universe.userSelf
userSelf.logout()}))
REG.reg.registerSvc("userProfile",1,new Action("userProfile").setGroup("me").setLabel("Mon profil...").setVisible(ctx=>{const auth=REG.findReg(ctx).env.universe.auth
return auth.currentAuthenticatedUser!=null}).setExecute(async ctx=>{const reg=REG.findReg(ctx)
const{UserProfile:UserProfile}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/userProfile.js")
showDialog((new UserProfile).initialize({reg:reg}),ctx,{titleBar:{barLabel:{label:"Mon profil"}},fixSize:false})}))
REG.reg.registerSvc("userPref",1,new Action("userPref").setGroup("me").setLabel("Mes préférences...").setVisible(ctx=>{const auth=REG.findReg(ctx).env.universe.auth
return auth.currentAuthenticatedUser!=null}).setExecute(async ctx=>{const reg=REG.findReg(ctx)
const{UserPrefEditor:UserPrefEditor}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/userPrefEditor.js")
const body=(new UserPrefEditor).initialize({reg:reg,prefEditorsList:"user:prefs"})
await body.initializedAsync
showDialog(body,ctx,{titleBar:"Mes préférences",resizer:{}})}))
REG.reg.addSvcToList("actions:loggedUser","userProfile",1,"userProfile",10)
REG.reg.addSvcToList("actions:loggedUser","userPref",1,"userPref",20)
REG.reg.addSvcToList("actions:loggedUser","userLogout",1,"userLogout",110)

//# sourceMappingURL=loggedUser.js.map