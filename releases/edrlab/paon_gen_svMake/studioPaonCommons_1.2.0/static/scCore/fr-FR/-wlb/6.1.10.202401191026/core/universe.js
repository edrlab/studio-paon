import{Desk,UserActiveDeskFeat}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
import{EventsMgr,EventsMgrCb}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{EHttpStatusCode,EndPointResolver,IO,isEndPointErrorHookable,UrlQs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{SEC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/security.js"
import{AuthSrv,configAuthSrv,configUsersSrv,UsersSrv}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
import{configUserDatasSrv,DeskUserDatasSrv,UserDatasSrv}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/userDatas.js"
import{configUserSelfSrv,UserSelfSrv}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/userSelf.js"
import{ROLES}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/roles.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
export class Universe{constructor(config){if(config.id){UNIVERSE.all.set(config.id,this)
if(!config.srvCode)config.srvCode=config.id}this.buildConfig(config)
this.buildUniverse(config)
this.linkUniverse()}getId(){return this.config.id}getName(){return this.config.name||this.config.id}buildConfig(config){}buildUniverse(config){this.config=config
this.reg=config.reg||REG.reg
if(!this.reg)console.trace("No reg found")
this.httpFrames={}
if(config.httpFrames)for(const key in config.httpFrames)this.httpFrames[key]=new HttpExecFrame(this,key,config.httpFrames[key])
if(config.wsFrames){this.wsFrames={}
for(const key in config.wsFrames){const ws=config.wsFrames[key]
if(ws instanceof WsExecFrame||ws instanceof WsProxyExecFrame){this.wsFrames[key]=ws}else if(ws.proxyTo){this.wsFrames[key]=new WsProxyExecFrame(this.getId(),ws.proxyTo)}else{this.wsFrames[key]=new WsExecFrame(this,key,ws)}}}this.reg.env.resolver=(new EndPointResolver).addEndPoint("skin",config.skinUrl).addEndPoint("back",config.backUrl).addEndPoint("lib",config.libUrl).addEndPoint("front",config.frontUrl)}linkUniverse(){this.reg.env.resolver.freeze()
this.reg.env.universe=this}}export class BasicUniverse extends Universe{constructor(config){super(config)}get clId(){var _a
let clId=this._clId
if(!clId){clId=(_a=this.wsFrames.ws)===null||_a===void 0?void 0:_a.clId
if(!clId)clId=(Math.floor(Math.random()*Math.floor(Number.MAX_SAFE_INTEGER))+1).toString(36)
this._clId=clId}return clId}buildConfig(config){var _a
let httpFrames=config.httpFrames
if(!httpFrames)config.httpFrames=httpFrames={}
if(!httpFrames.public){httpFrames.public={execFrameUrl:config.universeUrl.resolve("public/")}}if(isEndPointErrorHookable(httpFrames.public.execFrameUrl))httpFrames.public.execFrameUrl.setErrorHook(this)
if(!httpFrames.web)httpFrames.web={execFrameUrl:config.universeUrl.resolve("web/")}
if(isEndPointErrorHookable(httpFrames.web.execFrameUrl))httpFrames.web.execFrameUrl.setErrorHook(this)
config.auth=configAuthSrv(httpFrames.web.execFrameUrl,httpFrames.public.execFrameUrl,config.auth)
config.userSelf=configUserSelfSrv(httpFrames.public.execFrameUrl,httpFrames.web.execFrameUrl,config.userSelf)
config.userDatas=configUserDatasSrv(httpFrames.web.execFrameUrl,config.userDatas)
if(!("adminLogsUrl"in config))config.adminLogsUrl=httpFrames.web.execFrameUrl.resolve("u/adminLogs")
if(((_a=config.wsFrames)===null||_a===void 0?void 0:_a.ws)&&!("liaiseUrl"in config))config.liaiseUrl=httpFrames.web.execFrameUrl.resolve("u/liaise")
if(!("maintenanceUrl"in config))config.maintenanceUrl=httpFrames.web.execFrameUrl.resolve("u/maintenance")
if(!("batchUrl"in config))config.batchUrl=config.httpFrames.web.execFrameUrl.resolve("u/batch")
if(!("remoteContentUrl"in config))config.remoteContentUrl=config.httpFrames.web.execFrameUrl.resolve("u/remoteContent")}buildUniverse(config){super.buildUniverse(config)
this.auth=config.authSrv||new AuthSrv(config.auth,this)
this.auth.listeners.on("loggedUserChanged",(oldUser,newUser)=>{this.createSecurityCtx(newUser)},-100)
this.userSelf=new UserSelfSrv(config.userSelf)
if(config.userDatas){if(config.userDatas instanceof UserDatasSrv){this.userDatas=config.userDatas}else{this.userDatas=new DeskUserDatasSrv(config.userDatas)
this.userDatas.connectToAuth(this.auth)}this.reg.setPersistUserStates(this.userDatas)}this.reg.env.resolver.addEndPoint("web",this.httpFrames.web.config.execFrameUrl).addEndPoint("public",this.httpFrames.public.config.execFrameUrl)}linkUniverse(){var _a,_b
super.linkUniverse()
this.userSelf.connectToAuth(this.auth)
const ws=(_a=this.wsFrames)===null||_a===void 0?void 0:_a.ws
if(ws){ws.listenAuth(this.auth);(_b=this.userDatas)===null||_b===void 0?void 0:_b.connectToWs(ws)}}onEndPointError(resp){if(resp.status===EHttpStatusCode.forbidden){this.auth.fetchUser()}else if(resp.status===EHttpStatusCode.serviceUnvailable&&this.reg.getSvc("maintenanceCb")){resp.text().then(t=>{const m=JSON.parse(t)
if(m.maintenanceMsg)this.reg.getSvc("maintenanceCb")(this,m.maintenanceMsg)}).catch(e=>{})}}async isSecFetchSiteAware(){const result=await this.httpFrames.public.config.execFrameUrl.fetchJson("_/isSecFetchAware")
return result&&result["Sec-Fetch-Site"]}createSecurityCtx(newUser){this.reg.env.securityCtx=newUser?new SEC.SecurityCtx(newUser.account,ROLES.resolveUserRoles(newUser),newUser.isSuperAdmin,this):null}}export class CoreUniverse extends BasicUniverse{buildConfig(config){super.buildConfig(config)
config.adminUsers=configUsersSrv(config.httpFrames.web.execFrameUrl,config.adminUsers,true)
config.useUsers=configUsersSrv(config.httpFrames.web.execFrameUrl,config.useUsers,false)}buildUniverse(config){super.buildUniverse(config)
this.adminUsers=new UsersSrv(config.adminUsers)
this.useUsers=new UsersSrv(config.useUsers)}linkUniverse(){super.linkUniverse()
this.adminUsers.connectToAuth(this.auth)
this.useUsers.connectToAuth(this.auth)}}export class HttpExecFrame{constructor(universe,key,config){this.universe=universe
this.key=key
this.config=config
if(!config.execFrameUrl)config.execFrameUrl=universe.config.universeUrl.resolve(key)
else if(!config.execFrameUrl.url)config.execFrameUrl=config.execFrameUrl.resolve(IO.resolveUrl(key,universe.config.universeUrl.url))}fetchSvc(servicePath,cdaction,params,format,reqInit){return this.config.execFrameUrl.fetch(buildRequest(servicePath,cdaction,params,reqInit),format,reqInit)}fetchSvcJson(servicePath,cdaction,params,reqInit){return this.config.execFrameUrl.fetchJson(buildRequest(servicePath,cdaction,params,reqInit),reqInit)}getEndPoint(servicePath,cdaction,params){return this.config.execFrameUrl.resolve(buildRequest(servicePath,cdaction,params))}}export var EWsState;(function(EWsState){EWsState[EWsState["wsConnecting"]=0]="wsConnecting"
EWsState[EWsState["wsOpened"]=1]="wsOpened"
EWsState[EWsState["wsClosing"]=2]="wsClosing"
EWsState[EWsState["wsClosed"]=3]="wsClosed"})(EWsState||(EWsState={}))
export function isWsMsgError(m){return m&&"error"in m}export class WsExecFrame{constructor(universe,key,config){this.key=key
this.config=config
this.lcListeners=new EventsMgr
this.keepAliveInterval=12e3
this._flagSent=false
this._reqIdCounter=0
this._respPromises=new Map
this.universe=universe
this.clId=(Math.floor(Math.random()*Math.floor(Number.MAX_SAFE_INTEGER))+1).toString(36)
if(!config.execFrameUrl)config.execFrameUrl=universe.config.universeUrl.resolve(IO.resolveUrl(key,WsExecFrame.switchProtocol(universe.config.universeUrl.url)))
else if(!config.execFrameUrl.url)config.execFrameUrl=config.execFrameUrl.resolve(IO.resolveUrl(key,WsExecFrame.switchProtocol(universe.config.universeUrl.url)))
const keepAlive=config.keepAlive||"onListening"
const loadKey=`ws.${universe.getId()}#${key}`
if(keepAlive==="userActive"){REG.reg.addToList(Desk.LC_load,loadKey,1,()=>{if(UserActiveDeskFeat.isIn(desk)){desk.userActiveLstn.on("active",()=>{this.keepAlive=true
this.startWs()})
desk.userActiveLstn.on("inactive",()=>{this.keepAlive=false
this.stopWs(1e3,"user inactive")})}this.keepAlive=true
this.startWs()})}else if(keepAlive==="indefinitely"){REG.reg.addToList(Desk.LC_load,loadKey,1,()=>{this.keepAlive=true
this.startWs()})}else if(keepAlive==="onListening"){this.msgListenersCb=()=>{const hasLstn=this.hasAnyMsgListener()
if(hasLstn!==this.keepAlive){this.keepAlive=hasLstn
if(hasLstn)this.startWs()
else this.stopWs(1e3,"no more listeners")}}
this.msgListeners=new EventsMgrCb(this.msgListenersCb)
REG.reg.addToList(Desk.LC_load,loadKey,1,()=>{if(UserActiveDeskFeat.isIn(desk)){desk.userActiveLstn.on("active",()=>{if(this.hasAnyMsgListener()){this.keepAlive=true
this.startWs()}})
desk.userActiveLstn.on("inactive",()=>{this.keepAlive=false
this.stopWs(1e3,"user inactive")})}})}if(!this.msgListeners)this.msgListeners=new EventsMgr}static switchProtocol(url){return url.replace(/^http/,"ws")}get wsState(){return this._starting?EWsState.wsConnecting:this._ws?this._ws.readyState:EWsState.wsClosed}get keepAlive(){return typeof this._keepAlive==="number"}set keepAlive(keepAlive){if(keepAlive){if(!this.keepAlive){this._keepAlive=window.setInterval(()=>{if(this._flagSent){this._flagSent=false}else{if(this.wsState===EWsState.wsOpened)this.sendMsg(WsExecFrame.MSG_PING)
else this.startWs()}},this.keepAliveInterval)
this._flagSent=false}}else if(this.keepAlive){clearInterval(this._keepAlive)
this._keepAlive=null}}hasAnyMsgListener(){if(this.msgListeners.hasAnyListeners())return true
if(!this.wsProxies)return false
for(const wsProxy of this.wsProxies){if(wsProxy.msgListeners.hasAnyListeners())return true}return false}startWs(){var _a
if(this._starting)return this._starting
const st=(_a=this._ws)===null||_a===void 0?void 0:_a.readyState
if(st===EWsState.wsOpened){return Promise.resolve()}else if(st===EWsState.wsClosing){if(!this._needRestart)this._needRestart=new Promise(resolver=>{this.lcListeners.once("closed",()=>{this._needRestart=null
resolver(this.startWs())})})
return this._needRestart}if(this._auth&&this._auth.currentUser==null)return Promise.resolve()
return this._starting=new Promise(async(resolve,reject)=>{var _a
try{this._ws=new WebSocket(this.config.execFrameUrl.url+IO.qs("clId",this.clId,"proxy4Universes",(_a=this.wsProxies)===null||_a===void 0?void 0:_a.map(proxy=>proxy.universe).join("*")))
if(WsExecFrame.DEBUG){console.trace("ws created",this._ws.url)
this._ws.onopen=ev=>{console.log("ws opened",this._ws.url)}}this._ws.onerror=ev=>{this._pending=null
if(this._starting)reject(ev)
this.lcListeners.emit("error")
ERROR.log("WebSocket error: "+ev)}
this._ws.onclose=ev=>{if(ev.target!==this._ws)return
if(WsExecFrame.DEBUG)console.log("ws closed",ev.reason,ev.wasClean,this._ws.url)
this._ws=null
this._pending=null
if(this._starting){this._starting=null
resolve()}for(const resp of this._respPromises.values()){try{resp.reject(ev)}catch(e){console.log(e)}}this._respPromises.clear()
this.lcListeners.emit("closed",ev.code,ev.reason,ev.wasClean)
if(ev.code>1001)console.log("WebSocket close",ev)}
this._ws.onmessage=ev=>{if(!this._ws)return
try{const m=JSON.parse(ev.data)
if("reqId"in m){const pending=this._respPromises.get(m.reqId)
if(pending){this._respPromises.delete(m.reqId)
if(isWsMsgError(m)){pending.reject(m)}else{pending.resolve(m)}}}else if("svc"in m){if("u"in m){const cd=m.u
if(this.universe.config.srvCode===cd)this.msgListeners.emitCatched(m.svc,m)
if(this.wsProxies)for(const wsProxy of this.wsProxies){if(wsProxy.universe===cd)wsProxy.msgListeners.emitCatched(m.svc,m)}}else{this.msgListeners.emitCatched(m.svc,m)}}else if(m.buildId!=null){try{if(!this.lastServerBuildId){this.lastServerBuildId=m.buildId}else if(this.lastServerBuildId!==m.buildId){window.location.reload(true)
return}const homeBuildId=window.serverBuildId
if(homeBuildId&&homeBuildId!==m.buildId){const keyLastCheck="lastBuildIdError_"+window.location.pathname+":"+this.universe.getId()
const lastCheck=sessionStorage.getItem(keyLastCheck)
if(lastCheck&&Date.now()-Number.parseInt(lastCheck)<3e4){sessionStorage.removeItem(keyLastCheck)
ERROR.log("Server BuildId not equals between static home ("+homeBuildId+") and server webSocket welcome msg ("+m.buildId+")")}else{sessionStorage.setItem(keyLastCheck,Date.now().toString())
window.location.reload(true)
return}}if(this._starting){this._starting=null
resolve()}}catch(e){if(this._starting){this._starting=null
resolve()}ERROR.log(e)}if(WsExecFrame.DEBUG)console.log("ws inited",this._ws.url,m)
if(this._pending){try{for(let i=0;this._pending&&i<this._pending.length;i++){const m=this._pending[i]
if(!m)continue
this._ws.send(m)
this._pending[i]=null}this._pending=null}catch(e){this.lcListeners.emit("error")
ERROR.log(e)}}this.lcListeners.emit("opened")}}catch(e){this._pending=null
this.lcListeners.emit("error")
ERROR.log(e)}}}catch(e){this._pending=null
if(this._starting){this._starting=null
reject(e)}ERROR.log(e)}})}stopWs(code,reason){if(this._ws&&this._ws.readyState<EWsState.wsClosing)this._ws.close(code,reason)}sendMsg(m){this._ws.send(JSON.stringify(m))
this._flagSent=true}postMsg(m){if(this.wsState===EWsState.wsOpened)this.sendMsg(m)
else{if(!this._pending)this._pending=[]
this._pending.push(JSON.stringify(m))
this.startWs()}}async sendReq(m){const reqId=++this._reqIdCounter
m.reqId=reqId
this.sendMsg(m)
return new Promise((resolve,reject)=>{this._respPromises.set(reqId,{resolve:resolve,reject:reject})})}listenAuth(authServer){this._auth=authServer
authServer.listeners.on("loggedUserChanged",(oldUser,newUser)=>{const restart=this.keepAlive||LANG.in(this.wsState,EWsState.wsOpened,EWsState.wsConnecting)
this.stopWs(1e3,"user disconnected")
if(restart)this.startWs()})}addWsProxy(wsProxy){if(this.wsState!==EWsState.wsClosed)throw Error("WebSocket already started")
if(!this.wsProxies)this.wsProxies=[]
this.wsProxies.push(wsProxy)
this.lcListeners.on("opened",()=>{wsProxy.lcListeners.emit("opened")})
this.lcListeners.on("error",()=>{wsProxy.lcListeners.emit("error")})
this.lcListeners.on("closed",(code,reason,wasClean)=>{wsProxy.lcListeners.emit("closed",code,reason,wasClean)})
wsProxy.msgListeners=this.msgListenersCb?new EventsMgrCb(this.msgListenersCb):new EventsMgr}}WsExecFrame.DEBUG=false
WsExecFrame.MSG_PING=Object.freeze({})
export class WsProxyExecFrame{constructor(universe,target){this.universe=universe
this.target=target
this.lcListeners=new EventsMgr
target.addWsProxy(this)}get clId(){return this.target.clId}get keepAlive(){return this.target.keepAlive}get wsState(){return this.target.wsState}postMsg(m){m.u=this.universe
this.target.postMsg(m)}sendMsg(m){m.u=this.universe
this.target.sendMsg(m)}sendReq(m){m.u=this.universe
return this.target.sendReq(m)}startWs(){this.target.startWs()}listenAuth(authServer){}stopWs(code,reason){throw Error("Should never be called in a WsProxyExecFrame !")}}function buildRequest(servicePath,cdaction,params,reqInit){let path=servicePath
if(params){if(typeof params==="object"&&!(params instanceof URLSearchParams)){const urlParams=new UrlQs
for(const key in params)if(params[key]!=null)urlParams.append(key,params[key].toString())
params=urlParams}if(reqInit&&reqInit.method==="POST"&&reqInit.body==null){if(cdaction)path+="?cdaction="+cdaction
if(!reqInit.headers)reqInit.headers={}
reqInit.headers["Content-type"]="application/x-www-form-urlencoded"
reqInit.body=params}else{if(cdaction){path+="?cdaction="+cdaction
if(params)path+="&"+params}else{if(params)path+="?"+params}}}else if(cdaction){path+="?cdaction="+cdaction}return path}export var UNIVERSE;(function(UNIVERSE){UNIVERSE.all=new Map})(UNIVERSE||(UNIVERSE={}))

//# sourceMappingURL=universe.js.map