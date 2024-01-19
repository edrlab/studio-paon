import{BASIS,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{Workbench}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/workbench.js"
import{DeleteSrc,ExportScar,ExportScwsp,FocusItemOrSpace,ImportFiles,ImportScar,OpenFastFindItem,OpenSearchItems,OpenWspTrash,RenameSrc,SetPermsSpace,ShortDescCopy,ShowNetItems}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{BookmarksArea,ExplorerArea,GeneratorTabsArea,NetItemsArea,SearchesArea,TasksArea,TocArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/areas/wspWorkbench.js"
import{SpaceTreeCollapseAllAction,SpaceTreeCopyTo,SpaceTreeCreateItem,SpaceTreeCreateSpace,SpaceTreeDuplicate,SpaceTreeFocusItem,SpaceTreeMoveTo,SpaceTreePaste,SpaceTreePasteMove,SpaceTreeRename}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/spaceTree.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/views_Perms.js"
import{Action,ActionMenu,ActionSeparator,ActionSignboardWrapper}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{InfoBrokerBasic}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/infos.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{InfoCurrentItem,InfoFocusItem,InfoReqCurrentItem,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{LASTDATAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lastDatas.js"
import{ItemViewerMulti}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemViewerMulti.js"
import{ELong2DateStyles,ESearchExportColumnStatus,SearchExportColumn,SearchFuncAccountProp,SearchFuncLong2Date,SearchFuncProps,SearchFuncResponsibles,SearchFuncTranslateStr,SearchFuncUri2LeafName,SearchFuncUri2Space}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{CellBuilderItModel,CellBuilderItModelFlagIcon,CellBuilderLc,CellBuilderLcFlag,CellBuilderResp,CellBuilderResps,CellBuilderSpace,CellBuilderSrcIconCode,CellBuilderTkDeadline,CellBuilderTkScheduledD}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcGridColumns.js"
import{CellBuilderDate,CellBuilderString}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{CellBuilderAccount}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/usersGrid.js"
import{ExportRes,ImportFolder,ImportRes}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/itemActions.js"
import{RibbonLc,RibbonResp,RibbonTasks}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/ribbon/ribbon.js"
import{registerWspProtocolsActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/scProtocolActions.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/apps/apps_Perms.js"
import{WspBaseApp}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/apps/wspBaseApp.js"
import{WedSearchCoordinator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/searchBar.js"
import{EItemTypeFamily,ETaskFeatures,LC_DEFAULT_NAME}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js"
import{HistoEditPointsMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/histoEditPoints.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{ScanFsUpdatesAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/wspActions.js"
export class WspApp extends WspBaseApp{constructor(){super(...arguments)
this.shortDescs=[]}get emitter(){return this}async _initialize(init){this._config=init
this.appDef=init.appDef
this.universe=init.reg.env.universe
this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.wsp=this.universe.wspServer.wspsLive.findWsp(this.appDef.wsp,true)
return this._initApp(init)}async _initApp(init){this.infoBroker=new InfoBrokerBasic
this.infoBroker.addConsumer(this)
this.workbench=null
this.itemViewer=null
const sr=this.shadowRoot
const pendingUi=new MsgLabel
if(!await this._initWsp(init,pendingUi))return
if(!await this._initReg(init,"wspApp","ui.wspApp",pendingUi))return
const reg=this.reg
this.reg.env.wedSearchCoord=new WedSearchCoordinator
BASIS.clearContent(sr)
this.workbench=sr.appendChild(JSX.createElement(Workbench,{class:reg.getUserData("showFlapTabs",true)?undefined:"hideFlapTabs","î":{toolbarsPrefix:"wspApp:tools:",reg:reg,ctx:this,skinOver:"wsp-app/c-workbench",lastDatasKey:"wb",lastDatas:init.lastDatas&&init.lastDatas["wb"],lb:{selTab:""},rt:{selTab:""},rb:{selTab:""},bl:{selTab:""},br:{selTab:""}}}))
if(reg.env.universe.config.backEnd==="fs"){const explo=this.workbench.getTab("explorer")
if(explo){const btn=ActionBtn.buildButton(new ScanFsUpdatesAction,this,"bar",explo)
btn.className="label"
explo.appendChild(btn)}}this._initAppHeader(init,[this.workbench,...this.workbench.tools],"actions:wspApp:main","actions:wspApp:more")
this.workbench.appendChild(this.appHeader)
this._refreshTitle(null)
this._refreshMigration()
const main=this.workbench.appendChild(JSX.createElement("main",null))
this.itemViewer=init.itemViewer||new ItemViewerMulti
if(this.wsp.hasFeature("trash"))this.itemViewer.fallbackOpenSrcRef=this.fallbackOpenSrcRef
await this.itemViewer.initViewer(reg,main,init.lastDatas,this.appDef.srcRef)
if(this._lastWspMetaUi!==this.wsp.wspMetaUi)return
init.lastDatas=undefined
const injectLoads=reg.getList("wspApp:load")
if(injectLoads)for(const lstn of injectLoads){const result=lstn(this)
if(result instanceof Promise){await result
if(this._lastWspMetaUi!==this.wsp.wspMetaUi)return}}}reloadApp(){this.onViewHidden(true)
this.reinitializeStarted(this._initApp(this._config))}onViewShown(){if(this.initialized){if(this.workbench)VIEWS.onContainerShown(this.workbench)
if(this.itemViewer)this.itemViewer.onViewShown()}else{this.initializedAsync.then(()=>this.onViewShown())}}onViewHidden(closed){var _a,_b,_c,_d,_e,_f
if(this.initialized){if(closed){const injectClose=(_a=this.reg)===null||_a===void 0?void 0:_a.getList("wspApp:close")
if(injectClose)for(const lstn of injectClose)lstn(this);(_c=(_b=this.reg)===null||_b===void 0?void 0:_b.env.place)===null||_c===void 0?void 0:_c.closePlace()}if(this.workbench)VIEWS.onContainerHidden(this.workbench,closed);(_d=this.itemViewer)===null||_d===void 0?void 0:_d.onViewHidden(closed);(_e=this._lastMigrPopup)===null||_e===void 0?void 0:_e.close()
if(closed)(_f=this.reg)===null||_f===void 0?void 0:_f.close()}else{this.initializedAsync.then(()=>this.onViewHidden(closed))}}updateAppDef(def){if(this.appDef===def)return true
if(this.appDef.wsp&&def.wsp!==this.appDef.wsp)return false
this.appDef=def
if(this.initialized){if(this.wsp&&this.wsp.isAvailable){this.onAppDefChange()}else{this.reloadApp()}}else{this.initializedAsync.then(()=>this.onAppDefChange())}return true}onAppDefChange(){if(this.appDef.srcRef)this.infoBroker.dispatchInfo(new InfoFocusItem(this.appDef.srcRef),this)}onInfo(info){if(this.initialized){if(info instanceof InfoCurrentItem){const shortDesc=info.shortDesc
const srcRef=shortDesc?SRC.srcRef(shortDesc):null
if(srcRef!=this.appDef.srcRef){const revertable=this.appDef.srcRef!=null
this.appDef.srcRef=srcRef
this.dispatchEvent(new CustomEvent("c-appdef-change",{bubbles:true,detail:{revertable:revertable}}))}this._refreshTitle(shortDesc?ITEM.getSrcMainName(this.reg,shortDesc,this.wsp.wspMetaUi):null)}}else{this.initializedAsync.then(()=>this.onInfo(info))}}buildLastDatas(parentLastDatas){LASTDATAS.buildLastDatas(parentLastDatas,this.workbench,true)}async fallbackOpenSrcRef(srcRef,longdesc,silent){if(longdesc.srcSt<0){OpenWspTrash.openTrashDialog(this.reg.env.uiRoot,{reg:this.reg,showMainView:true,selectLiveSrcUri:longdesc.srcLiveUri||longdesc.srcUri})
return true}return null}async initRegExtPoints(){const app=this
const reg=this.reg
const wsp=reg.env.wsp
reg.env.histoEditMgr=new HistoEditPointsMgr
function addShortDescAction(action,accelKey,sortKey){reg.addToList("actions:wsp:shortDesc",action.getId(),1,action,sortKey)
if(accelKey)reg.addToList("accelkeys:wsp:shortDesc",accelKey,1,action)}addShortDescAction(new FocusItemOrSpace,"F3")
addShortDescAction(ShortDescCopy.SINGLETON,"c-accel")
addShortDescAction(new RenameSrc,"F2")
addShortDescAction(new DeleteSrc)
addShortDescAction(new ExportScar)
addShortDescAction(new ShowNetItems,"e-accel-shift")
this.addWspActionsMain("actions:wspApp:main","actions:wspApp")
this.addGlobalAction("actions:wspApp:main",new WorkbenchTools,60)
this.addGlobalAction("actions:wspApp:main",new OpenWspDocApp,70,"F8")
this.addWspActionsConfig("actions:wspApp:config")
this.addWspActionsContent("actions:wspApp:content")
this.addWspActionsLayers("actions:wspApp:layers")
this.addGlobalAction("actions:wspApp:more",new OpenFastFindItem,10,"<-accel")
this.addGlobalAction("actions:wspApp:more",new OpenSearchItems,20,"f-accel+shift",true)
registerWspProtocolsActions(reg)
reg.addToList("wspApp:tools:lt","explorer",1,(new ExplorerArea).setHideItemFolderContent(true).setActionsLists(["actions:wspApp:explorer","actions:wsp:shortDesc"]).setAccelKeysLists(["accelkeys:wspApp:explorer","accelkeys:wsp:shortDesc"]),1)
reg.addToList("wspApp:tools:bl","gen",1,new GeneratorTabsArea,1)
reg.addToList("wspApp:tools:br","itemSearches",1,new SearchesArea("itemSearches","item").setActionsLists(["actions:wspApp:shortDesc:search:item","actions:wsp:shortDesc"]).setAccelKeysLists(["accelkeys:wspApp:shortDesc:search:item","accelkeys:wsp:shortDesc"]),2)
reg.registerSvc("searchStore.item",1,{async persistSearch(search){const view=await app.workbench.showView("itemSearches")
if(view)return view.persistSearch(search)}})
reg.registerSvc("searchStore.task",1,{async persistSearch(search){const view=await app.workbench.showView("taskSearches")
if(view)return view.persistSearch(search)}})
reg.addToList("wspApp:tools:rt","bookmarks",1,(new BookmarksArea).setActionsLists(["actions:wspApp:bookmarks","actions:wsp:shortDesc"]).setAccelKeysLists(["accelkeys:wspApp:bookmarks","accelkeys:wsp:shortDesc"]),1)
reg.addToList("wspApp:tools:lb","toc",1,new TocArea,1)
reg.addToList("wspApp:tools:lb","netItems",1,(new NetItemsArea).setConfsList(["netItems:confs"]).setActionsLists(["actions:wspApp:netItems","actions:wsp:shortDesc"]).setAccelKeysLists(["accelkeys:wspApp:netItems","accelkeys:wsp:shortDesc"]),1)
function addSpaceTreeAction(action,accel,sortKey){reg.addToList("actions:wspApp:explorer",action.getId(),1,action,sortKey)
if(accel)reg.addToList("accelkeys:wspApp:explorer",accel,1,action)}addSpaceTreeAction(new SpaceTreeFocusItem,"F3")
addSpaceTreeAction(new SpaceTreeCollapseAllAction)
const pasteCtrl=new SpaceTreePaste
addSpaceTreeAction(pasteCtrl,"v-accel")
addSpaceTreeAction(new SpaceTreePasteMove(pasteCtrl))
addSpaceTreeAction(new SpaceTreeCreateItem,"i-accel")
addSpaceTreeAction(new SpaceTreeCreateSpace)
addSpaceTreeAction(new SpaceTreeRename,"F2")
addSpaceTreeAction(new SpaceTreeMoveTo)
addSpaceTreeAction(new DeleteSrc,"Delete")
addSpaceTreeAction(new OpenSearchItems,"f-accel-shift")
addSpaceTreeAction(new SpaceTreeDuplicate)
addSpaceTreeAction(new SpaceTreeCopyTo)
addSpaceTreeAction((new SetPermsSpace).requireSrcVisiblePerm(["ui.apps.set.perms.space","admin.node.configRoles.byAdmin"]))
addSpaceTreeAction(ImportRes.SINGLETON())
addSpaceTreeAction(ImportFolder.SINGLETON())
addSpaceTreeAction(new ImportFiles)
addSpaceTreeAction(new ImportScar)
addSpaceTreeAction(ExportRes.SINGLETON())
addSpaceTreeAction(new ExportScwsp)
function addColTask(colDef,sortKey,registerCodefAsSvcCode){if(registerCodefAsSvcCode){reg.registerSvc(registerCodefAsSvcCode,1,colDef)
reg.addSvcToList("columns:wspApp:searches:task",colDef.id,1,registerCodefAsSvcCode,sortKey)}else{reg.addToList("columns:wspApp:searches:task",colDef.id,1,colDef,sortKey)}}function addColTaskExport(colDef,sortKey){reg.addToList("columns:wspApp:searches-export:task",colDef.getId(),1,colDef,sortKey)}function addCol(colDef,sortKey){reg.addToList("columns:wspApp:searches:item",colDef.id,1,colDef,sortKey)}function addColExport(colDef,sortKey){reg.addToList("columns:wspApp:searches-export:item",colDef.getId(),1,colDef,sortKey)}addCol(new GridColDef("srcCode").setLabel("Item").setSortable(true).setFlex("20%",1,1).setMinWidth("5em").setCellBuilder(new CellBuilderSrcIconCode(this.reg,this.wsp.wspMetaUi,true,this.wsp.srcUriItemsSortFn)),0)
addColExport(new SearchExportColumn("srcCode").setColDef(new SearchFuncUri2LeafName("srcUri")).setLabel("Code"),0)
addCol(new GridColDef("title").setMinWidth("3em").setLabel("Titre").setSortable(true).setFlex("30%",2,2).setCellBuilder(new CellBuilderString("itTi")),10)
addColExport(new SearchExportColumn("title").setColDef(new SearchFuncProps("itTi")).setLabel("Titre"),30)
addCol(new GridColDef("type").setMinWidth("3em").setLabel("Type d\'item").setSortable(true).setFlex("20%",2,2).setCellBuilder(new CellBuilderItModel(this.reg,this.wsp.wspMetaUi)),20)
addColExport(new SearchExportColumn("type").setColDef(new SearchFuncTranslateStr("itModel").setDict(()=>{const it=this.wsp.wspMetaUi.getItemTypes()
const dict={}
it.forEach(entry=>{if(!entry.isFamily(EItemTypeFamily.task))dict[entry.getModel()]=entry.getTitle()})
return dict})).setExportStatus(ESearchExportColumnStatus.exportable).setLabel("Type d\'item"))
addCol(new GridColDef("space").setLabel("Espace").setSortable(true).setFlex("25%",2,2).setMinWidth("2em").setCellBuilder(new CellBuilderSpace),20)
addColExport(new SearchExportColumn("space").setColDef(new SearchFuncUri2Space("srcUri")).setLabel("Espace"),20)
addCol(new GridColDef("dt").setLabel("Modif.").setDescription("Date de dernière modification").setSortable(true).setFlex("6em",1,1).setMinWidth("2em").setCellBuilder(new CellBuilderDate("srcDt")),30)
addColExport(new SearchExportColumn("dt").setColDef(new SearchFuncLong2Date("srcDt")).setLabel("Date modification").setDescription("Date de la dernière modification").setExportStatus(ESearchExportColumnStatus.exportable))
if(reg.env.universe.config.backEnd!=="fs"){addCol(new GridColDef("by").setLabel("Par").setSortable(true).setMinWidth("2em").setFlex("6em",1,1).setCellBuilder(new CellBuilderAccount(this.reg,"srcUser")),31)
addColExport(new SearchExportColumn("by").setColDef(new SearchFuncAccountProp("srcUser")).setLabel("Dernier contributeur").setExportStatus(ESearchExportColumnStatus.exportable))}const wspDefProps=wsp.wspDefProps
if(wspDefProps.drfRefWsp)(await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/areas/drfOverrides.js")).initDrfReg(reg)
if(this._lastWspMetaUi!==this.wsp.wspMetaUi)return
if(wspDefProps.drvAxis)(await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/areas/drvOverrides.js")).initDrvReg(reg)
if(this._lastWspMetaUi!==this.wsp.wspMetaUi)return
if(wsp.hasFeature("git")){const gitSt=wsp.infoWsp.srcFields.gitSt
if(gitSt!=null&&gitSt!==-1){(await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/areas/gitOverrides.js")).initGitReg(reg)
if(this._lastWspMetaUi!==this.wsp.wspMetaUi)return}}if(wsp.hasFeature("liveCycle")&&wsp.wspMetaUi.getLcTransitions()!==null){reg.addToList("ribbon:item","lc",1,RibbonLc,20)
const listTr=new((await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/lcTaskActions.js")).ItemListTransition)
if(this._lastWspMetaUi!==this.wsp.wspMetaUi)return
const lcName=this.wsp.wspMetaUi.getLcName()
addShortDescAction(listTr,null,-10)
addCol(new GridColDef("lc").setFlex("25%",2,2).setMinWidth("2em").setCellBuilder(new CellBuilderLc(this.wsp.wspMetaUi)).setLabel(lcName),15)
addColExport(new SearchExportColumn("lcSt").setColDef(new SearchFuncTranslateStr("lcSt").setDict(()=>{const map={}
const lcStates=this.wsp.wspMetaUi.getLcStates()
for(const st of lcStates.values()){map[st.code]=st.name}return map})).setLabel(lcName).setExportStatus(ESearchExportColumnStatus.exportable))
addColExport(new SearchExportColumn("lcDt").setColDef(new SearchFuncLong2Date("lcDt")).setLabel(`${lcName} - date d\'affectation`).setDescription(`${lcName} : date de la dernière modification`).setExportStatus(ESearchExportColumnStatus.exportable))
addColExport(new SearchExportColumn("lcBy").setColDef(new SearchFuncAccountProp("lcBy")).setLabel(`${lcName} - affecté par`).setExportStatus(ESearchExportColumnStatus.exportable))
const gridColLc=new GridColDef("lc").setFlex("1rem",0,0).setCellBuilder(new CellBuilderLcFlag(this.wsp.wspMetaUi).setIconClass("lcState")).setSkin("wsp-explorer/grid/lc").setLabel(lcName)
reg.addToList("columns:wspExplorer:secondaryCols","lc",1,gridColLc,5)
reg.addToList("columns:netItems:secondaryCols","lc",1,gridColLc,5)
reg.registerSkin("wsp-explorer/grid/lc",1,`\n\t\t  .lcState {\n\t\t\t  background-repeat: no-repeat;\n\t\t\t  background-position: center;\n\t\t\t  background-size: contain;\n\t\t\t  filter: var(--filter);\n\t\t  }\n\n\t\t  .lc {\n\t\t\t  border: none !important;\n\t\t  }\n\t\t\t`)}if(wsp.hasFeature("resp")&&wsp.wspMetaUi.hasResps){const listRespsItems=wsp.wspMetaUi.listResps("item")
if(listRespsItems){listRespsItems.forEach(entry=>{addCol(new GridColDef("resp."+entry.code).setLabel(entry.name).setDescription(entry.desc).setSortable(true).setMinWidth("4em").setFlex("2em",1,1).setCellBuilder(entry.userCard==="single"?new CellBuilderResp(entry.code,reg,"rspUsrs",false):new CellBuilderResps(entry.code,reg,"rspUsrs",false)),100)
addColExport(new SearchExportColumn("resp."+entry.code).setColDef(new SearchFuncAccountProp(new SearchFuncResponsibles(entry.code))).setLabel(entry.name).setExportStatus(ESearchExportColumnStatus.exportable))})}reg.addToList("ribbon:item","resp",1,RibbonResp,20)
const setResp=new((await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/itemActions.js")).ItemsSetResonsabilities)
if(this._lastWspMetaUi!==this.wsp.wspMetaUi)return
addSpaceTreeAction(setResp,null,-10)
reg.addToList("actions:item:burger",setResp.getId(),1,setResp,-10)
if(wsp.hasFeature("tasks")){const listRespsTasks=wsp.wspMetaUi.listResps("task")
if(listRespsTasks){listRespsTasks.forEach(entry=>{addColTask(new GridColDef(`resp.${entry.code}`).setLabel(entry.name).setDescription(entry.desc).setSortable(true).setMinWidth("4em").setFlex("2em",1,1).setCellBuilder(entry.userCard==="single"?new CellBuilderResp(entry.code,reg,"rspUsrs",false):new CellBuilderResps(entry.code,reg,"rspUsrs",false)),100,`wsp-columns-resp-${entry.code}`)
addColTaskExport(new SearchExportColumn("resp."+entry.code).setColDef(new SearchFuncAccountProp(new SearchFuncResponsibles(entry.code))).setLabel(entry.name).setExportStatus(ESearchExportColumnStatus.exportable))})}}}if(wsp.hasFeature("tasks")&&wsp.wspMetaUi.hasTasks){await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/taskActions.js")
if(this._lastWspMetaUi!==this.wsp.wspMetaUi)return
const tasksIt=wsp.wspMetaUi.getItemTypes().filter(entry=>entry.isFamily(EItemTypeFamily.task))
reg.addToList("wspApp:tools:rb","tasks",1,new TasksArea,1)
reg.addToList("ribbon:item","tasks",1,RibbonTasks,30)
reg.addToList("wspApp:tools:br","taskSearches",1,new SearchesArea("taskSearches","task").setActionsLists(["actions:wspApp:shortDesc:search:task","actions:wsp:shortDesc:task"]).setAccelKeysLists(["accelkeys:wspApp:shortDesc:search:task","accelkeys:wsp:shortDesc:task"]),1)
addColTask(new GridColDef("itTi").setLabel("Libellé").setSortable(true).setFlex("6em",1,1).setMinWidth("3em").setCellBuilder(new CellBuilderString("itTi").override("fillSearchColumns",map=>{map.set("itTi",null)
map.set("actStage",null)})),30)
addColTaskExport(new SearchExportColumn("title").setColDef(new SearchFuncProps("itTi")).setLabel("Libellé"),30)
if(tasksIt.find(entry=>entry.hasFeature(ETaskFeatures.deadline))){addColTask(new GridColDef("deadline").setLabel("Date limite").setSortable(true).setFlex("2em",1,1).setMinWidth("2em").setCellBuilder(new CellBuilderTkDeadline),30)
addColTaskExport(new SearchExportColumn("deadline").setColDef(new SearchFuncLong2Date("tkDeadline").setFormat(ELong2DateStyles.short,null)).setLabel("Date limite"),100)}if(tasksIt.find(entry=>entry.hasFeature(ETaskFeatures.scheduling))){addColTask(new GridColDef("scheduling").setLabel("Planification").setDescription("Date de planification").setSortable(true).setFlex("2em",1,1).setMinWidth("2em").setCellBuilder(new CellBuilderTkScheduledD),40)
addColTaskExport(new SearchExportColumn("scheduling").setColDef(new SearchFuncLong2Date("tkScheduledDt").setFormat(ELong2DateStyles.short,null)).setLabel("Planification"),100)}addColTask(new GridColDef("completedDt").setLabel("Date de clôture").setSortable(true).setFlex("2em",1,1).setMinWidth("2em").setCellBuilder(new CellBuilderDate("tkCompletedDt")),200)
addColTaskExport(new SearchExportColumn("completedDt").setColDef(new SearchFuncLong2Date("tkCompletedDt").setFormat(ELong2DateStyles.short,null)).setLabel("Date de clôture"),110)
addColTask(new GridColDef("dt").setLabel("Modif.").setDescription("Date de dernière modification").setSortable(true).setFlex("6em",1,1).setMinWidth("2em").setCellBuilder(new CellBuilderDate("srcDt")),300)
addColTaskExport(new SearchExportColumn("dt").setColDef(new SearchFuncLong2Date("srcDt")).setLabel("Date modification").setDescription("Date de la dernière modification").setExportStatus(ESearchExportColumnStatus.exportable))
addColTask(new GridColDef("type").setLabel("").setMinWidth("1.5em").setMaxWidth("1.5em").setSortable(true).setCellBuilder(new CellBuilderItModelFlagIcon(this.reg,this.wsp.wspMetaUi)),0)
addColTaskExport(new SearchExportColumn("type").setColDef(new SearchFuncTranslateStr("itModel").setDict(()=>{const dict={}
tasksIt.forEach(entry=>dict[entry.getModel()]=entry.getTitle())
return dict})).setExportStatus(ESearchExportColumnStatus.exportable).setLabel("Type"))
if(tasksIt.find(entry=>{var _a
return(_a=entry.getLcStates())===null||_a===void 0?void 0:_a.size})){const lcName=LC_DEFAULT_NAME
addColTask(new GridColDef("lcSt").setFlex("3em",2,2).setCellBuilder(new CellBuilderLc(this.wsp.wspMetaUi)).setLabel(lcName),50)
const lcStates=new Map
tasksIt.forEach(entry=>{if(entry.getLcName()){const states=entry.getLcStates()
states===null||states===void 0?void 0:states.forEach(entry=>lcStates.set(entry.code,entry.name))}})
addColTaskExport(new SearchExportColumn("lcSt-unified").setColDef(new SearchFuncTranslateStr("lcSt").setDict(()=>{const map={}
lcStates.forEach((value,key)=>map[key]=value)
return map})).setLabel(lcName).setExportStatus(ESearchExportColumnStatus.exportable))
addColTaskExport(new SearchExportColumn("lcDt").setColDef(new SearchFuncLong2Date("lcDt")).setLabel(`${lcName} - date d\'affectation`).setDescription(`${lcName} : date de la dernière modification`).setExportStatus(ESearchExportColumnStatus.exportable))
addColTaskExport(new SearchExportColumn("lcBy").setColDef(new SearchFuncAccountProp("lcBy")).setLabel(`${lcName} - affecté par`).setExportStatus(ESearchExportColumnStatus.exportable))}function addShortDescTaskAction(action,accelKey){if(typeof action==="object"){reg.addToList("actions:wsp:shortDesc:task",action.getId(),1,action)
if(accelKey)reg.addToList("accelkeys:wsp:shortDesc:task",accelKey,1,action)}else{reg.addSvcToList("actions:wsp:shortDesc:task",action,1,action)
if(accelKey)reg.addSvcToList("accelkeys:wsp:shortDesc:task",accelKey,1,action)}}addShortDescTaskAction("tasks/focusTaskAction")
addShortDescTaskAction(ShortDescCopy.SINGLETON,"c-accel")
addShortDescTaskAction("tasks/deleteTaskAction","Delete")}}}REG.reg.registerSkin("wsp-app",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tpadding-top: 2px;\n\t}\n\n\theader {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tmax-height: 5em;\n\t\toverflow: hidden;\n\t\talign-items: center;\n\t\tjustify-content: center;\n\t\tuser-select: none;\n\t}\n\n\timg {\n\t\theight: 1.3em;\n\t}\n\n\th1 {\n\t\tmargin: .1em .5em;\n\t\tfont-size: 1em;\n\t\tletter-spacing: 0.1em;\n\t\ttext-align: center;\n\t}\n\n\thr {\n\t\tdisplay: none;\n\t}\n\n\tmain {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tflex-direction: column;\n\t}\n`)
REG.reg.registerSkin("wsp-app/c-workbench",1,``)
customElements.define("wsp-app",WspApp)
class WorkbenchTools extends ActionMenu{constructor(){super("tools")
this._label="Volets"
this._description="Affichage des volets latéraux"}getActions(ctx){if(!this._actions){this._actions=ctx.workbench.getAreaTools().map(a=>new ShowTool(a))
this._actions.push(new ActionSeparator)
this._actions.push(new ShowFlapTabs)}return this._actions}}class ShowTool extends ActionSignboardWrapper{constructor(toolArea){super(toolArea.getId())
this._wrapped=toolArea}isToggle(ctx){return true}getDatas(api,ctx){var _a
return((_a=ctx.workbench.getTab(this._wrapped.getId()))===null||_a===void 0?void 0:_a.selected)||false}execute(ctx,ev){ctx.workbench.toggleAreaTool(this._wrapped.getId())}}class ShowFlapTabs extends Action{constructor(){super("showFlapTabs")
this._label="Afficher les onglets"}isToggle(ctx){return true}getDatas(api,ctx){return!ctx.workbench.classList.contains("hideFlapTabs")}execute(ctx,ev){const showFlapTabs=!ctx.workbench.classList.toggle("hideFlapTabs")
const persistUS=ctx.reg.getPersistUserStates()
if(persistUS)persistUS.setUserDatas({showFlapTabs:showFlapTabs})}}class OpenWspDocApp extends Action{constructor(){super("openWspDoc")
this._label="Mode plan"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/toc/toc.svg"
this._group="other"
this._visPerms="ui.wspDocApp"}isVisible(ctx){if(!ctx.reg.getPref("wspDocApp.enabled",false))return false
return super.isVisible(ctx)}execute(ctx,ev){const curr=new InfoReqCurrentItem
ctx.infoBroker.dispatchInfo(curr,ctx)
if(curr.shortDesc&&ctx.reg.env.wsp.wspMetaUi.getItemType(curr.shortDesc.itModel).datas.asDoc){desk.findAndOpenApp({u:ctx.universe.getId(),wspDoc:ctx.wsp.code,doc:SRC.srcRef(curr.shortDesc)},ev)}else{desk.findAndOpenApp({u:ctx.universe.getId(),wspDoc:ctx.wsp.code},ev)}}}
//# sourceMappingURL=wspApp.js.map