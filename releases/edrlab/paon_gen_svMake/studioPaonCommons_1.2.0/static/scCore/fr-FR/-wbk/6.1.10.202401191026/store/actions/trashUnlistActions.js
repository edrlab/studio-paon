import{URLTREE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/urlTree.js"
import{EStoreAspects}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/depot.js"
import{ResEditAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/actions/resActions.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{ResAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/actions/depotActions.js"
export function switchVisState2TrashUnlistActions(reg,resEditCdList){ResAction.add(new TrashResList,null,reg)
ResAction.add(new UntrashResList,null,reg)
ResAction.add(new UnlistResList,null,reg)
ResAction.add(new RelistResList,null,reg)
function addEditAction(action){reg.addToList(resEditCdList,action.getId(),1,action)}addEditAction(new UnlistRes)
addEditAction(new RelistRes)
addEditAction(new TrashRes)
addEditAction(new UntrashRes)}export class TrashRes extends ResEditAction{constructor(id){super(id||"trashRes")
this._description="Supprimer cette ressource (restauration possible)"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/trashRes.svg"
this._group="edit"
this._enablePerms="action.store#trash.res"}getLabel(ctx){if(!this._label)return ctx.reg.env.resType.prcVersionning==="VCB"?"Supprimer cette version":"Supprimer"
return super.getLabel(ctx)}isVisible(ctx){if(!ctx.reg.env.universe.hasAspect(EStoreAspects.trash))return false
if(ctx.reg.env.nodeInfos.trashed)return false
if(URLTREE.isRootPath(ctx.reg.env.nodeInfos.permaPath))return false
return super.isVisible(ctx)}async execute(ctx,ev){const uiCtx=ResEditAction.getUiCtx(ctx,ev)
if(await POPUP.confirm("Supprimer cette ressource (restauration possible) ?",uiCtx)){return ResEditAction.sendCidUpdate({path:ctx.reg.env.nodeInfos.permaPath,olderResId:"",trashed:true},ctx,uiCtx)}}}export class UntrashRes extends ResEditAction{constructor(id){super(id||"restoreRes")
this._description="Restaurer cette ressource supprimée"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/untrashRes.svg"
this._group="edit"
this._enablePerms="action.store#untrash.res"}getLabel(ctx){if(!this._label)return ctx.reg.env.resType.prcVersionning==="VCB"?"Restaurer cette version":"Restaurer"
return super.getLabel(ctx)}isVisible(ctx){if(!ctx.reg.env.universe.hasAspect(EStoreAspects.trash))return false
if(!ctx.reg.env.nodeInfos.trashed)return false
return super.isVisible(ctx)}async execute(ctx,ev){const uiCtx=ResEditAction.getUiCtx(ctx,ev)
if(await POPUP.confirm("Restaurer cette ressource supprimée ?",uiCtx)){return ResEditAction.sendCidUpdate({path:ctx.reg.env.nodeInfos.permaPath,olderResId:"",trashed:false},ctx,uiCtx)}}}export class UnlistRes extends ResEditAction{constructor(id){super(id||"unlistRes")
this._label="Masquer dans les listes"
this._description="Masquer cette ressource lors de l\'affichage d\'une liste"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/unlistRes.svg"
this._group="edit"
this._enablePerms="action.store#unlist.res"}isVisible(ctx){if(!ctx.reg.env.universe.hasAspect(EStoreAspects.unlisted))return false
if(ctx.reg.env.nodeInfos.trashed||ctx.reg.env.nodeInfos.unlisted)return false
return super.isVisible(ctx)}async execute(ctx,ev){const uiCtx=ResEditAction.getUiCtx(ctx,ev)
if(await POPUP.confirm("Masquer cette ressource lors de l\'affichage d\'une liste ?",uiCtx)){return ResEditAction.sendCidUpdate({path:ctx.reg.env.nodeInfos.permaPath,olderResId:"",unlisted:true},ctx,uiCtx)}}}export class RelistRes extends ResEditAction{constructor(id){super(id||"relistRes")
this._label="Afficher dans les listes"
this._description="Afficher cette ressource lors de l\'affichage d\'une liste"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/relistRes.svg"
this._group="edit"
this._enablePerms="action.store#relist.res"}isVisible(ctx){if(!ctx.reg.env.universe.hasAspect(EStoreAspects.unlisted))return false
if(ctx.reg.env.nodeInfos.trashed||!ctx.reg.env.nodeInfos.unlisted)return false
return super.isVisible(ctx)}async execute(ctx,ev){const uiCtx=ResEditAction.getUiCtx(ctx,ev)
if(await POPUP.confirm("Afficher cette ressource lors de l\'affichage d\'une liste ?",uiCtx)){return ResEditAction.sendCidUpdate({path:ctx.reg.env.nodeInfos.permaPath,olderResId:"",unlisted:false},ctx,uiCtx)}}}export class TrashResList extends ResAction{constructor(id){super(id||"trashResList")
this._label="Supprimer"
this._description="Supprimer ces éléments (restauration possible)"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/trashRes.svg"
this._group="edit"
this._enablePerms="action.store#trash.res"
this.atLeastOne=node=>!node.trashed&&node.t!=="moved"&&!URLTREE.isRootPath(node.permaPath)}isVisible(ctx){if(!ctx.reg.env.universe.hasAspect(EStoreAspects.trash))return false
return super.isVisible(ctx)}async execute(ctx,ev){const uiCtx=ResEditAction.getUiCtx(ctx,ev)
let resList=TrashResList.restrictToRoots(ctx.resList.filter(this.atLeastOne))
const count=resList.length
if(count===0)return
if(await POPUP.confirm(count===1?"Supprimer cet élément (restauration possible) ?":`Supprimer ces ${count} éléments (restauration possible) ?`,uiCtx)){const progress=POPUP.showProgress(uiCtx,"Suppressions en cours...")
try{progress.onProgress(0,count)
for(let i=0;i<count;i++){const n=resList[i]
await ResEditAction.sendCidUpdate({path:n.permaPath,olderResId:"",trashed:true},ctx,uiCtx)
progress.onProgress(i+1,count)}}finally{progress.close()}}}}export class UntrashResList extends ResAction{constructor(id){super(id||"untrashResList")
this._label="Restaurer"
this._description="Restaurer ces éléments"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/untrashRes.svg"
this._group="edit"
this._enablePerms="action.store#untrash.res"
this.atLeastOne=node=>node.trashed}isVisible(ctx){if(!ctx.reg.env.universe.hasAspect(EStoreAspects.trash))return false
return super.isVisible(ctx)}async execute(ctx,ev){const uiCtx=ResEditAction.getUiCtx(ctx,ev)
const resList=ctx.resList.filter(this.atLeastOne)
const count=resList.length
if(count===0)return
if(await POPUP.confirm(count===1?"Restaurer cet élément ?":`Restaurer ces ${count} éléments ?`,uiCtx)){const progress=POPUP.showProgress(uiCtx,"Restaurations en cours...")
try{progress.onProgress(0,count)
for(let i=0;i<count;i++){const n=resList[i]
await ResEditAction.sendCidUpdate({path:n.permaPath,olderResId:"",trashed:false},ctx,uiCtx)
progress.onProgress(i+1,count)}}finally{progress.close()}}}}export class UnlistResList extends ResAction{constructor(id){super(id||"unlistResList")
this._label="Masquer dans les listes"
this._description="Masquer ces éléments lors de l\'affichage d\'une liste"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/unlistRes.svg"
this._group="edit"
this._enablePerms="action.store#unlist.res"
this.atLeastOne=node=>!node.unlisted}isVisible(ctx){if(!ctx.reg.env.universe.hasAspect(EStoreAspects.unlisted))return false
return super.isVisible(ctx)}async execute(ctx,ev){const uiCtx=ResEditAction.getUiCtx(ctx,ev)
const resList=ctx.resList.filter(this.atLeastOne)
const count=resList.length
if(count===0)return
if(await POPUP.confirm(count===1?"Masquer cet élément ?":`Masquer ces ${count} éléments ?`,uiCtx)){const progress=POPUP.showProgress(uiCtx,"Masquage en cours...")
try{progress.onProgress(0,count)
for(let i=0;i<count;i++){const n=resList[i]
await ResEditAction.sendCidUpdate({path:n.permaPath,olderResId:"",unlisted:true},ctx,uiCtx)
progress.onProgress(i+1,count)}}finally{progress.close()}}}}export class RelistResList extends ResAction{constructor(id){super(id||"relistResList")
this._label="Afficher dans les listes"
this._description="Afficher cet élément lors de l\'affichage d\'une liste"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/relistRes.svg"
this._group="edit"
this._enablePerms="action.store#relist.res"
this.atLeastOne=node=>node.unlisted}isVisible(ctx){if(!ctx.reg.env.universe.hasAspect(EStoreAspects.unlisted))return false
return super.isVisible(ctx)}async execute(ctx,ev){const uiCtx=ResEditAction.getUiCtx(ctx,ev)
const resList=ctx.resList.filter(this.atLeastOne)
const count=resList.length
if(count===0)return
if(await POPUP.confirm(count===1?"Afficher cet élément dans les listes ?":`Afficher ces ${count} éléments dans les listes ?`,uiCtx)){const progress=POPUP.showProgress(uiCtx,"Traitement en cours...")
try{progress.onProgress(0,count)
for(let i=0;i<count;i++){const n=resList[i]
await ResEditAction.sendCidUpdate({path:n.permaPath,olderResId:"",unlisted:false},ctx,uiCtx)
progress.onProgress(i+1,count)}}finally{progress.close()}}}}
//# sourceMappingURL=trashUnlistActions.js.map