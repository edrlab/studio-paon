import{BaseElementAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{RESPS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{InputUserPanel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/inputs.js"
import{EUserType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
export class SrcEditResp extends BaseElementAsync{get wsp(){return this.reg.env.wsp}async _initialize(init){this.reg=this.findReg(init)
this.conf=init
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("webzone:panel",sr)
this.reg.installSkin("standard-dialog",sr)
this._initAndInstallSkin(this.localName,init)
const refUris=[]
this.conf.shortDescs.forEach(entry=>refUris.push(entry.srcUri))
this.longDescs=await WSP.fetchLongDescs(this.wsp,this,...refUris)
this._iniValues=new Set
this.longDescs.forEach(shortDesc=>{const respList=RESPS.toRespsList(shortDesc.rspUsrs)
if(respList&&respList[this.conf.resp.code])respList[this.conf.resp.code].forEach(account=>this._iniValues.add(account))})
const main=sr.appendChild(JSX.createElement("div",{id:"main"},JSX.createElement("div",{class:"key"},this.conf.resp.name)))
this._inptElt=main.appendChild(JSX.createElement(InputUserPanel,{"î":Object.assign({reg:this.reg,userCard:this.conf.resp.userCard,required:false,selectWithConfirm:false,usersGridInit:{usersSrv:init.reg.env.universe.useUsers,filterGroups:this.conf.resp.usersSelection.restrictFromGroups,filterType:this.conf.resp.usersSelection.userType==="groups"?EUserType.group:this.conf.resp.usersSelection.userType==="users"?EUserType.user:null}},this.conf.confInput)}))
if(this.longDescs.length===1){this._inptElt.value=Array.from(this._iniValues)}else{if(this.conf.resp.userCard==="single"){if(this._iniValues.size===1)this._inptElt.value=Array.from(this._iniValues)
else if(this._iniValues.size>1)this._inptElt.forcedIniUsers=[{account:"-",nickNames:["Valeurs hétérogènes"],isUnknown:true}]}else{const iniUsers=this.reg.env.universe.useUsers.getUserSet(Array.from(this._iniValues),true)
iniUsers.then(resp=>{this._inptElt.forcedIniUsers=resp})}}this._inptElt.addEventListener("input",async()=>{this.refreshUi()})
const footer=sr.appendChild(JSX.createElement("div",{id:"footer"}))
this._doBtn=footer.appendChild(JSX.createElement(Button,{id:"do",disabled:true,class:"default",label:this.conf.doBtnLabel||"Enregistrer","ui-context":"dialog",onclick:this.onDoBtn}))
footer.appendChild(JSX.createElement(Button,{id:"cancel",label:"Annuler","ui-context":"dialog",onclick:this.onCancelBtn}))
this._inptElt.focus()}refreshUi(){const isDirty=this.computeDiffs()!=null
DOM.setAttrBool(this._doBtn,"disabled",!isDirty)}async validAndDo(){try{const diffs=this.computeDiffs()
if(diffs){const srcUris=[]
this.longDescs.forEach(shortDesc=>srcUris.push(shortDesc.srcUri))
if("single"in diffs)await ITEM.fetchUpdateRespByRespSingle(this.reg.env.wsp,this,srcUris,this.conf.resp.code,diffs.single)
else await ITEM.fetchUpdateRespByRespMulti(this.reg.env.wsp,this,srcUris,this.conf.resp.code,diffs.adds,diffs.removes)
POPUP.findPopupableParent(this).close(true)}POPUP.findPopupableParent(this).close(false)}catch(e){const resp=this.conf.resp.name
await ERROR.report(`Échec lors de la mise à jour de la responsabilité \'${resp}\'`,e)
POPUP.findPopupableParent(this).close(null)}}onCancelBtn(){POPUP.findPopupableParent(this).close()}onDoBtn(){if(!this.disabled)DOMSH.findHost(this).validAndDo()}computeDiffs(){var _a
const result={}
const srcUris=[]
this.longDescs.forEach(shortDesc=>srcUris.push(shortDesc.srcUri))
if(this.conf.resp.userCard==="single"){if(this._inptElt.value&&this._inptElt.value[0]){if(!this._iniValues||this._iniValues.size!=1||!this._iniValues.has(this._inptElt.value[0])){result.single=this._inptElt.value[0]
return result}}else if(this._iniValues&&this._iniValues.size>0&&(!this._inptElt.forcedIniUsers||this._inptElt.forcedIniUsers.length==0)){result.removes=Array.from(this._iniValues)
return result}}else if(this.conf.resp.userCard==="multi"){result.adds=[]
result.removes=[]
if(this._iniValues){this._iniValues.forEach(account=>{var _a,_b
if(!((_a=this._inptElt.forcedIniUsers)===null||_a===void 0?void 0:_a.find(user=>user.account===account))&&!((_b=this._inptElt.value)===null||_b===void 0?void 0:_b.find(val=>account===val)))result.removes.push(account)})}(_a=this._inptElt.value)===null||_a===void 0?void 0:_a.forEach(account=>{result.adds.push(account)})
if(result.adds.length>0||result.removes.length>0)return result}return null}}REG.reg.registerSkin("wsp-src-editresp",1,`\n\t:focus-visible {\n\t\toutline: var(--focus-outline);\n\t}\n\n\t.key {\n\t\tmargin-inline-end: 1em;\n\t}\n\n\t#main {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: row;\n\t\talign-items: center;\n\t\tpadding: .5em;\n\t}\n\n\tc-input-users-panel {\n\t\tflex: 1;\n\t}\n\n\tc-button {\n\t\tmin-width: 8em;\n\t}\n`)
customElements.define("wsp-src-editresp",SrcEditResp)

//# sourceMappingURL=srcEditResp.js.map