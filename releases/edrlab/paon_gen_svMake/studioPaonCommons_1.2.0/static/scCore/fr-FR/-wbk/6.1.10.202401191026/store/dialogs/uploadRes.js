import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{URLTREE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/urlTree.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{SelectRes,SelectResBrowseArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/dialogs/selectRes.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{EditMetasRes}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/dialogs/editMetasRes.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{EditPrcIdent}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/dialogs/editPrcIdent.js"
export class UploadRes extends BaseElement{get holder(){return this.config.holder||POPUP.findPopupableParent(this)}_initialize(init){this.reg=this.findReg(init)
this.result=Object.create(init.otherProps||null)
if(init.processing){const prc=this.reg.env.resTypes.getResTypeByPrc(init.processing)
if(prc===this.reg.env.resTypes.unknownType){init=Object.create(init)
init.processing=null}else{if(prc.prcIsFolder!==!!init.uploadFolder||prc.prcIsNoContent!==!!init.uploadNoContent){init=Object.create(init)
init.uploadFolder=prc.prcIsFolder
init.uploadNoContent=prc.prcIsNoContent}}}this.config=init
this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
if(!init.targetPath&&!init.fixedFolderPath){this.selectPath()}else{this.selectPrcFileName()}}selectPath(){const me=this
const msg=this.config.uploadFolder?"Sélectionnez le dossier dans lequel ajouter un sous-dossier ou le dossier à mettre à jour":"Sélectionnez un dossier dans lequel ajouter le contenu ou la ressource à mettre à jour"
this.shadowRoot.appendChild(JSX.createElement("c-msg",{label:msg,level:"info"}))
const selRes=this.shadowRoot.appendChild((new SelectRes).initialize({reg:this.reg,initialPath:this.config.defaultFolderPath||URLTREE.DEFAULT_PATH_ROOT,boards:[new SelectResBrowseArea],selBtnLabel:"Ajouter...",checkSel:selectRes=>{const resProps=selectRes.currentSel
if(this.config.uploadFolder){if(!selectRes.updateFolderBtn){selectRes.updateFolderBtn=(new Button).initialize({reg:this.reg,label:"Mettre à jour...",title:"Mettre à jour l\'accueil de ce dossier",uiContext:"dialog"})
selectRes.updateFolderBtn.onclick=()=>{this.result.path=URLTREE.extractUnversionedLeafPath(selectRes.currentSel.permaPath)
this.selectPrcFileName()}
selectRes.doBtn.title="Ajouter un sous-dossier à ce dossier"
selectRes.doBtn.parentElement.insertBefore(selectRes.updateFolderBtn,selectRes.doBtn)}if(!resProps||!this.isFolder(resProps)){selectRes.updateFolderBtn.disabled=true
return msg}selectRes.updateFolderBtn.disabled=false}else{if(!resProps)return msg
if(this.isFolder(resProps)){selectRes.doBtn.label="Ajouter..."
selectRes.doBtn.title="Ajouter dans ce dossier"}else{selectRes.doBtn.label="Remplacer..."
selectRes.doBtn.title="Remplacer cette ressource avec le nouveau contenu"}}return true},holder:{close(resProps){if(resProps){if(me.isFolder(resProps)&&!me.result.path){me.config.fixedFolderPath=resProps.permaPath}else{const type=me.reg.env.resTypes.getResTypeFor(resProps)
if(type.prcIsFolder===!!me.config.uploadFolder){if(resProps.metas)Object.assign(me.result,resProps.metas)
me.result.processing=resProps.prc
me.result.olderResId=resProps.resId}me.result.path=URLTREE.extractUnversionedLeafPath(resProps.permaPath)}me.selectPrcFileName()}else{me.cancel()}return true}}}))
VIEWS.onViewShown(selRes)}selectPrcFileName(){var _a
const me=this
const knownTargetPath=(_a=this.result.path)!==null&&_a!==void 0?_a:this.config.targetPath
if(knownTargetPath!=null&&this.config.processing){me.result.path=knownTargetPath
me.result.processing=this.config.processing
this.editMetas()
return}VIEWS.clearContent(this.shadowRoot,true)
const prc=this.config.processing?this.reg.env.resTypes.getResTypeByPrc(this.config.processing):null
const editPrcIdent=this.shadowRoot.appendChild((new EditPrcIdent).initialize({reg:this.reg,folderPath:this.config.fixedFolderPath||URLTREE.extractParentPath(knownTargetPath)||this.config.defaultFolderPath||URLTREE.DEFAULT_PATH_ROOT,folderUi:knownTargetPath!=null||this.config.fixedFolderPath!=null?"readOnly":"editable",leafName:knownTargetPath!=null?URLTREE.extractLeafName(knownTargetPath):this.config.initialFileName||null,leafUi:knownTargetPath!=null?URLTREE.isRootPath(knownTargetPath)?"hidden":"readOnly":"editable",resUpdatable:"always",otherMetasIn:this.result,resTypesTree:{resTypes:prc?[prc]:this.reg.env.resTypes.getResTypesTree(resType=>resType.prcIsFolder===!!this.config.uploadFolder&&resType.prcIsNoContent===!!this.config.uploadNoContent)},defaultPrc:this.result.processing,holder:{close(result){if(result){Object.assign(me.result,result)
me.editMetas()}else{me.cancel()}return true}}}))
VIEWS.onViewShown(editPrcIdent)}async editMetas(){const me=this
const resType=this.reg.env.resTypes.getResTypeByPrc(this.result.processing)
const editMetasCode=resType.reg.getPref("editMetas.beforeUpload","editMetas")
if(!editMetasCode||!resType.resForm(editMetasCode)){this.finish()
return}let reg
try{reg=this.reg.env.universe.newDepotResUiRegInCreation(this.reg,this.result.path,resType)
if(this.result.olderResId!=null){const fullNodeInfos=await this.reg.env.universe.adminUrlTree.nodeInfos(this.result.path)
if(fullNodeInfos){reg.env.nodeInfos=fullNodeInfos
me.result.olderResId=fullNodeInfos.resId}else{this.result.olderResId=undefined}}VIEWS.clearContent(this.shadowRoot,true)
const editMetas=this.shadowRoot.appendChild((new EditMetasRes).initialize({reg:reg,defaultValues:this.result,holder:{close(cidMetas){reg.close()
if(cidMetas){Object.assign(me.result,cidMetas)
me.finish()}else{me.cancel()}return true}}}))
VIEWS.onViewShown(editMetas)}catch(e){this.cancel()
reg.close()
throw e}}cancel(){var _a;(_a=this.holder)===null||_a===void 0?void 0:_a.close(null)}finish(){var _a;(_a=this.holder)===null||_a===void 0?void 0:_a.close(this.result)}isFolder(resProps){return resProps.t==="home"||resProps.t==="noContent"}}REG.reg.registerSkin("store-upload-res",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tflex-direction: column;\n\t}\n\n\tc-msg {\n\t\tflex: 0 0 auto;\n\t\tpadding: .5em;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\tstore-add-res {\n\t\twidth: unset;\n\t\tmax-width: unset;\n\t}\n`)
customElements.define("store-upload-res",UploadRes)

//# sourceMappingURL=uploadRes.js.map