import{BaseElement,BASIS,Label}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{MxFormElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{GridSmall}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{CellBuilderIconLabel,CellBuilderLabel,GridDataHolderJsonArray}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{EGridDropPos,GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
export class InputOrderedSet extends(MxFormElement(BaseElement)){constructor(){super(...arguments)
this._selection=new GridDataHolderJsonArray
this._available=new GridDataHolderJsonArray}get value(){return this._selection.getDatas().map(data=>data.value)}set value(vals){const selection=[]
const available=[]
if(vals)for(const val of vals){if(val in this._dataSet)selection.push(Object.assign({value:val},this._dataSet[val]))
else selection.push({value:val,label:val,notAvailable:true})}for(const entryKey in this._dataSet){if(!vals||!vals.includes(entryKey))available.push(Object.assign({value:entryKey},this._dataSet[entryKey]))}this._selection.setDatas(selection)
this._available.setDatas(available)}get dataSet(){return this._dataSet}set dataSet(dataSet){const val=this.value
const availables=[]
for(const entryKey in dataSet){const data=Object.assign({value:entryKey},dataSet[entryKey])
availables.push(data)}this._available.setDatas(availables)
this._selection.setDatas([])
this._dataSet=dataSet
this.value=val}formDisabledCallback(disabled){DOM.setAttrBool(this._selectionGrid,"disabled",disabled)
DOM.setAttrBool(this._availableGrid,"disabled",disabled)
this._leftBtn.disabled=this._rightBtn.disabled=this._upBtn.disabled=this._downBtn.disabled=disabled}_initialize(init){this._params=init
this.dataSet=init.dataSet
if(init.value)this.value=init.value
const reg=this.findReg(init)
const hasIcon=Object.values(this._dataSet).some(data=>data.icon)
const cellBuilder=hasIcon?new CellBuilderIconLabel("label").setIconKey("icon").override("getIconFilter",row=>row.getData("iconFilter")):new CellBuilderLabel("label")
cellBuilder.setDescriptionFunc(row=>row.getData("description"))
this._selectionGrid=(new GridSmall).initialize(Object.assign({selType:"multi",columnDefs:[new GridColDef("value").setFlex("1rem",1,1).setCellBuilder(cellBuilder)],dataHolder:this._selection,hideHeaders:true,lineDrawer:this,skinOver:"c-input-ordered-set/grid",emptyBody:()=>{if(typeof init.emptySelectionMsg=="string"){return JSX.createElement("c-msg",{label:init.emptySelectionMsg,level:"info"})}else{return JSX.createElement("c-msg",{label:"Aucune sélection",level:"info"})}}},init.selectionGridInit))
this._selectionGrid.id="selectionGrid"
this._selectionGrid.addEventListener("grid-select",this._onGridSelect)
this._initDrag(this._selectionGrid)
this._availableGrid=(new GridSmall).initialize(Object.assign({selType:"multi",columnDefs:[new GridColDef("value").setDefaultSort(1,"ascendant").setFlex("1rem",1,1).setCellBuilder(cellBuilder)],dataHolder:this._available,hideHeaders:true,lineDrawer:this,skinOver:"c-input-ordered-set/grid"},init.availableGridInit))
this._availableGrid.id="availableGrid"
this._availableGrid.addEventListener("grid-select",this._onGridSelect)
this._initDrag(this._availableGrid)
this._leftBtn=JSX.createElement("c-button",{"î":{title:"Ajouter",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/left.svg"},onclick:this._onLeft})
this._rightBtn=JSX.createElement("c-button",{"î":{title:"Enlever",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/right.svg"},onclick:this._onRight})
this._upBtn=JSX.createElement("c-button",{"î":{title:"Haut",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/up.svg"},onclick:this._onUp})
this._downBtn=JSX.createElement("c-button",{"î":{title:"Bas",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/down.svg"},onclick:this._onDown})
this._selectionGrid.uiEvents.on("rowDblclick",this._onDblClick)
this._availableGrid.uiEvents.on("rowDblclick",this._onDblClick)
const toolbar=JSX.createElement("div",{id:"toolbar"},this._leftBtn,this._rightBtn,JSX.createElement("div",{class:"spacer"}),this._upBtn,this._downBtn)
let selectionLabel=null
if(init.selectionLabel){if(typeof init.selectionLabel=="string")selectionLabel=(new Label).initialize({label:init.selectionLabel})
else selectionLabel=(new Label).initialize(init.selectionLabel)
selectionLabel.id="selectionLabel"}let availableLabel=null
if(init.availableLabel){if(typeof init.availableLabel=="string")availableLabel=(new Label).initialize({label:init.availableLabel})
else availableLabel=(new Label).initialize(init.availableLabel)
availableLabel.id="availableLabel"}this._attach(this.localName,init,selectionLabel,this._selectionGrid,toolbar,availableLabel,this._availableGrid)
reg.installSkin("scroll/small",this.shadowRoot)
this._initializeForm(init)
this._refresh()}_onLeft(){if(this.disabled)return
const self=DOMSH.findHost(this)
const count=self._selection.countRows()
self._addToSelection(count)}_onRight(){if(this.disabled)return
const self=DOMSH.findHost(this)
self._removeFromSelection()}_onDblClick(row,ev){const grid=DOMSH.findHost(ev.target)
const self=DOMSH.findHost(grid)
if(grid==self._availableGrid)self._addToSelection(self._selection.countRows())
else if(grid==self._selectionGrid)self._removeFromSelection()}_addToSelection(insertIndex){const selected=this._available.getSelectedDatas()
for(const sel of selected)this._available.deleteRowKey(sel)
this._selection.updateDatas(insertIndex,0,...selected)
this._selectionGrid.setSelectedRows([insertIndex,-(insertIndex+selected.length-1)])
this._refresh()
this._dispatchChange()}_removeFromSelection(){const selected=this._selection.getSelectedDatas()
for(const sel of selected)this._selection.deleteRowKey(sel)
this._available.setDatas(this._available.getDatas().concat(selected))
const available=this._available.getDatas()
for(let i=0;i<available.length;i++){if(selected.includes(available[i]))this._availableGrid.addSelectedRows(i,i)}this._refresh()
this._dispatchChange()}_onUp(){if(this.disabled)return
const self=DOMSH.findHost(this)
const selection=self._selection.getDatas()
if(!selection.length||self._selectionGrid.isRowSelected(0))return
const newSelection=[]
const selectedOffsets=[]
let i=0
while(i<selection.length){const data=selection[i]
i++
while(self._selectionGrid.isRowSelected(i)){newSelection.push(selection[i])
selectedOffsets.push(i-1)
i++}newSelection.push(data)}self._selection.setDatas(newSelection)
self._selectionGrid.setSelectedRows(selectedOffsets)
self._dispatchChange()}_onDown(){if(this.disabled)return
const self=DOMSH.findHost(this)
const selection=self._selection.getDatas()
if(!selection.length||self._selectionGrid.isRowSelected(selection.length-1))return
const newSelection=[]
const selectedOffsets=[]
let i=selection.length-1
while(i>=0){const data=selection[i]
i--
while(self._selectionGrid.isRowSelected(i)){newSelection.unshift(selection[i])
selectedOffsets.push(i+1)
i--}newSelection.unshift(data)}self._selection.setDatas(newSelection)
self._selectionGrid.setSelectedRows(selectedOffsets)
self._dispatchChange()}_onGridSelect(){DOMSH.findHost(this)._refresh()}_dispatchChange(){this.dispatchEvent(new CustomEvent("input",{bubbles:true,cancelable:false}))
this.dispatchEvent(new CustomEvent("change",{bubbles:true,cancelable:false}))}_refresh(){this._leftBtn.disabled=!this._available.getSelectedDatas().length
const hasSelection=this._selection.getSelectedDatas().length
this._rightBtn.disabled=!hasSelection
this._upBtn.disabled=!hasSelection||this._selectionGrid.isRowSelected(0)
this._downBtn.disabled=!hasSelection||this._selectionGrid.isRowSelected(this._selection.countRows()-1)
this._refreshValidity()}_refreshValidity(){const values=this.value
if(this.required&&!this.value.length)this.setValidity({valueMissing:true},"Veuillez sélectionner un élément.",this._selectionGrid)
else if(this._params.checkValidity){const result=this._params.checkValidity.call(this,values)
if(result==true){this.setValidity({})}else{if(typeof result=="string")this.setValidity({valueMissing:true},result)
else this.setValidity({valueMissing:true},"Des groupes sélectionnés sont incompatibles")}}else this.setValidity({})}_initDrag(grid){grid.setRowDropMgr(this)
grid.linesNode.setAttribute("draggable","true")
grid.addEventListener("dragstart",(function(ev){const self=DOMSH.findHost(this)
ev.dataTransfer.effectAllowed="move"
ev.dataTransfer.setDragImage(this._getLine(this.getSelectedRow()),0,0)
self.dragFrom=this}))
grid.addEventListener("dragend",(function(ev){const self=DOMSH.findHost(this)
self.dragFrom=null}))}onDragOverRow(ev,grid,row,line){if(!this.dragFrom||grid==this._availableGrid&&this.dragFrom==this._availableGrid){ev.dataTransfer.dropEffect="none"
return EGridDropPos.none}if(grid==this._selectionGrid&&this.dragFrom==grid&&row){const offset=this._selection.getOffset(row.rowKey)
if(grid.isRowSelected(offset)){ev.dataTransfer.dropEffect="none"
return EGridDropPos.none}}ev.dataTransfer.dropEffect="move"
return row?EGridDropPos.before|EGridDropPos.after:EGridDropPos.after}dropOnRow(ev,grid,row,line,pos){if(grid==this._selectionGrid){let insertIndex=row?this._selection.getOffset(row.rowKey):this._selection.countRows()-1
if(pos===EGridDropPos.after)insertIndex++
if(this.dragFrom!=grid){this._addToSelection(insertIndex)}else{const selected=this._selection.getSelectedDatas()
this._selection.setDatas(this._selection.getUnselectedDatas())
insertIndex=Math.min(insertIndex,this._selection.countRows())
this._selection.updateDatas(insertIndex,0,...selected)
this._selectionGrid.setSelectedRows([insertIndex,-(insertIndex+selected.length-1)])
this._dispatchChange()}}else if(grid==this._availableGrid&&this.dragFrom!=grid){this._removeFromSelection()}}redrawLine(row,line){if(row.rowDatas.notAvailable)line.classList.add("notAvailable")}}REG.reg.registerSkin("c-input-ordered-set",1,`\n\t:host {\n\t\tdisplay: grid;\n\t\tgrid-template-columns: 1fr min-content 1fr;\n\t\tgrid-template-rows: min-content 1fr;\n\t\tgrid-template-areas: "sl . al" "sg tb ag";\n\t\tmin-width: 10em;\n\t\tmin-height: 6em;\n\t}\n\n\tc-grid-small[disabled] {\n\t\tpointer-events: none;\n\t\topacity: .5;\n\t}\n\n\t#selectionGrid {\n\t\tgrid-area: sg;\n\t}\n\n\t#selectionLabel {\n\t\tgrid-area: sl;\n\t}\n\n\t#toolbar {\n\t\tgrid-area: tb;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tflex-direction: column;\n\t}\n\n\t.spacer {\n\t\tflex: 1;\n\t}\n\n\t#availableGrid {\n\t\tgrid-area: ag;\n\t}\n\n\t#availableLabel {\n\t\tgrid-area: al;\n\t}\n\n`)
REG.reg.registerSkin("c-input-ordered-set/grid",1,`\n\t.notAvailable {\n\t\tfont-style: italic;\n\t}\n`)
customElements.define("c-input-ordered-set",InputOrderedSet)
export class InputOrderedSetPanel extends(MxFormElement(BaseElement)){get value(){return this._set.value}set value(vals){this._set.value=vals
this._refresh()}get dataSet(){return this._set.dataSet}set dataSet(dataSet){this._set.dataSet=dataSet
this._refresh()}formDisabledCallback(disabled){this._set.disabled=disabled}_initialize(init){this._params=init
const reg=this.findReg(init)
super._initialize(init)
this._set=(new InputOrderedSet).initialize(init)
this._set.style.flex="1"
this._preview=JSX.createElement("div",{class:"preview","data-preview-mode":init.previewMode})
this._attach(this.localName,init,this._preview)
reg.installSkin("scroll/small",this.shadowRoot)
this.tabIndex=0
this.addEventListener("click",this._onEdit)
BASIS.makeClickable(this)
this._initializeForm(init)
this._refresh()}async _onEdit(){const prevVal=JSON.stringify(this.value)
const popup=POPUP.showMenu(this._set,{elem:this,initWidth:"35em",initHeight:"15em",initMaxHeight:"50vh"},this,{resizer:{},skinOver:"c-input-ordered-set-panel/popup"})
await popup.onNextClose()
if(JSON.stringify(this.value)!=prevVal)this._dispatchChange()
this._refresh()}_dispatchChange(){this.dispatchEvent(new CustomEvent("input",{bubbles:true,cancelable:false}))
this.dispatchEvent(new CustomEvent("change",{bubbles:true,cancelable:false}))}_refresh(){if(this._params.previewMode==="asLines"){this._preview.innerText=""
if(this._set.value.length>0){this._set.value.map(val=>{this._preview.appendChild(JSX.createElement("div",{class:"entry"},this._set.dataSet[val]?this._set.dataSet[val].label:val))})
DOM.removeClass(this._preview,"noEntry")}else{this._preview.innerText=this._params.emptySelectionMsg||"Aucune sélection"
DOM.addClass(this._preview,"noEntry")}}else{if(this._set.value.length>0){this._preview.innerText=this._set.value.map(val=>this._set.dataSet[val]?this._set.dataSet[val].label:val).join(", ")
DOM.removeClass(this._preview,"noEntry")}else{this._preview.innerText=this._params.emptySelectionMsg||"Aucune sélection"
DOM.addClass(this._preview,"noEntry")}}this._refreshValidity()}_refreshValidity(){if(this.required&&!this._set.value.length)this.setValidity({valueMissing:true},"Veuillez renseigner ce champ.")
else if(this._params.checkValidity){const result=this._params.checkValidity.call(this,this._set.value)
if(result==true){this.setValidity({})}else{if(typeof result=="string")this.setValidity({valueMissing:true},result)
else this.setValidity({valueMissing:true},"Des groupes sélectionnés sont incompatibles")}}else this.setValidity({})}}REG.reg.registerSkin("c-input-ordered-set-panel",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tbackground-color: var(--form-bgcolor);\n\t\tborder: 1px solid var(--border-color);\n\t\tuser-select: none;\n\t}\n\n\t:host(:disabled) {\n\t\tbackground-color: transparent;\n\t}\n\n\n  :host(:focus) {\n\t  outline: var(--focus-outline);\n  }\n\n  :host([indeterminate]) {\n\t  opacity: .5;\n  }\n\n  .preview {\n\t  flex: 1;\n\t  overflow-y: auto;\n\t  overflow-x: hidden;\n\t  white-space: nowrap;\n\t  text-overflow: ellipsis;\n\t  min-width: 5rem;\n\t  align-self: center;\n\t  max-height: 4rem;\n  }\n\n\n  .preview[data-preview-mode='asLines'] {\n\t  border-inline-end: 1px solid var(--border-color);\n  }\n\n  .preview[data-preview-mode='asLines'] > .entry {\n\t  margin-inline-end: .2rem;\n  }\n\n  :host::after {\n\t  content: var(--dropdown-url);\n\t  display: flex;\n\t  min-width: auto;\n\t  min-height: auto;\n\t  width: var(--icon-size);\n\t  height: var(--icon-size);\n\t  align-self: center;\n\t  align-items: center;\n\t  justify-content: center;\n  }\n\n  :host([disabled])::after {\n\t  opacity: 0.2;\n  }\n\n  :host(:hover:not([disabled]))::after {\n\t  filter: var(--hover-filter);\n  }\n`)
REG.reg.registerSkin("c-input-ordered-set-panel/popup",1,`\n\t#content {\n\t  min-width: 11em;\n\t  min-height: 7em;\n  }\n\n  ::slotted(c-input-ordered-set) {\n\t  margin: 0.5ex 0.5em;\n  }\n`)
customElements.define("c-input-ordered-set-panel",InputOrderedSetPanel)

//# sourceMappingURL=inputs.js.map