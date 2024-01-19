import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
import{ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
export function isEltRefreshable(elt){return elt&&"refreshFreeze"in elt}export class BaseElement extends HTMLElement{constructor(){super(...arguments)
this._refreshFreeze=1}static refreshFreezeAll(elt,delta){elt.refreshFreeze(delta)
for(let ch=DOM.findFirstChild(elt,isEltRefreshable);ch;ch=DOM.findNextSibling(ch,isEltRefreshable)){BaseElement.refreshFreezeAll(ch,delta)}}get initialized(){return this._initialize===null}initialize(init){if(this._initialize!==null){this._initialize(init==null?this.buildInitFromAtts():init)
this._initialize=null
this._refreshFreeze--}else if(init){console.warn("Widget already initialized",this,init)}return this}refresh(){if(this._shouldRefresh())this._refresh()}refreshFreeze(delta){this._refreshFreeze+=delta}connectedCallback(){this.initialize()
if(this._refreshFreeze===0)this._refresh()}_shouldRefresh(){return this._refreshFreeze===0&&this.isConnected}_refresh(){}_initialize(init){}buildInitFromAtts(init){if(!init)init={}
if(this.hasAttribute("skin"))init.skin=BASIS.extractAttr(this,"skin")
if(this.hasAttribute("skinOver"))init.skinOver=BASIS.extractAttr(this,"skinOver")
return init}_initAndInstallSkin(defaultSkin,init){const skin=(init===null||init===void 0?void 0:init.skin)||defaultSkin
const skinOver=init===null||init===void 0?void 0:init.skinOver
if(skin||skinOver){const reg=this.findReg(init)
if(skin)reg.installSkin(skin,this.shadowRoot)
if(skinOver){for(const sk of skinOver.split(" "))reg.installSkin(sk,this.shadowRoot)}}}_attach(defaultSkin,init,...children){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(defaultSkin,init)
DOM.append(sr,...children)
return sr}findReg(init){return REG.findReg(this,init)}}export class BaseElementAsync extends BaseElement{constructor(){super(...arguments)
this.initStatus="unInited"
this.initializedAsync=new Promise((resolve,reject)=>{this._initResolved=resolve
this._initRejected=reject})}get initialized(){return this.initStatus==="inited"}initialize(init=this.buildInitFromAtts()){if(this.initStatus==="unInited"){this.initStatus="pending"
this._initialize(init).then(()=>{this.initStatus="inited"
this._refreshFreeze--
const cb=this._initResolved
this._initResolved=null
this._initRejected=null
cb(this)},e=>{this.initStatus="initFailed"
const cb=this._initRejected
this._initResolved=null
this._initRejected=null
cb(e)
throw e})}return this}connectedCallback(){this.initialize()
this.initializedAsync.then(()=>{if(this._refreshFreeze===0)this._refresh()})}reinitializeStarted(promise){this.initStatus="pending"
this.initializedAsync=promise.then(()=>{this.initStatus="inited"
return this},e=>{this.initStatus="initFailed"
throw e})}_initialize(init){throw Error("not implemented")}}export function isEltInitableAsync(elt){return elt&&elt.initializedAsync}export function isEltInitableAsyncPending(elt){return elt&&elt.initializedAsync&&(elt.initStatus==="unInited"||elt.initStatus==="pending")}REG.reg.registerSkin("basis",1,`\n\t:root {\n\t\tfont-family: var(--font-default);\n\t\tfont-size: 10pt;\n\t\tword-break: break-word;\n\t\tbackground-color: var(--bgcolor);\n\t\tcolor: var(--color);\n\t\taccent-color: var(--selection-bgcolor);\n\t}\n\t\n\t:root::selection {\n\t\tcolor: var(--selection-color);\n\t\tbackground: var(--selection-bgcolor);\n\t}\n`)
export class Box extends BaseElement{_initialize(init){if(!this.shadowRoot)this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)}}customElements.define("c-box",Box)
export class Label extends BaseElement{get icon(){return this._icon}set icon(value){if(this._icon!=value){this._icon=value
this.refresh()}}get label(){return this._label}set label(val){if(this._label!=val){this._label=val
this.refresh()}}get hidden(){return this.hasAttribute("hidden")}set hidden(val){if(DOM.setHidden(this,val))this.refresh()}_initialize(init){if("icon"in init)this._icon=init.icon
if("label"in init)this._label=init.label
if("title"in init)this.title=init.title
if("hidden"in init)this.hidden=init.hidden
if("ellipsis"in init)DOM.setAttrBool(this,"ellipsis",init.ellipsis)
if(!init.noShadow){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initSkin(init)
sr.appendChild(document.createElement("slot"))}}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
if(this.hasAttribute("label"))init.label=BASIS.extractAttr(this,"label")
if(this.hasAttribute("icon"))init.icon=BASIS.extractAttr(this,"icon")
return init}_initSkin(init){this._initAndInstallSkin(this.localName,init)}_refresh(){if(this.hidden)return
const icon=this.icon
if(icon){if(!this._iconElt)this._createIcon()
if(this._lastUrlIcon!==icon){this._lastUrlIcon=icon
this.style.setProperty("--icon-img",icon.startsWith("--")?`var(${icon})`:`url("${icon}")`)}DOM.setHidden(this._iconElt,false)}else{if(this._iconElt)DOM.setHidden(this._iconElt,true)}const label=this.label
if(label!=null){if(!this._labelElt)this._createLabel()
DOM.setTextContent(this._labelElt,label)
DOM.setHidden(this._labelElt,false)}else{if(this._labelElt)DOM.setHidden(this._labelElt,true)}}_createIcon(){this._iconElt=(this.shadowRoot||this).insertBefore(JSX.createElement("span",{class:"icon"}),this._labelElt)}_createLabel(){this._labelElt=(this.shadowRoot||this).insertBefore(JSX.createElement("span",{class:"label"}),this._iconElt?this._iconElt.nextSibling:null)}connectedCallback(){super.connectedCallback()
if(this.hasAttribute("ellipsis")&&!this.title)BASIS.titleOnEllipsisObserver.observe(this)}disconnectedCallback(){if(this.hasAttribute("ellipsis"))BASIS.titleOnEllipsisObserver.unobserve(this)}}customElements.define("c-label",Label)
REG.reg.registerSkin("c-label",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tjustify-content: center;\n\t}\n\n\t:host([ellipsis]) {\n\t\toverflow: hidden;\n\t\twhite-space: nowrap;\n\t\ttext-overflow: ellipsis;\n\t}\n\n\t.icon {\n\t\theight: var(--icon-size);\n\t\twidth: var(--icon-size);\n\t\tmin-height: var(--icon-size);\n\t\tmin-width: var(--icon-size);\n\t\tbackground: var(--icon-color) var(--icon-img) no-repeat center / contain;\n\t\tfilter: var(--filter);\n\t\t/*mask: var(--icon-img) no-repeat center / contain;*/\n\t\t/*-webkit-mask: var(--icon-img) no-repeat center / contain;*/\n\t\t/*background-blend-mode: multiply;*/\n\t}\n\n\t.icon:not([hidden]) + .label {\n\t\t-webkit-margin-start: 0.3em;\n\t\tmargin-inline-start: 0.3em;\n\t}\n\n\t:host(.vertical) {\n\t\tflex-direction: column;\n\t\talign-items: center;\n\t}\n\n\t:host(.vertical) > .icon {\n\t\theight: calc(var(--icon-size) * 1.5);\n\t\twidth: calc(var(--icon-size) * 1.5);\n\t}\n`)
export class FileSystemPath extends Label{_initialize(init){super._initialize(init)
const reg=this.findReg(init)
this.openBtn="openBtn"in init?init.openBtn:false
this.revealBtn="revealBtn"in init?init.revealBtn:true
this.type=init.type||"dir"
this.addEventListener("click",event=>{if(this._labelElt)window.getSelection().selectAllChildren(this._labelElt)})}_initSkin(init){const reg=this.findReg(init)
reg.installSkin("c-label",this.shadowRoot)
super._initSkin(init)}get textContent(){return this._labelElt.textContent}get openBtn(){return this.hasAttribute("openBtn")}set openBtn(md){DOM.setAttrBool(this,"openBtn",md)}get revealBtn(){return this.hasAttribute("revealBtn")}set revealBtn(md){DOM.setAttrBool(this,"revealBtn",md)}get type(){return this.getAttribute("type")}set type(lv){if(lv)this.setAttribute("type",lv)
else this.removeAttribute("type")}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
if(this.hasAttribute("openBtn"))init.openBtn=true
if(this.hasAttribute("revealBtn"))init.revealBtn=true
if(this.hasAttribute("type"))init.type=BASIS.extractAttr(this,"type")
return init}_refresh(){super._refresh()
const parentElt=this.shadowRoot||this
if(Desk.electron&&this.openBtn&&!this._openBtnElt)this._openBtnElt=parentElt.insertBefore(JSX.createElement("c-button",{class:"openBtn","î":{title:"Ouvrir...",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/open.svg",role:"spinbutton"},onclick:this.doOpen}),DOM.findLastChild(parentElt))
if(Desk.electron&&this.revealBtn&&!this._revealBtnElt)this._revealBtnElt=parentElt.insertBefore(JSX.createElement("c-button",{class:"revealBtn","î":{title:"Révéler...",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/reveal.svg",role:"spinbutton"},onclick:this.doReveal}),DOM.findLastChild(parentElt))}doReveal(ev){window.postMessage({type:"client:modules:localServer:reveal",path:DOMSH.findHost(this).textContent},location.origin)
ev.stopPropagation()}doOpen(ev){window.postMessage({type:"client:modules:localServer:open",path:DOMSH.findHost(this).textContent},location.origin)
ev.stopPropagation()}setPath(msg,type,openBtn,revealBtn,icon){if(msg==null){this.hidden=true}else{try{this.refreshFreeze(1)
this.label=msg
if(icon!==null)this.icon=icon
if(type!==null)this.type=type
if(openBtn!==null)this.openBtn=openBtn
if(revealBtn!==null)this.revealBtn=revealBtn
if(this._openBtnElt)this._openBtnElt.disabled=msg===""
if(this._revealBtnElt)this._openBtnElt.disabled=msg===""
this.hidden=false}finally{this.refreshFreeze(-1)
this.refresh()}}return this}}REG.reg.registerSkin("c-filesystem-path",1,`\n\t:host {\n\t\tjustify-content: left;\n\t\talign-items: center;\n\t}\n\n\t:host([hidden]) {\n\t\tdisplay: none;\n\t}\n\n\t:host(:not([type=file])) .openBtn {\n\t\tdisplay: none;\n\t}\n\n\t:host(.small) {\n\t\tfont-size: .8em;\n\t\tcolor: var(--info-color);\n\t}\n\n\t.openBtn, .revealBtn {\n\t\tdisplay: inline-flex;\n\t\tunicode-bidi: isolate;\n\t}\n\n`)
customElements.define("c-filesystem-path",FileSystemPath)
export class MsgLabel extends Label{_initialize(init){if(init.level)this.level=init.level
if(init.standardMsg)this.setStandardMsg(init.standardMsg)
super._initialize(init)}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
if(this.hasAttribute("standard-msg"))init.standardMsg=BASIS.extractAttr(this,"standard-msg")
return init}get level(){return this.getAttribute("level")}set level(lv){if(lv)this.setAttribute("level",lv)
else this.removeAttribute("level")}setStandardMsg(msg){if(!msg){this.hidden=true}else{this.hidden=false
this.className=msg
switch(msg){case"loading":DOM.setAttr(this,"level","info")
this.label="Chargement en cours..."
break
case"saving":DOM.setAttr(this,"level","info")
this.label="Enregistrement en cours..."
break
case"deleting":DOM.setAttr(this,"level","info")
this.label="Suppression en cours..."
break
case"needAuth":DOM.setAttr(this,"level","info")
this.label="Connexion nécessaire"
break
case"accessDenied":DOM.setAttr(this,"level","error")
this.label="Autorisation refusée"
break
case"netError":DOM.setAttr(this,"level","error")
this.label="Accès au serveur impossible"
break}}return this}setCustomMsg(msg,level,icon){if(msg==null){this.hidden=true}else{try{this.refreshFreeze(1)
this.label=msg
this.icon=icon
this.level=level
this.hidden=false}finally{this.refreshFreeze(-1)
this.refresh()}}return this}}REG.reg.registerSkin("c-msg",1,`\n\t:host {\n\t\tflex: 1 0 auto;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tjustify-content: center;\n\t\talign-items: center;\n\t}\n\n\t:host([hidden]) {\n\t\tdisplay: none;\n\t}\n\n\t:host(.headband) {\n\t\tflex: 0 0 auto;\n\t\tmin-height: 1.7em;\n\t}\n\n\t:host([level=info]) {\n\t\tcolor: var(--info-color);\n\t\tfont-style: italic;\n\t}\n\n\t:host([level=error]) {\n\t\tcolor: var(--error-color);\n\t}\n\n\t:host([level=warning]) {\n\t\tcolor: var(--warning-color);\n\t}\n\n\t:host([level=valid]) {\n\t\tcolor: var(--valid-color);\n\t}\n`)
customElements.define("c-msg",MsgLabel)
export class MsgOver extends MsgLabel{_initSkin(init){const reg=this.findReg(init)
reg.installSkin("c-msg",this.shadowRoot)
this._initAndInstallSkin(this.localName,init)}showMsgOver(node){while(node&&node instanceof HTMLIFrameElement||node instanceof HTMLImageElement||node instanceof HTMLMediaElement){node=DOMSH.getFlatParentElt(node)}if(this.over&&this.over!==node)this.removeMsg()
this.over=node
const st=window.getComputedStyle(node)
if(st.position==="static"){node.style.position="relative"
this._wasStatic=true}else{this._wasStatic=false}(node.shadowRoot||node).appendChild(this)
return this}async waitFor(cb){try{return await(typeof cb==="function"?cb():cb)}finally{this.removeMsg()}}removeMsg(){if(!this.over)return
if(this._wasStatic)this.over.style.position="static"
if(this.parentNode)this.remove()
return this}}REG.reg.registerSkin("c-msg-over",1,`\n\t:host {\n\t\tposition: absolute;\n\t\tleft: 0;\n\t\ttop: 0;\n\t\tright: 0;\n\t\tbottom: 0;\n\t\tbackground-color: rgba(0, 0, 0, .5);\n\t\tz-index: 1000000;\n\t}\n\n\t.label {\n\t\tbackground: linear-gradient(to top, transparent, var(--bgcolor) .5em, var(--bgcolor) 50%, transparent),\n\t\tlinear-gradient(to bottom, transparent, var(--bgcolor) .5em, var(--bgcolor) 50%, transparent);\n\t\tborder-radius: .5em;\n\t\tpadding: .5em;\n\t}\n`)
customElements.define("c-msg-over",MsgOver)
export class Clickable extends Label{get disabled(){return this.hasAttribute("disabled")}set disabled(val){if(DOM.setAttrBool(this,"disabled",val))this.refresh()}get tabIndexCustom(){return this._tabIndexCustom}set tabIndexCustom(val){if(this._tabIndexCustom!==val){this._tabIndexCustom=val
this.refresh()}}_initialize(init){BASIS.makeClickable(this)
if(init.disabled)DOM.setAttrBool(this,"disabled",true)
this._tabIndexCustom=init.tabIndexCustom||0
super._initialize(init)}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
init.tabIndexCustom="_tabIndexCustom"in this?this._tabIndexCustom:BASIS.extractAttrAsNumber(this,"tabindex-custom",0)
return init}_refresh(){super._refresh()
this.tabIndex=this.disabled?-1:this.tabIndexCustom}}REG.reg.registerSkin("scroll/small",1,`\n\t::-webkit-scrollbar {\n\t\twidth: .6em;\n\t\theight: .6em;\n\t}\n\n\t::-webkit-scrollbar-track {\n\t\tbackground-color: var(--scroll-color);\n\t\tfilter: opacity(.1);\n\t}\n\n\t::-webkit-scrollbar-thumb {\n\t\tborder-radius: .2em;\n\t\tbox-shadow: inset 0 0 .3em var(--scroll-thumb-color);\n\t}\n\n\t* {\n\t\tscrollbar-width: thin;\n\t}\n`)
REG.reg.registerSkin("scroll/large",1,`\n\t::-webkit-scrollbar {\n\t\twidth: 1em;\n\t\theight: 1em;\n\t\tbackground: var(--scroll-color);\n\t}\n\n\t::-webkit-scrollbar-thumb {\n\t\tborder-radius: .2em;\n\t\tbox-shadow: inset 0 0 .3em var(--scroll-thumb-color);\n\t}\n\n\t::-webkit-scrollbar-track {\n\t\tbackground: var(--scroll-color, #f3f3f3);\n\t}\n\n\t::-webkit-scrollbar-button:single-button {\n\t\tbackground-color: #bbbbbb;\n\t\tdisplay: block;\n\t\tbox-shadow: inset 0 0 .2em var(--scroll-thumb-color);\n\t\theight: 1em;\n\t\twidth: 1em;\n\t}\n\n\t::-webkit-scrollbar-corner {\n\t\tbackground-color: transparent;\n\t}\n\n\t::-webkit-scrollbar-button:single-button:hover {\n\t\tbox-shadow: inset 0 0 .4em var(--scroll-thumb-color);\n\t}\n\n\t::-webkit-scrollbar-button:single-button:vertical:decrement {\n\t\tbackground: center center no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/scrollUp.svg);\n\t\tfilter: var(--filter);\n\t}\n\n\t::-webkit-scrollbar-button:single-button:vertical:increment {\n\t\tbackground: center center no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/scrollDown.svg);\n\t\tfilter: var(--filter);\n\t}\n\n\t::-webkit-scrollbar-button:single-button:horizontal:decrement {\n\t\tbackground: center center no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/scrollLeft.svg);\n\t}\n\n\t::-webkit-scrollbar-button:single-button:horizontal:increment {\n\t\tbackground: center center no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/scrollRight.svg);\n\t}\n`)
Desk.compatTable.set("commons",(function(){if(!window.customElements||!HTMLElement.prototype.attachShadow)return false
if(!window.requestIdleCallback)return false
return true}))
export class FreeElement extends BaseElement{_initialize(init){init.freeInitialize.call(this,init)}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
if(this.hasAttribute("svc")){const reg=REG.findReg(this)
const svc=reg.getSvc(this.getAttribute("svc"))
if(svc)init=Object.assign(init,svc)}return init}}customElements.define("c-free",FreeElement)
export class FreeElementAsync extends BaseElementAsync{async _initialize(init){return init.freeInitialize.call(this,init)}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
if(this.hasAttribute("svc")){const reg=REG.findReg(this)
const svc=reg.getSvc(this.getAttribute("svc"))
if(svc)init=Object.assign(init,svc)}return init}}customElements.define("c-free-async",FreeElementAsync)
export var BASIS;(function(BASIS){function makeClickable(elt){elt.tabIndex=0
elt.addEventListener("keypress",(function(ev){if(LANG.in(ev.key,"Enter"," ")&&!ACTION.isAnyControlPressed(ev)){ev.stopImmediatePropagation()
ev.preventDefault()
this.click()}}))}BASIS.makeClickable=makeClickable
function extractAttr(node,name){return node.getAttribute(name)}BASIS.extractAttr=extractAttr
function extractAttrAsNumber(node,name,defaultVal){if(node.hasAttribute(name))return Number.parseInt(extractAttr(node,name))||defaultVal
return defaultVal}BASIS.extractAttrAsNumber=extractAttrAsNumber
function refreshTree(from,excludeFrom){const tw=document.createTreeWalker(from,NodeFilter.SHOW_ELEMENT)
if(excludeFrom&&!tw.nextNode())return
do{if(isEltRefreshable(tw.currentNode))tw.currentNode.refresh()}while(tw.nextNode())}BASIS.refreshTree=refreshTree
function clearContent(sr){let ch=sr.lastChild
while(ch){if(ch.localName!=="style"){const prev=ch.previousSibling
sr.removeChild(ch)
ch=prev}else{ch=ch.previousSibling}}}BASIS.clearContent=clearContent
function newInit(from,reg){const i=Object.create(from||null)
i.reg=reg
return i}BASIS.newInit=newInit
BASIS.titleOnEllipsisObserver=new ResizeObserver(entries=>{for(const entry of entries){const target=entry.target
if(target.scrollWidth>Math.ceil(entry.contentRect.width)||target.scrollHeight>Math.ceil(entry.contentRect.height)){target.title=entry.target.textContent}else{target.title=""}}})
function ensureVisible(elt,scrollCtn,blockPos="start"){if(scrollCtn){if(getComputedStyle(scrollCtn).scrollBehavior==="smooth"){const target=elt.getBoundingClientRect()
const scrollBox=scrollCtn.getBoundingClientRect()
let delta
if(blockPos==="nearest"){delta=Math.min(Math.abs(target.bottom-scrollBox.top),Math.abs(target.top-scrollBox.bottom))}else{delta=Math.abs(target.top-scrollBox.top)}if(delta>scrollBox.height*2){scrollCtn.style.scrollBehavior="auto"
elt.scrollIntoView({block:blockPos,behavior:"auto"})
scrollCtn.style.scrollBehavior="smooth"}else{elt.scrollIntoView({block:blockPos,behavior:"smooth"})}}else{elt.scrollIntoView({block:blockPos})}}else{elt.scrollIntoView({block:blockPos,behavior:"smooth"})}}BASIS.ensureVisible=ensureVisible
BASIS.DEBUG=false})(BASIS||(BASIS={}))

//# sourceMappingURL=basis.js.map