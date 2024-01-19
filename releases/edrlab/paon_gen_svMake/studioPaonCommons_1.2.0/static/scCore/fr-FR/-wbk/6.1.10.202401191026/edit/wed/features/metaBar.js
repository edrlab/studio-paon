import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{Tabs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tabs.js"
import{AgBoxSelEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxSel.js"
import{AgCommonBarEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/commonBar.js"
import{AgTxtSelEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/txtSel.js"
import{WedEditorBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedEditor.js"
import{WedEditorBox}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedEditorBox.js"
import{WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{Area}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
export function AgMetaBarEditor(cls){const proto=cls.prototype
const superInit=proto.initialize
proto.initialize=function(init){superInit.call(this,init)
this.metaBarMode=init.metaBarMode||"none"
if(this.metaBarMode==="shown")this.showMetaBar(true)
return this}
proto.showMetaBar=function(show){if(this.metaBarMode==="none")return null
if(show){if(!this.metaBar){const init=Object.create(this.config)
if(this.commonBar){init.commonBar=this.commonBar}else{init.hideCommonBar=true}init.lastDatasKey=null
init.lastDatas=null
this.metaBar=(new MetaBar).initialize(init).initMetaBar(this)}else this.metaBar.hidden=false
this.barLayout.showBar(this.metaBar)}else if(this.metaBar){if(DOM.setHidden(this.metaBar,true))this.barLayout.onHideBar(this.metaBar)}return this.metaBar}
return cls}class MetaBar extends WedEditorBase{constructor(){super()
this.id="metaBar"
this.setAttribute("label","Propriétés")}initMetaBar(mainEditor){this.mainEditor=mainEditor
const mainWedMgr=this.mainEditor.wedMgr
const clear=()=>{this.wedMgr.clearEditor()}
mainWedMgr.hookFct("clearEditor",clear)
mainWedMgr.listeners.on("redrawAtEnd",clear)
const detach=()=>{this.wedMgr.detachDocHolder()}
mainWedMgr.hookFct("detachDocHolder",detach)
this.addEventListener("wed-editor-root-deleted",detach)
this.style.flex="1"
this.style.backgroundColor="var(--edit-bgcolor)"
this.style.color="var(--edit-color)"
return this}isAlreadyEditing(metaDefs){if(!this.currentMetaDefs)return false
return this.currentMetaDefs[0].from===(Array.isArray(metaDefs)?metaDefs[0]:metaDefs).from}editMeta(metaDefs){if(Array.isArray(metaDefs)&&metaDefs.length>0){throw"TODO edit metas multi"}const firstDef=Array.isArray(metaDefs)?metaDefs[0]:metaDefs
this.setAttribute("label","Propriétés de : "+firstDef.label)
VIEWS.dispatchViewChange(this)
const mainWedMgr=this.mainEditor.wedMgr
this.wedMgr.detachDocHolder()
this.setWedModel(mainWedMgr.wedModel)
const newDocHolder=mainWedMgr.docHolderAsync.cloneDocHolder()
const wedMgrConfig=Object.create(mainWedMgr.config)
wedMgrConfig.readOnlyCauses=Array.from(mainWedMgr.readOnlyCauses)
wedMgrConfig.xaRoot=firstDef.from.wedAnchor
wedMgrConfig.rootModel=firstDef.model
if(!WEDLET.isWritableWedlet(firstDef.from))wedMgrConfig.readOnlyCauses=["wedletOwner"]
this.initFromDocHolder(newDocHolder,wedMgrConfig)}}AgBoxSelEditor(AgTxtSelEditor(AgCommonBarEditor(MetaBar)))
customElements.define("wed-meta-bar",MetaBar)
export class ShowMetaBarAction extends Action{constructor(){super("metaBar")
this._label="Propriétés"}isVisible(ctx){return ctx.metaBarMode&&ctx.metaBarMode!=="none"}isToggle(){return true}getDatas(api,ctx){return ctx.metaBar!=null&&!ctx.metaBar.hidden}execute(ctx,ev){ctx.showMetaBar(!ctx.metaBar||ctx.metaBar.hidden)}}export var METAS;(function(METAS){function showMeta(metaDefs){const firstDef=Array.isArray(metaDefs)?metaDefs[0]:metaDefs
const fromWedMgr=firstDef.from.wedMgr
const fromEditor=fromWedMgr.wedEditor
if(fromEditor.metaBarMode&&fromEditor.metaBarMode!=="none"){let metaBar=fromEditor.metaBar
if(metaBar&&metaBar.isAlreadyEditing(metaDefs))return null
metaBar=fromEditor.showMetaBar(true)
metaBar.editMeta(metaDefs)
return null}return openMeta(metaDefs)}METAS.showMeta=showMeta
function openMeta(metaDefs){const firstDef=Array.isArray(metaDefs)?metaDefs[0]:metaDefs
const fromWedMgr=firstDef.from.wedMgr
let popup
if(Array.isArray(metaDefs)&&metaDefs.length>0){const tabs=(new Tabs).initialize({areas:metaDefs.map(m=>new MetaEditorTab(m)),areasContext:null,skinOver:"webzone:panel"})
tabs.style.margin=".5em"
tabs.style.flex="1"
popup=POPUP.showDialog(tabs,fromWedMgr.wedEditor.rootNode,{titleBar:{barLabel:{label:"Propriétés"},closeButton:dialogMetasCloseBtn},resizer:{},initWidth:"80vw",initHeight:"60vh",closeOnCtrlEnter:true})}else{const editor=new MetaEditorTab(firstDef).buildBody()
editor.reg.installSkin("webzone:panel",editor.shadowRoot)
editor.wedMgr.listeners.once("redrawAtEnd",wedMgr=>{wedMgr.wedEditor.boxSelMgr.focusFirst(wedMgr.rootWedlet)})
popup=POPUP.showDialog(editor,fromWedMgr.wedEditor.rootNode,{titleBar:{barLabel:{label:"Propriétés : "+firstDef.label},closeButton:dialogMetasCloseBtn},resizer:{},initWidth:"80vw",initHeight:"60vh",closeOnCtrlEnter:true})}popup.addEventListener("wed-editor-root-deleted",()=>{POPUP.showNotifInfo("L\'élément portant ces propriétés a été supprimé.",fromWedMgr.wedEditor.rootNode)
popup.close()})
return popup.onNextClose()}METAS.openMeta=openMeta
async function openMetaNew(wedMgr,docHolder,metaModel,title,parent){const wedMgrConfig=Object.create(wedMgr.config)
wedMgrConfig.readOnlyCauses=Array.from(wedMgr.readOnlyCauses)
wedMgrConfig.xaRoot=[0]
wedMgrConfig.rootModel=metaModel
if(parent&&!WEDLET.isWritableWedlet(parent))wedMgrConfig.readOnlyCauses=["wedletOwner"]
const editorConfig=Object.create(wedMgr.wedEditor.config)
editorConfig.hideDiffBar=true
const newEditor=(new WedEditorBox).initialize(editorConfig)
newEditor.reg.installSkin("webzone:panel",newEditor.shadowRoot)
newEditor.wedModel=wedMgr.wedModel
newEditor.initFromDocHolder(docHolder,wedMgrConfig)
newEditor.wedMgr.listeners.once("redrawAtEnd",wedMgr=>{wedMgr.wedEditor.boxSelMgr.focusFirst(wedMgr.rootWedlet)})
await POPUP.showDialog(newEditor,wedMgr.wedEditor.rootNode,{titleBar:{barLabel:{label:title},closeButton:dialogMetasCloseBtn},resizer:{},initWidth:"80vw",initHeight:"60vh",closeOnCtrlEnter:true}).onNextClose()}METAS.openMetaNew=openMetaNew
const dialogMetasCloseBtn={uiContext:"dialog",label:"Fermer",title:"Fermer l\'édition de ces propriétés (vos modifications sont préservées)"}})(METAS||(METAS={}))
class MetaEditorTab extends Area{constructor(metaDef){super()
this.metaDef=metaDef}getLabel(){return this.metaDef.label}buildBody(){var _a,_b,_c
const fromWedMgr=this.metaDef.from.wedMgr
const editorConfig=Object.create(fromWedMgr.wedEditor.config)
editorConfig.disableVirtuals=fromWedMgr.reg.getPref("wed.metaBar.disableVirtuals",false)
const editor=(new WedEditorBox).initialize(editorConfig)
editor.wedModel=fromWedMgr.wedModel
const newDocHolder=fromWedMgr.docHolderAsync.cloneDocHolder()
const wedMgrConfig=Object.create(fromWedMgr.config)
wedMgrConfig.readOnlyCauses=Array.from(fromWedMgr.readOnlyCauses)
wedMgrConfig.xaRoot=this.metaDef.from.wedAnchor
wedMgrConfig.rootModel=this.metaDef.model
if(!WEDLET.isWritableWedlet(this.metaDef.from))wedMgrConfig.readOnlyCauses=["wedletOwner"]
wedMgrConfig.undoRedoFilter=newDocHolder.isMsgFromUs.bind(newDocHolder)
editor.initFromDocHolder(newDocHolder,wedMgrConfig)
const searchP=(_a=fromWedMgr.wedEditor.searchBar)===null||_a===void 0?void 0:_a.getSearchParams()
if(searchP)(_b=editor.searchBar)===null||_b===void 0?void 0:_b.setSearch(searchP)
const diffP=(_c=fromWedMgr.wedEditor.diffBar)===null||_c===void 0?void 0:_c.getDiffParams()
if(diffP)editor.getDiffBar().then(bar=>{bar.setDiffParams(diffP)})
editor.wedMgr.listeners.on("hidden",(wedMgr,closed)=>{if(closed)wedMgr.killEditor()})
return editor}}
//# sourceMappingURL=metaBar.js.map