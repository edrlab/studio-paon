import{BaseElementAsync,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{MxFormElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
import{GridSmall}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{GridDataHolderJsonTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{CellBuilderIconLabel,CellBuilderString}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
export class SkinSetSelector extends(MxFormElement(BaseElementAsync)){async _initialize(init){this.config=init
this.reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.msgElt=sr.appendChild(JSX.createElement(MsgLabel,null))
this.rootConfElt=sr.appendChild(JSX.createElement("form",{name:"skinset"}))
this.tabIndex=-1
this.rootConfElt.appendChild(JSX.createElement("div",null,JSX.createElement("div",{class:"choice"},JSX.createElement("input",{type:"radio",name:"editMode",value:"white",id:"editModeWhite",onchange:this.onChangeEditMode}),JSX.createElement("label",{for:"editModeWhite",title:"Inclure uniquement les éléments sélectionnés"},"Liste d\'inclusions"))))
this.rootConfElt.appendChild(JSX.createElement("div",null,JSX.createElement("div",{class:"choice"},JSX.createElement("input",{type:"radio",name:"editMode",value:"black",id:"editModeBlack",onchange:this.onChangeEditMode}),JSX.createElement("label",{for:"editModeBlack",title:"Tout inclure sauf les éléments sélectionnés"},"Liste d\'exclusions"))))
this.treeElt=this.rootConfElt.appendChild(JSX.createElement(GridSmall,{id:"tree","î":{reg:this.reg,columnDefs:[new GridColDef("selected").setMaxWidth("2em").setMinWidth("2em").setCellBuilder(new CellBuilderSkinSelected("selected")),new GridColDef("icon").setMinWidth("calc(var(--icon-size) * 2)").setFlex("unset").setCellBuilder(new CellBuilderSkinImage),new GridColDef("title").setFlex("1rem",1,1).setMinWidth("10em").setCellBuilder(new CellBuilderIconLabel("title").setIconWidth("0px").setDescriptionFunc(row=>{let version=row.getData("version")
return`Version ${version}`}))],lineDrawer:this,hideHeaders:true,selType:"monoClick",skinScroll:"scroll/small",skinOver:"skinset-grid",noResizableCol:true,dataHolder:new GridDataHolderJsonTree,emptyBody:JSX.createElement("div",{style:"font-style:italic"},"Aucun habillage graphique disponible")},"c-resizable":""}))
this.treeElt.uiEvents.on("rowDblclick",(row,ev)=>{if(!this.disabled)if(ev.target.nodeName!="input"){let line=this.treeElt._getLineFrom(ev.target)
if(line)line.querySelector("input").click()}})
this.treeElt.addEventListener("keypress",ev=>{if(ev.key===" "||ev.key==="Enter"){let line=this.treeElt._getLine(this.treeElt.getSelectedRow())
if(line)line.querySelector("input").click()}})
this.addEventListener("change",this.refreshValidity)
this._initializeForm(init)
await this._refreshAll()}refreshUi(){if(this.initStatus!="pending"){this.reinitializeStarted(this._refreshAll())
this.refreshValidity()}}refreshValidity(){let skinsets=this.treeElt.dataHolder.getDatas()
if(this.editMode==="white"&&!(skinsets===null||skinsets===void 0?void 0:skinsets.find(entry=>entry.selected)))this.setValidity({valueMissing:true},"Veuillez inclure au moins un habillage graphique")
else if(this.editMode==="black"&&!(skinsets===null||skinsets===void 0?void 0:skinsets.find(entry=>!entry.selected)))this.setValidity({valueMissing:true},"Veuillez ne pas exclure au moins un habillage graphique")
else this.setValidity({},"")}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent("change",{cancelable:true,bubbles:true}))}async _refreshAll(){this.addPendingValidity(this)
this.msgElt.setStandardMsg("loading")
try{this.refreshPending=WSP.skinSetsList(this.reg.env.wsp,this,document.documentElement.lang)
this.treeElt.dataHolder.setDatas([])
let skinSets=await this.refreshPending
this.editMode=skinSets.editMode
this.treeElt.dataHolder.setDatas(skinSets.skinSets)
this.msgElt.setStandardMsg(null)
this.refreshValidity()}catch(e){this.msgElt.setCustomMsg("Chargement impossible","error")
await ERROR.log(e)}finally{this.refreshPending=null}}updateState(skins){if((skins===null||skins===void 0?void 0:skins.length)>=1){const currentDatas=this.treeElt.dataHolder.getDatas()
this.editMode=skins[0]
currentDatas.forEach(entry=>entry.selected=skins.includes(entry.code,1))
this.treeElt.dataHolder.setDatas(currentDatas)}}async computeValidity(){await this.refreshPending}formDisabledCallback(val){this.rootConfElt.querySelector("#editModeWhite").disabled=val
this.rootConfElt.querySelector("#editModeBlack").disabled=val
let tree=this.rootConfElt.querySelector("#tree")
if(val)DOM.setAttr(tree,"disabled","true")
else tree.removeAttribute("disabled")
this.refreshUi()}onChangeEditMode(ev){const host=DOMSH.findHost(this)
host.editMode=this.value=="white"?"white":"black"
host.dispatchChangeEvent()}redrawLine(row,line){if(row.rowDatas.selected)DOM.addClass(line,"selected")
else DOM.removeClass(line,"selected")}get editMode(){const tree=this.rootConfElt.querySelector("#tree")
if(tree.classList.contains("modewhite"))return"white"
if(tree.classList.contains("modeblack"))return"black"
return undefined}set editMode(val){const tree=this.rootConfElt.querySelector("#tree")
if(this.editMode!=val){let inputElt
if(val=="white"){DOM.addClass(tree,"modewhite")
DOM.removeClass(tree,"modeblack")
inputElt=this.rootConfElt.querySelector("#editModeWhite")
inputElt.checked=true}else{DOM.addClass(tree,"modeblack")
DOM.removeClass(tree,"modewhite")
inputElt=this.rootConfElt.querySelector("#editModeBlack")
inputElt.checked=true}inputElt.parentNode.parentNode.appendChild(tree)
const dataHolder=this.treeElt.dataHolder
const datas=dataHolder.getDatas()
datas.forEach(entry=>entry.selected=entry.selected?false:true)
dataHolder.setDatas(datas)}}fillSkinSet(){let tree=this.rootConfElt.querySelector("#tree")
let result=[this.editMode]
let skinsets=tree.dataHolder.getDatas()
skinsets.forEach(skinset=>{if(skinset.selected)result.push(skinset.code)})
return result}extractJson(parent){if(parent&&parent[this.config.propsJsonName]){this.updateState(parent[this.config.propsJsonName])
return true}else return false}fillJson(parent,root){if(this.config.propsJsonName){parent[this.config.propsJsonName]=this.fillSkinSet()}}}customElements.define("skinset-selector",SkinSetSelector)
REG.reg.registerSkin("skinset-selector",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\toverflow: auto;\n\t\tuser-select: none;\n\t\tborder: 1px solid transparent;\n\t}\n\n\t:host(:invalid) {\n\t\tborder: 1px solid var(--error-color);\n\t\tbox-shadow: 0 0 2px var(--error-color);\n\t}\n\n\t.choice {\n\t\tdisplay: flex;\n\t\talign-items: center;\n\t}\n\n\t#tree {\n\t\tmargin-top: .2em;\n\t\tmargin-inline-start: 2em;\n\t}\n\n\n`)
REG.reg.registerSkin("skinset-grid",1,`\n\t:host(.modeblack) .line.selected,\n\t:host(.modewhite) .line:not(.selected) {\n\t\ttext-decoration: line-through;\n\t}\n\n\t.colW {\n\t\tborder-color: transparent !important;\n\t}\n\n\t.imgcell {\n\t\ttext-align: center;\n\t}\n\t\n\t.line{\n\t  align-items: center;\n\t}\n\n\timg {\n\t  max-height: calc(var(--icon-size) * 2);\n\t  width: calc(var(--icon-size) * 2);\n\t}\n`)
class CellBuilderSkinSelected extends CellBuilderString{redrawCell(row,root){root.innerText=""
const grid=DOMSH.findHost(root)
const skinSetSelector=DOMSH.findHost(grid)
const line=grid._getLineFrom(root)
function onChangeSelectSkin(ev){const offset=grid.getActiveRow()
let datas=grid.dataHolder.getDataByOffset(offset)
datas.selected=this.checked
grid.invalidateRows(offset,1)
skinSetSelector.dispatchChangeEvent()
ev.preventDefault()}root.appendChild(JSX.createElement("input",{type:"checkbox",disabled:grid.getAttribute("disabled"),checked:this._getValue(row)===true?true:null,onchange:onChangeSelectSkin}))}}class CellBuilderSkinImage{getColSortFn(){return undefined}redrawCell(row,root){const grid=DOMSH.findHost(root)
const reg=REG.findReg(grid)
DOM.setHidden(root,false)
if(!root.firstElementChild){DOM.addClass(root,"imgcell")
root.appendChild(JSX.createElement("img",{onerror:function(ev){DOM.setHidden(this,true)}}))}const img=root.firstElementChild
img.src=WSP.skinSetsIconUrl(reg.env.wsp,row.getData("code"))}}
//# sourceMappingURL=skinSetSelector.js.map