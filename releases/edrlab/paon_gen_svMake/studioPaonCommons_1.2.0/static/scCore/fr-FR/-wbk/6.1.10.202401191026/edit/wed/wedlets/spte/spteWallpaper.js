import{EWedletEditMode,isParentWedlet,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{renderAppend,svg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/htmlLit.js"
import{WED}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedCore.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{GFX,SVG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/gfx.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{Action,ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{ActionActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{InfoSpTeFocus,SPTE,SpTeSegmentWedlet}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/spte/spte.js"
const ZOOM_LEVELS=3
export class SpTeWallpaper extends HTMLElement{constructor(){super(...arguments)
this._currentToolLstns=[]
this._percentIntFormat=new Intl.NumberFormat("fr",{style:"percent",maximumFractionDigits:0})
this._percentOneDigitFormat=new Intl.NumberFormat("fr",{style:"percent",maximumFractionDigits:1})}get firstAvailableTool(){return this.tools.find(tool=>tool.isAvailable(this))}get selectedSegment(){return this._selectedSegment}setSelection(segment,internal=false){if(this._selectedSegment===segment)return
this._selectedSegment=segment
if(!internal)this._zoomToOnRedraw=this.selectedArea
this._toolBar.refreshContent()
this.redrawSpTeView()}get selectedArea(){for(let area=this.areasLayer.firstElementChild;area;area=area.nextElementSibling){if(area.spTeSegment===this._selectedSegment)return area}return null}redrawSpTeView(){if(!this.redrawable||this._redrawViewRequest)return
this._redrawViewRequest=window.requestAnimationFrame(()=>{this._redrawViewRequest=0
renderAppend(this.tplAreas(),this.areasLayer)
this.redrawTools()
if(this._updateMaskOnRedraw){this.updateMask()
this._updateMaskOnRedraw=false}})}redrawTools(){if(this._redrawToolsRequest)return
this._redrawToolsRequest=window.requestAnimationFrame(()=>{this._redrawToolsRequest=0
this.clearToolsLayer()
this.showToolsLayer()
if(this.redrawable){if(this.currentTool&&"redraw"in this.currentTool)this.currentTool.redraw(this)
if(this._zoomToOnRedraw){setTimeout(()=>{if(this._zoomToOnRedraw&&this.isSpTeSrcAvailable&&!this.isVisible(this._zoomToOnRedraw))this.zoomToRect(this.canvasContentRect(this._zoomToOnRedraw))
this._zoomToOnRedraw=null})}}})}configWedletElt(tpl,wedlet){this.redrawable=false
this.wedlet=wedlet
this.wedlet.setSpTeSource(this)
const modes=WED.parseModes(this.getAttribute("wedlet-modes"))
if(modes)this.forkedModes={"":modes}
this.availableShapes=this.wedlet.wedMgr.reg.getListAsMap("wed:spTeSpatial:shapes")
if(this.hasAttribute("creatable-shapes"))this.creatableShapes=this.getAttribute("creatable-shapes").split(" ")
else this.creatableShapes=this.wedlet.wedMgr.reg.getPref("spte.creatableShapes",["rect","circle","poly"])
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.wedlet.wedMgr.reg.installSkin("spte-wallpaper",this.shadowRoot)
this.wedlet.wedMgr.reg.installSkin("scroll/large",this.shadowRoot)
this._toolBar=sr.appendChild(new BarActions)
this.scrollBox=sr.appendChild(JSX.createElement("div",{class:"scrollBox"}))
this.zoomBox=this.scrollBox.appendChild(JSX.createElement("div",{id:"zoomBox"}))
this.contentBox=this.zoomBox.appendChild(JSX.createElement("div",{id:"content"}))
this._img=this.contentBox.appendChild(JSX.createElement("img",null))
this._img.onload=()=>{if(this.isConnected)this.onSpTeSrcChange()}
this._insideMask=JSX.asSvg(()=>JSX.createElement("mask",{id:"insideMask"},JSX.createElement("rect",{x:"0",y:"0",width:"0",height:"0",fill:"#444"}),JSX.createElement("rect",{x:"0",y:"0",width:"0",height:"0",fill:"white"})))
this.areasLayer=JSX.asSvg(()=>JSX.createElement("g",{id:"areasLayer",mask:"url(#insideMask)"}))
this.toolsLayer=JSX.asSvg(()=>JSX.createElement("g",{id:"toolsLayer"}))
this.canvas=this.contentBox.appendChild(JSX.asSvg(()=>JSX.createElement("svg",{focusable:"false"},[this._insideMask,this.areasLayer,this.toolsLayer])))
this._currentZoom=1
this.addEventListener("focusin",this.onFocusin)
this.addEventListener("focusout",this.onFocusout)
this.wedlet.spteInfoBroker.addConsumer(this)
const toolConstructors=this.wedlet.wedMgr.reg.getList("actions:wed:spte:spatial:tools")
this.tools=[]
for(const toolConstructor of toolConstructors){const tool=new toolConstructor
this.tools.push(tool)
if("enable"in tool)tool.enable(this)}this._toolBar.initialize({actions:this.tools,actionContext:this,groupOrder:"main secondary",skinOver:"spte-wallpaper/toolbar"})
this._zoomSelect=this._toolBar.shadowRoot.appendChild(JSX.createElement("select",{id:"zoomSelect"},JSX.createElement("option",{value:"toImage"},"Ajusté")))
this._currentZoomOption=JSX.createElement("option",{value:this.zoomLevel})
for(let i=ZOOM_LEVELS;i>=-ZOOM_LEVELS;i--){const level=1*Math.pow(2,i)
this._zoomSelect.appendChild(JSX.createElement("option",{value:level},this.formatZoomLevel(level)))}this._zoomSelect.addEventListener("change",()=>{if(this._zoomSelect.value=="toImage"){this.zoomToRect(this.canvasContentRect(this.canvas))}else{const pivotPoint={x:(this.scrollBox.clientWidth/2+this.scrollBox.scrollLeft-this.contentBox.offsetLeft)/this.zoomLevel,y:(this.scrollBox.clientHeight/2+this.scrollBox.scrollTop-this.contentBox.offsetTop)/this.zoomLevel}
this.zoomLevel=parseFloat(this._zoomSelect.value)
this.centeredOnCanvasPoint(pivotPoint)}})
this.addEventListener("contextmenu",ev=>{if(ev instanceof MouseEvent&&ev.shiftKey)return
ev.preventDefault()
ev.stopPropagation()})
this.addEventListener("pointerdown",ev=>{if(ev.button==1)ev.preventDefault()
ev.stopPropagation()})
this.setAttribute("draggable","true")
this.addEventListener("dragstart",ev=>{ev.preventDefault()
ev.stopPropagation()})}setEditMode(mode){this.editMode=mode
if(this.currentTool){if(this.currentTool.isAvailable(this))this.activateTool(this.currentTool,true)
else this.activateTool(this.firstAvailableTool)}else{this._toolBar.refreshContent()
this.redrawTools()}}activateTool(tool,force=false){if(this.currentTool){if(!force&&this.currentTool==tool)return
if("deactivate"in this.currentTool)this.currentTool.deactivate(this)
this.removeToolListeners()}this._currentToolLstns=[]
this.clearToolsLayer()
this.currentTool=tool
if(tool){this.currentTool.activate(this)
this.redrawTools()}this._toolBar.refreshContent()}addToolListener(lstn,lstns=this._currentToolLstns){lstns.push(lstn)
if(!lstn.tool)lstn.tool=this.currentTool
if(!lstn.ctx)lstn.ctx=this
lstn.target.addEventListener(lstn.event,lstn,{capture:lstn.capture,passive:lstn.passive})}removeToolListeners(lstns=this._currentToolLstns){for(const lstn of lstns)lstn.target.removeEventListener(lstn.event,lstn,lstn.capture)}tplAreas(){const areas=[]
if(this.forkedWedlet){const visitor=w=>{if(w instanceof SpTeSegmentWedlet){const sp=w.getSpatial()
if(sp){const spShape=sp.getShape()
const shape=this.availableShapes[spShape]
if(shape){areas.push(shape.tplArea(spShape,sp.getCoords(),w,this._selectedSegment===w))}else{console.log(`Unknow shape ${sp.getShape()}`)}}}if(isParentWedlet(w))w.visitWedletChildren(0,Number.MAX_SAFE_INTEGER,visitor)}
this.forkedWedlet.visitWedletChildren(0,Number.MAX_SAFE_INTEGER,visitor)}return svg`${areas}`}refreshBindValue(val,children){const wedMgr=this.wedlet.wedMgr
if(this.forkedWedlet){this.forkedWedlet.onDelete()
this.forkedWedlet=null}if(val!==null&&typeof val==="object"){const model=wedMgr.wedModel.findModelForNode(val,this.forkedModes,this.forkedVariants,this.wedlet)
if(model){this.forkedWedlet=model.createWedlet(this.wedlet.wedParent)
this.forkedWedlet.spTeViews=[this]
this.forkedWedlet.bindWithNode(this.wedlet.xaPart,val,children)}}}setUrl(url){if(url){this._img.src=url}else{this._img.src=""
if(this.isConnected)this.onSpTeSrcChange()}}get isSpTeSrcAvailable(){return this._img&&this._img.naturalWidth>0&&this._img.naturalHeight>0}get spteSrcDuration(){return undefined}get spteSrcSize(){return this._img.naturalWidth>0&&this._img.naturalHeight>0?{w:this._img.naturalWidth,h:this._img.naturalHeight}:undefined}onInfo(info){if(info instanceof InfoSpTeFocus){if(this.forkedWedlet){this.setSelection(SPTE.findSpTeSegmentWedlet(WEDLET.findWedlet(this.forkedWedlet,info.focusXa,WEDLET.FINDOPTIONS_lastAncestorIfNone)))}}}onFocusin(ev){DOMSH.findHost(this).setAttribute("selectin","")
const target=ev.target
if(target instanceof SVGGraphicsElement){DOM.setAttrBool(target,"spte-selected",true)}}onFocusout(){DOMSH.findHost(this).removeAttribute("selectin")}connectedCallback(){if(this.isSpTeSrcAvailable)this.onSpTeSrcChange()}onSpTeSrcChange(){if(!this.isSpTeSrcAvailable){if(this._resizeObserver){this._resizeObserver.disconnect()
this._resizeObserver=null}this.redrawable=false
renderAppend(null,this.areasLayer)
this.activateTool(null)
this.zoomLevel=1
return}this.canvas.setAttribute("viewBox",`0 0 ${this._img.naturalWidth} ${this._img.naturalHeight}`)
if(!this.redrawable){this._scrollParent=DOMSH.findFlatParentElt(this,document.documentElement,node=>getComputedStyle(node).overflowY!="visible")
this._resizeObserver=new ResizeObserver(entries=>{if(this._redrawViewRequest)return
for(const entry of entries){if(entry.target===this._scrollParent)this.setHeightFromScrollParent()
else if(entry.target===this)this.updateMask()}})
this._resizeObserver.observe(this)
this._resizeObserver.observe(this._scrollParent)
this.redrawable=true}this.activateTool(this.firstAvailableTool)
this.setHeightFromScrollParent()
this._zoomToOnRedraw=this.canvas
this._updateMaskOnRedraw=true
this.redrawSpTeView()}get zoomLevel(){return this._currentZoom}set zoomLevel(val){this._currentZoom=val
if(this.isSpTeSrcAvailable){const{w:imgW,h:imgH}=this.spteSrcSize
this._img.width=imgW*this._currentZoom
this._img.height=imgH*this._currentZoom}this.style.setProperty("--zoom-level",this._currentZoom.toString())
this.redrawTools()
this.updateMask()
this.updateZoomSelect()}zoomToRect(rect){if(!this.zoomBox.clientWidth||!this.zoomBox.clientHeight)return
const{w:imgW,h:imgH}=this.spteSrcSize
const targetWidth=imgW+SPATIAL_HANDLERS_WIDTH*2+Math.max(-Math.min(rect.x,0),rect.x+rect.width-imgW)*2
const targetHeight=imgH+SPATIAL_HANDLERS_WIDTH*2+Math.max(-Math.min(rect.y,0),rect.y+rect.height-imgH)*2
this.zoomLevel=Math.min(this.zoomBox.clientWidth/targetWidth,this.zoomBox.clientHeight/targetHeight)}centeredOnCanvasPoint(point){this.scrollBox.scrollTo(point.x*this.zoomLevel-this.zoomBox.clientWidth/2,point.y*this.zoomLevel-this.zoomBox.clientHeight/2)}clearToolsLayer(){while(this.toolsLayer.firstChild)this.toolsLayer.removeChild(this.toolsLayer.firstChild)}hideToolsLayer(){this.toolsLayer.style.display="none"}showToolsLayer(){this.toolsLayer.style.display=""}setHeightFromScrollParent(){const scrollHeight=this._scrollParent.getBoundingClientRect().height
this.style.maxHeight=scrollHeight-40+"px"
this.style.minHeight=scrollHeight/2+"px"}updateMask(){if(this._updateMaskRequest)return
this._updateMaskRequest=window.requestAnimationFrame(()=>{this._updateMaskRequest=0
const zoomRect=this.zoomBox.getBoundingClientRect()
const canvasRect=this.canvas.getBoundingClientRect()
const maskBkg=this._insideMask.firstElementChild
SVG.assignRectLengths(maskBkg,{x:(zoomRect.left-canvasRect.left)/this.zoomLevel,y:(zoomRect.top-canvasRect.top)/this.zoomLevel,width:zoomRect.width/this.zoomLevel,height:zoomRect.height/this.zoomLevel})
const maskFrg=this._insideMask.lastElementChild
if(this.isSpTeSrcAvailable){const{w:imgW,h:imgH}=this.spteSrcSize
SVG.assignRectLengths(maskFrg,{width:imgW,height:imgH})}else{SVG.assignRectLengths(maskFrg,{width:0,height:0})}})}canvasContentRect(svgElem){const{w:imgW,h:imgH}=this.spteSrcSize
const elemRect=svgElem.getBBox()
const x=Math.min(elemRect.x,0)
const y=Math.min(elemRect.y,0)
return{x:x,y:y,width:Math.max(elemRect.x+elemRect.width,imgW)-x,height:Math.max(elemRect.y+elemRect.height,imgH)-y}}clientToCanvasPoint(clientPoint){const canvasBBox=this.canvas.getBoundingClientRect()
return{x:(clientPoint.x-canvasBBox.left)/this.zoomLevel,y:(clientPoint.y-canvasBBox.top)/this.zoomLevel}}isVisible(svgElem){const contentRect=this.contentBox.getBoundingClientRect()
const visibleBox={x:(this.scrollBox.scrollLeft-this.contentBox.offsetLeft)/this.zoomLevel,y:(this.scrollBox.scrollTop-this.contentBox.offsetTop)/this.zoomLevel,width:this.scrollBox.clientWidth/this.zoomLevel,height:this.scrollBox.clientHeight/this.zoomLevel}
const svgElemBBox=svgElem.getBBox()
if(svgElem instanceof SVGSVGElement){svgElemBBox.x=Math.min(svgElemBBox.x,0)
svgElemBBox.y=Math.min(svgElemBBox.y,0)
const right=Math.max(svgElemBBox.x+svgElemBBox.width,contentRect.width)
svgElemBBox.width=right-svgElemBBox.x
const bottom=Math.max(svgElemBBox.y+svgElemBBox.height,contentRect.height)
svgElemBBox.height=bottom-svgElemBBox.y}return svgElemBBox.x>visibleBox.x&&svgElemBBox.y>visibleBox.y&&svgElemBBox.x+svgElemBBox.width<visibleBox.x+visibleBox.width&&svgElemBBox.y+svgElemBBox.height<visibleBox.y+visibleBox.height}updateZoomSelect(){this._currentZoomOption.remove()
this._zoomSelect.selectedIndex=-1
let insertCurrentBefore=null
for(const option of this._zoomSelect.options){if(option.value!="toImage"){const value=parseFloat(option.value)
if(value==this.zoomLevel){option.selected=true
break}else if(value<this.zoomLevel){insertCurrentBefore=option
break
this._currentZoomOption.textContent=this.formatZoomLevel(this.zoomLevel)
this._zoomSelect.insertBefore(this._currentZoomOption,option)
this._currentZoomOption.selected=true}}}if(this._zoomSelect.selectedIndex==-1){this._currentZoomOption.textContent=this.formatZoomLevel(this.zoomLevel)
this._zoomSelect.insertBefore(this._currentZoomOption,insertCurrentBefore)
this._currentZoomOption.selected=true}}formatZoomLevel(level){return(level<1?this._percentOneDigitFormat:this._percentIntFormat).format(level)}refreshToolbarContent(){this._toolBar.refreshContent()}}REG.reg.registerSkin("spte-wallpaper",1,`\n    :host {\n        display: flex;\n        min-width: 0;\n        min-height: 640px;\n        flex-direction: column;\n        background-color: var(--bgcolor);\n    }\n\n\t.scrollBox {\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\toverflow: auto;\n\t\tflex: 1;\n\t\tbackground-color: var(--edit-bgcolor);\n\t\tposition: relative;\n\t}\n\n\t#zoomBox {\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tflex: 1;\n\t\tuser-select: none;\n\t}\n\n\t#content {\n\t\tposition: relative;\n\t\tmargin: auto;\n\t}\n\n\t#content > img {\n\t\tdisplay: block;\n\t}\n\n\tsvg {\n\t\tdisplay: block;\n\t\tposition: absolute;\n\t\ttop: 0;\n\t\tleft: 0;\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\toverflow: visible;\n\t}\n\n    .area {\n        stroke-width: 0.5;\n        stroke: black;\n        stroke-opacity: 1;\n        fill: green;\n        fill-opacity: 0.3;\n    }\n\n\t[spte-selected] {\n\t\tfill: #2090ff;\n\t}\n\n    .handler {\n        fill: white;\n        stroke: black;\n        stroke-width: 1;\n    }\n`)
REG.reg.registerSkin("spte-wallpaper/toolbar",1,`\n\t::slotted(hr) {\n\t\tborder: none;\n\t\tflex: 1;\n\t}\n\n\t#zoomSelect {\n\t\tborder: 1px outset var(--border-color);\n\t\tborder-radius: 3px;\n\t\tmargin-inline: 1px;\n\t\tfont-size: var(--label-size);\n\t\tbackground-color: transparent;\n\t\tpadding: 2px 4px;\n\t\tbox-sizing: content-box;\n\t\theight: var(--icon-size);\n\t\twidth: 4.8em;\n\t}\n\n\t#zoomSelect:focus {\n\t\tbackground-color: var(--pressed-bgcolor);\n\t\tborder-style: inset;\n\t}\n`)
window.customElements.define("spte-wallpaper",SpTeWallpaper)
const SPATIAL_HANDLERS_WIDTH=10
class SpTeSpatialTool extends Action{isToggle(ctx){return true}getDatas(api,ctx){return ctx.currentTool===this}isEnabled(ctx){return ctx.isSpTeSrcAvailable}execute(ctx){ctx.activateTool(this)}}class SpTeSpatialToolSelect extends SpTeSpatialTool{activate(ctx){ctx.addToolListener({target:ctx.areasLayer,event:"focusin",handleEvent:function(ev){const area=ev.target
ctx.setSelection(area.spTeSegment,true)
this.ctx.wedlet.spteInfoBroker.dispatchInfo(new InfoSpTeFocus(area.spTeSegment.wedAnchor),ctx)}})
ctx.addToolListener({target:ctx.areasLayer,event:"pointerup",handleEvent:function(ev){const area=ev.target
this.ctx.wedlet.spteInfoBroker.dispatchInfo(new InfoSpTeFocus(area.spTeSegment.wedAnchor,true),ctx)}})
if(ctx.editMode===EWedletEditMode.write)ctx.addToolListener({target:ctx.zoomBox,event:"keydown",handleEvent:function(ev){if((ev.key==="Delete"||ev.key==="Backspace")&&this.ctx.selectedSegment){this.ctx.wedlet.wedMgr.docHolder.newBatch().deleteSequence(this.ctx.selectedSegment.wedAnchor,1).doBatch()}}})}}class SpTeSpatialToolMove extends SpTeSpatialTool{isEnabled(ctx){return super.isEnabled(ctx)&&ctx.editMode===EWedletEditMode.write}activate(ctx){ctx.addToolListener({target:ctx.areasLayer,event:"pointerdown",handleEvent:function(ev){if(ev.button!=0)return
const area=ev.target
const transform=area.ownerSVGElement.createSVGTransform()
area.transform.baseVal.initialize(transform)
this.tool._moveData={area:area,start:{x:ev.screenX,y:ev.screenY},delta:{x:0,y:0},transform:transform,lstns:[]}
this.ctx.addToolListener({target:window,event:"pointermove",handleEvent:function(ev){const{start:start,transform:transform}=this.tool._moveData
const delta={x:(ev.screenX-start.x)/this.ctx.zoomLevel,y:(ev.screenY-start.y)/this.ctx.zoomLevel}
this.ctx.hideToolsLayer()
transform.setTranslate(delta.x,delta.y)
this.tool._moveData.delta.x=delta.x
this.tool._moveData.delta.y=delta.y}},this.tool._moveData.lstns)
this.ctx.addToolListener({target:window,event:"pointerup",capture:true,handleEvent:function(){const{area:area,delta:delta,lstns:lstns}=this.tool._moveData
this.ctx.removeToolListeners(lstns)
area.transform.baseVal.removeItem(0)
if(delta.x||delta.y){const shape=this.ctx.availableShapes[area.getAttribute("spte-shape")]
shape.translateArea(area,delta.x,delta.y)
this.tool._moveData=null
try{this.ctx.wedlet.wedMgr.freezeFocus=true
area.spTeSegment.getSpatial().updateSpatial(this.ctx.wedlet.wedMgr.docHolder.newBatch(),shape.areaCoords(area)).doBatch()}finally{this.ctx.wedlet.wedMgr.freezeFocus=false}}}},this.tool._moveData.lstns)
const onCancel=()=>{const{area:area,lstns:lstns}=this.tool._moveData
area.transform.baseVal.clear()
ctx.removeToolListeners(lstns)
this.tool._moveData=null
this.ctx.showToolsLayer()}
ctx.addToolListener({target:window,event:"keydown",capture:true,handleEvent:function(ev){if(ev.key=="Escape")onCancel()}},this.tool._moveData.lstns)
ctx.addToolListener({target:window,event:"pointercancel",capture:true,handleEvent:onCancel},this.tool._moveData.lstns)}})}}class SpTeSpatialToolNodesBase extends SpTeSpatialTool{isEnabled(ctx){return super.isEnabled(ctx)&&ctx.editMode===EWedletEditMode.write}redraw(ctx){const area=ctx.selectedArea
if(!area)return
const shape=ctx.availableShapes[area.getAttribute("spte-shape")]
const nodes=shape.areaNodes(area)
for(const node of nodes)appendHandler(ctx,node)}}class SpTeSpatialToolMoveNodes extends SpTeSpatialToolNodesBase{activate(ctx){ctx.addToolListener({target:ctx.toolsLayer,event:"pointerdown",handleEvent:function(ev){if(ev.button!=0)return
const handler=ev.target
const area=this.ctx.selectedArea
const shape=this.ctx.availableShapes[area.getAttribute("spte-shape")]
this.tool._moveData={handler:handler,start:{x:ev.screenX,y:ev.screenY},nodeStart:{x:handler.node.x,y:handler.node.y},lstns:[],shape:shape}
this.ctx.addToolListener({target:window,event:"pointermove",handleEvent:function(ev){const{handler:handler,start:start,shape:shape,nodeStart:nodeStart}=this.tool._moveData
const delta={x:(ev.screenX-start.x)/this.ctx.zoomLevel,y:(ev.screenY-start.y)/this.ctx.zoomLevel}
handler.node.x=nodeStart.x+delta.x
handler.node.y=nodeStart.y+delta.y
if("updateAreaFromNodes"in shape){const handlers=Array.from(this.ctx.toolsLayer.children)
shape.updateAreaFromNodes(area,handlers.map(h=>h.node),handlers.indexOf(handler))}this.ctx.hideToolsLayer()}},this.tool._moveData.lstns)
this.ctx.addToolListener({target:window,event:"pointerup",capture:true,handleEvent:function(){const{shape:shape,lstns:lstns}=this.tool._moveData
this.ctx.removeToolListeners(lstns)
try{this.ctx.wedlet.wedMgr.freezeFocus=true
area.spTeSegment.getSpatial().updateSpatial(this.ctx.wedlet.wedMgr.docHolder.newBatch(),shape.areaCoords(area)).doBatch()}finally{this.ctx.wedlet.wedMgr.freezeFocus=false}this.tool._moveData=null}},this.tool._moveData.lstns)
const onCancel=()=>{const{handler:handler,nodeStart:nodeStart,lstns:lstns}=this.tool._moveData
handler.node.x=nodeStart.x
handler.node.y=nodeStart.y
if("updateAreaFromNodes"in shape){const handlers=Array.from(this.ctx.toolsLayer.children)
shape.updateAreaFromNodes(area,handlers.map(h=>h.node),handlers.indexOf(handler))}ctx.removeToolListeners(lstns)
this.tool._moveData=null
this.ctx.showToolsLayer()}
ctx.addToolListener({target:window,event:"keydown",capture:true,handleEvent:function(ev){if(ev.key=="Escape")onCancel()}},this.tool._moveData.lstns)
ctx.addToolListener({target:window,event:"pointercancel",capture:true,handleEvent:onCancel},this.tool._moveData.lstns)}})}}class SpTeSpatialToolAddNodes extends SpTeSpatialToolNodesBase{constructor(){super("addNodes")
this._label="Ajouter des nœuds"
this._group="main"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/spte/spatial/addNodes.svg"}isVisible(ctx){var _a
return((_a=ctx.selectedSegment)===null||_a===void 0?void 0:_a.getSpatial().getShape())=="poly"}activate(ctx){ctx.addToolListener({target:ctx.zoomBox,event:"pointerdown",handleEvent:function(ev){const area=this.ctx.selectedArea
if(!area||!(area instanceof SVGPolygonElement))return
const canvasPoint=this.ctx.clientToCanvasPoint({x:ev.clientX,y:ev.clientY})
const points=Array.from(area.points)
const sortedPoints=Array.from(points).sort((point1,point2)=>GFX.vecLength(canvasPoint,point1)-GFX.vecLength(canvasPoint,point2))
const closestPointIdx=points.indexOf(sortedPoints[0])
const prevPointIdx=closestPointIdx>0?closestPointIdx-1:points.length-1
const nextPointIdx=closestPointIdx<points.length-1?closestPointIdx+1:0
let refPointIdx=-1
const closestBrotherPoint=sortedPoints.find(point=>{if(point===points[prevPointIdx]){refPointIdx=closestPointIdx
return true}else if(point===points[nextPointIdx]){refPointIdx=nextPointIdx
return true}return false})
const polyline=JSX.asSvg(()=>JSX.createElement("polyline",{class:"area"}))
polyline.points.appendItem(sortedPoints[0])
polyline.points.appendItem(this.ctx.canvas.createSVGPoint())
polyline.points.appendItem(closestBrotherPoint)
this.ctx.toolsLayer.insertBefore(polyline,this.ctx.toolsLayer.firstChild)
Object.assign(polyline.points.getItem(1),canvasPoint)
this.tool._data={polyline:polyline,lstns:[],area:area,refPointIdx:refPointIdx}
this.ctx.addToolListener({target:window,event:"pointermove",handleEvent:function(ev){const{polyline:polyline}=this.tool._data
const canvasPoint=this.ctx.clientToCanvasPoint({x:ev.clientX,y:ev.clientY})
Object.assign(polyline.points.getItem(1),canvasPoint)}},this.tool._data.lstns)
this.ctx.addToolListener({target:window,event:"pointerup",handleEvent:function(ev){if(ev.button!=0)return
const{area:area,polyline:polyline,refPointIdx:refPointIdx,lstns:lstns}=this.tool._data
if(polyline){const shape=this.ctx.availableShapes[area.getAttribute("spte-shape")]
area.points.insertItemBefore(polyline.points.getItem(1),refPointIdx)
polyline.remove()
try{this.ctx.wedlet.wedMgr.freezeFocus=true
area.spTeSegment.getSpatial().updateSpatial(this.ctx.wedlet.wedMgr.docHolder.newBatch(),shape.areaCoords(area)).doBatch()}finally{this.ctx.wedlet.wedMgr.freezeFocus=false}ctx.refreshToolbarContent()}this.ctx.removeToolListeners(lstns)}},this.tool._data.lstns)}})}}class SpTeSpatialToolRemoveNodes extends SpTeSpatialToolNodesBase{constructor(){super("removeNodes")
this._label="Supprimer des nœuds"
this._group="main"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/spte/spatial/rmNodes.svg"}isVisible(ctx){var _a
return((_a=ctx.selectedSegment)===null||_a===void 0?void 0:_a.getSpatial().getShape())=="poly"}isEnabled(ctx){return ctx.selectedArea instanceof SVGPolygonElement&&ctx.selectedArea.points.numberOfItems>3}activate(ctx){ctx.addToolListener({target:ctx.toolsLayer,event:"pointerup",handleEvent:function(ev){if(ev.button!=0||!(ev.target instanceof SVGCircleElement))return
const handler=ev.target
const area=this.ctx.selectedArea
if(area instanceof SVGPolygonElement&&area.points.numberOfItems>3){area.points.removeItem(Array.prototype.findIndex.call(area.points,point=>point.x===handler.node.x&&point.y===handler.node.y))
const shape=this.ctx.availableShapes[area.getAttribute("spte-shape")]
try{this.ctx.wedlet.wedMgr.freezeFocus=true
area.spTeSegment.getSpatial().updateSpatial(this.ctx.wedlet.wedMgr.docHolder.newBatch(),shape.areaCoords(area)).doBatch()}finally{this.ctx.wedlet.wedMgr.freezeFocus=false}ctx.refreshToolbarContent()
ev.stopPropagation()}}})}}class SpTeSpatialToolHandle extends SpTeSpatialTool{constructor(){super("handle")
this._label="Modification"
this._group="main"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/spte/spatial/handle.svg"
this._subTools=[new SpTeSpatialToolSelect,new SpTeSpatialToolMove,new SpTeSpatialToolMoveNodes]}activate(ctx){for(const subTool of this._subTools)if("activate"in subTool&&subTool.isAvailable(ctx))subTool.activate(ctx)}deactivate(ctx){for(const subTool of this._subTools)if("deactivate"in subTool&&subTool.isAvailable(ctx))subTool.deactivate(ctx)}redraw(ctx){for(const subTool of this._subTools)if("redraw"in subTool&&subTool.isAvailable(ctx))subTool.redraw(ctx)}}class SpTeSpatialToolZoomAndPan extends SpTeSpatialTool{constructor(){super("zoom")
this._label="Zoom"
this._group="secondary"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/spte/spatial/zoom.svg"
this._zoomOutModifier=false}enable(ctx){ctx.zoomBox.addEventListener("wheel",ev=>{if(!ACTION.isAccelPressed(ev))return
if(ctx.redrawable){const pivotPoint=ctx.clientToCanvasPoint({x:ev.clientX,y:ev.clientY})
const zoomed=ev.deltaY<0?this._zoomIn(ctx):this._zoomOut(ctx)
if(zoomed)ctx.centeredOnCanvasPoint(pivotPoint)}ev.preventDefault()})}activate(ctx){ctx.zoomBox.style.cursor="zoom-in"
ctx.addToolListener({target:ctx.zoomBox,event:"pointerup",handleEvent:function(ev){if(ev.button!==0)return
ev.preventDefault()
ev.stopPropagation()
const pivotPoint=this.ctx.clientToCanvasPoint({x:ev.clientX,y:ev.clientY})
const zoomed=this.tool._zoomOutModifier?this.tool._zoomOut(this.ctx):this.tool._zoomIn(this.ctx)
if(zoomed)ctx.centeredOnCanvasPoint(pivotPoint)}})
ctx.addToolListener({target:window,event:"keydown",handleEvent:function(ev){if(ev.key==="Control"){this.tool._zoomOutModifier=true
this.ctx.zoomBox.style.cursor="zoom-out"}else if(ev.key=="Escape"){ctx.activateTool(ctx.firstAvailableTool)}}})
ctx.addToolListener({target:window,event:"keyup",handleEvent:function(ev){if(ev.key==="Control"){this.tool._zoomOutModifier=false
this.ctx.zoomBox.style.cursor="zoom-in"}}})
ctx.addToolListener({target:window,event:"focusout",handleEvent:function(ev){this.tool._zoomOutModifier=false
this.ctx.zoomBox.style.cursor="zoom-in"}})
ctx.addToolListener({target:ctx.zoomBox,event:"contextmenu",handleEvent:function(ev){const pivotPoint=this.ctx.clientToCanvasPoint({x:ev.clientX,y:ev.clientY})
const zoomed=this.tool._zoomOut(this.ctx)
if(zoomed)ctx.centeredOnCanvasPoint(pivotPoint)
this.ctx.zoomBox.style.cursor="zoom-out"
clearTimeout(this.tool._zoomOutCursorTimeout)
this.tool._zoomOutCursorTimeout=setTimeout(()=>{this.ctx.zoomBox.style.cursor="zoom-in"},300)}})}_zoomIn(wallpaper){const maxLevel=Math.pow(2,ZOOM_LEVELS)
if(wallpaper.zoomLevel>=maxLevel)return false
wallpaper.zoomLevel=Math.min(maxLevel,wallpaper.zoomLevel*Math.sqrt(2))
return true}_zoomOut(wallpaper){const minLevel=Math.pow(2,-ZOOM_LEVELS)
if(wallpaper.zoomLevel<=minLevel)return false
wallpaper.zoomLevel=Math.max(minLevel,wallpaper.zoomLevel/Math.sqrt(2))
return true}deactivate(ctx){ctx.zoomBox.style.cursor=""}}class SpTeSpatialToolCreate extends SpTeSpatialTool{constructor(){super("create")
this._label="Création"
this._group="main"}buildCustomButton(ctx,uiContext,parent){if(!this.isVisible(ctx))return null
const shapes=ctx.creatableShapes||Object.keys(ctx.availableShapes)
if(shapes.length==1)return null
const actions=shapes.map(shapeKey=>ctx.availableShapes[shapeKey].createAction)
this.currentCreateAction=actions[0]
return(new ActionActions).initialize({reg:REG.findReg(ctx),actionContext:{createTool:this,wallpaper:ctx},actionBtn:{action:actions[0]},actionsBtn:{actions:actions},uiContext:uiContext,lastAsDefault:true})}activate(ctx){const baseOnCancel=()=>{ctx.selectedArea.style.display=""
ctx.activateTool(ctx.firstAvailableTool)}
let onCancel=baseOnCancel
ctx.addToolListener({target:ctx.zoomBox,event:"pointerdown",handleEvent:function(ev){const shape=this.tool.currentCreateAction.shape
if("updateAreaFromRect"in shape){if(ev.button!=0)return
ctx.selectedArea.style.display="none"
onCancel=()=>{const{lstns:lstns}=this.tool._fromRectData
this.ctx.removeToolListeners(lstns)
this.tool._fromRectData=null
baseOnCancel()}
const area=this.ctx.toolsLayer.appendChild(shape.emptyArea())
this.tool._fromRectData={area:area,start:this.ctx.clientToCanvasPoint({x:ev.clientX,y:ev.clientY}),lstns:[]}
this.ctx.addToolListener({target:window,event:"pointermove",handleEvent:function(ev){const{area:area,start:start}=this.tool._fromRectData
const current=this.tool._fromRectData.current=this.ctx.clientToCanvasPoint({x:ev.clientX,y:ev.clientY})
shape.updateAreaFromRect(area,start,current)}},this.tool._fromRectData.lstns)
this.ctx.addToolListener({target:window,event:"pointerup",capture:true,handleEvent:function(){const{area:area,lstns:lstns,current:current}=this.tool._fromRectData
this.ctx.removeToolListeners(lstns)
onCancel=baseOnCancel
this.tool._fromRectData=null
if(!current)return
try{this.ctx.wedlet.wedMgr.freezeFocus=true
const selectedSegment=ctx.selectedSegment
selectedSegment.getSpatial().updateSpatial(this.ctx.wedlet.wedMgr.docHolder.newBatch(),shape.areaCoords(area),shape.shape).doBatch()}finally{this.ctx.wedlet.wedMgr.freezeFocus=false}this.ctx.selectedArea.style.display=""
this.ctx.activateTool(this.ctx.firstAvailableTool)}},this.tool._fromRectData.lstns)}else{ctx.selectedArea.style.display="none"
onCancel=()=>{const{lstns:lstns}=this.tool._fromPolyData
this.ctx.removeToolListeners(lstns)
this.tool._fromPolyData=null
baseOnCancel()}
if(ev.button==0){const canvasPoint=this.ctx.clientToCanvasPoint({x:ev.clientX,y:ev.clientY})
if(!this.tool._fromPolyData){const startSvgPoint=this.ctx.canvas.createSVGPoint()
startSvgPoint.x=canvasPoint.x
startSvgPoint.y=canvasPoint.y
this.tool._fromPolyData={polyline:this.ctx.toolsLayer.appendChild(JSX.asSvg(()=>JSX.createElement("polyline",{class:"area"}))),lastPoint:null,startHandler:appendHandler(ctx,canvasPoint),lstns:[]}
this.tool._fromPolyData.polyline.points.appendItem(startSvgPoint)}const lastPoint=this.tool._fromPolyData.lastPoint=this.ctx.canvas.createSVGPoint()
lastPoint.x=canvasPoint.x
lastPoint.y=canvasPoint.y
this.tool._fromPolyData.polyline.points.appendItem(lastPoint)
this.tool._addLastPointListeners(ctx,onCancel)}else if(ev.button==2&&this.tool._fromPolyData){const{polyline:polyline,lstns:lstns}=this.tool._fromPolyData
if(polyline.points.numberOfItems>2){const canvasPoint=this.ctx.clientToCanvasPoint({x:ev.clientX,y:ev.clientY})
polyline.points.removeItem(polyline.points.numberOfItems-1)
const lastPoint=this.tool._fromPolyData.lastPoint=polyline.points.getItem(polyline.points.numberOfItems-1)
lastPoint.x=canvasPoint.x
lastPoint.y=canvasPoint.y
this.tool._addLastPointListeners(ctx,onCancel)}}ctx.addToolListener({target:window,event:"keydown",capture:true,handleEvent:function(ev){if(ev.key=="Escape")onCancel()}},this.tool._fromPolyData.lstns)
ctx.addToolListener({target:window,event:"pointercancel",capture:true,handleEvent:onCancel},this.tool._fromPolyData.lstns)}}})
ctx.addToolListener({target:window,event:"keydown",capture:true,handleEvent:function(ev){if(ev.key=="Escape")onCancel()}})
ctx.addToolListener({target:window,event:"pointercancel",capture:true,handleEvent:onCancel})}_addLastPointListeners(ctx,onCancel){ctx.removeToolListeners(this._fromPolyData.lstns)
this._fromPolyData.lstns=[]
const shape=this.currentCreateAction.shape
ctx.addToolListener({target:window,event:"pointermove",handleEvent:function(ev){const{lastPoint:lastPoint}=this.tool._fromPolyData
const canvasPoint=this.ctx.clientToCanvasPoint({x:ev.clientX,y:ev.clientY})
lastPoint.x=canvasPoint.x
lastPoint.y=canvasPoint.y}},this._fromPolyData.lstns)
ctx.addToolListener({target:ctx.toolsLayer,event:"pointerdown",handleEvent:function(ev){const startHandler=this.tool._fromPolyData.startHandler
if(!startHandler||ev.target!==startHandler)return
ev.stopPropagation()
const{polyline:polyline,lstns:lstns}=this.tool._fromPolyData
if(polyline.points.numberOfItems<=3)return onCancel()
this.ctx.removeToolListeners(lstns)
this.tool._fromPolyData=null
polyline.points.removeItem(polyline.points.numberOfItems-1)
try{this.ctx.wedlet.wedMgr.freezeFocus=true
const selectedSegment=this.ctx.selectedSegment
selectedSegment.getSpatial().updateSpatial(this.ctx.wedlet.wedMgr.docHolder.newBatch(),shape.areaCoords(polyline),shape.shape).doBatch()}finally{this.ctx.wedlet.wedMgr.freezeFocus=false}this.ctx.selectedArea.style.display=""
this.ctx.activateTool(this.ctx.firstAvailableTool)}},this._fromPolyData.lstns)}deactivate(ctx){if(ctx.selectedArea)ctx.selectedArea.style.display=""}}class SpTeSpatialCreateAction extends Action{constructor(shape){super("create-"+shape.shape)
this.shape=shape}isToggle(){return true}getDatas(api,ctx){return ctx.wallpaper.currentTool===ctx.createTool&&ctx.createTool.currentCreateAction===this}isVisible(ctx){return!ctx.wallpaper.creatableShapes&&Object.keys(ctx.wallpaper.availableShapes).length>1||ctx.wallpaper.creatableShapes.length>1}isEnabled(ctx){return super.isEnabled(ctx)&&ctx.wallpaper.selectedSegment&&ctx.wallpaper.editMode===EWedletEditMode.write}execute(ctx,ev){ctx.createTool.currentCreateAction=this
ctx.wallpaper.activateTool(ctx.createTool)
return this}}REG.reg.addToList("actions:wed:spte:spatial:tools","handler",1,SpTeSpatialToolHandle,10)
REG.reg.addToList("actions:wed:spte:spatial:tools","create",1,SpTeSpatialToolCreate,20)
REG.reg.addToList("actions:wed:spte:spatial:tools","addNodes",1,SpTeSpatialToolAddNodes,30)
REG.reg.addToList("actions:wed:spte:spatial:tools","removeNodes",1,SpTeSpatialToolRemoveNodes,40)
REG.reg.addToList("actions:wed:spte:spatial:tools","zoom",1,SpTeSpatialToolZoomAndPan,100)
class SpTeShapeRect{constructor(rounded=false){this.rounded=rounded
this.shape=null
this.createAction=null
if(rounded){this.shape="roundedRect"
this.createAction=new SpTeSpatialCreateAction(this).setLabel("Rectangle arrrondi").setDescription("Création d\'un rectangle arrrondi").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/spte/spatial/roundedRect.svg")}else{this.shape="rect"
this.createAction=new SpTeSpatialCreateAction(this).setLabel("Rectangle").setDescription("Création d\'un rectangle").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/spte/spatial/rect.svg")}}tplArea(spShape,spCoords,spTeSegment,selected){const coords=spCoords?spCoords.split(",").map(coord=>parseFloat(coord)):null
return svg`<rect class="area" x="${(coords===null||coords===void 0?void 0:coords[0])||"0"}" y="${(coords===null||coords===void 0?void 0:coords[1])||"0"}" width="${((coords===null||coords===void 0?void 0:coords[2])||0)-((coords===null||coords===void 0?void 0:coords[0])||0)}" height="${((coords===null||coords===void 0?void 0:coords[3])||0)-((coords===null||coords===void 0?void 0:coords[1])||0)}" rx="${(coords===null||coords===void 0?void 0:coords[4])||0}" p.spTeSegment="${spTeSegment}" b.spte-selected="${selected}" spte-shape="${spShape}" tabindex="0"/>`}emptyArea(){return JSX.asSvg(()=>JSX.createElement("rect",{class:"area"}))}translateArea(area,x,y){area.x.baseVal.value+=x
area.y.baseVal.value+=y}areaNodes(area){const nodes=[{x:area.x.baseVal.value,y:area.y.baseVal.value},{x:area.x.baseVal.value+area.width.baseVal.value,y:area.y.baseVal.value+area.height.baseVal.value}]
if(this.rounded)nodes.push(new RoundedRectNode(area,area.y.baseVal.value+area.rx.baseVal.value))
return nodes}updateAreaFromRect(area,point1,point2){SVG.assignRectLengths(area,{x:Math.min(point1.x,point2.x),y:Math.min(point1.y,point2.y),width:point2.x>point1.x?point2.x-point1.x:point1.x-point2.x,height:point2.y>point1.y?point2.y-point1.y:point1.y-point2.y})}updateAreaFromNodes(area,nodes,nodeIndex){if(nodeIndex<2){const x=Math.min(nodes[0].x,nodes[1].x)
const y=Math.min(nodes[0].y,nodes[1].y)
const width=Math.max(nodes[0].x,nodes[1].x)-x
const height=Math.max(nodes[0].y,nodes[1].y)-y
SVG.assignRectLengths(area,{x:x,y:y,width:width,height:height})}else if(this.rounded){area.rx.baseVal.value=nodes[2].y-area.y.baseVal.value}}areaCoords(area){const coords=[area.x.baseVal.value,area.y.baseVal.value,area.x.baseVal.value+area.width.baseVal.value,area.y.baseVal.value+area.height.baseVal.value]
if(this.rounded)coords.push(area.rx.baseVal.value)
return coords.join(",")}}class SpTeShapeCircle{constructor(){this.shape="circle"
this.createAction=new SpTeSpatialCreateAction(this).setLabel("Cercle").setDescription("Création d\'un cercle").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/spte/spatial/circle.svg")}tplArea(spShape,spCoords,spTeSegment,selected){const coords=spCoords.split(",")
return svg`<circle class="area" cx="${(coords===null||coords===void 0?void 0:coords[0])||"0"}" cy="${(coords===null||coords===void 0?void 0:coords[1])||"0"}" r="${(coords===null||coords===void 0?void 0:coords[2])||"0"}" p.spTeSegment="${spTeSegment}" b.spte-selected="${selected}" spte-shape="${spShape}" tabindex="0"/>`}emptyArea(){return JSX.asSvg(()=>JSX.createElement("circle",{class:"area"}))}translateArea(area,x,y){area.cx.baseVal.value+=x
area.cy.baseVal.value+=y}updateAreaFromNodes(area,nodes,nodeIndex){area.r.baseVal.value=Math.abs(nodes[0].x-area.cx.baseVal.value)}updateAreaFromRect(area,point1,point2){area.cx.baseVal.value=point1.x
area.cy.baseVal.value=point1.y
area.r.baseVal.value=Math.abs(point2.x-point1.x)}areaNodes(area){return[{x:area.cx.baseVal.value+area.r.baseVal.value,y:area.cy.baseVal.value}]}areaCoords(area){return[area.cx.baseVal.value,area.cy.baseVal.value,area.r.baseVal.value].join(",")}}class SpTeShapeEllipse{constructor(){this.shape="ellipse"
this.createAction=new SpTeSpatialCreateAction(this).setLabel("Ellipse").setDescription("Création d\'une ellipse").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/spte/spatial/ellipse.svg")}tplArea(spShape,spCoords,spTeSegment,selected){const coords=spCoords.split(",")
return svg`<ellipse class="area" cx="${(coords===null||coords===void 0?void 0:coords[0])||"0"}" cy="${(coords===null||coords===void 0?void 0:coords[1])||"0"}" rx="${(coords===null||coords===void 0?void 0:coords[2])||"0"}" ry="${(coords===null||coords===void 0?void 0:coords[3])||"0"}" p.spTeSegment="${spTeSegment}" b.spte-selected="${selected}" spte-shape="${spShape}" tabindex="0"/>`}emptyArea(){return JSX.asSvg(()=>JSX.createElement("ellipse",{class:"area"}))}translateArea(area,x,y){area.cx.baseVal.value+=x
area.cy.baseVal.value+=y}updateAreaFromNodes(area,nodes,nodeIndex){if(nodeIndex==0)area.rx.baseVal.value=Math.abs(nodes[0].x-area.cx.baseVal.value)
else area.ry.baseVal.value=Math.abs(nodes[1].y-area.cy.baseVal.value)}updateAreaFromRect(area,point1,point2){area.cx.baseVal.value=point1.x
area.cy.baseVal.value=point1.y
area.rx.baseVal.value=Math.abs(point2.x-point1.x)
area.ry.baseVal.value=Math.abs(point2.y-point1.y)}areaNodes(area){return[{x:area.cx.baseVal.value+area.rx.baseVal.value,y:area.cy.baseVal.value},{x:area.cx.baseVal.value,y:area.cy.baseVal.value+area.ry.baseVal.value}]}areaCoords(area){return[area.cx.baseVal.value,area.cy.baseVal.value,area.rx.baseVal.value,area.ry.baseVal.value].join(",")}}class SpTeShapePolygon{constructor(){this.shape="poly"
this.createAction=new SpTeSpatialCreateAction(this).setLabel("Polygone").setDescription("Création d\'un polygone").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/spte/spatial/poly.svg")}tplArea(spShape,spCoords,spTeSegment,selected){const coords=spCoords.split(",")
let points=""
if(coords&&coords.length>1){for(let i=0;i<coords.length;i+=2){points+=`${coords[i]},${coords[i+1]} `}}else{points="0,0"}return svg`<polygon class="area" points="${points}" p.spTeSegment="${spTeSegment}" b.spte-selected="${selected}" spte-shape="${spShape}" tabindex="0"/>`}emptyArea(){return JSX.asSvg(()=>JSX.createElement("polygon",{class:"area"}))}translateArea(area,x,y){for(let i=0;i<area.points.numberOfItems;i++){const point=area.points.getItem(i)
point.x+=x
point.y+=y}}areaCoords(area){const coords=[]
for(let i=0;i<area.points.numberOfItems;i++){const point=area.points.getItem(i)
coords.push(point.x,point.y)}return coords.join(",")}areaNodes(area){return area.points}}REG.reg.addToList("wed:spTeSpatial:shapes","rect",1,new SpTeShapeRect,0)
REG.reg.addToList("wed:spTeSpatial:shapes","roundedRect",1,new SpTeShapeRect(true),10)
REG.reg.addToList("wed:spTeSpatial:shapes","circle",1,new SpTeShapeCircle,20)
REG.reg.addToList("wed:spTeSpatial:shapes","ellipse",1,new SpTeShapeEllipse,30)
REG.reg.addToList("wed:spTeSpatial:shapes","poly",1,new SpTeShapePolygon,40)
class RoundedRectNode{constructor(_rect,y){this._rect=_rect
this.shape="diamond"
this.y=y}get x(){return this._rect.x.baseVal.value+this._rect.width.baseVal.value}set x(val){}get y(){return this._y}set y(val){const rectY=this._rect.y.baseVal.value
const minMaxR=Math.min(this._rect.width.baseVal.value/2,this._rect.height.baseVal.value/2)
this._y=Math.max(rectY,Math.min(rectY+minMaxR,val))}}function appendHandler(ctx,node){let handler
if(node.shape=="diamond"){const halfWidth=Math.sqrt(SPATIAL_HANDLERS_WIDTH*2)/ctx.zoomLevel
handler=document.createElementNS(DOM.SVG_NS,"rect")
SVG.assignRectLengths(handler,{x:node.x-halfWidth,y:node.y-halfWidth,width:halfWidth*2,height:halfWidth*2})
const transform=ctx.canvas.createSVGTransform()
transform.setRotate(45,node.x,node.y)
handler.transform.baseVal.initialize(transform)}else{handler=document.createElementNS(DOM.SVG_NS,"circle")
handler.r.baseVal.value=SPATIAL_HANDLERS_WIDTH/ctx.zoomLevel/2
handler.cx.baseVal.value=node.x
handler.cy.baseVal.value=node.y}handler.classList.add("handler")
handler.node=node
ctx.toolsLayer.appendChild(handler)
handler.style.strokeWidth=parseFloat(getComputedStyle(handler).strokeWidth)/ctx.zoomLevel+"px"
return handler}
//# sourceMappingURL=spteWallpaper.js.map