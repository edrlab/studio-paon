import{BaseElementAsync,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{CellBuilderString}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{Grid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{GridColTreeDef,GridDataHolderJsonTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{EUserAspects,EUserType,USER}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{Button,ButtonToggle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{InputUserPanel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/inputs.js"
import{UserRef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/userRef.js"
import{ROLES}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/roles.js"
export class UsersGrid extends BaseElementAsync{async _initialize(init){this.reg=this.findReg(init)
this.params=init
if(this.params.firstMaxEntries===undefined)this.params.firstMaxEntries=100
if(this.params.fullMaxEntries===undefined)this.params.fullMaxEntries=1e3
if(this.params.filterTxtInputVisibility===undefined)this.params.filterTxtInputVisibility=true
if(this.params.filterTypeInputVisibility===undefined)this.params.filterTypeInputVisibility=false
if(this.params.filterHiddenInputVisibility===undefined)this.params.filterHiddenInputVisibility=false
if(this.params.filterHidden===undefined)this.params.filterHidden=false
if(this.params.preserveSelectionOnFilter===undefined)this.params.preserveSelectionOnFilter=false
this.usersSrv=init.usersSrv
this.dataHolder=new GridDataHolderJsonTree("children")
const colDefs=[new GridColTreeDef("tree").setFlex("1rem",1,1).setMinWidth("55px").setCellBuilder(new CellBuilderAccountJUser(this.reg,false,this.params.showLongName))]
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("form-control-areas",sr)
this._initAndInstallSkin(this.localName,init)
let headElt=sr.appendChild(JSX.createElement("div",{id:"head"}))
this.filterFormElt=headElt.appendChild(JSX.createElement("form",{id:"filter",title:"Filtres appliqués à la liste des utilisateurs..."}))
if(this.params.filterTxtInputVisibility){let input=this.filterFormElt.appendChild(JSX.createElement("input",{type:"search",id:"filterTxt",name:"filterTxt",spellcheck:"false",autocomplete:"off",oninput:this.onSearchInput,onkeydown:this.onKeyPress}))
input.focus()}if(this.params.filterTypeInputVisibility&&this.usersSrv.hasAspect(EUserAspects.groupable)){let input=this.filterFormElt.appendChild(JSX.createElement("select",{id:"filterType",name:"filterType",onchange:this.onSearchInput},JSX.createElement("option",{value:"",title:"Utilisateurs et groupes",label:"Utilisateurs et groupes"}),JSX.createElement("option",{value:"user",title:"Utilisateurs",label:"Utilisateurs"}),JSX.createElement("option",{value:"group",title:"Groupes",label:"Groupes"})))
input.addEventListener("change",(function(ev){DOM.setAttr(this,"data-value",this.value)}))}if(this.params.filterHiddenInputVisibility&&this.usersSrv.hasAspect(EUserAspects.hideable)&&(!this.params.filterHiddenInputPerms||this.reg.hasPerm(this.params.filterHiddenInputPerms))){this.filterFormElt.appendChild(JSX.createElement(ButtonToggle,{id:"filterHidden",onclick:this.toggleFilterHiddenInput,"î":Object.assign({toggleOn:this.params.filterHidden,uiContext:"bar",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/user/system.svg",title:"Afficher/cacher les utilisateurs masqués"},this.params.filterHiddenBtnInit)}))}if(this.params.filterGroupsInputVisibility&&this.usersSrv.hasAspect(EUserAspects.groupable)){this.filterFormGroupsInput=this.filterFormElt.appendChild((new InputUserPanel).initialize(Object.assign({name:"filterGroups",reg:this.reg,emptySelectionMsg:"Membres de l\'un des groupes...",userCard:"multi",usersGridInit:{usersSrv:this.usersSrv,filterType:EUserType.group,filterTypeInputVisibility:false}},this.params.filterGroupsInputInit)))
await this.filterFormGroupsInput.initializedAsync
this.filterFormGroupsInput.addEventListener("change",async evt=>{this.onSearchInput.call(this.filterFormGroupsInput,evt)})
this.filterFormGroupsInput.title="Membres de l\'un des groupes spécifiés"
DOM.setHidden(this.filterFormGroupsInput,true)}if(this.params.filterRolesInputVisibility&&this.usersSrv.hasAspect(EUserAspects.rolable)){let rolesUiHandlers=await Promise.all(this.reg.mergeLists(ROLES.UI_ROLES_LIST))
this.filterFormRolesInput=this.filterFormElt.appendChild(JSX.createElement("select",{id:"filterRoles",name:"filterRoles",onchange:this.onSearchInput,title:"Possèdent le rôle sélectionné"},JSX.createElement("option",{value:"",label:"Possèdent le rôle...",disabled:true,selected:true,style:"display: none;"}),JSX.createElement("option",{value:"",label:""})))
rolesUiHandlers.forEach(entry=>{this.filterFormRolesInput.appendChild(JSX.createElement("option",{value:entry.roleCode,title:entry.getDescription(this),label:entry.getLabel(this)}))})
DOM.setHidden(this.filterFormRolesInput,true)
this.filterFormRolesInput.addEventListener("change",async evt=>{DOM.setAttrBool(this.filterFormRolesInput,"isNotSet",this.filterFormRolesInput.value==="")
if(this.filterFormRolesInput.value==="")this.filterFormRolesInput.value=""})}if(this.params.displayRazFilterBtn)this.razButton=this.filterFormElt.appendChild(JSX.createElement(Button,{id:"btnRazFilter","î":{uiContext:"bar",title:"Réinitialiser les filtres...",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/reset-filter.svg"},onclick:()=>{if(!this.razButton.disabled)this.razFilters(true)}}))
await this.razFilters()
const msgBox=headElt.appendChild(JSX.createElement("div",{id:"msgBox"}))
this.msgElt=msgBox.appendChild(JSX.createElement(MsgLabel,{id:"msg"}))
if(this.params.fullMaxEntries>this.params.firstMaxEntries)this.searchMoreBtn=msgBox.appendChild(JSX.createElement(Button,{id:"btnMore","î":{uiContext:"dialog",label:"Voir plus..."},onclick:this.doSearchUsers.bind(this,this.params.fullMaxEntries)}))
this.grid=sr.appendChild((new Grid).initialize(Object.assign({autoSelOnFocus:"first",columnDefs:colDefs,dataHolder:this.dataHolder,hideHeaders:true,defaultAction:init.defaultAction,defaultActionCtx:this,emptyBody:()=>JSX.createElement("span",null,"Aucune entrée")},init.grid)))
if(!init.disableAutoSearchOnInit)await this.doSearchUsers()}async razFilters(refreshGrid=false){const sr=this.shadowRoot
const filterTxt=sr.getElementById("filterTxt")
if(filterTxt)filterTxt.value=this.params.filterTxt||""
const filterType=sr.getElementById("filterType")
if(filterType){if(this.params.filterType){DOM.setAttr(filterType,"data-value",this.params.filterType)
filterType.value=this.params.filterType}else{filterType.removeAttribute("data-value")
filterType.value=undefined}}const filterHidden=sr.getElementById("filterHidden")
if(filterHidden)filterHidden.toggleOn=this.params.filterHidden
if(this.filterFormGroupsInput){if(this.usersSrv.hasAspect(EUserAspects.groupable)){if(typeof this.params.filterGroups==="string")this.params.filterGroups=[this.params.filterGroups]
this.filterFormGroupsInput.value=this.params.filterGroups||null
const groupsSet=await this.usersSrv.list(null,EUserType.group,false,null,1)
DOM.setHidden(this.filterFormGroupsInput,!groupsSet.userList||groupsSet.userList.length==0)}else DOM.setHidden(this.filterFormGroupsInput,true)}if(this.filterFormRolesInput){if(this.usersSrv.hasAspect(EUserAspects.rolable)){this.filterFormRolesInput.value=this.params.filterRoles||""
DOM.setAttrBool(this.filterFormRolesInput,"isNotSet",this.params.filterRoles?false:true)
DOM.setHidden(this.filterFormRolesInput,false)}else DOM.setHidden(this.filterFormRolesInput,true)}if(refreshGrid)await this.doSearchUsers()}setContextualUserFilter(filter){this._contextualUserFilter=filter}getSelectedUser(){if(this.dataHolder){const row=this.dataHolder.getRow(this.grid.getSelectedRow())
if(!row)return null
return row.rowDatas}}getSelectedUsers(){return this.dataHolder&&this.dataHolder.countRows()>0?this.dataHolder.getSelectedDatas():[]}selectByJUser(users,showUserIfUnknown=false){if(users!=null){if(showUserIfUnknown){const usersSet=this.dataHolder.getDatas()
users.forEach(entry=>{if(!usersSet.find(user=>user.account==entry.account)){this.dataHolder.insertRowKey(null,entry)}})}const selectedRows=[]
for(let i=0,c=this.dataHolder.countRows();i<c;i++){const userRow=this.dataHolder.getRow(i).rowDatas
if(userRow&&users.find(user=>{if(user&&user.account==userRow.account)return true})){selectedRows.push(i)}}if(selectedRows.length>0)this.grid.setSelectedRows(selectedRows)
else this.grid.clearSel()}}toggleFilterHiddenInput(ev){const tree=DOMSH.findHost(this)
this.toggleOn=!this.toggleOn
tree.doSearchUsers()}onSearchInput(ev){const me=DOMSH.findHost(this)
if(me._searchInputWaiter)clearTimeout(me._searchInputWaiter)
me._searchInputWaiter=setTimeout(()=>me.doSearchUsers(),500)}async doSearchUsers(max){var _a,_b
let filterIsDirty=false
if(max===undefined||max)this._currentMaxEntries=max
let fd=new FormData(this.filterFormElt)
const selectedUsers=this.getSelectedUsers()
this.dataHolder.setDatas([])
let filterTxtRegExp=null
if(fd.has("filterTxt")){if(fd.get("filterTxt")){filterTxtRegExp=new RegExp(".*"+fd.get("filterTxt").toString().replace(/\W/g,LANG.escapeChar4Regexp)+".*","i")
filterIsDirty=true}}else if(this.params.filterTxt)filterTxtRegExp=new RegExp(".*"+this.params.filterTxt.replace(/\W/g,LANG.escapeChar4Regexp)+".*","i")
let filterType=null
if(this.usersSrv.hasAspect(EUserAspects.groupable)){if(fd.has("filterType")){filterIsDirty=true
filterType=fd.get("filterType")}else if(this.params.filterType)filterType=this.params.filterType}let filterGroups=undefined
if(this.usersSrv.hasAspect(EUserAspects.groupable)){if(this.filterFormGroupsInput){filterGroups=this.filterFormGroupsInput.value
if((_a=this.filterFormGroupsInput.value)===null||_a===void 0?void 0:_a.length)filterIsDirty=true}else if(this.params.filterGroups){if(typeof this.params.filterGroups==="string")this.params.filterGroups=[this.params.filterGroups]
filterGroups=this.params.filterGroups}}let filterRoles=undefined
if(this.usersSrv.hasAspect(EUserAspects.rolable)){if((_b=this.filterFormRolesInput)===null||_b===void 0?void 0:_b.value){filterIsDirty=true
filterRoles=[this.filterFormRolesInput.value]}else{filterRoles=this.params.filterRoles?[this.params.filterRoles]:null}}let filterHidden=undefined
if(this.usersSrv.hasAspect(EUserAspects.hideable)){let btnInput=this.filterFormElt.querySelector("#filterHidden")
if(btnInput){filterHidden=btnInput.toggleOn
if(filterHidden!=this.params.filterHidden)filterIsDirty=true}else if(this.params.filterHidden!==undefined){filterHidden=this.params.filterHidden}}const requestMax=Number.isInteger(this._currentMaxEntries)?this._currentMaxEntries:this.params.firstMaxEntries
this.grid.classList.toggle("filtered",filterIsDirty)
const usersSet=await this.usersSrv.list(null,filterType,filterHidden,filterGroups,requestMax,filterTxtRegExp,null,null,null,filterRoles)
if(!usersSet.userList)throw Error("usersSrv can't browse users")
if(this.params.normalizeList)usersSet.userList=this.params.normalizeList(usersSet.userList,filterTxtRegExp)
if(this.params.openFilter)usersSet.userList=usersSet.userList.filter(this.params.openFilter)
if(this._contextualUserFilter)usersSet.userList=usersSet.userList.filter(this._contextualUserFilter)
this.dataHolder.setDatas(usersSet.userList)
if(this.razButton)this.razButton.disabled=!filterIsDirty
if(this.searchMoreBtn)DOM.setHidden(this.searchMoreBtn,requestMax>=this.params.fullMaxEntries||!usersSet.more)
const nbMax=usersSet.userList.length
let msg=""
if(usersSet.more&&this.searchMoreBtn&&!this.searchMoreBtn.hidden)msg=`Seules les ${nbMax} premières entrées sont affichées.`
else if(usersSet.more)msg=`Seules les ${nbMax} premières entrées sont affichées. Veuillez préciser la recherche...`
this.msgElt.setCustomMsg(msg)
if(selectedUsers&&selectedUsers.length>0)this.selectByJUser(selectedUsers,this.params.preserveSelectionOnFilter)
if(this.params.forceSelectEntry&&this.getSelectedUsers().length==0)this.grid.setSelectedRows(0)}onKeyPress(ev){if(ev.key==="ArrowDown"){const tree=DOMSH.findHost(this)
if(tree.grid.getSelectedRow()!==undefined)tree.grid.focus()}}}REG.reg.registerSkin("server-users-grid",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t:focus-visible {\n\t\toutline: var(--focus-outline);\n\t}\n\n\t#head {\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\t#filter {\n\t  background: .1em / 1em no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/filter.svg);\n\t  padding-block: 2px;\n\t  padding-inline: 1.2em 2px;\n\t  display: flex;\n\t  min-width: 0;\n\t  min-height: 0;\n\t  align-items: center;\n\t  overflow: hidden;\n\t  flex-wrap: wrap;\n  }\n\n  #btnRazFilter {\n\t  margin-inline: 0;\n\t  padding-inline: 0;\n  }\n\n  #filter > * {\n\t  margin-block: 0;\n\t  margin-inline: .3rem 0;\n  }\n\n\t#filterTxt {\n\t\tmin-width: 10em;\n\t\tflex: 1;\n\t}\n\n\t#filterType {\n\t\tborder: none;\n\t\tbackground-image: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/userGroup.svg");\n\t\tbackground-color: var(--form-bgcolor);\n\t\tbackground-repeat: no-repeat;\n\t\tbackground-size: auto 11px;\n\t\tbackground-position-y: center;\n\t\tbackground-position-x: 3px;\n\t\tmin-width: 37px;\n\t\tmax-width: 37px;\n\t\tpadding-inline-start: 37px;\n\t\tfont-size: inherit;\n\t}\n\n\t#filterType[data-value=group] {\n\t\tbackground-image: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/group.svg");\n\t}\n\n\t#filterType[data-value=user] {\n\t\tbackground-image: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/user.svg");\n\t}\n\n\t#filterRoles {\n\t\tmin-width: 0;\n\t}\n\n\t#filterRoles[isNotSet] {\n\t\tfont-style: italic;\n\t}\n\n\t#filterRoles[isNotSet] > option {\n\t\tfont-style: normal;\n\t}\n\n\t#filterRoles > option[value='main:~fallback'] {\n\t\tfont-style: italic;\n\t}\n\n\t#filterGroup {\n\t\tmin-width: 0;\n\t}\n\n\tc-input-users-panel {\n\t\tmin-width: 12rem;\n\t}\n\n\t#msgBox {\n\t\tfont-size: .8rem;\n\t\tdisplay: flex;\n\t\tflex-direction: row;\n\t}\n\n\t#msg {\n\t\tcolor: var(--info-color);\n\t\tjustify-content: flex-end;\n\t\tfont-style: italic;\n\t\tmargin-inline-end: .5rem;\n\t}\n\n\t#btnMore {\n\t\tmargin: .1em;\n\t\tmargin-inline-end: .5rem;\n\t}\n\n\tc-grid {\n\t\tflex: 1;\n\t\tborder: none;\n\t\tbackground-color: var(--row-bgcolor);\n\t}\n`)
customElements.define("server-users-grid",UsersGrid)
export class CellBuilderAccountJUser extends CellBuilderString{constructor(reg,hideIcon=false,showLongName=false){super(null)
this.reg=reg
this.hideIcon=hideIcon
this.showLongName=showLongName}redrawCell(row,root){if(!root.firstElementChild)root.appendChild(JSX.createElement(UserRef,{class:"inline list","î":{reg:this.reg,user:row.rowDatas,withIcon:!this.hideIcon,showLongName:this.showLongName}}))
else root.firstElementChild.user=row.rowDatas}_getValue(row){return USER.getPrimaryName(row.rowDatas)}}export class CellBuilderAccount extends CellBuilderString{constructor(reg,dataKey,hideIcon=false,knownUsers){super(dataKey)
this.reg=reg
this.hideIcon=hideIcon
this.knownUsers=knownUsers
this.cacheKey=Symbol("CellBuilderAccount:"+dataKey)}async redrawCell(row,root){var _a
let cache=row.cacheHolder[this.cacheKey]
const cacheHolder=row.cacheHolder
const rowDatas=row.rowDatas
if(cache===undefined){let account
if(account=this.getAccount(row)){this.redrawCellUser(row,root)
cacheHolder[this.cacheKey]=cache=(_a=this.knownUsers)===null||_a===void 0?void 0:_a.find(entry=>entry.account===account)
if(!cacheHolder[this.cacheKey])cacheHolder[this.cacheKey]=cache=this.reg.env.universe.useUsers.getUserBatch(account).then(user=>{if(cacheHolder[this.cacheKey]!==cache)return
return cacheHolder[this.cacheKey]=user})}else{cache=cacheHolder[this.cacheKey]=null}}if(cache instanceof Promise){this.redrawCellUser(row,root)
root.findUserPending=cache
cache.then(()=>{if(root.findUserPending!==cache)return
root.findUserPending=null
this.redrawCellUser({cacheHolder:cacheHolder,rowDatas:rowDatas},root)})}else{root.findUserPending=null
this.redrawCellUser(row,root)}}redrawCellUser(row,root){const cache=row.cacheHolder[this.cacheKey]
if(!root.firstElementChild)root.appendChild(JSX.createElement(UserRef,{class:"inline list","î":{reg:this.reg,withIcon:!this.hideIcon}}))
if(!cache||cache instanceof Promise)root.firstElementChild.user=this.getAccount(row)?{account:this.getAccount(row),isUnknown:true}:null
else root.firstElementChild.user=cache}getAccount(row){return row.rowDatas[this.dataKey]}_getValue(row){return this.getAccount(row)||""}}export class CellBuilderAccounts extends CellBuilderString{constructor(reg,dataKey,hideIcon=false,canSort=true){super(dataKey)
this.reg=reg
this.hideIcon=hideIcon
this.canSort=canSort
this.cacheKey=Symbol("CellBuilderAccount:"+dataKey)}async redrawCell(row,root){var _a
let cache=row.cacheHolder[this.cacheKey]
const cacheHolder=row.cacheHolder
const rowDatas=row.rowDatas
if(cache===undefined){let account
if(account=row.rowDatas[this.dataKey]){this.redrawCellAccounts(row,root)
cacheHolder[this.cacheKey]=cache=[];(_a=this.getAccounts(row))===null||_a===void 0?void 0:_a.forEach(account=>{cache.push(this.reg.env.universe.useUsers.getUserBatch(account))})
Promise.all(cache).then(users=>{if(cacheHolder[this.cacheKey]!==cache)return
return cacheHolder[this.cacheKey]=users})}else{cache=cacheHolder[this.cacheKey]=null}}if((cache===null||cache===void 0?void 0:cache.findIndex(entry=>entry instanceof Promise))>-1){this.redrawCellAccounts(row,root)
root.findUsersPending=cache
Promise.all(cache).then(()=>{if(root.findUsersPending!==cache)return
root.findUsersPending=null
if(this.canSort)cacheHolder[this.cacheKey].sort((u1,u2)=>USER.getPrimaryName(u1).localeCompare(USER.getPrimaryName(u2)))
this.redrawCellUsers(cacheHolder[this.cacheKey],root)})}else{root.findUserPending=null
this.redrawCellUsers(cacheHolder[this.cacheKey],root)}}redrawCellUsers(users,root){let valuesTxt=[]
root.innerHTML=""
users===null||users===void 0?void 0:users.forEach(user=>{root.appendChild(JSX.createElement(UserRef,{class:"inline list","î":{reg:this.reg,user:user,withTitle:false,withIcon:!this.hideIcon}}))
if(user)valuesTxt.push(USER.getPrimaryName(user))})
DOM.setAttr(root,"title",valuesTxt.length>0?valuesTxt.join(", "):null)}redrawCellAccounts(row,root){var _a
const values=(_a=this.getAccounts(row))===null||_a===void 0?void 0:_a.join(", ")
DOM.setTextContent(root,values||"")
DOM.setAttr(root,"title",values)}getAccounts(row){return row.rowDatas[this.dataKey]}getColSortFn(){return undefined}}
//# sourceMappingURL=usersGrid.js.map