import{DOM,ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{XmlDeleteMsg,XmlInsertMsg,XmlStrMsg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{CARD,SkNode}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schema.js"
import{EAnnotLevel,SkAnnotEltUnknown,SkAnnotMissing,SkAnnotWrongValue}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaAnnots.js"
import{SK_NS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaBuilder.js"
import{EGramLevelType,SkImpGoUp,SkImpSimple,SkImpSplitUp,SkMBase,SKMETA,SKMETALIB,SkMMeta,SkMObject}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMeta.js"
import{SkRuleChoice,SkRuleComment,SkRuleElt,SkRuleEltUnknown}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaPatterns.js"
class SkMText extends SkMBase{initSkRule(skRule,confRule){let att=confRule.getAttributeNS(SK_NS,"maxLength")
if(att)skRule.maxLength=parseInt(att)
att=confRule.getAttributeNS(SK_NS,"maxLengthWarn")
if(att)skRule.maxLengthWarn=parseInt(att)
skRule.commentRule=skruleCmtBlackHole}get gramLevelType(){return EGramLevelType.text}get isParaParent(){return true}onExecRules(skCtx,rule,nodeOrAttr){if(!skCtx.execOptions.genAnnots)return
if(rule.maxLength>0||rule.maxLengthWarn>0){const len=this.computeLen(nodeOrAttr)
if(len>rule.maxLength&&rule.maxLength>0){skCtx.addAnnot((new SkAnnotWrongValue).init(nodeOrAttr,`Nombre de caractères supérieur à ${rule.maxLength}`))}else if(len>rule.maxLengthWarn&&rule.maxLengthWarn>0){skCtx.addAnnot((new SkAnnotWrongValue).init(nodeOrAttr,`Nombre de caractères recommandé inféieur à ${rule.maxLengthWarn}`,EAnnotLevel.warning))}}}computeLen(node){let len=0
const it=node.ownerDocument.createTreeWalker(node,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT,{acceptNode(n){if(n instanceof Text)return NodeFilter.FILTER_ACCEPT
return n.namespaceURI===DOM.SCCORE_NS?NodeFilter.FILTER_SKIP:NodeFilter.FILTER_REJECT}})
let n
while((n=it.nextNode())!=null)len+=n.nodeValue.length
return len}needTextGlobalCheck(rule){return rule.maxLength>0||rule.maxLengthWarn>0}}SKMETALIB.registerMetaNode(new SkMText("Text"))
class SkMTxtRoleUnknown extends SkMBase{get gramLevelType(){return EGramLevelType.text}initSkRule(skRule,confRule){skRule.initContentRule(SkRuleChoice.ANY)
skRule.mutateRoleTo=confRule.getAttributeNS(SK_NS,"mutateRoleTo")
skRule.knownRoles=confRule.getAttributeNS(SK_NS,"knownRoles").split("|")
skRule.knownRoles.splice(skRule.knownRoles.length-1,1)
skRule.commentRule=skruleCmtBlackHole}ruleMatch(skRule,node){return skRule.knownRoles.indexOf((node instanceof Element?node.getAttribute(SkMTxtRolable.ATTNAME_role):node[SkMTxtRolable.ATTNAME_role])||"")<0}onExecRules(skCtx,rule,nodeOrAttr){if(skCtx.execOptions.autoMutate){const rule=skCtx.skNode.rule;(skCtx.execOptions.mutations||(skCtx.execOptions.mutations=[])).push((new XmlStrMsg).init(XA.append(XA.from(nodeOrAttr),SkMTxtRolable.ATTNAME_role),rule.mutateRoleTo))}else if(skCtx.execOptions.genAnnots){skCtx.addAnnot((new SkAnnotEltUnknown).init(nodeOrAttr,skCtx.skNode.rule))}}}SKMETALIB.registerMetaNode(new SkMTxtRoleUnknown("TxtRoleUnknown"))
class SkMTxtRolable extends SkMObject{initSkRule(skRule,confRule){skRule.role=confRule.getAttributeNS(SK_NS,"role")
skRule.commentRule=skruleCmtBlackHole}ruleMatch(skRule,node){return((node instanceof Element?node.getAttribute(SkMTxtRolable.ATTNAME_role):node[SkMTxtRolable.ATTNAME_role])||"")===(skRule.role||"")}onCreateNode(rule,dst){if(rule.role)dst.setAttribute(SkMTxtRolable.ATTNAME_role,rule.role)}onExecRules(skCtx,rule,nodeOrAttr){if(skCtx.execOptions.autoCleanup&&skCtx.execOptions.corrections.length>0)skipUnknownTxtNode(skCtx,rule,nodeOrAttr)
textGlobalCheck(this,skCtx,rule,nodeOrAttr)}}SkMTxtRolable.ATTNAME_role="role"
function textGlobalCheck(skMeta,skCtx,rule,node){var _a
if(skCtx.execOptions.resetAll||!skCtx.execOptions.genAnnots)return
let pNode=node.parentElement
const schemaDom=skCtx.skNode.schemaDom
while(pNode){const pRule=(_a=schemaDom.getSkNode(pNode))===null||_a===void 0?void 0:_a.rule
if(!pRule)return
if(pRule.skMeta instanceof SkMText){if(pRule.skMeta.needTextGlobalCheck(pRule))(skCtx.execOptions.shouldRevalid||(skCtx.execOptions.shouldRevalid=new Set)).add(pNode)
break}pNode=pNode.parentElement}}export class SkMPara extends SkMObject{isTextSearchable(skNode,nodeOrAttr){return true}static wrapImportForParaSiblings(imports,paraParent,ctx){const startDepth=SKMETA.ctxRealStartDepth(ctx)
const startNode=XA.findDom(ctx.sel.start,ctx.schemaDom.nodeRoot,startDepth)
let startAtBorderPara=true
let node=startNode
let depth=startDepth
while(node&&node!==paraParent){if(!SKMETA.isAtBorder(node,true,ctx.sel.start[depth--],ctx.schemaDom)){startAtBorderPara=false
break}node=node.parentNode}let endAtBorderPara=true
let endXa
if(XA.isCollapsed(ctx.sel)){depth=startDepth
node=startNode
endXa=ctx.sel.start}else{depth=ctx.sel.end.length-1
node=XA.findDom(ctx.sel.end,ctx.schemaDom.nodeRoot,depth)
endXa=ctx.sel.end}let d=0
while(node&&node!==paraParent){if(!SKMETA.isAtBorder(node,false,endXa[depth--]+d,ctx.schemaDom)){endAtBorderPara=false
break}d=1
node=node.parentNode}const splitDepth=ctx.sel.start.length-1-DOM.computeDepth(paraParent)
if(startAtBorderPara&&endAtBorderPara){for(let i=0;i<imports.length;i++){imports[i]=new SkImpGoUp(ctx.schemaDom,imports[i],splitDepth,"replace")}}else if(startAtBorderPara){for(let i=0;i<imports.length;i++){imports[i]=new SkImpGoUp(ctx.schemaDom,imports[i],splitDepth,"before")}}else if(endAtBorderPara){for(let i=0;i<imports.length;i++){imports[i]=new SkImpGoUp(ctx.schemaDom,imports[i],splitDepth,"after")}}else{for(let i=0;i<imports.length;i++){imports[i]=new SkImpSplitUp(ctx.schemaDom,imports[i],splitDepth)}}}initSkRule(skRule,confRule){super.initSkRule(skRule,confRule)
skRule.noAutoComplete=true
skRule.commentRule=skruleCmtBlackHole}get gramLevelType(){return EGramLevelType.text}exportAsText(node,rule,buf){super.exportAsText(node,rule,buf)
buf.push("\n")}exportAsHtml(node,rule,outParent){const p=outParent.appendChild(outParent.ownerDocument.createElement("p"))
super.exportAsHtml(node,rule,p)}exportContainerNode(src,parentTarget,scope,fromDepth,toDepth){if(parentTarget instanceof DocumentFragment)parentTarget.xmlSpacePreserve=true
return super.exportContainerNode(src,parentTarget,scope,fromDepth,toDepth)}async tryPasteNodes(ctx,content,cache){var _a
const paraRule=SKMETA.ctxLastSkRule(ctx)
let first=true
const parentRule=SKMETA.ctxFindSkRuleInAnc(ctx,()=>first=!first)
const isSinglePara=parentRule instanceof SkRuleElt?!CARD.isRepeatable(parentRule.contentRule.getRealCardSubRule(paraRule)):true
if(!isSinglePara)ctx.abortIfNotInline=true
const known=await this.findKnownNodes(ctx,content,isSinglePara,cache)
if(isSinglePara)return known?[new SkImpSimple(ctx,known.nodes,known.malus)]:null
if(known&&known.malus===0)return[new SkImpSimple(ctx,known.nodes,known.malus)]
ctx.abortIfNotInline=false
const newCtx=SKMETA.newImportCtxUp(ctx,skRule=>skRule.skMeta.isParaParent)
if(!newCtx)return null
const imports=await SKMETA.ctxLastSkRule(newCtx).skMeta.tryPasteNodes(newCtx,content,cache)
if(known&&(!imports||((_a=imports[0])===null||_a===void 0?void 0:_a.malus)>known.malus)){return[new SkImpSimple(ctx,known.nodes,known.malus)]}if(imports){if(ctx.skRuleStack){return imports.map(imp=>new SkImpGoUp(ctx.schemaDom,imp,ctx.sel.start.length-newCtx.sel.start.length,"replace",imp.malus))}else{SkMPara.wrapImportForParaSiblings(imports,newCtx.ctn,ctx)}}return imports}normChars(ctn,msgs,noTrim,val){let str=val||ctn.nodeValue
let trimStart=false
let trimEnd=false
if(!noTrim){let next=ctn.nextSibling
if(val!=null)while(next&&next.nodeType===ENodeType.text)next=next.nextSibling
while(next&&next.nodeType===ENodeType.comment)next=next.nextSibling
trimEnd=!next
if(trimEnd){const len=DOM.txtEndSpLen(str)
if(len>0){if(val){str=str.substring(0,len)}else{msgs.push((new XmlDeleteMsg).init(XA.append(XA.from(ctn),str.length-len),len))}}}let prev=ctn.previousSibling
while(prev){if(prev.nodeType===ENodeType.comment){prev=prev.previousSibling}else{break}}trimStart=!prev||prev.nodeType===ENodeType.text&&DOM.txtEndsWithSp(prev.nodeValue)
if(trimStart){const len=DOM.txtStartSpLen(str)
if(len>0){if(val){str=str.substring(len)}else{msgs.push((new XmlDeleteMsg).init(XA.append(XA.from(ctn),0),len))}}}}if(val){str=str.replace(DOM.COLLAPSE_WS," ")
if(val!==str)msgs.push((new XmlStrMsg).init(XA.from(ctn),str))}else{const re=DOM.COLLAPSE_WS
re.lastIndex=0
let res
while(res=re.exec(str)){if(trimStart&&res.index===0)continue
if(trimEnd&&res.index===str.length-res[0].length)continue
const xa=XA.append(XA.from(ctn),res.index)
msgs.push((new XmlDeleteMsg).init(xa,res[0].length),(new XmlInsertMsg).init(xa," "))}}}onCreateNode(rule,dst){dst.setAttributeNS(DOM.XML_NS,"xml:space","preserve")}onExecRules(skCtx,rule,nodeOrAttr){if(skCtx.execOptions.autoCleanup&&skCtx.execOptions.corrections.length>0)skipUnknownTxtNode(skCtx,rule,nodeOrAttr)
textGlobalCheck(this,skCtx,rule,nodeOrAttr)}}SKMETALIB.registerMetaNode(new SkMPara("Para"))
class SkMUL extends SkMTxtRolable{get gramLevelType(){return EGramLevelType.text}get forceExportContainer(){return true}exportAsHtml(node,rule,outParent){const p=outParent.appendChild(outParent.ownerDocument.createElement(this.id==="OL"?"ol":"ul"))
super.exportAsHtml(node,rule,p)}}SKMETALIB.registerMetaNode(new SkMUL("UL"))
SKMETALIB.registerMetaNode(new SkMUL("OL"))
SKMETALIB.registerMetaNode(new SkMUL("SL"))
class SkMLI extends SkMBase{initSkRule(skRule,confRule){skRule.commentRule=skruleCmtBlackHole}get gramLevelType(){return EGramLevelType.text}get isParaParent(){return true}exportAsHtml(node,rule,outParent){const p=outParent.appendChild(outParent.ownerDocument.createElement("li"))
super.exportAsHtml(node,rule,p)}}SKMETALIB.registerMetaNode(new SkMLI("LI"))
class SkMSLMember extends SkMPara{exportAsHtml(node,rule,outParent){const p=outParent.appendChild(outParent.ownerDocument.createElement("li"))
super.exportAsHtml(node,rule,p)}}SKMETALIB.registerMetaNode(new SkMSLMember("SLMember"))
class SkMTxtCaption extends SkMPara{exportAsHtml(node,rule,outParent){const p=outParent.appendChild(outParent.ownerDocument.createElement("caption"))
super.exportAsHtml(node,rule,p)}}SKMETALIB.registerMetaNode(new SkMTxtCaption("TxtCaption"))
SKMETALIB.registerMetaNode(new SkMPara("TxtTitle"))
export class SkMSpan extends SkMTxtRolable{get gramLevelType(){return EGramLevelType.inline}isTextSearchable(skNode,nodeOrAttr){return true}isAtBorder(skNode,start,offset,schemaDom){if(start){if(offset>0)return true
let metaNode=null
const ch=skNode.node.firstChild
if(ch){const skCh=skNode.schemaDom.getSkNode(ch)
if(skCh&&skCh.rule.skMeta instanceof SkMMeta)metaNode=ch}for(let n=skNode.node.childNodes.item(offset-1);n!==metaNode;n=n.previousSibling)if(!SKMETA.isEmpty(n,schemaDom))return false}else{for(let n=skNode.node.childNodes.item(offset);n;n=n.nextSibling)if(!SKMETA.isEmpty(n,schemaDom))return false}return true}normChars(ctn,msgs,noTrim,val){const re=DOM.COLLAPSE_WS
re.lastIndex=0
let res
while(res=re.exec(val||ctn.nodeValue)){const xa=XA.append(XA.from(ctn),res.index)
msgs.push((new XmlDeleteMsg).init(xa,res[0].length),(new XmlInsertMsg).init(xa," "))}}exportAsHtml(node,rule,outParent){if(rule.skFamily){const tag=outParent.appendChild(outParent.ownerDocument.createElement(rule.skFamily))
super.exportAsHtml(node,rule,tag)}else{super.exportAsHtml(node,rule,outParent)}}exportContainerNode(src,parentTarget,scope,fromDepth,toDepth){if(parentTarget instanceof DocumentFragment)parentTarget.xmlSpacePreserve=true
return super.exportContainerNode(src,parentTarget,scope,fromDepth,toDepth)}}SkMSpan.prototype.tryPasteNodes=SkMPara.prototype.tryPasteNodes
SKMETALIB.registerMetaNode(new SkMSpan("InlPhrase"))
SKMETALIB.registerMetaNode(new SkMSpan("InlLink"))
SKMETALIB.registerMetaNode(new SkMSpan("InlStyle"))
SKMETALIB.registerMetaNode(new SkMSpan("InlTextLeaf"))
export class SkMInlExtLink extends SkMSpan{initSkRule(skRule,confRule){skRule.skFamily="a"
super.initSkRule(skRule,confRule)}exportAsHtml(node,rule,outParent){const tag=outParent.appendChild(outParent.ownerDocument.createElement("a"))
tag.setAttribute("href",node.getAttribute("url"))
super.exportAsHtmlChildren(node,rule,tag)}}SKMETALIB.registerMetaNode(new SkMInlExtLink("InlExtLink"))
class SkMInlObject extends SkMTxtRolable{get gramLevelType(){return EGramLevelType.inline}}SKMETALIB.registerMetaNode(new SkMInlObject("InlObject"))
SKMETALIB.registerMetaNode(new SkMInlObject("InlImg"))
SKMETALIB.registerMetaNode(new SkMInlObject("InlEmpty"))
class SkMTxtObject extends SkMTxtRolable{get gramLevelType(){return EGramLevelType.text}}SKMETALIB.registerMetaNode(new SkMTxtObject("TxtObject"))
SKMETALIB.registerMetaNode(new SkMTxtObject("TxtEmpty"))
export class SkMTxtTable extends SkMTxtRolable{get gramLevelType(){return EGramLevelType.text}exportNode(src,parentTarget,scope,fromDepth,toDepth){if(fromDepth==null&&toDepth==null){if(parentTarget)JML.appendDomNode(src.node,true,parentTarget)}else{const from=fromDepth!=null?scope.start[fromDepth]||0:0
if(typeof from==="string")throw Error(`Export fragment throw attributes not allowed: ${scope.start}`)
const to=toDepth!=null&&toDepth<scope.end.length?scope.end[toDepth]:Infinity
if(typeof to==="string")throw Error(`Export fragment throw attributes not allowed: ${scope.end}`)
let ch=from===0?src.node.firstChild:src.node.childNodes.item(from)
let i=from
if(ch&&i<to&&fromDepth!=null&&fromDepth<scope.start.length-1){const subSkNode=src.schemaDom.getSkNode(ch)
if(subSkNode){const skMeta=subSkNode.rule.skMeta
if(skMeta instanceof SkMTxtRow){subSkNode.rule.skMeta.exportNode(subSkNode,parentTarget,scope,fromDepth+1,null)}else if(skMeta instanceof SkMTxtCaption){subSkNode.rule.skMeta.exportNode(subSkNode,parentTarget,scope,fromDepth+1,null)}}ch=ch.nextSibling
i++}while(ch&&i<to){const subSkNode=src.schemaDom.getSkNode(ch)
if(subSkNode){if(subSkNode.rule.skMeta instanceof SkMTxtRow){if(parentTarget)subSkNode.rule.skMeta.exportContent(subSkNode,parentTarget)}else if(subSkNode.rule.skMeta instanceof SkMTxtCaption){if(parentTarget)subSkNode.rule.skMeta.exportContent(subSkNode,parentTarget)
if(scope.deletes)scope.deletes.add((new XmlDeleteMsg).init(XA.from(ch),1))}}ch=ch.nextSibling
i++}if(ch&&toDepth!=null&&toDepth<scope.end.length-1){const subSkNode=src.schemaDom.getSkNode(ch)
if(subSkNode&&subSkNode.rule.skMeta instanceof SkMTxtRow){subSkNode.rule.skMeta.exportNode(subSkNode,parentTarget,scope,null,toDepth+1)}}}return parentTarget}exportNodeCustom(src,filters){if(filters&&filters.tableRect){const tableRect=filters.tableRect
const result=src.node.cloneNode(false)
let ch=src.node.firstElementChild
let skCh=ch?src.schemaDom.getSkNode(ch):null
if(skCh.rule.skMeta instanceof SkMMeta){result.appendChild(skCh.rule.skMeta.exportNodeCustom(skCh,null))
ch=ch.nextElementSibling
skCh=ch?src.schemaDom.getSkNode(ch):null}let idxCol=0
while(skCh&&!(skCh.rule.skMeta instanceof SkMTxtRow)){if(skCh.rule.skMeta instanceof SkMTxtCol){if(idxCol>=tableRect.startCol&&idxCol<tableRect.endCol){result.appendChild(skCh.rule.skMeta.exportNodeCustom(skCh,null))}idxCol++}ch=ch.nextElementSibling
skCh=ch?src.schemaDom.getSkNode(ch):null}let idxRow=0
let prevRow
while(ch){const skChM=skCh.rule.skMeta
if(skChM instanceof SkMTxtRow){const logicRow=skChM.buildLogicRow(skCh,prevRow)
if(idxRow>=tableRect.startRow&&idxRow<tableRect.endRow){const tr=skChM.exportContainerNode(skCh,result)
for(let c=tableRect.startCol;c<tableRect.endCol;c++){const logicCell=logicRow[c]
if(logicCell instanceof SkNode){tr.appendChild(logicCell.rule.skMeta.exportNodeCustom(logicCell,null))}else if(logicCell.masterCell===logicCell){const skCellM=logicCell.ownerCell.rule.skMeta
const cell=tr.appendChild(skCellM.exportNodeCustom(logicCell.ownerCell,null))
if(logicCell.colSpan>tableRect.endCol-c){skCellM.setColSpan(logicCell.ownerCell.rule,cell,tableRect.endCol-c)}if(logicCell.rowSpan>tableRect.endRow-idxRow){skCellM.setRowSpan(logicCell.ownerCell.rule,cell,tableRect.endRow-idxRow)}}else if(c===tableRect.startCol&&logicCell.rowSpan===logicCell.masterCell.rowSpan){const skCellM=logicCell.ownerCell.rule.skMeta
const cell=skCellM.exportContainerNode(logicCell.ownerCell,tr)
skCellM.setColSpan(logicCell.ownerCell.rule,cell,Math.min(logicCell.colSpan,tableRect.endCol-c))
skCellM.setRowSpan(logicCell.ownerCell.rule,cell,Math.min(logicCell.rowSpan,tableRect.endRow-idxRow))}}}prevRow=logicRow
idxRow++}ch=ch.nextElementSibling
skCh=ch?src.schemaDom.getSkNode(ch):null}return result}return super.exportNodeCustom(src,filters)}exportAsHtml(node,rule,outParent){const p=outParent.appendChild(outParent.ownerDocument.createElement("table"))
super.exportAsHtml(node,rule,p)}onExecRules(skCtx,rule,nodeOrAttr){var _a
if((_a=skCtx.execOptions.nodeDatas)===null||_a===void 0?void 0:_a.has(nodeOrAttr))return
if(!this.checkTableInTable(skCtx,rule))return
textGlobalCheck(this,skCtx,rule,nodeOrAttr)
const skTable=skCtx.skNode
let countCols=0
const rows=[]
let ch=skTable.node.firstElementChild
let prevRow
let maxCellsInRow=1
let lastCol
while(ch){const skCh=skTable.schemaDom.getSkNode(ch)
if(skCh==null)return
const skChM=skCh.rule.skMeta
if(skChM instanceof SkMTxtRow){rows.push(prevRow=skChM.buildLogicRow(skCh,prevRow))
if(prevRow==null)return
if(prevRow.length>maxCellsInRow)maxCellsInRow=prevRow.length}else if(skChM instanceof SkMTxtCol){countCols++
lastCol=skCh}ch=ch.nextElementSibling}(skCtx.execOptions.nodeDatas||(skCtx.execOptions.nodeDatas=new Map)).set(skTable.node,true)
const maxCols=Math.max(countCols,maxCellsInRow)
for(let i=0;i<rows.length;i++){const row=rows[i]
if(row.length<maxCols){if(skCtx.execOptions.autoComplete){const skRuleCell=row.skRow.rule.contentRule.findRule(r=>r.skMeta instanceof SkMTxtCell)
const newCells=[]
for(let i=row.length;i<maxCols;i++)skRuleCell.createContent(newCells)
skCtx.execOptions.corrections.push((new XmlInsertMsg).init(XA.append(XA.from(row.skRow.node),row.skRow.node.childNodes.length),newCells))}else if(skCtx.execOptions.genAnnots){skCtx.addAnnot((new SkAnnotMissing).init("tableCellMissing",row.skRow.node,row.skRow.node.childNodes.length,row.skRow.rule.contentRule,"Des cellules manquent dans cette ligne du tableau."))}}if(row.hasHoles()){if(skCtx.execOptions.autoComplete){const skRuleCell=row.skRow.rule.contentRule.findRule(r=>r.skMeta instanceof SkMTxtCell)
let prevCell
for(let i=0;i<row.length;i++){const cell=row[i]
if(cell==null){const newCells=[]
skRuleCell.createContent(newCells)
while(++i<row.length&&row[i]==null)skRuleCell.createContent(newCells)
i--
skCtx.execOptions.corrections.push((new XmlInsertMsg).init(XA.append(XA.from(row.skRow.node),prevCell?DOM.computeOffset(prevCell.node)+1:0),newCells))}else if(cell instanceof SkNode){prevCell=cell}}}else if(skCtx.execOptions.genAnnots){skCtx.addAnnot((new SkAnnotMissing).init("tableCellMissing",row.skRow.node,row.skRow.node.childNodes.length,row.skRow.rule.contentRule,"Des cellules manquent dans cette ligne du tableau."))}}}const lastRow=rows[rows.length-1]
if(lastRow){for(let i=0;i<lastRow.length;i++){const cell=lastRow[i]
if(cell instanceof MergedCell&&cell.rowSpan>1){if(skCtx.execOptions.autoComplete){const attName=cell.ownerCell.rule.rowSpanAttName
const currentSpan=parseInt(cell.ownerCell.node.getAttribute(attName),10)
skCtx.execOptions.corrections.push((new XmlStrMsg).init(XA.append(XA.from(cell.ownerCell.node),attName),(currentSpan-cell.rowSpan+1).toString()))}else if(skCtx.execOptions.genAnnots){skCtx.addAnnot((new SkAnnotWrongValue).init(lastRow.skRow.node,"Une fusion de cellules déborde par rapport au nombre de lignes."))}let nextR=lastRow[i+1]
while(nextR instanceof MergedCell&&nextR.ownerCell===cell.ownerCell){nextR=lastRow[++i+1]}}}}if(maxCellsInRow>countCols){const skRuleCol=skTable.rule.contentRule.findRule(r=>r.skMeta instanceof SkMTxtCol)
if(skCtx.execOptions.autoComplete){let offset
if(lastCol){offset=DOM.computeOffset(lastCol.node)+1}else{const firstRow=DOM.findFirstChild(skTable.node,n=>{const skCh=n instanceof Element?skTable.schemaDom.getSkNode(n):null
return skCh&&skCh.rule.skMeta instanceof SkMTxtRow})
offset=firstRow?DOM.computeOffset(firstRow):skTable.node.childNodes.length}const newCol=[]
for(let i=countCols;i<maxCellsInRow;i++)skRuleCol.createContent(newCol)
skCtx.execOptions.corrections.push((new XmlInsertMsg).init(XA.append(XA.from(skTable.node),offset),newCol))}else if(skCtx.execOptions.genAnnots){skCtx.addAnnot((new SkAnnotMissing).init("tableColMissing",skTable.node,0,skRuleCol,"Des lignes contiennent plus de cellules que de colonnes déclarées."))}}if(rows.length===0){if(skCtx.execOptions.autoComplete){const skRuleRow=skTable.rule.contentRule.findRule(r=>r.skMeta instanceof SkMTxtRow)
const newRow=[]
skRuleRow.createContent(newRow)
const skRuleCell=skRuleRow.contentRule.findRule(r=>r.skMeta instanceof SkMTxtCell)
let newCells=JML.getJmlChildrenOrBody(newRow,0)
if(!newCells)newRow.push(newCells=[])
for(let i=0;i<maxCols;i++)skRuleCell.createContent(newCells)
skCtx.execOptions.corrections.push((new XmlInsertMsg).init(XA.append(XA.from(skTable.node),skTable.node.childNodes.length),newRow))}else if(skCtx.execOptions.genAnnots){skCtx.addAnnot((new SkAnnotMissing).init("tableRowMissing",skTable.node,skTable.node.childNodes.length,skTable.rule.contentRule,"Au moins une ligne est requise dans le tableau."))}}}checkTableInTable(skCtx,rule){const from=skCtx.skNode.node
const schemaDom=skCtx.skNode.schemaDom
let par=from.parentNode
while(par&&par.namespaceURI===DOM.SCCORE_NS){const skPar=schemaDom.getSkNode(par)
if(skPar&&skPar.rule.skMeta instanceof SkMTxtCell){if(skCtx.execOptions.autoCleanup){skCtx.execOptions.corrections.push((new XmlDeleteMsg).init(XA.from(from),1))}else if(skCtx.execOptions.genAnnots){skCtx.addAnnot((new SkAnnotEltUnknown).init(from,skCtx.skNode.rule))}return false}par=par.parentNode}return true}async tryPasteNodes(ctx,content,cache){if(!isSkTableImportContext(ctx))return super.tryPasteNodes(ctx,content,cache)
return(await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/import/importTable.js")).tryImportInTable(this,ctx,content,cache)}}SKMETALIB.registerMetaNode(new SkMTxtTable("TxtTable"))
function isSkTableImportContext(importCtx){return importCtx.cellInsertPoint!=null}export class SkMTxtCol extends SkMTxtRolable{get gramLevelType(){return EGramLevelType.text}setWidthInPx(skRule,cell,width){cell.setAttribute(skRule.widthAttName||"width",Math.max(2,Math.round(width/6)).toString())}onExecRules(skCtx,rule,nodeOrAttr){if(skCtx.execOptions.resetAll)return
if(!skCtx.execOptions.genAnnots&&!skCtx.execOptions.autoComplete)return
textGlobalCheck(this,skCtx,rule,nodeOrAttr)
const table=skCtx.node.parentElement
if(!table)return
const skTable=skCtx.skNode.schemaDom.getSkNode(table)
if(skTable&&skTable.rule.skMeta instanceof SkMTxtTable){(skCtx.execOptions.shouldRevalid||(skCtx.execOptions.shouldRevalid=new Set)).add(skTable.node)}}}SKMETALIB.registerMetaNode(new SkMTxtCol("TxtCol"))
export class SkMTxtRow extends SkMTxtRolable{get gramLevelType(){return EGramLevelType.text}get forceExportContainer(){return true}exportNode(src,parentTarget,scope,fromDepth,toDepth){if(fromDepth==null&&toDepth==null){if(parentTarget)JML.appendDomNode(src.node,true,parentTarget)}else{const from=fromDepth!=null?scope.start[fromDepth]||0:0
if(typeof from==="string")throw Error(`Export fragment throw attributes not allowed: ${scope.start}`)
const to=toDepth!=null&&toDepth<scope.end.length?scope.end[toDepth]:Infinity
if(typeof to==="string")throw Error(`Export fragment throw attributes not allowed: ${scope.end}`)
let ch=from===0?src.node.firstChild:src.node.childNodes.item(from)
let i=from
if(ch&&i<to&&fromDepth!=null&&fromDepth<scope.start.length-1){const subSkNode=src.schemaDom.getSkNode(ch)
if(subSkNode&&subSkNode.rule.skMeta instanceof SkMTxtCell){subSkNode.rule.skMeta.exportNode(subSkNode,parentTarget,scope,fromDepth+1,null)}ch=ch.nextSibling
i++}while(ch&&i<to){const subSkNode=src.schemaDom.getSkNode(ch)
if(subSkNode&&subSkNode.rule.skMeta instanceof SkMTxtCell){subSkNode.rule.skMeta.exportContent(subSkNode,parentTarget)}ch=ch.nextSibling
i++}if(ch&&toDepth!=null&&toDepth<scope.end.length-1){const subSkNode=src.schemaDom.getSkNode(ch)
if(subSkNode&&subSkNode.rule.skMeta instanceof SkMTxtCell){subSkNode.rule.skMeta.exportNode(subSkNode,parentTarget,scope,null,toDepth+1)}}}return parentTarget}exportContent(src,parentTarget){let ch=src.node.firstChild
while(ch){const skCh=src.schemaDom.getSkNode(ch)
if(skCh&&skCh.rule.skMeta instanceof SkMTxtCell){skCh.rule.skMeta.exportContent(skCh,parentTarget)}ch=ch.nextSibling}}exportAsHtml(node,rule,outParent){const p=outParent.appendChild(outParent.ownerDocument.createElement("tr"))
super.exportAsHtml(node,rule,p)}onExecRules(skCtx,rule,nodeOrAttr){if(skCtx.execOptions.resetAll)return
if(!skCtx.execOptions.genAnnots&&!skCtx.execOptions.autoComplete)return
textGlobalCheck(this,skCtx,rule,nodeOrAttr)
const table=skCtx.node.parentElement
if(!table)return
const skTable=skCtx.skNode.schemaDom.getSkNode(table)
if(skTable&&skTable.rule.skMeta instanceof SkMTxtTable){(skCtx.execOptions.shouldRevalid||(skCtx.execOptions.shouldRevalid=new Set)).add(skTable.node)}}buildLogicRow(skRow,previousRow){const logicRow=new LogicRow(skRow,previousRow)
let cell=skRow.node.firstElementChild
while(cell){const skCell=skRow.schemaDom.getSkNode(cell)
if(skCell==null)return null
if(skCell.rule.skMeta instanceof SkMTxtCell){const spans=skCell.rule.skMeta.getSpans(skCell)
if(spans!=null){const master=new MergedCell(skCell,spans.rowSpan,spans.colSpan)
logicRow.addCell(master)
for(let i=1;i<spans.colSpan;i++)logicRow.addCell(new MergedCell(skCell,spans.rowSpan,spans.colSpan-i,master))}else{logicRow.addCell(skCell)}}cell=cell.nextElementSibling}return logicRow}}SKMETALIB.registerMetaNode(new SkMTxtRow("TxtRow"))
export class SkMTxtCell extends SkMTxtRolable{get gramLevelType(){return EGramLevelType.text}initSkRule(skRule,confRule){super.initSkRule(skRule,confRule)
skRule.rowSpanAttName=confRule.getAttributeNS(SK_NS,"rowSpanAtt")
skRule.colSpanAttName=confRule.getAttributeNS(SK_NS,"colSpanAtt")}get isParaParent(){return true}exportContainerNode(src,parentTarget,scope,fromDepth,toDepth){if(fromDepth!=null||toDepth!=null)return null
return super.exportContainerNode(src,parentTarget,scope,fromDepth,toDepth)}exportAsHtml(node,rule,outParent){const p=outParent.appendChild(outParent.ownerDocument.createElement("td"))
const spans=this.getSpans({rule:rule,node:node})
if(spans){if(spans.rowSpan>1)p.setAttribute("rowspan",spans.rowSpan.toString())
if(spans.colSpan>1)p.setAttribute("colspan",spans.colSpan.toString())}super.exportAsHtml(node,rule,p)}getSpans(skCell){const rule=skCell.rule
const rowSpan=rule.rowSpanAttName?skCell.node.getAttribute(rule.rowSpanAttName):null
const colSpan=rule.colSpanAttName?skCell.node.getAttribute(rule.colSpanAttName):null
const rowSpanInt=rowSpan?parseInt(rowSpan,10)||1:1
const colSpanInt=colSpan?parseInt(colSpan,10)||1:1
return rowSpanInt>1||colSpanInt>1?{rowSpan:Math.max(1,rowSpanInt),colSpan:Math.max(1,colSpanInt)}:null}setRowSpan(skRule,cell,span){if(span>1)cell.setAttribute(skRule.rowSpanAttName,span.toString(10))
else cell.removeAttribute(skRule.rowSpanAttName)}setColSpan(skRule,cell,span){if(span>1)cell.setAttribute(skRule.colSpanAttName,span.toString(10))
else cell.removeAttribute(skRule.colSpanAttName)}onExecRules(skCtx,rule,nodeOrAttr){if(skCtx.execOptions.autoCleanup&&skCtx.execOptions.corrections.length>0)skipUnknownTxtNode(skCtx,rule,nodeOrAttr)
if(skCtx.execOptions.resetAll)return
if(!skCtx.execOptions.genAnnots&&!skCtx.execOptions.autoComplete)return
textGlobalCheck(this,skCtx,rule,nodeOrAttr)
let table=skCtx.node.parentElement
table=table?table.parentElement:null
if(!table)return
const skTable=skCtx.skNode.schemaDom.getSkNode(table)
if(skTable&&skTable.rule.skMeta instanceof SkMTxtTable){(skCtx.execOptions.shouldRevalid||(skCtx.execOptions.shouldRevalid=new Set)).add(skTable.node)}}}SKMETALIB.registerMetaNode(new SkMTxtCell("TxtCell"))
export class SkMTxtDiv extends SkMTxtRolable{get gramLevelType(){return EGramLevelType.text}get isParaParent(){return true}exportAsHtml(node,rule,outParent){const p=outParent.appendChild(outParent.ownerDocument.createElement("div"))
if(rule.role)p.setAttribute("class",rule.role)
super.exportAsHtml(node,rule,p)}}SKMETALIB.registerMetaNode(new SkMTxtDiv("TxtDiv"))
export class LogicRow extends Array{constructor(skRow,prev){super()
this.skRow=skRow
if(prev)for(let i=0;i<prev.length;i++){const c=prev[i]
if(c instanceof MergedCell&&c.rowSpan>1){this[i]=new MergedCell(c.ownerCell,c.rowSpan-1,c.colSpan,c)
this.withHoles=true}}}hasHoles(){if(!this.withHoles)return false
for(let i=0;i<this.length;i++)if(this[i]==null)return true
return false}addCell(cell){if(this.withHoles)for(let i=0;i<this.length;i++){if(this[i]==null){this[i]=cell
return}}this.push(cell)}}export class MergedCell{constructor(ownerCell,rowSpan,colSpan,master){this.ownerCell=ownerCell
this.masterCell=master||this
this.rowSpan=rowSpan
this.colSpan=colSpan}get isMaster(){return this===this.masterCell}}function skipUnknownTxtNode(skCtx,rule,elt){const schema=skCtx.skNode.schemaDom
for(let ch=elt.firstChild;ch;ch=ch.nextSibling){const skNode=schema.getSkNode(ch)
if(skNode&&skNode.rule instanceof SkRuleEltUnknown&&ch.namespaceURI===DOM.SCCORE_NS&&ch.hasChildNodes()){const tw=elt.ownerDocument.createTreeWalker(ch)
tw.nextNode()
let jml
do{if(rule.contentRule.findRuleNodeFor(tw.currentNode)){if(!jml)jml=JML.dom2jml(tw.currentNode)
else JML.dom2jml(tw.currentNode,jml)
if(!tw.nextSibling()&&!tw.nextNode())break}else if(!tw.nextNode())break}while(true)
if(jml)skCtx.execOptions.corrections.push((new XmlInsertMsg).init(XA.from(ch),jml))}}}const skruleCmtBlackHole=(new SkRuleComment).initSkMeta(SKMETALIB.getMetaNode("BlackHole"))

//# sourceMappingURL=schemaMetaTxt.js.map