import{SimpleTagArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
export function initApp(reg=REG.reg){const d=desk
d.addAppBuilder(new ItemEdAppBuilder(reg))}export class ItemEdAppBuilder extends SimpleTagArea{constructor(reg){super("wsp-item-ed-app",reg.env.resolver.resolve(":back:wsp/apps/itemEdApp.js"))
this.reg=reg}isAppDefMatch(data){return typeof data.itemEd==="object"}newElt(ctx){if(this.edConfig)Object.assign(ctx,this.edConfig)
ctx.reg=this.reg
return super.newElt(ctx).initialize(ctx)}}
//# sourceMappingURL=itemEdPlg.js.map