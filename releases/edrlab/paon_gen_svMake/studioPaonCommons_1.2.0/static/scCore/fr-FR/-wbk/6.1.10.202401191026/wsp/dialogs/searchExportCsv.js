import{BaseElementAsync,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX,ShadowJsx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{ESearchExportColumnStatus,SearchRequest}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
import{ActionBtn,Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{AppHeader}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/appHeader.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{ACTION,Action,ActionMenu}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/dialogs_Perms.js"
import{InputOrderedSet}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/inputs.js"
export class SearchExportCsv extends BaseElementAsync{constructor(){super(...arguments)
this.privateUri="/itemSearchesColsCsv.json"
this.bibConfsLists=["confcsv:searchExportCsv:bib"]
this.appHeaderMainActionsLists=[SearchExportCsv.APPBAR_MAIN_ACTIONS]
this._lastSavedConfs_srcDt=-1}get wsp(){return this.reg.env.wsp}async _initialize(init){this.reg=this.reg=REG.createSubReg(this.findReg(init))
this.columns=init.columns
this.buildWhereXmlFct=init.buildWhereXmlFct
if(init.privateUri)this.privateUri=init.privateUri
if(init.bibConfsLists)this.bibConfsLists=init.bibConfsLists
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("webzone:panel",sr)
this.reg.installSkin("standard-dialog",sr)
this._initAndInstallSkin(this.localName,init)
const CsvBiblioActionMenu_actionLists="actions:searchExportCsv:bib:"+this.id
this._csvBiblioMenuAction=(new CsvBiblioActionMenu).setActionLists(CsvBiblioActionMenu_actionLists)
this.reg.addToList(SearchExportCsv.APPBAR_MAIN_ACTIONS,"csvBiblioMenuAction",1,this._csvBiblioMenuAction,10)
this.reg.addToList(CsvBiblioActionMenu_actionLists,"updateCsvConf",1,UpdateCsvConf.SINGLETON,10)
this.reg.addToList(CsvBiblioActionMenu_actionLists,"saveCsvConf",1,SaveCsvConfAs.SINGLETON,20)
let dataSet={}
this.columns.map(col=>{if(col.isAvailable(this)){dataSet[col.getId()]={label:col.getLabel(this),description:col.getDescription(this),icon:col.getIcon(this),notAvailable:col.getExportStatus(this)===ESearchExportColumnStatus.notAvailable}}})
this._headerElt=sr.appendChild((new AppHeader).initialize({reg:this.reg,actionContext:this,mainActions:this.reg.getList(SearchExportCsv.APPBAR_MAIN_ACTIONS),mainBar:{actions:this.reg.mergeLists(...init.appHeaderMainActionsLists),groupOrder:"burger crits io *"}}))
this._titleElt=sr.appendChild(JSX.createElement(MsgLabel,{"î":{label:"",skinOver:"wsp-search-export-csv/msgTitle"}}))
const initInput=Object.assign({dataSet:dataSet,selectionLabel:"Colonnes sélectionnées",availableLabel:"Colonnes disponibles",emptySelectionMsg:"Aucune",previewMode:"asLines"},init.inputEltInit)
this._listColumnsInpt=sr.appendChild((new InputOrderedSet).initialize(initInput))
this._listColumnsInpt.addEventListener("change",ev=>{this._refreshUi()
if(!this.currentDisplayedColsWritable)this.razSpecificColsConf()})
this._exportBtn=JSX.createElement(Button,{label:"Exporter...",class:"default","ui-context":"dialog",onclick:this.onExportBtn})
sr.appendChild(JSX.createElement("footer",{id:"footer"},this._exportBtn,JSX.createElement(Button,{label:"Annuler","ui-context":"dialog",onclick:this.onCancelBtn})))
this.razForm()
this.refresh()}razForm(){let selectedValues=[]
this.columns.map(col=>{if(col.isAvailable(this))if(col.getExportStatus(this)===ESearchExportColumnStatus.exported)selectedValues.push(col.getId())})
this._listColumnsInpt.value=selectedValues
this.razSpecificColsConf()}razSpecificColsConf(){this._titleElt.setCustomMsg(null)
this.currentDisplayedColsConf=null
this.currentDisplayedColsWritable=null}displayBibConf(conf,title,writable=false){if(conf){this.currentDisplayedColsConf=conf
this.currentDisplayedColsWritable=writable
this._listColumnsInpt.value=conf.columns
this._titleElt.setCustomMsg(title||conf.title,"valid")
if(conf.description)this._titleElt.title=conf.description
else delete this._titleElt.title}else{this.razForm()}}refresh(){super.refresh()
CsvBiblioActionMenu.makeActionsList(this._csvBiblioMenuAction,this.bibConfsLists,this).then(()=>{if(this._headerElt)this._headerElt.refresh()
this._refreshUi()})}async _refreshUi(){var _a
this._exportBtn.disabled=!this._listColumnsInpt||!((_a=this._listColumnsInpt.value)===null||_a===void 0?void 0:_a.length)?true:false}async onExportBtn(){const self=DOMSH.findHost(this)
const vals=self._listColumnsInpt.value
if(vals&&vals.length){const wsp=self.reg.env.wsp
const name=IO.getValidFileName(wsp.wspTitle,".csv","date")
const selectedColumns=new Map
await Promise.all(vals.map(async entry=>{const colDef=self.columns.find(col=>col.getId()===entry)
await(colDef===null||colDef===void 0?void 0:colDef.fillSearchColumn(self,selectedColumns))}))
const where=self.buildWhereXmlFct(self)
try{if(where){const url=self.reg.env.universe.config.wsps.searchUrl.resolve(IO.qs("cdaction","Search","param",wsp.code,"format","csv","downloadFileName",name,"addColumnNames",true))
const req=new SearchRequest(selectedColumns).setWhereXml(where)
await IO.saveRespAs(url,self.reg.env.uiRoot,(new Map).set("request",DOM.serializer().serializeToString(req.toDom())),"text/csv","POST")
POPUP.findPopupableParent(this).close()}else return ERROR.show("Requête invalide")}catch(e){return ERROR.log(e)}}}onCancelBtn(){POPUP.findPopupableParent(this).close()}_udateLastSavedConfs(confs,srcDt){srcDt=confs&&srcDt?srcDt:-1
if(srcDt==this._lastSavedConfs_srcDt)return
this._lastSavedConfs=confs
this._lastSavedConfs_srcDt=srcDt
this.refresh()}async savedSearchesCsv(){if(!this._lastSavedConfs)await this._savedSearchesCsvFetch()
if(this._lastSavedConfs){const conf=await this._lastSavedConfs
return conf.searchesCsv}}async _savedSearchesCsvFetch(){try{if(!this.wsp.isAvailable)await this.wsp.waitForAvailable(this)
const resp=await this.wsp.wspServer.config.privateFolderUrl.fetch(IO.qs("cdaction","GetSrc","format","stream","fields","srcDt","param",this.wsp.code,"refUri","","privateUri",this.privateUri),"json")
if(resp.status===200){this._udateLastSavedConfs(resp.asJson,JSON.parse(resp.headers.get("X-SCFIELDS")).srcDt)}else{this._udateLastSavedConfs(null)}return this._lastSavedConfs}catch(e){this._udateLastSavedConfs(null)
ERROR.log("fetchSearches failed",e)}}async saveCurrentBibConf(id,title,silent=false){var _a
if((_a=this._listColumnsInpt.value)===null||_a===void 0?void 0:_a.length){return this._saveBibConf({id:id,title:title,columns:this._listColumnsInpt.value},silent)}else return false}async removeSavedBibConf(id){var _a
if(((_a=this.currentDisplayedColsConf)===null||_a===void 0?void 0:_a.id)===id)this.razForm()
return this._saveBibConf({id:id},true,true)}async persistSearch(search){await this._saveBibConf(search,false)}async _saveBibConf(search,silent=false,remove=false){try{if(!this.wsp.isAvailable)await this.wsp.waitForAvailable(this)
if(!search.id)throw"search must have ID to be saved"
let savedSearch={}
savedSearch.searchesCsv=await this.savedSearchesCsv()||[]
if(remove){savedSearch.searchesCsv=savedSearch.searchesCsv.filter(entry=>entry.id===search.id?false:true)}else{const findCurrentSearch=savedSearch.searchesCsv.find(entry=>entry.id===search.id)
const title=search.title
if(findCurrentSearch){if(silent||await POPUP.confirm(`Voulez-vous vraiment remplacer l\'entrée \'${title}\' existante ?`,null,{okLbl:"Remplacer",cancelLbl:"Annuler"})){findCurrentSearch.title=search.title
findCurrentSearch.columns=search.columns
findCurrentSearch.description=search.description
findCurrentSearch.params=search.params}else return false}else savedSearch.searchesCsv.push(search)}const fields=await this.wsp.wspServer.config.privateFolderUrl.fetchJson(IO.qs("cdaction","PutSrc","format","JSON","fields","srcDt","param",this.wsp.code,"refUri","","privateUri",this.privateUri),{method:"POST",body:JSON.stringify(savedSearch),headers:{"Content-Type":"appplication/json"}})
this._udateLastSavedConfs(Promise.resolve(savedSearch),fields.srcDt)
this.reg.env.universe.wsFrames.ws.postMsg({svc:"liaise",type:SearchExportCsv.LIAISE_MSG_SAVED,uri:this.privateUri})
return true}catch(e){ERROR.log(`Save searches csv to '${this.privateUri}' failed`,e)
POPUP.showNotifError("L\'enregistrement de la configuration des colonnes a échoué.",this)}}onViewShown(){if(!this._onLiaiseMsg){this._onLiaiseMsg=this.onLiaiseMsg.bind(this)
this.reg.env.universe.wsFrames.ws.msgListeners.on("liaise",this._onLiaiseMsg)}if(!this._onConnRenewed){this._onConnRenewed=this.onConnRenewed.bind(this)
this.reg.env.place.eventsMgr.on("onConnectionRenewed",this._onConnRenewed)}}onViewHidden(closed){if(closed){this.reg.env.universe.wsFrames.ws.msgListeners.removeListener("liaise",this._onLiaiseMsg)
this.reg.env.place.eventsMgr.removeListener("onConnectionRenewed",this._onConnRenewed)}}onLiaiseMsg(m){if(m.type===SearchExportCsv.LIAISE_MSG_SAVED&&m.uri===this.privateUri)this._udateLastSavedConfs(null)}async onConnRenewed(){const resp=await this.wsp.wspServer.config.privateFolderUrl.fetch(IO.qs("cdaction","GetSrc","format","JSON","fields","srcDt","param",this.wsp.code,"refUri","","privateUri",this.privateUri),"json")
if(resp.status===200?this._lastSavedConfs_srcDt!==resp.asJson.srcDt:resp.status===404&&this._lastSavedConfs_srcDt!==-1)this._udateLastSavedConfs(null)}}SearchExportCsv.APPBAR_MAIN_ACTIONS="actions:searchExportCsv:bar"
SearchExportCsv.LIAISE_MSG_SAVED="searches.csv.saved"
REG.reg.registerSkin("wsp-search-export-csv",1,`\n\tc-appheader {\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\tc-msg {\n\t\tflex: 0;\n\t\tdisplay: contents;\n\t\ttext-align: center;\n\t}\n\n\tc-msg[hidden] {\n\t\tdisplay: none;\n\t}\n\n\tc-input-ordered-set {\n\t\tflex: 1;\n\t\tmargin: 5px;\n\t}\n`)
REG.reg.registerSkin("wsp-search-export-csv/msgTitle",1,`\n\t.label {\n\t\tcolor: var(--alt1-color);\n\t}\n`)
customElements.define("wsp-search-export-csv",SearchExportCsv)
class ResetForm extends Action{constructor(){super("resetForm")
this._label="Réinitialiser le choix des colonnes"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/reset.svg"
this._group="cols"}async execute(ctx,ev){return ctx.razForm()}}ResetForm.SINGLETON=new ResetForm
REG.reg.addToList(SearchExportCsv.APPBAR_MAIN_ACTIONS,"resetForm",1,ResetForm.SINGLETON)
class SaveCsvConfAs extends Action{constructor(){super("saveCsvConf")
this._label="Enregistrer la configuration sous..."
this._description="Enregistrer la configuration des colonnes courante"
this._group="io"}async execute(ctx,ev){let input=JSX.createElement("input",{type:"text",pattern:".+",id:"idIpt"})
async function showConfirm(){if(await POPUP.confirm(JSX.createElement("div",null,JSX.createElement(ShadowJsx,{skinOver:"form-control-areas"},JSX.createElement("div",{class:"ctrlLbl"},JSX.createElement("label",{class:"lbl",control:"idIpt"},"Libellé :"),input))),null,{okLbl:"Enregistrer",cancelLbl:"Annuler",titleBar:{barLabel:{label:"Enregistrement de la configuration de l\'export CSV"}}})){if(input.value){const result=await ctx.saveCurrentBibConf(input.value,input.value,false)
if(result===false)await showConfirm()}}}await showConfirm()}}SaveCsvConfAs.SINGLETON=new SaveCsvConfAs
class UpdateCsvConf extends Action{constructor(){super("updateCsvConf")
this._label=ctx=>{var _a,_b
const label=((_a=ctx.currentDisplayedColsConf)===null||_a===void 0?void 0:_a.title)||((_b=ctx.currentDisplayedColsConf)===null||_b===void 0?void 0:_b.id)
return`Remplacer la configuration \'${label}\'`}
this._description="Actualiser la configuration actuelle"
this._group="io"}isVisible(ctx){if(!ctx.currentDisplayedColsConf||!ctx.currentDisplayedColsWritable)return false
return super.isVisible(ctx)}async execute(ctx,ev){const result=await ctx.saveCurrentBibConf(ctx.currentDisplayedColsConf.id,ctx.currentDisplayedColsConf.title,true)}}UpdateCsvConf.SINGLETON=new UpdateCsvConf
class CsvBiblioActionMenu extends ActionMenu{static async makeActionsList(csvBiblioAction,listsActsTpls,ctx){let acts
const actionLists=typeof csvBiblioAction._actionLists==="function"?csvBiblioAction._actionLists(ctx,csvBiblioAction):csvBiblioAction._actionLists
acts=actionLists?REG.getReg(ctx).mergeLists(...actionLists.split(" ")):[]
if(listsActsTpls){const elts=ctx.reg.mergeLists(...listsActsTpls)
elts.forEach(entry=>acts.push(new CsvBiblioEntryAction_tpl(entry)))}const savedConfs=await ctx.savedSearchesCsv()
if(savedConfs){savedConfs.forEach(entry=>acts.push(new CsvBiblioEntryAction_saved(entry)))}csvBiblioAction.setActions(ACTION.injectSepByGroup(acts,"* act-saved act-tpls",ctx))}constructor(id){super(id)
this._label="Bibliothèque"
this._group="lists"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/dialogs/searchExportCsv/bibCols.svg"}}class CsvBiblioEntryAction_tpl extends Action{constructor(colSetDef){super(colSetDef.id)
this.colSetDef=colSetDef
this._label=colSetDef.title
this._description=colSetDef.description
this._group="act-tpls"}execute(ctx,ev){const title=this.colSetDef.title
ctx.displayBibConf(this.colSetDef,title?`Bibliothèque : ${title}`:null,false)}}class CsvBiblioEntryAction_saved extends Action{constructor(colSetDef){super(colSetDef.id)
this.colSetDef=colSetDef
this._label=colSetDef.title
this._description=colSetDef.description
this._skinOver="search-export-csv/saved/entry"
this._group="act-saved"}execute(ctx,ev){const title=this.colSetDef.title
ctx.displayBibConf(this.colSetDef,title?`Personnelle : ${title}`:null,true)}initButtonNode(buttonNode,ctx){super.initButtonNode(buttonNode,ctx)
const title=this.colSetDef.title
buttonNode.appendChild(ActionBtn.buildButton((new Action).setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/delete.svg").setLabel(`Supprimer la configuration : ${title}`).setExecute((ctx,ev)=>{ctx.removeSavedBibConf(this.getId())
DOM.setHidden(buttonNode,true)
if(ev){ev.stopImmediatePropagation()
ev.preventDefault()}}),ctx,"bar"))}}REG.reg.registerSkin("search-export-csv/saved/entry",1,`\n\tslot {\n\t\tposition: absolute;\n\t\tright: 0;\n\t\tdisplay: block;\n\t}\n\n\n\t/*:host{\n\t\tdisplay: flex;\n\t\tflex-direction: row-reverse;\n\t}\n\n  span{\n\t\tflex:1;\n\t}\n\t\n\tslot {\n\t\tborder : 5px solid yellow;\n\t}*/\n\n`)

//# sourceMappingURL=searchExportCsv.js.map