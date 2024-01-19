import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{MxFormElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
import{ControlAsyncArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
export class JobPlanificatorInput extends(MxFormElement(BaseElement)){_initialize(init){const params=Object.assign({showNoPlanifEntry:false,noPlanifEntryTxt:"Immédiate"},init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
const d=new Date
this._form=sr.appendChild(JSX.createElement("form",{id:"form",autocomplete:"off"}))
if(params.showNoPlanifEntry)this._form.appendChild(JSX.createElement("div",{id:"nowBlock",class:"block",onclick:this.openBlock.bind(this,"now")},JSX.createElement("span",{class:"header"},JSX.createElement("input",{id:"nowIpt",type:"radio",name:"selectMode",value:"now",onchange:this.onchangeBy,checked:true}),JSX.createElement("label",{for:"nowIpt"},params.noPlanifEntryTxt))))
this._form.appendChild(JSX.createElement("div",{id:"byDateBlock",class:"block",onclick:this.openBlock.bind(this,"byDate")},JSX.createElement("span",{class:"header"},JSX.createElement("input",{id:"byDateIpt",type:"radio",name:"selectMode",value:"byDate",onchange:this.onchangeBy,checked:params.showNoPlanifEntry?undefined:true}),JSX.createElement("label",{for:"byDateIpt"},"Planifier le")),JSX.createElement("fieldset",{id:"byDate",class:"content"},JSX.createElement("input",{name:"date",type:"datetime-local",min:d.toISOString().substring(0,d.toISOString().indexOf("T"))}))))
this._form.appendChild(JSX.createElement("div",{id:"byGapBlock",class:"block",onclick:this.openBlock.bind(this,"byGap")},JSX.createElement("span",{class:"header"},JSX.createElement("input",{id:"byGapIpt",type:"radio",name:"selectMode",value:"byGap",onchange:this.onchangeBy}),JSX.createElement("label",{for:"byGapIpt"},"Planifier dans")),JSX.createElement("fieldset",{id:"byGap",class:"content"},JSX.createElement("input",{name:"gap",type:"number",min:"1",size:"3",value:"1"}),JSX.createElement("select",{name:"gapUnit"},JSX.createElement("option",{label:"minute(s)",value:"60000",selected:true}),JSX.createElement("option",{label:"heure(s)",value:"3600000"}),JSX.createElement("option",{label:"jour(s)",value:"86400000‬"})))))
let date=new Date
date.setUTCDate(date.getUTCDate()+1)
date.setUTCMilliseconds(0)
date.setUTCSeconds(0)
date.setUTCMinutes(0)
date.setUTCHours(1)
this._form["date"].valueAsNumber=date.getTime()
this._initializeForm(init)
this.refreshUi()
return this}refreshUi(){let fd=new FormData(this._form)
let selectMode=fd.get("selectMode")
this._form["byDate"].disabled=selectMode!=="byDate"
this._form["byGap"].disabled=selectMode!=="byGap"}openBlock(code){let input=this._form.querySelector("#"+code+"Ipt")
input.checked=true
this.refreshUi()}onchangeBy(ev){const me=DOMSH.findHost(this)
me.refreshUi()}get value(){let fd=new FormData(this._form)
switch(fd.get("selectMode")){case"now":return null
case"byDate":let date=this._form["date"].value
return date?{date:new Date(date).getTime()}:null
case"byGap":let now=Date.now()
return{date:now+Number.parseInt(fd.get("gap"))*Number.parseInt(fd.get("gapUnit"))}}}set value(value){if(value&&value.date){this._form["selectMode"]="byDate"
this._form["date"].valueAsDate=new Date(value.date)}this.refreshUi()}}customElements.define("jobs-planificator-input",JobPlanificatorInput)
REG.reg.registerSkin("jobs-planificator-input",1,`\n\t.block {\n\t\tdisplay: flex;\n\t\talign-items: center;\n\t\tmargin-block-end: .3rem;\n\t}\n\n\t.header {\n\t\tdisplay: inline-flex;\n\t}\n\n\tfieldset {\n\t\tborder: none;\n\t\tdisplay: inline;\n\t\tmargin: 0;\n\t\tpadding: 0;\n\t\tpadding-inline-start: 1em;\n\t}\n\n\t#byGap > select {\n\t\tmargin-inline-start: 1em;\n\t}\n`)
export class JobPlanificatorInputArea extends ControlAsyncArea{constructor(id,params){super(id)
this.params=params
this.setLabel("Planification")
this.setVisible(ctx=>{if(!ctx.reg.env.universe.executor.hasFeature("scheduling"))return false})}async _loadControl(ctx,name){return JSX.createElement(JobPlanificatorInput,{"î":Object.assign({name:this.getId(),showNoPlanifEntry:true,noPlanifEntryTxt:"Exécuter au plus tôt"},this.params)})}}export class JobPriorizationInput extends(MxFormElement(BaseElement)){_initialize(init){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this._form=sr.appendChild(JSX.createElement("form",{id:"form",autocomplete:"off"},JSX.createElement("div",{class:"entry"},JSX.createElement("input",{id:"topIpt",type:"radio",name:"priorization",value:"top",checked:true}),JSX.createElement("label",{for:"topIpt"},"Priorité haute")),JSX.createElement("div",{class:"entry"},JSX.createElement("input",{id:"bottomIpt",type:"radio",name:"priorization",value:"bottom"}),JSX.createElement("label",{for:"bottomIpt"},"Priorité basse"))))
this._initializeForm(init)
this.refreshUi()
return this}refreshUi(){}get value(){return this._form["priorization"].value}set value(value){if(value==="top"||value==="bottom")this._form["priorization"].value=value
else throw"not implemented"
this.refreshUi()}}customElements.define("jobs-priorization-input",JobPriorizationInput)
REG.reg.registerSkin("jobs-priorization-input",1,`\n\t.entry {\n\t\tdisplay: flex;\n\t\talign-items: center;\n\t\tmargin-block-end: .3rem;\n\t}\n`)

//# sourceMappingURL=jobsInput.js.map