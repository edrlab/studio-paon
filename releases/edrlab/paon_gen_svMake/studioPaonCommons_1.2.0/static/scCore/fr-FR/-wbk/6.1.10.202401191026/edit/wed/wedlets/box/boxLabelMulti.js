import{WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{BoxLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
export class BoxLabelMulti extends BoxLabel{configWedletElt(tpl,wedlet){this.wedlet=wedlet
this.tpl=tpl
if(!tpl.labelAdjuster){const labels=[]
for(let ch=tpl.firstElementChild;ch;ch=ch.nextElementSibling){if(ch.localName==="label")labels.push(ch)}tpl.labels=labels
tpl.hostAtt=tpl.getAttribute("setHostAtt")
tpl.labelAdjuster=labelAdjust.bind(tpl,wedlet.model)}wedlet.wedParent.addCustomAdjust(tpl.labelAdjuster)}refreshBindValue(val){this.classList.toggle("virtual",this.wedlet.isVirtual())}}window.customElements.define("box-label-multi",BoxLabelMulti)
function labelAdjust(model,parent){let counter=0
parent.visitWedletChildren(0,Infinity,w=>{if(w.model.nodeName===model.nodeName&&w.model.nodeType===model.nodeType){let label=this.labels[counter]
if(label===undefined)label=this.labels[this.labels.length-1]
DOM.findNext(w.element.shadowRoot,null,n=>{if(n instanceof BoxLabelMulti&&n.tpl===this){DOM.setTextContent(n,label.textContent)
DOM.setAttr(n,"title",label.getAttribute("title"))
return true}return false})
if(this.hostAtt){let val=label.getAttribute("hostAtt")
if(val==null)val=this.labels[this.labels.length-1].getAttribute("hostAtt")
DOM.setAttr(w.element,this.hostAtt,val)}counter++}},WEDLET.VISITOPTIONS_includeVirtuals)}
//# sourceMappingURL=boxLabelMulti.js.map