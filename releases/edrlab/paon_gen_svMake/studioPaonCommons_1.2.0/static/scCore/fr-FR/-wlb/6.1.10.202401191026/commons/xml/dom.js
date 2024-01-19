import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
export var DOM;(function(DOM){DOM.IS_node=function(n){return true}
DOM.IS_element=function(n){return n.nodeType===ENodeType.element}
DOM.IS_text=function(n){return n.nodeType===ENodeType.text}
DOM.IS_comment=function(n){return n.nodeType===ENodeType.comment}
DOM.IS_document=function(n){return n.nodeType===ENodeType.document}
DOM.IS_docOrFragment=function(n){return n.nodeType===ENodeType.document||n.nodeType===ENodeType.documentFragment}
DOM.IS_focusable=function(n){return(n.tabIndex>=0||n.isContentEditable)&&!n.hidden&&!n.disabled}
function findFirstChild(from,predicate=DOM.IS_node){let n=from?from.firstChild:null
while(n){if(predicate(n))return n
n=n.nextSibling}return null}DOM.findFirstChild=findFirstChild
function findLastChild(from,predicate=DOM.IS_node){let n=from?from.lastChild:null
while(n){if(predicate(n))return n
n=n.previousSibling}return null}DOM.findLastChild=findLastChild
function findNextSibling(from,predicate=DOM.IS_node){let n=from?from.nextSibling:null
while(n){if(predicate(n))return n
n=n.nextSibling}return null}DOM.findNextSibling=findNextSibling
function findPreviousSibling(from,predicate=DOM.IS_node){let n=from?from.previousSibling:null
while(n){if(predicate(n))return n
n=n.previousSibling}return null}DOM.findPreviousSibling=findPreviousSibling
function findParent(from,root=null,predicate=DOM.IS_node){let n=from?from.parentNode:null
while(n&&n!==root){if(predicate(n))return n
n=n.parentNode}return null}DOM.findParent=findParent
function findParentOrSelf(from,root=null,predicate=DOM.IS_node){let n=from
while(n&&n!==root){if(predicate(n))return n
n=n.parentNode}return null}DOM.findParentOrSelf=findParentOrSelf
function findLogicalParent(from,root=null,predicate=DOM.IS_node){let n=from?from.logicalParent||from.parentNode:null
while(n&&n!==root){if(predicate(n))return n
n=n.logicalParent||n.parentNode}return null}DOM.findLogicalParent=findLogicalParent
function findLogicalParentOrSelf(from,root=null,predicate=DOM.IS_node){let n=from
while(n&&n!==root){if(predicate(n))return n
n=n.logicalParent||n.parentNode}return null}DOM.findLogicalParentOrSelf=findLogicalParentOrSelf
function findNext(from,root=null,predicate=DOM.IS_node){let n=from.firstChild
if(n)return predicate(n)?n:findNext(n,root,predicate)
if(from===root)return null
while(!(n=from.nextSibling)){from=from.parentNode
if(from===root)return null}return predicate(n)?n:findNext(n,root,predicate)}DOM.findNext=findNext
function findPrevious(from,root=null,predicate=DOM.IS_node){if(from===root)return null
let prev=from.previousSibling
if(prev){let ch=prev.lastChild
while(ch){prev=ch
ch=ch.lastChild}return predicate(prev)?prev:findPrevious(prev,root,predicate)}prev=from.parentNode
return prev===root?null:predicate(prev)?prev:findPrevious(prev,root,predicate)}DOM.findPrevious=findPrevious
function findPreviousIn(root,predicate=DOM.IS_node){let prev=root.lastChild
if(!prev)return null
let ch=prev.lastChild
while(ch){prev=ch
ch=ch.lastChild}return predicate(prev)?prev:findPrevious(prev,root,predicate)}DOM.findPreviousIn=findPreviousIn
function findNextUncle(from,root=null,predicate=DOM.IS_node){let n=from
if(from===root)return null
while(!(n=from.nextSibling)){from=from.parentNode
if(from===root)return null}return predicate(n)?n:findNext(n,root,predicate)}DOM.findNextUncle=findNextUncle
function computeOffset(node,defaultOffset=0,predicate){if(!node)return defaultOffset
let offset=0
node=node.previousSibling
while(node){if(!predicate||predicate(node))offset++
node=node.previousSibling}return offset}DOM.computeOffset=computeOffset
function computeDepth(node){let depth=-1
while(node){depth++
node=node.parentNode}return depth}DOM.computeDepth=computeDepth
function isAncestor(anc,desc){while(desc){if(desc===anc)return true
desc=desc.parentNode}return false}DOM.isAncestor=isAncestor
function isLogicalAncestor(anc,desc){while(desc){if(desc===anc)return true
desc=desc.logicalParent||desc.parentNode}return false}DOM.isLogicalAncestor=isLogicalAncestor
function serializer(){return new XMLSerializer}DOM.serializer=serializer
function ser(node,addXmlDecl){const xml=serializer().serializeToString(node)
return addXmlDecl?'<?xml version="1.0"?>\n'+xml:xml}DOM.ser=ser
function debug(node){try{if(!node)return"null"
node=node.cloneNode(true)
const it=(node.ownerDocument||node).createNodeIterator(node,NodeFilter.SHOW_TEXT,null)
let n
while(n=it.nextNode())n.data="["+n.data+"]"
return serializer().serializeToString(node)}catch(e){return node?node.toString():"null"}}DOM.debug=debug
function newDomDoc(docType){return document.implementation.createDocument(null,null,docType)}DOM.newDomDoc=newDomDoc
function sharedHtmlDoc(){if(document instanceof HTMLDocument)return document
if(!_htmlDoc)_htmlDoc=document.implementation.createHTMLDocument()
return _htmlDoc}DOM.sharedHtmlDoc=sharedHtmlDoc
let _htmlDoc
function sharedXmlDoc(){return xmlDoc}DOM.sharedXmlDoc=sharedXmlDoc
function parseDom(xmlStr,base,contentType){if(!base)return(new DOMParser).parseFromString(xmlStr,contentType||"text/xml")
const doc=(new DOMParser).parseFromString(xmlStr,contentType||"text/xml")
doc.baseEndPoint=base
return doc}DOM.parseDom=parseDom
function parseDomValid(xmlStr,base,contentType){const doc=parseDom(xmlStr,base,contentType)
return isDomValid(doc)?doc:null}DOM.parseDomValid=parseDomValid
function isDomValid(doc){if(!doc)return false
if(!doc.body)return true
const ch=doc.body.firstElementChild
return!(ch&&ch.nodeName==="parsererror")}DOM.isDomValid=isDomValid
function lookupNamespaceURI(from,prefix){if(prefix==="xml")return DOM.XML_NS
const uri=from.lookupNamespaceURI(prefix)
if(uri!=null)return uri
const ns=(from.ownerDocument||from).namespaces
if(ns)return ns[prefix]}DOM.lookupNamespaceURI=lookupNamespaceURI
function newDomDocType(datas){if(!datas)return null
return document.implementation.createDocumentType(datas,"","")}DOM.newDomDocType=newDomDocType
function newRange(start,startOffset,end,endOffset){const r=new Range
r.setStart(start,startOffset)
r.setEnd(end,endOffset)
return r}DOM.newRange=newRange
function deleteSequenceInDom(xa,length,root){const ctn=XA.findDomContainer(xa,root)
if(DOM.ASSERT)if(!ctn)throw Error(`Container not found for xa ${xa} in doc :\n ${DOM.debug(root)}`)
const idx=XA.last(xa)
if(typeof idx==="string"){ctn.removeAttribute(idx)
return}if(ctn instanceof Attr){ctn.value=ctn.value.substring(0,idx)+ctn.value.substring(idx+length)
return}if(ctn instanceof CharacterData){ctn.deleteData(idx,length)
return}let node=ctn.childNodes[idx]
if(DOM.ASSERT)if(!node)throw Error(`Leaf node not found for xa ${xa} in doc :\n ${DOM.debug(root)}`)
const previous=node.previousSibling
for(let i=0;i<length;i++){if(DOM.ASSERT)if(!node)throw Error(`Delete length ${length} out of bounds from xa ${xa} in doc :\n ${DOM.debug(root)}`)
const next=node.nextSibling
node.parentNode.removeChild(node)
node=next}}DOM.deleteSequenceInDom=deleteSequenceInDom
function splitDomCharacterData(charData,offset){const newNode=charData.parentNode.insertBefore(charData.cloneNode(false),charData.nextSibling)
charData.deleteData(offset,charData.data.length)
newNode.deleteData(0,offset)
return newNode}DOM.splitDomCharacterData=splitDomCharacterData
function cleanupDom(node,cleanupWhitespaces,cleanupComments,cleanupPI){const filter=(cleanupWhitespaces?NodeFilter.SHOW_TEXT:0)|(cleanupComments?NodeFilter.SHOW_COMMENT:0)|(cleanupPI?NodeFilter.SHOW_PROCESSING_INSTRUCTION:0)
const tw=(node.ownerDocument||node).createNodeIterator(node,filter)
let previous=tw.nextNode()
let next
while(previous){next=tw.nextNode()
if(previous.nodeType!==Node.TEXT_NODE){previous.parentNode.removeChild(previous)}else if(DOM.WHITESPACES.test(previous.nodeValue)){let p=previous.parentElement
let space
while(p){if(space=p.getAttribute("xml:space"))break
p=p.parentElement}if(space!=="preserve")previous.parentNode.removeChild(previous)}previous=next}return node}DOM.cleanupDom=cleanupDom
function pullupNs(root){const nsMap={XML_NS:"xml",XMLNS_NS:"xmlns"}
const prefixMap={xml:DOM.XML_NS,xmlns:DOM.XMLNS_NS}
for(let i=0;i<root.attributes.length;i++){const att=root.attributes.item(i)
if(att.localName==="xmlns"){nsMap[att.value]=""
prefixMap[""]=att.value}else if(att.prefix==="xmlns"){nsMap[att.value]=att.localName
prefixMap[att.localName]=att.value}else if(att.prefix){checkNode(att)}}checkNode(root)
function checkDeclNs(att,prefix){const currNs=prefixMap[prefix]
if(currNs===att.value){att.ownerElement.removeAttributeNode(att)
return true}const currPrefix=nsMap[att.value]
if(currNs==null&&currPrefix==null){nsMap[att.value]=prefix
prefixMap[prefix]=att.value
att.ownerElement.removeAttributeNode(att)
root.setAttributeNodeNS(att)
return true}return false}function checkNode(node){if(node.namespaceURI===null)return
const currNs=prefixMap[node.prefix]
if(currNs===node.namespaceURI)return
const currPrefix=nsMap[node.namespaceURI]
if(currNs==null&&currPrefix==null){nsMap[node.namespaceURI]=node.prefix
prefixMap[node.prefix]=node.namespaceURI
root.setAttributeNS("http://www.w3.org/2000/xmlns/",node.prefix?"xmlns:"+node.prefix:"xmlns",node.namespaceURI)}}root.ownerDocument.createTreeWalker(root,NodeFilter.SHOW_ELEMENT,{acceptNode:function(elt){for(let i=0;i<elt.attributes.length;i++){const att=elt.attributes.item(i)
if(att.localName==="xmlns"){if(checkDeclNs(att,""))i--}else if(att.prefix==="xmlns"){if(checkDeclNs(att,att.localName))i--}else if(att.prefix){checkNode(att)}}checkNode(elt)
return NodeFilter.FILTER_SKIP}}).nextNode()
return root}DOM.pullupNs=pullupNs
function indentDom(root){if(INDENT_WS.length===0){for(let i=0;i<=25;i++)INDENT_WS[i]="\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t".substring(0,i+1)}root.normalize()
let eltRoot=root
let deep=0
switch(root.nodeType){case 9:eltRoot=root.documentElement
if(!eltRoot)return root
break
case 11:deep=-1}let currNode=eltRoot
function isText(node){const type=node.nodeType
if(DOM.IS_text(node)&&!DOM.WHITESPACES.test(node.data))return true
if(type==4)return true
if(type==8){let n=node.previousSibling
while(n){const t=n.nodeType
if(DOM.IS_text(n)&&!DOM.WHITESPACES.test(n.data))return true
if(t==4)return true
if(t!=8)break
n=n.previousSibling}n=node.nextSibling
while(n){const t=n.nodeType
if(DOM.IS_text(n)&&!DOM.WHITESPACES.test(n.data))return true
if(t==4)return true
if(t!=8)return false
n=n.nextSibling}}return false}function indent(){if(currNode.nodeType==3){currNode.nodeValue=INDENT_WS[Math.min(deep,25)]
if(currNode.nextSibling)currNode=currNode.nextSibling}else{currNode.parentNode.insertBefore(currNode.ownerDocument.createTextNode(INDENT_WS[Math.min(deep,25)]),currNode)}}let prevIsText=false
const preserveSpace=[false]
while(currNode){while(currNode.hasChildNodes()){deep++
preserveSpace[deep]=deep>1&&preserveSpace[deep-1]?!(currNode.getAttribute("xml:space")==="default"):currNode.nodeType===1&&currNode.getAttribute("xml:space")==="preserve"
currNode=currNode.firstChild
prevIsText=isText(currNode)
if(!prevIsText&&!preserveSpace[deep]){indent()}}while(currNode.nextSibling==null){deep--
if(deep>=0&&!prevIsText&&!isText(currNode)&&!preserveSpace[deep+1]){if(currNode.nodeType==3){currNode.nodeValue=INDENT_WS[Math.min(deep,25)]}else{currNode.parentNode.insertBefore(currNode.ownerDocument.createTextNode(INDENT_WS[Math.min(deep,25)]),null)}}if(currNode==eltRoot||currNode.parentNode==eltRoot)return root
currNode=currNode.parentNode
prevIsText=currNode.previousSibling!=null&&isText(currNode.previousSibling)}currNode=currNode.nextSibling
if(!isText(currNode)){if(!prevIsText){if(!preserveSpace[deep])indent()}else{prevIsText=false}}else{prevIsText=true}}return root}DOM.indentDom=indentDom
function nodeEquals(n1,n2){if(!n1||!n2)return n1!=null
if(n1.nodeType!==n2.nodeType)return false
if(DOM.IS_element(n1)&&DOM.IS_element(n2)){if(n1.localName!==n2.localName)return false
if(n1.namespaceURI!==n2.namespaceURI)return false
const n2Atts=n2.attributes
if(n1.attributes.length!==n2Atts.length)return false
if(n1.childNodes.length!=n2.childNodes.length)return false
for(let i=0,s=n2Atts.length;i<s;i++){const att2=n2Atts.item(i)
const att1=att2.namespaceURI?n1.getAttributeNodeNS(att2.namespaceURI,att2.localName):n1.getAttributeNode(att2.nodeName)
if(!att1||att1.value!==att2.value)return false}let ch2=n2.firstChild
for(let ch1=n1.firstChild;ch1;ch1=ch1.nextSibling){if(!nodeEquals(ch1,ch2))return false
ch2=ch2.nextSibling}}else if(n1 instanceof CharacterData){if(n1.nodeValue!==n2.nodeValue)return false}return true}DOM.nodeEquals=nodeEquals
function domReady(doc=document){return new Promise(resolve=>{if(doc.readyState!="loading")resolve()
else doc.addEventListener("DOMContentLoaded",()=>resolve())})}DOM.domReady=domReady
function append(parent,...children){for(const child of children)if(child)parent.appendChild(child)}DOM.append=append
function setAttr(node,name,value){if(node.getAttribute(name)!==value){if(value==null){node.removeAttribute(name)}else{node.setAttribute(name,value)}return true}return false}DOM.setAttr=setAttr
function setAttrBool(node,name,present){if(node.hasAttribute(name)){if(!present){node.removeAttribute(name)
return true}}else{if(present){node.setAttribute(name,"")
return true}}return false}DOM.setAttrBool=setAttrBool
function setHidden(node,value){if(node.hasAttribute("hidden")){if(!value){node.removeAttribute("hidden")
return true}}else{if(value){node.setAttribute("hidden","")
return true}}return false}DOM.setHidden=setHidden
function setHiddenProp(node,value){if(node.hidden){if(!value){node.hidden=false
return true}}else{if(value){node.hidden=true
return true}}return false}DOM.setHiddenProp=setHiddenProp
function toggleAttr(node,name){if(node.hasAttribute(name))node.removeAttribute(name)
else node.setAttribute(name,"")}DOM.toggleAttr=toggleAttr
function extractAttr(node,name){const val=node.getAttribute(name)
if(val!=null)node.removeAttribute(name)
return val}DOM.extractAttr=extractAttr
function setStyle(node,name,value){if(node.style.getPropertyValue(name)!==value){node.style.setProperty(name,value)
return true}return false}DOM.setStyle=setStyle
function setTextContent(node,value){if(!value){if(!node.firstChild)return false
node.textContent=null}else{const ch=node.firstChild
if(ch&&!ch.nextSibling&&ch.nodeType===ENodeType.text&&ch.nodeValue===value)return false
node.textContent=value}return true}DOM.setTextContent=setTextContent
function addClass(node,cls){if(!node.classList.contains(cls)){node.classList.add(cls)
return true}return false}DOM.addClass=addClass
function removeClass(node,cls){if(node.classList.contains(cls)){node.classList.remove(cls)
return true}return false}DOM.removeClass=removeClass
function escapeComment(text){if(!text)return text
return text.replace(/(-\~*)(?=-)/g,"$1~")}DOM.escapeComment=escapeComment
function unescapeComment(text){if(!text)return text
return text.replace(/(-\~*)\~(?=-)/g,"$1")}DOM.unescapeComment=unescapeComment
function txtNormToken(str){if(!str)return str
return str.replace(/^[ \n\r\t]+|[ \n\r\t]+$/g,"").replace(DOM.COLLAPSE_WS," ")}DOM.txtNormToken=txtNormToken
function txtEndsWithSp(str){return/[ \n\r\t]$/.test(str)}DOM.txtEndsWithSp=txtEndsWithSp
function txtStartsWithSp(str){return/^[ \n\r\t]/.test(str)}DOM.txtStartsWithSp=txtStartsWithSp
function txtStartSpLen(str){const r=/^[ \n\r\t]+/.exec(str)
return r?r[0].length:0}DOM.txtStartSpLen=txtStartSpLen
function txtEndSpLen(str){const r=/[ \n\r\t]+$/.exec(str)
return r?r[0].length:0}DOM.txtEndSpLen=txtEndSpLen
function setStyleStart(node,value,nodeDir=node){if(window.getComputedStyle(nodeDir).direction==="rtl")node.style.right=value
else node.style.left=value}DOM.setStyleStart=setStyleStart
function setStyleEnd(node,value,nodeDir=node){if(window.getComputedStyle(nodeDir).direction==="rtl")node.style.left=value
else node.style.right=value}DOM.setStyleEnd=setStyleEnd
function makeScNs(){const NS_MAP=new Map
NS_MAP.set("sc",DOM.SCCORE_NS)
NS_MAP.set("sp",DOM.SCPRIM_NS)
return NS_MAP}DOM.makeScNs=makeScNs
DOM.WHITESPACES=/^[ \t\r\n]*$/
DOM.COLLAPSE_WS=/[ ][ \n\r\t]+|[\n\r\t][ \n\r\t]*/g
DOM.XHTML_NS="http://www.w3.org/1999/xhtml"
DOM.SVG_NS="http://www.w3.org/2000/svg"
DOM.XML_NS="http://www.w3.org/XML/1998/namespace"
DOM.XMLNS_NS="http://www.w3.org/2000/xmlns/"
DOM.SCCORE_NS="http://www.utc.fr/ics/scenari/v3/core"
DOM.SCPRIM_NS="http://www.utc.fr/ics/scenari/v3/primitive"
DOM.SCFRAGMENT_TAG="sc:fragment"
DOM.SCITEM_TAG="sc:item"
DOM.ASSERT=false
const INDENT_WS=[]})(DOM||(DOM={}))
export var ENodeType;(function(ENodeType){ENodeType[ENodeType["element"]=1]="element"
ENodeType[ENodeType["attribute"]=2]="attribute"
ENodeType[ENodeType["text"]=3]="text"
ENodeType[ENodeType["pi"]=7]="pi"
ENodeType[ENodeType["comment"]=8]="comment"
ENodeType[ENodeType["document"]=9]="document"
ENodeType[ENodeType["documentFragment"]=11]="documentFragment"})(ENodeType||(ENodeType={}))
export var EUnknownNodeType;(function(EUnknownNodeType){EUnknownNodeType[EUnknownNodeType["unknown"]=0]="unknown"})(EUnknownNodeType||(EUnknownNodeType={}))
export const JSX={xmlDoc:null,ns:DOM.XHTML_NS,createElement(tag,attributes,...children){if(JSX.xmlDoc){const elt=JSX.xmlDoc.createElement(tag)
for(const name in attributes){const v=attributes[name]
if(v!=null)elt.setAttribute(name,v)}for(const child of children)JSX.appendChildren(elt,child)
return elt}else{let elt
if(typeof tag==="string")elt=document.createElementNS(JSX.ns,tag)
else if(tag===ShadowJsx)return new ShadowJsx(children,attributes)
else elt=new tag
for(const name in attributes){const attr=attributes[name]
if(name==="î"){elt.initialize(attr)}else if(typeof attr==="function")elt[name]=attr
else if(attr!=null)elt.setAttribute(name,attr)}if(tag==="template")for(const child of children)JSX.appendChildren(elt.content,child)
else for(const child of children)if(child)JSX.appendChildren(elt,child)
return elt}},appendChildren(elt,children){if(Array.isArray(children))children.forEach(ch=>JSX.appendChildren(elt,ch))
else if(children instanceof Node)elt.appendChild(children)
else if(children!=null){if(children.constructor===ShadowJsx){if(elt instanceof Element){const atts=children.attributes
const sr=elt.shadowRoot||elt.attachShadow(atts&&atts.init||{mode:"open"})
if(atts&&(atts.skin||atts.skinOver)){const reg=REG.findReg(elt,atts)
if(atts.skin)reg.installSkin(atts.skin,sr)
if(atts.skinOver)for(const sk of atts.skinOver.split(" "))reg.installSkin(sk,sr)}JSX.appendChildren(sr,children.children)}}else elt.appendChild((JSX.xmlDoc||document).createTextNode(children))}},asXml(jsx){if(0===asXmlRecurse++)JSX.xmlDoc=xmlDoc
try{return jsx()}finally{if(--asXmlRecurse===0)JSX.xmlDoc=null}},asSvg(jsx){if(0===asXmlRecurse++)JSX.ns=DOM.SVG_NS
try{return jsx()}finally{if(--asXmlRecurse===0)JSX.ns=DOM.XHTML_NS}}}
export class ShadowJsx{constructor(children,attributes){this.children=children
this.attributes=attributes}}let asXmlRecurse=0
const xmlDoc=DOM.newDomDoc()

//# sourceMappingURL=dom.js.map