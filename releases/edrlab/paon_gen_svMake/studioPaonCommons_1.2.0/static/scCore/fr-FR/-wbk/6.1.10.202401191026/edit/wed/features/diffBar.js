import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
export function AgDiffBarEditor(cls){const proto=cls.prototype
const superInit=proto.initialize
proto.initialize=function(config){superInit.call(this,config)
proto.getDiffBar=getDiffBar
if(!config.hideDiffBar&&this.reg.isListFilled("wed.diffBar.actions")){this.wedMgr.accelKeyMgr.addAccelKey("d","accel shift",ToggleDiffBar.SINGLETON)
this.reg.addToList("actions:wed:commonbar:end","diffBar",1,ShowDiffBar.SINGLETON,1)}return this}
return cls}async function getDiffBar(){if(!this.diffBar){await WEDLET.importDiffLib()
if(!this.diffBar)this.diffBar=(new((await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/diffBar_.js")).WedDiffBar)).init(this)}return this.diffBar}export class ToggleDiffBar extends Action{constructor(id){super("diff"||id)
this._label="Comparer..."
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/diff/diff.svg"}isVisible(ctx){if(ctx.config.hideDiffBar)return false
return super.isVisible(ctx)}isToggle(){return true}getDatas(api,ctx){return ctx.diffBar&&!ctx.diffBar.hidden}async execute(ctx,ev){const bar=await ctx.getDiffBar()
if(bar.hidden)bar.show()
else bar.close()}}ToggleDiffBar.SINGLETON=new ToggleDiffBar
export class ShowDiffBar extends ToggleDiffBar{isToggle(){return false}isVisible(ctx){if(ctx.diffBar&&!ctx.diffBar.hidden)return false
return super.isVisible(ctx)}}ShowDiffBar.SINGLETON=new ShowDiffBar
export class DiffBarPanelAction extends Action{isToggle(ctx){return true}getDatas(api,ctx){var _a
return((_a=ctx.currentPanel)===null||_a===void 0?void 0:_a.action)===this}async execute(ctx,ev){let panel=ctx.getPanelFor(this)
if(!panel)panel=await this.buildPanel(ctx)
ctx.setCurrentPanel(panel)
panel.setDiff(ctx.initParams)}}
//# sourceMappingURL=diffBar.js.map