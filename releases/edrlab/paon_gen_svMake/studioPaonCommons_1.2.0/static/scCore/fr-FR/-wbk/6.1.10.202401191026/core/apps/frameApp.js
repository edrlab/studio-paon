import{BaseElementAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{FontSizeDeskFeat,UiThemeDeskFeat}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/plugins/optionsPlg.js"
import{captureScenariProtocol}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/scenariProtocol.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
export class FrameApp extends BaseElementAsync{async _initialize(init){this.appDef=init.appDef
this.reg=this.findReg(init)
this.anonymousAllowed=init.anonymousAllowed
if(init.name)this.setAttribute("label",init.name)
const iframe=JSX.createElement("iframe",{id:"ifrm",src:init.url})
if(UiThemeDeskFeat.isIn(desk))iframe.injectTheme=UiThemeDeskFeat.injectTheme
iframe.addEventListener("load",this.onLoadedPage)
this._attach(this.localName,init,iframe)}async onLoadedPage(){const frameApp=DOMSH.findHost(this)
const win=this.contentWindow
let winLoc
try{winLoc=win.location.href}catch(e){}if(!winLoc||winLoc==="about:blank"){return}if(win.initParentFrame)win.initParentFrame(frameApp)
captureScenariProtocol(this,frameApp.reg)}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
init.url=this.getAttribute("url")
return init}getFrame(){return this.shadowRoot.getElementById("ifrm")}updateAppDef(def){return false}onViewHidden(closed){if(closed&&this._themeLstn&&UiThemeDeskFeat.isIn(desk)){desk.onThemeChange.delete(this._themeLstn)
this._themeLstn=null}}injectTheme(){if(UiThemeDeskFeat.isIn(desk))desk.injectThemeInSubFrame(this.getFrame())
if(FontSizeDeskFeat.isIn(desk))desk.injectFontSizeInSubFrame(this.getFrame())}async hasPerm(perm){const libPath=await REG.findScPermLibPath(perm)
if(this.reg.env.resolver&&libPath)await import(this.reg.env.resolver.resolvePath(libPath))
return this.reg.hasPerm(perm)}}REG.reg.registerSkin("c-frame-app",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\tiframe {\n\t\tflex: 1;\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\tborder: none;\n\t\t/*background: white;*/\n\t}\n`)
customElements.define("c-frame-app",FrameApp)
export class ShowApp extends FrameApp{_initialize(init){var _a,_b,_c
if((_a=init.appDef.show)===null||_a===void 0?void 0:_a.alias){if(init.aliasUrls)init.url=init.aliasUrls[init.appDef.show.alias]
if(!init.url){const alias=(_b=init.appDef.show)===null||_b===void 0?void 0:_b.alias
POPUP.confirm(`La configuration de la vue est invalide : ${alias}`,init.reg.env.uiRoot,{cancelLbl:null})
init.url="about:blank"}}else{init.url=(_c=init.appDef.show)===null||_c===void 0?void 0:_c.url
if(!IO.isRedirectValid(init.url,init.whiteDomains||true)){const url=init.url
POPUP.confirm(`La configuration de la vue est invalide : ${url}`,init.reg.env.uiRoot,{cancelLbl:null})
init.url="about:blank"}}init.skin="c-frame-app"
return super._initialize(init)}}customElements.define("show-app",ShowApp)

//# sourceMappingURL=frameApp.js.map