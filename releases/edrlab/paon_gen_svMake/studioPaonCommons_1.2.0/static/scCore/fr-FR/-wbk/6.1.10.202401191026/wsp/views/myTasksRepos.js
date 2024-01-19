import{BaseAreaViewAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{WSPMETA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{Tabs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tabs.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{Grid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{CellBuilderSrcIconCode}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcGridColumns.js"
import{CellBuilderString,GridDataHolderJsonArray}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{EInvolvement,TASK}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/lcTask.js"
export class MyTasksRepos extends BaseAreaViewAsync{async _initialize(init){super._initialize(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
const emptyBody=()=>{switch(this.fetchState){case"done":return JSX.createElement("c-msg",null,"Aucune tâche")
case"failed":return JSX.createElement("c-msg",{level:"error"},"Échec au chargement")
default:return JSX.createElement("c-msg",null,"Chargement en cours...")}}
this.tabs=JSX.createElement(Tabs,{id:"tabs","skin-over":"wsp-mytasks/tabs"})
const columnDefs=[new GridColDef("srcCode").setLabel("Libellé").setDefaultSort(1,"ascendant").setFlex("25em",1,1).setMinWidth("8em").setSortable(true).setCellBuilder(new CellBuilderReposTk(this.reg)),new GridColDef("wspTi").setLabel("Atelier").setFlex("10em",1,1).setMinWidth("8em").setSortable(true).setCellBuilder(new CellBuilderString("wspTi"))]
this.pendingTodo=this.tabs.appendChild(JSX.createElement(Grid,{code:"pendingTodo",label:"À faire","î":{reg:this.reg,columnDefs:columnDefs,dataHolder:new GridDataHolderJsonArray,defaultAction:OpenTaskApp.SINGELTON,selType:"monoOver",skinScroll:"scroll/small",emptyBody:emptyBody}}))
this.pendingTofollow=this.tabs.appendChild(JSX.createElement(Grid,{code:"pendingTofollow",label:"À suivre","î":{reg:this.reg,columnDefs:columnDefs,dataHolder:new GridDataHolderJsonArray,defaultAction:OpenTaskApp.SINGELTON,selType:"monoOver",skinScroll:"scroll/small",emptyBody:emptyBody}}))
sr.appendChild(this.tabs)
return this.fetchPendings()}async fetchPendings(){try{const datas=await this.reg.env.universe.wspServer.config.tasksUrl.fetchJson(IO.qs("cdaction","GetMyTasksAtRepos","fields",reposTaskFields))
this.wspMap=new Map
const wspMeatsCache=new WSPMETA.WspMetasCache(this.reg.env.universe.wspServer)
for(const w of datas.wsps)wspMeatsCache.fetchWspMetaUi(w.wspMeta=wspMeatsCache.atomWspTypeInst(w.wspMeta))
await wspMeatsCache.waitForAll()
for(const w of datas.wsps){w.wspMetaUi=wspMeatsCache.getWspMetaUi(w.wspMeta)
this.wspMap.set(w.wspCd,w)}const toDoTk=[]
const toFollowTk=[]
const userFlatGroups=await this.reg.env.universe.auth.fetchFlattenedGroups()
for(const w of datas.tasks){const wspCd=extractWspCdFromReposUri(w.srcUri)
const wspInfo=this.wspMap.get(wspCd)
if(wspInfo){const taskData={srcUri:extractSrcUriFromReposUri(w.srcUri),actTi:w.actTi,itModel:extractTaskModelFromReposUri(w.srcUri),wspMetaUi:wspInfo.wspMetaUi,wspTi:wspInfo.title,wspCd:wspCd,tkDeadline:w.tkDeadline}
w.itModel=extractTaskModelFromReposUri(w.srcUri)
const inv=TASK.getInvolvementForAccounts(userFlatGroups,w,wspInfo.wspMetaUi)
if((inv&EInvolvement.executor)!=0){toDoTk.push(taskData)}if((inv&EInvolvement.follower)!=0){toFollowTk.push(taskData)}}else{}}this.fetchState="done"
this.pendingTodo.dataHolder.setDatas(toDoTk)
this.pendingTofollow.dataHolder.setDatas(toFollowTk)}catch(e){this.fetchState="failed"
this.pendingTodo.dataHolder.setDatas([])
this.pendingTofollow.dataHolder.setDatas([])
throw e}}}REG.reg.registerSkin("wsp-mytasks-repos",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\twidth: 35em;\n\t}\n\n\t#tabs {\n\t\tflex: 1;\n\t}\n\n\tc-grid {\n\t\tborder: none;\n\t}\n`)
customElements.define("wsp-mytasks-repos",MyTasksRepos)
const reposTaskFields=["srcUri","actTi","tkDeadline","rspUsrs","lcSt"].join("*")
class CellBuilderReposTk extends CellBuilderSrcIconCode{constructor(reg){super(reg,null,true,SRC.sortSrcUriTree)}_getValue(row){return row.cacheHolder["code"]||(row.cacheHolder["code"]=this.srcRdr.getMainName(row.rowDatas,row.rowDatas.wspMetaUi))}_getIcon(row){return row.cacheHolder["icon"]||(row.cacheHolder["icon"]=this.srcRdr.getIcon(row.rowDatas,row.rowDatas.wspMetaUi))}_getDescription(row){return this.srcRdr.getSecondName(row.rowDatas,row.rowDatas.wspMetaUi)}}class OpenTaskApp extends Action{execute(ctx,ev){const row=ctx.getSelectedRow()
if(row>=0){const rowDatas=ctx.dataHolder.getRow(row).rowKey
desk.findAndOpenApp({task:extractTaskIdFromSrcUri(rowDatas.srcUri),w:rowDatas.wspCd},ev)
POPUP.findPopupableParent(ctx).close()}}}OpenTaskApp.SINGELTON=new OpenTaskApp
function extractWspCdFromReposUri(reposUri){return reposUri.substring(1,reposUri.indexOf("/",1))}function extractSrcUriFromReposUri(reposUri){return reposUri.substring(reposUri.indexOf("/",1))}function extractTaskModelFromReposUri(reposUri){return"stk_"+reposUri.substring(reposUri.lastIndexOf("/")+1,reposUri.lastIndexOf("."))}function extractTaskIdFromSrcUri(srcUri){if(!srcUri||!srcUri.startsWith(ITEM.ANNOT_PREFIX))return null
return SRC.ID_PREFIX+srcUri.substring(ITEM.ANNOT_PREFIX.length,srcUri.indexOf("/",ITEM.ANNOT_PREFIX.length+1))}
//# sourceMappingURL=myTasksRepos.js.map