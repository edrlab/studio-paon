import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{Grid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{GridDataHolderJsonArray}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{GridArrayToTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{URLTREE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/urlTree.js"
import{InfoCurrentRes}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/res.js"
import{CellBuilderResIconName,redrawResLine}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/widgets/resGridColumns.js"
export class ResGrid extends Grid{constructor(){super(...arguments)
this.resList=[]}get categorizer(){return this._treeView?this._treeView.categorizer:null}setCategorizer(categorizer,target){if(categorizer){if(!this._treeView)this._treeView=new GridArrayToTree(target).setProvider(this.resGridDatas)
this._treeView.setCategorizer(categorizer)
this.dataHolder=this._treeView.target}else if(this._treeView){this._treeView.setProvider(null)
this._treeView=null
this.dataHolder=this.resGridDatas}}selectResPath(resPath){return this._selectRowKey(this.resGridDatas.findRowKeyByResPath(resPath))}_selectRowKey(rowKey){if(!rowKey)return false
if(this._treeView&&this._treeView.categorizer){const id=this._treeView.categorizer.getId(rowKey)
rowKey=this._treeView.getTargetEntryById(id)}const offset=this.dataHolder.getOffset(rowKey)
if(offset<0)return false
this.setSelectedRows(offset)
return true}_initialize(init){this.config=init||{}
this.reg=this.findReg(init)
if(!init.dataHolder)init.dataHolder=(new ResGridDatas).setDatas([])
if(!init.selType)init.selType="multi"
if(!init.columnDefs)init.columnDefs=this.getDefaultColumnDefs()
if(!init.defaultActionCtx)init.defaultActionCtx=this
this.infoBroker=init.infoBroker
this.resHandling=init.resHandlingReact
if(!("lineDrawer"in init))init.lineDrawer=this
this.resGridDatas=init.dataHolder
super._initialize(init)
this.addEventListener("grid-select",(function(ev){this.resList=this.dataHolder.getSelectedDatas()
if(this.matches(":focus"))this.dispatchEvent(new CustomEvent("c-focus-actions",{detail:this,bubbles:true,composed:true}))}))
if(init.actions)this.actions=ACTION.injectSepByGroup(init.actions,this.reg.getPref("groupOrder.store.res",""),this)
if(init.accelKeyMgr){this.accelKeyMgr=init.accelKeyMgr
this.addEventListener("keydown",ev=>{this.accelKeyMgr.handleKeyboardEvent(ev,this)})}if(init.draggable){console.log("TODO:::OResGridInit.draggable")}}getDefaultColumnDefs(){return[new GridColDef("resName").setDefaultSort(1,"ascendant").setFlex("1rem",1,1).setMinWidth("8em").setSortable(true).setCellBuilder(new CellBuilderResIconName(this.reg,false))]}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
if(this.hasAttribute("actions"))init.actions=this.reg.mergeLists(...BASIS.extractAttr(this,"actions").split(" "))
return init}connectedCallback(){super.connectedCallback()
if(this.resHandling)this.resHandling.addConsumer(this)
if(this.config.listenChanges&&this.reg.env.depotEvents){this.reg.env.depotEvents.on("resChange",this._resChange=m=>{console.trace("TODO:::")})
this.reg.env.depotEvents.on("connOpened",this._connOpened=()=>{console.trace("TODO:::")})}}disconnectedCallback(){if(this.resHandling)this.resHandling.removeConsumer(this)
if(this.config.listenChanges&&this.reg.env.depotEvents){this.reg.env.depotEvents.removeListener("resChange",this._resChange)
this._resChange=null
this.reg.env.depotEvents.removeListener("connOpened",this._connOpened)
this._connOpened=null}}ensureRowVisibleByResPath(resPath){const rowKey=this.resGridDatas.findRowKeyByResPath(resPath)
if(rowKey)this.ensureRowVisible(this.dataHolder.getOffset(rowKey))
return rowKey!=null}setCurrentResPath(resPath){if(this._currentResPath===resPath)return
this._currentResPath=resPath
this.invalidateRows()}redrawLine(row,line){redrawResLine(this.reg,row,line,this._currentResPath)}get focusActionables(){if(!this._focusActionables&&this.actions)this._focusActionables=ActionBtn.buildButtons(this.actions,this,"bar")
return this._focusActionables}get ctxMenuActions(){return{actions:this.actions,actionContext:this,rect:this.getSelRect()}}onInfo(info){if(info instanceof InfoCurrentRes){this.setCurrentResPath(info.resPath)}}get me(){return this}get emitter(){return this}}REG.reg.registerSkin("store-res-grid",1,`\n\t.current {\n\t\tbackground-position: right;\n\t\tbackground-repeat: no-repeat;\n\t\tbackground-image: var(--row-current-img-end);\n\t\tbackground-color: var(--row-current-bgcolor);\n\t}\n\n\t.unlisted > .cell {\n\t\tbackground-position: bottom .2em right .2em;\n\t\tbackground-repeat: no-repeat;\n\t\tbackground-size: .7em;\n\t\tbackground-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/states/limited.svg);\n\t}\n\n\t.trashed > .cell {\n\t\tbackground-position: bottom .2em right .2em;\n\t\tbackground-repeat: no-repeat;\n\t\tbackground-size: .7em;\n\t\tbackground-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/states/invisible.svg);\n\t}\n`)
customElements.define("store-res-grid",ResGrid)
export class ResGridDatas extends GridDataHolderJsonArray{constructor(){super()}findRowKeyByResPath(resPath){for(const d of this._datas)if(d.permaPath===resPath)return d
return null}removeByResPath(resPath,anyLeafVersion){if(anyLeafVersion)resPath=URLTREE.extractUnversionedLeafPath(resPath)
for(let i=this._datas.length-1;i>=0;i--){if(URLTREE.isDescendantPathOrEqual(resPath,this._datas[i].permaPath,anyLeafVersion)){this.updateDatas(i,1)}}}refreshOrInsertNode(nodeProps,anyLeafVersion){const resPath=anyLeafVersion?URLTREE.extractUnversionedLeafPath(nodeProps.permaPath):nodeProps.permaPath
for(let i=0;i<this._datas.length;i++){if(URLTREE.isDescendantPathOrEqual(resPath,this._datas[i].permaPath,anyLeafVersion)){this.updateDatas(i,1,Object.assign(Object.create(null),nodeProps))
return}}const idx=this.findInsertPoint(this._datas,nodeProps)
if(idx>=0)this.updateDatas(idx,0,Object.assign(Object.create(null),nodeProps))}refreshFields(rowKey,newProps){const idx=this.getOffset(rowKey)
if(idx>=0)this.updateDatas(idx,1,Object.assign(Object.create(null),newProps))}}
//# sourceMappingURL=resGrid.js.map