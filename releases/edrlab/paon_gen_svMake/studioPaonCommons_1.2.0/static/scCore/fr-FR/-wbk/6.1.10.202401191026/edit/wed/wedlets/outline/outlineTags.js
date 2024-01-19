import{WedEditorBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedEditor.js"
import{EOtlType,WED_SELECTOR_OTL}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/outline/outline.js"
import{WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{addDragMgrOnWedletHost,AgInsSelEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/insMgr.js"
export class OtlEditor extends WedEditorBase{static findOtlTree(wedlet){while(wedlet){if(wedlet.otlTree)return wedlet.otlTree
wedlet=wedlet.wedParent}return null}initUi(init){super.initUi(init)
this.wedMgr.listeners.on("redrawBeforeBinds",()=>{const treeRoot=this.rootNode.appendChild(JSX.createElement("div",null)).attachShadow(DOMSH.SHADOWDOM_INIT)
this.wedMgr.reg.installSkin("otl/root",treeRoot)
addDragMgrOnWedletHost(treeRoot)
this.setTreeRoot(treeRoot)})}setTreeRoot(treeRoot){this.treeRoot=treeRoot}initFromDocHolder(docHolder,config){config.wedRootModelSelector=WED_SELECTOR_OTL
config.noFocus=true
return super.initFromDocHolder(docHolder,config)}highlightOtlEntry(otlNode){if(this.currentHighlighted===otlNode)return false
if(this.currentHighlighted)this.currentHighlighted.otlHighlight(false)
if(otlNode)otlNode.otlHighlight(true).otlScrollInView()
this.currentHighlighted=otlNode
return true}onNewOtlWedlet(wedlet){if(!isOtlRootRow(wedlet))return
const treeNode=new OtlTree
treeNode.otlConnect(wedlet)
const parentRowWedlet=findOtlRootRow(wedlet.otlParent)
const nextTreeNode=wedlet.otlParent?this.findOtlTreeFromWrapper(wedlet.otlParent.findNextSiblingHier(wedlet)):null
if(!parentRowWedlet){this.treeRoot.insertBefore(treeNode,nextTreeNode)}else{this.findOtlTreeFromWrapper(parentRowWedlet).otlAddChild(treeNode,nextTreeNode)}}onDeletedOtlWedlet(wedlet){if(wedlet.otlTree){wedlet.otlTree.otlDelete()}else{const options={mainBranch:true}
const scan=wedlet=>{if(wedlet.otlTree){wedlet.otlTree.otlDelete()}else{wedlet.visitWedletChildren(-1,Infinity,scan,options)}}
wedlet.visitWedletChildren(-1,Infinity,scan,options)}}onOtlRowUpdated(){}findOtlTreeFromWrapper(wedlet){if(!wedlet)return null
return DOMSH.findFlatParentElt(wedlet.element,this.rootNode,IS_OtlTree)}}AgInsSelEditor(OtlEditor,WEDLET.VISITOPTIONS_mainBranch)
export class OtlTree extends HTMLElement{configWedletElt(){}otlConnect(wedlet){this.wedlet=wedlet
wedlet.otlTree=this
this.otlRowCtn=this.appendChild(JSX.createElement("div",{class:"row",draggable:"true"}))
this.otlChildrenCtn=this.appendChild(JSX.createElement("div",{class:"children"}))
this.wedlet.insertElement(this.otlRowCtn)}otlAddChild(child,before){this.otlChildrenCtn.insertBefore(child,before)}otlDelete(){this.remove()}otlHighlight(highlighted){this.classList.toggle("highlight",highlighted)
return this}otlScrollInView(){this.otlRowCtn.scrollIntoView({block:"nearest",behavior:"smooth"})
return this}}customElements.define("otl-tree",OtlTree)
function isOtlRootRow(wedlet){return wedlet.otlType!==EOtlType.container&&(!wedlet.otlParent||wedlet.otlParent.otlType!==EOtlType.wrapper)}function findOtlRootRow(wedlet){while(wedlet&&wedlet.otlType===EOtlType.container)wedlet=wedlet.otlParent
if(!wedlet)return null
let parent=wedlet.otlParent
while(parent&&parent.otlType===EOtlType.wrapper){wedlet=parent
parent=wedlet.otlParent}return wedlet}export function IS_OtlTree(n){return n&&DOM.IS_element(n)&&n.localName==="otl-tree"}REG.reg.registerSkin("otl/root",1,`\n\t:host {\n\t\tpadding-bottom: 5vh; /* nécessaire pour éviter bug redraw au drag. */\n\t}\n\n\t[hidden] {\n\t\tdisplay: none !important;\n\t}\n\n\totl-tree {\n\t\tdisplay: block;\n\t\tborder-inline-start: 5px solid transparent;\n\t}\n\n\totl-tree > .row {\n\t\tcursor: pointer;\n\t\tmin-height: 1em;\n\t\tpadding: 2px 0;\n\t}\n\n\n\totl-tree > .children {\n\t\tpadding-bottom: 3px;\n\t\tborder: 1px solid var(--border-color);\n\t\tborder-inline-end: none;\n\t\tborder-radius: 3px;\n\t}\n\n\totl-tree > .children:empty {\n\t\tborder-color: transparent;\n\t}\n\n\totl-tree > .row:hover {\n\t\t/*box-shadow: inset 0px 0px 3px var(--border-color);*/\n\t\tbackground: var(--pressed-bgcolor);\n\t}\n\n\totl-tree.highlight {\n\t\tborder-inline-start-color: var(--border-color);\n\t}\n\n\t.row * {\n\t\tborder: none;\n\t}\n\n\t.v {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t.h {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: row;\n\t\talign-items: center;\n\t}\n\n\t[edit-mode='h'] {\n\t\tdisplay: none;\n\t}\n\n`)

//# sourceMappingURL=outlineTags.js.map