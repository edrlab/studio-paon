import{BaseElement,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{installSrcViewFileDrop}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemMain.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{ImgSize}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/imgSize.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
export class ItemIframe extends BaseElement{_initialize(init){this.reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
installSrcViewFileDrop(this.reg,this)
const{env:env}=this.reg
const iframe=JSX.createElement("iframe",{src:this.getStreamUrl(this.reg.env,init.transform)})
if(init.size)sr.appendChild(JSX.createElement(ImgSize,{"î":BASIS.newInit(init.size,this.reg)},iframe))
else sr.appendChild(iframe)
env.place.eventsMgr.on("wspUriChange",msg=>{if(SRC.srcRef(env.longDesc)===SRC.srcRef(msg)){iframe.contentWindow.location.reload()}})}getStreamUrl(env,transform){return WSP.getStreamStampedUrl(env.wsp,env.itemType.getMainStreamSrcUri(env.longDesc),env.longDesc.srcDt,transform)}}REG.reg.registerSkin("wsp-item-iframe",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex: 1;\n\t\tflex-direction: column;\n\t\tpadding: 1px;\n\t}\n\n\t:host > iframe {\n\t\twidth: 100%;\n\t\theight: 100%;\n\t}\n\t\n\tiframe {\n\t\tborder: none;\n\t}\n\n\twsp-imgsize {\n\t\tflex: 1;\n\t}\n`)
customElements.define("wsp-item-iframe",ItemIframe)

//# sourceMappingURL=itemIframe.js.map