import{MsgOver}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{CellBuilderAccounts,UsersGrid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/usersGrid.js"
import{EUserAspects,EUserType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{AccelKeyMgr,Action,ACTION,ActionWrapper}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{CreateUserAction,DeleteUsersAction,DisableUsersAction,UsersAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/actions/usersActions.js"
import{CellBuilderDate,CellBuilderIconLabel,CellBuilderString}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{BaseAreaViewAsync,VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{AREAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{FORMS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/dialogs_Perms.js"
import{USERSELF}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/userSelf.js"
import{ROLES}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/roles.js"
class UsersMgrBase extends BaseAreaViewAsync{constructor(){super(...arguments)
this.msgs={}
this.users=null
this.buildControlLabel=true
this.forcedUserDataOnSave={}
this._formUpdateEmptyData={}
this._dirtyStatus=false
this._dirtyMdgOver=JSX.createElement("c-msg-over",{class:"disableMsgOver"})}async _initialize(init){if(!this.reg)this.reg=REG.createSubReg(this.findReg(init))
this.usersSrv=this.reg.env.universe.adminUsers
this.userSelfSrv=this.reg.env.universe.userSelf
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("webzone:panel",sr)
this.reg.installSkin("form-control-areas",sr)
this.reg.installSkin("usersmgr-core",sr)
this._initAndInstallSkin(this.localName,init)
if(init.msgs)this.msgs=init.msgs
this.reg.addToList("actions:usersmgr:show:toolbar:top","actionRefreshUi",1,actionRefreshUi)
let accelKeyMgr=(new AccelKeyMgr).initFromMapActions(this.reg.mergeListsAsMap("accelkeys:usersmgr","accelkeys:usersmgr:"+this.id))
accelKeyMgr.initFromMapActions(this.reg.mergeListsAsMap("accelkeys:usersmgr","accelkeys:usersmgr:"+this.id))
let usersGridInit=Object.assign({reg:this.reg,usersSrv:this.usersSrv,displayRazFilterBtn:true,filterGroupsInputVisibility:true,filterRolesInputVisibility:true,disableAutoSearchOnInit:true,filterTxt:init.preSelectAccount,forceSelectEntry:init.preSelectAccount?true:false,grid:Object.assign(init.usersGrid.grid,{selType:"multi",hideHeaders:false,columnDefs:this.reg.mergeLists("columns:usersmgr","columns:usersmgr:"+this.id),skinOver:"usersmgr-core-tree",skinScroll:"scroll/small",lineDrawer:this,autoSelOnFocus:null})},init.usersGrid)
this._listBoxElt=sr.appendChild(JSX.createElement("div",{id:"list","c-resizable":true}))
sr.appendChild(JSX.createElement("c-resizer",null))
this._detailsBoxElt=sr.appendChild(JSX.createElement("div",{id:"details","c-resizable":true,hidden:true}))
this.usersGridElt=this._listBoxElt.appendChild((new UsersGrid).initialize(usersGridInit))
await this.usersGridElt.initializedAsync
this.usersGridElt.grid.ctxMenuActions={actions:ACTION.injectSepByGroup(this.reg.mergeLists("actions:usersmgr","actions:usersmgr:ctxtmenu","actions:usersmgr:ctxtmenu:"+this.id,"actions:usersmgr:"+this.id),this.reg.getPref("actions.usersmgr.groupOrder","refresh users *"),this),actionContext:this}
this.usersGridElt.grid.addEventListener("keydown",async ev=>accelKeyMgr.handleKeyboardEvent(ev,this))
this.usersGridElt.grid.addEventListener("grid-select",async ev=>{let users=this.usersGridElt?this.usersGridElt.getSelectedUsers():null
this.users=users
this._showToolbarTop.refreshContent()
this._showToolbarBottom.refreshContent()
await this.showDetailsUser(users)})
let toolbarsBox=this._listBoxElt.appendChild(JSX.createElement("div",{id:"toolbarsBox"}))
this._showToolbarTop=toolbarsBox.appendChild((new BarActions).initialize({reg:this.reg,actions:ACTION.injectSepByGroup(this.reg.mergeLists("actions:usersmgr","actions:usersmgr:show:toolbar:top","actions:usersmgr:show:toolbar:top:"+this.id,"actions:usersmgr:"+this.id),this.reg.getPref("actions.usersmgr.groupOrder","refresh users *"),this),uiContext:"bar",actionContext:this,disableFullOverlay:true}))
this._showToolbarTop.setAttribute("class","showToolbarTop")
this._showToolbarBottom=toolbarsBox.appendChild((new BarActions).initialize({reg:this.reg,actions:ACTION.injectSepByGroup(this.reg.mergeLists("actions:usersmgr:show:toolbar:bottom","actions:usersmgr:show:toolbar:bottom:"+this.id),this.reg.getPref("actions.usersmgr.groupOrder","refresh users *"),this),uiContext:"bar",actionContext:this,disableFullOverlay:true}))
this._showToolbarBottom.setAttribute("class","showToolbarBottom")
this._editUserToolbar=this._detailsBoxElt.appendChild((new BarActions).initialize({reg:this.reg,actions:ACTION.injectSepByGroup(this.reg.mergeLists("actions:usersmgr:edit:toolbar","actions:usersmgr:edit:toolbar:"+this.id),this.reg.getPref("actions.usersmgr.groupOrder","edit remove *"),this),uiContext:"bar",actionContext:this,disableFullOverlay:true}))
this._editUserToolbar.setAttribute("class","detailToolbar")
this.formUpdateElt=this._detailsBoxElt.appendChild(JSX.createElement("form",{id:"form",autocomplete:"off"}))
let onFormUpdateRequest=0
this.formUpdateElt.addEventListener("input",()=>{if(onFormUpdateRequest){clearTimeout(onFormUpdateRequest)
onFormUpdateRequest=0}onFormUpdateRequest=setTimeout(async()=>{await this.computeDirtyStatus()
onFormUpdateRequest=0},300)})
this.formUpdateElt.addEventListener("keydown",async ev=>{if(ev.key==="s"&&ACTION.isAccelPressed(ev)){ev.preventDefault()
ev.stopImmediatePropagation()
UserFormSaveAction.SINGLETON_user.executeIfAvailable(this,ev)
return true}return false})
this.addEventListener("keydown",async ev=>{if(ev.key==="Enter"&&ACTION.isAccelPressed(ev)){ev.preventDefault()
ev.stopImmediatePropagation()
if(init.uiContext==="popup"&&await VIEWS.canHideView(this)){POPUP.findPopupableParent(this).close(false)}return true}return false})
await this.refresh()}async _refresh(){this.refreshFreeze(1)
try{super._refresh()
await this.usersGridElt.doSearchUsers(undefined)}finally{this.refreshFreeze(-1)}}async showDetailsUser(user,force){if(user===null||user.length==0){DOM.setHidden(this._detailsBoxElt,true)
this._detailUserCurrentData=undefined
this.dirtyStatus=false
this.formUpdateElt.querySelectorAll("fieldset").forEach(fieldsetElt=>{fieldsetElt.disabled=false})
this._editUserToolbar.refreshContent()
return false}else if(user.length==1){DOM.setHidden(this._detailsBoxElt,false)
await this.initFormUi("single")
FORMS.jsonToForm(user[0],this.formUpdateElt,false,true)
this._detailUserCurrentData=FORMS.formToJson(this.formUpdateElt)
this.formUpdateElt.checkValidity()
this.formUpdateElt.querySelectorAll("fieldset").forEach(fieldsetElt=>{fieldsetElt.disabled=this.isReadOnlyForm(user)})
this.dirtyStatus=false
this._editUserToolbar.refreshContent()
return true}else{DOM.setHidden(this._detailsBoxElt,false)
await this.initFormUi("multi")
FORMS.jsonToForm([],this.formUpdateElt,false,true)
this._detailUserCurrentData=FORMS.formToJson(this.formUpdateElt)
this.formUpdateElt.checkValidity()
this.formUpdateElt.querySelectorAll("fieldset").forEach(fieldsetElt=>{fieldsetElt.disabled=this.isReadOnlyForm(user)})
this.dirtyStatus=false
this._editUserToolbar.refreshContent()
return true}}async onUserChange(user){if(user===null){await this.showDetailsUser(null)}else{let datas=this.usersGridElt.dataHolder.getDatas()
let userEntry=datas.find(entry=>entry.account===user.account)
if(userEntry)this.usersGridElt.dataHolder.replaceRowKey(userEntry,user,false)
if(this.users.length===1&&this.users[0].account===user.account){this.users=[user]
await this.showDetailsUser(this.users)}}}isReadOnlyForm(user){if(!this.usersSrv.hasAspect(EUserAspects.updatable))return true
if(Array.isArray(user)){if(user.find(user=>user.isReadOnly))return true}else if(user!==null){return user.isReadOnly}}async initFormUi(uiContext="single"){this.initFormELt()
let listCodes=uiContext=="single"?["userProps:update:single","userProps:update:single:"+this.id]:["userProps:update:multi","userProps:update:multi:"+this.id]
await AREAS.applyLayout(this.formUpdateElt,await Promise.all(this.reg.mergeLists(...listCodes)),this,true)
this._formUpdateEmptyData=FORMS.formToJson(this.formUpdateElt)}initFormELt(force){if(!this.formUpdateElt.hasChildNodes()||force){this.formUpdateElt.innerHTML=""
this.formUpdateElt.appendChild(JSX.createElement("fieldset",{id:"fieldset"},JSX.createElement("div",{id:"common"},JSX.createElement("div",{class:"fields","area-ids":"account isDisabled enabledEndDt isHidden groups"}),JSX.createElement("div",{class:"fields","area-ids":"nickNames firstName lastName groupName email"})),JSX.createElement("div",{class:"fields","area-ids":"*"})))}}get dirtyStatus(){return this._dirtyStatus}set dirtyStatus(val){if(this._dirtyStatus!=val){this._dirtyStatus=val
this._editUserToolbar.refreshContent()
if(this.dirtyStatus==true){this._dirtyMdgOver.showMsgOver(this._listBoxElt)}else{this._dirtyMdgOver.removeMsg()}}}async computeDirtyStatus(){if(this._detailsBoxElt.hasAttribute("hidden"))return false
const userData=FORMS.formToJson(this.formUpdateElt)
this.dirtyStatus=JSON.stringify(userData)!==JSON.stringify(this._detailUserCurrentData)
return this.dirtyStatus}redrawLine(row,line){}onViewBeforeHide(close){return false}async onViewWaitForHide(close){return!await this.computeDirtyStatus()||await POPUP.confirm(`Des propriétés n\'ont pas été enregistrées. Voulez-vous abandonner ces modifications et quitter ?`,this.reg.env.uiRoot,{okLbl:"Abandonner les modifications et quitter",cancelLbl:"Reprendre l\'édition"})}}REG.reg.registerSkin("usersmgr-core",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tflex-direction: column;\n\t\toverflow: hidden;\n\t}\n\n\t#list {\n\t\tdisplay: flex;\n\t\tflex: 1;\n\t\toverflow: auto;\n\t\tmin-height: 30%;\n\t}\n\n\tserver-users-grid, c-input-ordered-set-panel {\n\t\tflex: 1;\n\t}\n\n\t#toolbarsBox {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t}\n\n\tc-bar-actions.showToolbarTop {\n\t\tflex: 1;\n\t}\n\n\tc-bar-actions.showToolbarTop,\n\tc-bar-actions.showToolbarBottom {\n\t\tflex-direction: column;\n\t\tborder-inline-start: 1px solid var(--border-color);\n\t}\n\n\n\tc-bar-actions.detailToolbar {\n\t\tflex-direction: row;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\tc-bar-actions.detailToolbar[hidden] {\n\t\tdisplay: none;\n\t}\n\n\tc-resizer {\n\t\tpointer-events: auto;\n\t\tcursor: ns-resize;\n\t\theight: 2px;\n\t}\n\n\t.disableMsgOver {\n\t\tbackground-color: rgba(0, 0, 0, .2);\n\t}\n\n\t/* Form */\n\t#details {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\toverflow: auto;\n\t\theight: 60%;\n\t}\n\n\t#details[hidden] {\n\t\tdisplay: none;\n\t}\n\n\tform {\n\t\tflex-direction: column;\n\t\tpadding: 1em;\n\t\toverflow: auto;\n\t}\n\n\tfieldset {\n\t\tborder: none;\n\t\tpadding: 0;\n\t\tmargin: 0;\n\t\tmin-width: 0;\n\t}\n\n\t.lbl {\n\t\tmin-width: 4em;\n\t}\n\n\t#common {\n\t\tdisplay: flex;\n\t\tflex: 1;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-wrap: wrap;\n\t}\n\n\t#common > .fields {\n\t\tflex: 1;\n\t\tdisplay: grid;\n\t\tmin-width: 10em;\n\t\tgrid-template-columns: auto 1fr;\n\t\tgrid-row-gap: .7rem;\n\t\tgrid-auto-rows: max-content;\n\t}\n\n\t#common > .fields > div {\n\t\tdisplay: contents;\n\t}\n\n\t#common > .fields:first-child {\n\t\tmargin-inline-end: 2em;\n\t}\n\n\t.fields div[hidden] {\n\t\tdisplay: none !important;\n\t}\n\n\tdiv[area-id="passwordSetMode"] > .subPanel {\n\t\tborder: 0;\n\t\tmax-width: fit-content;\n\t}\n\n\t.ctrlLbl > .ctrlLbl {\n\t\tmargin: 0;\n\t}\n\n\tselect {\n\t\tmax-width: fit-content;\n\t}\n\n`)
REG.reg.registerSkin("usersmgr-core-tree",1,`\n\tdiv[data-user-special] {\n\t\t/*opacity: 60%;*/\n\t\tfont-style: italic;\n\t}\n\n  div[data-user-hidden] {\n\t  /*font-style: italic;*/\n  }\n\n  div[data-user-current] > div.accountCell {\n\t  font-weight: bold;\n  }\n\n  /** Mise en forme de CellBuilderUserRoles */\n\n  c-userref + c-userref::before {\n\t  content: ", ";\n  }\n\n  .role-unknown {\n\t  text-decoration: line-through;\n  }\n\n  .role-inherited {\n\t  font-style: italic;\n  }\n\n  .icon {\n\t  background-size: auto .9rem;\n\t}\n\n\t.accountCell {\n\t\tdisplay: flex;\n\t}\n\n\t.accountLabel {\n\t\tflex: 1;\n\t\ttext-overflow: ellipsis;\n\t\toverflow: hidden;\n\t}\n\n\t.statusIcon {\n\t\tbackground-repeat: no-repeat;\n\t\tbackground-position: center;\n\t\tbackground-size: auto .7rem;\n\t\tpadding-inline-start: 1rem;\n\t}\n\n\t.disabled {\n\t\tbackground-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/user/disabled.svg);\n\t}\n\n\t.locked {\n\t\tbackground-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/user/locked.svg);\n\t}\n\n\t.system {\n\t\tbackground-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/user/system.svg);\n\t}\n\n`)
export class UsersMgr extends UsersMgrBase{async _initialize(init){if(!this.reg)this.reg=REG.createSubReg(this.findReg(init))
this.usersSrv=this.reg.env.universe.adminUsers
this.userSelfSrv=this.reg.env.universe.userSelf
this.id="users"
this.uiContextSgn="@user#edit"
this.forcedUserDataOnSave.userType=EUserType.user
let mgrInit=Object.assign({usersGrid:{firstMaxEntries:500,fullMaxEntries:5e3,filterType:EUserType.user,filterHiddenInputVisibility:true,filterHiddenInputPerms:"ui.usersMgr.admin.hiddenUser",filterHidden:false,filterHiddenBtnInit:{title:"Afficher/masquer les comptes de service"},grid:{emptyBody:()=>JSX.createElement("span",null,this.msgs.noUsers||"Aucun utilisateur")}}},init)
this.reg.addToList("actions:usersmgr:show:toolbar:top:users","actionCreateUser",1,new ActionWrapperRefresUsersMgr(this).setOverridenSvc(CreateUserAction.SINGLETON_user))
this.reg.addToList("actions:usersmgr:ctxtmenu:users","actionDeleteUser",1,new ActionWrapperRefresUsersMgr(this).setOverridenSvc(DeleteUsersAction.SINGLETON_user))
this.reg.addToList("actions:usersmgr:ctxtmenu:users","actionEnableUser",1,new ActionWrapperRefresUsersMgr(this).setOverridenSvc(DisableUsersAction.SINGLETON_user_enable))
this.reg.addToList("actions:usersmgr:ctxtmenu:users","actionDisableUser",1,new ActionWrapperRefresUsersMgr(this).setOverridenSvc(DisableUsersAction.SINGLETON_user_disable))
this.reg.addToList("columns:usersmgr:users","account",1,new GridColDef("account").setLabel("Compte").setFlex("4rem",1,1).setCellBuilder(new CellBuilderIconLabel("account").setIconWidth("1rem").override("_getIcon",row=>"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/user.svg").override("getIconFilter",row=>{const isHidden=row.cacheHolder["isHidden"]
return isHidden?"grayscale(100%)":""}).override("redrawCell",(function(row,root){const icon=this._getIcon(row)
const label=this._getValue(row)
DOM.addClass(root,"accountCell")
root.innerText=""
const span=this._buildContent(row,root)
if(icon){span.style.unicodeBidi="isolate"
span.style.backgroundImage=icon.startsWith("--")?`var(${icon})`:`url("${icon}")`
span.style.filter=this.getIconFilter(row)}else{span.style.backgroundImage="none"}if(label)root.appendChild(JSX.createElement("span",{class:"accountLabel"},label))
DOM.setAttr(root,"title",this._getDescription(row)||undefined)
if(row.rowDatas.isReadOnly)root.appendChild(JSX.createElement("span",{class:"statusIcon locked",title:"Compte en lecture seule"}))
if(row.rowDatas.isDisabled)root.appendChild(JSX.createElement("span",{class:"statusIcon disabled",title:"Compte désactivé"}))
if(row.rowDatas.isHidden)root.appendChild(JSX.createElement("span",{class:"statusIcon system",title:"Compte de service"}))}))))
if(this.usersSrv.hasAspect(EUserAspects.oneNickName)){this.reg.addToList("columns:usersmgr:users","nickNames",1,new GridColDef("nickNames").setLabel("Pseudo").setFlex("2rem",1,1).setCellBuilder(new CellBuilderString("nickNames")))}this.reg.addToList("columns:usersmgr:users","firstName",1,new GridColDef("firstName").setLabel("Prénom").setFlex("2rem",1,1).setCellBuilder(new CellBuilderString("firstName")))
this.reg.addToList("columns:usersmgr:users","lastName",1,new GridColDef("lastName").setLabel("Nom").setFlex("2rem",1,1).setCellBuilder(new CellBuilderString("lastName")))
if(this.usersSrv.hasAspect(EUserAspects.rolable)){this.reg.addToList("columns:usersmgr:users","roles",1,new GridColDef("roles").setLabel("Rôles").setDescription(this.msgs.colRoles||"Rôles résolus de l\'utilisateur dans ce contexte").setFlex("5rem",1,1).setCellBuilder(new CellBuilderUserRoles(this.reg,"roles")))}if(this.usersSrv.hasAspect(EUserAspects.groupable)){this.reg.addToList("columns:usersmgr:users","groups",1,new GridColDef("groups").setLabel("Groupes").setDescription(this.msgs.colGroups||"Groupes affectés à cet utilisateur").setFlex("5rem",1,1).setCellBuilder(new CellBuilderAccounts(this.reg,"groups",true,false)))}this.reg.addToList("columns:usersmgr:users","pwdDt",1,new GridColDef("pwdDt").setLabel("Chgt Mdp").setFlex("2rem",1,1).setDescription("Date du dernier changement de mot de passe").setCellBuilder(new CellBuilderDate("pwdDt").setCellClass("center")))
this.reg.addToList("actions:usersmgr:edit:toolbar:users","userFormSave",1,UserFormSaveAction.SINGLETON_user)
this.reg.addToList("actions:usersmgr:edit:toolbar:users","userFormRevert",1,UserFormRevertAction.SINGLETON_user)
this.reg.addToList("actions:usersmgr:show:toolbar:top:users","actionDeleteUser",1,new ActionWrapperRefresUsersMgr(this).setOverridenSvc(DeleteUsersAction.SINGLETON_user))
this.reg.addSvcToList("userProps:update:single:users","account",1,"area.users.props")
this.reg.addSvcToList("userProps:update:single:users","isDisabled",1,"area.users.isDisabled.users")
if(this.usersSrv.hasAspect(EUserAspects.enabledEndDt))this.reg.addSvcToList("userProps:update:single:users","enabledEndDt",1,"area.users.enabledEndDt")
this.reg.addSvcToList("userProps:update:single:users","nickNames.first",1,"area.users.nickNames.first")
this.reg.addSvcToList("userProps:update:single:users","isHidden",1,"area.users.isHidden.users")
this.reg.addSvcToList("userProps:update:single:users","firstName",1,"area.users.firstName")
this.reg.addSvcToList("userProps:update:single:users","lastName",1,"area.users.lastName")
this.reg.addSvcToList("userProps:update:single:users","groups",1,"area.users.groupsmembers.users")
this.reg.addSvcToList("userProps:update:single:users","grantedRoles",1,"area.users.grantedRoles.users")
this.reg.addSvcToList("userProps:update:single:users","email",1,"area.users.email.user")
this.reg.addSvcToList("userProps:update:multi:users","groups",1,"area.users.groupsmembers.multi.users")
this.reg.addSvcToList("userProps:update:multi:users","grantedRoles",1,"area.users.grantedRoles.multi.users")
await super._initialize(mgrInit)
this._dirtyMdgOver.addEventListener("dblclick",ev=>{UserFormRevertAction.SINGLETON_user.executeIfAvailable(this,ev)})
this.formUpdateElt.addEventListener("keydown",ev=>{if(ev.key==="Escape"&&this.dirtyStatus){UserFormRevertAction.SINGLETON_user.executeIfAvailable(this,ev)
ev.stopPropagation()}})}redrawLine(row,line){const reg=REG.findReg(line)
super.redrawLine(row,line)
const isCurrentUSer=row.rowDatas.account===reg.env.universe.auth.currentUser.account
let propsStr=[]
if(isCurrentUSer)propsStr.push("actuellement connecté")
if(row.rowDatas.isDisabled)propsStr.push("désactivé")
if(row.rowDatas.isHidden)propsStr.push("de service")
if(row.rowDatas.isReadOnly)propsStr.push("en lecture seule")
if(propsStr.length>0){let countProps=propsStr.join(", ")
line.title=`Compte ${countProps}`
DOM.setAttrBool(line,"data-user-special",true)}else{delete line.title
line.removeAttribute("data-user-special")}DOM.setAttrBool(line,"data-user-current",isCurrentUSer)}isReadOnlyForm(user){if(!this.reg.hasPerm("action.users#update.user"))return true
return super.isReadOnlyForm(user)}}customElements.define("usersmgr-users",UsersMgr)
REG.reg.registerSkin("usersmgr-users",1,`\n\t.ctrlLbl[area-id=isHidden] > .lbl::before,\n\t.ctrlLbl[area-id=isDisabled] > .lbl::before {\n\t\tcontent: "";\n\t\tpadding-inline-start: 1.2rem;\n\t\tbackground-repeat: no-repeat;\n\t\tbackground-position: left;\n\t\tbackground-size: auto .9rem;\n\t\tfilter: grayscale(100%) opacity(.8);\n\t}\n\n\t.ctrlLbl[area-id=enabledEndDt] > .lbl {\n\t  text-align: end;\n  }\n\n  .ctrlLbl[area-id=isHidden] > .lbl::before {\n\t  background-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/user/system.svg);\n  }\n\n  .ctrlLbl[area-id=isDisabled] > .lbl::before {\n\t  background-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/user/disabled.svg);\n  }\n\n`)
export class GroupsMgr extends UsersMgrBase{async _initialize(init){if(!this.reg)this.reg=REG.createSubReg(this.findReg(init))
this.usersSrv=this.reg.env.universe.adminUsers
this.userSelfSrv=this.reg.env.universe.userSelf
this.forcedUserDataOnSave.userType=EUserType.group
this.id="groups"
this.uiContextSgn="@group#edit"
let mgrInit=Object.assign({usersGrid:{firstMaxEntries:500,fullMaxEntries:5e3,filterType:EUserType.group,filterGroupsInputVisibility:false,filterHiddenInputVisibility:false,filterHidden:null,grid:{emptyBody:()=>JSX.createElement("span",null,"Aucun groupe")}}},init)
this.reg.addToList("actions:usersmgr:show:toolbar:top:groups","actionCreateUser",1,new ActionWrapperRefresUsersMgr(this).setOverridenSvc(CreateUserAction.SINGLETON_group))
this.reg.addToList("columns:usersmgr:groups","account",1,new GridColDef("account").setLabel("Compte").setFlex("4rem",1,1).setCellBuilder(new CellBuilderIconLabel("account").setIconWidth("1.2em").override("_getIcon",row=>"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/group.svg").override("getIconFilter",row=>{const isHidden=row.cacheHolder["isHidden"]
return isHidden?"grayscale(100%)":""})))
this.reg.addToList("columns:usersmgr:groups","groupName",1,new GridColDef("groupName").setLabel("Intitulé").setFlex("4em",1,1).setCellBuilder(new CellBuilderString("groupName")))
if(this.usersSrv.hasAspect(EUserAspects.rolable)){this.reg.addToList("columns:usersmgr:groups","roles",1,new GridColDef("roles").setLabel("Rôles").setDescription("Rôles résolus du groupe dans ce contexte").setFlex("5rem",1,1).setCellBuilder(new CellBuilderUserRoles(this.reg,"roles")))}this.reg.addToList("actions:usersmgr:ctxtmenu:groups","actionDeleteUser",1,new ActionWrapperRefresUsersMgr(this).setOverridenSvc(DeleteUsersAction.SINGLETON_group))
this.reg.addToList("actions:usersmgr:edit:toolbar:groups","userFormSave",1,UserFormSaveAction.SINGLETON_group)
this.reg.addToList("actions:usersmgr:edit:toolbar:groups","userFormRevert",1,UserFormRevertAction.SINGLETON_group)
this.reg.addToList("actions:usersmgr:show:toolbar:top:groups","actionDeleteUser",1,new ActionWrapperRefresUsersMgr(this).setOverridenSvc(DeleteUsersAction.SINGLETON_group))
this.reg.addSvcToList("userProps:update:single:groups","account",1,"area.users.props")
this.reg.addSvcToList("userProps:update:single:groups","groupName",1,"area.users.groupName")
this.reg.addSvcToList("userProps:update:single:groups","isHidden",1,"area.users.isHidden.groups")
this.reg.addSvcToList("userProps:update:single:groups","groups",1,"area.users.groupsmembers.groups")
this.reg.addSvcToList("userProps:update:single:groups","grantedRoles",1,"area.users.grantedRoles.groups")
this.reg.addSvcToList("userProps:update:single:groups","email",1,"area.users.email.group")
this.reg.addSvcToList("userProps:update:multi:groups","grantedRoles",1,"area.users.grantedRoles.multi.groups")
await super._initialize(mgrInit)
this._dirtyMdgOver.addEventListener("dblclick",ev=>{UserFormRevertAction.SINGLETON_group.executeIfAvailable(this,ev)})
this.formUpdateElt.addEventListener("keydown",ev=>{if(ev.key==="Escape"&&this.dirtyStatus){UserFormRevertAction.SINGLETON_group.executeIfAvailable(this,ev)
ev.stopPropagation()}})}isReadOnlyForm(user){if(!this.reg.hasPerm("action.users#update.group"))return true
return super.isReadOnlyForm(user)}redrawLine(row,line){super.redrawLine(row,line)
DOM.setAttrBool(line,"data-user-hidden",row.rowDatas.isHidden)
line.title=row.rowDatas.isHidden?"Visibilité : gestion":"Visibilité : globale"}}customElements.define("usersmgr-groups",GroupsMgr)
REG.reg.registerSkin("usersmgr-groups",1,`\n`)
export class CellBuilderUserRoles extends CellBuilderString{constructor(_reg,dataKey,rolesLists=ROLES.UI_ROLES_LIST){super(dataKey)
this._reg=_reg
this.dataKey=dataKey
this.rolesLists=rolesLists}getColSortFn(){return(r1,r2)=>{var _a,_b
const r1_rolesStr=((_a=ROLES.resolveUserRoles({grantedRoles:r1.rowDatas.grantedRoles,refusedRoles:r1.rowDatas.refusedRoles,inheritedRoles:r1.rowDatas.inheritedRoles}))===null||_a===void 0?void 0:_a.join(","))||""
const r2_rolesStr=((_b=ROLES.resolveUserRoles({grantedRoles:r2.rowDatas.grantedRoles,refusedRoles:r2.rowDatas.refusedRoles,inheritedRoles:r2.rowDatas.inheritedRoles}))===null||_b===void 0?void 0:_b.join(","))||""
return r1_rolesStr.localeCompare(r2_rolesStr)}}async getRolesUiHandler(){if(this._rolesUiHandler!==undefined)return this._rolesUiHandler
else if(this.rolesLists)this._rolesUiHandler=await Promise.all(this._reg.mergeLists(this.rolesLists))
return this._rolesUiHandler}redrawCell(row,root){let reg=REG.findReg(root)
const cacheHolder=row.cacheHolder
let cache=cacheHolder["specifRolesResult"]
if(cache==null){let roles=ROLES.resolveUserRoles({grantedRoles:row.rowDatas.grantedRoles,refusedRoles:row.rowDatas.refusedRoles,inheritedRoles:row.rowDatas.inheritedRoles})
let roleUiCtx={reg:reg,grantedRoles:row.rowDatas.grantedRoles,refusedRoles:row.rowDatas.refusedRoles,inheritedRoles:row.rowDatas.inheritedRoles}
if(roles.length>0){DOM.setTextContent(root,roles.join(", "))
cacheHolder["specifRolesResult"]=cache=this.getRolesUiHandler().then(async rolesUi=>{if(cacheHolder["specifRolesResult"]!==cache)return
const result=await ROLES.resolveRolesList(roles,roleUiCtx,rolesUi)
if(cacheHolder["specifRolesResult"]!==cache)return
return cacheHolder["specifRolesResult"]=result})}else{cache=cacheHolder["specifRolesResult"]=null}}if(cache instanceof Promise){let roles=ROLES.resolveUserRoles({grantedRoles:row.rowDatas.grantedRoles,refusedRoles:row.rowDatas.refusedRoles,inheritedRoles:row.rowDatas.inheritedRoles})
DOM.setTextContent(root,roles.join(", "))
root.specifRolesPending=cache
cache.then(()=>{if(root.specifRolesPending!==cache)return
root.specifRolesPending=null
redrawCellUi(root,cacheHolder["specifRolesResult"])})}else{root.specifRolesPending=null
redrawCellUi(root,null)}function redrawCellUi(root,newUiRoles){if(newUiRoles&&newUiRoles.length>0){cacheHolder["specifRolesContent"]=JSX.createElement("div",null)
cacheHolder["specifRolesTitle"]=newUiRoles.length>1?"Rôles : ":"Rôle : "
newUiRoles.forEach((entry,pos)=>{let hasNextEntry=pos<newUiRoles.length-1
if(hasNextEntry)cacheHolder["specifRolesContent"].appendChild(JSX.createElement("span",{class:"role-"+entry.level},entry.name,", "))
else cacheHolder["specifRolesContent"].appendChild(JSX.createElement("span",{class:"role-"+entry.level},entry.name))
let roleName=entry.name
switch(entry.level){case"inherited":cacheHolder["specifRolesTitle"]+=(newUiRoles.length>1?"\n- ":"")+`${roleName} (issu d\'un autre niveau)`
break
case"unknown":cacheHolder["specifRolesTitle"]+=(newUiRoles.length>1?"\n- ":"")+`${roleName} (inconnu)`
break
default:cacheHolder["specifRolesTitle"]+=(newUiRoles.length>1?"\n- ":"")+roleName}})}root.innerHTML=cacheHolder["specifRolesContent"]?cacheHolder["specifRolesContent"].innerHTML:""
DOM.setAttr(root,"title",cacheHolder["specifRolesTitle"])}}}const actionRefreshUi=new Action("refreshUi").setLabel("Rafraichir").setGroup("refresh").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/refresh.svg").setExecute((async function(ctx,ev){const me=DOMSH.findHost(ev.target)
await me.refresh()}))
class ActionWrapperRefresUsersMgr extends ActionWrapper{constructor(usersMgr){super()
this.usersMgr=usersMgr}isEnabled(ctx){if(ctx.dirtyStatus!==false)return false
return super.isEnabled(ctx)}async execute(ctx,ev){let result=await super.execute(ctx,ev)
if(result)await this.usersMgr._refresh()
if(typeof result==="object"){let user=result
this.usersMgr.usersGridElt.selectByJUser([user])}return result}}class UserFormSaveAction extends UsersAction{constructor(userType,id){super(id||"userFormSave")
this.userType=userType
this._label="Enregistrer"
this.setGroup("edit")
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/dialogs/save.svg")
this.requireVisiblePerm(this.userType===EUserType.user?"action.users#update.user":"action.users#update.group")}isEnabled(ctx){if(!ctx.formUpdateElt||ctx.formUpdateElt.hasAttribute("disabled"))return false
if(!ctx.dirtyStatus)return false
return super.isEnabled(ctx)}isVisible(ctx){if(!ctx.usersSrv.hasAspect(EUserAspects.updatable))return false
return super.isVisible(ctx)}async execute(ctx,ev){if(ctx.formUpdateElt.reportValidity()){let msg=new MsgOver
await msg.setCustomMsg("Veuillez patienter...","info").showMsgOver(ctx).waitFor(new Promise(async(resolve,refuse)=>{try{const params=Object.assign(FORMS.formToJson(ctx.formUpdateElt),ctx.forcedUserDataOnSave)
if(ctx.users&&ctx.users.length==1){const resp=this.userType===EUserType.user?await ctx.userSelfSrv.updateUser(params):await ctx.userSelfSrv.updateGroup(params)
let errorStr=USERSELF.tcheckUserSelfRespError(resp,"")
if(errorStr===null){await ctx.initFormUi()
let savedProps=await ctx.usersSrv.getUser(params.account)
resolve(ctx.onUserChange(savedProps))}else refuse(ERROR.show(errorStr?`L\'enregistrement a échoué. ${errorStr}`:"L\'enregistrement a échoué.",new Error(JSON.stringify(resp))))}else if(ctx.users&&ctx.users.length>1){let countUsers=ctx.users.length
let errorsArray=new Map
for(let ii=0;ii<countUsers;ii++){let user=ctx.users[ii]
let posUser=ii+1
msg.setCustomMsg(`Enregistrements en cours (${posUser} sur ${countUsers})...`)
let userParams=Object.assign({},params)
userParams.account=user.account
const resp=this.userType===EUserType.user?await ctx.userSelfSrv.updateUser(userParams):await ctx.userSelfSrv.updateGroup(userParams)
let errorStr=USERSELF.tcheckUserSelfRespError(resp,"")
if(errorStr===null){let savedProps=await ctx.usersSrv.getUser(user.account)
await ctx.onUserChange(savedProps)}else errorsArray.set(user.account,errorStr)
await new Promise(resolve=>setTimeout(resolve,500))}await ctx.showDetailsUser(null,true)
if(errorsArray.size==0){resolve(undefined)}else{let errorsCount=errorsArray.size
let usersList=Array.from(errorsArray.keys()).join(", ")
refuse(ERROR.show(errorsCount==1?`Une actualisation n\'a pu avoir lieu : ${usersList}.`:`${errorsCount} actualisations n\'ont pu avoir lieu : ${usersList}.`,new Error(Array.from(errorsArray.values()).join("\n\n"))))}}}catch(e){refuse(ERROR.report(`L\'enregistrement a échoué. Veuillez réessayer ultérieurement.`,e))}}))}}}UserFormSaveAction.SINGLETON_user=new UserFormSaveAction(EUserType.user)
UserFormSaveAction.SINGLETON_group=new UserFormSaveAction(EUserType.group)
class UserFormRevertAction extends UsersAction{constructor(userType,id){super(id||"userFormRevert")
this.userType=userType
this._label="Annuler"
this.setGroup("edit")
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/dialogs/cancel.svg")
this.requireVisiblePerm(this.userType===EUserType.user?"action.users#update.user":"action.users#update.group")}isEnabled(ctx){if(!ctx.formUpdateElt||ctx.formUpdateElt.hasAttribute("disabled"))return false
if(!ctx.dirtyStatus)return false
return super.isEnabled(ctx)}async execute(ctx,ev){if(ev.target.id===this.getId()||await POPUP.confirm(`Voulez-vous abandonner les modifications en cours ?`,ctx.reg.env.uiRoot,{okLbl:"Abandonner les modifications",cancelLbl:"Reprendre l\'édition"})){await ctx.initFormUi(ctx.users.length?"multi":"single")
return ctx.showDetailsUser(ctx.users,true)}}}UserFormRevertAction.SINGLETON_user=new UserFormRevertAction(EUserType.user)
UserFormRevertAction.SINGLETON_group=new UserFormRevertAction(EUserType.group)

//# sourceMappingURL=usersMgr.js.map