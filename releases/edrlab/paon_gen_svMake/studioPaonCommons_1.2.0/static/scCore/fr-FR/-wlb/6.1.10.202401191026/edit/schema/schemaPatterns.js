import{FactoryRegistry,Serializable}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/serial.js"
import{DOM,ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{XmlDeleteMsg,XmlInsertMsg,XmlStrMsg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{CARD,EPastePos,Schema}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schema.js"
import{EAnnotLevel,EDirectiveType,EFuzzyType,SkAnnotAttrMissing,SkAnnotAttrUnknown,SkAnnotEltUnknown,SkAnnotMissing,SkAnnotTextForbidden,SkAnnotWrongValue}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaAnnots.js"
import{SkMatcherAnyAttr,SkMatcherAnyElt,SkMatcherAttr,SkMatcherComment,SkMatcherDoc,SkMatcherNode,SkMatcherText}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMatchers.js"
import{SKMETALIB}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMeta.js"
export class SkRule extends Serializable{initSkMeta(skMeta){this.skMeta=skMeta
return this}get card(){return"1"}set card(card){}findRuleNodeFor(node){return null}findRuleAttrFor(attr){return null}findRule(filter,includeDirectives){return filter(this)?this:null}findRules(filter,result){if(filter(this))(result||(result=[])).push(this)
return result}scanRules(filter,directives,includeDirectives){return filter(this)?this:null}buildRuleAfter(from,ctxCard="1"){const realCard=CARD.combineCard(this.card,ctxCard)
return CARD.isRepeatable(realCard)?this:SkRuleEmpty.SINGLETON}getRealCardSubRule(rule){return this===rule?this.card:undefined}isEltRemovable(elt){if(this.card==="+"){let sib=elt.previousElementSibling
if(sib&&this.structMatch(ENodeType.element,sib.nodeName))return true
sib=elt.nextElementSibling
if(sib&&this.structMatch(ENodeType.element,sib.nodeName))return true
return false}return CARD.isOptionnal(this.card)}findBestMatching(skCtx,matchMode=ESkMatchMode.all,contextCard="1"){}isMatching(skCtx){return false}execActions(skCtx,contextCard="1"){}xAppendInsertables(skCtx,listNodes,listAttrs){}getUnknownNodeRule(skNode,node){switch(node instanceof Node?node.nodeType:JML.jmlNode2nodeType(node)){case ENodeType.element:if(this.unknownEltRule){const rule=this.unknownEltRule.findRuleNodeFor(node)
if(rule)return rule}return skNode.schemaDom.schema.unknownEltRule.findRuleNodeFor(node)
case ENodeType.text:if(DOM.WHITESPACES.test(node instanceof Node?node.nodeValue:node)){return SkRuleTextWs.DEFAULT}if(this.forbiddenTextRule){const rule=this.forbiddenTextRule.findRuleNodeFor(node)
if(rule)return rule}return skNode.schemaDom.schema.forbiddenTextRule.findRuleNodeFor(node)
case ENodeType.comment:if(this.commentRule){const rule=this.commentRule.findRuleNodeFor(node)
if(rule)return rule}return skNode.schemaDom.schema.commentRule.findRuleNodeFor(node)}}getUnknownAttRule(skNode,attr){if(this.unknownAttrRule){const rule=this.unknownAttrRule.findRuleAttrFor(attr)
if(rule)return rule}return skNode.schemaDom.schema.unknownAttrRule.findRuleAttrFor(attr)}getRealCardSubNode(nodeType,nodeName){return this.structMatch(nodeType,nodeName)?this.card:undefined}checkSchemaOrder(eltName1,eltName2){return undefined}linkRules(map){return this}writeTo(o,mode){if(this.uniqueName!=null)o.un=this.uniqueName}readFrom(o,mode){if(o.un!=null)this.uniqueName=o.un
return this}toString(){return this.structName}static serialRefRule(r,mode){if(r.id!==undefined)return r.id
return Serializable.serialSerializable(r,mode)}static deserialRefRule(r,mode){if(typeof r==="number")return r
return Serializable.deserialSerializable(r,mode,SkRule.registry)}}SkRule.registry=new FactoryRegistry("SkRule")
var ESkMatchMode;(function(ESkMatchMode){ESkMatchMode[ESkMatchMode["all"]=0]="all"
ESkMatchMode[ESkMatchMode["ordered"]=1]="ordered"})(ESkMatchMode||(ESkMatchMode={}))
export class SkRuleNode extends SkRule{initContentRule(contentRule=SkRuleEmpty.SINGLETON){this.contentRule=contentRule
this.tmpCtRule=undefined
return this}initContentName(contentRule){this.tmpCtRule=contentRule
return this}linkRules(map){if(this.tmpCtRule===null)return this
if(this.tmpCtRule!==undefined)this.contentRule=map.resolveRule(this.tmpCtRule)
this.tmpCtRule=null
if(this.contentRule)this.contentRule=this.contentRule.linkRules(map)
return this}get structName(){return this.matcher.techName}createContent(childrenToAppend,attsToAppend,guardStack){}execActionsOnBinding(skCtx,node){}findRuleNodeFor(node){if(node instanceof Node)return this.matcher.matchNode(node.nodeType,node.nodeName)&&this.deepMatch(node)?this:null
return this.matcher.matchNode(JML.jmlNode2nodeType(node),JML.jmlNode2name(node))&&this.deepMatch(node)?this:null}isMatching(skCtx){const node=skCtx.currentChild
return node?this.matcher.matchNode(node.nodeType,node.nodeName):false}deepMatch(node){return true}indexPatterns(rulesIndex){if(Object.isFrozen(this))return
if(this.id===undefined){this.id=rulesIndex.length
rulesIndex.push(this)
if(this.contentRule)this.contentRule.indexPatterns(rulesIndex)}}}export class SkRuleDirective extends SkRule{constructor(){super(...arguments)
this._card="1"}initName(name){this.uniqueName=name
return this}initCard(card){this._card=card
return this}initSubRules(subRules){this.subRules=subRules
return this}initSubNames(subNames){this.tmpSubRules=subNames
return this}addSubName(subName){if(!this.tmpSubRules)this.tmpSubRules=[subName]
else this.tmpSubRules.push(subName)
return this}structMatch(nodeType,nodeName){for(let i=0,s=this.subRules.length;i<s;i++)if(this.subRules[i].structMatch(nodeType,nodeName))return true
return false}linkRules(map){if(this.tmpSubRules){this.subRules=this.tmpSubRules.map(r=>map.resolveRule(r))
this.tmpSubRules=undefined
this.subRules.forEach((r,i)=>{let rule=r.linkRules(map)
while(rule instanceof SkRuleDirective&&!rule.structLabel&&rule.subRules.length===1&&!rule.uniqueName&&!Object.isFrozen(rule)){this.setOverSubCard(i,this.overSubCard(i,rule.card))
rule=rule.subRules[0]}this.subRules[i]=rule})
if(this.subRules.length===1&&!this.structLabel){const rule=this.subRules[0]
if(!rule.uniqueName&&!Object.isFrozen(rule)){rule.card=CARD.combineCard(this.card,rule.card)
rule.uniqueName=this.uniqueName
return rule}}}return this}get card(){return this._card}set card(card){this._card=card}findRuleNodeFor(node){for(let i=0,s=this.subRules.length;i<s;i++){const found=this.subRules[i].findRuleNodeFor(node)
if(found)return found}return null}findRuleAttrFor(attr){for(let i=0,s=this.subRules.length;i<s;i++){const found=this.subRules[i].findRuleAttrFor(attr)
if(found)return found}return null}findRule(filter,includeDirectives){if(includeDirectives&&filter(this))return this
for(let i=0,s=this.subRules.length;i<s;i++){const result=this.subRules[i].findRule(filter,includeDirectives)
if(result!=null)return result}return null}findRules(filter,result){for(let i=0,s=this.subRules.length;i<s;i++){result=this.subRules[i].findRules(filter,result)}return result}scanRules(filter,directives,includeDirectives){if(includeDirectives&&filter(this))return this
directives.push(this)
for(let i=0,s=this.subRules.length;i<s;i++){const result=this.subRules[i].scanRules(filter,directives,includeDirectives)
if(result!=null)return result}directives.pop()
return null}getRealCardSubRule(rule){if(this===rule)return this.card
for(let i=0,s=this.subRules.length;i<s;i++){const card=this.subRules[i].getRealCardSubRule(rule)
if(card!=null)return CARD.combineCard(this.overSubCard(i,this.card),card)}return undefined}getRealCardSubNode(nodeType,nodeName){for(let i=0,s=this.subRules.length;i<s;i++){const subR=this.subRules[i]
if(subR.structMatch(nodeType,nodeName)){const subCard=subR.getRealCardSubNode(nodeType,nodeName)
return CARD.combineCard(this.card,this.overSubCard(i,subCard))}}return undefined}isEltRemovable(elt){switch(this.card){case"?":case"*":return true
case"+":return super.isEltRemovable(elt)
default:for(let i=0,s=this.subRules.length;i<s;i++){const subR=this.subRules[i]
if(subR.structMatch(ENodeType.element,elt.nodeName)){return subR.isEltRemovable(elt)}}console.trace("Should never occur")
return false}}checkSchemaOrder(eltName1,eltName2){for(let i=0,s=this.subRules.length;i<s;i++){const subR=this.subRules[i]
const inSub1=subR.structMatch(ENodeType.element,eltName1)
if(subR.structMatch(ENodeType.element,eltName2)){if(inSub1)return subR.checkSchemaOrder(eltName1,eltName2)
return undefined}else{if(inSub1)return undefined}}return undefined}overSubCard(i,contextCard){if(!this.subCards)return contextCard
const card=this.subCards[i]
if(!card)return contextCard
return CARD.combineCard(contextCard,card)}setOverSubCard(i,card){if(card=="1")return
if(!this.subCards)this.subCards=[]
this.subCards[i]=card}indexPatterns(rulesIndex){if(Object.isFrozen(this))return
if(this.id===undefined){this.id=rulesIndex.length
rulesIndex.push(this)
this.subRules.forEach(r=>{r.indexPatterns(rulesIndex)})}}writeTo(o,mode){super.writeTo(o,mode)
o.rules=this.subRules.map(r=>SkRule.serialRefRule(r,mode))
if(this.subCards!=null)o.cards=Serializable.serialArrayPrimitives(this.subCards,mode)
o.card=this._card}readFrom(o,mode){super.readFrom(o,mode)
if(o.un!=null)this.uniqueName=o.un
this.tmpSubRules=o.rules.map(m=>SkRule.deserialRefRule(m,mode))
if(o.cards!=null)this.subCards=o.cards
this._card=o.card
return this}}export class SkRuleDoc extends SkRuleNode{init(contentRule,skMeta=SKMETALIB.getMetaNode("/"),matcher=SkMatcherDoc.SINGLETON){this.contentRule=contentRule
this.matcher=matcher
this.skMeta=skMeta
return this}get structType(){return ENodeType.document}structMatch(nodeType,nodeName){return nodeType===ENodeType.document}findBestMatching(skCtx,matchMode,contextCard){throw Error("Should never be called!")}isMatching(skCtx){throw Error("Should never be called!")}execActions(skCtx,contextCard){throw Error("Should never be called!")}createContent(childrenToAppend,attsToAppend){this.contentRule.createContent(childrenToAppend,attsToAppend)}writeTo(o,mode){super.writeTo(o,mode)
if(this.matcher!==SkMatcherDoc.SINGLETON)o.matcher=Serializable.serialSerializable(this.matcher,mode)
o.ctRule=SkRule.serialRefRule(this.contentRule,mode)}readFrom(o,mode){super.readFrom(o,mode)
this.matcher=o.matcher?Serializable.deserialSerializable(this.matcher,mode,SkMatcherNode.registry):SkMatcherDoc.SINGLETON
this.tmpCtRule=SkRule.deserialRefRule(o.ctRule,mode)
return this}}SkRuleDoc.type="/"
SkRule.registry.register(SkRuleDoc)
export class SkRuleElt extends SkRuleNode{init(matcher,card="1",contentRule){this.matcher=matcher
this._card=card
this.contentRule=contentRule||SkRuleEmpty.SINGLETON
return this}get card(){return this._card}set card(card){this._card=card}get structType(){return this.matcher.isFuzzy()?EFuzzyType.elements:ENodeType.element}isMatching(skCtx){const node=skCtx.currentChild
return node?this.matcher.matchNode(node.nodeType,node.nodeName)&&this.deepMatch(node):false}isMatchNode(node){return this.matcher.matchNode(node.nodeType,node.nodeName)&&this.deepMatch(node)}isSameRoot(other){return this.matcher.startName===other.matcher.startName}deepMatch(node){return this.skMeta?this.skMeta.ruleMatch(this,node):true}createContent(childrenToAppend,attsToAppend,guardStack){if(guardStack&&this.noAutoComplete)return
if(this.matcher.isFuzzy())return this.matcher.startName
const elt={"":this.matcher.startName}
childrenToAppend.push(elt)
if(CARD.isRequired(this.contentRule.card)){const children=[]
if(guardStack){if(guardStack.indexOf(this)>=0)throw Error(`Infinite cycle in schema (with required cardinality): ${guardStack.join("/")}/${guardStack[0]}`)
guardStack.push(this)}else guardStack=[this]
this.contentRule.createContent(children,elt,guardStack)
if(children.length>0)childrenToAppend.push(children)
if(guardStack)guardStack.length--}}createNode(parent){const result=(parent.ownerDocument||parent).createElement(this.matcher.startName)
if(this.skMeta&&"onCreateNode"in this.skMeta)this.skMeta.onCreateNode(this,result)
return result}structMatch(nodeType,nodeName){return this.matcher.matchNode(nodeType,nodeName)}findBestMatching(skCtx,matchMode=ESkMatchMode.all,contextCard="1"){const repeatable=CARD.isRepeatable(CARD.combineCard(contextCard,this.card))
let found=0
switch(matchMode){case ESkMatchMode.all:{skCtx.forEachChild(ch=>{if((found==0||repeatable)&&this.isMatchNode(ch)){found++
skCtx.bindNodeToRule(ch,this)}else{skCtx.bindNodeToRule(ch,this.getUnknownNodeRule(skCtx.skNode,ch))}})
skCtx.forEachAttr(a=>{skCtx.bindAttrToRule(a,this.getUnknownAttRule(skCtx.skNode,a.nodeName))})
break}case ESkMatchMode.ordered:skCtx.forEachBindableChild(ch=>{if((found==0||repeatable)&&this.isMatchNode(ch)){found++
skCtx.bindNodeToRule(ch,this)}else return true})
break}skCtx.pushRuleState(found)}execActions(skCtx,contextCard="1"){const found=skCtx.shiftRuleState()
const card=CARD.combineCard(contextCard,this.card)
const opts=skCtx.execOptions
if(opts.list1InsertableNodesAt!==undefined){if(found===0||CARD.isRepeatable(card)){const min=skCtx.currentOffsetMin
const max=skCtx.getOffsetMaxAfterCurrent(found)
const insPoint1=opts.list1InsertableNodesAt
if(insPoint1===-1||min<=insPoint1&&max>=insPoint1){this.xAppendInsertables(skCtx,opts.insertableNodes1)}const insPoint2=opts.list2InsertableNodesAt
if(insPoint2>=0&&min<=insPoint2&&max>=insPoint2){this.xAppendInsertables(skCtx,opts.insertableNodes2)}}}if(opts.importContent&&(opts.importContent instanceof SkRule?this===opts.importContent:this.findRuleNodeFor(opts.importContent))){if("pasteOffsetMin"in opts){const minIns=skCtx.currentOffsetMin
const maxIns=skCtx.getOffsetMaxAfterCurrent(found)
const insBefore=opts.pasteOffsetMin>=minIns&&opts.pasteOffsetMin<=maxIns
const insAfter=opts.pasteOffsetMax>=minIns&&opts.pasteOffsetMax<=maxIns
if(insBefore||insAfter){if(opts.pasteOffsetMin===opts.pasteOffsetMax){opts.pastePos=EPastePos.replace}if(CARD.isRepeatable(card)){if(insBefore){opts.pastePos=insAfter?EPastePos.anywhere:EPastePos.before|EPastePos.replace}else{opts.pastePos=EPastePos.replace|EPastePos.after}}else if(found===0){opts.pastePos=insBefore?EPastePos.before:EPastePos.after}else{opts.pastePos=EPastePos.replace}}}else{if(CARD.isRepeatable(card)){opts.importPos={insertOffsetMin:skCtx.currentOffsetMin,insertOffsetMax:skCtx.getOffsetMaxAfterCurrent(found),replaceChildren:[skCtx.currentOffset]}
let n=skCtx.currentChild
for(let i=1;i<found;i++){n=n.nextElementSibling
opts.importPos.replaceChildren.push(DOM.computeOffset(n))}}else if(found>0){opts.importPos={replaceChildren:[skCtx.currentOffset]}}else{opts.importPos={insertOffsetMin:skCtx.currentOffsetMin,insertOffsetMax:skCtx.getOffsetMaxAfterCurrent(found)}}}}let addFindOffsetAfter
if(opts.findOffsetNodeType&&this.structMatch(opts.findOffsetNodeType,opts.findOffsetNodeName)){switch(opts.findOffsetInGroup||(CARD.isRepeatable(card)?opts.findOffsetIfExistAndCardN:"reject")){case"reject":opts.findOffset=found>0?-1:skCtx.currentOffsetMax
break
case"start":if(!("findOffset"in opts))opts.findOffset=skCtx.currentOffset
break
case"end":addFindOffsetAfter=true}}if(found===0){if(CARD.isRequired(card)){if(opts.autoComplete&&!this.noAutoComplete){const content=[]
this.createContent(content,null)
if(content.length>0)opts.corrections.push((new XmlInsertMsg).init(XA.append(XA.from(skCtx.node),skCtx.currentOffset),content))}else if(opts.genAnnots){skCtx.addAnnot((new SkAnnotMissing).init(SkAnnotMissing.TYPE_eltMissing,skCtx.node,skCtx.currentOffset,this))}}}else{for(let i=0;i<found;i++)skCtx.currentChild=skCtx.currentChild.nextSibling}if(addFindOffsetAfter)opts.findOffset=skCtx.currentOffsetMax}xAppendInsertables(skCtx,listNodes,listAttrs){if((listNodes===null||listNodes===void 0?void 0:listNodes.indexOf(this))<0&&this.skMeta.isInsertable(skCtx.skNode,this))listNodes.push(this)}writeTo(o,mode){super.writeTo(o,mode)
o.matcher=Serializable.serialSerializable(this.matcher,mode)
o.ctRule=SkRule.serialRefRule(this.contentRule,mode)
o.card=this.card}readFrom(o,mode){super.readFrom(o,mode)
this.matcher=Serializable.deserialSerializable(o.matcher,mode,SkMatcherNode.registry)
this.tmpCtRule=SkRule.deserialRefRule(o.ctRule,mode)
this._card=o.card
return this}}SkRuleElt.type="*"
SkRule.registry.register(SkRuleElt)
export class SkRuleEltUnknown extends SkRuleNode{initUnknown(matcher=SkMatcherAnyElt.SINGLETON,skMeta=SKMETALIB.getMetaNode("*")){this.matcher=matcher
this.contentRule=this
this.skMeta=skMeta
return this}get card(){return"?"}get structType(){return EFuzzyType.elements}structMatch(nodeType,nodeName){return this.matcher.matchNode(nodeType,nodeName)}findBestMatching(skCtx,matchMode=ESkMatchMode.all,contextCard="1"){skCtx.forEachChild(ch=>{skCtx.bindNodeToRule(ch,this.getUnknownNodeRule(skCtx.skNode,ch))})
skCtx.forEachAttr(a=>{skCtx.bindAttrToRule(a,this.getUnknownAttRule(skCtx.skNode,a.nodeName))})}execActionsOnBinding(skCtx,elt){if(skCtx.skNode.rule instanceof SkRuleEltUnknown)return
if(skCtx.execOptions.autoCleanup)skCtx.execOptions.corrections.push((new XmlDeleteMsg).init(XA.from(elt),1))
else if(skCtx.execOptions.genAnnots)skCtx.addAnnot((new SkAnnotEltUnknown).init(elt))}linkRules(){return this}writeTo(o,mode){if(this===SkRuleEltUnknown.DEFAULT)return
super.writeTo(o,mode)
o.matcher=this.matcher!==SkMatcherAnyElt.SINGLETON?Serializable.serialSerializable(this.matcher,mode):null
if(this.contentRule!==this)o.ctRule=SkRule.serialRefRule(this.contentRule,mode)}readFrom(o,mode){if(o.matcher===undefined)return SkRuleEltUnknown.DEFAULT
super.readFrom(o,mode)
this.matcher=o.matcher?Serializable.deserialSerializable(this.matcher,mode,SkMatcherNode.registry):SkMatcherAnyElt.SINGLETON
if(o.ctRule)this.tmpCtRule=SkRule.deserialRefRule(o.ctRule,mode)
else this.contentRule=this
return this}}SkRuleEltUnknown.type="*?"
SkRuleEltUnknown.DEFAULT=new SkRuleEltUnknown
SkRule.registry.register(SkRuleEltUnknown)
export function isSkRuleStr(rule){return rule&&"matchStr"in rule}export class SkRuleStr extends SkRuleNode{get structType(){return ENodeType.text}structMatch(nodeType,nodeName){return nodeType===ENodeType.text}get matcher(){return SkMatcherText.SINGLETON}buildRuleAfter(from,ctxCard="1"){return this}createContent(childrenToAppend,attsToAppend){childrenToAppend.push(this.getDefaultValue())}getDefaultValue(){return""}findBestMatching(skCtx,matchMode=ESkMatchMode.all,contextCard="1"){switch(matchMode){case ESkMatchMode.all:{skCtx.forEachChild(ch=>{if(ch.nodeType===ENodeType.text){skCtx.bindNodeToRule(ch,this)}else{skCtx.bindNodeToRule(ch,this.getUnknownNodeRule(skCtx.skNode,ch))}})
skCtx.forEachAttr(a=>{skCtx.bindAttrToRule(a,this.getUnknownAttRule(skCtx.skNode,a.nodeName))})
break}case ESkMatchMode.ordered:skCtx.forEachBindableChild(ch=>{if(ch.nodeType===ENodeType.text){skCtx.bindNodeToRule(ch,this)}else return true})}}execActions(skCtx,contextCard="1"){const opts=skCtx.execOptions
if(opts.list1InsertableNodesAt!==undefined){if(opts.insertableNodes1.indexOf(this)<0)opts.insertableNodes1.push(this)
if(opts.list2InsertableNodesAt>=0){if(opts.insertableNodes2.indexOf(this)<0)opts.insertableNodes2.push(this)}}let addFindOffsetAfter
if(opts.findOffsetNodeType&&this.structMatch(opts.findOffsetNodeType)){switch(opts.findOffsetIfExistAndCardN){case"reject":opts.findOffset=skCtx.currentChild instanceof Text?-1:0
break
case"start":if(!("findOffset"in opts))opts.findOffset=skCtx.currentOffset
break
case"end":addFindOffsetAfter=true}}if(opts.importContent){const impCt=opts.importContent
let isTxt=false
if(impCt instanceof SkRule)isTxt=impCt.structType===ENodeType.text
else if(impCt instanceof Node)isTxt=impCt.nodeType===ENodeType.text
else isTxt=typeof impCt==="string"
if(isTxt){if("pasteOffsetMin"in opts){opts.pastePos=EPastePos.anywhere}else{opts.importPos={insertOffsetMin:0,insertOffsetMax:skCtx.node.childNodes.length}}}}if(skCtx.currentChild instanceof Text){const first=skCtx.currentChild
if(opts.genAnnots)this._genAnnots(skCtx,contextCard)
if(opts.autoNormXml){do{let toMerge
while(skCtx.currentChild.nextSibling instanceof Text){skCtx.currentChild=skCtx.currentChild.nextSibling
if(!toMerge)toMerge=[skCtx.currentChild.nodeValue]
else toMerge.push(skCtx.currentChild.nodeValue)}skCtx.currentChild=skCtx.currentChild.nextSibling
let str
if(toMerge){const xaText=XA.from(first)
str=toMerge.join("")
if(str)opts.corrections.push((new XmlInsertMsg).init(XA.newBd(xaText).append(first.length).xa,str))
opts.corrections.push((new XmlDeleteMsg).init(XA.incrAtDepth(xaText,-1,1),toMerge.length))}else{if(opts.autoNormChars)skCtx.skNode.rule.skMeta.normChars(first,opts.corrections,false,null)}}while(skCtx.currentChild instanceof Text)}else{if(opts.autoNormChars)skCtx.skNode.rule.skMeta.normChars(skCtx.currentChild,opts.corrections)
skCtx.currentChild=skCtx.currentChild.nextSibling
while(skCtx.currentChild instanceof Text){if(opts.autoNormChars)skCtx.skNode.rule.skMeta.normChars(skCtx.currentChild,opts.corrections)
skCtx.currentChild=skCtx.currentChild.nextSibling}}}else{if(opts.genAnnots)this.validStr(null,contextCard,skCtx.node,skCtx)}if(addFindOffsetAfter)opts.findOffset=skCtx.currentOffsetMax}_genAnnots(skCtx,contextCard){this.validStr(skCtx.node.textContent,contextCard,skCtx.node,skCtx)}matchStr(str,contextCard){return true}validStr(str,contextCard,anchor,skCtx){}xAppendInsertables(skCtx,listNodes,listAttrs){if((listNodes===null||listNodes===void 0?void 0:listNodes.indexOf(this))<0)listNodes.push(this)}}export class SkRuleText extends SkRuleStr{get card(){return"*"}get structLabel(){return"Texte"}_genAnnots(skCtx,contextCard){}indexPatterns(rulesIndex){}writeTo(o,mode){}readFrom(o,mode){return SkRuleText.DEFAULT}}SkRuleText.type="#"
SkRuleText.DEFAULT=Object.freeze((new SkRuleText).linkRules(null))
SkRule.registry.register(SkRuleText)
export class SkRuleData extends SkRuleStr{get card(){return this._card||"1"}set card(card){this._card=card}initParams(wsType,dataParams){this.dataParams=dataParams
return this}isMatching(skCtx){const node=skCtx.currentChild
if(!node||!(node instanceof Text))return false
return this.evalStr(skCtx.node.textContent)}matchStr(str,contextCard){if(!str&&CARD.isOptionnal(CARD.combineCard(contextCard,this.card)))return true
return this.evalStr(str)}validStr(str,contextCard,anchor,skCtx){if(str==null){if(CARD.isRequired(CARD.combineCard(contextCard,this.card)))skCtx.addAnnot((new SkAnnotWrongValue).init(anchor,"Valeur obligatoire"))}else{this.annotStr(str,anchor,skCtx)}}getDefaultValue(){var _a
return((_a=this.dataParams)===null||_a===void 0?void 0:_a.defaultValue)||""}writeTo(o,mode){super.writeTo(o,mode)
o.dp=this.dataParams}readFrom(o,mode){super.readFrom(o,mode)
this.dataParams=o.dp
return this}static registerDataTypes(type,cst){SkRuleData.dataTypes[type]=cst}static newData(type,params){const Cst=SkRuleData.dataTypes[type]
if(Cst)return(new Cst).initParams(type,params)
return new SkRuleDataString}}SkRuleData.dataTypes={}
export class SkRuleDataString extends SkRuleData{evalStr(str){this.parseParams()
if(str.length<this.minLen||str.length>this.maxLen)return false
if(this.pattern&&!this.pattern.test(str))return false
return true}annotStr(str,anchor,skCtx){this.parseParams()
if(str.length<this.minLen){if(this.minLen===1){skCtx.addAnnot((new SkAnnotWrongValue).init(anchor,"Valeur obligatoire"))}else{skCtx.addAnnot((new SkAnnotWrongValue).init(anchor,`Valeur trop courte, inférieure à ${this.minLen} caractères`))}}else if(this.minLenWarn>0&&str.length<this.minLenWarn){skCtx.addAnnot((new SkAnnotWrongValue).init(anchor,`Valeur recommandée supérieur à ${this.minLenWarn} caractères`,EAnnotLevel.warning))}if(str.length>this.maxLen){skCtx.addAnnot((new SkAnnotWrongValue).init(anchor,`Valeur trop longue, supérieure à ${this.maxLen} caractères`))}else if(this.maxLenWarn>0&&str.length>this.maxLenWarn){skCtx.addAnnot((new SkAnnotWrongValue).init(anchor,`Valeur recommandée inférieur à ${this.maxLenWarn} caractères`,EAnnotLevel.warning))}if(this.pattern&&!this.pattern.test(str))skCtx.addAnnot((new SkAnnotWrongValue).init(anchor,this.patternMsg||`Valeur incorrecte (${this.pattern})`))
else if(this.patternWarn&&!this.patternWarn.test(str))skCtx.addAnnot((new SkAnnotWrongValue).init(anchor,this.patternWarnMsg||`Valeur non recommandée (${this.pattern})`,EAnnotLevel.warning))}parseParams(){if(this.minLen!==undefined)return
const params=this.dataParams||{}
this.minLen=params.minLength?Number.parseInt(params.minLength,10):0
this.maxLen=params.maxLength?Number.parseInt(params.maxLength,10):Number.MAX_SAFE_INTEGER
if(params.minLengthWarn)this.minLenWarn=Number.parseInt(params.minLengthWarn,10)
if(params.maxLengthWarn)this.maxLenWarn=Number.parseInt(params.maxLengthWarn,10)
if(params.pattern){this.pattern=new RegExp(params.pattern)
if(params.patternMsg)this.patternMsg=params.patternMsg}if(params.patternWarn){this.patternWarn=new RegExp(params.patternWarn)
if(params.patternWarnMsg)this.patternWarnMsg=params.patternWarnMsg}}}SkRuleDataString.type="#string"
SkRuleData.registerDataTypes("string",SkRuleDataString)
SkRule.registry.register(SkRuleDataString)
export class SkRuleDataToken extends SkRuleDataString{evalStr(str){return super.evalStr(DOM.txtNormToken(str))}annotStr(str,anchor,skCtx){super.annotStr(DOM.txtNormToken(str),anchor,skCtx)}}SkRuleDataToken.type="#token"
SkRuleData.registerDataTypes("token",SkRuleDataToken)
SkRule.registry.register(SkRuleDataToken)
export class SkRuleDataDecimal extends SkRuleData{initParams(wsType,dataParams){this.wsType=wsType
this.dataParams=dataParams
return this}evalStr(str){return this.valid(str)===true}valid(str){if(!str)return"required"
this.parseParams()
let val
switch(this.wsType){case"integer":case"long":case"int":if(!/^[+-]?\d+$/.test(str))return"invalid"
val=Number.parseInt(str,0)
break
case"decimal":if(!/^[+-]?((\d+\.?\d*)|(\d*\.\d+))$/.test(str))return"invalid"
val=Number.parseFloat(str)
const point=str.indexOf(".")
if(point>=0&&str.length-point-1>this.fractionDigits)return"frac"
break
case"float":if(!/^[+-]?((\d+\.?\d*)|(\d*\.\d+))([eE]((\d+\.?\d*)|(\d*\.\d+)))?$/.test(str))return"invalid"
val=Number.parseFloat(str)
break}if(val<this.minIncl)return"min"
if(val>this.maxIncl)return"max"
return true}annotStr(str,anchor,skCtx){switch(this.valid(str)){case true:return
case"required":skCtx.addAnnot((new SkAnnotWrongValue).init(anchor,"Valeur obligatoire"))
break
case"invalid":let t
switch(this.wsType){case"integer":case"long":case"int":t=`Valeur numérique entière incorrecte : ${str}`
break
case"decimal":t=`Valeur numérique décimale incorrecte : ${str}`
break
case"float":t=`Valeur numérique flottante incorrecte : ${str}`
break}skCtx.addAnnot((new SkAnnotWrongValue).init(anchor,t))
break
case"min":skCtx.addAnnot((new SkAnnotWrongValue).init(anchor,`Valeur trop petite : ${str} < ${this.minIncl}`))
break
case"max":skCtx.addAnnot((new SkAnnotWrongValue).init(anchor,`Valeur trop grande : ${str} > ${this.maxIncl}`))
break
case"frac":const fractionDigits=this.fractionDigits
const val=Number.parseFloat(str)
str=val.toLocaleString("fr")
skCtx.addAnnot((new SkAnnotWrongValue).init(anchor,`Valeur décimale trop fine (${fractionDigits} décimales maximum) : ${str}`))
break}}parseParams(){if(this.minIncl!==undefined)return
const params=this.dataParams||{}
this.fractionDigits=params.fractionDigits?Number.parseInt(params.fractionDigits,10):Number.POSITIVE_INFINITY
this.minIncl=params.minInclusive?Number.parseInt(params.minInclusive,10):this.wsType==="int"?-2147483648:Number.NEGATIVE_INFINITY
this.maxIncl=params.maxInclusive?Number.parseInt(params.maxInclusive,10):this.wsType==="int"?2147483647:Number.POSITIVE_INFINITY}}SkRuleDataDecimal.type="#decimal"
SkRuleData.registerDataTypes("decimal",SkRuleDataDecimal)
SkRuleData.registerDataTypes("integer",SkRuleDataDecimal)
SkRuleData.registerDataTypes("long",SkRuleDataDecimal)
SkRuleData.registerDataTypes("int",SkRuleDataDecimal)
SkRuleData.registerDataTypes("float",SkRuleDataDecimal)
SkRule.registry.register(SkRuleDataDecimal)
export class SkRuleDataDate extends SkRuleDataString{static validDate(str){if(!str)return"required"
if(!SkRuleDataDate.datePattern.test(str))return"invalid"
const d=new Date(str)
if(d.getDate()!==Number.parseInt(str.substring(8,10))||d.getMonth()+1!==Number.parseInt(str.substring(5,7))||d.getFullYear()!==Number.parseInt(str.substring(0,4)))return"non-exist"
return true}getDefaultValue(){var _a
if(((_a=this.dataParams)===null||_a===void 0?void 0:_a.defaultValue)==="#now")return(new Date).toISOString().split("T")[0]
return super.getDefaultValue()}evalStr(str){return SkRuleDataDate.validDate(str)===true}annotStr(str,anchor,skCtx){switch(SkRuleDataDate.validDate(str)){case true:return
case"required":skCtx.addAnnot((new SkAnnotWrongValue).init(anchor,"Valeur obligatoire"))
break
case"invalid":skCtx.addAnnot((new SkAnnotWrongValue).init(anchor,`Date au format YYYY-MM-JJ incorrecte : ${str}`))
break
case"non-exist":skCtx.addAnnot((new SkAnnotWrongValue).init(anchor,`Date inexistante dans le calendrier : ${str}`))
break}}}SkRuleDataDate.datePattern=/^\d{4}-\d{2}-\d{2}$/
SkRuleDataDate.type="#date"
SkRuleData.registerDataTypes("date",SkRuleDataDate)
SkRule.registry.register(SkRuleDataDate)
export class SkRuleValue extends SkRuleData{init(type,value){if(type==="token")this.dataType=type
this.value=value
return this}get structName(){return"'"+this.value+"'"}getDefaultValue(){return this.value}evalStr(str){if(this.dataType!=="token")return this.value===str
return this.value===str||this.value===DOM.txtNormToken(str)}validStr(str,contextCard,anchor,skCtx){this.annotStr(str,anchor,skCtx)}annotStr(str,anchor,skCtx){if(str==null)str=""
if(this.value===str)return
if(this.dataType==="token"){str=DOM.txtNormToken(str)
if(this.value===str)return}const val=this.value
skCtx.addAnnot((new SkAnnotWrongValue).init(anchor,`Valeur non autorisée (\'${val}\') : \'${str}\'`))}writeTo(o,mode){super.writeTo(o,mode)
if(this.dataType==="token")o.t="token"
o.v=this.value}readFrom(o,mode){super.readFrom(o,mode)
this.dataType=o.t
this.value=o.v
return this}}SkRuleValue.type="#v"
SkRule.registry.register(SkRuleValue)
export class SkRuleList extends SkRuleStr{get card(){return this._card||"1"}set card(card){this._card=card}matchStr(str,contextCard){console.trace("TODO SkRuleList.matchStr()")
return true}validStr(str,contextCard,anchor,skCtx){console.trace("TODO SkRuleList.validStr()")}parseValue(str){return str?str.trim().split(/\s+/):null}}SkRuleList.type="#l"
SkRule.registry.register(SkRuleList)
export class SkRuleTextWs extends SkRuleStr{execActionsOnBinding(skCtx,node){if(skCtx.execOptions.autoCleanup)skCtx.execOptions.corrections.push((new XmlDeleteMsg).init(XA.from(node),1))}readFrom(o,mode){return SkRuleTextWs.DEFAULT}}SkRuleTextWs.type="#!"
SkRuleTextWs.DEFAULT=Object.freeze(new SkRuleTextWs)
SkRule.registry.register(SkRuleTextWs)
export class SkRuleTextForbidden extends SkRuleStr{execActionsOnBinding(skCtx,node){if(skCtx.skNode.rule instanceof SkRuleEltUnknown)return
if(skCtx.execOptions.autoCleanup)skCtx.execOptions.corrections.push((new XmlDeleteMsg).init(XA.from(node),1))
else if(skCtx.execOptions.genAnnots)skCtx.addAnnot((new SkAnnotTextForbidden).init(node))}readFrom(o,mode){return SkRuleTextForbidden.DEFAULT}}SkRuleTextForbidden.type="#!"
SkRuleTextForbidden.DEFAULT=Object.freeze(new SkRuleTextForbidden)
SkRule.registry.register(SkRuleTextForbidden)
export class SkRuleComment extends SkRuleNode{get structType(){return ENodeType.comment}createContent(childrenToAppend,attsToAppend){childrenToAppend.push({"":JML.COMMENT})}structMatch(nodeType,nodeName){return nodeType===ENodeType.comment}get contentRule(){return SkRuleEmpty.SINGLETON}get matcher(){return SkMatcherComment.SINGLETON}get card(){return"*"}indexPatterns(rulesIndex){if(this===SkRuleComment.DEFAULT)return
super.indexPatterns(rulesIndex)}writeTo(o,mode){if(this===SkRuleComment.DEFAULT)return
super.writeTo(o,mode)
o.chk=null}readFrom(o,mode){if(o.chk===undefined)return SkRuleComment.DEFAULT
super.readFrom(o,mode)
return this}}SkRuleComment.type="!"
SkRuleComment.DEFAULT=new SkRuleComment
SkRule.registry.register(SkRuleComment)
export class SkRuleAttr extends SkRule{init(matcher,mandat=true,valueCheck){this.matcher=matcher
this.mandat=mandat
this.valueCheck=valueCheck
return this}initValueCheck(valueCheck){this.valueCheck=valueCheck
return this}initValueCheckByName(valueCheck){this.tmpValChk=valueCheck
return this}get structName(){return this.matcher.techName}structMatch(nodeType,nodeName){return nodeType===ENodeType.attribute&&(nodeName==null||this.matcher.matchAttr(nodeName))}get structType(){return this.matcher.isFuzzy()?EFuzzyType.attributes:ENodeType.attribute}createContent(childrenToAppend,attsToAppend){var _a
if(this.matcher.isFuzzy())return this.matcher.startName
attsToAppend[this.matcher.startName]=((_a=this.valueCheck)===null||_a===void 0?void 0:_a.getDefaultValue())||""}linkRules(map){if(this.tmpValChk!=null){this.valueCheck=map.resolveRule(this.tmpValChk)
this.tmpValChk=undefined}if(this.valueCheck)this.valueCheck.linkRules(map)
return this}get card(){return this.mandat?"1":"?"}set card(card){this.mandat=CARD.isRequired(card)}findRuleAttrFor(attr){return this.matcher.matchAttr(attr)?this:null}isMatching(skCtx){let match=false
skCtx.forEachBindableAttr(a=>{if(this.matcher.matchAttr(a.nodeName)){match=true
return true}})
return match}findBestMatching(skCtx,matchMode=ESkMatchMode.all,contextCard){let found
if(matchMode===ESkMatchMode.all){skCtx.forEachChild(ch=>{skCtx.bindNodeToRule(ch,this.getUnknownNodeRule(skCtx.skNode,ch))})
skCtx.forEachAttr(a=>{if(this.matcher.matchAttr(a.nodeName)){skCtx.bindAttrToRule(a,this)
found=a}else{skCtx.bindAttrToRule(a,this.getUnknownAttRule(skCtx.skNode,a.nodeName))}})}else{skCtx.forEachBindableAttr(a=>{if(this.matcher.matchAttr(a.nodeName)){skCtx.bindAttrToRule(a,this)
found=a}})}skCtx.pushRuleState(found)}execActions(skCtx,contextCard="1"){var _a
const opts=skCtx.execOptions
const attr=skCtx.shiftRuleState()
if(!attr){if(this.mandat){if(opts.autoComplete){opts.corrections.push((new XmlStrMsg).init(XA.append(XA.from(skCtx.node),this.matcher.startName),((_a=this.valueCheck)===null||_a===void 0?void 0:_a.getDefaultValue())||""))}else if(opts.genAnnots){skCtx.addAnnot((new SkAnnotAttrMissing).init(skCtx.node,this))}}if(opts.insertableAttrs)this.xAppendInsertables(skCtx,null,opts.insertableAttrs)}else{if(opts.insertableAttrs&&this.matcher.isFuzzy())this.xAppendInsertables(skCtx,null,opts.insertableAttrs)
if(this.valueCheck&&opts.genAnnots)this.valueCheck.validStr(attr.nodeValue,"1",attr,skCtx)
if(opts.autoNormChars&&this.skMeta)this.skMeta.normChars(attr,opts.corrections)}if(opts.findOffsetNodeType&&this.structMatch(opts.findOffsetNodeType,opts.findOffsetNodeName)){if(!opts.findOffsetNodeName){opts.findOffset=0}else{opts.findOffset=skCtx.node.hasAttribute(opts.findOffsetNodeName)?-1:0}}}execActionsOnBinding(skCtx,attr){}xAppendInsertables(skCtx,listNodes,listAttrs){if(listAttrs&&listAttrs.indexOf(this)<0&&this.skMeta.isInsertable(skCtx.skNode,this)){const elt=skCtx.node
if(!(elt instanceof Element)||this.matcher.isFuzzy()||!elt.hasAttribute(this.matcher.startName))listAttrs.push(this)}}indexPatterns(rulesIndex){if(Object.isFrozen(this))return
if(this.id===undefined){this.id=rulesIndex.length
rulesIndex.push(this)
if(this.valueCheck)this.valueCheck.indexPatterns(rulesIndex)}}writeTo(o,mode){super.writeTo(o,mode)
o.matcher=Serializable.serialSerializable(this.matcher,mode)
if(this.valueCheck!=null)o.chk=SkRule.serialRefRule(this.valueCheck,mode)
if(this.mandat)o.mandat=true}readFrom(o,mode){super.readFrom(o,mode)
this.matcher=Serializable.deserialSerializable(o.matcher,mode,SkMatcherAttr.registry)
if(o.chk)this.tmpValChk=SkRule.deserialRefRule(o.chk,mode)
this.mandat=o.mandat===true
return this}}SkRuleAttr.type="@"
SkRule.registry.register(SkRuleAttr)
export class SkRuleAttrUnknown extends SkRuleAttr{initUnknown(matcher=SkMatcherAnyAttr.SINGLETON,skMeta=SKMETALIB.getMetaNode("@")){this.matcher=matcher
this.skMeta=skMeta
return this}findBestMatching(skCtx,matchMode,contextCard){console.log("findBestMatching::SkRuleAttrUnknown:",skCtx)}execActions(skCtx,contextCard){}execActionsOnBinding(skCtx,attr){if(skCtx.skNode.rule instanceof SkRuleEltUnknown)return
if(skCtx.execOptions.autoCleanup)skCtx.execOptions.corrections.push((new XmlStrMsg).init(XA.from(attr),null))
else if(skCtx.execOptions.genAnnots)skCtx.addAnnot((new SkAnnotAttrUnknown).init(attr))}writeTo(o,mode){if(this===SkRuleAttrUnknown.DEFAULT)return
super.writeTo(o,mode)
if(this.matcher!=SkMatcherAnyAttr.SINGLETON)o.matcher=Serializable.serialSerializable(this.matcher,mode)
if(this.valueCheck!=null)o.chk=SkRule.serialRefRule(this.valueCheck,mode)
o.mandat=this.mandat}readFrom(o,mode){if(o.mandat===undefined)return SkRuleAttrUnknown.DEFAULT
super.readFrom(o,mode)
if(o.matcher)this.matcher=Serializable.deserialSerializable(o.matcher,mode,SkMatcherAttr.registry)
if(o.chk)this.tmpValChk=SkRule.deserialRefRule(o.chk,mode)
this.mandat=o.mandat===true
return this}}SkRuleAttrUnknown.type="@?"
SkRuleAttrUnknown.DEFAULT=new SkRuleAttrUnknown
SkRule.registry.register(SkRuleAttrUnknown)
export class SkRuleChoice extends SkRuleDirective{get structName(){if(!this._builtName){const buf=["("]
this.subRules.forEach((r,i)=>{const card=CARD.combineCard(this.overSubCard(i,"1"),r.card)
if(card!=="1"){buf.push(r.structName,card,"|")}else{buf.push(r.structName,"|")}})
buf[buf.length-1]=")"
this._builtName=buf.join("")}return this._builtName}get structType(){return EDirectiveType.choice}initAutoCreate(v){this.autoCreate=v==="first"?"first":undefined
return this}initDefaultValue(d){if(d)this.defaultValue=d
return this}findBestMatching(skCtx,matchMode=ESkMatchMode.all,contextCard="1"){const card=CARD.combineCard(contextCard,this.card)
const stateIdx=skCtx.reserveRuleState()
let found=this.xFindBestMatchingSub(skCtx,card)
if(matchMode===ESkMatchMode.all){while(skCtx.currentChild){skCtx.bindUnknownNodeToRuleAndReset(skCtx.currentChild,this.getUnknownNodeRule(skCtx.skNode,skCtx.currentChild),stateIdx)
found=this.xFindBestMatchingSub(skCtx,card)}skCtx.forEachBindableAttr(a=>{skCtx.bindAttrToRule(a,this.getUnknownAttRule(skCtx.skNode,a.nodeName))})}skCtx.setRuleState(stateIdx,found)}xFindBestMatchingSub(skCtx,card){let found
repeat:do{for(let i=0;i<this.subRules.length;i++){const rule=this.subRules[i]
if(rule.isMatching(skCtx)){if(!found)found=[rule,skCtx.currentChild]
else found.push(rule,skCtx.currentChild)
rule.findBestMatching(skCtx,ESkMatchMode.ordered,this.overSubCard(i,card))
found.push(skCtx.currentOffsetMax)
continue repeat}}break}while(CARD.isRepeatable(card))
return found}isMatching(skCtx){for(let i=0;i<this.subRules.length;i++){if(this.subRules[i].isMatching(skCtx))return true}return false}execActions(skCtx,contextCard="1"){const card=CARD.combineCard(contextCard,this.card)
const found=skCtx.shiftRuleState()
const opts=skCtx.execOptions
const list1InsertableNodesAt=opts.list1InsertableNodesAt
const insertableAttrs=opts.insertableAttrs
const importContent=opts.importContent
let addFindOffsetAfter
if(found==null||CARD.isRepeatable(card)){if(list1InsertableNodesAt!==undefined){const offsetMin=skCtx.currentOffsetMin
const offsetMax=found?found[found.length-1]:skCtx.currentOffsetMax
if(list1InsertableNodesAt===-1||offsetMin<=list1InsertableNodesAt&&offsetMax>=list1InsertableNodesAt){this.xAppendInsertables(skCtx,opts.insertableNodes1)}const insPoint2=opts.list2InsertableNodesAt
if(insPoint2>=0&&offsetMin<=insPoint2&&offsetMax>=insPoint2){this.xAppendInsertables(skCtx,opts.insertableNodes2)}opts.list1InsertableNodesAt=undefined}if(insertableAttrs){this.xAppendInsertables(skCtx,null,insertableAttrs)
opts.insertableAttrs=null}if(opts.findOffsetNodeType&&this.structMatch(opts.findOffsetNodeType,opts.findOffsetNodeName)){switch(CARD.isRepeatable(card)?opts.findOffsetIfExistAndCardN:"reject"){case"reject":opts.findOffset=this.isInFound(found,opts.findOffsetNodeType,opts.findOffsetNodeName)?-1:skCtx.currentOffset
break
case"start":if(!("findOffset"in opts))opts.findOffset=skCtx.currentOffset
break
case"end":addFindOffsetAfter=true}}}if(importContent){const subCard=importContent instanceof SkRule?this.getRealCardSubRule(importContent):importContent instanceof Node?this.getRealCardSubNode(importContent.nodeType,importContent.nodeName):this.getRealCardSubNode(JML.jmlNode2nodeType(importContent),JML.jmlNode2name(importContent))
if(subCard!==undefined){if("pasteOffsetMin"in opts){if(opts.pasteOffsetMin>=skCtx.currentOffsetMin&&opts.pasteOffsetMax<=(found?found[found.length-1]:skCtx.getOffsetMaxAfterCurrent(0))){if(CARD.isRepeatable(subCard)){opts.pastePos=EPastePos.anywhere}else{opts.pastePos=EPastePos.replace}}}else{if(CARD.isRepeatable(subCard)){if(found){const maxOffset=found[found.length-1]
opts.importPos={insertOffsetMin:skCtx.currentOffsetMin,insertOffsetMax:maxOffset,replaceChildren:[skCtx.currentOffset]}
let n=skCtx.currentChild
for(let i=skCtx.currentOffset+1;i<maxOffset;i++){n=n.nextSibling
if(n.nodeType===ENodeType.element)opts.importPos.replaceChildren.push(i)}}else{opts.importPos={insertOffsetMin:skCtx.currentOffsetMin,insertOffsetMax:skCtx.currentOffsetMax}}}else if(found){opts.importPos={replaceChildren:[skCtx.currentOffset]}}else{opts.importPos={insertOffsetMin:skCtx.currentOffset,insertOffsetMax:skCtx.currentOffset}}}}opts.importContent=null}if(found==null){if(CARD.isRequired(card)){let genAn=opts.genAnnots
if(opts.autoComplete){if(!this.isStrChoice()){const content=[]
this.createContent(content,{})
if(content.length>0){opts.corrections.push((new XmlInsertMsg).init(XA.append(XA.from(skCtx.node),skCtx.currentOffset),content))
genAn=false}}}if(genAn){let i
if(skCtx.newAnnots&&this.isStrChoice()&&(i=skCtx.newAnnots.findIndex(e=>e instanceof SkAnnotTextForbidden))>=0){skCtx.newAnnots[i]=(new SkAnnotWrongValue).init(skCtx.node,"Valeur incorrecte")}else{skCtx.addAnnot((new SkAnnotMissing).init(SkAnnotMissing.TYPE_choiceMissing,skCtx.node,skCtx.currentOffset,this))}}}}else{for(let i=0;i<found.length;i=i+3){skCtx.currentChild=found[i+1]
found[i].execActions(skCtx,card)}}if(addFindOffsetAfter)opts.findOffset=skCtx.currentOffsetMax
if(list1InsertableNodesAt!==undefined)opts.list1InsertableNodesAt=list1InsertableNodesAt
if(insertableAttrs)opts.insertableAttrs=insertableAttrs
if(importContent)opts.importContent=importContent}isInFound(found,nodeType,nodeName){if(!found)return false
for(let i=0;i<found.length;i=i+3){if(found[i].structMatch(nodeType,nodeName))return true}return false}createContent(childrenToAppend,attsToAppend,guardStack){if(this.autoCreate==="first"&&this.subRules.length>0){const lenCh=childrenToAppend.length
const lenAtts=Object.getOwnPropertyNames(attsToAppend).length
for(let r of this.subRules){r.createContent(childrenToAppend,attsToAppend,guardStack)
if(lenCh!==childrenToAppend.length||lenAtts!==Object.getOwnPropertyNames(attsToAppend).length)break}}else if(this.subRules.length===1){const r=this.subRules[0]
if(CARD.isRequired(CARD.combineCard(this.overSubCard(0,"1"),r.card))){r.createContent(childrenToAppend,attsToAppend,guardStack)}}}getDefaultValue(){return this.defaultValue||""}xAppendInsertables(skCtx,listNodes,listAttrs){for(let i=0;i<this.subRules.length;i++){this.subRules[i].xAppendInsertables(skCtx,listNodes,listAttrs)}}isStrChoice(){if(this._isStrChoice===undefined)this._isStrChoice=this.findRule(r=>!isSkRuleStr(r))==null
return this._isStrChoice}matchStr(str,contextCard){const card=CARD.combineCard(contextCard,this.card)
for(let i=0;i<this.subRules.length;i++){if(this.subRules[i].matchStr(str,this.overSubCard(i,card)))return true}return false}validStr(str,contextCard,anchor,skCtx){if(!this.matchStr(str,contextCard)){if(!str){skCtx.addAnnot((new SkAnnotWrongValue).init(anchor,`Valeur obligatoire`))}else{skCtx.addAnnot((new SkAnnotWrongValue).init(anchor,this.structLabel?`Valeur incorrecte (${this.structLabel})`:`Valeur incorrecte`))}}}freezeRule(){this.isStrChoice()
Object.freeze(this)}}SkRuleChoice.type="|"
SkRuleChoice.ANY=new SkRuleChoice
SkRule.registry.register(SkRuleChoice)
export class SkRuleUGroup extends SkRuleDirective{get structName(){if(!this._builtName){const buf=["("]
this.subRules.forEach((r,i)=>{const card=this.overSubCard(i,"1")
if(card!=="1"){buf.push(r.structName,card,"&")}else{buf.push(r.structName,"&")}})
buf[buf.length-1]=")"
this._builtName=buf.join("")}return this._builtName}get structType(){return EDirectiveType.unorderedGroup}findBestMatching(skCtx,matchMode=ESkMatchMode.all,contextCard="1"){const card=CARD.combineCard(contextCard,this.card)
const stateIdx=skCtx.reserveRuleState()
let found=this.xFindBestMatchingSub(skCtx,card)
if(matchMode===ESkMatchMode.all){while(skCtx.currentChild){skCtx.bindUnknownNodeToRuleAndReset(skCtx.currentChild,this.getUnknownNodeRule(skCtx.skNode,skCtx.currentChild),stateIdx)
found=this.xFindBestMatchingSub(skCtx,card)}skCtx.forEachBindableAttr(a=>{skCtx.bindAttrToRule(a,this.getUnknownAttRule(skCtx.skNode,a.nodeName))})}skCtx.setRuleState(stateIdx,found)}xFindBestMatchingSub(skCtx,card){let found
if(CARD.isRequired(card)||this.isMatching(skCtx)){const countMatch=[]
eachNode:while(skCtx.currentChild){for(let i=0;i<this.subRules.length;i++){const rule=this.subRules[i]
const count=countMatch[i]||0
const ruleCard=this.overSubCard(i,card)
if(count==0||CARD.isRepeatable(CARD.combineCard(ruleCard,rule.card))){if(rule.isMatching(skCtx)){countMatch[i]=count+1
if(!found)found=[rule,skCtx.currentChild]
else found.push(rule,skCtx.currentChild)
rule.findBestMatching(skCtx,ESkMatchMode.ordered,ruleCard)
continue eachNode}}}break}if(found&&CARD.isRequired(card)){for(let i=0;i<this.subRules.length;i++){const rule=this.subRules[i]
const ruleCard=this.overSubCard(i,card)
if(!countMatch[i]&&CARD.isRequired(CARD.combineCard(ruleCard,rule.card))){found.push(rule,skCtx.currentChild)
rule.findBestMatching(skCtx,ESkMatchMode.ordered,ruleCard)}}}}if(CARD.isRepeatable(card)){eachNode:while(skCtx.currentChild){for(let i=0;i<this.subRules.length;i++){const rule=this.subRules[i]
if(rule.isMatching(skCtx)){if(!found)found=[rule,skCtx.currentChild]
else found.push(rule,skCtx.currentChild)
rule.findBestMatching(skCtx,ESkMatchMode.ordered,this.overSubCard(i,card))
continue eachNode}}break}}return found}isMatching(skCtx){if(!skCtx.currentChild)return false
for(let i=0;i<this.subRules.length;i++){if(this.subRules[i].isMatching(skCtx))return true}return false}execActions(skCtx,contextCard="1"){const card=CARD.combineCard(contextCard,this.card)
const opts=skCtx.execOptions
const found=skCtx.shiftRuleState()
if(opts.list1InsertableNodesAt!==undefined){console.log("TODO listInsertableNodes for SkRuleUGroup")}let addFindOffsetAfter
const importContent=opts.importContent
if(opts.findOffsetNodeType&&this.structMatch(opts.findOffsetNodeType,opts.findOffsetNodeName)){const structFound=this.isInFound(found,opts.findOffsetNodeType,opts.findOffsetNodeName)
if(!structFound||CARD.isRepeatable(card)){switch(CARD.isRepeatable(card)?opts.findOffsetIfExistAndCardN:"reject"){case"reject":opts.findOffset=structFound?-1:skCtx.currentOffset
break
case"start":if(!("findOffset"in opts))opts.findOffset=skCtx.currentOffset
break
case"end":addFindOffsetAfter=true}}}if(importContent){const subCard=importContent instanceof SkRule?this.getRealCardSubRule(importContent):importContent instanceof Node?this.getRealCardSubNode(importContent.nodeType,importContent.nodeName):this.getRealCardSubNode(JML.jmlNode2nodeType(importContent),JML.jmlNode2name(importContent))
if(subCard!==undefined){if("pasteOffsetMin"in opts){if(opts.pasteOffsetMin>=skCtx.currentOffsetMin&&opts.pasteOffsetMax<=skCtx.getOffsetMaxAfterCurrent(found?found.length/2:0)){if(CARD.isRepeatable(card)){opts.pastePos=EPastePos.anywhere}else{console.trace("TODO Si importContent isInFound, 0 ou 'replace' (si skCtx.currentChild est la même Rule que importContent) Sinon EPastePos.before | EPastePos.replace | EPastePos.after.")}}opts.importContent=null}else{if(CARD.isRepeatable(card)){opts.importPos={insertOffsetMin:skCtx.currentOffsetMin,insertOffsetMax:skCtx.getOffsetMaxAfterCurrent(found?found.length/2:0)}}else if(found){opts.importPos={replaceChildren:[skCtx.currentOffset]}}else{opts.importPos={insertOffsetMin:skCtx.currentOffset,insertOffsetMax:skCtx.currentOffset}}}}}if(found==null){if(opts.genAnnots&&CARD.isRequired(card)){skCtx.addAnnot((new SkAnnotMissing).init(SkAnnotMissing.TYPE_ugroupMissing,skCtx.node,skCtx.currentOffset,this))}}else{for(let i=0;i<found.length;i=i+2){skCtx.currentChild=found[i+1]
found[i].execActions(skCtx,card)}}if(addFindOffsetAfter)opts.findOffset=skCtx.currentOffsetMax
if(importContent)opts.importContent=importContent}isInFound(found,nodeType,nodeName){if(!found)return false
for(let i=0;i<found.length;i=i+2){if(found[i].structMatch(nodeType,nodeName))return true}return false}createContent(childrenToAppend,attsToAppend,guardStack){this.subRules.forEach((r,i)=>{if(CARD.isRequired(CARD.combineCard(this.overSubCard(i,"1"),r.card))){r.createContent(childrenToAppend,attsToAppend,guardStack)}})}xAppendInsertables(skCtx,listNodes,listAttrs){for(let i=0;i<this.subRules.length;i++){this.subRules[i].xAppendInsertables(skCtx,listNodes,listAttrs)}}}SkRuleUGroup.type="&"
SkRule.registry.register(SkRuleUGroup)
export class SkRuleGroup extends SkRuleDirective{get structName(){if(!this._builtName){const buf=["("]
this.subRules.forEach((r,i)=>{const card=this.overSubCard(i,"1")
if(card!=="1"){buf.push(r.structName,card,",")}else{buf.push(r.structName,",")}})
buf[buf.length-1]=")"
this._builtName=buf.join("")}return this._builtName}get structType(){return EDirectiveType.group}findBestMatching(skCtx,matchMode=ESkMatchMode.all,contextCard="1"){const card=CARD.combineCard(contextCard,this.card)
const stateIdx=skCtx.reserveRuleState()
let found
if(matchMode===ESkMatchMode.all){found=this.xFindBestMatchingSub(skCtx,card)
while(skCtx.currentChild){skCtx.bindUnknownNodeToRuleAndReset(skCtx.currentChild,this.getUnknownNodeRule(skCtx.skNode,skCtx.currentChild),stateIdx)
found=this.xFindBestMatchingSub(skCtx,card)}skCtx.forEachBindableAttr(a=>{skCtx.bindAttrToRule(a,this.getUnknownAttRule(skCtx.skNode,a.nodeName))})}else{found=this.xFindBestMatchingSub(skCtx,card)}skCtx.setRuleState(stateIdx,found)}buildRuleAfter(from,ctxCard="1"){const realCard=CARD.combineCard(this.card,ctxCard)
if(CARD.isRepeatable(realCard))return this
let result
if(this.rulesAfter){result=this.rulesAfter.get(from)
if(result)return result}else{this.rulesAfter=new Map}let i=0
let firstSubR
for(;i<this.subRules.length;i++){const subR=this.subRules[i]
if(subR.findRule(r=>r===from)){firstSubR=subR.buildRuleAfter(from,this.overSubCard(i,subR.card))
if(i===this.subRules.length-1)result=firstSubR
else if(firstSubR===SkRuleEmpty.SINGLETON&&i===this.subRules.length-2)result=this.subRules[this.subRules.length-1]
else{const rules=[]
if(firstSubR!==SkRuleEmpty.SINGLETON)rules.push(firstSubR)
for(i++;i<this.subRules.length;i++)rules.push(this.subRules[i])
result=(new SkRuleGroup).initSubRules(rules)}break}}if(!result)result=SkRuleEmpty.SINGLETON
this.rulesAfter.set(from,result)
return result}checkSchemaOrder(eltName1,eltName2){let pos1=null
let pos2=null
for(let i=0,s=this.subRules.length;i<s;i++){const subR=this.subRules[i]
if(pos1===null&&subR.structMatch(ENodeType.element,eltName1))pos1=i
if(pos2===null&&subR.structMatch(ENodeType.element,eltName2))pos2=i
if(pos1!==null&&pos2!==null){if(pos1===pos2)return subR.checkSchemaOrder(eltName1,eltName2)
return pos1<pos2}}return undefined}xFindBestMatchingSub(skCtx,card){let found
if(CARD.isRequired(card)||this.isMatching(skCtx)){const ch=skCtx.currentChild
if(ch){if(!found)found=[ch]
else found.push(ch)}for(let i=0;i<this.subRules.length;i++){this.subRules[i].findBestMatching(skCtx,ESkMatchMode.ordered,this.overSubCard(i,"1"))}}while(CARD.isRepeatable(card)&&this.isMatching(skCtx)){if(!found)found=[skCtx.currentChild]
else found.push(skCtx.currentChild)
for(let i=0;i<this.subRules.length;i++){this.subRules[i].findBestMatching(skCtx,ESkMatchMode.ordered,this.overSubCard(i,"1"))}}return found}isMatching(skCtx){for(let i=0;i<this.subRules.length;i++){const rule=this.subRules[i]
if(rule.isMatching(skCtx))return true
if(CARD.isRequired(this.overSubCard(i,rule.card)))return false}return false}execActions(skCtx,contextCard="1"){const card=CARD.combineCard(contextCard,this.card)
const opts=skCtx.execOptions
const found=skCtx.shiftRuleState()
let addFindOffsetAfter
if(found==null||CARD.isRepeatable(card)){if(opts.list1InsertableNodesAt!==undefined){const min=skCtx.currentOffsetMin
const max=skCtx.getOffsetMaxAfterCurrent(found?found.length:0)
const insPoint1=opts.list1InsertableNodesAt
if(insPoint1===-1||min<=insPoint1&&max>=insPoint1){this.xAppendInsertables(skCtx,opts.insertableNodes1)}const insPoint2=opts.list2InsertableNodesAt
if(insPoint2>=0&&min<=insPoint2&&max>=insPoint2){this.xAppendInsertables(skCtx,opts.insertableNodes2)}}if(opts.insertableAttrs){this.xAppendInsertables(skCtx,null,opts.insertableAttrs)}if(opts.findOffsetNodeType&&this.structMatch(opts.findOffsetNodeType,opts.findOffsetNodeName)){switch(CARD.isRepeatable(card)?opts.findOffsetIfExistAndCardN:"reject"){case"reject":opts.findOffset=found?-1:skCtx.currentOffset
break
case"start":if(!("findOffset"in opts))opts.findOffset=skCtx.currentOffset
break
case"end":addFindOffsetAfter=true}}}if(!found){if(CARD.isRequired(card)){this.subRules.forEach((r,i)=>{r.execActions(skCtx,this.overSubCard(i,"1"))})}else{const importContent=opts.importContent
if(importContent){const subCard=importContent instanceof SkRule?this.getRealCardSubRule(importContent):importContent instanceof Node?this.getRealCardSubNode(importContent.nodeType,importContent.nodeName):this.getRealCardSubNode(JML.jmlNode2nodeType(importContent),JML.jmlNode2name(importContent))
if(subCard!==undefined){if("pasteOffsetMin"in opts){if(opts.pasteOffsetMin>=skCtx.currentOffsetMin&&opts.pasteOffsetMax<=skCtx.currentOffsetMax){opts.pastePos=EPastePos.replace}}else{opts.importPos={insertOffsetMin:skCtx.currentOffsetMin,insertOffsetMax:skCtx.currentOffsetMax}}}}}}else if(skCtx.execOptions.findOffsetNodeType){const backup=opts.findOffsetInGroup
for(let i=0;i<found.length;i++){skCtx.currentChild=found[i]
opts.findOffsetInGroup="start"
this.subRules.forEach((r,i)=>{let found
const curr=skCtx.currentChild
if(curr&&r.structMatch(curr.nodeType,curr.nodeName)){opts.findOffsetInGroup=undefined
found=true}r.execActions(skCtx,this.overSubCard(i,"1"))
if(found)opts.findOffsetInGroup="start"})}opts.findOffsetInGroup=backup}else{for(let i=0;i<found.length;i++){skCtx.currentChild=found[i]
this.subRules.forEach((r,i)=>{r.execActions(skCtx,this.overSubCard(i,"1"))})}}if(addFindOffsetAfter)opts.findOffset=skCtx.currentOffsetMax}createContent(childrenToAppend,attsToAppend,guardStack){this.subRules.forEach((r,i)=>{if(CARD.isRequired(CARD.combineCard(this.overSubCard(i,"1"),r.card))){r.createContent(childrenToAppend,attsToAppend,guardStack)}})}xAppendInsertables(skCtx,listNodes,listAttrs){let i=0
if(listNodes)for(;i<this.subRules.length;i++){const rule=this.subRules[i]
const offs=listNodes.length
rule.xAppendInsertables(skCtx,listNodes,listAttrs)
if(listNodes.length>offs&&CARD.isRequired(rule.card))break}if(listAttrs)for(;i<this.subRules.length;i++){this.subRules[i].xAppendInsertables(skCtx,null,listAttrs)}}}SkRuleGroup.type=","
SkRule.registry.register(SkRuleGroup)
export class SkRuleEmpty extends SkRuleDirective{constructor(){super(...arguments)
this.subRules=SkRuleEmpty.EMPTY_RULES}get structName(){return""}get structType(){return EDirectiveType.empty}get structLabel(){return"Vide"}linkRules(map){return this}isMatching(skCtx){return!skCtx.currentChild&&(!(skCtx.node instanceof Element)||skCtx.node.attributes.length===0)}findBestMatching(skCtx,matchMode=ESkMatchMode.all,contextCard="1"){if(matchMode===ESkMatchMode.all){skCtx.forEachChild(ch=>{skCtx.bindNodeToRule(ch,this.getUnknownNodeRule(skCtx.skNode,ch))})
skCtx.forEachAttr(a=>{skCtx.bindAttrToRule(a,this.getUnknownAttRule(skCtx.skNode,a.nodeName))})}}indexPatterns(rulesIndex){}createContent(childrenToAppend,attsToAppend){}writeTo(o,mode){}readFrom(o,mode){return SkRuleEmpty.SINGLETON}}SkRuleEmpty.type="-"
SkRuleEmpty.EMPTY_RULES=Object.freeze([])
SkRuleEmpty.SINGLETON=Object.freeze(new SkRuleEmpty)
SkRule.registry.register(SkRuleEmpty)
export function initSkRuleDefaults(){if(!Object.isFrozen(SkRuleEltUnknown.DEFAULT)){Object.freeze(SkRuleEltUnknown.DEFAULT.initUnknown())
Object.freeze(SkRuleAttrUnknown.DEFAULT.initUnknown())
Object.freeze(SkRuleComment.DEFAULT.initSkMeta(SKMETALIB.getMetaNode("!")))
SkRuleChoice.ANY.initCard("*").initSubRules([(new SkRuleElt).init(SkMatcherAnyElt.SINGLETON,"*",SkRuleChoice.ANY).initSkMeta(SKMETALIB.getMetaNode("*")).linkRules(null),(new SkRuleAttr).init(SkMatcherAnyAttr.SINGLETON,false).initSkMeta(SKMETALIB.getMetaNode("@")),SkRuleText.DEFAULT]).freezeRule()}}export function getGenericSchema(){if(!genericSchema)genericSchema=new Schema((new SkRuleDoc).init(SkRuleChoice.ANY.subRules[0]))
return genericSchema}let genericSchema

//# sourceMappingURL=schemaPatterns.js.map