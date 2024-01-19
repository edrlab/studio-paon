import{BaseElementAsync,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{AppHeader}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/appHeader.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{ItemViewerSingle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemViewerSingle.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{registerWspProtocolsActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/scProtocolActions.js"
import{WSPPACK}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/pack.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/apps/apps_Perms.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/plugins/plugins_Perms.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{InfoReqCurrentItem}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{InfoBrokerBasic}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/infos.js"
import{InfoReqTaskContentItems,InfoTaskCurrentItemsChange}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/task/taskContent.js"
export class TaskApp extends BaseElementAsync{async _initialize(init){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.infoBroker=new InfoBrokerBasic
this.infoBroker.addConsumer(this)
this.msgElt=sr.appendChild(new MsgLabel)
try{const fromReg=this.findReg(init)
this.appDef=init.appDef
const place=fromReg.env.universe.wspServer.wspsLive.newPlace()
this.wsp=place.getWsp(this.appDef.w)
if(!this.wsp.wspServer.chain.auth.currentUser){this.msgElt.setStandardMsg("needAuth")
return}try{await this.wsp.waitForAvailable(this)}catch(e){console.log(e)
this.appErrorStatus="wspNotAvailable"
this.msgElt.setCustomMsg("Échec à l\'affichage de cette tâche : l\'atelier n\'est pas accessible.","error")
return}if(this.wsp.isDeleted){this.msgElt.setCustomMsg("Échec à l\'affichage de cette tâche : l\'atelier n\'est pas accessible.","error")
this.appErrorStatus="wspNotAvailable"
return}this.reg=REG.createSubReg(fromReg,this.wsp)
this.reg.env.place=place
this.reg.env.place.eventsMgr.on("wspLiveStateChange",this.onWspLiveStateChange.bind(this))
this.reg.env.uiRoot=this
this.reg.env.infoBroker=this.infoBroker
await this.initRegExtPoints()
if(!this.reg.hasPerm("ui.taskApp")){this.msgElt.setStandardMsg("accessDenied")
this.appErrorStatus="accessDenied"
return}this.rootElt=sr.appendChild(JSX.createElement("div",{id:"root"}))
this._taskViewer=new ItemViewerSingle({disableAutoChangeCurrentItem:true})
await this._taskViewer.initViewer(this.reg,this.rootElt,init.lastDatas,this.appDef.task)
this.appHeader=(new AppHeader).initialize({reg:this.reg,mainActions:this.reg.getList("actions:taskApp:bar:main"),moreActions:this.reg.getList("actions:taskApp:bar:more"),actionContext:this,focusListening:this.rootElt})
sr.insertBefore(this.appHeader,this.rootElt)
const h=this.appHeader.appendChild(JSX.createElement("header",null))
const img=h.appendChild(JSX.createElement("img",{src:this.wsp.wspMetaUi.getIcon()||"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/wsp/wsp.svg"}))
img.title=WSPPACK.buildWspDefTitle(this.wsp.infoWsp.wspType)
this._wspLabel=h.appendChild(JSX.createElement("h1",null))
this._refreshTitle()
try{const lstns=this.reg.getList("taskApp:load")
if(lstns)for(const lstn of lstns){const result=lstn(this)
if(result instanceof Promise)await result}}catch(e){await ERROR.log("taskApp:load listener failed",e)}}catch(e){this.setMsg("Échec à l\'affichage de cette tâche.","error",true)}}_refreshTitle(srcLabel){var _a
const wspLabel=((_a=this.wsp)===null||_a===void 0?void 0:_a.wspTitle)||"[Atelier non disponible]"
if(this._wspLabel)DOM.setTextContent(this._wspLabel,wspLabel)
DOM.setAttr(this,"label",srcLabel?srcLabel+" - "+wspLabel:wspLabel)
if(this._lastSrcLabel!==srcLabel||this._lastWspLabel!==wspLabel)VIEWS.dispatchViewChange(this)
this._lastSrcLabel=srcLabel
this._lastWspLabel=wspLabel}async initRegExtPoints(){const app=this
const reg=this.reg
const wsp=reg.env.wsp
registerWspProtocolsActions(reg)
function addMainBarAction(action,accel){reg.addToList("actions:taskApp:bar:main",action.getId(),1,action)
if(accel)reg.addToList("accelkeys:taskApp:global",accel,1,action)}addMainBarAction(new OpenWspApp,"F8")
function addMoreBarAction(action,accel){reg.addToList("actions:taskApp:bar:more",action.getId(),1,action)
if(accel)reg.addToList("accelkeys:taskApp:global",accel,1,action)}addMoreBarAction(new OpenContentItemOnWspApp)}setMsg(msg,level,isFatal=false){this.msgElt.setCustomMsg(msg,level)
if(this.rootElt)DOM.setHidden(this.rootElt,isFatal)}async onWspLiveStateChange(wsp){if(wsp!==this.wsp)return
this._refreshTitle(null)
if(this.appHeader)await this.appHeader.refresh()
if(!wsp.isAvailable||wsp.isDeleted){this.appErrorStatus="wspNotAvailable"
this.setMsg("Échec à l\'affichage de cette tâche : l\'atelier n\'est pas accessible.","error",true)}}onViewShown(){if(this._taskViewer)this._taskViewer.onViewShown()}onViewHidden(closed){try{if(this._taskViewer)this._taskViewer.onViewHidden(closed)}finally{if(closed)this.reg.env.place.closePlace()}}updateAppDef(def){return false}onInfo(info){if(this.initialized){if(info instanceof InfoTaskCurrentItemsChange){this.appHeader.refresh()}}else{this.initializedAsync.then(()=>this.onInfo(info))}}}REG.reg.registerSkin("wsp-task-app",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\tc-msg {\n\t  flex: unset;\n\t}\n\n\t#root {\n\t\tdisplay: contents;\n\t}\n\n\twsp-taskmain {\n\t\tbackground-color: var(--bgcolor);\n\t}\n\n\tc-appheader {\n\t\tmin-height: 2rem;\n\t\tz-index: 1;\n\t\tmargin: 0 4px;\n\t}\n\n\theader {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tmax-height: 5em;\n\t\toverflow: hidden;\n\t\talign-items: center;\n\t\tjustify-content: center;\n\t\tuser-select: none;\n\t}\n\n\timg {\n\t\theight: 1.3em;\n\t}\n\n\th1 {\n\t\tmargin: .1em .5em;\n\t\tfont-size: 1em;\n\t\tletter-spacing: 0.1em;\n\t\ttext-align: center;\n\t}\n\n\t/*\n  hr {\n\t  display: none;\n  }\n\n  main {\n\t  flex: 1;\n\t  display: flex;\n\t  min-width: 0;\n\t  min-height: 0;\n\t  flex-direction: column;\n\t  border-inline-start: 3px solid transparent;\n\t  border-inline-end: 3px solid transparent;\n  }\n\t*/\n`)
customElements.define("wsp-task-app",TaskApp)
class OpenWspApp extends Action{constructor(){super("openWsp")
this._label="Afficher la tâche dans l\'atelier en mode explorateur"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/spaceTree/tree.svg"
this.requireVisiblePerm("ui.wspApp")}execute(ctx,ev){const curr=new InfoReqCurrentItem
ctx.infoBroker.dispatchInfo(curr,ctx)
desk.findAndOpenApp({u:ctx.reg.env.universe.getId(),wsp:ctx.wsp.code,srcRef:ctx.appDef.task},ev)}}class OpenContentItemOnWspApp extends Action{constructor(){super("openWsp")
this._label="Ouvrir l\'item dans l\'atelier en mode explorateur"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/apps/taskApp/ctItemTree.svg"
this.setVisible(ctx=>this.findCurentContentItems(ctx)?true:false)}isVisible(ctx){if(!this.checkObjectRootVisiblePerm(ctx,["ui.wspApp","ui.app.task.open.ctItem.inWspApp"],true))return false
return super.isVisible(ctx)}execute(ctx,ev){const curr=new InfoReqCurrentItem
ctx.infoBroker.dispatchInfo(curr,ctx)
desk.findAndOpenApp({u:ctx.reg.env.universe.getId(),wsp:ctx.wsp.code,srcRef:this.findCurentContentItems(ctx)},ev)}findCurentContentItems(ctx){const curr=new InfoReqTaskContentItems
ctx.infoBroker.dispatchInfo(curr,ctx)
if(curr.entries)return curr.entries[0].srcUri||curr.entries[0].shortDesc.srcUri
return null}}
//# sourceMappingURL=taskApp.js.map