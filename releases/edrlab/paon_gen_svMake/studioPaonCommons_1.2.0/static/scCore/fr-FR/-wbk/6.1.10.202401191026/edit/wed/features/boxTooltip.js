import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
export function AgEltBoxTooltip(cls,opts){const options=Object.assign({findFocusableOnShown:false,withTitle:"replaceTitle"},opts)
if(!options.factory)return
const proto=cls.prototype
const connectedCallback=proto.connectedCallback
proto.connectedCallback=function(){if(connectedCallback)connectedCallback.call(this)
const reg=this.wedlet.wedMgr.reg
const sh=this.shadowRoot
if(sh)reg.installSkin("box-tt",sh)
if(options.withTitle==="replaceTitle")this.removeAttribute("title")
if(options.withTitle!=="showOnlyIfNoTitle"||!this.title){POPUP.promiseTooltip(this,options.findFocusableOnShown?(owner,tooltip)=>{tooltip.addEventListener("c-shown",()=>{const focusbale=DOMSH.findFlatNext(tooltip.firstElementChild,tooltip,DOM.IS_focusable)
if(focusbale)focusbale.focus()})
return options.factory(owner,tooltip)}:options.factory,{hoverAllowed:true,skin:"c-popup-tooltip",skinOver:"box-tt/popup"})}}
return cls}export function AgEltBoxFloating(cls,opts){const options=Object.assign({display:["click"],findFocusableOnShown:false},opts)
if(!options.factory)return
const proto=cls.prototype
const connectedCallback=proto.connectedCallback
const disconnectedCallback=proto.disconnectedCallback
proto.connectedCallback=function(){if(connectedCallback)connectedCallback.call(this)
const reg=this.wedlet.wedMgr.reg
const sh=this.shadowRoot
if(sh)reg.installSkin("box-tt",sh)
if(options.factory){const openFct=focusOnClose=>{POPUP.showFloating(popup=>{if(options.findFocusableOnShown){popup.addEventListener("c-shown",()=>{const focusbale=DOMSH.findFlatNext(popup.firstElementChild,popup,DOM.IS_focusable)
if(focusbale)focusbale.focus()})}this._boxTtPopupFloating=popup
popup.addEventListener("c-close",()=>{this._boxTtPopupFloating=null
if(focusOnClose&&DOM.IS_focusable(this))this.focus()})
return options.factory(this,popup)},this,this,{closeOnBlur:true,skin:"c-popup-floating",skinOver:"box-tt/floating"})}
if(options.display.indexOf("click")>-1){BASIS.makeClickable(this)
this.setAttribute("role","button")
this.onclick=()=>openFct(true)}if(options.display.indexOf("over")>-1){POPUP.mouseOverRetarderCaller(this,false,openFct)
this.addEventListener("keypress",(function(ev){if(LANG.in(ev.key,"Enter"," ")&&!ACTION.isAnyControlPressed(ev)){ev.stopImmediatePropagation()
ev.preventDefault()
openFct(true)}}))}proto.disconnectedCallback=function(){var _a
if(disconnectedCallback)disconnectedCallback.call(this);(_a=this._boxTtPopupFloating)===null||_a===void 0?void 0:_a.close()}}return cls}}REG.reg.registerSkin("box-tt",1,`\n\t:host([role=button]) {\n\t\tcursor: pointer\n\t}\n`)
REG.reg.registerSkin("box-tt/popup",1,`\n\n`)

//# sourceMappingURL=boxTooltip.js.map