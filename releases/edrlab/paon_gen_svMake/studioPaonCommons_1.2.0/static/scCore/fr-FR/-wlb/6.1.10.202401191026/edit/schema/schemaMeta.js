import{DOM,ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{replaceXmlContent,XmlBatch,XmlBodyState,XmlDeleteMsg,XmlInsertMsg,XmlListMsgOt,XmlStrMsg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{EPastePos,SchemaDom}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schema.js"
import{EAnnotLevel,SkAnnotEltFree,SkAnnotWrongValue}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaAnnots.js"
import{SkRuleChoice,SkRuleElt,SkRuleNode}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaPatterns.js"
import{CONVERT}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/import/convert.js"
import{SK_NS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaBuilder.js"
var IS_comment=DOM.IS_comment
export class SkMetaLib{constructor(parent){this._dict=Object.create(parent?parent._dict:null)}registerMetaNode(skm){this._dict[skm.id]=skm}getMetaNode(id){const m=this._dict[id]
if(!m)throw Error(`SkMetaModel not found : ${id}`)
return m}}export const SKMETALIB=new SkMetaLib
export var EGramLevelType;(function(EGramLevelType){EGramLevelType[EGramLevelType["block"]=1]="block"
EGramLevelType[EGramLevelType["metas"]=2]="metas"
EGramLevelType[EGramLevelType["text"]=3]="text"
EGramLevelType[EGramLevelType["inline"]=4]="inline"
EGramLevelType[EGramLevelType["undef"]=0]="undef"})(EGramLevelType||(EGramLevelType={}))
function cleanupNodes(node,ctx,startRule,malus,parentRule){if(node instanceof Element){let subSchemaDom=new SchemaDom(ctx.schemaDom.schema,startRule,node)
let cycles=0
let results=subSchemaDom.validateDocument({autoMutate:true,autoComplete:true,autoCleanup:true,autoNormXml:true,autoNormChars:true,importCtx:ctx})
if(results.mutations||results.corrections.length>0)node=node.cloneNode(true)
while(results.mutations||results.corrections.length>0){if(!results.mutations)malus+=results.corrections.length*10
new XmlBodyState("").resetDom(node).update((new XmlListMsgOt).initConcurrentList(results.mutations||results.corrections))
const subRule=parentRule.contentRule.findRuleNodeFor(node)
subSchemaDom=new SchemaDom(ctx.schemaDom.schema,subRule,node)
results=subSchemaDom.validateDocument({autoMutate:true,autoComplete:true,autoCleanup:true,autoNormXml:true,autoNormChars:true,importCtx:ctx})
if(cycles++>50){console.warn("Infinite validation loop: ",results,node)
break}}}else if(node instanceof Text){const msgs=[]
parentRule.skMeta.normChars(node,msgs,true)
if(msgs.length>0){node=node.cloneNode(true)
new XmlBodyState("").resetDom(node).update((new XmlListMsgOt).initConcurrentList(msgs))}}else{console.error("Node type unknown",node)}return{node:node,malus:malus}}export class SkMBase{constructor(id){this.id=id}get gramLevelType(){return EGramLevelType.undef}initSkRule(skRule,confRule){}ruleMatch(skRule,node){return true}exportNode(src,parentTarget,scope,fromDepth,toDepth){if(fromDepth==null&&toDepth==null){if(parentTarget)JML.appendDomNode(src.node,true,parentTarget)}else{let from=fromDepth!=null?scope.start[fromDepth]||0:0
if(typeof from==="string")throw Error(`Export fragment throw attributes not allowed: ${scope.start}`)
let clone=this.exportContainerNode(src,parentTarget,scope,fromDepth,toDepth)
if(clone){from=Math.max(from,Array.isArray(clone)?JML.lengthJmlOrText(clone):clone.childNodes.length)
if(!parentTarget)clone=null}else{clone=parentTarget}const to=toDepth!=null&&toDepth<scope.end.length?scope.end[toDepth]:Infinity
if(typeof to==="string")throw Error(`Export fragment throw attributes not allowed: ${scope.end}`)
let ch=from===0?src.node.firstChild:src.node.childNodes.item(from)
let i=from
if(ch&&i<to&&fromDepth!=null&&fromDepth<scope.start.length-1){const subSkNode=src.schemaDom.getSkNode(ch)
if(subSkNode){subSkNode.rule.skMeta.exportNode(subSkNode,clone,scope,fromDepth+1,null)}else{if(clone)XA.cloneAfter(ch,clone,scope.start,fromDepth+1)
if(scope.deletes){if(!(ch instanceof CharacterData))throw Error()
const startOffset=XA.last(scope.start)
if(typeof startOffset==="string")throw Error()
if(startOffset<ch.length)scope.deletes.add((new XmlDeleteMsg).init(scope.start,ch.length-startOffset))}}ch=ch.nextSibling
i++
from++}while(ch&&i<to){if(clone)JML.appendDomNode(ch,true,clone)
ch=ch.nextSibling
i++}if(ch&&toDepth!=null&&toDepth<scope.end.length-1){const subSkNode=src.schemaDom.getSkNode(ch)
if(subSkNode){subSkNode.rule.skMeta.exportNode(subSkNode,clone,scope,null,toDepth+1)}else{if(clone)XA.cloneBefore(ch,clone,scope.end,toDepth+1)
if(scope.deletes){if(!(ch instanceof CharacterData))throw Error()
const endOffset=XA.last(scope.end)
if(typeof endOffset==="string")throw Error()
if(endOffset>0)scope.deletes.add((new XmlDeleteMsg).init(XA.newBd(scope.end).setAtDepth(-1,0).xa,endOffset))}}}if(scope.deletes&&i>from)scope.deletes.add((new XmlDeleteMsg).init(XA.append(XA.from(src.node),from),i-from))}return parentTarget}exportNodeCustom(src,filters){return src.node.cloneNode(true)}exportAsText(node,rule,buf){for(let ch=node.firstChild;ch;ch=ch.nextSibling){if(ch instanceof Text)buf.push(ch.nodeValue)
else{const r=ch.rule
if(r&&r.skMeta)r.skMeta.exportAsText(ch,r,buf)}}}exportAsHtml(node,rule,outParent){for(let ch=node.firstChild;ch;ch=ch.nextSibling){if(ch instanceof Text)outParent.appendChild(outParent.ownerDocument.createTextNode(ch.nodeValue))
else{const r=ch.rule
if(r&&r.skMeta)r.skMeta.exportAsHtml(ch,r,outParent)}}}exportAsHtmlChildren(node,rule,outParent){SkMBase.prototype.exportAsHtml.call(this,node,rule,outParent)}exportContainerNode(src,parentTarget,scope,fromDepth,toDepth){if(fromDepth!=null&&toDepth!=null)return null
return parentTarget?JML.appendDomNode(src.node,false,parentTarget):null}exportContent(src,parentTarget){let ch=src.node.firstChild
while(ch){JML.appendDomNode(ch,true,parentTarget)
ch=ch.nextSibling}}async tryPasteNodes(ctx,content,cache){const known=await this.findKnownNodes(ctx,content,true,cache)
if(known){if(known.nodes[0]instanceof Attr){console.log("TODO import attrs...")}else{let importPos=EPastePos.none
let malus=known.malus
let nodes
if(ctx.skRuleStack){const offset=ctx.sel.start[ctx.sel.start.length-1-ctx.virtualPath.length]
nodes=known.nodes
importPos=ctx.schemaDom.getPastePos(ctx.ctn,offset,offset,ctx.skRuleStack[0])}else{const startSeq=XA.range2StartSeq(ctx.sel)
const offsetMin=XA.last(startSeq.start)
const offsetMax=offsetMin+startSeq.len
nodes=[]
for(const node of known.nodes){if(ctx.ctn instanceof Text){importPos|=EPastePos.anywhere
nodes.push(node)}else if(node instanceof Comment){importPos|=EPastePos.anywhere
nodes.push(node)}else{const pos=ctx.schemaDom.getPastePos(ctx.ctn,offsetMin,offsetMax,node)
if(pos!==EPastePos.none){importPos|=pos
nodes.push(node)}else{malus+=10}}}}if(importPos!==EPastePos.none)return[new SkImpSimple(ctx,nodes,malus,importPos)]}}return null}async findKnownNodes(ctx,content,deepFind,cache){if(content.localName==="fragment"&&content.namespaceURI===DOM.SCCORE_NS){if(typeof SKMETA.ctxInsertStartOffset(ctx)==="string")return null
if(ctx.preserveUnknown){return content.hasChildNodes()?{nodes:Array.from(content.childNodes),malus:0}:null}else{const nodes=[]
let malus=0
const findKnown=async(parent,costLost)=>{for(let node=parent.firstChild;node;node=node.nextSibling){const knownNode=await this.mutateNodeToKnownNode(ctx,node,cache)
if(knownNode){malus+=knownNode.malus
if(knownNode.node instanceof DocumentFragment){for(let n=knownNode.node.firstChild;n;n=n.nextSibling)nodes.push(n)}else nodes.push(knownNode.node)}else if(deepFind&&node.hasChildNodes()){malus+=costLost
if(costLost>50)continue
await findKnown(node,costLost+20)}}}
await findKnown(content,10)
if(nodes.length>0)return{nodes:nodes,malus:malus}}}else{const knownNode=await this.mutateNodeToKnownNode(ctx,content,cache)
if(knownNode){const res={nodes:[],malus:knownNode.malus}
if(knownNode.node instanceof DocumentFragment){for(let n=knownNode.node.firstChild;n;n=n.nextSibling)res.nodes.push(n)}else res.nodes.push(knownNode.node)
return res.nodes.length>0?res:null}}return null}async tryPasteText(ctx,text,cache){if(!text)return null
const node=ctx.schemaDom.document.createTextNode(text)
const knownNode=await this.mutateNodeToKnownNode(ctx,node,cache)
return knownNode?[new SkImpSimple(ctx,[knownNode.node],knownNode.malus,EPastePos.anywhere)]:null}async tryPasteLinks(ctx,linksInfo,cache){let offsetMin,offsetMax
let parent=ctx.ctn
if(ctx.ctn instanceof Text){parent=parent.parentNode
offsetMin=0
offsetMax=0}else{const startSeq=XA.range2StartSeq(ctx.sel)
offsetMin=XA.last(startSeq.start)
offsetMax=offsetMin+startSeq.len}const importers=[]
ctx.skNode.rule.contentRule.findRules(rule=>{if(rule.skMeta&&rule.skMeta._pushLinksImporters!==SkMBase.prototype._pushLinksImporters){const pos=ctx.schemaDom.getPastePos(parent,offsetMin,offsetMax,rule)
if(pos!==EPastePos.none)rule.skMeta._pushLinksImporters(importers,rule,pos,ctx,linksInfo,cache)}return false})
return importers}async tryImportNodes(ctx,content,cache){if(DOM.IS_element(content)&&content.localName==="fragment"&&content.namespaceURI===DOM.SCCORE_NS){let node=content.firstChild
let pos
if(ctx.virtualPath){const lastRule=SKMETA.ctxLastSkRule(ctx)
if(lastRule instanceof SkRuleNode){const ctRule=lastRule.contentRule
const subCard=ctRule.getRealCardSubNode(node.nodeType,node.nodeName)
if(subCard!==undefined)pos={insertOffsetMin:0,insertOffsetMax:0,similarTo:node}}}else{pos=ctx.schemaDom.getImportPos(ctx.ctn,node)}if(pos){const ct=[node]
for(node=node.nextSibling;node;node=node.nextSibling)ct.push(node)
return[new SkImpCleanup(ctx,ct,0,pos)]}}else if(content instanceof Attr){console.trace("TODO import attribute")}return null}async tryImportLinks(ctx,linksInfo,cache){let importers=null
const lastRule=SKMETA.ctxLastSkRule(ctx)
if(lastRule instanceof SkRuleNode){lastRule.contentRule.findRules(rule=>{if(rule.skMeta&&rule.skMeta._pushLinksImporters!==SkMBase.prototype._pushLinksImporters){let pos
if(ctx.virtualPath){if(rule.structType===ENodeType.attribute){pos={insertAtts:rule.structName,similarTo:rule}}else{pos={insertOffsetMin:0,insertOffsetMax:0,similarTo:rule}}}else{pos=ctx.schemaDom.getImportPos(ctx.ctn,rule)}if(pos)rule.skMeta._pushLinksImporters(importers||(importers=[]),rule,pos,ctx,linksInfo,cache)}return false})}return importers}_pushLinksImporters(results,skRule,pos,ctx,linksInfo,cache){}async mutateNodeToText(ctx,content){const atts=SKMETA.getAttsInFragment(content)
if(atts){const att=atts.attributes.item(0)
return att?att.value:""}return content.textContent}async mutateNodeToKnownNode(ctx,node,cache){const malus=0
const doc=node.ownerDocument||node
if(doc===document||doc instanceof HTMLDocument){node.normalize()
let gram=cache.originalHtml===node?cache.gram:null
if(!gram){gram=(await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/import/html2gram.js")).html2gram(node)
if(cache.originalHtml===node)cache.gram=gram
if(!gram)return null}const lastRule=SKMETA.ctxLastSkRule(ctx)
if(!(lastRule instanceof SkRuleElt))return null
let contentRules=lastRule.contentRule
const idx=XA.last(ctx.sel.start)
if(typeof idx==="number"&&idx>0){const ch=ctx.ctn.childNodes[idx-1]
if(ch){const skAfter=ctx.schemaDom.getSkNode(ch)
if(skAfter)contentRules=contentRules.buildRuleAfter(skAfter.rule)}}let result=(await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/import/gram.js")).transposeGram(gram,contentRules,{trspProv:ctx.schemaDom.gramTransposerProv,abortIfNotInline:ctx.abortIfNotInline})
if(result){if(result.node instanceof DocumentFragment){let ch=result.node.firstChild
while(ch){const next=ch.nextSibling
result.node.removeChild(ch)
const subResult=cleanupNodes(ch,ctx,lastRule.contentRule.findRuleNodeFor(ch),0,lastRule)
result.malus+=subResult.malus
result.node.insertBefore(subResult.node,next)
ch=next}}else{result=cleanupNodes(result.node,ctx,lastRule.contentRule.findRuleNodeFor(result.node),result.malus,lastRule)}}return result}else{let parentRule
if(ctx.virtualPath){const lastRule=SKMETA.ctxLastSkRule(ctx)
if(!(lastRule instanceof SkRuleNode))throw Error(this.id+" must not be an attribute.")
parentRule=lastRule}else{parentRule=ctx.skNode.rule}if(IS_comment(node))return parentRule.getUnknownNodeRule(ctx.skNode,node)?{node:node,malus:0}:null
const subRule=parentRule.contentRule.findRuleNodeFor(node)
if(subRule){const oldNode=node
const nextS=node.nextSibling
const parent=node.parentNode
if(parent)parent.removeChild(node)
const result=cleanupNodes(node,ctx,subRule,malus,parentRule)
if(parent)parent.insertBefore(oldNode,nextS)
return result}const rules=parentRule.contentRule.findRules(r=>r instanceof SkRuleElt)
if(rules){const src={node:node}
for(const r of rules){if(r.convertFrom){src.outStruct=r
const cnv=r.convertFrom.findConverter(src)
if(cnv){const dst=await cnv.convert(src)
if(dst){const nodeMut=CONVERT.getDstAsNode(dst)
if(nodeMut)return{node:nodeMut,malus:malus}}}}}}}return null}normChars(ctn,msgs){}onExecRulesStart(skCtx){}onExecRules(skCtx,rule,nodeOrAttr){}overwriteAlternates(skAnc,parent,toReplace,offset,nodeType,nodeName,result){return result}isInsertable(parent,rule){return true}isTextSearchable(skNode,nodeOrAttr){return false}computeGramBindingMalus(gram,rule,childrenMalus){const coef=rule.skMalusCoef
return coef!=null?gram.weight*coef+childrenMalus:childrenMalus}getAspect(keyAspect,rule,skNode,options){return null}}export class SkMGenericElt extends SkMBase{get gramLevelType(){return EGramLevelType.block}isTextSearchable(skNode,nodeOrAttr){return true}}export class SkMGenericAtt extends SkMBase{async tryPasteText(ctx,text,cache){return text?[new SkImpSimple(ctx,text.replace(/\n\r|\r\n|\r|\n/g," "))]:null}async tryPasteNodes(ctx,content,cache){const text=await this.mutateNodeToText(ctx,content)
return text?this.tryPasteText(ctx,text,cache):null}isTextSearchable(skNode,nodeOrAttr){return true}onExecRules(skCtx,rule,nodeOrAttr){if(skCtx.execOptions.autoNormXml){if(nodeOrAttr.nodeName==="xmlns"||nodeOrAttr.prefix==="xmlns"){skCtx.execOptions.corrections.push((new XmlStrMsg).init(XA.from(nodeOrAttr),null))}}}}export class SkMFixedAttr extends SkMGenericAtt{initSkRule(skRule,confRule){if(confRule.hasAttributeNS(SK_NS,"fixedValue"))skRule.fixedValue=confRule.getAttributeNS(SK_NS,"fixedValue")||""}isTextSearchable(skNode,nodeOrAttr){return false}onExecRules(skCtx,rule,nodeOrAttr){if(skCtx.execOptions.autoComplete&&"fixedValue"in rule){if(!nodeOrAttr||nodeOrAttr.value==null||nodeOrAttr.value!=rule.fixedValue)skCtx.execOptions.corrections.push((new XmlStrMsg).init(XA.from(nodeOrAttr),rule.fixedValue))}}}SKMETALIB.registerMetaNode(new SkMFixedAttr("FixedAttr"))
export class SkMComment extends SkMBase{async tryPasteNodes(ctx,content,cache){const text=await this.mutateNodeToText(ctx,content)
return text?[new SkImpSimple(ctx,text)]:null}async tryPasteText(ctx,text,cache){if(!text)return null
return[new SkImpSimple(ctx,text,0,EPastePos.anywhere)]}}export class SkMDocument extends SkMBase{}SKMETALIB.registerMetaNode(new SkMGenericElt("*"))
SKMETALIB.registerMetaNode(new SkMGenericAtt("@"))
SKMETALIB.registerMetaNode(new SkMComment("!"))
SKMETALIB.registerMetaNode(new SkMDocument("/"))
class SkMBlackHole extends SkMBase{get gramLevelType(){return EGramLevelType.block}initSkRule(skRule,confRule){skRule.card="*"
if(skRule instanceof SkRuleElt)skRule.noAutoComplete=true
skRule.initContentRule(SkRuleChoice.ANY)}onExecRules(skCtx,rule,nodeOrAttr){if(skCtx.execOptions.autoComplete){skCtx.execOptions.corrections.push((new XmlDeleteMsg).init(XA.from(nodeOrAttr),1))}else if(skCtx.execOptions.genAnnots){skCtx.addAnnot((new SkAnnotEltFree).init(nodeOrAttr,"Cet élément devrait être éliminé dans ce contexte."))}}isInsertable(parent,rule){return false}}SKMETALIB.registerMetaNode(new SkMBlackHole("BlackHole"))
class SkMDeprecated extends SkMBase{get gramLevelType(){return EGramLevelType.block}initSkRule(skRule,confRule){super.initSkRule(skRule,confRule)
skRule.deprecatedMsg=confRule.getAttributeNS(SK_NS,"deprecatedMsg")}onExecRules(skCtx,rule,node){super.onExecRules(skCtx,rule,node)
skCtx.addAnnot((new SkAnnotEltFree).init(node,rule.deprecatedMsg||"Élément déprécié",EAnnotLevel.warning))}isInsertable(parent,rule){return false}}SKMETALIB.registerMetaNode(new SkMDeprecated("Deprecated"))
SKMETALIB.registerMetaNode(new SkMGenericElt("Item"))
export class SkMObject extends SkMBase{getOffsetAfterMeta(src){const ch=src.node.firstElementChild
if(ch){const skCh=src.schemaDom.getSkNode(ch)
if(skCh&&skCh.rule.skMeta instanceof SkMMeta)return DOM.computeOffset(ch)}return 0}getMetaRule(rule){var _a
return(_a=rule.contentRule)===null||_a===void 0?void 0:_a.findRule(r=>r.skMeta instanceof SkMMeta)}exportContainerNode(src,parentTarget,scope,fromDepth,toDepth){if(fromDepth!=null&&toDepth!=null&&!this.forceExportContainer)return null
const clone=parentTarget?JML.appendDomNode(src.node,false,parentTarget):[]
const ch=src.node.firstElementChild
if(ch){const skCh=src.schemaDom.getSkNode(ch)
if(skCh&&skCh.rule.skMeta instanceof SkMMeta){skCh.rule.skMeta.exportNode(skCh,clone,scope)}}return clone}exportContent(src,parentTarget){let ch=src.node.firstChild
if(ch){const skCh=src.schemaDom.getSkNode(ch)
if(skCh&&skCh.rule.skMeta instanceof SkMMeta)ch=ch.nextSibling
while(ch){JML.appendDomNode(ch,true,parentTarget)
ch=ch.nextSibling}}}}export class SkMCompo extends SkMObject{get gramLevelType(){return EGramLevelType.block}}SKMETALIB.registerMetaNode(new SkMCompo("Compo"))
export class SkMPart extends SkMObject{get gramLevelType(){return EGramLevelType.block}exportAsHtml(node,rule,outParent){if(rule.skFamily==="sub-level"){const sec=outParent.appendChild(outParent.ownerDocument.createElement("section"))
super.exportAsHtml(node,rule,sec)}else{super.exportAsHtml(node,rule,outParent)}}}SKMETALIB.registerMetaNode(new SkMPart("Part"))
export class SkMMeta extends SkMBase{get gramLevelType(){return EGramLevelType.metas}}SKMETALIB.registerMetaNode(new SkMMeta("Meta"))
export class SkMField extends SkMBase{get gramLevelType(){return EGramLevelType.metas}exportAsText(node,rule,buf){if(node.hasChildNodes()){if(rule.skFamily==="property/title"){super.exportAsText(node,rule,buf)}else if(rule.skFamily==="property/url"){}else{}}}exportAsHtml(node,rule,outParent){if(node.hasChildNodes()){if(rule.skFamily==="property/title"){let ti
if(DOM.findFirstChild(outParent,n=>n.nodeName.length===2&&n.nodeName[0]==="h")){const p=outParent.appendChild(outParent.ownerDocument.createElement("p"))
ti=p.appendChild(outParent.ownerDocument.createElement("b"))}else{let depth=0
DOM.findParentOrSelf(outParent,null,n=>{if(n.nodeName==="section")depth++
return depth==6})
ti=outParent.appendChild(outParent.ownerDocument.createElement("h"+Math.max(1,depth)))}super.exportAsHtml(node,rule,ti)
const ch=ti.firstElementChild
if(ch&&ch.localName==="p"){while(ch.firstChild)ti.appendChild(ch.firstChild)
ch.remove()}}else if(rule.skFamily==="property/url"){if(outParent instanceof HTMLAnchorElement){outParent.href=node.textContent}}else if(rule.skFamily==="content"){super.exportAsHtml(node,rule,outParent)}else{}}}normChars(ctn,msgs,noTrim,val){const str=val||ctn.nodeValue
const spEnd=noTrim?-1:DOM.txtEndSpLen(str)
if(spEnd>0){msgs.push((new XmlDeleteMsg).init(XA.append(XA.from(ctn),str.length-spEnd),spEnd))}const spStart=noTrim?-1:DOM.txtStartSpLen(str)
if(spStart>0){msgs.push((new XmlDeleteMsg).init(XA.append(XA.from(ctn),0),spStart))}const re=DOM.COLLAPSE_WS
re.lastIndex=0
let res
while(res=re.exec(str)){if(spStart>0&&res.index===0)continue
if(spEnd>0&&res.index===str.length-res[0].length)continue
const xa=XA.append(XA.from(ctn),res.index)
msgs.push((new XmlDeleteMsg).init(xa,res[0].length),(new XmlInsertMsg).init(xa," "))}}isTextSearchable(skNode,nodeOrAttr){if(skNode.rule.contentRule instanceof SkRuleChoice)return false
if(skNode.rule.contentRule instanceof SkRuleChoice)return false
return true}}SKMETALIB.registerMetaNode(new SkMField("Field"))
class SkMId extends SkMBase{initSkRule(skRule,confRule){skRule.crossMgrId=confRule.getAttributeNS(SK_NS,"crossMgrId")||""}onExecRules(skCtx,rule,attr){const opts=skCtx.execOptions
let id
if(opts.autoComplete){if(!attr.nodeValue){const mgr=skCtx.skNode.schemaDom.crossDomMgrs[rule.crossMgrId]
id=this.genId(rule,opts,id,mgr)
opts.corrections.push((new XmlStrMsg).init(XA.from(attr),id))}}if(opts.genAnnots){if(!id)id=attr.nodeValue
if(id){const mgr=skCtx.skNode.schemaDom.crossDomMgrs[rule.crossMgrId]
if(mgr.updateMap(id,attr,skCtx,opts.autoMutate)==="conflict"){if(opts.autoMutate){id=this.genId(rule,opts,id,mgr);(opts.mutations||(opts.mutations=[])).push((new XmlStrMsg).init(XA.from(attr),id))}else{skCtx.addAnnot((new SkAnnotWrongValue).init(attr,"Cet identifiant n\'est pas unique dans le document"))}}}}}genId(rule,opts,id,mgr){const key="__ids:"+rule.crossMgrId
const setIds=opts[key]||(opts[key]=new Set)
id=mgr.generateId(setIds)
setIds.add(id)
return id}getAspect(keyAspect,rule,skNode,options){if(keyAspect==="XmlIdMgr")return skNode.schemaDom.crossDomMgrs[rule.crossMgrId]
return null}}SKMETALIB.registerMetaNode(new SkMId("IdAttr"))
class SkMAutoFillAsync extends SkMField{initSkRule(skRule,confRule){skRule.crossMgrId=confRule.getAttributeNS(SK_NS,"crossMgr")||""}async onExecRules(skCtx,rule,nodeOrAttr){var _a
const opts=skCtx.execOptions
if(opts.autoComplete){const schemaDom=skCtx.skNode.schemaDom
const mgr=schemaDom.crossDomMgrs[rule.crossMgrId]
if(mgr.needNewVal(schemaDom,nodeOrAttr,rule)){const value=await mgr.newValue(schemaDom,nodeOrAttr,rule)
if(value!=null&&(nodeOrAttr instanceof Attr?(_a=nodeOrAttr.ownerElement)===null||_a===void 0?void 0:_a.isConnected:nodeOrAttr.isConnected&&mgr.needNewVal(schemaDom,nodeOrAttr,rule))){schemaDom.house.executeBatch((new XmlBatch).setMeta("noFocus",true).add(nodeOrAttr instanceof Element?replaceXmlContent(nodeOrAttr,[value]):(new XmlStrMsg).init(XA.from(nodeOrAttr),value)))}}}}getAspect(keyAspect,rule,skNode,options){if(keyAspect==="AutoFillAsyncMgr")return skNode.schemaDom.crossDomMgrs[rule.crossMgrId]
return null}}SKMETALIB.registerMetaNode(new SkMAutoFillAsync("AutoFillAsync"))
export class SkImpBase{constructor(schemaDom,pos){if(schemaDom)this.schemaDom=schemaDom
if(pos!=null){if(typeof pos==="number")this.pastePos=pos
else this.importPos=pos}}getLabel(){return this.malus>0?"Collage partiel":"Collage complet"}doImport(context,batch){throw Error("Not implemented")}}export class SkImpSimple extends SkImpBase{constructor(ctx,content,malus=0,pos){super(ctx.schemaDom,pos)
this.contentToImport=content
this.malus=malus}doImport(context,batch){const ctx=SKMETA.buildSkImportCtxInternal(context,this.schemaDom)
const content=this.getJml(ctx)
if(content)SKMETA.doPasteReplaceSel(content,ctx,this.schemaDom,batch)}getJml(ctx){if(typeof this.contentToImport==="string")return this.contentToImport
const jml=[]
if(ctx.ctn instanceof Element){if(ctx.sel){let offsetMin,offsetMax
SKMETA.ctxLastSkRule(ctx)
if(ctx.skRuleStack){offsetMin=offsetMax=ctx.sel.start[ctx.sel.start.length-1-ctx.virtualPath.length]
const pos=ctx.schemaDom.getPastePos(ctx.ctn,offsetMin,offsetMax,ctx.skRuleStack[0])
if(pos&EPastePos.replace||pos&EPastePos.before){for(const node of this.contentToImport){JML.domNode2jml(this.cleanupNode(ctx,node),jml,{mergeTextNodes:true})}}}else{if(ctx.virtualPath){offsetMin=ctx.sel.start[ctx.sel.start.length-2]
offsetMax=offsetMin}else{const startSeq=XA.range2StartSeq(ctx.sel)
offsetMin=XA.last(startSeq.start)
offsetMax=offsetMin+startSeq.len}for(const node of this.contentToImport){const pos=IS_comment(node)?EPastePos.anywhere:ctx.schemaDom.getPastePos(ctx.ctn,offsetMin,offsetMax,node)
if(pos&EPastePos.replace||pos&EPastePos.before){JML.domNode2jml(this.cleanupNode(ctx,node),jml,{mergeTextNodes:true})}}}return jml.length>0?jml:null}}for(const node of this.contentToImport)JML.domNode2jml(node,jml,{mergeTextNodes:true})
return jml}cleanupNode(ctx,node){return node}}export class SkImpCleanup extends SkImpSimple{cleanupNode(ctx,node){if(node.parentNode)node.parentNode.removeChild(node)
const rule=ctx.skRuleStack?ctx.skRuleStack[ctx.skRuleStack.length-1]:ctx.skNode.rule
return cleanupNodes(node,ctx,rule.contentRule.findRuleNodeFor(node),0,rule).node}}class SkImpWrapper extends SkImpBase{constructor(schemaDom,subImporter,malus=0){super(schemaDom)
this.subImporter=subImporter
this.malus=malus}get pastePos(){return this.subImporter.pastePos}get importPos(){return this.subImporter.importPos}getLabel(){return this.subImporter.getLabel()}get needAsyncBuild(){return this.subImporter.needAsyncBuild}buildContentToImport(uiContext){return this.subImporter.buildContentToImport(uiContext)}doImport(context,batch){return this.subImporter.doImport(context,batch)}}export class SkImpSplitUp extends SkImpWrapper{constructor(schemaDom,subImporter,splitDepth,malus=0){super(schemaDom,subImporter,malus)
this.splitDepth=splitDepth}doImport(context,batch){context=Object.create(context)
let splitDepth=this.splitDepth
if(context.virtualPath){const rem=Math.min(splitDepth,context.virtualPath.length)
context.sel={start:context.sel.start.slice(0,context.sel.start.length-rem)}
context.virtualPath=context.virtualPath.length===rem?null:context.virtualPath.slice(0,context.virtualPath.length-rem)
splitDepth-=rem}if(splitDepth>0){const splitPoint=XA.incrAtDepth(context.sel.start.slice(0,context.sel.start.length-splitDepth),-1,1)
if(XA.isCollapsed(context.sel)){const toMove=[]
this.schemaDom.exportRange({start:context.sel.start,end:splitPoint,deletes:batch},toMove)
batch.add((new XmlInsertMsg).init(splitPoint,toMove))}else if(XA.isBefore(context.sel.end,splitPoint)){const toMove=[]
this.schemaDom.exportRange({start:context.sel.end,end:splitPoint},toMove)
this.schemaDom.exportRange({start:context.sel.start,end:splitPoint,deletes:batch},null)
batch.add((new XmlInsertMsg).init(splitPoint,toMove))}else{this.schemaDom.exportRange({start:context.sel.start,end:context.sel.end,deletes:batch},null)}context.sel={start:splitPoint}}this.subImporter.doImport(context,batch)}}export class SkImpGoUp extends SkImpWrapper{constructor(schemaDom,subImporter,upDepth,insPos,malus=0){super(schemaDom,subImporter,malus)
this.upDepth=upDepth
this.insPos=insPos}doImport(context,batch){const ctx=Object.create(context)
let upDepth=this.upDepth
if(ctx.virtualPath){const rem=Math.min(upDepth,ctx.virtualPath.length)
ctx.sel={start:ctx.sel.start.slice(0,ctx.sel.start.length-rem)}
ctx.virtualPath=ctx.virtualPath.length===rem?null:ctx.virtualPath.slice(0,ctx.virtualPath.length-rem)
upDepth-=rem
ctx.skRuleStack=undefined}if(upDepth>0){let insPoint=ctx.sel.start.slice(0,ctx.sel.start.length-upDepth)
switch(this.insPos){case"replace":if(!XA.isCollapsed(context.sel))this.schemaDom.exportRange({start:insPoint,end:context.sel.end,deletes:batch},null)
break
case"after":if(!XA.isCollapsed(context.sel))this.schemaDom.exportRange({start:context.sel.start,end:context.sel.end,deletes:batch},null)
insPoint=XA.incrAtDepth(insPoint,-1,1)
break}ctx.sel={start:insPoint}}this.subImporter.doImport(ctx,batch)}}export var SKMETA;(function(SKMETA){function newImportCtxUp(ctx,filter){const newCtx=Object.create(ctx)
function goUp(deltaUp){if(ctx.virtualPath&&ctx.virtualPath[ctx.virtualPath.length-1]==="#")deltaUp++
if(ctx.sel){newCtx.sel={start:ctx.sel.start.slice(0,ctx.sel.start.length-deltaUp)}}else{newCtx.xaParent=ctx.xaParent.slice(0,ctx.xaParent.length-deltaUp)}if(ctx.virtualPath)newCtx.virtualPath=ctx.virtualPath.length>deltaUp?ctx.virtualPath.slice(0,ctx.virtualPath.length-deltaUp):null}if(ctx.skRuleStack){for(let i=ctx.skRuleStack.length-2;i>=0;i--){const skRule=ctx.skRuleStack[i]
if(!filter||filter(skRule)){newCtx.skRuleStack=ctx.skRuleStack.slice(0,i+1)
goUp(ctx.skRuleStack.length-i-1)
return newCtx}}newCtx.skRuleStack=null
if(!filter||filter(ctx.skNode.rule)){goUp(ctx.skRuleStack.length)
return newCtx}}let parent=ctx.skNode.node.parentNode
const originalDepth=newCtx.insertDepth
while(parent){newCtx.skNode=ctx.schemaDom.getSkNode(parent)
newCtx.insertDepth--
if(!filter||filter(newCtx.skNode.rule)){newCtx.ctn=newCtx.skNode.node
goUp(originalDepth-newCtx.insertDepth+(ctx.skRuleStack?ctx.skRuleStack.length:0))
return newCtx}parent=parent.parentNode}return null}SKMETA.newImportCtxUp=newImportCtxUp
function buildSkImportCtxInternal(context,schemaDom){const ctx=context
ctx.schemaDom=schemaDom
const sel=context.sel
if(sel){const xaStart=sel.start
if(XA.isCollapsed(sel)){ctx.insertDepth=xaStart.length-(ctx.virtualPath?ctx.virtualPath.length+1:1)}else{ctx.insertDepth=xaStart.length-1}ctx.ctn=XA.findDom(xaStart,schemaDom.nodeRoot,ctx.insertDepth)}else{const xaParent=context.xaParent
ctx.insertDepth=ctx.virtualPath?xaParent.length-ctx.virtualPath.length:xaParent.length
ctx.ctn=XA.findDom(xaParent,schemaDom.nodeRoot,ctx.insertDepth)}let skNode=ctx.schemaDom.getSkNode(ctx.ctn)
if(!skNode){if(ctx.ctn instanceof Text){skNode=ctx.schemaDom.getSkNode(ctx.ctn.parentNode)}else if(ctx.ctn instanceof Attr){skNode=ctx.schemaDom.getSkNode(ctx.ctn.ownerElement)
const attRule=skNode.rule.contentRule.findRuleAttrFor(ctx.ctn.nodeName)||skNode.rule.getUnknownAttRule(skNode,ctx.ctn.nodeName)
ctx.skRuleStack=[attRule]}else if(ctx.ctn instanceof Comment){skNode=ctx.schemaDom.getSkNode(ctx.ctn.parentNode)
ctx.skRuleStack=[skNode.rule.getUnknownNodeRule(skNode,ctx.ctn)]}if(!skNode)throw Error("SkNode not found for "+DOM.debug(ctx.ctn))}ctx.skNode=skNode
return ctx}SKMETA.buildSkImportCtxInternal=buildSkImportCtxInternal
function isAtBorder(node,start,offset,schemaDom){if(node.nodeType===ENodeType.element){const skNode=schemaDom.getSkNode(node)
if(skNode&&"isAtBorder"in skNode.rule.skMeta)return skNode.rule.skMeta.isAtBorder(skNode,start,offset,schemaDom)
if(start){if(offset>0)for(let n=node.childNodes.item(offset-1);n;n=n.previousSibling)if(!isEmpty(n,schemaDom))return false
return true}else{for(let n=node.childNodes.item(offset);n;n=n.nextSibling)if(!isEmpty(n,schemaDom))return false
return true}}else if(node.nodeType===ENodeType.text){return start?offset===0:offset===node.nodeValue.length}return false}SKMETA.isAtBorder=isAtBorder
function isEmpty(node,schemaDom){if(node.nodeType===ENodeType.text)return node.nodeValue.length===0
return false}SKMETA.isEmpty=isEmpty
function ctxInsertStartOffset(ctx){return ctx.sel.start[ctx.insertDepth]}SKMETA.ctxInsertStartOffset=ctxInsertStartOffset
function ctxInsertEndOffset(ctx){return ctx.sel.end?ctx.sel.end[ctx.insertDepth]:ctx.sel.start[ctx.insertDepth]}SKMETA.ctxInsertEndOffset=ctxInsertEndOffset
function ctxRealStartDepth(ctx){if(ctx.xaParent)return ctx.virtualPath?ctx.xaParent.length-ctx.virtualPath.length:ctx.xaParent.length
return ctx.virtualPath?ctx.sel.start.length-ctx.virtualPath.length-1:ctx.sel.start.length-1}SKMETA.ctxRealStartDepth=ctxRealStartDepth
function ctxContainerDepth(ctx){if(ctx.xaParent)return ctx.xaParent.length
return ctx.sel.start.length-1}SKMETA.ctxContainerDepth=ctxContainerDepth
function ctxLastSkRule(ctx){if(ctx.skRuleStack!==undefined)return ctx.skRuleStack?ctx.skRuleStack[ctx.skRuleStack.length-1]:ctx.skNode.rule
const skNode=ctx.skNode
ctx.skRuleStack=null
if(ctx.virtualPath){let rule=ctx.skNode.rule
for(let i=0;i<ctx.virtualPath.length;i++){const part=ctx.virtualPath[i]
if(typeof part==="object"){if(!ctx.skRuleStack)ctx.skRuleStack=[]
if(JML.jmlNode2nodeType(part)===ENodeType.element){rule=rule.contentRule.findRuleNodeFor(part)||rule.contentRule.getUnknownNodeRule(skNode,part)
ctx.skRuleStack.push(rule)}else{ctx.skRuleStack.push(skNode.rule.getUnknownNodeRule(skNode,part))}}else if(part==="@"){if(!ctx.skRuleStack)ctx.skRuleStack=[]
const xa=ctx.xaParent||ctx.sel.start
const idx=xa.length-(ctx.virtualPath.length-i)
let attName=xa[idx]
if(typeof attName!=="string")attName=xa[idx-1]
if(typeof attName!=="string")throw Error("Incoherent xa ("+xa+") and virtualPath ("+ctx.virtualPath+").")
ctx.skRuleStack.push(rule.contentRule.findRuleAttrFor(attName)||rule.contentRule.getUnknownAttRule(skNode,attName))}}if(ctx.sel&&XA.isAttribute(ctx.sel.start)){const attName=XA.last(ctx.xaParent||ctx.sel.start)
ctx.skRuleStack.push(rule.contentRule.findRuleAttrFor(attName)||rule.contentRule.getUnknownAttRule(skNode,attName))}}else if(XA.isAttribute(ctx.xaParent||ctx.sel.start)){const attName=XA.last(ctx.xaParent||ctx.sel.start)
const rule=skNode.rule
ctx.skRuleStack=[rule.contentRule.findRuleAttrFor(attName)||rule.contentRule.getUnknownAttRule(skNode,attName)]}return ctx.skRuleStack?ctx.skRuleStack[ctx.skRuleStack.length-1]:skNode.rule}SKMETA.ctxLastSkRule=ctxLastSkRule
function ctxFindSkRuleInAnc(ctx,filter){if(ctx.skRuleStack)for(let i=ctx.skRuleStack.length-1;i>=0;i--){if(filter(ctx.skRuleStack[i]))return ctx.skRuleStack[i]}if(filter(ctx.skNode.rule,ctx.skNode))return ctx.skNode.rule
for(let p=ctx.skNode.node.parentNode;p;p=p.parentNode){const skP=ctx.schemaDom.getSkNode(p)
if(skP&&filter(skP.rule,skP))return skP.rule}return null}SKMETA.ctxFindSkRuleInAnc=ctxFindSkRuleInAnc
function doPasteReplaceSel(content,ctx,schemaDom,batch){content=buildJmlFromVirtualPath(ctx.sel.start,ctx.virtualPath,content)
const simpleStr=typeof content==="string"?content:content.length===1&&typeof content[0]==="string"?content[0]:null
if(simpleStr){if(!XA.isCollapsed(ctx.sel))schemaDom.exportRange({start:ctx.sel.start,end:ctx.sel.end,deletes:batch},null)
const startOffset=SKMETA.ctxInsertStartOffset(ctx)
if(typeof startOffset==="string"){batch.add((new XmlStrMsg).init(XA.isAttribute(ctx.sel.start)?ctx.sel.start:XA.up(ctx.sel.start),simpleStr))}else if(ctx.ctn instanceof CharacterData||ctx.ctn instanceof Attr){batch.add((new XmlInsertMsg).init(ctx.sel.start,simpleStr))
batch.setSelAfterSeq(ctx.sel.start,simpleStr.length)}else{const xaInsert=ctx.sel.start.slice(0,ctx.insertDepth+1)
const beforeNode=ctx.ctn.childNodes.item(startOffset)
if(beforeNode instanceof Text){batch.add((new XmlInsertMsg).init(xaInsert,simpleStr))
batch.setSelAfterSeq(xaInsert,simpleStr.length)}else{const afterNode=ctx.ctn.childNodes.item(SKMETA.ctxInsertEndOffset(ctx))
if(afterNode instanceof Text){const start=XA.append(XA.incrAtDepth(xaInsert,-1,1),0)
batch.add((new XmlInsertMsg).init(start,simpleStr))
batch.setSelAfterSeq(start,simpleStr.length)}else{batch.add((new XmlInsertMsg).init(xaInsert,[simpleStr]))
batch.setSelAfterSeq(xaInsert,1)}}}}else{let startSelXa=ctx.sel.start
let endSelXa=ctx.sel.end||ctx.sel.start
if(!ctx.virtualPath){schemaDom.exportRange({start:startSelXa,end:ctx.sel.end,deletes:batch,forceSplitText:true},null)}let xaInsert=startSelXa.slice(0,ctx.insertDepth+1)
if(ctx.ctn instanceof Text){const first=content[0]
const last=content[content.length-1]
xaInsert=XA.freeze(XA.incrAtDepth(XA.up(xaInsert),-1,1))
let selAfterStartXa
if(typeof first==="string"){batch.add((new XmlInsertMsg).init(startSelXa,first))
content.splice(0,1)
selAfterStartXa=startSelXa}let selAfterEndXa
if(typeof last==="string"){let textAfterXa
if(XA.isInSameSeq(startSelXa,endSelXa)){textAfterXa=XA.last(endSelXa)<ctx.ctn.length?xaInsert:null}else if(startSelXa.length===endSelXa.length&&XA.findForkDepth(startSelXa,endSelXa)===startSelXa.length-2){textAfterXa=xaInsert}if(textAfterXa){batch.add((new XmlInsertMsg).init(XA.append(textAfterXa,0),last))
content.length=content.length-1
selAfterEndXa=XA.append(XA.incrAtDepth(textAfterXa,-1,JML.lengthJmlOrText(content)),last.length)}}batch.add((new XmlInsertMsg).init(xaInsert,content))
if(selAfterEndXa){batch.setSelAfter(selAfterStartXa||xaInsert,selAfterEndXa)}else if(selAfterStartXa){batch.setSelAfter(selAfterStartXa,XA.incrAtDepth(xaInsert,-1,JML.lengthJmlOrText(content)))}else{batch.setSelAfterSeq(xaInsert,JML.lengthJmlOrText(content))}}else{if(ctx.insertDepth<SKMETA.ctxRealStartDepth(ctx)){xaInsert=XA.incrAtDepth(xaInsert,-1,1)}batch.add((new XmlInsertMsg).init(xaInsert,content))
batch.setSelAfterSeq(xaInsert,JML.lengthJmlOrText(content))}}}SKMETA.doPasteReplaceSel=doPasteReplaceSel
function replaceLabelOnImports(imps,label){class SkImpLabelWrapper extends SkImpWrapper{constructor(subImporter,label){super(null,subImporter,subImporter.malus)
this.label=label}getLabel(){return this.label}}if(imps.length>1)return imps.map(s=>{const subLabel=s.getLabel()
return new SkImpLabelWrapper(s,subLabel?label+" + "+subLabel:label)})
return[new SkImpLabelWrapper(imps[0],label)]}SKMETA.replaceLabelOnImports=replaceLabelOnImports
function getAttsInFragment(content){if(content.nodeName===DOM.SCFRAGMENT_TAG&&content.namespaceURI===DOM.SCCORE_NS){return DOM.findFirstChild(content,ch=>ch.nodeName===SKMETA.SCATTRIBUTES_TAG&&ch.namespaceURI===DOM.SCCORE_NS)}else if(content.nodeName===SKMETA.SCATTRIBUTES_TAG&&content.namespaceURI===DOM.SCCORE_NS){return content}return null}SKMETA.getAttsInFragment=getAttsInFragment
SKMETA.SCATTRIBUTES_TAG="sc:attributes"})(SKMETA||(SKMETA={}))
function buildJmlFromVirtualPath(insertPoint,virtualPath,content){if(virtualPath){let i=virtualPath.length-1
if(XA.isAttribute(insertPoint)){if(Array.isArray(content))throw Error("Content can not be a node set.")
const prevPart=virtualPath[i--]
prevPart[XA.last(insertPoint)]=content
content=[prevPart]}for(;i>=0;i--){const part=virtualPath[i]
if(part==="#"){if(typeof content==="string")content=[content]}else if(part==="@"){if(Array.isArray(content))throw Error("Content can not be a node set.")
if(i===0)return content
const prevPart=virtualPath[--i]
if(XA.isAttribute(insertPoint)){prevPart[XA.last(insertPoint)]=content}else{prevPart[insertPoint[insertPoint.length-2]]=content}content=[prevPart]}else{content=[part,Array.isArray(content)?content:[content]]}}}return content}class SkMBounded extends SkMObject{get asGramList(){return"list"}initSkRule(skRule,confRule){skRule.cardMinError=parseInt(confRule.getAttributeNS(SK_NS,"cardMinError"))||0
skRule.cardMaxError=parseInt(confRule.getAttributeNS(SK_NS,"cardMaxError"))||Infinity
skRule.cardTagName=confRule.getAttributeNS(SK_NS,"cardTagName")}onExecRules(skCtx,rule,node){if(skCtx.execOptions.genAnnots||skCtx.execOptions.autoComplete){const min=rule.cardMinError
const max=rule.cardMaxError
let count=0
let lastCh
for(let ch=node.firstElementChild;ch;ch=ch.nextElementSibling){if(!rule.cardTagName||ch.nodeName===rule.cardTagName){count++
if(count>max&&skCtx.execOptions.genAnnots){skCtx.addAnnot((new SkAnnotEltFree).init(ch,`Un maximum de ${max} items est autorisé.`))}lastCh=ch}}if(count<min){if(skCtx.execOptions.autoComplete&&lastCh){const toInsert=[]
for(;count<min;count++){skCtx.skNode.schemaDom.getSkNode(lastCh).rule.createContent(toInsert)}skCtx.execOptions.corrections.push((new XmlInsertMsg).init(XA.incrAtDepth(XA.from(lastCh),-1,1),toInsert))}else if(min===1){skCtx.addAnnot((new SkAnnotEltFree).init(node,`Cet élément doit être complété.`))}else{skCtx.addAnnot((new SkAnnotEltFree).init(node,`Un minimum de ${min} items est requis.`))}}}}}SKMETALIB.registerMetaNode(new SkMBounded("BoundedList"))
class SkMBoundedEntry extends SkMObject{get asGramList(){return"entry"}computeGramBindingMalus(gram,rule,childrenMalus){if(gram.htmlTag!=="li")return 10*gram.weight+childrenMalus
return.1*childrenMalus}}SKMETALIB.registerMetaNode(new SkMBoundedEntry("BoundedListEntry"))

//# sourceMappingURL=schemaMeta.js.map