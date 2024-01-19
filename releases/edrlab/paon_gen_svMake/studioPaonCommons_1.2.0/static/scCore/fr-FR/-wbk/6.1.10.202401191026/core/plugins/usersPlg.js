import{Action,ActionHackCtx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/plugins/plugins_Perms.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{EUserAspects}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
export function initApp(reg=REG.reg){class WrapReg extends ActionHackCtx{constructor(sub,reg){super(sub)
this.reg=reg}wrapCtx(ctx){return this.reg}initButtonNode(buttonNode,ctx){buttonNode.reg=this.reg
this.sub.initButtonNode(buttonNode,this.reg)}}function wrap(action){return new WrapReg(action,reg)}REG.reg.addToList("appframe:header:toolbar:params","users",1,wrap((new OpenUsersMgr).requireVisiblePerm("ui.usersPlg.users")),100)
REG.reg.addToList("appframe:header:toolbar:params","groups",1,wrap((new OpenGroupsMgr).requireVisiblePerm("ui.usersPlg.groups")),101)
REG.reg.addToList("appframe:header:toolbar:params","roles",1,wrap((new OpenRolesExplorer).requireVisiblePerm("ui.usersPlg.rolesExplorer")),200)}export class OpenUsersMgr extends Action{constructor(){super("usersMgr")
this._label="Gestion des utilisateurs..."
this._group="users"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/user.svg"}async execute(ctx,ev){const MOD=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/usersMgr.js")
const ct=(new MOD.UsersMgr).initialize({reg:ctx.reg,uiContext:"popup",preSelectAccount:ctx.preSelectAccount})
await POPUP.showDialog(ct,null,{titleBar:{barLabel:{label:"Gestion des utilisateurs"},closeButton:{}},resizer:{},initWidth:"max(80vw,50em)",initHeight:"90vh"}).onNextClose()}isVisible(ctx){if(!ctx.reg.env.universe.adminUsers)return false
return super.isVisible(ctx)}isEnabled(ctx){return super.isEnabled(ctx)}}export class OpenGroupsMgr extends Action{constructor(){super("usersMgr")
this._label="Gestion des groupes..."
this._group="users"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/group.svg"}async execute(ctx,ev){const MOD=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/usersMgr.js")
const ct=(new MOD.GroupsMgr).initialize({reg:ctx.reg,uiContext:"popup",preSelectAccount:ctx.preSelectAccount})
await POPUP.showDialog(ct,null,{titleBar:{barLabel:{label:"Gestion des groupes"},closeButton:{}},resizer:{},initWidth:"min(90vw,40em)",initHeight:"90vh"}).onNextClose()}isVisible(ctx){if(!ctx.reg.env.universe.adminUsers||!ctx.reg.env.universe.adminUsers.hasAspect(EUserAspects.groupable))return false
return super.isVisible(ctx)}isEnabled(ctx){return super.isEnabled(ctx)}}export class OpenRolesExplorer extends Action{constructor(){super("usersMgr")
this._label="Explorateur des rôles..."
this._description="Explorateur des rôles affectés des utilisateurs sur les différents composants applicatifs"
this._group="users"}async execute(ctx,ev){const MOD=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/rolesExplorer.js")
const ct=(new MOD.RolesExplorer).initialize({reg:ctx.reg,uiContext:"popup"})
await POPUP.showDialog(ct,null,{titleBar:{barLabel:{label:"Explorateur des rôles"},closeButton:{}},resizer:{},initWidth:"min(90vw,100em)",initHeight:"90vh"}).onNextClose()}isVisible(ctx){if(!ctx.reg.env.universe.adminUsers)return false
return super.isVisible(ctx)}isEnabled(ctx){return super.isEnabled(ctx)}}
//# sourceMappingURL=usersPlg.js.map