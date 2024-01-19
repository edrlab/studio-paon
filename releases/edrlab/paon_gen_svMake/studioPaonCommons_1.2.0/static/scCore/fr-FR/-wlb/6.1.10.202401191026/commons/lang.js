export const LANG={in(left,...right){for(let i=0;i<right.length;i++)if(left===right[i])return true
return false},arrayEquals:function(a,b){if(a==null||b==null)return a==b
return a.length===b.length&&a.every((v,i)=>v===b[i])},pushIfDefined(arr,...members){for(let i=0,s=members.length;i<s;i++){const v=members[i]
if(v!==undefined)arr.push(v)}return arr},completeClassProps(fromClass,toClass){const from=fromClass.prototype
const to=toClass.prototype
for(const key of Object.getOwnPropertyNames(from)){if(key!=="constructor"){if(!to.hasOwnProperty(key))Object.defineProperty(to,key,Object.getOwnPropertyDescriptor(from,key))}}},stringInsert(str,offset,ins){if(str==null)return ins
if(offset===0){return ins+str}else if(offset===str.length){return str+ins}return str.substring(0,offset)+ins+str.substring(offset)},stringDelete(str,offset,len){if(len===0)return str
if(offset===0){return str.substring(len)}else if(offset+len>=str.length){return str.substring(0,offset)}else{return str.substring(0,offset)+str.substring(offset+len)}},formatStr(text,vars){if(!text||!vars)return text
let idx=0
return text.replace(/(%(?:%|(?:(\d+)\$)?s))/g,(substring,p1,p2)=>p1=="%%"?"%":vars[p2?parseInt(p2)-1:idx++])},escape4Regexp(text){return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")},escape4RegexpFuzzy(text){const chars=[]
const dic=this.fuzzySearch()
for(let i=0;i<text.length;i++){const ch=text.charAt(i)
const fuzzy=dic.get(ch.charCodeAt(0))
if(fuzzy!==undefined){chars.push("[",fuzzy,"]")}else{chars.push(this.escape4Regexp(ch))}}return chars.join("")},escapeChar4Regexp(char){const val=char.charCodeAt(0).toString(16)
switch(val.length){case 1:return"\\x0"+val
case 2:return"\\x"+val
case 3:return"\\u0"+val
case 4:return"\\u"+val}},_fuzzySearchDatas:"aa",_fuzzySearch:null,fuzzySearch(){if(this._fuzzySearch===null){const dic=this._fuzzySearch=new Map
for(const group of this._fuzzySearchDatas.split("|")){for(let i=0;i<group.length;i++)dic.set(group.charCodeAt(i),group)}}return this._fuzzySearch},promisesMap:async function(array,mapper,concurrency){const results=Array(array.length)
const poolSize=Math.min(concurrency,array.length)
const pool=new Array(poolSize)
for(let i=0;i<poolSize;i++)pool[i]=mapper(array[i],i).then(result=>{results[i]=result
return i})
let activeCount=poolSize
let i=poolSize
while(activeCount){const racePool=activeCount===poolSize?pool:pool.filter(p=>p)
const resolvedIdx=await Promise.race(racePool)
if(i<array.length){(index=>{pool[resolvedIdx]=mapper(array[index],index).then(result=>{results[index]=result
return resolvedIdx})})(i)
i++}else{pool[resolvedIdx]=null
activeCount--}}return results},reduceToDict(array,getKey){return array.reduce((dict,item,index,array)=>{const key=getKey(index,array)
if(key!=null)dict[key]=item
return dict},{})}}
export var EBytesUnits;(function(EBytesUnits){EBytesUnits[EBytesUnits["bytes"]=0]="bytes"
EBytesUnits[EBytesUnits["ko"]=1]="ko"
EBytesUnits[EBytesUnits["mo"]=2]="mo"
EBytesUnits[EBytesUnits["go"]=3]="go"
EBytesUnits[EBytesUnits["to"]=4]="to"
EBytesUnits[EBytesUnits["po"]=5]="po"})(EBytesUnits||(EBytesUnits={}))
export const LOCALE={languageToName:function(language){const baseLang=language.split("-")[0]
if(ISOLANGLIST.has(baseLang))return ISOLANGLIST.get(baseLang).name
return language},nativeLanguageToName:function(language){const baseLang=language.split("-")[0]
if(ISOLANGLIST.has(baseLang))return ISOLANGLIST.get(baseLang).nativeName
return language},SORT_CMP:Intl.Collator("fr"),formatMinDuration:function(date1,date2,shortFormat,addSign){const diffSec=Math.abs(date2.getTime()-date1.getTime())/1e3
const sign=addSign?date2.getTime()>date1.getTime()?addSign.indexOf("+")>=0?"+":"":addSign.indexOf("-")>=0?"-":"":""
const diffYear=Math.floor(diffSec/31536e3)
if(diffYear>=1)return shortFormat?`${sign}${diffYear}a.`:diffYear>1?`${sign}${diffYear} ans`:`1 an`
const diffMonth=Math.floor(diffSec/2592e3)
if(diffMonth>=1)return shortFormat?`${sign}${diffMonth}M.`:diffMonth>1?`${sign}${diffMonth} mois`:`1 mois`
const diffDay=Math.floor(diffSec/86400)
if(diffDay>=7){const week=Math.floor(diffDay/7)
return shortFormat?`${sign}${week}sem.`:diffDay>=14?`${sign}${week} semaines`:`1 semaine`}if(diffDay>=1)return shortFormat?`${sign}${diffDay}j.`:diffDay>1?`${sign}${diffDay} jours`:`1 jour`
const diffHour=Math.floor(diffSec/3600)
if(diffHour>=1)return shortFormat?`${sign}${diffHour}h.`:diffHour>1?`${sign}${diffHour} heures`:`1 heure`
const diffMin=Math.floor(diffSec/60)
if(diffMin>=1)return shortFormat?`${sign}${diffMin}min.`:diffMin>1?`${sign}${diffMin} minutes`:`1 minute`
return""},formatByteSize(bytes,forceUnit,showUnity=true,numberOptions){let scaleLevel=0
if(bytes==null||bytes<0)return"-"
while((bytes>1024||forceUnit&&scaleLevel<forceUnit)&&scaleLevel<EBytesUnits.po){bytes=bytes/1024
scaleLevel++}const bytesStr=bytes.toLocaleString("fr",numberOptions||{maximumFractionDigits:2})
if(!showUnity)return bytesStr
let scaleStr
switch(scaleLevel){case EBytesUnits.bytes:scaleStr=bytes>1?"Octets":"Octet"
break
case EBytesUnits.ko:scaleStr="Ko"
break
case EBytesUnits.mo:scaleStr="Mo"
break
case EBytesUnits.go:scaleStr="Go"
break
case EBytesUnits.to:scaleStr="To"
break
case EBytesUnits.po:scaleStr="Po"
break
default:scaleStr="-"
break}return`${bytesStr} ${scaleStr}`},formatDateDigitsToSec:new Intl.DateTimeFormat("fr",{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"})}
const ISOLANGLIST=new Map
ISOLANGLIST.set("fr",{name:"Français",nativeName:"Français"})
ISOLANGLIST.set("en",{name:"Anglais",nativeName:"English"})
ISOLANGLIST.set("es",{name:"Espagnol",nativeName:"Español"})
ISOLANGLIST.set("ar",{name:"Arabe",nativeName:"العربية"})

//# sourceMappingURL=lang.js.map