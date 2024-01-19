import{EHttpStatusCode,IO,UrlQs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
export class DepotCidSrv{constructor(config){this.config=config}newSession(){return new DepotCidSession(this)}syncSend(request){request.synch=true
request.createMetas=true
if(!request.body)request.scContent="none"
return sendCidRequest(this.config.cidUrl,request,null)}sendRequestToSession(sessionId,request){return sendCidRequest(this.config.cidUrl,request,sessionId)}extractCidLocalizedErrorMsg(err){while(err){if(Array.isArray(err.scCidSessDetails)){err=err.scCidSessDetails.find(entry=>entry.type==="error")}else if(typeof err.msg){const m=this.findLocalizedErrorMsg(err,DepotCidSrv.errorMsgMain)||this.findLocalizedErrorMsg(err,DepotCidSrv.errorMsgSecond)
if(m)return m
break}}return"Une erreur inconnue est survenue"}findLocalizedErrorMsg(cidDetail,map){const m=map.get(cidDetail.msg)
if(m)return LANG.formatStr(m,cidDetail.vars)
let logMsg=cidDetail.details
while(logMsg){const m=map.get(logMsg.desc)
if(m)return LANG.formatStr(m,logMsg.vars)
logMsg=logMsg.parent}return null}}DepotCidSrv.errorMsgMain=new Map
DepotCidSrv.errorMsgSecond=new Map
function fillMainMsg(map){map.set("Concurrent update while editing '%s'","Cette ressource \'%s\' a été modifiée entre temps, vos modifications n\'ont pu être prises en compte.")
map.set("Concurrent update failed for '%s' (previous version not found)","Cette ressource \'%s\' a probablement été supprimée entre temps, vos modifications n\'ont pu être prises en compte.")
map.set("Cid task started denied due to server closing","L\'enregistrement de cette ressource a échoué car le serveur est momentanément indisponible.")
map.set("Cid task started denied due to concurrent processes","L\'enregistrement de cette ressource a échoué car d\'autres modifications sont en cours de traitement")}fillMainMsg(DepotCidSrv.errorMsgMain)
export function configDepotCidSrv(authenticatedExecFrameUrl,publicExecFrameUrl,config){if(!config)config={}
if(!config.cidUrl)config.cidUrl=authenticatedExecFrameUrl.resolve("u/cid")
if(publicExecFrameUrl&&!config.cidInSessionUrl)config.cidInSessionUrl=publicExecFrameUrl.resolve("u/cid")
if(!config.cidInSessionUrl)config.cidInSessionUrl=config.cidUrl
return config}export class DepotCidSession{constructor(cidServer){this.cidServer=cidServer}startSession(){if(this.sessionId)throw Error("Cid session  already started.")
return sendCidRequest(this.cidServer.config.cidUrl,{cidMetas:{},returnProps:"scCidSessId"},null).then(r=>{this.sessionId=r.scCidSessId
return r})}send(request){if(this.sessionId)return sendCidRequest(this.cidServer.config.cidUrl,request,this.sessionId)
request.returnProps=appendSessId(request.returnProps)
return sendCidRequest(this.cidServer.config.cidInSessionUrl,request,null).then(r=>{this.sessionId=r.scCidSessId
return r})}waitForEndSession(returnProps,intervalInMs=800,intermediateCb){if(!this.sessionId)throw Error("Cid session never started.")
let path="?cdaction=RequestSession&scCidSessId="+this.sessionId+"&scResp=200-202"
if(returnProps)path=path+"&returnProps="+(Array.isArray(returnProps)?returnProps.join("*"):returnProps)
let interval=intervalInMs/4
const waitEndSession=(resolve,reject)=>{setTimeout(()=>{try{this.cidServer.config.cidInSessionUrl.fetch(path,"none").then(r=>{if(r.status===EHttpStatusCode.accepted){if(intermediateCb)r.json().then(intermediateCb)
if(interval<intervalInMs)interval*=2
waitEndSession(resolve,reject)}else{resolve(returnProps?r.json():null)}},reject)}catch(e){reject(e)}},interval)}
return new Promise(waitEndSession)}}function appendSessId(props){if(!props)return"scCidSessId"
if(Array.isArray(props)){if(props.indexOf("scCidSessId")<0)props.push("scCidSessId")}else{if(props.indexOf("scCidSessId")<0)props+="*scCidSessId"}return props}function sendCidRequest(endPoint,request,scCidSessId,interactionLang){const initReq={method:"POST"}
const qs=new UrlQs
if(scCidSessId){qs.append("cdaction","RequestSession")
qs.append("scCidSessId",scCidSessId)}else{qs.append("cdaction","StartSession")}let cidInteractionLang=interactionLang
if(!cidInteractionLang){const reqInit=IO.addLang()
if(reqInit===null||reqInit===void 0?void 0:reqInit.headers)cidInteractionLang=reqInit.headers[IO.REQUEST_LANG_HEADER]}if(cidInteractionLang)qs.append("interactionLang",cidInteractionLang)
if(request.synch)qs.append("synch","true")
if(request.createMetas)qs.append("createMetas","true")
if(request.scContent)qs.append("scContent",request.scContent)
if(request.returnProps)qs.append("returnProps",Array.isArray(request.returnProps)?request.returnProps.join("*"):request.returnProps)
qs.append("scResp",request.scResp||"200-403")
if(request.cidMetasLocation==="queryString"){for(const key in request.cidMetas){const v=request.cidMetas[key]
if(v!=null)qs.append(key,typeof v==="object"?JSON.stringify(v):v)}if(request.body){initReq.method="PUT"
initReq.headers={"Content-Type":"application/binary"}
initReq.body=request.body}}else if(request.cidMetasLocation==="header"){initReq.headers={}
for(const key in request.cidMetas){const v=request.cidMetas[key]
if(v!=null)initReq.headers[key]=typeof v==="object"?JSON.stringify(v):v}initReq.body=request.body
if(request.body){initReq.method="PUT"
initReq.body=request.body}}else{initReq.method="POST"
const formData=new FormData
for(const key in request.cidMetas){const v=request.cidMetas[key]
if(v!=null)formData.append(key,typeof v==="object"?JSON.stringify(v):v)}if(request.body){if(request.body instanceof ArrayBuffer)request.body=new Blob([request.body])
formData.set("cidContent",request.body)}initReq.body=formData}if(request.progress){return new Promise((resolved,rejected)=>{const xhr=new XMLHttpRequest
xhr.upload.addEventListener("progress",ev=>{request.progress(ev.loaded,ev.lengthComputable?ev.total:undefined)})
xhr.onload=ev=>{resolved(JSON.parse(xhr.responseText))}
xhr.onerror=rejected
xhr.withCredentials=true
if(initReq.headers)for(let h in initReq.headers){xhr.setRequestHeader(h,initReq.headers[h])}xhr.open(initReq.method,endPoint.url+"?"+qs.toString())
xhr.send(initReq.body)})}return endPoint.fetchJson("?"+qs.toString(),initReq)}
//# sourceMappingURL=cid.js.map