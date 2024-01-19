import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{findWedEditor,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{AgEltBoxSelection}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxSel.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{BoxContainer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
class BoxPane extends BoxContainer{get collapsed(){return!this.hasAttribute("opened")}set collapsed(state){if(DOM.setAttrBool(this,"opened",!state)){if(state)this._doClose()
else this._doOpen()}}configWedletElt(tpl,wedlet){this.wedlet=wedlet
const sh=this.shadowRoot||this.attachShadow(DOMSH.SHADOWDOM_INIT)
WEDLET.installSkins(tpl,sh,wedlet,"box-pane")
this.subEltWedlets=WEDLET.cloneWedletContent(this,tpl,wedlet,true)
const head=this.head=this.shadowRoot.querySelector(".head")
head.onclick=this.onClickHead
this.onkeydown=this.onKeyDown
this.body=this.shadowRoot.querySelector(".body")
this.body.hidden=true
this.body.style.zIndex="901"}_doClose(){this.body.hidden=true
this.wedlet.wedMgr.listeners.removeListener("getFocus",this._focusLstn)
if(this._pointerTarget){this._pointerTarget.addEventListener("pointerdown",this._pointerLstn)
this._pointerTarget=null}if(this._ctnResizer){this._ctnResizer.disconnect()
this._ctnResizer=null}}_doOpen(){var _a
this.style.position="relative"
this.body.hidden=false
WEDLET.refreshEditMode(this.wedlet)
const ctn=this.findCtn()
this.fixPosition(ctn,this.head,this.body)
if(!this._focusLstn)this._focusLstn=(wedMgr,focused)=>{if(focused&&!DOMSH.isAncestor(this,focused))this.collapsed=true}
if(!this._pointerLstn)this._pointerLstn=ev=>{if(!DOMSH.isAncestor(this,ev.composedPath()[0]))this.collapsed=true}
this.wedlet.wedMgr.listeners.on("getFocus",this._focusLstn)
this._pointerTarget=findWedEditor(this).rootNode;(_a=this._pointerTarget)===null||_a===void 0?void 0:_a.addEventListener("pointerdown",this._pointerLstn)
this._ctnResizer=new ResizeObserver(entries=>{this.fixPosition(entries[0].target,this.head,this.body)})
this._ctnResizer.observe(ctn)}onClickHead(ev){const me=DOMSH.findHost(this)
me.collapsed=!me.collapsed
ev.stopImmediatePropagation()
ev.preventDefault()}onKeyDown(ev){if(ev.target===this&&LANG.in(ev.key,"ArrowRight","Enter"," ")&&!ACTION.isAccelPressed(ev)){if(ev.key==="ArrowRight"){this.collapsed=false
return}this.collapsed=!this.collapsed
ev.stopImmediatePropagation()
ev.preventDefault()}}findCtn(){return findWedEditor(this).rootNode}paneLeft(ctn){return ctn.getBoundingClientRect().left+5}paneWidth(ctn){return ctn.clientWidth-11+"px"}fixPosition(ctn,around,target){const st=target.style
const aroundRect=around.getBoundingClientRect()
const offset=(target.offsetParent||document.body).getBoundingClientRect()
st.top=Math.round(aroundRect.bottom-offset.top)+"px"
st.left=Math.round(this.paneLeft(ctn)-offset.left)+"px"
st.width=st.maxWidth=this.paneWidth(ctn)}}AgEltBoxSelection(BoxPane,{selMode:"box",actionsLists:["actions:wed:box-ctn","actions:wed:box"]})
REG.reg.registerSkin("box-pane",1,`\n\t:host([opened]) {\n\t\tbackground-color: var(--edit-select-bgcolor);\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--focus-outline);\n\t}\n\n\t.head {\n\t\tcursor: pointer;\n\t\tborder: 1px solid var(--border-color);\n\t\tborder-radius: 4px;\n\t\tpadding: .3em;\n\t\tbackground-color: var(--edit-btn-bgcolor);\n\t\tcolor: var(--edit-btn-color);\n\t\tfont-weight: bold;\n\t}\n\n\t:host(.virtual) .head {\n\t\tfont-weight: normal;\n\t}\n\n\t[hidden] {\n\t\tdisplay: none !important;\n\t}\n\n\t.body {\n\t\tbox-sizing: border-box;\n\t\tbackground-color: var(--edit-bgcolor);\n\t\tposition: absolute;\n\t\tborder: solid 1px var(--border-color);\n\t\tborder-radius: 4px;\n\t\tbox-shadow: 1px 1px 5px var(--fade-color);\n\t\tpadding: .2em .3em;\n\t}\n`)
window.customElements.define("box-pane",BoxPane)

//# sourceMappingURL=boxPane.js.map