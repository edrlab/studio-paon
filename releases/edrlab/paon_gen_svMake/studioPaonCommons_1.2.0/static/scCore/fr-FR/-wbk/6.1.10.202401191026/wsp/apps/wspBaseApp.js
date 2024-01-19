import{BaseElementAsync,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{AppFrameDeskFeat}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/appFrame.js"
import{AccelKeyMgr,ActionMenuDep}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
import{AutoMigrWspAction,CreateDrfWspAction,CreateDrvWspAction,DeleteWspAction,ExportWspAction,OpenPermsWspAction,OpenPropsWspAction,ScanFsUpdatesAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/wspActions.js"
import{DOM,JSX,ShadowJsx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{WedSearchCoordinator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/searchBar.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{AppHeader}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/appHeader.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{WSPPACK}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/pack.js"
import{ButtonActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{ImportScar,OpenWspTrash}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
export class WspBaseApp extends BaseElementAsync{constructor(){super(...arguments)
this._wspTi=JSX.createElement("div",{id:"wspTi"})
this._wspIcon=JSX.createElement("img",{id:"wspIcon"})
this._wspTypeTi=JSX.createElement("div",{id:"wspTypeTi"})
this._headTitleBar=JSX.createElement("div",{id:"wspHeader"},JSX.createElement(ShadowJsx,{skin:"wspBaseApp/headerBar"}))}getHeadTitleBar(){return this._headTitleBar}async _initWsp(init,pendingUi){const sr=this.shadowRoot
BASIS.clearContent(sr)
sr.appendChild(pendingUi)
if(!this.universe.auth.currentUser){pendingUi.setStandardMsg("needAuth")
return false}if(!Desk.checkCompat("edit")){pendingUi.setCustomMsg("")
pendingUi.append(JSX.createElement("div",null,JSX.createElement("p",null,"Ce navigateur n\'est pas compatible avec l\'édition de texte riche."),JSX.createElement("p",null,"Vous pouvez utiliser un des navigateurs à jour suivants :"),JSX.createElement("ul",null,Desk.knownNavCompat.map(n=>n.url?JSX.createElement("li",null,JSX.createElement("a",{href:n.url,target:"_blank"},n.name)):JSX.createElement("li",null,n.name)))))
return false}pendingUi.setStandardMsg("loading")
try{await this.wsp.waitForAvailable(this)
this._lastWspMetaUi=this.wsp.wspMetaUi}catch(e){console.log(e)
const wspTitle=this.wsp.wspTitle
if(this.wsp.isAccessDenied){pendingUi.setCustomMsg(wspTitle?`Accès à l\'atelier \'${wspTitle}\' non autorisé.`:`Accès non autorisé à l\'atelier.`,"error")
return false}else if(this.wsp.infoWsp&&!this.wsp.wspMetaUi){pendingUi.setCustomMsg("Échec au chargement du modèle documentaire de l\'atelier.","error")
if(!await this.openPropsWspOnError(init))return false}else if(this.wsp.infoWspError){if(this.wsp.infoWspError.status==="noWsp"){pendingUi.setCustomMsg("L\'atelier n\'est pas (ou plus) disponible.","error")
return false}else{pendingUi.setCustomMsg("Échec au chargement de l\'atelier.","error")
if(!await this.openPropsWspOnError(init))return false}}else{pendingUi.setStandardMsg("netError")
return false}}if(this.wsp.isDeleted){pendingUi.setCustomMsg("L\'atelier a été supprimé.","error")
return false}return true}async openPropsWspOnError(init){const act=new OpenPropsWspAction
const ctx={reg:REG.createSubReg(init.reg,this.wsp.reg)}
if(act.isAvailable(ctx)){await act.execute(ctx)
await this.wsp.waitForAvailable(this)
this._lastWspMetaUi=this.wsp.wspMetaUi}return this.wsp.isAvailable}async _initReg(init,codeApp,perm,pendingUi){const reg=this.reg=REG.createSubReg(init.reg,this.wsp.reg)
reg.env.uiRoot=this
reg.env.place=this.wsp.newPlaceWsp()
reg.env.place.eventsMgr.on("wspLiveStateChange",this.onWspLiveStateChange.bind(this))
reg.env.infoBroker=this.infoBroker
this.reg.env.wedSearchCoord=new WedSearchCoordinator
await this.initRegExtPoints()
if(this._lastWspMetaUi!==this.wsp.wspMetaUi)return false
const injectInits=reg.getList(`${codeApp}:init`)
if(injectInits)for(const lstn of injectInits){const result=lstn(this)
if(result instanceof Promise){await result
if(this._lastWspMetaUi!==this.wsp.wspMetaUi)return false}}if(!reg.hasPerm(perm)){pendingUi.setStandardMsg("accessDenied")
this.appErrorStatus="accessDenied"
return false}if(!this.accelKeyMgr){this.accelKeyMgr=new AccelKeyMgr
this.addEventListener("keydown",(function(ev){this.accelKeyMgr.handleKeyboardEvent(ev,this)}))}else{this.accelKeyMgr.reset()}this.accelKeyMgr.initFromMapActions(reg.getListAsMap(`accelkeys:${this.localName}:global`))
return true}_initAppHeader(init,focusListening,actionsMain,actionsMore){const reg=this.reg
this._wspIcon.src=this.wsp.wspMetaUi.getIcon()||"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/wsp/wsp.svg"
this._wspTypeTi.textContent=null
this._wspTypeTi.append(this._wspIcon,WSPPACK.buildWspDefTitle(this.wsp.infoWsp.wspType,{short:true,lang:true}))
this._wspTypeTi.title=WSPPACK.buildWspDefTitle(this.wsp.infoWsp.wspType)
if(init.hasHeadTitleBar){this.appHeader=(new AppHeader).initialize({reg:reg,actionContext:this,focusListening:focusListening})
BASIS.clearContent(this._headTitleBar.shadowRoot)
this._headTitleBar.shadowRoot.appendChild(JSX.createElement(ButtonActions,{id:"wspActions","î":{actions:reg.getList(actionsMain),actionContext:this,title:"Actions sur cet atelier"}},JSX.createElement("div",null,this._wspTi,this._wspTypeTi)))}else{this.appHeader=(new AppHeader).initialize({reg:reg,mainActions:reg.getList(actionsMain),moreActions:reg.getList(actionsMore),actionContext:this,focusListening:focusListening})
this.appHeader.appendChild(JSX.createElement("div",{id:"wspHeader"},JSX.createElement(ShadowJsx,{skin:"wspBaseApp/headerBar"},this._wspTi,this._wspTypeTi)))}}_refreshTitle(srcLabel){const wspLabel=this.wsp.wspTitle||"[Atelier non disponible]"
DOM.setTextContent(this._wspTi,wspLabel)
DOM.setAttr(this._wspTi,"title",wspLabel)
DOM.setAttr(this,"label",srcLabel?srcLabel+" - "+wspLabel:wspLabel)
if(this._lastSrcLabel!==srcLabel||this._lastWspLabel!==wspLabel)VIEWS.dispatchViewChange(this)
this._lastSrcLabel=srcLabel
this._lastWspLabel=wspLabel}async onWspLiveStateChange(wsp){if(wsp!==this.wsp)return
if(this._lastWspMetaUi&&this.wsp.wspMetaUi&&this._lastWspMetaUi!==this.wsp.wspMetaUi){await this.initializedAsync
this.reloadApp()
return}this._refreshTitle(null)
this._refreshMigration()
this.appHeader.refresh()
if(wsp.isDeleted===true){if(this._PopupWspError)return
this._PopupWspError=POPUP.confirm("L\'atelier a été supprimé",document.body,{kind:"forbidden",cancelLbl:null})
await this._PopupWspError
this._PopupWspError=null
if(AppFrameDeskFeat.isIn(desk))desk.gotoHome()}else if(wsp.isAccessDenied){if(this._PopupWspError)return
this._PopupWspError=POPUP.confirm("Vous ne disposez plus d\'accès à cet atelier",document.body,{kind:"forbidden",cancelLbl:null})
await this._PopupWspError
this._PopupWspError=null
if(AppFrameDeskFeat.isIn(desk))desk.gotoHome()}else if(wsp.isInError){if(this._PopupWspError)return
this._PopupWspError=POPUP.confirm("La configuration de l\'atelier est en erreur. Veuillez vérifier ses propriétés.",this,{kind:"error",cancelLbl:null})
await this._PopupWspError
this._PopupWspError=null
if(AppFrameDeskFeat.isIn(desk))desk.gotoHome();(new OpenPropsWspAction).executeIfAvailable({reg:REG.createSubReg(this.reg,this.wsp.reg)})}}_refreshMigration(){if(this._lastMigrPopup)this._lastMigrPopup.close()
if(this.wsp.infoWsp&&this.wsp.infoWsp.isMigrationNeeded){this._lastMigrPopup=POPUP.showNotifWarning(JSX.createElement("div",null,"Migration des données de l\'atelier nécessaire."),this,{actions:[(new AutoMigrWspAction).setLabel("Migrer")],actionContext:this})
this._lastMigrPopup.onNextClose().then(()=>{this._lastMigrPopup=null})}}addGlobalAction(list,action,sortKey,accel,inShortDescAccelKey){this.reg.addToList(list,action.getId(),1,action)
if(accel){this.reg.addToList(`accelkeys:${this.localName}:global`,accel,1,action)
if(inShortDescAccelKey){this.reg.addToList("accelkeys:wsp:shortDesc",accel,1,action)}}}addWspActionsMain(list,prefixSub){this.addGlobalAction(list,(new AutoMigrWspAction).setLabel("Migration nécessaire...").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/apps/warning.svg"),0)
this.addGlobalAction(list,new ActionMenuDep("wspConfig").setActionLists(prefixSub+":config").setLabel("Configuration"),10)
this.addGlobalAction(list,new ActionMenuDep("wspContent").setActionLists(prefixSub+":content").setLabel("Contenu"),20)
this.addGlobalAction(list,new ActionMenuDep("wspLayers").setActionLists(prefixSub+":layers").setLabel("Sous-ateliers calques"),30)
this.addGlobalAction(list,new ActionMenuDep("wspHelp").setActionLists(prefixSub+":help actions:wsp:help").setLabel("Aide"),40)}addWspActionsConfig(list){this.addGlobalAction(list,new OpenPropsWspAction,10)
this.addGlobalAction(list,(new OpenPermsWspAction).requireVisiblePerm(["ui.apps.set.perms.wsp","admin.node.configRoles.byAdmin"]),20)
this.addGlobalAction(list,(new DeleteWspAction).requireVisiblePerm("ui.apps.delete.wsp"),30)}addWspActionsContent(list){this.addGlobalAction(list,new ScanFsUpdatesAction,5)
this.addGlobalAction(list,new OpenWspTrash,10)
this.addGlobalAction(list,new ExportWspAction,20)
this.addGlobalAction(list,new ImportScar,30)}addWspActionsLayers(list){this.addGlobalAction(list,(new CreateDrfWspAction).requireVisiblePerm("ui.apps.create.wsp.drf"),10)
this.addGlobalAction(list,(new CreateDrvWspAction).requireVisiblePerm("ui.apps.create.wsp.drv"),20)}}REG.reg.registerSkin("wspBaseApp/headerBar",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\talign-items: center;\n\t\tfont-size: 1rem;\n\t\talign-self: stretch;\n\t\tjustify-content: start;\n\t}\n\n\t#wspTi, #wspTypeTi {\n\t\tdisplay: block;\n\t\tmax-width: 20em;\n\t\twhite-space: nowrap;\n\t\toverflow: hidden;\n\t\ttext-overflow: ellipsis;\n\t\ttext-align: start;\n\t}\n\n\t#wspTi {\n\t\tfont-weight: bold;\n\t\tpadding-bottom: .3em;\n\t}\n\n\t#wspTypeTi {\n\t\tfont-size: 80%;\n\t\tcolor: var(--fade-color);\n\t}\n\n\t#wspIcon {\n\t\theight: 1.5em;\n\t\tvertical-align: middle;\n\t\tmargin-inline-end: .5em;\n\t}\n\n\t#wspActions {\n\t\talign-self: stretch;\n\t\tpadding-inline-start: .3em;\n\t}\n`)

//# sourceMappingURL=wspBaseApp.js.map