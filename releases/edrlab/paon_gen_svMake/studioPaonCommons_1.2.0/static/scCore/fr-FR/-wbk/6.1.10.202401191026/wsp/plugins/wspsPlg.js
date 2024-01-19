import{Action,ActionHackCtx,ActionMenu}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{SimpleTagArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{CheckPrefArea,SelectPrefArea,UserPrefPageConfig}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/userPrefEditorConfig.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/plugins/plugins_Perms.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/actions_Perms.js"
import{Wsp}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{CreateWspAction,ImportWspAction,ManageWspsAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/chainActions.js"
export function initApp(reg=REG.reg){class WrapReg extends ActionHackCtx{constructor(sub,reg){super(sub)
this.reg=reg}wrapCtx(ctx){return this.reg}initButtonNode(buttonNode,ctx){buttonNode.reg=this.reg
this.sub.initButtonNode(buttonNode,this.reg)}}function wrap(action){return new WrapReg(action,reg)}const plgCode=reg.getPref("plg.code","xChain")
const plgName=reg.getPref("plg.name","Ateliers")
const plgCheckUniverse=reg.getPref("plg.checkUniverse",true)
const d=desk
d.addAppBuilder(new WspAppBuilder(reg,plgCheckUniverse))
d.addAppBuilder(new WspDocAppBuilder(reg,plgCheckUniverse))
d.surveyWsConnexion(reg.env.universe.wsFrames.ws)
const wspsActionListCode="app:wsps:"+plgCode+":actions"
const wspsAction=wrap(new ActionMenu("wsps").setLabel(plgName).setSkinOver("appframeHeader_wsps").setActionLists("app:wsps:actions "+wspsActionListCode).setVisible(ctx=>{if(!REG.getReg(ctx).hasPerm(["ui.wspApp","ui.wspDocApp"],ctx.securityCtx))return false}).requireVisiblePerm(["ui.wspsPlg"]))
REG.reg.addToList("appframe:header:toolbar","wsps_"+plgCode,1,wspsAction)
reg.addToList(wspsActionListCode,"wspList",1,wrap(new WspListAction("wspList")),100)
reg.addToList(wspsActionListCode,"addWsp",1,wrap((new CreateWspAction).requireVisiblePerm("ui.wspsPlg.create")),110)
reg.addToList(wspsActionListCode,"importWsp",1,wrap((new ImportWspAction).requireVisiblePerm("ui.wspsPlg.import")),120)
reg.addToList(wspsActionListCode,"manageWsps",1,wrap((new ManageWspsAction).requireVisiblePerm("ui.wspsPlg.manage")),200)
const userPrefsListCd=`user:prefs:${plgCode}`
REG.reg.addToList(UserPrefPageConfig.LIST_userPrefPages,`prl_${plgCode}`,1,new UserPrefPageConfig(reg).setAreasList(userPrefsListCd).setLabel(plgName),2)
reg.addToList(userPrefsListCd,"wspAppPrefered",1,new CheckPrefArea("wspAppPrefered").setLabel("Privilégier le mode explorateur au mode plan").setDescription("L\'accès par défaut à l\'atelier en mode plan est remplacé par le mode explorateur"))
reg.addToList(userPrefsListCd,"wspApp:tools:generators",1,new SelectPrefArea("wspApp:tools:generators").setLabel("Emplacement du volet \'Publications\' (mode explorateur)\'").setBuildOptions((selectElt,currentVal)=>{if(!currentVal)currentVal=""
function add(cd,label){selectElt.append(JSX.createElement("option",{value:cd,selected:currentVal===cd?"":undefined},label))}add("lt","À gauche au-dessus")
add("lb","À gauche au-dessous")
add("bl","En bas à gauche")
add("br","En bas à droite")
add("rt","À droite au-dessus")
add("rb","À droite au-dessous")
add("","Non spécifié")}))
reg.addToList(userPrefsListCd,"showFlapTabs",1,new CheckPrefArea("showFlapTabs").setLabel("Masquer les onglets des volets fermés (mode explorateur)").setDescription("Le menu principal de l\'atelier permet d\'accéder aux volets fermés").setCheckStateIfNone(true).setInvertCheck().setReloadAppNeeded())}class WspListAction extends Action{buildCustomButton(ctx,uiContext,parent){import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/wspList.js")
return JSX.createElement("wsp-list",null)}}export class OpenFixedWsp extends Action{constructor(_wspCodeOrAlias,wspAppMode,id){super(id||"OpenFixedWsp")
this._wspCodeOrAlias=_wspCodeOrAlias
this.wspAppMode=wspAppMode}async execute(ctx,ev){const wsp=new Wsp(ctx.reg.env.universe.wspServer,this._wspCodeOrAlias)
await wsp.waitForLoad()
if(wsp.isLoaded){const OpenWsp=(await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/wspList.js")).OpenWsp
return new OpenWsp(this.wspAppMode).execute({reg:REG.createSubReg(ctx.reg,wsp)},ev)}else{POPUP.showNotifForbidden("L\'atelier demandé n\'existe pas ou est inaccessible.",document.body)}}}export class WspAppBuilder extends SimpleTagArea{constructor(reg,checkUnivers){super("wsp-app",reg.env.resolver.resolve(":back:wsp/apps/wspApp.js"))
this.reg=reg
this.checkUnivers=checkUnivers}isAppDefMatch(data){return typeof data.wsp==="string"&&(!this.checkUnivers||data.u===this.reg.env.universe.getId())}normalizeAppDef(data){if(!this.checkUnivers)data.u=undefined}newElt(ctx){if(!ctx.skin)ctx.skin=this.skin
if(!ctx.skinOver)ctx.skinOver=this.skinOver
ctx.reg=this.reg
return super.newElt(ctx).initialize(ctx)}}export class WspDocAppBuilder extends SimpleTagArea{constructor(reg,checkUnivers){super("wsp-doc-app",reg.env.resolver.resolve(":back:wsp/apps/wspDocApp.js"))
this.reg=reg
this.checkUnivers=checkUnivers}isAppDefMatch(data){return typeof data.wspDoc==="string"&&(!this.checkUnivers||data.u===this.reg.env.universe.getId())}normalizeAppDef(data){if(!this.checkUnivers)data.u=undefined}newElt(ctx){if(!ctx.skin)ctx.skin=this.skin
if(!ctx.skinOver)ctx.skinOver=this.skinOver
ctx.reg=this.reg
return super.newElt(ctx).initialize(ctx)}}
//# sourceMappingURL=wspsPlg.js.map