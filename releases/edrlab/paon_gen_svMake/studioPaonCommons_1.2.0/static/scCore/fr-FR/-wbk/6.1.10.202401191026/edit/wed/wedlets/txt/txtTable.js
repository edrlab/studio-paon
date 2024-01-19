import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{TxtSelMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/txtSel.js"
import{WedEditAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedEditor.js"
import{TxtColModel,TxtTableModel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txt.js"
import{InsertParaSibling,registerTxtAction,TxtInsertAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtActions.js"
import{TxtCell,TxtCol,TxtRow,TxtTable}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtTags.js"
import{findTxtEltParent}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtUtils.js"
import{ACTION,Action,ActionMenu,EnumEntryAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
class InsertTable extends TxtInsertAction{constructor(){super()
this._label=ctx=>ctx.txtRoot.getTxtWedModel(this.tagName,this.role).nodeLabel}isVisible(ctx){if(getTableFromSel(ctx.txtRoot.selMgrAsIs))return false
return super.isVisible(ctx)}isMenu(ctx){return true}getDatas(api,ctx){return[new CountCells(false,ctx.txtRoot.getTxtWedModel(this.tagName,this.role),10,6)]}}registerTxtAction("insertTable",InsertTable)
export class OpenTableLayout extends Action{initFromWed(conf){}isVisible(ctx){if(!getTableFromSel(ctx.txtRoot.selMgrAsIs))return false
return super.isVisible(ctx)}initButtonNode(buttonNode,ctx){buttonNode.accel=ACTION.getLocalizedKey("Insert")}execute(ctx,ev){const table=getTableFromSel(ctx.txtRoot.selMgr)
if(table)table.tableLayout.toggle()}}registerTxtAction("openTableLayout",OpenTableLayout)
export class CloseTableLayout extends WedEditAction{initFromWed(conf){}initButtonNode(buttonNode,ctx){buttonNode.accel=ACTION.getLocalizedKey("Insert")}execute(ctx,ev){ctx.txTable.tableLayout.closeTableLayout()}}registerTxtAction("closeTableLayout",CloseTableLayout)
class InsertRow extends TxtInsertAction{constructor(){super()
this._label=ctx=>ctx.txTable.getTxtWedModel(this.tagName,this.role).nodeLabel}initFromWed(elt){super.initFromWed(elt)
this.maxEntries=parseInt(elt.getAttribute("max"),10)||10}isMenu(ctx){return true}getDatas(api,ctx){const rect=ctx.logicTable.getSelRect()
const model=ctx.txTable.getTxtWedModel(this.tagName,this.role)
if(rect.endRow===ctx.logicTable.logicRows.length){return[new SelectBeforeAfter(false,model,this.maxEntries,1).setLabel("Insérer avant la sélection"),new SelectBeforeAfter(true,model,this.maxEntries,1).setLabel("Insérer en fin de tableau")]}else{return[new CountCells(false,model,this.maxEntries,1)]}}}registerTxtAction("insertRow",InsertRow)
class SelectBeforeAfter extends ActionMenu{constructor(after,model,maxRows,maxCols){super(after?"after":"before")
this.model=model
this.maxRows=maxRows
this.maxCols=maxCols}getActions(ctx){return[new CountCells(this.getId()==="after",this.model,this.maxRows,this.maxCols)]}}class CountCells extends Action{constructor(after,model,maxRows,maxCols){super(after?"after":"before")
this.after=after
this.model=model
this.maxRows=maxRows
this.maxCols=maxCols}buildCustomButton(ctx,uiContext,parent){return(new CountCellsBtn).initialize({reg:REG.findReg(ctx.txtRoot),action:this,actionContext:ctx,uiContext:uiContext,role:"button",skin:"txt-countcells-btn"})}async execute(ctx,ev){const selMgr=ctx.txtRoot.selMgr.restoreSel()
if(this.model instanceof TxtTableModel){const ctn=InsertParaSibling.findContainer(ctx,selMgr)
if(ctn){let jml
if(this.model.hasOnCreateHook){jml=await this.model.callOnCreateHook(ctn)
if(!jml||TxtInsertAction.isInsertPointLost(ctx,ctn,selMgr))return}else{jml=[this.model.newJml()]}let content
if(jml.length>1){content=jml[1]}else{jml.push(content=[])}const colM=this.model.colModels[0]
const colTpl=colM.newJml()
colM.widthMgr(ctx.txtRoot.wedMgr).fillDefault(colM,colTpl)
for(let c=0;c<this.countCols;c++)content.push(colTpl)
const rowM=this.model.rowModels[0]
const cellM=rowM.cellModels[0]
const cellTpl=cellM.newJml()
for(let r=0;r<this.countRows;r++){content.push(rowM.newJml())
const rowContent=[]
for(let c=0;c<this.countCols;c++)rowContent.push(cellTpl)
content.push(rowContent)}InsertParaSibling.doInsert(jml,ctx,selMgr,ev)}}else{const tableLayout=ctx.txTable.tableLayout
const rect=ctx.logicTable.getSelRect()
const batch=ctx.txtRoot.wedlet.wedMgr.docHolder.newBatch(newCellRange(tableLayout.focusCell,tableLayout.anchorCell))
batch.setMeta(TxtSelMgr.MSGMETA_tblLayout,true)
if(this.model instanceof TxtColModel){ctx.logicTable.insertCols(batch,this.after?ctx.txTable.countCols():ctx.logicTable.getSelRect().startCol,this.model,this.countCols)}else{ctx.logicTable.insertRows(batch,this.after?ctx.logicTable.logicRows.length:ctx.logicTable.getSelRect().startRow,this.model,this.countRows)}batch.doBatch()}}}class CountCellsBtn extends ActionBtn{_initialize(init){super._initialize(init)
const sh=this.shadowRoot
if(this.action.maxCols===1){const section=sh.appendChild(document.createElement("section"))
section.classList.add("rows")
for(let i=0;i<this.action.maxRows;i++)section.appendChild(document.createElement("div"))
this._label="Nb. de lignes"
this.setCurrentCell(section.querySelector("div"))}else if(this.action.maxRows===1){const section=sh.appendChild(document.createElement("section"))
section.classList.add("cols")
for(let i=0;i<this.action.maxCols;i++)section.appendChild(document.createElement("div"))
this._label="Nb. de colonnes"
this.setCurrentCell(section.querySelector("div"))}else{const table=sh.appendChild(document.createElement("table"))
for(let i=0;i<this.action.maxRows;i++){const tr=table.appendChild(document.createElement("tr"))
for(let c=0;c<this.action.maxRows;c++)tr.appendChild(document.createElement("td"))}this._label="Dim. du tableau"
this.setCurrentCell(table.querySelector("td"))}this.shadowRoot.addEventListener("mousemove",this.onMouseMove)
this.addEventListener("keydown",this.onKeydown)}onMouseMove(ev){if(ev.target.localName==="div"||ev.target.localName==="td")this.host.setCurrentCell(ev.target)}onKeydown(ev){switch(ev.key){case"ArrowLeft":const prev=window.getComputedStyle(this).direction||"ltr"?this.lastCell.previousSibling:this.lastCell.nextSibling
if(prev){this.setCurrentCell(prev)
ev.stopImmediatePropagation()}break
case"ArrowUp":if(this.lastCell.localName==="td"){const row=this.lastCell.parentNode.previousSibling
if(row)this.setCurrentCell(row.childNodes.item(DOM.computeOffset(this.lastCell)))}else{this.setCurrentCell(this.lastCell.previousSibling)}ev.stopImmediatePropagation()
break
case"ArrowRight":const next=window.getComputedStyle(this).direction||"ltr"?this.lastCell.nextSibling:this.lastCell.previousSibling
if(next){this.setCurrentCell(next)
ev.stopImmediatePropagation()}break
case"ArrowDown":if(this.lastCell.localName==="td"){const row=this.lastCell.parentNode.nextSibling
if(row)this.setCurrentCell(row.childNodes.item(DOM.computeOffset(this.lastCell)))}else{this.setCurrentCell(this.lastCell.nextSibling)}ev.stopImmediatePropagation()
break}}setCurrentCell(elt){if(!elt||elt===this.lastCell)return
this.lastCell=elt
DOM.addClass(this.lastCell,"sel")
DOM.findPreviousSibling(this.lastCell,n=>{DOM.addClass(n,"sel")})
DOM.findNextSibling(this.lastCell,n=>{DOM.removeClass(n,"sel")})
if(this.lastCell.localName==="td"){const limitRow=this.lastCell.parentNode
this.action.countCols=DOM.computeOffset(this.lastCell,0,n=>DOM.IS_element(n)&&n.localName==="td")+1
this.action.countRows=DOM.computeOffset(limitRow,0,n=>DOM.IS_element(n)&&n.localName==="tr")+1
if(this._labelElt)this._labelElt.textContent=this.action.countCols+" x "+this.action.countRows
let row=limitRow.previousElementSibling
while(row){let cell=row.firstElementChild
for(let i=0;i<this.action.countCols;i++){DOM.addClass(cell,"sel")
cell=cell.nextElementSibling}while(cell){DOM.removeClass(cell,"sel")
cell=cell.nextElementSibling}row=row.previousElementSibling}row=limitRow.nextElementSibling
while(row){DOM.findFirstChild(row,n=>{DOM.removeClass(n,"sel")})
row=row.nextElementSibling}}else{const count=DOM.computeOffset(this.lastCell,0,n=>DOM.IS_element(n)&&n.localName==="div")+1
if(this.action.maxCols===1){this.action.countRows=count}else{this.action.countCols=count}if(this._labelElt)this._labelElt.textContent=count.toFixed(0)}}}customElements.define("txt-countcells-btn",CountCellsBtn)
REG.reg.registerSkin("txt-countcells-btn",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\ttable {\n\t\ttable-layout: fixed;\n\t\tborder-collapse: collapse;\n\t}\n\n\t.rows {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 8em;\n\t\tflex-direction: column;\n\t\tborder: 1px solid var(--border-color);\n\t}\n\n\t.cols {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\theight: 5em;\n\t\tborder: 1px solid var(--border-color);\n\t}\n\n\ttd {\n\t\twidth: .8em;\n\t\theight: .8em;\n\t\tbackground-color: white;\n\t\tborder: 1px solid var(--border-color);\n\t}\n\n\tdiv {\n\t\tflex: 1;\n\t\tmin-height: .8em;\n\t\tmin-width: .8em;\n\t\tbackground-color: white;\n\t\tborder: 1px solid var(--border-color);\n\t}\n\n\t.sel {\n\t\tbackground-color: darkblue;\n\t}\n\n\t.label {\n\t\ttext-align: center;\n\t\tfont-size: var(--label-size);\n\t}\n`)
class InsertCol extends InsertRow{getDatas(api,ctx){const rect=ctx.logicTable.getSelRect()
const model=ctx.txTable.getTxtWedModel(this.tagName,this.role)
if(rect.endCol===ctx.txTable.countCols()){return[new SelectBeforeAfter(false,model,1,this.maxEntries).setLabel("Insérer avant la sélection"),new SelectBeforeAfter(true,model,1,this.maxEntries).setLabel("Insérer en fin de tableau")]}else{return[new CountCells(false,model,1,this.maxEntries)]}}}registerTxtAction("insertCol",InsertCol)
class DeleteRows extends WedEditAction{initFromWed(elt){}isEnabled(ctx){if(!WEDLET.isWritableWedlet(ctx.txtRoot.wedlet))return false
if(!super.isEnabled(ctx))return false
const rect=ctx.logicTable.getSelRect()
return ctx.logicTable.logicRows.length>rect.endRow-rect.startRow}execute(ctx,ev){ctx.txtRoot.selMgr.restoreSel()
const tableLayout=ctx.txTable.tableLayout
const rect=ctx.logicTable.getSelRect()
const batch=ctx.txtRoot.wedlet.wedMgr.docHolder.newBatch(newCellRange(tableLayout.focusCell,tableLayout.anchorCell))
batch.setMeta(TxtSelMgr.MSGMETA_tblLayout,true)
ctx.logicTable.deleteRows(batch,rect.startRow,rect.endRow-rect.startRow)
batch.setSelAfterRange(newCellRange(ctx.logicTable.getTxtCellAt(rect.startRow,0),ctx.logicTable.getTxtCellAt(rect.startRow,ctx.txTable.countCols()-1)))
batch.doBatch()}}registerTxtAction("deleteRows",DeleteRows)
class DeleteCols extends WedEditAction{initFromWed(elt){}isEnabled(ctx){if(!WEDLET.isWritableWedlet(ctx.txtRoot.wedlet))return false
if(!super.isEnabled(ctx))return false
const rect=ctx.logicTable.getSelRect()
return ctx.txTable.countCols()>rect.endCol-rect.startCol}execute(ctx,ev){ctx.txtRoot.selMgr.restoreSel()
const tableLayout=ctx.txTable.tableLayout
const rect=ctx.logicTable.getSelRect()
const batch=ctx.txtRoot.wedlet.wedMgr.docHolder.newBatch(newCellRange(tableLayout.focusCell,tableLayout.anchorCell))
batch.setMeta(TxtSelMgr.MSGMETA_tblLayout,true)
ctx.logicTable.deleteCols(batch,rect.startCol,rect.endCol-rect.startCol)
batch.doBatch()}}registerTxtAction("deleteCols",DeleteCols)
class DeleteArray extends WedEditAction{initFromWed(elt){}isEnabled(ctx){if(!WEDLET.isWritableWedlet(ctx.txtRoot.wedlet))return false
return super.isEnabled(ctx)}execute(ctx,ev){if(!WEDLET.isWritableWedlet(ctx.txtRoot.wedlet))return false
ctx.txtRoot.selMgr.restoreSel()
const tableLayout=ctx.txTable.tableLayout
const batch=ctx.txtRoot.wedlet.wedMgr.docHolder.newBatch(newCellRange(tableLayout.focusCell,tableLayout.anchorCell))
batch.setMeta(TxtSelMgr.MSGMETA_tblLayout,true)
batch.deleteSequence(ctx.txTable.wedAnchor,1)
batch.doBatch()}}registerTxtAction("deleteArray",DeleteArray)
class MergeCells extends WedEditAction{initFromWed(elt){}isEnabled(ctx){if(!WEDLET.isWritableWedlet(ctx.txtRoot.wedlet))return false
if(!super.isEnabled(ctx))return false
const tableLayout=ctx.txTable.tableLayout
if(tableLayout.focusCell===tableLayout.anchorCell)return false
const focusOffs=ctx.logicTable.getLogicOffsets(tableLayout.focusCell)
const anchorOffs=ctx.logicTable.getLogicOffsets(tableLayout.anchorCell)
const masterCell=ctx.logicTable.getLocicCellAt(Math.min(focusOffs.offsRow,anchorOffs.offsRow),Math.min(focusOffs.offsCol,anchorOffs.offsCol))
return masterCell instanceof MasterCell||masterCell instanceof TxtCell}execute(ctx,ev){ctx.txtRoot.selMgr.restoreSel()
const tableLayout=ctx.txTable.tableLayout
const focusOffs=ctx.logicTable.getLogicOffsets(tableLayout.focusCell)
const anchorOffs=ctx.logicTable.getLogicOffsets(tableLayout.anchorCell)
const startRow=Math.min(focusOffs.offsRow,anchorOffs.offsRow)
const startCol=Math.min(focusOffs.offsCol,anchorOffs.offsCol)
const masterCell=ctx.logicTable.getLocicCellAt(startRow,startCol)
if(masterCell instanceof MasterCell||masterCell instanceof TxtCell){const masterTxtCell=masterCell instanceof MasterCell?masterCell.txtCell:masterCell
const batch=ctx.txtRoot.wedlet.wedMgr.docHolder.newBatch(newCellRange(tableLayout.focusCell,tableLayout.anchorCell))
batch.setMeta(TxtSelMgr.MSGMETA_tblLayout,true)
const endRow=Math.max(focusOffs.offsRow+tableLayout.focusCell.getRowSpan(),anchorOffs.offsRow+tableLayout.anchorCell.getRowSpan())
const endCol=Math.max(focusOffs.offsCol+tableLayout.focusCell.getColSpan(),anchorOffs.offsCol+tableLayout.anchorCell.getColSpan())
ctx.logicTable.mergeCells(batch,masterTxtCell,endRow-startRow,endCol-startCol)
batch.setSelAfter(masterTxtCell.wedAnchor)
batch.doBatch()}}}registerTxtAction("mergeCells",MergeCells)
class UnmergeCells extends WedEditAction{initFromWed(elt){}isEnabled(ctx){if(!WEDLET.isWritableWedlet(ctx.txtRoot.wedlet))return false
if(!super.isEnabled(ctx))return false
const rect=ctx.logicTable.getSelRect()
for(let r=rect.endRow-1;r>=rect.startRow;r--){const lRow=ctx.logicTable.logicRows[r]
for(let c=rect.endCol-1;c>=rect.startCol;c--){if(lRow[c]instanceof MasterCell)return true}}return false}execute(ctx,ev){ctx.txtRoot.selMgr.restoreSel()
const tableLayout=ctx.txTable.tableLayout
const rect=ctx.logicTable.getSelRect()
const rg=newCellRange(tableLayout.focusCell,tableLayout.anchorCell)
const batch=ctx.txtRoot.wedlet.wedMgr.docHolder.newBatch(rg)
batch.setSelAfterRange(XA.cloneRange(rg))
batch.setMeta(TxtSelMgr.MSGMETA_tblLayout,true)
for(let r=rect.endRow-1;r>=rect.startRow;r--){const lRow=ctx.logicTable.logicRows[r]
for(let c=rect.endCol-1;c>=rect.startCol;c--){const lCell=lRow[c]
if(lCell instanceof MasterCell)ctx.logicTable.mergeCells(batch,lCell.txtCell,1,1)}}batch.doBatch()}}registerTxtAction("unmergeCells",UnmergeCells)
class SetRoleRow extends WedEditAction{initFromWed(elt){}initButtonNode(buttonNode,ctx){ctx.wedMgr.reg.installSkin("txt-table/enumAction",buttonNode.shadowRoot)
buttonNode.setAttribute("role","menu")
if(this._label)buttonNode.title=this._label
buttonNode._hideLabel=false}isEnabled(ctx){if(!WEDLET.isWritableWedlet(ctx.txtRoot.wedlet))return false
return super.isEnabled(ctx)}getLabel(ctx){const rect=ctx.logicTable.getSelRect()
const label=ctx.logicTable.logicRows[rect.startRow].txtRow.model.nodeLabel
for(let r=rect.startRow+1;r<rect.endRow;r++){if(label!==ctx.logicTable.logicRows[r].txtRow.model.nodeLabel)return" "}return label}async execute(ctx,ev){ctx.txtRoot.selMgr.restoreSel()
let rect=ctx.logicTable.getSelRect()
const usedRoles={}
for(let r=rect.startRow;r<rect.endRow;r++){const row=ctx.logicTable.logicRows[r].txtRow
if(usedRoles[row.txtRole])usedRoles[row.txtRole]++
else usedRoles[row.txtRole]=1}const total=rect.endRow-rect.startRow
const roles=[]
for(const m of ctx.txTable.model.rowModels){if(m.role==null)continue
const count=usedRoles[m.role]||0
roles.push(new EnumEntryAction(m.role,m.nodeLabel,count===0?false:count===total?true:null))}const result=await POPUP.showPopupActionsFromEvent({actions:roles,actionContext:ctx,restoreFocus:ev.target},ev)
if(result&&ctx.txTable.isConnected){const tableLayout=ctx.txTable.tableLayout
const logicTable=tableLayout.logicTable
rect=logicTable.getSelRect()
const rg=newCellRange(tableLayout.focusCell,tableLayout.anchorCell)
const batch=ctx.txtRoot.wedlet.wedMgr.docHolder.newBatch(rg)
batch.setMeta(TxtSelMgr.MSGMETA_tblLayout,true)
for(let r=rect.startRow;r<rect.endRow;r++){const row=ctx.logicTable.logicRows[r].txtRow
if(row.txtRole!==result.getId())batch.setAttr(XA.append(row.wedAnchor,row.model.roleAttName),result.getId())}batch.setSelAfterRange(rg)
batch.doBatch()}}}registerTxtAction("setRoleRow",SetRoleRow)
REG.reg.registerSkin("txt-table/enumAction",1,`\n\t.label {\n\t\tmax-width: 6em;\n\t\twhite-space: nowrap;\n\t\tfont-size: var(--label-size);\n\t}\n`)
class SetRoleCol extends SetRoleRow{getLabel(ctx){const rect=ctx.logicTable.getSelRect()
const label=ctx.txTable.getCol(rect.startCol).model.nodeLabel
for(let c=rect.startCol+1;c<rect.endCol;c++){if(label!==ctx.txTable.getCol(c).model.nodeLabel)return" "}return label}async execute(ctx,ev){ctx.txtRoot.selMgr.restoreSel()
let rect=ctx.logicTable.getSelRect()
const usedRoles={}
for(let c=rect.startCol;c<rect.endCol;c++){const col=ctx.txTable.getCol(c)
if(usedRoles[col.txtRole])usedRoles[col.txtRole]++
else usedRoles[col.txtRole]=1}const total=rect.endCol-rect.startCol
const roles=[]
for(const m of ctx.txTable.model.colModels){if(m.role==null)continue
const count=usedRoles[m.role]||0
roles.push(new EnumEntryAction(m.role,m.nodeLabel,count===0?false:count===total?true:null))}const result=await POPUP.showPopupActionsFromEvent({actions:roles,actionContext:ctx,restoreFocus:ev.target},ev)
if(result&&ctx.txTable.isConnected){const tableLayout=ctx.txTable.tableLayout
const logicTable=tableLayout.logicTable
rect=logicTable.getSelRect()
const rg=newCellRange(tableLayout.focusCell,tableLayout.anchorCell)
const batch=ctx.txtRoot.wedlet.wedMgr.docHolder.newBatch(rg)
batch.setMeta(TxtSelMgr.MSGMETA_tblLayout,true)
for(let c=rect.startCol;c<rect.endCol;c++){const col=ctx.txTable.getCol(c)
if(col.txtRole!==result.getId())batch.setAttr(XA.append(col.wedAnchor,col.model.roleAttName),result.getId())}batch.setSelAfterRange(rg)
batch.doBatch()}}}registerTxtAction("setRoleCol",SetRoleCol)
class SetRoleCell extends SetRoleRow{getLabel(ctx){const tableLayout=ctx.txTable.tableLayout
const label=tableLayout.focusCell.model.nodeLabel
if(tableLayout.focusCell===tableLayout.anchorCell)return label
const rect=ctx.logicTable.getSelRect()
for(let r=rect.startRow;r<rect.endRow;r++){const lRow=ctx.logicTable.logicRows[r]
for(let c=rect.startCol;c<rect.endCol;c++){const lC=lRow[c]
if(lC instanceof TxtCell){if(label!==lC.model.nodeLabel)return" "}else if(lC instanceof MasterCell){if(label!==lC.txtCell.model.nodeLabel)return" "}}}return label}async execute(ctx,ev){ctx.txtRoot.selMgr.restoreSel()
let rect=ctx.logicTable.getSelRect()
const usedRoles={}
const rowsM=new Set
const cellsM=new Map
let total=0
for(let r=rect.startRow;r<rect.endRow;r++){const lRow=ctx.logicTable.logicRows[r]
for(let c=rect.startCol;c<rect.endCol;c++){const lC=lRow[c]
const txtC=lC instanceof TxtCell?lC:lC instanceof MasterCell?lC.txtCell:null
if(txtC){if(usedRoles[txtC.txtRole])usedRoles[txtC.txtRole]++
else usedRoles[txtC.txtRole]=1
total++}}if(!rowsM.has(lRow.txtRow.model)){rowsM.add(lRow.txtRow.model)
for(const m of lRow.txtRow.model.cellModels)if(m.role!=null)cellsM.set(m.role,m)}}const roles=[]
for(const m of cellsM.values()){if(m.role==null)continue
const count=usedRoles[m.role]||0
roles.push(new EnumEntryAction(m.role,m.nodeLabel,count===0?false:count===total?true:null))}const result=await POPUP.showPopupActionsFromEvent({actions:roles,actionContext:ctx,restoreFocus:ev.target},ev)
if(result&&ctx.txTable.isConnected){const tableLayout=ctx.txTable.tableLayout
const logicTable=tableLayout.logicTable
rect=logicTable.getSelRect()
const rg=newCellRange(tableLayout.focusCell,tableLayout.anchorCell)
const batch=ctx.txtRoot.wedlet.wedMgr.docHolder.newBatch(rg)
batch.setMeta(TxtSelMgr.MSGMETA_tblLayout,true)
for(let r=rect.startRow;r<rect.endRow;r++){const lRow=ctx.logicTable.logicRows[r]
for(let c=rect.startCol;c<rect.endCol;c++){const lC=lRow[c]
const txtC=lC instanceof TxtCell?lC:lC instanceof MasterCell?lC.txtCell:null
if(txtC&&txtC.txtRole!==result.getId())batch.setAttr(XA.append(txtC.wedAnchor,txtC.model.roleAttName),result.getId())}}batch.setSelAfterRange(rg)
batch.doBatch()}}}registerTxtAction("setRoleCell",SetRoleCell)
class SetWidthCol extends WedEditAction{constructor(){super(...arguments)
this._description="Largeur de(s) colonne(s)"}initFromWed(elt){}buildCustomButton(ctx,uiContext,parent){return(new WidthColBtn).initialize({reg:REG.findReg(ctx.txtRoot),action:this,actionContext:ctx,uiContext:uiContext,role:"button",skinOver:"txt-widthcol-btn"})}isEnabled(ctx){if(!WEDLET.isWritableWedlet(ctx.txtRoot.wedlet))return false
return super.isEnabled(ctx)}setWidth(ctx,width){try{const rect=ctx.logicTable.getSelRect()
let col=ctx.txTable.getCol(rect.startCol)
const colWidthMgr=col.widthMgr
const bounds=colWidthMgr.getLogicBounds(col)
const min=bounds.min||1
if(width<min)width=min
if(bounds.max&&width>bounds.max)width=bounds.max
const step=bounds.step||1
width=Math.round(width/step)*step
const tableLayout=ctx.txTable.tableLayout
const rg=newCellRange(tableLayout.focusCell,tableLayout.anchorCell)
const batch=ctx.txtRoot.wedlet.wedMgr.docHolder.newBatch(rg)
batch.setMeta(TxtSelMgr.MSGMETA_tblLayout,true)
colWidthMgr.updateLogicW(col,width,batch)
for(let c=rect.startCol+1;c<rect.endCol;c++){col=DOM.findNextSibling(col,TXTTABLE.IS_TxtCol)
colWidthMgr.updateLogicW(col,width,batch)}batch.setSelAfterRange(rg)
ctx.wedMgr.freezeFocus=true
batch.doBatch()}finally{ctx.wedMgr.freezeFocus=false}}}registerTxtAction("setWidthCol",SetWidthCol)
class WidthColBtn extends ActionBtn{_refresh(){const txtTable=this._actionContext.txTable
const logicTable=this._actionContext.logicTable
const rect=logicTable.getSelRect()
const firstCol=txtTable.getCol(rect.startCol)
const firstColWidthMgr=firstCol.widthMgr
const firstColWidth=firstColWidthMgr.getLogicW(firstCol)
let avrgWidth
if(rect.startCol<rect.endCol-1){let totalW=firstColWidth
let col=firstCol
for(let c=rect.startCol+1;c<rect.endCol;c++){col=DOM.findNextSibling(col,TXTTABLE.IS_TxtCol)
const w=col.widthMgr.getLogicW(col)
if(w!==firstColWidth)avrgWidth=0
totalW+=w}if(avrgWidth===0)avrgWidth=totalW/(rect.endCol-rect.startCol)}if(avrgWidth>0){const step=firstColWidthMgr.getLogicBounds(firstCol).step||1
this.avrgWidth=Math.round(avrgWidth/step)*step
this._label="~"+this.avrgWidth
this._hideLabel=false
if(this._input){if(this._input===DOMSH.findDocumentOrShadowRoot(this._input).activeElement)this.focus()
DOM.setHidden(this._input,true)}}else{this._hideLabel=true
this._label=""
this.avrgWidth=0
if(!this._input){const bounds=firstColWidthMgr.getLogicBounds(firstCol)
this._input=document.createElement("input")
this._input.type="number"
if(bounds.step)this._input.step=bounds.step.toString(10)
this._input.min=(bounds.min||1).toString(10)
if(bounds.max)this._input.max=bounds.max.toString(10)
if(bounds.step)this._input.step=bounds.step.toString(10)
this._input.actionContext=this._actionContext
if(!this._labelElt)this._createLabel()
this._labelElt.insertAdjacentElement("beforebegin",this._input)
this._input.addEventListener("input",this.onChange)
this._input.addEventListener("keydown",this.onKeydown)}this._input.valueAsNumber=firstColWidth
DOM.setHidden(this._input,false)}super._refresh()}_executeAction(ev){if(this._action.isAvailable(this.actionContext)){if(this._input&&!this._input.hidden)this._input.focus()
else if(this.avrgWidth>0)this.action.setWidth(this.actionContext,this.avrgWidth)}}onChange(){const btn=DOMSH.findHost(this)
btn.action.setWidth(btn.actionContext,this.valueAsNumber)}onKeydown(ev){switch(ev.key){case"Escape":DOMSH.findHost(this).focus()
break
case"ArrowLeft":case"ArrowRight":ev.stopImmediatePropagation()}}}customElements.define("txt-widthcol-btn",WidthColBtn)
REG.reg.registerSkin("txt-widthcol-btn",1,`\n\t.label, input {\n\t\twidth: 4em;\n\t\twhite-space: nowrap;\n\t\tfont-size: var(--label-size);\n\t\tborder: 1px solid var(--border-color);\n\t\tpadding: 0;\n\t}\n`)
function getTableFromSel(selMgr){return getTableFromNode(selMgr.focusNode)||selMgr.type==="Range"&&getTableFromNode(selMgr.anchorNode)}function getTableFromNode(from){let parent=findTxtEltParent(from,true)
while(parent){if(parent instanceof TxtTable)return parent
parent=findTxtEltParent(parent)}return null}export var TXTTABLE;(function(TXTTABLE){TXTTABLE.IS_TxtCol=n=>n instanceof TxtCol
TXTTABLE.IS_TxtRow=n=>n instanceof TxtRow
TXTTABLE.IS_TxtCell=n=>n instanceof TxtCell
TXTTABLE.IS_TxtTable=n=>n instanceof TxtTable
class LogicTable{constructor(txtTable){this.txtTable=txtTable
this.logicRows=[]
for(let row=DOM.findFirstChild(txtTable.table,TXTTABLE.IS_TxtRow);row;row=DOM.findNextSibling(row,TXTTABLE.IS_TxtRow)){this.logicRows.push(new LogicRow(row,this.logicRows[this.logicRows.length-1]))}}getLocicCellAt(logicRow,logicCol){const lRow=this.logicRows[logicRow]
if(lRow)return lRow[logicCol]
return null}getTxtCellAt(logicRow,logicCol){const lRow=this.logicRows[logicRow]
if(lRow){const lCell=lRow[logicCol]
if(lCell instanceof TxtCell)return lCell
if(lCell instanceof MasterCell)return lCell.txtCell
if(lCell instanceof MergedCell)return lCell.ownerCell.txtCell}return null}getLogicOffsets(cell){const row=cell.parentElement
for(let i=0;i<this.logicRows.length;i++){if(this.logicRows[i].txtRow===row){const lRow=this.logicRows[i]
for(let k=0;k<lRow.length;k++){const lCell=lRow[k]
if(lCell===cell||lCell instanceof MasterCell&&lCell.txtCell===cell){return{offsRow:i,offsCol:k}}}}}return null}getLogicRect(c1,c2){const p1=this.getLogicOffsets(c1)
const p2=this.getLogicOffsets(c2)
const r={}
r.startRow=Math.min(p1.offsRow,p2.offsRow)
r.startCol=Math.min(p1.offsCol,p2.offsCol)
r.endRow=Math.max(p1.offsRow+c1.getRowSpan(),p2.offsRow+c2.getRowSpan())
r.endCol=Math.max(p1.offsCol+c1.getColSpan(),p2.offsCol+c2.getColSpan())
return r}getSelRect(){const t=this.txtTable.tableLayout
t.checkSel()
return this.getLogicRect(t.focusCell,t.anchorCell)}insertRows(batch,insOffset,rowM,count=1){if(!batch.selBefore)batch.setSelBefore((this.logicRows[insOffset]||this.logicRows[insOffset-1]).txtRow.wedAnchor)
let xa
const jmlCh=[]
let row=this.logicRows[insOffset]
let extendSpan=true
if(row){xa=row.txtRow.wedAnchor}else{extendSpan=false
row=this.logicRows[this.logicRows.length-1]
xa=XA.incrAtDepth(row.txtRow.wedAnchor,-1,1)}for(let i=0;i<row.length;i++){const cell=row[i]
if(cell instanceof TxtCell){jmlCh.push(cell.model.newJml())}else if(cell instanceof MasterCell){for(let i=0;i<cell.colSpan;i++)jmlCh.push(cell.txtCell.model.newJml())
i+=cell.colSpan-1}else if(cell instanceof MergedCell&&cell.ownerCell.rowSpan>cell.rowSpan){const txtCell=cell.ownerCell.txtCell
if(extendSpan){txtCell.spanMgr.updateRowSpan(txtCell,cell.ownerCell.rowSpan+count,batch)}else{for(let i=0;i<cell.colSpan;i++)jmlCh.push(txtCell.model.newJml())}i+=cell.colSpan-1}}const jml=[]
for(let i=0;i<count;i++)jml.push(rowM.newJml(),jmlCh)
batch.insertJml(xa,jml)
const selXa=XA.freeze(this.logicRows[insOffset]?this.logicRows[insOffset].txtRow.wedAnchor:XA.incrAtDepth(this.logicRows[insOffset-1].txtRow.wedAnchor,-1,1))
batch.setSelAfter(selXa,count>1?XA.incrAtDepth(selXa,-1,count-1):null)}insertCols(batch,insOffset,colM,count=1){if(!batch.selBefore)batch.setSelBefore((this.txtTable.getCol(insOffset)||this.txtTable.getCol(insOffset-1)).wedAnchor)
let xa
const countCol=this.txtTable.countCols()
if(insOffset>=countCol){xa=XA.incrAtDepth(this.txtTable.getCol(countCol-1).wedAnchor,-1,1)}else{xa=this.txtTable.getCol(insOffset).wedAnchor}for(let i=0;i<this.logicRows.length;i++){const row=this.logicRows[i]
let cell=row[insOffset]
if(cell){if(cell instanceof MergedCell&&cell.ownerCell.colSpan>cell.colSpan){const txtCell=cell.ownerCell.txtCell
txtCell.spanMgr.updateColSpan(txtCell,cell.ownerCell.colSpan+count,batch)
i+=cell.ownerCell.rowSpan-1}else{let cellM
let offset=insOffset
let xa
if(cell instanceof MergedCell){cellM=cell.ownerCell.txtCell.model
cell=row[--offset]
while(cell instanceof MergedCell)cell=row[--offset]
xa=XA.incrAtDepth(cell instanceof MasterCell?cell.txtCell.wedAnchor:cell.wedAnchor,-1,1)}else if(cell instanceof MasterCell){xa=cell.txtCell.wedAnchor
cellM=cell.txtCell.model}else{xa=cell.wedAnchor
cellM=cell.model}const jml=[]
for(let i=0;i<count;i++)jml.push(cellM.newJml())
batch.insertJml(xa,jml)}}else{const lastCell=DOM.findLastChild(row.txtRow,TXTTABLE.IS_TxtCell)
const cellM=this.getTxtCellAt(i,insOffset-1).model
const jml=[]
for(let i=0;i<count;i++)jml.push(cellM.newJml())
batch.insertJml(XA.incrAtDepth(lastCell.wedAnchor,-1,1),jml)}}const colObj=colM.newJml()
colM.widthMgr(this.txtTable.wedMgr).fillDefault(colM,colObj)
const jml=[]
for(let i=0;i<count;i++)jml.push(colObj)
batch.insertJml(xa,jml)
const selXa=XA.freeze(this.txtTable.countCols()>insOffset?this.txtTable.getCol(insOffset).wedAnchor:XA.incrAtDepth(this.txtTable.getCol(insOffset-1).wedAnchor,-1,1))
batch.setSelAfter(selXa,count>1?XA.incrAtDepth(selXa,-1,count-1):null)}deleteRows(batch,rowOffset,count=1){if(!batch.selBefore)batch.setSelBefore(this.logicRows[rowOffset].txtRow.wedAnchor,count>1?this.logicRows[rowOffset+count-1].txtRow.wedAnchor:null)
batch.setSelAfter((this.logicRows[rowOffset+count]||this.logicRows[rowOffset-1]).txtRow.wedAnchor)
let logicInsertInRowAfter
for(let r=rowOffset,m=rowOffset+count;r<m;r++){const lRow=this.logicRows[r]
for(let c=0;c<lRow.length;c++){const cell=lRow[c]
if(r===rowOffset&&cell instanceof MergedCell&&cell.ownerCell.rowSpan>cell.rowSpan){const txtCell=cell.ownerCell.txtCell
txtCell.spanMgr.updateRowSpan(txtCell,cell.ownerCell.rowSpan-Math.min(cell.rowSpan,count),batch)
c+=cell.colSpan-1}else if(cell instanceof MasterCell&&cell.rowSpan+r>m){const newCell=cell.txtCell.spanMgr.splitCell(cell.txtCell,cell.rowSpan-m,cell.colSpan);(logicInsertInRowAfter||(logicInsertInRowAfter=[]))[c]=newCell}}}if(logicInsertInRowAfter){const lRowAfter=this.logicRows[rowOffset+count]
for(let i=lRowAfter.length-1;i>=0;i--){const lCell=lRowAfter[i]
if(logicInsertInRowAfter[i]!=null){const cell=lRowAfter.getTxtCellBefore(i)
batch.insertJml(cell?XA.incrAtDepth(cell.wedAnchor,-1,1):XA.append(lRowAfter.txtRow.wedAnchor,lRowAfter.txtRow.getFirstChildXmlOffset()),logicInsertInRowAfter[i])}}}batch.deleteSequence(this.logicRows[rowOffset].txtRow.wedAnchor,count)}deleteCols(batch,colOffset,count=1){if(!batch.selBefore)batch.setSelBefore(this.txtTable.getCol(colOffset).wedAnchor)
batch.setSelAfter((this.txtTable.getCol(colOffset+count)||this.txtTable.getCol(colOffset-1)).wedAnchor)
for(let r=0,m=this.logicRows.length;r<m;r++){const lRow=this.logicRows[r]
let cellToAddAfter
let cellToDel=0
for(let c=colOffset,end=colOffset+count;c<end;c++){const lCell=lRow[c]
if(lCell instanceof TxtCell){cellToDel++}else if(c===colOffset&&lCell instanceof MergedCell&&lCell.rowSpan===lCell.ownerCell.rowSpan){const txtCellM=lCell.ownerCell.txtCell
txtCellM.spanMgr.updateColSpan(lCell.ownerCell.txtCell,lCell.ownerCell.colSpan-Math.min(lCell.colSpan,count),batch)}else if(lCell instanceof MasterCell){cellToDel++
if(lCell.colSpan>end-c){cellToAddAfter=lCell.txtCell.spanMgr.splitCell(lCell.txtCell,lCell.rowSpan,lCell.colSpan-(end-c))}}}const prevCell=lRow.getTxtCellBefore(colOffset)
const xaNext=prevCell?XA.incrAtDepth(prevCell.wedAnchor,-1,1):XA.append(lRow.txtRow.wedAnchor,lRow.txtRow.getFirstChildXmlOffset())
if(cellToDel>0)batch.deleteSequence(xaNext,cellToDel)
if(cellToAddAfter)batch.insertJml(xaNext,cellToAddAfter)}batch.deleteSequence(this.txtTable.getCol(colOffset).wedAnchor,count)}mergeCells(batch,txtCell,spanRow,spanCol){const{offsRow:offsRow,offsCol:offsCol}=this.getLogicOffsets(txtCell)
const originalRowSpan=txtCell.getRowSpan()
const originalColSpan=txtCell.getColSpan()
if(originalRowSpan!==spanRow)txtCell.spanMgr.updateRowSpan(txtCell,spanRow,batch)
if(originalColSpan!==spanCol)txtCell.spanMgr.updateColSpan(txtCell,spanCol,batch)
const contentToAppend=[]
let logicInsertInRowAfter
let lRow=this.logicRows[offsRow]
let deltaCol=spanCol-originalColSpan
if(deltaCol<0){const cells=[]
const tpl=txtCell.spanMgr.splitCell(txtCell,1,1)
for(let i=0;i>deltaCol;i--)cells.push(...tpl)
batch.insertJml(XA.incrAtDepth(txtCell.wedAnchor,-1,1),cells)}else if(deltaCol>0){let countCellToDel=0
let cellToAddAfter
for(let c=offsCol+originalColSpan;c<lRow.length&&deltaCol>0;){const cell=lRow[c]
if(cell instanceof TxtCell){contentToAppend.push(...cell.exportContent())
countCellToDel++}else if(cell instanceof MergedCell){if(cell.ownerCell.rowSpan!==cell.rowSpan){const cellToShrink=cell.ownerCell
if(spanRow<cell.rowSpan){const newCell=cellToShrink.txtCell.spanMgr.splitCell(cellToShrink.txtCell,cell.rowSpan-spanRow,cellToShrink.colSpan);(logicInsertInRowAfter||(logicInsertInRowAfter=[]))[c]=newCell}cellToShrink.txtCell.spanMgr.updateRowSpan(cellToShrink.txtCell,cellToShrink.rowSpan-cell.rowSpan,batch)
if(deltaCol<cell.colSpan){cellToAddAfter=cellToShrink.txtCell.spanMgr.splitCell(cellToShrink.txtCell,Math.min(spanRow,cell.rowSpan),cell.colSpan-deltaCol)}}}else{contentToAppend.push(...cell.txtCell.exportContent())
countCellToDel++
if(spanRow<cell.rowSpan){const newCell=cell.txtCell.spanMgr.splitCell(cell.txtCell,cell.rowSpan-spanRow,cell.colSpan);(logicInsertInRowAfter||(logicInsertInRowAfter=[]))[c]=newCell}if(deltaCol<cell.colSpan){cellToAddAfter=cell.txtCell.spanMgr.splitCell(cell.txtCell,Math.min(spanRow,cell.rowSpan),cell.colSpan-deltaCol)}}c+=cell.colSpan
deltaCol-=cell.colSpan}const xaNext=XA.incrAtDepth(txtCell.wedAnchor,-1,1)
if(countCellToDel>0)batch.deleteSequence(xaNext,countCellToDel)
if(cellToAddAfter)batch.insertJml(xaNext,cellToAddAfter)}let offsetRow=1
lRow=this.logicRows[offsRow+offsetRow]
while(lRow){if(offsetRow<spanRow){let countCellToDel=0
let cellToAddAfter
let cellToMerge=spanCol
for(let c=offsCol;c<lRow.length&&cellToMerge>0;){const cell=lRow[c]
if(cell instanceof MergedCell){if(c===offsCol){if(cell.ownerCell.txtCell===txtCell){if(cellToMerge<cell.colSpan){const cells=[]
const tpl=txtCell.spanMgr.splitCell(txtCell,1,1)
for(let i=cell.colSpan-cellToMerge;i>0;i--)cells.push(...tpl)
const prevCell=lRow.getTxtCellBefore(offsCol)
const xa=prevCell?XA.incrAtDepth(prevCell.wedAnchor,-1,1):XA.append(lRow.txtRow.wedAnchor,lRow.txtRow.getFirstChildXmlOffset())
batch.insertJml(xa,cells)}}else{const cellToShrink=cell.ownerCell
if(spanRow-offsetRow<cell.rowSpan){const newCell=cellToShrink.txtCell.spanMgr.splitCell(cellToShrink.txtCell,cell.rowSpan-(spanRow-offsetRow),cellToShrink.colSpan);(logicInsertInRowAfter||(logicInsertInRowAfter=[]))[c]=newCell}cellToShrink.txtCell.spanMgr.updateColSpan(cellToShrink.txtCell,cellToShrink.colSpan-cell.colSpan,batch)
if(cellToMerge<cell.colSpan){cellToAddAfter=cellToShrink.txtCell.spanMgr.splitCell(cellToShrink.txtCell,Math.min(spanRow-offsetRow,cell.rowSpan),cell.colSpan-cellToMerge)}}}}else{contentToAppend.push(...(cell instanceof MasterCell?cell.txtCell:cell).exportContent())
countCellToDel++
if(cell instanceof MasterCell){if(spanRow-offsetRow<cell.rowSpan){const newCell=cell.txtCell.spanMgr.splitCell(cell.txtCell,cell.rowSpan-(spanRow-offsetRow),cell.colSpan);(logicInsertInRowAfter||(logicInsertInRowAfter=[]))[c]=newCell}if(cellToMerge<cell.colSpan){cellToAddAfter=cell.txtCell.spanMgr.splitCell(cell.txtCell,Math.min(spanRow-offsetRow,cell.rowSpan),cell.colSpan-cellToMerge)}}}cellToMerge-=cell.colSpan
c+=cell.colSpan}const prevCell=lRow.getTxtCellBefore(offsCol)
const xaNext=prevCell?XA.incrAtDepth(prevCell.wedAnchor,-1,1):XA.append(lRow.txtRow.wedAnchor,lRow.txtRow.getFirstChildXmlOffset())
if(countCellToDel>0)batch.deleteSequence(xaNext,countCellToDel)
if(cellToAddAfter)batch.insertJml(xaNext,cellToAddAfter)}else if(offsetRow<originalRowSpan){if(logicInsertInRowAfter&&offsetRow===spanRow){const newCell=txtCell.spanMgr.splitCell(txtCell,1,1)
for(let i=0;i<originalColSpan;i++)logicInsertInRowAfter[offsCol+i]=newCell}else{const cells=[]
const tpl=txtCell.spanMgr.splitCell(txtCell,1,1)
for(let i=0;i<originalColSpan;i++)cells.push(...tpl)
const prevCell=lRow.getTxtCellBefore(offsCol)
const xaNext=prevCell?XA.incrAtDepth(prevCell.wedAnchor,-1,1):XA.append(lRow.txtRow.wedAnchor,lRow.txtRow.getFirstChildXmlOffset())
batch.insertJml(xaNext,cells)}}else{break}lRow=this.logicRows[++offsetRow+offsRow]}if(contentToAppend.length>0){batch.insertJml(XA.append(txtCell.wedAnchor,txtCell.getAppendXmlOffset()),contentToAppend)}if(logicInsertInRowAfter){const lRowAfter=this.logicRows[offsRow+spanRow]
for(let i=lRowAfter.length-1;i>=0;i--){const lCell=lRowAfter[i]
if(logicInsertInRowAfter[i]!=null){const cell=lRowAfter.getTxtCellBefore(i)
batch.insertJml(cell?XA.incrAtDepth(cell.wedAnchor,-1,1):XA.append(lRowAfter.txtRow.wedAnchor,lRowAfter.txtRow.getFirstChildXmlOffset()),logicInsertInRowAfter[i])}}}}}TXTTABLE.LogicTable=LogicTable})(TXTTABLE||(TXTTABLE={}))
class LogicRow extends Array{constructor(row,prev){super()
this.txtRow=row
if(prev)for(let i=0;i<prev.length;i++){const c=prev[i]
if(c instanceof MasterCell&&c.rowSpan>1){this[i]=new MergedCell(c,c.rowSpan-1,c.colSpan)
this.withHoles=true}else if(c instanceof MergedCell&&c.rowSpan>1){this[i]=new MergedCell(c.ownerCell,c.rowSpan-1,c.colSpan)
this.withHoles=true}}let cell=DOM.findFirstChild(row,TXTTABLE.IS_TxtCell)
while(cell){const rowSp=cell.getRowSpan()
const colSp=cell.getColSpan()
if(rowSp>1||colSp>1){const master=new MasterCell(cell,rowSp,colSp)
this.addCell(master)
for(let i=1;i<colSp;i++)this.addCell(new MergedCell(master,rowSp,colSp-i))}else{this.addCell(cell)}cell=DOM.findNextSibling(cell,TXTTABLE.IS_TxtCell)}}addCell(cell){if(this.withHoles)for(let i=0;i<this.length;i++){if(this[i]==null){this[i]=cell
return}}this.push(cell)}getTxtCellBefore(logicOffset){for(let i=logicOffset-1;i>=0;i--){const cell=this[i]
if(cell instanceof TxtCell)return cell
if(cell instanceof MasterCell)return cell.txtCell}return null}}class MasterCell{constructor(cell,rowSpan,colSpan){this.txtCell=cell
this.rowSpan=rowSpan
this.colSpan=colSpan}}class MergedCell{constructor(ownerCell,rowSpan,colSpan){this.ownerCell=ownerCell
this.rowSpan=rowSpan
this.colSpan=colSpan}}function newCellRange(bound1,bound2){if(bound1===bound2)return{start:bound1.wedAnchor}
const pos=bound1.compareDocumentPosition(bound2)
if(pos&Node.DOCUMENT_POSITION_FOLLOWING)return{start:bound1.wedAnchor,end:bound2.wedAnchor}
return{start:bound2.wedAnchor,end:bound1.wedAnchor}}
//# sourceMappingURL=txtTable.js.map