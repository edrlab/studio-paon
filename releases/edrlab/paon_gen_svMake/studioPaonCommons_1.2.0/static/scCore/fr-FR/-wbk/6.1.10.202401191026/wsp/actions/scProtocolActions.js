import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{ViewsContainer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/views_Perms.js"
import{InfoCurrentItem,InfoFocusNodeInItem}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{ItemViewerSingle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemViewerSingle.js"
import{SCPRTC,ScUniverseProtocolExec}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/scenariProtocol.js"
import{Wsp,WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{ESrcSt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{ImportScar}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{SKINPACK,WSPPACK}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/pack.js"
class ScWspProtocolExec extends ScUniverseProtocolExec{findWsp(params,reg){if(params.wsp){if(!this.wsp){const u=this.findUniverse(params,reg)
if(!u||!u.wspServer)return
if(reg.env.place){this.wsp=reg.env.place.getWsp(params.wsp)
if(!this.wsp)reg.env.place.registerWsp(new Wsp(u.wspServer,params.wsp))}else{this.wsp=new Wsp(u.wspServer,params.wsp)}}return this.wsp}else return reg.env.wsp}}export class OpenAppOnWspScProtocolExec extends ScWspProtocolExec{async execute(params,reg,emitter,ev){if(!params.appDef)params.appDef={}
if(params.appDefUniversIdParam){const universe=this.findUniverse(params,reg)
if(universe)params.appDef[params.appDefUniversIdParam]=universe.getId()}if(params.appDefWspCdParam){const wsp=this.findWsp(params,reg)
if(wsp)params.appDef[params.appDefWspCdParam]=wsp.code}return desk.findAndOpenApp(params.appDef,ev)}}export class OpenNodeScProtocolExec extends ScWspProtocolExec{async execute(params,reg,emitter,ev){let handled=false
const wsp=this.findWsp(params,reg)
if(!wsp)throw Error("No wsp context found")
if(reg.env.infoBroker){const info=new InfoFocusNodeInItem("/",params.refUri)
reg.env.infoBroker.dispatchInfo(info,emitter)
handled=info.handled}if(!handled){const itemViewer=new ItemViewerSingle
const root=JSX.createElement(ViewsContainer,{"î":{views:[itemViewer]},style:"flex:1;display:flex;min-height:0;min-width:0;flex-direction:column;"})
await itemViewer.initViewer(wsp.reg,root,null,params.refUri)
POPUP.showDialog(root,reg.env.uiRoot,{titleBar:{},initWidth:"90%",initHeight:"90%",resizer:{}})}}}export class AddWspOptionsScProtocolExec extends ScWspProtocolExec{async execute(params,reg,emitter,ev){let handled=false
const wsp=this.findWsp(params,reg)
if(!wsp)throw Error("No wsp context found")
if(!(params===null||params===void 0?void 0:params.wspOptions)||!params.wspOptions.length)return false
let progress=POPUP.showProgress(emitter||reg.env.uiRoot,`Veuillez patienter...`)
try{await wsp.waitForLoad()
progress.close()
const wspTitle=wsp.wspTitle
const optionsTitle=params.wspOptions.map(entry=>entry.title||entry.key).sort().join(", ")
if(!await POPUP.confirm(params.wspOptions.length>1?`Activer les options \'${optionsTitle}\' sur l\'atelier \'${wspTitle}\' ?`:`Activer l\'option \'${optionsTitle}\' sur l\'atelier \'${wspTitle}\' ?`,emitter||reg.env.uiRoot))return false
progress=POPUP.showProgress(emitter||reg.env.uiRoot,`Veuillez patienter...`)
const newWspType=new Object(wsp.wspType)
if(!newWspType)throw Error("Current wsp not loadable")
if(!newWspType.wspOptions)newWspType.wspOptions=[]
let hasChanged=false
params.wspOptions.forEach(entry=>{if(!newWspType.wspOptions.find(opt=>opt.key===entry.key&&(!entry.version||opt.version.startsWith(entry.version)))){hasChanged=true
newWspType.wspOptions.push(entry)}})
if(hasChanged)await wsp.updateWspType(newWspType,true,true)}finally{progress.close()}}}export class ImportScarScProtocolExec extends ScWspProtocolExec{async execute(params,reg,emitter,ev){const wsp=this.findWsp(params,reg)
if(!wsp)throw Error("No wsp context found")
if(!params.scarUrl)throw Error("Param 'scarUrl' required")
if(!params.dstSpaceSrcUriFavour)throw Error("Param 'dstSpaceSrcUriFavour' required")
const scarUrl=params.scarUrl
if(!await POPUP.confirm(`Importer l\'archive provenant de \'${scarUrl}\' ?`,emitter||reg.env.uiRoot))return false
const maxChecks=1e3
let counter=0
let dstSpaceSrcUriTarget
while(!dstSpaceSrcUriTarget&&counter<maxChecks){const dstSpaceSrcUriCandidate=params.dstSpaceSrcUriFavour+(counter?"_"+counter:"")
const node=await WSP.fetchSrcTree(wsp,null,dstSpaceSrcUriCandidate,0,["srcSt"])
if(node.srcSt!=ESrcSt.none)counter++
else dstSpaceSrcUriTarget=dstSpaceSrcUriCandidate}if(!dstSpaceSrcUriTarget)throw Error("No dest space available")
const progress=POPUP.showProgress(emitter||reg.env.uiRoot,`Téléchargement en cours...`)
let data
try{const resp=await fetch(params.scarUrl,{method:"get",cache:"no-cache"})
data=await resp.blob()}catch(e){const scarUrl=params.scarUrl
await ERROR.show(`Impossible de télécharger l\'archive Scenari: ${scarUrl}`,e)
return false}finally{progress.close()}if(data&&data.type==="application/scenari.scar"){const leafname=params.scarUrl.split("/").pop()
const file=new File([data],leafname)
if(await ImportScar.doImportScar(wsp,emitter||reg.env.uiRoot,dstSpaceSrcUriTarget,file,false)){if(reg.env.infoBroker){const info=new InfoCurrentItem(dstSpaceSrcUriTarget)
reg.env.infoBroker.dispatchInfo(info,emitter)}}}else{const scarUrl=params.scarUrl
const dataType=data.type
await ERROR.show(`La ressource pointée \'${scarUrl}\' n\'est pas une archive Scenari (type \'${dataType}\' au lieu de \'application/scenari.scar\')`)
return false}}}export class CreateWspScProtocolExec extends ScUniverseProtocolExec{async execute(params,reg,emitter,ev){const universe=this.findUniverse(params,reg)
let wspLabel
try{if(!universe||!universe.wspServer)throw Error("chain univers required (param 'univers')")
if(!params.wspParams)throw Error("Param 'wspParams' required")
if(!params.wspType)throw Error("Param 'wspType' required")
const wspCd=params.wspParams.alias||params.wspParams.code
let wsp
if(wspCd){wsp=new Wsp(universe.wspServer,params.wspParams.alias||params.wspParams.code)
await wsp.waitForLoad()
if(wsp.infoWspError&&wsp.infoWspError.status==="noWsp")wsp=null}if(!wsp){wspLabel=params.wspParams.title||params.wspParams.alias||params.wspParams.code
if(!await POPUP.confirm(`Créer l\'atelier \'${wspLabel}\' ?`,emitter||reg.env.uiRoot))return false
wsp=await WSP.createWsp(universe.wspServer,params.wspParams,params.wspType,true)}if(params.subActions){const newReg=REG.createSubReg(reg,wsp.reg)
params.subActions.forEach(act=>{const action=SCPRTC.findAction(act.action,reg)
if(action){action.execute(act,newReg,emitter,ev)}else{console.log(`No action registered for scenari: protocol '${act.action}'`)}})}}catch(e){await ERROR.show(wspLabel?`Création de l\'atelier \'${wspLabel}\' en échec.`:"Création de l\'atelier en échec.",e,params)
return false}}}export class InstallPackScProtocolExec extends ScUniverseProtocolExec{async execute(params,reg,emitter,ev){var _a
const universe=this.findUniverse(params,reg)
if(!((_a=universe)===null||_a===void 0?void 0:_a.packServer))throw Error("'univers' required (param 'univers')")
if(!params.packUrl)throw Error("Param 'packUrl' required")
const packUrl=params.packUrl
const packName=params.packName||params.packUrl.split("/").pop()
if(!universe.reg.hasPerm("install.wspPack"))if(!await POPUP.confirm(`Vous ne disposez pas des habilitations requises`,emitter||reg.env.uiRoot))return false
if(!await POPUP.confirm(`Installer le pack \'${packName}\' provenant de \'${packUrl}\' ?`,emitter||reg.env.uiRoot))return false
let data
const progress=POPUP.showProgress(emitter||reg.env.uiRoot,`Téléchargement du pack \'${packName}\' en cours...`)
try{const resp=await fetch(params.packUrl,{method:"get",cache:"no-cache"})
data=await resp.blob()
progress.close()}catch(e){progress.close()
await ERROR.show(`Impossible de télécharger le pack \'${packName}\' : ${packUrl}`,e)
return false}if(data&&data.type==="application/scenari.wsppack"){const leafname=params.packUrl.split("/").pop()
const file=new File([data],leafname)
const progress=POPUP.showProgress(emitter||reg.env.uiRoot,`Installation du pack \'${packName}\' en cours...`)
try{const pack=await WSPPACK.installPack(universe.packServer,file,true)
progress.close()
if(pack===null||pack===void 0?void 0:pack.error){const error=WSPPACK.errorToString(pack.error)
await ERROR.show(`Installation du pack \'${packName}\' en erreur : ${error}`)
return false}}catch(e){progress.close()}}else{const mimeType=data.type
await ERROR.show(`La ressource \'${packUrl}\' n\'est pas un wspPack Scenari (type \'${mimeType}\' au lieu de \'application/scenari.wsppack\')`)
return false}}}export class InstallSkinScProtocolExec extends ScUniverseProtocolExec{async execute(params,reg,emitter,ev){var _a
const universe=this.findUniverse(params,reg)
if(!((_a=universe)===null||_a===void 0?void 0:_a.packServer))throw Error("'universe'' required (param 'univers')")
if(!params.packUrl)throw Error("Param 'packUrl' required")
const packUrl=params.packUrl
const packName=params.packName||params.packUrl.split("/").pop()
if(!universe.reg.hasPerm("install.skinPack"))if(!await POPUP.confirm(`Vous ne disposez pas des habilitations requises`,emitter||reg.env.uiRoot))return false
if(!await POPUP.confirm(`Installer l\'habillage graphique \'${packName}\' provenant de \'${packUrl}\' ?`,emitter||reg.env.uiRoot))return false
let data
const progress=POPUP.showProgress(emitter||reg.env.uiRoot,`Téléchargement de l\'habillage graphique \'${packName}\' en cours...`)
try{const resp=await fetch(params.packUrl,{method:"get",cache:"no-cache"})
data=await resp.blob()
progress.close()}catch(e){progress.close()
await ERROR.show(`Impossible de télécharger l\'habillage graphique \'${packName}\'`,e)
return false}if(data&&data.type==="application/scenari.skinpack"){const leafname=params.packUrl.split("/").pop()
const file=new File([data],leafname)
const progress=POPUP.showProgress(emitter||reg.env.uiRoot,`Installation de l\'habillage graphique \'${packName}\' en cours..."`)
try{const pack=await SKINPACK.install(universe.packServer,file)
progress.close()
if(!SKINPACK.isStatusInstalled(pack===null||pack===void 0?void 0:pack.installStatus)){await ERROR.show(`L\'installation de l\'habillage graphique \'${packName}\' a échoué`)
return false}}catch(e){progress.close()}}else{const mimeType=data.type
await ERROR.show(`La ressource pointée \'${packUrl}\' n\'est pas un habillage graphique Scenari (type \'${mimeType}\' au lieu de \'application/scenari.skinpack\')`)
return false}}}export function registerWspProtocolsActions(reg){reg.addToList(SCPRTC.LIST_EXECUTORS,"openNode",1,new OpenNodeScProtocolExec)
reg.addToList(SCPRTC.LIST_EXECUTORS,"importScar",1,new ImportScarScProtocolExec)
reg.addToList(SCPRTC.LIST_EXECUTORS,"createWsp",1,new CreateWspScProtocolExec)
reg.addToList(SCPRTC.LIST_EXECUTORS,"addWspOptions",1,new AddWspOptionsScProtocolExec)
reg.addToList(SCPRTC.LIST_EXECUTORS,"installPack",1,new InstallPackScProtocolExec)
reg.addToList(SCPRTC.LIST_EXECUTORS,"installSkin",1,new InstallSkinScProtocolExec)
reg.addToList(SCPRTC.LIST_EXECUTORS,"openAppOnWsp",1,new OpenAppOnWspScProtocolExec)}
//# sourceMappingURL=scProtocolActions.js.map