import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
export class ChainAction extends Action{isEnabled(ctx){if(this.checkCompatKey&&!Desk.checkCompat(this.checkCompatKey))return false
if(!ctx.reg||!ctx.reg.env||!ctx.reg.env.universe)return false
return super.isEnabled(ctx)}isVisible(ctx){if(this.isBackendDb&&ctx.reg.env.universe.config.backEnd==="fs")return false
if(this.isBackendFs&&ctx.reg.env.universe.config.backEnd==="odb")return false
return super.isVisible(ctx)}getDescription(ctx){if(this.checkCompatKey&&!Desk.checkCompat(this.checkCompatKey))return"Ce navigateur n\'est pas compatible avec cette fonction"
return super.getDescription(ctx)}openWspAfterCreate(ctx,newWsp){if(newWsp&&ctx.openWspAfterCreate!==false){const reg=ctx.reg
if(!reg.getUserData("wspAppPrefered")&&reg.hasPerm("ui.wspDocApp")){desk.findAndOpenApp({u:reg.env.universe.getId(),wspDoc:newWsp.code})}else if(reg.hasPerm("ui.wspApp")){desk.findAndOpenApp({u:reg.env.universe.getId(),wsp:newWsp.code})}}}}export class CreateWspAction extends ChainAction{constructor(id){super(id||"createWsp")
this.checkCompatKey="formElt"
this._description=this._label="Créer un atelier..."
this._group="add"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/wspCreate.svg")
this.requireEnabledPerm("action.chain#create.wsp")}async execute(ctx,ev){const reg=ctx.reg
const{WspCreateProps:WspCreateProps}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/wspProps.js")
const wsp=await POPUP.showDialog((new WspCreateProps).initialize({reg:reg.env.universe.reg}),ctx.reg.env.uiRoot,{titleBar:{barLabel:{label:"Création d\'un atelier"},closeButton:{}},resizer:{},initWidth:"45em",initHeight:"70vh",viewPortX:"middle",viewPortY:"middle"}).onNextClose()
this.openWspAfterCreate(ctx,wsp)
return wsp}}CreateWspAction.SINGLETON=new CreateWspAction
export class ImportWspAction extends ChainAction{constructor(id){super(id||"importWsp")
this.checkCompatKey="formElt"
this._label="Importer un atelier..."
this._description="Import d\'un atelier à partir d\'une archive (.scwsp, .scar)"
this._group="add"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/wspImport.svg")
this.requireEnabledPerm("action.chain#import.wsp")}async execute(ctx,ev){const reg=ctx.reg
const{WspCreateFromScwspProps:WspCreateFromScwspProps}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/wspProps.js")
const wsp=await POPUP.showDialog((new WspCreateFromScwspProps).initialize({reg:ctx.reg}),ctx.reg.env.uiRoot,{titleBar:{barLabel:{label:"Import d\'un atelier à partir d\'une archive"},closeButton:{}},resizer:{},viewPortX:"middle",viewPortY:"middle",fixSize:false}).onNextClose()
this.openWspAfterCreate(ctx,wsp)
return wsp}}ImportWspAction.SINGLETON=new ImportWspAction
export class ManageWspsAction extends ChainAction{constructor(id){super(id||"manageWsps")
this.checkCompatKey="formElt"
this._label="Gérer les ateliers..."
this._group="manage"
this.requireEnabledPerm("action.chain#manage.wsps")}async execute(ctx,ev){const{WspsMgr:WspsMgr}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/wspsMgr.js")
await POPUP.showDialog((new WspsMgr).initialize({reg:ctx.reg}),ctx.reg.env.uiRoot,{closeOnCtrlEnter:true,titleBar:{barLabel:{label:"Gestion des ateliers"},closeButton:{}},resizer:{},initWidth:"min(90vw,60em)",initHeight:"90vh"}).onNextClose()}}
//# sourceMappingURL=chainActions.js.map