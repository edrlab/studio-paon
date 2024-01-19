import{InfoFocusItem,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{LIFECYCLE,TASK}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/lcTask.js"
import{SrcAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{ActionMenuDep}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
export class CreateTask extends SrcAction{constructor(taskType){super(taskType.getModel())
this.taskType=taskType
this._label=taskType.getTitle()
this._icon=taskType.getIcon()}execute(ctx,ev){if(ctx.infoBroker){const datas={tkSt:this.taskType.getTaskInitStates(ctx)}
ctx.infoBroker.dispatchInfo(new InfoFocusItem(SRC.createNewSrcUri(this._id),null,datas),null)}}}export class SrcExecTransition extends SrcAction{constructor(trans,lcProv,overrideExec){super(trans.code)
this.trans=trans
this.lcProv=lcProv
if(trans.showPerm)this.requireSrcVisiblePerm(trans.showPerm)
if(trans.enablePerm)this.requireSrcEnabledPerm(trans.enablePerm)
this._label=trans.name
this._icon=trans.iconUrl||lcProv.getLcState(trans.targetState).iconUrl
if(overrideExec)this.execute=overrideExec}isVisible(ctx){if(this.trans.isTransitionVisible&&this.trans.isTransitionVisible(ctx.shortDescs,ctx.reg,ctx.emitter)===false)return false
if(!super.isVisible(ctx))return false
return this._checkAtLeastOne(ctx)}isEnabled(ctx){if(this.trans.isTransitionEnabled&&this.trans.isTransitionEnabled(ctx.shortDescs,ctx.reg,ctx.emitter)===false)return false
if(!super.isEnabled(ctx))return false
if(ctx.shortDescs.length>1){if(!this._checkAll(ctx))return false}return true}getGroup(ctx){return this.trans.group||super.getGroup(ctx)}_checkAll(ctx){for(const sd of ctx.shortDescs)if(!LIFECYCLE.isTransAvailable(this.trans,sd.lcSt,sd.itModel,this.lcProv))return false
return true}_checkAtLeastOne(ctx){for(const sd of ctx.shortDescs)if(LIFECYCLE.isTransAvailable(this.trans,sd.lcSt,sd.itModel,this.lcProv))return true
return false}async execute(ctx,ev){const srcRefs=[]
for(const src of ctx.shortDescs){if(TASK.isTask(src))continue
srcRefs.push(src)}if(srcRefs.length===0)return
let params
await ctx.reg.env.wsp.wspServer.wspsLive.saveItems(ctx.reg.env.wsp.code,srcRefs)
const{paramsProvider:paramsProvider}=this.trans
if(paramsProvider){params={}
if(!await paramsProvider.computeParams(params,ctx.shortDescs,ctx.reg,ctx.emitter))return}if(this.trans.controlBeforeExecute&&!await this.trans.controlBeforeExecute(ctx.shortDescs,ctx.reg,ctx.emitter,params)){if(paramsProvider===null||paramsProvider===void 0?void 0:paramsProvider.rollbackTransition)await paramsProvider.rollbackTransition(params,ctx.shortDescs,ctx.reg)
return}const result=await ITEM.execItemTransition(ctx.reg.env.wsp,ctx.emitter,this.trans.code,srcRefs,params)
if(!result.ok){return ERROR.reportError({msg:"Une erreur est survenue durant le changement d\'état.",cause:result.error,adminDetails:await result.text()})}}}export class ItemListTransition extends ActionMenuDep{constructor(){super("itemListTransition")
this._label="Changer d\'état..."
this._group="edit"}getActions(ctx){const lcProv=ctx.reg.env.wsp.wspMetaUi
if(!lcProv._listTrActions){const list=lcProv._listTrActions=[]
const transitions=lcProv.getLcTransitions()
if(transitions!=null)for(const tr of transitions.values())list.push(new SrcExecTransition(tr,lcProv))}return lcProv._listTrActions}}
//# sourceMappingURL=lcTaskActions.js.map