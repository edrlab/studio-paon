import{MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{AccelKeyMgr,Action,ACTION,ActionMenu,ActionWrapper}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{CellBuilderDate,CellBuilderEnum,CellBuilderIconLabel,CellBuilderString}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{BaseAreaViewAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/dialogs_Perms.js"
import{EJobStatus,EXECUTOR,UiJobFactory}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/executor.js"
import{JobsGrid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/jobsGrid.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{BarShared}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{CellBuilderAccount}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/usersGrid.js"
import{Tabs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tabs.js"
import{AreaAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{ActionDeleteJobs,ActionForceExecuteJobs,ActionMoveInQueueJobs,JobsAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/actions/jobsActions.js"
var EJobTabStatus;(function(EJobTabStatus){EJobTabStatus["alive"]="alive"
EJobTabStatus["planned"]="planned"
EJobTabStatus["failed"]="failed"
EJobTabStatus["done"]="done"})(EJobTabStatus||(EJobTabStatus={}))
export class JobsMgr extends BaseAreaViewAsync{constructor(){super(...arguments)
this._fetchingCountersPending=false
this._fetchingTabJobsPending=false}get frozenStatus(){return this.hasAttribute("data-frozen")}set frozenStatus(val){DOM.setAttrBool(this,"data-frozen",val)}async _initialize(init){if(!this.reg)this.reg=REG.createSubReg(this.findReg(init))
this.params=Object.assign({jobsFactoriesList:[EXECUTOR.JOBS_FACTORIES_LIST]},init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
const uiJobsFactoriesFcts=this.reg.mergeLists(...this.params.jobsFactoriesList)
const uiJobsFactoriesPromises=uiJobsFactoriesFcts?uiJobsFactoriesFcts.map(entry=>typeof entry==="function"?entry.call(this):entry):null
this.uiJobsFactories=await Promise.all(uiJobsFactoriesPromises||[])
this.reg.addToList("actions:jobsmgr:toolbar","actionFreezeExecutor",1,new FreezeExecutorBtn)
this.reg.addToList("actions:jobsmgr:toolbar","actionRefreshUi",1,actionRefreshUi)
this.reg.addToList("actions:jobsmgr:toolbar","actionNewJob",1,ActionNewJobs.SINGLETON)
this.reg.addToList("actions:jobsmgr","actionDuplicateJob",1,new ActionWrapperRefresMgr(this).setOverridenSvc(new ActionWrapperCreateJob(this).setOverridenSvc(new ActionDuplicateJob(this))))
this.reg.addToList("actions:jobsmgr","actionDeleteJobs",1,new ActionWrapperRefresMgr(this).setOverridenSvc(ActionDeleteJobs.SINGLETON))
this.reg.addToList("actions:jobsmgr","actionForceExecuteJobs",1,new ActionWrapperRefresMgr(this).setOverridenSvc(ActionForceExecuteJobs.SINGLETON))
this.reg.addToList("actions:jobsmgr","actionMoveInQueueJobs",1,new ActionWrapperRefresMgr(this).setOverridenSvc(ActionMoveInQueueJobs.SINGLETON))
this._headband=sr.appendChild(JSX.createElement(MsgLabel,{class:"headband","î":{label:"Exécution des traitements gelée",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/actions/jobs/frozen.svg",level:"warning"}}))
let jbBoxElt=sr.appendChild(JSX.createElement("div",{class:"jobsBox"}))
const col_id=new GridColDef("id").setLabel("Id.").setDescription("Identifiant").setSortable(false).setCellBuilder(new CellBuilderString("id"))
const col_name=new GridColDef("name").setLabel("Label").setFlex("6rem",1,1).setCellBuilder(new CellBuilderJobLabel(this))
const col_lastQueued=new GridColDef("lastQueued").setLabel("Exécution").setDescription("Date d\'exécution").setFlex("8rem",1,1).setCellBuilder(new CellBuilderDate("lastQueued").setCellClass("center").setOptions({year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}))
const col_planned=new GridColDef("planned").setLabel("Planification").setDescription("Date planifiée").setFlex("8rem",1,1).setCellBuilder(new CellBuilderDate("planned").setCellClass("center").setOptions({year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}))
const col_createdBy=new GridColDef("createdBy").setLabel("Créateur").setDescription("Compte ayant créé ce traitement").setFlex("3rem",1,1).setCellBuilder(new CellBuilderAccount(this.reg,"createdBy",true))
const col_status=new GridColDef("lastStatus").setLabel("Statut").setFlex("2rem",1,1).setCellBuilder(new CellBuilderEnum("lastStatus",new Map([[EJobStatus.waiting,"En attente"],[EJobStatus.launched,"Chargé"],[EJobStatus.pending,"En cours d\'exécution"],[EJobStatus.done,"Terminé"],[EJobStatus.failed,"En échec"],[EJobStatus.planned,"Planifié"]])).setCellClass("center"))
let areas=[]
areas.push(new AreaAsync(EJobTabStatus.alive).setLabel("En cours").setDescription("Traitements en cours").setBodyBuilder(ctx=>JSX.createElement(JobsGridView,{id:EJobTabStatus.alive,"î":Object.assign({columnDefs:[col_id,col_name,col_lastQueued,col_createdBy,col_status],reg:this.reg,emptyBody:this.emptyBody,skinOver:"jobs-mgr/grid",actions:this.reg.mergeLists("actions:jobsmgr","actions:jobsmgr:alive"),accelKeyMgr:(new AccelKeyMgr).initFromMapActions(this.reg.mergeListsAsMap("accelkeys:jobsmgr","accelkeys:jobsmgr:alive")),selectAction:new DisplayJobDetails(this),lineDrawer:this},init.jobsGrids)})))
if(this.reg.env.universe.executor.hasFeature("scheduling"))areas.push(new AreaAsync(EJobTabStatus.planned).setLabel("Planifiés").setDescription("Traitements planifiés").setBodyBuilder(ctx=>JSX.createElement(JobsGridView,{id:EJobTabStatus.planned,"î":Object.assign({columnDefs:[col_id,col_name,col_planned,col_createdBy],reg:this.reg,emptyBody:this.emptyBody,skinOver:"jobs-mgr/grid",actions:this.reg.mergeLists("actions:jobsmgr","actions:jobsmgr:planned"),accelKeyMgr:(new AccelKeyMgr).initFromMapActions(this.reg.mergeListsAsMap("accelkeys:jobsmgr","accelkeys:jobsmgr:planned")),selectAction:new DisplayJobDetails(this),lineDrawer:this},init.jobsGrids)})))
areas.push(new AreaAsync(EJobTabStatus.failed).setLabel("En échec").setDescription("Traitements en échec").setBodyBuilder(ctx=>JSX.createElement(JobsGridView,{id:EJobTabStatus.failed,"î":Object.assign({columnDefs:[col_id,col_name,col_lastQueued,col_createdBy],reg:this.reg,emptyBody:this.emptyBody,skinOver:"jobs-mgr/grid",actions:this.reg.mergeLists("actions:jobsmgr","actions:jobsmgr:failed"),accelKeyMgr:(new AccelKeyMgr).initFromMapActions(this.reg.mergeListsAsMap("accelkeys:jobsmgr","accelkeys:jobsmgr:failed")),selectAction:new DisplayJobDetails(this),lineDrawer:this},init.jobsGrids)})))
areas.push(new AreaAsync(EJobTabStatus.done).setLabel("Terminés").setDescription("Traitements terminés").setBodyBuilder(ctx=>JSX.createElement(JobsGridView,{id:EJobTabStatus.done,"î":Object.assign({columnDefs:[col_id,col_name,col_lastQueued,col_createdBy],reg:this.reg,emptyBody:this.emptyBody,skinOver:"jobs-mgr/grid",actions:this.reg.mergeLists("actions:jobsmgr","actions:jobsmgr:done"),accelKeyMgr:(new AccelKeyMgr).initFromMapActions(this.reg.mergeListsAsMap("accelkeys:jobsmgr","accelkeys:jobsmgr:done")),selectAction:new DisplayJobDetails(this),lineDrawer:this},init.jobsGrids)})))
this._tabs=jbBoxElt.appendChild(JSX.createElement(JobsTabs,{"î":Object.assign({vertical:true,areas:areas},init.jobsTab),id:"tabs"}))
this._toolbar=jbBoxElt.appendChild((new BarShared).initialize({reg:this.reg,startActions:ACTION.injectSepByGroup(this.reg.mergeLists("actions:jobsmgr:toolbar","actions:jobsmgr:toolbar:"+this.reg.env.universe.getId()),this.reg.getPref("actions.jobsmgr.groupOrder","refresh add *"),this),actionContext:this,focusListening:this._tabs}))
DOM.setAttrBool(this._toolbar,"vertical",true)
this.addEventListener("keydown",ev=>{if(ev.key==="Escape"&&this.currentJobsGrig){this.currentJobsGrig.selectByJob([])
ev.stopPropagation()}})}onViewShown(){if(this.params.showTab)this._tabs.selectTab(this._tabs.getTabByCode(this.params.showTab))
this.fetchAll()}get currentJobsGrig(){return this._tabs.selectedTab?this._tabs.selectedTab.view:null}async fetchAll(excludeCurrent=true){await this.fetchTabJobs()
await this.fetchStats()}async fetchStats(stats){if(this._fetchingCountersPending)return
let currentTab=this._tabs.selectedTab
if(!currentTab)return
let currentTabStatus=currentTab.area.getId()
try{this._fetchingCountersPending=true
if(!stats)stats=await EXECUTOR.getStats(this.reg.env.universe.executor)
this._tabs.refreshCounterValue(EJobTabStatus.alive,stats.countInQueue.toString())
this._tabs.refreshCounterValue(EJobTabStatus.failed,stats.countFailed.toString())
this.frozenStatus=stats.frozen}catch(e){this._tabs.refreshCounterValue(EJobTabStatus.alive,"-")
this._tabs.refreshCounterValue(EJobTabStatus.failed,"-")
this.frozenStatus=null
await ERROR.log("Count jobs failed",e)}finally{this._fetchingCountersPending=false}this._toolbar.refresh()}async fetchTabJobs(){if(this._fetchingTabJobsPending)return
let currentTab=this._tabs.selectedTab
if(!currentTab)return
let currentTabStatus=currentTab.area.getId()
this._fetching="pending"
try{this._fetchingTabJobsPending=true
let jobCriterions=this.computeFetchCriterion(currentTabStatus)
const result=this.params.scope=="my"?await EXECUTOR.findMyJobs(this.reg.env.universe.executor,jobCriterions):await EXECUTOR.findJobs(this.reg.env.universe.executor,jobCriterions)
this._fetching=null
const currentSelect=this.currentJobsGrig.getSelectedJobs()
this.currentJobsGrig.jobsGridDatas.setDatas(result.jobs)
this.currentJobsGrig.selectByJob(currentSelect)}catch(e){this._fetching="error"
this.currentJobsGrig.jobsGridDatas.setDatas([])
await ERROR.log("List jobs failed",e)}finally{this._fetchingTabJobsPending=false}}computeFetchCriterion(jobStatus){let jobCriterions={}
if(jobStatus==EJobTabStatus.alive){jobCriterions.statuses=[EJobStatus.waiting,EJobStatus.launched,EJobStatus.pending]
jobCriterions.inQueue=true}else if(jobStatus==EJobTabStatus.done)jobCriterions.statuses=[EJobStatus.done]
else if(jobStatus==EJobTabStatus.failed)jobCriterions.statuses=[EJobStatus.failed]
else if(jobStatus==EJobTabStatus.planned)jobCriterions.statuses=[EJobStatus.planned]
return jobCriterions}redrawLine(row,line){DOM.setAttr(line,"data-status",row.rowDatas.lastStatus)}emptyBody(){switch(this._fetching){case"pending":return JSX.createElement("c-msg",{label:"Chargement en cours...",level:"loading"})
case"error":return JSX.createElement("c-msg",{label:"Chargement en erreur",level:"error"})
default:return JSX.createElement("c-msg",{label:"Aucun traitement"})}}onViewBeforeHide(close){return false}async onViewWaitForHide(close){return true}}customElements.define("jobs-mgr",JobsMgr)
REG.reg.registerSkin("jobs-mgr",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\tc-bar-shared {\n\t\tflex: none;\n\t}\n\n\t#tabs {\n\t\tdisplay: contents;\n\t}\n\n\tserver-jobs-grid {\n\t\tflex: 1;\n\t}\n\n\tjobs-mgr-gridview {\n\t\tborder: none;\n\t}\n\n\t:host(:not([data-frozen])) .headband {\n\t\tdisplay: none;\n\t}\n\n\t.headband {\n\t\tbackground-color: var(--tooltip-bgcolor);\n\t}\n\n\t.jobsBox {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: row;\n\t}\n\n`)
REG.reg.registerSkin("jobs-mgr/grid",1,`\n\t.icon {\n\t\tpadding-inline-start: 1.5em;\n\t}\n\n\t.late {\n\t\tcolor: var(--error-color);\n\t}\n\n\t*[data-status=launched],\n\t*[data-status=pending] {\n\t\tfont-style: italic;\n\t}\n\n`)
class JobsGridView extends JobsGrid{async _initialize(init){super._initialize(init)
DOM.setAttrBool(this.shadowRoot.lastElementChild,"c-resizable",true)
this._resizerElt=this.shadowRoot.appendChild(JSX.createElement("c-resizer",{"c-orient":"column",class:"detailsRsz"}))
this._detailsElt=this.shadowRoot.appendChild(JSX.createElement("div",{class:"details","c-resizable":true}))
await this.showJobDetail(null)}async showJobDetail(jobs){const me=DOMSH.findHost(this)
if(jobs&&jobs.length==1){let jobBase=jobs[0]
this._currentJobDetailId=jobBase.id
let job=await EXECUTOR.getJob(me.reg.env.universe.executor,jobBase.id)
this._detailsElt.innerText=""
if(this._currentJobDetailId!==job.id)return
let factory=me.uiJobsFactories.find(factory=>factory.matchJob(jobBase))
if(factory){await factory.buildJobDetails(this._detailsElt,me,job)
if(this._currentJobDetailId!==job.id)return
DOM.setHidden(this._detailsElt,false)
DOM.setHidden(this._resizerElt,false)
this.ensureRowVisibleByJobId(job.id)
this._currentJobDetailId=undefined}else{DOM.setHidden(this._detailsElt,false)
DOM.setHidden(this._resizerElt,false)
this._detailsElt.appendChild(UiJobFactory.buildJobTitleDetails(job))
this._detailsElt.appendChild(UiJobFactory.buildJobPropsDetails(job))
this._detailsElt.appendChild(UiJobFactory.buildJobTriesDetails(job,me.reg))}}else{DOM.setHidden(this._detailsElt,true)
DOM.setHidden(this._resizerElt,true)}}onViewShown(){const me=DOMSH.findHost(this)
if(me)me.fetchAll()}}customElements.define("jobs-mgr-gridview",JobsGridView)
REG.reg.registerSkin("jobs-mgr-gridview",1,`\n\t.detailsRsz {\n\t\tcursor: n-resize;\n\t}\n\n\t.details:not([hidden]) {\n\t\tbackground-color: var(--row-bgcolor);\n\t\tborder-block-start: 1px solid var(--border-color);\n\t\tpadding: 2px;\n\t\tfont-size: .8em;\n\t\toverflow: auto;\n\t\theight: max(20%, 6rem);\n\t}\n\n\t.details h1 {\n\t\tfont-size: 1.2em;\n\t\tmargin-block-start: 0;\n\t}\n\n\t.details h2 {\n\t\tfont-size: 1em;\n\t\tletter-spacing: 1px;\n\t\tfont-weight: bolder;\n\t}\n\n\t.details .content {\n\t\tmargin-inline-start: 2rem;\n\t}\n\n\t.details .code {\n\t\tfont-size: .8rem;\n\t\tfont-family: var(--font-mono);\n\t\tborder: 1px solid var(--alt1-border-color);\n\t\tpadding: .3rem;\n\t\tuser-select: text;\n\t}\n\n`)
class JobsTabs extends Tabs{constructor(){super(...arguments)
this._countersElts=new Map}initialize(init){super.initialize(init)
this.findReg(init).installSkin("c-tabs",this.shadowRoot)
return this}_initTab(tab){super._initTab(tab)
tab._createLabel()
REG.findReg(this).installSkin("jobs-mgr-jobstabs-tab",tab.shadowRoot)
if([EJobTabStatus.alive,EJobTabStatus.failed].includes(tab.area.getId()))this._countersElts.set(tab.area.getId(),tab.shadowRoot.appendChild(JSX.createElement("span",{class:"count "+tab.area.getId()},"-")))}refreshCounterValue(jobTabStatus,value){if(this._countersElts.has(jobTabStatus))this._countersElts.get(jobTabStatus).textContent=value}}customElements.define("jobs-mgr-jobstabs",JobsTabs)
REG.reg.registerSkin("jobs-mgr-jobstabs",1,`\n\n`)
REG.reg.registerSkin("jobs-mgr-jobstabs-tab",1,`\n\t:host {\n\t\tmin-width: 7em !important;\n\t\ttext-align: start !important;\n\t}\n\n\t.label {\n\t\t/*flex:unset;*/\n\t}\n\n\t.count {\n\t\tbackground-color: var(--inv-bgcolor);\n\t\tcolor: var(--inv-color);\n\t\tborder-radius: 3px;\n\t\t/*top: -.4rem;\n\t\tleft: .4rem;\n\t\tposition: relative;*/\n\t\tfont-size: .7em;\n\t\tpadding: 2px;\n\t\tline-height: .7rem;\n\t\tfont-family: var(--font-mono);\n\t\t-webkit-text-stroke: initial;\n\t}\n\n\t.count.failed {\n\t\tbackground-color: var(--error-color);\n\t}\n\n`)
export class CellBuilderJobLabel extends CellBuilderIconLabel{constructor(jobsMgr){super(null)
this.jobsMgr=jobsMgr}getJobUiFactory(row){if(!("_jobFactory"in row.cacheHolder)&&this.jobsMgr.uiJobsFactories)row.cacheHolder["_jobFactory"]=this.jobsMgr.uiJobsFactories.find(factory=>factory.matchJob(row.rowDatas))
return row.cacheHolder["_jobFactory"]}_getValue(row){if("_jobLabel"in row.cacheHolder)return row.cacheHolder["_jobLabel"]
return row.cacheHolder["_jobLabel"]=this.getJobUiFactory(row)?this.getJobUiFactory(row).getLabel(this.jobsMgr):row.rowDatas.jobSgn}_getIcon(row){if("_jobIcon"in row.cacheHolder)return row.cacheHolder["_jobIcon"]
return row.cacheHolder["_jobIcon"]=this.getJobUiFactory(row)?this.getJobUiFactory(row).getIcon(this.jobsMgr):null}}const actionRefreshUi=new Action("refreshUi").setLabel("Rafraichir").setGroup("refresh").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/refresh.svg").setExecute((async function(ctx,ev){ctx.fetchAll()}))
export class ActionNewJobs extends ActionMenu{constructor(id){super(id)
this._label="Nouveau..."
this._group="new"
this._description="Créer un nouveau traitement"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/dialogs/jobs/addJob.svg"
this._enablePerms="action.jobsMgr#create.job"}isVisible(ctx){if(!ctx.uiJobsFactories)return false
return super.isVisible(ctx)}getActions(ctx){const jobsFactories=ctx.uiJobsFactories
let actions=[]
jobsFactories.forEach(factory=>{if(factory.getJobBuilder())actions.push(new ActionWrapperCreateJob(ctx).setOverridenSvc(factory.getJobBuilder()))})
return actions}}ActionNewJobs.SINGLETON=new ActionNewJobs
export class ActionDuplicateJob extends JobsAction{constructor(jobsMgr,id){super(id)
this.jobsMgr=jobsMgr
this._label="Créer un nouveau traitement de même type"
this._description="Créer un nouveau traitement de même type"
this.setMode("mono")
this._group="new"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/actions/jobs/clone.svg"
this.requireVisiblePerm("action.jobsMgr#create.job")}isVisible(ctx){if(!this.jobsMgr.uiJobsFactories)return false
if(!ctx.jobs||ctx.jobs.length!==1)return false
let factory=this.jobsMgr.uiJobsFactories.find(factory=>factory.matchJob(ctx.jobs[0]))
if(!factory||!factory.getJobBuilder())return false
return super.isVisible(ctx)}async execute(ctx,ev){try{const factory=this.jobsMgr.uiJobsFactories.find(factory=>factory.matchJob(ctx.jobs[0]))
const creator=factory.getJobBuilder()
if(creator.isAvailable(ctx)){let job=await EXECUTOR.getJob(ctx.reg.env.universe.executor,ctx.jobs[0].id)
return await creator.execute(Object.assign({job:job},ctx))}}catch(e){await ERROR.report(`La création du traitement n\'a pas pu aboutir. Veuillez réessayer ultérieurement.`,e)
return null}}}class ActionWrapperCreateJob extends ActionWrapper{constructor(jobsMgr){super()
this.jobsMgr=jobsMgr}async execute(ctx,ev){let result=await super.execute(ctx,ev)
if(result){let jobId=result.id
let planned=result.planned
let dateObj=planned?new Date(planned):null
let date=dateObj?dateObj.toLocaleString():null
POPUP.showNotifWarning(date?`Le traitement a bien été planifié le ${date} avec l\'identifiant \'${jobId}\'.`:`Le traitement a bien été créé avec l\'identifiant \'${jobId}\'.`,this.jobsMgr)
actionRefreshUi.executeIfAvailable(this.jobsMgr)}else POPUP.showNotifError(`Le traitement n\'a pas été créé. Veuillez vérifier les paramètres saisis.`,this.jobsMgr)
return result}}class ActionWrapperRefresMgr extends ActionWrapper{constructor(jobsMgr){super()
this.jobsMgr=jobsMgr}async execute(ctx,ev){let result=await super.execute(ctx,ev)
if(result)await this.jobsMgr.fetchAll()
if(typeof result==="object"){let job=result
this.jobsMgr.currentJobsGrig.selectByJob([job])}return result}}export class DisplayJobDetails extends Action{constructor(jobsMgr){super("focusItem")
this.jobsMgr=jobsMgr}execute(ctx,ev){this.jobsMgr.currentJobsGrig.showJobDetail(ctx.jobs)}}class FreezeExecutorBtn extends Action{constructor(){super("freezeExecutor")
this._group="refresh"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/actions/jobs/frozen.svg"
this.requireEnabledPerm("action.jobsMgr#freeze.executor")}getLabel(ctx){let currentStatus=this.getDatas("toggle",ctx)
return`Gèle/relance l\'exécution des traitements en attente`}isVisible(ctx){if(!ctx.reg.env.universe.executor.hasFeature("freezable"))return false
return super.isVisible(ctx)}isToggle(ctx){return true}getDatas(api,ctx){return ctx.frozenStatus}async execute(ctx,ev){let currentStatus=this.getDatas("toggle",ctx)
let infos=await EXECUTOR.freezeExecutor(ctx.reg.env.universe.executor,!currentStatus)
ctx.fetchStats(infos)}}
//# sourceMappingURL=jobsMgr.js.map