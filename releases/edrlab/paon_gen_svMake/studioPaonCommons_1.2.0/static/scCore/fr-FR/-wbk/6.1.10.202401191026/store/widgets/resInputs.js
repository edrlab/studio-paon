import{FORMS,MxFormElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
import{BaseElement,BaseElementAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{UtSelector}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/dialogs/utSelector.js"
import{UtBrowserFetcher}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/utBrowser.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{URLTREE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/urlTree.js"
import{AREAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
export class ResIdentFieldSet extends(MxFormElement(BaseElementAsync)){async _initialize(init){this.config=init
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
init.reg.installSkin("form-control-areas",sr)
this._initAndInstallSkin(this.localName,init)
if(!init.area.noFolderSelector&&init.folderUi!=="hidden"){this.folderInput=JSX.createElement(ResParentPathInput,{id:"folderInput","î":{reg:init.reg,folderPath:init.folderPath,disabled:init.folderUi==="readOnly"}})
this.folderInput.addEventListener("change",this.onInputChange)
sr.appendChild(init.buildControlLabel?AREAS.buildControlLabel(this.folderInput,"folder","Dossier"):this.folderInput)}if(!init.area.noResNameField&&init.leafUi!=="hidden"){const readOnly=init.leafUi==="readOnly"
this.leafNameInput=JSX.createElement("input",{id:"nameInput",type:"text",value:init.leafName||"",disabled:readOnly?true:undefined,required:true})
this.leafNameInput.addEventListener("input",this.onInputChange)
sr.appendChild(init.buildControlLabel?AREAS.buildControlLabel(this.leafNameInput,"resName","Nom"):this.leafNameInput)
this.initDefaultCaretInputName()}this.anchor=this.leafNameInput||this.folderInput
if(!this.anchor)this.tabIndex=-1
sr.appendChild(JSX.createElement("slot",null))
this._initializeForm(init)
if(init.area.customInputs){this.addEventListener("change",this.refreshValidity)
this.addEventListener("input",this.refreshValidity)
const wait=[]
for(let area of init.area.customInputs){wait.push(area.loadBody(init))}(await Promise.all(wait)).forEach(elt=>this.appendChild(elt))}}initDefaultCaretInputName(){if(!this.leafNameInput.disabled){const pos=this.leafNameInput.value.indexOf(".")
this.leafNameInput.setSelectionRange(0,pos>=0?pos:this.leafNameInput.value.length)}}resName(){var _a
return((_a=this.leafNameInput)===null||_a===void 0?void 0:_a.value)||this.config.leafName}folderPath(){var _a
return((_a=this.folderInput)===null||_a===void 0?void 0:_a.getParentPath())||this.config.folderPath}buildVersionedPath(version,resName,folder){return URLTREE.appendToPath(folder!==undefined?folder:this.folderPath(),resName||this.resName())+"@"+version}planRevalid(){var _a
this.setValidity(null)
this.addPendingValidity(this);(_a=this.config.callback)===null||_a===void 0?void 0:_a.identState("pending")}extractJson(parent){if(parent.path){if(this.folderInput){const parentPath=URLTREE.extractParentPath(parent.path)
if(parentPath!=null)this.folderInput.setParentPath(parentPath)}if(this.leafNameInput){const leafName=URLTREE.extractUnversionedLeafName(parent.path)
if(leafName!=null){this.leafNameInput.value=leafName
this.initDefaultCaretInputName()
this.refreshValidity()}}}FORMS.jsonToForm(parent,this)
return false}fillJson(parent,root){FORMS.formToJson(this,parent,root)
if(this.config.area.pathBuilder){this.config.area.pathBuilder(parent,this)}else{parent.path=URLTREE.appendToPath(this.folderPath(),this.resName())}}async computeValidity(){if(this.validity.badInput)return
if(await FORMS.checkAsyncValidity(this,true)){if(this.validity.badInput)return
const meta={}
this.fillJson(meta,meta)
this.targetPath=meta.path
if(meta.path!=null){this.targetState=this.config.reg.env.universe.adminUrlTree.nodeInfos(meta.path,"&excludeAll&props=n*trashed").then(ni=>{if(meta.path!==this.targetPath)return
if(this.validity.badInput)return
this.targetState=ni?ni.trashed?"inTrash":"exist":"free"
switch(this.targetState){case"exist":if(this.config.resUpdatable!=="always"){this.setMsg("Un contenu existe déjà à cet emplacement, changez de dossier ou de nom.","warning")}else{this.setMsg("Un contenu existe à cet emplacement, il va être remplacé.","info")}break
case"inTrash":if(this.config.resUpdatable==="never"){this.setMsg("Un contenu existe déjà à cet emplacement (en état supprimé), changez de dossier ou de nom.","warning")}else if(this.config.resUpdatable==="ifInTrash"){this.setMsg("Un contenu en état supprimé existe à cet emplacement, il va être remplacé.","info")}break
case"free":break}})
return this.targetState}else{this.targetState=undefined
this.setMsg("Impossible de définir l\'identité de la ressource","error")}}}setMsg(msg,level){if(level!=="info")this.setValidity({customError:true},msg,this.anchor)
if(this.config.callback){if(this.targetState instanceof Promise){this.config.callback.identState("pending")}else if(level==="error"||this.targetState==null){this.config.callback.identState("invalid",null,msg,level)}else{this.config.callback.identState(this.targetState,this.targetPath,msg,level)}}}_refresh(){super._refresh()
this.refreshValidity()}onInputChange(){DOMSH.findHost(this).refreshValidity()}refreshValidity(){var _a
if(this.leafNameInput){const st=URLTREE.isValidResName(this.leafNameInput.value)
if(st===true){this.planRevalid()}else{this.setValidity({badInput:true},st,this.leafNameInput);(_a=this.config.callback)===null||_a===void 0?void 0:_a.identState("invalid",null,st,"warning")}}else{this.planRevalid()}}}REG.reg.registerSkin("store-res-ident-fieldset",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: fit-content;\n\t\tflex-direction: column;\n\t}\n\n\t:host(:focus) {\n\t\toutline: none !important;\n\t}\n\n  :focus-visible {\n\t\toutline: var(--focus-outline);\n\t}\n\n\t#folderInput {\n\t\tmargin-bottom: .5em;\n\t}\n\n\t#nameInput:disabled {\n\t\tbackground-color: transparent;\n\t\tborder: none;\n\t}\n\n`)
customElements.define("store-res-ident-fieldset",ResIdentFieldSet)
export class ResParentPathInput extends(MxFormElement(BaseElement)){_initialize(init){this.reg=this.findReg(init)
this._parentPath=init.folderPath||""
this.pathField=JSX.createElement("span",{id:"folder"})
this.pathBtn=JSX.createElement(Button,{id:"folderBtn","î":{reg:this.reg,label:"...",title:"Sélectionner un dossier...",uiContext:"dialog"},onclick:this.onClickSel})
this._attach(this.localName,init,this.pathField,this.pathBtn)
this._initializeForm(init)}getParentPath(){return this._parentPath||URLTREE.DEFAULT_PATH_ROOT}setParentPath(path){if(this._parentPath!==path&&this.dispatchEvent(new CustomEvent("change",{cancelable:true,bubbles:true}))){this._parentPath=path
this.refresh()}}async onClickSel(ev){if(this.disabled)return
const me=DOMSH.findHost(this)
const ct=(new UtSelector).initialize({reg:me.reg,initialPath:me._parentPath,utBrowser:{fetcher:new UtBrowserFetcher(me.reg.env.universe.adminUrlTree).setFilter("isFolder")}})
const parentNode=await POPUP.showMenuFromEvent(ct,ev,me,null,{initWidth:"25em"}).onNextClose()
if(parentNode)me.setParentPath(parentNode.permaPath)}_refresh(){super._refresh()
DOM.setTextContent(this.pathField,this.reg.env.resTypes.humanPath(this._parentPath))
this.pathBtn.disabled=this.disabled}}REG.reg.registerSkin("store-res-parentpath-input",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t}\n\n\t#folder {\n\t\tflex: 1;\n\t}\n\n\t#folderBtn {\n\t\tmargin: 0;\n\t}\n`)
customElements.define("store-res-parentpath-input",ResParentPathInput)

//# sourceMappingURL=resInputs.js.map