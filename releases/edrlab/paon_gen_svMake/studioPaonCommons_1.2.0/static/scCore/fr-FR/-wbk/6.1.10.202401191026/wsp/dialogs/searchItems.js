import{BaseElementAsync,BASIS,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{SearchAnd,SearchRequest,StreamedSearch}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
import{SrcGrid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcGrid.js"
import{buildCritAreaFromXml,IS_UiCritWidget,UiCritBool}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/search/uiCrit.js"
import{ItemCritFullText,ItemCritFullWsp,ItemCritInSpace,ItemCritLinks}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/search/itemCrit.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{AppHeader}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/appHeader.js"
import{InfoBrokerBasic}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/infos.js"
import{ItemViewerSingle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemViewerSingle.js"
import{InfoFocusItem,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{WedSearchCoordinator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/searchBar.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{ExportResultCsv_item,ExportResultCsv_task,ExportResultItems}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/searchesActions.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/dialogs_Perms.js"
import{FORMS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
export class SearchItems extends BaseElementAsync{constructor(){super(...arguments)
this.firstMax=30
this.fullMax=2e3}get wsp(){return this.reg.env.wsp}get readonly(){return this._conf.readonly||false}async doSearch(max){var _a,_b,_c,_d
if(!this._searchColumns){this._searchColumns=new Map
this.grid.fillSearchColumns(this._searchColumns)}const req=this._lastReq=new SearchRequest(this._searchColumns).setMax(max+1)
const where=await this.buildWhere()
if(!((_a=where===null||where===void 0?void 0:where.toDom())===null||_a===void 0?void 0:_a.hasChildNodes())){(_b=this.countDisplay)===null||_b===void 0?void 0:_b.setCustomMsg("Veuillez préciser la recherche","info")
this.grid.srcGridDatas.setDatas([])
return}req.setWhere(where)
try{while(this._startReqPending)await this._startReqPending}finally{this._startReqPending=null}if(this._lastReq!==req)return
this.currentMax=max
this.grid.srcGridDatas.setDatas([]);(_c=this.countDisplay)===null||_c===void 0?void 0:_c.setCustomMsg("En cours...")
try{this._startReqPending=this.streamedSearch.search(req).then(()=>{this._startReqPending=null}).catch(e=>{var _a
ERROR.log(e);(_a=this.countDisplay)===null||_a===void 0?void 0:_a.setCustomMsg("Requête en échec","error")
this._startReqPending=null})}catch(e){ERROR.log(e);(_d=this.countDisplay)===null||_d===void 0?void 0:_d.setCustomMsg("Requête en échec","error")}}async buildWhere(){const where=new SearchAnd
if(!this.critRoot)return where
for(let ch=DOM.findFirstChild(this.critRoot,IS_UiCritWidget);ch;ch=DOM.findNextSibling(ch,IS_UiCritWidget)){LANG.pushIfDefined(where,ch.buildCrit())}if(this.searchWhereWrapper)await this.searchWhereWrapper(where,this.reg)
return where}buildWhereXml(){return JSX.asXml(()=>{const root=JSX.createElement("where",null)
if(!this.critRoot)return root
for(let ch=DOM.findFirstChild(this.critRoot,IS_UiCritWidget);ch;ch=DOM.findNextSibling(ch,IS_UiCritWidget)){const sub=ch.buildUiXmlCrit()
if(sub)root.appendChild(sub)}return root})}async viewSearch(whereCrit,searchId,searchLabel,searchDescription){await this.initCrits(whereCrit,true)
return undefined}async _initialize(init){var _a
this._conf=init
const callerReg=this.findReg(init)
this.searchWhereWrapper=init.searchWhereWrapper
if("firstMax"in init)this.firstMax=init.firstMax
if("fullMax"in init)this.fullMax=init.fullMax
if(init.showMainView){this.reg=REG.createSubReg(callerReg)
this.reg.env.infoBroker=new InfoBrokerBasic
this.reg.env.wedSearchCoord=new WedSearchCoordinator}else{this.reg=callerReg}this.criterions="criterions"in init?init.criterions:this.reg.getListAsMap("wsp.crit.items")
this.streamedSearch=new StreamedSearch(this.wsp,(rows,done)=>{var _a,_b,_c,_d,_e,_f,_g,_h,_j,_k,_l,_m
const gridDatas=this.grid.srcGridDatas
gridDatas.updateDatas(gridDatas.countRows(),0,...rows)
if(done){let hideShowMore=true
const count=gridDatas.countRows()
const max=this.currentMax
if(count>max){(_a=this.countDisplay)===null||_a===void 0?void 0:_a.setCustomMsg(((_c=(_b=this._conf)===null||_b===void 0?void 0:_b.msgs)===null||_c===void 0?void 0:_c.resultsMore)?this._conf.msgs.resultsMore(max):`Plus de ${max} items trouvés`)
if(this.currentMax===this.firstMax)hideShowMore=false}else if(count===0){(_d=this.countDisplay)===null||_d===void 0?void 0:_d.setCustomMsg(((_f=(_e=this._conf)===null||_e===void 0?void 0:_e.msgs)===null||_f===void 0?void 0:_f.resultsEmpty)?this._conf.msgs.resultsEmpty:"Aucun item trouvé")}else if(count===1){(_g=this.countDisplay)===null||_g===void 0?void 0:_g.setCustomMsg(((_j=(_h=this._conf)===null||_h===void 0?void 0:_h.msgs)===null||_j===void 0?void 0:_j.resultsOne)?this._conf.msgs.resultsOne:"1 item trouvé")}else{(_k=this.countDisplay)===null||_k===void 0?void 0:_k.setCustomMsg(((_m=(_l=this._conf)===null||_l===void 0?void 0:_l.msgs)===null||_m===void 0?void 0:_m.resultsCount)?this._conf.msgs.resultsCount(count):`${count} items trouvés`)}if(this.searchMoreBtn)this.searchMoreBtn.hidden=hideShowMore}})
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("webzone:panel",sr)
this.reg.installSkin("scroll/small",sr)
this.reg.installSkin("form-control-areas",sr)
this._initAndInstallSkin(this.localName,init)
const editor=sr.appendChild(JSX.createElement("div",{id:"critEditor","c-resizable":""}))
this.critRoot=editor.appendChild(JSX.createElement("div",{id:"critRoot"}))
if(this.readonly){DOM.addClass(editor,"abstract")
this.critAbstract=editor.appendChild(JSX.createElement("div",{id:"critAbstract"}))
DOM.setHidden(this.critRoot,true)}sr.appendChild(JSX.createElement("c-resizer",{"c-orient":"column"}))
if(init.showMainView){const parentMainView=sr.appendChild(JSX.createElement("div",{id:"results","c-resizable":""},JSX.createElement("div",{id:"gridCtn","c-resizable":""},this.buildResults(init)),JSX.createElement("c-resizer",{"c-orient":"row"}),JSX.createElement("div",{id:"mainView","c-resizable":""}))).lastElementChild
this.mainView=new ItemViewerSingle
await this.mainView.initViewer(this.reg,parentMainView,null,null)
this.addEventListener("grid-select",this.onGridSelect)}else{sr.append(...this.buildResults(init))}const initHeader=BASIS.newInit(Object.assign({reg:this.reg,focusListening:this.grid,actionContext:this,mainActions:this.reg.mergeLists(SearchItems.APPBAR_MAIN_ACTIONS),mainBar:{groupOrder:"edit raz lib io *"}},init.appHeader),this.reg)
sr.insertBefore((new AppHeader).initialize(initHeader),editor)
await this.initCrits();(_a=FORMS.findFirstFocusable(this.critRoot))===null||_a===void 0?void 0:_a.focus()
if(this.critRoot)this.critRoot.addEventListener("wsp-uicrit-change",this.doSearch.bind(this,this.firstMax))
this.doSearch(this.firstMax)}buildResults(init){var _a
const initGrid=BASIS.newInit(init.srcGrid,this.reg)
initGrid.hideHeaders=true
if(initGrid.skinScroll===undefined)initGrid.skinScroll="scroll/small"
if(init.showMainView)initGrid.itemHandlingReact=this.reg.env.infoBroker
this.grid=(new SrcGrid).initialize(initGrid)
this.grid.setAttribute("c-resizable","")
const results=[]
if(init.showResultBar!==false){const resultBar=JSX.createElement("div",{id:"resultBar"})
this.countDisplay=resultBar.appendChild(JSX.createElement(MsgLabel,{id:"count"}))
if(this.fullMax>this.firstMax)this.searchMoreBtn=resultBar.appendChild(JSX.createElement(Button,{id:"searchMore","ui-context":"dialog",hidden:"",label:"Voir plus",onclick:this.doSearch.bind(this,this.fullMax)}))
resultBar.appendChild(JSX.createElement(Button,{id:"relaunch","ui-context":"dialog",label:"Relancer",title:"Relancer la recherche",onclick:this.onRelaunch}))
results.push(resultBar)}results.push(this.grid)
if(init.searchStore){this.searchStore=init.searchStore
this.initSearchRequest=init.initSearchRequest
const searchStoreBar=JSX.createElement("div",{id:"searchStore"})
if(init.canEditTitle!==false){const titleElt=JSX.createElement("input",{title:"Nom de la requête",id:"titleReq",value:((_a=this.initSearchRequest)===null||_a===void 0?void 0:_a.title)||""})
if(this.readonly)titleElt.readOnly=true
searchStoreBar.append(JSX.createElement("span",{id:"titleReqCtn"},JSX.createElement("h3",null,"Nom de la requête"),titleElt))}if(!this.readonly)searchStoreBar.appendChild(JSX.createElement(Button,{id:"saveReq","ui-context":"dialog",label:"Enregistrer",title:"Enregistrer cette requête",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/searches/searchesBtn.svg",onclick:this.onSave}))
results.push(searchStoreBar)}return results}async initCrits(definedWhereCrit,doSearch=false){let whereCrit=definedWhereCrit||this.getInitWhereCrit()
if(this.critRoot)this.critRoot.innerText=""
if(this.critRoot&&whereCrit){for(let ch=whereCrit.firstElementChild;ch;ch=ch.nextElementSibling){const critArea=buildCritAreaFromXml(ch,this.criterions)
if(critArea){const crit=await critArea.loadBody(this)
if(crit)this.critRoot.appendChild(await crit.initialize(this).initFromXmlCrit(ch))}}}else if(this._conf.buildCrit){this._conf.buildCrit(this)}else if(this.critRoot){this.critRoot.appendChild(JSX.createElement("h3",null,"Portée"))
if(this._conf.fromSrcUri){if(ITEM.getSrcUriType(this._conf.fromSrcUri)==="space"){const crit=this.critRoot.appendChild(ItemCritInSpace.AREA.buildBody(this))
crit.spaceUri=this._conf.fromSrcUri}else{const crit=this.critRoot.appendChild(ItemCritLinks.AREA_DESC.buildBody(this))
crit.itemPtr.setSrcRef(this._conf.fromSrcUri)}}else{this.critRoot.appendChild(ItemCritFullWsp.AREA.buildBody(this))}this.critRoot.appendChild(JSX.createElement("h3",null,"Critères"))
const rootFilters=this.critRoot.appendChild(UiCritBool.AREA_AND_ROOT.buildBody(this))
if(this._conf.fullTextByDefault)rootFilters.insertCrit(ItemCritFullText.AREA.buildBody(this))}if(this.critAbstract&&whereCrit){this.critAbstract.textContent=""
const desc=UiCritBool.AREA_AND_ROOT.buildAbstract(whereCrit,this)
if(desc)this.critAbstract.appendChild(desc)}if(doSearch)await this.doSearch(this.currentMax)}getInitWhereCrit(){const initReq=this._conf.initSearchRequest
if(!initReq)return null
if(initReq instanceof Element)return initReq
if(initReq.whereCrit)return initReq.whereCrit instanceof Element?initReq.whereCrit:initReq.whereCrit(this)
return null}onGridSelect(ev){if(this.showTimer)clearTimeout(this.showTimer)
if(this.grid.countSelectedRows()===1){this.showTimer=setTimeout(()=>{const sd=this.grid.shortDescs[0]
if(sd){this.reg.env.wedSearchCoord.setParamsOnce(UiCritBool.AREA_AND_ROOT.buildWedSearch(this.buildWhereXml(),this.criterions))
this.reg.env.infoBroker.dispatchInfo(new InfoFocusItem(SRC.srcRef(sd),sd),this)}},500)}}onRelaunch(ev){const me=DOMSH.findHost(this)
me.doSearch(me.firstMax)}onSave(ev){const me=DOMSH.findHost(this)
const search=Object.create(me.initSearchRequest||null)
const inputTi=me.shadowRoot.getElementById("titleReq")
search.title=inputTi?inputTi.value:undefined
search.whereCrit=me.buildWhereXml()
me.searchStore.persistSearch(search)
POPUP.findPopupableParent(me).close()}onClose(ev){const me=DOMSH.findHost(this)
POPUP.findPopupableParent(me).close()}onViewShown(){var _a;(_a=this.mainView)===null||_a===void 0?void 0:_a.onViewShown()}onViewHidden(closed){var _a,_b
if(closed){if(this.showTimer)clearTimeout(this.showTimer);(_a=this.streamedSearch)===null||_a===void 0?void 0:_a.close()}(_b=this.mainView)===null||_b===void 0?void 0:_b.onViewHidden(closed)}}SearchItems.APPBAR_MAIN_ACTIONS="actions:searchItems:bar"
REG.reg.registerSkin("wsp-search-item",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\tc-appheader {\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\t#critEditor {\n\t\tflex: .8 .2 5em;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tpadding: 2px;\n\t}\n\n\t#critEditor.abstract {\n\t\tflex: 0.2;\n\t\ttext-align: center;\n\t\talign-items: center;\n\t}\n\n\t#critAbstract {\n\t\tflex: auto;\n\t\tfont-size: var(--label-size);\n\t}\n\n\t.boolOp, .boolBracket {\n\t\tcolor: var(--alt1-color);\n\t}\n\n\t.critVal {\n\t\tfont-weight: bold;\n\t}\n\n\t#mainView {\n\t\tflex: 1 1 50%;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\tc-resizer[c-orient=row] {\n\t\twidth: 1px;\n\t}\n\n\tc-resizer[c-orient=column] {\n\t\theight: 2px;\n\t}\n\n\t#critRoot {\n\t\tflex: 1;\n\t\toverflow: auto;\n\t\tpadding-inline-start: .6em;\n\t}\n\n\th3 {\n\t\tfont-style: italic;\n\t\tfont-size: 1em;\n\t\tcolor: var(--alt1-color);\n\t\tmargin: 0;\n\t\tmargin-inline-start: -.4em;\n\t\tuser-select: none;\n\t}\n\n\t#results {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex: 1 1 20em;\n\t}\n\n\t#gridCtn {\n\t\tflex: 1 1 20em;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\twsp-src-grid {\n\t\tflex: 1 1 20em;\n\t\tborder-inline: none;\n\t}\n\n\t#resultBar {\n\t\tdisplay: flex;\n\t\tmin-height: fit-content;\n\t\tmin-width: 0;\n\t\tmargin: 2px;\n\t\talign-items: center;\n\t\tjustify-content: center;\n\t\tflex-wrap: wrap;\n\t}\n\t\n\t#titleReqCtn {\n\t\tflex: 1;\n\t  display: flex;\n\t  min-height: fit-content;\n\t  min-width: 0;\n\t  flex-direction: column;\n\t  margin-inline-start: .6em;\n\t  margin-block-end: .5em;\n  }\n\n\t#titleReq {\n\t\tflex: 1;\n\t\tmargin-inline-start: 2px;\n\t}\n\n\t#searchStore {\n\t\tdisplay: flex;\n\t\talign-items: flex-end;\n\t  justify-content: flex-end;\n\t}\n\n\t#count {\n\t\tflex: 0 1 auto;\n\t\tfont-style: italic;\n\t\tmargin: 2px;\n\t\tjustify-content: start;\n\t}\n`)
customElements.define("wsp-search-item",SearchItems)
class ResetRequest extends Action{constructor(){super("resetRequest")
this._label="Réinitialiser le formulaire de recherche"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/reset.svg"
this._group="raz"}isVisible(ctx){if(ctx===null||ctx===void 0?void 0:ctx.readonly)return false
return super.isVisible(ctx)}async execute(ctx,ev){return ctx.initCrits()}}ResetRequest.SINGLETON=new ResetRequest
REG.reg.addToList("actions:searchItems:bar","resetRequest",1,ResetRequest.SINGLETON)
class CopyRequest extends Action{constructor(){super("copyRequest")
this._label="Copier la requête"
this._description="Copier la requête dans le presse-papier"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/copy.svg"
this._group="edit"}async execute(ctx,ev){try{const where=ctx.buildWhereXml()
await navigator.clipboard.writeText(DOM.serializer().serializeToString(where))}catch(e){POPUP.showNotifForbidden("Copie dans le presse-papier impossible. Vérifiez dans votre navigateur que vous avez autorisé ce site à accéder au presse-papier.",ctx)}}}CopyRequest.SINGLETON=new CopyRequest
REG.reg.addToList("actions:searchItems:bar","copyRequest",1,CopyRequest.SINGLETON)
class PasteRequest extends Action{constructor(){super("pasteRequest")
this._label="Coller la requête"
this._description="Coller la requête issue du presse-papier"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/paste.svg"
this._group="edit"}isVisible(ctx){if(ctx===null||ctx===void 0?void 0:ctx.readonly)return false
return super.isVisible(ctx)}async execute(ctx,ev){var _a
let ct
try{ct=await navigator.clipboard.readText()}catch(e){POPUP.showNotifForbidden("Impossible de lire dans le presse-papier. Vérifiez dans votre navigateur que vous avez autorisé ce site à accéder au presse-papier.",ctx)
return}const where=ct?DOM.parseDomValid(`${ct}`,null,"text/xml"):null
if(((_a=where===null||where===void 0?void 0:where.documentElement)===null||_a===void 0?void 0:_a.nodeName)==="where")return ctx.initCrits(where.documentElement,true)
else POPUP.showNotifInfo("Aucune requête n\'a pu être reconnue",ctx)}}PasteRequest.SINGLETON=new PasteRequest
REG.reg.addToList("actions:searchItems:bar","pasteRequest",1,PasteRequest.SINGLETON)
REG.reg.addToList("actions:searchItems:bar:item","exportResultCsv",1,(new ExportResultCsv_item).requireVisiblePerm("ui.searchItems.export.props").setLabel("csv").override("initButtonNode",(buttonNode,ctx)=>{buttonNode._hideLabel=false}))
REG.reg.addToList("actions:searchItems:bar:item","exportResultItems",1,(new ExportResultItems).requireVisiblePerm("ui.searchItems.export.items").setLabel("scwsp").override("initButtonNode",(buttonNode,ctx)=>{buttonNode._hideLabel=false}))
REG.reg.addToList("actions:searchItems:bar:task","exportResultCsv",1,(new ExportResultCsv_task).requireVisiblePerm("ui.searchItems.export.props").setLabel("csv").override("initButtonNode",(buttonNode,ctx)=>{buttonNode._hideLabel=false}))

//# sourceMappingURL=searchItems.js.map