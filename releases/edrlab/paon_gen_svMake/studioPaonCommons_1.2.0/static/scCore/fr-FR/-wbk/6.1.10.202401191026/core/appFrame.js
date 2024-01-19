import{BASIS,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{Actionables}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{LoggedUser}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/loggedUser.js"
import{Action,ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{Desk,UrlHashObjDeskFeat}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
import{LASTDATAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lastDatas.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{JSX,ShadowJsx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{LastDatasDeskFeat}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/lastDatas.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{CDM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/cdm.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{GFX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/gfx.js"
import{Button,ButtonToggle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/zones/webZones.js"
export function isApp(tag){return tag&&"appDef"in tag}export class AppFrameDeskFeat extends Desk{static add(desk,options){if(this.isIn(desk))return desk
LastDatasDeskFeat.add(desk)
ContextMenuDeskFeat.add(desk)
desk.assignProps(this)
const d=desk
d._appBuilders=[]
d.initialTitle=document.title
d.ldSession=location.search.substr(1)
const bcSessions=new BroadcastChannel(location.pathname)
const rand=Math.random()
bcSessions.onmessage=ev=>{if(ev.data.req==="getSessions"){bcSessions.postMessage({resp:"getSessions",session:d.ldSession,r:ev.data.r})}else if(ev.data.resp==="getSessions"&&ev.data.r===rand){if(ev.data.session===d.ldSession)d.onLdSessionConflict()}}
bcSessions.postMessage({req:"getSessions",r:rand})
document.ondragenter=document.ondragover=document.ondrop=ev=>{ev.dataTransfer.dropEffect="none"
ev.preventDefault()}
REG.reg.addToList(Desk.LC_init,"loadUser",1,()=>{d._auth=REG.reg.env.universe.auth
return d._auth.fetchUser()},-1e3)
REG.reg.addToList(Desk.LC_load,"buildUi",1,()=>{const body=document.body
body.buildLastDatas=p=>{if(d._app){p.appDef=d._app.appDef
p.appLD=LASTDATAS.buildLastDatas({},d._app,true)}}
body.getParentLastDatas=forChild=>{const ld=desk.lastDatas
return ld?ld.appLD:null}
body.textContent=null
REG.reg.installSkin("appFrame")
const actions=JSX.createElement(Actionables,{id:"headerActions",actions:"appframe:header:toolbar","group-order":"*","ui-context":"dialog"})
const portalTi=JSX.createElement("span",{id:"portalTi"},document.title)
const collapseActions=JSX.createElement(ButtonToggle,{id:"collapseActions",title:"Masquer",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/widgets/appFrame/collapse.svg",onclick:function(){this.toggleOn=portalTi.hidden=actions.hidden=!this.toggleOn
this.title=this.toggleOn?"Afficher":"Masquer"}})
d.appBar=JSX.createElement("span",{id:"appBar"})
d.mainBar=JSX.createElement("div",{id:"mainBar"},JSX.createElement(ShadowJsx,{skin:"appFrame/mainBar",skinOver:"webzone:invert"},JSX.createElement(Button,{id:"home",onclick:()=>{desk.gotoHome()}},JSX.createElement("div",{id:"logo"},JSX.createElement("img",{src:options&&options.iconUrl||"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/logoSC.svg",title:options.appName})),portalTi),actions,collapseActions))
d.header=body.appendChild(REG.reg.getSvc("appFrameHeader")||JSX.createElement("header",null,d.mainBar,d.appBar,JSX.createElement("div",{id:"loggedUserBox"},JSX.createElement(LoggedUser,{"î":{icon:"--user-icon",reg:options&&options.authReg||REG.reg}}))))
d.mainCtn=body.appendChild(REG.reg.getSvc("appFrameMain")||JSX.createElement("main",null))
d.mainCtn.addEventListener("c-view-change",(function(ev){if(ev.target.parentElement===this)desk.refreshTitle()}))
d.mainCtn.addEventListener("c-appdef-change",(function(ev){if(ev.target.parentElement===this)desk.updateUrlHash(ev.detail&&ev.detail.revertable===false)}))
if(document.fullscreenEnabled){d.header.append(JSX.createElement(Button,{id:"fullscreen","î":{reg:REG.reg,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/actions/portalbar/fullscreen.svg",title:"Contenu en plein écran"},onclick:AppFrameDeskFeat.requestFullscreen}))}if(UrlHashObjDeskFeat.isIn(d))d.onUrlHashChange.add(()=>d.setMainAppFromHash())
REG.reg.addToList(Desk.LIST_accelKeys,"s-accel",1,new Action("killCtrlS").setExecute((function(c,ev){ev.preventDefault()})))
REG.reg.addToList(Desk.LIST_accelKeys,"F1",1,new Action("killF1").setExecute((function(c,ev){ev.preventDefault()})))
d._auth.listeners.on("loggedUserChanged",async(oldUser,newUser)=>{await d.closeMainApp(true)
if(oldUser&&!newUser){if(UrlHashObjDeskFeat.isIn(d))await d.setUrlHash(null)}if(newUser){await d.setMainAppFromHash(desk.lastDatas)}else{const loginAct=REG.reg.getSvc("userLogin")
loginAct.execute(body)}BASIS.refreshTree(d.mainBar.shadowRoot)
BASIS.refreshTree(d.header)},100)
d._auth.listeners.on("beforeLogout",user=>{if(d._app)return VIEWS.canHideView(d._app).then(canClose=>canClose?undefined:"stop")})
if(!d._auth.config.anonymousUser){if(d._auth.currentUser==null){const loginAct=REG.reg.getSvc("userLogin")
loginAct.execute(body)}}if(d._app)d.setMainApp(d._app)
else d.setMainAppFromHash(desk.lastDatas)},1e3)
REG.reg.addToList(Desk.LC_load,"netError",1,()=>{const universe=REG.reg.env.universe
const url=new URL(universe.httpFrames.web.config.execFrameUrl.url)
if(url.hostname!=="localhost"&&url.hostname!=="127.0.0.1"){d.isServerLocal=false
window.addEventListener("offline",refreshOffline)
window.addEventListener("online",refreshOffline)
refreshOffline()}else d.isServerLocal=true},1010)
return d}static isIn(desk){return"setMainAppFromHash"in desk}onGloablKeyDown(ev){var _a,_b
if(window.desk.accelKeys.handleKeyboardEvent(ev,window)===0){(_b=(_a=window.desk._app)===null||_a===void 0?void 0:_a.accelKeyMgr)===null||_b===void 0?void 0:_b.handleKeyboardEvent(ev,window.desk._app)}}addAppBuilder(appBuilder){this._appBuilders.push(appBuilder)}setDefaultAppBuilder(appBuilder){this._defaultAppBuilder=appBuilder}onLdSessionConflict(){const s=desk.ldSession=Math.round(Math.random()*9999999).toString(36)
location.search="?~"+s}surveyWsConnexion(ws){ws.lcListeners.on("closed",(function(code){if(code!==1e3)desk.setServerOff(true)
else{}}))
ws.lcListeners.on("opened",(function(){desk.setServerOff(false)}))
ws.msgListeners.on("liaise",this.onLiaiseMsg)}onLiaiseMsg(m){if(m.type!=="maintenance")return
if(!m.msg&&m.opType){switch(m.opType){case"update":m.msg="ATTENTION, une mise à jour du serveur est imminente"
break
case"restart":m.msg="ATTENTION, un redémarrage du serveur est imminent"
break
case"shutdown":m.msg="ATTENTION, l\'arrêt du serveur est imminent"
break}}desk.setMaintenanceMsg(m.msg,m.until)}setServerOff(off){this.isServerOff=off
this.maintenanceMsg=null
this.refreshErr()}setMaintenanceMsg(msg,until){const now=Date.now()
if(!until)until=now+3e4
const delay=until-now
if(delay>500){this.maintenanceMsgUntil=until
this.maintenanceMsg=msg
this.refreshErr()
setTimeout(()=>{if(this.maintenanceMsg===msg){this.maintenanceMsg=null
this.refreshErr()}},delay)}}refreshErr(){if(this.isServerOff){this.setHeadband("Votre connexion au serveur est interrompue ou instable","error")}else if(!this.isServerLocal&&!navigator.onLine){this.setHeadband("Vous n\'êtes pas connecté·e au réseau, accès impossible au serveur.","error")}else if(this.maintenanceMsg){this.setHeadband(this.maintenanceMsg,"warning")}else{this.setHeadband(null)}}setHeadband(msg,level,icon){if(msg){if(!this._headband)this._headband=JSX.createElement(MsgLabel,{class:"headband"})
if(!this._headband.isConnected)document.body.insertBefore(this._headband,this.mainCtn)
this._headband.setCustomMsg(msg,level,icon)}else{if(this._headband&&this._headband.isConnected)this._headband.remove()}}async setMainAppDef(appDef){for(const bd of this._appBuilders){if(bd.isAppDefMatch(appDef)){return this.setMainApp(await bd.loadBody({reg:REG.reg,appDef:appDef,hasHeadTitleBar:true}))}}return false}async setMainAppFromHash(useLD){if(this._updtHashFromHere)return
const appDef=UrlHashObjDeskFeat.isIn(this)?this.getUrlHash():useLD&&useLD.appDef
try{if(appDef){if(this._app&&this._app.updateAppDef(appDef))return
for(const bd of this._appBuilders){if(bd.isAppDefMatch(appDef)){if(!await this.setMainApp(await bd.loadBody({reg:REG.reg,appDef:appDef,lastDatas:useLD&&useLD.appDef&&bd.isAppDefMatch(useLD.appDef)?useLD.appLD:null,hasHeadTitleBar:true}))){let fbApp=appDef.fbApp
while(fbApp){if(await this.setMainAppDef(fbApp))return
fbApp=fbApp.fbApp}throw""}return}}if(useLD&&useLD.appDef){for(const bd of this._appBuilders){if(bd.isAppDefMatch(useLD.appDef)){if(!await this.setMainApp(await bd.loadBody({reg:REG.reg,appDef:useLD.appDef,lastDatas:useLD.appLD,hasHeadTitleBar:true})))throw""
return}}}}if(this._defaultAppBuilder){if(!await this.setMainApp(await this._defaultAppBuilder.loadBody({reg:REG.reg,appDef:appDef||{},hasHeadTitleBar:true})))throw""}else{if(await this.closeMainApp()===false)throw""}}catch(e){await ERROR.log("Failed to load app",e)
this.updateUrlHash()}}async findAndOpenApp(appDef,ev,options){for(const bd of this._appBuilders){if(bd.isAppDefMatch(appDef)){const nmAppDef={}
Object.assign(nmAppDef,appDef)
if("normalizeAppDef"in bd)bd.normalizeAppDef(nmAppDef)
if((ev instanceof MouseEvent||ev instanceof KeyboardEvent)&&ACTION.isAccelPressed(ev)){const url=new URL(document.location.href)
url.hash=CDM.stringify(nmAppDef)
window.open(url.href,"_blank")
return true}await this.setMainApp(await bd.loadBody({reg:REG.reg,appDef:nmAppDef,hasHeadTitleBar:true}))
return true}}return false}async openApp(appBuilder,appDef,options){await this.setMainApp(await appBuilder.loadBody({reg:REG.reg,appDef:appDef,hasHeadTitleBar:true}))}async setMainApp(app){if(this.fAppIniting)this.fAppIniting=this.fAppIniting.finally(()=>this.fAppIniting=this.setMainAppChained(app))
else this.fAppIniting=this.setMainAppChained(app)
return this.fAppIniting}async setMainAppChained(app){if(this.mainCtn&&(this._auth.currentUser||app.anonymousAllowed)){const oldApp=this._app
if(oldApp&&await(oldApp===app?this.hideMainApp():this.closeMainApp())===false)return false
this._app=this.mainCtn.appendChild(app)
VIEWS.onViewShown(app)
await this._app.initializedAsync
this.refreshTitle()
this.updateUrlHash()
if(this._app!==app||this._app.appErrorStatus!=null)return false}else{this._app=app}return true}async gotoHome(){if(this._defaultAppBuilder){return this.setMainApp(await this._defaultAppBuilder.loadBody({reg:REG.reg,appDef:{},hasHeadTitleBar:true}))}else{const ok=await this.closeMainApp()
if(ok)this.updateUrlHash()
return ok}}updateUrlHash(replace){if(UrlHashObjDeskFeat.isIn(desk)){try{this._updtHashFromHere=true
desk.setUrlHash(this._app?this._app.appDef:null,replace)}finally{this._updtHashFromHere=false}}}isMainAppAvailable(){return this._app!=null}async hideMainApp(force){const app=this._app
const wasAlive=app&&app.isConnected
if(wasAlive&&!force&&!await VIEWS.canHideView(app))return false
if(!await POPUP.closeAllPopup(app))return false
if(this._app!==app)return undefined
this.mainCtn.textContent=null
if(wasAlive)VIEWS.onViewHidden(app)
return true}getMainApp(){return this._app}async closeMainApp(force){const app=this._app
if(app){try{if(!force&&app.isConnected&&!await VIEWS.canHideView(app))return false
if(!await POPUP.closeAllPopup(app))return false
if(this._app!==app)return undefined
this._app=null
this.mainCtn.textContent=null
VIEWS.onViewHidden(app,true)
this.refreshTitle()}catch(e){console.log(e)}}else{this.mainCtn.textContent=null}return true}async reloadMainApp(force){var _a
const appDef=(_a=this._app)===null||_a===void 0?void 0:_a.appDef
if(appDef&&await this.closeMainApp(force))return this.findAndOpenApp(appDef)
return false}showInfo(text){POPUP.showNotif(text,document.body)}refreshTitle(){var _a
const appTitle=this._app?VIEWS.getLabel(this._app):null
document.title=appTitle?appTitle+" - "+this.initialTitle:this.initialTitle
if(typeof((_a=this._app)===null||_a===void 0?void 0:_a.getHeadTitleBar)==="function"){const bar=this._app.getHeadTitleBar()
if(this.appBar.firstElementChild!==bar){this.appBar.textContent=null
if(bar)this.appBar.appendChild(bar)}}else{this.appBar.textContent=null
this.appBar.append(JSX.createElement("div",{class:"appTitle"},appTitle))}if(Desk.electron)window.postMessage({type:"client:server:refreshTitle",appTitle:appTitle,initialTitle:this.initialTitle},location.origin)}static async requestFullscreen(){if(Desk.electron){const exitButton=(new Button).initialize({uiContext:"dialog",label:"Quitter le mode plein-écran (Échap)"})
const notif=POPUP.showNotifInfo(JSX.createElement("p",null,JSX.createElement("span",null,"L\'application est désormais en mode plein écran."),exitButton),document.body,null,{viewPortY:"top"})
exitButton.addEventListener("click",async()=>{notif.close()
await document.exitFullscreen()},{once:true})}await document.body.requestFullscreen()}}function refreshOffline(){window.desk.refreshErr()}REG.reg.registerSkin("appFrame",1,`\n\tbody {\n\t\tmargin: 0;\n\t\tpadding: 0;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\theight: 100vh;\n\t\toverflow: hidden;\n\t}\n\n\t:focus-visible {\n\t\toutline: var(--focus-outline);\n\t}\n\n\theader {\n\t\tdisplay: flex;\n\t\tmin-height: auto;\n\t\tmin-width: 0;\n\t\tflex-wrap: wrap;\n\t\talign-items: center;\n\t\tbackground-color: var(--page-bgcolor);\n\t\tbox-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);\n\t\tz-index: 1;\n\t}\n\n\t#appBar {\n\t\tflex: 1 0 auto;\n\t\talign-self: stretch;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\talign-items: center;\n\t}\n\n\t.appTitle {\n\t\tfont-weight: bold;\n\t\tmargin-inline: .3em;\n\t\tuser-select: none;\n\t}\n\n\t#fullscreen {\n\t\tmin-width: max-content;\n\t\tborder: none;\n\t\tborder-radius: 0;\n\t\tmargin: 0 .3em;\n\t\t--bgcolor: transparent;\n\t\talign-self: stretch;\n\t\tfont-size: 80%;\n\t}\n\n\tc-loggeduser {\n\t\t--label-size: 1rem;\n\t\tmargin: 0 .3em;\n\t\t--user-icon: url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/actions/portalbar/user.svg');\n\t}\n\n\t#loggedUserBox {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\talign-self: stretch;\n\t}\n\n\t.headband {\n\t\twhite-space: pre;\n\t}\n\n\tmain {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\tbody:fullscreen {\n\t\tbackground-color: var(--bgcolor);\n\t}\n\n\tbody:fullscreen > header, body:fullscreen > hr {\n\t\tdisplay: none;\n\t}\n`)
REG.reg.registerSkin("appFrame/mainBar",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: auto;\n\t\tmin-width: 0;\n\t\tflex-wrap: wrap;\n\t\talign-items: center;\n\t\talign-self: stretch;\n\t}\n\n\t:focus-visible {\n\t\toutline: var(--focus-outline);\n\t}\n\n\t[hidden] {\n\t\tdisplay: none !important;\n\t}\n\n\t#home {\n\t\talign-self: stretch;\n\t\tfont-size: 1rem;\n\t}\n\n\t#logo {\n\t\tflex: 0 0 auto;\n\t\tdisplay: flex;\n\t\tmin-width: fit-content;\n\t\tmin-height: auto;\n\t\talign-items: center;\n\t\tmargin-inline-end: .5em;\n\t\tpadding: .1em;\n\t\tborder-radius: .3em;\n\t\tbackground-color: #FFF;\n\t}\n\n\t#logo > img {\n\t\tmax-height: 2em;\n\t}\n\n\t#portalTi {\n\t\tflex: 0 0 auto;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tfont-weight: bold;\n\t}\n\n\t#headerActions {\n\t\tdisplay: flex;\n\t\tmin-height: min-content;\n\t\tmin-width: 0;\n\t\tflex-flow: wrap;\n\t\talign-self: stretch;\n\t\tborder-inline: 1px solid var(--border-color);\n\t}\n\n\t#headerActions > c-action {\n\t\tmin-width: max-content;\n\t\tborder: none;\n\t\tborder-radius: 0;\n\t\tmargin: 0 .3em;\n\t\talign-self: stretch;\n\t\tfont-size: 80%;\n\t}\n\n\t#collapseActions {\n\t\talign-self: stretch;\n\t\tpadding: 0;\n\t\tborder: none;\n\t}\n\n  #collapseActions[aria-pressed="true"],\n  #collapseActions:lang(ar) {\n\t  transform: scaleX(-1);\n\t  background-color: unset;\n  }\n\n  #collapseActions[aria-pressed="false"]:lang(ar) {\n\t  transform: none;\n  }\n\n  hr {\n\t  border-top: 1px solid var(--border-color);\n\t  border-inline-start: 1px solid var(--border-color);\n\t  border-inline-end: none;\n\t  border-bottom: none;\n\t  margin: .2rem;\n\t  align-self: stretch;\n  }\n`)
export class ContextMenuDeskFeat extends Desk{constructor(){super(...arguments)
this.contextMenuCustom="main"}static add(desk,mode,reg=REG.reg){if(this.isIn(desk))return desk
const d=desk
desk.assignProps(this)
d.setContextMenuCustom(mode)
document.body.addEventListener(Desk.electron?"c-contextmenu":"contextmenu",d.showContextMenu)
REG.reg.addToList(Desk.LIST_accelKeys," -accel",1,new Action("contextMenu").setExecute((function(c,ev){d.showContextMenu.call(document.body,ev)})))
REG.reg.addToList(Desk.LC_init,"contextMenu",1,()=>{const univ=reg.env.universe
const auth=univ?univ.auth:null
if(auth){if(auth.currentAuthenticatedUser)d.setContextMenuCustom(reg.getUserData("contextMenu"))
auth.listeners.on("loggedUserChanged",()=>{d.setContextMenuCustom(reg.getUserData("contextMenu"))})}})
document.body.addEventListener("mousedown",ev=>{if(ev.button==2&&ev.shiftKey)ev.preventDefault()})
return d}static isIn(desk){return"contextMenuCustom"in desk}setContextMenuCustom(mode){this.contextMenuCustom=mode!=="secondary"||Desk.electron?"main":mode}showContextMenu(ev){if(ev instanceof MouseEvent){if(desk.contextMenuCustom==="main"){if(ev.shiftKey)return}else{if(!ev.shiftKey)return}ev.preventDefault()}let node=DOMSH.findDeepActiveElement(DOMSH.findDocumentOrShadowRoot(this))
while(node&&node!==this){if("ctxMenuActions"in node){const menu=node.ctxMenuActions
if(menu&&menu.actions&&menu.actions.length>0){let anchor
if("pageX"in ev&&ev.which>0){anchor={initX:menu.rect?GFX.bound(menu.rect.left,ev.pageX,menu.rect.right):ev.pageX,initY:menu.rect?GFX.bound(menu.rect.top,ev.pageY,menu.rect.bottom):ev.pageY}}else if(menu.rect){anchor={initX:menu.rect.left,initY:menu.rect.bottom}}else{const focused=DOMSH.findDeepActiveElement()||ev.target
anchor={posFrom:focused,intersectWith:DOMSH.findFlatParentElt(focused,null,n=>n instanceof HTMLElement?n.scrollHeight>n.clientHeight:false)}}const from=DOMSH.findDeepActiveElement()
if(Desk.electron){if(ev.detail&&ev.detail.misspelledWord){menu.actionContext[ACTION.spellcheckSymbol]={misspelledWord:ev.detail.misspelledWord,dictionarySuggestions:ev.detail.dictionarySuggestions}}else{delete menu.actionContext[ACTION.spellcheckSymbol]}}return POPUP.showPopupActions({actions:menu.actions,actionContext:menu.actionContext,restoreFocus:from},anchor,from||ev.target)}return}node=DOMSH.findParentElt(node)}}}export class SecFetchDeskFeat extends Desk{static add(desk){if(this.isIn(desk))return desk
desk.assignProps(this)
const d=desk
REG.reg.addToList(Desk.LC_init,"checkSecFetch",1,async()=>{let secFetchAware
try{secFetchAware=await d.checkSecFetchSiteAware()}catch(e){d.showErrorInfo(d.getNoNetworkMsg())
throw e}if(!secFetchAware){d.showErrorInfo(d.getNoSecFetchMsg())
throw Error("Sec-Fetch standard not available in this browser")}},-1e5)
return d}static isIn(desk){return"checkSecFetchSiteAware"in desk}async checkSecFetchSiteAware(){return REG.reg.env.universe.isSecFetchSiteAware()}showErrorInfo(elt){document.body.textContent=null
document.body.append(elt)}getNoSecFetchMsg(){return JSX.createElement("main",null,JSX.createElement("h2",null,"Votre navigateur est incompatible avec ce service"),JSX.createElement("p",null,"Votre navigateur n\'assume pas une fonction nécessaire à la sécurité de ce service : ",JSX.createElement("a",{href:"https://w3c.github.io/webappsec-fetch-metadata"},"Fetch Metadata Request Headers")),JSX.createElement("p",null,"Voici une liste de navigateurs connus qui dans leurs dernières versions sont compatibles avec ce service :"),JSX.createElement("ul",null,Desk.knownNavCompat.map(v=>v.url?JSX.createElement("li",null,JSX.createElement("a",{href:v.url},v.name)):JSX.createElement("li",null,v.name))))}getNoNetworkMsg(){return JSX.createElement("main",null,JSX.createElement("h2",null,"Serveur inaccessible"),JSX.createElement("p",null,"Le serveur ne semble pas accessible. Vérifiez votre connexion et essayez ultérieurement."))}}let currentMaintenanceDialog
REG.reg.registerSvc("maintenanceCb",1,(function(universe,msg){if(!currentMaintenanceDialog){currentMaintenanceDialog=POPUP.showDialog(JSX.createElement("section",{style:"margin:.5em"},JSX.createElement("p",null,msg[0].label),JSX.createElement(Button,{"î":{label:"Fermer",uiContext:"dialog"},onclick:function(){POPUP.findPopupableParent(this).close()}})),document.body,{titleBar:{barLabel:{label:"Opérations de maintenance en cours"}}})
currentMaintenanceDialog.onNextClose().then(()=>{currentMaintenanceDialog=null})}}))

//# sourceMappingURL=appFrame.js.map