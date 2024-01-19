import{EventsMgrProxy}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{DOM,ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{MSGMETA_noCleanup}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/houseOt.js"
import{ErrorMsg,ResetStatesMsg,RoadLocal,RoadNet}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/urban.js"
import{XmlBatch,XmlDeleteMsg,XmlInsertMsg,XmlMoveMsg,XmlSplitMsg,XmlStrMsg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{CommentsState,XmlTypedHouse}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlTypedHouse.js"
import{CARD,EPastePos}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schema.js"
import{SkRuleAttr,SkRuleNode}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaPatterns.js"
var IS_comment=DOM.IS_comment
export function createDocHolderLocal(schema,doc,buildOptions){return new DocHolder(new XmlTypedHouse({id:"@",initialDoc:doc,schema:schema,buildOptions:buildOptions,historyMinEntries:300}))}export function createDocHolderSynchedWith(other){if(other instanceof DocHolder){const config={}
config.schema=other.house.schemaDom.schema
const newDoc=new DocHolder(new XmlTypedHouse(config))
RoadLocal.connectMasterSlave(other.house,{},newDoc.house,{})
return newDoc.house.initFromMaster().then(()=>newDoc)}else{throw Error("todo...")}}export function createDocHolderWs(ws,schema,buildOptions){const newDoc=new DocHolder(new XmlTypedHouse({schema:schema,buildOptions:buildOptions}))
let resolve
let reject
let state="waiting"
new RoadNet(ws,newDoc.house,{roadToMaster:true,onOpen:function(){newDoc.house.initFromMaster().then(()=>{state="opened"
if(resolve)resolve(newDoc)})},onClose:function(){state="failed"
if(reject)reject("WebSocket closed.")}})
return new Promise((res,rej)=>{resolve=res
reject=rej
switch(state){case"opened":res(newDoc)
break
case"failed":rej("Init webSocket failed.")
break}})}export class FetchJml{constructor(xa,length,threshold){this.xa=xa
this.length=length
this.threshold=threshold}}export class FetchAnnots{constructor(xa,length,deep){this.xa=xa
this.length=length
this.deep=deep}}export class FetchExport{constructor(range,format,options){this.range=range
this.format=format
this.options=options}}export class DocHolder{constructor(house){this.house=house
this.door=house.openPublicDoor()}get houseLstn(){if(!this._houseLstn)this._houseLstn=new EventsMgrProxy(this.house.listeners)
return this._houseLstn}isDocHolderSync(){return true}get isAvailable(){return this.house!=null}setSubRoot(xa){this._subRoot=xa?XA.findDomLast(xa,this.house.root):null}getSubRoot(){return this._subRoot?XA.fromNode(this._subRoot):null}cloneDocHolder(){return new DocHolder(this.house)}close(){if(this._houseLstn)this._houseLstn.removeAllListeners()
if(this.house){if(this._search){this.house.updateSkSearch(null,this._search)
this._search=null}if(this._diffSession){this.house.doDiff(null,this._diffSession,[],[])
this._diffSession=null}this.house.closeDoor(this.door)
this.door=null
this.house=null}}getDocument(){return this.house.document}getDocumentForSave(){return this.house.getDocumentForSave()}getContent(xa,length=1){if(!xa){return JML.dom2jml(this.house.root)}else{let node=XA.findDomLast(xa,this.house.root)
const jml=JML.dom2jml(node)
for(let i=1;i<length;i++){node=node.nextSibling
JML.dom2jml(node,jml)}return jml}}getContentThreshold(threshold,xa,length=1){if(!xa){return JML.dom2jmlThreshold(this.house.root,threshold)}else{let node=XA.findDomLast(xa,this.house.root)
const jml=[]
if(node){threshold=JML.domNode2jmlThreshold(node,jml,threshold)
for(let i=1;i<length;i++){node=node.nextSibling
if(threshold>0){threshold=JML.domNode2jmlThreshold(node,jml,threshold)}else{jml.push(JML.computeWeightNode(node))}}}return jml}}getAnnots(xa,length=1,deep=true){var _a,_b
const search=this._search
const filterSearch=search?a=>!a.search||a.search===search:a=>!a.search
const diff=this._diffSession
const filter=diff?a=>filterSearch(a)&&(!a.diffSession||a.diffSession===diff):a=>filterSearch(a)&&!a.diffSession
if(!xa||xa.length===0&&deep){const an=this.house.schemaDom.getAllAnnots(filter);(_a=this.house.getStateById("moan"))===null||_a===void 0?void 0:_a.fillAllAnnots(an)
return an}else{const schemaDom=this.house.schemaDom
let node=XA.findDomLast(xa,this.house.root)
const annots=[]
for(let i=0;node&&i<length;i++){schemaDom.getAnnots(node,deep,filter,annots)
node=node.nextSibling}(_b=this.house.getStateById("moan"))===null||_b===void 0?void 0:_b.fillAnnots(annots,xa,length)
return annots}}exportRange(range,format,formatOptions){return this.house.exportRange(range,format,formatOptions)}exportNodes(xaNodes,filters,format,formatOptions){return this.house.exportNodes(xaNodes,filters,format,formatOptions)}extractRange(range,batch,to){return this.house.schemaDom.exportRange({start:range.start,end:range.end,deletes:batch,forceSplitText:true},to)}getStruct(xa,virtualPath){const node=XA.findDom(xa,this.house.root,virtualPath?xa.length-virtualPath.length:xa.length)
let struct
if(node instanceof Element)struct=this.house.schemaDom.getStruct(node)
else if(node instanceof Attr)return virtualPath?null:this.house.schemaDom.getStructAtt(node)
else if(node instanceof Text)return virtualPath?null:this.house.schemaDom.getStruct(node.parentElement)
else struct=null
if(struct&&virtualPath){for(let i=0;i<virtualPath.length;i++){const n=virtualPath[i]
if(typeof n==="object")struct=struct.contentRule.findRuleNodeFor(n)
else if(n==="@")return struct.contentRule.findRuleAttrFor(xa[xa.length-virtualPath.length+i])
else return struct.contentRule.findRuleNodeFor(n)
if(!struct)return null}}return struct}getAspect(xa,virtualPath,keyAspect,options){const node=XA.findDom(xa,this.house.root,virtualPath?xa.length-virtualPath.length:xa.length)
let eltRule
if(node instanceof Element){eltRule=this.house.schemaDom.getStruct(node)}else if(node instanceof Attr){if(virtualPath)return null
const skNode=this.house.schemaDom.getSkNode(node.ownerElement)
if(!skNode)return null
const rule=skNode.rule.contentRule.findRuleAttrFor(node.nodeName)
return rule?rule.skMeta.getAspect(keyAspect,rule,skNode,options):null}else{return null}const skNode=this.house.schemaDom.getSkNode(node)
if(!skNode)return null
if(eltRule&&virtualPath){for(let i=0;i<virtualPath.length;i++){const n=virtualPath[i]
if(typeof n==="object")eltRule=eltRule.contentRule.findRuleNodeFor(n)
else if(n==="@"){const rule=eltRule.contentRule.findRuleAttrFor(xa[xa.length-virtualPath.length+i])
return rule?rule.skMeta.getAspect(keyAspect,rule,skNode,options):null}if(!eltRule)return null}}return eltRule?eltRule.skMeta.getAspect(keyAspect,eltRule,skNode,options):null}getInsertableStructs(parent,offset1,offset2,attrs,replaceables){const node=XA.findDomLast(parent,this.house.root)
if(!node)return[]
const res=offset1!=null||offset2!=null||attrs?this.house.schemaDom.listInsertableStructs(node,offset1,offset2,attrs):[]
if(replaceables!=null){if(typeof replaceables==="number"){const repl=node.childNodes.item(replaceables)
if(repl)res.push(this.house.schemaDom.listAlternateStructs(node,replaceables,repl.nodeType,repl.nodeName))
else console.log("warning: getInsertableStructs() replaceables out of nodes children.")}else{res.push(this.house.schemaDom.listAlternateStructs(node,offset1||0,ENodeType.attribute,replaceables))}}return res}getInsertableStructsAll(what,parent,virtualPath){var _a,_b,_c
const node=XA.findDom(parent,this.house.root,virtualPath?parent.length-virtualPath.length:parent.length)
if(!node)return[]
if(virtualPath){let parentRule=(_a=this.house.schemaDom.getSkNode(node))===null||_a===void 0?void 0:_a.rule
for(const anc of virtualPath){parentRule=parentRule.contentRule.findRule(rule=>rule.structMatch(ENodeType.element,JML.jmlNode2name(anc)))
if(!parentRule)return[]}const r=[]
if(what!=="atts")r.push((_b=parentRule===null||parentRule===void 0?void 0:parentRule.contentRule)===null||_b===void 0?void 0:_b.findRules(r=>r instanceof SkRuleNode))
if(what!=="children")r.push((_c=parentRule===null||parentRule===void 0?void 0:parentRule.contentRule)===null||_c===void 0?void 0:_c.findRules(r=>r instanceof SkRuleAttr))
return r}else{return this.house.schemaDom.listInsertableStructs(node,what!=="atts"?-1:null,null,what!=="children")}}getAlternateStructs(parent,offset,nodeType,nodeName,virtualPath){const node=XA.findDom(parent,this.house.root,virtualPath?parent.length-virtualPath.length:parent.length)
if(!node)return[]
return this.house.schemaDom.listAlternateStructs(node,offset,nodeType,nodeName,virtualPath)}getInsertableOffset(parent,nodeType,ifExistAndCardN="reject",nodeName){const node=XA.findDomLast(parent,this.house.root)
if(!node)return-2
return this.house.schemaDom.getInsertableOffset(node,nodeType,ifExistAndCardN,nodeName)}getImportPos(insertSeq,content){const node=XA.findDomContainer(insertSeq.start,this.house.root)
if(!node)return EPastePos.replace
const offset=XA.last(insertSeq.start)
if(typeof offset==="string")return EPastePos.replace
return this.house.schemaDom.getPastePos(node,offset,offset+insertSeq.len,content)}getRealCard(xa){const node=XA.findDomLast(xa,this.house.root)
if(node instanceof Element)return this.house.schemaDom.getRealCardElt(node)
if(node instanceof Attr)return this.house.schemaDom.getRealCardAtt(node)
return undefined}isRemovable(xa){const node=XA.findDomLast(xa,this.house.root)
if(node instanceof Element)return this.house.schemaDom.isEltRemovable(node)
if(node instanceof Attr)return CARD.isOptionnal(this.house.schemaDom.getRealCardAtt(node))
return undefined}checkSchemaOrder(xa,eltName1,eltName2){const node=XA.findDomLast(xa,this.house.root)
if(!node)return undefined
return this.house.schemaDom.checkSchemaOrder(node,eltName1,eltName2)}fetchContent(commands){return new Promise((resolve,reject)=>{try{for(let i=0;i<commands.length;i++){const command=commands[i]
if(command instanceof FetchJml){if(command.threshold>0){command.result=this.getContentThreshold(command.threshold,command.xa,command.length)}else{command.result=this.getContent(command.xa,command.length)}}else if(command instanceof FetchAnnots){command.result=this.getAnnots(command.xa,command.length,command.deep)}}resolve(commands)}catch(e){reject(e)}})}isMsgFromUs(msg){return msg.doorId===this.door.id}addMsgListener(listener){this.door.addMsgListener(listener)
return this}removeMsgListener(listener){this.door.removeMsgListener(listener)
return this}getCmtHouse(xAddr){const cmt=XA.findDomLast(xAddr,this.house.root)
return cmt&&IS_comment(cmt)?CommentsState.getCmtHouseFromNode(this.house,cmt):null}newBatch(selBefore){const batch=new DocXmlBatch(this)
if(selBefore)batch.setSelBefore(selBefore.start,selBefore.end)
return batch}willUndo(filter){return this.house.willUndo(this.door,filter)}willRedo(filter){return this.house.willRedo(this.door,filter)}setSkSearch(search){var _a
const newAnnots=[];(_a=this.house)===null||_a===void 0?void 0:_a.updateSkSearch(search,this._search,newAnnots)
this._search=search
return newAnnots}getSkSearch(){return this._search}setDiffSession(diffSession){const annotsToRem=[]
const annotsToAdd=[]
this.house.doDiff(diffSession,this._diffSession,annotsToAdd,annotsToRem)
if(annotsToRem.length>0){this.house.listeners.emit("onSkAnnotsChange",annotsToRem,null)}this._diffSession=diffSession
if(annotsToAdd.length>0){this.house.listeners.emit("onSkAnnotsChange",null,annotsToAdd)}}getDiffSession(){return this._diffSession}doBatch(batch){try{if(this.noCleanup)batch.setMeta(MSGMETA_noCleanup,true)
this.house.executeBatch(batch,this.door)}catch(e){this.door.dispatchMsg((new ErrorMsg).init(e))}}switchHouse(newHouse){const newDoor=newHouse.openPublicDoor()
if(this._houseLstn)this._houseLstn.switchTarget(newHouse.listeners)
newDoor._listeners=this.door._listeners
this.door._listeners=null
if(this._search)this.house.updateSkSearch(null,this._search)
this.house=newHouse
this.door=newDoor
if(this._search)newHouse.updateSkSearch(this._search,null)
this.door.dispatchMsg((new ResetStatesMsg).init({}).setHouseId(this.house))}}class DocXmlBatch extends XmlBatch{constructor(docHolder){super()
this.docHolder=docHolder}get type(){return XmlBatch.type}insertJml(xa,jml){this.add((new XmlInsertMsg).init(xa,jml))
return this}insertText(xa,text){this.add((new XmlInsertMsg).init(xa,text))
return this}splitText(xa,lenToRemove,textToMove,jmlToInsert){this.add((new XmlSplitMsg).init(xa,lenToRemove,textToMove,[""],null,jmlToInsert))
return this}deleteSequence(xa,length){this.add((new XmlDeleteMsg).init(xa,length))
return this}deleteRange(range){if(XA.isAttribute(range.start)){this.setAttr(range.start,null)}else{this.docHolder.house.schemaDom.exportRange({start:range.start,end:range.end,deletes:this},null)}return this}spliceSequence(xa,delLen,jmlOrText){if(delLen>0)this.add((new XmlDeleteMsg).init(xa,delLen))
this.add((new XmlInsertMsg).init(xa,jmlOrText))
return this}moveSequence(xa,jmlOrText,xaTarget){this.add((new XmlMoveMsg).init(xa,jmlOrText,xaTarget))
return this}setText(xa,value){this.add((new XmlStrMsg).init(xa,value))
return this}setAttr(xa,value){this.add((new XmlStrMsg).init(xa,value))
return this}renameOrMoveAttr(xaAttr,xaTarget){const attr=XA.findDomLast(xaAttr,this.docHolder.getDocument())
this.add((new XmlMoveMsg).init(xaAttr,attr.value,xaTarget))
return this}renameElt(xa,newName,fromDoor){const elt=XA.findDomLast(xa,this.docHolder.getDocument())
const jml=JML.dom2jml(elt)
jml[0][""]=newName
this.add((new XmlDeleteMsg).init(xa,1))
this.add((new XmlInsertMsg).init(xa,jml))
return this}doBatch(){this.docHolder.doBatch(this)
return this}}
//# sourceMappingURL=docHolder.js.map