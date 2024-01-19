import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
export function IS_formJsonisable(t){return t&&"fillJson"in t}export function IS_ControlOrFieldSet(n){return n instanceof HTMLInputElement||n instanceof HTMLTextAreaElement||n instanceof HTMLSelectElement||n instanceof HTMLFieldSetElement}export function IS_Field(n){if(IS_formJsonisable(n))return true
return IS_ControlOrFieldSet(n)&&n.name.length>0}const DEFAULT_VALIDITY=Object.freeze({badInput:false,customError:false,patternMismatch:false,rangeOverflow:false,rangeUnderflow:false,stepMismatch:false,tooLong:false,tooShort:false,typeMismatch:false,valid:false,valueMissing:false})
Desk.compatTable.set("formElt",window.ElementInternals&&"setValidity"in window.ElementInternals.prototype)
const disabledModifiedObserver=!Desk.checkCompat("formElt")?new MutationObserver(entries=>{for(const entry of entries){if(entry.type=="attributes"&&entry.attributeName=="disabled"){entry.target.formDisabledCallback(entry.target.hasAttribute("disabled"))}}}):null
export function MxFormElement(Base){if(Desk.checkCompat("formElt")){return class FormElement extends Base{static get formAssociated(){return true}get form(){return this._internals.form}get disabled(){return this.hasAttribute("disabled")}set disabled(val){DOM.setAttrBool(this,"disabled",val)}set indeterminate(val){DOM.setAttrBool(this,"indeterminate",val)}get indeterminate(){return this.hasAttribute("indeterminate")}get required(){return this.hasAttribute("required")}set required(val){DOM.setAttrBool(this,"required",val)
if(this._refreshValidity)this._refreshValidity()}_initializeForm(init){this._internals=this.attachInternals()
if(init.name)this.name=init.name
if(init.disabled)this.disabled=true
if(init.required)this.required=true}extractJson(parent){if(!this.name)return false
this.value=parent[this.name]}fillJson(parent,root){if(!this.name||this.indeterminate)return
parent[this.name]=this.value}checkValidity(){return this._internals.checkValidity()}reportValidity(){return this._internals.reportValidity()}setValidity(flags,message,anchor){return this._internals.setValidity(flags,message,anchor)}get validity(){return this._internals.validity}get validationMessage(){return this._internals.validationMessage}get isValidatingPending(){var _a
return((_a=this._pendingValidities)===null||_a===void 0?void 0:_a.size)>0}addPendingValidity(pending){if(!this._pendingValidities)this._pendingValidities=new Set
this._pendingValidities.add(pending)}async checkAsyncValidity(){if(this._pendingValidities){while(this._pendingValidities.size){const promises=Array.from(this._pendingValidities).map(pending=>pending.computeValidity())
this._pendingValidities.clear()
await Promise.all(promises)}}return this.checkValidity()}}}else{return class FormElementFallback extends Base{constructor(){super(...arguments)
this._validity=DEFAULT_VALIDITY}get form(){return DOM.findParent(this,null,IS_Form)}get disabled(){return this.hasAttribute("disabled")}set disabled(val){DOM.setAttrBool(this,"disabled",val)}set indeterminate(val){DOM.setAttrBool(this,"indeterminate",val)}get indeterminate(){return this.hasAttribute("indeterminate")}get required(){return this.hasAttribute("required")}set required(val){DOM.setAttrBool(this,"required",val)
if(this._refreshValidity)this._refreshValidity()}_initializeForm(init){if(this.formDisabledCallback){if(this.hasAttribute("disabled"))this.formDisabledCallback(true)
disabledModifiedObserver.observe(this,{attributes:true})}if(init.name)this.name=init.name
if(init.disabled)this.disabled=true
if(init.required)this.required=true}extractJson(parent){if(!this.name)return false
this.value=parent[this.name]}fillJson(parent,root){if(!this.name||this.indeterminate)return
parent[this.name]=this.value}checkValidity(){for(const key in DEFAULT_VALIDITY){if(this._validity[key])return false}return true}reportValidity(){if(!this.checkValidity()){if(this._validityAnchor&&IS_ControlOrFieldSet(this._validityAnchor)){const customValidity=this._validityAnchor.validationMessage
this._validityAnchor.setCustomValidity(this.validationMessage)
this._validityAnchor.reportValidity()
this._validityAnchor.setCustomValidity(customValidity)}else{console.error("The validity with fallback implementation of FormElement must have a control anchor.")}return false}return true}setValidity(flags,message,anchor){if(flags)this._validity=Object.freeze(Object.assign(Object.create(DEFAULT_VALIDITY),flags))
else this._validity=DEFAULT_VALIDITY
this._validationMessage=message
this._validityAnchor=anchor}get validity(){return this._validity}get validationMessage(){return this._validationMessage}get isValidatingPending(){var _a
return((_a=this._pendingValidities)===null||_a===void 0?void 0:_a.size)>0}addPendingValidity(pending){if(!this._pendingValidities)this._pendingValidities=new Set
this._pendingValidities.add(pending)}async checkAsyncValidity(){if(this._pendingValidities){while(this._pendingValidities.size){const promises=Array.from(this._pendingValidities).map(pending=>pending.computeValidity())
this._pendingValidities.clear()
await Promise.all(promises)}}return this.checkValidity()}}}}export var FORMS;(function(FORMS){function formToJson(from,parent,root){if(!parent)parent={}
if(!root)root=parent
let tag=DOM.findNext(from,from,IS_Field)
while(tag){fieldToJson(tag,parent,root)
tag=DOM.findNextUncle(tag,from,IS_Field)}return parent}FORMS.formToJson=formToJson
function fieldToJson(tag,parent,root){if(IS_formJsonisable(tag)){tag.fillJson(parent,root)}else if(tag instanceof HTMLInputElement){if(tag.type==="radio"){if(tag.checked)parent[tag.name]=tag.value}else if(tag.type==="checkbox"){parent[tag.name]=tag.checked}else{parent[tag.name]=tag.value}}else if(tag instanceof HTMLTextAreaElement){parent[tag.name]=tag.value}else if(tag instanceof HTMLSelectElement){if(tag.multiple){const array=parent[tag.name]=[]
for(const o of tag.selectedOptions)array.push(o.value)}else{parent[tag.name]=tag.value}}else if(tag instanceof HTMLFieldSetElement){const newP=parent[tag.name]={}
formToJson(tag,newP,root)}}FORMS.fieldToJson=fieldToJson
function jsonToForm(parent,elem,dispatchChange=false,forceClear=false){for(const tag of elem.children){if(IS_Field(tag)){if(IS_formJsonisable(tag)){const changed=tag.extractJson(parent)
if(tag instanceof HTMLInputElement)tag.setCustomValidity("")
if(changed&&dispatchChange&&IS_Field(tag))dispatchChangeEvent(tag)}else if(tag instanceof HTMLInputElement){if(tag.name in parent){tag.setCustomValidity("")
if(tag.type==="radio"){if(tag.value===parent[tag.name])tag.checked=true}else if(tag.type==="checkbox"){tag.checked=parent[tag.name]!=false}else{tag.value=parent[tag.name]}if(dispatchChange)dispatchChangeEvent(tag)}else if(forceClear){tag.setCustomValidity("")
tag.checked=undefined
if(dispatchChange)dispatchChangeEvent(tag)}}else if(tag instanceof HTMLTextAreaElement){if(tag.name in parent){tag.setCustomValidity("")
tag.textContent=parent[tag.name]
if(dispatchChange)dispatchChangeEvent(tag)}else if(forceClear){tag.setCustomValidity("")
tag.textContent=undefined
if(dispatchChange)dispatchChangeEvent(tag)}}else if(tag instanceof HTMLSelectElement){if(tag.name in parent){tag.setCustomValidity("")
const value=parent[tag.name]
if(tag.multiple&&Array.isArray(value)){for(const option of tag.options){if(value.includes(option.value))option.selected=true}}else{tag.value=value}if(dispatchChange)dispatchChangeEvent(tag)}else if(forceClear){tag.setCustomValidity("")
tag.value=undefined}}else if(tag instanceof HTMLFieldSetElement){if(tag.name in parent||forceClear)jsonToForm(parent[tag.name],tag,dispatchChange,forceClear)}}else{jsonToForm(parent,tag,dispatchChange,forceClear)}}}FORMS.jsonToForm=jsonToForm
function checkValidity(root,excludeRoot){if(root instanceof HTMLFormElement){if(!root.checkValidity())return false
if(!Desk.checkCompat("formElt")){let elem=DOM.findNext(root,root,IS_CustomFormElement)
while(elem){if(!elem.checkValidity())return false
elem=DOM.findNext(elem,root,IS_CustomFormElement)}}return true}else{if(!excludeRoot&&IS_ValidableFormElement(root)&&!root.checkValidity())return false
let elem=DOM.findNext(root,root,IS_ValidableFormElement)
while(elem){if(!elem.checkValidity())return false
elem=DOM.findNext(elem,root,IS_ValidableFormElement)}return true}}FORMS.checkValidity=checkValidity
async function checkAsyncValidity(root,excludeRoot){function getPendingValControls(){const controls=[]
if(!excludeRoot&&IS_CustomFormElement(root)&&root.isValidatingPending)controls.push(root)
let elem=DOM.findNext(root,root,IS_CustomFormElement)
while(elem){if(elem.isValidatingPending)controls.push(elem)
elem=DOM.findNext(elem,root,IS_CustomFormElement)}return controls}let pendingValControls=getPendingValControls()
while(pendingValControls.length){await Promise.all(pendingValControls.map(control=>control.checkAsyncValidity()))
pendingValControls=getPendingValControls()}return FORMS.checkValidity(root,excludeRoot)}FORMS.checkAsyncValidity=checkAsyncValidity
function reportValidity(root){if(root instanceof HTMLFormElement){if(!root.reportValidity())return false
if(!Desk.checkCompat("formElt")){let elem=DOM.findNext(root,root,IS_CustomFormElement)
while(elem){if(!elem.reportValidity())return false
elem=DOM.findNext(elem,root,IS_CustomFormElement)}}return true}else{if(IS_ValidableFormElement(root)&&!root.reportValidity())return false
let elem=DOM.findNext(root,root,IS_ValidableFormElement)
while(elem){if(!elem.reportValidity())return false
elem=DOM.findNext(elem,root,IS_ValidableFormElement)}return true}}FORMS.reportValidity=reportValidity
function setFieldsetDisabled(fieldSet,disabled){fieldSet.disabled=disabled
if(!Desk.checkCompat("formElt")){let elem=DOM.findNext(fieldSet,fieldSet,IS_CustomFormElement)
while(elem){elem.disabled=disabled
elem=DOM.findNext(elem,fieldSet,IS_CustomFormElement)}return true}}FORMS.setFieldsetDisabled=setFieldsetDisabled
function findFirstFocusable(form){return DOMSH.findFlatNext(form,form,n=>(n instanceof HTMLInputElement||n instanceof HTMLTextAreaElement)&&DOM.IS_focusable(n))||DOMSH.findFlatNext(form,form,n=>DOM.IS_focusable(n))}FORMS.findFirstFocusable=findFirstFocusable})(FORMS||(FORMS={}))
function dispatchChangeEvent(elem){const ev=document.createEvent("HTMLEvents")
ev.initEvent("change",false,true)
elem.dispatchEvent(ev)}export const IS_Form=function(elt){return elt instanceof HTMLFormElement}
export const IS_CustomFormElement=function(elt){return"setValidity"in elt}
export const IS_ValidableFormElement=function(elt){return"checkValidity"in elt}

//# sourceMappingURL=forms.js.map