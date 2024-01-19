import{Action,ActionHackCtx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{InfoFocusRes,InfoUpdatePendingRes}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/res.js"
import{URLTREE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/urlTree.js"
import{EStoreAspects}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/depot.js"
import{UtSelector}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/dialogs/utSelector.js"
import{UtBrowserFetcher}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/utBrowser.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/actions/actions_Perms.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
import{isRespError}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
export class ResEditAction extends Action{static getUiCtx(ctx,ev){return ctx.emitter||(ev===null||ev===void 0?void 0:ev.target)||ctx.reg.env.uiRoot}static getInfoBroker(ctx){return ctx.infoBroker||ctx.reg.env.infoBroker}static async sendCidUpdate(cidMetas,ctx,uiCtx,returnProps){var _a
const cid=ctx.reg.env.universe.cid
try{const promise=cid.syncSend({cidMetas:cidMetas,returnProps:returnProps?returnProps.concat(ReturnProps):ReturnProps});(_a=ResEditAction.getInfoBroker(ctx))===null||_a===void 0?void 0:_a.dispatchInfo(new InfoUpdatePendingRes(cidMetas.path,promise),uiCtx)
const result=await promise
if(result.scCidSessStatus!=="commited"){ERROR.showError({msg:cid.extractCidLocalizedErrorMsg(result),cause:null,ctx:null,adminDetails:JSON.stringify(result)})}return result}catch(e){if(isRespError(e)&&e.response.status===403){ERROR.report("Vous ne disposez pas des autorisations nécessaires pour effectuer cette modification.",e)}else{ERROR.report("Une erreur est survenue durant cette modification.",e)}throw e}}isVisible(ctx){var _a
if(!this.showEvenIfMoved&&ctx.reg.env.nodeInfos.t==="moved")return false
if(ctx.reg.env.resType.prcVersionning==="VCS"&&((_a=ctx.reg.env.nodeInfos.succ)===null||_a===void 0?void 0:_a.length)>0)return false
return super.isVisible(ctx)}}export class AddByImport extends ResEditAction{constructor(id){super(id||"addByImport")
this._label="Ressource"
this._description="Ajouter une ressource"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/addRes.svg"
this._group="edit"
this._enablePerms="action.store#add.res"}static async editMetas(metasIn,ctx,uiCtx){const resType=ctx.reg.env.resTypes.getResTypeByPrc(metasIn.processing)
const editMetasCode=resType.reg.getPref("editMetas.beforeUpload","editMetas")
if(!editMetasCode||!resType.resForm(editMetasCode))return metasIn
const EditMetasRes=(await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/dialogs/editMetasRes.js")).EditMetasRes
const metasOut=Object.assign({},metasIn)
const reg=ctx.reg.env.universe.newDepotResUiRegInCreation(ctx.reg,metasIn.path,resType)
if(metasIn.olderResId!=null&&resType.prcVersionning!=="VCB"){reg.env.nodeInfos=await ctx.reg.env.universe.adminUrlTree.nodeInfos(metasIn.path)
metasOut.olderResId=reg.env.nodeInfos.resId}const ct=(new EditMetasRes).initialize({reg:reg,skinOver:"webzone:panel",defaultValues:metasIn,formView:editMetasCode})
const metas=await POPUP.showDialog(ct,uiCtx,{titleBar:"Édition des métadonnées...",resizer:{},initWidth:"min(60em, 90vw)",initHeight:"min(40em, 90vh)"}).onNextClose()
if(metas){Object.assign(metasOut,metas)
return metasOut}return null}static async pickFiles(multiple){const input=document.createElement("input")
input.type="file"
if(multiple)input.multiple=true
input.click()
return new Promise(resolve=>{input.onchange=function(){resolve(this.files.length>0?this.files:null)}})}setFiles(files){this.files=files
return this}async execute(ctx,ev){const uiCtx=AddByImport.getUiCtx(ctx,ev)
const libUi=import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/dialogs/editPrcIdent.js")
const files=this.files||await AddByImport.pickFiles(true)
if(files){const EditPrcIdent=(await libUi).EditPrcIdent
const folderPath=ctx.reg.env.resType.prcIsFolder?ctx.reg.env.nodeInfos.permaPath:URLTREE.extractParentPath(ctx.reg.env.nodeInfos.permaPath)
for(let i=0;i<files.length;i++){if(!await this.importFileOrFolder(files[i],folderPath,ctx,uiCtx,i===files.length-1,EditPrcIdent))break}}}async importFileOrFolder(file,parentPath,ctx,uiCtx,isLast,EditPrcIdent){var _a,_b
if(file instanceof File){const ct=(new EditPrcIdent).initialize({reg:ctx.reg,skinOver:"webzone:panel",folderPath:parentPath,leafName:file.name,resTypesTree:{resTypes:ctx.reg.env.resTypes.getResTypesTree(resType=>!resType.prcIsNoContent&&!resType.prcNoCreator)},preview:file})
let cidMetas=await POPUP.showDialog(ct,uiCtx,{titleBar:`Importer \'${file.name}\'`,resizer:{},initWidth:"min(60em, 90vw)",initHeight:"min(40em, 90vh)"}).onNextClose()
if(cidMetas){cidMetas=await AddByImport.editMetas(cidMetas,ctx,uiCtx)
if(cidMetas){const cidResult=await ImportRes.doImport(file,cidMetas,ctx,uiCtx)
if((cidResult===null||cidResult===void 0?void 0:cidResult.scCidSessStatus)==="commited"){if(isLast)(_a=ResEditAction.getInfoBroker(ctx))===null||_a===void 0?void 0:_a.dispatchInfo(new InfoFocusRes(cidResult.path),uiCtx)
return true}}}return!isLast&&await POPUP.confirm("Voulez-vous poursuivre l\'import des fichiers restants ?",uiCtx,{cancelLbl:"Arrêter",okLbl:"Poursuivre"})}else{const result=await AddFolder.createFolder(parentPath,file.name,ctx,uiCtx,EditPrcIdent)
if(!result||result.scCidSessStatus!=="commited"){if(!isLast)return await POPUP.confirm("Voulez-vous poursuivre l\'import des fichiers restants ?",uiCtx,{cancelLbl:"Arrêter",okLbl:"Poursuivre"})
return false}if(file.entries.length>0){for(let i=0;i<file.entries.length;i++){if(!await this.importFileOrFolder(file.entries[i],result.path,ctx,uiCtx,isLast&&i===file.entries.length-1,EditPrcIdent))return false}}else{if(isLast)(_b=ResEditAction.getInfoBroker(ctx))===null||_b===void 0?void 0:_b.dispatchInfo(new InfoFocusRes(result.path),uiCtx)}}return true}}export class AddFolder extends ResEditAction{static async createFolder(folderPath,defaultName,ctx,uiCtx,EditPrcIdent,restTypes){var _a
const ct=(new EditPrcIdent).initialize({reg:ctx.reg,skinOver:"webzone:panel",folderPath:folderPath,leafName:defaultName,resTypesTree:{resTypes:restTypes||ctx.reg.env.resTypes.getResTypesTree(resType=>resType.prcIsFolder&&!resType.prcNoCreator)},doBtnLabel:"Ajouter"})
let cidMetas=await POPUP.showDialog(ct,uiCtx,{titleBar:"Ajouter un dossier...",resizer:{},initWidth:"min(60em, 90vw)",initHeight:"min(40em, 90vh)"}).onNextClose()
if(cidMetas){cidMetas=await AddByImport.editMetas(cidMetas,ctx,uiCtx)
if(cidMetas){try{const cid=ctx.reg.env.universe.cid
const cidResult=await cid.syncSend({cidMetas:cidMetas,returnProps:ReturnProps})
if(cidResult.scCidSessStatus==="commited"){(_a=ResEditAction.getInfoBroker(ctx))===null||_a===void 0?void 0:_a.dispatchInfo(new InfoFocusRes(cidResult.path),uiCtx)}else{await ERROR.showError({msg:cid.extractCidLocalizedErrorMsg(cidResult),cause:null,ctx:null,adminDetails:JSON.stringify(cidResult)})}return cidResult}catch(e){await ERROR.report("Une erreur est survenue durant la création de ce dossier.",e)
throw e}}}return null}constructor(id){super(id||"addFolder")
this._label="Dossier"
this._description="Ajouter un dossier"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/addFolder.svg"
this._group="edit"
this._enablePerms="action.store#add.folder"}isVisible(ctx){if(!ctx.reg.env.resTypes.defaultFolderType)return false
return super.isVisible(ctx)}async execute(ctx,ev){const uiCtx=AddFolder.getUiCtx(ctx,ev)
const EditPrcIdent=(await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/dialogs/editPrcIdent.js")).EditPrcIdent
const folderPath=ctx.reg.env.resType.prcIsFolder?ctx.reg.env.nodeInfos.permaPath:URLTREE.extractParentPath(ctx.reg.env.nodeInfos.permaPath)
return AddFolder.createFolder(folderPath,"",ctx,uiCtx,EditPrcIdent)}}export class RenameRes extends ResEditAction{constructor(id){super(id||"renameRes")
this._label="Renommer..."
this._description="Renommer cette ressource"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/renameRes.svg"
this._group="edit"
this._enablePerms="action.store#rename.res"}isVisible(ctx){if(URLTREE.isRootPath(ctx.reg.env.nodeInfos.permaPath))return false
if(ctx.reg.env.resTypes.hasAnyVCB())return false
return super.isVisible(ctx)}async execute(ctx,ev){const EditMetasRes=(await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/dialogs/editMetasRes.js")).EditMetasRes
const uiCtx=AddFolder.getUiCtx(ctx,ev)
const resPath=ctx.reg.env.path
let reg=ctx.reg
try{if(reg.env.nodeInfos&&!reg.env.nodeInfos.metas){reg=reg.env.universe.newDepotResUiRegFromDepotUiReg(reg,resPath)}const config={reg:reg,skinOver:"webzone:panel",formIdent:{folderUi:"hidden",folderPath:URLTREE.extractParentPath(resPath),resUpdatable:"ifInTrash"}}
const ct=(new EditMetasRes).initialize(config)
await ct.initializedAsync
const cidMetas=await POPUP.showDialog(ct,uiCtx,{titleBar:`Identité de ${resPath}`,resizer:{}}).onNextClose()
if(cidMetas!=null){try{const cid=ctx.reg.env.universe.cid
const infoBroker=ResEditAction.getInfoBroker(ctx)
const cidResult=await cid.syncSend({cidMetas:cidMetas,returnProps:ReturnProps})
if(cidResult.scCidSessStatus==="commited"){infoBroker===null||infoBroker===void 0?void 0:infoBroker.dispatchInfo(new InfoFocusRes(cidResult.path),uiCtx)}else{await ERROR.showError({msg:cid.extractCidLocalizedErrorMsg(cidResult),cause:null,ctx:null,adminDetails:JSON.stringify(cidResult)})}return cidResult}catch(e){await ERROR.report("Une erreur est survenue durant ce renommage.",e)
throw e}}}finally{if(reg!==ctx.reg)reg.close()}}}export class MoveRes extends ResEditAction{constructor(id){super(id||"moveRes")
this._label="Déplacer..."
this._description="Déplacer ce contenu"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/moveRes.svg"
this._group="edit"
this._enablePerms="action.store#moveFrom.res"}isVisible(ctx){if(URLTREE.isRootPath(ctx.reg.env.nodeInfos.permaPath))return false
if(ctx.reg.env.resTypes.hasAnyVCB())return false
return super.isVisible(ctx)}async execute(ctx,ev){const fromPath=ctx.reg.env.nodeInfos.permaPath
const fromFolder=URLTREE.extractUnversionedPath(URLTREE.extractParentPath(fromPath))
const uiCtx=MoveRes.getUiCtx(ctx,ev)
const ct=(new UtSelector).initialize({reg:ctx.reg,skinOver:"webzone:panel",initialPath:fromFolder,checkSel:utSelector=>{var _a
const selPath=URLTREE.extractUnversionedPath((_a=utSelector.currentSel)===null||_a===void 0?void 0:_a.permaPath)
if(selPath===fromFolder)return"Sélectionnez le dossier cible du déplacement"
if(selPath&&URLTREE.isDescendantPathOrEqual(fromPath,selPath))return"Un déplacement dans sa propre descendance est impossible"
return true},selBtnLabel:"Déplacer",utBrowser:{fetcher:new UtBrowserFetcher(ctx.reg.env.universe.adminUrlTree).setFilter("isFolder")}})
const name=URLTREE.extractUnversionedLeafName(fromPath)
const folder=await POPUP.showDialog(ct,uiCtx,{titleBar:`Déplacer \'${name}\' vers...`,initWidth:"min(90vw, 40em)",initHeight:"min(90vh, 30em)"}).onNextClose()
if(folder){try{const cid=ctx.reg.env.universe.cid
const infoBroker=ResEditAction.getInfoBroker(ctx)
const cidResult=await cid.syncSend({cidMetas:{olderPath:fromPath,path:URLTREE.appendToPath(folder.permaPath,name)},returnProps:ReturnProps})
if(cidResult.scCidSessStatus==="commited"){infoBroker===null||infoBroker===void 0?void 0:infoBroker.dispatchInfo(new InfoFocusRes(cidResult.path),uiCtx)}else{await ERROR.showError({msg:cid.extractCidLocalizedErrorMsg(cidResult),cause:null,ctx:null,adminDetails:JSON.stringify(cidResult)})}return cidResult}catch(e){await ERROR.report("Une erreur est survenue durant le déplacement.",e)
throw e}}}}export class VisStateRes extends ResEditAction{constructor(id){super(id||"visStateRes")
this._group="edit"}getDescription(ctx){return ctx.reg.env.resTypes.visStateDescription(ctx.reg.env.nodeInfos)}getLabel(ctx){return ctx.reg.env.resTypes.visStateLabel(ctx.reg.env.nodeInfos)}getIcon(ctx){return ctx.reg.env.resTypes.visStateIconUrl(ctx.reg.env.nodeInfos)}isVisible(ctx){if(!super.isVisible(ctx))return false
if(URLTREE.isRootPath(ctx.reg.env.nodeInfos.permaPath))return false
return ctx.reg.env.universe.hasAspect(EStoreAspects.trash)||ctx.reg.env.universe.hasAspect(EStoreAspects.unlisted)}isMenu(ctx){return true}getDatas(api,ctx){if(api!=="menu")return
const actions=[new VisStateVisible]
const u=ctx.reg.env.universe
if(u.hasAspect(EStoreAspects.unlisted))actions.push(new VisStateLimited)
if(u.hasAspect(EStoreAspects.trash))actions.push(new VisStateInvisible)
return actions}}class VisState extends ResEditAction{constructor(id){super(id)
this._group="edit"
this.initState()}isToggle(ctx){return true}isEnabled(ctx){const perms=this.getPerms(ctx)
if(perms&&!this.checkObjectRootPerm(ctx,perms,true))return false
return!this.getDatas("toggle",ctx)}getLabel(ctx){return ctx.reg.env.resTypes.visStateLabel(this)}getDescription(ctx){return ctx.reg.env.resTypes.visStateDescription(this)}getIcon(ctx){return ctx.reg.env.resTypes.visStateIconUrl(this)}}export class VisStateVisible extends VisState{initState(){this.trashed=false
this.unlisted=false}getDatas(api,ctx){if(api!=="toggle")return
const ni=ctx.reg.env.nodeInfos
return!ni.trashed&&!ni.unlisted}async execute(ctx,ev){const ni=ctx.reg.env.nodeInfos
return ResEditAction.sendCidUpdate({path:ctx.reg.env.nodeInfos.permaPath,olderResId:"",trashed:ctx.reg.env.universe.hasAspect(EStoreAspects.trash)||ni.trashed?false:undefined,unlisted:ctx.reg.env.universe.hasAspect(EStoreAspects.unlisted)||ni.unlisted?false:undefined},ctx,ResEditAction.getUiCtx(ctx,ev))}getPerms(ctx){const ni=ctx.reg.env.nodeInfos
if(ni.trashed)return ni.unlisted?["action.store#untrash.res","action.store#relist.res"]:"action.store#untrash.res"
return ni.unlisted?"action.store#relist.res":null}}export class VisStateLimited extends VisState{initState(){this.trashed=false
this.unlisted=true}getDatas(api,ctx){if(api!=="toggle")return
const ni=ctx.reg.env.nodeInfos
return!ni.trashed&&ni.unlisted||false}async execute(ctx,ev){return ResEditAction.sendCidUpdate({path:ctx.reg.env.nodeInfos.permaPath,olderResId:"",trashed:ctx.reg.env.universe.hasAspect(EStoreAspects.trash)?false:undefined,unlisted:true},ctx,ResEditAction.getUiCtx(ctx,ev))}getPerms(ctx){return"action.store#unlist.res"}}export class VisStateInvisible extends VisState{initState(){this.trashed=true
this.unlisted=false}getDatas(api,ctx){if(api!=="toggle")return
return!!ctx.reg.env.nodeInfos.trashed}async execute(ctx,ev){return ResEditAction.sendCidUpdate({path:ctx.reg.env.nodeInfos.permaPath,olderResId:"",trashed:true,unlisted:ctx.reg.env.universe.hasAspect(EStoreAspects.unlisted)?false:undefined},ctx,ResEditAction.getUiCtx(ctx,ev))}getPerms(ctx){return"action.store#trash.res"}}export class RemoveRes extends ResEditAction{constructor(id){super(id||"removeRes")
this._description="Supprimer définitivement cette ressource (restauration impossible)"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/removeRes.svg"
this._group="edit"
this._enablePerms="action.store#remove.res"
this.showEvenIfMoved=true}isVisible(ctx){if(URLTREE.isRootPath(ctx.reg.env.nodeInfos.permaPath))return false
return super.isVisible(ctx)}getLabel(ctx){if(!this._label)return ctx.reg.env.resType.prcVersionning==="VCB"?"Supprimer définitivement cette version":"Supprimer définitivement"
return super.getLabel(ctx)}async execute(ctx,ev){const uiCtx=ResEditAction.getUiCtx(ctx,ev)
if(await POPUP.confirm("Supprimer définitivement cette ressource ? Attention, aucune restauration ne sera possible.",uiCtx,{okLbl:"Supprimer définitivement"})){return ResEditAction.sendCidUpdate({path:ctx.reg.env.nodeInfos.permaPath,action:ctx.reg.env.resType.prcVersionning==="VCB"?"removeNode":"removeAll"},ctx,uiCtx)}}}export class ImportRes extends ResEditAction{static async doImport(file,cidMetas,ctx,uiCtx){var _a,_b
const progress=POPUP.showProgress(uiCtx,"Import en cours...")
try{const req={cidMetas:cidMetas,body:file,createMetas:true,progress:progress.progressCallback,returnProps:ReturnProps}
const cid=ctx.reg.env.universe.cid
const sess=cid.newSession()
await sess.send(req)
const titleBar=(_a=progress.windowBar)===null||_a===void 0?void 0:_a.barLabel
if(titleBar)titleBar.label="Traitement en cours..."
progress.onProgress(1,undefined)
const promise=sess.waitForEndSession(ReturnProps,750,resp=>{const details=resp===null||resp===void 0?void 0:resp.scCidSessDetails
if(details){let done=0
let total=0
for(let step of details){if(step.type.startsWith("step")){total++
if(step.type==="stepDone")done++}}progress.onProgress(done,total)}});(_b=ResEditAction.getInfoBroker(ctx))===null||_b===void 0?void 0:_b.dispatchInfo(new InfoUpdatePendingRes(cidMetas.path,promise),ctx.emitter)
const cidResult=await promise
if(cidResult.scCidSessStatus!=="commited"){await ERROR.showError({msg:cid.extractCidLocalizedErrorMsg(cidResult),cause:null,ctx:null,adminDetails:JSON.stringify(cidResult)})}return cidResult}catch(e){await ERROR.report("Une erreur est survenue durant l\'envoi de ce contenu.",e)
throw e}finally{progress.close()}}constructor(id){super(id||"importRes")
this._label="Importer..."
this._description="Importer un nouveau contenu pour cette ressource"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/importRes.svg"
this._group="edit"
this._enablePerms="action.store#import.res"}isVisible(ctx){if(ctx.reg.env.resType.prcIsNoContent)return false
return super.isVisible(ctx)}async execute(ctx,ev){const uiCtx=AddByImport.getUiCtx(ctx,ev)
const ni=ctx.reg.env.nodeInfos
const files=await AddByImport.pickFiles(false)
if(files)return ImportRes.doImport(files[0],{path:URLTREE.extractUnversionedLeafPath(ni.permaPath),olderResId:ni.resId,olderTs:ni.m},ctx,uiCtx)}}const ReturnProps=["scCidSessStatus","scCidSessDetails","resId","path","processing"]
export class EditMetasRes extends ResEditAction{constructor(id){super(id||"editMetas")
this._label="Modifier les métadonnées"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/editMetas.svg"
this._group="edit"
this._enablePerms="action.store#edit.metasRes"}isVisible(ctx){if(!super.isVisible(ctx))return false
return ctx.reg.env.resType.resForm("editMetas")!=null}async execute(ctx,ev){const uiCtx=ResEditAction.getUiCtx(ctx,ev)
const resPath=ctx.reg.env.path
const{EditMetasRes:EditMetasRes}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/dialogs/editMetasRes.js")
let reg=ctx.reg
try{if(reg.env.nodeInfos&&!reg.env.nodeInfos.metas){reg=reg.env.universe.newDepotResUiRegFromDepotUiReg(reg,resPath)}const ct=(new EditMetasRes).initialize({reg:reg,skinOver:"webzone:panel"})
await ct.initializedAsync
if(ctx.reg.isClosed)return
const path=reg.env.resTypes.humanPath(resPath)
const cidMetas=await POPUP.showDialog(ct,uiCtx,{titleBar:`Métadonnées de ${path}`,resizer:{}}).onNextClose()
if(cidMetas){return ResEditAction.sendCidUpdate(cidMetas,ctx,uiCtx)}}finally{if(reg!==ctx.reg)reg.close()}}}export class EditPermsRes extends ResEditAction{constructor(id){super(id||"editUserRoleOnRes")
this._label="Permissions..."
this._description="Définir les rôles des utilisateurs sur cette ressource ou ce dossier et ses contenus"
this._group="edit"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/editPerms.svg"
this.requireEnabledPerm(["action.store#edit.res.perms","admin.UTNode.configRoles.byAdmin"])}async execute(ctx,ev){const reg=ctx.reg
const uiCtx=ResEditAction.getUiCtx(ctx,ev)
const{ObjRolesMapEdit:ObjRolesMapEdit}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/objRolesMap.js")
const path=reg.env.resTypes.humanPath(reg.env.path)
const objThis=Object.create(ctx)
await POPUP.showDialog((new ObjRolesMapEdit).initialize({reg:reg,uiContext:"popup",rolesUiLayerSng:"res",objThis:objThis,objFetchRolesMap:async(objThis,pAccounts)=>{objThis.lastFetch=await objThis.reg.env.universe.adminUrlTree.fetchUserRolesMap(objThis.reg.env.path)
return objThis.lastFetch.userRolesMap},objFetchRolesMapForAccounts:async(objThis,pAccounts)=>{const nodeInfosForAccounts=await objThis.reg.env.universe.adminUrlTree.fetchUserRolesMapForAccounts(objThis.reg.env.path,pAccounts)
return nodeInfosForAccounts===null||nodeInfosForAccounts===void 0?void 0:nodeInfosForAccounts.userRolesMap},objEditRolesMap:async(objThis,rolesMap)=>{const userRolesMap=Object.assign({},objThis.lastFetch.userRolesMap)
for(const k of Object.keys(rolesMap))userRolesMap[k]=rolesMap[k]===null?undefined:rolesMap[k]
try{const newMetas={path:objThis.reg.env.path,olderResId:objThis.lastFetch.resId||"",userRolesMap:userRolesMap}
if(!newMetas.olderResId){newMetas.processing=objThis.reg.env.universe.resTypes.defaultFolderType.prc}const result=await ResEditAction.sendCidUpdate(newMetas,ctx,uiCtx,["userRolesMap"])
if(result)objThis.lastFetch={permaPath:result.path,resId:result.resId,userRolesMap:result.userRolesMap}
return(result===null||result===void 0?void 0:result.userRolesMap)||null}catch(e){return null}},addAnonymousAccount:reg.env.universe.urlTree.anonymousAccount,objEditRolesMapPerms:["action.store#edit.res.perms","admin.UTNode.configRoles.byAdmin"]}),reg.env.uiRoot,{titleBar:{barLabel:{label:`Permissions sur \'${path}\'`},closeButton:{}},resizer:{},initWidth:"40em",initHeight:"40em"}).onNextClose()}}export class SwitchProcessing extends ResEditAction{constructor(id){super(id||"switchPrc")
this._group="edit"
this._enablePerms="action.store#edit.metasRes"}setPrcTarget(prc){this.prcTarget=prc
return this}setConfirmMsg(confirmMsg){this.confirmMsg=confirmMsg
return this}async execute(ctx,ev){const uiCtx=ResEditAction.getUiCtx(ctx,ev)
const resPath=ctx.reg.env.path
const resTypeTarget=ctx.reg.env.resTypes.getResTypeByPrc(this.prcTarget)
let file
if(!this.confirmMsg||await POPUP.confirm(typeof this.confirmMsg==="string"?this.confirmMsg:this.confirmMsg(ctx),uiCtx)){if(!resTypeTarget.prcIsNoContent){const files=await AddByImport.pickFiles(false)
if(!files)return
file=files[0]}const editMetas=resTypeTarget.resForm("editMetas")
let cidMetas
const{EditMetasRes:EditMetasRes}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/dialogs/editMetasRes.js")
if(editMetas){const reg=ctx.reg.env.universe.newDepotResUiRegFromDepotUiReg(ctx.reg,resPath)
try{const ct=(new EditMetasRes).initialize({reg:reg,skinOver:"webzone:panel",overrideValues:(editMetas,values)=>{values.processing=this.prcTarget
reg.env.universe.forceNewProcessing(reg,resTypeTarget)
return values}})
await ct.initializedAsync
if(ctx.reg.isClosed)return
cidMetas=await POPUP.showDialog(ct,uiCtx,{titleBar:this.getLabel(ctx),resizer:{}}).onNextClose()}finally{reg.close()}}else{cidMetas={processing:this.prcTarget,path:resPath,olderResId:ctx.reg.env.nodeInfos.resId}}if(cidMetas){if(file){const infoBroker=ResEditAction.getInfoBroker(ctx)
const cidResult=await ImportRes.doImport(file,cidMetas,ctx,uiCtx)
if(cidResult&&cidResult.scCidSessStatus==="commited")infoBroker===null||infoBroker===void 0?void 0:infoBroker.dispatchInfo(new InfoFocusRes(cidResult.path),uiCtx)}else{return ResEditAction.sendCidUpdate(cidMetas,ctx,uiCtx)}}}}}export class OpenViewRes extends Action{constructor(subPath,directive,id){super(id||"openViewRes")
this.subPath=subPath
this.directive=directive
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/views/resViews/openInNewTab.svg")
this.setLabel("Ouvrir")
this.setDescription(Desk.electron?"Ouvrir dans votre navigateur":"Ouvrir dans un onglet")
this._group="views"}isVisible(ctx){if(ctx.reg.env.nodeInfos.trashed)return false
return super.isVisible(ctx)}async execute(ctx,ev){window.open(ctx.reg.env.universe.urlTree.urlFromPath(URLTREE.appendToPath(ctx.reg.env.nodeInfos.permaPath,this.subPath),this.directive),"_blank")}}export class DownloadRes extends Action{constructor(subPath,id){super(id||"download")
this.subPath=subPath
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/views/resViews/downloadRes.svg")
this.setLabel("Télécharger")
this._group="views"}isVisible(ctx){if(ctx.reg.env.nodeInfos.t==="moved")return false
return super.isVisible(ctx)}async execute(ctx,ev){const link=JSX.createElement("a",null)
link.href=ctx.reg.env.universe.urlTree.urlFromPath(URLTREE.appendToPath(ctx.reg.env.nodeInfos.permaPath,this.subPath),"download&evenIfTrashed")
link.download=ctx.reg.env.resType.resName(ctx.reg.env.nodeInfos)
link.click()}}export class Depot2ResCtxAction extends ActionHackCtx{isVisible(ctx){if(ctx.resList.length!==1)return false
return super.isVisible(ctx)}isEnabled(ctx){if(ctx.resList.length!==1)return false
return super.isEnabled(ctx)}wrapCtx(ctx){if(ctx.resList.length!==1)return null
const res=ctx.resList[0]
const type=ctx.reg.env.resTypes.getResTypeFor(res)
return{reg:type.newShortResRegFromDepotReg(ctx.reg,res),infoBroker:ctx.infoBroker,emitter:ctx.emitter}}}
//# sourceMappingURL=resActions.js.map