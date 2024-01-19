export var ESrcRights;(function(ESrcRights){ESrcRights[ESrcRights["read"]=1]="read"
ESrcRights[ESrcRights["listChildren"]=2]="listChildren"
ESrcRights[ESrcRights["write"]=4]="write"
ESrcRights[ESrcRights["remove"]=8]="remove"
ESrcRights[ESrcRights["removeChildren"]=16]="removeChildren"
ESrcRights[ESrcRights["createFile"]=32]="createFile"
ESrcRights[ESrcRights["createFolder"]=64]="createFolder"
ESrcRights[ESrcRights["createChildren"]=128]="createChildren"
ESrcRights[ESrcRights["move"]=256]="move"
ESrcRights[ESrcRights["UPDATES"]=508]="UPDATES"
ESrcRights[ESrcRights["READS"]=3]="READS"
ESrcRights[ESrcRights["ALL"]=511]="ALL"})(ESrcRights||(ESrcRights={}))
export var SEC;(function(SEC){function createSub(ctx,srcRoles,systemRights,businessObject){return new SecurityCtx(ctx.account,srcRoles,ctx.isSuperAdmin,businessObject,systemRights)}SEC.createSub=createSub
class SecurityCtx{constructor(account,srcRoles,isSuperAdmin,businessObject,systemRights){this.account=account||""
if(srcRoles===""){this.srcRoles=[]}else if(srcRoles!=null){this.srcRoles=Array.isArray(srcRoles)?srcRoles:srcRoles.split(" ")}else{this.srcRoles=[SEC.DEFAULT_ROLE_NAME]}if(systemRights!=null)this.srcRi=systemRights
this.isSuperAdmin=isSuperAdmin===true
this.businessObject=businessObject}toString(){return`SecurityCtx{account:'${this.account}', businessObject:${this.businessObject}}`}}SecurityCtx.createSub=createSub
SEC.SecurityCtx=SecurityCtx
SEC.MAIN_ROLES_PREFIX="main:"
SEC.DEFAULT_ROLE_NAME="~default"
SEC.DEFAULT_ROLES=[SEC.DEFAULT_ROLE_NAME]
SEC.FALLBACK_ROLE_NAME="main:~fallback"
SEC.FALLBACK_ROLES=[SEC.FALLBACK_ROLE_NAME]
function injectFallbackRole(pRoles){if(!pRoles)return[]
if(!pRoles.find(role=>role.startsWith(SEC.MAIN_ROLES_PREFIX)))pRoles.push(SEC.FALLBACK_ROLE_NAME)
return pRoles}SEC.injectFallbackRole=injectFallbackRole})(SEC||(SEC={}))

//# sourceMappingURL=security.js.map