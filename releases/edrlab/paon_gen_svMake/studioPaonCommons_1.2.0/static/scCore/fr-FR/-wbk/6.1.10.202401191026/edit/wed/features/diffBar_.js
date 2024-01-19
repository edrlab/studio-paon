import{Button,ButtonActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{findWedEditor,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{WedSearchBarNextPrev}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/searchBar.js"
export class WedDiffBar extends HTMLElement{constructor(){super()
this.id="diffBar"
this.hidden=true}init(editor){this.editor=editor
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
const reg=editor.reg
reg.installSkin(this.localName,sr)
this.diffActions=reg.getList("wed.diffBar.actions")
this.selector=(new ButtonActions).initialize({reg:reg,actions:this.diffActions,actionContext:this})
this.prevNextBtns=new WedSearchBarNextPrev
this.prevNextBtns.annotFilter=WEDLET.diffLib.isDiffAnnot
this.eraseBtn=JSX.createElement(Button,{title:"Effacer les différences",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/diff/erase.svg",onclick:this.onErase,disabled:true})
this.refreshBtn=JSX.createElement(Button,{title:"Rafraîchir les différences",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/refresh.svg",onclick:this.onRefetchDiff,disabled:true})
sr.appendChild(JSX.createElement("div",{id:"top"},JSX.createElement("div",{id:"head"},JSX.createElement("span",null,"Comparer avec"),this.selector,JSX.createElement("div",{id:"buttons"},this.prevNextBtns,this.eraseBtn,this.refreshBtn)),JSX.createElement("c-button",{icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/close.svg",title:"Fermer",onclick:this.onClose})))
this.rootPanels=sr.appendChild(JSX.createElement("div",{id:"panelCtn"}))
editor.wedMgr.listeners.on("shown",wedMgr=>{VIEWS.onViewShown(this.currentPanel)})
editor.wedMgr.listeners.on("hidden",(wedMgr,close)=>{VIEWS.onViewHidden(this.currentPanel,close)})
this.refresh()
return this}getDiffParams(){return!this.hidden&&this.currentPanel?this.currentPanel.buildDiffParams():null}async setDiffParams(params){var _a
if(!WEDLET.diffLib)await WEDLET.importDiffLib()
if(this.hidden){this.editor.barLayout.showBar(this)
this.hidden=false}if(((_a=this.currentPanel)===null||_a===void 0?void 0:_a.action.getId())!==params.diffId){const act=this.diffActions.find(a=>a.getId()===params.diffId)
if(!act)return
try{this.initParams=params
await act.execute(this)}finally{this.initParams=null}}else{this.currentPanel.setDiff(params)}}close(){this.hidden=true
this.editor.barLayout.onHideBar(this)
this.setCurrentPanel(null)}show(){this.hidden=false
this.editor.barLayout.showBar(this)
this.refresh()}setCurrentPanel(panel){if(panel&&panel.parentNode!==this.rootPanels){this.rootPanels.append(panel)
panel.hidden=true}const wedMgr=this.editor.wedMgr
for(let ch=this.rootPanels.firstElementChild;ch;ch=ch.nextElementSibling){if(DOM.setHidden(ch,ch!==panel)){if(ch!==panel){ch.unconnectDoc()
VIEWS.onViewHidden(ch,false)}else if(wedMgr.docHolderAsync)ch.connectDoc()
else this.editor.wedMgr.listeners.once("redrawAtEnd",()=>{ch.connectDoc()})}}this.selector.label=panel?panel.action.getLabel(this):""
this.currentPanel=panel
if(panel)VIEWS.onViewShown(panel)
this.dispatchDiffChange()}setDiffStates(st){switch(st){case"drawn":DOM.setAttrBool(this.eraseBtn,"disabled",false)
DOM.setAttrBool(this.refreshBtn,"disabled",false)
this.prevNextBtns.setDisabled(false)
break
case"computable":DOM.setAttrBool(this.eraseBtn,"disabled",true)
DOM.setAttrBool(this.refreshBtn,"disabled",false)
this.prevNextBtns.setDisabled(true)
break
case"notComputable":DOM.setAttrBool(this.eraseBtn,"disabled",true)
DOM.setAttrBool(this.refreshBtn,"disabled",true)
this.prevNextBtns.setDisabled(true)
break}}getSearchParams(){return!this.hidden&&this.currentPanel?this.currentPanel.buildDiffParams():null}dispatchDiffChange(){}getPanelFor(action){for(let ch=this.rootPanels.firstElementChild;ch;ch=ch.nextElementSibling){if(ch.action===action)return ch}return null}onErase(){var _a;(_a=DOMSH.findHost(this).currentPanel)===null||_a===void 0?void 0:_a.setDiff(null)}onRefetchDiff(){var _a;(_a=DOMSH.findHost(this).currentPanel)===null||_a===void 0?void 0:_a.execDiff(true)}onClose(){DOMSH.findHost(this).close()}refresh(){if(this.hidden)return
if(!this.currentPanel){if(this.diffActions){for(let action of this.diffActions){if(action.isAvailable(this)){action.execute(this)
break}}}}else{this.currentPanel.action.execute(this)}}}REG.reg.registerSkin("wed-diffbar",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tbackground-color: var(--bgcolor);\n\t\tfont-size: var(--label-size);\n\t}\n\n\t[hidden] {\n\t\tdisplay: none !important;\n\t}\n\n  #top {\n\t  display: flex;\n\t  min-height: 1.5em;\n  }\n\n  #head {\n\t  flex: 1;\n\t  display: flex;\n\t  flex-wrap: wrap;\n\t  align-items: center;\n\t  padding: 0 .3em;\n  }\n\n  #buttons {\n\t  display: flex;\n  }\n\n  c-button-actions {\n\t  flex: 1 1 auto;\n\t  padding: 0;\n\t  padding-inline-start: 1.2em;\n\t  background-position: left;\n\t  align-self: stretch;\n\t  justify-content: start;\n\t  font-weight: bold;\n  }\n\n  #panelCtn {\n\t  flex: 1;\n  }\n`)
customElements.define("wed-diffbar",WedDiffBar)
export class DiffPanelBase extends HTMLElement{_initPanel(action,bar){this.action=action
this.bar=bar
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.wedMgr=findWedEditor(bar).wedMgr
this.reg=this.wedMgr.reg
this.reg.installSkin(this.localName,sr)
this.result=JSX.createElement("span",{id:"result"})
this._needRefresh=this.needRefresh.bind(this)
this.docConnected=false}connectDoc(){this.wedMgr.listeners.on("hookEndTransac",this._needRefresh)
this.docConnected=true}unconnectDoc(){this.setDiff(null)
if(this.docConnected){this.wedMgr.listeners.removeListener("hookEndTransac",this._needRefresh)
this.wedMgr.docHolder.setDiffSession(null)
this.docConnected=false}}buildDiffParams(){return{diffId:this.action.getId()}}updateDiffResult(count){if(count==null){DOM.setTextContent(this.result,null)
this.bar.setDiffStates("notComputable")
return}switch(count){case"needRefresh":if(!this.result.firstElementChild){DOM.setTextContent(this.result,null)
this.result.appendChild(JSX.createElement("a",{onclick:this.onRefresh,href:""},"Rafraîchir"))}this.bar.setDiffStates("drawn")
break
case"computing":DOM.setTextContent(this.result,"Recherche en cours...")
this.bar.setDiffStates("notComputable")
break
case"error":DOM.setTextContent(this.result,"Recherche de différences impossible")
this.bar.setDiffStates("drawn")
break
case"notFound":DOM.setTextContent(this.result,"Autre source de comparaison indisponible")
this.bar.setDiffStates("drawn")
break
case"computable":DOM.setTextContent(this.result,null)
this.bar.setDiffStates("computable")
break
case 0:DOM.setTextContent(this.result,"➔ Aucune différence trouvée")
this.bar.setDiffStates("drawn")
break
case 1:DOM.setTextContent(this.result,"➔ 1 différence trouvée")
this.bar.setDiffStates("drawn")
break
default:DOM.setTextContent(this.result,`➔ ${count} différences trouvées`)
this.bar.setDiffStates("drawn")
break}}onRefresh(ev){ev.preventDefault()
const me=DOMSH.findHost(this)
me.execDiff()}needRefresh(){this.updateDiffResult("needRefresh")}}
//# sourceMappingURL=diffBar_.js.map