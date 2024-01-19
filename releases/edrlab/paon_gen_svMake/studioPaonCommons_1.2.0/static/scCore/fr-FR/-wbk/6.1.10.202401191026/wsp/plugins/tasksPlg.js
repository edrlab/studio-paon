import{Action,ActionHackCtx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{SimpleTagArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/plugins/plugins_Perms.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
export function initApp(reg=REG.reg){if(reg.env.universe.config.backEnd==="fs")return
class WrapReg extends ActionHackCtx{constructor(sub,reg){super(sub)
this.reg=reg}wrapCtx(ctx){return this.reg}initButtonNode(buttonNode,ctx){buttonNode.reg=this.reg
this.sub.initButtonNode(buttonNode,this.reg)}}function wrap(action){return new WrapReg(action,reg)}const d=desk
d.addAppBuilder(new TaskAppBuilder(reg))
const tasksAction=wrap(new Action("tasks").setLabel("Mes tâches").setSkinOver("appframeHeader_tasks").requireVisiblePerm("ui.tasksPlg").override("initButtonNode",(function(buttonNode,ctx){buttonNode.setAttribute("role","menu")})))
tasksAction.execute=async(ctx,ev)=>{const{MyTasksRepos:MyTasksRepos}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/myTasksRepos.js")
const myTasks=(new MyTasksRepos).initialize({reg:reg})
POPUP.showMenu(myTasks,ev.target,ev.target)}
REG.reg.addToList("appframe:header:toolbar","tasks",1,tasksAction)}export class TaskAppBuilder extends SimpleTagArea{constructor(reg){super("wsp-task-app",reg.env.resolver.resolve(":back:wsp/apps/taskApp.js"))
this.reg=reg}isAppDefMatch(data){return typeof data.task==="string"}newElt(ctx){if(!ctx.skin)ctx.skin=this.skin
if(!ctx.skinOver)ctx.skinOver=this.skinOver
ctx.reg=this.reg
return super.newElt(ctx).initialize(ctx)}}
//# sourceMappingURL=tasksPlg.js.map