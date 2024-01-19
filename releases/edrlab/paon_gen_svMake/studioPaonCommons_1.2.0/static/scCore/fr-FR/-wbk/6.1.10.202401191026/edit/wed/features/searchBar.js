import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{Button,ButtonActions,ButtonToggle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{isSkSearchAnnot,SkCssSelectorSearch,SkSearchCommentAnnot,SkTextSearch,SkTextSearchInAtts,SkXPathSearch}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaSearch.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{EWedletEditMode,findWedEditor,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
export function AgSearchBarEditor(cls){const proto=cls.prototype
const superInit=proto.initialize
proto.initialize=function(config){superInit.call(this,config)
if(!config.hideSearchBar){this.searchBar=(new WedSearchBar).init(this,config)
this.wedMgr.accelKeyMgr.addAccelKey("f","accel",ToggleSearchBar.SINGLETON)
this.reg.addToList("actions:wed:commonbar:end","searchBar",1,ShowSearchBar.SINGLETON,1)
this.wedMgr.listeners.on("redrawAtEnd",coordSearch)
this.wedMgr.listeners.on("shown",coordSearch)}return this}
return cls}function coordSearch(wedMgr){var _a
const search=(_a=wedMgr.wedEditor.reg.env.wedSearchCoord)===null||_a===void 0?void 0:_a.getParams()
if(search)wedMgr.wedEditor.searchBar.setSearch(search)}export class ToggleSearchBar extends Action{constructor(id){super("search"||id)
this._label="Parcourir, remplacer..."
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/search/search.svg"}isToggle(){return true}getDatas(api,ctx){return ctx.searchBar&&!ctx.searchBar.hidden}execute(ctx,ev){if(ctx.searchBar.hidden){ctx.searchBar.show()}else{ctx.searchBar.close()}}}ToggleSearchBar.SINGLETON=new ToggleSearchBar
export class ShowSearchBar extends ToggleSearchBar{isToggle(){return false}isVisible(ctx){if(!ctx.searchBar.hidden)return false
return super.isVisible(ctx)}}ShowSearchBar.SINGLETON=new ShowSearchBar
export class WedSearchBar extends HTMLElement{constructor(){super()
this.id="searchBar"
this.hidden=true}init(editor,config){this.editor=editor
return this}connectedCallback(){if(!this.shadowRoot)this.lazyInit()
this.refresh()}lazyInit(){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
const reg=REG.findReg(this)
reg.installSkin(this.localName,sr)
this.searchActions=reg.getList("wed.searchBar.actions")
this.selector=sr.appendChild((new ButtonActions).initialize({reg:reg,actions:this.searchActions,actionContext:this}))
this.rootPanels=sr.appendChild(JSX.createElement("div",null))
sr.appendChild(JSX.createElement("c-button",{icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/close.svg",title:"Fermer",onclick:this.onClose}))}setSearch(params){var _a
if(this.hidden){this.editor.barLayout.showBar(this)
this.hidden=false}if(!this.shadowRoot)this.lazyInit()
if(((_a=this.currentPanel)===null||_a===void 0?void 0:_a.action.getId())!==params.searchId){const act=this.searchActions.find(a=>a.getId()===params.searchId)
if(!act)return
try{this.initParams=params
act.execute(this)}finally{this.initParams=null}}else{this.currentPanel.setSearch(params)}}getSearchParams(){return!this.hidden&&this.currentPanel?this.currentPanel.buildSearch():null}close(){this.hidden=true
this.editor.barLayout.onHideBar(this)
this.setCurrentPanel(null)}show(){this.hidden=false
this.editor.barLayout.showBar(this)
this.refresh()}setCurrentPanel(panel){if(panel&&panel.parentNode!==this.rootPanels){this.rootPanels.append(panel)
panel.hidden=true}const wedMgr=this.editor.wedMgr
for(let ch=this.rootPanels.firstElementChild;ch;ch=ch.nextElementSibling){if(DOM.setHidden(ch,ch!==panel)){if(ch!==panel)ch.unconnectDoc()}}if(panel){if(wedMgr.docHolderAsync)panel.connectDoc(wedMgr)
else this.editor.wedMgr.listeners.once("redrawAtEnd",()=>{panel.connectDoc(wedMgr)})}this.selector.icon=panel?panel.action.getIcon(this):""
this.currentPanel=panel
this.dispatchSearchChange()}dispatchSearchChange(){}getPanelFor(action){for(let ch=this.rootPanels.firstElementChild;ch;ch=ch.nextElementSibling){if(ch.action===action)return ch}return null}onClose(){DOMSH.findHost(this).close()}refresh(){var _a
if(this.hidden)return
if(!this.currentPanel){(_a=this.searchActions)===null||_a===void 0?void 0:_a[0].execute(this)}else{this.currentPanel.action.execute(this)}}}REG.reg.registerSkin("wed-searchbar",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 1.5em;\n\t\tmin-width: 0;\n\t\tbackground-color: var(--bgcolor);\n\t\tfont-size: var(--label-size);\n\t}\n\n\t[hidden] {\n\t\tdisplay: none !important;\n\t}\n\n\tdiv {\n\t\tflex: 1;\n\t}\n`)
customElements.define("wed-searchbar",WedSearchBar)
export class WedSearchBarNextPrev extends HTMLElement{constructor(){super(...arguments)
this.annotFilter=isSkSearchAnnot}connectedCallback(){if(!this.shadowRoot){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
const reg=REG.findReg(this)
reg.installSkin(this.localName,sr)
sr.append(JSX.createElement("c-button",{icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/search/prev.svg",title:"Précédent",onclick:this.onPrevious}),JSX.createElement("c-button",{icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/search/next.svg",title:"Suivant",onclick:this.onNext}))}}setDisabled(disabled){for(const btn of this.shadowRoot.querySelectorAll("c-button")){btn.disabled=disabled}}onNext(){if(!this.disabled)DOMSH.findHost(this).gotoAnnot(1)}onPrevious(){if(!this.disabled)DOMSH.findHost(this).gotoAnnot(-1)}getLastSelectedAnnot(){if(this._lastAnnot){const wedMgr=findWedEditor(this).wedMgr
if(wedMgr.lastSkAnnots.indexOf(this._lastAnnot)>=0){if(this.isSelMatchLastAnnot(wedMgr.getCurrentSel())){return this._lastAnnot}}}return null}async gotoAnnot(offset){var _a
const wedMgr=findWedEditor(this).wedMgr
const annots=wedMgr.lastSkAnnots
const countAnnots=annots.length
let foundAnnot=null
let cycled=false
if(annots&&countAnnots>0){const sel=wedMgr.getCurrentSel()
let startFrom=0
if(sel){let startXa
if(this.isSelMatchLastAnnot(sel)){sel.start=this._lastAnnot.start}startXa=offset<0?sel.start:!sel.startInText?XA.append(sel.start,0):sel.end||sel.start
startFrom=countAnnots
for(let i=0;i<countAnnots;i++){const annot=annots[i]
if(this.annotFilter(annot)&&!XA.isAfter(startXa,annot.start)){startFrom=i
break}}}for(let i=offset<0?startFrom-1:startFrom;offset<0?i>=0:i<countAnnots;i=i+offset){const a=annots[i]
if(this.annotFilter(a)){foundAnnot=a
await WEDLET.focusAnnot(wedMgr,foundAnnot)
break}}if(!foundAnnot){cycled=true
for(let i=offset<0?countAnnots-1:0;offset<0?i>=startFrom:i<startFrom;i=i+offset){const a=annots[i]
if(this.annotFilter(a)){foundAnnot=a
await WEDLET.focusAnnot(wedMgr,foundAnnot)
break}}}}if(!foundAnnot){this._lastAnnotSelStart=null
this._lastAnnot=null
POPUP.showNotif("Aucune occurrence trouvée",this,{autoHide:500,noCloseBtn:true},{posFrom:wedMgr.wedEditor.rootNode,fromX:"middle",targetX:"middle",fromY:"middle"})}else{this._lastAnnotSelStart=(_a=wedMgr.getCurrentSel())===null||_a===void 0?void 0:_a.start
this._lastAnnot=foundAnnot
if(cycled){if(offset>0){POPUP.showNotif("Fin du contenu atteint, poursuite au début",this,{autoHide:900,noCloseBtn:true,classes:"hover"},{posFrom:wedMgr.wedEditor.rootNode,fromX:"middle",targetX:"middle",fromY:"bottom",targetY:"bottom"})}else{POPUP.showNotif("Début du contenu atteint, poursuite par la fin",this,{autoHide:900,noCloseBtn:true,classes:"hover"},{posFrom:wedMgr.wedEditor.rootNode,fromX:"middle",targetX:"middle",fromY:"top"})}}}}isSelMatchLastAnnot(currentSel){return this._lastAnnotSelStart&&XA.isEquals(this._lastAnnotSelStart,currentSel.start)}}REG.reg.registerSkin("wed-searchbar-nextprev",1,`\n\t:host {\n\t\tdisplay: flex;\n\t}\n`)
customElements.define("wed-searchbar-nextprev",WedSearchBarNextPrev)
export class SearchBarPanelAction extends Action{isEnabled(ctx){var _a
if(((_a=ctx.currentPanel)===null||_a===void 0?void 0:_a.action)===this)return false
return super.isEnabled(ctx)}execute(ctx,ev){let panel=ctx.getPanelFor(this)
if(!panel)panel=this.buildPanel(ctx)
if(ctx.initParams)panel.setSearch(ctx.initParams)
ctx.setCurrentPanel(panel)}}export class SearchPanelBase extends HTMLElement{constructor(){super(...arguments)
this.lastCount=null}_initPanel(action,bar,withReplacePanel){this.action=action
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg=REG.findReg(bar)
this.reg.installSkin("wed-searchbar-base",sr)
this.result=JSX.createElement("span",{id:"result"})
this.nav=new WedSearchBarNextPrev
if(withReplacePanel){this.classList.add("double")
this.replaceBtn=JSX.createElement(ButtonToggle,{icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/search/replace.svg",title:"Remplacer...",onclick:this.toggleReplace})
this.searchBar=JSX.createElement("div",{id:"search"})
sr.append(JSX.createElement("div",{id:"bars"},this.searchBar,this.replaceBar),this.replaceBtn)
this._refreshOnReadOnlyChange=this.refreshOnReadOnlyChange.bind(this)}else{this.classList.add("single")}this._asyncSkAnnots=this.asyncSkAnnots.bind(this)}connectDoc(wedMgr){this.wedMgr=wedMgr
wedMgr.listeners.on("asyncSkAnnots",this._asyncSkAnnots)
if(this._refreshOnReadOnlyChange){wedMgr.listeners.on("readOnlyChangeAfter",this._refreshOnReadOnlyChange)
this.refreshOnReadOnlyChange()}this.execSearch()}unconnectDoc(){if(this.wedMgr){this.wedMgr.listeners.removeListener("asyncSkAnnots",this._asyncSkAnnots)
if(this._refreshOnReadOnlyChange)this.wedMgr.listeners.removeListener("readOnlyChangeAfter",this._refreshOnReadOnlyChange)
this.wedMgr.docHolder.setSkSearch(null)
this.wedMgr=null}}buildSearch(){return{searchId:this.action.getId()}}get replaceBarShown(){var _a
return((_a=this.replaceBtn)===null||_a===void 0?void 0:_a.toggleOn)||false}showReplaceBar(show){if(show){if(!this.replaceBar){this.replaceBar=JSX.createElement("div",{id:"replace"})
this.searchBar.insertAdjacentElement("afterend",this.replaceBar)
this.buildReplaceBar()}this.replaceBar.hidden=false
this.replaceBtn.toggleOn=true}else{if(this.replaceBar)this.replaceBar.hidden=true
this.replaceBtn.toggleOn=false}}toggleReplace(){if(this.disabled)return
const me=DOMSH.findHost(this)
me.showReplaceBar(!this.toggleOn)}buildReplaceBar(){}updateCount(count){this.lastCount=count
switch(count){case null:DOM.setTextContent(this.result,null)
break
case 0:DOM.setTextContent(this.result,"➔ Aucune occurrence trouvée")
break
case 1:DOM.setTextContent(this.result,"➔ 1 occurrence trouvée")
break
default:DOM.setTextContent(this.result,count>this.action.maxResults?`➔ Plus de ${this.action.maxResults} occurrences trouvées`:`➔ ${count} occurrences trouvées`)
break}}asyncSkAnnots(wedMgr,annots,deadline){let c=0
for(const a of annots)if(isSkSearchAnnot(a))c++
if(this.lastCount>this.action.maxResults&&c<this.action.maxResults){this.updateCount(c)
this.execSearch()}else{this.updateCount(c)}}refreshOnReadOnlyChange(){if(this.wedMgr.readOnly){this.replaceBtn.disabled=true
this.showReplaceBar(false)}else{this.replaceBtn.disabled=false}}}REG.reg.registerSkin("wed-searchbar-base",1,`\n\t:host(.single),\n\t#search,\n\t#replace {\n\t\tdisplay: flex;\n\t\tflex-wrap: wrap;\n\t\tpadding: 2px;\n\t\talign-items: center;\n\t}\n\n\t:host(.double) {\n\t\tdisplay: flex;\n\t}\n\n\t[hidden] {\n\t\tdisplay: none !important;\n\t}\n\n\t#bars {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t}\n\n\t#replace {\n\t\tborder-top: 1px solid var(--border-color);\n\t}\n\n\tinput {\n\t\tbackground-color: var(--form-bgcolor);\n\t\tcolor: var(--form-color);\n\t\tborder: 1px solid var(--border-color);\n\t}\n\n\tinput:focus {\n\t\toutline: var(--focus-outline);\n\t}\n\n\tlabel {\n\t\tdisplay: flex;\n\t\talign-items: center;\n\t\tuser-select: none;\n\t\tmargin-inline-start: .5em;\n\t}\n\n\t.options {\n\t\tdisplay: flex;\n\t\tflex-wrap: wrap;\n\t\talign-items: center;\n\t}\n\n\t#result {\n\t\tmargin: 0 .5em;\n\t\tcolor: var(--alt1-color);\n\t\tflex: 1 0 auto;\n\t\ttext-align: center;\n\t}\n\n\tc-button.border {\n\t\tborder: 1px solid var(--border-color);\n\t\tborder-radius: 3px;\n\t\tmargin-inline: .3em;\n\t}\n`)
export class TextSearchAction extends SearchBarPanelAction{constructor(id,maxResults){super(id||"text")
this.searchInAtts=false
this.maxResults=maxResults||300
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/search/textSearch.svg"
this._label="Chercher dans le texte"}setSearchInAtts(v){this.searchInAtts=v
return this}buildPanel(ctx,ev){return(new TextSearchPanel).initPanel(this,ctx)}}REG.reg.addToList("wed.searchBar.actions","text",1,new TextSearchAction)
class TextSearchPanel extends SearchPanelBase{initPanel(action,bar){this._initPanel(action,bar,true)
this.input=JSX.createElement("input",{type:"search",oninput:this.onChange})
this.matchCase=JSX.createElement("input",{type:"checkbox",onchange:this.onChange})
this.wholeWord=JSX.createElement("input",{type:"checkbox",onchange:this.onChange})
this.searchBar.append(this.input,this.nav,JSX.createElement("div",{class:"options"},JSX.createElement("label",null,this.matchCase,"Respecter la casse"),JSX.createElement("label",null,this.wholeWord,"Mot entier")),this.result)
return this}setSearch(params){if(params.text!=null)this.input.value=params.text
if(typeof params.matchCase==="boolean")this.matchCase.checked=params.matchCase
if(typeof params.wholeWord==="boolean")this.wholeWord.checked=params.wholeWord
this.execSearch()
if(params.repBy!==undefined){this.showReplaceBar(true)
this.inputRepl.value=params.repBy}}buildSearch(){return{searchId:this.action.getId(),text:this.input.value,matchCase:this.matchCase.checked,wholeWord:this.wholeWord.checked,repBy:this.replaceBarShown&&this.inputRepl?this.inputRepl.value:undefined}}onChange(){const me=DOMSH.findHost(this)
me.execSearch()
DOMSH.findHost(me).dispatchSearchChange()}buildReplaceBar(){this.inputRepl=JSX.createElement("input",{type:"search"})
this.replaceBar.append(this.inputRepl,JSX.createElement(Button,{class:"border",label:"Remplacer",onclick:this.onReplace}),JSX.createElement(Button,{class:"border",label:"Tout remplacer",onclick:this.onReplaceAll}))}onReplace(){const me=DOMSH.findHost(this)
const annot=me.nav.getLastSelectedAnnot()
if(annot instanceof SkSearchCommentAnnot){me.warnNoReplaceInCmt()
return}if(annot){const wedMgr=me.wedMgr
const start=XA.freeze(annot.start)
const len=annot.len
const startWedlet=WEDLET.findWedlet(wedMgr.rootWedlet,start,{lastAncestorIfNone:true})
if(startWedlet&&WEDLET.resolveEditMode(startWedlet)===EWedletEditMode.write){const batch=wedMgr.docHolder.newBatch(me.wedMgr.getCurrentSel())
me.replaceText(batch,start,len,me.inputRepl.value)
batch.setSelAfterSeq(start,me.inputRepl.value.length)
batch.doBatch()}else{POPUP.showNotifForbidden("Contenu non modifiable",this,null,{viewPortX:"middle",viewPortY:"1/3"})}}me.nav.gotoAnnot(1)}onReplaceAll(){const me=DOMSH.findHost(this)
const wedMgr=me.wedMgr
const batch=wedMgr.docHolder.newBatch(wedMgr.getCurrentSel())
const rep=me.inputRepl.value
const annots=wedMgr.lastSkAnnots
let lastAn
let inComment=false
for(let i=annots.length-1;i>=0;i--){const an=annots[i]
if(isSkSearchAnnot(an)){if(an instanceof SkSearchCommentAnnot){inComment=true}else{const start=XA.freeze(an.start)
const startWedlet=WEDLET.findWedlet(wedMgr.rootWedlet,start,{lastAncestorIfNone:true})
if(startWedlet&&WEDLET.resolveEditMode(startWedlet)===EWedletEditMode.write)me.replaceText(batch,start,an.len,rep)
if(!lastAn)lastAn=an}}}if(lastAn){batch.setSelAfterSeq(lastAn.start,rep.length)
batch.doBatch()}else{me.nav.gotoAnnot(1)}if(inComment)me.warnNoReplaceInCmt()}warnNoReplaceInCmt(){POPUP.showNotifForbidden("Éditez les commentaires pour effectuer les remplacements",this,null,{posFrom:this.wedMgr.wedEditor,fromX:"middle",targetX:"middle",fromY:"middle",targetY:"middle"})}replaceText(batch,start,len,rep){batch.deleteSequence(start,len)
if(rep)batch.insertText(start,rep)}execSearch(){if(!this.wedMgr)return
const v=this.rawValue()
if(!v){this.wedMgr.docHolder.setSkSearch(null)
this.updateCount(null)}else{if(this.wedMgr.docHolder.setSkSearch(this.newSkTextSearch(v)).length===0){this.updateCount(0)}}}newSkTextSearch(value){if(this.action.searchInAtts){return new SkTextSearchInAtts(this.buildRegexp(value),this.action.maxResults)}else{return new SkTextSearch(this.buildRegexp(value),this.action.maxResults)}}rawValue(){return this.input.value}buildRegexp(rawValue){let r=LANG.escape4RegexpFuzzy(rawValue)
if(this.wholeWord.checked)r="(?<=^|\\W)"+r+"(?=$|\\W)"
const flags=this.matchCase.checked?"g":"gi"
return new RegExp(r,flags)}connectDoc(wedMgr){super.connectDoc(wedMgr)
this.input.focus()}asyncSkAnnots(wedMgr,annots,deadline){if(!this.rawValue())return
super.asyncSkAnnots(wedMgr,annots,deadline)}}customElements.define("wed-searchbar-text",TextSearchPanel)
class NoOptionsSearchPanel extends SearchPanelBase{initPanel(action,bar){this._initPanel(action,bar,false)
this.shadowRoot.append(JSX.createElement("span",null,action.getLabel(bar)),this.nav,this.result)
return this}initSearch(skSearchMk){this.skSearchMk=skSearchMk
return this}setSearch(params){this.execSearch()}execSearch(){if(!this.wedMgr)return
if(this.wedMgr.docHolder.setSkSearch(this.skSearchMk()).length===0){this.updateCount(0)}}}customElements.define("wed-searchbar-nooptions",NoOptionsSearchPanel)
export class FixedXPathSearchAction extends SearchBarPanelAction{constructor(id,xpath,annotLabel,maxResults){super(id)
this.xpath=xpath
this.annotLabel=annotLabel
this.maxResults=maxResults||300}buildPanel(ctx,ev){return(new NoOptionsSearchPanel).initPanel(this,ctx).initSearch(()=>new SkXPathSearch(this.xpath,this.annotLabel,this.maxResults))}}export class FixedCssSelectorSearchAction extends SearchBarPanelAction{constructor(id,selector,annotLabel,maxResults){super(id)
this.selector=selector
this.annotLabel=annotLabel
this.maxResults=maxResults||300}buildPanel(ctx,ev){return(new NoOptionsSearchPanel).initPanel(this,ctx).initSearch(()=>new SkCssSelectorSearch(this.selector,this.annotLabel,this.maxResults))}}export class FixedTextSearchAction extends SearchBarPanelAction{constructor(id,pattern,maxResults){super(id)
this.pattern=pattern
this.maxResults=maxResults||300}buildPanel(ctx,ev){return(new NoOptionsSearchPanel).initPanel(this,ctx).initSearch(()=>new SkTextSearch(this.pattern,this.maxResults))}}export class WedSearchCoordinator{getParams(){let p=this.params
if(p){if(this.deadline>0&&Date.now()>this.deadline){p=null
this.deadline=0}this.params=null}return p}setParamsOnce(params){this.params=params
this.deadline=Date.now()+3e3}}
//# sourceMappingURL=searchBar.js.map