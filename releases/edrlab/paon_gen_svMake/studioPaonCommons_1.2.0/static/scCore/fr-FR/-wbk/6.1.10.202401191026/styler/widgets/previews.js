import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{BaseElement,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{STYLER}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/styler/styler.js"
import{StylerSkinCLass}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/styler/widgets/widgets.js"
export class SkinClassStlPreview extends BaseElement{_initialize(init){this.reg=this.findReg(init)
this.shortDesc=init.shortDesc
this.mode=init.mode||"preview"
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.contentElt=sr.appendChild(JSX.createElement("div",{class:"props"}))}async _refresh(){this.contentElt.textContent=""
const msgElt=this.contentElt.appendChild(JSX.createElement(MsgLabel,{class:"headband","î":{level:"info",label:"Chargement en cours..."}}))
if(this.shortDesc){let longDesc=await this.reg.env.wsp.fetchLongDesc(SRC.srcRef(this.shortDesc),this)
const skinClassStlCode=longDesc.itAttr_skClassStl
const skinClassStl=STYLER.getSkinClassStl(this.reg.env.wsp,skinClassStlCode)
if(skinClassStl){const skinClass=skinClassStl.skinClass(this.reg.env.wsp)
this.contentElt.textContent=""
if(this.mode=="preview")this.contentElt.appendChild(JSX.createElement("div",{class:"subtitle"},JSX.createElement(StylerSkinCLass,{"î":{skinCLass:skinClassStl.class,reg:this.reg}})))
const mainUlPropsElt=this.contentElt.appendChild(JSX.createElement("ul",null))
if(this.mode=="details"){const model=skinClassStl.ownerWspTypeStlName
const modelTxt=`Extension de stylage d\'appartenance : ${model}`
if(model)mainUlPropsElt.appendChild(JSX.createElement("li",null,modelTxt))}}else msgElt.setCustomMsg("Aucune information disponible","info")}else msgElt.setCustomMsg("Aucune information disponible","info")}}REG.reg.registerSkin("styler-skin-preview",1,`\n\t:host {\n\t\tfont-size: .8em;\n\t\tcolor: var(--info-color);\n\t}\n\t\n\t.maintitle {\n\t\tcolor: var(--alt2-color);\n\t\tfont-variant: small-caps;\n\t\tfont-weight: bold;\n\t}\n\n\t.subtitle {\n\t\tcolor: var(--alt2-color);\n\t\tfont-weight: bold;\n\t\ttext-align: end;\n\t}\n\n\t.version {\n\t\tfont-style: italic;\n\t}\n\n\t.version::before {\n\t\tcontent: "(";\n\t}\n\n\t.version::after {\n\t\tcontent: ") :";\n\t}\n\n\t.info {\n\t\tfont-style: italic;\n\t}\n\n\t.props > ul > li {\n\t\tmargin-block-start: .5rem;\n\t}\n\n\tul {\n\t\tmargin-block-start: 0;\n\t\tpadding-inline-start: 0em;\n\t\tlist-style-type: none;\n\t}\n\n\tul > * > ul {\n\t\tpadding-inline-start: 1.5rem;\n\t\tlist-style-type: "- ";\n\t}\n\n`)
customElements.define("styler-skin-preview",SkinClassStlPreview)

//# sourceMappingURL=previews.js.map