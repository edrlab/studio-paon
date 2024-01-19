import{BaseElement,BaseElementAsync,MsgOver}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,ENodeType,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{AddComment,ETaskStage,ExecTrans,LIFECYCLE,PutUserResp,RemoveUserResp,SetDeadline,SetDescription,SetScheduleDt,SetTitle,TASK}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/lcTask.js"
import{WedEditorBox}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedEditorBox.js"
import{ptrItemTagsDefined,WspDataTransferWedAnalyzer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/wed/ptrItem.js"
import{boxTagsDefined}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{txtTagsDefined}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txt.js"
import{WED}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedCore.js"
import{DocHolder}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/docHolder.js"
import{Button,ButtonActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{SrcExecTransition}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/lcTaskActions.js"
import{InfoSrcUriMoved}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{UserRef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/userRef.js"
import{EUserType,USER}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
import{EAnnotLevel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaAnnots.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
export class TaskField extends BaseElement{_initialize(init){this.reg=this.findReg(init)
this.config=init
this.setAttribute("field",this.config.field)
if(this.config.field==="actTi"){}else if(this.config.field==="lcSt"){this._field=this.appendChild(JSX.createElement("c-label",null))}else{this._field=this.appendChild(JSX.createElement("input",null))}}_refresh(){const itemType=this.reg.env.itemType
const longDesc=this.reg.env.longDesc
switch(this.config.field){case"actTi":DOM.setTextContent(this,longDesc.itTi||"")
break
case"lcSt":const lc=itemType.getLcStateOrUnknown(longDesc.lcSt)
this._field.label=lc.name
this._field.icon=lc.iconUrl
break
case"tkDeadline":DOM.setAttr(this._field,"value",longDesc.tkDeadline.toString())
break
case"scheduledDt":const ct=this.reg.env.taskContent
DOM.setAttr(this._field,"value",TASK.getScheduledDtFromContent(ct))
break}}}customElements.define("wsp-task-field",TaskField)
export class TaskFieldInput extends BaseElement{get fieldName(){return this.config.field}get value(){if(this.config.field==="actTi")return this._input.value
const dt=this._input.valueAsDate
return dt?dt.getTime().toString():""}get valueTime(){if(this.config.field==="actTi")return 0
const dt=this._input.valueAsDate
return dt?dt.getTime():0}get isDirty(){return this.originalValue!==this.value}_initialize(init){this.reg=this.findReg(init)
const sr=this._attach(this.localName,init)
this.config=init
this.setAttribute("field",this.config.field)
const st=this.reg.env.initStates
if(this.config.field==="actTi"){this.originalValue=this.reg.env.longDesc.actTi||""
this._input=sr.appendChild(JSX.createElement("input",{required:true}))
if(st&&st.ti!=null)this._input.value=st.ti
else this._input.value=this.originalValue}else{this._input=sr.appendChild(JSX.createElement("input",{type:"date"}))
if(this.config.field==="scheduledDt"){this.originalValue=TASK.getScheduledDtFromContent(this.reg.env.taskContent)
this._input.required=true
this.currentStage=this.reg.env.itemType.getLcStateOrUnknown(this.reg.env.longDesc.lcSt).taskStage
this._input.value=this.timeToInputValue(st&&st.scheduledDt?st&&st.scheduledDt.toString():this.originalValue)}else{const longDesc=this.reg.env.longDesc
this.originalValue=longDesc.tkDeadline>0?longDesc.tkDeadline.toString():""
this._input.value=this.timeToInputValue(st&&st.deadlinedDt?st&&st.deadlinedDt.toString():this.originalValue)}}this.addEventListener("input",this.onInputChange)
this.reg.env.taskEditBroker.addConsumer(this)}onInfo(info){if(info instanceof InfoReqStateTask){if(this.config.field==="scheduledDt"){if(this.currentStage===ETaskStage.forthcoming){if(!info.isDirty)info.isDirty=this.isDirty
if(!info.isInError&&this._input.valueAsDate==null&&!this.config.permissive)info.isInError=true
if(info.states&&this.isDirty)info.states.scheduledDt=this.valueTime}}else{if(!info.isDirty)info.isDirty=this.isDirty
if(this.config.field==="actTi"){if(!info.isInError&&!this.config.permissive)info.isInError=!this.value
if(info.states&&this.isDirty)info.states.ti=this.value}else{if(info.states&&this.isDirty)info.states.deadlinedDt=this.valueTime}}}else if(info instanceof InfoReqFillUpdates){if(this.isDirty){switch(this.config.field){case"actTi":info.updates.push(new SetTitle(this.value))
break
case"tkDeadline":info.updates.push(new SetDeadline(this.value))
break
case"scheduledDt":if(this.currentStage===ETaskStage.forthcoming)info.updates.push(new SetScheduleDt(this.value))
break}}}else if(info instanceof InfoChangeTask&&info.field.fieldName==="lcSt"&&this.config.field==="scheduledDt"){this.currentStage=this.reg.env.itemType.getLcStateOrUnknown(info.field.value).taskStage
this.refresh()}}onInputChange(ev){this.reg.env.taskEditBroker.dispatchInfo(new InfoChangeTask(this),this)}_refresh(){if(this.config.field==="scheduledDt"){const hidden=this.currentStage!==ETaskStage.forthcoming
TASK.hideContextField(this,hidden)
if(hidden)return}DOM.setAttrBool(this._input,"readonly",this.config.editable===false||this.config.writePerms&&!this.reg.hasPerm(this.config.writePerms))}timeToInputValue(val){if(!val)return""
try{const dt=new Date(parseInt(val))
function toStr(n){return n<10?"0"+n.toString():n.toString()}return`${dt.getFullYear()}-${toStr(dt.getMonth()+1)}-${toStr(dt.getDate())}`}catch(e){return""}}}REG.reg.registerSkin("wsp-task-field-input",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\t:host([hidden]) {\n\t\tdisplay: none !important;\n\t}\n\n\tinput {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tbackground-color: var(--edit-bgcolor);\n\t\tcolor: var(--edit-color);\n\t\tborder: 1px solid var(--border-color);\n\t\tpadding: .3em;\n\t\ttext-overflow: ellipsis;\n\t\tfont-size: inherit;\n\t}\n\n\tinput[type="date"] {\n\t\tflex: unset;\n\t}\n\n\tinput[readonly] {\n\t\tbackground-color: initial;\n\t\tborder: initial;\n\t}\n\n\tinput:invalid {\n\t\tborder: 1px solid var(--error-color);\n\t\tbox-shadow: 0 0 2px var(--error-color);\n\t}\n`)
customElements.define("wsp-task-field-input",TaskFieldInput)
export class TaskFieldLc extends ButtonActions{get fieldName(){return"lcSt"}get value(){return this.selectedTrans?this.selectedTrans.trans.targetState:this.reg.env.longDesc.lcSt}get label(){return this.reg.env.itemType.getLcStateOrUnknown(this.value).name}get icon(){return this.reg.env.itemType.getLcStateOrUnknown(this.value).iconUrl}get shortDescs(){return this.reg.env.srcView.shortDescs}get emitter(){return this}onInfo(info){if(info instanceof InfoReqStateTask){if(this.selectedTrans){info.isDirty=true
if(info.states)info.states.trans=this.selectedTrans.trans.code}}else if(info instanceof InfoReqFillUpdates){if(this.selectedTrans)info.updates.push(new ExecTrans(this.selectedTrans.trans.code))}}_initialize(init){this.reg=this.findReg(init)
this.config=init
const st=this.reg.env.initStates
if(SRC.isNewSrcUri(this.reg.env.longDesc.srcUri)){init.actions=this.reg.env.itemType.getCreateTransitions().map(tr=>new SrcExecTransition(tr,this.reg.env.itemType,this.execTr))
init.groupOrder=this.reg.env.itemType.getLcTransitionsGroupOrder()
if(st&&st.trans)this.selectedTrans=init.actions.find(a=>a.trans.code===st.trans)
if(!this.selectedTrans)this.selectedTrans=init.actions[0]}else{init.actions=LIFECYCLE.listAllTransitionActions(this.reg.env.itemType,this.execTr)
init.groupOrder=this.reg.env.itemType.getLcTransitionsGroupOrder()
if(st&&st.trans)this.selectedTrans=init.actions.find(a=>a.trans.code===st.trans)}init.skinOver=this.localName
super._initialize(init)
this.reg.env.taskEditBroker.addConsumer(this)}_refresh(){super._refresh()
this.disabled=this.config.editable===false||this.config.writePerms&&!this.reg.hasPerm(this.config.writePerms)}execTr(ctx){ctx.selectedTrans=this
ctx.refresh()
ctx.reg.env.taskEditBroker.dispatchInfo(new InfoChangeTask(ctx),ctx)}}REG.reg.registerSkin("wsp-task-field-lc",1,`\n\t:host {\n\t\tcolor: var(--edit-color);\n\t}\n\n\t:host([disabled]) {\n\t\topacity: unset;\n\t}\n`)
customElements.define("wsp-task-field-lc",TaskFieldLc)
export class TaskFieldUsers extends BaseElementAsync{get fieldName(){return"resps"}get value(){return this.config.resp}get isDirty(){if(!this.currentUsers)return false
if(this.originalUsers.size!==this.currentUsers.size)return true
for(const u of this.originalUsers)if(!this.currentUsers.has(u))return true
return false}get isInError(){const count=this.shadowRoot.querySelectorAll("c-userref:not([data-isEmpty])").length
if(count>1)return!this.isCardMulti
return count===0&&this.isRequired}get isRequired(){const required=this.respConf.required
return required instanceof RegExp?required.test(this.currentLcSt):required||false}async _initialize(init){this.reg=this.findReg(init)
this.config=init
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.respConf=this.reg.env.itemType.getResp(this.config.resp)
if(!this.respConf){this.hidden=true
return}this.isCardMulti=this.respConf.userCard==="multi"
this.originalUsers=TASK.getUsersFromContent(this.reg.env.taskContent,this.config.resp)
this.currentLcSt=this.reg.env.longDesc.lcSt
const ctn=sr.appendChild(JSX.createElement("div",{id:"ctn"}))
this.msg=sr.appendChild(JSX.createElement("c-msg",{hidden:true}))
const states=this.reg.env.initStates
const accounts=states&&states.resps&&states.resps[this.config.resp]
if(accounts)this.currentUsers=new Set(accounts)
const users=this.originalUsers.size>0?await this.reg.env.universe.useUsers.getUserSet(Array.from(this.currentUsers||this.originalUsers)):[]
users.sort(this.sortUsers)
if(this.config.editable===false){for(const u of this.currentUsers||this.originalUsers){ctn.appendChild(JSX.createElement(UserRef,{"î":{reg:this.reg,nickOrAccount:u}}))}}else{for(const u of this.currentUsers||this.originalUsers){ctn.appendChild(JSX.createElement("div",{class:"user"},JSX.createElement(UserRef,{"î":{reg:this.reg,nickOrAccount:u}}),JSX.createElement("button",{class:"remUser",onclick:this.onRemUser,title:"Supprimer"})))}if(this.isCardMulti){ctn.appendChild(JSX.createElement("button",{class:"addUsers",onclick:this.onAddUsers,title:"Ajouter des utilisateurs"}))}else{ctn.setAttribute("card","single")
if(!ctn.firstElementChild)ctn.appendChild(JSX.createElement("div",{class:"user"},JSX.createElement(UserRef,{"î":{reg:this.reg}})))
ctn.appendChild(JSX.createElement("button",{class:"selectUser",onclick:this.onSelectUser,title:"Sélectionner l\'utilisateur"}))
ctn.firstElementChild.onclick=this.onSelectUser}}this.reg.env.taskEditBroker.addConsumer(this)}sortUsers(u1,u2){return USER.getPrimaryName(u1).localeCompare(USER.getPrimaryName(u2))}insertUser(user){const ctn=this.shadowRoot.getElementById("ctn")
let next=DOM.findFirstChild(ctn,IS_user)
while(next&&this.sortUsers(next.firstElementChild.user,user)<0){next=DOM.findNextSibling(ctn,IS_user)}ctn.insertBefore(JSX.createElement("div",{class:"user"},JSX.createElement(UserRef,{"î":{reg:this.reg,user:user}}),JSX.createElement("button",{class:"remUser",onclick:this.onRemUser,title:"Supprimer"})),next||ctn.lastElementChild)}onRemUser(ev){ev.stopImmediatePropagation()
const me=DOMSH.findHost(this)
const userRef=this.previousElementSibling
if(!me.currentUsers)me.currentUsers=new Set(me.originalUsers)
me.currentUsers.delete(userRef.nickOrAccount)
userRef.parentElement.remove()
me.refresh()
me.reg.env.taskEditBroker.dispatchInfo(new InfoChangeTask(me),me)}async onAddUsers(ev){var _a,_b,_c
ev.stopImmediatePropagation()
const me=DOMSH.findHost(this)
const{UserSelector:UserSelector}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/userSelector.js")
const userSelector=(new UserSelector).initialize({reg:me.reg,userGrid:{usersSrv:me.reg.env.universe.useUsers,grid:{selType:"multi"},filterGroups:(_a=me.respConf.usersSelection)===null||_a===void 0?void 0:_a.restrictFromGroups,filterType:((_b=me.respConf.usersSelection)===null||_b===void 0?void 0:_b.userType)==="groups"?EUserType.group:((_c=me.respConf.usersSelection)===null||_c===void 0?void 0:_c.userType)==="users"?EUserType.user:null,filterTypeInputVisibility:false},selectAndCloseOnDblClick:true})
const users=await POPUP.showMenuFromEvent(userSelector,ev||me,me,null,{initWidth:"20em"}).onNextClose()
if(users){if(!me.currentUsers)me.currentUsers=new Set(me.originalUsers)
for(const u of users){if(!me.currentUsers.has(u.account)){me.currentUsers.add(u.account)
me.insertUser(u)}}me.refresh()
me.reg.env.taskEditBroker.dispatchInfo(new InfoChangeTask(me),me)}}async onSelectUser(ev){var _a,_b,_c
ev.stopImmediatePropagation()
const me=DOMSH.findHost(this)
const{UserSelector:UserSelector}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/userSelector.js")
const userSelector=(new UserSelector).initialize({reg:me.reg,userGrid:{usersSrv:me.reg.env.universe.useUsers,filterGroups:(_a=me.respConf.usersSelection)===null||_a===void 0?void 0:_a.restrictFromGroups,filterType:((_b=me.respConf.usersSelection)===null||_b===void 0?void 0:_b.userType)==="groups"?EUserType.group:((_c=me.respConf.usersSelection)===null||_c===void 0?void 0:_c.userType)==="users"?EUserType.user:null},selectAndCloseOnDblClick:true})
const users=await POPUP.showMenuFromEvent(userSelector,ev||me,me,null,{initWidth:"20em"}).onNextClose()
if(users&&users[0]){if(!me.currentUsers)me.currentUsers=new Set
else me.currentUsers.clear()
me.currentUsers.add(users[0].account)
const userRef=me.shadowRoot.querySelector("c-userref")
userRef.user=users[0]
let elt
while(elt=DOM.findNextSibling(userRef.parentElement,IS_user))elt.remove()
me.refresh()
me.reg.env.taskEditBroker.dispatchInfo(new InfoChangeTask(me),me)}}onInfo(info){if(info instanceof InfoReqStateTask){if(!info.isDirty&&this.isDirty)info.isDirty=true
if(!info.isInError&&this.isInError&&!this.config.permissive)info.isInError=true
if(info.states&&this.isDirty){if(!info.states.resps)info.states.resps={}
info.states.resps[this.respConf.code]=Array.from(this.currentUsers)}}else if(info instanceof InfoReqFillUpdates){if(this.currentUsers){for(const u of this.currentUsers){if(!this.originalUsers.has(u))info.updates.push(new PutUserResp(u,this.config.resp))}for(const u of this.originalUsers){if(!this.currentUsers.has(u))info.updates.push(new RemoveUserResp(u,this.config.resp))}}}else if(info instanceof InfoChangeTask&&info.field.fieldName==="lcSt"){this.currentLcSt=info.field.value
this.refresh()}}_refresh(){super._refresh()
DOM.setAttrBool(this,"readonly",this.config.editable===false||this.config.writePerms&&!this.reg.hasPerm(this.config.writePerms))
const users=this.shadowRoot.querySelectorAll("c-userref")
const count=users.length
let msg=null
if(count>1&&!this.isCardMulti)msg="Un seul utilisateur doit être renseigné"
else if((count===0||!users.item(0).nickOrAccount)&&this.isRequired)msg=this.isCardMulti?"Au moins un utilisateur doit être renseigné":"Un utilisateur doit être renseigné"
this.msg.setCustomMsg(msg,"error")}}function IS_user(n){return DOM.IS_element(n)&&n.classList.contains("user")}REG.reg.registerSkin("wsp-task-field-users",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t#ctn {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-wrap: wrap;\n\t}\n\n\t.user {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tmargin: .2em;\n\t\tborder: 1px solid var(--border-color);\n\t\tborder-radius: .1em;\n\t\tpadding: .1em;\n\t}\n\n\tc-userref {\n\t\tcolor: var(--edit-color);\n\t}\n\n\tbutton {\n\t\tborder: none;\n\t\tcursor: pointer;\n\t\twidth: 1.2em;\n\t\theight: 1.2em;\n\t\talign-self: center;\n\t\tfont-size: inherit;\n\t}\n\n\t.remUser {\n\t  align-self: flex-start;\n\t  background: transparent no-repeat url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/delete.svg") top;\n\t  background-size: 65%;\n  }\n\n  .addUsers {\n\t  background: transparent no-repeat url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/actions/users/add-user.svg") center;\n\t\theight: var(--icon-size);\n    width: var(--icon-size);\n    min-height: var(--icon-size);\n    min-width: var(--icon-size);\n    background-size: contain;\n }\n\n  .selectUser {\n\t  background: transparent no-repeat var(--dropdown-url) center;\n\t  background-size: 1em 1em;\n  }\n\n  c-msg {\n\t  justify-content: flex-start;\n\t  font-style: italic;\n  }\n\n  [card=single] > .user {\n\t  cursor: pointer;\n\t\tuser-select: none;\n\t}\n\n\t[card=single] > :only-of-type > .remUser {\n\t\tdisplay: none;\n\t}\n\n\t:host([readonly]) button {\n\t\tdisplay: none;\n\t}\n`)
customElements.define("wsp-task-field-users",TaskFieldUsers)
export class TaskXmlField extends BaseElementAsync{get value(){return this.house.document.documentElement}get isDirty(){return this._initedAsDirty||this.house.isDirty}async _initialize(init){try{this.config=init
this.reg=this.findReg(init)
this.fieldName=init.field
if(init.editable!==false){this.reg.env.taskEditBroker.addConsumer(this)
this.setAttribute("editable","")}this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
const wsp=this.reg.env.wsp
const longDesc=this.reg.env.longDesc
const itemType=wsp.wspMetaUi.getItemType(longDesc.itModel)
const dataEditor=itemType.getEditor(init.editorKey)
if(!dataEditor)throw Error("No editor found for task desc: "+init.editorKey)
const editorConfig=Object.assign({},init.editorConfig)
const wedMgrConfig=Object.assign({},init.wedMgrConfig)
if(!wedMgrConfig.fetchContentThreshold)wedMgrConfig.fetchContentThreshold=6e3
if(!wedMgrConfig.dataTransferAnalyzer)wedMgrConfig.dataTransferAnalyzer=WspDataTransferWedAnalyzer.SINGLETON
this.view=new WedEditorBox
if(dataEditor.initReg){this.reg=REG.createSubReg(this.reg)
await dataEditor.initReg(this.reg,this.view)}if(dataEditor.overrideConfigs)await dataEditor.overrideConfigs(editorConfig,wedMgrConfig,this.view)
if(!editorConfig.reg)editorConfig.reg=this.reg
this.view.addAsyncLib(boxTagsDefined)
this.view.addAsyncLib(txtTagsDefined)
this.view.addAsyncLib(ptrItemTagsDefined)
const mainEndP=itemType.getWed(dataEditor.mainWed)
this.view.addAsyncLib(WED.loadWedModel(mainEndP,mainEndP).then(wed=>this.view.wedModel=wed))
wedMgrConfig.readOnlyCauses=[]
editorConfig.hideDiffBar=true
editorConfig.withoutScrolls=true
if(init.editable===false){wedMgrConfig.readOnlyCauses.push("initView")
editorConfig.hideCommonBar=true
editorConfig.hideErrBar=true
editorConfig.hideUnknownBar=true
editorConfig.disableBoxSelection=true
editorConfig.disableVirtuals=true
editorConfig.hideStackBar=true}else if(!this.reg.hasPerm(init.writePerms||"write.task.update")){wedMgrConfig.readOnlyCauses.push("perms")}let doc
const st=this.reg.env.initStates
let schema
if(init.field==="tkDescription"){schema=await itemType.getDesriptionSchema()
if(st&&st.desc){this._initedAsDirty=true
doc=DOM.parseDomValid(st.desc)}if(!doc){const originalDesc=TASK.getDescriptionFromContent(this.reg.env.taskContent)
doc=DOM.newDomDoc()
if(originalDesc)doc.appendChild(doc.importNode(originalDesc,true))
else doc.appendChild(doc.createElementNS(TASK.TASK_NS,TASK.TAG_setDescription))}}else{schema=await itemType.getCommentSchema()
if(st&&st.cmt){this._initedAsDirty=true
doc=DOM.parseDomValid(st.cmt)}if(!doc){doc=DOM.newDomDoc()
doc.appendChild(doc.createElementNS(TASK.TASK_NS,TASK.TAG_addComment))}}this.house=await wsp.wspServer.wspsLive.newLocalHouse({initialDoc:doc,schema:schema,buildOptions:{genAnnots:init.editable!==false,autoMutate:true,autoComplete:true,autoNormXml:true,autoNormChars:true,autoCleanup:true}},wsp)
this.view.initialize(editorConfig)
if(await this.view.initFromDocHolder(new DocHolder(this.house),wedMgrConfig)){this.shadowRoot.appendChild(this.view)}else{throw Error("Init editor failed")}this.house.listeners.on("dirtyChange",()=>{this.reg.env.taskEditBroker.dispatchInfo(new InfoChangeTask(this),this)})}catch(e){console.log(e)
this.closeEditor()}}connectedCallback(){super.connectedCallback()
if(this.fieldName==="tkComment"&&SRC.isNewSrcUri(this.reg.env.longDesc.srcUri)){TASK.hideContextField(this,true)}}onInfo(info){if(info instanceof InfoReqStateTask){switch(this.fieldName){case"tkDescription":if(!info.isInError&&!this.config.permissive)info.isInError=this.house.schemaDom.getAllAnnots().find(a=>a.level.weight>=EAnnotLevel.error.weight)!=null
if(info.states){if(this.isDirty){info.isDirty=true
info.states.desc=DOM.ser(this.house.getDocumentForSave())}}else if(!info.isDirty)info.isDirty=this.isDirty
break
case"tkComment":if(info.states){if(!this.isCommentEmpty()){info.isDirty=true
info.states.cmt=DOM.ser(this.house.getDocumentForSave())}}else if(!info.isDirty)info.isDirty=!this.isCommentEmpty()
break}}else if(info instanceof InfoReqFillUpdates){if(this.isDirty){switch(this.fieldName){case"tkDescription":info.updates.push(new SetDescription(this.value))
break
case"tkComment":if(!this.isCommentEmpty()){info.updates.push(new AddComment(this.value))}break}}}}isCommentEmpty(){let isEmpty=true
this.view.wedMgr.rootWedlet.visitWedletChildren(0,Infinity,w=>{if(w.model.nodeName===TASK.TAG_addComment){w.visitWedletChildren(0,Infinity,w=>{if(w.model.nodeType===ENodeType.element){w.visitWedletChildren(0,Infinity,w=>{if(!w.isEmpty()){isEmpty=false
return"stop"}})
return"stop"}})
return"stop"}})
return isEmpty}closeEditor(){if(this.house){this.reg.env.universe.wspServer.wspsLive.removeLocalHouse(this.house)
this.house=null}if(!this.view){this.view.wedMgr.killEditor()
if(this.view.parentNode)this.view.remove()
this.view=null}}onViewHidden(closed){if(closed)this.closeEditor()}visitViews(visitor){if(this.view)return visitor(this.view)}visitViewsAsync(visitor,options){return this.view?visitor(this.view):Promise.resolve(undefined)}}REG.reg.registerSkin("wsp-task-xmlfield",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t:host([editable]) {\n\t\tborder: 1px solid var(--border-color);\n\t}\n`)
customElements.define("wsp-task-xmlfield",TaskXmlField)
export class TaskSaveBtn extends Button{_initialize(init){this.reg=this.findReg(init)
setDefaultBtn(init,"Valider les modifications","https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/tasks/save.svg")
this.hidden=true
super._initialize(init)
this.onclick=this.onClick
this.reg.env.taskEditBroker.addConsumer(this)}onInfo(info){if(info instanceof InfoChangeTask){this.disabled=info.state.isInError
if(DOM.setHidden(this,!info.state.isDirty)){this.reg.env.srcView.setNeedValid(info.state.isDirty)
this.refresh()}}}async onClick(ev){if(this.hidden)return
if(this.disabled){POPUP.showNotifWarning("Des erreurs doivent être corrigées avant de pouvoir valider les modifications.",this)
return}const env=this.reg.env
const req=new InfoReqFillUpdates
env.taskEditBroker.dispatchInfo(req,this)
if(req.updates.length>0){try{const{srcUri:srcUri}=await(new MsgOver).setStandardMsg("saving").showMsgOver(env.srcView).waitFor(TASK.saveTask(env.wsp,this,SRC.srcRef(env.longDesc),req.updates))
if(srcUri!==env.longDesc.srcUri){this.reg.env.srcView.resetMainView()
this.reg.env.infoBroker.dispatchInfo(new InfoSrcUriMoved(env.longDesc.srcUri,srcUri),this)}}catch(e){ERROR.report("Échec à la validation de la tâche",e)
throw e}}}}customElements.define("wsp-task-save",TaskSaveBtn)
export class TaskCancelBtn extends Button{_initialize(init){this.reg=this.findReg(init)
setDefaultBtn(init,"Annuler les modifications","https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/tasks/cancel.svg")
this.hidden=true
super._initialize(init)
this.onclick=this.onClick
this.reg.env.taskEditBroker.addConsumer(this)}onInfo(info){if(info instanceof InfoChangeTask){this.hidden=!info.state.isDirty||SRC.isNewSrcUri(this.reg.env.longDesc.srcUri)}}async onClick(ev){if(this.hidden)return
if(await POPUP.confirm("Confirmez l\'abandon des modifications de cette tâche",this,{okLbl:"Abandonner mes changements"})){this.reg.env.srcView.redrawMainView()}}}customElements.define("wsp-task-cancel",TaskCancelBtn)
export class TaskDeleteBtn extends Button{_initialize(init){this.reg=this.findReg(init)
setDefaultBtn(init,"Supprimer cette tâche","https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/tasks/delete.svg")
super._initialize(init)
const hasPerm=this.reg.hasPerm("ui.task.fields.deleteBtn")
if(hasPerm){this.onclick=this.onClick
this.reg.env.taskEditBroker.addConsumer(this)}DOM.setAttrBool(this,"hidden",!hasPerm)}onInfo(info){if(info instanceof InfoChangeTask){this.hidden=info.state.isDirty}}async onClick(ev){if(this.hidden)return
if(await POPUP.confirm("Souhaitez-vous vraiment supprimer DÉFINITIVEMENT cette tâche ?",this,{okLbl:"Supprimer"})){const env=this.reg.env;(new MsgOver).setStandardMsg("deleting").showMsgOver(env.srcView).waitFor(TASK.deleteTask(env.wsp,this,[env.longDesc.srcId]))}}}customElements.define("wsp-task-delete",TaskDeleteBtn)
function setDefaultBtn(init,label,icon){if(init.uiContext==="dialog"){if(init.label===undefined)init.label=label}else{if(init.title===undefined)init.title=label}if(init.icon===undefined)init.icon=icon}export class TaskExecTransBtn extends Button{_initialize(init){this.config=init
this.reg=this.findReg(init)
super._initialize(init)
const trans=this.reg.env.itemType.getLcTransition(this.config.transition)
if(trans){this.trans=new SrcExecTransition(trans,this.reg.env.itemType)
this.onclick=this.onClick
if(!this.label)this.label=trans.name}}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
init.transition=this.getAttribute("transition")
init.noConfirm=this.getAttribute("confirm")==="no"
return init}async onClick(ev){if(this.config.noConfirm||await POPUP.confirm(`Confirmez votre choix \'${this.label}\'`,this)){try{await TASK.saveTask(this.reg.env.wsp,this,this.reg.env.longDesc.srcId,[new ExecTrans(this.config.transition)])}catch(e){ERROR.report("Échec à l\'exécution de la transition",e)
throw e}}}_refresh(){if(this.trans&&this.trans.isVisible(this.reg.env.srcView)){DOM.setHidden(this,false)
DOM.setAttrBool(this,"disabled",!this.trans.isEnabled(this.reg.env.srcView))
super._refresh()}else{DOM.setHidden(this,true)}}}customElements.define("wsp-task-exec-trans",TaskExecTransBtn)
export class InfoReqStateTask{}export class InfoChangeTask{constructor(field){this.field=field}get state(){if(!this._state){this._state=new InfoReqStateTask
this.field.reg.env.taskEditBroker.dispatchInfo(this._state,null)}return this._state}}export class InfoReqFillUpdates{constructor(){this.updates=[]}}
//# sourceMappingURL=taskFields.js.map