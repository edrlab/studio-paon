import{isWedChildrenElt,isWedSlotElt,WED}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedCore.js"
import{isWedEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedEditor.js"
import{isWedletSingleElt,OffView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedletSingleElt.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{JML,JmlSubSetIterator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{XmlDeleteMsg,XmlInsertMsg,XmlStrMsg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{EAnnotLevel,EFuzzyType,isSkAnnotFocuser,isSkStructDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaAnnots.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
export function isParentWedlet(w){return w&&"findWedletChild"in w}export function isCharsWedletBind(w){if(!w||!("bindWithAttr"in w))return false
const type=w.model.nodeType
return type===ENodeType.text||type===ENodeType.attribute||type===ENodeType.comment}export function isDisplayedWedlet(w){return w&&w.displayCtx!=null}export function isForksWedlet(w){return w&&"visitWedletForks"in w}export function isTargetableWedlet(wedlet){return wedlet&&"highlightFromLink"in wedlet}export function isEditableWedlet(wedlet){return wedlet&&"editMode"in wedlet}export var EWedletEditMode;(function(EWedletEditMode){EWedletEditMode[EWedletEditMode["na"]=0]="na"
EWedletEditMode[EWedletEditMode["write"]=1]="write"
EWedletEditMode[EWedletEditMode["read"]=2]="read"
EWedletEditMode[EWedletEditMode["readStatic"]=6]="readStatic"
EWedletEditMode[EWedletEditMode["hidden"]=8]="hidden"})(EWedletEditMode||(EWedletEditMode={}))
export const EWedletEditModeLabel=[null,null,"r",null,null,null,"rs",null,"h"]
export function isSkAnnotListener(lstn){return lstn&&"onAddedSkAnnot"in lstn}export const IS_EltWedlet=function(elt){return elt&&"configWedletElt"in elt}
export function findElementWedlet(from,excludeThis){let result=excludeThis?from.parentNode:from
while(result&&!IS_EltWedlet(result)){result=result.parentNode||result.host}return result}export const IS_EltSkAnnot=function(elt){return elt&&"skAnnot"in elt}
export function findWedEditor(elt){return DOMSH.findLogicalFlatParentOrSelf(elt,null,isWedEditor)}export function isFindAreaWedlet(w){return w&&"findInArea"in w}export class WedletActionCtx{constructor(elt){this.focusedElt=elt}get reg(){return this.wedMgr.reg}get wedMgr(){return this.wedlet.wedMgr}get wedlet(){return findElementWedlet(this.focusedElt).wedlet}}export class WedAnnotErr extends HTMLElement{initAnnot(holder,skAnnot,wedlet,isSubAnnot){this.skAnnots=[]
this.holder=holder
holder.style.position="relative"
holder.wedAnnotErr=this
wedlet.wedMgr.reg.installSkin(this.localName,this.attachShadow(DOMSH.SHADOWDOM_INIT));(holder.shadowRoot||holder).appendChild(this)
this.addAnnot(skAnnot,isSubAnnot)
return this}addAnnot(skAnnot,isSubAnnot){if(isSubAnnot){if(!this.subAnnotsCheck){this.subAnnotsCheck=this.asyncSkAnnots.bind(this)
findWedEditor(this).wedMgr.listeners.on("asyncSkAnnots",this.subAnnotsCheck)}}if(skAnnot.result!==null)this.skAnnots.push(skAnnot)
if(skAnnot.future)skAnnot.future.then(an=>{if(an===null)this.removeAnnot(skAnnot)
else this.refresh()})
this.refresh()}asyncSkAnnots(wedMgr,annots,deadline){var _a
if(deadline.timeRemaining()<5)return this.subAnnotsCheck
let found=false
for(let a of this.skAnnots){const anchor=a.anchorNode
if(anchor instanceof Attr?!((_a=anchor.ownerElement)===null||_a===void 0?void 0:_a.isConnected):!anchor.isConnected)this.removeAnnot(a)
else found=true}if(!found){wedMgr.listeners.removeListener("asyncSkAnnots",this.subAnnotsCheck)
this.subAnnotsCheck=null}}removeAnnot(skAnnot){const idx=this.skAnnots.indexOf(skAnnot)
if(idx<0)return false
this.skAnnots.splice(idx,1)
this.refresh()
return true}removeAll(){this.holder.removeAttribute("annot")
this.holder.wedAnnotErr=null
this.holder=null
this.remove()}refresh(){const l=this.skAnnots.length
if(l===0){this.holder.removeAttribute("annot")
this.holder.wedAnnotErr=null
this.remove()}else if(l===1){this.title=this.skAnnots[0].getLabel()
this.holder.setAttribute("annot",this.className=this.skAnnots[0].level.name)}else{this.title=l>5?`${l} erreurs`:this.skAnnots.map(an=>an.getLabel()).join("\n")
this.holder.setAttribute("annot",this.className=this.skAnnots.reduce((prev,c)=>prev.max(c.level),EAnnotLevel.info).name)}}}REG.reg.registerSkin("wed-annot-err",1,`\n\t:host {\n\t\tmin-width: .8rem;\n\t\tmin-height: .8rem;\n\t\tposition: absolute;\n\t\tleft: -.3rem;\n\t\ttop: -.1rem;\n\t\tcursor: default;\n\t}\n\n\t:host(.error) {\n\t\tbackground: center / contain no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/error.svg);\n\t}\n\n\t:host(.warning) {\n\t\tbackground: center / contain no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/warning.svg);\n\t}\n`)
window.customElements.define("wed-annot-err",WedAnnotErr)
export class WedAnnotSearch extends HTMLElement{initSearchAnnot(holder,wedlet){this.holder=holder
DOM.setStyle(holder,"position","relative")
holder.wedAnnotSearch=this;(holder.shadowRoot||holder).appendChild(this)
wedlet.wedMgr.reg.installSkin(this.localName,this.attachShadow(DOMSH.SHADOWDOM_INIT))
this.holder.setAttribute("annot-search","")
return this}addAnnot(skAnnot){if(this.skAnnots)this.skAnnots.push(skAnnot)
else{this.skAnnots=[skAnnot]
this.title=skAnnot.getLabel()}}removeAnnot(skAnnot){this.removeAll()
return true}removeAll(){this.holder.wedAnnotSearch=null
this.holder.removeAttribute("annot-search")
this.remove()
this.holder=null}}REG.reg.registerSkin("wed-annot-search",1,`\n\t:host {\n\t\tposition: absolute;\n\t\tmin-width: 100%;\n\t\tmin-height: 100%;\n\t\tright: 0;\n\t\ttop: 0;\n\t\tcursor: default;\n\t\tbackground-color: var(--edit-search-bgcolor);\n\t\topacity: .3;\n\t\tborder: 1px solid var(--edit-search-bgcolor);\n\t\tborder-radius: .2rem;\n\t\tpointer-events: none;\n\t}\n`)
window.customElements.define("wed-annot-search",WedAnnotSearch)
export class WedletFork{constructor(mainWedlet){this.mainWedlet=mainWedlet
WEDLET.addFork(mainWedlet,this)}get model(){return this.mainWedlet.model}get wedAnchor(){return this.mainWedlet.wedAnchor}get wedMgr(){return this.mainWedlet.wedMgr}get wedParent(){return this.mainWedlet.wedParent}get xaPart(){return this.mainWedlet.xaPart}isVirtual(){return this.mainWedlet.isVirtual()}isEmpty(){return this.mainWedlet.isEmpty()}}export var WEDLET;(function(WEDLET){function addFork(mainWedlet,forkWedlet){const w=mainWedlet
const subVisit=w.visitWedletForks
if(subVisit){w.visitWedletForks=function(visitor,options){if(visitor(forkWedlet)==="stop")return"stop"
return subVisit.call(this,visitor,options)}}else{w.visitWedletForks=function(visitor){if(visitor(forkWedlet)==="stop")return"stop"}}return w}WEDLET.addFork=addFork
function refreshEditMode(root){if(isEditableWedlet(root))root.refreshEditMode()
if(isParentWedlet(root))root.visitWedletChildren(-1,Infinity,refreshEditMode,WEDLET.VISITOPTIONS_includeVirtuals)}WEDLET.refreshEditMode=refreshEditMode
function resolveEditMode(target){const wedMgr=target.wedMgr
const reg=wedMgr.reg
let permMode=getEditModePerms(target.model.perms,reg)
let ancMode=EWedletEditMode.na
let checkAnc=true
let p=target.wedParent
while(p){if(permMode===EWedletEditMode.na)permMode=getEditModeCascadPerms(p.model.perms,reg)
if(checkAnc&&"getEditModeForDesc"in p){const mode=p.getEditModeForDesc(target)
if(mode!==undefined){if(mode.must){ancMode=mode.editMode
if(permMode!==EWedletEditMode.na)break
checkAnc=false}else{if(ancMode<mode.editMode)ancMode=mode.editMode}}}p=p.wedParent}return Math.max(wedMgr.readOnly?EWedletEditMode.read:EWedletEditMode.write,ancMode,permMode)}WEDLET.resolveEditMode=resolveEditMode
function getEditModePerms(perms,reg){if(perms){if("cascadRead"in perms&&!reg.hasPerm(perms.cascadRead))return EWedletEditMode.hidden
if("localWrite"in perms){const v=perms.localWrite
if(v===true)return EWedletEditMode.write
if(v===false)return EWedletEditMode.read
return reg.hasPerm(v)?EWedletEditMode.write:EWedletEditMode.read}}return EWedletEditMode.na}function getEditModeCascadPerms(perms,reg){if(perms){if("cascadRead"in perms&&!reg.hasPerm(perms.cascadRead))return EWedletEditMode.hidden
if("cascadWrite"in perms){const v=perms.cascadWrite
if(v===true)return EWedletEditMode.write
if(v===false)return EWedletEditMode.read
return reg.hasPerm(v)?EWedletEditMode.write:EWedletEditMode.read}}return EWedletEditMode.na}WEDLET.READ=Object.freeze({editMode:EWedletEditMode.read,must:false})
WEDLET.READ_MUST=Object.freeze({editMode:EWedletEditMode.read,must:true})
WEDLET.READSTATIC_MUST=Object.freeze({editMode:EWedletEditMode.readStatic,must:true})
WEDLET.HIDDEN_MUST=Object.freeze({editMode:EWedletEditMode.hidden,must:true})
function isWritableWedlet(wedlet){let w=wedlet
while(w){if("editMode"in w)return w.editMode===EWedletEditMode.write
w=w.wedParent}return!wedlet.wedMgr.readOnly}WEDLET.isWritableWedlet=isWritableWedlet
WEDLET.FINDOPTIONS_lastAncestorIfNone=Object.freeze({lastAncestorIfNone:true})
function findWedlet(root,xa,options){const rootXa=root.wedAnchor
if(XA.isAncOrEquals(rootXa,xa)){let res=root
for(let i=rootXa.length;res&&i<xa.length;i++){if(isParentWedlet(res)){const next=res.findWedletChild(xa[i],options)
if(!next){if(options&&options.lastAncestorIfNone){if(options.wedletNotFoundDepth===-1)options.wedletNotFoundDepth=i
return res}return null}res=Array.isArray(next)?next[0]:next}else{if(options&&options.lastAncestorIfNone){if(options.wedletNotFoundDepth===-1)options.wedletNotFoundDepth=i
return res}return null}}return res}return null}WEDLET.findWedlet=findWedlet
function getFirstWedlet(wedlets){for(const w of wedlets){if(Array.isArray(w))return w[0]
if(w)return w}}WEDLET.getFirstWedlet=getFirstWedlet
function findWedlets(root,xa,options,result=[]){const rootXa=root.wedAnchor
const addWedlet=options&&options.mainBranch?function(arr,wedlet){arr.push(wedlet)}:function(arr,wedlet){arr.push(wedlet)
if(isForksWedlet(wedlet))wedlet.visitWedletForks(arr.push.bind(arr))}
if(XA.isAnc(rootXa,xa)){let parentList=[]
addWedlet(parentList,root)
for(let i=rootXa.length,s=xa.length-1;i<s;i++){const childList=[]
for(let k=0;k<parentList.length;k++){const w=parentList[k]
if(isParentWedlet(w)){const ch=w.findWedletChild(xa[i],options)
if(!ch){if(options&&options.lastAncestorIfNone)result.push(w)}else if(Array.isArray(ch)){for(const w of ch)addWedlet(childList,w)}else{addWedlet(childList,ch)}}else if(options&&options.lastAncestorIfNone)result.push(w)}parentList=childList}for(let k=0;k<parentList.length;k++){const p=parentList[k]
if(isParentWedlet(p)){const ch=p.findWedletChild(XA.last(xa),options)
if(!ch){if(options&&options.lastAncestorIfNone)result.push(p)}else if(Array.isArray(ch)){for(const w of ch)addWedlet(result,w)}else{addWedlet(result,ch)}}else if(options&&options.lastAncestorIfNone)result.push(p)}}else if(XA.isEquals(rootXa,xa))addWedlet(result,root)
return result}WEDLET.findWedlets=findWedlets
WEDLET.VISITOPTIONS_mainBranch=Object.freeze({mainBranch:true})
WEDLET.VISITOPTIONS_includeVirtuals=Object.freeze({includeVirtuals:true})
function visitSequence(root,from,len,visitor,options){if(options&&options.forceFetch)throw Error("options.forceFetch not implemented")
WEDLET.findWedlets(root,XA.subXa(from,-1),options).forEach(container=>{if(isParentWedlet(container)){if(container.visitWedletChildren(XA.offset(from,-1),len,visitor,options)==="stop")return"stop"}if((!options||!options.mainBranch)&&isForksWedlet(container)){container.visitWedletForks(w=>{if(isParentWedlet(w)){if(w.visitWedletChildren(XA.offset(from,-1),len,visitor,options)==="stop")return"stop"}})}})}WEDLET.visitSequence=visitSequence
function visitRange(root,xaRange,visitor,options){const seqs=XA.range2Seqs(xaRange)
for(let i=0;i<seqs.length;i++){const s=seqs[i]
if(WEDLET.visitSequence(root,s.start,s.len,visitor,options)==="stop")return"stop"}}WEDLET.visitRange=visitRange
function countChildren(wedlet){let countChildren=0
wedlet.visitWedletChildren(0,Infinity,wedlet=>{countChildren++},WEDLET.VISITOPTIONS_mainBranch)
return countChildren}WEDLET.countChildren=countChildren
function applyUpdate(root,msg){if(!root)return
const xaCtn=XA.up(msg.xa)
const wedlets=WEDLET.findWedlets(root,xaCtn,WEDLET.FINDOPTIONS_lastAncestorIfNone)
const s=wedlets.length
if(s>0){for(let i=0;i<s;i++){const ctn=wedlets[i]
if(!WEDLET.isWedletBindXa(ctn,xaCtn)||!isParentWedlet(ctn)){if("updateInDescendants"in ctn)ctn.updateInDescendants(msg)}else if(msg instanceof XmlInsertMsg){let from=XA.last(msg.xa)
if(typeof msg.jml==="string"){if(isCharsWedletBind(ctn)){ctn.insertChars(from,msg.jml,msg)}else{ctn.insertChildNode(from++,msg.jml,null)
ctn.onChildNodesInserted()}}else{const it=new JmlSubSetIterator(msg.jml)
while(it.next()){ctn.insertChildNode(from++,it.currentNode,it.currentChildren)}ctn.onChildNodesInserted()}}else if(msg instanceof XmlDeleteMsg){const from=XA.last(msg.xa)
if(isCharsWedletBind(ctn)){ctn.deleteChars(from,msg.len,msg)}else{ctn.deleteChildNodes(from,msg.len)}}else if(msg instanceof XmlStrMsg){const last=XA.last(msg.xa)
const val=msg.val
if(val==null){if(typeof last==="string")ctn.deleteAttrNode(last)
else Error("Can not delete node with XmlStrMsg")}else{function applyOnAtt(wedletAtt){if(Array.isArray(wedletAtt))wedletAtt.forEach(applyOnAtt)
else{if(wedletAtt){wedletAtt.replaceChars(val,msg)}else{if(typeof last==="string")ctn.insertAttrNode(last,val)
else Error("Can not insert node with XmlStrMsg")}}}applyOnAtt(ctn.findWedletChild(last))}}}}else{if(msg instanceof XmlDeleteMsg&&XA.isAncOrEquals(msg.xa,root.wedAnchor)){root.wedMgr.wedEditor.dispatchEvent(new CustomEvent("wed-editor-root-deleted"))
root.wedMgr.detachDocHolder()}}}WEDLET.applyUpdate=applyUpdate
function isWedletBindXa(wedlet,xa){for(let i=xa.length-1;i>=0;i--){if(wedlet.xaPart!==xa[i])return false
const parent=wedlet.wedParent
if(!parent){const rootXa=wedlet.wedAnchor
if(rootXa.length-1!==i--)return false
for(;i>=0;i--)if(rootXa[i]!==xa[i])return false
return true}wedlet=parent}return true}WEDLET.isWedletBindXa=isWedletBindXa
function getWedletDepth(wedlet){let depth=0
while(wedlet){if(wedlet.wedParent==null)depth+=wedlet.wedAnchor.length
else depth+=1
wedlet=wedlet.wedParent}return depth}WEDLET.getWedletDepth=getWedletDepth
function installSkins(tpl,target,wedlet,defaultSkin){const skin=tpl.getAttribute("skin")||defaultSkin
const skinsOver=tpl.getAttribute("skinOver")
if(skin||skinsOver){const reg=wedlet.wedMgr.reg
if(skin)reg.installSkin(skin,target)
if(skinsOver)skinsOver.split(" ").forEach(skinOver=>reg.installSkin(skinOver,target))}}WEDLET.installSkins=installSkins
function cloneWedletContent(targetRoot,tpl,wedlet,asShadow){if(!tpl.hasChildNodes())return null
let subEltWedlets
let from=tpl.firstChild
let target
if(asShadow){if(targetRoot.shadowRoot){target=targetRoot.shadowRoot}else if(!from.nextSibling&&!tpl.hasAttribute("skin")&&(isWedChildrenElt(from)||isWedSlotElt(from))){target=targetRoot}else{target=targetRoot.attachShadow(DOMSH.SHADOWDOM_INIT)
installSkins(tpl,target,wedlet)}}else{target=targetRoot}while(from){if(from.nodeType===Node.TEXT_NODE){target.appendChild(document.importNode(from,false))}else if(isWedChildrenElt(from)){const host=wedlet.elementHost
if(target!==host&&!isWedSlotElt(from.parentNode))createSlot(from,target)}else if(isWedSlotElt(from)){if(from.firstChild){if(target!==wedlet.elementHost)createSlot(from,target)
from=from.firstChild
continue}}else{const newCh=target.appendChild(document.importNode(from,false))
if(IS_EltWedlet(newCh)){newCh.configWedletElt(from,wedlet)
if(!subEltWedlets)subEltWedlets=[]
subEltWedlets.push(newCh)}else{if(from.firstChild){target=newCh
from=from.firstChild
continue}}}while(!from.nextSibling){from=from.parentNode
if(from===tpl)return subEltWedlets
if(!isWedSlotElt(from))target=target.parentNode}from=from.nextSibling}return subEltWedlets}WEDLET.cloneWedletContent=cloneWedletContent
function cloneSimpleContent(targetRoot,tpl){for(let ch=tpl.firstChild;ch;ch=ch.nextSibling)targetRoot.appendChild(document.importNode(ch,true))}WEDLET.cloneSimpleContent=cloneSimpleContent
function findChildrenEltForNodeStrict(childrenElts,jmlNode){if(!childrenElts)return null
for(let i=0;i<childrenElts.length;i++){const child=childrenElts[i]
if(child.wedMatcher.matchNode(jmlNode))return child}return null}WEDLET.findChildrenEltForNodeStrict=findChildrenEltForNodeStrict
function findChildrenEltForNode(childrenElts,jmlNode,parentWedlet,xaOffset){if(!childrenElts)return null
if(jmlNode!=null)for(let i=0;i<childrenElts.length;i++){const child=childrenElts[i]
if(child.wedMatcher.matchNode(jmlNode))return child}let chEltNotStrict
for(let i=0;i<childrenElts.length;i++){if(!childrenElts[i].wedMatchStrict){chEltNotStrict=childrenElts[i]
break}}if(!chEltNotStrict)return null
let ch=parentWedlet.findWedletChild(xaOffset)
if(Array.isArray(ch))ch=ch[0]
if(isWedletSingleElt(ch)&&ch.element.fromChildrenElt&&!ch.element.fromChildrenElt.wedMatchStrict)return ch.element.fromChildrenElt
if(xaOffset>0){ch=parentWedlet.findWedletChild(xaOffset-1)
if(Array.isArray(ch))ch=ch[0]
if(isWedletSingleElt(ch)&&ch.element.fromChildrenElt&&!ch.element.fromChildrenElt.wedMatchStrict)return ch.element.fromChildrenElt}return chEltNotStrict}WEDLET.findChildrenEltForNode=findChildrenEltForNode
function findChildrenEltForAttr(childrenElts,atrrName){if(!childrenElts)return null
for(let i=0;i<childrenElts.length;i++){const child=childrenElts[i]
if(child.wedMatcher.matchAttr(atrrName))return child}return null}WEDLET.findChildrenEltForAttr=findChildrenEltForAttr
function findChildrenEltForComment(childrenElts){if(!childrenElts)return null
for(let i=0;i<childrenElts.length;i++){const child=childrenElts[i]
if(child.wedMatcher.matchNode(commentTpl))return child}return childrenElts[0]}WEDLET.findChildrenEltForComment=findChildrenEltForComment
const commentTpl={"":JML.COMMENT}
function createSlot(childrenElt,parentSlot){const slot=document.createElement("slot")
slot.setAttribute("name",childrenElt.wedSlotName)
return parentSlot.appendChild(slot)}WEDLET.createSlot=createSlot
function appendAttWedlets(wedlet,node,insAtt,promises){if(!JML.isElt(node))return
for(const name in node){if(name){const promise=insAtt.call(wedlet,name,node[name])
if(promise){if(!promises)promises=[promise]
else promises.push(promise)}}}return promises}WEDLET.appendAttWedlets=appendAttWedlets
function insertDatasFromDisplay(wedlet,batch,newChildren,newName){const b=batch||wedlet.wedMgr.docHolder.newBatch()
let parent=wedlet.wedParent
let datas
if(wedlet.model.nodeType===ENodeType.attribute){const attName=newName||wedlet.wedNodeName||wedlet.model.nodeName
if(!parent||!parent.isVirtual()){const xa=XA.append(wedlet.wedParent.wedAnchor,attName)
b.setAttr(xa,newChildren||"")
if(!batch)b.doBatch()
return wedlet}wedlet=parent
parent=wedlet.wedParent
const eltNode=wedlet.newJml()
eltNode[attName]=newChildren||""
datas=[eltNode]}else if(wedlet.model.nodeType===ENodeType.text){datas=[newChildren||""]}else if(wedlet.model.nodeType===ENodeType.element){datas=[newName?{"":newName}:wedlet.newJml()]
if(newChildren)datas.push(Array.isArray(newChildren)?newChildren:[newChildren])
buildJmlWithSiblings(newName?{"":newName}:wedlet.newJml(),newChildren?Array.isArray(newChildren)?newChildren:[newChildren]:null,wedlet)}else{throw Error("wedlet.model.nodeType unknown : "+wedlet.model.nodeType)}while(parent&&parent.isVirtual()){wedlet=parent
datas=buildJmlWithSiblings(wedlet.newJml(),datas,wedlet)
parent=wedlet.wedParent}b.insertJml(wedlet.wedAnchor,datas)
if(!batch)b.doBatch()
function buildJmlWithSiblings(obj,children,w){const result=[]
if(isWedletSingleElt(w)){const model=w.model
let elt=DOM.findPreviousSibling(w.element,IS_EltWedlet)
while(elt&&elt.wedlet.isVirtual()&&elt.wedlet.model===model){result.push(elt.wedlet.newJml())
elt=DOM.findPreviousSibling(elt,IS_EltWedlet)}}result.push(obj)
if(children)result.push(children)
return result}return wedlet}WEDLET.insertDatasFromDisplay=insertDatasFromDisplay
function checkVirtualOffset(virtualChild,offset){let prev=virtualChild.previousElementSibling
let min=0
let max=0
while(prev){if(IS_EltWedlet(prev)&&!prev.wedlet.isVirtual()){const xaPart=prev.wedlet.xaPart
if(typeof xaPart==="number"){if(prev.wedlet instanceof OffView){max=Math.max(max,xaPart+1)}else{min=xaPart+1
max=Math.max(max,min)}}}prev=prev.previousElementSibling}return offset>=min&&offset<=max}WEDLET.checkVirtualOffset=checkVirtualOffset
function buildVirtualPath(wedlet){if(!wedlet.isVirtual())return null
const path=[]
do{switch(wedlet.model.nodeType){case ENodeType.element:path.push(wedlet.newJml())
break
case ENodeType.text:path.push("#")
break
case ENodeType.attribute:path.push("@")
break
case ENodeType.comment:path.push({"":JML.COMMENT})
break}wedlet=wedlet.wedParent}while(wedlet.isVirtual())
return path.reverse()}WEDLET.buildVirtualPath=buildVirtualPath
function findVirtualWedletsAfter(elt,result){const rootElt=elt.wedlet.element||elt
for(let next=DOM.findNextSibling(rootElt,IS_EltWedlet);next;next=DOM.findNextSibling(next,IS_EltWedlet)){if(next.wedlet.isVirtual()||next.hidden){if(!result)result=[next.wedlet]
else result.push(next.wedlet)}else if(next.wedlet.model.nodeType!==ENodeType.comment){break}}return result}WEDLET.findVirtualWedletsAfter=findVirtualWedletsAfter
function findVirtualWedletsBefore(elt,addElt){let result
if(addElt&&elt.wedlet.isVirtual())result=[elt.wedlet]
const rootElt=elt.wedlet.element||elt
for(let next=DOM.findPreviousSibling(rootElt,IS_EltWedlet);next;next=DOM.findPreviousSibling(next,IS_EltWedlet)){const nextWedlet=next.wedlet
if(nextWedlet.isVirtual()||next.hidden){if(!result)result=[nextWedlet]
else result.push(nextWedlet)}else if(nextWedlet.model.nodeType!==ENodeType.comment){break}}return result}WEDLET.findVirtualWedletsBefore=findVirtualWedletsBefore
function findAllChildrenVirtualWedlets(elt){const ch=[]
elt.wedlet.visitWedletChildren(-1,Infinity,w=>{if(w.isVirtual())ch.push(w)},WEDLET.VISITOPTIONS_includeVirtuals)
return ch}WEDLET.findAllChildrenVirtualWedlets=findAllChildrenVirtualWedlets
function isTextBindBefore(from){if(from.wedlet.model.nodeType===ENodeType.text)return true
const rootElt=from.wedlet.element||from
const prev=DOM.findPreviousSibling(rootElt,IS_EltWedlet)
return prev&&prev.wedlet.model.nodeType===ENodeType.text}WEDLET.isTextBindBefore=isTextBindBefore
function isTextBindAfter(from){if(from.wedlet.model.nodeType===ENodeType.text)return true
const rootElt=from.wedlet.element||from
const next=DOM.findNextSibling(rootElt,IS_EltWedlet)
return next&&next.wedlet.model.nodeType===ENodeType.text}WEDLET.isTextBindAfter=isTextBindAfter
function cleanupStructList(structs,virtualsOrHidden,excludeText){if(!structs)return 0
if(!virtualsOrHidden&&!excludeText)return structs.reduce((total,rule)=>rule!=null?total+1:total,0)
let count=structs.length
for(let i=0;i<structs.length;i++){const struct=structs[i]
if(!struct){count--
continue}if(excludeText&&struct.structType===ENodeType.text){structs[i]=null
count--}else if(virtualsOrHidden&&!LANG.in(struct.structType,EFuzzyType.attributes,EFuzzyType.elements)){for(let k=0;k<virtualsOrHidden.length;k++){const virtual=virtualsOrHidden[k]
if(struct.structMatch(virtual.model.nodeType,virtual.wedNodeName||virtual.model.nodeName)){structs[i]=null
count--
break}}}}return count}WEDLET.cleanupStructList=cleanupStructList
function extractChildrenNodes(from,wedSelectorBuilder){let array
const tw=from.ownerDocument.createTreeWalker(from,NodeFilter.SHOW_ELEMENT,{acceptNode(n){if(isWedChildrenElt(n)){if(!array)array=[n]
else array.push(n)
if(wedSelectorBuilder)n.wedSelector=wedSelectorBuilder(n.parentElement,n)
return NodeFilter.FILTER_REJECT}return n.namespaceURI===DOM.XHTML_NS||n.namespaceURI===WED.WED_NS?NodeFilter.FILTER_SKIP:NodeFilter.FILTER_REJECT}})
tw.nextNode()
return array}WEDLET.extractChildrenNodes=extractChildrenNodes
function findVirtualWedletFrom(display,parent,before){for(let ch=before?before.previousElementSibling:parent.lastElementChild;ch;ch=ch.previousElementSibling){if(IS_EltWedlet(ch)){const wedlet=ch.wedlet
if(isDisplayedWedlet(wedlet)&&wedlet.displayCtx===display){return wedlet.isVirtual()?wedlet:null}}}return null}WEDLET.findVirtualWedletFrom=findVirtualWedletFrom
function findWedSelector(elt,forChidrenElt){while(elt&&elt.namespaceURI!==WED.WED_NS){if(elt.localName.indexOf("-")>=0){const ctor=window.customElements.get(elt.localName)
if(ctor&&"buildWedSelector"in ctor)return ctor.buildWedSelector(elt,forChidrenElt)}elt=elt.parentElement}return null}WEDLET.findWedSelector=findWedSelector
function onChildEmptied(wedldet,willBeEmptied,isRemovableCustom){let empty=true
let xa=XA.append(wedldet.wedAnchor,0)
wedldet.visitWedletChildren(-1,Infinity,wedlet=>{if(!willBeEmptied(XA.setAtDepth(xa,-1,wedlet.xaPart))&&!wedlet.isEmpty()){empty=false
return"stop"}},WEDLET.VISITOPTIONS_mainBranch)
if(empty){const wedParent=wedldet.wedParent
xa=XA.up(xa)
if(isRemovableCustom?!isRemovableCustom():!wedldet.wedMgr.docHolder.isRemovable(xa)){if(wedParent&&"onChildEmptied"in wedParent)return wedParent.onChildEmptied(subXa=>XA.isEquals(xa,subXa)||willBeEmptied(subXa))}else{if(wedParent&&"onChildEmptied"in wedParent){return wedParent.onChildEmptied(subXa=>XA.isEquals(xa,subXa)||willBeEmptied(subXa))||xa}return xa}}return null}WEDLET.onChildEmptied=onChildEmptied
function absorbContainersOnDelete(rootWedlet,range){const result={start:range.start,end:range.end}
const wedlet=WEDLET.findWedlet(rootWedlet,XA.up(XA.freeze(result.start)),WEDLET.FINDOPTIONS_lastAncestorIfNone)
if(wedlet&&"onChildEmptied"in wedlet){const newStart=wedlet.onChildEmptied(xa=>XA.isInRange(result,xa,false,true))
if(newStart){result.start=newStart
if(XA.isAnc(newStart,result.end)){result.end=XA.newBd(newStart).incrAtDepth(-1,1).xa
return result}}}if(!XA.isInSameSeq(result.start,result.end)){const endWedlet=WEDLET.findWedlet(rootWedlet,XA.up(XA.freeze(result.end)),WEDLET.FINDOPTIONS_lastAncestorIfNone)
if(endWedlet&&"onChildEmptied"in endWedlet){const newEnd=endWedlet.onChildEmptied(xa=>XA.isInRange(result,xa,false,true))
if(newEnd){result.end=XA.incrAtDepth(newEnd,-1,1)}}}return result}WEDLET.absorbContainersOnDelete=absorbContainersOnDelete
function replaceValue(wedlet,oldVal,newVal,batch){if(!WEDLET.isWritableWedlet(wedlet))return
const b=batch!==null&&batch!==void 0?batch:wedlet.wedMgr.docHolder.newBatch()
if(oldVal){if(newVal){b.spliceSequence(XA.append(wedlet.wedAnchor,0),oldVal.length,newVal)}else{const thisXa=wedlet.wedAnchor
const xa="onChildEmptied"in wedlet.wedParent?wedlet.wedParent.onChildEmptied(subXa=>XA.isEquals(thisXa,subXa)):null
if(xa)b.deleteSequence(xa,1)
else b.deleteSequence(XA.append(thisXa,0),oldVal.length)}}else if(newVal){if(wedlet.isVirtual()){WEDLET.insertDatasFromDisplay(wedlet,b,newVal)}else{b.insertText(XA.append(wedlet.wedAnchor,0),newVal)}}else return
if(!batch)b.doBatch()}WEDLET.replaceValue=replaceValue
function findWedletInArea(cb,rootWedlet,area,visitOptions){if(isFindAreaWedlet(rootWedlet)){return rootWedlet.findInArea(cb,area,visitOptions)}else if(isParentWedlet(rootWedlet)){if(rootWedlet.visitWedletChildren(-1,Infinity,w=>{if(findWedletInArea(cb,w,area,visitOptions)==="stop")return"stop"},visitOptions)==="stop")return"stop"}}WEDLET.findWedletInArea=findWedletInArea
async function focusWedlet(xa,wedMgr){const opts={forceFetch:true,lastAncestorIfNone:true,mainBranch:true}
let wedlet=WEDLET.findWedlet(wedMgr.rootWedlet,xa,opts)
if(opts.forceFetchPromises){wedlet=WEDLET.getFirstWedlet(await Promise.all(opts.forceFetchPromises))}while(wedlet){if(wedlet.focusWedlet){wedlet.focusWedlet()
break}wedlet=wedlet.wedParent}}WEDLET.focusWedlet=focusWedlet
async function highlightWedletFromLink(xa,wedMgr,blockPos){const opts={forceFetch:true,lastAncestorIfNone:true,wedletNotFoundDepth:-1,mainBranch:true}
let wedlet=WEDLET.findWedlet(wedMgr.rootWedlet,xa,opts)
if(opts.forceFetchPromises){wedlet=WEDLET.getFirstWedlet(await Promise.all(opts.forceFetchPromises))}if(blockPos==="nearest"&&opts.wedletNotFoundDepth!==-1&&typeof xa[opts.wedletNotFoundDepth]==="number"&&isParentWedlet(wedlet)){wedlet.visitWedletChildren(0,Infinity,c=>{wedlet=c},WEDLET.VISITOPTIONS_mainBranch)}while(wedlet){if(isTargetableWedlet(wedlet))return wedlet.highlightFromLink(blockPos)
wedlet=wedlet.wedParent}}WEDLET.highlightWedletFromLink=highlightWedletFromLink
function ensureContainersUncollapsed(elt){var _a
DOMSH.findFlatParentElt(elt,(_a=findWedEditor(elt))===null||_a===void 0?void 0:_a.rootNode,n=>{if(n.collapsed)n.collapsed=false
return false})}WEDLET.ensureContainersUncollapsed=ensureContainersUncollapsed
async function focusAnnot(wedMgr,annot){const opts={forceFetch:true,lastAncestorIfNone:true}
let wedletOwner=WEDLET.findWedlet(wedMgr.rootWedlet,annot.anchor||annot.start,opts)
if(opts.forceFetchPromises)wedletOwner=WEDLET.getFirstWedlet(await Promise.all(opts.forceFetchPromises))
if(!isSkAnnotFocuser(wedletOwner)||!wedletOwner.focusSkAnnot(annot)){while(wedletOwner){if(isTargetableWedlet(wedletOwner))return wedletOwner.highlightFromLink("nearest")
wedletOwner=wedletOwner.wedParent}}}WEDLET.focusAnnot=focusAnnot
function clearAnnots(elt){if(elt.wedAnnotErr)elt.wedAnnotErr.removeAll()
if(elt.wedAnnotSearch)elt.wedAnnotSearch.removeAll()
if(elt.wedAnnotDiff)elt.wedAnnotDiff.removeDiffWidget()}WEDLET.clearAnnots=clearAnnots
function matchModel(simil,model){if(isSkStructDef(simil)){if(simil.structType!==model.nodeType)return false
return model.nodeType===ENodeType.element||model.nodeType===ENodeType.attribute?simil.structName===model.nodeName:null}else if(simil instanceof Attr){return model.nodeType===ENodeType.attribute&&model.nodeName===simil.nodeName}else if(simil instanceof Node){if(simil.nodeType!==model.nodeType)return false
return model.nodeType===ENodeType.element?simil.nodeName===model.nodeName:null}else{if(JML.jmlNode2nodeType(simil)!==model.nodeType)return false
return model.nodeType===ENodeType.element?JML.jmlNode2name(simil)===model.nodeName:null}}WEDLET.matchModel=matchModel
function isAncestorOrEqual(anc,desc){while(desc){if(anc===desc)return true
desc=desc.wedParent}return false}WEDLET.isAncestorOrEqual=isAncestorOrEqual
async function importDiffLib(){if(!WEDLET.diffLib)WEDLET.diffLib=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/diff/diffTags.js")}WEDLET.importDiffLib=importDiffLib})(WEDLET||(WEDLET={}))

//# sourceMappingURL=wedlet.js.map