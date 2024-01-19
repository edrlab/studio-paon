import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{EUserType,USER}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
export class UserRef extends BaseElement{get nickOrAccount(){return this._nickOrAccount}set nickOrAccount(n){if(this._nickOrAccount!==n){this._nickOrAccount=n
this._user=null
if(n)this.fetchUser()
this.refresh()}}get user(){return this._user}set user(n){this._nickOrAccount=n?n.account:null
this._user=n
this.refresh()}get usersSrv(){return this.reg.env.universe.useUsers}_initialize(init){this._props=Object.assign({withIcon:true,withTitle:true,showLongName:false},init)
this.reg=this.findReg(this._props)
this._attach(this.localName,this._props,JSX.createElement("span",null))
if(this._props.user){this.user=this._props.user}else{this.nickOrAccount=this._props.nickOrAccount}}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
init.nickOrAccount=this.getAttribute("account")
return init}async fetchUser(){const pending=this._pending=this.usersSrv.getUserBatch(this._nickOrAccount)
const user=await pending
if(this._pending!==pending)return
this._pending=null
this._user=user
this.refresh()}_refresh(){const span=this.shadowRoot.lastElementChild
DOM.setAttrBool(this,"data-withIcon",this._props.withIcon)
if(this._pending){DOM.setTextContent(span,"...")
if(this._props.withTitle)DOM.setAttr(this,"title",null)}else if(!this.nickOrAccount){DOM.setTextContent(span,"")
DOM.setAttr(this,"title",null)
DOM.setAttrBool(this,"data-isEmpty",true)}else if(!this._user){DOM.setTextContent(span,this._nickOrAccount)
DOM.setAttr(this,"title","Utilisateur / groupe inconnu")
DOM.setAttrBool(this,"data-isGroup",false)
DOM.setAttrBool(this,"data-isEmpty",false)
DOM.setAttrBool(this,"data-isUnknown",true)}else{const longName=USER.getLongName(this._user)
let text=USER.getPrimaryName(this._user)
if(this._props.showLongName&&longName)text+=` (${longName})`
DOM.setTextContent(span,text)
if(this._user.isUnknown)DOM.setAttr(this,"title","Utilisateur / groupe inconnu")
else DOM.setAttr(this,"title",this._props.withTitle?longName:null)
DOM.setAttrBool(this,"data-isGroup",this._user.userType===EUserType.group)
DOM.setAttrBool(this,"data-isEmpty",false)
DOM.setAttrBool(this,"data-isUnknown",this._user.isUnknown)
DOM.setAttrBool(this,"data-isAnonymous",this._user.isAnonymous)}}}REG.reg.registerSkin("c-userref",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 1.2em;\n\t\tmin-width: 0;\n\t\tcolor: var(--alt2-color);\n\t}\n\n\t:host([data-isEmpty]) {\n\t\tvisibility: collapse;\n\t}\n\n\t:host(.inline) {\n\t\tdisplay: inline;\n\t}\n\n\t:host(.list) {\n\t\tcolor: var(--color);\n\t}\n\n\t:host([data-withIcon]) span {\n\t\tbackground-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/user.svg);\n\t\tbackground-position: left;\n\t\tbackground-size: auto 1em;\n\t\tbackground-repeat: no-repeat;\n\t\tpadding-inline-start: 1.2em;\n\t}\n\n  :host([data-isGroup][data-withIcon]) span {\n\t  background-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/objects/group.svg);\n\t  padding-inline-start: 1.6em;\n  }\n\n  :host([data-isUnknown]) span {\n\t  filter: grayscale(100%);\n\t  font-style: italic;\n  }\n\n  :host([data-isAnonymous]) span {\n\t  background-image: unset;\n\t  font-style: italic;\n  }\n\n\n`)
customElements.define("c-userref",UserRef)

//# sourceMappingURL=userRef.js.map