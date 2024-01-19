import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{MsgOver}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{AREAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{FORMS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
import{BaseAreaViewAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{UserAccountInputArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/userAreas.js"
import{EUserAspects,EUserType,USER}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{USERSELF}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/userSelf.js"
class UserCreateBase extends BaseAreaViewAsync{constructor(){super(...arguments)
this.buildControlLabel=true
this.buildUnlockBtn=true
this.forcedUserDataOnSave={}}async _initialize(init){if(!this.reg)this.reg=REG.createSubReg(this.findReg(init))
this.userSelfSrv=this.reg.env.universe.userSelf
this.usersSrv=this.reg.env.universe.adminUsers
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("webzone:panel",sr)
this.reg.installSkin("standard-dialog",sr)
this.reg.installSkin("form-control-areas",sr)
this.reg.installSkin("userscreate-core",sr)
this._initAndInstallSkin(this.localName,init)
this._saveBtn=JSX.createElement(Button,{"î":{disabled:true,label:"Ajouter",uiContext:"dialog"},class:"default",onclick:this.onSave})
const closeBtn=JSX.createElement(Button,{"î":{disabled:false,label:"Annuler",uiContext:"dialog"},onclick:this.onClose})
this._form=sr.appendChild(JSX.createElement("form",{id:"form",autocomplete:"off"}))
this.initForm()
await AREAS.applyLayout(this._form,await Promise.all(this.reg.mergeLists("userProps:create","userProps:create:"+this.id)),this)
sr.appendChild(JSX.createElement("div",{id:"footer"},this._saveBtn,closeBtn))
this._emptyData=FORMS.formToJson(this._form)
await this._refreshUi()
this._form.checkValidity()
let checFormOnInput=0
this._form.addEventListener("input",()=>{if(checFormOnInput){clearTimeout(checFormOnInput)
checFormOnInput=0}checFormOnInput=setTimeout(()=>{this._refreshUi()},300)})}async _refreshUi(clear=false){if(clear)FORMS.jsonToForm(this._emptyData,this._form)
this._saveBtn.disabled=!await this.isDirty()}async isDirty(){const user=FORMS.formToJson(this._form)
return JSON.stringify(user)!==JSON.stringify(this._emptyData)}initForm(){this._form.appendChild(JSX.createElement("fieldset",{id:"fieldset"},JSX.createElement("div",{id:"common"},JSX.createElement("div",{class:"fields","area-ids":"account isDisabled enabledEndDt isHidden groups"}),JSX.createElement("div",{class:"fields","area-ids":"nickNames firstName lastName groupName email"})),JSX.createElement("div",{class:"fields","area-ids":"*"})))}async onSave(ev){if(!this.disabled){const me=DOMSH.findHost(this)
if(me._form.reportValidity()){const result=await(new MsgOver).setCustomMsg("Veuillez patienter...","info").showMsgOver(me).waitFor(me._doExecuteSave())
if(result)await me._doClose(result)}}}async onClose(ev){const me=DOMSH.findHost(this)
return me._doClose()}async _doClose(returnValue){POPUP.findPopupableParent(this).close(returnValue)}onViewBeforeHide(close){return false}async onViewWaitForHide(close){return true}}REG.reg.registerSkin("userscreate-core",1,`\n\tform {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tflex: 1;\n\t\tpadding: 1em;\n\t\toverflow: auto;\n\t}\n\n\tfieldset {\n\t\tborder: none;\n\t\tpadding: 0;\n\t\tmargin: 0;\n\t\tmin-width: 0;\n\t}\n\n\t#common {\n\t\tdisplay: flex;\n\t\tflex: 1;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-wrap: wrap;\n\t}\n\n\t#common > .fields {\n\t\tflex: 1;\n\t\tdisplay: grid;\n\t\tmin-width: 10em;\n\t\tgrid-template-columns: auto 1fr;\n\t\tgrid-row-gap: .7rem;\n\t\tgrid-auto-rows: max-content;\n\t}\n\n\t#common > .fields > div {\n\t\tdisplay: contents;\n\t}\n\n\t#common > .fields:first-child {\n\t\tmargin-inline-end: 2em;\n\t}\n\n\t.fields div[hidden] {\n\t\tdisplay: none !important;\n\t}\n\n\tdiv[area-id=authMethod] {\n\t\tflex-direction: column;\n\t}\n\n\tdiv[area-id=authMethod] > div {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\tdiv[area-id="passwordSetMode"] > .subPanel {\n\t\tborder: 0;\n\t\tmax-width: fit-content;\n\t}\n\n\t.ctrlLbl > .ctrlLbl {\n\t\tmargin: 0;\n\t}\n\n\tselect {\n\t\tmax-width: fit-content;\n\t}\n`)
export class UserCreate extends UserCreateBase{async _initialize(init){if(!this.reg)this.reg=REG.createSubReg(this.findReg(init))
this.id="users"
this.uiContextSgn="@user#create"
this.forcedUserDataOnSave.userType=EUserType.user
this.reg.addToList("userProps:create:users","account",1,new UserAccountInputArea)
this.reg.addSvcToList("userProps:create:users","isDisabled",1,"area.users.isDisabled.users")
if(this.reg.env.universe.adminUsers.hasAspect(EUserAspects.enabledEndDt))this.reg.addSvcToList("userProps:create:users","enabledEndDt",1,"area.users.enabledEndDt")
this.reg.addSvcToList("userProps:create:users","isHidden",1,"area.users.isHidden.users")
this.reg.addSvcToList("userProps:create:users","nickNames.first",1,"area.users.nickNames.first")
this.reg.addSvcToList("userProps:create:users","firstName",1,"area.users.firstName")
this.reg.addSvcToList("userProps:create:users","lastName",1,"area.users.lastName")
this.reg.addSvcToList("userProps:create:users","groups",1,"area.users.groupsmembers.users.create")
this.reg.addSvcToList("userProps:create:users","grantedRoles",1,"area.users.grantedRoles.users")
this.reg.addSvcToList("userProps:create:users","email",1,"area.users.email.user")
return super._initialize(init)}async _doExecuteSave(){try{const params=Object.assign(FORMS.formToJson(this._form),this.forcedUserDataOnSave)
let userName=USER.getPrimaryName(params)
const resp=await this.userSelfSrv.createUser(params)
let errorStr=USERSELF.tcheckUserSelfRespError(resp,"")
if(errorStr===null){if(resp.result==="validationPending")POPUP.showNotifWarning(`L\'utilisateur \'${userName}\' a été créé avec succès.\nRemarque : ce compte est en l\'état inactif.`,this)
else POPUP.showNotifInfo(`L\'utilisateur \'${userName}\' a été créé avec succès.`,this)
return params.account||true}else await ERROR.show(errorStr?`La création de l\'utilisateur \'${userName}\' a échoué. ${errorStr}`:"La création de l\'utilisateur a échoué.",new Error(JSON.stringify(resp)))
return null}catch(e){await ERROR.report(`La création de l\'utilisateur a échoué. Veuillez réessayer ultérieurement.`,e)
return null}}}customElements.define("usercreate-users",UserCreate)
REG.reg.registerSkin("usercreate-users",1,`\n`)
export class GroupCreate extends UserCreateBase{async _initialize(init){if(!this.reg)this.reg=REG.createSubReg(this.findReg(init))
this.id="groups"
this.uiContextSgn="@group#create"
this.forcedUserDataOnSave.userType=EUserType.group
this.reg.addToList("userProps:create:groups","account",1,new UserAccountInputArea)
this.reg.addSvcToList("userProps:create:groups","groupName",1,"area.users.groupName")
this.reg.addSvcToList("userProps:create:groups","isHidden",1,"area.users.isHidden.groups")
this.reg.addSvcToList("userProps:create:groups","groups",1,"area.users.groupsmembers.groups.create")
this.reg.addSvcToList("userProps:create:groups","grantedRoles",1,"area.users.grantedRoles.groups")
this.reg.addSvcToList("userProps:create:groups","email",1,"area.users.email.group")
return super._initialize(init)}async _doExecuteSave(){try{const params=Object.assign(FORMS.formToJson(this._form),this.forcedUserDataOnSave)
let userName=USER.getPrimaryName(params)
const resp=await this.userSelfSrv.createGroup(params)
let errorStr=USERSELF.tcheckUserSelfRespError(resp,"")
if(errorStr===null){POPUP.showNotifInfo(`Le groupe \'${userName}\' a été créé avec succès.`,this)
return params.account}else await ERROR.show(errorStr?`La création du groupe \'${userName}\' a échoué. ${errorStr}`:"La création du groupe a échoué.",new Error(JSON.stringify(resp)))
return null}catch(e){await ERROR.report(`La création du groupe a échoué. Veuillez réessayer ultérieurement.`,e)
return null}}}customElements.define("usercreate-groups",GroupCreate)
REG.reg.registerSkin("usercreate-groups",1,`\n`)

//# sourceMappingURL=userCreate.js.map