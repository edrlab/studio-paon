import{Grid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{EFolderState,GridColTreeDef,GridDataHolderJsonTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{BaseAreaView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{JSX,ShadowJsx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{EGridDropPos}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{InfoCurrentItem,InfoHighlighItemSgn,InfoReqCurrentItem,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{Action,ACTION,ActionWrapper}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{ShortDescCopy,SrcAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{CellBuilderSrcIconCodeTitle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcGridColumns.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{EWspChangesEvts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
export class Bookmarks extends BaseAreaView{constructor(){super(...arguments)
this.shortDescs=[]
this.tree=new BkGridDataTree
this.srcDt=-1}get ctxMenuActions(){return{actions:this.actions,actionContext:this,rect:this.grid.getSelRect()}}get emitter(){return this.grid}get me(){return this}async addBkNodes(parent,index,nodes){nodes=nodes===null||nodes===void 0?void 0:nodes.filter(n=>!isBkEntry(n)||!SRC.isNewSrcUri(n.refUri))
if(!nodes||nodes.length===0)return
const tmpSet=new Set
let countRows=0
const buildMap=function(node){if(isBkEntry(node)){countRows++
tmpSet.add(node.refUri)}else if(isBkFolder(node)){countRows++
node.ch.forEach(buildMap)}}
nodes.forEach(buildMap)
if(tmpSet.size>0){const refs=await WSP.fetchShortDescs(this.wsp,this,...tmpSet.keys())
let i=0
for(const srcRef of tmpSet)this.srcMap.set(srcRef,refs[i++])}const offset=this.tree.getOffsetInChildren(parent,parent?this.tree.getRowKeyChildren(parent):this.tree.getDatas(),index)
this.tree.updateDatasInTree(parent,index,0,GridDataHolderJsonTree.defaultOpened,...nodes.map(cloneBkNode))
await this._saveBookmarks()
this.grid.setSelectedRows([offset,-countRows-offset+1])}async deleteBkNodes(nodes){const offset=this.grid.getActiveRow()
for(const entry of nodes)this.tree.deleteRowKey(entry)
this._gcSrcMaps()
await this._saveBookmarks()
if(offset>=0)this.grid.setSelectedRows(Math.min(offset,this.tree.countRows()-1))}async ensureRowVisible(srcUri){const rowKey=this.tree.findFirstRowKeyBySrcUri(srcUri)
if(rowKey)this.grid.ensureRowVisible(this.tree.getOffset(rowKey))
return rowKey!=null}_initialize(init){super._initialize(init)
this.wsp=this.reg.env.wsp
this.infoBroker=init.itemHandlingReact
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
const colDefs=[init.primaryCol||new GridColTreeDef("srcTree").setSortable(false).setFlex("1rem",1,1).setMinWidth("55px").setSortable(true).setRowDropMgr(rowDropMgr).setCellBuilder(new CellBuilderBk(this))]
if(init.secondaryCols)colDefs.push(...init.secondaryCols)
this.grid=sr.appendChild((new Grid).initialize({selType:"multi",columnDefs:colDefs,dataHolder:this.tree,hideHeaders:true,autoSelOnFocus:"first",lineDrawer:this.infoBroker?this:null,skinOver:"wsp-bookmarks/grid",skinScroll:"scroll/small",emptyBody:()=>{if(this.lastError===undefined){return JSX.createElement("c-msg",{label:"Chargement...",level:"info"})}else if(this.lastError===null){return JSX.createElement("c-msg",{label:"Aucun favori",level:"info"})}else{return JSX.createElement("c-msg",{label:"Accès au serveur impossible",level:"error"})}},defaultAction:init.defaultAction,defaultActionCtx:this}))
this.grid.addEventListener("grid-select",(function(ev){const bk=DOMSH.findHost(this)
const sel=this.dataHolder.getSelectedDatas()
const set=new Set
for(const node of sel){if(isBkEntry(node)){const src=bk.srcMap.get(node.refUri)
if(src)set.add(src)}}bk.shortDescs=Array.from(set)
if(this.matches(":focus"))this.dispatchEvent(new CustomEvent("c-focus-actions",{detail:bk,bubbles:true,composed:true}))}))
this.grid.addEventListener("focus",(function(ev){this.dispatchEvent(new CustomEvent("c-focus-actions",{detail:DOMSH.findHost(this),bubbles:true,composed:true}))}))
this.grid.linesNode.setAttribute("draggable","true")
this.grid.linesNode.addEventListener("dragstart",(function(ev){const bk=DOMSH.findHost(DOMSH.findHost(this))
const sel=bk.tree.getSelectedDatas()
for(let i=0,s=sel.length-1;i<s;i++){const ref=sel[i]
for(let k=i+1;k<sel.length;k++){if(bk.tree.isRowKeyAncestor(ref,sel[k])||bk.tree.isRowKeyAncestor(sel[k],ref)){POPUP.showNotifInfo("Il est impossible de dupliquer ou déplacer une sélection contenant des éléments imbriqués.",this)
ev.preventDefault()
return}}}bk._dragging=true
ITEM.setShortDescTransferToDragSession(bk,ev,"build")}))
this.grid.linesNode.addEventListener("dragend",(function(ev){const bk=DOMSH.findHost(DOMSH.findHost(this))
bk._dragging=false
ITEM.resetShortDescTransferToDragSession()}))
if(init.accelKeyMgr){this.accelKeyMgr=init.accelKeyMgr
this.grid.addEventListener("keydown",ev=>{this.accelKeyMgr.handleKeyboardEvent(ev,this)})}let actions=init.actions
if(!actions&&this.hasAttribute("actions"))actions=this.reg.mergeLists(...BASIS.extractAttr(this,"actions").split(" "))
if(actions){actions=this.overrideActions(actions)
this.actions=actions
this.focusActionables=ActionBtn.buildButtons(actions,this,"bar")}}overrideActions(actions){let idx=actions.findIndex(a=>a.getId()==="delSrc")
if(idx>=0)actions[idx]=(new ActionWrapper).setOverridenSvc(actions[idx]).setLabel("Supprimer de l\'atelier")
idx=actions.findIndex(a=>a.getId()==="renameSrc")
if(idx>=0)actions[idx]=(new ActionWrapper).setOverridenSvc(actions[idx]).setLabel("Renommer dans l\'atelier")
return ACTION.injectSepByGroup(actions,this.reg.getPref("groupOrder.wsp.shortDesc",""),this)}async _fetchBookmarks(){try{if(!this.wsp.isAvailable)await this.wsp.waitForAvailable(this)
const resp=await this.wsp.wspServer.config.privateFolderUrl.fetch(IO.qs("cdaction","GetSrc","format","stream","fields","srcDt","param",this.wsp.code,"refUri","","privateUri","/~bookmark.js"),"json")
if(resp.status===200){this.srcDt=JSON.parse(resp.headers.get("X-SCFIELDS")).srcDt
const bkRoot=resp.asJson
const srcRefMap=new Map
const buildMap=function(node){if(isBkEntry(node)){srcRefMap.set(node.refUri,null)}else if(isBkFolder(node)){node.ch.forEach(buildMap)}}
bkRoot.ch.forEach(buildMap)
if(srcRefMap.size>0){const refs=await WSP.fetchShortDescs(this.wsp,this,...srcRefMap.keys())
let i=0
for(const srcRef of srcRefMap.keys())srcRefMap.set(srcRef,refs[i++])}const normalizeRef=function(node){if(isBkEntry(node)){const srcRefIdent=srcRefMap.get(node.refUri)
if(srcRefIdent){const srcRef=SRC.srcRef(srcRefIdent)
if(node.refUri!==srcRef){srcRefMap.set(srcRef,srcRefMap.get(node.refUri))
node.refUri=srcRef}}}else if(isBkFolder(node)){node.ch.forEach(normalizeRef)}}
bkRoot.ch.forEach(normalizeRef)
this.srcMap=srcRefMap
this.lastError=null
this.tree.setDatas(bkRoot.ch)
if(this.infoBroker){const req=new InfoReqCurrentItem
this.infoBroker.dispatchInfo(req,this)
if(req.srcUri)this._setCurrentItem(req.srcUri)}}else{this.srcMap=new Map
this.srcDt=-1
this.lastError=resp.status===404?null:1
this.tree.setDatas([])}}catch(e){ERROR.log(e)
this.srcDt=-1
this.lastError=1
this.tree.setDatas([])}}async _saveBookmarks(){try{const fields=await this.wsp.wspServer.config.privateFolderUrl.fetchJson(IO.qs("cdaction","PutSrc","format","JSON","fields","srcDt","param",this.wsp.code,"refUri","","privateUri","/~bookmark.js"),{method:"POST",body:JSON.stringify({bookmarkVersion:"1.0",ch:this.tree.getDatas().map(exportBkNode)}),headers:{"Content-Type":"application/json"}})
this.srcDt=fields.srcDt
this.reg.env.universe.wsFrames.ws.postMsg({svc:"liaise",type:"bookmarks.saved"})}catch(e){ERROR.report("Les modifications de vos favoris n\'ont pas pu être enregistrées.",e)
this._fetchBookmarks()}}_gcSrcMaps(){if(!this.srcMap)return
const set=new Set(this.srcMap.keys())
const clearSet=function(node){if(isBkEntry(node)){set.delete(node.refUri)}else if(isBkFolder(node)){node.ch.forEach(clearSet)}}
this.tree.getDatas().forEach(clearSet)
for(const srcRef of set)this.srcMap.delete(srcRef)}_setCurrentItem(srcUri){this._currentSrcUri=srcUri
this.grid.invalidateRows()
if(this._currentSrcUri)this.ensureRowVisible(this._currentSrcUri)}redrawLine(row,line){if(!isBkEntry(row.rowDatas))return
const shortDesc=this.srcMap.get(row.rowDatas.refUri)
line.classList.toggle("current",(shortDesc===null||shortDesc===void 0?void 0:shortDesc.srcUri)===this._currentSrcUri)
if(this._highlightSgn){if(this._assigned&&(this._assigned===(shortDesc===null||shortDesc===void 0?void 0:shortDesc.srcId)||this._assigned===(shortDesc===null||shortDesc===void 0?void 0:shortDesc.srcUri))){line.classList.toggle("assigned",true)
line.classList.toggle("highlight",false)}else{const sgn=shortDesc===null||shortDesc===void 0?void 0:shortDesc.itSgn
line.classList.toggle("highlight",sgn?this._highlightSgn.test(sgn):false)
line.classList.toggle("assigned",false)}}else{line.classList.toggle("highlight",false)
line.classList.toggle("assigned",false)}}buildLastDatas(parentLastDatas){}onInfo(info){if(info instanceof InfoCurrentItem){if(this.hidden)return
this._setCurrentItem(info.srcUri)}else if(info instanceof InfoHighlighItemSgn){this._highlightSgn=info.sgnPattern
this._assigned=info.assigned
if(this.hidden)return
this.grid.invalidateRows()}}onViewHidden(closed){if(this.infoBroker)this.infoBroker.removeConsumer(this)
if(closed){this.reg.env.universe.wsFrames.ws.msgListeners.removeListener("liaise",this._onLiaiseMsg)
this.reg.env.place.eventsMgr.removeListener("onConnectionRenewed",this._onConnRenewed)
this.reg.env.place.eventsMgr.removeListener("wspUriChange",this._onWspUriChange)}}onViewShown(){if(!this._onLiaiseMsg){this._onLiaiseMsg=this.onLiaiseMsg.bind(this)
this.reg.env.universe.wsFrames.ws.msgListeners.on("liaise",this._onLiaiseMsg)
this._onConnRenewed=this.onConnRenewed.bind(this)
this.reg.env.place.eventsMgr.on("onConnectionRenewed",this._onConnRenewed)
this._onWspUriChange=this.onWspUriChange.bind(this)
this.reg.env.place.eventsMgr.on("wspUriChange",this._onWspUriChange)}if(this.infoBroker)this.infoBroker.addConsumer(this)
if(this.srcMap==null)this._fetchBookmarks()
else if(this.infoBroker){const req=new InfoReqCurrentItem
this.infoBroker.dispatchInfo(req,this)
this._setCurrentItem(req.srcUri)}}onSyncLost(){if(this.hidden){if(this.srcMap){this.tree.setDatas([])
this.srcMap=null}}else{this._fetchBookmarks()}}onWspUriChange(msg,from){if(!this.srcMap)return
if(msg.type===EWspChangesEvts.u||msg.type===EWspChangesEvts.r){if(this.srcMap.has(SRC.srcRef(msg))){this.wsp.fetchShortDesc(SRC.srcRef(msg)).then(sd=>{const shortDesc=this.srcMap.get(SRC.srcRef(sd))
if(shortDesc){for(const k in shortDesc)shortDesc[k]=undefined
Object.assign(shortDesc,sd)
this.grid.invalidateRows()}})}}else if(msg.type===EWspChangesEvts.s){const shortDesc=this.srcMap.get(SRC.srcRef(msg))
if(shortDesc){shortDesc["itSt"]=msg.itSt
this.grid.invalidateRows()}}}onLiaiseMsg(m){if(m.type==="bookmarks.saved")this.onSyncLost()}async onConnRenewed(){const resp=await this.wsp.wspServer.config.privateFolderUrl.fetch(IO.qs("cdaction","GetSrc","format","JSON","fields","srcDt","param",this.wsp.code,"refUri","","privateUri","/~bookmark.js"),"json")
if(resp.status===200?this.srcDt!==resp.asJson.srcDt:resp.status===404&&this.srcDt!==-1)this.onSyncLost()}}function exportBkNode(node){if(isBkEntry(node)){return{refUri:node.refUri}}else{const r={label:node.label}
if(node.ch)r.ch=node.ch.map(exportBkNode)
return r}}REG.reg.registerSkin("wsp-bookmarks",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t[hidden] {\n\t\tdisplay: none !important;\n\t}\n\n\tc-grid {\n\t\tflex: 1;\n\t\tborder: none;\n\t}\n`)
REG.reg.registerSkin("wsp-bookmarks/grid",1,`\n\t.highlight {\n\t\tbackground-color: var(--row-highlight-bgcolor);\n\t}\n\n\t.assigned {\n\t\tbackground-color: var(--row-assigned-bgcolor);\n\t}\n\n\t.current {\n\t\tbackground-position: right;\n\t\tbackground-repeat: no-repeat;\n\t\tbackground-image: var(--row-current-img-end);\n\t\tbackground-color: var(--row-current-bgcolor);\n\t}\n`)
customElements.define("wsp-bookmarks",Bookmarks)
function isBkFolder(d){return d&&"label"in d}function isBkEntry(d){return d&&"refUri"in d}function cloneBkNode(node){if(isBkEntry(node))return{refUri:node.refUri}
else if(isBkFolder(node))return{label:node.label,ch:node.ch.map(cloneBkNode)}
return null}class BkGridDataTree extends GridDataHolderJsonTree{constructor(){super("ch")
this.setOpenAll(true)}findFirstRowKeyBySrcUri(srcUri){let result
const match=function(data){if(data.refUri===srcUri){result=data}else if(data.ch){data.ch.find(match)}return result!=null}
this.getDatas().find(match)
return result}}export class CellBuilderBk extends CellBuilderSrcIconCodeTitle{constructor(bk){super(bk.reg,bk.wsp.wspMetaUi,false,bk.wsp.srcUriItemsSortFn)
this.bk=bk}redrawCell(row,root){super.redrawCell(row,root)
root._srcFields=row.cacheHolder.shortDesc}_getValue(row){return row.cacheHolder.code||this._buildCache(row).code}_getIcon(row){return this._buildCache(row).icon}_getTitle(row){const sd=row.cacheHolder.shortDesc
return sd?sd.itTi||"":""}_buildCache(row){const cache=row.cacheHolder
if(isBkEntry(row.rowDatas)){const shortDesc=this.bk.srcMap.get(row.rowDatas.refUri)
if(shortDesc){cache.code=this.srcRdr.getMainName(shortDesc,this.wspMetaUi)
cache.icon=this.srcRdr.getIcon(shortDesc,this.wspMetaUi)
cache.shortDesc=shortDesc
return cache}}else if(isBkFolder(row.rowDatas)){cache.code=row.rowDatas.label
cache.icon=row.getFolderState()===EFolderState.opened?"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/bookmarks/folder-open.svg":"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/bookmarks/folder.svg"
cache.shortDesc=null
return cache}cache.code=" "
cache.icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/itemType/icons/itemNotFound/icovalid.png"
cache.shortDesc=null
return cache}}function onKeypressPrompt(ev){if(ev.key==="Enter"){POPUP.findPopupableParent(ev.target).close(ev.currentTarget.shadowRoot.querySelector("input").value)
ev.preventDefault()
ev.stopImmediatePropagation()}}function onClickPromptDone(){POPUP.findPopupableParent(this).close(DOMSH.findDocumentOrShadowRoot(this).querySelector("input").value)
POPUP.findPopupableParent(this).close(DOMSH.findDocumentOrShadowRoot(this).querySelector("input").value)}function onClickPromptCancel(){POPUP.findPopupableParent(this).close(null)}export class BkCreateFolder extends Action{constructor(){super(...arguments)
this._id="createFolder"
this._label="Nouveau dossier..."
this._group="localEdit"}async execute(ctx,ev){const r=await POPUP.showDialog(JSX.createElement("c-box",{skin:"wsp-bookmarks/promptFolder",skinOver:"webzone:panel form-control-areas",onkeypress:onKeypressPrompt},JSX.createElement(ShadowJsx,null,JSX.createElement("label",null,JSX.createElement("div",null,"Nom du dossier"),JSX.createElement("input",null)),JSX.createElement("footer",null,JSX.createElement("c-button",{label:"Créer",class:"default","ui-context":"dialog",onclick:onClickPromptDone}),JSX.createElement("c-button",{label:"Annuler","ui-context":"dialog",onclick:onClickPromptCancel})))),ctx.me,{titleBar:{barLabel:{label:"Nouveau dossier des favoris"}},resizer:{}}).onNextClose()
if(r){const tree=ctx.me.tree
const newNodes=[{label:r,ch:[]}]
const d=tree.getDataByOffset(ctx.me.grid.getActiveRow())
if(!d){ctx.me.addBkNodes(null,tree.getDatas().length,newNodes)}else{ctx.me.addBkNodes(tree.getRowKeyParent(d),tree.getRowKeyIndex(d),newNodes)}}}}export class BkRenameFolder extends Action{constructor(){super(...arguments)
this._id="renameFolder"
this._label="Renommer..."
this._group="localEdit"}isEnabled(ctx){if(ctx.me.grid.countSelectedRows()!=1)return false
return super.isEnabled(ctx)}isVisible(ctx){if(!super.isVisible(ctx))return false
return isBkFolder(ctx.me.tree.getDataByOffset(ctx.me.grid.getActiveRow()))}async execute(ctx,ev){const d=ctx.me.tree.getDataByOffset(ctx.me.grid.getActiveRow())
if(!isBkFolder(d))return
const r=await POPUP.showDialog(JSX.createElement("c-box",{skin:"wsp-bookmarks/promptFolder",skinOver:"webzone:panel form-control-areas",onkeypress:onKeypressPrompt},JSX.createElement(ShadowJsx,null,JSX.createElement("label",null,JSX.createElement("div",null,"Nom du dossier"),JSX.createElement("input",{value:d.label})),JSX.createElement("footer",null,JSX.createElement("c-button",{label:"Renommer",class:"default","ui-context":"dialog",onclick:onClickPromptDone}),JSX.createElement("c-button",{label:"Annuler","ui-context":"dialog",onclick:onClickPromptCancel})))),ctx.me,{titleBar:{barLabel:{label:"Renommer le dossier des favoris"}},resizer:{}}).onNextClose()
if(r){d.label=r
ctx.me.grid.invalidateRows()
return ctx.me._saveBookmarks()}}}REG.reg.registerSkin("wsp-bookmarks/promptFolder",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t}\n\n\t:focus-visible {\n\t\toutline: var(--focus-outline);\n\t}\n\n\tlabel {\n\t\tflex: 1;\n\t\tmargin: 1em;\n\t\tpadding: .5em;\n\t}\n\n\tinput {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmargin: .5em;\n\t\twidth: 100%;\n\t\tfont-size: inherit;\n\t}\n\n\tfooter {\n\t\tdisplay: flex;\n\t\tjustify-content: flex-end;\n\t\tborder-top: 1px solid var(--border-color);\n\t}\n`)
export class BkDel extends SrcAction{constructor(){super(...arguments)
this._id="del"
this._label="Éliminer des favoris"
this._group="localEdit"
this.isNotRemoved=false}isEnabled(ctx){if(ctx.me.grid.countSelectedRows()===0)return false
return super.isEnabled(ctx)}execute(ctx,ev){ctx.me.deleteBkNodes(ctx.me.tree.getSelectedDatas())}}export class BkCopy extends ShortDescCopy{constructor(){super()
this.atLeastOne=false
this.isNotRemoved=false}isEnabled(ctx){if(ctx.me.grid.countSelectedRows()===0)return false
return super.isEnabled(ctx)}execute(ctx,ev){return ITEM.setShortDescTransferToClipboard(ctx,{bookmarks:ctx.me.tree.getSelectedDatas().map(cloneBkNode)})}}export class BkCut extends SrcAction{constructor(){super(...arguments)
this._id="cut"
this._label="Couper"
this._group="clipboard"
this.isNotRemoved=false}isEnabled(ctx){if(ctx.me.grid.countSelectedRows()===0)return false
return super.isEnabled(ctx)}execute(ctx,ev){const sel=ctx.me.tree.getSelectedDatas()
ctx.me.deleteBkNodes(sel)
ITEM.setShortDescTransferToClipboard(ctx,{bookmarks:sel.map(cloneBkNode)})}}export class BkPasteBefore extends SrcAction{constructor(){super(...arguments)
this._id="pasteBefore"
this._label="Coller avant"
this._group="clipboard"
this.isNotRemoved=false}isVisible(ctx){if(ctx.me.grid.countSelectedRows()!==1)return false
if(!isBkFolder(ctx.me.tree.getDataByOffset(ctx.me.grid.getActiveRow())))return false
return super.isVisible(ctx)}isVisibleSuper(ctx){return super.isVisible(ctx)}isEnabled(ctx){return true}buildCustomButton(ctx,uiContext,parent){return uiContext==="bar"?null:undefined}async initButtonNode(buttonNode,ctx){if(buttonNode instanceof ActionBtn){if(!BkPasteBefore.pendingBtns)BkPasteBefore.pendingBtns=[buttonNode]
else BkPasteBefore.pendingBtns.push(buttonNode)
if(!BkPasteBefore.pending){BkPasteBefore.pending=ITEM.getShortDescsTransferFromClipboard(ctx.reg.env.wsp,ctx.emitter)
try{const srcs=await BkPasteBefore.pending
if(srcs===false){POPUP.showNotifWarning("L\'accès au presse-papier n\'est pas autorisé par votre navigateur. Modifiez les paramètres du site pour rendre opérationnelles les fonctions de copier/coller.",buttonNode)}else if(BkPasteBefore.pendingBtns)for(const btn of BkPasteBefore.pendingBtns){btn.action.updateButton(btn,srcs)}}finally{BkPasteBefore.pendingBtns=null
BkPasteBefore.pending=null}}}}updateButton(btn,transfer){if(transfer&&!Array.isArray(transfer)){if(transfer.bookmarks&&transfer.bookmarks.length>0)return
if(transfer.srcRefs&&transfer.srcRefs.length>0)return}btn.disabled=true}async execute(ctx,ev){const transfer=await ITEM.getShortDescsTransferFromClipboard(ctx.reg.env.wsp,ctx.emitter)
if(!transfer||Array.isArray(transfer))return
const tree=ctx.me.tree
const from=tree.getDataByOffset(ctx.me.grid.getActiveRow())
const parent=tree.getRowKeyParent(from)
const index=tree.getRowKeyIndex(from)
if(transfer.bookmarks){return ctx.me.addBkNodes(parent,index,transfer.bookmarks)}else if(transfer.srcRefs){return ctx.me.addBkNodes(parent,index,transfer.srcRefs.map(srcRef=>({refUri:srcRef})))}}}export class BkPasteInOrBefore extends BkPasteBefore{constructor(){super(...arguments)
this._id="pasteIn"
this._label="Coller dans"}getLabel(ctx){const offset=ctx.me.grid.getActiveRow()
if(offset===-1)return"Coller"
return isBkFolder(ctx.me.tree.getDataByOffset(offset))?"Coller dans":"Coller avant"}isVisible(ctx){const count=ctx.me.grid.countSelectedRows()
if(count===0)return true
if(count!==1)return false
return super.isVisibleSuper(ctx)}async execute(ctx,ev){const transfer=await ITEM.getShortDescsTransferFromClipboard(ctx.reg.env.wsp,ctx.emitter)
if(!transfer||Array.isArray(transfer))return
const tree=ctx.me.tree
const from=tree.getDataByOffset(ctx.me.grid.getActiveRow())
let parent=from
let index
if(!from||isBkFolder(from)){index=(from?tree.getRowKeyChildren(from):tree.getDatas()).length}else{parent=tree.getRowKeyParent(from)
index=tree.getRowKeyIndex(from)}if(transfer.bookmarks){return ctx.me.addBkNodes(parent,index,transfer.bookmarks)}else if(transfer.srcRefs){return ctx.me.addBkNodes(parent,index,transfer.srcRefs.map(srcRef=>({refUri:srcRef})))}}}export class BkPasteAfter extends BkPasteBefore{constructor(){super(...arguments)
this._id="pasteAfter"
this._label="Coller après"}isVisible(ctx){if(ctx.me.grid.countSelectedRows()!==1)return false
return super.isVisibleSuper(ctx)}async execute(ctx,ev){const transfer=await ITEM.getShortDescsTransferFromClipboard(ctx.reg.env.wsp,ctx.emitter)
if(!transfer||Array.isArray(transfer))return
const tree=ctx.me.tree
const from=tree.getDataByOffset(ctx.me.grid.getActiveRow())
const parent=tree.getRowKeyParent(from)
const index=tree.getRowKeyIndex(from)+1
if(transfer.bookmarks){return ctx.me.addBkNodes(parent,index,transfer.bookmarks)}else if(transfer.srcRefs){return ctx.me.addBkNodes(parent,index,transfer.srcRefs.map(srcRef=>({refUri:srcRef})))}}}const rowDropMgr={onDragOverRow(ev,grid,row,line){ev.dataTransfer.dropEffect="none"
const bk=DOMSH.findHost(grid)
const tree=bk.tree
if(bk._dragging){let pos=!row?EGridDropPos.after:EGridDropPos.before|EGridDropPos.after
if(!ev.shiftKey){if(row){const offset=tree.getOffset(row.rowKey)
if(grid.isRowSelected(offset))return EGridDropPos.none
const sel=bk.tree.getSelectedDatas()
if(sel.find(node=>bk.tree.isRowKeyAncestor(node,row.rowKey)))return EGridDropPos.none
if(isBkFolder(row.rowDatas)&&sel.find(d=>tree.getRowKeyParent(d)===row.rowKey))return EGridDropPos.none
const parent=tree.getRowKeyParent(row.rowKey)
if(offset>0&&grid.isRowSelected(offset-1)){if(tree.getRowKeyParent(tree.getRowKey(offset-1))===parent)pos&=~EGridDropPos.before}if(grid.isRowSelected(offset+1)){if(tree.getRowKeyParent(tree.getRowKey(offset+1))===parent)pos&=~EGridDropPos.after}if(pos===EGridDropPos.none)return pos}else{const last=tree.countRows()-1
if(tree.getRowKeyParent(tree.getRowKey(last))==null&&grid.isRowSelected(last))return EGridDropPos.none}}ev.dataTransfer.dropEffect=ev.shiftKey?"copy":"move"
return row&&isBkFolder(row.rowDatas)?pos|EGridDropPos.over:pos}else{const transfer=ITEM.getShortDescsTransferFromDragSession(bk.reg,ev.dataTransfer,{targetSrcType:"itemOrSpace"},grid)
if(transfer&&transfer.wspCd===bk.wsp.code&&transfer.srcRefs&&transfer.srcRefs.length>0){ev.dataTransfer.dropEffect="copy"
if(!row)return EGridDropPos.after
if(isBkFolder(row.rowDatas))return EGridDropPos.before|EGridDropPos.after|EGridDropPos.over
return EGridDropPos.before|EGridDropPos.after}}return EGridDropPos.none},dropOnRow(ev,grid,row,line,pos){const bk=DOMSH.findHost(grid)
if(bk._dragging){const sel=bk.tree.getSelectedDatas()
if(!ev.shiftKey){for(const entry of sel)bk.tree.deleteRowKey(entry)}const nodes=sel.map(cloneBkNode)
if(!row){bk.addBkNodes(null,bk.tree.getDatas().length,nodes)}else if(pos===EGridDropPos.over){bk.addBkNodes(row.rowDatas,bk.tree.getRowKeyChildren(row.rowKey).length,nodes)}else if(pos===EGridDropPos.before){bk.addBkNodes(bk.tree.getRowKeyParent(row.rowKey),bk.tree.getRowKeyIndex(row.rowKey),nodes)}else{bk.addBkNodes(bk.tree.getRowKeyParent(row.rowKey),bk.tree.getRowKeyIndex(row.rowKey)+1,nodes)}}else{const transfer=ITEM.getShortDescsTransferFromDragSession(bk.reg,ev.dataTransfer,{targetSrcType:"itemOrSpace"},grid)
if(transfer&&transfer.wspCd===bk.wsp.code&&transfer.srcRefs&&transfer.srcRefs.length>0){const nodes=transfer.srcRefs.map(srcRef=>({refUri:srcRef}))
if(!row){bk.addBkNodes(null,bk.tree.getDatas().length,nodes)}else if(pos===EGridDropPos.over){bk.addBkNodes(row.rowDatas,bk.tree.getRowKeyChildren(row.rowKey).length,nodes)}else if(pos===EGridDropPos.before){bk.addBkNodes(bk.tree.getRowKeyParent(row.rowKey),bk.tree.getRowKeyIndex(row.rowKey),nodes)}else{bk.addBkNodes(bk.tree.getRowKeyParent(row.rowKey),bk.tree.getRowKeyIndex(row.rowKey)+1,nodes)}}}}}
function addBookmarkAction(action,accel){REG.reg.addToList("actions:wspApp:bookmarks",action.getId(),1,action)
if(accel)REG.reg.addToList("accelkeys:wspApp:bookmarks",accel,1,action)}addBookmarkAction(new BkCreateFolder,"n-accel")
addBookmarkAction(new BkRenameFolder,"F2")
addBookmarkAction(new BkCopy,"c-accel")
addBookmarkAction(new BkCut,"x-accel")
addBookmarkAction(new BkPasteBefore)
addBookmarkAction(new BkPasteInOrBefore,"v-accel")
addBookmarkAction(new BkPasteAfter)
addBookmarkAction(new BkDel,"Delete")

//# sourceMappingURL=bookmarks.js.map