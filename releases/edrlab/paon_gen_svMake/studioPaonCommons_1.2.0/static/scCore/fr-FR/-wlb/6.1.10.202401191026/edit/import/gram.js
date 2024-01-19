import{SkRuleElt,SkRuleEmpty,SkRuleStr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaPatterns.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{EGramLevelType,SkMCompo,SkMMeta,SkMPart}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMeta.js"
import{SkMInlExtLink,SkMPara,SkMSpan,SkMTxtCell,SkMTxtCol,SkMTxtRow,SkMTxtTable}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMetaTxt.js"
export function transposeGram(gram,dstRule,options){if(CHRONO)console.time("transposeGram")
const trspProv=options&&options.trspProv||GramTransposerProv.ROOT
const targetLevel=findTargetLevel(dstRule)
let from=gram
if(targetLevel>EGramLevelType.block&&gram.gramLevelType!==targetLevel){if(targetLevel===EGramLevelType.inline){if(options&&options.abortIfNotInline)return null
const it=gram.inlineSeq()
if(it.isEmpty())return null
from=new GramSequence(it)}else if(targetLevel===EGramLevelType.text){let it=gram.textSeq()
if(it.isEmpty()){it=gram.inlineSeq()
if(it.isEmpty())return null}from=new GramSequence(it)}}const sol=GramTrspBase.doTranspose(from,dstRule,trspProv)
if(CHRONO)console.timeEnd("transposeGram")
if(!sol||sol.nodes===undefined)return null
const result=DOM.sharedXmlDoc().createDocumentFragment()
sol.transposer.buildDst(sol,result)
if(DEBUG)console.log("transposeGram RESULT:::",sol.malus,DOM.debug(result))
return{node:result,malus:sol.malus}}function findTargetLevel(dstRule){if(!("gramLevelType"in dstRule)){let deepest=EGramLevelType.block
dstRule.findRule(r=>{if(r instanceof SkRuleElt){if(r.skMeta.gramLevelType>deepest)deepest=r.skMeta.gramLevelType}else if(r instanceof SkRuleStr){deepest=EGramLevelType.inline
return true}return false})
if(Object.isExtensible(dstRule))dstRule.gramLevelType=deepest}return dstRule.gramLevelType}export class GramS{get weight(){return 0}get gramLevelType(){return EGramLevelType.block}isEmpty(){return true}iterate(){return ITNULL}get allowInline(){return false}get allowParaSibling(){return false}get isParaSibling(){return false}subLevelSeq(){return this}inlineSeq(){return ITERABLE_EMPTY}textSeq(){return ITERABLE_EMPTY}addAsChild(parent){parent.append(this)
return this}addAfter(prev,parent){if(!prev){parent.prepend(this)}else{if(this.parent)this.rem()
this.parent=prev.parent
this.prevSib=prev
if(prev.nextSib){this.nextSib=prev.nextSib
this.nextSib.prevSib=this}else{this.nextSib=null
this.parent.lastSub=this}prev.nextSib=this}return this}addBefore(next,parent){if(!next){parent.append(this)}else{if(this.parent)this.rem()
this.parent=next.parent
this.nextSib=next
if(next.prevSib){this.prevSib=next.prevSib
this.prevSib.nextSib=this}else{this.prevSib=null
this.parent.firstSub=this}next.prevSib=this}return this}rem(){if(this.prevSib){this.prevSib.nextSib=this.nextSib}else{this.parent.firstSub=this.nextSib}if(this.nextSib){this.nextSib.prevSib=this.prevSib
this.nextSib=null}else{this.parent.lastSub=this.prevSib}if(this.prevSib)this.prevSib=null
this.parent=null
return this}asHtml(){const tpl=DOM.sharedHtmlDoc().createElement("template")
this.toHtml(tpl.content)
return tpl.innerHTML}normalize(){return this.nextSib}}export class Gram extends GramS{get weight(){let w=Gram.NODE_WEIGHT
for(let ch=this.firstSub;ch;ch=ch.nextSib)w+=ch.weight
return w}isEmpty(){return this.firstSub==null}*iterate(){for(let ch=this.firstSub;ch;ch=ch.nextSib)yield ch}inlineSeq(){return this._inline||(this._inline=new SubInlineIterable(this))}textSeq(){return this._text||(this._text=new SubTextIterable(this))}append(sub){if(sub.parent)sub.rem()
sub.parent=this
sub.prevSib=this.lastSub
sub.nextSib=null
if(this.lastSub)this.lastSub.nextSib=sub
else this.firstSub=sub
this.lastSub=sub
return this}prepend(sub){if(sub.parent)sub.rem()
sub.parent=this
sub.prevSib=null
sub.nextSib=this.firstSub
if(this.firstSub)this.firstSub.prevSib=sub
else this.lastSub=sub
this.firstSub=sub
return this}addSemantic(...term){if(!this.semantics)this.semantics=term
else this.semantics.push(...term)
return this}normalize(){let ch=this.firstSub
while(ch)ch=ch.normalize()
if(this.allowInline){ch=this.firstSub
while(ch){if(ch instanceof GramString){while(ch.nextSib instanceof GramString){ch.nextSib.value=ch.value+ch.nextSib.value
ch=ch.nextSib
ch.prevSib.rem()}}ch=ch.nextSib}}else if(this.allowParaSibling){wrapInlineInPara(this)}else{ch=this.firstSub
while(ch){const next=ch.nextSib
if(ch instanceof GramString)ch.rem()
ch=next}}return this.nextSib}childrenToHtml(p){for(let ch=this.firstSub;ch;ch=ch.nextSib)ch.toHtml(p)
return p}}Gram.NODE_WEIGHT=10
export class GramFragment extends Gram{constructor(){super(...arguments)
this.asInline=undefined}get allowInline(){return this.asInline===undefined?true:this.asInline}get allowParaSibling(){return this.asInline===undefined?true:!this.asInline}get weight(){let w=0
for(let ch=this.firstSub;ch;ch=ch.nextSib)w+=ch.weight
return w}get gramLevelType(){return this.firstSub?this.firstSub.gramLevelType:EGramLevelType.block}subLevelSeq(){return this._subLevel||(this._subLevel=new SubSubLevelIterable(this))}normalize(){this.asInline=normalizeInlineOrText(this)===EGramLevelType.inline
return super.normalize()}toHtml(p){this.childrenToHtml(p)}}function normalizeInlineOrText(ctn){let onlyInline=true
for(let ch=ctn.firstSub;ch;ch=ch.nextSib){const lev=ch.gramLevelType
if(lev!==EGramLevelType.inline){if(lev===EGramLevelType.metas)continue
onlyInline=false
break}}if(!onlyInline){wrapInlineInPara(ctn)
return EGramLevelType.text}return EGramLevelType.inline}function wrapInlineInPara(ctn){let ch=ctn.firstSub
while(ch){if(ch.gramLevelType===EGramLevelType.inline){if(ch instanceof GramString&&DOM.WHITESPACES.test(ch.value)){const next=ch.nextSib
ch.rem()
ch=next}else{const para=(new GramPara).addBefore(ch)
let next
do{next=ch.nextSib
para.append(ch)
ch=next}while(ch&&ch.gramLevelType===EGramLevelType.inline)
while(para.lastSub!==para.firstSub&&para.lastSub instanceof GramString&&DOM.WHITESPACES.test(para.lastSub.value)){para.lastSub.rem()}ch=next}continue}ch=ch.nextSib}}export class GramUnknown extends Gram{toHtml(p){p.appendChild(this.fragment)}}export class GramSection extends Gram{get allowParaSibling(){return true}get htmlTag(){return"section"}hasTitle(){for(let ch=this.firstSub;ch;ch=ch.nextSib)if(ch instanceof GramTitle)return true
return false}toHtml(p){this.childrenToHtml(p.appendChild(JSX.createElement("section",null)))}}export class GramParaSibling extends Gram{get gramLevelType(){return EGramLevelType.text}get isParaSibling(){return true}subLevelSeq(){return this._subLevel||(this._subLevel=new SubNoMetasIterable(this))}}export class GramPara extends GramParaSibling{get allowInline(){return true}get htmlTag(){return"p"}toHtml(p){this.childrenToHtml(p.appendChild(JSX.createElement("p",null)))}}export class GramList extends GramParaSibling{constructor(ordered){super()
this.ordered=ordered}get htmlTag(){return this.ordered?"ol":"ul"}get isEachEntryOnePara(){for(let li=this.firstSub;li;li=li.nextSib){if(li instanceof GramListEntry)if(!li.isOnePara)return false}return true}subLevelSeq(){return this._subLevel||(this._subLevel=new SubNoMetasSubLevelIterable(this))}toHtml(p){this.childrenToHtml(p.appendChild(this.ordered?JSX.createElement("ol",null):JSX.createElement("ul",null)))}}export class GramListEntry extends Gram{get gramLevelType(){return EGramLevelType.text}get htmlTag(){return"li"}get allowParaSibling(){return true}get isOnePara(){let countP=0
for(let ch=this.firstSub;ch;ch=ch.nextSib){if(ch.gramLevelType===EGramLevelType.metas)continue
if(ch instanceof GramPara){if(++countP>1)return false}else return false}return true}subLevelSeq(){return this._subLevel||(this._subLevel=new SubNoMetasIterable(this))}normalize(){if(this.parent&&!(this.parent instanceof GramList)){const newList=new GramList(false).addBefore(this)
let item=this
do{newList.append(item)
item=newList.nextSib}while(item instanceof GramListEntry)
newList.normalize()
return newList.nextSib}else{return super.normalize()}}toHtml(p){this.childrenToHtml(p.appendChild(JSX.createElement("li",null)))}}export class GramTable extends GramParaSibling{get htmlTag(){return"table"}toHtml(p){this.childrenToHtml(p.appendChild(JSX.createElement("table",null)))}subLevelSeq(){class SubIter{constructor(gr){this.gr=gr}isEmpty(){return this.iterate().next().done}*iterate(){for(let ch=this.gr.firstSub;ch;ch=ch.nextSib){if(ch instanceof GramTitle)yield ch
else if(ch instanceof GramRow)yield*ch.subLevelSeq().iterate()}}}return this._subLevel||(this._subLevel=new SubIter(this))}}export class GramCol extends Gram{get htmlTag(){return"col"}get gramLevelType(){return EGramLevelType.text}setWidthInPx(width){this.widthInPx=Math.max(10,parseFloat(width))
return this}toHtml(p){this.childrenToHtml(p.appendChild(JSX.createElement("col",{width:this.widthInPx>1?this.widthInPx:undefined})))}}export class GramRow extends Gram{get gramLevelType(){return EGramLevelType.text}get htmlTag(){return"tr"}subLevelSeq(){return this._subLevel||(this._subLevel=new SubNoMetasSubLevelIterable(this))}toHtml(p){this.childrenToHtml(p.appendChild(JSX.createElement("tr",null)))}}export class GramCell extends Gram{get htmlTag(){return"td"}get gramLevelType(){return EGramLevelType.text}get allowParaSibling(){return true}subLevelSeq(){return this._subLevel||(this._subLevel=new SubNoMetasIterable(this))}setSpans(row,col){if(row)this.spanRow=parseInt(row)||1
if(col)this.spanCol=parseInt(col)||1
return this}toHtml(p){this.childrenToHtml(p.appendChild(JSX.createElement("td",{rowspan:this.spanRow>1?this.spanRow:undefined,colspan:this.spanCol>1?this.spanCol:undefined})))}}export class GramPropSet extends Gram{get gramLevelType(){return EGramLevelType.metas}toHtml(p){this.childrenToHtml(p.appendChild(JSX.createElement("div",null)))}}export class GramPropList extends Gram{get gramLevelType(){return EGramLevelType.metas}toHtml(p){this.childrenToHtml(p.appendChild(JSX.createElement("div",null)))}}export class GramProp extends Gram{get gramLevelType(){return EGramLevelType.metas}get allowInline(){return true}get allowParaSibling(){return true}getStringValue(){if(this.firstSub instanceof GramString)return this.firstSub.value
return null}toHtml(p){p.appendChild(this.childrenToHtml(JSX.createElement("span",null)))}}export class GramTitle extends GramProp{get gramLevelType(){return EGramLevelType.text}get isParaSibling(){return true}toHtml(p){if(this.parent instanceof GramTable){p.appendChild(this.childrenToHtml(JSX.createElement("caption",null)))}else if(this.parent instanceof GramSection){let level=1
let gramP=this.parent.parent
while(level<6&&gramP&&gramP instanceof GramSection){level++
gramP=gramP.parent}const tag=p.appendChild(document.createElement("h"+level))
this.childrenToHtml(tag)}else{super.toHtml(p)}}}export class GramUrl extends GramProp{toHtml(p){if(p instanceof HTMLAnchorElement)p.href=this.getStringValue()}}export class GramInline extends Gram{constructor(htmlEquiv){super()
this.htmlEquiv=htmlEquiv}get gramLevelType(){return EGramLevelType.inline}get allowInline(){return true}subLevelSeq(){return this._subLevel||(this._subLevel=new SubNoMetasIterable(this))}toHtml(p){this.childrenToHtml(p.appendChild(document.createElement(this.htmlEquiv)))}}export class GramString extends GramS{constructor(value){super()
this.value=value}get weight(){return this.value.length}get gramLevelType(){return EGramLevelType.inline}toHtml(p){p.appendChild(document.createTextNode(this.value))}}export class GramSequence extends GramS{constructor(chList){super()
this.chList=chList}get gramLevelType(){const first=this.chList.iterate().next().value
return first?first.gramLevelType:EGramLevelType.block}get weight(){let w=0
for(const ch of this.chList.iterate())w+=ch.weight
return w}subLevelSeq(){return this._subLevel||(this._subLevel=new SubSeqLevelIter(this.chList))}inlineSeq(){return this._inline||(this._inline=new SubSeqInlineIter(this.chList))}textSeq(){return this._text||(this._text=new SubSeqTextIter(this.chList))}toHtml(p){for(const ch of this.chList.iterate())ch.toHtml(p)}}class SubSeqLevelIter{constructor(chList){this.chList=chList}isEmpty(){if(this.chList.isEmpty())return true
for(const s of this.chList.iterate())if(!s.subLevelSeq().isEmpty())return false
return true}*iterate(){for(const s of this.chList.iterate())yield*s.subLevelSeq().iterate()}}class SubSeqInlineIter{constructor(chList){this.chList=chList}isEmpty(){if(this.chList.isEmpty())return true
for(const s of this.chList.iterate())if(!s.inlineSeq().isEmpty())return false
return true}*iterate(){for(const s of this.chList.iterate())yield*s.inlineSeq().iterate()}}class SubSeqTextIter{constructor(chList){this.chList=chList}isEmpty(){if(this.chList.isEmpty())return true
for(const s of this.chList.iterate())if(!s.textSeq().isEmpty())return false
return true}*iterate(){for(const s of this.chList.iterate())yield*s.textSeq().iterate()}}export class GramNodeSol{constructor(rootRule,nodeRule,parent){this.rootRule=rootRule
this.nodeRule=nodeRule
this.parent=parent}get nextRule(){if(!("_nextRule"in this))this._nextRule=this.rootRule.buildRuleAfter(this.nodeRule)
return this._nextRule}}export class GramNodeSolNull extends GramNodeSol{constructor(nextRule){super(null,null)
this._nextRule=nextRule}}export class GramTransposerProv extends Map{transposersFor(gram){const trsps=this.get(gram.constructor)
return trsps?trsps[Symbol.iterator]():ITNULL}addTransposer(forGram,trsp){const v=this.get(forGram)
if(!v)this.set(forGram,[trsp])
else v.push(trsp)}}GramTransposerProv.ROOT=new GramTransposerProv
class GramTrspBase{static doTranspose(gram,target,trspProv){let best
if(gram.mapSols){best=gram.mapSols.get(target)
if(best)return Object.create(best)}else{gram.mapSols=new Map}if(target!==SkRuleEmpty.SINGLETON){for(const trsp of trspProv.transposersFor(gram)){best=GramTrspBase.best(best,trsp.transpose(gram,target,trspProv))
if(best&&best.malus===0)break}if(!best&&gram.gramLevelType<=findTargetLevel(target)){let subGram=gram
let malus=0
while(!best){malus+=Gram.NODE_WEIGHT
const subSeq=subGram.subLevelSeq()
if(subSeq.isEmpty())break
subGram=new GramSequence(subSeq)
for(const trsp of trspProv.transposersFor(subGram))best=GramTrspBase.best(best,trsp.transpose(subGram,target,trspProv))
if(best){best.gram=gram
best.malus+=malus}}}}if(!best)best={gram:gram,nodes:undefined,target:target,malus:gram.weight,transposer:GramTrspNone.SINGLETON}
gram.mapSols.set(target,best)
return Object.create(best)}static best(t1,t2){if(t1==null)return t2
if(t2==null)return t1
return t1.malus<=t2.malus?t1:t2}static addMalus(sol,malus){if(sol)sol.malus+=malus
return sol}static sumMalusSiblings(sol){let sum=0
while(sol){sum+=sol.malus
sol=sol.prevSibTrsp}return sum}static*iterInsertPoints(prevSibNode,prevSibTrsp){if(!prevSibNode&&!prevSibTrsp.prevSibTrsp)yield new GramNodeSolNull(prevSibTrsp.target||prevSibTrsp.nodes.nextRule)
else{for(let node=prevSibNode;node;node=node.parent)yield node
if(prevSibTrsp.prevSibTrsp)yield*GramTrspBase.iterInsertPoints(prevSibTrsp.prevSibNodeSol.parent,prevSibTrsp.prevSibTrsp)}}static*iterInsertPointsFromTop(prevSibNode,prevSibTrsp){if(!prevSibNode&&!prevSibTrsp.prevSibTrsp)yield new GramNodeSolNull(prevSibTrsp.target||prevSibTrsp.nodes.nextRule)
else{if(prevSibTrsp.prevSibTrsp)yield*GramTrspBase.iterInsertPointsFromTop(prevSibTrsp.prevSibNodeSol.parent,prevSibTrsp.prevSibTrsp)
if(prevSibNode){if(!prevSibNode.parent)yield prevSibNode
else{const stack=[]
for(let n=prevSibNode;n;n=n.parent)stack.push(n)
for(let i=stack.length-1;i>=0;i--)yield stack[i]}}}}buildDst(trsp,parentDst){const parentForCh=this.buildNode(trsp,trsp.nodes,parentDst)
if(trsp.child){if(!trsp.child.prevSibTrsp){trsp.child.transposer.buildDst(trsp.child,parentForCh)}else{const trsps=[]
for(let ch=trsp.child;ch;ch=ch.prevSibTrsp)trsps.push(ch)
for(let i=trsps.length-1;i>=0;i--){const ch=trsps[i]
if(ch.nodes!==undefined){ch.transposer.buildDst(ch,ch.prevSibNodeSol?ch.prevSibNodeSol.createdParentNode||parentForCh:parentForCh)}}}}}buildNode(trsp,nodeSol,parentDst){if(nodeSol==null)return parentDst
if(nodeSol.parent)parentDst=this.buildNode(trsp,nodeSol.parent,parentDst)
const node=nodeSol.nodeRule instanceof SkRuleElt?nodeSol.nodeRule.createNode(parentDst):nodeSol.nodeRule instanceof SkRuleStr?parentDst.ownerDocument.createTextNode(trsp.gram.value):null
if(node)parentDst.appendChild(node)
nodeSol.createdParentNode=parentDst
return node||parentDst}transposeChildren(gramParent,target,trspProv){if(!gramParent.firstSub)return null
let sol=GramTrspBase.doTranspose(gramParent.firstSub,target,trspProv)
for(let ch=gramParent.firstSub.nextSib;ch;ch=ch.nextSib){sol=this.transposeNextChild(ch,sol,trspProv)}return sol}transposeSeq(seq,target,trspProv){if(seq.isEmpty())return null
const it=seq.iterate()
let sol=GramTrspBase.doTranspose(it.next().value,target,trspProv)
for(let v=it.next();!v.done;v=it.next()){sol=this.transposeNextChild(v.value,sol,trspProv)}return sol}transposeNextChild(gram,prevSibTrsp,trspProv){let best
if(gram.gramLevelType>=prevSibTrsp.gram.gramLevelType){for(const insPoint of GramTrspBase.iterInsertPoints(prevSibTrsp.nodes,prevSibTrsp)){const newSol=GramTrspBase.doTranspose(gram,insPoint.nextRule,trspProv)
if(!best||best.malus>newSol.malus){newSol.prevSibTrsp=prevSibTrsp
newSol.prevSibNodeSol=insPoint
best=newSol
if(best.malus===0)break}}}else{for(const insPoint of GramTrspBase.iterInsertPointsFromTop(prevSibTrsp.nodes,prevSibTrsp)){const newSol=GramTrspBase.doTranspose(gram,insPoint.nextRule,trspProv)
if(!best||best.malus>newSol.malus){newSol.prevSibTrsp=prevSibTrsp
newSol.prevSibNodeSol=insPoint
best=newSol
if(best.malus===0)break}}}return best}findTrsp(gram,target,rootSelectRule,selectRule,throwRule,trspProv,parentSol,cycleGuard){let best
const subRules=target.findRules(rootSelectRule||selectRule)
if(subRules)for(let i=0;i<subRules.length;i++){const subRule=subRules[i]
if(subRule instanceof SkRuleElt){const chTrsp=this.transposeChildren(gram,subRule.contentRule,trspProv)
best=GramTrspBase.best(best,{gram:gram,transposer:this,malus:subRule.skMeta.computeGramBindingMalus(gram,subRule,GramTrspBase.sumMalusSiblings(chTrsp)),child:chTrsp,nodes:new GramNodeSol(target,subRule,parentSol)})
if(best.malus===0)return best}else if(subRule instanceof SkRuleStr){return{gram:gram,transposer:this,malus:0,nodes:new GramNodeSol(target,subRule,parentSol)}}}if(best||!throwRule)return best
if(!cycleGuard)cycleGuard=new Map
const subRulesThrow=target.findRules(throwRule)
if(subRulesThrow)for(let i=0;i<subRulesThrow.length;i++){const subRule=subRulesThrow[i]
const count=cycleGuard.get(subRule)||0
if(subRule instanceof SkRuleElt&&count<5){cycleGuard.set(subRule,count+1)
const trsp=this.findTrsp(gram,subRule.contentRule,null,selectRule,throwRule,trspProv,new GramNodeSol(target,subRule,parentSol),cycleGuard)
if(trsp){trsp.malus=CROSSED_NODE_MALUS+subRule.skMeta.computeGramBindingMalus(gram,subRule,trsp.malus)
if(trsp.malus===CROSSED_NODE_MALUS)return trsp
if(!best||best.malus>trsp.malus)best=trsp}}}return best}}class GramTrspNone extends GramTrspBase{transpose(gram,target,trspProv){return null}buildDst(trsp,parentDst){return parentDst}}GramTrspNone.SINGLETON=new GramTrspNone
class GramTrspFragment extends GramTrspBase{transpose(gram,target,trspProv){const chTrsp=this.transposeChildren(gram,target,trspProv)
if(!isSolFound(chTrsp))return null
return{gram:gram,nodes:null,target:target,malus:GramTrspBase.sumMalusSiblings(chTrsp),child:chTrsp,transposer:this}}}GramTransposerProv.ROOT.addTransposer(GramFragment,new GramTrspFragment)
class GramTrspFragmentWrapped extends GramTrspBase{transpose(gram,target,trspProv){if(!gram.firstSub||!gram.firstSub.nextSib)return null
const root=new GramSection
while(gram.firstSub)root.append(gram.firstSub)
try{const chTrsp=GramTrspBase.doTranspose(root,target,trspProv)
if(!isSolFound(chTrsp))return null
return{gram:gram,nodes:null,target:target,malus:CROSSED_NODE_MALUS+GramTrspBase.sumMalusSiblings(chTrsp),child:chTrsp,transposer:this}}finally{while(root.firstSub)gram.append(root.firstSub)}}}GramTransposerProv.ROOT.addTransposer(GramFragment,new GramTrspFragmentWrapped)
class GramTrspSequence extends GramTrspBase{transpose(gram,target,trspProv){const chTrsp=this.transposeSeq(gram.chList,target,trspProv)
if(!isSolFound(chTrsp))return null
return{gram:gram,nodes:null,target:target,malus:GramTrspBase.sumMalusSiblings(chTrsp),child:chTrsp,transposer:this}}}GramTransposerProv.ROOT.addTransposer(GramSequence,new GramTrspSequence)
class GramTrspPara extends GramTrspBase{transpose(gram,target,trspProv){return this.findTrsp(gram,target,null,rule=>rule.skMeta instanceof SkMPara,throwRule4ParaSibling,trspProv)}}GramTransposerProv.ROOT.addTransposer(GramPara,new GramTrspPara)
class GramTrspList extends GramTrspBase{transpose(gram,target,trspProv){const ruleId=gram.ordered?"OL":gram.isEachEntryOnePara?"SL":"UL"
let sol=this.findTrsp(gram,target,null,rule=>rule instanceof SkRuleElt&&rule.skMeta.id===ruleId,throwRule4ParaSibling,trspProv)
if(sol)return sol
const ruleId2=ruleId==="OL"?"UL":ruleId==="UL"?"OL":"UL"
sol=this.findTrsp(gram,target,null,rule=>rule instanceof SkRuleElt&&rule.skMeta.id===ruleId2,throwRule4ParaSibling,trspProv)
if(sol)return sol
const ruleId3=ruleId==="SL"?"OL":"SL"
return this.findTrsp(gram,target,null,rule=>rule instanceof SkRuleElt&&rule.skMeta.id===ruleId3,throwRule4ParaSibling,trspProv)}}GramTransposerProv.ROOT.addTransposer(GramList,new GramTrspList)
class GramTrspListEntry extends GramTrspBase{transpose(gram,target,trspProv){return this.findTrsp(gram,target,null,rule=>rule instanceof SkRuleElt&&rule.skMeta.id==="LI",null,trspProv)}}GramTransposerProv.ROOT.addTransposer(GramListEntry,new GramTrspListEntry)
class GramTrspList2Struct extends GramTrspBase{transpose(gram,target,trspProv){return this.findTrsp(gram,target,null,rule=>rule instanceof SkRuleElt&&rule.skMeta.asGramList==="list",rule=>!rule.skFamily&&(rule.skMeta instanceof SkMCompo||rule.skMeta instanceof SkMPart),trspProv)}}GramTransposerProv.ROOT.addTransposer(GramList,new GramTrspList2Struct)
class GramTrspListEntry2Struct extends GramTrspBase{transpose(gram,target,trspProv){return this.findTrsp(gram,target,null,rule=>rule instanceof SkRuleElt&&rule.skMeta.asGramList==="entry",null,trspProv)}}GramTrspListEntry2Struct.SINGLETON=new GramTrspListEntry2Struct
GramTransposerProv.ROOT.addTransposer(GramListEntry,GramTrspListEntry2Struct.SINGLETON)
class GramTrspListEntry2SL extends GramTrspBase{transpose(gram,target,trspProv){return this.findTrsp(gram,target,null,rule=>rule instanceof SkRuleElt&&rule.skMeta.id==="SLMember",null,trspProv)}transposeChildren(gramParent,target,trspProv){if(!gramParent.firstSub)return null
return super.transposeChildren(gramParent.firstSub,target,trspProv)}}GramTransposerProv.ROOT.addTransposer(GramListEntry,new GramTrspListEntry2SL)
class GramTrspTable extends GramTrspBase{transpose(gram,target,trspProv){return this.findTrsp(gram,target,null,rule=>rule.skMeta instanceof SkMTxtTable,throwRule4ParaSibling,trspProv)}}GramTransposerProv.ROOT.addTransposer(GramTable,new GramTrspTable)
class GramTrspCol extends GramTrspBase{transpose(gram,target,trspProv){return this.findTrsp(gram,target,null,rule=>rule.skMeta instanceof SkMTxtCol,null,trspProv)}buildNode(trsp,nodeSol,parentDst){const node=super.buildNode(trsp,nodeSol,parentDst)
if(nodeSol.nodeRule.skMeta instanceof SkMTxtCol){nodeSol.nodeRule.skMeta.setWidthInPx(nodeSol.nodeRule,node,trsp.gram.widthInPx||100)}return node}}GramTransposerProv.ROOT.addTransposer(GramCol,new GramTrspCol)
class GramTrspRow extends GramTrspBase{transpose(gram,target,trspProv){return this.findTrsp(gram,target,null,rule=>rule.skMeta instanceof SkMTxtRow,null,trspProv)}}GramTransposerProv.ROOT.addTransposer(GramRow,new GramTrspRow)
class GramTrspCell extends GramTrspBase{transpose(gram,target,trspProv){return this.findTrsp(gram,target,null,rule=>rule.skMeta instanceof SkMTxtCell,null,trspProv)}buildNode(trsp,nodeSol,parentDst){const node=super.buildNode(trsp,nodeSol,parentDst)
const skM=nodeSol.nodeRule.skMeta
if(skM instanceof SkMTxtCell){const gram=trsp.gram
if(gram.spanRow>1)skM.setRowSpan(nodeSol.nodeRule,node,gram.spanRow)
if(gram.spanCol>1)skM.setColSpan(nodeSol.nodeRule,node,gram.spanCol)}return node}}GramTransposerProv.ROOT.addTransposer(GramCell,new GramTrspCell)
class GramTrspInline extends GramTrspBase{transpose(gram,target,trspProv){return this.findTrsp(gram,target,null,rule=>rule.skMeta instanceof SkMSpan&&this.matchRuleFamily(gram,rule),null,trspProv)}matchRuleFamily(gram,rule){switch(gram.htmlEquiv){case"b":case"strong":return rule.skFamily==="b"||rule.skFamily==="strong"
case"i":case"em":return rule.skFamily==="i"||rule.skFamily==="em"
default:return rule.skFamily===gram.htmlEquiv}}}GramTransposerProv.ROOT.addTransposer(GramInline,new GramTrspInline)
class GramTrspSection extends GramTrspBase{transpose(gram,target,trspProv){return this.findTrsp(gram,target,rule=>rule.skFamily==="sub-level"||rule.skMeta instanceof SkMCompo,rule=>rule.skFamily==="sub-level",rule=>!rule.skFamily&&(rule.skMeta instanceof SkMCompo||rule.skMeta instanceof SkMPart),trspProv)}}GramTransposerProv.ROOT.addTransposer(GramSection,new GramTrspSection)
class GramTrspTitle extends GramTrspBase{transpose(gram,target,trspProv){return this.findTrsp(gram,target,null,rule=>rule.skFamily==="property/title",rule=>rule.skMeta instanceof SkMPart||rule.skMeta instanceof SkMCompo||rule.skMeta instanceof SkMMeta,trspProv)}}GramTransposerProv.ROOT.addTransposer(GramTitle,new GramTrspTitle)
class GramTrspTitle2Para extends GramTrspPara{transpose(gram,target,trspProv){return GramTrspTitle2Para.addMalus(super.transpose(gram,target,trspProv),Math.max(Gram.NODE_WEIGHT,gram.parent?gram.parent.weight/3:gram.weight/3))}}GramTransposerProv.ROOT.addTransposer(GramTitle,new GramTrspTitle2Para)
class GramTrspUrl extends GramTrspBase{transpose(gram,target,trspProv){return this.findTrsp(gram,target,null,rule=>rule.skFamily==="property/url",rule=>rule.skMeta instanceof SkMMeta,trspProv)||{gram:gram,target:target,nodes:undefined,malus:gram.weight,transposer:GramTrspNone.SINGLETON}}}GramTransposerProv.ROOT.addTransposer(GramUrl,new GramTrspUrl)
class GramTrspUrlUlink extends GramTrspBase{transpose(gram,target,trspProv){return this.findTrsp(gram,target,null,rule=>rule.skMeta instanceof SkMInlExtLink,null,trspProv)}buildDst(trsp,parentDst){if(parentDst instanceof Element)parentDst.setAttribute("url",trsp.gram.getStringValue()||"")}}GramTransposerProv.ROOT.addTransposer(GramUrl,new GramTrspUrlUlink)
class GramTrspString extends GramTrspBase{transpose(gram,target,trspProv){return this.findTrspString(gram,target,trspProv,new Set,null)}findTrspString(gram,target,trspProv,cycleGuard,parentSol){const subRule=target.findRule(rule=>rule instanceof SkRuleStr)
if(subRule)return{gram:gram,transposer:this,malus:0,nodes:new GramNodeSol(target,subRule,parentSol)}
const subNodes=target.findRules(rule=>rule instanceof SkRuleElt&&!(rule.skFamily==="property"||rule.skFamily==="property/url"))
if(subNodes)for(let i=0;i<subNodes.length;i++){const subNode=subNodes[i]
if(!cycleGuard.has(subNode)){cycleGuard.add(subNode)
const sol=this.findTrspString(gram,subNode.contentRule,trspProv,cycleGuard,new GramNodeSol(target,subNode,parentSol))
if(sol){sol.malus++
return sol}}}return null}}GramTransposerProv.ROOT.addTransposer(GramString,new GramTrspString)
class SubSubLevelIterable{constructor(gram){this.gram=gram}isEmpty(){for(let s=this.gram.firstSub;s;s=s.nextSib)if(!s.subLevelSeq().isEmpty())return false
return true}*iterate(){for(let s=this.gram.firstSub;s;s=s.nextSib){const subSeq=s.subLevelSeq()
if(!subSeq.isEmpty())yield*subSeq.iterate()}}}class SubNoMetasSubLevelIterable{constructor(gram){this.gram=gram}isEmpty(){for(let s=this.gram.firstSub;s;s=s.nextSib){if(s.gramLevelType!==EGramLevelType.metas&&!s.subLevelSeq().isEmpty())return false}return true}*iterate(){for(let s=this.gram.firstSub;s;s=s.nextSib){if(s.gramLevelType!==EGramLevelType.metas){const subSeq=s.subLevelSeq()
if(!subSeq.isEmpty())yield*subSeq.iterate()}}}}class SubInlineIterable{constructor(gram){this.gram=gram}isEmpty(){for(let s=this.gram.firstSub;s;s=s.nextSib){const level=s.gramLevelType
if(level===EGramLevelType.inline)return false
if(level!==EGramLevelType.metas&&!s.inlineSeq().isEmpty())return false}return true}*iterate(){for(let s=this.gram.firstSub;s;s=s.nextSib){const level=s.gramLevelType
if(level===EGramLevelType.inline)yield s
else if(level!==EGramLevelType.metas){const seq=s.inlineSeq()
if(!seq.isEmpty())yield*seq.iterate()}}}}class SubTextIterable{constructor(gram){this.gram=gram}isEmpty(){for(let s=this.gram.firstSub;s;s=s.nextSib){if(s.isParaSibling)return false
const level=s.gramLevelType
if(level!==EGramLevelType.metas&&level!==EGramLevelType.inline&&!s.textSeq().isEmpty())return false}return true}*iterate(){for(let s=this.gram.firstSub;s;s=s.nextSib){if(s.isParaSibling)yield s
else{const level=s.gramLevelType
if(level!==EGramLevelType.metas&&level!==EGramLevelType.inline){const seq=s.textSeq()
if(!seq.isEmpty())yield*seq.iterate()}}}}}class SubNoMetasIterable{constructor(gram){this.gram=gram}isEmpty(){for(let s=this.gram.firstSub;s;s=s.nextSib){if(s.gramLevelType!==EGramLevelType.metas)return false}return true}*iterate(){for(let s=this.gram.firstSub;s;s=s.nextSib){if(s.gramLevelType!==EGramLevelType.metas)yield s}}}function throwRule4ParaSibling(rule){return(!rule.skFamily||!rule.skFamily.startsWith("prop"))&&!(rule.skMeta instanceof SkMPara)}function isSolFound(sol){if(!sol)return false
while(sol){if(sol.nodes!==undefined)return true
sol=sol.prevSibTrsp}return true}const ITERABLE_EMPTY={isEmpty(){return true},iterate(){return ITNULL}}
const ITNULL={next(){return ITRESULT_DONE},[Symbol.iterator](){return ITNULL}}
const ITRESULT_DONE=Object.freeze({done:true,value:undefined})
const CROSSED_NODE_MALUS=1
const DEBUG=false
const CHRONO=false

//# sourceMappingURL=gram.js.map