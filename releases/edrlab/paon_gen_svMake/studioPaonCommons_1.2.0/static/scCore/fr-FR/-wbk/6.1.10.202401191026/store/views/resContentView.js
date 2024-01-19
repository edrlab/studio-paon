import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{ResBodyView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/resViewer.js"
import{URLTREE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/urlTree.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{CellBuilderResTile}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/widgets/resGridColumns.js"
import{MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{RES}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/res.js"
import{FocusLiveRes}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/actions/depotActions.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{ResChildrenArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/areas/resViewAreas.js"
export class ResFrameView extends ResBodyView{_initialize(init){var _a
this.reg=init.reg||((_a=init.areaContext)===null||_a===void 0?void 0:_a.reg)
this.config=init
super._initialize(init)
this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.subPath=init.subPath
this.treeSrv=init.treeSrv||this.reg.env.universe.urlTree}draw(){this.initBarActions(this.config,this.shadowRoot)
this.shadowRoot.append(JSX.createElement("iframe",{src:this.treeSrv.urlFromPath(URLTREE.appendToPath(this.reg.env.nodeInfos.permaPath,this.subPath),"evenIfTrashed"),allowfullscreen:true}))}}REG.reg.registerSkin("store-res-frame",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\tiframe {\n\t\tflex: 1;\n\t\tbackground-color: #fff;\n\t\tborder: none;\n\t\tborder: 1px solid var(--border-color);\n\t\tmargin-bottom: .5em;\n\t}\n`)
customElements.define("store-res-frame",ResFrameView)
export class ResImgView extends ResFrameView{_initialize(init){super._initialize(init)
if(init.checkboard)DOM.addClass(this,"checkboard")}draw(){this.initBarActions(this.config,this.shadowRoot)
this.shadowRoot.append(JSX.createElement("img",{src:this.treeSrv.urlFromPath(URLTREE.appendToPath(this.reg.env.nodeInfos.permaPath,this.subPath),"evenIfTrashed"),allowfullscreen:true}))}}REG.reg.registerSkin("store-res-img",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tjustify-content: center;\n\t\tpadding: 1px;\n\t}\n\n\t#bodyActions {\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\timg {\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\tmax-width: max-content;\n\t\tmax-height: max-content;\n\t\tobject-fit: contain;\n\t\talign-self: center;\n\t\t/*background: white;*/\n\t}\n\n\t:host(.checkboard) > img {\n\t\tbackground: /*white*/ repeating-conic-gradient(#88888850 0% 25%, transparent 0% 50%) 50%/10px 10px;\n\t}\n`)
customElements.define("store-res-img",ResImgView)
export class ResAudioView extends ResFrameView{draw(){this.initBarActions(this.config,this.shadowRoot)
this.shadowRoot.append(JSX.createElement("audio",{src:this.treeSrv.urlFromPath(URLTREE.appendToPath(this.reg.env.nodeInfos.permaPath,this.subPath),"evenIfTrashed"),controls:true}))}}REG.reg.registerSkin("store-res-audio",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tjustify-content: center;\n\t\talign-items: center;\n\t\tpadding: 1px;\n\t\tmargin-top: 1em;\n\t}\n\n\t#bodyActions {\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n`)
customElements.define("store-res-audio",ResAudioView)
export class ResVideoView extends ResFrameView{draw(){this.initBarActions(this.config,this.shadowRoot)
this.shadowRoot.append(JSX.createElement("video",{src:this.treeSrv.urlFromPath(URLTREE.appendToPath(this.reg.env.nodeInfos.permaPath,this.subPath),"evenIfTrashed"),controls:true}))}}REG.reg.registerSkin("store-res-video",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tjustify-content: center;\n\t\tpadding: 1px;\n\t\tmargin-top: 1em;\n\t}\n\n\t#bodyActions {\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\tvideo {\n\t\tflex: 1;\n\t\talign-self: center;\n\t\toverflow: hidden;\n\t\tmax-width: 100%;\n\t}\n\n`)
customElements.define("store-res-video",ResVideoView)
export class ResChildrenView extends ResBodyView{_initialize(init){var _a
this.reg=init.reg||((_a=init.areaContext)===null||_a===void 0?void 0:_a.reg)
super._initialize(init)
this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
if(!init.max)init.max=1e3
this.config=init
this.nodeFilter=init.filter?`${encodeURIComponent(init.filter)}%26isResRoot%26!isQuery`:`isResRoot%26!isQuery`}draw(){const urlTreeSrv=this.reg.env.universe.adminUrlTree
const initGrid={reg:this.reg,skinOver:"store-res-tile",infoBroker:this.reg.env.infoBroker,columnDefs:[new GridColDef("tile").setFlex("auto",1,1).setCellBuilder(new CellBuilderResTile(this.reg))],selType:"monoClick",skinScroll:"scroll/large",hideHeaders:true,emptyBody:()=>(new MsgLabel).initialize({reg:this.reg,level:"info",label:"Dossier vide"})}
if(this.config.grid)Object.assign(initGrid,this.config.grid)
const grid=JSX.createElement("store-res-grid",{"î":initGrid})
grid.resGridDatas.setNaturalOrder((a,b)=>urlTreeSrv.naturalSortPathFn(a.permaPath,b.permaPath))
grid.setTilesAuto(12*parseFloat(getComputedStyle(this).fontSize),this.reg)
grid.addEventListener("grid-select",ev=>{const node=grid.dataHolder.getDataByOffset(grid.getSelectedRow())
if(node)(new FocusLiveRes).executeIfAvailable(grid,ev)})
urlTreeSrv.listChildren(this.reg.env.path,`&excludeAll&props=permaPath&childrenProps=${RES.NODEPROPS_short}&childrenFilter=${this.nodeFilter}&maxChildren=${this.config.max}`).then(parent=>{if(!parent||!parent.ch){grid.resGridDatas.setDatas([])}else{const parentPath=parent.permaPath
for(let ch of parent.ch){ch.permaPath=URLTREE.appendLeafToPath(parentPath,ch)}grid.resGridDatas.setDatas(parent.ch)
if(parent.moreCh)this.showSeeAllBtn()}})
const nodeInfosChange=this.reg.env.nodeInfosChange
if(nodeInfosChange){nodeInfosChange.on("childChange",async child=>{const props=await urlTreeSrv.nodeInfos(child.path,`&excludeAll&props=isHead*${RES.NODEPROPS_short}&matchFilter=${this.nodeFilter}`)
if(!props||props.matchFilter===false){grid.resGridDatas.removeByResPath(child.path,(props===null||props===void 0?void 0:props.isHead)||false)}else if(props.isHead){if(grid.resGridDatas.countRows()<this.config.max){grid.resGridDatas.refreshOrInsertNode(props,true)}else{const rowKey=grid.resGridDatas.findRowKeyByResPath(props.permaPath)
if(rowKey)grid.resGridDatas.refreshFields(rowKey,props)
this.showSeeAllBtn()}}})}this.initBarActions(this.config,this.shadowRoot)
this.shadowRoot.appendChild(grid)}showSeeAllBtn(){if(!this._seeAll&&this.config.area instanceof ResChildrenArea){const count=this.config.max
this._seeAll=(new Button).initialize({reg:this.reg,uiContext:"dialog",label:`Plus de ${count} éléments, tout afficher en liste...`})
this._seeAll.onclick=async()=>{const tag=await this.config.area.asResTreeArea().loadBody(this)
this.replaceWith(tag)
VIEWS.onViewHidden(tag)}
this.shadowRoot.appendChild(this._seeAll)}}}REG.reg.registerSkin("store-res-children",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t}\n\n\tstore-res-grid {\n\t\tflex: 1;\n\t\tborder: none;\n\t}\n\n\tc-bar-actions + store-res-grid {\n\t\tborder-top: 1px solid var(--border-color);\n\t}\n`)
customElements.define("store-res-children",ResChildrenView)

//# sourceMappingURL=resContentView.js.map