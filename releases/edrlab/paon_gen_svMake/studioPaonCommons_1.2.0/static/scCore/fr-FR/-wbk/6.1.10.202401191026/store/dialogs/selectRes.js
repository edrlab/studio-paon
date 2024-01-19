import{BaseElementAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{AreaAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{InfoBrokerBasic}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/infos.js"
import{InfoCurrentRes}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/res.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{AddFolderInList}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/actions/depotActions.js"
export class SelectRes extends BaseElementAsync{get holder(){return this._holder||POPUP.findPopupableParent(this)}async _initialize(init){this.reg=this.findReg(init)
this.checkSel=init.checkSel
this._holder=init.holder
this.infoBroker=new InfoBrokerBasic
this.infoBroker.addConsumer(this)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("standard-dialog",sr)
this._initAndInstallSkin(this.localName,init)
const boards=init.boards.filter(board=>board.isVisible(this))
const root=sr.appendChild(JSX.createElement("main",null))
this.footer=sr.appendChild(JSX.createElement("div",{id:"footer"}))
this.msg=this.footer.appendChild(JSX.createElement("c-msg",{id:"msg"}))
this.doBtn=this.footer.appendChild(JSX.createElement(Button,{id:"do",class:"default",disabled:true,"ui-context":"dialog",label:init.selBtnLabel||"Sélectionner",onclick:this.onDoBtn}))
this.footer.appendChild(JSX.createElement(Button,{id:"cancel","ui-context":"dialog",label:"Annuler",onclick:this.onCancelBtn}))
this.checkSelValid()
if(boards.length>1){console.trace("TODO multi-boards tabs")}else if(boards.length===0){this.cancel()}else{const elt=this.view=await boards[0].loadBody(this)
root.appendChild(elt)
this.checkSelValid()
if(init.initialPath!=null&&elt.setResPath){elt.setResPath(init.initialPath)}}}onInfo(info){if(info instanceof InfoCurrentRes){this.currentSel=info.nodeProps
this.checkSelValid()}}checkSelValid(){let valid=true
if(this.currentSel==null){valid="Sélectionnez un contenu"}else if(this.checkSel){valid=this.checkSel(this)}this.doBtn.disabled=valid!==true
this.msg.setCustomMsg(valid!==true?valid:null,"warning")
return valid===true}validAndDo(){if(this.checkSelValid())this.holder.close(this.currentSel)}cancel(){var _a;(_a=this.holder)===null||_a===void 0?void 0:_a.close()}onCancelBtn(){DOMSH.findHost(this).cancel()}onDoBtn(){DOMSH.findHost(this).validAndDo()}visitViews(visitor){if(this.view)return visitor(this.view)}visitViewsAsync(visitor,options){return this.view?visitor(this.view):Promise.resolve(undefined)}}REG.reg.registerSkin("store-select-res",1,`\n\tmain {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n`)
customElements.define("store-select-res",SelectRes)
export class SelectResBrowseArea extends AreaAsync{constructor(){super()
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/browseBoard.js"))}buildBody(ctx,lastDatas){const init={reg:ctx.reg,infoBroker:ctx.infoBroker,selMono:true,utBrowser:{actions:[new AddFolderInList]},resViewer:{keyView:"select"}}
return JSX.createElement("store-browse-board",{"î":init})}}
//# sourceMappingURL=selectRes.js.map