import{IO,UrlQs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{EventMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
export var ECidSessionState;(function(ECidSessionState){ECidSessionState[ECidSessionState["notStarted"]=0]="notStarted"
ECidSessionState[ECidSessionState["uiProcessSel"]=1]="uiProcessSel"
ECidSessionState[ECidSessionState["authenticating"]=2]="authenticating"
ECidSessionState[ECidSessionState["uiAuth"]=3]="uiAuth"
ECidSessionState[ECidSessionState["inStep"]=4]="inStep"
ECidSessionState[ECidSessionState["ended"]=5]="ended"
ECidSessionState[ECidSessionState["aborted"]=6]="aborted"
ECidSessionState[ECidSessionState["failed"]=7]="failed"})(ECidSessionState||(ECidSessionState={}))
export class CidSession{constructor(config){this.config=config
this.state=ECidSessionState.notStarted
this.sessionProps={}
this.metasOut=Object.assign({},config.metasIn)
this.onStateChange=new EventMgr}async doSession(){try{if(this.state!==ECidSessionState.notStarted)throw Error("CidSession already started")
if(this.config.process){this.cidProcess=this.config.process}else{const prcs=CID.filterIsFirst(this.config.processes||this.config.manifest.processes,this.config.isProcess)
if(prcs.size>1){this.changeState(ECidSessionState.uiProcessSel)
this.cidProcess=await this.config.uiHandler.selectProcess(this,prcs)
if(this.cidProcess==null){this.changeState(ECidSessionState.aborted)
return}else{if(this.state===ECidSessionState.aborted)return}}else if(prcs.size===1){this.cidProcess=prcs.keys().next().value}else{this.cidProcess=null}}if(this.cidProcess==null){this.onStepFailed("noProcessFound","Aucun traitement compatible n\'a pu être trouvé.")
return}if(this.config.foreignMetas){const metas=this.cidProcess.metas
for(const fm of this.config.foreignMetas){for(const m of metas.values()){if(CID.isMatch(fm.is,m.is)){this.metasOut[m.name]=typeof fm.value==="function"?fm.value(this):fm.value
break}}}}this.cidTransport=this.cidProcess.transport
this.changeState(ECidSessionState.authenticating)
const authUrl=await this.cidTransport.needWebAuth(this)
if(this.state===ECidSessionState.aborted)return
if(authUrl){this.changeState(ECidSessionState.uiAuth)
if(await this.processResult(this.config.uiHandler.webAuth(this,authUrl)))return}for(const step of this.cidProcess.steps){this.currentStep=step
this.changeState(ECidSessionState.inStep)
if(await this.processResult(step.doStep(this)))return}this.changeState(ECidSessionState.ended)}catch(e){this.changeState(ECidSessionState.failed)
ERROR.report("Une erreur est survenue au cours de ce traitement",e)
throw e}finally{if(this.currentFrame)removeInteractPending(this.currentFrame,this)}}abortSession(){if(!this.isClosed())this.changeState(ECidSessionState.aborted)}isClosed(){return this.state===ECidSessionState.ended||this.state===ECidSessionState.failed||this.state===ECidSessionState.aborted}onCidFrameMessage(datas){if(!removeInteractPending(this.currentFrame,this))return
const resolver=this.currentResolver
if(!resolver)return
this.currentResolver=null
this.currentFrame=null
if(this.state===ECidSessionState.uiAuth){if(datas.cidAuth==="succeeded"){delete datas.cidAuth
resolver({metas:datas})}else{resolver({error:"authFailed"})}}else if(this.currentStep){if(datas.cidInteraction==="ended"){delete datas.cidInteraction
resolver({metas:datas})}else{resolver({error:"abort"})}}}_setCurrentFrame(frame){addInteractPending(frame,this)
this.currentFrame=frame
return new Promise((resolve,reject)=>{this.currentResolver=resolve})}_updateProps(newProps){if(!newProps)return
const sessProps=this.cidTransport.sessionProps
for(const k in newProps){let v=newProps[k]
switch(typeof v){case"boolean":case"number":case"bigint":v=v.toString()
break
case"object":v=JSON.stringify(v)
break}if(this.sessionProps&&sessProps&&sessProps.has(k))this.sessionProps[k]=v
else this.metasOut[k]=v}}async processResult(futureResult){let result
try{result=await futureResult}catch(e){result={error:"serverFailed",errorReason:e}}if(this.state===ECidSessionState.aborted)return true
if(result.error){if(result.error==="abort"){this.changeState(ECidSessionState.aborted)}else{this.onStepFailed(result.error,result.errorReason,result.errorHttpCode)}return true}this._updateProps(result.metas)
return false}onStepFailed(error,reason,httpCode){this.failedError=error
this.failedReason=reason
this.failedHttpCode=httpCode
this.changeState(ECidSessionState.failed)}changeState(state){this.state=state
this.onStateChange.emit(this)}}export class CidManifest{constructor(url,def){this.def=def
this.processes=[]
this.transports=[]
this.manifestUrl=url
if(!def||def.localName!=="manifest"||def.namespaceURI!==CID.CID_NS)throw Error("Invalid cid manifest: "+url)
const transports=DOM.findLastChild(def,n=>DOM.IS_element(n)&&n.localName==="transports"&&n.namespaceURI===CID.CID_NS)
if(!transports)throw Error("No transports definition found")
for(let trsp=transports.firstElementChild;trsp;trsp=trsp.nextElementSibling){if(trsp.localName==="webTransport"&&trsp.namespaceURI===CID.CID_NS){this.transports.push(new CidWebTransport(trsp))}}for(let prc=def.firstElementChild;prc;prc=prc.nextElementSibling){if(prc.localName==="process"&&prc.namespaceURI===CID.CID_NS){this.processes.push(new CidProcess(prc,this.getTransport(prc.getAttribute("ids"))))}}}get label(){return this._label===undefined?this._label=parseLabel(this.def):this._label}getProcesses(...is){return Array.from(CID.filterIsFirst(this.processes,is))}getTransport(ids){if(!ids||ids.length===0)return this.transports[0]
for(const id of ids.split(" ")){const tr=this.transports.find(t=>t.id===id)
if(tr)return tr}return null}}export class CidProcess{constructor(def,transport){this.def=def
this.transport=transport
if(!transport)throw Error("No transport found")
this.is=parseIs(def)}get label(){return this._label===undefined?this._label=parseLabel(this.def):this._label}get steps(){if(!this._steps){this._steps=[]
for(let step=this.def.firstElementChild;step;step=step.nextElementSibling){if(step.namespaceURI!==CID.CID_NS)continue
if(step.localName==="exchange")this._steps.push(new CidExchangeStep(step))
else if(step.localName==="interact")this._steps.push(new CidInteractiveStep(step))
else if(step.localName==="upload")this._steps.push(new CidUploadStep(step))}}return this._steps}get metas(){if(!this._metas){this._metas=new Map
for(let meta=this.def.firstElementChild;meta;meta=meta.nextElementSibling){if(meta.namespaceURI!==CID.CID_NS)continue
if(meta.localName==="meta")this._metas.set(meta.getAttribute("name"),new CidMetaDef(meta))}}return this._metas}}export class CidMetaDef{constructor(def){this.def=def
this.is=parseIs(def)}get name(){return this.def.getAttribute("name")}get isExcludeForRecall(){return this.def.getAttribute("forRecall")==="exclude"}}export class CidStep{constructor(def){this.def=def}getUiStepDef(){return this.def}initFrame(frame,session){const uiStepDef=this.getUiStepDef()
const urlObj=parseCidStepUrl(uiStepDef)
const url=urlObj?urlObj.getStr("fr"):null
const webInteract=session.cidTransport.webInteract
if(webInteract.POST_MULTIPART||webInteract.POST_URLENC){if(!frame.name)frame.name="cid"+Math.round(Math.random()*1e7)
const form=JSX.createElement("form",{method:"POST",enctype:webInteract.POST_URLENC?"application/x-www-form-urlencoded":"multipart/form-data",target:frame.name,action:url})
CidStep.enrichForm(form,session,uiStepDef)
form.submit()}else if(webInteract.GET){frame.src=CidStep.enrichUrl(url,session,uiStepDef)}else{throw Error("webInteract not allowed in this transport: "+DOM.debug(session.cidTransport.def))}return session._setCurrentFrame(frame)}static enrichUrl(url,session,elt){const qs=new UrlQs
this.enrichParams(qs,session,elt)
if(url.indexOf("?")>0)return url+="&"+qs.toString()
else return url+="?"+qs.toString()}static enrichParams(p,session,elt,checkNeeds=true){for(const k in session.sessionProps)p.append(k,session.sessionProps[k])
for(const k of metasUsesForStep(elt,session)){const v=session.metasOut[k]
if(v!=null)p.append(k,v)}let missingNeeds=[]
for(const k of metasNeedsForStep(elt)){const v=session.metasOut[k]
if(v!=null)p.append(k,v)
else missingNeeds.push(k)}if(checkNeeds&&missingNeeds.length>0)throw Error("Missing needs properties: "+missingNeeds.join(", "))
return p}static enrichForm(form,session,elt,checkNeeds=true){for(const k in session.sessionProps)form.appendChild(JSX.createElement("input",{type:"hidden",name:k,value:session.sessionProps[k]}))
for(const k of metasUsesForStep(elt,session)){const v=session.metasOut[k]
if(v!=null)form.appendChild(JSX.createElement("input",{type:"hidden",name:k,value:v}))}let missingNeeds=[]
for(const k of metasNeedsForStep(elt)){const v=session.metasOut[k]
if(v!=null)form.appendChild(JSX.createElement("input",{type:"hidden",name:k,value:v}))
else missingNeeds.push(k)}if(checkNeeds&&missingNeeds.length>0)throw Error("Missing needs properties: "+missingNeeds.join(", "))}static enrichHeaders(session,elt,checkNeeds=true){const p={}
for(const k in session.sessionProps)p[k]=session.sessionProps[k]
for(const k of metasUsesForStep(elt,session)){const v=session.metasOut[k]
if(v!=null)p[k]=v}let missingNeeds=[]
for(const k of metasNeedsForStep(elt)){const v=session.metasOut[k]
if(v!=null)p[k]=v
else missingNeeds.push(k)}if(checkNeeds&&missingNeeds.length>0)throw Error("Missing needs properties: "+missingNeeds.join(", "))
return p}}export class CidWebAuthStep extends CidStep{doStep(session){return session.config.uiHandler.webAuth(session,this)}}export class CidInteractiveStep extends CidStep{doStep(session){return session.config.uiHandler.interact(session,this)}}export class CidExchangeStep extends CidStep{getUiStepDef(){return DOM.findFirstChild(this.def,n=>DOM.IS_element(n)&&n.localName==="userWait"&&n.namespaceURI===CID.CID_NS)}getSystemWaitDef(){return DOM.findFirstChild(this.def,n=>DOM.IS_element(n)&&n.localName==="systemWait"&&n.namespaceURI===CID.CID_NS)}async doStep(session){let resp=await this.doRequest(session)
const text=await resp.text()
if(!resp.ok)return{error:"serverFailed",errorReason:text,errorHttpCode:resp.status}
const metas=text?JSON.parse(text):null
session._updateProps(metas)
while(resp.status===202){const uiWait=this.getUiStepDef()
if(uiWait){const uiResult=await session.config.uiHandler.uiWait(session,this)
if(uiResult)return uiResult}const sysWait=this.getSystemWaitDef()
if(sysWait){await new Promise(resolve=>setTimeout(resolve,3e3))
resp=await CidExchangeStep.doWebExchange(session,sysWait)
if(!resp.ok)return{error:"serverFailed",errorReason:text,errorHttpCode:resp.status}
const metas=text?JSON.parse(text):null
session._updateProps(metas)}}return{}}doRequest(session){return CidExchangeStep.doWebExchange(session,this.def)}static async doWebExchange(session,stepDef){const urlObj=parseCidStepUrl(stepDef)
const url=urlObj?urlObj.getStr("fr"):null
const webExch=session.cidTransport.webExchange
if(webExch.POST_URLENC||webExch.POST_MULTIPART){const body=CidStep.enrichParams(webExch.POST_URLENC?new UrlQs:new FormData,session,stepDef)
const headers=webExch.POST_URLENC?{"content-type":"application/x-www-form-urlencoded"}:{}
return fetch(url,{method:"POST",body:body,headers:headers,credentials:"include"})}else if(webExch.GET&&webExch.GET.queryString){return fetch(CidStep.enrichUrl(url,session,stepDef),{credentials:"include"})}else if(webExch.GET&&webExch.GET.header){return fetch(url,{headers:CidStep.enrichHeaders(session,stepDef),credentials:"include"})}else throw Error("webExchange properties method not found in transport: "+DOM.debug(session.cidTransport.def))}}export class CidUploadStep extends CidExchangeStep{get uploadUrl(){return this.def.getAttribute("url")}async doRequest(session){const stepDef=this.def
let url=this.uploadUrl
const webUpload=session.cidTransport.webUpload
if(session.config.customUpload){const res=await session.config.customUpload(session,this,webUpload)
if(res!=null)return res}const init={credentials:"include"}
let formData
let propsMedia
if(webUpload.POST_MULTIPART){propsMedia=webUpload.POST_MULTIPART
formData=new FormData
formData.append("cidContent",session.config.bodyToUpload)
init.method="POST"
init.body=formData}else if(webUpload.PUT){propsMedia=webUpload.PUT
init.method="PUT"
init.body=session.config.bodyToUpload}else if(webUpload.POST){propsMedia=webUpload.POST
init.method="POST"
init.body=session.config.bodyToUpload}else throw Error("webUpload method not found in transport: "+DOM.debug(session.cidTransport.def))
if(propsMedia.post)CidStep.enrichParams(formData,session,stepDef)
else if(propsMedia.queryString)url=CidStep.enrichUrl(url,session,stepDef)
else if(propsMedia.header)init.headers=CidStep.enrichHeaders(session,stepDef)
else throw Error("webUpload properties media not found in transport: "+DOM.debug(session.cidTransport.def))
init.credentials="include"
return fetch(url,init)}}function*metasUsesForStep(elt,cidSession){const use=elt.getAttribute("useMetas")
if(use){const keys=use.split(" ")
for(let k of keys){if(k==="*"){const knownMetas=cidSession.cidProcess.metas
const values=cidSession.metasOut
for(let outKey in values){if(!knownMetas.has(outKey))yield outKey}}else{yield k}}}}function*metasNeedsForStep(elt){const need=elt.getAttribute("needMetas")
if(need)yield*need.split(" ")}class CidWebTransport{constructor(def){this.def=def
this.webExchange={}
this.webInteract={}
this.webUpload={}
const props=def.getAttribute("sessionProperties")
if(props)this.sessionProps=new Set(props.split(" "))
for(let ch=def.firstElementChild;ch;ch=ch.nextElementSibling){if(ch.namespaceURI!==CID.CID_NS)continue
const webReq=this[ch.localName]
if(webReq){for(let req=ch.firstElementChild;req;req=req.nextElementSibling){const m=req.getAttribute("method")
if(m==="GET")webReq.GET=getPropsMedia(req)
else if(m==="PUT")webReq.PUT=getPropsMedia(req)
else if(m==="POST")webReq.POST=getPropsMedia(req)
else if(m==="POST;application/x-www-form-urlencoded")webReq.POST_URLENC=getPropsMedia(req)
else if(m==="POST;multipart/form-data")webReq.POST_MULTIPART=getPropsMedia(req)}}}function getPropsMedia(req){const r={}
for(const p of req.getAttribute("properties").split(" "))if(p)r[p]=true
return r}}get id(){return this.def.getAttribute("id")}async needWebAuth(session){const auths=DOM.findFirstChild(this.def,n=>DOM.IS_element(n)&&n.localName==="authentications"&&n.namespaceURI===CID.CID_NS)
if(!auths)return null
let webAuthStep=null
for(let ch=auths.firstElementChild;ch;ch=ch.nextElementSibling){if(ch.namespaceURI!==CID.CID_NS)continue
if(ch.localName==="basicAuth"){if(await this.checkAuth(session,ch))return null}else if(ch.localName==="webAuthentication"){if(await this.checkAuth(session,ch))return null
webAuthStep=new CidWebAuthStep(ch)}else if(ch.localName==="noAuthentication"){return null}}return webAuthStep}async checkAuth(session,auth){for(let ch=auth.firstElementChild;ch;ch=ch.nextElementSibling){if(ch.localName==="checkAuth"&&ch.namespaceURI===CID.CID_NS){try{const resp=await CidExchangeStep.doWebExchange(session,ch)
return resp.ok}catch(e){return false}}}return false}}class CidL10nStr extends Map{set(key,value){if(this.size===0)this.default=value
super.set(key,value)
let frag=key.indexOf("-")
while(frag>0){super.set(key.substring(0,frag),value)
frag=key.indexOf("-",frag+1)}return this}getStr(...lang){if(lang){for(const lg of lang){const label=this.get(lg)
if(label!=undefined)return label}for(const lg of lang){let frag=lg.lastIndexOf("-")
while(frag>0){const label=this.get(lg.substring(frag+1))
if(label!=undefined)return label
frag=lg.lastIndexOf("-",frag-1)}const label=this.get(lg)
if(label!=undefined)return label}}return this.default||""}}function parseIs(elt){const att=elt.getAttribute("is")
if(!att)return null
return att.trim().split(/ +/)}function parseLabel(parent){const label=new CidL10nStr
for(let lb=parent.firstElementChild;lb;lb=lb.nextElementSibling){if(lb.localName==="label"&&lb.namespaceURI===CID.CID_NS){label.set(lb.getAttribute("xml:lang"),lb.textContent)}}return label}export function parseCidStepUrl(parent){const url=new CidL10nStr
for(let lb=parent.firstElementChild;lb;lb=lb.nextElementSibling){if(lb.localName==="url"&&lb.namespaceURI===CID.CID_NS){url.set(lb.getAttribute("xml:lang"),lb.textContent)}}if(url.size===0&&parent.hasAttribute("url"))url.set("zxx",parent.getAttribute("url"))
return url.size>0?url:null}let interactPending
function addInteractPending(frame,session){if(!interactPending){interactPending=new Map
window.addEventListener("message",(function(ev){for(const[key,val]of interactPending.entries()){if(key.contentWindow===ev.source){val.onCidFrameMessage(ev.data)
break}else if(key.contentWindow==null){interactPending.delete(key)}}}))}interactPending.set(frame,session)}function removeInteractPending(frame,session){if(!interactPending)return false
const sess=interactPending.get(frame)
if(sess===session){interactPending.delete(frame)
return true}return false}export class CidHost{constructor(def){this.use="both"
if(def!=null){this.label=def.getAttribute("label")
this.manifestUrl=def.getAttribute("manifestUrl")
this.is=parseIs(def)
this.use=def.getAttribute("use")||"both"
const mn=def.firstElementChild
if(mn&&mn.localName==="manifest"){try{this.manifest=new CidManifest(this.manifestUrl,mn)}catch(e){this.manifest=null}}}}async fetchManifest(){if(this.manifest===undefined){try{this.manifest=await CID.getCidManifest(this.manifestUrl)}catch(e){this.manifest=null}}return this.manifest}static createFromUrl(url,use,label){const cidHost=new CidHost
cidHost.manifestUrl=url
if(use)cidHost.use=use
if(label)cidHost.label=label
return cidHost}}export var CID;(function(CID){async function getCidManifest(path){const url=IO.absoluteUrl(path)
const headers=new Headers
headers.set("X-CidManifest","1")
const resp=await fetch(url,{headers:headers})
if(!resp.ok)throw resp
return new CidManifest(url,DOM.parseDomValid(await resp.text()).documentElement)}CID.getCidManifest=getCidManifest
async function getCidHosts(reg){const univ=reg.env.universe
if(!univ.cidHosts){const doc=await univ.config.httpFrames.web.execFrameUrl.fetchDom("u/cidProvider/GetManifests")
univ.cidHosts=[]
if(doc)for(let ch=doc.documentElement.firstElementChild;ch;ch=ch.nextElementSibling){if(ch.localName==="cidHost")univ.cidHosts.push(new CidHost(ch))}}return univ.cidHosts}CID.getCidHosts=getCidHosts
async function getCidHostsForInput(reg){const list=await getCidHosts(reg)
return list.filter(ch=>ch.use!=="output")}CID.getCidHostsForInput=getCidHostsForInput
async function getCidHostsForOutput(reg){const list=await getCidHosts(reg)
return list.filter(ch=>ch.use!=="input")}CID.getCidHostsForOutput=getCidHostsForOutput
function getCidManifestLabel(hosts,manifest){if(hosts){const h=hosts.find(h=>h.manifestUrl===manifest.manifestUrl)
if(h)return h.label}const label=manifest.label.getStr("fr")
return label||manifest.manifestUrl}CID.getCidManifestLabel=getCidManifestLabel
function filterIs(objects,isList){if(!isList||isList.length===0||!objects)return new Set(objects)
const result=new Set
for(const is of isList){objects.filter(p=>p.is&&p.is.indexOf(is)>=0).forEach(p=>result.add(p))}return result}CID.filterIs=filterIs
function filterIsFirst(objects,isList,addIn){if(!isList||isList.length===0){if(!objects)return addIn||new Set
if(!addIn)return new Set(objects)
objects.forEach(addIn.add,addIn)
return addIn}const result=addIn||new Set
for(const is of isList){objects.filter(p=>p.is&&p.is.indexOf(is)>=0).forEach(p=>result.add(p))
if(result.size>0)return result}return result}CID.filterIsFirst=filterIsFirst
function filterIsOr(objects,isList){if(!isList||isList.length===0||!objects)return new Set(objects)
if(typeof isList[0]==="string")return filterIs(objects,isList)
const result=new Set
for(const is of isList)filterIsFirst(objects,is,result)
return result}CID.filterIsOr=filterIsOr
function isMatch(is1,is2){if(!is1||!is2)return false
for(const k1 of is1)if(is2.indexOf(k1)>=0)return true
return false}CID.isMatch=isMatch
function cidErrorToMsg(cidError){switch(cidError){case"abort":return"Processus abandonné"
case"authFailed":return"Échec d\'authentification"
case"serverFailed":return"Échec de traitement de la demande par le système cible"
case"noProcessFound":return"Aucun traitement compatible n\'a pu être trouvé"
case"other":return"Erreur indéterminée"}}CID.cidErrorToMsg=cidErrorToMsg
CID.IS_FileName=["http://schema.org/name","http://purl.org/dc/terms/title"]
CID.IS_ContentType=["http://purl.org/dc/terms/format","http://schema.org/DataType"]
CID.IS_Resend=["scenari.eu:cid:resend"]
CID.CID_NS="http://www.cid-protocol.org/schema/v1/core"})(CID||(CID={}))

//# sourceMappingURL=cid.js.map