import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{Signboard}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/signboard.js"
export function isColSearchBuilder(c){return c&&typeof c.fillSearchColumns==="function"}export class SearchExportColumn extends Signboard{setColDef(colDef){this._colDef=colDef
return this}getColDef(ctx){if(!this._colDef)return null
return typeof this._colDef==="function"?this._colDef.call(this,ctx):this._colDef}setExportStatus(status){this._colStatus=status
return this}getExportStatus(ctx){return this.isAvailable(ctx)?this._colStatus||ESearchExportColumnStatus.exported:ESearchExportColumnStatus.notAvailable}async fillSearchColumn(ctx,map){const colDef=await this.getColDef(ctx)
if(colDef)map.set(this.getLabel(ctx),colDef)}}export var ESearchExportColumnStatus;(function(ESearchExportColumnStatus){ESearchExportColumnStatus["exported"]="exported"
ESearchExportColumnStatus["exportable"]="exportable"
ESearchExportColumnStatus["notAvailable"]="notAvailable"})(ESearchExportColumnStatus||(ESearchExportColumnStatus={}))
export class SearchRequest{constructor(columns){if(columns instanceof Map)this.columns=columns
else if(typeof columns==="string")this.columnsFields=columns}addFieldColumns(...field){if(!this.columns)this.columns=new Map
for(const f of field)this.columns.set(f,null)
return this}addColumn(key,colDef){if(!this.columns)this.columns=new Map
this.columns.set(key,colDef)
return this}setMax(max){this.max=max
return this}setResultType(type){this.resultType=type
return this}setWhere(crit){this.where=crit
this.whereXml=null
return this}setWhereXml(crit){this.whereXml=crit
this.where=null
return this}toDom(){const req=JSX.asXml(()=>JSX.createElement("request",null,JSX.createElement("select",{resultType:this.resultType,max:this.max,startOffset:this.startOffset}),this.whereXml?this.whereXml:JSX.createElement("where",null,this.where?this.where.toDom():undefined)))
if(this.resultType!=="count"){JSX.asXml(()=>{var _a
const select=req.firstChild
if(this.columnsFields)select.appendChild(JSX.createElement("columns",{dataKeys:this.columnsFields}));(_a=this.columns)===null||_a===void 0?void 0:_a.forEach((func,name)=>{if(!func||name===func)select.appendChild(JSX.createElement("column",{dataKey:name}))
else if(typeof func==="string")select.appendChild(JSX.createElement("column",{name:name,dataKey:func}))
else select.appendChild(func.toDom(JSX.createElement("column",{name:name})))})})}return req}toXml(){return DOM.ser(this.toDom())}}export class SearchAnd extends Array{toDom(){const r=JSX.createElement("and",null,this.map(crit=>crit.toDom()))
return r.hasChildNodes()?r:undefined}}export class SearchOr extends Array{toDom(){const r=JSX.createElement("or",null,this.map(crit=>crit.toDom()))
return r.hasChildNodes()?r:undefined}}export class SearchNot{constructor(crit){this.crit=crit}toDom(){const r=this.crit.toDom()
return r?JSX.createElement("not",null,r):undefined}}export class SearchFree{constructor(dom){this.dom=dom}toDom(){return this.dom}}export class SearchItemSrcType{constructor(srcTypes){this.srcTypes=srcTypes}toDom(){return JSX.createElement("exp",{type:"ItemSrcType",srcTypes:this.srcTypes})}}export var ESearchItemSrcTypes;(function(ESearchItemSrcTypes){ESearchItemSrcTypes[ESearchItemSrcTypes["WSP"]=1]="WSP"
ESearchItemSrcTypes[ESearchItemSrcTypes["SPACE"]=2]="SPACE"
ESearchItemSrcTypes[ESearchItemSrcTypes["ITEMFOLDER"]=4]="ITEMFOLDER"
ESearchItemSrcTypes[ESearchItemSrcTypes["ITEMFILE"]=8]="ITEMFILE"
ESearchItemSrcTypes[ESearchItemSrcTypes["RESFOLDER"]=16]="RESFOLDER"
ESearchItemSrcTypes[ESearchItemSrcTypes["RESFILE"]=32]="RESFILE"})(ESearchItemSrcTypes||(ESearchItemSrcTypes={}))
export class SearchPath{constructor(path){this.path=path}toDom(){return this.path?JSX.createElement("exp",{type:"Path",path:this.path}):undefined}}export class SearchRootFolder{constructor(path){this.path=path}toDom(){return this.path?JSX.createElement("exp",{type:"RootFolder",path:this.path}):undefined}}export class SearchLinkParents{constructor(path,linkTraitFilter){this.path=path
this.linkTraitFilter=linkTraitFilter}toDom(){return this.path?JSX.createElement("exp",{type:"LinkParents",path:this.path,linkTraitFilter:this.linkTraitFilter}):undefined}}export class SearchLinkChildren{constructor(path,linkTraitFilter){this.path=path
this.linkTraitFilter=linkTraitFilter}toDom(){return this.path?JSX.createElement("exp",{type:"LinkChildren",path:this.path,linkTraitFilter:this.linkTraitFilter}):undefined}}export class SearchAirItems{toDom(){return JSX.createElement("exp",{type:"ItemsInAir"})}}export class SearchForeignItems{toDom(){return JSX.createElement("exp",{type:"ItemExternals"})}}export class SearchItemSgnRegexp{constructor(sgnRegExp){this.sgnRegExp=sgnRegExp}toDom(){return this.sgnRegExp?JSX.createElement("exp",{type:"ItemSgnRegexp",regexpSgn:typeof this.sgnRegExp==="object"?this.sgnRegExp.join("|"):this.sgnRegExp}):undefined}}export class SearchItemModel{constructor(models){this.models=models}toDom(){return this.models?JSX.createElement("exp",{type:"ItemModel",models:this.models.join(" ")}):undefined}}export class SearchLastUser{constructor(users){this.users=users}toDom(){if(this.users){const accounts=[]
this.users.forEach(user=>accounts.push(typeof user==="string"?user:user.account))
return JSX.createElement("exp",{type:"LastUser",users:accounts.join(" ")})}else return undefined}}export class SearchOccurencesSubExp{constructor(op,value=0,subExp){this.op=op
this.value=value
this.subExp=subExp}setSubExp(subExp){this.subExp=subExp}toDom(){return this.subExp?JSX.createElement("exp",{type:"OccurencesSubExp",op:this.op,value:this.value},this.subExp.toDom()):undefined}}export class SearchItems{inSpace(uri){this.afterUri=uri+"/"
if(this.beforeUri!==undefined)this.beforeUri=undefined
this.beforeEndFolder=this.afterUri
return this}excludeTildeRoot(){if(this.exclude){for(const u of this.exclude)if(u.startsWith("/~"))this.exclude.delete(u)}else{this.exclude=new Set}this.exclude.add("/~")
return this}isTildeRootExcluded(){return this.exclude?this.exclude.has("/~"):false}excludeAirItems(exclude){if(this.isTildeRootExcluded()){if(!exclude)this.excludeExceptSpaces(ITEM.AIR_PREFIX)
else if(this.excludeExcept)this.excludeExcept.delete(ITEM.AIR_PREFIX)}else{if(!this.exclude)this.newExcludeSet()
if(exclude)this.exclude.add(ITEM.AIR_PREFIX)
else this.exclude.delete(ITEM.AIR_PREFIX)}return this}excludeExtItems(exclude){if(this.isTildeRootExcluded()){if(!exclude)this.excludeExceptSpaces(ITEM.EXT_PREFIX)
else if(this.excludeExcept)this.excludeExcept.delete(ITEM.EXT_PREFIX)}else{if(!this.exclude)this.newExcludeSet()
if(exclude)this.exclude.add(ITEM.EXT_PREFIX)
else this.exclude.delete(ITEM.EXT_PREFIX)}return this}excludeSpaces(...spaceUris){if(spaceUris&&spaceUris.length>0){if(!this.exclude)this.newExcludeSet()
for(const uri of spaceUris)this.exclude.add(uri.endsWith("/")?uri:uri+"/")}return this}excludeExceptSpaces(...spaceUris){if(spaceUris&&spaceUris.length>0){if(!this.excludeExcept)this.excludeExcept=new Set
for(const uri of spaceUris)this.excludeExcept.add(uri.endsWith("/")?uri:uri+"/")}return this}includeDrfErased(withDrfErased){this.withDrfErased=withDrfErased
return this}newExcludeSet(){this.exclude=new Set
this.exclude.add(ITEM.ANNOT_PREFIX)}toDom(){return JSX.createElement("exp",{type:"Items",afterUri:this.afterUri,beforeUri:this.beforeUri,beforeEndFolder:this.beforeEndFolder,exclude:this.exclude?Array.from(this.exclude).join(";"):ITEM.ANNOT_PREFIX,excludeExcept:this.excludeExcept?Array.from(this.excludeExcept).join(";"):undefined,includeDrfErased:this.withDrfErased||undefined})}}export class SearchItemLinks{constructor(linkAxis){this.linkAxis=linkAxis}setPath(path){this.path=path
return this}setLinkName(linkName){this.linkName=linkName
this.linkNamePattern=undefined
this.linkTraitFilter=undefined
return this}setLinkNamePattern(linkNamePattern){this.linkNamePattern=linkNamePattern
this.linkName=undefined
this.linkTraitFilter=undefined
return this}setLinkTraitFilter(linkTraitFilter){this.linkTraitFilter=linkTraitFilter
this.linkName=undefined
this.linkNamePattern=undefined
return this}toDom(){if(!this.path)return undefined
const elt=JSX.createElement("exp",{type:this.linkAxis,linkName:this.linkName,linkNamePattern:this.linkNamePattern,linkTraitFilter:this.linkTraitFilter})
if(typeof this.path==="string"){elt.setAttribute("path",this.path||"")}else{elt.appendChild(this.path.toDom(JSX.createElement("path",null)))}return elt}}export class SearchFullText{constructor(textSearch,ignoreCase,wholeWord,dataKeyResults,dataKeyScore){this.textSearch=textSearch
this.ignoreCase=ignoreCase
this.wholeWord=wholeWord
this.dataKeyResults=dataKeyResults
this.dataKeyScore=dataKeyScore}toDom(){if(!this.textSearch)return undefined
let opts
if(this.ignoreCase){opts=this.wholeWord?";c;w;":";c;"}else if(this.wholeWord){opts=";w;"}return JSX.createElement("exp",{type:"FullText",textSearch:this.textSearch,options:opts,dataKeyResults:this.dataKeyResults,dataKeyScore:this.dataKeyScore})}}export class SearchRegexpUri{constructor(regexp){this.regexp=regexp}toDom(){if(this.regexp){let regExpTxt=this.regexp.flags?"(?"+this.regexp.flags+")":""
regExpTxt+=this.regexp.source
return JSX.createElement("exp",{type:"RegexpUri",regexp:regExpTxt})}return undefined}}export class SearchFullXPath{constructor(xpath,ns){this.xpath=xpath
this.ns=ns}toDom(){if(this.xpath){const exp=JSX.createElement("exp",{type:"FullXPath",xpathSearch:this.xpath})
if(this.ns)this.ns.forEach((value,key)=>exp.appendChild(JSX.createElement("ns",{prefix:key,uri:value})))
return exp}return undefined}}export class SearchItemTitleRegexp{constructor(regexp){this.regexp=regexp}toDom(){if(this.regexp&&this.regexp.source){let regExpTxt=""
if(this.regexp.flags)regExpTxt+="(?"+this.regexp.flags+")"
regExpTxt+=this.regexp.source
return JSX.createElement("exp",{type:"ItemTitleRegexp",regexp:regExpTxt})}return undefined}}export class SearchItemCodeOrTitle{constructor(regexp){this.regexp=regexp}toDom(){if(this.regexp&&this.regexp.source){let regExpTxt=""
if(this.regexp.flags)regExpTxt+="(?"+this.regexp.flags+")"
regExpTxt+=this.regexp.source
return JSX.createElement("exp",{type:"ItemCodeOrTitle",regexp:regExpTxt})}return undefined}}export class SearchOrphan{toDom(){return JSX.createElement("exp",{type:"ItemOrphan"})}}export class SearchStatus{constructor(minStatus,maxStatus){this.minStatus=minStatus
this.maxStatus=maxStatus}toDom(){return this.minStatus&&this.maxStatus?JSX.createElement("exp",{type:"ItemStatus",itemStatusMin:this.minStatus,itemStatusMax:this.maxStatus}):undefined}}export class SearchLastModif{constructor(operator,date){this.operator=operator
this.date=date}static buildFromInputPeriod(input){if(!input||!input.isSpecified())return undefined
const lessThan=input.getLessThan(true)
const moreThan=input.getMoreThan(true)
if(moreThan!==null&&lessThan!==null)return new SearchLastModifIn("lt.lt",moreThan,lessThan)
return moreThan!==null?new SearchLastModif("gt",moreThan):new SearchLastModif("lt",lessThan)}toDom(){if(this.date==null||!this.operator)return undefined
const vExp=JSX.createElement("exp",{type:"LastModif",op:this.operator})
vExp.setAttribute("value",(typeof this.date==="number"?this.date:this.date.getTime()).toString())
return vExp}}export class SearchLastModifIn{constructor(operator,startDate,endDate){this.operator=operator
this.startDate=startDate
this.endDate=endDate}toDom(){if(!this.operator||this.startDate==null||this.endDate==null)return undefined
return JSX.createElement("exp",{type:"LastModif",op:this.operator,value:(typeof this.startDate==="number"?this.startDate:this.startDate.getTime()).toString()+","+(typeof this.endDate==="number"?this.endDate:this.endDate.getTime()).toString()})}}export class SearchLifeCycleStates{constructor(lcStates,lcBys,dateOperator,startDate,endDate){this.lcStates=lcStates
this.lcBys=lcBys
this.dateOperator=dateOperator
this.startDate=startDate
this.endDate=endDate}static buildFromInputPeriod(input){if(!input||!input.isSpecified())return undefined
const lessThan=input.getLessThan(true)
const moreThan=input.getMoreThan(true)
if(moreThan!==null&&lessThan!==null)return new SearchLifeCycleStates(null,null,"lt.lt",moreThan,lessThan)
return moreThan!==null?new SearchLifeCycleStates(null,null,"gt",moreThan):new SearchLifeCycleStates(null,null,"lt",lessThan)}toDom(){if(!this.lcStates)return undefined
const vExp=JSX.createElement("exp",{type:"LifeCycleStates",lcStates:this.lcStates.join(" "),lcBys:this.lcBys,opDt:this.dateOperator})
if(this.startDate){let lcDate=(typeof this.startDate==="number"?this.startDate:this.startDate.getTime()).toString()
if(this.endDate)lcDate+=","+(typeof this.endDate==="number"?this.endDate:this.endDate.getTime()).toString()
vExp.setAttribute("lcDate",lcDate)}return vExp}}export class SearchResponsibilities{constructor(responsibilities,accounts,toMembers=false,toGroups=false){this.responsibilities=responsibilities
this.accounts=accounts
this.toMembers=toMembers
this.toGroups=toGroups}toDom(){var _a,_b
if(!this.responsibilities)return undefined
const expands=[]
if(this.toMembers)expands.push("toMembers")
if(this.toGroups)expands.push("toGroups")
return JSX.createElement("exp",{type:"Responsibilities",responsibilities:(_a=this.responsibilities)===null||_a===void 0?void 0:_a.join(" "),users:(_b=this.accounts)===null||_b===void 0?void 0:_b.join(" "),expandUsers:expands})}}export class SearchItemComment{constructor(withOpenComments,withClosedComments){this.withOpenComments=withOpenComments
this.withClosedComments=withClosedComments}toDom(){if(this.withClosedComments||this.withOpenComments){let XPathSearch="descendant::comment()[matchesRegex(normalize-space(.), '<comment.*')]"
if(this.withClosedComments&&!this.withOpenComments)XPathSearch+="[matchesRegex(normalize-space(.), '<comment[^>]*threadClosed=.true.[^>]*>.*')]"
else if(!this.withClosedComments&&this.withOpenComments)XPathSearch+="[not(matchesRegex(normalize-space(.), '<comment[^>]*threadClosed=.true.[^>]*>.*'))]"
return JSX.createElement("exp",{type:"FullXPath",xpathSearch:XPathSearch})}}}export class SearchItemPropsRegexp{constructor(propName,regexp,multiValued="atLeastOne"){this.propName=propName
this.regexp=regexp
this.multiValued=multiValued}toDom(){if(this.regexp){let regExpTxt=this.regexp.flags?"(?"+this.regexp.flags+")":""
regExpTxt+=this.regexp.source
return JSX.createElement("exp",{type:"ItemPropsRegexp",propName:this.propName,regexp:regExpTxt,multiValued:this.multiValued})}return undefined}}export class SearchItemPropsNumber{constructor(propName,op,value,multiValued="atLeastOne"){this.propName=propName
this.op=op
this.value=value
this.multiValued=multiValued}toDom(){if(Number.isInteger(this.value)){return JSX.createElement("exp",{type:"ItemPropsNumber",propName:this.propName,op:this.op,value:this.value,multiValued:this.multiValued})}return undefined}}export class SearchItemPropsDate{constructor(propName,op,startDate,endDate,multiValued="atLeastOne"){this.propName=propName
this.op=op
this.startDate=startDate
this.endDate=endDate
this.multiValued=multiValued}static buildFromInputPeriod(input,propName,multiValued){if(!input||!input.isSpecified())return undefined
const lessThan=input.getLessThan(true)
const moreThan=input.getMoreThan(true)
if(moreThan!==null&&lessThan!==null)return new SearchItemPropsDate(propName,"lt.lt",moreThan,lessThan,multiValued)
return moreThan!==null?new SearchItemPropsDate(propName,"gt",moreThan,null,multiValued):new SearchItemPropsDate(propName,"lt",lessThan,null,multiValued)}toDom(){if(!this.startDate)return undefined
const vExp=JSX.createElement("exp",{type:"ItemPropsDate",propName:this.propName,multiValued:this.multiValued,op:this.op})
let date=(typeof this.startDate==="number"?this.startDate:this.startDate.getTime()).toString()
if(this.endDate)date+=","+(typeof this.endDate==="number"?this.endDate:this.endDate.getTime()).toString()
vExp.setAttribute("value",date)
return vExp}}export class SearchDrfStates{constructor(drfStates){this.drfStates=drfStates}toDom(){if(this.drfStates&&this.drfStates.length>0){return JSX.createElement("exp",{type:"DrfStates",drfStates:this.drfStates.join(" ")})}return undefined}}export class SearchDrvStates{constructor(drvStates){this.drvStates=drvStates}toDom(){if(this.drvStates&&this.drvStates.length>0){return JSX.createElement("exp",{type:"DrvStates",drvStates:this.drvStates.join(" ")})}return undefined}}export class SearchFuncFree{constructor(funcDef){this.funcDef=funcDef}toDom(holder){const freeElt=this.funcDef instanceof Element?this.funcDef:DOM.parseDom(this.funcDef).documentElement
if(freeElt){for(const att of freeElt.attributes)holder.setAttribute(att.name,att.value)
for(const elt of freeElt.children)holder.appendChild(holder.ownerDocument.importNode(elt,true))}return holder}}export class SearchFuncProps{constructor(dataKey){this.dataKey=dataKey}toDom(holder){holder.setAttribute("dataKey",this.dataKey)
return holder}}export class SearchFuncXpath{constructor(xpath,ns){this.xpath=xpath
this.ns=ns}toDom(holder){if(this.xpath){holder.setAttribute("func","XPath")
holder.setAttribute("xpath",this.xpath)
if(this.ns)this.ns.forEach((value,key)=>holder.appendChild(JSX.createElement("ns",{prefix:key,uri:value})))}return holder}}export class SearchFuncUri2LeafName{constructor(uri,trimExtension=false){this.uri=uri
this.trimExtension=trimExtension}setUri(uri){this.uri=uri
return this}toDom(holder){holder.setAttribute("func","Uri2LeafName")
holder.setAttribute("trimExtension",String(this.trimExtension))
if(typeof this.uri==="string"){holder.setAttribute("dataKey",this.uri||"")}else{holder.appendChild(this.uri.toDom(JSX.createElement("uri",null)))}return holder}}export class SearchFuncUri2Space{constructor(uri){this.uri=uri}setUri(uri){this.uri=uri
return this}toDom(holder){holder.setAttribute("func","Uri2Space")
if(typeof this.uri==="string"){holder.setAttribute("dataKey",this.uri||"")}else{holder.appendChild(this.uri.toDom(JSX.createElement("uri",null)))}return holder}}export class SearchFuncSubRequest2Csv{constructor(select,where){this.select=select
this.where=where
this.escapeOnlyIfNeeded=true}setSelect(select){this.select=select
return this}setWhere(where){this.where=where
return this}setFieldSeparator(fieldSeparator){this.fieldSeparator=fieldSeparator
return this}setLineSeparator(lineSeparator){this.lineSeparator=lineSeparator
return this}setEscapeOnlyIfNeeded(escapeOnlyIfNeeded){this.escapeOnlyIfNeeded=escapeOnlyIfNeeded
return this}toDom(holder){if(this.where&&this.select){holder.setAttribute("func","SubRequest2Csv")
if(this.fieldSeparator)holder.setAttribute("fieldSeparator",this.fieldSeparator)
if(this.lineSeparator)holder.setAttribute("lineSeparator",this.lineSeparator)
holder.setAttribute("escapeOnlyIfNeeded",String(this.escapeOnlyIfNeeded))
const req=new SearchRequest(this.select)
if(Array.isArray(this.where))req.setWhere(new SearchAnd(...this.where))
else req.setWhere(this.where)
const reqDom=req.toDom()
holder.appendChild(holder.ownerDocument.importNode(reqDom.querySelector("select"),true))
holder.appendChild(holder.ownerDocument.importNode(reqDom.querySelector("where"),true))
return holder}}}export class SearchFuncTranslateStr{constructor(str){this.str=str
this.otherValue=null
this.concat=null}setDict(dict){this.dict=dict
return this}setStr(str){this.str=str
return this}setConcat(char){this.concat=char
return this}setOtherValue(val=""){this.otherValue=val
return this}toDom(holder){holder.setAttribute("func","TranslateStr")
if(this.concat)holder.setAttribute("concat",this.concat)
if(typeof this.str==="string")holder.setAttribute("dataKey",this.str||"")
else holder.appendChild(this.str.toDom(JSX.createElement("string",null)))
const dictElt=holder.appendChild(JSX.createElement("dict",null))
if(this.otherValue!==null)dictElt.setAttribute("otherValue",this.otherValue)
const dict=typeof this.dict==="function"?this.dict():this.dict
for(const key in dict)dictElt.appendChild(JSX.createElement("entry",{from:key,to:dict[key]}))
return holder}}export class SearchFuncAccountProp{constructor(accounts){this.accounts=accounts
this.separator=", "}setAccounts(accounts){this.accounts=accounts
return this}setSeparator(separator){this.separator=separator
return this}toDom(holder){holder.setAttribute("func","AccountPropFunc")
if(this.separator)holder.setAttribute("separator",this.separator)
if(typeof this.accounts==="string")holder.setAttribute("dataKey",this.accounts||"")
else holder.appendChild(this.accounts.toDom(JSX.createElement("account",null)))
return holder}}export class SearchFuncItemProp{constructor(propName,propType="String"){this.propName=propName
this.propType=propType
this.eachValues=false
this.concat=", "}setEachValues(eachValues,separator){this.eachValues=eachValues
this.concat=separator
return this}toDom(holder){holder.setAttribute("func","ItemPropFunc")
holder.setAttribute("propName",this.propName)
holder.setAttribute("returnType",this.propType)
holder.setAttribute("eachValues",String(this.eachValues))
if(this.concat)holder.setAttribute("concat",this.concat)
return holder}}export class SearchFuncLong2Date{constructor(long,locale="fr"){this.long=long
this.locale=locale
this.concat=null}setLong(long){this.long=long
return this}setConcat(char){this.concat=char
return this}setFormat(date,time){this.formatDate=date
this.formatTime=time
this.formatPattern=null
return this}setFomatByPattern(pattern){this.formatPattern=pattern
return this}toDom(holder){holder.setAttribute("func","Long2Date")
if(this.concat)holder.setAttribute("concat",this.concat)
if(this.locale)holder.setAttribute("locale",this.locale)
if(this.formatPattern){holder.setAttribute("pattern",this.formatPattern)}else{if(this.formatDate)holder.setAttribute("dateStyle",this.formatDate)
if(this.formatTime)holder.setAttribute("timeStyle",this.formatTime)}if(typeof this.long==="string"){holder.setAttribute("dataKey",this.long||"")}else{holder.appendChild(this.long.toDom(JSX.createElement("long",null)))}return holder}}export var ELong2DateStyles;(function(ELong2DateStyles){ELong2DateStyles["short"]="short"
ELong2DateStyles["full"]="full"
ELong2DateStyles["medium"]="medium"
ELong2DateStyles["long"]="long"})(ELong2DateStyles||(ELong2DateStyles={}))
export class SearchFuncResponsibles{constructor(resp){this.resp=resp
this.separator=","}setSeparator(separator){this.separator=separator
return this}toDom(holder){holder.setAttribute("func","Responsibles")
holder.setAttribute("separator",this.separator)
holder.setAttribute("resp",this.resp)
return holder}}export class SearchTasksByUsers{constructor(users,stages=["pending"]){this.users=users
this.stages=stages}setUsers(...users){this.users=users
return this}setExpandToGroups(expand){this.expandToGroups=true
return this}setExpandToMembers(expand){this.expandToMembers=true
return this}setResps(resps){this.resps=resps
return this}toDom(){var _a,_b,_c
if(!this.users)return undefined
const expandUsers=[]
if(this.expandToGroups)expandUsers.push("toGroups")
if(this.expandToMembers)expandUsers.push("toMembers")
return((_a=this.stages)===null||_a===void 0?void 0:_a.length)&&((_b=this.users)===null||_b===void 0?void 0:_b.length)?JSX.createElement("exp",{type:"TasksByUsers",users:this.users.join(" "),expandUsers:expandUsers.length?expandUsers.join(" "):undefined,responsibilities:((_c=this.resps)===null||_c===void 0?void 0:_c.length)?this.resps.join(" "):undefined,actStages:this.stages.join(" ")}):undefined}}export class SearchTasksAll{constructor(stages){this.stages=stages}toDom(){var _a
return((_a=this.stages)===null||_a===void 0?void 0:_a.length)?JSX.createElement("exp",{type:"TasksAll",actStages:this.stages.join(" ")}):undefined}}export class SearchTasksDeadline{constructor(op,startDate,endDate){this.op=op
this.startDate=startDate
this.endDate=endDate}static buildFromInputPeriod(input){if(!input||!input.isSpecified())return undefined
const lessThan=input.getLessThan(true)
const moreThan=input.getMoreThan(true)
if(moreThan!==null&&lessThan!==null)return new SearchTasksDeadline("lt.lt",moreThan,lessThan)
return moreThan!==null?new SearchTasksDeadline("gt",moreThan,null):new SearchTasksDeadline("lt",lessThan,null)}toDom(){if(!this.startDate)return undefined
const vExp=JSX.createElement("exp",{type:"TasksDeadline",op:this.op})
let date=(typeof this.startDate==="number"?this.startDate:this.startDate.getTime()).toString()
if(this.endDate)date+=","+(typeof this.endDate==="number"?this.endDate:this.endDate.getTime()).toString()
vExp.setAttribute("value",date)
return vExp}}export class SearchTasksScheduled{constructor(op,startDate,endDate){this.op=op
this.startDate=startDate
this.endDate=endDate}static buildFromInputPeriod(input){if(!input||!input.isSpecified())return undefined
const lessThan=input.getLessThan(true)
const moreThan=input.getMoreThan(true)
if(moreThan!==null&&lessThan!==null)return new SearchTasksScheduled("lt.lt",moreThan,lessThan)
return moreThan!==null?new SearchTasksScheduled("gt",moreThan,null):new SearchTasksScheduled("lt",lessThan,null)}toDom(){if(!this.startDate)return undefined
const vExp=JSX.createElement("exp",{type:"TasksScheduled",op:this.op})
let date=(typeof this.startDate==="number"?this.startDate:this.startDate.getTime()).toString()
if(this.endDate)date+=","+(typeof this.endDate==="number"?this.endDate:this.endDate.getTime()).toString()
vExp.setAttribute("value",date)
return vExp}}export class StreamedSearch{constructor(wsp,rowsHandler){this.svc="search"
this._tmpSearchIdCounter=0
this.wsp=wsp
this.rowsHandler=rowsHandler
this._ws=wsp.wspServer.chain.wsFrames.ws
this._onMsg=this.onMsg.bind(this)
this._ws.msgListeners.on(this.svc,this._onMsg)}async search(search){const prevSearch=this._currentSearchId
const tmpSearchId=this._currentSearchId=--this._tmpSearchIdCounter
const resp=await this._ws.sendReq({svc:this.svc,wspCd:this.wsp.code,search:search.toXml(),abort:prevSearch>=0?prevSearch:undefined})
if(resp.failure){console.trace("Search failed",search.toXml(),resp)
throw resp.failure}else if(this._currentSearchId===tmpSearchId){this._currentSearchId=resp.searchId}}abortSearch(){if(this._currentSearchId){this._ws.sendMsg({svc:this.svc,abort:this._currentSearchId})
this._currentSearchId=undefined}}close(){if(this._currentSearchId)try{this.abortSearch()}catch(e){}this._ws.msgListeners.removeListener(this.svc,this._onMsg)
this._ws=null
this._onMsg=null
this.wsp=null
this.rowsHandler=null}onMsg(m){if(m.searchId===this._currentSearchId){if(m.done)this._currentSearchId=undefined
if(this.rowsHandler(m.rows,m.done)==="abort")this.abortSearch()}}}
//# sourceMappingURL=search.js.map