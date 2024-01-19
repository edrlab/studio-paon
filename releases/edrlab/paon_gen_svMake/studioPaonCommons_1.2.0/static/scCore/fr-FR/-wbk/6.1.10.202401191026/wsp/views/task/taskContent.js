import{BaseElement,BaseElementAsync,BASIS,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{ItemEditInDialogInfoBroker,ItemXmlEd}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/item/itemXmlEd.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{ItemDynGen}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/item/itemDynGen.js"
import{InfoFocusItem}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{ItemViewerSingle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemViewerSingle.js"
import{EItemTypeFamily}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js"
import{ButtonActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{LIFECYCLE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/lcTask.js"
import{EWspChangesEvts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
export class InfoReqTaskContentItems{}export class InfoTaskCurrentItemsChange{constructor(srcRef,shortDesc,lastDatas){this.srcRef=srcRef
this.shortDesc=shortDesc
this.lastDatas=lastDatas}}export class TaskCtEdit extends BaseElementAsync{async _initialize(init){var _a
this.reg=this.findReg(init)
this.config=init
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
const itemToEdit=findItemToEdit(this.reg,init);(_a=this.reg.env.infoBroker)===null||_a===void 0?void 0:_a.addConsumer(this)
if(!itemToEdit){sr.appendChild((new MsgLabel).initialize({label:"Aucun item n\'est lié à cette tâche"}))}else{const srcId=itemToEdit.srcId
await this.initEditor(srcId)}}async initEditor(srcId,shortDesc){this.clearContent()
const wspReg=WSP.findWspReg(this.reg)
const wsp=wspReg.env.wsp
if(!shortDesc)shortDesc=await WSP.fetchShortDesc(wsp,this,srcId)
this._currentItemToEdit=shortDesc
const itemType=wsp.wspMetaUi.getItemType(shortDesc.itModel)
if(this.config.mode!=="mainView"&&itemType.getFamily()===EItemTypeFamily.xml&&itemType.getEditor(this.config.editorKey)){this.editor=this.shadowRoot.appendChild((new ItemXmlEd).initialize({reg:wspReg,srcRef:srcId,writePerms:this.config.writePerms,editorKey:this.config.editorKey,initItemReg:reg=>{reg.env.infoBroker=new ItemEditInDialogInfoBroker(wspReg)}}))
if(this._shown)VIEWS.onViewShown(this.editor)}else{this.itemViewer=new ItemViewerSingle({mainViewCode:":hideWspStruct:"})
const root=this.shadowRoot.appendChild(JSX.createElement("div",null))
await this.itemViewer.initViewer(wspReg,root,null,srcId)
if(this._shown)VIEWS.onViewShown(this.itemViewer)}}clearContent(){if(this.editor){if(this._shown)VIEWS.onViewHidden(this.editor,true)
this.shadowRoot.removeChild(this.editor)
this.editor=null}if(this.itemViewer){if(this._shown)VIEWS.onViewHidden(this.itemViewer,true)
this.itemViewer.mainViewParent.remove()
this.itemViewer=null}}onInfo(info){var _a
if(this.config.handleFocusItem){if(info instanceof InfoFocusItem&&!info.handled){info.handled=true
this.initEditor(info.srcRef,info.shortDesc);(_a=this.reg.env.infoBroker)===null||_a===void 0?void 0:_a.dispatchInfo(new InfoTaskCurrentItemsChange(info.srcRef,info.shortDesc),this)}}if(info instanceof InfoReqTaskContentItems){if(this.hidden)return
if(this._currentItemToEdit){if(!info.entries)info.entries=[]
info.entries.push({entrySgn:"taskCtEdit",shortDesc:this._currentItemToEdit})}}}onViewShown(){var _a
this._shown=true
if(this.editor)VIEWS.onViewShown(this.editor)
if(this.itemViewer)VIEWS.onViewShown(this.itemViewer)
if(this._currentItemToEdit)(_a=this.reg.env.infoBroker)===null||_a===void 0?void 0:_a.dispatchInfo(new InfoTaskCurrentItemsChange(this._currentItemToEdit.srcUri,this._currentItemToEdit),this)}onViewHidden(closed){var _a
this._shown=false
if(this.editor)VIEWS.onViewHidden(this.editor,closed)
if(this.itemViewer)VIEWS.onViewHidden(this.itemViewer,closed);(_a=this.reg.env.infoBroker)===null||_a===void 0?void 0:_a.dispatchInfo(new InfoTaskCurrentItemsChange,this)}}REG.reg.registerSkin("wsp-task-ct-edit",1,`\n\t:host,\n\tdiv {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\twsp-item-xmled {\n\t\tflex: 1;\n\t}\n`)
customElements.define("wsp-task-ct-edit",TaskCtEdit)
export class TaskCtDynGen extends BaseElement{_initialize(init){var _a
this.reg=this.findReg(init)
this.config=init
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
const itemToShow=findItemToEdit(this.reg,init);(_a=this.reg.env.infoBroker)===null||_a===void 0?void 0:_a.addConsumer(this)
if(!itemToShow)this.appendChild((new MsgLabel).initialize({label:"Aucun item n\'est lié à cette tâche"}))
else this.initDynGen(itemToShow.srcId)}initDynGen(srcId){this.clearContent()
this.srcId=srcId
const wspReg=WSP.findWspReg(this.reg)
const dynGenInit=BASIS.newInit(this.config,wspReg)
dynGenInit.srcRef=srcId
if(!dynGenInit.toolbar)dynGenInit.toolbar=false
this.itemDynGen=this.shadowRoot.appendChild((new ItemDynGen).initialize(dynGenInit))
if(this._shown)VIEWS.onViewShown(this.itemDynGen)
this.itemDynGen.view.onError.add(this.onGenError)}clearContent(){if(this.itemDynGen){VIEWS.onViewHidden(this.itemDynGen,true)
this.shadowRoot.removeChild(this.itemDynGen)
this.itemDynGen.view.onError.delete(this.onGenError)
this.itemDynGen=null}if(this.itemViewer){if(this._shown)VIEWS.onViewHidden(this.itemViewer,true)
this.itemViewer.mainViewParent.remove()
this.itemViewer=null}}onInfo(info){var _a
if(this.config.handleFocusItem){if(info instanceof InfoFocusItem&&!info.handled){info.handled=true
this.initDynGen(info.srcRef);(_a=this.reg.env.infoBroker)===null||_a===void 0?void 0:_a.dispatchInfo(new InfoTaskCurrentItemsChange(info.srcRef),this)}}if(info instanceof InfoReqTaskContentItems){if(this.hidden||!this._shown)return
if(this.srcId){if(!info.entries)info.entries=[]
info.entries.push({entrySgn:"taskCtDynGen",srcUri:this.srcId})}}}onViewShown(){var _a
this._shown=true
if(this.itemDynGen)VIEWS.onViewShown(this.itemDynGen)
if(this.itemViewer)VIEWS.onViewShown(this.itemViewer)
if(this.srcId)(_a=this.reg.env.infoBroker)===null||_a===void 0?void 0:_a.dispatchInfo(new InfoTaskCurrentItemsChange(this.srcId),this)}onViewHidden(closed){var _a
this._shown=false
if(this.itemDynGen)VIEWS.onViewHidden(this.itemDynGen,closed)
if(this.itemViewer)VIEWS.onViewHidden(this.itemViewer,closed);(_a=this.reg.env.infoBroker)===null||_a===void 0?void 0:_a.dispatchInfo(new InfoTaskCurrentItemsChange,this)}onGenError(err,msg,dynGen){const me=DOMSH.findHost(DOMSH.findHost(dynGen))
me.clearContent()
me.itemViewer=new ItemViewerSingle
const root=me.shadowRoot.appendChild(JSX.createElement("div",null))
me.itemViewer.initViewer(me.reg,root,null,me.srcId)
if(me._shown)VIEWS.onViewShown(me.itemViewer)}}REG.reg.registerSkin("wsp-task-ct-dyngen",1,`\n\t:host,\n\tdiv {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n`)
customElements.define("wsp-task-ct-dyngen",TaskCtDynGen)
function findItemToEdit(reg,config){const taskDesc=reg.env.longDesc
const cts=taskDesc.actCts
if(cts)return cts[0]}export class TaskCtLc extends ButtonActions{get fieldName(){return"lcSt"}get value(){return this.selectedTrans?this.selectedTrans.trans.targetState:this.srcLongDesc?this.srcLongDesc.lcSt:""}get label(){return this.reg.env.wsp.wspMetaUi.getLcStateOrUnknown(this.value).name}get icon(){return this.reg.env.wsp.wspMetaUi.getLcStateOrUnknown(this.value).iconUrl}get shortDescs(){return[this.srcLongDesc]}get emitter(){return this}_initialize(init){var _a
this.reg=this.findReg(init)
this.config=init
init.skinOver=this.localName
init.groupOrder=this.reg.env.wsp.wspMetaUi.getLcTransitionsGroupOrder()
this.onWspUriChange=this._onWspUriChange.bind(this);(_a=this.reg.env.infoBroker)===null||_a===void 0?void 0:_a.addConsumer(this)
this.reg.env.place.eventsMgr.on("wspUriChange",this.onWspUriChange)
super._initialize(init)
const itemToShow=findItemToEdit(this.reg,this.config)
this.onRefreshTask(itemToShow.srcId)}async onRefreshTask(srcId,longDesc){this.innerHTML=""
if(!srcId)this.appendChild((new MsgLabel).initialize({label:"Aucun item n\'est lié à cette tâche"}))
else{this.srcId=srcId
this.srcLongDesc=longDesc||await this.reg.env.wsp.fetchLongDesc(this.srcId)
this.actions=LIFECYCLE.listAllTransitionActions(this.reg.env.wsp.wspMetaUi)
this.refresh()}}_refresh(){super._refresh()
this.disabled=this.config.editable===false||this.config.writePerms&&!this.reg.hasPerm(this.config.writePerms)}onViewHidden(closed){if(closed){this.reg.env.place.eventsMgr.removeListener("wspUriChange",this.onWspUriChange)}}onInfo(info){var _a
if(this.config.handleFocusItem){if(info instanceof InfoFocusItem&&!info.handled){info.handled=true;(_a=this.reg.env.infoBroker)===null||_a===void 0?void 0:_a.dispatchInfo(new InfoTaskCurrentItemsChange(info.shortDesc.srcId),this)
this.onRefreshTask(info.shortDesc.srcId)}}if(info instanceof InfoReqTaskContentItems){if(this.hidden)return
if(this.srcLongDesc||this.srcId){if(!info.entries)info.entries=[]
info.entries.push({entrySgn:"taskCtLc",shortDesc:this.srcLongDesc,srcUri:this.srcId})}}}_onWspUriChange(msg,from){if(this.srcLongDesc){if(msg.type===EWspChangesEvts.lcSt&&SRC.srcRef(this.srcLongDesc)===SRC.srcRef(msg)){this.onRefreshTask(msg.srcId)}}}}REG.reg.registerSkin("wsp-task-ct-lc",1,`\n\t:host {\n\t\tcolor: var(--edit-color);\n\t}\n\n\t:host([disabled]) {\n\t\topacity: unset;\n\t}\n`)
customElements.define("wsp-task-ct-lc",TaskCtLc)

//# sourceMappingURL=taskContent.js.map