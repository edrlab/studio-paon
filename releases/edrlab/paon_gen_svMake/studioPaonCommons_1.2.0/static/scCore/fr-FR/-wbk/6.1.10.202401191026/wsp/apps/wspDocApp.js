import{BASIS,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{DeleteSrc,DuplicateSrc,FocusItemOrSpace,ShortDescCopy}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/views_Perms.js"
import{Action,ActionMenu}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{InfoBrokerBasic}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/infos.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{VIEWS,ViewsContainer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{InfoCurrentItem,InfoFocusItem,InfoFocusNodeInItem,InfoSelectUris,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{LASTDATAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lastDatas.js"
import{FastFindItem,ReqFastFind}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/fastFindItem.js"
import{Toc}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/toc.js"
import{Generators}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/generators.js"
import{SRCDRAWER,SrcDrawerInline}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcDrawer.js"
import{ItemViewerSingle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemViewerSingle.js"
import{SearchAnd,SearchItemModel,SearchLinkChildren,SearchLinkParents,SearchOccurencesSubExp,SearchPath,SearchRequest}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
import{SpaceTreeDataSearch}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/spaceTree.js"
import{GridColTreeDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{CellBuilderSrcIconCodeTitle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcGridColumns.js"
import{Grid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{ActionBtn,Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{ItemCreator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/itemCreator.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{ItemEditInDialogInfoBroker,ItemXmlEd}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/item/itemXmlEd.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{Resizer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/resizer.js"
import{registerWspProtocolsActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/scProtocolActions.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/apps/apps_Perms.js"
import{WspBaseApp}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/apps/wspBaseApp.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
export class WspDocApp extends WspBaseApp{constructor(){super(...arguments)
this.shortDescs=[]}get emitter(){return this}get isDocFinderShown(){return!this._docFinder.hidden}async _initialize(init){this._config=init
this.appDef=init.appDef
this.universe=init.reg.env.universe
this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.wsp=this.universe.wspServer.wspsLive.findWsp(this.appDef.wspDoc,true)
return this._initApp(init)}async _initApp(init){this.infoBroker=new WspDocAppInfoBroker(this)
this.infoBroker.addConsumer(this)
this.docViewer=null
const sr=this.shadowRoot
const pendingUi=new MsgLabel
if(!await this._initWsp(init,pendingUi))return
if(!this.wsp.wspMetaUi.getDocModels()){Promise.resolve().then(()=>(new OpenWspApp).execute(this))
return}if(!await this._initReg(init,"wspDocApp","ui.wspDocApp",pendingUi))return
const reg=this.reg
BASIS.clearContent(sr)
this._docFinder=sr.appendChild((new FindDocItem).initialize({reg:reg,restrictions:new SearchItemModel(this.wsp.wspMetaUi.getDocModels())}))
this._docFinder.setAttribute("hidden","")
this._docToggle=JSX.createElement("button",{class:"toggle",onclick:this.onTogglePanel},JSX.createElement("span",{class:"headTi"},"Contenu"))
this._docHeader=sr.appendChild(JSX.createElement("div",{id:"docHeader",class:"headPanel",ondblclick:this.onTogglePanel},JSX.createElement("span",{class:"countPanel"},"1"),this._docToggle))
this._docRef=this._docHeader.appendChild((new SrcDrawerInline).initialize({reg:reg,skin:"wsp-doc-app/srcptrInHead",tpl:SRCDRAWER.itemCodeTpl}))
this._docRef.onSrcRefChange.add(this.onDocRefChanged.bind(this))
this._docHeader.appendChild(ActionBtn.buildButton(new Action("docChange").setLabel("Changer de contenu...").requireVisiblePerm("ui.app.wspDoc.change.doc").setExecute(ctx=>{this.setDoc(null)}),this,"dialog"))
this._docHeader.appendChild(JSX.createElement("span",{style:"flex:1"}))
this._docHeader.appendChild(JSX.createElement(BarActions,{id:"docHeaderActions","î":{reg:reg,actions:reg.getList("actions:wspDocApp:docHeader"),actionContext:this}}))
this._docRoot=sr.appendChild(JSX.createElement("div",{id:"docRoot","c-resizable":""}))
this._toc=this._docRoot.appendChild(JSX.createElement(Toc,{"c-resizable":"","î":{reg:reg,infoBroker:this.infoBroker,hideHeader:true}}))
this._docRoot.appendChild(JSX.createElement("c-resizer",{"c-orient":"row"}))
this._docMain=this._docRoot.appendChild(JSX.createElement("div",{id:"docMain","c-resizable":""}))
this._supToggle=JSX.createElement("button",{class:"toggle closed",onclick:this.onTogglePanel},JSX.createElement("span",{class:"headTi"},"Support"))
this._supHeader=sr.appendChild(JSX.createElement("div",{id:"supHeader",class:"headPanel",hidden:true,ondblclick:this.onTogglePanel},JSX.createElement("span",{class:"countPanel"},"2"),this._supToggle))
this._supRef=this._supHeader.appendChild(JSX.createElement(SrcDrawerInline,{id:"supRef","î":{reg:reg,skin:"wsp-doc-app/srcptrInHead",tpl:SRCDRAWER.itemCodeTpl}}))
this._supRef.onSrcRefChange.add(this.onSupRefChanged.bind(this))
this._supHeader.appendChild(JSX.createElement("c-button",{id:"selectSup","ui-context":"dialog",role:"menu",label:"Sélectionner",onclick:this.selectSupport}))
this._supHeader.appendChild(JSX.createElement("c-button",{id:"createSup","ui-context":"dialog",label:"Créer un support...",onclick:this.createSupport}))
this._supMain=sr.appendChild(JSX.createElement("div",{id:"supMain","c-resizable":"",hidden:""}))
sr.appendChild(JSX.createElement("c-resizer",{"c-orient":"column"}))
this._genToggle=JSX.createElement("button",{class:"toggle closed",onclick:this.onTogglePanel},JSX.createElement("span",{class:"headTi"},"Publications"))
this._genHeader=sr.appendChild(JSX.createElement("div",{id:"genHeader",class:"headPanel",ondblclick:this.onTogglePanel},JSX.createElement("span",{class:"countPanel"},"3"),this._genToggle))
this._gen=sr.appendChild(JSX.createElement(Generators,{"c-resizable":"",hidden:"","î":{reg:reg}}))
this._initAppHeader(init,[this._docRef,this._docFinder,this._toc,this._docMain,this._supRef,this._supMain,this._gen],"actions:wspDocApp:main","actions:wspDocApp:more")
sr.insertBefore(this.appHeader,this._docFinder)
this._refreshTitle(null)
this._refreshMigration()
this.docViewer=init.itemViewer||new ItemViewerSingle
let ld=init.lastDatas
let docRef=this.appDef.doc
if(docRef){if(ld&&ld.docRef!==docRef)ld=null}else if(ld){docRef=ld.docRef}let srcRef=this.appDef.src
if(srcRef){if(ld&&ld.srcRef&&ld.srcRef!==srcRef)ld=null}else if(ld){srcRef=ld.srcRef}let supRef=this.appDef.sup
if(supRef){if(ld&&ld.supRef!==supRef){ld.supEd=null
ld.genCd=null}}else if(ld){supRef=ld.supRef}await this.initDocAndSup(docRef,supRef,srcRef,ld)
if(this._lastWspMetaUi!==this.wsp.wspMetaUi)return
if(ld&&ld.closed){this.setDocPanelState(ld.closed.indexOf("d")<0)
this.setGenPanelState(ld.closed.indexOf("g")<0)}init.lastDatas=undefined
const injectLoads=this.reg.getList("wspDocApp:load")
if(injectLoads)for(const lstn of injectLoads){const result=lstn(this)
if(result instanceof Promise)await result}}reloadApp(){this.onViewHidden(true)
this.reinitializeStarted(this._initApp(this._config))}setDoc(srcRef,src){this._docRef.setSrcRef(srcRef,src)
this._supRef.setSrcRef(null)}setSup(srcRef,src){this._supRef.setSrcRef(srcRef,src)}async initDocAndSup(docRef,supRef,srcRef,lastDatas){this._toc.setRootSrcRef(docRef)
if(!this.docViewer.reg){await this.docViewer.initViewer(this.reg,this._docMain,lastDatas&&lastDatas.docView,srcRef||docRef)}else{await this.docViewer.openSrcRef(srcRef||docRef)}if(this._lastWspMetaUi!==this.wsp.wspMetaUi)return
this._docRef.setSrcRef(docRef)
if(this._docRef.fetchPending)await this._docRef.fetchPending
if(this._lastWspMetaUi!==this.wsp.wspMetaUi)return
if(supRef){const req=new SearchRequest(this.wsp.getShortDescDef()).setWhere(new SearchAnd(new SearchPath(supRef),new SearchOccurencesSubExp("gt",0,new SearchAnd(new SearchLinkChildren(".","support"),new SearchPath(docRef)))))
const supSds=await WSP.fetchSearchJson(this.wsp,this,req.toXml())
if(this._lastWspMetaUi!==this.wsp.wspMetaUi)return
if(supSds&&supSds.length>0){const supSd=supSds[0]
this._clearSupEditor()
this._buildSupEditor(supSd.itModel,this._docRef.shortDesc.itModel,SRC.srcRef(supSd),lastDatas&&lastDatas.supEd)
this._supRef.setSrcRef(SRC.srcRef(supSd),supSd)
this._gen.setSrc(supSd,lastDatas&&lastDatas.genCd)}else{this._supRef.setSrcRef(null)}}else{this._supRef.setSrcRef(null)}}onViewHidden(closed){var _a,_b,_c,_d,_e
if(this.initialized){if(closed){const injectClose=(_a=this.reg)===null||_a===void 0?void 0:_a.getList("wspDocApp:close")
if(injectClose)for(const lstn of injectClose)lstn(this);(_c=(_b=this.reg)===null||_b===void 0?void 0:_b.env.place)===null||_c===void 0?void 0:_c.closePlace()}VIEWS.onContainerHidden(this,closed);(_d=this._lastMigrPopup)===null||_d===void 0?void 0:_d.close()
if(closed)(_e=this.reg)===null||_e===void 0?void 0:_e.close()}else{this.initializedAsync.then(()=>this.onViewHidden(closed))}}visitViews(visitor,options){const onlyVisible=options&&options.visible
if(this._docFinder&&(!onlyVisible||!this._docFinder.hidden))visitor(this._docFinder)
visitor(this.docViewer)
if(this._supEd&&(!onlyVisible||!this._supEd.hidden))visitor(this._supEd)
if(this._toc&&(!onlyVisible||!this._toc.hidden))visitor(this._toc)
if(this._gen&&(!onlyVisible||!this._gen.hidden))visitor(this._gen)}async visitViewsAsync(visitor,options){const onlyVisible=options&&options.visible
if(this._docFinder&&(!onlyVisible||!this._docFinder.hidden))await visitor(this._docFinder)
await visitor(this.docViewer)
if(this._supEd&&(!onlyVisible||!this._supEd.hidden))await visitor(this._supEd)
if(this._toc&&(!onlyVisible||!this._toc.hidden))await visitor(this._toc)
if(this._gen&&(!onlyVisible||!this._gen.hidden))await visitor(this._gen)}updateAppDef(def){if(this.appDef===def)return true
if(!def.wspDoc||def.wspDoc!==this.appDef.wspDoc)return false
this.appDef=def
if(this.initialized){if(this.wsp&&this.wsp.isAvailable){this.onAppDefChange()}else{this.reloadApp()}}else{this.initializedAsync.then(()=>this.onAppDefChange())}return true}async onAppDefChange(){await this.initDocAndSup(this.appDef.doc,this.appDef.sup,this.appDef.src)
this.refresh()}onInfo(info){if(this.initialized){if(info instanceof InfoCurrentItem){const shortDesc=info.shortDesc
const srcRef=shortDesc?SRC.srcRef(shortDesc):null
if(this.appDef.src?srcRef!==this.appDef.src:srcRef!==this.appDef.doc){this.appDef.src=srcRef===this.appDef.doc?undefined:srcRef
this.dispatchEvent(new CustomEvent("c-appdef-change",{bubbles:true}))}}else if(info instanceof InfoSelectUris){if(this.isDocFinderShown){this._docFinder.refetch()}}}else{this.initializedAsync.then(()=>this.onInfo(info))}}buildLastDatas(parentLastDatas){if(!this._docRef)return
parentLastDatas.docRef=this._docRef.srcRef
if(parentLastDatas.docRef){parentLastDatas.docView={}
LASTDATAS.buildLastDatas(parentLastDatas.docView,this._docRoot)}parentLastDatas.supRef=this._supRef.srcRef
if(this._supEd){parentLastDatas.supEd={}
LASTDATAS.buildLastDatas(parentLastDatas.supEd,this._supEd)}const genCd=this._gen.codePub
if(genCd)parentLastDatas.genCd=genCd
const closed=LANG.pushIfDefined([],this._docToggle.classList.contains("closed")?"d":undefined,this._supToggle.classList.contains("closed")?"s":undefined,this._genToggle.classList.contains("closed")?"g":undefined)
if(closed.length>0)parentLastDatas.closed=closed.join("")}_refresh(){if(!this._docRef)return
if(!this._docRef.srcRef){DOM.setHidden(this._docHeader,true)
DOM.setHidden(this._docRoot,true)
DOM.setHidden(this._supHeader,true)
DOM.setHidden(this._supMain,true)
DOM.setHidden(this._genHeader,true)
hideView(this._gen,true)
hideView(this._docFinder,false)
return}hideView(this._docFinder,true)
DOM.setHidden(this._docHeader,false)
DOM.setHidden(this._docRoot,this._docToggle.classList.contains("closed"))
const docSd=this._docRef.shortDesc
const docModel=this.wsp.wspMetaUi.getItemType(docSd.itModel)
if(docModel.getSupportModels()){DOM.setHidden(this._supHeader,false)
const supSd=this._supRef.shortDesc
DOM.setHidden(this._supMain,!supSd||this._supToggle.classList.contains("closed"))
DOM.setTextContent(DOM.findFirstChild(this._genHeader,n=>n.className==="countPanel"),"3")
DOM.setHidden(this._genHeader,false)
hideView(this._gen,this._genToggle.classList.contains("closed"))
if(this._gen.shortDesc!==supSd)this._gen.setSrc(supSd)}else{DOM.setHidden(this._supHeader,true)
DOM.setHidden(this._supMain,true)
if(docSd&&docModel.hasGenerators(this.reg.env.securityCtx)){DOM.setTextContent(DOM.findFirstChild(this._genHeader,n=>n.className==="countPanel"),"2")
DOM.setHidden(this._genHeader,false)
hideView(this._gen,this._genToggle.classList.contains("closed"))
if(this._gen.shortDesc!==docSd)this._gen.setSrc(docSd)}else{DOM.setHidden(this._genHeader,true)
hideView(this._gen,true)}}}onTogglePanel(ev){const me=DOMSH.findHost(this)
const btn=this instanceof HTMLButtonElement?this:DOM.findFirstChild(this,n=>n.classList.contains("toggle"))
const st=btn.classList.toggle("closed")
const header=btn.parentElement.id
if(header==="docHeader"){if(st){me._supMain.style.flex=me._docRoot.style.flex}else{me._docRoot.style.flex=me._supMain.style.flex}me._supToggle.classList.toggle("closed",!st)}else if(header==="supHeader"){if(st){me._docRoot.style.flex=me._supMain.style.flex}else{me._supMain.style.flex=me._docRoot.style.flex}me._docToggle.classList.toggle("closed",!st)}if(ev&&!me._supHeader.hidden&&!me._supRef.shortDesc&&(!me._supToggle.classList.contains("closed")||!me._genToggle.classList.contains("closed"))){me.selectSupport.call(me.shadowRoot.getElementById("selectSup"),ev)}me.refresh()}setDocPanelState(open){if(this._docToggle.classList.contains("closed")===open)this.onTogglePanel.call(this._docToggle)}setSupPanelState(open){if(this._supToggle.classList.contains("closed")===open)this.onTogglePanel.call(this._supToggle)}setGenPanelState(open){if(this._genToggle.classList.contains("closed")===open)this.onTogglePanel.call(this._genToggle)}onDocRefChanged(){const docRef=this._docRef.srcRef
if(docRef&&this._docRef.shortDesc.srcSt<0){this.setDoc(null)
return}if(docRef&&this.docViewer&&this._toc.getRootSrcRef()===docRef)return
this._toc.setRootSrcRef(docRef)
this.docViewer.openSrcRef(docRef)
const sd=this._docRef.shortDesc
this.setDocPanelState(true)
this.refresh()
this._refreshTitle(sd?ITEM.getSrcMainName(this.reg,sd,this.wsp.wspMetaUi):null)
if(!docRef){this.appDef.doc=undefined
this.appDef.src=undefined
this.appDef.sup=undefined}else{this.appDef.doc=docRef
if(this.appDef.src===docRef)this.appDef.src=undefined}this.dispatchEvent(new CustomEvent("c-appdef-change",{bubbles:true}))}onSupRefChanged(){const supSrc=this._supRef.srcRef
if(supSrc&&this._supRef.shortDesc.srcSt<0){this.setSup(null)
return}if(supSrc&&this._supEd&&this._supEd.configs.srcRef===supSrc)return
this._clearSupEditor()
if(!supSrc)return
this._buildSupEditor(this._supRef.shortDesc.itModel,this._docRef.shortDesc.itModel,supSrc)
this.setSupPanelState(true)
this.refresh()
this.appDef.sup=supSrc
this.dispatchEvent(new CustomEvent("c-appdef-change",{bubbles:true}))}_clearSupEditor(){if(this._supEd){this._supEd.closeEditor()
this._supEd.remove()
this._supEd=null}}_buildSupEditor(supModel,docModel,supSrc,lastDatas){const supType=this.wsp.wspMetaUi.getItemType(supModel)
const docType=this.wsp.wspMetaUi.getItemType(docModel)
const supEditor=docType.getSupportEditor(supType)
if(supEditor){this._supEd=this._supMain.appendChild((new ItemXmlEd).initialize({reg:this.reg,datasEditor:supEditor,srcRef:supSrc,initItemReg:(reg,itemEd)=>{reg.addToList("actions:wed:commonbar:end","itemHamburger",1,new SupItemHamburger(itemEd),101)},lastDatas:lastDatas}))}else{POPUP.showNotifError("Aucun éditeur disponible pour ce support",this)}}async selectSupport(ev){try{const me=DOMSH.findHost(this)
const docSd=me._docRef.shortDesc
if(!docSd)return
const docModel=me.wsp.wspMetaUi.getItemType(docSd.itModel)
const supportModels=docModel.getSupportModels()
const supportModelsSet=new Set(supportModels)
const ct=(new FastFindItem).initialize({reg:me.reg,restrictions:new SearchAnd(new SearchLinkParents(me._docRef.srcRef,"support"),new SearchItemModel(supportModels)),emptyBody:()=>JSX.createElement("span",null,"Aucun support disponible pour ce contenu"),itemCreator:ItemCreator.setDefaultConfigFromReg(me.reg,{itemTypesTree:{itemTypeReducer:(acc,cur)=>{if(supportModelsSet.has(cur.getModel()))acc.push(cur)
return acc}},newContentOptions:{docShortDesc:docSd}})})
const supSd=await POPUP.showMenu(ct,{initHeight:"15em",viewPortY:"middle"},this,{titleBar:{barLabel:{label:"Sélection du support"}}}).onNextClose()
if(supSd)me._supRef.setSrcRef(SRC.srcRef(supSd),supSd)}catch(e){POPUP.showNotifError("Échec à la recherche des supports disponibles",this)
ERROR.log(e)}}async createSupport(ev){const me=DOMSH.findHost(this)
const docSd=me._docRef.shortDesc
const docModel=me.wsp.wspMetaUi.getItemType(docSd.itModel)
const supportModelsSet=new Set(docModel.getSupportModels())
const supSd=await ItemCreator.openCreateItem({reg:me.reg,itemTypesTree:{itemTypeReducer:(acc,cur)=>{if(supportModelsSet.has(cur.getModel()))acc.push(cur)
return acc}},newContentOptions:{docShortDesc:docSd}},"Créer un support...",this,ev).onNextClose()
if(supSd)me._supRef.setSrcRef(SRC.srcRef(supSd),supSd)}async initRegExtPoints(){const reg=this.reg
function addShortDescAction(action,accelKey,sortKey){reg.addToList("actions:wsp:shortDesc",action.getId(),1,action,sortKey)
if(accelKey)reg.addToList("accelkeys:wsp:shortDesc",accelKey,1,action)}addShortDescAction(new FocusItemOrSpace,"F3")
addShortDescAction(ShortDescCopy.SINGLETON,"c-accel",-1)
this.addWspActionsMain("actions:wspDocApp:main","actions:wspDocApp")
this.addGlobalAction("actions:wspDocApp:main",new OpenWspApp,70,"F8")
this.addWspActionsConfig("actions:wspDocApp:config")
this.addWspActionsContent("actions:wspDocApp:content")
this.addWspActionsLayers("actions:wspDocApp:layers")
function addBurgerItemAction(action){reg.addToList("actions:wspDocAppp:support:burger",action.getId(),1,action)}addBurgerItemAction(new DeleteSrc)
addBurgerItemAction(new SupItemDelete(this))
registerWspProtocolsActions(reg)}}REG.reg.registerSkin("wsp-doc-app",1,`\n\t:host {\n\t  flex: 1;\n\t  display: flex;\n\t  min-height: 0;\n\t  min-width: 0;\n\t  flex-direction: column;\n  }\n\n  [hidden] {\n\t  display: none !important;\n  }\n\n  :focus-visible {\n\t  outline: var(--focus-outline);\n  }\n\n  #wspHeader {\n\t  flex: 1;\n\t  display: flex;\n\t  min-height: 0;\n\t  min-width: 0;\n\t  justify-content: center;\n\t  user-select: none;\n  }\n\n  #wspIcon {\n\t  height: 1.5rem;\n  }\n\n  #wspTi {\n\t  margin: 0 .5rem;\n\t  letter-spacing: .1rem;\n\t  text-align: center;\n\t  font-size: 1.2rem;\n  }\n\n  hr {\n\t  border-top: 1px solid var(--border-color);\n\t  border-inline-start: 1px solid var(--border-color);\n\t  border-inline-end: none;\n\t  border-bottom: none;\n\t  margin: 0;\n  }\n\n  #docRoot {\n\t  flex: 3;\n\t  display: flex;\n\t  min-height: 0;\n\t  min-width: 0;\n\t  overflow: hidden;\n  }\n\n  #docMain,\n  #supMain {\n\t  display: flex;\n\t  min-height: 0;\n\t  min-width: 0;\n\t  flex-direction: column;\n  }\n\n  #docMain {\n\t  flex: 4;\n  }\n\n  #supMain {\n\t  flex: 3;\n\t  overflow: hidden;\n  }\n\n  wsp-finddoc {\n\t  flex: 1;\n  }\n\n  .headPanel {\n  \tdisplay: flex;\n\t  background-color: var(--tabf-bgcolor);\n\t  color: var(--tabf-color);\n\t  --pressed-bgcolor: var(--inv-pressed-bgcolor);\n\t  padding: .3em;\n\t  font-weight: bold;\n\t  border-bottom: 2px solid var(--bgcolor);\n  }\n\n  .countPanel {\n\t  display: flex;\n\t  align-items: center;\n\t  user-select: none;\n  }\n\n  .toggle {\n\t  background: none;\n\t  border: none;\n\t  color: var(--tabf-color);\n\t  font-weight: bold;\n\t  user-select: none;\n  }\n\n  .toggle::before {\n\t  content: "▼ ";\n  }\n\n  .toggle.closed::before {\n\t  content: "▶ ";\n  }\n\n  .headTi {\n\t  margin-inline-end: 2rem;\n  }\n\n  c-button:not([hidden]), c-action:not([hidden]) {\n\t  display: inline-flex;\n  }\n\n  c-button, c-action {\n\t  font-weight: normal;\n\t  margin: 0 .5em;\n  }\n\n  c-resizer[c-orient="row"] {\n\t  width: 1px;\n  }\n\n  c-resizer[c-orient="column"] {\n\t  height: 1px;\n  }\n\n  wsp-generators {\n\t  min-height: 3em;\n  }\n\n  wsp-src-drawer-inline {\n\t  font-size: 1.2rem;\n  }\n`)
REG.reg.registerSkin("wsp-doc-app/srcptrInHead",1,`\n\t:host {\n\t\twhite-space: nowrap;\n\t\toverflow: hidden;\n\t\ttext-overflow: ellipsis;\n\t\tuser-select: none;\n\t}\n\n\t:host(.empty) {\n\t\tdisplay: none;\n\t}\n\n\t.itemUri {\n\t\tcolor: var(--tabf-color);\n\t\tfont-weight: bold;\n\t}\n\n\t.icon {\n\t\tfilter: var(--filter);\n\t\tvertical-align: middle;\n\t}\n`)
customElements.define("wsp-doc-app",WspDocApp)
class FindDocItem extends FastFindItem{_initialize(init){this.reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
const btnCreate=ActionBtn.buildButton(new Action("createItem").setLabel("Créer un contenu...").requireEnabledPerm("create.item").requireVisiblePerm("ui.app.wspDoc.create.doc").setExecute(ctx=>{this.createItem.call(btnCreate)}),this,"dialog")
btnCreate.appendChild(JSX.asSvg(()=>JSX.createElement("svg",{viewBox:"0 0 16 16",style:"height: var(--icon-size); width: var(--icon-size); fill:var(--tabf-color)"},JSX.createElement("rect",{x:"6",y:"2",width:"4",height:"12"}),JSX.createElement("rect",{x:"2",y:"6",width:"12",height:"4"}))))
sr.appendChild(JSX.createElement("div",{id:"title"},JSX.createElement("span",null,"Sélection du contenu"),btnCreate))
this.search=JSX.createElement("input",{type:"search",placeholder:"Filtrer...",spellcheck:"false",onchange:this.onSearchChange,oninput:this.onSearchChange,onkeydown:this.onKeydown})
this.datasSearch=new SpaceTreeDataSearch(this.reg,"",false,init.srcFilter,[ITEM.AIR_PREFIX])
this.datasSearch.callbackSearching=this
this.request=new ReqFastFind(this.wsp).initReq(this.wsp.getShortDescDef(),"",init.restrictions)
this.datasSearch.initSpTrDataSearch(this.request,20,30)
const colDefs=[new GridColTreeDef("srcTree").setDefaultSort(1,"ascendant").setFlex("1rem",1,1).setSortable(true).setCellBuilder(new CellBuilderSrcIconCodeTitle(this.reg,this.wsp.wspMetaUi,false,this.wsp.srcUriItemsSortFn))]
this.grid=(new Grid).initialize({selType:"mono",columnDefs:colDefs,dataHolder:this.datasSearch,hideHeaders:true,emptyBody:()=>{if(this.wsp.isInError){return EMPTY_INERROR.cloneNode(true)}else if(this.searching||!this.wsp.isAvailable){return EMPTY_LOADING.cloneNode(true)}return EMPTY_NORESULT.cloneNode(true)}})
this.selectBtn=JSX.createElement(Button,{"ui-context":"dialog",label:"Sélectionner",disabled:"",onclick:()=>{const i=this.grid.getSelectedRow()
if(i>=0)this.onSelect(this.grid.dataHolder.getRow(i).rowKey)}})
const infoBuilder=this.reg.getSvc("FindDocItem.infoPanel")
const infoPanel=infoBuilder?infoBuilder(this):null
if(infoPanel){sr.appendChild(JSX.createElement("div",{id:"infoCtn"},JSX.createElement("div",{id:"finderCtn","c-resizable":""},JSX.createElement("div",{id:"search"},this.search),this.grid,JSX.createElement("div",{id:"footer"},this.selectBtn))))
function insertInfoPanel(elt){if(elt){elt.setAttribute("c-resizable","")
sr.getElementById("infoCtn").append(JSX.createElement(Resizer,{"c-orient":"row"}),elt)}}if(infoPanel instanceof Element){insertInfoPanel(infoPanel)}else{infoPanel.then(insertInfoPanel)}}else{sr.append(JSX.createElement("div",{id:"search"},this.search),this.grid,JSX.createElement("div",{id:"footer"},this.selectBtn))}this.grid.addEventListener("grid-select",ev=>{const row=this.grid.dataHolder.getRow(this.grid.getSelectedRow())
this.selectBtn.disabled=!row||row.rowDatas.ch!=null})
this.grid.uiEvents.on("rowDblclick",(row,ev)=>{if(row)this.onSelect(row.rowDatas)})
this.grid.addEventListener("keypress",(function(ev){if(ev.key===" "||ev.key==="Enter"){const row=this.dataHolder.getRow(this.getSelectedRow())
if(row)DOMSH.findHost(this).onSelect(row.rowDatas)}}))}onViewShown(){if(this.viewShown)return
this.viewShown=true
this.searching=true
this.request.updateParams(this)
this.datasSearch.fetchSearchStart()}onViewHidden(closed){this.viewShown=false
if(!closed)this.datasSearch.setDatas([])}onSearching(state){super.onSearching(state)
this.searching=state!=="searchEnd"
this.grid.refreshEmptyBody()}async createItem(){const self=DOMSH.findHost(this)
const itTypes=new Set(self.wsp.wspMetaUi.getDocModels())
const shortDesc=await ItemCreator.openCreateItem({reg:self.reg,itemTypesTree:{itemTypeReducer:(acc,cur)=>{if(itTypes.has(cur.getModel()))acc.push(cur)
return acc}}},"Créer un contenu...",this).onNextClose()
if(shortDesc)self.onSelect(shortDesc)}onSelect(src){if(!src||ITEM.getSrcUriType(src.srcUri)==="space")return
DOMSH.findHost(this).setDoc(SRC.srcRef(src),src)}}REG.reg.registerSkin("wsp-finddoc",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\t--row-inSel-unfocus-bgcolor: var(--row-inSel-bgcolor);\n\t}\n\n\n\t#title {\n\t\tbackground-color: var(--tabf-bgcolor);\n\t\tcolor: var(--tabf-color);\n\t\t--pressed-bgcolor: var(--inv-pressed-bgcolor);\n\t\tpadding: .3em;\n\t\tfont-weight: bold;\n\t\tuser-select: none;\n\t}\n\n\t#createItem:not([hidden]) {\n\t\tdisplay: inline-flex;\n\t}\n\n\t#createItem {\n\t\tfont-weight: normal;\n\t\tmargin: 0 1em;\n\t}\n\n\t#search {\n\t\tdisplay: flex;\n\t\tmin-height: min-content;\n\t\tmin-width: min-content;\n\t\tbackground: .1em / 1em no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/filter.svg) var(--form-search-bgcolor);\n\t\tpadding-inline-start: 1.2em;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\t#infoCtn {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: min-content;\n\t\tmin-width: min-content;\n\t  background-color: var(--row-bgcolor);\n\t}\n\n\t#finderCtn {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t  min-height: 0;\n\t  min-width: 0;\n\t  flex-direction: column;\n  }\n\n\tc-resizer {\n\t\tmin-width: 1px;\n\t}\n\n\tinput {\n\t\tflex: 1;\n\t\tbackground-color: var(--form-search-bgcolor);\n\t\tcolor: var(--form-color);\n\t\tborder: none;\n\t\tpadding: 2px;\n\t\tfont-size: inherit;\n\t}\n\n\tinput::placeholder {\n\t\tcolor: var(--fade-color);\n\t\tletter-spacing: 2px;\n\t\tfont-size: .8em;\n\t\tfont-style: italic;\n\t}\n\n\tinput:focus::placeholder {\n\t\tcolor: transparent;\n\t}\n\n\tc-grid {\n\t\tflex: 1 1 16em;\n\t\tborder: none;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\t#footer {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tjustify-content: flex-end;\n\t}\n`)
customElements.define("wsp-finddoc",FindDocItem)
const EMPTY_LOADING=JSX.createElement("section",{style:"font-style:italic; text-align:center;"},"Chargement en cours...")
const EMPTY_NORESULT=JSX.createElement("section",null,JSX.createElement("div",{style:"font-style:italic; text-align:center;"},"Aucun contenu trouvé"))
const EMPTY_INERROR=JSX.createElement("section",null,JSX.createElement("div",{style:"font-style:italic; text-align:center;"},"Configuration de l\'atelier en erreur"))
class OpenWspApp extends Action{constructor(){super("openWsp")
this._label="Mode explorateur..."
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/spaceTree/tree.svg"
this.requireVisiblePerm("ui.wspApp")}execute(ctx,ev){desk.findAndOpenApp({u:ctx.universe.getId(),wsp:ctx.wsp.code,srcRef:ctx.appDef.doc},ev)}}class SupItemHamburger extends ActionMenu{constructor(itemEd){super("itemHamb")
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/hamburger.svg"
this._label="Actions générales sur cet item support"
const c=itemEd.view
if(!c.shortDescs)c.shortDescs=[itemEd.reg.env.longDesc]
if(!c.emitter)c.emitter=itemEd
this._groupOrder=itemEd.reg.getPref("groupOrder.wsp.shortDesc","")
this._actionLists="actions:wspDocAppp:support:burger actions:wsp:shortDesc"}}class SupItemDelete extends DuplicateSrc{constructor(wspDocApp){super()
this.wspDocApp=wspDocApp}async execute(ctx,ev){const res=await super.execute(ctx,ev)
if(res&&res.length>0)this.wspDocApp.setSup(res[0])
return res}}class WspDocAppInfoBroker extends InfoBrokerBasic{constructor(wspDocApp){super()
this.wspDocApp=wspDocApp}async dispatchInfo(info,from){if(info instanceof InfoFocusItem){const isInSupport=this.isInSupportEd(from)
const isInToc=this.wspDocApp._toc.isInToc(info.srcRef)
if(isInSupport||!isInToc){const itemViewer=new ItemViewerSingle({mainViewCode:":hideWspStruct:"})
const root=JSX.createElement(ViewsContainer,{"î":{views:[itemViewer]},style:"flex:1;display:flex;min-height:0;min-width:0;flex-direction:column;"})
const subReg=REG.createSubReg(this.wspDocApp.reg)
subReg.env.infoBroker=new ItemEditInDialogInfoBroker(this.wspDocApp.reg)
await itemViewer.initViewer(subReg,root,null,info.srcRef)
if(info instanceof InfoFocusNodeInItem)subReg.env.infoBroker.dispatchInfo(new InfoFocusNodeInItem(info.xpath,info.srcRef),this)
subReg.env.uiRoot=POPUP.showDialog(root,this.wspDocApp,{titleBar:{barLabel:{label:isInSupport?"Paramétrage du support":"Fragment du contenu"},closeButton:{uiContext:"dialog",label:"Fermer"}},initWidth:"90%",initHeight:"90%",resizer:{}})
info.handled=true
return}}super.dispatchInfo(info,from)}isInSupportEd(from){if(from instanceof HTMLElement){const ed=DOMSH.findFlatParentEltOrSelf(from,this.wspDocApp,n=>n instanceof ItemXmlEd)
if(ed&&ed.parentNode===this.wspDocApp._supMain)return true}return false}}function hideView(view,hide){if(DOM.setHidden(view,hide)){if(hide)VIEWS.onViewHidden(view)
else VIEWS.onViewShown(view)}}
//# sourceMappingURL=wspDocApp.js.map