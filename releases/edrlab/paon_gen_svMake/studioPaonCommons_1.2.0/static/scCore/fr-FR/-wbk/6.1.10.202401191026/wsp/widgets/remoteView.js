import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{CDM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/cdm.js"
export class RemoteView extends BaseElement{get wsp(){return this._wsp||this.findReg(this.config).env.wsp}set wsp(v){this._wsp=v
this._fields=null
this.refresh()}get fields(){return this._fields||this.findReg(this.config).env.longDesc}set fields(v){this._fields=v
this.refresh()}get location(){return this._fixedLocation}set location(v){this._fixedLocation=v
this.refresh()}_initialize(init){this.config=init
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
switch(this.config.tag){case"img":this._mainDisplayTag=sr.appendChild(JSX.createElement("img",{class:"imgView",hidden:""}))
break
case"video":this._mainDisplayTag=sr.appendChild(JSX.createElement("video",{class:"videoView",controls:"controls",hidden:""}))
break
case"audio":this._mainDisplayTag=sr.appendChild(JSX.createElement("audio",{class:"audioView",controls:"controls",hidden:""}))
break
default:this._mainDisplayTag=sr.appendChild(JSX.createElement("iframe",{class:"htmlView",hidden:"",sandbox:"allow-scripts allow-same-origin allow-forms"}))
break}this._mainDisplayTag.onerror=function(ev){DOMSH.findHost(this).showMainDisplayTag(false)
DOMSH.findHost(this)._pending.setCustomMsg("Non disponible","error")}
this._pending=sr.appendChild(JSX.createElement("c-msg",null))}_refresh(){this._tryIndex=-1
this.showMainDisplayTag(false)
this._pending.setStandardMsg("loading")
const error={}
RemoteView.resolveRemote(this.wsp,this.config,this.fields,this.location,error).then(async url=>{if(error.msg){this.showMainDisplayTag(false)
this._pending.setCustomMsg(error.msg,"info")}else if(url){try{this.setUrl(url)}catch(e){if(DEBUG)console.log(e)
this.showMainDisplayTag(false)
this._pending.setCustomMsg("Visualisation non disponible","info")}}else{this.showMainDisplayTag(false)
this._pending.setCustomMsg("Visualisation non disponible","info")}})}static async resolveRemote(wsp,viewers,srcFields,location,error){var _a
if(!srcFields||srcFields.srcSt<0){if(error)error.msg="Source non spécifiée"
return}let tryIndex=-1
let locationParam=""
if(location)locationParam+="&location="+encodeURIComponent(location)
do{const viewer=viewers.viewers[++tryIndex]
if(!viewer){if(error)error.msg="Visualisation non disponible"
return}else if(viewer.type==="cidPreviewProcess"){console.log("TODO cidPreviewProcess")}else if(viewer.type==="scDepotView"){try{const url=await WSP.fetchStreamText(wsp,null,SRC.srcRef(srcFields),"transform=facet&facet=remoteContent&outType=LOCATION&scDepotView="+encodeURIComponent(viewer.code)+locationParam)
if(await RemoteView.isValidUrl(url))return url}catch(e){if(DEBUG)console.log(e)}}else if(viewer.type==="locationAsSrc"){try{let transform="transform=facet&facet=remoteContent&outType=LOCATION"+locationParam;(_a=viewer.queryStringParams)===null||_a===void 0?void 0:_a.forEach(param=>{transform+="&queryString="
if(param.keySvc)transform+=param.keySvc+":"
transform+=CDM.stringify(param.value)})
const url=await WSP.fetchStreamText(wsp,null,SRC.srcRef(srcFields),transform)
if(await RemoteView.isValidUrl(url,viewer.queryStringParams&&viewer.queryStringParams.length?false:true))return url}catch(e){if(DEBUG)console.log(e)}}}while(true)}showMainDisplayTag(show){DOM.setHidden(this._pending,show)
DOM.setHidden(this._mainDisplayTag,!show)}static async isValidUrl(url,noRemoteCheck){if(url&&/https?\:\/\/.*/.test(url)){if(noRemoteCheck)return true
const resp=await fetch(url,{method:"HEAD",credentials:"include"})
if(resp.ok)return true}return false}setUrl(url){this.showMainDisplayTag(true)
this._mainDisplayTag.src=url}}REG.reg.registerSkin("wsp-remote-view",1,`\n\t:host {\n\t\tflex: 1;\n\t\tflex-direction: column;\n\t\tjustify-content: center;\n\t\talign-items: center;\n\t\ttext-align: center;\n\t\tvertical-align: middle;\n\t\toverflow: auto;\n\t\tdisplay: flex;\n\t}\n\n\n\t:host > .imgView, :host > .videoView, :host > .audioView, :host > .iframeView, :host > .dynGenView {\n\t\tmax-height: 100%;\n\t\tobject-fit: scale-down;\n\t\tmax-width: 100%;\n\t}\n\n\t:host(.itemPreview) > .imgView, :host(.itemPreview) > .videoView, :host(.itemPreview) > .iframeView, :host(.itemPreview) > .dynGenView {\n\t\tmax-height: 10em;\n\t}\n\n\t:host > .audioView {\n\t\tmax-height: 2em;\n\t}\n\n\t:host > .iframeView, :host > .dynGenView {\n\t\tborder: 1px solid var(--border-color);\n\t\twidth: 100%;\n\t}\n\n\t[hidden] {\n\t\tdisplay: none;\n\t}\n\n\tiframe {\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\tborder: none;\n\t}\n\n\tc-msg {\n\t\tmargin: .8em;\n\t\tfont-style: italic;\n\t}\n`)
customElements.define("wsp-remote-view",RemoteView)
const DEBUG=false

//# sourceMappingURL=remoteView.js.map