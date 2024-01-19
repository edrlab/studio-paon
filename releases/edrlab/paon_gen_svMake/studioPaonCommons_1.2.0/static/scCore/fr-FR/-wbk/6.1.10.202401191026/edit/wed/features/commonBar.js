import{IS_ActionableEnabled}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/actionables.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{isEltBoxSelection}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxSel.js"
export function AgCommonBarEditor(cls){const proto=cls.prototype
const superInit=proto.initialize
proto.initialize=function(config){superInit.call(this,config)
if(!config.hideCommonBar){if(config.commonBar){config.commonBar.attachSubEditor(this)}else if(this.barLayout){this.commonBar=new WedCommonBar(this,config)}}return this}
return cls}export class WedCommonBar{constructor(editor,config){this.editor=editor
this.rootBar=JSX.createElement("div",{id:"commonBar",style:"display:flex;"})
editor.barLayout.showBar(this.rootBar)
editor.wedMgr.hookFct("detachDocHolder",()=>{if(this.editor.wedMgr.docHolderAsync){this.rootBar.textContent=null
this.stableStartBar=null
this.stableEndBar=null}},true)
editor.wedMgr.listeners.on("redrawBeforeFetch",planRefreshFull).on("redrawAtEnd",planRefreshFull).on("readOnlyChangeAfter",planRefreshFull).on("layoutBarChange",planRefreshStableBar).on("getFocus",onFocus).on("selection",onSelChange).on("killEditor",(function(wedMgr){wedMgr.wedEditor.commonBar.killBar()}))
this.rootBar.addEventListener("keydown",onKeydown.bind(editor))
this._requestIdleCallback=requestIdleCallback.bind(this)}killBar(){if(this._redrawPlanned)window.cancelIdleCallback(this._redrawPlanned)}attachSubEditor(editor){editor.commonBar=this
editor.wedMgr.listeners.on("getFocus",onFocus).on("selection",onSelChange)}planRefreshFull(){this._nextRefreshStableBar=true
this._nextFocusBar=null
if(!this._redrawPlanned)this._redrawPlanned=window.requestIdleCallback(this._requestIdleCallback)}planRefreshStableBar(){this._nextRefreshStableBar=true
if(!this._redrawPlanned)this._redrawPlanned=window.requestIdleCallback(this._requestIdleCallback)}planChangeFocusBar(focusBar){this._nextFocusBar=focusBar
if(!this._redrawPlanned)this._redrawPlanned=window.requestIdleCallback(this._requestIdleCallback)}redraw(){if(!this.stableStartBar){const reg=this.editor.wedMgr.reg
this.stableStartBar=(new BarActions).initialize({actionContext:this.editor,actions:reg.getList("actions:wed:commonbar:start")})
this.stableStartBar.style.flexShrink="0"
this.stableStartBar.style.flexGrow="1"
this.rootBar.appendChild(this.stableStartBar)
const endActions=reg.getList("actions:wed:commonbar:end")
if(endActions){this.stableEndBar=(new BarActions).initialize({actionContext:this.editor,actions:endActions})
this.stableEndBar.style.flexShrink="0"
this.rootBar.appendChild(this.stableEndBar)}this._nextRefreshStableBar=false}else if(this._nextRefreshStableBar){this.stableStartBar.refreshContent()
if(this.stableEndBar)this.stableEndBar.refreshContent()
this._nextRefreshStableBar=false}if(this.focusBar===this._nextFocusBar){if(this.focusBar)this.focusBar.refreshContent()}else{if(this.focusBar){this.focusBar.remove()
this.focusBar=null}if(this._nextFocusBar){const focused=this._nextFocusBar.actionContext.focusedElt
if(focused&&focused.isConnected){this.focusBar=this._nextFocusBar
DOM.setStyle(this.focusBar,"flex-grow","1000")
DOM.setStyle(this.focusBar,"border-inline-start",this.stableStartBar?"1px solid var(--border-color)":null)
DOM.setStyle(this.focusBar,"border-inline-end",this.stableEndBar?"1px solid var(--border-color)":null)
this.rootBar.insertBefore(this.focusBar,this.stableEndBar)}}}}acquireFocus(){this.restoreFocusTarget=DOMSH.findDeepActiveElement()
if(this.focusBar){const focusable=DOMSH.findFlatFirstChild(this.focusBar,DOM.IS_focusable)
if(focusable){focusable.focus()
return}}if(this.stableStartBar){const focusable=DOMSH.findFlatFirstChild(this.stableStartBar,DOM.IS_focusable)
if(focusable){focusable.focus()
return}}}}const isWedFocusBarPointer=function(h){return h.focusBar!=null}
function onFocus(wedMgr,focusElt){wedMgr.wedEditor.commonBar.planChangeFocusBar(focusElt.focusBar)}function onSelChange(wedMgr,sel){const editor=wedMgr.wedEditor
if(sel==null){editor.commonBar.planChangeFocusBar(null)
return}const focus=DOM.findParentOrSelf(sel.focusNode,null,DOM.IS_element)
if(!focus)return
const eltBoxCtn=DOMSH.findFlatParentEltOrSelf(focus,editor.rootNode,isEltBoxSelection)
if((eltBoxCtn===null||eltBoxCtn===void 0?void 0:eltBoxCtn.selMode)==="caret"){const focusBarPointer=DOMSH.findFlatParentEltOrSelf(focus,editor.rootNode,isWedFocusBarPointer)
editor.commonBar.planChangeFocusBar(focusBarPointer?focusBarPointer.focusBar:null)}}function onKeydown(ev){switch(ev.key){case" ":if(!ACTION.isAccelPressed(ev))break
case"Escape":ev.stopImmediatePropagation()
if(this.commonBar.restoreFocusTarget instanceof HTMLElement)this.commonBar.restoreFocusTarget.focus()
break
case"ArrowLeft":if(this.commonBar.focusBar&&this.commonBar.stableStartBar&&DOM.isAncestor(this.commonBar.focusBar,ev.target)){const next=DOM.findLastChild(this.commonBar.stableStartBar,IS_ActionableEnabled)
if(next){ev.stopImmediatePropagation()
next.focus()}}break
case"ArrowRight":if(this.commonBar.focusBar&&this.commonBar.stableStartBar&&DOM.isAncestor(this.commonBar.stableStartBar,ev.target)){const next=DOM.findFirstChild(this.commonBar.focusBar,IS_ActionableEnabled)
if(next){ev.stopImmediatePropagation()
next.focus()}}break}}function planRefreshFull(wedMgr){wedMgr.wedEditor.commonBar.planRefreshFull()}function planRefreshStableBar(wedMgr){wedMgr.wedEditor.commonBar.planRefreshStableBar()}function requestIdleCallback(deadline){if(deadline.timeRemaining()<5){this._redrawPlanned=window.requestIdleCallback(this._requestIdleCallback)
return}this._redrawPlanned=null
this.redraw()}REG.reg.addSvcToList("actions:wed:commonbar:start","undo",1,"wedEditorUndoAction",50)
REG.reg.addSvcToList("actions:wed:commonbar:start","redo",1,"wedEditorRedoAction",51)

//# sourceMappingURL=commonBar.js.map