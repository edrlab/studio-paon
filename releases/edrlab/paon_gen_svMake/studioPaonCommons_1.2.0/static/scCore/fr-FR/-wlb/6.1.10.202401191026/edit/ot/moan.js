import{House,State}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/urban.js"
import{MsgOt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/houseOt.js"
import{EAnnotLevel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaAnnots.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{XmlAddrMsg,XmlListMsgOt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
export class MoanState extends State{constructor(){super(...arguments)
this.annots=new Map}fillAllAnnots(an){for(const m of this.annots.values()){if(!m.killed)an.push(m)}}fillAnnots(an,xa,length=1,deep=true){for(const m of this.annots.values()){if(!m.killed&&XA.isInSeq(xa,length,m.addr)){if(deep||m.addr.length===xa.length-1)an.push(m)}}}update(msg){if(msg instanceof MoanListAnnotMsg){const del=[]
if(msg.remAnnots)for(const id of msg.remAnnots){const m=this.annots.get(id)
if(m){this.annots.delete(id)
del.push(m)}}const domRoot=this.house.getStateById("body").root
for(const m of msg.msgs){m.bindToDom(domRoot)
this.annots.set(m.moanId,m)}this.house.listeners.emit("onSkAnnotsChange",del,msg.msgs)}else if(msg instanceof MsgOt&&msg.isBodyMutator){let del
for(const m of this.annots.values()){if(!m.killed){msg.adjust(m)
if(m.killed){if(!del)del=[m]
else del.push(m)}}}if(del)this.house.listeners.emit("onSkAnnotsChange",del,null)}}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
for(const m of json.annots){const msg=House.MSG_FACTORYREG.newFromJson(m)
this.annots.set(msg.moanId,msg)}}attachHouse(house){super.attachHouse(house)
if(house){const domRoot=house.getStateById("body").root
for(const m of this.annots.values())m.bindToDom(domRoot)}else{this.annots.clear()}return this}}MoanState.type="moan"
House.STATE_FACTORYREG.register(MoanState)
export class MoanAnnot extends XmlAddrMsg{init(addr){throw"Don't use!"}initMoan(addr,moanId,label,level){super.init(addr)
this.moanId=moanId
this.label=label
this.level=level
return this}bindToDom(root){this.anchorNode=XA.findDomLast(this.addr,root)}get start(){return this.anchorNode?XA.from(this.anchorNode):this.addr}invert(){return(new MoanAnnot).initMoan(this.addr,this.moanId,this.label,this.level).copyStableMetasFrom(this)}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.moanId=json.moanId
switch(json.level){case"error":this.level=EAnnotLevel.error
break
case"warning":this.level=EAnnotLevel.warning
break
case"info":this.level=EAnnotLevel.info
break
default:this.level=EAnnotLevel.error}this.label=json.label}get len(){return 1}getLabel(){return this.label}equals(other){return other instanceof MoanAnnot&&this.moanId===other.moanId}toJSON(){throw"TODO"}}MoanAnnot.type="moanAnnot"
House.MSG_FACTORYREG.register(MoanAnnot)
class MoanListAnnotMsg extends XmlListMsgOt{get isBodyMutator(){return false}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.remAnnots=json["remAnnots"]}toJson(json){super.toJson(json)
json["remAnnots"]=this.remAnnots}}MoanListAnnotMsg.type="moanListAnnot"
House.MSG_FACTORYREG.register(MoanListAnnotMsg)

//# sourceMappingURL=moan.js.map