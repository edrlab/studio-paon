import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{CellBuilderIconLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{GridSmall}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{EFolderState,GridColTreeDef,GridDataHolderJsonTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{isDirResType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/res.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
export class ResTypesTree extends BaseElement{constructor(){super(...arguments)
this.forbidHideSelRow=false}getSelectedResType(){const row=this.dataHolder.getRow(this.grid.getSelectedRow())
if(!row)return null
return isDirResType(row.rowDatas)?null:row.rowDatas}getSelectedResTypes(){return this.dataHolder.getSelectedDatas().filter(pData=>!isDirResType(pData))}selectFirst(){for(let i=0,c=this.dataHolder.countRows();i<c;i++){const row=this.dataHolder.getRow(i)
if(!isDirResType(row.rowDatas)){this.grid.setSelectedRows(i)
return true}else if(row.getFolderState()===EFolderState.closed){this.dataHolder.openFolder(row.rowKey)
c=this.dataHolder.countRows()}}return false}findAndSelect(filter){const findAndSel=ch=>{if(!ch)return null
for(let entry of ch){if(isDirResType(entry)){const found=findAndSel(entry.children)
if(found)return found}else if(filter(entry)){this.selectByResTypes(entry)
return entry}}}
return findAndSel(this.dataHolder.getDatas())}selectByProcessing(...prcs){if(prcs!=null){const selectedRows=[]
for(let i=0,c=this.dataHolder.countRows();i<c;i++){const resType=this.dataHolder.getRow(i).rowDatas
if(!isDirResType(resType)&&prcs.indexOf(resType.prc)>-1)selectedRows.push(i)}this.grid.setSelectedRows(selectedRows)}}selectByResTypes(...resTypes){if(resTypes!=null){const selectedRows=[]
for(let i=0,c=this.dataHolder.countRows();i<c;i++){const resType=this.dataHolder.getRow(i).rowDatas
if(!isDirResType(resType)&&resTypes.indexOf(resType)>-1)selectedRows.push(i)}this.grid.setSelectedRows(selectedRows)}}countResTypesUntil(threshold,filter){let count=0
for(let i=0,c=this.dataHolder.countRows();i<c;i++){if(!isDirResType(this.dataHolder.getRow(i).rowDatas)&&(!filter||filter(this.dataHolder.getRow(i).rowDatas))){count++
if(count>=threshold)return count}}return count}_initialize(init){this.reg=this.findReg(init)
this.datas=init.resTypes||this.reg.env.resTypes.getResTypesTree(init.resTypeFilter)
this.dataHolder=new GridDataHolderJsonTree("children").setDefaultOpenState((function(e){return e.closed!==true})).setDatas(this.datas)
const colDefs=[new GridColTreeDef("tree").setFlex("1rem",1,1).setMinWidth("55px").setCellBuilder(new CellBuilderResType)]
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
if(init.textFilter!=null&&this.countResTypesUntil(5)==5){if(init.forbidHideSelectedRow)this.forbidHideSelRow=true
this.collator=new Intl.Collator("fr",{usage:"search",sensitivity:"base"})
this.search=sr.appendChild(JSX.createElement("input",{type:"search",spellcheck:"false",oninput:this.onSearchInput,onkeydown:this.onKeyPress}))}this.grid=sr.appendChild((new GridSmall).initialize(Object.assign({columnDefs:colDefs,dataHolder:this.dataHolder,hideHeaders:true},init.grid)))
if(init.textFilter){this.filterText(this.search.value=init.textFilter)
if(this.countResTypesUntil(1)===0){this.filterText("")}}}clearSearch(){if(this.search&&this.search.value!=""){this.search.value=""
this.search.dispatchEvent(new CustomEvent("input"))}}onSearchInput(ev){const tree=DOMSH.findHost(this)
tree.filterText(this.value)}onKeyPress(ev){if(ev.key==="ArrowDown"){const tree=DOMSH.findHost(this)
if(tree.grid.getSelectedRow()!==undefined)tree.grid.focus()}}filterText(val){const selectedItemsTypes=this.getSelectedResTypes()
if(val){const buildFilteredDatas=list=>{const r=[]
for(const e of list){if(isDirResType(e)){const ch=buildFilteredDatas(e.children)
if(ch.length>0){const newE=Object.create(e)
newE.children=ch
newE.closed=false
r.push(newE)}}else if(this.forbidHideSelRow&&selectedItemsTypes&&selectedItemsTypes.indexOf(e)>-1){r.push(Object.create(e))}else if(this.matchTitle(e.prcLabel,val)){r.push(Object.create(e))}}return r}
this.dataHolder.setDatas(buildFilteredDatas(this.datas))}else{this.dataHolder.setDatas(this.datas)}this.selectByResTypes(...selectedItemsTypes)
if(this.grid.getSelectedRow()===undefined){this.selectFirst()}}matchTitle(title,val){return title.search(new RegExp(LANG.escape4RegexpFuzzy(val),"i"))>=0}}REG.reg.registerSkin("store-restypes-tree",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\tinput {\n\t\tborder: none;\n\t\tcolor: var(--form-color);\n\t\tborder-bottom: 1px solid var(--border-color);\n\t\tbackground: .1em / 1em no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/filter.svg) var(--form-search-bgcolor);\n\t\tpadding-block: 2px;\n\t\tpadding-inline: 1.2em 2px;\n\t}\n\n\tinput:focus {\n\t\toutline: var(--focus-outline);\n\t}\n\n\tc-grid-small {\n\t\tflex: 1;\n\t\tborder: none;\n\t\tbackground-color: var(--row-bgcolor);\n\t}\n`)
customElements.define("store-restypes-tree",ResTypesTree)
export class CellBuilderResType extends CellBuilderIconLabel{constructor(){super(null)}redrawCell(row,root){super.redrawCell(row,root)
const span=root.firstElementChild
if(isDirResType(row.rowDatas)){span.style.display="none"
root.style.fontWeight="bold"}else{span.style.display=""
root.style.fontWeight="normal"}}_getValue(row){return isDirResType(row.rowDatas)?row.rowDatas.label:row.rowDatas.prcLabel}_getIcon(row){return isDirResType(row.rowDatas)?null:row.rowDatas.prcIcon}}
//# sourceMappingURL=resTypesTree.js.map