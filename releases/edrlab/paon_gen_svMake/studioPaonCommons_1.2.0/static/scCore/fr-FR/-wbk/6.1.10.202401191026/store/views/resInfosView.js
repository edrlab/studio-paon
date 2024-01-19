import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{ResBodyView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/resViewer.js"
export class ResInfoView extends ResBodyView{_initialize(init){var _a
this.reg=init.areaContext.reg
super._initialize(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("form-control-areas",sr)
this._initAndInstallSkin(this.localName,init)
if(init.listenChanges)(_a=this.reg.env.nodeInfosChange)===null||_a===void 0?void 0:_a.on("nodeChange",this.refresh.bind(this))
this.lines=init.lines}draw(){const sr=this.shadowRoot
for(let line of this.lines)line.drawLine(this.reg,sr,this)}}REG.reg.registerSkin("store-res-infos",1,`\n\t:host {\n\t\tdisplay: grid;\n\t\tgrid-template-columns: auto 1fr;\n\t\tgrid-gap: .5rem .5rem;\n\t\tgrid-auto-rows: max-content;\n\t\tpadding: .5rem;\n\t}\n\n\t/** class 'ctrlLbl' : Compat form-control-areas */\n\t.line, .ctrlLbl {\n\t\tdisplay: contents;\n\t}\n\n\t/** class 'lbl' : Compat form-control-areas */\n\t.label, .lbl {\n\t\tdisplay: flex;\n\t\tcolor: var(--alt1-color);\n\t\tjustify-content: flex-end;\n\t}\n\n\t/** class 'lbl' : Compat form-control-areas */\n\t.lbl {\n\t\tmargin-inline-end: unset;\n\t}\n\n\t.value {\n\t\tfont-weight: bold;\n\t}\n\n\t.valueEntry {\n\t\tdisplay: inline-block;\n\t}\n\n\t:any-link {\n\t\tcolor: unset;\n\t}\n`)
customElements.define("store-res-infos",ResInfoView)

//# sourceMappingURL=resInfosView.js.map