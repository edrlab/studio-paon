import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{BaseElementAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{CID,CidExchangeStep,CidSession,CidUploadStep,ECidSessionState,parseCidStepUrl}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/cid.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{UiThemeDeskFeat}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/plugins/optionsPlg.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
export class CidInteractionByStepsUi extends BaseElementAsync{async _initialize(init){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.reg=this.findReg(init)
this.conf=init
this.cidManifestHead=sr.appendChild(JSX.createElement("div",{id:"cidManifest"}))
this.cidProcessHead=sr.appendChild(JSX.createElement("div",{id:"cidProcess"}))
this.cidDetails=sr.appendChild(JSX.createElement("div",{id:"cidDetails"}))
this.cidInteractions=sr.appendChild(JSX.createElement("iframe",{id:"cidInteractions"}))
if(UiThemeDeskFeat.isIn(desk))this.cidInteractions.injectTheme=UiThemeDeskFeat.injectTheme
let allHosts
switch(init.cidHostUse){case"input":allHosts=await CID.getCidHostsForInput(this.reg)
break
case"output":allHosts=await CID.getCidHostsForOutput(this.reg)
break
default:allHosts=await CID.getCidHosts(this.reg)
break}this.cidInfo={cidHosts:init.cidHostIs?Array.from(CID.filterIsOr(allHosts,init.cidHostIs)):allHosts}
if(init.cidManifestUrlInput||this.cidInfo.cidHosts.length!==1){this.cidSeletHost()}else{this.cidInfo.lastManifest=await this.cidInfo.cidHosts[0].fetchManifest()
this.cidOnManifestKnown()}}async overrideMetas(ctx,metasIn,foreignMetas){}cidSeletHost(){DOM.setHidden(this.cidProcessHead,true)
DOM.setHidden(this.cidInteractions,true)
this.cidDetails.textContent=null
if(this.cidInfo.cidHosts.length>0){this.cidManifestHead.textContent="Sélection du serveur cible"
const group=this.cidDetails.appendChild(JSX.createElement("ul",null))
for(let i=0,s=this.cidInfo.cidHosts.length;i<s;i++){const host=this.cidInfo.cidHosts[i]
group.appendChild(JSX.createElement("li",null,JSX.createElement("a",{onclick:this.onCidSelectHost,href:i},host.label)))}if(this.conf.cidManifestUrlInput)this.buildInputManifest(group.appendChild(JSX.createElement("li",null)),"Autre")}else{this.cidManifestHead.textContent="Définition du serveur cible"
this.buildInputManifest(this.cidDetails.appendChild(JSX.createElement("div",{id:"manifestAlone"})),"URL du serveur")}}async onCidSelectHost(ev){ev.preventDefault()
const me=DOMSH.findHost(this)
me.cidInfo.lastManifest=await me.cidInfo.cidHosts[parseInt(this.getAttribute("href"))].fetchManifest()
me.cidOnManifestKnown()}async cidOnManifestKnown(){const manifest=this.cidInfo.lastManifest
if(!manifest)return this.cidSeletHost()
this.cidManifestHead.textContent="Serveur : "+CID.getCidManifestLabel(this.cidInfo.cidHosts,manifest)
if(this.conf.cidManifestUrlInput||this.cidInfo.cidHosts.length!==1){this.cidManifestHead.appendChild(JSX.createElement("c-button",{class:"changeBtn",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/actions/cid/change.svg",title:"Changer de serveur",onclick:function(ev){return DOMSH.findHost(this).cidSeletHost()}}))}DOM.setHidden(this.cidProcessHead,true)
const prcs=this.cidInfo.cidProcesses=this.conf.cidProcessSelector?await this.conf.cidProcessSelector({reg:this.reg,uiContext:this}):Array.from(CID.filterIsOr(manifest.processes,this.conf.cidProcessIs||[CidInteractionByStepsUi.PRC_IS_DEFAULT]))
if(prcs.length!==1){this.cidSelectProcess()}else{this.cidOnProcessKnown(prcs[0])}}buildInputManifest(parent,label){parent.appendChild(JSX.createElement("div",null,label))
parent.appendChild(JSX.createElement("div",{id:"manifestEdit"},JSX.createElement("input",{id:"manifestInput",type:"url",oninput:this.onManifestInput,onchange:function(){DOMSH.findHost(this).onManifestChange(this)}}),JSX.createElement("c-button",{id:"manifestValid","î":{reg:this.reg,label:"Valider",disabled:true},onclick:function(){DOMSH.findHost(this).cidUseManifest(this.cidManifest)}})))
parent.appendChild(JSX.createElement("c-msg",{id:"manifestInputResult","î":{noShadow:true}}))}async onManifestChange(input){const msg=this.shadowRoot.getElementById("manifestInputResult")
const btn=this.shadowRoot.getElementById("manifestValid")
btn.cidManifest=null
if(!input.validity.valid){msg.setCustomMsg("Saisissez une URL valide permettant d\'obtenir les caractéristiques du serveur (manifeste CID)","info")
btn.cidManifest=null
btn.disabled=true}else{try{btn.cidManifest=await CID.getCidManifest(input.value)}catch(e){}if(btn.cidManifest){msg.setCustomMsg("Serveur reconnu : "+CID.getCidManifestLabel(this.cidInfo.cidHosts,btn.cidManifest),"info")
btn.disabled=false}else{msg.setCustomMsg("Aucun serveur reconnu à cette URL (manifeste CID non trouvé), ou politique de sécurité du serveur incompatible","error")
btn.disabled=true}}}onManifestInput(ev){const me=DOMSH.findHost(this)
if(me._cidMnInputWaiter)clearTimeout(me._cidMnInputWaiter)
me._cidMnInputWaiter=setTimeout(()=>me.onManifestChange(this),800)}cidUseManifest(manifest){if(!manifest)return
this.cidInfo.lastManifest=manifest
this.cidOnManifestKnown()}cidSelectProcess(){DOM.setHidden(this.cidInteractions,true)
DOM.setHidden(this.cidProcessHead,true)
this.cidDetails.textContent=null
const group=this.cidDetails.appendChild(JSX.createElement("ul",null))
for(let i=0,s=this.cidInfo.cidProcesses.length;i<s;i++){const prc=this.cidInfo.cidProcesses[i]
group.appendChild(JSX.createElement("li",null,JSX.createElement("a",{onclick:this.onCidSelectProcess,href:i},prc.label.getStr("fr"))))}}onCidSelectProcess(ev){ev.preventDefault()
const me=DOMSH.findHost(this)
me.cidOnProcessKnown(me.cidInfo.cidProcesses[parseInt(this.getAttribute("href"))])}async cidOnProcessKnown(process){DOM.setHidden(this.cidManifestHead,true)
DOM.setHidden(this.cidProcessHead,true)
DOM.setHidden(this.cidInteractions,false)
await this.cidRefreshOnSessionChange()
const cidSession=this.cidInfo.cidSession=await this.createCidSession(process)
cidSession.onStateChange.add(()=>this.cidRefreshOnSessionChange())
await cidSession.doSession()
if(cidSession.state===ECidSessionState.failed){ERROR.reportError({msg:"Échec au déploiement..."})}}async createCidSession(process){const cidSessionConfig=Object.assign({manifest:this.cidInfo.lastManifest,metasIn:{},process:process,uiHandler:this},this.conf.cidSessionConfig)
await this.overrideMetas({reg:this.reg,uiContext:this},cidSessionConfig.metasIn,cidSessionConfig.foreignMetas)
return new CidSession(cidSessionConfig)}async cidRefreshOnSessionChange(){if(this.cidInfo.cidSession){switch(this.cidInfo.cidSession.state){case ECidSessionState.authenticating:this.cidDetails.textContent=null
this.cidDetails.appendChild(JSX.createElement("div",{class:"cidUploading"},JSX.createElement("span",null,"Authentification en cours...")))
return
case ECidSessionState.inStep:case ECidSessionState.uiProcessSel:case ECidSessionState.notStarted:this.cidDetails.textContent=null
this.cidDetails.appendChild(JSX.createElement("div",{class:"cidUploading"},JSX.createElement("span",null,"Action en cours...")))
return
case ECidSessionState.uiAuth:return
case ECidSessionState.failed:case ECidSessionState.ended:case ECidSessionState.aborted:this.cidDetails.textContent=null
this.cidDetails.appendChild(JSX.createElement("div",{class:"cidEnd"},JSX.createElement("span",null,"Fin de session CID")))
if(this.conf.onInteractionEndHandler)await this.conf.onInteractionEndHandler(this.cidInfo.cidSession)}}this.cidDetails.textContent=null}async webAuth(session,step){const frame=JSX.createElement("iframe",{style:"flex:1"})
const dialog=POPUP.showDialog(frame,this,{initHeight:"60vh",initWidth:"60vh",titleBar:{barLabel:{label:"Authentification"},closeButton:{}}})
dialog.onNextClose().then(r=>{if(!r)session.onCidFrameMessage({cidAuth:"failed"})})
const res=await step.initFrame(frame,session)
dialog.close("ok")
return res}async uiWait(session,step){this.cidDetails.textContent=null
return await step.initFrame(this.cidInteractions,session)}async interact(session,step){this.cidDetails.textContent=null
return await step.initFrame(this.cidInteractions,session)}async selectProcess(session,choices){console.trace("TODO selectProcess UI")
return choices.values().next().value}}CidInteractionByStepsUi.PRC_IS_DEFAULT=["scenari.eu:cid:selectResourceAction","http://schema.org/FindAction","http://schema.org/DiscoverAction"]
REG.reg.registerSkin("cid-process-steps",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\t[hidden] {\n\t\tdisplay: none !important;\n\t}\n\n\tinput,\n\tselect,\n\ttextarea {\n\t\tbackground-color: var(--form-bgcolor);\n\t\tcolor: var(--form-color);\n\t\tborder: 1px solid var(--border-color);\n\t}\n\n\tinput:invalid,\n\tselect:invalid,\n\ttextarea:invalid {\n\t\toutline: solid 1px #b86262;\n\t}\n\n\t#cidRoot,\n\t#cidDetails {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t#cidInteractions {\n\t\tflex: 1;\n\t\tborder: none;\n\t}\n\n\t#cidRoot {\n\t\toverflow: auto;\n\t}\n\n\t#cidManifest {\n\t\tmargin: .2em;\n\t\tfont-weight: bold;\n\t\tfont-size: 1.2em;\n\t\ttext-align: center;\n\t}\n\n\t#cidProcess {\n\t\tmargin: .2em;\n\t\tfont-weight: bold;\n\t\ttext-align: center;\n\t}\n\n\t#manifestInput {\n\t\tflex: 1;\n\t}\n\n\t#manifestAlone {\n\t\tmargin: 2em;\n\t}\n\n\t#manifestEdit {\n\t\tdisplay: flex;\n\t}\n\n\t#manifestInput:focus {\n\t\toutline: var(--focus-outline);\n\t}\n\n\t#manifestInputResult {\n\t\tfont-style: italic;\n\t\tcolor: var(--fade-color);\n\t}\n\n\t.changeBtn {\n\t\tdisplay: inline-flex;\n\t}\n\n\t.cidWaiting {\n\t\tflex: 1;\n\t\tborder: none;\n\t\tborder-top: 1px solid var(--border-color);\n\t}\n\n  .cidUploading {\n\t  flex: 1;\n\t  display: flex;\n\t  align-items: center;\n\t  font-style: italic;\n\t  margin: 0 2em;\n  }\n\n  .cidEnd {\n\t  flex: 1;\n\t  display: flex;\n\t  align-items: center;\n\t  font-style: italic;\n\t  margin: 0 2em;\n  }\n\n`)
window.customElements.define("cid-process-steps",CidInteractionByStepsUi)
export class CidLcTransitionParamsProvider{constructor(config){this.config=config}async computeParams(params,shortDescs,reg,emitter){const ct=JSX.createElement(CidInteractionByStepsUi,null)
ct.initialize({reg:reg,skinOver:"webzone:panel",cidProcessIs:Array.isArray(this.config.cidProcessFilter)?this.config.cidProcessFilter:this.config.cidProcessFilter({reg:reg}),cidHostIs:this.config.cidHostIs,cidManifestUrlInput:this.config.cidManifestUrlInput,cidPassOptionalInteraction:"cidPassOptionalInteraction"in this.config?this.config.cidPassOptionalInteraction:true,cidHostUse:this.config.cidHostUse,cidSessionConfig:{customUpload:async(session,uploadStep,webUpload)=>{session.sessionProps.uploadUrl=uploadStep.uploadUrl
session.sessionProps.uploadUrlMethod="PUT"
return new Response(null,{status:200})}},onInteractionEndHandler:async cidSession=>{switch(cidSession.state){case ECidSessionState.failed:await ERROR.showError({msg:"Échec d\'interaction avec le serveur de ressources",details:cidSession.failedReason})
break
case ECidSessionState.ended:if(!params["*"])params["*"]={}
Object.assign(params["*"],cidSession.metasOut)
params["*"].uploadUrl=cidSession.sessionProps.uploadUrl
params["*"].uploadUrlMethod=cidSession.sessionProps.uploadUrlMethod
const cidInteractStep=cidSession.cidProcess.steps[1]instanceof CidUploadStep?cidSession.cidProcess.steps[1]:null
const systemWaitDef=cidInteractStep===null||cidInteractStep===void 0?void 0:cidInteractStep.getSystemWaitDef()
const systemWaitUrlObj=systemWaitDef?parseCidStepUrl(systemWaitDef):null
const systemWaitUrl=systemWaitUrlObj?systemWaitUrlObj.getStr("fr"):null
if(systemWaitUrl)params["*"].systemWaitUrl=systemWaitUrl
const cidExchangeStep=cidSession.cidProcess.steps[0]instanceof CidExchangeStep?cidSession.cidProcess.steps[0]:null
await LANG.promisesMap(shortDescs,async(shortDesc,i)=>{if(i!=0)await(cidExchangeStep===null||cidExchangeStep===void 0?void 0:cidExchangeStep.doStep(cidSession))
if(!params[shortDesc.srcUri])params[shortDesc.srcUri]={}
params[shortDesc.srcUri].scCidSessId=cidSession.sessionProps.scCidSessId},10)
popup.close(true)}popup.close(false)}})
const popup=POPUP.showDialog(ct,reg.env.uiRoot,{titleBar:{barLabel:{label:this.config.label||"Serveur de ressources..."},closeButton:{}},initWidth:"70vw",initHeight:"70vh",resizer:{}})
return await popup.onNextClose()}async rollbackTransition(params,shortDescs){var _a
const abortUrl=(_a=params["*"])===null||_a===void 0?void 0:_a.systemWaitUrl
if(!abortUrl)await ERROR.logError({msg:"Unable to abort the transition CID sessions: no systemWaitUrl available"})
const abortUrlObj=new URL(abortUrl)
abortUrlObj.searchParams.set("scResp","200-202-403")
abortUrlObj.searchParams.set("abortSession","")
await LANG.promisesMap(shortDescs,async shortDesc=>{var _a
const scCidSessId=(_a=params[shortDesc.srcUri])===null||_a===void 0?void 0:_a.scCidSessId
abortUrlObj.searchParams.set("scCidSessId",scCidSessId)
return fetch(abortUrlObj.href,{method:"POST",credentials:"include"})},10)}}
//# sourceMappingURL=cidUi.js.map