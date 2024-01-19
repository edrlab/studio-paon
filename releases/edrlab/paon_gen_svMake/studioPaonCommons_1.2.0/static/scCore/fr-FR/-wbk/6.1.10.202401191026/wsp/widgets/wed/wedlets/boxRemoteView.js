import{EWedletEditMode,EWedletEditModeLabel,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{RemoteView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/remoteView.js"
import{BoxContainer,removeAnnots}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
export class BoxRemoteView extends BoxContainer{constructor(){super()
this.style.userSelect="none"}configWedletElt(tpl,wedlet){const wedMgr=wedlet.wedMgr
const reg=wedMgr.reg
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
WEDLET.installSkins(tpl,sr,wedlet,this.localName)
this.remoteViewElt=sr.appendChild(JSX.createElement(RemoteView,{"î":BoxRemoteView.makeRemoteViewInit(tpl,wedlet)}))
this.remoteViewElt.wsp=reg.env.wsp
this.remoteViewElt.fields=reg.env.longDesc}static makeRemoteViewInit(tpl,wedlet){const init={viewers:[]}
if(tpl.hasAttribute("tag"))init.tag=tpl.getAttribute("tag")
Array.from(tpl.children).forEach(elt=>{switch(elt.nodeName){case"locationAsSrc":const queryStringParams=[]
Array.from(elt.children).forEach(paramElt=>{if(paramElt.nodeName==="queryStringParam"){let obj={value:JSON.parse(paramElt.textContent)}
if(paramElt.hasAttribute("keySvc"))obj.keySvc=paramElt.getAttribute("keySvc")
queryStringParams.push(obj)}})
init.viewers.push({type:"locationAsSrc",queryStringParams:queryStringParams})
break
case"scPortalView":case"scDepotView":init.viewers.push({type:"scDepotView",code:elt.getAttribute("code")})
break}})
return init}refreshBindValue(val){this.url=val
this.remoteViewElt.location=this.url
WEDLET.clearAnnots(this)}insertChars(from,chars,msg){this.refreshBindValue(LANG.stringInsert(this.url,from,chars))}deleteChars(from,len,msg){this.refreshBindValue(LANG.stringDelete(this.url,from,len))}replaceChars(chars,msg){this.refreshBindValue(chars)}}window.customElements.define("box-remote-view",BoxRemoteView)
REG.reg.registerSkin("box-remote-view",1,`\n\t:host {\n\t\tdisplay: block;\n\t}\n\n\twsp-remote-view {\n\t\theight: 100%;\n\t}\n\n`)
export class BoxRemoteViewBtn extends Button{constructor(){super(...arguments)
this.openInNewTab=false}configWedletElt(tpl,wedlet){this.wedlet=wedlet
const wedMgr=wedlet.wedMgr
this.reg=wedMgr.reg
const init=Object.assign({reg:this.reg,role:"button",skin:tpl.getAttribute("skin"),skinOver:tpl.getAttribute("skinOver")},this.buildInitFromAtts())
if(!tpl.getAttribute("tag"))this.openInNewTab=true
this.initialize(init)
this.remoteViewInit=BoxRemoteView.makeRemoteViewInit(tpl,wedlet)
this.onclick=this.onClick.bind(this)}get visiblePerms(){return this.hasAttribute("visiblePerms")?this.getAttribute("visiblePerms").split(" "):null}get enablePerms(){return this.hasAttribute("enablePerms")?this.getAttribute("enablePerms").split(" "):null}async onClick(ev){if(this.disabled)return
if(this.openInNewTab){const error={}
RemoteView.resolveRemote(this.reg.env.wsp,this.remoteViewInit,this.reg.env.longDesc,this.url,error).then(async url=>{try{if(error.msg){throw error.msg}else if(url){let resp=await IO.openUrlExternal(url)
if(typeof resp==="object")ERROR.showError(resp)}else throw"Ressource invalide"}catch(e){ERROR.show("Visualisation impossible",e)}})}else{if(!this.remoteViewElt){this.remoteViewElt=JSX.createElement(RemoteView,{"î":this.remoteViewInit})
this.remoteViewElt.wsp=this.reg.env.wsp
this.remoteViewElt.fields=this.reg.env.longDesc}this.remoteViewElt.location=this.url
POPUP.showDialog(this.remoteViewElt,this.reg.env.uiRoot,{titleBar:{barLabel:{label:this.label||"Visualisation"}},fixSize:false,resizer:{},initWidth:"60vw",initHeight:"60vh",closeOnCtrlEnter:true})}}setEditMode(mode){this.disabled=mode!==EWedletEditMode.write
DOM.setAttr(this,"edit-mode",EWedletEditModeLabel[mode])}async refreshBindValue(val){this.url=val
this.classList.toggle("virtual",this.wedlet.isVirtual())
if(this.wedlet.isVirtual())removeAnnots(this)
if(!this.url){this.disabled=true}else{DOM.setHidden(this,this.visiblePerms&&!this.reg.hasPerm(this.visiblePerms))
this.disabled=this.enablePerms&&!this.reg.hasPerm(this.enablePerms)||!WEDLET.isWritableWedlet(this.wedlet)}}insertChars(from,chars,msg){this.refreshBindValue(LANG.stringInsert(this.url,from,chars))}deleteChars(from,len,msg){this.refreshBindValue(LANG.stringDelete(this.url,from,len))}replaceChars(chars,msg){this.refreshBindValue(chars)}}window.customElements.define("box-remote-view-btn",BoxRemoteViewBtn)
REG.reg.registerSkin("box-remote-view-btn",1,`\n\n`)

//# sourceMappingURL=boxRemoteView.js.map