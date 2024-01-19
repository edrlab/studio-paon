import{BaseElement,BaseElementAsync,BASIS,isEltInitableAsyncPending}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{Tabs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tabs.js"
import{ItemXmlEd}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/item/itemXmlEd.js"
import{InfoBrokerBasic}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/infos.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{SEC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/security.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{loadFreeLib}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js"
import{Area,isArea,SimpleTagArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{InfoFocusItem,InfoFocusNodeInItem,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/ribbon/ribbon.js"
import{EventMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{ACTION,Action,ActionMenu}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{ActionBtn,Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{ExportScar,MoveToSrc,PasteContent,ReloadSrc,RenameSrc}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{ItemMsgSs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/item/itemMsgSs.js"
import{Resizer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/resizer.js"
import{TASK}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/lcTask.js"
import{isApp}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/appFrame.js"
import{InfoChangeTask,InfoReqStateTask}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/task/taskFields.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{EWspChangesEvts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/zones/webZones.js"
export function isItemUiEnv(env){return env&&env.longDesc!=null}export class SrcMain extends BaseElementAsync{constructor(){super(...arguments)
this.shortDescs=[]}async _initialize(init){this.wsp=init.areaContext.reg.env.wsp
this.infoBroker=init.areaContext.reg.env.infoBroker
if(this.infoBroker)this.infoBroker.addConsumer(this)
this.reg=REG.createSubReg(init.areaContext.reg)
this.reg.env.place=this.wsp.newPlaceWsp()
let longDesc=init.areaContext.longDesc
if(!longDesc){if(SRC.isNewSrcUri(init.areaContext.shortDesc.srcUri)){longDesc=init.areaContext.shortDesc
longDesc.srcRoles=this.reg.env.securityCtx.srcRoles}else{longDesc=await this.wsp.fetchLongDesc(SRC.srcRef(init.areaContext.shortDesc))}}this.reg.env.longDesc=longDesc
this.shortDescs[0]=longDesc
this.reg.env.srcView=this
this.reg.env.longDescChange=new EventMgr
this.reg.env.securityCtx=SEC.createSub(this.reg.env.securityCtx,longDesc.srcRoles,longDesc.srcRi,longDesc)
this.reg.env.itemType.configRegForMainView(init.areaContext,this.reg)
this.reg.env.place.eventsMgr.on("wspUriChange",this.onWspUriChange.bind(this))
if(ITEM.isExtItem(longDesc.srcUri)){this.reg.env.place.getWsp(WSP.extractWspCdFromWspRef(longDesc.itFullUriInOwnerWsp))}return this._buildContent(init)}async _buildContent(init){var _a
this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("webzone:page",this.shadowRoot)
this.reg.installSkin("wsp-itemmain",this.shadowRoot)
this._initAndInstallSkin(this.localName,init)
const itemType=this.reg.env.itemType
const mainView=itemType.getDataSrcMainView(init.areaContext)
const ribRoot=this.shadowRoot.appendChild(JSX.createElement("header",{id:"ribbons"}))
const ribClasses=this.reg.getList("ribbon:item")
if(ribClasses){const ribbons=[]
for(let i=0;i<ribClasses.length;i++){let rib
if(isArea(ribClasses[i])){const areaCtx={reg:this.reg}
if(ribClasses[i].isAvailable(areaCtx)){if(ribClasses[i].needAsync(areaCtx)){rib=ribRoot.appendChild(await ribClasses[i].loadBody(areaCtx,init.lastDatas))}else{rib=ribRoot.appendChild(ribClasses[i].buildBody(areaCtx,init.lastDatas))}}}else rib=ribRoot.appendChild(new ribClasses[i])
if(rib){ribbons.push(rib)}}this.subViews=ribbons}const converters=itemType.getConvertersForMainView(init.areaContext)
if(converters)this.reg.addToList("actions:item:burger","converters",1,new ItemMainConverters(converters),100)
let burgerActions=this.reg.mergeLists("actions:item:burger","actions:wsp:shortDesc")
if(burgerActions){burgerActions=ACTION.injectSepByGroup(burgerActions,"",this)
ribRoot.insertBefore(JSX.createElement(ActionBtn,{"ui-context":"bar","î":{reg:this.reg,action:(new ActionMenu).setActions(burgerActions).setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/actions.svg").setLabel("Actions générales sur l\'item"),actionContext:this}}),ribRoot.firstChild)}if(mainView&&mainView.showSsErrors){this.shadowRoot.appendChild((new ItemMsgSs).initialize({reg:this.reg,errors:mainView.showSsErrors.errors}))}let tabs
if(((_a=mainView===null||mainView===void 0?void 0:mainView.subTabs)===null||_a===void 0?void 0:_a.length)>0){const datasTabs=mainView.subTabs
tabs=[new ItemHomeArea(init).setLabel(mainView.mainTabLabel||"Édition").setIcon(mainView.mainTabIcon||"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/itemMain/penInk.svg")]
for(const d of datasTabs)tabs.push(new ItemSubTabArea(d,this))}if(tabs){this.tabs=new Tabs
this.tabs.classList.add("noBorder")
this.shadowRoot.appendChild(this.tabs.initialize({reg:this.reg,areasContext:this,areas:tabs,lastDatasKey:"vtabs",lastDatas:init.lastDatas?init.lastDatas["vtabs"]:null,skinOver:"itemMain/c-tabs",tabSkinOver:"itemMain/c-tab"}))
await this.tabs.initializedAsync
this.tabs.selectTab=async function(tab,lastDatas){await REG.findReg(this).env.universe.wspServer.wspsLive.saveAllHouses()
return Tabs.prototype.selectTab.call(this,tab,lastDatas)}}else{const body=this.shadowRoot.appendChild(JSX.createElement("div",{id:"noTabs"}))
if(!this.subViews)this.subViews=[]
return this._buildHome(init,itemType,body)}}onViewShown(){this.viewShown=true
if(this.subViews)for(const v of this.subViews)VIEWS.onViewShown(v)
if(this.tabs)VIEWS.onContainerShown(this.tabs)}onViewHidden(closed){this.viewShown=false
if(closed){this.reg.env.place.closePlace()
if(this.infoBroker)this.infoBroker.removeConsumer(this)}if(this.subViews)for(const v of this.subViews)VIEWS.onViewHidden(v,closed)
if(this.tabs)VIEWS.onContainerHidden(this.tabs,closed)}visitViews(visitor,options){if(this.subViews)for(const v of this.subViews){const r=visitor(v)
if(r!==undefined)return r}if(this.tabs)return this.tabs.visitViews(visitor,options)}async visitViewsAsync(visitor,options){if(this.subViews)for(const v of this.subViews){const r=await visitor(v)
if(r!==undefined)return r}if(this.tabs)return this.tabs.visitViewsAsync(visitor,options)}onInfo(info){}buildSrcView(v){return v?newSrcView(v,this.reg):null}async onWspUriChange(msg,from){var _a
if(msg.wspCd!==this.reg.env.wsp.code)return
const longDesc=this.reg.env.longDesc
if(SRC.srcRef(longDesc)===SRC.srcRef(msg)||msg.type===EWspChangesEvts.perm&&SRC.isSubUriOrEqual(msg.srcUri,longDesc.srcUri)){const ldNew=await this.reg.env.wsp.fetchLongDesc(SRC.srcRef(longDesc),this)
if(!this.isConnected)return
if(!this.wsp.isAvailable)await this.wsp.waitForAvailable(this)
this.reg.env.longDesc=ldNew
this.shortDescs[0]=ldNew
this.reg.env.securityCtx=SEC.createSub(this.reg.env.securityCtx,ldNew.srcRoles,ldNew.srcRi,ldNew);(_a=this.tabs)===null||_a===void 0?void 0:_a.refresh()
this.reg.env.longDescChange.emit(ldNew,longDesc)}}async focusNodeInEditor(ed,info){await ed.initializedAsync
const wedMgr=ed.view.wedMgr
const docHolder=wedMgr.docHolder
if(!docHolder)return
if(typeof info.xpath==="string"){const node=docHolder.house.findNodeByXpath(info.xpath)
if(node){if(wedMgr.drawn){WEDLET.highlightWedletFromLink(XA.from(node),ed.view.wedMgr,"nearest")}else{wedMgr.listeners.once("redrawAtEnd",()=>{WEDLET.highlightWedletFromLink(XA.from(node),ed.view.wedMgr,"nearest")})}}}else{if(wedMgr.drawn){WEDLET.highlightWedletFromLink(info.xpath,ed.view.wedMgr,"nearest")}else{wedMgr.listeners.once("redrawAtEnd",()=>{WEDLET.highlightWedletFromLink(info.xpath,ed.view.wedMgr,"nearest")})}}}get emitter(){return this}}REG.reg.registerSkin("wsp-itemmain",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tbackground-color: var(--bgcolor);\n\t\tcolor: var(--color);\n\t}\n\n\t[hidden] {\n\t\tdisplay: none !important;\n\t}\n\n\t#ribbons {\n\t\tdisplay: flex;\n\t\tmin-height: 2.8em;\n\t\tmin-width: 0;\n\t}\n\n\t#noTabs {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tborder-top: 1px solid var(--border-color);\n\t}\n\n\tc-tabs {\n\t\tflex: 1;\n\t}\n\n\t#mainTab {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\tc-resizer[c-orient="row"] {\n\t\twidth: 1px;\n\t}\n\n\tc-resizer[c-orient="column"] {\n\t\theight: 1px;\n\t}\n\n\t#ribbons > c-resizer {\n\t\twidth: 0;\n\t}\n\n\t#ribbons > [hidden] + c-resizer {\n\t\tdisplay: none;\n\t}\n`)
class ItemHomeArea extends Area{constructor(init){super("")
this.init=init}needAsync(ctx){return true}async loadBody(ctx,lastDatas){const mainTab=JSX.createElement("div",{id:"mainTab"})
const init=Object.create(this.init)
init.lastDatas=lastDatas
await ctx._buildHome(init,ctx.reg.env.itemType,mainTab)
return mainTab}}class ItemSubTabArea extends SimpleTagArea{constructor(datas,itemMain){super(datas.view.tag,null,datas.code)
this.datas=datas
this.itemMain=itemMain
this._label=datas.label
this._description=datas.description
this._icon=datas.icon
this._visPerms=datas.showPerms}async loadLibs(ctx){const v=this.datas.view
if(v.freeLib)await loadFreeLib(ctx.reg.env.itemType.resolvePath(v.freeLib),ctx.reg.env.wsp.wspMetaUi.reg)
else if(standardSrcViewsLibs[v.tag])await ctx.reg.env.resolver.importJs(standardSrcViewsLibs[v.tag])
return super.loadLibs(ctx)}needAsync(ctx){if(super.needAsync(ctx))return true
const v=this.datas.view
const lib=v.freeLib||standardSrcViewsLibs[v.tag]
return lib&&!customElements.get(v.tag)}newElt(ctx,lastDatas){const elt=super.newElt(ctx)
const atts=this.datas.view.atts
if(atts)for(const att in atts)elt.setAttribute(att,atts[att])
if(elt instanceof BaseElement){const init=BASIS.newInit(this.datas.view.init,this.itemMain.reg)
init.lastDatas=lastDatas
elt.initialize(init)}return elt}}export async function newSrcView(v,reg){let init=v.init
if(v.freeLib){const module=await loadFreeLib(reg.env.itemType.resolvePath(v.freeLib),reg.env.wsp.wspMetaUi.reg)
if(module.newFreeSrcViewInit)init=module.newFreeSrcViewInit(v,reg)}if(!customElements.get(v.tag)){const lib=standardSrcViewsLibs[v.tag]
if(lib)await reg.env.resolver.importJs(lib)}const view=document.createElement(v.tag)
view.setAttribute("c-resizable","")
const atts=v.atts
if(atts)for(const att in atts)view.setAttribute(att,atts[att])
if(view instanceof BaseElement){view.initialize(BASIS.newInit(init,reg))
if(isEltInitableAsyncPending(view))await view.initializedAsync}return view}export const standardSrcViewsLibs={"wsp-item-img":":back:wsp/views/item/itemImg.js","wsp-item-video":":back:wsp/views/item/itemVideo.js","wsp-item-audio":":back:wsp/views/item/itemAudio.js","wsp-item-iframe":":back:wsp/views/item/itemIframe.js","wsp-item-pdf":":back:wsp/views/item/itemPdf.js","wsp-item-dyngen":":back:wsp/views/item/itemDynGen.js","wsp-item-remote":":back:wsp/views/item/itemRemote.js","wsp-item-remote-res":":back:wsp/views/item/itemRemoteRes.js","wsp-item-folder-tree":":back:wsp/views/item/itemFolderTree.js","wsp-item-msg-ss":":back:wsp/views/item/itemMsgSs.js","wsp-item-txt":":back:wsp/views/item/itemTxt.js","wsp-item-code-ed":":back:wsp/views/item/itemCodeEd.js","wsp-task-dyngen":":back:wsp/views/task/taskDynGen.js","wsp-task-ct-edit":":back:wsp/views/task/taskContent.js","wsp-task-ct-dyngen":":back:wsp/views/task/taskContent.js","wsp-task-layout":":back:wsp/views/task/taskLayout.js","wsp-task-field":":back:wsp/views/task/taskFields.js","wsp-task-field-input":":back:wsp/views/task/taskFields.js","wsp-task-field-lc":":back:wsp/views/task/taskFields.js","wsp-task-xmlfield":":back:wsp/views/task/taskFields.js","wsp-task-exec-trans":":back:wsp/views/task/taskFields.js"}
export class ItemMainXml extends SrcMain{async _buildHome(init,itemType,parentElt){const mainView=itemType.getDataSrcMainView(init.areaContext)
if(mainView&&mainView.xmlEditor){this.mainXmlEd=parentElt.appendChild((new ItemXmlEd).initialize({reg:this.reg,editorKey:mainView.xmlEditor,writePerms:"action.itemMainView#edit.content",lastDatas:init.lastDatas}))
if(this.subViews)this.subViews.push(this.mainXmlEd)
return this.mainXmlEd.initializedAsync}}onInfo(info){if(info instanceof InfoFocusNodeInItem){const desc=this.reg.env.longDesc
if(desc.srcUri===info.srcRef||desc.srcId===info.srcRef){let ed=this.mainXmlEd
if(this.tabs){const currView=this.tabs.selectedTab.view
if(currView instanceof ItemXmlEd){ed=currView}else{this.tabs.selectTab(this.tabs.getTabByCode(""))}}if(ed)this.focusNodeInEditor(ed,info)}}}}customElements.define("wsp-itemmain-xml",ItemMainXml)
export class ItemMainRes extends SrcMain{async _buildContent(init){this.reg.addToList("actions:item:burger","pasteStream",1,new PasteContent)
return super._buildContent(init)}async _buildHome(init,itemType,parentElt){const mainView=itemType.getDataSrcMainView(init.areaContext)
const resView=await this.buildSrcView(mainView===null||mainView===void 0?void 0:mainView.resView)
if(resView){resView.style.flex="1"
parentElt.appendChild(resView)
if(this.subViews)this.subViews.push(resView)}const editor=mainView===null||mainView===void 0?void 0:mainView.xmlEditor
if(editor){if(resView)parentElt.appendChild(JSX.createElement(Resizer,{"c-orient":"column"}))
const ed=this.metaXmlEd=parentElt.appendChild(JSX.createElement(ItemXmlEd,{id:"metaEd","î":{reg:this.reg,editorKey:editor,writePerms:"action.itemMainView#edit.content",lastDatas:init.lastDatas},"c-resizable":"",style:"display: flex;"}))
if(this.subViews)this.subViews.push(ed)
await ed.initializedAsync
const house=ed.view.wedMgr.docHolder.house
const metasSrcFields=house.srcFields
if(metasSrcFields&&metasSrcFields.srcSt<0&&metasSrcFields.srcDt>0){ed.view.wedMgr.setReadOnly("inTrash",true)
const meatBar=parentElt.insertBefore(JSX.createElement("div",{id:"metaInTrashBar"},JSX.createElement("span",null,"Ces métadonnées sont actuellement en corbeille"),JSX.createElement("div",null,JSX.createElement(Button,{"î":{reg:this.reg,label:"Restaurer",uiContext:"dialog"},disabled:this.reg.hasPermission("restore.history",metasSrcFields.srcRoles,undefined,metasSrcFields.srcRi)?undefined:"",onclick:async ev=>{await WSP.srcRestore(this.wsp,this,[SRC.srcRef(metasSrcFields)])
ed.view.wedMgr.setReadOnly("inTrash",false)
meatBar.remove()}}),JSX.createElement(Button,{"î":{reg:this.reg,label:"Réinitialiser",uiContext:"dialog"},disabled:this.reg.hasPermission("action.itemMainView#edit.content",metasSrcFields.srcRoles,undefined,metasSrcFields.srcRi)?undefined:"",onclick:async ev=>{await saveDoc(this,house,DOM.newDomDoc(),house.itemType.getModel(),SRC.srcRef(metasSrcFields))
ed.view.wedMgr.setReadOnly("inTrash",false)
meatBar.remove()}}))),ed)}}}onInfo(info){if(info instanceof InfoFocusNodeInItem){const desc=this.reg.env.longDesc
if(desc.srcUri===info.srcRef||desc.srcId===info.srcRef){if(this.metaXmlEd)this.focusNodeInEditor(this.metaXmlEd,info)}}}}REG.reg.registerSkin("wsp-itemmain-res",1,`\n\twsp-item-xmled {\n\t\tflex-direction: column;\n\t\tflex: 1;\n\t\tmin-height: 7em;\n\t}\n\n\t#metaInTrashBar {\n\t\tborder-bottom: 1px solid var(--border-color);\n\t\ttext-align: center;\n\t\tpadding: .5em;\n\t\tbackground-color: var(--alt1-bgcolor);\n\t}\n\n\t#metaInTrashBar > span {\n\t\tcolor: var(--warning-color);\n\t\tfont-weight: bold;\n\t}\n\n\t#metaInTrashBar > div {\n\t\tdisplay: flex;\n\t  justify-content: center;\n\t}\n`)
customElements.define("wsp-itemmain-res",ItemMainRes)
export class ItemMainFolder extends SrcMain{async _buildHome(init,itemType,parentElt){const mainView=itemType.getDataSrcMainView(init.areaContext)
const msgSs=await this.buildSrcView({tag:"wsp-item-msg-ss"})
parentElt.appendChild(msgSs)
const ctnH=parentElt.appendChild(JSX.createElement("div",{id:"ctnH"}))
const treeView=await this.buildSrcView({tag:"wsp-item-folder-tree"})
if(this.subViews)this.subViews.push(treeView)
ctnH.appendChild(treeView)
const resView=await this.buildSrcView(mainView&&mainView.resView)
if(resView&&this.subViews)this.subViews.push(resView)
const editor=mainView&&mainView.xmlEditor?mainView.xmlEditor:itemType.datas.editors?Object.keys(itemType.datas.editors)[0]:null
if(resView&&editor){ctnH.appendChild(JSX.createElement(Resizer,{"c-orient":"row"}))
const ctnV=ctnH.appendChild(JSX.createElement("div",{id:"ctnV","c-resizable":""}))
ctnV.appendChild(resView)
ctnV.appendChild(JSX.createElement(Resizer,{"c-orient":"column"}))
const ed=ctnV.appendChild(JSX.createElement(ItemXmlEd,{"î":{reg:this.reg,editorKey:editor,writePerms:"action.itemMainView#edit.content",lastDatas:init.lastDatas},"c-resizable":"",style:"display: flex;"}))
if(this.subViews)this.subViews.push(ed)}else if(resView){ctnH.appendChild(JSX.createElement(Resizer,{"c-orient":"row"}))
ctnH.appendChild(resView)}else if(editor){ctnH.appendChild(JSX.createElement(Resizer,{"c-orient":"row"}))
const ed=ctnH.appendChild(JSX.createElement(ItemXmlEd,{"î":{reg:this.reg,editorKey:editor,writePerms:"action.itemMainView#edit.content",lastDatas:init.lastDatas},"c-resizable":"",style:"display: flex;"}))
if(this.subViews)this.subViews.push(ed)}}}REG.reg.registerSkin("wsp-itemmain-folder",1,`\n\t#ctnH {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\t#ctnV {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\twsp-item-xmled {\n\t\tflex-direction: column;\n\t\tflex: 1;\n\t}\n`)
customElements.define("wsp-itemmain-folder",ItemMainFolder)
export class TaskMain extends SrcMain{async redrawMainView(){this.resetMainView()
await this._buildHome(this.config,this.reg.env.itemType,this.shadowRoot)
if(this.viewShown)for(const v of this.subViews)VIEWS.onViewShown(v)}resetMainView(){for(const v of this.subViews)VIEWS.onViewHidden(v,true)
while(this.startRedraw.nextElementSibling)this.startRedraw.nextElementSibling.remove()
this.subViews.length=0
this.reg.env.initStates=null
this.setNeedValid(false)
this.reg.env.taskEditBroker.removeAllConsumers()}setNeedValid(needValid){if(this._needValid!==needValid){this._needValid=needValid
if(this.isConnected)this.dispatchEvent(new CustomEvent("wsp-need-valid",{bubbles:true,detail:needValid}))}}connectedCallback(){super.connectedCallback()
if(this._needValid)this.dispatchEvent(new CustomEvent("wsp-need-valid",{bubbles:true,detail:true}))}async _buildContent(init){this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("webzone:page",this.shadowRoot)
this._initAndInstallSkin(this.localName,init)
this.config=init
this.startRedraw=this.shadowRoot.lastElementChild
this.reg.env.longDescChange.add(async()=>{await this.fetchContent()
return this.redrawMainView()})
if(init.lastDatas&&init.lastDatas.tkSt)this.reg.env.initStates=init.lastDatas.tkSt
if(!SRC.isNewSrcUri(this.reg.env.longDesc.srcUri)){await this.fetchContent()}return this._buildHome(init,this.reg.env.itemType,this.shadowRoot)}async fetchContent(){if(!this.reg.env.taskContent)this.reg.env.taskContent=DOM.parseDomValid(await WSP.fetchStreamText(this.wsp,this.reg.env.uiRoot,SRC.srcRef(this.reg.env.longDesc)))}async _buildHome(init,itemType,parentElt){const dataViews=itemType.datas.taskViews
const longDesc=this.reg.env.longDesc
this.reg.env.taskEditBroker=new InfoBrokerBasic
let userNames
let view
findView:for(const v of dataViews){if(v.ifLifeCycleState&&!v.ifLifeCycleState.test(longDesc.lcSt))continue findView
if(v.ifPerm&&!this.reg.hasPerm(v.ifPerm))continue findView
if(v.ifInvolvement>0){if(!longDesc.rspUsrs)continue findView
if(!userNames)userNames=await this.reg.env.universe.auth.fetchFlattenedGroups()
let found
for(const r of longDesc.rspUsrs){if(userNames.indexOf(r.usr)>=0&&(TASK.findInvolvementForResps(itemType,r.resp,longDesc)&v.ifInvolvement)>0){found=true
break}}if(!found)continue findView}if(v.ifInApp){const app=DOMSH.findLogicalFlatParentOrSelf(this.reg.env.uiRoot,null,isApp)
if(!app||!v.ifInApp.test(app.localName))continue findView}if(v.customSelector&&!v.customSelector(this.reg,init.viewOptions))continue findView
view=v
break findView}if(!view)throw Error("No view found for task: "+longDesc.srcUri)
const widget=await this.buildSrcView(view.viewDef)
if(!this.subViews)this.subViews=[widget]
else this.subViews.push(widget)
parentElt.appendChild(widget)
if(this.reg.env.initStates){this.reg.env.taskEditBroker.dispatchInfo(new InfoChangeTask({reg:this.reg,fieldName:"init"}),this)}}async onWspUriChange(msg,from){if(msg.type===EWspChangesEvts.lcSt)return
const longDesc=this.reg.env.longDesc
if(SRC.srcRef(longDesc)===SRC.srcRef(msg)){const ldNew=await this.reg.env.wsp.fetchLongDesc(SRC.srcRef(msg),this)
if(!this.isConnected)return
this.reg.env.longDesc=ldNew
this.reg.env.taskContent=null
this.shortDescs[0]=ldNew
this.reg.env.longDescChange.emit(ldNew,longDesc)}}onViewBeforeHide(close){if(close){const editBroker=this.reg.env.taskEditBroker
if(editBroker){const st=new InfoReqStateTask
editBroker.dispatchInfo(st,this)
return!st.isDirty}}return true}async onViewWaitForHide(close){if(close){const editBroker=this.reg.env.taskEditBroker
if(editBroker){const st=new InfoReqStateTask
editBroker.dispatchInfo(st,this)
if(st.isDirty){if(SRC.isNewSrcUri(this.reg.env.longDesc.srcUri)){return await POPUP.confirm("Voulez-vous vraiment abandonner cette tâche en création ?",this,{okLbl:"Abandonner la création"})}else{return await POPUP.confirm("Cette tâche est en cours d\'édition, voulez-vous vraiment abandonner vos modifications ?",this,{okLbl:"Abandonner les modifications"})}}return true}}return true}buildLastDatas(parentLastDatas){const editBroker=this.reg.env.taskEditBroker
if(editBroker){const st=new InfoReqStateTask
st.states={}
editBroker.dispatchInfo(st,this)
if(st.isDirty)parentLastDatas.tkSt=st.states}}}REG.reg.registerSkin("wsp-taskmain",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n`)
customElements.define("wsp-taskmain",TaskMain)
REG.reg.registerSkin("itemMain/c-tabs",1,`\n\t[hidden] {\n\t\tdisplay: none !important;\n\t}\n\n\t#tabs {\n\t\tjustify-content: center;\n\t\tpadding-top: .5em;\n\t}\n\n\tc-tab {\n\t\tfont-size: var(--label-size);\n\t}\n`)
REG.reg.registerSkin("itemMain/c-tab",1,`\n\t.label {\n\t\tflex: 0 1 auto;\n\t}\n`)
class ItemMainRename extends RenameSrc{async execute(ctx,ev){const newUris=await super.execute(ctx,ev)
if(newUris&&newUris.length>0&&ctx.infoBroker){setTimeout(()=>{ctx.infoBroker.dispatchInfo(new InfoFocusItem(newUris[0]),ctx)},300)}return newUris}}class ItemMainMove extends MoveToSrc{async execute(ctx,ev){const newUris=await super.execute(ctx,ev)
if(newUris&&ctx.infoBroker){setTimeout(()=>{ctx.infoBroker.dispatchInfo(new InfoFocusItem(newUris[0]),ctx)},300)}return newUris}}class ItemMainConverters extends ActionMenu{constructor(converters){super("converters")
this._label="Convertir..."
this._group="edit"
this._actions=converters
this._visPerms="write.node.convert"}}export async function convertBySwitchTag(ctx,props){const env=ctx.reg.env
const house=await env.place.getHouse(env.wsp,SRC.srcRef(env.longDesc))
if(house&&isHouseUpdatable(ctx,house)){const doc=house.getDocumentForSave()
const oldElt=doc.documentElement.firstElementChild
const newElt=doc.createElementNS(props.tagNs,props.tagName)
while(oldElt.hasChildNodes())newElt.appendChild(oldElt.firstChild)
oldElt.replaceWith(newElt)
return saveDoc(ctx,house,doc,props.cleanupSchemaItModel)}}export async function convertByXsl(ctx,props){var _a
const env=ctx.reg.env
if(!(props.xsl instanceof XSLTProcessor)){const dom=props.xsl?DOM.parseDom(props.xsl,env.resolver):await ctx.reg.env.itemType.resolvePath(props.xslPath).fetchDom()
if(dom.documentElement.firstElementChild.nodeName==="xsl:output"){DOM.setAttr(dom.documentElement.firstElementChild,"indent","no")}props.xsl=new XSLTProcessor
props.xsl.importStylesheet(dom)}if(props.xsl instanceof XSLTProcessor)(_a=props.xslParams)===null||_a===void 0?void 0:_a.forEach(entry=>props.xsl.setParameter("",entry.name,entry.value))
const house=await env.place.getHouse(env.wsp,SRC.srcRef(env.longDesc))
if(house&&isHouseUpdatable(ctx,house)){if(props.cleanupSchemaItModel){const itemType=env.wsp.wspMetaUi.getItemType(props.cleanupSchemaItModel)
if(itemType)props.xsl.setParameter("","targetTagName",itemType.getTagRoot())}return saveDoc(ctx,house,DOM.cleanupDom(props.xsl.transformToDocument(house.getDocumentForSave()),true,false,false),props.cleanupSchemaItModel)}}function isHouseUpdatable(ctx,house){if(house.lockedBy){POPUP.showNotifForbidden("Cet item est en cours d\'édition, conversion impossible.",ctx.reg.env.uiRoot)
return false}return true}async function saveDoc(ctx,house,doc,cleanupSchemaItModel,resRef){var _a
const wasDirty=house.isDirty
try{house.setDirty(false)
const env=ctx.reg.env
if(cleanupSchemaItModel){const targetSchema=await((_a=env.wsp.wspMetaUi.getItemType(cleanupSchemaItModel))===null||_a===void 0?void 0:_a.getSchema())
if(targetSchema){targetSchema.bindToDom(doc).correctDocument({autoMutate:true,autoComplete:true,autoCleanup:true,autoNormXml:true,autoNormChars:true})
targetSchema.fixDocForExport(doc)}}const qs=IO.qs("cdaction","PutSrc","param",env.wsp.code,"refUri",resRef||SRC.srcRef(env.longDesc))
await env.wsp.wspServer.config.wspSrcUrl.fetchVoid(qs,{method:"PUT",body:DOM.ser(doc,true)})}finally{if(wasDirty)house.setDirty(true)}}function addToBurger(action,sortKey){REG.reg.addToList("actions:item:burger",action.getId(),1,action,sortKey)}addToBurger(new ItemMainRename,10)
addToBurger(new ItemMainMove,20)
addToBurger(new ReloadSrc)
addToBurger(new ExportScar,1010)
REG.reg.addToList("actions:item:burger","focusItem",1,null)
if(Desk.electron){const openWidthLOAction=(new Action).setLabel("Ouvrir avec LibreOffice").setVisible(ctx=>{const{env:env}=ctx.reg
return env.itemType.matchType("application/vnd.oasis.opendocument.text")===100||env.itemType.matchType("application/vnd.oasis.opendocument.spreadsheet")===100||env.itemType.matchType("application/vnd.oasis.opendocument.graphics")===100||env.itemType.matchType("application/vnd.oasis.opendocument.presentation")===100||env.itemType.matchType("application/vnd.oasis.opendocument.formula")===100}).setExecute(async ctx=>{const{env:env}=ctx.reg
const url=`${env.wsp.wspServer.config.wspDavUrl}${env.wsp.code}${env.itemType.getMainStreamSrcUri(env.longDesc)}`.replace("/web/","/api/")
const openReply=await IO.sendMessage({type:"client:modules:odEditor:open",url:encodeURI(url)})
if(openReply.type=="error")ERROR.log(openReply.msg)
else if(openReply.type==="notFound")POPUP.showNotifInfo("L\'éditeur de document \'OpenDocument\' (LibreOffice, ...) n\'a pu être trouvé.",env.uiRoot)})
addToBurger(openWidthLOAction)}export function installSrcViewFileDrop(reg,srcView,callback){reg.installSkin("srcview/filedrop",srcView.shadowRoot)
const{env:env}=reg
const dropLayer=JSX.createElement("div",{class:"fileDropLayer"},"Importez le fichier en le déposant ici.")
srcView.addEventListener("dragenter",(function(ev){const item=ev.dataTransfer.items[0]
if(item&&item.kind=="file"&&env.itemType.matchType(item.type)>1){this.shadowRoot.appendChild(dropLayer)}}))
srcView.addEventListener("dragover",(function(ev){if(dropLayer.isConnected){ev.preventDefault()
ev.stopPropagation()}}))
srcView.addEventListener("dragleave",(function(){if(dropLayer.isConnected)this.shadowRoot.removeChild(dropLayer)}))
srcView.addEventListener("drop",(async function(ev){this.shadowRoot.removeChild(dropLayer)
const item=ev.dataTransfer.items[0]
if(callback){callback(item)}else{const progress=POPUP.showProgress(srcView,"Import en cours...")
try{await ITEM.update(env.wsp,env.uiRoot,SRC.srcRef(env.longDesc),item.getAsFile(),progress.progressCallback)
progress.close()}catch(e){progress.close()
await ERROR.report("Une erreur est survenue lors de l\'import de la ressource.",e,reg)}}}))}REG.reg.registerSkin("srcview/filedrop",1,`\n\t:host {\n\t\tposition: relative;\n\t}\n\n\t.fileDropLayer {\n\t\tposition: absolute;\n\t\tdisplay: flex;\n\t\tjustify-content: center;\n\t\talign-items: center;\n\t\tfont-size: 2em;\n\t\ttop: 0;\n\t\tbottom: 0;\n\t\tleft: 0;\n\t\tright: 0;\n\t\tbackground-color: rgba(255, 255, 255, 0.6);\n\t}\n`)

//# sourceMappingURL=itemMain.js.map