import{BaseElementAsync,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{GridSmall}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{CellBuilderDate,CellBuilderEnum,CellBuilderIconLabel,CellBuilderString}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{SKINPACK,WSPPACK}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/pack.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{AccelKeyMgr,Action,ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{InstallSkinPackAction,InstallWspPackAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/packActions.js"
import{GridColTreeDef,GridDataHolderJsonTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/dialogs_Perms.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
class PacksMgr extends BaseElementAsync{constructor(){super(...arguments)
this.packSrvList=[]
this.extension4download=".pack"
this._installPendingPacks=new Map
this.fullSessionInstallPacksIds=[]
this._refreshPending=false
this._showLastNotInstalledPacksOnRefreshAll=false}async _initialize(init){this.reg=REG.createSubReg(this.findReg(init))
if(init.universes)init.universes.forEach(univ=>{if(univ.packServer)this.packSrvList.push(univ.packServer)})
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("webzone:panel",sr)
this._initAndInstallSkin(this.localName,init)
if(init.packExtensions&&init.packExtensions.length>0){this.extension4download=init.packExtensions[0]
this.packExtensions=init.packExtensions}this.overrideInitialize(init)
this.reg.addToList("actions:packs:packsmgr:toolbar","actionRefreshUi",1,actionRefreshUi)
let accelKeyMgr=(new AccelKeyMgr).initFromMapActions(this.reg.mergeListsAsMap("accelkeys:packs:packsmgr"))
let packsActions=ACTION.injectSepByGroup(this.reg.mergeLists("actions:packs:packsmgr:toolbar","actions:packs:packsmgr"),this.reg.getPref("actions.packs.packsmgr.groupOrder","packs pack * refresh"),this)
accelKeyMgr.initFromMapActions(this.reg.getListAsMap("accelkeys:wspApp:global"))
this.packsToolbar=sr.appendChild(JSX.createElement(BarActions,{class:"horizontal","î":{reg:this.reg,actions:packsActions,actionContext:this,uiContext:"dialog",disableFullOverlay:true}}))
this.grid=new GridSmall
const initPacksGrid=BASIS.newInit(init.packsGrid,this.reg)
if(initPacksGrid.skinScroll===undefined)initPacksGrid.skinScroll="scroll/small"
if(initPacksGrid.lineDrawer===undefined)initPacksGrid.lineDrawer=this
if(initPacksGrid.accelKeyMgr===undefined)initPacksGrid.accelKeyMgr=accelKeyMgr
initPacksGrid.dataHolder=new GridDataHolderJsonTree("packs").setOpenAll(true)
initPacksGrid.selType="multi"
initPacksGrid.emptyBody=this.emptyBody.bind(this)
initPacksGrid.skinOver="packsmgr-grid"
initPacksGrid.autoSelOnFocus="first"
this.grid.ctxMenuActions={actions:ACTION.injectSepByGroup(this.reg.mergeLists("actions:packs:packsmgr:tree","actions:packs:packsmgr"),this.reg.getPref("actions.packs.packsmgr.groupOrder","packs pack * refresh"),this),actionContext:this}
this.grid.addEventListener("keydown",ev=>{accelKeyMgr.handleKeyboardEvent(ev,this)})
this.grid.addEventListener("grid-select",(function(ev){const packsMgr=DOMSH.findHost(this)
packsMgr.packsToolbar.refreshContent()}))
this.grid.initialize(initPacksGrid)
this.grid.setAttribute("c-resizable","")
sr.appendChild(this.grid)
return this.refreshUi()}overrideInitialize(init){}async refreshUi(scope="full"){try{if(this._refreshPending){this._newRefreshRequired=this._newRefreshRequired=="full"?"full":scope
return}this._refreshPending=true
await this._refreshUi(scope)}finally{this._refreshPending=false
if(this._newRefreshRequired){let state=this._newRefreshRequired
this._newRefreshRequired=null
if(state=="full"&&this._fullAutoRefrehPlanned)clearTimeout(this._fullAutoRefrehPlanned)
setTimeout(this.refreshUi.bind(this,state),500)}}}async _refreshUi(scope="full"){var _a
try{this.fetchState="pending"
let packsListByPortal=new Map
if(this._installPendingPacks)this._installPendingPacks.forEach(pack=>{if(!packsListByPortal.has(pack.packSrv))packsListByPortal.set(pack.packSrv,[])
packsListByPortal.get(pack.packSrv).push(pack)})
if(!this._lastPacksListFromSrvs||scope=="full")await this.loadPacksListFromSRvs()
this._lastPacksListFromSrvs.forEach(pack=>{if(!packsListByPortal.has(pack.packSrv))packsListByPortal.set(pack.packSrv,[])
packsListByPortal.get(pack.packSrv).push(pack)
if(!this.isPackStatusPending(pack.installStatus))pack.title=this.buildPackTitle(pack)
if(!pack.title){let installPackProps=this.fullSessionInstallPacksIds.find(value=>value.pack.id===pack.id&&value.packSrv===pack.packSrv)
if(installPackProps&&installPackProps.pack)pack.title=installPackProps.pack.title}if(this.isPackStatusPending(pack.installStatus)){if(this._fullAutoRefrehPlanned)clearTimeout(this._fullAutoRefrehPlanned)
this._fullAutoRefrehPlanned=setTimeout(()=>this.refreshUi("full"),2e3)}})
if(this._showLastNotInstalledPacksOnRefreshAll){(_a=this.fullSessionInstallPacksIds)===null||_a===void 0?void 0:_a.forEach(entry=>{if(entry.pack&&!this.isPackStatusInstalled(entry.pack.installStatus)){if(!packsListByPortal.has(entry.packSrv))packsListByPortal.set(entry.packSrv,[])
packsListByPortal.get(entry.packSrv).push(Object.assign({},entry.pack,{packSrv:entry.packSrv}))}})}let finalPacksList=[]
if(this.packSrvList.length==1){packsListByPortal.forEach((packs,packSrv)=>{finalPacksList=packs})}else{packsListByPortal.forEach((packs,packSrv)=>{finalPacksList.push({title:packSrv.universe.getName(),packSrv:packSrv,packs:packs})})}this.fetchState="done"
this.grid.dataHolder.setDatas(finalPacksList)}catch(e){this.fetchState="failed"
this.grid.dataHolder.setDatas([])
throw e}}buildPackTitle(pack){return WSPPACK.buildPackTitle(pack)}async packInstallHandler(state,file,packSrv,pack){const installuid=file.name+"_"+file.size+"_"+packSrv.universe.getId()
if(state=="start"){if(!this._installPendingPacks.get(installuid)){this._installPendingPacks.set(installuid,{id:installuid,packSrv:packSrv,title:file.name,installStatus:"uploadPending"})
await this.refreshUi("local")}}else this._installPendingPacks.delete(installuid)
if(pack){if(!pack.title)pack.title=file.name
this.fullSessionInstallPacksIds.push({packSrv:packSrv,pack:pack})}}async globalInstallHandler(state,packsAreInstalled){if(state=="end"&&packsAreInstalled)await this.refreshUi("full")}redrawLine(row,line){const packSrv=row.getData("packSrv")
const installStatus=row.getData("installStatus")
const error=row.getData("error")
if(installStatus=="installFailed"||error)DOM.addClass(line,"error")
else if(installStatus=="uploadPending"||installStatus=="installPending")DOM.addClass(line,"pending")
else{DOM.removeClass(line,"error")
DOM.removeClass(line,"pending")}if(packSrv&&!packSrv.universe.reg.hasPerm("action.packsMgr#uninstall.wspPack")||row.getData("system"))DOM.addClass(line,"readonly")
else DOM.removeClass(line,"readonly")
const packId=row.getData("id")
if(packSrv&&packId&&this.isNewPack(packSrv,packId)){DOM.addClass(line,"new")
setTimeout(()=>{DOM.removeClass(line,"new")},5e3)}else DOM.removeClass(line,"new")}isNewPack(packSrv,packId){return packId&&packSrv&&this.fullSessionInstallPacksIds.findIndex(value=>value.pack.id===packId&&value.packSrv===packSrv)>-1}emptyBody(){switch(this.fetchState){case"done":return JSX.createElement("c-msg",null,"Aucun pack installé")
case"failed":return JSX.createElement("c-msg",{level:"error"},"Échec au chargement")
default:return JSX.createElement("c-msg",null,"Chargement en cours...")}}}REG.reg.registerSkin("packsmgr-grid",1,`\n\t:host {\n\t\tflex: 1;\n\t}\n\n  .readonly {\n\t  font-style: italic;\n  }\n\n  .new {\n\t  background-color: var(--row-highlight-bgcolor);\n  }\n\n  .error {\n\t  color: var(--error-color);\n  }\n\n  .pending {\n\t  font-style: italic;\n\t  color: var(--warning-color);\n  }\n\n  .portalrow {\n\t  font-weight: bold;\n\t  color: var(--alt1-color);\n\t}\n\n`)
export class WspPacksMgr extends PacksMgr{async _initialize(init){if(!init.packExtensions)init.packExtensions=[".wsppack"]
super._initialize(init)}overrideInitialize(init){this.reg.addToList("actions:packs:packsmgr","actionRemovePacks",1,RemoveWspPackAction.SINGLETON)
this.reg.addToList("actions:packs:packsmgr","actionDownloadPack",1,DownloadWspPackAction.SINGLETON)
this.reg.addToList("actions:packs:packsmgr:toolbar","actionInstallPack",1,InstallWspPackAction.SINGLETON)
this.reg.addToList("accelkeys:packs:packsmgr","Delete",1,RemoveWspPackAction.SINGLETON)
let columnDefs=[]
columnDefs.push(new GridColTreeDef("packTitle").setLabel("Pack").setDefaultSort(1,"ascendant").setFlex("25em",1,1).setMinWidth("8em").setSortable(true).setCellBuilder(new CellBuildeWspPackTitle),new GridColDef("installDate").setLabel("Date").setDescription("Date d\'installation").setFlex("3em",1,1).setMinWidth("3em").setSortable(true).setCellBuilder(new CellBuilderDate("installDate").setCellClass("center").setDescriptionFunc((function(row){const d=this.getDate(row)
return d?Date.prototype.toLocaleDateString.call(this.getDate(row),"fr",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}):""}))),new GridColDef("installStatus").setLabel("Statut").setFlex("5em",1,1).setMinWidth("4em").setSortable(true).setCellBuilder(new CellBuilderEnum("installStatus",new Map([["uploadPending","Envoi en cours..."],["installPending","Installation en cours..."],["installed","Installé"],["installFailed","Non installé (échec)"]])).setCellClass("center").override("_getValue",(function(row){if(row.getData("packs")){return""}else{if(row.getData("system"))return"Système (non modifiable)"
else{if(WSPPACK.isStatusInstalled(row.getData("installStatus"))&&row.getData("error"))return"Non disponible"
return this.mappingTable.get(row.getData("installStatus"))||"Disponible"}}})).setDescriptionFunc(row=>WSPPACK.errorToString(row.getData("error")))))
if(!init.packsGrid)init.packsGrid=[]
if(init.packsGrid.columnDefs===undefined)init.packsGrid.columnDefs=columnDefs}isPackStatusPending(status){return WSPPACK.isStatusPending(status)}isPackStatusInstalled(status){return WSPPACK.isStatusInstalled(status)}async loadPacksListFromSRvs(){this._lastPacksListFromSrvs=[]
return Promise.all(this.packSrvList.map(async packSrv=>{if(packSrv.universe.reg.hasPerm("action.wspPacksMgr#list")){try{let packs=await WSPPACK.listPacks(packSrv)
if(packs)await Promise.all(packs.map(pack=>{let config=Object.create(pack)
config.packSrv=packSrv
this._lastPacksListFromSrvs.push(config)}))}catch(e){POPUP.showNotifError("Rafraichissement partiel de l\'écran",this.grid)
await ERROR.log(e)}}}))}static isAvailable(universes){if(universes){return universes.findIndex(univ=>univ.reg.hasPerm("action.wspPacksMgr#list"))>-1}return false}}customElements.define("wsp-packsmgr",WspPacksMgr)
REG.reg.registerSkin("wsp-packsmgr",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n`)
class CellBuildeWspPackTitle extends CellBuilderIconLabel{constructor(){super("title")}_isPortalRow(row){return row.getData("packs")?true:false}_getIcon(row){if(this._isPortalRow(row))return null
const wspDef=row.getData("wspTypeDef")
let wspTypeDefIndex=wspDef?wspDef.findIndex(wspDef=>"isOption"in wspDef?false:true):null
return wspTypeDefIndex>-1?"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/dialogs/packsMgr/wspppack.svg":"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/dialogs/packsMgr/wsppackopt.svg"}getColSortFn(){return(r1,r2)=>{function isPending(status){return status=="uploadPending"||status=="installPending"?true:false}const v1Status=r1.getData("installStatus")
const v2Status=r2.getData("installStatus")
const v1=isPending(v1Status)?0:1+this._getValue(r1)
const v2=isPending(v2Status)?0:1+this._getValue(r2)
if(v1==null){if(v2==null)return 0
return 1}else if(v2==null){return-1}return this._comparator?this._comparator.compare(v1,v2):v1.toString().localeCompare(v2)}}redrawCell(row,root){super.redrawCell(row,root)
if(this._isPortalRow(row)){const span=root.firstElementChild
const st=span.style
st.paddingInlineStart="unset"
st.marginInlineEnd="unset"
DOM.addClass(root,"portalrow")}}_getDescription(row){const installStatus=row.getData("installStatus")
const buildId=row.getData("buildId")
if(installStatus=="installFailed"){return"Échec à l\'installation :\n"+WSPPACK.errorToString(row.getData("error"))}else if(installStatus=="installed"){const wspTypeDef=row.getData("wspTypeDef")
let modelsStr=[]
let optionsStr=[]
if(wspTypeDef){wspTypeDef.forEach(wspDef=>{if(!WSPPACK.isOption(wspDef))modelsStr.push(" - "+WSPPACK.buildWspDefTitle(wspDef))
else optionsStr.push(" - "+WSPPACK.buildWspDefTitle(wspDef))})
modelsStr.sort()
optionsStr.sort()}let fullDescStr=[]
if(row.getData("error"))fullDescStr.push(WSPPACK.errorToString(row.getData("error")))
if(buildId)fullDescStr.push(`Identifiant de compilation du pack : ${buildId}`)
if(modelsStr.length>0){fullDescStr.push(modelsStr.length==1?"Modèle :":"Modèles :")
fullDescStr=fullDescStr.concat(modelsStr)}if(optionsStr.length>0){fullDescStr.push(optionsStr.length==1?"Extension :":"Extensions :")
fullDescStr=fullDescStr.concat(optionsStr)}return fullDescStr.join("\n")}else return""}}export class RemoveWspPackAction extends Action{constructor(id){super(id||"removeWspPack")
this.uninstallOnSrvPerm="action.packsMgr#uninstall.wspPack"
this._label="Désinstaller"
this._description="Désinstaller un modèle documentaire"
this._group="packs"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/dialogs/packsMgr/deletePack.svg")}async doUninstallOnSrv(packServer,packId){return WSPPACK.uninstallPack(packServer,packId)}isEnabled(ctx){const packsMgr=DOMSH.findHost(ctx.grid)
let selectedPacks=ctx.grid.dataHolder.getSelectedDatas()
if(!selectedPacks||selectedPacks.length==0)return false
let hasUnauthorizedPack=false
let hasAuthorizedPack=false
selectedPacks.forEach(pack=>{if(pack.packSrv&&"id"in pack){pack=pack
if(pack.system||!packsMgr.isPackStatusInstalled(pack.installStatus)||!pack.packSrv.universe.reg.hasPerm(this.uninstallOnSrvPerm)){hasUnauthorizedPack=true
return}else hasAuthorizedPack=true}})
return!hasUnauthorizedPack&&hasAuthorizedPack?super.isEnabled(ctx):false}isVisible(ctx){const packsMgr=DOMSH.findHost(ctx.grid)
if(packsMgr.packSrvList&&packsMgr.packSrvList.findIndex(packSrv=>packSrv.universe.reg.hasPerm(this.uninstallOnSrvPerm))==-1)return false
return super.isVisible(ctx)}async execute(ctx,ev){const packsMgr=DOMSH.findHost(ctx.grid)
try{let selectedDatas=ctx.grid.dataHolder.getSelectedDatas()
let filteredSelectedPacks=[]
selectedDatas.forEach(pack=>{if(pack.packSrv&&"id"in pack)filteredSelectedPacks.push(pack)})
const firstPackName=filteredSelectedPacks.length>0?filteredSelectedPacks[0].title:""
const nbPacks=filteredSelectedPacks.length
if(await POPUP.confirm(filteredSelectedPacks.length==1?`Voulez-vous vraiment désinstaller le pack \'${firstPackName}\' ?`:`Voulez-vous vraiment désinstaller les ${nbPacks} packs sélectionnés ?`,ctx.grid,{okLbl:"Désinstaller",cancelLbl:"Annuler"})){await Promise.all(Array.from(filteredSelectedPacks).map(async pack=>this.doUninstallOnSrv(pack.packSrv,pack.id)))
await packsMgr.refreshUi("full")}}catch(e){POPUP.showNotifError("La désinstallation n\'a pas pu avoir lieu dans son intégralité",ctx.grid)
await ERROR.log(e)
await packsMgr.refreshUi("full")}}}RemoveWspPackAction.SINGLETON=new RemoveWspPackAction
export class DownloadWspPackAction extends Action{constructor(id){super(id||"downloadWspPack")
this.downloadOnSrvPerm="action.packsMgr#download.wspPack"
this._label="Télécharger..."
this._description="Télécharger un modèle documentaire"
this._group="packs"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/dialogs/packsMgr/downloadPack.svg")}downloadPackUrlOnSrv(packServer,packId){return WSPPACK.getDownloadPackUrl(packServer,packId)}isEnabled(ctx){const packsMgr=DOMSH.findHost(ctx.grid)
let selectedPacks=ctx.grid.dataHolder.getSelectedDatas()
if(!selectedPacks||selectedPacks.length!=1)return false
let pack=selectedPacks[0]
if(!pack.packSrv||!("id"in selectedPacks[0])||pack.system||!packsMgr.isPackStatusInstalled(pack.installStatus))return false
if(!pack.packSrv.universe.reg.hasPerm(this.downloadOnSrvPerm))return false
return super.isEnabled(ctx)}isVisible(ctx){const packsMgr=DOMSH.findHost(ctx.grid)
if(packsMgr.packSrvList&&packsMgr.packSrvList.findIndex(packSrv=>packSrv.universe.reg.hasPerm(this.downloadOnSrvPerm))==-1)return false
return super.isVisible(ctx)}async execute(ctx,ev){const packsMgr=DOMSH.findHost(ctx.grid)
try{let selectedPacks=ctx.grid.dataHolder.getSelectedDatas()
let pack=selectedPacks[0]
const a=JSX.createElement("a",{href:this.downloadPackUrlOnSrv(pack.packSrv,pack.id)})
a.click()}catch(e){await ERROR.report("Téléchargement impossible",e)}}}DownloadWspPackAction.SINGLETON=new DownloadWspPackAction
export class SkinPacksMgr extends PacksMgr{constructor(){super(...arguments)
this._showLastNotInstalledPacksOnRefreshAll=true}async _initialize(init){if(!init.packExtensions)init.packExtensions=[".skinpack"]
super._initialize(init)}overrideInitialize(init){this.reg.addToList("actions:packs:packsmgr","actionRemovePacks",1,RemoveSkinPackAction.SINGLETON)
this.reg.addToList("actions:packs:packsmgr","actionDownloadPack",1,DownloadSkinPackAction.SINGLETON)
this.reg.addToList("actions:packs:packsmgr:toolbar","actionInstallPack",1,InstallSkinPackAction.SINGLETON)
this.reg.addToList("accelkeys:packs:packsmgr","Delete",1,RemoveSkinPackAction.SINGLETON)
let columnDefs=[]
columnDefs.push(new GridColTreeDef("packTitle").setLabel("Habillage graphique").setDefaultSort(1,"ascendant").setFlex("25em",1,1).setMinWidth("8em").setSortable(true).setCellBuilder(new CellBuildedSkinPackTitle),new GridColDef("usedInModels").setLabel("Modèles").setDescription("Modèles installés utilisant cet habillage graphique").setFlex("3em",1,1).setMinWidth("3em").setSortable(false).setCellBuilder(new CellBuilderSkinPackModels(this)),new GridColDef("installDate").setLabel("Date").setDescription("Date d\'installation").setFlex("3em",1,1).setMinWidth("3em").setSortable(true).setCellBuilder(new CellBuilderDate("installDate").setCellClass("center").setDescriptionFunc((function(row){const d=this.getDate(row)
return d?Date.prototype.toLocaleDateString.call(this.getDate(row),"fr",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}):""}))),new GridColDef("installStatus").setLabel("Statut").setFlex("5em",1,1).setMinWidth("4em").setSortable(true).setCellBuilder(new CellBuilderEnum("installStatus",new Map([["uploadPending","Envoi en cours..."],["installed","Installé"],["installFailed","Non installé (échec)"]])).setCellClass("center").override("_getValue",(function(row){if(row.getData("packs")){return""}else{if(row.getData("system"))return"Système (non modifiable)"
else{if(SKINPACK.isStatusInstalled(row.getData("installStatus"))&&row.getData("error"))return"Non disponible"
return this.mappingTable.get(row.getData(this.dataKey))||"Installé"}}}))))
if(!init.packsGrid)init.packsGrid=[]
if(init.packsGrid.columnDefs===undefined)init.packsGrid.columnDefs=columnDefs}isPackStatusPending(status){return SKINPACK.isStatusPending(status)}isPackStatusInstalled(status){return SKINPACK.isStatusInstalled(status)}buildPackTitle(pack){return SKINPACK.buildPackTitle(pack)}async loadPacksListFromSRvs(){this._lastPacksListFromSrvs=[]
return Promise.all(this.packSrvList.map(async packSrv=>{if(packSrv.universe.reg.hasPerm("action.skinPacksMgr#list")){try{let packs=await SKINPACK.list(packSrv)
if(packs)await Promise.all(packs.map(pack=>{let config=Object.create(pack)
config.packSrv=packSrv
this._lastPacksListFromSrvs.push(config)}))}catch(e){POPUP.showNotifError("Rafraichissement partiel de l\'écran",this.grid)
await ERROR.log(e)}}}))}static isAvailable(universes){if(universes){return universes.findIndex(univ=>univ.reg.hasPerm("action.wspPacksMgr#list"))>-1}return false}emptyBody(){switch(this.fetchState){case"done":return JSX.createElement("c-msg",null,"Aucun habillage graphique installé")
case"failed":return JSX.createElement("c-msg",{level:"error"},"Échec au chargement")
default:return JSX.createElement("c-msg",null,"Chargement en cours...")}}}customElements.define("skin-packsmgr",SkinPacksMgr)
REG.reg.registerSkin("skin-packsmgr",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n`)
class CellBuildedSkinPackTitle extends CellBuildeWspPackTitle{_getIcon(row){const packSrv=row.getData("packSrv")
const skinSetCode=row.getData("skinSetCode")
const hasSkinSetIcon=row.getData("skinSetIcon")?true:false
const installStatus=row.getData("installStatus")
if(this._isPortalRow(row))return null
return(!SKINPACK.isStatusPending(installStatus)&&packSrv&&skinSetCode&&hasSkinSetIcon?SKINPACK.getIconUrl(packSrv,skinSetCode):"")||"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/dialogs/packsMgr/skinppack.svg"}_getDescription(row){let fullDescStr=[]
if(row.getData("error"))fullDescStr.push(SKINPACK.errorToString(row.getData("error")))
const buildId=row.getData("buildId")
if(buildId)fullDescStr.push(`Identifiant de compilation du pack : ${buildId}`)
const skinClasses=row.getData("skinClasses")
if(skinClasses&&skinClasses.length){fullDescStr.push(`Classes de skin stylées par cet habillage graphique :`)
skinClasses.forEach(entry=>fullDescStr.push(` - ${entry}`))}return fullDescStr.join("\n")}}export class CellBuilderSkinPackModels extends CellBuilderString{constructor(packsMgr){super(null)
this.packsMgr=packsMgr}redrawCell(row,root){const cacheHolder=row.cacheHolder
let cache=cacheHolder["-models"]
const rowDatas=row.rowDatas
if(cache==null){DOM.setTextContent(root,"...")
cacheHolder["-models"]=cache=SKINPACK.ListSkinClassesForWspType(rowDatas.packSrv,rowDatas.id).then(resp=>{if(cacheHolder["-models"]!==cache)return
return cacheHolder["-models"]=resp})}if(cache instanceof Promise){DOM.setTextContent(root,"...")
root._modelsPending=cache
cache.then(()=>{if(root._modelsPending!==cache)return
root._modelsPending=null
redrawCellUi.call(this)})}else{root._modelsPending=null
redrawCellUi.call(this)}function redrawCellUi(){DOM.setTextContent(root,null)
const skinClassesForWspType=cacheHolder["-models"]
if(skinClassesForWspType&&skinClassesForWspType.length){const list=skinClassesForWspType.sort((e1,e2)=>{if(e1.wspTypeRef.isOption&&!e2.wspTypeRef.isOption)return 1
if(e2.wspTypeRef.isOption&&!e1.wspTypeRef.isOption)return-11
return e2.wspTypeRef.title.localeCompare(e1.wspTypeRef.title)})
if(skinClassesForWspType.length<3){DOM.setTextContent(root,skinClassesForWspType.map(entry=>entry.wspTypeRef.title).join(", "))}else{const base=skinClassesForWspType.slice(0,2).map(entry=>entry.wspTypeRef.title).join(", ")
DOM.setTextContent(root,`${base}...`)}root.title="Modèles installés utilisant cet habillage graphique :\n"
root.title+=skinClassesForWspType.map(entry=>`- ${entry.wspTypeRef.title}`).join("\n")}else{DOM.setTextContent(root,"Aucun")
delete root.title}}}}export class DownloadSkinPackAction extends DownloadWspPackAction{constructor(id){super(id||"downloadSkinPack")
this.downloadOnSrvPerm="action.packsMgr#download.skinPack"
this._label="Télécharger..."
this._description="Télécharger l\'habillage graphique"
this._group="packs"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/dialogs/packsMgr/downloadPack.svg")}downloadPackUrlOnSrv(packServer,packId){return SKINPACK.getDownloadPackUrl(packServer,packId)}}DownloadSkinPackAction.SINGLETON=new DownloadSkinPackAction
export class RemoveSkinPackAction extends RemoveWspPackAction{constructor(id){super(id||"removeSkinPack")
this.uninstallOnSrvPerm="action.packsMgr#uninstall.skinPack"
this._label="Désinstaller"
this._description="Désinstaller l\'habillage graphique"
this._group="packs"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/dialogs/packsMgr/deletePack.svg")}async doUninstallOnSrv(packServer,packId){return SKINPACK.deleteSkin(packServer,packId)}}RemoveSkinPackAction.SINGLETON=new RemoveSkinPackAction
const actionRefreshUi=new Action("refreshUi").setLabel("Rafraichir").setGroup("refresh").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/refresh.svg").setExecute((async function(ctx,ev){await ctx.refreshUi()}))

//# sourceMappingURL=packsMgr.js.map