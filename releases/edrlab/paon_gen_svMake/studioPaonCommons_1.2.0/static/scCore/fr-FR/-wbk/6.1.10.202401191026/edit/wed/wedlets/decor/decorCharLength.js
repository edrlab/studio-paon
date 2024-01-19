import{WedletFork}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
class DecorCharLength extends HTMLElement{configWedletElt(tpl,wedlet){this.wedlet=new DecorCharLengthWedlet(this,wedlet)
this.maxCharsAdvised=this.hasAttribute("max-chars-advised")?Number.parseInt(this.getAttribute("max-chars-advised")):-1
this.maxChars=this.hasAttribute("max-chars")?Number.parseInt(this.getAttribute("max-chars")):-1
this.throwPrefix=this.getAttribute("throw-prefix")
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
wedlet.wedMgr.reg.installSkin(this.localName,sr)
sr.appendChild(JSX.createElement("span",null,"..."))}refreshBindValue(val,children){this.wedlet.planComputeLength()}redraw(len){const target=this.shadowRoot.lastElementChild
if(this.maxChars!=-1&&len>this.maxChars){const max=this.maxChars
DOM.setTextContent(target,len+" / "+max)
DOM.setAttr(target,"title",`Cette chaîne de ${len} caractères dépasse les ${max} autorisés.`)
DOM.setAttr(this,"state","error")}else if(this.maxCharsAdvised>=0&&len>this.maxCharsAdvised){const max=this.maxCharsAdvised
DOM.setTextContent(target,len+" / "+max)
DOM.setAttr(target,"title",`Cette chaîne de ${len} caractères dépasse les ${max} conseillés.`)
DOM.setAttr(this,"state","warning")}else{DOM.setTextContent(target,len+" / "+(this.maxCharsAdvised>=0?this.maxCharsAdvised:this.maxChars))
DOM.setAttr(target,"title","")
DOM.setAttr(this,"state","")}}computeLen(node){if(node==null)return 0
if(node instanceof Attr)return node.value.length
let len=0
if(this.throwPrefix){const prefix=this.throwPrefix
const it=(node.ownerDocument||node).createTreeWalker(node,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT,{acceptNode(n){if(n instanceof Text)return NodeFilter.FILTER_ACCEPT
return n.prefix===prefix?NodeFilter.FILTER_SKIP:NodeFilter.FILTER_REJECT}})
let n
while((n=it.nextNode())!=null)len+=n.nodeValue.length}else{DOM.findNext(node,node,n=>{if(n instanceof Text)len+=n.nodeValue.length
return false})}return len}}REG.reg.registerSkin("decor-charlength",1,`\n\t:host {\n\t\tfont-size: 80%;\n\t\tfont-style: italic;\n\t\tcolor: var(--fade-color);\n\t\tcursor: default;\n\t}\n\n\t:host([state=warning]) {\n\t\tcolor: var(--warning-color);\n\t}\n\n\t:host([state=error]) {\n\t\tcolor: var(--error-color);\n\t}\n`)
window.customElements.define("decor-charlength",DecorCharLength)
class DecorCharLengthWedlet extends WedletFork{constructor(elt,mainWedlet){super(mainWedlet)
this.elt=elt
this.futureTask=0}updateInDescendants(msg){this.planComputeLength()}planComputeLength(){if(this.futureTask===0){this.futureTask=window.requestIdleCallback(deadline=>{this.futureTask=0
const wedMgr=this.wedMgr
if(!wedMgr.docHolderAsync.isAvailable)return
if(this.isVirtual()){this.elt.redraw(0)}else if(wedMgr.docHolder){this.elt.redraw(this.elt.computeLen(XA.findDomLast(this.wedAnchor,wedMgr.docHolder.getDocument())))}else{console.log("TODO:wedMgr.docHolderAsync",this)}})}}}
//# sourceMappingURL=decorCharLength.js.map