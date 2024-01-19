import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{MsgLabel,MsgOver}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{CDM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/cdm.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{EUserAspects}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/actions_Perms.js"
import{WSP,Wsp}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{WSPTYPE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspType.js"
import{WSP_DRV}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/drv.js"
import{WSP_DRF}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/drf.js"
import{ChainAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/chainActions.js"
export class WspAction extends ChainAction{isVisible(ctx){var _a
if(!((_a=ctx.reg)===null||_a===void 0?void 0:_a.env.wsp))return false
return super.isVisible(ctx)}}export class WspsAction extends Action{constructor(){super(...arguments)
this.onlyOnWsps=true}getWspRegs(ctx){let regs=[]
if(ctx.regs)ctx.regs.forEach(entry=>{if(entry.env.wsp)regs.push(entry)})
else if(!this.onlyOnWsps&&ctx.reg&&ctx.reg.env.wsp)regs.push(ctx.reg)
return regs.length>0?regs:null}isEnabled(ctx){if(this.checkCompatKey&&!Desk.checkCompat(this.checkCompatKey))return false
return super.isEnabled(ctx)}isVisible(ctx){let regs=this.getWspRegs(ctx)
if(!regs)return false
if(this.isBackendDb&&regs.findIndex(reg=>reg.env.wsp.backEnd==="fs")==-1)return false
if(this.isBackendFs&&regs.findIndex(reg=>reg.env.wsp.backEnd==="odb")==-1)return false
return super.isVisible(ctx)}getDescription(ctx){if(this.checkCompatKey&&!Desk.checkCompat(this.checkCompatKey))return"Ce navigateur n\'est pas compatible avec cette fonction"
return super.getDescription(ctx)}checkObjectRootVisiblePerm(ctx,perms,and){if(!perms)perms=this._visPerms
let regs=this.getWspRegs(ctx)
if(perms&&regs&&regs.findIndex(reg=>!reg.hasPerm(perms,reg.securityCtx),and)>-1)return false
return true}checkObjectRootPerm(ctx,perms,and){if(!perms)perms=this._enablePerms
let regs=this.getWspRegs(ctx)
if(perms&&regs&&regs.findIndex(reg=>!reg.hasPerm(perms,reg.securityCtx),and)>-1)return false
return true}}export class ScanFsUpdatesAction extends WspAction{constructor(){super()
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/refresh.svg"
this._label="Rafraîchir l\'atelier"
this._description="Détecte les changements de l\'atelier réalisés directement dans le système de fichier."}isInstantiable(ctx){return ctx.reg.env.universe.config.backEnd==="fs"}execute(ctx,ev){const progress=POPUP.showProgress(ctx.reg.env.uiRoot,"Recherche des changements...")
return ctx.reg.env.universe.wspServer.config.adminWspFsUrl.fetchVoid(IO.qs("cdaction","ScanFsUpdates","param",ctx.reg.env.wsp.code)).finally(()=>progress.close())}}export class ExportWspAction extends WspAction{constructor(id){super(id||"exportWsp")
this._label="Exporter une archive de l\'atelier (.scwsp)"
this._group="importExport"
this._enablePerms="read.node.export"}execute(ctx,ev){const wsp=ctx.reg.env.wsp
const name=IO.getValidFileName(wsp.wspTitle,".scwsp","dateTime")
const url=ctx.reg.env.universe.config.wsps.exportUrl.resolve(IO.qs("cdaction","Export","param",wsp.code,"format","jar","scope","node","mode","wspTree","refUris","","downloadFileName",name)).url
const a=JSX.createElement("a",{href:url,download:name})
a.click()}}export class OpenPropsWspAction extends WspAction{constructor(id){super(id||"openWspProps")
this.checkCompatKey="formElt"
this._label="Propriétés de l\'atelier..."
this._description="Afficher les propriétés de l\'atelier"
this._group="wsp"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/wspProps.svg")
this.requireEnabledPerm("action.wsp#read.props")}async execute(ctx,ev){const reg=ctx.reg
const{WspEditProps:WspEditProps}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/wspProps.js")
const wspTitle=reg.env.wsp.wspTitle
await POPUP.showDialog((new WspEditProps).initialize({reg:ctx.reg}),ctx.reg.env.uiRoot,{titleBar:{barLabel:{label:wspTitle?`Atelier \'${wspTitle}\'`:`Propriétés`},closeButton:{}},resizer:{},initWidth:"min(90vw,60em)",initHeight:"90vh"}).onNextClose()}}OpenPropsWspAction.SINGLETON=new OpenPropsWspAction
export class OpenPropsWspsAction extends WspsAction{constructor(id){super(id||"openPropsWspsModel")
this.checkCompatKey="formElt"
this._label="Éditer les propriétés des ateliers..."
this._description="Éditer les propriétés des ateliers"
this._group="wsp"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/wspEditModel.svg")
this.requireEnabledPerm("action.wsp#update.wsptype")}async execute(ctx,ev){const{WspsEditModelProps:WspsEditModelProps}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/wspProps.js")
await POPUP.showDialog((new WspsEditModelProps).initialize(ctx),ev.composedPath()[0],{titleBar:{barLabel:{label:"Édition des propriétés des ateliers"},closeButton:{}},resizer:{},viewPortX:"middle",viewPortY:"middle",initWidth:"50vw",initHeight:"60vh"}).onNextClose()}}OpenPropsWspsAction.SINGLETON=new OpenPropsWspsAction
export class AutoMigrWspAction extends WspAction{constructor(id){super(id||"AautoMigrWsp")
this._label="Migrer l\'atelier..."
this._description="Migrer les contenus de l\'atelier"
this._group="wsp"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/wspMigr.svg")
this.requireEnabledPerm("action.wsp#migrate")}isVisible(ctx){var _a,_b,_c
if((_a=ctx.reg.env.wsp)===null||_a===void 0?void 0:_a.migrating)return false
let infoWsp=((_b=ctx.reg.env.wsp)===null||_b===void 0?void 0:_b.infoWsp)||((_c=ctx.reg.env.wsp)===null||_c===void 0?void 0:_c.infoWspError)
if(!(infoWsp===null||infoWsp===void 0?void 0:infoWsp.isMigrationNeeded))return false
return super.isVisible(ctx)}async execute(ctx,ev){const reg=ctx.reg
const wspTitle=reg.env.wsp.wspTitle
const msg=`Voulez-vous exécuter la migration des contenus de l\'atelier \'${wspTitle}\' ?`
if(await POPUP.confirm(JSX.createElement("div",null,JSX.createElement("div",null,msg),JSX.createElement("div",null,JSX.createElement("b",null,"Vous ne pourrez pas annuler cette action."))),reg.env.uiRoot,{okLbl:"Migrer les contenus",cancelLbl:"Annuler"})){try{let wspMetaEditorDom=await WSPTYPE.getUpdateEditor(ctx.reg.env.universe.wspServer,ctx.reg.env.wsp.code)
let vUnknownModels=[]
let wspTypeInst={wspOptions:[]}
let wspTypeDef=wspMetaEditorDom.querySelector("wspTypeDef[newest], wspTypeDef[selected]:not([obsolete])")
if(wspTypeDef){wspTypeInst.wspType={key:wspTypeDef.getAttribute("key"),lang:wspTypeDef.getAttribute("lang"),version:wspTypeDef.getAttribute("version"),title:wspTypeDef.getAttribute("title"),uri:wspTypeDef.getAttribute("uri")}
if(wspTypeDef.getAttribute("unknown"))vUnknownModels.push(wspTypeInst.wspType.title)
let wspOptionsDef=wspMetaEditorDom.querySelectorAll("wspOptionDef[newest], wspOptionDef[selected]:not([obsolete])")
wspOptionsDef.forEach(wspOptionDef=>{wspTypeInst.wspOptions.push({key:wspOptionDef.getAttribute("key"),lang:wspOptionDef.getAttribute("lang"),version:wspOptionDef.getAttribute("version"),title:wspOptionDef.getAttribute("title"),uri:wspOptionDef.getAttribute("uri"),unknown:wspOptionDef.getAttribute("unknown")})
if(wspOptionDef.getAttribute("unknown"))vUnknownModels.push(wspOptionDef.getAttribute("title"))})
if(vUnknownModels.length){const unknownList=vUnknownModels.join(", ")
POPUP.showNotifError(`La migration de l\'atelier \'${wspTitle}\' ne peut avoir lieu car certaines extensions sont actuellement inconnues : \"${unknownList}\".\nVeuillez choisir le modèle cible et ses extensions.`,reg.env.uiRoot)}else{await reg.env.wsp.updateWspType(wspTypeInst,true)}}else await POPUP.showNotifError("La cible de migration n\'a pas pu être déterminée. Veuillez ajuster le modèle documentaire de l\'atelier via la fenêtre d\'édition des propriétés.",reg.env.uiRoot,{noCloseBtn:true})}catch(e){await ERROR.report(`La migration de l\'atelier \'${wspTitle}\' n\'a pas pu aboutir. Veuillez réessayer ultérieurement.`,e)}}}}export class OpenPermsWspAction extends WspAction{constructor(id){super(id||"openPermsWsp")
this.checkCompatKey="formElt"
this._label="Permissions sur l\'atelier..."
this._description="Définir les permissions de cet atelier"
this._group="wsp"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/wspPerms.svg")
this.requireEnabledPerm(["action.wsp#set.perms","admin.node.configRoles.byAdmin"])
this.setVisible(ctx=>{var _a
return((_a=ctx.reg.env.universe.adminUsers)===null||_a===void 0?void 0:_a.hasAspect(EUserAspects.rolable))?true:false})}async execute(ctx,ev){const reg=ctx.reg
const{ObjRolesMapEdit:ObjRolesMapEdit}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/objRolesMap.js")
const wspTitle=reg.env.wsp.wspTitle
await POPUP.showDialog((new ObjRolesMapEdit).initialize({reg:ctx.reg,uiContext:"popup",rolesUiLayerSng:"wsp",preSelectAccounts:ctx.preSelectAccounts,objThis:ctx,objEditRolesMap:(objThis,rolesMap)=>WSP.srcSetRoles(ctx.reg.env.wsp,ctx.reg.env.uiRoot,"",rolesMap),objEditRolesMapPerms:["action.wsp#set.perms","admin.node.configRoles.byAdmin"],objFetchRolesMap:objThis=>WSP.srcGetRoles(ctx.reg.env.wsp,ctx.reg.env.uiRoot,""),objFetchRolesMapForAccounts:(objThis,pAccounts)=>WSP.srcGetRolesForAccounts(ctx.reg.env.wsp,ctx.reg.env.uiRoot,"",pAccounts)}),ctx.reg.env.uiRoot,{titleBar:{barLabel:{label:wspTitle?`Permissions définies sur l\'atelier \'${wspTitle}\'`:`Permissions définies sur l\'atelier`},closeButton:{}},resizer:{},initWidth:"40em",initHeight:"40em"}).onNextClose()}}OpenPermsWspAction.SINGLETON=new OpenPermsWspAction
export class DeleteWspAction extends WspAction{constructor(id){super(id||"deleteWsp")
this._label="Supprimer l\'atelier..."
this._description="Supprimer l\'atelier"
this._group="del"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/wspDelete.svg")
this.requireEnabledPerm("action.wsp#delete")}async execute(ctx,ev){const{WspRemoveProps:WspRemoveProps}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/wspProps.js")
return await POPUP.showDialog((new WspRemoveProps).initialize(ctx),ctx.reg.env.uiRoot,{titleBar:{barLabel:{label:"Suppression d\'un atelier"},closeButton:{}},resizer:{},viewPortX:"middle",viewPortY:"middle",fixSize:false}).onNextClose()}}DeleteWspAction.SINGLETON=new DeleteWspAction
export class DeleteWspsAction extends WspsAction{constructor(id){super(id||"deleteWsp")
this._label="Supprimer les ateliers..."
this._description="Supprimer les ateliers"
this._group="del"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/wspDelete.svg")
this.requireEnabledPerm("action.wsp#delete")}async execute(ctx,ev){const{WspsRemoveProps:WspsRemoveProps}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/wspProps.js")
await POPUP.showDialog((new WspsRemoveProps).initialize(ctx),ev.composedPath()[0],{titleBar:{barLabel:{label:"Suppression d\'ateliers"},closeButton:{}},resizer:{},viewPortX:"middle",viewPortY:"middle",initWidth:"50vw",initHeight:"60vh"}).onNextClose()}}DeleteWspsAction.SINGLETON=new DeleteWspsAction
export class DeletePermanentlyWspsAction extends WspsAction{constructor(id){super(id||"deletePermanentlyWsps")
this.setLabel(ctx=>{let count=ctx.regs?ctx.regs.length:ctx.reg?1:0
return count>1?`Supprimer définitivement les ${count} ateliers`:"Supprimer définitivement l\'atelier"})
this._group="adminWsp"
this.onlyOnWsps=false
this.requireEnabledPerm("action.wsp#deletePermanently")
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/wspDeletePermanently.svg")}async execute(ctx,ev){const{WspsRemovePermanentlyProps:WspsRemovePermanentlyProps}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/wspProps.js")
await POPUP.showDialog((new WspsRemovePermanentlyProps).initialize({regs:this.getWspRegs(ctx),reg:ctx.reg}),ev.composedPath()[0],{titleBar:{barLabel:{label:"Suppression définitive d\'ateliers"},closeButton:{}},resizer:{},viewPortX:"middle",viewPortY:"middle",initWidth:"50vw",initHeight:"60vh"}).onNextClose()}}DeletePermanentlyWspsAction.SINGLETON=new DeletePermanentlyWspsAction
REG.reg.registerSkin("c-wsps-action",1,`\n\twsps-monitoring {\n\t\tmargin: 0 2em;\n\t\tmax-height: 15em;\n\t\toverflow: auto;\n\t}\n`)
export class RestoreWspsAction extends WspsAction{constructor(id){super(id||"restoreWsps")
this.setLabel(ctx=>{let count=ctx.regs?ctx.regs.length:ctx.reg?1:0
return count>1?`Restaurer les ${count} ateliers`:"Restaurer l\'atelier"})
this._group="adminWsp"
this.onlyOnWsps=false
this.requireEnabledPerm("action.wsp#restore")
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/wspRestore.svg")}async execute(ctx,ev){let wspTitleErrosArray=[]
let dialog
try{let regs=this.getWspRegs(ctx)
let wsps=[]
regs.forEach(entry=>{wsps.push(entry.env.wsp)})
wsps=WSP.sortWspsByDeep(wsps)
let count=wsps.length
let mandatWspsTitles=[]
if(wsps.find(wsp=>(wsp.infoWsp||wsp.infoWspError).props.drvMasterWsp||(wsp.infoWsp||wsp.infoWspError).props.drfRefWsp?true:false)){await Promise.all(wsps.map(async wsp=>{let parentWspCd=(wsp.infoWsp||wsp.infoWspError).props.drvMasterWsp||(wsp.infoWsp||wsp.infoWspError).props.drfRefWsp
if(parentWspCd){let parentWsp=new Wsp(ctx.reg.env.universe.wspServer,parentWspCd)
await parentWsp.waitForLoad()
if(parentWsp.isDeleted&&!wsps.find(wsp=>wsp.code===parentWspCd))mandatWspsTitles.push(parentWsp.wspTitle)}}))}if(mandatWspsTitles.length>0){let list=mandatWspsTitles.join(", ")
await ERROR.show(`Les ateliers suivants doivent être restaurés au préalable : \'${list}\'.`)
return false}if(await POPUP.confirm(count>1?`Voulez-vous vraiment restaurer les \'${count}\' ateliers ?`:"Voulez-vous vraiment restaurer l\'atelier ?",window.document,{cancelLbl:"Annuler",okLbl:"Restaurer"})){const{WspsMonitoring:WspsMonitoring}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/wsp/wspsMonitoring.js")
const wspsMonitoring=JSX.createElement(WspsMonitoring,{"î":{wsps:wsps,defaultStateKey:"notStart",states:[{key:"notStart",level:"disabled",label:"En attente"},{key:"toRemove",level:"disabled",label:"À restaurer"},{key:"pending",level:"pending",label:"En cours..."},{key:"restored",level:"success",label:"Restauré"},{key:"failed",level:"error",label:"Échec"}]}})
dialog=POPUP.showDialog(JSX.createElement("div",null,JSX.createElement(MsgLabel,{label:"Restauration en cours..."}),wspsMonitoring),window.document,{skinOver:"c-wsps-action",fixSize:false,titleBar:null,initWidth:"50%"})
let errorsArray=[]
for(const entry in wsps){let wsp=wsps[entry]
wspsMonitoring.updateWspStatus(wsp.code,"pending")
try{await wsp.restore()
wspsMonitoring.updateWspStatus(wsp.code,"restored")
await new Promise(resolve=>setTimeout(resolve,1e3))}catch(e){wspsMonitoring.updateWspStatus(wsp.code,"failed")
wspTitleErrosArray.push(wsp.wspTitle)
errorsArray.push(e)}}await new Promise(resolve=>setTimeout(resolve,errorsArray.length>0?3e3:1e3))
if(errorsArray.length>0)throw errorsArray
return true}}catch(e){let list=wspTitleErrosArray.join(", ")
await ERROR.report(list?"Restauration des ateliers en échec.":`Restauration des ateliers ${list} en échec.`,e)
return true}finally{if(dialog)dialog.close()}}}RestoreWspsAction.SINGLETON=new RestoreWspsAction
export class RemoveCacheWspAction extends WspAction{constructor(id){super(id||"removeCacheWsp")
this._label="Vider le cache de l\'atelier"
this._description="Cache des transformations de ressources..."
this._group="adminWsp"
this.requireEnabledPerm("action.wsp#removeCache")}async execute(ctx,ev){try{(new MsgOver).setCustomMsg("Suppression du cache de l\'atelier en cours...").showMsgOver(ctx.reg.env.uiRoot||window.document.documentElement).waitFor(WSP.removeCache(ctx.reg.env.wsp))}catch(e){await ERROR.report(`La suppression du cache n\'a pas pu aboutir. Veuillez réessayer ultérieurement.`,e)}}}RemoveCacheWspAction.SINGLETON=new RemoveCacheWspAction
export class ReloadWspAction extends WspAction{constructor(id){super(id||"reloadWsp")
this._label="Recharger l\'atelier"
this._group="adminWsp"
this.requireEnabledPerm("action.wsp#reload")}async execute(ctx,ev){try{(new MsgOver).setCustomMsg("Rechargement de l\'atelier en cours...").showMsgOver(ctx.reg.env.uiRoot||window.document.documentElement).waitFor(WSP.reloadWsp(ctx.reg.env.wsp))}catch(e){await ERROR.report(`Le chargement de l\'atelier n\'a pas pu aboutir. Veuillez réessayer ultérieurement.`,e)}}}ReloadWspAction.SINGLETON=new ReloadWspAction
export class CreateWspFromWspAction extends WspAction{constructor(id){super(id||"createWspFromWsp")
this.checkCompatKey="formElt"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/wspCreateFromWsp.svg")
this.requireEnabledPerm("action.chain#create.wsp")}getLabel(ctx){let wspTitle=ctx.reg.env.wsp.wspTitle
return`Dupliquer la configuration de l\'atelier \'${wspTitle}\'...`}getDescription(ctx){let wspTitle=ctx.reg.env.wsp.wspTitle
return`Créer un atelier à partir de la configuration de l\'atelier ${wspTitle}\'...`}async execute(ctx,ev){const reg=ctx.reg
const{WspCreateProps:WspCreateProps}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/wspProps.js")
const wsp=await POPUP.showDialog((new WspCreateProps).initialize({reg:reg}),ctx.reg.env.uiRoot,{titleBar:{barLabel:{label:"Création d\'un atelier"},closeButton:{}},resizer:{},initWidth:"45em",initHeight:"70vh",viewPortX:"middle",viewPortY:"middle"}).onNextClose()
this.openWspAfterCreate(ctx,wsp)
return wsp}}CreateWspFromWspAction.SINGLETON=new CreateWspFromWspAction
export class CreateDrfWspAction extends WspAction{constructor(id){super(id||"createDrfWsp")
this.checkCompatKey="formElt"
this._label="Créer un atelier calque de travail..."
this._description="Créer un atelier calque de travail"
this._group="add"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/wspCreate.svg")
this.requireVisiblePerm("action.wsp#create.wsp.drf")}isVisible(ctx){if(!ctx.reg.env.wsp||!ctx.reg.env.wsp.hasFeature("drf"))return false
return super.isVisible(ctx)}async execute(ctx,ev){const reg=ctx.reg
const wspTitle=ctx.reg.env.wsp.wspTitle
const{WspCreatDrfProps:WspCreatDrfProps}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/wspProps.js")
const result=await POPUP.showDialog((new WspCreatDrfProps).initialize({reg:ctx.reg}),ctx.reg.env.uiRoot,{titleBar:{barLabel:{label:`Création d\'un atelier calque de travail de \'${wspTitle}\'`},closeButton:{}},resizer:{},viewPortX:"middle",viewPortY:"middle",fixSize:false}).onNextClose()
this.openWspAfterCreate(ctx,result)
return result}}CreateDrfWspAction.SINGLETON=new CreateDrfWspAction
export class CreateDrvWspAction extends WspAction{constructor(id){super(id||"createDrvWsp")
this.checkCompatKey="formElt"
this._label="Créer un atelier calque de dérivation..."
this._description="Créer un atelier calque de dérivation"
this._group="add"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/wspCreate.svg")
this.requireVisiblePerm("action.wsp#create.wsp.drv")}isVisible(ctx){const wsp=ctx.reg.env.wsp
if(!wsp||!wsp.hasFeature("drv"))return false
const infoWsp=wsp.infoWsp||wsp.infoWspError
if(!infoWsp||WSP_DRV.isDrv(infoWsp.props))return false
if(!infoWsp||WSP_DRF.isDrf(infoWsp.props))return false
return super.isVisible(ctx)}async execute(ctx,ev){const reg=ctx.reg
const wspTitle=ctx.reg.env.wsp.wspTitle
const{WspCreatDrvProps:WspCreatDrvProps}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/wspProps.js")
const result=await POPUP.showDialog((new WspCreatDrvProps).initialize({reg:ctx.reg}),ctx.reg.env.uiRoot,{titleBar:{barLabel:{label:`Création d\'un atelier calque de dérivation de \'${wspTitle}\'`},closeButton:{}},resizer:{},viewPortX:"middle",viewPortY:"middle",fixSize:false}).onNextClose()
this.openWspAfterCreate(ctx,result)
return result}}CreateDrvWspAction.SINGLETON=new CreateDrvWspAction
REG.reg.registerSvc("openForeignItem",1,(function(reg,wspCd,srcRef){window.open(`#${CDM.stringify({u:reg.env.universe.getId(),wsp:wspCd,srcRef:srcRef})}`,"_blank")}))

//# sourceMappingURL=wspActions.js.map