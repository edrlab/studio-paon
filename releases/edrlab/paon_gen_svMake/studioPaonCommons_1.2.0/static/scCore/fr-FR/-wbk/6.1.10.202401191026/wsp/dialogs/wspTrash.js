import{BaseElementAsync,MsgOver}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{WSP,Wsp}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{InfoBrokerBasic}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/infos.js"
import{ESrcSt,SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{ESearchItemSrcTypes,SearchItemSrcType,SearchLastModif,SearchLastUser,SearchRegexpUri,SearchRequest}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{EFolderState,GridColTreeDef,GridDataHolderJsonTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{CellBuilderSrcIconCode}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcGridColumns.js"
import{SrcGrid,SrcGridDatas}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcGrid.js"
import{AccelKeyMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{InputPeriod}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/inputPeriod.js"
import{SpaceTreeReqUri}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/spaceTree.js"
import{InfoFocusItem,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{MoveToSrc,SrcAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{AppHeader}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/appHeader.js"
import{EItemTypeFamily}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{ItemViewerSingle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemViewerSingle.js"
import{ESrcRights}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/security.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{InputUserPanel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/inputs.js"
import{EUserType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
export class WspTrash extends BaseElementAsync{constructor(){super(...arguments)
this.maxEntries=2e4
this.critDirty=false
this.spaceRoot=SRC.URI_ROOT}get wsp(){return this.reg.env.wsp}get shortDescs(){return this._grid.shortDescs}get emitter(){return this}setSpaceRoot(root){if(!root)root=SRC.URI_ROOT
if(this.spaceRoot!=root){this.spaceRoot=root
this._spaceRootBtn.label=ITEM.extractSpaceLabel(this.spaceRoot)
this.setCritDirty()}}setCritDirty(){if(!this.critDirty){this.critDirty=true
this.resetList()}}async _initialize(init){this.reg=REG.createSubReg(this.findReg(init))
this._initReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("webzone:panel",sr)
this._initAndInstallSkin(this.localName,init)
this.infoBroker=this.reg.env.infoBroker
this._spaceRootBtn=JSX.createElement(Button,{id:"spaceRoot","î":{reg:this.reg,label:ITEM.extractSpaceLabel(SRC.URI_ROOT),uiContext:"dialog",title:"Sélectionner un espace..."},onclick:this.onChooseSpace})
this._removedBy=(new InputUserPanel).initialize({required:false,reg:this.reg,emptySelectionMsg:"Choisir un compte...",userCard:"multi",usersGridInit:{usersSrv:this.reg.env.universe.useUsers,grid:{selType:"multi"},filterType:EUserType.user,filterTypeInputVisibility:true}})
await this._removedBy.initializedAsync
this._inputTxt=JSX.createElement("input",{id:"codeFilter",type:"search",spellcheck:"false"})
this._inputPeriod=new InputPeriod
this._inputPeriod.title="Période dans laquelle les contenus ont été mis en corbeille"
this._inputRecursive=JSX.createElement("input",{id:"recursive",type:"checkbox"})
this._searchBtn=JSX.createElement(Button,{id:"search","î":{reg:this.reg,label:"Rechercher",uiContext:"dialog"},onclick:this.doSearch.bind(this)})
const gridDatas=new SrcGridDatas
gridDatas.useLiveSrcUri=true
this._grid=(new WspTrashGrid).initialize({reg:this.reg,itemHandlingReact:this.infoBroker,actions:this.reg.getList("actions:wspTrash:shortDesc"),accelKeyMgr:(new AccelKeyMgr).initFromMapActions(this.reg.getListAsMap("accelkeys:wspTrash:shortDesc")),hideHeaders:true,skinOver:"wsp-src-grid",skinScroll:"scroll/small",dataHolder:gridDatas,emptyBody:()=>{if(this.critDirty)return this._searchBtn
if(this._fetching||this._waitingExec)return JSX.createElement("c-msg",{label:"Recherche dans la corbeille...",level:"info"})
if(this._lastError)return JSX.createElement("c-msg",{label:"Erreur au chargement",level:"error"})
return JSX.createElement("c-msg",{label:"Aucun contenu en corbeille trouvé",level:"info"})}})
this._treedatas=new WspTrashTreeDatas(this.wsp,this.wsp.getShortDescFields(),gridDatas)
this._grid.setCategorizer(this,this._treedatas)
this._grid.setAttribute("c-resizable","")
this._appHeader=sr.appendChild((new AppHeader).initialize({reg:this.reg,focusListening:this._grid,actionContext:this,forceSharedBar:true}))
sr.appendChild(JSX.createElement("div",{id:"crit",onchange:this._onCritChange,oninput:this._onCritChange},JSX.createElement("label",null,JSX.createElement("span",null,"Espace de recherche"),this._spaceRootBtn),JSX.createElement("label",null,JSX.createElement("span",null,"Filtre sur le code"),this._inputTxt," ",JSX.createElement("span",null,"Supprimé par"),this._removedBy),JSX.createElement("label",null,JSX.createElement("span",null,"Date de mise en corbeille"),this._inputPeriod," ",this._inputRecursive,JSX.createElement("span",null,"Recherche dans les espaces supprimés"))))
if(init.selectLiveSrcUri){this._inputTxt.value=init.selectLiveSrcUri
this._inputRecursive.checked=true
this._srcUriToSelOnInit=init.selectLiveSrcUri}this._fetchRootDatas()
if(init.showMainView){const parentMainView=JSX.createElement("div",{id:"srcView","c-resizable":""})
sr.appendChild(JSX.createElement("div",{id:"main"},this._grid,JSX.createElement("c-resizer",{"c-orient":"row"}),parentMainView))
this._mainView=new ItemViewerSingle
await this._mainView.initViewer(this.reg,parentMainView,null,null)
this.addEventListener("grid-select",this._onGridSelect)}else{sr.appendChild(this._grid)}}_initReg(init){const wspFrom=this.reg.env.wsp
const wsp=this.reg.env.wsp=new Wsp(wspFrom.wspServer,wspFrom.code,wspFrom.infoWsp,wspFrom.wspMetaUi)
this._initWspReg(wsp)
if(init.showMainView){this.reg.env.infoBroker=new InfoBrokerBasic}this.reg.addToList("actions:item:burger","copy",2,null)
this.reg.addToList("actions:item:burger","restoreTo",1,new RestoreToAction)}_initWspReg(wsp){wsp.reg.addToList("srcFields:shortDesc","srcLiveUri",1,"srcLiveUri")
wsp.reg.addToList("srcFields:shortDesc","srcTrashed",1,"srcTrashed")
if(wsp.wspDefProps.drvAxis){wsp.reg.addToList("srcFields:shortDesc","drvAxisDefCo",1,"drvAxisDefCo")}}visitViews(visitor,options){return VIEWS.visitNodes(visitor,options,this._mainView)}visitViewsAsync(visitor,options){return VIEWS.visitNodesAsync(visitor,options,this._mainView)}onViewShown(){if(!this.place){this.reg.env.wsp.listenChanges()
this.place=this.reg.env.place=this.reg.env.wsp.newPlaceWsp()
this.place.eventsMgr.on("onConnectionLost",()=>{this._appHeader.setHeadband("Votre connexion au serveur est interrompue ou instable.","error")})
this.place.eventsMgr.on("onConnectionRenewed",()=>{this._appHeader.setHeadband(null)})
this.place.eventsMgr.on("wspLiveStateChange",this.onWspLiveStateChange.bind(this))}VIEWS.onViewShown(this._mainView)}onViewHidden(closed){if(closed&&this.place){this.reg.env.wsp.stopListenChanges()
this.place.closePlace()
this.place=null}VIEWS.onViewHidden(this._mainView)}onWspLiveStateChange(wsp){if(wsp!==this.wsp)return
if(wsp.isAvailable){this._initWspReg(wsp)
if(this.msgOver){this.msgOver.removeMsg()
this.msgOver=null}this.resetList()
this._fetchRootDatas()}else if(wsp.isInError){POPUP.findPopupableParent(this).close()}else if(!this.msgOver){this.msgOver=(new MsgOver).showMsgOver(this).setCustomMsg("Reconfiguration de l\'atelier en cours...")}}fetchRootDatas(){return this._fetchRootDatas()}async _fetchRootDatas(){if(WSPTRASH_DEBUG)console.log("WspTrash.fetchRootDatas:::start")
this._lastError=undefined
try{const requ=this._getRequest()
if(WSPTRASH_DEBUG)console.log("WspTrash.fetchRootDatas:::request",requ.where.toDom())
this._fetching=WSP.fetchSearchJson(this.wsp,this._grid,requ.toXml())
const datas=await this._fetching
this._fetching=null
this._lastError=null
if(WSPTRASH_DEBUG)console.log("WspTrash.fetchRootDatas:::datas",datas)
if(datas.length>this.maxEntries){const maxEntries=this.maxEntries
POPUP.showNotifInfo(`Plus de ${maxEntries} éléments trouvés en corbeille. Utilisez les critères de recherche pour restreindre la liste.`,this)}this._lastError=null
this._grid.srcGridDatas.setDatas(datas)
if(this._srcUriToSelOnInit){const srcUri=this._srcUriToSelOnInit
this._srcUriToSelOnInit=null
const rowKey=this._grid.srcGridDatas.findRowKeyBySrcUri(srcUri)
if(rowKey)this._grid.setSelectedRows(this._grid.srcGridDatas.getOffset(rowKey))}}catch(e){this._fetching=null
this._lastError=e
console.log(e)
this._grid.srcGridDatas.setDatas([])}finally{if(WSPTRASH_DEBUG)console.log("WspTrash.fetchRootDatas:::end")}}doSearch(){this.critDirty=false
if(this._waitingExec)return
this._fetchRootDatas()}resetList(){this._lastError=null
this._grid.srcGridDatas.setDatas([])}_getRequest(){var _a
const where=new SearchNodesInTrash(this.spaceRoot,-1,this._inputRecursive.checked,null,new SearchItemSrcType(ESearchItemSrcTypes.SPACE|ESearchItemSrcTypes.ITEMFOLDER|ESearchItemSrcTypes.ITEMFILE),((_a=this._removedBy.value)===null||_a===void 0?void 0:_a.length)?new SearchLastUser(this._removedBy.value):undefined,this._inputTxt.value?new SearchRegexpUri(SpaceTreeReqUri.buildSrcUriPattern(this._inputTxt.value)):undefined,SearchLastModif.buildFromInputPeriod(this._inputPeriod))
return new SearchRequest(this.wsp.getShortDescDef()).setWhere(where).setMax(this.maxEntries+1)}_onCritChange(){DOMSH.findHost(this).setCritDirty()}async onChooseSpace(ev){const wspTrash=DOMSH.findHost(this)
const{SpaceSelector:SpaceSelector}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/spaceSelector.js")
const ct=(new SpaceSelector).initialize({reg:wspTrash.reg,startSel:wspTrash.spaceRoot,spaceTree:{showRoot:true},selOnDblClick:true})
const space=await POPUP.showMenuFromEvent(ct,ev,wspTrash).onNextClose()
if(space)wspTrash.setSpaceRoot(space.srcUri)}_onGridSelect(ev){if(this._showTimer)clearTimeout(this._showTimer)
const count=this._grid.countSelectedRows()
if(count===0){this.reg.env.infoBroker.dispatchInfo(new InfoFocusItem(null),this)}else if(count===1){this._showTimer=setTimeout(()=>{let sd=this._grid.shortDescs[0]
if(sd){switch(ITEM.getSrcUriType(sd.srcLiveUri||sd.srcUri)){case"space":sd=null
break
case"res":sd=this._treedatas.getRowKeyParent(sd)
while(ITEM.getSrcUriType(sd.srcUri)!=="item")sd=this._treedatas.getRowKeyParent(sd)}if(sd&&(!this._mainView.longDesc||this._mainView.longDesc.srcUri!==sd.srcUri)){this.reg.env.infoBroker.dispatchInfo(new InfoFocusItem(sd.srcUri,sd),this)}}},500)}}getId(data){return data.srcLiveUri||data.srcUri}getAncestorIds(data){let parent=SRC.extractUriParent(data.srcLiveUri||data.srcUri)
if(!parent)return null
const stack=[]
while(parent){stack.push(parent)
parent=SRC.extractUriParent(parent)}stack.reverse()
return stack}wrapForTree(data){const e=Object.assign(Object.create(null),data)
if(this.wsp.wspMetaUi.getItemType(data.itModel).getFamily()===EItemTypeFamily.res){if(ITEM.getSrcUriType(data.srcUri)==="res")return null}else if(!e.ch){if(data.srcSt===ESrcSt.folder){e.ch=null}}if(ITEM.isTrashUri(data.srcUri)){e.srcRi=ESrcRights.READS|ESrcRights.remove|ESrcRights.removeChildren|ESrcRights.move}else{e.srcRi=ESrcRights.READS|ESrcRights.removeChildren}return e}getFolder(id){switch(ITEM.getSrcUriType(id)){case"space":return{srcUri:id}
case"item":case"res":return{srcUri:id,itModel:"sc_undef"}}return null}shouldRemoveEmptyFolder(folder){return false}}REG.reg.registerSkin("wsp-trash",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t#crit {\n\t\tborder-top: 1px solid var(--border-color);\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tpadding: .5em;\n\t}\n\n  label {\n\t  display: flex;\n\t  align-items: center;\n\t  margin: .2em 0;\n  }\n\n  #spaceRoot,\n  #codeFilter,\n  c-input-period,\n  c-input-users-panel,\n  #recursive {\n\t  margin: 0 .5em;\n  }\n\n  #spaceRoot {\n\t  padding-inline-end: 1.2em;\n\t  background-size: 1em 1em;\n\t  background-repeat: no-repeat;\n\t  background-position: right;\n\t  background-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/dropdown.svg);\n\t  font-weight: bold;\n  }\n\n  input {\n\t  padding: 2px;\n\t  background: var(--form-bgcolor);\n\t  color: var(--form-color);\n\t  border: 1px solid var(--border-color);\n\t  display: flex;\n\t  flex: 1;\n\t  font-size: inherit;\n  }\n\n  input:focus {\n\t  outline: var(--focus-outline);\n  }\n\n  input::placeholder {\n\t  color: var(--fade-color);\n\t  letter-spacing: 2px;\n\t  font-size: .8em;\n\t  font-style: italic;\n  }\n\n  input:focus::placeholder {\n\t  color: transparent;\n  }\n\n  c-input-period {\n\t  border: 1px solid var(--border-color);\n\t  border-radius: 3px;\n\t}\n\n\t#recursive {\n\t\tflex: 0;\n\t}\n\n\t#main {\n\t\tflex: 1 1 20em;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tborder-top: 1px solid var(--border-color);\n\t}\n\n\twsp-trash-grid {\n\t\tflex: 1;\n\t\tborder: none;\n\t\tbackground-color: var(--row-bgcolor);\n\t}\n\n\t#srcView {\n\t\tflex: 1 1 50%;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tborder-inline-start: 1px solid var(--border-color);\n\t}\n`)
customElements.define("wsp-trash",WspTrash)
class WspTrashGrid extends SrcGrid{get wspTrash(){return DOMSH.findHost(this)}getDefaultColumnDefs(){return[new GridColTreeDef("srcTree").setDefaultSort(1,"ascendant").setFlex("1rem",1,1).setMinWidth("55px").setSortable(true).setCellBuilder(new CellBuilderSrcIconCode(this.reg,this.wsp.wspMetaUi,false,this.wsp.srcUriItemsSortFn))]}redrawLine(row,line){super.redrawLine(row,line)
line.classList.toggle("trashed",row.getData("srcTrashed")===true)}isParentInTrash(child){const parent=this.dataHolder.getRowKeyParent(child)
return parent?ITEM.isTrashUri(parent.srcUri):false}}REG.reg.registerSkin("wsp-trash-grid",1,`\n\t.trashed {\n\t\ttext-decoration-line: line-through;\n\t\ttext-decoration-color: var(--fade-color);\n\t}\n`)
customElements.define("wsp-trash-grid",WspTrashGrid)
class WspTrashTreeDatas extends GridDataHolderJsonTree{constructor(wsp,srcFields,srcGridDatas){super("ch")
this.wsp=wsp
this.srcFields=srcFields
this.srcGridDatas=srcGridDatas
this.setDefaultOpenState(d=>d.ch!=null)}async openFolderAsync(rowKey){if(this.ch(rowKey)===null){try{if(WSPTRASH_DEBUG)console.log("WspTrashTreeDatas.openFolderAsync:::start",rowKey.srcUri)
if(this.folderSt(rowKey)!==EFolderState.closed)return false
this.setFolderSt(rowKey,EFolderState.opening)
const datas=await WSP.fetchSearchJson(this.wsp,this._grid,(new SearchRequest).addFieldColumns(...this.srcFields).setWhere(new SearchNodesInTrash(rowKey.srcUri,-1)).toXml())
if(!this.isRowkeyAlive(rowKey))return false
this.setFolderSt(rowKey,EFolderState.closed)
if(WSPTRASH_DEBUG)console.log("WspTrashTreeDatas.openFolderAsync::::datas:",datas)
if(datas.length>0){this.srcGridDatas.updateDatas(this.srcGridDatas.getDatas().length,0,...datas)}else{this.setCh(rowKey,datas)}return this.openFolder(rowKey)}catch(e){POPUP.showNotifError("Accès au serveur impossible",this.grid)
this.closeFolder(rowKey)
throw e}finally{if(WSPTRASH_DEBUG)console.log("WspTrashTreeDatas.openFolderAsync:::end",rowKey.srcUri)}return false}return this.openFolder(rowKey)}}class SearchNodesInTrash{constructor(path,depth,recursiveTrash,afterUri,...filters){this.path=path
this.depth=depth
this.recursiveTrash=recursiveTrash
this.afterUri=afterUri
this.filters=filters}toDom(){return JSX.createElement("exp",{type:"NodesInTrash",path:this.path,depth:this.depth,recursiveTrash:this.recursiveTrash,afterUri:this.afterUri},this.filters?this.filters.map(f=>f?f.toDom():undefined):undefined)}}class RestoreAction extends SrcAction{constructor(){super("restore")
this._label="Restaurer"
this._group="edit"
this.atLeastOne=true
this.isNotRemoved=false
this._enableSrcPerms=["restore.history"]
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/wspRestore.svg"}isEnabled(ctx){if(ctx.shortDescs.some(s=>!s.srcTrashed||ctx.isParentInTrash(s)))return false
return super.isEnabled(ctx)}async execute(ctx,ev){const uris=ctx.shortDescs.map(s=>s.srcUri)
try{await WSP.srcRestore(ctx.wsp,ctx,uris)}catch(e){ERROR.report("Une erreur est survenue durant la restauration",e)}}}class RestoreToAction extends MoveToSrc{constructor(){super("restoreTo")
this._label="Restaurer vers..."
this._titlePopup="Restaurer vers..."
this._moveButtonLabel="Restaurer"
this.isNotRemoved=false
this._enableSrcPerms=["restore.history","write.node.moveFrom"]
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/wspRestoreTo.svg"}isVisible(ctx){if(ctx.shortDescs.some(s=>!ITEM.isTrashUri(s.srcUri)||ITEM.getSrcUriType(s.srcUri)==="res"))return false
return super.isVisible(ctx)}isEnabled(ctx){return super.isEnabled(ctx)}async execute(ctx,ev){if(ctx.shortDescs.length===1){this.targetFolder=SRC.extractUriParent(ctx.shortDescs[0].srcLiveUri)}const srcUris=await super.execute(ctx,ev)
if(!srcUris)return null
const srcsToRestore=(await WSP.fetchSrcs(ctx.wsp,ctx,srcUris,["srcUri","srcSt"])).filter(s=>s.srcSt===ESrcSt.none)
if(srcsToRestore.length>0)await WSP.srcRestore(ctx.wsp,ctx,srcsToRestore.map(s=>s.srcUri))
await ctx.wspTrash.fetchRootDatas()
return srcUris}}class DeletePermAction extends SrcAction{constructor(){super("deletePerm")
this._label="Supprimer définitivement"
this._group="del"
this.atLeastOne=true
this._enableSrcPerms=["deletePermanently.trash"]
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/wspDeletePermanently.svg"}isEnabled(ctx){const wspDefProps=ctx.reg.env.wsp.wspDefProps
if(ctx.shortDescs.some(sd=>{if(this.isSrcLayered(wspDefProps,sd))return true
return!ITEM.isTrashUri(sd.srcUri)}))return false
return super.isEnabled(ctx)}async execute(ctx,ev){const count=ctx.shortDescs.length
if(await POPUP.confirm(count===1?"Confirmez la suppression définitive.":`Confirmez la suppression définitive de ces ${count} éléments.`,ctx,{okLbl:"Supprimer définitivement"})){const uris=ctx.shortDescs.map(s=>s.srcUri)
try{await WSP.srcDeletePermanently(ctx.wsp,ctx,uris)}catch(e){ERROR.report("Une erreur est survenue durant la suppression définitive.",e)}}}}function addAction(action,accel,sortKey){REG.reg.addToList("actions:wspTrash:shortDesc",action.getId(),1,action,sortKey)
if(accel)REG.reg.addToList("accelkeys:wspTrash:shortDesc",accel,1,action)}addAction(new RestoreAction)
addAction(new RestoreToAction)
addAction(new DeletePermAction)
const WSPTRASH_DEBUG=false

//# sourceMappingURL=wspTrash.js.map