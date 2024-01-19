import{AgEltBoxSelection}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxSel.js"
import{EWedletEditMode,EWedletEditModeLabel,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{AgEltBoxInputAnnotable,removeAnnots}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
class BoxWebFrag extends HTMLElement{configWedletElt(tpl,wedlet){this.wedlet=wedlet
this.disabled=!WEDLET.isWritableWedlet(wedlet)
const wedMgr=wedlet.wedMgr
const reg=wedMgr.reg
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
WEDLET.installSkins(tpl,sr,wedlet,this.localName)
sr.appendChild(JSX.createElement(BarActions,{"î":{reg:reg,actionContext:this,actions:reg.getList("wed:BoxWebFrag:actions"),uiContext:"dialog",disableFullOverlay:true}}))
this.previewFrame=sr.appendChild(JSX.createElement("iframe",null))}setNewFrag(elt){if(!elt)return this.eraseFrag()
const wedlet=this.wedlet
if(!WEDLET.isWritableWedlet(wedlet))return
let xml=""
let vNode=elt.firstChild
while(vNode){xml+=DOM.ser(vNode,false)
vNode=vNode.nextSibling}if(wedlet.isVirtual()){WEDLET.insertDatasFromDisplay(wedlet,null,xml)}else{wedlet.wedMgr.docHolder.newBatch().setText(this.wedlet.wedAnchor,xml).doBatch()}}eraseFrag(){const wedlet=this.wedlet
if(wedlet.isVirtual()||!WEDLET.isWritableWedlet(wedlet))return
wedlet.wedMgr.docHolder.newBatch().deleteSequence(this.wedlet.wedAnchor,1).doBatch()}setEditMode(mode){this.disabled=mode!==EWedletEditMode.write
DOM.setAttr(this,"edit-mode",EWedletEditModeLabel[mode])}refreshBindValue(val){this.xhtmlValue=val
if(this.wedlet.isVirtual())removeAnnots(this)
if(this.previewFrame.contentDocument){this.updateFrameBody()}else{this.previewFrame.onload=this.updateFrameBody.bind(this)}}updateFrameBody(){this.previewFrame.onload=null
const body=this.previewFrame.contentDocument.body
if(!this.xhtmlValue){body.innerHTML=`<div style="font-style: italic; color: gray; text-align: center; margin: 1em; font-family: sans-serif;">Fragment HTML vide</div>`}else{const dom=DOM.parseDomValid(this.xhtmlValue)
if(!dom){body.innerHTML=`<div style="font-style: italic; color:red; text-align: center; margin: 1em; font-family: sans-serif;">Fragment HTML invalide</div>`
body.appendChild(JSX.createElement("pre",null,this.xhtmlValue))}else{body.textContent=null
body.appendChild(body.ownerDocument.importNode(dom.documentElement,true))}}}insertChars(from,chars,msg){this.refreshBindValue(LANG.stringInsert(this.xhtmlValue,from,chars))}deleteChars(from,len,msg){this.refreshBindValue(LANG.stringDelete(this.xhtmlValue,from,len))}replaceChars(chars,msg){this.refreshBindValue(chars)}isEmpty(){return!this.xhtmlValue}}AgEltBoxSelection(AgEltBoxInputAnnotable(BoxWebFrag),{selMode:"box"})
REG.reg.registerSkin("box-web-frag",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: min-content;\n\t\tmin-width: 5em;\n\t\tflex-direction: column;\n\t\tborder: 1px solid var(--border-color);\n\t\tmargin: 0;\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--edit-input-focus);\n\t}\n\n\tc-bar-actions {\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\tiframe {\n\t\twidth: 100%;\n\t\tmin-height: 400px;\n\t\tborder: none;\n\t}\n`)
window.customElements.define("box-web-frag",BoxWebFrag)
class BoxWebFragCopy extends Action{constructor(){super("fragCopy")
this._label="Copier"
this._description="Copier le fragment HTML dans le presse-papier"}async execute(ctx,ev){if(!ctx.xhtmlValue){POPUP.showNotifInfo("Ce fragment est vide",ctx)
return}try{await navigator.clipboard.writeText(ctx.xhtmlValue)}catch(e){POPUP.showNotifForbidden("Copie dans le presse-papier impossible. Vérifiez dans votre navigateur que vous avez autorisé ce site à accéder au presse-papier.",ctx)}}}class BoxWebFragPaste extends Action{constructor(){super("fragPaste")
this._label="Coller"
this._description="Coller le fragment HTML"}isEnabled(ctx){if(ctx.disabled)return false
return super.isEnabled(ctx)}async execute(ctx,ev){let ct
try{ct=await navigator.clipboard.readText()}catch(e){POPUP.showNotifForbidden("Impossible de lire dans le presse-papier. Vérifiez dans votre navigateur que vous avez autorisé ce site à accéder au presse-papier.",ctx)
return}const doc=ct?DOM.parseDomValid(`<body>${ct}</body>`,null,"text/html"):null
if(!doc){POPUP.showNotifInfo("Aucun contenu HTML n\'a pu être reconnu",ctx)
return}ctx.setNewFrag(doc.body)}}class BoxWebFragErase extends Action{constructor(){super("fragErase")
this._label="Effacer"
this._description="Effacer le fragment HTML"}isEnabled(ctx){if(ctx.disabled)return false
return super.isEnabled(ctx)}execute(ctx,ev){ctx.eraseFrag()}}function addAction(action){REG.reg.addToList("wed:BoxWebFrag:actions",action.getId(),1,action)}addAction(new BoxWebFragPaste)
addAction(new BoxWebFragCopy)
addAction(new BoxWebFragErase)

//# sourceMappingURL=boxWebFrag.js.map