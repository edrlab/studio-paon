import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
export function isEndPointHolder(o){return o&&o.baseEndPoint!=null}export var EHttpStatusCode;(function(EHttpStatusCode){EHttpStatusCode[EHttpStatusCode["ok"]=200]="ok"
EHttpStatusCode[EHttpStatusCode["accepted"]=202]="accepted"
EHttpStatusCode[EHttpStatusCode["noContent"]=204]="noContent"
EHttpStatusCode[EHttpStatusCode["badRequest"]=400]="badRequest"
EHttpStatusCode[EHttpStatusCode["unauthorized"]=401]="unauthorized"
EHttpStatusCode[EHttpStatusCode["forbidden"]=403]="forbidden"
EHttpStatusCode[EHttpStatusCode["notFound"]=404]="notFound"
EHttpStatusCode[EHttpStatusCode["methodFailure"]=420]="methodFailure"
EHttpStatusCode[EHttpStatusCode["internalServerError"]=500]="internalServerError"
EHttpStatusCode[EHttpStatusCode["notImplemented"]=501]="notImplemented"
EHttpStatusCode[EHttpStatusCode["serviceUnvailable"]=503]="serviceUnvailable"
EHttpStatusCode[EHttpStatusCode["networkError"]=599]="networkError"})(EHttpStatusCode||(EHttpStatusCode={}))
export class RespError extends Error{constructor(message,response){super(message)
this.response=response}}export function isRespError(e){return(e===null||e===void 0?void 0:e.response)instanceof Response}export function isEndPointErrorHookable(endPoint){return endPoint&&"setErrorHook"in endPoint}export class AuthEndPoint{constructor(url,credentials,errorHook){this.credentials=credentials||"include"
this.errorHook=errorHook
if(url==null)return
if(url instanceof URL){this.url=url.href}else{this.url=new URL(url,document.baseURI).href}}fetch(path,format,init){return IO.resolveResp(this.doFetch(path,this.adjustRequest(init)),format,this.errorHook)}fetchJson(path,init){return IO.respJson(this.doFetch(path,this.adjustRequest(init)),this.errorHook)}fetchText(path,init){return IO.respText(this.doFetch(path,this.adjustRequest(init)),this.errorHook)}fetchDom(path,init){if(path)return this.resolve(path).fetchDom(null,init)
return IO.respDom(this.doFetch(path,this.adjustRequest(init)),this,this.errorHook)}fetchBlob(path,init){return IO.respBlob(this.doFetch(path,this.adjustRequest(init)),this.errorHook)}fetchVoid(path,init){return IO.respVoid(this.doFetch(path,this.adjustRequest(init)),this.errorHook)}importJs(path){const url=path?this.resolve(path).url:this.url
let crossOrigin
if(this.credentials==="include")crossOrigin="use-credentials"
else if(this.credentials==="same-origin")crossOrigin="anonymous"
let corsScript
if(crossOrigin){corsScript=document.createElement("script")
corsScript.crossOrigin=crossOrigin
corsScript.type="module"
corsScript.src=url
document.documentElement.appendChild(corsScript)
return import(url).finally(exports=>{corsScript.remove()
return exports})}return import(url)}adjustRequest(req){if(!req)req={}
req.credentials=this.credentials
return req}doFetch(path,init){return fetch(path?new URL(path,this.url).href:this.url,init)}resolve(url){return new AuthEndPoint(this.url?new URL(url,this.url):url,this.credentials,this.errorHook)}setErrorHook(errorHook){this.errorHook=errorHook
return this}toString(){return this.url}}export class PublicEndPoint extends AuthEndPoint{constructor(url,credentials,errorHook){super(url,credentials||"omit",errorHook)}resolve(url){return new PublicEndPoint(this.url?new URL(url,this.url):url,this.credentials,this.errorHook)}}export class BasicAuthEndPoint extends AuthEndPoint{constructor(url,user,pass,errorHook){super(url,"include",errorHook)
if(user)this.auth="Basic "+btoa(user+":"+pass)}adjustRequest(req){if(!req)req={}
if(req.headers){req.headers.Authorization=this.auth}else{req.headers={Authorization:this.auth}}return req}setAuth(auth){this.auth=auth
return this}resolve(url){return new BasicAuthEndPoint(this.url?new URL(url,this.url):url,null,null,this.errorHook).setAuth(this.auth)}}export class NotAvailableEndPoint{constructor(error=EHttpStatusCode.notImplemented,url="NotAvailableEndPoint"){this.error=error
this.url=url}fetch(path,format,init){return Promise.resolve(new Response(null,{status:this.error}))}fetchJson(path,init){return this.fetchVoid(path,init)}fetchText(path,init){return this.fetchVoid(path,init)}fetchDom(path,init){return this.fetchVoid(path,init)}fetchBlob(path,init){return this.fetchVoid(path,init)}fetchVoid(path,init){return Promise.reject(new RespError(path?`'${path}' from ${this.url}`:this.url,new Response(null,{status:this.error})))}importJs(path){return this.fetchVoid(path)}resolve(url){return new NotAvailableEndPoint(this.error,url)}}NotAvailableEndPoint.DEFAULT=new NotAvailableEndPoint
class EndPointDispatcher{get base(){return this._base||NotAvailableEndPoint.DEFAULT}get url(){return this.base.url}fetch(path,format,init){return(path?this.resolve(path):this.base).fetch(null,format,init)}fetchJson(path,init){return(path?this.resolve(path):this.base).fetchJson(null,init)}fetchText(path,init){return(path?this.resolve(path):this.base).fetchText(null,init)}async fetchDom(path,init){if(path)return this.resolve(path).fetchDom(null,init)
const dom=await this.base.fetchDom(null,init)
if(dom)dom.baseEndPoint=this
return dom}fetchBlob(path,init){return(path?this.resolve(path):this.base).fetchBlob(null,init)}fetchVoid(path,init){return(path?this.resolve(path):this.base).fetchVoid(null,init)}importJs(path){return(path?this.resolve(path):this.base).importJs(null)}}export class EndPointResolver extends EndPointDispatcher{constructor(){super(...arguments)
this._list=[]}addEndPoint(prefix,redirect){if(Object.isFrozen(this._list))this._list=this._list.slice()
this._list.push({prefix:prefix,redirect:redirect})
delete this._replace
return this}freeze(){Object.freeze(this._list)
return this}setBase(base){this._base=base
return this}clone(){return(new EndPointResolver).initFrom(this)}initFrom(other,newBase){this._list=Object.isFrozen(other._list)?other._list:other._list.slice()
this._base=newBase||other._base
return this}resolve(path){if(!path)return(new EndPointResolver).initFrom(this)
if(path.charCodeAt(0)===58){for(const entry of this._list){const len=entry.prefix.length
if(path.charCodeAt(len+1)===58&&path.substr(1,len)===entry.prefix){return(new EndPointResolver).initFrom(this,entry.redirect.resolve(path.substring(len+2)))}}}return(new EndPointResolver).initFrom(this,this._base?this._base.resolve(path):new NotAvailableEndPoint(EHttpStatusCode.badRequest,path))}resolvePath(path){if(path.charCodeAt(0)===58){for(const entry of this._list){const len=entry.prefix.length
if(path.charCodeAt(len+1)===58&&path.substr(1,len)===entry.prefix)return entry.redirect.resolve(path.substring(len+2)).url}}return path}resolveInText(text){if(!this._replace){const re=["(:("]
for(let i=0;i<this._list.length;i++){re.push(this._list[i].prefix,"|")}re[re.length-1]="):)"
this._replace=new RegExp(re.join(""),"g")}return text.replace(this._replace,(m,g1,g2)=>{for(const entry of this._list){const len=entry.prefix.length
if(g2===entry.prefix)return entry.redirect.url}return m})}}export class UrlQs extends URLSearchParams{toString(){return super.toString().replace(/\+/g,"%20")}}export var IO;(function(IO){IO.REQUEST_LANG_HEADER="X-Lang"
function asEndPoint(url){return new PublicEndPoint(new URL(url,document.baseURI))}IO.asEndPoint=asEndPoint
function resolveUrl(path,from){if(!path)return IO.absoluteUrl(from)
return new URL(path,IO.absoluteUrl(from)).href}IO.resolveUrl=resolveUrl
function absoluteUrl(path){if(!path)return document.baseURI
return new URL(path,document.baseURI).href}IO.absoluteUrl=absoluteUrl
function importAllJs(urls){return Promise.all(urls.map(ep=>ep.importJs()))}IO.importAllJs=importAllJs
async function openUrlExternal(url){if(!url)return
if(Desk.electron){const reply=await IO.sendMessage({type:"client:modules:external:openUrl",url:url})
if(reply.type=="error")return{msg:reply.msg}}else window.open(url)
return true}IO.openUrlExternal=openUrlExternal
function qs(...keyValue){const qs=new UrlQs
for(let i=0;i<keyValue.length;i=i+2){const value=keyValue[i+1]
if(value!=null)qs.append(keyValue[i],value)}return"?"+qs.toString()}IO.qs=qs
function query(startWithQuery,...keyValue){const qs=[]
for(let i=0;i<keyValue.length;i=i+2){const value=keyValue[i+1]
if(value===undefined)continue
if(startWithQuery===false){qs.push("&")}else{if(startWithQuery===true)qs.push("?")
startWithQuery=false}if(value!==null){qs.push(keyValue[i],"=",encodeURIComponent(value))}else{qs.push(keyValue[i])}}return qs.join("")}IO.query=query
function fd(...keyValue){const fd=new FormData
for(let i=0;i<keyValue.length;i=i+2){const value=keyValue[i+1]
if(value!=null)fd.append(keyValue[i],value)}return fd}IO.fd=fd
function getValidFileName(proposalName,suffix,addDate){let validFileName=proposalName.trim().replace(/[+$\\\/><|?:*#"~]+/g,"_").substring(0,48)
if(addDate){function s(num){const s=num.toString()
return s.length===1?"0"+s:s}const d=new Date
if(addDate==="date"){validFileName=`${validFileName}_${d.getFullYear()}-${s(d.getMonth()+1)}-${s(d.getDate())}`}else{validFileName=`${validFileName}_${d.getFullYear()}-${s(d.getMonth()+1)}-${s(d.getDate())}_${s(d.getHours())}-${s(d.getMinutes())}-${s(d.getSeconds())}`}}if(suffix)validFileName=validFileName+suffix
return validFileName}IO.getValidFileName=getValidFileName
function saveRespAs(urlEp,ctxElt,params,acceptCharset,method="GET"){const form=ctxElt.appendChild(ctxElt.ownerDocument.createElement("form"))
try{form.hidden=true
form.method=method
form.action=urlEp.url
if(acceptCharset)form.acceptCharset=acceptCharset
params===null||params===void 0?void 0:params.forEach((value,key)=>{const input=form.appendChild(ctxElt.ownerDocument.createElement("input"))
input.type="hidden"
input.name=key
input.value=value})
form.submit()}finally{form===null||form===void 0?void 0:form.remove()}}IO.saveRespAs=saveRespAs
function isRedirectValid(r,checkHostName){if(!r)return false
if(r.charAt(0)==="/"&&r.charAt(1)!=="/")return true
if(/^http(s)?:\/\//.test(r)||r.startsWith("//")){const target=new URL(r,document.baseURI)
const hostName=target.hostname
if(checkHostName===true){if(document.location.hostname!==hostName)return false}else if(Array.isArray(checkHostName)){if(document.location.hostname!==hostName&&checkHostName.indexOf(hostName)<0)return false}return true}return false}IO.isRedirectValid=isRedirectValid
function indexOf(url,inArray){return inArray.findIndex(u=>u.url===url.url)}IO.indexOf=indexOf
function appendUrl(toArray,...url){for(const u of url)if(indexOf(u,toArray)<0)toArray.push(u)}IO.appendUrl=appendUrl
function addLang(init,lang){const i=init||{}
if(!i.headers)i.headers={}
i.headers[IO.REQUEST_LANG_HEADER]=lang||REG.reg.getPref("lang")
return i}IO.addLang=addLang
async function respJson(promise,errorHook){let resp
try{resp=await promise}catch(e){if(errorHook)errorHook.onEndPointError(e)
throw e}if(!resp.ok){if(resp.status===404)return null
if(errorHook)errorHook.onEndPointError(resp)
throw new RespError("Status response: "+resp.status,resp)}return resp.status===204?null:resp.json()}IO.respJson=respJson
async function respText(promise,errorHook){let resp
try{resp=await promise}catch(e){if(errorHook)errorHook.onEndPointError(e)
throw e}if(!resp.ok){if(resp.status===404)return null
if(errorHook)errorHook.onEndPointError(resp)
throw new RespError("Status response: "+resp.status,resp)}return resp.status===204?null:resp.text()}IO.respText=respText
async function respDom(promise,endPoint,errorHook){let resp
try{resp=await promise}catch(e){if(errorHook)errorHook.onEndPointError(e)
throw e}if(!resp.ok){if(resp.status===404)return null
if(errorHook)errorHook.onEndPointError(resp)
throw new RespError("Status response: "+resp.status,resp)}return resp.status===204?null:DOM.parseDom(await resp.text(),endPoint)}IO.respDom=respDom
async function respBlob(promise,errorHook){let resp
try{resp=await promise}catch(e){if(errorHook)errorHook.onEndPointError(e)
throw e}if(!resp.ok){if(resp.status===404)return null
if(errorHook)errorHook.onEndPointError(resp)
throw new RespError("Status response: "+resp.status,resp)}return resp.blob()}IO.respBlob=respBlob
async function respVoid(promise,errorHook){let resp
try{resp=await promise}catch(e){if(errorHook)errorHook.onEndPointError(e)
throw e}if(!resp.ok){if(resp.status===404)return null
if(errorHook)errorHook.onEndPointError(resp)
throw new RespError("Status response: "+resp.status,resp)}}IO.respVoid=respVoid
async function resolveResp(promise,format="none",errorHook){let resp
try{resp=await promise
if(errorHook&&!resp.ok&&resp.status!==404)errorHook.onEndPointError(resp)
if(resp.status===EHttpStatusCode.noContent)return resp
if(format==="auto"){const ct=resp.headers.get("Content-type")||""
if(ct.indexOf("json")>=0){format="json"}else if(ct.indexOf("xml")>=0){format="dom"}else if(ct.indexOf("text")>=0){format="text"}}else if(!resp.ok){const ct=resp.headers.get("Content-type")
const len=resp.headers.get("Content-length")
if(ct&&len&&parseInt(len,10)>0){if(format==="json"&&ct.indexOf("json")<0)return resp
else if(format==="dom"&&ct.indexOf("xml")<0)return resp
else if(format==="text"&&ct.indexOf("text")<0)return resp}else return resp}switch(format){case"json":try{resp.asJson=await resp.json()}catch(e){resp.asText=await resp.text()
throw e}break
case"text":resp.asText=await resp.text()
break
case"dom":resp.asText=await resp.text()
resp.asDom=(new DOMParser).parseFromString(resp.asText,"text/xml")}return resp}catch(e){if(!resp)resp=new Response(null,{status:EHttpStatusCode.networkError})
resp.error=e
if(errorHook)errorHook.onEndPointError(resp)
return resp}}IO.resolveResp=resolveResp
function reportFromStatus(status){switch(status){case 200:return{status:"ok",desc:"Cette URL est valide."}
case 401:return{status:"auth",desc:"Cette URL requiert une authentification pour être contrôlée (erreur 401)."}
case 403:return{status:"auth",desc:"L\'accès à cette URL n\'est pas autorisé (erreur 403)."}
case 404:return{status:"error",desc:"Cette URL n\'est pas correcte (erreur 404)."}
case 405:case 501:return{status:"net",desc:`Impossible de contrôler cette URL automatiquement (erreur ${status}).`}
default:switch(status.toString().charAt(0)){case"2":return{status:"ok",desc:`Cette URL est valide (code ${status}).`}
case"3":return{status:"error",desc:`Cette URL est redirigée (code ${status}).`}
case"4":return{status:"error",desc:`Cette URL n\'est pas correcte (erreur client ${status}).`}
case"5":return{status:"error",desc:`Cette URL n\'est pas correcte (erreur serveur ${status}).`}
default:return{status:"error",desc:`Cette URL n\'est pas correcte (erreur ${status}).`}}}}IO.reportFromStatus=reportFromStatus
function sendMessage(message,targetOrigin=location.origin,timeout=5e3){const{port1:port1,port2:port2}=new MessageChannel
return new Promise((resolve,reject)=>{window.parent.postMessage(message,location.origin,[port2])
const rejectTimeout=timeout&&setTimeout(()=>{port1.close()
port2.close()
reject(new Error("Timeout while waiting for a reply"))},timeout)
port1.onmessage=ev=>{if(timeout)clearTimeout(rejectTimeout)
port1.close()
port2.close()
resolve(ev.data)}
port1.onmessageerror=()=>{if(timeout)clearTimeout(rejectTimeout)
port1.close()
port2.close()
reject(new Error("Unable to deserialize the reply"))}})}IO.sendMessage=sendMessage})(IO||(IO={}))

//# sourceMappingURL=io.js.map