import{BaseElement,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{Grid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{GridColTreeDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{SpaceTreeDataSearch}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/spaceTree.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{CellBuilderSrcIconCodeTitle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcGridColumns.js"
import{SearchItems}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
import{SubItemsTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/subItemsTree.js"
export class FastFindItem extends BaseElement{constructor(){super(...arguments)
this.subItemsFirstShown=false}static openFastFind(init,uiContext,ev){const ct=(new FastFindItem).initialize(init)
let popup
if(init.subItemsFind){if(ev instanceof MouseEvent){popup=POPUP.showMenuFromEvent(ct,ev,uiContext,null,{initMaxHeight:"75vh",initWidth:"min(50em,75vw)"})}else{popup=POPUP.showMenu(ct,{viewPortY:"top",initMaxHeight:"75vh",initWidth:"min(50em,75vw)"},uiContext)}}else{if(ev instanceof MouseEvent){popup=POPUP.showMenuFromEvent(ct,ev,uiContext,null,{initMaxHeight:"50vh",initWidth:"min(40em,50vw)"})}else{popup=POPUP.showMenu(ct,{viewPortY:"top",initMaxHeight:"50vh",initWidth:"min(40em,50vw)"},uiContext)}}return popup}get wsp(){return this.reg.env.wsp}get uriFilter(){return this.search.value}_initialize(init){this.reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
if(init.title)sr.appendChild(JSX.createElement("div",{id:"title"},init.title))
const head=sr.appendChild(JSX.createElement("div",{id:"head"}))
this.search=head.appendChild(JSX.createElement("input",{type:"search",spellCheck:"false",onchange:this.onSearchChange,oninput:this.onSearchChange,onkeydown:this.onKeydown}))
if(init.itemCreator){this.itemCreator=init.itemCreator
head.appendChild(JSX.createElement("c-button",{"ui-context":"bar",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/createItem.svg",title:"Créer un item...",onclick:this.createItem}))}this.datasSearch=new SpaceTreeDataSearch(this.reg,"",false,init.srcFilter,null)
this.request=new ReqFastFind(this.wsp).initReq(this.wsp.getShortDescDef(),"",init.restrictions)
this.datasSearch.initSpTrDataSearch(this.request,20,30)
this.datasSearch.callbackSearching=this
this.datasSearch.hideItemFolderContent=true
const colDefs=[new GridColTreeDef("srcTree").setFlex("1rem",1,1).setCellBuilder(new CellBuilderSrcIconCodeTitle(this.reg,this.wsp.wspMetaUi,false,this.wsp.srcUriItemsSortFn))]
this.grid=(new Grid).initialize({selType:"monoClick",columnDefs:colDefs,dataHolder:this.datasSearch,hideHeaders:true,emptyBody:init.emptyBody||(()=>{if(!this.wsp.isAvailable){this.wsp.waitForAvailable(this)
return EMPTY_LOADING.cloneNode(true)}return this.search.value?EMPTY_FILTERED.cloneNode(true):EMPTY_NORESULT.cloneNode(true)}),skinScroll:"scroll/small"})
sr.appendChild(this.grid)
this.grid.uiEvents.on("rowClick",(row,ev)=>{if(row)this.onSelect(row.rowDatas)})
this.grid.addEventListener("keypress",(function(ev){var _a
const me=DOMSH.findHost(this)
if(ev.key===" "||ev.key==="Enter"){const row=this.dataHolder.getRow(this.getSelectedRow())
if(row)me.onSelect(row.rowDatas)}else(_a=me.search)===null||_a===void 0?void 0:_a.focus()}))
if(init.subItemsFind){const subItInit=Object.create(init.subItemsFind)
subItInit.reg=this.reg
subItInit.textFilter=""
subItInit.grid=Object.assign(subItInit.grid||{},{})
this.subItTree=(new SubItemsTree).initialize(subItInit)
sr.appendChild(this.subItTree)
this.subItTree.grid.uiEvents.on("rowClick",(row,ev)=>{if(row)this.onSelectSubItem(this.subItTree.item,row.rowDatas)})
this.subItTree.grid.addEventListener("keypress",(function(ev){const me=DOMSH.findHost(this)
if(ev.key===" "||ev.key==="Enter"){const row=this.dataHolder.getRow(this.getSelectedRow())
if(row)DOMSH.findHost(me).onSelectSubItem(me.item,row.rowDatas)}else me.search.focus()}))
this.grid.addEventListener("grid-select",(function(){const me=DOMSH.findHost(this)
if(!me.subItTree.item)return
const row=this.dataHolder.getRow(this.getSelectedRow())
if(row&&row.rowDatas.srcUri===me.subItTree.item.srcUri)return
me.showSubItemsTree(null)}))
this.subItTree.hidden=true}this.request.updateParams(this)
this.datasSearch.fetchSearchStart()}refetch(){this.datasSearch.fetchSearchStart()}showSubItemsTree(item){if(item){if(!this.subItemsFirstShown){const h=this.grid.clientHeight
this.grid.style.flexBasis=h+"px"
this.subItTree.style.flexBasis=Math.max(250,h)+"px"
DOM.setHidden(this.subItTree,false)
const popup=POPUP.findPopupableParent(this)
if(popup&&popup.eltForMove.style.height){popup.updatePosition()
popup.eltForMove.style.height=popup.eltForMove.offsetHeight+"px"}this.subItemsFirstShown=true}else{DOM.setHidden(this.subItTree,false)}this.subItTree.setSubItems(item)
this.subItTree.search.focus()
this.grid.ensureRowVisible(this.grid.getSelectedRow())}else{DOM.setHidden(this.subItTree,true)
this.grid.style.flexBasis="auto"}}onSelect(src){if(!src)return
if(ITEM.getSrcUriType(src.srcUri)==="space"){const row=this.datasSearch.findRowKeyBySrcUri(src.srcUri)
if(row)this.datasSearch.toggleFolder(row)
return}if(this.subItTree&&(!this.subItTree.item||SRC.srcRef(this.subItTree.item)!=SRC.srcRef(src))){this.wsp.fetchShortDescSubItems(SRC.srcRef(src)).then(srcSubIt=>{this.showSubItemsTree(srcSubIt)})}else if(!this.subItTree||!this.subItTree.subModelPattern||this.subItTree.subModelPattern.test(src.itSgn)){POPUP.findPopupableParent(this).close(src)}}onSelectSubItem(item,subIt){if(!item||!subIt)return
if(!this.subItTree.subModelPattern.test(subIt.mo))return
if(subIt.id){const result=Object.create(item)
result.itSubItem={id:subIt.id,ti:subIt.ti,mo:subIt.mo}
POPUP.findPopupableParent(this).close(result)}else{POPUP.findPopupableParent(this).close(item)}}onSearchChange(ev){const me=DOMSH.findHost(this)
if(me.request.updateParams(me))me.datasSearch.fetchSearchStart()}onSearching(state){if(state==="searchEnd"){const popup=POPUP.findPopupableParent(this)
if(popup&&!popup.eltForMove.style.height){popup.updatePosition()
popup.eltForMove.style.height=popup.eltForMove.offsetHeight+"px"
popup.internalResizeFreeze(1)}if(this.grid.getSelectedRow()===undefined){const firstItem=this.datasSearch.findVisibleData(src=>src.itModel!=null)
if(firstItem)this.grid.setSelectedRows(this.datasSearch.getOffset(firstItem))}}}onKeydown(ev){if(ev.key==="ArrowDown"){const grid=DOMSH.findHost(this).grid
const countRows=grid.dataHolder.countRows()
if(countRows>0){let toSel
const currSel=grid.getSelectedRow()
if(currSel===undefined)toSel=0
else if(currSel<countRows-1)toSel=currSel+1
if(toSel!==undefined){grid.setSelectedRows(toSel)
grid.ensureRowVisible(toSel)}}ev.preventDefault()
ev.stopImmediatePropagation()}else if(ev.key==="ArrowUp"){const grid=DOMSH.findHost(this).grid
const countRows=grid.dataHolder.countRows()
if(countRows>0){let toSel
const currSel=grid.getSelectedRow()
if(currSel>0)toSel=currSel-1
if(toSel!==undefined){grid.setSelectedRows(toSel)
grid.ensureRowVisible(toSel)}}ev.preventDefault()
ev.stopImmediatePropagation()}else if(ev.key==="Enter"){const grid=DOMSH.findHost(this).grid
const currSel=grid.getSelectedRow()
if(currSel!=undefined){const row=grid.dataHolder.getRow(currSel)
if(row)DOMSH.findHost(this).onSelect(row.rowDatas)}ev.preventDefault()
ev.stopImmediatePropagation()}}async createItem(){const self=DOMSH.findHost(this)
const{ItemCreator:ItemCreator}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/itemCreator.js")
const conf=BASIS.newInit(self.itemCreator,self.reg)
if(self.search.value)conf.nameBuilder=function(){return this.nameInput.value||SRC.filterPartUri(self.search.value)}
const shortDesc=await ItemCreator.openCreateItem(conf,"Créer un item...",this).onNextClose()
self.onSelect(shortDesc)}}REG.reg.registerSkin("wsp-fastfind-item",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\t/*width: 90vw;*/\n\t\t/*max-width: 50em;*/\n\t\t/*--row-inSel-unfocus-bgcolor: var(--row-inSel-bgcolor);*/\n\t}\n\n\t[hidden] {\n\t\tdisplay: none;\n\t}\n\n\t#title {\n\t\tbackground-color: var(--dialog-bgcolor);\n\t\tcolor: var(--dialog-color);\n\t\tpadding: .1em;\n\t}\n\n\t#head {\n\t\tdisplay: flex;\n\t\tflex-direction: row-reverse;\n\t\tmin-height: fit-content;\n\t\tmin-width: 0;\n\t}\n\n\tinput {\n\t\tbackground: .1em / 1em no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/dialogs/fastFindItems/fastFind_filter.svg) var(--form-search-bgcolor);\n\t\tbackground-position: left;\n\t\tcolor: var(--form-color);\n\t\tborder: none;\n\t\tpadding-block: 2px;\n\t\tpadding-inline: 1.2em 2px;\n\t\twidth: 100%;\n\t\tborder-inline-start: 1px solid var(--border-color);\n\t\tfont-size: inherit;\n\t}\n\n\tinput:focus {\n\t\toutline: var(--focus-outline);\n\t\toutline-offset: -2px;\n\t}\n\n\tc-grid,\n\twsp-subitems-tree {\n\t\tflex: 1;\n\t\tmin-height: 10em;\n\t}\n\n`)
customElements.define("wsp-fastfind-item",FastFindItem)
const EMPTY_LOADING=JSX.createElement("section",null,"Chargement en cours...")
const EMPTY_FILTERED=JSX.createElement("section",null,JSX.createElement("div",null,"Aucun item trouvé"),JSX.createElement("hr",null),JSX.createElement("section",{style:"text-align:start;"},JSX.createElement("h4",{style:"margin:.5em"},"Syntaxe de recherche :"),JSX.createElement("ul",null,JSX.createElement("li",null,JSX.createElement("b",null,"X"),' : le code l\'item ou le titre contient la chaine \"X\"'),JSX.createElement("li",null,JSX.createElement("b",null,"S/"),' : un espace ancêtre contient la chaine \"S\"'),JSX.createElement("li",null,JSX.createElement("b",null,"<")," : l\'item a été modifié aujourd\'hui"),JSX.createElement("li",null,JSX.createElement("b",null,"<N")," : l\'item a été modifié il y a moins de N jours inclus"),JSX.createElement("li",null,JSX.createElement("b",null,"<7 sp/item titre")," : combinaison des critères..."))))
const EMPTY_NORESULT=JSX.createElement("section",null,JSX.createElement("div",null,"Aucun item"))
export class ReqFastFind{constructor(wsp){this.wsp=wsp
this._stamp=0}initReq(fields,uriRoot,restrictions){this.uriRoot=uriRoot
const mainCrit=(new SearchItems).excludeTildeRoot().excludeAirItems(false).includeDrfErased(this.wsp.wspDefProps.drfRefWsp!=null)
this._req=JSX.asXml(()=>JSX.createElement("request",null,JSX.createElement("select",null,Array.isArray(fields)?fields.map(f=>JSX.asXml(()=>JSX.createElement("column",{dataKey:f}))):JSX.createElement("columns",{dataKeys:fields})),JSX.createElement("where",null,mainCrit.toDom(),restrictions?restrictions.toDom():undefined)))
this._itemsExp=this._req.querySelector("exp[type=Items]")
if(uriRoot)this._itemsExp.setAttribute("beforeEndFolder",uriRoot+"/")
this._restrictionExp=this._itemsExp.nextElementSibling
this._selectReq=this._req.firstElementChild
return this}updateParams(params){const newTxt=params.uriFilter.toLowerCase()
if(this._textToSearch===newTxt)return false
this._stamp++
this._textToSearch=newTxt
return true}getStartReq(max){this._selectReq.setAttribute("max",max.toString())
if(this.uriRoot)this._itemsExp.setAttribute("afterUri",this.uriRoot+"/")
else this._itemsExp.removeAttribute("afterUri")
let next=this._itemsExp.nextElementSibling
while(next!==this._restrictionExp){next.remove()
next=this._itemsExp.nextElementSibling}const crit=this.parseTextToSearch(this._textToSearch)
if(crit.after)this.appendExp("LastModif","op",">=","value",crit.after.toString())
for(const text of crit.texts){if(text)this.appendExp("ItemCodeOrTitle","regexp",`(?i).*${LANG.escape4RegexpFuzzy(text)}.*`)}for(const sp of crit.spaces){if(sp)this.appendExp("RegexpUri","regexp",`(?i).*${LANG.escape4RegexpFuzzy(sp)}.*/.*`)}this._itemsExp.removeAttribute("beforeEndFolder")
return DOM.ser(this._req)}getNextReq(afterSrcUri,max){this._selectReq.setAttribute("max",max.toString())
this._itemsExp.setAttribute("afterUri",afterSrcUri)
this._itemsExp.removeAttribute("beforeEndFolder")
return DOM.ser(this._req)}getReplaceFolderReq(folderUri,max){this._selectReq.setAttribute("max",max.toString())
const path=folderUri+"/"
this._itemsExp.setAttribute("afterUri",path)
this._itemsExp.setAttribute("beforeEndFolder",path)
return DOM.ser(this._req)}getStamp(){return this._stamp}isSameStamp(stamp){return stamp===this._stamp}parseTextToSearch(t){let after
const spaces=[]
const texts=[]
const findAfter=/(^|[^\\])<(\d*)/.exec(t)
if(findAfter){const days=findAfter[2]?Number.parseInt(findAfter[2]):0
const d=new Date
d.setTime(d.getTime()-864e5*days)
d.setHours(0,0,0,0)
after=d.getTime()
t=t.substring(0,findAfter.index+findAfter[1].length)+" "+t.substring(findAfter.index+findAfter[0].length)}t=t.replace(/\\ /," ")
const fragments=t.split(/ +/)
let i=fragments.length-1
for(;i>=0;i--){const frag=fragments[i]
const findSlash=/(^|[^\\])\/((?:[^\/]|\\\/)*)$/.exec(frag)
if(findSlash){spaces.push(frag.substring(0,findSlash.index+findSlash[1].length))
texts.push(findSlash[2].replace(/\\\//,"/"))
for(i--;i>=0;i--){spaces.push(fragments[i])}break}texts.push(frag.replace(/\\\//,"/"))}return{after:after,spaces:spaces,texts:texts}}appendExp(type,...atts){const exp=this._itemsExp.ownerDocument.createElement("exp")
exp.setAttribute("type",type)
for(let i=0;i<atts.length;i++)exp.setAttribute(atts[i],atts[++i])
this._itemsExp.parentElement.insertBefore(exp,this._restrictionExp)
return exp}}
//# sourceMappingURL=fastFindItem.js.map