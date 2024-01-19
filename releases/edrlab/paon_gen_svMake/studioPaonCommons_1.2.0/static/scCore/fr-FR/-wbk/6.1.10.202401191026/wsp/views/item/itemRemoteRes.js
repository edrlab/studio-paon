import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{RemoteResRendererExtended}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/remoteResRenderer.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
export class ItemRemoteRes extends RemoteResRendererExtended{_initialize(init){var _a
init=Object.assign({fetchResDesc:async()=>{let transform="transform=facet&facet=remoteContent&outType=RESDESC"
return WSP.fetchStreamJson(this.config.reg.env.wsp,null,SRC.srcRef(this.config.reg.env.longDesc),transform)||{location:null,status:-1}}},init)
super._initialize(init);(_a=this.config.reg.env.longDescChange)===null||_a===void 0?void 0:_a.add(ldNew=>this._refresh())}}REG.reg.registerSkin("wsp-item-remote-res",1,`\n\t:host {\n\t\toverflow: auto;\n\t\tdisplay: flex;\n\t}\n`)
customElements.define("wsp-item-remote-res",ItemRemoteRes)

//# sourceMappingURL=itemRemoteRes.js.map