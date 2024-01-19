import{BaseElement,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{DOM,JSX,ShadowJsx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{renderAppend,xhtml}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/htmlLit.js"
import{RESPS,SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{EItResp,InfoRefreshItemDisplays,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{ViewsContainer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{SrcGrid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcGrid.js"
import{FocusItemSelRef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{ETaskStage,LIFECYCLE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/lcTask.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{Tasks}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/tasks.js"
import{AccelKeyMgr,ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{LANG,LOCALE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{RespEditField}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/resps/respEdit.js"
import{DynGen}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/dynGen.js"
export class RibbonBase extends BaseElement{get shortDescCtx(){return DOMSH.findHost(this)}get ribbonMode(){return this.getAttribute("role")||"static"}set ribbonMode(mode){if(this.ribbonMode===mode)return
DOM.setAttr(this,"mode",mode)
if(mode==="static"){DOM.setAttr(this,"role",null)
this.tabIndex=-1
this.onkeypress=null}else{DOM.setAttr(this,"role",mode)
this.tabIndex=0
this.onkeypress=this.onKeyPress}}setTooltip(factory,findFocusableOnShown){if(!factory)return
this.ribbonMode="hover"
this.onclick=POPUP.promiseTooltip(this,findFocusableOnShown?(owner,tooltip)=>{tooltip.addEventListener("c-shown",()=>{const focusbale=DOMSH.findFlatNext(tooltip.firstElementChild,tooltip,DOM.IS_focusable)
if(focusbale)focusbale.focus()})
return factory(owner,tooltip)}:factory,{hoverAllowed:true,skin:"c-popup-floating",skinOver:"ribbon/tooltip"})
this.onblur=ev=>{if(this.popupTooltip&&ev.relatedTarget&&!DOM.isAncestor(this.popupTooltip,ev.relatedTarget))this.popupTooltip.close()}}setFloating(factory,findFocusableOnShown){if(!factory)return
this.ribbonMode="button"
this.onclick=()=>{const popup=POPUP.showFloating(popup=>{if(findFocusableOnShown){popup.addEventListener("c-shown",()=>{const focusbale=DOMSH.findFlatNext(popup.firstElementChild,popup,DOM.IS_focusable)
if(focusbale)focusbale.focus()})}this.popupFloating=popup
popup.addEventListener("c-close",()=>{this.popupFloating=null})
return factory(this,popup)},this,this,{closeOnBlur:true,skin:"c-popup-floating",skinOver:"ribbon/floating scroll/small"})}}callClickOnMouseover(){this.ribbonMode="button"
POPUP.mouseOverRetarderCaller(this,false,()=>this.click())}_initialize(init){var _a
this.reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("scroll/small",sr)
this.reg.installSkin("wsp-rib",sr)
this._initAndInstallSkin(this.localName,init);(_a=this.reg.env.infoBroker)===null||_a===void 0?void 0:_a.addConsumer(this)}onKeyPress(ev){if(LANG.in(ev.key,"Enter"," ")&&!ACTION.isAnyControlPressed(ev)){ev.stopImmediatePropagation()
ev.preventDefault()
this.click()}}_refresh(){super._refresh()
if(this.popupTooltip)this.popupTooltip.close()}onViewHidden(closed){var _a,_b
if(closed)(_b=(_a=this.reg)===null||_a===void 0?void 0:_a.env.infoBroker)===null||_b===void 0?void 0:_b.removeConsumer(this)
if(this.popupTooltip)this.popupTooltip.close()
if(this.popupFloating)this.popupFloating.close()}onInfo(info){if(this.initialized){if(info instanceof InfoRefreshItemDisplays){const srcRef=info.srcRef
const currentSrcRef=SRC.srcRef(this.reg.env.longDesc)
if(srcRef==currentSrcRef)this.refresh()}}}}REG.reg.registerSkin("wsp-rib",1,`\n\t:host {\n\t\tflex: 0 1 auto;\n\t\tdisplay: block;\n\t\tpadding: 2px;\n\t\tmax-height: 4em;\n\t\ttext-align: center;\n\t\tfont-size: var(--label-size);\n\t\toverflow: hidden;\n\t\tuser-select: none;\n\t}\n\n\t:host([mode=button]) {\n\t\tcursor: pointer;\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--focus-outline);\n\t\toutline-offset: -1px;\n\t}\n\n\t.smallTi {\n\t\tcolor: var(--fade-color);\n\t\tfont-style: italic;\n\t\tfont-size: 85%;\n\t}\n`)
REG.reg.registerSkin("ribbon/tooltip",1,`\n\t#content {\n\t\tdisplay: block;\n\t\tpadding: .2em;\n\t\tz-index: 101;\n\t}\n`)
REG.reg.registerSkin("ribbon/floating",1,`\n\t#content {\n\t\tmax-width: 40vw;\n\t}\n`)
export class RibbonItemInfo extends RibbonBase{_initialize(init){super._initialize(init)
this.setAttribute("c-resizable","")
this.template=this.reg.getSvc("ribbon.item.info.tpl")||RibbonItemInfo._template
this.templateTt=this.reg.getSvc("ribbon.item.info.tplTt")||RibbonItemInfo._templateTt
this.reg.env.longDescChange.add(this.onLongDescChange.bind(this))
this.setTooltip(this._tooltip)
this.setAttribute("draggable","")
this.ondragstart=ev=>ITEM.setShortDescTransferToDragSession({shortDescs:[this.reg.env.longDesc],emitter:this,reg:this.reg},ev,"native")
this.ondragend=ITEM.resetShortDescTransferToDragSession}_tooltip(owner,tooltip){const root=JSX.createElement("div",{id:"ttRoot"})
owner.reg.installSkin(owner.localName,root.attachShadow(DOMSH.SHADOWDOM_INIT))
tooltip.addEventListener("c-show",ev=>{renderAppend(owner.templateTt(owner),root.shadowRoot)})
return root}static _template(rib){const longDesc=rib.reg.env.longDesc
const type=rib.reg.env.wsp.wspMetaUi.getItemType(longDesc.itModel)
if(ITEM.isExtItem(longDesc.srcUri)){return xhtml`<div>
<div id="itTi">${longDesc.itTi}</div>
<img align="center" src="${type.getIcon(longDesc)}"/><span id="srcCd">${SRC.extractLeafFromUri(longDesc.srcUri)}</span>
<span id="foreignItem"> (item étranger)</span>
<span id="itModel">${type.getTitle(longDesc)}</span></div>`}else{return xhtml`<div>
<div id="itTi">${longDesc.itTi}</div>
<img align="center" src="${type.getIcon(longDesc)}"/><span id="srcCd">${SRC.extractLeafFromUri(longDesc.srcUri)}</span>
<span id="itModel">${type.getTitle(longDesc)}</span></div>`}}static _templateTt(rib){const longDesc=rib.reg.env.longDesc
const dt=new Date(longDesc.srcDt)
const foreignActions=!ITEM.isExtItem(longDesc.srcUri)?undefined:xhtml`<div id="actions">
				<c-button class="inline" i.="${{reg:rib.reg,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/openItem.svg",title:"Ouvrir cet item étranger dans son atelier"}}" e.click="${function(){rib.reg.getSvc("openForeignItem")(rib.reg,WSP.extractWspCdFromWspRef(longDesc.itFullUriInOwnerWsp),WSP.extractSrcRefFromWspRef(longDesc.itFullUriInOwnerWsp))}}"/>
			</div>`
return xhtml`${foreignActions}<div id="srcDt">modifié le <span class="val">${dt.toLocaleDateString("fr")} à ${dt.toLocaleTimeString("fr")}</span></div>
<div id="srcUser" b.hidden="${!longDesc.srcUser}">par <c-userref class="inline" i.="${{reg:rib.reg,nickOrAccount:longDesc.srcUser}}"/></div>
${rib.reg.getPref("wsp.hideWspStruct")?undefined:xhtml`<div id="path">${ITEM.getItemUriLabel(longDesc.srcUri,longDesc)}</div>`}`}_refresh(){super._refresh()
renderAppend(this.template(this),this.shadowRoot)}onLongDescChange(ldNew,ldOld){this.refresh()}}REG.reg.registerSkin("wsp-rib-info",1,`\n\t:host {\n\t\tflex: 1 1 auto;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tjustify-content: center;\n\t\ttext-align: start;\n\t\tpadding: 0 .5em;\n\t}\n\n\t#itModel {\n\t\tmargin-inline-end: 1em;\n\t\tfont-style: italic;\n\t}\n\n\t#itModel::before {\n\t\tcontent: "· ";\n\t}\n\n\t#itTi {\n\t\tcolor: var(--alt1-color);\n\t\tfont-weight: bold;\n\t}\n\n\timg {\n\t\tcursor: grab;\n\t\tfilter: var(--filter);\n\t}\n\n\t.val {\n\t\tcolor: var(--alt1-color);\n\t\tfont-weight: bold;\n\t}\n\n\t#path {\n\t\tcolor: var(--fade-color);\n\t}\n\n\t#foreignItem {\n\t\tcolor: var(--alt1-color);\n\t\tfont-weight: bold;\n\t\tfont-style: italic;\n\t}\n\n\t:host(#ttRoot) {\n\t\tpadding: .3em;\n\t\tfont-size: var(--label-size);\n\t}\n`)
customElements.define("wsp-rib-info",RibbonItemInfo)
export class RibbonTabs extends RibbonBase{_initialize(init){var _a
super._initialize(init)
this.reg.env.longDescChange.add(this.onLongDescChange.bind(this))
this.itemTabs=(_a=DOMSH.findHost(this))===null||_a===void 0?void 0:_a.tabs
if(this.itemTabs){const parent=this.itemTabs.shadowRoot.getElementById("tabs")
const ctn=this.shadowRoot.appendChild(JSX.createElement("div",{id:"ctn"}))
ctn.style.minWidth=this.computeWidth(parent)
new IntersectionObserver(cb=>{if(cb[0].intersectionRatio>.9){while(parent.firstElementChild)ctn.appendChild(parent.firstElementChild)
DOM.setHidden(parent.parentElement,true)}else{while(ctn.firstElementChild)parent.appendChild(ctn.firstElementChild)
DOM.setHidden(parent.parentElement,false)}},{root:this,threshold:[.8,1],rootMargin:"10px 0px"}).observe(ctn)}}computeWidth(parent){let min,max
if(getComputedStyle(this).direction==="rtl"){min=parent.lastElementChild.offsetLeft
max=parent.firstElementChild.offsetLeft+parent.firstElementChild.clientWidth}else{min=parent.firstElementChild.offsetLeft
max=parent.lastElementChild.offsetLeft+parent.lastElementChild.clientWidth}return(max-min)*1.1+"px"}onLongDescChange(){const ctn=this.shadowRoot.getElementById("ctn")
if(!ctn)return
if(ctn.firstElementChild){for(let tab=ctn.firstElementChild;tab;tab=tab.nextElementSibling){tab.refresh()}ctn.style.minWidth=this.computeWidth(ctn)}else{ctn.style.minWidth=this.computeWidth(this.itemTabs.shadowRoot.getElementById("tabs"))}}}REG.reg.registerSkin("wsp-rib-tabs",1,`\n\t:host {\n\t\tflex: 100 100 0;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tjustify-content: center;\n\t\talign-items: flex-end;\n\t\toverflow: visible;\n\t\tpadding: 0;\n\t}\n\n\t#ctn {\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tjustify-content: center;\n\t\tborder-top: 1px solid transparent;\n\t}\n\n\tc-tab {\n\t\tflex-direction: column;\n\t\tmin-width: var(--tab-size, 6em);\n\t\tborder-bottom: solid 2px transparent;\n\t}\n\n\t.selected {\n\t\tborder-color: var(--tabl-select-color);\n\t\tcolor: var(--tabl-select-color);\n\t\t-webkit-text-stroke: .5px var(--tabl-select-color);\n\t}\n`)
customElements.define("wsp-rib-tabs",RibbonTabs)
export class RibbonRefs extends RibbonBase{constructor(){super(...arguments)
this._noFetch=true}_initialize(init){var _a
this.conf=Object.assign({refsListCode:RibbonRefs.DEFAULT_REFS_LIST},init)
super._initialize(this.conf)
if(ITEM.isHistoryOrTrashUri(this.reg.env.longDesc.srcUri)){this.hidden=true
return}this.confs=this.reg.mergeLists(this.conf.refsListCode)
this.confs=(_a=this.confs)===null||_a===void 0?void 0:_a.filter(entry=>!entry.isVisible||entry.isVisible.call(this,this))
this.setFloating(this.reg.getSvc("ribbon.item.refs.details")||this._details)
setTimeout(async()=>{this._noFetch=false
this.refresh()},500)}async fetch(rib){return await rib.confs[0].fetchSrcList.call(rib,rib)}redrawShortView(result){const total=result?result.length:undefined
const defaultConf=this.confs[0]
const tpl=defaultConf.shortViewRefs?defaultConf.shortViewRefs.call(this,this,result):xhtml`<div id="total" title="${(defaultConf.entriesMsg?defaultConf.entriesMsg(total):null)||defaultConf.description||defaultConf.label}">${total!==undefined?total:"..."}</div><div id="label">réf.</div>`
renderAppend(tpl,this.shadowRoot)}_details(rib,popup){const grid=(new SrcGrid).initialize({reg:rib.reg,hideHeaders:true,autoSelOnFocus:"first",itemHandlingReact:rib.reg.env.infoBroker,defaultAction:FocusItemSelRef.SINGLETON,actions:rib.reg.mergeLists("actions:ribbonRef:shortDesc","actions:wsp:shortDesc"),accelKeyMgr:(new AccelKeyMgr).initFromMapActions(rib.reg.mergeListsAsMap("accelkeys:ribbonRef:shortDesc","accelkeys:wsp:shortDesc")),emptyBody:()=>{var _a
return JSX.createElement("span",null,((_a=rib._currentDetailsConf)===null||_a===void 0?void 0:_a.emptyGridMsg)||"Aucun item")}})
let confTitle=JSX.createElement("div",{class:"title"})
popup.addEventListener("c-show",async ev=>{const wsp=rib.reg.env.wsp
confTitle.innerText=""
if(rib.confs.length===1){rib._currentDetailsConf=rib.confs[0]
confTitle.appendChild(JSX.createElement("div",null,rib._currentDetailsConf.label))}else{const select=confTitle.appendChild(JSX.createElement("select",{onchange:async()=>{const pos=Number.parseInt(select.value)
rib._currentDetailsConf=rib.confs[pos]
const items=await rib._currentDetailsConf.fetchSrcList.call(rib,rib)
grid.srcGridDatas.setDatas(items)
grid.focus()
if(pos===0)rib.redrawShortView(items)}}))
rib.confs.forEach((entry,pos)=>{select.appendChild(JSX.createElement("option",{value:pos,label:entry.label,title:entry.description}))})}rib._currentDetailsConf=rib.confs[0]
const items=await rib._currentDetailsConf.fetchSrcList.call(rib,rib)
grid.srcGridDatas.setDatas(items)
rib.redrawShortView(items)
grid.focus()})
return JSX.createElement("div",null,JSX.createElement(ShadowJsx,{skin:"wsp-rib-refs",reg:rib.reg},confTitle,grid))}_refresh(){super._refresh()
if(!this.hidden){if(!this._noFetch)this.fetch(this).then(resp=>this.redrawShortView(resp))
else this.redrawShortView()}}}RibbonRefs.DEFAULT_REFS_LIST="ribbon.item.refs.confs"
REG.reg.registerSvc("ribbonRef.conf.revlinks.item",1,{label:"Références à cet item",fetchSrcList:async ctx=>{var _a
const ascs=await ITEM.fetchSrcNetJson(ctx.reg.env.wsp,this,SRC.srcRef(ctx.reg.env.longDesc),ctx.reg.env.wsp.getShortDescDef(),"asc",true,null,null,100,1,null,"itemOnly")
return(_a=ascs===null||ascs===void 0?void 0:ascs.lnks)===null||_a===void 0?void 0:_a.map(entry=>entry.src)},entriesMsg:nb=>nb!=undefined?`${nb} référence(s) à cet item`:null,emptyGridMsg:"Aucune"})
REG.reg.addSvcToList(RibbonRefs.DEFAULT_REFS_LIST,"revlinks.item",1,"ribbonRef.conf.revlinks.item",-1)
REG.reg.registerSvc("ribbonRef.conf.revlinks.all",1,{label:"Références à cet item ou à ses ancres",fetchSrcList:async ctx=>{var _a
const ascs=await ITEM.fetchSrcNetJson(ctx.reg.env.wsp,this,SRC.srcRef(ctx.reg.env.longDesc),ctx.reg.env.wsp.getShortDescDef(),"asc",true,null,null,100,1,null)
return(_a=ascs===null||ascs===void 0?void 0:ascs.lnks)===null||_a===void 0?void 0:_a.map(entry=>entry.src)},entriesMsg:nb=>nb!=undefined?`${nb} référence(s) à cet item ou à ses ancres`:null,emptyGridMsg:"Aucune"})
REG.reg.registerSkin("wsp-rib-refs",1,`\n\t:host {\n\t\tflex: 0 1 auto;\n\t\tmin-width: 2rem;\n\t\t--row-bgcolor: var(--bgcolor);\n\t}\n\n\t#total {\n\t\tcolor: var(--alt1-color);\n\t\tfont-weight: bold;\n\t}\n\n\t#label {\n\t\twhite-space: nowrap;\n\t\tfont-style: italic;\n\t\tcolor: var(--fade-color);\n\t}\n\n\t.title {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tfont-size: var(--label-size);\n\t\tpadding: .2em;\n\t\tcolor: var(--fade-color);\n\t\tborder-bottom: 1px solid var(--border-color);\n\t\ttext-align: center;\n\t\tmin-width: 12em;\n\t\tjustify-content: center;\n\t}\n\n\tselect {\n\t\tflex: 1;\n\t\tmin-width: 0;\n\t\tbackground-color: var(--form-bgcolor);\n\t\tcolor: var(--form-color);\n\t\tborder: 1px solid var(--border-color);\n\t\ttext-overflow: ellipsis;\n\t\tfont-size: inherit;\n\t}\n\n\twsp-src-grid {\n\t\tborder: none;\n\t}\n\n`)
REG.reg.addToList("actions:ribbonRef:shortDesc","focusItem",1,FocusItemSelRef.SINGLETON)
customElements.define("wsp-rib-refs",RibbonRefs)
export class RibbonLc extends RibbonBase{_initialize(init){super._initialize(init)
this.reg.env.longDescChange.add(this.refresh.bind(this))
this.template=this.reg.getSvc("ribbon.item.lc.tpl")||RibbonLc._template
this.setTooltip(RibbonLc._tooltip,true)}static _template(rib){const longDesc=rib.reg.env.longDesc
const lcState=rib.reg.env.wsp.wspMetaUi.getLcStateOrUnknown(longDesc.lcSt)
return xhtml`<div class="smallTi">${rib.reg.env.wsp.wspMetaUi.getLcName()}</div><div id="lcSt"><img src="${lcState.iconUrl||""}"/>${lcState.name}</div>`}static _tooltip(rib,tooltip){const tpl=JSX.createElement("div",{id:"ttRoot"},JSX.createElement(ShadowJsx,{skin:rib.localName,reg:rib.reg},JSX.createElement("div",{id:"last"},JSX.createElement("div",null,"Changé le ",JSX.createElement("span",{id:"lastDt"})),JSX.createElement("div",null,"par ",JSX.createElement("c-user",{id:"lastUser"}))),JSX.createElement(BarActions,{class:"vertical","î":{reg:rib.reg,actions:LIFECYCLE.listAllTransitionActions(rib.reg.env.wsp.wspMetaUi),actionContext:rib.shortDescCtx,uiContext:"dialog",groupOrder:rib.reg.env.wsp.wspMetaUi.getLcTransitionsGroupOrder(),disableFullOverlay:true}})))
tooltip.addEventListener("c-show",()=>{const ld=rib.reg.env.longDesc
if(ld.lcDt>0){DOM.setHidden(tpl.shadowRoot.getElementById("last"),false)
DOM.setTextContent(tpl.shadowRoot.getElementById("lastDt"),LOCALE.formatDateDigitsToSec.format(ld.lcDt))
DOM.setTextContent(tpl.shadowRoot.getElementById("lastUser"),ld.lcBy)}else{DOM.setHidden(tpl.shadowRoot.getElementById("last"),true)}})
return tpl}_refresh(){super._refresh()
const longDesc=this.reg.env.longDesc
if(ITEM.isHistoryUri(longDesc.srcUri)||!LIFECYCLE.hasLcOnItem(longDesc,this.reg.env.wsp.wspMetaUi)){DOM.setHidden(this,true)}else{DOM.setHidden(this,false)
renderAppend(this.template(this),this.shadowRoot)}}}REG.reg.registerSkin("wsp-rib-lc",1,`\n\t:host {\n\t\tflex: 0 1 auto;\n\t\tmin-width: 5em;\n\t\tfont-size: var(--label-size);\n\t}\n\n\t#lcSt {\n\t\tcolor: var(--alt2-color);\n\t\tfont-weight: bold;\n\t\tpadding: 0 .3em;\n\t}\n\n\t#lcSt > img {\n\t\twidth: 1em;\n\t\theight: 1em;\n\t\tmargin-inline-end: 0.2em;\n\t}\n\n\t:host(#ttRoot) {\n\t\tpadding: .3em;\n\t}\n\n\t#last {\n\t\tpadding: .3em 0;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\t#lastUser,\n\t#lastDt {\n\t\tcolor: var(--alt1-color);\n\t\tfont-weight: bold;\n\t}\n`)
customElements.define("wsp-rib-lc",RibbonLc)
export class RibbonDynGen extends RibbonBase{_initialize(init){super._initialize(init)
this.conf=init
if(!this.conf.dynGen)this.conf.dynGen={}
if(!("reg"in this.conf.dynGen))this.conf.dynGen.reg=this.reg
if(!("autoResize"in this.conf.dynGen))this.conf.dynGen.autoResize=true
if(!("w"in this.conf.dynGen))this.conf.dynGen.w=this.reg.env.wsp.code
if(!("r"in this.conf.dynGen))this.conf.dynGen.r=SRC.srcRef(this.reg.env.longDesc)
this.reg.env.longDescChange.add(this.refresh.bind(this))
this.template=this.reg.getSvc("ribbon.item.dynGen.tpl")||RibbonDynGen._template}static _template(rib){const longDesc=rib.reg.env.longDesc
const dynGen=(new DynGen).initialize(rib.conf.dynGen)
dynGen.onViewShown()
return xhtml`${dynGen}<div id="label">${rib.conf.label}</div>`}_refresh(){super._refresh()
const longDesc=this.reg.env.longDesc
if(ITEM.isHistoryUri(longDesc.srcUri)){DOM.setHidden(this,true)}else{DOM.setHidden(this,false)
renderAppend(this.template(this),this.shadowRoot)}}}REG.reg.registerSkin("wsp-rib-dyngen",1,`\n\t:host {\n\t\tflex: 0 1 auto;\n\t\tmin-width: 5em;\n\t\tfont-size: var(--label-size);\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t}\n\n\twsp-dyngen {\n\t\toverflow: auto;\n\t}\n\n\t#label {\n\t\twhite-space: nowrap;\n\t\tfont-style: italic;\n\t\tcolor: var(--fade-color);\n\t}\n\n`)
customElements.define("wsp-rib-dyngen",RibbonDynGen)
export class RibbonBarActions extends RibbonBase{_initialize(init){super._initialize(init)
this.conf=init
this.reg.env.longDescChange.add(this.refresh.bind(this))
this.template=this.reg.getSvc("ribbon.item.actions.tpl")||RibbonBarActions._template}static _template(rib){const longDesc=rib.reg.env.longDesc
const barActions=(new BarActions).initialize(Object.assign({uiContext:"custom",disableFullOverlay:true,overrideButtonsElts:btn=>DOM.addClass(btn,"vertical")},rib.conf.barActions,{actionContext:rib.shortDescCtx}))
return xhtml`${barActions}<div id="label">${rib.conf.label}</div>`}_refresh(){super._refresh()
const longDesc=this.reg.env.longDesc
if(ITEM.isHistoryUri(longDesc.srcUri)){DOM.setHidden(this,true)}else{DOM.setHidden(this,false)
renderAppend(this.template(this),this.shadowRoot)}}}REG.reg.registerSkin("wsp-rib-baractions",1,`\n\t:host {\n\t\tflex: 0 1 auto;\n\t\tfont-size: var(--label-size);\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t}\n\n\t#label {\n\t\twhite-space: nowrap;\n\t\tfont-style: italic;\n\t\tcolor: var(--fade-color);\n\t}\n\n`)
customElements.define("wsp-rib-baractions",RibbonBarActions)
export class RibbonResp extends RibbonBase{_initialize(init){super._initialize(init)
this.reg.env.longDescChange.add(this.refresh.bind(this))
this.template=this.reg.getSvc("ribbon.item.resp.tpl")||RibbonResp._template
this.setFloating(this.reg.getSvc("ribbon.item.resp.details")||RibbonResp._details,true)}static _template(rib){var _a
const longDesc=rib.reg.env.longDesc
const rspUsrs=RESPS.toRespsList(longDesc.rspUsrs)
const itemType=rib.reg.env.wsp.wspMetaUi.getItemType(longDesc.itModel)
let resps=JSX.createElement("div",{class:"list"})
let count=0
let hasMore=false
for(const resp of itemType.datas.resps){let nbUsers=(_a=rspUsrs[resp.code])===null||_a===void 0?void 0:_a.length
if(rspUsrs[resp.code]&&nbUsers>0){const keyElt=resps.appendChild(JSX.createElement("div",{class:"key"},resp.name))
if(resp.desc)keyElt.title=resp.desc
const values=resps.appendChild(JSX.createElement("div",{class:"values"}))
values.appendChild(JSX.createElement("c-userref",{class:"inline","î":{reg:rib.reg,nickOrAccount:rspUsrs[resp.code][0]}}))
if(--nbUsers>0)values.appendChild(JSX.createElement("span",{class:"moreUsers"},"+",nbUsers))
count++}}if(count==0&&itemType.hasResps())resps.appendChild(JSX.createElement(MsgLabel,{id:"noRespLabel","î":{label:"Responsabilités non définies",level:rib.isInError()?"error":"info"}}))
return xhtml`${resps}`}static _details(rib,popup){const longDesc=rib.reg.env.longDesc
const rspUsrs=RESPS.toRespsList(longDesc.rspUsrs)
const itemType=rib.reg.env.wsp.wspMetaUi.getItemType(longDesc.itModel)
let resps=JSX.createElement("div",{class:"list"})
itemType.datas.resps.forEach(resp=>{const keyElt=resps.appendChild(JSX.createElement("div",{class:"key"},resp.name))
if(resp.desc)keyElt.title=resp.desc
const inptELt=resps.appendChild(JSX.createElement(RespEditField,{class:"values","î":{reg:rib.reg,resp:resp.code}}))})
return JSX.createElement("div",null,JSX.createElement(ShadowJsx,{skin:"wsp-rib-resp/details",reg:rib.reg},JSX.createElement("div",{class:"title"},"Responsabilités"),resps))}isInError(){const longDesc=this.reg.env.longDesc
return longDesc.rspSt===EItResp.errors}_refresh(){super._refresh()
const longDesc=this.reg.env.longDesc
const itemType=this.reg.env.wsp.wspMetaUi.getItemType(longDesc.itModel)
if(ITEM.isHistoryOrTrashUri(longDesc.srcUri)||!itemType.hasResps()){DOM.setHidden(this,true)}else{DOM.setHidden(this,false)
DOM.setAttrBool(this,"data-error",this.isInError())
renderAppend(this.template(this),this.shadowRoot)}}}REG.reg.registerSkin("wsp-rib-resp",1,`\n\t:host {\n\t\tflex: 0 1 auto;\n\t\tmin-width: 5em;\n\t\tfont-size: var(--label-size);\n\t\tdisplay: flex;\n\t}\n\n\t:host(#ttRoot) {\n\t\tpadding: .3em;\n\t}\n\n\t:host([data-error]) {\n\t\tbox-shadow: inset 0 0 5px var(--error-color);\n\t}\n\n\t.list {\n\t\toverflow: auto;\n\t\tpadding: 2px;\n\t\tdisplay: grid;\n\t\tgrid-template-columns: auto 1.5fr;\n\t\tgrid-column-gap: .5em;\n\t\tgrid-row-gap: .2em;\n\t\talign-items: center;\n\t}\n\n\t.key {\n\t\ttext-align: start;\n\t\talign-self: start;\n\t}\n\n\t.values {\n\t\ttext-align: end;\n\t\talign-self: start;\n\t}\n\n\t.moreUsers {\n\t\tcolor: var(--alt1-color);\n\t\tfont-style: italic;\n\t}\n\n\t.moreUsers::before {\n\t\tcontent: ", ";\n\t}\n\n\t.values > c-userref + c-userref {\n\t\tmargin-inline-start: 1em;\n\t}\n\n\t#noRespLabel {\n\t\tgrid-column-start: 0;\n\t\tgrid-column-end: 1;\n\t}\n\n`)
REG.reg.registerSkin("wsp-rib-resp/details",1,`\n\t:host {\n\t\t/*min-width: 20em;*/\n\t\twidth: 30em;\n\t\tmax-width: 100%;\n\t}\n\n\t.title {\n\t\tfont-size: var(--label-size);\n\t\tpadding: .2em;\n\t\tcolor: var(--fade-color);\n\t\tborder-bottom: 1px solid var(--border-color);\n\t\ttext-align: center;\n\t}\n\n\t.list {\n\t\tpadding: .2em;\n\t\tdisplay: grid;\n\t\tgrid-template-columns: auto 1fr;\n\t\tgrid-column-gap: .5em;\n\t\tgrid-row-gap: .5em;\n\t\talign-items: center;\n\t}\n\n\t.key {\n\t\ttext-align: start;\n\t}\n\n\t.values {\n\t\ttext-align: end;\n\t\tmin-width: 10em;\n\t}\n`)
customElements.define("wsp-rib-resp",RibbonResp)
export class RibbonTasks extends RibbonBase{constructor(){super(...arguments)
this._noFetch=true}_initialize(init){super._initialize(init)
if(!this.reg.env.wsp.wspMetaUi.hasTasks){this.hidden=true
return}this.fetch=this.reg.getSvc("ribbon.item.tasks.fetch")||this._fetch
this.template=this.reg.getSvc("ribbon.item.tasks.tpl")||RibbonTasks._template
this.setFloating(this.reg.getSvc("ribbon.item.tasks.details")||RibbonTasks._details)
setTimeout(async()=>{this._noFetch=false
this.refresh()},300)}async _fetch(rib){const counts=await WSP.fetchSrc(rib.reg.env.wsp,rib,SRC.srcRef(rib.reg.env.longDesc),["tkPendingCount","tkForthcomingCount"])
rib.pending=counts.tkPendingCount||0
rib.forthcoming=counts.tkForthcomingCount||0}static _template(rib){const pending=rib.pending
const forthcoming=rib.forthcoming
return xhtml`<div><span id="pending" title="Tâches en cours">${pending!==undefined?pending:"..."}</span>
<span id="forthcoming" title="Tâches à venir">${forthcoming!==undefined?`(${forthcoming})`:"..."}</span></div>
<div id="label">tâches</div>`}static _details(rib,popup){const tasks=(new Tasks).initialize({reg:rib.reg,ephemeralView:true,refreshCb:(visibleStage,tasks)=>{if(visibleStage===ETaskStage.pending)DOM.setTextContent(rib.shadowRoot.getElementById("pending"),tasks.length.toString())
else if(visibleStage===ETaskStage.forthcoming)DOM.setTextContent(rib.shadowRoot.getElementById("forthcoming"),`(${tasks.length.toString()})`)}})
return JSX.createElement(ViewsContainer,{"î":{views:[tasks]}},JSX.createElement(ShadowJsx,{skin:"wsp-rib-tasks/details",reg:rib.reg},JSX.createElement("div",{class:"title"},"Tâches liées à cet item"),tasks))}_refresh(){super._refresh()
if(!this.hidden){if(!this._noFetch)this.fetch(this).then(()=>renderAppend(this.template(this),this.shadowRoot))
else renderAppend(this.template(this),this.shadowRoot)}}}REG.reg.registerSkin("wsp-rib-tasks",1,`\n\t:host {\n\t\tflex: 0 1 auto;\n\t\tmin-width: 3em;\n\t\t--row-bgcolor: var(--bgcolor);\n\t}\n\n\t#pending {\n\t\tcolor: var(--alt1-color);\n\t\tfont-weight: bold;\n\t}\n\n\t#forthcoming {\n\t\tcolor: var(--alt2-color);\n\t\tfont-weight: bold;\n\t\tfont-size: .8em;\n\t}\n\n\t#label {\n\t\twhite-space: nowrap;\n\t\tfont-style: italic;\n\t\tcolor: var(--fade-color);\n\t}\n`)
REG.reg.registerSkin("wsp-rib-tasks/details",1,`\n\t:host {\n\t\tmin-width: 40em;\n\t}\n\n\t.title {\n\t\tfont-size: var(--label-size);\n\t\tpadding: .2em;\n\t\tcolor: var(--fade-color);\n\t\tborder-bottom: 1px solid var(--border-color);\n\t\ttext-align: center;\n\t}\n`)
customElements.define("wsp-rib-tasks",RibbonTasks)
REG.reg.addToList("ribbon:item","info",1,RibbonItemInfo,10)
REG.reg.addToList("ribbon:item","tabs",1,RibbonTabs,15)
REG.reg.addToList("ribbon:item","refs",1,RibbonRefs,500)

//# sourceMappingURL=ribbon.js.map