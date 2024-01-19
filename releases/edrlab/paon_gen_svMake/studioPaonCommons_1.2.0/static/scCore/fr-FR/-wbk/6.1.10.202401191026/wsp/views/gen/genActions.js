import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{CID,CidSession,CidUploadStep,ECidSessionState}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/cid.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{CDM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/cdm.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
export class GenAction extends Action{setHideForStatuses(statuses){this._hideForStatuses=statuses
return this}isVisible(ctx){if(this._hideForStatuses&&this._hideForStatuses.indexOf(ctx.genInfo.status)>=0)return false
return super.isVisible(ctx)}}export class GenerateAction extends GenAction{constructor(id){super(id||"generate")
this._label="Générer"
this._icon=id&&id.startsWith("send")?"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/generators/send.svg":"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/generators/generate.svg"
this._description="Nouvelle génération"}setOverrideGenProps(props){this.overrideGenProps=props
return this}setConfirmMsg(msg){this.confirmMsg=msg
return this}execute(ctx,ev){ctx.genProps().then(async props=>{if(props===false)return
if(this.overrideGenProps){if(props)Object.assign(props,this.overrideGenProps)
else props=this.overrideGenProps}if(!this.confirmMsg||await POPUP.confirm(this.confirmMsg,ctx.uiContext)){const genSvc=ctx.reg.getSvc("gen.action.generate")||ITEM.generate
genSvc.call(this,ctx.wsp,ctx.uiContext,SRC.srcRef(ctx.shortDesc),ctx.pubNode.codeGenStack,props,ctx.customDestPath)}})}}export class ShowGenAction extends GenAction{constructor(id,subPathToShow,isWeb){super(id||"show")
this.subPathToShow=subPathToShow
this.isWeb=isWeb
this._label="Consulter"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/generators/show.svg"
this._description="Consulter la dernière génération"
this._hideForStatuses="failed,null"}isVisible(ctx){if(!ctx.genInfo.uriPub)return false
return super.isVisible(ctx)}execute(ctx,ev){const genNature=this.isWeb?"web":ctx.pubNode.genNature
if(Desk.electron&&ctx.genInfo.localPathPub&&genNature!=="web"){window.postMessage({type:"client:modules:localServer:open",path:ctx.genInfo.localPathPub},location.origin)}else{window.open(ITEM.getGenPubUrl(ctx.wsp,ctx.genInfo.uriPub+(this.subPathToShow?`/${this.subPathToShow}`:"")),"_blank")}}}export class ShowGenInLOAction extends ShowGenAction{isVisible(ctx){if(!Desk.electron||!ctx.genInfo.uriPub)return false
return super.isVisible(ctx)}async execute(ctx,ev){const{env:env}=ctx.reg
if(ctx.genInfo.localPathPub){window.postMessage({type:"client:modules:localServer:open",path:ctx.genInfo.localPathPub},location.origin)}else{const url=ITEM.getGenPubUrl(ctx.wsp,ctx.genInfo.uriPub)
const openReply=await IO.sendMessage({type:"client:modules:odEditor:open",url:encodeURI(url)})
if(openReply.type=="error")ERROR.log(openReply.msg)
else if(openReply.type==="notFound")POPUP.showNotifInfo("L\'éditeur de document \'OpenDocument\' (LibreOffice, ...) n\'a pu être trouvé.",env.uiRoot)}}}export class DownloadGenAction extends GenAction{constructor(id){super(id||"download")
this._label="Télécharger"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/generators/download.svg"
this._description="Télécharger la dernière génération"
this._hideForStatuses="failed,null"}isVisible(ctx){if(!ctx.genInfo.mimeDownload)return false
return super.isVisible(ctx)}execute(ctx,ev){const dwnSvc=ctx.reg.getSvc("gen.action.download")||ITEM.getGenDownloadUrl
const link=document.createElement("a")
link.href=dwnSvc.call(this,ctx.wsp,SRC.srcRef(ctx.shortDesc),ctx.pubNode.codeGenStack,ctx.customDestPath)
link.download=""
link.click()}}export class LogGenAction extends GenAction{constructor(id){super(id||"log")
this._label="Rapport"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/generators/log.svg"
this._description="Consulter les traces"}isVisible(ctx){if(!ctx.genInfo.uriTraces)return false
return super.isVisible(ctx)}async execute(ctx,ev){const traceDocUrl=ctx.wsp.wspServer.config.pubUrl.resolve(ctx.genInfo.uriTraces.substr(1))
const traceDoc=await traceDocUrl.fetchDom()
await ERROR.showError({msg:"Une erreur est survenue lors de la génération.",technicalDetails:this.technicalDetailsFromGenTrace(traceDoc),adminDetails:DOM.ser(DOM.indentDom(traceDoc)),ctx:ctx})}technicalDetailsFromGenTrace(traceNode){if(DOM.IS_document(traceNode))return this.technicalDetailsFromGenTrace(traceNode.documentElement)
let item
if(traceNode.localName=="trace"){item=JSX.createElement("ul",{class:"msgList"})
for(const child of traceNode.children){if(child.localName=="l")item.appendChild(this.technicalDetailsFromGenTrace(child.firstElementChild))}}else if(traceNode.localName=="message"){let desc=traceNode.getAttribute("desc")
let v=traceNode.getAttribute("var1")
if(v!=null){const vars=[v]
v=traceNode.getAttribute(`var2`)
let i=3
while(v!=null){vars.push(v)
v=traceNode.getAttribute(`var${i++}`)}desc=LANG.formatStr(desc,vars)}item=JSX.createElement("li",null,JSX.createElement("span",null,desc))
const level=traceNode.getAttribute("type")
if(level=="Warning")item.classList.add("warn")
else if(level=="Error"||level=="Exception")item.classList.add("error")
const childMessages=document.createDocumentFragment()
for(const child of traceNode.children){if(child.localName=="message")childMessages.appendChild(this.technicalDetailsFromGenTrace(child))}if(childMessages.children.length)item.appendChild(JSX.createElement("ul",{class:"msgList"},childMessages))}return item}}REG.reg.addToList("actions:gen","generate",1,new GenerateAction,0)
REG.reg.addToList("actions:gen","show",1,new ShowGenAction,10)
REG.reg.addToList("actions:gen","download",1,new DownloadGenAction,20)
REG.reg.addToList("actions:gen","log",1,new LogGenAction,40)
export class CidAction extends Action{setProcessFilter(processFilter){this.processFilter=processFilter
return this}setPassOptionalInteraction(pass){this.passOptionalInteraction=pass
return this}createMetasIn(ctx){return{scChainOrigin:JSON.stringify({serverUrl:ctx.wsp.wspServer.chain.config.universeUrl,wspCode:ctx.wsp.code,refUri:SRC.srcRef(ctx.shortDesc)})}}async overrideMetas(ctx,metasIn,foreignMetas){}overrideSession(config,ctx){let processes=ctx.cidInfo.cidProcesses||ctx.cidInfo.lastManifest.processes
if(Array.isArray(this.processFilter)){processes=Array.from(CID.filterIsOr(processes,this.processFilter))}else if(typeof this.processFilter==="function"){processes=this.processFilter(ctx)}if(processes.length===1){config.process=processes[0]}else{config.processes=processes}if(this.passOptionalInteraction!=null)config.cidPassOptionalInteraction=this.passOptionalInteraction
return config}}CidAction.PRC_IS_DEPLOY=["scenari.eu:cid:deployResourceAction","http://schema.org/TransferAction","http://schema.org/SendAction"]
CidAction.PRC_IS_CONSULT=["scenari.eu:cid:consultResourceAction","http://schema.org/ConsumeAction","http://schema.org/ViewAction"]
export class CidDeployAction extends CidAction{constructor(){super()
this._label="Déployer"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/generators/send.svg"
this.processFilter=CidAction.PRC_IS_DEPLOY}isEnabled(ctx){if(ctx.cidInfo.cidSession&&!ctx.cidInfo.cidSession.isClosed())return false
return super.isEnabled(ctx)}async execute(ctx,ev){if(ctx.cidInfo.cidSession)ctx.cidInfo.cidSession.abortSession()
try{ctx=clonePubCtx(ctx)
ctx.cidInfo.cidSession=await this.createCidSession(ctx)
if(!ctx.cidInfo.cidSession)return
await this.launchSession(ctx)
if(ctx.cidInfo.cidSession.state===ECidSessionState.ended)this.saveLastDeploy(ctx)}finally{ctx.cidInfo.cidSession=null}}async launchSession(ctx){ctx.cidInfo.cidSession.onStateChange.add(()=>ctx.uiContext.cidRefreshOnSessionChange())
await ctx.cidInfo.cidSession.doSession()
const st=ctx.cidInfo.cidSession.state
if(st===ECidSessionState.failed){const technicalDetails=ctx.cidInfo.cidSession.failedHttpCode?`Failed CID http code : ${ctx.cidInfo.cidSession.failedHttpCode}`:null
ERROR.reportError({msg:ctx.cidInfo.cidSession.failedHttpCode===403?"Vous ne disposez pas des autorisations nécessaires pour effectuer cette action.":"Échec au déploiement.",details:ctx.cidInfo.cidSession.failedReason||CID.cidErrorToMsg(ctx.cidInfo.cidSession.failedError),technicalDetails:technicalDetails})}else if(st===ECidSessionState.ended){POPUP.showNotif("Déploiement réalisé avec succès",ctx.uiContext)}}}export class CidScarDeployAction extends CidDeployAction{async createCidSession(ctx){const fileName=ITEM.extractItemCode(ctx.shortDesc.srcUri).replace(/\..*/,"")
const metasIn=this.createMetasIn(ctx)
const foreignMetas=[{is:CID.IS_FileName,value:fileName},{is:CID.IS_ContentType,value:"application/java-archive"}]
if(await this.overrideMetas(ctx,metasIn,foreignMetas)===false)return
return new CidSession(this.overrideSession({manifest:ctx.cidInfo.lastManifest,uiHandler:ctx.uiContext,metasIn:metasIn,foreignMetas:foreignMetas,customUpload:async(session,uploadStep,webUpload)=>{const sendBySrv=await CidScarDeployAction.getSendByServerBody(ctx,session,uploadStep,webUpload)
const params=IO.qs("cdaction",sendBySrv?"SendTo":"Export","scope",this.scarScope||"net","format",this.scarFormat||"jar","mode",this.scarMode||"wspTree","link",this.scarLink||"absolute","downloadFileName",fileName,"param",ctx.reg.env.wsp.code,"refUris",SRC.srcRef(ctx.shortDesc))
const content=await ctx.reg.env.wsp.wspServer.config.exportUrl.fetch(params,"none",sendBySrv?{method:"PUT",body:JSON.stringify(sendBySrv)}:null)
if(!content.ok)return content
if(sendBySrv)return content
session.config.bodyToUpload=await content.blob()
return null}},ctx))}async saveLastDeploy(ctx){try{if(!ctx.wsp.isAvailable)return
let previousCidEndPoints=ctx.cidInfo.lastCidEndPoints
if(previousCidEndPoints===undefined)return
const cidInfo=ctx.cidInfo
const metasToSave={}
const allMetas=cidInfo.cidSession.metasOut
for(let metaDef of cidInfo.cidSession.cidProcess.metas.values()){const val=allMetas[metaDef.name]
if(val!==undefined&&!metaDef.isExcludeForRecall)metasToSave[metaDef.name]=val}const fd=new FormData
if(previousCidEndPoints instanceof Promise)previousCidEndPoints=await previousCidEndPoints
fd.append("options",JSON.stringify({mvcc:(previousCidEndPoints===null||previousCidEndPoints===void 0?void 0:previousCidEndPoints.mvcc)||0,endPoints:[{idx:0,manifestUrl:cidInfo.lastManifest.manifestUrl,cidProps:metasToSave}]}))
const newCidEndPoints=await ctx.wsp.wspServer.config.wspSrcUrl.fetchJson(IO.qs("cdaction","UpdateCidEndPoints","fields","cidEndPoints","param",ctx.wsp.code,"refUri",SRC.srcRef(ctx.shortDesc)),{method:"POST",body:fd})
if(newCidEndPoints){ctx.cidInfo.lastCidEndPoints=newCidEndPoints.cidEndPoints
ctx.uiContext.cidRefreshOnSessionChange()}}catch(e){ERROR.log("Save last Cid deploy failed",e)}}static async getSendByServerBody(ctx,session,uploadStep,webUpload){const webUploadMedia=webUpload.PUT||webUpload.POST
if(!webUploadMedia)return null
const resp=await ctx.reg.env.universe.httpFrames.web.fetchSvc("u/remoteContent","CheckReachableUrls",{urls:CDM.stringify([uploadStep.uploadUrl])},"json")
if(resp.ok&&resp.asJson[0]){const sendOpts={method:webUploadMedia===webUpload.PUT?"PUT":"POST"}
if(webUploadMedia.queryString){sendOpts.url=CidUploadStep.enrichUrl(uploadStep.uploadUrl,session,uploadStep.def)}else{sendOpts.headerProps=CidUploadStep.enrichHeaders(session,uploadStep.def)}if(!sendOpts.headerProps)sendOpts.headerProps={}
if(!sendOpts.headerProps[IO.REQUEST_LANG_HEADER]){const reqInit=IO.addLang()
if(reqInit===null||reqInit===void 0?void 0:reqInit.headers)sendOpts.headerProps[IO.REQUEST_LANG_HEADER]=reqInit.headers[IO.REQUEST_LANG_HEADER]}return sendOpts}return null}}export class CidScarReDeployAction extends CidScarDeployAction{constructor(){super()
this._label="Redéployer"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/generators/resend.svg"
this.passOptionalInteraction=true}static isCidEndPointAvailable(ctx){const url=ctx.cidInfo.lastManifest.manifestUrl
const endPoints=ctx.cidInfo.lastCidEndPoints
if(endPoints===undefined){ctx.cidInfo.lastCidEndPoints=WSP.fetchSrc(ctx.wsp,ctx.uiContext,SRC.srcRef(ctx.shortDesc),["cidEndPoints"]).then(fields=>{ctx.cidInfo.lastCidEndPoints=(fields===null||fields===void 0?void 0:fields.cidEndPoints)||null
ctx.uiContext.cidRefreshOnSessionChange()
return ctx.cidInfo.lastCidEndPoints}).catch(e=>{ctx.cidInfo.lastCidEndPoints=null
ERROR.logError(e)
return null})
return false}else if(endPoints===null){return false}else if(endPoints instanceof Promise){return false}return endPoints.endPoints.find(ep=>ep.manifestUrl===url)!=null}static createMetasInFromEndPoints(ctx,metasIn){const cidField=ctx.cidInfo.lastCidEndPoints
if(cidField&&!(cidField instanceof Promise)){const url=ctx.cidInfo.lastManifest.manifestUrl
const endPoint=cidField.endPoints.find(ep=>ep.manifestUrl===url)
if(endPoint)return Object.assign(metasIn,endPoint.cidProps)}return metasIn}isVisible(ctx){if(!super.isVisible(ctx))return false
return CidScarReDeployAction.isCidEndPointAvailable(ctx)}createMetasIn(ctx){return CidScarReDeployAction.createMetasInFromEndPoints(ctx,super.createMetasIn(ctx))}overrideSession(config,ctx){if(!config.foreignMetas)config.foreignMetas=[]
config.foreignMetas.push({is:CID.IS_Resend,value:""})
return super.overrideSession(config,ctx)}}export class CidGenDeployAction extends CidDeployAction{async createCidSession(ctx){const stack=ctx.pubNode.codeGenStack.split("_")
const genCodeStack=stack.slice(0,stack.length-1).join("_")
const resp=await fetch(ITEM.getGenDownloadUrl(ctx.wsp,SRC.srcRef(ctx.shortDesc),genCodeStack),{method:"HEAD"})
if(!resp.ok){POPUP.showNotifInfo("Génération non disponible",ctx.uiContext)
return null}const fileName=extractFileNameFromContentDisposition(resp.headers.get("Content-Disposition"))
const contentType=resp.headers.get("Content-Type")
const metasIn=this.createMetasIn(ctx)
const foreignMetas=[{is:CID.IS_FileName,value:fileName},{is:CID.IS_ContentType,value:contentType}]
if(await this.overrideMetas(ctx,metasIn,foreignMetas)===false)return
return new CidSession(this.overrideSession({manifest:ctx.cidInfo.lastManifest,uiHandler:ctx.uiContext,metasIn:metasIn,foreignMetas:foreignMetas,customUpload:async(session,uploadStep,webUpload)=>{const sendBySrv=await CidScarDeployAction.getSendByServerBody(ctx,session,uploadStep,webUpload)
const params=IO.qs("cdaction",sendBySrv?"SendGenTo":"Download","param",ctx.wsp.code,"refUri",SRC.srcRef(ctx.shortDesc),"codeGenStack",genCodeStack)
const content=await ctx.wsp.wspServer.config.wspGenUrl.fetch(params,"none",sendBySrv?{method:"PUT",body:JSON.stringify(sendBySrv)}:null)
if(!content.ok){return content}if(sendBySrv)return content
session.config.bodyToUpload=await content.blob()
return null}},ctx))}async saveLastDeploy(ctx){var _a,_b
try{if(!ctx.wsp.isAvailable)return
let lastCidProps=ctx.cidInfo.lastCidProps
if(lastCidProps===undefined)return
const cidInfo=ctx.cidInfo
const metasToSave={}
const allMetas=cidInfo.cidSession.metasOut
for(let metaDef of cidInfo.cidSession.cidProcess.metas.values()){const val=allMetas[metaDef.name]
if(val!==undefined&&!metaDef.isExcludeForRecall)metasToSave[metaDef.name]=val}ctx.cidInfo.lastCidProps={store:[{manifestUrl:cidInfo.lastManifest.manifestUrl,cidProcessIs:(_b=(_a=cidInfo.cidSession)===null||_a===void 0?void 0:_a.cidProcess)===null||_b===void 0?void 0:_b.is,cidProps:metasToSave}]}
ctx.reg.env.universe.httpFrames.web.fetchSvc("u/genPropsStored","SaveGenProps",IO.query(null,"param",ctx.wsp.code,"srcRef",SRC.srcRef(ctx.shortDesc),"codeGenStack",ctx.pubNode.codeGenStack),"none",{method:"PUT",body:JSON.stringify(ctx.cidInfo.lastCidProps)})
ctx.uiContext.cidRefreshOnSessionChange()}catch(e){ERROR.log("Save last Cid deploy failed",e)}}}function extractFileNameFromContentDisposition(ctDisp){if(!ctDisp)return""
const i=ctDisp.indexOf("filename=")
if(i<0)return""
let value=ctDisp.substring(i+9).trim()
if(value.startsWith('"')){value=value.substring(1)
for(let k=0;k<value.length;k++){switch(value[k]){case"\\":value=value.substring(0,k)+value.substring(k+1)
break
case'"':return value.substring(0,k)}}}else{const end=value.indexOf(";")
if(end>=0)value=value.substring(0,end)}return value}export class CidGenReDeployAction extends CidGenDeployAction{constructor(){super()
this._label="Redéployer"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/generators/resend.svg"
this.passOptionalInteraction=true}static isReDeployDataAvailable(ctx){const url=ctx.cidInfo.lastManifest.manifestUrl
const lastCidProps=ctx.cidInfo.lastCidProps
if(lastCidProps===undefined){ctx.cidInfo.lastCidProps=ctx.reg.env.universe.httpFrames.web.fetchSvcJson("u/genPropsStored","GetGenProps",IO.query(null,"param",ctx.wsp.code,"srcRef",SRC.srcRef(ctx.shortDesc),"codeGenStack",ctx.pubNode.codeGenStack)).then(datas=>{ctx.cidInfo.lastCidProps=datas||null
ctx.uiContext.cidRefreshOnSessionChange()
return ctx.cidInfo.lastCidProps}).catch(e=>{ctx.cidInfo.lastCidProps=null
ERROR.logError(e)
return null})
return false}else if(lastCidProps===null){return false}else if(lastCidProps instanceof Promise){return false}return lastCidProps.store.find(d=>d.manifestUrl===url)!=null}static createMetasInFromLast(ctx,metasIn){const lastCidProps=ctx.cidInfo.lastCidProps
if(lastCidProps&&!(lastCidProps instanceof Promise)){const url=ctx.cidInfo.lastManifest.manifestUrl
const datas=lastCidProps.store.find(d=>d.manifestUrl===url)
if(datas)return Object.assign(metasIn,datas.cidProps)}return metasIn}isVisible(ctx){if(!super.isVisible(ctx))return false
return CidGenReDeployAction.isReDeployDataAvailable(ctx)}createMetasIn(ctx){return CidGenReDeployAction.createMetasInFromLast(ctx,super.createMetasIn(ctx))}overrideSession(config,ctx){if(!config.foreignMetas)config.foreignMetas=[]
config.foreignMetas.push({is:CID.IS_Resend,value:""})
return super.overrideSession(config,ctx)}}export class CidConsultLastAction extends CidAction{constructor(){super()
this._label="Consulter"
this._description="Consulter la dernière ressource déployée"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/generators/show.svg"
this.processFilter=CidAction.PRC_IS_CONSULT}async execute(ctx,ev){ctx=clonePubCtx(ctx)
ctx.cidInfo.cidSession=await this.createCidSession(ctx)
if(!ctx.cidInfo.cidSession)return
await ctx.cidInfo.cidSession.doSession()}async createCidSession(ctx){const metasIn=this.createMetasIn(ctx)
const foreignMetas=[]
if(await this.overrideMetas(ctx,metasIn,foreignMetas)===false)return
return new CidSession(this.overrideSession({manifest:ctx.cidInfo.lastManifest,uiHandler:ctx.uiContext,metasIn:metasIn,foreignMetas:foreignMetas},ctx))}}export class CidScarConsultAction extends CidConsultLastAction{isVisible(ctx){if(!super.isVisible(ctx))return false
return CidScarReDeployAction.isCidEndPointAvailable(ctx)}createMetasIn(ctx){return CidScarReDeployAction.createMetasInFromEndPoints(ctx,super.createMetasIn(ctx))}}export class CidGenConsultAction extends CidConsultLastAction{isVisible(ctx){if(!super.isVisible(ctx))return false
return CidGenReDeployAction.isReDeployDataAvailable(ctx)}createMetasIn(ctx){return CidGenReDeployAction.createMetasInFromLast(ctx,super.createMetasIn(ctx))}}export const CidConsultAction=CidScarConsultAction
function clonePubCtx(ctx){return Object.assign({},ctx)}
//# sourceMappingURL=genActions.js.map