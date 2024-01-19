import{BaseElement,BASIS,isEltInitableAsyncPending}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{ResTypesTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/widgets/resTypesTree.js"
import{URLTREE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/urlTree.js"
import{FORMS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
export class EditPrcIdent extends BaseElement{get holder(){return this._holder||POPUP.findPopupableParent(this)}_initialize(init){var _a
this.reg=this.findReg(init)
this._holder=init.holder
this.config=init
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("standard-dialog",sr)
this.reg.installSkin("form-control-areas",sr)
this._initAndInstallSkin(this.localName,init)
if(init.preview&&((_a=init.preview.type)===null||_a===void 0?void 0:_a.startsWith("image/"))){const img=sr.appendChild(JSX.createElement("img",{id:"preview"}))
img.src=URL.createObjectURL(init.preview)
this.classList.add("preview")}this.mainTag=sr.appendChild(JSX.createElement("main",null))
this.resTypesTree=(new ResTypesTree).initialize(BASIS.newInit(init.resTypesTree,this.reg))
this.mainTag.appendChild(JSX.createElement("div",{id:"resTypes"},JSX.createElement("label",null,"Traitement"),this.resTypesTree))
this.addEventListener("grid-select",this.onResTypeSelected)
this.identForm=this.mainTag.appendChild(JSX.createElement("form",null))
let doLabel
if(typeof init.doBtnLabel==="function"){this.doBtnLabel=init.doBtnLabel
doLabel=""}else{doLabel=init.doBtnLabel||"Importer"}const footer=sr.appendChild(JSX.createElement("div",{id:"footer"}))
this.msgArea=footer.appendChild(JSX.createElement("c-msg",{id:"msg"}))
this.doBtn=footer.appendChild(JSX.createElement(Button,{id:"import",label:doLabel,class:"default","ui-context":"dialog",onclick:this.onDoBtn}))
this.cancelBtn=footer.appendChild(JSX.createElement(Button,{id:"cancel",label:"Annuler","ui-context":"dialog",onclick:this.onCancelBtn}))
this.onkeypress=this.onKeypress
if(this.resTypesTree.countResTypesUntil(2)===1){this.resTypesTree.selectFirst()
DOM.setHidden(this.resTypesTree.parentElement,true)}else{this.classList.add("resTypes")
let prcFound=null
if(init.defaultPrc){prcFound=this.resTypesTree.findAndSelect(resType=>resType.prc===init.defaultPrc)}if(!prcFound&&init.leafName){prcFound=this.resTypesTree.findAndSelect(resType=>resType.matchResName(init.leafName))}if(!prcFound){const defaultRes=this.reg.env.resTypes.defaultResFileType
if(defaultRes)prcFound=this.resTypesTree.findAndSelect(resType=>resType===defaultRes)
if(!prcFound){const defaultFolder=this.reg.env.resTypes.defaultFolderType
if(defaultFolder)prcFound=this.resTypesTree.findAndSelect(resType=>resType===defaultFolder)}}}}_refresh(){}async makeCidParams(){if(this.resType){if(await FORMS.checkAsyncValidity(this.identForm)){const metas={processing:this.resType.prc}
FORMS.formToJson(this.identForm,metas)
return metas}else{FORMS.reportValidity(this.identForm)}}return null}async onResTypeSelected(ev){var _a
if(ev)ev.stopImmediatePropagation()
const newResType=this.resTypesTree.getSelectedResType()
if(this.resType===newResType)return
this.resType=newResType
if(this.resType==null){this.currentIdentFormArea=null
this.identForm.textContent=null
if(this.resTypesTree.countResTypesUntil(1)===0){this.msgArea.setCustomMsg("Aucun traitement n\'est compatible","error")}else{this.msgArea.setCustomMsg("Sélectionnez un traitement dans la liste","warning")}this.doBtn.disabled=true
if(this.doBtnLabel)this.doBtnLabel(this)
return}const identFormArea=this.resType.resForm("editIdent")
if(this.currentIdentFormArea===identFormArea)return
this.currentIdentFormArea=identFormArea
const currentTarget=this.targetPath
const ctx={reg:this.reg.env.universe.newDepotResUiRegInCreation(this.reg,null,this.resType),folderPath:currentTarget!=null?URLTREE.extractParentPath(currentTarget):this.config.folderPath,folderUi:this.config.folderUi,leafName:currentTarget!=null?URLTREE.extractUnversionedLeafName(currentTarget):this.config.leafName,leafUi:this.config.leafUi,version:currentTarget!=null?URLTREE.extractVersionLeaf(currentTarget):this.config.version,versionUi:this.config.versionUi,resUpdatable:this.config.resUpdatable,buildControlLabel:true,callback:this}
const form=await identFormArea.loadBody(ctx)
this.identForm.textContent=null
this.identForm.appendChild(form)
if(isEltInitableAsyncPending(form))await form.initializedAsync
if(this.config.otherMetasIn)FORMS.jsonToForm(this.config.otherMetasIn,this.identForm);(_a=FORMS.findFirstFocusable(form))===null||_a===void 0?void 0:_a.focus()
this.msgArea.setCustomMsg(null)
this.doBtn.disabled=false
if(this.doBtnLabel)this.doBtnLabel(this)
const popup=POPUP.findPopupableParent(this)
if(popup)popup.updatePosition()}async onKeypress(ev){if(ev.key==="Enter"){const r=await this.makeCidParams()
if(r)this.holder.close(r)}}onCancelBtn(){const me=DOMSH.findHost(this)
me.holder.close()}async onDoBtn(){if(this.disabled)return
const me=DOMSH.findHost(this)
const r=await me.makeCidParams()
if(r)me.holder.close(r)}identState(resState,targetPath,msg,msgLevel){if(this.identForm){this.msgArea.setCustomMsg(msg,msgLevel)
this.doBtn.disabled=resState==="invalid"
if(this.doBtnLabel)this.doBtnLabel(this)
if(resState==="pending")FORMS.checkAsyncValidity(this.identForm)}}}REG.reg.registerSkin("store-edit-prcident",1,`\n\t#preview {\n\t\tflex: 1 3 auto;\n\t\talign-self: center;\n\t\tmax-width: 60vw;\n\t\tmax-height: 10em;\n\t\t/*min-height: 2em;*/\n\t\t/*height: 5em;*/\n\t\tmargin: .5em;\n\t}\n\n\tmain {\n\t\tflex: 1000;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tflex-direction: column;\n\t}\n\n\t#resTypes {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tmin-width: 0;\n\t\tmin-height: 5em;\n\t\tpadding: .3em;\n\t}\n\n\t#preview + #resTypes {\n\t\tborder-top: 1px solid var(--border-color);\n\t}\n\n\tstore-restypes-tree {\n\t\tborder: 1px solid var(--border-color);\n\t}\n\n\t#resTypes[hidden] {\n\t\tdisplay: none;\n\t}\n\n\tlabel {\n\t\tcolor: var(--alt1-color);\n\t}\n\n  :focus-visible {\n\t\toutline: var(--focus-outline);\n\t}\n\n\tform {\n\t\tmargin: .5em;\n\t}\n\n\t#msg {\n\t\tflex: 1;\n\t\tmargin: 0 .5em;\n\t\tjustify-content: start;\n\t}\n`)
customElements.define("store-edit-prcident",EditPrcIdent)

//# sourceMappingURL=editPrcIdent.js.map