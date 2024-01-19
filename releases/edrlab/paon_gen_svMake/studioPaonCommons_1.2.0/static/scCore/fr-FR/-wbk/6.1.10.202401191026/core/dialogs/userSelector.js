import{BaseElement,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{UsersGrid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/usersGrid.js"
export class UserSelector extends BaseElement{_initialize(init){this.reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
REG.reg.installSkin("standard-dialog",sr)
this._initAndInstallSkin(this.localName,init)
const initTree=BASIS.newInit(Object.assign({preserveSelectionOnFilter:true},init.userGrid),this.reg)
if(init.selectAndCloseOnDblClick)initTree.defaultAction=(new Action).setExecute(()=>{this.doSelectAndClose()})
this.userGrid=sr.appendChild((new UsersGrid).initialize(initTree))
const footer=sr.appendChild(JSX.createElement("div",{id:"footer"}))
this.msgArea=footer.appendChild(JSX.createElement("div",{id:"msg"}))
this.selectBtn=footer.appendChild(JSX.createElement(Button,{id:"select",label:init.buttonLabel||"Sélectionner",class:"default","ui-context":"dialog",onclick:this.onSelectBtn}))
footer.appendChild(JSX.createElement(Button,{id:"cancel",label:"Annuler","ui-context":"dialog",onclick:this.onCancelBtn}))
this.userGrid.addEventListener("grid-select",ev=>{this.refrehUi()
if(init.onSelChange)init.onSelChange(this.userGrid.getSelectedUsers(),this)})
if(init.startSel)this.userGrid.initializedAsync.then(()=>{this.userGrid.selectByJUser(init.startSel,true)})
this.refrehUi()}refrehUi(){const selection=this.userGrid.getSelectedUsers()
this.selectBtn.disabled=!selection||selection.length==0}setMsg(msg,allowSelect){this.msgArea.textContent=msg
this.selectBtn.disabled=!allowSelect}doSelectAndClose(){const r=this.userGrid.getSelectedUsers()
if(r.length>0)POPUP.findPopupableParent(this).close(r)}onCancelBtn(){POPUP.findPopupableParent(this).close()}onSelectBtn(){DOMSH.findHost(this).doSelectAndClose()}visitViews(visitor,options){return visitor(this.userGrid)}visitViewsAsync(visitor,options){return visitor(this.userGrid)}}REG.reg.registerSkin("server-users-selector",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\theight: 50vh;\n\t\tmax-height: 30em;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\twidth: 20em;\n\t}\n\n\t#msg {\n\t\tflex: 1;\n\t\tmargin: 0 .5em;\n\t}\n`)
customElements.define("server-users-selector",UserSelector)

//# sourceMappingURL=userSelector.js.map