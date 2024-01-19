import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{DynGen}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/dynGen.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{CDM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/cdm.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{ButtonActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
export class ItemDynGen extends BaseElement{constructor(){super(...arguments)
this.onViewBehaviour="home"}get currentGen(){return this._currentGen}set currentGen(gen){this._currentGen=gen
this._updateSkins()
this.reloadFrame()}get currentSkin(){return this._currentSkin}set currentSkin(skinCode){this._currentSkin=skinCode
this.refresh()
this.reloadFrame()}reloadFrame(){var _a,_b
const config=this.view.configs
config.c=(_a=this._currentGen)===null||_a===void 0?void 0:_a.code
config.gp=Object.assign({},(_b=this._currentGen)===null||_b===void 0?void 0:_b.genProps,{skin:this._currentSkin})
this.view.genFrame.src=this.view.getDynGenUrl(config).url}refreshFrame(){var _a,_b
const config=this.view.configs
config.c=(_a=this._currentGen)===null||_a===void 0?void 0:_a.code
config.gp=Object.assign({},(_b=this._currentGen)===null||_b===void 0?void 0:_b.genProps,{skin:this._currentSkin})
this.view.genFrame.contentWindow.location.reload()}_initialize(init){var _a,_b
this.reg=this.findReg(init)
if(init.onViewBehaviour)this.onViewBehaviour=init.onViewBehaviour
if(!init.generators||!init.generators.length){ERROR.log("No generator specified")
return}const firstGen=init.generators[0]
this._currentGen=firstGen
this._currentSkin=firstGen.genProps&&firstGen.genProps.skin||"default"
if(!init.srcRef&&ITEM.isHistoryOrTrashUri(this.reg.env.longDesc.srcUri)){this._attach(this.localName,init,ITEM.isTrashUri(this.reg.env.longDesc.srcUri)?JSX.createElement("c-msg",{label:"Vue non disponible pour un item en corbeille"}):JSX.createElement("c-msg",{label:"Vue non disponible pour une entrée d\'historique"}))
return}this.view=(new DynGen).initialize({reg:this.reg,w:this.reg.env.wsp.code,c:(_a=this._currentGen)===null||_a===void 0?void 0:_a.code,r:init.srcRef||SRC.srcRef(this.reg.env.longDesc),gp:(_b=this._currentGen)===null||_b===void 0?void 0:_b.genProps,autoResize:init.autoResize})
if(!("toolbar"in init)||init.toolbar){const toolbarConf=init.toolbar&&typeof init.toolbar==="object"?init.toolbar:{}
this.actionsBar=(new BarActions).initialize({actions:this.reg.mergeLists("actions:wsp-item-dyngen",toolbarConf.actionsList),actionContext:this})
if(init.generators.length>1){const genActions=[]
for(const genDatas of init.generators){if(!genDatas.iconUrl){if(genDatas.icon)genDatas.iconUrl=this.reg.env.itemType.datas.wspResUrl.resolve(genDatas.icon).url
else genDatas.iconUrl="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/generators/gen_web.svg"}genActions.push(new SelectGenAction(genDatas))}this.genSelector=(new ButtonActions).initialize({actions:genActions,actionContext:this,title:"Sélection du rendu"})}if(toolbarConf.skinSelector!==false){this.skinSelector=(new ButtonActions).initialize({actions:[],actionContext:this,hidden:true,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/itemDynGen/skinSelect.svg",title:"Sélection de l\'habillage graphique"})}this.toolbar=JSX.createElement("div",{id:"toolBar"},JSX.createElement("div",{id:"selectors"},this.genSelector,this.skinSelector),this.actionsBar)
if(toolbarConf.refresh===true)this.actionsBar.actions.push(refreshAction)
if(toolbarConf.gotoHome!==false)this.actionsBar.actions.push(gotoHomeAction)
if(toolbarConf.openInNewTab!==false)this.actionsBar.actions.push(openInNewTabAction)
if(toolbarConf.copyUrl!==false)this.actionsBar.actions.push(copyUrlAction)}this._attach(this.localName,init,this.toolbar,this.view)
this._updateSkins()}async _updateSkins(){if(this.skinSelector){const{itemDynGenUrl:itemDynGenUrl}=this.reg.env.universe.wspServer.config
const skins=await itemDynGenUrl.fetchJson(IO.qs("cdaction","GetSkins","wspCd",this.reg.env.wsp.code,"refUri",this.view.configs.r,"cdGen",this.currentGen.code))
this.availableSkins={}
for(const skin of skins)this.availableSkins[skin.code]=skin
if(!(this._currentSkin in this.availableSkins)&&skins.length>0)this._currentSkin=skins[0].code
if(skins.length>1){this.skinSelector.actions=skins.map(skin=>new SelectSkinAction(skin.code,skin.title))
DOM.setHidden(this.skinSelector,false)}else{DOM.setHidden(this.skinSelector,true)}}this.refresh()}_refresh(){var _a
if(this.actionsBar)this.actionsBar.refreshContent()
if(this.genSelector){const genDatas=this.currentGen
this.genSelector.icon=genDatas.iconUrl
this.genSelector.label=genDatas.label}if(this.hasSkinSelector()&&this.availableSkins){this.skinSelector.label=this.availableSkins[this.currentSkin].title}if(this.toolbar)DOM.setHidden(this.toolbar,!this.hasGenSelector()&&!this.hasSkinSelector()&&(!this.actionsBar||((_a=this.actionsBar.actions)===null||_a===void 0?void 0:_a.length)===0))}hasGenSelector(){return this.genSelector&&!this.genSelector.hidden}hasSkinSelector(){return this.skinSelector&&!this.skinSelector.hidden}onViewShown(){if(this.view){if(this.view.genFrame.src==="about:blank"){this.reloadFrame()}else if(this._forceRefreshOnViewShown){this.refreshFrame()
this._forceRefreshOnViewShown=undefined}this.view.onViewShown()}}onViewHidden(closed){if(this.view){if(!closed){if(this.onViewBehaviour=="home")this.view.genFrame.src="about:blank"
else if(this.onViewBehaviour=="refresh")this._forceRefreshOnViewShown=true}this.view.onViewHidden(closed)}}visitViews(visitor){if(this.view)return visitor(this.view)}visitViewsAsync(visitor,options){return this.view?visitor(this.view):Promise.resolve(undefined)}}REG.reg.registerSkin("wsp-item-dyngen",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex: 1;\n\t\tflex-direction: column;\n\t}\n\n\t#toolBar {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tjustify-content: space-between;\n\t}\n\n\t#toolBar[hidden] {\n\t\tdisplay: none;\n\t}\n\n\t#selectors {\n\t\tdisplay: flex;\n\t}\n\n\twsp-dyngen {\n\t\twidth: 100%;\n\t\theight: 100%;\n\t}\n`)
customElements.define("wsp-item-dyngen",ItemDynGen)
class SelectGenAction extends Action{constructor(genDatas){super()
this.genDatas=genDatas}getLabel(ctx){return this.genDatas.label||super.getLabel(ctx)}getIcon(ctx){return this.genDatas.icon||super.getIcon(ctx)}isToggle(ctx){return true}getDatas(api,ctx){return ctx.currentGen===this.genDatas}execute(ctx,ev){ctx.currentGen=this.genDatas}}class SelectSkinAction extends Action{constructor(id,label){super(id)
this._label=label}isToggle(ctx){return true}getDatas(api,ctx){return ctx.currentSkin==this._id}execute(ctx,ev){ctx.currentSkin=this._id}}class ItemDynGenUrlAction extends Action{isEnabled(ctx){try{ctx.view.genFrame.contentWindow.location.href}catch(e){return false}return true}_getCurrentAppUrl(ctx){try{const dynGen=ctx.view
const baseUrl=dynGen.getDynGenUrl({w:dynGen.configs.w,c:dynGen.configs.c,r:dynGen.configs.r,gp:dynGen.configs.gp,pp:""})
const currentLoc=dynGen.genFrame.contentWindow.location
if(currentLoc.href.indexOf(baseUrl.url)==0){const baseUrlObj=new URL(baseUrl.url)
const appUrl=IO.resolveUrl("#"+CDM.stringify({dynGen:{w:dynGen.configs.w,c:dynGen.configs.c,r:dynGen.configs.r,gp:dynGen.configs.gp,pp:currentLoc.pathname.substr(baseUrlObj.pathname.length),qs:currentLoc.search?currentLoc.search.substr(1):undefined}}),null)
return appUrl}else{return currentLoc.href}}catch(e){ERROR.log("Unable to retrieve the dynGen url",e)
return null}}}const refreshAction=new Action("refresh").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/refresh.svg").setLabel("Actualiser").setExecute((function(ctx){ctx.refreshFrame()}))
const gotoHomeAction=new Action("gotoHome").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/itemDynGen/gotoHome.svg").setLabel("Accueil").setExecute((function(ctx){ctx.reloadFrame()}))
const copyUrlAction=new ItemDynGenUrlAction("copyUrl").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/itemDynGen/copyUrl.svg").setLabel("Copier l\'adresse de la page en cours").setExecute((async function(ctx){const appUrl=this._getCurrentAppUrl(ctx)
if(appUrl){await navigator.clipboard.writeText(appUrl)
POPUP.showNotifInfo("L\'adresse a été copiée dans le presse-papier.",ctx)}else{POPUP.showNotifError("Impossible de copier l\'adresse dans le presse-papier. Vérifiez dans votre navigateur que vous avez autorisé ce site à accéder au presse-papier.",ctx)}}))
const openInNewTabAction=new ItemDynGenUrlAction("openInNewTab").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/itemDynGen/openInNewTab.svg").setLabel(Desk.electron?"Ouvrir dans le navigateur":"Ouvrir dans un nouvel onglet").setExecute((async function(ctx){const appUrl=this._getCurrentAppUrl(ctx)
if(appUrl){let resp=await IO.openUrlExternal(appUrl)
if(typeof resp==="object"){ERROR.log(resp.msg)
POPUP.showNotifError("Impossible d\'ouvrir l\'adresse dans le navigateur.",ctx)}}else POPUP.showNotifError("Impossible d\'ouvrir l\'adresse dans un nouvel onglet.",ctx)}))

//# sourceMappingURL=itemDynGen.js.map