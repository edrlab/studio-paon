import{BaseElementAsync,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{BaseAreaViewAsync,VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{LASTDATAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lastDatas.js"
import{Resizer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/resizer.js"
export class BlocksCollapsable extends BaseElementAsync{get areasContext(){return this._areasContext}set areasContext(val){this._areasContext=val
this.refresh()}get areas(){return this._areas}async openBlock(block,lastDatas){await block.show(lastDatas)
return true}get selectedBlocks(){let collapsableBlockAreas=Array.from(this._blocksCtn.childNodes).filter(node=>IS_CollapsableBlockArea(node)&&node.opened)
return collapsableBlockAreas}async addArea(area,options,initBlock){if(this._areas)this._areas.push(area)
else this._areas=[area]
let before=null
if(options&&typeof options.position==="number"){let collapsableBlockAreas=Array.from(this._blocksCtn.childNodes).filter(node=>IS_CollapsableBlockArea(node)&&node.opened)
before=collapsableBlockAreas[options.position-1]
let p=options.position
while(before&&p-- >0)before=before.nextElementSibling}const block=this._newBlock(area,before,initBlock)
if(options&&options.open||this._params&&this._params.lastDatas&&this._params.lastDatas.open&&this._params.lastDatas.open.includes(area.getId()))await this.openBlock(block)
this._refreshUi()}async closeBlock(block,silently,removeFromAreas){if(!await block.closeBlockView(silently))return false
if(removeFromAreas&&block.area&&this._areas){const idx=this._areas.indexOf(block.area)
if(idx>=0)this._areas.splice(idx,1)}block.remove()
return true}getBlockByCode(code){if(code!=null)for(let block=this._blocksCtn.firstElementChild;block;block=block.nextElementSibling)if(block.code===code)return block
return null}hasBlocks(){return this._blocksCtn.firstElementChild!=null}visitViews(visitor,options){if(options&&options.visible){let selectedBlocks=this.selectedBlocks
if(selectedBlocks)for(const block of selectedBlocks){const r=block.visitViews(visitor,options)
if(r!==undefined)return r}}else{let collapsableBlockAreas=Array.from(this._blocksCtn.childNodes).filter(node=>IS_CollapsableBlockArea(node)&&node.opened)
for(const block of collapsableBlockAreas){const r=block.visitViews(visitor,options)
if(r!==undefined)return r}}}async visitViewsAsync(visitor,options){if(options&&options.visible){let selectedBlocks=this.selectedBlocks
if(selectedBlocks)for(const block of selectedBlocks){const r=await block.visitViewsAsync(visitor,options)
if(r!==undefined)return r}}else{let collapsableBlockAreas=Array.from(this._blocksCtn.childNodes).filter(node=>IS_CollapsableBlockArea(node)&&node.opened)
for(const block of collapsableBlockAreas){const r=await block.visitViewsAsync(visitor,options)
if(r!==undefined)return r}}}async _initialize(init){this._params=init
this._areas=init.areas
this._areasContext=init.areasContext
if(init.lastDatasKey)this.setAttribute("last-datas",init.lastDatasKey)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.findReg(init).installSkin("c-blocks-collapsable/base",sr)
this._initAndInstallSkin(this.localName,init)
this._blocksCtn=JSX.createElement("div",{id:"blocksCtn"})
this._mainSlot=JSX.createElement("slot",null)
this._initShadowRoot()
this._initBlocks()
if(init.lastDatas&&init.lastDatas.open!==undefined){if(init.lastDatas.open!==null){Promise.all(init.lastDatas.open.map(async code=>{const t=this.getBlockByCode(code)
if(t){await this.openBlock(t,init.lastDatas)}}))}}else if(init.openBlocks!=null){Promise.all(init.openBlocks.map(async code=>{const t=this.getBlockByCode(code)
if(t){await this.openBlock(t,init.lastDatas)}}))}this._refreshUi()}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
const areas=BASIS.extractAttr(this,"areas-list")
if(areas)init.areas=this.findReg(init).mergeLists(...areas.split(" "))
const areaCtx=BASIS.extractAttr(this,"areas-context")
if(areas&&areaCtx==null){init.areasContext=this}else if(areaCtx){init.areasContext=this.findReg(init).getSvc(areaCtx)}init.lastDatas=LASTDATAS.getLastDatas(this,this.getAttribute("last-datas"))
return init}_initShadowRoot(){const sr=this.shadowRoot
sr.appendChild(this._blocksCtn)}_initBlocks(){for(const view of this._mainSlot.assignedNodes()){if(view instanceof CollapsableBlockArea){this._initBlock(view)
this._blocksCtn.appendChild(view)}else if(view instanceof HTMLElement){const block=(new CollapsableBlockArea).initialize({parentBlockCtn:this,view:view})
this._initBlock(block)
this.appendChild(JSX.createElement("c-resizer",{"c-orient":"column"}))
this._blocksCtn.appendChild(block)}}if(this._areas)this._areas.forEach(area=>{this._newBlock(area)})}_refreshUi(){this._blocksCtn.childNodes.forEach(node=>{if(node instanceof Resizer){let prev=node.previousElementSibling
let next=node.nextElementSibling
DOM.setAttrBool(node,"disabled",prev&&next&&prev.hasAttribute("c-resizable")&&next.hasAttribute("c-resizable")?false:true)}})}_newBlock(area,before,initBlock){const block=(new CollapsableBlockArea).initialize(Object.assign({parentBlockCtn:this,area:area,areaContext:this.areasContext},initBlock))
this._initBlock(block)
this._blocksCtn.insertBefore(block,before)
this._blocksCtn.insertBefore(JSX.createElement("c-resizer",{"c-orient":"column"}),block)
return block}_initBlock(block){}_onChangeBlockState(block){this._refreshUi()}buildLastDatas(p){const k=this.getAttribute("last-datas")
if(k){const d=p[k]={}
const blocks=this.selectedBlocks
if(blocks){d.open=[]
blocks.forEach(block=>{if(block.opened)d.open.push(block.code)
LASTDATAS.buildLastDatas(d,block.view,true)})}}}_refresh(){let collapsableBlockAreas=Array.from(this._blocksCtn.childNodes).filter(node=>IS_CollapsableBlockArea(node)&&node.opened)
collapsableBlockAreas.map(entry=>entry.refresh())}}customElements.define("c-blocks-collapsable",BlocksCollapsable)
REG.reg.registerSkin("c-blocks-collapsable/base",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t  min-width: 0;\n\t  flex-direction: column;\n  }\n\n  c-arrow-scroll-box {\n\t  display: flex;\n\t  min-height: 0;\n\t  min-width: 0;\n\t  flex: 1;\n  }\n\n  #blocksCtn {\n\t  display: contents;\n  }\n\n  c-blocks-collapsable-block {\n\t  min-height: var(--blocks-collapsable-header-height, 2rem);\n  }\n\n  c-blocks-collapsable-block[aria-selected] {\n\t  min-height: calc(var(--blocks-collapsable-header-height, 2rem) + 5rem);\n\t}\n\n\tc-blocks-collapsable-block ~ c-blocks-collapsable-block {\n\t\tborder-block-start: 4px solid transparent;\n\t}\n\n`)
function IS_CollapsableBlockArea(n){return n instanceof CollapsableBlockArea}export class CollapsableBlockArea extends BaseAreaViewAsync{get code(){return VIEWS.getCode(this.view||this)}get label(){return VIEWS.getLabel(this.view||this)}get description(){return VIEWS.getDescription(this.view||this)}get icon(){return VIEWS.getIcon(this.view||this)}get disabled(){return!VIEWS.isEnabled(this.view||this)}get hidden(){return!VIEWS.isVisible(this.view||this)}get opened(){return this.hasAttribute("aria-selected")}get locked(){return this.hasAttribute("data-locked")}async _initialize(init){this.view=init.view
this.area=init.area
this.areaContext=init.areaContext
this.parentBlockCtn=init.parentBlockCtn?init.parentBlockCtn:this.parentNode
if(init.locked)DOM.setAttrBool(this,"data-locked",true)
this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
const sr=this.shadowRoot
this.initHeaderNode(sr.appendChild(JSX.createElement("div",{class:"header",ondblclick:this.onToggle},JSX.createElement("button",{class:"toggle",onclick:this.onToggle},JSX.createElement("span",{class:"headTi"},this.label)))))
this.initContentNode(sr.appendChild(JSX.createElement("div",{class:"content"},JSX.createElement("slot",null))))
if(init.locked)await this.show()}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
return init}_refreshUi(){if(this.description)DOM.setAttr(this,"title",this.description||this.label)
DOM.setHidden(this,this.hidden)
DOM.setAttrBool(this,"disabled",this.disabled)}visitViews(visitor,options){if(this.view)return visitor(this.view)}visitViewsAsync(visitor,options){return this.view?visitor(this.view):Promise.resolve(undefined)}needAsync(){return this.area?this.area.needAsync(this.areaContext):false}async closeBlockView(silently){if(this.view){if(!await(silently?VIEWS.canHideViewSilently(this.view,true):VIEWS.canHideView(this.view,true,()=>{this.parentBlockCtn.openBlock(this)})))return false
VIEWS.onViewHidden(this.view,true)
if(this.view){this.view.remove()
this.view=null}}return true}async show(lastDatas){if(this.opened)return
DOM.setAttrBool(this,"aria-selected",true)
DOM.setAttrBool(this,"c-resizable",true)
this.parentBlockCtn._onChangeBlockState(this)
this._refreshUi()
if(!this.view){if(this.needAsync()){this.view=await this.area.loadBody(this.areaContext,lastDatas)}else{this.view=this.area.buildBody(this.areaContext,lastDatas)}if(this.view){VIEWS.setArea(this.view,this)
if(this.view instanceof BaseElementAsync)await this.view.initializedAsync
this.appendChild(this.view)}this._refreshUi()}if(this.opened)VIEWS.onViewShown(this.view)}async hide(){if(!this.opened)return true
if(!await VIEWS.canHideView(this.view))return false
DOM.setAttrBool(this,"aria-selected",false)
DOM.setAttrBool(this,"c-resizable",false)
this.parentBlockCtn._onChangeBlockState(this)
this.removeAttribute("style")
this._refreshUi()
VIEWS.onViewHidden(this.view)
return true}initHeaderNode(node){return node}initContentNode(node){return node}onToggle(ev){const me=DOMSH.findHost(this)
if(me.locked)return
if(me.opened)me.hide()
else me.show()}}customElements.define("c-blocks-collapsable-block",CollapsableBlockArea)
REG.reg.registerSkin("c-blocks-collapsable-block",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\t:host([hidden]) {\n\t\tdisplay: none;\n\t}\n\n  :host([disabled]){\n\t\topacity: .6;\n\t  pointer-events: none;\n  }\n\n  :host([aria-selected]) {\n\t  flex: 1;\n  }\n\n  .header {\n\t  background-color: var(--tabf-bgcolor);\n\t  color: var(--tabf-color);\n\t  --pressed-bgcolor: var(--inv-pressed-bgcolor);\n\t  font-weight: bold;\n\t  line-height: var(--blocks-collapsable-header-height, 2rem);\n  }\n\n  .toggle {\n\t  background: none;\n\t  border: none;\n\t  color: var(--tabf-color);\n\t  user-select: none;\n\t  cursor: pointer;\n\t  font-size: inherit;\n\t}\n\n\t:host([data-locked]) .toggle {\n\t  pointer-events: none;\n  }\n\n  :host([data-locked]) .toggle::before {\n\t  visibility: hidden;\n  }\n\n  .toggle::before {\n\t  content: "▼ ";\n  }\n\n  :host(:not([aria-selected])) .toggle::before {\n\t  content: "▶ ";\n  }\n\n  .content {\n\t  flex: 1;\n\t  display: flex;\n\t  min-height: 0;\n\t  min-width: 0;\n\t  /*border-inline-start: 2px solid var(--tabf-bgcolor);*/\n  }\n\n  :host(:not([aria-selected])) .content {\n\t  display: none;\n  }\n\n`)

//# sourceMappingURL=blocks.js.map