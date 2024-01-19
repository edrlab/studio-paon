import{EventsMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
export class Resizer extends BaseElement{get listeners(){return this._listeners||(this._listeners=new EventsMgr)}get findUpTo(){return parseInt(this.getAttribute("find-upto"),10)||0}set findUpTo(levels){this.setAttribute("find-upto",levels.toString())}get disabled(){return this.hasAttribute("disabled")}set disabled(v){DOM.setAttrBool(this,"disabled",v)}_initialize(init){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
sr.appendChild(document.createElement("slot"))
this.onpointerdown=this.onPointerDown}onPointerDown(ev){if(this.disabled)return
ev.stopImmediatePropagation()
ev.preventDefault()
let parent=DOMSH.getParentElt(this)
let parentStyles=window.getComputedStyle(parent)
while(parentStyles.display!=="flex"){parent=DOMSH.getParentElt(parent)
if(!parent)return
parentStyles=window.getComputedStyle(parent)}this._horizontal=parentStyles.flexDirection.startsWith("row")
if(this._listeners)this._listeners.emit("resizeStart")
this._prevResizables=[]
this._nextResizables=[]
let findUpTo=this.findUpTo
let from=this
const isRtl=window.getComputedStyle(this).direction==="rtl"
while(findUpTo>=0){let prevs
let nexts
if(parentStyles.flexDirection.endsWith("reverse")){prevs=isRtl&&this._horizontal?this._prevResizables:this._nextResizables
nexts=isRtl&&this._horizontal?this._nextResizables:this._prevResizables}else{prevs=isRtl&&this._horizontal?this._nextResizables:this._prevResizables
nexts=isRtl&&this._horizontal?this._prevResizables:this._nextResizables}for(let prev=DOMSH.findFlatPrevSibling(from,isResizable);prev;prev=DOMSH.findFlatPrevSibling(prev,isResizable)){prevs.push((this._horizontal?new ResizeNodeH(prev):new ResizeNodeV(prev)).initOriginalSizes())}for(let next=DOMSH.findFlatNextSibling(from,isResizable);next;next=DOMSH.findFlatNextSibling(next,isResizable)){nexts.push((this._horizontal?new ResizeNodeH(next):new ResizeNodeV(next)).initOriginalSizes())}do{from=parent
parent=DOMSH.getParentElt(from)
parentStyles=window.getComputedStyle(parent)
findUpTo--}while(parent&&findUpTo>=0&&!parentStyles.flexDirection.startsWith(this._horizontal?"row":"column"))}for(const prev of this._prevResizables)prev.initWriteMinSize()
for(const next of this._nextResizables)next.initWriteMinSize()
for(const prev of this._prevResizables)prev.initReadMinSize()
for(const next of this._nextResizables)next.initReadMinSize()
for(const prev of this._prevResizables)prev.initRevertToOriginal()
for(const next of this._nextResizables)next.initRevertToOriginal()
this._startOffset=this._horizontal?ev.clientX:ev.clientY
if(!this._onDrag)this._onDrag=this.onDrag.bind(this)
if(!this._onDragend)this._onDragend=this.onDragend.bind(this)
document.documentElement.addEventListener("pointermove",this._onDrag,true)
document.documentElement.addEventListener("pointerup",this._onDragend,true)
if(this._listeners)this._listeners.emit("resizing")}onDrag(ev){if(ev.buttons===0){this.onDragend(ev)
return}if(!this._prevResizables)return
ev.preventDefault()
ev.stopImmediatePropagation()
const offset=this._horizontal?ev.clientX:ev.clientY
if(offset===0)return
let delta=offset-this._startOffset
if(delta<0){for(const resize of this._prevResizables)delta=resize.tryResize(delta)
delta=this._startOffset-offset+delta
for(const resize of this._nextResizables)delta=resize.tryResize(delta)
if(delta!==0){delta=offset-this._startOffset+delta
for(const resize of this._prevResizables)delta=resize.tryResize(delta)}}else{delta=-delta
for(const resize of this._nextResizables)delta=resize.tryResize(delta)
delta=offset-this._startOffset+delta
for(const resize of this._prevResizables)delta=resize.tryResize(delta)
if(delta!==0){delta=this._startOffset-offset+delta
for(const resize of this._nextResizables)delta=resize.tryResize(delta)}}this.classList.add("resizing")
if(this._listeners)this._listeners.emit("resizing")}onDragend(ev){document.documentElement.removeEventListener("pointermove",this._onDrag,true)
document.documentElement.removeEventListener("pointerup",this._onDragend,true)
if(!this._prevResizables)return
ev.preventDefault()
ev.stopImmediatePropagation()
this._prevResizables=null
this._nextResizables=null
this.classList.remove("resizing")
if(this._listeners)this._listeners.emit("resizeEnd")}}class ResizeNodeH{constructor(elt){this.elt=elt}initOriginalSizes(){this.originalSize=this.elt.offsetWidth
this.originalFlex=window.getComputedStyle(this.elt).flex
return this}initWriteMinSize(){this.elt.style.flex="0 0 0"}initReadMinSize(){this.minSize=this.elt.offsetWidth}initWriteMaxSize(){this.elt.style.flex="0 0 10000px"}initReadMaxSize(){this.maxSize=this.elt.offsetWidth}initRevertToOriginal(){this.elt.style.flex=this.originalFlex||"1 1 auto"
this.elt.style.flexBasis=this.originalSize+"px"}tryResize(delta){const newSize=this.originalSize+delta
if(newSize<this.minSize){DOM.setStyle(this.elt,"flex-basis",this.minSize+"px")
return newSize-this.minSize}if(newSize>this.maxSize){DOM.setStyle(this.elt,"flex-basis",this.maxSize+"px")
return newSize-this.maxSize}DOM.setStyle(this.elt,"flex-basis",newSize+"px")
return 0}}class ResizeNodeV extends ResizeNodeH{initOriginalSizes(){this.originalSize=this.elt.offsetHeight
this.originalFlex=window.getComputedStyle(this.elt).flex
return this}initReadMinSize(){this.minSize=this.elt.offsetHeight}initReadMaxSize(){this.maxSize=this.elt.offsetHeight}}function isResizable(n){return n instanceof HTMLElement&&n.hasAttribute("c-resizable")&&!n.hidden}REG.reg.registerSkin("c-resizer",1,`\n\t:host {\n\t\tflex: none;\n\t\tdisplay: flex;\n\t\tmargin: -2px;\n\t\tpadding: 2px;\n\t\tz-index: 1;\n\t\tbackground: var(--resizer-bgcolor, var(--border-color));\n\t\tbackground-clip: content-box;\n\t\ttouch-action: none;\n\t}\n\n\t:host([c-orient="row"]) {\n\t\tmargin-top: 0 !important;\n\t\tmargin-bottom: 0 !important;\n\t\tpadding-top: 0 !important;\n\t\tpadding-bottom: 0 !important;\n\t\tflex-direction: row;\n\t}\n\n\t:host([c-orient="row"]:not([disabled])) {\n\t\tcursor: e-resize;\n\t}\n\n\t:host([c-orient="column"]) {\n\t\tmargin-inline-start: 0 !important;\n\t\tmargin-inline-end: 0 !important;\n\t\tpadding-inline-start: 0 !important;\n\t\tpadding-inline-end: 0 !important;\n\t\tflex-direction: column;\n\t}\n\n\t:host([c-orient="column"]:not([disabled])) {\n\t\tcursor: n-resize;\n\t}\n\n\t:host(:hover:not([disabled])) {\n\t\tbackground-clip: border-box;\n\t\tbackground-color: var(--resizer-hover-bgcolor, #204b8877);\n\t}\n\n\t:host(.resizing) {\n\t\tbackground-clip: content-box !important;\n\t\tmargin: -100px;\n\t\tpadding: 100px;\n\t}\n\n\t/* évite l'affichage de scrollbars si resizers au bord (margin négatif) */\n\t:host([disabled]) {\n\t\tmargin: 0;\n\t\tpadding: 0;\n\t}\n`)
customElements.define("c-resizer",Resizer)
export class Collapser extends BaseElement{get panelPos(){return this.getAttribute("panel-pos")}get orient(){return this.getAttribute("c-orient")}get panel(){var _a,_b
switch(this.panelPos){case"prev":return(_a=this.parentElement)===null||_a===void 0?void 0:_a.previousElementSibling
case"next":return(_b=this.parentElement)===null||_b===void 0?void 0:_b.nextElementSibling}return null}get closed(){var _a
return((_a=this.panel)===null||_a===void 0?void 0:_a.hasAttribute("hidden"))||false}_initialize(init){this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.onclick=this.onClick}show(){const panel=this.panel
if(panel&&DOM.setHidden(panel,false)){if(this.parentElement instanceof Resizer)this.parentElement.disabled=false
this.refresh()}}hide(){const panel=this.panel
if(panel&&DOM.setHidden(panel,true)){if(this.parentElement instanceof Resizer)this.parentElement.disabled=true
this.refresh()}}onClick(){const panel=this.panel
if(panel){if(panel.hasAttribute("hidden"))this.show()
else this.hide()}}_refresh(){const styles=window.getComputedStyle(this)
const reverse=styles.flexDirection.endsWith("-reverse")
if(this.orient==="row"){const left=styles.direction==="ltr"===(this.panelPos==="prev")
this.setAttribute("c-state",(left!==reverse?"left":"right")+(this.closed?"Closed":"Opened"))}else{const top=this.panelPos==="prev"
this.setAttribute("c-state",(top!==reverse?"top":"bottom")+(this.closed?"Closed":"Opened"))}}}REG.reg.registerSkin("c-collapser",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tcursor: pointer;\n\t\tbackground-size: 6px;\n\t\tbackground-position: center;\n\t}\n\n\t:host([c-orient="row"]) {\n\t\tbackground-repeat: repeat-y;\n\t\theight: 35px;\n\t\talign-self: center;\n\t}\n\n\t:host([c-orient="column"]) {\n\t\tbackground-repeat: repeat-x;\n\t\theight: 35px;\n\t\tjustify-self: center;\n\t}\n\n\t:host(:hover) {\n\t\tbackground-color: var(--pressed-bgcolor);\n\t\toutline: 1px dotted var(--border-color);\n\t}\n\n\t:host([c-state=leftOpened]) {\n\t\tbackground-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 6" fill="%23b89a62"><path d="M 3,0 1.13,3 3,6 0,3 Z"/></svg>');\n\t}\n\n\t:host([c-state=leftClosed]) {\n\t\tbackground-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 6" fill="%23b89a62"><path d="M 0,0 1.87,3 0,6 3,3 Z"/></svg>');\n\t}\n\n\t:host([c-state=righttOpened]) {\n\t\tbackground-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 6" fill="%23b89a62"><path d="M 0,0 1.87,3 0,6 3,3 Z"/></svg>');\n\t}\n\n\t:host([c-state=rightClosed]) {\n\t\tbackground-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 6" fill="%23b89a62"><path d="M 3,0 1.13,3 3,6 0,3 Z"/></svg>');\n\t}\n\n\t:host([c-state=topOpened]) {\n\t\tbackground-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 3" fill="%23b89a62"><path d="M 0,3 3,1.13 6,3 3,0 Z"/></svg>');\n\t}\n\n\t:host([c-state=topClosed]) {\n\t\tbackground-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 3" fill="%23b89a62"><path d="M 0,0 3,1.87 6,0 3,3 Z"/></svg>');\n\t}\n\n\t:host([c-state=bottomOpened]) {\n\t\tbackground-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 3" fill="%23b89a62"><path d="M 0,0 3,1.87 6,0 3,3 Z"/></svg>');\n\t}\n\n\t:host([c-state=bottomClosed]) {\n\t\tbackground-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 3" fill="%23b89a62"><path d="M 0,3 3,1.13 6,3 3,0 Z"/></svg>');\n\t}\n`)
customElements.define("c-collapser",Collapser)

//# sourceMappingURL=resizer.js.map