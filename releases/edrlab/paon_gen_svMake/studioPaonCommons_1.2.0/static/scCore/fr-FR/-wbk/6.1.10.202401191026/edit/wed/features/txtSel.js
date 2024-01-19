import{BaseElement,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{POPUP,PopupActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{WedEditorMiniview}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedEditor.js"
import{TXTTABLE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtTable.js"
import{InlObject,TxtCell,TxtCol,TxtElement,TxtObject,TxtRow,TxtStr,TxtTable}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtTags.js"
import{buildXa,buildXaInVirtual,findTxtEltFirstChild,findTxtEltLastChild,findTxtEltNextSibling,findTxtEltOrRootParent,findTxtEltParent,findTxtEltPreviousSibling,findTxtStrFirstChild,findTxtStrLastChild,findTxtStrNext,findTxtStrParent,findTxtStrPrevious,getTextFirstOffset,getTextLength,IS_TxtBlock,IS_TxtElement,IS_TxtRoot,IS_TxtStr,webRange2XaRange}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtUtils.js"
import{WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{isXmlMsg,XmlBatch,XmlDeleteMsg,XmlInsertMsg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{GFX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/gfx.js"
import{HistoEditPoint}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/histoEditPoints.js"
var IS_text=DOM.IS_text
export function AgTxtSelEditor(cls){const proto=cls.prototype
const initFromDocHolder=proto.initFromDocHolder
proto.initFromDocHolder=function(docHolder,config){const result=initFromDocHolder.call(this,docHolder,config)
this.wedMgr.listeners.on("hookMsgForNextSel",hookMsgForNextSel)
this.wedMgr.listeners.on("selection",selectionChange)
this.wedMgr.listeners.on("getCurrentSel",getCurrentSel,-10)
this.wedMgr.listeners.on("getFocus",getFocus)
this.wedMgr.listeners.on("clipboard",(function(wedMgr,ev,focused){const txtRoot=DOMSH.findFlatParentElt(focused,wedMgr.wedEditor.rootNode,IS_TxtRoot)
if(txtRoot){switch(ev.type){case"copy":txtRoot.onCopy(ev)
break
case"cut":txtRoot.onCut(ev)
break
case"paste":txtRoot.onPaste(ev)
break}}}))
return result}
proto.showTxtStackBar=function(){if(!this.barLayout)return null
if(this.config.hideStackBar)return null
if(!this._txtStackBar){this._txtStackBar=new TxtStackBar}else if(!DOM.setHidden(this._txtStackBar,false))return this._txtStackBar
if(!this.barLayout.showBar(this._txtStackBar))return null
const eltFocus=findTxtEltOrRootParent(DOMSH.findDeepActiveElement(),true)
this._txtStackBar.refreshBar(this.wedMgr,eltFocus?eltFocus.txtRoot:null)
return this._txtStackBar}
proto.hideTxtStackBar=function(){if(this._txtStackBar){if(DOM.setHidden(this._txtStackBar,true)){this._txtStackBar.refreshBar(this.wedMgr)
this.barLayout.onHideBar(this._txtStackBar)}}}
return cls}function hookMsgForNextSel(wedMgr,transac,msg){var _a,_b
if(transac.getMeta("noFocus")===true)return
let done
if(wedMgr.docHolderAsync.isMsgFromUs(transac)){if(msg instanceof XmlBatch&&msg.selAfter){const find={lastAncestorIfNone:true,wedletNotFoundDepth:-1}
const wedlet=WEDLET.findWedlet(wedMgr.rootWedlet,msg.selAfter.addr,find)
if(msg.getMeta(TxtSelMgr.MSGMETA_tblLayout)){if(wedlet instanceof TxtCell){const txtTable=DOM.findParent(wedlet,wedMgr.wedEditor.rootNode,TXTTABLE.IS_TxtTable)
const focusWedlet=msg.selAfter.end?WEDLET.findWedlet(wedMgr.rootWedlet,msg.selAfter.end,find):null
const focusCell=focusWedlet instanceof TxtCell?focusWedlet:wedlet
txtTable.tableLayout.drawTableLayout(focusCell,wedlet)}else if(wedlet instanceof TxtRow){const txtTable=DOM.findParent(wedlet,wedMgr.wedEditor.rootNode,TXTTABLE.IS_TxtTable)
const firstCell=DOM.findFirstChild(wedlet,TXTTABLE.IS_TxtCell)
const focusWedlet=msg.selAfter.end?WEDLET.findWedlet(wedMgr.rootWedlet,msg.selAfter.end,find):null
const focusCell=focusWedlet instanceof TxtRow?DOM.findLastChild(focusWedlet,TXTTABLE.IS_TxtCell):DOM.findLastChild(wedlet,TXTTABLE.IS_TxtCell)
txtTable.tableLayout.drawTableLayout(focusCell,firstCell)}else if(wedlet instanceof TxtCol){const txtTable=DOM.findParent(wedlet,wedMgr.wedEditor.rootNode,TXTTABLE.IS_TxtTable)
const logicTable=txtTable.tableLayout.logicTable
let endWedlet=msg.selAfter.end?WEDLET.findWedlet(wedMgr.rootWedlet,msg.selAfter.end,find):null
if(!(endWedlet instanceof TxtCol))endWedlet=wedlet
txtTable.tableLayout.drawTableLayout(logicTable.getTxtCellAt(0,wedlet.getLogicOffset()),logicTable.getTxtCellAt(logicTable.logicRows.length-1,endWedlet.getLogicOffset()))}else if(wedlet instanceof TxtTable){const logicTable=wedlet.tableLayout.logicTable
wedlet.tableLayout.drawTableLayout(logicTable.getTxtCellAt(0,0),logicTable.getTxtCellAt(logicTable.logicRows.length-1,wedlet.countCols()-1))}(_a=wedMgr.config.histoEditPointsMgr)===null||_a===void 0?void 0:_a.addEditEntry(new HistoEditPoint(wedlet.wedAnchor,wedMgr.docHolder.house),null,wedMgr.config.histoEditHolder)
done=true}else{if(IS_TxtElement(wedlet)){done=true
const txtRoot=wedlet.txtRoot
const subPathFrom=find.wedletNotFoundDepth>0?msg.selAfter.addr.slice(find.wedletNotFoundDepth):null
if(msg.selAfter.end!=null){let wedletEnd
let subPathEnd
find.wedletNotFoundDepth=-1
const end=WEDLET.findWedlet(wedMgr.rootWedlet,msg.selAfter.end,find)
if(IS_TxtElement(end)&&txtRoot===end.txtRoot){wedletEnd=end
subPathEnd=find.wedletNotFoundDepth>0?msg.selAfter.end.slice(find.wedletNotFoundDepth):null}else if(end===txtRoot.wedlet){wedletEnd=txtRoot
subPathEnd=find.wedletNotFoundDepth>0?msg.selAfter.end.slice(find.wedletNotFoundDepth):null}else{wedletEnd=wedlet
subPathEnd=subPathFrom}if(wedMgr.isUndoRedoPending(transac)){txtRoot.selMgrAsIs.setSelection(wedlet,subPathFrom,wedletEnd,subPathEnd)}else{txtRoot.selMgrAsIs.setSelection(wedletEnd,subPathEnd)}}else if(wedlet instanceof InlObject||wedlet instanceof TxtObject){txtRoot.selMgrAsIs.select(wedlet)}else{txtRoot.selMgrAsIs.setSelection(wedlet,subPathFrom)}if(wedMgr.config.histoEditPointsMgr){const xa=wedlet.wedAnchor
let depth=xa.length
for(let p=wedlet;p!==txtRoot;p=p.parentNode)depth--
wedMgr.config.histoEditPointsMgr.addEditEntry(new HistoEditPoint(xa,wedMgr.docHolder.house),depth,wedMgr.config.histoEditHolder)}}}}else if(isXmlMsg(msg)){const find={lastAncestorIfNone:true,wedletNotFoundDepth:-1}
const wedlet=WEDLET.findWedlet(wedMgr.rootWedlet,msg.xa,find)
if(IS_TxtElement(wedlet)){done=true
const txtRoot=wedlet.txtRoot
const selMgr=txtRoot.selMgrAsIs
try{if(txtRoot.webUpdateDone)return
let tailXa
if(find.wedletNotFoundDepth>0){tailXa=msg.xa.slice(find.wedletNotFoundDepth)
if(msg instanceof XmlInsertMsg&&tailXa.length===1){if(wedMgr.isUndoRedoPending(transac)){selMgr.setSelection(wedlet,tailXa,wedlet,XA.incrAtDepth(tailXa.concat(),-1,msg.len))}else{selMgr.setSelection(wedlet,XA.incrAtDepth(tailXa,-1,msg.len))}selMgr.ensureSelVisible()
return}selMgr.setSelection(wedlet,tailXa)
selMgr.ensureSelVisible()}else{if(msg instanceof XmlDeleteMsg){selMgr.setCaretBefore(wedlet)}else if(msg instanceof XmlInsertMsg&&msg.len>1){const end=wedlet.wedParent.findWedletChild(XA.last(msg.xa)+msg.len-1)
if(wedMgr.isUndoRedoPending(transac)){selMgr.setSelection(wedlet,null,end)}else if(selMgr.focusObject instanceof TxtTable){}else if(transac.getMeta("caretAtStart")){selMgr.setCaretAtStart(wedlet)}else{selMgr.setCaretAtEnd(end)}}else{if(wedMgr.isUndoRedoPending(transac)){selMgr.select(wedlet)}else if(selMgr.focusObject instanceof TxtTable){}else if(transac.getMeta("caretAtStart")){selMgr.setCaretAtStart(wedlet)}else{selMgr.setCaretAtEnd(wedlet)}}selMgr.ensureSelVisible()}}finally{(_b=wedMgr.config.histoEditPointsMgr)===null||_b===void 0?void 0:_b.addEditEntry(new HistoEditPoint(buildXa(selMgr.focusNode,selMgr.focusOffset),wedMgr.docHolder.house),txtRoot.wedlet.wedAnchor.length,wedMgr.config.histoEditHolder)}}}}else{}return done}function selectionChange(wedMgr,sel){var _a
let txtRoot
let wedletWithRendering
if(sel){let n=sel.focusNode
if(n&&IS_text(n))n=n.parentElement
while(n){if(IS_TxtRoot(n)){txtRoot=n
break}const name=n.localName
if(name!=="table"&&name!=="mark"){if(!IS_TxtElement(n))break
if(n.model.renderingModel&&!wedletWithRendering)wedletWithRendering=n}n=n.parentElement}if(txtRoot){txtRoot.selMgrAsIs.onSelChange();(_a=wedMgr.wedEditor._txtStackBar)===null||_a===void 0?void 0:_a.refreshBar(wedMgr,txtRoot)}}if(wedletWithRendering){buildRendering(txtRoot,wedletWithRendering)}else{const renderingEd=wedMgr.wedEditor._renderingEd
if(renderingEd)POPUP.findPopupableParent(renderingEd).close()}}function getCurrentSel(wedMgr){const focus=wedMgr.lastFocus
if(!focus)return undefined
const txtElt=findTxtEltOrRootParent(focus,true)
if(!txtElt)return undefined
const sel=txtElt.txtRoot.selMgr.getXaRange(false)
if(!sel)return undefined
sel.startInText=true
sel.endInText=true
return sel}function getFocus(wedMgr,focused){const stackBar=wedMgr.wedEditor._txtStackBar
if(stackBar){if(focused instanceof TxtElement){stackBar.refreshBar(wedMgr,focused.txtRoot)}else{stackBar.refreshBar(wedMgr)}}if(IS_TxtElement(focused)&&focused.model.renderingModel){buildRendering(DOM.findParent(focused,null,IS_TxtRoot),focused)}else{const renderingEd=wedMgr.wedEditor._renderingEd
if(renderingEd)POPUP.findPopupableParent(renderingEd).close()}}function buildRendering(txtRoot,wedletWithRendering){let renderingEd=txtRoot.wedMgr.wedEditor._renderingEd
const wedMgr=txtRoot.wedMgr
const xaRoot=wedletWithRendering.wedAnchor
if(renderingEd){if(XA.isEquals(renderingEd.wedMgr.rootWedlet.wedAnchor,xaRoot))return
POPUP.findPopupableParent(renderingEd).close()}renderingEd=wedMgr.wedEditor._renderingEd=(new WedEditorMiniview).initialize({reg:wedMgr.reg})
renderingEd.setWedModel(wedMgr.wedModel)
renderingEd.onViewHidden=function(){renderingEd.wedMgr.detachDocHolder()
wedMgr.wedEditor._renderingEd=null}
const config=Object.create(wedMgr.config)
config.xaRoot=xaRoot
config.rootModel=wedletWithRendering.model.renderingModel
renderingEd.initFromDocHolder(wedMgr.docHolderAsync.cloneDocHolder(),config).then(()=>{const from=DOM.findParentOrSelf(wedletWithRendering,txtRoot,IS_TxtBlock)
POPUP.showFloating(renderingEd,{fixSize:false,initMaxHeight:"10vh",posFrom:from,targetX:"end",notAvailableSpace:{posFrom:from,fromX:"end",notAvailableSpace:{posFrom:from,fromY:"bottom",notAvailableSpace:{posFrom:from,targetY:"top"}}}},txtRoot,{titleBar:{closeButton:{}},resizer:{}})})}export class TxtSelMgr{constructor(root){this._oldSel=new Range
this._updtFromUs=0
this._root=root
this._shadowRoot=DOMSH.findDocumentOrShadowRoot(root)
this._sel=this._shadowRoot.getSelection()}get type(){const type=this._sel.type
return type==="None"&&this._lastObject!=null&&this._lastObject.isConnected?"Object":type}get focusNode(){return this._sel.focusNode||this._lastObject}get focusObject(){return this._sel.focusNode!==null?null:this._lastObject}get commonAncestor(){if(this._sel.type==="Range")return this.range.commonAncestorContainer
return this.focusNode}get commonTxtElement(){if(this._sel.type!=="Range")return findTxtEltParent(this.focusNode,true)
const rg=this.range
const parentAnc=this.range.commonAncestorContainer
const startTxtStr=findTxtStrParent(rg.startContainer)
let targetReg=null
if(startTxtStr&&parentAnc===startTxtStr.parentElement&&startTxtStr.isXmlEndOffset(rg.startContainer,rg.startOffset)){const next=findTxtEltNextSibling(startTxtStr)
if(next){targetReg=rg.cloneRange()
targetReg.setStart(next,0)}}const endTxtStr=findTxtStrParent(rg.endContainer)
if(endTxtStr&&parentAnc===endTxtStr.parentElement&&endTxtStr.isXmlStartOffset(rg.endContainer,rg.endOffset)){const prev=findTxtEltPreviousSibling(endTxtStr)
if(prev){if(!targetReg)targetReg=rg.cloneRange()
targetReg.setEnd(prev,0)}}return findTxtEltParent(targetReg?targetReg.commonAncestorContainer:parentAnc,true)}get focusOffset(){return this._sel.focusOffset}get anchorNode(){return this._sel.anchorNode}get anchorOffset(){return this._sel.anchorOffset}get range(){return this._sel.getRangeAt(0)}get selAround(){return this._around}getXaRange(inVirtual){switch(this.type){case"Range":if(this._around)return XA.newRangeAround(this._around.wedAnchor)
return webRange2XaRange(this.range)
case"Caret":return{start:inVirtual?buildXaInVirtual(this.focusNode,this.focusOffset):buildXa(this.focusNode,this.focusOffset)}
case"Object":const elt=findTxtEltParent(this._lastObject,true)
return elt?XA.newRangeAround(elt.wedAnchor):null}return null}getXaRangeInBlock(inVirtual){switch(this.type){case"Range":return webRange2XaRange(this.range)
case"Caret":return{start:inVirtual?buildXaInVirtual(this.focusNode,this.focusOffset):buildXa(this.focusNode,this.focusOffset)}
case"Object":const elt=findTxtEltParent(this._lastObject,true)
if(!elt)return null
const xa=XA.freeze(elt.wedAnchor)
return{start:xa,end:XA.incrAtDepth(xa,-1,1)}}return null}iterateNodesInSel(cb){if(this._around){cb(this._around)
return}const range=this.range
const ancestor=range.commonAncestorContainer
let node=range.startContainer
if(node.nodeType===ENodeType.element)node=node.childNodes.item(range.startOffset)||node
cb(node)
if(node===ancestor)return
while(node.parentNode!==ancestor){let sib=node.nextSibling
while(sib){cb(sib)
sib=sib.nextSibling}node=node.parentNode}let endNode=range.endContainer
if(endNode.nodeType===ENodeType.element)endNode=endNode.childNodes.item(range.endOffset)||endNode
let endChain
while(endNode.parentNode!==ancestor){if(!endChain)endChain=[endNode]
else endChain.push(endNode)
endNode=endNode.parentNode}node=node.nextSibling
while(node!==endNode){cb(node)
node=node.nextSibling}if(endChain){for(let i=endChain.length-1;i>=0;i--){const stop=endChain[i]
let sib=stop.parentNode.firstChild
while(sib!==stop){cb(sib)
sib=sib.nextSibling}}}cb(endChain?endChain[0]:endNode)}ensureSelVisible(){const node=this.focusNode
if(node)BASIS.ensureVisible(DOM.findParentOrSelf(node,null,DOM.IS_element),this._root.wedMgr.wedEditor.scrollContainer,"nearest")}restoreSel(){this._root.unfreezeSel()
if(this._lastObject!=null&&!this._sel.focusNode)this._lastObject.focus()
else{this._root.focus()
if(this._oldSel.startContainer){if(this._oldFocusIsStart){this._sel.setBaseAndExtent(this._oldSel.endContainer,this._oldSel.endOffset,this._oldSel.startContainer,this._oldSel.startOffset)}else{this._sel.setBaseAndExtent(this._oldSel.startContainer,this._oldSel.startOffset,this._oldSel.endContainer,this._oldSel.endOffset)}this.fixupSel()}}return this}collapse(parentNode,offset){this._updtFromUs++
this._sel.collapse(parentNode,offset)
this.fixupSel()}collapseToStart(){this._updtFromUs++
if(this._sel.focusNode)this._sel.collapseToStart()
this.fixupSel()}collapseToEnd(){this._updtFromUs++
if(this._sel.focusNode)this._sel.collapseToEnd()
this.fixupSel()}modify(alter,direction,granularity){this._updtFromUs++
this._sel.modify(alter,direction,granularity)}trim(){if(this._sel.type==="Range"){this.fixupSel()
const rg=this.range
const start=rg.startContainer
let startOffset=rg.startOffset
const end=rg.endContainer
let endOffset=rg.endOffset
if(start===end){if(start.nodeType===ENodeType.text){while(startOffset<endOffset&&/\s/.test(start.nodeValue.charAt(startOffset)))startOffset++
while(startOffset<endOffset&&/\s/.test(end.nodeValue.charAt(endOffset-1)))endOffset--}}else{if(start instanceof Text){const len=getTextLength(start)
while(startOffset<len&&/\s/.test(start.nodeValue.charAt(startOffset)))startOffset++}if(end instanceof Text){const startO=getTextFirstOffset(end)
while(endOffset>startO&&/\s/.test(end.nodeValue.charAt(endOffset-1)))endOffset--}}if(startOffset!==rg.startOffset||endOffset!==rg.endOffset){if(start===this._sel.focusNode&&rg.startOffset===this._sel.focusOffset){this._sel.setBaseAndExtent(end,endOffset,start,startOffset)}else{this._sel.setBaseAndExtent(start,startOffset,end,endOffset)}this.memSel(this.range)}}}resetSel(){this._sel.removeAllRanges()}select(elt){this._updtFromUs++
let start=elt.findOrCreateTxtStrOrObject(false)
let end=elt.findOrCreateTxtStrOrObject(true)
if(start===end){if(start instanceof TxtStr){const[startNode,startOffset]=start.getWebOffset(0)
const[endNode,endOffset]=start.getWebOffset(start.getXmlTextLength())
this._sel.setBaseAndExtent(startNode,startOffset,endNode,endOffset)}else{start.focus()}}else{if(!(start instanceof TxtStr))start=findTxtStrPrevious(elt)
if(!(end instanceof TxtStr))end=findTxtStrNext(elt)
const[startNode,startOffset]=start.getWebOffset(0)
const[endNode,endOffset]=end.getWebOffset(end.getXmlTextLength())
this._sel.setBaseAndExtent(startNode,startOffset,endNode,endOffset)}}selectAround(elt){this.select(elt)
this._around=elt}selectAll(){this._updtFromUs++
const start=findTxtStrFirstChild(this._root)
const end=findTxtStrLastChild(this._root)
const[startNode,startOffset]=start.getWebOffset(0)
const[endNode,endOffset]=end.getWebOffset(end.getXmlTextLength())
this._sel.setBaseAndExtent(startNode,startOffset,endNode,endOffset)}setCaretAtEnd(elt){this._updtFromUs++
let end=elt.findOrCreateTxtStrOrObject(true)
if(!(end instanceof TxtStr))end=findTxtStrNext(elt)
const[endNode,endOffset]=end.getWebOffset(end.getXmlTextLength())
this._sel.collapse(endNode,endOffset)}setCaretAtStart(elt){this._updtFromUs++
const first=elt instanceof TxtStr?elt:findTxtStrNext(elt)
if(!first)return
const[endNode,endOffset]=first.getWebOffset(0)
this._sel.collapse(endNode,endOffset)}setCaretBefore(elt){this._updtFromUs++
const str=findTxtStrPrevious(elt)
if(str){const[startNode,startOffset]=str.getWebOffset(str.getXmlTextLength())
this._sel.collapse(startNode,startOffset)}else{this.setCaretAtStart(elt)}}setSelection(from,subPathFrom,to,subPathTo){this._updtFromUs++
if(!to){if(subPathFrom!=null){if(from instanceof TxtStr){const[node,offset]=from.getWebOffset(subPathFrom[0])
this.collapse(node,offset)
return}else{if(IS_TxtElement(from))from.setCaretIn(this,false)
else{const last=findTxtEltLastChild(from)
if(last)last.setCaretIn(this,false)
else from.focus()}return}}if(IS_TxtElement(from))from.setCaretIn(this,true)
else if(from)from.focus()}else{let startNode=from
let startOffset=0
let endNode=to
let endOffset=0
if(subPathFrom!=null){const offs=subPathFrom[0]
if(typeof offs==="number"){if(from instanceof TxtStr){[startNode,startOffset]=from.getWebOffset(offs)}else if(offs>0){const str=DOM.findPreviousIn(from,IS_TxtStr)||findTxtStrPrevious(from);[startNode,startOffset]=str.getWebOffset(str.getXmlTextLength())}}}if(subPathTo!=null){const offs=subPathTo[0]
if(typeof offs==="number"){if(to instanceof TxtStr){[endNode,endOffset]=to.getWebOffset(offs)}else if(offs>0){const str=DOM.findPreviousIn(to,IS_TxtStr)||findTxtStrNext(to);[endNode,endOffset]=str.getWebOffset(str.getXmlTextLength())}}}this._sel.setBaseAndExtent(startNode,startOffset,endNode,endOffset)
this.fixupSel()}}setSelFocus(focusNode,offset){this._updtFromUs++
if(this._sel.anchorNode)this._sel.extend(focusNode,offset)
else this._sel.setBaseAndExtent(focusNode,offset,focusNode,offset)}setSelAnchor(anchorNode,offset){this._updtFromUs++
this._sel.setBaseAndExtent(anchorNode,offset,this._sel.focusNode,this._sel.focusOffset)}setSelCaret(node,anchorOffset){this._updtFromUs++
this._sel.setBaseAndExtent(node,anchorOffset,node,anchorOffset)}setSelBounds(anchorNode,anchorOffset,focusNode,focusOffset){this._updtFromUs++
this._sel.setBaseAndExtent(anchorNode,anchorOffset,focusNode,focusOffset)}fixupSel(){if(this._selFixing)return false
this._selFixing=true
try{const focusNode=this._sel.focusNode
if(!focusNode)return
const around=this._around
const anchorNode=this._sel.anchorNode
let updated=false
const parent=DOMSH.getFlatParentElt(this._root)
const oldFocus=this._oldFocusIsStart?this._oldSel.startContainer:this._oldSel.endContainer
const oldFocusOffs=this._oldFocusIsStart?this._oldSel.startOffset:this._oldSel.endOffset
if(focusNode===anchorNode){if(this._sel.anchorOffset===this._sel.focusOffset){DOMSH.findFlatParentElt(focusNode,parent,n=>{if("fixupCaret"in n){updated=n.fixupCaret(this,oldFocus,oldFocusOffs)
return true}})}else{DOMSH.findFlatParentElt(focusNode,parent,n=>{if("fixupSelection"in n){updated=n.fixupSelection(this,3,oldFocus,oldFocusOffs)||updated
return true}})}}else{DOMSH.findFlatParentElt(focusNode,parent,n=>{if("fixupSelection"in n){updated=n.fixupSelection(this,2,oldFocus,oldFocusOffs)||updated
return true}})
DOMSH.findFlatParentElt(anchorNode,parent,n=>{if("fixupSelection"in n){updated=n.fixupSelection(this,1,oldFocus,oldFocusOffs)||updated
return true}})}this._around=around
return updated}finally{this._selFixing=false}}onSelChange(){if(this._updtFromUs>0){this._updtFromUs--}else{this._around=null}if(this._sel.focusNode){const rg=this._sel.getRangeAt(0)
this.memSel(rg)
this.ensureSelVisible()}}memSel(rg){this._oldSel.setStart(rg.startContainer,rg.startOffset)
this._oldSel.setEnd(rg.endContainer,rg.endOffset)
this._oldFocusIsStart=this._sel.focusNode===rg.startContainer&&this._sel.focusOffset===rg.startOffset}onFocus(ev){if(ev.target===this._root){this._lastObject=null
if(this.type==="None"){this.setCaretAtStart(findTxtEltFirstChild(this._root))
ev.preventDefault()}}else{this._lastObject=ev.target
this._sel.empty()}}onBlur(ev){}}TxtSelMgr.MSGMETA_tblLayout="$tblLayout"
export class TxtSelMgrFrozen{constructor(selMgr){this.selMgr=selMgr
this.type=selMgr.type
this.focusNode=selMgr.focusNode
this.anchorNode=selMgr.anchorNode
this.commonAncestor=selMgr.commonAncestor
this.range=this.type==="Range"?selMgr.range:null
this.tableLayout=selMgr.tableLayout}restoreSel(){return this.selMgr.restoreSel()}}class TxtStackBar extends HTMLElement{constructor(){super()
this.id="txtStackBar"
this.redrawCb=this._redrawCb.bind(this)}connectedCallback(){if(!this.shadowRoot){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
const reg=REG.findReg(this)
reg.installSkin("txt-stackbar",sr)
this.ctn=sr.appendChild(document.createElement("div"))}}refreshBar(wedMgr,txtRoot){if(txtRoot===undefined&&this.lastTxtRoot===undefined)return
if(this.hidden)return
this.lastTxtRoot=txtRoot
if(!this.lastCb)this.lastCb=window.requestIdleCallback(this.redrawCb)}_redrawCb(deadline){this.lastCb=0
if(!this.isConnected)return
let entry=this.ctn.lastElementChild
if(this.lastTxtRoot){let anc=findTxtEltParent(this.lastTxtRoot.selMgrAsIs.commonAncestor,true)
if(anc instanceof TxtStr)anc=findTxtEltParent(anc)
while(anc){if(!entry)entry=this.ctn.insertBefore(new TxtStackEntry,this.ctn.firstChild)
entry.setNode(anc)
anc=findTxtEltParent(anc)
entry=entry.previousElementSibling}}while(entry){entry.setNode(null)
entry=entry.previousElementSibling}}}REG.reg.registerSkin("txt-stackbar",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 1.5em;\n\t\tmin-width: 0;\n\t\tbackground-color: var(--bgcolor);\n\t\tfont-size: var(--label-size);\n\t\tuser-select: none;\n\t}\n\n\ttxt-stackentry {\n\t\tcursor: pointer;\n\t\tcolor: var(--fade-color);\n\t}\n`)
customElements.define("txt-stackbar",TxtStackBar)
class TxtStackEntry extends HTMLElement{constructor(){super()
this.onclick=this.onClick
this.onpointerdown=this.onPointerdown}setNode(elt){if(this.txtElt===elt)return
this.txtElt=elt
if(!elt||!elt.model.nodeLabel||elt instanceof TxtRow||elt instanceof TxtCell){DOM.setHidden(this,true)}else{DOM.setHidden(this,false)
this.textContent=" > "+(elt.model.nodeLabel||elt.model.nodeName)}}onClick(ev){ev.preventDefault()
ev.stopImmediatePropagation()
if(!this.txtElt||!this.txtElt.isConnected)return
this.txtElt.txtRoot.selMgr.selectAround(this.txtElt)}onPointerdown(ev){ev.preventDefault()
ev.stopImmediatePropagation()}}customElements.define("txt-stackentry",TxtStackEntry)
export class TableLayout{constructor(table){this.txtTable=table
this.idleCb=this._idle.bind(this)}drawTableLayout(focusCell,anchorCell){if(this.enabled){this.tblEditNode.ensureFocused()
if(focusCell){this.focusCell=focusCell
this.anchorCell=anchorCell||focusCell
this.refreshCellSel(this.txtTable.getBoundingClientRect())}return}this.enabled=true
if(!this.tblEditNode){this.tblEditNode=document.createElement("txt-tbl-editor")
this.tblEditNode.tabIndex=0
this.tblEditNode.tableLayout=this
this.txtTable.style.position="relative"
this.txtTable.shadowRoot.appendChild(this.tblEditNode)}this.txtTable.table.style.minWidth="max-content"
this.txtTable.style.padding="0 1em"
const txtRoot=this.txtTable.txtRoot
let focus=focusCell||DOM.findParent(txtRoot.selMgr.focusNode,txtRoot,TXTTABLE.IS_TxtCell)
if(focus&&focus.parentNode.parentNode.parentNode!==this.txtTable)focus=null
let anchor=focusCell?anchorCell:txtRoot.selMgr.type==="Range"?DOM.findParent(txtRoot.selMgr.anchorNode,txtRoot,TXTTABLE.IS_TxtCell):null
if(anchor&&anchor.parentNode.parentNode.parentNode!==this.txtTable)anchor=null
if(!focus&&!anchor)focus=DOM.findNext(this.txtTable,this.txtTable,TXTTABLE.IS_TxtCell)
this.focusCell=focus||anchor
this.anchorCell=anchor||focus
this.adjustTableLayout(true)
this.txtTable.txtRoot.selMgrAsIs.tableLayout=this
this.tblEditNode.show()
window.requestIdleCallback(this.idleCb)}onBlur(ev){if(!this.enabled||this.locked)return
if(ev.relatedTarget&&DOMSH.isLogicalFlatAncestor(this.txtTable.focusBar,ev.relatedTarget)){const blur=ev=>{ev.target.removeEventListener("blur",blur)
this.onBlur(ev)}
ev.relatedTarget.addEventListener("blur",blur)
return}this.txtTable.txtRoot.selMgrAsIs.tableLayout=null
this.enabled=false
this.txtTable.table.style.minWidth=null
this.txtTable.style.padding=null
this.tblEditNode.hide()}closeTableLayout(){this.txtTable.txtRoot.selMgr.select(this.getFirstCellSelected())}toggle(){if(this.enabled){this.closeTableLayout()}else{this.drawTableLayout()}}adjustTableLayout(force){if(!this.enabled)return
let col=DOM.findFirstChild(this.txtTable.table,TXTTABLE.IS_TxtCol)
if(!col)return
let row=DOM.findNextSibling(col,TXTTABLE.IS_TxtRow)
if(!row)return
const dir=window.getComputedStyle(this.txtTable).direction||"ltr"
const txtTableRect=this.txtTable.getBoundingClientRect()
const tableRect=this.txtTable.table.getBoundingClientRect()
const tableLeft=tableRect.left-txtTableRect.left
const yRows=[]
while(row){yRows.push(row.offsetTop)
row=DOM.findNextSibling(row,TXTTABLE.IS_TxtRow)}row=DOM.findLastChild(this.txtTable.table,TXTTABLE.IS_TxtRow)
yRows.push(row.offsetTop+row.clientHeight)
const wCols=[]
let wColTotal=0
while(col){const w=col.computedStyleMap().get("width").value
wColTotal+=w
wCols.push(w)
col=DOM.findNextSibling(col,TXTTABLE.IS_TxtCol)}const rowW=this.txtTable.table.clientWidth
let xCol=dir==="ltr"?tableLeft+(tableRect.width-rowW)/2:tableLeft+rowW-(tableRect.width-rowW)/2
const xDelta=(rowW-wColTotal)/wCols.length
const xCols=[Math.round(xCol)]
if(dir==="ltr"){for(const wC of wCols){xCol+=wC+xDelta
xCols.push(Math.round(xCol))}}else{for(const wC of wCols){xCol-=wC+xDelta
xCols.push(Math.round(xCol))}}if(!force&&this.yRows&&arrayEquals(this.yRows,yRows)&&arrayEquals(this.xCols,xCols))return
this.yRows=yRows
this.xCols=xCols
this.tblEditNode.attributeStyleMap.set("width",CSS.px(tableRect.width+(tableRect.left-txtTableRect.left)*2))
let btn
if(WEDLET.isWritableWedlet(this.txtTable)){const xPosLeft=CSS.px(tableLeft)
const xPosRight=CSS.px(tableLeft+tableRect.width)
const xPosStart=dir==="ltr"?xPosLeft:xPosRight
const xPosEnd=dir==="ltr"?xPosRight:xPosLeft
for(const y of yRows){btn=this.getBtn(btn,"insRow","+","Insérer une ligne")
const st=btn.attributeStyleMap
st.set("top",CSS.px(y))
st.set("left",xPosStart)}const yPos=CSS.px(yRows[0])
for(const x of xCols){btn=this.getBtn(btn,"insCol","+","Insérer une colonne")
const st=btn.attributeStyleMap
st.set("left",CSS.px(x))
st.set("top",yPos)}if(yRows.length>2)for(let i=1;i<yRows.length;i++){btn=this.getBtn(btn,"delRow","-","Supprimer cette ligne")
const st=btn.attributeStyleMap
st.set("top",CSS.px((yRows[i-1]+yRows[i])/2))
st.set("left",xPosEnd)}if(xCols.length>2)for(let i=1;i<xCols.length;i++){btn=this.getBtn(btn,"delCol","-","Supprimer cette colonne")
const st=btn.attributeStyleMap
st.set("left",CSS.px((xCols[i-1]+xCols[i])/2))
st.set("top",yPos)}}this.buildCellSelector(btn)
this.refreshCellSel(txtTableRect)}checkSel(){if(!this.anchorCell.isConnected)this.anchorCell=this.focusCell
if(!this.focusCell.isConnected){if(this.focusCell===this.anchorCell){this.focusCell=this.anchorCell=DOM.findNext(this.txtTable.table,this.txtTable.table,TXTTABLE.IS_TxtCell)}else{this.focusCell=this.anchorCell}}}refreshCellSel(txtTableRect){this.checkSel()
const st=this.cellSelector.attributeStyleMap
const c1Rect=this.anchorCell.getBoundingClientRect()
let x1,x2,y1,y2
if(this.anchorCell!==this.focusCell){const c2Rect=this.focusCell.getBoundingClientRect()
x1=Math.min(c1Rect.left,c2Rect.left)
x2=Math.max(c1Rect.right,c2Rect.right)
y1=Math.min(c1Rect.top,c2Rect.top)
y2=Math.max(c1Rect.bottom,c2Rect.bottom)}else{x1=c1Rect.left
x2=c1Rect.right
y1=c1Rect.top
y2=c1Rect.bottom}st.set("top",CSS.px(y1-txtTableRect.top))
st.set("left",CSS.px(x1-txtTableRect.left))
st.set("width",CSS.px(x2-x1))
st.set("height",CSS.px(y2-y1))
const commonBars=this.txtTable.wedMgr.wedEditor.commonBar
if(commonBars)commonBars.planChangeFocusBar(this.txtTable.focusBar)}getFirstCellSelected(){return this.focusCell}moveCellSel(target,extendSel){if(!target)return
if(extendSel){this.focusCell=target}else{this.anchorCell=this.focusCell=target}this.refreshCellSel(this.txtTable.getBoundingClientRect())
target.scrollIntoView({behavior:"smooth",block:"nearest",inline:"nearest"})}get logicTable(){return new TXTTABLE.LogicTable(this.txtTable)}onCopy(ev){this.txtTable.wedMgr.writeNodesToClipboard([this.txtTable.wedAnchor],[{tableRect:this.logicTable.getSelRect()}],ev===null||ev===void 0?void 0:ev.clipboardData)}onCopyXml(){this.txtTable.wedMgr.writeNodesToClipboardAsXml([this.txtTable.wedAnchor],[{tableRect:this.logicTable.getSelRect()}])}onCut(ev){this.cutOrDelete(true,ev.clipboardData)}cutOrDelete(cut,data){let logicTable=this.logicTable
let selRect=logicTable.getSelRect()
const execute=(action,data)=>{const batch=this.txtTable.wedMgr.docHolder.newBatch()
switch(action){case"delRows":batch.setMeta(TxtSelMgr.MSGMETA_tblLayout,true)
if(cut)this.txtTable.wedMgr.writeNodesToClipboard([this.txtTable.wedAnchor],[{tableRect:{startRow:selRect.startRow,startCol:0,endRow:selRect.endRow,endCol:this.txtTable.countCols()}}],data)
logicTable.deleteRows(batch,selRect.startRow,selRect.endRow-selRect.startRow)
batch.doBatch()
break
case"delCols":batch.setMeta(TxtSelMgr.MSGMETA_tblLayout,true)
if(cut)this.txtTable.wedMgr.writeNodesToClipboard([this.txtTable.wedAnchor],[{tableRect:{startRow:0,startCol:selRect.startCol,endRow:logicTable.logicRows.length,endCol:selRect.endCol}}],data)
logicTable.deleteCols(batch,selRect.startCol,selRect.endCol-selRect.startCol)
batch.doBatch()
break
case"delTable":if(cut)this.txtTable.wedMgr.writeNodesToClipboard([this.txtTable.wedAnchor],[],data)
batch.deleteSequence(this.txtTable.wedAnchor,1)
batch.doBatch()}}
const allCols=selRect.startCol===0&&selRect.endCol===this.txtTable.countCols()
if(selRect.startRow===0&&selRect.endRow===logicTable.logicRows.length){execute(allCols?"delTable":"delCols",data)}else if(allCols){execute("delRows",data)}else{const actions=[]
actions.push(new Action("delRows").setLabel("ligne(s)"))
actions.push(new Action("delCols").setLabel("colonne(s)"))
actions.push(new Action("delTable").setLabel("tableau entier"))
this.locked=true
try{const popup=(new PopupActions).initialize({actionContext:this,actions:actions,headTitle:cut?"Couper...":"Supprimer...",restoreFocus:this.tblEditNode})
popup.addEventListener("c-close",ev=>{if(ev.detail.returnValue){logicTable=this.logicTable
selRect=logicTable.getSelRect()
execute(ev.detail.returnValue.getId())}})
popup.show(this.txtTable.table,this.txtTable,this.txtTable)}finally{this.locked=false}}}buildImportContext(){if(!this.focusCell||this.focusCell!==this.anchorCell){POPUP.showNotifInfo("Sélectionnez une seule cellule pour le point de départ du collage.",this.txtTable)
return null}return{sel:{start:XA.append(this.txtTable.wedAnchor,0)},cellInsertPoint:this.focusCell.wedAnchor}}onClickBtn(ev){const tableEd=DOMSH.findHost(this)
const txtTable=tableEd.tableLayout.txtTable
ev.stopImmediatePropagation()
if(this.classList.contains("insCol")){const colModels=txtTable.model.colModels
const batch=txtTable.wedMgr.docHolder.newBatch()
batch.setMeta(TxtSelMgr.MSGMETA_tblLayout,true)
tableEd.tableLayout.logicTable.insertCols(batch,this.logicalOffset,colModels[0])
batch.doBatch()}else if(this.classList.contains("insRow")){const rowModels=txtTable.model.rowModels
const batch=txtTable.wedMgr.docHolder.newBatch()
batch.setMeta(TxtSelMgr.MSGMETA_tblLayout,true)
tableEd.tableLayout.logicTable.insertRows(batch,this.logicalOffset,rowModels[0])
batch.doBatch()}else if(this.classList.contains("delRow")){const batch=txtTable.wedMgr.docHolder.newBatch()
batch.setMeta(TxtSelMgr.MSGMETA_tblLayout,true)
tableEd.tableLayout.logicTable.deleteRows(batch,this.logicalOffset,1)
batch.doBatch()}else if(this.classList.contains("delCol")){const batch=txtTable.wedMgr.docHolder.newBatch()
batch.setMeta(TxtSelMgr.MSGMETA_tblLayout,true)
tableEd.tableLayout.logicTable.deleteCols(batch,this.logicalOffset,1)
batch.doBatch()}}getBtn(prev,cls,label,title){let curr=prev?prev.nextElementSibling:DOM.findFirstChild(this.tblEditNode.shadowRoot,n=>n instanceof HTMLElement&&n.classList.contains(cls))
if(prev&&!prev.classList.contains(cls)){while(curr&&curr.localName==="button"&&!curr.classList.contains(cls)){prev=curr
curr=curr.nextElementSibling
prev.remove()}prev=null}if(curr instanceof HTMLElement&&curr.classList.contains(cls))return curr
const btn=document.createElement("button")
btn.logicalOffset=prev?prev.logicalOffset+1:0
btn.tabIndex=-1
btn.classList.add(cls)
btn.appendChild(document.createElement("span")).textContent=label
btn.title=title
btn.onclick=this.onClickBtn
btn.onpointerdown=ev=>{ev.stopImmediatePropagation()}
this.tblEditNode.shadowRoot.insertBefore(btn,curr)
return btn}buildCellSelector(prev){prev=prev?prev.nextElementSibling:null
while(prev&&prev.localName==="button"){const next=prev.nextElementSibling
prev.remove()
prev=next}if(!this.cellSelector){this.cellSelector=document.createElement("div")
this.cellSelector.classList.add("cellSelect")
this.tblEditNode.shadowRoot.appendChild(this.cellSelector)}return this.cellSelector}_idle(deadline){if(!this.enabled||!this.tblEditNode.isConnected)return
if(deadline.timeRemaining()>20)this.adjustTableLayout()
window.requestIdleCallback(this.idleCb)}}export function onTxtTblEdBlur(ev){this.tableLayout.onBlur(ev)}class TxtTblEditor extends BaseElement{constructor(){super()
this.addEventListener("blur",onTxtTblEdBlur)
this.addEventListener("pointerdown",onTblEdPointerDown)
this.addEventListener("keydown",onTblEdKeyDown)
this._onTblEdPointerCancel=onTblEdPointerCancel.bind(this)}_initialize(init){this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)}show(){this.hidden=false
this.focus()}hide(){this.hidden=true}ensureFocused(){if(DOMSH.findDocumentOrShadowRoot(this).activeElement!==this){this.tableLayout.locked=true
try{this.focus()}finally{this.tableLayout.locked=false}}}focus(){super.focus()
if(!this.tableLayout.enabled)this.tableLayout.drawTableLayout(this.tableLayout.focusCell,this.tableLayout.anchorCell)}get focusBar(){return this.tableLayout.txtTable.focusBar}}window.customElements.define("txt-tbl-editor",TxtTblEditor)
REG.reg.registerSkin("txt-tbl-editor",1,`\n\t:host {\n\t\tposition: absolute;\n\t\ttop: 0;\n\t\tleft: 0;\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\topacity: .8;\n\t\tbox-sizing: border-box;\n\t}\n\n\t:host(:focus) {\n\t\toutline: none;\n\t}\n\n\t:host([hidden]) {\n\t\tdisplay: none;\n\t}\n\n\tbutton {\n\t\t-webkit-appearance: none;\n\t\tposition: absolute;\n\t\tdisplay: block;\n\t\twidth: 1em;\n\t\theight: 1em;\n\t\tborder: none;\n\t\tborder-radius: .5em;\n\t\tpadding: 0;\n\t\tfont-weight: bold;\n\t\tcolor: var(--insbtn-color);\n\t\tbackground-color: var(--insbtn-bg);\n\t}\n\n\tbutton:active {\n\t\tfilter: brightness(1.1);\n\t}\n\n\tbutton:hover {\n\t\tbackground-color: var(--insbtn-hover-bg);\n\t}\n\n\t.insCol,\n\t.delCol {\n\t\tmargin-top: -1.2em;\n\t\tmargin-left: -.5em;\n\t}\n\n\t.insRow {\n\t\tmargin-top: -.5em;\n\t\tmargin-left: -1.2em;\n\t}\n\n\t.delRow {\n\t\tmargin-top: -.5em;\n\t\tmargin-left: -.5em;\n\t}\n\n\t.delCol > span,\n\t.delRow > span {\n\t\tdisplay: block;\n\t\tmargin-top: -.2em;\n\t}\n\n\n\t.cellSelect {\n\t\tposition: absolute;\n\t\toutline: var(--edit-box-focus);\n\t\tbackground-color: var(--edit-select-bgcolor);\n\t}\n`)
function onTblEdPointerDown(ev){ev.stopImmediatePropagation()
ev.preventDefault()
this.ensureFocused()
const rect=this.getBoundingClientRect()
if(ev.x<rect.left+this.tableLayout.xCols[0]||ev.x>rect.left+this.tableLayout.xCols[this.tableLayout.xCols.length-1]){if(ev.button!==2)this.tableLayout.toggle()}else{const cell=cellFromPoint(this.tableLayout.txtTable,ev.x,ev.y)
if(cell){if(!ev.shiftKey)this.tableLayout.anchorCell=cell
this.tableLayout.focusCell=cell
this.tableLayout.refreshCellSel(this.tableLayout.txtTable.getBoundingClientRect())
this.addEventListener("pointermove",onTblEdPointerMove)
document.addEventListener("pointerup",this._onTblEdPointerCancel)
document.addEventListener("pointercancel",this._onTblEdPointerCancel)}}}function cellFromPoint(txtTable,x,y){return document.createTreeWalker(txtTable.table,NodeFilter.SHOW_ELEMENT,{acceptNode(node){if(node instanceof TxtCell){if(GFX.isPointIn(node.getBoundingClientRect(),x,y))return NodeFilter.FILTER_ACCEPT
return NodeFilter.FILTER_REJECT}return NodeFilter.FILTER_SKIP}}).nextNode()}function onTblEdKeyDown(ev){switch(ev.key){case"ArrowLeft":this.tableLayout.moveCellSel(DOM.findPreviousSibling(this.tableLayout.focusCell,TXTTABLE.IS_TxtCell),ev.shiftKey)
break
case"ArrowRight":this.tableLayout.moveCellSel(DOM.findNextSibling(this.tableLayout.focusCell,TXTTABLE.IS_TxtCell),ev.shiftKey)
break
case"ArrowUp":{const logicTable=this.tableLayout.logicTable
const{offsRow:offsRow,offsCol:offsCol}=logicTable.getLogicOffsets(this.tableLayout.focusCell)
this.tableLayout.moveCellSel(logicTable.getTxtCellAt(offsRow-1,offsCol),ev.shiftKey)
break}case"ArrowDown":{const logicTable=this.tableLayout.logicTable
const{offsRow:offsRow,offsCol:offsCol}=logicTable.getLogicOffsets(this.tableLayout.focusCell)
this.tableLayout.moveCellSel(logicTable.getTxtCellAt(offsRow+1,offsCol),ev.shiftKey)
break}case"Insert":case"Escape":this.tableLayout.toggle()
break
case"Delete":case"Backspace":this.tableLayout.cutOrDelete(false)
break
default:return}ev.stopImmediatePropagation()
ev.preventDefault()}function onTblEdPointerMove(ev){const cell=cellFromPoint(this.tableLayout.txtTable,ev.x,ev.y)
if(cell&&this.tableLayout.focusCell!==cell){this.tableLayout.focusCell=cell
this.tableLayout.refreshCellSel(this.tableLayout.txtTable.getBoundingClientRect())
cell.scrollIntoView({behavior:"smooth",block:"nearest",inline:"nearest"})}}export function onTxtTableFlexPointerDown(ev){DOMSH.findHost(this).tableLayout.drawTableLayout()
ev.stopImmediatePropagation()
ev.preventDefault()}function onTblEdPointerCancel(ev){document.removeEventListener("pointerup",onTblEdPointerCancel)
document.removeEventListener("pointercancel",onTblEdPointerCancel)
this.removeEventListener("pointermove",onTblEdPointerMove)}function arrayEquals(a1,a2){if(a1.length!=a2.length)return false
for(let i=0;i<a1.length;i++)if(a1[i]!==a2[i])return false
return true}
//# sourceMappingURL=txtSel.js.map