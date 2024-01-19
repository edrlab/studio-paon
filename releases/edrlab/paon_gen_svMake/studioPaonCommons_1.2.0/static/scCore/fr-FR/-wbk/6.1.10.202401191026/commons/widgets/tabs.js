import{BaseElementAsync,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{ArrowScrollBox,OrientedBox}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/scroll.js"
import{isAreaPointer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{LASTDATAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lastDatas.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{GFX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/gfx.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
export class Tabs extends BaseElementAsync{get areasContext(){return this._areasContext}set areasContext(val){this._areasContext=val
this.refresh()}get vertical(){return this.hasAttribute("vertical")}set vertical(val){if(DOM.setAttrBool(this,"vertical",val)){this.refresh()}}get areas(){return this._areas}get movable(){return this._movable}get showOnDragOver(){return this._showOnDragOver}async selectTab(tab,lastDatas){if(tab===this._selectedTab)return true
if(tab==null)return false
if(this._selectedTab&&!await this._selectedTab.hide(tab))return false
this._selectedTab=tab
await tab.show(lastDatas)
if(this._selectedTab!==tab){await tab.hide()
return false}this._tabs.scrollToChild(tab)
this._mainSlot.textContent=null
return true}get selectedTab(){return this._selectedTab}async addTab(area,options){if(this._areas)this._areas.push(area)
else this._areas=[area]
let before=null
if(options&&typeof options.position==="number"){before=this._tabs.firstElementChild
let p=options.position
while(before&&p-- >0)before=before.nextElementSibling}const tab=this._newTab(area,before,options===null||options===void 0?void 0:options.view)
if(options&&options.select)await this.selectTab(tab)}async closeTab(tab,silently,removeFromAreas){if(!await tab.closeTabView(silently))return false
if(removeFromAreas&&tab.area&&this._areas){const idx=this._areas.indexOf(tab.area)
if(idx>=0)this._areas.splice(idx,1)}if(this._selectedTab===tab){this._selectedTab=null
const nextSel=tab.nextElementSibling||tab.previousElementSibling
tab.remove()
if(nextSel){await this.selectTab(nextSel)}else{this.drawBackgroundPanels()}}else{tab.remove()}return true}async replaceTab(tab,area,silently){this._areas.push(area)
this._newTab(area,tab.nextElementSibling)
return await this.closeTab(tab,silently,true)}async drawBackgroundPanels(){if(this.backgroundPanels&&!this._mainSlot.hasChildNodes()){const c=await this.backgroundPanels(this)
if(c)this._mainSlot.appendChild(c)}}reorderTabs(deleteOthers,...tabCodes){let nextTab=this._tabs.firstElementChild
if(!nextTab)return
for(const tabCode of tabCodes){if(nextTab.code===tabCode){nextTab=nextTab.nextElementSibling}else{const tab=this.getTabByCode(tabCode)
if(tab)this._tabs.insertBefore(tab,nextTab)}}if(deleteOthers&&nextTab)do{const next=nextTab.nextElementSibling
this.closeTab(nextTab,true)
nextTab=next}while(nextTab)}getTabByCode(code){if(code!=null)for(let tab=this._tabs.firstElementChild;tab;tab=tab.nextElementSibling)if(tab.code===code)return tab
return null}findTabs(filter){return this._tabs?Array.from(this._tabs.children).filter(filter):null}hasTabs(){return this._tabs.firstElementChild!=null}visitTabs(v){for(let tab=this._tabs.firstElementChild;tab;tab=tab.nextElementSibling){if(v(tab)==="stop")return tab}return null}async visitTabsAsync(v){let tab=this._tabs.firstElementChild
while(tab){const next=tab.nextElementSibling
const r=await v(tab)
if(r==="stop")return tab
if(r!==undefined)return r
tab=next}return null}visitViews(visitor,options){if(options&&options.visible){if(this._selectedTab)return this._selectedTab.visitViews(visitor,options)}else{for(let tab=this._tabs.firstElementChild;tab;tab=tab.nextElementSibling){const r=tab.visitViews(visitor,options)
if(r!==undefined)return r}}}async visitViewsAsync(visitor,options){if(options&&options.visible){if(this._selectedTab)return this._selectedTab.visitViewsAsync(visitor,options)}else{for(let tab=this._tabs.firstElementChild;tab;tab=tab.nextElementSibling){const r=await tab.visitViewsAsync(visitor,options)
if(r!==undefined)return r}}}findTabFromDesc(node){let ch=node
while(ch&&ch.parentNode!==this)ch=DOMSH.getFlatParentElt(ch)
if(ch){return this.visitTabs(t=>t.view===ch?"stop":undefined)}return null}async _initialize(init){this._tabSkin=init.tabSkin
this._tabSkinOver=init.tabSkinOver
this._areas=init.areas
this._areasContext=init.areasContext
if("movable"in init)this._movable=init.movable
if("showOnDragOver"in init)this._showOnDragOver=init.showOnDragOver
if("vertical"in init)this.vertical=init.vertical
if(init.lastDatasKey)this.setAttribute("last-datas",init.lastDatasKey)
this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initSkins(init)
this._initTabsRoot(init)
this._tabs.addEventListener("keydown",ev=>{switch(ev.key){case"ArrowDown":case"ArrowRight":{const next=this._selectedTab?this._selectedTab.nextElementSibling:this._tabs.firstElementChild
if(next instanceof Tab&&!next.hidden&&!next.disabled){this.selectTab(next)
next.focus()}break}case"ArrowUp":case"ArrowLeft":{const next=this._selectedTab?this._selectedTab.previousElementSibling:this._tabs.lastElementChild
if(next instanceof Tab&&!next.hidden&&!next.disabled){this.selectTab(next)
next.focus()}break}}})
this.backgroundPanels=init.backgroundPanels
this._mainSlot=JSX.createElement("slot",null)
this._initShadowRoot()
this._initTabs()
if(init.lastDatas&&init.lastDatas.tab!==undefined){if(init.lastDatas.tab!==null){const t=this.getTabByCode(init.lastDatas.tab)
if(t){await this.selectTab(t,init.lastDatas)}else{await this.selectTab(this._tabs.firstElementChild)}}}else if(init.selTab!=null){await this.selectTab(this.getTabByCode(init.selTab))}else{await this.selectTab(this._tabs.firstElementChild)}if(!this._selectedTab)this.drawBackgroundPanels()}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
const areas=BASIS.extractAttr(this,"areas-list")
if(areas)init.areas=this.findReg(init).mergeLists(...areas.split(" "))
const areaCtx=BASIS.extractAttr(this,"areas-context")
if(areas&&areaCtx==null){init.areasContext=this}else if(areaCtx){init.areasContext=this.findReg(init).getSvc(areaCtx)}init.lastDatas=LASTDATAS.getLastDatas(this,this.getAttribute("last-datas"))
init.movable=this.hasAttribute("movable")
init.showOnDragOver=this.hasAttribute("show-on-dragover")
return init}_initSkins(init){this.findReg(init).installSkin("c-tabs/base",this.shadowRoot)
this._initAndInstallSkin(this.localName,init)}_initTabsRoot(init){if(init.noArrowScroll){this._tabs=(new OrientedBox).initialize({reg:this.findReg(init),vertical:this.vertical})}else{this._tabs=(new ArrowScrollBox).initialize({reg:this.findReg(init),vertical:this.vertical,cbOverflow:init.cbOverflow})
this._tabs.addEventListener("focusout",ev=>{if(this.selectedTab&&ev.relatedTarget instanceof Node&&!this._tabs.contains(ev.relatedTarget)){this._tabs.scrollToChild(this.selectedTab)}})}}_initShadowRoot(){const sr=this.shadowRoot
this._tabs.id="tabs"
sr.appendChild(JSX.createElement("div",{id:"head"},JSX.createElement("slot",{name:"tools-start"}),this._tabs,JSX.createElement("slot",{name:"tools-end"})))
sr.appendChild(JSX.createElement("div",{id:"panels"},this._mainSlot))}_initTabs(){for(const view of this._mainSlot.assignedNodes()){if(view instanceof HTMLElement){const tab=(new Tab).initialize({parentViewCtn:this,view:view})
this._initTab(tab)
this._tabs.appendChild(tab)
view.hidden=true}}if(this._areas)this._areas.forEach(area=>{this._newTab(area)})}_newTab(area,before,view){const tab=(new Tab).initialize({parentViewCtn:this,area:area,view:view,skin:this._tabSkin,skinOver:this._tabSkinOver})
this._initTab(tab)
this._tabs.insertBefore(tab,before)
return tab}_initTab(tab){tab.movable=this.movable
tab.showOnDragOver=this.showOnDragOver
tab.onclick=this._onClickTab}_onClickTab(){if(!this.disabled)this.parentViewCtn.selectTab(this)}buildLastDatas(p){const k=this.getAttribute("last-datas")
if(k){const d=p[k]={}
const tab=this.selectedTab
if(tab){d.tab=tab.code
LASTDATAS.buildLastDatas(d,tab.view,true)}else{d.tab=null}}}_refresh(){this._tabs.vertical=this.vertical
for(let tab=this._tabs.firstElementChild;tab;tab=tab.nextElementSibling){tab.refresh()}}}REG.reg.registerSkin("c-tabs/base",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\toverflow: hidden;\n\t}\n\n\t:host([vertical]) {\n\t\tflex-direction: row;\n\t}\n\n\t#head {\n\t\tdisplay: flex;\n\t\tmin-height: 1.7rem;\n\t\tmin-width: 0;\n\t}\n\n\t:host([vertical]) #head {\n\t\tflex-direction: column;\n\t\tmin-height: 0;\n\t\tmin-width: 1.7em;\n\t}\n\n\t#tabs {\n\t\tflex: 1;\n\t\ttouch-action: none;\n\t}\n\n\t/*:host([vertical]) #tabs {*/\n\t/*\tflex-direction: column;*/\n\t/*}*/\n\n\t#tabs > * {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\talign-items: center;\n\t\toverflow: hidden;\n\t\twhite-space: nowrap;\n\t\ttext-overflow: ellipsis;\n\t\ttext-align: center;\n\t\tpadding: 0.3ex 0.6ex;\n\t\tjustify-content: center;\n\t\tuser-select: none;\n\t}\n\n\t#tabs > .moved {\n\t\tz-index: 2;\n\t}\n\n\t#tabs > :not(.moved) {\n\t\ttransition: top 0.2s linear, left 0.2s linear;\n\t}\n\n\t#panels {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t::slotted([hidden]) {\n\t\tdisplay: none;\n\t}\n`)
REG.reg.registerSkin("c-tabs",1,`\n\t:host(:not([vertical])) #tabs {\n\t\tmargin-bottom: -1px;\n\t}\n\n\t:host([vertical]) #tabs {\n\t\tmargin-inline-end: -1px;\n\t}\n\n\t:host(:not([vertical])) #tabs > * {\n\t\tmin-width: var(--tab-size, 6em);\n\t\tborder-bottom: solid 2px transparent;\n\t}\n\n\t:host([vertical]) #tabs > * {\n\t\tmin-height: var(--tab-vertical-size, 2em);\n\t\tborder-inline-end: solid 2px transparent;\n\t}\n\n\t#tabs > *:hover {\n\t\t/*box-shadow: inset 0 0 3px var(--border-color);*/\n\t\tbackground: var(--pressed-bgcolor);\n\t}\n\n\t:host(.iconic) > #tabs > * {\n\t\tmin-height: 1.5em;\n\t\twidth: 1.5em;\n\t}\n\n\t:host(:not([vertical])) #tabs > .selected {\n\t\tborder-color: var(--tabl-select-color);\n\t\tcolor: var(--tabl-select-color);\n\t\t-webkit-text-stroke: .5px var(--tabl-select-color);\n\t}\n\n\t:host([vertical]) #tabs > .selected {\n\t\tborder-color: var(--tabl-select-color);\n\t\tcolor: var(--tabl-select-color);\n\t\t-webkit-text-stroke: .5px var(--tabl-select-color);\n\t}\n\n\t#panels {\n\t\tborder: solid 1px var(--border-color);\n\t}\n\n\t:host(.noBorder) #panels {\n\t\tborder: none;\n\t\tborder-top: solid 1px var(--border-color);\n\t}\n\n\t:host(.noBorder[vertical]) #panels {\n\t\tborder: none;\n\t\tborder-inline-start: solid 1px var(--border-color);\n\t}\n`)
customElements.define("c-tabs",Tabs)
export class Tab extends Button{constructor(){super(...arguments)
this._movable=null
this._showableOnDragOver=null
this._shown=false}get code(){return VIEWS.getCode(this.view||this)}get label(){return VIEWS.getLabel(this.view||this)}get description(){return VIEWS.getDescription(this.view||this)}get icon(){return VIEWS.getIcon(this.view||this)}get disabled(){if(this._forcedDisabled!==undefined)return this._forcedDisabled
const view=this.view||this
return isAreaPointer(view)?!view.area.isEnabled(view.areaContext):false}set disabled(v){this._forcedDisabled=v
this.refresh()}get hidden(){if(this._forcedHidden!==undefined)return this._forcedHidden
const view=this.view||this
return isAreaPointer(view)?!view.area.isVisible(view.areaContext):false}set hidden(v){this._forcedHidden=v
this.refresh()}get areaContext(){return this.parentViewCtn.areasContext}get selected(){return this._shown}get movable(){return this._movable!=null}set movable(val){if(val){this._movable=this._moveStart.bind(this)
this.draggable=true
this.addEventListener("dragstart",this._movable)}else{this.removeEventListener("dragstart",this._movable)
this._movable=null}}get showOnDragOver(){return this._showableOnDragOver!=null}set showOnDragOver(val){if(val){this._showableOnDragOver=this._showOnDragOver.bind(this)
this.addEventListener("dragover",this._showableOnDragOver)}else{this.removeEventListener("dragover",this._showableOnDragOver)
this._showableOnDragOver=null}}visitViews(visitor,options){if(this.view)return visitor(this.view)}visitViewsAsync(visitor,options){return this.view?visitor(this.view):Promise.resolve(undefined)}needAsync(){return this.area?this.area.needAsync(this.areaContext):false}async show(lastDatas){if(this._shown)return
this._shown=true
this._refresh()
if(!this.view){if(this.needAsync()){this.view=await this.area.loadBody(this.areaContext,lastDatas)}else{this.view=this.area.buildBody(this.areaContext,lastDatas)}if(this.view){VIEWS.setArea(this.view,this)
if(this.view instanceof BaseElementAsync)await this.view.initializedAsync
this.parentViewCtn.appendChild(this.view)}this._refresh()}if(this._shown)VIEWS.onViewShown(this.view)}async hide(willSelect){if(!this._shown)return true
if(!await VIEWS.canHideView(this.view))return false
this._shown=false
this._refresh()
VIEWS.onViewHidden(this.view)
return true}async rebuildView(){const v=this.view
if(v){if(await VIEWS.canHideViewSilently(v,true))return false
if(v!==this.view)return false
const newView=await this.area.loadBody(this.areaContext)
if(v!==this.view)return false
this.view.replaceWith(newView)
this.view=newView}return true}async closeTabView(silently){if(this.view){if(!await(silently?VIEWS.canHideViewSilently(this.view,true):VIEWS.canHideView(this.view,true,()=>{this.parentViewCtn.selectTab(this)})))return false
VIEWS.onViewHidden(this.view,true)
if(this.view){this.view.remove()
this.view=null}}return true}_initialize(init){this.parentViewCtn=init.parentViewCtn
this.view=init.view
this.area=init.area
init.role="tab"
init.uiContext="custom"
super._initialize(init)}_refresh(){DOM.setHidden(this,this.hidden)
DOM.setAttrBool(this,"disabled",this.disabled)
super._refresh()
if(this._shown){this.tabIndex=0
DOM.addClass(this,"selected")}else{this.tabIndex=!this.parentViewCtn.selectedTab?0:-1
DOM.removeClass(this,"selected")}if(this.description||this.parentViewCtn.vertical)DOM.setAttr(this,"title",this.description||this.label)
if(this.view)DOM.setHidden(this.view,!this._shown)}_moveStart(ev){if(ev.button==0&&(this.previousElementSibling||this.nextElementSibling)){this.style.position="relative"
const vertical=this.parentViewCtn.vertical
const rects=new Map
for(const childTab of this.parentElement.children){childTab.style.position="relative"
childTab.style.left="0"
rects.set(childTab,GFX.getLogicalRect(childTab.getBoundingClientRect(),false,vertical))}const parentStyle=getComputedStyle(this.parentElement)
const flexReverse=parentStyle.flexDirection=="column-reverse"||parentStyle.flexDirection=="row-reverse"
const reverse=Math.abs(parentStyle.direction=="rtl"?-1:0)+(flexReverse?1:0)==1
const move=this._move.bind(this)
const moveEnd=this._moveEnd.bind(this)
this._moveData={clientAxis:vertical?ev.clientY:ev.clientX,vertical:vertical,childRects:rects,parentRect:GFX.getLogicalRect(this.offsetParent.getBoundingClientRect(),false,vertical),reverse:reverse,move:move,moveEnd:moveEnd}
if(ev.dataTransfer.effectAllowed==="uninitialized"){ev.dataTransfer.effectAllowed="all"
ev.dataTransfer.setDragImage(JSX.createElement("span",null),0,0)}window.addEventListener("dragover",move)
this.addEventListener("dragend",moveEnd)}}_move(ev){if(!this._moveData)return
const{clientAxis:startClientAxis,vertical:vertical,childRects:childRects,parentRect:parentRect}=this._moveData
const startRect=childRects.get(this)
const side=vertical?"top":"left"
const clientAxis=vertical?ev.clientY:ev.clientX
const clientInverseAxis=vertical?ev.clientX:ev.clientY
if(clientInverseAxis<parentRect.blockStart||clientInverseAxis>parentRect.blockEnd)return
const minDelta=parentRect.inlineStart-startRect.inlineStart
const maxDelta=parentRect.inlineEnd-startRect.inlineEnd
const delta=Math.min(Math.max(clientAxis-startClientAxis,minDelta),maxDelta)
if(!this.classList.contains("moved")){if(delta){this.classList.add("moved")}else return}this.style.setProperty(side,`${delta}px`)
const inlineStart=startRect.inlineStart+delta
const inlineEnd=startRect.inlineEnd+delta
for(const childTab of this.parentElement.children){if(childTab!=this){const childRect=childRects.get(childTab)
const childCenter=childRect.inlineStart+childRect.inlineSize/2
if(childRect.inlineStart<startRect.inlineStart){childTab.style.setProperty(side,inlineStart<=childCenter?`${startRect.inlineSize}px`:"0")}else{childTab.style.setProperty(side,inlineEnd>=childCenter?`-${startRect.inlineSize}px`:"0")}}}}_moveEnd(ev){const movedDatas=this._moveData
if(!movedDatas)return
this._moveData=null
window.removeEventListener("dragover",movedDatas.move)
this.removeEventListener("dragend",movedDatas.moveEnd)
if(!this.classList.contains("moved"))return
ev.preventDefault()
const{vertical:vertical,childRects:childRects,reverse:reverse,parentRect:parentRect}=movedDatas
const side=vertical?"top":"left"
const startRect=childRects.get(this)
const rect=GFX.getLogicalRect(this.getBoundingClientRect(),false,vertical)
for(const childTab of this.parentElement.children){childTab.style.setProperty(side,"")
childTab.style.position=""}const clientInverseAxis=vertical?ev.clientX:ev.clientY
if(clientInverseAxis<parentRect.blockStart||clientInverseAxis>parentRect.blockEnd)return
const children=Array.from(this.parentElement.children)
if(reverse)children.reverse()
const index=children.indexOf(this)
if(rect.inlineStart<startRect.inlineStart){const preceding=children.slice(0,index)
for(const childTab of preceding){const childRect=childRects.get(childTab)
const childCenter=childRect.inlineStart+childRect.inlineSize/2
if(rect.inlineStart<=childCenter){this.parentNode.insertBefore(this,reverse?childTab.nextElementSibling:childTab)
break}}}else{const following=children.slice(index+1).reverse()
for(const childTab of following){const childRect=childRects.get(childTab)
const childCenter=childRect.inlineStart+childRect.inlineSize/2
if(rect.inlineEnd>=childCenter){this.parentNode.insertBefore(this,reverse?childTab:childTab.nextElementSibling)
break}}}for(const childTab of this.parentElement.children){childTab.style.transition=""}DOM.removeClass(this,"moved")}async _showOnDragOver(ev){if(this._shown)return
const cancel=()=>{this.classList.remove("willBeShown")
this._showOnDragOverData=null}
const now=Date.now()
if(!this._showOnDragOverData||Math.abs(ev.clientX-this._showOnDragOverData.x)>1||Math.abs(ev.clientY-this._showOnDragOverData.y)>1){cancel()
this._showOnDragOverData={x:ev.clientX,y:ev.clientY,start:now}}else if(now-this._showOnDragOverData.start>1e3){cancel()
await this.parentViewCtn.selectTab(this)}else if(now-this._showOnDragOverData.start>700){this.classList.add("willBeShown")}}}customElements.define("c-tab",Tab)

//# sourceMappingURL=tabs.js.map