import{WedletFork}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{FontSizeDeskFeat,UiThemeDeskFeat}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/plugins/optionsPlg.js"
import{captureScenariProtocol}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/scenariProtocol.js"
import{registerEditProtocolsActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/actions/scProtocolActions.js"
export class DecorPreviewIFrame extends HTMLElement{constructor(){super(...arguments)
this.href="about:blank"}configWedletElt(tpl,wedlet){this.wedlet=new DecorPreviewIframeWedlet(this,wedlet)
this.href=this.getAttribute("href")
this.reg=wedlet.wedMgr.reg
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin(this.localName,sr)
this.previewFrame=sr.appendChild(JSX.createElement("iframe",null))
this.previewFrame.addEventListener("load",this.onLoadedPage)
registerEditProtocolsActions(this.reg)
captureScenariProtocol(this.previewFrame,this.reg)}refreshBindValue(val,children){this.redraw()}redraw(){const win=this.previewFrame.contentWindow
if(win===null||win===void 0?void 0:win.reloadPage)win.reloadPage(this.getNodeContent())
else this.previewFrame.src=this.href}async onLoadedPage(){const decorPreviewIFrame=DOMSH.findHost(this)
const win=this.contentWindow
if(win.initParentFrame)win.initParentFrame(decorPreviewIFrame)
captureScenariProtocol(this,decorPreviewIFrame.reg)}injectTheme(){if(UiThemeDeskFeat.isIn(desk))desk.injectThemeInSubFrame(this.previewFrame)
if(FontSizeDeskFeat.isIn(desk))desk.injectFontSizeInSubFrame(this.previewFrame)}getNodeContent(){return XA.findDomLast(this.wedlet.wedAnchor,this.wedlet.wedMgr.docHolder.getDocument())}getRootContent(){return this.wedlet.wedMgr.docHolder.getDocument()}}REG.reg.registerSkin("decor-preview-iframe",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\tiframe {\n\t\tflex: 1 1 15em;\n\t\tborder: none;\n\t\tuser-select: none;\n\t}\n`)
window.customElements.define("decor-preview-iframe",DecorPreviewIFrame)
export class DecorPreviewIframeWedlet extends WedletFork{constructor(elt,mainWedlet){super(mainWedlet)
this.elt=elt
this.futureTask=0}updateInDescendants(msg){this.elt.redraw()}}
//# sourceMappingURL=decorPreviewIFrame.js.map