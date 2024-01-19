import{CellBuilderFlagIcon}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{Button,ButtonToggle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{UiCritArea,UiCritBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/search/uiCrit.js"
import{ESearchExportColumnStatus,SearchDrvStates,SearchExportColumn,SearchFuncTranslateStr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{RibbonBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/ribbon/ribbon.js"
import{renderAppend,xhtml}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/htmlLit.js"
import{SrcAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{WSP_DRV}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/drv.js"
export class CellBuilderDrvFlag extends CellBuilderFlagIcon{constructor(){super(...arguments)
this.iconWidth=".8rem"
this.iconFilter="var(--filter)"}_getIcon(row){const st=super._getValue(row)
return st?"--drv-"+st+"-url":""}_getValue(row){const st=super._getValue(row)
return st?WSP_DRV.getDrvStateLabel(st):""}}REG.reg.registerSkin("wsp-explorer/grid/drv",1,`\n\t:host {\n\t\t--drv-notOverriden-url: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/notOverriden.svg");\n\t\t--drv-notOverridenDone-url: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/notOverridenDone.svg");\n\t\t--drv-notOverridenDirty-url: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/notOverridenDirty.svg");\n\t\t--drv-overridenNew-url: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/overridenNew.svg");\n\t\t--drv-overridenDone-url: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/overridenDone.svg");\n\t\t--drv-overridenDirty-url: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/overridenDirty.svg");\n\t\t--drv-createdNew-url: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/createdNew.svg");\n\t\t--drv-createdDone-url: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/createdDone.svg");\n\t\t--drv-createdDirty-url: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/createdDirty.svg");\n\t}\n\n\t.drv {\n\t\tborder: none !important;\n\t}\n`)
export class DeleteDrvOvr extends SrcAction{constructor(){super("deleteDrvOvr")
this._group="edit"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/drvDeleteOvr.svg"
this.atLeastOne=true
this.isNotRemoved=false
this._enableSrcPerms=["action.drv#deleteOvr"]}getLabel(ctx){if(ctx.shortDescs.length===0)return"Supprimer toutes les surcharges"
return"Supprimer les surcharges"}isEnabled(ctx){if(ctx.shortDescs.some(sd=>!sd.drvState.startsWith("overriden")))return false
return super.isEnabled(ctx)}async execute(ctx,ev){const wsp=ctx.reg.env.wsp
if(await this.confirm(ctx,ev)){await WSP_DRV.srcDeleteOverride(ctx.reg.env.wsp,ctx.emitter,ctx.shortDescs)}}confirm(ctx,ev){const count=ctx.shortDescs.length
if(count===0)return POPUP.confirm("Confirmez la suppression de toutes les surcharges de l\'atelier. Les contenus originaux seront restaurés.",ctx.emitter,{okLbl:"Supprimer les surcharges"})
return POPUP.confirm(`Confirmez la suppression des surcharges. Les contenus originaux seront restaurés.`,ctx.emitter,{okLbl:"Supprimer les surcharges"})}}DeleteDrvOvr.SINGLETON=new DeleteDrvOvr
REG.reg.registerSvc("drv/deleteDrvOvrAction",1,DeleteDrvOvr.SINGLETON)
export class MarkDrvDone extends SrcAction{constructor(){super("markDrvDone")
this._label="Marquer la dérivation achevée"
this._group="edit"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/drvDone.svg"
this.atLeastOne=true
this.isNotRemoved=false
this._enableSrcPerms=["action.drv#markDone"]}isEnabled(ctx){if(ctx.shortDescs.some(sd=>sd.drvState.endsWith("Done")))return false
return super.isEnabled(ctx)}async execute(ctx,ev){const wsp=ctx.reg.env.wsp
if(await this.confirm(ctx,ev)){await WSP_DRV.srcMarkDrvDone(ctx.reg.env.wsp,ctx.emitter,ctx.shortDescs)}}confirm(ctx,ev){return POPUP.confirm('Confirmez le marquage \"achevé\" de la dérivation.',ctx.emitter,{okLbl:'Marquer \"achevé\"'})}}MarkDrvDone.SINGLETON=new MarkDrvDone
REG.reg.registerSvc("drv/markDrvDoneAction",1,MarkDrvDone.SINGLETON)
export class RibbonDrv extends RibbonBase{_initialize(init){super._initialize(init)
this.reg.env.longDescChange.add(this.refresh.bind(this))
this.setTooltip(this._tooltip,true)}template(rib){return xhtml`<div class="smallTi">Calque de dérivation</div><div id="st" data-drv-state="${rib.reg.env.longDesc.drvState}"><img id="ico"/><div class="layer">${WSP_DRV.getDrvStateLayer(rib.reg.env.longDesc.drvState)}</div><div class="done">${WSP_DRV.getDrvStateDone(rib.reg.env.longDesc.drvState)}</div></div>`}_tooltip(rib,tooltip){return JSX.createElement("div",{id:"ttRoot"},JSX.createElement(BarActions,{class:"vertical","î":{reg:rib.reg,actions:[rib.reg.getSvc("drv/markDrvDoneAction"),rib.reg.getSvc("drv/deleteDrvOvrAction")],actionContext:rib.shortDescCtx,uiContext:"dialog",disableFullOverlay:true}}))}_refresh(){if(!this.hidden)renderAppend(this.template(this),this.shadowRoot)}}REG.reg.registerSkin("wsp-rib-drv",1,`\n\t:host {\n\t\tflex: 0 1 auto;\n\t\tmargin: 0 .2em;\n\t\t--drv-notOverriden-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/notOverriden.svg);\n\t\t--drv-notOverridenDone-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/notOverridenDone.svg);\n\t\t--drv-notOverridenDirty-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/notOverridenDirty.svg);\n\t\t--drv-overridenNew-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/overridenNew.svg);\n\t\t--drv-overridenDone-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/overridenDone.svg);\n\t\t--drv-overridenDirty-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/overridenDirty.svg);\n\t\t--drv-createdNew-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/createdNew.svg);\n\t\t--drv-createdDone-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/createdDone.svg);\n\t\t--drv-createdDirty-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/createdDirty.svg);\n\t}\n\n\n\t#st {\n\t\tdisplay: grid;\n\t\tgrid-template-columns: min-content 1fr;\n\t\tgrid-template-rows: min-content min-content;\n\t\tgap: 0px 0px;\n\t\tgrid-template-areas:\n    "ico layer"\n    "ico done";\n\t}\n\n\t#layer, #done {\n\t\tflex: 1 0 auto;\n\t\tcolor: var(--alt1-color);\n\t\tfont-weight: bold;\n\t}\n\n\t#layer {\n\t\tgrid-area: layer;\n\t}\n\n\t#done {\n\t\tgrid-area: done;\n\t}\n\n\t#ico {\n\t\tgrid-area: ico;\n\t\talign-self: center;\n\t\twidth: 1em;\n\t\theight: 1em;\n\t\tmargin-inline-end: 0.2em;\n\t}\n\n\t#st[data-drv-state='notOverriden'] > #ico {\n\t\tcontent: var(--drv-notOverriden-url);\n\t}\n\n\t#st[data-drv-state='notOverridenDone'] > #ico {\n\t\tcontent: var(--drv-notOverridenDone-url);\n\t}\n\n\t#st[data-drv-state='notOverridenDirty'] > #ico {\n\t\tcontent: var(--drv-notOverridenDirty-url);\n\t}\n\n\t#st[data-drv-state='overridenNew'] > #ico {\n\t\tcontent: var(--drv-overridenNew-url);\n\t}\n\n\t#st[data-drv-state='overridenDone'] > #ico {\n\t\tcontent: var(--drv-overridenDone-url);\n\t}\n\n\t#st[data-drv-state='overridenDirty'] > #ico {\n\t\tcontent: var(--drv-overridenDirty-url);\n\t}\n\n\t#st[data-drv-state='createdNew'] > #ico {\n\t\tcontent: var(--drv-createdNew-url);\n\t}\n\n\t#st[data-drv-state='createdDone'] > #ico {\n\t\tcontent: var(--drv-createdDone-url);\n\t}\n\n\t#st[data-drv-state='createdDirty'] > #ico {\n\t\tcontent: var(--drv-createdDirty-url);\n\t}\n\n\n`)
customElements.define("wsp-rib-drv",RibbonDrv)
export class ItemCritDrvState extends UiCritBase{get notOverriden(){return this._notOverridenBtn.toggleOn}set notOverriden(state){this._notOverridenBtn.toggleOn=state}get notOverridenDone(){return this._notOverridenDoneBtn.toggleOn}set notOverridenDone(state){this._notOverridenDoneBtn.toggleOn=state}get notOverridenDirty(){return this._notOverridenDirtyBtn.toggleOn}set notOverridenDirty(state){this._notOverridenDirtyBtn.toggleOn=state}get overridenNew(){return this._overridenNewBtn.toggleOn}set overridenNew(state){this._overridenNewBtn.toggleOn=state}get overridenDone(){return this._overridenDoneBtn.toggleOn}set overridenDone(state){this._overridenDoneBtn.toggleOn=state}get overridenDirty(){return this._overridenDirtyBtn.toggleOn}set overridenDirty(state){this._overridenDirtyBtn.toggleOn=state}get createdNew(){return this._createdNewBtn.toggleOn}set createdNew(state){this._createdNewBtn.toggleOn=state}get createdDone(){return this._createdDoneBtn.toggleOn}set createdDone(state){this._createdDoneBtn.toggleOn=state}get createdDirty(){return this._createdDirtyBtn.toggleOn}set createdDirty(state){this._createdDirtyBtn.toggleOn=state}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
const critHead=sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Propriété de dérivation"),this.insertAlternativesBtn(init)))
const gridContainer=sr.appendChild(JSX.createElement("div",{class:"gridContainer"}))
gridContainer.appendChild(JSX.createElement("div",null))
gridContainer.appendChild(JSX.createElement(Button,{onclick:this.toggleColumn,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/new.svg","data-column":"new",title:"Items jamais marqués \'achevés\'","ui-context":"bar"}))
gridContainer.appendChild(JSX.createElement(Button,{onclick:this.toggleColumn,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/done.svg","data-column":"done",title:"Items marqués \'achevés\'","ui-context":"bar"}))
gridContainer.appendChild(JSX.createElement(Button,{onclick:this.toggleColumn,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/dirty.svg","data-column":"dirty",title:"Items à (re)contrôler","ui-context":"bar"}))
gridContainer.appendChild(JSX.createElement(Button,{onclick:this.toggleRow,label:"Non surchargés","data-row":"notOverriden",title:"Items originaux non surchargés dans cette dérivation","ui-context":"bar"}))
this._notOverridenBtn=JSX.createElement(ButtonToggle,{onclick:this.toggleButton,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/notOverriden.svg",class:"notOverriden",title:"Items non surchargés, jamais marqués \'achevés\'"})
this._notOverridenDoneBtn=JSX.createElement(ButtonToggle,{onclick:this.toggleButton,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/notOverridenDone.svg",class:"notOverridenDone",title:"Items non surchargés, marqués \'achevés\'"})
this._notOverridenDirtyBtn=JSX.createElement(ButtonToggle,{onclick:this.toggleButton,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/notOverridenDirty.svg",class:"notOverridenDirty",title:"Items non surchargés, à contrôler","aria-pressed":"true"})
gridContainer.append(JSX.createElement("div",{class:"bg"},this._notOverridenBtn),JSX.createElement("div",{class:"bg"},this._notOverridenDoneBtn),JSX.createElement("div",{class:"bg"},this._notOverridenDirtyBtn))
gridContainer.appendChild(JSX.createElement(Button,{onclick:this.toggleRow,label:"Surchargés","data-row":"overriden",title:"Items surchargés dans cette dérivation","ui-context":"bar"}))
this._overridenNewBtn=JSX.createElement(ButtonToggle,{onclick:this.toggleButton,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/overridenNew.svg",class:"overridenNew",title:"Items surchargés, jamais marqués \'achevés\'"})
this._overridenDoneBtn=JSX.createElement(ButtonToggle,{onclick:this.toggleButton,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/overridenDone.svg",class:"overridenDone",title:"Items surchargés, marqués \'achevés\'"})
this._overridenDirtyBtn=JSX.createElement(ButtonToggle,{onclick:this.toggleButton,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/overridenDirty.svg",class:"overridenDirty",title:"Items surchargés, à contrôler","aria-pressed":"true"})
gridContainer.append(JSX.createElement("div",{class:"bg"},this._overridenNewBtn),JSX.createElement("div",{class:"bg"},this._overridenDoneBtn),JSX.createElement("div",{class:"bg"},this._overridenDirtyBtn))
gridContainer.appendChild(JSX.createElement(Button,{onclick:this.toggleRow,label:"Spécifiques","data-row":"created",title:"Items créés spécifiquement dans cette dérivation","ui-context":"bar"}))
this._createdNewBtn=JSX.createElement(ButtonToggle,{onclick:this.toggleButton,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/createdNew.svg",class:"created",title:"Items spécifiques à cet atelier, jamais marqués \'achevés\'"})
this._createdDoneBtn=JSX.createElement(ButtonToggle,{onclick:this.toggleButton,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/createdDone.svg",class:"createdDone",title:"Items spécifiques à cet atelier, marqués \'achevés\'"})
this._createdDirtyBtn=JSX.createElement(ButtonToggle,{onclick:this.toggleButton,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/drvState/createdDirty.svg",class:"createdDirty",title:"Items spécifiques à cet atelier, à contrôler","aria-pressed":"true"})
gridContainer.append(JSX.createElement("div",{class:"bg"},this._createdNewBtn),JSX.createElement("div",{class:"bg"},this._createdDoneBtn),JSX.createElement("div",{class:"bg"},this._createdDirtyBtn))}async initFromXmlCrit(xml){const states=xml.hasAttribute("drvStates")?xml.getAttribute("drvStates").split(" "):[]
this.notOverriden=states.indexOf("notOverriden")>-1
this.notOverridenDone=states.indexOf("notOverridenDone")>-1
this.notOverridenDirty=states.indexOf("notOverridenDirty")>-1
this.overridenNew=states.indexOf("overridenNew")>-1
this.overridenDone=states.indexOf("overridenDone")>-1
this.overridenDirty=states.indexOf("overridenDirty")>-1
this.createdNew=states.indexOf("createdNew")>-1
this.createdDone=states.indexOf("createdDone")>-1
this.createdDirty=states.indexOf("createdDirty")>-1
return this}buildCrit(){const states=[]
if(this.notOverriden)states.push("notOverriden")
if(this.notOverridenDone)states.push("notOverridenDone")
if(this.notOverridenDirty)states.push("notOverridenDirty")
if(this.overridenNew)states.push("overridenNew")
if(this.overridenDone)states.push("overridenDone")
if(this.overridenDirty)states.push("overridenDirty")
if(this.createdNew)states.push("createdNew")
if(this.createdDone)states.push("createdDone")
if(this.createdDirty)states.push("createdDirty")
return new SearchDrvStates(states)}toggleButton(ev){const me=DOMSH.findHost(this)
this.toggleOn=!this.toggleOn
me.onChange()}toggleRow(){const me=DOMSH.findHost(this)
const row=this.getAttribute("data-row")
if(row=="notOverriden"){const isSelected=me.notOverriden||me.notOverridenDone||me.notOverridenDirty
me.notOverriden=me.notOverridenDone=me.notOverridenDirty=!isSelected}else if(row=="overriden"){const isSelected=me.overridenNew||me.overridenDone||me.overridenDirty
me.overridenNew=me.overridenDone=me.overridenDirty=!isSelected}else if(row=="created"){const isSelected=me.createdNew||me.createdDone||me.createdDirty
me.createdNew=me.createdDone=me.createdDirty=!isSelected}me.onChange()}toggleColumn(){const me=DOMSH.findHost(this)
const column=this.getAttribute("data-column")
if(column=="new"){const isSelected=me.notOverriden||me.overridenNew||me.createdNew
me.notOverriden=me.overridenNew=me.createdNew=!isSelected}else if(column=="done"){const isSelected=me.notOverridenDone||me.overridenDone||me.createdDone
me.notOverridenDone=me.overridenDone=me.createdDone=!isSelected}else if(column=="dirty"){const isSelected=me.notOverridenDirty||me.overridenDirty||me.createdDirty
me.notOverridenDirty=me.overridenDirty=me.createdDirty=!isSelected}me.onChange()}}ItemCritDrvState.AREA=new UiCritArea("wsp-itemcrit-drv-state").setLabel("Propriété de dérivation").setGroup("item").setBuildAbstract((xml,ctx)=>{const statesCodesList=xml.hasAttribute("drvStates")?xml.getAttribute("drvStates").split(" "):[]
const statesLabelsList=[]
if(statesCodesList.indexOf("notOverriden")>-1)statesLabelsList.push("non surchargé, non achevé")
if(statesCodesList.indexOf("notOverridenDone")>-1)statesLabelsList.push("non surchargé, achevé")
if(statesCodesList.indexOf("notOverridenDirty")>-1)statesLabelsList.push("non surchargé, à contrôler")
if(statesCodesList.indexOf("overridenNew")>-1)statesLabelsList.push("surchargé, non achevé")
if(statesCodesList.indexOf("overridenDone")>-1)statesLabelsList.push("surchargé, achevé")
if(statesCodesList.indexOf("overridenDirty")>-1)statesLabelsList.push("surchargé, à contrôler")
if(statesCodesList.indexOf("notOverriden")>-1)statesLabelsList.push("non surchargé")
if(statesCodesList.indexOf("createdNew")>-1)statesLabelsList.push("local, non achevé")
if(statesCodesList.indexOf("createdDone")>-1)statesLabelsList.push("local, achevé")
if(statesCodesList.indexOf("createdDirty")>-1)statesLabelsList.push("local, à contrôler")
if(statesLabelsList.length>0){if(statesLabelsList.length==1){const statesList=JSX.createElement("span",{class:"critVal"},statesLabelsList[0])
return JSX.createElement("span",{class:"crit"},"Propriété de dérivation ",statesList)}else{const returnElt=JSX.createElement("span",{class:"crit"},"Propriétés de dérivation")
returnElt.title="'"+statesLabelsList.join("', ou '")+"'"
return returnElt}}})
REG.reg.registerSkin("wsp-itemcrit-drv-state",1,`\n\t.gridContainer {\n\t\tdisplay: grid;\n\t\tgrid-template-columns: 9em repeat(3, 2.5em);\n\t\tgrid-template-rows: auto;\n\t}\n\n\t.bg {\n\t\tpadding: .2em;\n\t\tbackground-color: var(--form-bgcolor);\n\t\t--pressed-bgcolor: rgba(255, 255, 0, 0.2);\n\t}\n`)
customElements.define("wsp-itemcrit-drv-state",ItemCritDrvState)
export function initDrvReg(reg){const drvColDef=new GridColDef("drv").setFlex("1em",0,0).setCellBuilder(new CellBuilderDrvFlag("drvState")).setSkin("wsp-explorer/grid/drv").setLabel("").setDescription("État du calque de dérivation")
reg.addToList("columns:wspExplorer:secondaryCols","drv",1,drvColDef,10)
reg.addToList("columns:netItems:secondaryCols","drv",1,drvColDef,10)
reg.addToList("columns:wspApp:searches:item","drv",1,drvColDef)
reg.addToList("columns:wspApp:searches-export:item","drv",1,new SearchExportColumn("drv").setColDef(new SearchFuncTranslateStr("drvState").setDict(()=>{const states={erased:WSP_DRV.getDrvStateLabel("erased"),notOverriden:WSP_DRV.getDrvStateLabel("notOverriden"),notOverridenDone:WSP_DRV.getDrvStateLabel("notOverridenDone"),createdDone:WSP_DRV.getDrvStateLabel("createdDone"),overridenDone:WSP_DRV.getDrvStateLabel("overridenDone"),createdNew:WSP_DRV.getDrvStateLabel("createdNew"),overridenNew:WSP_DRV.getDrvStateLabel("overridenNew"),notOverridenDirty:WSP_DRV.getDrvStateLabel("notOverridenDirty"),createdDirty:WSP_DRV.getDrvStateLabel("createdDirty"),overridenDirty:WSP_DRV.getDrvStateLabel("overridenDirty"),createdNotComputed:WSP_DRV.getDrvStateLabel("createdNotComputed"),notComputed:WSP_DRV.getDrvStateLabel("notComputed")}
return states})).setLabel("Calque de dérivation : état").setExportStatus(ESearchExportColumnStatus.exportable))
function addSrcSvcAction(reg,svc,sortKey){reg.addSvcToList("actions:wsp:shortDesc",svc,1,svc,sortKey)}addSrcSvcAction(reg,"drv/deleteDrvOvrAction",-2)
addSrcSvcAction(reg,"drv/markDrvDoneAction",-1)
reg.addToList("ribbon:item","drv",1,RibbonDrv,20)
REG.reg.registerSvc("wsp-itemcrit-drv-state",1,ItemCritDrvState.AREA)
reg.addSvcToList("wsp.crit.items","wsp-itemcrit-drv-state",1,"wsp-itemcrit-drv-state")}
//# sourceMappingURL=drvOverrides.js.map