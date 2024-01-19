import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{GenAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/gen/genActions.js"
import{MsgOver}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{STYLER}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/styler/styler.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/styler/views/views_Perms.js"
export class StylerInstallSkinsetAction extends GenAction{constructor(id){super(id||"stylerInstallSkinset")
this._label="Installer"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/styler/views/generators/install.svg"
this._description="Installer le dernier habillage graphique compilé"
this._hideForStatuses="failed,null"
this.requireEnabledPerm("action.gen#install.genAsSkinPack")}async execute(ctx,ev){try{let skinPack=await(new MsgOver).setCustomMsg("Veuillez patienter...","info").showMsgOver(ctx.reg.env.uiRoot).waitFor(STYLER.installGenAsSkinpack(ctx.wsp,ctx.uiContext,SRC.srcRef(ctx.shortDesc),ctx.pubNode.codeGenStack,ctx.reg.env.uiRoot.lang))
if(skinPack){POPUP.showNotifInfo("L\'installation du skinpack s\'est déroulée avec succès.\nVous pouvez maintenant l\'utiliser (et l\'activer) dans les ateliers concernés.",ctx.reg.env.uiRoot,{autoHide:5e3})}else throw"no skinpack"}catch(e){return ERROR.report("L\'installation du skinpack n\'a pas pu aboutir",e)}}}StylerInstallSkinsetAction.SINGLETON=new StylerInstallSkinsetAction

//# sourceMappingURL=genActions.js.map