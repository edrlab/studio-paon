import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{BaseAreaView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{EWspChangesEvts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{InfoCurrentItem,InfoHighlighItemSgn,InfoReqCurrentItem,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SRCDRAWER,SrcPointer,SrcPointerDblClick,SrcPointerFastSelect,SrcPointerSetterAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcDrawer.js"
import{ActionBtn,Button,ButtonToggle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{ACTION,Action,ActionSeparator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{EFolderState,GridColTreeDef,GridDataHolderJsonTree,GridDataRowJsonTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{CellBuilderSrcIconCode,redrawSrcLine}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcGridColumns.js"
export class NetItems extends BaseAreaView{constructor(){super(...arguments)
this.dataHolder=new NetItemsDataHolder(this)
this.shortDescs=[]}get ctxMenuActions(){return{actions:this.actions,actionContext:this,rect:this._grid.getSelRect()}}get emitter(){return this._grid}setRootSrcRef(srcRef){var _a
if(this.netState.root==srcRef&&this.initialized)return
this.netState=Object.assign({},this.netState)
this.netState.root=srcRef
if(srcRef){const idx=this.histo.findIndex(v=>v.root===srcRef)
if(idx>=0)this.histo.splice(idx,1)
this.histo.unshift(this.netState)
if(this.histo.length>12)this.histo.length=12}(_a=this._rootSrc)===null||_a===void 0?void 0:_a.setSrcRef(srcRef)
this.dataHolder.rebuildFromRoot(true)}getRootSrcRef(){return this.netState.root}getRootSrcUri(){return null}setNetConf(conf){this.netState.conf=conf
if(conf.dir)this.netState.dir=undefined
this.refresh()
this.dataHolder.rebuildFromRoot(true)}getNetConf(){return this.netState.conf}setDir(dir){if(this.netState.conf.dir)return
this.netState.dir=dir==="asc"?"asc":"desc"
this.refresh()
this.dataHolder.rebuildFromRoot(true)}getDir(){return this.netState.conf.dir||this.netState.dir||"desc"}async ensureRowVisible(srcUri){}_initialize(init){var _a,_b
super._initialize(init)
this.wsp=this.reg.env.wsp
this.infoBroker=init.infoBroker
this.itemHandlingReact=init.itemHandlingReact
this.confs=init.confs&&init.confs.length>0?init.confs:[{}]
const fixedConf=this.confs.length<2?this.confs[0]:null
if(((_a=this.confs)===null||_a===void 0?void 0:_a.length)>=2&&!this.confs.find(entry=>entry.code===NetItems.CONF_ALL_CODE))this.confs.unshift({code:NetItems.CONF_ALL_CODE,label:"Aucun filtre"})
if((_b=init.lastDatas)===null||_b===void 0?void 0:_b.histo){const histo=init.lastDatas.histo
if(histo.length>0){const buildState=ld=>{const conf=fixedConf||(typeof ld.conf==="string"?this.confs.find(c=>c.code===ld.conf)||this.confs[0]:ld.conf)
return{root:ld.root,conf:conf,dir:conf.dir?undefined:ld.dir}}
this.netState=buildState(histo[0])
this.histo=[]
for(let i=1;i<histo.length;i++)this.histo.push(buildState(histo[i]))}}if(!this.netState)this.netState={conf:fixedConf||this.confs[0]}
if(!this.histo)this.histo=[]
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.reg.installSkin("scroll/small",sr)
const headBar=sr.appendChild(JSX.createElement("div",{id:"headBar"}))
if(!init.hidePtrItemFrom){this._histoBtn=JSX.createElement(Button,{title:"Historique des dernières racines sélectionnées","î":{reg:this.reg,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/netItems/histo.svg"},onclick:this.onClickHisto})
this._rootSrc=(new SrcPointer).initialize({reg:this.reg,draggable:true,dropable:true,tpl:SRCDRAWER.itemCodeAloneTpl,tplOver:SRCDRAWER.detailsPreviewTpl,place:this.reg.env.place,defaultAction:this.reg.getSvc("ptrItemDblClick",SrcPointerDblClick.SINGLETON)})
this._rootSrc.classList.add("fixedIconSize")
this._rootSrc.onSrcRefChange.add(drawer=>{this.setRootSrcRef(drawer.srcRefSub)})
headBar.appendChild(JSX.createElement("div",{id:"rootSel"},this._rootSrc,this._histoBtn))}if(!fixedConf||!fixedConf.dir){this._dirDescBtn=JSX.createElement(ButtonToggle,{title:"Réseau descendant","î":{reg:this.reg,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/netItems/descBtn.svg"},onclick:this.onDescBtn})
this._dirAscBtn=JSX.createElement(ButtonToggle,{title:"Réseau ascendant","î":{reg:this.reg,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/netItems/ascBtn.svg"},onclick:this.onAscBtn})}if(!fixedConf){this._confsSelect=JSX.createElement("select",null)
for(const conf of this.confs){this._confsSelect.appendChild(JSX.createElement("option",{label:conf.label,selected:conf===this.netState.conf?"":undefined}))}this._confsSelect.onchange=this.onSelectConf}if(!fixedConf||fixedConf.dir!=="desc"){this._refreshBtn=JSX.createElement(Button,{title:"Rafraîchir","î":{reg:this.reg,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/refresh.svg"},onclick:this.onRefresh})}headBar.appendChild(JSX.createElement("div",{id:"options"},this._dirDescBtn,this._dirAscBtn,this._confsSelect,this._refreshBtn))
const colDefs=[init.primaryCol||new GridColTreeDef("srcTree").setDefaultSort(1,"ascendant").setFlex("1rem",1,1).setMinWidth("55px").setSortable(true).setCellBuilder(new CellBuilderNet(this.reg,this.wsp.wspMetaUi,false,this.wsp.srcUriItemsSortFn).setNetItems(this))]
if(init.secondaryCols)colDefs.push(...init.secondaryCols)
this._grid=sr.appendChild(JSX.createElement("c-grid",{"î":{selType:"multi",reg:this.reg,columnDefs:colDefs,dataHolder:this.dataHolder,hideHeaders:true,noResizableCol:true,autoSelOnFocus:"first",skinScroll:"scroll/small",defaultAction:init.defaultAction,defaultActionCtx:this,lineDrawer:this}}))
if(init.secondaryCols)DOM.setAttrBool(this._grid,"data-has-secondary-cols",true)
this.reg.installSkin("wsp-src-grid",this._grid.shadowRoot)
this._grid.addEventListener("grid-select",(function(ev){const netItems=DOMSH.findHost(this)
const sel=netItems.dataHolder.getSelectedDatas()
netItems.shortDescs=Array.from(sel.reduce((set,node)=>{if(node.src)set.add(node.src)
return set},new Set))
if(this.matches(":focus"))this.dispatchEvent(new CustomEvent("c-focus-actions",{detail:netItems,bubbles:true,composed:true}))}))
this._grid.addEventListener("focus",(function(ev){this.dispatchEvent(new CustomEvent("c-focus-actions",{detail:DOMSH.findHost(this),bubbles:true,composed:true}))}))
if(init.accelKeyMgr){this.accelKeyMgr=init.accelKeyMgr
this._grid.addEventListener("keydown",ev=>{this.accelKeyMgr.handleKeyboardEvent(ev,this)})}let actions=init.actions
if(actions){actions=ACTION.injectSepByGroup(actions,this.reg.getPref("groupOrder.wsp.shortDesc",""),this)
this.actions=actions
this.focusActionables=ActionBtn.buildButtons(actions,this,"bar")}if(init.itemHandlingReact){const req=new InfoReqCurrentItem
init.itemHandlingReact.dispatchInfo(req,this)
if(req.srcUri)this._setCurrentItem(req.srcUri)}this._grid.linesNode.setAttribute("draggable","true")
this._grid.linesNode.addEventListener("dragstart",(function(ev){const itemNets=DOMSH.findHost(DOMSH.findHost(this))
if(itemNets.shortDescs.length>0)ITEM.setShortDescTransferToDragSession(itemNets,ev,"build")
else ev.preventDefault()}))
this._grid.linesNode.addEventListener("dragend",ITEM.resetShortDescTransferToDragSession)
this.setRootSrcRef(this.netState.root)}_refresh(){if(this._dirAscBtn){if(this.netState.conf.dir){DOM.setHidden(this._dirAscBtn,true)
DOM.setHidden(this._dirDescBtn,true)}else{DOM.setHidden(this._dirAscBtn,false)
DOM.setHidden(this._dirDescBtn,false)
const dir=this.getDir()
this._dirAscBtn.toggleOn=dir==="asc"
this._dirDescBtn.toggleOn=dir==="desc"}}const skin=this.getDir()==="asc"?this._ascSkin||(this._ascSkin=this.reg.createSkin("wsp-net-items/grid/asc")):this._descSkin||(this._descSkin=this.reg.createSkin("wsp-net-items/grid/desc"))
if(this._activeSkin!==skin){if(this._activeSkin)this._grid.shadowRoot.replaceChild(skin,this._activeSkin)
else this._grid.shadowRoot.insertBefore(skin,this._grid.scrollNode)
this._activeSkin=skin}}setHighlightSgn(sgnPattern,assigned){this._highlightSgn=sgnPattern
this._assigned=assigned
this._grid.invalidateRows()}redrawLine(row,line){const src=row.rowKey.src
if(src===null){line.classList.toggle("info",true)}else{line.classList.toggle("info",false)
redrawSrcLine(this.wsp,row.rowKey.src,line,this._currentSrcUri,this._highlightSgn,this._assigned)}}_setCurrentItem(srcUri){this._currentSrcUri=srcUri
this._grid.invalidateRows()
if(this._currentSrcUri)this.ensureRowVisible(this._currentSrcUri)}buildLastDatas(parentLastDatas){const lastDatasKey=this.getAttribute("last-datas")
if(lastDatasKey){const ld={histo:[]}
if(this.netState.root)ld.histo.push({root:this.netState.root,dir:this.netState.dir,conf:this.netState.conf.code||this.netState.conf})
if(this.histo)for(const h of this.histo){ld.histo.push({root:h.root,dir:h.dir,conf:h.conf.code||h.conf})}if(ld.histo.length>0)parentLastDatas[lastDatasKey]=ld}}onInfo(info){if(info instanceof InfoCurrentItem){this._setCurrentItem(info.srcUri)}else if(info instanceof InfoHighlighItemSgn){this.setHighlightSgn(info.sgnPattern,info.assigned)}}onViewShown(){if(this.itemHandlingReact){this.itemHandlingReact.addConsumer(this)
const req=new InfoReqCurrentItem
this.itemHandlingReact.dispatchInfo(req,this)
this._setCurrentItem(req.srcUri)
if(!this._onConnRenewed&&!this.netState.root){if(req.srcUri)this._rootSrc.setSrcRef(req.srcUri,req.shortDesc)}}if(!this._onConnRenewed){this._onConnRenewed=this.onConnRenewed.bind(this)
this.reg.env.place.eventsMgr.on("onConnectionRenewed",this._onConnRenewed)
this._wspUriChange=this.onWspUriChange.bind(this)
this.reg.env.place.eventsMgr.on("wspUriChange",this._wspUriChange)}}onViewHidden(closed){if(this.itemHandlingReact)this.itemHandlingReact.removeConsumer(this)
if(closed){this.reg.env.place.eventsMgr.removeListener("onConnectionRenewed",this._onConnRenewed)
this.reg.env.place.eventsMgr.removeListener("wspUriChange",this._wspUriChange)}}onWspUriChange(msg,from){if(msg.wspCd===this.wsp.code)this.dataHolder.refreshSrc(msg,msg.type===EWspChangesEvts.s)}async onConnRenewed(){this.dataHolder.rebuildFromRoot(true,true)}async onClickHisto(ev){const target=ev.target
const actions=[]
const netItems=DOMSH.findHost(this)
if(netItems.histo.length>0){const uris=[]
const curr=netItems._rootSrc.srcRefSub
for(let h of netItems.histo)if(h.root&&h.root!==curr)uris.push(h.root)
const srcs=await WSP.fetchShortDescs(netItems.wsp,netItems,...uris)
for(const src of srcs){if(src&&src.srcSt>0&&src.itModel!=null)actions.push(new SrcPointerSetterAction(src))}}if(actions.length===0)actions.push(new Action("none").setEnabled(false).setLabel("Historique vide"))
else actions.reverse()
actions.push(new ActionSeparator,new SrcPointerFastSelect("selOther").setLabel("Autre item..."))
POPUP.showPopupActionsFromEvent({reg:netItems.reg,actions:actions,actionContext:netItems._rootSrc},ev,target)}onDescBtn(ev){DOMSH.findHost(this).setDir("desc")}onAscBtn(ev){DOMSH.findHost(this).setDir("asc")}onRefresh(ev){DOMSH.findHost(this).dataHolder.rebuildFromRoot(true,true)}onSelectConf(){const netItems=DOMSH.findHost(this)
netItems.setNetConf(netItems.confs[this.selectedIndex])}}NetItems.CONF_ALL_CODE="_all"
REG.reg.registerSkin("wsp-net-items",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t:focus-visible:not(c-grid) {\n\t\toutline: var(--focus-outline);\n\t}\n\n\t[hidden] {\n\t\tdisplay: none !important;\n\t}\n\n\t#headBar {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-wrap: wrap;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t\tpadding: .2em;\n\t}\n\n\t#rootSel,\n\t#options {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex: 1 0 auto;\n\t}\n\n\t#options {\n\t\tjustify-content: flex-end;\n\t}\n\n\twsp-src-pointer {\n\t\tflex: 0 1 auto;\n\t\tmargin: 0;\n\t}\n\n\tselect {\n\t\tborder: 1px solid var(--border-color);\n\t\tmargin-inline: 2px;\n\t\tbackground-color: unset;\n\t\tcolor: var(--color);\n\t\tfont-size: inherit;\n\t}\n\n\tc-grid {\n\t\tflex: 1;\n\t\tborder: none;\n\t\tbackground-color: var(--row-bgcolor);\n\t}\n`)
REG.reg.registerSkin("wsp-net-items/grid/desc",1,`\n\tx-twisty {\n\t\tpadding-inline-start: 1.5em !important;\n\t}\n\n\tx-twisty.opened {\n\t\tbackground: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/netItems/descTwistyOpened.svg) no-repeat center / 1.5em !important;\n\t}\n\n\tx-twisty.closed {\n\t\tbackground: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/netItems/descTwistyClosed.svg) no-repeat center / 1.5em !important;\n\t}\n\n\tx-twisty.subItem.opened {\n\t\tbackground: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/netItems/subItemTwistyOpened.svg) no-repeat center / 1.5em !important;\n\t}\n\n\tx-twisty.subItem.closed {\n\t\tbackground: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/netItems/subItemTwistyClosed.svg) no-repeat center / 1.5em !important;\n\t}\n\n\t.info > * > x-twisty {\n\t\tvisibility: hidden;\n\t}\n\n\t.info {\n\t\tcolor: var(--fade-color);\n\t\tfont-style: italic;\n\t\tmargin-inline-start: -1em;\n\t}\n\n\t/** Réservation de la largeur de background-image pour qu'il n'y ait pas de superposition avec les secondary-cols */\n\t:host([data-has-secondary-cols]) .line {\n\t\tpadding-inline-end: .8rem;\n\t}\n\n\t.space {\n\t\tcolor: var(--alt1-color);\n\t\tfont-style: italic;\n\t\tmargin-inline-start: .3em;\n\t}\n`)
REG.reg.registerSkin("wsp-net-items/grid/asc",1,`\n\tx-twisty {\n\t\tpadding-inline-start: 1.5em !important;\n\t}\n\n\tx-twisty.opened {\n\t\tbackground: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/netItems/ascTwistyOpened.svg) no-repeat center / 1.5em !important;\n\t}\n\n\tx-twisty.closed {\n\t\tbackground: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/netItems/ascTwistyClosed.svg) no-repeat center / 1.5em !important;\n\t}\n\n\t.info > * > x-twisty {\n\t\tvisibility: hidden;\n\t}\n\n\t.info {\n\t\tcolor: var(--fade-color);\n\t\tfont-style: italic;\n\t\tmargin-inline-start: -1em;;\n\t}\n\n\t.space {\n\t\tcolor: var(--alt1-color);\n\t  font-style: italic;\n\t\tmargin-inline-start: .3em;\n\t}\n`)
customElements.define("wsp-net-items",NetItems)
class GridDataRowNetItems extends GridDataRowJsonTree{getData(key){const src=this.rowDatas.src
return src?src[key]:undefined}}class NetItemsDataHolder extends GridDataHolderJsonTree{constructor(netState){super("ch")
this.netState=netState
this._srcUsed=new Set
this.setDefaultOpenState(node=>node.subItem!=null)}newDataRow(){return new GridDataRowNetItems(this,null)}async openFolderAsync(rowKey){if(this.ch(rowKey)===null){const srcRef=ITEM.srcRefSub(rowKey.src)
this.setFolderSt(rowKey,EFolderState.opening)
const wsp=this.netState.wsp
const conf=this.netState.getNetConf()
const itemNet=await ITEM.fetchSrcNetJson(wsp,this.netState,srcRef,this.fieldsLnks,this.netState.getDir(),true,conf.linksAllowed,conf.itemTargeted,100,1,this.fieldsFrom)
if(!this.isRowkeyAlive(rowKey))return false
const newNode={src:itemNet.src,ch:null}
this.fillNodesFromItemNetResp(itemNet,newNode)
this.setFolderSt(rowKey,EFolderState.closed)
if(this.replaceRowKey(rowKey,newNode,false))return super.openFolder(newNode)
return false}return this.openFolder(rowKey)}async rebuildFromRoot(clearCaches,preserveOpenStates){if(clearCaches)this.clearCaches()
let oldTree=preserveOpenStates?this.root:null
this.setDatas([])
const srcRef=this.netState.getRootSrcRef()
if(!srcRef)return
const wsp=this.netState.wsp
const conf=this.netState.getNetConf()
this.fieldsLnks=wsp.getShortDescFields()
const dir=this.netState.getDir()
this.fieldsFrom=dir==="desc"&&(conf.fromSubItems==="flat"||conf.fromSubItems==="unfolded")?this.fieldsLnks.concat("itSubItems"):undefined
const itemNet=await ITEM.fetchSrcNetJson(wsp,this.netState,srcRef,this.fieldsLnks,dir,true,conf.linksAllowed,conf.itemTargeted,100,1,this.fieldsFrom)
if(srcRef!==this.netState.getRootSrcRef())return
this.root={src:itemNet.src,ch:null}
this._srcUsed.add(SRC.srcRef(itemNet.src))
this.fillNodesFromItemNetResp(itemNet,this.root)
this.setDatas(this.root.ch||[])
if(oldTree){const openNodes=async(oldNode,newNode)=>{if(newNode.ch==null)return
for(let oldN of oldNode.ch){if(!oldN.src||this.folderSt(oldN)!==EFolderState.opened)continue
const oldRef=SRC.srcRef(oldN.src)
for(let newN of newNode.ch){if(SRC.srcRef(newN.src)===oldRef){await this.openFolderAsync(newN)
newN=newNode.ch.find(n=>n.src&&SRC.srcRef(n.src)===oldRef)
await openNodes(oldN,newN)
break}}}}
await openNodes(oldTree,this.root)}}refreshSrc(ident,stOnly){if(!this.root)return
const srcRef=SRC.srcRef(ident)
if(!this._srcUsed.has(srcRef))return
const scanNode=node=>{if(node.src&&SRC.srcRef(node.src)===srcRef){if(node.ch===null){this.refreshSrcNode(node)}else if(this.netState.getDir()==="asc"||stOnly){this.refreshSrcNode(node)
for(const ch of node.ch)scanNode(ch)}else{if(node===this.root){this.rebuildFromRoot(true,true)}else if(this.folderSt(node)===EFolderState.opened){this.closeFolder(node)
this.openFolderAsync(node)}else{this.setCh(node,null)
this.setFolderSt(node,EFolderState.closed)
this.refreshSrcNode(node)}return}}if(node.ch)for(const ch of node.ch)scanNode(ch)}
scanNode(this.root)}async refreshSrcNode(node){var _a
const fields=await WSP.fetchSrc(this.netState.wsp,this.netState,ITEM.srcRefSub(node.src),this.fieldsFrom||this.fieldsLnks)
if(!this.isRowkeyAlive(node))return
node.src=fields
this.resetRowCache(node);(_a=this.grid)===null||_a===void 0?void 0:_a.invalidateRows(this.getOffset(node))}fillNodesFromItemNetResp(resp,toFill){toFill.net=resp
switch(this.netState.getDir()!=="desc"?"folded":this.netState.getNetConf().fromSubItems||"folded"){case"folded":toFill.lnks=resp.lnks.length>0?resp.lnks:undefined
break
case"flat":for(const lnk of resp.lnks){const subItem=ITEM.findSubItem(lnk.subIt,resp.src.itSubItems)
if(!subItem){if(!toFill.lnks)toFill.lnks=[]
toFill.lnks.push(lnk)}else{if(!toFill.subNodes)toFill.subNodes=new Map
let subNetNode=toFill.subNodes.get(lnk.subIt)
if(!subNetNode){subNetNode={src:resp.src,subItem:subItem,lnks:[],ch:null}
toFill.subNodes.set(lnk.subIt,subNetNode)}subNetNode.lnks.push(lnk)}}break
case"unfolded":for(const lnk of resp.lnks){const subItems=ITEM.findSubItemStack(lnk.subIt,resp.src.itSubItems)
if(!subItems){if(!toFill.lnks)toFill.lnks=[]
toFill.lnks.push(lnk)}else{let curr=toFill
for(let i=0;i<subItems.length;i++){const subIt=subItems[i]
if(!curr.subNodes)curr.subNodes=new Map
let subNetNode=curr.subNodes.get(subIt.id)
if(!subNetNode){subNetNode={src:resp.src,subItem:subIt,ch:null}
curr.subNodes.set(subIt.id,subNetNode)}if(i==subItems.length-1)(subNetNode.lnks||(subNetNode.lnks=[])).push(lnk)
curr=subNetNode}}}break}const buildCh=node=>{node.ch=[]
if(node.subNodes)for(const subN of node.subNodes.values()){node.ch.push(subN)
buildCh(subN)}if(node.lnks)for(const lnk of node.lnks){node.ch.push({src:lnk.src,ch:null})
this._srcUsed.add(SRC.srcRef(lnk.src))}}
buildCh(toFill)
if(toFill.ch.length===0){toFill.ch.push({src:null,ch:undefined})}}clearCaches(){this._srcUsed.clear()}}class CellBuilderNet extends CellBuilderSrcIconCode{setNetItems(netItems){this.netItems=netItems
return this}redrawCell(row,root){root._srcFields=row.rowDatas.src
let span=root.firstElementChild
if(!span)span=this._buildContent(row,root)
this.redrawIcon(row,span)
span=span.nextElementSibling
DOM.setTextContent(span,this._getValue(row))
span=span.nextElementSibling
DOM.setTextContent(span,this._getSpace(row))
DOM.setAttr(root,"title",this._getDescription(row)||undefined)
const isSubItem=row.rowDatas.subItem!=null
DOM.setHidden(root.firstElementChild,isSubItem)
root.previousElementSibling.classList.toggle("subItem",isSubItem)}_buildContent(row,root){const iconSpan=super._buildContent(row,root)
root.appendChild(document.createElement("span"))
const space=root.appendChild(document.createElement("span"))
space.classList.add("space")
return iconSpan}_getValue(row){const node=row.rowDatas
if(node.subItem)return node.subItem.ti
if(node.src===null)return this.netItems.getDir()==="asc"?"Aucun item référençant":"Aucun item référencé"
return row.cacheHolder["code"]||(row.cacheHolder["code"]=this.srcRdr.getMainName(node.src,this.wspMetaUi))}_getIcon(row){const node=row.rowDatas
if(node.subItem||node.src===null)return null
return row.cacheHolder["icon"]||(row.cacheHolder["icon"]=this.srcRdr.getIcon(node.src,this.wspMetaUi))}_getSpace(row){const node=row.rowDatas
if(node.subItem||node.src===null)return null
const sp=ITEM.extractSpaceLabel(node.src.srcUri,null)
return row.cacheHolder["space"]||(row.cacheHolder["space"]=sp==null?null:`(${sp})`)}}
//# sourceMappingURL=netItems.js.map