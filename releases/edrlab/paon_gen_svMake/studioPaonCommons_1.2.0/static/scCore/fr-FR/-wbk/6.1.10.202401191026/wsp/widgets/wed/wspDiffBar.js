import{DiffPanelBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/diffBar_.js"
import{SrcPointer,SrcPointerErase,SrcPointerFastSelect,SrcPointerPaste}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcDrawer.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{ACTION,Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{EXmlDiffMode,XmlDiffSession}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/diff.js"
import{ButtonActions,ButtonToggle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{DOM,JSX,ShadowJsx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{GFX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/gfx.js"
import{ArrowScrollBox}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/scroll.js"
import{LOCALE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{UserRef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/userRef.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/widgets_Perms.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
export class DrfRefDiffPanel extends DiffPanelBase{initPanel(action,bar){this._initPanel(action,bar)
this.shadowRoot.appendChild(this.result)
this.execDiff()
return this}setDiff(params){this.erased=params===null
this.execDiff()}buildDiffParams(){return{diffId:this.action.getId()}}execDiff(fullRefresh){if(fullRefresh)this.erased=false
return callDiff(this.erased?"":"special:drf:ref",this,EXmlDiffMode.diff)}}REG.reg.registerSkin("wed-diff-drfref",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tjustify-content: center;\n\t}\n`)
customElements.define("wed-diff-drfref",DrfRefDiffPanel)
export class DrvDiffPanel extends DiffPanelBase{initPanel(action,bar){this._initPanel(action,bar)
this.shadowRoot.appendChild(this.result)
this.execDiff()
return this}setDiff(params){this.erased=params===null
this.execDiff()}buildDiffParams(){return{diffId:this.action.getId()}}execDiff(fullRefresh){if(fullRefresh)this.erased=false
return callDiff(this.erased?"":this.action.specialRef,this,EXmlDiffMode.diff)}}REG.reg.registerSkin("wed-diff-drv",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tjustify-content: center;\n\t}\n`)
customElements.define("wed-diff-drv",DrvDiffPanel)
export class HistoItemDiffPanel extends DiffPanelBase{constructor(){super(...arguments)
this.userColors=new Map
this.colorOffset=0}initPanel(action,bar){this._initPanel(action,bar)
this.topLine=JSX.createElement("div",{id:"top"})
this.middleLine=JSX.createElement("div",{id:"middle"})
this.bottomLine=JSX.createElement("div",{id:"bottom"})
this.diffSelView=JSX.createElement("div",{id:"sel"})
this.scrollLine=JSX.createElement(ArrowScrollBox,null,JSX.createElement("div",{id:"lines"},this.topLine,this.middleLine,this.bottomLine))
this.shadowRoot.append(this.scrollLine,JSX.createElement("div",{id:"states"},this.diffSelView,this.result))
this.fields=this.reg.env.wsp.getShortDescFields().concat("metaFlag","metaComment").join("*")
this.middleLine.addEventListener("keydown",this.onKeyDownInLine)
this.middleLine.addEventListener("dblclick",this.onDblclickInLine)
this.getColor(this.reg.env.securityCtx.account)
return this}connectDoc(){super.connectDoc()
this.updateHisto()}unconnectDoc(){super.unconnectDoc()
this.resetHisto()}onViewShown(){if(!this._onItemChange&&this.reg.env.longDescChange)this.reg.env.longDescChange.add(this._onItemChange=this.onItemChange.bind(this))}onViewHidden(closed){if(closed&&this.reg.env.longDescChange)this.reg.env.longDescChange.delete(this._onItemChange)
this.closeTooltip()}onItemChange(){if(this.docConnected)this.updateHisto()}async updateHisto(){const hadFocus=this.matches(":focus-within")
this.resetHisto()
try{const editedSrc=this.wedMgr.docHolder.house.srcFields
const hist=await WSP.fetchHistory(this.reg.env.wsp,this,editedSrc.srcLiveUri||editedSrc.srcUri,this.fields)
const count=hist.histNodes.length
if(count<=1){this.middleLine.append("Aucune entrée d\'historique disponible")
this.srcDiff=null
this.execDiff()
return}const rect=this.topLine.parentElement.getBoundingClientRect()
const h=Math.floor(rect.height/3)
const hHalf=h/2
const w=Math.round(GFX.bound(h+4,(rect.width-count)/(count+1),h*3))
const wHalf=w/2
const linePath=`M 0,${hHalf} H ${w}`
const rate=((h-2)/14).toString()
let nextOnTop=false
let nextWidthTop=0
let nextWidthBottom=0
const currentOffset=hist.histNodes.findIndex(src=>src.srcUri===editedSrc.srcUri)
const currentDate=new Date(currentOffset>=0?hist.histNodes[currentOffset].srcDt:Date.now())
this.topLine.appendChild(JSX.createElement("div",null))
nextWidthTop+=w
this.middleLine.appendChild(JSX.asSvg(()=>JSX.createElement("svg",{id:"frontArrowEnd",width:w,height:h,fill:"none","stroke-width":"2",stroke:"var(--alt2-color)"},JSX.createElement("path",{d:`M 0,${hHalf} H ${hHalf}`}),JSX.createElement("path",{d:`M 1,2 ${hHalf},${hHalf} 1,${h-2}`}))))
this.bottomLine.appendChild(JSX.createElement("div",null))
nextWidthBottom+=w
let srcDiffFound=false
let previousTime=""
for(let i=0;i<hist.histNodes.length;i++){const src=hist.histNodes[i]
let srcTime
if(i===currentOffset){if(nextWidthTop>0)this.topLine.lastElementChild.style.width=nextWidthTop+"px"
this.topLine.append(JSX.asSvg(()=>JSX.createElement("svg",{width:w,height:h},JSX.createElement("path",{transform:`translate(${wHalf-hHalf})`,d:`M 0,3 H ${h} L ${hHalf},${h}`,fill:"var(--alt2-color)"}))),JSX.createElement("div",null))
nextWidthTop=0
if(nextWidthBottom>0)this.bottomLine.lastElementChild.style.width=nextWidthBottom+"px"
this.bottomLine.append(JSX.asSvg(()=>JSX.createElement("svg",{width:w,height:h},JSX.createElement("path",{transform:`translate(${wHalf-hHalf})`,d:`M 0,${h-3} H ${h} L ${hHalf},0`,fill:"var(--alt2-color)"}))),JSX.createElement("div",null))
nextWidthBottom=0
nextOnTop=!nextOnTop}else{srcTime=LOCALE.formatMinDuration(currentDate,new Date(src.srcDt),true,"+-")
if(srcTime===previousTime){srcTime=""
nextWidthTop+=w
nextWidthBottom+=w}else{if(nextOnTop){if(nextWidthTop>0)this.topLine.lastElementChild.style.width=nextWidthTop+"px"
this.topLine.appendChild(JSX.createElement("wed-histo-time",{class:i>currentOffset?"timeAfter":"timeBefore"},srcTime))
nextWidthTop=w
nextWidthBottom+=w}else{if(nextWidthBottom>0)this.bottomLine.lastElementChild.style.width=nextWidthBottom+"px"
this.bottomLine.appendChild(JSX.createElement("wed-histo-time",{class:i>currentOffset?"timeAfter":"timeBefore"},srcTime))
nextWidthBottom=w
nextWidthTop+=w}previousTime=srcTime
nextOnTop=!nextOnTop}}const color=this.getColor(src.srcUser)
const shape=JSX.asSvg(()=>{if(ITEM.isHistoryUri(src.srcUri)){src.srcLiveUri=hist.liveNode.srcUri
if(src.metaFlag>0){return JSX.createElement("path",{transform:`matrix(${rate},0,0,${rate},${wHalf-hHalf},0)`,d:"m 18.1,8.2 -5.25,2.25 0.7,5.3 L 9,12.35 4.76,15.6 5.43,9.93 0.5,7.9 5.74,5.65 5,0.35 9.6,3.77 13.83,0.5 13.2,6.18 Z","stroke-width":"2",fill:color,stroke:"var(--alt2-color)"})}else{return JSX.createElement("circle",{cx:wHalf,cy:hHalf,r:hHalf-2,"stroke-width":"2",fill:color,stroke:"var(--alt2-color)"})}}else if(src.metaFlag>0){return JSX.createElement("g",null,JSX.createElement("rect",{x:wHalf-hHalf+1,y:"0",width:h,height:h,fill:"var(--alt2-color)"}),JSX.createElement("path",{transform:`matrix(${rate},0,0,${rate},${wHalf-hHalf},0)`,d:"m 18.1,8.2 -5.25,2.25 0.7,5.3 L 9,12.35 4.76,15.6 5.43,9.93 0.5,7.9 5.74,5.65 5,0.35 9.6,3.77 13.83,0.5 13.2,6.18 Z",fill:color}))}else{return JSX.createElement("rect",{x:wHalf-hHalf+1,y:"1",width:h-2,height:h-2,"stroke-width":"2",fill:color,stroke:"var(--alt2-color)"})}})
const point=JSX.createElement("wed-histo-point",null,JSX.asSvg(()=>JSX.createElement("svg",{width:srcTime?w-1:w,height:h},JSX.createElement("path",{d:linePath,"stroke-width":"2",stroke:"var(--alt2-color)"}),shape,src.metaComment?JSX.createElement("path",{transform:`matrix(${rate},0,0,${rate},${wHalf},0)`,d:"M 1,5.7 5.8,0 8,1.9 3,7.4 0,9",fill:"var(--alt1-color)"}):undefined)))
if(srcTime)point.classList.add(i>currentOffset?"timeAfter":"timeBefore")
point.shortDesc=src
this.middleLine.appendChild(point)
if(this.srcDiff&&!srcDiffFound&&SRC.srcRef(src)===this.srcDiff){this._setDiffPoint(point)
srcDiffFound=true}if(i===currentOffset)this.currentPoint=point}if(!srcDiffFound&&this.srcDiff){this.srcDiff=null
this.execDiff()}if(nextWidthTop>0)this.topLine.lastElementChild.style.width=nextWidthTop+"px"
if(nextWidthBottom>0)this.bottomLine.lastElementChild.style.width=nextWidthBottom+"px"
if(this.currentPoint){this.currentPoint.focusable=true
this.scrollLine.scrollToChild(this.currentPoint)
if(hadFocus)this.currentPoint.focus()}}catch(e){ERROR.log(e)}}resetHisto(){this.topLine.textContent=null
this.middleLine.textContent=null
this.bottomLine.textContent=null}onKeyDownInLine(ev){if(ACTION.isAnyControlPressed(ev))return
const histoPoint=ev.target
switch(ev.key){case"ArrowLeft":if(histoPoint.nextElementSibling instanceof HistoPoint)histoPoint.nextElementSibling.focus()
break
case"ArrowRight":if(histoPoint.previousElementSibling instanceof HistoPoint)histoPoint.previousElementSibling.focus()
break
case"Enter":histoPoint.click()
break
default:return}ev.preventDefault()
ev.stopPropagation()}onDblclickInLine(ev){const histoPoint=DOM.findParent(ev.target,this,n=>n instanceof HistoPoint)
if(histoPoint)ShowHistoDiff.SINGLETON.executeIfAvailable(histoPoint,ev)}setCurrentTooltip(tt){var _a;(_a=this._tt)===null||_a===void 0?void 0:_a.close()
this._tt=tt}closeTooltip(){if(this._tt){this._tt.close()
this._tt=null}}async execDiff(fullRefresh){if(fullRefresh)await this.updateHisto()
return callDiff(this.srcDiff,this,EXmlDiffMode.diff)}setDiff(params){this.setSrcDiff(params===null||params===void 0?void 0:params.srcDiff)}setSrcDiff(srcDiff){this.srcDiff=srcDiff
this.execDiff()
let point
if(this.middleLine.hasChildNodes()){for(let ch of this.middleLine.children){if(ch instanceof HistoPoint&&SRC.srcRef(ch.shortDesc)===srcDiff){point=ch
break}}}this._setDiffPoint(point)}setDiffPoint(histoPoint){this._setDiffPoint(histoPoint)
this.srcDiff=histoPoint?SRC.srcRef(histoPoint.shortDesc):null
this.execDiff()}_setDiffPoint(histoPoint){var _a;(_a=this.diffPoint)===null||_a===void 0?void 0:_a.classList.remove("diff")
if(histoPoint){histoPoint.classList.add("diff")
this.diffPoint=histoPoint
const dt=new Date(histoPoint.shortDesc.srcDt)
const date=dt.toLocaleDateString("fr")
const time=dt.toLocaleTimeString("fr")
this.diffSelView.textContent=ITEM.isHistoryUri(histoPoint.shortDesc.srcUri)?`Entrée du ${date} à ${time}`:"Item courant (${date} à ${time})"}else{this.diffSelView.textContent=null}}buildDiffParams(){return{diffId:this.action.getId(),srcDiff:this.srcDiff}}getColor(a){if(!a)return"white"
let color=this.userColors.get(a)
if(color)return color
color=COLORS[this.colorOffset++]
this.userColors.set(a,color)
if(this.colorOffset>=COLORS.length)this.colorOffset=1
return color}}const COLORS=["#AAA","#9370db","#b22222","#2e8b57","#ff4500","#3c64e6","#ffe100","#c99b61","#b0e0e6","#ff6293","#9acd32","#ffb6c1","#20b2aa","#0000c8","#ffa500","#789bf2","#eedfb8","#4d453a"]
REG.reg.registerSkin("wed-diff-histoitem",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t}\n\n\tc-arrow-scroll-box {\n\t\tjustify-content: end;\n\t}\n\n\t#lines {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\talign-items: center;\n\t\tmargin: 0 1em;\n\t}\n\n\t#top,\n\t#middle,\n\t#bottom {\n\t\theight: 1em;\n\t\tdisplay: flex;\n\t\tflex-direction: row-reverse;\n\t}\n\n\twed-histo-point {\n\t\tdisplay: flex;\n\t\tjustify-content: center;\n\t\tbox-sizing: border-box;\n\t}\n\n\twed-histo-point:hover,\n\twed-histo-point.hover {\n\t\toutline: 2px dotted var(--border-color);\n\t\tcursor: pointer;\n\t}\n\n\twed-histo-point:focus {\n\t\toutline: var(--focus-outline);\n\t}\n\n\twed-histo-point.diff {\n\t\tbackground-color: var(--alt2-color);\n\t}\n\n\twed-histo-point.timeAfter {\n\t\tborder-inline-end: 1px solid var(--color);\n\t}\n\n\twed-histo-point.timeBefore {\n\t\tborder-inline-start: 1px solid var(--color);\n\t}\n\n\twed-histo-time {\n\t\tbox-sizing: border-box;\n\t\tfont-size: 80%;\n\t\twhite-space: nowrap;\n\t\ttext-overflow: ellipsis;\n\t\toverflow: hidden;\n\t\tpadding: 0 1px;\n\t\tuser-select: none;\n\t}\n\n\twed-histo-time.timeAfter {\n\t\ttext-align: end;\n\t\tborder-inline-end: 1px solid var(--color);\n\t}\n\n\twed-histo-time.timeBefore {\n\t\tborder-inline-start: 1px solid var(--color);\n\t}\n\n\t#states {\n\t\tdisplay: flex;\n\t\theight: 1.5em;\n\t}\n\n\t#sel {\n\t\tflex: 1 1 auto;\n\t\tmargin: 0 1em;\n\t\twhite-space: nowrap;\n\t\ttext-overflow: ellipsis;\n\t\toverflow: hidden;\n\t}\n\n\t#result {\n\t\tflex: 1 2 auto;\n\t\twhite-space: nowrap;\n\t\ttext-overflow: ellipsis;\n\t\toverflow: hidden;\n\t\tmargin: 0 1em;\n\t}\n`)
customElements.define("wed-diff-histoitem",HistoItemDiffPanel)
export class HistoPoint extends HTMLElement{constructor(){super()
this.onclick=POPUP.promiseTooltip(this,this.onBuildTooltipPoint,{hoverAllowed:true})
this.onblur=ev=>{if(this.popupTooltip&&!DOM.isAncestor(this.popupTooltip,ev.relatedTarget))this.popupTooltip.close()}}get histoPanel(){return DOMSH.findHost(this)}get focusable(){return this.tabIndex===0}set focusable(f){if(f){for(let ch of this.parentElement.children){if(ch!==this&&ch.hasAttribute("tabindex"))ch.removeAttribute("tabindex")}this.tabIndex=0}else if(this.hasAttribute("tabindex")){this.removeAttribute("tabindex")}}focus(options){this.focusable=true
super.focus(options)
const scroll=DOM.findParent(this,null,n=>n instanceof ArrowScrollBox)
scroll===null||scroll===void 0?void 0:scroll.scrollToChild(this)}onBuildTooltipPoint(point,tooltip){const panel=point.histoPanel
const dt=new Date(point.shortDesc.srcDt)
const date=dt.toLocaleDateString("fr")
const time=dt.toLocaleTimeString("fr")
const reg=panel.reg
const actionsBar=JSX.createElement(BarActions,{"î":{reg:reg,actions:reg.getList("actions:item:histoEntry"),actionContext:point,disableFullOverlay:true}})
tooltip.addEventListener("c-show",()=>{point.classList.toggle("hover",true)
panel.setCurrentTooltip(tooltip)
Promise.resolve().then(()=>{const focusbale=DOMSH.findFlatNext(actionsBar,actionsBar,DOM.IS_focusable)
if(focusbale)focusbale.focus()})})
tooltip.addEventListener("c-beforeclose",()=>{point.classList.toggle("hover",false)
panel.setCurrentTooltip(null)})
point.startBtn=JSX.createElement(ButtonToggle,{id:"metaStar","î":{reg:reg},title:"Lorsque l\'entrée est marquée, elle est préservée des purges progressives automatiques"},JSX.asSvg(()=>JSX.createElement("svg",{width:"16",height:"16"},JSX.createElement("path",{id:"star","stroke-width":"1",d:"M 11.35,13.56 8,11.1 4.6,13.56 5,9.4 1.2,7.73 5,6 4.56,1.84 7.95,4.33 11.35,1.84 10.9,6 14.75,7.73 10.9,9.43 Z"}))))
point.startBtn.toggleOn=point.shortDesc.metaFlag>0
point.commentInput=JSX.createElement("input",{id:"metaComment",value:point.shortDesc.metaComment||"",placeholder:"Note...",title:"Note associée à cette entrée dans l\'historique"})
if(reg.hasPerm("action.wsp.histo#change.flag")){point.startBtn.onclick=point.updateMetaFlag.bind(point)}else{point.startBtn.disabled=true}if(reg.hasPerm("action.wsp.histo#change.comment")){point.commentInput.onblur=point.updateMetaComment.bind(point)}else{point.commentInput.disabled=true}return JSX.createElement("div",null,JSX.createElement(ShadowJsx,{skin:"wed-histo-point/tooltip",skinOver:"form-control-areas"},actionsBar,JSX.createElement("div",{id:"metas"},point.startBtn,point.commentInput),JSX.createElement("div",{id:"fields"},JSX.createElement("div",{class:"field"},JSX.createElement("span",{class:"label"},"Entrée du :"),JSX.createElement("span",{class:"value"},`${date} à ${time}`)),JSX.createElement("div",{class:"field"},JSX.createElement("span",{class:"label"},"Modifié par :"),JSX.createElement("span",{class:"value"},JSX.createElement(UserRef,{"î":{nickOrAccount:point.shortDesc.srcUser,reg:reg}}))))))}async updateMetaFlag(){try{await WSP.srcUpdateFields(this.histoPanel.reg.env.wsp,this,SRC.srcRef(this.shortDesc),{metaFlag:!this.shortDesc.metaFlag?1:0})}catch(e){await ERROR.report("La modification de la marque de cette entrée a échoué.",e)}return this.histoPanel.updateHisto()}async updateMetaComment(){const v=this.commentInput.value
const metas={metaComment:v}
if(!this.shortDesc.metaFlag&&v&&!this.shortDesc.metaComment)metas.metaFlag=1
try{await WSP.srcUpdateFields(this.histoPanel.reg.env.wsp,this,SRC.srcRef(this.shortDesc),metas)}catch(e){await ERROR.report("L\'enregistrement de la note pour cette entrée a échoué.",e)}return this.histoPanel.updateHisto()}}REG.reg.registerSkin("wed-histo-point/tooltip",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t}\n\n\tc-bar-actions {\n\t\tborder-bottom: 1px solid var(--border-color\n\t\t);\n\t}\n\n\t#metas {\n\t\tdisplay: flex;\n\t\tmargin: .5em 0;\n\t}\n\n\t#metaStar {\n\t\tmargin: 1px;\n\t\tborder: none;\n\t}\n\n\t#star {\n\t\tstroke: var(--fade-color);\n\t\tfill: var(--fade-color);\n\t\topacity: .6;\n\t}\n\n\t#metaStar[aria-pressed=true] #star {\n\t\tstroke: var(--alt2-color);\n\t\tfill: var(--wsp-item-histo-star-bgcolor, #ffea00);\n\t\topacity: unset;\n\t}\n\n\t#metaComment {\n\t\tflex: 1;\n\t\tmin-width: 8em;\n\t\tmax-width: 70vw;\n\t\tmargin: 1px;\n\t}\n\n\t::placeholder {\n\t\tcolor: var(--fade-color);\n\t\tletter-spacing: 2px;\n\t\tfont-size: var(--label-size);\n\t\tfont-style: italic;\n\t}\n\n\t#fields {\n\t\tdisplay: grid;\n\t\tmin-width: 0;\n\t\tgrid-template-columns: auto 1fr;\n\t\tgrid-row-gap: .5em;\n\t\tgrid-column-gap: 1em;\n\t\tpadding: .5em;\n\t}\n\n\t.field {\n\t\tdisplay: contents;\n\t}\n\n\t.value {\n\t\tcolor: var(--alt2-color);\n\t\tuser-select: text;\n\t}\n`)
customElements.define("wed-histo-point",HistoPoint)
class ShowHistoDiff extends Action{constructor(){super("histoDiff")
this._label="Afficher les différences"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/diff/diff.svg"}isEnabled(ctx){const house=ctx.histoPanel.wedMgr.docHolder.house
if(!house)return false
if(SRC.srcRef(ctx.shortDesc)===SRC.srcRef(house.srcFields))return false
return super.isEnabled(ctx)}execute(ctx,ev){const panel=ctx.histoPanel
panel.setDiffPoint(ctx)
panel.closeTooltip()}}ShowHistoDiff.SINGLETON=new ShowHistoDiff
REG.reg.addToList("actions:item:histoEntry","histoDiff",1,ShowHistoDiff.SINGLETON)
class DeleteHistoEntry extends Action{constructor(){super("delEntry")
this._label="Supprimer définitivement cette entrée"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/delete.svg"
this._group="delete"}isEnabled(ctx){if(!ITEM.isHistoryUri(ctx.shortDesc.srcUri))return false
if(ctx.histoPanel.reg.env.longDesc.srcUri===ctx.shortDesc.srcUri)return false
return super.isEnabled(ctx)}checkObjectRootPerm(ctx,perms){const histoPanel=ctx.histoPanel
return histoPanel.reg.hasPerm(ctx.shortDesc.srcUser===histoPanel.reg.env.securityCtx.account?"action.wsp.histo#deletePermanently.mine":"action.wsp.histo#deletePermanently")}async execute(ctx,ev){const panel=ctx.histoPanel
panel.closeTooltip()
const dt=new Date(ctx.shortDesc.srcDt)
const date=dt.toLocaleDateString("fr")
const time=dt.toLocaleTimeString("fr")
if(await POPUP.confirm(`Souhaitez-vous vraiment supprimer définitivement cette entrée d\'historique du ${date} à ${time} ?`,ctx,{okLbl:"Supprimer définitivement"})){await WSP.srcDeletePermanently(panel.reg.env.wsp,ctx,[ctx.shortDesc.srcUri])
return panel.updateHisto()}}}DeleteHistoEntry.SINGLETON=new DeleteHistoEntry
REG.reg.addToList("actions:item:histoEntry","delEntry",1,DeleteHistoEntry.SINGLETON)
class OpenHistoEntry extends Action{constructor(){super("openEntry")
this._label="Visualiser cette entrée"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/openItem.svg"
this._group="open"}isEnabled(ctx){if(!ITEM.isHistoryUri(ctx.shortDesc.srcUri))return false
if(ctx.histoPanel.reg.env.longDesc.srcUri===ctx.shortDesc.srcUri)return false
return super.isEnabled(ctx)}async execute(ctx,ev){const panel=ctx.histoPanel
panel.closeTooltip()
const title=ITEM.getItemUriLabel(ctx.shortDesc.srcUri,ctx.shortDesc)
const dt=new Date(ctx.shortDesc.srcDt)
const date=dt.toLocaleDateString("fr")
const time=dt.toLocaleTimeString("fr")
if(!_ItemIsolated)_ItemIsolated=(await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemIsolated.js")).ItemIsolated
POPUP.showDialog((new _ItemIsolated).initialize({reg:ctx.histoPanel.reg.env.wsp.reg,srcRef:SRC.srcRef(ctx.shortDesc)}),ctx,{initWidth:"80%",initHeight:"80%",titleBar:{barLabel:{label:`${title} du ${date} à ${time}`}},resizer:{}})}}OpenHistoEntry.SINGLETON=new OpenHistoEntry
let _ItemIsolated
REG.reg.addToList("actions:item:histoEntry","openEntry",1,OpenHistoEntry.SINGLETON)
export class OtherItemDiffPanel extends DiffPanelBase{initPanel(action,bar){this._initPanel(action,bar)
this.diffMode=EXmlDiffMode.diff
this.srcDiff=(new SrcPointer).initialize({reg:this.reg,defaultAction:SrcPointerFastSelect.SINGLETON,actionsLists:["actions:wsp:wed:otherItemDiff","actions:wsp:shortDesc"],accelKeysLists:["accelkeys:wsp:wed:otherItemDiff","accelkeys:wsp:shortDesc"],draggable:true,dropable:true})
this.srcDiff.onSrcRefChange.add(this.onSrcDiffChange)
this.diffModeBtn=(new ButtonActions).initialize({reg:this.reg,label:diffModeActions[0].getLabel(this),actions:diffModeActions,actionContext:this})
this.shadowRoot.append(this.srcDiff,this.result,this.diffModeBtn)
return this}setDiff(params){this.srcDiff.setSrcRef(params===null||params===void 0?void 0:params.srcDiff)
if(params)this.diffMode=params.mode||EXmlDiffMode.diff
diffModeActions[this.diffMode===EXmlDiffMode.diff?0:1].execute(this)}buildDiffParams(){return{diffId:this.action.getId(),srcDiff:this.srcDiff.srcRef,mode:this.diffMode}}async execDiff(){var _a
const sd=this.srcDiff.shortDesc
if(sd){const itemType=(_a=this.reg.env.wsp.wspMetaUi)===null||_a===void 0?void 0:_a.getItemType(sd.itModel)
if(itemType)return callDiff(itemType.getMainXmlSrcUri(sd),this,this.diffMode)}return callDiff(null,this,this.diffMode)}onSrcDiffChange(drawer){DOMSH.findHost(drawer).execDiff()}}function execDiff(ctx){ctx.diffMode=this.getId()==="diff"?EXmlDiffMode.diff:EXmlDiffMode.patch
ctx.diffModeBtn.label=this.getLabel(ctx)
if(!ctx.srcDiff.fetchPending)ctx.execDiff()}const diffModeActions=[new Action("diff").setLabel("Mode écarts").setExecute(execDiff),new Action("patch").setLabel("Mode contributions").setExecute(execDiff)]
REG.reg.registerSkin("wed-diff-otheritem",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tflex-wrap: wrap;\n\t\talign-items: center;\n\t}\n\n\twsp-src-pointer {\n\t\tflex: 1 1 auto;\n\t\talign-items: center;\n\t}\n\n\t#result {\n\t\tflex: 1 1 auto;\n\t}\n`)
function addAction(action,accel){REG.reg.addToList("actions:wsp:wed:otherItemDiff",action.getId(),1,action)
if(accel)REG.reg.addToList("accelkeys:wsp:wed:otherItemDiff",accel,1,action)}addAction(SrcPointerFastSelect.SINGLETON,"Enter")
addAction(SrcPointerPaste.SINGLETON,"v-accel")
addAction(new SrcPointerErase,"Delete")
customElements.define("wed-diff-otheritem",OtherItemDiffPanel)
export async function callDiff(srcRef,panel,mode){try{if(srcRef){panel.updateDiffResult("computing")
const dom=await fetchDiff(panel.wedMgr,panel.reg.env.wsp.code,srcRef)
if(dom){const session=new XmlDiffSession(dom,mode,panel.wedMgr.docHolder.getSubRoot())
panel.wedMgr.docHolder.setDiffSession(session)
panel.updateDiffResult(session.diffFound)}else{panel.wedMgr.docHolder.setDiffSession(null)
panel.updateDiffResult("error")}}else{panel.wedMgr.docHolder.setDiffSession(null)
panel.updateDiffResult(srcRef===""?"computable":null)}}catch(e){ERROR.log("Diff failed",e)
panel.wedMgr.docHolder.setDiffSession(null)
panel.updateDiffResult("error")}}async function fetchDiff(wedMgr,candidateWspCd,candidateRef,tries){var _a
const reg=wedMgr.reg
const wsp=reg.env.wsp
const srcFields=wedMgr.docHolder.house.srcFields
const srcRef=ITEM.isHistoryOrTrashUri(srcFields.srcUri)?srcFields.srcUri:SRC.srcRef(srcFields)
const wspRef=WSP.buildWspRef(wsp.code,srcRef)
if(reg.env.place.isHouseDirty(wspRef))await reg.env.place.wspsLive.saveHouse(wspRef)
const doc=await WSP.fetchDiff(reg.env.wsp,reg.env.uiRoot,srcRef,candidateWspCd,candidateRef)
const sd=(_a=reg.env.place.wspsLive.getHouseIfFetched(wspRef))===null||_a===void 0?void 0:_a.srcFields
if(sd&&(sd.srcStamp?sd.srcStamp!==doc.documentElement.getAttribute("srcStamp"):sd.srcDt!==Number.parseInt(doc.documentElement.getAttribute("srcDt")))){if(tries===2){reg.env.place.wspsLive.reloadHouse(wspRef)
return null}return fetchDiff(wedMgr,candidateWspCd,candidateRef,(tries||0)+1)}return doc}
//# sourceMappingURL=wspDiffBar.js.map