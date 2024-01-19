import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
export var ESrcSt;(function(ESrcSt){ESrcSt[ESrcSt["none"]=-1]="none"
ESrcSt[ESrcSt["conflict"]=-2]="conflict"
ESrcSt[ESrcSt["file"]=1]="file"
ESrcSt[ESrcSt["folder"]=2]="folder"})(ESrcSt||(ESrcSt={}))
export var RESPS;(function(RESPS){function toRespsList(involvedUsers){if(!involvedUsers)return null
const list={}
involvedUsers.forEach(entry=>{if(entry.resp)entry.resp.forEach(resp=>{if(!list[resp])list[resp]=[]
if(entry.usr)list[resp].push(entry.usr)})})
return list}RESPS.toRespsList=toRespsList})(RESPS||(RESPS={}))
export var SRC;(function(SRC){SRC.URI_ROOT=""
function srcRef(ident){return ident.srcId||ident.srcUri}SRC.srcRef=srcRef
function addLeafToUri(uriParent,leafName){if(uriParent==null)throw Error("SRC.addLeafToUri : uriParent is null.")
return uriParent+"/"+leafName}SRC.addLeafToUri=addLeafToUri
function extractUriParent(uri){if(uri==null)throw Error("src.extractUriParent : uri is null.")
if(uri=="")return null
const idx=uri.lastIndexOf("/")
if(idx<=0)return""
return uri.substring(0,idx)}SRC.extractUriParent=extractUriParent
function extractLeafFromUri(uri){if(uri==null)throw Error("src.extractLeafFromUri : uri is null.")
const idx=uri.lastIndexOf("/")+1
return uri.substring(idx)}SRC.extractLeafFromUri=extractLeafFromUri
function isSubUri(ancestorUri,uri){return uri.startsWith(ancestorUri)&&uri.charAt(ancestorUri.length)==="/"}SRC.isSubUri=isSubUri
function isSubUriOrEqual(ancestorUri,uri){const parentLen=ancestorUri.length
if(parentLen===uri.length)return ancestorUri===uri
return uri.startsWith(ancestorUri)&&uri.charAt(parentLen)==="/"}SRC.isSubUriOrEqual=isSubUriOrEqual
function isParentUri(parentUri,uri){const parentLen=parentUri.length
if(uri.length>parentLen&&uri.lastIndexOf(parentUri,0)==0){return uri.charAt(parentLen)==="/"&&uri.indexOf("/",parentLen+1)<0}return false}SRC.isParentUri=isParentUri
function matchExt(fileName,ext){const startExt=fileName.length-ext.length
if(ext.charAt(0)!=="."&&fileName.charAt(startExt-1)!==".")return false
return fileName.substring(startExt).toLowerCase()===ext.toLowerCase()}SRC.matchExt=matchExt
function isValidPartUri(name,fromForNotif){let r=true
if(/[+$\\\/><|?:*#"~]/.test(name))r='Le nom ne doit comporter aucun des caractères suivants : $ + \\ / > < | ? : * # \" ~'
if(r===true&&/\.\./.test(name))r="Le nom ne doit pas comporter deux points successifs."
if(r===true&&name.charAt(0)==".")r="Le nom ne peut pas commencer par un point."
if(fromForNotif&&r!==true)POPUP.showNotifWarning(r,fromForNotif)
return r}SRC.isValidPartUri=isValidPartUri
function filterPartUri(name){return name.replace(/[+$\\\/><|?:*#"~\s]/g,"")}SRC.filterPartUri=filterPartUri
SRC.ID_PREFIX="id:"
function isSrcId(srcRef){return srcRef?srcRef.lastIndexOf(SRC.ID_PREFIX,0)===0:false}SRC.isSrcId=isSrcId
SRC.NEW_PREFIX="new:"
function isNewSrcUri(srcUri){return srcUri?srcUri.lastIndexOf(SRC.NEW_PREFIX,0)===0:false}SRC.isNewSrcUri=isNewSrcUri
function createNewSrcUri(itModel){return`${SRC.NEW_PREFIX}${itModel}:${Math.random().toString(36).substr(2)}`}SRC.createNewSrcUri=createNewSrcUri
function extractItModelFromNewSrcUri(srcUri){if(!isNewSrcUri(srcUri))return null
const end=srcUri.indexOf(":",SRC.NEW_PREFIX.length)
return end>0?srcUri.substring(SRC.NEW_PREFIX.length,end):srcUri.substring(SRC.NEW_PREFIX.length)}SRC.extractItModelFromNewSrcUri=extractItModelFromNewSrcUri
function resolveAliasSrcFields(fields){const set=new Set
for(let k of fields){if(k in aliasSrcFields)for(let f of aliasSrcFields[k])set.add(f)
else set.add(k)}return set}SRC.resolveAliasSrcFields=resolveAliasSrcFields
const aliasSrcFields={sdFs:["srcUri","srcSt","srcDt","srcRi","srcRoles"],sdOdb:["srcUri","srcSt","srcDt","srcRi","srcRoles","srcId","srcStamp","srcUser"],item:["itTi","itSt","itSgn","itModel"]}
function sortSrcUriTree(p1,p2){const s1=p1.length
const s2=p2.length
for(let i=0,m=Math.min(s1,s2);i<m;i++){const c1=p1.codePointAt(i)
const c2=p2.codePointAt(i)
if(c1===c2)continue
if(c1<127){if(c2<127)return URITREE_ASCII_ORDER[c1]-URITREE_ASCII_ORDER[c2]
return-1}else{return c1-c2}}if(s1===s2)return 0
return s1-s2}SRC.sortSrcUriTree=sortSrcUriTree
function extractIdFromSrcId(srcId){return srcId.substr(3)}SRC.extractIdFromSrcId=extractIdFromSrcId
function refUri2AgtBagId(srcUri){return srcUri.replace(/\//g,"\\")+";"}SRC.refUri2AgtBagId=refUri2AgtBagId
function refUri2AgtPath(srcUri,axis,role,nodeId){let vPath="@"+refUri2AgtBagId(srcUri)
if(nodeId)vPath+=nodeId
if(role)vPath+="_"+role
if(axis)vPath+="_A"+axis
return vPath}SRC.refUri2AgtPath=refUri2AgtPath})(SRC||(SRC={}))
const URITREE_ASCII_ORDER=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,34,35,36,37,38,39,40,41,42,43,44,45,46,47,33,32,61,62,63,64,65,66,67,68,69,70,48,49,50,51,52,53,54,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,55,56,57,58,59,60,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,122,123,124,125,126]

//# sourceMappingURL=src.js.map