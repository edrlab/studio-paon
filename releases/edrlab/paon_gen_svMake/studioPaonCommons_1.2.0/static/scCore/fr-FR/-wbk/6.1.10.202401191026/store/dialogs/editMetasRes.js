import{BaseElementAsync,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{FORMS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
export class EditMetasRes extends BaseElementAsync{get holder(){return this.config.holder||POPUP.findPopupableParent(this)}async _initialize(init){var _a,_b
this.config=init
this.reg=init.reg
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("form-control-areas",sr)
this.reg.installSkin("standard-dialog",sr)
this._initAndInstallSkin(this.localName,init)
while(this.reg.env.nodeInfosPending)await this.reg.env.nodeInfosPending
let datas=(_a=this.reg.env.nodeInfos)===null||_a===void 0?void 0:_a.metas
if(typeof init.defaultValues==="function")datas=Object.assign(init.defaultValues(this),datas)
else if(init.defaultValues!=null)datas=Object.assign(Object.create(init.defaultValues),datas)
else if(datas==null)datas=Object.create(null)
if(typeof init.overrideValues==="function")init.overrideValues(this,datas)
else if(init.overrideValues!=null)Object.assign(datas,init.overrideValues)
const area=this.reg.env.resType.resForm(init.formView||(init.formIdent?"editIdent":"editMetas"))
const skinForm=area.getSkin(this.reg)
if(skinForm)this.reg.installSkin(skinForm,sr)
const skinFormOver=area.getSkinOver(this.reg)
if(skinFormOver)this.reg.installSkin(skinFormOver,sr)
let ctx=Object.create(init.formIdent||null)
ctx.reg=this.reg
ctx.buildControlLabel=true
if(init.formIdent){ctx.callback=this
this.msgArea=JSX.createElement(MsgLabel,{id:"msg"})}const fields=await area.loadBody(ctx)
this.formEditElt=JSX.createElement("form",{id:"scroll"},fields)
this.formEditElt.onsubmit=ev=>false
this.doBtn=JSX.createElement(Button,{label:init.doBtnLabel||(init.formIdent?"Renommer":"Enregistrer"),class:"default",onclick:this.onSave,"ui-context":"dialog"})
sr.append(this.formEditElt,JSX.createElement("footer",{id:"footer"},this.msgArea,this.doBtn,JSX.createElement("c-button",{label:"Annuler",onclick:this.onCancel,"ui-context":"dialog"})))
FORMS.jsonToForm(datas,this.formEditElt);(_b=FORMS.findFirstFocusable(this.formEditElt))===null||_b===void 0?void 0:_b.focus()}async onSave(ev){const me=DOMSH.findHost(this)
if(await FORMS.checkAsyncValidity(me.formEditElt)){const currentInfos=me.reg.env.nodeInfos
const result={path:me.reg.env.path,processing:me.reg.env.resType.prc||(currentInfos===null||currentInfos===void 0?void 0:currentInfos.prc)}
if(currentInfos.resId)result.olderResId=currentInfos.resId
if(me.config.formIdent)result.olderPath=me.reg.env.path
FORMS.formToJson(me.formEditElt,result)
me.holder.close(result)}else{FORMS.reportValidity(me.formEditElt)}}onCancel(ev){DOMSH.findHost(this).holder.close()}identState(resState,targetPath,msg,msgLevel){this.msgArea.setCustomMsg(msg,msgLevel)
this.doBtn.disabled=resState==="invalid"}}REG.reg.registerSkin("store-editmetas-res",1,`\n\t#scroll {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\toverflow: auto;\n\t\tflex-direction: column;\n\t\twidth: 100%;\n\t}\n\n\tform {\n\t\tdisplay: flex;\n\t\tflex: 3;\n\t}\n\n\tform > fieldset {\n\t\tborder: none;\n\t\tpadding: 0;\n\t\tmargin: 0;\n\t\tdisplay: grid;\n\t\tgrid-template-columns: auto 1fr;\n\t\tgrid-gap: .5rem .5rem;\n\t\tgrid-auto-rows: max-content;\n\t\tpadding: .5rem;\n\t\twidth: 40em;\n\t\tmax-width: calc(100% - 1rem);\n\t\talign-self: center;\n\t}\n\n\t.ctrlLbl {\n\t\tdisplay: contents;\n\t}\n\n\t.lbl {\n\t\tjustify-content: flex-end;\n\t\tword-break: keep-all;\n\t\tmax-width: 15rem;\n\t\twhite-space: unset;\n\t}\n\n\t.valueEntry {\n\t\tdisplay: inline-block;\n\t}\n\n\t:any-link {\n\t\tcolor: unset;\n\t}\n\n\t#msg {\n\t\tflex: 1;\n\t\tmargin: 0 .5em;\n\t\tjustify-content: start;\n\t}\n`)
customElements.define("store-editmetas-res",EditMetasRes)

//# sourceMappingURL=editMetasRes.js.map