import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{Action,ActionSeparator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
export class InputPeriod extends BaseElement{set currentMode(v){this._currentMode=v
if(this.initialized)this.dispatchEvent(new CustomEvent("change",{bubbles:true,cancelable:false}))}get currentMode(){return this._currentMode}_initialize(init){const reg=this.findReg(init)
this.mode=JSX.createElement("c-button-actions",{"î":{reg:reg,actions:init.modes||this.buildDefaultModes(),actionContext:this,label:init.defaultLabel||"Période..."}})
this.date1=JSX.createElement("input",{type:"date",hidden:"true"})
this.betweenTxt=JSX.createElement("span",{hidden:"true"})
this.date2=JSX.createElement("input",{type:"date",hidden:"true"})
this._attach(this.localName,init,this.mode,this.date1,this.betweenTxt,this.date2)
if(init.defaultDate1>0)this.date1.valueAsNumber=init.defaultDate1
if(init.defaultDate2>0)this.date2.valueAsNumber=init.defaultDate2
if(init.defaultMode)init.defaultMode.execute(this)}reset(modeId,date1,date2){if(!this.initialized)throw"InputPeriod must be initialized for be reseted"
this._currentMode=this.mode.actions.find(act=>act.getId()===modeId)
if(date1>0)this.date1.valueAsNumber=date1
if(date2>0)this.date2.valueAsNumber=date2
if(this._currentMode)this._currentMode.execute(this)
this.dispatchEvent(new CustomEvent("change",{bubbles:true,cancelable:false}))}isSpecified(){return this._currentMode?this._currentMode.isSpecified(this):false}getMoreThan(exclude){return this._currentMode?this._currentMode.getMoreThan(exclude,this):null}getLessThan(exclude){return this._currentMode?this._currentMode.getLessThan(exclude,this):null}buildDefaultModes(){return[new InputPeriodSince("sinceToday",0).setLabel("Aujourd\'hui"),new InputPeriodSince("sinceYesterday",1).setLabel("Depuis hier"),new InputPeriodSince("since1Week",7).setLabel("Depuis une semaine"),new InputPeriodSince("since1Month",31).setLabel("Depuis un mois"),new InputPeriodFrom("since").setLabel("Depuis le...").setSelectedLabel("Depuis le"),new ActionSeparator,new InputPeriodOlder("older1Month",31).setLabel("Il y a plus d\'un mois"),new InputPeriodOlder("older6Month",184).setLabel("Il y a plus de 6 mois"),new InputPeriodOlder("older1year",365).setLabel("Il y a plus d\'un an"),new InputPeriodBefore("before").setLabel("Avant le...").setSelectedLabel("Avant le"),new ActionSeparator,new InputPeriodFromTo("between").setLabel("Entre le...").setSelectedLabel("Entre le"),new ActionSeparator,new InputPeriod_None("none").setLabel("Aucune limite").setSelectedLabel("Période...")]}static buildDefaultModes_futurAndPast(){return[new InputPeriodOlder("beforeToday",0).setLabel("Avant aujourd\'hui"),new InputPeriodOlder("beforeTomorrow",-1).setLabel("Avant demain"),new InputPeriodOlder("before1Week",-7).setLabel("Avant une semaine"),new InputPeriodOlder("before1Month",-31).setLabel("Avant un mois"),new InputPeriodOlder("older1Month",31).setLabel("Il y a plus d\'un mois"),new InputPeriodOlder("older6Month",184).setLabel("Il y a plus de 6 mois"),new InputPeriodOlder("older1year",365).setLabel("Il y a plus d\'un an"),new InputPeriodBefore("before").setLabel("Avant le...").setSelectedLabel("Avant le"),new ActionSeparator,new InputPeriodSince("sinceToday",0).setLabel("À partir d\'aujourd\'hui"),new InputPeriodSince("sinceYesterday",-1).setLabel("À partir de demain"),new InputPeriodSince("since1Week",-7).setLabel("Dans une semaine ou plus"),new InputPeriodSince("since1Month",-31).setLabel("Dans un mois ou plus"),new InputPeriodSince("sinceYesterday",1).setLabel("Depuis hier"),new InputPeriodSince("since1Week",7).setLabel("Depuis une semaine"),new InputPeriodSince("since1Month",31).setLabel("Depuis un mois"),new InputPeriodFrom("since").setLabel("Depuis le...").setSelectedLabel("Depuis le"),new ActionSeparator,new InputPeriodFromTo("between").setLabel("Entre le...").setSelectedLabel("Entre le"),new ActionSeparator,new InputPeriod_None("none").setLabel("Aucune limite").setSelectedLabel("Période...")]}static buildDefaultModes_futur(){return[new InputPeriodOlder("beforeToday",0).setLabel("Avant aujourd\'hui"),new InputPeriodOlder("beforeTomorrow",-1).setLabel("Avant demain"),new InputPeriodOlder("before1Week",-7).setLabel("Avant une semaine"),new InputPeriodOlder("before1Month",-31).setLabel("Avant un mois"),new InputPeriodBefore("before").setLabel("Avant le...").setSelectedLabel("Avant le"),new ActionSeparator,new InputPeriodSince("sinceToday",0).setLabel("À partir d\'aujourd\'hui"),new InputPeriodSince("sinceYesterday",-1).setLabel("À partir de demain"),new InputPeriodSince("since1Week",-7).setLabel("Dans une semaine ou plus"),new InputPeriodSince("since1Month",-31).setLabel("Dans un mois ou plus"),new InputPeriodFrom("since").setLabel("Depuis le...").setSelectedLabel("Depuis le"),new ActionSeparator,new InputPeriodFromTo("between").setLabel("Entre le...").setSelectedLabel("Entre le"),new ActionSeparator,new InputPeriod_None("none").setLabel("Aucune limite").setSelectedLabel("Période...")]}}REG.reg.registerSkin("c-input-period",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\talign-items: center;\n\t}\n\n\tinput {\n\t\tmargin-inline-start: .5em;\n\t\tmargin-inline-end: .5em;\n\t}\n\n\t:host(:not([disabled])) c-button-actions {\n\t\tbackground-color: var(--form-bgcolor);\n\t\tborder: 1px solid var(--border-color);\n\t}\n`)
customElements.define("c-input-period",InputPeriod)
export class InputPeriodAction extends Action{setSelectedLabel(label){this.selectedLabel=label
return this}isSpecified(ctx){return true}getMoreThan(exclude,ctx){return null}getLessThan(exclude,ctx){return null}execute(ctx,ev){ctx.mode.label=this.selectedLabel||this.getLabel(ctx)
ctx.currentMode=this}}export class InputPeriod_None extends InputPeriodAction{isSpecified(ctx){return false}execute(ctx,ev){super.execute(ctx)
DOM.setHidden(ctx.date1,true)
DOM.setHidden(ctx.betweenTxt,true)
DOM.setHidden(ctx.date2,true)}}export class InputPeriod_0_Action extends InputPeriodAction{execute(ctx,ev){super.execute(ctx)
DOM.setHidden(ctx.date1,true)
DOM.setHidden(ctx.betweenTxt,true)
DOM.setHidden(ctx.date2,true)}}export class InputPeriod_1_Action extends InputPeriodAction{isSpecified(ctx){return!!ctx.date1.value}execute(ctx,ev){super.execute(ctx)
DOM.setHidden(ctx.date1,false)
DOM.setHidden(ctx.betweenTxt,true)
DOM.setHidden(ctx.date2,true)}}export class InputPeriod_2_Action extends InputPeriodAction{constructor(){super(...arguments)
this.betweenLabel=" et le "}isSpecified(ctx){return!!ctx.date1.value&&!!ctx.date2.value}setBetweenLabel(label){this.betweenLabel=label
return this}execute(ctx,ev){super.execute(ctx)
DOM.setHidden(ctx.date1,false)
if(this.betweenLabel){ctx.betweenTxt.textContent=this.betweenLabel
DOM.setHidden(ctx.betweenTxt,false)}else{DOM.setHidden(ctx.betweenTxt,true)}DOM.setHidden(ctx.date2,false)}}export class InputPeriodSince extends InputPeriod_0_Action{constructor(id,days){super(id)
this.days=days}getMoreThan(exclude,ctx){const d=new Date
d.setDate(d.getDate()-this.days)
d.setHours(0,0,0,0)
return exclude?d.getTime()-1:d.getTime()}}export class InputPeriodOlder extends InputPeriodSince{getMoreThan(exclude,ctx){return null}getLessThan(exclude,ctx){const d=new Date
d.setDate(d.getDate()-this.days)
d.setHours(0,0,0,0)
return exclude?d.getTime():d.getTime()-1}}export class InputPeriodFrom extends InputPeriod_1_Action{getMoreThan(exclude,ctx){const d=new Date(ctx.date1.value)
d.setHours(0,0,0,0)
return exclude?d.getTime()-1:d.getTime()}}export class InputPeriodBefore extends InputPeriod_1_Action{getLessThan(exclude,ctx){const d=new Date(ctx.date1.value)
d.setHours(0,0,0,0)
return exclude?d.getTime():d.getTime()-1}}export class InputPeriodFromTo extends InputPeriod_2_Action{getMoreThan(exclude,ctx){const d=new Date(ctx.date1.value)
d.setHours(0,0,0,0)
return exclude?d.getTime()-1:d.getTime()}getLessThan(exclude,ctx){const d=new Date(ctx.date2.value)
d.setDate(d.getDate()+1)
d.setHours(0,0,0,0)
return exclude?d.getTime():d.getTime()-1}}
//# sourceMappingURL=inputPeriod.js.map