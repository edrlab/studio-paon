import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{FolderEntries,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
export class SrcNewCode extends BaseElement{get wsp(){return this.reg.env.wsp}_initialize(init){this.reg=this.findReg(init)
this.config=init
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("webzone:panel",sr)
this.reg.installSkin("standard-dialog",sr)
this._initAndInstallSkin(this.localName,init)
if(init.parentFolder!=null){this.folderEntries=new FolderEntries(this.wsp,this)
this.folderEntries.setFolderUri(init.parentFolder)}if(init.currentCode){const idx=init.targetSrcUriType!=="item"?-1:init.currentCode.lastIndexOf(".")
if(idx>0)this.suffix=init.currentCode.substring(idx)
this.currentName=idx>0?init.currentCode.substring(0,idx):init.currentCode}const main=sr.appendChild(JSX.createElement("main",null))
main.appendChild(JSX.createElement("label",{for:"name"},init.inputLabel||"Code"))
const ctn=main.appendChild(JSX.createElement("div",{class:"input"}))
const val=this.currentName||init.defaultCode
this.nameInput=ctn.appendChild(JSX.createElement("input",{id:"name",autocomplete:"off",spellcheck:"false",class:this.suffix?"file":"folder",oninput:this.onNameInput,value:val}))
if(this.suffix)ctn.appendChild(JSX.createElement("span",{class:"ext"},this.suffix))
if(val){const pos=val.indexOf(".")
this.nameInput.setSelectionRange(0,pos>0?pos:val.length)}const footer=sr.appendChild(JSX.createElement("div",{id:"footer"}))
this.msgArea=footer.appendChild(JSX.createElement("div",{id:"msg"}))
if(init.doAllBtnLabel){this.selAllArea=footer.appendChild(JSX.createElement("label",{class:"option"},JSX.createElement("input",{type:"checkbox"}),init.doAllBtnLabel))}this.doBtn=footer.appendChild(JSX.createElement(Button,{id:"do",class:"default","ui-context":"dialog",onclick:this.onDoBtn}))
this.cancelBtn=footer.appendChild(JSX.createElement(Button,{id:"cancel","ui-context":"dialog",onclick:this.onCancelBtn}))
this.onkeydown=this.onKeyDown
this.nameInput.focus()
this.evalDoable()}refreshConfigOnClose(){if(this.selAllArea)this.config.doAllSelected=this.selAllArea.firstElementChild.checked}validAndDo(){if(this.evalDoable()!=="do")return
const newVal=this.nameInput.value
this.refreshConfigOnClose()
POPUP.findPopupableParent(this).close(this.suffix?newVal+this.suffix:newVal)}evalDoable(){const newVal=this.nameInput.value
let msg=null
let st="do"
let doBtnLabel=this.config.doBtnLabel||"Créer"
let cancelBtnLabel=this.config.cancelBtnLabel||"Annuler"
if(!newVal){msg="Saisissez un code"}else if(newVal===this.currentName){msg="Saisissez un nouveau code"}else{const code=this.suffix?newVal+this.suffix:newVal
const r=ITEM.isValidCode(this.config.targetSrcUriType,code)
if(r!==true)msg=r
if(this.config.parentFolder!=null){if(this.folderEntries.loading){st="working"
this.folderEntries.loading.then(()=>{this.evalDoable()})}else{if(this.folderEntries.getChildStateNow(code)==="used"){if(this.config.doBtnReplaceLabel){doBtnLabel=this.config.doBtnReplaceLabel
cancelBtnLabel=this.config.cancelBtnReplaceLabel||"Ignorer"}else{msg="Ce code existe déjà."}}}}}this.msgArea.textContent=msg
this.cancelBtn.label=cancelBtnLabel
this.doBtn.label=doBtnLabel
this.doBtn.disabled=msg!==null||st!=="do"
if(this.selAllArea){DOM.setHidden(this.msgArea,!msg)
DOM.setHidden(this.selAllArea,msg!=null||newVal!==this.config.defaultCode)}return msg?"no":st}onNameInput(ev){const itemCreator=DOMSH.findHost(this)
itemCreator.evalDoable()}onKeyDown(ev){if(ev.key==="Enter"){this.validAndDo()
ev.preventDefault()
ev.stopImmediatePropagation()}}onCancelBtn(){DOMSH.findHost(this).refreshConfigOnClose()
POPUP.findPopupableParent(this).close()}onDoBtn(){DOMSH.findHost(this).validAndDo()}}REG.reg.registerSkin("wsp-src-newcode",1,`\n\t:host {\n\t\tmin-width: 35em;\n\t\tmin-height: 8em;\n\t}\n\n  :focus-visible {\n\t\toutline: var(--focus-outline);\n\t}\n\n\tmain {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tjustify-content: center;\n\t\tpadding: .5em;\n\t}\n\n\t.option {\n\t\tdisplay: flex;\n\t}\n\n\t.input {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\talign-items: center;\n\t}\n\n\tinput {\n\t\tflex: 1;\n\t\tfont-size: inherit;\n\t}\n\n\t#msg {\n\t\tflex: 1;\n\t\tmargin: 0 .5em;\n\t\tmin-width: 15em;\n\t}\n\n\tc-button {\n\t\tmin-width: 6em;\n\t}\n`)
customElements.define("wsp-src-newcode",SrcNewCode)

//# sourceMappingURL=srcNewCode.js.map