class Locality{constructor(options={}){this.id=options.id}setId(id){if(this.id)throw"Id already setted : "+this.id
this.id=id
return this}toString(){return this.id}}export class FactoryRegistry{constructor(name,parent){this.name=name
this._parent=parent
this._msgFactories={}}register(factory){this._msgFactories[factory.type]=factory}getFactory(type){let factory=this._msgFactories[type]
if(!factory){if(this._parent)factory=this._parent.getFactory(type)
if(!factory)console.log("Type '"+type+"' not found in FactoryRegistry "+this.name)}return factory}newFromJson(json){return this.getFactory(json.type).buildFromJson(json,this)}newFromStruct(struct){return this.getFactory(struct.type).buildFromJson(struct,this)}}export class House extends Locality{constructor(options){super(options)
this._doors=[]
this._publicDoors=[]
this._doorCounter=0}openDoor(roadEnd,doorConfig){return this.xDeclareDoor(new Door(this,++this._doorCounter,roadEnd,doorConfig),doorConfig)}xDeclareDoor(newDoor,doorConfig){if(doorConfig.roadToMaster){if(this._masterDoor)throw new Error("Master door already setted")
this._masterDoor=newDoor
if(doorConfig.autoInitFromMaster)this.initFromMaster()}else{this._doors.push(newDoor)}return newDoor}closeDoor(door){if(door===this._masterDoor){this._masterDoor=null
this.broadcastMsgToPublicDoors((new ErrorMsg).init("masterDoorClosed"))
return true}if(door.isPublic()){const idx=this._publicDoors.indexOf(door)
if(idx<0)return false
this._publicDoors.splice(idx,1)}else{const idx=this._doors.indexOf(door)
if(idx<0)return false
this._doors.splice(idx,1)}return true}killHouse(){this.broadcastMsgToPublicDoors((new ErrorMsg).init("houseKilled"))
this._publicDoors.length=0
this._doors.forEach(d=>d.closeFromHouse())
this._doors.length=0
if(this._masterDoor)this._masterDoor.closeFromHouse()
this._masterDoor=null}openPublicDoor(){const door=new PublicDoor(this,-++this._doorCounter)
this._publicDoors.push(door)
return door}get publicDoor(){if(this._publicDoors.length==0)return this.openPublicDoor()
return this._publicDoors[0]}get publicDoors(){return this._publicDoors}isDoorPublic(doorId){return doorId<0}get masterDoor(){return this._masterDoor}get otherDoors(){return this._doors}isMasterRoot(){return!this._masterDoor}broadcastMsg(msg,exceptDoorId=0,doorFilter){function dispatch(door){if(!door||door.id===exceptDoorId)return
if(doorFilter&&doorFilter(door)===false)return
try{door.sendMsg(msg)}catch(e){console.trace(e)}}this._publicDoors.forEach(dispatch)
dispatch(this._masterDoor)
this._doors.forEach(dispatch)}broadcastMsgToPublicDoors(msg){for(const door of this._publicDoors)try{door.sendMsg(msg)}catch(e){console.trace(e)}}onInternalError(e){console.log("Reinit house on internal error",e)
if(this.isMasterRoot()){const datas={}
this.writeFullStates(datas)
this.broadcastMsg((new ResetStatesMsg).init(datas))}else{this.initFromMaster()}}newSlaveId(){if(!this._slaveIdCounter)this._slaveIdCounter=0
return++this._slaveIdCounter}}House.DEBUG=false
House.ASSERT=false
House.MSG_FACTORYREG=new FactoryRegistry("Msg")
House.STATE_FACTORYREG=new FactoryRegistry("State")
export class Door{constructor(house,doorId,roadEnd,configDoor){this.house=house
this.id=doorId
this.roadEnd=roadEnd
if(configDoor&&configDoor.isMaster)this.isDoorToSlave=true}get isDoorToMaster(){return this.house.masterDoor===this}isPublic(){return false}sendMsg(msg){this.roadEnd.pushMsg(msg)}sendRequest(msg){return this.roadEnd.pushRequest(msg)}receiveMsg(msg){if(House.DEBUG)console.group(`Receive msg in ${this.house} : ${msg}`)
msg.setDoorId(this.id)
this.house.onMsg(msg,this)
if(House.DEBUG)console.groupEnd()}closeFromHouse(){this.roadEnd.doorClosed()}toString(){return"Door "+this.house+"."+this.id}}Door.FILTER_NOT_PUBLIC=function(door){return!door.isPublic()}
export class PublicDoor{constructor(house,doorId){this.house=house
this.id=doorId
this._listeners=new Set}get isDoorToSlave(){return false}get isDoorToMaster(){return false}isPublic(){return true}addMsgListener(listener){this._listeners.add(listener)}removeMsgListener(listener){this._listeners.delete(listener)}sendMsg(msg){this._listeners.forEach(l=>{l(msg)})}dispatchMsg(msg){this._listeners.forEach(l=>{l(msg)})}receiveMsg(msg){if(House.DEBUG)console.group(`Public msg in ${this.house}.${this.id}`,msg)
msg.setHouseId(this.house)
msg.setDoorId(this.id)
this.house.onMsg(msg,this)
if(House.DEBUG)console.groupEnd()}receiveRequest(msg){msg.setHouseId(this.house)
msg.setDoorId(this.id)
return this.house.onRequest(msg,this)}toString(){return"PublicDoor "+this.house+"."+this.id}}export class RoadEnd{constructor(){this._counter=0}pushMsg(msg){this.xPushMsg(msg)}pushRequest(msg){msg=Object.create(msg)
msg.repWId=++this._counter
const memory={}
const promise=new Promise((resolve,reject)=>{if(memory._ack){if(memory._ack.isOk)resolve(memory._ack)
else reject(memory._ack)}else{memory._resolve=resolve
memory._reject=reject}})
if(!this._pendingMsg)this._pendingMsg=new Map
this._pendingMsg.set(msg.repWId,memory)
this.xPushMsg(msg)
return promise}listenIncoming(msg){if(msg instanceof ReplyMsg&&this._pendingMsg){const memory=this._pendingMsg.get(msg.forId)
if(memory){this._pendingMsg.delete(msg.forId)
if(memory._resolve){if(msg.isOk)memory._resolve(msg)
else memory._reject(msg)}else{memory._ack=msg}return}}try{this.door.receiveMsg(msg)}catch(e){console.error(e)
this.pushMsg((new ErrorMsg).init(e,msg))}}newRoadFor(house,config){throw Error("not implemented")}}export class Msg{static buildFromJson(json,factoryReg){const obj=new this
obj.fromJson(json,factoryReg)
return obj}static buildFromStruct(struct,factoryReg){const obj=new this
obj.fromStruct(struct,factoryReg)
return obj}get type(){return this.constructor.type}setMeta(key,val){if(!this.metas)this.metas=Object.create(null)
this.metas[key]=val
return this}getMeta(key){return this.metas?this.metas[key]:null}setDoorId(doorId){this.doorId=doorId
return this}setHouseId(house){this.houseId=house.id
return this}clone(purpose){const clone=new this.constructor
clone.cloneFrom(this,purpose)
return clone}asJson(){const obj=Object.create(null)
this.toJson(obj)
return obj}asStruct(){const obj=Object.create(null)
this.toStruct(obj)
return obj}toJson(json){json.type=this.type
json.houseId=this.houseId
if(this.id)json.id=this.id
if(this.metas)json.metas=this.metas
if(this.repWId)json.repWId=this.repWId}fromJson(json,factoryReg){this.houseId=json.houseId
if(json.id)this.id=json.id
if(json.metas)this.metas=json.metas
if(json.repWId)this.repWId=json.repWId}cloneFrom(o,purpose){this.houseId=o.houseId
if(o.id)this.id=o.id
if(o.metas)this.metas=JSON.parse(JSON.stringify(o.metas))
if(o.repWId)this.repWId=o.repWId}toStruct(struct){this.toJson(struct)}fromStruct(struct,factoryReg){this.fromJson(struct,factoryReg)}toString(){return JSON.stringify(this.asJson())}}export class ErrorMsg extends Msg{init(error,forMsg){this.error=error
this.forMsg=forMsg
return this}toJson(json){super.toJson(json)
json.forMsg=this.forMsg.asJson()
json.error=this.error}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
if(json.forMsg)this.forMsg=factoryReg.newFromJson(json.forMsg)
this.error=json.error}cloneFrom(o,purpose){super.cloneFrom(o,purpose)
if(o.forMsg)this.forMsg=o.forMsg.clone(purpose)
this.error=o.error}}ErrorMsg.type="error"
ErrorMsg.OUT_OF_SYNC="outOfSync"
House.MSG_FACTORYREG.register(ErrorMsg)
export class ReplyMsg extends Msg{initAck(msg,error){this.forId=msg.repWId
if(error)this.error=error
return this}get isOk(){return!this.error}toJson(json){super.toJson(json)
json.forId=this.forId
if(this.error)json.error=this.error}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.forId=json.forId
if(json.error)this.error=json.error}cloneFrom(o,purpose){super.cloneFrom(o,purpose)
this.forId=o.forId
if(o.error)this.error=o.error}}ReplyMsg.type="ack"
House.MSG_FACTORYREG.register(ReplyMsg)
export class InitSlaveReq extends Msg{}InitSlaveReq.type="initSlaveReq"
House.MSG_FACTORYREG.register(InitSlaveReq)
export class InitSlaveRep extends ReplyMsg{init(msgReq,slaveId,datas){this.forId=msgReq.repWId
this.slaveId=slaveId
this.datas=datas
return this}toJson(json){super.toJson(json)
json.forId=this.forId
json.slaveId=this.slaveId
json.datas=this.datas}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.forId=json.forId
this.slaveId=json.slaveId
this.datas=json.datas}cloneFrom(o,purpose){super.cloneFrom(o,purpose)
this.forId=o.forId
this.slaveId=o.slaveId
this.datas=o.datas}}InitSlaveRep.type="initSlaveRep"
House.MSG_FACTORYREG.register(InitSlaveRep)
export class State{static buildFromJson(json,factoryReg){const obj=new this
obj.fromJson(json,factoryReg)
return obj}static buildFromStruct(struct,factoryReg){const obj=new this
obj.fromStruct(struct,factoryReg)
return obj}get type(){return this.constructor.type}attachHouse(house){this.house=house
return this}clone(){const clone=new this.constructor
clone.fromStruct(this.asStruct(),House.STATE_FACTORYREG)
return clone}asJson(){const obj=Object.create(null)
this.toJson(obj)
return obj}asStruct(){const obj=Object.create(null)
this.toStruct(obj)
return obj}toJson(json){json.type=this.type
if(this.id)json.id=this.id
if(this.metas)json.metas=this.metas}fromJson(json,factoryReg){if(json.id)this.id=json.id
if(json.metas)this.metas=json.metas}toStruct(struct){this.toJson(struct)}fromStruct(struct,factoryReg){this.fromJson(struct,factoryReg)}toString(){return JSON.stringify(this.asJson())}}export class ResetStatesMsg extends Msg{init(datas){this.datas=datas
return this}toJson(json){super.toJson(json)
json.datas=this.datas}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.datas=json.datas}cloneFrom(o,purpose){super.cloneFrom(o,purpose)
this.datas=o.datas}}ResetStatesMsg.type="resetStates"
House.MSG_FACTORYREG.register(ResetStatesMsg)
export class RoadLocal extends RoadEnd{static connect(house1,configDoor1,house2,configDoor2){const r1=new RoadLocal
const r2=new RoadLocal
const d1=house1.openDoor(r1,configDoor1)
const d2=house2.openDoor(r2,configDoor2)
r1.initRoad(d1,r2)
r2.initRoad(d2,r1)
return[d1,d2]}static connectMasterSlave(houseMaster,configDoorMaster,houseSlave,configDoorSlave){if(!configDoorMaster)configDoorMaster={}
configDoorMaster.isMaster=true
if(!configDoorSlave)configDoorSlave={}
configDoorSlave.roadToMaster=true
const r1=new RoadLocal
const r2=new RoadLocal
const d1=houseMaster.openDoor(r1,configDoorMaster)
const d2=houseSlave.openDoor(r2,configDoorSlave)
r1.initRoad(d1,r2)
r2.initRoad(d2,r1)
return[d1,d2]}initRoad(door,otherEnd){this.door=door
this._otherEnd=otherEnd}xPushMsg(msg){const msgClone=msg.clone()
Promise.resolve().then(()=>{this._otherEnd.listenIncoming(msgClone)})}doorClosed(){this.door=null
const otherDoor=this._otherEnd.door
if(otherDoor)otherDoor.house.closeDoor(otherDoor)}}export class RoadLocalSync extends RoadLocal{static connect(house1,configDoor1,house2,configDoor2){const r1=new RoadLocalSync
const r2=new RoadLocalSync
const d1=house1.openDoor(r1,configDoor1)
const d2=house2.openDoor(r2,configDoor2)
r1.initRoad(d1,r2)
r2.initRoad(d2,r1)
return[d1,d2]}static connectMasterSlave(houseMaster,configDoorMaster,houseSlave,configDoorSlave){if(!configDoorMaster)configDoorMaster={}
configDoorMaster.isMaster=true
if(!configDoorSlave)configDoorSlave={}
configDoorSlave.roadToMaster=true
const r1=new RoadLocalSync
const r2=new RoadLocalSync
const d1=houseMaster.openDoor(r1,configDoorMaster)
const d2=houseSlave.openDoor(r2,configDoorSlave)
r1.initRoad(d1,r2)
r2.initRoad(d2,r1)
return[d1,d2]}xPushMsg(msg){this._otherEnd.listenIncoming(msg.clone())}}export class RoadNet extends RoadEnd{constructor(provider,house,configDoor){super()
this._provider=provider
this._config=configDoor
provider.onopen=ev=>{this.door=house.openDoor(this,configDoor)
if(configDoor.onOpen)configDoor.onOpen(this.door)}
provider.onerror=ev=>{console.log("RoadNet error: ",ev)}
provider.onclose=ev=>{if(this.door){if(configDoor.onClose)configDoor.onClose(this.door)
house.closeDoor(this.door)}}
provider.onmessage=ev=>{const json=JSON.parse(ev.data)
this.listenIncoming(House.MSG_FACTORYREG.newFromJson(json))}}xPushMsg(msg){this._provider.send(JSON.stringify(msg.asJson()))}newRoadFor(house,config){return new RoadNet(this._provider,house,config||this._config)}doorClosed(){if(this._config.onClose)this._config.onClose(this.door)
this.door=null
this._provider.close()}}
//# sourceMappingURL=urban.js.map