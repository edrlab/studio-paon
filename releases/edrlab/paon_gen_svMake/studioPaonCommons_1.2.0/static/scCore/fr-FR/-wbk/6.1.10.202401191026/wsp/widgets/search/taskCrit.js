import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/search/itemCrit.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{SearchItemSgnRegexp,SearchLifeCycleStates,SearchTasksAll,SearchTasksByUsers,SearchTasksDeadline,SearchTasksScheduled}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
import{UiCritArea,UiCritBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/search/uiCrit.js"
import{EUserAspects}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
import{InputUserPanel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/inputs.js"
import{UserRef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/userRef.js"
import{EItemTypeFamily,ETaskFeatures,LC_DEFAULT_NAME,LC_STATE_DEFAULT_KEY,LC_STATE_DEFAULT_NAME}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js"
import{InputPeriod}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/inputPeriod.js"
import{ItemCritRespsonsabilities}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/search/itemCrit.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
REG.reg.addSvcToList("wsp.crit.tasks","wsp-uicrit-bool:and",1,"wsp-uicrit-bool:and")
REG.reg.addSvcToList("wsp.crit.tasks","wsp-uicrit-bool:or",1,"wsp-uicrit-bool:or")
REG.reg.addSvcToList("wsp.crit.tasks","and",1,"and")
REG.reg.addSvcToList("wsp.crit.tasks","or",1,"or")
REG.reg.addSvcToList("wsp.crit.tasks","wsp-uicrit-free",1,"wsp-uicrit-free")
REG.reg.addSvcToList("wsp.crit.tasks","exp",1,"exp")
REG.reg.addSvcToList("wsp.crit.tasks","wsp-itemcrit-title",1,"wsp-itemcrit-title")
REG.reg.addSvcToList("wsp.crit.tasks","wsp-itemcrit-lastmodif",1,"wsp-itemcrit-lastmodif")
export class TaskCritFullWsp extends UiCritBase{get withStageCompleted(){return this._completed.checked}get withStagePending(){return this._pending.checked}get withStageForthcoming(){return this._forthcoming.checked}_initialize(init){super._initialize(init)
const wsp=this.reg.env.wsp
const sr=this.shadowRoot
sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Tâches de l\'atelier"),this.insertAlternativesBtn(init)))
let optsRoot=sr.appendChild(JSX.createElement("div",{class:"h"}))
this._pending=optsRoot.appendChild(JSX.createElement("label",{class:"opt"},JSX.createElement("input",{type:"checkbox",checked:true,onclick:this.onChange}),"en cours")).firstElementChild
this._completed=optsRoot.appendChild(JSX.createElement("label",{class:"opt"},JSX.createElement("input",{type:"checkbox",onclick:this.onChange}),"closes")).firstElementChild
this._forthcoming=optsRoot.appendChild(JSX.createElement("label",{class:"opt"},JSX.createElement("input",{type:"checkbox",checked:true,onclick:this.onChange}),"à venir")).firstElementChild}async initFromXmlCrit(xml){var _a
const actStages=(_a=xml.getAttribute("actStages"))===null||_a===void 0?void 0:_a.split(" ")
this._pending.checked=(actStages===null||actStages===void 0?void 0:actStages.indexOf("pending"))>-1
this._completed.checked=(actStages===null||actStages===void 0?void 0:actStages.indexOf("completed"))>-1
this._forthcoming.checked=(actStages===null||actStages===void 0?void 0:actStages.indexOf("forthcoming"))>-1
return this}buildCrit(){const stages=[]
if(this.withStagePending)stages.push("pending")
if(this.withStageCompleted)stages.push("completed")
if(this.withStageForthcoming)stages.push("forthcoming")
return new SearchTasksAll(stages)}buildUiXmlCrit(){const crit=this.buildCrit().toDom()
crit.setAttribute("uiCrit",this.getUiCritXmlAtt())
return crit}}TaskCritFullWsp.AREA=new UiCritArea("wsp-taskcrit-fullwsp").setLabel("Tâches de l\'atelier").setCritSgn("scope").setReplacePattern(/\bscope\b/).setGroup("scope").setBuildAbstract((function(xml,ctx){var _a
const actStages=(_a=xml.getAttribute("actStages"))===null||_a===void 0?void 0:_a.split(" ")
const actStagesTitles=[]
if((actStages===null||actStages===void 0?void 0:actStages.indexOf("completed"))>-1)actStagesTitles.push("close")
if((actStages===null||actStages===void 0?void 0:actStages.indexOf("pending"))>-1)actStagesTitles.push("en cours")
if((actStages===null||actStages===void 0?void 0:actStages.indexOf("forthcoming"))>-1)actStagesTitles.push("à venir")
const stages=actStagesTitles.join(", ")
return JSX.createElement("span",{class:"crit"},"Tâches de l\'atelier (",actStagesTitles.join(", "),")")}))
customElements.define("wsp-taskcrit-fullwsp",TaskCritFullWsp)
REG.reg.registerSvc("wsp-taskcrit-fullwsp",1,TaskCritFullWsp.AREA)
REG.reg.addSvcToList("wsp.crit.tasks","wsp-taskcrit-fullwsp",1,"wsp-taskcrit-fullwsp")
export class TaskCritByUsers extends UiCritBase{get withStageCompleted(){return this._completed.checked}get withStagePending(){return this._pending.checked}get withStageForthcoming(){return this._forthcoming.checked}get withExpandUsersToGroups(){var _a
return(_a=this._toGroupsElt)===null||_a===void 0?void 0:_a.checked}get withExpandUsersToMembers(){var _a
return(_a=this._toMembersElt)===null||_a===void 0?void 0:_a.checked}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
const withGroups=this.reg.env.universe.useUsers.hasAspect(EUserAspects.groupable)
this._userElt=(new InputUserPanel).initialize({name:"choiceUser",reg:this.reg,emptySelectionMsg:withGroups?"Utilisateurs/groupes...":"Utilisateurs...",userCard:"multi",usersGridInit:{usersSrv:this.reg.env.universe.useUsers,filterTypeInputVisibility:true,filterType:null}})
this._userElt.addEventListener("change",this.onChange)
let critGroups
if(withGroups){this._toGroupsElt=JSX.createElement("input",{type:"checkbox",onclick:this.onChange})
this._toMembersElt=JSX.createElement("input",{type:"checkbox",onclick:this.onChange})
critGroups=JSX.createElement("div",{class:"h"},JSX.createElement("label",{class:"opt",title:"Inclure les items associés aux groupes auxquels les utilisateurs sélectionnés appartiennent"},this._toGroupsElt,"+ groupes"),JSX.createElement("label",{class:"opt",title:"Inclure les items associés aux membres des groupes sélectionnés"},this._toMembersElt,"+ membres"))}sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Tâches des utilisateurs"),JSX.createElement("div",{class:"inputsCtn"},this._userElt,critGroups),this.insertAlternativesBtn(init)))
let optsRoot=sr.appendChild(JSX.createElement("div",{class:"h"}))
this._pending=optsRoot.appendChild(JSX.createElement("label",{class:"opt"},JSX.createElement("input",{type:"checkbox",checked:true,onclick:this.onChange}),"en cours")).firstElementChild
this._completed=optsRoot.appendChild(JSX.createElement("label",{class:"opt"},JSX.createElement("input",{type:"checkbox",onclick:this.onChange}),"closes")).firstElementChild
this._forthcoming=optsRoot.appendChild(JSX.createElement("label",{class:"opt"},JSX.createElement("input",{type:"checkbox",checked:true,onclick:this.onChange}),"à venir")).firstElementChild}async initFromXmlCrit(xml){var _a,_b,_c,_d
const users=(_a=xml.getAttribute("users"))===null||_a===void 0?void 0:_a.split(" ")
this._userElt.value=users
const expandUsers=(_b=xml.getAttribute("expandUsers"))===null||_b===void 0?void 0:_b.split(" ")
this._toGroupsElt.checked=(expandUsers===null||expandUsers===void 0?void 0:expandUsers.indexOf("toGroups"))>-1
this._toMembersElt.checked=(expandUsers===null||expandUsers===void 0?void 0:expandUsers.indexOf("toMembers"))>-1
const actStages=(_c=xml.getAttribute("actStages"))===null||_c===void 0?void 0:_c.split(" ")
this._pending.checked=(actStages===null||actStages===void 0?void 0:actStages.indexOf("pending"))>-1
this._completed.checked=(actStages===null||actStages===void 0?void 0:actStages.indexOf("completed"))>-1
this._forthcoming.checked=(actStages===null||actStages===void 0?void 0:actStages.indexOf("forthcoming"))>-1
const responsibilities=(_d=xml.getAttribute("responsibilities"))===null||_d===void 0?void 0:_d.split(" ")
if(responsibilities&&this._respElt){for(const opt of this._respElt.options)opt.selected=responsibilities.includes(opt.value)}return this}buildCrit(){var _a,_b
const stages=[]
if(this.withStagePending)stages.push("pending")
if(this.withStageCompleted)stages.push("completed")
if(this.withStageForthcoming)stages.push("forthcoming")
const resps=[]
if(this._respElt)for(const opt of this._respElt.options)resps.push(opt.value)
const crit=new SearchTasksByUsers(this._userElt.value,stages).setExpandToMembers((_a=this._toMembersElt)===null||_a===void 0?void 0:_a.checked).setExpandToGroups((_b=this._toGroupsElt)===null||_b===void 0?void 0:_b.checked).setResps(resps)
return crit||new SearchTasksAll(stages)}}TaskCritByUsers.AREA=new UiCritArea("wsp-taskcrit-byusers").setLabel("Tâches des utilisateurs").setGroup("scope").setCritSgn("scope").setReplacePattern(/\bscope\b/).setBuildAbstract((function(xml,ctx){var _a,_b,_c
const actStages=(_a=xml.getAttribute("actStages"))===null||_a===void 0?void 0:_a.split(" ")
const actStagesTitles=[]
if(actStages.indexOf("completed")>-1)actStagesTitles.push("close")
if(actStages.indexOf("pending")>-1)actStagesTitles.push("en cours")
if(actStages.indexOf("forthcoming")>-1)actStagesTitles.push("à venir")
const stages=actStagesTitles.join(", ")
let usersListVal
const users=xml.getAttribute("users")
if(users){const accounts=users.split(" ")
const usersObj=JSX.createElement("span",null)
accounts.forEach((account,pos)=>{if(pos>0)usersObj.appendChild(JSX.createElement("span",null," ou "))
usersObj.appendChild(JSX.createElement(UserRef,{class:"inline list","î":{reg:ctx.reg,nickOrAccount:account,withIcon:false}}))})
usersListVal=JSX.createElement("span",null,"'",usersObj,"'")
const expandUsers=(_b=xml.getAttribute("expandUsers"))===null||_b===void 0?void 0:_b.split(" ")
if((expandUsers===null||expandUsers===void 0?void 0:expandUsers.indexOf("toGroups"))&&expandUsers.indexOf("toMembers"))usersListVal.appendChild(JSX.createElement("span",null," (étendu aux membres/groupes)"))
if(expandUsers===null||expandUsers===void 0?void 0:expandUsers.indexOf("toGroups"))usersListVal.appendChild(JSX.createElement("span",null," (étendu aux groupes)"))
if(expandUsers===null||expandUsers===void 0?void 0:expandUsers.indexOf("toMembers"))usersListVal.appendChild(JSX.createElement("span",null," (étendu aux membres)"))}const modelResps=ctx.reg.env.wsp.wspMetaUi.listResps("task")
const respsArr=(_c=xml.getAttribute("responsibilities"))===null||_c===void 0?void 0:_c.split(" ")
const respsLabels=[]
if(respsArr)respsArr.forEach(resp=>{const currentResp=modelResps.find(entry=>entry.code===resp)
respsLabels.push(currentResp?currentResp.name:resp)})
let respsVal
if(respsLabels.length==1){const resp=respsLabels[0]
respsVal=JSX.createElement("span",null,`(ayant la responsabilité \'${resp}\')`)}else if(respsLabels.length>1){const resps=respsLabels.join(" ou ")
respsVal=JSX.createElement("span",null,`(ayant l\'une des responsabilités \'${resps}\')`)}return JSX.createElement("span",{class:"crit"},"Tâches des utilisateurs ",usersListVal," ",respsVal," dans l\'un des états '",actStagesTitles.join(", "),"'")}))
customElements.define("wsp-taskcrit-byusers",TaskCritByUsers)
REG.reg.registerSvc("wsp-taskcrit-byusers",1,TaskCritByUsers.AREA)
REG.reg.addSvcToList("wsp.crit.tasks","wsp-taskcrit-byusers",1,"wsp-taskcrit-byusers")
export class TaskCritForMe extends UiCritBase{get withStageCompleted(){return this._completed.checked}get withStagePending(){return this._pending.checked}get withStageForthcoming(){return this._forthcoming.checked}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Mes tâches"),this.insertAlternativesBtn(init)))
let optsRoot=sr.appendChild(JSX.createElement("div",{class:"h"}))
this._pending=optsRoot.appendChild(JSX.createElement("label",{class:"opt"},JSX.createElement("input",{type:"checkbox",checked:true,onclick:this.onChange}),"en cours")).firstElementChild
this._completed=optsRoot.appendChild(JSX.createElement("label",{class:"opt"},JSX.createElement("input",{type:"checkbox",onclick:this.onChange}),"closes")).firstElementChild
this._forthcoming=optsRoot.appendChild(JSX.createElement("label",{class:"opt"},JSX.createElement("input",{type:"checkbox",checked:true,onclick:this.onChange}),"à venir")).firstElementChild}async initFromXmlCrit(xml){var _a
const actStages=(_a=xml.getAttribute("actStages"))===null||_a===void 0?void 0:_a.split(" ")
this._pending.checked=(actStages===null||actStages===void 0?void 0:actStages.indexOf("pending"))>-1
this._completed.checked=(actStages===null||actStages===void 0?void 0:actStages.indexOf("completed"))>-1
this._forthcoming.checked=(actStages===null||actStages===void 0?void 0:actStages.indexOf("forthcoming"))>-1
return this}buildCrit(){const stages=[]
if(this.withStagePending)stages.push("pending")
if(this.withStageCompleted)stages.push("completed")
if(this.withStageForthcoming)stages.push("forthcoming")
const auth=this.reg.env.universe.auth
if(auth.config.noAuthentication||!auth.currentAuthenticatedUser)return new SearchTasksAll(stages)
return new SearchTasksByUsers([auth.currentAuthenticatedUser.account],stages).setExpandToGroups(true)||new SearchTasksAll(stages)}}TaskCritForMe.AREA=new UiCritArea("wsp-taskcrit-forme").setLabel("Mes tâches").setGroup("scope").setCritSgn("scope").setReplacePattern(/\bscope\b/).setBuildAbstract((function(xml,ctx){var _a
const actStages=(_a=xml.getAttribute("actStages"))===null||_a===void 0?void 0:_a.split(" ")
const actStagesTitles=[]
if(actStages.indexOf("completed")>-1)actStagesTitles.push("close")
if(actStages.indexOf("pending")>-1)actStagesTitles.push("en cours")
if(actStages.indexOf("forthcoming")>-1)actStagesTitles.push("à venir")
const stages=actStagesTitles.join(", ")
return JSX.createElement("span",{class:"crit"},"Mes tâches dans l\'un des états '",actStagesTitles.join(", "),"'")}))
customElements.define("wsp-taskcrit-forme",TaskCritForMe)
REG.reg.registerSvc("wsp-taskcrit-forme",1,TaskCritForMe.AREA)
REG.reg.addSvcToList("wsp.crit.tasks","wsp-taskcrit-forme",1,"wsp-taskcrit-forme")
export class TaskCritType extends UiCritBase{_initialize(init){super._initialize(init)
const sr=this.shadowRoot
const it=this.reg.env.wsp.wspMetaUi.getItemTypes()
this._typesElt=JSX.createElement("select",{onchange:this.onChange,multiple:"true"})
it.forEach(entry=>{if(entry.isFamily(EItemTypeFamily.task)){const opt=this._typesElt.appendChild(JSX.createElement("option",{value:entry.getModel()},entry.getTitle()))
if(entry.getIcon())opt.style.backgroundImage=`url("${entry.getIcon()}")`}})
const critHead=sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Type(s) :"),this._typesElt,this.insertAlternativesBtn(init)))}async initFromXmlCrit(xml){var _a
this._typesElt.selectedIndex=-1
const itModelsArray=((_a=xml===null||xml===void 0?void 0:xml.getAttribute("uiItModels"))===null||_a===void 0?void 0:_a.split("|"))||[]
for(const opt of this._typesElt.options)opt.selected=itModelsArray.indexOf(opt.value)>-1?true:false
return this}buildCrit(){if(this._typesElt.selectedOptions)return new SearchItemSgnRegexp(Array.from(this._typesElt.selectedOptions).map(entry=>"@"+LANG.escape4Regexp(entry.value)+"\\b.*"))}buildUiXmlCrit(){const selectedItModels=[]
for(const opt of this._typesElt.selectedOptions)if(opt.selected)selectedItModels.push(opt.value)
const crit=super.buildUiXmlCrit()
if(crit&&selectedItModels)crit.setAttribute("uiItModels",selectedItModels.join("|"))
return crit}}TaskCritType.AREA=new UiCritArea("wsp-taskcrit-type").setLabel("Type").setCritSgn("type").setGroup("task").setBuildAbstract((xml,ctx)=>{const itModels=xml?xml.getAttribute("uiItModels"):null
const itLabels=[]
if(itModels!=null){const itTypesArray=itModels.split("|")
itTypesArray.forEach(itModel=>{itLabels.push(ctx.reg.env.wsp.wspMetaUi.getItemType(itModel).getTitle())})}if(itLabels.length==1){const itLabel=JSX.createElement("span",{class:"critVal"},itLabels[0])
return JSX.createElement("span",{class:"crit"},"Type '",itLabel,"'")}else if(itLabels.length<5){return JSX.createElement("span",{class:"crit"},"Types '",itLabels.join(", "),"'")}else{const itCount=JSX.createElement("span",{class:"critVal"},itLabels.length)
return JSX.createElement("span",{class:"crit",title:itLabels.join(", ")},itCount," types")}})
customElements.define("wsp-taskcrit-type",TaskCritType)
REG.reg.registerSkin("wsp-taskcrit-type",1,`\n\tselect {\n\t\t/*flex:1;*/\n\t}\n\n\toption {\n\t\t/*background-image: url("affecteeDynamiquement");*/\n\t  background-repeat: no-repeat;\n\t  background-size: auto 1rem;\n\t  min-width: 3rem;\n\t  padding-inline-start: 1.3rem;\n  }\n`)
REG.reg.registerSvc("wsp-taskcrit-type",1,TaskCritType.AREA)
REG.reg.addSvcToList("wsp.crit.tasks","wsp-taskcrit-type",1,"wsp-taskcrit-type")
export class TaskCritDeadline extends UiCritBase{_initialize(init){super._initialize(init)
const sr=this.shadowRoot
this._dateElt=(new InputPeriod).initialize({defaultLabel:"Choisir une valeur...",modes:InputPeriod.buildDefaultModes_futurAndPast()})
this._dateElt.addEventListener("change",this.onChange)
this._dateElt.addEventListener("input",this.onChange)
const icon=this.critArea?this.critArea.getIcon({reg:this.reg}):null
const img=icon?JSX.createElement("img",{src:icon}):null
const head=sr.appendChild(JSX.createElement("div",{class:"critHead"},img,JSX.createElement("span",{class:"critTitle"},this.critArea?this.critArea.getLabel({reg:this.reg}):""),this._dateElt,this.insertAlternativesBtn(init)))
UiCritBase.initHeadFromArea(this.critArea,{reg:this.reg},head)}async initFromXmlCrit(xml){this._dateElt.reset(xml.getAttribute("uiCurrentMode"),xml.hasAttribute("uiCurrentLess")?Number.parseInt(xml.getAttribute("uiCurrentLess")):null,xml.hasAttribute("uiCurrentMore")?Number.parseInt(xml.getAttribute("uiCurrentMore")):null)
return this}buildCrit(){if(this._dateElt.isSpecified())return SearchTasksDeadline.buildFromInputPeriod(this._dateElt)
return undefined}buildUiXmlCrit(){const crit=super.buildUiXmlCrit()
if(crit){if(crit&&this._dateElt.isSpecified()){crit.setAttribute("uiCurrentMode",this._dateElt.currentMode.getId())
if(this._dateElt.date1.valueAsNumber)crit.setAttribute("uiCurrentLess",this._dateElt.date1.valueAsNumber.toString())
if(this._dateElt.date2.valueAsNumber)crit.setAttribute("uiCurrentMore",this._dateElt.date2.valueAsNumber.toString())}}return crit}}TaskCritDeadline.AREA=new UiCritArea("wsp-taskcrit-deadline").setLabel("Date limite").setReplacePattern(/\bdate\b/).setGroup("task").setVisible(ctx=>{const wspMetaUi=ctx.reg.env.wsp.wspMetaUi
const tasksIt=wspMetaUi.getItemTypes().filter(entry=>entry.isFamily(EItemTypeFamily.task))
return(tasksIt===null||tasksIt===void 0?void 0:tasksIt.find(entry=>entry.hasFeature(ETaskFeatures.deadline)))?true:false}).setCritSgn("type").setGroup("task").setBuildAbstract((xml,ctx)=>{const modes=InputPeriod.buildDefaultModes_futurAndPast()
const uiCurrentModeId=xml===null||xml===void 0?void 0:xml.getAttribute("uiCurrentMode")
const uiCurrentMode=uiCurrentModeId?modes.find(entry=>entry.getId()===uiCurrentModeId):null
const uiCurrentModeLabel=(uiCurrentMode===null||uiCurrentMode===void 0?void 0:uiCurrentMode.selectedLabel)||(uiCurrentMode===null||uiCurrentMode===void 0?void 0:uiCurrentMode.getLabel(null))
return uiCurrentModeLabel?JSX.createElement("span",{class:"crit"},JSX.createElement("span",{class:"critTitle"},"Date limite de type")," '",JSX.createElement("span",{class:"critVal"},uiCurrentModeLabel),"'"):JSX.createElement("span",{class:"crit"},JSX.createElement("span",{class:"critTitle"},"Date limite"))})
customElements.define("wsp-taskcrit-deadline",TaskCritDeadline)
REG.reg.registerSvc("wsp-taskcrit-deadline",1,TaskCritDeadline.AREA)
REG.reg.addSvcToList("wsp.crit.tasks","wsp-taskcrit-deadline",1,"wsp-taskcrit-deadline")
export class TaskCritScheduled extends TaskCritDeadline{buildCrit(){if(this._dateElt.isSpecified())return SearchTasksScheduled.buildFromInputPeriod(this._dateElt)
return undefined}}TaskCritScheduled.AREA=new UiCritArea("wsp-taskcrit-scheduled").setLabel("Date de planification").setReplacePattern(/\bdate\b/).setGroup("task").setVisible(ctx=>{const wspMetaUi=ctx.reg.env.wsp.wspMetaUi
const tasksIt=wspMetaUi.getItemTypes().filter(entry=>entry.isFamily(EItemTypeFamily.task))
return(tasksIt===null||tasksIt===void 0?void 0:tasksIt.find(entry=>entry.hasFeature(ETaskFeatures.scheduling)))?true:false}).setCritSgn("type").setGroup("task").setBuildAbstract((xml,ctx)=>{const modes=InputPeriod.buildDefaultModes_futurAndPast()
const uiCurrentModeId=xml===null||xml===void 0?void 0:xml.getAttribute("uiCurrentMode")
const uiCurrentMode=uiCurrentModeId?modes.find(entry=>entry.getId()===uiCurrentModeId):null
const uiCurrentModeLabel=(uiCurrentMode===null||uiCurrentMode===void 0?void 0:uiCurrentMode.selectedLabel)||(uiCurrentMode===null||uiCurrentMode===void 0?void 0:uiCurrentMode.getLabel(null))
return uiCurrentModeLabel?JSX.createElement("span",{class:"crit"},JSX.createElement("span",{class:"critTitle"},"Date de planification de type")," '",JSX.createElement("span",{class:"critVal"},uiCurrentModeLabel),"'"):JSX.createElement("span",{class:"crit"},JSX.createElement("span",{class:"critTitle"},"Date de planification"))})
customElements.define("wsp-taskcrit-scheduled",TaskCritScheduled)
REG.reg.registerSvc("wsp-taskcrit-scheduled",1,TaskCritScheduled.AREA)
REG.reg.addSvcToList("wsp.crit.tasks","wsp-taskcrit-scheduled",1,"wsp-taskcrit-scheduled")
export class TaskCritLifeCycle extends UiCritBase{_initialize(init){super._initialize(init)
const sr=this.shadowRoot
this.reg.installSkin("wsp-taskcrit-lifecycle",sr)
this._lcElt=JSX.createElement("select",{onchange:this.onChange,class:"lcSelect",multiple:"true"})
const wspMetaUi=this.reg.env.wsp.wspMetaUi
const tasksIt=wspMetaUi.getItemTypes().filter(entry=>entry.isFamily(EItemTypeFamily.task))
tasksIt.forEach(it=>{const lcs=it.getLcStates()
if(lcs.size){let optFrp=this._lcElt.appendChild(this._lcElt.appendChild(JSX.createElement("optgroup",{label:it.getTitle()})))
lcs.forEach(lc=>{let opt=optFrp.appendChild(JSX.createElement("option",{value:lc.code||LC_STATE_DEFAULT_KEY,"data-model":it.getModel()},lc.name||LC_STATE_DEFAULT_NAME))
opt.style.color=lc.color||"var(--color)"
if(lc.iconUrl)opt.style.backgroundImage=`url("${lc.iconUrl}")`
if(lc.code=="")DOM.setAttrBool(opt,"selected",true)})}})
const critHead=sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("div",{class:"h"},JSX.createElement("span",{class:"critTitle"},this.reg.env.wsp.wspMetaUi.getLcName()),this._lcElt),this.insertAlternativesBtn(init)))}async initFromXmlCrit(xml){this._lcElt.selectedIndex=-1
const lcStates=xml.getAttribute("lcStates")||""
const lcStatesArr=lcStates.split(" ")
Array.from(this._lcElt.options).forEach(opt=>{opt.selected=lcStatesArr.includes(opt.value)})
return this}buildCrit(){let crit=new SearchLifeCycleStates
crit.lcStates=[]
Array.from(this._lcElt.selectedOptions).forEach(opt=>crit.lcStates.push(opt.value))
return crit}buildUiXmlCrit(){const crit=super.buildUiXmlCrit()
if(crit){const statesWithModel=[]
Array.from(this._lcElt.selectedOptions).forEach(opt=>statesWithModel.push(opt.getAttribute("data-model")+":"+opt.value))
crit.setAttribute("uiCritStatesByModels",statesWithModel.join(" "))}return crit}}TaskCritLifeCycle.AREA=new UiCritArea("wsp-taskcrit-lifecycle").setLabel(ctx=>ctx.reg.env.wsp.wspMetaUi.getLcName()).setVisible(ctx=>{const wspMetaUi=ctx.reg.env.wsp.wspMetaUi
const tasksIt=wspMetaUi.getItemTypes().filter(entry=>entry.isFamily(EItemTypeFamily.task))
return(tasksIt===null||tasksIt===void 0?void 0:tasksIt.find(entry=>{var _a
return(_a=entry.getLcStates())===null||_a===void 0?void 0:_a.size}))?true:false}).setCritSgn("lifecycle").setGroup("task").setBuildAbstract((xml,ctx)=>{const lcName=LC_DEFAULT_NAME
const uiCritStatesByModelsStr=xml.getAttribute("uiCritStatesByModels")
if(uiCritStatesByModelsStr&&uiCritStatesByModelsStr.length){const wspMetaUi=ctx.reg.env.wsp.wspMetaUi
const uiCritStatesByModels=uiCritStatesByModelsStr.split(" ")
function makeLcLabelEntry(itModel,lcCode){const it=wspMetaUi.getItemType(itModel)
const lc=it===null||it===void 0?void 0:it.getLcStateOrUnknown(lcCode)
return lc.name||lcCode}if(uiCritStatesByModels.length==1){const args=uiCritStatesByModels[0].split(":")
JSX.createElement("span",{class:"crit"},"État du \",lcName,\" : ",JSX.createElement("span",{class:"critVal"},makeLcLabelEntry(args[0],args[1])))}else{const vals=new Set
uiCritStatesByModels.forEach(entry=>{const args=entry.split(":")
vals.add(makeLcLabelEntry(args[0],args[1]))})
return JSX.createElement("span",{class:"crit"},"États du \",lcName,\" : ",JSX.createElement("span",{class:"critVal"},Array.from(vals).sort().join(", ")))}}else{const lcStates=xml.getAttribute("lcStates")||""
const lcStatesArr=lcStates.split(" ")
const lcStatesLabels=lcStatesArr.join(", ")
return JSX.createElement("span",{class:"crit"},"État(s) du \",lcName,\" : ",JSX.createElement("span",{class:"critVal"},lcStatesLabels))}})
customElements.define("wsp-taskcrit-lifecycle",TaskCritLifeCycle)
REG.reg.registerSkin("wsp-taskcrit-lifecycle",1,`\n\tselect {\n\t\tflex: 1;\n\t\tresize: vertical;\n\t\theight: 10rem;\n\t}\n\n\toption {\n\t\t/*background-image: url("affecteeDynamiquement");*/\n\t\tbackground-repeat: no-repeat;\n\t\tbackground-size: auto 1rem;\n\t\tmin-width: 3rem;\n\t\tpadding-inline-start: 1.3rem;\n\t  margin-inline-start: 1.3rem;\n  }\n\n  option::before {\n\t  content: "" !important;\n  }\n\n`)
REG.reg.registerSvc("wsp-taskcrit-lifecycle",1,TaskCritLifeCycle.AREA)
REG.reg.addSvcToList("wsp.crit.tasks","wsp-taskcrit-lifecycle",1,"wsp-taskcrit-lifecycle")
class ItemCritRespsonsabilities_task extends ItemCritRespsonsabilities{constructor(){super(...arguments)
this.target="task"}}customElements.define("wsp-taskcrit-respsonsabilities",ItemCritRespsonsabilities_task)
REG.reg.registerSvc("wsp-taskcrit-respsonsabilities",1,ItemCritRespsonsabilities.AREA_task)
REG.reg.addSvcToList("wsp.crit.tasks","wsp-taskcrit-respsonsabilities",1,"wsp-taskcrit-respsonsabilities")

//# sourceMappingURL=taskCrit.js.map