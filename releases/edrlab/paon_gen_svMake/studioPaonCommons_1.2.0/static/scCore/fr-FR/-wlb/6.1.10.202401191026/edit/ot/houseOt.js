"use strict"
import{EventsMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{Door,ErrorMsg,House,InitSlaveRep,InitSlaveReq,Msg,ReplyMsg,ResetStatesMsg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/urban.js"
class HouseOt extends House{constructor(options={}){super(options)
this.slaveId=0
this.isDirty=false
this.initHouse(options)}get listeners(){return this._listeners||(this._listeners=new EventsMgr)}initHouse(options){if(options.otEngine==="sync"){this.otEngine=new OtEngineSync(this,options)}else{this.otEngine=new OtEngineAsync(this,options)}}openDoor(roadEnd,doorConfig={}){const isOt=doorConfig.isMaster||doorConfig.roadToMaster
return this.xDeclareDoor(new(isOt?DoorOt:Door)(this,++this._doorCounter,roadEnd,doorConfig),doorConfig)}setDirty(dirty){if(this.isDirty!==dirty){this.isDirty=dirty
if(this._listeners)this._listeners.emit("dirtyChange",dirty)}}isUndoAvailable(filter){const undoed=this.xNextUndoed(filter||msgFromPublicDoor)
if(undoed===HouseOt.SOON)return HouseOt.SOON
return undoed!==null}xNextUndoed(filter){let previousOtId=null
let msg
let invert
do{do{msg=this.otEngine.nextUndoable(previousOtId,filter)
if(!msg)return null
if(!this.otEngine.isMsgStable(msg))return HouseOt.SOON
previousOtId=msg.otId}while(msg.killed)
invert=this.otEngine.invertMsg(msg,"undo")}while(invert.killed)
if(HouseOt.ASSERT)this.assertInvertedMsg(invert,msg,"undo")
return invert}undo(fromDoor,filter){if(HouseOt.DEBUG)console.group("START UNDO")
const invert=this.xNextUndoed(filter||msgFromPublicDoor)
if(!invert||invert===HouseOt.SOON){if(HouseOt.DEBUG)console.log("CANCEL UNDO: "+invert)
return invert}else{invert.setMeta(MSGMETA_noCleanup,true);(fromDoor||this.publicDoor).receiveMsg(invert)}if(HouseOt.DEBUG)console.groupEnd()
return invert}willUndo(fromDoor,filter){return new Promise((resolve,reject)=>{try{if(this.otEngine.isHouseStabilized){resolve(this.undo(fromDoor,filter||msgFromPublicDoor)!=null)}else{this.otEngine.signalWhenStabilized(()=>{resolve(this.undo(fromDoor,filter||msgFromPublicDoor)!=null)})}}catch(e){reject(e)}})}isRedoAvailable(filter){const reoded=this.xNextRedoed(filter||msgFromPublicDoor)
if(reoded===HouseOt.SOON)return HouseOt.SOON
return reoded!==null}xNextRedoed(filter){let previousOtId=null
let msg
let invert
do{do{msg=this.otEngine.nextRedoable(previousOtId,filter)
if(!msg)return null
if(!this.otEngine.isMsgStable(msg))return HouseOt.SOON
previousOtId=msg.otId}while(msg.killed)
invert=this.otEngine.invertMsg(msg,"redo")}while(invert.killed)
if(HouseOt.ASSERT)this.assertInvertedMsg(invert,msg,"redo")
return invert}clearHistory(){this.otEngine.resetHistory(this.otEngine.sharedProgress)}assertInvertedMsg(invert,msgFrom,action){try{invert.assertMsgValidity(this)}catch(e){console.log(e)
const oldDebug=HouseOt.DEBUG
try{HouseOt.DEBUG=true
this.otEngine.invertMsg(msgFrom,action)}finally{HouseOt.DEBUG=oldDebug}throw e}}redo(fromDoor,filter){if(HouseOt.DEBUG)console.group("START REDO")
const invert=this.xNextRedoed(filter||msgFromPublicDoor)
if(!invert||invert===HouseOt.SOON){if(HouseOt.DEBUG)console.log("CANCEL REDO: "+invert)}else{invert.setMeta(MSGMETA_noCleanup,true);(fromDoor||this.publicDoor).receiveMsg(invert)}if(HouseOt.DEBUG)console.groupEnd()
return invert}willRedo(fromDoor,filter){return new Promise((resolve,reject)=>{try{if(this.otEngine.isHouseStabilized){resolve(this.redo(fromDoor,filter||msgFromPublicDoor)!=null)}else{this.otEngine.signalWhenStabilized(()=>{resolve(this.redo(fromDoor,filter||msgFromPublicDoor)!=null)})}}catch(e){reject(e)}})}initFromMaster(cbInit){this.otEngine.inited=false
return this.masterDoor.sendRequest(this.xCreateInitSlaveReq()).then(async rep=>{if(cbInit){const h=await cbInit(rep)
if(h!==this)return h}this.slaveId=rep.slaveId
this.otEngine.resetHistory(rep.datas.progress)
this.xApplyResetStatesLocally(rep)
this.broadcastMsg((new ResetStatesMsg).init(rep.datas).setDoorId(this.masterDoor.id),this.masterDoor.id)
return this})}onMsg(msg,fromDoor){if(msg instanceof MsgOt&&msg.isProgressSensitive){this.otEngine.onMsgOt(msg,fromDoor)
if(!this.isDirty&&msg.isBodyMutator&&msg.getMeta("corr")!=="init")this.setDirty(true)
return}switch(msg.type){case InitSlaveReq.type:{this.otEngine.replyInitSlave(msg,fromDoor)
return}case ResetStatesMsg.type:{this.otEngine.resetHistory(msg.datas.progress)
this.xApplyResetStatesLocally(msg)
this.broadcastMsg(msg,this.masterDoor.id)
return}case UndirtyMsgOt.type:{if(this.otEngine.isHouseStabilized&&msg.prg==this.otEngine.sharedProgress){this.setDirty(false)}return}}if(msg instanceof ErrorMsg){this.broadcastMsgToPublicDoors(msg)}}async onRequest(msg,fromDoor){switch(msg.type){case AskForSaveReq.type:{if(!this.isMasterRoot()){if(!this.otEngine.isHouseStabilized)await this.otEngine.waitForStabilized()
return this.masterDoor.sendRequest(msg)}}}}xCreateInitSlaveReq(){return new InitSlaveReq}xApplyResetStatesLocally(msg){this.setDirty(false)}}HouseOt.SOON="soon"
const msgFromPublicDoor=function(m){return m.doorId<0}
class DoorOt extends Door{constructor(house,doorId,roadEnd,configDoor){super(house,doorId,roadEnd,configDoor)
this._otEngine=house.otEngine}sendMsg(msg){if(msg.isProgressSensitive)msg.prg=this._otEngine.sharedProgress
this.roadEnd.pushMsg(msg)}sendRequest(msg){if(msg.isProgressSensitive)msg.prg=this._otEngine.sharedProgress
return this.roadEnd.pushRequest(msg)}receiveMsg(msg){if(House.DEBUG)console.group(`ReceiveMsg in ${this.house} : ${msg}`)
msg.setDoorId(this.id)
if(msg.isProgressSensitive)this._otEngine.adjustOrForwardForeignMsg(msg,this)
this.house.onMsg(msg,this)
if(House.DEBUG)console.groupEnd()}}class OtEngineSync{constructor(house,options){this.startProgress=0
this._sharedHist=[]
this.house=house
this._histMinEntries=options.historyMinEntries||100
this._histMaxEntries=options.historyMaxEntries||this._histMinEntries+50
this.inited=true}get sharedProgress(){return this._sharedHist.length}getMsgByOtId(otId){return this._sharedHist[otId]}onMsgOt(msg,fromDoor){if(!this.inited)return
if(this.house.isMasterRoot()){try{msg=this.house.xApplyMsgOtLocally(msg,true,fromDoor.isPublic()?msg.getMeta(MSGMETA_noCleanup):false)
this.historicizeMsg(msg)}catch(e){this.house.onInternalError(e)
return}this.house.broadcastMsg(msg)}else if(fromDoor.isPublic()){this.house.masterDoor.sendMsg(msg)}else if(fromDoor.isDoorToMaster){try{this.house.xApplyMsgOtLocally(msg,false)
this.historicizeMsg(msg)}catch(e){this.house.onInternalError(e)
return}this.house.broadcastMsg(msg,fromDoor.id)}else if(fromDoor.isDoorToSlave){this.house.masterDoor.sendMsg(msg)}}historicizeMsg(msg){if(!msg.isBodyMutator)return
msg.otId=this._sharedHist.length
this._sharedHist.push(msg)
if(this._sharedHist.length-this.startProgress>this._histMaxEntries){const newOldestProgress=this._sharedHist.length-this._histMinEntries
for(let i=this.startProgress;i<newOldestProgress;i++){delete this._sharedHist[i]}this.startProgress=newOldestProgress}}invertMsg(msg,action){const invert=msg.invert()
invert.inMigration(true)
invert.setMeta(action,msg.otId)
if(HouseOt.DEBUG)console.log(action+": invert : "+msg+"  ->  "+invert)
this.xAdjustMsgForUndoRedo(msg,invert)
invert.inMigration(false)
return invert}xAdjustMsgForUndoRedo(msg,invert){if(HouseOt.ASSERT)if(this._sharedHist[msg.otId]!==msg)throw Error("this._sharedHist[msg.otId] !== msg!!!")
for(let i=msg.otId+1,s=this._sharedHist.length;i<s;i++){const entry=this._sharedHist[i]
if(entry.slvId===this.house.slaveId){if(entry.metas){entry.cross(invert,entry.metas.redo||entry.metas.undo)}else{entry.cross(invert,null)}if(HouseOt.DEBUG)console.log(`Cross inverted via sharedHist : ${entry} -> ${invert}`)}else{entry.adjust(invert)
if(HouseOt.DEBUG)console.log(`Adjust inverted via sharedHist : ${entry}  ->  ${invert}`)}}}adjustOrForwardForeignMsg(msg,fromDoor){if(msg.prg<this.startProgress)throw ErrorMsg.OUT_OF_SYNC
const houseProgress=this.sharedProgress
if(msg.prg<houseProgress){msg.inMigration(true)
for(let i=msg.prg;i<houseProgress;i++){const histoMsg=this._sharedHist[i]
if(histoMsg.doorId!==fromDoor.id){histoMsg.adjust(msg)
if(HouseOt.DEBUG)console.log("Adjusted via "+histoMsg+" --\x3e "+msg)}else{histoMsg.forward(msg)
if(HouseOt.DEBUG)console.log("Forwarded via "+histoMsg+" --\x3e "+msg)}}}msg.inMigration(false)}replyInitSlave(initSlaveReq,fromDoor){const datas=Object.create(null)
this.house.writeFullStates(datas,initSlaveReq.metas)
datas.progress=this.sharedProgress
fromDoor.sendMsg((new InitSlaveRep).init(initSlaveReq,this.house.newSlaveId(),datas))}resetHistory(startProgress){this.startProgress=startProgress
this._sharedHist=[]
if(startProgress>0)this._sharedHist[startProgress-1]=true
this.inited=true}nextUndoable(beforeOtId,filter){const it=this.newHistIterator()
let msg=beforeOtId!=null?it.gotoProgress(beforeOtId).gotoPrevious().getMsg():it.gotoLast().getMsg()
while(msg&&msg.isUndoable){if(filter(msg)){if(msg.metas&&"undo"in msg.metas)it.gotoProgress(msg.metas.undo)
else return msg}msg=it.gotoPrevious().getMsg()}return null}nextRedoable(beforeOtId,filter){const it=this.newHistIterator()
let msg=beforeOtId!=null?it.gotoProgress(beforeOtId).gotoPrevious().getMsg():it.gotoLast().getMsg()
while(msg&&msg.isUndoable){if(filter(msg)){if(msg.metas){if("redo"in msg.metas){it.gotoProgress(msg.metas.redo)
msg=it.gotoPrevious().getMsg()
continue}else if("undo"in msg.metas){return msg}}return null}msg=it.gotoPrevious().getMsg()}return null}newHistIterator(){return new HistIteratorSync(this)}isMsgStable(msg){return true}get isHouseStabilized(){return true}signalWhenStabilized(callback){Promise.resolve().then(callback)}waitForStabilized(){return Promise.resolve()}}class HistIteratorSync{constructor(otEngine){this._first=otEngine.startProgress
this._sharedHist=otEngine._sharedHist
this._offset=-1}gotoLast(){this._offset=this._sharedHist.length-1
return this}gotoPrevious(){this._offset--
return this}gotoProgress(progress){this._offset=progress
return this}getMsg(){if(this._offset<this._first||this._offset>=this._sharedHist.length)return null
return this._sharedHist[this._offset]}}class OtEngineAsync extends OtEngineSync{constructor(house,options){super(house,options)
this._transientHist=new TransientHist(this,options)}getMsgByOtId(otId){const res=otId>=0?this._sharedHist[otId]:this._transientHist.getMsg(otId)
if(HouseOt.ASSERT)if(res&&res.otId!==otId)throw Error(`getMsgByOtId(): ${res.otId} != ${otId}`)
return res}onMsgOt(msg,fromDoor){if(!this.inited)return
if(fromDoor.isPublic()){try{msg=this.house.xApplyMsgOtLocally(msg,true,msg.getMeta(MSGMETA_noCleanup))
this._transientHist.appendMsg(msg)}catch(e){this.house.onInternalError(e)
return}this.house.broadcastMsgToPublicDoors(msg)}else if(fromDoor.isDoorToMaster){if(msg.slvId==this.house.slaveId){try{this._transientHist.transferMsgToSharedHist()}catch(e){this.house.onInternalError(e)
return}}else{let msgToApply
try{msgToApply=this._transientHist.catchupWithForeignMsg(msg)
this.house.xApplyMsgOtLocally(msgToApply,false)
this.historicizeMsg(msg)}catch(e){this.house.onInternalError(e)
return}this.house.broadcastMsgToPublicDoors(msgToApply)}this.house.broadcastMsg(msg,fromDoor.id,Door.FILTER_NOT_PUBLIC)}else if(fromDoor.isDoorToSlave){if(this.house.isMasterRoot()){try{msg=this.house.xApplyMsgOtLocally(msg,true)
this.historicizeMsg(msg)}catch(e){this.house.onInternalError(e)
return}this.house.broadcastMsg(msg)}else{throw Error("TODO proxy house intermédiaire à revoir...")}}else{console.trace("Unknown msg coming from !!")}}invertMsg(msg,action){this._transientHist.finalizeEdenMsg()
const invert=msg.invert()
invert.inMigration(true)
invert.setMeta(action,msg.otId)
if(HouseOt.DEBUG)console.log(action+": invert : "+msg+"  ->  "+invert)
if(msg.otId>=0){this.xAdjustMsgForUndoRedo(msg,invert)
this._transientHist.adjustMsgForUndoRedo(invert,0)}else{this._transientHist.adjustMsgForUndoRedo(invert,msg.otId)}invert.inMigration(false)
return invert}replyInitSlave(initSlaveReq,fromDoor){if(this._transientHist.isSync()){super.replyInitSlave(initSlaveReq,fromDoor)}else{this._transientHist.addSignalInSync(()=>{super.replyInitSlave(initSlaveReq,fromDoor)})}}newHistIterator(){return new HistIteratorAsync(this)}isMsgStable(msg){return msg.otId>=0}get isHouseStabilized(){return this._transientHist.isSync()}signalWhenStabilized(callback){if(this._transientHist.isSync()){Promise.resolve().then(callback)}else{this._transientHist.addSignalInSync(callback)}}waitForStabilized(){if(this._transientHist.isSync()){return Promise.resolve()}else{return new Promise(resolve=>{this._transientHist.addSignalInSync(resolve)})}}}class TransientHist{constructor(engineOt,options){this.engineOt=engineOt
this._hist=[]
this._firstActive=0
this._pendings=[]
this.engineOt=engineOt
this.house=engineOt.house
this.mergeEditMaxInterval=options.mergeEditMaxInterval||700}isSync(){return!this._eden&&this._firstActive===this._hist.length}getMsg(otId){if(otId===TransientHist.OTID_EDEN)return this._eden
return this._hist[-1-otId]}appendMsg(msg){if(this._eden){const mergeMsg=this._eden.mergeWith(msg)
if(mergeMsg){this._eden=mergeMsg}else{this.finalizeEdenMsg()
this._eden=msg}}else{this._eden=msg}if(this._finalizeThread!==null)clearTimeout(this._finalizeThread)
if(this.mergeEditMaxInterval<0||!TransientHist.isMergeableMsg(this._eden)){this.finalizeEdenMsg()}else{this._eden.otId=TransientHist.OTID_EDEN
this._finalizeThread=window.setTimeout(()=>{this.finalizeEdenMsg()},this.mergeEditMaxInterval)}}static isMergeableMsg(msg){if(msg.metas&&(msg.metas.undo!=null||msg.metas.redo!=null))return false
return msg.isMergeable||false}finalizeEdenMsg(){const msg=this._eden
if(!msg)return
this._eden=null
if(this.house.isMasterRoot()){this.engineOt.historicizeMsg(msg)
this.house.broadcastMsg(msg,0,Door.FILTER_NOT_PUBLIC)
this.xSignalInSync()}else{const offset=this._hist.length
this._hist.push(msg)
msg.otId=-this._hist.length
const msgToSend=msg.clone()
if(HouseOt.DEBUG)console.group(`Send to master from ${this.engineOt.house} ${msgToSend}`)
if(offset>this._firstActive){msgToSend.inMigration(true)
for(let i=offset-1;i>=this._firstActive;i--){this._hist[i].rewind(msgToSend)
if(HouseOt.DEBUG)console.log(`Rewinded via transient ${this._hist[i]} -> ${msgToSend}`)}}if(HouseOt.DEBUG)console.groupEnd()
this._pendings.push(msgToSend)
this.house.masterDoor.sendMsg(msgToSend)}}transferMsgToSharedHist(){const msgToMove=this._hist[this._firstActive]
if(msgToMove.metas){if(msgToMove.metas.undo<0)msgToMove.metas.undo=this._hist[-1-msgToMove.metas.undo]
if(msgToMove.metas.redo<0)msgToMove.metas.redo=this._hist[-1-msgToMove.metas.redo]}this.engineOt.historicizeMsg(msgToMove)
if(this._firstActive+1==this._hist.length){this._hist.length=0
this._pendings.length=0
this._firstActive=0
if(!this._eden)this.xSignalInSync()}else{this._hist[this._firstActive]=msgToMove.otId
const pendingToRemove=this._pendings[this._firstActive]
pendingToRemove.inMigration(false)
for(let i=this._firstActive+1;i<this._pendings.length;i++){if(HouseOt.DEBUG)console.group(`Wil forward pending via ${pendingToRemove} : ${this._pendings[i]}`)
pendingToRemove.forward(this._pendings[i])
if(HouseOt.DEBUG)console.log(`Pending forwarded : ${this._pendings[i]}`)
if(HouseOt.DEBUG)console.groupEnd()}this._pendings[this._firstActive]=null
this._firstActive++}}catchupWithForeignMsg(msg){var _a
if(this.isSync())return msg
if(!msg.isBodyMutator){if(msg.isProgressSensitive){for(let i=this._firstActive;i<this._pendings.length;i++){this._pendings[i].adjust(msg)}(_a=this._eden)===null||_a===void 0?void 0:_a.adjust(msg)}return msg}this.finalizeEdenMsg()
if(HouseOt.DEBUG)console.group("Catching in "+this.engineOt.house+" for "+msg)
for(let i=this._firstActive;i<this._pendings.length;i++){const pending=this._pendings[i]
if(HouseOt.DEBUG)console.group("Will adjust pending "+pending)
pending.inMigration(true)
msg.adjust(pending)
if(HouseOt.DEBUG)console.log("Adjusted pending "+pending)
if(HouseOt.DEBUG)console.groupEnd()}const pendingStack=[this._pendings[this._firstActive].clone()]
pendingStack[0].inMigration(false)
for(let i=this._firstActive+1;i<this._pendings.length;i++){const pending=this._pendings[i].clone()
if(HouseOt.DEBUG)console.group(`Will forward pending ${pending}`)
for(let k=0;k<pendingStack.length;k++){pendingStack[k].forward(pending)
if(HouseOt.DEBUG)console.log(`Forwarded via ${pendingStack[k]} ->  ${pending}`)}pending.inMigration(false)
if(HouseOt.DEBUG)console.groupEnd()
pendingStack.push(pending)}const transientInvertedStack=[]
for(let i=pendingStack.length-1,p=this._hist.length-1;i>=0;i--){const mirrorMsg=this._hist[p]
const msg=pendingStack[i]
msg.otId=mirrorMsg.otId
this._hist[p--]=msg
if(!mirrorMsg.killed)transientInvertedStack.push(mirrorMsg.invert())}if(HouseOt.DEBUG)console.log(`Transient inverted to apply ${transientInvertedStack}`)
if(HouseOt.DEBUG)console.log(`Pending to apply ${pendingStack}`)
if(HouseOt.DEBUG)console.groupEnd()
return(new ListMsgOt).initList(transientInvertedStack.concat(msg,pendingStack))}adjustMsgForUndoRedo(msg,afterOtId){if(HouseOt.ASSERT)if(afterOtId>0)throw Error("afterOtId > 0 !!!")
if(afterOtId===TransientHist.OTID_EDEN)return
for(let i=Math.max(this._firstActive,-afterOtId),s=this._hist.length;i<s;i++){const entry=this._hist[i]
if(entry.metas){entry.cross(msg,entry.metas.redo||entry.metas.undo)}else{entry.cross(msg,null)}if(HouseOt.DEBUG)console.log(`Cross inverted via transient : ${entry} -> + ${msg}`)}if(this._eden)throw Error("Eden msg should be finilized here. Or to do !")}addSignalInSync(func){if(!this._signalInSync)this._signalInSync=[]
this._signalInSync.push(func)}xSignalInSync(){const arr=this._signalInSync
if(arr==null)return
this._signalInSync=null
for(let i=0,s=arr.length;i<s;i++)arr[i]()}}TransientHist.OTID_EDEN="e"
class HistIteratorAsync{constructor(otEngine){this._transientHist=otEngine._transientHist
this._startSharedPrg=otEngine.startProgress
this._sharedHist=otEngine._sharedHist
this._prg=null}gotoLast(){if(this._transientHist._eden)this._prg=TransientHist.OTID_EDEN
else if(this._transientHist._hist.length>this._transientHist._firstActive)this._prg=-this._transientHist._hist.length
else this._prg=this._startSharedPrg<this._sharedHist.length?this._sharedHist.length-1:null
return this}gotoPrevious(){if(this._prg>=0){this._prg=this._prg>this._startSharedPrg?this._prg-1:null
return this}if(this._prg<0){const offsetTransient=-1-this._prg
if(this._transientHist._firstActive<offsetTransient){this._prg=offsetTransient<this._transientHist._hist.length?this._prg+1:null
return this}this._prg=this._startSharedPrg<this._sharedHist.length?this._sharedHist.length-1:null
return this}if(this._prg===TransientHist.OTID_EDEN){if(this._transientHist._hist.length>this._transientHist._firstActive)this._prg=-this._transientHist._hist.length
else this._prg=this._startSharedPrg<this._sharedHist.length?this._sharedHist.length-1:null}return this}gotoProgress(progress){this._prg=progress
return this}getMsg(){if(this._prg>=0)return this._sharedHist[this._prg]
if(this._prg<0){const offset=-1-this._prg
return offset>=this._transientHist._firstActive?this._transientHist._hist[offset]:null}if(this._prg===TransientHist.OTID_EDEN)return this._transientHist._eden
return null}}class MsgOt extends Msg{get isProgressSensitive(){return true}get isBodyMutator(){return false}get isPrimary(){return true}decompose(){return this}adjust(msg){}rewind(msg){}forward(msg){}cross(msg,invertOfOtId){}inMigration(inMigr){}copyStableMetasFrom(other){if(other.metas)for(const k in other.metas){if(k.charAt(0)==="$")this.setMeta(k,other.metas[k])}return this}get isUndoable(){return true}get isMergeable(){return true}mergeWith(nextMsg){return null}assertMsgValidity(house){}toJson(json){super.toJson(json)
json.prg=this.prg
json.slvId=this.slvId}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.prg=json.prg
this.slvId=json.slvId}cloneFrom(o,purpose){super.cloneFrom(o,purpose)
this.prg=o.prg
this.slvId=o.slvId
if(purpose==="hist")this.doorId=o.doorId}setHouseId(house){this.houseId=house.id
this.slvId=house.slaveId
return this}}function isMsgOt(msg){return msg&&"otId"in msg}export function isMsgUpdater(msg){return msg&&"applyUpdates"in msg}class ListMsgOt extends MsgOt{constructor(){super(...arguments)
this.inMigr=false}initHouse(slaveId,doorId){this.slvId=slaveId
if(doorId)this.doorId=doorId
return this}initList(msgs,inMigr){this.msgs=msgs
if(inMigr)this.inMigr=true
return this}initConcurrentList(msgs,inMigr){for(let i=0;i<msgs.length;i++){const m=msgs[i]
for(let k=0;k<i;k++)msgs[k].adjust(m)}this.msgs=msgs
if(inMigr)this.inMigr=true
return this}setDoorId(doorId){this.doorId=doorId
this.msgs.forEach(m=>{m.setDoorId(doorId)})
return this}setHouseId(house){super.setHouseId(house)
this.msgs.forEach(m=>{m.setHouseId(house)})
return this}get isBodyMutator(){return this.msgs.some(m=>m.isBodyMutator)}get isPrimary(){return this.msgs.every(m=>m.isPrimary)}get isMergeable(){return false}decompose(){return(new this.constructor).initList(this.msgs.map(m=>m.decompose()),this.inMigr)}adjust(msg){this.msgs.forEach(m=>{m.adjust(msg)})}rewind(msg){for(let i=this.msgs.length-1;i>=0;i--)this.msgs[i].rewind(msg)}forward(msg){for(let i=0,s=this.msgs.length;i<s;i++)this.msgs[i].forward(msg)}cross(msg,invertOfOtId){const s=this.msgs.length-1
this.msgs.forEach((m,i)=>{if(!m.otId)m.otId=this.otId+"_"+i
m.cross(msg,invertOfOtId!=null?invertOfOtId+"_"+(s-i):null)})}inMigration(inMigr){if(inMigr){if(this.inMigr)return
this.inMigr=true
if(HouseOt.DEBUG)console.group("Enter in migr : "+this)
for(let i=this.msgs.length-1;i>=0;i--){const m=this.msgs[i]
if(HouseOt.DEBUG)if(i>0)console.log("Will rewind : "+m)
m.inMigration(true)
for(let k=i-1;k>=0;k--){this.msgs[k].rewind(m)
if(HouseOt.DEBUG)console.log("  Rewinded via "+this.msgs[k]+" : "+m)}}if(HouseOt.DEBUG)console.groupEnd()}else{if(!this.inMigr)return
this.inMigr=false
if(HouseOt.DEBUG)console.group("Leave migr : "+this)
for(let i=0,s=this.msgs.length;i<s;i++){const m=this.msgs[i]
if(HouseOt.DEBUG)if(i<s-1)console.log("Forward via "+m)
m.inMigration(false)
for(let k=i+1;k<s;k++){m.forward(this.msgs[k])
if(HouseOt.DEBUG)console.log("  Forwarded : "+this.msgs[k])}}if(HouseOt.DEBUG)console.groupEnd()}}get killed(){return this.msgs.every(m=>m.killed)}kill(){this.msgs.forEach(m=>{m.kill()})}get isUndoable(){return this.msgs.every(m=>m.isUndoable)}invert(){if(HouseOt.ASSERT)if(this.inMigr)throw Error("ListMsgOt.invert() called while this msg is in migration")
const newMsgs=[]
for(let i=this.msgs.length-1;i>=0;i--)newMsgs.push(this.msgs[i].invert())
return(new this.constructor).initList(newMsgs).copyStableMetasFrom(this)}applyUpdates(state){this.msgs.forEach(m=>{state.update(m)})}toJson(json){super.toJson(json)
json.inMigr=this.inMigr
json.list=this.msgs.map(m=>m.asJson())}toStruct(struct){super.toStruct(struct)
struct.inMigr=this.inMigr
struct.list=this.msgs.map(m=>m.asStruct())}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.inMigr=json.inMigr
this.msgs=json.list.map(m=>factoryReg.newFromJson(m))}fromStruct(struct,factoryReg){super.fromStruct(struct,factoryReg)
this.inMigr=struct.inMigr
this.msgs=struct.list.map(m=>factoryReg.newFromStruct(m))}cloneFrom(o,purpose){super.cloneFrom(o,purpose)
this.inMigr=o.inMigr
this.msgs=o.msgs.map(m=>m.clone(purpose))}toString(){const json=this.asJson()
if(this.otId)json.otId=this.otId
if(this.inMigr)json.inMigr=true
return JSON.stringify(json)}}ListMsgOt.type="listOt"
House.MSG_FACTORYREG.register(ListMsgOt)
export class UndirtyMsgOt extends Msg{fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.prg=json.prg
this.props=json.props}toJson(json){super.toJson(json)
json.prg=this.prg
json.props=this.props}}UndirtyMsgOt.type="undirty"
House.MSG_FACTORYREG.register(UndirtyMsgOt)
export class AskForSaveReq extends Msg{}AskForSaveReq.type="askForSave"
House.MSG_FACTORYREG.register(AskForSaveReq)
export class SaveRep extends ReplyMsg{}SaveRep.type="saveRep"
House.MSG_FACTORYREG.register(SaveRep)
export const MSGMETA_noCleanup="noCleanup"
export{HouseOt,MsgOt,isMsgOt,ListMsgOt}

//# sourceMappingURL=houseOt.js.map