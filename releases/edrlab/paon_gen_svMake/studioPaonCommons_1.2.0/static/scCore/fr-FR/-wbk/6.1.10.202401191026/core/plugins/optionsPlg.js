import{Action,ActionHackCtx,ActionMenu,ActionMenuDep}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/plugins/plugins_Perms.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/user_Perms.js"
import{EventMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{LASTDATAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lastDatas.js"
import{LastDatasDeskFeat}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/lastDatas.js"
import{CheckPrefArea,SelectPrefArea,UserPrefPageConfig}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/userPrefEditorConfig.js"
export function initApp(reg=REG.reg,options){var _a
class WrapReg extends ActionHackCtx{constructor(sub,reg){super(sub)
this.reg=reg}wrapCtx(ctx){return this.reg}initButtonNode(buttonNode,ctx){buttonNode.reg=this.reg
this.sub.initButtonNode(buttonNode,this.reg)}}function wrap(action){return new WrapReg(action,reg)}REG.reg.addToList("appframe:header:toolbar","params",1,wrap((new ActionMenuDep).setLabel("Gestion").setSkinOver("appframeHeader_options").setActionLists("appframe:header:toolbar:params").setGroupOrder("ui * users admin about").requireVisiblePerm("ui.optionsPlg")),100)
REG.reg.addToList("appframe:header:toolbar","help",1,wrap((new ActionMenuDep).setLabel("Affichage").setGroupOrder("* about").setActionLists("appframe:header:toolbar:options")),1e3)
if(options&&options.docUrl){REG.reg.addToList("appframe:header:toolbar:options","scenari",1,(new Action).setLabel("Documentation...").setGroup("about").override("execute",()=>{window.open(options.docUrl,"_blank")}),950)}REG.reg.addToList("appframe:header:toolbar:params","admin",1,wrap((new ActionMenu).setLabel("Administration système").setGroup("admin").requireVisiblePerm("ui.optionsPlg.admin").setActionLists("appframe:header:toolbar:params:admin")),950)
REG.reg.addToList("appframe:header:toolbar:params:admin","notifUsers",1,wrap(new Action("notifUsers").setLabel("Notifications pour maintenance").requireVisiblePerm("ui.optionsPlg.notif").setVisible((ctx,action)=>!ctx.reg.env.universe.auth.config.noAuthentication&&action.checkObjectRootVisiblePerm(ctx)&&(ctx.isListFilled("plg:notifUsers:universes")||ctx.env.universe.config.liaiseUrl!=null)&&!ctx.env.universe.config.isDesktopApp).setExecute((async function(ctx,event){(await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/notifUsers.js")).openNotifUsers(ctx.isListFilled("plg:notifUsers:universes")?ctx.getList("plg:notifUsers:universes").map(elt=>elt.reg):[ctx])}))),10)
REG.reg.addToList("appframe:header:toolbar:options","about",1,wrap(new Action("about").setLabel("À propos...").setGroup("about").setExecute((async function(reg){await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/about.js")
POPUP.confirm(JSX.createElement("c-about",{"î":BASIS.newInit(options?options.about:null,reg)}),document.body,{kind:null,titleBar:{barLabel:{label:"À propos"}},resizer:{},cancelLbl:null})}))),1e3)
if((_a=reg.env.universe.auth)===null||_a===void 0?void 0:_a.config.noAuthentication){reg.addToList("appframe:header:toolbar:options","prefs",1,new Action("prefs").setLabel("Préférences...").setGroup("ui").setExecute(async ctx=>{const reg=REG.findReg(ctx)
const{UserPrefEditor:UserPrefEditor}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/userPrefEditor.js")
const body=(new UserPrefEditor).initialize({reg:reg,prefEditorsList:"user:prefs"})
await body.initializedAsync
POPUP.showDialog(body,ctx,{titleBar:"Préférences",resizer:{}})}))}}export class UiThemeDeskFeat extends Desk{static add(desk,themes,reg=REG.reg){var _a
if(this.isIn(desk))return desk
const d=desk
desk.assignProps(this)
d.themes=themes||this.registerCoreThemes([])
if(d.themes.length===0)this.registerCoreThemes(d.themes,/^(light|dark)$/)
d.onThemeChange=new EventMgr
reg.addToList("appframe:header:toolbar:options","uiTheme",1,new ThemeMenu(d.themes))
const auth=(_a=reg.env.universe)===null||_a===void 0?void 0:_a.auth
const userPrefs=reg.env.universe.userDatas
if(userPrefs){reg.addToList(UserPrefPageConfig.LIST_userPrefsFrontPage,"uiTheme",1,new SelectPrefArea("uiTheme").setLabel("Thème par défaut").setDescription("Ce thème sera exploité lors de l\'ouverture de nouvelles fenêtres").setBuildOptions((selectElt,currentVal)=>{for(const s of d.themes){const value=s.getId()
selectElt.appendChild(JSX.createElement("option",{value:value,selected:value===currentVal?"":undefined,label:s.getLabel(null)}))}selectElt.appendChild(JSX.createElement("option",{value:"",selected:!currentVal?"":undefined,label:"Non spécifié"}))}))
reg.addToList(UserPrefPageConfig.LIST_userPrefsFrontPage,"gridSimpleClickPrefered",1,new CheckPrefArea("gridSimpleClickPrefered").setLabel("Privilégier le simple click au double-click").setDescription("Force le comportement de l\'application comme sur une tablette, même si une souris est disponible").setReloadAppNeeded(),50)}REG.reg.addToList(Desk.LC_init,"uiTheme",1,()=>{var _a
const ldDesk=LastDatasDeskFeat.isIn(desk)?desk:null
if(ldDesk)LASTDATAS.buildLastDatasHooks.add(datas=>{var _a
datas.uiTheme=(_a=d.currentTheme)===null||_a===void 0?void 0:_a.getId()})
d.setThemeById(((_a=ldDesk===null||ldDesk===void 0?void 0:ldDesk.lastDatas)===null||_a===void 0?void 0:_a.uiTheme)||reg.getUserData("uiTheme"))
auth===null||auth===void 0?void 0:auth.listeners.on("loggedUserChanged",()=>{var _a
d.setThemeById(((_a=ldDesk===null||ldDesk===void 0?void 0:ldDesk.lastDatas)===null||_a===void 0?void 0:_a.uiTheme)||reg.getUserData("uiTheme"))})})
return d}static registerCoreThemes(themes,selector){this.CORE_THEMES.forEach(coreTheme=>{if((!selector||coreTheme.id.match(selector))&&!themes.find(act=>act.getId()===coreTheme.id))themes.push(new ThemeAction(coreTheme.id,coreTheme.styleSheetPath).setLabel(coreTheme.label))})
return themes}static isIn(desk){return"setThemeById"in desk}static injectTheme(){if(UiThemeDeskFeat.isIn(desk))desk.injectThemeInSubFrame(this)
if(FontSizeDeskFeat.isIn(desk))desk.injectFontSizeInSubFrame(this)}setThemeById(id){const theme=id&&this.themes.find(t=>t.getId()===id)||this.getDefaultTheme()
if(!theme||theme===this.currentTheme)return
theme.setAsCurrentTheme()}getDefaultTheme(){if(window.matchMedia("(prefers-color-scheme: dark)").matches){const th=this.themes.find(t=>t.isDark)
if(th)return th}return this.themes[0]}injectThemeInSubFrame(frame){const subDoc=frame.contentDocument
const style=subDoc.createElement("link")
style.setAttribute("rel","stylesheet")
style.setAttribute("type","text/css")
subDoc.head.appendChild(style)
const refreshTheme=()=>{DOM.setAttr(style,"href",this.currentTheme&&this.currentTheme.styleSheetPath||"")}
refreshTheme()
this.onThemeChange.add(refreshTheme)
subDoc.addEventListener("visibilitychange",()=>{if(subDoc.visibilityState==="visible"){refreshTheme()
this.onThemeChange.add(refreshTheme)}else{this.onThemeChange.delete(refreshTheme)}})}}UiThemeDeskFeat.CORE_THEMES=[{id:"light",styleSheetPath:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/themes/light-bluegrey.css",label:"Thème gris-bleu"},{id:"light-contrast",styleSheetPath:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/themes/light-contrast-bluegrey.css",label:"Thème gris-bleu contrasté"},{id:"light-sand",styleSheetPath:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/themes/light-sand.css",label:"Thème sable-rouille"},{id:"light-pinkturquoise",styleSheetPath:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/themes/light-pinkturquoise.css",label:"Thème rose-turquoise"},{id:"light-contrast-greenblue",styleSheetPath:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/themes/light-contrast-greenblue.css",label:"Thème vert-bleu"},{id:"light-contrast-yellowpink",styleSheetPath:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/themes/light-contrast-yellowpink.css",label:"Thème rose-moutarde"},{id:"dark",styleSheetPath:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/themes/dark.css",label:"Thème sombre noir-bleu"},{id:"dark-greenblue",styleSheetPath:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/themes/dark-greenblue.css",label:"Thème sombre vert-bleu"},{id:"dark-greygreen",styleSheetPath:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/themes/dark-greygreen.css",label:"Thème sombre gris-vert"}]
class ThemeMenu extends ActionMenu{constructor(themes){super("theme")
this._label="Thème graphique"
this._group="ui"
this._actions=themes}isVisible(ctx){if(this._actions.length<=1)return false
return super.isVisible(ctx)}}export class ThemeAction extends Action{constructor(id,styleSheetPath){super(id)
this.styleSheetPath=styleSheetPath}get isDark(){return this._id.indexOf("dark")>=0}setAsCurrentTheme(cb){const uiTheme=document.getElementById("uiTheme")
if(uiTheme)uiTheme.remove()
const themeChanged=()=>{if(UiThemeDeskFeat.isIn(desk)){desk.currentTheme=this
desk.onThemeChange.emitCatched(this)}if(cb)cb(true)}
if(this.styleSheetPath){const linkElem=document.head.appendChild(JSX.createElement("link",{id:"uiTheme",rel:"stylesheet",type:"text/css",href:this.styleSheetPath,path:this.styleSheetPath}))
linkElem.addEventListener("load",themeChanged)
linkElem.addEventListener("error",()=>{if(uiTheme)document.head.appendChild(uiTheme)
if(cb)cb(false)})}else{themeChanged()}}isToggle(ctx){return true}getDatas(api,ctx){const uiTheme=document.getElementById("uiTheme")
return this.styleSheetPath?uiTheme!==null&&uiTheme.getAttribute("path")===this.styleSheetPath:uiTheme===null}execute(ctx,ev){this.setAsCurrentTheme()}initButtonNode(buttonNode,ctx){if(this._id===REG.findReg(ctx).getUserData("uiTheme"))buttonNode.label+=" (par défaut)"
buttonNode.style.setProperty("--icon-size","0")}}export class UiLangDeskFeat extends Desk{static add(desk,currentLangCode,langs,reg=REG.reg){if(this.isIn(desk))return desk
const d=desk
desk.assignProps(this)
d.langs=langs
d.currentLang=langs.find(l=>l.getId()==currentLangCode)||langs[0]
reg.addToList("appframe:header:toolbar:options","uiLang",1,d.newLangMenu())
return d}static isIn(desk){return"setLangByCode"in desk}newLangMenu(){return new LangMenu(this.langs).setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/actions/options/lang.svg")}setLangByCode(code){const lang=code&&this.langs.find(t=>t.getId()===code)||this.getDefaultLang()
if(!lang||lang===this.currentLang)return
lang.execute(document.documentElement)}getDefaultLang(){return this.langs[0]}}class LangMenu extends ActionMenu{constructor(langs){super("lang")
this._label="Langue"
this._group="ui"
this._actions=langs}}export class LangAction extends Action{constructor(id,frontUrl){super(id)
this.frontUrl=frontUrl}isToggle(ctx){return true}getDatas(api,ctx){const d=desk
return this===d.currentLang}execute(ctx,ev){if(UiLangDeskFeat.isIn(desk)&&desk.currentLang!=this){desk.currentLang=this
document.location.assign(this.frontUrl)
const d=desk}}}export class FontSizeDeskFeat extends Desk{static add(desk,reg=REG.reg){var _a
if(this.isIn(desk))return desk
const d=desk
desk.assignProps(this)
const sizes=[]
for(let size=6;size<=20;size+=1){sizes.push(new FontSizeAction(size))}d.onFontSizeChange=new EventMgr
const auth=(_a=reg.env.universe)===null||_a===void 0?void 0:_a.auth
reg.addToList("appframe:header:toolbar:options","fontSize",1,new FontSizeMenu(sizes))
const userPrefs=reg.env.universe.userDatas
if(userPrefs){reg.addToList(UserPrefPageConfig.LIST_userPrefsFrontPage,"fontSize",1,new SelectPrefArea("fontSize").setLabel("Taille de police par défaut").setDescription("Cette taille sera exploitée lors de l\'ouverture de nouvelles fenêtres").setBuildOptions((selectElt,currentVal)=>{for(const s of sizes){const value=s.getLabel(null)
selectElt.appendChild(JSX.createElement("option",{value:value,selected:value===currentVal?"":undefined,label:value}))}selectElt.appendChild(JSX.createElement("option",{value:"",selected:!currentVal?"":undefined,label:"Non spécifiée"}))}))}REG.reg.addToList(Desk.LC_init,"fontSize",1,()=>{var _a
const ldDesk=LastDatasDeskFeat.isIn(desk)?desk:null
if(ldDesk)LASTDATAS.buildLastDatasHooks.add(datas=>{datas.fontSize=d.currentFontSize})
const fontSize=((_a=ldDesk===null||ldDesk===void 0?void 0:ldDesk.lastDatas)===null||_a===void 0?void 0:_a.fontSize)||reg.getUserData("fontSize")
if(fontSize)d.setFontSize(fontSize)
else{document.documentElement.style.fontSize=""
if(!d.currentFontSize)d.currentFontSize=FontSizeAction.getComputedFontSize()}auth===null||auth===void 0?void 0:auth.listeners.on("loggedUserChanged",()=>{var _a
const fontSize=((_a=ldDesk===null||ldDesk===void 0?void 0:ldDesk.lastDatas)===null||_a===void 0?void 0:_a.fontSize)||reg.getUserData("fontSize")
if(fontSize)d.setFontSize(fontSize)
else{document.documentElement.style.fontSize=""
if(!d.currentFontSize)d.currentFontSize=FontSizeAction.getComputedFontSize()}})})
return d}static isIn(desk){return"setFontSize"in desk}get currentFontSizeCss(){return this.currentFontSize+"pt"}setFontSize(size){if(this.currentFontSize===size)return
this.currentFontSize=size
const s=this.currentFontSizeCss
document.documentElement.style.fontSize=s
this.onFontSizeChange.emitCatched(s)}injectFontSizeInSubFrame(frame){const subDoc=frame.contentDocument
const refreshFontSize=size=>{subDoc.documentElement.style.fontSize=size}
refreshFontSize(this.currentFontSizeCss)
this.onFontSizeChange.add(refreshFontSize)
subDoc.addEventListener("visibilitychange",()=>{if(subDoc.visibilityState==="visible"){refreshFontSize(this.currentFontSizeCss)
this.onFontSizeChange.add(refreshFontSize)}else{this.onFontSizeChange.delete(refreshFontSize)}})}}class FontSizeMenu extends ActionMenu{constructor(sizes){super("fontSize")
this._label="Taille de police"
this._group="ui"
this._actions=sizes}}export class FontSizeAction extends Action{constructor(_size){super("fontSize")
this._size=_size
this._label=_size.toString()
this._group="ui"}isToggle(ctx){return true}getDatas(api,ctx){const fontSize=FontSizeDeskFeat.isIn(desk)?desk.currentFontSize:FontSizeAction.getComputedFontSize()
return fontSize===this._size}execute(ctx,ev){if(FontSizeDeskFeat.isIn(desk))desk.setFontSize(this._size)
else document.documentElement.style.fontSize=this._size+"pt"}initButtonNode(buttonNode,ctx){if(this._size==REG.findReg(ctx).getUserData("fontSize"))buttonNode.label+=" (par défaut)"
buttonNode.style.setProperty("--icon-size","0")}static getComputedFontSize(){const pxFontSize=parseFloat(getComputedStyle(document.documentElement).fontSize)
return Math.round(pxFontSize*3/4*100)/100}}
//# sourceMappingURL=optionsPlg.js.map