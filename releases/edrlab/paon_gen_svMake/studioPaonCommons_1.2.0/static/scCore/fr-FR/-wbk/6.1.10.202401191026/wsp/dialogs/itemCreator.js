import{BaseElement,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{Button,ButtonActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{ItemTypesTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/itemTypesTree.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{EHttpStatusCode,RespError}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{FolderEntries,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{EItemTypeFamily}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js"
import{isFolder}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/files.js"
import{WspImportSrc}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
export class ItemCreator extends BaseElement{static openCreateItem(init,titleDialog,uiContext,ev){const ct=(new ItemCreator).initialize(init)
const dialogInit={titleBar:titleDialog,resizer:{},viewPortY:"1/3",initMaxHeight:"70vh",initWidth:"min(60em, 80vw)"}
return POPUP.showDialog(ct,uiContext,dialogInit)}static setDefaultConfigFromReg(reg,cnf){if(!cnf)cnf={}
if(!("reg"in cnf))cnf.reg=reg
if(!("spaceUi"in cnf))cnf.spaceUi=reg.getPref("ItemCreator.spaceUi")
if(!("airItem"in cnf))cnf.airItem=reg.env.wsp.isAirItem?reg.getPref("ItemCreator.airItem","allowed"):"never"
if(!("codeItemUi"in cnf))cnf.codeItemUi=reg.getPref("ItemCreator.codeItemUi")
if(!("nameBuilder"in cnf))cnf.nameBuilder=reg.getPref("ItemCreator.nameBuilder")
if(!("codeItemBuilderBeforeSave"in cnf))cnf.codeItemBuilderBeforeSave=reg.getPref("ItemCreator.codeItemBuilderBeforeSave")
return cnf}get wsp(){return this.reg.env.wsp}get spaceUri(){return typeof this.space==="object"?this.space.srcUri:this.space}get ext(){return this.extLabel.textContent}_initialize(init){var _a
this.reg=this.findReg(init)
this.body=init.body
this.newContentOptions=init.newContentOptions
if(this.body instanceof Blob)this.contentType=this.body.type
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("webzone:panel",sr)
this.reg.installSkin("standard-dialog",sr)
this._initAndInstallSkin(this.localName,init)
if((_a=this.contentType)===null||_a===void 0?void 0:_a.startsWith("image/")){const img=sr.appendChild(JSX.createElement("img",{id:"preview"}))
img.src=URL.createObjectURL(this.body)
this.classList.add("preview")}if(!init.itemTypesTree)init.itemTypesTree={}
const itemTypeReducerIni=init.itemTypesTree.itemTypeReducer
init.itemTypesTree.itemTypeReducer=(acc,cur,idx,src)=>{if(cur.datas.noCreator)return acc
if(cur.datas.permsCreator&&!this.reg.hasPerm(cur.datas.permsCreator))return acc
if(itemTypeReducerIni)return itemTypeReducerIni.call(this,acc,cur,idx,src)
else{acc.push(cur)
return acc}}
this.itemTypesTree=sr.appendChild((new ItemTypesTree).initialize(BASIS.newInit(init.itemTypesTree,this.reg)))
this.addEventListener("grid-select",this.onItemTypeSelected.bind(this))
const airItem=init.airItem||"never"
const switchSpaceAir=airItem==="prefered"||airItem==="allowed"
if(airItem!=="forced"&&init.spaceUi!=="hidden"){const ctn=sr.appendChild(JSX.createElement("div",{id:"space"}))
if(switchSpaceAir)this.spaceRadio=ctn.appendChild(JSX.createElement("input",{type:"radio",name:"spOrAir",id:"radioSpace",onchange:this.onSwitchAirItem}))
ctn.appendChild(JSX.createElement("label",{for:"radioSpace"},"Espace :"))
if(init.spaceUi!=="readOnly"){this.spaceLabel=ctn.appendChild(JSX.createElement("c-button",{id:"spaceLabel",onclick:this.onChooseSpace,title:"Sélectionner un espace...",role:"menu","ui-context":"dialog"},"..."))}else{this.spaceLabel=ctn.appendChild(JSX.createElement("span",{id:"spaceLabel"}))}}if(switchSpaceAir){sr.appendChild(JSX.createElement("div",{id:"airItem"},JSX.createElement("input",{type:"radio",name:"spOrAir",id:"radioAir",onchange:this.onSwitchAirItem}),JSX.createElement("label",{for:"radioAir"},"~Item flottant~")))}if(init.nameBuilder)this.nameBuilder=init.nameBuilder
if(init.codeItemUi)this.codeItemUi=init.codeItemUi
if(init.codeItemBuilderBeforeSave)this.codeItemBuilderBeforeSave=init.codeItemBuilderBeforeSave
this.originalCode=this.codeItem=init.codeItem
if(init.codeItemUi!=="hidden"){this.codeItemArea=sr.appendChild(JSX.createElement("div",{id:"codeItem"},"Code :"))
this.nameInput=this.codeItemArea.appendChild(JSX.createElement("input",{id:"codeInput",autocomplete:"off",spellcheck:"false",oninput:this.onCodeInput}))
this.nameInput.readOnly=init.codeItemUi==="readOnly"
this.extLabel=this.codeItemArea.appendChild(JSX.createElement("span",{id:"extLabel"}))}const footer=sr.appendChild(JSX.createElement("div",{id:"footer"}))
this.msgArea=footer.appendChild(JSX.createElement("c-msg",{id:"msg"}))
this.createBtn=footer.appendChild(JSX.createElement(Button,{id:"create",label:"Créer",class:"default","ui-context":"dialog",onclick:this.onCreateBtn}))
this.cancelBtn=footer.appendChild(JSX.createElement(Button,{id:"cancel",label:"Annuler","ui-context":"dialog",onclick:this.onCancelBtn}))
if(airItem==="forced"){this.airItem=true}else if(airItem==="prefered"){this.airItem=true
sr.getElementById("radioAir").checked=true}else{this.setSpace(init.spaceUri||"")}this.onkeypress=this.onKeypress}_refresh(){this.itemTypesTree.selectFirst()
Promise.resolve().then(()=>{const countItemTypes=this.itemTypesTree.countItemTypesUntil(2)
if(countItemTypes===0){this.msgArea.setCustomMsg("Aucun type d\'item compatible","warning")
this.createBtn.disabled=true
this.nameInput.disabled=true}else if(countItemTypes===1){DOM.setHidden(this.itemTypesTree,true)
if(this.nameInput)this.nameInput.focus()}else{const toFocus=DOMSH.findFlatNext(this.shadowRoot,this.shadowRoot,DOM.IS_focusable)
if(toFocus)toFocus.focus()}})}async createItem(){var _a
switch(this.evalCreatable()){case"no":case"working":return null
case"create":let bodyTpl=this.body
let body=null
let folder
if(typeof bodyTpl==="function"){bodyTpl=await bodyTpl(this.wsp,this.itemType,this.airItem?null:this.spaceUri,this.codeItem,this.newContentOptions)}if(!bodyTpl){bodyTpl=await this.itemType.getNewContent(this.reg,this.airItem?null:this.spaceUri,this.codeItem,this.newContentOptions)
if(bodyTpl==null)return null}if(isFolder(bodyTpl)){folder=bodyTpl}else{body=bodyTpl}let srcFields
const cancelLabel=this.cancelBtn.label
try{this.msgArea.setStandardMsg("saving")
this.createBtn.disabled=true
this.cancelBtn.label="Fermer"
let codeItem=this.codeItem
if(this.codeItemBuilderBeforeSave){const codeItemBuilderBeforeSave=await this.codeItemBuilderBeforeSave.call(this)
if(codeItemBuilderBeforeSave!==undefined)codeItem=codeItemBuilderBeforeSave}if(this.airItem){srcFields=await ITEM.createAirItem(this.wsp,null,this,body,{srcNm:codeItem})}else{srcFields=await ITEM.createItem(this.wsp,null,this,body,SRC.addLeafToUri(this.spaceUri,codeItem))}if(folder){const renameRes=codeItem!==folder.name&&((_a=this.wsp.wspMetaUi.getItemType(srcFields.itModel))===null||_a===void 0?void 0:_a.getFamily())===EItemTypeFamily.res
for(let entry of folder.entries){if(entry instanceof File){if(SRC.isValidPartUri(entry.name)===true){await ITEM.update(this.wsp,this,SRC.addLeafToUri(srcFields.srcUri,renameRes&&entry.name===folder.name?this.codeItem:entry.name),entry)}}else{await WspImportSrc.pushResFolder(entry,srcFields.srcUri,this.wsp,this)}}}}catch(e){if(e instanceof RespError){switch(e.response.status){case EHttpStatusCode.forbidden:POPUP.showNotifForbidden(this.airItem?"Il est interdit de créer un item flottant.":"Il est interdit de créer un item à cet emplacement.",this)
break
case EHttpStatusCode.unauthorized:POPUP.showNotifForbidden("Vous ne disposez pas des droits pour créer cet item.",this)
break
default:POPUP.showNotifError(`Une erreur est survenue durant la création de cet item : ${e.response.status}`,this)}}else{POPUP.showNotifError("Une erreur est survenue durant la création de cet item.",this)}console.log(e)}finally{this.msgArea.setStandardMsg(null)
this.createBtn.disabled=false
this.cancelBtn.label=cancelLabel}return srcFields}}async setExt(ext){this.extLabel.textContent=ext
if(this.extPopup)this.extPopup.label=ext
this.setCreatableSt("working")
let name=undefined
if(this.nameBuilder)name=this.nameBuilder()
if(name===undefined){if(this.originalCode&&this.originalCode.toLowerCase().endsWith(ext.toLowerCase())){name=this.originalCode.substr(0,this.originalCode.length-ext.length)}else{name=await this.itemType.buildItemName(this.wsp,this.airItem?null:this.spaceUri,ext,this.airItem?null:async code=>await this.spaceEntries.getChildState(code)!=="used")}}if(this.nameInput)this.nameInput.value=name
this.buildCodeItem(name,ext)}setSpace(space){let spaceUri=typeof space==="object"?space.srcUri:space
if(ITEM.isSpecialUri(spaceUri))space=spaceUri=SRC.URI_ROOT
if(this.spaceRadio)this.spaceRadio.checked=true
if(this.spaceLabel)this.spaceLabel.textContent=ITEM.extractSpaceLabel(spaceUri)
if(!this.spaceEntries)this.spaceEntries=new FolderEntries(this.wsp,this)
this.space=space
this.airItem=false
if(typeof space==="string"){this.wsp.fetchShortDesc(space).then(sd=>{if(space!==this.space)return
this.space=sd
this.evalCreatable()})}this.spaceEntries.setFolderUri(spaceUri)}evalCreatable(){let msg=""
let st="create"
let level="info"
if(typeof this.space==="object"&&!this.reg.hasPermission("create.item",this.space.srcRoles,null,this.space.srcRi)){msg=this.reg.hasSystemRights("create.item",this.space.srcRi)?"Vous ne disposez pas des droits pour ajouter un item dans cet espace.":"Impossible d\'ajouter un item dans cet espace."
level="error"}else if(!this.itemType){msg="Sélectionnez un type d\'item dans la liste"}else if(!this.codeItem){msg="Renseignez le code de l\'item"}else{const r=ITEM.isValidCodeItem(this.codeItem)
if(r!==true)msg=r
else if(!this.airItem){if(this.spaceEntries.loading){st="working"
this.spaceEntries.loading.then(()=>{this.evalCreatable()})}else{if(this.spaceEntries.getChildStateNow(this.codeItem)==="used"){msg="Cet item existe déjà, changez de code"
level="error"}}}}this.msgArea.setCustomMsg(msg,level)
this.setCreatableSt(msg?"no":st)
return msg?"no":st}setCreatableSt(st){this.createBtn.disabled=st!=="create"}onItemTypeSelected(ev){if(ev)ev.stopImmediatePropagation()
const itemType=this.itemTypesTree.getSelectedItemType()
if(itemType===this.itemType)return
this.itemType=itemType
if(itemType==null){this.codeItem=null
if(this.codeItemArea)this.codeItemArea.style.visibility="hidden"
this.evalCreatable()}else{if(typeof this.codeItemUi==="function"&&this.codeItemArea){const codeItemUi=this.codeItemUi(itemType)
if(codeItemUi==="hidden")this.codeItemArea.style.visibility="hidden"
else this.codeItemArea.style.visibility=""
if(this.nameInput)this.nameInput.readOnly=codeItemUi==="readOnly"}else if(this.codeItemArea)this.codeItemArea.style.visibility=""
const ext=itemType.getExtensions(this.contentType)
if(Array.isArray(ext)){if(!this.extPopup)this.extPopup=this.extLabel.parentElement.appendChild(JSX.createElement(ButtonActions,{id:"extPopup","î":{reg:this.reg,uiContext:"dialog",actionContext:this}}))
this.extPopup.actions=ext.map(e=>new ExtAction(e))
this.setExt(ext[0])
DOM.setHidden(this.extLabel,true)
this.extPopup.hidden=false}else{DOM.setHidden(this.extLabel,false)
if(this.extPopup)this.extPopup.hidden=true
this.setExt(ext||(this.originalCode&&this.originalCode.indexOf(".")>-1?this.originalCode.substring(this.originalCode.lastIndexOf(".")):null))}}}async onChooseSpace(ev){const itemCreator=DOMSH.findHost(this)
const{SpaceSelector:SpaceSelector}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/spaceSelector.js")
const ct=(new SpaceSelector).initialize({reg:itemCreator.reg,startSel:itemCreator.spaceUri,spaceTree:{showRoot:true},selOnDblClick:true,onSelChange:(src,spSel)=>{if(!src)spSel.setMsg("Sélectionnez un espace.",false)
else if(spSel.evalPerm("action.src#create.item",src,"Vous ne disposez pas des droits pour créer un item dans cet espace.","Il est impossible de créer un item dans cet espace.")){spSel.setMsg(null,true)}}})
ct.style.width="35em"
const space=await POPUP.showMenuFromEvent(ct,ev,itemCreator,{}).onNextClose()
if(space){itemCreator.setSpace(space)
itemCreator.evalCreatable()}}onSwitchAirItem(){const itemCreator=DOMSH.findHost(this)
itemCreator.airItem=!itemCreator.spaceRadio.checked
itemCreator.setExt(itemCreator.ext)}onCodeInput(ev){const itemCreator=DOMSH.findHost(this)
itemCreator.buildCodeItem(this.value,itemCreator.ext)}async onKeypress(ev){if(ev.key==="Enter"){const r=await this.createItem()
if(r)POPUP.findPopupableParent(this).close(r)}}onCancelBtn(){POPUP.findPopupableParent(this).close()}async onCreateBtn(){const r=await DOMSH.findHost(this).createItem()
if(r)POPUP.findPopupableParent(this).close(r)}buildCodeItem(name,ext){this.codeItem=name+ext
this.evalCreatable()}}REG.reg.registerSkin("wsp-item-creator",1,`\n\t:host {\n\t\tmin-height: 10vh;\n\t}\n\n\t:host(.preview) {\n\t\tmin-height: 35vh;\n\t}\n\n\twsp-itemtypes-tree {\n\t\tborder-bottom: 1px solid var(--border-color);\n\t\tmargin-bottom: .5em;\n\t}\n\n\twsp-itemtypes-tree[hidden] {\n\t\tvisibility: hidden;\n\t\tmargin: 0;\n\t}\n\n\t#preview {\n\t\talign-self: center;\n\t\tmax-width: 60vw;\n\t\tmax-height: 15vh;\n\t\tmargin: 2px;\n\t}\n\n\t#space {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\talign-items: center;\n\t}\n\n\t#space,\n\t#airItem {\n\t\tmargin: .2em;\n\t}\n\n\t#codeItem {\n\t\tmargin: 1em;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\talign-items: center;\n\t}\n\n\t:focus-visible {\n\t\toutline: var(--focus-outline);\n\t}\n\n\t#spaceLabel {\n\t\tmargin: .5em;\n\t}\n\n\t#extPopup {\n\t\tdisplay: inline-flex;\n\t\tfont-weight: bold;\n\t\tmargin: 0;\n\t}\n\n\t#extPopup[hidden] {\n\t\tdisplay: none;\n\t}\n\n\t#codeInput {\n\t\tmargin-inline-start: .5em;\n\t\tfont-size: inherit;\n\t\tbackground-color: var(--form-bgcolor);\n\t\tcolor: var(--form-color);\n\t\tborder: 1px solid var(--border-color);\n\t}\n\n\t#msg {\n\t\tflex: 1;\n\t\tmargin: 0 .5em;\n\t\tjustify-content: start;\n\t}\n\n\tinput[readonly], #codeInput[readonly] {\n\t\tbackground-color: initial;\n\t\tborder-color: transparent;\n\t}\n\n`)
customElements.define("wsp-item-creator",ItemCreator)
class ExtAction extends Action{constructor(ext){super(ext)
this._label=ext}execute(ctx,ev){ctx.setExt(this._id)}}
//# sourceMappingURL=itemCreator.js.map