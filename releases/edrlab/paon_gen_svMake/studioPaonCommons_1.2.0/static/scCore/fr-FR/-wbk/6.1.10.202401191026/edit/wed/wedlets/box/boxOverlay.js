import{IS_EltWedlet}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{BoxContainer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
export class BoxOverlay extends BoxContainer{constructor(){super()
this.domObs=new MutationObserver(mutations=>{this.refreshOverlay()})}configWedletElt(tpl,wedlet){super.configWedletElt(tpl,wedlet)
this.defaultElt=(this.shadowRoot||this).firstElementChild
while(this.defaultElt instanceof HTMLStyleElement)this.defaultElt=this.defaultElt.nextElementSibling
if(this.defaultElt instanceof HTMLSlotElement)this.defaultElt=null}onChildWedletsChange(){super.onChildWedletsChange()
this.refreshOverlay()}refreshOverlay(){this.domObs.disconnect()
let foundNotEmty=false
let firstInStack
for(let slot=DOM.findLastChild(this.shadowRoot||this,IS_slot);slot;slot=DOM.findPreviousSibling(slot,IS_slot)){const chs=slot.assignedNodes()
for(let i=chs.length-1;i>=0;i--){const ch=chs[i]
if(IS_EltWedlet(ch)){firstInStack=ch
if(foundNotEmty){DOM.setHidden(ch,true)}else if(!ch.wedlet.isEmpty()){DOM.setHidden(ch,false)
foundNotEmty=true}else{DOM.setHidden(ch,true)}}}}if(this.defaultElt){DOM.setHidden(this.defaultElt,foundNotEmty)}else if(!foundNotEmty&&firstInStack){DOM.setHidden(firstInStack,foundNotEmty)}for(let slot=DOM.findFirstChild(this.shadowRoot||this,IS_slot);slot;slot=DOM.findNextSibling(slot,IS_slot)){for(const ch of slot.assignedNodes()){if(IS_EltWedlet(ch))this.domObs.observe(ch,{attributes:true})}}}}function IS_slot(n){return n instanceof HTMLSlotElement}window.customElements.define("box-overlay",BoxOverlay)

//# sourceMappingURL=boxOverlay.js.map