import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{InfoFocusRes}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/res.js"
import{URLTREE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/urlTree.js"
import{EStoreAspects}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/depot.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{AddByImport,AddFolder,Depot2ResCtxAction,ResEditAction,VisStateInvisible,VisStateLimited,VisStateVisible}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/actions/resActions.js"
export class ResAction extends Action{static restrictToRoots(resList){resList.sort(URLTREE.defaultResSortFn)
const newList=[resList[0]]
let lastPath=newList[0].permaPath
for(let i=1;i<resList.length;i++){const n=resList[i]
if(URLTREE.isDescendantPath(lastPath,n.permaPath))continue
newList.push(n)
lastPath=n.permaPath}return newList}isVisible(ctx){let resList=ctx.resList
if(this.atLeastOne!=null){if(typeof this.atLeastOne==="function"){resList=ctx.resList.filter(this.atLeastOne)
if(resList.length<1)return false}else if(this.atLeastOne&&ctx.resList.length<1)return false}if(this.exactOne&&ctx.resList.length!==1)return false
if(this.zeroOrOne&&ctx.resList.length>1)return false
if(!super.isVisible(ctx))return false
if(this.allMustMatch&&!ctx.resList.every(this.allMustMatch))return false
return this.checkNodePermsForAll(this._visNodePerms,resList,ctx)}isEnabled(ctx){if(!super.isEnabled(ctx))return false
return this.checkNodePermsForAll(this._enableNodePerms,typeof this.atLeastOne==="function"?ctx.resList.filter(this.atLeastOne):ctx.resList,ctx)}getFirstPermaPath(ctx){return ctx.resList.length>=1?ctx.resList[0].permaPath:null}getFirstNode(ctx){return ctx.resList.length>=1?ctx.resList[0]:null}checkNodePermsForAll(perms,resList,ctx){if(perms){const reg=REG.getReg(ctx)
if(ctx.resList.length===0){if(!reg.hasPerm(perms))return false}else{for(const props of resList)if(!reg.hasPermission(perms,props.roles))return false}}return true}requireNodeVisiblePerm(perms){if(perms){if(Array.isArray(perms)){for(let i=0;i<perms.length;i++)this.requireNodeVisiblePerm(perms[i])}else{if(!this._visNodePerms)this._visNodePerms=[]
if(this._visNodePerms.indexOf(perms)==-1)this._visNodePerms.push(perms)}}return this}requireNodeEnabledPerm(perms){if(perms){if(Array.isArray(perms)){for(let i=0;i<perms.length;i++)this.requireNodeEnabledPerm(perms[i])}else{if(!this._enableNodePerms)this._enableNodePerms=[]
if(this._enableNodePerms.indexOf(perms)==-1)this._enableNodePerms.push(perms)}}return this}}ResAction.add=function(action,accelKey,reg=REG.reg){reg.addToList("actions:store:resList",action.getId(),1,action)
if(accelKey)reg.addToList("accelkeys:store:resList",action.getId(),1,action)}
export class FocusRes extends ResAction{constructor(id){super(id||"focusRes")
this._label="Afficher"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/showRes.svg"
this._group="open"
this.exactOne=true}isVisible(ctx){if(!ctx.infoBroker)return false
return super.isVisible(ctx)}execute(ctx,ev){ctx.infoBroker.dispatchInfo(new InfoFocusRes(this.getFirstPermaPath(ctx)),ctx.emitter)}}export class FocusLiveRes extends FocusRes{execute(ctx,ev){const target=this.getFirstNode(ctx)
ctx.infoBroker.dispatchInfo(new InfoFocusRes(ctx.reg.env.resTypes.getResTypeFor(target).livePath(target.permaPath)),ctx.emitter)}}export class VisStateResList extends ResAction{constructor(id){super(id||"visStateRes")
this._group="edit"
this.atLeastOne=ni=>!URLTREE.isRootPath(ni.permaPath)&&ni.t!=="moved"}getLabel(ctx){return ctx.reg.env.resTypes.visStateMenuLabel}isVisible(ctx){if(!super.isVisible(ctx))return false
return ctx.reg.env.universe.hasAspect(EStoreAspects.trash)||ctx.reg.env.universe.hasAspect(EStoreAspects.unlisted)}isMenu(ctx){return true}getDatas(api,ctx){if(api!=="menu")return
const u=ctx.reg.env.universe
if(ctx.resList.length===1){const actions=[new Depot2ResCtxAction(new VisStateVisible)]
if(u.hasAspect(EStoreAspects.unlisted))actions.push(new Depot2ResCtxAction(new VisStateLimited))
if(u.hasAspect(EStoreAspects.trash))actions.push(new Depot2ResCtxAction(new VisStateInvisible))
return actions}else{const actions=[new VisStateInListVisible]
if(u.hasAspect(EStoreAspects.unlisted))actions.push(new VisStateInListLimited)
if(u.hasAspect(EStoreAspects.trash))actions.push(new VisStateListInvisible)
return actions}}}class VisStateInList extends ResAction{constructor(id){super(id)
this._group="edit"
this.initState()}getLabel(ctx){return ctx.reg.env.resTypes.visStateLabel(this)}getDescription(ctx){return ctx.reg.env.resTypes.visStateDescription(this)}getIcon(ctx){return ctx.reg.env.resTypes.visStateIconUrl(this)}async execute(ctx,ev){const uiCtx=ResEditAction.getUiCtx(ctx,ev)
let resList=ResAction.restrictToRoots(ctx.resList.filter(ni=>!URLTREE.isRootPath(ni.permaPath)&&ni.t!=="moved"&&!this.stateMatch(ni)))
const count=resList.length
if(count===0)return
const progress=POPUP.showProgress(uiCtx,"Changement en cours...")
try{progress.onProgress(0,count)
for(let i=0;i<count;i++){const n=resList[i]
await ResEditAction.sendCidUpdate(this.setState(n,{path:n.permaPath,olderResId:""}),ctx,uiCtx)
progress.onProgress(i+1,count)}}finally{progress.close()}}}class VisStateInListVisible extends VisStateInList{initState(){this.trashed=false
this.unlisted=false}stateMatch(ni){return ni.unlisted!==true&&ni.trashed!==true}setState(ni,metas){if(ni.trashed)metas.trashed=false
if(ni.unlisted)metas.unlisted=false
return metas}}class VisStateInListLimited extends VisStateInList{initState(){this.trashed=false
this.unlisted=true}stateMatch(ni){return ni.unlisted===true&&ni.trashed!==true}setState(ni,metas){if(ni.trashed)metas.trashed=false
metas.unlisted=true
return metas}}class VisStateListInvisible extends VisStateInList{initState(){this.trashed=true
this.unlisted=false}stateMatch(ni){return ni.trashed===true}setState(ni,metas){metas.trashed=true
if(ni.unlisted)metas.unlisted=false
return metas}}export class RemoveResList extends ResAction{constructor(id){super(id||"removeResList")
this._label="Supprimer définitivement"
this._description="Supprimer définitivement ces éléments (restauration impossible)"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/removeRes.svg"
this._group="edit"
this._enablePerms="action.store#remove.res"
this.atLeastOne=node=>!URLTREE.isRootPath(node.permaPath)}async execute(ctx,ev){const uiCtx=ResEditAction.getUiCtx(ctx,ev)
const resList=ResAction.restrictToRoots(ctx.resList)
const count=resList.length
if(await POPUP.confirm(`Supprimer définitivement ces ${count} éléments ? Attention, aucune restauration ne sera possible.`,uiCtx,{okLbl:"Supprimer définitivement"})){const progress=POPUP.showProgress(uiCtx,"Traitement en cours...")
try{progress.onProgress(0,count)
for(let i=0;i<count;i++){const n=resList[i]
await ResEditAction.sendCidUpdate({path:n.permaPath,action:n.vcb==="v"?"removeNode":"removeAll"},ctx,uiCtx)
progress.onProgress(i+1,count)}}finally{progress.close()}}}}export class AddFolderInList extends Depot2ResCtxAction{constructor(){super(new AddFolder)}getGroup(ctx){return"add"}getLabel(ctx){return"Ajouter un dossier"}}export class AddByImportInList extends Depot2ResCtxAction{constructor(){super(new AddByImport)}getGroup(ctx){return"add"}getLabel(ctx){return"Ajouter une ressource"}}ResAction.add(new AddByImportInList)
ResAction.add(new AddFolderInList)
ResAction.add(new VisStateResList)
ResAction.add(new RemoveResList)

//# sourceMappingURL=depotActions.js.map