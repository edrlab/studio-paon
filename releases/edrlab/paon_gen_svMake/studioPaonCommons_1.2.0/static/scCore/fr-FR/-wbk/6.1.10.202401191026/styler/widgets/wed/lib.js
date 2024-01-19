import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{BaseElementAsync,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{STYLER}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/styler/styler.js"
import{OpenPropsWspAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/wspActions.js"
import{StylerSkinCLass}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/styler/widgets/widgets.js"
import{SkinClassStlPreview}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/styler/widgets/previews.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
export class StylerSkinsetPropsUI extends BaseElementAsync{async _initialize(init){this.reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.contentElt=sr.appendChild(JSX.createElement("div",{class:"props"}))
this._onWspLiveStateChange=this.onWspLiveStateChange.bind(this)
this.reg.env.place.eventsMgr.on("wspLiveStateChange",this._onWspLiveStateChange)
await this.refresh()}async onWspLiveStateChange(wsp){if(wsp!==this.reg.env.wsp)return
await this.refresh()}disconnectedCallback(){this.reg.env.place.eventsMgr.removeListener("wspLiveStateChange",this._onWspLiveStateChange)}configWedletElt(tpl,wedlet){this.wedlet=wedlet}refreshBindValue(val,children){this.refresh()}async _refresh(){if(this.contentElt){this.contentElt.innerHTML=""
const skinClassesStyler=STYLER.getSkinClassesStl(this.reg.env.wsp)
if(!this.reg.env.wsp.wspType)return
let wpOptionSkinTitles=new Set
if(this.reg.env.wsp.wspType.wspOptions)this.reg.env.wsp.wspType.wspOptions.forEach(entry=>wpOptionSkinTitles.add(entry.title))
let wpOptionSkinTitlesStr=[...wpOptionSkinTitles].sort().join(", ")
this.contentElt.appendChild(JSX.createElement("div",{class:"entry"},JSX.createElement("span",{class:"key"},"Extensions de stylage actives :"),JSX.createElement("span",{class:"value"},JSX.createElement(MsgLabel,{class:"msg","î":{label:wpOptionSkinTitlesStr||"Aucune. Veuillez installer/activer une extension de stylage.",level:wpOptionSkinTitlesStr?null:"warning"}})),JSX.createElement("span",{class:"acts"},ActionBtn.buildButton(StylerSkinsetPropsUI.OPEN_WSP_PROPS_ACT,this.reg,"custom",this.contentElt))))
if(skinClassesStyler&&Object.values(skinClassesStyler).length){let skinClassesStylerValueElt=JSX.createElement("span",{class:"value"})
let listSkinsClasses=new Set
Object.values(skinClassesStyler).forEach(entry=>listSkinsClasses.add(entry.skinClass(this.reg.env.wsp)))
Array.of(...listSkinsClasses).sort((e1,e2)=>e1.name.localeCompare(e2.name)).forEach(entry=>{skinClassesStylerValueElt.appendChild(JSX.createElement(StylerSkinCLass,{"î":{skinCLass:entry.class,reg:this.reg}}))})
this.contentElt.appendChild(JSX.createElement("div",{class:"entry"},JSX.createElement("span",{class:"key"},"Familles de générateurs stylables :"),skinClassesStylerValueElt,JSX.createElement("span",{class:"acts"})))}}}}StylerSkinsetPropsUI.OPEN_WSP_PROPS_ACT=(new OpenPropsWspAction).setLabel("Activer...").setDescription("Activer une extension de stylage...")
REG.reg.registerSkin("styler-skinset-propsui",1,`\n\t:host {\n\t\tdisplay: block;\n\t\tcolor: var(--info-color);\n\t\tbackground-color: var(--panel-bgcolor);\n\t\tmargin: 0em 1em;\n\t\tpadding: .5em;\n\t\tfont-size: .8rem;\n\t\tborder-radius: 5px;\n\t}\n\n\t.props {\n\t\tdisplay: grid;\n\t\tgrid-template-columns: auto 1fr auto;\n\t\tgrid-template-rows: auto;\n\t\tgrid-column-gap: 3em;\n\t  margin-inline-start: .5em;\n  }\n\n  .entry {\n\t  display: contents;\n  }\n\n  .key {\n\t  color: var(--alt2-color);\n  }\n\n  .msg {\n\t  justify-content: unset;\n  }\n\n  styler-skinclass + styler-skinclass {\n\t  margin-inline-start: 1em;\n  }\n`)
customElements.define("styler-skinset-propsui",StylerSkinsetPropsUI)
export class StylerSkinClassPropsUI extends BaseElementAsync{async _initialize(init){this.reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
const skinClassStlCode=this.reg.env.longDesc.itAttr_skClassStl
const skinClassStl=STYLER.getSkinClassStl(this.reg.env.wsp,skinClassStlCode)
const skinClass=skinClassStl.skinClass(this.reg.env.wsp)
const infosBtn=sr.appendChild(JSX.createElement("img",{class:"infoBtn"}))
sr.appendChild(JSX.createElement("div",{class:"spacer"}))
this.tooltip=POPUP.attachTooltip(infosBtn,JSX.createElement(SkinClassStlPreview,{"î":{shortDesc:this.reg.env.longDesc,reg:this.reg,mode:"details"}}))
sr.appendChild(JSX.createElement(StylerSkinCLass,{"î":{skinCLass:skinClass.class,reg:this.reg}}))}configWedletElt(tpl,wedlet){this.wedlet=wedlet}refreshBindValue(val,children){}}REG.reg.registerSkin("styler-skinclassstyler-propsui",1,`\n\t:host {\n\t\talign-items: center;\n\t\tdisplay: flex;\n\t\tflex: 1;\n\t}\n\n\t.infoBtn {\n\t\twidth: var(--icon-size);\n\t\theight: var(--icon-size);\n\t\tcontent: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/styler/widgets/info.svg);\n\t\tcursor: pointer;\n\t}\n\n\t.spacer {\n\t\tflex: 1;\n\t}\n`)
customElements.define("styler-skinclassstyler-propsui",StylerSkinClassPropsUI)

//# sourceMappingURL=lib.js.map