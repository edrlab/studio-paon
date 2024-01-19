import{WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{BoxLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
export class BoxLabelCounter extends BoxLabel{configWedletElt(tpl,wedlet){this.wedlet=wedlet
this.tpl=tpl
if(!tpl.labelAdjuster){tpl.labelAdjuster=labelAdjust.bind(tpl,wedlet.model,this.buildReplace(tpl))}wedlet.wedParent.addCustomAdjust(tpl.labelAdjuster)}refreshBindValue(val){this.classList.toggle("virtual",this.wedlet.isVirtual())}buildReplace(tpl){const label=tpl.getAttribute("label")
return pos=>label.replace(/({#})/,pos.toString())}}window.customElements.define("box-label-counter",BoxLabelCounter)
function labelAdjust(model,labelBuilder,parent){let counter=0
parent.visitWedletChildren(0,Infinity,w=>{if(w.model.nodeName===model.nodeName&&w.model.nodeType===model.nodeType){counter++
DOM.findNext(w.element.shadowRoot,null,n=>{if(n instanceof BoxLabelCounter&&n.tpl===this){n.textContent=labelBuilder(counter)
return true}return false})}},WEDLET.VISITOPTIONS_includeVirtuals)}
//# sourceMappingURL=boxLabelCounter.js.map