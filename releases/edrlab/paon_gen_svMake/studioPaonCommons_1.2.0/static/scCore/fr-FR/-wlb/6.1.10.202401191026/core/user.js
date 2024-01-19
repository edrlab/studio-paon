import{EventsMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{IO,isEndPointErrorHookable}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{CDM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/cdm.js"
export var EUserType;(function(EUserType){EUserType["user"]="user"
EUserType["group"]="group"})(EUserType||(EUserType={}))
export class UserSrvBase{hasAspect(aspect){return this.config.usersAspects&&this.config.usersAspects.indexOf(aspect)>-1?true:false}}export class AuthSrv{constructor(config,universe){this.config=config
this.listeners=new EventsMgr
this.broadcastsPending=0
const noAuth=universe.reg.env.noAuthentication=this.config.noAuthentication||false
if(!noAuth){this.authBroadcast=new BroadcastChannel("auth:"+(this.config.rootUrl||"/"))
this.authBroadcast.onmessage=async ev=>{if(ev.data==="loggedUserChanged"){try{this.broadcastsPending++
await this.fetchUser()}finally{this.broadcastsPending--}}}}}get currentAccount(){if(this.user)return this.user.account
if(this.config.anonymousUser)return this.config.anonymousUser.account
return""}get currentUser(){return this.user||this.config.anonymousUser}get currentAuthenticatedUser(){return this.user}get anonymousUser(){return this.config.anonymousUser}get isSuperAdmin(){return this.user&&this.user.isSuperAdmin}async fetchUser(){if(!this.config.noAuthentication){if(!this.currentUserUrl){this.currentUserUrl=this.config.adminUsersUrl.resolve("?cdaction=CurrentUser")
if(isEndPointErrorHookable(this.currentUserUrl)){const sub=this.currentUserUrl.errorHook
this.currentUserUrl.setErrorHook(sub?{onEndPointError:function(res){if(res.status===403)return
sub.onEndPointError(res)}}:null)}}const r=await this.currentUserUrl.fetch(null,"text")
if(r.ok){await this.setCurrentUser(JSON.parse(r.asText),r.asText)}else{await this.setCurrentUser(null,null)}}else if(this.config.anonymousUser){await this.setCurrentUser(this.config.anonymousUser,"")}else throw Error("Error config : no authentication and no anonymous user defined")
return this.currentUser}async updateCurrentUser(props){if(!this.config.noAuthentication){const initReq={}
initReq.method="POST"
const body=initReq.body=new FormData
body.append("userProps",CDM.stringify(props))
initReq.headers={ScCsrf:"1"}
const r=await this.config.adminUsersUrl.fetchJson("?cdaction=UpdateCurrentUser",initReq)
if(r.user){await this.setCurrentUser(r.user,JSON.stringify(r.user))
this.listeners.emit("userUpdated",this.currentUser.account,this.currentUser)
return true}}else throw Error("Error config : no authentication defined")
return false}async fetchFlattenedGroups(){const u=await this.config.adminUsersUrl.fetchJson("?cdaction=CurrentUser&fields=flattenedGroups")
return u.flattenedGroups||[u.account]}onDisconnect(){this.setCurrentUser(null,null)}setCurrentUser(u,stamp){var _a
if(this.userStamp!==stamp){if(this.broadcastsPending===0&&this.user!==undefined){(_a=this.authBroadcast)===null||_a===void 0?void 0:_a.postMessage("loggedUserChanged")}const old=this.currentUser
this.user=u
this.userStamp=stamp
return this.listeners.emitAsync("loggedUserChanged",old,u)}}}export function configAuthSrv(authenticatedExecFrameUrl,publicExecFrameUrl,config){if(!config)config={}
if(!config.adminUsersUrl)config.adminUsersUrl=authenticatedExecFrameUrl.resolve("u/adminUsers")
if(config.anonymousUser)config.anonymousUser.isAnonymous=true
return config}export class UsersSrv extends UserSrvBase{constructor(config){super()
this.config=config
this.fetchingReq=null}connectToAuth(auth){this.auth=auth
this.auth.listeners.on("userUpdated",account=>{this.invalidateCacheFor(account)})}async getUser(nickOrAccount){const cache=this.getFromCache(nickOrAccount)
if(cache)return cache
const resp=await this.config.adminUserUrl.fetchJson(IO.qs("cdaction","Display","param",nickOrAccount))
if(resp.user)this.enrichCache(nickOrAccount,resp.user)
return resp.user}async getUserBatch(nickOrAccount){const cache=this.getFromCache(nickOrAccount)
if(cache)return cache
if(!this.fetchingReq){this.fetchingReq=new Map
Promise.resolve().then(async()=>{const tasks=this.fetchingReq
this.fetchingReq=null
try{const userMap=await this.getUserMap(Array.from(tasks.keys()))
for(const[k,v]of tasks){let user=userMap[k]||{account:k,isUnknown:true}
if(user)this.enrichCache(k,user)
v.resolver(user)}}catch(e){for(const v of tasks.values()){v.rejecter(e)}}})}let fetching=this.fetchingReq.get(nickOrAccount)
if(!fetching){fetching=new FetchingUser
this.fetchingReq.set(nickOrAccount,fetching)}return fetching.promise}async getUserMap(nicksOrAccounts,addFields,removeFields){const fields=addFields||(removeFields?[]:null)
if(removeFields)fields.concat(removeFields.map(entry=>`-${entry}`))
return this.config.adminUserUrl.fetchJson(IO.qs("cdaction","DisplaySet","param",nicksOrAccounts.join("\t"),"fields",fields))}async getUserSet(nicksOrAccounts,preserveUnknown=false){const resp=await this.getUserMap(nicksOrAccounts)
const users=[]
for(const userAccount in resp){if(resp[userAccount])users.push(resp[userAccount])
else if(preserveUnknown)users.push({account:userAccount,isUnknown:true})}return users}async list(firstChars,filterType,includeIsHidden,filterGroupsMembers,maxResults,fieldMatchRegExp,fieldMatchList,addFields,removeFields,filterRoles){const fields=addFields||(removeFields?[]:null)
if(removeFields)fields.concat(removeFields.map(entry=>`-${entry}`))
const params={}
if(firstChars)params.firstChars=firstChars
if(filterType)params.filterType=filterType
if(includeIsHidden!=null)params.filterHidden=includeIsHidden
if(filterGroupsMembers===null||filterGroupsMembers===void 0?void 0:filterGroupsMembers.length)params.filterGroupsMembers=filterGroupsMembers
if(filterRoles===null||filterRoles===void 0?void 0:filterRoles.length)params.filterRoles=filterRoles
if(maxResults)params.maxResults=maxResults
if(fieldMatchRegExp){let regExpTxt=""
if(fieldMatchRegExp.flags)regExpTxt+="(?"+fieldMatchRegExp.flags+")"
regExpTxt+=fieldMatchRegExp.source
params.fieldMatchRegExp=regExpTxt}if(fieldMatchList)params.fieldsContainsList=fieldMatchList
return this.config.adminUserUrl.fetchJson(IO.qs("cdaction","List","options",CDM.stringify(params),"fields",fields))}async dropUsers(nicksOrAccounts){const initReq={}
initReq.method="POST"
const body=initReq.body=new FormData
body.append("param",nicksOrAccounts.join("\t"))
initReq.headers={ScCsrf:"1"}
return this.config.adminUserUrl.fetchVoid(IO.qs("cdaction","DropUser"),initReq)}async dropGroups(nicksOrAccounts){const initReq={}
initReq.method="POST"
const body=initReq.body=new FormData
body.append("param",nicksOrAccounts.join("\t"))
initReq.headers={ScCsrf:"1"}
return this.config.adminUserUrl.fetchVoid(IO.qs("cdaction","DropGroup"),initReq)}async resolveRoles(groupesNicksOrAccounts){const initReq={}
initReq.method="POST"
const body=initReq.body=new FormData
body.append("param",groupesNicksOrAccounts.join("\t"))
return this.config.adminUserUrl.fetchJson(IO.qs("cdaction","ResolveRoles"),initReq)}createUser(){throw"Use userSelf svc"}createGroup(){throw"Use userSelf svc"}updateUser(){throw"Use userSelf svc"}updateGroup(){throw"Use userSelf svc"}getFromCache(nickOrAccount){return this.cache?this.cache.get(nickOrAccount):undefined}invalidateCacheFor(nickOrAccount){if(!this.cache)return
const user=this.cache.get(nickOrAccount)
if(user){this.cache.delete(user.account)
if(user.nickNames)for(let i=0;i<user.nickNames.length;i++)this.cache.delete(user.nickNames[i])}else if(user===null){this.cache.delete(nickOrAccount)}}enrichCache(asked,user){if(this.cache==null){this.cache=new Map
setTimeout(()=>{this.cache=null},1e4)}if(user){this.cache.set(user.account,user)
if(user.nickNames)for(let i=0;i<user.nickNames.length;i++)this.cache.set(user.nickNames[i],user)
this.cache.set(asked,null)}}}export var EUserAspects;(function(EUserAspects){EUserAspects["groupable"]="groupable"
EUserAspects["rolable"]="rolable"
EUserAspects["updatable"]="updatable"
EUserAspects["oneNickName"]="oneNickName"
EUserAspects["hideable"]="hideable"
EUserAspects["enabledEndDt"]="enabledEndDt"})(EUserAspects||(EUserAspects={}))
export function configUsersSrv(authenticatedExecFrameUrl,config,forAdmin){if(!config)config={}
if(!config.adminUserUrl)config.adminUserUrl=authenticatedExecFrameUrl.resolve(forAdmin?"u/adminUsers":"u/useUsers")
return config}class FetchingUser{constructor(){this.promise=new Promise((resolve,reject)=>{this.resolver=resolve
this.rejecter=reject})}}export var USER;(function(USER){USER.anonymousLabel="Utilisateurs non authentifiés"
function getPrimaryName(user){if(user.isAnonymous)return USER.anonymousLabel
if(user.userType===EUserType.group)return user.groupName||user.account
const nicks=user.nickNames
return nicks&&nicks.length>0?nicks[0]:user.account}USER.getPrimaryName=getPrimaryName
function getLongName(user){if(user.userType===EUserType.group)return""
const fn=user.firstName
const ln=user.lastName
return fn&&ln?`${fn} ${ln}`:fn||ln||""}USER.getLongName=getLongName
function getIconUrl(user){return user.userType===EUserType.group?"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/group.svg":"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/user.svg"}USER.getIconUrl=getIconUrl})(USER||(USER={}))

//# sourceMappingURL=user.js.map