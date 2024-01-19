import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
export var DOMSH;(function(DOMSH){var IS_node=DOM.IS_node
function findFlatParentElt(from,root=null,predicate=IS_node){let n=from?getFlatParentElt(from):null
while(n&&n!==root){if(predicate(n))return n
n=getFlatParentElt(n)}return null}DOMSH.findFlatParentElt=findFlatParentElt
function findFlatParentEltOrSelf(from,root=null,predicate=IS_node){let n=from
while(n&&n!==root){if(predicate(n))return n
n=getFlatParentElt(n)}return null}DOMSH.findFlatParentEltOrSelf=findFlatParentEltOrSelf
function findLogicalFlatParent(from,root=null,predicate=IS_node){let n=from?from.logicalParent||getFlatParentElt(from):null
while(n&&n!==root){if(predicate(n))return n
n=n.logicalParent||getFlatParentElt(n)}return null}DOMSH.findLogicalFlatParent=findLogicalFlatParent
function findLogicalFlatParentOrSelf(from,root=null,predicate=IS_node){let n=from
while(n&&n!==root){if(predicate(n))return n
n=n.logicalParent||getFlatParentElt(n)}return null}DOMSH.findLogicalFlatParentOrSelf=findLogicalFlatParentOrSelf
function findParentElt(from,root=null,predicate=IS_node){let n=from?getParentElt(from):null
while(n&&n!==root){if(predicate(n))return n
n=getParentElt(n)}return null}DOMSH.findParentElt=findParentElt
function findFlatPrevSibling(from,predicate=IS_node){let n=from?getFlatPrevSibling(from):null
while(n){if(predicate(n))return n
n=getFlatPrevSibling(n)}return null}DOMSH.findFlatPrevSibling=findFlatPrevSibling
function findFlatNextSibling(from,predicate=IS_node){let n=from?getFlatNextSibling(from):null
while(n){if(predicate(n))return n
n=getFlatNextSibling(n)}return null}DOMSH.findFlatNextSibling=findFlatNextSibling
function findFlatFirstChild(from,predicate=IS_node){const n=from?getFlatFirstChild(from):null
if(n){if(predicate(n))return n
return findFlatNextSibling(n,predicate)}return null}DOMSH.findFlatFirstChild=findFlatFirstChild
function findFlatLastChild(from,predicate=IS_node){const n=from?getFlatLastChild(from):null
if(n){if(predicate(n))return n
return findFlatPrevSibling(n,predicate)}return null}DOMSH.findFlatLastChild=findFlatLastChild
function findFlatNext(from,root=null,predicate=IS_node){let n=getFlatFirstChild(from)
if(n)return predicate(n)?n:findFlatNext(n,root,predicate)
if(from===root||!from)return null
while(!(n=getFlatNextSibling(from))){from=getParentElt(from)
if(from===root||!from)return null}return predicate(n)?n:findFlatNext(n,root,predicate)}DOMSH.findFlatNext=findFlatNext
function findFlatNextUncle(from,root=null,predicate=IS_node){let n=getFlatNextSibling(from)
if(n)return predicate(n)?n:findFlatNext(n,root,predicate)
if(from===root||!from)return null
while(!(n=getFlatNextSibling(from))){from=getParentElt(from)
if(from===root||!from)return null}return predicate(n)?n:findFlatNext(n,root,predicate)}DOMSH.findFlatNextUncle=findFlatNextUncle
function findFlatPrevious(from,root=null,predicate=IS_node){while(from){let n=getFlatPrevSibling(from)
if(!n){n=getParentElt(from)
if(!n||n===root)return null}else{let ch=getFlatLastChild(n)
if(ch){let sub=getFlatLastChild(ch)
while(sub){ch=sub
sub=getFlatLastChild(ch)}return predicate(ch)?ch:findFlatPrevious(ch,root,predicate)}}if(predicate(n))return n
from=n}return null}DOMSH.findFlatPrevious=findFlatPrevious
function findFlatPrevUncle(from,root=null,predicate=IS_node){while(from){if(from===root)return null
let n=getFlatPrevSibling(from)
while(n){if(predicate(n))return n
const ch=findFlatLastDesc(n,predicate)
if(ch)return ch
n=getFlatPrevSibling(n)}from=getParentElt(from)
if(from&&predicate(from))return from}return null}DOMSH.findFlatPrevUncle=findFlatPrevUncle
function findFlatLastDesc(from,predicate=IS_node){let n=from?getFlatLastChild(from):null
while(n){if(predicate(n))return n
const ch=findFlatLastDesc(n,predicate)
if(ch)return ch
n=findFlatPrevSibling(n)}return null}DOMSH.findFlatLastDesc=findFlatLastDesc
function findHost(from){var _a
const rootNode=from.getRootNode()
return(_a=rootNode)===null||_a===void 0?void 0:_a.host}DOMSH.findHost=findHost
function findDocumentOrShadowRoot(from){const rootNode=from.getRootNode()
return rootNode.nodeType===Node.DOCUMENT_NODE||rootNode instanceof ShadowRoot?rootNode:null}DOMSH.findDocumentOrShadowRoot=findDocumentOrShadowRoot
function findDeepActiveElement(from){let a=(from||document).activeElement
while(a&&a.shadowRoot&&a.shadowRoot.activeElement)a=a.shadowRoot.activeElement
return a}DOMSH.findDeepActiveElement=findDeepActiveElement
function getFlatParentElt(from){const slot=from.assignedSlot
if(slot)from=slot
return from.parentElement||(from.parentNode instanceof ShadowRoot?from.parentNode.host:null)}DOMSH.getFlatParentElt=getFlatParentElt
function getParentElt(from){return from.assignedSlot||from.parentElement||(from.parentNode instanceof ShadowRoot?from.parentNode.host:null)}DOMSH.getParentElt=getParentElt
function getFlatFirstChild(n){if(n instanceof HTMLSlotElement){const node=getFirstAssignedInSlot(n)
if(node)return node}else if(n.shadowRoot){const ch=n.shadowRoot.firstChild
if(ch instanceof HTMLSlotElement){const node=getFirstAssignedInSlot(ch)
if(node)return node}if(ch)return ch}const ch=n.firstChild
if(ch instanceof HTMLSlotElement){const n=getFirstAssignedInSlot(ch)
if(n)return n}return ch}DOMSH.getFlatFirstChild=getFlatFirstChild
function getFlatLastChild(n){if(n instanceof HTMLSlotElement){const node=getLastAssignedInSlot(n)
if(node)return node}else if(n.shadowRoot){const ch=n.shadowRoot.lastChild
if(ch instanceof HTMLSlotElement){const n=getLastAssignedInSlot(ch)
if(n)return n}if(ch)return ch}const ch=n.lastChild
if(ch instanceof HTMLSlotElement){const n=getLastAssignedInSlot(ch)
if(n)return n}return ch}DOMSH.getFlatLastChild=getFlatLastChild
function getFlatPrevSibling(from){let prv=from.previousSibling
while(prv){if(prv.assignedSlot!==from.assignedSlot){prv=prv.previousSibling}else if(prv instanceof HTMLSlotElement){const n=getLastAssignedInSlot(prv)
if(n)return n
prv=prv.previousSibling}else{return prv}}const slot=from.assignedSlot
if(slot)return getFlatPrevSibling(slot)
return prv}DOMSH.getFlatPrevSibling=getFlatPrevSibling
function getFlatNextSibling(from){let nxt=from.nextSibling
while(nxt){if(nxt.assignedSlot!==from.assignedSlot){nxt=nxt.nextSibling}else if(nxt instanceof HTMLSlotElement){const n=getFirstAssignedInSlot(nxt)
if(n)return n
nxt=nxt.nextSibling}else{return nxt}}const slot=from.assignedSlot
if(slot)return getFlatNextSibling(slot)
return null}DOMSH.getFlatNextSibling=getFlatNextSibling
function getFirstAssignedInSlot(slot){const nodes=slot.assignedNodes(OPT_assigneNodes_flatten)
if(nodes.length>0){const n=nodes[0]
return n instanceof HTMLSlotElement?getFirstAssignedInSlot(n):n}return null}function getLastAssignedInSlot(slot){const nodes=slot.assignedNodes(OPT_assigneNodes_flatten)
if(nodes.length>0){const n=nodes[nodes.length-1]
return n instanceof HTMLSlotElement?getLastAssignedInSlot(n):n}return null}function isFlatAncestor(anc,desc){while(desc){if(desc===anc)return true
desc=getFlatParentElt(desc)}return false}DOMSH.isFlatAncestor=isFlatAncestor
function isAncestor(anc,desc){while(desc){if(desc===anc)return true
desc=getParentElt(desc)}return false}DOMSH.isAncestor=isAncestor
function isLogicalFlatAncestor(anc,desc){while(desc){if(desc===anc)return true
desc=desc.logicalParent||getFlatParentElt(desc)}return false}DOMSH.isLogicalFlatAncestor=isLogicalFlatAncestor
function conditionOnSlots(content){const conditionRoots=content.querySelectorAll("if-slotted")
for(const conditionRoot of conditionRoots){let slots
if(conditionRoot.hasAttribute("slots")){const slotNames=conditionRoot.getAttribute("slots").split(",")
slots=slotNames.map(slotName=>{const selector=slotName=="#default"?`slot:not([name])`:`slot[name='${slotName}']`
return content.querySelector(selector)})}else if(conditionRoot.hasAttribute("area-ids")){const slotNames=conditionRoot.getAttribute("area-ids").split(",")
slots=slotNames.map(slotName=>content.querySelector(`slot[area-ids='${slotName}']`))}else if(conditionRoot.hasAttribute("area-groups")){const slotNames=conditionRoot.getAttribute("area-groups").split(",")
slots=slotNames.map(slotName=>content.querySelector(`slot[area-groups='${slotName}']`))}else{slots=conditionRoot.querySelectorAll("slot")}const conditionChilds=[]
while(conditionRoot.firstElementChild){const child=conditionRoot.firstElementChild
conditionChilds.push(child)
conditionRoot.parentNode.insertBefore(child,conditionRoot)}const checkSlotted=function(){const assigned=Array.prototype.every.call(slots,slot=>slot&&slot.assignedNodes().length!=0)
for(const conditionChild of conditionChilds){conditionChild.style.display=assigned?"":"none"}}
checkSlotted()
conditionRoot.remove()
for(const slot of slots){if(slot)slot.addEventListener("slotchange",checkSlotted)}}return content}DOMSH.conditionOnSlots=conditionOnSlots
DOMSH.SHADOWDOM_INIT=Object.freeze({mode:"open"})
const OPT_assigneNodes_flatten={flatten:true}})(DOMSH||(DOMSH={}))

//# sourceMappingURL=domsh.js.map