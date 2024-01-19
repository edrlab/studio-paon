import{SimpleTagArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{LogsApp}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/apps/logsApp.js"
import{Action,ActionHackCtx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/plugins/plugins_Perms.js"
export function initApp(reg=REG.reg){class WrapReg extends ActionHackCtx{constructor(sub,reg){super(sub)
this.reg=reg}wrapCtx(ctx){return this.reg}initButtonNode(buttonNode,ctx){buttonNode.reg=this.reg
this.sub.initButtonNode(buttonNode,this.reg)}}function wrap(action){return new WrapReg(action,reg)}const d=desk
d.addAppBuilder(new LogsAppBuilder(reg))
REG.reg.addToList("appframe:header:toolbar:params:admin","logs",1,wrap((new Action).setLabel("Logs système").setExecute((function(ctx,event){desk.findAndOpenApp({logsUniverse:null})})).setVisible(ctx=>LogsApp.atLeastOneEntry(ctx.reg))),10)}class LogsAppBuilder extends SimpleTagArea{constructor(reg){super("logs-app",reg.env.resolver.resolve(":back:core/apps/logsApp.js"))
this.reg=reg}isAppDefMatch(data){return"logsUniverse"in data}newElt(ctx){if(!ctx.skin)ctx.skin=this.skin
if(!ctx.skinOver)ctx.skinOver=this.skinOver
ctx.reg=this.reg
return super.newElt(ctx).initialize(ctx)}}
//# sourceMappingURL=logsPlg.js.map