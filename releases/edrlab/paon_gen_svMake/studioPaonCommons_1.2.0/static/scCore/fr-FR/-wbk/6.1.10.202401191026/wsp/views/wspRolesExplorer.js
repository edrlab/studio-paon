import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/dialogs_Perms.js"
import{ActionWrapperRefresRolesExplorer,RolesExplorerTabBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/rolesExplorer.js"
import{Wsp,WSP,WSPMETA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{InputUserPanel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/inputs.js"
import{EUserAspects}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
import{UserRef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/userRef.js"
import{ROLES}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/roles.js"
import{SetPermsSpace}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{OpenPermsWspAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/wspActions.js"
import{OpenGroupsMgr,OpenUsersMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/plugins/usersPlg.js"
import{MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
export class WspRolesExplorerTab extends RolesExplorerTabBase{constructor(){super()
this.wspMap=new Map
this.id="wsp"}async _initialize(init){if(!("filterTxtPlaceholder"in init))init.filterTxtPlaceholder="Ateliers/espaces..."
await super._initialize(init)}async rolesUiHandlers(){let uiHandlers=await Promise.all(this.reg.mergeLists(ROLES.UI_ROLES_LIST))
await Promise.all(Array.from(this.wspMap.values()).map(async wsp=>{const list=await Promise.all(wsp.reg.mergeLists(ROLES.UI_ROLES_LIST))
list.forEach(uiHandler=>{const declaredUiHandler=uiHandlers.find(test=>test.roleCode===uiHandler.roleCode)
if(declaredUiHandler){if(declaredUiHandler.whiteListLevelsUid)declaredUiHandler.whiteListLevelsUid.push(wsp.code)}else{uiHandler.whiteListLevelsUid=[wsp.code]
uiHandlers.push(uiHandler)}})}))
return uiHandlers}async doFetchDatas(){const assignedRoles=await WSP.fetchExportAssignedRoles(this.reg.env.universe.wspServer,{fields:["srcRoles","srcRi"]})
function filterWspLine(wspLine){var _a,_b
return((_a=wspLine.nodes)===null||_a===void 0?void 0:_a.roles)||((_b=wspLine.nodes)===null||_b===void 0?void 0:_b.ch)?true:false}const root=[]
function injectRoles(target,from,fullUri,title="Rôles affectés"){if(from.roles){const rolesArray=Object.entries(from.roles)
const structRolesLevel=rolesArray.length>=WspRolesExplorerTab.EXTENDED_ROLES_GAP?{structLevel:"roles",title:title,ch:[],uid:`${fullUri}@`}:null
for(const[account,value]of rolesArray){const entryFullUri=`${fullUri}@${account}`
const accountEntry={account:account,uid:entryFullUri}
if(value.allowed)accountEntry.allowed=value.allowed
if(value.denied)accountEntry.denied=value.denied
if(value.userUnknown)accountEntry.userUnknown=true
if(structRolesLevel)structRolesLevel.ch.push(accountEntry)
else target.push(accountEntry)}if(structRolesLevel)target.push(structRolesLevel)}}function injectChildren(target,from,fullUri){if(from){for(const entry of from){const entryFullUri=`${fullUri}/${entry.name}`
const structLevel={structLevel:"space",title:entry.name,uid:entryFullUri,ch:[]}
injectRoles(structLevel.ch,entry,entryFullUri)
injectChildren(structLevel.ch,entry.ch,entryFullUri)
target.push(structLevel)}}}const repoLevel={structLevel:"repo",title:"Entrepôt",ch:[],uid:""}
root.push(repoLevel)
injectRoles(repoLevel.ch,assignedRoles,"","Rôles affectés sur l\'entrepôt")
if(assignedRoles.wsps){const wspMetasCache=new WSPMETA.WspMetasCache(this.reg.env.universe.wspServer)
for(const[wspCode,value]of Object.entries(assignedRoles.wsps)){if(filterWspLine(value))wspMetasCache.fetchWspMetaUi(wspMetasCache.atomWspTypeInst(value.infoWsp))}await wspMetasCache.waitForAll()
for(const[wspCode,value]of Object.entries(assignedRoles.wsps)){if(filterWspLine(value)){const wspMetaUi=wspMetasCache.getWspMetaUi(value.infoWsp)
this.wspMap.set(wspCode,new Wsp(this.reg.env.universe.wspServer,wspCode,value.infoWsp,wspMetaUi))
const structLevel={structLevel:"wsp",title:value.title||wspCode,uid:wspCode,wspCode:wspCode,ch:[]}
injectRoles(structLevel.ch,value.nodes,wspCode)
injectChildren(structLevel.ch,value.nodes.ch,wspCode)
repoLevel.ch.push(structLevel)}}}return root}async buildRowDetails(row){if(row){const inElt=JSX.createElement("div",null)
const account=row.account
let wspCode
let wspTitle
let srcUri
let parentStructLevel="account"in row?this.dataHolder.parent(row):row
while(parentStructLevel){if(parentStructLevel.structLevel==="space"){srcUri=parentStructLevel.title+(srcUri?`/${srcUri}`:"")
parentStructLevel=this.dataHolder.parent(parentStructLevel)}else{if(parentStructLevel.structLevel==="wsp"){wspCode=parentStructLevel.wspCode
wspTitle=parentStructLevel.title}break}}if(srcUri)srcUri=`/${srcUri}`
let wsp=this.wspMap.get(wspCode)
const accountWidget=(new InputUserPanel).initialize({name:"filterAccounts",reg:this.reg,emptySelectionMsg:"Sélectionner un utilisateur/groupe...",required:true,userCard:"single",hideRemButton:true,usersGridInit:{usersSrv:this.usersSrv,filterType:null,filterTypeInputVisibility:true}})
await accountWidget.initializedAsync
DOM.addClass(accountWidget,"formElt")
if(account)accountWidget.value=[account]
else if(this.filterAccounts.value)accountWidget.value=this.filterAccounts.value
let detailsBarActions
if(wspCode&&!wsp){const wspTitle=wspCode
inElt.appendChild((new MsgLabel).initialize({reg:this.reg,label:`Atelier \'${wspTitle}\' non disponible`,level:"error"}))
return inElt}if(srcUri){const node=await WSP.fetchShortDescTree(wsp,this,srcUri)
detailsBarActions=inElt.appendChild((new BarActions).initialize({reg:wsp.reg,actions:[(new ActionWrapperRefresRolesExplorer).setOverridenSvc(new SetPermsSpace)],actionContext:{rolesExplorer:this,reg:wsp.reg,emitter:this,shortDescs:[node],preSelectAccounts:account?[account]:null},uiContext:"bar",disableFullOverlay:true}))
inElt.appendChild(JSX.createElement("div",{class:"header"},"Rôles résolus de ",accountWidget," sur l\'espace ",JSX.createElement("span",{class:"refUri"},"'",srcUri,"'")," de l\'atelier ",JSX.createElement("span",{class:"refWsp"},"'",wsp.wspTitle,"'")," :"))}else if(wsp){detailsBarActions=inElt.appendChild((new BarActions).initialize({reg:wsp.reg,actions:[(new ActionWrapperRefresRolesExplorer).setOverridenSvc(OpenPermsWspAction.SINGLETON)],actionContext:{rolesExplorer:this,reg:wsp.reg,preSelectAccounts:account?[account]:null},uiContext:"bar",disableFullOverlay:true}))
inElt.appendChild(JSX.createElement("div",{class:"header"},"Rôles résolus de ",accountWidget," sur l\'atelier ",JSX.createElement("span",{class:"refWsp"},"'",wsp.wspTitle,"'")," :"))}else{detailsBarActions=inElt.appendChild((new BarActions).initialize({reg:this.reg,actions:[(new ActionWrapperRefresRolesExplorer).setOverridenSvc(new OpenUsersMgr),(new ActionWrapperRefresRolesExplorer).setOverridenSvc(new OpenGroupsMgr)],actionContext:{rolesExplorer:this,reg:this.reg,preSelectAccount:account},uiContext:"bar",disableFullOverlay:true}))
inElt.appendChild(JSX.createElement("div",{class:"header"},"Rôles résolus de ",accountWidget," sur l\'entrepôt :"))}const computedRolesBox=inElt.appendChild(JSX.createElement("div",{class:"computedRoles"}))
accountWidget.addEventListener("change",async evt=>{if(accountWidget.value)this.showComputedRolesFor(accountWidget.value[0],computedRolesBox,wsp,srcUri)})
if(accountWidget.value)await this.showComputedRolesFor(accountWidget.value[0],computedRolesBox,wsp,srcUri)
return inElt}}async showComputedRolesFor(account,inElt,wsp,srcUri){var _a,_b
inElt.innerHTML=""
if(!account)return
let rolesElt
const detailsUl=JSX.createElement("ul",null)
let resultRoles
if(wsp){if(inElt.innerHTML!=="")return
const rolesForAccounts=await WSP.srcGetRolesForAccounts(wsp,this,srcUri||"",[account])
if(inElt.innerHTML!=="")return
let roleUiCtx={reg:this.reg,grantedRoles:rolesForAccounts[account].allowedRoles,refusedRoles:rolesForAccounts[account].deniedRoles,inheritedRoles:rolesForAccounts[account].inheritedRoles}
let roles=ROLES.resolveUserRoles(roleUiCtx)
resultRoles=await ROLES.resolveRolesList(roles,roleUiCtx,await Promise.all(wsp.reg.mergeLists(ROLES.UI_ROLES_LIST)))
if(inElt.innerHTML!=="")return}else{const rolesForAccounts=await this.reg.env.universe.adminUsers.getUserMap([account])
let roleUiCtx={reg:this.reg,grantedRoles:rolesForAccounts[account].grantedRoles,refusedRoles:rolesForAccounts[account].refusedRoles,inheritedRoles:rolesForAccounts[account].inheritedRoles}
let roles=ROLES.resolveUserRoles(roleUiCtx)
resultRoles=await ROLES.resolveRolesList(roles,roleUiCtx,await this.rolesUiHandlers())
if(inElt.innerHTML!=="")return}if(resultRoles===null||resultRoles===void 0?void 0:resultRoles.length){rolesElt=JSX.createElement("div",{class:"resolvedRoles",title:"La résolution des rôles tient compte de la hiérarchie et des groupes d\'appartenance"})
resultRoles.forEach((role,pos)=>{if(pos>0)rolesElt.appendChild(JSX.createElement("span",{class:"spacer"},", "))
const entry=rolesElt.appendChild(JSX.createElement("span",{class:`roleName role-${role.level}`},role.name))
let roleName=role.name
switch(role.level){case"inherited":entry.title="affectation issue d\'un autre niveau ou d\'un groupe"
break
case"unknown":entry.title="rôle inconnu"
break}})}if(this.usersSrv.hasAspect(EUserAspects.groupable)){const users=await this.usersSrv.getUserMap([account],["flattenedGroups"])
if(inElt.innerHTML!=="")return
const flattenedGroups=(_b=(_a=users[account])===null||_a===void 0?void 0:_a.flattenedGroups)===null||_b===void 0?void 0:_b.reverse()
flattenedGroups===null||flattenedGroups===void 0?void 0:flattenedGroups.shift()
if(flattenedGroups===null||flattenedGroups===void 0?void 0:flattenedGroups.length){let li=detailsUl.appendChild(JSX.createElement("li",null,JSX.createElement("span",{class:"title"},"Groupes d\'appartenance : ")))
flattenedGroups.forEach((grp,pos)=>{if(pos>0)li.appendChild(JSX.createElement("span",{class:"spacer"}," > "))
li.appendChild(JSX.createElement(UserRef,{"î":{reg:this.reg,nickOrAccount:grp,withIcon:true}}))})}}inElt.appendChild(rolesElt)
inElt.appendChild(detailsUl)}}WspRolesExplorerTab.EXTENDED_ROLES_GAP=10
customElements.define("c-rolesexplorer-wsp",WspRolesExplorerTab)
REG.reg.registerSkin("c-rolesexplorer-wsp",1,`\n\t#details .spacer {\n\t\tcolor: var(--alt2-color);\n\t\tfont-weight: bold;\n\t\tfont-size: larger;\n\t}\n\n\n\t#details .refUri:before, #details .refWsp:before,\n\t#details .refUri:after, #details .refWsp:after {\n\t\tcontent: "'";\n\t}\n`)
REG.reg.registerSkin("c-rolesexplorer-wsp-tree",1,`\n\t:host {\n\t\t--roles-struct-level-wsp: url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/wspRolesExplorer/wsp.svg');\n\t\t--roles-struct-level-space: url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/wspRolesExplorer/space.svg');\n\t}\n\n\tdiv[data-struct-level='repo'],\n\tdiv[data-struct-level='wsp'] {\n\t\tfont-variant: small-caps;\n\t\tbackground-color: var(--inv-bgcolor);\n\t\tcolor: var(--inv-color);\n\t}\n\n\tdiv[data-struct-level='repo'].inSel,\n\tdiv[data-struct-level='wsp'].inSel {\n\t\tcolor: var(--color)\n\t}\n\n\tdiv[data-struct-level='repo'] {\n\t\tfont-size: 1.3rem;\n\t}\n\n\tdiv[data-struct-level='repo'] > .cell:first-child .icon {\n\t\tpadding-inline-start: unset !important;\n\t}\n\n\tdiv[data-struct-level='wsp'] {\n\t\tmargin-block-start: 1rem;\n\t\tfont-size: 1.2rem;\n\t}\n\n`)
REG.reg.registerSkin("c-rolesexplorer-wsp-tree-details",1,`\n\n\n`)

//# sourceMappingURL=wspRolesExplorer.js.map