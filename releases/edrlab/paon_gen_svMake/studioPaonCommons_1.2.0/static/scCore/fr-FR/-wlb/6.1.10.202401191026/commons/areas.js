import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{Signboard}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/signboard.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
export function isArea(a){return a&&typeof a.needAsync==="function"&&typeof a.buildBody==="function"}export class Area extends Signboard{needAsync(ctx){return false}buildBody(ctx,lastDatas){return this._body(ctx,this,lastDatas)}async loadBody(ctx,lastDatas){return this.buildBody(ctx,lastDatas)}async loadLibs(ctx){}setBodyBuilder(body){this._body=body
return this}override(name,val){this[name]=val
return this}}export class AreaAsync extends Area{async loadBody(ctx,lastDatas){if(this._libsLoadedIn!==window)await this.loadLibs(ctx)
return this.buildBody(ctx,lastDatas)}needAsync(ctx){var _a
if(this._libsLoadedIn===window)return false
return((_a=this._libs)===null||_a===void 0?void 0:_a.length)>0}async loadLibs(ctx){var _a
if(this._libsLoadedIn===window)return
if((_a=this._libs)===null||_a===void 0?void 0:_a.length)this._modules=await IO.importAllJs(this._libs)
this._libsLoadedIn=window}requireLib(...libs){if(libs){if(!this._libs)this._libs=libs
else IO.appendUrl(this._libs,...libs)}return this}}export function isAreaPointer(h){return h&&h.area!=null}export class SimpleTagArea extends AreaAsync{constructor(customTag,libs,id){super(id||customTag)
this.tagName=customTag
if(libs)Array.isArray(libs)?this.requireLib(...libs):this.requireLib(libs)}buildBody(ctx,lastDatas){const elt=this.newElt(ctx,lastDatas)
if(!this.isVisible(ctx))elt.setAttribute("hidden","")
return elt}newElt(ctx,lastDatas){return document.createElement(this.tagName)}}export class CustomTagArea extends SimpleTagArea{buildBody(ctx,lastDatas){const elt=super.buildBody(ctx,lastDatas)
elt.initialize(this.getInit(ctx))
return elt}setInit(ctx){this._init=ctx
return this}getInit(ctx){if(this._init){if(typeof this._init==="function")return this._init(ctx)
else return this._init}return ctx}}export class CustomAsyncTagArea extends SimpleTagArea{needAsync(ctx){return true}async loadBody(ctx,lastDatas){const body=await super.loadBody(ctx,lastDatas)
body.initialize(this.getInit(ctx))
await body.initializedAsync
return body}setInit(ctx){this._init=ctx
return this}getInit(ctx){if(this._init){if(typeof this._init==="function")return this._init(ctx)
else return this._init}return ctx}}export class AreaOver extends AreaAsync{getSubArea(ctx){return this._subArea||AREAS.NULL}setOverridenSvc(svc){this._subArea=svc
return this}getLabel(ctx){return this._label!==undefined?super.getLabel(ctx):this.getSubArea(ctx).getLabel(ctx)}getDescription(ctx){return this._description!==undefined?super.getDescription(ctx):this.getSubArea(ctx).getDescription(ctx)}getGroup(ctx){return this._group!==undefined?super.getGroup(ctx):this.getSubArea(ctx).getGroup(ctx)}isVisible(ctx){if(this._visible!==undefined)return super.isVisible(ctx)
if(!this.checkObjectRootVisiblePerm(ctx))return false
return this.getSubArea(ctx).isVisible(ctx)}buildBody(ctx,lastDatas){if(this._body)return super.buildBody(ctx,lastDatas)
return this.getSubArea(ctx).buildBody(ctx,lastDatas)}async loadLibs(ctx){await Promise.all([super.loadLibs(ctx),this._subArea.loadLibs(ctx)])}}export class AreaOverFromSvc extends AreaOver{getWrappedSvcCd(){return this._svcCd}setWrappedSvcCd(svcCd){this._svcCd=svcCd
return this}getSubArea(ctx){return REG.getReg(ctx).getSvc(this._svcCd)||AREAS.NULL}}export class MsgArea extends Area{constructor(id,msgInit){super(id)
this.msgInit=msgInit}buildBody(ctx){const msg=JSX.createElement(MsgLabel,{"î":this.msgInit})
msg.setAttribute("area-id",this.getId())
this._iniMsgElement(msg,ctx)
return msg}_iniMsgElement(element,ctx){if(!this.isVisible(ctx))DOM.setHidden(element,true)
if(!this.isEnabled(ctx))element.setAttribute("disabled","")}}export class LabelArea extends Area{buildBody(ctx){const control=this._buildControl(ctx,this.getId())
const body=ctx.buildControlLabel?this._buildControlLabel(control,ctx):control
body.setAttribute("area-id",this.getId())
this._initBodyElement(body,ctx)
return body}_initBodyElement(element,ctx){if(!this.isVisible(ctx))element.hidden=true
const title=this.getDescription(ctx)
if(title)element.title=title}_initStdControl(element,ctx){if(!this.isEnabled(ctx))element.setAttribute("disabled","")}_buildControlLabel(control,ctx,label=this.getLabel(ctx)){return AREAS.buildControlLabel(control,this.getId()+"~"+Math.floor(Math.random()*1e5).toString(36),label)}}export class LabelAsyncArea extends AreaAsync{async loadBody(ctx,lastDatas){const control=await this._loadControl(ctx,this.getId())
const body=this._buildControlLabel?this._buildControlLabel(control,ctx):control
body.setAttribute("area-id",this.getId())
this._initBodyElement(body,ctx)
return body}buildBody(ctx){const control=this._buildControl(ctx,this.getId())
const body=ctx.buildControlLabel?this._buildControlLabel(control,ctx):control
body.setAttribute("area-id",this.getId())
this._initBodyElement(body,ctx)
return body}_initBodyElement(element,ctx){if(!this.isVisible(ctx))DOM.setHidden(element,true)}_initStdControl(element,ctx){if(!this.isEnabled(ctx))element.setAttribute("disabled","")}_buildControlLabel(control,ctx,label=this.getLabel(ctx),desc=this.getDescription(ctx)){const elemId=this.getId()+"~"+Math.floor(Math.random()*1e5).toString(36)
control.id=elemId
return JSX.createElement("div",{class:"ctrlLbl"},JSX.createElement("label",{class:"lbl",for:elemId,title:desc},label),control)}needAsync(ctx){return!("_buildControl"in this)?true:super.needAsync(ctx)}}export class ControlAsyncArea extends LabelAsyncArea{setRequired(required){this._required=required
return this}isRequired(ctx){if(typeof this._required==="function"&&this._required(ctx,this)===true)return true
if(this._required===true)return true
return false}setDefaultValue(defaultValue){this._defaultValue=defaultValue
return this}getDefaultValue(ctx){return typeof this._defaultValue==="function"?this._defaultValue(ctx,this):this._defaultValue}setReadOnly(locked){this._readOnly=locked
return this}isReadOnly(ctx){if(typeof this._readOnly==="function"&&this._readOnly(ctx,this)===true)return true
if(this._readOnly===true)return true
return false}async _initStdControl(input,ctx){if(!this.isVisible(ctx))input.setAttribute("hidden","")
if(!this.isEnabled(ctx))input.setAttribute("disabled","")
if(this.isRequired(ctx))input.setAttribute("required","")
if(this.isReadOnly(ctx))input.setAttribute("readonly","")}}export class DatasetAsyncArea extends ControlAsyncArea{setDataset(dataset){this._dataset=dataset
return this}getDataset(ctx){return typeof this._dataset==="function"?this._dataset(ctx,this):this._dataset}}export class SelectAsyncArea extends DatasetAsyncArea{setMultiple(multiple){this._multiple=multiple
return this}isMultiple(ctx){if(typeof this._multiple==="function"&&this._multiple(ctx,this)===true)return true
if(this._multiple===true)return true
return false}async _loadControl(ctx,name){const selectElt=JSX.createElement("select",{name:name})
selectElt.multiple=this.isMultiple(ctx)
const dataset=await this.getDataset(ctx)
let defaultValue=this.getDefaultValue(ctx)
if(!Array.isArray(defaultValue)){if(defaultValue==null)defaultValue=[]
else defaultValue=[defaultValue]}for(const key in dataset){const data=dataset[key]
const option=selectElt.appendChild(JSX.createElement("option",{value:key},data.label))
option.selected=defaultValue.includes(key)
option.disabled=!this.isEnabled(ctx)||(typeof data.disabled==="function"?data.disabled(ctx,this):data.disabled)
let desc=typeof data.description==="function"?data.description(ctx,this):data.description||""
if(desc)option.title=desc}this._initStdControl(selectElt,ctx)
return selectElt}}export class ControlArea extends LabelArea{setRequired(required){this._required=required
return this}isRequired(ctx){if(typeof this._required==="function"&&this._required(ctx,this)===true)return true
if(this._required===true)return true
return false}setDefaultValue(defaultValue){this._defaultValue=defaultValue
return this}getDefaultValue(ctx){return typeof this._defaultValue==="function"?this._defaultValue(ctx,this):this._defaultValue}setReadOnly(locked){this._locked=locked
return this}isReadOnly(ctx){if(typeof this._locked==="function"&&this._locked(ctx,this)===true)return true
if(this._locked===true)return true
return false}_initStdControl(input,ctx){if(!this.isVisible(ctx))input.setAttribute("hidden","")
if(!this.isEnabled(ctx))input.setAttribute("disabled","")
if(this.isRequired(ctx))input.setAttribute("required","")
if(this.isReadOnly(ctx))input.setAttribute("readonly","")}}REG.reg.registerSkin("form-control-areas",1,`\n\n\t.ctrlLbl {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tmargin: 0.5em 0;\n\t}\n\n\t.lbl {\n\t\twhite-space: nowrap;\n\t\tmin-width: 6em;\n\t\tmargin-inline-end: 0.5em;\n\t\tcolor: var(--alt1-color);\n\t\tuser-select: none;\n\t}\n\n\t.subPanel {\n\t\tmargin-inline-start: 1.5em;\n\t\tpadding-inline-start: 0.5em;\n\t\tborder-inline-start: solid 2px var(--border-color);\n\t}\n\n\tlabel.choicevalue {\n\t\twhite-space: nowrap;\n\t\tmargin-inline-end: 0.5em;\n\t\tuser-select: none;\n\t}\n\n\t.optionslist {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-wrap: wrap;\n\t}\n\n\t.optionslist.vertical {\n\t\tdisplay: grid;\n\t\tgrid-template-columns: auto 1fr;\n\t\tgrid-gap: 0rem .5rem;\n\t\tgrid-auto-rows: max-content;\n\t}\n\n\t.optionslist.vertical label.choicevalue {\n\t\twhite-space: unset;\n\t\tmargin-inline-end: unset;\n\t}\n\n\tinput, textarea, select {\n\t\tflex: 1;\n\t\tmin-width: 0;\n\t\tbackground-color: var(--form-bgcolor);\n\t\tcolor: var(--form-color);\n\t\tborder: 1px solid var(--border-color);\n\t\ttext-overflow: ellipsis;\n\t\tfont-size: inherit;\n\t}\n\n\tinput:disabled, textarea:disabled, select:disabled, .formElt:disabled {\n\t\tbackground-color: transparent;\n\t}\n\n\tinput:focus-visible, textarea:focus-visible, select:focus-visible, .formElt:focus-visible {\n\t\toutline: var(--focus-outline);\n\t}\n\n\tinput:invalid,\n\ttextarea:invalid,\n\tselect:invalid,\n\t.formElt:invalid {\n\t\t/* Pas outline car masque le focus (et le caret si input vide) */\n\t\tborder-color: var(--error-color);\n\t}\n\n\t.formElt {\n\t\t/* Nécessaire pour matérialisation de l'état invalide */\n\t\tborder: 1px solid transparent;\n\t}\n\n\tinput[readonly], textarea[readonly], select[readonly] {\n\t\tbackground-color: transparent;\n\t\tborder: none;\n\t}\n\n\tinput[type=checkbox], input[type=radio] {\n\t\tflex: 0;\n\t\tmin-width: initial;\n\t}\n\n\tinput::placeholder {\n\t\tcolor: var(--fade-color);\n\t\tletter-spacing: 2px;\n\t\tfont-size: .8em;\n\t\tfont-style: italic;\n\t}\n\n\tinput:focus::placeholder {\n\t\tcolor: transparent;\n\t}\n`)
export class SubControlsArea extends ControlArea{constructor(id,areas){super(id)
if(areas)this.setAreas(areas)}setAreas(areas){this._areas=areas
return this}getAreas(ctx){return this._areas}setHideLevel(level){this._hideLevel=level
return this}getHideLevel(ctx){return this._hideLevel}_buildControl(ctx,name){let fieldsetElt=JSX.createElement("fieldset",{name:this._hideLevel===true||this._hideLevel==="formOnly"?null:name})
this._initStdControl(fieldsetElt,ctx)
let areas=this._areas
if(typeof areas=="function")areas=areas(ctx,this)
if(areas&&areas.length){AREAS.applyLayout(fieldsetElt,areas,ctx,true)
fieldsetElt.hidden=false}else fieldsetElt.hidden=true
return fieldsetElt}_buildControlLabel(control,ctx,label=this.getLabel(ctx)){if(this._hideLevel===true||this._hideLevel==="uiOnly")return control
else return super._buildControlLabel(control,ctx,label)}}export class InputArea extends ControlArea{constructor(id,inputType){super(id)
this._inputCustomValidityLatency=0
this._inputCustomValidityReportOnInput=false
this._onInputValiditySheduled=0
if(inputType)this.setInputType(inputType)}getInputType(ctx){return typeof this._inputType==="function"?this._inputType(ctx,this):this._inputType||"hidden"}setInputType(inputType){this._inputType=inputType
return this}setInputCustomValidity(fct,delay,reportOnInput){this._inputCustomValidity=fct
if(reportOnInput)this._inputCustomValidityReportOnInput=reportOnInput
if(delay)this._inputCustomValidityLatency=delay}_buildControl(ctx,name){const input=JSX.createElement("input",{name:name,type:this.getInputType(ctx)})
this._initStdControl(input,ctx)
if(this._inputCustomValidity)input.addEventListener("input",async()=>{if(this._onInputValiditySheduled){clearTimeout(this._onInputValiditySheduled)
this._onInputValiditySheduled=0}input.setCustomValidity("")
this._onInputValiditySheduled=setTimeout(async()=>{input.setCustomValidity(await this._inputCustomValidity.call(input,ctx))
if(this._inputCustomValidityReportOnInput)input.reportValidity()
input.dispatchEvent(new CustomEvent("x-validity-change",{bubbles:true,cancelable:false}))},this._inputCustomValidityLatency)})
const defaultValue=this.getDefaultValue(ctx)
if(defaultValue!=null)input.setAttribute("value",defaultValue)
return input}}export class StringInputArea extends InputArea{constructor(id,inputType="text"){super(id,inputType)}getPlaceholder(ctx){return typeof this._placeholder==="function"?this._placeholder(ctx,this):this._placeholder}setPlaceholder(placeholder){this._placeholder=placeholder
return this}setPattern(pattern){this._pattern=pattern
return this}getPattern(ctx){return typeof this._pattern==="function"?this._pattern(ctx,this):this._pattern}_buildControl(ctx,name){const input=super._buildControl(ctx,name)
const placeholder=this.getPlaceholder(ctx)
if(placeholder)input.setAttribute("placeholder",placeholder)
const pattern=this.getPattern(ctx)
if(pattern)input.setAttribute("pattern",pattern)
return input}}export class HiddenInputArea extends InputArea{constructor(id){super(id,"hidden")}_buildControlLabel(control,ctx,label=this.getLabel(ctx)){return control}}export class BoolCheckInputArea extends InputArea{constructor(id){super(id,"checkbox")
this._checkedValue=true
this._uncheckedValue=false}setCheckedValue(pattern){this._checkedValue=pattern
return this}getCheckedValue(ctx){return typeof this._checkedValue==="function"?this._checkedValue(ctx,this):this._checkedValue}setUncheckedValue(pattern){this._uncheckedValue=pattern
return this}getUncheckedValue(ctx){return typeof this._uncheckedValue==="function"?this._uncheckedValue(ctx,this):this._uncheckedValue}_buildControl(ctx,name){const input=super._buildControl(ctx,name)
const checkedValue=this.getCheckedValue(ctx)
const uncheckedValue=this.getUncheckedValue(ctx)
const checkedByDefault=Boolean(this.getDefaultValue(ctx))
input.checked=checkedByDefault
Object.assign(input,{fillJson:function(parent,root){parent[this.name]=this.checked?checkedValue:uncheckedValue},extractJson:function(parent){const value=parent[this.name]
if(value==checkedValue)this.checked=true
else if(value==null)this.checked=checkedByDefault
else this.checked=false
return true}})
return input}}export class DateInputArea extends InputArea{constructor(id,deltaDays){super(id,"date")
this.deltaDays=deltaDays||0}_buildControl(ctx,name){const input=super._buildControl(ctx,name)
const area=this
Object.assign(input,{fillJson:function(parent,root){const d=this.valueAsNumber
if(d){const date=new Date(d)
date.setMinutes(date.getMinutes()+date.getTimezoneOffset())
if(area.deltaDays)date.setDate(date.getDate()+area.deltaDays)
parent[this.name]=date.getTime()}else{parent[this.name]=0}},extractJson:function(parent){const value=parent[this.name]
if(value>0){const date=new Date(value)
date.setMinutes(date.getMinutes()-date.getTimezoneOffset())
if(area.deltaDays)date.setDate(date.getDate()-area.deltaDays)
this.valueAsNumber=date.getTime()}else this.value=null
return true}})
return input}}export class InputTextArea extends ControlArea{constructor(id){super(id)}getPlaceholder(ctx){return typeof this._placeholder==="function"?this._placeholder(ctx,this):this._placeholder}setPlaceholder(placeholder){this._placeholder=placeholder
return this}_buildControl(ctx,name){const inputElt=JSX.createElement("textarea",{name:name})
const placeholder=this.getPlaceholder(ctx)
if(placeholder)inputElt.setAttribute("placeholder",placeholder)
this._initStdControl(inputElt,ctx)
const defaultValue=this.getDefaultValue(ctx)
if(defaultValue!=null)inputElt.setAttribute("value",defaultValue)
return inputElt}}export class InputJsonArea extends InputTextArea{_buildControl(ctx,name){const control=super._buildControl(ctx,name)
Object.assign(control,{fillJson:function(parent,root){parent[this.name]=this.value?JSON.parse(this.value):null},extractJson:function(parent){const value=parent[this.name]
if(value==null)this.value=""
else if(typeof value=="string")this.value=value
else this.value=JSON.stringify(value)
return true}})
return control}}export class DatasetArea extends ControlArea{setDataset(dataset){this._dataset=dataset
return this}getDataset(ctx){return typeof this._dataset==="function"?this._dataset(ctx,this):this._dataset}}export class InputChoiceArea extends DatasetArea{constructor(id,inputType){super(id)
this._inputType="radio"
this._direction="horizontal"
if(inputType)this.setInputType(inputType)}getInputType(ctx){return typeof this._inputType==="function"?this._inputType(ctx,this):this._inputType||"radio"}setInputType(inputType){this._inputType=inputType
return this}setDirection(value){this._direction=value}setJsonBinderMode(mode){this.jsonBinderMode=mode
return this}_buildControl(ctx,name){let fieldset=JSX.createElement("div",{class:`optionslist ${this._direction}`})
this._initStdControl(fieldset,ctx)
const dataset=this.getDataset(ctx)
let defaultValue=this.getDefaultValue(ctx)
if(!Array.isArray(defaultValue)){if(defaultValue==null)defaultValue=[]
else defaultValue=[defaultValue]}const isGlobalDisabled=fieldset.hasAttribute("disabled")
const fieldType=this.getInputType(ctx)
for(const key in dataset){const data=dataset[key]
const id=name+"_"+key
const input=fieldset.appendChild(JSX.createElement("input",{name:name,type:fieldType,value:key,id:id}))
const label=fieldset.appendChild(JSX.createElement("label",{class:"choicevalue",for:id},data.label))
input.checked=defaultValue.includes(key)
input.disabled=isGlobalDisabled||(typeof data.disabled==="function"?data.disabled(ctx,this):data.disabled)
let desc=typeof data.description==="function"?data.description(ctx,this):data.description||""
if(desc)label.title=input.title=desc}this.initJsonBinders(fieldset,name,this.jsonBinderMode)
return fieldset}initJsonBinders(fieldSet,name,mode){if(!mode)return
if(mode==="boolean"){Object.assign(fieldSet,{fillJson:function(parent,root){let input=this.querySelector("input:checked")
if(input)parent[name]=input.value==="true"},extractJson:function(parent){if(parent[name]){this.querySelector("input[value='true']").checked=true}else{this.querySelector("input[value='false']").checked=true}return true}})}else if(mode==="array"){Object.assign(fieldSet,{fillJson:function(parent,root){const r=[]
DOM.findNext(this,this,n=>{if(n instanceof HTMLInputElement&&n.checked)r.push(n.value)
return false})
parent[name]=r},extractJson:function(parent){const array=parent[name]
if(Array.isArray(array)){DOM.findNext(this,this,n=>{if(n instanceof HTMLInputElement)n.checked=array.indexOf(n.value)>=0
return false})}return true}})}}}export class SelectArea extends DatasetArea{setMultiple(multiple){this._multiple=multiple
return this}isMultiple(ctx){if(typeof this._multiple==="function"&&this._multiple(ctx,this)===true)return true
if(this._multiple===true)return true
return false}_buildControl(ctx,name){const selectElt=JSX.createElement("select",{name:name})
this._initStdControl(selectElt,ctx)
if(this.isReadOnly(ctx))selectElt.setAttribute("disabled","")
selectElt.multiple=this.isMultiple(ctx)
const dataset=this.getDataset(ctx)
let defaultValue=this.getDefaultValue(ctx)
if(!Array.isArray(defaultValue)){if(defaultValue==null)defaultValue=[]
else defaultValue=[defaultValue]}const doLevel=(currentElt,objLevel)=>{for(const key in objLevel){const data=objLevel[key]
if(data.subs){const optiongroup=currentElt.appendChild(JSX.createElement("optgroup",{label:data.label}))
let desc=typeof data.description==="function"?data.description(ctx,this):data.description||""
if(desc)optiongroup.title=desc
if(data.isListEntry){const option=optiongroup.appendChild(JSX.createElement("option",{value:key},data.label))
option.selected=defaultValue.includes(key)
option.disabled=!this.isEnabled(ctx)||(typeof data.disabled==="function"?data.disabled(ctx,this):data.disabled)
let desc=typeof data.description==="function"?data.description(ctx,this):data.description||""
if(desc)option.title=desc}doLevel(optiongroup,data.subs)}else{const option=currentElt.appendChild(JSX.createElement("option",{value:key},data.label))
option.selected=defaultValue.includes(key)
option.disabled=!this.isEnabled(ctx)||(typeof data.disabled==="function"?data.disabled(ctx,this):data.disabled)
let desc=typeof data.description==="function"?data.description(ctx,this):data.description||""
if(desc)option.title=desc}}}
doLevel(selectElt,dataset)
return selectElt}}export class SelectSubPanelArea extends SelectArea{isMultiple(ctx){return false}buildBody(ctx){const area=this
const body=JSX.createElement("div",null)
const control=this._buildControl(ctx,this.getId())
body.appendChild(ctx.buildControlLabel?this._buildControlLabel(control,ctx):control)
const subPanel=body.appendChild(JSX.createElement("div",{class:"subPanel",hidden:true}))
control.addEventListener("change",async ev=>{const select=ev.target
this._selectSubPanel(ctx,subPanel,select.value)})
Object.assign(control,{fillJson:function(parent,root){parent[this.name]=this.value},extractJson:function(parent){this.value=parent[this.name]
area._selectSubPanel(ctx,subPanel,this.value)
return true}})
const defaultValue=this.getDefaultValue(ctx)
if(defaultValue!=null)this._selectSubPanel(ctx,subPanel,defaultValue)
body.setAttribute("area-id",this.getId())
return body}async loadBody(ctx){const area=this
const ctn=JSX.createElement("div",null)
const control=this._buildControl(ctx,this.getId())
ctn.appendChild(ctx.buildControlLabel?this._buildControlLabel(control,ctx):control)
const subPanel=ctn.appendChild(JSX.createElement("div",{class:"subPanel",hidden:true}))
control.addEventListener("change",async ev=>{const select=ev.target
await this._selectSubPanelAsync(ctx,subPanel,select.value)})
Object.assign(control,{fillJson:function(parent,root){parent[this.name]=this.value},extractJson:function(parent){this.value=parent[this.name]
area._selectSubPanel(ctx,subPanel,this.value)
return true}})
const defaultValue=this.getDefaultValue(ctx)
if(defaultValue!=null)await this._selectSubPanelAsync(ctx,subPanel,defaultValue)
return ctn}_selectSubPanel(ctx,subPanel,key){const dataset=this.getDataset(ctx)
let areas=key in dataset&&dataset[key].areas
if(typeof areas=="function")areas=areas(ctx,this)
subPanel.innerHTML=""
if(areas&&areas.length){AREAS.applyLayout(subPanel,areas,ctx,true)
subPanel.hidden=false}else{subPanel.hidden=true}}async _selectSubPanelAsync(ctx,subPanel,key){const dataset=this.getDataset(ctx)
let areas=key in dataset&&dataset[key].areas
if(typeof areas=="function")areas=areas(ctx,this)
if(areas&&areas.length){await AREAS.applyLayout(subPanel,areas,ctx,true)
subPanel.hidden=false}else{subPanel.innerHTML=""
subPanel.hidden=true}}needAsync(ctx){const dataset=this.getDataset(ctx)
for(const key in dataset){let areas=key in dataset&&dataset[key].areas
if(typeof areas=="function")areas=areas(ctx,this)
if(areas)for(const area of areas){if(area.needAsync(ctx))return true}}return false}}export class ActionBtnArea extends Area{constructor(id,svcAction){super(id)
if(svcAction)this.setSvcAction(svcAction)}setSvcAction(svcActionCd){this._svcAction=svcActionCd
return this}setUiContext(uictx){this._uiContext=uictx
return this}getSvcAction(ctx){let action=typeof this._svcAction==="function"?this._svcAction(ctx,this):this._svcAction
if(action&&typeof action==="string")return ctx.reg.getSvc(action)
return action}getUiContext(ctx){return typeof this._uiContext==="function"?this._uiContext(ctx,this):this._uiContext}buildBody(ctx){return ActionBtn.buildButton(this.getSvcAction(ctx),ctx,this.getUiContext(ctx))}}export var AREAS;(function(AREAS){AREAS.NULL=Object.freeze(new Area("#NULL").setVisible(false))
async function applyLayout(root,areasList,ctx,clear=false){const doc=root.ownerDocument
const areasSet=new Set(Array.isArray(areasList)?areasList:Object.values(areasList))
const bodies={}
const idsParents=[],groupsParents=[]
let remainParent=null
const it=doc.createNodeIterator(root,NodeFilter.SHOW_ELEMENT)
let elt
while(elt=it.nextNode()){const ids=elt.getAttribute("area-ids")
if(ids){if(ids!="*"){idsParents.push(elt)
if(elt instanceof HTMLSlotElement&&!elt.name)elt.name=ids}else if(!remainParent){remainParent=elt}if(clear){if(elt instanceof HTMLSlotElement){const assignedNodes=elt.assignedNodes()
assignedNodes.forEach(node=>node.parentNode.removeChild(node))}else{while(elt.firstChild)elt.removeChild(elt.lastChild)}}}const groups=elt.getAttribute("area-groups")
if(groups){groupsParents.push(elt)
if(elt instanceof HTMLSlotElement&&!elt.name)elt.name=groups
if(clear){if(elt instanceof HTMLSlotElement){const assignedNodes=elt.assignedNodes()
assignedNodes.forEach(node=>node.parentNode.removeChild(node))}else{while(elt.firstChild)elt.removeChild(elt.lastChild)}}}}if(!remainParent){remainParent=root
if(clear)while(remainParent.lastChild)remainParent.lastChild.remove()}for(let i=0;i<idsParents.length;i++){const parent=idsParents[i]
const ids=parent.getAttribute("area-ids").split(" ")
for(const area of areasSet){if(ids.includes(area.getId())){const body=area.needAsync(ctx)?await area.loadBody(ctx):area.buildBody(ctx)
if(body){if(parent instanceof HTMLSlotElement&&body instanceof HTMLElement&&root instanceof ShadowRoot){body.slot=parent.name
root.host.appendChild(body)}else{parent.appendChild(body)}bodies[area.getId()]=body}areasSet.delete(area)}}}if(areasSet.size){for(let i=0;i<groupsParents.length;i++){const parent=groupsParents[i]
const groups=parent.getAttribute("area-groups").split(" ")
for(const area of areasSet){const areaGroup=area.getGroup(ctx)
if(areaGroup&&groups.includes(areaGroup)){const body=area.needAsync(ctx)?await area.loadBody(ctx):area.buildBody(ctx)
if(body){if(parent.localName=="slot"&&body instanceof HTMLElement&&root instanceof ShadowRoot){body.slot=parent.name
root.host.appendChild(body)}else{parent.appendChild(body)}bodies[area.getId()]=body}areasSet.delete(area)}}}}if(areasSet.size){for(const area of areasSet){const body=area.needAsync(ctx)?await area.loadBody(ctx):area.buildBody(ctx)
if(body){if(DOM.IS_element(remainParent)&&remainParent.localName=="slot"&&body instanceof HTMLElement&&root instanceof ShadowRoot){root.host.appendChild(body)}else{remainParent.appendChild(body)}bodies[area.getId()]=body}}}return bodies}AREAS.applyLayout=applyLayout
function buildControlLabel(control,id,label){control.id=id
return JSX.createElement("div",{class:"ctrlLbl"},JSX.createElement("label",{class:"lbl",for:id},label),control)}AREAS.buildControlLabel=buildControlLabel})(AREAS||(AREAS={}))

//# sourceMappingURL=areas.js.map