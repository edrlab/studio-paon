import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{GridDataHolderJsonArray}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{GridSmall}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{renderAppend,xhtml}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/htmlLit.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{Wsp,WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/views_Perms.js"
import{WSPPACK}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/pack.js"
export class WspList extends BaseElement{constructor(){super(...arguments)
this.action=new Action}get disabled(){return true}_initialize(init){this.reg=this.findReg(init)
this.universe=this.reg.env.universe
this._datas=new GridDataHolderJsonArray
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.tabIndex=0
this._filterInput=sr.appendChild(JSX.createElement("div",{id:"search",hidden:""})).appendChild(JSX.createElement("input",{type:"search",spellcheck:"false",placeholder:"Filtrer...",oninput:this.onFilterInput,onkeydown:this.onFilterKeydown}))
this._grid=sr.appendChild((new GridSmall).initialize({hideHeaders:true,selType:"monoOver",columnDefs:[new GridColDef("wsps").setFlex("90vw",0,1).setCellBuilder(this)],dataHolder:this._datas,emptyBody:()=>{if(this._fetchState==="fetchFailed")return JSX.createElement("c-msg",{level:"error",label:"Chargement en échec"})
if(this._fetchState==="fetchDone"){if(this._filterInput.value)return JSX.createElement("c-msg",{level:"info",label:"Aucun atelier pour ce filtre"})
return JSX.createElement("c-msg",{level:"info",label:"Aucun atelier disponible"})}return JSX.createElement("c-msg",{level:"info",label:"Chargement en cours..."})},skinOver:"wsp-list/c-grid",skinScroll:"scroll/small"}))
this._grid.setAttribute("id","grid")
this._datas.connectToGrid(this._grid)
this._grid.uiEvents.on("rowClick",(row,ev)=>{if(row)this.gotoWsp(row.rowDatas,ev)})
this._grid.addEventListener("keydown",(function(ev){if(ev.key===" "||ev.key==="Enter"){const row=this.dataHolder.getRow(this.getSelectedRow())
if(row)DOMSH.findHost(this).gotoWsp(row.rowDatas,ev)}else if(ev.key.length===1){DOMSH.findHost(this)._filterInput.focus()}}))
const defaultMode=WSP.defaultWspOpenMode(this.reg)
this._defaultAction=defaultMode?new OpenWsp(defaultMode):null
const altMode=WSP.alternateWspOpenMode(this.reg)
this._actionsInCell=altMode&&altMode!==defaultMode?[new OpenWsp(altMode).setLabel(null)]:null
this.cellTpl=this.reg.getSvc("wspListCellTpl")||((row,wspList,reg)=>{const wspInfo=row.rowDatas
const wspReg=REG.createSubReg(reg,new Wsp(reg.env.universe.wspServer,wspInfo.wspCd,wspInfo))
const wspCanOpen=wspReg.hasPerm("action.wspList#open.wsp")&&(wspReg.hasPerm("ui.wspApp")||wspReg.hasPerm("ui.wspDocApp"))
let wspInfoTxt
if(!wspCanOpen){wspInfoTxt="Accès non autorisé"}else{switch(wspInfo.status){case"ok":wspInfoTxt=wspInfo.wspTypeWarn==="unknown"?"Modèle inconnu":WSPPACK.buildWspDefTitle(wspInfo.wspType,{lang:false,version:false})
break
case"failed":wspInfoTxt="Modèle en erreur"
break
default:wspInfoTxt=wspInfo.wspType?WSPPACK.buildWspDefTitle(wspInfo.wspType,{lang:false,version:false}):"..."}}const actionsToolbar=(new BarActions).initialize({actions:this._actionsInCell,uiContext:"bar",actionContext:{reg:wspReg}})
actionsToolbar.addEventListener("click",ev=>{ev.preventDefault()
ev.stopImmediatePropagation()})
return xhtml`
<span id="icon" aria-disabled="${!wspCanOpen}" class="${(wspInfo.props.drfRefWsp?"drf":wspInfo.props.drvMasterWsp?"drv":"wsp")+(wspInfo.props.publicWsp==="true"?" public":"")}"/>
<div id="body" aria-disabled="${!wspCanOpen}">
	<span id="title">${wspInfo.title||wspInfo.wspCd}</span>
	<div id="wspType">${wspInfoTxt}</div>
</div>
${actionsToolbar}`})
this.fetchDatas()}async fetchDatas(){this._fetchState="fetching"
try{const datas=await WSP.listWsps(this.universe.wspServer,{fields:["srcRoles","srcRi"]})
datas.wsps.sort((w1,w2)=>(w1.title||w1.wspCd).localeCompare(w2.title||w2.wspCd))
DOM.setHidden(this._filterInput.parentElement,datas.wsps.length<8)
this._fetchState="fetchDone"
this._datas.setDatas(datas.wsps)
this._grid.setSelectedRows(0)
this._grid.focus()}catch(e){this._fetchState="fetchFailed"
this._datas.setDatas([])
throw e}}gotoWsp(wspInfo,ev){if(!wspInfo||!this._defaultAction)return
this._defaultAction.executeIfAvailable({reg:REG.createSubReg(this.reg,new Wsp(this.reg.env.universe.wspServer,wspInfo.wspCd,wspInfo))},ev)
this.dispatchEvent(new CustomEvent("c-actioned",{detail:{actionable:{action:this._defaultAction}},bubbles:true,composed:true}))}focus(){this._grid.focus()}redrawCell(row,root){const sh=root.shadowRoot||this._buildCell(root)
renderAppend(this.cellTpl(row,this,this.reg),sh)}_buildCell(root){if(this._defaultAction)root.title=this._defaultAction.getDescription(this)
const sh=root.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("wsp-list/cellInList",sh)
return sh}onFilterInput(ev){const me=DOMSH.findHost(this)
const text=this.value
if(text){const pattern=new RegExp(LANG.escape4RegexpFuzzy(text),"i")
if(!me._filterdDatas)me._filterdDatas=new GridDataHolderJsonArray
const fullArr=me._datas.getDatas()
const arr=[]
for(let i=0,s=fullArr.length;i<s;i++){const v=fullArr[i]
if(pattern.test(v.title||v.wspCd))arr.push(v)}me._filterdDatas.setDatas(arr)
if(me._grid.dataHolder!==me._filterdDatas)me._grid.dataHolder=me._filterdDatas}else{me._grid.dataHolder=me._datas}}onFilterKeydown(ev){if(ev.key==="ArrowDown"){const me=DOMSH.findHost(this)
if((me._filterdDatas||me._datas).countRows()>0){me._grid.setSelectedRows(0)
me._grid.focus()
ev.preventDefault()
ev.stopImmediatePropagation()}}}getColSortFn(){return null}}export class OpenWsp extends Action{constructor(wspAppMode,id){super(id||"wspOpen")
this.wspAppMode=wspAppMode
this._label="Ouvrir..."
this._description=wspAppMode==="wspApp"?"Ouvrir l\'atelier en mode explorateur":"Ouvrir l\'atelier en mode plan"
this.setIcon(wspAppMode==="wspApp"?"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/spaceTree/tree.svg":"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/toc/toc.svg")
this.requireEnabledPerm("action.wspList#open.wsp")
this.requireVisiblePerm(wspAppMode==="wspApp"?"ui.wspApp":"ui.wspDocApp")}isVisible(ctx){if(!ctx.reg.env.wsp)return false
return super.isVisible(ctx)}async execute(ctx,ev){const infoWsp=ctx.reg.env.wsp.infoWsp||ctx.reg.env.wsp.infoWspError
const{OpenPropsWspAction:OpenPropsWspAction}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/wspActions.js")
if(infoWsp&&infoWsp.status==="failed"){POPUP.showNotifError("Cet atelier est en erreur et ne peut pas être ouvert. Veuillez vérifier ses propriétés.",document.body);(new OpenPropsWspAction).executeIfAvailable(ctx)}else if(infoWsp&&infoWsp.wspTypeWarn==="unknown"){POPUP.showNotifForbidden("Le modèle documentaire de cet atelier est inconnu : son ouverture est impossible. Veuillez vérifier les propriétés de l\'atelier.",document.body);(new OpenPropsWspAction).executeIfAvailable(ctx)}else{desk.findAndOpenApp(this.wspAppMode==="wspApp"?{u:ctx.reg.env.universe.getId(),wsp:ctx.reg.env.wsp.code}:{u:ctx.reg.env.universe.getId(),wspDoc:ctx.reg.env.wsp.code},ev)}}}REG.reg.registerSkin("wsp-list",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t#search {\n\t\tpadding: .3em;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\tinput {\n\t\tbackground: .1em / 1em no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/filter.svg) var(--form-search-bgcolor);\n\t\tbackground-position: left;\n\t\tcolor: var(--form-color);\n\t\tborder: none;\n\t\tpadding-block: .2em;\n\t\tpadding-inline: 1.2em .2em;\n\t\twidth: 100%;\n\t\tfont-size: inherit;\n\t}\n\n\tinput:focus {\n\t\toutline: none;\n\t}\n\n\tinput::placeholder {\n\t\tcolor: var(--fade-color);\n\t\tletter-spacing: 2px;\n\t\tfont-size: .8em;\n\t\tfont-style: italic;\n\t}\n\n\tinput:focus::placeholder {\n\t\tcolor: transparent;\n\t}\n\n\t#grid {\n\t\tborder: none;\n\t}\n\n\t#grid:focus {\n\t\toutline: none;\n\t}\n`)
REG.reg.registerSkin("wsp-list/c-grid",1,`\n\t.inSel {\n\t\tbackground-color: var(--row-bgcolor);\n\t}\n\n\tc-msg {\n\t\tmargin: .2em .5em;\n\t}\n`)
REG.reg.registerSkin("wsp-list/cellInList",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\talign-items: center;\n\t}\n\n\t*[aria-disabled=true] {\n\t\topacity: 70%;\n\t}\n\n\t#icon {\n\t\theight: 1.2em;\n\t\twidth: 1.2em;\n\t\tmin-width: 1.2em;\n\t\tfilter: var(--filter);\n\t}\n\n\t.wsp {\n\t\tbackground: url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/wsp/wsp.svg') no-repeat center/contain;\n\t}\n\n\t.wsp.public {\n\t\tbackground: url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/lockOpen.svg') no-repeat top right/.7em, url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/wsp/wsp.svg') no-repeat center/contain;\n\t}\n\n\t.drf {\n\t\tbackground: url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/wsp/wspDrf.svg') no-repeat center/contain;\n\t}\n\n\t.drf.public {\n\t\tbackground: url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/lockOpen.svg') no-repeat top right/.7em, url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/wsp/wspDrf.svg') no-repeat center/contain;\n\t}\n\n\t.drv {\n\t\tbackground: url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/wsp/wspDrv.svg') no-repeat center/contain;\n\t}\n\n\t.drv.public {\n\t\tbackground: url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/lockOpen.svg') no-repeat top right/.7em, url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/wsp/wspDrv.svg') no-repeat center/contain;\n\t}\n\n\t#body {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tmargin-inline-start: .3em;\n\t\tmargin-block: .2em;\n\t\tmax-width: 40vw;\n\t}\n\n\t#title {\n\t\tflex: 1;\n\t\toverflow: hidden;\n\t\ttext-overflow: ellipsis;\n\t}\n\n\t#wspType {\n\t\tfont-size: .7em;\n\t\tcolor: var(--fade-color);\n\t}\n\n\tc-action:not(:hover) {\n\t\tbackground-color: var(--row-bgcolor);\n\t}\n`)
customElements.define("wsp-list",WspList)

//# sourceMappingURL=wspList.js.map