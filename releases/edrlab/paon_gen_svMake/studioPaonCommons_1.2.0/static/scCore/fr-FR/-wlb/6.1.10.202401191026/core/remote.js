import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{CDM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/cdm.js"
import{ERROR}from"./errorReport.js"
export class RemoteRes{constructor(reg,resDesc,resDescAlt){this.reg=reg
this.resDesc=resDesc
this.resDescAlt=resDescAlt
this.url=this.resDescAlt?new URL(this.resDescAlt.path,this.resDesc.url).href:this.resDesc.url}async getBestWebRendition(){var _a
const webTag=(_a=(this.resDescAlt||this.resDesc).tags)===null||_a===void 0?void 0:_a.web
if(webTag)switch(webTag[0]){case"embeddable":return"iframe"
case"site":case"editor":case"pdf":return"window"
case"binary":return"download"
case"image":return"img"
case"audio":return"audio"
case"video":return"video"}if(this.resDescAlt)await this.fetchResDesc()
if(!this.statusOk())return null
const ctType=this.resDesc.type
if(ctType){if(ctType.startsWith("image/"))return"img"
if(ctType.startsWith("video/"))return"video"
if(ctType.startsWith("audio/"))return"audio"
if(ctType.startsWith("text/"))return"window"
if(ctType.startsWith("application/pdf")||ctType.startsWith("application/xhtml+xml"))return"window"}return"download"}getTags(){var _a
return(_a=this.resDescAlt||this.resDesc)===null||_a===void 0?void 0:_a.tags}statusOk(def=false){const st=this.resDesc.status
if(typeof st==="number")return st>=200&&st<=299
return def}async fetchResDesc(){if(!this.resDescAlt)return this
const newResDesc=await REMOTE.fetchResDesc(this.url,this.reg)||{url:this.url}
this.resDesc=newResDesc
this.resDescAlt=null
this.url=newResDesc.url
return this}}export var REMOTE;(function(REMOTE){REMOTE.CHECKURL_TIMEOUT=1e4
async function fetchResDesc(url,reg){const rmt=reg.env.universe.config.remoteContentUrl
if(rmt)return rmt.fetchJson(IO.qs("cdaction","GetResDesc","param",url))
return null}REMOTE.fetchResDesc=fetchResDesc
function remoteResForPreview(reg,resDesc){var _a,_b,_c,_d,_e,_f
const bestBody=["poster","metas","abstract","short"]
const bestBodyAlt=(_a=resDesc.alts)===null||_a===void 0?void 0:_a.reduce((best,alt)=>{var _a,_b
return!best||bestIdx(bestBody,(_a=alt.tags)===null||_a===void 0?void 0:_a.body)<bestIdx(bestBody,(_b=best===null||best===void 0?void 0:best.tags)===null||_b===void 0?void 0:_b.body)?alt:best},null)
if(bestBodyAlt&&bestIdx(bestBody,(_b=bestBodyAlt.tags)===null||_b===void 0?void 0:_b.body)<bestIdx(bestBody,(_c=resDesc.tags)===null||_c===void 0?void 0:_c.body))return new RemoteRes(reg,resDesc,bestBodyAlt)
const bestQua=["lowest","adapt","fair"]
const bestQuaAlt=(_d=resDesc.alts)===null||_d===void 0?void 0:_d.reduce((best,alt)=>{var _a,_b
return!best||bestIdx(bestQua,(_a=alt.tags)===null||_a===void 0?void 0:_a.quality)<bestIdx(bestQua,(_b=best.tags)===null||_b===void 0?void 0:_b.quality)?alt:best},null)
if(bestQuaAlt&&bestIdx(bestQua,(_e=bestQuaAlt.tags)===null||_e===void 0?void 0:_e.quality)<bestIdx(bestQua,(_f=resDesc.tags)===null||_f===void 0?void 0:_f.quality))return new RemoteRes(reg,resDesc,bestQuaAlt)
return new RemoteRes(reg,resDesc)}REMOTE.remoteResForPreview=remoteResForPreview
function remoteResAsVideo(reg,resDesc,prefQuality=["lowest","adapt","fair"]){var _a,_b,_c,_d,_e
const bestAlt=(_a=resDesc.alts)===null||_a===void 0?void 0:_a.reduce((best,alt)=>{var _a,_b,_c,_d
return((_b=(_a=alt.tags)===null||_a===void 0?void 0:_a.web)===null||_b===void 0?void 0:_b.indexOf("video"))>=0?!best||bestIdx(prefQuality,(_c=alt.tags)===null||_c===void 0?void 0:_c.quality)<bestIdx(prefQuality,(_d=best.tags)===null||_d===void 0?void 0:_d.quality)?alt:best:best},null)
const webTag=(_b=resDesc.tags)===null||_b===void 0?void 0:_b.web
if(webTag?webTag.indexOf("video")>=0:(_c=resDesc.type)===null||_c===void 0?void 0:_c.startsWith("video/")){if(!bestAlt||bestIdx(prefQuality,(_d=resDesc.tags)===null||_d===void 0?void 0:_d.quality)<bestIdx(prefQuality,(_e=bestAlt.tags)===null||_e===void 0?void 0:_e.quality))return new RemoteRes(reg,resDesc)}return bestAlt?new RemoteRes(reg,resDesc,bestAlt):null}REMOTE.remoteResAsVideo=remoteResAsVideo
function remoteResAsAudio(reg,resDesc,prefQuality=["lowest","fair"]){var _a,_b,_c,_d,_e
const bestAlt=(_a=resDesc.alts)===null||_a===void 0?void 0:_a.reduce((best,alt)=>{var _a,_b,_c,_d
return((_b=(_a=alt.tags)===null||_a===void 0?void 0:_a.web)===null||_b===void 0?void 0:_b.indexOf("audio"))>=0?!best||bestIdx(prefQuality,(_c=alt.tags)===null||_c===void 0?void 0:_c.quality)<bestIdx(prefQuality,(_d=best.tags)===null||_d===void 0?void 0:_d.quality)?alt:best:best},null)
const webTag=(_b=resDesc.tags)===null||_b===void 0?void 0:_b.web
if(webTag?webTag.indexOf("audio")>=0:(_c=resDesc.type)===null||_c===void 0?void 0:_c.startsWith("audio/")){if(!bestAlt||bestIdx(prefQuality,(_d=resDesc.tags)===null||_d===void 0?void 0:_d.quality)<bestIdx(prefQuality,(_e=bestAlt.tags)===null||_e===void 0?void 0:_e.quality))return new RemoteRes(reg,resDesc)}return bestAlt?new RemoteRes(reg,resDesc,bestAlt):null}REMOTE.remoteResAsAudio=remoteResAsAudio
function bestIdx(array,oneOf){const i=array&&oneOf?array.findIndex(v=>oneOf.indexOf(v)>=0):-1
return i>=0?i:Number.MAX_SAFE_INTEGER}function findEditorInResDesc(resDesc){var _a,_b,_c
if(((_b=(_a=resDesc===null||resDesc===void 0?void 0:resDesc.tags)===null||_a===void 0?void 0:_a.web)===null||_b===void 0?void 0:_b.indexOf("editor"))>=0)return resDesc
return(_c=resDesc===null||resDesc===void 0?void 0:resDesc.alts)===null||_c===void 0?void 0:_c.find(alt=>{var _a,_b
return((_b=(_a=alt.tags)===null||_a===void 0?void 0:_a.web)===null||_b===void 0?void 0:_b.indexOf("editor"))>=0})}REMOTE.findEditorInResDesc=findEditorInResDesc
function findFullViewInResDesc(resDesc){const bestBody=["full","short"]
return findViewInResDesc(resDesc,v=>{var _a,_b
return((_b=(_a=v.tags)===null||_a===void 0?void 0:_a.web)===null||_b===void 0?void 0:_b.indexOf("site"))>=0},(v1,v2)=>{var _a,_b
return bestIdx((_a=v2.tags)===null||_a===void 0?void 0:_a.body,bestBody)<bestIdx((_b=v1.tags)===null||_b===void 0?void 0:_b.body,bestBody)?v2:v1})}REMOTE.findFullViewInResDesc=findFullViewInResDesc
function findViewInResDesc(resDesc,must,best){if(resDesc==null)return null
let result=resDesc.tags&&must(resDesc.tags)?resDesc:null
if(resDesc.alts)result=resDesc.alts.reduce((b,c)=>must(c)?b?best(b,c):c:b,result)
return result}REMOTE.findViewInResDesc=findViewInResDesc
function buildUrlFromResDesc(resDesc,view){return view&&view!==resDesc?new URL(view.path,resDesc.url).href:resDesc.url}REMOTE.buildUrlFromResDesc=buildUrlFromResDesc
function urlRemoteContent(url,reg){var _a
return(_a=reg.env.universe.config.remoteContentUrl)===null||_a===void 0?void 0:_a.resolve(IO.qs("cdaction","GetContent","request",CDM.stringify({url:url}))).url}REMOTE.urlRemoteContent=urlRemoteContent
async function migrateUrls(urls,reg){const rmt=reg.env.universe.config.remoteContentUrl
if(rmt){try{const formData=new FormData
formData.append("urls",JSON.stringify(urls))
return await rmt.fetchJson(IO.qs("cdaction","MigrateUrls"),{method:"POST",body:formData})}catch(e){ERROR.log(`Error while migrating urls`,e)}}return urls}REMOTE.migrateUrls=migrateUrls
async function migrateUrl(url,reg){if(url&&(reg===null||reg===void 0?void 0:reg.env.universe.config.remoteContentUrl)){try{const result=await reg.env.universe.config.remoteContentUrl.fetchJson(IO.qs("cdaction","MigrateUrls","urls",CDM.stringify([url])))
return result?result[0]||url:url}catch(e){ERROR.log(`Error while migrating the url: ${url}`,e)}}return url}REMOTE.migrateUrl=migrateUrl
async function aliasUrl(url,reg){if(url&&(url.startsWith("http:")||url.startsWith("https:"))&&(reg===null||reg===void 0?void 0:reg.env.universe.config.remoteContentUrl)){try{const result=await reg.env.universe.config.remoteContentUrl.fetchJson(IO.qs("cdaction","AliasUrls","urls",CDM.stringify([url])))
return result?result[0]||url:url}catch(e){ERROR.log(`Error while alias the url: ${url}`,e)}}return url}REMOTE.aliasUrl=aliasUrl
async function aliasUrls(urls,reg){if(reg===null||reg===void 0?void 0:reg.env.universe.config.remoteContentUrl){try{const result=await reg.env.universe.config.remoteContentUrl.fetchJson(IO.qs("cdaction","AliasUrls","urls",CDM.stringify(urls)))
if(result){for(let i=0;i<result.length;i++){urls[i]=result[i]}}}catch(e){ERROR.log(`Error while alias the urls: ${urls}`,e)}}return urls}REMOTE.aliasUrls=aliasUrls
async function checkUrls(reqs,maxConcurrent,reg){const checkUrlsSelector=(reg||REG).reg.getSvc("checkUrlsSelector")||defaultCheckUrlSelector
const reports={}
const checkImplMap=new Map
const urls=[]
for(let req of reqs){if(typeof req==="string")req={url:req}
if(reg)urls.push(req.url)}if(reg){const migrUrls=await migrateUrls(urls,reg)
for(let i=0;i<migrUrls.length;i++){reqs[i].url=migrUrls[i]}}for(let req of reqs){const syntaxReport=checkUrlSyntax(req.url)
if(syntaxReport)reports[req.url]=syntaxReport
else{const impl=checkUrlsSelector(req.url,reg)
let implReqs=checkImplMap.get(impl)
if(!implReqs)checkImplMap.set(impl,implReqs=[])
implReqs.push(req)}}for(const impl of checkImplMap.keys()){const implReports=await impl(checkImplMap.get(impl),maxConcurrent)
Object.assign(reports,implReports)}return reports}REMOTE.checkUrls=checkUrls
function defaultCheckUrlSelector(url,reg){if(Desk.electron)return checkUrlsByElectron
else return checkUrlsByFetch}async function checkUrl(req,reg){if(typeof req==="string")req={url:req}
if(reg)req.url=req.url=await migrateUrl(req.url,reg)
const syntaxReport=checkUrlSyntax(req.url)
if(syntaxReport)return syntaxReport
else{const checkUrlsSelector=(reg||REG.reg).getSvc("checkUrlsSelector")||defaultCheckUrlSelector
const impl=checkUrlsSelector(req.url,reg)
const reports=await impl([req],1)
return reports[req.url]}}REMOTE.checkUrl=checkUrl
function checkUrlSyntax(url){let urlObj
try{urlObj=new URL(url)}catch(e){return{status:"invalid",desc:"La syntaxe de l\'URL est incorrecte."}}if(urlObj.protocol!="http:"&&urlObj.protocol!="https:"){return{status:"invalid",desc:"Cette URL ne peut être validée (protocole inconnu)."}}return null}REMOTE.checkUrlSyntax=checkUrlSyntax
async function checkUrlsByElectron(reqs,maxConcurrent){const timeout=reqs.reduce((acc,req)=>acc+(req.timeout||REMOTE.CHECKURL_TIMEOUT),0)+1
const checkReply=await IO.sendMessage({type:"client:modules:urlCheck:checkUrls",reqs:reqs,maxConcurrent:maxConcurrent},location.origin,timeout)
if(checkReply.type=="error")throw new Error(checkReply.msg)
else return checkReply.reports}REMOTE.checkUrlsByElectron=checkUrlsByElectron
async function checkUrlsByFetch(reqs,maxConcurrent){const reports=await LANG.promisesMap(reqs,checkUrlByFetch,maxConcurrent)
return LANG.reduceToDict(reports,index=>reqs[index].url)}REMOTE.checkUrlsByFetch=checkUrlsByFetch
function checkUrlByFetch(req){const abortController=new AbortController
const timeoutPromise=new Promise(resolve=>{setTimeout(()=>{abortController.abort()
resolve({status:"invalid",desc:"Délai d\'attente dépassé lors de l\'accès à cette URL."})},req.timeout||REMOTE.CHECKURL_TIMEOUT)})
const method=req.methods?req.methods[0]:"HEAD"
const fallbackMethods=req.methods&&req.methods.length>1?req.methods.slice(1):null
const fetchPromise=fetch(req.url,{method:method,credentials:"same-origin",signal:abortController.signal}).then(resp=>{if((resp.status==405||resp.status==501)&&fallbackMethods){const fallbackReq=Object.create(req)
fallbackReq.methods=fallbackMethods
return checkUrlByFetch(fallbackReq)}const report=IO.reportFromStatus(resp.status)
if(req.extractHeaders){report.headers={}
for(const extractHeader of req.extractHeaders){const headerName=extractHeader.toLowerCase()
if(headerName in resp.headers){const header=resp.headers.get(headerName)
if(header)report.headers[extractHeader]=header.split(",")}}}return report}).catch(()=>({status:"invalid",desc:"Impossible de contrôler cette URL depuis un navigateur."}))
return Promise.race([fetchPromise,timeoutPromise])}REMOTE.checkUrlByFetch=checkUrlByFetch})(REMOTE||(REMOTE={}))

//# sourceMappingURL=remote.js.map