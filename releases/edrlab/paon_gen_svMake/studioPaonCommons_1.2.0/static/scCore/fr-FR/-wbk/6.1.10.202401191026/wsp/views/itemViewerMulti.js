import{POPUP,PopupTooltip}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemMain.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{InfoCurrentItem,InfoFocusItem,InfoFocusNodeInItem,InfoReqCurrentItem,InfoSrcUriMoved,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{EWspChangesEvts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{LASTDATAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lastDatas.js"
import{Tab,Tabs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tabs.js"
import{SrcMain}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemMain.js"
import{ActionBtn,Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{ACTION,Action,ActionSeparator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{BaseElementAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{OpenFastFindItem,OpenSearchItems}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{Resizer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/resizer.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/zones/webZones.js"
import{renderAppend}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/htmlLit.js"
import{SRCDRAWER,SrcDrawer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcDrawer.js"
export class ItemViewerMulti{constructor(){this.itemTypesRegs=new Map}async initViewer(reg,mainViewParent,lastDatas,select){if(this.reg)console.error("ItemViewerMulti already inited")
this.reg=reg
const infoBroker=reg.env.infoBroker
if(infoBroker)infoBroker.addConsumer(this)
if(lastDatas){const mainLD=lastDatas.main
if(mainLD&&mainLD.tabs){this._initUi(mainViewParent,await this._buildAreas(mainLD,select,mainViewParent),mainLD)}else if(select){this._initUi(mainViewParent,await this._buildAreas(null,select,mainViewParent))}else{this._initUi(mainViewParent)}const leftLD=lastDatas.left
if(leftLD&&leftLD.tabs){this._initLeftTabs(await this._buildAreas(leftLD,null,mainViewParent),leftLD)}const rightLD=lastDatas.right
if(rightLD&&rightLD.tabs){this._initRightTabs(await this._buildAreas(rightLD,null,mainViewParent),rightLD)}}else if(select){this._initUi(mainViewParent,await this._buildAreas(null,select,mainViewParent))}else{this._initUi(mainViewParent)}}_initUi(mainViewParent,mainAreas,mainLD){const root=mainViewParent.appendChild(JSX.createElement("wsp-itemviewer-multi",null)).attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("webzone:item",root)
this.reg.installSkin("wsp-itemviewer-multi",root)
this.mainTabs=root.appendChild((new SrcTabs).initialize({reg:this.reg,areasContext:this,areas:mainAreas,lastDatasKey:"main",lastDatas:mainLD,backgroundPanels:this.reg.getSvc("ItemViewerMulti.backgroundPanels")}))
this.onWspUriChange=this._onWspUriChange.bind(this)
this.reg.env.place.eventsMgr.on("wspUriChange",this.onWspUriChange)}_initLeftTabs(leftAreas,leftLD){if(this.leftTabs)return
const mainTabs=this.mainTabs
this.leftTabs=mainTabs.parentNode.insertBefore((new SrcTabs).initialize({reg:this.reg,areasContext:this,areas:leftAreas,lastDatasKey:"left",lastDatas:leftLD}),mainTabs)
mainTabs.parentNode.insertBefore(JSX.createElement(Resizer,{"c-orient":"row"}),mainTabs)
if(!this.leftTabs._tabs.firstElementChild)this.hideTabs(this.leftTabs)}_initRightTabs(rightAreas,rightLD){if(this.rightTabs)return
const mainTabs=this.mainTabs
mainTabs.parentNode.appendChild(JSX.createElement(Resizer,{"c-orient":"row"}))
this.rightTabs=mainTabs.parentNode.appendChild((new SrcTabs).initialize({reg:this.reg,areasContext:this,areas:rightAreas,lastDatasKey:"right",lastDatas:rightLD}))
if(!this.rightTabs._tabs.firstElementChild)this.hideTabs(this.rightTabs)}async _buildAreas(ldTabs,select,uiCtx){let srcRefs
if(select){if(ldTabs){ldTabs.tab=select
let selectFound
srcRefs=ldTabs.tabs.map(t=>{if(select===t.srcRef)selectFound=true
return t.srcRef})
if(!selectFound){srcRefs.push(select)
ldTabs.tabs.push({srcRef:select})}}else{ldTabs={tabs:[{srcRef:select}]}
srcRefs=[select]}}else{srcRefs=ldTabs.tabs.map(t=>t.srcRef).filter(srcRef=>!SRC.isNewSrcUri(srcRef))}const srcs=await WSP.fetchShortDescs(this.reg.env.wsp,uiCtx,...srcRefs)
const results=[]
let k=0
for(let i=0,s=ldTabs.tabs.length;i<s;i++){const ldTab=ldTabs.tabs[i]
const sd=SRC.isNewSrcUri(ldTab.srcRef)?{srcUri:ldTab.srcRef,itModel:SRC.extractItModelFromNewSrcUri(ldTab.srcRef),srcSt:1}:srcs[k++]
if(sd.srcSt>0&&sd.itModel!=null){results.push(new SrcArea(this,sd,null,ldTab).setPinned(ldTab.pin).setShowTime(i))}}return results}openSrcRef(srcRef,silent,lastDatas){return this.openSrcRefInSrcTabs(this.mainTabs,srcRef,silent,lastDatas)}onInfo(info){if(info instanceof InfoFocusItem){if(info instanceof InfoFocusNodeInItem){this.focusNodeInItem(info)}else{this.focusItem(info)}info.handled=true}else if(info instanceof InfoReqCurrentItem){if(this.mainTabs){const tab=this.mainTabs.selectedTab
if(tab&&tab.view instanceof SrcMain){const longDesc=tab.view.reg.env.longDesc
if(longDesc){info.srcUri=longDesc.srcUri
info.shortDesc=longDesc}}}}else if(info instanceof InfoSrcUriMoved){this.onSrcMoved(info)}}focusItem(info){this.openSrcRef(info.srcRef,false,info.lastDatas)}async focusNodeInItem(info){if(this.isSrcRefShown(this.mainTabs,info.srcRef))return
if(await this.openSrcRef(info.srcRef)){const tab=this.mainTabs.selectedTab
if(tab.view instanceof BaseElementAsync)await tab.view.initializedAsync
this.reg.env.infoBroker.dispatchInfo(new InfoFocusNodeInItem(info.xpath,info.srcRef),this)}}async onSrcMoved(info){var _a,_b,_c,_d
const tab=!this.mainTabs.getTabBySrcRef(info.newSrcUri)?this.mainTabs.getTabBySrcRef(info.oldSrcUri):null
const tabLeft=!((_a=this.leftTabs)===null||_a===void 0?void 0:_a.getTabBySrcRef(info.newSrcUri))?(_b=this.leftTabs)===null||_b===void 0?void 0:_b.getTabBySrcRef(info.oldSrcUri):null
const tabRight=!((_c=this.leftTabs)===null||_c===void 0?void 0:_c.getTabBySrcRef(info.newSrcUri))?(_d=this.rightTabs)===null||_d===void 0?void 0:_d.getTabBySrcRef(info.oldSrcUri):null
if(tab||tabLeft||tabRight){const wsp=this.reg.env.wsp
const longDesc=await wsp.fetchLongDesc(info.newSrcUri)
if(longDesc.srcSt<0||longDesc.itModel==null){return false}if(tab&&tab.isConnected)await this.mainTabs.replaceTab(tab,new SrcArea(this,longDesc,longDesc))
if(tabLeft&&tabLeft.isConnected)await this.leftTabs.replaceTab(tabLeft,new SrcArea(this,longDesc,longDesc))
if(tabRight&&tabRight.isConnected)await this.leftTabs.replaceTab(tabRight,new SrcArea(this,longDesc,longDesc))}return true}openSrcRefInTabs(tabPos,srcRef,silent){switch(tabPos){case"main":return this.openSrcRefInSrcTabs(this.mainTabs,srcRef,silent)
case"left":if(!this.leftTabs)this._initLeftTabs()
this.showTabs(this.leftTabs)
return this.openSrcRefInSrcTabs(this.leftTabs,srcRef,silent)
case"right":if(!this.rightTabs)this._initRightTabs()
this.showTabs(this.rightTabs)
return this.openSrcRefInSrcTabs(this.rightTabs,srcRef,silent)}throw Error(tabPos)}isSrcRefShown(tabs,srcRef){const tab=tabs.getTabByCode(srcRef)
if(tab)return tabs.selectedTab===tab
return false}async openSrcRefInSrcTabs(tabs,srcRef,silent,lastDatas){try{const tab=tabs.getTabByCode(srcRef)
if(tab)return tabs.selectTab(tab)
const wsp=this.reg.env.wsp
const longDesc=SRC.isNewSrcUri(srcRef)?{srcUri:srcRef,itModel:SRC.extractItModelFromNewSrcUri(srcRef),srcSt:1,srcRoles:this.reg.env.securityCtx.srcRoles}:await wsp.fetchLongDesc(srcRef)
if(longDesc.srcSt<0||longDesc.itModel==null){if(this.fallbackOpenSrcRef){return this.fallbackOpenSrcRef(srcRef,longDesc,silent)}else{if(!silent)POPUP.showNotifInfo("Ce contenu n\'est plus disponible.",tabs)
return null}}await tabs.addTab(new SrcArea(this,longDesc,longDesc,lastDatas),{select:true})
return true}catch(e){console.trace(e)
return null}}getRegItemType(itModel){const wsp=this.reg.env.wsp
let reg=this.itemTypesRegs.get(itModel)
if(!reg){const itemType=wsp.wspMetaUi.getItemType(itModel)
reg=REG.createSubRegMixed(this.reg,itemType.reg)
this.itemTypesRegs.set(itModel,reg)}return reg}onViewShown(){VIEWS.onViewShown(this.mainTabs)
if(this.leftTabs)VIEWS.onViewShown(this.leftTabs)
if(this.rightTabs)VIEWS.onViewShown(this.rightTabs)
if(this.floatings)throw Error("TODO floatings...")}onViewHidden(closed){if(closed){this.reg.env.place.eventsMgr.removeListener("wspUriChange",this.onWspUriChange)
VIEWS.onViewHidden(this.mainTabs,true)
if(this.leftTabs)VIEWS.onViewHidden(this.leftTabs,true)
if(this.rightTabs)VIEWS.onViewHidden(this.rightTabs,true)
if(this.floatings)throw Error("TODO floatings...")}else{VIEWS.onViewHidden(this.mainTabs,false)
if(this.leftTabs)VIEWS.onViewHidden(this.leftTabs,false)
if(this.rightTabs)VIEWS.onViewHidden(this.rightTabs,false)
if(this.floatings)throw Error("TODO floatings...")}}buildLastDatas(parentLastDatas){}_onWspUriChange(msg,from){if(msg.type===EWspChangesEvts.r){const type=ITEM.getSrcUriType(msg.srcUri)
if(type==="item"){const srcRef=SRC.srcRef(msg)
this.mainTabs.closeItem(srcRef)
if(this.leftTabs)this.leftTabs.closeItem(srcRef)
if(this.rightTabs)this.rightTabs.closeItem(srcRef)}else if(type==="space"){this.mainTabs.closeSpace(msg.srcUri)
if(this.leftTabs)this.leftTabs.closeSpace(msg.srcUri)
if(this.rightTabs)this.rightTabs.closeSpace(msg.srcUri)}}else if(msg.type===EWspChangesEvts.u){const srcRef=SRC.srcRef(msg)
const tab=this.getOneTabForSrcRef(srcRef)
if(tab&&tab.view){const oldItModel=tab.area.shortDesc.itModel
this.reg.env.wsp.fetchLongDesc(srcRef,this.mainTabs).then(ld=>{this.refreshSrc(ld,ld,oldItModel!==ld.itModel)})}else if(tab){this.reg.env.wsp.fetchShortDesc(srcRef,this.mainTabs).then(sd=>{this.refreshSrc(sd)})}}else if(msg.type===EWspChangesEvts.s){const srcRef=SRC.srcRef(msg)
const tab=this.getOneTabForSrcRef(srcRef)
if(tab){const area=tab.area
if(area.longDesc){area.longDesc.itSt=msg.itSt
this.refreshSrc(area.longDesc,area.longDesc)}else{area.shortDesc.itSt=msg.itSt
this.refreshSrc(area.shortDesc)}}}}getOneTabForSrcRef(srcRef){let tab=this.mainTabs.getTabBySrcRef(srcRef)
if((!tab||!tab.view)&&this.leftTabs)tab=this.leftTabs.getTabBySrcRef(srcRef)
if((!tab||!tab.view)&&this.rightTabs)tab=this.rightTabs.getTabBySrcRef(srcRef)
return tab}refreshSrc(shortDesc,longDesc,rebuild){const srcRef=SRC.srcRef(shortDesc)
let tab=this.mainTabs.getTabBySrcRef(srcRef)
if(tab)rebuild?tab.rebuildItemView(this,longDesc):tab.updateSrc(shortDesc,longDesc)
if(this.leftTabs){tab=this.leftTabs.getTabBySrcRef(srcRef)
if(tab)rebuild?tab.rebuildItemView(this,longDesc):tab.updateSrc(shortDesc,longDesc)}if(this.rightTabs){tab=this.rightTabs.getTabBySrcRef(srcRef)
if(tab)rebuild?tab.rebuildItemView(this,longDesc):tab.updateSrc(shortDesc,longDesc)}}hideTabs(tabs){if(DOM.setHidden(tabs,true)){if(tabs.tabsPos==="left")tabs.nextElementSibling.hidden=true
else tabs.previousElementSibling.hidden=true}}showTabs(tabs){if(DOM.setHidden(tabs,false)){if(tabs.tabsPos==="left")tabs.nextElementSibling.hidden=false
else tabs.previousElementSibling.hidden=false}}}REG.reg.registerSkin("wsp-itemviewer-multi",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tbackground-color: var(--bgcolor);\n\t\tcolor: var(--color);\n\t}\n\n\t[hidden] {\n\t\tdisplay: none;\n\t}\n\n\tc-resizer {\n\t\twidth: 1px;\n\t}\n\n\thr {\n\t\tborder: none;\n\t\tborder-inline-start: 1px solid var(--border-color);\n\t\tmargin: .2rem;\n\t\talign-self: stretch;\n\t}\n`)
class SrcArea{constructor(itemViewer,shortDesc,longDesc,lastDatas){this._id=SRC.srcRef(shortDesc)
this.shortDesc=shortDesc
this.longDesc=longDesc
if(lastDatas)this.lastDatas=lastDatas
this.reg=itemViewer.getRegItemType(shortDesc.itModel)
this._subArea=this.reg.env.itemType.getSrcMainArea(this)}setPinned(p){this.pinned=p===true
return this}setShowTime(t){this.showTime=t
return this}updateSrcAndModel(itemViewer,ld){this.shortDesc=ld
this.longDesc=ld
this.reg=itemViewer.getRegItemType(ld.itModel)
this._subArea=this.reg.env.itemType.getSrcMainArea(this)}getId(){return this._id}getLabel(ctx){return this._subArea.getLabel(this)}getIcon(ctx){return this._subArea.getIcon(this)}getDescription(ctx){return this._subArea.getDescription(this)}getGroup(ctx){return this._subArea.getGroup(this)}getLastDatasKey(ctx){return this._subArea.getLastDatasKey(this)}getSkin(ctx){return this._subArea.getSkin(this)}getSkinOver(ctx){return this._subArea.getSkinOver(this)}isAvailable(ctx){return true}isEnabled(ctx){return true}isVisible(ctx){return true}isInstantiable(ctx){return true}needAsync(ctx){return this._subArea.needAsync(this)}loadBody(ctx,lastDatas){return this._subArea.loadBody(this,lastDatas)}loadLibs(ctx){return this._subArea.loadLibs(this)}buildBody(ctx,lastDatas){return this._subArea.buildBody(this,lastDatas)}}export class SrcTabs extends Tabs{get tabsPos(){return this.getAttribute("last-datas")}isMainTabs(){return this.areasContext.mainTabs===this}async selectTab(tab,lastDatas){if(tab===this._selectedTab){const area=tab.area
if(area instanceof SrcArea&&this.isMainTabs()){const infoBroker=this.areasContext.reg.env.infoBroker
if(infoBroker)infoBroker.dispatchInfo(new InfoCurrentItem(area.shortDesc.srcUri,area.shortDesc),this)}return true}return super.selectTab(tab,lastDatas)}async closeTab(tab,silently){if(!await super.closeTab(tab,silently,true))return false
if(!this.isMainTabs()&&!this._tabs.firstElementChild){this.areasContext.hideTabs(this)}return true}getTabBySrcRef(srcRef){return this.getTabByCode(srcRef)}closeItem(srcRef){const tab=this.getTabBySrcRef(srcRef)
if(tab)this.closeTab(tab)}closeSpace(spaceUri){this.visitTabs(t=>{const area=t.area
if(area instanceof SrcArea){if(SRC.isSubUriOrEqual(spaceUri,area.shortDesc.srcUri))this.closeTab(t)}})}addHisto(srcRef){if(this.histo.size>12){let del=0
for(const s of this.histo){this.histo.delete(s)
if(++del===12)break}}this.histo.add(srcRef)}remHisto(srcRef){this.histo.delete(srcRef)}getOldestRemovableTabs(){const result=[]
let tab=this._tabs.firstElementChild
while(tab){if(tab instanceof SrcTab&&!tab.frozen&&!tab.pinned)result.push(tab)
tab=tab.nextElementSibling}result.sort((t1,t2)=>t1.showTime-t2.showTime)
return result}_initialize(init){this._movable=true
this._showOnDragOver=true
this.classList.add("noBorder")
this.setAttribute("c-resizable","")
this.style.flex="1"
init.skin="c-tabs/wsp-src-tabs"
init.cbOverflow=async overflow=>{if(overflow){const oldests=this.getOldestRemovableTabs()
for(let i=0,s=oldests.length-2;i<s;i++){const oldest=oldests[i]
if(oldest.isConnected){await this.closeTab(oldest,true)
if(!this._tabs.isOverflow)return}}}}
this.reg=this.findReg(init)
if(init.lastDatas&&init.lastDatas.histo)this.histo=new Set(init.lastDatas.histo)
else this.histo=new Set
this.append(JSX.createElement("hr",{slot:"tools-end"}),JSX.createElement(Button,{slot:"tools-end",title:"Historique des items affichés","î":{reg:this.reg,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/itemViewerMulti/histo.svg"},onclick:this.onClickHisto}),JSX.createElement(ActionBtn,{slot:"tools-end","î":{reg:this.reg,action:new OpenFastFindItem,actionContext:this,accel:ACTION.getAccelText({mainKey:"<",accelKey:true}),uiContext:"bar"}}),JSX.createElement(ActionBtn,{slot:"tools-end","î":{reg:this.reg,action:new OpenSearchItems,accel:ACTION.getAccelText({mainKey:"F",accelKey:true,shiftKey:true}),actionContext:this,uiContext:"bar"}}))
this.menuActions=ACTION.injectSepByGroup(this.reg.getList("actions:itemViewerMulti"),"tab * close",null)
this.addEventListener("wsp-need-valid",this.onNeedValid)
return super._initialize(init)}_initShadowRoot(){const sr=this.shadowRoot
this._tabs.id="tabs"
sr.appendChild(JSX.createElement("div",{id:"head"},JSX.createElement("slot",{name:"tools-start"}),this._tabs,JSX.createElement("slot",{name:"tools-end"})))
sr.appendChild(JSX.createElement("div",{id:"panels"},this._mainSlot))}_initTabs(){if(this._areas)this._areas.forEach(area=>{this._newTab(area)})}_newTab(area,before){const tab=(new SrcTab).initialize({parentViewCtn:this,area:area})
this._initTab(tab)
this._tabs.insertBefore(tab,before)
return tab}buildLastDatas(p){const k=this.getAttribute("last-datas")
const ld={}
ld.histo=Array.from(this.histo)
ld.tabs=[]
this.visitTabs(t=>{if(!t.frozen&&t.area instanceof SrcArea){const s={}
if(t.selected){ld.tab=t.code
LASTDATAS.buildLastDatas(s,t.view,true)}else if(t.area.lastDatas)Object.assign(s,t.area.lastDatas)
s.srcRef=t.area.getId()
s.pin=t.pinned?true:undefined
ld.tabs.push(s)}})
if(this.isMainTabs()){p[k]=ld
this.areasContext.buildLastDatas(p)}else if(ld.tabs.length>0){p[k]=ld}}async onClickHisto(ev){const target=ev.target
const tabs=this.parentElement
const actions=[]
if(tabs.histo.size>0){const wsp=tabs.reg.env.wsp
const srcs=await WSP.fetchShortDescs(wsp,tabs,...tabs.histo)
for(const src of srcs){if(src&&src.srcSt>0&&src.itModel!=null)actions.push(new SrcOpenFromHisto(tabs.areasContext,src))}}if(actions.length===0)actions.push(new Action("none").setEnabled(false).setLabel("Historique vide"))
else actions.reverse()
actions.push(new ActionSeparator,(new OpenFastFindItem).setLabel("Autre item..."))
POPUP.showPopupActionsFromEvent({reg:tabs.reg,actions:actions,actionContext:tabs},ev,target)}onNeedValid(ev){const tab=this.findTabFromDesc(ev.target)
if(tab)tab.needValid=ev.detail}}REG.reg.registerSkin("c-tabs/wsp-src-tabs",1,`\n\t#tabs > .selected {\n\t\tbackground-color: var(--page-bgcolor);\n\t}\n`)
customElements.define("wsp-src-tabs",SrcTabs)
export class SrcTab extends Tab{get pinned(){return this.classList.contains("pinned")}set pinned(v){this.classList.toggle("pinned",v)}get needValid(){return this.classList.contains("needValid")}set needValid(v){this.classList.toggle("needValid",v)}isMainTabs(){return this.areaContext.mainTabs===this.parentViewCtn}async closeTabView(silently){if(this.area instanceof SrcArea)this.parentViewCtn.addHisto(SRC.srcRef(this.area.shortDesc))
if(!await super.closeTabView(silently))return false
if(this.selected&&this.isMainTabs()&&this.area instanceof SrcArea){const infoBroker=this.parentViewCtn.areasContext.reg.env.infoBroker
if(infoBroker)infoBroker.dispatchInfo(new InfoCurrentItem(null),this)}return true}async show(lastDatas){const area=this.area
await super.show(area instanceof SrcArea?area.lastDatas:lastDatas)
this.showTime=Date.now()
if(this.isMainTabs()&&area instanceof SrcArea){const view=this.view
if(!view)return
await view.initializedAsync
area.longDesc=area.shortDesc=view.reg.env.longDesc
const infoBroker=this.parentViewCtn.areasContext.reg.env.infoBroker
if(infoBroker)infoBroker.dispatchInfo(new InfoCurrentItem(area.shortDesc.srcUri,area.shortDesc),this)}}async hide(willSelect){if(this.area instanceof SrcArea)this.area.lastDatas=LASTDATAS.buildLastDatas({},this.view,true)
const hidden=await super.hide()
if(hidden&&willSelect==null&&this.isMainTabs()&&this.area instanceof SrcArea&&this.area.longDesc){const infoBroker=this.parentViewCtn.areasContext.reg.env.infoBroker
if(infoBroker)infoBroker.dispatchInfo(new InfoCurrentItem(null),this)}return hidden}updateSrc(shortDesc,longDesc){if(this.area instanceof SrcArea){this.area.shortDesc=shortDesc
this.area.longDesc=longDesc
this.refresh()}}async rebuildItemView(itemViewer,longDesc){if(this.area instanceof SrcArea){this.area.updateSrcAndModel(itemViewer,longDesc)
const wasShown=this._shown
this._shown=false
this.needValid=false
await super.closeTabView(true)
if(wasShown)super.show(this.area.lastDatas)
else this.refresh()}}get ctxMenuActions(){return{actions:this.parentViewCtn.menuActions,actionContext:this}}_initialize(init){if(!init.skin)init.skin="wsp-src-tab"
super._initialize(init)
this._bodyElt=this.shadowRoot.appendChild(JSX.createElement("div",null))
this._iconElt=this._bodyElt.appendChild(JSX.createElement("span",{class:"icon"}))
this._labelElt=this._bodyElt.appendChild(JSX.createElement("span",{class:"label"}))
this.addEventListener("pointerover",this.onPointerOver)
if(init.area instanceof SrcArea){this.parentViewCtn.remHisto(SRC.srcRef(init.area.shortDesc))
this.pinned=init.area.pinned===true
this.showTime=init.area.showTime
this.setAttribute("draggable","true")
this.addEventListener("dragstart",this._onDragStart)
this.addEventListener("dragend",ITEM.resetShortDescTransferToDragSession)
this.addEventListener("pointerenter",(function(ev){const tt=(new PopupTooltip).initialize({tooltipOf:this,hoverAllowed:true})
tt.addEventListener("c-show",(function(ev){const srcArea=this.tooltipOf.area
const drawer=this.view||this.appendChild((new SrcDrawer).initialize({skin:"wsp-src-drawer/tooltip",tpl:SRCDRAWER.detailsTpl,reg:srcArea.reg}))
const itemType=srcArea.reg.env.itemType
const tpl=itemType?SRCDRAWER.detailsTpl(itemType,srcArea.shortDesc,drawer):null
if(tpl)renderAppend(tpl,drawer.shadowRoot)
else this.close()}))
tt.forwardPointerEnter(ev)}),{once:true})}else{this.pinned=false
this.showTime=0}this.frozen=false}_onDragStart(ev){if(this.area instanceof SrcArea){ITEM.setShortDescTransferToDragSession({reg:this.area.reg,infoBroker:this.area.reg.env.infoBroker,shortDescs:[this.area.shortDesc],emitter:this},ev,"build")}}onPointerOver(ev){if(!this._closeElt){this.addEventListener("pointerout",this.onPointerOut)
this._closeElt=this.shadowRoot.appendChild(JSX.createElement(ActionBtn,{id:"close","î":{action:closeAction,actionContext:this,uiContext:"bar"}}))
this._closeElt.onpointerdown=ev=>{ev.stopPropagation()}}else{DOM.setHidden(this._closeElt,false)}}onPointerOut(ev){if(this._closeElt)DOM.setHidden(this._closeElt,true)}}REG.reg.registerSkin("wsp-src-tab",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-width: min-content !important;\n\t\tuser-select: none;\n\t\tcursor: pointer;\n\t}\n\n\t:host(.pinned) > div {\n\t\tbackground: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/itemViewerMulti/pin.svg") no-repeat top 2px right;\n\t\tbackground-size: .7em;\n\t\tpadding-inline-end: .7em !important;\n\t}\n\n\t:host(.needValid) {\n\t\tfont-weight: bold;\n\t}\n\n\t:host(.needValid) > * > .label::after {\n\t\tfont-weight: bold;\n\t\tcontent: "*";\n\t\tcolor: var(--valid-color);\n\t}\n\n\t:host(:hover) {\n\t\tposition: relative;\n\t}\n\n\t:host([hidden]) {\n\t\tdisplay: none;\n\t}\n\n\t:host([disabled]) {\n\t\topacity: 0.2;\n\t\tpointer-events: none;\n\t}\n\n\tdiv {\n\t\tdisplay: flex;\n\t\talign-items: flex-start;\n\t\tjustify-content: center;\n\t}\n\n\t.icon {\n\t\theight: var(--icon-size);\n\t\twidth: var(--icon-size);\n\t\tmin-height: var(--icon-size);\n\t\tmin-width: var(--icon-size);\n\t\tbackground: var(--icon-color) var(--icon-img) no-repeat center / contain;\n\t\tmargin-inline-start: 0.3em;\n\t\tfilter: var(--filter);\n\t}\n\n\t.label {\n\t\tfont-size: var(--label-size);\n\t\tmin-width: 3em;\n\t\ttext-align: start;\n\t}\n\n\t:host(:hover) > * > .icon {\n\t\tfilter: var(--hover-filter);\n\t}\n\n\t:host(:active) > * > .icon {\n\t\tfilter: var(--actve-filter);\n\t}\n\n\t:host(:hover), :host(.willBeShown) {\n\t\tbackground: var(--pressed-bgcolor);\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--focus-outline);\n\t\toutline-offset: -2px;\n\t}\n\n\t:host(:active) > div {\n\t\tbackground: var(--pressed-bgcolor);\n\t}\n\n\t#close {\n\t\tposition: absolute;\n\t\tright: 0; /* FIX RTL */\n\t\tbackground: radial-gradient(var(--bgcolor), transparent);\n\t}\n`)
customElements.define("wsp-src-tab",SrcTab)
REG.reg.addToList("actions:itemViewerMulti","pin",1,new Action("pin").setIcon(ctx=>ctx.pinned?"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/itemViewerMulti/unpin.svg":"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/itemViewerMulti/pin.svg").setLabel(ctx=>ctx.pinned?"Libérer l\'onglet":"Figer l\'onglet").setGroup("tab").setVisible(ctx=>!ctx.frozen).setExecute((ctx,ev)=>{ctx.pinned=!ctx.pinned}))
const closeAction=new Action("close").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/close.svg").setLabel("Fermer").setGroup("close").setVisible(ctx=>!ctx.frozen).setExecute((ctx,ev)=>{if(ev)ev.stopPropagation()
ctx.parentViewCtn.closeTab(ctx)})
REG.reg.addToList("actions:itemViewerMulti","close",1,closeAction)
REG.reg.addToList("actions:itemViewerMulti","closeAll",1,new Action("closeAll").setLabel("Tout fermer").setGroup("close").setVisible(ctx=>!ctx.frozen).setExecute((ctx,ev)=>{if(ctx.pinned){ctx.parentViewCtn.visitTabsAsync(async t=>{if(t instanceof SrcTab&&!t.frozen)if(!await t.parentViewCtn.closeTab(t))return"stop"})}else{ctx.parentViewCtn.visitTabsAsync(async t=>{if(t instanceof SrcTab&&!t.frozen&&!t.pinned)if(!await t.parentViewCtn.closeTab(t))return"stop"})}}))
REG.reg.addToList("actions:itemViewerMulti","closeOthers",1,new Action("closeOthers").setLabel("Fermer les autres").setGroup("close").setVisible(ctx=>!ctx.frozen).setExecute((ctx,ev)=>{if(ctx.pinned){ctx.parentViewCtn.visitTabsAsync(async t=>{if(t!==ctx&&t instanceof SrcTab&&!t.frozen)if(!await t.parentViewCtn.closeTab(t))return"stop"})}else{ctx.parentViewCtn.visitTabsAsync(async t=>{if(t!==ctx&&t instanceof SrcTab&&!t.frozen&&!t.pinned)if(!await t.parentViewCtn.closeTab(t))return"stop"})}}))
class OpenInTabs extends Action{constructor(pos,label){super(pos)
this._label=label
this._group="tab"}isVisible(ctx){return ctx.parentViewCtn.tabsPos!==this._id}execute(ctx,ev){ctx.parentViewCtn.areasContext.openSrcRefInTabs(this._id,SRC.srcRef(ctx.area.shortDesc))}}REG.reg.addToList("actions:itemViewerMulti","openLeft",1,new OpenInTabs("left","Répliquer à gauche"))
REG.reg.addToList("actions:itemViewerMulti","openMain",1,new OpenInTabs("main","Répliquer au centre"))
REG.reg.addToList("actions:itemViewerMulti","openRight",1,new OpenInTabs("right","Répliquer à droite"))
class SrcOpenFromHisto extends Action{constructor(itemViewer,shortDesc){super(null)
this.shortDesc=shortDesc
this.reg=itemViewer.getRegItemType(shortDesc.itModel)
this._subArea=this.reg.env.itemType.getSrcMainArea(this)}getLabel(ctx){return this._subArea.getLabel(this)}getIcon(ctx){return this._subArea.getIcon(this)}getDescription(ctx){return this._subArea.getDescription(this)}getGroup(ctx){return this._subArea.getGroup(this)}isEnabled(ctx){return this._subArea.isEnabled(this)}isVisible(ctx){return this._subArea.isVisible(this)}execute(ctx,ev){ctx.addTab(new SrcArea(ctx.areasContext,this.shortDesc),{select:true})}}
//# sourceMappingURL=itemViewerMulti.js.map