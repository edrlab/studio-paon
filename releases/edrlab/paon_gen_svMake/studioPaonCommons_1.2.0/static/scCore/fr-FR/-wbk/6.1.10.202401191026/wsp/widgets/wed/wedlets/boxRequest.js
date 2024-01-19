import{AgEltBoxSelection}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxSel.js"
import{EWedletEditMode,EWedletEditModeLabel,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{AgEltBoxInputAnnotable,removeAnnots}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{AccelKeyMgr,Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{BASIS,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{UiCritBool}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/search/uiCrit.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
class BoxRequest extends HTMLElement{constructor(){super(...arguments)
this._redrawPlanned=false}configWedletElt(tpl,wedlet){this.wedlet=wedlet
this.readonly=!WEDLET.isWritableWedlet(wedlet)
this.criterionsLists=BASIS.extractAttr(tpl,"criterionsLists")
this.fillSearchWhereWrappersLists=BASIS.extractAttr(tpl,"fillSearchWhereWrappersLists")
if(tpl.hasAttribute("checkXpath")){this.checkXpath=(new XPathEvaluator).createExpression(BASIS.extractAttr(tpl,"checkXpath"),this)
this.checkMsg=BASIS.extractAttr(tpl,"checkMsg")}this.addEventListener("dblclick",this.doEdit.bind(this))
const wedMgr=wedlet.wedMgr
const reg=wedMgr.reg
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
WEDLET.installSkins(tpl,sr,wedlet,this.localName)
this.barActionsElt=sr.appendChild(JSX.createElement(BarActions,{"î":{reg:reg,actionContext:this,actions:reg.getList("wed:boxRequest:actions"),uiContext:"dialog",disableFullOverlay:true}}))
this.msgLabelElt=sr.appendChild(JSX.createElement(MsgLabel,{class:"headband"}))
this.abstractElt=sr.appendChild(JSX.createElement("div",{id:"abstract"}))
wedlet._bind=function(node,children){this.refreshEditMode()
this.element.refreshBindValue(node,children)}
wedlet.onChildNodesInserted=wedlet.deleteChildNodes=wedlet.updateInDescendants=()=>{if(!this._redrawPlanned){this._redrawPlanned=true
wedMgr.doAfterBatch(this._redraw||(this._redraw=this.redraw.bind(this)))}}}setNewFrag(elt){if(!elt)return this.eraseFrag()
const wedlet=this.wedlet
if(!WEDLET.isWritableWedlet(wedlet))return
const jml=JML.newJml()
let vNode=elt.firstChild
while(vNode){JML.domNode2jml(vNode,jml,null)
vNode=vNode.nextSibling}const batch=wedlet.wedMgr.docHolder.newBatch()
if(wedlet.isVirtual()){WEDLET.insertDatasFromDisplay(wedlet,batch,jml)}else{batch.spliceSequence(XA.append(wedlet.wedAnchor,0),this.requestValue.children.length,jml)}batch.doBatch()}eraseFrag(){const wedlet=this.wedlet
if(wedlet.isVirtual()||this.readonly)return
if(!this.isEmpty())wedlet.wedMgr.docHolder.newBatch().deleteSequence(XA.append(wedlet.wedAnchor,0),this.requestValue.children.length).doBatch()}setEditMode(mode){this.readonly=mode!==EWedletEditMode.write
DOM.setAttr(this,"edit-mode",EWedletEditModeLabel[mode])}refreshBindValue(val,children){this.wedlet.wedMgr.doAfterBatch(()=>{this.requestValue=XA.findDomLast(this.wedlet.wedAnchor,this.wedlet.wedMgr.docHolder.getDocument())
this.redraw()})}redraw(){this._redrawPlanned=false
this.abstractElt.textContent=null
this.msgLabelElt.setStandardMsg(null)
this.checkResult=undefined
if(this.checkXpath&&!this.isEmpty()){const result=this.checkXpath.evaluate(this.requestValue,XPathResult.BOOLEAN_TYPE)
if(!result.booleanValue){this.msgLabelElt.setCustomMsg(this.checkMsg||"Requête non valide","warning")
this.checkResult=false}else this.checkResult=true}const wedMgr=this.wedlet.wedMgr
if(this.checkResult!==false){if(this.wedlet.isVirtual())removeAnnots(this)
if(this.isEmpty()){this.msgLabelElt.setCustomMsg("Requête non définie","info")}else{this.msgLabelElt.setStandardMsg(null)
if(this.abstractElt){const context={reg:wedMgr.reg,criterions:this.criterionsLists?wedMgr.reg.mergeListsAsMap(...this.criterionsLists.split(" ")):wedMgr.reg.getListAsMap("wsp.crit.items")}
const desc=UiCritBool.AREA_AND_ROOT.buildAbstract(this.requestValue,context)
if(desc)this.abstractElt.appendChild(desc)}}}this.barActionsElt.refreshContent()}isEmpty(){return!this.requestValue||this.requestValue.childNodes.length==0}async persistSearch(search){this.setNewFrag(search.whereCrit instanceof Element?search.whereCrit:search.whereCrit(this.wedlet.wedMgr))}async doEdit(){const wedMgr=this.wedlet.wedMgr
const reg=wedMgr.reg
const{SearchItems:SearchItems}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/searchItems.js")
const init={reg:reg,showMainView:true,srcGrid:{actions:reg.mergeLists("actions:wsp:shortDesc","actions:searchItem:shortDesc:item"),accelKeyMgr:(new AccelKeyMgr).initFromMapActions(reg.mergeListsAsMap("accelkeys:wsp:shortDesc","accelkeys:searchItem:shortDesc:item"))},readonly:this.readonly||this.checkResult===false,criterions:this.criterionsLists?wedMgr.reg.mergeListsAsMap(...this.criterionsLists.split(" ")):wedMgr.reg.getListAsMap("wsp.crit.items"),searchStore:this,canEditTitle:false,initSearchRequest:{}}
if(!this.isEmpty())init.initSearchRequest.whereCrit=this.requestValue
if(this.fillSearchWhereWrappersLists){const whereHandlers=wedMgr.reg.mergeListsAsMap(...this.fillSearchWhereWrappersLists.split(" "))
init.searchWhereWrapper=async function(where,reg){for(const key in whereHandlers){const handler=whereHandlers[key]
await handler.call(this,where,wedMgr.reg)}}}const ct=(new SearchItems).initialize(init)
POPUP.showDialog(ct,this,{titleBar:{barLabel:{label:init.readonly?"Consultation d\'une requête":"Édition d\'une requête"},closeButton:{}},resizer:{},viewPortX:"middle",viewPortY:"middle",initWidth:"90vw",initHeight:"90vh"})}}AgEltBoxSelection(AgEltBoxInputAnnotable(BoxRequest),{selMode:"box"})
REG.reg.registerSkin("box-request",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: min-content;\n\t\tmin-width: 5em;\n\t\tflex-direction: column;\n\t\tborder: 1px solid var(--border-color);\n\t\tmargin: 0;\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--edit-input-focus);\n\t}\n\n\tc-bar-actions {\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\t#abstract {\n\t\ttext-align: center;\n\t}\n`)
window.customElements.define("box-request",BoxRequest)
class BoxRequestEdit extends Action{constructor(){super("fragEdit")
this._description="Éditer cette requête"}getLabel(ctx){return ctx.readonly||ctx.checkResult===false?"Visualiser":"Éditer"}async execute(ctx,ev){await ctx.doEdit()}}class BoxRequestErase extends Action{constructor(){super("fragErase")
this._label="Effacer"
this._description="Effacer le fragment HTML"}isEnabled(ctx){if(ctx.readonly)return false
return super.isEnabled(ctx)}execute(ctx,ev){ctx.eraseFrag()}}function addAction(action){REG.reg.addToList("wed:boxRequest:actions",action.getId(),1,action)}addAction(new BoxRequestEdit)
addAction(new BoxRequestErase)

//# sourceMappingURL=boxRequest.js.map