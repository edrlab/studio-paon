import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{AgEltBoxSelection}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxSel.js"
import{AgEltBoxInsertDrawerBox}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/insMgr.js"
import{AgEltBoxInputAnnotable,removeAnnots}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{EWedletEditMode,EWedletEditModeLabel,WEDLET,WedletActionCtx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{SrcPointer,SrcPointerCreateItem,SrcPointerDblClick,SrcPointerFastSelect}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcDrawer.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{WED,WedletModelBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedCore.js"
import{SPTE,SpTeSourceUrlWedlet}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/spte/spte.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{DOM,ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{ACTION,ActionHackCtx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{FocusItem,ShortDescCopy}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{EWspChangesEvts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{CDM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/cdm.js"
export class BoxPtrItem extends SrcPointer{get wedMgr(){return this.wedlet.wedMgr}get focusActionables(){return null}get actionContext(){return new WedPtrItemCtx(this)}configWedletElt(tpl,wedlet){this.wedlet=wedlet
if(this.hasAttribute("sel-mode"))this.selMode=this.getAttribute("sel-mode")}refreshBindValue(val,children){super.setSrcRef(val,val===this._pendingSrcRef?this._pendingFields:null)
if(this.wedlet.isVirtual())removeAnnots(this)}setSrcRef(srcRef,fields){this._pendingSrcRef=srcRef
this._pendingFields=fields
try{const docHolder=this.wedlet.wedMgr.docHolder
if(!docHolder.isAvailable)return
if(this.wedlet.isVirtual()){WEDLET.insertDatasFromDisplay(this.wedlet,null,srcRef)}else{docHolder.newBatch().setAttr(this.wedlet.wedAnchor,srcRef).doBatch()}}finally{this._pendingSrcRef=null
this._pendingFields=null}}replaceChars(chars,msg){super.setSrcRef(chars)}setEditMode(mode){this.readOnly=mode!==EWedletEditMode.write
DOM.setAttr(this,"tabindex",mode<EWedletEditMode.readStatic?"0":null)
DOM.setAttr(this,"edit-mode",EWedletEditModeLabel[mode])}isEmpty(){return this._srcRefSub!=null}get sgnPattern(){var _a
const docHolder=this.wedlet.wedMgr.docHolder
if(!docHolder)return null
const struct=docHolder.getStruct(this.wedlet.wedAnchor,WEDLET.buildVirtualPath(this.wedlet))
return(_a=struct)===null||_a===void 0?void 0:_a.itSgnPattern}get subSgnPattern(){var _a
const docHolder=this.wedlet.wedMgr.docHolder
if(!docHolder)return null
const struct=docHolder.getStruct(this.wedlet.wedAnchor,WEDLET.buildVirtualPath(this.wedlet))
return(_a=struct)===null||_a===void 0?void 0:_a.subItSgnPattern}makeInputForDiff(annot){const ptr=(new SrcPointer).initialize({reg:this.reg,readOnly:true,tpl:this.config.tpl,tplOver:this.config.tplOver})
ptr.setSrcRef(annot.otherValue)
return ptr}handleEventFromContainer(ev){if(!(ev instanceof KeyboardEvent)||ev.key===" "||ev.key==="Enter"){if(!this.readOnly){const ctxMenuActions=this.ctxMenuActions
const find=ctxMenuActions.actions.find(a=>a.getId()==="fastSelect")
if(find)find.execute(ctxMenuActions.actionContext,ev)
else{this.dispatchEvent(new CustomEvent("c-contextmenu",{bubbles:true,composed:true}))}}ev.preventDefault()
ev.stopPropagation()}}}const ACTIONS=["actions:wsp:wed:ptr-item"]
const ACCELKEYS=["accelkeys:wsp:wed:ptr-item"]
AgEltBoxInsertDrawerBox(AgEltBoxSelection(AgEltBoxInputAnnotable(BoxPtrItem),{selMode:"input",actionsLists:ACTIONS,groupOrderPref:"groupOrder.wsp.shortDesc",force_ctxMenuActions:true}))
export class BoxPtrItemBlock extends BoxPtrItem{_initialize(init){if(!this.reg)this.reg=this.findReg(init)
if(!("defaultAction"in init))init.defaultAction=this.reg.getSvc(this.defaultActionSvc||"ptrItemDblClick",SrcPointerDblClick.SINGLETON)
if(!("actionsLists"in init))init.actionsLists=ACTIONS
if(!("accelKeysLists"in init))init.accelKeysLists=ACCELKEYS
if(!init.skinOver)init.skinOver="box-ptritem"
if(this.classList.contains("compact")){if(!init.tplSvc)init.tplSvc="wedItemBlockCompact"
if(!init.tplOverSvc)init.tplOverSvc="wedItemBlockOverCompact"}else{if(!init.tplSvc)init.tplSvc="wedItemBlock"
if(!init.tplOverSvc)init.tplOverSvc="wedItemBlockOver"}if(!("dispatchHighlight"in init))init.dispatchHighlight=true
if(!("showStatus"in init))init.showStatus=true
super._initialize(init)}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
if(this.hasAttribute("tplSvc"))init.tplSvc=this.getAttribute("tplSvc")
if(this.hasAttribute("tplOverSvc"))init.tplOverSvc=this.getAttribute("tplOverSvc")
if(this.hasAttribute("defaultActionSvc"))this.defaultActionSvc=this.getAttribute("defaultActionSvc")
if(this.hasAttribute("actionsLists")){const actionsLists=CDM.parse(this.getAttribute("actionsLists"))
init.actionsLists=typeof actionsLists==="string"?[actionsLists]:actionsLists}if(this.hasAttribute("accelKeysLists")){const accelKeysLists=CDM.parse(this.getAttribute("accelKeysLists"))
init.accelKeysLists=typeof accelKeysLists==="string"?[accelKeysLists]:accelKeysLists}if(this.hasAttribute("dispatchHighlight"))init.dispatchHighlight=this.getAttribute("dispatchHighlight")==="true"
if(this.hasAttribute("showStatus"))init.showStatus=this.getAttribute("dispatchHighlight")==="true"
return init}}REG.reg.registerSkin("box-ptritem",1,`\n\t:host {\n\t\tcursor: pointer;\n\t\tuser-select: none;\n\t\talign-self: flex-start;\n\t\tpadding-inline-end: 0;\n\t}\n\n\t:host(.previewLast) .itemPreview {\n\t\torder: 9999;\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--edit-input-focus);\n\t}\n\n\twed-diff-mark {\n\t\tleft: -5px;\n\t}\n`)
window.customElements.define("box-ptritem",BoxPtrItemBlock)
export class BoxPtrItemInline extends BoxPtrItem{_initialize(init){if(!init.skin)init.skin="wsp-src-drawer-inline"
if(!init.skinOver)init.skinOver="box-ptritem"
if(!this.reg)this.reg=this.findReg(init)
if(!("defaultAction"in init))init.defaultAction=this.reg.getSvc(this.defaultActionSvc||"ptrItemDblClick",SrcPointerDblClick.SINGLETON)
if(!("actionsLists"in init))init.actionsLists=ACTIONS
if(!("accelKeysLists"in init))init.accelKeysLists=ACCELKEYS
if(!init.tplSvc)init.tplSvc="wedItemInline"
if(!init.tplOverSvc)init.tplOverSvc="wedItemInlineOver"
if(!("dispatchHighlight"in init))init.dispatchHighlight=true
if(!("showStatus"in init))init.showStatus=true
super._initialize(init)}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
if(this.hasAttribute("tplSvc"))init.tplSvc=this.getAttribute("tplSvc")
if(this.hasAttribute("tplOverSvc"))init.tplOverSvc=this.getAttribute("tplOverSvc")
if(this.hasAttribute("defaultActionSvc"))this.defaultActionSvc=this.getAttribute("defaultActionSvc")
if(this.hasAttribute("actionsLists")){const actionsLists=CDM.parse(this.getAttribute("actionsLists"))
init.actionsLists=typeof actionsLists==="string"?[actionsLists]:actionsLists}if(this.hasAttribute("accelKeysLists")){const accelKeysLists=CDM.parse(this.getAttribute("accelKeysLists"))
init.accelKeysLists=typeof accelKeysLists==="string"?[accelKeysLists]:accelKeysLists}if(this.hasAttribute("dispatchHighlight"))init.dispatchHighlight=this.getAttribute("dispatchHighlight")==="true"
if(this.hasAttribute("showStatus"))init.showStatus=this.getAttribute("dispatchHighlight")==="true"
return init}}window.customElements.define("box-ptritem-inline",BoxPtrItemInline)
export class Action4SrcPointer extends ActionHackCtx{wrapCtx(ctx){return ctx.focusedElt}}function addAction(action,...accelKey){REG.reg.addToList("actions:wsp:wed:ptr-item",action.getId(),1,action)
REG.reg.addToList("actions:wsp:wed:txt-ptr-item",action.getId(),1,action)
if(accelKey)for(const a of accelKey){REG.reg.addToList("accelkeys:wsp:wed:ptr-item",a,1,action)}}addAction(new Action4SrcPointer(new FocusItem),"F3")
addAction(new Action4SrcPointer(SrcPointerFastSelect.SINGLETON),"F4","Enter"," ")
addAction(new Action4SrcPointer(new SrcPointerCreateItem))
REG.reg.addToList("accelkeys:wsp:wed:ptr-item","c-accel",1,new Action4SrcPointer(ShortDescCopy.SINGLETON))
REG.reg.addToList("actions:wsp:wed:txt-ptr-item","copyLink",1,new Action4SrcPointer((new ShortDescCopy).setLabel("Copier le lien")))
const ACTIONS_TXT=["actions:wsp:wed:txt-ptr-item"]
const ACCELKEYS_TXT=["accelkeys:wsp:wed:txt-ptr-item"]
export class TxtPtrItem extends SrcPointer{get txtElement(){return this.parentElement}get wedMgr(){return this.txtElement.wedMgr}get txtRoot(){return this.txtElement.txtRoot}get actionContext(){return new WedTxtPtrItemCtx(this)}onRefreshCycle(before){return this.txtRoot.onRefreshCycle(before)}initSrcRef(srcRef){super.setSrcRef(srcRef)}setSrcRef(srcRef,fields){const txtElt=this.txtElement
this._pendingSrcRef=srcRef
this._pendingFields=fields
try{const docHolder=txtElt.wedMgr.docHolder
if(!docHolder.isAvailable)return
docHolder.newBatch().setAttr(XA.append(txtElt.wedAnchor,"sc:refUri"),srcRef).doBatch()}finally{this._pendingSrcRef=null
this._pendingFields=null}}get sgnPattern(){return sgnPatternFromTxtElement(this.txtElement)}get subSgnPattern(){return sgnPatternFromTxtElement(this.txtElement,true)}get focusActionables(){return null}get focusBar(){if(this._focusBar===undefined){const txtElt=this.txtElement
const wedMgr=txtElt.wedMgr
const datas=wedMgr.getDatasForModel(txtElt.model)
if("focusBar"in datas){this._focusBar=datas.focusBar}else{const ctxActions=this.ctxMenuActions
if(!ctxActions||!ctxActions.actions||ctxActions.actions.length===0){this._focusBar=datas.focusBar=null}else{this._focusBar=datas.focusBar=(new BarActions).initialize({actions:ctxActions.actions,actionContext:new WedTxtPtrItemCtx})}}}this._focusBar.actionContext.focusedElt=this
return this._focusBar}get ctxMenuActions(){const txtMenuActions=this.txtRoot.ctxMenuActions
const ctx=new WedTxtPtrItemCtx(this)
let actions=txtMenuActions.actions.concat(...this.reg.mergeLists(...this.actionsLists))
actions=ACTION.injectSepByGroup(actions,this.reg.getPref("groupOrder.wsp.shortDesc",""),ctx)
return actions&&actions.length>0?{actions:actions,actionContext:ctx}:null}_initDispatchHighlight(init){this.tabIndex=-1}connectedCallback(){super.connectedCallback()
if(this.config.dispatchHighlight){const txtElt=this.txtElement
txtElt.addEventListener("focus",this.onFocus.bind(this))
txtElt.addEventListener("blur",this.onBlur.bind(this))}}get readOnly(){return this.txtRoot.contentEditable!=="true"}}class WedPtrItemCtx extends WedletActionCtx{get shortDescs(){return this.focusedElt.shortDescs}get accelKeyMgr(){return this.focusedElt.accelKeyMgr}get reg(){return this.focusedElt.reg}get infoBroker(){return this.focusedElt.infoBroker}get emitter(){return this.focusedElt}}class WedTxtPtrItemCtx extends WedletActionCtx{get txtRoot(){return this.focusedElt.txtRoot}get accelKeyMgr(){return this.focusedElt.accelKeyMgr}onRefreshCycle(before){return this.focusedElt.onRefreshCycle(before)}get shortDescs(){return this.focusedElt.shortDescs}get reg(){return this.focusedElt.reg}get infoBroker(){return this.focusedElt.infoBroker}get emitter(){return this.focusedElt}}export class TxtPtrItemBlock extends TxtPtrItem{_initialize(init){if(!this.reg)this.reg=this.findReg(init)
init.defaultAction=this.reg.getSvc("ptrItemDblClick",SrcPointerDblClick.SINGLETON)
init.actionsLists=ACTIONS_TXT
init.accelKeysLists=ACCELKEYS_TXT
init.showStatus=true
super._initialize(init)
this.editAction=this.reg.getSvc("ptrItemEditAction",SrcPointerFastSelect.SINGLETON)}}window.customElements.define("txt-ptritem",TxtPtrItemBlock)
export class TxtPtrItemInline extends TxtPtrItem{_initialize(init){if(!init.skin)init.skin="wsp-src-drawer-inline"
if(!init.skinOver)init.skinOver="inl-ptritem"
if(!this.reg)this.reg=this.findReg(init)
init.defaultAction=this.reg.getSvc("ptrItemDblClick",SrcPointerDblClick.SINGLETON)
init.actionsLists=ACTIONS_TXT
init.accelKeysLists=ACCELKEYS_TXT
init.showStatus=true
super._initialize(init)
this.editAction=this.reg.getSvc("ptrItemEditAction",SrcPointerFastSelect.SINGLETON)}}window.customElements.define("inl-ptritem",TxtPtrItemInline)
REG.reg.registerSkin("inl-ptritem",1,`\n\t:host {\n\t\tcursor: pointer;\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--focus-outline);\n\t\toutline-offset: -2px;\n\t}\n\n\t::selection {\n\t\tcolor: currentColor;\n\t\tbackground-color: var(--edit-seltext-bgcolor);\n\t}\n`)
export function sgnPatternFromTxtElement(txtElt,subItemSgn){var _a,_b
const docHolder=txtElt.wedMgr.docHolder
if(!docHolder)return null
const path=txtElt.wedAnchor
path.push("sc:refUri")
const struct=docHolder.getStruct(path,txtElt.wedAttributes&&"sc:refUri"in txtElt.wedAttributes?null:["@"])
return subItemSgn?(_a=struct)===null||_a===void 0?void 0:_a.subItSgnPattern:(_b=struct)===null||_b===void 0?void 0:_b.itSgnPattern}export class SpTeSourceItemModel extends WedletModelBase{initModel(config){super.initModel(config)
if(this.nodeType!==ENodeType.attribute)throw Error("SpTeSourceItem wedlet must be bind to an attribute")
this.transform=config.getAttribute("transform")}createWedlet(parent){return new SpTeSourceItemWedlet(this,parent)}}WED.registerWedletModel("SpTeSourceItem",SpTeSourceItemModel)
export class SpTeSourceItemWedlet extends SpTeSourceUrlWedlet{async initUrl(txt){var _a,_b
const spteElt=SPTE.findSpTeForkedWedlet(this).spTeViews[0].wedlet.spteSource
spteElt.setUrl(null)
const reg=this.wedMgr.reg
this.wspCd=reg.env.wsp.code
this.srcRef=txt
if(txt){if(!this._listenItem)(_a=reg.env.place)===null||_a===void 0?void 0:_a.eventsMgr.on("wspUriChange",this._listenItem=this.listenItem.bind(this))
return this.refreshUrl(spteElt,reg)}else if(this._listenItem){(_b=reg.env.place)===null||_b===void 0?void 0:_b.eventsMgr.removeListener("wspUriChange",this._listenItem)
this._listenItem=undefined}}async refreshUrl(spteElt,reg){const wsp=reg.env.wsp
const shortDesc=await wsp.fetchShortDesc(this.srcRef,spteElt)
if(shortDesc&&shortDesc.itModel&&shortDesc.srcSt>0&&!document.wasDiscarded){const srcUri=wsp.wspMetaUi.getItemType(shortDesc.itModel).getMainStreamSrcUri(shortDesc)
spteElt.setUrl(WSP.getStreamUrl(wsp,srcUri,this.model.transform).url)}}listenItem(msg,from){if(LANG.in(msg.type,EWspChangesEvts.u,EWspChangesEvts.r)&&SRC.srcRef(msg)===this.srcRef&&msg.wspCd===this.wspCd){this.refreshUrl(SPTE.findSpTeForkedWedlet(this).spTeViews[0].wedlet.spteSource,this.wedMgr.reg)}}}export class SpTeStreamItemModel extends SpTeSourceItemModel{createWedlet(parent){return new SpTeStreamItemWedlet(this,parent)}}WED.registerWedletModel("SpTeStreamItem",SpTeStreamItemModel)
export class SpTeStreamItemWedlet extends SpTeSourceItemWedlet{async initUrl(txt){var _a,_b
const currentRootMsg=this.wedMgr.currentMsgsStack[0]
this.noCleanup=currentRootMsg&&currentRootMsg.metas&&currentRootMsg.metas.noCleanup
const spteElt=SPTE.findSpTeForkedWedlet(this).spTeViews[0].wedlet.spteSource
spteElt.setUrl(null)
const reg=this.wedMgr.reg
this.wspCd=reg.env.wsp.code
this.srcRef=txt
spteElt.setUrl(null)
if(txt){if(!this._listenItem)(_a=reg.env.place)===null||_a===void 0?void 0:_a.eventsMgr.on("wspUriChange",this._listenItem=this.listenItem.bind(this))
return this.refreshUrl(spteElt,reg)}else{(_b=reg.env.place)===null||_b===void 0?void 0:_b.eventsMgr.removeListener("wspUriChange",this._listenItem)
this._listenItem=undefined}}async refreshUrl(spteElt,reg){const{wsp:wsp,universe:universe}=this.wedMgr.reg.env
const shortDesc=await wsp.fetchShortDesc(this.srcRef,spteElt)
if(shortDesc&&shortDesc.itModel&&shortDesc.srcSt>0&&!document.wasDiscarded){const srcUri=wsp.wspMetaUi.getItemType(shortDesc.itModel).getMainStreamSrcUri(shortDesc)
let url
let waveformUrl
let duration
try{if(shortDesc.itModel.startsWith("sfile_")){url=WSP.getStreamUrl(wsp,srcUri,this.model.transform).url
if("setWaveformUrl"in spteElt)waveformUrl=WSP.getStreamUrl(wsp,srcUri,"transform=ffmpeg&f=data&map=0:a&acodec=pcm_u8&ar=8k&ac=1&transform=waveformData&ar=8k&r=100").url
if("setDurationProp"in spteElt){try{const props=await WSP.getStreamUrl(wsp,srcUri,"transform=ffmpeg&outType=PROPS&outFormat=json").fetchJson()
duration=props.duration}catch(e){await ERROR.log("Unable to retrieve the stream duration from properties")}}}else{const resp=await universe.httpFrames.web.fetchSvc("*u/remoteContent")
const remoteContentFacet="transform=facet&facet=remoteContent"
if(resp.ok){url=await WSP.fetchStreamText(wsp,this.wedMgr.wedEditor,srcUri,`${remoteContentFacet}&outType=LOCATION&queryString=scDepot:(gotoTags'lowest')`)
if(url&&"setWaveformUrl"in spteElt)waveformUrl=await WSP.fetchStreamText(wsp,this.wedMgr.wedEditor,srcUri,`${remoteContentFacet}&outType=LOCATION&scDepotView=waveformData`)
if(url&&"setDurationProp"in spteElt){try{const props=await WSP.getStreamUrl(wsp,srcUri,`${remoteContentFacet}&outType=CONTENT&scDepotView=originalMetas`).fetchJson()
duration=props.duration}catch(e){await ERROR.log("Unable to retrieve the stream duration from properties")}}}}}catch(e){await ERROR.report("Impossible de récupérer l\'URL du flux ou de sa forme d\'onde.",e)}if(url){spteElt.setUrl(url,this.noCleanup)
if(waveformUrl)spteElt.setWaveformUrl(waveformUrl)
if(duration)spteElt.setDurationProp(duration)}}}listenItem(msg,from){if(LANG.in(msg.type,EWspChangesEvts.u,EWspChangesEvts.r)&&SRC.srcRef(msg)===this.srcRef&&msg.wspCd===this.wspCd){this.noCleanup=false
this.refreshUrl(SPTE.findSpTeForkedWedlet(this).spTeViews[0].wedlet.spteSource,this.wedMgr.reg)}}}export const ptrItemTagsDefined=Promise.resolve()
export class WspDataTransferWedAnalyzer{async tryPaste(dataTrsf,pasteCtx,cache,wedMgr){let shortDescsTrsf=ITEM.getShortDescsTransferFromExternal(wedMgr.reg,dataTrsf,{targetSrcType:"item",canCreate:true},wedMgr.wedEditor.rootNode)
if(shortDescsTrsf){await shortDescsTrsf.extractDatasNow(dataTrsf)
const imps=await wedMgr.docHolder.house.schemaDom.tryPasteLinks(pasteCtx,shortDescsTrsf,cache)
const defImps=await wedMgr.tryPasteDefault(pasteCtx,cache,dataTrsf)
if(imps&&defImps)return[...imps,...defImps]
return imps||defImps}shortDescsTrsf=await ITEM.getShortDescsTransferFromDataTransfer(dataTrsf,wedMgr.reg.env.wsp)
if(shortDescsTrsf)return wedMgr.docHolder.house.schemaDom.tryPasteLinks(pasteCtx,shortDescsTrsf,cache)
return null}extractDatasFromDragSession(dataTrsf,wedMgr){const shortDescTrsf=ITEM.getShortDescsTransferFromDragSession(wedMgr.reg,dataTrsf,{targetSrcType:"item",canCreate:true},wedMgr.wedEditor)
if(shortDescTrsf){if(!shortDescTrsf.isImport&&shortDescTrsf.srcRefs&&shortDescTrsf.srcRefs.length===0)return{}
if(shortDescTrsf.server&&wedMgr.reg.env.universe.config.universeUrl.url!==shortDescTrsf.server){POPUP.showNotifInfo("Il est impossible d\'exploiter des items d\'un autre entrepôt.",wedMgr.wedEditor)
return{}}return{originalLinks:shortDescTrsf}}return null}}WspDataTransferWedAnalyzer.SINGLETON=new WspDataTransferWedAnalyzer

//# sourceMappingURL=ptrItem.js.map