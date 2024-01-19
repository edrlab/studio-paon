import{BaseElement,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{installSrcViewFileDrop}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemMain.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{ImgSize}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/imgSize.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
export class ItemImg extends BaseElement{_initialize(init){this.reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
installSrcViewFileDrop(this.reg,this)
const env=this.reg.env
this._pending=sr.appendChild(JSX.createElement("c-msg",{label:"..."}))
this.img=JSX.createElement("img",{src:this.getStreamUrl(this.reg.env,init.transform),hidden:"true"})
this.img.onerror=function(ev){DOMSH.findHost(this).showMainDisplayTag(false)
DOMSH.findHost(this)._pending.setCustomMsg("Non disponible","error")}
this.img.onload=function(ev){DOMSH.findHost(this).showMainDisplayTag(true)
DOMSH.findHost(this)._pending.setCustomMsg(null)}
if(init.size)sr.appendChild(JSX.createElement(ImgSize,{"î":BASIS.newInit(init.size,this.reg)},this.img))
else sr.appendChild(this.img)
this.showMainDisplayTag(false)
env.place.eventsMgr.on("wspUriChange",msg=>{if(SRC.srcRef(env.longDesc)===SRC.srcRef(msg)){this.showMainDisplayTag(false)
this.img.src=this.getStreamUrl(this.reg.env,init.transform)}})}getStreamUrl(env,transform){return WSP.getStreamStampedUrl(env.wsp,env.itemType.getMainStreamSrcUri(env.longDesc),env.longDesc.srcDt,transform)}showMainDisplayTag(show){DOM.setHidden(this._pending,show)
DOM.setHidden(this.img,!show)}}REG.reg.registerSkin("wsp-item-img",1,`\n\t:host {\n\t  display: flex;\n\t  min-height: 0;\n\t  min-width: 0;\n\t  flex: 1;\n\t  flex-direction: column;\n\t  justify-content: center;\n\t  padding: 1px;\n  }\n\n  :host > img {\n\t  width: fit-content;\n\t  height: fit-content;\n\t  max-width: 100%;\n\t  max-height: 100%;\n\t  object-fit: contain;\n\t  align-self: center;\n  }\n\n  img {\n\t  background-image: linear-gradient(to right, rgba(192, 192, 192, 0.75), rgba(192, 192, 192, 0.75)),\n\t  linear-gradient(to right, black 50%, white 50%),\n\t  linear-gradient(to bottom, black 50%, white 50%);\n\t  background-blend-mode: normal, difference, normal;\n\t  background-size: 1em 1em;\n\t}\n\n\twsp-imgsize {\n\t\tflex: 1;\n\t}\n\n  c-msg {\n\t  flex: 0 0 auto;\n  }\n`)
customElements.define("wsp-item-img",ItemImg)

//# sourceMappingURL=itemImg.js.map