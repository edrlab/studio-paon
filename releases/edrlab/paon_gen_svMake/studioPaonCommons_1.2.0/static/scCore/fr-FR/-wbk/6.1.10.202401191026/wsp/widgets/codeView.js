import{BaseElement,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
export class CodeView extends BaseElement{get wsp(){return this._wsp||this.findReg(this.config).env.wsp}set wsp(v){this._wsp=v
this._fields=null
this.refresh()}get fields(){return this._fields||this.findReg(this.config).env.longDesc}set fields(v){this._fields=v
this.refresh()}get transform(){return this._transform}set transform(v){this._transform=v
this.refresh()}async _initialize(init){this.config=init
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this._pending=sr.appendChild(JSX.createElement(MsgLabel,null))
this._rootCode=sr.appendChild(JSX.createElement("div",{class:"itemPreview"}))
if(init.uiClass)this._rootCode.classList.add(init.uiClass)}async _refresh(){this._pending.setStandardMsg("loading")
DOM.setHidden(this._rootCode,true)
const itemType=await this.wsp.wspMetaUi.getItemType(this.fields.itModel)
this._rootCode.innerHTML=""
const txt=await WSP.fetchStreamText(this.wsp,null,itemType.getMainStreamSrcUri(this.fields),this.transform)
if(txt){this._rootCode.innerHTML=txt
this._rootCode.appendChild(JSX.createElement("div",{class:"fadeOut"}))}DOM.setHidden(this._pending,true)
DOM.setHidden(this._rootCode,false)}}REG.reg.registerSkin("wsp-code-view",1,`\n\t:host {\n\t\tflex-direction: column;\n\t\tjustify-content: center;\n\t\ttext-align: center;\n\t\tvertical-align: middle;\n\t\toverflow: auto;\n\t}\n\n\t.partial {\n\t\tborder: 1px solid #E1E1D7;\n\t\tposition: relative;\n\t\toverflow: hidden !important;\n\t\tpadding: 1px 2px;\n\t}\n\n\t.itemPreview {\n\t\toverflow-y: auto;\n\t\tbackground-color: white;\n\t\tfont-size: 80%;\n\t\tcursor: pointer;\n\t}\n\n\t.fadeOut {\n\t\tdisplay: none;\n\t\tz-index: 2;\n\t}\n\n\t.partial > .fadeOut {\n\t\tdisplay: block;\n\t\tposition: absolute;\n\t\theight: 8em;\n\t\tbottom: 0;\n\t\tleft: 0;\n\t\tright: 0;\n\t\tbackground: -moz-linear-gradient(top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 75%, rgba(255, 255, 255, 1) 100%);\n\t\tbackground: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 75%, rgba(255, 255, 255, 1) 100%);\n\t}\n\n\t/* === CodeMirror =========================================================== */\n\t.CodeMirror-static {\n\t}\n\n\t.CodeMirror-static pre {\n\t\t/* Reset some styles that the rest of the page might have set */\n\t\tborder-radius: 0;\n\t\tborder-width: 0;\n\t\tbackground: transparent;\n\t  font-family: inherit;\n\t  font-size: inherit;\n\t  margin: 0;\n\t  white-space: pre-wrap;\n\t  word-wrap: normal;\n\t  line-height: inherit;\n\t  color: inherit;\n\t  z-index: 2;\n\t  position: relative;\n\t  overflow: visible;\n\t  border-inline-end: 30px solid transparent;\n\t  width: -moz-fit-content;\n\t  width: fit-content;\n\t  font-family: var(--font-mono);\n\t  tab-size: 2;\n\t  -moz-tab-size: 2;\n  }\n\n  .CodeMirror-line {\n\t  position: relative;\n  }\n\n\t.cm-keyword {\n\t\tcolor: #708;\n\t}\n\n\t.cm-atom {\n\t\tcolor: #219;\n\t}\n\n\t.cm-number {\n\t\tcolor: #164;\n\t}\n\n\t.cm-def {\n\t\tcolor: #00f;\n\t}\n\n\t.cm-variable {\n\t\tcolor: black;\n\t}\n\n\t.cm-variable-2 {\n\t\tcolor: #05a;\n\t}\n\n\t.cm-variable-3 {\n\t\tcolor: #085;\n\t}\n\n\t.cm-property {\n\t\tcolor: black;\n\t}\n\n\t.cm-operator {\n\t\tcolor: black;\n\t}\n\n\t.cm-comment {\n\t\tcolor: #a50;\n\t}\n\n\t.cm-string {\n\t\tcolor: #a11;\n\t}\n\n\t.cm-string-2 {\n\t\tcolor: #f50;\n\t}\n\n\t.cm-meta {\n\t\tcolor: #555;\n\t}\n\n\t.cm-error {\n\t\tcolor: #f00;\n\t}\n\n\t.cm-qualifier {\n\t\tcolor: #555;\n\t}\n\n\t.cm-builtin {\n\t\tcolor: #30a;\n\t}\n\n\t.cm-bracket {\n\t\tcolor: #997;\n\t}\n\n\t.cm-tag {\n\t\tcolor: #170;\n\t}\n\n\t.cm-attribute {\n\t\tcolor: #00c;\n\t}\n\n\t.cm-header {\n\t\tcolor: blue;\n\t}\n\n\t.cm-quote {\n\t\tcolor: #090;\n\t}\n\n\t.cm-hr {\n\t\tcolor: #999;\n\t}\n\n\t.cm-link {\n\t\tcolor: #00c;\n\t}\n\n\t.cm-negative {\n\t\tcolor: #d44;\n\t}\n\n\t.cm-positive {\n\t\tcolor: #292;\n\t}\n\n\t.cm-header, .cm-strong {\n\t\tfont-weight: bold;\n\t}\n\n\t.cm-em {\n\t\tfont-style: italic;\n\t}\n\n\t.cm-link {\n\t\ttext-decoration: underline;\n\t}\n\n\t.cm-invalidchar {\n\t\tcolor: #f00;\n\t}\n\n\t/* === STOP - CodeMirror ==================================================== */\n`)
customElements.define("wsp-code-view",CodeView)
const DEBUG=true

//# sourceMappingURL=codeView.js.map