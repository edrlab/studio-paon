import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{GridDataHolderBase,GridDataRowJson,MxGridUntouchedDatas}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{GridSmall}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{EventMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
export class GridColTreeDef extends GridColDef{getCellBuilder(col){return new CellBuilderTreeRow(col,super.getCellBuilder(col),this._childrenIndent,this._onDblclick)}setChildrenIndent(width){this._childrenIndent=width
return this}setOnDblClick(onDblclick){this._onDblclick=onDblclick
return this}getTreeSkin(col){return typeof this._treeSkin==="function"?this._treeSkin(col):this._treeSkin}setTreeSkin(val){this._treeSkin=val
return this}getRowDropMgr(){return this._rowDropMgr}setRowDropMgr(mgr){this._rowDropMgr=mgr
return this}initCol(col){super.initCol(col)
if(col.grid.treeCol)throw Error("Only ONE treeCol can be defined in a tree: '"+col.grid.treeCol+"' and '"+col+"' declared")
col.grid.treeCol=col
col.treeSkin=REG.findReg(col.grid).installSkin(this.getTreeSkin(col)||"c-grid/tree",col.grid.shadowRoot)
col.grid.addEventListener("keydown",onKeydown)
if(this._rowDropMgr)col.grid.setRowDropMgr(this._rowDropMgr,onDragOverInScrollArea,onDropMarkChange)}onRemovedCol(col){super.onRemovedCol(col)
col.grid.treeCol=null
col.treeSkin.remove()
col.grid.removeEventListener("keydown",onKeydown)
if(this._rowDropMgr)col.grid.setRowDropMgr(null)}}export var EFolderState;(function(EFolderState){EFolderState["none"]="none"
EFolderState["closed"]="closed"
EFolderState["opened"]="opened"
EFolderState["opening"]="opening"})(EFolderState||(EFolderState={}))
export class GridDataHolderJsonTree extends GridDataHolderBase{constructor(childrenKey=""){super()
this.childrenKey=childrenKey
this.defaultOpenState=GridDataHolderJsonTree.defaultClosed}static defaultOpened(data){return true}static defaultClosed(data){return false}newDataRow(){return new GridDataRowJsonTree(this,null)}setDefaultOpenState(fn){this.defaultOpenState=fn
return this}setOpenAll(val){this.defaultOpenState=val?GridDataHolderJsonTree.defaultOpened:GridDataHolderJsonTree.defaultClosed
return this}openFolder(rowKey){if(!this.isRowKeyShown(rowKey)){this.openFolder(this.parent(rowKey))
if(!this.isRowKeyShown(rowKey))return false}const st=this.folderSt(rowKey)
if(st===EFolderState.opening)return true
if(st!==EFolderState.closed)return false
const children=this.ch(rowKey)
if(children===null){this.openFolderAsync(rowKey)
return true}this.setFolderSt(rowKey,EFolderState.opened)
let countSub=0
for(let i=0;i<children.length;i++)countSub+=1+this.subRowsShown(children[i])
this.updateSubRowsShown(rowKey,countSub)
const offset=this.getOffset(rowKey)
if(this.grid){this.grid.invalidateRows(offset,1)
this.grid.rowCountChanged(offset+1,countSub)}return true}async openFolderAsync(rowKey){if(this.ch(rowKey)===null){console.error("Method must be overriden!")
return false}return this.openFolder(rowKey)}isRowkeyAlive(rowKey){return this.parent(rowKey)!=null||this._datas.indexOf(rowKey)>=0}closeFolder(rowKey){const st=this.folderSt(rowKey)
if(st!==EFolderState.opened&&st!==EFolderState.opening)return false
this.setFolderSt(rowKey,EFolderState.closed)
const delta=-this.subRowsShown(rowKey)
this.updateSubRowsShown(rowKey,delta)
const offset=this.getOffset(rowKey)
this.grid.invalidateRows(offset,1)
if(delta!==0)this.grid.rowCountChanged(offset+1,delta)
return true}closeAllFolders(roots=this._datas,recursively){var _a,_b
if(!roots)return;(_a=this.grid)===null||_a===void 0?void 0:_a.refreshFreeze(1)
try{for(const d of roots){if(this.folderSt(d)===EFolderState.opened){if(recursively)this.closeAllFolders(this.ch(d),true)
this.closeFolder(d)}}}finally{(_b=this.grid)===null||_b===void 0?void 0:_b.refreshFreeze(-1)}}toggleFolder(rowKey){switch(this.folderSt(rowKey)){case EFolderState.opened:return this.closeFolder(rowKey)
case EFolderState.closed:return this.openFolder(rowKey)}return false}setDatas(datas,openIt){const old=this._datas
if(old)for(const ch of old)this._killRowData(ch)
for(const data of datas)this._initRowData(data,null,openIt||this.defaultOpenState)
super.setDatas(datas)
return this}setChilrenTo(parentRowKey,children,openIt){var _a
const sortFn=(_a=this._grid)===null||_a===void 0?void 0:_a.sortFn
if(sortFn)this._sortChildren(children,sortFn,true)
let ch=parentRowKey?this.ch(parentRowKey):this._datas
this.updateDatasInTree(parentRowKey,0,ch?ch.length:0,openIt,...children)}updateDatasInTree(parentRowKey,start,deleteCount,openIt,...insertEntries){let ch=parentRowKey?this.ch(parentRowKey):this._datas
if(ch==null){if(ch===undefined){this.setFolderSt(parentRowKey,EFolderState.closed)
this.setSubRowsShown(parentRowKey,0)}ch=this.setCh(parentRowKey,[])}if(start<0||ch.length<start-1)throw Error("Update insert "+start+" out of bounds 0-"+ch.length)
if(start+deleteCount>ch.length)throw Error("Deletes "+deleteCount+" after "+start+" out of bounds 0-"+ch.length)
let deleteShown=0
for(let i=start,m=start+deleteCount;i<m;i++){const row=ch[i]
deleteShown+=1+this.subRowsShown(row)
this._killRowData(row)}let insertRows=0
if(insertEntries)for(const data of insertEntries)insertRows+=this._initRowData(data,parentRowKey,openIt)
ch.splice(start,deleteCount,...insertEntries)
if(parentRowKey&&this.folderSt(parentRowKey)===EFolderState.opened)this.updateSubRowsShown(parentRowKey,insertRows-deleteShown)
if(!this._grid)return
const offset=this.getOffsetInChildren(parentRowKey,ch,start)
if(offset>=0)this._grid.spliceRows(offset,deleteShown,insertRows)}deleteRowKey(rowKey){const p=this.parent(rowKey)
const children=p?this.ch(p):this._datas
const offset=children.indexOf(rowKey)
if(offset<0)return false
this.updateDatasInTree(p,offset,1)
return true}replaceRowKey(currentRowKey,newData,preserveChildren){const parent=this.parent(currentRowKey)
const siblings=parent?this.ch(parent):this._datas
const index=siblings.indexOf(currentRowKey)
if(index<0)return false
if(preserveChildren){const ch=this.ch(currentRowKey)
siblings[index]=newData
this.setParent(newData,parent)
if(ch!==undefined){this.setCh(newData,ch)
this.setSubRowsShown(newData,this.subRowsShown(currentRowKey))
this.setFolderSt(newData,this.folderSt(currentRowKey))
if(ch!==null)for(const c of ch)this.setParent(c,newData)}if(this._grid){const offset=this.getOffset(newData)
if(offset>=0)this._grid.invalidateRows(offset,1)}}else{this.updateDatasInTree(parent,index,1,this.defaultOpenState,newData)}return true}insertRowKey(parentRowKey,newData){let children
if(parentRowKey){children=this.ch(parentRowKey)
if(!children)children=this.setCh(parentRowKey,[])}else{children=this._datas}this.updateDatasInTree(parentRowKey,this.findInsertPoint(children,newData),0,this.defaultOpenState,newData)}countRows(){let count=0
for(let i=0;i<this._datas.length;i++){count+=1+this.subRowsShown(this._datas[i])}return count}findVisibleData(filter,inCh){const ch=inCh||this._datas
for(const dCh of ch){if(filter(dCh))return dCh
if(this.folderSt(dCh)===EFolderState.opened){const subCh=this.ch(dCh)
if(subCh){const r=this.findVisibleData(filter,subCh)
if(r!=null)return r}}}return null}getDataByOffset(offset){if(offset>=0){let list=this._datas
let listIdx=0
let data=list[listIdx]
let currOffset=0
while(data&&currOffset<offset){currOffset++
const countCh=this.subRowsShown(data)
if(countCh>0){if(countCh+currOffset>offset){list=this.ch(data)
listIdx=0
data=list[listIdx]}else{currOffset+=countCh
data=list[++listIdx]}}else{data=list[++listIdx]}}return data}return null}getRow(offset){if(offset>=0){const data=this.getDataByOffset(offset)
if(!data)return null
this._fakeRow.rowDatas=data
return this._fakeRow}return null}getRowKey(offset){return this.getDataByOffset(offset)}getOffset(rowKey){let offset=0
let child=rowKey
let parent=this.parent(child)
let list=parent?this.ch(parent):this._datas
do{if(parent&&this.subRowsShown(parent)===0)return-1
for(let i=0;i<list.length;i++){if(list[i]===child)break
offset+=1+this.subRowsShown(list[i])}if(parent){offset++
child=parent
parent=this.parent(parent)
list=parent?this.ch(parent):this._datas}else{list=null}}while(list)
return offset}getOffsetInChildren(parentRowKey,children,index){if(index===0){if(parentRowKey){const offset=this.getOffset(parentRowKey)
if(offset<0)return offset
if(offset>=0&&this.folderSt(parentRowKey)===EFolderState.opened)return offset+1
return-1}return 0}const previous=children[index-1]
const offset=this.getOffset(previous)
if(offset<0)return offset
return offset+this.subRowsShown(previous)+1}getRowKeyFolderState(rowKey){return this.folderSt(rowKey)||EFolderState.none}isRowKeyFolderStateSwitchable(rowKey){return true}getRowKeyParent(rowKey){return this.parent(rowKey)}getRowKeyChildren(rowKey){return rowKey?this.ch(rowKey):null}getRowKeyIndex(rowKey){if(!rowKey)return-1
const p=this.parent(rowKey)
const ch=p?this.ch(p):this._datas
if(!ch)return-1
return ch.indexOf(rowKey)}isRowKeyAncestor(ancRowKey,descRowKey){let p=this.parent(descRowKey)
while(p){if(p===ancRowKey)return true
p=this.parent(p)}return false}isRowKeyShown(rowKey){let p=this.parent(rowKey)
while(p){if(this.folderSt(p)!==EFolderState.opened)return false
p=this.parent(p)}return true}forceRowKeyShown(rowKey){let p=this.parent(rowKey)
while(p){if(this.folderSt(p)!==EFolderState.opened)this.openFolder(p)
p=this.parent(p)}}resetAsyncChildren(rowKey){const chList=this.ch(rowKey)
if(chList===undefined)return
this.setFolderSt(rowKey,EFolderState.closed)
this.updateSubRowsShown(rowKey,-this.subRowsShown(rowKey))
if(chList!==null){for(const ch of chList)this._killRowData(ch)
this.setCh(rowKey,null)}}updateSubRowsShown(rowKey,delta){if(delta===0||!rowKey)return
do{this.setSubRowsShown(rowKey,this.subRowsShown(rowKey)+delta)
rowKey=this.parent(rowKey)}while(rowKey&&this.folderSt(rowKey)===EFolderState.opened)}_tryBuildDatas(){if(!this._grid)return
if(this._datas.length>0){const sortFn=this._grid.sortFn
if(sortFn){this._sortChildren(this._datas,sortFn,true)}this._grid.rowCountChanged(0,this.countRows())}}_sortDatas(datas,sortFn){this._sortChildren(datas,sortFn,true)}_sortChildren(array,sortFn,recursive){this._initRowDatas()
array.sort((d1,d2)=>{this.r1.rowDatas=d1
this.r2.rowDatas=d2
return sortFn(this.r1,this.r2)})
if(recursive)for(let i=0;i<array.length;i++){const ch=this.ch(array[i])
if(ch&&ch.length>0)this._sortChildren(ch,sortFn,true)}}_initRowData(data,parent,openIt){if(parent)this.setParent(data,parent)
const children=this.ch(data)
if(children!==undefined){if(openIt&&openIt(data)){let countDesc=0
this.setFolderSt(data,EFolderState.opened)
if(children!==null)for(const ch of children)countDesc+=this._initRowData(ch,data,openIt)
this.setSubRowsShown(data,countDesc)
return countDesc+1}this.setFolderSt(data,EFolderState.closed)
if(children!==null)for(const ch of children)this._initRowData(ch,data,openIt)
this.setSubRowsShown(data,0)}return 1}_killRowData(data){this.setParent(data,undefined)
const children=this.ch(data)
if(children)for(const ch of children)this._killRowData(ch)}ch(parent){return parent[this.childrenKey]}setCh(parent,ch){parent[this.childrenKey]=ch
return ch}parent(data){return data[parentSym]}setParent(child,parent){child[parentSym]=parent
return parent}folderSt(data){return data[folderStateSym]}setFolderSt(data,s){data[folderStateSym]=s
return s}subRowsShown(parent){return parent[subRowsShownSym]||0}setSubRowsShown(parent,count){parent[subRowsShownSym]=count}}const folderStateSym=Symbol("folderStateSym")
const parentSym=Symbol("parentSym")
const subRowsShownSym=Symbol("subRowsShownSym")
export class GridDataRowJsonTree extends GridDataRowJson{constructor(dataHolder,rowDatas){super(dataHolder,rowDatas)}getFolderState(){return this.dataHolder.getRowKeyFolderState(this.rowDatas)}isFolderStateSwitchable(){return this.dataHolder.isRowKeyFolderStateSwitchable(this.rowDatas)}getDepth(){let depth=0
for(let parent=this.dataHolder.parent(this.rowDatas);parent;parent=this.dataHolder.parent(parent))depth++
return depth}getNextSiblingAncestors(){const result=[]
let child=this.rowDatas
for(let parent=this.dataHolder.parent(child);parent;parent=this.dataHolder.parent(parent)){const children=this.dataHolder.ch(parent)
result.push(children[children.length-1]!==child)
child=parent}return result}}export function MxGridTreeUntouchedDatas(Base){return class MxGridTreeUntouchedDatas extends(MxGridUntouchedDatas(Base)){constructor(){super(...arguments)
this.intProps=new WeakMap}parent(data){var _a
return(_a=this.intProps.get(data))===null||_a===void 0?void 0:_a.parent}setParent(child,parent){let p=this.intProps.get(child)
if(!p)this.intProps.set(child,p=Object.create(null))
p.parent=parent
return parent}folderSt(data){var _a
return(_a=this.intProps.get(data))===null||_a===void 0?void 0:_a.folderSt}setFolderSt(data,s){let p=this.intProps.get(data)
if(!p)this.intProps.set(data,p=Object.create(null))
p.folderSt=s
return s}subRowsShown(parent){var _a
return((_a=this.intProps.get(parent))===null||_a===void 0?void 0:_a.subRowsShown)||0}setSubRowsShown(parent,count){let p=this.intProps.get(parent)
if(!p)this.intProps.set(parent,p=Object.create(null))
p.subRowsShown=count}_killRowData(data){}}}export class CellBuilderTreeRow{constructor(col,labelBuilder,childrenIndent,onDblclick){this.col=col
this.labelBuilder=labelBuilder
this.drawTreeLines=false
this.childrenIndent=childrenIndent||.8
if(onDblclick)this.onDblclick=onDblclick}setDrawTreeLines(draw){this.drawTreeLines=draw
return this}setChildrenIndent(width){this.childrenIndent=width
return this}redrawCell(row,root){const struct=root
if(!struct.twisty){struct.twisty=root.appendChild(document.createElement("x-twisty"))
struct.box=root.appendChild(document.createElement("span"))
struct.twisty.onpointerdown=toggleFolderTwisty
struct.twisty.onclick=struct.twisty.ondblclick=function(ev){if(!this.classList.contains("none"))ev.stopPropagation()}
switch(this.onDblclick){case"none":break
case"open":struct.ondblclick=openFolderCell
break
default:struct.ondblclick=toggleFolderCell}}struct.rowKey=row.rowKey
DOM.setAttr(struct.twisty,"class",row.isFolderStateSwitchable()?row.getFolderState():"none")
const siblings=this.drawTreeLines?row.getNextSiblingAncestors():null
if(siblings==null){const width=row.getDepth()*this.childrenIndent+"em"
DOM.setStyle(struct.twisty,"margin-inline-start",width)}else if(siblings.length>0){let space=struct.twisty.previousElementSibling
if(!space)space=root.insertBefore(document.createElement("x-space"),root.firstChild)
DOM.setAttr(space,"class",siblings[0]?"T":"L")
space=space.previousElementSibling
for(let i=1;i<siblings.length;i++){if(!space)space=root.insertBefore(document.createElement("x-space"),root.firstChild)
DOM.setAttr(space,"class",siblings[i]?"I":null)
space=space.previousElementSibling}while(space){const prev=space.previousElementSibling
space.remove()
space=prev}}this.labelBuilder.redrawCell(row,struct.box)}getColSortFn(){return this.labelBuilder.getColSortFn()}}function toggleFolderCell(ev){if(this.classList.contains("none"))return
DOMSH.findHost(this).dataHolder.toggleFolder(this.rowKey)}function openFolderCell(ev){if(this.classList.contains("none"))return
DOMSH.findHost(this).dataHolder.openFolderAsync(this.rowKey)}function toggleFolderTwisty(ev){if(this.classList.contains("none"))return
ev.stopPropagation()
DOMSH.findHost(this).dataHolder.toggleFolder(this.parentNode.rowKey)}function onKeydown(ev){const activeRow=this.getActiveRow()
if(activeRow<0)return
const row=this.dataHolder.getRow(activeRow)
if(!row)return
switch(ev.key){case"ArrowLeft":if(window.getComputedStyle(this).direction==="rtl"){if(!this.dataHolder.openFolder(row.rowKey)){this.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowDown"}))
return}}else{if(!this.dataHolder.closeFolder(row.rowKey)){this.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowUp"}))
return}}this.ensureRowVisible(activeRow)
break
case"ArrowRight":if(window.getComputedStyle(this).direction==="rtl"){if(!this.dataHolder.closeFolder(row.rowKey)){this.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowUp"}))
return}}else{if(!this.dataHolder.openFolder(row.rowKey)){this.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowDown"}))
return}}this.ensureRowVisible(activeRow)
break
case"Enter":if(!this.dataHolder.toggleFolder(row.rowKey))return
this.ensureRowVisible(activeRow)
break
default:return}if(this.shadowRoot.activeElement!==null)this.focus()}function onDragOverInScrollArea(ev){GridSmall.onDragOverInScrollArea.call(this,ev)
const grid=DOMSH.findHost(this)
const line=grid._dropMark.parentElement
if(line&&line.classList.contains("line")){const treeCell=grid._getCellInLine(line,grid.treeCol)
const twisty=treeCell.firstElementChild
let left=twisty.offsetLeft+twisty.offsetWidth-line.offsetLeft
if(grid._dropMark.getAttribute("pos")==="after"&&twisty.className!=="none"){left+=twisty.offsetWidth}DOM.setStyleStart(grid._dropMark,left+"px")
if(!grid.dragOverTimer&&twisty.classList.contains("closed")){const rowKey=grid.dataHolder.getRow(grid._getOffset(line)).rowKey
grid.dragOverTimer=setTimeout(()=>{grid.dataHolder.openFolder(rowKey)},800)}}else{DOM.setStyleStart(grid._dropMark,"0px")}}function onDropMarkChange(){if(this.dragOverTimer){clearTimeout(this.dragOverTimer)
this.dragOverTimer=0}}REG.reg.registerSkin("c-grid/tree",1,`\n\tx-twisty {\n\t\tpadding-inline-start: 1em;\n\t\tunicode-bidi: isolate;\n\t\tcursor: pointer;\n\t}\n\n\tx-twisty.closed {\n\t\tbackground: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/grid/closed.svg) no-repeat center / 1em;\n\t}\n\n\tx-twisty.opened {\n\t\tbackground: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/grid/opened.svg) no-repeat center / 1em;\n\t}\n\n\tx-twisty.closed:hover,\n\tx-twisty.opened:hover {\n\t\tfilter: var(--hover-filter);\n\t\tbackground-color: var(--row-inSel-unfocus-bgcolor);\n\t}\n\n\tx-twisty.none {\n\t\tbackground: none;\n\t}\n`)
export class GridArrayToTree{constructor(target){this._idMap=new Map
this._target=target||new GridDataHolderJsonTree
this._lstn=this.onWillUpdate.bind(this)}get categorizer(){return this._categorizer}get target(){return this._target}get provider(){return this._provider}setCategorizer(categorizer){this._categorizer=categorizer
this.tryBind()
return this}setProvider(provider){if(this._provider)this._provider.onWillUpdate.delete(this._lstn)
this._provider=provider
this.tryBind()
return this}getTargetEntryById(id){return this._idMap.get(id)}tryBind(){if(this._categorizer&&this._provider){this.rebuildAll(this._provider.getDatas());(this._provider.onWillUpdate||(this._provider.onWillUpdate=new EventMgr)).add(this._lstn)}}onWillUpdate(start,deleteCount,...insertEntries){if(start===0&&deleteCount===this._provider.countRows()){this.rebuildAll(insertEntries)
return}const categ=this._categorizer
for(let i=start,end=start+deleteCount;i<end;i++){const d=this._provider.getDataByOffset(i)
const id=categ.getId(d)
const e=this._idMap.get(id)
if(e){this._idMap.delete(id)
let p=this._target.getRowKeyParent(e)
this._target.deleteRowKey(e)
while(p){const ch=this._target.getRowKeyChildren(p)
if((!ch||ch.length===0)&&categ.shouldRemoveEmptyFolder(p)){this._idMap.delete(categ.getId(p))
const newP=this._target.getRowKeyParent(p)
this._target.deleteRowKey(p)
p=newP}else break}}}if(!insertEntries)return
const eList=[]
for(const d of insertEntries){const e=categ.wrapForTree(d)
if(e){eList.push(e)
this._idMap.set(categ.getId(d),e)}else{this._idMap.delete(categ.getId(d))}}for(const e of eList){const stack=categ.getAncestorIds(e)
let parent=null
if(stack)for(let i=stack.length-1;i>=0;i--){parent=this._idMap.get(stack[i])
if(parent){for(i++;i<stack.length;i++){const subP=categ.getFolder(stack[i])
this._idMap.set(stack[i],subP)
this._target.insertRowKey(parent,subP)
parent=subP}break}}this._target.insertRowKey(parent,e)}}rebuildAll(srcData){const categ=this._categorizer
this._idMap.clear()
if(!srcData||srcData.length===0){this._target.setDatas([])
return}for(const d of srcData){const e=categ.wrapForTree(d)
if(e)this._idMap.set(categ.getId(d),e)}const dst=[]
for(const e of this._idMap.values()){let list
const stack=categ.getAncestorIds(e)
if(stack){let i=stack.length-1
for(;i>=0;i--){const parent=this._idMap.get(stack[i])
if(parent){list=this._target.ch(parent)
if(!list)list=this._target.setCh(parent,[])
break}}if(!list){list=dst}for(i++;i<stack.length;i++){const subP=categ.getFolder(stack[i])
this._idMap.set(stack[i],subP)
list=this._target.ch(subP)
if(!list)list=this._target.setCh(subP,[])}}(list||dst).push(e)}this._target.setDatas(dst)}}
//# sourceMappingURL=tree.js.map