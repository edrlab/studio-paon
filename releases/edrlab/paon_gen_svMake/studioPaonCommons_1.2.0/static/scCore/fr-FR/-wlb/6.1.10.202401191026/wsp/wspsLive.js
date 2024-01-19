import{EventsMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{EHttpStatusCode,IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{EWsState,isWsMsgError}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/universe.js"
import{CommentsState}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlTypedHouse.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp_Perms.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{WSP,Wsp}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{House}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/urban.js"
import{AskForSaveReq}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/houseOt.js"
import{ESrcRights}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/security.js"
export var EWspWorkingSt;(function(EWspWorkingSt){EWspWorkingSt["r"]="r"
EWspWorkingSt["w"]="w"
EWspWorkingSt["l"]="l"
EWspWorkingSt["none"]=""})(EWspWorkingSt||(EWspWorkingSt={}))
export var EWspChangesEvts;(function(EWspChangesEvts){EWspChangesEvts["u"]="u"
EWspChangesEvts["r"]="r"
EWspChangesEvts["s"]="s"
EWspChangesEvts["perm"]="perm"
EWspChangesEvts["drvState"]="drvState"
EWspChangesEvts["drfState"]="drfState"
EWspChangesEvts["lcSt"]="lcSt"
EWspChangesEvts["rspUsrs"]="rspUsrs"})(EWspChangesEvts||(EWspChangesEvts={}))
const WspLiveDEBUG=false
export class WspsLive{constructor(wspServer){this.wspServer=wspServer
this.cleanupHousesThreshold=20
this.cleanupHousesNowThreshold=200
this._wsps=new Set
this._places=new Set
this._houses=new Map
this._fetchingHouses=new Map
this._initingSlaveHouses=new Map
this._allHouses=new Set
this._localId=1
this._lockedExternals=new Set
this._wsFrame=wspServer.chain.wsFrames.ws
if(this._wsFrame){this._wsFrame.lcListeners.on("opened",this.onWsOpened.bind(this))
this._wsFrame.lcListeners.on("closed",this.onWsClosed.bind(this))
this._wsFrame.msgListeners.on("wspWorking",this.onWspWorkingMsg.bind(this))
this._wsFrame.msgListeners.on("wspChanges",this.onWspChangesMsg.bind(this))
this._wsFrame.msgListeners.on("moan",this.onMoanMsg.bind(this))
const saveAll=this.saveAllHouses.bind(this)
if(wspServer.chain.config.local)window.addEventListener("blur",saveAll)
window.addEventListener("beforeunload",saveAll)
if(this._wsFrame.wsState===EWsState.wsOpened)this.onWsOpened()}else{this.isAvailable=false}wspServer.chain.auth.listeners.on("loggedUserChanged",(oldUser,newUser)=>{if(newUser){for(const wsp of this._wsps)if(wsp.isInError)wsp.forceReload()}else{this._wsps.clear()
for(const house of this._allHouses.values())house.killed=true
this._houses.clear()
this._allHouses.clear()}},-1)}waitForReady(){if(this._connectionReady)return Promise.resolve(true)
if(this.isAvailable===false)return Promise.resolve(false)
this.startIfNeeded()
return new Promise(resolve=>{if(this._wsFrame.wsState===EWsState.wsOpened)resolve(this.isAvailable)
else{if(!this._pendingReady)this._pendingReady=[]
this._pendingReady.push(resolve)}})}newPlace(){this.startIfNeeded()
return new WspsLivePlace(this)}findWsp(wspCd,createIfNone){for(const wsp of this._wsps)if(wsp.code===wspCd||wsp.wspAlias===wspCd)return wsp
return createIfNone?new Wsp(this.wspServer,wspCd):null}async _getHouse(wsp,srcRef){const wspRef=WSP.buildWspRef(wsp.code,srcRef)
let house=this._houses.get(wspRef)
if(house)return house
let fetching=this._fetchingHouses.get(wspRef)
if(fetching)return fetching
if(this.wspServer.config.remoteHouseOt){if(!wsp.isFullLoaded)await wsp.forceAllItemsLoaded(document.documentElement)
fetching=this.__connectRemoteHouse(wsp,srcRef,wspRef)}else{fetching=this.__fetchHouse(wsp,srcRef,wspRef)}this._fetchingHouses.set(wspRef,fetching)
try{house=await fetching}finally{this._fetchingHouses.delete(wspRef)}return house}async __connectRemoteHouse(wsp,srcUriOrId,wspUriOrId){if(!WspXmlSlaveHouseCstr||!RoadExecFrameWsCstr){const m=(await Promise.all([import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspHouse.js"),import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/moan.js")]))[0]
WspXmlSlaveHouseCstr=m.WspXmlSlaveHouse
RoadExecFrameWsCstr=m.RoadExecFrameWs}const house=new WspXmlSlaveHouseCstr({id:wspUriOrId,historyMinEntries:300})
const roadEnd=new RoadExecFrameWsCstr(this._wsFrame,house)
roadEnd.door=house.openDoor(roadEnd,{roadToMaster:true})
this._initingSlaveHouses.set(wspUriOrId,house)
const h=await house.initFromMaster(async reply=>{this._initingSlaveHouses.delete(wspUriOrId)
const srcFields=reply.datas.srcFields
const wspRefFound=WSP.buildWspRef(wsp.code,srcFields)
if(SRC.isSrcId(srcUriOrId)&&srcUriOrId!==srcFields.srcId){roadEnd.door.closeFromHouse()
return this._getHouse(wsp,SRC.srcRef(srcFields))}if(!wsp.isAvailable)await wsp.waitForAvailable(null)
const itemType=wsp.wspMetaUi.getItemType(srcFields.itModel)
initWspXmlHouse(house,wsp,itemType,wspRefFound,srcFields)
const schema=await itemType.getSchema()
const writable=(srcFields.srcRi&ESrcRights.write)==ESrcRights.write
house.resetSchema(schema,null,{autoMutate:writable,autoComplete:writable,genAnnots:true})
return house})
if(h!==house)return h
this._addHouse(house)
return house}async __fetchHouse(wsp,srcUriOrId,wspUriOrId){const qs=IO.qs("format","stream","param",wsp.code,"refUri",srcUriOrId,"fields",this.getSrcFieldNames(srcUriOrId),"204","")
const resp=await this.wspServer.config.wspSrcUrl.fetch(qs,"dom")
if(!resp.ok||resp.status===EHttpStatusCode.noContent){if(resp.status===EHttpStatusCode.noContent||resp.status===EHttpStatusCode.notFound){resp.asDom=DOM.newDomDoc()}else{console.log("Get XML failed for "+srcUriOrId,resp.error)
return null}}else if(!DOM.isDomValid(resp.asDom)){console.log("Invalid XML for "+srcUriOrId,Error("InvalidXml"))
return null}const fields=resp.headers.get("X-SCFIELDS")
if(!fields)return null
const srcFields=JSON.parse(fields)
if(SRC.isSrcId(srcUriOrId)&&srcUriOrId!==srcFields.srcId){return this._getHouse(wsp,SRC.srcRef(srcFields))}const wspRefFound=WSP.buildWspRef(wsp.code,srcFields)
if(!wsp.isAvailable)await wsp.waitForAvailable(null)
const itemType=wsp.wspMetaUi.getItemType(srcFields.itModel)
const schema=await itemType.getSchema()
const doc=DOM.cleanupDom(resp.asDom,true,false,true)
if(!WspXmlHouseCstr)WspXmlHouseCstr=(await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspHouse.js")).WspXmlHouse
const house=new WspXmlHouseCstr({id:wspRefFound,initialDoc:doc,schema:schema,customInit:function(){initWspXmlHouse(this,wsp,itemType,wspRefFound,srcFields)},buildOptions:{autoMutate:true,autoComplete:true,autoNormXml:true,autoNormChars:true,genAnnots:true},historyMinEntries:300})
house.listeners.on("dirtyChange",dirty=>{if(house.isMasterRoot()){if(dirty){this._wsFrame.postMsg({svc:"wspWorking",type:"state",uri:house.wspRef,state:EWspWorkingSt.w})
if(!house.saveTimer){const saveInterval=house.itemType.reg.getPref("item.saveInterval",1e4)
if(saveInterval)house.saveTimer=setTimeout(()=>{house.saveTimer=0
this._saveHouse(house)},saveInterval)}}else{if(house.saveTimer)clearTimeout(house.saveTimer)
this._wsFrame.postMsg({svc:"wspWorking",type:"state",uri:house.wspRef,state:this._getMergedServerStateFor(house.wspRef)})}}for(const pl of this._places){if(pl.isConcernedByWsp(house.wsp.code))pl.eventsMgr.emitCatched("houseDirtyChange",house.wspRef,house.wsp,house.srcFields,dirty)}})
if(this._connectionReady){house.states=await this._getStates(house.wspRef,false,null)
let writeState
if(house.states&&(writeState=house.states.find(st=>st.state===EWspWorkingSt.w))){this._lockHouse(house,writeState.clId,writeState.account)}else if(this._lockedExternals.has(house.wspRef)){this._lockHouse(house,".",this.wspServer.reg.env.universe.auth.currentAccount)}}else if(this._lockedExternals.has(house.wspRef)){this._lockHouse(house,".",this.wspServer.reg.env.universe.auth.currentAccount)}this._addHouse(house)
return house}getHouseIfFetched(wspRef){return this._houses.get(wspRef)}async newLocalHouse(config,wsp){if(!WspXmlHouseCstr)WspXmlHouseCstr=(await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspHouse.js")).WspXmlHouse
config.id="local:"+this._localId++
if(config.initialJml)config.initialDoc=JML.jmlToDom(config.initialJml)
if(!config.initialDoc)config.initialDoc=DOM.newDomDoc()
const doc=config.initialDoc.ownerDocument||config.initialDoc
doc.wsp=wsp
doc.srcRefMap=new Map
const house=new WspXmlHouseCstr(config)
house.wsp=wsp
this._houses.set(house.id,house)
return house}removeLocalHouse(house){house.killed=true
this._houses.delete(house.id)}async _saveHouse(house,from){if(house.saveTimer){clearTimeout(house.saveTimer)
house.saveTimer=0}if(!house.isDirty||house.killed)return
if(!house.isMasterRoot()){try{await house.listeners.emitAsync("onSave","saving")
await house.publicDoor.receiveRequest(new AskForSaveReq)
await house.listeners.emitAsync("onSave","saved")}catch(e){await house.listeners.emitAsync("onSave","saveFailed",e)
if(!house.killed)house.setDirty(true)
throw e}return}const wsp=house.wsp
const srcRef=SRC.srcRef(house.srcFields)
const qs=IO.qs("cdaction","PutSrc","param",wsp.code,"refUri",srcRef,"clId",wsp.wspServer.chain.clId,"fields",this.getSrcFieldNames(srcRef))
try{house.setDirty(false)
await house.listeners.emitAsync("onSave","saving")
const desc=await wsp.wspServer.config.wspSrcUrl.fetchJson(qs,{method:"PUT",body:DOM.ser(house.getDocumentForSave(),true)})
if(!desc)throw Error("_saveHouse result desc is null")
house.srcFields=desc
if(ITEM.getSrcUriType(desc.srcUri)==="res"){const itemFields=await wsp.fetchShortDesc(ITEM.extractItemUri(desc.srcUri))
this.dispatchLocalChange(house,wsp,itemFields,EWspChangesEvts.u,itemFields)}else{this.dispatchLocalChange(house,wsp,desc,EWspChangesEvts.u,desc)}await house.listeners.emitAsync("onSave","saved")}catch(e){await house.listeners.emitAsync("onSave","saveFailed",e)
if(!house.killed)house.setDirty(true)
throw e}}async saveHouse(wspRef){const h=this.getHouseIfFetched(wspRef)
if(h&&h.isDirty)await this._saveHouse(h)}async saveAllHouses(){var _a
try{const waitFor=[]
for(const house of this._allHouses){if(house.isDirty)waitFor.push(this._saveHouse(house))}(_a=this.cmEditors)===null||_a===void 0?void 0:_a.saveAll(waitFor)
if(waitFor.length>0)await Promise.all(waitFor)}catch(e){ERROR.log("Save houses failed",e)}}async saveItems(wspCd,itemIdents){var _a
const waiters=[]
for(const srcIdent of itemIdents){const wspRef=WSP.buildWspRef(wspCd,srcIdent)
const h=this.getHouseIfFetched(wspRef)
if(h&&h.isDirty)waiters.push(this._saveHouse(h))
else(_a=this.cmEditors)===null||_a===void 0?void 0:_a.save(srcIdent.srcUri,waiters)}return waiters.length>0?Promise.all(waiters):null}async reloadHouse(wspRef){var _a
const h=this.getHouseIfFetched(wspRef)
if(h){await this._saveHouse(h)
return this._reloadHouse(h)}return(_a=this.cmEditors)===null||_a===void 0?void 0:_a.refetchContent(wspRef)}async _reloadHouse(house){if(!house.isMasterRoot()||house.killed)return
if(house.isDirty)house.isDirty=false
this._removeHouse(house)
house.killed=true
if(house.publicDoors.length>0){const newHouse=await this._getHouse(house.wsp,SRC.srcRef(house.srcFields))
if(!newHouse)throw Error("Reload house failed: "+SRC.srcRef(house.srcFields))
if(house.lockedBy){this._unlockHouse(house)}for(const place of this._places)place._switchHouse(house,newHouse)
if(newHouse.lockedBy)newHouse.listeners.emit("onLock",true)}}_addHouse(house){this._allHouses.add(house)
this._houses.set(house.wspUri,house)
if(house.wspId)this._houses.set(house.wspId,house)
if(house.wspUriItem)this._houses.set(house.wspUriItem,house)
if(this._allHouses.size>this.cleanupHousesThreshold){if(!this._cleanupHandler)this._cleanupHandler=this._doCleanupHandler.bind(this)
if(this._allHouses.size>this.cleanupHousesNowThreshold){if(this._cleanupTimer){clearTimeout(this._cleanupTimer)
this._cleanupTimer=0}this._cleanupHandler()}else{if(!this._cleanupTimer)this._cleanupTimer=setTimeout(this._cleanupHandler,1e3)}}}_doCleanupHandler(){const countHouseBefore=this._allHouses.size
let houseToClean
let olderTime=countHouseBefore>this.cleanupHousesNowThreshold?Date.now():Date.now()-6e4
do{for(const house of this._allHouses){if(house.notUsedSince>0&&house.notUsedSince<olderTime){olderTime=house.notUsedSince
houseToClean=house}}if(houseToClean){this._removeHouse(houseToClean)
this._wsFrame.postMsg({svc:"wspWorking",type:"state",uri:houseToClean.wspRef,state:EWspWorkingSt.none})}if(this._allHouses.size>this.cleanupHousesNowThreshold){if(houseToClean){olderTime=Date.now()
continue}ERROR.log(`Too many houses in use: ${this._allHouses.size} / ${this.cleanupHousesNowThreshold}`)}break}while(true)
if(this._allHouses.size>this.cleanupHousesThreshold)this._cleanupTimer=setTimeout(this._cleanupHandler,1e4)}_removeHouse(house){var _a
this._allHouses.delete(house)
this._houses.delete(house.wspUri)
if(house.wspId)this._houses.delete(house.wspId)
if(house.wspUriItem)this._houses.delete(house.wspUriItem);(_a=house.wsp)===null||_a===void 0?void 0:_a.stopListenChanges()}_lockHouse(house,byClId,byAccount){if(house.isDirty){this._reloadHouse(house)
return}if(!house.lockedBy||house.lockedBy.clId!==byClId||house.lockedBy.account!==byAccount){house.lockedBy={clId:byClId,account:byAccount}
house.listeners.emit("onLock",true)}}_unlockHouse(house){house.lockedBy=null
house.listeners.emit("onLock",false)}_lockExternals(wspRef){var _a
if(this._lockedExternals.has(wspRef))return false
const house=this._houses.get(wspRef)
if(house){if(house.isDirty||house.lockedBy)return false
this._lockHouse(house,".",this.wspServer.reg.env.universe.auth.currentAccount)}if(((_a=this.cmEditors)===null||_a===void 0?void 0:_a.tryLockExternals(wspRef))===false)return false
this._lockedExternals.add(wspRef)
this._wsFrame.postMsg({svc:"wspWorking",type:"state",uri:wspRef,state:EWspWorkingSt.w})
return true}_unlockExternals(wspRef){var _a
this._lockedExternals.delete(wspRef)
const house=this._houses.get(wspRef)
if(house)this._unlockHouse(house);(_a=this.cmEditors)===null||_a===void 0?void 0:_a.unlockExternals(wspRef)
this._wsFrame.postMsg({svc:"wspWorking",type:"state",uri:wspRef,state:this._getMergedServerStateFor(wspRef)})}get _connectionReady(){return this.isAvailable&&this._wsFrame.wsState==EWsState.wsOpened}async _getStates(wspRef,fromCache,from){if(fromCache){const house=this._houses.get(wspRef)
if(house)return house.states||[]}if(!this._connectionReady&&!await this.waitForReady())throw Error("Not connected")
return(await this._wsFrame.sendReq({svc:"wspWorking",type:"states",uri:wspRef})).states}sendMsg(m){if(this._initPendingOut)this._initPendingOut.push(m)
else this._wsFrame.postMsg(m)}onWspWorkingMsg(m){if(WspLiveDEBUG)console.log("->WspsLive",m)
if(isWsMsgError(m)){if(m.type==="init"){this.setAvailable(false)}return}switch(m.type){case"init":{this.onWspWorkingInitMsg(m.uris||{})
break}case"state":{if(this._initPendingIn)this._initPendingIn.push(m)
else this.onWspWorkingStateMsg(m)
break}}}async onWspWorkingInitMsg(urisStates){if(this._initPendingOut){for(const m of this._initPendingOut)this._wsFrame.sendMsg(m)
this._initPendingOut=null}this._initPendingIn=[]
for(const wsp of this._wsps)await wsp.onWsConnectionRenewed(urisStates).catch(console.log)
for(const uri in urisStates){const house=this._houses.get(uri)
if(house){const uriStates=urisStates[uri]
if(uriStates.reject||uriStates.srcStamp?uriStates.srcStamp!==house.srcFields.srcStamp:uriStates.srcDt!==house.srcFields.srcDt){await this._reloadHouse(house)}else{house.states=uriStates.states
const writeState=house.states?house.states.find(st=>st.state===EWspWorkingSt.w):null
if(writeState)this._lockHouse(house,writeState.clId,writeState.account)
else if(house.lockedBy!=null)this._unlockHouse(house)}}}if(this.cmEditors)await this.cmEditors.onWspWorkingInitMsg(urisStates)
for(const place of this._places){place.eventsMgr.emitCatched("onConnectionRenewed",urisStates)}const initPendingIn=this._initPendingIn
this._initPendingIn=undefined
for(const m of initPendingIn){if(m.svc==="wspWorking")this.onWspWorkingMsg(m)
else this.onWspChangesMsg(m)}}async onMoanMsg(msg){var _a,_b,_c,_d,_e
let wspRef=msg.houseId
if(wspRef){if(wspRef[0]==="#"){const cmtHouseId=wspRef
wspRef=wspRef.substring(wspRef.indexOf("#",1)+1)
const house=this._houses.get(wspRef)
if(house){const cmtH=(_a=house.getStateById(CommentsState.CMTSTATE_ID))===null||_a===void 0?void 0:_a.getCommentHouseById(cmtHouseId);(_b=cmtH===null||cmtH===void 0?void 0:cmtH.masterDoor)===null||_b===void 0?void 0:_b.roadEnd.listenIncoming(House.MSG_FACTORYREG.newFromJson(msg))}}else{const house=this._houses.get(wspRef)
if(house)(_c=house.masterDoor)===null||_c===void 0?void 0:_c.roadEnd.listenIncoming(House.MSG_FACTORYREG.newFromJson(msg))
else if(msg.type==="initSlaveRep"||msg.type==="ack")(_e=(_d=this._initingSlaveHouses.get(wspRef))===null||_d===void 0?void 0:_d.masterDoor)===null||_e===void 0?void 0:_e.roadEnd.listenIncoming(House.MSG_FACTORYREG.newFromJson(msg))}}}onWspWorkingStateMsg(m){var _a
const wspCd=WSP.extractWspCdFromWspRef(m.uri)
const srcRef=WSP.extractSrcRefFromWspRef(m.uri)
const house=this._houses.get(m.uri)
if(house){if(m.state===EWspWorkingSt.none){if(house.states){const idx=house.states.findIndex(st=>st.clId===m.clId)
if(idx>=0)house.states.splice(idx,1)}}else{if(house.states){const idx=house.states.findIndex(st=>st.clId===m.clId)
if(idx>=0)house.states[idx].state=m.state}else{house.states=[m]}}if(m.state===EWspWorkingSt.w){this._lockHouse(house,m.clId,m.account)}else{if(house.lockedBy&&house.lockedBy.clId===m.clId){this._unlockHouse(house)}}}(_a=this.cmEditors)===null||_a===void 0?void 0:_a.onWspWorkingStateMsg(m)
for(const place of this._places){if(place.isConcernedByWsp(wspCd))place.eventsMgr.emitCatched("newWspWorkingState",m.uri,wspCd,srcRef,m.state,m.account,m.clId)}}async onWspChangesMsg(m){var _a
if(this._initPendingIn)this._initPendingIn.push(m)
else{if("wspSt"in m){return this.onWspChange(m)}else if(m.type===EWspChangesEvts.perm){const srcUri=m.srcUri
if(srcUri===""){const changesWsps=[]
this._wsps.forEach(wsp=>wsp.code===m.wspCd?changesWsps.push(wsp):null)
if(changesWsps&&changesWsps.length)try{await Promise.all(changesWsps.map(async wsp=>wsp._onWspPermChange(m)))}catch(e){console.log(e)}}const housesToFetchFields=[]
for(const house of this._allHouses){if(house.wsp.code===m.wspCd&&SRC.isSubUriOrEqual(srcUri,house.srcFields.srcUri)){housesToFetchFields.push(house)}}if(housesToFetchFields.length>0){const wsp=housesToFetchFields[0].wsp
const data=new FormData
data.append("refUris",housesToFetchFields.map(house=>SRC.srcRef(house.srcFields)).join("\t"))
const srcs=await wsp.wspServer.config.wspSrcUrl.fetchJson(IO.qs("param",wsp.code,"fields","srcRi*srcRoles"),{method:"POST",body:data})
for(let i=0;i<housesToFetchFields.length;i++){const h=housesToFetchFields[i]
h.srcFields.srcRi=srcs[i].srcRi
h.srcFields.srcRoles=srcs[i].srcRoles
h.listeners.emitCatched("onPermChange",h)}}await((_a=this.cmEditors)===null||_a===void 0?void 0:_a.onWspUriChangeMsg(m))
for(const place of this._places){if(place.isConcernedByWsp(m.wspCd))place.eventsMgr.emitCatched("wspUriChange",m,"server")}}else{if(m.type===EWspChangesEvts.u){await this.onUriChange(m.wspCd,m.srcUri)}else if(m.type===EWspChangesEvts.r){await this.onUriRemoved(m.wspCd,m.srcUri)}else if(m.type===EWspChangesEvts.lcSt||m.type===EWspChangesEvts.rspUsrs){const house=this._houses.get(WSP.buildWspUri(m.wspCd,m.srcUri))
if(house!=null){house.srcFields.srcRoles=(await house.wsp.fetchShortDesc(SRC.srcRef(m))).srcRoles
house.listeners.emitCatched("onPermChange",house)}}if(this.cmEditors)await this.cmEditors.onWspUriChangeMsg(m)
if(m.type===EWspChangesEvts.u||m.type===EWspChangesEvts.r){await this.revalidLinks(m)}for(const place of this._places){if(place.isConcernedByWsp(m.wspCd))place.eventsMgr.emitCatched("wspUriChange",m,"server")}}}}async onUriChange(wspCd,srcRef){const house=this._houses.get(WSP.buildWspUri(wspCd,srcRef))
if(house!=null)try{let reload=true
if(house.wspUriItem){try{const newSt=await this.wspServer.config.wspSrcUrl.fetchJson(IO.qs("param",wspCd,"refUri",SRC.srcRef(house.srcFields),"fields","srcStamp*srcDt"))
reload=newSt.srcStamp?house.srcFields.srcStamp!==newSt.srcStamp:house.srcFields.srcDt!==newSt.srcDt}catch(e){console.error(e)}}if(reload)await this._reloadHouse(house)}catch(e){console.error(e)}}onUriRemoved(wspCd,srcUri){if(ITEM.getSrcUriType(srcUri)==="space"){for(const house of this._allHouses){if(house.wsp.code===wspCd&&SRC.isSubUriOrEqual(srcUri,house.srcFields.srcUri)){try{this._removeHouse(house)}catch(e){console.error(e)}}}}else{const house=this._houses.get(WSP.buildWspUri(wspCd,srcUri))
if(house!=null)try{this._removeHouse(house)}catch(e){console.error(e)}}}async revalidLinks(m){if(!revalidLink)revalidLink=(await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/wed/schemaMetaWsp.js")).revalidLink
const isById=m.srcId!=null
if(ITEM.getSrcUriType(m.srcUri)==="space"){if(m.type!==EWspChangesEvts.r)return
const mapToRefresh=new Map
for(const house of this._allHouses){for(let src of house.document.srcRefMap.values()){if(src&&"srcUri"in src){if(SRC.isSubUri(m.srcUri,src.srcUri)){let srcs=mapToRefresh.get(house.wsp)
if(!srcs)mapToRefresh.set(house.wsp,srcs=new Map)
const srcRef=SRC.srcRef(src)
let houses=srcs.get(srcRef)
if(!houses)srcs.set(srcRef,houses=[])
houses.push(house)}}}}mapToRefresh.forEach((refs,wsp)=>{refs.forEach((houses,srcRef)=>{wsp.fetchShortDescSubItems(srcRef).then(shortDesc=>{const newShortDesc=shortDesc.srcSt>0?shortDesc:null
for(const house of houses){if(!house.killed)revalidLink(house,srcRef,newShortDesc)}})})})}else{let housesWithLink
const srcRef=SRC.srcRef(m)
for(const house of this._allHouses){if(isById||house.wsp.code===m.wspCd){const shortDesc=house.document.srcRefMap.get(srcRef)
if(shortDesc!==undefined){if(m.type===EWspChangesEvts.r){if(shortDesc!==null)revalidLink(house,srcRef,null)}else{if(housesWithLink)housesWithLink.push(house)
else housesWithLink=[house]}}}}if(housesWithLink){this.findWsp(m.wspCd,true).fetchShortDescSubItems(srcRef).then(shortDesc=>{const newShortDesc=shortDesc.srcSt>0?shortDesc:null
for(const house of housesWithLink){if(!house.killed)revalidLink(house,srcRef,newShortDesc)}})}}}onWspChange(m){for(const wsp of this._wsps)if(wsp.code===m.wspCd){try{wsp._onWspChange(m)}catch(e){console.log(e)}}if(m.wspSt=="loaded"||m.wspSt=="migratingDone"||m.wspSt=="migratingFailed"){for(let h of this._allHouses){if(h.wsp.code===m.wspCd){this._saveHouse(h)
this._reloadHouse(h)}}}}onWsOpened(){if(WspLiveDEBUG)console.log("onWsOpened")
this._initPendingOut=[]
this.setAvailable(true)
const m={svc:"wspWorking",type:"init"}
const mergedStates=new Map
for(const wsp of this._wsps)mergedStates.set(wsp.code,EWspWorkingSt.r)
for(const house of this._allHouses.values()){mergedStates.set(house.wspRef,house.isDirty&&house.isMasterRoot()?EWspWorkingSt.w:EWspWorkingSt.l)}for(const place of this._places){for(const[wspRef,st]of place._wspRefs.entries()){const mergedSt=mergedStates.get(wspRef)
if(WspsLive.getHigherState(mergedSt,st)!==mergedSt)mergedStates.set(wspRef,st)}}if(mergedStates.size>0){m.uris={}
for(const[uri,st]of mergedStates.entries())m.uris[uri]=st}this._wsFrame.sendMsg(m)
if(this._wsps.size>0){const wspCodes=new Set
this._wsps.forEach(w=>{wspCodes.add(w.code)})
const m2={svc:"wspChanges",type:"listen",wsps:Array.from(wspCodes)}
this._wsFrame.sendMsg(m2)}for(const house of this._allHouses.values()){if(!house.isMasterRoot())house.initFromMaster()}}onWsClosed(code,reason,wasClean){if(WspLiveDEBUG)console.log("onWsClosed")
for(const place of this._places){place.eventsMgr.emitCatched("onConnectionLost",code,reason,wasClean)}}startIfNeeded(){if(this.isAvailable!==false&&this._wsFrame.wsState!==EWsState.wsOpened)this._wsFrame.startWs()}setAvailable(available){this.isAvailable=available
if(this._pendingReady){for(const r of this._pendingReady)r(available)
this._pendingReady=undefined}}_onPlaceClose(place){this._places.delete(place)
for(const[wspRef,st]of place._wspRefs.entries()){const newSt=this._getMergedServerStateFor(wspRef)
if(WspsLive.getHigherState(newSt,st)!==newSt){this.sendMsg({svc:"wspWorking",type:"state",uri:wspRef,state:newSt})}}}async dispatchLocalChange(from,wsp,desc,event,shortDesc){if(ITEM.getSrcUriType(desc.srcUri)==="res")throw Error("_dispatchLocalChange must be called on item")
const m={svc:"wspChanges",type:event,wspCd:wsp.code,srcUri:desc.srcUri,srcId:desc.srcId,shortDesc:shortDesc}
if(m.type===EWspChangesEvts.u&&(!from||from instanceof WspsLivePlace))await this.onUriChange(m.wspCd,m.srcUri)
if(m.type===EWspChangesEvts.r)this.onUriRemoved(m.wspCd,m.srcUri)
if(this.cmEditors)await this.cmEditors.onWspUriChangeMsg(m)
if(m.type===EWspChangesEvts.u||m.type===EWspChangesEvts.r)await this.revalidLinks(m)
for(const place of this._places){if(place.isConcernedByWsp(wsp.code))place.eventsMgr.emitCatched("wspUriChange",m,from||"local")}}_getMergedServerStateFor(wspRef,exclude){var _a
const house=this._houses.get(wspRef)
if(house&&house.isDirty&&house.isMasterRoot())return EWspWorkingSt.w
if((_a=this.cmEditors)===null||_a===void 0?void 0:_a.isDirty(wspRef))return EWspWorkingSt.w
if(this._lockedExternals.has(wspRef))return EWspWorkingSt.w
let state=house?EWspWorkingSt.l:EWspWorkingSt.none
for(const place of this._places){if(place===exclude)continue
const st=place._wspRefs.get(wspRef)
if(st){if(st===EWspWorkingSt.w)return st
if(st===EWspWorkingSt.r)state=st
else if(st===EWspWorkingSt.l&&state===EWspWorkingSt.none)state=st}}return state}static getHigherState(st1,st2){if(!st1)return st2
if(!st2)return st1
return st1<st2?st2:st1}getSrcFieldNames(srcUri){return ITEM.isHistoryOrTrashUri(srcUri)?HOUSE_SRCFIELDS_HISTO:HOUSE_SRCFIELDS}}function initWspXmlHouse(house,wsp,itemType,wspRef,srcFields){wsp.listenChanges()
house.wsp=wsp
house.itemType=itemType
house.srcFields=srcFields
if(srcFields.srcId){house.wspId=wspRef
house.wspUri=WSP.buildWspUri(wsp.code,srcFields.srcUri)}else{house.wspUri=wspRef}house.wspRef=house.wspId||house.wspUri
if(ITEM.getSrcUriType(house.wspUri)==="res")house.wspUriItem=ITEM.extractItemUri(house.wspUri)}const HOUSE_SRCFIELDS="srcUri*srcId*itModel*srcStamp*srcDt*srcSt*srcRoles*srcRi"
const HOUSE_SRCFIELDS_HISTO="srcUri*srcId*itModel*srcStamp*srcDt*srcSt*srcRoles*srcRi*srcLiveUri"
let WspXmlHouseCstr
let WspXmlSlaveHouseCstr
let revalidLink
export class WspsLivePlace{constructor(wspsLive){this.wspsLive=wspsLive
this.eventsMgr=new EventsMgr
this._wspRefs=new Map
this._docHolders=new Set
this._wsps=new Map
wspsLive._places.add(this)}waitForReady(){return this.wspsLive.waitForReady()}getWsp(wspCd){let wsp=this._wsps.get(wspCd)
if(wsp)return wsp
wsp=this.wspsLive.findWsp(wspCd,true).listenChanges()
this._wsps.set(wsp.code,wsp)
this.setState(wsp.code,EWspWorkingSt.r)
return wsp}registerWsp(wsp){const curr=this._wsps.get(wsp.code)
if(curr===wsp)return wsp
if(curr)throw Error("Same wsp already registered")
wsp.listenChanges()
this._wsps.set(wsp.code,wsp)
this.setState(wsp.code,EWspWorkingSt.r)
return wsp}isConcernedByWsp(wspCd){return this._wsps.has(wspCd)}isWspUsed(wsp){return this._wsps.get(wsp.code)===wsp}async newDocHolder(wsp,refUri){const house=await this.wspsLive._getHouse(wsp,refUri)
if(house){if(!PlaceDocHolderCstr)PlaceDocHolderCstr=(await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspHouse.js")).PlaceDocHolder
return new PlaceDocHolderCstr(house,this)}return null}async getHouse(wsp,refUri){return this.wspsLive._getHouse(wsp,refUri)}setState(wspRef,newSt){const oldSt=this._wspRefs.get(wspRef)||EWspWorkingSt.none
if(oldSt===newSt)return
if(newSt!=EWspWorkingSt.none){this._wspRefs.set(wspRef,newSt)}else{this._wspRefs.delete(wspRef)}const otherSt=this.wspsLive._getMergedServerStateFor(wspRef,this)
if(WspsLive.getHigherState(otherSt,oldSt)!==WspsLive.getHigherState(otherSt,newSt)&&this.wspsLive._connectionReady){this.wspsLive.sendMsg({svc:"wspWorking",type:"state",uri:wspRef,state:newSt})}}getStates(wspRef){return this.wspsLive._getStates(wspRef,true,this)}isHouseDirty(wspRef){const house=this.wspsLive.getHouseIfFetched(wspRef)
return house?house.isDirty:false}abortChangesAndReload(house){return this.wspsLive._reloadHouse(house)}lockExternal(wspRef){if(this.wspsLive._lockExternals(wspRef)){if(this._lockExternals==null)this._lockExternals=new Set
this._lockExternals.add(wspRef)
return true}return false}unlockExternal(wspRef){this._lockExternals.delete(wspRef)
this.wspsLive._unlockExternals(wspRef)}closePlace(){for(const wsp of this._wsps.values())wsp.stopListenChanges()
for(const doc of this._docHolders)doc.close()
this.wspsLive._onPlaceClose(this)
if(this._lockExternals)for(const wspRef of this._lockExternals){this.wspsLive._unlockExternals(wspRef)}}_switchHouse(oldHouse,newHouse){for(const docHolder of this._docHolders.values()){if(docHolder.house===oldHouse)docHolder.switchHouse(newHouse)}}}let PlaceDocHolderCstr
let RoadExecFrameWsCstr

//# sourceMappingURL=wspsLive.js.map