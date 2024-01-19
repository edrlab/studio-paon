import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{EditorState,Text,Transaction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/state.js"
import{EditorView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/view.js"
import{EventsMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{EWspChangesEvts,EWspWorkingSt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{EHttpStatusCode,IO,RespError}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
class CmEditors{constructor(wspsLive){this.wspsLive=wspsLive
this.editorsByUri=new Map
this.editorsByItemUri=new Map}async refetchContent(wspUri){var _a
return(_a=this.editorsByUri.get(wspUri))===null||_a===void 0?void 0:_a.refetchContent()}async onWspUriChangeMsg(m){if(m.type===EWspChangesEvts.u){const wspUri=WSP.buildWspUri(m.wspCd,m.srcUri)
const syncEd=this.editorsByUri.get(wspUri)
if(syncEd&&syncEd.ctState!=="saving")syncEd.refetchContent()
const syncEds=this.editorsByItemUri.get(wspUri)
if(syncEds){const eds=syncEds.filter(ed=>ed.ctState!=="saving")
if(eds.length>0){const newSts=await this.wspsLive.wspServer.config.wspSrcUrl.fetchJson(IO.qs("param",m.wspCd,"refUris",eds.map(s=>s.srcUri).join("\t"),"fields","srcStamp*srcDt"))
for(let i=0;i<newSts.length;i++){const newSt=newSts[i]
const syncEd=eds[i]
if(newSt.srcStamp?syncEd.fields.srcStamp!==newSt.srcStamp:syncEd.fields.srcDt!==newSt.srcDt)syncEd.refetchContent()}}}}else if(m.type===EWspChangesEvts.r){}}async onWspWorkingInitMsg(urisStates){for(const wspUri in urisStates){const syncEd=this.editorsByUri.get(wspUri)
if(syncEd){const uriStates=urisStates[wspUri]
if(uriStates.reject||uriStates.srcStamp?uriStates.srcStamp!==syncEd.fields.srcStamp:uriStates.srcDt!==syncEd.fields.srcDt){await syncEd.refetchContent()}else{syncEd.refreshLockState(uriStates.states)}}}}onWspWorkingStateMsg(m){const syncEd=this.editorsByUri.get(m.uri)
if(syncEd){if(m.state===EWspWorkingSt.w){syncEd.lock(m.clId,m.account)}else{if(syncEd.lockedBy&&syncEd.lockedBy.clId===m.clId){syncEd.unlock()}}}}isDirty(wspUri){const syncEd=this.editorsByUri.get(wspUri)
return syncEd?syncEd.ctState==="dirty":false}tryLockExternals(wspRef){return true}unlockExternals(wspRef){}saveAll(addWaiterTo){for(const ed of this.editorsByUri.values()){if(ed.ctState==="dirty")addWaiterTo.push(ed.save(this.wspsLive.findWsp(ed.wspCd,true),null))}}save(wspItemUri,waiters){const eds=this.editorsByItemUri.get(wspItemUri)
if(eds)for(const ed of eds){if(ed.ctState==="dirty")waiters.push(ed.save(this.wspsLive.findWsp(ed.wspCd,true),null))}}getOrCreateSyncEd(wspCd,srcUri){const wspUri=WSP.buildWspUri(wspCd,srcUri)
let syncEd=this.editorsByUri.get(wspUri)
if(!syncEd){const wspUriItem=ITEM.getSrcUriType(wspUri)==="res"?ITEM.extractItemUri(wspUri):null
syncEd=new SynchedEditors(this.wspsLive,wspCd,srcUri,wspUri,wspUriItem)
this.editorsByUri.set(wspUri,syncEd)
if(wspUriItem){const list=this.editorsByItemUri.get(wspUriItem)
if(list){list.push(syncEd)}else{this.editorsByItemUri.set(wspUriItem,[syncEd])}}syncEd.refetchContent()}return syncEd}removeSyncEd(syncEd){this.editorsByUri.delete(syncEd.wspUri)
const list=this.editorsByItemUri.get(syncEd.wspUriItem)
if(list){if(list.length===1){if(list[0]===syncEd)this.editorsByItemUri.delete(syncEd.wspUriItem)}else{const idx=list.indexOf(syncEd)
if(idx>=0)list.splice(idx,1)}}}}class SynchedEditors extends Array{constructor(wspsLive,wspCd,srcUri,wspUri,wspUriItem){super()
this.wspsLive=wspsLive
this.wspCd=wspCd
this.srcUri=srcUri
this.wspUri=wspUri
this.wspUriItem=wspUriItem
this.ctState="fetching"
this.initing=false
this.cmContent=Text.empty}async refetchContent(){this.cancelSaveTimer()
this.setCtEdState("fetching")
try{const qs=IO.qs("format","stream","param",this.wspCd,"refUri",this.srcUri,"srcTrashed","false","fields",this.wspsLive.getSrcFieldNames(this.srcUri))
const resp=await this.wspsLive.wspServer.config.wspSrcUrl.fetch(qs,"text")
if(!resp.ok){if(resp.status===EHttpStatusCode.notFound){resp.asText=""}else{this.setCtEdState("fetchFailed")
console.log("Get Text failed for "+this.wspUri,resp.error)
return null}}const fields=resp.headers.get("X-SCFIELDS")
if(!fields){this.setCtEdState("fetchFailed")
return null}this.fields=JSON.parse(fields)
const wsp=this.wspsLive.findWsp(this.wspCd,true)
if(!wsp.isAvailable)await wsp.waitForAvailable()
this.itemType=wsp.wspMetaUi.getItemType(this.fields.itModel)
const cmText=Text.of(resp.asText.split(/\r\n?|\n/))
this.initing=true
try{for(const cmEd of this){cmEd.editorView.dispatch({changes:{from:0,to:cmEd.editorView.state.doc.length,insert:cmText}})}}finally{this.initing=true}this.setCtEdState("fresh")}catch(e){this.setCtEdState("fetchFailed")
throw e}}async save(fromWsp,uiContext){if(this.ctState!=="dirty")return
this.cancelSaveTimer()
const qs=IO.qs("cdaction","PutSrc","param",this.wspCd,"refUri",this.srcUri,"clId",this.wspsLive.wspServer.chain.clId,"fields",this.wspsLive.getSrcFieldNames(this.srcUri))
this.setCtEdState("saving")
const txt=this.cmContent.sliceString(0)
try{const desc=await this.wspsLive.wspServer.config.wspSrcUrl.fetchJson(qs,{method:"PUT",body:txt})
if(!desc)throw Error("saveContent result desc is null")
if(!fromWsp.isAvailable)await fromWsp.waitForAvailable()
this.wspsLive._getStates(this.wspUri,false,null).then(this.refreshLockState.bind(this))
this.itemType=fromWsp.wspMetaUi.getItemType(this.fields.itModel)
if(ITEM.getSrcUriType(desc.srcUri)==="res"){const itemFields=await fromWsp.fetchShortDesc(ITEM.extractItemUri(desc.srcUri))
await this.wspsLive.dispatchLocalChange(null,fromWsp,itemFields,EWspChangesEvts.u,itemFields)}else{await this.wspsLive.dispatchLocalChange(null,fromWsp,desc,EWspChangesEvts.u,desc)}this.setCtEdState("fresh")}catch(e){for(const cmEd of this)cmEd.contentEvents.emitCatched("onCtStateChange","saveFailed",e)
if(e instanceof RespError&&e.response.status===EHttpStatusCode.forbidden){navigator.clipboard.writeText(txt).then(()=>{POPUP.showNotifForbidden("Vous ne disposez plus des droits en édition, vos modifications annulées ont été copiées dans le presse-papier.",uiContext,{autoHide:2e4})},()=>{POPUP.showNotifForbidden("Vous ne disposez plus des droits en édition, vos modifications ont dû être annulées.",uiContext,{autoHide:2e4})})
this.refetchContent()}else{POPUP.showNotifError("Échec à l\'enregistrement, connexion au serveur impossible. Attention, vous risquez de perdre vos modifications.",uiContext)
this.setCtEdState("dirty")
this.launchSaveTimer()}}}canChangeCmDoc(){return this.initing||(!this.lockedBy&&this.ctState==="dirty"||this.ctState==="fresh"||this.ctState==="saving")}onDocChanged(){if(this.ctState==="fresh"){this.launchSaveTimer()
this.setCtEdState("dirty")}}cancelSaveTimer(){if(this._saveTimer)clearInterval(this._saveTimer)}launchSaveTimer(){const saveInterval=this.itemType.reg.getPref("item.saveInterval",1e4)
if(saveInterval)this._saveTimer=setTimeout(()=>{this._saveTimer=0
this.save(this.wspsLive.findWsp(this.wspCd,true),null)},saveInterval)}remove(cmEditor){if(this.length===1){if(this[0]===cmEditor)this.wspsLive.cmEditors.removeSyncEd(this)}else{const idx=this.indexOf(cmEditor)
if(idx>=0)this.splice(idx,1)}}setCtEdState(stEvt,e){if(this.ctState!==stEvt){if(this.ctState==="dirty"){this.ctState=stEvt
this.wspsLive._wsFrame.postMsg({svc:"wspWorking",type:"state",uri:this.wspUri,state:this.wspsLive._getMergedServerStateFor(this.wspUri)})}else{this.ctState=stEvt
if(stEvt==="dirty")this.wspsLive._wsFrame.postMsg({svc:"wspWorking",type:"state",uri:this.wspUri,state:EWspWorkingSt.w})}for(const cmEd of this)cmEd.contentEvents.emitCatched("onCtStateChange",stEvt,e)}}refreshLockState(uriStates){const writeState=uriStates?uriStates.find(st=>st.state===EWspWorkingSt.w):null
if(writeState)this.lock(writeState.clId,writeState.account)
else if(this.lockedBy!=null)this.unlock()}lock(byClId,byAccount){if(this.ctState==="dirty"){this.refetchContent()
return}if(!this.lockedBy||this.lockedBy.clId!==byClId||this.lockedBy.account!==byAccount){this.lockedBy={clId:byClId,account:byAccount}
for(const ed of this)ed.contentEvents.emitCatched("onLock",true)}}unlock(){this.lockedBy=null
for(const ed of this)ed.contentEvents.emitCatched("onLock",false)}}class CmEditor{constructor(reg,syncEd){this.reg=reg
this.syncEd=syncEd
this.contentEvents=new EventsMgr}get wspUri(){return this.syncEd.wspUri}get contentState(){return this.syncEd.ctState}get lockedBy(){return this.syncEd.lockedBy}save(){return this.syncEd.save(this.reg.env.wsp,this.editorView.dom)}close(){this.syncEd.remove(this)
this.editorView.destroy()}setView(cmView){this.editorView=cmView}cmDispatch(tr){if(tr.docChanged){if(!this.syncEd.canChangeCmDoc())return
this.editorView.update([tr])
this.syncEd.cmContent=this.editorView.state.doc
this.syncEd.forEach(cmEd=>{if(cmEd!==this){cmEd.editorView.update([cmEd.editorView.state.update({changes:tr.changes,annotations:Transaction.remote.of(true)})])}})
this.syncEd.onDocChanged()}else{this.editorView.update([tr])}}}export function createCmEditor(srcUri,reg,extensions,root){const wspsLive=reg.env.wsp.wspServer.wspsLive
const cmEditors=wspsLive.cmEditors||(wspsLive.cmEditors=new CmEditors(wspsLive))
const syncEd=cmEditors.getOrCreateSyncEd(reg.env.wsp.code,srcUri)
const cmEd=new CmEditor(reg,syncEd)
syncEd.push(cmEd)
cmEd.setView(new EditorView({state:EditorState.create({doc:syncEd.cmContent,extensions:extensions}),root:root,dispatch:cmEd.cmDispatch.bind(cmEd)}))
return cmEd}
//# sourceMappingURL=wspsLiveCm.js.map