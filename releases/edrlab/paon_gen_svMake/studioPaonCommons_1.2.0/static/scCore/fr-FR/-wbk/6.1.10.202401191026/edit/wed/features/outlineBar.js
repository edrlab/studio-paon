import{IS_OtlTree,OtlEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/outline/outlineTags.js"
import{IS_EltWedlet,isTargetableWedlet,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
export function AgOutlineBarEditor(cls){const proto=cls.prototype
proto.showOutline=function(show){if(show){if(!this.outlineWedModel)return
if(!this.outlineBar){const init=Object.create(this.config)
init.lastDatasKey="otl"
init.lastDatas=this.config.lastDatas&&this.config.lastDatas[init.lastDatasKey]
this.outlineBar=(new OtlBar).initialize(init).initOutline(this)
this.outlineBar.refreshHighlightCb=()=>{this.outlineBar.refreshHighlight(true)}
this.wedMgr.listeners.on("getFocus",this.outlineBar.refreshHighlightCb)}else this.outlineBar.hidden=false
this.barLayout.showBar(this.outlineBar)}else if(this.outlineBar){if(DOM.setHidden(this.outlineBar,true))this.barLayout.onHideBar(this.outlineBar)}}
if(!proto.initLastDatasHooks)proto.initLastDatasHooks=[]
proto.initLastDatasHooks.push((function(lastDatas){if(lastDatas.otl){if(this.wedMgr.rootWedlet){this.showOutline(true)}else{this.wedMgr.listeners.once("redrawAtEnd",()=>{this.showOutline(true)})}}}))
if(!proto.buildLastDatasHooks)proto.buildLastDatasHooks=[]
proto.buildLastDatasHooks.push((function(lastDatas){if(this.outlineBar&&!this.outlineBar.hidden)this.outlineBar.buildLastDatas(lastDatas)}))
return cls}class OtlBar extends OtlEditor{constructor(){super()
this.requestIdleCallback=requestIdleCallback.bind(this)
this.id="outlineBar"
this.setAttribute("label","Niveaux de titres")}connectedCallback(){super.connectedCallback()
REG.findReg(this).installSkin("wedEditor/otl-bar",this)}setTreeRoot(treeRoot){super.setTreeRoot(treeRoot)
this.treeRoot.addEventListener("click",this.onClick)}initOutline(mainEditor){this.mainEditor=mainEditor
const mainWedMgr=this.mainEditor.wedMgr
this.wedModel=this.mainEditor.outlineWedModel||mainWedMgr.wedModel
mainWedMgr.listeners.on("killEditor",()=>{if(this.idleCbPending)clearTimeout(this.idleCbPending)})
mainWedMgr.hookFct("clearEditor",()=>{this.wedMgr.clearEditor()})
mainWedMgr.hookFct("detachDocHolder",()=>{this.wedMgr.detachDocHolder()})
mainWedMgr.listeners.on("readOnlyChangeAfter",(mainWedMgr,cause,readOnly,more)=>{this.wedMgr.setReadOnly(cause,readOnly,more)})
const redrawOutline=()=>{this.wedMgr.detachDocHolder()
const wedMgrConfig={}
wedMgrConfig.xaRoot=mainWedMgr.config.xaRoot
wedMgrConfig.readOnlyCauses=Array.from(mainWedMgr.readOnlyCauses)
wedMgrConfig.dataTransferAnalyzer=mainWedMgr.config.dataTransferAnalyzer
wedMgrConfig.noAnnots=true
this.initFromDocHolder(mainWedMgr.docHolderAsync.cloneDocHolder(),wedMgrConfig).then(()=>this.onOtlEntryChange())}
mainWedMgr.listeners.on("redrawAtEnd",redrawOutline)
if(mainWedMgr.drawn)redrawOutline()
return this}onOtlRowUpdated(){this.onOtlEntryChange()
this.refreshHighlight(true)}onOtlEntryChange(){}highlightFromXa(xa){const root=this.wedMgr.rootWedlet
if(root)return this.highlightOtlEntry(OtlEditor.findOtlTree(WEDLET.findWedlet(root,xa,WEDLETFIND_inHier)))
return false}refreshHighlight(force){if(!this.wedMgr.rootWedlet)return
if(this.idleCbPending!=null)return
this.idleCbPending=setTimeout(this.requestIdleCallback,800)}async onClick(ev){const otlTree=DOM.findParent(ev.target,this,IS_OtlTree)
if(otlTree){const otlEditor=this.host.parentElement
otlEditor.highlightOtlEntry(otlTree)
const opts={forceFetch:true,lastAncestorIfNone:true}
let wedletOwner=WEDLET.findWedlet(otlEditor.mainEditor.wedMgr.rootWedlet,otlTree.wedlet.wedAnchor,opts)
if(opts.forceFetchPromises)wedletOwner=WEDLET.getFirstWedlet(await Promise.all(opts.forceFetchPromises))
while(wedletOwner&&!isTargetableWedlet(wedletOwner))wedletOwner=wedletOwner.wedParent
if(wedletOwner){setTimeout(()=>{if(otlTree.isConnected)wedletOwner.highlightFromLink("start")},100)}ev.preventDefault()}}}REG.reg.registerSkin("wedEditor/otl-bar",1,`\n\totl-bar {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n`)
customElements.define("otl-bar",OtlBar)
function requestIdleCallback(){this.idleCbPending=null
let elt
const activeElt=DOMSH.findDeepActiveElement(DOMSH.findDocumentOrShadowRoot(this.mainEditor.rootNode))
elt=activeElt
if(elt){const eltWedlet=DOMSH.findFlatParentEltOrSelf(elt,this.mainEditor.rootNode,IS_EltWedlet)
if(eltWedlet)this.highlightFromXa(eltWedlet.wedlet.wedAnchor)}}const WEDLETFIND_inHier={lastAncestorIfNone:true,mainBranch:true}
export class ShowOutlineAction extends Action{constructor(){super("outline")
this._label="Niveaux de titres"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/outline/outlineBtn.svg"}isVisible(ctx){return ctx.outlineWedModel!=null}isToggle(){return true}getDatas(api,ctx){return ctx.outlineBar!=null&&!ctx.outlineBar.hidden}execute(ctx,ev){ctx.showOutline(!ctx.outlineBar||ctx.outlineBar.hidden)}}
//# sourceMappingURL=outlineBar.js.map