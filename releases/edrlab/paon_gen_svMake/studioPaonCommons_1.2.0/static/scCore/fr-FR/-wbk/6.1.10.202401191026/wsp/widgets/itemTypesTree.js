import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{CellBuilderIconLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{GridSmall}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{EFolderState,GridColTreeDef,GridDataHolderJsonTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{isDirItemType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{HelpViews}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/help/views/helpViews.js"
export class ItemTypesTree extends BaseElement{constructor(){super(...arguments)
this.forbidHideSelRow=false}getSelectedItemType(){const row=this.dataHolder.getRow(this.grid.getSelectedRow())
if(!row)return null
return isDirItemType(row.rowDatas)?null:row.rowDatas}getSelectedItemsTypes(){return this.dataHolder.getSelectedDatas().filter(pData=>!isDirItemType(pData))}selectFirst(){for(let i=0,c=this.dataHolder.countRows();i<c;i++){const row=this.dataHolder.getRow(i)
if(!isDirItemType(row.rowDatas)){this.grid.setSelectedRows(i)
return true}else if(row.getFolderState()===EFolderState.closed){this.dataHolder.openFolder(row.rowKey)
c=this.dataHolder.countRows()}}return false}selectByItModels(itModels){if(itModels!=null){const selectedRows=[]
for(let i=0,c=this.dataHolder.countRows();i<c;i++){const itType=this.dataHolder.getRow(i).rowDatas
if(!isDirItemType(itType)&&itModels.indexOf(itType.getModel())>-1)selectedRows.push(i)}this.grid.setSelectedRows(selectedRows)}}selectByItTypes(itTypes){if(itTypes!=null){const itModels=[]
itTypes.forEach(itType=>{itModels.push(itType.getModel())})
this.selectByItModels(itModels)}}countItemTypesUntil(threshold,filter){let count=0
function countInChildren(datas){for(let i=0,c=datas.length;i<c;i++){const entry=datas[i]
if(isDirItemType(entry)){countInChildren(entry.children)}else{if(!filter||filter(entry)){count++}}if(count>=threshold)return}}countInChildren(this.dataHolder.getDatas())
return count}_initialize(init){this.reg=this.findReg(init)
const wsp=this.reg.env.wsp
this.datas=wsp.wspMetaUi.getItemTypesTree(init.itemTypeReducer)
this.dataHolder=new GridDataHolderJsonTree("children").setDefaultOpenState((function(e){return e.closed!==true})).setDatas(this.datas)
const colDefs=[new GridColTreeDef("tree").setFlex("1rem",1,1).setMinWidth("55px").setCellBuilder(new CellBuilderItemType)]
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
if(init.textFilter!=null&&this.countItemTypesUntil(5)==5){if(init.forbidHideSelectedRow)this.forbidHideSelRow=true
this.collator=new Intl.Collator("fr",{usage:"search",sensitivity:"base"})
this.search=sr.appendChild(JSX.createElement("input",{type:"search",spellcheck:"false",oninput:this.onSearchInput,onkeydown:this.onKeyPress}))}this.grid=sr.appendChild((new GridSmall).initialize(Object.assign({columnDefs:colDefs,skinScroll:"scroll/small",dataHolder:this.dataHolder,hideHeaders:true},init.grid)))
if(init.textFilter){this.filterText(this.search.value=init.textFilter)
if(this.countItemTypesUntil(1)===0){this.filterText("")}}}clearSearch(){if(this.search&&this.search.value!=""){this.search.value=""
this.search.dispatchEvent(new CustomEvent("input"))}}onSearchInput(ev){const tree=DOMSH.findHost(this)
tree.filterText(this.value)}onKeyPress(ev){if(ev.key==="ArrowDown"){const tree=DOMSH.findHost(this)
if(tree.grid.getSelectedRow()!==undefined)tree.grid.focus()}}filterText(val){const selectedItemsTypes=this.getSelectedItemsTypes()
if(val){const buildFilteredDatas=list=>{const r=[]
for(const e of list){if(isDirItemType(e)){const ch=buildFilteredDatas(e.children)
if(ch.length>0){const newE=Object.create(e)
newE.children=ch
newE.closed=false
r.push(newE)}}else if(this.forbidHideSelRow&&selectedItemsTypes&&selectedItemsTypes.find(entry=>entry.datas===e.datas)){r.push(Object.create(e))}else if(this.matchTitle(e.getTitle(),val)){r.push(Object.create(e))}}return r}
this.dataHolder.setDatas(buildFilteredDatas(this.datas))}else{this.dataHolder.setDatas(this.datas)}this.selectByItTypes(selectedItemsTypes)
if(this.grid.getSelectedRow()===undefined){this.selectFirst()}}matchTitle(title,val){let found=0
for(let i=0,s=title.length;i<s;i++){if(this.collator.compare(title.charAt(i),val.charAt(found))!==0)found=0
if(this.collator.compare(title.charAt(i),val.charAt(found))===0)if(++found===val.length)return true}return false}}REG.reg.registerSkin("wsp-itemtypes-tree",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\tinput {\n\t\tborder: none;\n\t\tcolor: var(--form-color);\n\t\tborder-bottom: 1px solid var(--border-color);\n\t\tbackground: .1em / 1em no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/filter.svg) var(--form-search-bgcolor);\n\t\tpadding-block: 2px;\n\t\tpadding-inline: 1.2em 2px;\n\t}\n\n\tinput:focus {\n\t\toutline: var(--focus-outline);\n\t}\n\n\tc-grid-small {\n\t\tflex: 1;\n\t\tborder: none;\n\t\tbackground-color: var(--row-bgcolor);\n\t}\n`)
customElements.define("wsp-itemtypes-tree",ItemTypesTree)
export class CellBuilderItemType extends CellBuilderIconLabel{constructor(){super(null)}redrawCell(row,root){super.redrawCell(row,root)
root._currentIt=row.rowDatas
const span=root.firstElementChild
if(isDirItemType(row.rowDatas)){span.style.display="none"
root.style.fontWeight="bold"
DOM.setAttr(root,"title",null)}else{span.style.display=""
root.style.fontWeight="normal"
DOM.setAttr(root,"title",row.rowDatas.datas.desc)}}_getValue(row){return isDirItemType(row.rowDatas)?row.rowDatas.label:row.rowDatas.getTitle()}_getIcon(row){return isDirItemType(row.rowDatas)?null:row.rowDatas.getIcon()}_buildContent(row,root){const cell=DOM.findParentOrSelf(root,null,n=>n instanceof Element&&n.classList.contains("cell"))||root
POPUP.promiseTooltip(cell,async(owner,tooltip)=>{tooltip.addEventListener("c-show",(function(ev){const it=root._currentIt
const helpId=isDirItemType(it)?it.helpId:it.datas.helpId
if(helpId)this.view.showLiveHelpId(helpId)
else ev.preventDefault()}))
const reg=REG.findReg(owner)
return await(new HelpViews).initialize({reg:reg,liveView:{hideBar:true},helpDbProv:reg.env.wsp.wspMetaUi.getHelpDbProv()}).initializedAsync},{hoverAllowed:true,anchor:{posFrom:root,intersectWith:cell,fromX:"end",marginX:-3,notAvailableSpace:{posFrom:root,intersectWith:cell,fromX:"start",targetX:"end",marginX:3}}})
return super._buildContent(row,root)}}
//# sourceMappingURL=itemTypesTree.js.map