import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{EWspChangesEvts,WspsLivePlace}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{ESrcSt,SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{InfoCurrentItem,InfoHighlighItemSgn,InfoReqCurrentItem,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{Grid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{GridDataHolderJsonArray}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{isColSearchBuilder}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
import{CellBuilderSrcIconCodeTitle,redrawSrcLine}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcGridColumns.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{GridArrayToTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
export class SrcGrid extends Grid{constructor(){super(...arguments)
this.shortDescs=[]}get categorizer(){return this._treeView?this._treeView.categorizer:null}setCategorizer(categorizer,target){if(categorizer){if(!this._treeView)this._treeView=new GridArrayToTree(target).setProvider(this.srcGridDatas)
this._treeView.setCategorizer(categorizer)
this.dataHolder=this._treeView.target}else if(this._treeView){this._treeView.setProvider(null)
this._treeView=null
this.dataHolder=this.srcGridDatas}}selectSrcUri(srcUri){return this._selectRowKey(this.srcGridDatas.findRowKeyBySrcUri(srcUri))}selectSrcId(srcId){return this._selectRowKey(this.srcGridDatas.findRowKeyBySrcId(srcId))}_selectRowKey(rowKey){if(!rowKey)return false
if(this._treeView&&this._treeView.categorizer){const id=this._treeView.categorizer.getId(rowKey)
rowKey=this._treeView.getTargetEntryById(id)}const offset=this.dataHolder.getOffset(rowKey)
if(offset<0)return false
this.setSelectedRows(offset)
return true}_initialize(init){this.config=init||{}
this.reg=this.findReg(init)
this.wsp=this.reg.env.wsp
if(!this.config.place)this.config.place=this.reg.env.place
if(!init.dataHolder)init.dataHolder=new SrcGridDatas
if(!init.selType)init.selType="multi"
if(!init.columnDefs)init.columnDefs=this.getDefaultColumnDefs()
init.defaultActionCtx=this
this.infoBroker=init.itemHandlingReact
if(!("lineDrawer"in init))init.lineDrawer=this
this.srcGridDatas=init.dataHolder
super._initialize(init)
this.addEventListener("grid-select",(function(ev){this.shortDescs=this.dataHolder.getSelectedDatas()
if(this.matches(":focus"))this.dispatchEvent(new CustomEvent("c-focus-actions",{detail:this,bubbles:true,composed:true}))}))
if(init.actions)this.actions=ACTION.injectSepByGroup(init.actions,this.reg.getPref("groupOrder.wsp.shortDesc",""),this)
if(init.accelKeyMgr){this.accelKeyMgr=init.accelKeyMgr
this.addEventListener("keydown",ev=>{this.accelKeyMgr.handleKeyboardEvent(ev,this)})}if(init.itemHandlingReact){const req=new InfoReqCurrentItem
init.itemHandlingReact.dispatchInfo(req,this)
if(req.srcUri)this.setCurrentSrcUri(req.srcUri)}if(init.draggable){this.linesNode.setAttribute("draggable","true")
this.linesNode.addEventListener("dragstart",(function(ev){ITEM.setShortDescTransferToDragSession(DOMSH.findHost(this),ev,"build")}))
this.linesNode.addEventListener("dragend",ITEM.resetShortDescTransferToDragSession)}}getDefaultColumnDefs(){return[new GridColDef("srcCode").setDefaultSort(1,"ascendant").setFlex("1rem",1,1).setMinWidth("8em").setSortable(true).setCellBuilder(new CellBuilderSrcIconCodeTitle(this.reg,this.wsp.wspMetaUi,false,this.wsp.srcUriItemsSortFn))]}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
if(this.hasAttribute("actions"))init.actions=this.reg.mergeLists(...BASIS.extractAttr(this,"actions").split(" "))
return init}connectedCallback(){super.connectedCallback()
if(this.infoBroker)this.infoBroker.addConsumer(this)
if(this.config.place instanceof WspsLivePlace&&this._refreshFreeze===0){this._lstn=this.onWspUriChange.bind(this)
this.config.place.eventsMgr.on("wspUriChange",this._lstn)}}disconnectedCallback(){if(this.infoBroker)this.infoBroker.removeConsumer(this)
if(this.config.place instanceof WspsLivePlace&&this._refreshFreeze===0)this.config.place.eventsMgr.removeListener("wspUriChange",this._lstn)}onWspUriChange(msg,from){if(msg.type===EWspChangesEvts.u||msg.type===EWspChangesEvts.lcSt||msg.type===EWspChangesEvts.drfState||msg.type===EWspChangesEvts.drvState){const rowKey=this.srcGridDatas.findRowKeyBySrcUri(msg.srcUri)
if(rowKey){if(this.config.onWspUriChangeScope=="longDesc"){this.wsp.fetchLongDesc(SRC.srcRef(msg)).then(sd=>{this.srcGridDatas.refreshFields(rowKey,sd)})}else this.wsp.fetchShortDesc(SRC.srcRef(msg)).then(sd=>{this.srcGridDatas.refreshFields(rowKey,sd)})}}else if(msg.type===EWspChangesEvts.s){const rowKey=this.srcGridDatas.findRowKeyBySrcUri(msg.srcUri)
if(rowKey)this.srcGridDatas.refreshItSt(rowKey,msg.itSt)}else if(msg.type===EWspChangesEvts.r){this.srcGridDatas.removeBySrcUri(msg.srcUri)}}ensureRowVisibleByUri(srcUri){const rowKey=this.srcGridDatas.findRowKeyBySrcUri(srcUri)
if(rowKey)this.ensureRowVisible(this.dataHolder.getOffset(rowKey))
return rowKey!=null}setCurrentSrcUri(srcUri){if(this._currentSrcUri===srcUri)return
this._currentSrcUri=srcUri
this.invalidateRows()}setHighlightSgn(sgnPattern,assigned){this._highlightSgn=sgnPattern
this._assigned=assigned
this.invalidateRows()}redrawLine(row,line){redrawSrcLine(this.wsp,row.rowKey,line,this._currentSrcUri,this._highlightSgn,this._assigned)}get focusActionables(){if(!this._focusActionables&&this.actions)this._focusActionables=ActionBtn.buildButtons(this.actions,this,"bar")
return this._focusActionables}get ctxMenuActions(){return{actions:this.actions,actionContext:this,rect:this.getSelRect()}}fillSearchColumns(map){this.wsp.getShortDescFields().forEach(f=>{map.set(f,null)})
if(this.columns)for(const col of this.columns){if(isColSearchBuilder(col.cellBuilder))col.cellBuilder.fillSearchColumns(map)
else if(col.cellBuilder&&"dataKey"in col.cellBuilder)map.set(col.cellBuilder.dataKey,null)}}onInfo(info){if(info instanceof InfoCurrentItem){this.setCurrentSrcUri(info.srcUri)}else if(info instanceof InfoHighlighItemSgn){this.setHighlightSgn(info.sgnPattern,info.assigned)}}get me(){return this}get emitter(){return this}}REG.reg.registerSkin("wsp-src-grid",1,`\n\t.highlight {\n\t\tbackground-color: var(--row-highlight-bgcolor);\n\t}\n\n\t.assigned {\n\t\tbackground-color: var(--row-assigned-bgcolor);\n\t}\n\n\t.current {\n\t\tbackground-position: right;\n\t\tbackground-repeat: no-repeat;\n\t\tbackground-image: var(--row-current-img-end);\n\t\tbackground-color: var(--row-current-bgcolor);\n\t}\n`)
customElements.define("wsp-src-grid",SrcGrid)
export class SrcGridDatas extends GridDataHolderJsonArray{constructor(){super()}findRowKeyBySrcUri(srcUri){if(this.useLiveSrcUri){for(const d of this._datas)if(d.srcLiveUri===srcUri||d.srcUri===srcUri)return d}else{for(const d of this._datas)if(d.srcUri===srcUri)return d}return null}findRowKeyBySrcId(srcId){for(const d of this._datas)if(d.srcId===srcId)return d
return null}removeBySrcUri(srcUri){for(let i=this._datas.length-1;i>=0;i--){if(SRC.isSubUriOrEqual(srcUri,this._datas[i].srcUri)){this.updateDatas(i,1)}}}refreshFields(rowKey,newFields){const idx=this.getOffset(rowKey)
if(idx>=0){if(newFields.srcSt===ESrcSt.none){this.updateDatas(idx,1)}else{this.updateDatas(idx,1,Object.assign(Object.create(null),newFields))}}}refreshItSt(rowKey,itSt){if(this.onWillUpdate){const idx=this.getOffset(rowKey)
if(idx>=0){const clone=Object.assign(Object.create(null),rowKey)
clone.itSt=itSt
this.updateDatas(idx,1,clone)}}else{rowKey["itSt"]=itSt
this.resetRowCache(rowKey)
const grid=this.grid
if(grid)grid.invalidateRows()}}}
//# sourceMappingURL=srcGrid.js.map