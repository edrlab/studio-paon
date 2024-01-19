import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{SpaceTree,SpaceTreeDuplicate,SpaceTreePaste,SpaceTreePasteMove,SpaceTreeRename}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/spaceTree.js"
import{DeleteSrc,ShortDescCopy}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{AccelKeyMgr,Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{ESrcSt,SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
export class ItemFolderTree extends BaseElement{_initialize(init){this.reg=this.findReg(init)
this.style.display="flex"
this.style.flex="1"
init.uriRoot=this.reg.env.longDesc.srcUri
if(!("hideSearch"in init))init.hideSearch=true
if(!("actions"in init))init.actions=this.reg.getList("actions:itemFolder:shortDesc")
if(!("accelKeyMgr"in init))init.accelKeyMgr=(new AccelKeyMgr).initFromMapActions(this.reg.getListAsMap("accelkeys:itemFolder:shortDesc"))
if(!("secondaryCols"in init))init.secondaryCols=this.reg.getList("columns:itemFoderTree:secondaryCols")
this.tree=this.appendChild(JSX.createElement(SpaceTree,{style:"flex:1","î":init}))}}customElements.define("wsp-item-folder-tree",ItemFolderTree)
function addAction(action,accel){REG.reg.addToList("actions:itemFolder:shortDesc",action.getId(),1,action)
if(accel)REG.reg.addToList("accelkeys:itemFolder:shortDesc",accel,1,action)}addAction(ShortDescCopy.SINGLETON,"c-accel")
const pasteCtrl=new SpaceTreePaste
addAction(pasteCtrl,"v-accel")
addAction(new SpaceTreePasteMove(pasteCtrl))
addAction(new SpaceTreeRename,"F2")
addAction(new DeleteSrc,"Delete")
addAction(new SpaceTreeDuplicate)
export class FolderTreeCreateFolder extends Action{constructor(){super("createFolder")
this._label="Créer un dossier..."
this._group="create"}isVisible(ctx){if(ctx.shortDescs.length>1)return false
return super.isVisible(ctx)}async execute(ctx,ev){const{SrcNewCode:SrcNewCode}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/srcNewCode.js")
const parentUri=ctx.shortDescs.length===0?ctx.uriRoot:ctx.shortDescs[0].srcSt===ESrcSt.folder?ctx.shortDescs[0].srcUri:SRC.extractUriParent(ctx.shortDescs[0].srcUri)
const parentSrcLabel=ITEM.extractSrcLabel(parentUri,"")
const ti=`Créer un dossier en fils de \'${parentSrcLabel}\'`
const ct=(new SrcNewCode).initialize({reg:ctx.reg,parentFolder:parentUri,targetSrcUriType:"res"})
const newCode=await POPUP.showDialog(ct,ctx.emitter,{titleBar:{barLabel:{label:ti}}}).onNextClose()
ctx.emitter.focus()
if(newCode){try{const shortDesc=await WSP.createSpaceOrFolder(ctx.reg.env.wsp,null,ctx.emitter,SRC.addLeafToUri(parentUri,newCode))
if(shortDesc&&await ctx.selectSrcUri(shortDesc.srcUri)&&ctx.grid.defaultAction)ctx.grid.defaultAction.executeIfAvailable(ctx)
return shortDesc}catch(e){throw e}}}}addAction(new FolderTreeCreateFolder)

//# sourceMappingURL=itemFolderTree.js.map