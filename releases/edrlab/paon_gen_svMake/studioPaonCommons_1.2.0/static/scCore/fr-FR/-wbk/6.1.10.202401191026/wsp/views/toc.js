import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{BaseAreaView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{EWspChangesEvts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{InfoCurrentItem,InfoFocusItem,InfoFocusNodeInItem,InfoReqCurrentItem}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SRCDRAWER,SrcPointer,SrcPointerDblClick}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcDrawer.js"
import{render}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/litHtml/lit-html.js"
import{xhtml}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/htmlLit.js"
import{BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{ACTION,Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{SrcHisto}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcHisto.js"
export class Toc extends BaseAreaView{constructor(){super(...arguments)
this._maxLevelOpenedIntended=5}setRootSrcRef(srcRef){this._rootSrc.setSrcRef(srcRef)}getRootSrcRef(){return this._rootSrc.srcRef}getRootSrcUri(){const sd=this._rootSrc.shortDescs[0]
return sd?sd.srcUri:null}isLevelOpened(tocItem,depth){return depth<this._maxLevelOpenedIntended}isInToc(srcRef){if(!this._srcMap)return false
return this._srcMap.has(srcRef)}async ensureRowVisible(srcUri){}_initialize(init){var _a
super._initialize(init)
this.wsp=this.reg.env.wsp
this.infoBroker=init.infoBroker
this.transformFacet=init.transformFacet?`transform=facet&${init.transformFacet}`:"transform=facet&facet=outline"
if(init.maxLevelOpenedIntended)this._maxLevelOpenedIntended=init.maxLevelOpenedIntended
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.reg.installSkin("scroll/small",sr)
this._rootSrc=(new SrcPointer).initialize({reg:this.reg,place:this.reg.env.place,tpl:SRCDRAWER.itemCodeAloneTpl,defaultAction:this.reg.getSvc("ptrItemDblClick",SrcPointerDblClick.SINGLETON),sgnPattern:/.*#Map\b.*/,draggable:true,dropable:true,dispatchHighlight:true})
this._rootSrc.classList.add("fixedIconSize")
if(!init.hideHeader){this._srcHisto=JSX.createElement(SrcHisto,{title:"Historique des dernières racines sélectionnées","î":{reg:this.reg,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/toc/histo.svg",srcPointer:this._rootSrc,history:(_a=init.lastDatas)===null||_a===void 0?void 0:_a.roots}})
sr.appendChild(JSX.createElement("div",{id:"headBar"},JSX.createElement("div",{id:"rootSel"},this._rootSrc,this._srcHisto),JSX.createElement(BarActions,{id:"options","î":{actions:[(new Action).setLabel("Déplier d\'un niveau supplémentaire").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/expandMore.svg").setExecute(ctx=>{ctx._maxLevelOpenedIntended++
ctx._render()}),(new Action).setLabel("Tout replier").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/collaps.svg").setExecute(ctx=>{ctx._maxLevelOpenedIntended=1
ctx._render()})],disableFullOverlay:true,uiContext:"bar",actionContext:this}})))}this._rootSrc.onSrcRefChange.add(()=>{this.rebuildFromRoot()})
this._view=sr.appendChild(JSX.createElement("div",{id:"view"}))
this.tocItemTpl=init.tocItemTpl||function(tocItem,hideTitle,depthTitle,stackItems){if(tocItem.srcSt<0)return xhtml`<div class="notFound"><wsp-toc-twisty p.state="${"notFound"}"/>Item non trouvé</div>`
if(stackItems.indexOf(tocItem)>=0){return xhtml`<wsp-toc-title depth="${depthTitle}"><wsp-toc-twisty p.state="${"cycle"}" srcRef="${tocItem.srcId||tocItem.srcUri}"/>${tocItem.title||SRC.extractLeafFromUri(tocItem.srcUri)}</wsp-toc-title>`}stackItems.push(tocItem)
const tocNodeTpl=tocNode=>{try{depthTitle++
const defaultState=this.isLevelOpened(tocItem,depthTitle)?"opened":"closed"
if(typeof tocNode.body==="string"){const subTocItem=this._srcMap.get(tocNode.body)
if(subTocItem){return xhtml`<wsp-toc-node p.tocNode="${tocNode}">
							${tocNode.title?xhtml`<wsp-toc-title depth="${depthTitle}"><wsp-toc-twisty p.state="${subTocItem.nodes.length?defaultState:"leaf"}"/>${tocNode.title||tocNode.name}</wsp-toc-title>`:undefined}
							${this.tocItemTpl(subTocItem,tocNode.title!=null,depthTitle,stackItems)}
						</wsp-toc-node>`}else{return xhtml`<div>...</div>`}}else{return xhtml`<wsp-toc-node p.tocNode="${tocNode}">
						<wsp-toc-title depth="${depthTitle}"><wsp-toc-twisty p.state="${tocNode.body&&tocNode.body.length?defaultState:"leaf"}"/>${tocNode.title||tocNode.name}</wsp-toc-title>
						<div class="children">
							${tocNode.body?tocNode.body.map(tocNodeTpl):undefined}
						</div>
					</wsp-toc-node>`}}finally{depthTitle--}}
return xhtml`<wsp-toc-item p.tocItem="${tocItem}" srcRef="${tocItem.srcId||tocItem.srcUri}">
				<wsp-toc-side b.current="${this._currentSrcUri===tocItem.srcUri}"/>
				<div class="itemBody">
					${hideTitle?undefined:xhtml`<wsp-toc-title depth="${depthTitle}"><wsp-toc-twisty p.state="${tocItem.nodes.length?this.isLevelOpened(tocItem,depthTitle)?"opened":"closed":"leaf"}"/>${tocItem.title||SRC.extractLeafFromUri(tocItem.srcUri)}</wsp-toc-title>`}
					<div class="children">
						${tocItem.nodes.map(tocNodeTpl)}
					</div>
				</div>
			</wsp-toc-item>`}}async rebuildFromRoot(){this._srcMap=null
this._fetchToc(this._rootSrc.srcRef)}async _fetchToc(srcRef){if(srcRef){try{const txt=await WSP.fetchStreamText(this.wsp,this,srcRef,this._srcMap?this.transformFacet+"&depth=1":this.transformFacet)
const doc=DOM.parseDom(txt)
if(!this._srcMap)this._srcMap=new Map
this.buildItemToc(doc.documentElement.firstElementChild)}catch(e){this._srcMap=null
console.log(e)}}else{this._srcMap=null}this._render()}buildItemToc(item){const srcUri=item.getAttribute("uri")
const srcId=item.getAttribute("id")
let old=this._srcMap.get(srcUri)
if(old&&old.srcId&&old.srcId!==srcId)this._srcMap.delete(old.srcId)
old=this._srcMap.get(srcId)
if(old&&old.srcUri!==srcUri)this._srcMap.delete(old.srcUri)
const root=DOM.findFirstChild(item,n=>n.nodeName==="itemRoot")
if(!root)return
const title=DOM.findFirstChild(root,n=>n.nodeName==="titleNode")
const tocItem={srcUri:srcUri,srcId:srcId,srcSt:parseInt(item.getAttribute("st")),itSgn:item.getAttribute("sgn"),xpath:root?root.getAttribute("xp").split("/"):null,title:title?title.getAttribute("title"):null,nodes:[]}
this._srcMap.set(srcUri,tocItem)
if(srcId)this._srcMap.set(srcId,tocItem)
const children=DOM.findFirstChild(root,n=>n.nodeName==="children")
if(!children)return
for(let ch=children.firstElementChild;ch;ch=ch.nextElementSibling){if(ch.nodeName==="node")tocItem.nodes.push(this.buildNodeToc(ch))}}buildNodeToc(node){const title=DOM.findFirstChild(node,n=>n.nodeName==="titleNode")
const itNode={xpath:node.getAttribute("xp").split("/"),name:node.getAttribute("name"),title:title?title.getAttribute("title"):null}
const body=node.lastElementChild
if(body){if(body.nodeName==="children"){const bodySet=itNode.body=[]
for(let ch=body.firstElementChild;ch;ch=ch.nextElementSibling){if(ch.nodeName==="node")bodySet.push(this.buildNodeToc(ch))}}else if(body.nodeName==="item"){const srcRef=itNode.body=body.getAttribute("id")||body.getAttribute("uri")
if(body.hasChildNodes()||body.getAttribute("st")==="-1"){this.buildItemToc(body)}else{if(!this._srcMap.has(srcRef)){this._fetchToc(srcRef)}}}}return itNode}_render(){var _a
const rootSrcUri=this.getRootSrcUri()
if(!rootSrcUri){render(this.noRootTpl(),this._view)
return}const tocItem=(_a=this._srcMap)===null||_a===void 0?void 0:_a.get(rootSrcUri)
if(!tocItem){render(this.noTocTpl(),this._view)
return}render(this.tocItemTpl(tocItem,false,1,[]),this._view)}noRootTpl(){return xhtml`<c-msg level="info">Renseignez un item racine</c-msg>`}noTocTpl(){return xhtml`<c-msg level="info">Aucun plan pour cet item</c-msg>`}_setCurrentItem(srcUri){this._currentSrcUri=srcUri
this._render()
if(this._currentSrcUri)this.ensureRowVisible(this._currentSrcUri)}buildLastDatas(parentLastDatas){var _a
const ldKey=this.getAttribute("last-datas")
if(ldKey)parentLastDatas[ldKey]=(_a=this._srcHisto)===null||_a===void 0?void 0:_a.setHistory({},"roots")}onInfo(info){if(info instanceof InfoCurrentItem){this._setCurrentItem(info.srcUri)}}onViewShown(){if(!this._onConnRenewed){this._onConnRenewed=this.onConnRenewed.bind(this)
this.reg.env.place.eventsMgr.on("onConnectionRenewed",this._onConnRenewed)
this._wspUriChange=this.onWspUriChange.bind(this)
this.reg.env.place.eventsMgr.on("wspUriChange",this._wspUriChange)}if(this.infoBroker){this.infoBroker.addConsumer(this)
const req=new InfoReqCurrentItem
this.infoBroker.dispatchInfo(req,this)
this._setCurrentItem(req.srcUri)
if(this._srcMap==null){if(!this._rootSrc.srcRef&&req.srcUri){this._rootSrc.setSrcRef(req.srcUri,req.shortDesc)}}}}onViewHidden(closed){if(this.infoBroker)this.infoBroker.removeConsumer(this)
if(closed){this.reg.env.place.eventsMgr.removeListener("onConnectionRenewed",this._onConnRenewed)
this.reg.env.place.eventsMgr.removeListener("wspUriChange",this._wspUriChange)}}onWspUriChange(msg,from){if(!this._srcMap)return
if(msg.type===EWspChangesEvts.u){const tocIt=this._srcMap.get(SRC.srcRef(msg))
if(tocIt)this._fetchToc(SRC.srcRef(msg))}else if(msg.type===EWspChangesEvts.r){const tocIt=this._srcMap.get(msg.srcUri)
if(tocIt){tocIt.srcSt=-1
tocIt.nodes=[]
this._render()}}}async onConnRenewed(){if(this.hidden){if(this._srcMap){this._srcMap=null
this._render()}}else{this.rebuildFromRoot()}}}REG.reg.registerSkin("wsp-toc",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t:focus-visible {\n\t\toutline: var(--focus-outline);\n\t}\n\n\t[hidden] {\n\t\tdisplay: none !important;\n\t}\n\n\t#headTi {\n\t\tpadding: 0 .3em;\n\t\tfont-size: 80%;\n\t\twhite-space: nowrap;\n\t\tcolor: var(--fade-color);\n\t}\n\n\t#headBar {\n\t\tdisplay: flex;\n\t\tflex-wrap: wrap;\n\t\tmin-height: 1.5em;\n\t\tmin-width: 0;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t\tpadding: .2em;\n\t}\n\n\t#rootSel {\n\t\tflex: 1 0 auto;\n\t\tdisplay: flex;\n\t\tmin-height: 1.5em;\n\t\tmin-width: 0;\n\t}\n\n\twsp-src-pointer {\n\t\tflex: 0 0 auto;\n\t\tmin-width: 0;\n\t\tmargin: 0;\n\t}\n\n\t#options {\n\t\tflex: 1 0 auto;\n\t\t/*background-color: var(--bgcolor);*/\n\t\tjustify-content: flex-end;\n\t}\n\n\t#view {\n\t\tflex: 1;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\toverflow: auto;\n\t\tpadding: 4px 2px;\n\t\tbackground-color: var(--row-bgcolor);;\n\t}\n\n\twsp-toc-item {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\twsp-toc-node {\n\t\tdisplay: block;\n\t}\n\n\twsp-toc-side {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\twidth: .7em;\n\t\tborder-inline-start: 1px solid #b89a62;\n\t\tborder-radius: .7em;\n\t}\n\n\twsp-toc-side[current] {\n\t\tbackground: linear-gradient(90deg, #b89a62, transparent .3em);\n\t}\n\n\twsp-toc-side:not([current]):hover {\n\t\t/*background: linear-gradient(90deg, #b89a62, transparent);*/\n\t\tfilter: var(--hover-filter);\n\t}\n\n\twsp-toc-node > wsp-toc-title,\n\twsp-toc-node > .children {\n\t\tpadding-inline-start: .7em; /* décalage en l'absence de wsp-toc-side */\n\t}\n\n\twsp-toc-title {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tcursor: pointer;\n\t\tuser-select: none;\n\t}\n\n\twsp-toc-title[depth='2'] {\n\t\tcolor: var(--alt1-color);\n\t}\n\n\twsp-toc-title[depth='3'] {\n\t\tcolor: var(--alt2-color);\n\t}\n\n\twsp-toc-title[depth='5'] {\n\t\tcolor: var(--alt1-color);\n\t}\n\n\twsp-toc-title[depth='6'] {\n\t\tcolor: var(--alt2-color);\n\t}\n\n\twsp-toc-twisty {\n\t\tpadding-inline-start: 1em;\n\t\tbackground: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/toc/opened.svg) no-repeat center / .9em;\n\t}\n\n\twsp-toc-twisty[state=closed] {\n\t\tbackground: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/toc/closed.svg) no-repeat center / .9em;\n\t}\n\n\twsp-toc-twisty[state=leaf] {\n\t\tbackground: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/toc/leaf.svg) no-repeat center / .9em;\n\t}\n\n\t.notFound {\n\t\tcolor: var(--error-color);\n\t\tfont-style: italic;\n\t}\n\n\twsp-toc-twisty[state=notFound] {\n\t\tbackground: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/toc/notFound.svg) no-repeat center / .9em;\n\t}\n\n\twsp-toc-twisty[state=cycle] {\n\t\tbackground: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/toc/cycle.svg) no-repeat center / .9em;\n\t}\n\n\twsp-toc-twisty:not([state=notFound]):hover {\n\t\tfilter: var(--hover-filter);\n\t\tcursor: auto;\n\t}\n`)
customElements.define("wsp-toc",Toc)
export class WspTocItem extends HTMLElement{buildXpath(xpath){if(this.tocItem.xpath)xpath.push(...this.tocItem.xpath)
return this.getAttribute("srcRef")}}customElements.define("wsp-toc-item",WspTocItem)
export class WspTocNode extends HTMLElement{buildXpath(xpath){const p=this.parentElement.closest("wsp-toc-node,wsp-toc-item")
const srcRef=p.buildXpath(xpath)
if(this.tocNode.xpath)xpath.push(...this.tocNode.xpath)
return srcRef}}customElements.define("wsp-toc-node",WspTocNode)
export class WspTocTitle extends HTMLElement{constructor(){super()
BASIS.makeClickable(this)
this.onclick=this.onClick
this.onkeydown=this.onKeyDown}onClick(ev){const p=this.parentElement.closest("wsp-toc-node,wsp-toc-item")
const xp=[]
const srcRef=p.buildXpath(xp)
const toc=DOMSH.findHost(this)
toc.infoBroker.dispatchInfo(new InfoFocusNodeInItem(xp.join("/"),srcRef),toc)}openFolder(){const twisty=this.querySelector("wsp-toc-twisty")
if(twisty&&twisty.state==="closed"){twisty.state="opened"
return true}return false}closeFolder(){const twisty=this.querySelector("wsp-toc-twisty")
if(twisty&&twisty.state==="opened"){twisty.state="closed"
return true}return false}toggleFolderOrGotoCycle(){const twisty=this.querySelector("wsp-toc-twisty")
if(twisty){const st=twisty.state
if(st==="closed"){twisty.state="opened"
return true}else if(st==="opened"){twisty.state="closed"
return true}else if(st==="cycle"){twisty.gotoCycle()
return true}}return false}ensureVisible(){this.scrollIntoView({block:"nearest",inline:"nearest",behavior:"smooth"})}onKeyDown(ev){let n
switch(ev.key){case"ArrowDown":n=DOM.findNext(this,null,IS_WspTocTitle)
if(n)n.focus()
break
case"ArrowUp":n=DOM.findPrevious(this,null,IS_WspTocTitle)
if(n)n.focus()
break
case"ArrowLeft":if(window.getComputedStyle(this).direction==="rtl"){if(!this.openFolder()){this.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowDown"}))
return}}else{if(!this.closeFolder()){this.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowUp"}))
return}}this.ensureVisible()
break
case"ArrowRight":if(window.getComputedStyle(this).direction==="rtl"){if(!this.closeFolder()){this.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowUp"}))
return}}else{if(!this.openFolder()){this.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowDown"}))
return}}this.ensureVisible()
break
case"Enter":if(ACTION.isAccelPressed(ev)){if(!this.toggleFolderOrGotoCycle())return
this.ensureVisible()
break}default:return}ev.stopImmediatePropagation()
ev.preventDefault()}}function IS_WspTocTitle(n){return n instanceof WspTocTitle}customElements.define("wsp-toc-title",WspTocTitle)
export class WspTocTwisty extends HTMLElement{constructor(){super()
this.onpointerdown=this.onPointerDown
this.onclick=this.onClick}get state(){return this.getAttribute("state")}set state(st){switch(st){case"opened":{const chList=this.getChildrenList()
if(chList)DOM.setHidden(chList,false)
break}case"closed":{const chList=this.getChildrenList()
if(chList)DOM.setHidden(chList,true)
break}case"leaf":case"notFound":case"cycle":{break}default:throw Error("State unknown: "+st)}this.setAttribute("state",st)}gotoCycle(){if(this.state==="cycle"){const parent=DOM.findParent(this,null,n=>n instanceof WspTocItem&&n.getAttribute("srcRef")===this.getAttribute("srcRef"))
if(parent){const title=parent.querySelector("wsp-toc-title")
if(title){title.focus()
return true}}}return false}getChildrenList(){const parent=DOM.findParent(this,null,n=>n instanceof WspTocNode||n instanceof HTMLElement&&n.classList.contains("itemBody"))
return DOM.findLastChild(parent,n=>n instanceof HTMLElement&&n.classList.contains("children"))}onPointerDown(ev){const st=this.state
if(st==="leaf")return
if(st==="cycle"){if(this.gotoCycle()){ev.stopImmediatePropagation()
ev.preventDefault()}return}ev.stopImmediatePropagation()
this.state=st==="closed"?"opened":"closed"}onClick(ev){ev.stopImmediatePropagation()}}customElements.define("wsp-toc-twisty",WspTocTwisty)
export class WspTocSide extends HTMLElement{constructor(){super()
this.onclick=this.onClick}onClick(ev){const toc=DOMSH.findHost(this)
toc.infoBroker.dispatchInfo(new InfoFocusItem(this.parentElement.getAttribute("srcRef")),toc)}}customElements.define("wsp-toc-side",WspTocSide)

//# sourceMappingURL=toc.js.map