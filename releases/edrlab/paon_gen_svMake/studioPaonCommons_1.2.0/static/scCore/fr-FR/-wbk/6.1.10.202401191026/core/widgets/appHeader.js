import{BaseElement,BASIS,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{BarActions,BarShared}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
export class AppHeader extends BaseElement{_initialize(init){this.reg=this.findReg(init)
this.actionContext=init.actionContext
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
const row1=sr.appendChild(JSX.createElement("div",null,JSX.createElement("slot",null)))
if(init.forceSharedBar||!this.reg.getUserData("app.sharedBar.hide",true)){sr.appendChild(JSX.createElement("slot",{name:"bar"}))
const initBar=BASIS.newInit(init.sharedBar,this.reg)
initBar.actionContext=init.actionContext
initBar.focusListening=init.focusListening
this.appendChild(JSX.createElement(BarShared,{"î":initBar,slot:"bar"}))}if(init.mainActions&&init.mainActions.length>0){const initMain=BASIS.newInit(init.mainBar,this.reg)
initMain.actionContext=init.actionContext
initMain.actions=init.mainActions
this._mainActions=row1.insertBefore((new BarActions).initialize(initMain),row1.firstChild)}if(init.moreActions&&init.moreActions.length>0){const initMore=BASIS.newInit(init.moreBar,this.reg)
initMore.actionContext=init.actionContext
initMore.actions=init.moreActions
this._barActions=row1.appendChild((new BarActions).initialize(initMore))}}refresh(){super.refresh()
if(this._mainActions)this._mainActions.refresh()
if(this._barActions)this._barActions.refresh()}setHeadband(msg,level,icon){if(msg){if(!this._headband)this._headband=JSX.createElement(MsgLabel,{class:"headband"})
if(!this._headband.isConnected)this.shadowRoot.insertBefore(this._headband,this.shadowRoot.firstChild)
this._headband.setCustomMsg(msg,level,icon)}else{if(this._headband&&this._headband.isConnected)this._headband.remove()}}}REG.reg.registerSkin("c-appheader",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: min-content;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tjustify-content: center;\n\t}\n\n\tdiv {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\tslot {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex: 1;\n\t}\n\n\tc-button-actions {\n\t\tpadding: .2em;\n\t\tmargin: .2em;\n\t\tbackground: none;\n\t}\n`)
customElements.define("c-appheader",AppHeader)

//# sourceMappingURL=appHeader.js.map