import{BaseElementAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{ENodeType,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{LASTDATAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lastDatas.js"
import{BlocksCollapsable}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/blocks.js"
import{Area}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{AppHeader}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/appHeader.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/apps/apps_Perms.js"
export class LogsApp extends BaseElementAsync{async _initialize(init){this.appDef=init.appDef
this.reg=this.findReg(init)
this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
const sr=this.shadowRoot
const showUniverses=this.appDef.logsUnivers
if(!init.maxOpenEntriesByDefault)init.maxOpenEntriesByDefault=5
this.appHeader=sr.appendChild((new AppHeader).initialize({reg:this.reg,actionContext:this}))
this.setAttribute("label","Logs système")
if(!init.hasHeadTitleBar)this.appHeader.appendChild(JSX.createElement("header",null,JSX.createElement("h1",null,"Logs système")))
let logsAppEntries=init.reg.getList("plg:logs:entries")
logsAppEntries=logsAppEntries.filter(entry=>LogsApp.canReadLogUniverce(entry.universe))
const LDkey="blocks"
let LD=init.lastDatas?init.lastDatas[LDkey]:null
if(!LD&&init.maxOpenEntriesByDefault){LD={open:[]}
for(var i=0;i<logsAppEntries.length;i++){const logAppEntry=logsAppEntries[i]
if(i<init.maxOpenEntriesByDefault)LD.open.push(logAppEntry.universe.getId())
else break}}this._blocksCollapsable=sr.appendChild(JSX.createElement(BlocksCollapsable,{"î":Object.assign({reg:this.reg,areasContext:{reg:this.reg},skinOver:"logs-app/collapsableBlocks",lastDatasKey:LDkey,lastDatas:LD},init.blocksCollapsableInit)}))
logsAppEntries.forEach((logAppEntry,pos)=>{this._blocksCollapsable.addArea(new Area(logAppEntry.universe.getId()).setLabel(logAppEntry.name||logAppEntry.universe.getName()).requireVisiblePerm("ui.apps.logs.show").setBodyBuilder(ctx=>{let iframe=JSX.createElement("iframe",{src:logAppEntry.universe.config.adminLogsUrl})
iframe.addEventListener("load",()=>{this.forceOpenLinksInNewTab(iframe,this.reg)})
return iframe}),null,{reg:logAppEntry.universe.reg,areaContext:{reg:logAppEntry.universe.reg},parentBlockCtn:this._blocksCollapsable,locked:logsAppEntries.length==1?true:undefined})})}updateAppDef(def){if(this.appDef===def)return true
return false}buildLastDatas(parentLastDatas){LASTDATAS.buildLastDatas(parentLastDatas,this._blocksCollapsable,true)}visitViews(visitor){visitor(this._blocksCollapsable)}visitViewsAsync(visitor,options){return visitor(this._blocksCollapsable)}forceOpenLinksInNewTab(frame,reg){var _a;(_a=frame.contentDocument)===null||_a===void 0?void 0:_a.addEventListener("click",ev=>{if(ev.defaultPrevented)return
const target=ev.target
let link=null
if(target.nodeName=="a")link=target
if(!link){const targetPaths=ev.composedPath()
for(let i=1;i<targetPaths.length;i++){const target=targetPaths[i]
if(target.nodeType!=ENodeType.element)break
else if(target.nodeName=="a"){link=target
break}}}if(!link)return
link.setAttribute("target","_blank")})}static atLeastOneEntry(reg){let logsAppEntries=reg.getList("plg:logs:entries")||[]
let result=false
for(const logAppEntry of logsAppEntries){if(this.canReadLogUniverce(logAppEntry.universe)){result=true
break}}return result}static canReadLogUniverce(univ){return univ.config.adminLogsUrl&&univ.reg.hasPerm("ui.apps.logs.show")?true:false}}customElements.define("logs-app",LogsApp)
REG.reg.registerSkin("logs-app",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\theader {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tmax-height: 5em;\n\t\toverflow: hidden;\n\t\talign-items: center;\n\t\tjustify-content: center;\n\t\tuser-select: none;\n\t}\n\n\th1 {\n\t\tmargin: .1em .5em;\n\t\tfont-size: 1em;\n\t\tletter-spacing: 0.1em;\n\t\ttext-align: center;\n\t}\n\n\tc-blocks-collapsable {\n\t\tflex: 1;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n`)
REG.reg.registerSkin("logs-app/collapsableBlocks",1,`\n\tiframe {\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\tborder: none;\n\t\tbackground-color: var(--form-bgcolor);\n\t}\n`)

//# sourceMappingURL=logsApp.js.map