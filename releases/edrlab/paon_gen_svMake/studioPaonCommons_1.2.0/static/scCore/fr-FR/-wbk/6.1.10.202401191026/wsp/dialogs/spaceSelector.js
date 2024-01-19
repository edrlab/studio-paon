import{BaseElement,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{ActionBtn,Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{SpaceTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/spaceTree.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{CreateSpace}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
export class SpaceSelector extends BaseElement{get wsp(){return this.reg.env.wsp}get shortDescs(){return this.spaceTree.shortDescs}get emitter(){return this}_initialize(init){this.reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("webzone:panel",sr)
this._initAndInstallSkin(this.localName,init)
const initTree=BASIS.newInit(init.spaceTree,this.reg)
initTree.hideSearch=true
if(init.selOnDblClick)initTree.defaultAction=(new Action).setExecute(()=>{this.doSelect()})
initTree.srcFilter=data=>ITEM.getSrcUriType(data.srcUri)==="space"
this.spaceTree=sr.appendChild((new SpaceTree).initialize(initTree))
const footer=sr.appendChild(JSX.createElement("div",{id:"footer"}))
this.msgArea=footer.appendChild(JSX.createElement("div",{id:"msg"}))
if(!init.noCreateSpace){this.createSpBtn=footer.appendChild(JSX.createElement(ActionBtn,{id:"create","ui-context":"dialog","î":{action:new SpSelCreateSpace,actionContext:this}}))}this.selectBtn=footer.appendChild(JSX.createElement(Button,{id:"select",label:init.buttonLabel||"Sélectionner","ui-context":"dialog",class:"default",onclick:this.onSelectBtn}))
footer.appendChild(JSX.createElement(Button,{id:"cancel",label:"Annuler","ui-context":"dialog",onclick:this.onCancelBtn}))
if(init.onSelChange){this.spaceTree.grid.addEventListener("grid-select",ev=>{var _a
const grid=ev.currentTarget
const row=grid.dataHolder.getRow(grid.getSelectedRow());(_a=this.createSpBtn)===null||_a===void 0?void 0:_a.refresh()
init.onSelChange(row?row.rowKey:null,this)})
init.onSelChange(null,this)}else if(this.createSpBtn){this.spaceTree.grid.addEventListener("grid-select",ev=>{this.createSpBtn.refresh()})}if(init.startSel)this.spaceTree.initializedAsync.then(()=>{this.spaceTree.selectSrcUri(init.startSel)})}setMsg(msg,allowSelect){this.msgArea.textContent=msg
this.selectBtn.disabled=!allowSelect}evalPerm(perms,src,msgNotAllowed,msgForbidden){if(!this.reg.hasPermission(perms,src.srcRoles,null,src.srcRi)){this.setMsg(this.reg.hasSystemRights(perms,src.srcRi)?msgNotAllowed:msgForbidden,false)
return false}return true}doSelect(){const r=this.spaceTree.shortDescs
if(r.length>0)POPUP.findPopupableParent(this).close(r[0])}onCancelBtn(){POPUP.findPopupableParent(this).close()}onSelectBtn(){DOMSH.findHost(this).doSelect()}visitViews(visitor,options){return visitor(this.spaceTree)}visitViewsAsync(visitor,options){return visitor(this.spaceTree)}}REG.reg.registerSkin("wsp-space-selector",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 30em;\n\t\tmin-width: 15em;\n\t\tflex-direction: column;\n\t}\n\n\twsp-space-tree {\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\t#footer {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\talign-items: center;\n\t}\n\n\t#msg {\n\t\tflex: 1;\n\t\tmargin: 0 .5em;\n\t}\n`)
customElements.define("wsp-space-selector",SpaceSelector)
class SpSelCreateSpace extends CreateSpace{constructor(){super()
this._visSrcPerms=this._enableSrcPerms}async execute(ctx,ev){const sd=await super.execute(ctx,ev)
if(sd)await ctx.spaceTree.selectSrcUri(sd.srcUri)
return sd}}
//# sourceMappingURL=spaceSelector.js.map