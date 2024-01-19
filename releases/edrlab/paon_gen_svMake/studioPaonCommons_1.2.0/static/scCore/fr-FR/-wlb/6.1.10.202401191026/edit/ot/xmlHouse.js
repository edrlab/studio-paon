import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{HouseOt,isMsgUpdater,ListMsgOt,MsgOt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/houseOt.js"
import{House,InitSlaveRep,ResetStatesMsg,State}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/urban.js"
export class XmlHouse extends HouseOt{constructor(options){super(options)
this._states=[]}initHouse(options){super.initHouse(options)
this._states=[]
this.putState(options.xmlBodyState||new XmlBodyState("body"))
if(options.namepspaces)this._body.namespaces=options.namepspaces
if(options.initialDoc){this._body.resetDom(options.initialDoc)}else if(options.initialJml){this._body.resetJml(options.initialJml)}}get root(){return this._body.root}get document(){return this._body.document}get namespaces(){return this._body.namespaces}newBatch(){return new XmlBatch}executeBatch(batch,fromDoor){if(batch.getState()==="building"){if(batch.msgs.length===1&&!batch.selAfter&&!batch.selBefore&&!batch.metas){(fromDoor||this.publicDoor).receiveMsg(batch.msgs[0])}else{(fromDoor||this.publicDoor).receiveMsg(batch)}}batch.setDone()}getStateById(id){if(id==="body")return this._body
for(let i=0,e=this._states.length;i<e;i++)if(this._states[i].id===id)return this._states[i]
return null}putState(state){if(state.id==="body"){this._body=state.attachHouse(this)}else{this._states.push(state.attachHouse(this))}}removeState(state){for(let i=0,e=this._states.length;i<e;i++)if(state===this._states[i])this._states.splice(i,1)}exportFragment(range){return this._body.exportFragment(range)}exportRange(range,format,formatOptions){return this.exportFromFragment(this._body.exportFragment(range),format,formatOptions)}exportNodes(xaNodes,filters,format,formatOptions){const frag=this.document.createDocumentFragment()
for(let i=0;i<xaNodes.length;i++){const res=this._body.exportNodeCustom(xaNodes[i],filters[i])
if(res)frag.appendChild(res)}return this.exportFromFragment(frag,format,formatOptions)}exportFromFragment(frag,format,options){if(format==="application/xml"){const fragment=frag.ownerDocument.createElementNS((options===null||options===void 0?void 0:options.rootTagNs)||DOM.SCCORE_NS,(options===null||options===void 0?void 0:options.rootTagName)||DOM.SCFRAGMENT_TAG)
if(frag.xmlSpacePreserve)fragment.setAttributeNS(DOM.XML_NS,"xml:space","preserve")
const ns=this._body.namespaces
if(ns)for(const prefix in ns){if(prefix===""){fragment.setAttributeNS(DOM.XMLNS_NS,"xmlns",ns[prefix])}else{fragment.setAttributeNS(DOM.XMLNS_NS,"xmlns:"+prefix,ns[prefix])}}fragment.appendChild(frag)
DOM.pullupNs(fragment)
return DOM.ser(fragment)}else if(format==="jml"){return JML.dom2jml(frag)}throw Error("Format not found")}findNodeByXpath(xpath){const exp=this._body.document.createExpression(xpath,this._body)
const result=exp.evaluate(this._body.document,XPathResult.FIRST_ORDERED_NODE_TYPE,null)
return result.singleNodeValue}findNodeByXa(xa){return XA.findDomLast(xa,this._body.document)}xApplyMsgOtLocally(msg,correctable){try{if(this._body)this._body.update(msg)
for(let i=0,e=this._states.length;i<e;i++)this._states[i].update(msg)}catch(e){console.error("xApplyMsgOtLocally in house failed",this,msg,e)
throw e}return msg}xApplyResetStatesLocally(msg){super.xApplyResetStatesLocally(msg)
if(this._body)this._body.update(msg)
this._states=msg.datas.states.map(st=>HouseOt.STATE_FACTORYREG.newFromJson(st).attachHouse(this))}xInitDom(root){}writeFullStates(datas,options){datas.body=JML.dom2jml(this._body.root)
datas.states=this._states.map(st=>st.asJson())}killHouse(){super.killHouse()
this._body.attachHouse(null)
this._states.forEach(state=>{state.attachHouse(null)})}}export class XmlBodyState extends State{constructor(id){super()
this.id=id}get document(){return this.root instanceof Document?this.root:this.root.ownerDocument}get namespaces(){return this._namespaces}set namespaces(v){this._namespaces=v
if(this.root)this.document.namespaces=v}resetJml(jml){const doc=DOM.newDomDoc()
if(this._namespaces)doc.namespaces=this._namespaces
this.setRoot(JML.jmlToDom(jml,doc))
if(XmlHouse.DEBUG&&this.house)console.log("resetJml::\n"+this.toString())
return this}resetDom(root){while(root.parentNode)root=root.parentNode
if(this._namespaces)(root.ownerDocument||root).namespaces=this._namespaces
this.setRoot(root)
if(XmlHouse.DEBUG&&this.house)console.log("resetDom::\n"+this.toString())
return this}setRoot(root){var _a
this.root=root;(_a=this.house)===null||_a===void 0?void 0:_a.xInitDom(root)}update(msg){switch(msg.type){case XmlInsertMsg.type:{const m=msg
if(m.killed)return
if(XmlHouse.ASSERT)if(this.house)m.assertMsgValidity(this.house)
if(m.xa.length===1&&this.root instanceof Document&&JML.isElt(m.jml[0])&&this.root.documentElement){this.root.documentElement.remove()}JML.insertJmlInDom(m.xa,m.jml,this.root,true)
break}case XmlDeleteMsg.type:{const m=msg
if(m.killed)return
if(XmlHouse.ASSERT)if(this.house)m.assertMsgValidity(this.house)
m.setJml(JML.extractJmlOrTextFromDom(m.xa,m.len,this.root))
DOM.deleteSequenceInDom(m.xa,m.len,this.root)
break}case XmlStrMsg.type:{const m=msg
if(m.killed)return
if(XmlHouse.ASSERT)if(this.house)m.assertMsgValidity(this.house)
const last=XA.last(m.xa)
if(typeof last==="string"){const elt=XA.findDomContainer(m.xa,this.root)
if(!(elt instanceof Element))throw Error(`Container xAddr part is not an element: ${m.xa}`)
m.setOld(elt.getAttribute(last))
const sep=last.indexOf(":")
const ns=sep>0?DOM.lookupNamespaceURI(elt,last.substring(0,sep)):null
if(m.val==null){if(ns)elt.removeAttributeNS(ns,last.substring(sep+1))
else elt.removeAttribute(last)}else{if(ns)elt.setAttributeNS(ns,last,m.val)
else elt.setAttribute(last,m.val)}}else{const node=XA.findDomLast(m.xa,this.root)
m.setOld(node.nodeValue)
node.nodeValue=m.val}break}case ResetStatesMsg.type:case InitSlaveRep.type:{const datas=msg.datas
this.resetJml(datas.body)
break}default:if(isMsgUpdater(msg))msg.applyUpdates(this)}if(XmlHouse.DEBUG)console.log(this.toString())}exportFragment(range){const frag=this.document.createDocumentFragment()
XA.cloneFragment(this.root,frag,range)
return frag}exportNodeCustom(xa,filters){const node=XA.findDomLast(xa,this.root)
return node?node.cloneNode(true):null}lookupNamespaceURI(prefix){if(prefix==="xml")return"http://www.w3.org/XML/1998/namespace"
return this._namespaces?this._namespaces[prefix]:null}toJson(json){super.toJson(json)
json.jml=JML.dom2jml(this.root)}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.root=JML.jmlToDom(json.jml)}toString(){return"Body "+this.house+" :: "+DOM.debug(this.root)}}XmlBodyState.type="xmlBody"
House.STATE_FACTORYREG.register(XmlBodyState)
export class XmlRangeState extends State{init(id,metas,xaStart,xaEnd){this.id=id
if(metas)this.metas=metas
this.start=XA.freeze(xaStart)
this.end=XA.freeze(xaEnd)
return this}get isCollapsed(){return XA.isEquals(this.start,this.end)}setRange(start,end,metas){if(start)this.start=XA.freeze(start)
if(end)this.end=XA.freeze(end)
if(metas)this.metas=metas}update(msg){switch(msg.type){case XmlInsertMsg.type:{const m=msg
if(m.killed)return
this.start=XA.freeze(XA.translateInsSeq(this.start,m.xa,JML.lengthJmlOrText(m.jml)))
this.end=XA.freeze(XA.translateInsSeq(this.end,m.xa,JML.lengthJmlOrText(m.jml)))
break}case XmlDeleteMsg.type:{const m=msg
if(m.killed)return
this.start=XA.freeze(XA.translateDelSeq(this.start,m.xa,m.len))
this.end=XA.freeze(XA.translateDelSeq(this.end,m.xa,m.len))
break}case XmlStrMsg.type:{const m=msg
if(m.killed)return
break}case ResetStatesMsg.type:case InitSlaveRep.type:break
default:if(isMsgUpdater(msg))msg.applyUpdates(this)}}toJson(json){super.toJson(json)
json.start=this.start
json.end=this.end}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.start=json.start
this.end=json.end}}XmlRangeState.type="xmlRg"
House.STATE_FACTORYREG.register(XmlRangeState)
export class XmlAddrState extends State{init(id,metas,xAddr){if(id)this.id=id
if(metas)this.metas=metas
this.xAddr=XA.freeze(xAddr)
return this}setAddr(xAddr,metas){if(xAddr)this.xAddr=XA.freeze(xAddr)
if(metas)this.metas=metas}update(msg){switch(msg.type){case XmlInsertMsg.type:{const m=msg
if(m.killed)return
this.xAddr=XA.freeze(XA.translateInsSeq(this.xAddr,m.xa,JML.lengthJmlOrText(m.jml)))
break}case XmlDeleteMsg.type:{const m=msg
if(m.killed)return
this.xAddr=XA.freeze(XA.translateDelSeq(this.xAddr,m.xa,m.len))
break}case XmlStrMsg.type:{const m=msg
if(m.killed)return
break}case ResetStatesMsg.type:case InitSlaveRep.type:break
default:if(isMsgUpdater(msg))msg.applyUpdates(this)}}toJson(json){super.toJson(json)
json.xAddr=this.xAddr}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.xAddr=json.xAddr}}XmlAddrState.type="xmlAddr"
House.STATE_FACTORYREG.register(XmlAddrState)
export function isXmlMsg(msg){return"xa"in msg}export class XmlInsertMsg extends MsgOt{init(xa,jmlOrText){this.xa=XA.freeze(xa)
if(XmlHouse.ASSERT)if(typeof XA.last(xa)==="string")throw Error(`Can not use XmlInsertMsg for setting attribute, use XmlStrMsg instead : ${this.xa}'`)
if(typeof jmlOrText==="string")this.jml=JML.filterForbiddenXmlChars(jmlOrText)
else this.jml=JML.filterForbiddenXmlCharsInJml(jmlOrText)
return this}get isUndoable(){return true}get isBodyMutator(){return true}get killed(){return this.jml==null}kill(){this.jml=null}get len(){return JML.lengthJmlOrText(this.jml)}get end(){return XA.last(this.xa)+this.len}adjust(msg){msg.adjustInsertX(this.xa,this.len)}rewind(msg){msg.rewindInsertX(this.xa,this.len)}forward(msg){msg.forwardInsertX(this.xa,this.len)}cross(msg,invertOfOtId){msg.crossInsertX(this.xa,this.len,invertOfOtId)}get isMergeable(){return typeof this.jml==="string"}mergeWith(nextMsg){if(nextMsg instanceof XmlInsertMsg){if(typeof this.jml==="string"&&typeof nextMsg.jml==="string"){const offset=XA.last(this.xa)
if(typeof offset==="number"&&XA.isInSameSeq(this.xa,nextMsg.xa)&&XA.last(nextMsg.xa)===offset+this.len){this.jml+=nextMsg.jml
return this}}}else if(nextMsg instanceof XmlDeleteMsg){if(typeof this.jml==="string"){const offset=XA.last(this.xa)
const nextOffset=XA.last(nextMsg.xa)
if(typeof offset==="number"&&typeof nextOffset==="number"){if(XA.isInSameSeq(this.xa,nextMsg.xa)&&nextOffset+nextMsg.len===offset+nextMsg.len){const newLen=this.len-nextMsg.len
if(newLen>=0){this.jml=this.jml.substring(0,newLen)
return this}}}}}return null}adjustDeleteX(xa,dLen){if(dLen===0)return
const myDepth=this.xa.length-1
const depthDel=xa.length-1
for(let depth=0,max=Math.min(depthDel,myDepth);depth<=max;depth++){const offset=xa[depth]
const myOffs=this.xa[depth]
if(typeof offset==="string"||typeof myOffs==="string"){if(offset===myOffs){if(depth===depthDel){this.xa=XA.freeze(xa)
this.kill()
return}continue}return}if(offset>myOffs)return
if(depth===depthDel){if(offset-dLen<=myOffs){this.xa=XA.newBd(this.xa).setAtDepth(depth,myOffs+dLen).freeze()}else if(depth===myDepth){if(offset<myOffs){if(myOffs>offset-dLen){this.xa=XA.newBd(this.xa).setAtDepth(depth,myOffs+dLen).freeze()}else{this.xa=XA.freeze(xa)}}}else{this.xa=XA.freeze(xa)
this.kill()}}else{if(offset<myOffs)return}}}crossDeleteX(xa,dLen,fromOtId){if(!this._mem)this._mem=Object.create(null)
this._mem[fromOtId]=this._jumpDeleteX(xa,-dLen,this._mem[fromOtId])}rewindDeleteX(xa,dLen){this.adjustInsertX(xa,-dLen)}forwardDeleteX(xa,dLen){this.adjustDeleteX(xa,dLen)}adjustInsertX(xa,len,biasBefore){if(len===0)return
const myDepth=this.xa.length-1
const depthDel=xa.length-1
for(let depth=0,max=Math.min(depthDel,myDepth);depth<=max;depth++){const offset=xa[depth]
const myOffs=this.xa[depth]
if(typeof offset==="string"||typeof myOffs==="string"){if(offset===myOffs)continue
return}if(offset>myOffs)return
if(depth===depthDel){if(biasBefore?offset<myOffs:offset<=myOffs){this.xa=XA.newBd(this.xa).setAtDepth(depth,myOffs+len).freeze()}}else{if(offset<myOffs)return}}}crossInsertX(xa,len,invertOfOtId){if(this._mem&&invertOfOtId!=null){const deltaArray=this._mem[invertOfOtId]
if(deltaArray!=null){delete this._mem[invertOfOtId]
this._jumpInsertX(xa,len,deltaArray)
return}}this.adjustInsertX(xa,len)}rewindInsertX(xa,len){this.mem=this._jumpDeleteX(xa,len,this.mem)}_jumpDeleteX(xa,len,memArray){const oldXa=this.xa
const oldJml=this.jml
this.adjustDeleteX(xa,-len)
if(this.xa.length<oldXa.length){return pushSubXa(memArray,this.xa,oldXa,oldJml)}else if(XA.isInSameSeq(xa,oldXa)){const oldOffset=XA.last(oldXa)
const insOffs=XA.last(xa)
if(oldOffset>insOffs&&oldOffset<insOffs+len){return pushPosInsInsX(memArray,"i",oldOffset-insOffs)}else{return pushPosInsInsX(memArray,oldOffset>insOffs?"a":"b")}}else{return pushPosInsInsX(memArray,"o")}}forwardInsertX(xa,len){this._jumpInsertX(xa,len,this.mem)}_jumpInsertX(xa,len,deltaArray){const mem=popPosInsInsXOrSubXa(deltaArray)
if(mem.subXa){if(len>0){this.xa=applySubXa(xa,mem.subXa)
this.jml=mem.content}else{if(!this.killed)throw"XmlInsertMsg.forwardInsertX:: this not killed but wrapped insert killed!!!"}mem.content=null}else if(mem.pos==="i"){const depth=xa.length-1
if(len>0)this.xa=XA.newBd(xa).setAtDepth(depth,xa[depth]+mem.startOffset).freeze()}else{if(len>0)this.adjustInsertX(xa,len,mem.pos==="b")}}invert(){return(new XmlDeleteMsg).init(this.xa,this.len).copyStableMetasFrom(this)}inMigration(inMigr){if(!inMigr){delete this.mem
delete this._mem}}assertMsgValidity(house){const doc=house.root
const ctn=XA.findDomContainer(this.xa,doc)
if(!ctn)throw Error(`Container not found node for ${this} in :\n'${DOM.debug(doc)}'`)
const idx=XA.last(this.xa)
if(typeof idx==="string"){throw Error(`Can not use XmlInsertMsg for setting attribute, use XmlStrMsg instead : ${this.xa}'`)}else if(ctn instanceof CharacterData){if(idx<0||idx>ctn.data.length)throw Error(`Insert point in CharacterData node out of bound for ${this} in : '${DOM.debug(doc)}'`)
if(typeof this.jml==="object")throw Error(`Can not insert nodes in CharacterData node for ${this} in :\n'${DOM.debug(doc)}'`)}else if(ctn instanceof Attr){if(idx<0||idx>ctn.value.length)throw Error(`Insert point in attribute out of bound for ${this} in : '${DOM.debug(doc)}'`)
if(typeof this.jml==="object")throw Error(`Can not insert nodes in an attribute for ${this} in :\n'${DOM.debug(doc)}'`)}else{if(idx<0||idx>ctn.childNodes.length)throw Error(`Insert point out of bound for ${this} in : '${DOM.debug(doc)}'`)
if(typeof this.jml==="string")throw Error(`Can not insert string in a non CharacterData node or attribute for ${this} in :\n'${DOM.debug(doc)}'`)}}toJson(json){super.toJson(json)
json.xa=this.xa
json.jml=this.jml
if(this.mem)json.mem=this.mem}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.xa=XA.freeze(json.xa)
this.jml=json.jml
if(json.mem)this.mem=json.mem}cloneFrom(o,purpose){super.cloneFrom(o,purpose)
this.xa=o.xa
this.jml=o.jml
if(o.mem&&purpose!=="hist")this.mem=o.mem.concat()}toString(){const json=this.asJson()
if(this.otId)json.otId=this.otId
if(this._mem)json._mem=this._mem
return JSON.stringify(json)}}XmlInsertMsg.type="xmlIns"
House.MSG_FACTORYREG.register(XmlInsertMsg)
export class XmlDeleteMsg extends MsgOt{init(xa,len){this.xa=XA.freeze(xa)
if(XmlHouse.ASSERT)if(typeof XA.last(xa)==="string")throw Error(`Can not use XmlDeleteMsg for attribute, use XmlStrMsg instead : ${this.xa}'`)
this.len=len
return this}setJml(jml){this.jml=jml
return this}get isUndoable(){return this.jml!=null||this.killed}get isBodyMutator(){return true}get end(){return XA.last(this.xa)+this.len}get killed(){return this.len<=0}kill(){this.xSetLen(0)}xSetLen(len){this.len=len
this.jml=null}adjust(msg){msg.adjustDeleteX(this.xa,-this.len)}rewind(msg){msg.rewindDeleteX(this.xa,-this.len)}forward(msg){msg.forwardDeleteX(this.xa,-this.len)}cross(msg,invertOfOtId){msg.crossDeleteX(this.xa,-this.len,this.otId)}get isMergeable(){return typeof this.jml==="string"}mergeWith(nextMsg){if(this.jml==null)return null
if(nextMsg instanceof XmlDeleteMsg){if(XA.isInSameSeq(this.xa,nextMsg.xa)){if(typeof this.jml==="string"&&typeof nextMsg.jml==="string"){const offset=XA.last(this.xa)
const offsetNext=XA.last(nextMsg.xa)
if(offset===offsetNext){this.jml+=nextMsg.jml
this.len=this.jml.length
return this}if(offsetNext+nextMsg.len===offset){this.xa=nextMsg.xa
this.jml=nextMsg.jml+this.jml
this.len=this.jml.length
return this}}}}return null}adjustDeleteX(xa,dLen){const myDepth=this.xa.length-1
const depthDel=xa.length-1
for(let depth=0,max=Math.min(depthDel,myDepth);depth<=max;depth++){const offset=xa[depth]
const myOffs=this.xa[depth]
if(typeof offset==="string"||typeof myOffs==="string"){if(offset===myOffs){if(depth===depthDel){this.xa=XA.freeze(xa)
this.kill()
return}continue}return}if(depth===depthDel){if(depth===myDepth){const otherEnd=offset-dLen
const myEnd=this.end
if(otherEnd>myOffs&&offset<myEnd){this.xSetLen(Math.max(0,offset-myOffs)+Math.max(0,myEnd-otherEnd))}if(offset<myOffs)this.xa=XA.newBd(this.xa).setAtDepth(depth,Math.max(myOffs+dLen,offset)).freeze()}else{if(offset>myOffs)return
if(offset-dLen<=myOffs){this.xa=XA.newBd(this.xa).setAtDepth(depth,myOffs+dLen).freeze()}else{this.kill()
this.xa=XA.freeze(xa)}}}else{if(offset!=myOffs)return}}}crossDeleteX(xa,dLen,fromOtId){if(!this._mem)this._mem=Object.create(null)
this._mem[fromOtId]=this._jumpDeleteX(xa,-dLen,this._mem[fromOtId])}rewindDeleteX(xa,dLen){this.adjustInsertX(xa,-dLen)}forwardDeleteX(xa,dLen){this.adjustDeleteX(xa,dLen)}adjustInsertX(xa,len){const myDepth=this.xa.length-1
const depthDel=xa.length-1
for(let depth=0,max=Math.min(depthDel,myDepth);depth<=max;depth++){const offset=xa[depth]
const myOffs=this.xa[depth]
if(typeof offset==="string"||typeof myOffs==="string"){if(offset===myOffs)continue
return}if(depth===depthDel){if(depth===myDepth){if(offset<=myOffs){this.xa=XA.newBd(this.xa).setAtDepth(depth,myOffs+len).freeze()}else{if(offset<this.end){this.xSetLen(this.len+len)}}}else{if(offset<=myOffs){this.xa=XA.newBd(this.xa).setAtDepth(depth,myOffs+len).freeze()}}}else{if(offset!==myOffs)return}}}crossInsertX(xa,len,invertOfOtId){if(this._mem&&invertOfOtId!=null){const posArray=this._mem[invertOfOtId]
if(posArray){delete this._mem[invertOfOtId]
this._jumpInsertX(xa,len,posArray)
return}}this.adjustInsertX(xa,len)}rewindInsertX(xa,len){this.mem=this._jumpDeleteX(xa,len,this.mem)}_jumpDeleteX(xa,len,memArray){const oldXa=this.xa
const oldLen=this.len
this.adjustDeleteX(xa,-len)
if(this.xa.length<oldXa.length){return pushSubXa(memArray,this.xa,oldXa,oldLen)}else if(XA.isInSameSeq(this.xa,xa)){const myOffs=XA.last(oldXa)
const myEnd=myOffs+oldLen
const offset=XA.last(xa)
const otherEnd=offset+len
return pushPosInsDelX(memArray,myOffs<offset,myOffs>=otherEnd,myOffs-offset,myEnd<=offset,myEnd>otherEnd,otherEnd-myEnd)}else{return pushDeltaX(memArray,oldXa,this.xa)}}forwardInsertX(xa,len){this._jumpInsertX(xa,len,this.mem)}_jumpInsertX(xa,len,memArray){const mem=popPosInsDelXOrSubXa(memArray)
if(mem.subXa!=null){if(len>0){this.xa=applySubXa(xa,mem.subXa)
this.xSetLen(mem.content)}else{if(!this.killed)throw"XmlDeleteMsg._jumpInsertX:: this not killed but wrapped insert killed!!!"}}else if(mem.delta!=null){if(len!==0&&mem.delta!==0)this.xa=XA.newBd(this.xa).setAtDepth(mem.depth,this.xa[mem.depth]+mem.delta).freeze()}else if(len>0){const depth=xa.length-1
const offset=xa[depth]
if(mem.startAfter){this.xa=XA.newBd(this.xa).setAtDepth(depth,this.xa[depth]+len).freeze()}else if(mem.endBefore){}else if(mem.startBefore){if(mem.endAfter){this.xSetLen(this.len+len)}else{this.xSetLen(len-mem.endOffset+offset-this.xa[depth])}}else{this.xa=XA.newBd(this.xa).setAtDepth(depth,offset+mem.startOffset).freeze()
if(mem.endAfter){this.xSetLen(this.len+len-mem.startOffset)}else{this.xSetLen(this.len+len-mem.startOffset-mem.endOffset)}}}else{}}invert(){if(XmlHouse.ASSERT)if(this.jml==null&&!this.killed)throw Error("jml not available for undo/redo")
return(new XmlInsertMsg).init(this.xa,this.killed?null:this.jml).copyStableMetasFrom(this)}inMigration(inMigr){if(!inMigr){delete this.mem
delete this._mem}}assertMsgValidity(house){const doc=house.root
const ctn=XA.findDomContainer(this.xa,doc)
if(!ctn)throw Error(`Container not found node for ${this} in :\n${DOM.debug(doc)}`)
const idx=XA.last(this.xa)
const len=this.len
if(typeof idx==="string"){throw Error(`Can not use XmlDeleteMsg for attribute, use XmlStrMsg instead : ${this}`)}else if(ctn instanceof CharacterData){if(idx<0||idx>ctn.data.length)throw Error(`Delete point in CharacterData node out of bound for ${this} in : '${DOM.debug(doc)}`)
if(len<0||idx+len>ctn.data.length)throw Error(`Delete length in CharacterData node out of bound for  ${this} in :\n'${DOM.debug(doc)}`)}else if(ctn instanceof Attr){if(idx<0||idx>ctn.value.length)throw Error(`Delete point in attribute out of bound for ${this} in : '${DOM.debug(doc)}'`)
if(len<0||idx+len>ctn.value.length)throw Error(`Delete length in Attribute node out of bound for  ${this} in :\n${DOM.debug(doc)}`)}else{if(idx<0||idx>ctn.childNodes.length)throw Error(`Delete point out of bound for ${this} in :\n${DOM.debug(doc)}`)
if(len<0||idx+len>ctn.childNodes.length)throw Error(`Delete length out of bound for  ${this} in :\n${DOM.debug(doc)}`)}if(this.jml!=null&&JML.lengthJmlOrText(this.jml)!==this.len)throw Error(`msg.len and msg.jml prorpeties are out of sync in ${this}`)}toJson(json){super.toJson(json)
json.xa=this.xa
json.len=this.len
if(this.mem)json.mem=this.mem}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.xa=XA.freeze(json.xa)
this.len=json.len
if(json.mem)this.mem=json.mem}cloneFrom(o,purpose){super.cloneFrom(o,purpose)
this.xa=o.xa
this.len=o.len
if(purpose==="hist"){this.jml=o.jml}else{if(o.mem)this.mem=o.mem.concat()}}toString(){const json=this.asJson()
if(this.jml)json.jml=this.jml
if(this.otId)json.otId=this.otId
if(this._mem)json._mem=this._mem
return JSON.stringify(json)}}XmlDeleteMsg.type="xmlDel"
House.MSG_FACTORYREG.register(XmlDeleteMsg)
export class XmlListMsgOt extends ListMsgOt{adjustInsertX(xa,len){this.msgs.forEach(m=>{m.adjustInsertX(xa,len)})}crossInsertX(xa,len,invertOfOtId){this.msgs.forEach(m=>{m.crossInsertX(xa,len,invertOfOtId)})}rewindInsertX(xa,len){this.msgs.forEach(m=>{m.rewindInsertX(xa,len)})}forwardInsertX(xa,len){this.msgs.forEach(m=>{m.forwardInsertX(xa,len)})}adjustDeleteX(xa,dLen){this.msgs.forEach(m=>{m.adjustDeleteX(xa,dLen)})}crossDeleteX(xa,dLen,fromOtId){this.msgs.forEach(m=>{m.crossDeleteX(xa,dLen,fromOtId)})}rewindDeleteX(xa,dLen){this.msgs.forEach(m=>{m.rewindDeleteX(xa,dLen)})}forwardDeleteX(xa,dLen){this.msgs.forEach(m=>{m.forwardDeleteX(xa,dLen)})}}XmlListMsgOt.type="xmlList"
House.MSG_FACTORYREG.register(XmlListMsgOt)
export class XmlBatch extends XmlListMsgOt{constructor(){super()
this._adjustUntil=0
this.msgs=[]}getState(){if(this._done)return"executed"
if(this.msgs.length===0)return"empty"
return"building"}setSelBefore(start,end){if(this._done)throw Error("Batch already executed.")
this.selBefore=start?(new XmlRangeMsg).init(start,end):null
return this}setSelBeforeSeq(start,len){this.setSelBefore(start)
this.selBefore.end=XA.freeze(XA.incrAtDepth(this.selBefore.addr,-1,len))
return this}setSelAfterRange(val){if(val)this.setSelAfter(val.start,val.end)
else this.setSelAfter(null)
return this}setSelAfterSeq(start,len){this.setSelAfter(start)
this.selAfter.end=XA.freeze(XA.incrAtDepth(this.selAfter.addr,-1,len))
return this}setSelAfter(start,end){if(this._done)throw Error("Batch already executed.")
if(start){this.selAfter=(new XmlRangeMsg).init(start,end)
for(let i=0;i<this._adjustUntil;i++)this.msgs[i].adjust(this.selAfter)}else{this.selAfter=null}return this}setSelAfterSkipAdjust(start,end){if(this._done)throw Error("Batch already executed.")
if(start){this.selAfter=(new XmlRangeMsg).init(start,end)}else{this.selAfter=null}return this}extendSelAfterRange(val){return this.extendSelAfter(val.start,val.end)}extendSelAfterSeq(start,len){return this.extendSelAfter(start,XA.newBd(start).incrAtDepth(-1,len).xa)}extendSelAfter(start,end){if(this._done)throw Error("Batch already executed.")
if(this.selAfter==null){this.setSelAfter(start,end)
return this}if(this._adjustUntil>0){const r=(new XmlRangeMsg).init(start,end)
for(let i=0;i<this._adjustUntil;i++)this.msgs[i].adjust(r)
start=r.addr
end=r.end}if(XA.isBefore(start,this.selAfter.addr)){this.selAfter.addr=XA.freeze(start)}if(end&&XA.isBefore(this.selAfter.end,end)){this.selAfter.end=XA.freeze(end)}return this}needAdjustForNextAdds(){this._adjustUntil=this.msgs.length
return this}add(msg){for(let i=0;i<this._adjustUntil;i++)this.msgs[i].adjust(msg)
this.msgs.push(msg)
if(this.selAfter)msg.adjust(this.selAfter)
return this}addAll(msgs){msgs.forEach(m=>this.add(m))
return this}setDone(){this._done=true}adjustDeleteX(xa,dLen){if(this.selBefore)this.selBefore.adjustDeleteX(xa,dLen)
super.adjustDeleteX(xa,dLen)
if(this.selAfter)this.selAfter.adjustDeleteX(xa,dLen)}crossDeleteX(xa,dLen,fromOtId){if(this.selBefore)this.selBefore.crossDeleteX(xa,dLen,fromOtId)
super.crossDeleteX(xa,dLen,fromOtId)
if(this.selAfter)this.selAfter.crossDeleteX(xa,dLen,fromOtId)}rewindDeleteX(xa,dLen){if(this.selBefore)this.selBefore.rewindDeleteX(xa,dLen)
super.rewindDeleteX(xa,dLen)
if(this.selAfter)this.selAfter.rewindDeleteX(xa,dLen)}forwardDeleteX(xa,dLen){if(this.selBefore)this.selBefore.forwardDeleteX(xa,dLen)
super.forwardDeleteX(xa,dLen)
if(this.selAfter)this.selAfter.forwardDeleteX(xa,dLen)}adjustInsertX(xa,len){if(this.selBefore)this.selBefore.adjustInsertX(xa,len)
super.adjustInsertX(xa,len)
if(this.selAfter)this.selAfter.adjustInsertX(xa,len)}crossInsertX(xa,len,invertOfOtId){if(this.selBefore)this.selBefore.crossInsertX(xa,len,invertOfOtId)
super.crossInsertX(xa,len,invertOfOtId)
if(this.selAfter)this.selAfter.crossInsertX(xa,len,invertOfOtId)}rewindInsertX(xa,len){if(this.selBefore)this.selBefore.rewindInsertX(xa,len)
super.rewindInsertX(xa,len)
if(this.selAfter)this.selAfter.rewindInsertX(xa,len)}forwardInsertX(xa,len){if(this.selBefore)this.selBefore.forwardInsertX(xa,len)
super.forwardInsertX(xa,len)
if(this.selAfter)this.selAfter.forwardInsertX(xa,len)}invert(){const msg=super.invert()
msg.selBefore=this.selAfter
msg.selAfter=this.selBefore
return msg.copyStableMetasFrom(this)}inMigration(inMigr){if(inMigr){if(this.inMigr)return
if(this.selAfter){this.selAfter.inMigration(true)
for(let i=this.msgs.length-1;i>=0;i--){this.msgs[i].rewind(this.selAfter)}}if(this.selBefore)this.selBefore.inMigration(true)}else{if(!this.inMigr)return
if(this.selBefore)this.selBefore.inMigration(false)}super.inMigration(inMigr)
if(!inMigr){if(this.selAfter){for(let i=0,s=this.msgs.length;i<s;i++){this.msgs[i].forward(this.selAfter)}this.selAfter.inMigration(false)}}}toJson(json){super.toJson(json)
if(this.selBefore)json.selBefore=this.selBefore.asJson()
if(this.selAfter)json.selAfter=this.selAfter.asJson()}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
if(json.selBefore)this.selBefore=factoryReg.newFromJson(json.selBefore)
if(json.selAfter)this.selAfter=factoryReg.newFromJson(json.selAfter)}cloneFrom(o,purpose){super.cloneFrom(o,purpose)
this.selBefore=o.selBefore?o.selBefore.clone(purpose):null
this.selAfter=o.selAfter?o.selAfter.clone(purpose):null}}XmlBatch.type="xmlBatch"
House.MSG_FACTORYREG.register(XmlBatch)
export class XmlMoveMsg extends XmlListMsgOt{init(xa,jmlOrText,xaTarget){const len=JML.lengthJmlOrText(jmlOrText)
const target=XA.translateDelSeq(xaTarget,xa,len)
return super.initList([XA.isAttribute(xa)?(new XmlStrMsg).init(xa,null):(new XmlDeleteMsg).init(xa,len),XA.isAttribute(target)?(new XmlStrMsg).init(target,jmlOrText):(new XmlInsertMsg).init(target,jmlOrText)])}}XmlMoveMsg.type="xmlMove"
House.MSG_FACTORYREG.register(XmlMoveMsg)
export class XmlSplitMsg extends XmlListMsgOt{init(xa,lenToRemove,jmlToMove,newCtn,relAddr,jmlToInject){const len=JML.lengthJmlOrText(jmlToMove)
const nextSibling=XA.newBd(xa).up().incrAtDepth(-1,1).freeze()
if(!relAddr)relAddr=XmlSplitMsg._XADDR0
const msgs=[(new XmlInsertMsg).init(nextSibling,newCtn),(new XmlDeleteMsg).init(xa,lenToRemove+len),(new XmlInsertMsg).init(XA.append(nextSibling,...relAddr),jmlToMove)]
if(jmlToInject)msgs.push((new XmlInsertMsg).init(nextSibling,jmlToInject))
return super.initList(msgs)}}XmlSplitMsg.type="xmlSplit"
XmlSplitMsg._XADDR0=Object.freeze([0])
House.MSG_FACTORYREG.register(XmlSplitMsg)
export class XmlStrMsg extends MsgOt{init(xa,val){this.xa=XA.freeze(xa)
this._val=val
if(XmlHouse.ASSERT)if(val==null&&typeof XA.last(xa)!=="string")throw Error("XmlStrMsg can not be used for deleting a node, only attribute")
return this}get val(){return this._val===false?null:this._val}setOld(val){this.old=val
return this}get isUndoable(){return"old"in this}get isBodyMutator(){return true}get killed(){return this._val===false}kill(){this._val=false
this.old=null}adjust(msg){if(this.killed)return
switch(msg.type){case XmlInsertMsg.type:case XmlDeleteMsg.type:if(XA.isAnc(this.xa,msg.xa))msg.kill()
break}}rewind(msg){msg.rewindInsertX(this.xa,this.killed?0:1)}forward(msg){msg.forwardInsertX(this.xa,this.killed?0:1)}cross(msg,invertOfOtId){const len=this.killed?0:1
msg.crossDeleteX(this.xa,-len,this.otId)
msg.crossInsertX(this.xa,len,invertOfOtId)}get isMergeable(){return true}mergeWith(nextMsg){if(nextMsg instanceof XmlStrMsg)return XA.isEquals(this.xa,nextMsg.xa)?nextMsg:null
return null}adjustDeleteX(xa,dLen){const oldXa=this.xa
this.xa=XA.freeze(XA.translateDelSeq(this.xa,xa,-dLen,false))
if(this.xa.length<oldXa.length){this.kill()}}crossDeleteX(xa,dLen,fromOtId){if(!this._mem)this._mem=Object.create(null)
this._mem[fromOtId]=this._jumpDeleteX(xa,-dLen,this._mem[fromOtId])}rewindDeleteX(xa,dLen){this.adjustInsertX(xa,-dLen)}forwardDeleteX(xa,dLen){this.adjustDeleteX(xa,dLen)}adjustInsertX(xa,len){this.xa=XA.freeze(XA.translateInsSeq(this.xa,xa,len))}crossInsertX(xa,len,invertOfOtId){if(this._mem&&invertOfOtId!=null){const memArray=this._mem[invertOfOtId]
if(memArray!=null){delete this._mem[invertOfOtId]
this._jumpInsertX(xa,len,memArray)
return}}this.adjustInsertX(xa,len)}rewindInsertX(xa,len){this.mem=this._jumpDeleteX(xa,len,this.mem)}_jumpDeleteX(xa,len,memArray){const oldXa=this.xa
const oldVal=this.val
this.xa=XA.freeze(XA.translateDelSeq(this.xa,xa,len,false))
if(this.xa.length<oldXa.length){return pushSubXa(memArray,this.xa,oldXa,oldVal)}else{return pushDeltaX(memArray,oldXa,this.xa)}}forwardInsertX(xa,len){this._jumpInsertX(xa,len,this.mem)}_jumpInsertX(xa,len,memArray){const mem=popDeltaXOrSubXa(memArray)
if(mem.subXa){if(len>0){this.xa=applySubXa(xa,mem.subXa)
this._val=mem.content}else{if(!this.killed)throw"XmlStrMsg.forwardInsertX:: this not killed but wrapped insert killed!!!"}mem.content=null}else if(mem.delta!=0){if(len>0)this.xa=XA.newBd(this.xa).setAtDepth(mem.depth,this.xa[mem.depth]+mem.delta).freeze()}}invert(){if(XmlHouse.ASSERT)if(this.old===undefined&&!this.killed)throw Error("old str value not available for invert")
return(new XmlStrMsg).init(this.xa,this.killed?false:this.old).copyStableMetasFrom(this)}inMigration(inMigr){if(!inMigr){delete this.mem
delete this._mem}}toJson(json){super.toJson(json)
json.xa=this.xa
json.val=this._val
if(this.mem)json.mem=this.mem}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.xa=XA.freeze(json.xa)
this._val=json.val
if(json.mem)this.mem=json.mem}cloneFrom(o,purpose){super.cloneFrom(o,purpose)
this.xa=o.xa
this._val=o._val
if(purpose==="hist"){this.old=o.old}else{if(o.mem)this.mem=o.mem.concat()}}assertMsgValidity(house){const doc=house.root
if(!XA.isAttribute(this.xa)){const target=XA.findDomLast(this.xa,doc)
if(!target)throw Error(`Last node not found node for '${this}' in :\n${DOM.debug(doc)}`)
if(!(target instanceof CharacterData))throw Error(`Can not use XmlStrMsg '${this}' on this node: ${DOM.debug(target)}`)}else{const ctn=XA.findDomContainer(this.xa,doc)
if(!ctn)throw Error(`Container not found node for '${this}' in :\n${DOM.debug(doc)}`)}}toString(){const json=this.asJson()
json.old=this.old
json.otId=this.otId
if(this._mem)json._mem=this._mem
return JSON.stringify(json)}}XmlStrMsg.type="xmlStr"
House.MSG_FACTORYREG.register(XmlStrMsg)
export class XmlAddrMsg extends MsgOt{constructor(){super(...arguments)
this.killed=false}init(addr){this.addr=XA.freeze(addr)
return this}kill(){this.killed=true}get isMergeable(){return false}adjustDeleteX(xa,dLen){this.addr=XA.freeze(XA.translateDelSeq(this.addr,xa,-dLen))}crossDeleteX(xa,dLen,fromOtId){if(!this._mem)this._mem=Object.create(null)
this._mem[fromOtId]=this._jumpDeleteX(xa,-dLen,this._mem[fromOtId])}rewindDeleteX(xa,dLen){this.adjustInsertX(xa,-dLen)}forwardDeleteX(xa,dLen){this.adjustDeleteX(xa,dLen)}adjustInsertX(xa,len,biasBefore){this.addr=XA.freeze(XA.translateInsSeq(this.addr,xa,len,true))}crossInsertX(xa,len,invertOfOtId){if(this._mem&&invertOfOtId!=null){const deltaArray=this._mem[invertOfOtId]
if(deltaArray!=null){delete this._mem[invertOfOtId]
this._jumpInsertX(xa,len,deltaArray)
return}}this.adjustInsertX(xa,len)}rewindInsertX(xa,len){this.mem=this._jumpDeleteX(xa,len,this.mem)}_jumpDeleteX(xa,len,memArray){const oldStart=this.addr
this.adjustDeleteX(xa,-len)
return this._pushXaDiff(oldStart,xa,len,this.addr,memArray)}_pushXaDiff(oldXa,xaDel,lenDel,newXa,memArray){if(newXa.length<oldXa.length){return pushSubXa(memArray,newXa,oldXa,null)}else if(XA.isInSameSeq(xaDel,oldXa)){const oldOffset=XA.last(oldXa)
const insOffs=XA.last(xaDel)
if(oldOffset>insOffs&&oldOffset<insOffs+lenDel){return pushPosInsInsX(memArray,"i",oldOffset-insOffs)}else{return pushPosInsInsX(memArray,oldOffset>insOffs?"a":"b")}}else{return pushPosInsInsX(memArray,"o")}}forwardInsertX(xa,len){this._jumpInsertX(xa,len,this.mem)}_jumpInsertX(xa,len,deltaArray){this.addr=this._popXaDiff(this.addr,xa,len,deltaArray)}_popXaDiff(xa,xaIns,len,deltaArray){const mem=popPosInsInsXOrSubXa(deltaArray)
if(mem.subXa){if(len>0){return applySubXa(xaIns,mem.subXa)}}else if(mem.pos==="i"){const depth=xaIns.length-1
if(len>0)return XA.newBd(xaIns).setAtDepth(depth,xaIns[depth]+mem.startOffset).freeze()}else{if(len>0)return XA.freeze(XA.translateInsSeq(xa,xaIns,len,mem.pos==="b"))}return xa}invert(){return(new XmlAddrMsg).init(this.addr).copyStableMetasFrom(this)}inMigration(inMigr){if(!inMigr){delete this.mem
delete this._mem}}toJson(json){super.toJson(json)
json.start=this.addr
if(this.mem)json.mem=this.mem}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.addr=XA.freeze(json.start)
if(json.mem)this.mem=json.mem}cloneFrom(o,purpose){super.cloneFrom(o,purpose)
this.addr=o.addr
if(o.mem&&purpose!=="hist")this.mem=o.mem.concat()}toString(){const json=this.asJson()
if(this.otId)json.otId=this.otId
if(this._mem)json._mem=this._mem
return JSON.stringify(json)}}XmlAddrMsg.type="xmlAddr"
House.MSG_FACTORYREG.register(XmlAddrMsg)
export class XmlRangeMsg extends XmlAddrMsg{get start(){return this.addr}init(start,end){super.init(start)
this.end=XA.freeze(end)
return this}adjustDeleteX(xa,dLen){super.adjustDeleteX(xa,dLen)
if(this.end)this.end=XA.freeze(XA.translateDelSeq(this.end,xa,-dLen))}adjustInsertX(xa,len,biasBefore){super.adjustInsertX(xa,len,biasBefore)
if(this.end)this.end=XA.freeze(XA.translateInsSeq(this.end,xa,len))}_jumpDeleteX(xa,len,memArray){const oldStart=this.addr
const oldEnd=this.end
this.adjustDeleteX(xa,-len)
memArray=this._pushXaDiff(oldStart,xa,len,this.addr,memArray)
if(oldEnd)memArray=this._pushXaDiff(oldEnd,xa,len,this.end,memArray)
return memArray}_jumpInsertX(xa,len,deltaArray){if(this.end)this.end=this._popXaDiff(this.end,xa,len,deltaArray)
super._jumpInsertX(xa,len,deltaArray)}invert(){return(new XmlRangeMsg).init(this.addr,this.end).copyStableMetasFrom(this)}toJson(json){super.toJson(json)
json.end=this.end}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.end=XA.freeze(json.end)}cloneFrom(o,purpose){super.cloneFrom(o,purpose)
this.end=o.end}}XmlRangeMsg.type="xmlRg"
House.MSG_FACTORYREG.register(XmlRangeMsg)
function pushSubXa(array,xaFrom,xaChild,content){const lastFrom=xaFrom.length-1
const subXa=typeof xaChild[lastFrom]==="string"?[]:[xaChild[lastFrom]-xaFrom[lastFrom]]
for(let i=lastFrom+1;i<xaChild.length;i++)subXa.push(xaChild[i])
if(!array)array=[]
array.push(content)
array.push(subXa)
return array}function applySubXa(fromXa,subXa){const fromLast=XA.last(fromXa)
const newXa=XA.newBd(fromXa)
if(typeof fromLast==="string"){newXa.append(subXa[0])}else{newXa.setAtDepth(-1,fromLast+subXa[0])}for(let i=1;i<subXa.length;i++)newXa.append(subXa[i])
return newXa.freeze()}function pushDeltaX(array,xa1,xa2){let depth
let delta=0
for(let dpth=0,max=Math.min(xa1.length,xa2.length)-1;dpth<=max;dpth++){const offs1=xa1[dpth]
const offs2=xa2[dpth]
if(offs1!==offs2){depth=dpth
delta=offs1-offs2
break}}if(!array)array=[]
if(delta>0)array.push(depth)
array.push(delta)
return array}const _popDeltaXSubXaBuffer={}
function popDeltaXOrSubXa(array){const firstVal=array.pop()
if(firstVal===0){_popDeltaXSubXaBuffer.delta=0
_popDeltaXSubXaBuffer.depth=0
_popDeltaXSubXaBuffer.subXa=null}else if(firstVal>0){_popDeltaXSubXaBuffer.delta=firstVal
_popDeltaXSubXaBuffer.depth=array.pop()
_popDeltaXSubXaBuffer.subXa=null}else{_popDeltaXSubXaBuffer.subXa=firstVal
_popDeltaXSubXaBuffer.content=array.pop()}return _popDeltaXSubXaBuffer}function pushPosInsInsX(array,position,startOffset){if(!array)array=[]
if(position==="i")array.push(startOffset)
array.push(position)
return array}const _popPosInsInsXSubXaBuffer={}
function popPosInsInsXOrSubXa(array){const firstVal=array.pop()
if(Array.isArray(firstVal)){_popPosInsInsXSubXaBuffer.subXa=firstVal
_popPosInsInsXSubXaBuffer.content=array.pop()
_popPosInsInsXSubXaBuffer.pos=null}else{_popPosInsInsXSubXaBuffer.pos=firstVal
if(firstVal==="i")_popPosInsInsXSubXaBuffer.startOffset=array.pop()
_popPosInsInsXSubXaBuffer.subXa=null}return _popPosInsInsXSubXaBuffer}function pushPosInsDelX(array,startBefore,startAfter,startOffset,endBefore,endAfter,endOffset){if(!array)array=[]
array.push(startBefore)
array.push(startAfter)
array.push(startOffset)
array.push(endOffset)
array.push(endBefore)
array.push(endAfter)
return array}const _popPosInsDelXSubXaBuffer={}
function popPosInsDelXOrSubXa(array){const firstVal=array.pop()
if(Array.isArray(firstVal)){_popPosInsDelXSubXaBuffer.subXa=firstVal
_popPosInsDelXSubXaBuffer.content=array.pop()}else if(typeof firstVal==="number"){_popPosInsDelXSubXaBuffer.delta=firstVal
_popPosInsDelXSubXaBuffer.depth=firstVal>0?array.pop():0
_popPosInsDelXSubXaBuffer.subXa=null}else{_popPosInsDelXSubXaBuffer.endAfter=firstVal
_popPosInsDelXSubXaBuffer.endBefore=array.pop()
_popPosInsDelXSubXaBuffer.endOffset=array.pop()
_popPosInsDelXSubXaBuffer.startOffset=array.pop()
_popPosInsDelXSubXaBuffer.startAfter=array.pop()
_popPosInsDelXSubXaBuffer.startBefore=array.pop()
_popPosInsDelXSubXaBuffer.subXa=null
_popPosInsDelXSubXaBuffer.delta=null}return _popPosInsDelXSubXaBuffer}export function deleteXmlRange(root,range){const seqs=XA.range2Seqs(range,{excludeAtts:true})
const msgs=[]
for(let i=seqs.length-1;i>=0;i--){const seq=seqs[i]
let offset=XA.last(seq.start)
if(offset===-1){const ctn=XA.findDomContainer(seq.start,root)
if(ctn instanceof Element){const atts=ctn.attributes
for(let ia=0,s=atts.length;ia<s;ia++){const att=atts.item(ia)
msgs.push((new XmlStrMsg).init(XA.setAtDepth(seq.start,-1,att.nodeName),null))}}if(seq.len===0)break
seq.start=XA.setAtDepth(seq.start,-1,0)
offset=0}if(seq.len===Infinity){const ctn=XA.findDomContainer(seq.start,root)
switch(ctn.nodeType){case Node.ELEMENT_NODE:case Node.DOCUMENT_NODE:seq.len=ctn.childNodes.length-offset
break
case Node.ATTRIBUTE_NODE:case Node.TEXT_NODE:case Node.COMMENT_NODE:seq.len=ctn.nodeValue.length-offset
break}}if(seq.len>0)msgs.push((new XmlDeleteMsg).init(seq.start,seq.len))}if(msgs.length>1)return(new XmlListMsgOt).initList(msgs)
if(msgs.length===1)return msgs[0]
return null}export function replaceXmlContent(parent,newContent){const xa=XA.append(XA.from(parent),0)
if(parent.firstChild){return(new XmlListMsgOt).initList([(new XmlDeleteMsg).init(xa,parent.childNodes.length),(new XmlInsertMsg).init(xa,newContent)])}return(new XmlInsertMsg).init(xa,newContent)}export function applyXmlMsgOnElt(msg,eltDepth,elt){switch(msg.type){case XmlInsertMsg.type:{const m=msg
if(m.killed)return
JML.insertJmlInDom(msg.xa.slice(eltDepth),m.jml,elt,true)
break}case XmlDeleteMsg.type:{const m=msg
if(m.killed)return
DOM.deleteSequenceInDom(msg.xa.slice(eltDepth),m.len,elt)
break}case XmlStrMsg.type:{const m=msg
if(m.killed)return
const eltTarget=XA.findDomContainer(msg.xa.slice(eltDepth),elt)
if(!(eltTarget instanceof Element))throw Error(`Container xAddr part is not an element: ${m.xa}`)
const name=XA.last(m.xa)
if(typeof name==="number")throw Error(`Last xAddr part is not an attribute: ${m.xa}`)
const sep=name.indexOf(":")
const ns=sep>0?DOM.lookupNamespaceURI(eltTarget,name.substring(0,sep)):null
if(m.val==null){if(ns)eltTarget.removeAttributeNS(ns,name.substring(sep+1))
else eltTarget.removeAttribute(name)}else{if(ns)eltTarget.setAttributeNS(ns,name,m.val)
else eltTarget.setAttribute(name,m.val)}break}default:throw Error("Unknown msg: "+msg)}}export function applyXmlMsgOnString(msg,str){const offset=XA.last(msg.xa)
if(typeof offset!=="number")throw Error(`Last member of ${msg.xa} must be a number in ${msg}`)
switch(msg.type){case XmlInsertMsg.type:{const m=msg
if(m.killed)return str
if(offset===0){return m.jml+str}else if(offset===str.length){return str+m.jml}return str.substring(0,offset)+m.jml+str.substring(offset)}case XmlDeleteMsg.type:{const m=msg
if(m.killed)return str
return str.substring(0,offset)+str.substring(offset+m.len)}default:throw Error("Unknown msg: "+msg)}}
//# sourceMappingURL=xmlHouse.js.map