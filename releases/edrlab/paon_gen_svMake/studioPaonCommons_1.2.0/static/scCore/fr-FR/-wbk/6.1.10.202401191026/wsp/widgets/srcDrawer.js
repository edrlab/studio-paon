import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{PopupTooltip}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{ItemCreator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/itemCreator.js"
import{Action,ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{EventMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{renderAppend,xhtml}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/htmlLit.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{InfoHighlighItemSgn,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{ItemType,UTILS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js"
import{FocusItem,SrcAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{SearchItemSgnRegexp}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
import{isEltBoxSelection}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxSel.js"
import{EWspChangesEvts,WspsLivePlace}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{LOCALE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
export class SrcDrawer extends BaseElement{_getItemType(){try{return this._fields?this.reg.env.wsp.wspMetaUi.getItemType(this._fields.itModel):this.reg.env.wsp.wspMetaUi.itemTypeNull}catch(e){return null}}_initialize(init){this.config=init||{}
if(!this.reg)this.reg=this.findReg(init)
if(!this.config.place)this.config.place=this.reg.env.place
if(this.config.tplSvc)this.config.tpl=this.reg.getSvc(this.config.tplSvc)
if(this.config.tplOverSvc)this.config.tplOver=this.reg.getSvc(this.config.tplOverSvc)
if(!this.config.tpl)this.config.tpl=SRCDRAWER.itemCodeTpl
this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.nodeName,init)
if(init.tplOver){this.addEventListener("pointerenter",(function(ev){const tt=(new PopupTooltip).initialize({tooltipOf:this,skinOver:"wsp-src-drawer/tooltip",hoverAllowed:true})
tt.addEventListener("c-show",(function(ev){const drawer=this.tooltipOf
const itemType=drawer._getItemType()
const tpl=itemType?drawer.config.tplOver(itemType,drawer._fields,drawer):null
if(tpl)renderAppend(tpl,this.contentRoot)
else this.close()}))
tt.forwardPointerEnter(ev)}),{once:true})}if(!this._srcRefSub)this._srcRefSub=init.srcRef||null
if(init.shortDesc){this.redraw(init.shortDesc)}else this.fetchSrc()}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
if(this.hasAttribute("srcRef"))init.srcRef=this.getAttribute("srcRef")
if(this.hasAttribute("tpl"))init.tplSvc=this.getAttribute("tpl")
if(this.hasAttribute("tpl-over"))init.tplSvc=this.getAttribute("tpl-over")
if(this.hasAttribute("show-status"))init.showStatus=this.getAttribute("show-status")==="true"
return init}connectedCallback(){super.connectedCallback()
if(this.config.place instanceof WspsLivePlace&&this._refreshFreeze===0){this._lstn=this.onWspUriChange.bind(this)
this.config.place.eventsMgr.on("wspUriChange",this._lstn)}}disconnectedCallback(){if(this.config.place instanceof WspsLivePlace&&this._refreshFreeze===0)this.config.place.eventsMgr.removeListener("wspUriChange",this._lstn)}get srcRef(){return ITEM.extractSrcRef(this._srcRefSub)}get srcRefSub(){return this._srcRefSub}setSrcRef(srcRefSub,fields){if(fields)srcRefSub=ITEM.srcRefSub(fields)
if(this._srcRefSub===srcRefSub&&fields===undefined)return
this._srcRefSub=srcRefSub
if(this.initialized){if(fields)this.redraw(fields)
else return this.fetchSrc()}}get shortDesc(){return this._fields}get onSrcRefChange(){return this._onSrcRefChange||(this._onSrcRefChange=new EventMgr)}async fetchSrc(){const srcRef=this._srcRefSub
if(srcRef){this.fetchPending=this.reg.env.wsp.fetchShortDesc(srcRef,this)
try{const fields=await this.fetchPending
if(srcRef===this._srcRefSub)this.redraw(fields)}catch(e){this.redraw(null)}finally{this.fetchPending=null}}else this.redraw(null)}redraw(fields){this._srcRefSub=fields?ITEM.srcRefSub(fields):null
this._fields=fields
if(this.shortDescs){if(fields)this.shortDescs[0]=fields
else this.shortDescs.length=0}this.classList.toggle("empty",fields==null)
const lastCh=this.shadowRoot.lastElementChild
const itemType=this._getItemType()
renderAppend(itemType?this.config.tpl(itemType,fields,this):xhtml`<span/>`,this.shadowRoot)
if(lastCh.localName!=="slot")this.shadowRoot.appendChild(JSX.createElement("slot",null))
if(this._onSrcRefChange)this._onSrcRefChange.emit(this)}onWspUriChange(msg,from){if(msg.wspCd!==this.reg.env.wsp.code)return
if(msg.type===EWspChangesEvts.r){if(this._fields&&SRC.isSubUriOrEqual(msg.srcUri,this._fields.srcUri))this.fetchSrc()}else if(this.srcRef===SRC.srcRef(msg)){if(msg.type===EWspChangesEvts.u)this.fetchSrc()
else if(this.config.showStatus&&msg.type===EWspChangesEvts.s){if(this._fields){this._fields["itSt"]=msg.itSt
this.redraw(this._fields)}else this.fetchSrc()}}}get infoBroker(){return this.reg.env.infoBroker}get emitter(){return this}}REG.reg.registerSkin("wsp-src-drawer",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tpadding: 2px;\n\t\tmargin: 0 .5em;\n\t}\n\n\t.code {\n\t\tcolor: var(--fade-color);\n\t\tfont-size: var(--label-size);\n\t}\n\n\t.icon {\n\t\tfilter: var(--filter);\n\t\tvertical-align: text-bottom;\n\t\tuser-select: none;\n\t}\n\n\t.itTi {\n\t\tcolor: var(--alt1-color);\n\t\tfont-size: var(--label-size);\n\t}\n\n\t.imgView, .videoView, .audioView, .iframeView, .dynGenView {\n\t\tmax-height: 10em;\n\t\tobject-fit: scale-down;\n\t\tmax-width: 100%;\n\t}\n\n\t.audioView {\n\t\tmax-height: 2em;\n\t}\n\n\t.iframeView, .dynGenView {\n\t\tborder: 1px solid var(--border-color);\n\t\twidth: 100%;\n\t}\n`)
customElements.define("wsp-src-drawer",SrcDrawer)
export class SrcDrawerInline extends SrcDrawer{}REG.reg.registerSkin("wsp-src-drawer-inline",1,`\n\t:host {\n\t\twhite-space: nowrap;\n\t\tuser-select: none;\n\t}\n\n\t.imgView, .videoView, .audioView, .iframeView, .dynGenView {\n\t\tmax-height: 5em;\n\t\tvertical-align: bottom;\n\t}\n\n\t.audioView {\n\t\tmax-height: 2em;\n\t}\n\n\t:host(.fixedIconSize) .icon {\n\t\tmax-height: var(--icon-size);\n\t\twidth: var(--icon-size);\n\t}\n\n\t.code,\n\t.itTi {\n\t\tcolor: var(--fade-color);\n\t\tfont-size: var(--label-size);\n\t}\n\n\t.icon {\n\t\tfilter: var(--filter);\n\t\tvertical-align: text-bottom;\n\t\tmax-height: 1 lh;\n\t\tmax-height: 1.4em;\n\t}\n`)
customElements.define("wsp-src-drawer-inline",SrcDrawerInline)
REG.reg.registerSkin("wsp-src-drawer/tooltip",1,`\n\t#content {\n\t\tflex: 1 1 auto;\n\t\toverflow: hidden;\n\t\ttext-overflow: ellipsis;\n\t}\n\n\t.details {\n\t\tfont-size: var(--label-size);\n\t\tpadding: 0;\n\t\tmargin: .5em;\n\t}\n\n\t.details > li {\n\t\tdisplay: block;\n\t\tmax-width: 40vw;\n\t}\n\n\t.itTi {\n\t\tfont-weight: bold;\n\t}\n\n\t.val {\n\t\tuser-select: all;\n\t}\n\n\t.itemPreview {\n\t\tborder: 1px solid var(--border-color);\n\t\tmax-height: 40vh;\n\t\tmax-width: 40vw;\n\t}\n\n\t.imgView, .videoView, .audioView, .iframeView, .dynGenView {\n\t\tmax-width: 40vw;\n\t\tmax-height: 40vh;\n\t}\n\n\t.audioView {\n\t\tmax-height: 2em;\n\t}\n`)
export class SrcPointer extends SrcDrawer{constructor(){super()
this.shortDescs=[]}get actionContext(){return this}openFastSelect(){return SrcPointerFastSelect.SINGLETON.execute(this)}get focusActionables(){return ActionBtn.mergeActionablesForBar(this.reg,this.reg.getPref("groupOrder.wsp.shortDesc",""),this,...this.actionsLists)}get ctxMenuActions(){let actions=this.reg.mergeLists(...this.actionsLists)
actions=ACTION.injectSepByGroup(actions,this.reg.getPref("groupOrder.wsp.shortDesc",""),this)
return actions&&actions.length>0?{actions:actions,actionContext:this.actionContext}:null}get sgnPattern(){return this._sgnPattern}get subSgnPattern(){return this._subSgnPattern}_initialize(init){this.tabIndex=0
if(!init.skin)init.skin="wsp-src-drawer"
if(!init.skinOver)init.skinOver="wsp-src-pointer"
super._initialize(init)
if(init.defaultAction)this.addEventListener("dblclick",this.onDblClick)
if(init.readOnly)this.readOnly=init.readOnly
if(init.sgnPattern)this._sgnPattern=init.sgnPattern
if(init.subSgnPattern)this._subSgnPattern=init.subSgnPattern
this.actionsLists=init.actionsLists||ACTIONS
this.accelKeyMgr=ACTION.mergeAccelKeyMgr(this.reg,...init.accelKeysLists||ACCELKEYS)
if(this.accelKeyMgr)this.addEventListener("keydown",(function(ev){this.accelKeyMgr.handleKeyboardEvent(ev,this.actionContext)}))
if(init.draggable){this.setAttribute("draggable","true")
this.addEventListener("dragstart",(function(ev){if(this.shortDescs[0])ITEM.setShortDescTransferToDragSession(this,ev,"native")}))
this.addEventListener("dragend",ITEM.resetShortDescTransferToDragSession)}if(init.dropable){const transferCtx={targetSrcType:"item",canCreate:init.srcCreatable}
this.addEventListener("dragover",(function(ev){ev.preventDefault()
ev.stopImmediatePropagation()
const shortDescs=ITEM.getShortDescsTransferFromDragSession(this.reg,ev.dataTransfer,transferCtx,this)
ev.dataTransfer.dropEffect=!shortDescs||shortDescs.srcRefs.length<1||shortDescs.wspCd!==this.reg.env.wsp.code?"none":"copy"}))
this.addEventListener("drop",(function(ev){ev.preventDefault()
ev.stopImmediatePropagation()
const shortDescs=ITEM.getShortDescsTransferFromDragSession(this.reg,ev.dataTransfer,transferCtx,this)
if(!shortDescs||shortDescs.isImport||shortDescs.srcRefs.length<1||shortDescs.wspCd!==this.reg.env.wsp.code)return
this.setSrcRef(shortDescs.srcRefs[0],shortDescs.shortDescs[0])}))}this._initDispatchHighlight(init)}_initDispatchHighlight(init){if(init.dispatchHighlight&&this.reg.env.infoBroker){this.addEventListener("focus",this.onFocus)
this.addEventListener("blur",this.onBlur)}}redraw(fields){super.redraw(fields)
if(this.config.dispatchHighlight&&this.matches(":focus")){const infoBroker=this.reg.env.infoBroker
if(infoBroker)infoBroker.dispatchInfo(new InfoHighlighItemSgn(this.sgnPattern,this.srcRef),this)}}onFocus(ev){const infoBroker=this.reg.env.infoBroker
if(infoBroker)infoBroker.dispatchInfo(new InfoHighlighItemSgn(this.sgnPattern,this.srcRef),this)}onBlur(ev){const infoBroker=this.reg.env.infoBroker
if(infoBroker)infoBroker.dispatchInfo(new InfoHighlighItemSgn(null),this)}onDblClick(ev){const act=this.config.defaultAction
if(act)act.executeIfAvailable(this,ev)}fillJson(parent,root){if(this.propName)parent[this.propName]=this.srcRef}extractJson(parent){if(this.propName&&this.propName in parent){this.setSrcRef(parent[this.propName])
return true}return false}}customElements.define("wsp-src-pointer",SrcPointer)
REG.reg.registerSkin("wsp-src-pointer",1,`\n\t:host {\n\t\tcursor: pointer;\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--focus-outline);\n\t\toutline-offset: -2px;\n\t}\n`)
export class SrcPointerInline extends SrcPointer{_initialize(init){if(!init.skin)init.skin="wsp-src-drawer-inline"
if(!init.skinOver)init.skinOver="wsp-src-pointer-inline"
super._initialize(init)}}customElements.define("wsp-src-pointer-inline",SrcPointerInline)
REG.reg.registerSkin("wsp-src-pointer-inline",1,`\n\t:host {\n\t\tcursor: pointer;\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--focus-outline);\n\t\toutline-offset: -2px;\n\t}\n`)
export class SrcBtn extends ActionBtn{_initialize(init){init.skin="wsp-src-btn"
super._initialize(init)
init.skin="wsp-src-drawer-inline"
if(!init.place)init.place="none"
this.shadowRoot.appendChild((new SrcDrawer).initialize(init))}_refresh(){}}REG.reg.registerSkin("wsp-src-btn",1,`\n\t:host {\n\t\tdisplay: flex;\n\t}\n\n\t:host(:focus) {\n\t\tbackground-color: var(--row-inSel-bgcolor);\n\t\toutline: none;\n\t}\n`)
customElements.define("wsp-src-btn",SrcBtn)
export class SrcPointerSetterAction extends Action{constructor(shortDesc){super()
this.shortDesc=shortDesc}buildCustomButton(ctx,uiContext,parent){return(new SrcBtn).initialize({reg:ctx.reg,action:this,actionContext:ctx,shortDesc:this.shortDesc,uiContext:uiContext,role:uiContext==="menu"?"menuitem":"button"})}execute(ctx,ev){ctx.setSrcRef(SRC.srcRef(this.shortDesc),this.shortDesc)}}const ACTIONS=["actions:wsp:src-pointer","actions:wsp:shortDesc"]
const ACCELKEYS=["accelkeys:wsp:src-pointer","accelkeys:wsp:shortDesc"]
export class SrcPointerWriteAction extends Action{isEnabled(ctx){if(ctx.readOnly)return false
return super.isEnabled(ctx)}}export class SrcPointerPaste extends SrcPointerWriteAction{constructor(){super("paste")
this.setLabel("Coller")
this.setGroup("clipboard")}async execute(ctx,ev){const wsp=ctx.reg.env.wsp
const shortDescs=await ITEM.getShortDescsTransferFromClipboard(wsp,ctx.emitter)
if(!shortDescs||Array.isArray(shortDescs))return
if(shortDescs.isImport||shortDescs.srcRefs.length<1||shortDescs.wspCd!==wsp.code)return
ctx.setSrcRef(shortDescs.srcRefs[0],shortDescs.shortDescs[0])}}SrcPointerPaste.SINGLETON=new SrcPointerPaste
export class SrcPointerCreateItem extends SrcPointerWriteAction{constructor(){super("create")
this.setLabel("Créer un item...")
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/createItem.svg"
this.setGroup("edit")}isVisible(ctx){if(!ctx.reg.getPref("wsp.createItem",true))return false
return super.isVisible(ctx)}async execute(ctx,ev){const regexp=ctx.sgnPattern
const itemCtx=ctx.reg.env.longDesc
const newItem=await ItemCreator.openCreateItem(ItemCreator.setDefaultConfigFromReg(ctx.reg,{itemTypesTree:{itemTypeReducer:regexp?(acc,cur)=>{if(regexp.test(cur.getSgn()))acc.push(cur)
return acc}:null,textFilter:""},spaceUri:itemCtx?ITEM.extractSpaceUri(itemCtx.srcUri):""}),"Créer un item...",ctx).onNextClose()
if(newItem)ctx.setSrcRef(SRC.srcRef(newItem),newItem)}}export class SrcPointerFastSelect extends SrcPointerWriteAction{constructor(id){super(id||"fastSelect")
this._label="Sélection rapide..."
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/fastFind.svg"
this._group="ptrEdit"}setCustomCrit(crit){this.customCrit=crit
return this}async execute(ctx,ev){const{FastFindItem:FastFindItem}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/fastFindItem.js")
const currentSrc=ctx.reg.env.longDesc
const sgnPattern=ctx.sgnPattern
const sd=await FastFindItem.openFastFind({reg:ctx.reg,restrictions:this.getRestrictions(ctx,ev),srcFilter:this.getSrcFilter(ctx,ev),itemCreator:ctx.reg.getPref("wsp.createItem",true)?ItemCreator.setDefaultConfigFromReg(ctx.reg,{spaceUri:currentSrc?ITEM.extractSpaceUri(currentSrc.srcUri):"",itemTypesTree:{itemTypeReducer:sgnPattern?(acc,cur)=>{if(sgnPattern.test(cur.getSgn()))acc.push(cur)
return acc}:null}}):undefined,subItemsFind:ctx.subSgnPattern?{subItemSgnPattern:ctx.subSgnPattern}:undefined},ctx,ev).onNextClose()
ctx.focus()
if(sd)ctx.setSrcRef(ITEM.srcRefSub(sd),sd)}getRestrictions(ctx,ev){if(this.customCrit)return this.customCrit
const sgnPattern=ctx.sgnPattern
return sgnPattern?new SearchItemSgnRegexp(sgnPattern.source):null}getSrcFilter(ctx,ev){return null}}SrcPointerFastSelect.SINGLETON=new SrcPointerFastSelect
export class SrcPointerErase extends SrcPointerWriteAction{constructor(){super("erase")
this.setLabel("Effacer")
this.setGroup("ptrEdit")}isVisible(ctx){if(ctx.srcRef==null)return false
return super.isVisible(ctx)}async execute(ctx,ev){ctx.setSrcRef(null)}}export class SrcPointerDblClick extends SrcAction{constructor(){super("focusItemOrSelect")}isEnabled(){return true}execute(ctx,ev){const sd=ctx.shortDescs[0]
if(ctx.infoBroker&&(sd===null||sd===void 0?void 0:sd.srcUri)!=null){FocusItem.gotoItem(ctx.infoBroker,sd,ctx.emitter)
ev===null||ev===void 0?void 0:ev.preventDefault()
ev===null||ev===void 0?void 0:ev.stopImmediatePropagation()}else if(!ctx.emitter.readOnly){SrcPointerFastSelect.SINGLETON.executeIfAvailable(ctx,ev)
ev===null||ev===void 0?void 0:ev.preventDefault()
ev===null||ev===void 0?void 0:ev.stopImmediatePropagation()}}}SrcPointerDblClick.SINGLETON=new SrcPointerDblClick
function addAction(action,accel,order){REG.reg.addToList("actions:wsp:src-pointer",action.getId(),1,action,order)
if(accel)REG.reg.addToList("accelkeys:wsp:src-pointer",accel,1,action)}addAction(SrcPointerFastSelect.SINGLETON,"F4")
addAction(new SrcPointerCreateItem)
addAction(SrcPointerPaste.SINGLETON,"v-accel",10)
addAction(new SrcPointerErase,"Delete",15)
export var SRCDRAWER;(function(SRCDRAWER){function itemCodeTpl(itemType,fields,srcDrawer){return xhtml`<span class="itemCode"><img class="icon" src="${itemType.getIcon(srcDrawer.config.showStatus?fields:null)}" draggable="false"/><span class="code">${fields?ITEM.getSrcMainName(srcDrawer.reg,fields,itemType.wspMeta):""}</span></span>`}SRCDRAWER.itemCodeTpl=itemCodeTpl
function itemCodeAloneTpl(itemType,fields,srcDrawer){return xhtml`<span class="itemCode"><img class="icon" src="${itemType.getIcon(srcDrawer.config.showStatus?fields:null)}" draggable="false"/><span>${fields?ITEM.getSrcMainName(srcDrawer.reg,fields,itemType.wspMeta):""}</span></span>`}SRCDRAWER.itemCodeAloneTpl=itemCodeAloneTpl
function itemTitleTpl(itemType,fields,srcDrawer){return xhtml`<span class="itTi">${fields?ITEM.getTitle(fields):""}</span>`}SRCDRAWER.itemTitleTpl=itemTitleTpl
function itemIconTitleTpl(itemType,fields,srcDrawer){return xhtml`<span class="itTi"><img class="icon" src="${itemType.getIcon(srcDrawer.config.showStatus?fields:null)}" draggable="false"/>${fields?ITEM.getTitle(fields):""}</span>`}SRCDRAWER.itemIconTitleTpl=itemIconTitleTpl
function itemTitleOrCodeTpl(itemType,fields,srcDrawer){return fields&&ITEM.getTitle(fields)?itemIconTitleTpl(itemType,fields,srcDrawer):itemCodeTpl(itemType,fields,srcDrawer)}SRCDRAWER.itemTitleOrCodeTpl=itemTitleOrCodeTpl
function itemCodeAndTitleTpl(itemType,fields,srcDrawer){return xhtml`${itemCodeTpl(itemType,fields,srcDrawer)}<span class="itTi">${fields?ITEM.getSrcSecondName(srcDrawer.reg,fields,itemType.wspMeta):null}</span>`}SRCDRAWER.itemCodeAndTitleTpl=itemCodeAndTitleTpl
function itemUriTpl(itemType,fields,srcDrawer){return xhtml`<span part="itemUri"><img class="icon" part="icon" src="${itemType.getIcon(srcDrawer.config.showStatus?fields:null)}" draggable="false"/><span part="uri">${fields?ITEM.extractItemUri(fields.srcUri):""}</span></span>`}SRCDRAWER.itemUriTpl=itemUriTpl
function previewTpl(itemType,fields,srcDrawer){if(!fields||!itemType)return undefined
const wsp=srcDrawer.reg.env.wsp
if(fields.itSubItem){const subTitemType=wsp.wspMetaUi.getItemType(fields.itSubItem.mo)
return subTitemType===null||subTitemType===void 0?void 0:subTitemType.getPreview(wsp,fields,srcDrawer.reg,UTILS)}return itemType.getPreview(wsp,fields,srcDrawer.reg,UTILS)}SRCDRAWER.previewTpl=previewTpl
function previewOrItemCodeTpl(itemType,fields,srcDrawer){return previewTpl(itemType,fields,srcDrawer)||itemCodeTpl(itemType,fields,srcDrawer)}SRCDRAWER.previewOrItemCodeTpl=previewOrItemCodeTpl
function previewOrItemTitleOrCodeTpl(itemType,fields,srcDrawer){return previewTpl(itemType,fields,srcDrawer)||itemTitleOrCodeTpl(itemType,fields,srcDrawer)}SRCDRAWER.previewOrItemTitleOrCodeTpl=previewOrItemTitleOrCodeTpl
function previewAndItemCodeTpl(itemType,fields,srcDrawer){return xhtml`${previewTpl(itemType,fields,srcDrawer)}${itemCodeTpl(itemType,fields,srcDrawer)}`}SRCDRAWER.previewAndItemCodeTpl=previewAndItemCodeTpl
function previewAndItemCodeAndTitleTpl(itemType,fields,srcDrawer){return xhtml`${previewTpl(itemType,fields,srcDrawer)}${itemCodeTpl(itemType,fields,srcDrawer)}<span class="itTi">${fields?ITEM.getSrcSecondName(srcDrawer.reg,fields,itemType.wspMeta):null}</span>`}SRCDRAWER.previewAndItemCodeAndTitleTpl=previewAndItemCodeAndTitleTpl
function detailsTpl(itemType,fields,srcDrawer){if(!fields)return xhtml``
if(fields.itModel==null)return xhtml`<ul class="details">
<li><span class="val srcUri" title="Chemin complet">${ITEM.getItemUriLabel(fields.srcUri,fields)}</span></li>
<li><span class="val itModel">Espace</span></li>
${srcDate(itemType,fields,srcDrawer)}
</ul>`
return xhtml`<ul class="details">
<li><span class="val itTi" title="Titre">${ITEM.getTitle(fields)}</span></li>
<li><span class="val itModel" title="Modèle d\'item">${itemType?itemType.getTitle(fields):undefined}</span></li>
${srcDate(itemType,fields,srcDrawer)}
<li><span class="val srcUri" title="Chemin complet">${ITEM.getItemUriLabel(fields.srcUri,fields)}</span></li>
</ul>`}SRCDRAWER.detailsTpl=detailsTpl
function detailsItemIconPreviewTpl(itemType,fields,srcDrawer){if(!fields)return xhtml``
return xhtml`<ul class="details">
<li><span class="val itTi" title="Titre">${ITEM.getTitle(fields)}</span></li>
<li><span class="val itModel" title="Modèle d\'item"><img class="icon" src="${itemType.getIcon(srcDrawer.config.showStatus?fields:null)}" draggable="false"/>${itemType?itemType.getTitle(fields):undefined}</span></li>
${srcDate(itemType,fields,srcDrawer)}
<li><span class="val srcUri" title="Chemin complet">${ITEM.getItemUriLabel(fields.srcUri,fields)}</span></li>
</ul>${previewTpl(itemType,fields,srcDrawer)}`}SRCDRAWER.detailsItemIconPreviewTpl=detailsItemIconPreviewTpl
function detailsPreviewTpl(itemType,fields,srcDrawer){return xhtml`${detailsTpl(itemType,fields,srcDrawer)}${previewTpl(itemType,fields,srcDrawer)}`}SRCDRAWER.detailsPreviewTpl=detailsPreviewTpl
function srcDate(itemType,fields,srcDrawer){return!fields||!fields.srcDt?null:xhtml`<li><span class="val srcDt" title="Dernière modification">
			${fields?LOCALE.formatDateDigitsToSec.format(new Date(fields.srcDt)):undefined}
			${fields&&fields.srcUser?xhtml`<span> par <c-userref class="inline" i.="${{reg:srcDrawer.reg,nickOrAccount:fields.srcUser}}"/></span>`:undefined}
			</span></li>`}SRCDRAWER.srcDate=srcDate
function typesAllowedTpl(itemType,fields,srcDrawer){const regexp=srcDrawer.sgnPattern
if(!regexp)return null
const datas=itemType.wspMeta.getItemTypesTree((acc,curr)=>{if(regexp.test(curr.getSgn()))acc.push(curr)
return acc})
function draw(data){if(data instanceof ItemType){return xhtml`<li><img src="${data.getIcon()}"/>${data.getTitle()}</li>`}else{return xhtml`<li><h6>${data.label}</h6><ul>${data.children.map(draw)}</ul></li>`}}const title="Types d\'items autorisés"
return xhtml`${srcDrawer.reg.createSkin("src-drawer/itemTypes")}${SRCDRAWER.wedBarActions(itemType,fields,srcDrawer)}<div><h5>${title}</h5><ul>${datas.map(draw)}</ul></div>`}SRCDRAWER.typesAllowedTpl=typesAllowedTpl
REG.reg.registerSkin("src-drawer/itemTypes",1,`\n\t  div {\n\t\t  padding: 2px;\n\t  }\n\n\t  h5, h6 {\n\t\t  font-size: 1em;\n\t\t  margin: 0;\n\t\t  padding: .2em;\n\t  }\n\n\t  h5 {\n\t\t  border-top: 1px solid var(--border-color);\n\t\t  border-bottom: 1px dotted var(--border-color);\n\t\t  font-style: italic;\n\t\t  color: var(--alt1-color);\n\t\t  text-align: center;\n\t  }\n\n\t  ul {\n\t\t  margin: 0;\n\t\t  padding: 0;\n\t  }\n\n\t  ul > li > ul {\n\t\t  padding-inline-start: 1em;\n\t  }\n\n\t  li {\n\t\t  list-style-type: none;\n\t  }\n\n\t  img {\n\t\t  vertical-align: middle;\n\t  }\n\t`)
function wedBarActions(itemType,fields,srcDrawer){if(isEltBoxSelection(srcDrawer)){const bar=srcDrawer.focusBar
if(bar)return xhtml`<c-bar-actions i.="${{actions:bar.actions.filter(a=>a.getId()==="focusItem"||a.getId()==="fastSelect"||a.getId()==="create"),actionContext:bar.actionContext}}"/>`}return null}SRCDRAWER.wedBarActions=wedBarActions
function detailsOrTypesTpl(itemType,fields,srcDrawer){if(!fields||fields.srcUri==null)return typesAllowedTpl(itemType,fields,srcDrawer)
return xhtml`${SRCDRAWER.wedBarActions(itemType,fields,srcDrawer)}${SRCDRAWER.detailsTpl(itemType,fields,srcDrawer)}`}SRCDRAWER.detailsOrTypesTpl=detailsOrTypesTpl
function detailsPreviewOrTypesTpl(itemType,fields,srcDrawer){if(!fields||fields.srcUri==null)return typesAllowedTpl(itemType,fields,srcDrawer)
return xhtml`${SRCDRAWER.wedBarActions(itemType,fields,srcDrawer)}${SRCDRAWER.detailsPreviewTpl(itemType,fields,srcDrawer)}`}SRCDRAWER.detailsPreviewOrTypesTpl=detailsPreviewOrTypesTpl
function spaceTpl(itemType,fields,srcDrawer){return xhtml`<span class="spaceCode"><img class="icon" src="${itemType.wspMeta.getSpaceIcon()}" draggable="false"/><span class="code">${fields?fields.srcUri||"Racine de l\'atelier":""}</span></span>`}SRCDRAWER.spaceTpl=spaceTpl})(SRCDRAWER||(SRCDRAWER={}))

//# sourceMappingURL=srcDrawer.js.map