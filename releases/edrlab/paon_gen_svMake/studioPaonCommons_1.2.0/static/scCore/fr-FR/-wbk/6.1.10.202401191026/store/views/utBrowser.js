import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{EFolderState,GridColTreeDef,GridDataHolderJsonTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{EGridDropPos}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{Grid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{isNodeAutoFold,URLTREE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/urlTree.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{InfoCurrentRes,InfoReqCurrentRes,RES}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/res.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{CellBuilderResIconName,redrawResLine}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/widgets/resGridColumns.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{BaseElementAsync,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{EventMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{isRespError}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{AddByImport}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/actions/resActions.js"
import{getFilesOnDrop}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/files.js"
export class UtBrowser extends BaseElementAsync{constructor(){super(...arguments)
this._currentPath=null}get currentDatas(){var _a
return(_a=this.grid)===null||_a===void 0?void 0:_a.dataHolder}async _initialize(init){this.reg=init.reg
if(init.autoCloseReg)this.autoCloseReg=true
this.pathRoot=init.pathRoot||URLTREE.DEFAULT_PATH_ROOT
this.infoBroker=init.infoBroker
this.resHandling=init.resHandlingReact
this.emptyTree=init.emptyTree
this.onSelChange=new EventMgr
if(init.onSelChange)this.onSelChange.add(init.onSelChange)
this.datasFull=new UtBrowserDataFull(init.fetcher||new UtBrowserFetcher(this.reg.env.universe.adminUrlTree).setFilter(this.reg.getPref("utBrowser.filter")),this.reg,this.pathRoot,init.nodeFilter)
this.datasFull.callbackFetching=this
this.resHandlingBySel=init.resHandlingMode==="sel"
const sr=this._attach(this.localName,init)
this.grid=new Grid
this.actContext={emitter:this.grid,utBrowser:this,infoBroker:this.infoBroker,resList:[],reg:null}
this._refreshActContext()
const colDefs=[init.primaryCol||new GridColTreeDef("resTree").setFlex("1rem",1,1).setMinWidth("55px").setRowDropMgr(rowDropMgr).setOnDblClick(init.defaultAction?"none":"toggle").setCellBuilder(new CellBuilderUtBrowser(this.reg))]
if(init.secondaryCols)colDefs.push(...init.secondaryCols)
const gridInit={selType:init.resHandlingMode==="sel"?"monoClick":"multi",columnDefs:colDefs,dataHolder:this.datasFull,hideHeaders:true,lineDrawer:this,skinOver:"store-ut-browser/grid",skinScroll:"scroll/small",noResizableCol:true,emptyBody:()=>{const datas=this.currentDatas
if((datas===null||datas===void 0?void 0:datas.lastError)===undefined){return JSX.createElement("c-msg",{label:"Chargement...",level:"info"})}else if(datas.lastError===null){if(this.modeSearch)return JSX.createElement("c-msg",{label:"Aucun contenu ne correspond à votre filtre",level:"info"})
return this.emptyTree?this.emptyTree(this):JSX.createElement("c-msg",{label:"Aucun contenu",level:"info"})}else if(isRespError(datas.lastError)&&datas.lastError.response.status===403){return JSX.createElement("c-msg",{label:"Accès non autorisé",level:"error"})}else{return JSX.createElement("c-msg",{label:"Accès au serveur impossible",level:"error"})}},defaultAction:init.defaultAction,defaultActionCtx:this.actContext,defaultActionOn:init.resHandlingMode==="sel"?"userSelChange":undefined}
if(init.grid)Object.assign(gridInit,init.grid)
sr.appendChild(this.grid.initialize(gridInit))
this.grid.addEventListener("grid-select",(function(ev){const utBrowser=DOMSH.findHost(this)
const sel=utBrowser.currentDatas.getSelectedDatas()
const resList=utBrowser.actContext.resList
resList.length=0
for(let r of sel)if(!isNodeAutoFold(r))resList.push(r)
utBrowser._refreshActContext()
utBrowser.onSelChange.emit(utBrowser,resList)
if(this.matches(":focus"))this.dispatchEvent(new CustomEvent("c-focus-actions",{detail:utBrowser,bubbles:true,composed:true}))}))
this.grid.addEventListener("focus",(function(ev){this.dispatchEvent(new CustomEvent("c-focus-actions",{detail:DOMSH.findHost(this),bubbles:true,composed:true}))}))
this.grid.linesNode.setAttribute("draggable","true")
this.grid.linesNode.addEventListener("dragstart",(function(ev){const me=DOMSH.findHost(DOMSH.findHost(this))
if(me.actContext.resList.length>0){const resTypes=me.reg.env.resTypes
const root=me.reg.env.universe.urlTree.url.url
const paths=me.actContext.resList.map(n=>URLTREE.concatUrl(root,resTypes.getResTypeFor(n).livePath(n.permaPath)))
ev.dataTransfer.effectAllowed="all"
const data=paths.join("\r\n")
ev.dataTransfer.setData("text/plain",data)
ev.dataTransfer.setData("text/uri-list",paths[0])
ev.dataTransfer.setData("text/x-uri-list",data)
const img=new Image
img.src=me.reg.env.universe.config.skinUrl.resolve("store/objects/res/default.svg").url
ev.dataTransfer.setDragImage(img,12,12)}}))
this._initBarUi(init)
if(init.accelKeyMgr){this.accelKeyMgr=init.accelKeyMgr
this.grid.addEventListener("keydown",ev=>{this.accelKeyMgr.handleKeyboardEvent(ev,this.actContext)})}let actions=init.actions
if(!actions&&this.hasAttribute("actions"))actions=this.reg.mergeLists(...BASIS.extractAttr(this,"actions").split(" "))
if(actions){actions=ACTION.injectSepByGroup(actions,this.reg.getPref("groupOrder.store.res",""),this.actContext)
this.actions=actions
this.focusActionables=ActionBtn.buildButtons(actions,this.actContext,"bar")}return this.datasFull.initDataFull().then(()=>{if(this.resHandling){const req=new InfoReqCurrentRes
this.resHandling.dispatchInfo(req,this)
this.setCurrentRes(req.resPath)
this.resHandling.addConsumer(this)}})}_initBarUi(init){if(!init.actionsStart&&init.hideSearch&&!init.actionsEnd)return
const header=this.grid.insertAdjacentElement("beforebegin",JSX.createElement("header",null))
if(init.actionsStart){const ctx=BASIS.newInit(init.actionsStart,this.reg)
ctx.actionContext=this.actContext
const bar=header.appendChild(JSX.createElement(BarActions,{id:"actionsStart","î":ctx}))
this.onSelChange.add(bar.refresh.bind(this))}if(!init.hideSearch)this._initSearchUi(header,init)
if(init.actionsEnd){const ctx=BASIS.newInit(init.actionsEnd,this.reg)
ctx.actionContext=this.actContext
const bar=header.appendChild(JSX.createElement(BarActions,{id:"actionsEnd","î":ctx}))
this.onSelChange.add(bar.refresh.bind(this))}}_initSearchUi(parent,init){this.search=JSX.createElement("input",{type:"search",placeholder:"Filtrer...",spellcheck:"false",onchange:this.onSearchChange,oninput:this.onSearchChange,onkeydown:this.onSearchKeydown})
parent.appendChild(JSX.createElement("div",{id:"search"},this.search))}_refreshActContext(){const resList=this.actContext.resList
const resCurrent=resList.length===1?resList[0]:this.datasFull.getDataByOffset(0)
if(resCurrent){this.actContext.reg=this.reg.env.universe.resTypes.getResTypeFor(resCurrent).newShortResRegFromDepotReg(this.reg,resCurrent)}else{this.actContext.reg=this.reg}}buildSearchReq(){const req=this.datasSearch.request
this.datasSearch.request=`isResRoot&nameMatch((?i^).*${LANG.escape4RegexpFuzzy(this.search.value).replace(/[\^\)]/g,"^$&")}.*)`
return req!==this.datasSearch.request}gotoModeSearch(){if(!this.datasSearch){this.datasSearch=new UtBrowserDataSearch(this.datasFull)}else{this.datasSearch.resetDatas()}this.search.classList.toggle("filtered",true)
this.grid.classList.toggle("filtered",true)
this.grid.dataHolder=this.datasSearch
this.buildSearchReq()
this.datasSearch.fetchSearchStart()}gotoModeFull(){this.search.classList.toggle("filtered",false)
this.grid.classList.toggle("filtered",false)
this.search.value=""
this.grid.dataHolder=this.datasFull}get modeSearch(){return this.grid.dataHolder===this.datasSearch}onSearchChange(ev){const me=DOMSH.findHost(this)
if(me.modeSearch){if(me.search.value.length===0){me.gotoModeFull()
if(me.infoBroker){const currentRes=new InfoReqCurrentRes
me.infoBroker.dispatchInfo(currentRes,me)
if(currentRes.resPath)me.setCurrentRes(currentRes.resPath)}}else{if(me.buildSearchReq())me.datasSearch.fetchSearchStart()}}else{if(me.search.value.length>0)me.gotoModeSearch()}}onSearchKeydown(ev){if(ev.key==="ArrowDown"){const me=DOMSH.findHost(this)
if(me.grid.dataHolder.countRows()>0){me.grid.setSelectedRows(0)
me.grid.focus()
ev.stopImmediatePropagation()
ev.preventDefault()}}}async ensureRowVisible(resPath){var _a
await((_a=this.currentDatas)===null||_a===void 0?void 0:_a.openToTarget(resPath))
const rowKey=this.currentDatas.findRowKeyByResPath(resPath)
if(rowKey)this.grid.ensureRowVisible(this.currentDatas.getOffset(rowKey))
return rowKey!=null}onViewHidden(closed){var _a,_b,_c
if(closed){(_a=this.resHandling)===null||_a===void 0?void 0:_a.removeConsumer(this);(_b=this.datasFull)===null||_b===void 0?void 0:_b.closeData();(_c=this.datasSearch)===null||_c===void 0?void 0:_c.closeData()
if(this.autoCloseReg)this.reg.close()}}get ctxMenuActions(){return{actions:this.actions,actionContext:this.actContext,rect:this.grid.getSelRect()}}onInfo(info){if(info instanceof InfoCurrentRes){this.setCurrentRes(info.resPath)}}selectRes(resPath){const targetPath=resPath
if(resPath!=null){this.currentDatas.openToTarget(targetPath).then(()=>{const node=this.currentDatas.findRowKeyByResPath(targetPath)
if(node){const offset=this.currentDatas.getOffset(node)
this.grid.setSelectedRows(offset)
this.grid.ensureRowVisible(offset)}})}else{this.grid.clearSel()}}setCurrentRes(resPath){if(this.resHandlingBySel){this.selectRes(resPath)}else{this._currentPath=resPath
this.grid.invalidateRows()
if(this._currentPath){this.ensureRowVisible(this._currentPath)}}}redrawLine(row,line){redrawResLine(this.reg,row,line,this._currentPath)}onFetching(state){}}REG.reg.registerSkin("store-ut-browser",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tposition: relative;\n\t}\n\n\theader {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: row;\n\t\talign-items: center;\n\t}\n\n\t#search {\n\t\tflex: 1;\n\t\tbackground: .1em / 1em no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/filter.svg) var(--form-search-bgcolor);\n\t\tpadding: 2px;\n\t\tpadding-inline-start: 1.2em;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\tinput {\n\t\tpadding: 2px;\n\t\tbackground: var(--form-search-bgcolor);\n\t\tcolor: var(--form-color);\n\t\tborder: none;\n\t\twidth: 100%;\n\t\tfont-size: inherit;\n\t}\n\n\t.filtered {\n\t\tbackground: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/filtered.svg) var(--row-bgcolor);\n\t}\n\n\tinput:focus {\n\t\toutline: var(--focus-outline);\n\t}\n\n\tinput::placeholder {\n\t\tcolor: var(--fade-color);\n\t\tletter-spacing: 2px;\n\t\tfont-size: .8em;\n\t\tfont-style: italic;\n\t}\n\n\tinput:focus::placeholder {\n\t\tcolor: transparent;\n\t}\n\n\tc-grid {\n\t\tflex: 1;\n\t\tborder: none;\n\t}\n\n\t#fetchInit, #fetchNext {\n\t\tposition: absolute;\n\t\tz-index: 1;\n\t\tbackground-color: var(--bgcolor);\n\t\tcolor: var(--color);\n\t\talign-self: center;\n\t\tpadding: .5em;\n\t\tborder: 1px solid var(--border-color);\n\t\tborder-radius: 1em;\n\t}\n\n\t#fetchInit {\n\t\ttop: 2em;\n\t}\n\n\t#fetchNext {\n\t\tbottom: 1em;\n\t}\n`)
REG.reg.registerSkin("store-ut-browser/grid",1,`\n\t.current {\n\t\tbackground-position: right;\n\t\tbackground-repeat: no-repeat;\n\t\tbackground-image: var(--row-current-img-end);\n\t\tbackground-color: var(--row-current-bgcolor);\n\t}\n\n\t.unlisted > .cell > span {\n\t\tbackground: no-repeat right / .7em url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/states/limited.svg);\n\t\tpadding-inline-end: 1em;\n\t}\n\n\t.trashed > .cell > span {\n\t\tbackground: no-repeat right / .7em url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/states/invisible.svg);\n\t\tpadding-inline-end: 1em;\n\t}\n\n\t.line {\n\t\tpadding: .1em .3em;\n\t}\n`)
customElements.define("store-ut-browser",UtBrowser)
export class UtBrowserDataBase extends GridDataHolderJsonTree{constructor(fetcher,reg,pathRoot=URLTREE.DEFAULT_PATH_ROOT,jsNodeFilter){super("ch")
this.fetcher=fetcher
this.reg=reg
this.pathRoot=pathRoot
this.jsNodeFilter=jsNodeFilter
this.hasAnyVCB=reg.env.resTypes.hasAnyVCB()
this.setNaturalOrder(CellBuilderUtBrowser.makeSortFn(fetcher))}resetDatas(){this.lastError=undefined
this.setDatas([])}findRowKeyByResPath(resPath,lastAncestor){if(URLTREE.isQueryPath(resPath))return null
if(!URLTREE.isDescendantPathOrEqual(this.pathRoot,resPath))return null
if(resPath===this.pathRoot)return this._datas[0]
let offset=this.pathRoot.length+1
let nextEnd=resPath.indexOf("/",offset)
let children=this.ch(this._datas[0])
if(!children)return
let previous=this._datas[0]
while(nextEnd>0){let parentNm=resPath.substring(offset,nextEnd)
const idxV=parentNm.indexOf("@")
let parentV
if(idxV>=0){parentV=parentNm.substring(idxV+1)
parentNm=parentNm.substring(0,idxV)}let parent
for(let i=0;children&&i<children.length;i++){const ch=children[i]
if(isNodeAutoFold(ch)){if(this.fetcher.naturalSortFn(ch.from,parentNm)<=0&&this.fetcher.naturalSortFn(ch.to,parentNm)>0){previous=ch
children=this.ch(ch)
i=-1}}else if(ch.n===parentNm){parent=ch
break}}if(!parent)return lastAncestor?previous:null
previous=parent
children=this.ch(parent)
if(parent.vcb==="n"){if(!children)return lastAncestor?previous:null
parent=null
for(let i=0;children&&i<children.length;i++){const ch=children[i]
if(!isNodeAutoFold(ch)&&ch.v===parentV){parent=ch
children=this.ch(parent)
break}}if(!parent)return lastAncestor?previous:null
previous=parent}if(!children)return lastAncestor?parent:null
offset=nextEnd+1
nextEnd=resPath.indexOf("/",offset)}let nm=resPath.substring(offset)
const idxV=nm.indexOf("@")
let parentV
if(idxV>=0){parentV=nm.substring(idxV+1)
nm=nm.substring(0,idxV)}for(let i=0;children&&i<children.length;i++){const ch=children[i]
if(isNodeAutoFold(ch)){if(this.fetcher.naturalSortFn(ch.from,nm)<=0&&this.fetcher.naturalSortFn(ch.to,nm)>0){previous=ch
children=this.ch(ch)
i=-1}}else if(ch.n===nm){if(ch.vcb==="n"){children=this.ch(ch)
if(children)for(let i=0;i<children.length;i++){const chV=children[i]
if(!isNodeAutoFold(chV)&&chV.v===parentV)return chV}return lastAncestor?ch:null}return ch}}return lastAncestor?previous:null}async openToTarget(resPath){for(;;){const node=this.findRowKeyByResPath(resPath,true)
if(node)this.forceRowKeyShown(node)
if(node!=null&&(isNodeAutoFold(node)||node.vcb==="n"||node.permaPath!==resPath)){if(!await this.openFolderAsync(node))return}else{return}}}async openToTargets(...resPaths){for(let p of resPaths)await this.openToTarget(p)}async refreshRowKey(rowKey){if(isNodeAutoFold(rowKey))return
const fields=await this.fetcher.fetchNode(rowKey.vcb?rowKey.permaPath:URLTREE.extractUnversionedLeafPath(rowKey.permaPath),false)
if(!this.isRowkeyAlive(rowKey))return
if(fields==null){this.deleteRowKey(rowKey)}else{const newRowKey=Object.assign(Object.create(null),fields)
if(rowKey.vcb)newRowKey.vcb=rowKey.vcb
this.replaceRowKey(rowKey,newRowKey,newRowKey.t!="moved"&&newRowKey.t!="repos")
if(this._grid&&this._grid.isRowSelected(this.getOffset(newRowKey))){this._grid.dispatchEvent(new CustomEvent("grid-select",{bubbles:true,composed:true}))}}}getParentUtNode(data){let p=this.parent(data)
while(isNodeAutoFold(p))p=this.parent(p)
return p}async insertRes(parentRowKey,resPath){while(this.sequentialReq)await this.sequentialReq
try{if(parentRowKey&&!this.isRowkeyAlive(parentRowKey))return
await(this.sequentialReq=this._insertRes(parentRowKey,resPath))}finally{this.sequentialReq=null}}async _insertRes(parentRowKey,resPath){const fields=await this.fetcher.fetchNode(resPath)
if(fields==null||this.jsNodeFilter&&!isNodeAutoFold(fields)&&!this.isResRoot(parentRowKey,fields)&&!this.jsNodeFilter(fields))return
if(parentRowKey&&!this.isRowkeyAlive(parentRowKey)&&this.getRowKeyFolderState(parentRowKey)!==EFolderState.opened)return
if(this.findInChildren(parentRowKey?parentRowKey.ch:this._datas,resPath)>=0)return
this.insertRowKey(parentRowKey,fields)}isResRoot(parent,child){if(child.vcb==="v")return true
while(isNodeAutoFold(parent))parent=this.parent(parent)
return!parent||!child.resId||child.resId!==parent.resId}filterChildren(parent,chidlren){if(this.jsNodeFilter)return chidlren.filter(n=>isNodeAutoFold(n)||this.isResRoot(parent,n)&&this.jsNodeFilter(n))
return chidlren.filter(n=>isNodeAutoFold(n)||this.isResRoot(parent,n))}findInChildren(children,resPath){for(let i=0;i<children.length;i++){const ch=children[i]
if(isNodeAutoFold(ch))return-1
if(ch.permaPath===resPath)return i}return-1}findInChildrenByName(children,name){if(!children)return null
for(let i=0;i<children.length;i++){const ch=children[i]
if(isNodeAutoFold(ch))return null
if(ch.n===name)return ch}return null}_initRowData(data,parent,openIt){var _a,_b
if(isNodeAutoFold(data)){if(data.ch===undefined)data.ch=null}else{if(this.hasAnyVCB){const type=this.reg.env.resTypes.getResTypeFor(data)
if(type.prcIsFolder&&type.prcVersionning==="VCB"){if(((_a=parent)===null||_a===void 0?void 0:_a.vcb)==="n"){data.vcb="v"
data.permaPath=URLTREE.appendToPath(URLTREE.extractParentPath(parent.permaPath)||this.pathRoot,URLTREE.buildPermaName(data))}else{data.vcb="n"}if(data.ch===undefined)data.ch=null}}if(data.permaPath==null)data.permaPath=URLTREE.appendToPath(((_b=isNodeAutoFold(parent)?this.getParentUtNode(parent):parent)===null||_b===void 0?void 0:_b.permaPath)||this.pathRoot,URLTREE.buildPermaName(data))
if(data.t==="noContent"||data.t==="home"){if(data.ch===undefined)data.ch=null}}return super._initRowData(data,parent,openIt)}closeData(){const depotEvents=this.reg.env.depotEvents
if(!depotEvents)return
if(this._resChange){depotEvents.removeListener("resChange",this._resChange)
this._resChange=null}if(this._connOpened){depotEvents.removeListener("connOpened",this._connOpened)
this._connOpened=null}}}export class UtBrowserDataFull extends UtBrowserDataBase{initDataFull(){const depotEvents=this.reg.env.depotEvents
if(depotEvents){this._resChange=m=>{const resPath=m.props.path
const node=this.findRowKeyByResPath(resPath,true)
if(!node)return
if(isNodeAutoFold(node)||node.permaPath===URLTREE.extractParentPath(resPath)){if(this.isRowKeyShown(node)&&this.getRowKeyFolderState(node)===EFolderState.opened){this.insertRes(node,resPath)}else{this.resetAsyncChildren(node)}}else if(node.vcb==="n"){if(this.isRowKeyShown(node)&&this.getRowKeyFolderState(node)===EFolderState.opened){this.closeFolder(node)
this.openFolderAsync(node)}else{this.resetAsyncChildren(node)}}else if(URLTREE.extractUnversionedLeafPath(node.permaPath)===URLTREE.extractUnversionedLeafPath(resPath)){if(this.isRowKeyShown(node)){this.refreshRowKey(node)}else{this.resetAsyncChildren(this.parent(node))}}}
this._connOpened=()=>{this.fetchRootDatas()}
depotEvents.on("resChange",this._resChange)
depotEvents.on("connOpened",this._connOpened)}return this.fetchRootDatas()}async fetchRootDatas(){while(this.sequentialReq)await this.sequentialReq
try{await(this.sequentialReq=this._fetchRootDatas())}finally{this.sequentialReq=null}}async _fetchRootDatas(){if(DEBUG)console.log("utBrowser.fetchRootDatas:::start")
if(this.callbackFetching)this.callbackFetching.onFetching("fetchInit")
this.lastError=undefined
try{const datas=await this.fetcher.fetchNode(this.pathRoot,true)
if(datas==null)throw Error("Root not found")
this.lastError=null
datas.ch=this.filterChildren(datas,datas.ch||[])
this.setDatas([datas])
this.openFolder(datas)}catch(e){this.lastError=e
this.setDatas([])
throw e}finally{if(this.callbackFetching)this.callbackFetching.onFetching("fetchEnd")
if(DEBUG)console.log("utBrowser.fetchRootDatas:::end")}}async openFolderAsync(rowKey){try{if(DEBUG)console.log("openFolderAsync:::start",rowKey)
if(this.folderSt(rowKey)!==EFolderState.closed)return false
this.setFolderSt(rowKey,EFolderState.opening)
let datas
if(isNodeAutoFold(rowKey)){datas=await this.fetcher.fetchFoldedChildren(this.getParentUtNode(rowKey).permaPath,rowKey.from,rowKey.to)}else if(rowKey.vcb==="n"){datas=await this.fetcher.fetchVersions(rowKey.permaPath)
datas.forEach(n=>{n.vcb="v"
n.n=rowKey.n})}else{const node=await this.fetcher.fetchNode(rowKey.permaPath,true)
datas=node===null||node===void 0?void 0:node.ch}if(!this.isRowkeyAlive(rowKey))return false
datas=this.filterChildren(rowKey,datas||[])
this.setChilrenTo(rowKey,datas,this.defaultOpenState)
this.setFolderSt(rowKey,EFolderState.closed)
return this.openFolder(rowKey)}catch(e){POPUP.showNotifError("Accès au serveur impossible",this.grid)
this.closeFolder(rowKey)
throw e}finally{if(DEBUG)console.log("openFolderAsync:::end",rowKey)}}}export class UtBrowserDataSearch extends UtBrowserDataBase{constructor(fromFull){super(fromFull.fetcher,fromFull.reg,fromFull.pathRoot,fromFull.jsNodeFilter)
this.callbackFetching=fromFull.callbackFetching
this.defaultOpenState=GridDataHolderJsonTree.defaultOpened}initDataSearch(){const depotEvents=this.reg.env.depotEvents
if(depotEvents){this._resChange=m=>{const resPath=m.props.path
if(!URLTREE.isDescendantPath(this.pathRoot,resPath))return
const node=this.findRowKeyByResPath(resPath)
if(!node)return
if(this.isRowKeyShown(node)){return this.refreshRowKey(node)}else{this.resetAsyncChildren(this.parent(node))}}
this._connOpened=()=>{this.fetchSearchStart()}
depotEvents.on("resChange",this._resChange)
depotEvents.on("connOpened",this._connOpened)}}connectToGrid(grid){super.connectToGrid(grid)
this.listenForNextSearch()}fetchSearchStart(){if(this._currentSearch){const req=this.request
this._currentSearch.then(()=>{if(req===this.request)this.fetchSearchStart()})}else{this._currentSearch=this._fetchSearchStart()}}fetchSearchNext(){if(!this._afterPath||!this._grid)return
if(this._currentSearch)return
this._currentSearch=this._fetchSearchNext()}closeFolder(rowKey){return false}isRowKeyFolderStateSwitchable(rowKey){return false}get searching(){return this._currentSearch}async _fetchSearchStart(){if(this.callbackFetching)this.callbackFetching.onFetching("fetchInit")
this.lastError=undefined
this.unlistenForNextSearch()
try{const results=await this.fetcher.searchNodes(this.pathRoot,this.request)
if(!this._grid)return
this._afterPath=results.next
this.lastError=null
if(!results.found){this.root=null
this.setDatas([])}else{this.root=results.found
this.setDatas(results.found.ch,GridDataHolderJsonTree.defaultOpened)}}catch(e){this.lastError=e
this.setDatas([])
throw e}finally{this._currentSearch=null
if(this.callbackFetching)this.callbackFetching.onFetching("fetchEnd")}this.listenForNextSearch()}_initRowData(data,parent,openIt){if(this.jsNodeFilter&&data.ch)data.ch=data.ch.filter(this.jsNodeFilter)
return super._initRowData(data,parent,openIt)}unlistenForNextSearch(){if(this._grid)this._grid.reachedLimitsCb=null}listenForNextSearch(){if(this._afterPath&&this._grid)this._grid.reachedLimitsCb=start=>{if(start)return
this.fetchSearchNext()}}async _fetchSearchNext(){var _a
this._grid.refreshFreeze(1)
try{this.lastError=undefined
this.unlistenForNextSearch()
if(this.callbackFetching)this.callbackFetching.onFetching("fetchNext")
const results=await this.fetcher.searchNodes(this.pathRoot,this.request,this._afterPath)
if(!this._grid)return
this._afterPath=results.next
this.lastError=null
let parent=this.root||this._datas[0]
if(parent&&((_a=results.found)===null||_a===void 0?void 0:_a.ch))for(const child of results.found.ch){this.insertInTree(parent,child)}}catch(e){this.lastError=e
this.setDatas([])
throw e}finally{this._currentSearch=null
this._grid.refreshFreeze(-1)
this._grid.refresh()
if(this.callbackFetching)this.callbackFetching.onFetching("fetchEnd")}this.listenForNextSearch()}insertInTree(parent,toInsert){const existNode=this.findInChildrenByName(parent.ch,toInsert.n)
if(existNode){if(existNode.vcb==="n"){if(toInsert.ch)for(const versNode of toInsert.ch){const existV=this.findInChildrenByVersion(existNode.ch,versNode.v)
if(existV){if(versNode.ch)for(const child of versNode.ch){this.insertInTree(existV,child)}}else{this.insertRowKey(existNode,versNode)}}}else{if(toInsert.ch)for(const child of toInsert.ch){this.insertInTree(existNode,child)}}}else{this.insertRowKey(parent,toInsert)}}findInChildrenByVersion(children,version){if(!children)return null
for(let i=0;i<children.length;i++){const ch=children[i]
if(ch.v===version)return ch}return null}}export class UtBrowserFetcher{constructor(urlTreeSrv){this.urlTreeSrv=urlTreeSrv
this.maxChildren=250
this.nodeProps=RES.NODEPROPS_short
this.childrenFilter=""
this.seachFilter=undefined}setFilter(filter){this.childrenFilter=filter!=null?`&childrenFilter=${encodeURIComponent(filter)}`:""
this.seachFilter=filter?filter:undefined
return this}async fetchNode(path,withChildren){if(withChildren)return this.urlTreeSrv.listChildren(path,`&excludeAll&props=${this.nodeProps}&childrenProps=${this.nodeProps}&childrenAutoFold=${this.maxChildren}${this.childrenFilter}`)
if(!this.seachFilter)return this.urlTreeSrv.nodeInfos(path,`&excludeAll&props=${this.nodeProps}`)
const node=await this.urlTreeSrv.nodeInfos(path,`&excludeAll&props=${this.nodeProps}&matchFilter=${this.seachFilter}`)
return(node===null||node===void 0?void 0:node.matchFilter)===false?null:node}async fetchFoldedChildren(path,from,to){const parent=await this.urlTreeSrv.listChildren(path,`&excludeAll&props=path&childrenProps=${this.nodeProps}&childrenAutoFold=${this.maxChildren}${this.childrenFilter}&childrenFrom=${encodeURIComponent(from)}&childrenTo=${encodeURIComponent(to||"")}`)
return parent.ch||[]}async fetchVersions(path){const parent=await this.urlTreeSrv.nodeInfos(URLTREE.extractUnversionedLeafPath(path),`&excludeAll&props=${this.nodeProps}&historyProps=${this.nodeProps}`)
let r
if(parent.hist){r=parent.hist
parent.hist=undefined
r.splice(0,0,parent)}else{r=[parent]}return r}searchNodes(root,exp,from){return this.urlTreeSrv.searchNodes(root,this.seachFilter?`${this.seachFilter}&(${exp})`:exp,50,from)}get naturalSortFn(){return this.urlTreeSrv.naturalSortPathFn}get nameSortFn(){return this.urlTreeSrv.naturalSortNameFn}get versionSortFn(){return this.urlTreeSrv.naturalSortVersionFn}}const rowDropMgr={onDragOverRow(ev,grid,row,line){ev.dataTransfer.dropEffect="none"
if(!row)return EGridDropPos.none
const utBrowser=DOMSH.findHost(grid)
const node=row.rowDatas
if(isNodeAutoFold(node))return EGridDropPos.none
if(ev.dataTransfer.types.indexOf("Files")>=0){const resType=utBrowser.reg.env.resTypes.getResTypeFor(node)
if(!resType.prcIsFolder)return EGridDropPos.none
ev.dataTransfer.dropEffect="copy"
return EGridDropPos.over}return EGridDropPos.none},async dropOnRow(ev,grid,row,line,pos){const utBrowser=DOMSH.findHost(grid)
if(ev.dataTransfer.types.indexOf("Files")>=0){const node=row.rowDatas
if(isNodeAutoFold(node))return
const resType=utBrowser.reg.env.resTypes.getResTypeFor(node)
if(resType.prcIsFolder){const action=(new AddByImport).setFiles(await getFilesOnDrop(ev.dataTransfer))
const ctx=resType.newShortResRegFromDepotReg(utBrowser.reg,node)
if(action.isAvailable(ctx)){action.execute(ctx,ev)}}}}}
export class CellBuilderUtBrowser extends CellBuilderResIconName{_getValue(row){if(isNodeAutoFold(row.rowDatas))return"["+row.rowDatas.from+"...]"
if(row.rowDatas.vcb==="v")return row.cacheHolder["resV"]||(row.cacheHolder["resV"]="@"+this.resTypes.getResTypeFor(row.rowDatas).resVersion(row.rowDatas))
return super._getValue(row)}_getIcon(row){if(isNodeAutoFold(row.rowDatas))return"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/objects/res/autoFold.svg"
return super._getIcon(row)}redrawCell(row,root){root.style.fontStyle=isNodeAutoFold(row.rowDatas)?"italic":"normal"
super.redrawCell(row,root)}static makeSortFn(fetcher){return function(n1,n2){if(isNodeAutoFold(n1)){return isNodeAutoFold(n2)?fetcher.naturalSortFn(n1.from,n2.from):1}else if(isNodeAutoFold(n2)){return isNodeAutoFold(n1)?fetcher.naturalSortFn(n1.from,n2.from):-1}if(n1.vcb==="v")return fetcher.versionSortFn(n1.v,n2.v)
return fetcher.nameSortFn(n1.n,n2.n)}}}const DEBUG=false

//# sourceMappingURL=utBrowser.js.map