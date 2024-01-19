import{BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{BaseAreaViewAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{SpaceTreeDataSearch}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/spaceTree.js"
import{ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{InfoCurrentItem,InfoHighlighItemSgn,InfoReqCurrentItem,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{GridColTreeDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{SearchItems,SearchOr,SearchStatus}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
import{Grid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{CellBuilderSrcIconCodeTitle,redrawSrcLine}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcGridColumns.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
export class Navigator extends BaseAreaViewAsync{constructor(){super(...arguments)
this.shortDescs=[]}get emitter(){return this.grid}get me(){return this}setCurrentItem(srcUri){this._currentSrcUri=srcUri
this.grid.invalidateRows()}async selectSrcUri(srcUri){const rowKey=this.datas.findRowKeyBySrcUri(srcUri)
if(rowKey)this.grid.setSelectedRows(this.datas.getOffset(rowKey))
return rowKey!=null}async selectSrcUris(srcUris){this.grid.setSelectedRows(srcUris.map(srcUri=>this.datas.findRowKeyBySrcUri(srcUri)).filter(rowKey=>rowKey!=null).map(rowKey=>this.datas.getOffset(rowKey)))}async ensureRowVisible(srcUri){const rowKey=this.datas.findRowKeyBySrcUri(srcUri)
if(rowKey)this.grid.ensureRowVisible(this.datas.getOffset(rowKey))
return rowKey!=null}doSearch(){return this.datas.fetchSearchStart(true)}async _initialize(init){var _a
super._initialize(init)
this.wsp=this.reg.env.wsp
this.infoBroker=init.itemHandlingReact
this.emptyTree=init.emptyTree
const fields=this.wsp.getShortDescFields()
this.facets=init.buildFacets?await init.buildFacets(this,fields):new NavigatorFacetText(fields)
this.datas=new NavigatorDatas(this.reg).initNavDatas(this)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.facetRoot=sr.appendChild(JSX.createElement("div",{id:"facetRoot"}))
this.navigatorBtns=JSX.createElement("c-button",{"î":{reg:this.reg,title:"Rafraichir la liste",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/refresh.svg",uiContext:"bar"},onclick:ev=>{this.doSearch()}})
const colDefs=[init.primaryCol||new GridColTreeDef("srcTree").setFlex("1rem",1,1).setMinWidth("55px").setCellBuilder(new CellBuilderSrcIconCodeTitle(this.reg,this.wsp.wspMetaUi,false,this.wsp.srcUriItemsSortFn))]
if(init.secondaryCols)colDefs.push(...init.secondaryCols)
this.grid=sr.appendChild((new Grid).initialize({selType:"multi",columnDefs:colDefs,dataHolder:this.datas,hideHeaders:true,lineDrawer:this.infoBroker?this:null,skinOver:"wsp-navigator/grid",skinScroll:"scroll/small",noResizableCol:true,emptyBody:()=>{if(this.datas.lastError===undefined){return JSX.createElement("c-msg",{label:"Chargement...",level:"info"})}else if(this.datas.lastError===null){return this.emptyTree?this.emptyTree(this):JSX.createElement("c-msg",{label:"Aucun item ne correspond à vos critères",level:"info"})}else{return JSX.createElement("c-msg",{label:"Accès au serveur impossible",level:"error"})}},defaultAction:init.defaultAction,defaultActionCtx:this}))
if(init.secondaryCols)DOM.setAttrBool(this.grid,"data-has-secondary-cols",true)
Object.defineProperty(this.grid,"ctxMenuActions",{get:()=>({actions:this.actions,actionContext:this,rect:this.grid.getSelRect()})})
this.grid.addEventListener("grid-select",(function(ev){const spaceTree=DOMSH.findHost(this)
spaceTree.shortDescs=this.dataHolder.getSelectedDatas()
if(this.matches(":focus"))this.dispatchEvent(new CustomEvent("c-focus-actions",{detail:spaceTree,bubbles:true,composed:true}))}))
this.grid.addEventListener("focus",(function(ev){this.dispatchEvent(new CustomEvent("c-focus-actions",{detail:DOMSH.findHost(this),bubbles:true,composed:true}))}))
this.grid.linesNode.setAttribute("draggable","true")
this.grid.linesNode.addEventListener("dragstart",(function(ev){ITEM.setShortDescTransferToDragSession(DOMSH.findHost(DOMSH.findHost(this)),ev,"build")}))
this.grid.linesNode.addEventListener("dragend",ITEM.resetShortDescTransferToDragSession)
if(init.accelKeyMgr){this.accelKeyMgr=init.accelKeyMgr
this.grid.addEventListener("keydown",ev=>{this.accelKeyMgr.handleKeyboardEvent(ev,this)})}let actions=init.actions
if(!actions&&this.hasAttribute("actions"))actions=this.reg.mergeLists(...BASIS.extractAttr(this,"actions").split(" "))
if(actions){actions=ACTION.injectSepByGroup(actions,this.reg.getPref("groupOrder.wsp.shortDesc",""),this)
this.actions=actions
this.focusActionables=ActionBtn.buildButtons(actions,this,"bar")}(_a=this.reg.env.place)===null||_a===void 0?void 0:_a.eventsMgr.on("wspUriChange",this._onUriChangeLstn=this.onUriChange.bind(this))
this.facets.buildUiFacets(this,init.lastDatas?init.lastDatas[init.area.getId()]:null)
this.datas.fetchSearchStart()}onUriChange(msg,from){this.datas.onUriChange(msg,from)}connectedCallback(){super.connectedCallback()
if(this.infoBroker){this._highlightSgn=null
this._assigned=null
const req=new InfoReqCurrentItem
this.infoBroker.dispatchInfo(req,this)
this.setCurrentItem(req.srcUri||null)
this.infoBroker.addConsumer(this)}}diconnectedCallback(){if(this.infoBroker)this.infoBroker.removeConsumer(this)}onViewHidden(closed){var _a
if(closed)(_a=this.reg.env.place)===null||_a===void 0?void 0:_a.eventsMgr.removeListener("wspUriChange",this._onUriChangeLstn)}onInfo(info){if(info instanceof InfoCurrentItem){this.setCurrentItem(info.srcUri)}else if(info instanceof InfoHighlighItemSgn){this._highlightSgn=info.sgnPattern
this._assigned=info.assigned
this.grid.invalidateRows()}}redrawLine(row,line){redrawSrcLine(this.wsp,row.rowKey,line,this._currentSrcUri,this._highlightSgn,this._assigned)}buildLastDatas(parentLastDatas){var _a
if((_a=this.facets)===null||_a===void 0?void 0:_a.buildLastDatas){const ld={}
this.facets.buildLastDatas(ld)
if(Object.keys(ld).length>0)parentLastDatas[this.area.getId()]=ld}}}REG.reg.registerSkin("wsp-navigator",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tposition: relative;\n\t}\n\n\tc-grid {\n\t\tflex: 1;\n\t\tborder: none;\n\t\tborder-top: 1px solid var(--border-color);\n\t\tbackground-color: var(--row-bgcolor);\n\t}\n`)
REG.reg.registerSkin("wsp-navigator/grid",1,`\n\t.highlight {\n\t\tbackground-color: var(--row-highlight-bgcolor);\n\t}\n\n\t.assigned {\n\t\tbackground-color: var(--row-assigned-bgcolor);\n\t}\n\n\t/** Réservation de la largeur de background-image pour qu'il n'y ait pas de superposition avec les secondary-cols */\n\t:host([data-has-secondary-cols]) .line {\n\t\tpadding-inline-end: .8rem;\n\t}\n\n\t.current {\n\t\tbackground-position: right;\n\t\tbackground-repeat: no-repeat;\n\t\tbackground-image: var(--row-current-img-end);\n\t\tbackground-color: var(--row-current-bgcolor);\n\t}\n\n\t.icon {\n\t\tfilter: var(--filter);\n\t}\n`)
customElements.define("wsp-navigator",Navigator)
class NavigatorDatas extends SpaceTreeDataSearch{initNavDatas(nav){this.hideItemFolderContent=true
this.initSpTrDataSearch(nav.facets,30,50)
return this}onUriChange(msg,from){if(this.wsp.code!==msg.wspCd)return
const node=this.findRowKeyBySrcUri(msg.srcUri)
if(node){if(this.shouldHideEntry(msg,node)){this.deleteRowKey(node)}else{this.refreshRowKey(node)}}}}export class NavigatorFacetBase{constructor(fields){this.stamp=0
this.initSkin()
this.select=JSX.asXml(()=>JSX.createElement("select",null,fields.map(f=>JSX.asXml(()=>JSX.createElement("column",{dataKey:f})))))
this.itemsExp=(new SearchItems).excludeTildeRoot().excludeAirItems(false)}initSkin(){}getStartReq(max){this.select.setAttribute("max",max.toString())
this.itemsExp.afterUri=null
this.itemsExp.beforeEndFolder=null
return this.buildReq()}getNextReq(afterSrcUri,max){this.select.setAttribute("max",max.toString())
this.itemsExp.afterUri=afterSrcUri
this.itemsExp.beforeEndFolder=null
return this.buildReq()}getReplaceFolderReq(folderUri,max){this.select.setAttribute("max",max.toString())
const path=folderUri+"/"
this.itemsExp.afterUri=path
this.itemsExp.beforeEndFolder=path
return this.buildReq()}buildUiFacets(nav,lastDatas){this.initRoot(nav).appendChild(nav.navigatorBtns)}initRoot(nav){if(this.skin){const root=nav.facetRoot
const reg=nav.reg
const sr=root.attachShadow(DOMSH.SHADOWDOM_INIT)
if(Array.isArray(this.skin)){for(const sk of this.skin)reg.installSkin(sk,sr)}else{reg.installSkin(this.skin,sr)}return sr}return nav.facetRoot}getCriterions(){return undefined}buildReq(){return DOM.ser(JSX.asXml(()=>JSX.createElement("request",null,this.select,JSX.createElement("where",null,this.itemsExp.toDom(),this.getCriterions()))))}onChange(ev){const nav=DOMSH.findFlatParentElt(this,null,elt=>elt instanceof Navigator)
nav.facets.stamp++
nav.datas.fetchSearchStart(true)}getStamp(){return this.stamp}isSameStamp(stamp){return stamp===this.stamp}}export class NavigatorFacetText extends NavigatorFacetBase{initSkin(){this.skin="wsp-navigator/facetText"}buildUiFacets(nav,lastDatas){this.initRoot(nav).append(JSX.createElement("div",{class:"h"},this.buildTextInput(nav,lastDatas),nav.navigatorBtns))}buildLastDatas(parentLastDatas){var _a
const txt=(_a=this.textInput)===null||_a===void 0?void 0:_a.value.trim()
if(txt)parentLastDatas.txt=txt}buildTextInput(nav,lastDatas){this.textInput=JSX.createElement("input",{type:"search",spellCheck:"false",onchange:this.onChange,oninput:this.onChange,value:lastDatas===null||lastDatas===void 0?void 0:lastDatas.txt})
return JSX.createElement("label",{id:"txt"},this.textInput)}getCriterions(){return this.getTextCriterion()}getTextCriterion(){if(!this.textInput)return undefined
const v=this.textInput.value.trim().toLowerCase()
if(!v)return undefined
return JSX.asXml(()=>JSX.createElement("exp",{type:"ItemCodeOrTitle",regexp:`(?i).*${LANG.escape4RegexpFuzzy(v)}.*`}))}}REG.reg.registerSkin("wsp-navigator/facetText",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t}\n\n\t:focus {\n\t\toutline: var(--focus-outline);\n\t}\n\n\t.v {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t}\n\n\t.h {\n\t\tdisplay: flex;\n\t\tflex-direction: row;\n\t}\n\n\t#txt {\n\t\tbackground: 0.1em / 1em no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/filter.svg) var(--form-search-bgcolor);\n\t\tpadding-inline-start: 1.2em;\n\t}\n\n\tinput[type=search] {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tpadding: 2px;\n\t\tbackground: var(--form-bgcolor);\n\t\tcolor: var(--form-color);\n\t\tborder: none;\n\t\twidth: 100%;\n\t\tfont-size: inherit;\n\t}\n`)
export class NavigatorFacetItState extends NavigatorFacetText{initFacet(showWarning,showValid,showTextFilter){this.showWarning=showWarning
this.showValid=showValid
this.showTextFilter=showTextFilter
return this}initSkin(){this.skin=["wsp-navigator/facetText","wsp-navigator/facetItSate"]}buildUiFacets(nav,lastDatas){const root=this.initRoot(nav)
root.appendChild(JSX.createElement("div",{id:"itStatesCtn"},this.buildErrorInput(nav,lastDatas),nav.navigatorBtns))
if(this.showTextFilter)root.appendChild(this.buildTextInput(nav,lastDatas))}buildLastDatas(parentLastDatas){var _a,_b
super.buildLastDatas(parentLastDatas)
if(!this.errorCheck.checked)parentLastDatas.err=false
if(!((_a=this.warningCheck)===null||_a===void 0?void 0:_a.checked))parentLastDatas.warn=false
if((_b=this.validCheck)===null||_b===void 0?void 0:_b.checked)parentLastDatas.valid=true}buildErrorInput(nav,lastDatas){this.errorCheck=JSX.createElement("input",{id:"error",type:"checkbox",onchange:this.onChange,checked:(lastDatas===null||lastDatas===void 0?void 0:lastDatas.err)===false?undefined:""})
if(!this.showWarning&&!this.showValid){this.errorCheck.checked=true
return JSX.createElement("div",{id:"itState"})}if(this.showWarning)this.warningCheck=JSX.createElement("input",{id:"warning",type:"checkbox",onchange:this.onChange,checked:(lastDatas===null||lastDatas===void 0?void 0:lastDatas.warn)===false?undefined:""})
if(this.showValid)this.validCheck=JSX.createElement("input",{id:"valid",type:"checkbox",onchange:this.onChange,checked:(lastDatas===null||lastDatas===void 0?void 0:lastDatas.valid)?"":undefined})
const ctn=JSX.createElement("div",{id:"itState"},JSX.createElement("label",{class:"h",id:"error"},this.errorCheck,"Erreur"))
if(this.warningCheck)ctn.appendChild(JSX.createElement("label",{class:"h",id:"warning"},this.warningCheck,"Alerte"))
if(this.validCheck)ctn.appendChild(JSX.createElement("label",{class:"h",id:"valid"},this.validCheck,"Valide"))
return ctn}getCriterions(){var _a,_b,_c
let searchCrit
const min=((_a=this.validCheck)===null||_a===void 0?void 0:_a.checked)?1:((_b=this.warningCheck)===null||_b===void 0?void 0:_b.checked)?2:this.errorCheck.checked?3:99
if(min>=3){searchCrit=new SearchStatus(min,min)}else{const max=this.errorCheck.checked?3:((_c=this.warningCheck)===null||_c===void 0?void 0:_c.checked)?2:1
if(min===1&&max===3){searchCrit=new SearchOr(new SearchStatus(min,min),new SearchStatus(max,max))}else{searchCrit=new SearchStatus(min,max)}}return LANG.pushIfDefined([searchCrit.toDom()],this.getTextCriterion())}}REG.reg.registerSkin("wsp-navigator/facetItSate",1,`\n\t#itStatesCtn, #itState {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t}\n\n\t#itState {\n\t\tflex-wrap: wrap;\n\t}\n\n\t#itState > label {\n\t\tmargin-inline-end: .5em;\n\t\twhite-space: nowrap;\n\t}\n\n\t#error {\n\t\tcolor: var(--error-color);\n\t}\n\n\t#warning {\n\t\tcolor: var(--warning-color);\n\t}\n\n\t#valid {\n\t\tcolor: var(--valid-color);\n\t}\n\n\t#txt {\n\t\tflex: 0;\n\t}\n`)
export const FACET_itStates=(nav,fields)=>new NavigatorFacetItState(fields).initFacet(true,true,true)
export const FACET_itProblems=(nav,fields)=>new NavigatorFacetItState(fields).initFacet(true,false,false)
export const FACET_itErrors=(nav,fields)=>new NavigatorFacetItState(fields).initFacet(false,false,false)

//# sourceMappingURL=navigator.js.map