import{SimpleTagArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
export function initApp(reg=REG.reg){const d=desk
d.addAppBuilder(new ShowAppBuilder(reg))}class ShowAppBuilder extends SimpleTagArea{constructor(reg){super("show-app",reg.env.resolver.resolve(":back:core/apps/frameApp.js"))
this.reg=reg}isAppDefMatch(data){return typeof data.show==="object"&&(data.show.url!=""||data.show.alias!="")}newElt(ctx){if(!ctx.skinOver)ctx.skinOver=this.skinOver
if(!ctx.whiteDomains)ctx.whiteDomains=ctx.reg.getList("plg:show:domains:white")
if(!ctx.aliasUrls)ctx.aliasUrls=ctx.reg.getListAsMap("plg:show:alias:url")
ctx.reg=this.reg
return super.newElt(ctx).initialize(ctx)}}
//# sourceMappingURL=showPlg.js.map