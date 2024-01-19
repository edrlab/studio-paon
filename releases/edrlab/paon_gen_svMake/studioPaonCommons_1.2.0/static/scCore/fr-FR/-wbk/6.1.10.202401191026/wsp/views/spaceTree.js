import{BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{EGridDropPos}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{Grid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{EFolderState,GridColTreeDef,GridDataHolderJsonTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{CopyToSrc,CreateItem,CreateSpace,DuplicateSrc,FocusItemOrSpace,ImportItemsToSrc,MoveToSrc,RenameSrc,SrcAction,WriteMainStreamToSrc}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{ACTION,Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{BaseAreaViewAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{InfoCurrentItem,InfoFocusItem,InfoHighlighItemSgn,InfoReqCurrentItem,InfoSelectUris,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{ESrcSt,SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{EItemTypeFamily}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js"
import{CellBuilderSrcIconCodeTitle,redrawSrcLine}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcGridColumns.js"
import{EWspChangesEvts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{TASK}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/lcTask.js"
import{SearchItems}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
import{WspAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/wspActions.js"
export class SpaceTree extends BaseAreaViewAsync{constructor(){super(...arguments)
this.shortDescs=[]}get emitter(){return this.grid}get me(){return this}get currentDatas(){return this.grid.dataHolder}get uriFilter(){return this.search?this.search.value:null}async selectSrcUri(srcUri,openIt){if(this.modeSearch){if(!await this.datasSearch.fetchSrcUri(srcUri))return false}else{await this.datas.openToTargets([srcUri])}const rowKey=this.currentDatas.findRowKeyBySrcUri(srcUri)
if(rowKey){this.grid.setSelectedRows(this.currentDatas.getOffset(rowKey))
if(openIt)return this.currentDatas.openFolderAsync(rowKey)}return rowKey!=null}async selectSrcUris(srcUris){if(this.modeSearch){await this.datasSearch.fetchSrcUris(srcUris)}else{await this.datas.openToTargets(srcUris.concat())}this.grid.setSelectedRows(srcUris.map(srcUri=>this.currentDatas.findRowKeyBySrcUri(srcUri)).filter(rowKey=>rowKey!=null).map(rowKey=>this.currentDatas.getOffset(rowKey)))}async ensureRowVisible(srcUri){if(this.modeSearch){if(!await this.datasSearch.fetchSrcUri(srcUri))return false}else{await this.datas.openToTargets([srcUri])}const rowKey=this.currentDatas.findRowKeyBySrcUri(srcUri)
if(rowKey)this.grid.ensureRowVisible(this.currentDatas.getOffset(rowKey))
return rowKey!=null}async _initialize(init){super._initialize(init)
this.wsp=this.reg.env.wsp
this.place=this.wsp.newPlaceWsp()
this.uriRoot=init.uriRoot||""
this.showRoot=init.showRoot
this.infoBroker=init.itemHandlingReact
this.emptyTree=init.emptyTree
this._initSpaceTreeData(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
if(!init.hideSearch)this._initSearchUi()
this.showTitleLive=this.showTitle=init.showTitle
const colDefs=[init.primaryCol||new GridColTreeDef("srcTree").setDefaultSort(1,"ascendant").setFlex("1rem",1,1).setMinWidth("55px").setSortable(true).setRowDropMgr(rowDropMgr).setCellBuilder(new CellBuilderSpaceTree(this))]
if(init.secondaryCols)colDefs.push(...init.secondaryCols)
this.grid=sr.appendChild((new Grid).initialize({selType:"multi",columnDefs:colDefs,dataHolder:this.datas,hideHeaders:true,lineDrawer:this.infoBroker?this:null,skinOver:"wsp-space-tree/grid",skinScroll:"scroll/small",noResizableCol:true,emptyBody:()=>{if(this.datas.lastError===undefined){return JSX.createElement("c-msg",{label:"Chargement...",level:"info"})}else if(this.datas.lastError===null){if(this.modeSearch)return JSX.createElement("c-msg",{label:"Aucun item ne correspond à votre recherche",level:"info"})
return this.emptyTree?this.emptyTree(this):JSX.createElement("c-msg",{label:"Aucun contenu",level:"info"})}else{return JSX.createElement("c-msg",{label:"Accès au serveur impossible",level:"error"})}},defaultAction:init.defaultAction,defaultActionCtx:this}))
if(init.secondaryCols)DOM.setAttrBool(this.grid,"data-has-secondary-cols",true)
Object.defineProperty(this.grid,"ctxMenuActions",{get:()=>({actions:this.actions,actionContext:this,rect:this.grid.getSelRect()})})
this.grid.addEventListener("grid-select",(function(ev){const spaceTree=DOMSH.findHost(this)
spaceTree.shortDescs=this.dataHolder.getSelectedDatas()
if(this.matches(":focus"))this.dispatchEvent(new CustomEvent("c-focus-actions",{detail:spaceTree,bubbles:true,composed:true}))}))
this.grid.addEventListener("focus",(function(ev){this.dispatchEvent(new CustomEvent("c-focus-actions",{detail:DOMSH.findHost(this),bubbles:true,composed:true}))}))
this.grid.linesNode.setAttribute("draggable","true")
this.grid.linesNode.addEventListener("dragstart",(function(ev){ITEM.setShortDescTransferToDragSession(DOMSH.findHost(DOMSH.findHost(this)),ev,"build")}))
this.grid.linesNode.addEventListener("dragend",ITEM.resetShortDescTransferToDragSession)
if(init.accelKeyMgr){this.accelKeyMgr=init.accelKeyMgr
this.grid.addEventListener("keydown",ev=>{this.accelKeyMgr.handleKeyboardEvent(ev,this)})}let actions=init.actions
if(!actions&&this.hasAttribute("actions"))actions=this.reg.mergeLists(...BASIS.extractAttr(this,"actions").split(" "))
if(actions){actions=ACTION.injectSepByGroup(actions,this.reg.getPref("groupOrder.wsp.shortDesc",""),this)
this.actions=actions
this.focusActionables=ActionBtn.buildButtons(actions,this,"bar")}await this.datas.initSpTrDataFull(this.place)}_initSearchUi(){this.search=JSX.createElement("input",{type:"search",placeholder:"Filtrer...",spellcheck:"false",onchange:this.onSearchChange,oninput:this.onSearchChange,onkeydown:this.onSearchKeydown,onfocus:this.onSearchFocus,onblur:this.onSearchBlur})
this.shadowRoot.appendChild(JSX.createElement("label",{id:"search"},this.search))}get ctxMenuActions(){return{actions:this.actions,actionContext:Object.assign(Object.create(this),{shortDescs:[]})}}_initSpaceTreeData(init){this.datas=new SpaceTreeDataFull(this.reg,this.uriRoot,this.showRoot,init.srcFilter)
this.datas.callbackSearching=this
if(init.hideItemFolderContent)this.datas.hideItemFolderContent=true}connectedCallback(){super.connectedCallback()
if(this.infoBroker){this._highlightSgn=null
this._assigned=null
const req=new InfoReqCurrentItem
this.infoBroker.dispatchInfo(req,this)
this.setCurrentItem(req.srcUri||null)
this.infoBroker.addConsumer(this)}}diconnectedCallback(){if(this.infoBroker)this.infoBroker.removeConsumer(this)}onInfo(info){if(info instanceof InfoCurrentItem){this.setCurrentItem(info.srcUri)}else if(info instanceof InfoHighlighItemSgn){this._highlightSgn=info.sgnPattern
this._assigned=info.assigned
this.grid.invalidateRows()}else if(info instanceof InfoFocusItem&&info.shortDesc&&info.infoHolders.indexOf(this.grid)<0){if(ITEM.getSrcUriType(info.shortDesc.srcUri)==="space"){if(this.modeSearch)this.gotoModeTree()
this.selectSrcUri(info.shortDesc.srcUri,true).then(()=>{this.grid.focus()
this.ensureRowVisible(info.shortDesc.srcUri)})}}else if(info instanceof InfoSelectUris){if(this.modeSearch)this.gotoModeTree()
setTimeout(()=>{this.selectSrcUris(info.srcUris).then(()=>{this.grid.focus()
this.ensureRowVisible(info.srcUris[0])})},200)
info.handled=true}}setCurrentItem(srcUri){this._currentSrcUri=srcUri
this.grid.invalidateRows()
if(this._currentSrcUri)this.ensureRowVisible(this._currentSrcUri)}redrawLine(row,line){redrawSrcLine(this.wsp,row.rowKey,line,this._currentSrcUri,this._highlightSgn,this._assigned)}get modeSearch(){return this.grid.dataHolder===this.datasSearch}onSearchChange(ev){const me=DOMSH.findHost(this)
if(me.modeSearch){if(me.search.value.length===0){me.gotoModeTree()
const currentItem=new InfoReqCurrentItem
me.infoBroker.dispatchInfo(currentItem,me)
if(currentItem.srcUri)me.selectSrcUri(currentItem.srcUri).then(()=>{me.ensureRowVisible(currentItem.srcUri)})}else if(me.datasSearch.request.updateParams(me)){me.datasSearch.fetchSearchStart()}}else{if(me.search.value.length>0)me.gotoModeSearch()}}onSearchKeydown(ev){if(ev.key==="ArrowDown"){const me=DOMSH.findHost(this)
if(me.grid.dataHolder.countRows()>0){me.grid.setSelectedRows(0)
me.grid.focus()
ev.stopImmediatePropagation()
ev.preventDefault()}}}onSearchFocus(ev){const me=DOMSH.findHost(this)
if(me.showTitleLive){me.showTitleLive=false
me.grid.invalidateRows()}}onSearchBlur(ev){const me=DOMSH.findHost(this)
if(me.showTitleLive!==me.showTitle){me.showTitleLive=me.showTitle
me.grid.invalidateRows()}}gotoModeSearch(){if(!this.datasSearch)this._initDataSearch()
this.search.classList.toggle("filtered",true)
this.grid.classList.toggle("filtered",true)
this.grid.dataHolder=this.datasSearch
this.datasSearch.request.updateParams(this)
this.datasSearch.fetchSearchStart()}_initDataSearch(){this.datasSearch=new SpaceTreeDataSearchLive(this.reg,this.uriRoot,this.showRoot,this.datas.fieldsFilter)
this.datasSearch.callbackSearching=this
this.datasSearch.hideItemFolderContent=this.datas.hideItemFolderContent
this.datasSearch.initSpTrDataLive(this.place)}gotoModeTree(){this.search.classList.toggle("filtered",false)
this.grid.classList.toggle("filtered",false)
this.search.value=""
this.grid.dataHolder=this.datas}onViewHidden(closed){if(closed)this.place.closePlace()}onSearching(state){if(this._searchingMsg){this._searchingMsg.remove()
this._searchingMsg=null}if(state==="searchInit"){this._searchingMsg=this.shadowRoot.insertBefore(JSX.createElement("div",{id:"searchInit"},"Recherche..."),this.grid)}else if(state==="searchNext"){this._searchingMsg=this.shadowRoot.insertBefore(JSX.createElement("div",{id:"searchNext"},"Recherche suivants..."),this.grid.nextSibling)}}extractFolderUri(src){if(!src||!src.srcUri||!src.srcSt)return this.uriRoot
if(this.datas.hideItemFolderContent){return ITEM.extractSpaceUri(src.srcUri)}else if(!src.itModel||this.wsp.wspMetaUi.getItemType(src.itModel).isFamily(EItemTypeFamily.folder,EItemTypeFamily.undef,EItemTypeFamily.other)){return src.srcSt===ESrcSt.file?SRC.extractUriParent(src.srcUri):src.srcUri}return ITEM.extractSpaceUri(src.srcUri)}extractFolderSrcFields(src){const srcUri=this.extractFolderUri(src)
if(srcUri)return this.datas.findRowKeyBySrcUri(srcUri)}}REG.reg.registerSkin("wsp-space-tree",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tposition: relative;\n\t}\n\n\t#search {\n\t\tbackground: .1em / 1em no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/filter.svg) var(--form-search-bgcolor);\n\t\tpadding-inline-start: 1.2em;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\tinput {\n\t\tpadding: 2px;\n\t\tbackground: var(--form-search-bgcolor);\n\t\tcolor: var(--form-color);\n\t\tborder: none;\n\t\twidth: 100%;\n\t\tfont-size: inherit;\n\t}\n\n\t.filtered {\n\t\tbackground: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/filtered.svg) var(--row-bgcolor);\n\t}\n\n\tinput:focus {\n\t\toutline: var(--focus-outline);\n\t}\n\n\tinput::placeholder {\n\t\tcolor: var(--fade-color);\n\t\tletter-spacing: 2px;\n\t\tfont-size: .8em;\n\t\tfont-style: italic;\n\t}\n\n\tinput:focus::placeholder {\n\t\tcolor: transparent;\n\t}\n\n\tc-grid {\n\t\tflex: 1;\n\t\tborder: none;\n\t\tbackground-color: var(--row-bgcolor);\n\t}\n\n\t#searchInit, #searchNext {\n\t\tposition: absolute;\n\t\tz-index: 1;\n\t\tbackground-color: var(--bgcolor);\n\t\tcolor: var(--color);\n\t\talign-self: center;\n\t\tpadding: .5em;\n\t\tborder: 1px solid var(--border-color);\n\t\tborder-radius: 1em;\n\t}\n\n\t#searchInit {\n\t\ttop: 2em;\n\t}\n\n\t#searchNext {\n\t\tbottom: 1em;\n\t}\n`)
REG.reg.registerSkin("wsp-space-tree/grid",1,`\n\t.highlight {\n\t\tbackground-color: var(--row-highlight-bgcolor);\n\t}\n\n\t.assigned {\n\t\tbackground-color: var(--row-assigned-bgcolor);\n\t}\n\n\t/** Réservation de la largeur de background-image pour qu'il n'y ait pas de superposition avec les secondary-cols */\n\t:host([data-has-secondary-cols]) .line {\n\t\tpadding-inline-end: .8rem;\n\t}\n\n\t.current {\n\t\tbackground-position: right;\n\t\tbackground-repeat: no-repeat;\n\t\tbackground-image: var(--row-current-img-end);\n\t\tbackground-color: var(--row-current-bgcolor);\n\t}\n\n\t.icon {\n\t\tfilter: var(--filter);\n\t}\n`)
customElements.define("wsp-space-tree",SpaceTree)
export class SpaceTreeDataBase extends GridDataHolderJsonTree{constructor(reg,uriRoot="",showRoot=false,fieldsFilter,excludeTildeRootUriExcept=[]){super("ch")
this.reg=reg
this.uriRoot=uriRoot
this.showRoot=showRoot
this.fieldsFilter=fieldsFilter
this.wsp=reg.env.wsp
if(excludeTildeRootUriExcept){const filter=excludeTildeRootUriExcept.length===0?data=>!data.srcUri.startsWith("/~"):data=>!data.srcUri.startsWith("/~")||excludeTildeRootUriExcept.findIndex(u=>data.srcUri.startsWith(u))>=0
if(this.fieldsFilter){const subFilter=this.fieldsFilter
this.fieldsFilter=data=>filter(data)&&subFilter(data)}else{this.fieldsFilter=filter}}this.setNaturalOrder((a,b)=>this.wsp.srcUriItemsSortFn(a.srcUri,b.srcUri))}findRowKeyBySrcUri(srcUri,lastAncestor){if(this.showRoot?!SRC.isSubUriOrEqual(this.uriRoot,srcUri):!SRC.isSubUri(this.uriRoot,srcUri))return null
if(this.showRoot&&srcUri===SRC.URI_ROOT)return this._datas[0]
let offset=this.uriRoot.length+1
let nextEnd=srcUri.indexOf("/",offset)
let children=this.showRoot?this._datas[0].ch:this._datas
if(!children)return
let previous=null
while(nextEnd>0){const uriParent=srcUri.substring(0,nextEnd)
const parent=children.find(fields=>fields.srcUri===uriParent)
if(!parent)return lastAncestor?previous:null
previous=parent
children=this.ch(parent)
if(!children)return lastAncestor?parent:null
offset=nextEnd+1
nextEnd=srcUri.indexOf("/",offset)}return children.find(fields=>fields.srcUri===srcUri)||(lastAncestor?previous:null)}async openToTargets(srcUris){while(this.sequentialReq)await this.sequentialReq
if(DEBUG)console.log("openToTargetsSeq:::start",srcUris)
const roots=this.findRootsToFetchOrOpenAnc(srcUris)
try{if(roots.length===0)return
if(roots.length===1)return await(this.sequentialReq=this._openToTargets(roots[0].root,roots[0].targets))
await(this.sequentialReq=Promise.all(roots.map(root=>this._openToTargets(root.root,root.targets))))}finally{this.sequentialReq=null
if(DEBUG)console.log("openToTargetsSeq:::end",roots)}}async fetchRootDatas(){while(this.sequentialReq)await this.sequentialReq
try{await(this.sequentialReq=this._fetchRootDatas())}finally{this.sequentialReq=null}}async refetchTree(targets){while(this.sequentialReq)await this.sequentialReq
try{await(this.sequentialReq=this._refetchTree(targets))}finally{this.sequentialReq=null}}async _fetchRootDatas(){if(DEBUG)console.log("fetchRootDatas:::start")
if(this.callbackSearching)this.callbackSearching.onSearching("searchInit")
this.lastError=undefined
try{const datas=await WSP.fetchShortDescTree(this.wsp,this._grid,this.uriRoot,1)
if(!datas.ch)datas.ch=[]
this.lastError=null
if(this.fieldsFilter)datas.ch=datas.ch.filter(this.fieldsFilter)
if(this.showRoot){this.rootSrcFields=null
this.setDatas([datas])
this.openFolder(datas)}else{this.rootSrcFields=datas
this.setDatas(datas.ch)}}catch(e){this.lastError=e
this.setDatas([])
throw e}finally{if(this.callbackSearching)this.callbackSearching.onSearching("searchEnd")
if(DEBUG)console.log("fetchRootDatas:::end")}}async _refetchTree(targets){if(DEBUG)console.log("refetchTree:::start",targets)
if(this.callbackSearching)this.callbackSearching.onSearching("searchInit")
this.lastError=undefined
try{let scrollTopUri
let scrollTopOffset
if(this._grid){scrollTopOffset=this._grid.getVisibleOffsetStart()
scrollTopUri=scrollTopOffset>0?this.getRowKey(scrollTopOffset).srcUri:null}const datas=await WSP.fetchShortDescSubTree(this.wsp,this._grid,this.uriRoot,targets)
this.lastError=null
if(!datas.ch)datas.ch=[]
if(this.fieldsFilter){const filter=datas=>{if(datas.ch)(datas.ch=datas.ch.filter(this.fieldsFilter)).forEach(filter)}
filter(datas)}const memOpenStates=this.defaultOpenState
try{this.defaultOpenState=data=>data.ch!=null
if(this.showRoot){this.rootSrcFields=null
this.setDatas([datas])
this.openFolder(datas)}else{this.rootSrcFields=datas
this.setDatas(datas.ch||[])}if(this._grid){const newRowKey=scrollTopUri?this.findRowKeyBySrcUri(scrollTopUri):null
if(newRowKey){this._grid.ensureRowVisible(this.getOffset(newRowKey),{block:"start",behavior:"auto"})}else{this._grid.ensureRowVisible(scrollTopOffset,{block:"start",behavior:"auto"})}}}finally{this.defaultOpenState=memOpenStates}}catch(e){this.lastError=e
this.setDatas([])
throw e}finally{if(this.callbackSearching)this.callbackSearching.onSearching("searchEnd")
if(DEBUG)console.log("refetchTree:::end",targets)}}async openFolderAsync(rowKey){try{if(DEBUG)console.log("openFolderAsync:::start",rowKey.srcUri)
if(this.folderSt(rowKey)!==EFolderState.closed)return false
this.setFolderSt(rowKey,EFolderState.opening)
const datas=await WSP.fetchShortDescTree(this.wsp,this._grid,rowKey.srcUri,1)
if(!this.isRowkeyAlive(rowKey))return false
if(this.fieldsFilter&&datas.ch)datas.ch=datas.ch.filter(this.fieldsFilter)
if(!datas.ch)datas.ch=[]
this.setChilrenTo(rowKey,datas.ch,this.defaultOpenState)
this.setFolderSt(rowKey,EFolderState.closed)
return this.openFolder(rowKey)}catch(e){POPUP.showNotifError("Accès au serveur impossible",this.grid)
this.closeFolder(rowKey)
throw e}finally{if(DEBUG)console.log("openFolderAsync:::end",rowKey.srcUri)}}closeFolder(rowKey){if(super.closeFolder(rowKey)){const chList=this.ch(rowKey)
if(chList){for(const ch of chList)this._killRowData(ch)
this.setCh(rowKey,null)}return true}return false}async _openToTargets(rowKey,targets){try{const datas=await WSP.fetchShortDescSubTree(this.wsp,this._grid,rowKey.srcUri,targets)
if(!this.isRowkeyAlive(rowKey))return
if(this.fieldsFilter){const filter=datas=>{if(datas.ch)(datas.ch=datas.ch.filter(this.fieldsFilter)).forEach(filter)}
filter(datas)}if(!datas.ch)datas.ch=[]
this.setChilrenTo(rowKey,datas.ch,data=>data.ch!=null)
this.openFolder(rowKey)}catch(e){POPUP.showNotifError("Accès au serveur impossible",this.grid)
this.closeFolder(rowKey)
throw e}}findRootsToFetchOrOpenAnc(targets){const r=[]
for(let i=0;i<targets.length;i++){const target=targets[i]
if(!target)continue
const rowKey=this.findRowKeyBySrcUri(target,true)||this.rootSrcFields
if(rowKey){if(rowKey.srcUri!==target){const newRoot={root:rowKey,targets:[target]}
r.push(newRoot)
for(let k=i+1;k<targets.length;k++){if(SRC.isSubUri(rowKey.srcUri,targets[k])){newRoot.targets.push(targets[k])
targets[k]=null}}}else{const parent=this.getRowKeyParent(rowKey)
if(parent)this.openFolder(parent)}}}return r}async refreshRowKey(rowKey){const fields=await this.wsp.fetchShortDesc(rowKey.srcId||rowKey.srcUri,this._grid)
if(!this.isRowkeyAlive(rowKey))return
if(this.mustHideNode(fields)){this.deleteRowKey(rowKey)}else{const newRowKey=Object.assign(Object.create(null),fields)
this.replaceRowKey(rowKey,newRowKey,true)
if(this._grid&&this._grid.isRowSelected(this.getOffset(newRowKey))){this._grid.dispatchEvent(new CustomEvent("grid-select",{bubbles:true,composed:true}))}}}async insertSrcUri(parentRowKey,srcUri,shortDesc){if(this.sequentialReq){while(this.sequentialReq)await this.sequentialReq
if(this.findInChildren(parentRowKey?parentRowKey.ch:this._datas,srcUri)>=0)return}try{await(this.sequentialReq=this._insertSrcUri(parentRowKey,srcUri,shortDesc))}finally{this.sequentialReq=null}}async _insertSrcUri(parentRowKey,srcUri,shortDesc){const fields=shortDesc||await this.wsp.fetchShortDesc(srcUri,this._grid)
if(this.mustHideNode(fields))return
if(parentRowKey&&!this.isRowkeyAlive(parentRowKey)&&this.getRowKeyFolderState(parentRowKey)!==EFolderState.opened)return
if(this.findInChildren(parentRowKey?parentRowKey.ch:this._datas,srcUri)>=0)return
this.insertRowKey(parentRowKey,Object.assign(Object.create(null),fields))}findInChildren(children,srcUri){return children.findIndex(e=>e.srcUri===srcUri)}mustHideNode(fields){if(!fields)return true
if(this.fieldsFilter&&!this.fieldsFilter(fields))return true
if(this.showDeletedDrfEntries){if(fields.srcSt===ESrcSt.none){if(fields.drfState==="createdDeleted")return true}}else{if(fields.srcSt===ESrcSt.none)return true}return false}shouldHideEntry(msg,nodeFound){if(msg.type!==EWspChangesEvts.r&&msg.type!==EWspChangesEvts.drfState)return false
if(this.showDeletedDrfEntries){if(nodeFound){if(nodeFound.srcSt<0)return true
if(nodeFound.drfState==="created")return true}return false}return true}_initRowData(data,parent,openIt){if(data.srcSt===ESrcSt.folder){if(data.itModel!=null){if(!this.hideItemFolderContent&&this.wsp.wspMetaUi.getItemType(data.itModel).isFamily(EItemTypeFamily.folder,EItemTypeFamily.undef,EItemTypeFamily.other)){if(data.ch===undefined)data.ch=null}else if("ch"in data){data.ch=undefined}}else if(!("ch"in data)){data.ch=null}}return super._initRowData(data,parent,openIt)}}export class SpaceTreeDataFull extends SpaceTreeDataBase{initSpTrDataFull(place){var _a
if(place)place.eventsMgr.on("wspUriChange",(msg,from)=>{if(this.wsp.code!==msg.wspCd)return
const srcUri=!this.hideItemFolderContent&&msg.shortDesc?msg.shortDesc.srcUri:msg.srcUri
if(ITEM.isSpecialUri(srcUri))return
if(srcUri===this.uriRoot){return this.fetchRootDatas()}else if(this.uriRoot&&!SRC.isSubUri(this.uriRoot,srcUri))return
const node=this.findRowKeyBySrcUri(srcUri)
if(!node){const parentUri=SRC.extractUriParent(srcUri)
if(parentUri===this.uriRoot&&!this.showRoot){if(!this.shouldHideEntry(msg))return this.insertSrcUri(null,srcUri,msg.shortDesc)
return}const anc=this.findRowKeyBySrcUri(parentUri,true)
if(!anc){if(!this.shouldHideEntry(msg)){const chUri=srcUri.substring(0,srcUri.indexOf("/",1))
if(!this._datas.find(src=>src.srcUri===chUri)){return this.insertSrcUri(null,chUri)}}}else if(anc.srcUri===parentUri){if(this.isRowKeyShown(anc)&&this.getRowKeyFolderState(anc)===EFolderState.opened){if(!this.shouldHideEntry(msg))return this.insertSrcUri(anc,srcUri,msg.shortDesc)}else{this.resetAsyncChildren(anc)}}else if(msg.type===EWspChangesEvts.u&&anc.ch){const chUri=srcUri.substring(0,srcUri.indexOf("/",anc.srcUri.length+1))
if(!anc.ch.find(src=>src.srcUri===chUri)){if(this.isRowKeyShown(anc)&&this.getRowKeyFolderState(anc)===EFolderState.opened){return this.insertSrcUri(anc,chUri)}else{this.resetAsyncChildren(anc)}}}return}if(this.shouldHideEntry(msg,node)){this.deleteRowKey(node)}else if(msg.type===EWspChangesEvts.s){node["itSt"]=msg.itSt
node["icon"]=undefined
if(this._grid){const offset=this.getOffset(node)
if(offset>=0)this._grid.invalidateRows(offset,1)}}else{if(this.isRowKeyShown(node)){if(msg.type===EWspChangesEvts.u&&this.getRowKeyFolderState(node)===EFolderState.opened){this.closeFolder(node)
this.resetAsyncChildren(node)}return this.refreshRowKey(node)}else{this.resetAsyncChildren(this.getRowKeyParent(node))}}})
if(place)place.eventsMgr.on("onConnectionRenewed",()=>{const targets=[]
function listTargets(datas){const oldLen=targets.length
for(const node of datas){if(node.ch){if(listTargets(node.ch)){targets.push(node.srcUri+"/")}}}return oldLen===targets.length}if(listTargets(this._datas))targets.push(this.uriRoot+"/")
this.refetchTree(targets)})
this.showDeletedDrfEntries=((_a=this.wsp.wspDefProps)===null||_a===void 0?void 0:_a.drfRefWsp)!=null
return this.fetchRootDatas()}}export class SpaceTreeDataSearch extends SpaceTreeDataBase{constructor(){super(...arguments)
this._afterEndFolder=false}connectToGrid(grid){super.connectToGrid(grid)
this.listenGridLimits()}initSpTrDataSearch(req,maxStartSearch,maxNextSearch){this.request=req
this.maxStartSearch=maxStartSearch
this.maxNextSearch=maxNextSearch
this.defaultOpenState=GridDataHolderJsonTree.defaultOpened}fetchSearchStart(resetUi){if(resetUi){this.lastError=undefined
this.setDatas([])}if(this._nextSearch){const stamp=this.request.getStamp()
this._nextSearch=this._nextSearch.then(()=>{if(this.request.isSameStamp(stamp))return this.fetchSearchStart()})}else{this._nextSearch=this._fetchSearchStart()}return this._nextSearch}hasNextToPopulate(){return this._afterSrcUri!=null}fetchSearchNext(count){if(!this._afterSrcUri||!this._grid)return
if(this._nextSearch){const stamp=this.request.getStamp()
this._nextSearch=this._nextSearch.then(()=>{if(this.request.isSameStamp(stamp))return this.fetchSearchNext(count)})}else{this._nextSearch=this._fetchSearchNext(count||this.maxNextSearch)}return this._nextSearch}async fetchSearchReplaceChildren(folderUri){if(!this._grid)return
if(this._nextSearch){const stamp=this.request.getStamp()
this._nextSearch=this._nextSearch.then(()=>this.request.isSameStamp(stamp)?this.fetchSearchReplaceChildren(folderUri):false)}else{this._nextSearch=this._fetchSearchReplaceChildren(folderUri,this.maxNextSearch)}return this._nextSearch}async fetchSrcUri(srcUri){let guard=0
while(this._afterSrcUri&&this.wsp.srcUriItemsSortFn(srcUri,this._afterSrcUri)>0&&guard<100){await this.fetchSearchNext(2e3)
guard++}return true}async fetchSrcUris(srcUris){let guard=0
for(const srcUri of srcUris){while(this._afterSrcUri&&this.wsp.srcUriItemsSortFn(srcUri,this._afterSrcUri)>0&&guard<100){await this.fetchSearchNext(2e3)
guard++}}}async openFolderAsync(rowKey){try{if(this.folderSt(rowKey)!==EFolderState.closed)return false
this.setFolderSt(rowKey,EFolderState.opened)
this.setChilrenTo(rowKey,[],this.defaultOpenState)
if(await this.fetchSearchReplaceChildren(rowKey.srcUri)){const offset=this.getOffset(rowKey)
if(offset>=0)this.grid.invalidateRows(offset,1)
return true}return false}catch(e){POPUP.showNotifError("Accès au serveur impossible",this.grid)
this.closeFolder(rowKey)
throw e}}closeFolder(rowKey){if(this._nextSearch)return false
if(super.closeFolder(rowKey)){if(this._afterSrcUri&&SRC.isSubUriOrEqual(rowKey.srcUri,this._afterSrcUri)){this._afterSrcUri=rowKey.srcUri
this._afterEndFolder=true}return true}return false}get searching(){return this._nextSearch}unlistenGridLimits(){if(this._grid)this._grid.reachedLimitsCb=null}listenGridLimits(){if(this._afterSrcUri&&this._grid)this._grid.reachedLimitsCb=start=>{if(start)return
this.fetchSearchNext(this.maxNextSearch)}}async _fetchSearchStart(){if(this.callbackSearching)this.callbackSearching.onSearching("searchInit")
this.lastError=undefined
this.unlistenGridLimits()
const datas=[]
try{const stamp=this.request.getStamp()
const res=await WSP.fetchSearch(this.wsp,this._grid,this.request.getStartReq(this.maxStartSearch))
if(!this._grid||!this.request.isSameStamp(stamp))return
this.resetAfterSrcUri()
this.insertInTreeFromSearch(res.columns,res.results,datas,false,res.results.length>=this.maxStartSearch)
this.lastError=null
this.listenGridLimits()
this.setDatas(datas)}catch(e){this.lastError=e
this.setDatas([])
throw e}finally{this._nextSearch=null
if(this.callbackSearching)this.callbackSearching.onSearching("searchEnd")}}async _fetchSearchNext(max){try{if(this.callbackSearching)this.callbackSearching.onSearching("searchNext")
this.lastError=undefined
this.unlistenGridLimits()
const stamp=this.request.getStamp()
const res=await WSP.fetchSearch(this.wsp,this._grid,this.request.getNextReq(this._afterEndFolder?this._afterSrcUri+"//":this._afterSrcUri,max))
if(!this._grid||!this.request.isSameStamp(stamp))return
this.resetAfterSrcUri()
this.insertInTreeFromSearch(res.columns,res.results,this._datas,true,res.results.length>=max)
this.lastError=null
this.listenGridLimits()}catch(e){this.lastError=e
this.setDatas([])
throw e}finally{this._nextSearch=null
if(this.callbackSearching)this.callbackSearching.onSearching("searchEnd")}}async _fetchSearchReplaceChildren(folderUri,max){if(this.callbackSearching)this.callbackSearching.onSearching("searchInside")
this.lastError=undefined
this.unlistenGridLimits()
try{const stamp=this.request.getStamp()
const res=await WSP.fetchSearch(this.wsp,this._grid,this.request.getReplaceFolderReq(folderUri,max))
if(!this._grid||!this.request.isSameStamp(stamp))return false
const hasMore=res.results.length>=max
if(hasMore)this.resetAfterSrcUri()
let last=this.insertInTreeFromSearch(res.columns,res.results,this._datas,true,hasMore)
if(hasMore&&last){while(last){const lastP=this.parent(last)
const ch=lastP?this.ch(lastP):this._datas
const idx=ch.lastIndexOf(last)+1
const toDel=ch.length-idx
if(toDel>0)this.updateDatasInTree(lastP,idx,toDel)
last=lastP}}this.lastError=null
this.listenGridLimits()}catch(e){this.lastError=e
this.setDatas([])
throw e}finally{this._nextSearch=null
if(this.callbackSearching)this.callbackSearching.onSearching("searchEnd")}return true}resetAfterSrcUri(){this._afterSrcUri=null
this._afterEndFolder=false}insertInTreeFromSearch(keys,values,rootDatas,updateGrid,hasMore){if(!this._grid)return
try{this._grid.refreshFreeze(1)
let data
let lastSrcUri
for(let i=0,s=values.length;i<s;i++){const v=values[i]
data={}
for(let k=0;k<keys.length;k++)data[keys[k]]=v[k]
if(this.fieldsFilter&&!this.fieldsFilter(data))continue
lastSrcUri=data.srcUri
this.insertInTree(data,rootDatas,updateGrid)}if(hasMore)this._afterSrcUri=lastSrcUri
return data}finally{this._grid.refreshFreeze(-1)
this._grid.refresh()}}insertInTree(toInsert,inRootDatas,updateGrid){let parent=null
let children=inRootDatas
let offsetInsert=updateGrid?undefined:-1
let countInsert=0
let prevSlash=this.uriRoot?this.showRoot?this.uriRoot.lastIndexOf("/")+1:this.uriRoot.length+1:1
let uriToSplit=toInsert.srcUri
if(ITEM.isAirItem(uriToSplit)||ITEM.isExtItem(uriToSplit)){const i=uriToSplit.lastIndexOf("/")
uriToSplit=uriToSplit.substring(0,i)+"_"+uriToSplit.substring(i+1)}let nextSlash=uriToSplit.indexOf("/",prevSlash)
while(nextSlash>0){const srcUri=uriToSplit.substring(0,nextSlash)
const index=this.findInChildren(children,srcUri)
if(index>=0){parent=children[index]
children=parent.ch
if(children==null){children=parent.ch=[]}}else{const newFolder={srcUri:srcUri,srcSt:ESrcSt.folder,ch:[]}
const index=this.findInsertPoint(children,newFolder)
children.splice(index,0,newFolder)
if(updateGrid){if(offsetInsert===undefined)offsetInsert=this.getOffsetInChildren(parent,children,index)
this._initRowData(newFolder,parent,GridDataHolderJsonTree.defaultOpened)
this.updateSubRowsShown(parent,1)
countInsert++}parent=newFolder
children=newFolder.ch}prevSlash=nextSlash+1
nextSlash=uriToSplit.indexOf("/",prevSlash)}if(updateGrid&&this.findInChildren(children,toInsert.srcUri)>=0)return
const index=this.findInsertPoint(children,toInsert)
children.splice(index,0,toInsert)
if(updateGrid){if(offsetInsert===undefined)offsetInsert=this.getOffsetInChildren(parent,children,index)
this._initRowData(toInsert,parent,GridDataHolderJsonTree.defaultClosed)
this.updateSubRowsShown(parent,1)
countInsert++
if(this._grid&&offsetInsert>=0)this._grid.rowCountChanged(offsetInsert,countInsert)}}}export class SpaceTreeDataSearchLive extends SpaceTreeDataSearch{initSpTrDataLive(place){this.initSpTrDataSearch(new SpaceTreeReqUri(this.wsp).initReq(this.wsp.getShortDescDef(),this.uriRoot),75,150)
if(place)place.eventsMgr.on("wspUriChange",(msg,from)=>{if(this.wsp.code!==msg.wspCd)return
const srcUri=!this.hideItemFolderContent&&msg.shortDesc?msg.shortDesc.srcUri:msg.srcUri
if(ITEM.isSpecialUri(srcUri))return
const node=this.findRowKeyBySrcUri(srcUri)
if(node){if(this.shouldHideEntry(msg,node)){this.deleteRowKey(node)}else if(msg.type===EWspChangesEvts.u&&ITEM.getSrcUriType(srcUri)==="space"){this.fetchSearchReplaceChildren(srcUri)}else{this.refreshRowKey(node)}}else if(ITEM.getSrcUriType(srcUri)==="space"){if(msg.type===EWspChangesEvts.u){if(!this._afterSrcUri||this.wsp.srcUriItemsSortFn(srcUri,this._afterSrcUri)<=0){this.fetchSearchReplaceChildren(srcUri)}}}else if(this.request.isSrcUriMustBeIncluded(srcUri)&&!this.shouldHideEntry(msg)){this.insertSrcUriInTree(srcUri,msg.shortDesc)}})
if(place)place.eventsMgr.on("onConnectionRenewed",()=>{this.fetchSearchStart()})
return null}async fetchSrcUri(srcUri){if(!this.request.isSrcUriMustBeIncluded(srcUri))return false
let guard=0
while(this._afterSrcUri&&this.wsp.srcUriItemsSortFn(srcUri,this._afterSrcUri)>0&&guard<100){await this.fetchSearchNext(2e3)
guard++}return true}async fetchSrcUris(srcUris){let guard=0
for(const srcUri of srcUris){if(!this.request.isSrcUriMustBeIncluded(srcUri))continue
while(this._afterSrcUri&&this.wsp.srcUriItemsSortFn(srcUri,this._afterSrcUri)>0&&guard<100){await this.fetchSearchNext(2e3)
guard++}}}async insertSrcUriInTree(srcUri,shortDesc){const fields=shortDesc||await this.wsp.fetchShortDesc(srcUri,this._grid)
if(this.fieldsFilter&&!this.fieldsFilter(fields))return
if(this._nextSearch)await this._nextSearch
if(this.request.isSrcUriMustBeIncluded(srcUri))this.insertInTree(Object.assign(Object.create(null),fields),this._datas,true)}}export class SpaceTreeReqUri{constructor(wsp){this.wsp=wsp}static buildSrcUriPattern(text){const slash=text.indexOf("/")
if(slash>=1){const space=text.substring(0,slash)
text=text.substring(slash+1)
return new RegExp(`.*${LANG.escape4RegexpFuzzy(space)}.*/.*${LANG.escape4RegexpFuzzy(text)}[^/]*`,"i")}return new RegExp(`.*${LANG.escape4RegexpFuzzy(text)}[^/]*`,"i")}initReq(fields,uriRoot){this.uriRoot=uriRoot
const mainCrit=(new SearchItems).excludeTildeRoot().includeDrfErased(this.wsp.wspDefProps.drfRefWsp!=null)
this._req=JSX.asXml(()=>JSX.createElement("request",null,JSX.createElement("select",null,Array.isArray(fields)?fields.map(f=>JSX.asXml(()=>JSX.createElement("column",{dataKey:f}))):JSX.createElement("columns",{dataKeys:fields})),JSX.createElement("where",null,mainCrit.toDom(),JSX.createElement("exp",{type:"RegexpUri"}))))
this._itemsExp=this._req.querySelector("exp[type=Items]")
if(uriRoot)this._itemsExp.setAttribute("beforeEndFolder",uriRoot+"/")
this._srcUriExp=this._itemsExp.nextElementSibling
this._selectReq=this._req.firstElementChild
return this}updateParams(params){const newTxt=params.uriFilter.toLowerCase()
if(this._textToSearch===newTxt)return false
this._textToSearch=newTxt
this._lastRegexpFetch=SpaceTreeReqUri.buildSrcUriPattern(newTxt)
return true}getStartReq(max){this._srcUriExp.setAttribute("regexp",`(?i)${this._lastRegexpFetch.source}`)
this._selectReq.setAttribute("max",max.toString())
if(this.uriRoot)this._itemsExp.setAttribute("afterUri",this.uriRoot+"/")
else this._itemsExp.removeAttribute("afterUri")
this._itemsExp.removeAttribute("beforeEndFolder")
return DOM.ser(this._req)}getNextReq(afterSrcUri,max){this._selectReq.setAttribute("max",max.toString())
this._itemsExp.setAttribute("afterUri",afterSrcUri)
this._itemsExp.removeAttribute("beforeEndFolder")
return DOM.ser(this._req)}getReplaceFolderReq(folderUri,max){this._selectReq.setAttribute("max",max.toString())
const path=folderUri+"/"
this._itemsExp.setAttribute("afterUri",path)
this._itemsExp.setAttribute("beforeEndFolder",path)
return DOM.ser(this._req)}getStamp(){return this._lastRegexpFetch}isSameStamp(stamp){return stamp===this._lastRegexpFetch}isSrcUriMustBeIncluded(srcUri){if(this.uriRoot&&!SRC.isSubUri(this.uriRoot,srcUri))return false
return this._lastRegexpFetch?this._lastRegexpFetch.test(srcUri):false}}const rowDropMgr={onDragOverRow(ev,grid,row,line){ev.dataTransfer.dropEffect="none"
if(row&&row.rowDatas.srcSt!==ESrcSt.folder)return EGridDropPos.none
const spaceTree=DOMSH.findHost(grid)
const srcFields=row?row.rowDatas:spaceTree.datas.rootSrcFields
if(!srcFields)return EGridDropPos.none
const srcUriType=ITEM.getSrcUriType(srcFields.srcUri)
if(spaceTree.datas.hideItemFolderContent){if(srcUriType!=="space")return EGridDropPos.none}else{if(srcUriType==="item"&&!spaceTree.wsp.wspMetaUi.getItemType(srcFields.itModel).isFamily(EItemTypeFamily.folder,EItemTypeFamily.undef,EItemTypeFamily.other)){return EGridDropPos.none}}if(!spaceTree.reg.hasPermission("action.src#importTo",srcFields.srcRoles,undefined,srcFields.srcRi)){return EGridDropPos.none}const transfer=ITEM.getShortDescsTransferFromDragSession(spaceTree.reg,ev.dataTransfer,{targetSrcType:srcUriType==="space"?"itemOrSpace":"res",canCreate:true},grid)
const ctx={shortDescs:[srcFields],reg:spaceTree.reg,emitter:grid,me:spaceTree}
const act=SpaceTreePaste.getProxiedAction(ctx,transfer,!ACTION.isCopyOverMove(ev))
if(!act)return EGridDropPos.none
ctx.shortDescs=transfer.shortDescs
if(act&&act.isAvailable(ctx)){ev.dataTransfer.dropEffect=act.isMove?"move":"copy"
return EGridDropPos.over}return EGridDropPos.none},async dropOnRow(ev,grid,row,line,pos){const spaceTree=DOMSH.findHost(grid)
const srcFields=row?row.rowDatas:spaceTree.datas.rootSrcFields
const transfer=ITEM.getShortDescsTransferFromDragSession(spaceTree.reg,ev.dataTransfer,{targetSrcType:ITEM.getSrcUriType(srcFields.srcUri)==="space"?"itemOrSpace":"res",canCreate:true},grid)
const ctx={shortDescs:[srcFields],reg:spaceTree.reg,emitter:grid,me:spaceTree}
const act=SpaceTreePaste.getProxiedAction(ctx,transfer,!ACTION.isCopyOverMove(ev))
if(act){if(transfer.extractDatasNow)await transfer.extractDatasNow(ev.dataTransfer)
ctx.shortDescs=transfer.shortDescs
act.executeIfAvailable(ctx,ev)}else{POPUP.showNotifInfo(`Format non autorisé`,line)}}}
export class SpaceTreeFocusItem extends FocusItemOrSpace{getLabel(ctx){return ctx.currentDatas.getRowKeyFolderState(ctx.shortDescs[0])===EFolderState.opened?"Refermer cet espace":super.getLabel(ctx)}async execute(ctx,ev){var _a
if(ITEM.getSrcUriType((_a=ctx.shortDescs[0])===null||_a===void 0?void 0:_a.srcUri)==="space"){ctx.currentDatas.toggleFolder(ctx.shortDescs[0])}else if(ctx._currentSrcUri===ctx.shortDescs[0].srcUri){const wsp=ctx.reg.env.wsp
return wsp.wspServer.wspsLive.reloadHouse(WSP.buildWspRef(wsp.code,ctx.shortDescs[0]))}else{super.execute(ctx,ev)}}}export class SpaceTreeCreateItem extends CreateItem{async execute(ctx,ev){var _a,_b
const sd=await super.execute(ctx,ev)
ctx.emitter.focus()
if(sd){if(await ctx.selectSrcUri(sd.srcUri)){(_a=ctx.grid.defaultAction)===null||_a===void 0?void 0:_a.executeIfAvailable(ctx)}else{(_b=ctx.reg.env.infoBroker)===null||_b===void 0?void 0:_b.dispatchInfo(new InfoFocusItem(SRC.srcRef(sd),sd),ctx.reg.env.uiRoot)}}return sd}}export class SpaceTreeCreateSpace extends CreateSpace{async execute(ctx,ev){const shortDesc=await super.execute(ctx,ev)
ctx.emitter.focus()
if(shortDesc&&await ctx.selectSrcUri(shortDesc.srcUri)&&ctx.grid.defaultAction)ctx.grid.defaultAction.executeIfAvailable(ctx)
return shortDesc}getParentSpace(ctx,ev){return super.getParentSpace(ctx,ev)||ctx.uriRoot||""}}export class SpaceTreeRename extends RenameSrc{async execute(ctx,ev){const newUris=await super.execute(ctx,ev)
ctx.emitter.focus()
if(newUris){setTimeout(()=>{ctx.me.selectSrcUris(newUris)
openUri(newUris,ctx)},300)}return newUris}}export class SpaceTreeDuplicate extends DuplicateSrc{async execute(ctx,ev){const newUris=await super.execute(ctx,ev)
if(newUris){setTimeout(()=>{ctx.emitter.focus()
ctx.me.selectSrcUris(newUris)
openUri(newUris,ctx)},300)}return newUris}}export class SpaceTreeCopyTo extends CopyToSrc{async execute(ctx,ev){const newUris=await super.execute(ctx,ev)
ctx.emitter.focus()
if(newUris){setTimeout(()=>{ctx.me.selectSrcUris(newUris)
openUri(newUris,ctx)},300)}return newUris}}export class SpaceTreeImportTo extends ImportItemsToSrc{async execute(ctx,ev){const newSrcs=await super.execute(ctx,ev)
ctx.emitter.focus()
if(newSrcs){await ctx.me.selectSrcUris(newSrcs.map(s=>s.srcUri))}return newSrcs}}export class SpaceTreeMoveTo extends MoveToSrc{async execute(ctx,ev){const newUris=await super.execute(ctx,ev)
ctx.emitter.focus()
if(newUris){setTimeout(()=>{ctx.me.selectSrcUris(newUris)
openUri(newUris,ctx)},300)}return newUris}}function openUri(newUris,ctx){if(newUris.length===1&&ctx.infoBroker){const uri=newUris[0]
if(ITEM.getSrcUriType(uri)==="item")ctx.infoBroker.dispatchInfo(new InfoFocusItem(uri),ctx.me)}}export class SpaceTreePaste extends SrcAction{constructor(){super("paste")
this._label="Coller"
this._group="clipboard"}static getProxiedAction(ctx,transfer,preferMove){var _a,_b
if(!transfer)return null
if(Array.isArray(transfer)){const bestType=WriteMainStreamToSrc.findBestType(ctx,transfer)
if(bestType)return new WriteMainStreamToSrc(transfer[0].getType(bestType))
const spaceUri=((_a=ctx.shortDescs[0])===null||_a===void 0?void 0:_a.srcUri)||""
const clipboardItem=transfer[0]
if(clipboardItem&&ITEM.getSrcUriType(spaceUri)==="space"){const svc=ctx.reg.getSvc("wspImportInWsp")
if(svc){const types=clipboardItem.types
let bestCtType
let bestScore=0
for(const itemType of ctx.reg.env.wsp.wspMetaUi.getItemTypes()){for(const t of types){const score=itemType.matchType(t)
if(score>bestScore){bestScore=score
bestCtType=t}}}if(bestCtType){const promiseBody=clipboardItem.getType(bestCtType)
const spaceTree=ctx.me
const uiCtx=ctx.emitter
return new SrcAction("paste").setLabel("Coller (importer)...").requireSrcEnabledPerm("action.src#importTo").setExecute(async ctx=>{var _a,_b
const newSrc=await svc.importSrc(await promiseBody,{targetSrcType:"item",defaultUriParent:spaceUri},ctx.reg,uiCtx)
if(newSrc){if(await spaceTree.selectSrcUri(newSrc.srcUri)){(_a=spaceTree.grid.defaultAction)===null||_a===void 0?void 0:_a.executeIfAvailable(ctx)}else{(_b=ctx.reg.env.infoBroker)===null||_b===void 0?void 0:_b.dispatchInfo(new InfoFocusItem(SRC.srcRef(newSrc),newSrc),ctx.reg.env.uiRoot)}}return newSrc})}}}return null}if(!transfer.isImport&&!(((_b=transfer.shortDescs)===null||_b===void 0?void 0:_b.length)>0)){if(transfer.server!==ctx.reg.env.universe.config.universeUrl.url){return new Action("paste").setLabel("Coller (d\'un autre entrepôt)").setDescription("Il est impossible d\'exploiter des items d\'un autre entrepôt.").setEnabled(false)}return null}if(transfer.shortDescs.findIndex(src=>TASK.isTask(src))>=0){return null}const targetUri=ctx.me.extractFolderUri(ctx.shortDescs[0])
const targetSrcFields=ctx.me.extractFolderSrcFields(ctx.shortDescs[0])
const targetWsp=ctx.reg.env.wsp
if(transfer.wspCd&&transfer.wspCd!==targetWsp.code){return new Action("paste").setLabel("Coller (d\'un autre atelier)").setExecute(async ctx=>{const svcImportInterWsp=ctx.reg.getSvc("wspImportInterWsp")
if(!svcImportInterWsp){POPUP.showNotifInfo("Coller des contenus issus d\'un autre atelier est impossible.",ctx.emitter)}else{const newSrcUris=[]
const opts={refExtItemAcceptable:false,defaultUriParent:targetUri,uriParentFrozen:true,allowReplace:true,repeatedImports:transfer.shortDescs.length>0?{}:undefined}
for(const sd of transfer.shortDescs){const result=await svcImportInterWsp.importSrc(transfer.wsp,sd,opts,ctx.reg,ctx.emitter)
if(!result)break
newSrcUris.push(result.srcUri)}ctx.emitter.focus()
if(newSrcUris.length>0)await ctx.me.selectSrcUris(newSrcUris)}})}if(transfer.isImport){return new SpaceTreeImportTo(transfer).setTarget(targetUri,"hide")}if(transfer.shortDescs.findIndex(src=>SRC.extractUriParent(src.srcUri)!==targetUri)<0){return new SpaceTreeDuplicate("paste").setLabel("Coller (dupliquer)...")}if(transfer.shortDescs.length===1&&transfer.shortDescs[0].srcUri===targetUri){return new SpaceTreeDuplicate("paste").setLabel("Coller (dupliquer)...")}if(CopyToSrc.makeTargetFilter(transfer.shortDescs)(targetUri)){if(preferMove){return new SpaceTreeMoveTo("paste").setTarget(targetSrcFields||targetUri,"hide").setLabel("Coller (déplacer)")}else{return new SpaceTreeCopyTo("paste").setTarget(targetSrcFields||targetUri,"hide").setLabel("Coller (recopier)")}}return null}isEnabled(ctx){return ctx.isCtxInitialized?super.isEnabled(ctx):false}buildCustomButton(ctx,uiContext,parent){return uiContext==="bar"?null:undefined}async initButtonNode(buttonNode,ctx){if(buttonNode instanceof ActionBtn){if(!this.pendingBtns)this.pendingBtns=[buttonNode]
else this.pendingBtns.push(buttonNode)
if(!this.pending){this.pending=ITEM.getShortDescsTransferFromClipboard(ctx.reg.env.wsp,ctx.emitter)
try{const srcs=await this.pending
if(srcs===false){POPUP.showNotifWarning("L\'accès au presse-papier n\'est pas autorisé par votre navigateur. Modifiez les paramètres du site pour rendre opérationnelles les fonctions de copier/coller.",buttonNode)}else if(this.pendingBtns)for(const btn of this.pendingBtns){btn.action.updateButton(btn,srcs)}}finally{this.pendingBtns=null
this.pending=null}}}}updateButton(btn,transfer){const action=SpaceTreePaste.getProxiedAction(btn.actionContext,transfer)
if(action){const newCtx=Object.create(btn.actionContext)
if("shortDescs"in transfer)newCtx.shortDescs=transfer.shortDescs
btn.resetAction(action,newCtx)}}async execute(ctx,ev){const transfer=await ITEM.getShortDescsTransferFromClipboard(ctx.reg.env.wsp,ctx.emitter)
if(!transfer)return
const action=SpaceTreePaste.getProxiedAction(ctx,transfer)
if(action==null)return
const newCtx=Object.create(ctx)
Object.defineProperty(newCtx,"me",{value:ctx.me})
if("shortDescs"in transfer)newCtx.shortDescs=transfer.shortDescs
action.executeIfAvailable(newCtx,ev)}isAvailable(ctx){return true}}export class SpaceTreePasteMove extends SpaceTreeMoveTo{constructor(ctrl){super("pasteMove")
this.ctrl=ctrl
this._label="Coller (déplacer)"
this._group="clipboard"
this.atLeastOne=false}isEnabled(ctx){return ctx.isCtxInitialized?super.isEnabled(ctx):false}buildCustomButton(ctx,uiContext,parent){return uiContext==="bar"?null:undefined}initButtonNode(buttonNode,ctx){this.ctrl.initButtonNode(buttonNode,ctx)}updateButton(btn,transfer){if(!transfer||Array.isArray(transfer))return
if(!transfer.shortDescs||transfer.shortDescs.length===0||transfer.isImport)return
if(transfer.shortDescs.findIndex(src=>TASK.isTask(src))>=0)return
const sourceCtx=Object.create(btn.actionContext)
if("shortDescs"in transfer)sourceCtx.shortDescs=transfer.shortDescs
sourceCtx.isCtxInitialized=true
btn.resetAction(btn.action,sourceCtx)
if(!this.isEnabled(sourceCtx))return
const targetCtx=btn.actionContext
if(targetCtx.reg.env.wsp.code!==transfer.wspCd)return
const targetUri=targetCtx.me.extractFolderUri(targetCtx.shortDescs[0])
if(!MoveToSrc.makeTargetFilter(transfer.shortDescs)(targetUri))return
btn.disabled=false}async execute(ctx,ev){const targetUri=ctx.me.extractFolderUri(ctx.shortDescs[0])
const transfer=await ITEM.getShortDescsTransferFromClipboard(ctx.reg.env.wsp,ctx.emitter)
if(!transfer||Array.isArray(transfer))return null
if(!transfer.shortDescs||transfer.shortDescs.length===0)return null
if(transfer.shortDescs.findIndex(src=>TASK.isTask(src))>=0)return null
this.setTarget(targetUri,"hide")
const newCtx=Object.create(ctx)
newCtx.shortDescs=transfer.shortDescs
return super.execute(newCtx,ev)}isAvailable(ctx){return true}}export class SpaceTreeCollapseAllAction extends WspAction{constructor(id){super(id||"collapseAll")
this._label="Tout refermer"
this._group="open"}isVisible(ctx){if(ctx.shortDescs.length==1)return false
const datas=ctx.me.currentDatas
if((ctx.shortDescs.length===0?datas.getDatas():ctx.shortDescs).findIndex(sd=>datas.getRowKeyFolderState(sd)===EFolderState.opened)<0)return false
return super.isVisible(ctx)}execute(ctx,ev){ctx.me.currentDatas.closeAllFolders(ctx.shortDescs.length>0?ctx.shortDescs:undefined,false)}}export class CellBuilderSpaceTree extends CellBuilderSrcIconCodeTitle{constructor(spaceTree){super(spaceTree.reg,spaceTree.wsp.wspMetaUi,false,spaceTree.wsp.srcUriItemsSortFn)
this.spaceTree=spaceTree}redrawCell(row,root){root._srcFields=row.rowDatas
let span=root.firstElementChild
if(!span)span=this._buildContent(row,root)
this.redrawIcon(row,span)
span=span.nextElementSibling
DOM.setTextContent(span,this._getValue(row))
span=span.nextElementSibling
DOM.setTextContent(span,this.spaceTree.showTitleLive?this._getTitle(row):null)}}const DEBUG=false

//# sourceMappingURL=spaceTree.js.map