import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{ItemDynGen}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/item/itemDynGen.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{TASK}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/lcTask.js"
export class TaskDynGen extends ItemDynGen{_initialize(init){init.skin="wsp-task-dyngen"
if(!init.toolbar)init.toolbar=false
if(init.autoResize===undefined)init.autoResize=true
super._initialize(init)}connectedCallback(){super.connectedCallback()
if(SRC.isNewSrcUri(this.reg.env.longDesc.srcUri)){TASK.hideContextField(this,true)}}}customElements.define("wsp-task-dyngen",TaskDynGen)
REG.reg.registerSkin("wsp-task-dyngen",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\toverflow: auto;\n\t}\n`)

//# sourceMappingURL=taskDynGen.js.map