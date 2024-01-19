import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{ActionBtn,Button,ButtonToggle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
export class ErrorViewer extends BaseElement{_initialize(init){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
const reg=this.findReg(init)
reg.installSkin("webzone:panel",sr)
reg.installSkin("standard-dialog",sr)
reg.installSkin("scroll/small",sr)
this._initAndInstallSkin("c-error-viewer",init)
sr.appendChild(JSX.createElement("div",{id:"message"},init.error.msg))
const main=sr.appendChild(JSX.createElement("div",{id:"main"}))
if(init.error.details){main.appendChild(JSX.createElement("div",{id:"details"},init.error.details))
DOM.addClass(this,"details")}if(init.error.technicalDetails){this._showTechnicalBtn=main.appendChild((new ButtonToggle).initialize({uiContext:"dialog",label:"Afficher le détail technique"}))
this._technicalCo=main.appendChild(JSX.createElement("div",{id:"technicalCo",hidden:""},init.error.technicalDetails))
this._showTechnicalBtn.onclick=function(){const self=DOMSH.findHost(this)
if(!this.toggleOn){this.toggleOn=true
self._technicalCo.hidden=false
self._reportCo.hidden=true
self._showReportBtn.toggleOn=false
DOM.addClass(self,"report")}else{this.toggleOn=false
self._technicalCo.hidden=true
DOM.removeClass(self,"report")}}}this._showReportBtn=main.appendChild((new ButtonToggle).initialize({uiContext:"dialog",label:"Afficher le rapport complet"}))
this._reportCo=main.appendChild(JSX.createElement("div",{id:"reportCo",hidden:""},ERROR.getReport(init.error)))
this._showReportBtn.onclick=function(){const self=DOMSH.findHost(this)
if(!this.toggleOn){this.toggleOn=true
self._reportCo.hidden=false
if(self._technicalCo){self._technicalCo.hidden=true
self._showTechnicalBtn.toggleOn=false}DOM.addClass(self,"report")}else{this.toggleOn=false
self._reportCo.hidden=true
DOM.removeClass(self,"report")}}
const footer=sr.appendChild(JSX.createElement("div",{id:"footer"}))
const actionContext={error:init.error,emitter:this}
for(const action of REG.reg.getList("actions:error")){footer.appendChild((new ActionBtn).initialize({action:action,actionContext:actionContext,uiContext:"dialog"}))}const closeBtn=footer.appendChild((new Button).initialize({uiContext:"dialog",label:"Fermer"}))
closeBtn.onclick=function(){POPUP.findPopupableParent(this).close()}}}REG.reg.registerSkin("c-error-viewer",1,`\n\t:host(.report) {\n\t\theight: 80vh;\n\t}\n\n\t#message {\n\t\tfont-weight: 1.5em;\n\t\tfont-weight: bold;\n\t\ttext-align: center;\n\t\tmargin: 1em;\n\t}\n\n\t#main {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tflex: 1;\n\t\tmargin: 1em;\n\t}\n\n\t:host(.report) #main {\n\t\tmin-height: 10em;\n\t}\n\n\t#details {\n\t\twhite-space: pre;\n\t\tpadding: 1em;\n\t}\n\n\tc-button-toggle {\n\t\tfont-size: 0.9em;\n\t\tmargin: 0.3em 0.5em;\n\t}\n\n\t#reportCo, #technicalCo {\n\t\tflex: 1;\n\t\toverflow: auto;\n\t\tbackground-color: var(--edit-bgcolor);\n\t\twhite-space: pre;\n\t\tpadding: 1em;\n\t}\n\n\t.msgList {\n\t\tpadding-inline-start: 1em;\n\t\tmargin: 0;\n\t}\n\n\t.error {\n\t\tcolor: var(--error-color);\n\t}\n\n\t.warn {\n\t\tcolor: var(--warning-color);\n\t}\n`)
customElements.define("c-error-viewer",ErrorViewer)
export let copyReportAction=(new Action).setLabel("Copier le rapport").setExecute((async function(ctx){try{await navigator.clipboard.writeText(ERROR.getReport(ctx.error))
POPUP.showNotifInfo("Le rapport a été copié dans le presse-papier.",ctx.emitter)}catch(e){POPUP.showNotifError("Le rapport n\'a pas pu être copié dans le presse-papier. Vérifiez dans votre navigateur que vous avez autorisé ce site à accéder au presse-papier.",ctx.emitter)}}))
REG.reg.addToList("actions:error","copyReport",1,copyReportAction,0)

//# sourceMappingURL=errorViewer.js.map