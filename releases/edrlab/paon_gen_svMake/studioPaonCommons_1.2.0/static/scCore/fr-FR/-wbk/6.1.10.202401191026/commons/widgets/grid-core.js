import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
export function isGridDataHolderSortable(g){return g&&"onSortFnChange"in g}export class GridColDef{constructor(id){this.id=id}isAvailable(grid){return true}getLabel(col){return typeof this._label==="function"?this._label(col):this._label!==undefined?this._label:this.id}setLabel(label){this._label=label
return this}getDescription(col){return typeof this._description==="function"?this._description(col):this._description}setDescription(description){this._description=description
return this}getFlexBasis(col){return typeof this._flexBasis==="function"?this._flexBasis(col):this._flexBasis||"4em"}setFlexBasis(val){this._flexBasis=val
return this}getFlexGrow(col){return typeof this._flexGrow==="function"?this._flexGrow(col):this._flexGrow||0}setFlexGrow(val){this._flexGrow=val
return this}getFlexShrink(col){return typeof this._flexShrink==="function"?Math.max(this._flexShrink(col),0):this._flexShrink||0}setFlexShrink(val){this._flexShrink=val
return this}setFlex(basis,grow=1,shrink=1){this.setFlexBasis(basis)
this._flexGrow=grow
this.setFlexShrink(shrink)
return this}getMinWidth(col){return typeof this._minWidth==="function"?this._minWidth(col):this._minWidth||"0"}setMinWidth(val){this._minWidth=val
return this}getMaxWidth(col){return typeof this._maxWidth==="function"?this._maxWidth(col):this._maxWidth||""}setMaxWidth(val){this._maxWidth=val
return this}getSkin(col){return typeof this._skin==="function"?this._skin(col):this._skin||""}setSkin(val){this._skin=val
return this}isSortable(col){return typeof this._sortable==="function"?this._sortable(col):this._sortable!==false}setSortable(val){this._sortable=val
return this}getDefaultSortPriority(col){return this._defaultSortPriority||0}getDefaultSortDir(col){return this._defaultSortDir}setDefaultSort(priority,dir){this._defaultSortPriority=priority
this._defaultSortDir=dir
return this}isHidden(col){return typeof this._hidden==="function"?this._hidden(col):this._hidden===true}setHidden(val){this._hidden=val
return this}getCellBuilder(col){return typeof this._cellBuilder==="function"?this._cellBuilder(col):this._cellBuilder}setCellBuilder(cellBuilder){this._cellBuilder=cellBuilder
return this}newCol(grid){return new GridCol(grid,this)}initCol(col){col.hidden=this.isHidden(col)
col.cellBuilder=this.getCellBuilder(col)
if(col.hidden)return
col.flex=this.getFlexGrow(col)+" "+this.getFlexShrink(col)+" "+this.getFlexBasis(col)
col.minWidth=this.getMinWidth(col)
col.maxWidth=this.getMaxWidth(col)
const skin=this.getSkin(col)
if(skin)col.installedSkin=REG.findReg(col.grid).installSkin(skin,col.grid.shadowRoot)
if(this._defaultSortPriority)col.sortPriority=this.getDefaultSortPriority(col)
if(this._defaultSortDir)col.sortDir=this.getDefaultSortDir(col)}onRemovedCol(col){if(col.installedSkin)col.installedSkin.remove()}buildColHeader(col,root){col.rootHeader=root
if(this.isSortable(col)&&col.cellBuilder.getColSortFn()!=null&&col.grid.isSortKeyAlterable()){root.appendChild(JSX.createElement("c-button",{class:"colBody",label:this.getLabel(col),title:this.getDescription(col),gridsort:"none","ui-context":"custom",onclick:ev=>{if(col.sortPriority===1){if(col.sortDir==="ascendant"){col.setAsMainSortCol("descendant",true)}else{const dataHolder=col.grid.dataHolder
if(isGridDataHolderSortable(dataHolder)&&dataHolder.getNaturalSortFn()!=null){col.setAsMainSortCol("none",false)}else{col.setAsMainSortCol("ascendant",true)}}}else{col.setAsMainSortCol("ascendant",true)}ev.stopPropagation()}}))}else{root.appendChild(JSX.createElement("div",{class:"colBody",title:this.getDescription(col)},this.getLabel(col)))}}redrawColSortState(col){if(!col.rootHeader)return
const btn=col.rootHeader.querySelector("c-button")
if(btn)DOM.setAttr(btn,"gridsort",col.sortPriority===1?col.sortDir:"none")}}export class GridCol{constructor(grid,colDef){this.grid=grid
this.colDef=colDef
this.sortDir="ascendant"
this.sortPriority=0}setAsMainSortCol(state,preserveSortForOtherCols){const maxSortCriterions=3
if(!this.grid.isSortKeyAlterable())return
const newSortsFn=[]
this.grid.columns.forEach(col=>{if(col===this)return
if(col.sortPriority>0){if(preserveSortForOtherCols){if(state==="none"){if(this.sortPriority>0&&this.sortPriority<col.sortPriority)col.sortPriority--}else{if(this.sortPriority==0||this.sortPriority>col.sortPriority)col.sortPriority=col.sortPriority<maxSortCriterions?col.sortPriority+1:0}}else{col.sortPriority=0}col.colDef.redrawColSortState(col)
if(col.sortPriority>0)newSortsFn[col.sortPriority-1]=col.getColDirSortFn()}})
if(state!=="none"){this.sortDir=state
this.sortPriority=1
newSortsFn[0]=this.getColDirSortFn()}else{this.sortPriority=0}this.colDef.redrawColSortState(this)
if(newSortsFn.length>0&&newSortsFn.length<maxSortCriterions&&isGridDataHolderSortable(this.grid.dataHolder)){const naturalSort=this.grid.dataHolder.getNaturalSortFn()
if(naturalSort)newSortsFn.push(naturalSort)}this.grid.sortFn=GridCol.buildSortFunction(newSortsFn)}getColDirSortFn(){const sortFn=this.cellBuilder.getColSortFn()
return this.sortDir==="descendant"?function(r1,r2){return-sortFn(r1,r2)}:sortFn}static buildSortFunction(sortFns){if(sortFns.length==0){return null}else if(sortFns.length==1){return sortFns[0]}else if(sortFns.length==2){const f1=sortFns[0]
const f2=sortFns[1]
return function(r1,r2){return f1(r1,r2)||f2(r1,r2)}}else{return function(r1,r2){for(let i=0;i<sortFns.length;i++){const result=sortFns[i](r1,r2)
if(result!=0)return result}return 0}}}}export var EGridDropPos;(function(EGridDropPos){EGridDropPos[EGridDropPos["none"]=0]="none"
EGridDropPos[EGridDropPos["before"]=1]="before"
EGridDropPos[EGridDropPos["over"]=2]="over"
EGridDropPos[EGridDropPos["after"]=4]="after"})(EGridDropPos||(EGridDropPos={}))

//# sourceMappingURL=grid-core.js.map