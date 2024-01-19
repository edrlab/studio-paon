import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{ItemTypeTask}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{SrcExecTransition}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/lcTaskActions.js"
import{CDM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/cdm.js"
export var LIFECYCLE;(function(LIFECYCLE){LIFECYCLE.UNKNOWN_STATE="?"
LIFECYCLE.DEFAULT_STATE=""
function isTransAvailable(trans,lcState,itModel,lcProv){if(lcState===trans.targetState)return false
if(trans.restrictForItemTypes&&trans.restrictForItemTypes.indexOf(itModel)<0)return false
if(lcState&&!lcProv.getLcStates().has(lcState))lcState=LIFECYCLE.UNKNOWN_STATE
if(trans.restrictFromStates&&trans.restrictFromStates.indexOf(lcState||LIFECYCLE.DEFAULT_STATE)<0)return false
return true}LIFECYCLE.isTransAvailable=isTransAvailable
function hasLcOnItem(shortDesc,lcProv){if(shortDesc.lcSt==null)return false
if(lcProv.getLcStates()===null)return false
if(shortDesc.lcSt)return true
if(shortDesc.lcSt===""){const emptySt=lcProv.getLcState("")
if(emptySt&&emptySt.name)return true}for(const tr of lcProv.getLcTransitions().values())if(isTransAvailable(tr,shortDesc.lcSt,shortDesc.itModel,lcProv))return true
return false}LIFECYCLE.hasLcOnItem=hasLcOnItem
function listTransitions(shortDesc,lcProv){const r=[]
const trMap=lcProv.getLcTransitions()
if(trMap)for(const tr of trMap.values())if(isTransAvailable(tr,shortDesc.lcSt,shortDesc.itModel,lcProv))r.push(tr)
return r}LIFECYCLE.listTransitions=listTransitions
function listAllTransitionActions(lcProv,overrideExec){const r=[]
const trMap=lcProv.getLcTransitions()
if(trMap)for(const tr of trMap.values())r.push(new SrcExecTransition(tr,lcProv,overrideExec))
return r}LIFECYCLE.listAllTransitionActions=listAllTransitionActions})(LIFECYCLE||(LIFECYCLE={}))
export var EInvolvement;(function(EInvolvement){EInvolvement[EInvolvement["none"]=0]="none"
EInvolvement[EInvolvement["executor"]=1]="executor"
EInvolvement[EInvolvement["follower"]=2]="follower"
EInvolvement[EInvolvement["all"]=3]="all"})(EInvolvement||(EInvolvement={}))
export var ETaskStage;(function(ETaskStage){ETaskStage["completed"]="completed"
ETaskStage["pending"]="pending"
ETaskStage["forthcoming"]="forthcoming"})(ETaskStage||(ETaskStage={}))
export class ExecTrans{constructor(trans){this.trans=trans}toDom(doc){const elt=doc.createElementNS(TASK.TASK_NS,"stk:execTransition")
elt.setAttribute("transition",this.trans)
return elt}}export class SetTitle{constructor(title){this.title=title}toDom(doc){const elt=doc.createElementNS(TASK.TASK_NS,"stk:setTitle")
elt.setAttribute("newTitle",this.title)
return elt}}export class SetDeadline{constructor(dt){this.dt=dt}toDom(doc){const elt=doc.createElementNS(TASK.TASK_NS,"stk:setDeadline")
elt.setAttribute("newDt",this.dt)
return elt}}export class SetScheduleDt{constructor(dt){this.dt=dt}toDom(doc){const elt=doc.createElementNS(TASK.TASK_NS,"stk:setScheduledDt")
elt.setAttribute("newDt",this.dt)
return elt}}export class SetDescription{constructor(root){this.root=root}toDom(doc){return doc.importNode(this.root,true)}}export class AddComment{constructor(root){this.root=root}toDom(doc){return doc.importNode(this.root,true)}}export class PutUserResp{constructor(account,resp){this.account=account
this.resp=resp}toDom(doc){const elt=doc.createElementNS(TASK.TASK_NS,"stk:putUser")
elt.setAttribute("account",this.account)
elt.setAttribute("resp",this.resp)
return elt}}export class RemoveUserResp{constructor(account,resp){this.account=account
this.resp=resp}toDom(doc){const elt=doc.createElementNS(TASK.TASK_NS,"stk:removeUser")
elt.setAttribute("account",this.account)
elt.setAttribute("resp",this.resp)
return elt}}export var TASK;(function(TASK){function isTask(sd){return sd&&sd.itSgn&&sd.itSgn.includes("#Task")}TASK.isTask=isTask
TASK.TASK_NS="scenari.eu:task:1.0"
TASK.TAG_setDescription="stk:setDescription"
TASK.TAG_addComment="stk:addComment"
async function saveTask(wsp,uiContext,refUri,updates){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
let root
if(updates instanceof XMLDocument){root=updates.documentElement}else{const doc=DOM.sharedXmlDoc()
root=doc.createElementNS(TASK.TASK_NS,"stk:updateTask")
for(const updt of updates){const elt=updt.toDom(doc)
if(elt)root.appendChild(elt)}}if(SRC.isNewSrcUri(refUri)){const itModel=SRC.extractItModelFromNewSrcUri(refUri)
const opts={srcNm:itModel.substring(4)+".tk"}
return wsp.wspServer.config.tasksUrl.fetchJson(IO.qs("cdaction","AddTask","param",wsp.code,"options",CDM.stringify(opts),"fields","srcUri"),{method:"PUT",body:DOM.ser(root)})}else{return wsp.wspServer.config.tasksUrl.fetchJson(IO.qs("cdaction","UpdateTask","param",wsp.code,"taskRefUri",refUri,"fields","srcUri"),{method:"PUT",body:DOM.ser(root)})}}TASK.saveTask=saveTask
async function deleteTask(wsp,uiContext,srcIds){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const fd=new FormData
fd.append("taskSrcIds",srcIds.join("\t"))
return wsp.wspServer.config.tasksUrl.fetchVoid(IO.qs("cdaction","DeleteTasks","param",wsp.code),{method:"POST",body:fd})}TASK.deleteTask=deleteTask
function getDescriptionFromContent(doc){if(doc){let lastUpdt=doc.documentElement.lastElementChild
while(lastUpdt){let order=lastUpdt.firstElementChild
while(order){if(order.localName==="setDescription"&&order.namespaceURI===TASK.TASK_NS)return order
order=order.nextElementSibling}lastUpdt=lastUpdt.previousElementSibling}}return null}TASK.getDescriptionFromContent=getDescriptionFromContent
function getDeadlineFromContent(doc){if(doc){let lastUpdt=doc.documentElement.lastElementChild
while(lastUpdt){let order=lastUpdt.firstElementChild
while(order){if(order.localName==="setDeadline"&&order.namespaceURI===TASK.TASK_NS)return order.getAttribute("newDt")
order=order.nextElementSibling}lastUpdt=lastUpdt.previousElementSibling}}return null}TASK.getDeadlineFromContent=getDeadlineFromContent
function getScheduledDtFromContent(doc){if(doc){let lastUpdt=doc.documentElement.lastElementChild
while(lastUpdt){let order=lastUpdt.firstElementChild
while(order){if(order.localName==="setScheduledDt"&&order.namespaceURI===TASK.TASK_NS)return order.getAttribute("newDt")
order=order.nextElementSibling}lastUpdt=lastUpdt.previousElementSibling}}return""}TASK.getScheduledDtFromContent=getScheduledDtFromContent
function getUsersFromContent(doc,resp){const set=new Set
if(doc){let updt=doc.documentElement.firstElementChild
while(updt){let order=updt.firstElementChild
while(order){if(order.localName==="putUser"&&order.namespaceURI===TASK.TASK_NS){if(order.getAttribute("resp").indexOf(resp)>=0)set.add(order.getAttribute("account"))}else if(order.localName==="removeUser"&&order.namespaceURI===TASK.TASK_NS){if(order.getAttribute("resp").indexOf(resp)>=0)set.delete(order.getAttribute("account"))}order=order.nextElementSibling}updt=updt.nextElementSibling}}return set}TASK.getUsersFromContent=getUsersFromContent
function getInvolvementForAccounts(accounts,taskDesc,wspMetaUi){if(taskDesc&&taskDesc.rspUsrs&&accounts&&wspMetaUi){let inv=EInvolvement.none
const filterResps=accounts=="*"?taskDesc.rspUsrs:taskDesc.rspUsrs.filter(involvedUser=>accounts.find(account=>account==involvedUser.usr&&involvedUser.resp))
if(filterResps){const itemType=wspMetaUi.getItemType(taskDesc.itModel)
filterResps.forEach(rspUsers=>{const entryInv=itemType instanceof ItemTypeTask?TASK.findInvolvementForResps(itemType,rspUsers.resp,taskDesc):EInvolvement.none
inv=inv|entryInv})
return inv}}return null}TASK.getInvolvementForAccounts=getInvolvementForAccounts
function findInvolvementForResps(taskType,respsCodes,taskDesc){let inv=EInvolvement.none
if(respsCodes)for(let i=0;i<respsCodes.length&&inv!==EInvolvement.all.valueOf();i++){const resp=taskType.datas.resps?taskType.datas.resps.find(pRespDef=>pRespDef.code===respsCodes[i]):null
if(resp&&resp.involvementRules){resp.involvementRules.forEach(pRule=>{if(pRule.ifState){if(taskDesc&&pRule.ifState.test(taskDesc.lcSt))inv|=pRule.addInv}else inv|=pRule.addInv
if(inv===EInvolvement.all.valueOf())return EInvolvement.all})}}return inv}TASK.findInvolvementForResps=findInvolvementForResps
function hideContextField(field,hidden){DOM.setHidden(field,hidden)
const label=DOM.findPreviousSibling(field,n=>n.localName==="label")
if(label)DOM.setHidden(label,hidden)
let parent=field.parentElement
while(parent&&parent.classList.contains("childDep")){DOM.setHidden(parent,hidden)
parent=parent.parentElement}}TASK.hideContextField=hideContextField})(TASK||(TASK={}))

//# sourceMappingURL=lcTask.js.map