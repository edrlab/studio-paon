import{TxtSelMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/txtSel.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{XmlDeleteMsg,XmlInsertMsg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{SkImpBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMeta.js"
import{MergedCell,SkMTxtCell,SkMTxtCol,SkMTxtRow}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMetaTxt.js"
export async function tryImportInTable(skMTable,ctx,content,cache){const known=await skMTable.findKnownNodes(ctx,content,true,cache)
if(!known)return null
const cols=[]
const rows=[]
for(const node of known.nodes){const subRule=ctx.skNode.rule.contentRule.findRuleNodeFor(node)
if(subRule&&subRule.skMeta instanceof SkMTxtCol){cols.push(node)}else if(subRule&&subRule.skMeta instanceof SkMTxtRow){rows.push(node)}}return rows.length>0&&cols.length>0?[new SkImpTableReplaceCell(ctx,cols,rows)]:null}class SkImpTableReplaceCell extends SkImpBase{constructor(ctx,cols,rows,malus=0){super(ctx.schemaDom)
this.cols=cols
this.rows=rows
this.malus=malus}getLabel(){return"Remplacer le contenu des cellules"}doImport(ctx,batch){batch.setMeta(TxtSelMgr.MSGMETA_tblLayout,true)
const table=XA.findDomContainer(ctx.sel.start,this.schemaDom.nodeRoot)
let skCellTarget=this.schemaDom.getSkNode(XA.findDomLast(ctx.cellInsertPoint,this.schemaDom.nodeRoot))
let firstColTarget
const rowTarget=skCellTarget.node.parentElement
let ch=table.firstElementChild
let skCh=this.schemaDom.getSkNode(ch)
let logicRow
while(ch){const skChM=skCh.rule.skMeta
if(skChM instanceof SkMTxtRow){logicRow=skChM.buildLogicRow(skCh,logicRow)
if(rowTarget===ch){firstColTarget=logicRow.indexOf(skCellTarget)
break}}ch=ch.nextElementSibling
skCh=this.schemaDom.getSkNode(ch)}if(!ch||firstColTarget<0)return
let colIdx=firstColTarget
let insertXa
for(const row of this.rows){for(let ch=row.firstElementChild;ch&&skCellTarget;){const skNodeFrom=this.schemaDom.getSkNode(ch)
if(skNodeFrom&&skNodeFrom.rule.skMeta instanceof SkMTxtCell){const start=skCellTarget.rule.skMeta.getOffsetAfterMeta(skCellTarget)
insertXa=XA.append(XA.fromNode(skCellTarget.node),start)
batch.add((new XmlDeleteMsg).init(insertXa,skCellTarget.node.childNodes.length-start))
const jml=[]
skNodeFrom.rule.skMeta.exportContent(skNodeFrom,jml)
batch.add((new XmlInsertMsg).init(insertXa,jml))}ch=ch.nextElementSibling
while(logicRow[++colIdx]instanceof MergedCell&&!logicRow[colIdx].isMaster);skCellTarget=logicRow[colIdx]instanceof MergedCell?logicRow[colIdx].ownerCell:logicRow[colIdx]}ch=ch.nextElementSibling
if(!ch)break
skCh=this.schemaDom.getSkNode(ch)
const skChM=skCh.rule.skMeta
if(!(skChM instanceof SkMTxtRow))break
logicRow=skChM.buildLogicRow(skCh,logicRow)
colIdx=firstColTarget
while(logicRow[colIdx]instanceof MergedCell&&!logicRow[colIdx].isMaster)colIdx++
skCellTarget=logicRow[colIdx]instanceof MergedCell?logicRow[colIdx].ownerCell:logicRow[colIdx]}const lastCell=XA.subXa(insertXa,-1)
batch.setSelBefore(ctx.cellInsertPoint,lastCell)
batch.setSelAfter(ctx.cellInsertPoint,lastCell)}}
//# sourceMappingURL=importTable.js.map