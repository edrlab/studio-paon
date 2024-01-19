import{BaseElement,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{Tab,Tabs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tabs.js"
import{LASTDATAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lastDatas.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{DOM,JSX,ShadowJsx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{Resizer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/resizer.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{ContextMenuDeskFeat}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/appFrame.js"
export class Workbench extends BaseElement{get tools(){return this.shadowRoot.querySelectorAll("c-wb-tools")}getAreaTools(){const r=[]
for(const tool of this.tools)r.push(...tool.areas)
return r}showAreaTool(areaId){for(const tool of this.tools){const tab=tool.getTabByCode(areaId)
if(tab)return tool.selectTab(tab)}}toggleAreaTool(areaId){for(const tool of this.tools){const tab=tool.getTabByCode(areaId)
if(tab)return tab.selected?tool.unselectTab():tool.selectTab(tab)}}getTab(areaId){for(const tool of this.tools){const tab=tool.getTabByCode(areaId)
if(tab)return tab}return null}_initialize(init){const reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
reg.installSkin("webzone:panel",sr)
this._initAndInstallSkin(this.localName,init)
const areasContext=init.ctx?init.ctx:this
const tbPrefix=init.toolbarsPrefix
const lastDatas=init.lastDatas
const ltT=reg.getList(tbPrefix+"lt")||[]
const lbT=reg.getList(tbPrefix+"lb")||[]
const blT=reg.getList(tbPrefix+"bl")||[]
const brT=reg.getList(tbPrefix+"br")||[]
const rtT=reg.getList(tbPrefix+"rt")||[]
const rbT=reg.getList(tbPrefix+"rb")||[]
const all=[ltT,lbT,blT,brT,rtT,rbT]
for(let k=0,s=all.length;k<s;k++){const l=all[k]
for(let i=l.length-1;i>=0;i--){const a=l[i]
if(a){const pos=reg.getUserData(tbPrefix+a.getId())
if(pos&&pos!==allPos[k]){switch(pos){case"lt":ltT.push(a)
break
case"lb":lbT.push(a)
break
case"bl":blT.push(a)
break
case"br":brT.push(a)
break
case"rt":rtT.push(a)
break
case"rb":rbT.push(a)
break
default:continue}l.splice(i,1)}}}}if(lastDatas){function removeAndGet(area,layout){for(const l of all){for(let i=l.length-1;i>=0;i--){const a=l[i]
if((a===null||a===void 0?void 0:a.getId())===area&&a.forbidInLayout!==layout){l.splice(i,1)
return a}}}return null}function moveTo(areas,target,layout){if(!areas)return
for(const aId of areas){const a=removeAndGet(aId,layout)
if(a)target.push(a)}}moveTo(lastDatas.ltT,ltT,"v")
moveTo(lastDatas.lbT,lbT,"v")
moveTo(lastDatas.rtT,rtT,"v")
moveTo(lastDatas.rbT,rbT,"v")
moveTo(lastDatas.blT,blT,"h")
moveTo(lastDatas.brT,brT,"h")}sr.appendChild(JSX.createElement("div",{id:"mid","c-resizable":""},JSX.createElement("div",{id:"flapL","c-resizable":""},JSX.createElement("did",{id:"pansLT",class:"pans","c-resizable":""},JSX.createElement("div",{id:"tabsLT",class:"tabs"},JSX.createElement("button",{id:"closeLT",title:"Refermer ce volet",onclick:this.onClosePan})),JSX.createElement(WbTools,{"î":Object.assign({orient:"lt",areas:ltT,areasContext:areasContext,lastDatas:lastDatas,workbench:this},init.lt)})),JSX.createElement(Resizer,{class:"pansSep","c-orient":"column"}),JSX.createElement("did",{id:"pansLB",class:"pans","c-resizable":""},JSX.createElement("div",{id:"tabsLB",class:"tabs"},JSX.createElement("button",{id:"closeLB",title:"Refermer ce volet",onclick:this.onClosePan})),JSX.createElement(WbTools,{"î":Object.assign({orient:"lb",areas:lbT,areasContext:areasContext,lastDatas:lastDatas,workbench:this},init.lb)})),JSX.createElement("div",{id:"bTabsL",class:"bTabs"})),JSX.createElement(Resizer,{"c-orient":"row"}),JSX.createElement("div",{id:"main","c-resizable":""},JSX.createElement("slot",null)),JSX.createElement(Resizer,{"c-orient":"row"}),JSX.createElement("div",{id:"flapR","c-resizable":""},JSX.createElement("did",{id:"pansRT",class:"pans pansH","c-resizable":""},JSX.createElement("div",{id:"tabsRT",class:"tabs"},JSX.createElement("button",{id:"closeRT",title:"Refermer ce volet",onclick:this.onClosePan})),JSX.createElement(WbTools,{"î":Object.assign({orient:"rt",areas:rtT,areasContext:areasContext,lastDatas:lastDatas,workbench:this},init.rt)})),JSX.createElement(Resizer,{class:"pansSep","c-orient":"column"}),JSX.createElement("did",{id:"pansRB",class:"pans pansH","c-resizable":""},JSX.createElement("div",{id:"tabsRB",class:"tabs"},JSX.createElement("button",{id:"closeRB",title:"Refermer ce volet",onclick:this.onClosePan})),JSX.createElement(WbTools,{"î":Object.assign({orient:"rb",areas:rbT,areasContext:areasContext,lastDatas:lastDatas,workbench:this},init.rb)})),JSX.createElement("div",{id:"bTabsR",class:"bTabs"}))))
sr.appendChild(JSX.createElement(Resizer,{class:"sep","c-orient":"column"}))
sr.appendChild(JSX.createElement("div",{id:"flapB","c-resizable":""},JSX.createElement("div",{id:"pansBL",class:"pans","c-resizable":""},JSX.createElement("div",{id:"tabsBL",class:"tabs"},JSX.createElement("button",{id:"closeBL",title:"Refermer ce volet",onclick:this.onClosePan})),JSX.createElement(WbTools,{"î":Object.assign({orient:"bl",areas:blT,areasContext:areasContext,lastDatas:lastDatas,workbench:this},init.bl)})),JSX.createElement(Resizer,{class:"pansSep","c-orient":"row"}),JSX.createElement("div",{id:"pansBR",class:"pans","c-resizable":""},JSX.createElement("div",{id:"tabsBR",class:"tabs"},JSX.createElement("button",{id:"closeBR",title:"Refermer ce volet",onclick:this.onClosePan})),JSX.createElement(WbTools,{"î":Object.assign({orient:"br",areas:brT,areasContext:areasContext,lastDatas:lastDatas,workbench:this},init.br)}))))
if(init.lastDatasKey)this.setAttribute("last-datas",init.lastDatasKey)
if(lastDatas){if(lastDatas.mw>0)sr.getElementById("main").style.flexBasis=lastDatas.mw+"px"
if(lastDatas.mh>0)sr.getElementById("mid").style.flexBasis=lastDatas.mh+"px"
if(lastDatas.lw>0)sr.getElementById("flapL").style.flexBasis=lastDatas.lw+"px"
if(lastDatas.rw>0)sr.getElementById("flapR").style.flexBasis=lastDatas.rw+"px"
if(lastDatas.bh>0)sr.getElementById("flapB").style.flexBasis=lastDatas.bh+"px"
if(lastDatas.lth)sr.getElementById("pansLT").style.flexBasis=lastDatas.lth
if(lastDatas.lbh)sr.getElementById("pansLB").style.flexBasis=lastDatas.lbh
if(lastDatas.blw)sr.getElementById("pansBL").style.flexBasis=lastDatas.blw
if(lastDatas.brw)sr.getElementById("pansBR").style.flexBasis=lastDatas.brw
if(lastDatas.rth)sr.getElementById("pansRT").style.flexBasis=lastDatas.rth
if(lastDatas.rbh)sr.getElementById("pansRB").style.flexBasis=lastDatas.rbh}for(const tools of this.tools)tools.injectTabs()
for(const tools of this.tools)tools.refreshSelectedTab()}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
init.toolbarsPrefix=this.getAttribute("toolbars-prefix")
init.lastDatas=LASTDATAS.getLastDatas(this,this.getAttribute("last-datas"))
return init}buildLastDatas(p){var _a
const k=this.getAttribute("last-datas")
if(k){const d=p[k]={}
const sr=this.shadowRoot
d.mw=sr.getElementById("main").offsetWidth
d.mh=sr.getElementById("mid").offsetHeight
d.lw=sr.getElementById("flapL").offsetWidth
d.rw=sr.getElementById("flapR").offsetWidth
d.bh=sr.getElementById("flapB").offsetHeight
d.lth=sr.getElementById("pansLT").style.flexBasis
d.lbh=sr.getElementById("pansLB").style.flexBasis
d.blw=sr.getElementById("pansBL").style.flexBasis
d.brw=sr.getElementById("pansBR").style.flexBasis
d.rth=sr.getElementById("pansRT").style.flexBasis
d.rbh=sr.getElementById("pansRB").style.flexBasis
for(const tools of this.tools){if(((_a=tools.forcedTools)===null||_a===void 0?void 0:_a.length)>0)d[tools.id+"T"]=tools.forcedTools
tools.buildLastDatas(d)}}LASTDATAS.buildLastDatas(p,this)}visitViews(visitor,options){for(const tools of this.tools){if(!options||!options.visible||!tools.closest("[hidden]")){const r=tools.visitViews(visitor,options)
if(r!==undefined)return r}}}async visitViewsAsync(visitor,options){for(const tools of this.tools){if(!options||!options.visible||!tools.closest("[hidden]")){const r=await tools.visitViewsAsync(visitor,options)
if(r!==undefined)return r}}}findTabView(codeView){for(const tools of this.tools){const tab=tools.getTabByCode(codeView)
if(tab)return tab}return null}async showView(codeView){const tab=this.findTabView(codeView)
if(tab&&await tab.parentViewCtn.selectTab(tab))return tab.view
return null}onClosePan(){this.parentElement.nextElementSibling.unselectTab()}}REG.reg.registerSkin("c-workbench",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tflex: 1;\n\t\tpadding: 5px;\n\t\tbackground-color: inherit; /*contre webzone:panel*/\n\t}\n\n\t#mid {\n\t\tflex: 5 5 60vh;\n\t\tdisplay: flex;\n\t\tmin-height: 10%;\n\t\tmin-width: 0;\n\t\toverflow: hidden;\n\t}\n\n\t#main {\n\t\tflex: 5 5 60vw;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 10%;\n\t\tflex-direction: column;\n\t\toverflow: auto;\n\t\tborder: 1px solid var(--page-border-color);\n\t\tborder-radius: 7px;\n\t}\n\n\t[hidden] {\n\t\tdisplay: none !important;\n\t}\n\n\t#flapB {\n\t\tflex: 1 1 20vh;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 5em;\n\t\tflex-direction: row;\n\t}\n\n\t#flapL,\n\t#flapR {\n\t\tflex: 1 1 20vw;\n\t\tdisplay: flex;\n\t\tmin-width: 5em;\n\t\tmin-height: 0;\n\t\tflex-direction: column;\n\t}\n\n\t#flapL.closed,\n\t#flapR.closed,\n\t#flapB.closed {\n\t\tflex: 0 0 auto;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t}\n\n\t:host(.hideFlapTabs) > * > #flapL.closed,\n\t:host(.hideFlapTabs) > * > #flapR.closed,\n\t:host(.hideFlapTabs) > #flapB.closed,\n\t:host(.hideFlapTabs) .pans[pan-state='collapsed'],\n\t:host(.hideFlapTabs) .tabs.collapsed,\n\t:host(.hideFlapTabs) .pansSep[disabled] {\n\t\tdisplay: none !important;\n\t}\n\n\t.panV {\n\t\tflex: 1 1 15vh;\n\t\tdisplay: flex;\n\t\tmin-width: 3em;\n\t\tmin-height: 0;\n\t\tflex-direction: column;\n\t}\n\n\t.panH {\n\t\tdisplay: flex;\n\t\tmin-height: 3em;\n\t\tmin-width: 0;\n\t\tflex-direction: row;\n\t}\n\n\t.pans {\n\t\tflex: 1 1 50%;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tflex-direction: column;\n\t\tborder: 1px solid var(--border-color);\n\t\tborder-radius: 7px;\n\t\toverflow: hidden;\n\t}\n\n\t.pans[pan-state='closed'],\n\t.pansH[pan-state='collapsed'] {\n\t\tflex: 1 1 50%;\n\t\tborder: none;\n\t\tbox-shadow: unset;\n\t}\n\n\t[pan-state='closed'] > .tabs,\n\t.bTabs > .tabs,\n\t.pansH[pan-state='collapsed'] > .tabs {\n\t\tborder: 1px solid var(--border-color);\n\t}\n\n\t.pans[pan-state='collapsed'] {\n\t\tflex: 0 0 auto;\n\t}\n\n\t.bTabs > .tabs {\n\t\tmargin-top: 5px;\n\t}\n\n\t#pansBL[pan-state='collapsed'],\n\t#pansBR[pan-state='collapsed'] {\n\t\talign-self: flex-end;\n\t}\n\n\t.tabs.collapsed {\n\t\tborder-radius: 7px;\n\t}\n\n\tc-wb-tools {\n\t\tflex: 1;\n\t\tborder-top: 1px solid var(--border-color);\n\t\tbackground-color: var(--bgcolor);\n\t}\n\n\tc-resizer {\n\t\tbackground-color: transparent;\n\t}\n\n\tc-resizer[c-orient=row] {\n\t\twidth: 5px;\n\t}\n\n\tc-resizer[c-orient=column] {\n\t\theight: 5px;\n\t}\n\n\t.tabs {\n\t\tbackground-color: var(--page-bgcolor);\n\t}\n\n\t#tabsLT, #tabsLB, #tabsBL {\n\t\tdisplay: flex;\n\t\tflex-direction: row;\n\t\talign-items: center;\n\t}\n\n\t#tabsRT, #tabsRB, #tabsBR {\n\t\tdisplay: flex;\n\t\tflex-direction: row-reverse;\n\t\talign-items: center;\n\t}\n\n\tc-oriented-box {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\tc-oriented-box[vertical] {\n\t\tflex: 1 1 auto;\n\t\tflex-direction: column;\n\t}\n\n\tc-wb-tooltab {\n\t\tflex: 1 1 auto;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\toverflow: hidden;\n\t\talign-items: center;\n\t\t/*justify-content: center;*/\n\t\tpadding: .2em;\n\t\tcursor: pointer;\n\t\tuser-select: none;\n\t}\n\n\t:not([vertical]) > c-wb-tooltab:not(:first-child) {\n\t\tborder-inline-start: 1px solid var(--border-color);\n\t}\n\n\t[vertical] > c-wb-tooltab:not(:first-child) {\n\t\tborder-block-start: 1px solid var(--border-color);\n\t}\n\n\t:not(.collapsed) > * > c-wb-tooltab {\n\t\tbackground: var(--item-bgcolor);\n\t}\n\n\n\tc-wb-tooltab:hover, c-wb-tooltab.willBeShown {\n\t\tbackground: var(--pressed-bgcolor);\n\t}\n\n\tc-wb-tooltab.moved {\n\t\tz-index: 1;\n\t}\n\n\tc-wb-tooltab.selected {\n\t\t/*z-index: 1;*/\n\t\tbackground: var(--page-bgcolor);\n\t\tcursor: default;\n\t}\n\n\tc-wb-tooltab:not(.moved) {\n\t\ttransition: top 0.2s linear, left 0.2s linear;\n\t}\n\n\tc-wb-tooltab:focus {\n\t\toutline: var(--focus-outline);\n\t\toutline-offset: -2px;\n\t}\n\n\tc-wb-tooltab > .icon {\n\t\theight: var(--icon-size);\n\t\twidth: var(--icon-size);\n\t\tmin-height: var(--icon-size);\n\t\tmin-width: var(--icon-size);\n\t\tbackground: var(--icon-img) no-repeat center / contain;\n\t\tfilter: var(--filter);\n\t\tmargin: 1px;\n\t}\n\n\tc-wb-tooltab > .label {\n\t\twhite-space: pre;\n\t}\n\n\t/*[pan-state="closed"] > * > * > c-wb-tooltab > .label {display: none;}*/\n\t[vertical] > c-wb-tooltab > .label {\n\t\tdisplay: none;\n\t}\n\n\tbutton {\n\t\tappearance: none;\n\t\tbackground: no-repeat center / contain;\n\t\tborder: 3px solid transparent;\n\t\talign-self: stretch;\n\t\tcursor: pointer;\n\t\tfilter: var(--filter);\n\t}\n\n\tbutton:hover {\n\t\tbackground-color: var(--pressed-bgcolor);\n\t}\n\n\tbutton:focus {\n\t\toutline: var(--focus-outline);\n\t\toutline-offset: -2px;\n\t}\n\n\t.collapsed > button {\n\t\tdisplay: none;\n\t}\n\n\t#tabsLT > button,\n\t#tabsLB > button,\n\t#tabsBL > button.sibling {\n\t\tbackground-image: url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/widgets/workbench/closeToolL.svg');\n\t\tmin-width: var(--icon-size);\n\t\tmin-height: var(--icon-size);\n\t}\n\n\t#tabsRT > button,\n\t#tabsRB > button,\n\t#tabsBR > button.sibling {\n\t\tbackground-image: url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/widgets/workbench/closeToolR.svg');\n\t\tmin-width: var(--icon-size);\n\t\tmin-height: var(--icon-size);\n\t}\n\n\t#tabsLT > button.sibling,\n\t#tabsRT > button.sibling {\n\t\tbackground-image: url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/widgets/workbench/closeToolT.svg');\n\t\tmin-width: var(--icon-size);\n\t\tmin-height: var(--icon-size);\n\t}\n\n\t#tabsBL > button,\n\t#tabsBR > button,\n\t#tabsLB > button.sibling,\n\t#tabsRB > button.sibling {\n\t\tbackground-image: url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/widgets/workbench/closeToolB.svg');\n\t\tmin-width: var(--icon-size);\n\t\tmin-height: var(--icon-size);\n\t}\n\n\t:host(.hideFlapTabs) .tabs > button {\n\t\tbackground-image: url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/widgets/workbench/closeTool.svg') !important;\n\t\tmin-width: var(--icon-size);\n\t\tmin-height: var(--icon-size);\n\t}\n`)
customElements.define("c-workbench",Workbench)
class WbTools extends Tabs{get flapClosed(){return this.classList.contains("flapClosed")}async _initialize(init){init.noArrowScroll=true
this.id=init.orient
const firstPos=this.id[0]
const secondPos=this.id[1]
this.isVerticalPan=firstPos!=="b"
this.isFirstPan=secondPos==="t"||secondPos==="l"
this.isRightPan=this.isVerticalPan?firstPos==="r":secondPos==="r"
this.classList.add(this.isVerticalPan?"panV":"panH")
if(init.lastDatas){this.forcedTools=init.lastDatas[init.orient+"T"]
init.lastDatas=init.lastDatas[init.orient]}this.setAttribute("last-datas",init.orient)
await super._initialize(init)
if(!this._areas)this._areas=[]}_initSkins(init){}injectTabs(){this.tabsBar=this.previousElementSibling
this.tabsBar.insertAdjacentElement("afterbegin",this._tabs)}_initShadowRoot(){this.shadowRoot.appendChild(this._mainSlot)}_initTabs(){var _a;(_a=this._areas)===null||_a===void 0?void 0:_a.forEach(area=>{this._newTab(area)})}async selectTab(tab,lastDatas){if(tab==null)return this.unselectTab()
const res=await super.selectTab(tab,lastDatas)
this.refreshSelectedTab()
return res}async unselectTab(){if(!this._selectedTab)return false
if(!await this._selectedTab.hide())return false
this._selectedTab=null
this.refreshSelectedTab()
return true}async closeTab(tab,silently,removeFromAreas){const ok=await super.closeTab(tab,silently,removeFromAreas)
if(ok)this.refreshSelectedTab()
return ok}async addTab(area,options){await super.addTab(area,options)
this.refreshSelectedTab()}_newTab(area,before,view){const tab=(new WbToolTab).initialize({parentViewCtn:this,area:area,view:view})
tab.onclick=function(){this.parentViewCtn.selectTab(this)}
tab.showOnDragOver=true
this._tabs.insertBefore(tab,before)
return tab}refreshSelectedTab(){if(DOM.setHidden(this.getPans(),!this.hasTabs())){DOM.setHidden(this.getPanResizer(),!this.hasTabs())}const siblingTools=this.getSiblingTools()
const flapClosed=!this._selectedTab&&!siblingTools.selectedTab
const panCollapsed=!this._selectedTab
const panSiblingCollapsed=!siblingTools.selectedTab
this.getFlapResizer().disabled=flapClosed
this.setFlapClosed(flapClosed,panCollapsed,panSiblingCollapsed)
siblingTools.setFlapClosed(flapClosed,panSiblingCollapsed,panCollapsed)
this.getFlap().classList.toggle("closed",flapClosed)
if(flapClosed)this.getFlap().style.flex=""
this.tabsBar.classList.toggle("collapsed",panCollapsed)
if(DOM.setHidden(this,panCollapsed)&&panCollapsed)this.getPans().style.flex=""
this.getPanResizer().disabled=panCollapsed||panSiblingCollapsed
if(!panCollapsed)this.getTabsCloseBtn().classList.toggle("sibling",!panSiblingCollapsed)
if(!panSiblingCollapsed)siblingTools.getTabsCloseBtn().classList.toggle("sibling",!panCollapsed)
this.refresh()
siblingTools.refresh()}setFlapClosed(closed,panCollapsed,panSiblingCollapsed){this.classList.toggle("flapClosed",closed)
if(!this.isVerticalPan){const tabs=this.tabsBar
if(closed){if(tabs.parentElement===this.parentElement)this.getTabsBarClosed().appendChild(tabs)}else{if(tabs.parentElement!==this.parentElement)this.insertAdjacentElement("beforebegin",tabs)}}if(!this.isVerticalPan){DOM.setAttrBool(this,"vertical",panCollapsed&&(this.isLateralFlapCollapsed()||!panSiblingCollapsed))}else{DOM.setAttrBool(this,"vertical",closed)
const bottomTools=this.getBottomTools()
if(DOM.setAttrBool(bottomTools,"vertical",!bottomTools.selectedTab&&(panCollapsed&&panSiblingCollapsed||!!bottomTools.getSiblingTools().selectedTab)))bottomTools.refresh()}if(closed)this.getPans().style.flex=""
DOM.setAttr(this.getPans(),"pan-state",closed?"closed":!this._selectedTab?"collapsed":"opened")}getPans(){return this.parentElement}getFlap(){return this.parentElement.parentElement}getFlapResizer(){const flap=this.getFlap()
if(flap.id==="flapL")return flap.nextElementSibling
return flap.previousElementSibling}getPanResizer(){return this.isFirstPan?this.parentElement.nextElementSibling:this.parentElement.previousElementSibling}getTabsCloseBtn(){return this.tabsBar.lastElementChild}getTabsBarClosed(){return DOMSH.findDocumentOrShadowRoot(this).getElementById(this.isRightPan?"bTabsR":"bTabsL")}getSiblingTools(){return this.isFirstPan?this.parentElement.nextElementSibling.nextElementSibling.lastElementChild:this.parentElement.previousElementSibling.previousElementSibling.lastElementChild}getBottomTools(){return DOMSH.findDocumentOrShadowRoot(this).getElementById(this.isRightPan?"br":"bl")}isLateralFlapCollapsed(){return DOMSH.findDocumentOrShadowRoot(this).getElementById(this.isRightPan?"flapR":"flapL").classList.contains("closed")}onMoveTab(tab,ev){const me=this
async function onSelPan(ev){var _a
POPUP.findPopupableParent(this).close()
const area=tab.area
const target=DOMSH.findDocumentOrShadowRoot(me).getElementById(this.id)
await me.unselectTab()
if(await me.closeTab(tab,false,true)){const idx=(_a=me.forcedTools)===null||_a===void 0?void 0:_a.indexOf(area.getId())
if(idx>=0)me.forcedTools.splice(idx,1);(target.forcedTools||(target.forcedTools=[])).push(area.getId())
await target.addTab(area,{select:true})}}function makeBtn(id,layout){return JSX.createElement("button",{id:id,onclick:onSelPan,class:me.id===id?"current":undefined,disabled:me.id===id||tab.area.forbidInLayout===layout?"":undefined,style:"grid-area:"+id})}const body=JSX.createElement("div",null,JSX.createElement(ShadowJsx,{skin:"c-wb-tools/movePopup"},makeBtn("lt","v"),makeBtn("lb","v"),JSX.createElement("div",{id:"central"},"Sélectionnez un des volets disponibles"),makeBtn("rt","v"),makeBtn("rb","v"),makeBtn("bl","h"),makeBtn("br","h")))
const isBottom=me.id.charAt(0)==="b"
POPUP.showFloating(body,{posFrom:ev.target,fromY:isBottom?"top":"bottom",targetY:isBottom?"bottom":"top",toleranceX:500},this,{closeOnBlur:true})}_onClose(ev){DOMSH.findHost(this).unselectTab()}}REG.reg.registerSkin("c-wb-tools/movePopup",1,`\n\t:host {\n\t\tdisplay: grid;\n\t\tgrid-template: \n\t\t\t"lt m  m  rt" 2fr\n\t\t\t"lb m  m  rb" 2fr\n\t\t\t"bl bl br br" 1fr / 1fr 1fr 1fr 1fr;\n\t\twidth: 12em;\n\t\theight: 12em;\n\t\tbackground-color: var(--border-color);\n\t}\n\n\t#central {\n\t\tgrid-area: m;\n\t\tdisplay: flex;\n\t\talign-items: center;\n\t\tjustify-content: center;\n\t\ttext-align: center;\n\t}\n\n\tbutton {\n\t\tbackground-color: var(--panel-bgcolor);\n\t\tborder: 1px solid var(--panel-border-color);\n\t\tcursor: pointer;\n\t}\n\n\t.current {\n\t\tbackground-color: var(--panel-row-inSel-bgcolor) !important;\n\t}\n\n\tbutton:not([disabled]):hover {\n\t\tbackground-color: var(--panel-tabf-bgcolor);\n\t}\n\n\tbutton[disabled] {\n\t\tbackground-color: #88888855;\n\t\tcursor: auto;\n\t}\n\n\tbutton[disabled]::before {\n\t\tcontent: '🛇';\n\t\tfont-size: .8rem;\n\t\tcolor: var(--panel-color);\n\t}\n\n\t.v {\n\t\tmin-width: 1em;\n\t\tmin-height: 2em;\n\t}\n\n\t.h {\n\t\tmin-width: 2em;\n\t\tmin-height: 1em;\n\t}\n`)
customElements.define("c-wb-tools",WbTools)
class WbToolTab extends Tab{constructor(){super(...arguments)
this.ctxMenuActions={actions:[new Action("openClose").setLabel(ctx=>ctx._shown?"Refermer ce volet":"Ouvrir ce volet").setExecute((ctx,ev)=>{if(ctx._shown)ctx.parentViewCtn.unselectTab()
else ctx.parentViewCtn.selectTab(ctx)}),new Action("move").setLabel("Déplacer ce volet...").setExecute((ctx,ev)=>{ctx.parentViewCtn.onMoveTab(ctx,ev)})],actionContext:this}}_initialize(init){this.parentViewCtn=init.parentViewCtn
this.view=init.view
this.area=init.area
this.setAttribute("role","button")
BASIS.makeClickable(this)
this._createIcon()
this.ondblclick=ev=>{if(ContextMenuDeskFeat.isIn(desk))desk.showContextMenu.call(document.body,ev)}}async show(lastDatas){const layout=this.parentViewCtn.isVerticalPan?"v":"h"
if(this.area.layout!==layout){const unlocated=this.area.unlocatedArea||this.area
const located=Object.create(unlocated)
located.layout=layout
located.unlocatedArea=unlocated
this.area=located}await super.show(lastDatas)}_refresh(){super._refresh()
DOM.setAttr(this._iconElt,"title",VIEWS.getDescription(this.view||this)||VIEWS.getLabel(this.view||this))}}customElements.define("c-wb-tooltab",WbToolTab)
const allPos=["lt","lb","bl","br","rt","rb"]

//# sourceMappingURL=workbench.js.map