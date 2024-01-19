import{findElementWedlet}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{DecorPreviewIFrame,DecorPreviewIframeWedlet}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/decor/decorPreviewIFrame.js"
import{isWedletSingleElt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedletSingleElt.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{isEltBoxSelection}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxSel.js"
class DecorPreviewStyle extends DecorPreviewIFrame{constructor(){super(...arguments)
this.global=false}configWedletElt(tpl,wedlet){super.configWedletElt(tpl,wedlet)
this.global=this.hasAttribute("global")
this.wedlet=new DecorPreviewIframeWedlet(this,this.global?wedlet.wedMgr.rootWedlet:wedlet)
this._onFocus=this.onFocus.bind(this)
wedlet.wedMgr.listeners.on("getFocus",this._onFocus)
const sr=this.shadowRoot
REG.reg.installSkin("decor-preview-iframe",sr)}disconnectedCallback(){this.wedlet.wedMgr.listeners.removeListener("getFocus",this._onFocus)}async getPropertyValue(key,returnDefault=true,fromRoot){const wedMgr=this.wedlet.wedMgr
const docHolder=wedMgr.docHolder
if(fromRoot==null)fromRoot=this.global
const propsWdl=this.findPropertyWdlNode(key,fromRoot)
if(propsWdl){if(!propsWdl.wedlet.isVirtual()&&isWedletSingleElt(propsWdl.wedlet)){const node=XA.findDomLast(propsWdl.wedlet.wedAnchor,docHolder.getDocument())
if((node===null||node===void 0?void 0:node.nodeType)===ENodeType.element){if(node.hasAttribute("sc:refUri"))return await this.getItemStreamUrl(node.getAttribute("sc:refUri"))
else return node.textContent}}return propsWdl.getAttribute("styler-default-value")}}onFocus(wedMgr,focusElt){const elt=DOMSH.findFlatParentEltOrSelf(focusElt,wedMgr.wedEditor.rootNode,n=>isEltBoxSelection(n)||n.stopBoxSelection)
if(elt===null||elt===void 0?void 0:elt.isConnected){const win=this.previewFrame.contentWindow
if(win===null||win===void 0?void 0:win.focusOnProperty)win.focusOnProperty(elt.getAttribute("styler-property-key"))}}focusOnProperty(key,fromRoot=false){const propsWdl=this.findPropertyWdlNode(key,fromRoot)
if(propsWdl)propsWdl.focus()}async getItemStreamUrl(refUri,transform){if(!refUri)return
const sd=await this.reg.env.wsp.fetchShortDesc(refUri)
if(!sd)return
const itemType=this.reg.env.wsp.wspMetaUi.getItemType(sd.itModel)
return itemType?WSP.getStreamUrl(this.reg.env.wsp,itemType.getMainStreamSrcUri(sd)).url:null}findPropertyWdlNode(key,fromRoot=false){var _a,_b
const wedMgr=this.wedlet.wedMgr
const querySelector=`*[styler-property-key="${key}"]`
if(!key)return
if(fromRoot){const rootWedlet=wedMgr.rootWedlet
if(isWedletSingleElt(rootWedlet)){let selectedNode=rootWedlet.element.querySelector(querySelector)
if(!selectedNode)selectedNode=(_a=rootWedlet.element.shadowRoot)===null||_a===void 0?void 0:_a.querySelector(querySelector)
return selectedNode?findElementWedlet(selectedNode,false):null}}else{let wedlet=this.wedlet
while(wedlet&&!isWedletSingleElt(wedlet))wedlet=wedlet.wedParent
if(isWedletSingleElt(wedlet)){let selectedNode=(_b=wedlet.element)===null||_b===void 0?void 0:_b.querySelector(querySelector)
return findElementWedlet(selectedNode,false)}}}}REG.reg.registerSkin("decor-styler-preview-styles",1,`\n\n`)
window.customElements.define("decor-styler-preview-styles",DecorPreviewStyle)

//# sourceMappingURL=decorPreviewStyle.js.map