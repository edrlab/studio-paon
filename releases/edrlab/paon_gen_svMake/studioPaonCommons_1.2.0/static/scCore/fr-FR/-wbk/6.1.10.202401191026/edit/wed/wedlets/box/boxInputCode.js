import{EWedletEditMode,EWedletEditModeLabel,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{AgEltBoxSelection}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxSel.js"
import{insertAnnot,removeAnnot}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{Compartment,EditorState,StateEffect,StateField}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/state.js"
import{Decoration,EditorView,highlightSpecialChars,keymap}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/view.js"
import{indentOnInput,LanguageDescription,LanguageSupport}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/language.js"
import{StreamLanguage}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/stream-parser.js"
import{RangeSet,RangeSetBuilder}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/rangeset.js"
import{foldGutter,foldKeymap}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/fold.js"
import{Text}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/text.js"
import{lineNumbers}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/gutter.js"
import{defaultKeymap,defaultTabBinding}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/commands.js"
import{bracketMatching}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/matchbrackets.js"
import{closeBrackets,closeBracketsKeymap}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/closebrackets.js"
import{autocompletion,completionKeymap}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/autocomplete.js"
import{commentKeymap}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/comment.js"
import{defaultHighlightStyle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/highlight.js"
import{oneDark}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/theme-one-dark.js"
import{AgEltBoxInsertDrawerBox}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/insMgr.js"
import{isXmlMsg,XmlBatch,XmlInsertMsg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{isSkTextAnnot}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaAnnots.js"
import{SkSearchTextAnnot}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaSearch.js"
import{UiThemeDeskFeat}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/plugins/optionsPlg.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{WED}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedCore.js"
import{BoxModel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/box.js"
class BoxModelCm extends BoxModel{findBoxInputCode(wedlet){return DOMSH.findFlatNext(wedlet.element,wedlet.element,n=>n instanceof BoxInputCode)}}WED.registerWedletModel("BoxCm",BoxModelCm)
export class InputCode extends HTMLElement{}export class BoxInputCode extends InputCode{constructor(){super(...arguments)
this.batching=false
this.redrawAnnotRequest=0}get selMode(){return"caret"}configWedletElt(tpl,wedlet){var _a
this.wedlet=wedlet
const wedMgr=wedlet.wedMgr
wedMgr.listeners.on("getCurrentSel",getCurrentSel,-10)
wedMgr.listeners.on("hookMsgForNextSel",hookMsgForNextSel);(_a=wedlet.element)===null||_a===void 0?void 0:_a.setDelegatedHost(this)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
WEDLET.installSkins(tpl,sr,this.wedlet,this.localName)
this.addEventListener("keydown",this.onKeyDown)
this.addEventListener("dblclick",this.onDbClick)
const langTypeProvSvc=tpl.getAttribute("langTypeProvSvc")
if(langTypeProvSvc)this.langTypeProvider=wedMgr.reg.getSvc(langTypeProvSvc)
this.setLangTypeDef(tpl.getAttribute("langType"))
const currentLangSvc=tpl.getAttribute("currentLangSvc")
if(currentLangSvc){const currentLang=wedMgr.reg.getSvc(currentLangSvc)
if(currentLang)currentLang(this,tpl)
else console.warn(`loading wed: currentLangSvc '${currentLangSvc}' not found`)}}setLangTypeDef(langTypeDef){if(this.langTypeDef===langTypeDef)return
if(!langTypeDef){this.langTypeDef=null
this.langType=null}else{this.langTypeDef=langTypeDef
this.langType=this.langTypeProvider?this.langTypeProvider(langTypeDef)||defaultLangTypeProvider(langTypeDef):defaultLangTypeProvider(langTypeDef)
if(this.langType instanceof Promise)this.langType.then(ext=>{this.langType=ext})}if(this.cmView){if(this.langType instanceof Promise){const langTypeDef=this.langTypeDef
this.langType.then(ext=>{if(langTypeDef!==this.langTypeDef)return
this.cmView.dispatch({effects:langTypeConf.reconfigure(ext)})})}else{this.cmView.dispatch({effects:langTypeConf.reconfigure(this.langType||[])})}}}setDiffLangTypeDef(langTypeDef){if(this.diffLangTypeDef===langTypeDef)return
if(!langTypeDef){this.diffLangTypeDef=null
this.diffLangType=null}else{this.diffLangTypeDef=langTypeDef
this.diffLangType=this.langTypeProvider?this.langTypeProvider(langTypeDef)||defaultLangTypeProvider(langTypeDef):defaultLangTypeProvider(langTypeDef)
if(this.diffLangType instanceof Promise)this.diffLangType.then(ext=>{this.diffLangType=ext})}}setCmTheme(ext){var _a,_b;(_a=this.cmView)===null||_a===void 0?void 0:_a.dispatch({effects:themeConf.reconfigure(ext)});(_b=this.getDiffEditor())===null||_b===void 0?void 0:_b.dispatch({effects:themeConf.reconfigure(ext)})}setEditMode(mode){var _a
DOM.setAttr(this,"edit-mode",EWedletEditModeLabel[mode]);(_a=this.cmView)===null||_a===void 0?void 0:_a.dispatch({effects:readOnlyConf.reconfigure(EditorView.editable.of(mode===EWedletEditMode.write))})}refreshBindValue(val,children){if(this.batching)return
const state=EditorState.create({doc:val||Text.empty,extensions:this.addTheme(this.addLangType([lineNumbers(),highlightSpecialChars(),foldGutter(),indentOnInput(),defaultHighlightStyle.fallback,bracketMatching(),closeBrackets(),autocompletion(),EditorState.tabSize.of(2),annotsField.extension,readOnlyConf.of(EditorView.editable.of(WEDLET.isWritableWedlet(this.wedlet))),keymap.of([...closeBracketsKeymap,...defaultKeymap,...foldKeymap,...commentKeymap,...completionKeymap,defaultTabBinding])]))})
if(this.cmView){this.cmView.setState(state)}else{this.cmView=new EditorView({state:state,parent:this.shadowRoot,root:this.shadowRoot,dispatch:this.cmDispatch.bind(this)})
this.focusableElement=this.cmView.contentDOM}}cmDispatch(tr){if(tr.docChanged){this.batching=true
this.wedlet.wedMgr.freezeFocus=true
try{if(this.wedlet.isVirtual()){WEDLET.insertDatasFromDisplay(this.wedlet,null,tr.newDoc.sliceString(0))}else{const batch=this.wedlet.wedMgr.docHolder.newBatch()
tr.changes.iterChanges((fromA,toA,fromB,toB,inserted)=>{if(inserted.length>0){batch.spliceSequence(XA.append(this.wedlet.wedAnchor,fromA),toA-fromA,inserted.sliceString(0))}else if(toA>fromA){batch.deleteSequence(XA.append(this.wedlet.wedAnchor,fromA),toA-fromA)}batch.needAdjustForNextAdds()})
batch.doBatch()}this.cmView.update([tr])}finally{this.batching=false
this.wedlet.wedMgr.freezeFocus=false}}else{this.cmView.update([tr])}}insertChars(from,chars,msg){if(this.batching)return
this.cmView.update([this.cmView.state.update({changes:{from:from,insert:chars}})])}deleteChars(from,len,msg){if(this.batching)return
this.cmView.update([this.cmView.state.update({changes:{from:from,to:from+len}})])}replaceChars(chars,msg){if(this.batching)return
this.cmView.update([this.cmView.state.update({changes:{from:0,to:this.cmView.state.doc.length,insert:chars}})])}isEmpty(){return this.cmView.state.doc.length===0}drawAnnot(annot){if(annot instanceof SkSearchTextAnnot){this.planRedrawAnnots()}else{insertAnnot(this,annot)}return true}eraseAnnot(annot){if(annot instanceof SkSearchTextAnnot){this.planRedrawAnnots()
return true}else{return removeAnnot(this,annot)}}planRedrawAnnots(){if(!this.redrawAnnotRequest)this.redrawAnnotRequest=window.requestIdleCallback(this._redrawAnnotExecutor||(this._redrawAnnotExecutor=this.redrawAnnotExecutor.bind(this)))}redrawAnnotExecutor(){this.redrawAnnotRequest=0
if(!this.isConnected)return
const wedMgr=this.wedlet.wedMgr
const newAnnots=wedMgr.docHolder.getAnnots(this.wedlet.wedAnchor)
const annotValues=[]
for(let a of newAnnots){if(isSkTextAnnot(a)){const start=a.offsetStart
annotValues.push({from:start,to:start+a.len,type:searchMark})}}this.cmView.dispatch({effects:annotsEffect.of(annotValues)})}focusSkAnnot(annot){if(isSkTextAnnot(annot)){const start=annot.offsetStart
this.focusableElement.focus()
this.cmView.dispatch({selection:{head:start,anchor:start+annot.len},scrollIntoView:true})
return true}return false}makeInputForDiff(annot){const state=EditorState.create({doc:annot.otherValue,extensions:this.addTheme(this.addDiffLangType([lineNumbers(),highlightSpecialChars(),foldGutter(),defaultHighlightStyle.fallback,EditorState.tabSize.of(2),EditorView.editable.of(false),keymap.of([...defaultKeymap,...foldKeymap])]))})
const cmView=new EditorView({state:state,root:this.shadowRoot})
return cmView.dom}onKeyDown(ev){if(ev.key==="Tab"&&(!ACTION.isAnyControlPressed(ev)||ev.shiftKey)){ev.stopImmediatePropagation()}else if(ACTION.isAccelPressed(ev)){if(ev.key===" "){ev.stopImmediatePropagation()}}}onDbClick(ev){ev.stopImmediatePropagation()}addLangType(exts){if(this.langType instanceof Promise){const langTypeDef=this.langTypeDef
this.langType.then(ext=>{if(langTypeDef!==this.langTypeDef)return
this.cmView.dispatch({effects:langTypeConf.reconfigure(ext)})})
exts.push(langTypeConf.of([]))}else if(this.langType!=null){exts.push(langTypeConf.of(this.langType))}else{exts.push(langTypeConf.of([]))}return exts}addDiffLangType(exts){if(this.diffLangType instanceof Promise){const langTypeDef=this.diffLangType
this.diffLangType.then(ext=>{var _a
if(langTypeDef!==this.diffLangType)return;(_a=this.getDiffEditor())===null||_a===void 0?void 0:_a.dispatch({effects:langTypeConf.reconfigure(ext)})})
exts.push(langTypeConf.of([]))}else if(this.diffLangType!=null){exts.push(langTypeConf.of(this.diffLangType))}else if(this.langType instanceof Promise){const langTypeDef=this.diffLangType
this.langType.then(ext=>{var _a
if(langTypeDef!==this.diffLangType)return;(_a=this.getDiffEditor())===null||_a===void 0?void 0:_a.dispatch({effects:langTypeConf.reconfigure(ext)})})
exts.push(langTypeConf.of([]))}else{exts.push(langTypeConf.of(this.langType||[]))}return exts}getDiffEditor(){var _a
const ed=(_a=DOM.findFirstChild(this.shadowRoot,n=>n.localName==="wed-diff-value"))===null||_a===void 0?void 0:_a.firstElementChild
return ed===null||ed===void 0?void 0:ed.cmView.view}addTheme(exts){exts.push(getCmTheme())
return exts}}AgEltBoxInsertDrawerBox(AgEltBoxSelection(BoxInputCode,{}))
REG.reg.registerSkin("box-input-code",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t  border-bottom: 1px solid var(--border-color);\n  }\n\n  :host([aria-multiline='true']) {\n\t  border: 1px solid var(--border-color);\n  }\n\n  .cm-scroller {\n\t  overflow: auto;\n\t  font-family: var(--font-mono, 'monospace') !important;\n\t  font-size: .9em;\n  }\n\n  .cm-editor:not(.cm-focused) {\n\t  background-color: unset !important;\n  }\n\n  .cm-editor.cm-focused {\n\t  outline: var(--edit-caret-focus) !important;\n\t  background-color: var(--edit-bgcolor) !important;\n  }\n\n  .cm-gutters,\n  .cm-foldPlaceholder {\n\t  background-color: unset !important;\n\t  color: var(--fade-color) !important;\n\t  border-color: var(--border-color) !important;\n  }\n\n  .cm-gutter {\n\t  user-select: none;\n  }\n\n  .cm-searchMatch {\n\t  background-color: var(--edit-search-bgcolor) !important;\n\t\toutline: none !important;\n\t}\n\n\t::selection {\n\t\tcolor: currentColor !important;\n\t\tbackground-color: var(--edit-seltext-bgcolor) !important;\n\t}\n\n\t::-webkit-scrollbar {\n\t\twidth: .6em;\n\t}\n\n\t::-webkit-scrollbar-track {\n\t\tbackground-color: var(--scroll-color);\n\t\tfilter: opacity(.1);\n\t}\n\n\t::-webkit-scrollbar-thumb {\n\t\tborder-radius: .2em;\n\t\tbox-shadow: inset 0 0 .3em var(--scroll-thumb-color);\n\t}\n`)
window.customElements.define("box-input-code",BoxInputCode)
function getCurrentSel(wedMgr){var _a
const focus=wedMgr.lastFocus
if((_a=focus)===null||_a===void 0?void 0:_a.cmView){const boxCodeEdit=DOMSH.findHost(focus)
if(boxCodeEdit){const rg=focus.cmView.view.state.selection.main
const xa=boxCodeEdit.wedlet.wedAnchor
return{start:XA.freeze(XA.append(xa,rg.from)),end:XA.freeze(XA.setAtDepth(xa,-1,rg.to)),startInText:true,endInText:true}}}return undefined}function hookMsgForNextSel(wedMgr,transac,msg){if(!msg)return
if(wedMgr.docHolderAsync.isMsgFromUs(transac)){if(msg instanceof XmlBatch&&msg.selAfter){const wedlet=WEDLET.findWedlet(wedMgr.rootWedlet,msg.selAfter.addr,{lastAncestorIfNone:true})
if((wedlet===null||wedlet===void 0?void 0:wedlet.model)instanceof BoxModelCm){const input=wedlet.model.findBoxInputCode(wedlet)
if(input===null||input===void 0?void 0:input.cmView){input.focusableElement.focus()
const anchor=XA.last(msg.selAfter.end||msg.selAfter.addr)||0
const head=msg.selAfter.end?XA.last(msg.selAfter.addr)||0:undefined
input.cmView.dispatch({selection:{anchor:anchor,head:head}})
return true}}}else if(isXmlMsg(msg)){const wedlet=WEDLET.findWedlet(wedMgr.rootWedlet,msg.xa,{lastAncestorIfNone:true})
if((wedlet===null||wedlet===void 0?void 0:wedlet.model)instanceof BoxModelCm){const input=wedlet.model.findBoxInputCode(wedlet)
if(input===null||input===void 0?void 0:input.cmView){input.focusableElement.focus()
const start=XA.last(msg.xa)
if(msg instanceof XmlInsertMsg){input.cmView.dispatch({selection:{anchor:start+msg.len,head:start}})}else{input.cmView.dispatch({selection:{anchor:start}})}return true}}}}}const themeConf=new Compartment
const darkTheme=oneDark
const ligthTheme=[]
let themeIsDark
export function getCmTheme(){if(themeIsDark===undefined){if(desk&&UiThemeDeskFeat.isIn(desk)){themeIsDark=desk.currentTheme?desk.currentTheme.isDark:window.matchMedia("(prefers-color-scheme: dark)").matches
desk.onThemeChange.add(theme=>{const newState=(theme===null||theme===void 0?void 0:theme.isDark)||false
if(newState!==themeIsDark){themeIsDark=newState
const newExt=themeIsDark?darkTheme:ligthTheme
DOMSH.findFlatNext(document.body,document.body,n=>{if(n instanceof BoxInputCode)n.setCmTheme(newExt)
return false})}})}else{themeIsDark=window.matchMedia("(prefers-color-scheme: dark)").matches}}return themeConf.of(themeIsDark?darkTheme:ligthTheme)}const searchMark=Decoration.mark({class:"cm-searchMatch"})
const annotsEffect=StateEffect.define()
const annotsField=StateField.define({create(){return RangeSet.empty},update(marks,tr){for(let e of tr.effects)if(e.is(annotsEffect)){const rgBd=new RangeSetBuilder
for(let annot of e.value){rgBd.add(annot.from,annot.to,annot.type)}return rgBd.finish()}return marks.map(tr.changes)},provide:f=>EditorView.decorations.from(f)})
const readOnlyConf=new Compartment
const langTypeConf=new Compartment
const langTypeMap=new Map
function fetchLang(def,lib,fun,params){const promise=lib.then(l=>{const ext=l[fun](params)
langTypeMap.set(def,ext)
return ext})
langTypeMap.set(def,promise)
return promise}function fetchLangDyn(def,lib,build){const promise=lib.then(l=>{const ext=build(l)
langTypeMap.set(def,ext)
return ext})
langTypeMap.set(def,promise)
return promise}function fetchLegacyLang(def,lib,key){const promise=lib.then(l=>{const streamParser=l[key]
const ext=new LanguageSupport(StreamLanguage.define(streamParser))
langTypeMap.set(def,ext)
return ext})
langTypeMap.set(def,promise)
return promise}export function defaultLangTypeProvider(def){const idx=def===null||def===void 0?void 0:def.indexOf(":")
let params
if(idx>0){def=def.substring(0,idx)
params=JSON.parse(def.substring(idx+1))}let langType=langTypeMap.get(def)
if(langType!==undefined)return langType
switch(def){case"text/css":return fetchLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/lang-css.js"),"css")
case"text/x-csrc":case"text/x-c++src":return fetchLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/lang-cpp.js"),"cpp")
case"text/html":return fetchLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/lang-html.js"),"html")
case"text/x-java":return fetchLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/lang-java.js"),"java")
case"text/javascript":return fetchLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/lang-javascript.js"),"javascript",{jsx:false,typescript:false})
case"text/typescript":return fetchLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/lang-javascript.js"),"javascript",{jsx:false,typescript:true})
case"text/jsx":return fetchLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/lang-javascript.js"),"javascript",{jsx:true,typescript:false})
case"text/tsx":return fetchLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/lang-javascript.js"),"javascript",{jsx:true,typescript:true})
case"application/json":case"application/ld+json":return fetchLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/lang-json.js"),"json")
case"text/x-markdown":buildDefaultLangDesc()
return fetchLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/lang-markdown.js"),"markdown",Object.assign({codeLanguages:LANG_DESCS},params))
case"text/x-python":case"text/x-cython":return fetchLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/lang-python.js"),"python",params)
case"text/x-rustsrc":return fetchLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/lang-rust.js"),"rust",params)
case"text/x-sql":return fetchLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/lang-sql.js"),"sql",params)
case"text/x-mysql":return fetchLangDyn(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/lang-sql.js"),lib=>lib.sql(Object.assign({dialect:lib.MySQL},params)))
case"text/x-mariadb":return fetchLangDyn(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/lang-sql.js"),lib=>lib.sql(Object.assign({dialect:lib.MariaSQL},params)))
case"text/x-mssql":return fetchLangDyn(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/lang-sql.js"),lib=>lib.sql(Object.assign({dialect:lib.MSSQL},params)))
case"text/x-pgsql":return fetchLangDyn(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/lang-sql.js"),lib=>lib.sql(Object.assign({dialect:lib.PostgreSQL},params)))
case"text/x-plsql":return fetchLangDyn(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/lang-sql.js"),lib=>lib.sql(Object.assign({dialect:lib.PLSQL},params)))
case"application/xml":return fetchLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/lang-xml.js"),"xml",params)
case"text/x-diff":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/diff.js"),"diff")
case"text/x-dockerfile":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/dockerfile.js"),"dockerFile")
case"application/xml-dtd":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/dtd.js"),"dtd")
case"text/x-mathematica":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/mathematica.js"),"mathematica")
case"text/x-nginx-conf":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/nginx.js"),"nginx")
case"text/x-octave":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/octave.js"),"octave")
case"text/x-perl":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/perl.js"),"perl")
case"application/x-powershell":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/powershell.js"),"powerShell")
case"text/x-properties":case"text/x-ini":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/properties.js"),"properties")
case"text/x-rsrc":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/r.js"),"r")
case"text/x-ruby":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/ruby.js"),"ruby")
case"text/x-sh":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/shell.js"),"shell")
case"text/x-stex":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/stex.js"),"stex")
case"text/x-swift":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/swift.js"),"swift")
case"text/x-vb":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/vb.js"),"vb")
case"text/x-yaml":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/yaml.js"),"yaml")
case"text/x-csharp":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/clike.js"),"csharp")
case"text/x-objectivec":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/clike.js"),"objectiveC")
case"text/x-scala":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/clike.js"),"scala")
case"x-shader/x-vertex":case"x-shader/x-fragment":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/clike.js"),"shader")
case"text/x-squirrel":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/clike.js"),"squirrel")
case"text/x-ceylon":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/clike.js"),"ceylon")
case"text/x-kotlin":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/clike.js"),"kotlin")
case"text/x-nesc":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/clike.js"),"nesC")
case"text/x-cmake":return fetchLegacyLang(def,import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/legacy-modes/cmake.js"),"cmake")
default:return null}}export const LANG_DESCS=[]
export function buildDefaultLangDesc(){if(LANG_DESCS.length>0)return
function def(name,mime){return{name:name,load:async()=>defaultLangTypeProvider(mime)}}LANG_DESCS.push(LanguageDescription.of(def("css","text/css")),LanguageDescription.of(def("html","text/html")),LanguageDescription.of(def("java","text/x-java")),LanguageDescription.of(def("xml","application/xml")))}
//# sourceMappingURL=boxInputCode.js.map