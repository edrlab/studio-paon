import{CoreUniverse}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/universe.js"
import{URLTREE,UrlTreeSrv}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/urlTree.js"
import{SEC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/security.js"
import{configPackSrv,PackSrv}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/pack.js"
import{configExecutorSrv,ExecutorSrv}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/executor.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{EventsMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{configDepotCidSrv,DepotCidSrv}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/cid.js"
import{DepotResTypeProv}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/res.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
export class DepotUniverse extends CoreUniverse{constructor(config){super(config)}buildConfig(config){if(!config.wsFrames)config.wsFrames={}
super.buildConfig(config)
config.cid=configDepotCidSrv(config.httpFrames.web.execFrameUrl,null,config.cid)
if(config.packs!==null)config.packs=configPackSrv(config.httpFrames.web.execFrameUrl,config.packs)
if(config.executor!==null)config.executor=configExecutorSrv(config.httpFrames.web.execFrameUrl,config.executor)
if(!config.urlTree)config.urlTree=config.universeUrl.resolve("tree/")
if(!config.adminUrlTree)config.adminUrlTree=config.universeUrl.resolve("adminTree/")}buildUniverse(config){super.buildUniverse(config)
this.reg.env.resTypes=this.resTypes=new DepotResTypeProv
this.cid=new DepotCidSrv(config.cid)
if(config.packs!==null)this.packServer=new PackSrv(this,config.packs)
if(config.executor!==null)this.executor=new ExecutorSrv(config.executor)
this.urlTree=new UrlTreeSrv(config.urlTree,config.urlTreeAnonymousAccount)
this.adminUrlTree=new UrlTreeSrv(config.adminUrlTree,config.urlTreeAnonymousAccount)
const ws=this.wsFrames.ws
ws===null||ws===void 0?void 0:ws.lcListeners.on("opened",()=>{if(this.reg.hasPerm("view.depot")){ws.postMsg({svc:"storeChanges",listen:true})}})}newDepotUiReg(uiRoot,noListen){const dptReg=REG.createSubReg(this.reg)
dptReg.env.uiRoot=uiRoot
if(!noListen)this.listenDepotChanges(dptReg)
return dptReg}newDepotUiRegFromUiReg(from,noListen){const dptReg=REG.createSubRegMixed(from,this.reg)
if(!noListen)this.listenDepotChanges(dptReg)
return dptReg}listenDepotChanges(dptReg){const ws=this.reg.env.universe.wsFrames.ws
if(ws){const evts=dptReg.env.depotEvents=new EventsMgr
function onStorechange(m){evts.emitCatched("resChange",m)}function onConnOpened(){evts.emitCatched("connOpened")}ws.msgListeners.on("storeChanges",onStorechange)
ws.lcListeners.on("opened",onConnOpened)
dptReg.onRegClose.add(()=>{ws.lcListeners.removeListener("opened",onConnOpened)
ws.msgListeners.removeListener("storeChanges",onStorechange)})}}newDepotResReg(path,noListen){const resReg=REG.createSubReg(this.reg)
this.enrichDepotResReg(resReg,path,noListen)
return resReg}newDepotResUiReg(uiRoot,path,noListen){const resReg=REG.createSubReg(this.reg)
resReg.env.uiRoot=uiRoot
this.enrichDepotResReg(resReg,path,noListen)
return resReg}newDepotResUiRegFromDepotUiReg(dptReg,path,noListen){const resReg=REG.createSubReg(dptReg)
this.enrichDepotResReg(resReg,path,noListen)
return resReg}forceNewProcessing(reg,resType){reg.resetExtPoints()
resType.reg.copyTo(reg)}newDepotResUiRegInCreation(dptReg,path,resType,noListen){const resReg=REG.createSubReg(dptReg)
resReg.env.path=path
resReg.env.nodeInfos={path:path,metas:{path:path,processing:resType.prc}}
resReg.env.resType=resType
if(path!=null&&!noListen)listenWsForRes(resReg)
return resReg}newDepotResUiRegFromUiReg(from,path,noListen){const resReg=REG.createSubRegMixed(from,this.reg)
if(!noListen)this.listenDepotChanges(resReg)
this.enrichDepotResReg(resReg,path,noListen)
return resReg}async getRenderings(resReg){if(!resReg.env.renderings){const endPoint=this.urlTree.url.resolve(URLTREE.path2RelativeUrl(resReg.env.path+"/:api:/v1/renderings"))
resReg.env.renderings=endPoint.fetchJson().then(datas=>resReg.env.renderings=new ResRenderings(datas)).catch(e=>{ERROR.log("Fetch renderings failed",e)
return resReg.env.renderings=new ResRenderings(null)})}return resReg.env.renderings}enrichDepotResReg(resReg,path,noListen){resReg.env.path=path
fetchNodeInfos(resReg)
if(!noListen)listenWsForRes(resReg)
return resReg}hasAspect(aspect){return this.config.storeAspects&&this.config.storeAspects.indexOf(aspect)>-1?true:false}}class ResRenderings{constructor(datas){this.datas=datas
this._set=new Set
if(datas)for(let r of datas.renderings){for(let subPath of r.subPaths)this._set.add(subPath)}}isAvailable(subPath){return this._set.has(subPath)}}function listenWsForRes(resReg){const ws=resReg.env.universe.wsFrames.ws
if(ws){resReg.env.nodeInfosChange=new ResEventsMgr(resReg)
function onStorechange(m){var _a
if(m.props.path===((_a=resReg.env.nodeInfos)===null||_a===void 0?void 0:_a.permaPath))fetchNodeInfos(resReg)}function onConnOpened(){fetchNodeInfos(resReg)}ws.msgListeners.on("storeChanges",onStorechange)
ws.lcListeners.on("opened",onConnOpened)
resReg.onRegClose.add(()=>{ws.lcListeners.removeListener("opened",onConnOpened)
ws.msgListeners.removeListener("storeChanges",onStorechange)})}}async function fetchNodeInfos(resReg){const env=resReg.env
const promise=env.nodeInfosPending=env.universe.adminUrlTree.nodeInfos(env.path).then(newNi=>{var _a
if(env.nodeInfosPending!==promise)return env.nodeInfosPending
env.nodeInfosPending=null
const oldNi=env.nodeInfos
if(env.nodeInfos!==undefined)resReg.resetExtPoints()
env.nodeInfos=newNi
env.resTypes.getResTypeFor(newNi).reg.copyTo(resReg)
env.securityCtx=newNi?SEC.createSub(resReg.parentReg.env.securityCtx,newNi.roles,undefined,newNi):resReg.parentReg.env.securityCtx
env.nodeInfosError=null;(_a=env.nodeInfosChange)===null||_a===void 0?void 0:_a.emit("nodeChange",newNi,oldNi)
return newNi},e=>{var _a
const oldNi=env.nodeInfos
env.nodeInfosError=e
env.nodeInfosPending=null
env.nodeInfos=undefined
env.securityCtx=resReg.parentReg.env.securityCtx
env.resType=undefined
resReg.resetExtPoints();(_a=env.nodeInfosChange)===null||_a===void 0?void 0:_a.emit("nodeChange",undefined,oldNi)
throw e})}export var EStoreAspects;(function(EStoreAspects){EStoreAspects["trash"]="trash"
EStoreAspects["unlisted"]="unlisted"})(EStoreAspects||(EStoreAspects={}))
class ResEventsMgr extends EventsMgr{constructor(reg){super()
this.reg=reg}on(event,listener,order){if(!this._listeners||!this._listeners[event]){if(event==="urlAncChange"){const ws=this.reg.env.universe.wsFrames.ws
const onStoreChange=m=>{if(URLTREE.isDescendantPath(m.props.path,this.reg.env.nodeInfos.permaPath)){const anc=this.reg.env.nodeInfos.urlAnc
this.reg.env.universe.adminUrlTree.nodeInfos(this.reg.env.nodeInfos.permaPath,"&props=&persistMetas=&historyProps=&succProps=").then(ni=>{if(this.reg.isClosed)return
this.reg.env.nodeInfos.urlAnc=ni.urlAnc
this.emit("urlAncChange",ni,anc)}).catch(()=>{this.emit("urlAncChange",undefined,anc)})}}
ws.msgListeners.on("storeChanges",onStoreChange)
this.reg.onRegClose.add(()=>{ws.msgListeners.removeListener("storeChanges",onStoreChange)})}else if(event==="histChange"){const ws=this.reg.env.universe.wsFrames.ws
const onStoreChange=m=>{if(URLTREE.extractUnversionedLeafPath(m.props.path)===URLTREE.extractUnversionedLeafPath(this.reg.env.nodeInfos.permaPath)){this.reg.env.universe.adminUrlTree.nodeInfos(this.reg.env.nodeInfos.permaPath,"&props=&persistMetas=&urlAncProps=").then(ni=>{if(this.reg.isClosed)return
const nodeInfos=this.reg.env.nodeInfos
nodeInfos.hist=ni.hist
nodeInfos.succ=ni.succ
this.emit("histChange",nodeInfos)}).catch(()=>{this.emit("histChange",undefined)})}}
ws.msgListeners.on("storeChanges",onStoreChange)
this.reg.onRegClose.add(()=>{ws.msgListeners.removeListener("storeChanges",onStoreChange)})}else if(event==="childChange"){const ws=this.reg.env.universe.wsFrames.ws
const onStoreChange=m=>{if(URLTREE.extractParentPath(m.props.path)===this.reg.env.nodeInfos.permaPath)this.emit("childChange",m.props)}
ws.msgListeners.on("storeChanges",onStoreChange)
this.reg.onRegClose.add(()=>{ws.msgListeners.removeListener("storeChanges",onStoreChange)})}}return super.on(event,listener,order)}}export function isDepotUiEnv(env){return env.depotEvents&&env.resTypes instanceof DepotResTypeProv}
//# sourceMappingURL=depot.js.map