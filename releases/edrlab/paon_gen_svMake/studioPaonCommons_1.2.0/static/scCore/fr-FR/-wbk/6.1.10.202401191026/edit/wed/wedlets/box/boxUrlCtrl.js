import{WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{REMOTE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/remote.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{BoxInput}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
export class BoxInputUrl extends BoxInput{configWedletElt(tpl,wedlet){this.dispatchMode="blur"
super.configWedletElt(tpl,wedlet)}_createShadow(tpl){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
WEDLET.installSkins(tpl,sr,this.wedlet,"box-input")
if(tpl.hasChildNodes()){WEDLET.cloneSimpleContent(sr,tpl)
this.focusableElement=this.shadowRoot.querySelector("input,.input")}if(!this.focusableElement)this.focusableElement=sr.appendChild(JSX.createElement("input",{type:"url"}))
if(this.isCaretInput())this.setAttribute("edit-mode","caret")}}window.customElements.define("box-input-url",BoxInputUrl)
export class BoxUrlCtrl extends HTMLElement{get modeAuto(){return this.getAttribute("refresh-mode")==="auto"}clearStatus(){this._statusMarker.className=""
this._refreshBtn.disabled=!this._oldXmlChars}async refreshStatus(){if(!this._oldXmlChars)return
this._refreshBtn.disabled=true
this._statusMarker.className="pending"
this._statusMarker.title="Validation en cours..."
const report=await REMOTE.checkUrl(this._oldXmlChars,this.wedlet.wedMgr.reg)
this._refreshBtn.disabled=false
this._statusMarker.className=report.status
this._statusMarker.title=report.desc}configWedletElt(tpl,wedlet){this.wedlet=wedlet
this._refreshBtn=JSX.createElement(Button,{id:"refresh",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/refresh.svg","ui-context":"bar",onclick:this.onRefresh})
this._statusMarker=JSX.createElement("div",{id:"status"})
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
WEDLET.installSkins(tpl,sr,wedlet,this.localName)
sr.append(this._refreshBtn,this._statusMarker)}onChange(){if(this.modeAuto)this.refreshStatus()
else this.clearStatus()}refreshBindValue(val){this._oldXmlChars=JML.jmlNode2value(val)||""
this.onChange()}insertChars(from,chars,msg){this._oldXmlChars=LANG.stringInsert(this._oldXmlChars,from,chars)
this.onChange()}deleteChars(from,len,msg){this._oldXmlChars=LANG.stringDelete(this._oldXmlChars,from,len)
this.onChange()}replaceChars(chars,msg){this._oldXmlChars=chars
this.onChange()}onRefresh(){DOMSH.findHost(this).refreshStatus()}}REG.reg.registerSkin("box-url-ctrl",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\talign-items: center;\n\t}\n\n\t::slotted(*) {\n\t\tflex: 1;\n\t}\n\n\t#refresh {\n\t\tpadding: 0;\n\t\t--icon-size: 1em;\n\t}\n\n\t#status {\n\t\twidth: 10px;\n\t\theight: 10px;\n\t\tbackground-repeat: no-repeat;\n\t}\n\n\t#status.pending {\n\t\tbackground-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/urlCtrl/pending.svg);\n\t}\n\n\t#status.ok {\n\t\tbackground-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/urlCtrl/ok.svg);\n\t}\n\n\t#status.auth,\n\t#status.invalid,\n\t#status.net {\n\t\tbackground-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/urlCtrl/warn.svg);\n\t}\n\n\t#status.error {\n\t\tbackground-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/urlCtrl/error.svg);\n\t}\n`)
window.customElements.define("box-url-ctrl",BoxUrlCtrl)

//# sourceMappingURL=boxUrlCtrl.js.map