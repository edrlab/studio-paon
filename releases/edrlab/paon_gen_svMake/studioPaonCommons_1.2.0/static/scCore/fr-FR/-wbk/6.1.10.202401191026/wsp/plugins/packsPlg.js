import{Action,ActionHackCtx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/plugins/plugins_Perms.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{SkinPacksMgr,WspPacksMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/packsMgr.js"
export function initApp(reg=REG.reg){class WrapReg extends ActionHackCtx{constructor(sub,reg){super(sub)
this.reg=reg}wrapCtx(ctx){return this.reg}initButtonNode(buttonNode,ctx){buttonNode.reg=this.reg
this.sub.initButtonNode(buttonNode,this.reg)}}function wrap(action){return new WrapReg(action,reg)}REG.reg.addToList("appframe:header:toolbar:params","wsppacks",1,wrap((new OpenPackMgr).requireVisiblePerm("ui.wspPacksMgr")),10)
REG.reg.addToList("appframe:header:toolbar:params","skinpacks",1,wrap((new OpenSkinMgr).requireVisiblePerm("ui.skinPacksMgr")),11)}export class OpenPackMgr extends Action{constructor(){super("packMgr")
this._label="Modèles documentaires..."
this._group="packs"}async execute(ctx,ev){const MOD=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/packsMgr.js")
const ct=(new MOD.WspPacksMgr).initialize({reg:ctx.reg,universes:regUniversesList(ctx.reg)})
await POPUP.showDialog(ct,null,{titleBar:{barLabel:{label:"Modèles documentaires"},closeButton:{}},resizer:{},viewPortX:"middle",viewPortY:"middle",initWidth:"max(60em, 40vw)",initHeight:"70vh"}).onNextClose()}isVisible(ctx){if(!super.isVisible(ctx))return false
return WspPacksMgr.isAvailable(regUniversesList(ctx.reg))}}export class OpenSkinMgr extends Action{constructor(){super("skinMgr")
this._label="Habillages graphiques des modèles..."
this._group="packs"}async execute(ctx,ev){const MOD=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/packsMgr.js")
const ct=(new MOD.SkinPacksMgr).initialize({reg:ctx.reg,universes:regUniversesList(ctx.reg)})
await POPUP.showDialog(ct,null,{titleBar:{barLabel:{label:"Habillages graphiques des modèles"},closeButton:{}},resizer:{},viewPortX:"middle",viewPortY:"middle",initWidth:"max(60em, 40vw)",initHeight:"70vh"}).onNextClose()}isVisible(ctx){if(!super.isVisible(ctx))return false
return SkinPacksMgr.isAvailable(regUniversesList(ctx.reg))}}function regUniversesList(reg){return reg.getList("plg:packs:universes")}
//# sourceMappingURL=packsPlg.js.map