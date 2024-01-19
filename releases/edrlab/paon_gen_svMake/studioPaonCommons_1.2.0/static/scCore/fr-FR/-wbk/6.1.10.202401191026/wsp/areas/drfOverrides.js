import{CellBuilderFlagIcon}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SrcAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{UiCritArea,UiCritBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/search/uiCrit.js"
import{ButtonToggle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{ESearchExportColumnStatus,SearchDrfStates,SearchExportColumn,SearchFuncTranslateStr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{renderAppend,xhtml}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/htmlLit.js"
import{RibbonBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/ribbon/ribbon.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{WSP_DRF}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/drf.js"
export class CellBuilderDrfFlag extends CellBuilderFlagIcon{constructor(){super(...arguments)
this.iconWidth=".8rem"
this.iconFilter="var(--filter)"}_getIcon(row){const st=super._getValue(row)
return st?"--drf-"+st+"-url":""}_getValue(row){const st=super._getValue(row)
return st?WSP_DRF.getDrfStateLabel(st):""}}REG.reg.registerSkin("wsp-explorer/grid/drf",1,`\n\t:host {\n\t\t--drf-notOverriden-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drfState/notOverriden.svg);\n\t\t--drf-created-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drfState/created.svg);\n\t\t--drf-overriden-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drfState/overriden.svg);\n\t\t--drf-erased-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drfState/erased.svg);\n\t}\n\n\t.drf {\n\t\tborder: none !important;\n\t}\n`)
export class RevertSrc extends SrcAction{constructor(){super("revertSrc")
this._group="edit"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/drfRevert.svg"
this.atLeastOne=true
this.isNotRemoved=false
this._enableSrcPerms=["action.drf#revert"]}getLabel(ctx){if(ctx.shortDescs.length===0)return"Abandonner toutes les modifications"
if(ctx.shortDescs.every(sd=>sd.drfState==="erased"))return ctx.shortDescs.length===1?"Annuler la suppression":"Annuler les suppressions"
return"Abandonner les modifications"}isEnabled(ctx){if(ctx.shortDescs.some(sd=>{if(ITEM.getSrcUriType(sd.srcUri)!=="space"){const st=sd.drfState
return st!=="overriden"&&st!=="erased"&&st!=="notComputed"}else{return sd.drfState==="created"}}))return false
return super.isEnabled(ctx)}async execute(ctx,ev){const wsp=ctx.reg.env.wsp
if(await this.confirm(ctx,ev)){await WSP_DRF.srcRevert(ctx.reg.env.wsp,ctx.emitter,ctx.shortDescs)}}confirm(ctx,ev){const count=ctx.shortDescs.length
if(count===0)return POPUP.confirm("Confirmez l\'abandon de toutes les modifications de cet atelier de travail. Le contenu original de l\'atelier de référence sera restauré.",ctx.emitter,{okLbl:"Abandonner les modifications"})
return POPUP.confirm(`Confirmez l\'abandon de ces modifications. Le contenu original de l\'atelier de référence sera restauré.`,ctx.emitter,{okLbl:"Abandonner les modifications"})}}RevertSrc.SINGLETON=new RevertSrc
REG.reg.registerSvc("drf/revertAction",1,RevertSrc.SINGLETON)
export class CommitSrc extends SrcAction{constructor(){super("commitSrc")
this._group="edit"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/drfCommit.svg"
this.atLeastOne=true
this.isNotRemoved=false
this._enableSrcPerms=["action.drf#commit"]}getLabel(ctx){if(ctx.shortDescs.length===0)return"Valider toutes les modifications"
if(ctx.shortDescs.every(sd=>sd.drfState==="erased"))return ctx.shortDescs.length===1?"Valider la suppression":"Valider les suppressions"
return"Valider les modifications"}isEnabled(ctx){if(ctx.shortDescs.some(sd=>{if(ITEM.isSrcUriInConflict(sd.srcUri))return true
if(ITEM.getSrcUriType(sd.srcUri)!=="space"){const st=sd.drfState
return st!=="overriden"&&st!=="created"&&st!=="erased"&&st!=="notComputed"}else{return false}}))return false
return super.isEnabled(ctx)}async execute(ctx,ev){const wsp=ctx.reg.env.wsp
if(await this.confirm(ctx,ev)){await WSP_DRF.srcCommit(ctx.reg.env.wsp,ctx.emitter,ctx.shortDescs)}}confirm(ctx,ev){const count=ctx.shortDescs.length
if(count===0)return POPUP.confirm("Confirmez la validation de toutes les modifications de cet atelier de travail.",ctx.emitter,{okLbl:"Valider toutes les modifications"})
if(count===1)return POPUP.confirm("Confirmez la validation de cette modification.",ctx.emitter,{okLbl:"Valider la modification"})
return POPUP.confirm(`Confirmez la validation de ces ${count} modifications.`,ctx.emitter,{okLbl:"Valider les modifications"})}}CommitSrc.SINGLETON=new CommitSrc
REG.reg.registerSvc("drf/commitAction",1,CommitSrc.SINGLETON)
export class RibbonDrf extends RibbonBase{_initialize(init){super._initialize(init)
this.reg.env.longDescChange.add(this.refresh.bind(this))
this.setTooltip(this._tooltip,true)}template(rib){return xhtml`<div class="smallTi">Calque de travail</div><div id="st" data-drf-state="${rib.reg.env.longDesc.drfState}"><img id="ico"/>${WSP_DRF.getDrfStateLabel(rib.reg.env.longDesc.drfState)}</div>`}_tooltip(rib,tooltip){return JSX.createElement("div",{id:"ttRoot"},JSX.createElement(BarActions,{class:"vertical","î":{reg:rib.reg,actions:[rib.reg.getSvc("drf/revertAction"),rib.reg.getSvc("drf/commitAction")],actionContext:rib.shortDescCtx,uiContext:"dialog",disableFullOverlay:true}}))}_refresh(){if(!this.hidden)renderAppend(this.template(this),this.shadowRoot)}}REG.reg.registerSkin("wsp-rib-drf",1,`\n\t:host {\n\t\tflex: 0 1 auto;\n\t\tmargin: 0 .2em;\n\t\t--drf-notOverriden-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drfState/notOverriden.svg);\n\t\t--drf-created-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drfState/created.svg);\n\t\t--drf-overriden-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drfState/overriden.svg);\n\t\t--drf-erased-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drfState/erased.svg);\n\t}\n\n\t#st {\n\t\tflex: 1 0 auto;\n\t\tcolor: var(--alt1-color);\n\t\tfont-weight: bold;\n\t}\n\n\t#ico {\n\t\twidth: 1em;\n\t\theight: 1em;\n\t\tmargin-inline-end: 0.2em;\n\t}\n\n\t#st[data-drf-state='notOverriden'] > #ico {\n\t\tcontent: var(--drf-notOverriden-url);\n\t}\n\n\t#st[data-drf-state='created'] > #ico {\n\t\tcontent: var(--drf-created-url);\n\t}\n\n\t#st[data-drf-state='overriden'] > #ico {\n\t\tcontent: var(--drf-overriden-url);\n\t}\n\n\t#st[data-drf-state='erased'] > #ico {\n\t\tcontent: var(--drf-erased-url);\n\t}\n`)
customElements.define("wsp-rib-drf",RibbonDrf)
export class ItemCritDrfState extends UiCritBase{get notOverriden(){return this._notOverridenBtn.toggleOn}set notOverriden(state){this._notOverridenBtn.toggleOn=state}get overriden(){return this._overridenBtn.toggleOn}set overriden(state){this._overridenBtn.toggleOn=state}get created(){return this._createdBtn.toggleOn}set created(state){this._createdBtn.toggleOn=state}get erased(){return this._erasedBtn.toggleOn}set erased(state){this._erasedBtn.toggleOn=state}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"État du calque de travail"),this.insertAlternativesBtn(init)))
const btnsBox=sr.appendChild(JSX.createElement("div",{class:"btnsbox"}))
this._notOverridenBtn=btnsBox.appendChild(JSX.createElement(ButtonToggle,{onclick:this.toggleButton,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drfState/notOverriden.svg",label:"Inchangés",class:"notOverriden",title:"Items non surchargés dans cet atelier calque de travail","ui-context":"dialog","aria-pressed":"true"}))
this._overridenBtn=btnsBox.appendChild(JSX.createElement(ButtonToggle,{onclick:this.toggleButton,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drfState/overriden.svg",label:"Modifiés",class:"icon overriden",title:"Items surchargés dans cet atelier calque de travail","ui-context":"dialog"}))
this._createdBtn=btnsBox.appendChild(JSX.createElement(ButtonToggle,{onclick:this.toggleButton,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drfState/created.svg",label:"Créés",class:"created",title:"Items créés dans cet atelier calque de travail","ui-context":"dialog"}))
this._erasedBtn=btnsBox.appendChild(JSX.createElement(ButtonToggle,{onclick:this.toggleButton,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drfState/erased.svg",label:"Supprimés",class:"erased",title:"Items supprimés dans cet atelier calque de travail","ui-context":"dialog"}))}async initFromXmlCrit(xml){const states=xml.hasAttribute("drfStates")?xml.getAttribute("drfStates").split(" "):[]
this.notOverriden=states.indexOf("notOverriden")>-1
this.overriden=states.indexOf("overriden")>-1
this.created=states.indexOf("created")>-1
this.erased=states.indexOf("erased")>-1
return this}buildCrit(){const states=[]
if(this.notOverriden)states.push("notOverriden")
if(this.overriden)states.push("overriden")
if(this.created)states.push("created")
if(this.erased)states.push("erased")
return new SearchDrfStates(states)}toggleButton(ev){const me=DOMSH.findHost(this)
this.toggleOn=!this.toggleOn
me.onChange()}}ItemCritDrfState.AREA=new UiCritArea("wsp-itemcrit-drf-state").setLabel("État du calque de travail").setGroup("item").setBuildAbstract((xml,ctx)=>{const statesCodesList=xml.hasAttribute("drfStates")?xml.getAttribute("drfStates").split(" "):[]
const statesLabelsList=[]
if(statesCodesList.indexOf("notOverriden")>-1)statesLabelsList.push("inchangé")
if(statesCodesList.indexOf("overriden")>-1)statesLabelsList.push("modifié")
if(statesCodesList.indexOf("created")>-1)statesLabelsList.push("créé")
if(statesCodesList.indexOf("erased")>-1)statesLabelsList.push("supprimé")
if(statesLabelsList.length>0){const statesTxt=statesLabelsList.join(" ou ")
return JSX.createElement("span",{class:"crit"},"État du calque ",statesTxt)}})
REG.reg.registerSkin("wsp-itemcrit-drf-state",1,`\n\t.btnsbox {\n\t\tdisplay: flex;\n\t\tflex-direction: row;\n\t}\n`)
customElements.define("wsp-itemcrit-drf-state",ItemCritDrfState)
export function initDrfReg(reg){const drfColDef=new GridColDef("drf").setFlex("1rem",0,0).setCellBuilder(new CellBuilderDrfFlag("drfState")).setSkin("wsp-explorer/grid/drf").setLabel("").setDescription("État du calque de travail")
reg.addToList("columns:wspExplorer:secondaryCols","drf",1,drfColDef,10)
reg.addToList("columns:netItems:secondaryCols","drf",1,drfColDef,10)
reg.addToList("columns:wspApp:searches:item","drf",1,drfColDef)
reg.addToList("columns:wspApp:searches-export:item","drf",1,new SearchExportColumn("drf").setColDef(new SearchFuncTranslateStr("drfState").setDict(()=>{const states={erased:WSP_DRF.getDrfStateLabel("erased"),notOverriden:WSP_DRF.getDrfStateLabel("notOverriden"),overriden:WSP_DRF.getDrfStateLabel("overriden"),created:WSP_DRF.getDrfStateLabel("created"),createdDeleted:WSP_DRF.getDrfStateLabel("createdDeleted"),notComputed:WSP_DRF.getDrfStateLabel("notComputed")}
return states})).setLabel("Calque de travail : état").setExportStatus(ESearchExportColumnStatus.exportable))
function addSrcSvcAction(reg,svc,sortKey){reg.addSvcToList("actions:wsp:shortDesc",svc,1,svc,sortKey)}addSrcSvcAction(reg,"drf/revertAction",-2)
addSrcSvcAction(reg,"drf/commitAction",-1)
reg.addToList("ribbon:item","drf",1,RibbonDrf,20)
REG.reg.registerSvc("wsp-itemcrit-drf-state",1,ItemCritDrfState.AREA)
reg.addSvcToList("wsp.crit.items","wsp-itemcrit-drf-state",1,"wsp-itemcrit-drf-state")}
//# sourceMappingURL=drfOverrides.js.map