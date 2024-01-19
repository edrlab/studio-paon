import{WedletFork}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{ENodeType,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{SkinClassStlPreview}from"../../previews.js"
class DecorPreviewSkinEntryInSkinset extends HTMLElement{constructor(){super(...arguments)
this.redrawPending=false}configWedletElt(tpl,wedlet){this.wedlet=new DecorPreviewSkinEntryInSkinsetWedlet(this,wedlet)
this.reg=wedlet.wedMgr.reg
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin(this.localName,sr)}refreshBindValue(val,children){this.redraw()}async redraw(){if(this.redrawPending)return
try{this.redrawPending=true
const wedMgr=this.wedlet.wedMgr
const docHolder=wedMgr.docHolder
const sr=this.shadowRoot
sr.innerHTML=""
const node=XA.findDomLast(this.wedlet.wedAnchor,docHolder.getDocument())
if((node===null||node===void 0?void 0:node.nodeType)===ENodeType.element){const skinRefUri=node.getAttribute("sc:refUri")
if(skinRefUri){const longDesc=await this.reg.env.wsp.fetchLongDesc(skinRefUri)
const skinClassStlCode=longDesc.itAttr_skClassStl
if(skinClassStlCode){sr.innerHTML=""
sr.appendChild(JSX.createElement(SkinClassStlPreview,{"î":{reg:this.reg,shortDesc:longDesc}}))}}}}finally{this.redrawPending=false}}}REG.reg.registerSkin("decor-styler-skinset-skinentry",1,`\n\n`)
window.customElements.define("decor-styler-skinset-skinentry",DecorPreviewSkinEntryInSkinset)
class DecorPreviewSkinEntryInSkinsetWedlet extends WedletFork{constructor(elt,mainWedlet){super(mainWedlet)
this.elt=elt
this.futureTask=0}updateInDescendants(msg){this.elt.redraw()}}
//# sourceMappingURL=decorSkinSetSkinEntry.js.map