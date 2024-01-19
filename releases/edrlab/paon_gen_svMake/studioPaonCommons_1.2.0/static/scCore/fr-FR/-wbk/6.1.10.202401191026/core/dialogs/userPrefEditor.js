import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{BaseElementAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{FORMS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
import{BaseAreaView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{Tabs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tabs.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{AppFrameDeskFeat}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/appFrame.js"
export class UserPrefEditor extends BaseElementAsync{get currentForm(){var _a,_b
return this._singleForm||((_b=(_a=this._multiForms)===null||_a===void 0?void 0:_a.selectedTab)===null||_b===void 0?void 0:_b.view)}get currentEditorConfig(){var _a
return this._singleEditorConfig||((_a=this._multiForms.selectedTab)===null||_a===void 0?void 0:_a.area)}async _initialize(init){var _a,_b
const reg=this.reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
reg.installSkin("webzone:panel",sr)
reg.installSkin("standard-dialog",sr)
reg.installSkin("scroll/small",sr)
this._initAndInstallSkin(this.localName,init)
this._saveBtn=(new Button).initialize({uiContext:"dialog",label:"Enregistrer",disabled:true})
const closeBtn=(new Button).initialize({uiContext:"dialog",label:"Fermer"})
const edPromises=(_a=init.prefEditors||reg.getList(init.prefEditorsList))===null||_a===void 0?void 0:_a.map(ed=>typeof ed==="function"?ed():ed)
const editors=edPromises?(await Promise.all(edPromises)).filter(ed=>ed.isVisible(this)):[]
switch(editors.length){case 0:sr.appendChild(JSX.createElement("c-msg",{label:"Aucune préférence disponible"}))
break
case 1:this._singleEditorConfig=editors[0]
this._singleForm=sr.appendChild(await editors[0].loadBody(this))
break
default:this._multiForms=sr.appendChild(JSX.createElement(Tabs,{"î":{reg:reg,areas:editors,areasContext:this}}))
await this._multiForms.initializedAsync}sr.appendChild(JSX.createElement("div",{id:"footer"},this._saveBtn,closeBtn));(_b=this.currentForm)===null||_b===void 0?void 0:_b.checkValidity()
this._close=closeBtn.onclick=this.close.bind(this)
reg.env.universe.auth.listeners.on("loggedUserChanged",this._close)
const checkDirtyState=()=>{this._saveBtn.disabled=!this.isPrefsDirty()}
this.addEventListener("input",checkDirtyState)
this.addEventListener("change",checkDirtyState)
this._saveBtn.onclick=function(){var _a;(_a=DOMSH.findHost(this))===null||_a===void 0?void 0:_a.save(true)}}isPrefsDirty(){const form=this.currentForm
if(!form)return false
return DOM.findFirstChild(form,(function(n){return"isDirtyState"in n&&n.isDirtyState()}))!=null}isRelaodAppNeeded(){const form=this.currentForm
if(!form)return false
return DOM.findFirstChild(form,(function(n){return"isReloadAppNeeded"in n&&n.isReloadAppNeeded()}))!=null}async save(close){const btn=this._saveBtn
if(btn.disabled)return true
btn.disabled=true
try{const form=this.currentForm
if(form===null||form===void 0?void 0:form.reportValidity()){const datas=FORMS.formToJson(form)
await this.currentEditorConfig.persistUserDatas.setUserDatas(datas)}if(close)this.close()
if(AppFrameDeskFeat.isIn(desk)&&this.isRelaodAppNeeded)await desk.reloadMainApp()
return true}catch(e){await ERROR.report("Impossible d\'enregistrer ces préférences",e)
await this.reload()
return false}finally{btn.disabled=false}}async reload(){var _a
if(this._singleForm){const newForm=await this._singleEditorConfig.loadBody(this)
this._singleForm.replaceWith(newForm)
this._singleForm=newForm}else{return(_a=this._multiForms.selectedTab)===null||_a===void 0?void 0:_a.rebuildView()}}close(){var _a;(_a=POPUP.findPopupableParent(this))===null||_a===void 0?void 0:_a.close()}onViewHidden(closed){if(closed&&this._close){this.reg.env.universe.auth.listeners.removeListener("loggedUserChanged",this._close)}}onViewBeforeHide(close){return!this.isPrefsDirty()}async onViewWaitForHide(close){if(this.isPrefsDirty()){if(await POPUP.confirm("Des préférences ont été modifiées.",this,{okLbl:"Enregistrer",cancelLbl:"Abandonner les modifications"})){return this.save()}else if(!close){await this.reload()}}return true}}REG.reg.registerSkin("c-userpref-editor",1,`\n\tform {\n\t\tflex: 1;\n\t\toverflow-y: auto;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tpadding: 1em;\n\t}\n\n\t[hidden] {\n\t\tdisplay: none;\n\t}\n\n\tc-tabs {\n\t\tflex: 1 1 50vh;\n\t}\n\n\tc-msg {\n\t\tmargin: .5em;\n\t}\n`)
customElements.define("c-userpref-editor",UserPrefEditor)
export class UserPrefCheck extends BaseAreaView{get keyPref(){return this.area.getId()}get defaultState(){var _a
return(_a=this.areaContext.reg.getPref(this.keyPref))!==null&&_a!==void 0?_a:this.area.checkStateIfNone}get currentState(){var _a
return(_a=this.areaContext.editorConfig.persistUserDatas.getUserData(this.keyPref))!==null&&_a!==void 0?_a:this.defaultState}get checked(){return this.area.invertCheck?!this._input.checked:this._input.checked}set checked(st){this._input.checked=this.area.invertCheck?!st:st}_initialize(init){super._initialize(init)
this._input=JSX.createElement("input",{id:"check",type:"checkbox"})
this._attach(this.localName,init,JSX.createElement("label",{for:"check"},JSX.createElement("div",{class:"title"},this.area.getLabel(init.areaContext)),JSX.createElement("div",{class:"details"},this.area.getDescription(init.areaContext))),this._input)
this.reg.installSkin("form-control-areas",this.shadowRoot)
this.reg.installSkin("c-userpref-common",this.shadowRoot)
this.checked=this.currentState}fillJson(parent,root){parent[this.keyPref]=this.checked}extractJson(parent){return false}isDirtyState(){return this.checked!=this.currentState}isReloadAppNeeded(){return this.area.isReloadAppNeeded}resetSystem(){this.checked=this.defaultState}}REG.reg.registerSkin("c-userpref-check",1,``)
customElements.define("c-userpref-check",UserPrefCheck)
export class UserPrefSelect extends BaseAreaView{get keyPref(){return this.area.getId()}get defaultState(){var _a
return(_a=this.areaContext.reg.getPref(this.keyPref))!==null&&_a!==void 0?_a:""}_initialize(init){var _a
super._initialize(init)
this._input=JSX.createElement("select",{id:"select"})
this.area.buildOptions(this._input,(_a=this.areaContext.editorConfig.persistUserDatas.getUserData(this.keyPref))!==null&&_a!==void 0?_a:this.defaultState)
this._attach(this.localName,init,JSX.createElement("label",{for:"select"},JSX.createElement("div",{class:"title"},this.area.getLabel(init.areaContext)),JSX.createElement("div",{class:"details"},this.area.getDescription(init.areaContext))),this._input)
this.reg.installSkin("form-control-areas",this.shadowRoot)
this.reg.installSkin("c-userpref-common",this.shadowRoot)}fillJson(parent,root){const v=this._input.value
parent[this.keyPref]=v==""?undefined:v}extractJson(parent){return false}isDirtyState(){var _a
return this._input.value!=((_a=this.areaContext.editorConfig.persistUserDatas.getUserData(this.keyPref))!==null&&_a!==void 0?_a:"")}isReloadAppNeeded(){return this.area.isReloadAppNeeded}resetSystem(){this._input.value=this.defaultState}}REG.reg.registerSkin("c-userpref-select",1,``)
customElements.define("c-userpref-select",UserPrefSelect)
REG.reg.registerSkin("c-userpref-common",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tflex-direction: row;\n\t}\n\n\t:focus {\n\t\toutline: var(--focus-outline);\n\t}\n\n\tlabel {\n\t\tflex: 1;\n\t\tmax-width: 50vw;\n\t\tmargin-block: .7em;\n\t\tmargin-inline: 0 1em;\n\t}\n\n\t.title {\n\t\tfont-weight: bold;\n\t}\n\n\t.details {\n\t\tcolor: var(--fade-color);\n\t}\n\n\tinput, select {\n\t\tflex: 0 0 auto;\n\t\talign-self: center;\n\t}\n`)

//# sourceMappingURL=userPrefEditor.js.map