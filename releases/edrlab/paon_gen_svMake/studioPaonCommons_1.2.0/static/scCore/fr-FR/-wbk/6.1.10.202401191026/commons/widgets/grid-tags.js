import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{EGridDropPos,GridCol,isGridDataHolderSortable}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{EventsMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{GFX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/gfx.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{Resizer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/resizer.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
export class GridSmall extends BaseElement{constructor(){super(...arguments)
this.uiEvents=new UiEventsMgr(this)}get selType(){return this.getAttribute("sel-type")||"mono"}get columnDefs(){return this._columnDef}set columnDefs(val){this._columnDef=val
if(this.columns)for(const col of this.columns)col.colDef.onRemovedCol(col)
this.columns=[]
for(const colDef of val){if(colDef.isAvailable(this))this.columns.push(colDef.newCol(this))}this._needRefreshCols=true
this.refresh()}getTilesByLine(){return this._tiles}setTilesByLine(count,reg){if(this._tiles===undefined)reg.installSkin("c-grid/tileLayout",this.shadowRoot)
this.setTiles(count)}setTilesAuto(tileWidth,reg){if(this._tiles===undefined)reg.installSkin("c-grid/tileLayout",this.shadowRoot)
this._tiles=1
this._tileWidth=tileWidth
if(!this._tileObs){this._tileObs=new ResizeObserver(this.onGridResize)
this._tileObs.observe(this)}else{this._tileObs.unobserve(this)
this._tileObs.observe(this)}}setTiles(count){count=Math.min(Math.max(1,Math.floor(count)),5)
this.style.setProperty("--grid-tiles-count",count.toString())
this._tiles=count}onGridResize(entries){const grid=entries[0].target
grid.setTiles(grid.offsetWidth/grid._tileWidth)}get lineDrawer(){return this._lineDrawer}set lineDrawer(val){if(this._lineDrawer===val)return
this._lineDrawer=val
this._needRefreshContent=true
this.refresh()}get dataHolder(){return this._dataHolder}set dataHolder(val){if(this._dataHolder)this._dataHolder.connectToGrid(null)
this._dataHolder=val
this._needRefreshContent=true
this.refresh()}get hideHeaders(){return this.hasAttribute("hide-headers")}set hideHeaders(val){if(DOM.setAttrBool(this,"hide-headers",val))this.refresh()}get hideSortBtns(){return this.hasAttribute("hide-sort-btns")}set hideSortBtns(val){if(DOM.setAttrBool(this,"hide-sort-btns",val))this.refresh()}get emptyBody(){return this._emptyBody}set emptyBody(val){this._emptyBody=val
if(!this._dataHolder||this._dataHolder.countRows()===0)this._refreshEmptyNode(true)}refreshEmptyBody(){this._refreshEmptyNode(!this._dataHolder||this._dataHolder.countRows()===0)}get noResizableCol(){return this.hasAttribute("no-resizable-col")}set noResizableCol(val){if(DOM.setAttrBool(this,"no-resizable-col",val))this.refresh()}setRowDropMgr(rowDropMgr,dragover,onDropMarkChange,drop){this._rowDropMgr=rowDropMgr
const node=this.scrollNode
if(rowDropMgr){node.ondragenter=GridSmall.onDragEnterInScrollArea
node.ondragleave=GridSmall.onDragLeaveInScrollArea
node.ondragover=dragover||GridSmall.onDragOverInScrollArea
node.ondrop=drop||GridSmall.onDropInScrollArea
this.onDropMarkChange=onDropMarkChange
this.bodyNode.style.paddingBottom="1em"}else{node.ondragenter=null
node.ondragleave=null
node.ondragover=null
node.ondrop=null
this.onDropMarkChange=null
this.bodyNode.style.paddingBottom=""}return this}invalidateRows(offset=0,count=Number.MAX_SAFE_INTEGER){if(this._needRefreshContent||this._needRefreshContent)return
let line=this._getLine(offset)
for(let i=0;line&&i<count;i++){this._redrawLine(line,offset+i)
line=line.nextElementSibling}}rowCountChanged(offset,count){if(this._activeRowOffset>=offset){if(count<0&&this._activeRowOffset<offset-count){this._activeRowOffset=-1}else{this._activeRowOffset+=count}}if(this._sel.rowCountChanged(offset,count))this.dispatchEvent(new CustomEvent("grid-select",{bubbles:true,composed:true}))
this._rowCountChanged(offset,count)}spliceRows(start,deleteCount,insertCount){if(deleteCount>0&&insertCount>0){const count=Math.min(deleteCount,insertCount)
this.invalidateRows(start,count)
start+=count
deleteCount-=count
insertCount-=count}if(deleteCount>0)this.rowCountChanged(start,-deleteCount)
if(insertCount>0)this.rowCountChanged(start,insertCount)}_rowCountChanged(offset,count){if(this._needRefreshContent||this._needRefreshCols)return
if(count>0){const insertPoint=this._getLine(offset)
for(let i=0;i<count;i++){const line=this._createLine()
this.linesNode.insertBefore(line,insertPoint)
this._redrawLine(line,offset+i)}}else{let line=this._getLine(offset)
while(line&&count++!=0){const lineToDel=line
line=line.nextElementSibling
lineToDel.remove()}}this._refreshEmptyNode(!this.linesNode.hasChildNodes())}_refreshEmptyNode(isEmpty){if(isEmpty){if(this._emptyBody){if(!this.emptyListNode)this.emptyListNode=this.bodyNode.appendChild(JSX.createElement("div",{id:"empty"}))
else DOM.setHidden(this.emptyListNode,false)
this.emptyListNode.textContent=null
const body=typeof this._emptyBody==="function"?this._emptyBody():this._emptyBody
if(body)this.emptyListNode.appendChild(body)}}else{if(this.emptyListNode){if(DOM.setHidden(this.emptyListNode,true))this.emptyListNode.textContent=null}}}getActiveRow(){return this._activeRowOffset}setActiveRow(offset){const old=this._activeRowOffset
this._activeRowOffset=offset>=0?Math.min(offset,this.dataHolder.countRows()):-1
if(this._sel.getSelType()==="multi"){if(old>=0){const l=this._getLine(old)
if(l)l.classList.remove("active")}const l=this._getLine(this._activeRowOffset)
if(l)l.classList.add("active")}}ensureRowVisible(offset,scrollOpts){if(this._needRefreshCols||this._needRefreshContent)this._refresh()
const line=this._getLine(offset)
if(line){this._ensureLineVisible(line)
line.scrollIntoView(scrollOpts||{block:"nearest",inline:"nearest",behavior:"smooth"})}}_ensureLineVisible(line){const headerH=this.headersNode?this.headersNode.offsetHeight:0
const yLinePos=line.offsetTop-this.scrollNode.scrollTop
if(yLinePos<headerH){this.scrollNode.scrollTop+=yLinePos-headerH}else{const yMax=this.scrollNode.clientHeight-line.offsetHeight
if(yLinePos>yMax)this.scrollNode.scrollTop+=yLinePos-yMax}}getSelType(){return this._sel.getSelType()}isRowSelected(offset){return this._sel.isRowSelected(offset)}getSelectedRow(){return this._sel.getSelectedRows()[0]}countSelectedRows(){return this._sel.countSelectedRows()}getSelectedRows(){return this._sel.getSelectedRows().concat()}setSelectedRows(selEntries,userAction){let line=this.linesNode.firstElementChild
let offset=this._getOffset(line)
if(Array.isArray(selEntries)){while(line){line.classList.toggle("inSel",isInSel(selEntries,offset))
line=line.nextElementSibling
offset++}if(this._activeRowOffset<0)this.setActiveRow(Math.abs(selEntries[selEntries.length-1]))}else{while(line){line.classList.toggle("inSel",selEntries===offset)
line=line.nextElementSibling
offset++}this.setActiveRow(selEntries)}this._sel.setSelectedRows(selEntries)
this.dispatchEvent(new CustomEvent("grid-select",{bubbles:true,composed:true}))
if(userAction&&this.defaultActOnUserSelChange)this.execDefaultAction(userAction)}addSelectedRows(startOffset,endOffset){if(startOffset>endOffset){this.addSelectedRows(endOffset,startOffset)
return}const sel=this._sel.getSelectedRows()
let added=false
for(let i=sel.length-1;i>=0;i--){const offset=sel[i]
if(offset<0){const startRange=sel[--i]
const endRange=-offset
if(endRange<startOffset-1){if(!added){if(startOffset===endOffset)sel.splice(i+2,0,startOffset)
else sel.splice(i+2,0,startOffset,-endOffset)}this.setSelectedRows(sel)
return}if(endOffset>=startRange-1){if(added){if(startOffset<=startRange){sel.splice(i,2)}else if(startOffset<=endRange){sel[i+1]=-(startOffset-1)
trySimplifyRange(sel,i)}}else{sel[i]=Math.min(startOffset,startRange)
sel[i+1]=-Math.max(endOffset,endRange)
added=true}}}else{if(offset>startOffset&&offset<=endOffset){sel.splice(i,1)}else if(offset===startOffset){if(!added&&endOffset>startOffset){sel.splice(i+1,0,-endOffset)}this.setSelectedRows(sel)
return}else if(offset===startOffset-1){if(added)sel.splice(i,1)
else sel.splice(i+1,0,-endOffset)
this.setSelectedRows(sel)
return}else if(offset<startOffset){if(!added){if(endOffset>startOffset)sel.splice(i+1,0,startOffset,-endOffset)
else sel.splice(i+1,0,startOffset)}this.setSelectedRows(sel)
return}}}if(!added){if(startOffset===endOffset)sel.splice(0,0,startOffset)
else sel.splice(0,0,startOffset,-endOffset)}this.setSelectedRows(sel)}removeSelectedRows(startOffset,endOffset){if(startOffset>endOffset){this.removeSelectedRows(endOffset,startOffset)
return}const sel=this._sel.getSelectedRows()
for(let i=sel.length-1;i>=0;i--){const offset=sel[i]
if(offset<0){const startRange=sel[--i]
const endRange=-offset
if(startOffset<=startRange){if(endOffset>=endRange){sel.splice(i,2)}else if(endOffset>=startRange){sel[i]=endOffset+1
trySimplifyRange(sel,i)}}else if(startOffset<=endRange){if(endOffset<endRange){sel[i+1]=-(startOffset-1)
i+=trySimplifyRange(sel,i)
sel.splice(i+2,0,endOffset+1,-endRange)
trySimplifyRange(sel,i+2)}else{sel[i+1]=-(startOffset-1)
trySimplifyRange(sel,i)}}}else{if(offset>=startOffset&&offset<=endOffset)sel.splice(i,1)}}this.setSelectedRows(sel)}toggleSelectedRow(offset){if(offset==null||offset<0)return
if(this.isRowSelected(offset)){this.removeSelectedRows(offset,offset)}else{this.addSelectedRows(offset,offset)}}clearSel(){let line=this.linesNode.firstElementChild
while(line){line.classList.remove("inSel")
line=line.nextElementSibling}this.setActiveRow(-1)
this._sel.clearSel()
this.dispatchEvent(new CustomEvent("grid-select",{bubbles:true,composed:true}))}getSelRect(){let line=this.linesNode.firstElementChild
const rg=new Range
let first=true
while(line){if(line.classList.contains("inSel")){first?rg.selectNode(line):rg.setEndAfter(line)
first=false}line=line.nextElementSibling}if(first==null)return null
return GFX.intersect(rg.getBoundingClientRect(),this.scrollNode.getBoundingClientRect())}isLineInSel(line){return line.classList.contains("inSel")}get sortFn(){return this._sortFn}set sortFn(val){if(this._sortFn!==val){this._sortFn=val
if(isGridDataHolderSortable(this._dataHolder))this._dataHolder.onSortFnChange()}}isSortKeyAlterable(){return!this.hideSortBtns&&isGridDataHolderSortable(this.dataHolder)}getVisibleOffsetStart(){const count=this.dataHolder.countRows()
if(count===0)return-1
const scrollTop=this.scrollNode.scrollTop
if(scrollTop===0)return 0
const scrollH=this.scrollNode.scrollHeight
if(scrollH===0)return 0
return Math.floor(scrollTop/(scrollH/count))}_initialize(init){const reg=this.findReg(init)
const sr=this.shadowRoot||this.attachShadow(DOMSH.SHADOWDOM_INIT)
if(this.localName!=="c-grid")reg.installSkin("c-grid",sr)
if(init.skinScroll)reg.installSkin(init.skinScroll,sr)
this._initAndInstallSkin(this.localName,init)
this.scrollNode=sr.appendChild(JSX.createElement("div",{id:"scroll"}))
this.bodyNode=this.scrollNode.appendChild(JSX.createElement("div",{id:"body"}))
this.bodyNode.style.position="relative"
this.linesNode=this.bodyNode.appendChild(JSX.createElement("div",{id:"lines"}))
this.resizersNode=this.bodyNode.appendChild(JSX.createElement("div",{id:"resizers"}))
this.columnDefs=init.columnDefs
this.dataHolder=init.dataHolder
this.lineDrawer=init.lineDrawer
this.hideHeaders=init.hideHeaders
this.hideSortBtns=init.hideSortBtns
this.noResizableCol=init.noResizableCol
this.emptyBody=init.emptyBody
if(init.selType)this.setAttribute("sel-type",init.selType)
const selType=this.selType
this._sel=selType==="multi"?new GridSelectionMulti(this):selType==="none"?new GridSelectionNone:new GridSelectionMono(this,selType)
this.tabIndex=0
this._activeRowOffset=-1
if(init.autoSelOnFocus){this.addEventListener("focus",(function(ev){if(init.autoSelOnFocus==="first"){if(this.getSelectedRow()===undefined&&this._dataHolder.countRows()>0)this.setSelectedRows(0,ev)}else init.autoSelOnFocus.call(this)}))}if(init.defaultAction){this.defaultAction=init.defaultAction
this.defaultActionCtx=init.defaultActionCtx||this
if(init.defaultActionOn==="userSelChange"){this.defaultActOnUserSelChange=true}else{if(init.defaultActionOn==="mousedown"){this.addEventListener("mousedown",ev=>{this.execDefaultAction(ev)})}else if(init.defaultActionOn==="click"||Desk.noMouse||reg.getUserData("gridSimpleClickPrefered")==true){this.addEventListener("click",ev=>{this.execDefaultAction(ev)})}else if(!init.defaultActionOn){this.uiEvents.on("rowDblclick",(row,ev)=>{this.execDefaultAction(ev)})}this.addEventListener("keypress",ev=>{if(ev.key==="Enter")this.execDefaultAction(ev)})}}}execDefaultAction(ev){if(this.defaultAction.isAvailable(this.defaultActionCtx)){ACTION.doOnEvent(this.defaultAction.execute(this.defaultActionCtx,ev),ev)}}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
if(this.hasAttribute("col-defs"))init.columnDefs=this.findReg(init).mergeLists(...this.getAttribute("col-defs").split(" "))
if(this.hasAttribute("data-holder-svc")){const svc=this.findReg(init).getSvc(this.getAttribute("data-holder-svc"))
init.dataHolder=typeof svc==="function"?svc(this,init):svc}if(this.hasAttribute("empty-body"))init.emptyBody=JSX.createElement("span",{class:"empty"},this.getAttribute("empty-body"))
return init}_refresh(){if(!this.columns||!this._dataHolder)return
if(this.hideHeaders){if(this.headersNode)DOM.setHidden(this.headersNode,true)}else{if(!this.headersNode){this.headersNode=this.bodyNode.insertBefore(JSX.createElement("div",{id:"headers"}),this.bodyNode.firstChild)}else{DOM.setHidden(this.headersNode,false)}}if(this._needRefreshCols||this._needRefreshContent){const sel=this.getSelectedRows()
this._resetBeforeRedraw()
if(this._needRefreshCols){this._needRefreshCols=false
this._rebuildColHeaders()}this._needRefreshContent=false
if(this._dataHolder){this._dataHolder.connectToGrid(this)
const newCount=this._dataHolder.countRows()
if(newCount===0)this._refreshEmptyNode(true)
else if(sel!=null)this.setSelectedRows(truncateSel(sel,newCount))}}else{}}_resetBeforeRedraw(){if(this.headersNode)DOM.setTextContent(this.headersNode,null)
DOM.setTextContent(this.resizersNode,null)
DOM.setTextContent(this.linesNode,null)
this.setActiveRow(-1)
this._sel.clearSel()}_getLine(offset){if(offset<0)return null
return this.linesNode.children[offset]}_getLineFrom(node){if(!node||node===this)return null
while(node.parentNode!==this.linesNode){node=node.parentNode
if(!node||node===this)return null}return node instanceof HTMLElement&&node.classList.contains("line")?node:null}_getOffset(line){if(!line)return-1
let offset=0
let p=line.previousElementSibling
while(p){offset++
p=p.previousElementSibling}return offset}_getCellInLine(line,col){return DOM.findFirstChild(line,ch=>ch._gridCol===col)}_rebuildColHeaders(){if(!this.columns)return
let newSortsFn
this.columns.forEach(col=>{col.colDef.initCol(col)
if(col.sortPriority>0){if(!newSortsFn)newSortsFn=[]
newSortsFn[col.sortPriority-1]=col.getColDirSortFn()}if(col.hidden)return
if(!this.noResizableCol&&this.resizersNode.hasChildNodes()){const resizer=this.resizersNode.appendChild(JSX.createElement(Resizer,{"c-orient":"row"}))
resizer.listeners.on("resizing",()=>{const flexSizes=[]
for(let ch=this.resizersNode.firstElementChild;ch;ch=ch.nextElementSibling?ch.nextElementSibling.nextElementSibling:null){const flex=ch.style.flex
ch._gridCol.flex=flex
flexSizes.push(flex)}for(let i=0;i<flexSizes.length;i++)this.columns[i].flex=flexSizes[i]
if(this.headersNode)this._adjustColWidth(this.headersNode,flexSizes)
for(let ch=this.linesNode.firstElementChild;ch;ch=ch.nextElementSibling)this._adjustColWidth(ch,flexSizes)})}function initColNode(c){c.classList.add(col.colDef.id)
c.style.flex=col.flex
if(col.minWidth)c.style.minWidth=col.minWidth
if(col.maxWidth)c.style.maxWidth=col.maxWidth
c._gridCol=col
return c}if(col.colDef.getFlexGrow(col)===0&&col.colDef.getFlexShrink(col)===0){this.resizersNode.appendChild(initColNode(JSX.createElement("div",{class:"colW"})))}else{this.resizersNode.appendChild(initColNode(JSX.createElement("div",{class:"colW","c-resizable":""})))}if(!this.headersNode)return
const colElt=initColNode(JSX.createElement("div",{class:"colH"}))
col.colDef.buildColHeader(col,colElt)
this.headersNode.appendChild(colElt)},this)
this.sortFn=newSortsFn?GridCol.buildSortFunction(newSortsFn.filter(m=>m!=null)):null}_adjustColWidth(line,sizes){for(let i=0,ch=line.firstElementChild;ch;ch=ch.nextElementSibling)ch.style.flex=sizes[i++]}_createLine(){const line=JSX.createElement("div",{class:"line"})
this.columns.forEach((function(col){if(col.hidden)return
const cell=JSX.createElement("div",{class:"cell"})
cell.style.flex=col.flex
if(col.minWidth)cell.style.minWidth=col.minWidth
if(col.maxWidth)cell.style.maxWidth=col.maxWidth
cell._gridCol=col
line.appendChild(cell)}),this)
return line}_redrawLine(line,offset){const row=this.dataHolder.getRow(offset)
if(!row)return
let cell=line.firstElementChild
while(cell){try{if(cell._gridCol)cell._gridCol.cellBuilder.redrawCell(row,cell)}catch(e){cell.textContent=""
console.log("redrawCell failed:",e)}cell=cell.nextElementSibling}this._redrawSelForLine(line,offset)
if(this._lineDrawer)this._lineDrawer.redrawLine(row,line)}_redrawSelForLine(line,offset){if(this._sel.isRowSelected(offset)){DOM.addClass(line,"inSel")}else{DOM.removeClass(line,"inSel")}if(this._sel.getSelType()==="multi"){if(this._activeRowOffset===offset){DOM.addClass(line,"active")}else{DOM.removeClass(line,"active")}}}static onDragEnterInScrollArea(ev){ev.preventDefault()
ev.stopPropagation()
const grid=DOMSH.findHost(this)
if(!grid._dropMark)grid._dropMark=JSX.createElement("drop-mark",null)
grid._dragEnterLast=ev.target}static onDragLeaveInScrollArea(ev){ev.preventDefault()
ev.stopPropagation()
const grid=DOMSH.findHost(this)
if(grid._dragEnterLast===ev.target)grid.clearDragMark()}static onDragOverInScrollArea(ev){ev.preventDefault()
ev.stopPropagation()
const grid=DOMSH.findHost(this)
const line=grid._getLineFrom(ev.target)
if(!line){const pos=grid._rowDropMgr.onDragOverRow(ev,grid,null,null)
if(pos===EGridDropPos.after){grid.placeDragMark(grid.linesNode,EGridDropPos.after)}else if(pos===EGridDropPos.over){grid.scrollNode.classList.toggle("dropIn",true)}else{grid.clearDragMark()}return}const offset=grid._getOffset(line)
const row=grid.dataHolder.getRow(offset)
const pos=grid._rowDropMgr.onDragOverRow(ev,grid,row,line)
if(pos===0){grid.clearDragMark()}else{const rectLine=line.getBoundingClientRect()
const y=ev.y
if((pos&EGridDropPos.before)!==0&&y<rectLine.top+4){grid.placeDragMark(line,EGridDropPos.before)}else if((pos&EGridDropPos.after)!==0&&y>rectLine.bottom-4){grid.placeDragMark(line,EGridDropPos.after)}else if((pos&EGridDropPos.over)!==0){grid.placeDragMark(line,EGridDropPos.over)}else{grid.clearDragMark()}}}placeDragMark(line,pos){this.scrollNode.classList.toggle("dropIn",false)
const previousLine=this._dropMark.parentElement
let change=false
if(previousLine!==line){if(previousLine)previousLine.classList.remove("markHolder")
line.classList.add("markHolder")
line.appendChild(this._dropMark)
change=true}if(pos===EGridDropPos.over){change=DOM.setAttr(this._dropMark,"pos","over")||change}else if(pos===EGridDropPos.before){change=DOM.setAttr(this._dropMark,"pos","before")||change}else{change=DOM.setAttr(this._dropMark,"pos","after")||change}if(change&&this.onDropMarkChange)this.onDropMarkChange()}clearDragMark(){this.scrollNode.classList.toggle("dropIn",false)
if(this._dropMark.parentNode){this._dropMark.parentElement.classList.remove("markHolder")
this._dropMark.remove()
if(this.onDropMarkChange)this.onDropMarkChange()}}static onDropInScrollArea(ev){const grid=DOMSH.findHost(this)
try{const line=grid._dropMark.parentElement
if(!line){if(grid.scrollNode.classList.contains("dropIn")){grid._rowDropMgr.dropOnRow(ev,grid,null,null,EGridDropPos.over)}}else if(line===grid.linesNode){grid._rowDropMgr.dropOnRow(ev,grid,null,null,EGridDropPos.after)}else{const offset=grid._getOffset(line)
const row=grid.dataHolder.getRow(offset)
const pos=grid._dropMark.getAttribute("pos")
grid._rowDropMgr.dropOnRow(ev,grid,row,line,pos==="over"?EGridDropPos.over:pos==="before"?EGridDropPos.before:EGridDropPos.after)}}finally{grid.clearDragMark()}}}class UiEventsMgr extends EventsMgr{constructor(grid){super()
this.grid=grid}on(event,listener,order){if(!this._listeners||!this._listeners[event]){if(event==="rowClick"){this.grid.linesNode.addEventListener("click",ev=>{const row=this.grid.dataHolder.getRow(this.grid._getOffset(this.grid._getLineFrom(ev.target)))
this.emitUntil("rowClick",row,ev)})}else if(event==="rowDblclick"){this.grid.linesNode.addEventListener("dblclick",ev=>{const row=this.grid.dataHolder.getRow(this.grid._getOffset(this.grid._getLineFrom(ev.target)))
this.emitUntil("rowDblclick",row,ev)})}}return super.on(event,listener,order)}}class GridSelectionNone{getSelType(){return"none"}isRowSelected(offset){return false}getSelectedRows(){return[]}countSelectedRows(){return 0}setSelectedRows(selEntries){}clearSel(){}rowCountChanged(offset,count){return false}}class GridSelectionMono{constructor(grid,_selType){this.grid=grid
this._selType=_selType
this._sel=-1
grid.scrollNode.addEventListener(_selType==="mono"?"pointerdown":_selType==="monoOver"?"pointerover":"click",(function(ev){ev.stopPropagation()
const grid=DOMSH.findHost(this)
const line=grid._getLineFrom(ev.target)
if(!line){if(ev.target!==this&&!ACTION.isAnyControlPressed(ev))grid.setSelectedRows(-1,ev)
return}grid.setSelectedRows(grid._getOffset(line),ev)
grid.focus()}))
this.grid.addEventListener("keydown",(function(ev){let found=false
switch(ev.key){case"ArrowDown":if(grid._activeRowOffset<grid.dataHolder.countRows()-1){found=true
grid.setSelectedRows(grid._activeRowOffset+1,ev)}grid.ensureRowVisible(grid._activeRowOffset)
break
case"ArrowUp":if(grid._activeRowOffset>0){found=true
grid.setSelectedRows(grid._activeRowOffset-1,ev)}grid.ensureRowVisible(grid._activeRowOffset)
break
default:return}if(!found&&_selType==="monoOver"){return}if(this.shadowRoot.activeElement!==null)grid.focus()
ev.stopPropagation()
ev.preventDefault()}))}getSelType(){return this._selType||"mono"}isRowSelected(offset){return this._sel===offset}getSelectedRows(){return this._sel===-1?[]:[this._sel]}countSelectedRows(){return this._sel===-1?0:1}setSelectedRows(selEntries){if(Array.isArray(selEntries)){if(selEntries.length>1)throw Error("multi-selection not allowed")
this.setSelectedRows(selEntries[0])}else this._sel=selEntries>=0?selEntries:-1}clearSel(){this._sel=-1}rowCountChanged(offset,count){const offs=this._sel
if(offs>=offset){if(count<0&&offs<offset-count){this._sel=-1
return true}else{this._sel+=count}}return false}}class GridSelectionMulti{constructor(grid){this.grid=grid
this._sel=[]
this.grid.scrollNode.addEventListener("pointerdown",(function(ev){ev.stopPropagation()
const grid=DOMSH.findHost(this)
const line=grid._getLineFrom(ev.target)
if(!line){if(ev.target!==this&&!ACTION.isAnyControlPressed(ev))grid.setSelectedRows(-1,ev)
return}const offset=grid._getOffset(line)
if(ACTION.isAccelPressed(ev)){grid.toggleSelectedRow(offset)
grid.setActiveRow(offset)}else if(ev.shiftKey&&grid._activeRowOffset>=0){grid.setSelectedRows(grid._activeRowOffset>offset?[offset,-grid._activeRowOffset]:grid._activeRowOffset<offset?[grid._activeRowOffset,-offset]:offset,ev)}else{if(grid.isLineInSel(line)){if(ev.button===2){}else{this.onclick=function(ev){this.onclick=null
const grid=DOMSH.findHost(this)
const line=grid._getLineFrom(ev.target)
if(line&&grid.isLineInSel(line)&&ev.button!==2){grid.setSelectedRows(grid._getOffset(line),ev)}}}}else{grid.setSelectedRows(offset,ev)}}}),false)
this.grid.addEventListener("keydown",(function(ev){switch(ev.key){case" ":if(!ACTION.isAnyControlPressed(ev)&&DOMSH.findDocumentOrShadowRoot(grid).activeElement===grid){grid.toggleSelectedRow(grid._activeRowOffset)
grid.ensureRowVisible(grid._activeRowOffset)}else{return}break
case"ArrowDown":if(grid._activeRowOffset<grid.dataHolder.countRows()-1){if(ACTION.isAccelPressed(ev)){grid.setActiveRow(grid._activeRowOffset+1)}else if(ev.shiftKey){grid.addSelectedRows(grid._activeRowOffset,grid._activeRowOffset+1)
grid.setActiveRow(grid._activeRowOffset+1)}else{grid.setSelectedRows(grid._activeRowOffset+1,ev)}}grid.ensureRowVisible(grid._activeRowOffset)
break
case"ArrowUp":if(grid._activeRowOffset>0){if(ACTION.isAccelPressed(ev)){grid.setActiveRow(grid._activeRowOffset-1)}else if(ev.shiftKey){grid.addSelectedRows(grid._activeRowOffset-1,grid._activeRowOffset)
grid.setActiveRow(grid._activeRowOffset-1)}else{grid.setSelectedRows(grid._activeRowOffset-1,ev)}}grid.ensureRowVisible(grid._activeRowOffset)
break
case"a":case"A":if(ACTION.isAccelPressed(ev)){grid.setActiveRow(-1)
grid.setSelectedRows([0,-(grid.dataHolder.countRows()-1)],ev)
break}default:return}if(this.shadowRoot.activeElement!==null)grid.focus()
ev.stopPropagation()
ev.preventDefault()}),false)}getSelType(){return"multi"}isRowSelected(offset){return isInSel(this._sel,offset)}getSelectedRows(){return this._sel}countSelectedRows(){let result=0
for(let i=0;i<this._sel.length;i++){const offset=this._sel[i]
if(offset>0||Object.is(offset,+0))result++
else{result+=-offset-this._sel[i-1]-1}}return result}setSelectedRows(selEntries){if(Array.isArray(selEntries)){this._sel=selEntries}else if(selEntries>=0){this._sel=[selEntries]}else{this._sel=[]}}clearSel(){this._sel=[]}rowCountChanged(offset,count){const endChange=offset+Math.abs(count)-1
let selChange=false
for(let i=this._sel.length-1;i>=0;i--){const idx=this._sel[i]
if(idx<0){const endRange=-idx
const startRange=this._sel[--i]
if(offset<=startRange){if(count>=0||endChange<startRange){this._sel[i]+=count
this._sel[i+1]-=count}else if(endRange<=endChange){this._sel.splice(i,2)
selChange=true}else{this._sel[i]=offset
this._sel[i+1]-=count
trySimplifyRange(this._sel,i)
selChange=true}}else if(offset<=endRange){if(count>0){this._sel[i+1]=-(offset-1)
const ins=i+2+trySimplifyRange(this._sel,i)
this._sel.splice(ins,0,offset+count,-endRange-count)
trySimplifyRange(this._sel,ins)}else{if(endRange>endChange){this._sel[i+1]-=count}else{this._sel[i+1]=-(offset-1)}trySimplifyRange(this._sel,i)
selChange=true}}}else{if(idx>=offset){if(count<0&&idx<offset-count){this._sel.splice(i,1)
selChange=true}else{this._sel[i]+=count}}}}return selChange}}function isInSel(sel,offset){for(let i=0;i<sel.length;i++){const idx=sel[i]
if(idx<0){if(offset>sel[i-1]&&offset<=-idx)return true}else if(idx==offset)return true}return false}function trySimplifyRange(sel,offset){if(sel[offset]===-sel[offset+1]){sel.splice(offset+1,1)
return-1}return 0}export class Grid extends GridSmall{constructor(){super(...arguments)
this.addMargin=50
this.removeMargin=200
this._firstLineOffset=0
this._afterLastLineOffset=0}invalidateRows(offset=0,count=Number.MAX_SAFE_INTEGER){if(offset>=this._afterLastLineOffset)return
if(offset+count<this._firstLineOffset)return
super.invalidateRows(Math.max(offset,this._firstLineOffset),Math.min(count,this._afterLastLineOffset-this._firstLineOffset))}ensureRowVisible(offset,scrollOpts){if(this._needRefreshCols||this._needRefreshContent)this._refresh()
this._ensureRowDrawn(offset)
super.ensureRowVisible(offset,scrollOpts)}setTiles(count){const oldTiles=this._tiles||1
super.setTiles(count)
if(oldTiles===this._tiles||this._firstLineOffset===0)return
const toRem=this._firstLineOffset%this._tiles
if(toRem>0){if(oldTiles>this._tiles&&this._firstLineOffset+toRem<this._afterLastLineOffset){for(let i=0;i<toRem;i++)this.linesNode.firstElementChild.remove()
this._updateDrawnBounds(this._firstLineOffset+toRem,this._afterLastLineOffset)
return}const toAdd=this._tiles-toRem
let offset=this._afterLastLineOffset
for(let i=0;i<toAdd;i++){const line=this._createLine()
this._redrawSelForLine(line,--offset)
this.linesNode.insertBefore(line,this.linesNode.firstChild)
this._redrawLine(line,offset)}this._updateDrawnBounds(this._firstLineOffset-toAdd,this._afterLastLineOffset)}}_initialize(init){super._initialize(init)
this._spaceBefore=this.bodyNode.insertBefore(document.createElement("x-spacebefore"),this.linesNode)
this._spaceBefore.style.display="block"
this._spaceAfter=this.bodyNode.insertBefore(document.createElement("x-spaceafter"),this.linesNode.nextSibling)
this._spaceAfter.style.display="block"
this._observer=new IntersectionObserver(entries=>{if(!this.linesNode.hasChildNodes())return
if(!this._averageHeight){this._updateDrawnBounds(this._firstLineOffset,this._afterLastLineOffset)}for(const entry of entries){if(!entry.isIntersecting)continue
if(entry.target.style.height==="0px"){if(this.reachedLimitsCb)this.reachedLimitsCb(entry.target===this._spaceBefore)
continue}const scrollRect=this.scrollNode.getBoundingClientRect()
if(entry.target===this._spaceAfter){if(entry.boundingClientRect.top>scrollRect.top){this._observer.unobserve(this._spaceAfter)
const toAdd=Math.floor(entry.intersectionRect.height/this._averageHeight)+1
this._extendDrawnLines(toAdd)
this._observer.observe(this._spaceAfter)}else{this._redrawFromScrollPos()
const bound=scrollRect.height+this.addMargin
let delta=this._spaceAfter.offsetTop-this.scrollNode.scrollTop-bound
while(delta<0&&this._spaceAfter.clientHeight>0){const toAdd=Math.floor(-delta/this._averageHeight)+1
this._extendDrawnLines(toAdd)
delta=this._spaceAfter.offsetTop-this.scrollNode.scrollTop-bound}}}else{if(entry.boundingClientRect.bottom<scrollRect.bottom){this._observer.unobserve(this._spaceBefore)
const toAdd=Math.floor(entry.intersectionRect.height/this._averageHeight)+1
this._extendDrawnLines(-toAdd)
this._observer.observe(this._spaceBefore)}else{this._redrawFromScrollPos()}}}},{root:this.scrollNode,rootMargin:this.addMargin+"px 0px "+this.addMargin+"px 0px"})
this._observer.observe(this._spaceBefore)}_refresh(){super._refresh()
if(this._needRefreshDrawnBounds)this._updateDrawnBounds(this._firstLineOffset,this._afterLastLineOffset)}_resetBeforeRedraw(){super._resetBeforeRedraw()
this._firstLineOffset=0
this._afterLastLineOffset=0
this._spaceBefore.style.height="0"
this._spaceAfter.style.height="0"
this._needRefreshDrawnBounds=false}_getLine(offset){if(offset<this._firstLineOffset)return null
if(offset>=this._afterLastLineOffset)return null
return super._getLine(offset-this._firstLineOffset)}_getOffset(line){if(!line)return-1
return super._getOffset(line)+this._firstLineOffset}_rowCountChanged(offset,count){if(this._needRefreshContent||this._needRefreshCols)return
if(count>0){if(this._firstLineOffset===this._afterLastLineOffset){this._observer.unobserve(this._spaceAfter)
const end=offset+count
let offsetLine=offset
const objectiveHeight=this.scrollNode.clientHeight
if(!this._averageHeight){this._insertNewLine(offsetLine++,null)
this._averageHeight=this.linesNode.firstElementChild.offsetHeight}const maxRows=this._averageHeight?Math.floor(objectiveHeight/this._averageHeight)+1:0
for(const s=Math.min(offsetLine+maxRows,end);offsetLine<s;offsetLine++)this._insertNewLine(offsetLine,null)
this._updateDrawnBounds(offset,offsetLine)
this._observer.observe(this._spaceAfter)}else{if(offset>=this._firstLineOffset&&offset<=this._afterLastLineOffset){if(!this._averageHeight||this.scrollNode.clientHeight===0){const firstLine=this._getLine(offset)
if(firstLine){this._observer.unobserve(this._spaceAfter)
let removed=0
for(let line=this.linesNode.lastElementChild;line!==firstLine;line=this.linesNode.lastElementChild){line.remove()
removed++}firstLine.remove()
removed++
this._updateDrawnBounds(this._firstLineOffset,this._afterLastLineOffset-removed)
this._observer.observe(this._spaceAfter)}}else{let nextLine=this._getLine(offset)
let firstLineY
if(nextLine)firstLineY=nextLine.offsetTop
else{const lastLine=this.linesNode.lastElementChild
firstLineY=lastLine.offsetTop+lastLine.offsetHeight}const lastVisLineY=this.scrollNode.scrollTop+this.scrollNode.clientHeight+this.addMargin
const maxRows=Math.floor((lastVisLineY-firstLineY)/this._averageHeight)+1
if(count<maxRows){for(let i=0;i<count;i++)this._insertNewLine(offset+i,nextLine)
this._updateDrawnBounds(this._firstLineOffset,this._afterLastLineOffset+count)}else{this._observer.unobserve(this._spaceAfter)
while(nextLine&&count>0){this._redrawSelForLine(nextLine,offset)
this._redrawLine(nextLine,offset++)
count--
nextLine=nextLine.nextElementSibling}if(count>0){if(count>20)count=20
for(let i=0;i<count;i++)this._insertNewLine(offset+i,null)}else while(nextLine){const n=nextLine.nextElementSibling
nextLine.remove()
nextLine=n
count--}this._updateDrawnBounds(this._firstLineOffset,this._afterLastLineOffset+count)
this._observer.observe(this._spaceAfter)}}}else{this._updateDrawnBounds(this._firstLineOffset,this._afterLastLineOffset)}}}else{let newFirstLineOffset=this._firstLineOffset
let removed=0
if(offset<this._firstLineOffset){removed=this._firstLineOffset-offset
newFirstLineOffset-=removed
count-=removed
offset=this._firstLineOffset}let line=this._getLine(offset)
while(line&&count++!=0){const lineToDel=line
line=line.nextElementSibling
lineToDel.remove()
removed++}const newLastLineOffset=this._afterLastLineOffset-removed
if(newFirstLineOffset===newLastLineOffset&&newFirstLineOffset>0){this._ensureRowDrawn(--newFirstLineOffset)}this._updateDrawnBounds(newFirstLineOffset,newLastLineOffset)}this._refreshEmptyNode(this._afterLastLineOffset===0)}_insertNewLine(offset,insertBefore){const line=this._createLine()
this._redrawSelForLine(line,offset)
this.linesNode.insertBefore(line,insertBefore)
this._redrawLine(line,offset)}_ensureRowDrawn(offset){if(offset<this._firstLineOffset){const delta=this._firstLineOffset-offset
if(delta>(this._afterLastLineOffset-this._firstLineOffset)/2)this._redrawVisibleLinesAround(offset)
else this._extendDrawnLines(-delta)}else if(offset>=this._afterLastLineOffset){const delta=offset-this._afterLastLineOffset+1
if(delta>(this._afterLastLineOffset-this._firstLineOffset)/2)this._redrawVisibleLinesAround(offset)
else this._extendDrawnLines(delta)}}_extendDrawnLines(delta){let needMoreLines=(this.removeMargin*2+this.scrollNode.offsetHeight-this.linesNode.clientHeight)/(this._averageHeight||20)
if(delta<0){if(this._tiles>1)delta=Math.floor(delta/this._tiles)*this._tiles
let offset=this._firstLineOffset-1
let removed=0
for(const end=Math.max(this._firstLineOffset+delta,0);offset>=end;offset--){let line
if(needMoreLines>0){line=this._createLine()
needMoreLines--}else{line=this.linesNode.lastElementChild
removed++}this._redrawSelForLine(line,offset)
this.linesNode.insertBefore(line,this.linesNode.firstChild)
this._redrawLine(line,offset)}this._updateDrawnBounds(offset+1,this._afterLastLineOffset-removed)}else{let offset=this._afterLastLineOffset
let removed=0
for(const end=Math.min(offset+delta,this.dataHolder.countRows());offset<end;offset++){let line
if(needMoreLines>0){line=this._createLine()
needMoreLines--}else{line=this.linesNode.firstElementChild
removed++}this._redrawSelForLine(line,offset)
this.linesNode.appendChild(line)
this._redrawLine(line,offset)}if(this._tiles>1&&removed>0){let mod=removed%this._tiles
if(mod>0)while(mod++<this._tiles){this.linesNode.firstElementChild.remove()
removed++}}this._updateDrawnBounds(this._firstLineOffset+removed,offset)}}_redrawVisibleLinesAround(aroundOffset){this._observer.unobserve(this._spaceBefore)
this._observer.unobserve(this._spaceAfter)
let needMoreLines=(this.removeMargin*2+this.scrollNode.offsetHeight-this.linesNode.clientHeight)/(this._averageHeight||20)
const countLines=this._afterLastLineOffset-this._firstLineOffset
const maxOffset=this.dataHolder.countRows()
let startOffset=Math.max(0,Math.min(Math.round(aroundOffset-countLines/2),maxOffset-countLines))
if(this._tiles>1&&startOffset>0)startOffset=Math.floor(startOffset/this._tiles)*this._tiles
let offset=startOffset
let line=this.linesNode.firstElementChild
while(offset<maxOffset){if(!line){if(needMoreLines<=0)break
line=this.linesNode.appendChild(this._createLine())
needMoreLines--}this._redrawSelForLine(line,offset)
this._redrawLine(line,offset)
offset++
line=line.nextElementSibling}while(line){console.warn("Remove lines ??????? due to Tiles ???")
const next=line.nextElementSibling
line.remove()
line=next}this._updateDrawnBounds(startOffset,offset)
this._observer.observe(this._spaceBefore)
this._observer.observe(this._spaceAfter)}_redrawFromScrollPos(){let offset
const scrollTop=this.scrollNode.scrollTop
if(scrollTop===0){offset=0}else{const scrollH=this.scrollNode.scrollHeight
const visibleH=this.scrollNode.offsetHeight
if(scrollH-scrollTop<=visibleH){offset=this.dataHolder.countRows()}else{const ratioH=(scrollTop+visibleH/2)/scrollH
offset=Math.round(this.dataHolder.countRows()*ratioH)}}this._redrawVisibleLinesAround(offset)
super._ensureLineVisible(offset===0?this.linesNode.firstElementChild:this.linesNode.lastElementChild)}_updateDrawnBounds(firstOffset,afterLastOffset){this._firstLineOffset=firstOffset
this._afterLastLineOffset=afterLastOffset
if(this._refreshFreeze>0){this._needRefreshDrawnBounds=true
return}if(this._needRefreshDrawnBounds)this._needRefreshDrawnBounds=false
const countDrawn=afterLastOffset-firstOffset
if(countDrawn===0){this._spaceBefore.style.height="0"
this._spaceAfter.style.height="0"}else{const countRows=this.dataHolder.countRows()
this._averageHeight=this.linesNode.clientHeight/countDrawn
const averageH=Math.min(this._averageHeight||20,16777200/countRows)
this._spaceBefore.style.height=this._firstLineOffset===0?"0":Math.floor(this._firstLineOffset*averageH)+1+"px"
this._spaceAfter.style.height=this._afterLastLineOffset===countRows?"0":Math.floor((countRows-this._afterLastLineOffset)*averageH)+1+"px"}}}function truncateSel(sel,newCount){for(let i=0;i<sel.length;i++){const offset=sel[i]
if(offset>0||Object.is(offset,+0)){if(offset>=newCount){const toDel=sel[i+1]<0?2:1
sel.splice(i,toDel)
i-=toDel}}else{if(sel[i-1]===newCount-1){sel.splice(i--,1)}else{sel[i]=-(newCount-1)}}}return sel}REG.reg.registerSkin("c-grid",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tcursor: default;\n\t\t-moz-user-select: none;\n\t\t-webkit-user-select: none;\n\t\tuser-select: none;\n\t\tborder: 1px solid var(--border-color);\n\t}\n\n\t:host(:focus) {\n\t\toutline: none;\n\t}\n\n\t#scroll {\n\t\toverflow: auto;\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tbackground-color: var(--row-bgcolor);\n\t}\n\n\t#body {\n\t\tflex: 1 0 auto;\n\t\theight: fit-content;\n\t}\n\n\t#empty {\n\t\tposition: relative;\n\t\ttext-align: center;\n\t\tfont-size: var(--label-size);\n\t\tfont-style: italic;\n\t\tbackground-color: var(--row-bgcolor);\n\t}\n\n\t#headers {\n\t\tposition: sticky;\n\t\ttop: 0;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tz-index: 1;\n\t}\n\n\t#resizers {\n\t\tposition: absolute;\n\t\ttop: 0;\n\t\tbottom: 0;\n\t\tleft: 0;\n\t\tright: 0;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tpointer-events: none;\n\t}\n\n\tc-resizer {\n\t\tpointer-events: auto;\n\t\tcursor: e-resize;\n\t}\n\n\t.colW {\n\t\tbox-sizing: border-box;\n\t}\n\n\t.colW:not(:first-child) {\n\t\tborder-inline-start: 1px solid var(--border-color);\n\t}\n\n\t.line {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\t.markHolder {\n\t\tposition: relative;\n\t}\n\n\t.dropIn {\n\t\toutline: 2px solid #0000cc;\n\t}\n\n\tdrop-mark {\n\t\tposition: absolute;\n\t\tdisplay: block;\n\t\tbackground-color: #0000cc;\n\t\theight: 4px;\n\t\tleft: 0;\n\t\tright: 0;\n\t}\n\n\tdrop-mark[pos=before] {\n\t\ttop: -2px;\n\t}\n\n\tdrop-mark[pos=after] {\n\t\tbottom: -2px;\n\t}\n\n\tdrop-mark[pos=over] {\n\t\tbackground-color: rgba(0, 0, 204, 0.46);\n\t\ttop: 0;\n\t\theight: 100%;\n\t}\n\n\t.colH,\n\t.cell {\n\t\tbox-sizing: border-box;\n\t\toverflow: hidden;\n\t\tpadding: 2px 1px;\n\t}\n\n\t.colH {\n\t\tmax-height: 3em;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tpadding-top: 0;\n\t\tpadding-bottom: 0;\n\t\tbackground-color: var(--bgcolor);\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\t.cell {\n\t\twhite-space: nowrap;\n\t\ttext-overflow: ellipsis;\n\t\t/*background-position: 10px 0 !important;*/\n\t}\n\n\t.center {\n\t\ttext-align: center;\n\t}\n\n\t.right {\n\t\ttext-align: end;\n\t}\n\n\t.inSel {\n\t\tbackground-color: var(--row-inSel-unfocus-bgcolor);\n\t\t/*background-clip: content-box;*/\n\t}\n\n\t:host(:focus) .inSel {\n\t\tbackground-color: var(--row-inSel-bgcolor);\n\t}\n\n\t:host(:focus) .active {\n\t\toutline: var(--focus-outline);\n\t\toutline-offset: -2px;\n\t}\n\n\t.colBody {\n\t\tflex: 1;\n\t\tpadding: .2em;\n\t\ttext-align: center;\n\t\tfont-size: var(--label-size);\n\t}\n\n\tc-button[gridsort] {\n\t\tpadding-inline-end: 12px;\n\t\tborder: none;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tbackground: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/grid/sort_none.png) no-repeat right center;\n\t\talign-items: start;\n\t}\n\n\tc-button[gridsort="ascendant"] {\n\t\tbackground-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/grid/sort_asc.png);\n\t}\n\n\tc-button[gridsort="descendant"] {\n\t\tbackground-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/grid/sort_desc.png);\n\t}\n\n\t.icon {\n\t\tbackground-repeat: no-repeat;\n\t\tbackground-position: center;\n\t\tbackground-size: contain;\n\t}\n`)
REG.reg.registerSkin("c-grid/tileLayout",1,`\n\t:host #lines {\n\t\tdisplay: grid;\n\t\tgrid-template-columns: repeat(var(--grid-tiles-count), 1fr);\n\t}\n`)

//# sourceMappingURL=grid-tags.js.map