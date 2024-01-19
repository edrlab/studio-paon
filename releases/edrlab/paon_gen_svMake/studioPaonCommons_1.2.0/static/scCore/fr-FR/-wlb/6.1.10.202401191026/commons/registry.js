import{SEC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/security.js"
import{EventMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
export function isRegPointer(pointer){return pointer&&pointer.reg!=null}export var REG;(function(REG){function getReg(ctx){if(ctx instanceof Node)return findRegFromDom(ctx)||REG.reg
return ctx?ctx.reg||REG.reg:REG.reg}REG.getReg=getReg
function findReg(from,ctx){if(ctx){if(ctx.reg)return ctx.reg
if(ctx instanceof Node)return findRegFromDom(ctx)||findRegFromDom(from)||REG.reg}return findRegFromDom(from)||REG.reg}REG.findReg=findReg
function findRegFromDom(from){let n=from
while(n){if(isRegPointer(n))return n.reg
n="logicalParent"in n?n.logicalParent:n.assignedSlot||n.parentElement||(n.parentNode instanceof ShadowRoot?n.parentNode.host:null)}return null}async function findScPermLibPath(permCode){let{SC_PERMS:SC_PERMS}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/scPerms.js")
return SC_PERMS[permCode]}REG.findScPermLibPath=findScPermLibPath
function createSubReg(fromUi,businessObject){const subReg=new SubReg(fromUi instanceof REG.Reg?fromUi:REG.findReg(fromUi))
if(businessObject instanceof REG.Reg)subReg.copyFrom(businessObject)
else if(isRegPointer(businessObject))subReg.copyFrom(businessObject.reg)
return subReg}REG.createSubReg=createSubReg
function createSubRegMixed(uiReg,bizReg){return new SubReg(uiReg).copyFrom(bizReg)}REG.createSubRegMixed=createSubRegMixed
function removeSkin(skin,from){while(from.parentNode)from=from.parentNode
for(let ch=from.firstElementChild;ch;ch=ch.nextElementSibling){if(ch.localName==="style"&&ch.getAttribute("data-code")===skin){ch.remove()
return}}}REG.removeSkin=removeSkin
class Reg{constructor(fromSubReg){this._prefLevels=Object.create(null)
this._prefs=Object.create(null)
this._lists=Object.create(null)
this._svcs=Object.create(null)
this._roles=Object.create(null)
if(!fromSubReg){this.addRolePermList({role:SEC.DEFAULT_ROLE_NAME,title:SEC.DEFAULT_ROLE_NAME,priority:0,allow:["DO","DATA"]},1)
this.addRolePermList({role:SEC.FALLBACK_ROLE_NAME,title:SEC.FALLBACK_ROLE_NAME,superRole:SEC.DEFAULT_ROLE_NAME,priority:0,allow:["use"],deny:["DO","DATA"]},1)
this.env=Object.create(null)
this._perms=Object.create(null)
this._volatileUS=Object.create(null)}}get cache(){return this._cache||(this._cache=new Map)}get reg(){return this}get onRegClose(){return this._onRegClose||(this._onRegClose=new EventMgr)}close(){if(this._onRegClose)this._onRegClose.emitCatched()
this._onRegClose=null}get isClosed(){return this._onRegClose===null}resetExtPoints(){this._prefLevels=Object.create(null)
this._prefs=Object.create(null)
this._lists=Object.create(null)
this._svcs=Object.create(null)
this._roles=Object.create(null)
this._perms=Object.create(null)
this._volatileUS=Object.create(null)}newPerm(permName,parentPerm,systemRights){let perm=this._perms[permName]
if(perm)return perm
const parent=this._perms[parentPerm]
if(parentPerm&&!parent)console.warn("Parent permission '"+parentPerm+"' of '"+permName+"' not found in "+this)
perm=new Perm(permName,parent,systemRights)
this._perms[permName]=perm
return perm}getPerm(permName){return this._perms[permName]}hasPerm(perms,security,and){if(!security)security=this.env.securityCtx
if(!security)return false
return this.hasPermission(perms,security.srcRoles,security.isSuperAdmin,security.srcRi,and)}hasPermission(perms,roleNames,isSuperAdmin,systemRights,and){var _a
if(isSuperAdmin===null){const security=(_a=this.env)===null||_a===void 0?void 0:_a.securityCtx
isSuperAdmin=security?security.isSuperAdmin:false}if(isSuperAdmin)return this.hasSystemRights(perms,systemRights,and)!==false
const rolesNames=roleNames||(this.env.noAuthentication?SEC.DEFAULT_ROLES:SEC.FALLBACK_ROLES)
if(Array.isArray(perms)){const l=perms.length
if(l===0)return true
if(and){for(let i=0;i<l;i++){const p=this.evalPermission(perms[i],roleNames,systemRights)
if(p===false)return false
if(p==null)console.warn("Permission '"+perms[i]+"' not declared for roles : "+rolesNames)}return true}else{for(let i=0;i<l;i++){const p=this.evalPermission(perms[i],roleNames,systemRights)
if(p===true)return true
if(p==null)console.warn("Permission '"+perms[i]+"' not declared for roles : "+rolesNames)}return false}}const p=this.evalPermission(perms,rolesNames,systemRights)
if(p==null)console.warn("Permission '"+perms+"' not declared for roles : "+rolesNames)
return p!==false}hasSystemRights(perms,systemRights,and){if(systemRights===undefined){const security=this.env.securityCtx
if(!security)return true
systemRights=security.srcRi}if(Array.isArray(perms)){const l=perms.length
if(l===0)return true
if(and){for(let i=0;i<l;i++){const p=this.evalSystemRights(perms[i],systemRights)
if(p===false)return false
if(p==null)console.warn("Permission '"+perms[i]+"' not declared")}return true}else{for(let i=0;i<l;i++){const p=this.evalSystemRights(perms[i],systemRights)
if(p===true)return true
if(p==null)console.warn("Permission '"+perms[i]+"' not declared")}return false}}return this.evalSystemRights(perms,systemRights)!==false}setVolatileUserStates(key,v){this._volatileUS[key]=v}setPersistUserStates(u){this._persistUS=u}getPersistUserStates(){return this._persistUS}getUserData(key,defaultVal){const level=this.getPrefLevel(key)
if(level>=REG.LEVELAUTH_USER)return this.getPref(key)
let v=this._volatileUS[key]
if(v!==undefined)return v
v=this._getPersistUserData(key)
if(v!==undefined)return v
if(level!==-Infinity)return this.getPref(key)
return defaultVal}_getPersistUserData(key){if(this._persistUS)return this._persistUS.getUserData(key)}setPref(code,levelAuthority,value){const currentLevel=this._prefLevels[code]
if(currentLevel==null||currentLevel<levelAuthority){this._prefLevels[code]=levelAuthority
this._prefs[code]=value
return true}return false}addToList(codeList,codeEntry,levelAuthority,valueEntry,sortKey=0){let list=this._lists[codeList]
if(!list){list=this._lists[codeList]=Object.create(null)}const entry=list[codeEntry]
if(!entry||entry.level<levelAuthority){list[codeEntry]={level:levelAuthority,code:codeEntry,value:valueEntry,sortKey:sortKey}
return true}return false}addSvcToList(codeList,codeEntry,levelAuthority,codeSvc,sortKey=0){let list=this._lists[codeList]
if(!list){list=this._lists[codeList]=Object.create(null)}const entry=list[codeEntry]
if(!entry||entry.level<levelAuthority){list[codeEntry]={level:levelAuthority,code:codeEntry,codeSvc:codeSvc,value:codeSvc!=null?REDIRECT_TO_SVC:null,sortKey:sortKey}
return true}return false}registerSvc(code,levelAuthority,svc){const svcDef=this._svcs[code]
if(!svcDef||svcDef.level<levelAuthority){this._svcs[code]={svc:svc,level:levelAuthority}
return true}else if("override"in svcDef){return this._insertSvcInOverrideChain(svcDef,svc,levelAuthority)}return false}overlaySvc(code,levelAuthority,svc){const svcDef=this._svcs[code]
if(!svcDef||svcDef.level<levelAuthority){this._svcs[code]={svc:svc,level:levelAuthority,override:svcDef}
return true}else if("override"in svcDef){return this._insertSvcInOverrideChain(svcDef,svc,levelAuthority,true)}return false}registerSkin(code,levelAuthority,styles){this.registerSvc(REG.SKIN_PREFIX+code,levelAuthority,new SkinHolder(code,styles))}overlaySkin(code,levelAuthority,styles){this.overlaySvc(REG.SKIN_PREFIX+code,levelAuthority,new SkinHolder(code,styles))}addRolePermList(rolePermList,levelAuthority){if(Array.isArray(rolePermList)){for(const i in rolePermList)this.addRolePermList(rolePermList[i],levelAuthority)
return}if(!rolePermList.role)return
let r=this._roles[rolePermList.role]
if(!r)r=this._roles[rolePermList.role]={role:rolePermList.role,perms:Object.create(null)}
if("title"in rolePermList){if(!r.title||r.title.level<levelAuthority)r.title={level:levelAuthority,value:rolePermList.title}}if("priority"in rolePermList){if(!r.priority||r.priority.level<levelAuthority)r.priority={level:levelAuthority,value:rolePermList.priority}}if("superRole"in rolePermList){if(!r.superRole||r.superRole.level<levelAuthority)r.superRole={level:levelAuthority,value:rolePermList.superRole}}if("setPerm"in rolePermList){if(!r.setPerm||r.setPerm.level<levelAuthority)r.setPerm={level:levelAuthority,value:rolePermList.setPerm}}if(rolePermList.deny)for(let i=0,l=rolePermList.deny.length;i<l;i++){const permName=rolePermList.deny[i]
const pre=r.perms[permName]
if(!pre||pre.level<levelAuthority)r.perms[permName]={level:levelAuthority,value:false}}if(rolePermList.allow)for(let i=0,l=rolePermList.allow.length;i<l;i++){const permName=rolePermList.allow[i]
const pre=r.perms[permName]
if(!pre||pre.level<levelAuthority)r.perms[permName]={level:levelAuthority,value:true}}if(rolePermList.erase)for(let i=0,l=rolePermList.erase.length;i<l;i++){const permName=rolePermList.erase[i]
const pre=r.perms[permName]
if(!pre||pre.level<levelAuthority)r.perms[permName]={level:levelAuthority,value:null}}}copyFrom(other){if(other)other.copyTo(this)
return this}copyTo(other){Object.assign(other.env,this.env)
Object.assign(other._perms,this._perms)
for(const nm of Object.getOwnPropertyNames(this._prefs)){other.setPref(nm,this._prefLevels[nm],this._prefs[nm])}for(const nm of Object.getOwnPropertyNames(this._svcs)){const svc=this._svcs[nm]
if("override"in svc){other.overlaySvc(nm,svc.level,svc.svc)}else{other.registerSvc(nm,svc.level,svc.svc)}}for(const nm of Object.getOwnPropertyNames(this._lists)){const lst=this._lists[nm]
for(const entry of Object.values(lst)){if(entry.value===REDIRECT_TO_SVC)other.addSvcToList(nm,entry.code,entry.level,entry.codeSvc,entry.sortKey)
else other.addToList(nm,entry.code,entry.level,entry.value,entry.sortKey)}}for(const nm of Object.getOwnPropertyNames(this._roles)){const role=this._roles[nm]
if("title"in role)other.addRolePermList({role:nm,title:role.title.value},role.title.level)
if("description"in role)other.addRolePermList({role:nm,description:role.description.value},role.description.level)
if("priority"in role)other.addRolePermList({role:nm,priority:role.priority.value},role.priority.level)
if("sortKey"in role)other.addRolePermList({role:nm,sortKey:role.sortKey.value},role.sortKey.level)
if("superRole"in role)other.addRolePermList({role:nm,superRole:role.superRole.value},role.superRole.level)
if("setPerm"in role)other.addRolePermList({role:nm,setPerm:role.setPerm.value},role.setPerm.level)
for(const[perm,val]of Object.entries(role.perms)){if(val.value===true){other.addRolePermList({role:nm,allow:[perm]},val.level)}else if(val.value===false){other.addRolePermList({role:nm,deny:[perm]},val.level)}else{other.addRolePermList({role:nm,erase:[perm]},val.level)}}}}getPref(code,defaultValue){return code in this._prefs?this._prefs[code]:defaultValue}getList(codeList){const list=this._getListEntries(codeList)
if(!list)return null
const result=[]
for(const code in list){if(list[code].value!=null)result.push(list[code])}result.sort(sortEntries)
let i,k
for(i=0,k=0;i<result.length;i++){let val=result[i].value
if(val===REDIRECT_TO_SVC){val=this.getSvc(result[i].codeSvc)
if(val)result[k++]=val}else{result[k++]=val}}if(k<i)result.splice(k)
return result}getListAsMap(codeList){const list=this._getListEntries(codeList)
if(!list)return null
const result=Object.create(null)
for(const code in list){const entry=list[code]
if(entry.value!=null)result[entry.code]=entry.value===REDIRECT_TO_SVC?this.getSvc(entry.codeSvc):entry.value}return result}isListFilled(codeList){const list=this._getListEntries(codeList)
if(!list)return false
for(const code in list){if(list[code].value!=null)return true}return false}mergeLists(...cdLists){if(cdLists.length===1)return this.getList(cdLists[0])||[]
const mergedList=Object.create(null)
for(let i=0;i<cdLists.length;i++){const list=this._getListEntries(cdLists[i])
if(list){for(const code in list){const entry=list[code]
const mergedEntry=mergedList[entry.code]
if(!mergedEntry||mergedEntry.level<entry.level){mergedList[entry.code]=entry}}}}const result=[]
for(const code in mergedList){const entry=mergedList[code]
if(entry.value!=null)result.push(entry)}result.sort(sortEntries)
let i,k
for(i=0,k=0;i<result.length;i++){let val=result[i].value
if(val===REDIRECT_TO_SVC){val=this.getSvc(result[i].codeSvc)
if(val)result[k++]=val}else{result[k++]=val}}if(k<i)result.splice(k)
return result}mergeListsAsMap(...cdLists){if(cdLists.length===1)return this.getListAsMap(cdLists[0])||Object.create(null)
const mergedList=Object.create(null)
for(let i=0;i<cdLists.length;i++){const list=this._getListEntries(cdLists[i])
if(list){for(const code in list){const entry=list[code]
const mergedEntry=mergedList[entry.code]
if(!mergedEntry||mergedEntry.level<entry.level){mergedList[entry.code]=entry}}}}const result=Object.create(null)
for(const code in mergedList){const entry=mergedList[code]
if(entry.value!=null)result[entry.code]=entry.value===REDIRECT_TO_SVC?this.getSvc(entry.codeSvc):entry.value}return result}getSvc(code,ifNone){try{const svcDef=this._svcs[code]
if(!svcDef)return ifNone
if(svcDef.svc==null)return svcDef.svc
if("override"in svcDef)this._setOverridenSvc(code,svcDef)
return svcDef.svc}catch(e){console.error("Load lib "+code+" failed::",e)
return ifNone}}installSkin(code,from=document){while(from.parentNode)from=from.parentNode
const skin=this.getSvc(REG.SKIN_PREFIX+code)
return skin instanceof SkinHolder?skin.installSkin(from):null}createSkin(code){const skin=this.getSvc(REG.SKIN_PREFIX+code)
return skin instanceof SkinHolder?skin.createStyleElt():null}evalPermission(perm,roleNames,systemRights){const p=this._perms[perm]
if(!p)return null
if(systemRights!=null){let permRi=p
while(permRi){if(permRi.systemRights>0&&~(~permRi.systemRights|systemRights)!=0)return false
permRi=permRi.parent}}if(!roleNames||roleNames.length===0)return false
if(roleNames.length>1){roleNames.sort((r1,r2)=>(this.getRoleProperty(r2,"priority")||0)-(this.getRoleProperty(r1,"priority")||0))}for(let i=0,l=roleNames.length;i<l;i++){let permHier=p
while(permHier){let r=roleNames[i]
while(r){const access=this.getRolePermAccess(r,permHier.name)
if(access==true)return true
if(access==false)return false
r=this.getRoleProperty(r,"superRole")}permHier=permHier.parent}}return null}evalSystemRights(perm,systemRights){const p=this._perms[perm]
if(!p)return null
if(systemRights==null)return true
let permRi=p
while(permRi){if(permRi.systemRights>0&&~(~permRi.systemRights|systemRights)!=0)return false
permRi=permRi.parent}return true}getPrefLevel(code){const lev=this._prefLevels[code]
return lev!=undefined?lev:Number.NEGATIVE_INFINITY}getSvcLevel(code){const svc=this._svcs[code]
return svc?svc.level:Number.NEGATIVE_INFINITY}getEntryListLevel(codeList,codeEntry){const list=this._lists[codeList]
if(!list)return Number.NEGATIVE_INFINITY
const entry=list[codeEntry]
if(!entry)return Number.NEGATIVE_INFINITY
return entry.level}hasRoles(){for(const i in this._roles)return true
return false}getRoleNames(){return Object.keys(this._roles)}getRoleProperty(role,propName){const r=this._roles[role]
if(!r)return undefined
const p=r[propName]
if(!p)return undefined
return p.value}getRolePermNames(role){const r=this._roles[role]
if(!r)return undefined
return r.perms?Object.keys(r.perms):[]}getRolePermAccess(roleName,permName){const r=this._roles[roleName]
if(!r)return undefined
const p=r.perms[permName]
if(!p)return undefined
return p.value}getRolePropertyLevel(roleName,propName){const r=this._roles[roleName]
if(!r)return Number.NEGATIVE_INFINITY
const p=r[propName]
if(!p)return Number.NEGATIVE_INFINITY
return p.level}getRolePermLevel(roleName,permName){const r=this._roles[roleName]
if(!r)return Number.NEGATIVE_INFINITY
const p=r.perms[permName]
if(!p)return Number.NEGATIVE_INFINITY
return p.level}dumpPrefs(){const result=[]
for(const code in this._prefs){result.push({cd:code,value:this._prefs[code],level:this._prefLevels[code]})}return result}dumpSvcs(){const result=[]
for(const code in this._svcs){const svc=this._svcs[code]
result.push({cd:code,value:svc.svc,level:svc.level})}return result}dumpLists(){const result=[]
for(const code in this._lists){const list=this._lists[code]
for(const cdEntry in list){const entry=list[cdEntry]
const obj={cd:code,cdEntry:cdEntry,value:entry.value,sortKey:entry.sortKey,level:entry.level}
if(obj.value===REDIRECT_TO_SVC)obj.value=this.getSvc(entry.codeSvc)
result.push(obj)}}return result}dumpRolePermList(){const result=[]
for(const roleName in this._roles){const role=this._roles[roleName]
const newRole={role:roleName}
if(role.title){newRole.title=role.title.value
newRole.titleLevel=role.title.level}if(role.priority){newRole.priority=role.priority.value
newRole.priorityLevel=role.priority.level}if(role.superRole){newRole.superRole=role.superRole.value
newRole.superRoleLevel=role.superRole.level}if(role.setPerm){newRole.setPerm=role.setPerm.value
newRole.setPermLevel=role.setPerm.level}if(role.sortKey){newRole.sortKey=role.sortKey.value
newRole.sortKeyLevel=role.sortKey.level}if(role.description){newRole.description=role.description.value
newRole.descriptionLevel=role.description.level}for(const[nm,val]of Object.entries(role.perms)){if(val.value===true){if(!newRole.allow)newRole.allow=[nm]
else newRole.allow.push(nm)}else if(val.value===false){if(!newRole.deny)newRole.deny=[nm]
else newRole.deny.push(nm)}else{if(!newRole.erase)newRole.erase=[nm]
else newRole.erase.push(nm)}}result.push(newRole)}return result}getPermsTree(rootPermName){const perm=this._perms[rootPermName||"DO"]
if(perm)return null
const permNode={name:perm.name,systemRights:perm.systemRights}
for(const key in this._perms){const parent=this._perms[key].parent
if(parent&&parent===perm){if(!permNode.children)permNode.children=[]
permNode.children.push(this.getPermsTree(key))}}return permNode}_getListEntries(codeList){return this._lists[codeList]}_insertSvcInOverrideChain(parent,svc,levelAuthority,isOverride){if(!parent.override||parent.override.level<levelAuthority){if(isOverride){parent.override={svc:svc,level:levelAuthority,override:parent.override}}else{parent.override={svc:svc,level:levelAuthority}}return true}else if("override"in parent.override){return this._insertSvcInOverrideChain(parent.override,svc,levelAuthority)}return false}_setOverridenSvc(code,svcDef){const subSvcDef=svcDef.override
if(subSvcDef&&subSvcDef.svc){this._setOverridenSvc(code,subSvcDef)
svcDef.svc.setOverridenSvc(subSvcDef.svc)}}getRegDef(){return this.env?{envKeys:Object.getOwnPropertyNames(this.env)}:{closed:true}}toString(){return JSON.stringify(this.getRegDef())}}REG.Reg=Reg
class SubReg extends Reg{constructor(parentReg){super(true)
this.parentReg=parentReg
this.env=Object.create(this.parentReg.env)
this._perms=Object.create(this.parentReg._perms)
this._volatileUS=Object.create(this.parentReg._volatileUS)}get isClosed(){return this._onRegClose===null||this.parentReg.isClosed}resetExtPoints(){this._prefLevels=Object.create(null)
this._prefs=Object.create(null)
this._lists=Object.create(null)
this._svcs=Object.create(null)
this._roles=Object.create(null)
this._perms=Object.create(this.parentReg._perms)
this._volatileUS=Object.create(this.parentReg._volatileUS)}getPersistUserStates(){if(this._persistUS)return this._persistUS
return this.parentReg.getPersistUserStates()}setPref(code,levelAuthority,value){if(this.parentReg.getPrefLevel(code)>=levelAuthority)return false
return Reg.prototype.setPref.apply(this,arguments)}addToList(codeList,codeEntry,levelAuthority,valueEntry,sortKey=0){if(this.parentReg.getEntryListLevel(codeList,codeEntry)>=levelAuthority)return false
return Reg.prototype.addToList.apply(this,arguments)}addSvcToList(codeList,codeEntry,levelAuthority,codeSvc,sortKey=0){if(this.parentReg.getEntryListLevel(codeList,codeEntry)>=levelAuthority)return false
return Reg.prototype.addSvcToList.apply(this,arguments)}registerSvc(code,levelAuthority,svc){if(this.parentReg.getSvcLevel(code)>=levelAuthority)return false
return Reg.prototype.registerSvc.apply(this,arguments)}overlaySvc(code,levelAuthority,svc){if(this.parentReg.getSvcLevel(code)>=levelAuthority)return false
return Reg.prototype.overlaySvc.apply(this,arguments)}addRolePermList(rolePermList,levelAuthority){if(Array.isArray(rolePermList)){for(let i=0;i<rolePermList.length;i++)this.addRolePermList(rolePermList[i],levelAuthority)
return}const roleName=rolePermList.role
if(!roleName)return
let r=this._roles[roleName]
if(!r)r=this._roles[roleName]={role:roleName,perms:Object.create(null)}
if("sortKey"in rolePermList){if(this.parentReg.getRolePropertyLevel(roleName,"sortKey")<levelAuthority){if(!r.sortKey||r.sortKey.level<levelAuthority){r.sortKey={level:levelAuthority,value:rolePermList.sortKey}}}}if("description"in rolePermList){if(this.parentReg.getRolePropertyLevel(roleName,"description")<levelAuthority){if(!r.description||r.description.level<levelAuthority){r.description={level:levelAuthority,value:rolePermList.description}}}}if("title"in rolePermList){if(this.parentReg.getRolePropertyLevel(roleName,"title")<levelAuthority){if(!r.title||r.title.level<levelAuthority){r.title={level:levelAuthority,value:rolePermList.title}}}}if("description"in rolePermList){if(this.parentReg.getRolePropertyLevel(roleName,"description")<levelAuthority){if(!r.description||r.description.level<levelAuthority){r.description={level:levelAuthority,value:rolePermList.description}}}}if("priority"in rolePermList){if(this.parentReg.getRolePropertyLevel(roleName,"priority")<levelAuthority){if(!r.priority||r.priority.level<levelAuthority){r.priority={level:levelAuthority,value:rolePermList.priority}}}}if("superRole"in rolePermList){if(this.parentReg.getRolePropertyLevel(roleName,"superRole")<levelAuthority){if(!r.superRole||r.superRole.level<levelAuthority){r.superRole={level:levelAuthority,value:rolePermList.superRole}}}}if("setPerm"in rolePermList){if(this.parentReg.getRolePropertyLevel(roleName,"setPerm")<levelAuthority){if(!r.setPerm||r.setPerm.level<levelAuthority){r.setPerm={level:levelAuthority,value:rolePermList.setPerm}}}}if(rolePermList.deny)for(let i=0,l=rolePermList.deny.length;i<l;i++){const permName=rolePermList.deny[i]
if(this.parentReg.getRolePermLevel(roleName,permName)<levelAuthority){const pre=r.perms[permName]
if(!pre||pre.level<levelAuthority){r.perms[permName]={level:levelAuthority,value:false}}}}if(rolePermList.allow)for(let i=0,l=rolePermList.allow.length;i<l;i++){const permName=rolePermList.allow[i]
if(this.parentReg.getRolePermLevel(roleName,permName)<levelAuthority){const pre=r.perms[permName]
if(!pre||pre.level<levelAuthority){r.perms[permName]={level:levelAuthority,value:true}}}}if(rolePermList.erase)for(let i=0,l=rolePermList.erase.length;i<l;i++){const permName=rolePermList.erase[i]
if(this.parentReg.getRolePermLevel(roleName,permName)<levelAuthority){const pre=r.perms[permName]
if(!pre||pre.level<levelAuthority){r.perms[permName]={level:levelAuthority,value:null}}}}}getPref(code,defaultValue){return code in this._prefs?super.getPref(code):this.parentReg.getPref(code,defaultValue)}getSvc(code,ifNone){return code in this._svcs?super.getSvc(code,ifNone):this.parentReg.getSvc(code,ifNone)}getPrefLevel(code){return code in this._prefLevels?super.getPrefLevel(code):this.parentReg.getPrefLevel(code)}getSvcLevel(code){return code in this._svcs?super.getSvcLevel(code):this.parentReg.getSvcLevel(code)}getEntryListLevel(codeList,codeEntry){const list=this._lists[codeList]
if(!list)return this.parentReg.getEntryListLevel(codeList,codeEntry)
const entry=list[codeEntry]
if(!entry)return this.parentReg.getEntryListLevel(codeList,codeEntry)
return entry.level}_getListEntries(codeList){const parentList=this.parentReg._getListEntries(codeList)
if(!parentList)return this._lists[codeList]
const list=this._lists[codeList]
if(!list)return parentList
const result=Object.create(null)
for(const code in list){const entry=list[code]
result[entry.code]=entry}for(const code in parentList){const entry=parentList[code]
if(!(entry.code in result))result[entry.code]=entry}return result}_setOverridenSvc(code,svcDef){const subSvcDef=svcDef.override
if(subSvcDef){Reg.prototype._setOverridenSvc.apply(this,arguments)}else{svcDef.svc.setOverridenSvc(this.parentReg.getSvc(code))}}_getPersistUserData(key){if(this._persistUS){const v=this._persistUS.getUserData(key)
if(v!==undefined)return v}return this.parentReg._getPersistUserData(key)}hasRoles(){for(const i in this._roles)return true
return this.parentReg.hasRoles()}getRoleNames(){const roleNames=this.parentReg.getRoleNames()
for(const i in this._roles){if(roleNames.indexOf(i)==-1)roleNames.push(i)}return roleNames}getRoleProperty(role,propName){const r=this._roles[role]
if(!r)return this.parentReg.getRoleProperty(role,propName)
const p=r[propName]
if(!p)return this.parentReg.getRoleProperty(role,propName)
return p.value}getRolePermNames(role){const r=this._roles[role]
if(!r)return this.parentReg.getRolePermNames(role)
return r.perms?Object.keys(r.perms):[]}getRolePermAccess(role,permName){const r=this._roles[role]
if(!r)return this.parentReg.getRolePermAccess(role,permName)
const p=r.perms[permName]
if(!p)return this.parentReg.getRolePermAccess(role,permName)
return p.value}getRolePropertyLevel(roleName,propName){const r=this._roles[roleName]
if(!r)return this.parentReg.getRolePropertyLevel(roleName,propName)
const p=r[propName]
if(!p)return this.parentReg.getRolePropertyLevel(roleName,propName)
return p.level}getRolePermLevel(roleName,permName){const r=this._roles[roleName]
if(!r)return this.parentReg.getRolePermLevel(roleName,permName)
const p=r.perms[permName]
if(!p)return this.parentReg.getRolePermLevel(roleName,permName)
return p.level}getRegDef(){return this.env?{envKeys:Object.getOwnPropertyNames(this.env),parent:this.parentReg.getRegDef()}:{closed:true,parent:this.parentReg.getRegDef()}}}REG.LEVELAUTH_CORE=1
REG.LEVELAUTH_CLIENT=11
REG.LEVELAUTH_PORTAL=21
REG.LEVELAUTH_PORTAL_FREE=31
REG.LEVELAUTH_MODEL=101
REG.LEVELAUTH_EXT=111
REG.LEVELAUTH_MODEL_FREE=121
REG.LEVELAUTH_USER=1001
REG.LEVELAUTH_RTL_OVR=2001
const REDIRECT_TO_SVC=Object.create(null)
function sortEntries(e1,e2){return e1.sortKey-e2.sortKey}class Perm{constructor(name,parent,systemRights=0){this.name=name
this.parent=parent
this.systemRights=systemRights}toString(){return`${this.parent?this.parent.toString():""}/${this.name}`}}REG.Perm=Perm
REG.IS_skinStyleElt=function(n){return n instanceof HTMLStyleElement&&"_styleHolder"in n}
class SkinHolder{constructor(code,styles){this.code=code
this.styles=styles}setOverridenSvc(skinHolder){if(this.overridenSkinHolder!==skinHolder){if(this.cache){console.log(`WARNING: SkinHolder already used but not stabilized in extPoints: ${this.styles}`)
this.cache=null}this.overridenSkinHolder=skinHolder}}getSkinIfExist(root){for(let i=0;i<root.styleSheets.length;i++){const style=root.styleSheets[i].ownerNode
if(style._styleHolder===this)return style}return null}installSkin(root=document){let style=this.getSkinIfExist(root)
if(style)return style
style=this.createStyleElt()
const stylesRoot=root instanceof Document?root.head:root
if(stylesRoot.firstElementChild&&REG.IS_skinStyleElt(stylesRoot.firstElementChild)){let firstNotSkin=stylesRoot.firstElementChild
while(firstNotSkin&&REG.IS_skinStyleElt(firstNotSkin))firstNotSkin=firstNotSkin.nextElementSibling
stylesRoot.insertBefore(style,firstNotSkin)}else{stylesRoot.insertBefore(style,stylesRoot.firstChild)}return style}createStyleElt(){if(!this.cache){const styleElt=document.createElement("style")
if(this.overridenSkinHolder){const body=[this.styles]
let sub=this.overridenSkinHolder
while(sub){body.push(sub.styles)
sub=sub.overridenSkinHolder}styleElt.textContent=body.reverse().join("\n")}else{styleElt.textContent=this.styles}styleElt.dataset.code=this.code
this.cache=styleElt
if(!stylesRoot){stylesRoot=document.head.appendChild(document.createElement("template"))
stylesRoot.setAttribute("id","extPointsStyles")}stylesRoot.content.appendChild(styleElt)}const styleElt=this.cache.cloneNode(true)
styleElt._styleHolder=this
return styleElt}}REG.SkinHolder=SkinHolder
let stylesRoot
REG.SKIN_PREFIX="skin|"
REG.reg=new Reg})(REG||(REG={}))

//# sourceMappingURL=registry.js.map