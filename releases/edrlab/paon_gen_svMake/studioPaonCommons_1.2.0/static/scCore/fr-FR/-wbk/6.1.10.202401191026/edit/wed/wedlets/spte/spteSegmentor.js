import{InfoSpTeFocus,SPTE,SpTeSegmentWedlet}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/spte/spte.js"
import{EWedletEditMode,isParentWedlet,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{WED}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedCore.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{ENodeType,JSX,ShadowJsx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{renderAppend,xhtml}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/htmlLit.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{AccelKeyMgr,Action,ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{UiThemeDeskFeat}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/plugins/optionsPlg.js"
class SpTeSegmentor extends HTMLElement{get isSpTeSrcAvailable(){return this.video&&!isNaN(this.video.duration)}get spteSrcDuration(){return this._durationProp||(this.video&&this.video.duration||undefined)}get spteSrcSize(){return this.video.videoWidth>0&&this.video.videoHeight>0?{w:this.video.videoWidth,h:this.video.videoHeight}:undefined}get selectedLevel(){if(!this.levels)return null
for(const level of this.levels){if(level)for(const segment of level){if(segment==this.selectedTeSegment)return level}}return null}get zoomLevel(){return this._zoomLevel}get maxZoomLevel(){return 100}get minZoomLevel(){return this._minZoomLevel}configWedletElt(tpl,wedlet){this.wedlet=wedlet
this.wedlet.setSpTeSource(this)
const modes=WED.parseModes(this.getAttribute("wedlet-modes"))
if(modes)this.forkedModes={"":modes}
this.tabIndex=0
const actions=this.wedlet.wedMgr.reg.getList("actions:wed:spte:temporal")
this.accelKeyMgr=new AccelKeyMgr
this.addEventListener("keydown",(function(ev){this.accelKeyMgr.handleKeyboardEvent(ev,this)}))
this.accelKeyMgr.addAccelKey(getKey("KeyQ","A"),"",addAction)
this.accelKeyMgr.addAccelKey(getKey("KeyE","E"),"",previousAction)
this.accelKeyMgr.addAccelKey(getKey("KeyD","D"),"",rewindAction)
this.accelKeyMgr.addAccelKey(getKey("KeyF","F"),"",forwardAction)
this.accelKeyMgr.addAccelKey(getKey("KeyR","R"),"",nextAction)
this.accelKeyMgr.addAccelKey(getKey("KeyW","Z"),"",zoomInAction)
this.accelKeyMgr.addAccelKey(getKey("KeyS","S"),"",zoomOutAction)
this.accelKeyMgr.addAccelKey(getKey("KeyA","Q"),"",zoomToAction)
this.accelKeyMgr.addAccelKey(" ","",playAction)
this._toolBar=(new BarActions).initialize({actions:actions,actionContext:this,groupOrder:"struct zoom media time",skinOver:"spte-segmentor/toolbar"})
JSX.appendChildren(this,JSX.createElement(ShadowJsx,{reg:this.wedlet.wedMgr.reg,skin:"spte-segmentor"},this._toolBar,JSX.createElement("div",{id:"main"},this._editBox=JSX.createElement("div",{id:"edit","c-resizable":""},JSX.createElement(ShadowJsx,null,this._pointsStyle=JSX.createElement("style",null),JSX.createElement("slot",null)),JSX.createElement("div",{id:"details"},this._waveform=new SpTeWaveform,this._scrollBox=JSX.createElement("div",{id:"scroll"},this._zoomBox=JSX.createElement("div",{id:"zoom"},this._zoomCursor=JSX.createElement("div",{class:"cursor"})))),this._levelsBox=JSX.createElement("div",{id:"levels"},this._levelsCursor=JSX.createElement("div",{class:"cursor"}))),JSX.createElement("c-resizer",{"c-orient":"row"}),this.video=JSX.createElement("video",{preload:"metadata","c-resizable":""}),this._msgBox=JSX.createElement("div",{id:"msg"}))))
this.video.addEventListener("loadedmetadata",()=>{if(this.isConnected)this._onReady()})
this.video.addEventListener("error",()=>{if(this.readyState!="noStream")this._updateReadyState("notSupported",0)})
this.addEventListener("contextmenu",ev=>{if(ev instanceof MouseEvent&&ev.shiftKey)return
ev.preventDefault()
ev.stopPropagation()})
this.addEventListener("keydown",ev=>{if((ev.key==="Delete"||ev.key==="Backspace")&&this.selectedSegment){this.wedlet.wedMgr.docHolder.newBatch().deleteSequence(this.selectedSegment.wedAnchor,1).doBatch()}else if(ev.key=="Enter"&&this.shadowRoot.activeElement.classList.contains("segment")){const spteSegment=this.shadowRoot.activeElement.spTeSegment
this._setSelection(spteSegment,true)
this.wedlet.spteInfoBroker.dispatchInfo(new InfoSpTeFocus(spteSegment.wedAnchor,true),this)}})
this._scrollBox.addEventListener("scroll",ev=>{if(this.readyState==="ready")this.updateWaveform()})
this._scrollBox.addEventListener("wheel",ev=>{if(this.readyState==="ready"&&ev.deltaY){if(ACTION.isAccelPressed(ev)){if(ev.deltaY<0)this.zoomIn()
else this.zoomOut()}else{this._scrollBox.scrollLeft+=ev.deltaY}ev.preventDefault()}})
this._editBox.addEventListener("pointerdown",ev=>{if(ev.button===2){const levelsRect=this._levelsBox.getBoundingClientRect()
this.video.currentTime=(ev.clientX-levelsRect.left)*this.spteSrcDuration/levelsRect.width
ev.preventDefault()}})
this._zoomBox.addEventListener("pointerdown",ev=>{if(ev.button===2){const zoomRect=this._zoomBox.getBoundingClientRect()
this.video.currentTime=(ev.clientX-zoomRect.left)/this._zoomLevel
ev.stopPropagation()
ev.preventDefault()}})
for(const ev of["play","pause","ended","seeking","seeked"]){this.video.addEventListener(ev,()=>this._toolBar.refreshContent())}this._updateCursorsRequest=0
let updateTimeRequest=0
const updateTime=()=>requestAnimationFrame(()=>this._toolBar.refreshContent())
this.video.addEventListener("play",()=>{if(!this._updateCursorsRequest)this._startCursorsUpdate()
if(!updateTimeRequest)updateTimeRequest=window.setInterval(updateTime,100)})
this.video.addEventListener("seeked",()=>{this._updateCursors()
updateTime()})
this.video.addEventListener("pause",()=>{window.clearInterval(this._updateCursorsRequest)
window.clearInterval(updateTimeRequest)
this._updateCursorsRequest=updateTimeRequest=0})
this.video.addEventListener("mouseover",()=>{this.video.controls=true})
this.video.addEventListener("mouseout",()=>{this.video.controls=false})
this.wedlet.wedMgr.listeners.on("beforeHide",(wedMgr,close)=>{if(!this.shadowRoot.pictureInPictureElement)this.video.pause()
return true})
this.video.addEventListener("enterpictureinpicture",()=>{this.video.hidden=true})
this.video.addEventListener("leavepictureinpicture",()=>{this.video.hidden=false})
this.wedlet.spteInfoBroker.addConsumer(this)
this.addEventListener("focusin",()=>{DOMSH.findHost(this).setAttribute("selectin","")})
this.addEventListener("focusout",()=>{DOMSH.findHost(this).removeAttribute("selectin")})
this._levelsBox.addEventListener("pointerdown",ev=>{if(ev.button===0){const target=ev.composedPath()[0]
if(target.classList.contains("segment")){const segment=target
if(segment.spTeSegment==this.selectedSegment){this.zoomToCurrent()}else{const spteSegment=segment.spTeSegment
this._setSelection(spteSegment,true)
this.wedlet.spteInfoBroker.dispatchInfo(new InfoSpTeFocus(spteSegment.wedAnchor,true),this)}}}})
this._zoomBox.addEventListener("dragstart",ev=>{const target=ev.composedPath()[0]
if(target.classList.contains("handler")&&!this._segmentDragData){const{start:start,end:end,parentStart:parentStart,parentEnd:parentEnd}=this.selectedTeSegment
const startPos=target.classList.contains("start")?start:end
const startPoint=this.points.indexOf(startPos)
let minPoint=0
let minPos=0
let maxPoint=this.points.length-1
let maxPos=this.points[maxPoint]
if(parentStart!=null){minPos=parentStart
minPoint=this.points.indexOf(minPos)}if(parentEnd!=null){maxPos=parentEnd
maxPoint=this.points.indexOf(maxPoint)}this._segmentDragData={startX:ev.clientX+this._scrollBox.scrollLeft,startPos:startPos,startPoint:startPoint,points:Array.from(this.points),minPos:Math.min(minPos+(startPoint-minPoint)*this.minSegmentDuration,startPos),maxPos:Math.max(maxPos-(maxPoint-startPoint)*this.minSegmentDuration,startPos)}
target.classList.add("drag")
ev.stopPropagation()
ev.dataTransfer.effectAllowed=wedlet.editMode===EWedletEditMode.write?"copyMove":"copy"
ev.dataTransfer.setDragImage(new Image,0,0)}})
window.addEventListener("dragover",ev=>{if(!this._segmentDragData)return
ev.preventDefault()
const{minPos:minPos,maxPos:maxPos,startX:startX,startPos:startPos,startPoint:startPoint,points:points}=this._segmentDragData
const posDelta=(ev.clientX+this._scrollBox.scrollLeft-startX)/this.zoomLevel
let newPos=startPos+posDelta
const videoPos=this.video.currentTime
if(Math.abs(newPos-videoPos)<20/this.zoomLevel&&videoPos>=minPos&&videoPos<=maxPos)newPos=videoPos
else newPos=Math.min(Math.max(newPos,minPos),maxPos)
if(points[startPoint]==newPos)return
points[startPoint]=newPos
this._setWorkPoint(startPoint,newPos)
let interval=0
for(let i=startPoint-1;i>=0;i--){if(this.points[i]>newPos-interval-this.minSegmentDuration){interval+=this.minSegmentDuration
const pos=newPos-interval
points[i]=pos
this._setWorkPoint(i,pos)}else{points[i]=this.points[i]
this._setWorkPoint(i,null)}}interval=0
for(let i=startPoint+1;i<points.length;i++){if(this.points[i]<newPos+interval+this.minSegmentDuration){interval+=this.minSegmentDuration
const pos=newPos+interval
points[i]=pos
this._setWorkPoint(i,pos)}else{points[i]=this.points[i]
this._setWorkPoint(i,null)}}})
this._zoomBox.addEventListener("dragend",ev=>{const{points:points}=this._segmentDragData
for(let i=0;i<=points.length;i++)this._setWorkPoint(i,null)
const target=ev.composedPath()[0]
target.classList.remove("drag")
this._segmentDragData=null
this.wedlet.wedMgr.freezeFocus=true
const batch=this.wedlet.wedMgr.docHolder.newBatch()
try{for(const level of this.levels){if(level)for(const segment of level){const startPoint=this.points.indexOf(segment.start)
const endPoint=this.points.indexOf(segment.end)
if(points[startPoint]!=segment.start||points[endPoint]!=segment.end){segment.wedlet.getTemporal().updateTemporal(batch,points[startPoint].toFixed(3),points[endPoint].toFixed(3))}}}}finally{batch.doBatch()
this.wedlet.wedMgr.freezeFocus=false}})
const resizeObserver=new ResizeObserver(entries=>{const duration=this.spteSrcDuration
if(duration==null)return
this._minZoomLevel=this._scrollBox.clientWidth/duration
if(this._zoomLevel<this._minZoomLevel)this._zoomLevel=this._minZoomLevel
this._zoomBox.style.width=this.spteSrcDuration*this._zoomLevel+"px"
this.updateWaveform(true)})
resizeObserver.observe(this._editBox)
if(UiThemeDeskFeat.isIn(desk)){desk.onThemeChange.add(()=>this.updateWaveform(true))}this.setAttribute("draggable","true")
this.addEventListener("dragstart",ev=>{ev.preventDefault()
ev.stopPropagation()})
this._updateReadyState("noStream")}setEditMode(mode){this.editMode=mode
this._toolBar.refreshContent()
this.redrawSpTeView()}_updateReadyState(state,msgTimeout=200){this.readyState=state
if(this.readyState==="ready"){this._editBox.hidden=false
if(this.video.videoWidth===0){this.setAttribute("audio","")}else{this.video.hidden=false}}else{this._editBox.hidden=this.video.hidden=true
this.removeAttribute("audio")}this._toolBar.refreshContent()
if(this._readyStateRequest)window.clearTimeout(this._readyStateRequest)
this._readyStateRequest=setTimeout(()=>{if(this.readyState==="ready"){this._msgBox.hidden=true}else{let msg
switch(this.readyState){case"noStream":msg="Aucun média n\'est renseigné."
break
case"notSupported":msg="Le format du média n\'est pas pris en charge."
break
case"loading":msg="Chargement du média et de l\'interface en cours, veuillez patienter..."
break}this._msgBox.textContent=msg
this._msgBox.hidden=false}},msgTimeout)}setUrl(url,noCleanup=false){this.continuousSegMgr.setDuration(undefined)
this._durationProp=0
this._noCleanup=noCleanup
if(url){this.video.src=url
this._updateReadyState("loading")}else{this.video.src=""
this.setWaveformUrl(null)
this._updateReadyState("noStream")}}setDurationProp(duration){this._durationProp=duration}setWaveformUrl(url){this._waveform.setUrl(url).then(()=>this.updateWaveform(true))}connectedCallback(){if(this.isSpTeSrcAvailable)this._onReady()
if(this.hasAttribute("sticky")){let n=DOMSH.getFlatParentElt(this)
const root=this.wedlet.wedMgr.wedEditor.scrollContainer
while(n){const st=n.style
st.flex="1"
st.display="flex"
st.flexDirection="column"
if(n===root){n.style.scrollBehavior="auto"
break}st.border="none"
n=DOMSH.getFlatParentElt(n)}}}_onReady(){this._updateReadyState("ready")
this._zoomLevel=this._minZoomLevel=this._scrollBox.clientWidth/this.spteSrcDuration
this._zoomBox.style.width=""
const fixDurationMsgs=this.continuousSegMgr.setDuration(this.spteSrcDuration)
if(fixDurationMsgs&&!this._noCleanup){this.wedlet.wedMgr.docHolder.newBatch().addAll(fixDurationMsgs).doBatch()
POPUP.showNotifInfo("Les durées des segments ont été ajustées à la durée du média. Annulez pour restaurer les précédentes valeurs.",this)}this.redrawSpTeView()}redrawSpTeView(scrollToCurrent=false){if(this.readyState!=="ready"||this._redrawRequest)return
if(!this._noCleanup){const currentRootMsg=this.wedlet.wedMgr.currentMsgsStack[0]
this._noCleanup=currentRootMsg&&currentRootMsg.metas&&currentRootMsg.metas.noCleanup}if(this._fixDurationPopup){this._fixDurationPopup.close()
this._fixDurationPopup=null}this._redrawRequest=window.requestAnimationFrame(()=>{this._redrawRequest=0
const duration=this.spteSrcDuration
if(this._noCleanup&&this.continuousSegMgr.needFixDuration(duration)){this._showDurationFixNotif()}this._noCleanup=false
this.levels=[]
this.points=[]
this.selectedTeSegment=null
if(this.forkedWedlet){const visitor=wedlet=>{if(wedlet instanceof SpTeSegmentWedlet){const teWedlet=wedlet.getTemporal()
if(teWedlet){const level=parseInt(teWedlet.model.config.getAttribute("level"))
if(!this.levels[level])this.levels[level]=[]
const start=parseFloat(teWedlet.getStart())
const end=parseFloat(teWedlet.getEnd())
if(!this.points.includes(start))this.points.push(start)
if(!this.points.includes(end))this.points.push(end)
const segment={start:start,end:end,wedlet:wedlet}
if(this.selectedSegment===segment.wedlet){this.selectedTeSegment=segment
const handleable=teWedlet.getHandleable()
if(handleable==="never"||this.editMode!==EWedletEditMode.write)segment.handleStart=segment.handleEnd=false
else if(!handleable||handleable=="always"){segment.handleStart=start!=0}else if(handleable==="restrictToContainer"){const parentW=wedlet.getParentSegmentWedlet()
if(parentW){const parentTe=parentW.getTemporal()
segment.parentStart=parseFloat(parentTe.getStart())
segment.parentEnd=parseFloat(parentTe.getEnd())
segment.handleStart=segment.start>segment.parentStart
segment.handleEnd=segment.end<segment.parentEnd}else{segment.handleStart=start!=0}}}this.levels[level].push(segment)}}if(isParentWedlet(wedlet))wedlet.visitWedletChildren(0,Number.MAX_SAFE_INTEGER,visitor)}
this.forkedWedlet.visitWedletChildren(0,Number.MAX_SAFE_INTEGER,visitor)}this.points.sort((a,b)=>a-b)
const lastPoint=this.points[this.points.length-1]
if(this.selectedTeSegment&&"handleStart"in this.selectedTeSegment&&!("handleEnd"in this.selectedTeSegment))this.selectedTeSegment.handleEnd=this.selectedTeSegment.end!=lastPoint
this.minSegmentDuration=Math.min(duration/(this.points.length-1),1)
const pointsVars=this.points.map((point,i)=>`--spte-point-${i}: ${point*100/duration}%;`)
this._pointsStyle.textContent=`:host {\n${pointsVars.join("\n")}\n}`
const tplLevels=this.levels.map(level=>xhtml`
				<div class="level">
					${level.map(segment=>this._tplSegment(segment))}
				</div>
			`)
renderAppend(xhtml`${tplLevels}`,this._levelsBox)
if(this.selectedTeSegment){renderAppend(this._tplSegment(this.selectedTeSegment,xhtml`
					<div class="handler start" draggable="true" b.hidden="${!this.selectedTeSegment.handleStart}"/>
					<div class="zoomSegmentCo" />
					<div class="handler end" draggable="true"  b.hidden="${!this.selectedTeSegment.handleEnd}" />`),this._zoomBox)
if(scrollToCurrent)this.scrollToCurrent()}this._toolBar.refreshContent()})}_tplSegment(segment,subTpl=""){const startPoint=this.points.indexOf(segment.start)
const endPoint=this.points.indexOf(segment.end)
const style=`--spte-start: var(--spte-point-${startPoint}); --spte-end: var(--spte-point-${endPoint})`
const title=`${this.formatTime(segment.start)} - ${this.formatTime(segment.end)}`
return xhtml`<div class="segment" style="${style}" title="${title}" b.spte-selected="${this.selectedSegment==segment.wedlet}" p.spTeSegment="${segment.wedlet}" tabindex="0">${subTpl}</div>`}_showDurationFixNotif(){let btnOk,btnCancel
const fixDurationNotif=JSX.createElement("div",{style:"display: flex; flex-wrap: wrap;"},JSX.createElement("p",null,"La durée du média ne correspond pas à la durée de la segmentation. Souhaitez-vous corriger cette durée ?"),btnOk=JSX.createElement("c-button",{"ui-context":"dialog"},"Oui"),btnCancel=JSX.createElement("c-button",{"ui-context":"dialog"},"Non"))
this._fixDurationPopup=POPUP.showNotifWarning(fixDurationNotif,this,{autoHide:0})
btnOk.onclick=()=>{this._fixDurationPopup.close()
this._fixDurationPopup=null
const fixDurationMsgs=this.continuousSegMgr.setDuration(this.spteSrcDuration)
if(fixDurationMsgs)this.wedlet.wedMgr.docHolder.newBatch().addAll(fixDurationMsgs).doBatch()}
btnCancel.onclick=()=>{this._fixDurationPopup.close()
this._fixDurationPopup=null}}_setWorkPoint(point,pos){this._editBox.style.setProperty("--spte-point-"+point,pos?pos*100/this.spteSrcDuration+"%":null)}onInfo(info){if(info instanceof InfoSpTeFocus){if(this.forkedWedlet){this._setSelection(SPTE.findSpTeSegmentWedlet(WEDLET.findWedlet(this.forkedWedlet,info.focusXa,WEDLET.FINDOPTIONS_lastAncestorIfNone)))}}}_setSelection(segment,internal=false){if(this.selectedSegment===segment)return
this.selectedSegment=segment
this.redrawSpTeView(true)}refreshBindValue(val,children){const wedMgr=this.wedlet.wedMgr
this.continuousSegMgr=wedMgr.docHolder.getAspect(this.wedlet.wedAnchor,null,"ContinuousSegMgr",{track:""})
if(this.forkedWedlet){this.forkedWedlet.onDelete()
this.forkedWedlet=null}if(val!==null&&typeof val==="object"){const model=wedMgr.wedModel.findModelForNode(val,this.forkedModes,this.forkedVariants,this.wedlet)
if(model){this.forkedWedlet=model.createWedlet(this.wedlet.wedParent)
this.forkedWedlet.spTeViews=[this]
this.forkedWedlet.bindWithNode(this.wedlet.xaPart,val,children)}}}updateWaveform(complete=false){if(this._waveformRequest)return
this._waveformRequest=window.requestAnimationFrame(()=>{this._waveformRequest=0
const zoomStartPos=this._scrollBox.scrollLeft/this._zoomLevel
const zoomEndPos=(this._scrollBox.scrollLeft+this._scrollBox.clientWidth)/this._zoomLevel
if(complete)this._waveform.resize()
this._waveform.draw(zoomStartPos,zoomEndPos,this.spteSrcDuration)
this._waveformStart=zoomStartPos})}_startCursorsUpdate(){this._updateCursorsRequest=window.setInterval(()=>{requestAnimationFrame(()=>{this._updateCursors()})},Math.max(500/this._zoomLevel,17))}_updateCursors(){const pos=this.video.currentTime*100/this.spteSrcDuration
this._levelsCursor.style.left=this._zoomCursor.style.left=pos+"%"}formatTime(time){if(time===undefined)time=this.video.currentTime
const date=new Date(time*1e3)
const hours=date.getUTCHours()
const minutes=date.getUTCMinutes().toString().padStart(2,"0")
const seconds=date.getUTCSeconds().toString().padStart(2,"0")
const milliSec=date.getUTCMilliseconds().toString().padStart(3,"0")
let fmtTime=`${minutes}:${seconds}.${milliSec}`
if(hours)fmtTime=`${hours}:${fmtTime}`
return fmtTime}zoom(level,center){this._zoomLevel=Math.max(Math.min(level,this.maxZoomLevel),this.minZoomLevel)
this._zoomBox.style.width=this.spteSrcDuration*this._zoomLevel+"px"
this._scrollBox.scrollLeft=center*this._zoomLevel-this._scrollBox.clientWidth/2
this._toolBar.refreshContent()
if(this._updateCursorsRequest){window.clearInterval(this._updateCursorsRequest)
this._startCursorsUpdate()}this.updateWaveform(true)}zoomIn(){const center=(this._scrollBox.scrollLeft+this._scrollBox.clientWidth/2)/this._zoomLevel
this.zoom(this._zoomLevel*2,center)}zoomOut(){const center=(this._scrollBox.scrollLeft+this._scrollBox.clientWidth/2)/this._zoomLevel
this.zoom(this._zoomLevel/2,center)}zoomToCurrent(){const{start:start,end:end}=this.selectedTeSegment
const duration=end-start
const center=start+duration/2
this.zoom(this._scrollBox.clientWidth/(duration*1.4),center)}scrollToCurrent(){const{start:start,end:end}=this.selectedTeSegment
const duration=end-start
if(duration*this._zoomLevel<this._scrollBox.clientWidth){const center=start+duration/2
this._scrollBox.scrollLeft=center*this._zoomLevel-this._scrollBox.clientWidth/2}else{this._scrollBox.scrollLeft=start*this.zoomLevel-50}}}REG.reg.registerSkin("spte-segmentor",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-width: 30em;\n\t\tmin-height: 15em;\n\t\tflex-direction: column;\n\t\tbackground-color: var(--bgcolor);\n\t}\n\n\t:host([sticky]) {\n\t\tposition: sticky;\n\t\tbottom: 0;\n\t\tz-index: 1001;\n\t\theight: 15em;\n\t\tmargin-top: auto;\n\t}\n\n\t#main {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tposition: relative;\n\t}\n\n\t#msg {\n\t\tdisplay: flex;\n\t\tbackground-color: var(--bgcolor);\n\t\tmin-width: auto;\n\t\tmin-height: auto;\n\t\tposition: absolute;\n\t\ttop: 0;\n\t\tright: 0;\n\t\tbottom: 0;\n\t\tleft: 0;\n\t\talign-items: center;\n\t\tjustify-content: center;\n\t\tpointer-events: all;\n\t}\n\n\t#edit {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tflex-direction: column;\n\t\tborder: solid 1px var(--alt1-border-color);\n\t\tbackground-color: var(--edit-bgcolor);\n\t}\n\n  #details {\n\t  position: relative;\n\t  flex: 1;\n\t  display: flex;\n\t  min-width: 0;\n\t  min-height: 0;\n  }\n\n  #levels {\n\t  position: relative;\n\t  margin-inline-start: -1px;\n\t  margin-inline-end: -1px;\n\t  overflow: hidden;\n  }\n\n  .level {\n\t  position: relative;\n\t  height: 1em;\n\t  border-bottom: solid 1px var(--alt1-border-color);\n  }\n\n  .level:last-child {\n\t\tborder-bottom: none;\n\t}\n\n\t#scroll {\n\t\tflex: 1;\n\t\toverflow-x: scroll;\n\t\toverflow-y: hidden;\n\t\tposition: relative;\n\t}\n\n\n\t#scroll::-webkit-scrollbar {\n\t\twidth: 5px;\n\t\theight: 8px;\n\t\tbackground-color: var(--scroll-color);\n\t\tborder-top: solid 1px var(--alt1-border-color);\n\t\tborder-bottom: solid 1px var(--alt1-border-color);\n\t}\n\n\t/* Add a thumb */\n\t#scroll::-webkit-scrollbar-thumb {\n\t\tbackground: var(--scroll-thumb-color);\n\t\tmin-height: 2px;\n\t}\n\n\t#zoom {\n\t\tposition: relative;\n\t\toverflow: hidden;\n\t\theight: 100%;\n\t}\n\n\tspte-waveform {\n\t\tposition: absolute;\n\t\tdisplay: block;\n\t\twidth: 100%;\n\t\theight: calc(100% - 8px);\n\t}\n\n\tvideo {\n\t\tflex-basis: 320px;\n\t\tmargin-inline-start: 1em;\n\t\tmin-width: 160px;\n\t}\n\n  video[hidden] {\n\t  margin-inline-start: 0;\n  }\n\n  .cursor {\n\t  position: absolute;\n\t  top: 0;\n\t  bottom: 0;\n\t  background-color: var(--alt1-color);\n\t  width: 1px;\n\t  margin-inline-start: -0.5px;\n\t  z-index: 1;\n  }\n\n  .segment {\n\t  position: absolute;\n\t  top: 0;\n\t  bottom: 0;\n\t  border-inline-start: solid 0.5px var(--alt1-border-color);\n\t  border-inline-end: solid 0.5px var(--alt1-border-color);\n\t  background-color: var(--alt1-bgcolor);;\n\t  left: var(--spte-start);\n\t  width: calc(var(--spte-end) - var(--spte-start));\n  }\n\n  .segment[spte-selected] {\n\t  background-color: var(--edit-select-bgcolor);\n  }\n\n  #zoom > .segment {\n\t\tdisplay: flex;\n\t\tjustify-content: center;\n\t\tborder: none;\n\t}\n\n\t.zoomSegmentCo {\n\t\tflex: 1;\n\t}\n\n\t.handler {\n\t\twidth: 8px;\n\t\tmin-width: 8px;\n\t\tbackground-color: var(--edit-seltext-bgcolor);\n\t\tcursor: col-resize;\n\t\tposition: relative;\n\t\tz-index: 1;\n\t}\n\n\t#msg[hidden], #edit[hidden] {\n\t\tdisplay: none;\n\t}\n\n\tc-resizer {\n\t\twidth: 5px;\n\t}\n\n\t:host([audio]) c-resizer {\n\t\tdisplay: none;\n\t}\n`)
REG.reg.registerSkin("spte-segmentor/toolbar",1,`\n\t::slotted(hr) {\n\t\tborder: none;\n\t\tflex: 1;\n\t}\n\n\t::slotted(hr:first-of-type) {\n\t\tflex: 0;\n\t\tmargin-inline-end: 1em;\n\t}\n\n\t::slotted(hr:last-of-type) {\n\t\tflex: 0;\n\t\tmargin-inline-start: 1em;\n\t}\n\n`)
window.customElements.define("spte-segmentor",SpTeSegmentor)
export class SpTeWaveform extends HTMLElement{async setUrl(url){if(url){const resp=await fetch(url)
const rawData=await resp.arrayBuffer()
this._data=new Uint8Array(rawData)
this._canvas=this.appendChild(JSX.createElement("canvas",null))
this.resize()}else if(this._data){this._data=null
this._canvas.remove()
this._canvas=null}}resize(){if(!this._data||!this._canvas)return
const size=this.getBoundingClientRect()
this._canvas.height=Math.ceil(size.height)
this._canvas.width=Math.ceil(size.width)}draw(start,end,duration,x1=0,x2=this.clientWidth){if(!this._data||!this._canvas)return
const ctx=this._canvas.getContext("2d")
const width=x2-x1
const height=this.clientHeight
const startOffset=start/duration*this._data.length
const ratio=(end-start)/duration
const chunkSize=this._data.length/width*ratio
const style=getComputedStyle(this)
ctx.strokeStyle=style.getPropertyValue("--fade-color")
ctx.clearRect(x1,0,x2,height)
this._drawLeaders(ctx,x1,x2,height)
ctx.strokeStyle=style.getPropertyValue("--edit-color")
ctx.lineWidth=.5
ctx.beginPath()
ctx.moveTo(x1,height/2)
for(let i=x1;i<x2;i++){let min=Infinity
let max=-Infinity
let start=Math.floor(startOffset+(i-x1)*chunkSize)
if(start%2==1)start+=1
const end=start+chunkSize
let lastOffset=0
for(let j=start;j<end&&j<this._data.length-1;j+=2){if(this._data[j]<min)min=this._data[j]
if(this._data[j+1]>max)max=this._data[j+1]
lastOffset=j+1}ctx.lineTo(i,min*height/255)
ctx.lineTo(i+.4,max*height/255)}ctx.stroke()}slide(offset){if(!this._data||!this._canvas)return
const ctx=this._canvas.getContext("2d")
if(offset<0){const vImageData=ctx.getImageData(0,0,this.clientWidth+offset,this.clientHeight)
ctx.clearRect(0,0,this.clientWidth,this.clientHeight)
ctx.putImageData(vImageData,-offset,0)}else if(offset>0){const vImageData=ctx.getImageData(offset,0,this.clientWidth,this.clientHeight)
ctx.clearRect(0,0,this.clientWidth,this.clientHeight)
ctx.putImageData(vImageData,0,0)}return offset}_drawLeaders(ctx,x1,x2,height){ctx.lineWidth=.7
ctx.beginPath()
ctx.moveTo(x1,height/2)
ctx.lineTo(x2,height/2)
ctx.lineWidth=.5
ctx.moveTo(x1,height/4)
ctx.lineTo(x2,height/4)
ctx.moveTo(x1,height-height/4)
ctx.lineTo(x2,height-height/4)
ctx.stroke()}}window.customElements.define("spte-waveform",SpTeWaveform)
const addAction=new class extends Action{constructor(){super("add")
this._label="Ajout d\'un segment"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/spte/temporal/add.svg"
this._group="struct"}isEnabled(ctx){this._splittedSegment=null
this._struct=null
if(ctx.readyState!=="ready"||!ctx.selectedSegment||ctx.editMode!==EWedletEditMode.write||!ctx.points)return false
const pos=ctx.video.currentTime
for(const point of ctx.points){if(pos>point-ctx.minSegmentDuration&&pos<point+ctx.minSegmentDuration)return false}let splittedLeaf
const lastLevel=ctx.levels[ctx.levels.length-1]
for(const segment of lastLevel){if(pos>=segment.start&&pos<segment.end){splittedLeaf=segment
break}}if(!splittedLeaf)return
const{docHolder:docHolder}=ctx.wedlet.wedMgr
let w=splittedLeaf.wedlet
while(w){const structs=docHolder.getInsertableStructs(w.wedParent.wedAnchor,w.xaPart+1)
if(structs.length)this._struct=structs[0].find(struct=>struct.structMatch(ENodeType.element,ctx.selectedSegment.model.nodeName))
if(this._struct){this._splittedSegment=w
return true}const parentW=w.getParentSegmentWedlet()
if(parseFloat(w.getTemporal().getEnd())!=parseFloat(parentW.getTemporal().getEnd()))break
w=parentW}return false}execute(ctx){const content=[]
const pos=ctx.video.currentTime
const batch=ctx.wedlet.wedMgr.docHolder.newBatch()
batch.addAll(ctx.continuousSegMgr.forceEnd(this._splittedSegment.getTemporal().wedAnchor,pos,true))
this._struct.createContent(content)
setSegmentBoundaries(content,pos,parseFloat(this._splittedSegment.getTemporal().getEnd()))
const xa=XA.append(this._splittedSegment.wedParent.wedAnchor,this._splittedSegment.xaPart+1)
batch.insertJml(xa,content)
batch.doBatch()}}
const previousAction=new Action("previous").setLabel("Déplace le curseur au début du segment courant").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/spte/temporal/previous.svg").setGroup("media").setEnabled(ctx=>ctx.readyState==="ready"&&ctx.points&&ctx.points.length>1&&ctx.video.currentTime!=0).setExecute(ctx=>{const pos=ctx.video.currentTime
let newPos
for(let i=1;i<ctx.points.length;i++){if(ctx.points[i]>=pos){const point=ctx.points[i-1]
if(pos-point<.5){if(i>1)newPos=ctx.points[i-2]
else newPos=0}else{newPos=point}break}}ctx.video.currentTime=newPos})
const nextAction=new Action("next").setLabel("Déplace le curseur à la fin du segment courant").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/spte/temporal/next.svg").setGroup("media").setEnabled(ctx=>ctx.readyState==="ready"&&ctx.points&&ctx.points.length>1&&ctx.video.currentTime!=ctx.spteSrcDuration).setExecute(ctx=>{const pos=ctx.video.currentTime
let newPos
for(let i=ctx.points.length-2;i>=0;i--){if(ctx.points[i]<=pos){const point=ctx.points[i+1]
newPos=point
break}}ctx.video.currentTime=newPos})
const playAction=new Action("play").setLabel("Lecture / pause").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/spte/temporal/play.svg").setGroup("media").setEnabled(ctx=>ctx.readyState==="ready").setExecute(async ctx=>{try{if(ctx.video.paused)await ctx.video.play()
else ctx.video.pause()}catch(e){await ERROR.show("Lecture de la vidéo impossible.",e)}}).override("getDatas",(api,ctx)=>!ctx.video.paused).override("isToggle",()=>true)
const forwardAction=new Action("forward").setLabel("Avance de 5 secondes le curseur de lecture").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/spte/temporal/forward.svg").setGroup("media").setEnabled(ctx=>ctx.readyState==="ready").setExecute(ctx=>{ctx.video.currentTime+=5})
const rewindAction=new Action("rewind").setLabel("Recule de 5 secondes le curseur de lecture").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/spte/temporal/rewind.svg").setGroup("media").setEnabled(ctx=>ctx.readyState==="ready").setExecute(ctx=>{ctx.video.currentTime-=5})
const zoomInAction=new Action("zoomIn").setLabel("Augmente le niveau de zoom").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/spte/temporal/zoomIn.svg").setGroup("zoom").setEnabled(ctx=>ctx.readyState==="ready"&&ctx.zoomLevel<ctx.maxZoomLevel).setExecute(ctx=>{ctx.zoomIn()})
const zoomOutAction=new Action("zoomOut").setLabel("Diminue le niveau de zoom").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/spte/temporal/zoomOut.svg").setGroup("zoom").setEnabled(ctx=>ctx.readyState==="ready"&&ctx.zoomLevel>ctx.minZoomLevel).setExecute(ctx=>{ctx.zoomOut()})
const zoomToAction=new Action("zoomTo").setLabel("Zoom sur le segment courant").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/spte/temporal/zoomTo.svg").setGroup("zoom").setEnabled(ctx=>ctx.readyState==="ready"&&ctx.selectedSegment!=null).setExecute(ctx=>{ctx.zoomToCurrent()})
const timeAction=new class extends Action{constructor(){super()
this._group="time"}buildCustomButton(ctx,uiContext,parent){return new SpTeTime(ctx).initialize()}}
class SpTeTime extends HTMLElement{constructor(_seg){super()
this._seg=_seg}initialize(init){JSX.appendChildren(this,JSX.createElement(ShadowJsx,{reg:REG.findReg(init),skin:"spte-time"},this._currentTimeInput=JSX.createElement("input",{id:"currentTime"}),JSX.createElement("span",{id:"sep"},"/"),this._durationSpan=JSX.createElement("span",{id:"duration"})))
this.initialized=true
this._currentTimeInput.addEventListener("change",()=>this.parseTime())
return this}buildInitFromAtts(init){}refresh(){this._currentTimeInput.disabled=this._seg.readyState!=="ready"||this._seg.editMode!==EWedletEditMode.write
const focusedInput=this.shadowRoot.activeElement==this._currentTimeInput
if(this._seg.spteSrcDuration){if(!focusedInput)this._currentTimeInput.value=this._seg.formatTime()
this._durationSpan.textContent=this._seg.formatTime(this._seg.spteSrcDuration)}else{if(!focusedInput)this._currentTimeInput.value=this._seg.formatTime(0)
this._durationSpan.textContent=this._seg.formatTime(0)}}parseTime(){const timeParts=this._currentTimeInput.value.split(":")
const seconds=parseFloat(timeParts[timeParts.length-1])
const minutes=timeParts.length>1?parseInt(timeParts[timeParts.length-2]):0
const hours=timeParts.length>2?parseInt(timeParts[timeParts.length-3]):0
const time=hours*3600+minutes*60+seconds
if(!isNaN(time))this._seg.video.currentTime=time}refreshFreeze(delta){}}REG.reg.registerSkin("spte-time",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\talign-items: center;\n\t\tmin-height: 0;\n\t\tmin-width: auto;\n\t\tfont-size: .8em;\n\t}\n\n\t#currentTime, #duration {\n\t\t-webkit-appearance: none;\n\t\tborder: none;\n\t\ttext-align: center;\n\t\twidth: 5.5em;\n\t\tfont-family: inherit;\n\t\tfont-size: inherit;\n\t}\n\n\t#currentTime {\n\t\tbackground-color: var(--edit-bgcolor);\n\t\tcolor: var(--edit-color);\n\t}\n\n\t#sep {\n\t\tmargin: 0 .2em;\n\t}\n`)
window.customElements.define("spte-time",SpTeTime)
REG.reg.addToList("actions:wed:spte:temporal","add",1,addAction,10)
REG.reg.addToList("actions:wed:spte:temporal","previous",1,previousAction,20)
REG.reg.addToList("actions:wed:spte:temporal","rewind",1,rewindAction,30)
REG.reg.addToList("actions:wed:spte:temporal","play",1,playAction,40)
REG.reg.addToList("actions:wed:spte:temporal","forward",1,forwardAction,50)
REG.reg.addToList("actions:wed:spte:temporal","next",1,nextAction,60)
REG.reg.addToList("actions:wed:spte:temporal","time",1,timeAction,70)
REG.reg.addToList("actions:wed:spte:temporal","zoomIn",1,zoomInAction,80)
REG.reg.addToList("actions:wed:spte:temporal","zoomOut",1,zoomOutAction,90)
REG.reg.addToList("actions:wed:spte:temporal","zoomTo",1,zoomToAction,110)
export function setSegmentBoundaries(segment,start,end){const segCh=segment[1]
if(!Array.isArray(segCh))throw Error("Segment children not found: "+JML.jmlToXml(segment))
const{ch:temporalCh}=JML.findJmlEltByName(segCh,SC_TEMPORAL)
if(!Array.isArray(temporalCh))throw Error("Temporal children not found: "+JML.jmlToXml(segment))
if(typeof start==="number"){const{node:startNode}=JML.findJmlEltByName(temporalCh,SC_START)
if(!startNode)throw Error("Start node not found: "+JML.jmlToXml(segment))
JML.replaceChildren([start.toFixed(3)],startNode,temporalCh)}if(typeof end==="number"){const{node:endNode}=JML.findJmlEltByName(temporalCh,SC_END)
if(!endNode)throw Error("End node not found: "+JML.jmlToXml(segment))
JML.replaceChildren([end.toFixed(3)],endNode,temporalCh)}}const SC_TEMPORAL="sc:temporal"
const SC_START="sc:start"
const SC_END="sc:end"
let keyMap
function getKey(physKey,defaultCharKey){return keyMap&&keyMap.has(physKey)?keyMap.get(physKey):defaultCharKey}export async function jslibAsyncInit(){keyMap=navigator.keyboard&&await navigator.keyboard.getLayoutMap()
if(keyMap&&!keyMap.size)keyMap=null}
//# sourceMappingURL=spteSegmentor.js.map