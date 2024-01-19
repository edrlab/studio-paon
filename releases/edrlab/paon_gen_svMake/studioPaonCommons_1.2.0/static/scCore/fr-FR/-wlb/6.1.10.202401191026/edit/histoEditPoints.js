import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{XmlDeleteMsg,XmlInsertMsg,XmlStrMsg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{InitSlaveRep,ResetStatesMsg,State}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/urban.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{isMsgUpdater}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/houseOt.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
export class HistoEditPointsMgr{constructor(){this.stack=[]
this.currentEntry=0}addEditEntry(targetAddr,sameCtxDepth,editHolder){if(sameCtxDepth==null)sameCtxDepth=targetAddr.addr.length
this.currentEntry=1
let last
let i=this.stack.length
while(--i>=0){const entry=this.stack[i]
if(!entry.targetAddr.killed){last=entry
break}}if(last===null||last===void 0?void 0:last.isSameCtx(targetAddr,sameCtxDepth,editHolder)){last.targetAddr.kill()
last.targetAddr=targetAddr}else{this.stack.push(new HistoEditEntry(targetAddr,sameCtxDepth,editHolder))
if(this.stack.length>HistoEditPointsMgr.maxStackSize){for(let i=0;i<HistoEditPointsMgr.clearStackStep;i++){this.stack[i].targetAddr.kill()}this.stack.splice(0,HistoEditPointsMgr.clearStackStep)}}}gotoPreviousEdit(){let i=this.stack.length-this.currentEntry
while(--i>=0){const entry=this.stack[i]
if(!entry.targetAddr.killed){if(entry.editHolder.goTo(entry.targetAddr)){this.currentEntry=this.stack.length-i
return}}else{this.stack.splice(i,1)}}}onEditPointFocus(focusXa,editHolder){const last=this.stack[this.stack.length-this.currentEntry]
if(last===null||last===void 0?void 0:last.isSameCtxFocus(focusXa,editHolder)){}else{this.currentEntry=0}}onEditorLooseFocus(editHolder){const last=this.stack[this.stack.length-this.currentEntry]
if(last===null||last===void 0?void 0:last.editHolder.isSame(editHolder))this.currentEntry=0}}HistoEditPointsMgr.maxStackSize=15
HistoEditPointsMgr.clearStackStep=5
class HistoEditEntry{constructor(targetAddr,sameCtxDepth,editHolder){this.targetAddr=targetAddr
this.sameCtxDepth=sameCtxDepth
this.editHolder=editHolder}isSameCtx(targetAddr,sameCtxDepth,editHolder){if(this.targetAddr.killed||!editHolder.isSame(this.editHolder)||sameCtxDepth!==this.sameCtxDepth)return false
for(let i=0;i<sameCtxDepth;i++){if(targetAddr.addr[i]!==this.targetAddr.addr[i])return false}return true}isSameCtxFocus(focusXa,editHolder){if(this.targetAddr.killed||!editHolder.isSame(this.editHolder)||focusXa.length!==this.sameCtxDepth)return false
for(let i=0;i<this.sameCtxDepth;i++){if(focusXa[i]!==this.targetAddr.addr[i])return false}return true}}export class HistoEditAction extends Action{constructor(histoEditPoints,id){super(id)
this.histoEditPoints=histoEditPoints
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/histoEdit.svg"
this._label="Retourner au précédent point d\'édition"}isInstantiable(ctx){if(ctx instanceof Element)return POPUP.findPopupableParent(ctx)==null
return true}execute(ctx,ev){this.histoEditPoints.gotoPreviousEdit()}}export function isHistoEditEnv(env){return(env===null||env===void 0?void 0:env.histoEditMgr)instanceof HistoEditPointsMgr}export class HistoEditPoint{constructor(addr,house){this.addr=XA.freeze(addr)
let state=house.getStateById(HistoEditPointsState.stateId)
if(state==null){state=new HistoEditPointsState
house.putState(state)}this.state=state
state.points.add(this)}update(addr){if(addr==null)this.kill()
else this.addr=addr}get killed(){return this.addr==null}kill(){this.addr=null
this.state.points.delete(this)}}class HistoEditPointsState extends State{constructor(){super(...arguments)
this.points=new Set}get id(){return HistoEditPointsState.stateId}update(msg){switch(msg.type){case XmlInsertMsg.type:{const m=msg
if(m.killed)return
for(let point of this.points)point.update(XA.freeze(XA.translateInsSeq(point.addr,m.xa,JML.lengthJmlOrText(m.jml))))
break}case XmlDeleteMsg.type:{const m=msg
if(m.killed)return
for(let point of this.points)point.update(XA.freeze(XA.translateDelSeq(point.addr,m.xa,m.len,true)))
break}case XmlStrMsg.type:{const m=msg
if(m.killed)return
for(let point of this.points)if(XA.isAnc(m.xa,point.addr))point.kill()
break}case ResetStatesMsg.type:case InitSlaveRep.type:for(let point of this.points)point.kill()
break
default:if(isMsgUpdater(msg))msg.applyUpdates(this)}}}HistoEditPointsState.stateId="histoEditPoints"

//# sourceMappingURL=histoEditPoints.js.map