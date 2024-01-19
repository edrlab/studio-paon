import{Box,MsgOver}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX,ShadowJsx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{AccelKeyMgr,ACTION,Action,ActionWrapper}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{CellBuilderFlagIcon,CellBuilderIconLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{BaseAreaViewAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/dialogs_Perms.js"
import{GridColTreeDef,GridDataHolderJsonTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{Grid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{Tabs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tabs.js"
import{ROLES}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/roles.js"
import{InputUserPanel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/inputs.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{UserRef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/userRef.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
export class RolesExplorer extends BaseAreaViewAsync{async _initialize(init){if(!this.reg)this.reg=REG.createSubReg(this.findReg(init))
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
const areas=this.reg.mergeLists("rolesExplorer:tabs").filter(entry=>entry.isVisible(this))
const areasContext={reg:this.reg}
if(areas.length>1){this.views=sr.appendChild(JSX.createElement(Tabs,{id:"tabs","î":{reg:this.reg,areasContext:areasContext,areas:areas,skinOver:"rolesExplorer/tabs"}}))}else this.views=sr.appendChild(await areas[0].loadBody(areasContext))}}customElements.define("c-rolesexplorer",RolesExplorer)
REG.reg.registerSkin("c-rolesexplorer",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tflex-direction: column;\n\t\toverflow: hidden;\n\t}\n\n\tc-tabs {\n\t\tflex: 1;\n\t}\n`)
export class RolesExplorerTabBase extends BaseAreaViewAsync{async _initialize(init){this.params=init
if(!this.reg)this.reg=REG.createSubReg(this.findReg(init))
this.usersSrv=this.reg.env.universe.adminUsers
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("webzone:panel",sr)
this.reg.installSkin("form-control-areas",sr)
this.reg.installSkin("rolesexplorer-core",sr)
this.reg.installSkin("c-rolesexplorer-core-widgets",sr)
this._initAndInstallSkin(this.localName,init)
let contentElt=sr.appendChild(JSX.createElement("div",{id:"content","c-resizable":true}))
let gridContentElt=contentElt.appendChild(JSX.createElement("div",{id:"gridContent"}))
let headElt=gridContentElt.appendChild(JSX.createElement("div",{id:"head"}))
this.filterFormElt=headElt.appendChild(JSX.createElement("form",{id:"filter"}))
this.filterTxt=this.filterFormElt.appendChild(JSX.createElement("input",{type:"search",id:"filterTxt",name:"filterTxt",spellcheck:"false",autocomplete:"off",placeholder:this.params.filterTxtPlaceholder||"Filtrer...",oninput:this.onApplyFilter,onkeydown:this.onKeyPress}))
this.filterTxt.focus()
this.filterAccounts=this.filterFormElt.appendChild((new InputUserPanel).initialize(Object.assign({name:"filterAccounts",reg:this.reg,emptySelectionMsg:"Utilisateurs/groupes...",userCard:"single",usersGridInit:{usersSrv:this.usersSrv,filterType:null,filterTypeInputVisibility:true,normalizeList:(array,filterTxtRegExp)=>{var _a;(_a=this._lastUnknownUsers)===null||_a===void 0?void 0:_a.forEach(unknownUser=>{if((!filterTxtRegExp||unknownUser.account.match(filterTxtRegExp))&&!array.find(entry=>entry.account===unknownUser.account))array.push(unknownUser)
array.sort((a,b)=>a.account.localeCompare(b.account))})
return array}}},this.params.filterAccountsInputInit)))
await this.filterAccounts.initializedAsync
DOM.addClass(this.filterAccounts,"formElt")
this.filterAccounts.addEventListener("change",async evt=>{this.onApplyFilter.call(this.filterAccounts,evt)})
this.filterAccounts.title="Filtre utilisateurs/groupes"
this.razFilterBtn=this.filterFormElt.appendChild(ActionBtn.buildButton(actionRazFilters,this.actionContext,"bar"))
this.reg.addToList("actions:rolesexplorer:show:toolbar:top","actionRefreshUi",1,actionRefreshUi)
let toolbarsBox=contentElt.appendChild(JSX.createElement("div",{id:"toolbarsBox"}))
this.toolbarTop=toolbarsBox.appendChild((new BarActions).initialize({reg:this.reg,actions:ACTION.injectSepByGroup(this.reg.mergeLists("actions:rolesexplorer","actions:rolesexplorer:show:toolbar:top","actions:rolesexplorer:show:toolbar:top:"+this.id,"actions:rolesexplorer:"+this.id),this.reg.getPref("actions.rolesexplorer.groupOrder","refresh *"),this.actionContext),uiContext:"bar",actionContext:this.actionContext,disableFullOverlay:true}))
this.toolbarTop.setAttribute("class","showToolbarTop")
this.dataHolder=new GridDataHolderJsonTree("ch")
let accelKeyMgr=(new AccelKeyMgr).initFromMapActions(this.reg.mergeListsAsMap("accelkeys:rolesexplorer","accelkeys:rolesexplorer:"+this.id))
accelKeyMgr.initFromMapActions(this.reg.mergeListsAsMap("accelkeys:rolesexplorer","accelkeys:rolesexplorer:"+this.id))
this.grid=gridContentElt.appendChild((new Grid).initialize(Object.assign(init.gridInit||{},{selType:"mono",hideHeaders:false,columnDefs:this.colsDefBase(),skinOver:`rolesexplorer-core-tree c-rolesexplorer-core-widgets ${this.localName}-tree`,skinScroll:"scroll/small",lineDrawer:this,autoSelOnFocus:"first",dataHolder:this.dataHolder,hideSortBtns:true,noResizableCol:true,emptyBody:()=>JSX.createElement("c-msg",null,"Tous les rôles affectés ont été filtrés")})))
this.grid.addEventListener("grid-select",async ev=>{this.toolbarTop.refreshContent()
await this.showDetails(this.dataHolder.getSelectedDatas())})
this.grid.uiEvents.on("rowDblclick",(row,ev)=>{if((row===null||row===void 0?void 0:row.rowDatas).account){this.filterAccounts.value=[row.rowDatas.account]
this.refreshUi()}})
new MutationObserver(entries=>{for(const entry of entries){if(entry.type=="attributes"&&entry.attributeName=="data-roles-disabled"){this.refreshUi()}}}).observe(this.grid,{attributes:true})
sr.appendChild(JSX.createElement("c-resizer",null))
this._detailsBoxElt=sr.appendChild(JSX.createElement("div",{id:"details","c-resizable":true,hidden:true}))
this.razFilters()
return this.refresh()}get actionContext(){return{rolesExplorer:this}}async _refresh(){this.refreshFreeze(1)
try{super._refresh()
await this.refreshUi(true)}finally{this.refreshFreeze(-1)}}async refreshUi(withFetchDatas=false){var _a,_b,_c
const selectedRows=this.dataHolder.getSelectedDatas()
if(withFetchDatas||!this._lastFetchDatas){this._lastFetchDatas=await(new MsgOver).setCustomMsg("Veuillez patienter...","info").showMsgOver(this).waitFor(this.doFetchDatas())
Object.freeze(this._lastFetchDatas)
this._lastUnknownUsers=new Set
const roles=new Set
const findRolesIn=level=>{if(level){level.forEach(entry=>{var _a,_b;(_a=entry.denied)===null||_a===void 0?void 0:_a.forEach(role=>roles.add(role));(_b=entry.allowed)===null||_b===void 0?void 0:_b.forEach(role=>roles.add(role))
if(entry.userUnknown)this._lastUnknownUsers.add({account:entry.account,isUnknown:true})
findRolesIn(entry.ch)})}}
findRolesIn(this._lastFetchDatas)
this.dataHolder.setDatas([])
await this.updateRolesColsDef(roles)}const filterTxt=this.filterTxt.value
const filterTxtPattern=filterTxt?new RegExp(LANG.escape4RegexpFuzzy(filterTxt),"i"):null
let filterAccountsExtended
if(this.filterAccounts.value.length){const users=await this.usersSrv.getUserMap(this.filterAccounts.value,["flattenedGroups"])
filterAccountsExtended=new Set
for(const account in users){filterAccountsExtended.add(account);(_b=(_a=users[account])===null||_a===void 0?void 0:_a.flattenedGroups)===null||_b===void 0?void 0:_b.forEach(grp=>filterAccountsExtended.add(grp))}}const disabledRoles=(_c=this.grid.getAttribute("data-roles-disabled"))===null||_c===void 0?void 0:_c.split(" ").filter(entry=>entry?true:false)
let filterRolesWhiteList
if(disabledRoles===null||disabledRoles===void 0?void 0:disabledRoles.length){filterRolesWhiteList=new Set
this.grid.columnDefs.forEach(col=>{if(col instanceof GridColDefRole){if(disabledRoles.indexOf(col.roleDef.role)==-1)filterRolesWhiteList.add(col.roleDef.role)}})}this.grid.shadowRoot.querySelectorAll("#headers > .colH[data-role]").forEach(elt=>{const role=elt.getAttribute("data-role")
DOM.setAttrBool(elt,"disabled",disabledRoles?disabledRoles.indexOf(role)!=-1:false)})
const vWithFilter=filterTxt||(filterAccountsExtended===null||filterAccountsExtended===void 0?void 0:filterAccountsExtended.size)||(filterRolesWhiteList===null||filterRolesWhiteList===void 0?void 0:filterRolesWhiteList.size)?true:false
this.grid.classList.toggle("filtered",vWithFilter)
if(vWithFilter){let filteredDatas=this.filterTreeDataHolderChiltren(JSON.parse(JSON.stringify(this._lastFetchDatas)),filterTxtPattern,filterAccountsExtended,filterRolesWhiteList)
this.dataHolder.setDefaultOpenState(GridDataHolderJsonTree.defaultOpened)
this.dataHolder.setDatas(filteredDatas)}else{this.dataHolder.setDefaultOpenState(GridDataHolderJsonTree.defaultOpened)
this.dataHolder.setDatas(this._lastFetchDatas)}this.selectTreeByDatas(selectedRows,true)
this.toolbarTop.refreshContent()
this.razFilterBtn.refresh()}razFilters(){this.filterTxt.value=this.params.filterTxt||""
this.filterAccounts.value=this.params.filterAccounts||[]
this.grid.removeAttribute("data-roles-disabled")
this.refresh()}get isFiltered(){return this.grid?this.grid.classList.contains("filtered"):false}selectTreeByDatas(treeDataEntries,ensureRowVisible=false){if(treeDataEntries!=null){const selectedRows=[]
for(let i=0,c=this.dataHolder.countRows();i<c;i++){const row=this.dataHolder.getRow(i).rowDatas
if(row&&treeDataEntries.find(entry=>entry&&entry.uid==row.uid)){selectedRows.push(i)}}if(selectedRows.length>0){this.grid.setSelectedRows(selectedRows)
if(ensureRowVisible)this.grid.ensureRowVisible(selectedRows[0])}else this.grid.clearSel()}}rolesUiHandlers(){return Promise.all(this.reg.mergeLists(ROLES.UI_ROLES_LIST))}static isRolesUiHandlerUsableFor(roleUiHandler,entry){var _a
if(((_a=roleUiHandler===null||roleUiHandler===void 0?void 0:roleUiHandler.whiteListLevelsUid)===null||_a===void 0?void 0:_a.length)&&entry.uid)return roleUiHandler.whiteListLevelsUid.find(white=>entry.uid.startsWith(white))?true:false
return true}colsDefBase(){return[new GridColTreeDef("tree").setFlex("20rem",1,1).setMinWidth("20rem").setLabel("").setCellBuilder(new CellBuilderMainRoleLevelEntry(this.reg,"title"))]}async updateRolesColsDef(usedRoles){const colsDef=this.colsDefBase()
let roleUiCtx={reg:this.reg}
const rolesUiHandlers=await this.rolesUiHandlers()
let resultRoles=await ROLES.resolveRolesList(Array.from(usedRoles),roleUiCtx,rolesUiHandlers)
resultRoles.forEach(entry=>{colsDef.push(new GridColDefRole(entry,rolesUiHandlers.find(roleUi=>roleUi.roleCode===entry.role)))})
this.grid.columnDefs=colsDef}onKeyPress(ev){if(ev.key==="ArrowDown"){const tree=DOMSH.findHost(this)
if(tree.grid.getSelectedRow()!==undefined)tree.grid.focus()}}onApplyFilter(ev){const me=DOMSH.findHost(this)
if(me._applyFilterWaiter)clearTimeout(me._applyFilterWaiter)
me._applyFilterWaiter=setTimeout(()=>me.refreshUi(false),200)}filterTreeDataHolderChiltren(ch,filterTxtPattern,filterAccountsExtended,filterRolesWhiteList){if(!filterTxtPattern&&!(filterAccountsExtended===null||filterAccountsExtended===void 0?void 0:filterAccountsExtended.size)&&!(filterRolesWhiteList===null||filterRolesWhiteList===void 0?void 0:filterRolesWhiteList.size))return ch
return ch===null||ch===void 0?void 0:ch.filter(entry=>{var _a,_b,_c,_d
const filterTxtPatternMatch=filterTxtPattern===null||filterTxtPattern===void 0?void 0:filterTxtPattern.test(entry.title)
if(entry.ch)entry.ch=this.filterTreeDataHolderChiltren(entry.ch,filterTxtPatternMatch?null:filterTxtPattern,filterAccountsExtended,filterRolesWhiteList)
if("title"in entry){if(filterTxtPattern){if(filterTxtPatternMatch)return true
else if((_a=entry.ch)===null||_a===void 0?void 0:_a.find(entry=>"structLevel"in entry&&entry.structLevel!="roles"))return true}else if((_b=entry.ch)===null||_b===void 0?void 0:_b.length)return true}else if("account"in entry){if(!(filterAccountsExtended===null||filterAccountsExtended===void 0?void 0:filterAccountsExtended.size)&&!(filterRolesWhiteList===null||filterRolesWhiteList===void 0?void 0:filterRolesWhiteList.size))return true
if((filterAccountsExtended===null||filterAccountsExtended===void 0?void 0:filterAccountsExtended.size)&&!filterAccountsExtended.has(entry.account))return false
if(filterRolesWhiteList===null||filterRolesWhiteList===void 0?void 0:filterRolesWhiteList.size){if(!(((_c=entry.denied)===null||_c===void 0?void 0:_c.find(entry=>filterRolesWhiteList.has(entry)))||((_d=entry.allowed)===null||_d===void 0?void 0:_d.find(entry=>filterRolesWhiteList.has(entry)))))return false}return true}else return true})}redrawLine(row,line){DOM.setAttr(line,"data-struct-level",row.rowDatas.structLevel)
DOM.setAttrBool(line,"data-account",row.rowDatas.account?true:false)}async showDetails(row){if(row===null||row.length==0){DOM.setHidden(this._detailsBoxElt,true)
return false}else if(row.length==1){this._detailsBoxElt.innerHTML=""
const result=await(new MsgOver).setCustomMsg("Veuillez patienter...","info").showMsgOver(this._detailsBoxElt).waitFor(this.buildRowDetails(row[0]))
if(this._detailsBoxElt.innerHTML!="")return
this._detailsBoxElt.appendChild(JSX.createElement(Box,{skinOver:`webzone:page c-rolesexplorer-core-widgets rolesexplorer-core-details ${this.localName}-details`},JSX.createElement(ShadowJsx,null,result)))
DOM.setHidden(this._detailsBoxElt,!result)}}}REG.reg.registerSkin("rolesexplorer-core",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tflex-direction: column;\n\t\toverflow: hidden;\n\t}\n\n\t#toolbarsBox {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t}\n\n\tc-bar-actions.showToolbarTop {\n\t  flex: 1;\n  }\n\n  c-bar-actions.showToolbarTop {\n\t  flex-direction: column;\n\t  border-inline-start: 1px solid var(--border-color);\n  }\n\n  #filter {\n\t  background: .1em / 1em no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/filter.svg);\n\t  padding-block: 2px;\n\t  padding-inline: 1.2em 2px;\n\t  display: flex;\n\t  min-width: 0;\n\t  min-height: 0;\n\t  align-items: center;\n\t  overflow: hidden;\n\t  flex-wrap: wrap;\n  }\n\n  #filter > * {\n\t  margin-block: 0;\n\t  margin-inline: .3rem 0;\n  }\n\n  #filter > select {\n\t  border: none;\n  }\n\n  #filter > input {\n\t  min-width: 10em;\n\t  background-color: var(--form-search-bgcolor);\n  }\n\n  #filter > input:placeholder-shown {\n\t  font-style: italic;\n  }\n\n\tc-input-users-panel {\n\t  min-width: 12rem;\n\t  background-color: var(--form-search-bgcolor);\n  }\n\n  #content {\n\t  display: flex;\n\t  flex: 1;\n\t  overflow: auto;\n\t  min-height: 30%\n  }\n\n  #gridContent {\n\t  display: flex;\n\t  flex: 1;\n\t  flex-direction: column;\n  }\n\n  c-grid {\n\t  flex: 1;\n\t  overflow: auto;\n\t  border: none;\n  }\n\n  c-resizer {\n\t  pointer-events: auto;\n\t  cursor: ns-resize;\n\t  height: 3px;\n  }\n\n  #details {\n\t  display: flex;\n\t  flex: .3;\n\t  flex-direction: column;\n\t  overflow: auto;\n\t  min-height: 5em;\n  }\n\n  #details[hidden] {\n\t  display: none;\n  }\n\n  #details > c-box {\n\t  flex: 1;\n  }\n\n\n`)
REG.reg.registerSkin("c-rolesexplorer-core-widgets",1,`\n\n\t.roleName {\n\t\tdisplay: inline-flex;\n\t\tfont-variant: small-caps;\n\t\t/*color:var(--alt1-color);*/\n\t}\n\n\t.roleName.role-unknown {\n\t\ttext-decoration: line-through;\n\t}\n\n\t.roleName.role-inherited {\n\t\tfont-style: italic;\n\t}\n\n`)
REG.reg.registerSkin("rolesexplorer-core-tree",1,`\n\t:host {\n\t\t/*--roles-struct-level-roles: url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/builder/widgets/moan-info.svg');*/\n\t}\n\n\t#scroll {\n\t\t/* Permet d'éviter les sauts lors des filtes*/\n\t\toverflow-y: scroll;\n\t}\n\n\t/** Ligne d'entete */\n\t.colH {\n\t\tmax-height: unset;\n\t}\n\n\t/*.colH[data-role-group] > c-button {\n\t\tborder-block-start: 2px var(--alt1-color);\n\t\tborder-block-start-style: outset;\n\t}*/\n\n\t.colH[data-role-group] {\n\t\tflex-direction: column;\n  }\n\n  .colH[data-role-group] > .grp {\n\t  font-size: xx-small;\n\t  color: var(--inv-color);\n\t  overflow: hidden;\n\t  text-overflow: ellipsis;\n\t  white-space: nowrap;\n\t  padding: 2px;\n\t  font-family: sans-serif;\n\t  border-radius: 4px;\n\t  text-align: center;\n\t  opacity: 0.7;\n  }\n\n  .colH:not([data-role-group]) {\n\t  padding-block-start: 1rem;\n  }\n\n  .colH[data-role] > c-button {\n\t  padding-inline-end: 1rem;\n\t  margin-inline-start: 0.3rem;\n\t  background: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/checkbox-checked.svg) no-repeat right .4rem;\n\t  background-size: .8rem;\n\t  align-items: start;\n\t  /*\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n\t\t*/\n\n  }\n\n  .colH[data-role][disabled] > c-button {\n\t  background-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/checkbox-unchecked.svg);\n  }\n\n  .cell.role[disabled],\n  .colH[data-role][disabled] {\n\t  background-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/filtered.svg);\n  }\n\n  .line > .cell.role[unusedForLevel] {\n\t  background-color: #55555566;\n\t  filter: var(--inv-active-filter);\n  }\n\n  /** Ligne "Account" */\n  div[data-account] > .cell {\n\t  padding: 0px 1px;\n  }\n\n  div[data-account] > .cell:first-child > x-twisty {\n\t  padding-inline-start: .5rem;\n  }\n\n  div[data-account] > .cell:first-child > span {\n\t  border-inline-start: 1px solid var(--border-color);\n\t  font-size: smaller;\n\t  padding-inline-start: 0.5em;\n  }\n\n  /** Ligne "Level" */\n  div:not([data-struct-level='roles']) + div[data-struct-level]:not([data-struct-level='roles']) {\n\t  margin-block-start: .5rem;\n  }\n\n  /** Ligne "Rôles affectés" */\n  div[data-struct-level='roles'] > .cell {\n\t  padding: 0px 1px;\n  }\n\n  div[data-struct-level='roles'] > .cell:first-child > span {\n\t  font-style: italic;\n\t  font-size: x-small;\n  }\n\n  div[data-struct-level='roles'] > .cell:first-child > x-twisty.opened {\n\t  background-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/grid/opened.svg);\n\t  background-position-x: center;\n  }\n\n  div[data-struct-level='roles'] > .cell:first-child .icon {\n\t  padding-inline-start: unset !important;\n  }\n\n  /** Cellule de rôle */\n  .role {\n\t  text-align: center;\n  }\n\n  .role > .icon {\n\t  padding-inline-start: calc(var(--icon-size) * .8) !important;\n  }\n\n  *[hidden] {\n\t  display: none;\n  }\n`)
REG.reg.registerSkin("rolesexplorer-core-details",1,`\n\tc-bar-actions {\n\t\tflex-direction: row;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\t/** Details */\n\t.header {\n\t\tpadding: 0.3em;\n\t\tfont-weight: bold;\n\t}\n\n\t.resolvedRoles {\n\t\ttext-align: center;\n\t\tmargin-inline: 10%;\n\t\tmargin-block: 0.5em;\n\t\tborder: 2px dotted var(--alt2-border-color);\n\t}\n\n\tc-userref {\n\t\tdisplay: inline-flex;\n\t\tmargin: 0.2em;\n\t\tpadding: 0.1em;\n\t\tborder: 1px dotted var(--border-color);\n\t\tborder-radius: 0.4em;\n\t\tbackground-color: var(--alt2-bgcolor);\n\t\tcolor: unset;\n\t\tfont-size: smaller;\n\t}\n\n\tc-input-users-panel {\n\t\tdisplay: inline-flex;\n\t}\n\n`)
class GridColDefRole extends GridColDef{constructor(roleDef,roleUiHandler){super(roleDef.role)
this.roleDef=roleDef
this.setLabel(roleDef.name||roleDef.role)
this.setDescription(roleDef.name||roleDef.role)
this.setCellBuilder(new CellBuilderRole(roleDef.role,roleUiHandler))
this.setFlex("2rem",1,1)
this.setMaxWidth("15rem")}isFlagDisabledCol(root){var _a
const grid=DOMSH.findHost(root)
const gridDisabledRoles=new Set((_a=grid.getAttribute("data-roles-disabled"))===null||_a===void 0?void 0:_a.split(" "))
return gridDisabledRoles.has(this.roleDef.role)}hasOtherFlagDisabledCol(root){var _a
const grid=DOMSH.findHost(root)
const gridDisabledRoles=new Set((_a=grid.getAttribute("data-roles-disabled"))===null||_a===void 0?void 0:_a.split(" "))
const headerDiv=root.parentElement
if(Array.from(headerDiv.childNodes).find(cell=>{const role=cell.getAttribute("data-role")
if(role&&role!=this.roleDef.role){if(gridDisabledRoles.has(role))return true}}))return true}setFlagDisabledCol(root,forcedDisabled="toogle",forcedDisabledOnOtherCols){var _a
const grid=DOMSH.findHost(root)
const gridDisabledRoles=new Set((_a=grid.getAttribute("data-roles-disabled"))===null||_a===void 0?void 0:_a.split(" "))
const cellNewSateIsDisabled=forcedDisabled=="toogle"?!this.isFlagDisabledCol(root):forcedDisabled
if(cellNewSateIsDisabled)gridDisabledRoles.add(this.roleDef.role)
else gridDisabledRoles.delete(this.roleDef.role)
if(forcedDisabledOnOtherCols!=null){const headerDiv=root.parentElement
headerDiv.childNodes.forEach(cell=>{const role=cell.getAttribute("data-role")
if(role&&role!=this.roleDef.role){if(forcedDisabledOnOtherCols=="toogle")forcedDisabledOnOtherCols=!cellNewSateIsDisabled
if(forcedDisabledOnOtherCols)gridDisabledRoles.add(role)
else gridDisabledRoles.delete(role)}})}DOM.setAttr(grid,"data-roles-disabled",Array.from(gridDisabledRoles).join(" "))}buildColHeader(col,root){var _a
const gridDisabledRoles=new Set((_a=col.grid.getAttribute("data-roles-disabled"))===null||_a===void 0?void 0:_a.split(" "))
DOM.setAttrBool(root,"disabled",gridDisabledRoles===null||gridDisabledRoles===void 0?void 0:gridDisabledRoles.has(this.roleDef.role))
col.rootHeader=root
DOM.setAttr(root,"data-role",this.roleDef.role)
const roleGrp=ROLES.extractGroupFromRole(this.roleDef.role)
let title=`Rôle : ${this.roleDef.name}`
if(roleGrp){const grpDef=ROLES.findGroupDef(roleGrp)
title=`Groupe exclusif : ${grpDef.label}\n${title}`
DOM.setAttr(root,"data-role-group",roleGrp)
const grpElt=root.appendChild(JSX.createElement("div",{class:"grp"},grpDef.label?grpDef.label:""))
if(grpDef.color)grpElt.style.backgroundColor=grpDef.color}const btn=root.appendChild(JSX.createElement("c-button",{class:"colBody roleName",label:this.getLabel(col),"ui-context":"custom",onclick:ev=>{if(ev.ctrlKey)this.setFlagDisabledCol(root,false)
else{if(!this.isFlagDisabledCol(root)&&this.hasOtherFlagDisabledCol(root))this.setFlagDisabledCol(root,false,false)
else this.setFlagDisabledCol(root,false,true)}ev.stopPropagation()}}))
root.title=title}}class CellBuilderRole extends CellBuilderFlagIcon{constructor(role,roleUiHandler){super(role)
this.role=role
this.roleUiHandler=roleUiHandler}redrawCell(row,root){var _a
const grid=DOMSH.findHost(root)
super.redrawCell(row,root)
DOM.addClass(root,"role")
DOM.setAttrBool(root,"disabled",((_a=grid.getAttribute("data-roles-disabled"))===null||_a===void 0?void 0:_a.split(" ").indexOf(this.role))>-1)
const isRolesUiHandlerUsable=RolesExplorerTabBase.isRolesUiHandlerUsableFor(this.roleUiHandler,row.rowDatas)
DOM.setAttrBool(root,"unusedForLevel",!isRolesUiHandlerUsable)
root.title=!isRolesUiHandlerUsable?"Rôle non exploité sur ce niveau":""}_getValue(row){var _a,_b
if(this.role){if(((_a=row.rowDatas.denied)===null||_a===void 0?void 0:_a.indexOf(this.role))>-1)return"Rôle retiré"
if(((_b=row.rowDatas.allowed)===null||_b===void 0?void 0:_b.indexOf(this.role))>-1)return"Rôle affecté"}return""}_getIcon(row){var _a,_b
if(this.role){if(((_a=row.rowDatas.denied)===null||_a===void 0?void 0:_a.indexOf(this.role))>-1)return"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/dialogs/rolesExplorer/removed.svg"
if(((_b=row.rowDatas.allowed)===null||_b===void 0?void 0:_b.indexOf(this.role))>-1)return"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/dialogs/rolesExplorer/added.svg"
return""}}}class CellBuilderMainRoleLevelEntry extends CellBuilderIconLabel{constructor(reg,dataKey){super(dataKey)
this.reg=reg
this.iconWidth="1.3rem"}_getIcon(row){if("structLevel"in row.rowDatas)return`--roles-struct-level-${row.rowDatas.structLevel}`}redrawCell(row,root){super.redrawCell(row,root)
const span=root.firstElementChild
let userRef=span.nextElementSibling
if("account"in row.rowDatas){if(!userRef)userRef=root.appendChild(JSX.createElement(UserRef,{class:"inline list","î":{reg:this.reg,withIcon:true,skinOver:"rolesExplorer/userRef"}}))
userRef.nickOrAccount=row.getData("account")
DOM.setHidden(userRef,false)
DOM.setHidden(span,true)}else{if(userRef)DOM.setHidden(userRef,true)
DOM.setHidden(span,false)}}}REG.reg.registerSkin("rolesExplorer/userRef",1,`\n\t:host([data-withIcon]) span {\n\t\tbackground-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/dialogs/rolesExplorer/user.svg);\n\t\tbackground-size: auto 1rem;\n\t}\n\n\t:host([data-isGroup][data-withIcon]) span {\n\t\tbackground-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/dialogs/rolesExplorer/group.svg);\n\t}\n`)
const actionRazFilters=new Action("razFilters").setLabel("Réinitialiser les filtres").setGroup("filters").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/reset-filter.svg").setEnabled(ctx=>ctx.rolesExplorer.isFiltered).setExecute((ctx,ev)=>{ctx.rolesExplorer.razFilters()})
const actionRefreshUi=new Action("refreshUi").setLabel("Rafraichir la liste des rôles").setGroup("reload").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/refresh.svg").setExecute((ctx,ev)=>{ctx.rolesExplorer.refresh()})
export class ActionWrapperRefresRolesExplorer extends ActionWrapper{isEnabled(ctx){return super.isEnabled(ctx)}async execute(ctx,ev){let result=await super.execute(ctx,ev)
await ctx.rolesExplorer.refresh()
return result}}
//# sourceMappingURL=rolesExplorer.js.map