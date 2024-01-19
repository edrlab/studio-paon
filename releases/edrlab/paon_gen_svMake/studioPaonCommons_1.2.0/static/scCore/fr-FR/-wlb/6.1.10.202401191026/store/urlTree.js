import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
export class UrlTreeSrv{constructor(url,anonymousAccount){this.url=url
this.anonymousAccount=anonymousAccount
this.naturalSortPathFn=URLTREE.defaultResPathSortFn
this.naturalSortNameFn=URLTREE.defaultResPathSortFn
this.naturalSortVersionFn=URLTREE.defaultResVersionSortFn}nodeInfos(path,directive){return this.url.fetchJson(URLTREE.path2RelativeUrl(path+(path.indexOf("?")<0?"?nodeInfos":"&nodeInfos")+(directive||"")))}listChildren(path,directive){return this.url.fetchJson(URLTREE.path2RelativeUrl(path+(path.indexOf("?")<0?"?listChildren":"&listChildren")+(directive||"")))}searchNodes(root,exp,max=250,from){return this.url.fetchJson(URLTREE.path2RelativeUrl(root+IO.query(root.indexOf("?")<0,"searchNodes",null,"exp",exp,"max",max,"from",from)))}infoViews(path){return this.url.fetchJson(URLTREE.path2RelativeUrl(path+(path.indexOf("?")<0?"?V=infoViews":"&V=infoViews")))}async fetchUserRolesMap(path){return await this.url.fetchJson(URLTREE.path2RelativeUrl(path+(path.indexOf("?")<0?"?userRolesMap":"&userRolesMap")))}async fetchUserRolesMapForAccounts(path,pAccounts){if(!pAccounts||pAccounts.length==0)return null
return await this.url.fetchJson(URLTREE.path2RelativeUrl(path+IO.query(path.indexOf("?")<0,"userRolesMap",null,"forUser",pAccounts.join("\t"))))}requestPath(path,directive,format,init){if(directive)path=path+(path.indexOf("?")<0?"?":"&")+directive
return this.url.fetch(URLTREE.path2RelativeUrl(path),format,init)}urlFromPath(path,directive){if(directive)path=path+(path.indexOf("?")<0?"?":"&")+directive
return this.url.resolve(URLTREE.path2RelativeUrl(path)).url}headers(path,directive){if(directive)path=path+(path.indexOf("?")<0?"?":"&")+directive
return this.url.fetch(URLTREE.path2RelativeUrl(path),"none",{method:"HEAD"})}extractSubPathFromUrl(url){const root=this.url.url
if(url&&url.startsWith(root)){if(root.charAt(root.length-1)==="/")return url.substring(root.length-1)
if(url.charAt(root.length)==="/")return url.substring(root.length)
if(url.length===root.length)return"/"}return null}extractResPathFromUrl(url){return URLTREE.extractResPathFromUrlPath(this.extractSubPathFromUrl(url))}}export function isNodeAutoFold(d){return d&&"from"in d}export var URLTREE;(function(URLTREE){URLTREE.DEFAULT_PATH_ROOT=""
function extractLeafName(resPath){if(resPath==null)return null
let i=resPath.lastIndexOf("?")
if(i>=0)return resPath.substring(i)
i=resPath.lastIndexOf("/")
return i>=0?resPath.substring(i+1):resPath}URLTREE.extractLeafName=extractLeafName
function extractUnversionedLeafName(resPath){if(resPath==null)return null
let i=resPath.lastIndexOf("?")
if(i<0){i=resPath.lastIndexOf("/")+1
if(i===0)return""}let end=resPath.indexOf("@",i)
return end>=0?resPath.substring(i,end):resPath.substring(i)}URLTREE.extractUnversionedLeafName=extractUnversionedLeafName
function extractParentPath(resPath){if(!resPath)return null
let i=resPath.lastIndexOf("?")
if(i>=0)return resPath.substring(0,i)
i=resPath.lastIndexOf("/")
return i>=0?resPath.substring(0,i):null}URLTREE.extractParentPath=extractParentPath
function extractUnversionedLeafPath(resPath){if(resPath==null)return null
let i=resPath.lastIndexOf("?")
if(i<0)i=resPath.lastIndexOf("/")
i=resPath.indexOf("@",i)
return i>=0?resPath.substring(0,i):resPath}URLTREE.extractUnversionedLeafPath=extractUnversionedLeafPath
function extractUnversionedPath(resPath){if(resPath==null)return null
return resPath.replace(/@[^\/]+/g,"")}URLTREE.extractUnversionedPath=extractUnversionedPath
function extractVersionLeaf(resPath){if(resPath==null)return null
let i=resPath.lastIndexOf("?")
if(i<0)i=resPath.lastIndexOf("/")
i=resPath.indexOf("@",i+1)
return i>=0?resPath.substring(i):null}URLTREE.extractVersionLeaf=extractVersionLeaf
function switchLeafVersionPath(resPath,newVersion){if(resPath==null)return null
let i=resPath.lastIndexOf("?")
if(i<0)i=resPath.lastIndexOf("/")
i=resPath.indexOf("@",i)
return(i>=0?resPath.substring(0,i):resPath)+"@"+(typeof newVersion==="number"?"."+newVersion:newVersion)}URLTREE.switchLeafVersionPath=switchLeafVersionPath
function buildPermaName(node){if(node==null)return null
return node.v?node.n+"@"+node.v:node.n}URLTREE.buildPermaName=buildPermaName
function appendToPath(path,subPath){if(!subPath||subPath===".")return path
if(path==null){if(!subPath)return URLTREE.DEFAULT_PATH_ROOT
path=""}return subPath.charAt(0)==="?"?path+subPath:path+"/"+subPath}URLTREE.appendToPath=appendToPath
function appendLeafToPath(path,node){if(path==null)return buildPermaName(node)
return appendToPath(path,buildPermaName(node))}URLTREE.appendLeafToPath=appendLeafToPath
function isRootPath(path){return path.indexOf("/")<0&&path.lastIndexOf("?")<0}URLTREE.isRootPath=isRootPath
function isQueryPath(path){return path.lastIndexOf("?")>=0}URLTREE.isQueryPath=isQueryPath
function isDescendantPath(ancestorPath,path){const c=path.charAt(ancestorPath.length)
if(c!=="/"&&c!=="?")return false
return path.startsWith(ancestorPath)}URLTREE.isDescendantPath=isDescendantPath
function isDescendantPathOrEqual(ancestorPath,path,anyAncLeafVersion){const c=path.charAt(ancestorPath.length)
if(c==="/"||c==="?"||anyAncLeafVersion&&c==="@")return path.startsWith(ancestorPath)
return ancestorPath===path}URLTREE.isDescendantPathOrEqual=isDescendantPathOrEqual
function isParentPath(parentPath,path){const parentLen=parentPath.length
if(path.length>parentLen&&path.startsWith(parentPath)){const c=path.charAt(parentLen)
if(c==="?")return true
return c==="/"&&path.indexOf("/",parentLen+1)<0&&path.indexOf("?",parentLen+1)<0}return false}URLTREE.isParentPath=isParentPath
function path2RelativeUrl(path){return path.charAt(0)==="/"?path.substr(1):path}URLTREE.path2RelativeUrl=path2RelativeUrl
function extractResPathFromUrlPath(urlPath){if(!urlPath)return urlPath
if(urlPath.charAt(0)==="/"){if(urlPath.length===1)return URLTREE.DEFAULT_PATH_ROOT
if(urlPath.charAt(1)==="@")urlPath=urlPath.substring(1)}const query=urlPath.indexOf("?")
if(query>0){const qs=urlPath.substring(query)
if(!qs.startsWith("?V="))urlPath=urlPath.substring(0,query)
else{const next=urlPath.indexOf("&",query)
if(next>0)urlPath=urlPath.substring(0,next)}}return urlPath}URLTREE.extractResPathFromUrlPath=extractResPathFromUrlPath
function concatUrl(root,subPath){if(subPath.charAt(0)==="/"){return root.charAt(root.length-1)==="/"?root+subPath.substr(1):root+subPath}else{return root.charAt(root.length-1)==="/"?root+subPath:root+"/"+subPath}}URLTREE.concatUrl=concatUrl
function isValidResName(resName){if(!resName)return"Un nom est requis."
if(/[@+$\\\/><|!?:*#"~]/.test(resName))return'Le nom ne doit comporter aucun des caractères suivants : @ $ + \\ / > < | ! ? : * # \" ~'
if(/\.\./.test(resName))return"Le nom ne doit pas comporter deux points successifs."
return true}URLTREE.isValidResName=isValidResName
function filterResName(name){return name.replace(/[@+$\\\/><|!?:*#"~\s]/g,"")}URLTREE.filterResName=filterResName
function defaultResSortFn(a,b){return defaultResPathSortFn(a.permaPath,b.permaPath)}URLTREE.defaultResSortFn=defaultResSortFn
function defaultResPathSortFn(p1,p2){const s1=p1.length
const s2=p2.length
for(let i=0,m=Math.min(s1,s2);i<m;i++){const c1=p1.codePointAt(i)
const c2=p2.codePointAt(i)
if(c1===c2)continue
if(c1<127){if(c2<127)return URITREE_ASCII_ORDER[c1]-URITREE_ASCII_ORDER[c2]
return-1}return c1-c2}if(s1===s2)return 0
return s1-s2}URLTREE.defaultResPathSortFn=defaultResPathSortFn
function defaultResVersionSortFn(v1,v2){if(!v1)return v2?-1:0
if(!v2)return 1
const n1=v1.split(/\D+/)
const n2=v2.split(/\D+/)
for(let i=0;i<n1.length;i++){if(i===n2.length)return-1
const d1=Number.parseInt(n1[i])
const d2=Number.parseInt(n2[i])
if(d1!==d2)return d2-d1}return n1.length===n2.length?0:1}URLTREE.defaultResVersionSortFn=defaultResVersionSortFn})(URLTREE||(URLTREE={}))
const URITREE_ASCII_ORDER=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,34,35,36,37,38,39,40,41,42,43,44,45,46,47,33,32,61,62,63,64,65,66,67,68,69,70,48,49,50,51,52,53,54,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,55,56,57,58,59,60,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,122,123,124,125,126]

//# sourceMappingURL=urlTree.js.map