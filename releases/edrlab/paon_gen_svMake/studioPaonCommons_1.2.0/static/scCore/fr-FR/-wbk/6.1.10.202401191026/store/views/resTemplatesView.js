import{BaseAreaViewAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{RES}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/res.js"
import{AddByImport,ImportRes,ResEditAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/actions/resActions.js"
import{URLTREE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/urlTree.js"
import{InfoBrokerBasic}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/infos.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
export class ResTemplatesView extends BaseAreaViewAsync{async _initialize(init){this.reg=init.areaContext.reg||this.findReg(init)
super._initialize(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
await this.fetchChildrenQuery()
const actionContext={reg:this.reg,infoBroker:new InfoBrokerBasic,emitter:this}
const bars=[]
if(init.homePrc){const bar=JSX.createElement(BarActions,{id:"homeTplActions","î":{reg:this.reg,actions:this.getHomeActions(init),actionContext:actionContext,uiContext:"dialog",disableFullOverlay:true}})
sr.appendChild(JSX.createElement("section",{id:"homeTpl"},JSX.createElement("h3",null,init.homeTitle||"Accueil dynamique des dossiers"),init.homeDetails||JSX.createElement("div",null,JSX.createElement("p",null,"Cette page gabarit est appliquée sur ce dossier et ses sous-dossiers sauf si un accueil personnalisé du dossier a été importé."),JSX.createElement("p",null,"Elle inclut généralement du code (javascript) permettant de lister le contenu du dossier.")),bar))
bars.push(bar)}if(init.notFoundPrc){const bar=JSX.createElement(BarActions,{id:"homeTplActions","î":{reg:this.reg,actions:this.getNotFoundActions(init),actionContext:actionContext,uiContext:"dialog",disableFullOverlay:true}})
sr.appendChild(JSX.createElement("section",{id:"homeTpl"},JSX.createElement("h3",null,init.notFoundTitle||"Page « non trouvée » (404)"),init.notFoundDetails||JSX.createElement("div",null,JSX.createElement("p",null,"Cette page est affichée lorsqu\'un utilisateur demande un dossier ou une ressource (dans ce dossier ou ses sous-dossiers) qui n\'existe pas ou est en état supprimé (erreur 404).")),bar))
bars.push(bar)}if(init.authPrc){const bar=JSX.createElement(BarActions,{id:"authTplActions","î":{reg:this.reg,actions:this.getAuthActions(init),actionContext:actionContext,uiContext:"dialog",disableFullOverlay:true}})
sr.appendChild(JSX.createElement("section",{id:"authTpl"},JSX.createElement("h3",null,init.authTitle||"Page d\'authentification"),init.authDetails||JSX.createElement("div",null,JSX.createElement("p",null,"Cette page est affichée lorsqu\'un utilisateur demande une ressource (dans ce dossier ou ses sous-dossiers) sans avoir des droits suffisants (erreur 401 ou 403). Elle permet de gérer la connexion ou les changements de comptes.")),bar))
bars.push(bar)}this.reg.env.nodeInfosChange.on("childChange",async m=>{if(URLTREE.isQueryPath(m.path)){await this.fetchChildrenQuery()
bars.forEach(bar=>bar.refreshContent())}})}getHomeActions(init){return[new ImportHiddenRes("homeImport","?home",init.homePrc).setLabel("Importer un accueil dynamique des dossiers"),new DeleteHiddenRes("homeDelete","?home").setLabel("Supprimer l\'accueil dynamique personnalisé")]}getNotFoundActions(init){return[new ImportHiddenRes("notFoundImport","?notFound",init.notFoundPrc).setLabel("Importer une page 404 personnalisée"),new DeleteHiddenRes("notFoundDelete","?notFound").setLabel("Supprimer la page 404 personnalisée")]}getAuthActions(init){return[new ImportHiddenRes("authImport","?authPage",init.authPrc).setLabel("Importer une page d\'authentification personnalisée"),new DeleteHiddenRes("authDelete","?authPage").setLabel("Supprimer la page d\'authentification personnalisée")]}async fetchChildrenQuery(){this.childrenQueryNodes=await this.reg.env.universe.adminUrlTree.listChildren(this.reg.env.path,`&excludeAll&childrenProps=${RES.NODEPROPS_short}&childrenFilter=isQuery`)}}export class ImportHiddenRes extends ImportRes{constructor(id,subPath,prc){super(id)
this.subPath=subPath
this.prc=prc}isVisible(ctx){return ResEditAction.prototype.isVisible.call(this,ctx)}async execute(ctx,ev){const uiCtx=AddByImport.getUiCtx(ctx,ev)
const files=await AddByImport.pickFiles(false)
if(files)return ImportRes.doImport(files[0],{path:URLTREE.appendToPath(ctx.reg.env.nodeInfos.permaPath,this.subPath),processing:this.prc,olderResId:""},ctx,uiCtx)}}export class DeleteHiddenRes extends ResEditAction{constructor(id,subPath){super(id)
this.subPath=subPath
this._description="Supprimer définitivement ce gabarit (restauration impossible)"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/removeRes.svg"
this._group="edit"
this._enablePerms="action.store#remove.res"}isVisible(ctx){var _a
if(!((_a=ctx.emitter.childrenQueryNodes.ch)===null||_a===void 0?void 0:_a.find(n=>n.n==this.subPath)))return false
return super.isVisible(ctx)}async execute(ctx,ev){const uiCtx=ResEditAction.getUiCtx(ctx,ev)
if(await POPUP.confirm("Supprimer définitivement cette page ?",uiCtx,{okLbl:"Supprimer définitivement"})){return ResEditAction.sendCidUpdate({path:URLTREE.appendToPath(ctx.reg.env.nodeInfos.permaPath,this.subPath),action:"removeAll"},ctx,uiCtx)}}}REG.reg.registerSkin("store-res-templates",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t}\n\n\th3 {\n\t\tcolor: var(--alt1-color);\n\t}\n`)
customElements.define("store-res-templates",ResTemplatesView)

//# sourceMappingURL=resTemplatesView.js.map