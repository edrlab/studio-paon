import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{METAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/metaBar.js"
import{WedEditAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedEditor.js"
import{TxtRoot}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txt.js"
import{InlElement,InlLeaf,InlWrap,TxtCaption,TxtLI,TxtMember,TxtParaLike,TxtSL,TxtStr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtTags.js"
import{buildXa,deleteWebRange,findTxtEltFirstChild,findTxtEltNextSibling,findTxtEltOrRootParent,findTxtEltParent,findTxtEltPreviousSibling,findTxtParaLikeFrom,findTxtParaSiblingFrom,findTxtStrParent,IS_TxtElementReal,IS_TxtParaParent,splitPara,unwrapContainerFromSel,unwrapInl,unwrapInlFromSel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtUtils.js"
import{WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{ACTION,Action,ActionMenu,ActionMenuDep}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
const TXT_ACTIONS_REG={none:null}
export function registerTxtAction(localName,ctor){TXT_ACTIONS_REG[localName]=ctor}export function createTxtAction(elt,actionId,reg,addUiProps,addToFirstList){const actionSvc=reg.getSvc(actionId)
if(actionSvc)return actionSvc
if(elt==null)throw Error("Action not found: "+actionId)
const ctor=TXT_ACTIONS_REG[elt.localName]
if(!ctor){if(elt.localName in TXT_ACTIONS_REG)return null
throw Error("Txt action executor not found: "+elt.localName)}const action=new ctor(actionId)
if(addUiProps){const btn=elt.parentElement
const label=btn.getAttribute("label")
if(label)action.setLabel(label)
const icon=btn.getAttribute("icon")
if(icon)action.setIcon(icon)
const group=btn.getAttribute("group")
if(group)action.setGroup(group)}if(addToFirstList){const btn=elt.parentElement
reg.addToList(addToFirstList[0],actionId,REG.LEVELAUTH_MODEL,action,btn.hasAttribute("order")?parseInt(btn.getAttribute("order"),10):DOM.computeOffset(btn)*10)}action.initFromWed(elt,reg,addToFirstList)
return action}class TxtActionMenu extends ActionMenuDep{initFromWed(elt,reg,addToFirstList){this._actions=[]
const attLists=elt.getAttribute("lists")
const lists=attLists?attLists.split(" "):null
let actions=lists?reg.mergeLists(...lists):[]
for(let ch=elt.firstElementChild;ch;ch=ch.nextElementSibling){if(ch.localName==="button"){const action=createTxtAction(ch.firstElementChild,ch.getAttribute("actionId"),reg,true,lists)
if(actions&&action)actions.push(action)}}this._actions=ACTION.injectSepByGroup(actions,"",null)}}registerTxtAction("menu",TxtActionMenu)
class TxtInlineMarker extends Action{initFromWed(elt){}isVisible(ctx){if(!ctx.txtRoot.txtRootProps.inlineMarkStyle)return false
return super.isVisible(ctx)}isToggle(ctx){return true}getDatas(api,ctx){return ctx.txtRoot.inlineMarkers}execute(ctx,ev){ctx.txtRoot.selMgr.restoreSel()
const root=ctx.wedMgr.wedEditor.rootNode
const newState=!ctx.txtRoot.inlineMarkers
DOMSH.findFlatNext(root,root,n=>{if(n instanceof TxtRoot)n.inlineMarkers=newState
return false})
ctx.txtRoot.storeInlineMarkers()}}registerTxtAction("inlineMarker",TxtInlineMarker)
export class TxtInsertAction extends WedEditAction{isEnabled(ctx){if(!WEDLET.isWritableWedlet(ctx.txtRoot.wedlet))return false
return super.isEnabled(ctx)}initFromWed(elt){this.tagName=elt.getAttribute("tagName")
this.role=elt.getAttribute("role")
if(elt.hasAttribute("enabledPerms"))this.requireEnabledPerm(elt.getAttribute("enabledPerms").split(" "))
if(elt.hasAttribute("visiblePerms"))this.requireVisiblePerm(elt.getAttribute("visiblePerms").split(" "))}static isInsertPointLost(ctx,anchor,selMgr){selMgr.restoreSel()
if(anchor.isConnected&&DOM.isAncestor(anchor,selMgr.focusNode))return false
POPUP.showNotifInfo("Une modification concurrente a éliminé ce contexte d\'insertion.",ctx.wedMgr.wedEditor)
return true}}export class InsertParaSibling extends TxtInsertAction{static doInsert(jml,ctx,selMgr,ev){const selType=selMgr.type
if(selType!=="None"){const batch=ctx.txtRoot.wedlet.wedMgr.docHolder.newBatch(selMgr.getXaRange())
let container
let insertBefore
let insertAfter
if(selType==="Range"){const range=selMgr.range
const startPara=findTxtParaLikeFrom(range.startContainer)
const endPara=findTxtParaLikeFrom(range.endContainer)
if(startPara===endPara){container=startPara.parentNode
if(startPara.isXmlStartOffset(range.startContainer,range.startOffset)){insertBefore=startPara}else if(startPara.isXmlEndOffset(range.endContainer,range.endOffset)){insertAfter=endPara}else{if(IS_TxtParaParent(container)||container===ctx.txtRoot){splitPara(ctx.txtRoot,endPara,range.endContainer,range.endOffset,batch)}insertAfter=startPara}}else{container=endPara.parentNode
insertBefore=endPara}deleteWebRange(ctx.txtRoot,range,batch)}else if(selType==="Caret"){const focusNode=selMgr.focusNode
const para=findTxtParaLikeFrom(focusNode)
if(para){container=para.parentNode
if(para.isXmlStartOffset(focusNode,selMgr.focusOffset)){insertBefore=para}else if(para.isXmlEndOffset(focusNode,selMgr.focusOffset)){insertAfter=para}else{if(IS_TxtParaParent(container)||container===ctx.txtRoot){splitPara(ctx.txtRoot,para,focusNode,selMgr.focusOffset,batch)}insertAfter=para}}else{container=selMgr.focusNode
insertBefore=container.childNodes[selMgr.focusOffset]}}else{const child=selMgr.focusObject
if(!child)return
container=child.parentNode
insertBefore=child}while(!IS_TxtParaParent(container)&&container!==ctx.txtRoot){insertBefore=container
container=container.parentNode
if(!container)return}const parentWedlet=container.wedlet
if(parentWedlet.isVirtual()){WEDLET.insertDatasFromDisplay(parentWedlet,batch,jml)}else{let xa
if(insertBefore){xa=buildXa(insertBefore)}else if(insertAfter){xa=insertAfter.wedAnchor
if(!insertAfter.isVirtual())xa=XA.incrAtDepth(xa,-1,1)}else{const lastCh=DOM.findLastChild(container,IS_TxtElementReal)
xa=XA.append(buildXa(container),lastCh?lastCh.xaPart+1:0)}batch.insertJml(xa,jml)}batch.doBatch()}}static findContainer(ctx,selMgr){const selType=selMgr.type
if(selType!=="None"){const focus=selType==="Range"?findTxtParaLikeFrom(selMgr.range.startContainer):selType==="Caret"?selMgr.focusNode:selMgr.focusObject
return DOM.findParent(focus,ctx.txtRoot,IS_TxtParaParent)||ctx.txtRoot}return null}async execute(ctx,ev){const selMgr=ctx.txtRoot.selMgr.restoreSel()
const ctn=InsertParaSibling.findContainer(ctx,selMgr)
if(ctn){const model=ctn.getTxtWedModel(this.tagName,this.role)
let newJml
if(model.hasOnCreateHook){newJml=await model.callOnCreateHook(ctn)
if(!newJml||TxtInsertAction.isInsertPointLost(ctx,ctn,selMgr))return}else{newJml=[model.newJml()]}InsertParaSibling.doInsert(newJml,ctx,selMgr,ev)}}}registerTxtAction("insertParaSibling",InsertParaSibling)
class InsertList extends InsertParaSibling{async execute(ctx,ev){const selMgr=ctx.txtRoot.selMgr.restoreSel()
const doc=ctx.txtRoot.wedlet.wedMgr.docHolder
let batch=doc.newBatch(selMgr.getXaRange())
let listModel,jml,insBefBlock;[listModel,jml,insBefBlock]=this.prepare(ctx,doc,batch,selMgr)
if(listModel&&insBefBlock){const ctn=findTxtEltParent(insBefBlock)
if(listModel.hasOnCreateHook){const newJml=await listModel.callOnCreateHook(ctn||ctx.txtRoot)
if(!newJml||TxtInsertAction.isInsertPointLost(ctx,ctn||ctx.txtRoot,selMgr))return
batch=doc.newBatch(selMgr.getXaRange())
let newListModel;[newListModel,jml,insBefBlock]=this.prepare(ctx,doc,batch,selMgr)
if(newListModel!==listModel||!insBefBlock)return
if(newJml.length>1)newJml[1].push(...jml)
else newJml.push(jml)
jml=newJml}else{jml=[listModel.newJml(),jml]}if(insBefBlock instanceof TxtLI){jml=[insBefBlock.model.newJml(),jml]}if(ctn?ctn.isVirtual():ctx.txtRoot.wedlet.isVirtual()){WEDLET.insertDatasFromDisplay(ctn||ctx.txtRoot.wedlet,batch,jml)}else{const anchor=insBefBlock.wedAnchor
batch.insertJml(anchor,jml)}batch.doBatch()}}prepare(ctx,doc,batch,selMgr){let listModel,jml,insBefBlock
const fromPoint=findTxtParaSiblingFrom(selMgr.focusNode)
if(!fromPoint)return[null,null,null]
if(selMgr.type!=="Range"){insBefBlock=fromPoint
const parent=findTxtEltOrRootParent(insBefBlock)
listModel=parent.getTxtWedModel(this.tagName,this.role)
if(!fromPoint.isVirtual()){if(listModel){const anchor=fromPoint.wedAnchor
jml=[listModel.itemModel.newJml(),doc.getContent(anchor)]
batch.deleteSequence(anchor,1)}}else{jml=[]}}else{let entries=[]
let minDepth=Number.MAX_SAFE_INTEGER
selMgr.iterateNodesInSel(n=>{let block=DOM.findParentOrSelf(n,ctx.txtRoot,n=>n instanceof TxtParaLike||n.isParaSibling||n instanceof TxtLI)
if(block&&block!==entries[entries.length-1]&&!block.isVirtual()){if(!findTxtEltNextSibling(block)&&block.isParaSibling&&block.parentNode instanceof TxtLI){let prev=findTxtEltPreviousSibling(block)
let idx=entries.length-1
while(prev&&entries[idx--]===prev)prev=findTxtEltPreviousSibling(prev)
if(!prev){entries.length=idx+1
block=block.parentNode
if(block===entries[entries.length-1])return[null,null,null]}}const depth=DOM.computeDepth(block)
if(depth<minDepth){insBefBlock=block
minDepth=depth}entries.push(block)}})
if(entries.length===0){jml=[]
insBefBlock=fromPoint}else{let toDel=[]
for(let i=0;i<entries.length;i++){const entry=entries[i]
toDel.push(entry)
if(entry instanceof TxtLI||entry instanceof TxtCaption||entry instanceof TxtMember){if(!findTxtEltPreviousSibling(entry)){let idx=i+1
let next=findTxtEltNextSibling(entry)
while(next){if(next!==entries[idx++])break
next=findTxtEltNextSibling(next)}if(!next){const parent=findTxtEltParent(entry)
toDel[toDel.length-1]=parent
i=idx-1
const depth=DOM.computeDepth(parent)
if(depth<minDepth){insBefBlock=parent
minDepth=depth}}}}}if(insBefBlock instanceof TxtLI){listModel=insBefBlock.getTxtWedModel(this.tagName,this.role)}else{if(insBefBlock instanceof TxtMember){const sl=findTxtEltParent(insBefBlock)
entries=[]
for(let ch=findTxtEltFirstChild(sl);ch;ch=findTxtEltNextSibling(ch))entries.push(ch)
toDel=[sl]
insBefBlock=sl}listModel=findTxtEltOrRootParent(insBefBlock).getTxtWedModel(this.tagName,this.role)}if(listModel){for(let i=toDel.length-1;i>=0;i--){const node=toDel[i]
batch.deleteSequence(node.wedAnchor,1)}batch.needAdjustForNextAdds()
jml=[]
for(let i=0;i<entries.length;i++){const entry=entries[i]
if(entry.isParaSibling){jml.push(listModel.itemModel.newJml(),doc.getContent(entry.wedAnchor))}else if(entry instanceof TxtLI){jml.push(...doc.getContent(entry.wedAnchor))}else{if(i===0&&entry instanceof TxtCaption&&listModel.titleModel!=null){jml.push(listModel.titleModel.newJml(),entry.exportContent())}else{jml.push(listModel.itemModel.newJml(),[listModel.itemModel.paraModel.newJml(),entry.exportContent()])}}}}}}return[listModel,jml,insBefBlock]}}registerTxtAction("insertList",InsertList)
class InsertSimpleList extends InsertParaSibling{async execute(ctx,ev){const selMgr=ctx.txtRoot.selMgr.restoreSel()
let batch=ctx.txtRoot.wedlet.wedMgr.docHolder.newBatch(selMgr.getXaRange())
let jml,insBefBlock,listModel;[listModel,jml,insBefBlock]=this.prepare(ctx,batch,selMgr)
if(listModel&&insBefBlock){const ctn=findTxtEltParent(insBefBlock)
if(listModel.hasOnCreateHook){const newJml=await listModel.callOnCreateHook(ctn||ctx.txtRoot)
if(!newJml||TxtInsertAction.isInsertPointLost(ctx,ctn||ctx.txtRoot,selMgr))return
batch=ctx.txtRoot.wedlet.wedMgr.docHolder.newBatch(selMgr.getXaRange())
let newListModel;[newListModel,jml,insBefBlock]=this.prepare(ctx,batch,selMgr)
if(newListModel!==listModel||!insBefBlock)return
if(newJml.length>1)newJml[1].push(...jml)
else newJml.push(jml)
jml=newJml}else{jml=[listModel.newJml(),jml]}if(insBefBlock instanceof TxtLI){jml=[insBefBlock.model.newJml(),jml]}if(ctn?ctn.isVirtual():ctx.txtRoot.wedlet.isVirtual()){WEDLET.insertDatasFromDisplay(ctn||ctx.txtRoot.wedlet,batch,jml)}else{const anchor=insBefBlock.wedAnchor
batch.insertJml(anchor,jml)}batch.doBatch()}}prepare(ctx,batch,selMgr){let listModel,jml,insBefBlock
const fromPoint=findTxtParaSiblingFrom(selMgr.focusNode)
if(!fromPoint)return[null,null,null]
if(selMgr.type!=="Range"){insBefBlock=fromPoint
const parent=findTxtEltOrRootParent(insBefBlock)
listModel=parent.getTxtWedModel(this.tagName,this.role)
if(!fromPoint.isVirtual()){if(listModel){if(fromPoint instanceof TxtParaLike){const anchor=fromPoint.wedAnchor
jml=[listModel.memberModel.newJml(),fromPoint.exportContent()]
batch.deleteSequence(anchor,1)}else{jml=[listModel.memberModel.newJml()]}}}else{jml=[]}}else{const entries=[]
let minDepth=Number.MAX_SAFE_INTEGER
selMgr.iterateNodesInSel(n=>{let para=DOM.findParentOrSelf(n,ctx.txtRoot,n=>n instanceof TxtParaLike)
if(!para){const tw=document.createTreeWalker(n,ENodeType.element,{acceptNode(n){return n instanceof TxtParaLike?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}})
for(para=tw.firstChild();para;para=tw.nextSibling()){const depth=DOM.computeDepth(para)
if(depth<minDepth){insBefBlock=para
minDepth=depth}entries.push(para)}}else if(para!==entries[entries.length-1]&&!para.isVirtual()){const depth=DOM.computeDepth(para)
if(depth<minDepth){insBefBlock=para
minDepth=depth}entries.push(para)}})
if(entries.length===0){jml=[]
insBefBlock=fromPoint}else{const toDel=[]
for(let i=0;i<entries.length;i++){const entry=entries[i]
toDel.push(entry)
const parent=findTxtEltParent(entry)
if(parent instanceof TxtLI||parent instanceof TxtSL){if(!findTxtEltPreviousSibling(entry)){let idx=i+1
let next=findTxtEltNextSibling(entry)
while(next){if(next!==entries[idx++])break
next=findTxtEltNextSibling(next)}if(!next){toDel[toDel.length-1]=parent
i=idx-1
const depth=DOM.computeDepth(parent)
if(depth<minDepth){insBefBlock=parent
minDepth=depth}}}}}for(let i=0;i<toDel.length;i++){const node=toDel[i]
if((node instanceof TxtLI||node instanceof TxtCaption)&&!findTxtEltPreviousSibling(node)){let idx=i+1
let next=findTxtEltNextSibling(node)
while(next){if(next!==toDel[idx++])break
next=findTxtEltNextSibling(next)}if(!next){const parent=findTxtEltParent(node)
toDel.splice(i,idx-i,parent)
const depth=DOM.computeDepth(parent)
if(depth<minDepth){insBefBlock=parent
minDepth=depth}}}}if(!insBefBlock.isParaSibling){if(insBefBlock instanceof TxtLI){listModel=insBefBlock.getTxtWedModel(this.tagName,this.role)}else{insBefBlock=findTxtEltParent(insBefBlock)
while(insBefBlock&&!insBefBlock.isParaSibling)insBefBlock=findTxtEltParent(insBefBlock)
listModel=insBefBlock?findTxtEltOrRootParent(insBefBlock).getTxtWedModel(this.tagName,this.role):null}}else{listModel=findTxtEltOrRootParent(insBefBlock).getTxtWedModel(this.tagName,this.role)}if(listModel){for(let i=toDel.length-1;i>=0;i--){const node=toDel[i]
batch.deleteSequence(node.wedAnchor,1)}batch.needAdjustForNextAdds()
jml=[]
for(let i=0;i<entries.length;i++){const entry=entries[i]
if(i===0&&entry instanceof TxtCaption&&listModel.titleModel!=null){jml.push(listModel.titleModel.newJml(),entry.exportContent())}else{jml.push(listModel.memberModel.newJml(),entry.exportContent())}}}}}return[listModel,jml,insBefBlock]}}registerTxtAction("insertSimpleList",InsertSimpleList)
class InsertDiv extends InsertParaSibling{async execute(ctx,ev){const selMgr=ctx.txtRoot.selMgr.restoreSel()
const doc=ctx.txtRoot.wedlet.wedMgr.docHolder
let firstToWrap
let lastToWrap
switch(selMgr.type){case"Range":{const rg=selMgr.range
const commonAnc=selMgr.commonAncestor
let start=rg.startContainer
if(start!==commonAnc)while(start.parentNode!==commonAnc)start=start.parentNode
let end=rg.endContainer
if(end!==commonAnc)while(end.parentNode!==commonAnc)end=end.parentNode
firstToWrap=findTxtParaSiblingFrom(start)
lastToWrap=findTxtParaSiblingFrom(end)
break}case"Object":case"Caret":firstToWrap=lastToWrap=findTxtParaSiblingFrom(selMgr.focusNode)
break}if(!firstToWrap||!lastToWrap)return
const ctn=findTxtEltOrRootParent(firstToWrap)
const divModel=ctn.getTxtWedModel(this.tagName,this.role)
let newJml
if(divModel.hasOnCreateHook){newJml=await divModel.callOnCreateHook(ctn)
if(!newJml||TxtInsertAction.isInsertPointLost(ctx,firstToWrap,selMgr)||TxtInsertAction.isInsertPointLost(ctx,lastToWrap,selMgr))return}else{newJml=[divModel.newJml()]}const xaIns=firstToWrap.wedAnchor
let delLen=lastToWrap.getVirtualXaPart()-firstToWrap.getVirtualXaPart()+1
const batch=doc.newBatch(selMgr.getXaRange())
if(delLen===1&&firstToWrap.isVirtual()&&lastToWrap.isVirtual()){batch.insertJml(xaIns,newJml)}else{JML.appendChildren(doc.getContent(xaIns,delLen),newJml,0)
batch.spliceSequence(xaIns,delLen,newJml)}batch.doBatch()}}registerTxtAction("insertDiv",InsertDiv)
class UnwrapList extends WedEditAction{target(){return"list"}initFromWed(elt){}initButtonNode(buttonNode,ctx){super.initButtonNode(buttonNode,ctx)
if(buttonNode instanceof ActionBtn)buttonNode.accel="Shift+Arr."}isEnabled(ctx){if(!WEDLET.isWritableWedlet(ctx.txtRoot.wedlet))return false
return super.isEnabled(ctx)&&unwrapContainerFromSel(this.target(),ctx.txtRoot,true)}execute(ctx,ev){unwrapContainerFromSel(this.target(),ctx.txtRoot,false,true)}}registerTxtAction("unwrapList",UnwrapList)
class UnwrapDiv extends UnwrapList{target(){return"div"}}registerTxtAction("unwrapDiv",UnwrapDiv)
class UnwrapInline extends WedEditAction{initFromWed(elt){}isEnabled(ctx){if(!WEDLET.isWritableWedlet(ctx.txtRoot.wedlet))return false
return super.isEnabled(ctx)&&unwrapInlFromSel(ctx.txtRoot,true)}execute(ctx,ev){unwrapInlFromSel(ctx.txtRoot,false)}}registerTxtAction("unwrapInline",UnwrapInline)
class InsertInl extends TxtInsertAction{async insertTagAtCaret(ctx,selMgr){const focusNode=selMgr.focusNode
const txtStr=findTxtStrParent(focusNode,true)
if(txtStr){const parent=findTxtEltParent(txtStr)
const model=parent.getTxtWedModel(this.tagName,this.role)
if(model){let newJml
if(model.hasOnCreateHook){newJml=await model.callOnCreateHook(parent)
if(!newJml||TxtInsertAction.isInsertPointLost(ctx,txtStr,selMgr))return}else{newJml=[model.newJml()]}const doc=ctx.wedMgr.docHolder
if(parent.isVirtual()){const batch=doc.newBatch(selMgr.getXaRange())
WEDLET.insertDatasFromDisplay(parent,batch,newJml)
batch.setSelAfter(txtStr.wedAnchor).doBatch()}else if(txtStr.isVirtual()){doc.newBatch(selMgr.getXaRange()).insertJml(txtStr.wedAnchor,newJml).doBatch()}else{const xmlOffset=txtStr.getXmlOffset(focusNode,selMgr.focusOffset)
doc.newBatch(selMgr.getXaRange()).splitText(XA.append(txtStr.wedAnchor,xmlOffset),0,txtStr.getXmlText().substring(xmlOffset),newJml).doBatch()}}}}async wrapObject(ctx,selMgr){const node=findTxtEltParent(selMgr.focusNode,true)
const ctn=findTxtEltParent(node)
if(ctn){const model=ctn.getTxtWedModel(this.tagName,this.role)
if(model){let newJml
if(model.hasOnCreateHook){newJml=await model.callOnCreateHook(ctn)
if(!newJml||TxtInsertAction.isInsertPointLost(ctx,node,selMgr))return}else{newJml=[model.newJml()]}const doc=ctx.wedMgr.docHolder
JML.appendChildren(doc.getContent(node.wedAnchor),newJml,0)
doc.newBatch(selMgr.getXaRange()).spliceSequence(node.wedAnchor,1,newJml).doBatch()
return}}}}class InsertInlObject extends InsertInl{isEnabled(ctx){return ctx.txtRoot.selMgrAsIs.type==="Caret"&&super.isEnabled(ctx)}execute(ctx,ev){const selMgr=ctx.txtRoot.selMgr.restoreSel()
if(selMgr.type==="Caret")this.insertTagAtCaret(ctx,selMgr)}}registerTxtAction("insertInlObject",InsertInlObject)
class ToggleTextLeafMulti extends InsertInl{isToggle(ctx){return true}isEnabled(ctx){if(!super.isEnabled(ctx))return false
const selMgr=ctx.txtRoot.selMgrAsIs
switch(selMgr.type){case"Range":let anchNode=findTxtEltOrRootParent(selMgr.anchorNode,true)
if(anchNode instanceof TxtStr)anchNode=findTxtEltOrRootParent(anchNode)
if(anchNode instanceof InlLeaf){if(anchNode.model.nodeName===this.tagName&&anchNode.model.role===this.role)return true}else if(anchNode&&anchNode.getTxtWedModel(this.tagName,this.role)!=null)return true
case"Caret":let focNode=findTxtEltOrRootParent(selMgr.focusNode,true)
if(focNode instanceof TxtStr)focNode=findTxtEltOrRootParent(focNode)
if(focNode instanceof InlLeaf)return focNode.model.nodeName===this.tagName&&focNode.model.role===this.role
return focNode?focNode.getTxtWedModel(this.tagName,this.role)!=null:false
default:return false}}getDatas(api,ctx){const selMgr=ctx.txtRoot.selMgr
if(selMgr.type==="None")return false
if(selMgr.type==="Range"&&selMgr.anchorNode!==selMgr.focusNode){if(DOM.findParentOrSelf(selMgr.anchorNode,ctx.txtRoot,n=>n instanceof InlLeaf&&n.model.nodeName===this.tagName&&n.model.role===this.role)!==null)return true}return DOM.findParentOrSelf(selMgr.focusNode,ctx.txtRoot,n=>n instanceof InlLeaf&&n.model.nodeName===this.tagName&&n.model.role===this.role)!==null}execute(ctx,ev){const selMgr=ctx.txtRoot.selMgr.restoreSel()
if(this.getDatas("toggle",ctx)){const set=new Set
selMgr.iterateNodesInSel(node=>{const txtElt=DOM.findParentOrSelf(node,ctx.txtRoot,n=>n instanceof InlLeaf&&n.model.nodeName===this.tagName&&n.model.role===this.role)
if(txtElt)set.add(txtElt)
else if(node instanceof HTMLElement){for(const leaf of node.querySelectorAll("inl-leaf")){if(leaf.model.nodeName===this.tagName&&leaf.model.role===this.role)set.add(leaf)}}})
if(set.size>0){const batch=ctx.wedMgr.docHolder.newBatch(selMgr.getXaRange())
const remMem=new Map
for(const inl of set)unwrapInl(inl,batch,remMem)
batch.doBatch()}}else{if(selMgr.type==="Caret"){this.insertTagAtCaret(ctx,selMgr)}else{const range=selMgr.range
const batch=ctx.wedMgr.docHolder.newBatch(selMgr.getXaRange())
selMgr.iterateNodesInSel(node=>{const txtElt=findTxtEltParent(node,true)
if((node===range.startContainer||node===range.endContainer)&&txtElt instanceof TxtStr){if(!txtElt.isVirtual()&&(node===range.startContainer||findTxtStrParent(range.startContainer)!==txtElt)){const model=findTxtEltParent(txtElt).getTxtWedModel(this.tagName,this.role)
if(model){const text=txtElt.getXmlText()
const offsetStart=node===range.startContainer?txtElt.getXmlOffset(node,range.startOffset):0
const offsetEnd=node===range.endContainer?txtElt.getXmlOffset(node,range.endOffset):text.length
batch.splitText(XA.append(txtElt.wedAnchor,offsetStart),offsetEnd-offsetStart,text.substring(offsetEnd),[model.newJml(),[text.substring(offsetStart,offsetEnd)]]).needAdjustForNextAdds()}}}else if(node instanceof TxtStr){if(!node.isVirtual()){const model=findTxtEltParent(node).getTxtWedModel(this.tagName,this.role)
if(model)batch.spliceSequence(node.wedAnchor,1,[model.newJml(),[node.getXmlText()]]).needAdjustForNextAdds()}}else if(node instanceof HTMLElement){for(const txtStr of node.querySelectorAll("txt-str")){if(!txtElt.isVirtual()){const model=findTxtEltParent(txtStr).getTxtWedModel(this.tagName,this.role)
if(model)batch.spliceSequence(txtStr.wedAnchor,1,[model.newJml(),[txtStr.getXmlText()]]).needAdjustForNextAdds()}}}})
if(batch.getState()==="empty"){}else{batch.doBatch()}}}}}registerTxtAction("toggleTextLeafMulti",ToggleTextLeafMulti)
class ToggleTextLeafSingle extends InsertInl{isToggle(ctx){return true}isEnabled(ctx){if(!super.isEnabled(ctx))return false
const selMgr=ctx.txtRoot.selMgrAsIs
const selType=selMgr.type
if(selType==="Range"||selType==="Caret"){const str=findTxtStrParent(selMgr.focusNode,true)
if(selType==="Range"&&str!==findTxtStrParent(selMgr.anchorNode,true))return false
const ctn=findTxtEltParent(str)
if(ctn&&ctn.model.nodeName===this.tagName&&ctn.model.role===this.role)return true
return ctn&&ctn.getTxtWedModel(this.tagName,this.role)!=null}return false}getDatas(api,ctx){const selMgr=ctx.txtRoot.selMgr
if(!selMgr.focusNode)return false
const str=findTxtStrParent(selMgr.focusNode,true)
const ctn=findTxtEltParent(str)
return ctn instanceof InlWrap&&ctn.model.nodeName===this.tagName&&ctn.model.role===this.role}async execute(ctx,ev){const selMgr=ctx.txtRoot.selMgr.restoreSel()
const str=findTxtStrParent(selMgr.focusNode,true)
const ctn=findTxtEltParent(str)
if(!ctn)return
if(ctn instanceof InlWrap&&ctn.model.nodeName===this.tagName&&ctn.model.role===this.role){const batch=ctx.txtRoot.wedMgr.docHolder.newBatch(selMgr.getXaRange())
unwrapInl(ctn,batch)
batch.doBatch()}else{if(selMgr.type==="Caret"){this.insertTagAtCaret(ctx.txtRoot,selMgr)}else{const range=selMgr.range
const model=ctn.getTxtWedModel(this.tagName,this.role)
if(model){let newJml
if(model.hasOnCreateHook){newJml=await model.callOnCreateHook(ctn)
if(!newJml||TxtInsertAction.isInsertPointLost(ctx,ctn,selMgr))return}else{newJml=[model.newJml()]}const text=str.getXmlText()
const offsetStart=str.getXmlOffset(range.startContainer,range.startOffset)
const offsetEnd=str.getXmlOffset(range.endContainer,range.endOffset)
JML.appendChildren([text.substring(offsetStart,offsetEnd)],newJml,0)
ctx.txtRoot.wedMgr.docHolder.newBatch(selMgr.getXaRange()).splitText(XA.append(str.wedAnchor,offsetStart),offsetEnd-offsetStart,text.substring(offsetEnd),newJml).doBatch()}}}}}registerTxtAction("toggleTextLeafSingle",ToggleTextLeafSingle)
export class ToggleSpanSingle extends InsertInl{isToggle(ctx){return true}isEnabled(ctx){if(!super.isEnabled(ctx))return false
const selMgr=ctx.txtRoot.selMgrAsIs
const selType=selMgr.type
if(selType==="Range"){let ctn=findTxtEltParent(selMgr.commonAncestor,true)
if(ctn instanceof TxtStr)ctn=findTxtEltParent(ctn)
return ctn&&ctn.getTxtWedModel(this.tagName,this.role)!=null}let ctn
if(selType==="Caret"){const str=findTxtStrParent(selMgr.focusNode,true)
ctn=findTxtEltParent(str)}else if(selType==="Object"){ctn=findTxtEltParent(selMgr.focusNode)}if(ctn&&ctn.getTxtWedModel(this.tagName,this.role)!=null)return true
while(ctn&&ctn.isTextContainer){if(ctn.model.nodeName===this.tagName&&ctn.model.role===this.role)return true
ctn=findTxtEltParent(ctn)}return false}getDatas(api,ctx){return this.findSpan(ctx.txtRoot.selMgr)!=null}findSpan(selMgr){if(selMgr.type==="None")return null
let ctn=findTxtEltParent(selMgr.commonAncestor,true)
while(ctn instanceof InlElement||ctn instanceof TxtStr){if(ctn.model.nodeName===this.tagName&&ctn.model.role===this.role)return ctn
ctn=findTxtEltParent(ctn)}return null}async execute(ctx,ev){const selMgr=ctx.txtRoot.selMgr.restoreSel()
const found=this.findSpan(selMgr)
if(found){const batch=ctx.wedMgr.docHolder.newBatch(selMgr.getXaRange())
unwrapInl(found,batch)
const prev=findTxtEltPreviousSibling(found)
if(prev instanceof TxtStr){const offset=prev.getXmlTextLength()
batch.setSelAfterSkipAdjust(XA.append(prev.wedAnchor,offset))}else{console.log("prev TxtStr not found???")
batch.setSelAfterSkipAdjust(found.wedAnchor)}batch.doBatch()}else{const selType=selMgr.type
if(selType==="Range"){let commonAnc=findTxtEltParent(selMgr.commonAncestor,true)
if(commonAnc&&(commonAnc.isTextContainer||commonAnc instanceof TxtStr)){let txtStr
if(commonAnc instanceof TxtStr){txtStr=commonAnc
commonAnc=findTxtEltParent(commonAnc)}const model=commonAnc.getTxtWedModel(this.tagName,this.role)
if(model){const doc=ctx.wedMgr.docHolder
let newJml
if(model.hasOnCreateHook){newJml=await model.callOnCreateHook(commonAnc)
if(!newJml||TxtInsertAction.isInsertPointLost(ctx,commonAnc,selMgr))return}else{newJml=[model.newJml()]}const batch=doc.newBatch(selMgr.getXaRange())
const range=selMgr.getXaRangeInBlock()
if(newJml.length<2)newJml.push(doc.extractRange(range,batch,[]))
else doc.extractRange(range,batch,newJml[1])
if(commonAnc.isVirtual()){WEDLET.insertDatasFromDisplay(commonAnc,batch,newJml)
batch.setSelAfter(range.start).doBatch()}else if(txtStr){if(txtStr.isVirtual()){batch.insertJml(range.start,newJml).doBatch()}else{batch.insertJml(XA.incrAtDepth(txtStr.wedAnchor,-1,1),newJml).doBatch()}}else{const commonXa=commonAnc.wedAnchor
batch.insertJml(XA.append(commonXa,range.start[commonXa.length]+1),newJml).doBatch()}}}}else if(selType==="Caret"){return this.insertTagAtCaret(ctx,selMgr)}else if(selType==="Object"){return this.wrapObject(ctx,selMgr)}}}}registerTxtAction("toggleSpanSingle",ToggleSpanSingle)
export class OpenMetaDialog extends Action{static openMetaDialog(txtNode){if(!txtNode)return
const metaDefs=txtNode.getMetaDefs()
if(metaDefs){const dialog=METAS.openMeta(metaDefs)
if(dialog)dialog.then(()=>{if(txtNode.isConnected)txtNode.txtRoot.selMgrAsIs.setSelection(txtNode)})}}initFromWed(elt){}isEnabled(ctx){if(!super.isEnabled(ctx))return false
let txtNode=ctx.txtRoot.selMgrAsIs.commonTxtElement
if(txtNode instanceof TxtStr)txtNode=findTxtEltParent(txtNode)
if(!txtNode)return false
return txtNode.hasMetaDefs()}execute(ctx,ev){let txtNode=ctx.txtRoot.selMgrAsIs.commonTxtElement
if(txtNode instanceof TxtStr)txtNode=findTxtEltParent(txtNode)
OpenMetaDialog.openMetaDialog(txtNode)}}registerTxtAction("openMetaDialog",OpenMetaDialog)
class SpellcheckSuggestion extends Action{constructor(word){super()
this.word=word
this._label=word
this._group="dictSuggest"}execute(ctx,ev){const rg=ctx.txtRoot.selMgrAsIs.getXaRange()
if(rg&&XA.isBeforeInSameSeq(rg.start,rg.end)){ctx.wedMgr.docHolder.newBatch().spliceSequence(rg.start,XA.last(rg.end)-XA.last(rg.start),this.word).doBatch()}}}export const spellcheckMenu=new ActionMenu("spellcheck").setLabel("Correction orthographique").setVisible(ctx=>Desk.electron&&ACTION.spellcheckSymbol in ctx).setActions((ctx,action)=>{const actions=[]
for(const dictSuggest of ctx[ACTION.spellcheckSymbol].dictionarySuggestions){actions.push(new SpellcheckSuggestion(dictSuggest))}actions.push(addToDict)
return ACTION.injectSepByGroup(actions,"dictSuggest *",ctx)})
export const copyAsXml=new Action("copyXml").setLabel("Copier en XML").setExecute((ctx,ev)=>{const selMgr=ctx.txtRoot.selMgr
if(selMgr.tableLayout)selMgr.tableLayout.onCopyXml()
else ctx.wedMgr.writeRangeToClipboardAsXml(selMgr.getXaRange())})
export const pasteAsText=new WedEditAction("pasteRawText").setLabel("Coller texte brut").setExecute((ctx,ev)=>{ctx.txtRoot.doPaste("text")})
export const pasteAsString=new WedEditAction("pasteRawString").setLabel("Coller texte brut mono-paragraphe").setExecute((ctx,ev)=>{ctx.txtRoot.doPaste("string")})
const addToDict=new Action("addToDict").setLabel("Ajouter au dictionnaire").setExecute(ctx=>{window.postMessage({type:"client:spellcheck:addToDict",word:ctx[ACTION.spellcheckSymbol].misspelledWord},location.origin)})

//# sourceMappingURL=txtActions.js.map