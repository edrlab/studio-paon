import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{installSrcViewFileDrop}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemMain.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
export class ItemTxt extends BaseElement{_initialize(init){this.reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.reg.installSkin("scroll/large",sr)
installSrcViewFileDrop(this.reg,this)
const{env:env}=this.reg
this._textareaElt=JSX.createElement("textarea",{readonly:true})
sr.appendChild(this._textareaElt)
env.place.eventsMgr.on("wspUriChange",msg=>{if(SRC.srcRef(env.longDesc)===SRC.srcRef(msg)){this.refreshContent(env,init.transform)}})
this.refreshContent(this.reg.env,init.transform)}async refreshContent(env,transform){this._textareaElt.value=await WSP.fetchStreamText(env.wsp,this,env.itemType.getMainStreamSrcUri(env.longDesc),transform)}}REG.reg.registerSkin("wsp-item-txt",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t  flex: 1;\n\t  flex-direction: column;\n\t  padding: 1px;\n  }\n\n  textarea {\n\t  flex: 1;\n\t  border: none;\n\t  resize: none;\n\t  outline: none;\n\t  background-color: var(--bgcolor);\n\t  color: var(--color);\n  }\n`)
customElements.define("wsp-item-txt",ItemTxt)

//# sourceMappingURL=itemTxt.js.map