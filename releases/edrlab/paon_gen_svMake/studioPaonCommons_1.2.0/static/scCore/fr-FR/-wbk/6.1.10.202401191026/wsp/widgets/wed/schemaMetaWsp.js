import{DOM,ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{JML,JmlSubSetIterator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{XmlDeleteMsg,XmlInsertMsg,XmlStrMsg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{CARD,EPastePos,SchemaDom}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schema.js"
import{EAnnotLevel,SkAnnotStr,SkAnnotWrongValue}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaAnnots.js"
import{SK_NS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaBuilder.js"
import{EGramLevelType,SkImpBase,SkImpGoUp,SkImpSimple,SkMBase,SkMCompo,SKMETA,SkMetaLib,SKMETALIB,SkMField,SkMObject,SkMPart}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMeta.js"
import{SkMPara}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMetaTxt.js"
import{SkRuleNode}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaPatterns.js"
import{isShortDescsTransfer,ITEM,ShortDescsFromUrlList}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{EItemTypeFamily}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js"
import{SkMSpTeCompo,SkMSpTeCompoRoot,SkMSpTeSegment}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMetaSpTe.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{SkSearchNodeAnnot}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaSearch.js"
import{CONVERTERLIB}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/import/convert.js"
import{REMOTE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/remote.js"
var IS_element=DOM.IS_element
var ctxLastSkRule=SKMETA.ctxLastSkRule
export const SKMETALIB_WSP=new SkMetaLib(SKMETALIB)
class SkMCompoWsp extends SkMCompo{_pushLinksImporters(results,compoRule,pos,ctx,linksInfo,cache){if(!isShortDescsTransfer(linksInfo))return
const modelName=getModelName(compoRule)
const offset=linksInfo.shortDescs.findIndex(s=>(s===null||s===void 0?void 0:s.itModel)===modelName)
if(offset>=0)results.push(new SkImpInternalize(ctx,linksInfo,offset,pos))}}SKMETALIB_WSP.registerMetaNode(new SkMCompoWsp("Compo"))
class SkMSpTeCompoRootWsp extends SkMSpTeCompoRoot{}LANG.completeClassProps(SkMCompoWsp,SkMSpTeCompoRootWsp)
SKMETALIB_WSP.registerMetaNode(new SkMSpTeCompoRootWsp("SpTeCompoRoot"))
class SkMSpTeCompoWsp extends SkMSpTeCompo{}LANG.completeClassProps(SkMCompoWsp,SkMSpTeCompoWsp)
SKMETALIB_WSP.registerMetaNode(new SkMSpTeCompoWsp("SpTeCompo"))
class SkMPtrItem extends SkMBase{static buildAnnot(attr,rule){const map=attr.ownerDocument.srcRefMap
if(map){const srcRefSub=attr.nodeValue
const subId=ITEM.extractSubItemId(srcRefSub)
const srcRef=subId?ITEM.extractSrcRef(srcRefSub,subId):srcRefSub
const shortDesc=map.get(srcRef)
if(shortDesc===undefined){return(new SkAnnotFutureLink).init(attr,rule)}else if(shortDesc===null){return(new SkAnnotWrongValue).init(attr,"Item manquant")}else if(shortDesc instanceof Promise){return(new SkAnnotFutureLink).init(attr,rule,shortDesc)}else if(subId){const subItem=ITEM.findSubItem(subId,shortDesc.itSubItems)
if(subItem===undefined){return(new SkAnnotWrongValue).init(attr,"Le fragment référencé dans cet item n\'existe pas")}else if(!rule.subItSgnPattern){return(new SkAnnotWrongValue).init(attr,"Référencer un fragment n\'est pas autorisé ici")}else if(!subSgnMatch(subItem,rule.subItSgnPattern)){return(new SkAnnotWrongValue).init(attr,"Ce type de fragment d\'item n\'est pas autorisé ici")}}else if(!sgnMatch(shortDesc,rule.itSgnPattern)){return(new SkAnnotWrongValue).init(attr,"Type d\'item non autorisé")}else if(!sgnMatch(shortDesc,rule.subItSgnPattern)){return(new SkAnnotWrongValue).init(attr,"Cet item ne correspond pas au type de fragment autorisé ici")}}return null}get gramLevelType(){return EGramLevelType.undef}initSkRule(skRule,confRule){const sgnPattern=confRule.getAttributeNS(SK_NS,"sgn")
if(sgnPattern)skRule.itSgnPattern=new RegExp(sgnPattern)
const subPattern=confRule.getAttributeNS(SK_NS,"subPattern")
if(subPattern)skRule.subItSgnPattern=new RegExp(subPattern)}async tryPasteNodes(ctx,content,cache){if(content.localName==="fragment"&&content.namespaceURI===DOM.SCCORE_NS){const elt=DOM.findFirstChild(content,DOM.IS_element)
const refUri=elt.getAttributeNS(DOM.SCCORE_NS,"refUri")
if(refUri){const wsp=ctx.schemaDom.document.wsp
if(wsp){const sd=await wsp.fetchShortDesc(refUri)
const linksInfo={sdTrsfId:"x",wsp:wsp,shortDescs:[sd]}
return this.tryPasteLinks(ctx,linksInfo,cache)}}}return null}tryPasteText(ctx,text,cache){return ctx.preserveUnknown?super.tryPasteText(ctx,text,cache):null}async tryPasteLinks(ctx,linksInfo,cache){var _a
if(isShortDescsTransfer(linksInfo)){const rule=SKMETA.ctxLastSkRule(ctx)
if(linksInfo.isImportUrls)return((_a=rule.itSgnPattern)===null||_a===void 0?void 0:_a.source.indexOf("RemoteBinary"))<0?[]:[new SkImpSrcUri(ctx,rule,linksInfo,0)]
if(linksInfo.isImport)return[new SkImpSrcUri(ctx,rule,linksInfo,0)]
const offset=linksInfo.shortDescs.findIndex(shortDesc=>shortDesc&&(ctx.preserveUnknown||sgnMatch(shortDesc,rule.itSgnPattern)&&subSgnMatch(shortDesc.itSubItem||shortDesc,rule.subItSgnPattern)))
return offset>=0?[new SkImpSrcUri(ctx,rule,linksInfo,offset)]:[]}return null}async tryImportLinks(ctx,linksInfo,cache){return this.tryPasteLinks(ctx,linksInfo,cache)}onExecRules(skCtx,rule,attr){if(skCtx.execOptions.genAnnots){if(attr.nodeValue){const annot=SkMPtrItem.buildAnnot(attr,rule)
if(annot)skCtx.addAnnot(annot)}}}}SKMETALIB_WSP.registerMetaNode(new SkMPtrItem("PtrItem"))
class SkMPartWsp extends SkMPart{tryImportLinks(ctx,linksInfo,cache){return null}_pushLinksImporters(results,partRule,pos,ctx,linksInfo,cache){if(!isShortDescsTransfer(linksInfo))return
const ptrItemRule=findPtrItemRule(partRule)
const subModels=findSubModelRules(partRule)
const asLink=ptrItemRule&&(ctx.preserveUnknown||linksInfo.shortDescs.findIndex(shortDesc=>shortDesc&&sgnMatch(shortDesc,ptrItemRule.itSgnPattern))>=0)
const asSubModel=subModels&&subModels.findIndex(v=>{const model=getModelName(v)
return linksInfo.shortDescs.findIndex(shortDesc=>shortDesc&&shortDesc.itModel===model)>=0})>=0
if(asLink)results.push(new SkImpTagLink(ctx,linksInfo,partRule,pos,asSubModel))
if(asSubModel)results.push(new SkImpPartInternalizeLink(ctx,linksInfo,partRule,pos,asLink))}setInternalizedContent(partNode,content,batch){SkMPartWsp.clearLink(partNode,batch)
SkMPartWsp.clearInternalizedContent(partNode,batch)
if(content)batch.add((new XmlInsertMsg).init(XA.append(XA.fromNode(partNode.node),this.getOffsetAfterMeta(partNode)),content))}async internalizeLink(partNode,shortDesc,wsp,uiContext,batch){this.setInternalizedContent(partNode,await getContentForInternalize(shortDesc,wsp,uiContext),batch)
return batch}overwriteAlternates(skAnc,parent,toReplace,offset,nodeType,nodeName,res){if(skAnc.rule!==parent)return res
const ptrItemRule=findPtrItemRule(parent)
const subModels=findSubModelRules(parent)
if(!ptrItemRule||!subModels||subModels.length===0)return res
const doc=skAnc.node.ownerDocument
if(toReplace===ptrItemRule){if(res.length===1){res[0]=new SwitchInternalizedContent(res[0])}const refUri=skAnc.node.getAttribute(ptrItemRule.matcher.startName)
if(!refUri)return res
const shortDesc=doc.srcRefMap.get(refUri)
if(!shortDesc||shortDesc instanceof Promise)return res
const itemType=doc.wsp.wspMetaUi.getItemTypes().find(it=>it.getSgn()===shortDesc.itSgn)
if(!itemType||itemType.getFamily()!==EItemTypeFamily.xml)return res
const tagRoot=itemType.getTagRoot()
const targetRule=subModels.find(v=>v.matcher.matchNode(ENodeType.element,tagRoot))
if(!targetRule)return res
res.push(new InternalizeItem(skAnc,ptrItemRule,targetRule))}else if(doc.wsp.reg.getSvc("wedExternalizeItem")){const comppo=skAnc.node.lastElementChild
if(!comppo)return res
const skCompo=skAnc.schemaDom.getSkNode(comppo)
if(!skCompo||skCompo.rule!==toReplace)return res
const itemType=doc.wsp.wspMetaUi.getItemTypes().find(it=>it.getTagRoot()===comppo.nodeName)
if(!itemType)return res
res.push(new ExternalizeItem(skAnc,toReplace,ptrItemRule,itemType))}return res}static clearLink(partNode,batch){const ptrItemRule=findPtrItemRule(partNode.rule)
if(ptrItemRule&&partNode.node.hasAttribute(ptrItemRule.matcher.startName))batch.add((new XmlStrMsg).init(XA.append(XA.fromNode(partNode.node),ptrItemRule.matcher.startName),null))}static clearInternalizedContent(partNode,batch){let ch=partNode.node.lastElementChild
while(ch){const chSk=partNode.schemaDom.getSkNode(ch)
if(chSk&&chSk.rule.skMeta instanceof SkMCompo)batch.add((new XmlDeleteMsg).init(XA.fromNode(ch),1))
ch=ch.previousElementSibling}}static setLink(partNode,srcRef,batch){SkMPartWsp.clearInternalizedContent(partNode,batch)
batch.add((new XmlStrMsg).init(XA.append(XA.fromNode(partNode.node),partNode.rule.ptrItem.matcher.startName),srcRef))}}SKMETALIB_WSP.registerMetaNode(new SkMPartWsp("Part"))
export class SkMFieldUrl extends SkMField{initSkRule(skRule,confRule){super.initSkRule(skRule,confRule)
skRule.urlHolderRules=[skRule]}tryImportLinks(ctx,linksInfo,cache){return null}_pushLinksImporters(results,skRule,pos,ctx,linksInfo,cache){if(linksInfo instanceof ShortDescsFromUrlList){results.push(new SkImpUrl(ctx,skRule,linksInfo,pos))}}}SKMETALIB_WSP.registerMetaNode(new SkMFieldUrl("FieldUrl"))
class SkMRemote extends SkMObject{initSkRule(skRule,confRule){super.initSkRule(skRule,confRule)
Object.defineProperty(skRule,"urlHolderRules",{get(){const locationRule=this.contentRule.findRule(r=>r.urlHolderRules!=null)
const value=locationRule?[this,...locationRule.urlHolderRules]:null
Object.defineProperty(this,"urlHolderRules",{value:value})
return value},configurable:true})}}SKMETALIB_WSP.registerMetaNode(new SkMRemote("Remote"))
class SkImpUrl extends SkImpSimple{constructor(ctx,skRule,infoLinks,pos){super(ctx,"",0,pos)
this.skRule=skRule
this.infoLinks=infoLinks}getLabel(){return this.skRule.structLabel}async completeDatasAtDrop(data){if(await this.infoLinks.extractDatasNow(data)==="stop")return"stop"
const url=await REMOTE.aliasUrl(this.infoLinks.shortDescs[0].url.trim(),this.schemaDom.document.wsp.reg)
const elt=this.skRule.createNode(DOM.sharedXmlDoc())
elt.textContent=url
this.contentToImport=[elt]}}class SkImpDeepUrl extends SkImpBase{constructor(ctx,skRules,infoLinks,pos,wrapSel){super(ctx.schemaDom,pos)
this.skRules=skRules
this.infoLinks=infoLinks
this.wrapSel=wrapSel
this.malus=0}getLabel(){return this.skRules[0].structLabel}async completeDatasAtDrop(data){if(await this.infoLinks.extractDatasNow(data)==="stop")return"stop"
this.urls=this.infoLinks.shortDescs.map(sd=>sd.url.trim())}doImport(context,batch){let ctx=SKMETA.buildSkImportCtxInternal(context,this.schemaDom)
let jml=[]
const multiPaste=this.urls.length>1&&CARD.isRepeatable((ctxLastSkRule(ctx)||ctx.skNode.rule).contentRule.getRealCardSubNode(ENodeType.element,this.skRules[0].matcher.startName))
const start=context.sel.start
const end=context.sel.end
let urlDone=0
let sk
batch.setSelBefore(start,end)
if(end&&ctx.ctn instanceof Element&&XA.isInSameSeq(start,end)&&XA.last(end)-XA.last(start)===1&&(sk=this.schemaDom.getSkNode(ctx.ctn.childNodes[XA.last(start)])).rule===this.skRules[0]){for(let offset=1;offset<this.skRules.length;offset++){const importPos=this.schemaDom.getImportPos(sk.node,this.skRules[offset])
if(importPos.replaceChildren){sk=this.schemaDom.getSkNode(sk.node.childNodes[importPos.replaceChildren[0]])}else{const doc=DOM.sharedXmlDoc()
let firstNode=doc.createTextNode(this.urls[0])
for(let depth=this.skRules.length-1;depth>=offset;depth--){let newCt=this.skRules[depth].createNode(doc)
newCt.appendChild(firstNode)
firstNode=newCt}batch.add((new XmlInsertMsg).init(XA.append(XA.fromNode(sk.node),importPos.insertOffsetMax),JML.dom2jml(firstNode)))
sk=null
break}}if(sk!=null){const textNode=DOM.findFirstChild(sk.node,DOM.IS_text)
if(textNode){batch.add((new XmlStrMsg).init(XA.fromNode(textNode),this.urls[0]))}else{batch.add((new XmlInsertMsg).init(XA.append(XA.fromNode(sk.node),0),[this.urls[0]]))}}if(multiPaste){ctx=SKMETA.buildSkImportCtxInternal({sel:{start:ctx.sel.end}},ctx.schemaDom)}else{batch.setSelAfterSeq(start,1)
return}urlDone++}const doc=DOM.sharedXmlDoc()
const urlText=doc.createTextNode(this.urls[urlDone])
let tag=urlText
for(let depth=this.skRules.length-1;depth>=0;depth--){let newCt=this.skRules[depth].createNode(doc)
newCt.appendChild(tag)
tag=newCt}if(urlDone===0){if(this.wrapSel&&!XA.isCollapsed(ctx.sel)){const firstTag=multiPaste?tag.cloneNode(true):tag
ctx.schemaDom.exportRange({start:ctx.sel.start,end:ctx.sel.end},firstTag)
new SchemaDom(ctx.schemaDom.schema,this.skRules[0],firstTag).correctDocument({autoMutate:true,autoComplete:true,autoCleanup:true,autoNormXml:true,autoNormChars:true})
jml=JML.dom2jml(firstTag)}else{this.addJmlTag(jml,this.urls[urlDone],urlText,tag)}urlDone++}if(multiPaste)while(urlDone<this.urls.length){this.addJmlTag(jml,this.urls[urlDone++],urlText,tag)}if(jml.length>0)SKMETA.doPasteReplaceSel(jml,ctx,ctx.schemaDom,batch)}addJmlTag(jml,url,urlText,tag){urlText.nodeValue=url
const txt=this.wrapSel?tag.appendChild(tag.ownerDocument.createTextNode(url)):null
JML.dom2jml(tag,jml)
txt===null||txt===void 0?void 0:txt.remove()}}class SkMSpTeSegmentWsp extends SkMSpTeSegment{}LANG.completeClassProps(SkMPartWsp,SkMSpTeSegmentWsp)
SKMETALIB_WSP.registerMetaNode(new SkMSpTeSegmentWsp("SpTeSegment"))
class SwitchInternalizedContent{constructor(subStructDef){this.subStructDef=subStructDef}get structType(){return this.subStructDef.structType}get structName(){return this.subStructDef.structName}get structLabel(){return"Contenu internalisé vierge"}structMatch(nodeType,nodeName){return this.subStructDef.structMatch(nodeType,nodeName)}createContent(childrenToAppend,attsToAppend){return this.subStructDef.createContent(childrenToAppend,attsToAppend)}}class InternalizeItem{constructor(skParent,fromRule,targetRule){this.skParent=skParent
this.fromRule=fromRule
this.targetRule=targetRule}get structType(){return this.targetRule.structType}get structName(){return this.targetRule.structName}get structLabel(){return"Internaliser cet item"}async createContentAsync(childrenToAppend,attsToAppend,uiContext){const refUri=this.skParent.node.getAttribute(this.fromRule.matcher.startName)
childrenToAppend.push(...await getContentItemForInternalize(refUri,this.skParent.node.ownerDocument.wsp,uiContext))}createContent(childrenToAppend,attsToAppend){throw Error("Use createContentAsync()")}structMatch(nodeType,nodeName){return this.targetRule.structMatch(nodeType,nodeName)}}class ExternalizeItem extends InternalizeItem{constructor(skParent,fromRule,targetRule,itemType){super(skParent,fromRule,targetRule)
this.itemType=itemType}get structLabel(){return"Externaliser ce contenu..."}async createContentAsync(childrenToAppend,attsToAppend,uiCtx){const wsp=this.skParent.node.ownerDocument.wsp
const content=this.skParent.node.lastElementChild
if(!content)return false
const svc=wsp.reg.getSvc("wedExternalizeItem")
const shortDesc=await svc(wsp.reg,content,(acc,cur)=>{if(cur===this.itemType)acc.push(cur)
return acc},uiCtx)
if(shortDesc){attsToAppend[this.targetRule.matcher.startName]=SRC.srcRef(shortDesc)
return}return false}}async function tryPasteLinksInPara(ctx,linksInfo,cache){if(!isShortDescsTransfer(linksInfo))return
const lastRule=SKMETA.ctxLastSkRule(ctx)
const inlineRules=lastRule.contentRule.findRules(rule=>{if(rule.skMeta&&rule instanceof SkRuleNode){const ptrRule=findPtrItemRule(rule)
return ptrRule&&(ctx.preserveUnknown||linksInfo.shortDescs.find(s=>sgnMatchRule(s,ptrRule))!=null)}return false},[])
let paraParentSk
let deltaDepth=ctx.virtualPath&&ctx.virtualPath[ctx.virtualPath.length-1]==="#"?1:0
const paraParentRule=SKMETA.ctxFindSkRuleInAnc(ctx,(r,n)=>{if(r.skMeta.isParaParent){paraParentSk=n
return true}deltaDepth++
return false})
const paraRules=paraParentRule?paraParentRule.contentRule.findRules(rule=>{if(rule.skMeta&&rule instanceof SkRuleNode){const ptrRule=findPtrItemRule(rule)
return ptrRule&&(ctx.preserveUnknown||linksInfo.shortDescs.find(s=>sgnMatchRule(s,ptrRule))!=null)}return false},[]):[]
if(inlineRules.length===0&&paraRules.length===0)return[]
const imports=inlineRules.map(r=>new SkImpTxtLink(ctx,linksInfo,r,EPastePos.replace,r.skMeta.id==="InlLink"))
if(paraRules.length>0){let paraImports
if(paraParentSk){paraImports=paraRules.map(r=>new SkImpTxtLink(ctx,linksInfo,r,EPastePos.replace))
SkMPara.wrapImportForParaSiblings(paraImports,paraParentSk.node,ctx)}else{paraImports=paraRules.map(r=>new SkImpGoUp(ctx.schemaDom,new SkImpTxtLink(ctx,linksInfo,r,EPastePos.replace),deltaDepth,"before"))}imports.push(...paraImports)}return imports}async function tryPasteLinksInParaParent(ctx,linksInfo,cache){const paraRules=ctx.skNode.rule.contentRule.findRules(rule=>rule.skMeta&&rule instanceof SkRuleNode&&isRuleMatchLinks(ctx,findPtrItemRule(rule),linksInfo),[])
return paraRules.map(r=>new SkImpTxtLink(ctx,linksInfo,r,EPastePos.replace))}function _pushLinksImporters(results,tagRule,pos,ctx,linksInfo,cache){if(!isShortDescsTransfer(linksInfo))return
if(isRuleMatchLinks(ctx,findPtrItemRule(tagRule),linksInfo)){results.push(new SkImpTxtLink(ctx,linksInfo,tagRule,pos,this.id==="InlLink"))}}function _pushLinksImportersInMetas(results,tagRule,pos,ctx,linksInfo,cache){var _a,_b
if(!isShortDescsTransfer(linksInfo)||!linksInfo.isImportUrls)return
if(tagRule.urlHolderRules===undefined){tagRule.urlHolderRules=null
if(tagRule.skMeta instanceof SkMObject){const metaRule=tagRule.skMeta.getMetaRule(tagRule)
if(metaRule)for(let fieldRule of metaRule.contentRule.findRules(r=>r.skMeta instanceof SkMField)){if(fieldRule.urlHolderRules!=null){tagRule.urlHolderRules=[tagRule,metaRule,...fieldRule.urlHolderRules]
break}else{const urlHolderRules=(_b=(_a=fieldRule)===null||_a===void 0?void 0:_a.contentRule.findRule(r=>r.urlHolderRules!=null))===null||_b===void 0?void 0:_b.urlHolderRules
if(urlHolderRules){tagRule.urlHolderRules=[tagRule,metaRule,fieldRule,...urlHolderRules]
break}}}}}if(tagRule.urlHolderRules){results.push(new SkImpDeepUrl(ctx,tagRule.urlHolderRules,linksInfo,pos,this.id==="InlPhrase"||this.id==="InlTextLeaf"))}}function isRuleMatchLinks(ctx,ptrRule,linksInfo){if(ctx.preserveUnknown)return true
if(!ptrRule)return false
if(linksInfo.rejectSgnMatch){return!linksInfo.rejectSgnMatch(ptrRule.itSgnPattern)}else{return linksInfo.shortDescs.find(s=>sgnMatchRule(s,ptrRule))!=null}}function overrideLinks(id,tryPasteLinks,_pushLinksImporters){const skm=SKMETALIB.getMetaNode(id)
const skmWsp=new skm.constructor(id)
if(tryPasteLinks)skmWsp.tryPasteLinks=tryPasteLinks
if(_pushLinksImporters){skmWsp.tryImportLinks=function(){return null}
skmWsp._pushLinksImporters=_pushLinksImporters}return skmWsp}SKMETALIB_WSP.registerMetaNode(overrideLinks("Para",tryPasteLinksInPara))
SKMETALIB_WSP.registerMetaNode(overrideLinks("InlPhrase",tryPasteLinksInPara,_pushLinksImportersInMetas))
SKMETALIB_WSP.registerMetaNode(overrideLinks("InlLink",tryPasteLinksInPara,_pushLinksImporters))
SKMETALIB_WSP.registerMetaNode(overrideLinks("InlStyle",tryPasteLinksInPara))
SKMETALIB_WSP.registerMetaNode(overrideLinks("InlTextLeaf",tryPasteLinksInPara,_pushLinksImportersInMetas))
SKMETALIB_WSP.registerMetaNode(overrideLinks("InlObject",null,_pushLinksImporters))
SKMETALIB_WSP.registerMetaNode(overrideLinks("InlImg",null,_pushLinksImporters))
SKMETALIB_WSP.registerMetaNode(overrideLinks("InlEmpty",null,_pushLinksImportersInMetas))
SKMETALIB_WSP.registerMetaNode(overrideLinks("Text",tryPasteLinksInParaParent))
SKMETALIB_WSP.registerMetaNode(overrideLinks("LI",tryPasteLinksInParaParent))
SKMETALIB_WSP.registerMetaNode(overrideLinks("TxtCell",tryPasteLinksInParaParent))
SKMETALIB_WSP.registerMetaNode(overrideLinks("TxtObject",null,_pushLinksImporters))
SKMETALIB_WSP.registerMetaNode(overrideLinks("TxtEmpty",null,_pushLinksImportersInMetas))
class SkAnnotFutureLink extends SkAnnotStr{get type(){return SkAnnotFutureLink.TYPE}get level(){return this.result?this.result.level:EAnnotLevel.info}init(attr,rule,pending){this.anchorNode=attr
const wsp=attr.ownerDocument.wsp
this.srcRefSub=attr.nodeValue
const srcRef=ITEM.extractSrcRef(this.srcRefSub)
if(pending){this.future=pending.then(shortDesc=>{this.future=null
this.result=SkMPtrItem.buildAnnot(attr,rule)
return this.result})}else{const fetch=wsp.fetchShortDescSubItems(srcRef)
attr.ownerDocument.srcRefMap.set(srcRef,fetch)
this.future=fetch.then(shortDesc=>{attr.ownerDocument.srcRefMap.set(srcRef,shortDesc.srcSt>0?shortDesc:null)
this.future=null
this.result=SkMPtrItem.buildAnnot(attr,rule)
return this.result})}return this}getLabel(){return this.result?this.result.getLabel():this.result===undefined?"Validation du lien en cours...":""}equals(other){return this.anchorNode===other.anchorNode&&this.type===other.type&&this.srcRefSub===other.srcRefSub}toJSON(){return this.result?this.result.toJSON():{type:this.type,anchor:this.start}}}SkAnnotFutureLink.TYPE="wspLinkFuture"
function getModelName(compoRule){if("modelName"in compoRule)return compoRule.modelName
return compoRule.modelName=compoRule.matcher.startName.replace(":","_")}function findPtrItemRule(linkerRule){if("ptrItem"in linkerRule)return linkerRule.ptrItem
return linkerRule.ptrItem=linkerRule.contentRule.findRule(r=>r.skMeta instanceof SkMPtrItem)}function findSubModelRules(partRule){if("subModels"in partRule)return partRule.subModels
return partRule.subModels=partRule.contentRule.findRules(r=>r.skMeta&&r.skMeta instanceof SkMCompo)}function sgnMatch(shortDesc,pattern){if(pattern==null)return true
return pattern.test(shortDesc.itSgn||"")}function subSgnMatch(subItem,pattern){const mo=subItem.mo||subItem.itSgn
if(pattern==null||mo==null)return true
return pattern.test(mo)}function sgnMatchRule(shortDesc,rule){if(!sgnMatch(shortDesc,rule.itSgnPattern))return false
if(rule.subItSgnPattern){return subSgnMatch(shortDesc.itSubItem||shortDesc,rule.subItSgnPattern)}else return shortDesc.itSubItem?false:true}function getOwnerEltCard(ctx){if(ctx.skRuleStack.length===1){const ownerElt=ctx.ctn instanceof Attr?ctx.ctn.ownerElement:ctx.ctn
return ctx.schemaDom.getSkNode(ownerElt.parentElement).rule.contentRule.getRealCardSubNode(ENodeType.element,ownerElt.nodeName)}else if(ctx.skRuleStack.length===2){const ownerRule=ctx.skRuleStack[0]
if(ownerRule.matcher.isFuzzy())return ownerRule.card
const parentElt=ctx.ctn
return ctx.schemaDom.getSkNode(parentElt).rule.contentRule.getRealCardSubNode(ENodeType.element,ownerRule.matcher.startName)}else{const ownerRule=ctx.skRuleStack[ctx.skRuleStack.length-2]
if(ownerRule.matcher.isFuzzy())return ownerRule.card
const parentRule=ctx.skRuleStack[ctx.skRuleStack.length-3]
return parentRule.contentRule.getRealCardSubNode(ENodeType.element,ownerRule.matcher.startName)}}async function getContentForInternalize(shortDesc,wsp,uiContext){if(shortDesc.createSrc)return null
return getContentItemForInternalize(SRC.srcRef(shortDesc),wsp,uiContext)}async function getContentItemForInternalize(srcRef,wsp,uiContext){const house=wsp.wspServer.wspsLive.getHouseIfFetched(WSP.buildWspRef(wsp.code,srcRef))
const dom=house?house.document:await ITEM.fetchDom(wsp,uiContext,srcRef)
return JML.dom2jml(dom.documentElement.lastElementChild)}const SKMETA_PTRITEM=["Part","Field","InlObject","InlImg","InlLink","TxtObject","*"]
export function revalidLink(house,srcRef,newShortDesc){if(!house.schemaDom.schema.wspPtrItemsMarked){house.schemaDom.schema.wspPtrItemsMarked=true
const done=new Set
function scanRule(r){if(!r||done.has(r))return false
done.add(r)
if(r.skMeta&&SKMETA_PTRITEM.indexOf(r.skMeta.id)>=0)findPtrItemRule(r)
if("contentRule"in r)scanRule(r.contentRule.findRule(scanRule))
return false}scanRule(house.schemaDom.schema.startRule.findRule(scanRule))}house.document.srcRefMap.set(srcRef,newShortDesc)
const schema=house.schemaDom
const tw=house.document.createTreeWalker(house.document,NodeFilter.SHOW_ELEMENT)
let elt
let revalid
while(elt=tw.nextNode()){const rule=schema.getSkNode(elt).rule
if(rule.ptrItem){const lnkSrcRef=elt.getAttribute(rule.ptrItem.matcher.startName)
if(ITEM.isSameSrcRef(srcRef,lnkSrcRef)){if(!revalid)revalid=new Set
revalid.add(elt)}}}if(revalid){house.revalid(revalid)}else{house.document.srcRefMap.delete(srcRef)}}class SkImpSrcUri extends SkImpSimple{constructor(ctx,ptrItemRule,infoLinks,firstLink){super(ctx,infoLinks.isImport?"":ITEM.srcRefSub(infoLinks.shortDescs[firstLink]))
this.ctx=ctx
this.ptrItemRule=ptrItemRule
this.infoLinks=infoLinks
this.firstLink=firstLink
this.isRepeatable=CARD.isRepeatable(getOwnerEltCard(ctx))}async completeDatasAtDrop(data){if(this.infoLinks.extractDatasNow)return this.infoLinks.extractDatasNow(data)}get needAsyncBuild(){return this.infoLinks.isImport}async buildContentToImport(uiCtx){const sgnPattern=this.ptrItemRule.itSgnPattern
const subItSgnPattern=this.ptrItemRule.subItSgnPattern
const repeatable=this.isRepeatable&&this.infoLinks.shortDescs.length>this.firstLink+1
const createOpts={targetSrcType:"item",sgnPattern:sgnPattern,subItSgnPattern:subItSgnPattern,defaultUriParent:SRC.extractUriParent(this.ctx.schemaDom.house.srcFields.srcUri),refExtItemAcceptable:true,repeatedImports:repeatable?{}:undefined}
let lnk=this.infoLinks.shortDescs[this.firstLink]
if(lnk.createSrc){lnk=await lnk.createSrc(createOpts)
if(!lnk)return"stop"}this.contentToImport=ITEM.srcRefSub(lnk)
if(repeatable){this.nextLinks=[]
const nexts=this.infoLinks.shortDescs
for(let i=this.firstLink+1;i<nexts.length;i++){let lnk=nexts[i]
if(!lnk||!(this.ctx.preserveUnknown||sgnMatch(lnk,sgnPattern)&&subSgnMatch(lnk.itSubItem||lnk,subItSgnPattern)))continue
if(lnk.createSrc)lnk=await lnk.createSrc(createOpts)
if(lnk)this.nextLinks.push(lnk)}}}doImport(context,batch){super.doImport(context,batch)
if(this.isRepeatable){if(!this.nextLinks){this.nextLinks=[]
const nexts=this.infoLinks.shortDescs
for(let i=this.firstLink+1;i<nexts.length;i++){const lnk=nexts[i]
if(!lnk||!(this.ctx.preserveUnknown||sgnMatch(lnk,this.ptrItemRule.itSgnPattern)&&subSgnMatch(lnk.itSubItem||lnk,this.ptrItemRule.subItSgnPattern)))continue
if(lnk)this.nextLinks.push(lnk)}}const ctx=context
const jmlLinks=[]
const attName=SKMETA.ctxLastSkRule(ctx).matcher.startName
for(const scrField of this.nextLinks){const linkIdx=jmlLinks.length
if(ctx.skRuleStack.length===1){JML.domNode2jml(ctx.ctn instanceof Attr?ctx.ctn.ownerElement:ctx.ctn,jmlLinks)}else{ctx.skRuleStack[ctx.skRuleStack.length-2].createContent(jmlLinks)}jmlLinks[linkIdx][attName]=ITEM.srcRefSub(scrField)}batch.add((new XmlInsertMsg).init(XA.newBd(ctx.sel.start).up().incrAtDepth(-1,1).xa,jmlLinks))
batch.setSelAfterSeq(XA.newBd(ctx.sel.start).up().xa,JML.lengthJmlOrText(jmlLinks)+1)}}}class SkImpTagLink extends SkImpBase{constructor(ctx,linksInfos,linkerRule,pos,appendLabel){super(ctx.schemaDom,pos)
this.ctx=ctx
this.linksInfos=linksInfos
this.linkerRule=linkerRule
this.appendLabel=appendLabel
this.preserveUnknown=ctx.preserveUnknown
this.partRule=ctx.skNode.rule
this.malus=0}getLabel(){return this.appendLabel?this.linkerRule.structLabel+" (Lien)":this.linkerRule.structLabel}async completeDatasAtDrop(data){if(this.linksInfos.extractDatasNow){if(await this.linksInfos.extractDatasNow(data)==="stop")return"stop"
if(!this.preserveUnknown){const sgnPattern=this.linkerRule.ptrItem.itSgnPattern
if(sgnPattern&&this.linksInfos.rejectSgnMatch&&this.linksInfos.rejectSgnMatch(sgnPattern))return"stop"}}}get needAsyncBuild(){return this.linksInfos.isImport}async buildContentToImport(uiContext){var _a
const sgnPattern=this.linkerRule.ptrItem.itSgnPattern
const subItSgnPattern=this.linkerRule.ptrItem.subItSgnPattern
const filter=s=>s&&(this.preserveUnknown||s.itSgn==null||sgnMatch(s,sgnPattern)&&subSgnMatch(s.itSubItem||s,subItSgnPattern))
const links=this.linksInfos.shortDescs.filter(filter)
const defaultUriParent=ITEM.extractSpaceUri((_a=this.ctx.schemaDom.house.srcFields)===null||_a===void 0?void 0:_a.srcUri)
const createOpts={targetSrcType:"item",defaultUriParent:defaultUriParent,sgnPattern:sgnPattern,subItSgnPattern:subItSgnPattern,refExtItemAcceptable:true,repeatedImports:links.length>1?{}:undefined}
for(let i=0;i<links.length;i++){const lnk=links[i]
if(lnk.createSrc)links[i]=await lnk.createSrc(createOpts)}this._links=links.filter(filter)
if(this._links.length===0)return"stop"}doImport(context,batch,options){let ctx=SKMETA.buildSkImportCtxInternal(context,this.schemaDom)
if(!this._links){const sgnPattern=this.linkerRule.ptrItem.itSgnPattern
this._links=this.linksInfos.shortDescs.filter(s=>s&&(context.preserveUnknown||sgnMatch(s,sgnPattern)))}if(this._links.length===0)return
const multiPaste=this._links.length>1&&CARD.isRepeatable(ctx.skNode.rule.contentRule.getRealCardSubNode(ENodeType.element,this.linkerRule.matcher.startName))
const jml=[]
const start=context.sel.start
const end=context.sel.end
let partSkNode
if(end&&ctx.ctn instanceof Element&&XA.isInSameSeq(start,end)&&XA.last(end)-XA.last(start)===1&&(partSkNode=this.schemaDom.getSkNode(ctx.ctn.childNodes[XA.last(start)])).rule===this.linkerRule){SkMPartWsp.setLink(partSkNode,SRC.srcRef(this._links[0]),batch)
batch.setSelBefore(start)
if(multiPaste){ctx=SKMETA.buildSkImportCtxInternal({sel:{start:ctx.sel.end}},ctx.schemaDom)}}else{this.addJmlTag(this._links[0],jml)}if(multiPaste){for(let i=1;i<this._links.length;i++)this.addJmlTag(this._links[i],jml)}if(jml.length>0)SKMETA.doPasteReplaceSel(jml,ctx,ctx.schemaDom,batch)}addJmlTag(shortDesc,jml,body){const i=jml.length
this.linkerRule.createContent(jml)
jml[i][this.linkerRule.ptrItem.matcher.startName]=ITEM.srcRefSub(shortDesc)
if(body){if(!jml[i+1])jml.push([body])
else jml[i+1].push(body)}}cleanupContentToPaste(ctx,rootRule,rootNode){new SchemaDom(ctx.schemaDom.schema,rootRule,rootNode).correctDocument({autoMutate:true,autoComplete:true,autoCleanup:true,autoNormXml:true,autoNormChars:true})}}class SkImpPartInternalizeLink extends SkImpTagLink{getLabel(){return this.appendLabel?this.linkerRule.structLabel+" (Internaliser le contenu)":this.linkerRule.structLabel}get needAsyncBuild(){return true}async buildContentToImport(uiContext){const subModels=findSubModelRules(this.linkerRule)
let links=this.linksInfos.shortDescs.filter(s=>s&&(this.preserveUnknown||subModels.findIndex(m=>s.itModel===getModelName(m))>=0))
if(links.length>1){if(!CARD.isRepeatable(this.partRule.contentRule.getRealCardSubNode(ENodeType.element,this.linkerRule.matcher.startName))){links=[links[0]]}}if(links.length>1){const pending=links.map(lnk=>getContentForInternalize(lnk,this.linksInfos.wsp,uiContext))
const jmls=await Promise.all(pending)
let i=0
while(i<jmls.length){const jml=jmls[i++]
if(jml){this.firstContent=jml
break}}if(i<jmls.length){this.nextContents=[]
do{const jml=jmls[i++]
if(jml)this.nextContents.push(jml)}while(i<jmls.length)}}else{this.firstContent=await getContentForInternalize(links[0],this.linksInfos.wsp,uiContext)}return this.firstContent==null?"stop":undefined}doImport(context,batch,options){let ctx=SKMETA.buildSkImportCtxInternal(context,this.schemaDom)
const jml=[]
const start=context.sel.start
const end=context.sel.end
let partSkNode
if(end&&ctx.ctn instanceof Element&&XA.isInSameSeq(start,end)&&XA.last(end)-XA.last(start)===1&&(partSkNode=this.schemaDom.getSkNode(ctx.ctn.childNodes[XA.last(start)])).rule===this.linkerRule){this.linkerRule.skMeta.setInternalizedContent(partSkNode,this.firstContent,batch)
batch.setSelBefore(start)
if(this.nextContents){ctx=SKMETA.buildSkImportCtxInternal({sel:{start:ctx.sel.end}},ctx.schemaDom)
for(const c of this.nextContents)this.addJmlPartContent(c,jml)}}else{this.addJmlPartContent(this.firstContent,jml)
if(this.nextContents)for(const c of this.nextContents)this.addJmlPartContent(c,jml)}if(jml.length>0)SKMETA.doPasteReplaceSel(jml,ctx,ctx.schemaDom,batch)}addJmlPartContent(content,jml){const i=jml.length+1
this.linkerRule.createContent(jml)
const children=jml[i]
if(!children){jml.push(content)}else{const subModels=findSubModelRules(this.linkerRule)
const it=new JmlSubSetIterator(children)
while(it.next()){if(JML.isElt(it.currentNode))for(let subModel of subModels){if(subModel.matcher.matchNode(JML.jmlNode2nodeType(it.currentNode),JML.jmlNode2name(it.currentNode))){JML.replaceChildren(JML.getJmlChildrenOrBody(content,0),it.currentNode,children)
return}}}children.push(...content)}}}class SkImpInternalize extends SkImpSimple{constructor(ctx,linksInfos,shortDescOffset,pos){super(ctx,null,0,pos)
this.linksInfos=linksInfos
this.shortDescOffset=shortDescOffset}get needAsyncBuild(){return true}async buildContentToImport(uiContext){this.jml=await getContentForInternalize(this.linksInfos.shortDescs[this.shortDescOffset],this.linksInfos.wsp,uiContext)
if(this.jml==null)return"stop"}getJml(){return this.jml}}class SkImpTxtLink extends SkImpTagLink{constructor(oriCtx,linksInfos,linkerRule,pos,wrapSel){super(oriCtx,linksInfos,linkerRule,pos,false)
this.wrapSel=wrapSel}doImport(context,batch,options){let ctx=SKMETA.buildSkImportCtxInternal(context,this.schemaDom)
if(!this._links){const ptrItemRule=this.linkerRule.ptrItem
this._links=this.linksInfos.shortDescs.filter(s=>s&&(context.preserveUnknown||sgnMatchRule(s,ptrItemRule)))}const multiPaste=this._links.length>1&&CARD.isRepeatable(ctx.skNode.rule.contentRule.getRealCardSubNode(ENodeType.element,this.linkerRule.matcher.startName))
let jml=[]
const start=context.sel.start
const end=context.sel.end
let linkerSk
if(end&&ctx.ctn instanceof Element&&XA.isInSameSeq(start,end)&&XA.last(end)-XA.last(start)===1&&(linkerSk=this.schemaDom.getSkNode(ctx.ctn.childNodes[XA.last(start)])).rule===this.linkerRule){batch.add((new XmlStrMsg).init(XA.append(XA.fromNode(linkerSk.node),linkerSk.rule.ptrItem.matcher.startName),SRC.srcRef(this._links[0])))
batch.setSelBeforeSeq(start,1)
if(multiPaste){ctx=SKMETA.buildSkImportCtxInternal({sel:{start:ctx.sel.end}},ctx.schemaDom)}else{batch.setSelAfterSeq(start,1)
return}}else{if(this.wrapSel&&!XA.isCollapsed(ctx.sel)){this.addJmlTag(this._links[0],jml)
const elt=JML.jmlToDom(jml).documentElement
ctx.schemaDom.exportRange({start:ctx.sel.start,end:ctx.sel.end},elt)
this.cleanupContentToPaste(ctx,this.linkerRule,elt)
jml=JML.dom2jml(elt)}else{const lnk=this._links[0]
this.addJmlTag(lnk,jml,this.wrapSel?lnk.itTi||SRC.extractLeafFromUri(lnk.srcUri):null)}}if(multiPaste){for(let i=1;i<this._links.length;i++){const lnk=this._links[i]
this.addJmlTag(lnk,jml,this.wrapSel?lnk.itTi||SRC.extractLeafFromUri(lnk.srcUri):null)}}if(jml.length>0)SKMETA.doPasteReplaceSel(jml,ctx,ctx.schemaDom,batch)}}export class SkItemSearch{constructor(srcRef,maxResults){this.srcRef=srcRef
this.maxResults=maxResults}buildSearchAnnots(skNode,annots){var _a,_b
const ptrRule=skNode.rule.contentRule.findRule(rule=>rule.skMeta instanceof SkMPtrItem)
if(ptrRule){if(IS_element(skNode.node))for(const att of skNode.node.attributes){if(ptrRule.structMatch(ENodeType.attribute,att.nodeName)){if(!this.srcRef){annots.push(new SkSearchNodeAnnot(this,att,"Lien vers un item"))}else{const targetSrc=(_b=(_a=skNode.node.ownerDocument)===null||_a===void 0?void 0:_a.srcRefMap)===null||_b===void 0?void 0:_b.get(att.nodeValue)
const targetRef=targetSrc==null||targetSrc instanceof Promise?att.nodeValue:SRC.srcRef(targetSrc)
if(targetRef===this.srcRef){annots.push(new SkSearchNodeAnnot(this,att,"Lien vers cet item"))}}}}}}}export class SkCommentSearch{constructor(opened,closed,maxResults){this.opened=opened
this.closed=closed
this.maxResults=maxResults}buildSearchAnnots(skNode,annots){for(let ch=skNode.node.firstChild;ch;ch=ch.nextSibling){if(ch.nodeType===ENodeType.comment){if(this.opened&&this.closed){annots.push(new SkSearchNodeAnnot(this,ch,"Commentaire"))}else{const str=ch.nodeValue
const start=str.indexOf("<")
if(start>=0){const end=str.indexOf(">",start+1)
if(end>0&&str.indexOf("comment",start+1)===start+1&&str.lastIndexOf('xmlns="scenari.eu:comment:1.0"',end)>start){const isClosed=str.lastIndexOf('threadClosed="true"',end)>start
if(isClosed===this.closed){annots.push(new SkSearchNodeAnnot(this,ch,"Commentaire"))}continue}}annots.push(new SkSearchNodeAnnot(this,ch,"Commentaire"))}}}}}export class SwitchPartConverter{async convert(src){if(!src.jml){src.jml=[]
JML.domNode2jml(src.node,src.jml)}const newC=[]
src.outStruct.createContent(newC)
const res=src.jml.concat()
const tag=res[0]
const newTag=newC[0]
if(tag["sc:refUri"])newTag["sc:refUri"]=tag["sc:refUri"]
res[0]=Object.assign({},tag,newTag)
return{jml:res}}}CONVERTERLIB.registerConverterFromXml("sc:part",()=>new SwitchPartConverter)
export async function internalizePartsRecursively(fromSrc,root,parts,wsp,uiCtx,cyclesFound,cycleGuard){if(cycleGuard==null)cycleGuard=new Set
if(!root){const house=wsp.wspServer.wspsLive.getHouseIfFetched(WSP.buildWspRef(wsp.code,fromSrc))
if(house){root=house.document.documentElement.lastElementChild.cloneNode(true)
fromSrc=SRC.srcRef(house.srcFields)}else{const resp=await ITEM.fetchContent(wsp,uiCtx,fromSrc,false,"srcUri*srcId")
root=(new DOMParser).parseFromString(await resp.text(),"text/xml").documentElement.lastElementChild
fromSrc=SRC.srcRef(JSON.parse(resp.headers.get("X-SCFIELDS")))}}let n=root.firstElementChild
while(n){const refUri=n.getAttribute("sc:refUri")
if(refUri){const compoParts=parts[n.parentNode.nodeName]
if(compoParts&&compoParts.indexOf(n.localName)>=0){try{let eltToImport
let srcRefToImport
const house=wsp.wspServer.wspsLive.getHouseIfFetched(WSP.buildWspRef(wsp.code,refUri))
if(house){eltToImport=n.ownerDocument.importNode(house.document.documentElement.lastElementChild,true)
srcRefToImport=SRC.srcRef(house.srcFields)}else{const resp=await ITEM.fetchContent(wsp,uiCtx,refUri,false,"srcUri*srcId")
eltToImport=n.ownerDocument.adoptNode((new DOMParser).parseFromString(await resp.text(),"text/xml").documentElement.lastElementChild)
srcRefToImport=SRC.srcRef(JSON.parse(resp.headers.get("X-SCFIELDS")))}if(cycleGuard.has(srcRefToImport)){cyclesFound.push([...cycleGuard,srcRefToImport])}else{cycleGuard.add(srcRefToImport)
n.removeAttribute("sc:refUri")
n.appendChild(eltToImport)
await internalizePartsRecursively(srcRefToImport,eltToImport,parts,wsp,uiCtx,cyclesFound,cycleGuard)
cycleGuard.delete(srcRefToImport)
n=DOM.findNextUncle(n,root,IS_element)
continue}}catch(e){console.log("Internalize part failed",e)}}}n=DOM.findNext(n,root,IS_element)}return root}
//# sourceMappingURL=schemaMetaWsp.js.map