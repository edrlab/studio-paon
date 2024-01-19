import{BaseElement,BaseElementAsync,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REMOTE,RemoteRes}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/remote.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
export class RemoteResRenderer extends BaseElementAsync{async setRemoteRes(res){var _a
if(res?res.url===((_a=this.resShown)===null||_a===void 0?void 0:_a.url):this.resShown==null)return
this.resShown=res
this.msgShown=null
if(res){if(this.config.forceWebRender&&this.config.forceWebRender!=="embed"){this.webRender=this.config.forceWebRender}else{this.msgShown={msg:"..."}
this.refresh()
const webRender=await res.getBestWebRendition()
if(this.resShown!==res)return
this.msgShown=null
if(this.config.forceWebRender==="embed"&&(webRender==="window"||webRender==="download")){this.webRender=null}else{this.webRender=webRender}}}this.refresh()}setMsg(msg,level,icon){this.resShown=null
this.webRender=null
this.msgShown={msg:msg,level:level,icon:icon}
this.refresh()}_initialize(init){this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.config=init
this.config.forceWebRender
this._msgTag=this.shadowRoot.appendChild(JSX.createElement("c-msg",null))
return this.setRemoteRes(init.res)}showRenderTag(show){var _a
DOM.setHidden(this._msgTag,show)
if(this._renderTag)this._renderTag.hidden=!show
this.className=show?((_a=this._renderTag)===null||_a===void 0?void 0:_a.className)||"msg":"msg"}_refresh(){const sr=this.shadowRoot
if(this._renderTag){this._renderTag.remove()
this._renderTag=null}if(this.msgShown){this.showRenderTag(false)
this._msgTag.setCustomMsg(this.msgShown.msg,this.msgShown.level,this.msgShown.icon)
return}switch(this.resShown?this.webRender:null){case"img":this._renderTag=sr.insertBefore(JSX.createElement("img",{class:"imgView",hidden:"",src:this.resShown.url}),this._msgTag)
break
case"video":this._renderTag=sr.insertBefore(JSX.createElement("video",{class:"videoView",controls:"controls",hidden:"",src:this.resShown.url}),this._msgTag)
break
case"audio":this._renderTag=sr.insertBefore(JSX.createElement("audio",{class:"audioView",controls:"controls",hidden:"",src:this.resShown.url}),this._msgTag)
break
case"iframe":this._renderTag=sr.insertBefore(JSX.createElement("iframe",{class:"htmlView",hidden:"",sandbox:"allow-scripts allow-same-origin allow-forms",allow:"encrypted-media; picture-in-picture",src:this.resShown.url}),this._msgTag)
break
case"download":this._renderTag=sr.insertBefore(JSX.createElement(Button,{class:"downloadBtn",hidden:"","î":{reg:this.resShown.reg,label:"Télécharger",uiContext:"dialog"},onclick:this.onDownloadBtn}),this._msgTag)
break
case"window":this._renderTag=sr.insertBefore(JSX.createElement(Button,{class:"openBtn",hidden:"","î":{reg:this.resShown.reg,label:"Ouvrir...",uiContext:"dialog"},onclick:this.onOpenBtn}),this._msgTag)
break
default:this._msgTag.setCustomMsg("Visualisation non disponible","info")}if(this._renderTag){if(!(this._renderTag instanceof Button))this._renderTag.onerror=function(ev){const me=DOMSH.findHost(this)
me.showRenderTag(false)
me._msgTag.setCustomMsg("Ressource non disponible","error")}
this.showRenderTag(true)}else{this.showRenderTag(false)}}onDownloadBtn(ev){const me=DOMSH.findHost(this)
const link=document.createElement("a")
link.href=REMOTE.urlRemoteContent(me.resShown.url,me.config.reg)
const path=new URL(me.resShown.url).pathname
const idx=path.lastIndexOf("/")+1
link.setAttribute("download",idx>0?path.substring(idx):path)
link.click()}onOpenBtn(ev){const me=DOMSH.findHost(this)
window.open(me.resShown.url,"_blank")}}REG.reg.registerSkin("wsp-remoteres-renderer",1,`\n\t:host {\n\t\tflex: 1;\n\t\tflex-direction: column;\n\t\tjustify-content: center;\n\t\talign-items: center;\n\t\ttext-align: center;\n\t\tvertical-align: middle;\n\t\toverflow: auto;\n\t\tdisplay: flex;\n\t}\n\n\n\t:host > .imgView, :host > .videoView, :host > .audioView, :host > .iframeView, :host > .dynGenView {\n\t\tmax-height: 100%;\n\t\tobject-fit: scale-down;\n\t\tmax-width: 100%;\n\t}\n\n\t:host(.itemPreview) > .imgView, :host(.itemPreview) > .videoView, :host(.itemPreview) > .iframeView, :host(.itemPreview) > .dynGenView {\n\t\tmax-height: 10em;\n\t}\n\n\t:host > .audioView {\n\t\tmax-height: 2em;\n\t}\n\n\t:host > .iframeView, :host > .dynGenView {\n\t\tborder: 1px solid var(--border-color);\n\t\twidth: 100%;\n\t}\n\n\t[hidden] {\n\t\tdisplay: none;\n\t}\n\n\tiframe {\n\t\twidth: 100%;\n\t\theight: 100%;\n\t  border: none;\n  }\n\n  c-msg {\n\t  margin: .5em;\n\t  font-style: italic;\n  }\n`)
customElements.define("wsp-remoteres-renderer",RemoteResRenderer)
export class RemoteResRendererExtended extends BaseElement{_initialize(init){var _a
this.reg=this.findReg(init)
if(!init.remoteResSelector){switch((_a=init.previewInit)===null||_a===void 0?void 0:_a.forceWebRender){case"download":case"window":init.remoteResSelector=(reg,resDesc)=>new RemoteRes(reg,resDesc)
break
case"video":init.remoteResSelector=REMOTE.remoteResAsVideo
break
case"audio":init.remoteResSelector=REMOTE.remoteResAsAudio
break
default:init.remoteResSelector=REMOTE.remoteResForPreview}}this.config=init
this.attachShadow(DOMSH.SHADOWDOM_INIT)
if(this.localName!=="wsp-remoteres-renderer-extended")this.reg.installSkin("wsp-remoteres-renderer-extended",this.shadowRoot)
this._initAndInstallSkin(this.localName,init)
if(this.config.openBtn!="none")REG.reg.addToList(RemoteResRendererExtended.ACTIONS_LIST_BASE,"openBtn",1,OpenRemoteResAct.SINGLETON)
this.buildStruct()}buildStruct(){if(this.config.buildTitle!=="none")this.titleRoot=JSX.createElement("div",{id:"title"})
this.barActions=JSX.createElement(BarActions,{class:"horizontal","î":{reg:this.reg,actions:this.reg.mergeLists(RemoteResRendererExtended.ACTIONS_LIST_BASE,this.config.actionsList),actionContext:this,uiContext:"dialog",disableFullOverlay:true}})
this.shadowRoot.appendChild(JSX.createElement("div",{id:"head"},this.titleRoot,this.barActions))
if(!this.config.preview||this.config.preview==="shown"){this.remoteResRenderer=JSX.createElement(RemoteResRenderer,{id:"preview","î":BASIS.newInit(this.config.previewInit,this.reg)})}else if(this.config.preview==="tooltip"){POPUP.promiseTooltip(this,async txtElt=>(new RemoteResRenderer).initialize({reg:this.reg}),{hoverAllowed:true})}if(this.remoteResRenderer)this.shadowRoot.appendChild(this.remoteResRenderer)}async fetchResDescFromClient(url){return await REMOTE.fetchResDesc(url,this.config.reg)||{url:url,status:-1}}async _refresh(){const currentRefresh=this._pendingRefresh=Date.now()
this.refreshUi()
const newDesc=await this.config.fetchResDesc()
if(currentRefresh!=this._pendingRefresh)return
this.remoteDesc=newDesc
this.refreshUi()}refreshUi(){if(this.titleRoot)this.updateTitle()
if(this.remoteResRenderer)this.updatePreview()
if(this.barActions)this.updateBarActions()}updateTitle(){var _a,_b,_c
if(typeof this.config.buildTitle==="function"&&((_a=this.config.buildTitle)===null||_a===void 0?void 0:_a.call(this,this.titleRoot,this.remoteDesc))=="done")return
DOM.setTextContent(this.titleRoot,((_b=this.remoteDesc)===null||_b===void 0?void 0:_b.title)||((_c=this.remoteDesc)===null||_c===void 0?void 0:_c.url)||"[URL non renseignée]")}updatePreview(){var _a
const st=((_a=this.remoteDesc)===null||_a===void 0?void 0:_a.status)||0
if(st<200||st>299){DOM.setHiddenProp(this.remoteResRenderer,true)
return}DOM.setHiddenProp(this.remoteResRenderer,false)
this.remoteResRenderer.setRemoteRes(this.remoteDesc?this.config.remoteResSelector(this.config.reg,this.remoteDesc):null)}updateBarActions(){this.barActions.refreshContent()}}RemoteResRendererExtended.ACTIONS_LIST_BASE="actions:remoteResRendererExtended:base"
customElements.define("wsp-remoteres-renderer-extended",RemoteResRendererExtended)
REG.reg.registerSkin("wsp-remoteres-renderer-extended",1,`\n\t:host {\n\t\tflex: 1;\n\t\tflex-direction: column;\n\t\tdisplay: flex;\n\t}\n\n\t[hidden] {\n\t\tdisplay: none;\n\t}\n\n\t#head {\n\t\tborder-bottom: 1px solid var(--border-color);\n\t\tdisplay: flex;\n\t}\n\n\t#title {\n\t\tflex: 1;\n\t}\n\n\tc-bar-actions {\n\t\tflex: unset;\n\t\tmin-height: min-content;\n\t\tmin-width: min-content;\n\t}\n\n\t/*\n\t\tc-button {\n\t\t\tdisplay: inline-flex;\n\t\t\t--icon-size: 1em;\n\t\t}*/\n\n\t#preview {\n\t\tdisplay: inline-flex;\n\t}\n`)
class OpenRemoteResAct extends Action{constructor(){super("openBtn")
this._label="Ouvrir cette ressource..."
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/widgets/remote/externalOpen.svg"}execute(ctx,ev){const view=this.findOpenView(ctx)
if(view)window.open(REMOTE.buildUrlFromResDesc(ctx.remoteDesc,view),"_blank")}isVisible(ctx){if(this.findOpenView(ctx)==null)return false
return super.isVisible(ctx)}findOpenView(ctx){var _a,_b,_c,_d
const editor=REMOTE.findEditorInResDesc(ctx.remoteDesc)
if(editor)return editor
const view=REMOTE.findFullViewInResDesc(ctx.remoteDesc)
if(!view)return null
const previewTags=(_b=(_a=ctx.remoteResRenderer)===null||_a===void 0?void 0:_a.resShown)===null||_b===void 0?void 0:_b.getTags()
return!LANG.arrayEquals(previewTags.body,(_c=view.tags)===null||_c===void 0?void 0:_c.body)||!LANG.arrayEquals(previewTags.web,(_d=view.tags)===null||_d===void 0?void 0:_d.web)?view:null}}OpenRemoteResAct.SINGLETON=new OpenRemoteResAct

//# sourceMappingURL=remoteResRenderer.js.map