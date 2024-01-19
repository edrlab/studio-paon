import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{SrcAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
import{GenAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/gen/genActions.js"
import{LabelAsyncArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{WspArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/wspPropsAreas.js"
import{BaseElement,FileSystemPath,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{MxFormElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
function refUriFromShortDescCtx(wsp,ctx){let shortDesc=ctx.shortDescs[0]
if(shortDesc){const itemType=wsp.wspMetaUi.getItemType(shortDesc.itModel)
return itemType.getMainStreamSrcUri(shortDesc)||shortDesc.srcUri}else{return SRC.URI_ROOT}}const externalEditor=(new SrcAction).setLabel("Ouvrir dans l\'éditeur par défaut du système").setVisible(ctx=>{const{env:env}=ctx.reg
return Desk.electron&&env.universe.config.local&&env.wsp.backEnd=="fs"}).setGroup("explorer").setExecute((async function(ctx){const{env:env}=ctx.reg
const srcFilePath=await WSP.fetchFilePath(env.wsp,env.uiRoot,refUriFromShortDescCtx(env.wsp,ctx))
window.postMessage({type:"client:modules:localServer:open",path:srcFilePath},location.origin)}))
const revealInFs=(new SrcAction).setLabel("Révéler dans le système de fichiers").setVisible(ctx=>{const{env:env}=ctx.reg
return Desk.electron&&env.universe.config.local&&env.wsp.backEnd=="fs"}).setGroup("explorer").setExecute((async function(ctx){const{env:env}=ctx.reg
const srcFilePath=await WSP.fetchFilePath(env.wsp,env.uiRoot,refUriFromShortDescCtx(env.wsp,ctx))
window.postMessage({type:"client:modules:localServer:reveal",path:srcFilePath},location.origin)}))
const copyLocalPath=(new SrcAction).setLabel("Copier le chemin du système de fichiers").setVisible(ctx=>{const{env:env}=ctx.reg
return env.universe.config.local&&env.wsp.backEnd=="fs"}).setGroup("clipboard").setExecute((async function(ctx){const{env:env}=ctx.reg
const srcFilePath=await WSP.fetchFilePath(env.wsp,env.uiRoot,refUriFromShortDescCtx(env.wsp,ctx))
await navigator.clipboard.writeText(srcFilePath)
POPUP.showNotifInfo("Le chemin du fichier a été copié dans le presse-papier.",ctx.emitter)}))
class RevealGenAction extends GenAction{constructor(id){super(id||"reveal")
this._label="Révéler"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/generators/reveal.svg"
this._description=Desk.electron?"Révéler dans le système de fichier":"Copier le chemin du répertoire de génération dans le presse-papier"
this._hideForStatuses="null"}isVisible(ctx){return ctx.genInfo.localPathPub&&ctx.reg.env.universe.config.local&&super.isVisible(ctx)}execute(ctx,ev){if(Desk.electron)window.postMessage({type:"client:modules:localServer:reveal",path:ctx.genInfo.localPathPub},location.origin)
else{navigator.clipboard.writeText(ctx.genInfo.localPathPub)
POPUP.showNotifInfo("Le chemin de génération a été copié dans le presse-papier.",ctx.uiContext)}}}class WspFolderContentInputArea extends LabelAsyncArea{constructor(){super("folderContent")
this.setLabel("Contenus")
this.setDescription("Répertoire des contenus de l\'atelier")}isVisible(ctx){return ctx.reg.env.universe.config.local&&ctx.reg.env.universe.config.backEnd=="fs"&&super.isVisible(ctx)}async _loadControl(ctx,name){const infoWspProvider=await WSP.fetchInfoWspProvider(ctx.reg.env.universe.wspServer)
const inputFile=JSX.createElement(InputLocalPath,{"î":{name:name,directory:true,canEditPath:null,defaultPath:infoWspProvider.defaultContentPath}})
inputFile.inputElt.placeholder="Chemin par défaut"
inputFile.inputElt.title=infoWspProvider.defaultContentPath
return inputFile}}class WspFolderContentArea extends WspArea{constructor(id="content",asSubField=false){super(id)
this.asSubField=asSubField
this.setLabel("Contenus")
this.setDescription("Répertoire des contenus de l\'atelier")
this._infoWspField="content"}isVisible(ctx){return ctx.reg.env.universe.config.local&&ctx.reg.env.wsp.backEnd=="fs"&&super.isVisible(ctx)}buildBody(ctx){const areaCtx=Object.assign({},ctx,{buildControlLabel:!this.asSubField})
const elt=super.buildBody(areaCtx)
if(this.asSubField){DOM.addClass(elt,"allCols")
elt.style.marginInlineStart="2em"}return elt}_buildControl(ctx,name){let infoWsp=ctx.reg.env.wsp?ctx.reg.env.wsp.infoWsp||ctx.reg.env.wsp.infoWspError:null
if(infoWsp&&infoWsp[this._infoWspField])return JSX.createElement(FileSystemPath,{"î":{label:infoWsp[this._infoWspField],ellipsis:!this.asSubField,type:"dir"},class:this.asSubField?"small":null})
else return JSX.createElement(MsgLabel,{"î":{label:"Information non disponible",level:"info"}})}}class WspFolderGenArea extends WspFolderContentArea{constructor(id="gen",asSubField=false){super(id,asSubField)
this.asSubField=asSubField
this.setLabel("Générations")
this.setDescription("Répertoire de génération de l\'atelier")
this._infoWspField="gen"}isVisible(ctx){return ctx.reg.env.universe.config.local&&super.isVisible(ctx)}}export function initLocalServerReg(reg){if(Desk.electron){reg.addToList("actions:wsp:shortDesc","externalEditor",REG.LEVELAUTH_CLIENT,externalEditor,100)
reg.addToList("actions:itemFolder:shortDesc","externalEditor",REG.LEVELAUTH_CLIENT,externalEditor,100)
reg.addToList("actions:wsp:shortDesc","revealInFs",REG.LEVELAUTH_CLIENT,revealInFs,100)
reg.addToList("actions:itemFolder:shortDesc","revealInFs",REG.LEVELAUTH_CLIENT,revealInFs,100)}reg.addToList("actions:wsp:shortDesc","copyLocalPath",REG.LEVELAUTH_CLIENT,copyLocalPath,100)
reg.addToList("actions:itemFolder:shortDesc","copyLocalPath",REG.LEVELAUTH_CLIENT,copyLocalPath,100)
reg.addToList("actions:gen","reveal",1,new RevealGenAction,30)
REG.reg.addToList("wspProps:create:fs","localPaths",1,new WspFolderContentInputArea,21)
REG.reg.addToList("wspProps:edit:fs:infos","folderContent",1,new WspFolderContentArea,21)
REG.reg.addToList("wspProps:edit:fs:infos","folderGen",1,new WspFolderGenArea,22)
REG.reg.addToList("wspProps:remove:fs","folderContent",1,new WspFolderContentArea(null,true),12)
REG.reg.addToList("wspProps:remove:commons","folderGen",1,new WspFolderGenArea(null,true),22)}export class InputLocalPath extends(MxFormElement(BaseElement)){_initialize(init){this._params=init
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.inputElt=sr.appendChild(JSX.createElement("input",{type:"text",name:"customInputPath",oninput:this.onInputChange}))
DOM.setAttrBool(this.inputElt,"readonly",this._params.canEditPath==null?Desk.electron:this._params.canEditPath)
if(Desk.electron)this._inputBtn=sr.appendChild(JSX.createElement("c-button",{"ui-context":"bar",icon:this._params.directory?"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/choiceLocalDir.svg":"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/choiceLocalFile.svg",title:this._params.directory?"Choisir un répertoire...":"Choisir un fichier...",onclick:this.onSelectPath}))
this.onInputChange.call(this.inputElt)
this._initializeForm(init)}get value(){return this._value}set value(path){this._value=path}get disabled(){return super.disabled}set disabled(val){this.inputElt.disabled=val
if(this._inputBtn)this._inputBtn.disabled=val
super.disabled=val}async onSelectPath(){const self=DOMSH.findHost(this)
const selectReply=await IO.sendMessage(Object.assign({type:"client:modules:localServer:selectPath"},self._params),location.origin,0)
if(selectReply.type=="error")ERROR.log(selectReply.msg)
else{if(!selectReply.paths)return
else if(selectReply.paths.length==1)self._value=selectReply.paths[0]
else self._value=selectReply.paths
self._refresh()}}onInputChange(){const self=DOMSH.findHost(this)
if(!this.value)self._value=null
else if(self._params.multiple)self._value=this.value.split(",")
else self._value=this.value}_refresh(){if(!this._value)this.inputElt.value=""
else if(Array.isArray(this._value))this.inputElt.value=this._value.join(",")
else this.inputElt.value=this._value}extractJson(parent){if(!this.name)return false
this.value=parent[this.name]}fillJson(parent,root){if(!this.name||this.indeterminate)return
parent[this.name]=this.value}}REG.reg.registerSkin("c-input-local-path",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: row;\n\t}\n\t\t\n\tinput[type=text] {\n\t\tflex:1;\n\t\tmin-width: 0;\n\t  background-color: var(--form-bgcolor);\n\t  color: var(--form-color);\n\t  border: 1px solid var(--border-color);\n\t  text-overflow: ellipsis;\n\t\tmargin: 0 .5em 0 0;\n\t}\n\t\n\tinput:disabled {\n\t  background-color: transparent;\n  }\n\n  input:invalid{\n\t  border-color: var(--error-color);\n  }\n\n  input[readonly] {\n\t  background-color: transparent;\n\t  border: none;\n\t  cursor: auto;\n  }\n`)
customElements.define("c-input-local-path",InputLocalPath)

//# sourceMappingURL=localServer.js.map