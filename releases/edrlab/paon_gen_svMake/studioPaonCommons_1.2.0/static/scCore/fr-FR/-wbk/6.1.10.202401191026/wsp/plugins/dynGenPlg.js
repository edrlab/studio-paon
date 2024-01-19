import{SimpleTagArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
export function initApp(reg=REG.reg){const d=desk
d.addAppBuilder(new DynGenAppBuilder(reg))}class DynGenAppBuilder extends SimpleTagArea{constructor(reg){super("wsp-dyngen-app",reg.env.resolver.resolve(":back:wsp/apps/dynGenApp.js"))
this.reg=reg}isAppDefMatch(data){return typeof data.dynGen==="object"}newElt(ctx){if(!ctx.skin)ctx.skin=this.skin
if(!ctx.skinOver)ctx.skinOver=this.skinOver
ctx.reg=this.reg
return super.newElt(ctx).initialize(ctx)}}
//# sourceMappingURL=dynGenPlg.js.map