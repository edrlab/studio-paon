import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{installSrcViewFileDrop,newSrcView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemMain.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{EditorView,highlightSpecialChars,keymap}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/view.js"
import{Compartment,EditorState}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/state.js"
import{lineNumbers}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/gutter.js"
import{foldGutter,foldKeymap}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/fold.js"
import{indentOnInput}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/language.js"
import{defaultHighlightStyle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/highlight.js"
import{bracketMatching}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/matchbrackets.js"
import{closeBrackets}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/closebrackets.js"
import{autocompletion,completionKeymap}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/autocomplete.js"
import{defaultKeymap,defaultTabBinding}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/commands.js"
import{commentKeymap}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/comment.js"
import{defaultLangTypeProvider,getCmTheme}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxInputCode.js"
import{history,historyKeymap,redo,undo}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/history.js"
import{searchKeymap}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/codemirror/search.js"
import{Resizer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/resizer.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{AccelKeyMgr,Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{createCmEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLiveCm.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{EWspWorkingSt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
export class ItemCodeEd extends BaseElement{setLangTypeDef(langTypeDef){if(this.langTypeDef===langTypeDef)return
if(!langTypeDef){this.langTypeDef=null
this.langType=null}else{this.langTypeDef=langTypeDef
this.langType=this.conf.langTypeProvider?this.conf.langTypeProvider(langTypeDef)||defaultLangTypeProvider(langTypeDef):defaultLangTypeProvider(langTypeDef)
if(this.langType instanceof Promise)this.langType.then(ext=>{this.langType=ext})}if(this.cmEditor){if(this.langType instanceof Promise){const langTypeDef=this.langTypeDef
this.langType.then(ext=>{if(langTypeDef!==this.langTypeDef)return
this.cmEditor.editorView.dispatch({effects:langTypeConf.reconfigure(ext)})})}else{this.cmEditor.editorView.dispatch({effects:langTypeConf.reconfigure(this.langType||[])})}}}save(){this.cmEditor.save()}_initialize(init){this.reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.reg.installSkin("scroll/large",sr)
installSrcViewFileDrop(this.reg,this)
if(init.renderView){this.parentEd=JSX.createElement("div",{id:"edParent","c-resizable":""})
sr.append(this.parentEd,JSX.createElement(Resizer,{"c-orient":init.renderOrient||"row"}))
newSrcView(init.renderView,this.reg).then(v=>{sr.appendChild(v)})}this.conf=init
this.place=init.place||this.reg.env.universe.wspServer.wspsLive.newPlace()
this.setLangTypeDef(init.langTypeDef)
this.reg.env.longDescChange.add((ldNew,ldOld)=>{if(!LANG.arrayEquals(ldNew.srcRoles,ldOld.srcRoles))this.refreshReadWriteState()})
const options=[this.initLangType(),lineNumbers(),highlightSpecialChars(),foldGutter(),defaultHighlightStyle.fallback,EditorState.tabSize.of(2),getCmTheme(),keymap.of([...defaultKeymap,...foldKeymap])]
if(this.conf.noEdit){options.push(EditorView.editable.of(false))}else{options.push(this.initReadWriteState(),history(),indentOnInput(),bracketMatching(),closeBrackets(),autocompletion(),keymap.of([...historyKeymap,...searchKeymap,...commentKeymap,...completionKeymap,defaultTabBinding]))
this.barActions=JSX.createElement(BarActions,{"î":{actions:this.reg.getList("actions:wsp-item-code-ed"),actionContext:this}});(this.parentEd||this.shadowRoot).appendChild(this.barActions)
const accels=this.reg.getListAsMap("accelkeys:wsp-item-code-ed")
if(accels){this.accelKeyMgr=(new AccelKeyMgr).initFromMapActions(accels)
this.addEventListener("keydown",(function(ev){this.accelKeyMgr.handleKeyboardEvent(ev,this)}))}}this.cmEditor=createCmEditor(this.getSrcUriToEdit(),this.reg,options,this.shadowRoot)
this.cmEditor.contentEvents.on("onCtStateChange",(state,e)=>{var _a,_b;(_a=this.saveBtn)===null||_a===void 0?void 0:_a.classList.toggle("saving",state==="saving");(_b=this.barActions)===null||_b===void 0?void 0:_b.refreshContent()})
this.cmEditor.contentEvents.on("onLock",this.refreshReadWriteState.bind(this));(this.parentEd||this.shadowRoot).appendChild(this.cmEditor.editorView.dom)}onViewShown(){this.place.setState(this.cmEditor.wspUri,EWspWorkingSt.r)}onViewHidden(closed){this.place.setState(this.cmEditor.wspUri,EWspWorkingSt.none)
if(closed)this.cmEditor.close()}getSrcUriToEdit(){return this.conf.srcUri||this.reg.env.itemType.getMainStreamSrcUri(this.reg.env.longDesc)}initLangType(){if(this.langType instanceof Promise){const langTypeDef=this.langTypeDef
this.langType.then(ext=>{if(langTypeDef!==this.langTypeDef)return
this.cmEditor.editorView.dispatch({effects:langTypeConf.reconfigure(ext)})})}else if(this.langType!=null){return langTypeConf.of(this.langType)}return langTypeConf.of([])}initReadWriteState(){return readOnlyConf.of(EditorView.editable.of(this.reg.hasPerm(this.writePermToCheck())))}refreshReadWriteState(){const writable=this.evalWritable()
if(this.cmEditor.editorView.state.facet(EditorView.editable)!==writable){this.cmEditor.editorView.dispatch({effects:readOnlyConf.reconfigure(EditorView.editable.of(writable))})
this.barActions.refreshContent()}}evalWritable(){return this.cmEditor.lockedBy==null&&this.reg.hasPerm(this.writePermToCheck())}writePermToCheck(){return this.conf.writePerms||"action.itemCodeEd#edit"}}REG.reg.registerSkin("wsp-item-code-ed",1,`\n\t:host,\n\t#edParent {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\tc-resizer[c-orient=row] {\n\t\twidth: 1px;\n\t}\n\n\tc-resizer[c-orient=column] {\n\t\theight: 1px;\n\t}\n\n\tc-bar-actions {\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\t.saving {\n\t\t--icon-color: red;\n\t}\n\n\t.cm-editor {\n\t\tflex: 1;\n\t\toutline: var(--edit-caret-focus) !important;\n\t\tbackground-color: var(--edit-bgcolor) !important;\n\t\toverflow: auto !important;\n\t}\n\n\t.cm-scroller {\n\t\toverflow: auto;\n\t\tfont-family: var(--font-mono, 'monospace') !important;\n\t}\n\n\t.cm-gutters,\n\t.cm-tooltip,\n\t.cm-foldPlaceholder {\n\t\tbackground-color: var(--bgcolor) !important;\n\t\tcolor: var(--fade-color) !important;\n\t\tborder-color: var(--border-color) !important;\n\t}\n\n\t.cm-gutter {\n\t\tuser-select: none;\n\t}\n\n\t.cm-searchMatch {\n\t\tbackground-color: var(--edit-search-bgcolor) !important;\n\t\toutline: none !important;\n\t}\n\n\t::selection {\n\t\tcolor: currentColor !important;\n\t\tbackground-color: var(--edit-seltext-bgcolor) !important;\n\t}\n`)
customElements.define("wsp-item-code-ed",ItemCodeEd)
const langTypeConf=new Compartment
const readOnlyConf=new Compartment
function addAction(action,sort,accel){REG.reg.addToList("actions:wsp-item-code-ed",action.getId(),1,action,sort)
if(accel)REG.reg.addToList("accelkeys:wsp-item-code-ed",accel,1,action)}addAction(new Action("save").setLabel("Enregistrer").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/save.svg").setVisible(ctx=>ctx.cmEditor.lockedBy==null).setEnabled(ctx=>ctx.cmEditor.contentState==="dirty").setExecute(ctx=>{ctx.save()}).override("initButtonNode",(buttonNode,ctx)=>{ctx.saveBtn=buttonNode}),10,"s-accel")
class LockAction extends Action{constructor(){super("lock")
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/widgets/itemEditor/editing.svg")
this.setDescription("Ce contenu n\'est pas éditable car il est actuellement en cours d\'édition.")}isVisible(ctx){return this.getLockedBy(ctx)!=null}getLabel(ctx){const lock=this.getLockedBy(ctx)
return lock?"Édité par "+lock.account:null}initButtonNode(buttonNode,ctx){buttonNode._hideLabel=false
buttonNode.tabIndexCustom=-2}getLockedBy(ctx){return ctx.cmEditor.lockedBy}}addAction(new LockAction,11)
addAction(new Action("undo").setLabel("Annuler").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/undo.svg").setExecute(ctx=>{if(!undo(ctx.cmEditor.editorView))POPUP.showNotifInfo("Aucune action à annuler",ctx)}),20)
addAction(new Action("redo").setLabel("Refaire").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/redo.svg").setExecute(ctx=>{if(!redo(ctx.cmEditor.editorView))POPUP.showNotifInfo("Aucune action à refaire",ctx)}),21)

//# sourceMappingURL=itemCodeEd.js.map