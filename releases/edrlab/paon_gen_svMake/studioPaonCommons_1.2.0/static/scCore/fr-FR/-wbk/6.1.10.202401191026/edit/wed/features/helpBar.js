import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{HelpViews}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/help/views/helpViews.js"
import{BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{IS_EltWedlet,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
export function initHelpOnEditor(helpInit,reg,editorConfig,wedMgrConfig,editor){reg.addToList("actions:wed:commonbar:end","help",1,new ToggleHelpAction(helpInit),101)
reg.addToList("accelKeys:wed:global","F1",1,new ShowHelpFromSelAction(helpInit))}class WedHelpBar extends HTMLElement{constructor(){super()
this.id=HELPBAR_ID}async initHelpBar(wedEditor,helpInit){this.wedEditor=wedEditor
this.setAttribute("label","Aide")
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
wedEditor.reg.installSkin(this.localName,sr)
this.view=sr.appendChild((new HelpViews).initialize(BASIS.newInit(helpInit,wedEditor.reg)))
wedEditor.barLayout.showBar(this)
await this.view.initializedAsync
return this}showBar(show){if(show){if(DOM.setHidden(this,false))this.wedEditor.barLayout.showBar(this)}else if(DOM.setHidden(this,true)){this.wedEditor.barLayout.onHideBar(this)}}visitViews(visitor,options){if((options===null||options===void 0?void 0:options.visible)&&this.hidden)return
return visitor(this.view)}visitViewsAsync(visitor,options){if((options===null||options===void 0?void 0:options.visible)&&this.hidden)return
return visitor(this.view)}}REG.reg.registerSkin("wed-helpbar",1,`\n\t:host {\n\t\tflex: 1 1 30%;\n\t\tdisplay: flex;\n\t\tmin-height: 100px;\n\t\tmin-width: 100px;\n\t\tflex-direction: column;\n\t}\n`)
customElements.define("wed-helpbar",WedHelpBar)
export class ToggleHelpAction extends Action{constructor(helpInit){super("help")
this.helpInit=helpInit
this._label="Aide"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/help/help.svg"}isToggle(){return true}getDatas(api,ctx){const bar=ctx.barLayout.getBar(HELPBAR_ID)
return bar&&!bar.hidden}execute(ctx,ev){const bar=ctx.barLayout.getBar(HELPBAR_ID)
if(bar){bar.showBar(bar.hidden)}else getOrCreateHelpBar(ctx,this.helpInit)}}export class ShowHelpFromSelAction extends Action{constructor(helpInit){super("help")
this.helpInit=helpInit}async execute(ctx,ev){return(await getOrCreateHelpBar(ctx,this.helpInit)).view.showLiveHelpId(findHelpFromLastFocus(ctx.wedMgr),true)}}async function getOrCreateHelpBar(editor,helpInit){let bar=editor.barLayout.getBar(HELPBAR_ID)
if(!bar){bar=await(new WedHelpBar).initHelpBar(editor,helpInit)
editor.wedMgr.listeners.on("getFocus",wedMgr=>{bar.view.showLiveHelpFromSel(()=>findHelpFromLastFocus(wedMgr))})}else bar.showBar(true)
return bar}function findHelpFromSel(wedMgr){const sel=wedMgr.getCurrentSel()
if(sel){let xa=sel.startInText?XA.up(sel.start):sel.start
return findHelpFromXa(wedMgr.docHolder,xa,sel.virtualPath)}}function findHelpFromLastFocus(wedMgr){var _a
const elt=wedMgr.lastFocus
if(elt===null||elt===void 0?void 0:elt.isConnected){const wedlet=(_a=DOMSH.findFlatParentEltOrSelf(elt,wedMgr.wedEditor.rootNode,IS_EltWedlet))===null||_a===void 0?void 0:_a.wedlet
if(wedlet)return findHelpFromXa(wedMgr.docHolder,wedlet.wedAnchor,WEDLET.buildVirtualPath(wedlet))}}function findHelpFromXa(docHolder,xa,virtualPath){var _a,_b
let helpId=(_a=docHolder.getStruct(xa,virtualPath))===null||_a===void 0?void 0:_a.helpId
while(!helpId){if(xa.length>1)xa=XA.up(xa)
else break
if((virtualPath===null||virtualPath===void 0?void 0:virtualPath.length)>0)virtualPath.length--
helpId=(_b=docHolder.getStruct(xa,virtualPath))===null||_b===void 0?void 0:_b.helpId}return helpId}const HELPBAR_ID="helpBar"

//# sourceMappingURL=helpBar.js.map