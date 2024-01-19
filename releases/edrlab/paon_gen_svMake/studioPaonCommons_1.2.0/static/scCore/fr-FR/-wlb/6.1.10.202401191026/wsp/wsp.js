import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{EHttpStatusCode,IO,RespError,UrlQs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{SEC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/security.js"
import{CDM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/cdm.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{ESrcSt,SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp_Perms.js"
import{EWspChangesEvts,WspsLive}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
export class WspSrv{constructor(chain,config){this.chain=chain
this.config=config}get reg(){return this.chain.reg}get wspsLive(){if(!this._wspsLive)this._wspsLive=new WspsLive(this)
return this._wspsLive}}export function configWspSrv(webFrameUrl,config){if(!config)config={}
if(!config.adminWspUrl)config.adminWspUrl=webFrameUrl.resolve("u/adminWsp/")
if(!config.wspMetaEditorUrl)config.wspMetaEditorUrl=webFrameUrl.resolve("u/wspMetaEditor")
if(!config.wspAgtUrl)config.wspAgtUrl=webFrameUrl.resolve("u/wspAgt")
if(!config.wspGenUrl)config.wspGenUrl=webFrameUrl.resolve("u/wspGen")
if(!config.pubUrl)config.pubUrl=webFrameUrl.resolve("u/pub/")
if(!config.exportUrl)config.exportUrl=webFrameUrl.resolve("u/export")
if(!config.importUrl)config.importUrl=webFrameUrl.resolve("u/import")
if(!config.wspDavUrl)config.wspDavUrl=webFrameUrl.resolve("u/wspDav/")
if(!config.drfUrl)config.drfUrl=webFrameUrl.resolve("u/drf")
if(!config.drvUrl)config.drvUrl=webFrameUrl.resolve("u/drv")
if(!config.versionUrl)config.versionUrl=webFrameUrl.resolve("u/version")
if(!config.historyUrl)config.historyUrl=webFrameUrl.resolve("u/history")
if(!config.wspSrcUrl)config.wspSrcUrl=webFrameUrl.resolve("u/wspSrc")
if(!config.privateFolderUrl)config.privateFolderUrl=webFrameUrl.resolve("u/privateFolder/")
if(!config.tasksUrl)config.tasksUrl=webFrameUrl.resolve("u/tasks")
if(!config.itemDynGenUrl)config.itemDynGenUrl=webFrameUrl.resolve("u/itemDynGen/")
if(!config.searchUrl)config.searchUrl=webFrameUrl.resolve("u/search")
if(!config.diffUrl)config.diffUrl=webFrameUrl.resolve("u/wspDiff")
if(!config.adminWspFsUrl)config.adminWspFsUrl=webFrameUrl.resolve("u/adminWspFs/")
if(!config.wspSvcUrl)config.wspSvcUrl=webFrameUrl.resolve("repos/")
if(!config.wspSvcExistUrl)config.wspSvcExistUrl=webFrameUrl.resolve("*repos/")
if(!config.wspSvcSkinSet)config.wspSvcSkinSet=wspCode=>config.wspSvcUrl.resolve(wspCode+"/skinSet")
return config}export var EWspLoadingStatus;(function(EWspLoadingStatus){EWspLoadingStatus["notLoaded"]="notLoaded"
EWspLoadingStatus["ok"]="ok"
EWspLoadingStatus["failed"]="failed"
EWspLoadingStatus["loading"]="loading"
EWspLoadingStatus["noWsp"]="noWsp"})(EWspLoadingStatus||(EWspLoadingStatus={}))
export class Wsp{constructor(wspServer,code,infoWsp,wspMetaUi){this.wspServer=wspServer
this.code=code
this.countUsed=0
this._pendingLongDescFetch=new Map
this.reg=REG.createSubReg(wspServer.reg)
this.reg.env.wsp=this
if(infoWsp){if(infoWsp.status==="loading")this.waitForLoad()
else this.setInfoWsp(infoWsp)
if(wspMetaUi){this.wspMetaUi=wspMetaUi
this.reg.copyFrom(wspMetaUi.reg)}}}get srcRefField(){return this.backEnd==="odb"?"srcId":"srcUri"}get isLoaded(){return this.infoWsp!=null||this.infoWspError!=null&&this.infoWspError.status!=EWspLoadingStatus.notLoaded}get isAvailable(){return this.infoWsp!=null&&!this.infoWsp.wspTypeWarn&&this.wspMetaUi!=null&&!this.migrating&&!this.fullLoading}get isFullLoading(){return this.fullLoading!=null}get isFullLoaded(){var _a
return((_a=this.infoWsp)===null||_a===void 0?void 0:_a.allItemsLoaded)==="ok"||false}get isInError(){return this.infoWspError!=null||this.wspMetaUi===null}get isDeleted(){return this.infoWsp&&this.infoWsp.srcFields?this.infoWsp.srcFields.srcSt===-1:undefined}get isAccessDenied(){return this.lastNetError&&this.lastNetError.response.status===EHttpStatusCode.forbidden}get isPublic(){return this.infoWsp?this.infoWsp.props.publicWsp==="true":undefined}get isAirItem(){return this.infoWsp?this.infoWsp.props.airIt==="true":undefined}get isExtItem(){return this.infoWsp?this.infoWsp.props.extIt==="true":undefined}get isPrxItem(){return this.backEnd==="odb"}get backEnd(){return this.reg.env.universe.config.backEnd}get wspTitle(){if(this.infoWsp&&this.infoWsp.title)return this.infoWsp.title
if(this.infoWspError&&this.infoWspError.title)return this.infoWspError.title
return this.code}get wspAlias(){return this.infoWsp?this.infoWsp.alias:undefined}get wspType(){return this.infoWsp&&this.infoWsp.wspType?this.infoWsp:undefined}get wspDefProps(){return this.infoWsp?this.infoWsp.props:undefined}hasFeature(feat){const backEnd=this.backEnd
if(backEnd===undefined)return undefined
if(backEnd==="fs"){if(feat==="revealFs")return true
if(feat==="git")return true}else{if(feat==="trash")return true
if(feat==="history")return true
if(feat==="version")return true
if(feat==="tasks")return true
if(feat==="liveCycle")return true
if(feat==="resp")return true
if(feat==="drv")return this.reg.env.universe.wspServer.chain.config.drv
if(feat==="drf")return this.reg.env.universe.wspServer.chain.config.drf}return false}async waitForLoad(){if(this.isLoaded)return this
if(this.infoWsp===null)throw Error("Fetch infoWsp previously failed: "+this.lastNetError)
if(this._wspInfoLoading==null){const fields=this.backEnd==="odb"?"srcRoles*srcRi*srcDt*srcSt":"srcRoles*srcRi*srcDt*srcSt*gitSt"
this._wspInfoLoading=this.wspServer.config.adminWspUrl.fetchJson(IO.qs("cdaction","InfoWsp","param",this.code,"fields",fields)).then(infoWsp=>{if(infoWsp&&infoWsp.status==="loading")return new Promise(resolve=>{this._wspInfoLoading=null
setTimeout(()=>resolve(this.waitForLoad()),500)})
this.setInfoWsp(infoWsp)
return this},e=>{if(e instanceof RespError)this.lastNetError=e
this.setInfoWsp(null)
throw e})}return this._wspInfoLoading}async waitForWspMetaUiAvailable(){if(this.wspMetaUi!==null){if(this._wspMetaUiLoading!=null){await this._wspMetaUiLoading}else{await this.waitForLoad()
if(this.shouldLoadWspMetaUi()){if(this._wspMetaUiLoading!=null)await this._wspMetaUiLoading
else await this.fetchWspMetaUi()}}}return this}async waitForAvailable(notifFrom){try{if(!this.wspMetaUi){if(!this.isLoaded){this.notifWaiting(notifFrom,"Chargement de l\'atelier...")
await this.waitForLoad()}if(this.infoWspError!=null){if(this.infoWspError.status===EWspLoadingStatus.noWsp){this.notifWaiting(notifFrom,"Atelier non trouvé")}else{this.notifWaiting(notifFrom,"Atelier en erreur")}throw Error("WspInfo in error")}if(this.infoWsp===null){this.notifWaiting(notifFrom,"Accès impossible à l\'atelier")
throw Error("Fetch infoWsp previously failed")}if(this.wspMetaUi===null){this.notifWaiting(notifFrom,"Accès impossible aux propriétés de l\'atelier")
throw Error("Fetch wspMeta previously failed")}if(this._wspMetaUiLoading!=null){await this._wspMetaUiLoading}else{if(this.shouldLoadWspMetaUi()){this.notifWaiting(notifFrom,"Chargement de l\'atelier...")
if(this._wspMetaUiLoading!=null)await this._wspMetaUiLoading
else await this.fetchWspMetaUi()}}}if(this.migrating){this.notifWaiting(notifFrom,"Migration de l\'atelier en cours...")
await this.migrating
await this.waitForAvailable(notifFrom)}if(this.fullLoading){this.notifWaiting(notifFrom,"Chargement de l\'atelier complet en cours...")
await this.fullLoading
await this.waitForAvailable(notifFrom)}}finally{this.clearAllNotifWaiting()}return this}shouldLoadWspMetaUi(){if(this.wspMetaUi!=null)return false
if(this.infoWsp!=null)return true
if(this.infoWspError!=null)console.log("this.infoWspError.status:::",this.infoWspError.status)
if(this.infoWspError!=null&&this.infoWspError.status!==EWspLoadingStatus.notLoaded&&this.infoWspError.status!==EWspLoadingStatus.noWsp)return true
return false}notifWaiting(notifFrom,msg){if(!notifFrom||notifFrom.offsetHeight==0)return
if(!this._lastWaitNotif)this._lastWaitNotif=new Map
let lastNotif=this._lastWaitNotif.get(notifFrom)
if(lastNotif){lastNotif.setContent(msg)}else{lastNotif=POPUP.showNotif(msg,notifFrom,{autoHide:0})
this._lastWaitNotif.set(notifFrom,lastNotif)
lastNotif.onNextClose().then(()=>{this._lastWaitNotif.delete(notifFrom)})}}clearAllNotifWaiting(){if(this._lastWaitNotif){for(const notif of this._lastWaitNotif.values()){notif.close()}this._lastWaitNotif.clear()}}updateAllNotifWaiting(msg){if(this._lastWaitNotif){for(const notif of this._lastWaitNotif.values()){notif.setContent(msg)}}}listenChanges(){if(this.countUsed++===0){const wspsLive=this.wspServer.wspsLive
if(wspsLive.isAvailable&&!wspsLive.findWsp(this.code))wspsLive.sendMsg({svc:"wspChanges",type:"listen",addWsp:this.code})
wspsLive._wsps.add(this)}return this}stopListenChanges(){if(--this.countUsed===0){const wspsLive=this.wspServer.wspsLive
wspsLive._wsps.delete(this)
this.resetFullLoading()
this.resetMigrating()
if(wspsLive.isAvailable&&!wspsLive.findWsp(this.code))wspsLive.sendMsg({svc:"wspChanges",type:"listen",remWsp:this.code})}return this}newPlaceWsp(){const pl=this.wspServer.wspsLive.newPlace()
pl.registerWsp(this)
return pl}makeParamsForUpdate(){var _a,_b,_c,_d
let result={}
const infoWsp=this.infoWsp||this.infoWspError
if(this.backEnd=="fs"){if(infoWsp.props.desc)result.desc=infoWsp.props.desc
if(infoWsp.title)result.title=infoWsp.title}else if(this.backEnd=="odb"){if(infoWsp.props.desc)result.desc=infoWsp.props.desc
if(infoWsp.title)result.title=infoWsp.title
if(infoWsp.alias)result.alias=infoWsp.alias
if(infoWsp.skins)result.skins=infoWsp.skins
if((_a=infoWsp.props)===null||_a===void 0?void 0:_a.airIt)result.airIt=infoWsp.props.airIt==="true"
if((_b=infoWsp.props)===null||_b===void 0?void 0:_b.extIt)result.extIt=infoWsp.props.extIt==="true"
if((_c=infoWsp.props)===null||_c===void 0?void 0:_c.mirror)result.mirror=infoWsp.props.mirror==="true"
if((_d=infoWsp.props)===null||_d===void 0?void 0:_d.publicWsp)result.publicWsp=infoWsp.props.publicWsp==="true"}if(this.wspDefProps&&this.wspDefProps.drfRefWsp){if(infoWsp.props.draftTitle)result.draftTitle=infoWsp.props.draftTitle
if(infoWsp.props.drfRefWsp)result.wspRef=infoWsp.props.drfRefWsp}if(this.wspDefProps&&this.wspDefProps.drvAxis){if(infoWsp.props.drvMasterWsp)result.wspMaster=infoWsp.props.drvMasterWsp
if(infoWsp.props.drvAxis)result.drvAxis=infoWsp.props.drvAxis
if(infoWsp.props.drvDefaultSrcFindPath)result.drvDefaultSrcFindPath=infoWsp.props.drvDefaultSrcFindPath.split(" ")}return result}async fetchShortDesc(srcRefSub,uiContext){if(!this._pendingShortDescs)this._pendingShortDescs=new FetchSrcDescBulk(this,uiContext)
let pending=this._pendingShortDescs.get(srcRefSub)
if(!pending)pending=new FetchSrcDescPending(this._pendingShortDescs,srcRefSub,false)
return pending.promise}async fetchShortDescSubItems(srcRefSub,uiContext){if(!this._pendingShortDescs)this._pendingShortDescs=new FetchSrcDescBulk(this,uiContext)
let pending=this._pendingShortDescs.get(srcRefSub)
if(!pending)pending=new FetchSrcDescPending(this._pendingShortDescs,srcRefSub,true)
else pending.withSubItem=true
return pending.promise}async fetchLongDesc(srcRef,uiContext){let p=this._pendingLongDescFetch.get(srcRef)
if(p)return p
p=WSP.fetchLongDesc(this,uiContext,srcRef)
this._pendingLongDescFetch.set(srcRef,p)
try{return await p}finally{this._pendingLongDescFetch.delete(srcRef)}}getShortDescFields(){if(!this._shortDescFields){this._shortDescFields=[...SRC.resolveAliasSrcFields(this.reg.mergeLists(this.backEnd==="odb"?"srcFields:shortDesc:odb":"srcFields:shortDesc:fs","srcFields:shortDesc"))]}return this._shortDescFields}getShortDescDef(){if(!this._shortDescDef){this._shortDescDef=this.reg.mergeLists(this.backEnd==="odb"?"srcFields:shortDesc:odb":"srcFields:shortDesc:fs","srcFields:shortDesc").join("*")}return this._shortDescDef}getLongDescFields(){if(!this._longDescFields){const set=SRC.resolveAliasSrcFields(this.reg.mergeLists(this.backEnd==="odb"?"srcFields:longDesc:odb":"srcFields:longDesc:fs","srcFields:longDesc",this.backEnd==="odb"?"srcFields:shortDesc:odb":"srcFields:shortDesc:fs","srcFields:shortDesc"))
if(this.isExtItem)set.add("itFullUriInOwnerWsp")
this._longDescFields=[...set]}return this._longDescFields}getLongDescDef(){if(!this._longDescDef){const list=this.reg.mergeLists(this.backEnd==="odb"?"srcFields:longDesc:odb":"srcFields:longDesc:fs","srcFields:longDesc",this.backEnd==="odb"?"srcFields:shortDesc:odb":"srcFields:shortDesc:fs","srcFields:shortDesc")
if(this.isExtItem)list.push("itFullUriInOwnerWsp")
this._longDescDef=list.join("*")}return this._longDescDef}get srcUriItemsSortFn(){return SRC.sortSrcUriTree}async delete(deleteParams){return this.wspServer.config.adminWspUrl.fetchVoid(IO.qs("cdaction","DeleteWsp","param",this.code,"deleteParams",CDM.stringify(deleteParams)),{method:"POST"})}async deletePermanently(deleteParams){const qs=new UrlQs
qs.append("cdaction","DeletePermanentlyWsp")
qs.append("param",this.code)
if(deleteParams)qs.append("deleteParams",CDM.stringify(deleteParams))
return this.wspServer.config.adminWspUrl.fetchVoid("?"+qs.toString(),{method:"POST"})}async restore(){return this.wspServer.config.adminWspUrl.fetchVoid(IO.qs("cdaction","RestoreWsp","param",this.code),{method:"POST"})}updateWspProps(updateParams){return this.wspServer.config.adminWspUrl.fetchVoid(IO.qs("cdaction","UpdateWspProps","param",this.code,"updateParams",CDM.stringify(updateParams)),{method:"POST"})}async updateWspType(wspType,withMigration=false,normalizeWspType=false){const initReq={method:"PUT",body:DOM.ser(WSPMETA.toWspTypeDom(wspType))}
await this.wspServer.config.adminWspUrl.fetchJson(IO.qs("cdaction",withMigration?"MigrateUpdateWspType":"UpdateWspType","normaliseWspType",normalizeWspType,"param",this.code),initReq)
return this}async isMigrationNeeded(wspType){const initReq={method:"PUT",body:DOM.ser(WSPMETA.toWspTypeDom(wspType))}
const vRespDom=await this.wspServer.config.adminWspUrl.fetchDom(IO.qs("cdaction","IsMigrationNeeded","param",this.code),initReq)
if(vRespDom.documentElement.nodeName==="noMigrationNeeded")return Promise.resolve(false)
else if(vRespDom.documentElement.hasChildNodes())return Promise.resolve(vRespDom.documentElement.firstElementChild)
else return Promise.resolve(true)}forceReload(notifFrom){if(this.isAvailable){this.resetRemoteDatas()
return this.waitForAvailable(notifFrom)}if(this.isLoaded){this.resetRemoteDatas()
return this.waitForLoad()}return Promise.resolve(this)}async forceAllItemsLoaded(notifFrom){if(this.infoWsp.allItemsLoaded==="ok")return this
if(!this.isAvailable){await this.waitForAvailable(notifFrom)
if(this.infoWsp.allItemsLoaded==="ok")return this}this.notifWaiting(notifFrom,"Chargement de l\'atelier complet en cours...")
try{if(this.isFullLoading){await this.fullLoading}else{await this.wspServer.config.adminWspUrl.fetchVoid(IO.qs("cdaction","ActivateModeLoadAllItems","param",this.code),{method:"POST"})}}finally{this.clearAllNotifWaiting()}return this}_onWspChange(m){this.resetMigrating()
this.resetFullLoading()
if(m.wspSt==="loaded"||m.wspSt==="closed"){if(this.isLoaded)this.resetRemoteDatas()
this.waitForAvailable()}else if(m.wspSt==="migrating"){this.migrating=new Promise(resolve=>{this._migrResolver=resolve})
this._dispatchWspLiveChange()
this.updateAllNotifWaiting("Migration de l\'atelier en cours...")}else if(m.wspSt==="migratingDone"||m.wspSt==="migratingFailed"){this.clearAllNotifWaiting()
this._dispatchWspLiveChange()}else if(m.wspSt==="fullLoading"){this.fullLoading=new Promise(resolve=>{this._fullLoadingResolver=resolve})
this._dispatchWspFullLoadStateChange()
this.updateAllNotifWaiting("Chargement complet de l\'atelier en cours...")}else if(m.wspSt==="fullLoaded"){if(this.infoWsp)this.infoWsp.allItemsLoaded="ok"
this._dispatchWspFullLoadStateChange()
this.clearAllNotifWaiting()}}resetFullLoading(){if(this._fullLoadingResolver){this._fullLoadingResolver(this)
this._fullLoadingResolver=null}this.fullLoading=null}resetMigrating(){if(this._migrResolver){this._migrResolver(this)
this._migrResolver=null}this.migrating=null}_onWspPermChange(m){this.resetRemoteDatas()
return this.waitForAvailable()}_dispatchWspLiveChange(){if(WspDEBUG)console.log("WspLiveChange:::",this.code,this)
for(const place of this.wspServer.wspsLive._places){if(place.isWspUsed(this))place.eventsMgr.emitCatched("wspLiveStateChange",this)}}_dispatchWspFullLoadStateChange(){for(const place of this.wspServer.wspsLive._places){if(place.isWspUsed(this))place.eventsMgr.emitCatched("wspLiveFullLoadStateChange",this)}}async onWsConnectionRenewed(uriStates){const wspState=uriStates[this.code]
if(!wspState)return
if(this.migrating){if(WspDEBUG)console.log("Wsp.onWsConnectionRenewed::reload due to migrating::",wspState)
this.resetRemoteDatas()}else{const infoWsp=this.infoWsp||this.infoWspError
if(infoWsp===null||this.wspMetaUi===null){if(WspDEBUG)console.log("Wsp.onWsConnectionRenewed::tryLoad::",wspState)
this.resetRemoteDatas()}else if(infoWsp&&infoWsp.srcFields&&wspState&&infoWsp.srcFields.srcDt!==wspState.srcDt){if(WspDEBUG)console.log("Wsp.onWsConnectionRenewed::reload::",wspState,infoWsp.srcFields)
this.resetRemoteDatas()}else{this.resetFullLoading()}}return this.waitForAvailable()}setInfoWsp(infoWsp){this._wspInfoLoading=null
this.resetWspMetaUi()
if(infoWsp){if(infoWsp.srcFields){this.reg.env.securityCtx=SEC.createSub(this.wspServer.reg.env.securityCtx,infoWsp.srcFields.srcRoles,infoWsp.srcFields.srcRi,this)}else{this.reg.env.securityCtx=null}switch(infoWsp.status){case EWspLoadingStatus.ok:this.code=infoWsp.wspCd
this.infoWsp=infoWsp
this.infoWspError=null
break
case EWspLoadingStatus.failed:case EWspLoadingStatus.loading:this.code=infoWsp.wspCd
this.infoWsp=null
this.infoWspError=infoWsp
if(WspDEBUG)console.log("WspInfo fetched with failed status:",infoWsp)
break
case EWspLoadingStatus.notLoaded:this.code=infoWsp.wspCd
this.infoWsp=undefined
this.infoWspError=infoWsp
break
case EWspLoadingStatus.noWsp:this.infoWsp=null
this.infoWspError=infoWsp
if(WspDEBUG)console.log("Wsp do not exist:",infoWsp)}if(infoWsp.props&&infoWsp.props.drfRefWsp){this.reg.addToList("srcFields:shortDesc","drfState",1,"drfState")}else if(infoWsp.props&&infoWsp.props.drvAxis){this.reg.addToList("srcFields:shortDesc","drvState",1,"drvState")}}else{this.infoWsp=infoWsp
this.infoWspError=infoWsp
this.reg.env.securityCtx=null}this._dispatchWspLiveChange()}async fetchWspMetaUi(){try{const wspType=this.wspType
if(!wspType)throw Error("WspMeta definition not available")
this._wspMetaUiLoading=createWspMetaUi(this.wspServer,wspType)
const newWspUi=await this._wspMetaUiLoading
if(newWspUi==null)throw Error("WspMeta not found")
if(this.wspType!==wspType)return
this.wspMetaUi=newWspUi
this.reg.copyFrom(this.wspMetaUi.reg)}catch(e){if(e instanceof RespError)this.lastNetError=e
this.wspMetaUi=null
throw e}finally{this._wspMetaUiLoading=undefined
this._dispatchWspLiveChange()}return this}resetRemoteDatas(){this.infoWsp=undefined
this.infoWspError=undefined
this.resetMigrating()
this.resetFullLoading()
if(this.lastNetError)this.lastNetError=undefined
this.resetWspMetaUi()
this._dispatchWspLiveChange()}resetWspMetaUi(){if(this.wspMetaUi)this.reg.resetExtPoints()
this.wspMetaUi=undefined
this._shortDescFields=null
this._longDescFields=null
this._shortDescDef=null
this._longDescDef=null}equals(otherWsp){return otherWsp&&this.code===otherWsp.code}toString(){return`Wsp(code:'${this.code}')`}}export class WspVersion extends Wsp{constructor(origin,code,infoWsp){super(origin.wspServer,code,infoWsp)}}const WspDEBUG=false
REG.reg.addToList("srcFields:shortDesc","item",1,"item")
REG.reg.addToList("srcFields:shortDesc:odb","sdOdb",1,"sdOdb")
REG.reg.addToList("srcFields:shortDesc:fs","sdFs",1,"sdFs")
REG.reg.addToList("srcFields:shortDesc:fs","gitSt",1,"gitSt")
export var WSPMETA;(function(WSPMETA){function toWspTypeDom(wspTypeInst){const elt=DOM.newDomDoc().createElement("wspType")
elt.setAttribute("key",wspTypeInst.wspType.key)
if(wspTypeInst.wspType.uri)elt.setAttribute("uri",wspTypeInst.wspType.uri)
if(wspTypeInst.wspType.version)elt.setAttribute("version",wspTypeInst.wspType.version)
if(wspTypeInst.wspType.lang)elt.setAttribute("lang",wspTypeInst.wspType.lang)
if(wspTypeInst.wspType.title)elt.setAttribute("title",wspTypeInst.wspType.title)
if(wspTypeInst.wspOptions)for(const wspOpt of wspTypeInst.wspOptions){const optElt=elt.appendChild(elt.ownerDocument.createElement("wspOption"))
optElt.setAttribute("key",wspOpt.key)
if(wspOpt.uri)optElt.setAttribute("uri",wspOpt.uri)
if(wspOpt.version)optElt.setAttribute("version",wspOpt.version)
if(wspOpt.lang)optElt.setAttribute("lang",wspOpt.lang)
if(wspOpt.title)optElt.setAttribute("title",wspOpt.title)}return elt}WSPMETA.toWspTypeDom=toWspTypeDom
class WspMetasCache{constructor(wspSrv){this.wspSrv=wspSrv
this.wspTypeInstAtoms=new Map
this.wspMetaUis=new Map}atomWspTypeInst(wspTypeInst){const id=getWspTypeInstId(wspTypeInst)
const w=this.wspTypeInstAtoms.get(id)
if(w)return w
this.wspTypeInstAtoms.set(id,wspTypeInst)
return wspTypeInst}fetchWspMetaUi(wspTypeInst){const id=getWspTypeInstId(wspTypeInst)
let w=this.wspMetaUis.get(id)
if(!w){w=createWspMetaUi(this.wspSrv,wspTypeInst)
this.wspMetaUis.set(id,w)}return w}async waitForAll(){let done=0
const total=this.wspMetaUis.size
if(!total)return
const fetched=new Map
let finished
for(let entry of this.wspMetaUis){entry[1].then(wspMetaUi=>{fetched.set(entry[0],wspMetaUi)
if(++done===total)finished(undefined)},err=>{if(++done===total)finished(undefined)})}await new Promise(resolved=>{finished=resolved})
this.fetched=fetched}getWspMetaUi(wspTypeInst){var _a
return(_a=this.fetched)===null||_a===void 0?void 0:_a.get(getWspTypeInstId(wspTypeInst))}}WSPMETA.WspMetasCache=WspMetasCache
function getWspTypeInstId(wspTypeInst){var _a
if(wspTypeInst._id)return wspTypeInst._id
const uris=[wspTypeInst.wspType.uri];(_a=wspTypeInst.wspOptions)===null||_a===void 0?void 0:_a.forEach(opt=>uris.push(opt.uri))
uris.sort()
return wspTypeInst._id=uris.join("\n")}})(WSPMETA||(WSPMETA={}))
export var WSP;(function(WSP){function buildWspUri(wspCd,srcUri){return wspCd+srcUri}WSP.buildWspUri=buildWspUri
function buildWspId(wspCd,srcId){return wspCd+"/"+srcId}WSP.buildWspId=buildWspId
function buildWspRef(wspCd,ident){if(typeof ident==="string")return SRC.isSrcId(ident)?buildWspId(wspCd,ident):buildWspUri(wspCd,ident)
return ident.srcId?buildWspId(wspCd,ident.srcId):buildWspUri(wspCd,ident.srcUri)}WSP.buildWspRef=buildWspRef
function isWspUriRoot(wspUri){return wspUri&&wspUri.indexOf("/")<0}WSP.isWspUriRoot=isWspUriRoot
function extractWspCdFromWspRef(wspRef){if(!wspRef)return null
const end=wspRef.indexOf("/")
if(end>0)return wspRef.substring(0,end)
return end<0?wspRef:null}WSP.extractWspCdFromWspRef=extractWspCdFromWspRef
function extractSrcRefFromWspRef(wspRef){if(!wspRef)return null
const start=wspRef.indexOf("/")
if(start>0){const srcRef=wspRef.substring(start+1)
if(SRC.isSrcId(srcRef))return srcRef
return wspRef.substring(start)}if(start==0)return null
return SRC.URI_ROOT}WSP.extractSrcRefFromWspRef=extractSrcRefFromWspRef
function sortWspsByDeep(wsps){let wspsDeep=new Map
function computeDeep(wspCode){if(wspsDeep.has(wspCode))return wspsDeep.get(wspCode)
else{let wsp=wsps.find(entry=>entry.code===wspCode)
let wspDeep=0
if(wsp){let infoWsp=wsp.infoWsp||wsp.infoWspError
if(infoWsp.props.drfRefWsp)wspDeep=computeDeep(infoWsp.props.drfRefWsp)+1
else if(infoWsp.props.drvMasterWsp)wspDeep=computeDeep(infoWsp.props.drvMasterWsp)+1}wspsDeep.set(wspCode,wspDeep)
return wspDeep}}wsps.forEach(entry=>{computeDeep(entry.code)})
wsps.sort((a,b)=>wspsDeep.get(a.code)-wspsDeep.get(b.code))
return wsps}WSP.sortWspsByDeep=sortWspsByDeep
function defaultWspOpenMode(reg){if(reg.getUserData("wspAppPrefered")){if(reg.hasPerm("ui.wspApp"))return"wspApp"
if(reg.hasPerm("ui.wspDocApp"))return"wspDocApp"}else{if(reg.hasPerm("ui.wspDocApp"))return"wspDocApp"
if(reg.hasPerm("ui.wspApp"))return"wspApp"}return null}WSP.defaultWspOpenMode=defaultWspOpenMode
function alternateWspOpenMode(reg){if(reg.getUserData("wspAppPrefered")){if(reg.hasPerm("ui.wspDocApp"))return"wspDocApp"
if(reg.hasPerm("ui.wspApp"))return"wspApp"}else{if(reg.hasPerm("ui.wspApp"))return"wspApp"
if(reg.hasPerm("ui.wspDocApp"))return"wspDocApp"}return null}WSP.alternateWspOpenMode=alternateWspOpenMode
async function listWsps(wspServer,options){let qs
if(options){const opts=[]
if(options.fields)opts.push("fields",options.fields.join("*"))
if(options.withWspSrcSpecifiedRoles)opts.push("withWspSrcSpecifiedRoles","true")
qs=IO.qs("cdaction",options.inTrash?"ListTrash":"List",...opts)}else{qs="?cdaction=List"}return wspServer.config.adminWspUrl.fetchJson(qs)}WSP.listWsps=listWsps
async function fetchInfoWspProvider(wspServer){return wspServer.config.adminWspUrl.fetchJson(IO.qs("cdaction","InfoWspProvider"))}WSP.fetchInfoWspProvider=fetchInfoWspProvider
async function fetchExportAssignedRoles(wspServer,options){const opts=[]
if(options===null||options===void 0?void 0:options.fields)opts.push("fields",options.fields.join("*"))
if(options===null||options===void 0?void 0:options.withWspSrcSpecifiedRoles)opts.push("withWspSrcSpecifiedRoles","true")
return wspServer.config.adminWspUrl.fetchJson(IO.qs("cdaction","ExportAssignedRoles",...opts))}WSP.fetchExportAssignedRoles=fetchExportAssignedRoles
async function fetchSrc(wsp,uiContext,refUri,fields){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
return wsp.wspServer.config.wspSrcUrl.fetchJson(IO.qs("param",wsp.code,"refUri",refUri,"fields",fields.join("*")))}WSP.fetchSrc=fetchSrc
async function fetchSrcs(wsp,uiContext,refUris,fields){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const data=new FormData
data.append("refUris",refUris.join("\t"))
return wsp.wspServer.config.wspSrcUrl.fetchJson(IO.qs("param",wsp.code,"fields",Array.isArray(fields)?fields.join("*"):fields),{method:"POST",body:data})}WSP.fetchSrcs=fetchSrcs
async function fetchShortDesc(wsp,uiContext,refUri){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
return wsp.wspServer.config.wspSrcUrl.fetchJson(IO.qs("param",wsp.code,"refUri",refUri,"fields",wsp.getShortDescDef()))}WSP.fetchShortDesc=fetchShortDesc
function fetchShortDescs(wsp,uiContext,...refUris){return fetchSrcs(wsp,uiContext,refUris,wsp.getShortDescDef())}WSP.fetchShortDescs=fetchShortDescs
function fetchShortDescsSubItems(wsp,uiContext,...refUris){return fetchSrcs(wsp,uiContext,refUris,wsp.getShortDescDef()+"*itSubItems")}WSP.fetchShortDescsSubItems=fetchShortDescsSubItems
async function fetchShortDescSubItems(wsp,uiContext,refUri){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
return wsp.wspServer.config.wspSrcUrl.fetchJson(IO.qs("param",wsp.code,"refUri",refUri,"fields",wsp.getShortDescDef()+"*itSubItems"))}WSP.fetchShortDescSubItems=fetchShortDescSubItems
async function fetchLongDesc(wsp,uiContext,refUri){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
return wsp.wspServer.config.wspSrcUrl.fetchJson(IO.qs("param",wsp.code,"refUri",refUri,"fields",wsp.getLongDescDef()))}WSP.fetchLongDesc=fetchLongDesc
function fetchLongDescs(wsp,uiContext,...refUris){return fetchSrcs(wsp,uiContext,refUris,wsp.getLongDescDef())}WSP.fetchLongDescs=fetchLongDescs
async function fetchShortDescTree(wsp,uiContext,refUri,depth=1){return fetchSrcTree(wsp,uiContext,refUri,depth,wsp.getShortDescDef())}WSP.fetchShortDescTree=fetchShortDescTree
async function fetchSrcTree(wsp,uiContext,refUri,depth,fields){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
return wsp.wspServer.config.wspSrcUrl.fetchJson(IO.qs("param",wsp.code,"refUri",refUri,"depth",depth,"fields",Array.isArray(fields)?fields.join("*"):fields))}WSP.fetchSrcTree=fetchSrcTree
async function fetchShortDescSubTree(wsp,uiContext,refUri,targets){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
if(Array.isArray(targets))targets=targets.join(";")
return wsp.wspServer.config.wspSrcUrl.fetchJson(IO.qs("param",wsp.code,"refUri",refUri,"targets",targets,"fields",wsp.getShortDescDef()))}WSP.fetchShortDescSubTree=fetchShortDescSubTree
async function fetchItemInfo(wsp,uiContext,refUri){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
return wsp.wspServer.config.wspSrcUrl.fetchJson(IO.qs("param",wsp.code,"refUri",refUri,"format","itemInfo"))}WSP.fetchItemInfo=fetchItemInfo
async function fetchFilePath(wsp,uiContext,refUri){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
if(wsp.reg.env.universe.config.local&&wsp.reg.env.universe.config.backEnd=="fs")return wsp.wspServer.config.wspSrcUrl.fetchText(IO.qs("param",wsp.code,"refUri",refUri,"format","filePath"))}WSP.fetchFilePath=fetchFilePath
async function fetchSearch(wsp,uiContext,req){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const qs=IO.qs("cdaction","Search","param",wsp.code)
return wsp.wspServer.config.searchUrl.fetchJson(qs,{method:"POST",body:req})}WSP.fetchSearch=fetchSearch
async function fetchSearchJson(wsp,uiContext,req){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const qs=IO.qs("cdaction","Search","param",wsp.code,"format","json")
return wsp.wspServer.config.searchUrl.fetchJson(qs,{method:"POST",body:req})}WSP.fetchSearchJson=fetchSearchJson
async function fetchSearchCount(wsp,uiContext,req){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const qs=IO.qs("cdaction","Search","param",wsp.code)
return Number.parseInt(await wsp.wspServer.config.searchUrl.fetchText(qs,{method:"POST",body:req}))}WSP.fetchSearchCount=fetchSearchCount
async function fetchSearchCsv(wsp,uiContext,req){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const qs=IO.qs("cdaction","Search","param",wsp.code,"format","csv")
return wsp.wspServer.config.searchUrl.fetchText(qs,{method:"POST",body:req})}WSP.fetchSearchCsv=fetchSearchCsv
async function fetchSearchScWsp(wsp,uiContext,req){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const qs=IO.qs("cdaction","Search","param",wsp.code,"format","scwsp")
return wsp.wspServer.config.searchUrl.fetchBlob(qs,{method:"POST",body:req})}WSP.fetchSearchScWsp=fetchSearchScWsp
async function fetchSrcId(wsp,uiContext,srcUri,force){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
return(await wsp.wspServer.config.wspSrcUrl.fetchJson(IO.qs("param",wsp.code,"refUri",srcUri,"fields","srcId","forceId",force?"":undefined))).srcId}WSP.fetchSrcId=fetchSrcId
async function fetchAskAgt(wsp,uiContext,genCode,dialogPath){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
return wsp.wspServer.config.wspAgtUrl.fetchDom(IO.qs("cdaction","Ask","param",wsp.code,"contextCode",genCode,"dialogPath",dialogPath))}WSP.fetchAskAgt=fetchAskAgt
async function fetchStreamJson(wsp,uiContext,refUri,transform){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
return wsp.wspServer.config.wspSrcUrl.fetchJson(IO.qs("format","stream","param",wsp.code,"probeContentType","true","transform",transform,"refUri",refUri))}WSP.fetchStreamJson=fetchStreamJson
async function fetchStreamText(wsp,uiContext,refUri,transform){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
return wsp.wspServer.config.wspSrcUrl.fetchText(IO.qs("format","stream","param",wsp.code,"probeContentType","true","transform",transform,"refUri",refUri))}WSP.fetchStreamText=fetchStreamText
async function fetchStreamDom(wsp,uiContext,refUri,transform){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
return wsp.wspServer.config.wspSrcUrl.fetchDom(IO.qs("format","stream","param",wsp.code,"probeContentType","true","transform",transform,"refUri",refUri))}WSP.fetchStreamDom=fetchStreamDom
function getStreamUrl(wsp,refUri,transform){return wsp.wspServer.config.wspSrcUrl.resolve(IO.qs("format","stream","param",wsp.code,"probeContentType","true","transform",transform,"refUri",refUri))}WSP.getStreamUrl=getStreamUrl
function getStreamStampedUrl(wsp,refUri,stamp,transform){return wsp.wspServer.config.wspSrcUrl.resolve(IO.qs("format","stream","param",wsp.code,"probeContentType","true","transform",transform,"refUri",refUri,"srcTrashed","false","stamp",stamp)).url}WSP.getStreamStampedUrl=getStreamStampedUrl
async function fetchDiff(wsp,uiContext,baseRef,candidateWspCd,candidateRef){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const qs=IO.qs("cdaction","GetDiff","goal","diff4xed","param",wsp.code,"candidateWspCd",candidateWspCd,"baseRefUri",baseRef,"candidateRefUri",candidateRef)
return wsp.wspServer.config.diffUrl.fetchDom(qs)}WSP.fetchDiff=fetchDiff
async function fetchHistory(wsp,uiContext,srcRefLive,fields){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
return wsp.wspServer.config.historyUrl.fetchJson(IO.qs("cdaction","ListHistoryNodes","param",wsp.code,"refUriLive",srcRefLive,"fields",Array.isArray(fields)?fields.join("*"):fields||wsp.getShortDescDef()))}WSP.fetchHistory=fetchHistory
async function fetchSrcTrashed(wsp,uiContext,folder,fields){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
return wsp.wspServer.config.historyUrl.fetchJson(IO.qs("cdaction","ListTrashedNodes","param",wsp.code,"refUriLive",folder,"fields",Array.isArray(fields)?fields.join("*"):fields||wsp.getShortDescDef()))}WSP.fetchSrcTrashed=fetchSrcTrashed
async function createWsp(wspServer,params,wspType,normalizeWspType=false){const initReq={method:"PUT",body:DOM.ser(WSPMETA.toWspTypeDom(wspType))}
const qs=IO.qs("cdaction","CreateWsp","createParams",CDM.stringify(params),"normaliseWspType",normalizeWspType)
const infoWsp=await wspServer.config.adminWspUrl.fetchJson(qs,initReq)
return new Wsp(wspServer,infoWsp.wspCd,infoWsp)}WSP.createWsp=createWsp
async function importWsp(wspServer,params,scwsp,normalizeWspType=false){const initReq={}
initReq.method="POST"
initReq.body=scwsp
const qs=IO.qs("cdaction","CreateWspImport","createParams",CDM.stringify(params),"normaliseWspType",normalizeWspType)
const infoWsp=await wspServer.config.adminWspUrl.fetchJson(qs,initReq)
return new Wsp(wspServer,infoWsp.wspCd,infoWsp)}WSP.importWsp=importWsp
async function fetchExistWspFsOnPath(wspServer,wspCode,contentPath){const resp=await wspServer.config.adminWspFsUrl.fetchJson(IO.qs("cdaction","CheckWspOnPath","param",wspCode,"contentPath",contentPath))
if(resp.status==="noActiveWsp")return resp}WSP.fetchExistWspFsOnPath=fetchExistWspFsOnPath
async function createSpaceOrFolder(wsp,fromPlace,uiContext,srcUri){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const newSrc=await wsp.wspServer.config.wspSrcUrl.fetchJson(IO.qs("cdaction","PutSrc","param",wsp.code,"asFolder","true","clId",wsp.wspServer.chain.clId,"refUri",srcUri,"fields",wsp.getShortDescDef()),{method:"POST"})
if(ITEM.getSrcUriType(newSrc.srcUri)==="res"){const itemFields=await wsp.fetchShortDesc(ITEM.extractItemUri(newSrc.srcUri))
wsp.wspServer.wspsLive.dispatchLocalChange(fromPlace,wsp,itemFields,EWspChangesEvts.u,itemFields)}else{wsp.wspServer.wspsLive.dispatchLocalChange(fromPlace,wsp,newSrc,EWspChangesEvts.u,newSrc)}return newSrc}WSP.createSpaceOrFolder=createSpaceOrFolder
async function findNewRefUri(wsp,candidateSrcUriConstructor,maxChecks=1e3){let cnt=0
let target
while(!target&&cnt<maxChecks){const candidate=candidateSrcUriConstructor(cnt)
if(!candidate)return
const node=await WSP.fetchSrcTree(wsp,null,candidate,0,["srcSt"])
if(node.srcSt!=ESrcSt.none)cnt++
else return candidate}}WSP.findNewRefUri=findNewRefUri
async function srcCopyTo(wsp,uiContext,sources,newParentUri){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const fd=new FormData
fd.append("refUris",sources.join("\t"))
const srcUris=await wsp.wspServer.config.wspSrcUrl.fetchText(IO.qs("cdaction","CopyTo","param",wsp.code,"refUri",newParentUri),{method:"POST",body:fd})
return srcUris.split("\t")}WSP.srcCopyTo=srcCopyTo
async function srcMoveTo(wsp,uiContext,sources,newParentUri){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const fd=new FormData
fd.append("refUris",sources.join("\t"))
const srcUris=await wsp.wspServer.config.wspSrcUrl.fetchText(IO.qs("cdaction","MoveTo","param",wsp.code,"refUri",newParentUri),{method:"POST",body:fd})
return srcUris.split("\t")}WSP.srcMoveTo=srcMoveTo
async function srcMove(wsp,uiContext,from,newUri){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
return wsp.wspServer.config.wspSrcUrl.fetchVoid(IO.qs("cdaction","Move","param",wsp.code,"refUri",newUri,"refUris",from),{method:"POST"})}WSP.srcMove=srcMove
async function srcRename(wsp,uiContext,from,newCode){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const newUri=SRC.addLeafToUri(SRC.extractUriParent(from.srcUri),newCode)
await wsp.wspServer.config.wspSrcUrl.fetchVoid(IO.qs("cdaction","Rename","param",wsp.code,"refUri",newUri,"refUris",from.srcUri),{method:"POST"})
return newUri}WSP.srcRename=srcRename
async function srcDuplicate(wsp,uiContext,from,newCode){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const newUri=SRC.addLeafToUri(SRC.extractUriParent(from.srcUri),newCode)
await wsp.wspServer.config.wspSrcUrl.fetchVoid(IO.qs("cdaction","Duplicate","param",wsp.code,"refUri",newUri,"refUris",from.srcUri),{method:"POST"})
return newUri}WSP.srcDuplicate=srcDuplicate
async function srcDelete(wsp,uiContext,refUris){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const fd=new FormData
fd.append("refUris",refUris.join("\t"))
return wsp.wspServer.config.wspSrcUrl.fetchVoid(IO.qs("cdaction","Delete","param",wsp.code),{method:"POST",body:fd})}WSP.srcDelete=srcDelete
async function srcRestore(wsp,uiContext,srcRefs){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const fd=new FormData
fd.append("srcUris",srcRefs.join("\t"))
return wsp.wspServer.config.historyUrl.fetchVoid(IO.qs("cdaction","RestoreTrashed","param",wsp.code),{method:"POST",body:fd})}WSP.srcRestore=srcRestore
async function srcDeletePermanently(wsp,uiContext,srcUris){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const fd=new FormData
fd.append("srcUris",srcUris.join("\t"))
return wsp.wspServer.config.historyUrl.fetchVoid(IO.qs("cdaction","DeletePermanently","param",wsp.code),{method:"POST",body:fd})}WSP.srcDeletePermanently=srcDeletePermanently
async function srcSetRoles(wsp,uiContext,srcRef,specifiedRoles){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const qs=IO.qs("cdaction","SetSpecifiedRoles","param",wsp.code,"refUri",srcRef,"options",CDM.stringify(specifiedRoles))
return wsp.wspServer.config.wspSrcUrl.fetchJson(qs,{method:"POST"})}WSP.srcSetRoles=srcSetRoles
async function srcGetRoles(wsp,uiContext,srcRef){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const qs=IO.qs("cdaction","GetSrc","param",wsp.code,"format","specifiedRoles","refUri",srcRef)
return wsp.wspServer.config.wspSrcUrl.fetchJson(qs)}WSP.srcGetRoles=srcGetRoles
async function srcGetRolesForAccounts(wsp,uiContext,srcRef,pAccounts){if(!pAccounts||pAccounts.length==0)return{}
if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const qs=IO.qs("cdaction","GetSrc","param",wsp.code,"format","specifiedRoles","refUri",srcRef,"forUser",pAccounts.join("\t"))
return wsp.wspServer.config.wspSrcUrl.fetchJson(qs)}WSP.srcGetRolesForAccounts=srcGetRolesForAccounts
async function srcUpdateFields(wsp,uiContext,srcRef,fields){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const qs=IO.qs("cdaction","UpdateFields","param",wsp.code,"refUri",srcRef,"options",CDM.stringify(fields))
return wsp.wspServer.config.wspSrcUrl.fetchVoid(qs,{method:"POST"})}WSP.srcUpdateFields=srcUpdateFields
async function checkWspSvc(wsp,uiContext,svcCode){const resp=await wsp.wspServer.config.wspSvcExistUrl.resolve(encodeURIComponent(wsp.code)+"/"+svcCode).fetch()
return resp.ok}WSP.checkWspSvc=checkWspSvc
async function skinSetsList(wsp,uiContext,lang){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
return await wsp.wspServer.config.wspSvcSkinSet(wsp.code).fetchJson(IO.qs("cdaction","ListSkinSets","lang",lang))}WSP.skinSetsList=skinSetsList
function skinSetsIconUrl(wsp,skinCode,skinClass){return wsp.wspServer.config.wspSvcSkinSet(wsp.code).resolve(IO.qs("cdaction","GetIcon","skinCode",skinCode,"skinClass",skinClass)).url}WSP.skinSetsIconUrl=skinSetsIconUrl
function findWspReg(reg){while(reg&&reg.parentReg&&reg.parentReg.env.wsp)reg=reg.parentReg
return reg}WSP.findWspReg=findWspReg
async function removeCache(wsp){return await wsp.wspServer.config.adminWspUrl.fetchVoid(IO.qs("cdaction","RemoveCache","param",wsp.code),{method:"POST"})}WSP.removeCache=removeCache
async function reloadWsp(wsp){return await wsp.wspServer.config.adminWspUrl.fetchVoid(IO.qs("cdaction","ReloadWsp","param",wsp.code),{method:"POST"})}WSP.reloadWsp=reloadWsp})(WSP||(WSP={}))
class FetchSrcDescPending{constructor(bulk,srcRefSub,withSubItem){this.withSubItem=withSubItem
this.srcRefSub=srcRefSub
this.promise=new Promise((resolve,reject)=>{this.resolve=resolve
this.reject=reject})
bulk.set(srcRefSub,this)}}class FetchSrcDescBulk extends Map{constructor(wsp,uiContext){super()
this.wsp=wsp
this.uiContext=uiContext
Promise.resolve().then(()=>{this.wsp._pendingShortDescs=null
const pendings=[]
const pendingsWSI=[]
for(const p of this.values()){if(p.withSubItem)pendingsWSI.push(p)
else pendings.push(p)}if(pendings.length>0)WSP.fetchShortDescs(this.wsp,this.uiContext,...pendings.map(p=>p.srcRefSub)).then(results=>{for(let i=0;i<pendings.length;i++){try{pendings[i].resolve(results[i])}catch(e){ERROR.log("Fail to resolve one fetch bulk: "+pendings[i].srcRefSub,e)}}})
if(pendingsWSI.length>0)WSP.fetchShortDescsSubItems(this.wsp,this.uiContext,...pendingsWSI.map(p=>p.srcRefSub)).then(results=>{for(let i=0;i<pendingsWSI.length;i++){try{pendingsWSI[i].resolve(results[i])}catch(e){ERROR.log("Fail to resolve one fetch bulk: "+pendingsWSI[i].srcRefSub,e)}}})}).catch(e=>{for(const p of this.values()){try{p.reject(e)}catch(e){console.error(e)}}})}}async function createWspMetaUi(wspServer,wspMeta){if(!_createWspMetaUi)_createWspMetaUi=(await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js")).WspMetaUi.createWspMetaUi
return _createWspMetaUi(wspServer,wspMeta)}let _createWspMetaUi

//# sourceMappingURL=wsp.js.map