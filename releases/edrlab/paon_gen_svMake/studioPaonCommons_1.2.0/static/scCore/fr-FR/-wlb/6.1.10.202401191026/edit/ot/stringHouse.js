"use strict"
import{HouseOt,isMsgUpdater,ListMsgOt,MsgOt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/houseOt.js"
import{House,State}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/urban.js"
class StringHouse extends HouseOt{constructor(options={}){super(options)
this._states=[]
this._body=(new StrBodyState).init("body",options.initialText).attachHouse(this)}get text(){return this._body?this._body.str:null}insertText(start,insText,fromDoor){if(start<0||start>this.text.length)throw Error(`Incorrect start insert: ${start} / ${this.text.length}`);(fromDoor||this.publicDoor).receiveMsg((new StrInsertMsg).init(start,insText))}deleteText(start,lengthOrDelText,fromDoor){if(start<0||start>this.text.length)throw Error(`Incorrect start delete: ${start} / ${this.text.length}`)
if(typeof lengthOrDelText==="string"){if(this.text.substr(start,lengthOrDelText.length)!==lengthOrDelText)throw Error(`Incorrect delete text ::'${lengthOrDelText}' at start ${start} != ${this.text}`)
lengthOrDelText=lengthOrDelText.length}else{if(lengthOrDelText<=0)throw`Incorrect delete length: ${lengthOrDelText}`
if(this.text.length<start+lengthOrDelText)throw Error(`Incorrect delete  : start ${start} + length ${lengthOrDelText} exceed text length ${this.text.length}`)}(fromDoor||this.publicDoor).receiveMsg((new StrDeleteMsg).init(start,lengthOrDelText))}moveText(start,length,target,fromDoor){if(start<0||start>this.text.length)throw Error(`Incorrect start move: ${start} / ${this.text.length}`)
if(length<0||start+length>this.text.length)throw Error(`Incorrect delete range: ${start} + ${length} / ${this.text.length}`)
if(target<0||target>this.text.length)throw Error(`Incorrect target move: ${start} / ${this.text.length}`)
const str=this.text.substr(start,length);(fromDoor||this.publicDoor).receiveMsg((new StrMoveMsg).init(this.id,start,str,target))}getStateById(id){if(id==="body")return this._body
for(let i=0,e=this._states.length;i<e;i++)if(this._states[i].id==id)return this._states[i]
return null}putState(state){if(state.id==="body"){this._body=state}else{this._states.push(state.attachHouse(this))}}addState(state){throw"TODO"}removeState(state){if(state===this._body)this._body=null
for(let i=0,e=this._states.length;i<e;i++)if(state===this._states[i])this._states.splice(i,1)}xApplyMsgOtLocally(msg,updatable){try{if(this._body)this._body.update(msg)
for(let i=0,e=this._states.length;i<e;i++)this._states[i].update(msg)}catch(e){console.error("xApplyMsgOtLocally in house failed",this,msg,e)
throw e}return msg}xApplyResetStatesLocally(msg){super.xApplyResetStatesLocally(msg)
if(this._body)this._body.update(msg)
this._states=msg.datas.states.map(st=>House.STATE_FACTORYREG.newFromJson(st))}writeFullStates(datas,options){datas.body=this._body.str
datas.states=this._states.map(st=>st.asJson())}}class StrBodyState extends State{init(id,string){this.id=id
this.str=string
if(StringHouse.DEBUG&&this.house)console.log("Body "+this.house+" inited :: "+this.str)
return this}update(msg){const f=this[msg.type]
if(f){f.call(this,msg)}else if(isMsgUpdater(msg)){msg.applyUpdates(this)}if(StringHouse.DEBUG)console.log("Body "+this.house+" :: "+this.str)}strIns(msg){if(StringHouse.ASSERT)if(this.house)msg.assertMsgValidity(this.house)
this.str=this.str.substring(0,msg.start)+msg.txt+this.str.substring(msg.start)}strDel(msg){if(StringHouse.ASSERT)if(this.house)msg.assertMsgValidity(this.house)
msg.setText(this.str.substr(msg.start,msg.len))
this.str=this.str.substring(0,msg.start)+this.str.substring(msg.end)}resetStates(msg){this.str=msg.datas.body}initSlaveRep(msg){this.str=msg.datas.body}toJson(json){super.toJson(json)
json.str=this.str}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.str=json.str}}StrBodyState.type="strBody"
House.STATE_FACTORYREG.register(StrBodyState)
class StrRangeState extends State{init(id,metas,start,end){this.id=id
this.metas=metas
this.start=start||0
this.end=end||0
return this}set({start:start,end:end,metas:metas},fromDoor){(fromDoor||this.house.publicDoor).receiveMsg((new StrRangeUpdtMsg).init(this.id,start,end,metas))}update(msg){const f=this[msg.type]
if(f){f.call(this,msg)}else if(isMsgUpdater(msg)){msg.applyUpdates(this)}}strRg(msg){if(msg.rgId===this.id){if(msg.rgStart>=0)this.start=msg.rgStart
if(msg.rgEnd>=0)this.end=msg.rgEnd
if(msg.rgMetas)this.metas=msg.rgMetas}}strIns(msg){if(this.start>=msg.start)this.start+=msg.len
if(this.end>=msg.start)this.end+=msg.len}strDel(msg){if(this.start>msg.start){if(this.start>msg.start+msg.len)this.start-=msg.len
else this.start=msg.start}if(this.end>msg.start){if(this.end>msg.start+msg.len)this.end-=msg.len
else this.end=msg.start}}toJson(json){super.toJson(json)
json.start=this.start
json.end=this.end}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.start=json.start||0
this.end=json.end||0}}StrRangeState.type="strRg"
House.STATE_FACTORYREG.register(StrRangeState)
class StrInsertMsg extends MsgOt{init(start,insText){this.start=start
this.txt=insText
return this}get isUndoable(){return true}get isBodyMutator(){return true}get killed(){return this.txt.length===0}kill(){this.txt=""}get len(){return this.txt.length}get end(){return this.start+this.len}adjust(msg){msg.adjustInsert(this.start,this.len)}rewind(msg){msg.rewindInsert(this.start,this.len)}forward(msg){msg.forwardInsert(this.start,this.len)}cross(msg,invertOfOtId){msg.crossInsert(this.start,this.len,invertOfOtId)}mergeWith(nextMsg){switch(nextMsg.type){case StrInsertMsg.type:if(nextMsg.start==this.start+this.len){this.txt+=nextMsg.txt
return this}break
case StrDeleteMsg.type:if(nextMsg.start+nextMsg.len==this.start+this.len){const newLen=this.len-nextMsg.len
if(newLen>=0){this.txt=this.txt.substring(0,newLen)
return this}}break}return null}adjustDelete(start,dLen){if(StringHouse.ASSERT)if(dLen>0)throw Error(`dLen > 0!`)
if(start<this.start)this.start=Math.max(this.start+dLen,start)}crossDelete(start,dLen,fromOtId){if(!this._mem)this._mem=Object.create(null)
if(this.start<=start){this._mem[fromOtId]=pushPosInsIns([],"b")}else if(this.start>=start-dLen){this._mem[fromOtId]=pushPosInsIns([],"a")}else{this._mem[fromOtId]=pushPosInsIns([],"i",this.start-start)}this.adjustDelete(start,dLen)}rewindDelete(start,dLen){this.adjustInsert(start,-dLen)}forwardDelete(start,dLen){this.adjustDelete(start,dLen)}adjustInsert(start,len){if(StringHouse.ASSERT)if(len<0)throw Error(`len < 0!`)
if(start<=this.start)this.start+=len}crossInsert(start,len,invertOfOtId){if(this._mem&&invertOfOtId!=null){const memArray=this._mem[invertOfOtId]
if(memArray!=null){delete this._mem[invertOfOtId]
this.xForwardInsert(start,len,memArray)
return}}this.adjustInsert(start,len)}rewindInsert(start,len){if(this.start<=start){this.mem=pushPosInsIns(this.mem,"b")}else if(this.start>=start+len){this.mem=pushPosInsIns(this.mem,"a")}else{this.mem=pushPosInsIns(this.mem,"i",this.start-start)}this.adjustDelete(start,-len)}forwardInsert(start,len){this.xForwardInsert(start,len,this.mem)}xForwardInsert(start,len,memArray){const mem=popPosInsIns(memArray)
if(mem.pos==="b"){if(start<this.start)this.start+=len}else if(mem.pos==="a"){if(start<=this.start)this.start+=len}else{this.start=start+mem.startOffset}}invert(){return(new StrDeleteMsg).init(this.start,this.len).copyStableMetasFrom(this)}inMigration(inMigr){if(!inMigr){delete this.mem
delete this._mem}}assertMsgValidity(house){const str=house.text
if(this.start<0||this.start>str.length)throw Error(`Start out of bound for ${this} in : '${str}'`)}toJson(json){super.toJson(json)
json.start=this.start
json.txt=this.txt
if(this.mem)json.mem=this.mem}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.start=json.start
this.txt=json.txt
if(json.mem!==undefined)this.mem=json.mem}cloneFrom(o,purpose){super.cloneFrom(o,purpose)
this.start=o.start
this.txt=o.txt
if(o.mem!==undefined&&purpose!=="hist")this.mem=o.mem?o.mem.concat():null}toString(){const json=this.asJson()
json.len=this.len
if(this.otId)json.otId=this.otId
if(this._mem!==undefined)json._mem=this._mem
return JSON.stringify(json)}}StrInsertMsg.type="strIns"
House.MSG_FACTORYREG.register(StrInsertMsg)
class StrDeleteMsg extends MsgOt{init(start,len){this.start=start
this.len=len
return this}setText(text){this.txt=text
return this}get isUndoable(){return this.txt!=null}get isBodyMutator(){return true}get end(){return this.start+this.len}get killed(){return this.len<=0}kill(){this.xSetLen(0)}xSetLen(len){this.len=len
this.txt=null}adjust(msg){msg.adjustDelete(this.start,-this.len)}rewind(msg){msg.rewindDelete(this.start,-this.len)}forward(msg){msg.forwardDelete(this.start,-this.len)}cross(msg,invertOfOtId){msg.crossDelete(this.start,-this.len,this.otId)}mergeWith(nextMsg){if(this.txt==null)return null
switch(nextMsg.type){case StrDeleteMsg.type:if(nextMsg.start==this.start){this.len=this.txt.length
this.txt+=nextMsg.txt
return this}if(nextMsg.start+nextMsg.len==this.start){nextMsg.len=nextMsg.txt.length
nextMsg.txt+=this.txt
return nextMsg}break}return null}adjustDelete(start,dLen){this.xAdjustDelete(start,dLen)}xAdjustDelete(start,dLen){if(StringHouse.ASSERT)if(dLen>0)throw Error(`dLen > 0!`)
const otherEnd=start-dLen
const myEnd=this.end
if(otherEnd>this.start&&start<myEnd)this.xSetLen(Math.max(0,start-this.start)+Math.max(0,myEnd-otherEnd))
if(start<this.start)this.start=Math.max(this.start+dLen,start)}crossDelete(start,dLen,fromOtId){const otherEnd=start-dLen
const myEnd=this.end
if(!this._mem)this._mem=Object.create(null)
this._mem[fromOtId]=pushPosInsDel([],this.start<start,this.start>=otherEnd,this.start-start,myEnd<=start,myEnd>otherEnd,otherEnd-myEnd)
this.xAdjustDelete(start,dLen)}rewindDelete(start,dLen){this.xAdjustInsert(start,-dLen)}forwardDelete(start,dLen){this.xAdjustDelete(start,dLen)}adjustInsert(start,len){this.xAdjustInsert(start,len)}xAdjustInsert(start,len){if(StringHouse.ASSERT)if(len<0)throw Error(`len < 0!`)
if(start<=this.start){this.start+=len}else{if(start<this.end)this.xSetLen(this.len+len)}}crossInsert(start,len,invertOfOtId){if(this._mem&&invertOfOtId!=null){const memArray=this._mem[invertOfOtId]
if(memArray){delete this._mem[invertOfOtId]
this.xForwardInsert(start,len,memArray)
return}}this.xAdjustInsert(start,len)}rewindInsert(start,len){const otherEnd=start+len
const myEnd=this.end
this.mem=pushPosInsDel(this.mem,this.start<start,this.start>=otherEnd,this.start-start,myEnd<=start,myEnd>otherEnd,otherEnd-myEnd)
this.xAdjustDelete(start,-len)}forwardInsert(start,len){this.xForwardInsert(start,len,this.mem)}xForwardInsert(start,len,memArray){const mem=popPosInsDel(memArray)
if(mem.startAfter){this.start+=len}else if(mem.endBefore){}else if(mem.startBefore){if(mem.endAfter){this.xSetLen(this.len+len)}else{this.xSetLen(len-mem.endOffset+start-this.start)}}else{this.start=start+mem.startOffset
if(mem.endAfter){this.xSetLen(this.len+len-mem.startOffset)}else{this.xSetLen(this.len+len-mem.startOffset-mem.endOffset)}}}invert(){if(this.txt==null)throw"txt not available for undo/redo"
return(new StrInsertMsg).init(this.start,this.txt).copyStableMetasFrom(this)}inMigration(inMigr){if(!inMigr){delete this.mem
delete this._mem}}assertMsgValidity(house){const str=house.text
if(this.len<0)throw Error(`Invalid length in ${this}`)
if(this.start<0||this.start>str.length)throw Error(`Start out of bound for ${this} in : '${str}'`)
const end=this.end
if(end<0||end>str.length)throw Error(`End '${end}' out of bound for ${this} in : '${str}'`)
if(this.txt!=null&&this.txt.length!==this.len)throw Error(`msg.len and msg.txt prorpeties are out of sync in ${this}`)}toJson(json){super.toJson(json)
json.start=this.start
json.len=this.len
if(this.mem)json.mem=this.mem}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.start=json.start
this.len=json.len
if(json.mem!==undefined)this.mem=json.mem}cloneFrom(o,purpose){super.cloneFrom(o,purpose)
this.start=o.start
this.len=o.len
if(purpose==="hist"){this.txt=o.txt}else{if(o.mem!==undefined)this.mem=o.mem?o.mem.concat():null}}toString(){const json=this.asJson()
json.txt=this.txt
if(this.otId)json.otId=this.otId
if(this._mem!==undefined)json._mem=this._mem
return JSON.stringify(json)}}StrDeleteMsg.type="strDel"
House.MSG_FACTORYREG.register(StrDeleteMsg)
class StrListMsgOt extends ListMsgOt{adjustInsert(start,len){this.msgs.forEach(m=>{m.adjustInsert(start,len)})}crossInsert(start,len,invertOfOtId){this.msgs.forEach(m=>{m.crossInsert(start,len,invertOfOtId)})}rewindInsert(start,len){this.msgs.forEach(m=>{m.rewindInsert(start,len)})}forwardInsert(start,len){this.msgs.forEach(m=>{m.forwardInsert(start,len)})}adjustDelete(start,dLen){this.msgs.forEach(m=>{m.adjustDelete(start,dLen)})}crossDelete(start,dLen,fromOtId){this.msgs.forEach(m=>{m.crossDelete(start,dLen,fromOtId)})}rewindDelete(start,dLen){this.msgs.forEach(m=>{m.rewindDelete(start,dLen)})}forwardDelete(start,dLen){this.msgs.forEach(m=>{m.forwardDelete(start,dLen)})}}StrListMsgOt.type="strList"
House.MSG_FACTORYREG.register(StrListMsgOt)
class StrMoveMsg extends StrListMsgOt{init(houseId,start,text,target){return super.initList([(new StrDeleteMsg).init(start,text.length),(new StrInsertMsg).init(target>start?target-text.length:target,text)])}}StrMoveMsg.type="strMove"
House.MSG_FACTORYREG.register(StrMoveMsg)
class StrRangeUpdtMsg extends MsgOt{init(rangeId,start,end,metas){this.rgId=rangeId
if(start>=0)this.rgStart=start
if(end>=0)this.rgEnd=end
if(metas)this.rgMetas=metas
return this}get killed(){return false}kill(){}get isUndoable(){return false}adjustDelete(start,dLen){}crossDelete(start,dLen,fromOtId){}rewindDelete(start,dLen){}forwardDelete(start,dLen){}adjustInsert(start,len){}crossInsert(start,len,invertOfOtId){}rewindInsert(start,len){}forwardInsert(start,len){}invert(){return(new StrRangeUpdtMsg).init(this.rgId,this.rgStart,this.rgEnd,this.rgMetas).copyStableMetasFrom(this)}toJson(json){super.toJson(json)
json.rgId=this.rgId
if(this.rgStart>=0)json.rgStart=this.rgStart
if(this.rgEnd>=0)json.rgEnd=this.rgEnd
if(this.rgMetas)json.rgMetas=this.rgMetas}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.rgId=json.rgId
if(json.rgStart>=0)this.rgStart=json.rgStart
if(json.rgEnd>=0)this.rgEnd=json.rgEnd
if(json.rgMetas)this.rgMetas=json.rgMetas}cloneFrom(o,purpose){super.cloneFrom(o,purpose)
this.rgId=o.rgId
if(o.rgStart>=0)this.rgStart=o.rgStart
if(o.rgEnd>=0)this.rgEnd=o.rgEnd
if(o.rgMetas)this.rgMetas=JSON.parse(JSON.stringify(o.rgMetas))}}StrRangeUpdtMsg.type="strRg"
House.MSG_FACTORYREG.register(StrRangeUpdtMsg)
function pushPosInsIns(array,position,startOffset){if(!array)array=[]
if(position==="i")array.push(startOffset)
array.push(position)
return array}const _memPosInsInsBuffer={}
function popPosInsIns(array){if(StringHouse.ASSERT)if(array.length===0)throw Error("Not enough mem for forward")
const firstVal=array.pop()
_memPosInsInsBuffer.pos=firstVal
if(firstVal==="i")_memPosInsInsBuffer.startOffset=array.pop()
return _memPosInsInsBuffer}function pushPosInsDel(array,startBefore,startAfter,startOffset,endBefore,endAfter,endOffset){if(!array)array=[]
array.push(startBefore)
array.push(startAfter)
array.push(startOffset)
array.push(endOffset)
array.push(endBefore)
array.push(endAfter)
return array}const _memPosInsDelBuffer={}
function popPosInsDel(array){if(StringHouse.ASSERT)if(array.length===0)throw Error("Not enough mem for forward")
_memPosInsDelBuffer.endAfter=array.pop()
_memPosInsDelBuffer.endBefore=array.pop()
_memPosInsDelBuffer.endOffset=array.pop()
_memPosInsDelBuffer.startOffset=array.pop()
_memPosInsDelBuffer.startAfter=array.pop()
_memPosInsDelBuffer.startBefore=array.pop()
return _memPosInsDelBuffer}export{StringHouse}
export{StrInsertMsg,StrDeleteMsg,StrMoveMsg}

//# sourceMappingURL=stringHouse.js.map