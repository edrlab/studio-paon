import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{SrcPointerFastSelect,SrcPointerSetterAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcDrawer.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{Action,ActionSeparator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
export class SrcHisto extends Button{setHistory(parent,key){if(this.histoSet.size>0){parent[key]=[...this.histoSet]
return parent}}_initialize(init){var _a
this.srcPointer=init.srcPointer
this.histoSet=new Set(init.history)
super._initialize(init)
this.onclick=this.onClick
this.srcPointer.onSrcRefChange.add(()=>{this.addEntryHisto(this.srcPointer.srcRef)})
if(((_a=init.history)===null||_a===void 0?void 0:_a.length)>0)this.srcPointer.setSrcRef(init.history[init.history.length-1])}addEntryHisto(srcRef){if(!srcRef)return
this.histoSet.delete(srcRef)
if(this.histoSet.size>12){let del=0
for(const s of this.histoSet){this.histoSet.delete(s)
if(++del===12)break}}this.histoSet.add(srcRef)}async onClick(ev){const reg=this.srcPointer.reg
const actions=[]
if(this.histoSet.size>1){const srcRefs=Array.from(this.histoSet)
if(this.srcPointer.srcRef)srcRefs.length--
const srcs=await WSP.fetchShortDescs(reg.env.wsp,this,...srcRefs)
for(const src of srcs){if(src){if(src.srcSt>0&&src.itModel!=null)actions.push(new SrcPointerSetterAction(src))
else this.histoSet.delete(SRC.srcRef(src))}}}if(actions.length===0)actions.push(new Action("none").setEnabled(false).setLabel("Historique vide"))
else actions.reverse()
actions.push(new ActionSeparator,new SrcPointerFastSelect("selOther").setLabel("Autre item..."))
return POPUP.showPopupActionsFromEvent({reg:reg,actions:actions,actionContext:this.srcPointer},ev)}}customElements.define("wsp-src-histo",SrcHisto)

//# sourceMappingURL=srcHisto.js.map