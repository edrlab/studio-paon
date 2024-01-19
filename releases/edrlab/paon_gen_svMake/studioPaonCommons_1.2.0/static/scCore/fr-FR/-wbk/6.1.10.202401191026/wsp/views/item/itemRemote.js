import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{RemoteView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/remoteView.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
export class ItemRemote extends BaseElement{_initialize(init){this.reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.remView=sr.appendChild(JSX.createElement(RemoteView,{style:"flex:1","î":init}))
this.remView.wsp=this.reg.env.wsp
this.remView.fields=this.reg.env.longDesc
this.reg.env.longDescChange.add(ldNew=>this.remView.fields=ldNew)}}REG.reg.registerSkin("wsp-item-remote",1,`\n\t:host {\n\t\toverflow: auto;\n\t\tdisplay: flex;\n\t}\n`)
customElements.define("wsp-item-remote",ItemRemote)

//# sourceMappingURL=itemRemote.js.map