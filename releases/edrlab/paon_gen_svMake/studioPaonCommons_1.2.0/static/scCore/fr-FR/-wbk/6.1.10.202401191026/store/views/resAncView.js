import{BaseAreaView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{URLTREE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/urlTree.js"
import{BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{InfoFocusRes}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/res.js"
export class ResAncView extends BaseAreaView{_initialize(init){var _a
this.reg=init.areaContext.reg||this.findReg(init)
super._initialize(init)
this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init);(_a=this.reg.env.nodeInfosChange)===null||_a===void 0?void 0:_a.on("urlAncChange",this._ancLstn=()=>{this.refresh()})}_refresh(){const env=this.reg.env
if(env.nodeInfos){BASIS.clearContent(this.shadowRoot)
this.draw()}else if(env.nodeInfosPending){env.nodeInfosPending.then(this.refresh.bind(this))}else{BASIS.clearContent(this.shadowRoot)}}draw(){let nodes=this.reg.env.nodeInfos.urlAnc
DOM.setHidden(this,nodes==null)
if(nodes==null)return
const sr=this.shadowRoot
let nodePath=null
for(let node of nodes){nodePath=URLTREE.appendLeafToPath(nodePath,node)
const nodeType=this.reg.env.resTypes.getResTypeFor(node)
let version
if(nodeType.prcVersionning==="VCB"){version=JSX.createElement("span",{class:"version"},nodeType.resVersion(node))}sr.appendChild(JSX.createElement("span",{class:"sep"},JSX.createElement("c-button",{class:"anc",onclick:this.onClickEntry,"data-path":nodePath},JSX.createElement("img",{class:"icon",src:nodeType.resIcon(node)}),JSX.createElement("span",{class:"name"},nodeType.resName(node)),version)))}}onClickEntry(ev){const me=DOMSH.findHost(this)
const infoBroker=me.reg.env.infoBroker
if(infoBroker)infoBroker.dispatchInfo(new InfoFocusRes(this.getAttribute("data-path")),me)}onViewHidden(closed){var _a
if(closed&&this._ancLstn){(_a=this.reg.env.nodeInfosChange)===null||_a===void 0?void 0:_a.removeListener("urlAncChange",this._ancLstn)}}}REG.reg.registerSkin("store-res-anc",1,`\n\t:host {\n\t\tdisplay: flex;\n\t  flex-flow: wrap;\n  }\n\n  .sep {\n\t  display: flex;\n  }\n\n  .sep::after {\n\t  content: "❯";\n\t  display: flex;\n\t  align-items: center;\n\t  color: var(--alt1-color);\n  }\n\n  .sep:lang(ar)::after {\n\t  content: "❮";\n  }\n\n  .name {\n\t  margin-inline-start: .2em;\n\t  word-break: normal;\n  }\n\n  .version {\n\t  color: var(--alt1-color);\n  }\n\n  .version::before {\n\t  content: '@';\n  }\n\n  .icon {\n\t  filter: var(--filter);\n\t  height: var(--icon-size);\n  }\n`)
customElements.define("store-res-anc",ResAncView)

//# sourceMappingURL=resAncView.js.map