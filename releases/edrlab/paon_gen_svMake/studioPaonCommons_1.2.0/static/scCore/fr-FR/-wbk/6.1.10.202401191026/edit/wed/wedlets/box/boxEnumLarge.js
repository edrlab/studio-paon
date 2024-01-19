import{BoxInputEnum}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{EPopupType,MxPopupable}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popupable.js"
import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{GridColTreeDef,GridDataHolderJsonTree,MxGridTreeUntouchedDatas}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{Grid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{ActionSeparator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{CellBuilderLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
class BoxInputEnumLarge extends BoxInputEnum{_createPopup(){const popup=(new PopupEnumTree).initialize({reg:REG.findReg(this),actionContext:this,resizer:{}})
popup.onNextClose().then(key=>{if(key!=null&&!this.isSelected(key))WEDLET.replaceValue(this.wedlet,this.key,key)})
return popup}async onClick(ev){const popup=this.popup
if(popup&&!popup.contains(ev.target)){if(!popup.actions)popup.actions=await this.provider.getActions(this)
popup.show({viewPortY:"middle",fixSize:true,initWidth:"60em"},this)}}}window.customElements.define("box-input-enumlarge",BoxInputEnumLarge)
export class PopupEnumTree extends(MxPopupable(BaseElement,EPopupType.menu)){get actionContext(){return this._actionContext}_initialize(init){super._initialize(init)
if("restoreFocus"in init)this.restoreFocus=init.restoreFocus
this._actionContext=init.actionContext
this.dataHolder=new DataHolderActions(this.actionContext)
REG.reg.installSkin("box-input-enumlarge")
const colDefs=[new GridColTreeDef("tree").setFlex("10rem",1,1).setMinWidth("55px").setCellBuilder(new CellBuilderAction(this.actionContext))]
const searchLabel=this.appendChild(JSX.createElement("label",{id:"search"}))
this.search=searchLabel.appendChild(JSX.createElement("input",{type:"search",spellcheck:"false",placeholder:"Filtrer...",oninput:this.onSearchInput,onkeydown:this.onKeyPress}))
this.grid=this.appendChild((new Grid).initialize({selType:"monoOver",columnDefs:colDefs,dataHolder:this.dataHolder,lineDrawer:this,hideHeaders:true,skinScroll:"scroll/small",skinOver:"box-input-enumlarge-popup/grid"}))
this.grid.uiEvents.on("rowClick",(row,ev)=>{if((row===null||row===void 0?void 0:row.rowDatas.isToggle(this.actionContext))&&ev.target.localName==="span"){this.close(row.rowDatas.getId())}})
this.grid.addEventListener("keypress",(function(ev){const me=this.parentElement
if(ev.key===" "||ev.key==="Enter"){const row=this.dataHolder.getRow(this.getSelectedRow())
if(row===null||row===void 0?void 0:row.rowDatas.isToggle(me.actionContext))me.close(row.rowDatas.getId())
ev.preventDefault()}else me.search.focus()}))}onSearchInput(ev){this.parentElement.parentElement.redrawDatas()}onKeyPress(ev){if(ev.key==="ArrowDown"){const tree=this.parentElement
if(tree.grid.dataHolder.countRows()>0){if(tree.grid.getSelectedRow()===undefined)tree.grid.setSelectedRows(0)
tree.grid.focus()}}}redrawLine(row,line){const d=row.rowDatas
DOM.setAttrBool(line,"data-user-disabled",!d.isEnabled(this._actionContext))
DOM.setAttr(line,"selected",d.isToggle(this._actionContext)?d.getDatas("toggle",this._actionContext):"null")}show(anchor,uiContainer,logicalParent){this.redrawDatas()
return super.show(anchor,uiContainer,logicalParent)}async redrawDatas(){const filter=this.search.value
if(filter){this.dataHolder.setDefaultOpenState(GridDataHolderJsonTree.defaultOpened)
this.dataHolder.setDatas(await this.actionContext.provider.getActions(this.actionContext,filter))}else{this.dataHolder.setDefaultOpenState(GridDataHolderJsonTree.defaultClosed)
this.dataHolder.setDatas(this.actions)}}}REG.reg.registerSkin("box-input-enumlarge",1,`\n\t#search {\n\t\tbackground: .1em / 1em no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/filter.svg) var(--form-search-bgcolor);\n\t\tpadding-inline-start: 1.2em;\n\t}\n\n\tinput {\n\t\tpadding: 2px;\n\t\tbackground: var(--form-search-bgcolor);\n\t\tcolor: var(--form-color);\n\t\tborder: none;\n\t\twidth: 100%;\n\t\tfont-size: inherit;\n\t}\n\tinput:placeholder-shown{\n\t\tfont-style: italic;\n\t}\n`)
REG.reg.registerSkin("box-input-enumlarge-popup",1,`\n\t:host([opened]) {\n\t\tpointer-events: auto;\n\t}\n\n\t#content {\n\t\tbackground-color: var(--row-bgcolor);\n\t\tborder: solid 1px var(--border-color);\n\t\tborder-radius: 3px;\n\t\tbox-shadow: 1px 1px 6px var(--fade-color);\n\t\tmin-width: 30em;\n\t\tmin-height: 20em;\n\t}\n\n\t::slotted(c-grid) {\n\t\tflex: 1;\n\t}\n`)
REG.reg.registerSkin("box-input-enumlarge-popup/grid",1,`\n\t.line:before{\n\t\tcontent: " ";\n\t\tmin-width: 1rem;\n\t}\n\t.line[selected="true"]:before{\n\t\tcontent: "✓";\n\t}\n\t.cell {\n\t\tdisplay: flex;\n\t}\n\n\t.line[selected="null"] > .cell {\n\t\tfont-style: italic;\n\t}\n\t.line[selected="true"] > .cell,\n\t.line[selected="false"] > .cell {\n\t\tcursor: pointer;\n\t}\n\n\tspan {\n\t\tflex: 1;\n\t  white-space: normal;\n  }\n\n  .sep {\n\t  display: flex;\n  }\n\n  *[data-user-disabled] {\n\t  opacity: .5;\n\t  pointer-events: none;\n  }\n\n  .sep > span {\n\t  border-bottom: solid 1px var(--border-color);\n\t  flex: 1;\n\t  height: 1px;\n  }\n`)
window.customElements.define("box-input-enumlarge-popup",PopupEnumTree)
class DataHolderActions extends(MxGridTreeUntouchedDatas(GridDataHolderJsonTree)){constructor(actionContext){super()
this.actionContext=actionContext}ch(parent){if(!parent.isMenu(this.actionContext))return undefined
return parent.getDatas("menu",this.actionContext)||[]}setCh(parent,ch){parent.setActions(ch)
return ch}}class CellBuilderAction extends CellBuilderLabel{constructor(actionContext){super("")
this.ctx=actionContext}redrawCell(row,root){if(row.rowDatas instanceof ActionSeparator){root.parentElement.classList.toggle("sep",true)
DOM.setTextContent(root,null)
DOM.setAttr(root,"title",null)}else{root.parentElement.classList.toggle("sep",false)
super.redrawCell(row,root)}}_getValue(row){return row.rowDatas.getLabel(this.ctx)}_getDescription(row){return row.rowDatas.getDescription(this.ctx)}}
//# sourceMappingURL=boxEnumLarge.js.map