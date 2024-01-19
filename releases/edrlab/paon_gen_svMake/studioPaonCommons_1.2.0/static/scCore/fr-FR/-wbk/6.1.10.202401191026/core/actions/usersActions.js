import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/dialogs_Perms.js"
import{EUserAspects,EUserType,USER}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/actions/actions_Perms.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{MsgOver}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{USERSELF}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/userSelf.js"
export class UsersAction extends Action{constructor(){super(...arguments)
this.mode="multi"}setMode(mode){this.mode=mode}isVisible(ctx){if(!ctx.reg)return false
if(!ctx.users)return false
if(this.mode==="multi"&&!ctx.users.find(user=>!user.isReadOnly))return false
if(this.mode==="mono"&&ctx.users.length!==1)return false
return super.isVisible(ctx)}}export class CreateUserAction extends Action{constructor(userType,id){super(id||"createUserAction"+userType)
this.userType=userType
if(this.userType===EUserType.user){this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/actions/users/add-user.svg"
this._label="Ajouter un utilisateur"
this._description="Ajout d\'un utilisateur"
this._enablePerms="action.users#create.user"}else{this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/actions/users/add-user-group.svg"
this._label="Ajouter un groupe"
this._description="Ajout d\'un groupe"
this._enablePerms="action.users#create.group"}this._group="addRemove"}async execute(ctx,ev){const{UserCreate:UserCreate,GroupCreate:GroupCreate}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/userCreate.js")
return this.userType===EUserType.user?POPUP.showDialog((new UserCreate).initialize(ctx),ctx.reg.env.uiRoot,{titleBar:{barLabel:{label:"Nouvel utilisateur"}},fixSize:false,resizer:{}}).onNextClose():POPUP.showDialog((new GroupCreate).initialize(ctx),ctx.uiAnchor||ctx.reg.env.uiRoot,{titleBar:{barLabel:{label:"Nouveau groupe"}},fixSize:false,resizer:{}}).onNextClose()}}CreateUserAction.SINGLETON_user=new CreateUserAction(EUserType.user)
CreateUserAction.SINGLETON_group=new CreateUserAction(EUserType.group)
export class DeleteUsersAction extends UsersAction{constructor(userType,id){super(id||"deleteUsersAction"+userType)
this.userType=userType
this._label=ctx=>{if(ctx.users&&ctx.users.length>1)return this.userType===EUserType.group?"Supprimer les groupes":"Supprimer les utilisateurs"
else return this.userType===EUserType.group?"Supprimer le groupe":"Supprimer l\'utilisateur"}
this._description=ctx=>{if(ctx.users&&ctx.users.length>1)return this.userType===EUserType.group?"Suppression des groupes":"Suppression des utilisateurs"
else return this.userType===EUserType.group?"Suppression de groupe":"Suppression d\'utilisateur"}
this._group="addRemove"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/delete.svg")
this.requireEnabledPerm(this.userType===EUserType.user?"action.users#drop.user":"action.users#drop.group")}isEnabled(ctx){var _a
if((_a=ctx.users)===null||_a===void 0?void 0:_a.find(user=>user.account===ctx.reg.env.universe.auth.currentUser.account))return false
return super.isEnabled(ctx)}async execute(ctx,ev){const reg=ctx.reg
const adminUsersSrv=ctx.reg.env.universe.adminUsers
let msg
if(ctx.users.length===1&&ctx.users[0].userType===EUserType.user){const userName=USER.getPrimaryName(ctx.users[0])
msg=`Voulez-vous vraiment supprimer le compte de l\'utilisateur \'${userName}\' ?`}else if(ctx.users.length===1&&ctx.users[0].userType===EUserType.group){const userName=USER.getPrimaryName(ctx.users[0])
msg=`Voulez-vous vraiment supprimer le groupe \'${userName}\' ?`}else if(this.userType===EUserType.group){const usersCount=ctx.users.length
msg=`Voulez-vous vraiment supprimer les \'${usersCount}\' groupes ?`}else{const usersCount=ctx.users.length
msg=`Voulez-vous vraiment supprimer les comptes des \'${usersCount}\' utilisateurs ?`}if(await POPUP.confirm(msg,null,{okLbl:"Supprimer",cancelLbl:"Annuler"})){try{let errorsArray=new Map
let accounts=[]
ctx.users.forEach(user=>{if(user.account==ctx.reg.env.universe.auth.currentUser.account)errorsArray.set(user.account,"Suppression interdite du compte courant.")
else accounts.push(user.account)})
if(this.userType===EUserType.user)await adminUsersSrv.dropUsers(accounts)
else await adminUsersSrv.dropGroups(accounts)
if(errorsArray.size>0){let errorsCount=errorsArray.size
let usersList=Array.from(errorsArray.keys()).join(", ")
await ERROR.show(errorsCount==1?`Un compte n\'a pas pu être supprimé : ${usersList}.`:`${errorsCount} comptes n\'ont pas pu être supprimés : ${usersList}.`,new Error(Array.from(errorsArray.values()).join("\n\n")))}return true}catch(e){await ERROR.report(`La suppression des comptes n\'a pas pu aboutir. Veuillez réessayer ultérieurement.`,e)
return false}}}}DeleteUsersAction.SINGLETON_user=new DeleteUsersAction(EUserType.user)
DeleteUsersAction.SINGLETON_group=new DeleteUsersAction(EUserType.group)
export class DisableUsersAction extends UsersAction{constructor(userType,userAction,id){super(id||"disableUsersAction_"+userType+"_"+userAction)
this.userType=userType
this.userAction=userAction
this._label=ctx=>{if(this.userAction=="disable"){if(ctx.users&&ctx.users.length>1)return this.userType===EUserType.group?"Désactiver les groupes":"Désactiver les utilisateurs"
else return this.userType===EUserType.group?"Désactiver le groupe":"Désactiver l\'utilisateur"}else{if(ctx.users&&ctx.users.length>1)return this.userType===EUserType.group?"Réactiver les groupes":"Réactiver les utilisateurs"
else return this.userType===EUserType.group?"Réactiver le groupe":"Réactiver l\'utilisateur"}}
this._description=ctx=>{if(this.userAction=="disable"){if(ctx.users&&ctx.users.length>1)return this.userType===EUserType.group?"Désactivation des groupes":"Désactivation des utilisateurs"
else return this.userType===EUserType.group?"Désactivation de groupe":"Désactivation d\'utilisateur"}else{if(ctx.users&&ctx.users.length>1)return this.userType===EUserType.group?"Réactivation des groupes":"Réactivation des utilisateurs"
else return this.userType===EUserType.group?"Réactivation de groupe":"Réactivation d\'utilisateur"}}
this._group="props"
this.setIcon(this.userAction=="disable"?"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/user/disabled.svg":"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/user/enabled.svg")
this.requireEnabledPerm(this.userType===EUserType.user?"action.users#update.user":"action.users#update.group")}isVisible(ctx){const adminUsersSrv=ctx.reg.env.universe.adminUsers
if(ctx.users&&!ctx.users.find(user=>user.isDisabled==(this.userAction==="enable"?true:undefined)))return false
if(!adminUsersSrv.hasAspect(EUserAspects.updatable))return false
return super.isVisible(ctx)}isEnabled(ctx){if(ctx.users&&ctx.users.length==1&&ctx.users[0].account==ctx.reg.env.universe.auth.currentUser.account)return false
return super.isEnabled(ctx)}async execute(ctx,ev){const reg=ctx.reg
const adminUsersSrv=ctx.reg.env.universe.adminUsers
const userSelf=ctx.reg.env.universe.userSelf
let msg
if(ctx.users.length===1&&ctx.users[0].userType===EUserType.user){const userName=USER.getPrimaryName(ctx.users[0])
msg=this.userAction=="disable"?`Voulez-vous vraiment désactiver l\'utilisateur \'${userName}\' ?`:`Voulez-vous vraiment réactiver l\'utilisateur \'${userName} ?`}else if(ctx.users.length===1&&ctx.users[0].userType===EUserType.group){const userName=USER.getPrimaryName(ctx.users[0])
msg=this.userAction=="disable"?`Voulez-vous vraiment désactiver le groupe \'${userName}\' ?`:`Voulez-vous vraiment réactiver le groupe \'${userName}\' ?`}else if(this.userType===EUserType.group){const usersCount=ctx.users.length
msg=this.userAction=="disable"?`Voulez-vous vraiment désactiver les \'${usersCount}\' groupes ?`:`Voulez-vous vraiment réactiver les \'${usersCount}\' groupes ?`}else{const usersCount=ctx.users.length
msg=this.userAction=="disable"?`Voulez-vous vraiment désactiver les comptes des \'${usersCount}\' utilisateurs ?`:`Voulez-vous vraiment réactiver les comptes des \'${usersCount}\' utilisateurs ?`}if(await POPUP.confirm(msg,null,{okLbl:this.userAction=="disable"?"Désactiver":"Réactiver",cancelLbl:"Annuler"})){try{let msg=new MsgOver
return msg.setCustomMsg("Veuillez patienter...","info").showMsgOver(window.document.body).waitFor(new Promise(async(resolve,refuse)=>{try{const params={isDisabled:this.userAction=="disable"?true:false}
if(ctx.users&&ctx.users.length>0){let countUsers=ctx.users.length
let errorsArray=new Map
for(let ii=0;ii<countUsers;ii++){let user=ctx.users[ii]
let posUser=ii+1
if(ctx.users.length>1)msg.setCustomMsg(`Enregistrements en cours. Utilisateur ${posUser} sur ${countUsers}...`)
else msg.setCustomMsg(`Enregistrements en cours...`)
if(user.account==ctx.reg.env.universe.auth.currentUser.account){errorsArray.set(user.account,"Activation/désactivation du compte courant interdite.")}else{let userParams=Object.assign({},params)
userParams.account=user.account
const resp=this.userType===EUserType.user?await userSelf.updateUser(userParams):await userSelf.updateGroup(userParams)
let errorStr=USERSELF.tcheckUserSelfRespError(resp,"")
if(errorStr===null){let savedProps=await adminUsersSrv.getUser(user.account)}else errorsArray.set(user.account,errorStr)}}if(errorsArray.size==0){resolve(true)}else{let errorsCount=errorsArray.size
let usersList=Array.from(errorsArray.keys()).join(", ")
refuse(ERROR.show(errorsCount==1?`Un utilisateur n\'a pas pu être actualisé : ${usersList}.`:`${errorsCount} utilisateurs n\'ont pas pu être actualisés : ${usersList}.`,new Error(Array.from(errorsArray.values()).join("\n\n"))))}}}catch(e){refuse(ERROR.report(`L\'enregistrement a échoué. Veuillez réessayer ultérieurement.`,e))}}))}catch(e){await ERROR.report(`La modification des utilisateurs/groupes n\'a pas pu aboutir. Veuillez réessayer ultérieurement.`,e)
return false}}}}DisableUsersAction.SINGLETON_user_enable=new DisableUsersAction(EUserType.user,"enable")
DisableUsersAction.SINGLETON_user_disable=new DisableUsersAction(EUserType.user,"disable")
DisableUsersAction.SINGLETON_group_enable=new DisableUsersAction(EUserType.group,"enable")
DisableUsersAction.SINGLETON_group_disable=new DisableUsersAction(EUserType.group,"disable")

//# sourceMappingURL=usersActions.js.map