import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{InputChoiceArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
export class ModelingBlackListInputArea extends InputChoiceArea{constructor(id,genCode,agenPath){super(id,"checkbox")
this.genCode=genCode
this.agenPath=agenPath
this.setDirection("vertical")}buildBody(ctx){let elt=super.buildBody(ctx)
if(this.getDescription(ctx))elt.title=this.getDescription(ctx)
return elt}_buildControl(ctx,name){const control=JSX.createElement("div",null)
const msg=control.appendChild(JSX.createElement(MsgLabel,{id:"msg","î":{label:"Chargement en cours...",level:"info",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/modeling/views/pending.svg"}}))
const toogleAllChecked=(owner,currentInput)=>{const targetValue=!currentInput.checked
owner.querySelectorAll("input").forEach(entry=>{entry.checked=targetValue})}
var agtPath=SRC.refUri2AgtPath(ctx.shortDesc.srcUri)
const dialogPath="/"+agtPath+"/"+agtPath+"/"+this.agenPath
try{WSP.fetchAskAgt(ctx.wsp,control,this.genCode,dialogPath).then(result=>{try{const entries=result===null||result===void 0?void 0:result.getElementsByTagName("entry")
if(entries&&entries.length){const dataSet={}
for(let i=0;i<entries.length;++i){const key=entries[i].getAttribute("key")
const name=entries[i].getAttribute("name")
dataSet[key]={label:`[${key}] ${name}`}}this.setDataset(dataSet)
const fieldset=super._buildControl(ctx,name)
control.appendChild(fieldset)
fieldset.querySelectorAll("input").forEach(entry=>{})
fieldset.querySelectorAll("label").forEach(entry=>{entry.addEventListener("dblclick",ev=>{toogleAllChecked(fieldset,entry.previousElementSibling)
ev.stopPropagation()
ev.preventDefault()})})
control._isLoaded=true
control.extractJson(control._toExtractValue)
control._toExtractValue=null
msg.setCustomMsg(null)}else msg.setCustomMsg("Aucun","info")}catch(e){ERROR.report(e)
msg.setCustomMsg("Chargement en erreur","error")}})}catch(e){ERROR.report(e)
msg.setCustomMsg("Chargement en erreur","error")}Object.assign(control,{fillJson:function(parent,root){if(this._isLoaded){const skipList=[]
this.querySelectorAll("input").forEach(entry=>{if(!entry.checked)skipList.push(entry.getAttribute("value"))})
parent[name]=skipList.join(" ")}},extractJson:function(parent){var _a
if(this._isLoaded){const skipList=(_a=parent[name])===null||_a===void 0?void 0:_a.split(" ")
this.querySelectorAll("input").forEach(entry=>{entry.checked=!skipList||skipList.indexOf(entry.getAttribute("value"))==-1})}else this._toExtractValue=parent}})
return control}}
//# sourceMappingURL=genParams.js.map