import{Grid,GridSmall}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{DOM,ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
export class CellBuilderString{constructor(dataKey){this.dataKey=dataKey}setComparator(comparator){this._comparator=comparator
return this}redrawCell(row,root){DOM.setTextContent(root,this._getValue(row)||" ")}getColSortFn(){return(r1,r2)=>{const v1=this._getValue(r1)
const v2=this._getValue(r2)
if(v1==null){if(v2==null)return 0
return 1}else if(v2==null){return-1}return this._comparator?this._comparator.compare(v1,v2):v1.toString().localeCompare(v2)}}_getValue(row){return row.getData(this.dataKey)}override(key,val){this[key]=val
return this}}export class CellBuilderLabel extends CellBuilderString{setCellClass(cls){this.cellClass=cls
return this}_getDescription(row){return""}setDescriptionFunc(func){this._getDescription=func
return this}redrawCell(row,root){super.redrawCell(row,root)
if(this.cellClass)DOM.addClass(root,this.cellClass)
DOM.setAttr(root,"title",this._getDescription(row))}}export class CellBuilderFlagIcon extends CellBuilderString{constructor(){super(...arguments)
this.iconClass="icon"
this.iconWidth="23px"}setIconClass(cls){this.iconClass=cls
return this}setIconWidth(val){this.iconWidth=val
return this}getIconWidth(row){return this.iconWidth}setIconFilter(val){this.iconFilter=val
return this}getIconFilter(row){return this.iconFilter}redrawCell(row,root){this.redrawIcon(row,root.firstElementChild||this._buildContent(row,root))
root.title=this._getValue(row)}redrawIcon(row,spanIcon){const icon=this._getIcon(row)
const st=spanIcon.style
if(icon){st.backgroundImage=icon.startsWith("--")?`var(${icon})`:`url("${icon}")`
st.filter=this.getIconFilter(row)}else{st.backgroundImage="none"}st.paddingInlineStart=this.getIconWidth(row)}_buildContent(row,root){const span=root.appendChild(document.createElement("span"))
span.classList.add(this.iconClass)
span.style.unicodeBidi="isolate"
return span}}export class CellBuilderIconLabel extends CellBuilderFlagIcon{constructor(){super(...arguments)
this.iconLabelGap=".3em"}_getDescription(row){return""}setDescriptionFunc(func){this._getDescription=func
return this}setIconKey(key){this.iconKey=key
return this}setIconLabelGap(val){this.iconLabelGap=val
return this}redrawCell(row,root){this.redrawIcon(row,root.firstElementChild||this._buildContent(row,root))
const label=this._getValue(row)
const text=root.lastChild
if(text.nodeType!==ENodeType.text){if(label)root.appendChild(document.createTextNode(label))}else{text.nodeValue=label||""}DOM.setAttr(root,"title",this._getDescription(row)||undefined)}_buildContent(row,root){const span=super._buildContent(row,root)
span.style.marginInlineEnd=this.iconLabelGap
return span}_getIcon(row){return row.getData(this.iconKey)}}export class CellBuilderEnum extends CellBuilderLabel{constructor(dataKey,mappingTable){super(dataKey)
this.mappingTable=mappingTable}_getValue(row){const key=row.getData(this.dataKey)||""
return this.mappingTable.has(key)?this.mappingTable.get(key):key}}export class CellBuilderNumber extends CellBuilderLabel{constructor(dataKey){super(dataKey)
if(this.cellClass===undefined)this.cellClass="right"
if(this.defaultSortValue===undefined)this.defaultSortValue=0}fromString(){this.toNumberFunc=val=>val?parseInt(val,10):null
return this}getColSortFn(){if(this.toNumberFunc)return(r1,r2)=>(this.toNumberFunc(this._getValue(r1))||this.defaultSortValue)-(this.toNumberFunc(this._getValue(r2))||this.defaultSortValue)
return(r1,r2)=>(this._getValue(r1)||this.defaultSortValue)-(this._getValue(r2)||this.defaultSortValue)}}export class CellBuilderDate extends CellBuilderNumber{constructor(){super(...arguments)
this.toStrFunc=Date.prototype.toLocaleDateString
this.toNumberFunc=val=>Number.isInteger(val)?val:Date.parse(val)
this._locales="fr"}setToStrFunc(func){this.toStrFunc=func
return this}setLocales(locales){this._locales=locales
return this}setOptions(opts){this._options=opts
return this}getDate(row){const d=this.toNumberFunc?this.toNumberFunc(this._getValue(row)):this._getValue(row)
return d>0?new Date(d):null}redrawCell(row,root){const d=this.getDate(row)
DOM.setTextContent(root,d?this.toStrFunc.call(d,this._locales,this._options):"")
if(this.cellClass)DOM.addClass(root,this.cellClass)
DOM.setAttr(root,"title",this._getDescription(row))}}export class CellBuilderBarActions{constructor(id,actionsLists,actionContextBase,groupsOrder,reg){this.id=id
this.actionsLists=actionsLists
this.actionContextBase=actionContextBase
this.groupsOrder=groupsOrder
this.reg=reg}buildInitBarActions(row){return{reg:this.reg,actions:this.actionsLists,groupOrder:this.groupsOrder,uiContext:"bar",disableFullOverlay:true}}actionContextUpdater(row,actionContext){actionContext["row"]=[row]}setActionContextMaker(fct){this.actionContextUpdater=fct
return this}redrawCell(row,root){let barActions=root.firstElementChild
if(!barActions){row.cacheHolder["_"+this.id]=Object.create(this.actionContextBase)
barActions=root.appendChild((new BarActions).initialize(Object.assign(this.buildInitBarActions(row),{actionContext:row.cacheHolder["_"+this.id]})))}this.actionContextUpdater(row,row.cacheHolder["_"+this.id])
barActions.refreshContent()}override(key,val){this[key]=val
return this}getColSortFn(){return null}}export class GridDataHolderBase{constructor(){this._datas=[]
this._fakeRow=this.newDataRow()}newDataRow(){return new GridDataRowJson(this,null)}get grid(){return this._grid}connectToGrid(grid){if(this._grid&&grid&&this._grid!==grid)throw Error("IGridDataHolder already assigned to an other grid.")
this._grid=grid
this._tryBuildDatas()}setNaturalOrder(sortFn){this._naturalSortFn=sortFn
this._naturalRowSortFn=(r1,r2)=>this._naturalSortFn(r1.rowDatas,r2.rowDatas)}setDatas(datas){if(this._grid){const oldLen=this.countRows()
if(oldLen>0){this._datas=[]
this._grid.rowCountChanged(0,-oldLen)}else{this._grid.refreshEmptyBody()}}this._datas=datas
this._tryBuildDatas()
return this}getDatas(){return this._datas}getDataByOffset(offset){return this._datas[offset]}getSelectedDatas(){const result=[]
if(this._grid){const sels=this._grid.getSelectedRows()
for(let i=0;i<sels.length;i++){const offset=sels[i]
if(offset>0||Object.is(offset,+0)){const d=this.getDataByOffset(offset)
if(d)result.push(d)}else{const last=-offset
for(let o=sels[i-1]+1;o<=last;o++){const d=this.getDataByOffset(o)
if(d)result.push(d)}}}}return result}getUnselectedDatas(){const result=[]
const sels=this.grid.getSelectedRows()
let offsetToTreat=0
for(let i=0;i<sels.length;i++){const offset=sels[i]
if(offset>0||Object.is(offset,+0)){for(let o=offsetToTreat;o<offset;o++)result.push(this.getDataByOffset(o))
offsetToTreat=offset+1}else{offsetToTreat=-offset+1}}for(let o=offsetToTreat,e=this.countRows();o<e;o++)result.push(this.getDataByOffset(o))
return result}countRows(){return this._datas.length}getRow(offset){const data=this._datas[offset]
if(!data)return null
this._fakeRow.rowDatas=data
return this._fakeRow}getRowKey(offset){return this._datas[offset]||null}getOffset(rowKey){return this._datas.indexOf(rowKey)}findInsertPoint(children,key){var _a
const sortFn=((_a=this._grid)===null||_a===void 0?void 0:_a.sortFn)||this.getNaturalSortFn()
if(!sortFn)return children.length
this._initRowDatas()
const idx=binarySearch(children,key,(a,b)=>{this.r1.rowDatas=a
this.r2.rowDatas=b
return sortFn(this.r1,this.r2)})
return idx>=0?idx+1:-idx-1}_initRowDatas(){if(this.r1)return
this.r1=this.newDataRow()
this.r2=this.newDataRow()}getNaturalSortFn(){return this._naturalRowSortFn}onSortFnChange(){const sortFn=this._grid?this._grid.sortFn:null
if(!sortFn)return
const activeData=this.getDataByOffset(this._grid.getActiveRow())
let currentSel
let currentNotSel
const countRows=this.countRows()
const countSel=this._grid.countSelectedRows()
if(countSel<countRows/2)currentSel=this.getSelectedDatas()
else currentNotSel=this.getUnselectedDatas()
this._sortDatas(this._datas,sortFn)
this._grid.clearSel()
this._grid.invalidateRows()
if(currentSel){for(const data of currentSel){const selOffset=this.getOffset(data)
this._grid.addSelectedRows(selOffset,selOffset)}}else if(countRows>0){this._grid.addSelectedRows(0,countRows-1)
for(const data of currentNotSel){const selOffset=this.getOffset(data)
this._grid.removeSelectedRows(selOffset,selOffset)}}if(activeData){const offset=this.getOffset(activeData)
this._grid.setActiveRow(offset)
this._grid.ensureRowVisible(offset)}}_sortDatas(datas,sortFn){const r1=this.newDataRow()
const r2=this.newDataRow()
datas.sort((d1,d2)=>{r1.rowDatas=d1
r2.rowDatas=d2
return sortFn(r1,r2)})}_tryBuildDatas(){if(!this._grid)return
if(this._datas.length>0){const sortFn=this._grid.sortFn
if(sortFn){this._sortDatas(this._datas,sortFn)}this._grid.rowCountChanged(0,this._datas.length)}}rowCache(d){return d[cacheSym]||d}resetRowCache(d){d[cacheSym]=Object.create(null)}}const cacheSym=Symbol("cacheRow")
export class GridDataHolderJsonArray extends GridDataHolderBase{updateDatas(start,deleteCount,...insertEntries){if(start<0||this._datas.length<start-1)throw Error("Update insert "+start+" out of bounds 0-"+this._datas.length)
if(this.onWillUpdate)this.onWillUpdate.emit(start,deleteCount,...insertEntries)
this._datas.splice(start,deleteCount,...insertEntries)
if(this._grid)this._grid.spliceRows(start,deleteCount,insertEntries?insertEntries.length:0)}setDatas(datas){if(this.onWillUpdate)this.onWillUpdate.emit(0,this.countRows(),...datas)
return super.setDatas(datas)}deleteRowKey(rowKey){const offset=this._datas.indexOf(rowKey)
if(offset<0)return false
this.updateDatas(offset,1)
return true}replaceRowKey(currentRowKey,newData){const offset=this._datas.indexOf(currentRowKey)
if(offset<0)return false
this.updateDatas(offset,1,newData)
return true}}export function MxGridUntouchedDatas(Base){return class MxGridUntouchedDatas extends Base{constructor(){super(...arguments)
this.intProps=new WeakMap}_saveNaturalOrder(array){if(!this._naturalSortFn)return
for(let i=0,l=array.length;i<l;i++){const d=array[i]
let p=this.intProps.get(d)
if(!p)this.intProps.set(d,p=Object.create(null))
p.natOrder=i}}_naturalSort(r1,r2){const intProps=r1.dataHolder.intProps
return intProps.get(r1.rowDatas).natOrder-intProps.get(r2.rowDatas).natOrder}rowCache(d){let p=this.intProps.get(d)
if(!p){this.intProps.set(d,p=Object.create(null))
p.cache=Object.create(null)}else if(!p.cache){p.cache=Object.create(null)}return p.cache}resetRowCache(d){let p=this.intProps.get(d)
if(p)p.cache=undefined}}}export class GridDataRowJson{constructor(dataHolder,rowDatas){this.dataHolder=dataHolder
this.rowDatas=rowDatas}getData(key){return this.rowDatas[key]}get rowKey(){return this.rowDatas}get cacheHolder(){return this.dataHolder.rowCache(this.rowDatas)}}export class GridDataHolderDom extends GridDataHolderJsonArray{newDataRow(){return new GridDataRowDom(this,null)}}export class GridDataRowDom extends GridDataRowJson{getData(key){if(key==="#")return this.rowDatas.textContent
if(this.rowDatas instanceof Element)return this.rowDatas.getAttribute(key)||this.rowDatas.querySelector(key)
return null}}function binarySearch(datas,key,comp){let low=0
let high=datas.length-1
while(low<=high){const mid=low+high>>>1
const midVal=datas[mid]
const cmp=comp(midVal,key)
if(cmp<0)low=mid+1
else if(cmp>0)high=mid-1
else return mid}return-(low+1)}customElements.define("c-grid-small",GridSmall)
customElements.define("c-grid",Grid)

//# sourceMappingURL=grid-libs.js.map