import{BaseElementAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{FontSizeDeskFeat,UiThemeDeskFeat}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/plugins/optionsPlg.js"
export class UrlTreeApp extends BaseElementAsync{set path(val){if(val&&val.startsWith("/"))val=val.substring(1)
if(this.appDef.utPath!==val){this.appDef.utPath=val
this.dispatchEvent(new CustomEvent("c-appdef-change",{bubbles:true}))}}get path(){return this.appDef.utPath}async _initialize(init){this.reg=this.findReg(init)
this.appDef=init.appDef
this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.setAttribute("label",init.reg.env.universe.getName())
this.frame=this.shadowRoot.appendChild(JSX.createElement("iframe",null))
this.frame.addEventListener("load",()=>{this.onPathChange()})
const depotUrl=this.reg.env.universe.urlTree.url.toString()
this.path=this.appDef.utPath||""
this.frame.src=depotUrl+this.path}onPathChange(){const depotUrl=this.reg.env.universe.urlTree.url.toString()
const currentUrl=this.frame.contentDocument.location.href
const win=this.frame.contentWindow
if(currentUrl.startsWith(depotUrl))this.path=currentUrl.substring(depotUrl.length)
if(win.initParentFrame)win.initParentFrame(this)}updateAppDef(def){return false}injectTheme(){if(this.frame&&UiThemeDeskFeat.isIn(desk))desk.injectThemeInSubFrame(this.frame)
if(this.frame&&FontSizeDeskFeat.isIn(desk))desk.injectFontSizeInSubFrame(this.frame)}async hasPerm(perm){const libPath=await REG.findScPermLibPath(perm)
if(this.reg.env.resolver&&libPath)await import(this.reg.env.resolver.resolvePath(libPath))
return this.reg.hasPerm(perm)}}REG.reg.registerSkin("store-urltree-app",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\tiframe {\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\tborder: none;\n\t}\n`)
customElements.define("store-urltree-app",UrlTreeApp)

//# sourceMappingURL=urlTreeApp.js.map