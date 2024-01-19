import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX,ShadowJsx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{WSPPACK}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/pack.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{STYLER}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/styler/styler.js"
export class StylerSkinCLass extends BaseElement{_initialize(init){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.reg=this.findReg(init)
this.skinCLass=init.skinCLass
this.titleElt=sr.appendChild(JSX.createElement("div",null))
POPUP.promiseTooltip(this,async(owner,tooltip)=>JSX.createElement("c-box",{skin:"styler-skinclass/tooltip",skinOver:"scroll/large"},JSX.createElement(ShadowJsx,null,await this.makeTooltip())),{skinOver:"styler-skinclass/tooltip",tooltipOf:this,hoverAllowed:true,anchor:{posFrom:this,fromX:"end",marginX:-1,notAvailableSpace:{posFrom:this,fromX:"start",targetX:"end",marginX:1}}})
this.refresh()}_refresh(){super._refresh()
const skinClass=STYLER.getSkinClass(this.reg.env.wsp,this.skinCLass)
this.titleElt.textContent=skinClass?skinClass.name:this.skinCLass}async makeTooltip(){const returnElt=JSX.createElement("div",null)
const wspTypesDefList=await WSPPACK.listWspTypesDef(this.reg.env.universe.packServer,[this.skinCLass],true)
returnElt.appendChild(JSX.createElement("div",null,"Usages dans les modèles documentaires installés : "))
const mainUlPropsElt_models=returnElt.appendChild(JSX.createElement("div",{class:"models"}))
if(wspTypesDefList.length>0){const listModels=mainUlPropsElt_models.appendChild(JSX.createElement("ul",null))
wspTypesDefList.sort((e1,e2)=>{if(e1.isOption&&!e2.isOption)return 1
if(e2.isOption&&!e1.isOption)return-11
return e2.title.localeCompare(e1.title)}).forEach(owner=>{var _a
const skinClassGenerators=(_a=owner.generators)===null||_a===void 0?void 0:_a.filter(entry=>entry.skinClass===this.skinCLass)
if((skinClassGenerators===null||skinClassGenerators===void 0?void 0:skinClassGenerators.length)>0){const model=owner.title
const ulModelElt=listModels.appendChild(JSX.createElement("li",{class:"model"},JSX.createElement("span",{class:"title"},`Modèle \'${model}\'`))).appendChild(JSX.createElement("ul",null))
skinClassGenerators.sort((e1,e2)=>e1.name.localeCompare(e2.name)).forEach(entry=>{const gen=entry.name
ulModelElt.appendChild(JSX.createElement("li",null,`Générateur \'${gen}\'`))})}})}else mainUlPropsElt_models.appendChild(JSX.createElement("span",{class:"info"},"aucun"))
return returnElt}}REG.reg.registerSkin("styler-skinclass",1,`\n\t:host {\n\t\tbackground-color: #9e81bd;\n\t\tcolor: white;\n\t\tdisplay: inline-flex;\n\t\tmin-height: 0;\n\t\tmin-width: 5em;\n\t\tborder-radius: 2px 8px 8px 2px;\n\t\tmargin: 1px;\n\t\tpadding: 1px 3px 1px 3px;\n\t\tcursor: pointer;\n\t\tbackground-image: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/styler/widgets/skinClass.svg");\n\t\tbackground-position: 2px;\n\t\tbackground-size: auto .7em;\n\t\tbackground-repeat: no-repeat;\n\t\tpadding-inline-start: 1.2em;\n\t\tbox-shadow: 1px 1px 2px 0px #bbb;\n\t}\n\n\t:host([hidden]) {\n\t\tdisplay: none;\n\t}\n\n`)
REG.reg.registerSkin("styler-skinclass/tooltip",1,`\n\t.models {\n\t\tfont-size: .8em;\n\t\tmax-height: 20em;\n\t\tmargin-inline-start: 2em;\n\t\toverflow: auto;\n\t}\n\n\t.model {\n\t\tmargin-top: .3em;\n\t}\n\n\t.model > .title {\n\t\tcolor: var(--alt2-color);\n\t}\n\n\tul > * > ul {\n\t\tpadding-inline-start: 1.5rem;\n\t}\n\n\tul {\n\t\tmargin-block-start: 0;\n\t\tpadding-inline-start: 0em;\n\t\tlist-style-type: none;\n\t\tlist-style-type: "- ";\n\t}\n`)
customElements.define("styler-skinclass",StylerSkinCLass)

//# sourceMappingURL=widgets.js.map