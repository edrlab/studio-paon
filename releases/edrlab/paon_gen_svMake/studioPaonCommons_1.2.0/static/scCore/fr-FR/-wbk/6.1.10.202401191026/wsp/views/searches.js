import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{BaseAreaView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{Tabs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tabs.js"
import{SimpleTagArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{FocusItem}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{SearchRequest}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
import{UiCritBool}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/search/uiCrit.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{SrcGrid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcGrid.js"
import{BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{AccelKeyMgr,Action,ActionMenuDep}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/search/itemCrit.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/search/taskCrit.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{ExportResultCsv_item,ExportResultCsv_task,ExportResultItems}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/searchesActions.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/views_Perms.js"
export class Searches extends BaseAreaView{constructor(){super(...arguments)
this.srcDt=-1}async persistSearch(search){if(!this.available)this.available=this._fetchSearches()
await this.available
const promise=this._addOrUpdateTab(search.whereCrit instanceof Element?search.whereCrit:search.whereCrit(this),search.id,search.title,search.description,true,true)
this._saveSearches()
return promise}async _addOrUpdateTab(whereCrit,searchId,searchLabel,searchDescription,persist=false,select=false){var _a
const tab=searchId?this.tabs.getTabByCode(searchId):null
if(tab){tab.area.setWhereCrit(whereCrit)
tab.area.setLabel(searchLabel)
tab.refresh()
if(tab.view)tab.view.refresh()
if(select)await this.tabs.selectTab(tab)}else{if(!searchId)searchId=this.newId()
const currentTabId=(_a=this.tabs.selectedTab)===null||_a===void 0?void 0:_a.id
if(persist){let persistTabs=this.tabs.findTabs(tab=>tab.area instanceof SearchResultPersistArea)||[]
await this.tabs.addTab(new SearchResultPersistArea({title:searchLabel,whereCrit:whereCrit,id:searchId},this.resultsOptions).setDescription(searchDescription),{select:select,position:persistTabs.length})
const newTab=this.tabs.getTabByCode(searchId)
DOM.addClass(newTab,"reqPersistant")}else await this.tabs.addTab(new SearchResultArea(searchId,this.resultsOptions).setLabel(searchLabel).setDescription(searchDescription).setWhereCrit(whereCrit),{select:select,position:this.tabs._tabs.childElementCount})}}async viewSearch(whereCrit,searchId,searchLabel,searchDescription){if(!searchId)searchId=this.newId()
await this._addOrUpdateTab(whereCrit,searchId,searchLabel,searchDescription,false,true)
return searchId}async deleteSearch(id){const tab=this.tabs.getTabByCode(id)
if(!tab)return false
if(!(tab.area instanceof SearchResultPersistArea)||await POPUP.confirm("Confirmez la suppression de cette recherche",this,{okLbl:"Supprimer"})){if(await this.tabs.closeTab(tab,true,true))await this._saveSearches()}return true}newId(){let id
do{id=Math.abs(Math.random()*99999).toString(36)}while(this.tabs.getTabByCode(id)!=null)
return id}_initialize(init){super._initialize(init)
this.wsp=this.reg.env.wsp
this.criterions=init.criterions
this.resultsOptions=init.results
this.privateUri=init.privateUri
this.kind=init.kind||"item"
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.tabs=sr.appendChild(JSX.createElement(Tabs,{id:"tabs","î":{reg:this.reg,areasContext:this,skinOver:"wsp-searches/tabs"}}))
this.tabs._initTab=function(tab){tab.movable=this.movable
tab.onclick=this._onClickTab
tab._createLabel()
tab._labelElt.ondblclick=tab.areaContext.onDblclickTab
tab.shadowRoot.appendChild(tab.areaContext._newDelButton())}
this.tabs.appendChild(JSX.createElement(BarActions,{slot:"tools-end","î":Object.assign({reg:this.reg,actionContext:this,uiContext:"bar"},init.barActionsInit)}))}_newDelButton(){return JSX.createElement(Button,{onclick:this.onRemoveTab,"tabindex-custom":"-1",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/close.svg","ui-context":"bar",title:"Supprimer cette recherche"})}onDblclickTab(ev){ev.preventDefault()
ev.stopImmediatePropagation()
const tab=DOMSH.findHost(this)
editSearch(tab.area,tab.areaContext,tab,tab.areaContext.kind)}onRemoveTab(ev){ev.preventDefault()
ev.stopImmediatePropagation()
const tab=DOMSH.findHost(this)
tab.areaContext.deleteSearch(tab.code)}buildWhereXml(){var _a
return((_a=this.tabs.selectedTab)===null||_a===void 0?void 0:_a.area).getWhereCrit(this)}async _fetchSearches(){try{if(!this.wsp.isAvailable)await this.wsp.waitForAvailable(this)
const orderedTabs=this.tabs.areas&&this.tabs.areas.length>0?[]:null
const resp=await this.wsp.wspServer.config.privateFolderUrl.fetch(IO.qs("cdaction","GetSrc","format","stream","fields","srcDt","param",this.wsp.code,"refUri","","privateUri",this.privateUri),"json")
if(resp.status===200){this.srcDt=JSON.parse(resp.headers.get("X-SCFIELDS")).srcDt
const savedSearch=resp.asJson
if(savedSearch&&savedSearch.searches)for(const search of savedSearch.searches){if(!search)continue
const doc=DOM.parseDomValid(search.whereXml)
if(!doc)continue
if(orderedTabs)orderedTabs.push(search.id)
this._addOrUpdateTab(doc.documentElement,search.id,search.title,null,true,false)}}else{this.srcDt=-1}if(orderedTabs){this.tabs.areas.forEach(entry=>{if(!(entry instanceof SearchResultPersistArea))orderedTabs.push(entry.getId())})
this.tabs.reorderTabs(true,...orderedTabs)}}catch(e){this.srcDt=-1
ERROR.log("fetchSearches failed",e)}}async _saveSearches(){try{const searches=[]
this.tabs.areas.forEach(area=>{if(area instanceof SearchResultPersistArea)searches.push({id:area.getId(),title:area.getLabel(this),whereXml:DOM.ser(area.getWhereCrit(this))})})
const fields=await this.wsp.wspServer.config.privateFolderUrl.fetchJson(IO.qs("cdaction","PutSrc","format","JSON","fields","srcDt","param",this.wsp.code,"refUri","","privateUri",this.privateUri),{method:"POST",body:JSON.stringify({searches:searches}),headers:{"Content-Type":"application/json"}})
this.srcDt=fields.srcDt
this.reg.env.universe.wsFrames.ws.postMsg({svc:"liaise",type:"searches.saved",uri:this.privateUri})}catch(e){ERROR.log(`Save searches to '${this.privateUri}' failed`,e)
POPUP.showNotifError("Les modifications de votre liste de recherches n\'ont pas pu être enregistrées.",this)}}visitViews(visitor,options){this.tabs.visitViews(visitor,options)}visitViewsAsync(visitor,options){return this.tabs.visitViewsAsync(visitor,options)}onViewHidden(closed){this._shown=false
if(closed){this.reg.env.universe.wsFrames.ws.msgListeners.removeListener("liaise",this._onLiaiseMsg)
this.reg.env.place.eventsMgr.removeListener("onConnectionRenewed",this._onConnRenewed)}}onViewShown(){this._shown=true
if(!this._onLiaiseMsg){this._onLiaiseMsg=this.onLiaiseMsg.bind(this)
this.reg.env.universe.wsFrames.ws.msgListeners.on("liaise",this._onLiaiseMsg)}if(!this._onConnRenewed){this._onConnRenewed=this.onConnRenewed.bind(this)
this.reg.env.place.eventsMgr.on("onConnectionRenewed",this._onConnRenewed)}if(!this.available)this.available=this._fetchSearches()}onSyncLost(){if(this._shown){this.available=this._fetchSearches()}else{this.available=null}}onLiaiseMsg(m){if(m.type==="searches.saved"&&m.uri===this.privateUri)this.onSyncLost()}async onConnRenewed(){const resp=await this.wsp.wspServer.config.privateFolderUrl.fetch(IO.qs("cdaction","GetSrc","format","JSON","fields","srcDt","param",this.wsp.code,"refUri","","privateUri",this.privateUri),"json")
if(resp.status===200?this.srcDt!==resp.asJson.srcDt:resp.status===404&&this.srcDt!==-1)this.onSyncLost()}}REG.reg.registerSkin("wsp-searches",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t#tabs {\n\t\tflex: 1;\n\t}\n`)
REG.reg.registerSkin("wsp-searches/tabs",1,`\n\t#panels {\n\t\tborder-inline-start: none;\n\t\tborder-inline-end: none;\n\t\tborder-bottom: none;\n\t}\n\n\tc-tab {\n\t\tfont-size: var(--label-size);\n\t}\n\n\t#head {\n\t\tmin-height: 2em;\n\t}\n\n\tc-tab:not(.reqPersistant) {\n\t\tfont-style: italic;\n\t}\n`)
customElements.define("wsp-searches",Searches)
export class SearchResultArea extends SimpleTagArea{constructor(id,options,init){super("wsp-search-result",null,id)
this.conf=init||{}
this.options=options||{}
if(!this.options.max)this.options.max=2e3}setWhereCrit(whereCrit){this.whereCrit=whereCrit
return this}getWhereCrit(ctx){return this.whereCrit instanceof Element?this.whereCrit:this.whereCrit(ctx)}newElt(ctx,lastDatas){const elt=super.newElt(ctx,lastDatas)
elt.initialize(Object.assign({reg:ctx.reg,area:this,areaContext:ctx},this.conf))
return elt}}export class SearchResultPersistArea extends SearchResultArea{constructor(persist,options){super(persist.id)
this.persist=persist
this.options=options
if(!this.options.max)this.options.max=2e3
this.whereCrit=persist.whereCrit}getLabel(ctx){const ovrLabel=typeof this._label==="function"?this._label(ctx,this):this._label
return ovrLabel||this.persist.title||"..."}getPersist(ctx){this.persist.whereCrit=this.whereCrit
this.persist.title=this.getLabel(ctx)
return this.persist}}export class SearchResult extends BaseAreaView{_initialize(init){const conf=Object.assign({editable:true},init)
super._initialize(conf)
this.wsp=this.reg.env.wsp
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("scroll/small",sr)
this._initAndInstallSkin(this.localName,init)
const head=sr.appendChild(JSX.createElement("div",{id:"header"}))
this._abstract=head.appendChild(JSX.createElement(Button,{id:"abstract",onclick:this.onEdit}))
this._abstract.disabled=!conf.editable
this._found=head.appendChild(JSX.createElement("span",{id:"found"}))
this._bar=head.appendChild(JSX.createElement(BarActions,{id:"bar","î":{reg:this.reg,actionContext:this,actions:this.area.options.barActions}}))
const initGrid=BASIS.newInit(this.area.options.srcGrid,this.reg)
if(initGrid.skinScroll===undefined)initGrid.skinScroll="scroll/small"
this._grid=sr.appendChild((new SrcGrid).initialize(initGrid))}_refresh(){super._refresh()
if(!DOM.nodeEquals(this._currentWhere,this.area.getWhereCrit(this.areaContext))){this._abstract.textContent=null
const descTxt=this.area.getDescription(this.areaContext)
if(descTxt)this._abstract.textContent=descTxt
else{const desc=UiCritBool.AREA_AND_ROOT.buildAbstract(this.area.getWhereCrit(this.areaContext),this.areaContext)
if(desc)this._abstract.appendChild(desc)}this._grid.refresh()
this._bar.refresh()
this.doSearch()}}async doSearch(){var _a,_b,_c,_d
this._grid.srcGridDatas.setDatas([])
this._found.textContent="En cours..."
const currentWhere=this.buildWhereXml()
try{if(!this._searchColumns){this._searchColumns=new Map
this._grid.fillSearchColumns(this._searchColumns)}const req=new SearchRequest(this._searchColumns).setMax(this.area.options.max+1).setWhereXml(currentWhere)
const results=await WSP.fetchSearchJson(this.wsp,this,req.toXml())
const count=results.length
const max=this.area.options.max
this._grid.srcGridDatas.setDatas(results)
if(results.length===0)this._found.textContent=((_a=this.area.options.msgs)===null||_a===void 0?void 0:_a.resultsEmpty)?this.area.options.msgs.resultsEmpty:"Aucun item trouvé"
else if(results.length===1)this._found.textContent=((_b=this.area.options.msgs)===null||_b===void 0?void 0:_b.resultsOne)?this.area.options.msgs.resultsOne:"1 item trouvé"
else if(results.length>this.area.options.max)this._found.textContent=((_c=this.area.options.msgs)===null||_c===void 0?void 0:_c.resultsMore)?this.area.options.msgs.resultsMore(max):`Plus de ${max} items trouvés`
else this._found.textContent=((_d=this.area.options.msgs)===null||_d===void 0?void 0:_d.resultsCount)?this.area.options.msgs.resultsCount(count):`${count} items trouvés`
this._currentWhere=currentWhere}catch(e){this._found.textContent="Échec"
ERROR.log(`Do search failed: ${DOM.ser(currentWhere)}`,e)}}buildWhereXml(){return this.area.getWhereCrit(this.areaContext)}async viewSearch(whereCrit,searchId,searchLabel,searchDescription){console.warn("not implemented")
return undefined}setWedSearch(){const coord=this.reg.env.wedSearchCoord
if(coord&&this._currentWhere){coord.setParamsOnce(UiCritBool.AREA_AND_ROOT.buildWedSearch(this._currentWhere,this.areaContext.criterions)||null)}}onEdit(){if(this.disabled)return
const me=DOMSH.findHost(this)
editSearch(me.area,me.areaContext,me,me.areaContext.kind)}}export class FocusItemSetWedSearch extends FocusItem{execute(ctx,ev){const searchRes=DOMSH.findHost(ctx)
searchRes.setWedSearch()
super.execute(ctx,ev)}}REG.reg.registerSkin("wsp-search-result",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t#header {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\talign-items: center;\n\t}\n\n\t#abstract {\n\t\tflex: 1;\n\t\toverflow: auto;\n\t\tmax-height: 2.6em;\n\t\talign-items: start;\n\t\tfont-size: var(--label-size);\n\t}\n\n\t#found {\n\t\tfont-weight: bold;\n\t\tborder-inline-start: 1px solid var(--border-color);\n\t\tborder-inline-end: 1px solid var(--border-color);\n\t\tpadding: 0 .5em;\n\t}\n\n\twsp-src-grid {\n\t\tflex: 1;\n\t}\n\n\t.boolOp, .boolBracket {\n\t\tcolor: var(--alt1-color);\n\t}\n\n\t.critVal {\n\t\tfont-weight: bold;\n\t}\n\n`)
customElements.define("wsp-search-result",SearchResult)
async function editSearch(search,ctx,from,kind="item"){const{SearchItems:SearchItems}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/searchItems.js")
const{TplRequestsMenu:TplRequestsMenu}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/searchesActions.js")
const forcedSearchRequest=search instanceof SearchResultPersistArea?search.getPersist(ctx):search.getWhereCrit(ctx)
if(!forcedSearchRequest)if(kind==="item")ctx.reg.addToList("actions:searchItems:bar:item","tplRequestsMenu",1,TplRequestsMenu.makeFromSearchPersistLists(ctx,"requests:item","requests:item:searchItems:item"))
else ctx.reg.addToList("actions:searchItems:bar:task","tplRequestsMenu",1,TplRequestsMenu.makeFromSearchPersistLists(ctx,"requests:task","requests:item:searchItems:task"))
const ct=(new SearchItems).initialize({reg:ctx.reg,showMainView:true,srcGrid:{actions:kind==="item"?ctx.reg.mergeLists("actions:wsp:shortDesc","actions:searchItem:shortDesc:item"):ctx.reg.mergeLists("actions:wsp:shortDesc:task","actions:searchItem:shortDesc:task"),accelKeyMgr:(new AccelKeyMgr).initFromMapActions(kind==="item"?ctx.reg.mergeListsAsMap("accelkeys:searchItem:shortDesc","accelkeys:wsp:shortDesc:item"):ctx.reg.mergeListsAsMap("accelkeys:wsp:shortDesc:task","accelkeys:wsp:shortDesc:task"))},criterions:ctx.criterions,appHeader:{mainActions:ctx.reg.mergeLists(SearchItems.APPBAR_MAIN_ACTIONS,kind==="item"?"actions:searchItems:bar:item":"actions:searchItems:bar:task")},searchStore:search instanceof SearchResultPersistArea?ctx:null,msgs:kind==="item"?undefined:{resultsMore:max=>`Plus de ${max} tâches trouvées`,resultsEmpty:"Aucune tâche trouvée",resultsOne:"1 tâche trouvée",resultsCount:count=>`${count} tâches trouvées`},canEditTitle:search instanceof SearchResultPersistArea?true:false,initSearchRequest:forcedSearchRequest})
const searchTitle=search.getLabel(ctx)
POPUP.showDialog(ct,from,{titleBar:{barLabel:{label:kind==="item"?searchTitle?`Édition de la recherche d\'items \'${searchTitle}\'`:"Édition de la recherche d\'items":searchTitle?`Édition de la recherche de tâches \'${searchTitle}\'`:"Édition de la recherche de tâches"},closeButton:{}},resizer:{},viewPortX:"middle",viewPortY:"middle",initWidth:"90vw",initHeight:"90vh"})}REG.reg.addToList("actions:wspApp:searches","refresh",1,new Action("refresh").setLabel("Recommencer la recherche").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/refresh.svg").setExecute(ctx=>{ctx.doSearch()}),10)
REG.reg.addToList("actions:wspApp:searches:item","mainburger",1,new ActionMenuDep("mainburger").setLabel("Actions complémentaires sur la recherche").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/hamburger.svg").setActionLists("actions:wspApp:searches:item:mainburger").setGroup("burger"),1e4)
REG.reg.addToList("actions:wspApp:searches:item:mainburger","actionExportResultItems",1,(new ExportResultItems).requireVisiblePerm("ui.searches.export.items"))
REG.reg.addToList("actions:wspApp:searches:item:mainburger","actionExportResultCsv",1,(new ExportResultCsv_item).requireVisiblePerm("ui.searches.export.props"))
REG.reg.addToList("actions:wspApp:searches:task","mainburger",1,new ActionMenuDep("mainburger").setLabel("Actions complémentaires sur la recherche").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/hamburger.svg").setActionLists("actions:wspApp:searches:task:mainburger"),1)
REG.reg.addToList("actions:wspApp:searches:task:mainburger","actionExportResultCsv",1,(new ExportResultCsv_task).requireVisiblePerm("ui.searches.export.props"))
REG.reg.addToList("actions:wspApp:searches","del",1,new Action("del").setLabel("Supprimer").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/delete.svg").setExecute(ctx=>{const searches=DOMSH.findHost(ctx)
searches.deleteSearch(ctx.area.getId())}),9999)

//# sourceMappingURL=searches.js.map