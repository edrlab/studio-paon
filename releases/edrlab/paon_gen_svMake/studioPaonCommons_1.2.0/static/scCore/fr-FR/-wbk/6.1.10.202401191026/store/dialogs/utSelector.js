import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{UtBrowser}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/utBrowser.js"
import{URLTREE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/urlTree.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
export class UtSelector extends BaseElement{get holder(){return this._holder||POPUP.findPopupableParent(this)}_initialize(init){this.reg=this.findReg(init)
this.checkSel=init.checkSel
this._holder=init.holder
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("standard-dialog",sr)
this._initAndInstallSkin(this.localName,init)
const utInit=Object.assign({reg:this.reg,onSelChange:this.onSelChange,defaultAction:(new Action).setExecute(this.validAndDo.bind(this)),nodeFilter:n=>!URLTREE.isQueryPath(n.n)},init.utBrowser)
const utBrowser=sr.appendChild(JSX.createElement(UtBrowser,{"î":utInit}))
const footer=sr.appendChild(JSX.createElement("div",{id:"footer"}))
this.msg=footer.appendChild(JSX.createElement("c-msg",{id:"msg"}))
this.doBtn=footer.appendChild(JSX.createElement(Button,{id:"do",class:"default",disabled:true,"ui-context":"dialog",label:init.selBtnLabel||"Sélectionner",onclick:this.onDoBtn}))
footer.appendChild(JSX.createElement(Button,{id:"cancel","ui-context":"dialog",label:"Annuler",onclick:this.onCancelBtn}))
utBrowser.initializedAsync.then(()=>{if(init.initialPath!=null)utBrowser.selectRes(init.initialPath)})
this.checkSelValid()}onSelChange(utBrowser,sel){const me=DOMSH.findHost(utBrowser)
me.currentSel=sel&&sel.length>0?sel[0]:null
me.checkSelValid()}checkSelValid(){let valid=true
if(this.currentSel==null){valid="Sélectionnez un contenu"}else if(this.checkSel){valid=this.checkSel(this)}this.doBtn.disabled=valid!==true
this.msg.setCustomMsg(valid!==true?valid:null)
return valid===true}validAndDo(){if(this.checkSelValid())this.holder.close(this.currentSel)}cancel(){var _a;(_a=this.holder)===null||_a===void 0?void 0:_a.close()}onCancelBtn(){DOMSH.findHost(this).cancel()}onDoBtn(){DOMSH.findHost(this).validAndDo()}}REG.reg.registerSkin("store-ut-selector",1,`\n\n\tc-button {\n\t\tmin-width: 6em;\n\t}\n\n\t#msg {\n\t\tflex: 1;\n\t\tmargin: 0 .5em;\n\t\tjustify-content: start;\n\t}\n`)
customElements.define("store-ut-selector",UtSelector)

//# sourceMappingURL=utSelector.js.map