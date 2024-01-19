import{CellBuilderDate,CellBuilderFlagIcon,CellBuilderIconLabel,CellBuilderLabel,CellBuilderString}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{RESPS,SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{SRCDRAWER,SrcDrawer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcDrawer.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{ItemTypeTask}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js"
import{EFolderState,GridDataRowJsonTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{CellBuilderAccount,CellBuilderAccounts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/usersGrid.js"
export class CellBuilderSrcIconCode extends CellBuilderIconLabel{constructor(reg,wspMetaUi,noTooltip,sortFn=SRC.sortSrcUriTree){super(null)
this.wspMetaUi=wspMetaUi
this.noTooltip=noTooltip
this.sortFn=sortFn
this.srcRdr=reg.getSvc(ITEM.KEY_SrcRenderer)
this.iconFilter="var(--filter)"}_getValue(row){return row.cacheHolder["code"]||(row.cacheHolder["code"]=this.srcRdr.getMainName(row.rowDatas,this.wspMetaUi))}_getIcon(row){if(row instanceof GridDataRowJsonTree&&row.getFolderState()===EFolderState.opened)return row.cacheHolder["iconOpen"]||(row.cacheHolder["iconOpen"]=this.srcRdr.getIcon(row.rowDatas,this.wspMetaUi,true))
return row.cacheHolder["icon"]||(row.cacheHolder["icon"]=this.srcRdr.getIcon(row.rowDatas,this.wspMetaUi))}redrawCell(row,root){root._srcFields=row.rowDatas
super.redrawCell(row,root)}_buildContent(row,root){if(!this.noTooltip)this._addTooltip(root)
return super._buildContent(row,root)}_addTooltip(root){const cell=DOM.findParentOrSelf(root,null,n=>n instanceof Element&&n.classList.contains("cell"))||root
POPUP.promiseTooltip(cell,(owner,tooltip)=>{tooltip.addEventListener("c-show",(function(ev){const srcFields=root._srcFields
if(srcFields)this.view.setSrcRef(SRC.srcRef(srcFields),srcFields)
else ev.preventDefault()}))
return(new SrcDrawer).initialize({skin:"wsp-src-drawer/tooltip",tpl:SRCDRAWER.detailsPreviewTpl,reg:REG.findReg(owner)})},{hoverAllowed:true,anchor:{posFrom:root,intersectWith:cell,fromX:"end",marginX:-3,notAvailableSpace:{posFrom:root,intersectWith:cell,fromX:"end",targetX:"end",fromY:"bottom",marginY:-3}}})}getColSortFn(){return(r1,r2)=>{const v1=this._getValue(r1)
const v2=this._getValue(r2)
if(v1==null){if(v2==null)return 0
return 1}else if(v2==null)return-1
return this.sortFn(v1,v2)}}fillSearchColumns(map){map.set("srcUri",null)
map.set("itModel",null)}}export class CellBuilderSrcIconCodeTitle extends CellBuilderSrcIconCode{redrawCell(row,root){root._srcFields=row.rowDatas
let span=root.firstElementChild
if(!span)span=this._buildContent(row,root)
this.redrawIcon(row,span)
span=span.nextElementSibling
DOM.setTextContent(span,this._getValue(row))
span=span.nextElementSibling
DOM.setTextContent(span,this._getTitle(row))}_buildContent(row,root){const spanIcon=super._buildContent(row,root)
root.appendChild(document.createElement("span"))
const st=root.appendChild(document.createElement("span")).style
st.color="var(--alt1-color)"
st.fontStyle="italic"
st.marginInlineStart=this.iconLabelGap
return spanIcon}_getTitle(row){return this.srcRdr.getSecondName(row.rowDatas,this.wspMetaUi)||""}fillSearchColumns(map){super.fillSearchColumns(map)
map.set("itTi",null)}}export class CellBuilderSrcIconTitle extends CellBuilderSrcIconCode{redrawCell(row,root){root._srcFields=row.rowDatas
let span=root.firstElementChild
if(!span)span=this._buildContent(row,root)
const icon=this._getIcon(row)
const label=this._getValue(row)
if(icon){span.style.unicodeBidi="isolate"
span.style.backgroundImage=icon.startsWith("--")?`var(${icon})`:`url("${icon}")`}else{span.style.backgroundImage="none"}span=span.nextElementSibling
DOM.setTextContent(span,this._getTitle(row)||label)}_buildContent(row,root){this._addTooltip(root)
const span=document.createElement("span")
span.setAttribute("class","icon")
let st=span.style
st.paddingLeft=this.iconWidth
st.marginInlineEnd=this.iconLabelGap
if(this.iconFilter)st.filter=this.iconFilter
root.appendChild(span)
st=root.appendChild(document.createElement("span")).style
st.marginInlineStart=this.iconLabelGap
return span}_getTitle(row){return this.srcRdr.getSecondName(row.rowDatas,this.wspMetaUi)||""}fillSearchColumns(map){super.fillSearchColumns(map)
map.set("itTi",null)}}export class CellBuilderSpace extends CellBuilderString{constructor(){super("srcUri")}_getValue(row){const srcUri=row.getData(this.dataKey)
if(!srcUri)return""
if(ITEM.isAirItem(srcUri))return"[Item flottant]"
if(ITEM.isExtItem(srcUri))return"[Item étranger]"
const idx=srcUri.indexOf(".")
if(idx<0)return srcUri.substring(1)
const idx2=srcUri.lastIndexOf("/",idx)
return idx2>0?srcUri.substring(1,idx2):""}}export class CellBuilderItModelFlagIcon extends CellBuilderFlagIcon{constructor(reg,wspMetaUi){super("itModel")
this.wspMetaUi=wspMetaUi
this.srcRdr=reg.getSvc(ITEM.KEY_SrcRenderer)}_getValue(row){return this.wspMetaUi.getItemType(row.rowDatas.itModel).getTitle()}_getIcon(row){return row.cacheHolder["icon"]||(row.cacheHolder["icon"]=this.srcRdr.getIcon(row.rowDatas,this.wspMetaUi))}}export class CellBuilderItModel extends CellBuilderLabel{constructor(reg,wspMetaUi){super("itModel")
this.wspMetaUi=wspMetaUi
this.srcRdr=reg.getSvc(ITEM.KEY_SrcRenderer)}_getValue(row){return this.wspMetaUi.getItemType(row.rowDatas.itModel).getTitle()}_getIcon(row){return row.cacheHolder["icon"]||(row.cacheHolder["icon"]=this.srcRdr.getIcon(row.rowDatas,this.wspMetaUi))}}export class CellBuilderResp extends CellBuilderAccount{constructor(respCode,reg,dataKey,hideIcon=false){super(reg,dataKey,hideIcon)
this.respCode=respCode
this.reg=reg
this.hideIcon=hideIcon}getAccount(row){const src=row.rowDatas
if(!src[this.dataKey])return null
const resps=RESPS.toRespsList(src[this.dataKey])
return resps[this.respCode]?resps[this.respCode][0]:null}}export class CellBuilderResps extends CellBuilderAccounts{constructor(respCode,reg,dataKey,hideIcon=false){super(reg,dataKey,hideIcon)
this.respCode=respCode
this.reg=reg
this.hideIcon=hideIcon}getAccounts(row){const src=row.rowDatas
if(!src[this.dataKey])return null
const resps=RESPS.toRespsList(src[this.dataKey])
return resps[this.respCode]}}export class CellBuilderLc extends CellBuilderIconLabel{constructor(wspMetaUi){super("lcSt")
this.wspMetaUi=wspMetaUi}_getValue(row){const src=row.rowDatas
if(!src.lcSt)return null
const itemType=this.wspMetaUi.getItemType(src.itModel)
const lcProv=itemType instanceof ItemTypeTask?itemType:this.wspMetaUi
const lc=lcProv.getLcStateOrUnknown(src.lcSt)
return lc?lc.name:""}_getIcon(row){const src=row.rowDatas
if(!src.lcSt)return null
const itemType=this.wspMetaUi.getItemType(src.itModel)
const lcProv=itemType instanceof ItemTypeTask?itemType:this.wspMetaUi
const lc=lcProv.getLcStateOrUnknown(src.lcSt)
return lc?lc.iconUrl:""}}export class CellBuilderLcFlag extends CellBuilderFlagIcon{constructor(wspMetaUi){super("lcSt")
this.wspMetaUi=wspMetaUi
this.setIconWidth(".8rem")}_getIcon(row){const lcSt=row.getData("lcSt")
if(!lcSt)return null
const itemType=this.wspMetaUi.getItemType(row.getData("itModel"))
const lcProv=itemType instanceof ItemTypeTask?itemType:this.wspMetaUi
const lc=lcProv.getLcStateOrUnknown(lcSt)
return lc?lc.iconUrl:""}_getValue(row){const lcSt=row.getData("lcSt")
if(!lcSt)return null
const itemType=this.wspMetaUi.getItemType(row.getData("itModel"))
const lcProv=itemType instanceof ItemTypeTask?itemType:this.wspMetaUi
const lc=lcProv.getLcStateOrUnknown(lcSt)
return lc?lc.name:""}}export class CellBuilderTkDeadline extends CellBuilderDate{get defaultSortValue(){return Date.now()}constructor(){super("tkDeadline")}}export class CellBuilderTkScheduledD extends CellBuilderDate{get defaultSortValue(){return Date.now()}constructor(){super("tkScheduledDt")}}export function redrawSrcLine(wsp,src,line,currentSrcUri,highlightSgn,assigned){line.classList.toggle("current",src.srcUri===currentSrcUri)
if(highlightSgn){if(assigned&&(assigned===src.srcId||assigned===src.srcUri)){line.classList.toggle("assigned",true)
line.classList.toggle("highlight",false)}else{const sgn=src.itSgn
line.classList.toggle("highlight",sgn?highlightSgn.test(sgn):false)
line.classList.toggle("assigned",false)}}else{line.classList.toggle("highlight",false)
line.classList.toggle("assigned",false)}const wspMetaUi=wsp.wspMetaUi
if(wspMetaUi){if(wspMetaUi.getLcStates()!==null){DOM.setStyle(line,"color",src.lcSt!=null?wspMetaUi.getLcStateOrUnknown(src.lcSt).color||"":"")}if(wspMetaUi.flagItemsWithTasks){DOM.setStyle(line,"font-weight",src.tkPending?"bold":null)}}}
//# sourceMappingURL=srcGridColumns.js.map