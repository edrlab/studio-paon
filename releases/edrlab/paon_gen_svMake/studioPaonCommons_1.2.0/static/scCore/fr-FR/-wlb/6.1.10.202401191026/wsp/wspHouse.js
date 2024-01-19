import{DocHolder}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/docHolder.js"
import{XmlTypedHouse}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlTypedHouse.js"
import{UndirtyMsgOt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/houseOt.js"
import{ResetStatesMsg,RoadEnd}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/urban.js"
export class PlaceDocHolder extends DocHolder{constructor(house,place){super(house)
this.place=place
place._docHolders.add(this)
this.house.notUsedSince=0}cloneDocHolder(){return new PlaceDocHolder(this.house,this.place)}doBatch(batch){if(this.house.lockedBy==null)super.doBatch(batch)
else console.warn("doBatch() called on PlaceDocHolder in locked state.")}willUndo(filter){if(this.house.lockedBy==null)return super.willUndo(filter)
else console.warn("willUndo() called on PlaceDocHolder in locked state.")
return Promise.resolve(false)}willRedo(filter){if(this.house.lockedBy==null)return super.willRedo(filter)
else console.warn("willRedo() called on PlaceDocHolder in locked state.")
return Promise.resolve(false)}close(){this.place._docHolders.delete(this)
const house=this.house
super.close()
if(house.publicDoors.length===0)house.notUsedSince=Date.now()}save(){return this.place.wspsLive._saveHouse(this.house,this.place)}}export class WspXmlHouse extends XmlTypedHouse{xInitDom(root){const doc=root
if(!doc.wsp){doc.wsp=this.wsp
doc.srcRefMap=new Map}}}export class WspXmlSlaveHouse extends WspXmlHouse{onMsg(msg,fromDoor){if(msg.type===UndirtyMsgOt.type){const props=msg.props
if(props)Object.assign(this.srcFields,props)}else if(msg instanceof ResetStatesMsg&&msg.datas.body===null){this.wsp.wspServer.wspsLive._removeHouse(this)
return}super.onMsg(msg,fromDoor)}}export class RoadExecFrameWs extends RoadEnd{constructor(execFrame,house){super()
this._ws=execFrame
this._house=house}pushRequest(msg){const m=msg.asJson()
m.houseId=this._house.id
m.svc="moan"
return this._ws.sendReq(m)}xPushMsg(msg){const m=msg.asJson()
m.houseId=this._house.id
m.svc="moan"
this._ws.sendMsg(m)}newRoadFor(house,config){return new RoadExecFrameWs(this._ws,house)}doorClosed(){this._ws.sendMsg(JSON.stringify({svc:"moan",houseId:this._house.id,slaveClosed:true}))
this.door=null}}
//# sourceMappingURL=wspHouse.js.map