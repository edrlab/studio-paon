import{WED}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedCore.js"
import{BOX_NS,BoxModel,BoxWedlet}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/box.js"
import{EWedletEditMode,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
class BoxFilterModel extends BoxModel{initModel(cnf){super.initModel(cnf)
this.wedletClass=BoxFilterWedlet
this.entryName=cnf.getAttributeNS(BOX_NS,"entryName")
this.dict=[]
DOM.findNext(cnf,cnf,e=>{if(e instanceof Element){const v=e.getAttribute("value")
if(v)this.dict.push(v)}return false})}}WED.registerWedletModel("BoxFilter",BoxFilterModel)
class BoxFilterWedlet extends BoxWedlet{constructor(){super(...arguments)
this.values=[]}createElement(root){super.createElement(root)
this.editMode=EWedletEditMode.write
this.element.addEventListener("click",ev=>{const input=ev.composedPath()[0]
const val=input.getAttribute("value")
if(!val)return
const xa=XA.freeze(this.wedAnchor)
if(input.checked){const batch=this.wedMgr.docHolder.newBatch()
const jml=[{"":this.model.entryName},[val]]
if(this.isVirtual()){WEDLET.insertDatasFromDisplay(this,batch,jml)}else{batch.insertJml(XA.append(xa,this.values.length),jml)}batch.doBatch()}else{const offset=this.values.indexOf(val)
if(offset>=0){const xaAnc=this.values.length===1?this.wedParent.onChildEmptied(subXa=>XA.last(subXa)===this.xaPart):null
if(xaAnc){this.wedMgr.docHolder.newBatch().deleteSequence(xaAnc,1).doBatch()}else{const batch=this.wedMgr.docHolder.newBatch(XA.newRangeAround(xa))
let lastOffset=this.values.lastIndexOf(val)
while(lastOffset>offset){batch.deleteSequence(XA.append(xa,lastOffset),1)
lastOffset=this.values.lastIndexOf(val,lastOffset-1)}batch.deleteSequence(XA.append(xa,offset),1)
batch.doBatch()}}}input.classList.toggle("diff",false)})}bindAsVirtual(){const wasReal=!this.isVirtual()
super.bindAsVirtual()
if(wasReal){this.values.length=0
const root=this.element.shadowRoot
DOM.findNext(root,root,e=>{if(e instanceof Element&&e.hasAttribute("value"))e.checked=false
return false})}}xInsertChildWedlet(index,node,children,insertBefore){if(typeof node==="number"||children&&typeof children[0]==="number"){this.redrawFull()}else{const val=children&&children[0]
if(JML.jmlNode2name(node)===this.model.entryName&&typeof val==="string"&&this.model.dict.indexOf(val)>=0){this.values.splice(index,0,val)
const root=this.element.shadowRoot
DOM.findNext(root,root,e=>{if(e instanceof Element&&e.getAttribute("value")===val){e.checked=true
return true}return false})}else{this.values.splice(index,0,null)
super.xInsertChildWedlet(index,node,children,insertBefore)}}}deleteChildNodes(xaOffest,count){for(let i=0;i<count;i++){const val=this.values[xaOffest]
this.values.splice(xaOffest,1)
if(val!=null){const root=this.element.shadowRoot
DOM.findNext(root,root,e=>{if(e instanceof Element&&e.getAttribute("value")===val){e.checked=false
return true}return false})}else{super.deleteChildNodes(xaOffest,1)}}if(this.customAdjust)this.customAdjust.emit(this)}isEmpty(){return this.values.length===0&&super.isEmpty()}refreshEditMode(){const old=this.editMode
super.refreshEditMode()
if(old===this.editMode)return
this.setDisabled(this.editMode!==EWedletEditMode.write)}setDisabled(disabled){const root=this.element.shadowRoot
DOM.findNext(root,root,e=>{if(e instanceof HTMLInputElement)e.disabled=disabled
return false})}onAddedSkAnnot(annot,xaTarget){var _a
if(((_a=WEDLET.diffLib)===null||_a===void 0?void 0:_a.isDiffAnnot(annot))&&annot.diffSession===this.wedMgr.docHolder.getDiffSession()){if(annot.type==="diffValue"){this.setDiff(annot.anchorNode.textContent)
this.setDiff(annot.otherValue)}else if(annot.type==="diffMark"){this.setDiff(annot.anchorNode.textContent)}else if(annot.type==="diffForeign"){this.setDiff(annot.foreignNode.textContent)}}}onRemovedSkAnnot(annot,xaTarget){var _a
if(((_a=WEDLET.diffLib)===null||_a===void 0?void 0:_a.isDiffAnnot(annot))&&annot.diffSession===this.wedMgr.docHolder.getDiffSession()){if(this.diffFilters){const root=this.element.shadowRoot
DOM.findNext(root,root,e=>{if(e instanceof Element&&e.hasAttribute("value"))e.classList.toggle("diff",false)
return false})
this.diffFilters=null}}}setDiff(val){const root=this.element.shadowRoot
DOM.findNext(root,root,e=>{if(e instanceof Element&&e.getAttribute("value")===val){e.classList.toggle("diff",true)
return true}return false});(this.diffFilters||(this.diffFilters=[])).push(val)}focusSkAnnot(annot){return false}}export class SetClassFromFilters{constructor(xpath,nsMap,prefixClass,values,upTo){this.nsMap=nsMap
this.prefixClass=prefixClass
this.values=values
this.upTo=upTo
this.xpath=(new XPathEvaluator).createExpression(xpath,this)
this.classes=values.map(v=>prefixClass+v)}createElement(wedlet,parent,insertBefore,slotName,caller){return document.createElement("x-filter")}refreshContent(wedlet){const res=this.result=this.xpath.evaluate(wedlet.content,XPathResult.ORDERED_NODE_ITERATOR_TYPE,this.result)
const excludes=new Set
for(let n=res.iterateNext();n;n=res.iterateNext())excludes.add(n.textContent)
let target=wedlet.element
for(let i=0;i<this.upTo;i++)target=target.parentElement
for(let i=0;i<this.classes.length;i++)target.classList.toggle(this.classes[i],excludes.has(this.values[i]))}onDelete(wedlet){let target=wedlet.element
for(let i=0;i<this.upTo;i++)target=target.parentElement
for(let i=0;i<this.classes.length;i++)target.classList.toggle(this.classes[i],false)}lookupNamespaceURI(prefix){return this.nsMap[prefix]}}
//# sourceMappingURL=boxFilter.js.map