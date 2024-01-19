import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{MsgLabel,MsgOver}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{AreaAsync,AREAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{FORMS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/wspPropsAreas.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{Tabs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tabs.js"
import{BaseAreaViewAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{WSP_DRF}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/drf.js"
import{WSP_DRV}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/drv.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{WspsMonitoring}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/wsp/wspsMonitoring.js"
import{ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{ExportWspAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/wspActions.js"
import{AppFrameDeskFeat}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/appFrame.js"
class WspProps extends BaseAreaViewAsync{constructor(){super(...arguments)
this._emptyData={}
this._fixedWspData={}
this._onSaveShowWaitMsg=true
this._listenLiveStateChange=true}get wsp(){return this.reg.env.wsp||null}async _initialize(init){this.config=Object.create(init)
this.reg=REG.createSubReg(init.reg)
if(this.wsp){this.reg.env.place=this.wsp.newPlaceWsp()
this.reg.env.place.eventsMgr.on("wspLiveStateChange",this.onWspLiveStateChange.bind(this))
this.reg.env.place.eventsMgr.on("wspLiveFullLoadStateChange",this.onWspLiveStateChange.bind(this))}if(!this.config.disableRevert)this._revertBtn=JSX.createElement(Button,{"î":{disabled:true,label:"Rétablir",uiContext:"dialog"},onclick:this.onRevert})
this._saveBtn=JSX.createElement(Button,{"î":{disabled:true,label:"Enregistrer",uiContext:"dialog"},class:"default",onclick:this.onSave})
this._closeBtn=JSX.createElement(Button,{"î":{disabled:false,label:"Annuler",uiContext:"dialog"},onclick:this.onClose})
if(init.exportScwsp&&this.reg.hasPerm("read.node.export"))this._exportBtn=JSX.createElement(Button,{"î":{label:"Exporter une archive de l\'atelier",uiContext:"dialog"},onclick:this.onExport})
this._form=JSX.createElement("form",{id:"form"})
this._msg=JSX.createElement(MsgLabel,null)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("standard-dialog",sr)
this.reg.installSkin("form-control-areas",sr)
this.reg.installSkin("c-wsp-props",sr)
this._initAndInstallSkin(this.localName,init)
DOM.append(sr,this._msg,this._form,JSX.createElement("div",{id:"footer"},this._exportBtn?[this._exportBtn,JSX.createElement("div",{style:"flex:1000"})]:undefined,this._revertBtn,this._saveBtn,this._closeBtn))
let checkDirtyRequest=0
const checkBtnsState=()=>{if(checkDirtyRequest){clearTimeout(checkDirtyRequest)
checkDirtyRequest=0}checkDirtyRequest=setTimeout(this.refreshBtnsState.bind(this),300)}
this._form.addEventListener("input",checkBtnsState)
this._form.addEventListener("change",checkBtnsState)
this.addEventListener("keydown",ev=>{if(ev.key==="Enter"&&ACTION.isAccelPressed(ev)){ev.preventDefault()
ev.stopImmediatePropagation()
this._saveBtn.click()
return true}return false})}async initForm(form){this.initFormELt(form)
await AREAS.applyLayout(this._form,this.reg.mergeLists(...this.areaList),this.areasContext(),true)
this._emptyData=FORMS.formToJson(this._form)}initFormELt(form){form.appendChild(JSX.createElement("fieldset",{class:"fieldslist"},JSX.createElement("div",{class:"fields","area-ids":"*"})))}onViewShown(){if(this.wsp){this._msg.setStandardMsg("loading")
this.wsp.waitForWspMetaUiAvailable().then(async wsp=>{await this.initForm(this._form)
await this.updateForm(false)
this._msg.setStandardMsg(null)}).catch(async()=>{await this.initForm(this._form)
await this.updateForm(false)
this._msg.setStandardMsg(null)})}else this.initForm(this._form).then(async()=>{await this.updateForm(false)})}areasContext(){return{reg:this.reg,buildControlLabel:true}}async getParamsToSave(){return Object.assign(FORMS.formToJson(this._form),this._fixedWspData)}async getIniParams(){return this.wsp?this.wsp.makeParamsForUpdate():this._emptyData}async onSave(ev){if(!this.disabled){const me=DOMSH.findHost(this)
if(me._form.reportValidity()){me._listenLiveStateChange=false
try{this.disabled=true
if(me._onSaveShowWaitMsg){await(new MsgOver).setCustomMsg("Veuillez patienter...","info").showMsgOver(me).waitFor(me._doExecuteValid())}else await me._doExecuteValid()}finally{me._listenLiveStateChange=true
me.onWspLiveStateChange(me.wsp)}}else POPUP.showNotifWarning("Veuillez corriger le formulaire.",this)}}async onClose(ev){const me=DOMSH.findHost(this)
if(!me.config.checkDirtyOnClose||!await me.isDirty()||await POPUP.confirm("Attention, vos modifications n\'ont pas été enregistrées.",me,{cancelLbl:"Annuler",okLbl:"Quitter sans enregistrer"})){return me._doClose()}}async _doClose(returnValue){POPUP.findPopupableParent(this).close(returnValue)}async onRevert(ev){if(!this.disabled){const me=DOMSH.findHost(this)
return me._doRevert()}}async _doRevert(){return this.updateForm(true)}onExport(ev){const me=DOMSH.findHost(this);(new ExportWspAction).execute(me)}async isDirty(){const wspData=FORMS.formToJson(this._form)
return JSON.stringify(wspData)!==JSON.stringify(this._lastWspData)}async refreshBtnsState(isPendingState){const dirty=await this.isDirty()
this._closeBtn.label="Fermer"
if(this._revertBtn)this._revertBtn.disabled=isPendingState||!dirty
if(this._exportBtn)this._exportBtn.disabled=isPendingState
this._form.checkValidity()
this._saveBtn.disabled=isPendingState||!dirty}async updateForm(clear=true){var _a,_b,_c
const currentUpdtFormCycle=this._pendingUpdtFormCycle=Date.now()
this._msg.setStandardMsg("loading")
DOM.setHidden(this._form,true)
try{await this.refreshBtnsState(true)
if(currentUpdtFormCycle!=this._pendingUpdtFormCycle)return
await((_a=this.wsp)===null||_a===void 0?void 0:_a.waitForLoad())
if(currentUpdtFormCycle!=this._pendingUpdtFormCycle)return
if((_b=this.wsp)===null||_b===void 0?void 0:_b.migrating){this._msg.setCustomMsg("Migration de l\'atelier en cours...")
await this.wsp.migrating
if(currentUpdtFormCycle!=this._pendingUpdtFormCycle)return}else if((_c=this.wsp)===null||_c===void 0?void 0:_c.fullLoading){this._msg.setCustomMsg("Chargement de l\'atelier en cours...")
await this.wsp.fullLoading
if(currentUpdtFormCycle!=this._pendingUpdtFormCycle)return}if(clear)FORMS.jsonToForm(this._emptyData,this._form)
FORMS.jsonToForm(await this.getIniParams(),this._form,true,true)
await FORMS.checkAsyncValidity(this._form)
if(currentUpdtFormCycle!=this._pendingUpdtFormCycle)return
this._lastWspData=FORMS.formToJson(this._form)
await this.refreshBtnsState()
if(currentUpdtFormCycle!=this._pendingUpdtFormCycle)return
this._msg.setStandardMsg(null)
this._form.checkValidity()
DOM.setHidden(this._form,false)}catch(e){this._msg.setCustomMsg("Chargement des propriétés de l\'atelier en erreur","error")
return ERROR.log(e)}}onViewHidden(closed){if(closed&&this.wsp)this.reg.env.place.closePlace()}onViewBeforeHide(close){return false}async onViewWaitForHide(close){if(!this.config.checkDirtyOnClose||!await this.isDirty()||await POPUP.confirm("Attention, vos modifications n\'ont pas été enregistrées.",this,{cancelLbl:"Annuler",okLbl:"Quitter sans enregistrer"})){await this._doRevert()
return true}return false}async onWspLiveStateChange(wsp){if(wsp!==this.wsp||!wsp)return
if(wsp.isDeleted===true){POPUP.showNotif("L\'atelier a été supprimé",POPUP.findPopupableParent(this),{autoHide:3e3})
return this._doClose()}else{if(this._listenLiveStateChange)return this.updateForm(false)}}}REG.reg.registerSkin("c-wsp-props",1,`\n\t:host {\n\t\tmin-height: 12em;\n\t}\n\n\t#form {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tflex: 1;\n\t\tpadding: 1em;\n\t\toverflow: auto;\n\t}\n\n\t#form[hidden] {\n\t\tdisplay: none;\n\t}\n\n\t.fieldslist {\n\t\tborder: none;\n\t\tpadding: .5rem;\n\t\tmargin: .5rem;\n\t\tmin-width: 0;\n\t}\n\n\t.fieldslist > .fields {\n\t\tdisplay: grid;\n\t\tmin-width: 0;\n\t\tgrid-template-columns: auto 1fr;\n\t\tgrid-row-gap: .7rem;\n\t\tgrid-auto-rows: max-content;\n\t}\n\n\t.fieldslist > .fields:first-child {\n\t\tmargin-inline-end: 2em;\n\t}\n\n\t.fields > div {\n\t\tdisplay: contents;\n\t}\n\n\t.fields > *.allCols {\n\t\tgrid-column-start: 1;\n\t\tgrid-column-end: 3;\n\t}\n\n\t.fields div[hidden] {\n\t\tdisplay: none !important;\n\t}\n\n\tc-action {\n\t\tmargin: 0 .5em 0 0;\n\t}\n\n\ttextarea[name=desc] {\n\t\theight: 3em;\n\t\tresize: none;\n\t}\n\n\t.details {\n\t\tfont-size: .8em;\n\t}\n\n\t.deprecated {\n\t\tfont-style: italic;\n\t\tcolor: var(--fade-color);\n\t}\n\n\t.titleDeprecated {\n\t\tfont-variant-position: sub;\n\t\tfont-size: .8em;\n\t\tmargin-inline-start: .5rem;\n\t\tcolor: var(--warning-color);\n\t}\n\n\t.important {\n\t\tfont-weight: bolder;\n\t\tcolor: var(--alt1-color)\n\t}\n`)
export class WspCreateProps extends WspProps{async _initialize(init){init.disableRevert=true
await super._initialize(init)
this._saveBtn.label="Créer"}get areaListBase(){let list=["wspProps:create:commons"]
switch(this.reg.env.universe.config.backEnd){case"fs":list.push("wspProps:create:fs")
break
case"odb":list.push("wspProps:create:db","wspProps:create:db:other")
break}return list}get areaList(){let list=this.areaListBase
list.push("wspProps:create:fromScratch")
return list}async getIniParams(){let datas=await super.getIniParams()
delete datas.title
delete datas.alias
delete datas.code
return datas}async refreshBtnsState(){if(this.reg.env.universe.config.backEnd==="fs"){let wspTypeDiv=this._form.querySelector("*[area-id='wspType']")
let wspTypeSelector=this._form.querySelector("wsptype-selector")
const params=await this.getParamsToSave()
this._existingWspmetaOnPathFs=params.code?await WSP.fetchExistWspFsOnPath(this.reg.env.universe.wspServer,params.code,params.folderContent):null
this._saveBtn.label=this._existingWspmetaOnPathFs?"Créer (récupérer l\'atelier existant)":"Créer"
if(wspTypeDiv)DOM.setHidden(wspTypeDiv,this._existingWspmetaOnPathFs!=null)
if(wspTypeSelector)wspTypeSelector.disabled=this._existingWspmetaOnPathFs!=null}return super.refreshBtnsState()}async _doExecuteValid(){try{const params=await this.getParamsToSave()
let wspTypeInst
if(this.reg.env.universe.config.backEnd==="fs"&&this._existingWspmetaOnPathFs){wspTypeInst=this._existingWspmetaOnPathFs}else{let wspTypeSelector=this._form.querySelector("wsptype-selector")
wspTypeInst=wspTypeSelector.fillWspTypeInst()}const resp=await WSP.createWsp(this.reg.env.universe.wspServer,params,wspTypeInst)
if(!resp)throw"no resp"
return this._doClose(resp)}catch(e){await ERROR.report("Création de l\'atelier impossible.",e)
await this.refreshBtnsState()}}}customElements.define("c-wsp-create-props",WspCreateProps)
export class WspCreateFromScwspProps extends WspCreateProps{get areaList(){let list=this.areaListBase
list.push("wspProps:create:fromScwsp")
return list}async _doExecuteValid(){try{const params=await this.getParamsToSave()
let wspTypeSelector=this._form.querySelector("wsptype-selector")
let scWspInput=this._form.elements.namedItem("scwspFile")
if(!scWspInput.files||scWspInput.files.length==0)throw"No scwsp file selected"
const resp=await WSP.importWsp(this.reg.env.universe.wspServer,params,scWspInput.files.item(0))
if(!resp)throw"no resp"
this._doClose(resp)}catch(e){await ERROR.report("Import de l\'atelier impossible.",e)
await this.refreshBtnsState()}}}customElements.define("c-wsp-create-fromscwsp-props",WspCreateFromScwspProps)
export class WspCreatDrfProps extends WspProps{async _initialize(init){init.disableRevert=true
await super._initialize(init)
this._saveBtn.label="Créer"}get areaList(){return["wspProps:create:commons","wspProps:create:fromScratch","wspProps:create:db","wspProps:create:db:drf"]}async getIniParams(){return this._emptyData}async _doExecuteValid(){try{const params=await this.getParamsToSave()
let wspTypeSelector=this._form.querySelector("wsptype-selector")
const resp=await WSP_DRF.createWspDrf(this.reg.env.wsp,params,wspTypeSelector.fillWspTypeInst())
if(!resp)throw"no resp"
this._doClose(resp)}catch(e){await ERROR.report("Création de l\'atelier impossible.",e)
await this.refreshBtnsState()}}}customElements.define("c-wsp-create-drf-props",WspCreatDrfProps)
export class WspCreatDrvProps extends WspProps{async _initialize(init){init.disableRevert=true
await super._initialize(init)
this._saveBtn.label="Créer"}get areaList(){return["wspProps:create:commons","wspProps:create:fromScratch","wspProps:create:db","wspProps:create:db:drv"]}async getIniParams(){return this._emptyData}async _doExecuteValid(){try{const params=await this.getParamsToSave()
let wspTypeSelector=this._form.querySelector("wsptype-selector")
return this._doClose(await WSP_DRV.createWspDrv(this.reg.env.wsp,params,wspTypeSelector.fillWspTypeInst()))}catch(e){await ERROR.report("Création de l\'atelier impossible.",e)
await this.refreshBtnsState()}}}customElements.define("c-wsp-create-drv-props",WspCreatDrvProps)
export class WspEditProps extends BaseAreaViewAsync{async _initialize(init){this.reg=init.reg
this._msg=JSX.createElement(MsgLabel,null)
this.reg.addToList("wsp-edit-tab","infoArea",1,(new AreaAsync).setLabel("Propriétés").setBodyBuilder(ctx=>JSX.createElement(WspEditProps_info,{"î":ctx,code:"props"})),1)
this.reg.addToList("wsp-edit-tab","advancedArea",1,(new AreaAsync).setLabel("Avancé").setBodyBuilder(ctx=>JSX.createElement(WspEditProps_advanced,{"î":ctx,code:"advanced"})),101)
this._tabs=JSX.createElement(Tabs,{"areas-context":"wsp-edit-tab-ctxt","areas-list":init.tabAreasLists||"wsp-edit-tab"})
this.reg.registerSvc("wsp-edit-tab-ctxt",1,{reg:this.reg})
this._attach(this.tagName,init,this._tabs)
this.reg.installSkin("webzone:panel",this.shadowRoot)}onViewShown(){this._msg.setStandardMsg("loading")
this.reg.env.wsp.waitForLoad().then(async()=>{if(this.reg.env.wsp.backEnd==="odb"&&await WSP.checkWspSvc(this.reg.env.wsp,this,"skinSet")){this._tabs.addTab((new AreaAsync).setLabel("Habillages graphiques").setDescription("Habillages graphiques des générateurs du modèle documentaire").setBodyBuilder(ctx=>JSX.createElement(WspEditProps_skins,{"î":ctx,code:"props"})),{position:1})}this._msg.setStandardMsg(null)})}onViewBeforeHide(close){return false}async onViewWaitForHide(close){return this._tabs.selectedTab.view.onViewWaitForHide(close)}visitViews(visitor,options){if(this._tabs)this._tabs.visitViews(visitor,options)}visitViewsAsync(visitor,options){if(this._tabs)return this._tabs.visitViewsAsync(visitor,options)}}customElements.define("c-wsp-edit-props",WspEditProps)
REG.reg.registerSkin("c-wsp-edit-props",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tflex: 1;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t}\n\n\tc-tabs {\n\t\tflex: 1;\n\t}\n`)
class WspEditProps_info extends WspProps{async _initialize(init){init.checkDirtyOnClose=true
init.exportScwsp=true
return super._initialize(init)}initFormELt(form){form.appendChild(JSX.createElement("fieldset",{class:"fieldslist"},JSX.createElement("div",{class:"fields","area-ids":"*"})))
form.appendChild(JSX.createElement("fieldset",{class:"fieldslist",id:"wspTypeFs"},JSX.createElement("div",{class:"fields","area-ids":"wspType"})))}get areaList(){const wspDefProps=this.wsp.wspDefProps
let list=["wspProps:edit:commons:infos"]
switch(this.wsp.backEnd){case"fs":list.push("wspProps:edit:fs:infos")
break
case"odb":list.push("wspProps:edit:db:infos")
break}if(wspDefProps&&wspDefProps.drfRefWsp)list.push("wspProps:edit:db:drf:infos")
else if(wspDefProps&&wspDefProps.drvAxis)list.push("wspProps:edit:db:drv:infos")
else if(this.wsp.backEnd=="odb")list.push("wspProps:edit:db:other:infos")
return list}async _doExecuteValid(){try{const allFormsDatas=await this.getParamsToSave()
let newParams={}
let hasNewParams=false
for(const props in allFormsDatas){if(props!="wspType")if(this._lastWspData[props]!==allFormsDatas[props]){hasNewParams=true
newParams[props]=allFormsDatas[props]}}if(hasNewParams)await this.wsp.updateWspProps(newParams)
if(JSON.stringify(allFormsDatas.wspType)!=JSON.stringify(this._lastWspData.wspType)){let isMigrationNeeded=await this.wsp.isMigrationNeeded(allFormsDatas.wspType)
if(isMigrationNeeded===false){await this.wsp.updateWspType(allFormsDatas.wspType,false)}else if(isMigrationNeeded===true){const result=await POPUP.confirmCheck(JSX.createElement("div",null,JSX.createElement("div",null,"Les contenus de votre atelier doivent être mis à jour."),JSX.createElement("div",null,JSX.createElement("b",null,"Vous ne pourrez pas annuler cette action.")),JSX.createElement("div",null,"Voulez-vous poursuivre l\'enregistrement du modèle documentaire ?")),this,"Exécuter la mise à jour des contenus",true,{okLbl:"Poursuivre",cancelLbl:"Annuler"})
if(result===false)await this._doRevert()
else await this.wsp.updateWspType(allFormsDatas.wspType,result==="checked")}else{let msg=isMigrationNeeded.getAttribute("desc")
POPUP.showNotifError(`Une mise à jour automatique des contenus de l\'atelier serait nécessaire, mais des modifications manuelles préalables doivent être réalisées : ${msg}`,this,{noCloseBtn:true,kind:"warning"})
await this._doRevert()}}}catch(e){await ERROR.report("Modification des propriétés de l\'atelier impossible.",e)
await this.refreshBtnsState()}}isReadOnlyFieldset(fieldsetElt){if(fieldsetElt.id==="wspTypeFs")return!this.reg.hasPerm("action.wspProps#update.wsptype")
else return!this.reg.hasPerm("action.wspProps#update.props")}}customElements.define("c-wsp-edit-props-info",WspEditProps_info)
class WspEditProps_advanced extends WspEditProps_info{get areaList(){const wspDefProps=this.wsp.wspDefProps
let list=["wspProps:edit:commons:advanced"]
switch(this.wsp.backEnd){case"fs":list.push("wspProps:edit:fs:advanced")
break
case"odb":list.push("wspProps:edit:db:advanced")
break}if(wspDefProps&&wspDefProps.drfRefWsp)list.push("wspProps:edit:db:drf:advanced")
else if(wspDefProps&&wspDefProps.drvAxis)list.push("wspProps:edit:db:drv:advanced")
else if(this.wsp.backEnd=="odb")list.push("wspProps:edit:db:other:advanced")
return list}}customElements.define("c-wsp-edit-props-advanced",WspEditProps_advanced)
class WspEditProps_skins extends WspEditProps_info{get areaList(){return["wspProps:edit:db:other:skins"]}}customElements.define("c-wsp-edit-props-skins",WspEditProps_skins)
export class WspRemoveProps extends WspProps{async _initialize(init){const wspTitle=init.reg.env.wsp.wspTitle
init.disableRevert=true
await super._initialize(init)
this.shadowRoot.insertBefore(JSX.createElement("div",{class:"question"},JSX.createElement("span",{id:"kind"}),`Voulez-vous vraiment supprimer l\'atelier \'${wspTitle}\' ?`),this.shadowRoot.firstElementChild)
this._saveBtn.label="Supprimer"}initFormELt(form){super.initFormELt(form)
this._ctrlElt=form.appendChild(JSX.createElement("div",{class:"warning"},JSX.createElement("span",{id:"kind"}),JSX.createElement("div",{class:"msgs"})))}async updateForm(clear=true){await super.updateForm(clear)
let msgs=[]
let infoWsp=await this.wsp.wspServer.config.adminWspUrl.fetchJson(IO.qs("cdaction","InfoWsp","param",this.wsp.code,"wspPropsOpts","(drvWspUsedBy 'true' listDrvs 'true' listDrfs 'true')"))
if(infoWsp.props.drvWspUsedBy){let wspListArray=infoWsp.props.drvWspUsedBy.split(" ")
let wspList=wspListArray.join(", ")
if(wspListArray.length==1)msgs.push(`Cet atelier est source du calque de dérivation \'${wspList}\'. La suppression de cet atelier est donc impossible.`)
else msgs.push(`Cet atelier est source des calques de dérivation : ${wspList}. La suppression de cet atelier est donc impossible.`)
this._saveBtn.disabled=true}else if(infoWsp.props.listDrvs||infoWsp.props.listDrfs){if(infoWsp.props.listDrvs&&this.wsp.wspServer.chain.config.drf)msgs.push(`Tous les ateliers \'calque de dérivation\' et les ateliers \'calque de travail\' liés seront également supprimés`)
else if(infoWsp.props.listDrvs)msgs.push(`Tous les ateliers \'calque de dérivation\' seront également supprimés`)
if(infoWsp.props.listDrfs)msgs.push(`Tous les ateliers \'calque de travail\', et les ateliers liés seront également supprimés`)
this._saveBtn.label="Supprimer les ateliers"}if(msgs.length==0){DOM.setHidden(this._ctrlElt,true)}else{let msgsElt=this._ctrlElt.querySelector(".msgs")
msgs.forEach(msg=>{msgsElt.appendChild(JSX.createElement("div",null,msg))})}}async refreshBtnsState(){this._form.checkValidity()
this._saveBtn.disabled=false}get areaList(){const wspDefProps=this.wsp.wspDefProps
let list=["wspProps:remove:commons"]
switch(this.wsp.backEnd){case"fs":list.push("wspProps:remove:fs")
break
case"odb":list.push("wspProps:remove:db")
break}if(wspDefProps&&wspDefProps.drfRefWsp)list.push("wspProps:remove:db:drf")
else if(wspDefProps&&wspDefProps.drvAxis)list.push("wspProps:remove:db:drv")
else list.push("wspProps:remove:db:other")
return list}async _doExecuteValid(){var _a,_b,_c
try{const mainApp=desk.getMainApp()
if((_c=(_b=(_a=mainApp)===null||_a===void 0?void 0:_a.reg)===null||_b===void 0?void 0:_b.env.wsp)===null||_c===void 0?void 0:_c.equals(this.wsp))if(AppFrameDeskFeat.isIn(desk))await desk.gotoHome()
const params=await this.getParamsToSave()
await this.wsp.delete(params)
return this._doClose(true)}catch(e){await ERROR.report("Suppression de l\'atelier impossible.",e)
return this.refreshBtnsState()}}}customElements.define("c-wsp-remove-props",WspRemoveProps)
REG.reg.registerSkin("c-wsp-remove-props",1,`\n\t*[hidden] {\n\t\tdisplay: none !important;\n\t}\n\n\t.question, .warning {\n\t\tdisplay: flex;\n\t\talign-items: center;\n\t\tmargin: 1em;\n\t}\n\n\t.cplt {\n\t\tfont-style: italic;\n\t\tpadding-top: .3em;\n\t}\n\n\t.warning {\n\t\tcolor: var(--warning-color);\n\t}\n\n\t#kind {\n\t\tdisplay: inline-block;\n\t\tmin-width: 1.5em;\n\t\tmin-height: 1.5em;\n\t\tmargin: .5em;\n\t}\n\n\t.question > #kind {\n\t\tbackground: center no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/popupable/question.svg);\n\t}\n\n\t.warning > #kind {\n\t\tbackground: center no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/popupable/warning.svg);\n\t}\n`)
export class WspsRemoveProps extends WspProps{constructor(){super(...arguments)
this.MSG_CONFIRM="Voulez-vous vraiment supprimer l\'atelier ?"
this.MSG_CONFIRM_MULTI="Voulez-vous vraiment supprimer les ateliers ?"
this.MSG_ERROR="Suppression de(s) atelier(s) en échec."
this.MSG_STATUS_REMOVED="Supprimé"
this.MSG_BTN="Supprimer"}async _initialize(init){init.disableRevert=true
this.wspsReg=init.regs
await super._initialize(init)
this.reg.installSkin("c-wsp-remove-props",this.shadowRoot)
this._onSaveShowWaitMsg=false
let cplt=""
if(this.reg.env.universe.wspServer.chain.config.drf&&this.reg.env.universe.wspServer.chain.config.drv)cplt="Tous les éventuels ateliers \'calque de dérivation\', et \'calque de travail\' liés seront également supprimés"
else if(this.reg.env.universe.wspServer.chain.config.drf)cplt="Tous les éventuels ateliers \'calque de travail\' liés seront également supprimés"
else if(this.reg.env.universe.wspServer.chain.config.drv)cplt="Tous les éventuels ateliers \'calque de dérivation\' liés seront également supprimés"
let wsps=[]
this.wspsReg.forEach(entry=>{wsps.push(entry.env.wsp)})
WSP.sortWspsByDeep(wsps).reverse()
let count=wsps.length
let msg=count>1?this.MSG_CONFIRM_MULTI:this.MSG_CONFIRM
this.shadowRoot.insertBefore(JSX.createElement("div",null,JSX.createElement("div",{class:"question"},JSX.createElement("span",{id:"kind"}),JSX.createElement("div",null,JSX.createElement("div",null,msg),JSX.createElement("div",{class:"cplt"},cplt))),JSX.createElement(WspsMonitoring,{"î":{wsps:wsps,defaultStateKey:"toRemove",states:[{key:"toRemove",level:"disabled",label:"À supprimer"}]}})),this.shadowRoot.firstElementChild)
this._saveBtn.label=this.MSG_BTN}async _doExecuteValid(){let wspTitleErrosArray=[]
let dialog
try{const params=await this.getParamsToSave()
let wsps=[]
this.wspsReg.forEach(entry=>{wsps.push(entry.env.wsp)})
WSP.sortWspsByDeep(wsps).reverse()
let wspsMonitoring=JSX.createElement(WspsMonitoring,{"î":{wsps:wsps,defaultStateKey:"notStart",states:[{key:"notStart",level:"disabled",label:"En attente"},{key:"toRemove",level:"disabled",label:"À supprimer"},{key:"pending",level:"pending",label:"En cours..."},{key:"removed",level:"success",label:this.MSG_STATUS_REMOVED},{key:"failed",level:"error",label:"Échec"}]}})
dialog=POPUP.showDialog(JSX.createElement("div",null,JSX.createElement(MsgLabel,{label:"Suppression en cours..."}),wspsMonitoring),this,{skinOver:"c-wsps-props-monitoraction",fixSize:false,titleBar:null,initWidth:"50%"})
let errorsArray=[]
for(const entry in wsps){let wsp=wsps[entry]
wspsMonitoring.updateWspStatus(wsp.code,"pending")
try{await this.doDelete(wsp,params)
wspsMonitoring.updateWspStatus(wsp.code,"removed")
await new Promise(resolve=>setTimeout(resolve,1e3))}catch(e){wspsMonitoring.updateWspStatus(wsp.code,"failed")
wspTitleErrosArray.push(wsp.wspTitle)
errorsArray.push(e)}}await new Promise(resolve=>setTimeout(resolve,3e3))
if(errorsArray.length>0)throw errorsArray
this._doClose()}catch(e){let list=wspTitleErrosArray.join(", ")
if(dialog)dialog.close()
await ERROR.report(list?this.MSG_ERROR:this.MSG_ERROR+" "+`Ateliers : \'${list}\'.`,e)
await this._doClose()}}async doDelete(wsp,params){var _a,_b,_c
const mainApp=desk.getMainApp()
if((_c=(_b=(_a=mainApp)===null||_a===void 0?void 0:_a.reg)===null||_b===void 0?void 0:_b.env.wsp)===null||_c===void 0?void 0:_c.equals(wsp))if(AppFrameDeskFeat.isIn(desk))await desk.gotoHome()
return wsp.delete(params)}async refreshBtnsState(){this._form.checkValidity()
this._saveBtn.disabled=false}get areaList(){let list=["wspProps:removeAll:commons"]
switch(this.reg.env.universe.config.backEnd){case"fs":list.push("wspProps:removeAll:fs")
break
case"odb":list.push("wspProps:removeAll:db")
break}return list}}REG.reg.registerSkin("c-wsps-remove-props",1,`\n\twsps-monitoring {\n\t\tmargin: 0 2em;\n\t\tmax-height: 10em;\n\t\toverflow: auto;\n\t}\n`)
REG.reg.registerSkin("c-wsps-props-monitoraction",1,`\n\twsps-monitoring {\n\t\tmargin: 0 2em;\n\t\tmax-height: 15em;\n\t\toverflow: auto;\n\t}\n`)
customElements.define("c-wsps-remove-props",WspsRemoveProps)
export class WspsRemovePermanentlyProps extends WspsRemoveProps{constructor(){super(...arguments)
this.MSG_CONFIRM="Voulez-vous vraiment supprimer définitivement l\'atelier ?"
this.MSG_CONFIRM_MULTI="Voulez-vous vraiment supprimer définitivement les ateliers ?"
this.MSG_ERROR="Suppression définitive de(s) atelier(s) en échec."
this.MSG_STATUS_REMOVED="Supprimé définitivement"
this.MSG_BTN="Supprimer définitivement"}async doDelete(wsp,params){return wsp.deletePermanently(params)}get areaList(){let list=["wspProps:remove:permanently:commons"]
switch(this.reg.env.universe.config.backEnd){case"fs":list.push("wspProps:remove:permanently:fs")
break
case"odb":list.push("wspProps:remove:permanently:db")
break}return list}}customElements.define("c-wsps-remove-permanently-props",WspsRemovePermanentlyProps)
export class WspsEditModelProps extends WspProps{async _initialize(init){init.checkDirtyOnClose=true
init.disableRevert=true
this.wspsReg=init.regs
const count=this.wspsReg.length
await super._initialize(init)
this.reg.installSkin("c-wsps-editmodel-props",this.shadowRoot)
this._onSaveShowWaitMsg=false
let wsps=[]
this.wspsReg.forEach(entry=>{wsps.push(entry.env.wsp)})
wsps=WSP.sortWspsByDeep(wsps)
this.shadowRoot.insertBefore(JSX.createElement("div",null,JSX.createElement("div",{class:"info"},`Édition des propriétés des \'${count}\' ateliers :`),JSX.createElement(WspsMonitoring,{"î":{wsps:wsps,defaultStateKey:"toEdit",states:[{key:"toEdit",level:"disabled",label:"À éditer"}]}})),this.shadowRoot.firstElementChild)}async refreshBtnsState(){this._form.checkValidity()
this._saveBtn.disabled=false}async _doExecuteValid(){let wspTitleErrosArray=[]
let dialog
try{const allFormsDatas=await this.getParamsToSave()
let newParams={}
let hasNewParams=false
for(const props in allFormsDatas){if(props!="wspType"&&props!="doMigrateIfNecessary")hasNewParams=true
newParams[props]=allFormsDatas[props]}let wsps=[]
this.wspsReg.forEach(entry=>{wsps.push(entry.env.wsp)})
wsps=WSP.sortWspsByDeep(wsps)
let wspsMonitoring=JSX.createElement(WspsMonitoring,{"î":{wsps:wsps,defaultStateKey:"notStart",states:[{key:"notStart",level:"disabled",label:"En attente"},{key:"toUpdate",level:"disabled",label:"À actualiser"},{key:"pending",level:"pending",label:"En cours..."},{key:"updated",level:"success",label:"Actualisé"},{key:"failed",level:"error",label:"Échec"}]}})
dialog=POPUP.showDialog(JSX.createElement("div",null,JSX.createElement(MsgLabel,{label:"Enregistrements en cours..."}),wspsMonitoring),this,{skinOver:"c-wsps-props-monitoraction",fixSize:false,titleBar:null,initWidth:"50%"})
let errorsArray=[]
for(const entry in wsps){let wsp=wsps[entry]
wspsMonitoring.updateWspStatus(wsp.code,"pending")
try{if(hasNewParams)await wsp.updateWspProps(newParams)
await wsp.updateWspType(allFormsDatas.wspType,allFormsDatas["doMigrateIfNecessary"])
wspsMonitoring.updateWspStatus(wsp.code,"updated")
await new Promise(resolve=>setTimeout(resolve,1e3))}catch(e){wspsMonitoring.updateWspStatus(wsp.code,"failed")
wspTitleErrosArray.push(wsp.wspTitle)
errorsArray.push(e)}}await new Promise(resolve=>setTimeout(resolve,3e3))
if(errorsArray.length>0)throw errorsArray
this._doClose()}catch(e){let list=wspTitleErrosArray.join(", ")
if(dialog)dialog.close()
await ERROR.report(list?"Édition des ateliers en échec.":`Édition des ateliers ${list} en échec.`,e)
await this.refreshBtnsState()}}areasContext(){return{reg:this.reg,regs:this.wspsReg,buildControlLabel:true}}initFormELt(form){form.appendChild(JSX.createElement("fieldset",{class:"fieldslist",id:"wspTypeFs"},JSX.createElement("div",{class:"fields","area-ids":"*"})))}get areaList(){let list=["wspProps:editAll:commons"]
switch(this.reg.env.universe.config.backEnd){case"fs":list.push("wspProps:editAll:fs")
break
case"odb":list.push("wspProps:editAll:db")
break}if(this.reg.env.universe.config.drv)list.push("wspProps:editAll:db:drv")
if(this.reg.env.universe.config.drf)list.push("wspProps:editAll:db:drf")
return list}}REG.reg.registerSkin("c-wsps-editmodel-props",1,`\n\t.info {\n\t\tdisplay: flex;\n\t\talign-items: center;\n\t\tmargin: 1em;\n\t}\n\n\twsps-monitoring {\n\t\tmargin: 0 2em;\n\t\tmax-height: 6em;\n\t\toverflow: auto;\n\t}\n`)
customElements.define("c-wsps-editmodel-props",WspsEditModelProps)

//# sourceMappingURL=wspProps.js.map