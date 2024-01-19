import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{Schema}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schema.js"
import{SkMatcherAnyAttr,SkMatcherAnyElt,SkMatcherAttrName,SkMatcherEltChoice,SkMatcherEltName,SkMatcherEltNs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMatchers.js"
import{SKMETALIB}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMeta.js"
import{isSkRuleStr,SkRule,SkRuleAttr,SkRuleChoice,SkRuleData,SkRuleDirective,SkRuleDoc,SkRuleElt,SkRuleEmpty,SkRuleGroup,SkRuleList,SkRuleText,SkRuleUGroup,SkRuleValue}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaPatterns.js"
import{CONVERTERLIB,ConverterProv,XslConverter}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/import/convert.js"
export const SK_NS="scenari.eu:schema:metaModel"
const RNG_NS="http://relaxng.org/ns/structure/1.0"
const RNGA_NS="http://relaxng.org/ns/compatibility/annotations/1.0"
export class SchemaBuilder{constructor(skMetaLib,parent){this._rules=new Map
this._ruleCombines=new Map
this.namespaces={}
this.converterProvs=new Map
this.skMetaLib=skMetaLib||SKMETALIB
this._parent=parent}addNamedRule(name,rule,combine){if(!name)throw Error(`Name is required for identified rules : ${rule}`)
const current=this._rules.get(name)
if(current){combine=SchemaBuilder.xCheckCombine(this._ruleCombines.get(name),combine,name)
this._ruleCombines.set(name,combine)
rule=SchemaBuilder.xCombineRule(current,rule,combine,name)}this._rules.set(name,rule)
return this}addStartRule(rule,combine){if(this._startRule){this._startRuleCombine=SchemaBuilder.xCheckCombine(this._startRuleCombine,combine,"#startRule#")
rule=SchemaBuilder.xCombineRule(this._startRule,rule,this._startRuleCombine,null)}this._startRule=rule
return this}include(other){if(other._startRule)this.addStartRule(other._startRule,other._startRuleCombine)
this.unknownEltRule=SchemaBuilder.xCombineUndef(this.unknownEltRule,other.unknownEltRule)
this.unknownAttrRule=SchemaBuilder.xCombineUndef(this.unknownAttrRule,other.unknownAttrRule)
this.forbiddenTextRule=SchemaBuilder.xCombineUndef(this.forbiddenTextRule,other.forbiddenTextRule)
for(const[name,rule]of other._rules){this.addNamedRule(name,rule,other._ruleCombines.get(name))}Object.assign(this.namespaces,other.namespaces)
return this}import(name,other){this._rules.set(name,other.buildStartRule())
return this}addAsyncLoad(loader){(this._asyncLoads||(this._asyncLoads=[])).push(loader)}async buildSchema(){if(this._asyncLoads)await Promise.all(this._asyncLoads)
this.buildStartRule()
if(this.unknownEltRule)this.unknownEltRule=this.resolveRule(this.unknownEltRule).linkRules(this)
if(this.unknownAttrRule)this.unknownAttrRule=this.resolveRule(this.unknownAttrRule).linkRules(this)
if(this.forbiddenTextRule)this.forbiddenTextRule=this.resolveRule(this.forbiddenTextRule).linkRules(this)
return new Schema((new SkRuleDoc).init(this._startRuleReady,this.skMetaLib.getMetaNode("/")),this)}resolveRule(rule){if(typeof rule==="string"){const resolved=this.resolveRule(this._rules.get(rule))
if(!resolved)throw Error(`Named rule '${rule}' is not found`)
return resolved}return rule}buildStartRule(){if(!this._startRuleReady){const startRule=this.resolveRule(this._startRule).linkRules(this)
if(startRule instanceof SkRuleElt||startRule instanceof SkRuleDirective){this._startRuleReady=startRule}else throw Error(`Rule not allowed as start rule: ${startRule}`)}return this._startRuleReady}getSubBuilders(){if(this._parent)return this._parent.getSubBuilders()
if(!this._subBuilders)this._subBuilders=new Map
return this._subBuilders}static xCheckCombine(currCombine,newCombine,ruleName){if(currCombine){if(currCombine===newCombine)return currCombine
throw Error(`Rule ${ruleName} already declared with an incompatible combine property : ${currCombine} != ${newCombine}.`)}if(!newCombine)throw Error(`Rule ${ruleName} already declared. 'combine' parameter is required.`)
return newCombine}static xCombineUndef(currentRule,newRule){if(!currentRule)return newRule
if(!newRule)return currentRule
return this.xCombineRule(currentRule,newRule,"choice",null)}static xCombineRule(currentRule,newRule,combine,name){if(combine==="choice"){const choice=currentRule instanceof SkRuleChoice?currentRule:null
if(choice==null){let choice=newRule instanceof SkRuleChoice?newRule:null
if(choice==null){choice=(new SkRuleChoice).initName(name).initSubNames([currentRule,newRule])}else{choice.tmpSubRules.push(currentRule)}}else if(newRule instanceof SkRuleChoice){if(newRule.subCards){if(!choice.subCards)choice.subCards=[]
choice.subCards.length=choice.tmpSubRules.length
choice.subCards.push(...newRule.subCards)}choice.tmpSubRules.push(...newRule.tmpSubRules)}else{choice.tmpSubRules.push(newRule)}return choice}else{const interleave=currentRule instanceof SkRuleUGroup?currentRule:null
if(interleave==null){let choice=newRule instanceof SkRuleUGroup?newRule:null
if(choice==null){choice=(new SkRuleUGroup).initName(name).initSubNames([currentRule,newRule])}else{choice.tmpSubRules.push(currentRule)}}else if(newRule instanceof SkRuleUGroup){if(newRule.subCards){if(!interleave.subCards)interleave.subCards=[]
interleave.subCards.length=interleave.tmpSubRules.length
interleave.subCards.push(...newRule.subCards)}interleave.tmpSubRules.push(...newRule.tmpSubRules)}else{interleave.tmpSubRules.push(newRule)}return interleave}}}export class RelaxNgSchemaBuilder extends SchemaBuilder{buildRelaxNgFromUrl(url,init){return this.loadRelaxNg(url,init).then(()=>this.buildSchema())}buildRelaxNg(doc){return this.readRelaxNg(doc).then(()=>this.buildSchema())}loadRelaxNg(endPoint,init){return endPoint.fetch("","text",init).then(r=>this.readRelaxNg(DOM.parseDom(r.asText,endPoint)))}readRelaxNg(doc){this.currentUrl=doc.baseEndPoint
const self=this
const rootsIt=doc.createTreeWalker(doc,NodeFilter.SHOW_ELEMENT,{acceptNode(node){if(node.namespaceURI!==RNG_NS){if(node.localName==="cnv"&&node.namespaceURI===SK_NS){const cnvProv=new ConverterProv
const switchTags=node.getAttribute("switch")
if(switchTags)cnvProv.addSwitch(...switchTags.split(" "))
for(let ch=node.firstElementChild;ch;ch=ch.nextElementSibling){if(ch.namespaceURI!==SK_NS)continue
switch(ch.localName){case"cnvSwitch":cnvProv.addSwitch(...ch.getAttribute("tags").split(" "))
break
case"cnvXsl":{const cnv=new XslConverter(self.currentUrl.resolve(ch.getAttribute("xslPath")))
for(let p=node.firstElementChild;p;p=p.nextElementSibling){if(p.localName==="param"&&p.namespaceURI===SK_NS){cnv.addParam(p.getAttribute("name"),p.getAttribute("value"))}}cnvProv.addConverters(ch.getAttribute("src").split(" "),ch.getAttribute("dst").split(" "),cnv)
break}case"cnvSwitchCustom":{const cnv=CONVERTERLIB.getConverterFromXml(ch.getAttribute("key"),ch)
if(cnv){cnvProv.addCustomSwitch(cnv,...ch.getAttribute("tags").split(" "))}else{console.log("Converter not found in CONVERTERLIB",ch.getAttribute("key"))}break}case"cnvCustom":{const cnv=CONVERTERLIB.getConverterFromXml(ch.getAttribute("key"),ch)
if(cnv){cnvProv.addConverters(ch.getAttribute("src").split(" "),ch.getAttribute("dst").split(" "),cnv)}else{console.log("Converter not found in CONVERTERLIB",ch.getAttribute("key"))}break}}}self.converterProvs.set(node.getAttribute("name"),cnvProv)}else if(node.localName==="crossDomMgr"&&node.namespaceURI===SK_NS){self.addAsyncLoad(self.currentUrl.resolve(node.getAttribute("lib")).importJs().then(lib=>{if(!self.crossDomMgrFactories)self.crossDomMgrFactories={}
self.crossDomMgrFactories[node.getAttribute("mgrId")||""]=lib[node.getAttribute("libKey")||"crossDomMgrFactory"](node)}))}return NodeFilter.FILTER_REJECT}switch(node.localName){case"start":{const result=self.readRule(node)
if(typeof result==="string"||result instanceof SkRuleElt||result instanceof SkRuleDirective){self.addStartRule(result,node.getAttribute("combine"))}else{throw Error(`Rule not allowed as start rule: ${result}`)}return NodeFilter.FILTER_REJECT}case"define":{const name=node.getAttribute("name")
const result=self.readRule(node)
if(result instanceof SkRule)result.uniqueName=name
self.addNamedRule(name,result,node.getAttribute("combine"))
return NodeFilter.FILTER_REJECT}case"include":{const target=self.currentUrl.resolve(node.getAttribute("href"))
const subBuilders=self.getSubBuilders()
let future=subBuilders.get(target.url)
if(!future){future=new RelaxNgSchemaBuilder(self.skMetaLib,self).loadRelaxNg(target)
subBuilders.set(target.url,future)}future.then(builder=>{self.include(builder)})
return NodeFilter.FILTER_REJECT}case"grammar":for(let i=0;i<node.attributes.length;i++){const att=node.attributes.item(i)
if(att.nodeName==="xmlns"||att.prefix==="xmlns"){if(att.nodeValue!==SK_NS&&att.nodeValue!==RNG_NS&&att.nodeValue!==RNGA_NS){self.namespaces[att.nodeName==="xmlns"?"":att.localName]=att.nodeValue}}}case"div":return NodeFilter.FILTER_SKIP}return NodeFilter.FILTER_REJECT}})
while(rootsIt.nextNode());return this._subBuilders?Promise.all(this._subBuilders.values()).then(()=>this):Promise.resolve(this)}readRules(root){const result=[]
for(let ch=root.firstElementChild;ch;ch=ch.nextElementSibling){const rule=this.eltToRule(ch)
if(rule)result.push(rule)}if(result.length==0)result.push(SkRuleEmpty.SINGLETON)
return result}readRule(root){let result
for(let ch=root.firstElementChild;ch;ch=ch.nextElementSibling){const rule=this.eltToRule(ch)
if(rule){if(!result){result=rule}else if(Array.isArray(result)){result.push(rule)}else{result=[result,rule]}}}if(!result)return SkRuleEmpty.SINGLETON
if(Array.isArray(result))return(new SkRuleGroup).initSubNames(result)
return result}eltToRule(elt){if(!elt||elt.namespaceURI!==RNG_NS)return null
switch(elt.localName){case"optional":return(new SkRuleGroup).initCard("?").initSubNames(this.readRules(elt))
case"zeroOrMore":return(new SkRuleGroup).initCard("*").initSubNames(this.readRules(elt))
case"oneOrMore":return(new SkRuleGroup).initCard("+").initSubNames(this.readRules(elt))
case"group":const rule=(new SkRuleGroup).initSubNames(this.readRules(elt))
rule.structLabel=elt.getAttributeNS(SK_NS,"title")
return rule
case"choice":const ch=elt.firstElementChild
if(!ch)return null
if(ch.localName==="name"||ch.localName==="anyName"||ch.localName==="nsName"){return null}return(new SkRuleChoice).initSubNames(this.readRules(elt)).initDefaultValue(elt.getAttributeNS(SK_NS,"defaultValue")).initAutoCreate(elt.getAttributeNS(SK_NS,"autoCreate"))
case"interleave":return(new SkRuleUGroup).initSubNames(this.readRules(elt))
case"mixed":{const subRules=this.readRules(elt)
subRules.unshift(SkRuleText.DEFAULT)
return(new SkRuleUGroup).initSubNames(subRules)}case"element":{const rule=new SkRuleElt
rule.structLabel=elt.getAttributeNS(SK_NS,"title")
const name=elt.getAttribute("name")
if(!name){rule.init(makeMatcherElt(findNameClass(elt)))}else{rule.init(new SkMatcherEltName(name))}rule.initContentName(this.readRule(elt))
if(elt.hasAttributeNS(SK_NS,"noAutoComplete"))rule.noAutoComplete=true
const cnv=elt.getAttributeNS(SK_NS,"cnv")
if(cnv)rule.convertFrom=this.converterProvs.get(cnv)
rule.skFamily=elt.getAttributeNS(SK_NS,"family")||elt.getAttributeNS(SK_NS,"htmlEquiv")
const coef=elt.getAttributeNS(SK_NS,"malusCoef")
if(coef!=null)rule.skMalusCoef=Number.parseInt(coef,10)
const help=elt.getAttributeNS(SK_NS,"help")
if(help)rule.helpId=help
rule.skMeta=this.skMetaLib.getMetaNode(elt.getAttributeNS(SK_NS,"model")||"*")
rule.skMeta.initSkRule(rule,elt)
return rule}case"empty":case"notAllowed":return SkRuleEmpty.SINGLETON
case"attribute":{const rule=new SkRuleAttr
rule.structLabel=elt.getAttributeNS(SK_NS,"title")
const name=elt.getAttribute("name")
if(!name){rule.init(SkMatcherAnyAttr.SINGLETON)}else{rule.init(new SkMatcherAttrName(name))}const help=elt.getAttributeNS(SK_NS,"help")
if(help)rule.helpId=help
rule.skMeta=this.skMetaLib.getMetaNode(elt.getAttributeNS(SK_NS,"model")||"@")
const checkR=this.readRule(elt)
if(checkR===SkRuleEmpty.SINGLETON){rule.skMeta.initSkRule(rule,elt)
return rule}if(typeof checkR==="string"){rule.initValueCheckByName(checkR)
rule.skMeta.initSkRule(rule,elt)
return rule}if(isSkRuleStr(checkR)){rule.initValueCheck(checkR)
rule.skMeta.initSkRule(rule,elt)
return rule}throw Error("RelaxNg invalid : "+DOM.debug(elt))}case"ref":return elt.getAttribute("name")
case"parentRef":return this._parent.resolveRule(elt.getAttribute("name"))
case"externalRef":{const target=this.currentUrl.resolve(elt.getAttribute("href"))
const name=target.url
const subBuilders=this.getSubBuilders()
let future=subBuilders.get(name)
if(!future){future=new RelaxNgSchemaBuilder(this.skMetaLib,this).loadRelaxNg(target)
subBuilders.set(name,future)}future.then(builder=>{this.import(name,builder)})
return name}case"text":return SkRuleText.DEFAULT
case"list":return(new SkRuleList).initContentName(this.readRule(elt))
case"data":const params={}
for(let ch=elt.firstElementChild;ch;ch=ch.nextElementSibling){if(ch.localName==="param")params[ch.getAttribute("name")]=ch.textContent}const r=SkRuleData.newData(elt.getAttribute("type"),params)
r.structLabel=elt.getAttributeNS(SK_NS,"title")
return r
case"value":return(new SkRuleValue).init(elt.getAttribute("type"),elt.textContent)
case"name":case"anyName":case"nsName":case"except":return null
default:throw Error(`Unknown relaxNG element in rule context: ${elt.localName}`)}}}function findNameClass(ctn){var _a
const first=ctn.firstElementChild
switch(first===null||first===void 0?void 0:first.localName){case"name":case"anyName":case"nsName":return first
case"choice":{const firstCh=(_a=first.firstElementChild)===null||_a===void 0?void 0:_a.localName
if(firstCh==="name"||firstCh==="anyName"||firstCh==="nsName")return first}}return null}function makeMatcherElt(nameClass){if(!nameClass)return SkMatcherAnyElt.SINGLETON
switch(nameClass.localName){case"name":return new SkMatcherEltName(nameClass.textContent.trim())
case"anyName":return SkMatcherAnyElt.SINGLETON
case"nsName":return new SkMatcherEltNs(nameClass.getAttribute("ns"),nameClass.getAttributeNS(SK_NS,"prefix"))
case"choice":{const choice=new SkMatcherEltChoice
for(let ch=nameClass.firstElementChild;ch;ch=ch.nextElementSibling)choice.subMatchers.push(makeMatcherElt(ch))
return choice}case"except":throw Error("TODO except:: "+nameClass)}throw Error("Unknown node : "+nameClass)}
//# sourceMappingURL=schemaBuilder.js.map