import{BASIS,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{GridSmall}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{CellBuilderDate,CellBuilderEnum,CellBuilderIconLabel,CellBuilderLabel,CellBuilderString}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{AccelKeyMgr,ACTION,Action,ActionWrapper}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{GridDataHolderJsonTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/dialogs_Perms.js"
import{EWspLoadingStatus,Wsp,WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{CreateDrfWspAction,CreateDrvWspAction,CreateWspFromWspAction,DeletePermanentlyWspsAction,DeleteWspAction,DeleteWspsAction,OpenPermsWspAction,OpenPropsWspAction,OpenPropsWspsAction,RestoreWspsAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/wspActions.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{BaseAreaViewAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{WSPPACK}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/pack.js"
import{EUserAspects,USER}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
import{Tabs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tabs.js"
import{AreaAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{CreateWspAction,ImportWspAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/chainActions.js"
import{OpenWsp}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/wspList.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{AppFrameDeskFeat}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/appFrame.js"
export class WspsMgr extends BaseAreaViewAsync{async _initialize(init){this.reg=init.reg
this._msg=JSX.createElement(MsgLabel,null)
this.reg.addToList("wsps-mgr-tab","alive",1,(new AreaAsync).setLabel("Ateliers").setBodyBuilder(ctx=>JSX.createElement(AliveWspsMgr,{"î":{reg:this.reg}})),1)
if(this.reg.env.universe.config.backEnd==="odb"){this.reg.addToList("wsps-mgr-tab","trashed",1,(new AreaAsync).setLabel("Corbeille").setDescription("Ateliers supprimés placés en corbeille").setBodyBuilder(ctx=>JSX.createElement(TrashedWspsMgr,{"î":{reg:this.reg}})),1)}this._tabs=JSX.createElement(Tabs,{"areas-context":"wsps-mgr-tab-ctxt","areas-list":init.tabAreasLists||"wsps-mgr-tab"})
this._attach(this.tagName,init,this._tabs)}onViewBeforeHide(close){return this._tabs.selectedTab.view.onViewBeforeHide(close)}async onViewWaitForHide(close){return this._tabs.selectedTab.view.onViewWaitForHide(close)}visitViews(visitor,options){if(this._tabs)this._tabs.visitViews(visitor,options)}visitViewsAsync(visitor,options){if(this._tabs)return this._tabs.visitViewsAsync(visitor,options)}}REG.reg.registerSkin("wsps-wspsmgr",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tflex: 1;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t}\n\n\tc-tabs {\n\t\tflex: 1;\n\t}\n`)
customElements.define("wsps-wspsmgr",WspsMgr)
class WspsListMgr extends BaseAreaViewAsync{constructor(){super(...arguments)
this.wspsActionsContext={openWspAfterCreate:false}}async _initialize(init){this.reg=REG.createSubReg(init.reg)
this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin("wsps-list-wspsmgr",init)}async initUi(init){const sr=this.shadowRoot
this.grid=new GridSmall
this._onWspLiveStateChange=this.onWspLiveStateChange.bind(this)
this.reg.env.place=this.reg.env.universe.wspServer.wspsLive.newPlace()
this.reg.env.place.eventsMgr.on("wspLiveStateChange",this._onWspLiveStateChange)
this.reg.addToList("actions:wsps:wspsmgr:toolbar","actionRefreshUi",1,actionRefreshUi)
let accelKeyMgr=(new AccelKeyMgr).initFromMapActions(this.reg.mergeListsAsMap("accelkeys:wsps:wspsmgr"))
this.wspsActions=this.reg.mergeLists("actions:wsps:wspsmgr:toolbar","actions:wsps:wspsmgr")
accelKeyMgr.initFromMapActions(this.reg.getListAsMap("accelkeys:wspApp:global"))
let headerElt=sr.appendChild(JSX.createElement("div",{id:"header"}))
this.filterInput=headerElt.appendChild(JSX.createElement("div",{id:"search"})).appendChild(JSX.createElement("input",{placeholder:"Filtrer...",type:"search",oninput:this.onFilterInput}))
this.wspsToolbar=headerElt.appendChild((new BarActions).initialize({reg:this.reg,actions:ACTION.injectSepByGroup(this.wspsActions,this.reg.getPref("actions.wsps.wspsmgr.groupOrder","wsps * refresh"),this.wspsActionsContext),uiContext:"bar",actionContext:this.wspsActionsContext,disableFullOverlay:true}))
this.dataHolder=new GridDataHolderJsonTree("wsps")
const initPacksGrid=BASIS.newInit(init.wspsGrid,this.reg)
if(initPacksGrid.skinScroll===undefined)initPacksGrid.skinScroll="scroll/small"
if(initPacksGrid.lineDrawer===undefined)initPacksGrid.lineDrawer=this
if(initPacksGrid.accelKeyMgr===undefined)initPacksGrid.accelKeyMgr=accelKeyMgr
initPacksGrid.dataHolder=this.dataHolder
initPacksGrid.selType="multi"
initPacksGrid.emptyBody=this.emptyBody.bind(this)
initPacksGrid.skinOver="wspsmgr-list-grid"
initPacksGrid.autoSelOnFocus="first"
initPacksGrid.defaultAction=OpenPropsWspAction.SINGLETON
this.grid.initialize(initPacksGrid)
this.grid.ctxMenuActions={actions:ACTION.injectSepByGroup(this.reg.mergeLists("actions:wsps:wspsmgr:ctxtmenu","actions:wsps:wspsmgr"),this.reg.getPref("actions.wsps.wspsmgr.groupOrder","wsps wps * refresh"),this),actionContext:this.wspsActionsContext}
this.grid.addEventListener("keydown",ev=>{accelKeyMgr.handleKeyboardEvent(ev,this)})
this.grid.addEventListener("grid-select",(function(ev){const wspsMgr=DOMSH.findHost(this)
let selectedWsps=wspsMgr.getSelectedWsps()
wspsMgr.wspsActionsContext.reg=wspsMgr.wspsActionsContext.regs=undefined
if(!selectedWsps||selectedWsps.length==0){wspsMgr.wspsActionsContext.reg=wspsMgr.reg}else if(selectedWsps.length==1){wspsMgr.wspsActionsContext.reg=selectedWsps[0].reg}else{wspsMgr.wspsActionsContext.reg=wspsMgr.reg
wspsMgr.wspsActionsContext.regs=[]
selectedWsps.forEach(wsp=>{wspsMgr.wspsActionsContext.regs.push(wsp.reg)})}wspsMgr.wspsToolbar.refreshContent()}))
this.grid.uiEvents.on("rowDblclick",(row,ev)=>{OpenPropsWspAction.SINGLETON.executeIfAvailable(this.wspsActionsContext,ev)})
this.grid.setAttribute("c-resizable","")
sr.appendChild(this.grid)
this.dataHolder.connectToGrid(this.grid)
return this.refresh()}async _refresh(){this.refreshFreeze(1)
try{super._refresh()
const selectedWsps=this.getSelectedWsps()
this.filterInput.value=""
this.fetchState="pending"
this._lastListWsps=await this.listWsps()
this._lastListWsps.sort((w1,w2)=>(w1.title||w1.wspCd).localeCompare(w2.title||w2.wspCd))
this.fetchState="done"
this._lastListWsps.forEach(wspInfos=>{if(wspInfos.status!==EWspLoadingStatus.notLoaded&&!this.reg.env.place.isConcernedByWsp(wspInfos.wspCd))this.reg.env.place.registerWsp(this.getRowDatasWsp(wspInfos))})
this.dataHolder.setDatas(this._lastListWsps)
if(selectedWsps)this.selectByWsp(selectedWsps)
else this.grid.setSelectedRows(0)
this.grid.focus()}catch(e){this.fetchState="failed"
this._lastListWsps=[]
this.dataHolder.setDatas([])
throw e}finally{this.refreshFreeze(-1)}}getRowDatasWsp(rowData){if(!rowData.wsp)rowData.wsp=new Wsp(this.reg.env.universe.wspServer,rowData.wspCd,rowData)
return rowData.wsp}redrawLine(row,line){DOM.setAttrBool(line,"data-removed",row.rowDatas.status==EWspLoadingStatus.noWsp)}emptyBody(){switch(this.fetchState){case"done":return JSX.createElement("c-msg",null,"Aucun atelier")
case"failed":return JSX.createElement("c-msg",{level:"error"},"Échec au chargement")
default:return JSX.createElement("c-msg",null,"Chargement en cours...")}}onFilterInput(ev){const me=DOMSH.findHost(this)
const selectedWsps=me.getSelectedWsps()
const text=this.value
if(text){const pattern=new RegExp(LANG.escape4RegexpFuzzy(text),"i")
const fullArr=me.dataHolder.getDatas()
const arr=[]
for(let i=0,s=fullArr.length;i<s;i++){const v=fullArr[i]
if(pattern.test(v.title))arr.push(v)}me.dataHolder.setDatas(arr)}else{me.dataHolder.setDatas(me._lastListWsps)}if(selectedWsps)me.selectByWsp(selectedWsps)}selectByWsp(wsps){if(wsps!=null){const selectedRows=[]
for(let i=0,c=this.dataHolder.countRows();i<c;i++){const wspRow=this.dataHolder.getRow(i).rowDatas
if(wspRow&&wsps.find(wsp=>{if(wsp&&wsp.code==wspRow.wspCd)return true})){selectedRows.push(i)}}this.grid.setSelectedRows(selectedRows)}}getSelectedWsps(){const wsps=[]
if(this.dataHolder){this.dataHolder.getSelectedDatas().forEach(entry=>{wsps.push(this.getRowDatasWsp(entry))})}return wsps}onViewShown(){if(this.initialized)this.refresh()}onViewBeforeHide(close){return true}onViewHidden(closed){if(this.initialized){if(closed)this.reg.env.place.closePlace()}else{this.initializedAsync.then(()=>this.onViewHidden())}}async onWspLiveStateChange(wsp){let datas=this.dataHolder.getDatas()
let wspEntry=datas.find(entry=>entry.wspCd===wsp.code)
if(wspEntry){const offset=this.dataHolder.getOffset(wspEntry)
let infoWsp=wsp.infoWsp||wsp.infoWspError
if(wsp.isDeleted){this.dataHolder.updateDatasInTree(null,offset,1)}else if(infoWsp){Object.assign(wspEntry,infoWsp)
this.grid.invalidateRows(offset,1)}}}}REG.reg.registerSkin("wsps-list-wspsmgr",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t#header {\n\t\tdisplay: flex;\n\t\t/*flex-direction: column;*/\n\t}\n\n\tc-bar-shared {\n\t\tflex: unset;\n\t\tmin-height: min-content;\n\t\tmin-width: min-content;\n\t}\n\n\tinput {\n\t\tflex: 1;\n\t  padding: 2px;\n\t  background: none;\n\t  color: var(--form-color);\n\t  border: none;\n\t  font-size: inherit;\n  }\n\n  #search {\n\t  display: flex;\n\t  flex: 1;\n\t  min-height: min-content;\n\t  min-width: min-content;\n\t  background: .1em / 1em no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/filter.svg) var(--form-search-bgcolor);\n\t  padding-inline-start: 1.2em;\n\t  border-inline-end: 1px solid var(--border-color);\n  }\n\n  input:focus {\n\t  outline: none;\n  }\n\n  input::placeholder {\n\t  color: var(--fade-color);\n\t  letter-spacing: 2px;\n\t  font-size: .8em;\n\t  font-style: italic;\n  }\n\n  input:focus::placeholder {\n\t  color: transparent;\n  }\n`)
REG.reg.registerSkin("wspsmgr-list-grid",1,`\n\t:host {\n\t\tflex: 1;\n\t}\n\n\t.warning {\n\t\tfont-style: italic;\n\t\tcolor: var(--warning-color);\n  }\n\n  .error {\n\t  color: var(--error-color);\n  }\n\n  .trashed {\n\t  text-decoration-line: line-through;\n\t  font-style: italic;\n  }\n\t.line[data-removed]{\n\t  text-decoration:line-through;\n\t}\n\n`)
export class AliveWspsMgr extends WspsListMgr{async _initialize(init){var _a
await super._initialize(init)
this._initAndInstallSkin("wsps-alive-wspsmgr",init)
this.reg.addToList("actions:wsps:wspsmgr","actionCreateWsp",1,new ActionWrapperRefreshWspMgr(this).setOverridenSvc(CreateWspAction.SINGLETON),1)
this.reg.addToList("actions:wsps:wspsmgr","actionCreateWspFromWsp",1,new ActionWrapperRefreshWspMgr(this).setOverridenSvc(CreateWspFromWspAction.SINGLETON),1)
this.reg.addToList("actions:wsps:wspsmgr","actionDeleteWsp",1,new ActionWrapperOnWspsChanges(this).setOverridenSvc((new ActionWrapper).setExecute((async function(ctx,ev){var _a,_b,_c
const mainApp=desk.getMainApp()
if((_c=(_b=(_a=mainApp)===null||_a===void 0?void 0:_a.reg)===null||_b===void 0?void 0:_b.env.wsp)===null||_c===void 0?void 0:_c.equals(ctx.reg.env.wsp))if(AppFrameDeskFeat.isIn(desk))await desk.gotoHome()
return this.getWrapped(ctx).execute(ctx,ev)})).setOverridenSvc(DeleteWspAction.SINGLETON)))
this.reg.addToList("actions:wsps:wspsmgr","actionDeleteWsps",1,new ActionWrapperOnWspsChanges(this).setOverridenSvc((new ActionWrapper).setExecute((async function(ctx,ev){var _a,_b,_c
const mainApp=desk.getMainApp()
if(mainApp&&((_a=ctx.regs)===null||_a===void 0?void 0:_a.length)){for(const reg of ctx.regs){if((_c=(_b=mainApp)===null||_b===void 0?void 0:_b.reg)===null||_c===void 0?void 0:_c.env.wsp.equals(reg.env.wsp)){if(AppFrameDeskFeat.isIn(desk))await desk.gotoHome()
break}}}return this.getWrapped(ctx).execute(ctx,ev)})).setOverridenSvc(DeleteWspsAction.SINGLETON)))
this.reg.addToList("actions:wsps:wspsmgr","actionOpenPropsWsp",1,new ActionWrapperOnWspsChanges(this).setOverridenSvc(OpenPropsWspAction.SINGLETON))
this.reg.addToList("actions:wsps:wspsmgr","actionOpenPermsWsp",1,new ActionWrapperOnWspsChanges(this).setOverridenSvc(OpenPermsWspAction.SINGLETON))
this.reg.addToList("actions:wsps:wspsmgr","actionPropsWspsModel",1,new ActionWrapperOnWspsChanges(this).setOverridenSvc(OpenPropsWspsAction.SINGLETON))
this.reg.addToList("actions:wsps:wspsmgr:toolbar","actionRefreshUi",1,actionRefreshUi)
this.reg.addToList("actions:wsps:wspsmgr:toolbar","actionImportWsp",1,new ActionWrapperRefreshWspMgr(this).setOverridenSvc(ImportWspAction.SINGLETON),2)
const wspsMgr=this
this.reg.addToList("actions:wsps:wspsmgr:ctxtmenu","actionCreateDrfWsp",1,new ActionWrapperRefreshWspMgr(this).setOverridenSvc(CreateDrfWspAction.SINGLETON))
this.reg.addToList("actions:wsps:wspsmgr:ctxtmenu","actionCreateDrvWsp",1,new ActionWrapperRefreshWspMgr(this).setOverridenSvc(CreateDrvWspAction.SINGLETON))
this.reg.addToList("actions:wsps:wspsmgr:ctxtmenu","actionOpenWsp",1,(new ActionWrapper).setExecute((function(ctx,ev){const popup=POPUP.findPopupableParent(wspsMgr)
if(popup)popup.close()
return this.getWrapped(ctx).execute(ctx,ev)})).setOverridenSvc(new OpenWsp(WSP.defaultWspOpenMode(this.reg)).setLabel("Ouvrir l\'atelier...")))
let columnDefs=[]
columnDefs.push(new GridColDef("title").setLabel("Titre").setDefaultSort(1,"ascendant").setFlex("25em",1,1).setMinWidth("8em").setSortable(true).setCellBuilder(new CellBuilderString("title").override("_getValue",row=>{if(row.rowDatas.title)return row.rowDatas.title
let wsp=this.getRowDatasWsp(row.rowDatas)
return wsp.wspTitle||"[Non titré]"})),new GridColDef("wspCd").setLabel("Modèle").setFlex("15em",1,1).setMinWidth("6em").setSortable(true).setCellBuilder(new CellBuilderWspModel("wspType")))
if((_a=this.reg.env.universe.adminUsers)===null||_a===void 0?void 0:_a.hasAspect(EUserAspects.rolable)){columnDefs.push(new GridColDef("wspSetPerms").setLabel("Permissions affectées").setDescription("Permissions affectées sur l\'atelier").setFlex("10em",1,1).setMinWidth("6em").setSortable(true).setCellBuilder(new CellBuilderWspSpecifiedRoles))}columnDefs.push(new GridColDef("status").setLabel("Statut").setFlex("5em",1,1).setMinWidth("4em").setSortable(true).setCellBuilder(new CellBuilderEnum("status",new Map([[EWspLoadingStatus.notLoaded,""],[EWspLoadingStatus.loading,"Chargement en cours..."],[EWspLoadingStatus.noWsp,"Supprimé"],[EWspLoadingStatus.ok,"Opérationnel"],[EWspLoadingStatus.failed,"Non accessible"]])).setCellClass("center").setDescriptionFunc(row=>{const key=row.getData("status")||""
return key===EWspLoadingStatus.notLoaded?"Information non disponible":""})))
if(!init.wspsGrid)init.wspsGrid=[]
if(init.wspsGrid.columnDefs===undefined)init.wspsGrid.columnDefs=columnDefs
return this.initUi(init)}async listWsps(){return(await WSP.listWsps(this.reg.env.universe.wspServer,{fields:["srcRoles","srcRi"],withWspSrcSpecifiedRoles:true})).wsps}}customElements.define("wsps-alive-wspsmgr",AliveWspsMgr)
REG.reg.registerSkin("wsps-alive-wspsmgr",1,`\n\n`)
export class TrashedWspsMgr extends WspsListMgr{async _initialize(init){await super._initialize(init)
this._initAndInstallSkin("wsps-trashed-wspsmgr",init)
this.reg.addToList("actions:wsps:wspsmgr","actionDeletePermanentlyWsps",1,new ActionWrapperRefreshWspMgr(this).setOverridenSvc(DeletePermanentlyWspsAction.SINGLETON))
this.reg.addToList("actions:wsps:wspsmgr","actionRestoreWsps",1,new ActionWrapperRefreshWspMgr(this).setOverridenSvc(RestoreWspsAction.SINGLETON))
let columnDefs=[]
columnDefs.push(new GridColDef("title").setLabel("Titre").setDefaultSort(1,"ascendant").setFlex("25em",1,1).setMinWidth("8em").setSortable(true).setCellBuilder(new CellBuilderIconLabel("title").override("_getValue",row=>{if(row.rowDatas.title)return row.rowDatas.title
let wsp=this.getRowDatasWsp(row.rowDatas)
return wsp.wspTitle||"[Non titré]"}).override("_getIcon",row=>"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/wsp/wspTrashed.svg")),new GridColDef("dt").setLabel("Date de suppression").setSortable(true).setFlex("6em",1,1).setMinWidth("2em").setSortable(true).setCellBuilder(new CellBuilderDate("srcDt").setCellClass("center").override("_getValue",row=>row.rowDatas.srcFields.srcDt)))
if(!init.wspsGrid)init.wspsGrid=[]
if(init.wspsGrid.columnDefs===undefined)init.wspsGrid.columnDefs=columnDefs
return this.initUi(init)}async listWsps(){return(await WSP.listWsps(this.reg.env.universe.wspServer,{inTrash:true,fields:["srcDt","srcRoles","srcRi"]})).wsps}redrawLine(row,line){DOM.addClass(line,"trashed")}emptyBody(){switch(this.fetchState){case"done":return JSX.createElement("c-msg",null,"Aucun atelier en corbeille")
default:return super.emptyBody()}}}customElements.define("wsps-trashed-wspsmgr",TrashedWspsMgr)
REG.reg.registerSkin("wsps-trashed-wspsmgr",1,`\n\n`)
const actionRefreshUi=new Action("refreshUi").setLabel("Rafraichir").setGroup("refresh").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/refresh.svg").setExecute((async function(ctx,ev){const me=DOMSH.findHost(ev.target)
await me.refresh()}))
class CellBuilderWspModel extends CellBuilderLabel{redrawCell(row,root){super.redrawCell(row,root)
if(row.rowDatas.wspTypeWarn){DOM.addClass(root,"warning")}else DOM.removeClass(root,"warning")}_getValue(row){return WSPPACK.buildWspTypeTitle(row.rowDatas,{ext:null,version:true,lang:true})||(row.rowDatas.wspTypeWarn==="unknown"?"Inconnu":"")}_getDescription(row){let desc=[]
if(row.rowDatas.wspTypeWarn==="unknown")desc.push("Modèle documentaire inconnu")
desc.push(WSPPACK.buildWspTypeTitle(row.rowDatas,{ext:true,version:true,lang:true}))
return desc.join("\n")}}class CellBuilderWspSpecifiedRoles{redrawCell(row,root){const reg=REG.findReg(root)
DOM.addClass(root,"center")
const cacheHolder=row.cacheHolder
let cache=cacheHolder["specifRolesBody"]
if(cache==null){let accounts
if(row.rowDatas.srcSpecifiedRoles&&(accounts=Object.keys(row.rowDatas.srcSpecifiedRoles)).length>0){DOM.setTextContent(root,accounts.length.toString())
const useUsers=reg.env.universe.useUsers
const userAccounts=Object.keys(row.rowDatas.srcSpecifiedRoles)
cacheHolder["specifRolesBody"]=cache=Promise.all(userAccounts.map(account=>useUsers.getUserBatch(account))).then(users=>{if(cacheHolder["specifRolesBody"]!==cache)return
const nickNames=[]
for(let i=0;i<userAccounts.length;i++){const user=users[i]
nickNames.push(user?USER.getPrimaryName(user):userAccounts[i])}nickNames.sort((a,b)=>a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()))
cacheHolder["specifRolesTitle"]=nickNames.join("\n")
const count=nickNames.length
if(count>5){cacheHolder["specifRolesBody"]=count.toString()}else{const names=nickNames.join(", ")
cacheHolder["specifRolesBody"]=`${count} (${names})`}})}else{cache=cacheHolder["specifRolesBody"]="-"}}if(cache instanceof Promise){DOM.setTextContent(root,Object.keys(row.rowDatas.srcSpecifiedRoles).length.toString())
root.specifRolesPending=cache
cache.then(()=>{if(root.specifRolesPending!==cache)return
root.specifRolesPending=null
DOM.setTextContent(root,cacheHolder["specifRolesBody"])
DOM.setAttr(root,"title",cacheHolder["specifRolesTitle"])})}else{root.specifRolesPending=null
DOM.setTextContent(root,cache)
DOM.setAttr(root,"title",cache==="-"?null:cacheHolder["specifRolesTitle"])}}_getValue(row){return WSPPACK.buildWspTypeTitle(row.rowDatas,{ext:null,version:true,lang:true})||(row.rowDatas.wspTypeWarn==="unknown"?"Inconnu":"")}getColSortFn(){return undefined}}class ActionWrapperRefreshWspMgr extends ActionWrapper{constructor(wspsMgr){super()
this.wspsMgr=wspsMgr}async execute(ctx,ev){let result=await super.execute(ctx,ev)
await this.wspsMgr._refresh()
if(typeof result==="object"){let wsp=result
this.wspsMgr.selectByWsp([wsp])}return result}}class ActionWrapperOnWspsChanges extends ActionWrapper{constructor(wspsMgr){super()
this.wspsMgr=wspsMgr}async execute(ctx,ev){var _a
if(ctx.regs){ctx.regs.forEach(entry=>{if(entry.env.wsp&&!this.wspsMgr.reg.env.place.getWsp(entry.env.wsp.code))this.wspsMgr.reg.env.place.registerWsp(entry.env.wsp)})}else if(((_a=ctx.reg)===null||_a===void 0?void 0:_a.env.wsp)&&!this.wspsMgr.reg.env.place.getWsp(ctx.reg.env.wsp.code))this.wspsMgr.reg.env.place.registerWsp(ctx.reg.env.wsp)
await super.execute(ctx,ev)}}
//# sourceMappingURL=wspsMgr.js.map