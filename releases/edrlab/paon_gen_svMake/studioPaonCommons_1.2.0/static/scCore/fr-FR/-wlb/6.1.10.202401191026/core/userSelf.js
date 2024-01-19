import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{UserSrvBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
import{CDM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/cdm.js"
export class UserSelfSrv extends UserSrvBase{constructor(config){super()
this.config=config}connectToAuth(auth){this.auth=auth}async login(props){if(!this.config.loginUrl)throw"Service unavailable"
const resp=await sendUserSelfRequest(this.config.loginUrl,props)
if(this.auth&&resp.result==="logged"){await this.auth.fetchUser()}return resp}async logout(){if(!this.config.logoutUrl)throw"Service unavailable"
if(this.auth&&await this.auth.listeners.emitAsyncUntil("beforeLogout",this.auth.currentUser)==="stop")return{result:"canceled"}
const resp=await sendUserSelfRequest(this.config.logoutUrl)
if(this.auth&&resp.result==="loggedOut"){this.auth.listeners.emit("afterLogout")
this.auth.onDisconnect()}return resp}async pwdLost(props){if(!this.config.pwdLostUrl)throw"Service unavailable"
const url=new URL(this.config.pwdLostUrl.url)
url.searchParams.append("param",props.nickOrAccount)
return await sendUserSelfRequest(this.config.pwdLostUrl.resolve(url.href),null,true)}async pwdLostUpdate(props){if(!this.config.pwdLostUrl)throw"Service unavailable"
return await sendUserSelfRequest(this.config.pwdLostUrl.resolve(IO.qs("cdaction","UpdateUser")),props,true)}async renewPwd(props){if(!this.config.renewPwdUrl)throw"Service unavailable"
return await sendUserSelfRequest(this.config.renewPwdUrl,props,true)}async checkPwd(props){if(!this.config.checkPwdUrl)throw"Service unavailable"
return sendUserSelfRequest(this.config.checkPwdUrl,props)}async createUser(props){if(!this.config.createUserUrl)throw"Service unavailable"
const url=new URL(this.config.createUserUrl.url)
url.searchParams.append("param",props.account)
const r=await sendUserSelfRequest(this.config.createUserUrl.resolve(url.href),props,true)
if(this.auth&&props.account)this.auth.listeners.emit("userUpdated",props.account,props)
return r}async createGroup(props){if(!this.config.createGroupUrl)throw"Service unavailable"
const url=new URL(this.config.createGroupUrl.url)
url.searchParams.append("param",props.account)
const r=await sendUserSelfRequest(this.config.createGroupUrl.resolve(url.href),props,true)
if(this.auth&&props.account)this.auth.listeners.emit("userUpdated",props.account,props)
return r}async updateUser(props){var _a
if(!this.config.updateUserUrl)throw"Service unavailable"
const r=await sendUserSelfRequest(this.config.updateUserUrl,props,true)
const auth=this.auth
if(auth){if(props.account===((_a=auth.currentUser)===null||_a===void 0?void 0:_a.account))await auth.fetchUser()
auth.listeners.emit("userUpdated",props.account,props)}return r}async updateGroup(props){if(!this.config.updateGroupUrl)throw"Service unavailable"
const r=await sendUserSelfRequest(this.config.updateGroupUrl,props,true)
const auth=this.auth
if(auth){await auth.fetchUser()
auth.listeners.emit("userUpdated",props.account,props)}return r}}export function configUserSelfSrv(publicExecFrameUrl,authenticatedExecFrameUrl,config){if(!config)config={}
if(!("loginUrl"in config))config.loginUrl=publicExecFrameUrl.resolve("u/loginWeb")
if(!("logoutUrl"in config))config.logoutUrl=authenticatedExecFrameUrl.resolve("u/logoutWeb")
if(!("pwdLostUrl"in config))config.pwdLostUrl=publicExecFrameUrl.resolve("u/pwdLost")
if(!("checkPwdUrl"in config))config.checkPwdUrl=publicExecFrameUrl.resolve("u/checkPwdWeb")
if(!("renewPwdUrl"in config))config.renewPwdUrl=publicExecFrameUrl.resolve("u/renewPwdWeb")
if(!("updateUserUrl"in config))config.updateUserUrl=authenticatedExecFrameUrl.resolve("u/updateUser")
if(!("updateGroupUrl"in config))config.updateGroupUrl=authenticatedExecFrameUrl.resolve("u/updateGroup")
if(!("createUserUrl"in config))config.createUserUrl=authenticatedExecFrameUrl.resolve("u/createUser")
if(!("createGroupUrl"in config))config.createGroupUrl=authenticatedExecFrameUrl.resolve("u/createGroup")
return config}async function sendUserSelfRequest(url,props,addCsrfHeader){const initReq={method:"POST"}
if(props){const body=initReq.body=new FormData
body.append("userProps",CDM.stringify(props))}if(addCsrfHeader)initReq.headers={ScCsrf:"1"}
try{const resp=await url.fetchJson("",IO.addLang(initReq))
return resp||{result:"otherFailure"}}catch(e){return{result:"otherFailure",secondaryResults:{error:"message"in e?e.message:e}}}}export var USERSELF;(function(USERSELF){function tcheckUserSelfRespError(resp,defaultMsg){let defaultErrorStr=defaultMsg!=null?defaultMsg:"erreur indéterminée"
if(!resp)return defaultErrorStr
let tcheck=tcheckUserSelfRespError_update(resp)
if(tcheck===null||tcheck.length>0)return tcheck
tcheck=tcheckUserSelfRespError_create(resp)
if(tcheck===null||tcheck.length>0)return tcheck
switch(resp.result){case"failedInvalidDatas":if(resp.secondaryResults&&resp.secondaryResults.error){switch(resp.secondaryResults.error.type){case"NickConflictException":let pseudo=resp.secondaryResults.error.nameInConflict
return`Le pseudo \'${pseudo}\' a déjà été utilisé, veuillez en saisir un autre.`
case"UserGroupSwitchException":return"Le changement de type groupe/utilisateur n\'est pas autorisé."}}return"Informations fournies incorrectes."
default:return defaultErrorStr}}USERSELF.tcheckUserSelfRespError=tcheckUserSelfRespError
function tcheckUserSelfRespError_update(resp){switch(resp.result){case"updated":return null
case"tooOldToken":case"invalidToken":return"Votre demande de changement de mot de passe a expiré."
case"accountNotFound":return"Ce compte n\'existe pas."
case"accountDisabled":const ts=resp.secondaryResults?resp.secondaryResults.disabledEndDt:0
if(ts>Date.now()-5e3){const lang=document.documentElement.lang||undefined
const date=new Date(ts)
const localeDate=date.toLocaleDateString(lang)
const localeTime=date.toLocaleTimeString(lang,{hour:"numeric",minute:"numeric"})
return`Ce compte a été temporairement désactivé et sera de nouveau actif le ${localeDate} vers ${localeTime}.`}else return"Ce compte est désactivé."
case"failedInvalidDatas":case"otherFailure":default:return""}}function tcheckUserSelfRespError_create(resp){switch(resp.result){case"available":return null
case"validationPending":return null
case"failedAccountConflict":return"Cet identifiant de compte a déjà été utilisé."
case"failedInvalidDatas":default:return""}}})(USERSELF||(USERSELF={}))

//# sourceMappingURL=userSelf.js.map