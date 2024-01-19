import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{installSrcViewFileDrop}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemMain.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
export class ItemAudio extends BaseElement{_initialize(init){this.reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
installSrcViewFileDrop(this.reg,this)
const{env:env}=this.reg
const audio=JSX.createElement("audio",{src:this.getStreamUrl(env,init.transform),controls:true})
sr.appendChild(audio)
env.place.eventsMgr.on("wspUriChange",msg=>{if(SRC.srcRef(env.longDesc)===SRC.srcRef(msg)){audio.src=this.getStreamUrl(env,init.transform)}})}getStreamUrl(env,transform){return WSP.getStreamStampedUrl(env.wsp,env.itemType.getMainStreamSrcUri(env.longDesc),env.longDesc.srcDt,transform)}}REG.reg.registerSkin("wsp-item-audio",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tjustify-content: center;\n\t\talign-items: center;\n\t\tpadding: 1px;\n\t}\n`)
customElements.define("wsp-item-audio",ItemAudio)

//# sourceMappingURL=itemAudio.js.map