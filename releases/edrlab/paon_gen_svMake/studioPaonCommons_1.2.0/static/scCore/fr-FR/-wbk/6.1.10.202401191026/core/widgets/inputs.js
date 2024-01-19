import{BaseElementAsync,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{MxFormElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{UsersGrid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/usersGrid.js"
import{EUserType,USER}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
import{UserRef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/userRef.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{UserSelector}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/userSelector.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
export class InputUserPanel extends(MxFormElement(BaseElementAsync)){constructor(){super(...arguments)
this._setAccounts=[]}get value(){return this._setAccounts}set value(vals){this._setAccounts=vals||[]
this._setUsers=undefined
this.initializedAsync.then(()=>{this._refreshUi()})}get forcedIniUsers(){return this._forcedIniUsers}set forcedIniUsers(vals){this._forcedIniUsers=vals||[]
this.initializedAsync.then(()=>{this._refreshUi()})}async getUsersValues(){if(!this._setAccounts||this._setAccounts.length==0)return
if(!this._setUsers){this._setUsers=await this.reg.env.universe.useUsers.getUserSet(this._setAccounts,true)
this._setUsers.sort(this.sortUsers)}else if(this._setUsers.length!=this._setAccounts.length){const newAccounts=[]
this._setAccounts.forEach(account=>{if(!this._setUsers.findIndex(entry=>entry.account===account))newAccounts.push(account)})
this._setUsers=this._setUsers.concat(await this.reg.env.universe.useUsers.getUserSet(newAccounts,true))
this._setUsers.sort(this.sortUsers)}return this._setUsers}formDisabledCallback(disabled){DOM.setAttrBool(this._preview,"disabled",disabled)}async _initialize(init){this.reg=this.findReg(init)
this._params=Object.assign({userCard:"single"},init)
DOM.setAttrBool(this,"data-card-isSingle",this._params.userCard==="single")
DOM.setAttrBool(this,"data-card-isMulti",this._params.userCard==="multi")
this._msg=JSX.createElement("c-msg",{hidden:true})
const editBox=JSX.createElement("div",{class:"inputBox"})
this._preview=editBox.appendChild(JSX.createElement("div",{class:"preview"}))
const actsBox=editBox.appendChild(JSX.createElement("div",{class:"acts"}))
if(this._params.userCard=="multi"){actsBox.appendChild(JSX.createElement("button",{class:"addUsers",onclick:this.onAddUsers,title:"Ajouter des utilisateurs"}))
this._preview.onclick=this.onAddUsers}else{actsBox.appendChild(JSX.createElement("button",{class:"selectUser",onclick:this.onSelectUser,title:"Sélectionner l\'utilisateur"}))
this._preview.onclick=this.onSelectUser}this._attach(this.localName,init,editBox,this._msg)
this.addEventListener("keydown",(async function(ev){if(!this.disabled&&(ev.key==="Delete"||ev.key==="Backspace")&&this===DOMSH.findDocumentOrShadowRoot(this).activeElement){this.indeterminate=true
this.value=null
ev.stopPropagation()
this.dispathChangeEvent()
return true}return false}))
this.tabIndex=0
this._initializeForm(init)
await this._refreshUi()}async _refreshUi(){var _a
if(this._pendingRefresh){this._mustRefresh=true
return}else this._mustRefresh=false
const currentRefresh=this._pendingRefresh=Date.now()
try{const forcedMsg="Compte imposé par le contexte. Sans directive explicite, il ne sera ni ajouté, ni supprimé"
this._preview.innerHTML=""
const users=((_a=this.value)===null||_a===void 0?void 0:_a.length)?await this.getUsersValues():null
if(currentRefresh!==this._pendingRefresh)return
if(!this.disabled){if(users&&users.length>0||(this.forcedIniUsers&&this.forcedIniUsers.length)>0){if(this.forcedIniUsers){for(const u of this.forcedIniUsers){const entry=this._preview.appendChild(JSX.createElement("div",{class:"user"},JSX.createElement(UserRef,{class:"forced",title:forcedMsg,"î":{reg:this.reg,user:u,withTitle:false}})))
if(!this._params.hideRemButton)entry.appendChild(JSX.createElement("button",{class:"remUser",onclick:this.onRemUser,title:"Supprimer"}))}}if(users){for(const u of users){const entry=this._preview.appendChild(JSX.createElement("div",{class:"user"},JSX.createElement(UserRef,{"î":{reg:this.reg,user:u}})))
if(!this._params.hideRemButton)entry.appendChild(JSX.createElement("button",{class:"remUser",onclick:this.onRemUser,title:"Supprimer"}))}}}else this._preview.appendChild(JSX.createElement(MsgLabel,{"î":{label:"emptySelectionMsg"in this._params?this._params.emptySelectionMsg:"non défini"}}))}else{if(users&&users.length>0||this.forcedIniUsers&&this.forcedIniUsers.length>0){if(this.forcedIniUsers)for(const u of this.forcedIniUsers){this._preview.appendChild(JSX.createElement(UserRef,{class:"forced",title:forcedMsg,"î":{reg:this.reg,user:u,withTitle:false}}))}if(users)for(const u of users){this._preview.appendChild(JSX.createElement(UserRef,{"î":{reg:this.reg,user:u}}))}}else this._preview.appendChild(JSX.createElement(MsgLabel,{"î":{label:"emptySelectionMsg"in this._params?this._params.emptySelectionMsg:"non défini"}}))}}finally{if(currentRefresh===this._pendingRefresh)this._pendingRefresh=null}if(this._mustRefresh){this._mustRefresh=false
this._pendingRefresh=null
await this._refreshUi()}else this._refreshValidity()}addUser(){if(this._params.userCard=="multi")this.onAddUsers.call(this)
else this.onSelectUser.call(this)}async makeSelector(){if(!this._lastSelector){if(this._params.selectWithConfirm){this._lastSelector=(new UserSelector).initialize(Object.assign({reg:this.reg,buttonLabel:this._params.userCard==="single"?"Sélectionner":"Ajouter",userGrid:Object.assign({usersSrv:this.reg.env.universe.useUsers,grid:{selType:this._params.userCard==="single"?"mono":"multi"},filterType:EUserType.user,filterTypeInputVisibility:false,preserveSelectionOnFilter:true},this._params.usersGridInit),selectAndCloseOnDblClick:true},this._params.usersSelectorInit))
this._lastSelectorGrid=this._lastSelector.userGrid}else{this._lastSelectorGrid=this._lastSelector=(new UsersGrid).initialize(Object.assign({usersSrv:this.reg.env.universe.useUsers,grid:"mono",defaultAction:(new Action).setLabel("Sélectionner").setExecute(ctx=>{if(this._openPopup&&this._openPopup.opened)this._openPopup.close(this._lastSelectorGrid.getSelectedUsers())}),filterType:EUserType.user,filterTypeInputVisibility:false,disableAutoSearchOnInit:true},this._params.usersGridInit))}}else await this._lastSelectorGrid.razFilters()
return this._lastSelectorGrid}async onSelectUser(ev){ev===null||ev===void 0?void 0:ev.stopImmediatePropagation()
const me=this instanceof InputUserPanel?this:DOMSH.findHost(this)
if(me.disabled)return
const prevVal=me._setAccounts
const userSelector=await me.makeSelector()
await userSelector.doSearchUsers()
userSelector.selectByJUser(me._setUsers||[],true)
me._openPopup=POPUP.showMenuFromEvent(me._lastSelector,ev||me,me,null,{initWidth:"20em"})
const users=await me._openPopup.onNextClose()
me._openPopup=null
if(users&&users.length>0){me._setAccounts=[]
me._forcedIniUsers=[]
users.forEach(value=>me._setAccounts.push(value.account))
if(!InputUserPanel.isAccountsListEquals(prevVal,me._setAccounts)){me._setUsers=users
me.focus()
await me._refreshUi()
me.dispathChangeEvent()}}}async onAddUsers(ev){ev===null||ev===void 0?void 0:ev.stopImmediatePropagation()
const me=this instanceof InputUserPanel?this:DOMSH.findHost(this)
if(me.disabled)return
const userSelector=await me.makeSelector()
if(me._setAccounts.length>0)userSelector.setContextualUserFilter(user=>me._setAccounts.indexOf(user.account)==-1)
await userSelector.doSearchUsers()
me._openPopup=POPUP.showMenuFromEvent(me._lastSelector,ev||me,me,null,{initWidth:"20em"})
const users=await me._openPopup.onNextClose()
me._openPopup=null
if(users&&users.length>0){if(!me._setUsers)me._setUsers=[]
users.forEach(value=>{if(me._forcedIniUsers){const remIdx=me._forcedIniUsers.findIndex(entry=>entry.account===value.account)
if(remIdx>-1)me._forcedIniUsers.splice(remIdx,1)}me._setAccounts.push(value.account)
me._setUsers.push(value)})
me._setUsers.sort(me.sortUsers)
me.focus()
await me._refreshUi()
me.dispathChangeEvent()}}async onRemUser(ev){var _a,_b
ev===null||ev===void 0?void 0:ev.stopImmediatePropagation()
const me=DOMSH.findHost(this)
if(me.disabled)return
const userRef=this.previousElementSibling
if((_a=userRef.classList)===null||_a===void 0?void 0:_a.contains("forced")){const remIdx=me._forcedIniUsers.findIndex(entry=>entry.account===userRef.nickOrAccount)
if(remIdx>-1)me._forcedIniUsers.splice(remIdx,1)}else{const remAccIdx=me._setAccounts.findIndex(account=>account===userRef.nickOrAccount)
me._setAccounts.splice(remAccIdx,1)
const remUsersIdx=(_b=me._setUsers)===null||_b===void 0?void 0:_b.findIndex(user=>user.account===userRef.nickOrAccount)
if(remUsersIdx>-1)me._setUsers.splice(remUsersIdx,1)}me.focus()
await me._refreshUi()
me.dispathChangeEvent()}_refreshValidity(){var _a,_b
if(this.required&&(!this._setUsers||this._setUsers.length==0))this.setValidity({valueMissing:true},((_a=this._params.errorMsgs)===null||_a===void 0?void 0:_a.empty)||"Veuillez renseigner ce champ.")
else if(this._params.userCard=="single"&&this._setUsers&&this._setUsers.length>1)this.setValidity({valueMissing:true},((_b=this._params.errorMsgs)===null||_b===void 0?void 0:_b.tooMany)||"Veuillez saisir une unique valeur.")
else this.setValidity({})}dispathChangeEvent(){this.dispatchEvent(new CustomEvent("input",{bubbles:true,cancelable:false}))
this.dispatchEvent(new CustomEvent("change",{bubbles:true,cancelable:false}))}sortUsers(u1,u2){return USER.getPrimaryName(u1).localeCompare(USER.getPrimaryName(u2))}static isAccountsListEquals(l1,l2){if(!l1||!l2)return false
if(l1.length!==l2.length)return false
for(const u of l1)if(l2.indexOf(u)==-1)return false
return true}}REG.reg.registerSkin("c-input-users-panel",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tflex-direction: column;\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--focus-outline);\n\t}\n\n\t:host(:not([disabled])) {\n\t\tcursor: pointer;\n\t}\n\n\t.inputBox {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-wrap: wrap;\n\t}\n\n\t.inputBox {\n\t\tbackground-color: var(--form-bgcolor);\n\t\tborder: 1px solid var(--border-color);\n\t}\n\n\t:host([disabled]) .inputBox {\n\t\tbackground-color: unset;\n\t\tborder: unset;\n\t}\n\n\t.preview {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-wrap: wrap;\n\t}\n\n\t.acts {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\t:host([data-card-isMulti]) .acts {\n\t\tborder-inline-start: 1px solid var(--border-color);\n\t\tmargin-block-start: 2px;\n\t\tmargin-block-end: 2px;\n\t\tmargin-inline-start: 2px;\n\t}\n\n\t.user {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tpadding: .1em;\n\t}\n\n\t:host([data-card-isSingle]) .user {\n\t\tcursor: pointer;\n\t\tuser-select: none;\n\t\tflex: 1;\n\t}\n\n\t:host(:not([data-card-isSingle])) .user {\n\t\tcursor: default;\n\t\tmargin: .2em;\n\t\tborder: 1px solid var(--border-color);\n\t\tborder-radius: .4em;\n\t\tbackground-color: var(--alt2-bgcolor);\n\t}\n\n\t/*\n\t:host([data-card-isSingle]) > :only-of-type > .remUser{\n\t\tdisplay: none;\n\t}\n\t*/\n\n\tc-userref {\n\t\tcolor: var(--edit-color);\n\t}\n\n\tc-userref.forced {\n\t\topacity: .6;\n\t}\n\n\t:host([data-card-isSingle]) c-userref {\n\t\tflex: 1;\n\t}\n\n\tbutton {\n\t\tborder: none;\n\t\tcursor: pointer;\n\t\twidth: var(--icon-size);\n\t\theight: var(--icon-size);\n\t\talign-self: center;\n\t\tfont-size: inherit;\n\t}\n\n\t:host([disabled]) button {\n\t\tdisplay: none;\n\t}\n\n\t:host(:not([readonly])) button:hover {\n\t\tfilter: var(--hover-filter);\n\t}\n\n\t:host([readonly]) button {\n\t\tdisplay: none;\n\t}\n\n\t.remUser {\n\t\talign-self: flex-start;\n\t\tbackground: transparent no-repeat url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/delete.svg") top;\n\t\tbackground-size: 65%;\n\t}\n\n  :host([data-card-isSingle]) .remUser {\n\t  background-position: center;\n  }\n\n  .addUsers {\n\t  background: transparent no-repeat url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/add.svg") center;\n\t  background-size: 1em 1em;\n  }\n\n  .selectUser {\n\t  background: transparent no-repeat var(--dropdown-url) center;\n\t  background-size: 1em 1em;\n  }\n\n  c-msg {\n\t  justify-content: flex-start;\n\t  font-style: italic;\n  }\n\n`)
customElements.define("c-input-users-panel",InputUserPanel)

//# sourceMappingURL=inputs.js.map