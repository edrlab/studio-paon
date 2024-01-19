import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{ListMsgOt,MsgOt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/houseOt.js"
import{House,InitSlaveRep,InitSlaveReq,ReplyMsg,ResetStatesMsg,State}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/urban.js"
import{isXmlMsg,XmlAddrMsg,XmlBodyState,XmlHouse,XmlListMsgOt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{Schema}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schema.js"
import{SKMETALIB}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMeta.js"
import{getGenericSchema,SkRuleChoice,SkRuleDoc,SkRuleElt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaPatterns.js"
import{SkMatcherEltName}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMatchers.js"
var IS_element=DOM.IS_element
var IS_docOrFragment=DOM.IS_docOrFragment
export class XmlTypedHouse extends XmlHouse{constructor(options={}){options=Object.create(options)
options.xmlBodyState=new XmlTypedState("body")
if(options.schema)options.xmlBodyState.resetSchema(options.schema,options.schemaDomConfig,options.buildOptions)
super(options)}initHouse(options){var _a;(_a=options.customInit)===null||_a===void 0?void 0:_a.call(this)
super.initHouse(options)}get schemaDom(){return this._body.schemaDom}getDocumentForSave(){return this._body.getDocumentForSave()}resetSchema(schema,schemaDomConfig,buildOptions){this._body.resetSchema(schema,schemaDomConfig,buildOptions)}exportFromFragment(frag,format,options){if(format==="text/plain"){const buf=[]
for(let ch=frag.firstChild;ch;ch=ch.nextSibling){if(ch instanceof Text)buf.push(ch.nodeValue)
else{const r=ch.rule
if(r&&r.skMeta)r.skMeta.exportAsText(ch,r,buf)}}return buf.join("")}else if(format==="text/html"){const root=DOM.sharedHtmlDoc().createElement("section")
for(let ch=frag.firstChild;ch;ch=ch.nextSibling){if(ch instanceof Text)root.appendChild(root.ownerDocument.createTextNode(ch.nodeValue))
else{const r=ch.rule
if(r&&r.skMeta)r.skMeta.exportAsHtml(ch,r,root)}}const str=root.innerHTML
return str}else if(format==="multi"){const result={}
for(const k of["text/plain","text/html","application/xml"]){if(k in options)result[k]=this.exportFromFragment(frag,k,options[k])}return result}return super.exportFromFragment(frag,format,options)}exportRange(range,format,formatOptions){let exp
if(formatOptions&&("text/plain"in formatOptions||"text/html"in formatOptions)){JML.doWithCustomClone(()=>{exp=this._body.exportFragment(range)},cloneWithRule.bind(null,this.schemaDom))}else{exp=this._body.exportFragment(range)}return this.exportFromFragment(exp,format,formatOptions)}revalid(revalid){const results=this._body.schemaDom.revalid({shouldRevalid:revalid,genAnnots:true,searches:this._body.searches})
this.dispatchAnnotsFromExec(results)}updateSkSearch(addSearch,remSearch,annotsToAdd=[],annotsToRem=[]){this._body.updateSkSearch(addSearch,remSearch,annotsToAdd,annotsToRem)}dispatchAnnotsFromExec(results){if(results.genAnnots)this.listeners.emit("onSkAnnotsChange",results.annotsToRemove,results.annotsToAdd)}doDiff(addDiff,remDiff,annotsToAdd,annotsToRem){if(!this.diffSessions)this.diffSessions=new Set
if(remDiff){this.diffSessions.delete(remDiff)
this._body.schemaDom.scanSkNodes(skNode=>{skNode.remDiff(remDiff,annotsToRem)})}if(addDiff){addDiff.computeAnnots(this._body.schemaDom,annotsToAdd)
this.diffSessions.add(addDiff)}}xCreateInitSlaveReq(){return this._body.schema?new InitSlaveReq:(new InitSlaveReq).setMeta("withSchema",true)}xApplyMsgOtLocally(msg,correctable,noCleanup){try{if(this._body){msg=this._body.update(msg,correctable,noCleanup)||msg}for(let i=0,e=this._states.length;i<e;i++)this._states[i].update(msg)
if(this.diffSessions)for(let diffS of this.diffSessions){for(let a of diffS.annots)if("adjustBy"in a)a.adjustBy(msg)}}catch(e){console.error("xApplyMsgOtLocally in house failed",this,msg,e)
throw e}return msg}writeFullStates(datas,options){super.writeFullStates(datas,options)
if(options===null||options===void 0?void 0:options.withSchema)datas["schema"]=this._body.schema.toJSON()}}export class XmlTypedState extends XmlBodyState{constructor(){super(...arguments)
this.schemaDomConfig=XmlTypedState.SHEMADOM_CONFIG_DEFAULT
this.msgDeep=0
this.nodesToRefresh=new Set}resetSchema(schema,schemaDomConfig,buildOptions){this.schema=schema
this.namespaces=schema.namespaces
this.buildOptions=buildOptions||{}
if(schemaDomConfig)this.schemaDomConfig=schemaDomConfig
this.buildSchemaDom()
return this}killSchema(){this.schema=null
return this}resetJml(jml){super.resetJml(jml)
this.buildSchemaDom()
return this}resetDom(root){super.resetDom(root)
this.buildSchemaDom()
return this}getDocumentForSave(){const doc=this.document.cloneNode(true)
this.schemaDom.schema.fixDocForExport(doc)
return doc}exportFragment(range){const frag=this.document.createDocumentFragment()
this.schemaDom.exportRange(range,frag)
return frag}exportNodeCustom(xa,filters){const node=XA.findDomLast(xa,this.root)
return node?this.schemaDom.exportNodeCustom(node,filters):null}buildSchemaDom(){if(this.root&&this.schema){if(!IS_docOrFragment(this.root)&&!IS_element(this.root))throw Error("House root node type not allowed: "+DOM.debug(this.root))
this.schemaDom=this.schema.bindToDom(this.root,this.schemaDomConfig)
this.schemaDom.house=this.house
this.buildOptions.searches=this.searches
if(this.house.isMasterRoot()){let results=this.schemaDom.validateDocument(this.buildOptions)
this.house.dispatchAnnotsFromExec(results)
let cycleCount=0
while(results.mutations||results.corrections&&results.corrections.length>0){const msgCorr=(new XmlListMsgOt).initConcurrentList(results.mutations||results.corrections)
msgCorr.setMeta("corr","init")
if(XmlTypedHouse.DEBUG)console.log(results.mutations?"mutations on buildSchemaDom::::":"corrections on buildSchemaDom::::",results.mutations||results.corrections)
this.update(msgCorr)
this.house.clearHistory()
results=this.schemaDom.validateDocument(this.buildOptions)
this.house.dispatchAnnotsFromExec(results)
if(++cycleCount>20){console.error("Infinite cycle detection in schema. corrections:\n"+(results.corrections?JSON.stringify(results.corrections):"")+"\nmutations:\n"+(results.mutations?JSON.stringify(results.mutations):""))
break}}}else{let results=this.schemaDom.validateDocument(this.buildOptions)
this.house.dispatchAnnotsFromExec(results)
if(results.mutations||results.corrections&&results.corrections.length>0){const msgCorr=(new XmlListMsgOt).initConcurrentList(results.mutations||results.corrections)
msgCorr.setMeta("corr","init")
this.house.publicDoor.receiveMsg(msgCorr)}}}}update(msg,autoCorrect,noCleanup){try{switch(msg.type){case ResetStatesMsg.type:case InitSlaveRep.type:{const datas=msg.datas
if(datas.schema){const schema=Schema.buildFromJson(datas.schema)
this.killSchema().resetJml(datas.body).resetSchema(schema)}else{this.resetJml(datas.body)}return null}}if(msg instanceof ListMsgOt){this.msgDeep++}else if(isXmlMsg(msg)){const ctn=XA.findDomContainer(msg.xa,this.root)
if(ctn instanceof Element||ctn instanceof Document)this.nodesToRefresh.add(ctn)
else if(ctn instanceof Text||ctn instanceof Comment)this.nodesToRefresh.add(ctn.parentNode)
else if(ctn instanceof Attr)this.nodesToRefresh.add(ctn.ownerElement)}super.update(msg)
if(msg instanceof ListMsgOt)this.msgDeep--
if(this.msgDeep===0){if(autoCorrect){const finalMsg=(new XmlListMsgOt).initList([msg])
finalMsg.skAnnotsToAdd=[]
finalMsg.skAnnotsToRemove=[]
this.execCorrections(finalMsg,noCleanup)
this.nodesToRefresh.clear()
if(finalMsg.msgs.length>1){return finalMsg.initHouse(msg.slvId,msg.doorId)}if(finalMsg.skAnnotsToAdd.length>0)msg.skAnnotsToAdd=finalMsg.skAnnotsToAdd
if(finalMsg.skAnnotsToRemove.length>0)msg.skAnnotsToRemove=finalMsg.skAnnotsToRemove
return null}else{const execResults=this.schemaDom.revalid({shouldRevalid:this.nodesToRefresh,genAnnots:true,searches:this.searches})
this.nodesToRefresh.clear()
if(execResults.annotsToAdd.length>0)msg.skAnnotsToAdd=execResults.annotsToAdd
if(execResults.annotsToRemove.length>0)msg.skAnnotsToRemove=execResults.annotsToRemove}}return null}catch(e){this.msgDeep=0
this.nodesToRefresh.clear()
throw e}}execCorrections(finalMsg,noCleanup){let execResults=this.schemaDom.revalid({shouldRevalid:this.nodesToRefresh,genAnnots:true,searches:this.searches,autoMutate:true,autoComplete:true,autoNormXml:true,autoCleanup:!noCleanup})
finalMsg.skAnnotsToAdd=execResults.annotsToAdd
finalMsg.skAnnotsToRemove=execResults.annotsToRemove
while(execResults.mutations||execResults.corrections.length>0){const msgCorr=(new XmlListMsgOt).initConcurrentList(execResults.mutations||execResults.corrections)
msgCorr.setMeta("autoCorrect",true)
finalMsg.msgs.push(msgCorr)
if(XmlTypedHouse.DEBUG)console.log(execResults.mutations?"mutations::::":"corrections::::",execResults.mutations||execResults.corrections)
this.msgDeep=1
this.nodesToRefresh.clear()
this.update(msgCorr)
this.msgDeep=0
execResults=this.schemaDom.revalid({shouldRevalid:this.nodesToRefresh,genAnnots:true,autoMutate:true,autoComplete:true,autoNormXml:true,autoCleanup:!noCleanup})
mergeAnnots(finalMsg,execResults.annotsToAdd,execResults.annotsToRemove)}}updateSkSearch(addSearch,remSearch,annotsToAdd,annotsToRem){if(remSearch&&this.searches)this.searches.delete(remSearch)
if(addSearch){if(!this.searches)this.searches=new Set
this.searches.add(addSearch)}this.schemaDom.doSearch(addSearch,remSearch,annotsToAdd,annotsToRem)
if(annotsToAdd.length>0||annotsToRem.length>0){this.house.listeners.emit("onSkAnnotsChange",annotsToRem,annotsToAdd)}}}XmlTypedState.SHEMADOM_CONFIG_DEFAULT=Object.freeze({})
function mergeAnnots(result,add,rem){const add1=result.skAnnotsToAdd
const rem1=result.skAnnotsToRemove
rem.forEach(r=>{const idx=add1.findIndex(a=>a&&r.equals(a))
if(idx>=0){add1[idx]=null}else{rem1.push(r)}})
add1.forEach(a=>{if(a)add.push(a)})
result.skAnnotsToAdd=add}export class CommentsState extends State{constructor(){super(...arguments)
this.id=CommentsState.CMTSTATE_ID
this.map=new Map}static getCmtHouseFromNode(house,node,skNode){let cmtMgr=house.getStateById(CommentsState.CMTSTATE_ID)
if(!cmtMgr){cmtMgr=new CommentsState
house.putState(cmtMgr)}return cmtMgr.getCmtHouseFromNode(node,skNode||house.schemaDom.getSkNode(node.parentNode))}getCommentHouseById(cmtHouseId){var _a
for(const cmtH of this.map.values()){if(((_a=cmtH.house)===null||_a===void 0?void 0:_a.id)===cmtHouseId)return cmtH.house}return null}attachHouse(house){super.attachHouse(house)
if(house==null)this.clearAll()
return this}update(msg){if(msg instanceof MsgOt){if(this.house.isMasterRoot()&&msg.isBodyMutator)for(const scCm of this.map.values()){if(!scCm.node.isConnected){this.deleteComment(scCm)}else if(scCm.node.nodeValue!==scCm.oldValue){this.onEditConflict(scCm)}}}else if(msg.type===ResetStatesMsg.type||msg.type===InitSlaveRep.type){this.clearAll()}}clearAll(){for(const scCmt of this.map.values())scCmt.killHouse()
this.map.clear()}getCmtHouseFromNode(cmNode,skNode){let cmHouseHolder=this.map.get(cmNode)
if(cmHouseHolder===undefined){const doc=isScCommentNode(cmNode.nodeValue)
const cmtType=getScCommentType(doc)
cmHouseHolder=new CommentHouseHolder(cmNode,cmtType,skNode)
if(doc)cmHouseHolder.futureHouse=this.createCmtHouse(cmHouseHolder,doc)
this.map.set(cmNode,cmHouseHolder)}return cmHouseHolder}async createCmtHouse(cmt,doc){const schema=cmt.type==="scCmt"?getGenericSchema():this.createExcludeSchema(cmt)
if(this.house.isMasterRoot()){return new CommentHouse({initialDoc:doc,schema:schema,buildOptions:{autoMutate:true,autoComplete:true,autoNormXml:true,autoNormChars:true},id:this.house.id}).initComment(cmt,this)}else{const createHouse=async()=>{const rep=await this.house.masterDoor.sendRequest((new OpenCommentRoadReq).setHouseId(this.house).init(XA.from(cmt.node)))
if(rep.error)throw Error(rep.error)
if(!cmt.node.isConnected)throw Error("new Comment deconnected")
const cmHouse=new CommentHouse({schema:schema,buildOptions:{autoMutate:true,autoComplete:true},id:rep.cmtHouseId}).initComment(cmt,this)
const roadEnd=this.house.masterDoor.roadEnd.newRoadFor(cmHouse)
roadEnd.door=cmHouse.openDoor(roadEnd,{roadToMaster:true})
return cmHouse.initFromMaster()}
if(this.house.otEngine.isHouseStabilized)return createHouse()
return new Promise((resolve,reject)=>{this.house.otEngine.signalWhenStabilized(async()=>{if(!cmt.node.isConnected)reject("new Comment deconnected")
resolve(await createHouse())})})}}createExcludeSchema(cmt){return new Schema((new SkRuleDoc).init((new SkRuleElt).init(excludeMatcher,"1",(new SkRuleChoice).initCard("*").initSubRules(cmt.skNode.rule.contentRule.findRules(()=>true))).initSkMeta(SKMETALIB.getMetaNode("*"))),{namespaces:Object.assign({sexc:"scenari.eu:exclude:1.0"},cmt.skNode.schemaDom.schema.namespaces)})}deleteComment(cmt){this.map.delete(cmt.node)
cmt.killHouse()}onEditConflict(cmt){const doc=isScCommentNode(cmt.node.nodeValue)
const cmtType=getScCommentType(doc)
if(cmtType===cmt.type){cmt.reloadHouse(doc)}else{console.log("CommentsState.onEditConflict: type changed to:::"+cmtType,cmt)
cmt.killHouse()
const cmHolder=new CommentHouseHolder(cmt.node,cmtType,cmt.skNode)
cmHolder.futureHouse=this.createCmtHouse(cmHolder,doc)
this.map.set(cmHolder.node,cmHolder)}}}CommentsState.type="scCmts"
CommentsState.CMTSTATE_ID="cmt"
const excludeMatcher=new SkMatcherEltName("sexc:exclude")
House.STATE_FACTORYREG.register(CommentsState)
export class CommentHouse extends XmlTypedHouse{initComment(holder,cmtsMgr){this.holder=holder
this.cmtsMgr=cmtsMgr
holder.house=this
return this}reload(doc){if(this.isMasterRoot()){this._body.resetDom(doc)
if(this._doors.length>0){const datas={}
this.writeFullStates(datas)
this.broadcastMsg((new ResetStatesMsg).init(datas))}}}xApplyMsgOtLocally(msg,correctable){const r=super.xApplyMsgOtLocally(msg,correctable)
if(this.isMasterRoot()){this.holder.oldValue=this.holder.node.nodeValue=DOM.escapeComment(DOM.ser(this.getDocumentForSave()))
const parentHouse=this.cmtsMgr.house
parentHouse.setDirty(true)
const revalid=new Set
revalid.add(this.holder.node.parentElement)
parentHouse.revalid(revalid)}return r}killHouse(){super.killHouse()
this.holder=null
this.cmtsMgr=null}}export function isScCommentNode(cmValue){if(/^\s*<comment [^>]*xmlns="scenari\.eu:comment:1.0"/.test(cmValue)||/^\s*<sexc:exclude [^>]*xmlns:sexc="scenari\.eu:exclude:1.0"/.test(cmValue))return DOM.cleanupDom(DOM.parseDomValid(DOM.unescapeComment(cmValue)),true,false,true)
return null}export function getScCommentType(doc){if(!doc)return null
switch(doc.documentElement.localName){case"comment":return"scCmt"
case"exclude":return"scExcl"}return null}class OpenCommentRoadReq extends XmlAddrMsg{}OpenCommentRoadReq.type="openCommentRoadReq"
House.MSG_FACTORYREG.register(OpenCommentRoadReq)
export class OpenCommentRoadRep extends ReplyMsg{toJson(json){super.toJson(json)
json.cmtHouseId=this.cmtHouseId}fromJson(json,factoryReg){super.fromJson(json,factoryReg)
this.cmtHouseId=json.cmtHouseId}cloneFrom(o,purpose){super.cloneFrom(o,purpose)
this.cmtHouseId=o.cmtHouseId}}OpenCommentRoadRep.type="openCommentRoadRep"
House.MSG_FACTORYREG.register(OpenCommentRoadRep)
export class CommentHouseHolder{constructor(node,type,skNode){this.skNode=skNode
this.node=node
this.oldValue=node.nodeValue
this.type=type}killHouse(){if(this.house)this.house.killHouse()
else if(this.futureHouse)this.futureHouse.then(()=>{this.house.killHouse()})
this.house=null
this.futureHouse=null}reloadHouse(doc){if(this.house)this.house.reload(doc)
else if(this.futureHouse)this.futureHouse.then(()=>{this.house.reload(doc)})}}function cloneWithRule(shemaDom,node,deep){const cl=node.cloneNode(false)
const skNode=shemaDom.getSkNode(node)
if(skNode)cl.rule=skNode.rule
if(deep)for(let ch=node.firstChild;ch;ch=ch.nextSibling)cl.appendChild(cloneWithRule(shemaDom,ch,true))
return cl}
//# sourceMappingURL=xmlTypedHouse.js.map