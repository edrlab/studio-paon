import{BaseElementAsync,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{InfoBrokerBasic}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/infos.js"
import{InfoCurrentRes,InfoFocusRes}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/res.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{Tabs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tabs.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/zones/webZones.js"
import{EWsState}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/universe.js"
export class DepotDeskApp extends BaseElementAsync{async _initialize(init){var _a,_b,_c
this.appDef=init.appDef
const universe=init.reg.env.universe
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.setAttribute("label",universe.getName())
if(!universe.auth.currentUser){sr.appendChild((new MsgLabel).setStandardMsg("needAuth"))
return}this.reg=universe.newDepotUiReg(this)
this.reg.env.infoBroker=new InfoBrokerBasic
this.reg.env.infoBroker.addConsumer(this)
if(((_a=universe.wsFrames)===null||_a===void 0?void 0:_a.ws.wsState)!==EWsState.wsOpened)await((_b=universe.wsFrames)===null||_b===void 0?void 0:_b.ws.startWs())
if(init.boards.length>1){if(this.appDef.dptPath!=null){}const v=this.view=(new Tabs).initialize({reg:this.reg,areas:init.boards,areasContext:this,skinOver:"store-depotdesk-app/tabs",lastDatas:(_c=init.lastDatas)===null||_c===void 0?void 0:_c.board,lastDatasKey:"board"})
await v.initializedAsync
sr.appendChild(v)}else{this.view=sr.appendChild(await init.boards[0].loadBody(this,init.lastDatas))}VIEWS.onViewShown(this.view)
this.onAppDefChange()}updateAppDef(def){if(this.appDef===def)return true
this.appDef=def
if(this.initialized){this.onAppDefChange()}else{this.initializedAsync.then(()=>this.onAppDefChange())}return true}onViewHidden(closed){var _a
try{VIEWS.onContainerHidden(this,closed)}finally{if(closed)(_a=this.reg)===null||_a===void 0?void 0:_a.close()}}onAppDefChange(){this.reg.env.infoBroker.dispatchInfo(new InfoFocusRes(this.appDef.dptPath),this)}onInfo(info){if(this.initialized){if(info instanceof InfoCurrentRes){if(info.resPath!=this.appDef.dptPath){this.appDef.dptPath=info.resPath
this.dispatchEvent(new CustomEvent("c-appdef-change",{bubbles:true,detail:{revertable:true}}))}}}else{this.initializedAsync.then(()=>this.onInfo(info))}}visitViews(visitor){if(this.view)return visitor(this.view)}visitViewsAsync(visitor,options){return this.view?visitor(this.view):Promise.resolve(undefined)}}REG.reg.registerSkin("store-depotdesk-app",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: row;\n\t}\n\n\tc-tabs {\n\t\tflex: 1;\n\t}\n`)
REG.reg.registerSkin("store-depotdesk-app/tabs",1,`\n\tc-tab {\n\t\tpadding: .7em !important;\n\t}\n\n\t#panels {\n\t\tborder: none;\n\t\tborder-top: solid 1px var(--border-color);\n\t}\n`)
customElements.define("store-depotdesk-app",DepotDeskApp)

//# sourceMappingURL=depotDeskApp.js.map