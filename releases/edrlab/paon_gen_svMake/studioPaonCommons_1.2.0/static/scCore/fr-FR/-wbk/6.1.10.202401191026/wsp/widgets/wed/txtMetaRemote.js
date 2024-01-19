import{BaseElement,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{REMOTE,RemoteRes}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/remote.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{OpenMetaDialog}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtActions.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{RemoteResRenderer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/remoteResRenderer.js"
export class TxtMetaRemote extends BaseElement{extractRemoteUrl(){var _a
const metas=this.config.txtElt.metas
return metas?(_a=DOM.findNext(metas,metas,n=>n.nodeName==="sc:location"))===null||_a===void 0?void 0:_a.textContent:null}async fetchResDescFromClient(url){return await REMOTE.fetchResDesc(url,this.config.reg)||{url:url,status:-1}}async _refresh(){const newUrl=this.extractRemoteUrl()
if(newUrl!=this.lastRemoteUrl){this.lastRemoteUrl=newUrl
this.lastRemoteDesc=null
this.internalRefresh()
if(newUrl){const newDesc=await this.fetchResDescFromClient(newUrl)
if(this.lastRemoteUrl!==newUrl)return
this.lastRemoteDesc=newDesc}}this.internalRefresh()}internalRefresh(){if(this.titleRoot)this.updateTitle()
if(this.previewRoot)this.updatePreview()
if(this.openBtn)this.updateopenBtn()}updateTitle(){var _a,_b
if(((_a=this.config.buildTitle)===null||_a===void 0?void 0:_a.call(this,this.titleRoot,this.config.txtElt,this.lastRemoteDesc))=="done")return
DOM.setTextContent(this.titleRoot,((_b=this.lastRemoteDesc)===null||_b===void 0?void 0:_b.title)||this.lastRemoteUrl||"[URL non renseignée]")}updatePreview(){var _a
const st=((_a=this.lastRemoteDesc)===null||_a===void 0?void 0:_a.status)||0
if(st<200||st>299){DOM.setHiddenProp(this.previewRoot,true)
return}DOM.setHiddenProp(this.previewRoot,false)
this.previewRoot.setRemoteRes(this.lastRemoteDesc?this.config.remoteResSelector(this.config.reg,this.lastRemoteDesc):null)}updateopenBtn(){DOM.setHiddenProp(this.openBtn,this.findOpenView()==null)}findOpenView(){var _a,_b,_c,_d
const editor=REMOTE.findEditorInResDesc(this.lastRemoteDesc)
if(editor)return editor
const view=REMOTE.findFullViewInResDesc(this.lastRemoteDesc)
if(!view)return null
const previewTags=(_b=(_a=this.previewRoot)===null||_a===void 0?void 0:_a.resShown)===null||_b===void 0?void 0:_b.getTags()
return!LANG.arrayEquals(previewTags.body,(_c=view.tags)===null||_c===void 0?void 0:_c.body)||!LANG.arrayEquals(previewTags.web,(_d=view.tags)===null||_d===void 0?void 0:_d.web)?view:null}_initialize(init){var _a
if(!init.reg)init.reg=init.txtElt.wedMgr.reg
if(!init.remoteResSelector){switch((_a=init.previewInit)===null||_a===void 0?void 0:_a.forceWebRender){case"download":case"window":init.remoteResSelector=(reg,resDesc)=>new RemoteRes(reg,resDesc)
break
case"video":init.remoteResSelector=REMOTE.remoteResAsVideo
break
case"audio":init.remoteResSelector=REMOTE.remoteResAsAudio
break
default:init.remoteResSelector=REMOTE.remoteResForPreview}}this.config=init
this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.buildStruct(init)}buildStruct(init){this.titleRoot=JSX.createElement("div",{id:"title"})
if(!init.metaBtn||init.metaBtn==="shown"){this.metaBtn=(new Button).initialize({reg:this.config.reg,title:"Métadonnées d\'accès à cette ressource...",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/txt/showMeta.svg",uiContext:"bar"})
this.metaBtn.id="metaBtn"
this.metaBtn.onclick=this.onMetaBtn}if(!init.openBtn||init.openBtn==="shown"){this.openBtn=(new Button).initialize({reg:this.config.reg,title:"Ouvrir cette ressource...",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/widgets/remote/externalOpen.svg",uiContext:"bar"})
this.openBtn.hidden=true
this.openBtn.id="openBtn"
this.openBtn.onclick=this.onopenBtn}if(this.metaBtn||this.openBtn){this.shadowRoot.appendChild(JSX.createElement("div",{id:"head"},this.titleRoot,this.metaBtn,this.openBtn))}else{this.shadowRoot.append(this.titleRoot)}if(!init.preview||init.preview==="shown"){this.previewRoot=JSX.createElement(RemoteResRenderer,{id:"preview","î":BASIS.newInit(init.previewInit,init.reg)})}else if(init.preview==="tooltip"){POPUP.promiseTooltip(this,async txtElt=>(new TxtMetaRemoteTt).initialize({txtElt:this.config.txtElt,buildTitle:()=>"done",metaBtn:"none",openBtn:"none",previewInit:this.config.previewInit}),{hoverAllowed:true})}if(this.previewRoot)this.shadowRoot.appendChild(this.previewRoot)}onMetaBtn(){const me=DOMSH.findHost(this)
OpenMetaDialog.openMetaDialog(me.config.txtElt)}onopenBtn(ev){const me=DOMSH.findHost(this)
const view=me.findOpenView()
if(view)window.open(REMOTE.buildUrlFromResDesc(me.lastRemoteDesc,view),"_blank")}}export class TxtMetaRemoteInline extends TxtMetaRemote{}REG.reg.registerSkin("wsp-txtmetaremoteinline",1,`\n\t:host {\n\t\tdisplay: inline;\n\t\tborder: 1px solid var(--border-color);\n\t\tcursor: pointer;\n\t\tbackground-color: var(--alt1-bgcolor);\n\t\tmax-height: 3em;\n\t}\n\n\t[hidden] {\n\t\tdisplay: none;\n\t}\n\n\t#head,\n\t#title {\n\t\tdisplay: inline;\n\t}\n\n\tc-button {\n\t\tdisplay: inline-flex;\n\t\t--icon-size: 1em;\n\t}\n\n\t#preview {\n\t\tdisplay: inline-flex;\n\t}\n`)
customElements.define("wsp-txtmetaremoteinline",TxtMetaRemoteInline)
export class TxtMetaRemoteBlock extends TxtMetaRemote{}REG.reg.registerSkin("wsp-txtmetaremoteblock",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tborder: 1px solid var(--border-color);\n\t\tborder-radius: 4px;\n\t\tcursor: pointer;\n\t\tmargin: 0 3%;\n\t\tbackground-color: var(--alt1-bgcolor);\n\t}\n\n\t[hidden] {\n\t\tdisplay: none;\n\t}\n\n\t#head {\n\t\tdisplay: flex;\n\t}\n\n\t#head > #title {\n\t\tflex: 1;\n\t}\n\n\t#title {\n\t\ttext-align: center;\n\t}\n`)
customElements.define("wsp-txtmetaremoteblock",TxtMetaRemoteBlock)
export class TxtMetaRemoteTt extends TxtMetaRemoteBlock{}REG.reg.registerSkin("wsp-txtmetaremotett",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tbackground-color: var(--alt1-bgcolor);\n\t\tpadding: .5em;\n\t}\n\n\t[hidden] {\n\t\tdisplay: none;\n\t}\n\n\t#head {\n\t\tdisplay: flex;\n\t}\n\n\t#head > #title {\n\t\tflex: 1;\n\t}\n\n\t#title {\n\t\ttext-align: center;\n\t}\n`)
customElements.define("wsp-txtmetaremotett",TxtMetaRemoteTt)

//# sourceMappingURL=txtMetaRemote.js.map