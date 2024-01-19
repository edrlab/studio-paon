import{EAnnotLevel,SkAnnotBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaAnnots.js"
import{DOM,ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{XmlTypedHouse}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlTypedHouse.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{SkRuleAttr,SkRuleChoice,SkRuleDoc,SkRuleElt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaPatterns.js"
import{SkMatcherAnyAttr,SkMatcherAnyElt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMatchers.js"
import{XmlAddrState,XmlRangeState}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
var IS_element=DOM.IS_element
var IS_text=DOM.IS_text
export var EXmlDiffMode;(function(EXmlDiffMode){EXmlDiffMode[EXmlDiffMode["diff"]=0]="diff"
EXmlDiffMode[EXmlDiffMode["patch"]=1]="patch"})(EXmlDiffMode||(EXmlDiffMode={}))
export class XmlDiffSession{constructor(diffDoc,mode,root){this.diffDoc=diffDoc
this.mode=mode
this.root=root
this.diffFound=0}computeAnnots(schemaDom,annotsToAdd){for(let diff=this.diffDoc.documentElement.firstElementChild;diff;diff=diff.nextElementSibling){this.buildAnnots(diff,schemaDom,annotsToAdd,this.root?XA.findDomLast(this.root,schemaDom.nodeRoot):null)}this.annots=annotsToAdd}buildAnnots(diffElt,schemaDom,annotsToAdd,root){var _a
if(diffElt.namespaceURI!==DIFF_NS)return
const node=findDiffNode(diffElt.getAttribute("nodeXp")||diffElt.getAttribute("parentXp"),schemaDom.document)
if(node){if(root){if(diffElt.localName==="mixCt"){if(!DOM.isAncestor(root,node)){if(DOM.isAncestor(node,root)){const filter=n=>n.namespaceURI===DIFF_NS&&(n.localName==="val"||n.localName==="add"||n.localName==="rem"||n.localName==="attr"||n.localName==="replace"||n.localName==="mixCt")
for(let subDiff=DOM.findNext(diffElt,diffElt,filter);subDiff;subDiff=DOM.findNextUncle(subDiff,diffElt,filter)){this.buildAnnots(subDiff,schemaDom,annotsToAdd,null)}return}else{return}}}else{if(!DOM.isAncestor(root,node))return}}const skNode=schemaDom.getSkNode(node.nodeType===ENodeType.element?node:node.nodeType===ENodeType.attribute?node.ownerElement:node.parentNode)
if(!skNode){console.log("SkNode not found for:::",node)
return}let annot
switch(diffElt.localName){case"add":const insAfter=diffElt.getAttribute("insertAfterXp")
const offset=insAfter?DOM.computeOffset(findDiffNode(insAfter,node),-1)+1:0
annot=new DiffAnnotForeign(this,node).initForeignNode(skNode,offset,diffElt.firstElementChild||diffElt.firstChild)
this.diffFound++
break
case"rem":annot=new DiffAnnotMark(this,node)
this.diffFound++
break
case"val":annot=new DiffAnnotValue(this,node).initValue(diffElt.textContent)
this.diffFound++
break
case"attr":if(IS_element(node)){const currAtt=diffElt.getAttribute("lName")
const v=diffElt.getAttribute("value")
const newAttName=diffElt.getAttribute("newQName")
if(newAttName){const newAttNs=diffElt.getAttribute("newNs")
if(currAtt){const att=node.getAttributeNodeNS(diffElt.getAttribute("ns"),currAtt)
const a=new DiffAnnotReplace(this,att,node)
a.foreign.initForeignAtt(skNode,newAttNs,newAttName,v)
annot=a}else{annot=new DiffAnnotForeign(this,node).initForeignAtt(skNode,newAttNs,newAttName,v)}}else{const att=node.getAttributeNodeNS(diffElt.getAttribute("ns"),currAtt)
if(v!=null){annot=new DiffAnnotValue(this,att).initValue(v)}else{annot=new DiffAnnotMark(this,att)}}this.diffFound++}break
case"replace":const p=node instanceof Attr?node.ownerElement:node.parentNode
const an=new DiffAnnotReplace(this,node,p)
const foreign=diffElt.firstElementChild||diffElt.firstChild
if(IS_element(foreign)&&foreign.namespaceURI===DIFF_NS&&foreign.localName==="attrHolder"){for(let i=foreign.attributes.length-1;i>=0;i--){const att=foreign.attributes.item(i)
if(att.localName!="xmlns"&&att.prefix!=="xmlns"){an.foreign.initForeignAtt(schemaDom.getSkNode(p),att.namespaceURI,att.nodeName,att.value)
break}}}else{an.foreign.initForeignNode(schemaDom.getSkNode(p),DOM.computeOffset(node),foreign)}annot=an
this.diffFound++
break
case"mixCt":const mixAnnot=annot=new DiffAnnotMixCt(this,node).initRoot(skNode,diffElt)
const tw=diffElt.ownerDocument.createTreeWalker(diffElt)
while(tw.nextNode()){const n=tw.currentNode
if(IS_element(n)&&n.namespaceURI===DIFF_NS){switch(n.localName){case"mcDel":{const delNode=findDiffNode(n.getAttribute("nodeXp"),node)
if(!delNode)break
const subAnnot=IS_element(delNode)?new DiffAnnotInParaMark(this,delNode):new DiffAnnotStrMark(this,delNode).initRange(parseInt(n.getAttribute("start")),parseInt(n.getAttribute("end")))
addAnnot(subAnnot,schemaDom,annotsToAdd)
this.diffFound++
break}case"mcIns":{const annotCurrent=new DiffAnnotInject(this,findDiffNode(n.getAttribute("nodeXp"),node))
annotCurrent.initGap(parseInt(n.getAttribute("offset")))
const contentElt=DOM.findFirstChild(n,IS_element)!=null
const annotForeign=contentElt?new DiffAnnotMarkInForeignPara(mixAnnot.paraSession,null):new DiffAnnotStrMarkInForeignPara(mixAnnot.paraSession,null)
n.annotInMixCt=annotForeign
annotCurrent.initForeignAnnot(annotForeign)
addAnnot(annotCurrent,schemaDom,annotsToAdd)
this.diffFound++
break}case"mcUnwrapStart":{const subAnnot=new DiffAnnotWrapMark(this,findDiffNode(n.getAttribute("nodeXp"),node))
subAnnot.wrap="full"
addAnnot(subAnnot,schemaDom,annotsToAdd)
this.diffFound++
break}case"mcUnwrapEnd":break
case"mcWrap":{const annotCurrent=new DiffAnnotInject(this,findDiffNode(n.getAttribute("nodeXp"),node))
annotCurrent.initGap(parseInt(n.getAttribute("offset")))
const annotForeign=new DiffAnnotWrapMarkInForeignPara(mixAnnot.paraSession,null)
annotForeign.wrap="full"
n.annotInMixCt=annotForeign
annotCurrent.initForeignAnnot(annotForeign)
addAnnot(annotCurrent,schemaDom,annotsToAdd)
this.diffFound++
break}case"mcMoveEnd":{const subAnnot=new DiffAnnotWrapMark(this,findDiffNode(n.getAttribute("nodeXp"),node))
subAnnot.wrap="end"
addAnnot(subAnnot,schemaDom,annotsToAdd)
this.diffFound++
break}case"add":case"rem":case"val":case"attr":case"replace":const xp=n.getAttribute("nodeXp")||n.getAttribute("parentXp")
if(xp){if(xp.charAt(0)==="/"){this.buildAnnots(n,schemaDom,annotsToAdd,null)}else{switch(n.localName){case"rem":{const subAnnot=new DiffAnnotInParaMark(this,findDiffNode(xp,node))
addAnnot(subAnnot,schemaDom,annotsToAdd)
if(!(((_a=n.previousElementSibling)===null||_a===void 0?void 0:_a.localName)==="mcUnwrapStart"))this.diffFound++
break}case"add":{const annotCurrent=new DiffAnnotInject(this,findDiffNode(xp,node))
annotCurrent.initGap(parseInt(n.getAttribute("offset")))
const annotForeign=new DiffAnnotMarkInForeignPara(mixAnnot.paraSession,null)
n.annotInMixCt=annotForeign
annotCurrent.initForeignAnnot(annotForeign)
addAnnot(annotCurrent,schemaDom,annotsToAdd)
break}}}}break}}}break}if(annot){annotsToAdd.push(annot);(skNode.extAnnots||(skNode.extAnnots=[])).push(annot)}}}}function addAnnot(annot,schemaDom,annotsToAdd){annotsToAdd.push(annot)
const n=annot.anchorNode
const skNode=schemaDom.getSkNode(IS_text(n)?n.parentNode:n);(skNode.extAnnots||(skNode.extAnnots=[])).push(annot)}class ParaDiffSession{constructor(paraAnnot){this.mode=paraAnnot.diffSession.mode===EXmlDiffMode.patch?EXmlDiffMode.diff:EXmlDiffMode.patch
this.annots=[]}get diffFound(){return 0}computeAnnots(schemaDom,annotsToAdd){for(let a of this.annots){const skNode=schemaDom.getSkNode(a.anchorNode.parentNode)
if(skNode){(skNode.extAnnots||(skNode.extAnnots=[])).push(a)
annotsToAdd.push(a)}}}}export function findDiffNode(nodeXp,from){const absolute=nodeXp[0]==="/"
let node=absolute?from.ownerDocument||from:from
let xp=absolute?nodeXp.substring(1):nodeXp
nextPart:while(xp){if(xp.startsWith("@")){const r=/@(?:{(.*)})?(.*)/.exec(xp)
return r[1]?node.getAttributeNodeNS(r[1],r[2]):node.getAttributeNode(r[2])}let nextSlash=xp.indexOf("/")
let p
if(nextSlash>0){p=xp.substring(0,nextSlash)
xp=xp.substring(nextSlash+1)}else if(nextSlash===0){xp=xp.substring(1)
continue nextPart}else{p=xp
xp=null}let typeNode
let name
let idxCount
if(p.startsWith("*:")){typeNode=ENodeType.element
idxCount=p.indexOf("[",3)
if(idxCount>0){name=p.substring(2,idxCount)}else{idxCount=undefined
name=p.substring(2)}}else if(p.startsWith("#text")){typeNode=ENodeType.text
idxCount=5}else if(p.startsWith("#comment")){typeNode=ENodeType.comment
idxCount=8}else if(p.startsWith("#pi")){typeNode=ENodeType.pi
idxCount=3}let count=idxCount<p.length?parseInt(p.substring(idxCount+1,p.length-1)):1
for(let ch=node.firstChild;ch;ch=ch.nextSibling){if(ch.nodeType===typeNode&&(name===undefined||name===ch.localName)){if(--count===0){node=ch
continue nextPart}}}console.log("Node not found:::",nodeXp)
return null}return node}export function applyDiffs(on,diffs,onXpDepth){for(let i=diffs.length-1;i>=0;i--){const diff=diffs[i]
if(diff.type==="diffValue"){const target=XA.findDomLast(diff.start.slice(onXpDepth),on)
if(target)target.nodeValue=diff.otherValue
else console.log("applyDiff start not found",diff)}else if(diff.type==="diffMark"){const target=XA.findDomLast(diff.start.slice(onXpDepth),on)
if(target)if(target instanceof Attr)target.ownerElement.removeAttribute(target.nodeName)
else target.parentElement.removeChild(target)
else console.log("applyDiff start not found",diff)}else if(diff.type==="diffForeign"){const d=diff
const ctn=XA.findDomContainer(diff.start.slice(onXpDepth),on)
const offset=XA.last(diff.start)
if(ctn){if(ctn instanceof CharacterData){if(d.strValue)ctn.insertData(offset,d.strValue)
else{ctn.parentNode.insertBefore(on.ownerDocument.importNode(d.foreignNode,true),DOM.splitDomCharacterData(ctn,offset))}}else if(d.attName){if(ctn instanceof Element)ctn.setAttributeNS(d.attNs,d.attName,d.strValue)
else console.log("applyDiff invalid: attr can only be set on element",diff,ctn)}else{ctn.insertBefore(on.ownerDocument.importNode(d.foreignNode,true),ctn.childNodes.item(offset))}}else console.log("applyDiff start not found",diff)}else if(diff.type==="diffMix"){const target=XA.findDomLast(diff.start.slice(onXpDepth),on)
if(target){target.textContent=null
mixCtToForeign(diff.diffRoot,target)}else console.log("applyDiff start not found",diff)}else if(diff.type==="diffStrMark"){const txt=XA.findDomLast(diff.start.slice(onXpDepth),on)
if(txt instanceof CharacterData||txt instanceof Attr){txt.nodeValue=LANG.stringDelete(txt.nodeValue,diff.offsetStart,diff.len)}else console.log("applyDiff start not a Text or Attr",diff,txt)}else if(diff.type==="diffReplace"){const target=XA.findDomLast(diff.start.slice(onXpDepth),on)
if(target){target.parentElement.insertBefore(on.ownerDocument.importNode(diff.foreign.foreignNode,true),target)
target.parentElement.removeChild(target)}else console.log("applyDiff start not found",diff)}else if(!diff.type){}else{console.log("Unknown diff for apply on Node:",diff)}}}export function mixCtToForeign(from,target){if(from.namespaceURI===DIFF_NS){switch(from.localName){case"mcIns":{const contentElt=from.firstElementChild
if(contentElt){const a=from.annotInMixCt
a.anchorNode=target.appendChild(target.ownerDocument.importNode(contentElt,true))}else{const a=from.annotInMixCt
const text=from.textContent
const txtNode=target.lastChild&&IS_text(target.lastChild)?target.lastChild:target.appendChild(target.ownerDocument.createTextNode(""))
const start=txtNode.nodeValue.length
txtNode.appendData(text)
a.anchorNode=txtNode
a.initRange(start,start+text.length)}break}case"mcWrap":{mixCtToForeign(from.firstElementChild,target)
const a=from.annotInMixCt
if(a)a.anchorNode=target.lastChild
break}case"add":{target.appendChild(target.ownerDocument.importNode(from.firstElementChild,true))
const a=from.annotInMixCt
if(a)a.anchorNode=target.lastChild
break}case"mixCt":for(let ch=from.firstChild;ch;ch=ch.nextSibling)mixCtToForeign(ch,target)
break}}else if(IS_text(from)){if(target.lastChild&&IS_text(target.lastChild)){target.lastChild.appendData(from.nodeValue)}else{target.appendChild(target.ownerDocument.createTextNode(from.nodeValue))}}else{const sub=target.appendChild(target.ownerDocument.importNode(from,false))
for(let ch=from.firstChild;ch;ch=ch.nextSibling)mixCtToForeign(ch,sub)}}class DiffAnnotBase extends SkAnnotBase{constructor(diffSession,node){super()
this.diffSession=diffSession
this.anchorNode=node}get level(){return EAnnotLevel.diff}equals(other){return this===other}toJSON(){}}class DiffAnnotInGap extends DiffAnnotBase{get offset(){return this.gap?XA.last(this.gap.xAddr):undefined}initGap(offset){this.gap=(new XmlAddrState).init(null,null,XA.append(XA.fromNode(this.anchorNode),offset))}adjustBy(msg){if(this.gap)this.gap.update(msg)}}class DiffAnnotMark extends DiffAnnotBase{get type(){return DiffAnnotMark.TYPE}get level(){return this.diffSession.mode===EXmlDiffMode.diff?EAnnotLevel.diffadd:EAnnotLevel.diffrem}getLabel(){return this.diffSession.mode===EXmlDiffMode.diff?"Contenu ajouté":"Contenu supprimé"}}DiffAnnotMark.TYPE="diffMark"
class DiffAnnotInParaMark extends DiffAnnotMark{get level(){return this.diffSession.mode===EXmlDiffMode.diff?EAnnotLevel.diffaddHidden:EAnnotLevel.diffremHidden}}class DiffAnnotWrapMark extends DiffAnnotMark{get level(){return this.wrap==="end"?EAnnotLevel.diffHidden:this.diffSession.mode===EXmlDiffMode.diff?EAnnotLevel.diffaddHidden:EAnnotLevel.diffremHidden}getLabel(){if(this.wrap==="end")return"Fin de la balise encadrante déplacée"
return this.diffSession.mode===EXmlDiffMode.diff?"Balise encadrante ajoutée":"Balise encadrante supprimée"}}export class DiffAnnotForeign extends DiffAnnotInGap{constructor(diffSession,anchor){super(diffSession,anchor)}get type(){return DiffAnnotForeign.TYPE}get len(){return 0}get anchor(){return XA.from(this.anchorNode)}get start(){return XA.append(XA.from(this.anchorNode),this.attName||this.offset)}get level(){return this.diffSession.mode===EXmlDiffMode.diff?EAnnotLevel.diffrem:EAnnotLevel.diffadd}getLabel(){return this.diffSession.mode===EXmlDiffMode.diff?"Contenu supprimé":"Contenu ajouté"}initForeignNode(skNodeParent,offset,foreign){this.skNodeParent=skNodeParent
this.initGap(offset)
this.foreignNode=foreign
if(foreign instanceof CharacterData)this.strValue=foreign.nodeValue
return this}initForeignAtt(skNodeParent,attNs,attName,attValue){this.skNodeParent=skNodeParent
this.attName=attName
this.attNs=attNs
this.strValue=attValue
return this}createForeignHouse(customDoc){if(customDoc||this.foreignNode){let initDoc=customDoc
if(!initDoc){const doc=initDoc=DOM.newDomDoc()
if(initDoc.nodeType!==ENodeType.element){initDoc=doc.createDocumentFragment()}initDoc.appendChild(doc.importNode(this.foreignNode,true))}const rootRule=(new SkRuleDoc).init((new SkRuleChoice).initCard("*").initSubRules(this.skNodeParent.rule.contentRule.findRules(()=>true)))
return this.initHouse(initDoc,this.skNodeParent,rootRule)}const doc=DOM.newDomDoc()
const root=doc.appendChild(doc.createElementNS(DIFF_NS,"sd:attrHolder"))
root.setAttributeNS(this.attNs,this.attName,this.strValue)
return this.initHouse(doc,this.skNodeParent,DiffAnnotForeign.rootRuleForAtt)}initHouse(initDoc,skNodeParent,rootRule){return new XmlTypedHouse({initialDoc:initDoc,schema:skNodeParent.schemaDom.schema,schemaDomConfig:{rootRule:rootRule},buildOptions:{autoMutate:true,autoComplete:true,autoNormXml:true,autoNormChars:true,genAnnots:false}})}}DiffAnnotForeign.TYPE="diffForeign"
DiffAnnotForeign.rootRuleForAtt=(new SkRuleDoc).init((new SkRuleElt).init(SkMatcherAnyElt.SINGLETON,"1",(new SkRuleAttr).init(SkMatcherAnyAttr.SINGLETON,false)))
class DiffAnnotValue extends DiffAnnotBase{get type(){return DiffAnnotValue.TYPE}initValue(value){this.otherValue=value
return this}getLabel(){return"Valeur modifiée"}}DiffAnnotValue.TYPE="diffValue"
export class DiffAnnotReplace extends DiffAnnotBase{constructor(diffSession,anchor,anchorForForeign){super(diffSession,anchor)
this.foreign=new DiffAnnotForeign(diffSession,anchorForForeign)
this.inCurrent=new DiffAnnotMark(diffSession,anchor)}get type(){return DiffAnnotReplace.TYPE}getLabel(){return"Contenu remplacé"}}DiffAnnotReplace.TYPE="diffReplace"
class DiffAnnotMixCt extends DiffAnnotBase{get type(){return DiffAnnotMixCt.TYPE}initRoot(skNodePara,root){this.skNodePara=skNodePara
this.diffRoot=root
this.paraSession=new ParaDiffSession(this)
return this}getLabel(){return"Paragraphe modifié"}}DiffAnnotMixCt.TYPE="diffMix"
class DiffAnnotStrMark extends DiffAnnotBase{get offsetStart(){return XA.last(this.range.start)}get len(){return XA.last(this.range.end)-XA.last(this.range.start)}get type(){return DiffAnnotStrMark.TYPE}get level(){return this.diffSession.mode===EXmlDiffMode.diff?EAnnotLevel.diffaddHidden:EAnnotLevel.diffremHidden}getLabel(){return this.diffSession.mode===EXmlDiffMode.diff?"Texte ajouté":"Texte supprimé"}initRange(startRg,endRg){const start=XA.freeze(XA.append(XA.fromNode(this.anchorNode),startRg))
this.range=(new XmlRangeState).init(null,null,start,XA.setAtDepth(start,-1,endRg))
return this}adjustBy(msg){this.range.update(msg)}}DiffAnnotStrMark.TYPE="diffStrMark"
export class DiffAnnotInject extends DiffAnnotInGap{get type(){return DiffAnnotInject.TYPE}get level(){return EAnnotLevel.diffHidden}getLabel(){return""}initForeignAnnot(annotInForeign){this.annotInForeign=annotInForeign
annotInForeign.annotInCurrent=this
annotInForeign.diffSession.annots.push(annotInForeign)}}DiffAnnotInject.TYPE="diffInject"
export class DiffAnnotStrMarkInForeignPara extends DiffAnnotStrMark{}export class DiffAnnotMarkInForeignPara extends DiffAnnotMark{}export class DiffAnnotWrapMarkInForeignPara extends DiffAnnotWrapMark{}export const DIFF_NS="scenari.eu:diff:1.0"

//# sourceMappingURL=diff.js.map