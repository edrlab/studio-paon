import{BaseElementAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{newSrcView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemMain.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
export class TaskLayout extends BaseElementAsync{async _initialize(init){this.reg=this.findReg(init)
this._attach(this.localName,init)
let sr=this.shadowRoot
this.reg.installSkin("scroll/large",sr)
for(const v of init.bodyView){await this.buildSrcView(v,this.shadowRoot)}}async buildSrcView(v,parent){if(!v)return null
if(typeof v==="string")parent.appendChild(document.createTextNode(v))
else{const tag=await newSrcView(v,this.reg)
if(!tag)return null
parent.appendChild(tag)
if(v.children)for(const subV of v.children){if(typeof subV==="string")tag.appendChild(document.createTextNode(subV))
else await this.buildSrcView(subV,tag)}return tag}}visitViews(visitor,options){return VIEWS.visitDescendants(this.shadowRoot,visitor)}async visitViewsAsync(visitor,options){return VIEWS.visitDescendantsAsync(this.shadowRoot,visitor)}}REG.reg.registerSkin("wsp-task-layout",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n`)
REG.reg.registerSkin("wsp-task-layout/edit",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: grid;\n\t\tgrid-template-areas: "title title" "bar body";\n\t\tgrid-template-columns: auto 1fr;\n\t\tgrid-template-rows: auto 1fr;\n\t\theight: 100%;\n\t}\n\n  [hidden] {\n\t  display: none;\n  }\n\n  #body {\n\t  grid-area: body;\n\t  overflow: auto;\n\t  padding: .3em;\n  }\n\n  #title {\n\t  grid-area: title;\n\t  border: 1px solid transparent;\n\t  border-bottom: 3px solid var(--alt1-bgcolor);\n  }\n\n  #bar {\n\t  grid-area: bar;\n\t  display: flex;\n\t  min-height: 0;\n\t  min-width: 1.8rem;\n\t  flex-direction: column;\n\t  background-color: var(--alt1-bgcolor);\n  }\n\n  h1 {\n\t  color: var(--alt1-color);\n\t  font-size: 1.2em;\n\t  text-align: center;\n\t  margin: 0;\n\t  padding: .3em;\n  }\n\n  .form {\n\t  display: grid;\n\t  grid-template-columns: auto 1fr;\n\t  grid-template-rows: auto;\n\t  grid-gap: .7em;\n\t  margin-inline-start: .5em;\n  }\n\n  .form > wsp-task-field-lc {\n\t  width: max-content;\n  }\n\n  label {\n\t  color: var(--alt1-color);\n\t  align-self: center;\n  }\n\n  label.top {\n\t  align-self: start;\n  }\n\n  .oneCol {\n\t  grid-column-start: 1;\n\t  grid-column-end: 3;\n  }\n`)
customElements.define("wsp-task-layout",TaskLayout)

//# sourceMappingURL=taskLayout.js.map