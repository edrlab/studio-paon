import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{GridSmall}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{CellBuilderEnum,CellBuilderString,GridDataHolderJsonArray}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
export class WspsMonitoring extends BaseElement{async _initialize(init){this.config=init
this.reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.grid=sr.appendChild(new GridSmall)
this.dataHolder=new GridDataHolderJsonArray
this.dataHolder.connectToGrid(this.grid)
let statusMap=new Map
this.config.states.forEach(entry=>{statusMap.set(entry.key,entry.label)})
this.grid.initialize({lineDrawer:this,skinScroll:"scroll/small",dataHolder:this.dataHolder,noResizableCol:true,selType:"none",skinOver:"wspsmonitoringr-grid",hideHeaders:true,emptyBody:()=>JSX.createElement("c-msg",null,"Aucune information disponible"),columnDefs:[new GridColDef("title").setLabel("Titre").setFlex("25em",1,1).setMinWidth("8em").setCellBuilder(new CellBuilderString("title").override("_getValue",row=>row.rowDatas.wsp.wspTitle||"[Non titré]")),new GridColDef("status").setLabel("Statut").setFlex("6em",1,1).setMinWidth("4em").setCellBuilder(new CellBuilderEnum("monitoringState",statusMap).setCellClass("center"))]})
return this.redrawTree()}redrawTree(wsps,defaultStateKey){if(wsps)this.config.wsps=wsps
if(defaultStateKey)this.config.defaultStateKey=defaultStateKey
let datas=[]
this.config.wsps.forEach(entry=>{let entryData=Object.create(entry.infoWsp||entry.infoWspError)
if(this.config.defaultStateKey)entryData.monitoringState=this.config.defaultStateKey
datas.push(entryData)})
this.dataHolder.setDatas(datas)}updateWspStatus(wspCode,stateKey,ensureVisible=true){let datas=this.dataHolder.getDatas()
let wspMonitoringEntry=datas.find(entry=>entry.wsp.code===wspCode)
if(wspMonitoringEntry){wspMonitoringEntry.monitoringState=stateKey
const offset=this.dataHolder.getOffset(wspMonitoringEntry)
this.grid.invalidateRows(offset,1)
if(ensureVisible)this.grid.ensureRowVisible(offset)}}redrawLine(row,line){const stateKey=row.rowDatas.monitoringState
const stateEntry=this.config.states.find(entry=>entry.key===stateKey)
if(stateEntry)DOM.setAttr(line,"level",stateEntry.level)
else line.removeAttribute("level")}}customElements.define("wsps-monitoring",WspsMonitoring)
REG.reg.registerSkin("wsps-monitoring",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tjustify-content: center;\n\t\toverflow: auto;\n\t}\n`)
REG.reg.registerSkin("wspsmonitoringr-grid",1,`\n\t*[level=disabled] {\n\t\tcolor: var(--fade-color);\n\t\tfont-style: italic;\n\t}\n\n\t*[level=warning] {\n\t\tcolor: var(--warning-color);\n\t}\n\n\t*[level=error] {\n\t\tcolor: var(--error-color);\n\t}\n\n\t*[level=success] {\n\t\tcolor: var(--valid-color);\n\t}\n\n\t*[level=pending] {\n\t\tfont-weight: bold;\n\t}\n\n`)

//# sourceMappingURL=wspsMonitoring.js.map