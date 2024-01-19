import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DiffBarPanelAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/diffBar.js"
export class DrfRefDiffAction extends DiffBarPanelAction{constructor(id){super(id||"drfRef")
this._label="Référence"}isVisible(ctx){if(!ctx.editor.reg.env.wsp.infoWsp.props.drfRefWsp)return false
return super.isVisible(ctx)}isEnabled(ctx){if(!super.isEnabled(ctx))return false
const drfState=ctx.editor.reg.env.longDesc.drfState
return drfState&&drfState.indexOf("created")<0}async buildPanel(ctx,ev){return(new((await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/wed/wspDiffBar.js")).DrfRefDiffPanel)).initPanel(this,ctx)}}REG.reg.addToList("wed.diffBar.actions","drfRef",1,new DrfRefDiffAction)
export class DrvDiffAction extends DiffBarPanelAction{constructor(id,specialRef,label){super(id)
this.specialRef=specialRef
this._label=label}isVisible(ctx){if(!ctx.editor.reg.env.wsp.infoWsp.props.drvMasterWsp)return false
return super.isVisible(ctx)}isEnabled(ctx){if(!super.isEnabled(ctx))return false
const drvState=ctx.editor.reg.env.longDesc.drvState
switch(this.specialRef){case"special:drv:default":return drvState.indexOf("created")<0
case"special:drv:done":return drvState.indexOf("Dirty")>=0&&drvState.indexOf("notOverriden")<0
case"special:drv:default:done":return drvState.indexOf("Dirty")>=0&&drvState.indexOf("created")<0}}async buildPanel(ctx,ev){return(new((await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/wed/wspDiffBar.js")).DrvDiffPanel)).initPanel(this,ctx)}}REG.reg.addToList("wed.diffBar.actions","drvDefault",1,new DrvDiffAction("drvDefault","special:drv:default","Contenu d\'origine (avant surcharge)"))
REG.reg.addToList("wed.diffBar.actions","drvDone",1,new DrvDiffAction("drvDone","special:drv:done","Précédent état achevé"))
REG.reg.addToList("wed.diffBar.actions","drvDefaultDone",1,new DrvDiffAction("drvDefaultDone","special:drv:default:done","Contenu d\'origine du précédent état \'achevé\'"))
export class HistoItemDiffAction extends DiffBarPanelAction{constructor(id){super(id||"histoItem")
this._label="Entrée d\'historique"}isVisible(ctx){if(!ctx.editor.reg.env.wsp.hasFeature("history"))return false
return super.isVisible(ctx)}async buildPanel(ctx,ev){return(new((await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/wed/wspDiffBar.js")).HistoItemDiffPanel)).initPanel(this,ctx)}}REG.reg.addToList("wed.diffBar.actions","histoItem",1,new HistoItemDiffAction)
export class OtherItemDiffAction extends DiffBarPanelAction{constructor(id){super(id||"otherItem")
this._label="Autre item"}async buildPanel(ctx,ev){return(new((await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/wed/wspDiffBar.js")).OtherItemDiffPanel)).initPanel(this,ctx)}}REG.reg.addToList("wed.diffBar.actions","otherItem",1,new OtherItemDiffAction)

//# sourceMappingURL=itemEditorExt.js.map