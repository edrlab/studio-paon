import{Action,ActionMenu}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{USER}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
export class DepotLcProv{constructor(){this._states=[]
this._transitions=[]}configure(adminTree,cidServer){this._cidSrv=cidServer
this._adminUT=adminTree}async executeTransition(path,transitionKey){const transition=this.getTransition(transitionKey)
const req={cidMetas:{olderPath:path,lc:transition.code},returnProps:["scCidSessStatus"]}
const resp=await this._cidSrv.syncSend(req)
if(resp.scCidSessStatus=="commited")return transition.to
else return null}addTransition(transition){const i=this.getTransitionIndex(transition.code)
if(i==null)this._transitions.push(transition)
else this._transitions[i]=transition}getTransition(key){const i=this.getTransitionIndex(key)
return i==null?null:this._transitions[i]}getTransitionIndex(key){for(let i=0;i<this._transitions.length;i++){if(this._transitions[i].code==key)return i}return null}addState(state){const i=this.getStateIndex(state.code)
if(i==null)this._states.push(state)
else this._states[i]=state}getState(key){const i=this.getStateIndex(key)
return i==null?null:this._states[i]}getStateIndex(key){for(let i=0;i<this._states.length;i++){if(this._states[i].code==key)return i}return null}listAvailableTransitions(state,prc){let availbleTr=new Array
for(let i=0;i<this._transitions.length;i++){if(this._transitions[i].isValidTrans(state,prc))availbleTr.push(this._transitions[i])}return availbleTr}}DepotLcProv.LC_KEY="lc"
export class DepotLcTransition{constructor(init){this.code=init.code
this.label=init.label
this.iconUrl=init.iconUrl
this.restrictFromStates=init.restrictFromStates||null
this.to=init.to
this.prcWhiteList=init.prcWhiteList||[]
this.allowFromAllPrcs=init.allowFromAllPrcs||false
this.showPerms=init.showPerms||null
this.enablePerms=init.enablePerms||null
this.iconUrl=init.iconUrl||null}isValidTrans(state,prc){if(this.restrictFromStates.indexOf(state)===-1)return false
if(this.allowFromAllPrcs===false&&this.prcWhiteList.indexOf(prc)===-1)return false
return true}}export class DepotLcState{constructor(code,label,icon){this.code=code
this.label=label
this.icon=icon}}export class DepotResListTransition extends ActionMenu{constructor(){super("itemListTransition")
this._description="Changer d\'état..."}init(reg){var _a
this._reg=reg
const lstn=reg.env.nodeInfosChange
if(lstn)lstn.on("nodeChange",this.refreshNode.bind(this))
else(_a=reg.env.nodeInfosPending)===null||_a===void 0?void 0:_a.then(this.refreshNode.bind(this))
this.refreshNode()
return this}isEnabled(ctx){if(!super.isEnabled(ctx))return false
for(const action of this.getActions()){if(action.isEnabled(ctx))return true}return false}refreshNode(){const ni=this._reg.env.nodeInfos
this._state=ni?this._reg.env.lifecycle.getState(ni.metas.lc):null
this._label=this._state?this._state.label:"Chargement en cours..."
this._icon=this._state?this._state.icon:null}getActions(){let list=[]
if(this._reg.env.nodeInfos==null)return[]
if(!this._state)return[]
const transitions=this._reg.env.lifecycle.listAvailableTransitions(this._state.code,this._reg.env.nodeInfos.prc)
if(transitions!=null)for(const tr of transitions.values())list.push(new ResExecTransition(tr))
return list}}export class DepotResAction extends Action{constructor(id){super(id)}isVisible(ctx){if(!super.isVisible(ctx))return false
return this.checkResPerms(this._visResPerms,ctx)}isEnabled(ctx){if(!super.isEnabled(ctx))return false
return this.checkResPerms(this._enableResPerms,ctx)}checkResPerms(perms,ctx){if(!ctx.reg.env.nodeInfos)return false
if(perms&&ctx.reg.env.path){return ctx.reg.hasPermission(perms,ctx.reg.env.nodeInfos.roles)}return true}requireResVisiblePerm(perms){if(perms){if(Array.isArray(perms)){for(let i=0;i<perms.length;i++)this.requireResVisiblePerm(perms[i])}else{if(!this._visResPerms)this._visResPerms=[]
if(this._visResPerms.indexOf(perms)==-1)this._visResPerms.push(perms)}}return this}requireResEnabledPerm(perms){if(perms){if(Array.isArray(perms)){for(let i=0;i<perms.length;i++)this.requireResEnabledPerm(perms[i])}else{if(!this._enableResPerms)this._enableResPerms=[]
if(this._enableResPerms.indexOf(perms)==-1)this._enableResPerms.push(perms)}}return this}}export class ResExecTransition extends DepotResAction{constructor(trans,overrideExec){super(trans.code)
this.trans=trans
if(trans.showPerms)this.requireResVisiblePerm(trans.showPerms)
if(trans.enablePerms)this.requireResEnabledPerm(trans.enablePerms)
this._label=trans.label
this._icon=trans.iconUrl
if(overrideExec)this.execute=overrideExec}async execute(ctx,ev){const preActions=ctx.reg.mergeLists("lc:transitions:pre:actions","lc:transitions:"+this._id+":pre:actions")
if(preActions)for(const preAction of preActions){const preActionRes=preAction(this)
const result=preActionRes instanceof Promise?await preActionRes:preActionRes
if(result===false)return}const state=await ctx.reg.env.lifecycle.executeTransition(ctx.reg.env.path,this._id)
if(state==null){return ERROR.reportError({msg:"Une erreur est survenue durant le changement d\'état."})}}}export class ChangeUserResp extends DepotResAction{constructor(code,overrideExec){super(code)
if(overrideExec)this.execute=overrideExec}buildCustomButton(ctx,uiContext,parent){return(new ChangeUserRespBtn).initialize({reg:REG.findReg(parent,ctx),action:this,actionContext:ctx,skin:this.getSkin(ctx),skinOver:this.getSkinOver(ctx),uiContext:uiContext,role:uiContext==="menu"?"menuitem":"button"})}async execute(ctx,ev){const{UserSelector:UserSelector}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/userSelector.js")
const usersRaw=ctx.reg.env.nodeInfos.metas[this._id]
const userSelector=(new UserSelector).initialize({reg:ctx.reg,userGrid:{usersSrv:ctx.reg.env.universe.useUsers,grid:{selType:"multi",skinOver:"userRespSelector"},filterTypeInputVisibility:true},selectAndCloseOnDblClick:true,startSel:usersRaw!=null&&usersRaw.length?await ctx.reg.env.universe.useUsers.getUserSet(usersRaw):[]})
const users=await POPUP.showMenuFromEvent(userSelector,ev||ctx.reg.env.uiRoot,ctx.reg.env.uiRoot,null,{initWidth:"20em"}).onNextClose()
if(users){let usersAr=[]
for(const user of users)usersAr.push(user.account)
const req={cidMetas:{olderPath:ctx.reg.env.path},returnProps:["scCidSessStatus"]}
req.cidMetas[this._id]=JSON.stringify(usersAr)
const resp=await ctx.reg.env.universe.cid.syncSend(req)
if(resp.scCidSessStatus!=="commited")return ERROR.reportError({msg:"Une erreur est survenue durant le changement de responsabilité."})}}}REG.reg.registerSkin("userRespSelector",1,`\n.inSel {\n\tbackground-color: var(--row-inSel-bgcolor);\n}\n`)
class ChangeUserRespBtn extends ActionBtn{constructor(){super(...arguments)
this._hideLabel=false}connectedCallback(){var _a
if(this.actionContext.reg.env.nodeInfos!==null)this.onResChange(this.actionContext.reg.env.nodeInfos)
super.connectedCallback()
const lstn=this.actionContext.reg.env.nodeInfosChange
if(lstn)lstn.on("nodeChange",this._onResChange=this.onResChange.bind(this))
else(_a=this.actionContext.reg.env.nodeInfosPending)===null||_a===void 0?void 0:_a.then(ni=>{this.onResChange(ni)})}disconnectedCallback(){if(this._onResChange){this.actionContext.reg.env.nodeInfosChange.removeListener("nodeChange",this._onResChange)
this._onResChange=null}}async onResChange(niNew){if(niNew){let label=this.action.getLabel(this.actionContext)
const users=niNew.metas[this.action.getId()]
if(users&&users.length>0){label+=USER.getPrimaryName(await this.actionContext.reg.env.universe.useUsers.getUser(users[0]))
if(users.length>1)label+="..."}else label="Aucun"
this.label=label}else{this.label=""}}}customElements.define("store-resp-changeuser",ChangeUserRespBtn)

//# sourceMappingURL=collab.js.map