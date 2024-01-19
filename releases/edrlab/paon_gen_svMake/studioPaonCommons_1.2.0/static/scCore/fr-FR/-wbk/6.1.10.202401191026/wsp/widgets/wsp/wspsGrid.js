import{BaseElementAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{CellBuilderString,GridDataHolderJsonArray}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{Grid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
export class WspsGrid extends BaseElementAsync{async _initialize(init){this.reg=this.findReg(init)
this.params=Object.assign({filterHidden:5},init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,this.params)
let headElt=sr.appendChild(JSX.createElement("div",{id:"head"}))
this.filterElt=headElt.appendChild(JSX.createElement("input",{type:"search",spellcheck:"false",placeholder:"Filtrer...",hidden:"",oninput:this.onFilterInput,onkeydown:this.onFilterKeydown}))
this.dataHolder=new GridDataHolderJsonArray
this.grid=sr.appendChild((new Grid).initialize(Object.assign({autoSelOnFocus:"first",hideSortBtns:true,columnDefs:[WSP_COL_TITLE],dataHolder:this.dataHolder,hideHeaders:true,selType:"mono",defaultAction:init.defaultAction,defaultActionCtx:this,emptyBody:()=>JSX.createElement("c-msg",{label:"Aucun atelier",level:"info"})},init.gridInit)))
this.grid.addEventListener("grid-select",this._onGridSelect)
if(init.defaultActionOnClick===true){this.grid.uiEvents.on("rowClick",(row,ev)=>{if(row)this.grid.defaultAction.execute(this.grid.defaultActionCtx)})}return this.refresh()}async _refresh(){this.refreshFreeze(1)
try{super._refresh()
const selectedWsps=this.getSelectedWsps()
this.filterElt.value=""
let wsps=(await WSP.listWsps(this.reg.env.universe.wspServer,{fields:["srcRoles","srcRi"],withWspSrcSpecifiedRoles:true})).wsps
if(this.params.wspMatchFilter)wsps=wsps.filter(entry=>this.params.wspMatchFilter(entry))
wsps.sort((w1,w2)=>(w1.title||w1.wspCd).localeCompare(w2.title||w2.wspCd))
this.dataHolder.setDatas(wsps)
if(selectedWsps)this.selectByJWspInfoInList(selectedWsps)
else this.grid.setSelectedRows(0)
DOM.setHidden(this.filterElt,this.params.filterHidden===true||Number.isInteger(this.params.filterHidden)&&wsps.length<this.params.filterHidden)
if(!this.filterElt.hidden)this.filterElt.focus()
else this.grid.focus()}catch(e){this.dataHolder.setDatas([])
throw e}finally{this.refreshFreeze(-1)}}getSelectedWsp(){if(this.dataHolder){const row=this.dataHolder.getRow(this.grid.getSelectedRow())
if(!row)return null
return row.rowDatas}}getSelectedWsps(){return this.dataHolder&&this.dataHolder.countRows()>0?this.dataHolder.getSelectedDatas():[]}selectByJWspInfoInList(wsps){if(wsps!=null){const selectedRows=[]
for(let i=0,c=this.dataHolder.countRows();i<c;i++){const wspRow=this.dataHolder.getRow(i).rowDatas
if(wspRow&&wsps.find(wsp=>{if(wsp&&wsp.wspCd==wspRow.wspCd)return true})){selectedRows.push(i)}}if(selectedRows.length>0)this.grid.setSelectedRows(selectedRows)
else this.grid.clearSel()}}onFilterInput(ev){const me=DOMSH.findHost(this)
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
ev.stopImmediatePropagation()}}}_onGridSelect(){const me=DOMSH.findHost(this)
if(me.params.onSelChange)me.params.onSelChange(me.getSelectedWsps())}}REG.reg.registerSkin("wsps-grid",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n  :focus-visible {\n\t\toutline: var(--focus-outline);\n\t}\n\n\t#head {\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\t#filter {\n\t\tbackground: .1em / 1em no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/filter.svg);\n\t\tpadding-block: 2px;\n\t\tpadding-inline: 1.2em 2px;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\talign-items: center;\n\t\toverflow: hidden;\n\t\tflex-wrap: wrap;\n\t}\n\n\t#filter > * {\n\t\tmargin-block: 0;\n\t\tmargin-inline: .3rem 0;\n\t}\n\n\t#filter > select {\n\t\tborder: none;\n\t}\n\n\t#filter > input {\n\t\tmin-width: 10em;\n\t\tflex: 1;\n\t  background-color: var(--form-search-bgcolor);\n\t  color: var(--form-color);\n\t\tborder: 1px solid var(--border-color);\n\t  font-size: inherit;\n\t}\n\n\tinput {\n\t\tbackground-color: var(--form-bgcolor);\n\t\tcolor: var(--form-color);\n\t}\n\n\tinput:disabled {\n\t\tbackground-color: transparent;\n\t}\n\n\tc-grid {\n\t\tflex: 1;\n\t\tborder: none;\n\t\tbackground-color: var(--row-bgcolor);\n\t}\n`)
customElements.define("wsps-grid",WspsGrid)
const WSP_COL_TITLE=new GridColDef("title").setLabel("Titre").setDefaultSort(1,"ascendant").setFlex("25em",1,1).setMinWidth("8em").setSortable(true).setCellBuilder(new CellBuilderString("title").override("_getValue",row=>row.rowDatas.title||row.rowDatas.wspCd))

//# sourceMappingURL=wspsGrid.js.map