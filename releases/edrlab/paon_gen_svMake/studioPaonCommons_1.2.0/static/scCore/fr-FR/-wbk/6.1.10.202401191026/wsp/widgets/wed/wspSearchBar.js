import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{SearchBarPanelAction,SearchPanelBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/searchBar.js"
import{SrcPointer,SrcPointerErase,SrcPointerFastSelect,SrcPointerPaste}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcDrawer.js"
import{SkCommentSearch,SkItemSearch}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/wed/schemaMetaWsp.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{isSkSearchAnnot}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaSearch.js"
import{EWedletEditMode,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
class ItemSearchAction extends SearchBarPanelAction{constructor(id,maxResults){super(id||"item")
this.maxResults=maxResults||300
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/search/linkSearch.svg"
this._label="Parcourir les liens"
this._description="Chercher les liens vers les items"}buildPanel(ctx,ev){return(new ItemSearchPanel).initPanel(this,ctx)}}REG.reg.addToList("wed.searchBar.actions","item",1,new ItemSearchAction,50)
class ItemSearchPanel extends SearchPanelBase{initPanel(action,bar){this._initPanel(action,bar,true)
this.findPtr=(new SrcPointer).initialize({reg:this.reg,defaultAction:SrcPointerFastSelect.SINGLETON,actionsLists:["actions:wsp:wed:itemSearch","actions:wsp:shortDesc"],accelKeysLists:["accelkeys:wsp:wed:itemSearch","accelkeys:wsp:shortDesc"],draggable:true,dropable:true})
this.findPtr.title="Lien vers un item particulier"
this.findPtr.onSrcRefChange.add(this.onChange)
this.searchBar.append(this.findPtr,this.nav,this.result)
return this}setSearch(params){if(params.findRef!=null)this.findPtr.setSrcRef(params.findRef)
this.execSearch()
if(params.repRef!==undefined){this.showReplaceBar(true)
this.repPtr.setSrcRef(params.repRef)}}buildSearch(){return{searchId:this.action.getId(),findRef:this.findPtr.srcRef,repRef:this.replaceBarShown?this.repPtr.srcRef:undefined}}buildReplaceBar(){this.repPtr=(new SrcPointer).initialize({reg:this.reg,defaultAction:SrcPointerFastSelect.SINGLETON,actionsLists:["actions:wsp:wed:itemSearch","actions:wsp:shortDesc"],accelKeysLists:["accelkeys:wsp:wed:itemSearch","accelkeys:wsp:shortDesc"],draggable:true,dropable:true})
this.repPtr.title="Remplacer par cet item"
this.repPtr.onSrcRefChange.add(this.onRepChange)
this.repBtn=JSX.createElement(Button,{label:"Remplacer",onclick:this.onReplace,disabled:true})
this.repAllBtn=JSX.createElement(Button,{label:"Tout remplacer",onclick:this.onReplaceAll,disabled:true})
this.replaceBar.append(this.repPtr,this.repBtn,this.repAllBtn)}onChange(srcPtr){const me=DOMSH.findHost(srcPtr)
me.execSearch()
DOMSH.findHost(me).dispatchSearchChange()}onRepChange(srcPtr){const me=DOMSH.findHost(srcPtr)
const disabled=!srcPtr.srcRef
me.repBtn.disabled=disabled
me.repAllBtn.disabled=disabled}onReplace(){const me=DOMSH.findHost(this)
const repBy=me.repPtr.srcRef
if(!repBy)return
const annot=me.nav.getLastSelectedAnnot()
if(annot){const wedMgr=me.wedMgr
const start=XA.freeze(annot.start)
const startWedlet=WEDLET.findWedlet(wedMgr.rootWedlet,start,{lastAncestorIfNone:true})
if(startWedlet&&WEDLET.resolveEditMode(startWedlet)===EWedletEditMode.write){const batch=me.wedMgr.docHolder.newBatch(me.wedMgr.getCurrentSel())
batch.setAttr(start,repBy)
batch.setSelAfter(start)
batch.doBatch()}else{POPUP.showNotifForbidden("Contenu non modifiable",this,null,{viewPortX:"middle",viewPortY:"1/3"})}}me.nav.gotoAnnot(1)}onReplaceAll(){const me=DOMSH.findHost(this)
const repBy=me.repPtr.srcRef
if(!repBy)return
const wedMgr=me.wedMgr
const batch=wedMgr.docHolder.newBatch(wedMgr.getCurrentSel())
const annots=wedMgr.lastSkAnnots
let lastAn
for(let i=annots.length-1;i>=0;i--){const an=annots[i]
if(isSkSearchAnnot(an)){const start=XA.freeze(an.start)
const startWedlet=WEDLET.findWedlet(wedMgr.rootWedlet,start,{lastAncestorIfNone:true})
if(startWedlet&&WEDLET.resolveEditMode(startWedlet)===EWedletEditMode.write)batch.setAttr(start,repBy)
if(!lastAn)lastAn=an}}if(lastAn){batch.setSelAfter(lastAn.start)
batch.doBatch()}else{me.nav.gotoAnnot(1)}}execSearch(){if(!this.wedMgr)return
if(this.wedMgr.docHolder.setSkSearch(new SkItemSearch(this.findPtr.srcRef,this.action.maxResults)).length===0){this.updateCount(0)}}connectDoc(wedMgr){super.connectDoc(wedMgr)
this.findPtr.focus()}}function addAction(action,accel){REG.reg.addToList("actions:wsp:wed:itemSearch",action.getId(),1,action)
if(accel)REG.reg.addToList("accelkeys:wsp:wed:itemSearch",accel,1,action)}addAction(SrcPointerFastSelect.SINGLETON,"Enter")
addAction(SrcPointerPaste.SINGLETON,"v-accel")
addAction(new SrcPointerErase,"Delete")
customElements.define("wed-searchbar-item",ItemSearchPanel)
class CommentSearchAction extends SearchBarPanelAction{constructor(id,maxResults){super(id||"comment")
this.maxResults=maxResults||300
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/search/commentSearch.svg"
this._label="Parcourir les commentaires"}buildPanel(ctx,ev){return(new CommentSearchPanel).initPanel(this,ctx)}}REG.reg.addToList("wed.searchBar.actions","comment",1,new CommentSearchAction,100)
class CommentSearchPanel extends SearchPanelBase{initPanel(action,bar){this._initPanel(action,bar,false)
this.opened=JSX.createElement("input",{type:"checkbox",onchange:this.onChange,checked:""})
this.closed=JSX.createElement("input",{type:"checkbox",onchange:this.onChange,checked:""})
this.shadowRoot.append(this.nav,JSX.createElement("div",{class:"options"},JSX.createElement("label",null,this.opened,"Ouverts"),JSX.createElement("label",null,this.closed,"Clos")),this.result)
return this}setSearch(params){if(typeof params.opened==="boolean")this.opened.checked=params.opened
if(typeof params.closed==="boolean")this.closed.checked=params.closed
this.execSearch()}buildSearch(){return{searchId:this.action.getId(),opened:this.opened.checked,closed:this.closed.checked}}onChange(){const panel=DOMSH.findHost(this)
if(!panel.opened.checked&&!panel.closed.checked){if(this===panel.opened){panel.closed.checked=true}else{panel.opened.checked=true}}panel.execSearch()
DOMSH.findHost(panel).dispatchSearchChange()}execSearch(){if(!this.wedMgr)return
if(this.wedMgr.docHolder.setSkSearch(new SkCommentSearch(this.opened.checked,this.closed.checked,this.action.maxResults)).length===0){this.updateCount(0)}}}customElements.define("wed-searchbar-comment",CommentSearchPanel)

//# sourceMappingURL=wspSearchBar.js.map