import{Action,ActionHackCtx,ActionMenuDep}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{AreaAsync,SimpleTagArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/plugins/plugins_Perms.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
export function initApp(reg=REG.reg,params){const d=desk
const plgCode=reg.getPref("plg.code","xDepot")
const plgName=reg.getPref("plg.name")||"Dépôt"
const plgUniverseCode=reg.env.universe.getId()
const actions=[]
if(params.desk){d.addAppBuilder(new DepotDeskAppBuilder(reg))
actions.push(new Action("desk").setLabel(params.desk.label||"Gestion").requireVisiblePerm("ui.depotPlg.desk").setExecute((ctx,ev)=>{d.findAndOpenApp({u:plgUniverseCode,dptPath:""},ev)}))}if(params.urlTree){d.addAppBuilder(new UrlTreeAppBuilder(reg))
if(params.urlTree.label!=null)actions.push(new Action("urlTree").setLabel(params.urlTree.label||"Consultation").requireVisiblePerm("ui.depotPlg.urlTree").setExecute((ctx,ev)=>{d.findAndOpenApp({u:plgUniverseCode,utPath:""},ev)}))}class WrapReg extends ActionHackCtx{constructor(sub,reg){super(sub)
this.reg=reg}wrapCtx(ctx){return this.reg}initButtonNode(buttonNode,ctx){buttonNode.reg=this.reg
this.sub.initButtonNode(buttonNode,this.reg)}}let main
if(actions.length>1){main=(new ActionMenuDep).setLabel(plgName).setActions(actions.map(a=>new WrapReg(a,reg)))}else if(actions[0]){main=actions[0].setLabel(plgName)}if(main)REG.reg.addToList("appframe:header:toolbar","depot_"+plgCode,1,new WrapReg(main,reg))}export class UrlTreeAppBuilder extends SimpleTagArea{constructor(reg){super("store-urltree-app",reg.env.resolver.resolve(":back:store/apps/urlTreeApp.js"))
this.reg=reg}isAppDefMatch(data){return typeof data.utPath==="string"&&data.u===this.reg.env.universe.getId()}newElt(ctx){if(!ctx.skin)ctx.skin=this.skin
if(!ctx.skinOver)ctx.skinOver=this.skinOver
ctx.reg=this.reg
return super.newElt(ctx).initialize(ctx)}}export class DepotDeskAppBuilder extends SimpleTagArea{constructor(reg){super("store-depotdesk-app",reg.env.resolver.resolve(":back:store/apps/depotDeskApp.js"))
this.reg=reg}isAppDefMatch(data){return"dptPath"in data&&data.u===this.reg.env.universe.getId()}newElt(ctx){return super.newElt(ctx).initialize({reg:this.reg,skin:this.skin,skinOver:this.skinOver,appDef:ctx.appDef,lastDatas:ctx.lastDatas,boards:this.reg.getList("depot:desk:boards")||[new BrowseBoardArea]})}}class BrowseBoardArea extends AreaAsync{constructor(){super("browseBoard")
this._label="Arborescence"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/views/browseBoard/home.svg"
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/browseBoard.js"))}buildBody(ctx,lastDatas){if(ctx.reg.isClosed)return null
const init={reg:ctx.reg,lastDatas:lastDatas}
return JSX.createElement("store-browse-board",{"î":init})}}
//# sourceMappingURL=depotPlg.js.map