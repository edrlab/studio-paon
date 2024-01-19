import{BaseElement,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{ResViewerSingle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/resViewer.js"
import{AccelKeyMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{UtBrowser}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/utBrowser.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{InfoBrokerBasic}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/infos.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{FocusLiveRes}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/actions/depotActions.js"
import{InfoFocusRes}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/res.js"
import{URLTREE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/urlTree.js"
export class BrowseBoard extends BaseElement{_initialize(init){this.reg=REG.createSubReg(this.findReg(init))
this.infoBroker=this.reg.env.infoBroker=new BrowseBoardInfoBroker(this,init.infoBroker||this.reg.parentReg.env.infoBroker)
const widthDetector=matchMedia("(max-width: 640px)")
this.reg.registerSvc("storeResChildrenShowMode",1,()=>widthDetector.matches?"tree":"children")
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("webzone:panel",sr)
this._initAndInstallSkin(this.localName,init)
this.accelKeyMgr=new AccelKeyMgr
this.addEventListener("keydown",(function(ev){this.accelKeyMgr.handleKeyboardEvent(ev,this)}))
this.accelKeyMgr.initFromMapActions(this.reg.getListAsMap("accelkeys:BrowseBoard:global"))
const resViewerInit=BASIS.newInit(init.resViewer,this.reg)
resViewerInit.lastDatas=init.lastDatas
const resViewer=(new ResViewerSingle).initialize(resViewerInit)
this.reg.installSkin("webzone:page",resViewer.shadowRoot)
const utBrowserInit=BASIS.newInit(init.utBrowser,this.reg)
utBrowserInit.infoBroker=utBrowserInit.resHandlingReact=this.infoBroker
utBrowserInit.defaultAction=new FocusLiveRes
if(init.selMono)utBrowserInit.resHandlingMode="sel"
if(utBrowserInit.nodeFilter===undefined)utBrowserInit.nodeFilter=n=>!URLTREE.isQueryPath(n.n)
if(utBrowserInit.actions===undefined){this.fillDefaultActions()
utBrowserInit.actions=this.reg.mergeLists("actions:BrowseBoard:utBrowser","actions:store:resList")
if(!utBrowserInit.accelKeyMgr)utBrowserInit.accelKeyMgr=(new AccelKeyMgr).initFromMapActions(this.reg.mergeListsAsMap("accelkeys:BrowseBoard:utBrowser","accelkeys:store:resList"))}const utBrowser=(new UtBrowser).initialize(utBrowserInit)
const resizer=JSX.createElement("c-resizer",{"c-orient":"row"},JSX.createElement("c-collapser",{"c-orient":"row","panel-pos":"prev"}))
function switchWidth(ev){if(ev.matches){utBrowser.style.display="none"
resizer.style.display="none"}else{utBrowser.style.display=null
resizer.style.display=null}}switchWidth(widthDetector)
widthDetector.addEventListener("change",switchWidth)
utBrowser.setAttribute("c-resizable","")
sr.append(utBrowser,resizer,JSX.createElement("div",{id:"main","c-resizable":""},resViewer))}fillDefaultActions(){}setResPath(resPath){this.infoBroker.dispatchInfo(new InfoFocusRes(resPath),this)}onViewShown(){this.shown=true
VIEWS.onContainerShown(this)}onViewHidden(closed){this.shown=false
if(closed)this.infoBroker.close()
VIEWS.onContainerHidden(this,closed)}visitViews(visitor,options){if((options===null||options===void 0?void 0:options.visible)&&!this.shown)return
return VIEWS.visitDescendants(this.shadowRoot,visitor)}visitViewsAsync(visitor,options){if((options===null||options===void 0?void 0:options.visible)&&!this.shown)return
return VIEWS.visitDescendantsAsync(this.shadowRoot,visitor)}}REG.reg.registerSkin("store-browse-board",1,`\n\t:host {\n\t  flex: 1;\n\t  display: flex;\n\t  min-height: 0;\n\t  min-width: 0;\n\t  flex-direction: row;\n\t  padding: 5px;\n  }\n\n  [hidden] {\n\t  display: none;\n  }\n\n  store-ut-browser {\n\t  flex: 1 1 5em;\n\t  border: 1px solid var(--border-color);\n\t  border-radius: 7px;\n  }\n\n  c-resizer[c-orient=row] {\n\t  width: 10px;\n\t  background-color: transparent;\n  }\n\n  c-collapser {\n\t  background-color: var(--panel-bgcolor);\n  }\n\n  #main {\n\t  flex: 3 1 20em;\n\t  display: flex;\n\t  border: 1px solid var(--border-color);\n\t  border-radius: 7px;\n\t  overflow: hidden;\n  }\n\n  store-resviewer-single {\n\t  flex: 1;\n  }\n`)
customElements.define("store-browse-board",BrowseBoard)
class BrowseBoardInfoBroker extends InfoBrokerBasic{constructor(view,parent){super()
this.view=view
this.parent=parent
if(parent)parent.addConsumer(this)}dispatchInfo(info,from){super.dispatchInfo(info,from)
if(this.parent&&info.infoHolders.indexOf(this)<0){this.parent.dispatchInfo(info,this)}}close(){var _a;(_a=this.parent)===null||_a===void 0?void 0:_a.removeConsumer(this)}onInfo(info){if(this.view.shown)this.dispatchInfo(info,this)}}
//# sourceMappingURL=browseBoard.js.map