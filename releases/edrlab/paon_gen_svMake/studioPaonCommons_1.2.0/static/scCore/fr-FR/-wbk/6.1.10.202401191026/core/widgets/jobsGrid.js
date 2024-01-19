import{BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{CellBuilderString,GridDataHolderJsonArray}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{Grid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{GridArrayToTree,GridDataHolderJsonTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
export class JobsGrid extends Grid{get categorizer(){return this._treeView?this._treeView.categorizer:null}setCategorizer(categorizer,target){if(categorizer){if(!this._treeView)this._treeView=new GridArrayToTree(target).setProvider(this.jobsGridDatas)
this._treeView.setCategorizer(categorizer)
this.dataHolder=this._treeView.target}else if(this._treeView){this._treeView.setProvider(null)
this._treeView=null
this.dataHolder=this.jobsGridDatas}}async _initialize(init){this.config=init||{}
this.reg=this.findReg(init)
if(!init.dataHolder)init.dataHolder=new JobGridDatas
this.dataHolder=new GridDataHolderJsonTree("children")
if(!init.selType)init.selType="multi"
if(!init.columnDefs)init.columnDefs=this.getDefaultColumnDefs()
init.defaultActionCtx=this
if(!("lineDrawer"in init))init.lineDrawer=this
this.jobsGridDatas=init.dataHolder
super._initialize(init)
if(this.localName!=="server-jobs-grid")this.findReg(init).installSkin("server-jobs-grid",this.shadowRoot)
this.addEventListener("grid-select",(function(ev){this.jobs=this.dataHolder.getSelectedDatas()
if(this.matches(":focus"))this.dispatchEvent(new CustomEvent("c-focus-actions",{detail:this,bubbles:true,composed:true}))
if(init.selectAction)init.selectAction.executeIfAvailable(this)}))
if(init.actions)this.actions=ACTION.injectSepByGroup(init.actions,this.reg.getPref("groupOrder.jobs",""),this)
if(init.accelKeyMgr){this.accelKeyMgr=init.accelKeyMgr
this.addEventListener("keydown",ev=>{this.accelKeyMgr.handleKeyboardEvent(ev,this)})}}getDefaultColumnDefs(){return[new GridColDef("id").setDefaultSort(1,"ascendant").setFlex("1rem",1,1).setMinWidth("8em").setSortable(true).setCellBuilder(new CellBuilderString("id"))]}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
if(this.hasAttribute("actions"))init.actions=this.reg.mergeLists(...BASIS.extractAttr(this,"actions").split(" "))
return init}selectJobId(id){return this._selectRowKey(this.jobsGridDatas.findRowKeyByJobId(id))}_selectRowKey(rowKey){if(!rowKey)return false
if(this._treeView&&this._treeView.categorizer){const id=this._treeView.categorizer.getId(rowKey)
rowKey=this._treeView.getTargetEntryById(id)}const offset=this.dataHolder.getOffset(rowKey)
if(offset<0)return false
this.setSelectedRows(offset)
return true}ensureRowVisibleByJobId(id){const rowKey=this.jobsGridDatas.findRowKeyByJobId(id)
if(rowKey)this.ensureRowVisible(this.dataHolder.getOffset(rowKey))
return rowKey!=null}redrawLine(row,line){}getSelectedJob(){if(this.dataHolder){const row=this.dataHolder.getRow(this.getSelectedRow())
if(!row)return null
return row.rowDatas}}getSelectedJobs(){return this.dataHolder&&this.dataHolder.countRows()>0?this.dataHolder.getSelectedDatas():[]}selectByJob(jobs){if(jobs!=null){const selectedRows=[]
for(let i=0,c=this.dataHolder.countRows();i<c;i++){const jobRow=this.dataHolder.getRow(i).rowDatas
if(jobRow&&jobs.find(job=>{if(job&&job.id==jobRow.id)return true})){selectedRows.push(i)}}if(selectedRows.length>0)this.setSelectedRows(selectedRows)
else this.clearSel()}}get focusActionables(){if(!this._focusActionables&&this.actions)this._focusActionables=ActionBtn.buildButtons(this.actions,this,"bar")
return this._focusActionables}get ctxMenuActions(){return{actions:this.actions,actionContext:this,rect:this.getSelRect()}}get me(){return this}}REG.reg.registerSkin("server-jobs-grid",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t  min-height: 0;\n\t  min-width: 0;\n\t  flex-direction: column;\n  }\n\n  :focus-visible {\n\t  outline: var(--focus-outline);\n  }\n\n  #head {\n\t  border-bottom: 1px solid var(--border-color);\n  }\n\n  #filter {\n\t  background: .1em / 1em no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/filter.svg);\n\t  padding-block: 2px;\n\t  padding-inline: 1.2em 2px;\n\t  display: flex;\n\t  min-width: 0;\n\t  min-height: 0;\n\t  align-items: center;\n\t  overflow: hidden;\n\t  flex-wrap: wrap;\n  }\n\n  #filter > * {\n\t  margin-block: 0;\n\t  margin-inline: .3rem 0;\n  }\n\n  #filter > select {\n\t  border: none;\n  }\n\n  #filter > input {\n\t  min-width: 10em;\n\t  flex: 1;\n\t  background-color: var(--form-search-bgcolor);\n\t  color: var(--form-color);\n\t  border: 1px solid var(--border-color);\n\t  font-size: inherit;\n  }\n\n  #filterType {\n\t  background-image: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/userGroup.svg");\n\t  background-color: var(--form-bgcolor);\n\t  background-repeat: no-repeat;\n\t  background-size: auto 13px;\n\t  background-position-y: center;\n\t  background-position-x: 3px;\n\t  min-width: 37px;\n\t  max-width: 37px;\n\t  padding-inline-start: 37px;\n  }\n\n  #filterType[data-value=group] {\n\t  background-image: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/group.svg");\n  }\n\n  #filterType[data-value=user] {\n\t  background-image: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/user.svg");\n  }\n\n  #filterGroup {\n\t  min-width: 0;\n  }\n\n  c-input-users-panel {\n\t  min-width: 12rem;\n  }\n\n  #msg {\n\t  font-size: .8rem;\n\t  color: var(--info-color);\n\t  text-align: end;\n\t  margin-inline-end: .5rem;\n\t  font-style: italic;\n  }\n\n  c-grid {\n\t  flex: 1;\n\t  border: none;\n\t  background-color: var(--row-bgcolor);\n  }\n`)
customElements.define("server-jobs-grid",JobsGrid)
export class JobGridDatas extends GridDataHolderJsonArray{constructor(){super()}findRowKeyByJobId(id){for(const d of this._datas)if(d.id===id)return d
return null}removeByJobId(id){let jobIndex=this._datas.findIndex(job=>job.id===id)
this.updateDatas(jobIndex,1)}refreshFields(rowKey,newFields){if(this.onWillUpdate){const idx=this.getOffset(rowKey)
if(idx>=0)this.updateDatas(idx,1,Object.assign(Object.create(null),newFields))}else{for(const k in rowKey)rowKey[k]=undefined
Object.assign(rowKey,newFields)
const grid=this.grid
if(grid)grid.invalidateRows()}}}
//# sourceMappingURL=jobsGrid.js.map