import{ESerialMode,Serializable}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/serial.js"
import{DOM,ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{XmlBodyState,XmlDeleteMsg,XmlInsertMsg,XmlListMsgOt,XmlStrMsg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{SKMETA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMeta.js"
import{initSkRuleDefaults,SkRule,SkRuleAttr,SkRuleAttrUnknown,SkRuleChoice,SkRuleComment,SkRuleEltUnknown,SkRuleGroup,SkRuleTextForbidden}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaPatterns.js"
export function isSkAnnotated(obj){return obj&&(obj.skAnnotsToAdd||obj.skAnnotsToRemove)}export class Schema extends Serializable{constructor(startRule,options={}){super()
initSkRuleDefaults()
this.startRule=startRule
this.unknownEltRule=options.unknownEltRule||SkRuleEltUnknown.DEFAULT
this.unknownAttrRule=options.unknownAttrRule||SkRuleAttrUnknown.DEFAULT
this.forbiddenTextRule=options.forbiddenTextRule||SkRuleTextForbidden.DEFAULT
this.commentRule=options.commentRule||SkRuleComment.DEFAULT
this.namespaces=options.namespaces
this.crossDomMgrFactories=options.crossDomMgrFactories}static buildFromJson(json){return(new Schema).readFrom(json,ESerialMode.json)}static buildFromStruct(struct){return(new Schema).readFrom(struct,ESerialMode.struct)}bindToDom(domNode,options){const ruleNode=options&&options.rootRule?options.rootRule:this.startRule.findRuleNodeFor(domNode)
return ruleNode?new SchemaDom(this,ruleNode,domNode,options):null}fixDocForExport(doc){if(this.namespaces){const ns=this.namespaces
const elt=doc.documentElement
for(const prefix in ns){if(prefix)elt.setAttributeNS(DOM.XMLNS_NS,"xmlns:"+prefix,ns[prefix])
else elt.setAttributeNS(DOM.XMLNS_NS,"xmlns",ns[prefix])}}}computeIndex(){if(!this._rulesIndex){this._rulesIndex=[]
this.startRule.indexPatterns(this._rulesIndex)}}writeTo(o,mode){this.computeIndex()
o.rules=Serializable.serialArraySerializables(this._rulesIndex,mode)
if(this.unknownEltRule!==SkRuleEltUnknown.DEFAULT)o.unknownEltRule=Serializable.serialSerializable(this.unknownEltRule,mode)
if(this.unknownAttrRule!==SkRuleAttrUnknown.DEFAULT)o.unknownAttrRule=Serializable.serialSerializable(this.unknownAttrRule,mode)
if(this.forbiddenTextRule!==SkRuleTextForbidden.DEFAULT)o.forbiddenTextRule=Serializable.serialSerializable(this.forbiddenTextRule,mode)
if(this.commentRule!==SkRuleComment.DEFAULT)o.commentRule=Serializable.serialSerializable(this.commentRule,mode)}readFrom(o,mode){this._rulesIndex=Serializable.deserialArraySerializables(o.rules,mode,SkRule.registry)
if(o.unknownEltRule){this.unknownEltRule=Serializable.deserialSerializable(o.unknownEltRule,mode,SkRule.registry)
this.unknownEltRule.linkRules(this)}else{this.unknownEltRule=SkRuleEltUnknown.DEFAULT}if(o.unknownAttrRule){this.unknownAttrRule=Serializable.deserialSerializable(o.unknownAttrRule,mode,SkRule.registry)
this.unknownAttrRule.linkRules(this)}else{this.unknownAttrRule=SkRuleAttrUnknown.DEFAULT}if(o.forbiddenTextRule){this.forbiddenTextRule=Serializable.deserialSerializable(o.forbiddenTextRule,mode,SkRule.registry)
this.forbiddenTextRule.linkRules(this)}else{this.forbiddenTextRule=SkRuleTextForbidden.DEFAULT}if(o.commentRule){this.commentRule=Serializable.deserialSerializable(o.commentRule,mode,SkRule.registry)
this.commentRule.linkRules(this)}else{this.commentRule=SkRuleComment.DEFAULT}this.startRule=this._rulesIndex[0]
this.startRule.linkRules(this)
return this}resolveRule(rule){if(typeof rule==="number"){const res=this._rulesIndex[rule]
if(res.id===undefined)res.id=rule
return res}return rule}createNewDoc(){const eltRule=this.startRule.findRule(r=>r.structType==ENodeType.document)
const jml=[]
const xmlRoot=eltRule.createContent(jml)
if(jml.length===0)jml.push({"":xmlRoot||"x"})
const elt=jml[0]
if(this.namespaces)for(const prefix of Object.keys(this.namespaces)){if(prefix===""){elt["xmlns"]=this.namespaces[prefix]}else{elt["xmlns:"+prefix]=this.namespaces[prefix]}}return jml}}export class SchemaDom{constructor(schema,startRule,nodeRoot,config){this.schema=schema
this.nodeRoot=nodeRoot
this.schema=schema
this.nodeRoot=nodeRoot
this.bindKey=config&&config.bindKey||"_sk"
if(schema.crossDomMgrFactories){this.crossDomMgrs={}
const factories=schema.crossDomMgrFactories
for(let key in factories)this.crossDomMgrs[key]=factories[key](this)}new SkNode(startRule,nodeRoot,this)}get document(){return this.nodeRoot instanceof Document?this.nodeRoot:this.nodeRoot.ownerDocument}validateDocument(execOptions){const results=this.xBuildExecResult(execOptions)
results.resetAll=true
this.startValid(results)
this.getSkNode(this.nodeRoot).execRules(results)
this.endValid(results)
results.resetAll=false
return this.xExecRevalid(results)}correctDocument(execOptions){let cycles=0
let results=this.validateDocument(Object.create(execOptions))
while(results.mutations||results.corrections.length>0){new XmlBodyState("").resetDom(this.document).update((new XmlListMsgOt).initConcurrentList(results.mutations||results.corrections))
results=this.validateDocument(Object.create(execOptions))
if(cycles++>50){console.warn("Infinite cleanupContentToPaste loop: ",results,this.document)
break}}}revalid(execOptions){return this.xExecRevalid(this.xBuildExecResult(execOptions))}xExecRevalid(results){while(results.shouldRevalid){results.pendingRevalid=results.shouldRevalid
results.shouldRevalid=null
for(const n of results.pendingRevalid){if(n!==this.nodeRoot){const skNode=this.getSkNode(n)
if(skNode){if(this.needRefreshParent(skNode)){this.resetSkNode(n);(results.shouldRevalid||(results.shouldRevalid=new Set)).add(n.parentNode)}}else if(this.getSkNode(n.parentNode)==null||results.pendingRevalid.has(n.parentNode)){results.pendingRevalid.delete(n)}}}this.startValid(results)
for(const n of results.pendingRevalid){const skNode=this.getSkNode(n)
if(skNode&&n.isConnected){skNode.execRules(results)}}this.endValid(results)}results.pendingRevalid=null
return results}startValid(options){if(options.searches)for(const s of options.searches){if("beforeSearchAnnots"in s)s.beforeSearchAnnots(this)}const crossMgrs=this.crossDomMgrs
if(crossMgrs)for(const k in crossMgrs){const crossMgr=crossMgrs[k]
if("onStartValid"in crossMgr)crossMgr.onStartValid(options)}}endValid(options){const crossMgrs=this.crossDomMgrs
if(crossMgrs)for(const k in crossMgrs){const crossMgr=crossMgrs[k]
if("onEndValid"in crossMgr)crossMgr.onEndValid(options)}}needRefreshParent(skNode){if(!skNode.rule.deepMatch(skNode.node))return true
if(skNode.rule.matcher.isFuzzy()){const parent=skNode.node.parentNode
if(parent){const skParentNode=this.getSkNode(parent)
if(skParentNode&&!skParentNode.rule.matcher.isFuzzy())return true}}return false}getAnnots(node,deep,filter,arrayToAppend=[]){if(node.nodeType===Node.TEXT_NODE){const skNode=this.getSkNode(node.parentNode)
if(skNode){if(skNode.annots)for(const a of skNode.annots){if(a.anchorNode===node)if(!filter||filter(a))arrayToAppend.push(a)}if(skNode.extAnnots)for(const a of skNode.extAnnots){if(a.anchorNode===node)if(!filter||filter(a))arrayToAppend.push(a)}}}else{const skNode=this.getSkNode(node)
if(skNode){if(skNode.annots)arrayToAppend.push(...filter?skNode.annots.filter(filter):skNode.annots)
if(skNode.extAnnots)arrayToAppend.push(...filter?skNode.extAnnots.filter(filter):skNode.extAnnots)
if(deep){for(let ch=skNode.node.firstElementChild;ch;ch=ch.nextElementSibling){this.getAnnots(ch,deep,filter,arrayToAppend)}}}}return arrayToAppend}getAllAnnots(filter){return this.getAnnots(this.nodeRoot,true,filter)}scanSkNodes(cb,from){if(!from)from=this.document
cb(this.getSkNode(from))
const tw=this.document.createTreeWalker(from,NodeFilter.SHOW_ELEMENT)
while(tw.nextNode())cb(this.getSkNode(tw.currentNode))}doSearch(addSearch,remSearch,annotsToAdd,annotsToRem){if(addSearch===null||addSearch===void 0?void 0:addSearch.beforeSearchAnnots)addSearch.beforeSearchAnnots(this)
const filter={me:this,acceptNode(node){const skNode=this.me.getSkNode(node)
if(skNode){skNode.doSearch(addSearch,remSearch,annotsToAdd,annotsToRem)}else{console.log("No skNode for",node)}return NodeFilter.FILTER_ACCEPT}}
const tw=this.document.createTreeWalker(this.nodeRoot,NodeFilter.SHOW_ELEMENT,filter)
if(addSearch)while(tw.nextNode()&&annotsToAdd.length<=addSearch.maxResults);addSearch=null
if(remSearch)while(tw.nextNode());}getStruct(elt){const skNode=this.getSkNode(elt)
return skNode?skNode.rule:null}getStructAtt(att){const skNode=this.getSkNode(att.ownerElement)
if(!skNode)return null
return skNode.rule.contentRule.findRuleAttrFor(att.nodeName)}listInsertableNodes(parentNode,gapOffset){const skNode=this.getSkNode(parentNode)
if(!skNode)return null
const execOptions={list1InsertableNodesAt:gapOffset,insertableNodes1:[]}
skNode.execRules(execOptions)
return execOptions.insertableNodes1}listInsertableAttrs(eltNode){const execOptions={insertableAttrs:[]}
const skNode=this.getSkNode(eltNode)
if(!skNode)return null
skNode.execRules(execOptions)
return execOptions.insertableAttrs}listInsertableStructs(parentNode,offset1,offset2,attrs){const result=[]
const skNode=this.getSkNode(parentNode)
if(!skNode)return result
const execOptions={}
if(offset1!=null){execOptions.list1InsertableNodesAt=offset1
execOptions.insertableNodes1=[]}if(offset2!=null){execOptions.list2InsertableNodesAt=offset2
execOptions.insertableNodes2=[]}if(attrs)execOptions.insertableAttrs=[]
skNode.execRules(execOptions)
if(offset1!=null)result.push(execOptions.insertableNodes1)
if(offset2!=null)result.push(execOptions.insertableNodes2)
if(attrs)result.push(execOptions.insertableAttrs)
return result}getInsertableOffset(parentNode,nodeType,ifExistAndCardN="reject",nodeName){const skNode=this.getSkNode(parentNode)
if(!skNode)return-2
if(nodeType===3&&ifExistAndCardN==="reject"){if(DOM.findFirstChild(parentNode,DOM.IS_text)!=null)return-1}const execOptions={findOffsetNodeType:nodeType,findOffsetNodeName:nodeName,findOffsetIfExistAndCardN:ifExistAndCardN}
skNode.execRules(execOptions)
return"findOffset"in execOptions?execOptions.findOffset:-2}getPastePos(parentNode,offsetMin,offsetMax,content){const skNode=this.getSkNode(parentNode)
if(!skNode)return EPastePos.none
const execOptions={pasteOffsetMin:offsetMin,pasteOffsetMax:offsetMax,importContent:content,pastePos:EPastePos.none}
skNode.execRules(execOptions)
return execOptions.pastePos}getImportPos(parentNode,content){const skNode=this.getSkNode(parentNode)
if(!skNode)return null
const execOptions={importContent:content}
skNode.execRules(execOptions)
if(execOptions.importPos){execOptions.importPos.similarTo=content
return execOptions.importPos}return null}listAlternateStructs(parent,offset,nodeType,nodeName,virtualPath){const skParent=this.getSkNode(parent)
if(!skParent)return null
let parentRule=skParent.rule
if(virtualPath)for(const anc of virtualPath){parentRule=parentRule.contentRule.findRule(rule=>rule.structMatch(ENodeType.element,JML.jmlNode2name(anc)))
if(!parentRule)return null}const nodeRule=parentRule.contentRule.findRule(rule=>rule.structMatch(nodeType,nodeName))
let result
if(nodeRule==null){if(virtualPath)return null
result=nodeType===ENodeType.attribute?this.listInsertableAttrs(parent):this.listInsertableNodes(parent,offset)}else{parentRule.contentRule.findRule(choice=>{if(!(choice instanceof SkRuleChoice)||choice.isStrChoice())return false
const stack=[]
if(!choice.scanRules(r=>r===nodeRule,stack))return false
if(offset>0&&stack.length>0){let groupIdx=-1
for(let i=stack.length-1;i>=0;i--){if(stack[i]instanceof SkRuleGroup){groupIdx=i
break}}if(groupIdx>=0){const prev=parent.childNodes.item(offset).previousElementSibling
const prevRule=this.getSkNode(prev).rule
const prevStack=[]
choice.scanRules(r=>r===prevRule,prevStack)
const isPrevInSameGroup=prevStack[groupIdx]===stack[groupIdx]
if(isPrevInSameGroup){return false}else{}}}function findAlt(r){if(r instanceof SkRuleChoice)r.subRules.forEach(findAlt)
else if(!r.findRule(r=>r===nodeRule)){if(!r.skMeta||r.skMeta.isInsertable(skParent,r))(result||(result=[])).push(r)}}choice.subRules.forEach(findAlt)
return true},true)}return skParent.rule.skMeta.overwriteAlternates(skParent,parentRule,nodeRule,offset,nodeType,nodeName,result)}getRealCardElt(node){const skNode=this.getSkNode(node)
if(!skNode)return undefined
const skNodeParent=this.getSkNode(node.parentNode)
if(!skNodeParent)return skNode.rule.card
return skNodeParent.rule.contentRule.getRealCardSubNode(ENodeType.element,node.nodeName)}getRealCardAtt(node){const skNode=this.getSkNode(node)
if(!skNode)return undefined
const skNodeParent=this.getSkNode(node.ownerElement)
if(!skNodeParent)return skNode.rule.card
return skNodeParent.rule.contentRule.getRealCardSubNode(ENodeType.attribute,node.nodeName)}isEltRemovable(elt){const parent=elt.parentNode
if(!parent)return false
const skNode=this.getSkNode(parent)
if(!skNode)return undefined
const rule=skNode.rule.contentRule
if(!rule.structMatch(ENodeType.element,elt.nodeName))return true
return skNode.rule.contentRule.isEltRemovable(elt)}checkSchemaOrder(parentNode,eltName1,eltName2){const skNode=this.getSkNode(parentNode)
if(!skNode)return undefined
return skNode.rule.contentRule.checkSchemaOrder(eltName1,eltName2)}exportRange(scope,to){let start=scope.start
const end=scope.end
if(scope.deletes&&scope.forceSplitText){if(XA.findDomLast(start,this.nodeRoot)instanceof Text)start=[...start,0]}let forkDepth=end?XA.findForkDepth(start,end):start.length
if(forkDepth===start.length){if(!end||forkDepth===end.length){if(XA.isAttribute(start)){if(to instanceof Node){const att=XA.findDomLast(start,this.nodeRoot)
if(att){const attsHolder=to.appendChild(to.ownerDocument.createElementNS(DOM.SCCORE_NS,SKMETA.SCATTRIBUTES_TAG))
attsHolder.setAttributeNodeNS(att.cloneNode(false))
if(scope.deletes)scope.deletes.add((new XmlStrMsg).init(start,null))}}}else{if(scope.deletes&&scope.forceSplitText){const ctn=XA.findDomContainer(start,this.nodeRoot)
if(ctn instanceof Text){const cutPoint=XA.last(start)
const str=ctn.nodeValue
if(cutPoint<str.length){scope.deletes.add((new XmlDeleteMsg).init(start,str.length-cutPoint))
scope.deletes.add((new XmlInsertMsg).init(XA.newBd(start).up().incrAtDepth(-1,1).xa,[str.substring(cutPoint)]))}}}}return to}if(forkDepth>0)forkDepth--}const commonNode=XA.findDom(start,this.nodeRoot,forkDepth)
if(!commonNode)return to
if(commonNode instanceof CharacterData||commonNode instanceof Attr){const fromRoot=start[forkDepth]
const toRoot=end[forkDepth]
if(typeof fromRoot==="string")throw Error(`Clone fragment throw attributes not allowed: ${start}`)
if(typeof toRoot==="string")throw Error(`Clone fragment throw attributes not allowed: ${end}`)
if(start.length!==forkDepth+1)throw Error()
const str=commonNode.nodeValue.substring(fromRoot,toRoot)
if(to)JML.appendText(str,to)
if(scope.deletes&&(fromRoot<commonNode.nodeValue.length||toRoot>0)){if(scope.forceSplitText&&commonNode instanceof Text){const str=commonNode.nodeValue
if(fromRoot<str.length)scope.deletes.add((new XmlDeleteMsg).init(start,str.length-fromRoot))
if(str.length>toRoot)scope.deletes.add((new XmlInsertMsg).init(XA.newBd(start).up().incrAtDepth(-1,1).xa,[str.substring(toRoot)]))}else scope.deletes.add((new XmlDeleteMsg).init(start,toRoot-fromRoot))}return to}const skNode=this.getSkNode(commonNode)
skNode.rule.skMeta.exportNode(skNode,to,scope,forkDepth,forkDepth)
return to}exportNodeCustom(node,filters){const skNode=this.getSkNode(node)
if(!skNode)return node.cloneNode(true)
return skNode.rule.skMeta.exportNodeCustom(skNode,filters)}tryPaste(context,datas){if(datas.originalLinks){return this.tryPasteLinks(context,datas.originalLinks,datas)}else if(datas.originalDom||datas.originalHtml){return this.tryPasteNodes(context,datas.originalDom||datas.originalHtml,datas)}else if(datas.originalText){return this.tryPasteText(context,datas.originalText,datas)}return Promise.resolve(null)}tryPasteNodes(context,content,cache){const ctx=SKMETA.buildSkImportCtxInternal(context,this)
return SKMETA.ctxLastSkRule(ctx).skMeta.tryPasteNodes(ctx,content,cache)}tryPasteLinks(context,linksInfo,cache){const ctx=SKMETA.buildSkImportCtxInternal(context,this)
return SKMETA.ctxLastSkRule(ctx).skMeta.tryPasteLinks(ctx,linksInfo,cache)}tryPasteText(context,text,cache){const ctx=SKMETA.buildSkImportCtxInternal(context,this)
return SKMETA.ctxLastSkRule(ctx).skMeta.tryPasteText(ctx,text,cache)}tryImport(context,datas){const ctx=SKMETA.buildSkImportCtxInternal(context,this)
if(datas.originalLinks){return SKMETA.ctxLastSkRule(ctx).skMeta.tryImportLinks(ctx,datas.originalLinks,datas)}else if(datas.originalDom){return SKMETA.ctxLastSkRule(ctx).skMeta.tryImportNodes(ctx,datas.originalDom,datas)}else if(datas.originalText){console.trace("TODO: tryImportText")}return Promise.resolve(null)}getSkNode(node){return node[this.bindKey]}resetSkNode(node){node[this.bindKey]=undefined}startBulkUpdates(execOptions){return this.xBuildExecResult(execOptions)}xBuildExecResult(execOptions){if(isSkExecInternalOptions(execOptions))return execOptions
const execOpt=Object.create(execOptions||SchemaDom.EXEC_OPTIONS_DEFAULT)
if(execOpt.genAnnots){execOpt.annotsToAdd=[]
execOpt.annotsToRemove=[]
if(execOpt.searches){execOpt.searchesCount=new Map
for(const s of execOpt.searches)execOpt.searchesCount.set(s,0)}}if(execOpt.autoComplete||execOpt.autoCleanup||execOpt.autoNormXml||execOpt.autoNormChars)execOpt.corrections=[]
execOpt.resetAll=false
return execOpt}}SchemaDom.EXEC_OPTIONS_DEFAULT=Object.freeze({genAnnots:true})
SchemaDom.DEBUG=false
function isSkExecInternalOptions(opt){return opt&&"resetAll"in opt}export class SkNode{constructor(rule,node,schemaDom){this.schemaDom=schemaDom
this.rule=rule
this.node=node
node[schemaDom.bindKey]=this}execRules(execOptions){const skCtx=(new SkContext).init(this,execOptions)
const skMeta=this.rule.skMeta
if(skMeta)skMeta.onExecRulesStart(skCtx)
this.rule.contentRule.findBestMatching(skCtx)
skCtx.bindRulesAndExecute()
this.rule.contentRule.execActions(skCtx)
if(skMeta)skMeta.onExecRules(skCtx,this.rule,this.node)
if(execOptions.genAnnots){if(execOptions.searchesCount){for(const[s,count]of execOptions.searchesCount.entries()){if(count<=s.maxResults){const annots=skCtx.newAnnots||[]
const oldLen=annots.length
s.buildSearchAnnots(this,annots)
if(annots.length>oldLen){if(!skCtx.newAnnots)skCtx.newAnnots=annots
execOptions.searchesCount.set(s,count+annots.length-oldLen)}}}}SkNode.buildAnnotDiff(this.annots,skCtx.newAnnots,execOptions)
this.annots=skCtx.newAnnots}return this}static buildAnnotDiff(oldAnnots,newAnnots,result){if(newAnnots){if(oldAnnots){newAnnots.forEach((newAnn,newIdx)=>{const idx=oldAnnots.findIndex(a=>a&&newAnn.equals(a))
if(idx<0)result.annotsToAdd.push(newAnn)
else{newAnnots[newIdx]=oldAnnots[idx]
oldAnnots[idx]=null}})}else{Array.prototype.push.apply(result.annotsToAdd,newAnnots)}}if(oldAnnots){oldAnnots.forEach(a=>{if(a)result.annotsToRemove.push(a)})}}doSearch(addSearch,remSearch,annotsToAdd,annotsToRem){if(remSearch&&this.annots){for(let i=0;i<this.annots.length;i++){if(this.annots[i].search===remSearch){annotsToRem.push(this.annots[i])
this.annots.splice(i--,1)}}}if(addSearch){const curSize=annotsToAdd.length
addSearch.buildSearchAnnots(this,annotsToAdd)
if(curSize<annotsToAdd.length){if(!this.annots)this.annots=[]
for(let i=curSize;i<annotsToAdd.length;i++)this.annots.push(annotsToAdd[i])}}}remDiff(diffSession,annotsToRem){if(this.extAnnots){let i=0
for(;i<this.extAnnots.length;i++){if(this.extAnnots[i].diffSession!==diffSession){if(i>0){for(let k=0;k<i;k++)annotsToRem.push(this.extAnnots[k])
this.extAnnots.splice(0,i)
i=0}break}}if(i<this.extAnnots.length){for(;i<this.extAnnots.length;i++){if(this.extAnnots[i].diffSession===diffSession){annotsToRem.push(this.extAnnots[i])
this.extAnnots.splice(i--,1)}}}else{annotsToRem.push(...this.extAnnots)
this.extAnnots=null}}}}export class SkContext extends Map{constructor(){super(...arguments)
this.states=[]
this.statesIdx=0}init(skNode,execOptions){this.skNode=skNode
this.execOptions=execOptions
this._currCh=this.xGetValidChild(skNode.node.firstChild)
return this}xGetValidChild(ch){var _a
while(ch&&ch.nodeType===Node.COMMENT_NODE){const rule=this.skNode.rule.commentRule||this.skNode.schemaDom.schema.commentRule;(_a=rule===null||rule===void 0?void 0:rule.skMeta)===null||_a===void 0?void 0:_a.onExecRules(this,rule,ch)
ch=ch.nextSibling}return ch}get node(){return this.skNode.node}get currentChild(){return this._currCh}set currentChild(ch){ch=this.xGetValidChild(ch)
if(this.unknownsCh){while(ch&&this.unknownsCh.indexOf(ch)>=0)ch=this.xGetValidChild(ch.nextSibling)}this._currCh=ch}get currentOffset(){if(!this._currCh)return this.node.childNodes.length
let offset=0
for(let previous=this._currCh.previousSibling;previous!==null;previous=previous.previousSibling)offset++
return offset}get currentOffsetMin(){let node=this._currCh?this._currCh.previousSibling:this.node.lastChild
if(!node)return 0
while(node&&node.nodeType===ENodeType.comment)node=node.previousSibling
return DOM.computeOffset(node,-1)+1}get currentOffsetMax(){return this.offsetMaxOf(this._currCh)}getOffsetMaxAfterCurrent(count){let next=this._currCh
for(let i=0;i<count;i++)next=this.xGetValidChild(next.nextSibling)
return this.offsetMaxOf(next)}offsetMaxOf(from){let node=from?from.nextSibling:null
if(!node)return DOM.computeOffset(from,this.node.childNodes.length)
while(node&&node.nodeType===ENodeType.comment)node=node.nextSibling
return DOM.computeOffset(node,this.node.childNodes.length)-1}forEachChild(cb,cbThis){for(let ch=this._currCh;ch;ch=this.xGetValidChild(ch.nextSibling)){if(cb.call(cbThis,ch)===true)return}}forEachBindableChild(cb,cbThis){let idxUnknown=0,nextUnknown
if(this.unknownsCh)nextUnknown=this.unknownsCh[idxUnknown++]
for(let ch=this._currCh;ch;ch=this.xGetValidChild(ch.nextSibling)){if(ch===nextUnknown){nextUnknown=this.unknownsCh[idxUnknown++]}else{if(cb.call(cbThis,ch)===true)return}}}forEachAttr(cb,cbThis){const atts=this.node.attributes
if(atts)for(let i=0,s=atts.length;i<s;i++){const att=atts.item(i)
if(cb.call(cbThis,att)===true)return}}forEachBindableAttr(cb,cbThis){const atts=this.node.attributes
if(atts)for(let i=0,s=atts.length;i<s;i++){const att=atts.item(i)
if(!this.has(att))if(cb.call(cbThis,att)===true)return}}bindNodeToRule(node,rule){this.set(node,rule)
this.currentChild=node.nextSibling}bindUnknownNodeToRuleAndReset(node,rule,preserveState){if(rule==null){console.log("null rule for "+DOM.ser(node))}if(!this.unknownsCh)this.unknownsCh=[rule,node]
else this.unknownsCh.push(rule,node)
this.clear()
this.currentChild=this.node.firstChild
this.states.length=preserveState>=0?preserveState+1:0}bindAttrToRule(attr,rule){this.set(attr,rule)}pushRuleState(state){this.states.push(state)}reserveRuleState(){this.states.push(null)
return this.states.length-1}setRuleState(stateIdx,state){this.states[stateIdx]=state}getRuleStateIndex(){return this.states.length}shiftRuleState(){return this.states[this.statesIdx++]}addAnnot(annot){if(!this.newAnnots)this.newAnnots=[annot]
else this.newAnnots.push(annot)}bindRulesAndExecute(){if(this.unknownsCh){for(let i=0,s=this.unknownsCh.length;i<s;){this.xBindAndExec(this.unknownsCh[i++],this.unknownsCh[i++])}}this.forEach(this.xBindAndExec,this)
this.currentChild=this.node.firstChild}xBindAndExec(rule,nodeOrAttr){if(nodeOrAttr.nodeType===Node.ELEMENT_NODE){let skNode=this.skNode.schemaDom.getSkNode(nodeOrAttr)
if(!skNode){skNode=new SkNode(rule,nodeOrAttr,this.skNode.schemaDom)
skNode.execRules(this.execOptions)}else if(skNode.rule!==rule){skNode.rule=rule
skNode.execRules(this.execOptions)}else if(this.execOptions.resetAll){skNode.execRules(this.execOptions)}rule.execActionsOnBinding(this,nodeOrAttr)}else if(rule instanceof SkRuleAttr){rule.execActionsOnBinding(this,nodeOrAttr)
if(rule.skMeta)rule.skMeta.onExecRules(this,rule,nodeOrAttr)}else{rule.execActionsOnBinding(this,nodeOrAttr)
if(rule.skMeta)rule.skMeta.onExecRules(this,rule,nodeOrAttr)}}}export var CARD;(function(CARD){function isAtLeastOne(card){return card==="1"||card==="+"}CARD.isAtLeastOne=isAtLeastOne
function isOptionnal(card){return card==="?"||card==="*"}CARD.isOptionnal=isOptionnal
function isRequired(card){return card==="1"||card==="+"}CARD.isRequired=isRequired
function isRepeatable(card){return card==="+"||card==="*"}CARD.isRepeatable=isRepeatable
function combineCard(c1,c2){if(c1==="1")return c2
if(c2==="1")return c1
if(c1==="*"||c2==="*")return"*"
if(c1==="?")return c2==="+"?"*":"?"
return c2==="?"?"*":"+"}CARD.combineCard=combineCard})(CARD||(CARD={}))
export var EPastePos;(function(EPastePos){EPastePos[EPastePos["none"]=0]="none"
EPastePos[EPastePos["before"]=1]="before"
EPastePos[EPastePos["replace"]=2]="replace"
EPastePos[EPastePos["after"]=4]="after"
EPastePos[EPastePos["anywhere"]=7]="anywhere"})(EPastePos||(EPastePos={}))

//# sourceMappingURL=schema.js.map