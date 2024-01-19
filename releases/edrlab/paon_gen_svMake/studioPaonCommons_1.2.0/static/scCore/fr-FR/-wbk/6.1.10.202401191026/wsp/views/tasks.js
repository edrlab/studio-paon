import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{BaseAreaView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{EWspChangesEvts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{isItemUiEnv}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemMain.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{EInvolvement,ETaskStage,TASK}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/lcTask.js"
import{CDM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/cdm.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{CellBuilderItModelFlagIcon,CellBuilderLc,CellBuilderSrcIconCode,CellBuilderTkDeadline}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcGridColumns.js"
import{AccelKeyMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{EItemTypeFamily,ItemTypeTask,LC_DEFAULT_NAME}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js"
import{CreateTask}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/lcTaskActions.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/views_Perms.js"
import{FocusTask}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/taskActions.js"
var IS_element=DOM.IS_element
export class Tasks extends BaseAreaView{get taskScope(){return isItemUiEnv(this.reg.env)?"item":"my"}get itemRef(){return isItemUiEnv(this.reg.env)?SRC.srcRef(this.reg.env.longDesc):null}get itemLongDesc(){return isItemUiEnv(this.reg.env)?this.reg.env.longDesc:null}get currentUser(){return this.reg.env.universe.auth.currentUser}get visibleStage(){switch(this._currentTab.id){case"do":case"fo":case"pe":return ETaskStage.pending
case"co":return ETaskStage.completed
case"fc":return ETaskStage.forthcoming}}_initialize(init){super._initialize(init)
this.wsp=this.reg.env.wsp
this.ephemeralView=init.ephemeralView
this.refreshCb=init.refreshCb
const taskFields=["srcUri","srcId","itSgn","itModel","actTi","lcSt","lcDt","lcBy","rspUsrs","actCts","actStage","tkDeadline","srcRoles","srcRi"]
this._tasksFields=taskFields.join("*")
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin("c-tabs/base",init)
this.reg.installSkin("c-tabs",sr)
this.reg.installSkin("scroll/small",sr)
this.reg.installSkin(this.localName,sr)
const allTabs=sr.appendChild(JSX.createElement("div",{id:"allTabs"}))
allTabs.appendChild(JSX.createElement("c-button-actions",{id:"createTask","î":{reg:this.reg,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/tasks/add.svg",title:"Créer une nouvelle tâche",actionContext:{reg:this.reg,shortDescs:this.itemLongDesc?[this.itemLongDesc]:[],infoBroker:this.reg.env.infoBroker,emitter:this},actions:this.reg.env.wsp.wspMetaUi.getItemTypes().filter(t=>t instanceof ItemTypeTask).map(t=>new CreateTask(t))}}))
allTabs.onclick=ev=>{if(ev.target instanceof Button&&ev.target.classList.contains("tab")){this.setCurrentTab(ev.target)
this.fetchTasks()}}
switch(this.taskScope){case"my":allTabs.append(JSX.createElement("div",{id:"tabs"},JSX.createElement("c-button",{id:"do",class:"tab",label:"À faire",title:"Tâches à faire"}),JSX.createElement("c-button",{id:"fo",class:"tab",label:"À suivre",title:"Tâches à suivre"})),JSX.createElement("div",{class:"flex"}),JSX.createElement("div",{id:"tabs"},this.wsp.wspMetaUi.hasForthcomingTasks()?JSX.createElement("c-button",{id:"fc",class:"tab",label:"À venir",title:"Tâches à venir"}):undefined,JSX.createElement("c-button",{id:"co",class:"tab",label:"Closes",title:"Tâches closes"})))
break
case"item":allTabs.append(JSX.createElement("div",{id:"tabs"},JSX.createElement("c-button",{id:"pe",class:"tab",label:"En cours",title:"Tâches en cours"}),this.wsp.wspMetaUi.hasForthcomingTasks()?JSX.createElement("c-button",{id:"fc",class:"tab",label:"À venir",title:"Tâches à venir"}):undefined,JSX.createElement("c-button",{id:"co",class:"tab",label:"Closes",title:"Tâches closes"})))
break
default:throw Error("taskScope unknown "+this.taskScope)}this.reg.addToList("columns:tasksview","type",1,new GridColDef("type").setLabel("").setMinWidth("1.5em").setMaxWidth("1.5em").setSortable(true).setCellBuilder(new CellBuilderItModelFlagIcon(this.reg,this.wsp.wspMetaUi)).setSkin("wsp-tasks/grid"),0)
this.reg.addToList("columns:tasksview","label",1,new GridColDef("label").setLabel("Libellé").setFlex("10em",1,1).setMinWidth("5em").setSortable(true).setCellBuilder(new CellBuilderSrcIconCode(this.reg,this.wsp.wspMetaUi,true).setIconWidth("0").override("_getIcon",()=>"")),0)
this.reg.addToList("columns:tasksview","lc",1,new GridColDef("lc").setLabel(LC_DEFAULT_NAME).setFlex("4em",1,1).setMinWidth("2em").setSortable(true).setCellBuilder(new CellBuilderLc(this.wsp.wspMetaUi)),0)
this.reg.addToList("columns:tasksview","deadline",1,new GridColDef("deadline").setLabel("Date limite").setFlex("5em",1,0).setMinWidth("4em").setSortable(true).setCellBuilder(new CellBuilderTkDeadline),0)
const gridInit={reg:this.reg,columnDefs:this.reg.mergeLists("columns:tasksview","columns:tasksview:"+this.id),emptyBody:()=>JSX.createElement("c-msg",{label:this._fetchingMsg||"Aucune tâche trouvée"}),itemHandlingReact:this.reg.env.infoBroker,onWspUriChangeScope:"longDesc",actions:this.reg.mergeLists("actions:wsp:shortDesc:task"),accelKeyMgr:(new AccelKeyMgr).initFromMapActions(this.reg.mergeListsAsMap("accelkeys:wsp:shortDesc:task")),defaultAction:new FocusTask,lineDrawer:this,skinScroll:"scroll/small",autoSelOnFocus:"first"}
this._grid=sr.appendChild(JSX.createElement("wsp-src-grid",{"î":gridInit}))
const tab=init.lastDatas?init.lastDatas.tab:null
this.setCurrentTab((tab?sr.getElementById(tab):null)||DOM.findNext(allTabs,allTabs,n=>IS_element(n)&&n.classList.contains("tab")))}_refresh(){super._refresh()
const sr=this.shadowRoot
DOM.setAttrBool(sr.getElementById("createTask"),"disabled",!this.reg.hasPerm("action.tasks#create.task"))}setCurrentTab(tab){if(this._currentTab)this._currentTab.classList.toggle("selected",false)
this._currentTab=tab
tab.classList.toggle("selected",true)}async fetchTasks(){this.showTasksList(null,"loading")
try{const currTab=this._currentTab
const qs=["cdaction","FindTasks","param",this.wsp.code,"fields",this._tasksFields]
let options
const user=this.currentUser
this._lastUserFlatGroups=await this.reg.env.universe.auth.fetchFlattenedGroups()||[user.account]
if(currTab!==this._currentTab||user!==this.currentUser)return
switch(this.taskScope){case"my":qs.push("refUriFrom","")
options={includeDescendants:true,involvedUser:user.account,involvedUserGroups:true}
break
case"item":options={}
qs.push("refUriFrom",this.itemRef)
break
default:throw Error("taskScope unknown "+this.taskScope)}const visibleStage=this.visibleStage
if(visibleStage!==ETaskStage.pending)options.actStage=visibleStage
qs.push("options",CDM.stringify(options))
const tasks=await this.reg.env.universe.wspServer.config.tasksUrl.fetchJson(IO.qs(...qs))
if(currTab!==this._currentTab||user!==this.currentUser)return
if(this.refreshCb)this.refreshCb(visibleStage,tasks)
for(let i=tasks.length-1;i>=0;i--)if(!Tasks.taskIsShown(this._currentTab.id,this.taskScope,tasks[i],this._lastUserFlatGroups,this.wsp))tasks.splice(i,1)
this.showTasksList(tasks)}catch(e){this.showTasksList(null,"error")}}showTasksList(tasks,state=null){if(state==="error")this._fetchingMsg="Chargement en cours..."
else if(state==="loading")this._fetchingMsg="Chargement en cours..."
else this._fetchingMsg=null
this._grid.dataHolder.setDatas(tasks||[])}static taskIsShown(currentTabId,taskScope,task,userFlatGroups,wsp){const inv=currentTabId==="do"?EInvolvement.executor:currentTabId==="fo"?EInvolvement.follower:null
if(inv){return(TASK.getInvolvementForAccounts(taskScope==="my"?userFlatGroups:"*",task,wsp.wspMetaUi)&inv)>0}return true}onViewShown(){if(!this.ephemeralView&&!this._onConnRenewed){if(this.taskScope==="my"){this._wspUriChange=this.onWspUriChange.bind(this)
this.reg.env.place.eventsMgr.on("wspUriChange",this._wspUriChange)}this._onConnRenewed=this.onConnRenewed.bind(this)
this.reg.env.place.eventsMgr.on("onConnectionRenewed",this._onConnRenewed)}this.shown=true
this.fetchTasks()}onViewHidden(closed){this.shown=false
if(closed){if(this._wspUriChange){this.reg.env.place.eventsMgr.removeListener("wspUriChange",this._wspUriChange)
this._wspUriChange=null}if(this._onConnRenewed){this.reg.env.place.eventsMgr.removeListener("onConnectionRenewed",this._onConnRenewed)
this._onConnRenewed=null}}}buildLastDatas(parentLastDatas){const lastDatasKey=this.getAttribute("last-datas")
if(lastDatasKey){parentLastDatas[lastDatasKey]={tab:this._currentTab.id}}}redrawLine(row,line){const dt=row.rowDatas.tkDeadline
line.classList.toggle("late",dt>0&&dt<Date.now())
line.classList.toggle("comleted",row.rowDatas.actStage==="completed")
line.classList.toggle("isNotShown",!Tasks.taskIsShown(this._currentTab.id,this.taskScope,row.rowDatas,this._lastUserFlatGroups,this.wsp))
this._grid.redrawLine(row,line)}onWspUriChange(msg,from){if(msg.involved&&msg.type===EWspChangesEvts.u){const type=this.wsp.wspMetaUi.getItemType(msg.itModel)
if(type.getFamily()===EItemTypeFamily.task){if(!this._grid.srcGridDatas.findRowKeyBySrcId(msg.srcId))this.fetchTasks()}}}async onConnRenewed(){if(this.shown)setTimeout(()=>{if(this.shown)this.fetchTasks()},200)}}REG.reg.registerSkin("wsp-tasks",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t#tabs {\n\t\tdisplay: contents;\n\t}\n\n\t#allTabs {\n\t\tdisplay: flex;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\t#createTask[disabled] {\n\t\tdisplay: none;\n\t}\n\n\t.tab {\n\t\tflex: 1 1 auto;\n\t\tmin-width: 2em !important;\n\t\tcursor: pointer;\n\t\tborder: unset;\n\t\tborder-radius: 0;\n\t}\n\n\t.flex {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t}\n\n\twsp-src-grid {\n\t\tflex: 1;\n\t\tborder: none;\n\t}\n`)
REG.reg.registerSkin("wsp-tasks/grid",1,`\n\t.icon {\n\t\tpadding-inline-start: 1.5em;\n\t}\n\n\t.late {\n\t\tcolor: var(--error-color);\n\t}\n\n\t.comleted {\n\t\ttext-decoration-line: line-through;\n\t}\n\n\t.isNotShown {\n\t\tfont-style: italic;\n\t\topacity: .8;\n\t}\n`)
customElements.define("wsp-tasks",Tasks)

//# sourceMappingURL=tasks.js.map