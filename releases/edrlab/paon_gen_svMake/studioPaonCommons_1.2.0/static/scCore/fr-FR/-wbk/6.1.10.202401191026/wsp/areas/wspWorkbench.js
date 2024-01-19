import{AccelKeyMgr,ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{Area,AreaAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{render}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/htmlLit.js"
import{MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
export class ExplorerArea extends AreaAsync{constructor(){super("explorer")
this._label="Explorateur"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/spaceTree/treeTabf.svg"
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/spaceTree.js"))}setActionsLists(actionsLists){this.actionsLists=actionsLists
return this}setAccelKeysLists(accelKeysLists){this.accelKeysLists=accelKeysLists
return this}setDefaultAction(defaultAction){this.defaultAction=defaultAction
return this}setHideItemFolderContent(hide){this.hideItemFolderContent=hide
return this}buildBody(ctx,lastDatas){const reg=ctx.reg
const infoBroker=reg.env.infoBroker
const mod=this._modules[0]
const init={area:this,areaContext:ctx,reg:reg,uriRoot:this.uriRoot,showRoot:this.showRoot,hideItemFolderContent:this.hideItemFolderContent,secondaryCols:reg.getList("columns:wspExplorer:secondaryCols"),showTitle:reg.getUserData("wsp.explorer.showTitle",true),itemHandlingReact:infoBroker,actions:this.actionsLists?reg.mergeLists(...this.actionsLists):null,defaultAction:this.defaultAction!==undefined?this.defaultAction:infoBroker?new this.srcActions.FocusItem:null,accelKeyMgr:this.accelKeysLists?(new AccelKeyMgr).initFromMapActions(reg.mergeListsAsMap(...this.accelKeysLists)):null,emptyTree:spaceTree=>JSX.createElement("div",{style:"font-style:normal"},JSX.createElement("c-msg",{label:"Aucun contenu",level:"info"}),JSX.createElement("c-action",{"î":{action:new mod.SpaceTreeCreateItem,actionContext:spaceTree,uiContext:"dialog",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/createItem.svg"}}),JSX.createElement("c-action",{"î":{action:new mod.SpaceTreeCreateSpace,actionContext:spaceTree,uiContext:"dialog",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/createSpace.svg"}}))}
return JSX.createElement("wsp-space-tree",{"î":init})}async loadLibs(ctx){this.srcActions=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js")
return super.loadLibs(ctx)}}export class GeneratorTabsArea extends AreaAsync{constructor(){super("generators")
this._label="Publications"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/generators/generators.svg"
this._lastDatasKey="gen"
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/generators.js"))}buildBody(ctx,lastDatas){return JSX.createElement("wsp-generator-tabs",{"î":this.initLastDatas(ctx,lastDatas,{area:this,areaContext:ctx,reg:ctx.reg})})}}export class SearchesArea extends AreaAsync{constructor(id,kind){super(id)
this.kind=kind
this._label=kind==="item"?"Items":"Tâches"
this._description=kind==="item"?"Recherche d\'items":"Recherche de tâches"
this._icon=kind==="item"?"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/searches/searches.svg":"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/searches/searches-tasks.svg"
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/searches.js"))}get forbidInLayout(){return"v"}setActionsLists(actionsLists){this.actionsLists=actionsLists
return this}setAccelKeysLists(accelKeysLists){this.accelKeysLists=accelKeysLists
return this}buildBody(ctx,lastDatas){const infoBroker=ctx.reg.env.infoBroker
if(this.kind==="item"){ctx.reg.addToList("actions:wspApp:searches:bar:end:item","actionsSearchPersistLists",1,this.searchesActions.TplRequestsMenu.makeFromSearchPersistLists(ctx,"requests:item","requests:wspApp:item","requests:searches:item"))
ctx.reg.addToList("actions:wspApp:searches:bar:end:item","actionOpenSearchItems",1,new this.srcActions.OpenSearchItems("item").setGroup("noctx"))}else{ctx.reg.addToList("actions:wspApp:searches:bar:end:task","actionsSearchPersistLists",1,this.searchesActions.TplRequestsMenu.makeFromSearchPersistLists(ctx,"requests:task","requests:wspApp:task","requests:searches:task"))
ctx.reg.addToList("actions:wspApp:searches:bar:end:task","actionOpenSearchItems",1,new this.srcActions.OpenSearchItems("task").setGroup("noctx"))}return JSX.createElement("wsp-searches",{"î":{area:this,areaContext:ctx,reg:ctx.reg,kind:this.kind,privateUri:this.kind==="item"?"/itemSearches.json":"/taskSearches.json",criterions:ctx.reg.getListAsMap(this.kind==="item"?"wsp.crit.items":"wsp.crit.tasks"),barActionsInit:{actions:ctx.reg.getList(this.kind==="item"?"actions:wspApp:searches:bar:end:item":"actions:wspApp:searches:bar:end:task"),groupOrder:"* lib noctx"},results:{srcGrid:{columnDefs:ctx.reg.getList(this.kind==="item"?"columns:wspApp:searches:item":"columns:wspApp:searches:task"),itemHandlingReact:infoBroker,actions:this.actionsLists?ctx.reg.mergeLists(...this.actionsLists):null,defaultAction:this.defaultAction!==undefined?this.defaultAction:infoBroker?this.kind==="item"?new this.searches.FocusItemSetWedSearch:new this.taskActions.FocusTask:null,accelKeyMgr:this.accelKeysLists?(new AccelKeyMgr).initFromMapActions(ctx.reg.mergeListsAsMap(...this.accelKeysLists)):null,draggable:true,lineDrawer:{redrawLine:(row,line)=>{if(this.kind==="task"){const dt=row.rowDatas.tkDeadline
line.classList.toggle("late",dt>0&&dt<Date.now())
line.classList.toggle("completed",row.rowDatas.actStage==="completed")}}},skinOver:"wsp-search-result/grid"},barActions:ACTION.injectSepByGroup(ctx.reg.mergeLists(this.kind==="item"?"actions:wspApp:searches:item":"actions:wspApp:searches:task","actions:wspApp:searches"),"* burger",ctx),msgs:this.kind==="item"?undefined:{resultsMore:max=>`Plus de ${max} tâches trouvées`,resultsEmpty:"Aucune tâche trouvée",resultsOne:"1 tâche trouvée",resultsCount:count=>`${count} tâches trouvées`}}}})}async loadLibs(ctx){this.searches=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/searches.js")
this.srcActions=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js")
this.searchesActions=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/searchesActions.js")
if(this.kind==="task")this.taskActions=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/taskActions.js")
return super.loadLibs(ctx)}}REG.reg.registerSkin("wsp-search-result/grid",1,`\n\n\t.late {\n\t\tcolor: var(--error-color);\n\t}\n\n\t.completed {\n\t\ttext-decoration-line: line-through;\n\t}\n`)
class AreaWithActions extends AreaAsync{setActionsLists(actionsLists){this.actionsLists=actionsLists
return this}setAccelKeysLists(accelKeysLists){this.accelKeysLists=accelKeysLists
return this}setDefaultAction(defaultAction){this.defaultAction=defaultAction
return this}}export class BookmarksArea extends AreaWithActions{constructor(){super("bookmarks")
this._label="Favoris"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/bookmarks/bookmarks.svg"
this._lastDatasKey="bk"
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/bookmarks.js"))}buildBody(ctx,lastDatas){const reg=ctx.reg
const infoBroker=ctx.reg.env.infoBroker
return JSX.createElement("wsp-bookmarks",{"î":this.initLastDatas(ctx,lastDatas,{reg:reg,area:this,areaContext:ctx,itemHandlingReact:infoBroker,secondaryCols:reg.getSvc("wsp-bookmarks/secondaryCols"),actions:this.actionsLists?ctx.reg.mergeLists(...this.actionsLists):null,defaultAction:this.defaultAction!==undefined?this.defaultAction:infoBroker?new this.srcActions.FocusItemOrSpace:null,accelKeyMgr:this.accelKeysLists?(new AccelKeyMgr).initFromMapActions(ctx.reg.mergeListsAsMap(...this.accelKeysLists)):null})})}async loadLibs(ctx){this.srcActions=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js")
return super.loadLibs(ctx)}}export class TocArea extends AreaAsync{constructor(id){super(id||"toc")
this._label="Plan"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/toc/tocTabf.svg"
this._lastDatasKey="toc"
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/toc.js"))}buildBody(ctx,lastDatas){const infoBroker=ctx.reg.env.infoBroker
return JSX.createElement("wsp-toc",{"î":this.initLastDatas(ctx,lastDatas,{reg:ctx.reg,area:this,areaContext:ctx,infoBroker:infoBroker})})}}export class NetItemsArea extends AreaWithActions{constructor(id){super(id||"netItems")
this._label="Réseau"
this._description="Réseau d\'items"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/netItems/netItemsTabf.svg"
this._lastDatasKey="netItems"
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/netItems.js"))}setConfsList(list){this.confsList=list
return this}buildBody(ctx,lastDatas){const infoBroker=ctx.reg.env.infoBroker
return JSX.createElement("wsp-net-items",{"î":this.initLastDatas(ctx,lastDatas,{reg:ctx.reg,area:this,areaContext:ctx,confs:this.confsList?ctx.reg.mergeLists(...this.confsList):null,infoBroker:infoBroker,itemHandlingReact:infoBroker,secondaryCols:ctx.reg.getList("columns:netItems:secondaryCols"),actions:this.actionsLists?ctx.reg.mergeLists(...this.actionsLists):null,defaultAction:this.defaultAction!==undefined?this.defaultAction:infoBroker?new this.srcActions.FocusItemOrSpace:null,accelKeyMgr:this.accelKeysLists?(new AccelKeyMgr).initFromMapActions(ctx.reg.mergeListsAsMap(...this.accelKeysLists)):null})})}async loadLibs(ctx){this.srcActions=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js")
return super.loadLibs(ctx)}}export class TasksArea extends AreaAsync{constructor(){super("myTasks")
this._label="Mes tâches"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/tasks/tasksTabf.svg"
this._lastDatasKey="myTasks"
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/tasks.js"))}buildBody(ctx,lastDatas){const infoBroker=ctx.reg.env.infoBroker
return JSX.createElement("wsp-tasks",{"î":this.initLastDatas(ctx,lastDatas,{reg:ctx.reg,area:this,areaContext:ctx,infoBroker:infoBroker})})}}export class ForeignWspArea extends AreaAsync{constructor(id,wspCode,template){super(id)
this.wspCode=wspCode
this.template=template
this._lastDatasKey=id}needAsync(ctx){return true}async loadBody(ctx,lastDatas){const infoBroker=ctx.reg.env.infoBroker
const wsp=ctx.reg.env.universe.wspServer.wspsLive.findWsp(this.wspCode,true).listenChanges()
const msg=JSX.createElement(MsgLabel,{"î":{label:"Chargement en cours..."}})
const root=JSX.createElement("div",{style:"display:contents"},msg)
try{wsp.waitForAvailable().then(async wsp=>{render(await this.template(wsp,ctx),root,{})}).catch(e=>{console.log(e)
return msg.setCustomMsg("L\'atelier demandé n\'existe pas ou est inaccessible.","error")})
return root}catch(e){console.log(e)
return msg.setCustomMsg("L\'atelier demandé n\'existe pas ou est inaccessible.","error")}}}export class NavigatorArea extends AreaAsync{constructor(id){super(id)
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/navigator.js"))}setActionsLists(actionsLists){this.actionsLists=actionsLists
return this}setAccelKeysLists(accelKeysLists){this.accelKeysLists=accelKeysLists
return this}setDefaultAction(defaultAction){this.defaultAction=defaultAction
return this}setEmptyTree(emptyTree){this.emptyTree=emptyTree
return this}setBuildFacets(buildFacets){this.buildFacets=buildFacets
return this}setBuildFacetsStandard(facets){this.buildFacetsStandard=facets
return this}buildBody(ctx,lastDatas){const reg=ctx.reg
const infoBroker=reg.env.infoBroker
const mod=this._modules[0]
const init={area:this,areaContext:ctx,reg:reg,emptyTree:this.emptyTree,buildFacets:this.buildFacets||mod[this.buildFacetsStandard],secondaryCols:reg.getList("columns:wspExplorer:secondaryCols"),itemHandlingReact:infoBroker,actions:this.actionsLists?reg.mergeLists(...this.actionsLists):null,defaultAction:this.defaultAction!==undefined?this.defaultAction:infoBroker?new this.srcActions.FocusItem:null,accelKeyMgr:this.accelKeysLists?(new AccelKeyMgr).initFromMapActions(reg.mergeListsAsMap(...this.accelKeysLists)):null,lastDatas:lastDatas}
return JSX.createElement("wsp-navigator",{"î":init})}async loadLibs(ctx){this.srcActions=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js")
return super.loadLibs(ctx)}}export class ForeignDepotArea extends Area{constructor(id,frontJsModule,authReg,depotReg){super(id)
this.frontJsModule=frontJsModule
this.authReg=authReg
this.depotReg=depotReg
this._label="Dépot"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/depot/depot.svg"}buildBody(ctx,lastDatas){const root=JSX.createElement("div",{style:"flex:1; display:flex; min-width:0; min-height:0"},JSX.createElement("c-msg",{"î":{standardMsg:"loading"}}))
const embeddedDepot=this.frontJsModule.importJs()
embeddedDepot.then(m=>m.initEmbeddedApp({authReg:this.authReg,depotReg:this.depotReg,parentNode:root})).catch(e=>{const msg=root.firstElementChild
msg.setStandardMsg("netError")
throw e})
return root}}
//# sourceMappingURL=wspWorkbench.js.map