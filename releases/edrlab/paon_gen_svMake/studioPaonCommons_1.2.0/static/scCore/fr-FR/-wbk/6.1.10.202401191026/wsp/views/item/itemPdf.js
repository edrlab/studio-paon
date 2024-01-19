import{BaseElement,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{installSrcViewFileDrop}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemMain.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{ImgSize}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/imgSize.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
const VIEWER_HASH="#view=Fit&toolbar=0"
export class ItemPdf extends BaseElement{_initialize(init){this.reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
installSrcViewFileDrop(this.reg,this)
const{env:env}=this.reg
const iframe=JSX.createElement("iframe",{src:this.getStreamUrl(env,init.transform)})
if(init.size)sr.appendChild(JSX.createElement(ImgSize,{"î":BASIS.newInit(init.size,this.reg)},iframe))
else sr.appendChild(iframe)
env.place.eventsMgr.on("wspUriChange",msg=>{var _a
if(SRC.srcRef(env.longDesc)===SRC.srcRef(msg)){(_a=iframe.contentWindow)===null||_a===void 0?void 0:_a.location.reload()}})}getStreamUrl(env,transform){return WSP.getStreamStampedUrl(env.wsp,env.itemType.getMainStreamSrcUri(env.longDesc),env.longDesc.srcDt,transform)+VIEWER_HASH}}REG.reg.registerSkin("wsp-item-pdf",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex: 1;\n\t\tflex-direction: column;\n\t\tpadding: 1px;\n\t}\n\n\t:host > iframe {\n\t\twidth: 100%;\n\t\theight: 100%;\n\t}\n\t\n\tiframe {\n\t\tborder: none;\n\t}\n\n\twsp-imgsize {\n\t\tflex: 1;\n\t}\n`)
customElements.define("wsp-item-pdf",ItemPdf)

//# sourceMappingURL=itemPdf.js.map