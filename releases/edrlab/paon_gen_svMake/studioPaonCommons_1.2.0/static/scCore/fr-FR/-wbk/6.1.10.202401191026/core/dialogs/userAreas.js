import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{ControlAsyncArea,DateInputArea,InputChoiceArea,LabelArea,StringInputArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{EUserAspects,EUserType,USER}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
import{InputOrderedSetPanel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/inputs.js"
import{RolesSelectorInput}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/roles.js"
import{CreateUserAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/actions/usersActions.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{ActionWrapper}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{Box}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/dialogs_Perms.js"
export class UserAccountInputArea extends StringInputArea{constructor(id="account"){super(id)
this.setLabel("Compte")
this.setPattern("[a-zA-Z0-9\\.\\-\\*_@]+")
this.setRequired(true)
this.setVisible(userAreaIsVisible)
this.setEnabled(userAreaIsEnabled)
this.setInputCustomValidity((async function(ctx){if(!this.checkValidity())return'Seuls les caractères alpha-numériques et \".-*_@\" sont autorisés'
if(ctx.usersSrv&&ctx.usersSrv.getUser){if(this.value){let checkedUser=await ctx.usersSrv.getUser(this.value)
if(checkedUser){let code=this.value
return`L\'identifiant d\'utilisateur \'${code}\' a déjà été utilisé.`}}}return""}),500,true)}_buildControl(ctx,name){let input=super._buildControl(ctx,name)
DOM.setAttr(input,"spellcheck","false")
DOM.setAttr(input,"autocomplete","current-password")
return input}}REG.reg.registerSvc("area.users.account",1,new UserAccountInputArea)
class UsesPropertiesArea extends LabelArea{constructor(){super("account")
this.setLabel("Compte")
this.setVisible(userAreaIsVisible)
this.setEnabled(userAreaIsEnabled)}_buildControl(ctx,name){let control=JSX.createElement(Box,{"î":{skinOver:"area-users-props-box"}})
const DTFormatter=new Intl.DateTimeFormat("fr",{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"})
Object.assign(control,{fillJson(parent,root){parent.account=this.dataset.account},extractJson:function(parent){this.dataset.account=parent.account
let rootTag=this.shadowRoot.querySelector("div")
if(!rootTag)rootTag=this.shadowRoot.appendChild(JSX.createElement("div",null))
rootTag.innerHTML=""
let accountLine=rootTag.appendChild(JSX.createElement("div",null))
if(parent.isReadOnly)accountLine.appendChild(JSX.createElement("span",{class:"icon locked",title:"Compte en lecture seule"}))
if(parent.isDisabled)accountLine.appendChild(JSX.createElement("span",{class:"icon disabled",title:"Compte désactivé"}))
if(parent.isHidden&&parent.userType===EUserType.user)accountLine.appendChild(JSX.createElement("span",{class:"icon system",title:"Compte de service"}))
accountLine.appendChild(JSX.createElement("span",{class:"account"},parent.account))
if(parent.pwdDt){let date=DTFormatter.format(parent.pwdDt)
let txt=`Dernier changement de mot de passe : ${date}`
rootTag.appendChild(JSX.createElement("div",{class:"pwd"},txt))}return true}})
return control}}REG.reg.registerSvc("area.users.props",1,new UsesPropertiesArea)
REG.reg.registerSkin("area-users-props-box",1,`\n\t.icon {\n\t\tbackground-repeat: no-repeat;\n\t\tbackground-position: center;\n\t\tbackground-size: auto .9rem;\n\t\tpadding-inline-start: 12px;\n\t\tmargin-inline-end: 0.3em;\n\t}\n\n\t.disabled {\n\t\tbackground-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/user/disabled.svg);\n\t}\n\n\t.locked {\n\t\tbackground-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/user/locked.svg);\n\t}\n\n\t.system {\n\t\tbackground-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/user/system.svg);\n\t}\n\n\t.account {\n\t\tfont-weight: bold;\n\t}\n\n\t.pwd {\n\t\tfont-size: .8rem;\n\t}\n`)
export class UserFirstNameInputArea extends StringInputArea{constructor(id="firstName"){super(id)
this.setLabel("Prénom")
this.setVisible(userAreaIsVisible)
this.setEnabled(userAreaIsEnabled)}_buildControl(ctx,name){let input=super._buildControl(ctx,name)
DOM.setAttr(input,"spellcheck","false")
DOM.setAttr(input,"autocomplete","current-password")
return input}}REG.reg.registerSvc("area.users.firstName",1,new UserFirstNameInputArea)
export class UserLastNameInputArea extends StringInputArea{constructor(id="lastName"){super(id)
this.setLabel("Nom")
this.setVisible(userAreaIsVisible)
this.setEnabled(userAreaIsEnabled)}_buildControl(ctx,name){let input=super._buildControl(ctx,name)
DOM.setAttr(input,"spellcheck","false")
DOM.setAttr(input,"autocomplete","current-password")
return input}}REG.reg.registerSvc("area.users.lastName",1,new UserLastNameInputArea)
export class UserGroupsInputArea extends ControlAsyncArea{constructor(id="groups",includeIsHiddenGroups=true,checkGroupReentrancy=false,loadDatasetOnInit=false){super(id)
this.includeIsHiddenGroups=includeIsHiddenGroups
this.checkGroupReentrancy=checkGroupReentrancy
this.loadDatasetOnInit=loadDatasetOnInit
this.setLabel("Groupes")
this.setVisible(ctx=>{if(!ctx.usersSrv||!ctx.usersSrv.hasAspect(EUserAspects.groupable))return false
return userAreaIsVisible.call(this,ctx)})
this.setEnabled(userAreaIsEnabled)}async _loadControl(ctx,name){let inputBox=JSX.createElement("div",{class:"ctrlLbl"})
const inputElt=inputBox.appendChild((new InputOrderedSetPanel).initialize({dataSet:this.loadDatasetOnInit?await UserGroupsInputArea.fetchGroupsList(ctx,this.includeIsHiddenGroups):{},selectionLabel:"Groupes sélectionnés",availableLabel:"Groupes disponibles",emptySelectionMsg:"Aucun",previewMode:"asLines",availableGridInit:{skinOver:"area-users-groups-tabs",lineDrawer:this},selectionGridInit:{skinOver:"area-users-groups-tabs",lineDrawer:this},name:name,checkValidity:this.checkGroupReentrancy?function(selectedEntries){const incompatList=[]
selectedEntries===null||selectedEntries===void 0?void 0:selectedEntries.forEach(entry=>{var _a,_b
if(((_b=(_a=inputElt.dataSet[entry])===null||_a===void 0?void 0:_a.flattenedGroups)===null||_b===void 0?void 0:_b.indexOf(this._currentAccount))>-1)incompatList.push(inputElt.dataSet[entry].label)})
if(incompatList.length){const list=incompatList.join(", ")
return`Groupe(s) incompatible(s) avec le groupe courant : \'${list}\'`}else return true}:undefined}))
let addGroupBtn
const includeIsHiddenGroups=this.includeIsHiddenGroups
Object.assign(inputBox,{fillJson(parent,root){parent[name]=inputElt.value},extractJson:function(parent){UserGroupsInputArea.fetchGroupsList(ctx,includeIsHiddenGroups).then(val=>{inputElt.dataSet=val})
inputElt._currentAccount=parent.account
inputElt.value=parent[name]
if(addGroupBtn)addGroupBtn.disabled=parent.isReadOnly
return true}})
inputElt.addEventListener("change",evt=>{inputElt.form.querySelectorAll("c-input-roles-selector").forEach(async elt=>{let inheritedRoles=await ctx.usersSrv.resolveRoles(inputElt.value)
await elt.setInheritedRoles(inheritedRoles)})
inputElt.reportValidity()})
const defaultValue=this.getDefaultValue(ctx)
if(defaultValue!=null)inputElt.value=defaultValue
await this._initStdControl(inputElt,ctx)
let wrp=new ActionWrapper
wrp.setOverridenSvc(CreateUserAction.SINGLETON_group).setExecute(async(ctx,ev)=>{let newGroup=await wrp.getWrapped(ctx).execute(ctx,ev)
if(newGroup){inputElt.dataSet=await UserGroupsInputArea.fetchGroupsList(ctx,this.includeIsHiddenGroups)}})
if(this.isAvailable(ctx))addGroupBtn=inputBox.appendChild(ActionBtn.buildButton(wrp,ctx,"bar"))
return inputBox}static async fetchGroupsList(ctx,includeIsHidden){var _a
const groupsSet=await ctx.usersSrv.list(null,EUserType.group,includeIsHidden,null,100,null,null,["flattenedGroups"])
const groupsList=(_a=groupsSet.userList)===null||_a===void 0?void 0:_a.sort((groupA,groupB)=>USER.getPrimaryName(groupA).localeCompare(USER.getPrimaryName(groupB)))
let dataset={}
if((groupsList===null||groupsList===void 0?void 0:groupsList.length)>0){groupsList.forEach(pGroup=>{var _a
if(pGroup&&(!ctx.users||!ctx.users.find(user=>(user===null||user===void 0?void 0:user.account)===pGroup.account))){const grps=(_a=pGroup.flattenedGroups)===null||_a===void 0?void 0:_a.filter(entry=>entry!=pGroup.account).map(entry=>{const userObj=groupsList.find(user=>user.account==entry)
return userObj?USER.getPrimaryName(userObj):entry})
dataset[pGroup.account]={label:USER.getPrimaryName(pGroup),icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/group.svg",iconFilter:pGroup.isHidden?"opacity(50%)":undefined,description:(grps===null||grps===void 0?void 0:grps.length)?`groupes liés : ${grps}`:undefined,flattenedGroups:pGroup.flattenedGroups}}})}return dataset}redrawLine(row,line){DOM.setAttrBool(line,"data-user-hidden",row.rowDatas.isHidden)}}REG.reg.registerSvc("area.users.groupsmembers.users",1,new UserGroupsInputArea("groups",false,false))
REG.reg.registerSvc("area.users.groupsmembers.groups",1,new UserGroupsInputArea("groups",null,true))
REG.reg.registerSvc("area.users.groupsmembers.users.create",1,new UserGroupsInputArea("groups",false,false,true))
REG.reg.registerSvc("area.users.groupsmembers.groups.create",1,new UserGroupsInputArea("groups",null,true,true))
REG.reg.registerSkin("area-users-groups-tabs",1,`\n\t.cell > .icon {\n\t\tpadding-inline-start: 1.2em !important;\n\t\tmargin-inline-end: 0.3em !important;\n\t}\n\n\tdiv[data-user-hidden] {\n\t\tfont-style: italic;\n\t}\n`)
export class UserGroupsMultiInputArea extends ControlAsyncArea{constructor(id="groups",includeIsHidden=true){super(id)
this.includeIsHidden=includeIsHidden
this.setLabel("Groupes")
this.setVisible(ctx=>{if(!ctx.usersSrv||!ctx.usersSrv.hasAspect(EUserAspects.groupable))return false
return userAreaIsVisible.call(this,ctx)})
this.setEnabled(userAreaIsEnabled)}async _loadControl(ctx,name){let inputBox=JSX.createElement("div",{class:"ctrlLbl"})
const inputElt=inputBox.appendChild((new InputOrderedSetPanel).initialize({dataSet:await UserGroupsInputArea.fetchGroupsList(ctx,this.includeIsHidden),selectionLabel:"Groupes sélectionnés",availableLabel:"Groupes disponibles",emptySelectionMsg:"Aucun",availableGridInit:{skinOver:"area-users-groups-tabs",lineDrawer:this},selectionGridInit:{skinOver:"area-users-groups-tabs",lineDrawer:this},name:name}))
const defaultValue=this.getDefaultValue(ctx)
if(defaultValue!=null)inputElt.value=defaultValue
inputElt.indeterminate=true
inputElt.addEventListener("change",(function(evt){this.indeterminate=false}))
inputElt.addEventListener("keydown",(async function(ev){if(!this.disabled&&(ev.key==="Delete"||ev.key==="Backspace")&&this===DOMSH.findDocumentOrShadowRoot(this).activeElement){this.indeterminate=true
this.value=null
ev.stopPropagation()
this.form.dispatchEvent(new CustomEvent("change",{bubbles:true,cancelable:false}))
return true}return false}))
return inputBox}redrawLine(row,line){DOM.setAttrBool(line,"data-user-hidden",row.rowDatas.isHidden)}}REG.reg.registerSvc("area.users.groupsmembers.multi.users",1,new UserGroupsMultiInputArea("groups",false))
export class UserRolesInputArea extends LabelArea{constructor(id,fixedCtx){super(id||"rolesSet")
this.fixedCtx=fixedCtx
if(!this.fixedCtx)this.fixedCtx={name:this.getId()}
this.setLabel("Rôles")
this.setVisible(userAreaIsVisible)
this.setEnabled(userAreaIsEnabled)}isVisible(ctx){if(!ctx.usersSrv||!ctx.usersSrv.hasAspect(EUserAspects.rolable))return false
return super.isVisible(ctx)}_buildControl(ctx,name){const elt=JSX.createElement(RolesSelectorInput,{"î":Object.assign(Object.assign({},ctx),this.fixedCtx)})
this._initStdControl(elt,ctx)
return elt}}REG.reg.registerSvc("area.users.grantedRoles.users",1,new UserRolesInputArea(null,{uiLayerSgn:"users"}))
REG.reg.registerSvc("area.users.grantedRoles.groups",1,new UserRolesInputArea(null,{uiLayerSgn:"groups"}))
REG.reg.registerSvc("area.users.grantedRoles.multi.users",1,new UserRolesInputArea(null,{uiLayerSgn:"users",canBeIndeterminate:true}))
REG.reg.registerSvc("area.users.grantedRoles.multi.groups",1,new UserRolesInputArea(null,{uiLayerSgn:"groups",canBeIndeterminate:true}))
export class UserNicknamesFirstInputArea extends StringInputArea{constructor(id="nickNames"){super(id)
this.setLabel("Pseudo")
this.setInputCustomValidity((async function(ctx){if(this.value){if(ctx.usersSrv&&ctx.usersSrv.getUser){if(ctx.users&&ctx.users.length===1&&ctx.users[0].nickNames&&ctx.users[0].nickNames.indexOf(this.value)>-1)return""
let checkedUser=await ctx.usersSrv.getUser(this.value)
if(checkedUser){let code=this.value
return`L\'identifiant d\'utilisateur \'${code}\' a déjà été utilisé.`}}}return""}),500,true)
this.setVisible(userAreaIsVisible)
this.setEnabled(userAreaIsEnabled)}isVisible(ctx){if(!ctx.userSelfSrv.hasAspect(EUserAspects.oneNickName))return false
return super.isVisible(ctx)}_buildControl(ctx,name){const control=super._buildControl(ctx,name)
DOM.setAttr(control,"spellcheck","false")
DOM.setAttr(control,"autocomplete","current-password")
Object.assign(control,{fillJson:function(parent,root){if(!this.disabled)parent[this.name]=this.value?[this.value]:[]},extractJson:function(parent){const array=parent[this.name]
if(array&&array.length){this.value=array[0]
return true}else this.value=null
return false}})
return control}}REG.reg.registerSvc("area.users.nickNames.first",1,new UserNicknamesFirstInputArea)
export class UserEmailInputArea extends StringInputArea{constructor(id="email"){super(id,"email")
this.setLabel("E-mail")
this.setPattern("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9.-]+$")
this.setVisible(userAreaIsVisible)
this.setEnabled(userAreaIsEnabled)}_buildControl(ctx,name){const control=super._buildControl(ctx,name)
DOM.setAttr(control,"autocomplete","current-password")
return control}}REG.reg.registerSvc("area.users.email.user",1,new UserEmailInputArea)
REG.reg.registerSvc("area.users.email.group",1,new UserEmailInputArea)
export class UserGroupNameInputArea extends StringInputArea{constructor(id="groupName"){super(id)
this.setLabel("Intitulé")
this.setVisible(userAreaIsVisible)
this.setEnabled(userAreaIsEnabled)}_buildControl(ctx,name){let input=super._buildControl(ctx,name)
DOM.setAttr(input,"spellcheck","false")
DOM.setAttr(input,"autocomplete","current-password")
return input}}REG.reg.registerSvc("area.users.groupName",1,new UserGroupNameInputArea)
class UsersBoolPropsInputArea extends InputChoiceArea{constructor(id){super(id)
this.setDefaultValue("false")
this.setVisible(userAreaIsVisible)
this.setEnabled(userAreaIsEnabled)}isEnabled(ctx){return super.isEnabled(ctx)}buildBody(ctx){let elt=super.buildBody(ctx)
if(this.getDescription(ctx))elt.title=this.getDescription(ctx)
return elt}_buildControl(ctx,name){const control=super._buildControl(ctx,name)
Object.assign(control,{fillJson:function(parent,root){let input=this.querySelector("input:checked")
if(input)parent[name]=input.value==="true"},extractJson:function(parent){if(parent[name])this.querySelector("input[value='true']").checked=true
else this.querySelector("input[value='false']").checked=true
return true}})
return control}}REG.reg.registerSvc("area.users.isHidden.groups",1,new UsersBoolPropsInputArea("isHidden").setLabel("Visibilité").requireVisiblePerm("ui.usersMgr.admin.hiddenGroup").setDataset({false:{label:"globale"},true:{label:"gestion",description:"Groupe intermédiaire n\'ayant pas vocation à être exploité en dehors de l\'écran de gestion des groupes"}}))
REG.reg.registerSvc("area.users.isHidden.users",1,new UsersBoolPropsInputArea("isHidden").setLabel("Compte de service").requireVisiblePerm("ui.usersMgr.admin.hiddenUser").setDescription("Compte de service : compte masqué en dehors de l\'écran de gestion des utilisateurs").setDataset({false:{label:"non"},true:{label:"oui"}}))
REG.reg.registerSvc("area.users.isDisabled.users",1,new UsersBoolPropsInputArea("isDisabled").setLabel("Compte actif").setDataset({false:{label:"actif"},true:{label:"inactif"}}).setEnabled((function(ctx){var _a
if(userAreaIsEnabled.call(this,ctx)===false)return false
return((_a=ctx.users)===null||_a===void 0?void 0:_a.find(user=>(user===null||user===void 0?void 0:user.account)===ctx.reg.env.universe.auth.currentUser.account))?false:true})))
REG.reg.registerSvc("area.users.enabledEndDt",1,new DateInputArea("enabledEndDt").setLabel("Inactif à partir du").setEnabled((function(ctx){var _a
if(userAreaIsEnabled.call(this,ctx)===false)return false
return((_a=ctx.users)===null||_a===void 0?void 0:_a.find(user=>(user===null||user===void 0?void 0:user.account)===ctx.reg.env.universe.auth.currentUser.account))?false:true})))
export class PasswordInputArea extends StringInputArea{constructor(id,showLabelMode){super(id,"password")
this.showLabelMode=showLabelMode
this.setLabel("Mot de passe")
this.setVisible(userAreaIsVisible)
this.setEnabled(userAreaIsEnabled)}buildBody(ctx){const ctn=JSX.createElement("div",null)
if(!this.isVisible(ctx))ctn.setAttribute("hidden","")
const pwdInput=this._buildControl(ctx,this.getId())
DOM.setAttr(pwdInput,"autocomplete","current-password")
if(this.showLabelMode==="placeholder")pwdInput.placeholder=this.getLabel(ctx)
ctn.appendChild(this.showLabelMode!=="placeholder"&&ctx.buildControlLabel?this._buildControlLabel(pwdInput,ctx):JSX.createElement("div",{class:"ctrlLbl"},pwdInput))
this._initStdControl(pwdInput,ctx)
let pwdValidRequest=0
if(this.isAvailable(ctx)){pwdInput.addEventListener("input",()=>{if(pwdValidRequest){clearTimeout(pwdValidRequest)
pwdValidRequest=0}pwdValidRequest=setTimeout(async()=>{await this._checkPwd(pwdInput)},500)})
const confirmInput=this._buildControl(ctx,"confirmPwd")
DOM.setAttr(confirmInput,"autocomplete","current-password")
this._initStdControl(confirmInput,ctx)
if(this.showLabelMode==="placeholder")confirmInput.placeholder="Confirmation"
ctn.appendChild(this.showLabelMode!=="placeholder"&&ctx.buildControlLabel?this._buildControlLabel(confirmInput,ctx,"Confirmation"):JSX.createElement("div",{class:"ctrlLbl"},confirmInput))
Object.assign(confirmInput,{extractJson:function(parent){},fillJson:function(parent,root){}})
let confirmValidRequest=0
confirmInput.addEventListener("input",()=>{if(confirmValidRequest){clearTimeout(confirmValidRequest)
confirmValidRequest=0}confirmValidRequest=setTimeout(()=>{if(confirmInput.value&&confirmInput.value!=pwdInput.value)confirmInput.setCustomValidity("Les mots de passe ne correspondent pas.")
else confirmInput.setCustomValidity("")},300)})
pwdInput.addEventListener("input",()=>{confirmInput.dispatchEvent(new CustomEvent("input",{bubbles:true,cancelable:false}))})}return ctn}async _checkPwd(input){input.setCustomValidity("")
if(input.value&&input.checkValidity()){const reg=REG.findReg(input)
const resp=await reg.env.universe.userSelf.checkPwd({password:input.value})
if(resp.result==="ok"){input.setCustomValidity("")}else if(resp.result=="failedInvalidDatas"&&resp.secondaryResults&&resp.secondaryResults.msgs){input.setCustomValidity(resp.secondaryResults.msgs[0])}else{ERROR.reportError({msg:"Une erreur est survenue lors de la vérification du mot de passe.",ctx:{reg:reg},adminDetails:JSON.stringify(resp)})}}}}export function userAreaIsVisible(ctx){let hook=ctx.reg.getSvc("user.area.visible.hook")
if(hook)return hook.call(this,ctx)
return null}export function userAreaIsEnabled(ctx){let hook=ctx.reg.getSvc("user.area.enabled.hook")
if(hook)return hook.call(this,ctx)
return null}
//# sourceMappingURL=userAreas.js.map