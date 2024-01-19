import{FocusItem,SrcAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{TASK}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/lcTask.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
export class FocusTask extends FocusItem{constructor(){super("focusTask")
this._label="Afficher cette tâche"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/showItem.svg"
this._group="open"
this.exactOne=true
this.isNotRemoved=false
this.families=["task"]}}FocusTask.SINGLETON=new FocusTask
REG.reg.registerSvc("tasks/focusTaskAction",1,FocusTask.SINGLETON)
export class DeleteTask extends SrcAction{constructor(){super("delSrc")
this._label="Supprimer"
this._group="edit"
this.atLeastOne=true
this._enableSrcPerms=["write.task.delete"]
this.families=["task"]}async execute(ctx,ev){let ok
if(ctx.shortDescs.length===1){const uri=ctx.shortDescs[0].srcUri
const name=ITEM.getSrcMainName(ctx.reg,ctx.shortDescs[0],ctx.reg.env.wsp.wspMetaUi)
ok=await POPUP.confirm(`Supprimer DÉFINITIVEMENT cette tâche \"${name}\" ?`,ctx.emitter)}else{const length=ctx.shortDescs.length
ok=await POPUP.confirm(`Supprimer DÉFINITIVEMENT ces ${length} tâches ?`,ctx.emitter)}if(ok){try{await TASK.deleteTask(ctx.reg.env.wsp,ctx.emitter,ctx.shortDescs.map(entry=>entry.srcId))}catch(e){await ERROR.report("Une erreur est survenue lors de la suppression.",e,ctx)}}}}DeleteTask.SINGLETON=new DeleteTask
REG.reg.registerSvc("tasks/deleteTaskAction",1,DeleteTask.SINGLETON)

//# sourceMappingURL=taskActions.js.map