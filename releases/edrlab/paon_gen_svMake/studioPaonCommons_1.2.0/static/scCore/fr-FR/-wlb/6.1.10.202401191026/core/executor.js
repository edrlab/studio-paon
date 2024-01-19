import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{CDM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/cdm.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{DOM,JSX,ShadowJsx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{Signboard}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/signboard.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{GridSmall}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{CellBuilderBarActions,CellBuilderDate,CellBuilderEnum,GridDataHolderJsonArray}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{CellBuilderAccount}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/usersGrid.js"
import{FORMS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
import{AREAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{JobPlanificatorInputArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/jobsInput.js"
export class ExecutorSrv{constructor(config){this.config=config}hasFeature(feat){return this.config.features?this.config.features[feat]:undefined}}export function configExecutorSrv(webFrameUrl,config){if(!config)config={}
if(!config.executorUrl)config.executorUrl=webFrameUrl.resolve("u/executor/")
return config}export var EJobSucess;(function(EJobSucess){EJobSucess["finished"]="finished"
EJobSucess["finalFailure"]="finalFailure"
EJobSucess["attemptFailed"]="attemptFailed"})(EJobSucess||(EJobSucess={}))
export var EJobStatus;(function(EJobStatus){EJobStatus["waiting"]="waiting"
EJobStatus["launched"]="launched"
EJobStatus["pending"]="pending"
EJobStatus["done"]="done"
EJobStatus["failed"]="failed"
EJobStatus["planned"]="planned"})(EJobStatus||(EJobStatus={}))
export var EXECUTOR;(function(EXECUTOR){EXECUTOR.JOBS_FACTORIES_LIST="executor:jobs:factories"
function isJobAlive(jobStatus){return jobStatus==EJobStatus.waiting||jobStatus==EJobStatus.launched||jobStatus==EJobStatus.pending?true:false}EXECUTOR.isJobAlive=isJobAlive
function isJobFinished(jobStatus){return jobStatus==EJobStatus.done||jobStatus==EJobStatus.failed?true:false}EXECUTOR.isJobFinished=isJobFinished
async function findMyJobs(executor,criterions){return executor.config.executorUrl.fetchJson(IO.qs("cdaction","FindMyJobs","criterions",criterions?CDM.stringify(criterions):null))}EXECUTOR.findMyJobs=findMyJobs
async function findJobs(executor,criterions){return executor.config.executorUrl.fetchJson(IO.qs("cdaction","FindJobs","criterions",criterions?CDM.stringify(criterions):null))}EXECUTOR.findJobs=findJobs
async function getJob(executor,jobId){return executor.config.executorUrl.fetchJson(IO.qs("cdaction","GetJob","jobId",jobId))}EXECUTOR.getJob=getJob
async function getStats(executor){return executor.config.executorUrl.fetchJson(IO.qs("cdaction","GetStats"))}EXECUTOR.getStats=getStats
async function freezeExecutor(executor,param){return executor.config.executorUrl.fetchJson(IO.qs("cdaction","FreezeExecutor","param",param),{method:"POST"})}EXECUTOR.freezeExecutor=freezeExecutor
async function createJob(executor,jobFactoryCode,jobDatas,plannedDate){const formData=new FormData
if(plannedDate)formData.append("date",plannedDate.toString())
if(jobDatas)formData.append("jobDatas",CDM.stringify(jobDatas))
return executor.config.executorUrl.fetchJson(IO.qs("cdaction","CreateJob","param",jobFactoryCode),{method:"POST",body:formData})}EXECUTOR.createJob=createJob
async function forceExecuteJob(executor,jobId){return executor.config.executorUrl.fetchJson(IO.qs("cdaction","ForceExecuteJob","jobId",jobId),{method:"POST"})}EXECUTOR.forceExecuteJob=forceExecuteJob
async function scheduleJob(executor,jobId,plannedDate){return executor.config.executorUrl.fetchJson(IO.qs("cdaction","ScheduleJob","jobId",jobId,"date",plannedDate),{method:"POST"})}EXECUTOR.scheduleJob=scheduleJob
async function deleteJob(executor,jobId){let resp=await executor.config.executorUrl.fetch(IO.qs("cdaction","DeleteJob","jobId",jobId),null,{method:"POST"})
return resp.ok}EXECUTOR.deleteJob=deleteJob
async function moveJobInQueue(executor,jobId,position){let resp=await executor.config.executorUrl.fetchJson(IO.qs("cdaction","MoveJobInQueue","jobId",jobId,"jobDatas",position),{method:"POST"})
return resp.newOffsetInQueue}EXECUTOR.moveJobInQueue=moveJobInQueue})(EXECUTOR||(EXECUTOR={}))
export class UiJobFactory extends Signboard{setUiJobSng(uiJobSng){this._uiJobSng=uiJobSng
return this}getUiJobSng(){return this._uiJobSng}setJobFactoryCode(factoryCode){this._jobFactoryCode=factoryCode
return this}getJobFactoryCode(){return this._jobFactoryCode||this.getId()}matchJob(job){if(this._matchJob)return this._matchJob(job)
else if(job.jobSgn&&this._uiJobSng){let patterns=[]
this._uiJobSng.forEach((str,pos)=>{patterns.push(LANG.escape4Regexp(str))
patterns.push(".*#"+LANG.escape4Regexp(str)+"\\b.*")})
let regExp=new RegExp(`.*(${patterns.join("|")}).*`)
return job.jobSgn.match(regExp)?true:false}return false}setMatchJob(matchJob){this._matchJob=matchJob
return this}setJobBuilder(jobBuilder){this.jobBuilder=jobBuilder
return this}getJobBuilder(){return this.jobBuilder}async buildJobDetails(target,ctx,job,options){let jobId=job.id
let jobLabel=this.getLabel({job:job})
target.appendChild(JSX.createElement("h1",null,`[Traitement ${jobId}] ${jobLabel}]`))
await this.buildLongDescForJob(ctx,job,target.appendChild(JSX.createElement("div",null)))
target.appendChild(UiJobFactory.buildJobPropsDetails(job))
target.appendChild(UiJobFactory.buildJobTriesDetails(job,ctx.reg))}async buildLongDescForJob(ctx,job,target){const desc=this.getDescription({job:job})
if(desc)target.appendChild(JSX.createElement("div",{class:"header"},desc))}static buildJobTitleDetails(job){if(job){let jobId=job.id
return JSX.createElement("h1",null,`[Traitement ${jobId}]`)}}static buildJobPropsDetails(job){if(job.jobProps){return JSX.createElement("div",null,JSX.createElement("h2",null,"Propriétés"),JSX.createElement("div",{class:"content code"},JSON.stringify(job.jobProps)))}}static buildJobTriesDetails(job,reg){if(job.tries){let grid=(new GridSmall).initialize({selType:"none",columnDefs:[new GridColDef("started").setLabel("Début").setFlex("2rem",1,1).setCellBuilder(new CellBuilderDate("started").setCellClass("center").setOptions({year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"})),new GridColDef("finished").setLabel("Fin").setFlex("2rem",1,1).setCellBuilder(new CellBuilderDate("finished").setCellClass("center").setOptions({year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"})),new GridColDef("by").setLabel("Exécuteur").setFlex("1rem",1,1).setCellBuilder(new CellBuilderAccount(reg,"by",true)),new GridColDef("result").setLabel("Résultat").setFlex("2rem",1,1).setCellBuilder(new CellBuilderEnum("status",new Map([[EJobSucess.attemptFailed,"Tentative en échec"],[EJobSucess.finalFailure,"En échec"],[EJobSucess.finished,"Terminé"]])).setCellClass("center").override("_getValue",(function(row){let success=row.getData("result")?row.getData("result").success:null
return success&&this.mappingTable.has(success)?this.mappingTable.get(success):success}))),new GridColDef("status").setLabel("Statut").setFlex("2rem",1,1).setCellBuilder(new CellBuilderEnum("status",new Map([[EJobStatus.waiting,"En attente"],[EJobStatus.launched,"Chargé"],[EJobStatus.pending,"En cours d\'exécution"],[EJobStatus.done,"Terminé"],[EJobStatus.failed,"En échec"],[EJobStatus.planned,"Planifié"]])).setCellClass("center")),new GridColDef("actions").setLabel("").setSortable(false).setCellBuilder(new CellBuilderBarActions("actions",[(new Action).setLabel("Détails techniques").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/actions/jobs/details.svg").setVisible(ctx=>{var _a,_b,_c
return((_a=ctx.try)===null||_a===void 0?void 0:_a.error)||((_c=(_b=ctx.try)===null||_b===void 0?void 0:_b.result)===null||_c===void 0?void 0:_c.system)?true:false}).setExecute(async ctx=>{var _a,_b,_c,_d,_e,_f,_g
if((_a=ctx.try)===null||_a===void 0?void 0:_a.error){await ERROR.show("Échec d\'exécution du job",new Error(ctx.try.error+"\n"+(((_c=(_b=ctx.try)===null||_b===void 0?void 0:_b.result)===null||_c===void 0?void 0:_c.system)?JSON.stringify((_e=(_d=ctx.try)===null||_d===void 0?void 0:_d.result)===null||_e===void 0?void 0:_e.system):"")))}else await ERROR.show("Traces techniques d\'exécution du job",new Error(JSON.stringify((_g=(_f=ctx.try)===null||_f===void 0?void 0:_f.result)===null||_g===void 0?void 0:_g.system)))})],{reg:reg}).setActionContextMaker((row,actionContext)=>{actionContext.try=row.rowDatas}))],dataHolder:new GridDataHolderJsonArray,hideHeaders:false,skinOver:"c-uijobfactory-tries/grid",hideSortBtns:true,emptyBody:()=>JSX.createElement("c-msg",{label:"Aucune",level:"info"}),lineDrawer:{redrawLine:(row,line)=>{var _a
DOM.setAttrBool(line,"data-error",row.getData("status")==EJobStatus.failed||((_a=row.getData("result"))===null||_a===void 0?void 0:_a.success)===EJobSucess.finalFailure)}}})
grid.addEventListener("grid-select",evt=>{evt.stopPropagation()})
grid.dataHolder.setDatas(job.tries)
return JSX.createElement("div",null,JSX.createElement("h2",null,"Tentatives d\'exécution"),JSX.createElement("div",{class:"content"},grid))}}}REG.reg.registerSkin("c-uijobfactory-tries/grid",1,`\n\t*[data-error] {\n\t\tcolor: var(--error-color)\n\t}\n`)
export class JobBuilderAction extends Action{constructor(uiJobFactory){super()
this.uiJobFactory=uiJobFactory
this._planned=null
this._plannedByUserPropName="plannedDate"
this._jobDatasBuilder=new Map
this._jobDatasValidity=new Set
this.addJobDataBuilder("_jobDatasBase",async(datasPending,jobsParameters,ctx)=>{if(this.getBaseJobDatas())Object.assign(datasPending,this.getBaseJobDatas())},0)
this.addJobDataBuilder("_uiProps",async(datasPending,jobsParameters,ctx)=>{const dialogAreas=await this.getJobDialogAreas(ctx)
if(dialogAreas){datasPending[JobBuilderAction.UI_PROPS]={}
dialogAreas.forEach(area=>{if(area.isAvailable(ctx))datasPending[JobBuilderAction.UI_PROPS][area.getId()]=jobsParameters[area.getId()]})}},0)
this.addJobDataBuilder("_jobsParameters",(datasPending,jobsParameters,ctx)=>Object.assign(datasPending,jobsParameters),0)}getDescription(ctx){return this._description?super.getDescription(ctx):this.uiJobFactory.getDescription(ctx)}getLabel(ctx){return this._label?super.getLabel(ctx):this.uiJobFactory.getLabel(ctx)}getIcon(ctx){return super.getIcon(ctx)?super.getIcon(ctx):this.uiJobFactory.getIcon(ctx)}isVisible(ctx){if(!this.uiJobFactory.isVisible(ctx))return false
return super.isVisible(ctx)}isEnabled(ctx){if(!this.uiJobFactory.isEnabled(ctx))return false
return super.isEnabled(ctx)}addBaseJobDatas(jobDatas){this._jobDatasBase=Object.assign(this._jobDatasBase||{},jobDatas)
return this}getBaseJobDatas(){return this._jobDatasBase}async jobDialog(ctx){const label=this.getLabel(ctx)
let form
let msg=JSX.createElement("div",null,JSX.createElement("h4",null,`Traitement : \"${label}\"`))
const dialogAreas=await this.getJobDialogAreas(ctx)
if(dialogAreas||this.getPlanned(ctx)==="byUser"){form=msg.appendChild(JSX.createElement("form",{id:"form",autocomplete:"off"},JSX.createElement("fieldset",{id:"fieldset","area-ids":"*"})))
let areas=[]
if(dialogAreas)areas=areas.concat(dialogAreas)
if(this.getPlanned(ctx)==="byUser")areas.push(new JobPlanificatorInputArea(this._plannedByUserPropName))
await AREAS.applyLayout(form,areas,{buildControlLabel:true,reg:ctx.reg,uiJobFactory:this.uiJobFactory},true)
if(ctx.job&&ctx.job.jobProps&&ctx.job.jobProps[JobBuilderAction.UI_PROPS])FORMS.jsonToForm(ctx.job.jobProps[JobBuilderAction.UI_PROPS],form,false,true)
form.checkValidity()}if(await POPUP.confirm(JSX.createElement("div",{style:"display: contents;"},JSX.createElement(ShadowJsx,{skin:"form-control-areas",skinOver:"job-create-form"},msg)),null,{resizer:{},okLbl:"Créer",titleBar:{barLabel:{label:"Nouveau traitement"}}})){return form?FORMS.formToJson(form):[]}else return null}addJobDialogAreas(params){if(!this._jobDialogAreas)this._jobDialogAreas=[]
this._jobDialogAreas=this._jobDialogAreas.concat(params)
return this}async getJobDialogAreas(ctx){if(!this._jobDialogAreas)return null
const areas=await Promise.all(this._jobDialogAreas)
const resolvedAreas=[]
await Promise.all(areas.map(async(area,ind)=>{if(typeof area==="function"){const result=await Promise.resolve(area.call(this,ctx))
if(result)resolvedAreas.push(result)}else resolvedAreas.push(area)}))
return resolvedAreas}addJobDataBuilder(id,fct,sort){this._jobDatasBuilder.set(id,{sort:sort||0,fct:fct})
return this}async buildJobDatas(jobsParameters,ctx){let jobDatas={}
const dataBuilders=Array.from(this._jobDatasBuilder.values()).sort((a,b)=>a.sort-b.sort)
await Promise.all(dataBuilders.map(async bd=>{await bd.fct.call(this,jobDatas,jobsParameters,ctx)}))
return jobDatas}addJobDataValidity(fct){this._jobDatasValidity.add(fct)
return this}async checkJobDatasValidity(datas,ctx){const fcts=Array.from(this._jobDatasValidity.values())
for(let i=0;i<=fcts.length;i++){if(fcts[i]&&!await fcts[i].call(this,datas,ctx))return false}return true}setPlanned(planned){this._planned=planned
return this}getPlanned(ctx){if(!ctx.reg.env.universe.executor.hasFeature("scheduling"))return null
return this._planned}async execute(ctx,ev){try{const jobsParameters=await this.jobDialog(ctx)
if(jobsParameters!==null){let plannedDate
const planned=this.getPlanned(ctx)
if(planned==="byUser"){plannedDate=jobsParameters[this._plannedByUserPropName]?jobsParameters[this._plannedByUserPropName].date:null
jobsParameters[this._plannedByUserPropName]=undefined}else if(typeof planned==="function"){plannedDate=planned.call(this,ctx)}let jobDatas
jobDatas=await this.buildJobDatas(jobsParameters,ctx)
if(jobDatas&&jobDatas.rulesSgn===undefined)jobDatas.rulesSgn=this.uiJobFactory.getUiJobSng()
if(await this.checkJobDatasValidity(jobDatas,ctx))return await EXECUTOR.createJob(ctx.reg.env.universe.executor,this.uiJobFactory.getJobFactoryCode(),jobDatas,plannedDate)}}catch(e){await ERROR.report(`La création du traitement n\'a pas pu aboutir. Veuillez réessayer ultérieurement.`,e)}}override(name,val){return super.override(name,val)}}JobBuilderAction.UI_PROPS="ui-props"
REG.reg.registerSkin("job-create-form",1,`\n\t:host > div{\n\t\tdisplay: contents;\n\t}\n\t\n\tform {\n\t\tdisplay: flex;\n\t\tflex: 1;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t}\n\t\n\tfieldset {\n\t\tdisplay: flex;\n\t\tflex: 1;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tflex-direction: column;\n\t\tborder: none;\n\t\tpadding: 0;\n\t\tmargin: 0;\n\t\tmin-width: 0;\n\t}\n\n\t*[area-id="_processings"], *[area-id="_views"] {\n\t\tflex: 1;\n\t}\n\n`)

//# sourceMappingURL=executor.js.map