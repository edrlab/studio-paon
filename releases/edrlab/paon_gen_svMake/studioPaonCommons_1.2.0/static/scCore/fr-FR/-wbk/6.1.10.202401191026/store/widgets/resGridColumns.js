import{CellBuilderIconLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{EFolderState,GridDataRowJsonTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
export class CellBuilderResIconName extends CellBuilderIconLabel{constructor(reg,noTooltip){super(null)
this.noTooltip=noTooltip
this.resTypes=reg.env.resTypes
this.iconFilter="var(--filter)"}_getValue(row){return row.cacheHolder["resNm"]||(row.cacheHolder["resNm"]=this.resTypes.getResTypeFor(row.rowDatas).resName(row.rowDatas))}_getIcon(row){if(row instanceof GridDataRowJsonTree&&row.getFolderState()===EFolderState.opened)return row.cacheHolder["iconOpen"]||(row.cacheHolder["iconOpen"]=this.resTypes.getResTypeFor(row.rowDatas).resIcon(row.rowDatas,"opened"))
return row.cacheHolder["icon"]||(row.cacheHolder["icon"]=this.resTypes.getResTypeFor(row.rowDatas).resIcon(row.rowDatas))}redrawCell(row,root){root._nodeProps=row.rowDatas
super.redrawCell(row,root)}_buildContent(row,root){if(!this.noTooltip)this._addTooltip(root)
return super._buildContent(row,root)}_addTooltip(root){const cell=DOM.findParentOrSelf(root,null,n=>n instanceof Element&&n.classList.contains("cell"))||root
POPUP.promiseTooltip(cell,(owner,tooltip)=>{tooltip.addEventListener("c-show",(async function(ev){const reg=REG.findReg(this.tooltipOf)
const nodeProps=root._nodeProps
if(nodeProps){const resType=reg.env.resTypes.getResTypeFor(nodeProps)
const area=resType.shortResView("hover")
if(area){const resReg=resType.newShortResRegFromDepotReg(reg,nodeProps)
const body=await area.loadBody(resReg)
this.view.textContent=null
this.view.appendChild(body)
VIEWS.onViewShown(body)
return}}ev.preventDefault()}))
tooltip.addEventListener("c-close",(async function(ev){var _a
const view=(_a=this.view)===null||_a===void 0?void 0:_a.firstElementChild
if(view){VIEWS.onViewHidden(view,true)
view.textContent=null}}))
return JSX.createElement("div",{style:"min-width:min(15em, 30vw)"})},{hoverAllowed:true,anchor:{posFrom:root,intersectWith:cell,fromX:"end",marginX:-3,notAvailableSpace:{posFrom:root,intersectWith:cell,fromX:"start",targetX:"end",marginX:3}}})}getColSortFn(){return null}}export class CellBuilderResTile{constructor(reg){this.reg=reg
this.resTypes=reg.env.resTypes}redrawCell(row,root){if(!root.firstChild){root.append(JSX.createElement("div",{class:"preview"}))
root.append(JSX.createElement("div",{class:"name"}))}const node=row.rowKey
const resType=this.resTypes.getResTypeFor(node)
const previewArea=resType.shortResView("preview")
const previewRoot=root.firstElementChild
previewRoot.textContent=null
if(previewArea){const ctx=resType.newShortResRegFromDepotReg(this.reg,node)
if(previewArea.needAsync(ctx)){previewRoot.style.backgroundImage=""
previewArea.loadBody(ctx).then(tag=>{if(tag)previewRoot.appendChild(tag)
else previewRoot.style.backgroundImage=`url(${resType.resIcon(node)})`})}else{const tag=previewArea.buildBody(ctx)
if(tag)previewRoot.appendChild(tag)
else{previewRoot.style.backgroundImage=`url(${resType.resIcon(node)})`}}}else{previewRoot.style.backgroundImage=`url(${resType.resIcon(node)})`}root.title=root.lastElementChild.textContent=resType.resName(node)}getColSortFn(){return null}}REG.reg.registerSkin("store-res-tile",1,`\n\t#lines {\n\t\tgap: .5em;\n\t\tpadding: .5em;\n\t}\n\n\t.inSel {\n\t\tbackground-color: transparent;\n\t\tfont-weight: bold;\n\t}\n\n\t:host(:focus) .inSel {\n\t\tbackground-color: transparent;\n\t\tfont-weight: bold;\n\t\toutline: var(--focus-outline);\n\t\toutline-offset: -2px;\n\t}\n\n\t.line {\n\t\tmin-height: 8em;\n\t\tmax-height: 0;\n\t\t/*background-color: var(--alt1-bgcolor);*/\n\t\t/*border: 1px solid var(--border-color);*/\n\t\tborder-radius: 5px;\n\t\tbox-shadow: 0 2px 5px 0 var(--border-color);\n\t\tcursor: pointer;\n\t}\n\n\t.line:hover {\n\t\tbackground-color: var(--row-inSel-unfocus-bgcolor);\n\t}\n\n\t.cell {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t}\n\n  .preview {\n\t  flex: 1;\n\t  display: flex;\n\t  min-height: 0;\n\t  min-width: 0;\n\t  flex-direction: column;\n\t  align-items: center;\n\t  justify-content: center;\n\t  background-position: center;\n\t  background-repeat: no-repeat;\n\t  background-size: auto;\n\t  background-color: var(--alt1-bgcolor);\n\t  margin: .3em;\n\t  border-radius: 2px;\n  }\n\n  .name {\n\t  text-align: center;\n\t  justify-content: flex-end;\n\t  display: flex;\n\t  white-space: break-spaces;\n\t  height: 2.3em;\n\t  flex-direction: column;\n\t  overflow: hidden;\n\t  align-self: center;\n\t  padding: .1em .3em .1em .3em;\n  }\n`)
export function redrawResLine(reg,row,line,currentResPath){var _a
const path=(_a=row.cacheHolder.livePath)!==null&&_a!==void 0?_a:row.cacheHolder.livePath=reg.env.resTypes.getResTypeFor(row.rowKey).livePath(row.getData("permaPath"))
const classList=line.classList
classList.toggle("current",path===currentResPath&&currentResPath!==null)
classList.toggle("trashed",row.getData("trashed")===true)
classList.toggle("unlisted",row.getData("unlisted")===true)}
//# sourceMappingURL=resGridColumns.js.map