import{BaseElement,BaseElementAsync,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{WSPTYPE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspType.js"
import{MxFormElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
import{LOCALE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
export class WspTypeSelector extends(MxFormElement(BaseElementAsync)){async _initialize(init){this.config=init
this.reg=this.findReg(init)
this.msgElt=new MsgLabel
this.wspMetaEditorRootElt=JSX.createElement("fieldset",{tabindex:"-1"})
this._attach(this.localName,init,this.msgElt,JSX.createElement("form",{name:"wspTypeSelector"},this.wspMetaEditorRootElt))
this.addEventListener("input",async ev=>{this._refreshValidity()})
this._initializeForm(init)
await this._refreshAll()}formDisabledCallback(disabled){this.wspMetaEditorRootElt.disabled=disabled}_refreshValidity(){const wspTypeDef=this.wspMetaEditorRootElt.querySelector("wsptype-selector-wsptypedef[checked]")
if(this.required&&!wspTypeDef)return this.setValidity({valueMissing:true},"Veuillez sélectionner un modèle documentaire",this.wspMetaEditorRootElt)
if(wspTypeDef){const wspOptionDefs=wspTypeDef.querySelectorAll("wsptype-selector-wspoptiondef[checked]")
for(const wspOptionDef of wspOptionDefs){if(wspOptionDef.unknown)return this.setValidity({valueMissing:true},"Veuillez désélectionner les extensions inconnues",this.wspMetaEditorRootElt)}}this.setValidity({},"")}refreshUi(){if(this.initStatus!="pending")this.reinitializeStarted(this._refreshAll())}async _refreshAll(){this.addPendingValidity(this)
this.msgElt.setStandardMsg("loading")
try{this.refreshPending=this.config.mode=="new"||!this.config.fromWspCode?WSPTYPE.getNewEditor(this.reg.env.universe.wspServer,this.config.fromWspCode,this.config.params):WSPTYPE.getUpdateEditor(this.reg.env.universe.wspServer,this.config.fromWspCode)
this.wspMetaEditorRootElt.innerHTML=""
let wspMetaEditorDom=await this.refreshPending
let hasWspDefSelected=false
wspMetaEditorDom.firstElementChild.childNodes.forEach(node=>{if(node.nodeName=="wspTypeDef"){this.wspMetaEditorRootElt.appendChild((new WspTypeDef).initialize({node:node}))
if(node.getAttribute("selected")=="true")hasWspDefSelected=true}else ERROR.log("wspTypeEditor : unknown tag '"+node.nodeName+"'")})
if(this.config.mode=="new"&&this.wspMetaEditorRootElt.childElementCount===1)this.wspMetaEditorRootElt.firstElementChild.checked=true
if(!this.wspMetaEditorRootElt.hasChildNodes())this.msgElt.setCustomMsg("Aucun modèle disponible","info")
else this.msgElt.setStandardMsg(null)
this.disabled=this.disabled
if(this.config.readonly!==undefined)this.readonly=this.config.readonly
else this.readonly=this.readonly
this._refreshValidity()}catch(e){this.msgElt.setCustomMsg("Chargement impossible","error")
await ERROR.log(e)}finally{this.refreshPending=null}}async computeValidity(){await this.refreshPending}get readonly(){return this.hasAttribute("readonly")}set readonly(val){Array.from(this.wspMetaEditorRootElt.querySelectorAll("wsptype-selector-wsptypedef")).forEach(elt=>{if(val===true)elt.readonly=true})
if(val===true)DOM.setAttr(this,"readonly","true")
else this.removeAttribute("readonly")}fillWspTypeInst(){let wspTypeDef=this.wspMetaEditorRootElt.querySelector("wsptype-selector-wsptypedef[checked]")
if(wspTypeDef){let wspTypeInst={}
wspTypeDef.toWspTypeInst(wspTypeInst)
return wspTypeInst}}extractJson(parent){if(this.name&&parent[this.name])this.refreshUi()
return false}fillJson(parent,root){if(this.name)parent[this.name]=this.fillWspTypeInst()}}customElements.define("wsptype-selector",WspTypeSelector)
REG.reg.registerSkin("wsptype-selector",1,`\n\t:host {\n\t\tflex: 1;\n\t  display: flex;\n\t  min-height: 0;\n\t  min-width: 0;\n\t  flex-direction: column;\n\t  justify-content: center;\n\t  text-align: center;\n\t  vertical-align: middle;\n\t  overflow: auto;\n  }\n\n  fieldset {\n\t  margin: 0;\n\t  padding: 0;\n\t  border: none;\n  }\n\n  fieldset:focus {\n\t  outline: none;\n  }\n`)
class WspTypeDef extends BaseElement{_initialize(init){this.config=init
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin("wsptype-selector-wsptypedef",init)
this.initInput()
if(this.unknown)DOM.addClass(this,"unknown")
if(this.obsolete)DOM.addClass(this,"obsolete")
if(this.newest)DOM.addClass(this,"newest")
let label=sr.appendChild(JSX.createElement("label",null,this.inputElt," ",JSX.createElement("span",null,this.titleWspDef)))
if(this.descWspDef)DOM.setAttr(label,"title",this.descWspDef)
let children=sr.appendChild(JSX.createElement("div",{class:"children"}))
if(this.config.readonly!==undefined)this.readonly=this.config.readonly
this.disabled=this.obsolete?true:this.disabled
this._childrenSkinElt=children.appendChild(JSX.createElement("div",null,JSX.createElement("div",{class:"sublabel"},"Habillage des publications"),JSX.createElement("div",{class:"optslist"},JSX.createElement("slot",{name:"skin"}))))
this._childrenGenElt=children.appendChild(JSX.createElement("div",null,JSX.createElement("legend",{class:"sublabel"},"Publications"),JSX.createElement("div",{class:"optslist"},JSX.createElement("slot",{name:"gen"}))))
this._childrenExtElt=children.appendChild(JSX.createElement("div",null,JSX.createElement("legend",{class:"sublabel"},"Extensions"),JSX.createElement("div",{class:"optslist"},JSX.createElement("slot",{name:"ext"}))))
if(init.node)init.node.childNodes.forEach(optionNode=>{if(optionNode.nodeName=="wspOptionDef")this.appendChild(JSX.createElement(WspOptionDef,{slot:optionNode.getAttribute("nature")||"ext","î":{node:optionNode,disabled:this.disabled}}))})
this.addEventListener("input",async ev=>{if(!this.disabled||!this.readonly){const input=ev.composedPath()[0]
if(input===this.inputElt)this.checked=input.checked}})
if(init.node.getAttribute("selected")==="true")this.checked=true
this._adjustUi(true)}_adjustUi(forced){if(forced||this.initialized){let isOptionVisible=function(optionNode){if(!optionNode.hidden)return true}
if(Array.from(this.querySelectorAll("*[slot='skin']")).findIndex(isOptionVisible)==-1)DOM.setHidden(this._childrenSkinElt,true)
if(Array.from(this.querySelectorAll("*[slot='gen']")).findIndex(isOptionVisible)==-1)DOM.setHidden(this._childrenGenElt,true)
if(Array.from(this.querySelectorAll("*[slot='ext']")).findIndex(isOptionVisible)==-1)DOM.setHidden(this._childrenExtElt,true)}}get checked(){return this.inputElt.checked}set checked(value){this.inputElt.checked=value
if(value)DOM.setAttr(this,"checked","true")
else this.removeAttribute("checked")
if(value&&this.nodeName=="wsptype-selector-wsptypedef"){let prev=this.previousElementSibling
while(prev){prev.checked=false
prev=prev.previousElementSibling}let next=this.nextElementSibling
while(next){next.checked=false
next=next.nextElementSibling}}this._adjustUi()}get disabled(){return this.getAttribute("disabled")==="true"}set disabled(val){Array.from(this.querySelectorAll("wsptype-selector-wspoptiondef")).forEach(elt=>{if(val===true)elt.disabled=true})
this.inputElt.disabled=val===true
if(val===true)DOM.setAttr(this,"disabled","true")
else this.removeAttribute("disabled")
this._adjustUi()}get readonly(){return this.getAttribute("readonly")==="true"}set readonly(val){Array.from(this.querySelectorAll("wsptype-selector-wspoptiondef")).forEach(elt=>{if(val===true)elt.readonly=true})
this.inputElt.disabled=val===true
if(val===true)DOM.setAttr(this,"readonly","true")
else this.removeAttribute("readonly")
this._adjustUi()}get hidden(){return this.readonly&&!this.checked}get titleWspDef(){let details=""
if(this.obsolete||this.newest)details=`version ${this.config.node.getAttribute("version")}`
if(this.config.node.getAttribute("lang")){if(details!=="")details+=`, ${LOCALE.languageToName(this.config.node.getAttribute("lang"))}`
else details+=LOCALE.languageToName(this.config.node.getAttribute("lang"))}return JSX.createElement("span",null,JSX.createElement("span",{class:"title"},this.config.node.getAttribute("title"),details?JSX.createElement("span",null," (",details,")"):null),this.error?JSX.createElement("span",{class:"labelstatus "+this.errorLevel},this.error):null)}get descWspDef(){return this.config.node.getAttribute("version")}get unknown(){return this.config.node.getAttribute("unknown")==="true"}get obsolete(){return this.config.node.getAttribute("obsolete")==="true"}get newest(){return this.config.node.getAttribute("newest")==="true"}get error(){if(this.obsolete)return"modèle obsolète"
if(this.unknown)return"modèle inconnu"
if(this.config.node.hasAttribute("@errorPack")){switch(this.config.node.getAttribute("@errorPack")){case"unknownError":case"malformedPack":return"modèle en erreur"
case"versionPackUnknown":case"versionFrameworkPackOutdated":return"modèle trop ancien, mise à jour nécessaire"
case"versionServerOutdated":return"modèle trop récent, incompatible avec cet entrepôt"
default:return"modèle en erreur"}}}get errorLevel(){if(this.unknown||this.config.node.hasAttribute("@errorPack"))return"error"
if(this.obsolete)return"warning"
return null}initInput(){this.inputElt=JSX.createElement("input",{type:"radio",name:"wspTypeDef",value:this.config.node.getAttribute("uri"),form:"wspTypeSelector"})
return this.inputElt}toWspTypeInst(wspTypeInst){if(this.checked&&!this.obsolete){wspTypeInst.wspType={key:this.config.node.getAttribute("key"),lang:this.config.node.getAttribute("lang"),version:this.config.node.getAttribute("version"),title:this.config.node.getAttribute("title"),uri:this.config.node.getAttribute("uri")}
Array.from(this.querySelectorAll("*")).forEach(node=>{node.toWspTypeInst(wspTypeInst)})}}}customElements.define("wsptype-selector-wsptypedef",WspTypeDef)
REG.reg.registerSkin("wsptype-selector-wsptypedef",1,`\n\t:host {\n\t\ttext-align: start;\n\t\tuser-select: none;\n\t}\n\n\t:host([readonly]:not([checked=true])) {\n\t\tdisplay: none;\n\t}\n\n\t:host(.newest) .title {\n\t\tfont-weight: bolder;\n\t}\n\n\tlabel {\n\t\tdisplay: flex;\n\t\tflex: 1;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\t:host(:not([disabled]):not([readonly])) label {\n\t\tcursor: pointer;\n\t}\n\n  :host([readonly]) input {\n\t  display: none;\n  }\n\n  :host(.obsolete) {\n\t  font-style: italic;\n  }\n\n  .labelstatus::before {\n\t  content: " - ";\n\t  font-style: italic;\n  }\n\n  .labelstatus {\n\t  font-size: .8em;\n  }\n\n  .labelstatus.warning {\n\t  color: var(--warning-color);\n  }\n\n  .labelstatus.error {\n\t  color: var(--error-color);\n  }\n\n  :host(wsptype-selector-wsptypedef) > label {\n\t  /*color: var(--alt2-color);\n\t\tbackground-color: var(--alt2-bgcolor);*/\n  }\n\n  :host(wsptype-selector-wspoptiondef) > label {\n\t  font-size: 0.8em;\n  }\n\n  .children {\n\t  margin-inline-start: 2em;\n  }\n\n  .optslist {\n\t  margin-inline-start: 1em;\n\t  padding-inline-start: .2em;\n\t  border-inline-start: 1px solid var(--alt2-border-color);\n  }\n\n  .sublabel {\n\t  padding-top: .2em;\n\t  font-variant: all-small-caps;\n\t  font-size: 0.8em;\n  }\n\n  :host(:not([checked]):not(.unknown)) > .children {\n\t  display: none;\n  }\n\n  :host(:not([checked]).unknown){\n\t  color:var(--fade-color);\n\t\tfont-style: italic;\n  }\n\n  .unknown > label {\n\t  font-style: italic;\n  }\n`)
class WspOptionDef extends WspTypeDef{initInput(){this.inputElt=JSX.createElement("input",{type:"checkbox",name:"wspTypeDef",value:this.config.node.getAttribute("uri"),form:"wspTypeSelector"})
return this.inputElt}toWspTypeInst(wspTypeInst){if(this.checked&&!this.obsolete){if(!wspTypeInst.wspOptions)wspTypeInst.wspOptions=[]
wspTypeInst.wspOptions.push({key:this.config.node.getAttribute("key"),lang:this.config.node.getAttribute("lang"),version:this.config.node.getAttribute("version"),title:this.config.node.getAttribute("title"),uri:this.config.node.getAttribute("uri")})}}get error(){if(this.obsolete)return"extension obsolète"
if(this.unknown)return"extension inconnue"
if(this.config.node.hasAttribute("@errorPack")){switch(this.config.node.getAttribute("@errorPack")){case"unknownError":case"malformedPack":return"extension en erreur"
case"versionPackUnknown":case"versionFrameworkPackOutdated":return"extension trop ancienne, mise à jour nécessaire"
case"versionServerOutdated":return"extension trop récente, incompatible avec cet entrepôt"
default:return"extension en erreur"}}}}customElements.define("wsptype-selector-wspoptiondef",WspOptionDef)

//# sourceMappingURL=wspTypeSelector.js.map