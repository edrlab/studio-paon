import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/dialogs_Perms.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/actions/actions_Perms.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{MsgOver}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{EJobStatus,EXECUTOR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/executor.js"
import{JobPlanificatorInput,JobPriorizationInput}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/jobsInput.js"
export class JobsAction extends Action{constructor(){super(...arguments)
this.mode=null
this.requiredStatus=null}setMode(mode){this.mode=mode}setRequiredStatus(status){this.requiredStatus=status}isVisible(ctx){if(!ctx.reg)return false
if(!ctx.jobs||ctx.jobs.length==0)return false
if(this.requiredStatus)if(ctx.jobs.find(entry=>!this.requiredStatus.includes(entry.lastStatus)))return false
if(this.mode==="multi"&&ctx.jobs.length===1)return false
if(this.mode==="mono"&&ctx.jobs.length!==1)return false
return super.isVisible(ctx)}isEnabled(ctx){return super.isEnabled(ctx)}static async executeForEachJobs(jobs,action,waitMsg,errorMsg){let msg=new MsgOver
return msg.setCustomMsg(waitMsg,"info").showMsgOver(window.document.body).waitFor(new Promise(async(resolve,refuse)=>{try{if(jobs&&jobs.length>0){let countJobs=jobs.length
let errorsArray=[]
for(let ii=0;ii<countJobs;ii++){let job=jobs[ii]
let posJob=ii+1
if(jobs.length>1)msg.setCustomMsg(`${waitMsg}\nTraitement ${posJob} sur ${countJobs}...`)
else msg.setCustomMsg(waitMsg)
let isDeleted=await action(job.id)
if(!isDeleted)errorsArray.push(job.id)}if(errorsArray.length==0){resolve(true)}else{let errorsCount=errorsArray.length
let errors=errorsArray.join(", ")
refuse(ERROR.show(`${errorMsg} (${errorsCount}) : ${errors}.`))}}}catch(e){refuse(ERROR.report(`${errorMsg}. Veuillez réessayer ultérieurement.`,e))}}))}}export class ActionDeleteJobs extends JobsAction{constructor(id){super(id)
this._label=ctx=>{if(ctx.jobs&&ctx.jobs.length>1)return"Supprimer les traitements"
else return"Supprimer le traitement"}
this._description=ctx=>{if(ctx.jobs&&ctx.jobs.length>1)return"Suppression des traitements"
else return"Suppression du traitement"}
this._group="delete"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/delete.svg"
this.setRequiredStatus([EJobStatus.waiting,EJobStatus.done,EJobStatus.failed,EJobStatus.planned])
this.requireEnabledPerm("action.jobs#delete")}async execute(ctx,ev){let msg
if(ctx.jobs.length===1){let jobId=ctx.jobs[0].id
msg=`Voulez-vous vraiment supprimer le traitement \'${jobId}\' ?`}else{const usersCount=ctx.jobs.length
msg=`Voulez-vous vraiment supprimer les \'${usersCount}\' traitements ?`}if(await POPUP.confirm(msg,null,{okLbl:"Supprimer",cancelLbl:"Annuler"})){try{await JobsAction.executeForEachJobs(ctx.jobs,jobId=>EXECUTOR.deleteJob(ctx.reg.env.universe.executor,jobId),"Suppression en cours...","Suppression en échec")
let count=ctx.jobs.length
POPUP.showNotifWarning(ctx.jobs.length>1?`Les ${count} traitements ont bien été supprimés.`:`Le traitement a bien été supprimé.`,ctx.reg.env.uiRoot)
return true}catch(e){await ERROR.report(`La suppression n\'a pas pu aboutir. Veuillez réessayer ultérieurement.`,e)
return false}}}}ActionDeleteJobs.SINGLETON=new ActionDeleteJobs
export class ActionScheduleJobs extends JobsAction{constructor(id){super(id)
this._label=ctx=>{if(ctx.jobs&&ctx.jobs.length>1)return"(Re)planifier les traitements"
else return"(Re)planifier le traitement"}
this._description=ctx=>{if(ctx.jobs&&ctx.jobs.length>1)return"(Re)planification des traitements"
else return"(Re)planification du traitement"}
this._group="edit"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/actions/jobs/schedule.svg"
this.setRequiredStatus([EJobStatus.waiting,EJobStatus.done,EJobStatus.failed,EJobStatus.planned])
this.requireEnabledPerm("action.jobs#schedule")}isVisible(ctx){if(!ctx.reg.env.universe.executor.hasFeature("scheduling"))return false
return super.isVisible(ctx)}async execute(ctx,ev){let input=JSX.createElement(JobPlanificatorInput,null)
if(await POPUP.confirm(input,null,{okLbl:"(Re)planifier",cancelLbl:"Annuler",titleBar:{barLabel:{label:"Planification"}}})){try{let scheduleDate=input.value||{date:Date.now()}
await JobsAction.executeForEachJobs(ctx.jobs,jobId=>EXECUTOR.scheduleJob(ctx.reg.env.universe.executor,jobId,scheduleDate.date),"Enregistrement en cours...","Enregistrement en échec")
let count=ctx.jobs.length
POPUP.showNotifWarning(ctx.jobs.length>1?`Planification des ${count} traitements terminée.`:`Planification du traitement terminée.`,ctx.reg.env.uiRoot)
return true}catch(e){await ERROR.report(`La planification n\'a pas pu aboutir. Veuillez réessayer ultérieurement.`,e)
return false}}}}ActionScheduleJobs.SINGLETON=new ActionScheduleJobs
export class ActionForceExecuteJobs extends JobsAction{constructor(id){super(id)
this._label=ctx=>{if(ctx.jobs&&ctx.jobs.length>1)return"(Re)exécuter maintenant les traitements"
else return"(Re)exécuter maintenant le traitement"}
this._description=ctx=>{if(ctx.jobs&&ctx.jobs.length>1)return"Placer les traitements dans la pile d\'exécution"
else return"Placer le traitement dans la pile d\'exécution"}
this._group="edit"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/actions/jobs/execute.svg"
this.setRequiredStatus([EJobStatus.failed,EJobStatus.planned])
this.requireEnabledPerm("action.jobs#forceExecute")}async execute(ctx,ev){let msg
if(ctx.jobs.length===1){let jobId=ctx.jobs[0].id
msg=`Voulez-vous vraiment déplacer le traitement \'${jobId}\' dans la pile d\'exécution ?`}else{const count=ctx.jobs.length
msg=`Voulez-vous vraiment déplacer les \'${count}\' traitements dans la pile d\'exécution ?`}if(await POPUP.confirm(msg,null,{okLbl:"Exécuter",cancelLbl:"Annuler",titleBar:{barLabel:{label:"Pile d\'exécution"}}})){try{await JobsAction.executeForEachJobs(ctx.jobs,jobId=>EXECUTOR.forceExecuteJob(ctx.reg.env.universe.executor,jobId),"Planification immédiate en cours...","Planification immédiate en échec")
let count=ctx.jobs.length
POPUP.showNotifWarning(ctx.jobs.length>1?`Planification immédiate des ${count} traitements terminée.`:`Planification immédiate du traitement terminée.`,ctx.reg.env.uiRoot)
return true}catch(e){await ERROR.report(`La planification n\'a pas pu aboutir. Veuillez réessayer ultérieurement.`,e)
return false}}}}ActionForceExecuteJobs.SINGLETON=new ActionForceExecuteJobs
export class ActionMoveInQueueJobs extends JobsAction{constructor(id){super(id)
this._label=ctx=>{if(ctx.jobs&&ctx.jobs.length>1)return"Prioriser les traitements"
else return"Prioriser le traitement"}
this._description=ctx=>{if(ctx.jobs&&ctx.jobs.length>1)return"Modification de la priorité des traitements dans la pile d\'exécution"
else return"Modification de la priorité du traitement dans la pile d\'exécution"}
this._group="edit"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/actions/jobs/prioritization.svg"
this.setRequiredStatus([EJobStatus.waiting])
this.requireEnabledPerm("action.jobs#moveInQueue")}async execute(ctx,ev){let msg
let input=JSX.createElement(JobPriorizationInput,null)
if(await POPUP.confirm(input,null,{okLbl:"Enregistrer",cancelLbl:"Annuler",titleBar:{barLabel:{label:ctx.jobs.length>1?"Prioriser les traitements":"Prioriser le traitement"}}})){try{await JobsAction.executeForEachJobs(ctx.jobs,jobId=>EXECUTOR.moveJobInQueue(ctx.reg.env.universe.executor,jobId,input.value),"Priorisation en cours...","Priorisation en échec")
let count=ctx.jobs.length
POPUP.showNotifWarning(ctx.jobs.length>1?`Modification de la priorité des ${count} traitements terminée.`:`Modification de la priorité du traitement terminée.`,ctx.reg.env.uiRoot)
return true}catch(e){await ERROR.report(`La priorisation des traitements n\'a pas pu aboutir. Veuillez réessayer ultérieurement.`,e)
return false}}}}ActionMoveInQueueJobs.SINGLETON=new ActionMoveInQueueJobs

//# sourceMappingURL=jobsActions.js.map