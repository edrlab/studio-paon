import{MsgOver}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{CellBuilderAccount}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/usersGrid.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{AccelKeyMgr,Action,ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{BaseAreaViewAsync,VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{AREAS,ControlAsyncArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{UserAccountInputArea,UserRolesInputArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/userAreas.js"
import{FORMS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/dialogs_Perms.js"
import{GridDataHolderJsonTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{GridSmall}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{CellBuilderUserRoles}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/usersMgr.js"
import{InputUserPanel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/inputs.js"
export class ObjRolesMapEdit extends BaseAreaViewAsync{constructor(){super(...arguments)
this.userRoles=null
this.buildControlLabel=true
this._formEditEmptyData={}
this._dirtyStatus=false
this._dirtyMdgOver=JSX.createElement("c-msg-over",{class:"disableMsgOver"})}async _initialize(init){var _a,_b
if(!this.reg)this.reg=REG.createSubReg(this.findReg(init))
this.params=init
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("webzone:panel",sr)
this.reg.installSkin("form-control-areas",sr)
this._initAndInstallSkin("rolesmap-edit",init)
let accelKeyMgr=(new AccelKeyMgr).initFromMapActions(this.reg.mergeListsAsMap("accelkeys:rolesmap","accelkeys:rolesmap:"+this.id))
accelKeyMgr.initFromMapActions(this.reg.mergeListsAsMap("accelkeys:rolesmap","accelkeys:rolesmap:"+this.id))
this.reg.addToList("actions:rolesmap:show:toolbar:top","actionRefreshUi",1,actionRefreshUi)
this.reg.addToList("actions:rolesmap:show:toolbar:top","actionNew",1,(new CreateEntryAction).requireVisiblePerm(this.params.objEditRolesMapPerms))
this.reg.addToList("actions:rolesmap:edit:toolbar","formSave",1,(new UserFormSaveAction).requireVisiblePerm(this.params.objEditRolesMapPerms))
this.reg.addToList("actions:rolesmap:edit:toolbar","formRevert",1,(new UserFormRevertAction).requireVisiblePerm(this.params.objEditRolesMapPerms))
this.reg.addToList("actions:rolesmap:edit:toolbar","deleteEntry",1,(new DeleteEntriesAction).requireVisiblePerm(this.params.objEditRolesMapPerms))
this.reg.addToList("actions:rolesmap:ctxtmenu","actionDeleteEntry",1,(new DeleteEntriesAction).requireVisiblePerm(this.params.objEditRolesMapPerms))
this.reg.addToList("areas:rolesmap:single","account",1,(new UserAccountInputArea).setReadOnly(true))
this.reg.addToList("areas:rolesmap:new","account",1,new SelectUserInputArea(null,this))
this.reg.addToList("areas:rolesmap:single","grantedRoles",1,new UserRolesInputArea(null,{uiLayerSgn:this.params.rolesUiLayerSng}))
this.reg.addToList("areas:rolesmap:multi","grantedRoles",1,new UserRolesInputArea(null,{uiLayerSgn:this.params.rolesUiLayerSng,canBeIndeterminate:true}))
this.reg.addToList("areas:rolesmap:new","grantedRoles",1,new UserRolesInputArea(null,{uiLayerSgn:this.params.rolesUiLayerSng}))
this._headBoxElt=sr.appendChild(JSX.createElement("div",{id:"head","c-resizable":true}))
sr.appendChild(JSX.createElement("c-resizer",null))
this._detailsBoxElt=sr.appendChild(JSX.createElement("div",{id:"details","c-resizable":true,hidden:true}))
this._dataHolder=new GridDataHolderJsonTree
const columnDefs=[new GridColDef("tree").setFlex("1rem",1,1).setMinWidth("55px").setLabel("Compte").setCellBuilder(new CellBuilderAccount(this.reg,"account",false,this.params.addAnonymousAccount?[{account:this.params.addAnonymousAccount,isAnonymous:true}]:null)),new GridColDef("roles").setLabel("Rôles").setDescription("Rôles résolus de l\'utilisateur dans ce contexte").setFlex("5rem",1,1).setCellBuilder(new CellBuilderUserRoles(this.reg,"roles"))]
this._rolesGridElt=this._headBoxElt.appendChild((new GridSmall).initialize(Object.assign({reg:this.reg,selType:"multi",hideHeaders:false,columnDefs:columnDefs,emptyBody:()=>this._lastLoadErrorStatus?JSX.createElement("span",{class:"error"},"Accès aux rôles affectés en échec"):JSX.createElement("span",null,"Aucun rôle affecté à ce niveau"),skinOver:"rolesmap-edit-tree",lineDrawer:this,dataHolder:this._dataHolder},init.grid)))
this._rolesGridElt.ctxMenuActions={actions:ACTION.injectSepByGroup(this.reg.mergeLists("actions:rolesmap","actions:rolesmap:ctxtmenu","actions:rolesmap:ctxtmenu:"+this.id),this.reg.getPref("actions.rolesmap.groupOrder","refresh users *"),this),actionContext:this}
this._rolesGridElt.addEventListener("keydown",async ev=>accelKeyMgr.handleKeyboardEvent(ev,this))
this._rolesGridElt.addEventListener("grid-select",async ev=>{this.userRoles=this._dataHolder&&this._dataHolder.countRows()>0?this._dataHolder.getSelectedDatas():[]
this._showToolbarTop.refreshContent()
this._showToolbarBottom.refreshContent()
await this.showDetails(this.userRoles)})
let toolbarsBox=this._headBoxElt.appendChild(JSX.createElement("div",{id:"toolbarsBox"}))
this._showToolbarTop=toolbarsBox.appendChild((new BarActions).initialize({reg:this.reg,actions:ACTION.injectSepByGroup(this.reg.mergeLists("actions:rolesmap","actions:rolesmap:show:toolbar:top","actions:rolesmap:show:toolbar:top:"+this.id,"actions:rolesmap:"+this.id),this.reg.getPref("actions.rolesmap.groupOrder","refresh users *"),this),uiContext:"bar",actionContext:this,disableFullOverlay:true}))
this._showToolbarTop.setAttribute("class","showToolbarTop")
this._showToolbarBottom=toolbarsBox.appendChild((new BarActions).initialize({reg:this.reg,actions:ACTION.injectSepByGroup(this.reg.mergeLists("actions:rolesmap:show:toolbar:bottom","actions:rolesmap:show:toolbar:bottom:"+this.id),this.reg.getPref("actions.rolesmap.groupOrder","refresh users *"),this),uiContext:"bar",actionContext:this,disableFullOverlay:true}))
this._showToolbarBottom.setAttribute("class","showToolbarBottom")
this._editUserRolesToolbar=this._detailsBoxElt.appendChild((new BarActions).initialize({reg:this.reg,actions:ACTION.injectSepByGroup(this.reg.mergeLists("actions:rolesmap:edit:toolbar","actions:rolesmap:edit:toolbar:"+this.id),this.reg.getPref("actions.rolesmap.groupOrder","edit *"),this),uiContext:"bar",actionContext:this,disableFullOverlay:true}))
this._editUserRolesToolbar.setAttribute("class","detailToolbar")
this.formEditElt=this._detailsBoxElt.appendChild(JSX.createElement("form",{id:"form",autocomplete:"off"}))
let onFormEditRequest=0
this.formEditElt.addEventListener("input",()=>{if(onFormEditRequest){clearTimeout(onFormEditRequest)
onFormEditRequest=0}onFormEditRequest=setTimeout(async()=>{await this.computeDirtyStatus()
onFormEditRequest=0},300)})
this.formEditElt.addEventListener("keydown",async ev=>{if(ev.key==="s"&&ACTION.isAccelPressed(ev)){ev.preventDefault()
ev.stopImmediatePropagation()
UserFormSaveAction.SINGLETON.executeIfAvailable(this,ev)
return true}return false})
this._dirtyMdgOver.addEventListener("dblclick",ev=>{UserFormRevertAction.SINGLETON.executeIfAvailable(this,ev)})
this.addEventListener("keydown",async ev=>{if(ev.key==="Enter"&&ACTION.isAccelPressed(ev)){ev.preventDefault()
ev.stopImmediatePropagation()
if(init.uiContext==="popup"&&await VIEWS.canHideView(this)){POPUP.findPopupableParent(this).close(false)}return true}return false})
return this.refreshUi((_b=(_a=this.params)===null||_a===void 0?void 0:_a.preSelectAccounts)===null||_b===void 0?void 0:_b.map(entry=>({account:entry})))}async _refresh(){this.refreshFreeze(1)
try{super._refresh()
await this.refreshUi()}finally{this.refreshFreeze(-1)}}async refreshUi(selectRolesMapEntries){await this.fetchRolesMap(selectRolesMapEntries)}isAccountInMap(account){return this._dataHolder.getDatas().find(entry=>entry.account===account)?true:false}allUserRolesChange(usersRolesMap){let usersRoles=[]
Object.keys(usersRolesMap).forEach(account=>{usersRoles.push({account:account,grantedRoles:usersRolesMap[account].allowedRoles,refusedRoles:usersRolesMap[account].deniedRoles,inheritedRoles:usersRolesMap[account].inheritedRoles,userUnknown:usersRolesMap[account].userUnknown})})
this._dataHolder.setDatas(usersRoles)}async fetchRolesMap(selectRolesMapEntries){try{this._lastLoadErrorStatus=undefined
const selectedEntries=selectRolesMapEntries?selectRolesMapEntries:this._dataHolder&&this._dataHolder.countRows()>0?this._dataHolder.getSelectedDatas():[]
this.allUserRolesChange(await this.params.objFetchRolesMap(this.params.objThis))
this._lastLoadErrorStatus=false
if(selectedEntries)this.selectRolesMapEntry(selectedEntries)}catch(e){this._lastLoadErrorStatus=true
this.allUserRolesChange({})
await ERROR.show("Accès à la liste des rôles en échec",e)}}async saveRolesMap(usersSetRoles){let usersRolesMap={}
let isEmpty=true
usersSetRoles.forEach(entry=>{if(entry.account){usersRolesMap[entry.account]=entry.grantedRoles||entry.refusedRoles?{allowedRoles:entry.grantedRoles,deniedRoles:entry.refusedRoles}:null
isEmpty=false}})
if(!isEmpty){let resp=await this.params.objEditRolesMap(this.params.objThis,usersRolesMap)
this.showDetails(null)
if(resp!=null)this.allUserRolesChange(resp)
else this.fetchRolesMap()
return resp}}selectRolesMapEntry(entries){if(entries===null||entries===void 0?void 0:entries.length){const selectedRows=[]
for(let i=0,c=this._dataHolder.countRows();i<c;i++){const userRow=this._dataHolder.getRow(i).rowDatas
if(userRow&&entries.find(entry=>entry&&entry.account==userRow.account))selectedRows.push(i)}this._rolesGridElt.setSelectedRows(selectedRows)}}async showDetails(userRoles,forced=false){if(!forced&&(userRoles===null||userRoles.length==0)){DOM.setHidden(this._detailsBoxElt,true)
this._detailUserCurrentData=undefined
this.dirtyStatus=false
this._editUserRolesToolbar.refreshContent()
return false}else if(userRoles&&userRoles.length==1){DOM.setHidden(this._detailsBoxElt,false)
await this.initFormUi("single",true)
FORMS.jsonToForm(userRoles[0],this.formEditElt,false,true)
this._detailUserCurrentData=FORMS.formToJson(this.formEditElt)
this.formEditElt.checkValidity()
this.formEditElt.querySelectorAll("fieldset").forEach(fieldsetElt=>{fieldsetElt.disabled=this.isReadOnlyForm(userRoles)})
this.dirtyStatus=false
this._editUserRolesToolbar.refreshContent()
return true}else if(userRoles&&userRoles.length>1){DOM.setHidden(this._detailsBoxElt,false)
await this.initFormUi("multi",true)
FORMS.jsonToForm([],this.formEditElt,false,true)
this._detailUserCurrentData=FORMS.formToJson(this.formEditElt)
this.formEditElt.checkValidity()
this.formEditElt.querySelectorAll("fieldset").forEach(fieldsetElt=>{fieldsetElt.disabled=this.isReadOnlyForm(userRoles)})
this.dirtyStatus=false
this._editUserRolesToolbar.refreshContent()
return true}else{DOM.setHidden(this._detailsBoxElt,false)
await this.initFormUi("new",true)
await FORMS.jsonToForm([],this.formEditElt,false,true)
this._detailUserCurrentData=FORMS.formToJson(this.formEditElt)
this.formEditElt.checkValidity()
this.formEditElt.querySelectorAll("fieldset").forEach(fieldsetElt=>{fieldsetElt.disabled=this.isReadOnlyForm(userRoles)})
this.dirtyStatus="forcedTrue"
this._editUserRolesToolbar.refreshContent()
return true}}isReadOnlyForm(user){if(!this.params.objEditRolesMapPerms||!this.reg.hasPerm(this.params.objEditRolesMapPerms))return true
return false}async initFormUi(morphology="single",onlyIfNecessay){if(onlyIfNecessay&&this._lastFormMorphology===morphology)return
this.formEditElt.innerHTML=""
this.formEditElt.appendChild(JSX.createElement("fieldset",null,JSX.createElement("div",{class:"fields","area-ids":"*"})))
let listCodes=["areas:rolesmap","areas:rolesmap:"+morphology,"areas:rolesmap:"+morphology+":"+this.id]
await AREAS.applyLayout(this.formEditElt,await Promise.all(this.reg.mergeLists(...listCodes)),this)
this._formEditEmptyData=FORMS.formToJson(this.formEditElt)
this._lastFormMorphology=morphology}get dirtyStatus(){return this._dirtyStatus}set dirtyStatus(val){if(this._dirtyStatus!=val){this._dirtyStatus=val
this._editUserRolesToolbar.refreshContent()
if(this.dirtyStatus===true||this.dirtyStatus==="forcedTrue"){this._dirtyMdgOver.showMsgOver(this._headBoxElt)}else{this._dirtyMdgOver.removeMsg()}}}async computeDirtyStatus(){if(this._detailsBoxElt.hasAttribute("hidden"))return false
if(this.dirtyStatus==="forcedTrue")return
const userData=FORMS.formToJson(this.formEditElt)
this.dirtyStatus=JSON.stringify(userData)!==JSON.stringify(this._detailUserCurrentData)
return this.dirtyStatus}redrawLine(row,line){if(row.rowDatas.userUnknown)line.title="Utilisateur / groupe inconnu"
else delete line.title
DOM.setAttrBool(line,"data-user-unknown",row.rowDatas.userUnknown)}onViewBeforeHide(close){return false}async onViewWaitForHide(close){return!await this.computeDirtyStatus()||await POPUP.confirm(`Des propriétés n\'ont pas été enregistrées. Voulez-vous abandonner ces modifications et quitter ?`,this.reg.env.uiRoot,{okLbl:"Abandonner les modifications et quitter",cancelLbl:"Reprendre l\'édition"})}}customElements.define("rolesmap-edit",ObjRolesMapEdit)
REG.reg.registerSkin("rolesmap-edit",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tflex-direction: column;\n\t\toverflow: hidden;\n\t}\n\n\t#head {\n\t\tdisplay: flex;\n\t\tflex: 1;\n\t\toverflow: auto;\n\t}\n\n\tc-grid-small {\n\t\tflex: 1;\n\t}\n\n\t#toolbarsBox {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t}\n\n\tc-bar-actions.showToolbarTop {\n\t\tflex: 1;\n\t}\n\n\tc-bar-actions.showToolbarTop,\n\tc-bar-actions.showToolbarBottom {\n\t\tflex-direction: column;\n\t\tborder-inline-start: 1px solid var(--border-color);\n\t}\n\n\n\tc-bar-actions.detailToolbar {\n\t\tflex-direction: row;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\tc-bar-actions.detailToolbar[hidden] {\n\t\tdisplay: none;\n\t}\n\n\tc-resizer {\n\t\tpointer-events: auto;\n\t\tcursor: ns-resize;\n\t\theight: 2px;\n\t}\n\n\t.disableMsgOver {\n\t\tbackground-color: rgba(0, 0, 0, .2);\n\t}\n\n\t/* Form */\n\t#details {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\toverflow: auto;\n\t}\n\n\t#details[hidden] {\n\t\tdisplay: none;\n\t}\n\n\tform {\n\t\tflex-direction: column;\n\t\tpadding: .4em;\n\t\toverflow: auto;\n\t}\n\n\tfieldset {\n\t\tborder: none;\n\t\tpadding: 0;\n\t\tmargin: 0;\n\t\tmin-width: 0;\n\t}\n\n\t.lbl {\n\t\tmin-width: 4em;\n\t}\n\n\t.fields > * {\n\t\tflex: 1;\n\t\tdisplay: grid;\n\t\tmin-width: 0;\n\t\tgrid-template-columns: auto 1fr;\n\t\tgrid-row-gap: .7rem;\n\t\tgrid-auto-rows: max-content;\n\t}\n\n\tc-input-users-panel, c-input-roles-selector {\n\t\tflex: 1\n\t}\n\n`)
REG.reg.registerSkin("rolesmap-edit-tree",1,`\n\t*[data-user-unknown] {\n\t\tfont-style: italic;\n\t\tcolor: var(--warning-color);\n\t}\n\n\t.error {\n\t\tcolor: var(--error-color);\n\t}\n\n\t.icon {\n\t\tbackground-size: 1rem;\n\t}\n\n\t/** Mise en forme de CellBuilderUserRoles */\n\t.role-unknown {\n\t\ttext-decoration: line-through;\n\t}\n\n\t.role-inherited {\n\t\tfont-style: italic;\n\t}\n\n`)
export class SelectUserInputArea extends ControlAsyncArea{constructor(id,rolesMapEdit){super(id||"account")
this.rolesMapEdit=rolesMapEdit
this.setLabel("Compte")}async _loadControl(ctx,name){let userSelector=(new InputUserPanel).initialize({name:this._id,required:true,reg:ctx.reg,emptySelectionMsg:"Choisir un compte...",userCard:"multi",usersGridInit:{usersSrv:ctx.reg.env.universe.useUsers,grid:{selType:"multi"},filterType:null,filterTypeInputVisibility:true,normalizeList:this.rolesMapEdit.params.addAnonymousAccount?(array,filterTxtRegExp)=>{if(!array.find(entry=>entry.account===this.rolesMapEdit.params.addAnonymousAccount))array.push({account:this.rolesMapEdit.params.addAnonymousAccount,isAnonymous:true})
return array}:null,openFilter:entry=>!this.rolesMapEdit.isAccountInMap(entry.account)}})
await userSelector.initializedAsync
userSelector.addEventListener("change",async evt=>{if(userSelector.value&&userSelector.value.length>0){const resp=await this.rolesMapEdit.params.objFetchRolesMapForAccounts(this.rolesMapEdit.params.objThis,userSelector.value)
ctx.userRoles=[]
for(const userAccount in resp){if(resp[userAccount])ctx.userRoles.push({account:userAccount,grantedRoles:resp[userAccount].allowedRoles,refusedRoles:resp[userAccount].deniedRoles,inheritedRoles:resp[userAccount].inheritedRoles})}}else ctx.userRoles=[]
await userSelector.form.querySelector("c-input-roles-selector").setInheritedRoles(ctx.userRoles&&ctx.userRoles.length==1?ctx.userRoles[0].inheritedRoles:null)})
return userSelector}}class RolesMapAction extends Action{constructor(){super(...arguments)
this.mode=null}setMode(mode){this.mode=mode}isVisible(ctx){if(!ctx.reg)return false
if(this.mode==="mono"&&(!ctx.userRoles||ctx.userRoles.length!==1))return false
if(this.mode==="multi"&&(!ctx.userRoles||ctx.userRoles.length===0))return false
return super.isVisible(ctx)}}const actionRefreshUi=new Action("refreshUi").setLabel("Rafraichir").setGroup("refresh").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/refresh.svg").setExecute((async function(ctx,ev){const me=DOMSH.findHost(ev.target)
await me.refresh()}))
class UserFormRevertAction extends RolesMapAction{constructor(id){super(id||"userFormRevert")
this._label="Annuler"
this.setGroup("edit")
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/dialogs/cancel.svg")}isEnabled(ctx){if(!ctx.formEditElt||ctx.formEditElt.hasAttribute("disabled"))return false
if(!ctx.dirtyStatus)return false
return super.isEnabled(ctx)}async execute(ctx,ev){if(ctx.dirtyStatus==="forcedTrue"||(ev.target.id===this.getId()||await POPUP.confirm(`Voulez-vous abandonner les modifications en cours ?`,ctx.reg.env.uiRoot,{okLbl:"Abandonner les modifications",cancelLbl:"Reprendre l\'édition"}))){return ctx.showDetails(ctx.userRoles)}}}UserFormRevertAction.SINGLETON=new UserFormRevertAction
class UserFormSaveAction extends RolesMapAction{constructor(id){super(id||"userFormSave")
this._label="Enregistrer"
this.setGroup("edit")
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/dialogs/save.svg")}isEnabled(ctx){if(!ctx.formEditElt||ctx.formEditElt.hasAttribute("disabled"))return false
if(!ctx.dirtyStatus)return false
return super.isEnabled(ctx)}async execute(ctx,ev){if(ctx.formEditElt.reportValidity()){let msg=new MsgOver
await msg.setCustomMsg("Veuillez patienter...","info").showMsgOver(ctx).waitFor(async()=>{try{const params=FORMS.formToJson(ctx.formEditElt)
if(ctx.userRoles){ctx.userRoles.forEach(entry=>{Object.assign(entry,{grantedRoles:params.grantedRoles,refusedRoles:params.refusedRoles})})
const filteredList=ctx.userRoles.filter(entry=>{var _a,_b
return ctx.isAccountInMap(entry.account)||((_a=entry.grantedRoles)===null||_a===void 0?void 0:_a.length)||((_b=entry.refusedRoles)===null||_b===void 0?void 0:_b.length)})
if(filteredList.length)await ctx.saveRolesMap(filteredList)
else POPUP.showNotifWarning("Aucune information à enregistrer",ctx.formEditElt)}}catch(e){ERROR.report(`L\'enregistrement a échoué. Veuillez réessayer ultérieurement.`,e)}})}}}UserFormSaveAction.SINGLETON=new UserFormSaveAction
export class CreateEntryAction extends RolesMapAction{constructor(id){super(id||"createEntry")
this.setLabel("Modifier les permissions pour un utilisateur")
this.setDescription("Modifier les permissions pour un utilisateur")
this._group="add"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/new.svg")}async execute(ctx,ev){let msg
await ctx.showDetails(null,true)}}CreateEntryAction.SINGLETON=new CreateEntryAction
export class DeleteEntriesAction extends RolesMapAction{constructor(id){super(id)
this.setMode("multi")
this._label=ctx=>{if(ctx.userRoles&&ctx.userRoles.length>1)return"Supprimer les déclarations de rôles"
else return"Supprimer la déclaration de rôles"}
this._description=ctx=>{if(ctx.userRoles&&ctx.userRoles.length>1)return"Suppression des déclarations de rôles"
else return"Suppression de la déclaration de rôles"}
this._group="remove"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/delete.svg")}isEnabled(ctx){if(ctx.dirtyStatus!==false)return false
return super.isEnabled(ctx)}async execute(ctx,ev){let msg
if(ctx.userRoles.length===1){msg=`Voulez-vous vraiment supprimer cette déclaration de rôles ?`}else{const usersCount=ctx.userRoles.length
msg=`Voulez-vous vraiment supprimer ces \'${usersCount}\' déclarations de rôles ?`}if(await POPUP.confirm(msg,null,{okLbl:"Supprimer",cancelLbl:"Annuler"})){try{if(ctx.userRoles){ctx.userRoles.forEach(entry=>{delete entry.grantedRoles
delete entry.refusedRoles})
if(!await ctx.saveRolesMap(ctx.userRoles))return false}return true}catch(e){await ERROR.report(`La suppression des déclarations de rôles n\'a pas pu aboutir. Veuillez réessayer ultérieurement.`,e)}}return false}}DeleteEntriesAction.SINGLETON=new DeleteEntriesAction

//# sourceMappingURL=objRolesMap.js.map