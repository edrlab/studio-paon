import{BaseElementAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{LASTDATAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lastDatas.js"
import{BlocksCollapsable}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/blocks.js"
import{Area}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{AppHeader}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/appHeader.js"
import{JobsMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/jobsMgr.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/apps/apps_Perms.js"
import{AccelKeyMgr,Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
export class JobsApp extends BaseElementAsync{get autoRefresh(){return this.params.autoRefresh}set autoRefresh(val){if(this.params.autoRefresh!==val){this.params.autoRefresh=val
if(val)this.refreshAllBlocksFetch().then(()=>{this._registerAutoRefreshHandler()})
else clearTimeout(this._autoRefreshHandler)
this._refreshui()}}async _initialize(init){this.params=Object.assign(init,{maxOpenEntriesByDefault:5,autoRefresh:true,autoRefreshInterval:15})
this.appDef=init.appDef
this.reg=this.findReg(init)
this.attachShadow(DOMSH.SHADOWDOM_INIT)
const sr=this.shadowRoot
this.reg.installSkin("scroll/large",sr)
this._initAndInstallSkin(this.localName,init)
const showUniverses=this.appDef.jobsUniverse
this.initRegExtPoints()
if(!this.accelKeyMgr){this.accelKeyMgr=new AccelKeyMgr
this.addEventListener("keydown",(function(ev){this.accelKeyMgr.handleKeyboardEvent(ev,this)}))}else{this.accelKeyMgr.reset()}this.accelKeyMgr.initFromMapActions(this.reg.getListAsMap("accelkeys:jobsApp:global"))
this.appHeader=sr.appendChild((new AppHeader).initialize({reg:this.reg,skinOver:"jobs-app/header",actionContext:this,mainActions:this.reg.getList("actions:jobsApp:bar:main")}))
this.setAttribute("label","Traitements")
this.appHeader.appendChild(JSX.createElement("header",null,JSX.createElement("h1",null,"Traitements")))
let universes=init.reg.getList("plg:jobs:universes")
universes=universes.filter(entry=>entry.executor&&entry.reg.hasPerm("ui.apps.jobs.show")?true:false)
const LDkey="blocks"
let LD=init.lastDatas?init.lastDatas[LDkey]:null
if(!LD&&init.maxOpenEntriesByDefault){LD={open:[]}
for(var i=0;i<universes.length;i++){const univ=universes[i]
if(i<init.maxOpenEntriesByDefault)LD.open.push(univ.getId())
else break}}this.blocksCollapsable=sr.appendChild(JSX.createElement(BlocksCollapsable,{"î":Object.assign({reg:this.reg,areasContext:{reg:this.reg},skinOver:"jobs-app/collapsableBlocks",lastDatasKey:LDkey,lastDatas:LD},init.blocksCollapsableInit)}))
universes.forEach((univ,pos)=>{this.blocksCollapsable.addArea(new Area(univ.getId()).setLabel(univ.getName()).requireVisiblePerm("ui.apps.jobs.show").setBodyBuilder(ctx=>JSX.createElement(JobsMgr,{"î":{reg:univ.reg,jobsTab:{skinOver:"jobs-app/mgr/tab"}}})),null,{reg:univ.reg,areaContext:{reg:univ.reg},parentBlockCtn:this.blocksCollapsable,locked:universes.length==1?true:undefined})})
if(this.params.lastDatas&&this.params.lastDatas.autoRefresh!==undefined)this.autoRefresh=this.params.lastDatas.autoRefresh
else this.autoRefresh=this.autoRefresh
if(this.autoRefresh)this._registerAutoRefreshHandler()}_refreshui(){this.appHeader.refresh()}async refreshAllBlocksFetch(){if(this.isConnected){let selectedBlocks=this.blocksCollapsable.selectedBlocks
if(selectedBlocks){Promise.all(selectedBlocks.map(async block=>{let view=block.view
if(view)await view.fetchAll()}))}}}_registerAutoRefreshHandler(){if(this._autoRefreshHandler)clearTimeout(this._autoRefreshHandler)
this._autoRefreshHandler=window.setTimeout(async()=>{await this.refreshAllBlocksFetch()
if(this.autoRefresh)this._registerAutoRefreshHandler()},this.params.autoRefreshInterval*1e3)}initRegExtPoints(){const reg=this.reg
function addMainBarAction(action,accel){reg.addToList("actions:jobsApp:bar:main",action.getId(),1,action)
if(accel)reg.addToList("accelkeys:jobsApp:global",accel,1,action)}addMainBarAction(new AutoRefreshBtn)}updateAppDef(def){if(this.appDef===def)return true
return false}buildLastDatas(parentLastDatas){if(this.params.lastDatas&&this.params.lastDatas.autoRefresh!==undefined){parentLastDatas.autoRefresh=this.params.lastDatas.autoRefresh}LASTDATAS.buildLastDatas(parentLastDatas,this.blocksCollapsable,true)}visitViews(visitor){visitor(this.blocksCollapsable)}visitViewsAsync(visitor,options){return visitor(this.blocksCollapsable)}static atLeastOneEntry(reg){let universes=reg.getList("plg:jobs:universes")||[]
let result=false
for(const univ of universes){if(univ.executor&&univ.reg.hasPerm("ui.apps.jobs.show")){result=true
break}}return result}}customElements.define("jobs-app",JobsApp)
REG.reg.registerSkin("jobs-app",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\tc-appheader {\n\t\tmin-height: 2rem;\n\t\tz-index: 1;\n\t\tmargin: 0 4px;\n\t}\n\n\theader {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tmax-height: 5em;\n\t\toverflow: hidden;\n\t\talign-items: center;\n\t\tjustify-content: center;\n\t  user-select: none;\n  }\n\n  h1 {\n\t  margin: .1em .5em;\n\t  font-size: 1em;\n\t  letter-spacing: 0.1em;\n\t  text-align: center;\n  }\n\n  c-blocks-collapsable {\n\t  flex: 1;\n\t  min-height: 0;\n\t  min-width: 0;\n\t  overflow: auto;\n  }\n\n`)
REG.reg.registerSkin("jobs-app/header",1,`\n\t:host > div {\n\t\tflex-direction: row-reverse;\n\t}\n`)
REG.reg.registerSkin("jobs-app/collapsableBlocks",1,`\n\tjobs-mgr {\n\t\tflex: 1;\n\t}\n`)
REG.reg.registerSkin("jobs-app/mgr/tab",1,`\n\t#head {\n\t\tbackground-color: var(--alt1-bgcolor);\n\t}\n`)
class RefreshAllBlocksAction extends Action{constructor(){super("refreshAllBlocks")
this._label="Rafraichir les zones affichées"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/refresh.svg"}execute(ctx,ev){ctx.refreshAllBlocksFetch()}}class AutoRefreshBtn extends Action{constructor(){super("autoRefresh")
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/refresh.svg"}getLabel(ctx){return`Rafraichissement automatique des zones affichées (toutes les ${ctx.params.autoRefreshInterval} secondes)`}isToggle(ctx){return true}getIcon(ctx){return this.getDatas("toggle",ctx)?"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/apps/autorefresh-on.svg":"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/apps/autorefresh-off.svg"}getDatas(api,ctx){return ctx.autoRefresh}execute(ctx,ev){let currentStatus=this.getDatas("toggle",ctx)
if(!ctx.params.lastDatas)ctx.params.lastDatas={}
ctx.params.lastDatas.autoRefresh=!currentStatus
ctx.autoRefresh=!currentStatus}}
//# sourceMappingURL=jobsApp.js.map