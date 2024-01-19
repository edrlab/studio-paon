import{DOM}from"./dom.js"
import{XA}from"./xAddr.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
export var JML;(function(JML){function newJml(){return[]}JML.newJml=newJml
function newBd(startContex){return new JmlBuilder(startContex)}JML.newBd=newBd
const DEFAULT_ODom2JmlOptions={}
function dom2jml(dom,jml=JML.newJml(),options=DEFAULT_ODom2JmlOptions){if(!dom)return jml
if(options.addDocType){const doc=dom.nodeType===Node.DOCUMENT_NODE?dom:dom.ownerDocument
const docType=doc.doctype?doc.doctype.name:null
if(docType)jml.push({"":JML.DOCTYPE,"=":docType})}JML.domNode2jml(dom,jml,options)
return jml}JML.dom2jml=dom2jml
function dom2jmlNode(node){switch(node.nodeType){case Node.TEXT_NODE:return node.nodeValue
case Node.ELEMENT_NODE:const elt={"":node.nodeName}
if(node.hasAttributes()){const attrs=node.attributes
for(let i=0,s=attrs.length;i<s;i++){const att=attrs[i]
elt[att.name]=att.value}}return elt
case Node.COMMENT_NODE:return{"":JML.COMMENT,"=":node.nodeValue}
case Node.PROCESSING_INSTRUCTION_NODE:return{"":JML.PI+node.nodeName,"=":node.nodeValue}}return null}JML.dom2jmlNode=dom2jmlNode
function domNode2jml(node,jml,options=DEFAULT_ODom2JmlOptions){switch(node.nodeType){case Node.TEXT_NODE:if(!options.cleanupWhitespaces||/\S/.test(node.nodeValue)){if(options.mergeTextNodes&&typeof jml[jml.length-1]==="string"){jml[jml.length-1]+=node.nodeValue}else{jml.push(node.nodeValue)}}break
case Node.ELEMENT_NODE:{const elt={"":node.nodeName}
jml.push(elt)
if(node.hasAttributes()){const attrs=node.attributes
for(let i=0,s=attrs.length;i<s;i++){const att=attrs[i]
elt[att.name]=att.value}}let ch=node.firstChild
if(ch){const arr=[]
jml.push(arr)
while(ch){JML.domNode2jml(ch,arr,options)
ch=ch.nextSibling}}break}case Node.COMMENT_NODE:if(!options.cleanupComments)jml.push({"":JML.COMMENT,"=":node.nodeValue})
break
case Node.PROCESSING_INSTRUCTION_NODE:if(!options.cleanupPI)jml.push({"":JML.PI+node.nodeName,"=":node.nodeValue})
break
case Node.DOCUMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:{let ch=node.firstChild
while(ch){JML.domNode2jml(ch,jml,options)
ch=ch.nextSibling}break}}}JML.domNode2jml=domNode2jml
function dom2jmlThreshold(node,threshold,jml=JML.newJml(),options=DEFAULT_ODom2JmlOptions){if(!node)return jml
if(options.addDocType){const doc=node.nodeType===Node.DOCUMENT_NODE?node:node.ownerDocument
const docType=doc.doctype?doc.doctype.name:null
if(docType)jml.push({"":JML.DOCTYPE,"=":docType})
threshold-=10}JML.domNode2jmlThreshold(node,jml,threshold,options)
return jml}JML.dom2jmlThreshold=dom2jmlThreshold
function domNode2jmlThreshold(node,jml,threshold,options=DEFAULT_ODom2JmlOptions){switch(node.nodeType){case Node.TEXT_NODE:if(!options.cleanupWhitespaces||/\S/.test(node.nodeValue)){jml.push(node.nodeValue)
threshold-=node.nodeValue.length}break
case Node.ELEMENT_NODE:{const elt={"":node.nodeName}
jml.push(elt)
threshold-=10
if(node.hasAttributes()){const attrs=node.attributes
for(let i=0,s=attrs.length;i<s;i++){const att=attrs[i]
elt[att.name]=att.value
threshold-=10+att.value.length}}let ch=node.firstChild
if(ch){const arr=[]
jml.push(arr)
while(ch){threshold=JML.domNode2jmlThreshold(ch,arr,threshold,options)
ch=ch.nextSibling
if(threshold<0&&ch){while(ch){arr.push(JML.computeWeightNode(ch))
ch=ch.nextSibling}}}}break}case Node.COMMENT_NODE:if(!options.cleanupComments){jml.push({"":JML.COMMENT,"=":node.nodeValue})
threshold-=node.nodeValue.length}break
case Node.PROCESSING_INSTRUCTION_NODE:if(!options.cleanupPI){jml.push({"":JML.PI+node.nodeName,"=":node.nodeValue})
threshold-=10+node.nodeValue.length}break
case Node.DOCUMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:{let ch=node.firstChild
while(ch){threshold=JML.domNode2jmlThreshold(ch,jml,threshold,options)
ch=ch.nextSibling
if(threshold<0&&ch){while(ch){jml.push(JML.computeWeightNode(ch))
ch=ch.nextSibling}}}break}}return threshold}JML.domNode2jmlThreshold=domNode2jmlThreshold
function appendDomNode(node,deep,to){switch(node.nodeType){case Node.ELEMENT_NODE:if(Array.isArray(to)){const elt={"":node.nodeName}
if(node.hasAttributes()){const attrs=node.attributes
for(let i=0,s=attrs.length;i<s;i++){const att=attrs[i]
elt[att.name]=att.value}}const subSet=[]
if(deep){let ch=node.firstChild
while(ch){JML.domNode2jml(ch,subSet)
ch=ch.nextSibling}}to.push(elt,subSet)
return subSet}else{return to.appendChild(cloneNode(node,deep))}case Node.TEXT_NODE:Array.isArray(to)?to.push(node.nodeValue):to.appendChild(cloneNode(node,false))
return null
case Node.COMMENT_NODE:Array.isArray(to)?to.push({"":JML.COMMENT,"=":node.nodeValue}):to.appendChild(cloneNode(node,false))
return null
case Node.PROCESSING_INSTRUCTION_NODE:Array.isArray(to)?to.push({"":JML.PI+node.nodeName,"=":node.nodeValue}):to.appendChild(cloneNode(node,false))
return null}return null}JML.appendDomNode=appendDomNode
function appendText(str,to){Array.isArray(to)?to.push(str):to.appendChild(to.ownerDocument.createTextNode(str))}JML.appendText=appendText
function appendChildren(children,parents,parentOffset){const parentIdx=getJmlIndexForOffset(parents,parentOffset)
const parentch=parents[parentIdx+1]
if(Array.isArray(parentch)){parentch.push(...children)}else{parents.splice(parentIdx+1,0,children)}}JML.appendChildren=appendChildren
function insertChildren(children,insertOffset,parents,parentOffset){const parentIdx=getJmlIndexForOffset(parents,parentOffset)
const parentch=parents[parentIdx+1]
if(Array.isArray(parentch)){const chIdx=getJmlIndexForOffset(parentch,insertOffset)
if(chIdx>=0)parentch.splice(chIdx,0,...children)
else parentch.push(...children)}else{parents.splice(parentIdx+1,0,children)}}JML.insertChildren=insertChildren
function replaceChildren(children,to,inSet){for(let i=0;i<inSet.length;i++){if(inSet[i]===to){if(Array.isArray(inSet[i+1]))inSet[i+1]=children
else inSet.splice(i+1,0,children)
return true}}return false}JML.replaceChildren=replaceChildren
function cloneNode(node,deep){return _customCloner!==null?_customCloner(node,deep):node.cloneNode(deep)}JML.cloneNode=cloneNode
function doWithCustomClone(exec,cloner){try{_customCloner=cloner
exec()}finally{_customCloner=null}}JML.doWithCustomClone=doWithCustomClone
let _customCloner=null
function domNode2jmlContainer(dom){switch(dom.nodeType){case Node.TEXT_NODE:return[""]
case Node.ELEMENT_NODE:return[{"":dom.nodeName}]
case Node.COMMENT_NODE:return[{"":JML.COMMENT}]
case Node.PROCESSING_INSTRUCTION_NODE:return[{"":JML.PI+dom.nodeName}]
case Node.DOCUMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:return[]}}JML.domNode2jmlContainer=domNode2jmlContainer
function findDocTypeDatas(jml){if(jml!=null)for(let i=0,s=jml.length;i<s;i++){const node=jml[i]
if(!JML.isJmlObj(node))return null
const name=node[""]
if(name===JML.DOCTYPE)return node["="]
if(name!==JML.COMMENT&&name!==JML.PI)return null}return null}JML.findDocTypeDatas=findDocTypeDatas
function jmlToDom(jml,domParent,domInsertBefore){if(domParent==null)domParent=DOM.newDomDoc(DOM.newDomDocType(JML.findDocTypeDatas(jml)))
const doc=domParent.nodeType===Node.DOCUMENT_NODE?domParent:domParent.ownerDocument
function arrayToDom(arr,parent,before){for(let i=0,s=arr.length;i<s;i++){const node=arr[i]
if(typeof node==="string"){parent.insertBefore(doc.createTextNode(node),before)
continue}const name=node[""]
if(name.charAt(0)===JML.COMMENT){if(name===JML.COMMENT){parent.insertBefore(doc.createComment(node["="]||""),before)}}else if(name===JML.PI){parent.insertBefore(doc.createProcessingInstruction(name.substring(1),node["="]),before)}else{const sep=name.indexOf(":")
const ns=DOM.lookupNamespaceURI(parent,sep>0?name.substring(0,sep):"")
const elt=parent.insertBefore(ns?doc.createElementNS(ns,name):doc.createElement(name),before)
for(const k in node){if(k!=""){const sep=k.indexOf(":")
const ns=sep>0?DOM.lookupNamespaceURI(parent,k.substring(0,sep)):null
if(ns)elt.setAttributeNS(ns,k,node[k])
else elt.setAttribute(k,node[k])}}const ch=arr[i+1]
if(Array.isArray(ch)){arrayToDom(ch,elt,null)
i++}}}}if(jml)arrayToDom(jml,domParent,domInsertBefore)
return domParent}JML.jmlToDom=jmlToDom
function jmlToElt(elt,children){if(!defaultDoc)defaultDoc=DOM.newDomDoc()
return jmlToDom(children?[elt,children]:[elt],defaultDoc.createDocumentFragment()).firstElementChild}JML.jmlToElt=jmlToElt
let defaultDoc
function jmlToXml(jml){const doc=DOM.newDomDoc(DOM.newDomDocType(JML.findDocTypeDatas(jml)))
return DOM.serializer().serializeToString(JML.jmlToDom(jml,doc))}JML.jmlToXml=jmlToXml
function getJmlNode(jmlSet,offset){if(jmlSet)for(let i=0,s=jmlSet.length;i<s;i++){if(offset--===0)return jmlSet[i]
if(Array.isArray(jmlSet[i+1]))i++}return null}JML.getJmlNode=getJmlNode
function getJmlChildrenOrBody(jmlSet,offset){if(jmlSet)for(let i=0,s=jmlSet.length;i<s;i++){const ch=jmlSet[i+1]
if(offset--===0){if(Array.isArray(ch))return ch
const node=jmlSet[i]
return typeof node==="string"?node:null}if(Array.isArray(ch))i++}return null}JML.getJmlChildrenOrBody=getJmlChildrenOrBody
function getJmlIndexForOffset(jmlSet,offset){if(jmlSet)for(let i=0,s=jmlSet.length;i<s;i++){if(offset--===0)return i
if(Array.isArray(jmlSet[i]))i++}return-1}JML.getJmlIndexForOffset=getJmlIndexForOffset
function findJmlEltByName(jmlSet,name){_result.node=null
_result.ch=null
if(jmlSet){for(let i=0;i<jmlSet.length;i++){const n=jmlSet[i]
const next=jmlSet[i+1]
if(isJmlObj(n)&&n[""]===name){_result.node=n
if(Array.isArray(next))_result.ch=next
return _result}if(Array.isArray(next))i++}}return _result}JML.findJmlEltByName=findJmlEltByName
const _result={}
function lengthJmlOrText(jmlOrText){if(jmlOrText==null)return 0
if(typeof jmlOrText==="string")return jmlOrText.length
let count=0
for(let i=0,s=jmlOrText.length;i<s;i++){const entry=jmlOrText[i]
if(Array.isArray(entry))continue
if(typeof entry=="number")count+=entry
else count++}return count}JML.lengthJmlOrText=lengthJmlOrText
function jmlNode2value(jmlNode){if(typeof jmlNode==="string")return jmlNode
if(jmlNode&&jmlNode[""]==="!")return jmlNode["="]
return null}JML.jmlNode2value=jmlNode2value
function jmlNode2name(jmlNode){if(typeof jmlNode==="string")return"#text"
if(jmlNode==null)return null
const name=jmlNode[""]
if(name==="!")return"#comment"
return name}JML.jmlNode2name=jmlNode2name
function jmlNode2nodeType(jmlNode){if(typeof jmlNode==="string")return Node.TEXT_NODE
if(jmlNode==null)return null
const name=jmlNode[""]
if(name==="!")return Node.COMMENT_NODE
return Node.ELEMENT_NODE}JML.jmlNode2nodeType=jmlNode2nodeType
function isElt(child){if(typeof child!=="object"||Array.isArray(child))return false
const name=child[""]
return name!=="!"}JML.isElt=isElt
function isText(child){return typeof child==="string"}JML.isText=isText
function isJmlObj(child){return typeof child==="object"&&!Array.isArray(child)}JML.isJmlObj=isJmlObj
function isWhole(jml){if(jml)for(let i=0;i<jml.length;i++){if(typeof jml[i]==="number")return false
const ch=jml[i+1]
if(Array.isArray(ch)){if(!isWhole(ch))return false
i++}}return true}JML.isWhole=isWhole
function insertJmlInDom(xa,jmlOrText,root,forbidSplit){let ctn=XA.findDomContainer(xa,root)
if(DOM.ASSERT)if(!ctn)throw Error(`Container not found for xa ${xa} in doc :\n ${DOM.debug(root)}`)
const idx=XA.last(xa)
if(typeof idx==="string"){if(DOM.ASSERT)if(ctn.nodeType!==Node.ELEMENT_NODE)throw Error(`Container not an element for xa ${xa} in doc :\n ${DOM.debug(root)}`)
const sep=idx.indexOf(":")
const ns=sep>0?DOM.lookupNamespaceURI(ctn,idx.substring(0,sep)):null
if(jmlOrText==null){if(ns)ctn.removeAttributeNS(ns,idx.substring(sep+1))
else ctn.removeAttribute(idx)}else{if(DOM.ASSERT)if(typeof jmlOrText!=="string")throw Error(`Attribute to set not a string for xa ${xa} in doc :\n ${DOM.debug(root)}`)
if(ns)ctn.setAttributeNS(ns,idx,jmlOrText)
else ctn.setAttribute(idx,jmlOrText)}return}if(ctn instanceof Attr){ctn.value=LANG.stringInsert(ctn.value,idx,jmlOrText)
return}let nodeAfter
if(ctn instanceof CharacterData){if(typeof jmlOrText==="string"){if(DOM.ASSERT)if(idx<0||idx>ctn.data.length)throw Error(`Last index out of bounds in xa ${xa} for str '${ctn.data}' in doc :\n ${DOM.debug(root)}`)
ctn.insertData(idx,jmlOrText)
return}if(forbidSplit)throw Error(`Split CharacterData [${ctn.data}] forbidden for insertion : ${jmlOrText}`)
if(idx===0){nodeAfter=ctn.childNodes[idx]}else if(idx===ctn.data.length){nodeAfter=ctn.childNodes[idx].nextSibling}else if(idx>0){if(DOM.ASSERT)if(idx<0||idx>ctn.data.length)throw Error(`Last index out of bounds in xa ${xa} for str '${ctn.data}' in doc :\n ${DOM.debug(root)}`)
nodeAfter=DOM.splitDomCharacterData(ctn,idx)}ctn=ctn.parentNode}else{if(DOM.ASSERT)if(idx<0||idx>ctn.childNodes.length)throw Error(`Last index out of bounds in xa ${xa} in doc :\n ${DOM.debug(root)}`)
nodeAfter=ctn.childNodes[idx]}JML.jmlToDom(typeof jmlOrText==="string"?[jmlOrText]:jmlOrText,ctn,nodeAfter)}JML.insertJmlInDom=insertJmlInDom
function extractJmlOrTextFromDom(xa,length,root){const ctn=XA.findDomContainer(xa,root)
if(ctn==null)return null
const last=XA.last(xa)
if(typeof last==="string")throw Error(`xAddr ${xa} must not point an attr in this function.`)
if(ctn instanceof CharacterData){if(DOM.ASSERT)if(last+ctn.nodeValue.length<length)throw Error(`Length ${length} out of bound from ${xa} in doc :\n ${DOM.debug(root)}`)
return ctn.nodeValue.substr(last,length)}else if(ctn instanceof Attr){if(DOM.ASSERT)if(last+ctn.value.length<length)throw Error(`Length ${length} out of bound from ${xa} in doc :\n ${DOM.debug(root)}`)
return ctn.value.substr(last,length)}const jml=[]
let node=ctn.childNodes[last]
for(let i=0;i<length;i++){if(DOM.ASSERT)if(!node)throw Error(`Length ${length} out of bound from ${xa} in doc :\n ${DOM.debug(root)}`)
if(!node)break
JML.domNode2jml(node,jml,DEFAULT_ODom2JmlOptions)
node=node.nextSibling}return jml}JML.extractJmlOrTextFromDom=extractJmlOrTextFromDom
function computeWeightNode(node){if(!node)return 0
const nodeIt=(node.ownerDocument||node).createTreeWalker(node,NodeFilter.SHOW_ALL)
let weight=0
do{switch(node.nodeType){case Node.ELEMENT_NODE:weight+=50
break
case Node.TEXT_NODE:case Node.COMMENT_NODE:case Node.PROCESSING_INSTRUCTION_NODE:weight+=node.nodeValue.length
break}}while((node=nodeIt.nextNode())!=null)
return weight}JML.computeWeightNode=computeWeightNode
function computeWeightJml(jml){if(!jml)return 0
let weight=0
for(let i=0;i<jml.length;i++){const node=jml[i]
if(typeof node=="number"){weight+=node}else{switch(jmlNode2nodeType(node)){case Node.ELEMENT_NODE:weight+=50
if(Array.isArray(jml[i+1]))weight+=JML.computeWeightJml(jml[++i])
break
case Node.TEXT_NODE:weight+=node.length
break
case Node.COMMENT_NODE:case Node.PROCESSING_INSTRUCTION_NODE:weight+=node["="].length
break}}}return weight}JML.computeWeightJml=computeWeightJml
function filterForbiddenXmlCharsInJml(ct){if(ct)for(let i=0;i<ct.length;i++){const n=ct[i]
if(Array.isArray(n)){filterForbiddenXmlCharsInJml(n)}else{switch(typeof n){case"string":ct[i]=filterForbiddenXmlChars(n)
break
case"object":for(const k in n)n[k]=filterForbiddenXmlChars(n[k])
break}}}return ct}JML.filterForbiddenXmlCharsInJml=filterForbiddenXmlCharsInJml
function filterForbiddenXmlChars(str){return str.replace(/[\x01-\x08\x0B-\x0C\x0E-\x1F\x7F-\x84\x86-\x9F]/g,"")}JML.filterForbiddenXmlChars=filterForbiddenXmlChars
JML.COMMENT="!"
JML.DOCTYPE="!DOCTYPE"
JML.PI="?"})(JML||(JML={}))
class JmlSubSetIterator{constructor(jml,fromOffset=0){this.currentIdx=-1
this._offset=-1
this.jml=jml||[]
for(let i=0;i<fromOffset;i++){if(!this.next())break}}next(){if(++this._offset>=this.jml.length)return false
const node=this.jml[this._offset]
this.currentIdx++
if(typeof node==="number"){this.currentNode=node
this.currentChildren=null}else{this.currentNode=node
const ch=this.jml[this._offset+1]
if(Array.isArray(ch)){this._offset++
this.currentChildren=ch}else{this.currentChildren=null}}return true}}class JmlBuilder{constructor(startContext){this._stack=[]
if(startContext)this.setStartCtx(startContext)
else this._children=[]}setStartCtx(root,children){this._stack.length=0
if(root==null){this._elt=null
this._children=[]}else if(Array.isArray(root)){this._elt=null
this._children=root}else if(typeof root==="string"){this._elt=null
this._children=[root]}else{const name=root[""]
if(name===JML.COMMENT||name===JML.DOCTYPE||name.charAt(0)==JML.PI){this._elt=null
this._children=[root]}else{this._elt=root
this._stack.push([this._elt])
this._children=children}}return this}get root(){return this._stack[0]||this._children}elt(name,classNames,extType){const newElt={}
newElt[""]=name
if(classNames)newElt["class"]=classNames
if(extType)newElt["is"]=extType
this.xAddChild(newElt)
if(this._elt)this._stack.push(this._elt)
this._stack.push(this._children)
this._elt=newElt
this._children=null
return this}att(name,value){this._elt[name]=value
return this}text(text){if(text==null)return this
this.xAddChild(text)
return this}comment(comment){if(comment==null)return this
this.xAddChild({"":"!","=":comment})
return this}pi(name,value){if(name==null)return this
this.xAddChild({"":"?"+name,"=":value})
return this}docType(value){if(this._elt)throw"Not at root position"
this.xAddChild({"":"!DOCTYPE","=":value})
return this}up(){if(!this._elt)throw"no elt context"
this._children=this._stack.pop()
this._elt=this._stack.pop()
return this}clear(){if(this._elt)this._children=null
else this._children=[]
return this}get currentElt(){return this._elt}get currentChildren(){return this._children||this._stack[0]}xAddChild(ch){if(!this._children){this._children=[]
this._stack[this._stack.length-1].push(this._children)}this._children.push(ch)}}export{JmlBuilder,JmlSubSetIterator}

//# sourceMappingURL=jml.js.map