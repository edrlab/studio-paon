import{onTxtTableFlexPointerDown,TableLayout}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/txtSel.js"
import{TXT_NS,TxtModel,TxtRoot}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txt.js"
import{deleteXmlText,getWebOffset,getXmlOffset,insertXmlText,IS_TxtStrTextNode,planRedrawTxtStrAnnots,resetXmlText,xmlLen}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtStr.js"
import{TXTTABLE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtTable.js"
import{adjustVirtualsPara,adjustVirtualsStr,cellSpanMgrDefault,createChildToDisplay,deleteWebRange,exportFragment,findOrCreateTxtStr_inline,findTxtEltFirstChild,findTxtEltLastChild,findTxtEltNextSibling,findTxtEltOrRootParent,findTxtEltParent,findTxtEltPreviousSibling,findTxtParaLikeFrom,findTxtStrNext,findTxtStrParent,findTxtStrPrevious,getMetaDefs_multi,hasMetaDefs_multi,IS_TxtBlock,IS_TxtElement,IS_TxtElementReal,IS_TxtParaParent,IS_TxtStr,isUnwrappable_inline,merge_elts,merge_none,onPointerDownObject,unwrapSeq_inline}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtUtils.js"
import{EWedletEditMode,IS_EltWedlet,WedAnnotErr,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{AgWedletSingleElt,EWedletArch,isWedletSingleElt,OffView,WEDLET_SINGLEELT}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedletSingleElt.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{DOM,ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{JML,JmlSubSetIterator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{FetchJml}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/docHolder.js"
import{applyXmlMsgOnElt,applyXmlMsgOnString}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{EAnnotLevel,isSkTextAnnot}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaAnnots.js"
import{AgWedletInsMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/insMgr.js"
import{AgEltBoxInsertDrawerTxt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/insMgrTxt.js"
import{SkSearchTextAnnot}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaSearch.js"
var computeOffset=DOM.computeOffset
var findFirstChild=DOM.findFirstChild
export class TxtElement extends HTMLElement{get metas(){return this._metas instanceof Element?this._metas:null}get hasMetas(){return!!this._metas}get txtRole(){return this.getAttribute("txt-role")||""}set txtRole(role){role?this.setAttribute("txt-role",role):this.removeAttribute("txt-role")}get txtRoot(){return this.parentNode.txtRoot}get wedAnchor(){return XA.append(this.wedParent.wedAnchor,this.xaPart!=null?this.xaPart:this.getVirtualXaPart())}get wedMgr(){return this.wedParent.wedMgr}get element(){return this}get elementHost(){return this}get wedlet(){return this}get isParaSibling(){return false}get isTextContainer(){return false}get txtWedModels(){return this.model.txtWedModels}get paraModel(){return this.model.paraModel||this.txtRoot.wedConfig.paraModel}get strModel(){return null}getTxtWedModel(tagName,role){return this.model.getTxtWedModel(tagName,role)}initWedlet(model,parent,displayContext){this.model=model
if(displayContext)this.displayCtx=displayContext
this.wedParent=parent
this.configWedletElt(model.config,this)
return this}configWedletElt(tpl,wedlet){const style=tpl.getAttributeNS(TXT_NS,"style")
if(style)this.setAttribute("style",style)
const lang=tpl.getAttributeNS(TXT_NS,"lang")
if(lang)this.setAttribute("lang",lang)
const spellcheck=tpl.getAttributeNS(TXT_NS,"spellcheck")
if(spellcheck)this.setAttribute("spellcheck",spellcheck)}bindWithNode(xaOffest,node,children){this.xaPart=xaOffest
if(this.model.hasRefresh)this.wedAttributes=Object.assign({},node)
this.txtRole=node[TxtModel.ATTNAME_role]||""
this.element.refreshBindValue(node,children)
if(this._metas)this._metas=false
let promises
if(children&&children.length>0){promises=this.appendChildNodes(children)}if(this.model.hasRefresh&&!this._metas)this.model.callRefresh(this)
this.onChildWedletsChange()
if(promises)return Promise.all(promises)}onChildWedletsChange(){const virtuals=this.getChildrenModelToDisplay()
if(virtuals){let nextVirtualIdx=0
for(let elt=findTxtEltFirstChild(this);elt;elt=DOM.findNextSibling(elt,e=>IS_TxtElement(e)&&e.model!==elt.model)){while(elt.model!==virtuals[nextVirtualIdx++]){const model=virtuals[nextVirtualIdx-1]
if(!DOM.findNextSibling(elt,e=>IS_TxtElement(e)&&e.model===model)){createChildToDisplay(this,model,elt)}if(nextVirtualIdx>=virtuals.length)return}if(nextVirtualIdx>=virtuals.length)return}for(let i=nextVirtualIdx;i<virtuals.length;i++){createChildToDisplay(this,virtuals[i])}}}bindAsVirtual(){this.xaPart=null
if(this.wedAttributes)this.wedAttributes=null
this.txtRole=this.model.role
if(this._metas)this._metas=false
this.element.refreshBindValue(null)
WEDLET_SINGLEELT.clearChildrenAsVirtual(this)
if(this.model.hasRefresh)this.model.callRefresh(this)
this.onChildWedletsChange()
return this}onChildEmptied(willBeEmptied){return null}isVirtual(){return this.xaPart===null}getVirtualXaPart(){if(this.xaPart!=null)return this.xaPart
const prev=DOM.findPreviousSibling(this,IS_TxtElementReal)
if(prev)return prev.xaPart+1
const parent=findTxtEltParent(this)
if(parent)return parent.getFirstChildXmlOffset()
const prevElt=DOM.findPreviousSibling(this.element,n=>IS_EltWedlet(n)&&typeof n.wedlet.xaPart==="number")
return prevElt?prevElt.wedlet.xaPart+1:0}deleteVirtualWedlet(){this.element.remove()}newJml(){return this.model.newJml()}async highlightFromLink(blockPos){const target=this.getBoundingClientRect()
const scrollCtn=this.wedMgr.wedEditor.scrollContainer
let instant=false
if(scrollCtn){const scrollBox=scrollCtn.getBoundingClientRect()
let delta
if(blockPos==="nearest"){delta=Math.min(Math.abs(target.bottom-scrollBox.top),Math.abs(target.top-scrollBox.bottom))}else{delta=Math.abs(target.top-scrollBox.top)}instant=delta>scrollBox.height*2}if(instant)scrollCtn.style.scrollBehavior="auto"
if(this.tabIndex>=0){this.focus()
this.scrollIntoView({block:blockPos,behavior:instant?"auto":"smooth"})}else{const selMgr=this.txtRoot.selMgr
if(!selMgr.focusNode)this.txtRoot.focus()
this.setCaretIn(selMgr,true)
selMgr.ensureSelVisible()
this.setCaretIn(selMgr,false,"extend")}if(instant)scrollCtn.style.scrollBehavior="smooth"}insertVirtualPara(before){const paraModel=this.paraModel
const para=paraModel.createWedlet(this.wedlet,null)
para.configWedletElt(paraModel.config,para)
this.insertBefore(para,before)
return para.bindAsVirtual()}insertVirtualStr(before){createChildToDisplay(this,this.strModel,before)}get editMode(){return this.txtRoot.isContentEditable?EWedletEditMode.write:EWedletEditMode.read}refreshEditMode(){}isOffViewAllowed(){return false}getChildrenModelToDisplay(){return null}appendChildNodes(children,promises){const it=new JmlSubSetIterator(children)
while(it.next()){const promise=this.xInsertChildNode(it.currentIdx,it.currentNode,it.currentChildren,this.tailNode)
if(promise){if(!promises)promises=[promise]
else promises.push(promise)}}return promises}isMetasNode(index,node){return index===0&&this.model.metasName&&JML.jmlNode2name(node)===this.model.metasName}setMetasNode(node,children){this._metas=true
if(this.model.hasRefresh){const wedMgr=this.wedMgr
this.wedMgr.doAfterBatch(()=>{if(wedMgr.docHolder){this._metas=XA.findDomLast(XA.append(this.wedAnchor,0),wedMgr.docHolder.getDocument())
this.model.callRefresh(this)}else if(JML.isWhole(children)){this._metas=JML.jmlToElt(node,children)
this.model.callRefresh(this)}else{this.loadMetas(wedMgr)}})}}resetMetasNode(){if(this._metas){this._metas=false
this.model.callRefresh(this)}}async loadMetas(wedMgr){const[jmlFetch]=await wedMgr.docHolderAsync.fetchContent([new FetchJml(XA.append(this.wedAnchor,0))])
this._metas=JML.jmlToElt(jmlFetch.result[0],jmlFetch.result[1])
this.model.callRefresh(this)}hasMetaDefs(){return this.model.panelModel!=null}getMetaDefs(){return this.model.panelModel?{from:this,model:this.model.panelModel,label:this.model.nodeLabel}:null}xInsertChildNode(index,node,children,insertBefore){if(typeof node==="number"){if(this.isOffViewAllowed()){const elt=(new OffView).initViewOff(this,index,node)
let previousNotVirtual=insertBefore?insertBefore.previousElementSibling:this.lastElementChild
while(previousNotVirtual&&IS_EltWedlet(previousNotVirtual)&&previousNotVirtual.wedlet.isVirtual()){insertBefore=previousNotVirtual
previousNotVirtual=previousNotVirtual.previousElementSibling}this.insertBefore(elt,insertBefore)}else{const xa=XA.append(this.wedAnchor,index)
const wedMgr=this.wedMgr
if(wedMgr.docHolder){const jml=wedMgr.getContent(xa)
if(jml.length>0)this.xInsertChildNode(index,jml[0],jml[1],insertBefore)
wedMgr.dispatchAnnotsAfterRebuildWedlet(xa)}else{console.log("TxtElement: TODO docHolder async.")}}return}if(this.isMetasNode(index,node)){this.setMetasNode(node,children)
return}const model=this.wedMgr.wedModel.findModelForNode(node,null,null,this,TxtModel.wedSelector,this.txtWedModels)
if(!model)return
const virtualTxtElt=this.findVirtualTxtElt(this,model,insertBefore)
if(virtualTxtElt){if(virtualTxtElt.model===model&&virtualTxtElt.getVirtualXaPart()===index){virtualTxtElt.bindWithNode(index,node,children)
return}virtualTxtElt.remove()}const wedletCh=model.createWedlet(this)
if(!wedletCh)return
if(IS_TxtElement(wedletCh)){wedletCh.insertElement(this,insertBefore)
return wedletCh.bindWithNode(index,node,children)}else{console.trace("TODO meta des balises txt...")}}findVirtualTxtElt(parent,model,before){if(model.nodeType===ENodeType.element){for(let ch=before?before.previousElementSibling:parent.lastElementChild;ch;ch=ch.previousElementSibling){if(IS_TxtElement(ch)&&ch.isVirtual()&&ch.model.nodeName===model.nodeName)return ch}}else if(model.nodeType===ENodeType.text){for(let ch=before?before.previousElementSibling:parent.lastElementChild;ch;ch=ch.previousElementSibling){if(ch instanceof TxtStr&&ch.isVirtual())return ch}}return null}refreshBindValue(val,children){if(this.isVirtual()){if(DOM.addClass(this,"virtual"))DOM.setTextContent(this,null)}else this.classList.remove("virtual")}insertElement(parent,insertBefore,slotName,caller){if(slotName)this.setAttribute("slot",slotName)
if(caller)this.fromChildrenElt=caller
parent.insertBefore(this,insertBefore)}insertChildNode(xaOffest,node,children){let done=false
for(let ch=findTxtEltFirstChild(this);ch;ch=findTxtEltNextSibling(ch)){const xaPart=ch.xaPart
if(xaPart===xaOffest){this.xInsertChildNode(xaOffest,node,children,ch)
ch.wedlet.xaPart=xaPart+1
done=true}else if(xaPart>xaOffest){ch.wedlet.xaPart=xaPart+1}}if(!done)this.xInsertChildNode(xaOffest,node,children,null)
this.onChildNodesInserted()}onChildNodesInserted(){this.onChildWedletsChange()}replaceChildBind(xaOffest,node,children){if(this.isMetasNode(xaOffest,node)){this.setMetasNode(node,children)
return}for(let ch=findTxtEltFirstChild(this);ch;ch=findTxtEltNextSibling(ch)){const xaPart=ch.wedlet.xaPart
if(xaPart===xaOffest){const next=ch.nextElementSibling
if("onDelete"in ch.wedlet)ch.wedlet.onDelete()
ch.remove()
const pr=this.xInsertChildNode(xaOffest,node,children,next)
this.onChildWedletsChange()
return pr}}}async updateRole(newRole){let xa=this.wedAnchor
const wedMgr=this.wedMgr
let jml
if(wedMgr.docHolder){jml=wedMgr.docHolder.getContent(xa)}else{const result=(await wedMgr.docHolderAsync.fetchContent([new FetchJml(xa)]))[0]
jml=result.result
xa=result.xa}if(jml&&jml.length>0){this.wedParent.replaceChildBind(this.xaPart,jml[0],jml[1])
wedMgr.dispatchAnnotsAfterRebuildWedlet(xa)}}insertAttrNode(nameAttr,value){if(nameAttr===this.model.roleAttName){this.updateRole(value)}else if(this.wedAttributes){this.wedAttributes[nameAttr]=value
this.model.callRefresh(this)}}deleteAttrNode(nameAttr){if(nameAttr===this.model.roleAttName){this.updateRole(null)}else if(this.wedAttributes){delete this.wedAttributes[nameAttr]
this.model.callRefresh(this)}}deleteChildNodes(xaOffest,count){if(xaOffest===0&&this.hasMetas){this.resetMetasNode()}const last=xaOffest+count
let ch=findTxtEltLastChild(this)
while(ch){const next=findTxtEltPreviousSibling(ch)
const xaPart=ch.xaPart
if(typeof xaPart==="number"&&xaPart>=xaOffest){if(xaPart<last){if(ch.mustKeepAsVirtual()){ch.bindAsVirtual()}else{if("onDelete"in ch.wedlet)ch.wedlet.onDelete()
ch.remove()}}else{ch.xaPart=xaPart-count}}ch=next}this.onChildWedletsChange()}updateInDescendants(msg){const wedletDepth=WEDLET.getWedletDepth(this)
const xaChPart=msg.xa[wedletDepth]
if(xaChPart===this.model.roleAttName){this.updateRole(applyXmlMsgOnString(msg,this.txtRole))
return}if(this.wedAttributes){if(typeof xaChPart==="string"){this.wedAttributes[xaChPart]=applyXmlMsgOnString(msg,this.wedAttributes[xaChPart])
this.model.callRefresh(this)
return}}if(this.metas){if(xaChPart===0){if(!this.wedMgr.docHolder)applyXmlMsgOnElt(msg,wedletDepth+1,this.metas)
this.model.callRefresh(this)}}}onAddedSkAnnot(annot,xaTarget){var _a
if(annot.level.weight<=EAnnotLevel.error.weight&&annot.level.weight>0){if(this.wedAnnotErr){this.wedAnnotErr.addAnnot(annot,!WEDLET.isWedletBindXa(this,xaTarget))}else{(new WedAnnotErr).initAnnot(this,annot,this,!WEDLET.isWedletBindXa(this,xaTarget))}}else if(((_a=WEDLET.diffLib)===null||_a===void 0?void 0:_a.isDiffAnnot(annot))&&annot.diffSession===this.wedMgr.docHolder.getDiffSession()){if(!WEDLET.isWedletBindXa(this,xaTarget)){this.insertDiffInMeta(annot)}else{if(annot.type==="diffMark"){this.insertDiffMark(annot)}else if(annot.type==="diffValue"){this.insertDiffValue(annot)}else if(annot.type==="diffForeign"){this.insertDiffForeign(annot)}else if(annot.type==="diffMix"){this.insertDiffMix(annot)}else if(annot.type==="diffReplace"){this.insertDiffReplace(annot)}}}}onRemovedSkAnnot(annot,xaTarget){var _a
if(annot.level.weight<=EAnnotLevel.error.weight&&annot.level.weight>0){if(this.wedAnnotErr)this.wedAnnotErr.removeAnnot(annot)}else if(((_a=WEDLET.diffLib)===null||_a===void 0?void 0:_a.isDiffAnnot(annot))&&annot.diffSession===this.wedMgr.docHolder.getDiffSession()){if(!WEDLET.isWedletBindXa(this,xaTarget)){this.removeDiffInMeta(annot)}else{if(annot.type==="diffMark"){this.removeDiffMark(annot)}else if(annot.type==="diffValue"){this.removeDiffValue(annot)}else if(annot.type==="diffForeign"){this.removeDiffForeign(annot)}else if(annot.type==="diffMix"){this.removeDiffMix(annot)}else if(annot.type==="diffReplace"){this.removeDiffReplace(annot)}}}}insertDiffInMeta(annot){if(this.wedAnnotDiff&&this.wedAnnotDiff.addAnnotForMetas){this.wedAnnotDiff.addAnnotForMetas(annot)}else{if(!this.diffInMeta)this.diffInMeta=new WEDLET.diffLib.DiffInMeta(this)
this.diffInMeta.addAnnot(annot)}}removeDiffInMeta(annot){if(this.wedAnnotDiff&&this.wedAnnotDiff.removeAnnotForMetas){this.wedAnnotDiff.removeAnnotForMetas(annot)}else{if(this.diffInMeta)this.diffInMeta.removeAnnot(annot)}}insertDiffMark(annot){document.createElement("wed-diff-mark").initDiffAnnot(this,annot,this.wedlet).defaultInject()}removeDiffMark(annot){var _a
if(((_a=this.wedAnnotDiff)===null||_a===void 0?void 0:_a.skAnnot)===annot)this.wedAnnotDiff.removeDiffWidget()}insertDiffValue(annot){var _a
document.createElement("wed-diff-value").initDiffValue(annot,this,this.wedlet.wedMgr,(_a=this.makeInputForDiff)===null||_a===void 0?void 0:_a.call(this,annot))}removeDiffValue(annot){var _a
if(((_a=this.wedAnnotDiff)===null||_a===void 0?void 0:_a.skAnnot)===annot)this.wedAnnotDiff.removeDiffWidget()}insertDiffForeign(annot){const insBeforeWedlet=typeof annot.offset==="number"?this.findWedletChild(annot.offset,WEDLET.VISITOPTIONS_mainBranch):undefined
const elt=document.createElement("wed-diff-foreign").initDiffForeign(annot,annot.createForeignHouse(this.diffForeignBuildDoc(annot)),this)
elt.subEditor.wedMgr.listeners.on("redrawAtEnd",this.diffForeignRedrawAtEnd)
this.injectForeignChild(annot.foreignNode,elt,insBeforeWedlet)}removeDiffForeign(annot){var _a;(_a=DOM.findFirstChild(this,n=>n.localName==="wed-diff-foreign"&&n.skAnnot===annot))===null||_a===void 0?void 0:_a.remove()}diffForeignBuildDoc(annot){return null}diffForeignRedrawAtEnd(wedMgr,commands){const rootWedlet=wedMgr.wedEditor.rootNode.firstElementChild
const skins=rootWedlet.getAttribute("skins4fragOver")
if(skins)skins.split(" ").forEach(pSkinOver=>wedMgr.reg.installSkin(pSkinOver,rootWedlet.shadowRoot))}insertDiffMix(annot){console.log("insertDiffMix not on ParaLike:::",this,annot)}removeDiffMix(annot){}insertDiffReplace(annot){console.trace("insertDiffReplace:::",this,annot)}removeDiffReplace(annot){console.trace("removeDiffReplace:::",annot)}setCaretIn(selMgr,fromStart,alter="move"){if(this.isFocusableByCaret()){if(alter==="move"){this.focus()}else{this.moveCaretOut(selMgr,!fromStart,alter)}}else{this.findOrCreateTxtStrOrObject(!fromStart).setCaretIn(selMgr,fromStart,alter)}}moveCaretOut(selMgr,throwStart,alter="move"){const next=this.findOrCreateCaretableSibling(throwStart)
if(next){next.setCaretIn(selMgr,!throwStart,alter)}else{const p=findTxtEltParent(this)
if(p)p.moveCaretOut(selMgr,throwStart,alter)
else if(alter==="move"){this.setCaretIn(selMgr,throwStart)}}}findOrCreateCaretableSibling(before){let next=before?findTxtEltPreviousSibling(this):findTxtEltNextSibling(this)
if(this.isParaSibling&&!(this instanceof TxtPara)&&!(next instanceof TxtPara)){console.trace("CreateOnTheFly: TxtPara")
return findTxtEltOrRootParent(this).insertVirtualPara(before?this:this.nextSibling)}while(next){if(next.isFocusableByCaret())return next
const caretable=next.findOrCreateTxtStr(before)
if(caretable)return caretable
next=before?findTxtEltPreviousSibling(next):findTxtEltNextSibling(next)}return null}findOrCreateTxtStr(last){let ch=last?findTxtEltLastChild(this):findTxtEltFirstChild(this)
if(!ch){console.trace("CreateOnTheFly: display content")
this.onChildWedletsChange()
ch=last?findTxtEltLastChild(this):findTxtEltFirstChild(this)}let res=ch.findOrCreateTxtStr(last)
while(!res){ch=last?findTxtEltPreviousSibling(ch):findTxtEltNextSibling(ch)
if(!ch)break
res=ch.findOrCreateTxtStr(last)}return res}findOrCreateTxtStrOrObject(last){let ch=last?findTxtEltLastChild(this):findTxtEltFirstChild(this)
if(!ch){console.trace("CreateOnTheFly: display content")
this.onChildWedletsChange()
ch=last?findTxtEltLastChild(this):findTxtEltFirstChild(this)}return ch.findOrCreateTxtStrOrObject(last)}exportWrap(toWrap){const elt=this.model.newJml()
if(this.model.role===null){const role=this.txtRole
if(role)elt[TxtModel.ATTNAME_role]=role}return toWrap?[elt,toWrap]:[elt]}exportContent(){const firstCh=findFirstChild(this,IS_TxtElementReal)
if(firstCh)return exportFragment(this,firstCh.xaPart,this,Number.MAX_SAFE_INTEGER)
return[]}deleteByCaret(fromInside,backward,batch){if(this.isRemovableByCaret()){if(this.isVirtual()){if(this.mustKeepAsVirtual()){const parent=findTxtEltParent(this)
if(parent&&parent.isEmpty())parent.deleteByCaret(true,backward,batch)
else this.moveCaretOut(this.txtRoot.selMgr,backward)}else{this.moveCaretOut(this.txtRoot.selMgr,backward)
this.remove()}}else{if(this.mustKeepAsVirtual()){const parent=findTxtEltParent(this)
if(parent&&parent.isEmpty()){parent.deleteByCaret(true,backward,batch)
return}}batch.deleteSequence(this.wedAnchor,1)
this.moveCaretOut(this.txtRoot.selMgr,true)}}else{if(fromInside){const sibling=backward?findTxtEltPreviousSibling(this):findTxtEltNextSibling(this)
if(sibling){if(!(backward?sibling.merge(this,batch):this.merge(sibling,batch))){if(sibling instanceof InlElement||sibling.isEmpty()){sibling.deleteByCaret(false,backward,batch)}else{sibling.setCaretIn(this.txtRoot.selMgr,!backward)}}}else{const parent=findTxtEltParent(this)
if(parent)parent.deleteByCaret(true,backward,batch)}}else{const ch=backward?findTxtEltLastChild(this):findTxtEltFirstChild(this)
ch.deleteByCaret(false,backward,batch)}}}isFocusableByCaret(){return false}isRemovableByCaret(){for(let ch=findTxtEltFirstChild(this);ch;ch=findTxtEltNextSibling(ch)){if(!ch.isRemovableByCaret())return false}return true}onChildDeletedByCaret(ch){return null}isEmpty(){for(let ch=findTxtEltFirstChild(this);ch;ch=findTxtEltNextSibling(ch)){if(!ch.isEmpty())return false}return true}isXmlStartOffset(from,webOffset){if(from===this)return webOffset===0
const txtStr=findTxtStrParent(from,true)
if(!txtStr)return false
if(txtStr.wedParent!==this)return false
if(DOM.findPreviousSibling(txtStr,IS_TxtElementReal))return false
return txtStr.isXmlStartOffset(from,webOffset)}isXmlEndOffset(from,webOffset){const txtStr=findTxtStrParent(from,true)
if(!txtStr)return false
if(txtStr.wedParent!==this)return false
if(DOM.findNextSibling(txtStr,IS_TxtElementReal))return false
return txtStr.isXmlEndOffset(from,webOffset)}mustKeepAsVirtual(){return false}unwrapSeq(target,fromChild,toChild,batch,addSelAfter){return false}isUnwrappable(target){return null}isMergeable(next){return false}getFirstChildXmlOffset(){return this.hasMetas?1:0}getAppendXmlOffset(){let ch=findTxtEltLastChild(this)
if(ch&&ch.isVirtual())ch=DOM.findPreviousSibling(ch,IS_TxtElementReal)
return ch?ch.xaPart+1:this.hasMetas?1:0}injectForeignChild(similarTo,elt,before,after,options){this.insertBefore(elt,isWedletSingleElt(before)?before.element:isWedletSingleElt(after)?after.element.nextSibling:null)}}TxtElement.prototype.merge=merge_none
AgWedletInsMgr(AgEltBoxInsertDrawerTxt(AgWedletSingleElt(TxtElement,{wedletArch:EWedletArch.merged,isParentWedlet:true,isVirtualisableWedlet:false})))
export class TxtBlock extends TxtElement{isOffViewAllowed(){return false}}export class TxtParaLike extends TxtBlock{get isTextContainer(){return true}get strModel(){return this.model.strModel||this.txtRoot.wedConfig.strModel}get txtWedModels(){return this.model.txtWedModels||this.txtRoot.wedConfig.preferedInlineTxtModels}onChildWedletsChange(){adjustVirtualsStr(this,this.tailNode)}addNextPara(batch,content){const parent=findTxtEltOrRootParent(this)
if(parent instanceof TxtRoot){if(this.wedMgr.docHolder.getInsertableOffset(parent.wedlet.wedAnchor,ENodeType.element,"start",parent.paraModel.nodeName)<0)return false}else if(!(parent instanceof TxtSL||IS_TxtParaParent(parent)))return false
const model=parent.paraModel
if(!content||content.length===0){if(this.isEmpty())return true
const next=findTxtEltNextSibling(this)
if(next&&next.model===model&&next.isEmpty())return true}const jml=content?[model.newJml(),content]:[model.newJml()]
batch.insertJml(XA.incrAtDepth(this.wedAnchor,-1,1),jml)
return true}addPreviousPara(batch,content){const parent=findTxtEltOrRootParent(this)
if(parent instanceof TxtRoot){if(this.wedMgr.docHolder.getInsertableOffset(parent.wedlet.wedAnchor,ENodeType.element,"start",parent.paraModel.nodeName)<0)return false}else if(!(parent instanceof TxtSL||IS_TxtParaParent(parent)))return false
const model=parent.paraModel
if(!content||content.length===0){if(this.isEmpty())return true
const prev=findTxtEltPreviousSibling(this)
if(prev&&prev.model===model&&prev.isEmpty())return true}const jml=content?[model.newJml(),content]:[model.newJml()]
batch.insertJml(this.wedAnchor,jml)
return true}isMergeable(next){return next&&next instanceof TxtParaLike&&!(next instanceof TxtTitle)}moveAsStandardPara(ctnTarget,offsetTarget,batch){if(this.isVirtual())return
const para=[ctnTarget.paraModel.newJml(),this.exportContent()]
batch.deleteSequence(this.wedAnchor,1)
batch.insertJml(XA.append(ctnTarget.wedAnchor,offsetTarget),para)}deleteByCaret(fromInside,backward,batch){function findMergeableParaLikeOrBlock(n){if(n instanceof TxtParaLike)return true
if(IS_TxtBlock(n))return n.isUnwrappable()!=="list"
return false}if(backward){if(!(this instanceof TxtTitle)||!this.mustKeepAsVirtual()){const prev=DOM.findPrevious(this,this.txtRoot,findMergeableParaLikeOrBlock)
if(prev&&prev instanceof TxtParaLike){prev.merge(this,batch)
return}}}else{const next=DOM.findNextUncle(this,this.txtRoot,findMergeableParaLikeOrBlock)
if(next&&next instanceof TxtParaLike&&!next.isVirtual()&&(!(next instanceof TxtTitle)||!next.mustKeepAsVirtual())){this.merge(next,batch)
return}}super.deleteByCaret(fromInside,backward,batch)}insertDiffMix(annot){WEDLET.diffLib.initDiffOnPara(this,annot)}removeDiffMix(annot){WEDLET.diffLib.removeDiffOnPara(this,annot)}}TxtParaLike.prototype.findOrCreateTxtStr=findOrCreateTxtStr_inline
TxtParaLike.prototype.isUnwrappable=isUnwrappable_inline
TxtParaLike.prototype.unwrapSeq=unwrapSeq_inline
TxtParaLike.prototype.merge=merge_elts
TxtParaLike.prototype.hasMetaDefs=hasMetaDefs_multi
TxtParaLike.prototype.getMetaDefs=getMetaDefs_multi
export class TxtParaParent extends TxtBlock{get txtWedModels(){return this.model.txtWedModels||this.txtRoot.wedConfig.preferedBlockTxtModels}findVirtualTxtElt(parent,model,before){if(model.nodeType==ENodeType.element){for(let ch=before?before.previousElementSibling:parent.lastElementChild;ch;ch=ch.previousElementSibling){if(IS_TxtElement(ch)&&ch.isVirtual())return ch}}else if(model.nodeType==ENodeType.text){for(let ch=before?before.previousElementSibling:parent.lastElementChild;ch;ch=ch.previousElementSibling){if(ch instanceof TxtStr&&ch.isVirtual())return ch}}return null}onChildWedletsChange(){adjustVirtualsPara(this)}unwrapSeqFragment(fromChild,toChild,prevChild,nextChild,batch,addSelAfter){const docHolder=this.wedMgr.docHolder
const xa=this.wedAnchor
const newLi=[]
docHolder.getStruct(xa).createContent(newLi)
const xmlOffsetFrom=computeOffset(fromChild)
const xmlOffsetTo=computeOffset(toChild)
if(prevChild&&nextChild){const xaNext=XA.newBd(xa).incrAtDepth(-1,1).xa
batch.insertJml(xaNext,newLi)
const content=exportFragment(this,xmlOffsetTo+1,this,Number.MAX_SAFE_INTEGER)
const xaTarget=XA.newBd(xaNext).append(0).freeze()
batch.moveSequence(XA.newBd(xa).append(xmlOffsetTo+1).xa,content,xaTarget)
if(addSelAfter)batch.extendSelAfterSeq(xaTarget,JML.lengthJmlOrText(content))}if(!prevChild){batch.insertJml(xa,newLi)
const content=exportFragment(this,xmlOffsetFrom,this,xmlOffsetTo+1)
const xaTarget=XA.newBd(xa).append(0).freeze()
batch.moveSequence(XA.newBd(xa).incrAtDepth(-1,1).append(xmlOffsetFrom).xa,content,xaTarget)
if(addSelAfter)batch.extendSelAfterSeq(xaTarget,xmlOffsetTo+1-xmlOffsetFrom)}else{const xaNext=XA.newBd(xa).incrAtDepth(-1,1).xa
batch.insertJml(xaNext,newLi)
const content=exportFragment(this,xmlOffsetFrom,this,xmlOffsetTo+1)
const xaTarget=XA.newBd(xaNext).append(0).freeze()
batch.moveSequence(XA.append(xa,xmlOffsetFrom),content,xaTarget)
if(addSelAfter)batch.extendSelAfterSeq(xaTarget,xmlOffsetTo+1-xmlOffsetFrom)}return true}}export class TxtPara extends TxtParaLike{get isParaSibling(){return true}moveAsStandardPara(ctnTarget,offsetTarget,batch){const paraXa=this.wedAnchor
batch.moveSequence(paraXa,batch.docHolder.getContent(paraXa),XA.append(ctnTarget.wedAnchor,offsetTarget))}mustKeepAsVirtual(){return!(findTxtEltPreviousSibling(this)instanceof TxtPara||findTxtEltNextSibling(this)instanceof TxtPara)}onChildEmptied(willBeEmptied){return WEDLET.onChildEmptied(this,willBeEmptied,this.wedParent===this.txtRoot.wedlet?()=>true:null)}}window.customElements.define("txt-para",TxtPara)
export class TxtUL extends TxtBlock{get isParaSibling(){return true}isUnwrappable(target){var _a
return target!=="div"?"list":(_a=findTxtEltParent(this))===null||_a===void 0?void 0:_a.isUnwrappable(target)}getChildrenModelToDisplay(){return this.model.childrenModels}unwrapSeq(target,fromChild,toChild,batch,addSelAfter){var _a
if(target==="div")return((_a=findTxtEltParent(this))===null||_a===void 0?void 0:_a.unwrapSeq(target,this,this,batch,addSelAfter))||false
const prevChild=DOM.findPreviousSibling(fromChild,IS_TxtElementReal)
const nextChild=DOM.findNextSibling(toChild,IS_TxtElementReal)
const docHolder=this.wedMgr.docHolder
const parentTarget=findTxtEltOrRootParent(this)
const offsetTarget=!prevChild?this.xaPart:this.xaPart+1
const xaTarget=XA.append(parentTarget.wedAnchor,offsetTarget)
if(prevChild&&nextChild){const newList=[]
const xa=this.wedAnchor
docHolder.getStruct(xa).createContent(newList)
const xaNew=XA.newBd(xa).incrAtDepth(-1,1).xa
batch.insertJml(xaNew,newList)
const content=exportFragment(this,nextChild.xaPart,this,Number.MAX_SAFE_INTEGER)
batch.moveSequence(XA.append(xa,nextChild.xaPart),content,XA.newBd(xaNew).append(0).xa)}let ch=fromChild
const unwrapBatch=docHolder.newBatch()
while(ch){if(ch instanceof TxtCaption){ch.moveAsStandardPara(parentTarget,offsetTarget,unwrapBatch)
if(addSelAfter)unwrapBatch.extendSelAfterSeq(xaTarget,1)
unwrapBatch.needAdjustForNextAdds()}else if(ch instanceof TxtLI){const firstP=DOM.findFirstChild(ch,IS_TxtElementReal)
if(prevChild||nextChild)unwrapBatch.deleteSequence(ch.wedAnchor,1)
if(firstP){const content=exportFragment(ch,firstP.xaPart,ch,Number.MAX_SAFE_INTEGER)
unwrapBatch.insertJml(xaTarget,content)
if(addSelAfter)unwrapBatch.extendSelAfterSeq(xaTarget,JML.lengthJmlOrText(content))}unwrapBatch.needAdjustForNextAdds()}if(ch===toChild)break
ch=findTxtEltNextSibling(ch)}batch.add(unwrapBatch)
if(addSelAfter&&unwrapBatch.selAfter){batch.setSelAfter(unwrapBatch.selAfter.addr,unwrapBatch.selAfter.end)
unwrapBatch.setSelAfter(null)}batch.needAdjustForNextAdds()
if(!prevChild&&!nextChild){batch.deleteSequence(this.wedAnchor,1)}return true}onChildDeletedByCaret(child){for(let ch=findTxtEltFirstChild(this);ch;ch=findTxtEltNextSibling(ch)){if(ch!==child&&!ch.isVirtual())return null}return this}diffForeignBuildDoc(annot){const doc=JML.jmlToDom([this.model.newJml()],DOM.newDomDoc())
doc.documentElement.append(doc.importNode(annot.foreignNode,true))
return doc}diffForeignRedrawAtEnd(wedMgr,commands){super.diffForeignRedrawAtEnd(wedMgr,commands)
const root=wedMgr.wedEditor.rootNode
DOMSH.findFlatNext(root,root,n=>n instanceof TxtUL).classList.add("fragRoot")}}window.customElements.define("txt-ul",TxtUL)
export class TxtOL extends TxtUL{}window.customElements.define("txt-ol",TxtOL)
export class TxtSL extends TxtUL{unwrapSeq(target,fromChild,toChild,batch,addSelAfter){var _a
if(target==="div")return((_a=findTxtEltParent(this))===null||_a===void 0?void 0:_a.unwrapSeq(target,this,this,batch,addSelAfter))||false
const prevChild=DOM.findPreviousSibling(fromChild,IS_TxtElementReal)
const nextChild=DOM.findNextSibling(toChild,IS_TxtElementReal)
const docHolder=this.wedMgr.docHolder
const parentTarget=findTxtEltOrRootParent(this)
const offsetTarget=prevChild?this.xaPart+1:this.xaPart
if(prevChild&&nextChild){const newSL=[]
const xa=this.wedAnchor
docHolder.getStruct(xa).createContent(newSL)
const xaNew=XA.newBd(xa).incrAtDepth(-1,1).xa
batch.insertJml(xaNew,newSL)
const content=exportFragment(this,nextChild.xaPart,this,Number.MAX_SAFE_INTEGER)
batch.moveSequence(XA.append(xa,nextChild.xaPart),content,XA.newBd(xaNew).append(0).xa)}let ch=fromChild
const unwrapBatch=docHolder.newBatch()
while(ch){if(ch instanceof TxtParaLike){ch.moveAsStandardPara(parentTarget,offsetTarget,unwrapBatch)
if(addSelAfter)unwrapBatch.extendSelAfterSeq(XA.append(parentTarget.wedAnchor,offsetTarget),1)
unwrapBatch.needAdjustForNextAdds()}if(ch===toChild)break
ch=findTxtEltNextSibling(ch)}batch.add(unwrapBatch)
if(addSelAfter&&unwrapBatch.selAfter){batch.setSelAfter(unwrapBatch.selAfter.addr,unwrapBatch.selAfter.end)
unwrapBatch.setSelAfter(null)}batch.needAdjustForNextAdds()
if(!prevChild&&!nextChild){batch.deleteSequence(this.wedAnchor,1)}return true}}window.customElements.define("txt-sl",TxtSL)
export class TxtTable extends TxtBlock{constructor(){super()
this.tabIndex=0}get delegatedHost(){return this.table}get tableLayout(){return this._tableLayout||(this._tableLayout=new TableLayout(this))}configWedletElt(tpl,wedlet){let style=tpl.getAttributeNS(TXT_NS,"style")
if(style)this.setAttribute("style",style)
const sh=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.style.display="flex"
let flex=sh.appendChild(document.createElement("div"))
flex.style.flex="1 0 .5em"
flex.style.cursor="cell"
flex.addEventListener("pointerdown",onTxtTableFlexPointerDown)
sh.appendChild(document.createElement("slot"))
this.table=this.appendChild(document.createElement("table"))
this.table.isTxtWrapElt=true
Object.defineProperty(this.table,"txtRoot",{get(){return this.parentNode.txtRoot}})
flex=sh.appendChild(document.createElement("div"))
flex.style.flex="1 0 .5em"
flex.style.cursor="cell"
flex.addEventListener("pointerdown",onTxtTableFlexPointerDown)
style=tpl.getAttributeNS(TXT_NS,"tableStyle")
if(style)this.table.setAttribute("style",style)
this.table.style.tableLayout="fixed"
return this}get isParaSibling(){return true}isRemovableByCaret(){return false}countCols(){let res=0
for(let ch=this.table.firstElementChild;ch;ch=ch.nextElementSibling){if(ch instanceof TxtCol)res++
else if(ch instanceof TxtRow)break}return res}getCol(logicOffs){let col=DOM.findFirstChild(this.table,TXTTABLE.IS_TxtCol)
for(let i=0;i<logicOffs;i++)if(col)col=DOM.findNextSibling(col,TXTTABLE.IS_TxtCol)
return col}onChildWedletsChange(){let nextElt=findTxtEltFirstChild(this.table)
if(this.model.captionModel){if(!(nextElt instanceof TxtCaption)){createChildToDisplay(this,this.model.captionModel,nextElt)}}while(nextElt instanceof TxtCaption)nextElt=findTxtEltNextSibling(nextElt)
if(!(nextElt instanceof TxtCol)){createChildToDisplay(this,this.model.colModels[0],nextElt)}while(nextElt instanceof TxtCol)nextElt=findTxtEltNextSibling(nextElt)
if(!(nextElt instanceof TxtRow)){createChildToDisplay(this,this.model.rowModels[0],nextElt)}}get focusBar(){if(!this.tableLayout.enabled)return null
const txtRoot=this.txtRoot
const tableBars=txtRoot.txtRootProps.tableBars
if(!tableBars)return null
const bar=tableBars[this.txtRole]
if(bar){bar.actionContext.focusedElt=txtRoot
bar.actionContext.txTable=this
bar.actionContext.logicTable=this.tableLayout.logicTable}return bar}focus(){this.tableLayout.drawTableLayout()}insertDiffForeign(annot){if(!this.diffTable)this.diffTable=document.createElement("wed-diff-table").initTable(this)
this.diffTable.addAnnot(annot)}removeDiffForeign(annot){if(this.diffTable)this.diffTable.removeAnnot(annot)}}window.customElements.define("txt-table",TxtTable)
export class TxtObject extends TxtBlock{constructor(){super()
this.tabIndex=0
this.addEventListener("pointerdown",onPointerDownObject)}isFocusableByCaret(){return true}isRemovableByCaret(){return true}get isParaSibling(){return true}isEmpty(){return false}findOrCreateTxtStr(last){return null}findOrCreateTxtStrOrObject(last){return this}get focusBar(){for(let ch=this.firstElementChild;ch;ch=ch.nextElementSibling){const fb=ch.focusBar
if(fb)return fb}return this.txtRoot.focusBar}get ctxMenuActions(){for(let ch=this.firstElementChild;ch;ch=ch.nextElementSibling){const mn=ch.ctxMenuActions
if(mn)return mn}return this.txtRoot.ctxMenuActions}insertDiffInMeta(annot){if(!this.model.addDiffCustom(this,annot))super.insertDiffInMeta(annot)}removeDiffInMeta(annot){if(!this.model.removeDiffCustom(this,annot))super.removeDiffInMeta(annot)}}window.customElements.define("txt-object",TxtObject)
export class TxtEmpty extends TxtObject{}window.customElements.define("txt-empty",TxtEmpty)
export class TxtCol extends TxtElement{constructor(){super()
this.style.display="table-column"}get widthMgr(){return this.model.widthMgr(this.wedMgr)}insertElement(parent,insertBefore,slotName,caller){if(parent instanceof TxtTable)parent=parent.table
if(caller)this.fromChildrenElt=caller
parent.insertBefore(this,insertBefore)}getLogicOffset(){let offs=0
let prev=this
while(prev=DOM.findPreviousSibling(prev,TXTTABLE.IS_TxtCol))offs++
return offs}findOrCreateTxtStr(last){return null}findOrCreateTxtStrOrObject(last){const table=findTxtEltParent(this)
const logicTable=table.tableLayout.logicTable
const txtCell=logicTable.getTxtCellAt(last?logicTable.logicRows.length-1:0,this.getLogicOffset())
return txtCell.findOrCreateTxtStrOrObject(last)}insertDiffMark(annot){this.wedParent.insertDiffForeign(annot)}removeDiffMark(annot){this.wedParent.removeDiffForeign(annot)}insertDiffForeign(annot){this.wedParent.insertDiffForeign(annot)}removeDiffForeign(annot){this.wedParent.removeDiffForeign(annot)}}window.customElements.define("txt-col",TxtCol)
export class TxtRow extends TxtBlock{constructor(){super()
this.style.display="table-row"}insertElement(parent,insertBefore,slotName,caller){if(parent instanceof TxtTable)parent=parent.table
if(caller)this.fromChildrenElt=caller
parent.insertBefore(this,insertBefore)}onChildWedletsChange(){if(!(this.previousElementSibling instanceof TxtRow)&&!DOM.findNext(this,this,IS_TxtStr)){const cellModel=this.model.cellModels[0]
if(cellModel)createChildToDisplay(this,cellModel)}}get countIntrinsicCols(){let res=0
for(let ch=this.firstElementChild;ch;ch=ch.nextElementSibling){if(ch instanceof TxtCell)res+=parseInt(ch.getAttribute("colspan"),10)||1}return res}insertDiffMark(annot){const lastCell=this.lastElementChild
if(lastCell){const mark=document.createElement("wed-diff-mark").initDiffAnnot(this,annot,this.wedlet)
DOM.setStyle(lastCell,"position","relative")
lastCell.appendChild(mark)}}removeDiffMark(annot){this.removeAttribute("annot-diff")
const lastCell=this.lastElementChild
if(lastCell)lastCell.removeDiffMark(annot)}insertDiffForeign(annot){const table=this.wedParent
table.insertDiffForeign(annot)}removeDiffForeign(annot){const table=this.wedParent
table.removeDiffForeign(annot)}}TxtRow.prototype.hasMetaDefs=hasMetaDefs_multi
TxtRow.prototype.getMetaDefs=getMetaDefs_multi
window.customElements.define("txt-row",TxtRow)
export class TxtCell extends HTMLTableCellElement{constructor(){super()
this.style.wordBreak="break-word"}get spanMgr(){const lib=this.model.spanMgrLib?this.wedMgr.wedModel.jsLibs[this.model.spanMgrLib]:null
return lib?lib[this.model.spanMgrKey]||cellSpanMgrDefault:cellSpanMgrDefault}getRowSpan(){const sp=this.getAttribute("rowspan")
return sp?Math.max(1,parseInt(sp,10)):1}getColSpan(){const sp=this.getAttribute("colspan")
return sp?Math.max(1,parseInt(sp,10)):1}isEmpty(){return false}isRemovableByCaret(){return false}isUnwrappable(){return false}insertDiffMark(annot){this.wedParent.wedParent.insertDiffForeign(annot)
this.setAttribute("annot-diff","diffadd")}removeDiffMark(annot){this.wedParent.wedParent.removeDiffForeign(annot)
this.removeAttribute("annot-diff")}}LANG.completeClassProps(TxtParaParent,TxtCell)
LANG.completeClassProps(TxtBlock,TxtCell)
LANG.completeClassProps(TxtElement,TxtCell)
TxtCell.prototype.hasMetaDefs=hasMetaDefs_multi
TxtCell.prototype.getMetaDefs=getMetaDefs_multi
window.customElements.define("txt-cell",TxtCell,{extends:"td"})
export class TxtLI extends TxtParaParent{mustKeepAsVirtual(){if(findTxtEltPreviousSibling(this)instanceof TxtLI)return false
if(findTxtEltNextSibling(this)instanceof TxtLI)return false
return true}isMergeable(next){return next instanceof TxtLI}isUnwrappable(target){var _a
return target!=="div"?"list":(_a=findTxtEltParent(this))===null||_a===void 0?void 0:_a.isUnwrappable(target)}unwrapSeq(target,fromChild,toChild,batch,addSelAfter){var _a
if(target==="div")return((_a=findTxtEltParent(this))===null||_a===void 0?void 0:_a.unwrapSeq(target,this,this,batch,addSelAfter))||false
const prevChild=DOM.findPreviousSibling(fromChild,IS_TxtElementReal)
const nextChild=DOM.findNextSibling(toChild,IS_TxtElementReal)
if(!prevChild&&!nextChild){return findTxtEltParent(this).unwrapSeq(target,this,this,batch,addSelAfter)}return this.unwrapSeqFragment(fromChild,toChild,prevChild,nextChild,batch,addSelAfter)}onChildDeletedByCaret(child){for(let ch=findTxtEltFirstChild(this);ch;ch=findTxtEltNextSibling(ch)){if(ch!==child&&!ch.isVirtual())return null}const parent=findTxtEltParent(this)
return parent?parent.onChildDeletedByCaret(this)||this:this}}TxtLI.prototype.merge=merge_elts
TxtLI.prototype.hasMetaDefs=hasMetaDefs_multi
TxtLI.prototype.getMetaDefs=getMetaDefs_multi
window.customElements.define("txt-li",TxtLI)
export class TxtDiv extends TxtParaParent{isUnwrappable(target){var _a
return target!=="list"?"div":(_a=findTxtEltParent(this))===null||_a===void 0?void 0:_a.isUnwrappable(target)}get isParaSibling(){return true}unwrapSeq(target,fromChild,toChild,batch,addSelAfter){var _a
if(target==="list")return((_a=findTxtEltParent(this))===null||_a===void 0?void 0:_a.unwrapSeq(target,this,this,batch,addSelAfter))||false
const xa=this.wedAnchor
const content=exportFragment(this,fromChild.xaPart,this,Number.MAX_SAFE_INTEGER)
batch.deleteSequence(xa,1)
batch.insertJml(xa,content)
if(addSelAfter)batch.extendSelAfterSeq(xa,JML.lengthJmlOrText(content))
return true}}TxtDiv.prototype.hasMetaDefs=hasMetaDefs_multi
TxtDiv.prototype.getMetaDefs=getMetaDefs_multi
window.customElements.define("txt-div",TxtDiv)
export class TxtMember extends TxtParaLike{mustKeepAsVirtual(){return!(findTxtEltPreviousSibling(this)instanceof TxtMember||findTxtEltNextSibling(this)instanceof TxtMember)}}window.customElements.define("txt-member",TxtMember)
export class TxtTitle extends TxtParaLike{isMergeable(next){return false}addPreviousPara(batch,content){return false}mustKeepAsVirtual(){return!this.classList.contains("forbidden")}onChildEmptied(willBeEmptied){return WEDLET.onChildEmptied(this,willBeEmptied)}}TxtTitle.prototype.merge=merge_none
window.customElements.define("txt-title",TxtTitle)
export class TxtCaption extends TxtTitle{constructor(){super()
this.style.display="table-caption"
this.style.wordBreak="break-word"}insertElement(parent,insertBefore,slotName,caller){if(parent instanceof TxtTable)parent=parent.table
if(caller)this.fromChildrenElt=caller
parent.insertBefore(this,insertBefore)}}window.customElements.define("txt-caption",TxtCaption)
export class InlElement extends TxtElement{get splitPriority(){return Infinity}findOrCreateCaretableSibling(before){const next=before?findTxtEltPreviousSibling(this):findTxtEltNextSibling(this)
if(next instanceof TxtStr)return next
const parent=findTxtEltParent(this)
console.trace("CreateOnTheFly: txtStr")
const strModel=this.model.strModel||this.txtRoot.wedConfig.strModel
const wedlet=strModel.createWedlet(parent)
wedlet.configWedletElt(strModel.config,wedlet)
parent.insertBefore(wedlet,before?this:this.nextSibling)
return wedlet.bindAsVirtual()}insertDiffMark(annot){if(annot.wrap){document.createElement("wed-diff-wrap-mark").initDiffWrapAnnot(this,annot,this.wedlet)}else{document.createElement("wed-diff-mark").initDiffAnnot(this,annot,this.wedlet,null,true).defaultInject()}}}InlElement.prototype.isUnwrappable=isUnwrappable_inline
InlElement.prototype.unwrapSeq=unwrapSeq_inline
InlElement.prototype.findOrCreateTxtStr=findOrCreateTxtStr_inline
export class InlWrap extends InlElement{get strModel(){return this.model.strModel||this.txtRoot.wedConfig.strModel}get isTextContainer(){return true}get splitPriority(){return this.model.splitPriority+(this.hasMetas?1:0)}get txtWedModels(){return this.model.txtWedModels||this.txtRoot.wedConfig.preferedInlineTxtModels}onChildWedletsChange(){adjustVirtualsStr(this)}}export class InlSpan extends InlWrap{}export class InlPhrase extends InlSpan{}window.customElements.define("inl-phrase",InlPhrase)
export class InlStyle extends InlSpan{}window.customElements.define("inl-style",InlStyle)
export class InlLink extends InlSpan{}window.customElements.define("inl-link",InlLink)
export class InlLeaf extends InlWrap{get txtWedModels(){return[this.model.strModel||this.txtRoot.wedConfig.strModel]}}window.customElements.define("inl-leaf",InlLeaf)
export class InlObject extends InlElement{constructor(){super()
this.tabIndex=0
this.addEventListener("pointerdown",onPointerDownObject)}isFocusableByCaret(){return true}isRemovableByCaret(){return true}isEmpty(){return false}findOrCreateTxtStr(last){return null}findOrCreateTxtStrOrObject(last){return this}get focusBar(){for(let ch=this.firstElementChild;ch;ch=ch.nextElementSibling){const fb=ch.focusBar
if(fb)return fb}return this.txtRoot.focusBar}get ctxMenuActions(){for(let ch=this.firstElementChild;ch;ch=ch.nextElementSibling){const mn=ch.ctxMenuActions
if(mn)return mn}return this.txtRoot.ctxMenuActions}}window.customElements.define("inl-object",InlObject)
export class InlEmpty extends InlObject{}window.customElements.define("inl-empty",InlEmpty)
export class InlImg extends InlObject{}window.customElements.define("inl-img",InlImg)
export class InlNote extends InlObject{}window.customElements.define("inl-note",InlNote)
export class TxtStr extends TxtElement{refreshBindValue(val){if(this.isVirtual())this.classList.add("virtual")
else this.classList.remove("virtual")
this._xmlText=JML.jmlNode2value(val)||""
if(this._xmlText)insertXmlText(this,resetXmlText(this),0,this._xmlText)
else resetXmlText(this)
if("forceSpellCheck"in this)this.forceSpellCheck()}insertChars(from,chars,msg){this._xmlText=LANG.stringInsert(this._xmlText,from,chars)
if(!this.txtRoot.webUpdateDone)insertXmlText(this,this,from,chars)}deleteChars(from,len,msg){this._xmlText=LANG.stringDelete(this._xmlText,from,len)
if(!this.txtRoot.webUpdateDone)deleteXmlText(this,this,{start:from,end:from+len})}replaceChars(chars,msg){const oldLen=this.getXmlTextLength()
this._xmlText=chars
if(!this.txtRoot.webUpdateDone){deleteXmlText(this,this,{start:0,end:oldLen})
insertXmlText(this,this,0,chars)}}bindWithAttr(nameAttr,value){}moveCaretFrom(selMgr,backward,alter="move",granularity="character"){let focusNode=selMgr.focusNode
let offset=selMgr.focusOffset
if(backward){for(;;){if(offset>(focusNode.startBoundary?1:0)){selMgr.modify(alter,backward?"backward":"forward",granularity)
return}let found=false
focusNode=DOM.findPrevious(focusNode,this,n=>{if(granularity==="character"&&n.localName==="x-nbsp")found=true
return n.nodeType===ENodeType.text})
if(!focusNode)break
offset=focusNode.nodeValue.length-(focusNode.endBoundary?1:0)
if(found)break}}else{for(;;){if(offset<focusNode.nodeValue.length-(focusNode.endBoundary?1:0)){selMgr.modify(alter,backward?"backward":"forward",granularity)
return}let found=false
focusNode=DOM.findNext(focusNode,this,n=>{if(granularity==="character"&&n.localName==="x-nbsp")found=true
return n.nodeType===ENodeType.text})
if(!focusNode)break
offset=focusNode.startBoundary?1:0
if(found)break}}if(focusNode){if(alter==="extend")selMgr.setSelFocus(focusNode,offset)
else selMgr.collapse(focusNode,offset)}else{this.moveCaretOut(selMgr,backward,alter)}}mustKeepAsVirtual(){return!(findTxtEltPreviousSibling(this)instanceof TxtStr||findTxtEltNextSibling(this)instanceof TxtStr)}setCaretIn(selMgr,fromStart,alter="move"){if(this.isEmpty()){const sibling=fromStart?findTxtEltNextSibling(this):findTxtEltPreviousSibling(this)
if(sibling instanceof TxtStr){sibling.setCaretIn(selMgr,fromStart,alter)
return}}const node=fromStart?DOM.findNext(this,this,IS_TxtStrTextNode):DOM.findPreviousIn(this,IS_TxtStrTextNode)
const offset=fromStart?node.startBoundary?1:0:node.data.length-(node.endBoundary?1:0)
if(alter==="move"){selMgr.collapse(node,offset)}else{selMgr.setSelFocus(node,offset)}}moveCaretOut(selMgr,throwStart,alter="move"){let next=throwStart?findTxtEltPreviousSibling(this):findTxtEltNextSibling(this)
while(next&&next instanceof TxtStr){if(next.isEmpty()){next=throwStart?findTxtEltPreviousSibling(next):findTxtEltNextSibling(next)}else{next.setCaretIn(selMgr,!throwStart,alter)
next.moveCaretFrom(selMgr,throwStart,alter)
return}}if(next){next.setCaretIn(selMgr,!throwStart,alter)}else{const p=findTxtEltParent(this)
if(p)p.moveCaretOut(selMgr,throwStart,alter)
else if(alter==="move"){this.setCaretIn(selMgr,throwStart)}}}fixupCaret(selMgr,oldFocus,oldOffset){const focusNode=selMgr.focusNode
if(IS_TxtStrTextNode(focusNode)){if(selMgr.focusOffset===0&&focusNode.startBoundary){if(focusNode===oldFocus&&oldOffset===1){const prevTxt=DOM.findPrevious(focusNode,this,IS_TxtStrTextNode)
if(prevTxt){selMgr.collapse(prevTxt,prevTxt.data.length-(prevTxt.endBoundary?1:0))
return true}else{const prev=findTxtStrPrevious(this)
if(prev){prev.setCaretIn(selMgr,false)
return true}}}selMgr.collapse(focusNode,1)
return true}else if(selMgr.focusOffset===focusNode.nodeValue.length&&focusNode.endBoundary){if(focusNode===oldFocus&&oldOffset===selMgr.focusOffset-1){const nextTxt=DOM.findNext(focusNode,this,IS_TxtStrTextNode)
if(nextTxt){selMgr.collapse(nextTxt,nextTxt.startBoundary?1:0)
return true}else{const next=findTxtStrNext(this)
if(next){next.setCaretIn(selMgr,true)
return true}}}selMgr.collapse(focusNode,focusNode.nodeValue.length-1)
return true}}else{console.log("fixupCaret:: Caret hors textNode in txt-str!!!")}return false}fixupSelection(selMgr,what,oldFocus,oldOffset){let updated=false
if(what&1){const anchorNode=selMgr.anchorNode
if(IS_TxtStrTextNode(anchorNode)){const anchorOffset=selMgr.anchorOffset
if(anchorOffset===0){selMgr.setSelAnchor(anchorNode,anchorNode.startBoundary?1:0)
updated=true}else if(anchorOffset===anchorNode.length&&anchorNode.endBoundary){selMgr.setSelAnchor(anchorNode,anchorOffset-1)
updated=true}}else{console.log("todo: Selection AnchorNode hors textNode!!!",selMgr.anchorNode)}}if(what&2){const focusNode=selMgr.focusNode
const focusOffset=selMgr.focusOffset
if(IS_TxtStrTextNode(focusNode)){if(focusOffset===0&&focusNode.startBoundary){if(focusNode===oldFocus&&oldOffset>0){const prevTxt=DOM.findPrevious(focusNode,this,IS_TxtStrTextNode)
if(prevTxt){selMgr.setSelFocus(prevTxt,prevTxt.data.length-(prevTxt.endBoundary?1:0))
return true}else{const prev=findTxtStrPrevious(this)
if(prev){prev.setCaretIn(selMgr,false,"extend")
return true}}}selMgr.setSelFocus(focusNode,focusNode.startBoundary?1:0)
return true}else if(focusOffset===focusNode.nodeValue.length&&focusNode.endBoundary){if(focusNode===oldFocus&&oldOffset<focusOffset){const nextTxt=DOM.findNext(focusNode,this,IS_TxtStrTextNode)
if(nextTxt){selMgr.setSelFocus(nextTxt,nextTxt.startBoundary?1:0)
return true}else{const next=findTxtStrNext(this)
if(next){next.setCaretIn(selMgr,true,"extend")
return true}}}selMgr.setSelFocus(focusNode,focusNode.nodeValue.length-(focusNode.endBoundary?1:0))
return true}}else{console.log("todo : Selection FocusNode hors textNode!!!",focusNode)}}return updated}findOrCreateTxtStr(last){return this}findOrCreateTxtStrOrObject(last){return this}getXmlText(){return this._xmlText}getXmlTextLength(){return this._xmlText.length}getXmlOffset(from,webOffset){return getXmlOffset(this,from,webOffset)}getWebOffset(xmlOffset){return getWebOffset(this,xmlOffset)}isXmlStartOffset(from,webOffset){return DOM.findNext(this,this,IS_TxtStrTextNode)===from&&(webOffset<=1||xmlLen(from)===0)}isXmlEndOffset(from,webOffset){return DOM.findPreviousIn(this,IS_TxtStrTextNode)===from&&(webOffset>=from.nodeValue.length-1||xmlLen(from)===0)}transformInsertData(data){return data}getTopInlineParent(from){let topInline=null
let child=this
let parent=findTxtEltParent(child)
if(from==="start"){while(parent instanceof InlWrap){if(findTxtEltFirstChild(parent)===child){topInline=parent
child=parent
parent=findTxtEltParent(parent)}else{return topInline}}}else{while(parent instanceof InlWrap){if(findTxtEltLastChild(parent)===child){topInline=parent
child=parent
parent=findTxtEltParent(parent)}else{return topInline}}}return topInline}isFirstContentInPara(){const para=findTxtParaLikeFrom(this)
return DOM.findPrevious(this,para,n=>{if(n instanceof InlWrap)return false
if(IS_TxtElementReal(n))return true
return false})==null}deleteByCaret(fromInside,backward,batch){if(fromInside||this.isRemovableByCaret()){const sibling=backward?findTxtEltPreviousSibling(this):findTxtEltNextSibling(this)
if(sibling){if(this.shouldBeCleaned())this.remove()
sibling.deleteByCaret(false,backward,batch)}else{const parent=findTxtEltParent(this)
if(this.shouldBeCleaned())this.remove()
if(parent)parent.deleteByCaret(true,backward,batch)}}else{const selMgr=this.txtRoot.selMgr
this.setCaretIn(selMgr,!backward)
selMgr.modify("extend",backward?"backward":"forward","character")
deleteWebRange(this.txtRoot,selMgr.range,batch,backward,true)
selMgr.collapseToStart()}}isEmpty(){return this._xmlText.length===0}isRemovableByCaret(){return this.isEmpty()}shouldBeCleaned(){if(!this.isVirtual())return false
return findTxtEltPreviousSibling(this)instanceof TxtStr||findTxtEltNextSibling(this)instanceof TxtStr}onAddedSkAnnot(annot,xaTarget){var _a
if(annot instanceof SkSearchTextAnnot||((_a=WEDLET.diffLib)===null||_a===void 0?void 0:_a.isDiffAnnot(annot))&&annot.diffSession===this.wedMgr.docHolder.getDiffSession()){planRedrawTxtStrAnnots(this)}else{super.onAddedSkAnnot(annot,xaTarget)}}onRemovedSkAnnot(annot,xaTarget){var _a
if(annot instanceof SkSearchTextAnnot||((_a=WEDLET.diffLib)===null||_a===void 0?void 0:_a.isDiffAnnot(annot))){planRedrawTxtStrAnnots(this)}else{super.onRemovedSkAnnot(annot,xaTarget)}}focusSkAnnot(annot){if(isSkTextAnnot(annot)){const[anc,ancOffs]=this.getWebOffset(annot.offsetStart)
const[foc,focOffs]=this.getWebOffset(annot.offsetStart+annot.len)
const txtRoot=this.txtRoot
WEDLET.ensureContainersUncollapsed(txtRoot)
txtRoot.selMgrAsIs.setSelBounds(anc,ancOffs,foc,focOffs)
txtRoot.selMgrAsIs.ensureSelVisible()
return true}return false}}TxtStr.prototype.isUnwrappable=isUnwrappable_inline
TxtStr.prototype.unwrapSeq=unwrapSeq_inline
TxtStr.prototype.markInserts=undefined
window.customElements.define("txt-str",TxtStr)

//# sourceMappingURL=txtTags.js.map