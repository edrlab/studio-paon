import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{BaseElementAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{AREAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{FORMS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{EUserAspects}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
export class UserProfile extends BaseElementAsync{constructor(){super(...arguments)
this.buildControlLabel=true
this.buildUnlockBtn=true
this.users=null}async _initialize(init){this.reg=init.reg
this.userSelfSrv=this.reg.env.universe.userSelf
this.uiContextSgn="@user#self#edit"
this._revertBtn=(new Button).initialize({uiContext:"dialog",label:"Rétablir",disabled:true})
this._saveBtn=(new Button).initialize({uiContext:"dialog",label:"Enregistrer",disabled:true})
const closeBtn=(new Button).initialize({uiContext:"dialog",label:"Fermer"})
this._form=JSX.createElement("form",{id:"form"},JSX.createElement("fieldset",{id:"fieldset"},JSX.createElement("div",{id:"common"},JSX.createElement("div",{class:"fields","area-ids":"account nickNames authMethod"}),JSX.createElement("div",{class:"fields","area-ids":"firstName lastName email"})),JSX.createElement("div",{class:"fields","area-ids":"*"})))
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("standard-dialog",sr)
this.reg.installSkin("form-control-areas",sr)
this._initAndInstallSkin(this.localName,init)
DOM.append(sr,this._form,JSX.createElement("div",{id:"footer"},this._revertBtn,this._saveBtn,closeBtn))
await AREAS.applyLayout(this._form,await Promise.all(this.reg.getList("userProps:profile")),this)
this._emptyData=FORMS.formToJson(this._form)
await this._updateForm(false)
this._form.checkValidity()
this._boundUpdateForm=await this._updateForm.bind(this)
this.reg.env.universe.auth.listeners.on("loggedUserChanged",this._boundUpdateForm)
const checkDirtyState=()=>{const user=FORMS.formToJson(this._form)
const dirty=JSON.stringify(user)!==this._userData
this._revertBtn.disabled=this._saveBtn.disabled=!dirty}
let checkDirtyRequest=0
this._form.addEventListener("input",()=>{if(checkDirtyRequest){clearTimeout(checkDirtyRequest)
checkDirtyRequest=0}checkDirtyRequest=setTimeout(checkDirtyState,300)})
closeBtn.onclick=()=>{POPUP.findPopupableParent(this).close()}
this._revertBtn.onclick=this._boundUpdateForm
this._saveBtn.onclick=async()=>{if(this._form.reportValidity()){const user=FORMS.formToJson(this._form)
delete user.authMethod
delete user.account
try{const resp=await this.reg.env.universe.auth.updateCurrentUser(user)
if(resp){await this._updateForm(true)}else throw"User not created"}catch(e){await ERROR.report(`Une erreur est survenue lors de la mise à jour du profil. Veuillez réessayer ultérieurement.`,e)}}}}async _updateForm(clear=true){const{auth:auth}=this.reg.env.universe
const user=auth.currentAuthenticatedUser
this.users=[auth.currentAuthenticatedUser]
if(clear)FORMS.jsonToForm(this._emptyData,this._form)
FORMS.jsonToForm(user,this._form,true)
this._userData=JSON.stringify(FORMS.formToJson(this._form))
const fieldset=this._form.elements.namedItem("fieldset")
let readonly=user.isReadOnly||user.isDisabled||!this.reg.env.universe.userSelf.hasAspect(EUserAspects.updatable)
fieldset.disabled=readonly
DOM.setHidden(this._revertBtn,readonly)
DOM.setHidden(this._saveBtn,readonly)
if(clear)this._revertBtn.disabled=this._saveBtn.disabled=true}onViewHidden(closed){const{auth:auth}=this.reg.env.universe
if(this._boundUpdateForm)auth.listeners.removeListener("loggedUserChanged",this._boundUpdateForm)}}REG.reg.registerSkin("c-user-profile",1,`\n\t:host {\n\t\tmin-width: 40em;\n\t\tmin-height: 12em;\n\t}\n\n\tform {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tflex: 1;\n\t\tpadding: 1em;\n\t}\n\n\tfieldset {\n\t  border: none;\n\t  padding: 0;\n\t  margin: 0;\n  }\n\n  #common {\n\t  display: flex;\n\t  flex: 1;\n\t  min-height: 0;\n\t  min-width: 0;\n\t  flex-wrap: wrap;\n  }\n\n  #common > .fields {\n\t  flex: 1;\n\t  display: flex;\n\t  flex-direction: column;\n\t  min-width: 10em;\n  }\n\n  #common > .fields:first-child {\n\t  margin-inline-end: 2em;\n  }\n\n  .fields div[hidden] {\n\t  display: none !important;\n  }\n\n  div[area-id=authMethod] {\n\t\tflex-direction: column;\n\t}\n\n\tdiv[area-id=authMethod] > div {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n`)
customElements.define("c-user-profile",UserProfile)
REG.reg.addSvcToList("userProps:profile","account",1,"area.users.props")
REG.reg.addSvcToList("userProps:profile","firstName",1,"area.users.firstName")
REG.reg.addSvcToList("userProps:profile","lastName",1,"area.users.lastName")
REG.reg.addSvcToList("userProps:profile","nickNames.first",1,"area.users.nickNames.first")
REG.reg.addSvcToList("userProps:profile","email",1,"area.users.email.user")

//# sourceMappingURL=userProfile.js.map