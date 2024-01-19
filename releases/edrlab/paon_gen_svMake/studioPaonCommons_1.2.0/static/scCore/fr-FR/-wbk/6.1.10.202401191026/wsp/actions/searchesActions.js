import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/actions_Perms.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{Action,ActionMenu}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
export class ExportResultItems extends Action{constructor(){super("exportResultItems")
this._label="Exporter les items trouvés (.scwsp)"
this._description="Créer une archive avec les items trouvés"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/dialogs/searchItems/exports.svg"
this._group="io"
this.requireEnabledPerm("action.searches#export.items")}async execute(ctx,ev){const wsp=ctx.reg.env.wsp
const name=IO.getValidFileName(wsp.wspTitle,".scwsp","date")
const where=ctx.buildWhereXml()
const url=ctx.reg.env.universe.config.wsps.searchUrl.resolve(IO.qs("cdaction","Search","param",wsp.code,"format","scwsp","downloadFileName",name))
IO.saveRespAs(url,ctx.reg.env.uiRoot,(new Map).set("request",DOM.serializer().serializeToString(where)),"application/scenari.scwsp","POST")}}export class ExportResultCsv_item extends Action{constructor(){super("exportResultCsv-item")
this._label="Exporter les propriétés des items trouvés (.csv)"
this._description="Créer un CSV avec les propriétés des items trouvés"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/dialogs/searchItems/exports.svg"
this._group="io"
this.requireEnabledPerm("action.searches#export.props")}async execute(ctx,ev){const{SearchExportCsv:SearchExportCsv}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/searchExportCsv.js")
const initHeader=BASIS.newInit({reg:ctx.reg,privateUri:"/itemSearchesColsCsv.json",bibConfsLists:["confcsv:searchExportCsv:bib","confcsv:searchExportCsv:bib:item"],buildWhereXmlFct:ctxfct=>ctx.buildWhereXml(),appHeaderMainActionsLists:[SearchExportCsv.APPBAR_MAIN_ACTIONS,"actions:searchExportCsv:bar:item"],columns:await Promise.all(ctx.reg.mergeLists("columns:wspApp:searches-export","columns:wspApp:searches-export:item"))},ctx.reg)
return POPUP.showDialog((new SearchExportCsv).initialize(initHeader),ctx.reg.env.uiRoot,{titleBar:{barLabel:{label:"Export CSV de la recherche"}},fixSize:false,resizer:{}}).onNextClose()}}export class ExportResultCsv_task extends Action{constructor(){super("exportResultCsv-task")
this._label="Exporter les propriétés des tâches trouvées (.csv)"
this._description="Créer un CSV avec les propriétés des tâches trouvées"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/dialogs/searchItems/expCsv.svg"
this._group="io"
this.requireEnabledPerm("action.searches#export.props")}async execute(ctx,ev){const{SearchExportCsv:SearchExportCsv}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/searchExportCsv.js")
const initHeader=BASIS.newInit({reg:ctx.reg,privateUri:"/taskSearchesColsCsv.json",bibConfsLists:["confcsv:searchExportCsv:bib","confcsv:searchExportCsv:bib:task"],buildWhereXmlFct:ctxfct=>ctx.buildWhereXml(),appHeaderMainActionsLists:[SearchExportCsv.APPBAR_MAIN_ACTIONS,"actions:searchExportCsv:bar:task"],columns:await Promise.all(ctx.reg.mergeLists("columns:wspApp:searches-export","columns:wspApp:searches-export:task"))},ctx.reg)
return POPUP.showDialog((new SearchExportCsv).initialize(initHeader),ctx.reg.env.uiRoot,{titleBar:{barLabel:{label:"Export CSV de la recherche"}},fixSize:false,resizer:{}}).onNextClose()}}export class TplRequestsMenu extends ActionMenu{constructor(acts){super("tplRequestsMenu")
this._label="Bibliothèque de requêtes"
this._group="lib"
this._actions=acts
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/dialogs/searchItems/bibRequests.svg"}isVisible(ctx){if(!this._actions.length)return false
return super.isVisible(ctx)}static makeFromSearchPersistLists(ctx,...lists){const elts=ctx.reg.mergeLists(...lists)
const actions=[]
elts.forEach(entry=>actions.push(new TplRequestAction(entry.id,entry.title,entry.whereCrit,entry.description)))
return new TplRequestsMenu(actions)}}export class TplRequestAction extends Action{constructor(id,title,whereXml,description){super(id)
this.title=title
this.whereXml=whereXml
this.description=description
this._searchId=id
this._label=title
this._description=description}async execute(ctx,ev){const where=this.whereXml instanceof Element?this.whereXml:this.whereXml(ctx)
return this._searchId=await ctx.viewSearch(where,this._searchId,this.getLabel(ctx),this.getDescription(ctx))}}
//# sourceMappingURL=searchesActions.js.map