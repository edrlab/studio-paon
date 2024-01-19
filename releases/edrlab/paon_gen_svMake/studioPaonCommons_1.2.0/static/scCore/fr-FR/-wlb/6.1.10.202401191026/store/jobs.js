import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{JobBuilderAction,UiJobFactory}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/executor.js"
import{InputArea,InputChoiceArea,SelectArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
export class RelaunchCidTaskBaseJobFactory extends UiJobFactory{constructor(id){super()
this._processings=[]
this._choiceRebuildVersions=false
this.setUiJobSng([id])
this.setLabel(id)
this.setJobFactoryCode("relaunchCidTasks")
this.setJobBuilder(new JobBuilderAction(this).addJobDataValidity(async(props,ctx)=>{if(this._processings&&this._processings.length>0){if(!props.preconditions||props.preconditions==="")return false}return true}).addJobDataBuilder("preconditions",async(datasPending,jobsParameters,ctx)=>{if(jobsParameters._processings){datasPending.preconditions=""
jobsParameters._processings.forEach((code,offset)=>{if(offset>0)datasPending.preconditions+="|"
datasPending.preconditions+="(persistMeta(processing,"+code+")"
let processing=this.getProcessings().find(entry=>entry.code==code)
if(!processing.isVcb||jobsParameters._rebuildAllVersions!=="all")datasPending.preconditions+=" &headInUrlTree"
datasPending.preconditions+=")"})}datasPending._processings=datasPending._rebuildAllVersions=undefined},10).addJobDialogAreas([ctx=>{if(this.getProcessings().length>0){let processindsDataSet={}
this.getProcessings().sort((prA,prB)=>prA.name.localeCompare(prB.name)).forEach(proc=>processindsDataSet[proc.code]={label:proc.name+(proc.isVcb?"*":"")})
return new SelectArea("_processings").setMultiple(true).setLabel("Types de ressources").setDataset(processindsDataSet).setRequired(true)}},ctx=>{if(this.getChoiceRebuildVersions()){return new InputChoiceArea("_rebuildAllVersions").setLabel("Versions des ressources").setDataset({mostRecent:{label:"La plus récente uniquement",disabled:false},all:{label:"Toutes (si disponibles : *)"}}).setDefaultValue("mostRecent")}}]))}addChoiceProcessing(code,name,isVcb){this._processings.push({code:code,name:name,isVcb:isVcb})
return this}getProcessings(){return this._processings}addChoiceRebuildVersions(choice){this._choiceRebuildVersions=choice}getChoiceRebuildVersions(){return this._choiceRebuildVersions}async buildLongDescForJob(ctx,job,target){var _a
if(job&&job.jobProps){const uiProps=job.jobProps[JobBuilderAction.UI_PROPS]
let list=target.appendChild(JSX.createElement("ul",null))
if(job.jobProps[JobBuilderAction.UI_PROPS]){if(uiProps._processings){let processingsStr=[]
uiProps._processings.forEach(proc=>{const procObj=this.getProcessings().find(entry=>entry.code===proc)
processingsStr.push(procObj?procObj.name:proc)})
if(processingsStr.length>0){processingsStr=processingsStr.sort()
const processings=processingsStr.join(", ")
const str=`Traitement(s) : ${processings}`
list.appendChild(JSX.createElement("li",null,str))}}if(this.getChoiceRebuildVersions()){let rbv=uiProps._rebuildAllVersions==="all"?"oui":"non"
const str=`Traitement des versions antérieures (si pertinent) : ${rbv}`
list.appendChild(JSX.createElement("li",null,str))}}if(((_a=job.jobProps.updateRawContent)===null||_a===void 0?void 0:_a.action)=="scarMigrate"){const wspTypes=job.jobProps.updateRawContent.wspTypes
if(wspTypes){wspTypes.forEach(migrRule=>{if(migrRule.matchKey==".*"){list.appendChild(JSX.createElement("li",null,"Migration des versions mediums et mineures"))}else{const from=migrRule.matchKey
const to=migrRule.renameTo
let str=`Migration de \'${from}\' vers \'${to}\'`
list.appendChild(JSX.createElement("li",null,str))
const subList=list.appendChild(JSX.createElement("ul",null))
if(migrRule.remOptions){const exts=migrRule.remOptions.join(", ")
str=migrRule.remOptions.length>1?`Suppression des extensions \'${exts}\'`:`Suppression de l\'extension \'${exts}\'`
subList.appendChild(JSX.createElement("li",null,str))}if(migrRule.addOptions){const exts=migrRule.addOptions.join(", ")
str=migrRule.remOptions.length>1?`Ajout des extensions \'${exts}\'`:`Ajout de l\'extension \'${exts}\'`
subList.appendChild(JSX.createElement("li",null,str))}if(migrRule.options){let extsArray=[]
migrRule.options.forEach(opt=>{extsArray.push(opt.matchKey)})
const exts=extsArray.join(", ")
str=extsArray.length>1?`Migration des extensions \'${exts}\'`:`Migration de l\'extension \'${exts}\'`
subList.appendChild(JSX.createElement("li",null,str))}}})}}}}}export class RemoveTrashedJobFactory extends RelaunchCidTaskBaseJobFactory{constructor(id="removeTrashedJob"){super(id)
this.setLabel("Suppression des documents en corbeille")
const jobBuilder=this.getJobBuilder()
jobBuilder.setPlanned("byUser").addBaseJobDatas({preconditions:"headInUrlTree&persistMeta(trashed,true)",stopAfterFailures:50,updatePersistMetas:[{action:"replace",key:"action",value:"remove"}]})}}RemoveTrashedJobFactory.SINGLETON=new RemoveTrashedJobFactory
export class RebuildEsIndexJobFactory extends RelaunchCidTaskBaseJobFactory{constructor(id="rebuildEsIndexJob"){super(id)
this.setLabel("Réindexation Elasticsearch")
const jobBuilder=this.getJobBuilder()
jobBuilder.setPlanned("byUser").addBaseJobDatas({stopAfterFailures:50,forceContentIndex:true,extractMetasFromContent:true})}}export class RemakeViewsJobFactory extends RelaunchCidTaskBaseJobFactory{constructor(id="remakeViewsJob"){super(id)
this._views=[]
this.setLabel("Reconstruction des vues des documents")
this.setDescription("Reconstruction en masse des vues des documents sélectionnés")
const jobBuilder=this.getJobBuilder()
jobBuilder.setPlanned("byUser").addBaseJobDatas({stopAfterFailures:50,overrideViews:[{redirectToPrevious:true}],forceContentIndex:true,extractMetasFromContent:true,postconditions:"atLeastOneViewForced",updatePersistMetas:[{action:"translate",key:"state",dict:{failure:"new"}}]}).addJobDialogAreas([ctx=>{let viewsDataSet={}
viewsDataSet["~.*"]={label:"Toutes les vues"}
viewsDataSet["~news"]={label:"Nouvelles vues uniquement"}
this._views.forEach(view=>{const name=view.name
viewsDataSet[view.selector.source]={label:`Vue '${name}'`}})
return new SelectArea("_views").setMultiple(true).setLabel("Vues").setDefaultValue(["~new"]).setDataset(viewsDataSet).setRequired(true)}]).addJobDataBuilder("overrideViews",async(datasPending,jobsParameters,ctx)=>{datasPending.overrideViews=[]
if(jobsParameters._views.includes("~.*")){datasPending.overrideViews.push({matchCodeView:".*",forceRemakeInMetas:true,builtBefore:Date.now()})}else if(jobsParameters._views.includes("~news")){datasPending.overrideViews.push({matchCodeView:".*",redirectToPrevious:true})}else{datasPending.overrideViews.push({matchCodeView:"^("+jobsParameters._views.join("|")+")$",forceRemakeInMetas:true,builtBefore:Date.now()})}datasPending._views=undefined},10)}addChoiceView(name,code){let selector
if(typeof code==="string")selector=new RegExp(LANG.escape4Regexp(code))
else selector=code
this._views.push({selector:selector,name:name})}async buildLongDescForJob(ctx,job,target){await super.buildLongDescForJob(ctx,job,target)
if(job&&job.jobProps&&job.jobProps[JobBuilderAction.UI_PROPS]){const uiProps=job.jobProps[JobBuilderAction.UI_PROPS]
let list=target.appendChild(JSX.createElement("ul",null))
if(uiProps._views){let viewsStr=[]
if(uiProps._views.includes("~.*")){viewsStr.push("toutes")}else if(uiProps._views.includes("~news")){viewsStr.push("nouvelles uniquement")}else{uiProps._views.forEach(selectorStr=>{const viewObj=this._views.find(entry=>entry.selector.source===selectorStr)
viewsStr.push(viewObj?viewObj.name:selectorStr)})}if(viewsStr.length>0){viewsStr=viewsStr.sort()
const views=viewsStr.join(", ")
const str=`Vue(s) : ${views}`
list.appendChild(JSX.createElement("li",null,str))}}}}}export class ContentAsNewJobFactory extends RelaunchCidTaskBaseJobFactory{constructor(id="remakeAllAsNewContentJob"){super(id)
this.setLabel("Reconstruction intégrale des documents")
this.setDescription("Reconstruction intégrale des documents, comme si son contenu avait été ré-importé")
const jobBuilder=this.getJobBuilder()
jobBuilder.setPlanned("byUser").addBaseJobDatas({stopAfterFailures:50,updateRawContent:{action:"oldRawContentAsNew"}})}}export class ReindexActLogsJobFactory extends UiJobFactory{constructor(id){super()
this.setUiJobSng([id])
this.setLabel(id)
this.setJobFactoryCode("reindexActLogs")
this.setJobBuilder(new JobBuilderAction(this).addJobDataValidity(async(props,ctx)=>true).addJobDialogAreas([ctx=>new InputArea("from").setInputType("date").setLabel("Depuis").setRequired(false),ctx=>new InputArea("to").setInputType("date").setLabel("Au").setRequired(false)]))}}
//# sourceMappingURL=jobs.js.map