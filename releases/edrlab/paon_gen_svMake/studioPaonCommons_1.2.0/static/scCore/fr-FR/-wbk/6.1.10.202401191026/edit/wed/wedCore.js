import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,ENodeType,EUnknownNodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
export class WedModel{constructor(){this.jsLibs={}
this.reg=new REG.Reg
this.themes=[]
this.eltModels=new Map
this.attrModels=new Map}addNodeModel(model,priority=0,selector){const newModel=new ModelRef(model,priority,selector)
switch(model.nodeType){case ENodeType.element:if(model.nodeName)this.eltModels.set(model.bindKey,WedModel.injectModel(newModel,this.eltModels.get(model.bindKey)))
else this.genericEltModel=WedModel.injectModel(newModel,this.genericEltModel)
break
case ENodeType.attribute:if(model.nodeName)this.attrModels.set(model.bindKey,WedModel.injectModel(newModel,this.attrModels.get(model.bindKey)))
else this.genericAttrModel=WedModel.injectModel(newModel,this.genericAttrModel)
break
case ENodeType.document:case ENodeType.documentFragment:this.docModel=WedModel.injectModel(newModel,this.docModel)
break
case ENodeType.text:this.textModel=WedModel.injectModel(newModel,this.textModel)
break
case ENodeType.comment:this.commentModel=WedModel.injectModel(newModel,this.commentModel)
break
default:throw Error(`NodeType unknown : ${model.nodeType}`)}}findModelForDocument(modes,ctx,selector,params){return WedModel.findModel(this.docModel,modes,null,ctx,selector,params)}findDisplayForNode(jmlNode,childrenElt){if(childrenElt.wedDefaultDisplay){if(WED.isDisplayMatchNode(childrenElt.wedDefaultDisplay,jmlNode))return childrenElt.wedDefaultDisplay}if(childrenElt.wedDisplays){const displays=childrenElt.wedDisplays
for(let i=0;i<displays.length;i++){const display=displays[i]
if(display.wedletModel){if(WED.isModelMatchNode(display.wedletModel,jmlNode))return display}else{if(WED.isDisplayMatchNode(display,jmlNode))return display}}}return null}findModelForNodeFromCh(jmlNode,ctx,chidrenElt){return this.findModelForNode(jmlNode,chidrenElt.wedModesNodes,chidrenElt.wedVariants,ctx,chidrenElt.wedSelector,chidrenElt.wedPreferedModels,chidrenElt.wedParams)}findModelForNode(jmlNode,modes,variants,ctx,selector,preferedModels,params){if(preferedModels){for(let i=0;i<preferedModels.length;i++){const model=preferedModels[i]
if(WED.isModelMatchNode(model,jmlNode)){if(!selector||selector(model,jmlNode,ctx,params)>WedModel.SELECTOR_REJECT)return model}}}if(typeof jmlNode==="string")return WedModel.findModel(this.textModel,WED.getModesForText(modes),jmlNode,ctx,selector,params)
const name=jmlNode[""]
if(name===JML.COMMENT)return WedModel.findModel(this.commentModel,WED.getModesForComment(modes),jmlNode,ctx,selector,params)
const md=WED.getModesForName(modes,name)
return WedModel.findModel(this.eltModels.get(variants?variants[name]||name:name),md,jmlNode,ctx,selector,params)||WedModel.findModel(this.genericEltModel,md,jmlNode,ctx,selector,params)}findDisplayForAttr(attrName,childrenElt){if(childrenElt.wedDefaultDisplay){if(WED.isDisplayMatchAttr(childrenElt.wedDefaultDisplay,attrName))return childrenElt.wedDefaultDisplay}if(childrenElt.wedDisplays){const displays=childrenElt.wedDisplays
for(let i=0;i<displays.length;i++){const display=displays[i]
if(display.wedletModel){if(WED.isModelMatchAttr(display.wedletModel,attrName))return display}else{if(WED.isDisplayMatchAttr(display,attrName))return display}}}return null}findModelForAttr(attrName,attrValue,modes,variants,ctx,selector,preferedModels,params){if(preferedModels){for(let i=0;i<preferedModels.length;i++){const model=preferedModels[i]
if(WED.isModelMatchAttr(model,attrName)){if(!selector||selector(model,attrValue,ctx,params)>WedModel.SELECTOR_REJECT)return model}}}const md=WED.getModesForName(modes,attrName)
return WedModel.findModel(this.attrModels.get(variants?variants[attrName]||attrName:attrName),md,attrValue,ctx,selector,params)||WedModel.findModel(this.genericAttrModel,md,attrValue,ctx,selector,params)}findModelForVirtual(nodeType,nodeName,modes,variants,ctx,selector,preferedModels,params){if(nodeType===ENodeType.attribute){if(preferedModels){for(let i=0;i<preferedModels.length;i++){const model=preferedModels[i]
if(WED.isModelMatchAttr(model,nodeName)){if(!selector||selector(model,null,ctx,params)>WedModel.SELECTOR_REJECT)return model}}}const md=WED.getModesForName(modes,nodeName)
if(nodeName)return WedModel.findModel(this.attrModels.get(variants?variants[nodeName]||nodeName:nodeName),md,null,ctx,selector,params)||WedModel.findModel(this.genericAttrModel,md,null,ctx,selector,params)
return WedModel.findModel(this.genericAttrModel,md,null,ctx,selector,params)}else{if(preferedModels){for(let i=0;i<preferedModels.length;i++){const model=preferedModels[i]
if(model.nodeType===nodeType&&(!model.nodeName||model.nodeName===nodeName)){if(!selector||selector(model,null,ctx,params)>WedModel.SELECTOR_REJECT)return model}}}switch(nodeType){case ENodeType.element:if(!nodeName){const docH=ctx.wedMgr.docHolder
if(docH){const skElt=docH.getStruct(ctx.wedAnchor)
if(skElt){const eltDef=skElt.contentRule.findRule(r=>r.structType===ENodeType.element)
if(eltDef)nodeName=eltDef.matcher.startName}}}const md=WED.getModesForName(modes,nodeName)
if(nodeName)return WedModel.findModel(this.eltModels.get(variants?variants[nodeName]||nodeName:nodeName),md,null,ctx,selector,params)||WedModel.findModel(this.genericEltModel,md,null,ctx,selector,params)
return WedModel.findModel(this.genericEltModel,md,null,ctx,selector,params)
case ENodeType.text:return WedModel.findModel(this.textModel,WED.getModesForText(modes),null,ctx,selector,params)
case ENodeType.comment:return WedModel.findModel(this.commentModel,WED.getModesForComment(modes),null,ctx,selector,params)
default:throw Error(`Unknown nodeType ${nodeType} in findModelForVirtual.`)}}}importFrom(wed){this.docModel=WedModel.importModel(this.docModel,wed.docModel)
this.genericEltModel=WedModel.importModel(this.genericEltModel,wed.genericEltModel)
this.genericAttrModel=WedModel.importModel(this.genericAttrModel,wed.genericAttrModel)
this.textModel=WedModel.importModel(this.textModel,wed.textModel)
this.commentModel=WedModel.importModel(this.commentModel,wed.commentModel)
for(const[bindKey,otherModel]of wed.eltModels){this.eltModels.set(bindKey,WedModel.importModel(otherModel,this.eltModels.get(bindKey)))}for(const[bindKey,otherModel]of wed.attrModels){this.attrModels.set(bindKey,WedModel.importModel(otherModel,this.attrModels.get(bindKey)))}for(const k in wed.jsLibs){if(!this.jsLibs[k])this.jsLibs[k]=wed.jsLibs[k]}this.reg.copyFrom(wed.reg)}static injectModel(newModel,rootModel){if(rootModel==null)return newModel
if(rootModel.priority<=newModel.priority){newModel.next=rootModel
return newModel}let prevModel=rootModel
while(prevModel.next&&prevModel.next.priority>newModel.priority)prevModel=prevModel.next
const nextModel=prevModel.next
prevModel.next=newModel
newModel.next=nextModel
return rootModel}static findModel(rootModel,modes,node,ctx,selector,params){if(rootModel==null)return null
for(let i=0;i<modes.length;i++){const result=WedModel.findModelByMode(modes[i],rootModel,node,ctx,selector,params)
if(result)return result}return null}static findModelByMode(mode,rootModel,node,ctx,selector,params){while(rootModel&&rootModel.model.modes.indexOf(mode)<0)rootModel=rootModel.next
if(!rootModel)return null
if(selector==null&&rootModel.selector==null)return rootModel.model
let bestModelH=rootModel
let bestScore=WedModel.computeScore(node,ctx,bestModelH,selector,params)
if(bestScore===WedModel.SELECTOR_PERFECT_MATCH)return bestModelH.model
let modelH=rootModel.next
for(;;){while(modelH&&modelH.model.modes.indexOf(mode)<0)modelH=modelH.next
if(!modelH)break
const newScore=WedModel.computeScore(node,ctx,modelH,selector)
if(newScore>bestScore){if(newScore===WedModel.SELECTOR_PERFECT_MATCH)return modelH.model
bestScore=newScore
bestModelH=modelH}modelH=modelH.next}return bestScore!=WedModel.SELECTOR_REJECT?bestModelH.model:null}static computeScore(node,ctx,modelH,callerSelector,params){let score=WedModel.SELECTOR_PERFECT_MATCH
if(callerSelector){score=callerSelector(modelH.model,node,ctx,params)}if(modelH.selector){score=Math.min(score,modelH.selector(modelH.model,node,ctx,params))}return score}static importModel(root,other){while(other){root=WedModel.injectModel(other.clone(),root)
other=other.next}return root}}WedModel.SELECTOR_REJECT=0
WedModel.SELECTOR_PERFECT_MATCH=100
export function isWedSlotElt(elt){return DOM.IS_element(elt)&&elt.localName==="slot"&&elt.namespaceURI===WED.WED_NS}export const isWedChildrenElt=function(elt){return elt&&DOM.IS_element(elt)&&elt.localName==="children"&&elt.namespaceURI===WED.WED_NS}
class WedDefaultDisplay{}export function isWedDefaultDisplay(display){return display instanceof WedDefaultDisplay}function buildDefaultDisplay(children){const defaultDisplay=children.getAttribute("defaultDisplay")
if(!defaultDisplay)return null
const result=new WedDefaultDisplay
if(defaultDisplay==="*"){result.wedNodeType=ENodeType.element}else if(defaultDisplay==="@"){result.wedNodeType=Node.ATTRIBUTE_NODE}else if(defaultDisplay==="#"){result.wedNodeType=ENodeType.text}else if(defaultDisplay.charAt(0)==="@"){result.wedNodeType=Node.ATTRIBUTE_NODE
result.wedNodeName=defaultDisplay.substr(1)}else{result.wedNodeType=ENodeType.element
result.wedNodeName=defaultDisplay}return result}export var WED;(function(WED){WED.WED_NS="scenari.eu:wed"
function loadWedModel(endPoint,resolver){const result=_cache.get(endPoint.url)
if(result)return result
const promise=endPoint.fetchDom(null).then(doc=>buildWedModel(doc,resolver))
_cache.set(endPoint.url,promise)
return promise}WED.loadWedModel=loadWedModel
function registerWedletModel(name,ctor){_registry.set(name,ctor)}WED.registerWedletModel=registerWedletModel
function isModelMatchNode(model,node){if(model.nodeType===EUnknownNodeType.unknown)return true
if(model.nodeType!==JML.jmlNode2nodeType(node))return false
if(model.nodeName)return node[""]===model.nodeName
return true}WED.isModelMatchNode=isModelMatchNode
function isModelMatchAttr(model,attrName){if(model.nodeType!==ENodeType.attribute)return false
if(model.nodeName)return attrName===model.nodeName
return true}WED.isModelMatchAttr=isModelMatchAttr
function isDisplayMatchAttr(display,attrName){if(display.wedNodeType!==ENodeType.attribute)return false
if(display.wedNodeName)return attrName===display.wedNodeName
return true}WED.isDisplayMatchAttr=isDisplayMatchAttr
function isDisplayMatchNode(display,node){if(display.wedNodeType!==JML.jmlNode2nodeType(node))return false
if(display.wedNodeName)return node[""]===display.wedNodeName
return true}WED.isDisplayMatchNode=isDisplayMatchNode
WED.SORT_ChildrenElts=function(o1,o2){return o2.wedMatcher.priorityMatcher-o1.wedMatcher.priorityMatcher}
WED.DEFAULT_MODES=Object.freeze([""])
async function buildWedModel(doc,resolver){const wed=new WedModel
let depWeds
let depLibs
const rootElt=importAndCleanupConfig(doc.documentElement,resolver)
for(let elt=rootElt.firstElementChild;elt;elt=elt.nextElementSibling){if(elt.namespaceURI===WED.WED_NS){switch(elt.localName){case"display":case"bind":{const childrenElts=elt.querySelectorAll("children")
for(let i=0;i<childrenElts.length;i++){const childrenElt=childrenElts[i]
const parent=childrenElt.parentNode
if(isWedSlotElt(parent)){if(!parent.wedSlotName){parent.wedSlotName=i.toString()
parent.wedChildrenElts=[]}childrenElt.wedSlotName=parent.wedSlotName
parent.wedChildrenElts.push(childrenElt)}else{childrenElt.wedSlotName=i.toString()}childrenElt.wedMatcher=buildMatcherVariants(childrenElt.getAttribute("select"),childrenElt)
childrenElt.wedMatchStrict=childrenElt.hasAttribute("strict")
childrenElt.wedDefaultDisplay=buildDefaultDisplay(childrenElt)
const params=childrenElt.getAttribute("params")
if(params)childrenElt.wedParams=JSON.parse(params)}for(let i=0;i<childrenElts.length;i++){const childrenElt=childrenElts[i]
for(let ch=childrenElt.firstElementChild;ch;ch=ch.nextElementSibling){if(ch.namespaceURI!==WED.WED_NS)continue
switch(ch.localName){case"display":const displayElt=ch
if(!childrenElt.wedDisplays)childrenElt.wedDisplays=[displayElt]
else childrenElt.wedDisplays.push(displayElt)
if(ch.hasAttribute("wedlet")){displayElt.wedletModel=buildBind(ch)
if(!childrenElt.wedPreferedModels)childrenElt.wedPreferedModels=[displayElt.wedletModel]
else childrenElt.wedPreferedModels.push(displayElt.wedletModel)}else{[displayElt.wedNodeType,displayElt.wedNodeName]=parseNodeDef(ch)
initModesForChild(childrenElt,displayElt.wedNodeType,displayElt.wedNodeName,ch)}break
case"bind":if(ch.hasAttribute("wedlet")){if(!childrenElt.wedPreferedModels)childrenElt.wedPreferedModels=[]
childrenElt.wedPreferedModels.push(buildBind(ch))}else{const[nodeType,nodeName]=parseNodeDef(ch)
initModesForChild(childrenElt,nodeType,nodeName,ch)}break
default:throw Error(`Unknown child tag ${ch.nodeName} in ${DOM.ser(childrenElt)} in ${doc.baseEndPoint}`)}}const defaultModes=parseModes(childrenElt.getAttribute("callModes"))
if(defaultModes!==null){if(childrenElt.wedModesNodes){childrenElt.wedModesNodes[""]=defaultModes
if(childrenElt.wedModesAtts)childrenElt.wedModesAtts[""]=defaultModes
else childrenElt.wedModesAtts={"":defaultModes}}else{childrenElt.wedModesNodes={"":defaultModes}
if(childrenElt.wedModesAtts)childrenElt.wedModesAtts[""]=defaultModes
else childrenElt.wedModesAtts=childrenElt.wedModesNodes}}}const model=buildBind(elt)
model.modes=parseModes(elt.getAttribute("modes"))||WED.DEFAULT_MODES
const selector=elt.getAttribute("selector")
let selectorFn=selector?new Function("wedletModel","node","ctx","params",selector):null
const isParam=elt.getAttribute("isParam")
if(isParam)selectorFn=combineSelectors(selectorFn,(wedModel,node,ctx,params)=>params&&params[isParam]?WedModel.SELECTOR_PERFECT_MATCH:WedModel.SELECTOR_REJECT)
wed.addNodeModel(model,parseInt(elt.getAttribute("priority"),10)||0,selectorFn)
break}case"import":{if(!depWeds)depWeds=[]
depWeds.push(loadWedModel(doc.baseEndPoint.resolve(elt.getAttribute("src")),resolver))
break}case"jslib":{if(!depLibs)depLibs=[]
const jsEndPoint=doc.baseEndPoint.resolve(elt.getAttribute("src"))
depLibs.push(jsEndPoint.importJs().then(mod=>{const key=elt.getAttribute("key")
if(key)wed.jsLibs[key]=mod
if(mod.jslibAsyncInit)return mod.jslibAsyncInit(jsEndPoint,elt,wed.reg)}))
break}case"jslibSync":{const jsEndPoint=doc.baseEndPoint.resolve(elt.getAttribute("src"))
const mod=await jsEndPoint.importJs()
const key=elt.getAttribute("key")
if(key)wed.jsLibs[key]=mod
if(mod.jslibAsyncInit){if(!depLibs)depLibs=[]
depLibs.push(mod.jslibAsyncInit(jsEndPoint,elt,wed.reg))}break}case"theme":{const regexp=elt.getAttribute("themeContextRegexp")
const dict=Object.create(null)
for(let r of elt.textContent.split(";")){const sep=r.indexOf(":")
if(sep>0)dict[r.substring(0,sep).trim()]=r.substring(sep+1).trim()}wed.themes.push({themeContext:regexp?new RegExp(regexp):null,themeVars:dict})
break}case"shadowSkin":{if(elt.hasAttribute("overlay")){wed.reg.overlaySkin(elt.getAttribute("tag"),parseFloat(elt.getAttribute("order"))||REG.LEVELAUTH_MODEL,elt.textContent)}else{wed.reg.registerSkin(elt.getAttribute("tag"),REG.LEVELAUTH_MODEL,elt.textContent)}break}default:throw Error(`Unknown wed tag '${DOM.debug(elt)}' in ${doc.baseEndPoint&&doc.baseEndPoint.url}`)}}}if(depLibs)await Promise.all(depLibs)
if(depWeds)await Promise.all(depWeds).then(weds=>{weds.forEach(w=>{wed.importFrom(w)})})
return wed}function importAndCleanupConfig(elt,resolver){let ids
let toClone
const tw=elt.ownerDocument.createNodeIterator(elt)
let previous=tw.nextNode()
let next
while((next=tw.nextNode())||previous){if(previous instanceof Element){if(previous.localName==="clone"&&previous.namespaceURI===WED.WED_NS){if(!toClone)toClone=[previous]
else toClone.push(previous)}else{const id=previous.getAttributeNS(WED.WED_NS,"id")
if(id){if(!ids)ids={}
ids[id]=previous
previous.removeAttributeNS(WED.WED_NS,"id")}if(resolver!=null&&previous.namespaceURI!==WED.WED_NS){let path=previous.getAttribute("src")
if(path)previous.setAttribute("src",resolver.resolvePath(path))
path=previous.getAttribute("href")
if(path)previous.setAttribute("href",resolver.resolvePath(path))
path=previous.getAttribute("icon")
if(path)previous.setAttribute("icon",resolver.resolvePath(path))
const text=previous.getAttribute("style")
if(text)previous.setAttribute("style",resolver.resolveInText(text))}}}else if(previous.nodeType===ENodeType.text){if(DOM.WHITESPACES.test(previous.nodeValue)){previous.parentNode.removeChild(previous)}else if(resolver!=null){const parentNm=previous.parentElement.localName
if(parentNm==="script"||parentNm==="style"||parentNm==="shadowSkin"||parentNm==="theme"){previous.nodeValue=resolver.resolveInText(previous.nodeValue)}}}else{previous.parentNode.removeChild(previous)}previous=next}if(toClone){toClone.forEach(elt=>{const target=ids?ids[elt.getAttribute("refId")]:null
if(!target)throw Error(`Target in <wed:clone refId="${elt.getAttribute("refId")}"/> does not exist.`)
elt.cloneTarget=target
elt.cloneDeep=DOM.computeDepth(target)})
toClone.sort((e1,e2)=>e1.cloneDeep-e2.cloneDeep)
toClone.forEach(elt=>{elt.parentNode.insertBefore(elt.cloneTarget.cloneNode(true),elt)
elt.remove()})}const imported=document.adoptNode(elt)
document.head.appendChild(document.createElement("template")).content.appendChild(imported)
return imported}function initModesForChild(childrenElt,nodeType,nodeName,ch){const modes=parseModes(ch.getAttribute("callModes"))
if(modes){if(nodeType===ENodeType.attribute){if(!childrenElt.wedModesAtts)childrenElt.wedModesAtts={}
childrenElt.wedModesAtts[nodeName||"*"]=modes}else{if(!nodeName)nodeName=nodeType==ENodeType.element?"*":nodeType==ENodeType.comment?"!":nodeType==ENodeType.text?"#":""
if(!childrenElt.wedModesNodes)childrenElt.wedModesNodes={}
childrenElt.wedModesNodes[nodeName]=modes}}}function parseModes(modes){if(!modes)return null
const array=modes.split(" ")
const idx=array.indexOf(".")
if(idx>=0)array[idx]=""
return array}WED.parseModes=parseModes
function getModesForComment(wedModes){if(!wedModes)return WED.DEFAULT_MODES
return wedModes["!"]||wedModes[""]||WED.DEFAULT_MODES}WED.getModesForComment=getModesForComment
function getModesForText(wedModes){if(!wedModes)return WED.DEFAULT_MODES
return wedModes["#"]||wedModes[""]||WED.DEFAULT_MODES}WED.getModesForText=getModesForText
function getModesForName(wedModes,nodeName){if(!wedModes)return WED.DEFAULT_MODES
return wedModes[nodeName||"*"]||wedModes["*"]||wedModes[""]||WED.DEFAULT_MODES}WED.getModesForName=getModesForName
const _cache=new Map
const _registry=new Map
function newWedletModel(wedletName){const ctor=_registry.get(wedletName)
if(!ctor)throw Error(`Wedlet name unknown: ${wedletName}`)
return new ctor}WED.newWedletModel=newWedletModel
function buildBind(elt,defaultWedlet){const model=newWedletModel(elt.getAttribute("wedlet")||defaultWedlet);[model.nodeType,model.nodeName,model.bindKey]=parseNodeDef(elt)
model.perms=parsePerms(elt)
model.initModel(elt)
return model}WED.buildBind=buildBind
function parseNodeDef(elt){let name=elt.getAttribute("eltName")
if(name!==null){_parseNodeDefResult[0]=ENodeType.element
_parseNodeDefResult[1]=name
const variant=elt.getAttribute("variant")
_parseNodeDefResult[2]=variant?name+"|"+variant:name}else{name=elt.getAttribute("attName")
if(name){_parseNodeDefResult[0]=ENodeType.attribute
_parseNodeDefResult[1]=name
const variant=elt.getAttribute("variant")
_parseNodeDefResult[2]=variant?name+"|"+variant:name}else{_parseNodeDefResult[1]=null
_parseNodeDefResult[2]=null
switch(elt.getAttribute("nodeType")){case"element":_parseNodeDefResult[0]=ENodeType.element
break
case"attribute":_parseNodeDefResult[0]=ENodeType.attribute
break
case"text":_parseNodeDefResult[0]=ENodeType.text
break
case"comment":_parseNodeDefResult[0]=ENodeType.comment
break
case"document":_parseNodeDefResult[0]=ENodeType.document
break
case"all":_parseNodeDefResult[0]=EUnknownNodeType.unknown
break
default:throw Error(`Wed nodeType unknown ${DOM.ser(elt)}`)}}}return _parseNodeDefResult}const _parseNodeDefResult=[0,null,null]
function parsePerms(elt){const read=elt.getAttribute("readPerms")
const write=elt.getAttribute("writePerms")
const localWrite=elt.getAttribute("localWritePerms")
if(read||write||localWrite){const p=Object.create(null)
if(read)p.cascadRead=read.indexOf(" ")>0?read.split(" "):read
if(write){if(write==="#yes")p.cascadWrite=true
else if(write==="#no")p.cascadWrite=false
else p.cascadWrite=write.indexOf(" ")>0?write.split(" "):write
p.localWrite=p.cascadWrite}if(localWrite){if(localWrite==="#yes")p.localWrite=true
else if(localWrite==="#no")p.localWrite=false
else p.localWrite=localWrite.indexOf(" ")>0?localWrite.split(" "):localWrite}return p}return null}WED.parsePerms=parsePerms
function buildMatcherVariants(matchExp,childrenElt){if(!matchExp)return MATCH_ALL
if(matchExp==="* # !")return MATCH_ALL_NOATTR
const parts=matchExp.split(" ")
if(parts.length===1){return buildSingleMatcher(parts[0],childrenElt)}else{let prioity=Infinity
const matchers=parts.map(part=>{const m=buildSingleMatcher(part,childrenElt)
prioity=Math.min(prioity,m.priorityMatcher)
return m})
return new UnionMatcher(matchers,prioity)}}WED.buildMatcherVariants=buildMatcherVariants
function buildSingleMatcher(part,childrenElt){if(part==="@")return MATCH_ATTRIBUTES
if(part==="*")return MATCH_ELEMENTS
if(part==="#")return MATCH_TEXT
if(part==="!")return MATCH_COMMENTS
const isAttr=part.charAt(0)==="@"
const variantSep=part.indexOf("|")
if(variantSep>0){if(childrenElt){const variant=part
part=part.substr(isAttr?1:0,variantSep)
if(!childrenElt.wedVariants)childrenElt.wedVariants={}
childrenElt.wedVariants[part]=variant}else{part=part.substr(isAttr?1:0,variantSep)}}else if(isAttr)part=part.substring(1)
return isAttr?new AttrMatcher(part):new EltMatcher(part)}const MATCH_ALL={priorityMatcher:0,matchNode(node){return true},matchAttr(attrName){return true},matchStruct(struct){return true}}
const MATCH_ALL_NOATTR={priorityMatcher:0,matchNode(node){return true},matchAttr(attrName){return false},matchStruct(struct){return!struct.structMatch(ENodeType.attribute)}}
const MATCH_ATTRIBUTES={priorityMatcher:1,matchNode(node){return false},matchAttr(attrName){return attrName!=null},matchStruct(struct){return struct.structMatch(ENodeType.attribute)}}
const MATCH_ELEMENTS={priorityMatcher:1,matchNode(node){return JML.isElt(node)},matchAttr(attrName){return false},matchStruct(struct){return struct.structMatch(ENodeType.element)}}
const MATCH_COMMENTS={priorityMatcher:1,matchNode(node){return JML.jmlNode2nodeType(node)===ENodeType.comment},matchAttr(attrName){return false},matchStruct(struct){return struct.structMatch(ENodeType.comment)}}
const MATCH_TEXT={priorityMatcher:1,matchNode(node){return JML.jmlNode2nodeType(node)===ENodeType.text},matchAttr(attrName){return false},matchStruct(struct){return struct.structMatch(ENodeType.text)}}
class EltMatcher{constructor(name){this.name=name}get priorityMatcher(){return 10}matchNode(node){return JML.isElt(node)&&JML.jmlNode2name(node)===this.name}matchAttr(attrName){return false}matchStruct(struct){return struct.structMatch(ENodeType.element,this.name)}}class AttrMatcher{constructor(name){this.name=name}get priorityMatcher(){return 10}matchNode(node){return false}matchAttr(attrName){return this.name===attrName}matchStruct(struct){return struct.structMatch(ENodeType.attribute,this.name)}}class UnionMatcher{constructor(subMatchers,priorityMatcher){this.subMatchers=subMatchers
this.priorityMatcher=priorityMatcher}matchNode(node){return this.subMatchers.some(m=>m.matchNode(node))}matchAttr(attrName){return this.subMatchers.some(m=>m.matchAttr(attrName))}matchStruct(struct){return this.subMatchers.some(m=>m.matchStruct(struct))}}function combineSelectors(s1,s2){if(s1==null)return s2
if(s2==null)return s1
return(wedModel,node,ctx,params)=>Math.min(s1(wedModel,node,ctx,params),s2(wedModel,node,ctx,params))}WED.combineSelectors=combineSelectors})(WED||(WED={}))
class ModelRef{constructor(model,priority,selector){this.model=model
this.priority=priority
this.selector=selector}clone(){return new ModelRef(this.model,this.priority,this.selector)}}export const WED_ROOT_SELECTOR=function(wedModel,node,ctx){if(typeof wedModel.createRootWedlet==="function")return WedModel.SELECTOR_PERFECT_MATCH
return WedModel.SELECTOR_REJECT}
export class WedletModelBase{initModel(config){this.config=config}}export class NoneModel extends WedletModelBase{get isBoxFamily(){return true}createWedlet(parent,displayContext){return null}}WED.registerWedletModel("None",NoneModel)

//# sourceMappingURL=wedCore.js.map