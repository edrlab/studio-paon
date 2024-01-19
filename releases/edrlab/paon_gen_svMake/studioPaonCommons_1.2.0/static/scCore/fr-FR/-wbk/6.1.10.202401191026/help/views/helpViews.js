import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{BaseElementAsync,BASIS,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{JSX,ShadowJsx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{HELP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/help/helpApi.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{Tabs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tabs.js"
import{GridSmall}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{GridDataHolderJsonArray}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{GridColTreeDef,GridDataHolderJsonTree,MxGridTreeUntouchedDatas}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
export class HelpViews extends BaseElementAsync{constructor(){super(...arguments)
this.liveSyncLocked=false}async _initialize(init){var _a
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg=this.findReg(init)
this.reg.installSkin("help-views/content",sr)
this.reg.installSkin("scroll/small",sr)
this._initAndInstallSkin(this.localName,init)
const msg=sr.appendChild((new MsgLabel).initialize({reg:this.reg,label:"Chargement..."}))
let root=sr
const countTabs=(init.liveView?1:0)+(init.searchView?1:0)+(init.outlineView?1:0)
if(countTabs>1)root=this.tabs=JSX.createElement(Tabs,{class:"noBorder"})
try{this.helpDb=await init.helpDbProv()
if(this.helpDb)await this.helpDb.initIfNeeded()
msg.remove()}catch(e){this.helpDb=null
msg.setCustomMsg("Aide en ligne inaccessible","error")
ERROR.log("Init helpDb failed",e)
return}if(init.liveView){const livePane=root.appendChild(JSX.createElement("div",{id:"livePane",icon:init.liveView.icon||"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/help/liveTab.svg",label:init.liveView.label||"Aide",description:"Aide contextuelle"}))
this.liveHisto=new HelpIdHisto
if(!init.liveView.hideBar){getLiveActions()
this.liveBar=livePane.appendChild(JSX.createElement(BarActions,{"î":{reg:this.reg,actions:getLiveActions(),actionContext:this}}))}this.liveRoot=livePane.appendChild(JSX.createElement("div",{id:"liveRoot"}))
this.livePageTpl=init.liveView.pageTpl||HELP.simpleHelpPageTpl
this.livePageTplOptions=init.liveView.pageTplCtx||{reg:this.reg,helpDb:this.helpDb,openFragId:async(fragId,ev)=>this.showLiveHelpId(fragId),openFrag:async(frag,ev)=>this.showLiveHelp(frag)}}if(init.searchView){const searchPane=root.appendChild(JSX.createElement("div",{id:"searchPane",icon:init.searchView.icon||"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/help/searchTab.svg",label:init.searchView.label||"Rech.",description:"Recherche dans l\'aide"}))
this.searchTextInput=JSX.createElement("input",{id:"searchTextInput",type:"search",placeholder:"Rechercher...",spellcheck:"false",onchange:this.onSearchChange,oninput:this.onSearchChange,onkeydown:this.onSearchKeydown})
searchPane.appendChild(JSX.createElement("label",{id:"searchText",for:"searchTextInput"},this.searchTextInput))
this.searchResults=new GridDataHolderJsonArray
this.searchGrid=JSX.createElement(GridSmall,{id:"searchResults","î":{reg:this.reg,selType:"mono",columnDefs:[new GridColDef("searchHelp").setFlex("10em",1,1).setCellBuilder(new HelpSearchCellBuilder(this.helpDb))],dataHolder:this.searchResults,hideHeaders:true,skinScroll:"scroll/small",skinOver:"help-views/grid",autoSelOnFocus:"first"},"c-resizable":""})
this.searchGrid.addEventListener("grid-select",this.onSearchSelect)
searchPane.appendChild(this.searchGrid)
searchPane.appendChild(JSX.createElement("c-resizer",{"c-orient":"column"}))
this.searchRoot=searchPane.appendChild(JSX.createElement("div",{id:"searchRoot","c-resizable":""}))
this.searchPageTpl=init.searchView.pageTpl||HELP.withCallersHelpPageTpl
this.searchPageTplOptions=init.searchView.pageTplCtx||{reg:this.reg,helpDb:this.helpDb,openFragId:async(fragId,ev)=>this.showSearchHelpId(fragId),openFrag:async(frag,ev)=>{this.showSearchHelp(frag)}}}if((_a=init.outlineView)===null||_a===void 0?void 0:_a.indexKey){const outlinePane=root.appendChild(JSX.createElement("div",{id:"outlinePane",icon:init.outlineView.icon||"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/help/outlineTab.svg",label:init.outlineView.label||"Guide"}))
this.outlineTreeData=new GridDataHelpOutline
this.outlineGrid=JSX.createElement(GridSmall,{id:"outlineTree","î":{reg:this.reg,selType:"mono",columnDefs:[new GridColTreeDef("outlineHelp").setFlex("10em",1,1).setCellBuilder(new HelpOutlineCellBuilder(this.helpDb))],dataHolder:this.outlineTreeData,hideHeaders:true,skinScroll:"scroll/small",skinOver:"help-views/grid"},"c-resizable":""})
this.outlineGrid.addEventListener("grid-select",this.onOutlineSelect)
outlinePane.appendChild(this.outlineGrid)
outlinePane.appendChild(JSX.createElement("c-resizer",{"c-orient":"column"}))
this.outlineRoot=outlinePane.appendChild(JSX.createElement("div",{id:"outlineRoot","c-resizable":""}))
this.outlinePageTpl=init.outlineView.pageTpl||HELP.withCallersHelpPageTpl
this.outlinePageTplOptions=init.outlineView.pageTplCtx||{reg:this.reg,helpDb:this.helpDb,openFragId:async(fragId,ev)=>this.showOutlineHelpId(fragId),openFrag:async(frag,ev)=>{this.showOutlineHelp(frag)}}}if(countTabs>1){root.childNodes.forEach(elt=>elt.hidden=true)
sr.appendChild(root)}if(this.liveRoot){this.liveDefaultFrag=init.liveView.defaultPageId?await this.helpDb.getFragment(init.liveView.defaultPageId):null
this.liveHisto.setCurrent(this.liveDefaultFrag)
this.liveRoot.replaceChildren(this.liveDefaultPage=await this.makePage(this.liveDefaultFrag,this.livePageTpl,this.livePageTplOptions))}if(this.outlineTreeData){const index=await this.helpDb.getIndex(init.outlineView.indexKey)
this.outlineTreeData.setDatas(await index.getMembers(true))}}isLiveSyncLocked(){return this.liveSyncLocked}setLiveSyncLocked(st){if(this.liveSyncLocked!==st){this.liveSyncLocked=st
if(st&&this._showFromSelTask)clearTimeout(this._showFromSelTask)
this.refresh()}}async showLiveHelpId(id,showTab){if(!this.helpDb)return
this.showLiveHelp(await this.helpDb.getFragment(id),showTab)}async showSearchHelpId(id){if(!this.helpDb)return
this.showSearchHelp(await this.helpDb.getFragment(id))}async showOutlineHelpId(id){if(!this.helpDb)return
this.showOutlineHelp(await this.helpDb.getFragment(id))}async showLiveHelp(frag,showTab){var _a,_b
if(!this.helpDb)return
if(showTab)(_a=this.tabs)===null||_a===void 0?void 0:_a.selectTab(this.tabs.findTabFromDesc(this.liveRoot))
if(((_b=this.liveHisto.currentFrag)===null||_b===void 0?void 0:_b.fragId)===(frag===null||frag===void 0?void 0:frag.fragId))return
this.liveHisto.setCurrent(frag)
this.refresh()
return this.buildLiveHelpPage(frag)}async showSearchHelp(frag){if(!this.helpDb)return
return this.buildSearchHelpPage(frag)}async showOutlineHelp(frag){if(!this.helpDb)return
if(frag)this.selectOutlineInGrid(this.outlineTreeData.getDatas(),frag.fragId)
return this.buildOutlineHelpPage(frag)}selectOutlineInGrid(lines,fragId){for(const line of lines){if("frag"in line){if(line.frag.fragId===fragId){this.outlineGrid.setSelectedRows(this.outlineTreeData.getOffset(line))}else{this.selectOutlineInGrid(line.members,fragId)}}else if(line.fragId===fragId){this.outlineGrid.setSelectedRows(this.outlineTreeData.getOffset(line))}}}async showLiveHelpFromSel(idProv){if(this.liveSyncLocked)return
if(this._showFromSelTask)clearTimeout(this._showFromSelTask)
this._showFromSelTask=setTimeout(()=>{this._showFromSelTask=null
this.showLiveHelpId(idProv(),false)},500)}async buildLiveHelpPage(frag){this.liveRoot.replaceChildren(frag===this.liveDefaultFrag?this.liveDefaultPage:await this.makePage(frag,this.livePageTpl,this.livePageTplOptions))}async buildSearchHelpPage(frag){this.searchRoot.replaceChildren(await this.makePage(frag,this.searchPageTpl,this.searchPageTplOptions))}async buildOutlineHelpPage(frag){this.outlineRoot.replaceChildren(await this.makePage(frag,this.outlinePageTpl,this.outlinePageTplOptions))}async makePage(frag,tpl,ctx){if(!frag)return JSX.createElement("div",null)
if(!this.helpDb)return(new MsgLabel).initialize({reg:this.reg,label:"Aide non disponible"})
return tpl(frag,ctx)}async onSearchChange(ev){const me=DOMSH.findHost(this)
const text=me.searchTextInput.value.trim()
if(text===me.searchLastText)return
me.searchLastText=text
if(text){me.searchResults.setDatas(await me.helpDb.search({text:text,max:20}))}else{me.searchResults.setDatas([])}}onSearchKeydown(ev){if(ev.key==="ArrowDown"){const me=DOMSH.findHost(this)
if(me.searchResults.countRows()>0){me.searchGrid.setSelectedRows(0)
me.searchGrid.focus()
ev.stopImmediatePropagation()
ev.preventDefault()}}}onSearchSelect(ev){const rowSel=this.getSelectedRow()
if(rowSel==null)return
const me=DOMSH.findHost(this)
const result=me.searchResults.getRowKey(rowSel)
if(result)me.buildSearchHelpPage(result.found)}onOutlineSelect(ev){const rowSel=this.getSelectedRow()
if(rowSel==null)return
const me=DOMSH.findHost(this)
const entry=me.outlineTreeData.getDataByOffset(rowSel)
if(entry)me.buildOutlineHelpPage("frag"in entry?entry.frag:entry)}_refresh(){var _a;(_a=this.liveBar)===null||_a===void 0?void 0:_a.refresh()}}REG.reg.registerSkin("help-views",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t  min-height: 0;\n\t  min-width: 0;\n\t  flex-direction: column;\n\t  --tab-size: 4em;\n  }\n\n  [hidden] {\n\t  display: none !important;\n  }\n\n  :focus-visible {\n\t  outline: var(--focus-outline);\n  }\n\n  c-tabs {\n\t  flex: 1;\n  }\n\n  #liveRoot {\n\t  padding: .5em;\n\t  overflow: auto;\n  }\n\n  c-bar-actions {\n\t  margin: .3em;\n\t  border-bottom: 1px solid var(--border-color);\n  }\n\n  #liveForward {\n\t  transform: rotate(180deg);\n  }\n\n  #liveBackward:lang(ar) {\n\t  transform: rotate(180deg);\n  }\n\n  #liveForward:lang(ar) {\n\t  transform: none;\n  }\n\n  #livePane,\n  #searchPane,\n  #outlinePane {\n\t  flex: 1;\n\t  display: flex;\n\t  min-width: 0;\n\t  min-height: 0;\n\t  flex-direction: column;\n  }\n\n  #searchText {\n\t  display: block;\n\t  background: .1em / 1em no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/help/searchInput.svg) var(--form-search-bgcolor);\n\t  padding: 2px;\n\t  padding-inline-start: 1.2em;\n\t  border-bottom: 1px solid var(--border-color);\n  }\n\n  #searchTextInput {\n\t  padding: 2px;\n\t  background: var(--form-search-bgcolor);\n\t  color: var(--form-color);\n\t  border: none;\n\t  width: 100%;\n\t  font-size: inherit;\n  }\n\n  input::placeholder {\n\t  color: var(--fade-color);\n\t  letter-spacing: 2px;\n\t  font-size: .8em;\n\t  font-style: italic;\n  }\n\n  input:focus::placeholder {\n\t  color: transparent;\n  }\n\n  #searchResults,\n  #outlineTree {\n\t  flex: 1 1 10em;\n\t  border: none;\n  }\n\n\n  c-resizer {\n\t  height: 1px;\n  }\n\n  #searchRoot,\n  #outlineRoot {\n\t  flex: 1 1 20em;\n\t  padding: .5em;\n\t  overflow: auto;\n  }\n`)
REG.reg.registerSkin("help-views/content",1,`\n\t:host {\n\t\tmax-width: 60vw;\n\t\tuser-select: text;\n\t}\n\n\t.page {\n\t\tpadding: .1em;\n\t}\n\n\t.head {\n\t\tdisplay: flex;\n\t\tjustify-content: end;\n\t\tfont-style: italic;\n\t\tcolor: var(--fade-color);\n\t\tmargin: .2em;\n\t}\n\n\t.headTi {\n\t\tdisplay: block;\n\t\tpadding-inline-start: 1.6em;\n\t}\n\n\t.tag > .headTi {\n\t\tbackground: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/help/fragTypes/tag.svg") no-repeat left / 1.5em;\n\t}\n\n\t.it > .headTi {\n\t\tbackground: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/help/fragTypes/it.svg") no-repeat left / 1.5em;\n  }\n\n  .concept > .headTi {\n\t  background: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/help/fragTypes/concept.svg") no-repeat left / 1.5em;\n  }\n\n  .chapter > .headTi {\n\t  background: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/help/fragTypes/chapter.svg") no-repeat left / 1.5em;\n  }\n\n  .xmlLine {\n\t  margin-inline-start: 2em;\n\t  text-indent: -2em;\n  }\n\n  .xmlLine::first-line {\n\t  margin-inline-start: 0;\n  }\n\n  /*.xmlFork {*/\n  /*\tborder-inline-start: 1px solid var(--border-color);*/\n  /*}*/\n\n  /*.xmlCh {*/\n  /*  margin-top: .1em;*/\n  /*  margin-inline-start: 1em;*/\n  /*  padding-inline-start: 1.5em;*/\n  /*  background: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/help/xmlSub.svg") no-repeat left / 1.2em;*/\n  /*}*/\n\n  a {\n\t  text-decoration: underline;\n\t  cursor: pointer;\n  }\n\n  /* en attente d'un widget codemirror. */\n  pre {\n\t  overflow-x: auto;\n  }\n\n  .imgInline {\n\t  max-height: 2em;\n  }\n\n  .imgBlock {\n\t  max-width: 100%;\n  }\n  \n  code {\n\t\t\tbackground-color: #88888828;\n\t\t\tpadding-inline: 3px;\n  }\n\n  help-zoom {\n\t  text-decoration: underline dotted;\n  }\n`)
customElements.define("help-views",HelpViews)
class HelpIdHisto{constructor(){this.histo=[]
this.currentOffset=0
this.recurs=false}get currentFrag(){return this.histo[this.currentOffset]}hasBack(){return this.currentOffset>0}hasForward(){return this.currentOffset<this.histo.length-1}setCurrent(frag){if(!frag||this.recurs)return
if(this.currentOffset<this.histo.length-1){const after=this.histo.slice(this.currentOffset)
for(let i=after.length-1;i>=0;i--){this.histo[this.currentOffset++]=after[i]}}this.histo.push(frag)
if(this.histo.length>50)this.histo.splice(0,10)
this.currentOffset=this.histo.length-1}goBack(view){if(this.histo.length>0&&this.currentOffset>0){this.recurs=true
try{view.showLiveHelp(this.histo[this.currentOffset-1])
this.currentOffset--
view.refresh()}finally{this.recurs=false}}}goForward(view){if(this.currentOffset<this.histo.length-1){this.recurs=true
try{view.showLiveHelp(this.histo[this.currentOffset+1])
this.currentOffset++
view.refresh()}finally{this.recurs=false}}}}let liveActions
function getLiveActions(){if(liveActions)return liveActions
const liveSyncLock=new Action("liveSyncLock").setLabel("Bloquer la synchronisation de l\'aide contextuelle avec la sélection courante").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/help/liveSyncLock.svg")
liveSyncLock.isToggle=()=>true
liveSyncLock.getDatas=(api,ctx)=>ctx.isLiveSyncLocked()
liveSyncLock.execute=ctx=>ctx.setLiveSyncLocked(!ctx.isLiveSyncLocked())
const liveBackHisto=new Action("livePrev").setLabel("Aide précédente").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/help/back.svg")
liveBackHisto.isEnabled=ctx=>ctx.liveHisto.hasBack()
liveBackHisto.execute=ctx=>ctx.liveHisto.goBack(ctx)
const liveNextHisto=new Action("liveForward").setLabel("Aide suivante").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/help/back.svg")
liveNextHisto.isEnabled=ctx=>ctx.liveHisto.hasForward()
liveNextHisto.execute=ctx=>ctx.liveHisto.goForward(ctx)
return liveActions=[liveSyncLock,liveBackHisto,liveNextHisto]}class GridDataHelpOutline extends(MxGridTreeUntouchedDatas(GridDataHolderJsonTree)){constructor(){super("members")}}class HelpSearchCellBuilder{constructor(helpDb){this.helpDb=helpDb}redrawCell(row,root){const frag=row.rowKey.found
if(frag.isTopic()){root.className=frag.cls||"tag"
root.replaceChildren(frag.makeTitle(null))}else{console.trace("TODO rendition help frags without title")}}getColSortFn(){return null}async openFragId(fragId,ev){return this.openFrag(await this.helpDb.getFragment(fragId),ev)}async openFrag(frag,ev){throw new Error("Method not implemented.")}}class HelpOutlineCellBuilder{constructor(helpDb){this.helpDb=helpDb}redrawCell(row,root){const frag="frag"in row.rowKey?row.rowKey.frag:row.rowKey
if(frag.isTopic()){root.replaceChildren(frag.makeTitle(null))}else{console.trace("? should be topic: ",frag)}}getColSortFn(){return null}async openFragId(fragId,ev){return this.openFrag(await this.helpDb.getFragment(fragId),ev)}async openFrag(frag,ev){throw new Error("Method not implemented.")}}REG.reg.registerSkin("help-views/grid",1,`\n\t.line {\n\t\tpadding: .1em;\n\t}\n\n\t.tag {\n\t\tbackground: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/help/fragTypes/tag.svg") no-repeat left / 1em;\n\t\tpadding-inline-start: 1.1em;\n\t}\n\n\t.it {\n\t\tbackground: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/help/fragTypes/it.svg") no-repeat left / 1em;\n\t\tpadding-inline-start: 1.1em;\n\t}\n\n\t.concept {\n\t\tbackground: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/help/fragTypes/concept.svg") no-repeat left / 1em;\n\t\tpadding-inline-start: 1.1em;\n\t}\n\n\t.chapter {\n\t\tbackground: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/help/fragTypes/chapter.svg") no-repeat left / 1em;\n\t\tpadding-inline-start: 1.1em;\n\t}\n`)
class HelpZoom extends HTMLElement{constructor(){super()
POPUP.promiseTooltip(this,(owner,tooltip)=>{const fragId=this.getAttribute("helpid")
const helpViews=DOMSH.findHost(this)
this.reg=helpViews.reg
this.helpDb=helpViews.helpDb
this.tooltipRoot=JSX.createElement("div",null,JSX.createElement(ShadowJsx,{skin:"help-views/content"}))
helpViews.helpDb.getFragment(fragId).then(frag=>this.makeContent(frag))
return this.tooltipRoot},{hoverAllowed:true,anchor:{elem:this,initWidth:"35em"}})}async openFragId(fragId,ev){const helpViews=DOMSH.findHost(this)
const frag=await helpViews.helpDb.getFragment(fragId)
if(frag)return this.makeContent(frag)}async openFrag(frag,ev){if(frag)return this.makeContent(frag)}async makeContent(frag){const sr=this.tooltipRoot.shadowRoot
BASIS.clearContent(sr)
sr.appendChild(await HELP.simpleHelpPageTpl(frag,this))}}customElements.define("help-zoom",HelpZoom)

//# sourceMappingURL=helpViews.js.map