import{Label}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{EItStatus}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
export class ItemMsgSs extends Label{get details(){return this._details}set details(val){if(this._details!=val){this._details=val
this.refresh()}}_initialize(init){this.reg=this.findReg(init)
super._initialize(init)
this.reg.installSkin("scroll/small",this.shadowRoot)
this.errors=init.errors
this.reg.env.longDescChange.add(()=>this.onUpdate())
this.onUpdate()}async onUpdate(){const longDesc=this.reg.env.longDesc
this._label=""
this._details=""
if(longDesc.itSt!==EItStatus.ok){const itemInfo=await WSP.fetchItemInfo(this.reg.env.wsp,this,SRC.srcRef(longDesc))
this._label=""
this._details=""
if(itemInfo.cPbs)for(const cPb of itemInfo.cPbs){if(this.matchError(cPb)){if(this._label)this._label+="\n"+cPb.msg
else this._label=cPb.msg
if(cPb.details){if(this._details)this._details+="\n"+cPb.details
else this._details=cPb.details}}}}this.refresh()}matchError(pb){if(!this.errors)return true
for(const rule of this.errors){if(rule.code.test(pb.code))return true}return false}_refresh(){if(this._label){const longDesc=this.reg.env.longDesc
if(longDesc.itSt===EItStatus.warnings)DOM.setAttr(this,"level","warning")
else DOM.setAttr(this,"level","error")
if(this.details)DOM.setAttr(this,"title",this.details)
this.hidden=false
super._refresh()}else{this.hidden=true}}}REG.reg.registerSkin("wsp-item-msg-ss",1,`\n\t:host {\n\t\ttext-align: center;\n\t\tmargin: .3em;\n\t\tmax-height: 4em;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t}\n\n\t:host([level=error]) {\n\t\tcolor: var(--error-color);\n\t}\n\n\t:host([level=warning]) {\n\t\tcolor: var(--warning-color);\n\t}\n\n\t.label {\n\t\twhite-space: pre;\n\t\toverflow: auto;\n\t}\n`)
customElements.define("wsp-item-msg-ss",ItemMsgSs)

//# sourceMappingURL=itemMsgSs.js.map