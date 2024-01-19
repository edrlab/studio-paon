import{BaseElementAsync,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{ItemEditInDialogInfoBroker,ItemXmlEd}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/item/itemXmlEd.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{AppHeader}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/appHeader.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{EWspChangesEvts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
export class ItemEdApp extends BaseElementAsync{async _initialize(init){this.reg=this.findReg(init)
this.appDef=init.appDef
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
if(!Desk.checkCompat("edit")){const msg=sr.appendChild(JSX.createElement("div",null,JSX.createElement("p",null,"Ce navigateur n\'est pas compatible avec l\'édition de texte riche."),JSX.createElement("p",null,"Vous pouvez utiliser un des navigateurs à jour suivants :"),JSX.createElement("ul",null,Desk.knownNavCompat.map(n=>n.url?JSX.createElement("li",null,JSX.createElement("a",{href:n.url,target:"_blank"},n.name)):JSX.createElement("li",null,n.name)))))
return}const root=sr.appendChild(JSX.createElement("div",{style:"display:contents"}))
sr.insertBefore((new AppHeader).initialize({reg:this.reg,mainActions:this.reg.getList("actions:itemEdApp:bar:main"),actionContext:this,focusListening:root}),root)
return this.initEditor(root,init)}async initEditor(root,init){try{const subInit=Object.create(init)
const def=this.appDef.itemEd
subInit.reg=this.reg
subInit.wspCd=def.wspCd
subInit.srcRef=def.srcRef
subInit.editorKey=def.editorKey
subInit.initItemReg=reg=>{reg.env.infoBroker=new ItemEditInDialogInfoBroker(WSP.findWspReg(reg))}
this.itemEditor=root.appendChild((new ItemXmlEd).initialize(subInit))
await this.itemEditor.initializedAsync
const currentModel=this.itemEditor.reg.env.longDesc.itModel
this.itemEditor.reg.env.place.eventsMgr.on("wspUriChange",(msg,from)=>{if(msg.wspCd!==this.itemEditor.reg.env.wsp.code)return
if(msg.type===EWspChangesEvts.r&&SRC.isSubUriOrEqual(msg.srcUri,this.itemEditor.reg.env.longDesc.srcUri)){if(this.itemEditor)this.showFailure("Cet item a été supprimé.")}else if(msg.type===EWspChangesEvts.u&&msg.srcUri===this.itemEditor.reg.env.longDesc.srcUri){this.itemEditor.reg.env.wsp.fetchShortDesc(SRC.srcRef(msg)).then(sd=>{if(currentModel!==sd.itModel&&this.itemEditor){const itemType=this.itemEditor.reg.env.wsp.wspMetaUi.getItemType(sd.itModel)
if(itemType&&itemType.getEditor(subInit.editorKey)){this.itemEditor.closeEditor()
this.itemEditor.remove()
this.itemEditor=null
return this.initEditor(root,init)}else{this.showFailure("Une modification externe de cet item ne permet plus son affichage dans ce contexte.")}}}).catch(()=>{this.showFailure("Échec à l\'affichage de cet item suite à une modification externe.")})}})}catch(e){this.showFailure("Échec à l\'affichage de cet item.")}}showFailure(msg){if(this.itemEditor)this.itemEditor.remove()
this.itemEditor=null
this.shadowRoot.appendChild((new MsgLabel).initialize({reg:this.reg,label:msg}))}onViewHidden(closed){if(this.itemEditor){if(closed){this.itemEditor.closeEditor()}else{VIEWS.onViewHidden(this.itemEditor,closed)}}}updateAppDef(def){return false}}REG.reg.registerSkin("wsp-item-ed-app",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t  min-width: 0;\n\t  flex-direction: column;\n  }\n\n  wsp-item-ed-app {\n\t  flex: 1;\n  }\n\n  hr {\n\t  border-top: 1px solid var(--border-color);\n\t  border-inline-start: 1px solid var(--border-color);\n\t  border-inline-end: none;\n\t  border-bottom: none;\n\t  margin: 0;\n  }\n`)
customElements.define("wsp-item-ed-app",ItemEdApp)

//# sourceMappingURL=itemEdApp.js.map