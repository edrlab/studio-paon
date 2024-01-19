import{BaseElement,BASIS,Label}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{GFX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/gfx.js"
export const IS_Popupable=n=>n&&"onNextClose"in n
export var EPopupType;(function(EPopupType){EPopupType[EPopupType["menu"]=0]="menu"
EPopupType[EPopupType["dialog"]=1]="dialog"
EPopupType[EPopupType["floating"]=2]="floating"
EPopupType[EPopupType["tooltip"]=3]="tooltip"})(EPopupType||(EPopupType={}))
export function MxPopupable(Base,type){return class MxPopupable extends Base{get opened(){return this.hasAttribute("opened")}get view(){return this.firstElementChild}get windowBar(){return DOM.findNext(this.shadowRoot,this.shadowRoot,n=>n instanceof WindowBar)}_initialize(init){super._initialize(init)
this.popupType=type
this.attachShadow(DOMSH.SHADOWDOM_INIT)
const sr=this.shadowRoot
const reg=this.findReg(init)
reg.installSkin("popupable",sr)
this._initAndInstallSkin(this.localName,init)
this.shadowRoot.appendChild(JSX.createElement("button",{id:"focusStart",onfocus:this.onFocusStart}))
this.contentRoot=this.eltForMove=sr.appendChild(JSX.createElement("div",{id:"content"}))
if(init.resizer)this.contentRoot=this.contentRoot.appendChild((new WindowResizer).initialize(init.resizer))
if(init.titleBar){const tiInit=typeof init.titleBar==="string"?{barLabel:{label:init.titleBar}}:init.titleBar
const ti=this.contentRoot.appendChild((new WindowBar).initialize(tiInit))
ti.slot="title"}this._builBodySlot()
this.shadowRoot.appendChild(JSX.createElement("button",{id:"focusEnd",onfocus:this.onFocusEnd}))
this._subPopupSlot=this.shadowRoot.appendChild(JSX.createElement("slot",{name:"subPopup"}))
this._externalResize={proxy:this.onExternalResize.bind(this),previousWidth:0,previousHeight:0,timeout:0}
if(init.observeResize!==false&&"ResizeObserver"in window){this._internalResize={observer:new ResizeObserver(this.onInternalResize),skipNextEvent:true,request:0,target:this.contentRoot,freeze:0}}this.addEventListener("keydown",(function(ev){if(!this.onKeyDown(ev)){if(ev.key==="Escape"){ev.preventDefault()
ev.stopImmediatePropagation()
if(this.popupType==EPopupType.tooltip){let tooltip=this
do{tooltip.tryClose()
const parent=tooltip.parentElement
tooltip=IS_Popupable(parent)&&parent.popupType===EPopupType.tooltip&&parent}while(tooltip)}else{this.tryClose()}let popup=this
do{popup.tryClose()
popup=IS_Popupable(popup.parentElement)&&popup.parentElement.popupType===EPopupType.tooltip&&popup.parentElement}while(popup)}}}))}_builBodySlot(){this._bodySlot=this.contentRoot.appendChild(JSX.createElement("slot",{id:"body"}))}show(anchor,uiContainer,logicalParent){if(this.opened)return false
this._returnValue=undefined
this._restoreFocus=this.restoreFocus||DOMSH.findDeepActiveElement(document)
this.uiContainer=uiContainer
this.logicalParent=logicalParent!==undefined?logicalParent:DOM.findLogicalParentOrSelf(uiContainer,null,DOM.IS_element)
if(this.dispatchEvent(new CustomEvent("c-show",{bubbles:false,composed:false,cancelable:true}))===false)return false
this.internalResizeFreeze(1)
this.parentPopup=findPopupableParent(uiContainer)
if(this.parentPopup){this.remove()
this.setAttribute("slot","subPopup")
this.setAttribute("opened","sub")
this.parentPopup.appendChild(this)}else{this.remove()
this.setAttribute("opened","main")
document.body.appendChild(this)}if(type===EPopupType.menu)this.setAttribute("role","menu")
else if(type===EPopupType.dialog||type==EPopupType.floating)this.setAttribute("role","dialog")
else if(type===EPopupType.tooltip)this.setAttribute("role","tooltip")
this._closeLstns={}
if(type===EPopupType.menu||type==EPopupType.dialog){if(!DOMSH.isAncestor(this._bodySlot,document.activeElement)){const firstFocusable=DOMSH.findFlatNext(this._bodySlot,this.contentRoot,DOM.IS_focusable)
if(firstFocusable)firstFocusable.focus()
else{this.contentRoot.tabIndex=0
this.contentRoot.focus()}}this.addEventListener("mousewheel",this.onScrollPrevent,{passive:false})
this.addEventListener("touchmove",this.onScrollPrevent,{passive:false})
this._closeLstns["mousewheel"]=this.onScrollPrevent
this._closeLstns["touchmove"]=this.onScrollPrevent}if(type===EPopupType.dialog){this._focusReentrance=()=>{let subDialog=false
for(const subPopup of this._subPopupSlot.assignedNodes()){if(subPopup.popupType==EPopupType.dialog){subDialog=true
break}}if(!subDialog)this.contentRoot.focus()}
window.addEventListener("focus",this._focusReentrance)}if(type===EPopupType.menu){this.addEventListener("pointerdown",this.menuOnPointerDown)
this.addEventListener("contextmenu",this.menuOnContextMenu)
this._closeLstns["pointerdown"]=this.menuOnPointerDown
this._closeLstns["contextmenu"]=this.menuOnContextMenu
this._currentAnchor=anchor}else if(type===EPopupType.dialog){this._currentAnchor=anchor||{viewPortY:"middle",fixSize:true}}else if(type===EPopupType.floating||type===EPopupType.tooltip){this._currentAnchor=anchor}this._externalResize.previousWidth=window.innerWidth
this._externalResize.previousHeight=window.innerHeight
window.addEventListener("resize",this._externalResize.proxy)
this._setPosition(this._currentAnchor)
this.internalResizeFreeze(-1)
this.onViewShown()
return true}close(returnValue){if(!this.opened||this.closing)return false
this._returnValue=returnValue
this.closing=true
this.dispatchEvent(new CustomEvent("c-beforeclose",{bubbles:false,composed:false,cancelable:false,detail:{returnValue:this._returnValue}}))
this.closing=false
for(const eventType in this._closeLstns)this.removeEventListener(eventType,this._closeLstns[eventType])
if(this._focusReentrance)window.removeEventListener("focus",this._focusReentrance)
window.removeEventListener("resize",this._externalResize.proxy)
clearTimeout(this._externalResize.timeout)
if(this._internalResize)this._internalResize.observer.disconnect()
this.onViewHidden(this.usedOnce)
return true}async tryClose(returnValue){if(!this.opened)return false
this._returnValue=returnValue
if(await VIEWS.canHideView(this,true)){return this.close(returnValue)}return false}onNextClose(){return new Promise(resolve=>{if(!this._waitingClose)this._waitingClose=[resolve]
else this._waitingClose.push(resolve)})}onViewShown(){this.dispatchEvent(new CustomEvent("c-shown",{bubbles:false,composed:false}))
VIEWS.onViewShown(this.view)}onViewBeforeHide(close){for(const subPopup of this._subPopupSlot.assignedNodes()){if("onViewBeforeHide"in subPopup&&!subPopup.onViewBeforeHide(close))return false}if(this.view&&"onViewBeforeHide"in this.view&&!this.view.onViewBeforeHide(close))return false
if(close){const beforeCloseEvent=new CustomEvent("c-beforeclose",{bubbles:false,composed:false,cancelable:true,detail:{returnValue:this._returnValue}})
if(this.dispatchEvent(beforeCloseEvent)===false)return false}return true}async onViewWaitForHide(close){for(const subPopup of this._subPopupSlot.assignedNodes()){if("onViewWaitForHide"in subPopup&&!await subPopup.onViewWaitForHide(close))return false}if(this.view&&"onViewWaitForHide"in this.view&&!await this.view.onViewWaitForHide(close))return false
return true}onViewHidden(closed){for(const subPopup of this._subPopupSlot.assignedNodes()){VIEWS.onViewHidden(subPopup,closed)}VIEWS.onViewHidden(this.view,closed)
this.removeAttribute("opened")
if(this._restoreFocus&&this.contentRoot&&this.matches(":focus-within")&&this._restoreFocus.isConnected){this._restoreFocus.focus()
this._restoreFocus=null}if(this.parentNode)this.remove()
if(this._waitingClose){for(const fct of this._waitingClose)fct(this._returnValue)
this._waitingClose=null}this.dispatchEvent(new CustomEvent("c-close",{bubbles:true,composed:false,detail:{returnValue:this._returnValue}}))
delete this.logicalParent}visitViews(visitor,options){if(options&&options.visible&&!this.opened)return
let result
if(this.view)result=visitor(this.view)
if(result!==undefined)return result
for(const subPopup of this._subPopupSlot.assignedNodes()){result=visitor(subPopup)
if(result!==undefined)return result}}async visitViewsAsync(visitor,options){if(options&&options.visible&&!this.opened)return
let result
if(this.view)result=await visitor(this.view)
if(result!==undefined)return result
for(const subPopup of this._subPopupSlot.assignedNodes()){result=await visitor(subPopup)
if(result!==undefined)return result}}buildLastDatas(parentLastDatas){}onKeyDown(ev){return false}menuOnPointerDown(ev){if(ev.button!=2&&ev.composedPath()[0]===this){ev.preventDefault()
let rootMenu=this
while(rootMenu.parentPopup&&rootMenu.parentPopup.popupType==EPopupType.menu)rootMenu=rootMenu.parentPopup
rootMenu.tryClose()}}menuOnContextMenu(ev){if(ev.composedPath()[0]===this){ev.stopPropagation()
ev.preventDefault()
let rootMenu=this
while(rootMenu.parentPopup&&rootMenu.parentPopup.popupType==EPopupType.menu)rootMenu=rootMenu.parentPopup
rootMenu.tryClose()}}onScrollPrevent(ev){if(ev.composedPath()[0]==this)ev.preventDefault()}_setPosition(anchor){this.internalResizeFreeze(1)
const st=this.eltForMove.style
st.top="0"
st.left="0"
st.width=anchor.initWidth||null
st.height=anchor.initHeight||null
st.maxHeight=anchor.initMaxHeight||null
st.maxWidth=null
let{width:width,height:height}=this.eltForMove.getBoundingClientRect()
if(anchor.fixSize){const padding=anchor.viewPortPadding||10
const maxW=document.documentElement.clientWidth-padding*2
if(width>maxW){width=maxW
st.width=width+"px"
height=this.eltForMove.offsetHeight}else st.width=width+"px"
st.height=Math.min(document.documentElement.clientHeight-padding*2,height)+"px"}const aroundElem=isAroundPosition(anchor)?anchor.elem:anchor instanceof HTMLElement?anchor:null
if(aroundElem&&aroundElem!==this.eltForMove){this.fixAroundPos(aroundElem,st,width,height)}else if(isFixedPosition(anchor)){if(anchor.initX+width<=document.documentElement.clientWidth)st.left=anchor.initX+"px"
else st.left=Math.max(0,document.documentElement.clientWidth-width)+"px"
if(anchor.initY+height<=document.documentElement.clientHeight)st.top=anchor.initY+"px"
else st.top=Math.max(0,document.documentElement.clientHeight-height)+"px"}else if(isRelativePosition(anchor)){this.fixRelativePos(anchor,this.eltForMove,width,height)}else{this.fixScreenPos(anchor,this.eltForMove,width,height)}if(!anchor.fixSize){st.maxWidth=document.documentElement.clientWidth-parseInt(st.left.substr(0,st.left.length-2))+"px"
if(!anchor.initMaxHeight){st.maxHeight=document.documentElement.clientHeight-parseInt(st.top.substr(0,st.top.length-2))+"px"}}this._currentAnchor=anchor
this.internalResizeFreeze(-1)}updatePosition(){if(this.manuallyMoved||this.manuallyResized){const style=getComputedStyle(this.eltForMove)
let anchor
if(this.manuallyMoved){anchor={initX:parseFloat(style.left)*window.innerWidth/this._externalResize.previousWidth,initY:parseFloat(style.top)*window.innerHeight/this._externalResize.previousHeight,initWidth:this._currentAnchor.initWidth,initHeight:this._currentAnchor.initHeight,fixSize:this._currentAnchor.fixSize}}else{if(this._currentAnchor instanceof HTMLElement){anchor={initX:parseFloat(style.left),initY:parseFloat(style.top),initWidth:null,initHeight:null,fixSize:false}}else{anchor=Object.assign({},this._currentAnchor)}}if(this.manuallyResized){anchor.fixSize=true
anchor.initWidth=parseFloat(style.width)*window.innerWidth/this._externalResize.previousWidth+"px"
anchor.initHeight=parseFloat(style.height)*window.innerHeight/this._externalResize.previousHeight+"px"}this._setPosition(anchor)}else{this._setPosition(this._currentAnchor)}}fixAroundPos(anchor,st,width,height){const anchorRect="left"in anchor?anchor:anchor.getBoundingClientRect()
if(anchorRect.left+width<=document.documentElement.clientWidth)st.left=Math.round(anchorRect.left)+"px"
else st.left=Math.max(0,Math.round(anchorRect.right-width))+"px"
if(anchorRect.bottom+height<=document.documentElement.clientHeight)st.top=Math.round(anchorRect.bottom)+"px"
else st.top=Math.max(0,Math.round(anchorRect.top-height))+"px"}fixRelativePos(pos,target,targetW,targetH){let fromRect=pos.posFrom.getBoundingClientRect()
if(pos.intersectWith)fromRect=GFX.intersect(fromRect,pos.intersectWith.getBoundingClientRect())||pos.intersectWith.getBoundingClientRect()
const dir=window.getComputedStyle(pos.posFrom).direction||"ltr"
let x
switch(pos.fromX){case"end":x=dir==="ltr"?fromRect.right:fromRect.left
break
case"middle":x=fromRect.left+(fromRect.right-fromRect.left)/2
break
default:x=dir==="ltr"?fromRect.left:fromRect.right}if(pos.marginX)x+=dir==="ltr"?pos.marginX:-pos.marginX
switch(pos.targetX){case"end":if(dir==="ltr")x-=targetW
break
case"middle":x+=dir==="ltr"?-targetW/2:targetW/2
break
default:if(dir==="rtl")x-=targetW}const tolX=pos.toleranceX||0
const winX=document.documentElement.clientWidth-targetW
if(x>=-tolX&&x<=winX+tolX){let y
switch(pos.fromY){case"bottom":y=fromRect.bottom
break
case"middle":y=fromRect.top+(fromRect.bottom-fromRect.top)/2
break
default:y=fromRect.top}if(pos.marginY)y+=pos.marginY
switch(pos.targetY){case"bottom":y-=targetH
break
case"middle":y-=targetH/2
break}const tolY=pos.toleranceY||0
const winY=document.documentElement.clientHeight-targetH
if(y>=-tolY&&y<=winY+tolY){target.style.top=Math.max(0,Math.min(winY,y))+"px"
target.style.left=Math.max(0,Math.min(winX,x))+"px"
return true}}if(pos.notAvailableSpace){if(isRelativePosition(pos.notAvailableSpace))return this.fixRelativePos(pos.notAvailableSpace,target,targetW,targetH)
this.fixScreenPos(pos.notAvailableSpace,target,targetW,targetH)}else{this.fixAroundPos(pos.posFrom,target.style,targetW,targetH)}return true}fixScreenPos(anchor,target,targetW,targetH){const dir=window.getComputedStyle(target).direction||"ltr"
const padding=anchor.viewPortPadding||10
const winW=document.documentElement.clientWidth
const winH=document.documentElement.clientHeight
const maxWinW=winW-padding-padding
const maxWinH=winH-padding-padding
if(targetW>maxWinW||targetH>maxWinH){const originalW=target.style.maxWidth
const originalH=target.style.maxHeight
if(targetW>maxWinW)target.style.maxWidth=maxWinW+"px"
if(targetH>maxWinH)target.style.maxHeight=maxWinH+"px"
targetW=target.offsetWidth
targetH=target.offsetHeight
const resetMaxSize=()=>{target.style.maxWidth=originalW
target.style.maxHeight=originalH
this.removeEventListener("c-close",resetMaxSize)}
this.addEventListener("c-close",resetMaxSize)}let x
let y
if(anchor.viewPortX==="start")x=dir==="ltr"?padding:winW-targetW-padding
else if(anchor.viewPortX==="end")x=dir==="ltr"?winW-targetW-padding:padding
else x=(winW-targetW)/2
if(anchor.viewPortY==="bottom")y=winH-targetH-padding
else if(anchor.viewPortY==="1/3")y=(winH-targetH)/3
else if(anchor.viewPortY==="middle")y=(winH-targetH)/2
else y=padding
target.style.top=y+"px"
target.style.left=x+"px"}onFocusStart(){let newFocus
const popupable=DOMSH.findHost(this)
if(type===EPopupType.tooltip){newFocus=DOM.IS_focusable(popupable.uiContainer)?popupable.uiContainer:DOMSH.findFlatPrevious(popupable.uiContainer,document,DOM.IS_focusable)
popupable.tryClose()}else{newFocus=DOMSH.findFlatLastDesc(popupable.contentRoot.lastChild,DOM.IS_focusable)}if(newFocus)newFocus.focus()}onFocusEnd(){let newFocus
const popupable=DOMSH.findHost(this)
if(type===EPopupType.tooltip){if(!DEBUG_TOOLTIP){newFocus=DOMSH.findFlatNext(popupable.uiContainer,document,DOM.IS_focusable)
popupable.tryClose()}}else{newFocus=DOMSH.findFlatNext(popupable.contentRoot,popupable.contentRoot,DOM.IS_focusable)}if(newFocus)newFocus.focus()}onExternalResize(ev){if(this._externalResize.timeout!==null)window.cancelIdleCallback(this._externalResize.timeout)
this._externalResize.timeout=window.requestIdleCallback(()=>{this._externalResize.timeout=null
this.updatePosition()
this._externalResize.previousWidth=window.innerWidth
this._externalResize.previousHeight=window.innerHeight})}onInternalResize(entries){const popupable=findPopupableParent(entries[0].target)
if(popupable._internalResize.skipNextEvent){popupable._internalResize.skipNextEvent=false
return}if(popupable._internalResize.request)return
if(popupable.manuallyResized){popupable._internalResize.observer.unobserve(popupable._internalResize.target)
return}popupable._internalResize.request=window.requestAnimationFrame(()=>{popupable._internalResize.request=0
popupable.updatePosition()})}internalResizeFreeze(delta){if(this._internalResize){this._internalResize.freeze+=delta
if(this._internalResize.freeze===1)this._internalResize.observer.unobserve(this._internalResize.target)
else if(this._internalResize.freeze===0){this._internalResize.skipNextEvent=true
this._internalResize.observer.observe(this._internalResize.target)}}}}}REG.reg.registerSkin("popupable",1,`\n\t:host {\n\t\tdisplay: none;\n\t}\n\n\t:host([opened]) {\n\t\tdisplay: block;\n\t\tposition: fixed;\n\t\ttop: 0;\n\t\tright: 0;\n\t\tbottom: 0;\n\t\tleft: 0;\n\t\tz-index: 1001;\n\t\tpointer-events: none;\n\t}\n\n\t#content {\n\t\tdisplay: flex;\n\t\tposition: fixed;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tbox-sizing: border-box;\n\t\tpointer-events: auto;\n\t}\n\n\t#focusStart, #focusEnd {\n\t\tposition: absolute;\n\t\tborder: 0;\n\t\tpadding: 0;\n\t}\n`)
function isAroundPosition(anchor){return"elem"in anchor}function isFixedPosition(anchor){return"initX"in anchor}function isRelativePosition(anchor){return anchor.posFrom}export class WindowBar extends BaseElement{get noDrag(){return this.getAttribute("draggable")!=="true"}_initialize(init){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
const reg=this.findReg(init)
if(typeof init.barLabel==="function"){sr.appendChild(init.barLabel())}else{let initLabel
if(init.barLabel){initLabel=init.barLabel
if(!("noShadow"in initLabel))initLabel.noShadow=true
if(!("ellipsis"in initLabel))initLabel.ellipsis=true}else{initLabel={noShadow:true,ellipsis:true}}initLabel.reg=reg
this.barLabel=sr.appendChild((new Label).initialize(initLabel))}if(init.closeButton!==null){const initBtn=BASIS.newInit(init.closeButton,reg)
if(!initBtn.uiContext)initBtn.uiContext="custom"
if(!("icon"in initBtn))initBtn.icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/popupable/close.svg"
if(!initBtn.title)initBtn.title="Fermer"
this.closeButton=sr.appendChild((new Button).initialize(initBtn))
this.closeButton.onclick=ev=>{findPopupableParent(this).tryClose()}}this._initAndInstallSkin("c-window-bar",init)
if(!init.noDrag)this.setAttribute("draggable","true")
if(!this.noDrag){this.ondragstart=windowDragStart
this.ondragover=defaulDragHover}}}REG.reg.registerSkin("c-window-bar",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: min-content;\n\t\tmin-width: 0;\n\t\talign-items: center;\n\t\tcolor: var(--dialog-color);\n\t\tbackground-color: var(--dialog-bgcolor);\n\t\t--pressed-bgcolor: var(--inv-pressed-bgcolor);\n\t\t--filter: var(--inv-filter);\n\t\t--hover-filter: var(--inv-hover-filter);\n\t\t--active-filter: var(--inv-active-filter);\n\t\tpadding: 0.2em 0.5em;\n\t}\n\n\tc-label {\n\t\tflex: 1;\n\t\tuser-select: none;\n\t\tfont-size: 1.1em;\n\t\twidth: min-content;\n\t\toverflow: hidden;\n\t\tdisplay: -webkit-box;\n\t  -webkit-line-clamp: 2;\n\t  -webkit-box-orient: vertical;\n\t}\n\n\tc-button {\n\t\tmargin-inline-start: .5em;\n\t}\n\n\t.icon {\n\t\tbackground: var(--dialog-color) var(--icon-img) no-repeat center / contain;\n\t}\n`)
customElements.define("c-window-bar",WindowBar)
function windowDragStart(ev){const popupable=findPopupableParent(this)
popupable.manuallyMoved=true
const toMove=popupable.eltForMove
const rect=toMove.getBoundingClientRect()
const st=toMove.style
st.margin="unset"
st.left=rect.left+"px"
st.top=rect.top+"px"
st.width=rect.width+"px"
st.height=rect.height+"px"
st.right=null
st.bottom=null
ev.dataTransfer.effectAllowed="move"
ev.dataTransfer.setDragImage(JSX.createElement("span",null),0,0)
const baseLeft=rect.left-ev.screenX
const baseTop=rect.top-ev.screenY
this.ondrag=ev=>{if(ev.clientX===0)return
toMove.style.left=baseLeft+ev.screenX+"px"
toMove.style.top=baseTop+ev.screenY+"px"}}function defaulDragHover(ev){ev.dataTransfer.dropEffect="move"
ev.preventDefault()}export class WindowResizer extends BaseElement{_initialize(init){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.addHandler("tl",sr)
this.addHandler("t",sr)
this.addHandler("tr",sr)
this.addHandler("l",sr)
sr.appendChild(JSX.createElement("slot",null))
this.addHandler("r",sr)
this.addHandler("l",sr)
sr.appendChild(JSX.createElement("slot",{name:"title"}))
this.addHandler("r",sr)
this.addHandler("bl",sr)
this.addHandler("b",sr)
this.addHandler("br",sr)}addHandler(pos,sr){const div=sr.appendChild(JSX.createElement("div",{id:pos,draggable:"true"}))
div.ondragstart=resizerDragStart
div.ondragover=defaulDragHover}}function resizerDragStart(ev){const popupable=findPopupableParent(this)
popupable.manuallyResized=true
const toMove=popupable.eltForMove
const rect=toMove.getBoundingClientRect()
const st=toMove.style
st.margin="unset"
st.left=rect.left+"px"
st.top=rect.top+"px"
const dR=document.documentElement.clientWidth-rect.right
st.right=dR+"px"
const dB=document.documentElement.clientHeight-rect.bottom
st.bottom=dB+"px"
st.width="auto"
st.height="auto"
ev.dataTransfer.effectAllowed="move"
ev.dataTransfer.setDragImage(JSX.createElement("span",null),0,0)
const pos=this.getAttribute("id")
const baseLeft=rect.left-ev.screenX
const baseTop=rect.top-ev.screenY
const baseRight=dR+ev.screenX
const baseBottom=dB+ev.screenY
this.ondrag=ev=>{if(ev.screenX===0)return
if(pos.indexOf("l")>=0)toMove.style.left=baseLeft+ev.screenX+"px"
if(pos.indexOf("t")>=0)toMove.style.top=baseTop+ev.screenY+"px"
if(pos.indexOf("r")>=0)toMove.style.right=baseRight-ev.screenX+"px"
if(pos.indexOf("b")>=0)toMove.style.bottom=baseBottom-ev.screenY+"px"}}customElements.define("c-window-resizer",WindowResizer)
REG.reg.registerSkin("c-window-resizer",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: grid;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tgrid-template-columns: 7px 1fr 7px;\n\t\tgrid-template-rows: 7px auto 1fr 7px;\n\t\tgrid-template-areas: "tl t tr" "l title r" "l slot r" "bl b br";\n\t\tmargin: -7px;\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--focus-outline);\n\t}\n\n\tslot {\n\t\tgrid-area: slot;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\toverflow: auto;\n\t}\n\n\tslot[name=title] {\n\t\tgrid-area: title;\n\t\toverflow: hidden;\n\t}\n\n\tdiv {\n\t\tgrid-area: attr(id);\n\t}\n\n\t#tl {\n\t\tcursor: se-resize;\n\t}\n\n\t#br {\n\t\tcursor: se-resize;\n\t}\n\n\t#t, #b {\n\t\tcursor: ns-resize;\n\t}\n\n\t#tr, #bl {\n\t\tcursor: ne-resize;\n\t}\n\n\t#l, #r {\n\t\tcursor: ew-resize;\n\t}\n`)
export function findPopupableParent(from,root){return DOMSH.findFlatParentElt(from,root,IS_Popupable)}export const DEBUG_TOOLTIP=false
REG.reg.registerSkin("standard-dialog",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n  #main {\n\t  flex: 1;\n\t  display: flex;\n\t  min-height: 0;\n\t  min-width: 0;\n\t  flex-direction: column;\n\t  padding: 1em;\n  }\n\n\t#footer {\n\t\tdisplay: flex;\n\t\tmin-height: fit-content;\n\t\tmin-width: 0;\n\t\talign-items: center;\n\t\tjustify-content: flex-end;\n\t\tborder-top: 1px solid var(--border-color);\n\t}\n`)

//# sourceMappingURL=popupable.js.map