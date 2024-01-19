import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
export class ArrowScrollBox extends BaseElement{get vertical(){return this.hasAttribute("vertical")}set vertical(val){if(DOM.setAttrBool(this,"vertical",val))this.refresh()}scrollToChild(child){setTimeout(()=>{if(this.vertical){this._content.scrollTop=child.offsetTop}else{const ctnLeft=this._content.scrollLeft
const tabLeft=child.offsetLeft
if(tabLeft<ctnLeft){this._content.scrollLeft=tabLeft}else{const newLeft=tabLeft+child.offsetWidth-this._content.clientWidth
if(newLeft>ctnLeft)this._content.scrollLeft=newLeft}}},1)}moveForward(){if(this.vertical){this._content.scrollTop+=this._content.clientHeight/this.children.length}else{if(window.getComputedStyle(this).direction==="rtl")this._content.scrollLeft-=this._content.clientWidth/this.children.length
else this._content.scrollLeft+=this._content.clientWidth/this.children.length}}moveBackward(){if(this.vertical){this._content.scrollTop-=this._content.clientHeight/this.children.length}else{if(window.getComputedStyle(this).direction==="rtl")this._content.scrollLeft+=this._content.clientWidth/this.children.length
else this._content.scrollLeft-=this._content.clientWidth/this.children.length}}get isOverflow(){return this.vertical?this._content.scrollHeight>this._content.clientHeight:this._content.scrollWidth>this._content.clientWidth}_initialize(init){this.vertical=init.vertical
this.cbOverflow=init.cbOverflow
this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this._start=JSX.createElement("div",{id:"start"})
this._end=JSX.createElement("div",{id:"end"})
this._content=this.shadowRoot.appendChild(JSX.createElement("div",{id:"content"},this._start,JSX.createElement("slot",null),this._end))
this._startBtn=JSX.createElement(Button,{id:"startBtn","ui-context":"custom",hidden:"","aria-hidden":"true"})
this._startBtn.tabIndexCustom=-1
this._startBtn.icon="--scroll-startbtn-icon"
this._startBtn.onclick=()=>{this.moveBackward()}
this._endBtn=JSX.createElement(Button,{id:"endBtn","ui-context":"custom",hidden:"","aria-hidden":"true"})
this._endBtn.tabIndexCustom=-1
this._endBtn.icon="--scroll-endbtn-icon"
this._endBtn.onclick=()=>{this.moveForward()}
this.shadowRoot.appendChild(this._startBtn)
this.shadowRoot.appendChild(this._endBtn)
const intersectObserver=new IntersectionObserver(this.refresh.bind(this),{root:this._content,threshold:[0,1]})
intersectObserver.observe(this._start)
intersectObserver.observe(this._end)
let scrollTimeout
this._content.addEventListener("scroll",()=>{if(scrollTimeout)clearTimeout(scrollTimeout)
scrollTimeout=window.setTimeout(()=>{requestAnimationFrame(()=>{this._refreshStates()
scrollTimeout=null})},100)},{passive:true})}_refresh(){const overflow=this.isOverflow
if(overflow){if(DOM.addClass(this,"scroll")){this._startBtn.hidden=false
this._endBtn.hidden=false}this._refreshStates()
if(this.cbOverflow)this.cbOverflow(true)}else{if(DOM.removeClass(this,"scroll")){this._startBtn.hidden=true
this._endBtn.hidden=true
if(this.cbOverflow)this.cbOverflow(false)}}}_refreshStates(){if(this.vertical){this._startBtn.disabled=this._content.scrollTop===0
this._endBtn.disabled=this._content.scrollTop+this._content.clientHeight>=this._content.scrollHeight}else{this._startBtn.disabled=this._content.scrollLeft===0
this._endBtn.disabled=this._content.scrollLeft+this._content.clientWidth>=this._content.scrollWidth}}}REG.reg.registerSkin("c-arrow-scroll-box",1,`\n\t:host {\n\t\tposition: relative;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\t:host([vertical]) {\n\t\tflex-direction: column;\n\t}\n\n\t#content {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex: 1;\n\t\tposition: relative;\n\t\toverflow: hidden;\n\t\tscroll-behavior: smooth;\n\t\tflex-direction: inherit;\n\t\tjustify-content: inherit;\n\t}\n\n\t:host(:not([vertical]).scroll) {\n\t\tpadding-inline-start: var(--icon-size);\n\t\tpadding-inline-end: var(--icon-size);\n\t\t--scroll-startbtn-icon: var(--scroll-hstartbtn-icon, url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/scrollArrowLeft.svg'));\n\t\t--scroll-endbtn-icon: var(--scroll-hendbtn-icon, url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/scrollArrowRight.svg'));\n\t}\n\n\t:host([vertical].scroll) {\n\t\tpadding-top: var(--icon-size);\n\t\tpadding-bottom: var(--icon-size);\n\t\t--scroll-startbtn-icon: var(--scroll-vstartbtn-icon, url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/scrollArrowTop.svg'));\n\t\t--scroll-endbtn-icon: var(--scroll-vendbtn-icon, url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/scrollArrowBottom.svg'));\n\t}\n\n\t#startBtn {\n\t\tposition: absolute;\n\t\tbox-sizing: border-box;\n\t\tborder: none;\n\t}\n\n\t:host(:not([vertical])) > #startBtn {\n\t\tborder-inline-end: solid 1px var(--border-color);\n\t\ttop: 0;\n\t\tbottom: 0;\n\t\tleft: 0;\n\t\twidth: var(--icon-size);\n\t}\n\n\t:host([vertical]) > #startBtn {\n\t\tborder-bottom: solid 1px var(--border-color);\n\t\ttop: 0;\n\t\tleft: 0;\n\t\tright: 0;\n\t\theight: var(--icon-size);\n\t}\n\n\t#startBtn[disabled] {\n\t\tborder-color: transparent;\n\t}\n\n\t#endBtn {\n\t\tposition: absolute;\n\t\tbox-sizing: border-box;\n\t\tborder: none;\n\t}\n\n\t:host(:not([vertical])) > #endBtn {\n\t\tborder-inline-start: solid 1px var(--border-color);\n\t\tright: 0;\n\t\ttop: 0;\n\t\tbottom: 0;\n\t\twidth: var(--icon-size);\n\t}\n\n\t:host([vertical]) > #endBtn {\n\t\tborder-top: solid 1px var(--border-color);\n\t\tbottom: 0;\n\t\tleft: 0;\n\t\tright: 0;\n\t\theight: var(--icon-size);\n\t}\n\n\t#endBtn[disabled] {\n\t\tborder-color: transparent;\n\t}\n`)
customElements.define("c-arrow-scroll-box",ArrowScrollBox)
export class OrientedBox extends BaseElement{get vertical(){return this.hasAttribute("vertical")}set vertical(val){DOM.setAttrBool(this,"vertical",val)}scrollToChild(child){}get isOverflow(){return false}_initialize(init){this.vertical=init.vertical
this._attach(this.localName,init,JSX.createElement("slot",null))}}REG.reg.registerSkin("c-oriented-box",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\t:host([vertical]) {\n\t\tflex-direction: column;\n\t}\n`)
customElements.define("c-oriented-box",OrientedBox)

//# sourceMappingURL=scroll.js.map