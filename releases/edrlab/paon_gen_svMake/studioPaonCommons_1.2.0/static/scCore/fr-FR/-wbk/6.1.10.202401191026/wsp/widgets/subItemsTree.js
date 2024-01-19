import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{CellBuilderString}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{GridSmall}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{GridColTreeDef,GridDataHolderJsonTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{EItemTypeFamily}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js"
export class SubItemsTree extends BaseElement{setSubItems(item,showItem){var _a
this.item=item
if(!item){this.datas=[]}else{this.itemShown=showItem
if(this.itemShown==null){this.itemShown=((_a=this.subModelPattern)===null||_a===void 0?void 0:_a.test(item.itModel))||false}if(this.itemShown){this.datas=[{id:null,ti:item.itTi||ITEM.extractItemCode(item.srcUri),mo:item.itModel,subItems:item.itSubItems||[]}]}else{this.datas=item.itSubItems||[]}}this.redrawDatas(false)}getSelectedSubItem(){const row=this.dataHolder.getRow(this.grid.getSelectedRow())
if(!row)return null
return row.rowDatas}getSelectedSubItems(){return this.dataHolder.getSelectedDatas()}selectFirst(){for(let i=0,c=this.dataHolder.countRows();i<c;i++){const subModel=this.dataHolder.getRow(i).rowDatas.mo
if(!this.subModelPattern||(subModel===null||subModel===void 0?void 0:subModel.match(this.subModelPattern))){this.grid.setSelectedRows(i)
return true}}return false}selectBySubItems(subItems){if(subItems){const sel=[]
for(let i=0,c=this.dataHolder.countRows();i<c;i++){const subIt=this.dataHolder.getRow(i).rowDatas
if(subItems.find(entry=>entry.id===subIt.id))sel.push(i)}this.grid.setSelectedRows(sel)}else{this.grid.setSelectedRows(-1)}}_initialize(init){this.reg=this.findReg(init)
this.subModelPattern=init.subItemSgnPattern
this.dataHolder=new GridDataHolderJsonTree("subItems").setDefaultOpenState(GridDataHolderJsonTree.defaultOpened)
const colDefs=[new GridColTreeDef("tree").setFlex("10rem",1,1).setMinWidth("55px").setCellBuilder(new CellBuilderSubItem(this.reg.env.wsp.wspMetaUi))]
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
if(init.textFilter!=null){if(init.forbidHideSelectedRow)this.forbidHideSelRow=true
this.search=sr.appendChild(JSX.createElement("input",{type:"search",spellcheck:"false",oninput:this.onSearchInput,onkeydown:this.onKeyDown}))
this.search.value=init.textFilter}this.grid=sr.appendChild((new GridSmall).initialize(Object.assign({columnDefs:colDefs,dataHolder:this.dataHolder,hideHeaders:true},init.grid)))
this.setSubItems(init.item,init.showItem)}clearSearch(){var _a
if(((_a=this.search)===null||_a===void 0?void 0:_a.value)!=""){this.search.value=""
this.search.dispatchEvent(new CustomEvent("input"))}}onSearchInput(ev){DOMSH.findHost(this).redrawDatas(true)}onKeyDown(ev){if(ev.key==="ArrowDown"){const tree=DOMSH.findHost(this)
if(tree.grid.dataHolder.countRows()>0){tree.grid.focus()
if(tree.grid.getSelectedRow()===undefined)tree.grid.setSelectedRows(0)}}}redrawDatas(preserveSel){var _a
const selected=preserveSel?this.getSelectedSubItems():null
const filter=(_a=this.search)===null||_a===void 0?void 0:_a.value
if(filter){const regexp=new RegExp(LANG.escape4RegexpFuzzy(filter),"i")
const buildFilteredDatas=list=>{var _a
const r=[]
for(const e of list){if(this.forbidHideSelRow&&(selected===null||selected===void 0?void 0:selected.indexOf(e))>-1||((_a=e.ti)===null||_a===void 0?void 0:_a.match(regexp))){const newE=Object.create(e)
if(e.subItems)newE.subItems=buildFilteredDatas(e.subItems)
r.push(newE)}else if(e.subItems){const ch=buildFilteredDatas(e.subItems)
if(ch.length>0){const newE=Object.create(e)
newE.subItems=ch
r.push(newE)
continue}}}return r}
this.dataHolder.setDatas(buildFilteredDatas(this.datas))}else{this.dataHolder.setDatas(this.datas)}this.selectBySubItems(selected)}}REG.reg.registerSkin("wsp-subitems-tree",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\tinput {\n\t\tborder: none;\n\t\tcolor: var(--form-color);\n\t\tborder-bottom: 1px solid var(--border-color);\n\t\tbackground: .1em / 1em no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/filter.svg) var(--form-search-bgcolor);\n\t\tpadding-block: 2px;\n\t\tpadding-inline: 1.2em 2px;\n\t}\n\n\tinput:focus {\n\t\toutline: var(--focus-outline);\n\t}\n\n\tc-grid-small {\n\t\tflex: 1;\n\t\tborder: none;\n\t\tbackground-color: var(--row-bgcolor);\n\t}\n`)
customElements.define("wsp-subitems-tree",SubItemsTree)
class CellBuilderSubItem extends CellBuilderString{constructor(wspMetaUi){super("ti")
this.wspMetaUi=wspMetaUi}_getValue(row){let v=row.rowDatas.ti
if(v)return v
const subItemType=this.wspMetaUi.getItemType(row.rowDatas.mo)
if(subItemType&&subItemType.getFamily()!==EItemTypeFamily.undef)return subItemType.getTitle()
return row.rowDatas.id}}
//# sourceMappingURL=subItemsTree.js.map