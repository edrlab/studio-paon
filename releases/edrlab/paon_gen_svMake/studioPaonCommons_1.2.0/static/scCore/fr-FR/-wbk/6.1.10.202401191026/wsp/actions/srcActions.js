import{POPUP,PopupConfirm}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{SrcNewCode}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/srcNewCode.js"
import{AccelKeyMgr,Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{FolderEntries,InfoFocusItem,InfoFocusNodeInItem,InfoRefreshItemDisplays,InfoSelectUris,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{ESrcSt,SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{ItemCreator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/itemCreator.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{EItemTypeFamily}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{ExportWspAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/wspActions.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{SEC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/security.js"
import{isFolder}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/files.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{Workbench}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/workbench.js"
import{REMOTE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/remote.js"
export class SrcAction extends Action{constructor(){super(...arguments)
this.isNotRemoved=true}isVisible(ctx){if(this.isBackendDb&&ctx.reg.env.wsp.backEnd==="fs")return false
if(this.atLeastOne&&ctx.shortDescs.length<1)return false
if(this.exactOne&&ctx.shortDescs.length!==1)return false
if(this.zeroOrOne&&ctx.shortDescs.length>1)return false
if(this.families||this.noFamilies){const wspMetaUi=ctx.reg.env.wsp.wspMetaUi
for(const shortDesc of ctx.shortDescs){if(ITEM.getSrcUriType(shortDesc.srcUri)==="space")return false
if(this.families&&!wspMetaUi.getItemType(shortDesc.itModel).isFamily(...this.families))return false
if(this.noFamilies&&wspMetaUi.getItemType(shortDesc.itModel).isFamily(...this.noFamilies))return false}}if(!super.isVisible(ctx))return false
return this.checkSrcPermsForAll(this._visSrcPerms,ctx)}isEnabled(ctx){if(!super.isEnabled(ctx))return false
if(this.isNotRemoved&&ctx.shortDescs.findIndex(src=>src.srcSt<0)>=0)return false
if(this.isMove){const wspDefProps=ctx.reg.env.wsp.wspDefProps
if(ctx.shortDescs.some(sd=>{if(ITEM.isExtItem(sd.srcUri))return true
if(this.isSrcLayered(wspDefProps,sd)){if(sd.drvState)return true
if(!ctx.reg.hasPermission("action.src#update.outsideLayer",sd.srcRoles,null,sd.srcRi))return true}return false}))return false}return this.checkSrcPermsForAll(this._enableSrcPerms,ctx)}isSrcLayered(wspDefProps,sd){if(wspDefProps.drfRefWsp){return sd.drfState!=="created"&&sd.drfState!=="createdDeleted"}else if(wspDefProps.drvAxis){if(sd.drvState.startsWith("created"))return false
if(sd.drvState==="erased"&&sd.drvAxisDefCo===null)return false
return true}return false}getFirstSrcUri(ctx){return ctx.shortDescs.length>=1?ctx.shortDescs[0].srcUri:null}checkSrcPermsForAll(perms,ctx){if(perms){const reg=REG.getReg(ctx)
if(ctx.shortDescs.length===0){if(!reg.hasPerm(perms))return false}else{for(const sd of ctx.shortDescs)if(!reg.hasPermission(perms,sd.srcRoles,null,sd.srcRi))return false}}return true}requireSrcVisiblePerm(perms){if(perms){if(Array.isArray(perms)){for(let i=0;i<perms.length;i++)this.requireSrcVisiblePerm(perms[i])}else{if(!this._visSrcPerms)this._visSrcPerms=[]
if(this._visSrcPerms.indexOf(perms)==-1)this._visSrcPerms.push(perms)}}return this}requireSrcEnabledPerm(perms){if(perms){if(Array.isArray(perms)){for(let i=0;i<perms.length;i++)this.requireSrcEnabledPerm(perms[i])}else{if(!this._enableSrcPerms)this._enableSrcPerms=[]
if(this._enableSrcPerms.indexOf(perms)==-1)this._enableSrcPerms.push(perms)}}return this}}export class ShortDescCopy extends SrcAction{constructor(id){super(id||"copy")
this._label="Copier"
this._group="clipboard"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/copyItem.svg"
this.atLeastOne=true}execute(ctx,ev){return ITEM.setShortDescTransferToClipboard(ctx)}}ShortDescCopy.SINGLETON=new ShortDescCopy
export class FocusItem extends SrcAction{static gotoItem(infoBroker,sd,from){if(infoBroker&&sd){if(sd.itSubItem){infoBroker.dispatchInfo(new InfoFocusNodeInItem(`//*[@xml:id='${sd.itSubItem.id}']`,SRC.srcRef(sd),sd),from)}else{infoBroker.dispatchInfo(new InfoFocusItem(SRC.srcRef(sd),sd),from)}}}constructor(id){super(id||"focusItem")
this._label="Afficher cet item"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/showItem.svg"
this._group="open"
this.exactOne=true
this.isNotRemoved=false}isVisible(ctx){if(!ctx.infoBroker)return false
if(ITEM.getSrcUriType(this.getFirstSrcUri(ctx)||"")==="space")return false
return super.isVisible(ctx)}isVisibleSuper(ctx){return super.isVisible(ctx)}isEnabled(ctx){if(ITEM.getSrcUriType(this.getFirstSrcUri(ctx)||"")!=="item")return false
return super.isEnabled(ctx)}isEnabledSuper(ctx){return super.isEnabled(ctx)}execute(ctx,ev){FocusItem.gotoItem(ctx.infoBroker,ctx.shortDescs[0],ctx.emitter)}}export class FocusItemSelRef extends FocusItem{execute(ctx,ev){var _a;(_a=ctx.reg.env.wedSearchCoord)===null||_a===void 0?void 0:_a.setParamsOnce({searchId:"item",findRef:SRC.srcRef(ctx.reg.env.longDesc)})
super.execute(ctx,ev)}}FocusItemSelRef.SINGLETON=new FocusItemSelRef
export class FocusItemOrSpace extends FocusItem{getLabel(ctx){return ITEM.getSrcUriType(this.getFirstSrcUri(ctx)||"")==="space"?"Explorer cet espace":"Afficher cet item"}isVisible(ctx){if(!ctx.infoBroker)return false
return super.isVisibleSuper(ctx)}isEnabled(ctx){if(!this.getFirstSrcUri(ctx))return false
return super.isEnabledSuper(ctx)}}export class OpenFastFindItem extends Action{static async fastFind(reg,ev){const target=ev===null||ev===void 0?void 0:ev.target
const{FastFindItem:FastFindItem}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/fastFindItem.js")
return await FastFindItem.openFastFind({reg:reg,itemCreator:reg.getPref("wsp.createItem",true)?ItemCreator.setDefaultConfigFromReg(reg):undefined},target||reg.env.uiRoot,ev).onNextClose()}constructor(){super("fastFindItem")
this._label="Recherche rapide"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/fastFind.svg"
this._group="search"}async execute(ctx,ev){this.doWithResult(ctx,await OpenFastFindItem.fastFind(ctx.reg,ev))}doWithResult(ctx,sd){if(sd&&ctx.reg.env.infoBroker){ctx.reg.env.infoBroker.dispatchInfo(new InfoFocusItem(SRC.srcRef(sd),sd),ctx.reg.env.uiRoot)}}}export class OpenSearchItems extends Action{constructor(kind="item"){super("searchItems")
this.kind=kind
this._label=kind==="item"?"Recherche d\'items...":"Recherche de tâches..."
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/search.svg"
this._group="tools"}async execute(ctx,ev){const{SearchItems:SearchItems}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/searchItems.js")
const{TaskCritForMe:TaskCritForMe}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/search/taskCrit.js")
const{ItemCritTitleRegExp:ItemCritTitleRegExp}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/search/itemCrit.js")
const{UiCritBool:UiCritBool}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/search/uiCrit.js")
const{TplRequestsMenu:TplRequestsMenu}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/searchesActions.js")
if(this.kind==="item")ctx.reg.addToList("actions:searchItems:bar:item","tplRequestsMenu",1,TplRequestsMenu.makeFromSearchPersistLists(ctx,"requests:item","requests:item:searchItems:item"))
else ctx.reg.addToList("actions:searchItems:bar:task","tplRequestsMenu",1,TplRequestsMenu.makeFromSearchPersistLists(ctx,"requests:task","requests:item:searchItems:task"))
const sd=ctx.shortDescs
const ct=(new SearchItems).initialize({reg:ctx.reg,showMainView:true,fromSrcUri:sd&&sd[0]&&sd[0].srcSt>0?sd[0].srcUri:null,fullTextByDefault:true,criterions:ctx.reg.getListAsMap(this.kind==="item"?"wsp.crit.items":"wsp.crit.tasks"),buildCrit:this.kind==="task"?searchItems=>{searchItems.critRoot.appendChild(JSX.createElement("h3",null,"Portée"))
searchItems.critRoot.appendChild(TaskCritForMe.AREA.buildBody(searchItems))
searchItems.critRoot.appendChild(JSX.createElement("h3",null,"Critères"))
const and=searchItems.critRoot.appendChild(UiCritBool.AREA_AND_ROOT.buildBody(searchItems))
and.insertCrit(ItemCritTitleRegExp.AREA.buildBody(searchItems))}:undefined,srcGrid:{defaultAction:new SearchItemsSelItem(ctx),actions:this.kind==="item"?ctx.reg.mergeLists("actions:wsp:shortDesc","actions:searchItem:shortDesc:item"):ctx.reg.mergeLists("actions:wsp:shortDesc:task","actions:searchItem:shortDesc:task"),accelKeyMgr:(new AccelKeyMgr).initFromMapActions(this.kind==="item"?ctx.reg.mergeListsAsMap("accelkeys:searchItem:shortDesc","accelkeys:wsp:shortDesc:item"):ctx.reg.mergeListsAsMap("accelkeys:wsp:shortDesc:task","accelkeys:wsp:shortDesc:task"))},appHeader:{mainActions:ctx.reg.mergeLists(SearchItems.APPBAR_MAIN_ACTIONS,this.kind==="item"?"actions:searchItems:bar:item":"actions:searchItems:bar:task")},searchStore:ctx.reg.getSvc(this.kind==="item"?"searchStore.item":"searchStore.task"),msgs:this.kind==="item"?undefined:{resultsMore:max=>`Plus de ${max} tâches trouvées`,resultsEmpty:"Aucune tâche trouvée",resultsOne:"1 tâche trouvée",resultsCount:count=>`${count} tâches trouvées`}})
await POPUP.showDialog(ct,ctx.reg.env.uiRoot,{titleBar:{barLabel:{label:this.kind==="item"?"Recherche d\'items":"Recherche de tâches"},closeButton:{}},resizer:{},viewPortX:"middle",viewPortY:"middle",initWidth:"90vw",initHeight:"90vh"}).onNextClose()}}class SearchItemsSelItem extends SrcAction{constructor(parentCtx){super("selItem")
this.parentCtx=parentCtx
this.exactOne=true}execute(ctx,ev){const sd=ctx.shortDescs[0]
if(sd&&this.parentCtx.reg.env.infoBroker){POPUP.findPopupableParent(ctx.me).close()
this.parentCtx.reg.env.infoBroker.dispatchInfo(new InfoFocusItem(SRC.srcRef(sd),sd),this.parentCtx.reg.env.uiRoot)}}}export class ShowNetItems extends SrcAction{constructor(){super("showNetItems")
this.workbenchView="netItems"
this._label="Afficher le réseau d\'items..."
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/netItems/netItems.svg"
this._group="tools"
this.exactOne=true
this.noFamilies=[EItemTypeFamily.task]}isVisible(ctx){const workbench=this.findWorkbench(ctx.emitter)
if(!workbench)return false
if(!workbench.getTab(this.workbenchView))return false
return super.isVisible(ctx)}findWorkbench(from){return DOMSH.findFlatParentElt(from,null,n=>n instanceof Workbench)}async execute(ctx,ev){const workbench=this.findWorkbench(ctx.emitter)
if(!workbench)return
const view=await workbench.showView(this.workbenchView)
if(!view)return
const sd=ctx.shortDescs
if(sd&&sd[0])view.setRootSrcRef(ITEM.srcRefSub(sd[0]))}}export class ReloadSrc extends SrcAction{constructor(){super("reloadSrc")
this._label="Recharger"
this._group="other"
this.exactOne=true}isVisible(ctx){if(ITEM.getSrcUriType(this.getFirstSrcUri(ctx)||"")!=="item")return false
return super.isVisible(ctx)}async execute(ctx,ev){var _a
const wsp=ctx.reg.env.wsp
await wsp.wspServer.wspsLive.reloadHouse(WSP.buildWspRef(wsp.code,ctx.shortDescs[0]))
const info=new InfoRefreshItemDisplays(SRC.srcRef(ctx.shortDescs[0]));(_a=ctx.reg.env.infoBroker)===null||_a===void 0?void 0:_a.dispatchInfo(info,this)}}export class CreateItem extends SrcAction{constructor(){super("createItem")
this._label="Créer un item..."
this._group="create"
this.zeroOrOne=true
this._enableSrcPerms=["action.src#create.item"]}async execute(ctx,ev){const{ItemCreator:ItemCreator}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/itemCreator.js")
return ItemCreator.openCreateItem(ItemCreator.setDefaultConfigFromReg(ctx.reg,{itemTypesTree:{textFilter:""},spaceUri:ctx.shortDescs.length>0?ITEM.extractSpaceUri(ctx.shortDescs[0].srcUri):"",spaceUi:"readOnly"}),"Créer un item...",ctx.emitter,ev).onNextClose()}}export class CreateSpace extends SrcAction{constructor(){super("createSpace")
this._label="Créer un espace..."
this._group="create"
this.zeroOrOne=true
this._enableSrcPerms=["action.src#create.space"]}async execute(ctx,ev){var _a
const reg=REG.getReg(ctx)
const{SrcNewCode:SrcNewCode}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/srcNewCode.js")
const parentSrcUri=this.getParentSpace(ctx,ev)
if(ctx.shortDescs&&parentSrcUri!==((_a=ctx.shortDescs[0])===null||_a===void 0?void 0:_a.srcUri)){const parentShortDesc=await WSP.fetchShortDesc(reg.env.wsp,ctx.emitter,parentSrcUri)
if(!reg.hasPermission(this._enableSrcPerms,parentShortDesc.srcRoles,reg.env.universe.auth.currentUser.isSuperAdmin,parentShortDesc.srcRi)){ERROR.show("Vous ne disposez pas des autorisations nécessaires pour effectuer cette création d\'espace.",null,ctx)
return}}const name=ITEM.extractSpaceLabel(parentSrcUri)
const ti=parentSrcUri?`Créer un espace en fils de \"${name}\"`:"Créer un espace à la racine de l\'atelier..."
const ct=(new SrcNewCode).initialize({reg:ctx.reg,parentFolder:parentSrcUri,targetSrcUriType:"space"})
const newCode=await POPUP.showDialog(ct,ctx.emitter,{titleBar:{barLabel:{label:ti}}}).onNextClose()
return newCode?WSP.createSpaceOrFolder(ctx.reg.env.wsp,null,ctx.emitter,SRC.addLeafToUri(parentSrcUri,newCode)):null}getParentSpace(ctx,ev){return ctx.shortDescs.length>0?ITEM.extractSpaceUri(ctx.shortDescs[0].srcUri):""}}export class DeleteSrc extends SrcAction{constructor(){super("delSrc")
this._label="Supprimer"
this._group="edit"
this.atLeastOne=true
this._enableSrcPerms=["write.node.delete"]}async execute(ctx,ev){let ok
if(ctx.shortDescs.length===1){const uri=ctx.shortDescs[0].srcUri
const leafName=SRC.extractLeafFromUri(uri)
switch(ITEM.getSrcUriType(uri)){case"item":ok=await POPUP.confirm(`Supprimer cet item \"${leafName}\" de l\'atelier ?`,ctx.emitter)
break
case"space":ok=await POPUP.confirm(`Supprimer cet espace \"${leafName}\" de l\'atelier ?`,ctx.emitter)
break
case"res":const itemName=ITEM.extractItemCode(uri)
ok=await POPUP.confirm(`Supprimer cette ressource \"${leafName}\" de l\'item \"${itemName}\" ?`,ctx.emitter)
break}}else{const length=ctx.shortDescs.length
ok=await POPUP.confirm(`Supprimer ces ${length} éléments de l\'atelier ?`,ctx.emitter)}if(ok){try{await WSP.srcDelete(ctx.reg.env.wsp,ctx.emitter,ctx.shortDescs.map(SRC.srcRef))}catch(e){ERROR.report("Une erreur est survenue lors de la suppression.",e,ctx)}}}}export class MoveToSrc extends SrcAction{constructor(id){super(id||"moveSrc")
this._titlePopup="Déplacer vers..."
this._moveButtonLabel="Déplacer"
this._label="Déplacer..."
this._group="edit"
this.atLeastOne=true
this._enableSrcPerms=["write.node.moveFrom"]}static makeTargetFilter(srcs){const folderEntries=new Set
const folders=[]
for(const src of srcs){folderEntries.add(SRC.extractUriParent(src.srcUri))
if(src.srcSt===ESrcSt.folder)folders.push(src.srcUri)}return srcUri=>{if(folderEntries.has(srcUri))return false
for(const folder of folders)if(SRC.isSubUriOrEqual(folder,srcUri))return false
return true}}isVisible(ctx){if(!super.isVisible(ctx))return false
if(ctx.reg.getPref("wsp.hideWspStruct"))return false
return true}isEnabled(ctx){if(!this.canChooseTarget&&typeof this.targetFolder==="object")if(!REG.getReg(ctx).hasPermission("action.src#moveTo",this.targetFolder.srcRoles,null,this.targetFolder.srcRi))return false
return super.isEnabled(ctx)}get isMove(){return true}setTarget(space,targetSpaceUi){this.targetFolder=space
this.targetFolderUi=targetSpaceUi||"choose"
return this}get canChooseTarget(){return this.targetFolderUi==null||this.targetFolderUi==="choose"}async execute(ctx,ev){const srcs=ctx.shortDescs.concat()
const targetUriFilter=MoveToSrc.makeTargetFilter(srcs)
const saving=ctx.reg.env.wsp.wspServer.wspsLive.saveAllHouses()
let targetFolder=this.targetFolder
function targetSrcUri(target){return target!=null?typeof target==="object"?target.srcUri:target:null}if(this.canChooseTarget){const{SpaceSelector:SpaceSelector}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/spaceSelector.js")
const spaceSelector=(new SpaceSelector).initialize({reg:ctx.reg,startSel:targetSrcUri(this.targetFolder)!=null?targetSrcUri(this.targetFolder):ITEM.extractSpaceUri(this.getFirstSrcUri(ctx)),buttonLabel:this._moveButtonLabel,spaceTree:{showRoot:true},onSelChange:(src,spSel)=>{if(!src)spSel.setMsg("Sélectionnez l\'espace cible du déplacement.",false)
else if(spSel.evalPerm("action.src#moveTo",src,"Vous ne disposez pas des droits pour déplacer vers cet espace.","Il est impossible de déplacer un contenu vers cet espace.")){if(targetUriFilter(src.srcUri))spSel.setMsg(null,true)
else spSel.setMsg("Cet espace ne peut pas être la cible du déplacement.",false)}}})
spaceSelector.spaceTree.grid.lineDrawer={redrawLine(row,line){DOM.setStyle(line,"color",targetUriFilter(row.rowKey.srcUri)?"":"gray")}}
spaceSelector.doSelect=async function(){const spSrc=this.spaceTree.shortDescs[0]
if(!spSrc)return
if(!await checkForConflicts(ctx,srcs,spSrc.srcUri))return
this.constructor.prototype.doSelect.call(this)}
const spSel=await POPUP.showDialog(spaceSelector,ctx.emitter,{titleBar:{barLabel:{label:this._titlePopup}},resizer:{}}).onNextClose()
targetFolder=spSel?spSel.srcUri:null}else{if(targetFolder==null)return null
if(!await checkForConflicts(ctx,srcs,targetSrcUri(targetFolder),"move"))return null}if(targetFolder!=null&&targetUriFilter(targetSrcUri(targetFolder))){try{await saving}catch(e){ERROR.report("Une erreur est survenue durant l\'enregistrement préalable de vos éditions en cours. Le déplacement a été annulé.",e,ctx)}try{return await WSP.srcMoveTo(ctx.reg.env.wsp,ctx.emitter,srcs.map(s=>s.srcUri),targetSrcUri(targetFolder))}catch(e){MoveToSrc.notifError(ctx,e)}return null}}static async notifError(ctx,e){var _a
switch(await ERROR.extractDescError(e)){case"sourceNotFound":return POPUP.confirm("La source du déplacement n\'existe plus.",ctx.emitter,{cancelLbl:null})
case"sourceUriAlreadyUsedInMasterOrOtherLayer":return POPUP.confirm("Le même chemin source est utilisé par l\'atelier principal ou un autre atelier calque, le déplacement est impossible.",ctx.emitter,{cancelLbl:null})
case"targetUriAlreadyUsedInMasterOrOtherLayer":return POPUP.confirm("Le chemin cible de ce déplacement est utilisé par l\'atelier principal ou un autre atelier calque, le déplacement est impossible.",ctx.emitter,{cancelLbl:null})
case"sourceUsedWhereFolderTargetIsNot":return POPUP.confirm("Une ressource à déplacer est déjà exploitée dans l\'atelier principal ou un autre atelier calque. Elle ne peut être déplacée dans un espace local à un calque.",ctx.emitter,{cancelLbl:null})
case"conflictUri":return POPUP.confirm("Le chemin cible de ce déplacement est en conflit avec un autre contenu car une simple différence de casse (minuscule/majuscule) est interdite, le déplacement est impossible.",ctx.emitter,{cancelLbl:null})
default:if(((_a=e.response)===null||_a===void 0?void 0:_a.status)===403){return ERROR.show("Vous ne disposez pas des autorisations nécessaires pour effectuer ce déplacement.",null,ctx)}else{return ERROR.report("Une erreur est survenue lors du déplacement.",e,ctx)}}}}async function checkForConflicts(ctx,srcs,targetFolder,alwaysConfirm){const spEntries=await new FolderEntries(ctx.reg.env.wsp,ctx.emitter).setFolderUri(targetFolder)
const conflicts=srcs.filter(s=>spEntries.getChildStateNow(SRC.extractLeafFromUri(s.srcUri))==="used")
if(conflicts.length>0){const conflictFiles=conflicts.filter(s=>s.srcSt===ESrcSt.file)
const itemList=conflictFiles.map(s=>SRC.extractLeafFromUri(s.srcUri)).join(", ")
const space=ITEM.extractSrcLabel(targetFolder,"[Racine de l\'atelier]")
if(conflictFiles.length>0&&conflictFiles.length<conflicts.length){return await POPUP.confirm(`Attention, les contenus [${itemList}] dans \'${space}\' vont être écrasés et les espaces fusionnés.`,ctx.emitter,{okLbl:"Écraser et fusionner",kind:"warning"})}else if(conflictFiles.length>0){return await POPUP.confirm(`Attention, les contenus [${itemList}] dans \'${space}\' vont être écrasés.`,ctx.emitter,{okLbl:"Écraser",kind:"warning"})}else{return await POPUP.confirm(`Attention, des espaces dans \'${space}\' vont être fusionnés (et leurs contenus potentiellement écrasés).`,ctx.emitter,{okLbl:"Fusionner",kind:"warning"})}}else if(alwaysConfirm==="move"){const space=ITEM.extractSrcLabel(targetFolder,"[Racine de l\'atelier]")
const numItems=srcs.length
return await POPUP.confirm(`Confirmez le déplacement de ${numItems} contenu(s) vers \'${space}\'.`,ctx.emitter,{okLbl:"Déplacer"})}return true}export class CopyToSrc extends SrcAction{constructor(id,label,group){super(id||"copyToSrc")
this._label=label||"Dupliquer vers..."
this._group=group||"clone"
this.atLeastOne=true
this._enableSrcPerms=["read.node.copyFrom"]}static makeTargetFilter(srcs){const folders=[]
for(const src of srcs){if(src.srcSt===ESrcSt.folder)folders.push(src.srcUri)}return srcUri=>{for(const folder of folders)if(SRC.isSubUriOrEqual(folder,srcUri))return false
return true}}setTarget(space,targetSpaceUi){this.targetFolder=space
this.targetFolderUi=targetSpaceUi||"choose"
return this}get canChooseTarget(){return this.targetFolderUi==null||this.targetFolderUi==="choose"}isEnabled(ctx){if(!this.canChooseTarget&&typeof this.targetFolder==="object")if(!REG.getReg(ctx).hasPermission("action.src#copyTo",this.targetFolder.srcRoles,null,this.targetFolder.srcRi))return false
return super.isEnabled(ctx)}async execute(ctx,ev){var _a
const srcs=ctx.shortDescs.concat()
const targetUriFilter=CopyToSrc.makeTargetFilter(srcs)
let targetFolder=this.targetFolder
function targetSrcUri(target){return target!=null?typeof target==="object"?target.srcUri:target:null}if(this.canChooseTarget){const{SpaceSelector:SpaceSelector}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/spaceSelector.js")
const spaceSelector=(new SpaceSelector).initialize({reg:ctx.reg,startSel:targetSrcUri(this.targetFolder)!=null?targetSrcUri(this.targetFolder):ITEM.extractSpaceUri(this.getFirstSrcUri(ctx)),buttonLabel:"Dupliquer vers...",spaceTree:{showRoot:true},onSelChange:(src,spSel)=>{if(!src)spSel.setMsg("Sélectionnez l\'espace cible de la copie.",false)
else if(spSel.evalPerm("action.src#copyTo",src,"Vous ne disposez pas des droits de copie dans cet espace.","Impossible de copier dans cet espace.")){if(targetUriFilter(src.srcUri))spSel.setMsg(null,true)
else spSel.setMsg("Cet espace, contenu dans une source à copier, ne peut pas être la cible de la copie.",false)}}})
spaceSelector.spaceTree.grid.lineDrawer={redrawLine(row,line){DOM.setStyle(line,"color",targetUriFilter(row.rowKey.srcUri)?"":"gray")}}
spaceSelector.doSelect=async function(){const spSrc=this.spaceTree.shortDescs[0]
if(!spSrc)return
if(!await checkForConflicts(ctx,srcs,spSrc.srcUri))return
this.constructor.prototype.doSelect.call(this)}
const spSel=await POPUP.showDialog(spaceSelector,ctx.emitter,{titleBar:{barLabel:{label:"Dupliquer vers..."}}}).onNextClose()
targetFolder=spSel?spSel.srcUri:null}else{if(targetFolder==null)return null
if(!await checkForConflicts(ctx,srcs,targetSrcUri(targetFolder)))return null}if(targetFolder!=null&&targetUriFilter(targetSrcUri(targetFolder))){try{return await WSP.srcCopyTo(ctx.reg.env.wsp,ctx.emitter,srcs.map(s=>s.srcUri),targetSrcUri(targetFolder))}catch(e){if(((_a=e.response)===null||_a===void 0?void 0:_a.status)===403){ERROR.show("Vous ne disposez pas des autorisations nécessaires pour effectuer cette copie.",null,ctx)}else{ERROR.report("Une erreur est survenue lors de la copie.",e,ctx)}console.error(e)}}return null}}export class ImportItemsToSrc extends SrcAction{constructor(transfer,id,label,group){super(id||"importToSrc")
if(!transfer.isImport)throw Error("ShortDescsTransfer.isImport is false!!")
this.transfer=transfer
this._label=label||"Importer..."
this._group=group||"clone"}setTarget(space,targetSpaceUi){this.targetFolder=space
this.targetFolderUi=targetSpaceUi||"choose"
return this}async execute(ctx,ev){let targetFolder=this.targetFolder
if(this.targetFolderUi==null||this.targetFolderUi==="choose"){const{SpaceSelector:SpaceSelector}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/spaceSelector.js")
const spaceSelector=(new SpaceSelector).initialize({reg:ctx.reg,startSel:this.targetFolder!=null?this.targetFolder:ITEM.extractSpaceUri(this.getFirstSrcUri(ctx)),buttonLabel:"Importer",spaceTree:{showRoot:true},onSelChange:(src,spSel)=>{if(!src)spSel.setMsg("Sélectionnez l\'espace cible de la copie",false)
else if(spSel.evalPerm("action.src#importTo",src,"Vous ne disposez pas des droits pour importer dans cet espace","Impossible d\'importer dans cet espace")){spSel.setMsg(null,true)}}})
const spSel=await POPUP.showDialog(spaceSelector,ctx.emitter,{titleBar:{barLabel:{label:"Importer vers..."}}}).onNextClose()
targetFolder=spSel?spSel.srcUri:null}if(targetFolder!=null){try{const imports=[]
const options={targetSrcType:ITEM.getSrcUriType(targetFolder)==="space"?"itemOrSpace":"res",defaultUriParent:targetFolder,allowReplace:true,repeatedImports:this.transfer.shortDescs.length>1?{}:undefined}
for(const datas of this.transfer.shortDescs){if(datas.createSrc){const src=await datas.createSrc(options)
if(src)imports.push(src)}}return imports.length>0?imports:null}catch(e){await ERROR.report("Une erreur est survenue lors de l\'import.",e,ctx)}}return null}}export class RenameSrc extends SrcAction{constructor(){super("renameSrc")
this._label="Renommer..."
this._group="edit"
this.atLeastOne=true}isEnabled(ctx){const reg=REG.getReg(ctx)
for(const sd of ctx.shortDescs)if(!reg.hasPermission(ITEM.getSrcUriType(sd.srcUri)==="space"?"rename.space":"rename.item",sd.srcRoles,null,sd.srcRi))return false
return super.isEnabled(ctx)&&ctx.shortDescs.findIndex(src=>ITEM.isExtItem(src.srcUri))<0}get isMove(){return true}async execute(ctx,ev){const srcs=ctx.shortDescs.concat()
const results=[]
const saving=ctx.reg.env.wsp.wspServer.wspsLive.saveAllHouses()
const{SrcNewCode:SrcNewCode}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/srcNewCode.js")
for(let i=0;i<srcs.length;i++){const src=srcs[i]
const ct=(new SrcNewCode).initialize({reg:ctx.reg,parentFolder:ITEM.isAirItem(src.srcUri)?null:SRC.extractUriParent(src.srcUri),currentCode:SRC.extractLeafFromUri(src.srcUri),targetSrcUriType:ITEM.getSrcUriType(src.srcUri),doBtnLabel:"Renommer"})
const newCode=await POPUP.showDialog(ct,ctx.emitter,{titleBar:{barLabel:{label:"Renommer..."}}}).onNextClose()
if(newCode){try{await saving}catch(e){await ERROR.report("Une erreur est survenue durant l\'enregistrement préalable de vos modifications en cours. Le renommage a été annulé.",e,ctx)}try{results.push(await WSP.srcRename(ctx.reg.env.wsp,ctx.emitter,src,newCode))}catch(e){RenameSrc.notifError(ctx,e)}}else if(i<srcs.length-1){const count=srcs.length-i-1
if(!await POPUP.confirm(`Il reste ${count} à renommer dans votre sélection initiale.`,ctx.emitter,{okLbl:"Poursuivre le renommage",cancelLbl:"Abandonner"}))break}}return results}static async notifError(ctx,e){switch(await ERROR.extractDescError(e)){case"sourceNotFound":return POPUP.confirm("La source du renommage n\'existe plus.",ctx.emitter,{cancelLbl:null})
case"sourceUriAlreadyUsedInMasterOrOtherLayer":return POPUP.confirm("Le même chemin source est utilisé par l\'atelier principal ou un autre atelier calque, le renommage est impossible.",ctx.emitter,{cancelLbl:null})
case"targetUriAlreadyUsedInMasterOrOtherLayer":return POPUP.confirm("Le chemin cible de ce renommage est utilisé par l\'atelier principal ou un autre atelier calque, le déplacement est impossible.",ctx.emitter,{cancelLbl:null})
case"conflictUri":return POPUP.confirm("Un renommage avec un simple changement de casse (minuscule/majuscule) est interdit.",ctx.emitter,{cancelLbl:null})
default:return ERROR.report("Une erreur est survenue lors du renommage.",e,ctx)}}}export class DuplicateSrc extends SrcAction{constructor(id){super(id||"duplicateSrc")
this._group="clone"
this.atLeastOne=true
this._enableSrcPerms=["write.node.duplicate"]}getLabel(ctx){if(this._label)return super.getLabel(ctx)
return ctx.shortDescs.length>1?"Dupliquer un à un...":"Dupliquer..."}async execute(ctx,ev){const srcs=ctx.shortDescs.concat()
const results=[]
const{SrcNewCode:SrcNewCode}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/srcNewCode.js")
for(let i=0;i<srcs.length;i++){const src=srcs[i]
const newCodeUi=(new SrcNewCode).initialize({reg:ctx.reg,parentFolder:ITEM.isAirItem(src.srcUri)?null:SRC.extractUriParent(src.srcUri),currentCode:SRC.extractLeafFromUri(src.srcUri),targetSrcUriType:ITEM.getSrcUriType(src.srcUri),doBtnLabel:"Dupliquer"})
const newCode=await POPUP.showDialog(newCodeUi,ctx.emitter,{titleBar:{barLabel:{label:"Dupliquer..."}}}).onNextClose()
if(newCode){try{results.push(await WSP.srcDuplicate(ctx.reg.env.wsp,ctx.emitter,src,newCode))}catch(e){DuplicateSrc.notifError(ctx,e)}}else if(i<srcs.length-1){const count=srcs.length-i-1
if(!await POPUP.confirm(`Il reste ${count} contenus à dupliquer dans votre sélection initiale.`,ctx.emitter,{okLbl:"Poursuivre la duplication",cancelLbl:"Abandonner"}))break}}return results}static async notifError(ctx,e){switch(await ERROR.extractDescError(e)){case"sourceNotFound":return POPUP.confirm("La source de la duplication n\'existe plus.",ctx.emitter,{cancelLbl:null})
case"targetUriAlreadyUsedInMasterOrOtherLayer":return POPUP.confirm("Le chemin cible de cette duplication est utilisé par l\'atelier principal ou un autre atelier calque, la duplication est impossible.",ctx.emitter,{cancelLbl:null})
case"conflictUri":return POPUP.confirm("Le chemin cible de cette duplication est en conflit avec un autre contenu car une simple différence de casse (minuscule/majuscule) est interdite, la duplication est impossible.",ctx.emitter,{cancelLbl:null})
default:return ERROR.report("Une erreur est survenue lors de la duplication.",e,ctx)}}}export class ImportFiles extends SrcAction{constructor(id){super(id||"importFile")
this._label="Importer un fichier..."
this._group="importExport"
this.zeroOrOne=true
this._enableSrcPerms=["write.node.import"]}async execute(ctx,ev){const input=document.createElement("input")
input.type="file"
input.multiple=true
input.click()
const files=await new Promise(resolve=>{input.onchange=function(){resolve(this.files.length>0?this.files:null)}})
if(files){const svc=ctx.reg.getSvc("wspImportInWsp")
if(!svc)return null
const from=ctx.shortDescs[0]
const defaultUriParent=from?ITEM.extractSpaceUri(from.srcUri):""
const options={targetSrcType:"item",defaultUriParent:defaultUriParent,allowReplace:true,repeatedImports:files.length>1?{}:undefined}
const shortDescs=[]
for(let i=0;i<files.length;i++){const file=files.item(i)
const shortDesc=await svc.importSrc(file,options,ctx.reg,ctx.emitter)
if(shortDesc){shortDescs.push(shortDesc)}else{if(i<files.length-1&&!await POPUP.confirm("Voulez-vous poursuivre l\'import des fichiers suivants ?",ctx.emitter,{okLbl:"Poursuivre"}))return}}if(ctx.infoBroker){if(shortDescs.length===1)ctx.infoBroker.dispatchInfo(new InfoFocusItem(SRC.srcRef(shortDescs[0]),shortDescs[0]),ctx.emitter)
else ctx.infoBroker.dispatchInfo(new InfoSelectUris(shortDescs.map(entry=>entry.srcUri)),ctx.emitter)}return shortDescs}return null}}export class ImportScar extends SrcAction{static async doImportScar(wsp,uiContext,refUri,content,replaceIfExist){const progress=POPUP.showProgress(uiContext,"Import de l\'archive en cours...")
try{let resp=await ITEM.importScar(wsp,uiContext,refUri,content,replaceIfExist,progress.progressCallback)
progress.close()
if(resp.error)throw resp.error
if(resp.status!=200&&resp.status!=204){if(resp.status!==420){await ERROR.reportError({msg:"Une erreur est survenue lors de l\'import de l\'archive : "+content.webkitRelativePath||content.name,details:resp.asText})}else{const name=content.webkitRelativePath||content.name
POPUP.showNotifWarning(JSX.createElement("div",{style:"padding:1em"},JSX.createElement("p",null,JSX.createElement("b",null,`L\'import de \'${name}\' a abouti, mais les items suivants ont été rejetés (car non reconnus par ce modèle) :`)),JSX.createElement("pre",{style:"max-height:50vh; overflow:auto;"},resp.asText)),uiContext,{autoHide:0})}}return true}catch(e){progress.close()
await ERROR.report("Une erreur est survenue lors de l\'import de l\'archive : "+content.webkitRelativePath||content.name,e)
return false}}constructor(id){super(id||"importScar")
this._label="Importer une archive..."
this._group="importExport"
this.zeroOrOne=true
this._enableSrcPerms=["write.node.import"]}isVisible(ctx){if(!super.isVisible(ctx))return false
const srcUri=this.getFirstSrcUri(ctx)
return!srcUri||ITEM.getSrcUriType(srcUri)==="space"}async execute(ctx,ev){const{wsp:wsp}=ctx.reg.env
let srcUri=this.getFirstSrcUri(ctx)||SRC.URI_ROOT
const input=document.createElement("input")
input.type="file"
input.accept=srcUri?".scar":".scar,.scwsp"
input.multiple=true
input.click()
const files=await new Promise(resolve=>{input.onchange=function(){resolve(this.files.length>0?this.files:null)}})
if(!files)return
let replace=false
const node=await WSP.fetchSrcTree(wsp,ctx.emitter,srcUri,1,["srcNm"])
if(node&&node.ch&&node.ch.length>0){const space=ITEM.extractSpaceLabel(srcUri)
const form=JSX.createElement("form",null,JSX.createElement("p",null,space?`L\'espace cible \'${space}\' n\'est pas vide, l\'import pourrait écraser vos contenus actuels.`:`L\'atelier n\'est pas vide, l\'import pourrait écraser vos contenus actuels.`),JSX.createElement("p",null,JSX.createElement("label",null,JSX.createElement("input",{type:"radio",name:"opt",value:"subSp",checked:true}),"Importer dans un nouveau sous-espace...")),JSX.createElement("p",null,JSX.createElement("label",null,JSX.createElement("input",{type:"radio",name:"opt",value:"noReplace"}),"Importer dans cet espace sans remplacer les contenus portant le même nom.",JSX.createElement("span",null," Seuls les nouveaux contenus seront importés."))),JSX.createElement("p",null,JSX.createElement("label",null,JSX.createElement("input",{type:"radio",name:"opt",value:"replace"}),"Importer dans cet espace en écrasant les contenus existants.",JSX.createElement("span",{style:"color:var(--warning-color)"}," Attention, vos contenus portant les mêmes noms seront remplacés."))))
if(!await POPUP.confirm(form,ctx.emitter))return
const choice=form.elements.namedItem("opt").value
replace=choice==="replace"
if(choice==="subSp"){let newCode=files[0].name
const idx=newCode.indexOf(".")
if(idx>=0)newCode=newCode.substring(0,idx)
const{SrcNewCode:SrcNewCode}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/srcNewCode.js")
const newCodeUi=(new SrcNewCode).initialize({reg:ctx.reg,parentFolder:srcUri,defaultCode:newCode,targetSrcUriType:"space",doBtnLabel:"Importer dans ce nouvel espace"})
newCode=await POPUP.showDialog(newCodeUi,ctx.emitter,{titleBar:{barLabel:{label:"Créer un sous-espace..."}}}).onNextClose()
if(!newCode)return
srcUri=SRC.addLeafToUri(srcUri,newCode)}}for(let i=0;i<files.length;i++){const file=files.item(i)
if(!await ImportScar.doImportScar(wsp,ctx.emitter,srcUri,file,replace)){if(i<files.length-1&&!await POPUP.confirm("Voulez-vous poursuivre l\'import des archives suivantes ?",ctx.emitter,{okLbl:"Poursuivre"}))return}}}}export class WriteMainStreamToSrc extends SrcAction{constructor(blob,id,label,group){super(id||"writeStreamToSrc")
this.blob=blob
this._label=label||"Coller le contenu"
this._group=group||"clipboard"
this.exactOne=true}static findBestType(ctx,cbItems){if(!cbItems||cbItems.length!==1||ctx.shortDescs.length!==1)return undefined
const itemType=ctx.reg.env.wsp.wspMetaUi.getItemType(ctx.shortDescs[0].itModel)
let bestType
let score=0
for(let t of cbItems[0].types){let s=itemType.matchType(t)
if(s>score){score=s
bestType=t}}return bestType}async execute(ctx,ev){if(this.blob instanceof Promise)this.blob=await this.blob
if(!this.blob)return
const itemLabel=ITEM.extractSrcLabel(ctx.shortDescs[0].srcUri,"")
if(await POPUP.confirm(JSX.createElement("div",null,JSX.createElement("p",null,"Remplacer le contenu de cet item par celui du presse-papier ?"),JSX.createElement("p",null,itemLabel)),ctx.emitter,{okLbl:"Remplacer"})){const sd=ctx.shortDescs[0]
const progress=POPUP.showProgress(ctx.emitter,"Remplacement en cours...")
try{const shortDesc=await ITEM.update(ctx.reg.env.wsp,ctx.emitter,SRC.srcRef(sd),this.blob,progress.progressCallback,ctx.reg.env.wsp.getShortDescDef())
progress.close()
if(ctx.infoBroker&&shortDesc)ctx.infoBroker.dispatchInfo(new InfoFocusItem(SRC.srcRef(shortDesc),shortDesc),null)}catch(e){progress.close()
ERROR.report("Échec au remplacement du contenu. Recommencez ultérieurement.",e)}}}}export class PasteContent extends WriteMainStreamToSrc{constructor(id,label,group){super(null,id,label,group)}isVisible(ctx){if(!navigator.clipboard||!navigator.clipboard.read)return false
return super.isVisible(ctx)}buildCustomButton(ctx,uiContext,parent){return uiContext==="bar"?null:undefined}async initButtonNode(buttonNode,ctx){if(buttonNode instanceof ActionBtn){try{const cbItems=await navigator.clipboard.read()
buttonNode.disabled=WriteMainStreamToSrc.findBestType(ctx,cbItems)==null}catch(e){buttonNode.disabled=true
if((await navigator.permissions.query({name:"clipboard-read"})).state==="denied"){POPUP.showNotifWarning("L\'accès au presse-papier n\'est pas autorisé par votre navigateur. Modifiez les paramètres du site pour rendre opérationnelles les fonctions de copier/coller.",buttonNode)}}}}async execute(ctx,ev){try{const cbItems=await navigator.clipboard.read()
const bestType=WriteMainStreamToSrc.findBestType(ctx,cbItems)
if(bestType){this.blob=cbItems[0].getType(bestType)
return super.execute(ctx,ev)}}finally{this.blob=null}}}export class ExportScar extends SrcAction{constructor(id){super(id||"exportScar")
this._label="Exporter une archive..."
this._group="importExport"
this.atLeastOne=true
this._enableSrcPerms=["read.node.export"]}async execute(ctx,ev){const popup=(new PopupConfirm).initialize({titleBar:{barLabel:{label:"Exporter une archive..."}},okLbl:"Exporter"})
const includeNet=JSX.createElement("input",{type:"checkbox",checked:""})
const keepSpaces=JSX.createElement("input",{type:"checkbox"})
const isSingleItem=ctx.shortDescs.length===1&&ITEM.getSrcUriType(this.getFirstSrcUri(ctx))==="item"
popup.setContent(JSX.createElement("section",null,JSX.createElement("div",null,JSX.createElement("label",null,includeNet,JSX.createElement("span",null,isSingleItem?"Inclure le réseau descendant complet de cet item":"Inclure le réseau descendant complet des items sélectionnés"))),JSX.createElement("div",null,JSX.createElement("label",null,keepSpaces,JSX.createElement("span",null,"Préserver les espaces de l\'atelier")))))
popup.show({viewPortX:"middle",viewPortY:"middle"},ctx.emitter)
if(await popup.onNextClose()){const wsp=ctx.reg.env.wsp
const scope=includeNet.checked?"net":"node"
const mode=keepSpaces.checked?"wspTree":scope=="net"?"rootAndRes":"flat"
let name=wsp.wspTitle
if(ctx.shortDescs.length===1){let leaf=SRC.extractLeafFromUri(this.getFirstSrcUri(ctx))
if(leaf){const idx=leaf.indexOf(".")
if(idx>=0)leaf=leaf.substring(0,idx)
name=leaf}}name=IO.getValidFileName(name,".scar","dateTime")
const url=ctx.reg.env.universe.config.wsps.exportUrl.resolve(IO.qs("cdaction","Export","param",wsp.code,"format","jar","scope",scope,"mode",mode,"link","relative","downloadFileName",name)).url
const form=JSX.createElement("form",{hidden:true,accept:"application/jar"},JSX.createElement("input",{type:"hidden",name:"refUris",value:ctx.shortDescs.map(s=>SRC.srcRef(s)).join("\t")}))
form.method="POST"
form.action=url
document.body.append(form)
form.submit()
form.remove()}}}export class ExportScwsp extends ExportWspAction{isVisible(ctx){if(ctx.shortDescs.length>0)return false
return super.isVisible(ctx)}}export class SetPermsSpace extends SrcAction{constructor(id){super(id||"openPermsWsp")
this._label="Permissions sur l\'espace..."
this._description="Définir les permissions de cet espace"
this._group="admin"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/spacePerms.svg"
this.exactOne=this.isBackendDb=true
this.requireSrcEnabledPerm(["action.space#set.perms","admin.node.configRoles.byAdmin"])}isVisible(ctx){if(ITEM.getSrcUriType(this.getFirstSrcUri(ctx)||"")!=="space")return false
return super.isVisible(ctx)}async execute(ctx,ev){const reg=ctx.reg
const{ObjRolesMapEdit:ObjRolesMapEdit}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/objRolesMap.js")
const item=ctx.shortDescs[0]
const name=ITEM.extractSpaceLabel(item.srcUri)
const itemType=reg.env.wsp.wspMetaUi.getItemType(item.itModel)
const itemReg=ctx.reg=REG.createSubReg(reg,itemType)
itemReg.env.securityCtx=SEC.createSub(reg.env.securityCtx,item.srcRoles,item.srcRi)
await POPUP.showDialog((new ObjRolesMapEdit).initialize({reg:itemReg,uiContext:"popup",rolesUiLayerSng:"space",preSelectAccounts:ctx.preSelectAccounts,objThis:ctx,objEditRolesMap:(objThis,rolesMap)=>WSP.srcSetRoles(ctx.reg.env.wsp,ctx.reg.env.uiRoot,item.srcUri,rolesMap),objEditRolesMapPerms:["action.space#set.perms","admin.node.configRoles.byAdmin"],objFetchRolesMap:objThis=>WSP.srcGetRoles(ctx.reg.env.wsp,ctx.reg.env.uiRoot,item.srcUri),objFetchRolesMapForAccounts:(objThis,pAccounts)=>WSP.srcGetRolesForAccounts(ctx.reg.env.wsp,ctx.reg.env.uiRoot,item.srcUri,pAccounts)}),ctx.reg.env.uiRoot,{titleBar:{barLabel:{label:name?`Permissions définies sur l\'espace \'${name}\'`:`Permissions définies sur l\'espace`},closeButton:{}},resizer:{},initWidth:"40em",initHeight:"40em"}).onNextClose()}}export class OpenWspTrash extends SrcAction{static async openTrashDialog(from,init){const reg=init.reg
const{WspTrash:WspTrash}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/wspTrash.js")
const wspTitle=reg.env.wsp.wspTitle
await POPUP.showDialog((new WspTrash).initialize(init),from,{titleBar:{barLabel:{label:`Corbeille de l\'atelier : ${wspTitle}`},closeButton:{}},resizer:{},viewPortX:"middle",viewPortY:"middle",initWidth:"90vw",initHeight:"90vh"}).onNextClose()}constructor(id){super(id||"showWspTrash")
this._label="Corbeille..."
this._group="wsp"
this._enableSrcPerms=["read.trash"]
this.isBackendDb=true}async execute(ctx,ev){return OpenWspTrash.openTrashDialog(ctx.emitter,{reg:ctx.reg,showMainView:true})}}export class WspImportSrc{static async pushResFolder(folder,parentUri,wsp,uiCtx){if(SRC.isValidPartUri(folder.name)!==true)return
const newParent=SRC.addLeafToUri(parentUri,folder.name)
let empty=true
for(let entry of folder.entries){if(entry instanceof File){if(SRC.isValidPartUri(entry.name)===true){empty=false
await ITEM.update(wsp,uiCtx,SRC.addLeafToUri(newParent,entry.name),entry)}}else{empty=false
await WspImportSrc.pushResFolder(entry,newParent,wsp,uiCtx)}}if(empty){await ITEM.update(wsp,uiCtx,newParent,null)}}importSrc(body,options,reg,uiCtx){switch(options.targetSrcType){case"item":return this.importItem(body,options,reg,uiCtx)
case"space":if(isFolder(body))return this.importSpace(body,options,reg,uiCtx)
console.trace("importSrc with targetSrcType='space' but body not a IFolder")
return null
case"itemOrSpace":if(isFolder(body)&&ITEM.isValidCodeItem(body.name)!==true)return this.importSpace(body,options,reg,uiCtx)
return this.importItem(body,options,reg,uiCtx)
case"res":return this.importRes(body,options,reg,uiCtx)}console.trace("importSrc with options.targetSrcType undefined",options)
return null}async importItem(body,options,reg,uiCtx){if(options.allowReplace){const item=reg.env.longDesc
const parentUri=options.defaultUriParent!=null?options.defaultUriParent:item?ITEM.extractSpaceUri(item.srcUri):""
return this.doImportAllowReplace("item",body,parentUri,options,reg,uiCtx)}else{const{ItemCreator:ItemCreator}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/itemCreator.js")
const item=reg.env.longDesc
const mimeType="type"in body?body.type:null
const name="name"in body?body.name:null
return ItemCreator.openCreateItem(ItemCreator.setDefaultConfigFromReg(reg,{body:body,itemTypesTree:{itemTypeReducer:(acc,cur)=>{const minMatchScore=2
if(options.sgnPattern&&!options.sgnPattern.test(cur.getSgn()))return acc
let prevIt=acc[acc.length-1]
let prevMatchScore=prevIt?prevIt.matchType(mimeType,name):minMatchScore
let currMatchScore=cur.matchType(mimeType,name)
if(currMatchScore>prevMatchScore){while(acc.length)acc.pop()
acc.push(cur)}else if(currMatchScore===prevMatchScore&&(!prevIt||prevIt.getFamily()!==EItemTypeFamily.xml)){acc.push(cur)}return acc}},spaceUri:options.defaultUriParent!=null?options.defaultUriParent:item?ITEM.extractSpaceUri(item.srcUri):"",codeItem:body instanceof File?body.name:null}),"Importer un item...",uiCtx).onNextClose()}}async importRes(body,options,reg,uiCtx){var _a
if(!options.allowReplace)console.log(":::TODO WspImportSrc.importRes() with options.allowReplace=false",body)
const parentUri=options.defaultUriParent!=null?options.defaultUriParent:((_a=reg.env.longDesc)===null||_a===void 0?void 0:_a.srcUri)||""
return this.doImportAllowReplace("res",body,parentUri,options,reg,uiCtx)}async importSpace(folder,options,reg,uiCtx){if(!options.allowReplace)console.log(":::TODO WspImportSrc.importRes() with options.allowReplace=false",folder)
let parentUri=options.defaultUriParent
if(parentUri==null){const item=reg.env.longDesc
parentUri=item?ITEM.extractSpaceUri(item.srcUri):""}return this.doImportAllowReplace("space",folder,parentUri,options,reg,uiCtx)}async doImportAllowReplace(type,body,parentUri,options,reg,uiCtx){var _a,_b
const wsp=reg.env.wsp
let name="name"in body?body.name:null
if(ITEM.isValidCode(type,name)!==true){name=await this.buildName(type,reg,uiCtx,parentUri,name)}else if(!((_a=options.repeatedImports)===null||_a===void 0?void 0:_a.replaceAll)){const src=await WSP.fetchShortDesc(wsp,uiCtx,SRC.addLeafToUri(parentUri,name))
if(src.srcSt!==ESrcSt.none){if((_b=options.repeatedImports)===null||_b===void 0?void 0:_b.replaceNothing)return
name=await this.buildName(type,reg,uiCtx,parentUri,name,options.repeatedImports)}}if(!name)return
const progress=POPUP.showProgress(uiCtx,"Import en cours...")
try{if(body instanceof Blob){return await ITEM.update(wsp,uiCtx,SRC.addLeafToUri(parentUri,name),body,progress.progressCallback,wsp.getShortDescDef())}else{if(type==="item"&&body.name!==name){if(wsp.wspMetaUi.getItemTypes().find(it=>it.matchType(null,name)>1&&it.getFamily()===EItemTypeFamily.res)){for(let i=0;i<body.entries.length;i++){const entry=body.entries[i]
if(entry.name===body.name&&entry instanceof File){body.entries[i]=new File([entry],name)
break}}}}body.name=name
await WspImportSrc.pushResFolder(body,parentUri,wsp,uiCtx)
return await wsp.fetchShortDesc(SRC.addLeafToUri(parentUri,name))}}catch(e){progress.close()
POPUP.showNotifError("Une erreur est survenue durant l\'envoi du contenu.",uiCtx)
return null}finally{progress.close()}}async buildName(type,reg,uiCtx,parentUri,currentCode,freeStates){const ct=(new SrcNewCode).initialize({reg:reg,parentFolder:parentUri,defaultCode:currentCode,targetSrcUriType:type,doBtnLabel:"Importer",doBtnReplaceLabel:"Remplacer",doAllBtnLabel:freeStates?"Appliquer pour tout":undefined})
const name=await POPUP.showDialog(ct,uiCtx,{titleBar:{barLabel:{label:"Importer un item"}}}).onNextClose()
if(freeStates&&ct.config.doAllSelected){if(name)freeStates.replaceAll=true
else freeStates.replaceNothing=true}return name}}REG.reg.registerSvc("wspImportInWsp",1,new WspImportSrc)
export class WspImportInterWspLazy{constructor(lib){this.lib=lib}async importSrc(wspFrom,srcFrom,options,reg,uiCtx){if(!this.impl)this.impl=await new((await reg.env.resolver.importJs(this.lib)).WspImportInterWsp)
return this.impl.importSrc(wspFrom,srcFrom,options,reg,uiCtx)}}REG.reg.registerSvc("wspImportInterWsp",1,new WspImportInterWspLazy(":back:wsp/actions/importInterWspSvc.js"))
export class WspImportFromUrlWsp{rejectSgnMatch(patternItemSgn,reg){var _a
return((_a=reg.env.wsp.wspMetaUi)===null||_a===void 0?void 0:_a.getItemTypes().find(it=>patternItemSgn.test(it.getSgn())&&/\bRemoteBinary\b/.test(it.getSgn())))==null}async extractShortDescs(data,reg,uiCtx){const urls=data.getData(data.types.indexOf("text/x-uri-list")>=0?"text/x-uri-list":"text/uri-list").split(/\r\n/).filter(u=>u&&u.charAt(0)!=="#").map(u=>u.trim())
return(await REMOTE.aliasUrls(urls,reg)).map(u=>new ShortDescToImportFromUrl(u,reg,uiCtx))}async importSrc(url,options,reg,uiCtx){if(options.targetSrcType==="space"||options.targetSrcType==="res"||options.defaultUriParent==null)return null
const path=new URL(url).pathname
const nmIdx=path.lastIndexOf("/")
return ItemCreator.openCreateItem(ItemCreator.setDefaultConfigFromReg(reg,{itemTypesTree:{itemTypeReducer:(acc,cur)=>{if(/\bRemoteBinary\b/.test(cur.getSgn())&&(!options.sgnPattern||options.sgnPattern.test(cur.getSgn())))acc.push(cur)
return acc}},spaceUri:options.defaultUriParent,spaceUi:options.uriParentFrozen?"readOnly":"editable",codeItem:nmIdx>=0?path.substring(nmIdx+1):null,newContentOptions:{remoteUrl:url}}),"Créer un item pour référencer une ressource distante...",uiCtx).onNextClose()}}class ShortDescToImportFromUrl{constructor(url,reg,uiCtx){this.url=url
this.reg=reg
this.uiCtx=uiCtx}createSrc(options){const svc=this.reg.getSvc("wspImportFromUrl")
return(svc===null||svc===void 0?void 0:svc.importSrc(this.url,options,this.reg,this.uiCtx))||null}}REG.reg.registerSvc("wspImportFromUrl",1,new WspImportFromUrlWsp)

//# sourceMappingURL=srcActions.js.map