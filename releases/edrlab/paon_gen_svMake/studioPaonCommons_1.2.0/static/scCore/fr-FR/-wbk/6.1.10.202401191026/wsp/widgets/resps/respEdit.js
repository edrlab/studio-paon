import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{BaseElement,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{InputUserPanel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/inputs.js"
import{RESPS,SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{EUserType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/actions_Perms.js"
export class RespEditField extends BaseElement{get resp(){return this._resp}_initialize(init){this.reg=this.findReg(init)
const longDesc=this.reg.env.longDesc
const itemType=this.reg.env.wsp.wspMetaUi.getItemType(longDesc.itModel)
this._resp=itemType.getResp(init.resp)
if(this.resp){this._inputSingleUser=JSX.createElement(InputUserPanel,{class:"values","î":Object.assign({reg:this.reg,userCard:this.resp.userCard,required:this.resp.required,selectWithConfirm:true,usersGridInit:{usersSrv:init.reg.env.universe.useUsers,filterGroups:this.resp.usersSelection.restrictFromGroups,filterType:this.resp.usersSelection.userType==="groups"?EUserType.group:this.resp.usersSelection.userType==="users"?EUserType.user:null}},init.confInput)})
this._update()
this._inputSingleUser.addEventListener("change",this.onChange)}this._attach(this.localName,init,this._inputSingleUser||JSX.createElement(MsgLabel,{class:"more","î":{label:"Responsabilité inconnue",level:"error"}}))}async onChange(ev){const me=DOMSH.findHost(this)
try{if(me.isWritable()){const longDesc=me.reg.env.longDesc
const rspUsrs=RESPS.toRespsList(longDesc.rspUsrs)
const iniValue=rspUsrs[me.resp.code]||[]
if(me.resp.userCard==="single"){if(this.value&&this.value[0])await ITEM.fetchUpdateRespByRespSingle(me.reg.env.wsp,me,[SRC.srcRef(me.reg.env.longDesc)],me.resp.code,this.value[0])
else await ITEM.fetchUpdateRespByRespMulti(me.reg.env.wsp,me,[SRC.srcRef(me.reg.env.longDesc)],me.resp.code,null,iniValue)}else if(me.resp.userCard==="multi"){const newValue=this.value||[]
const adds=[]
const removes=[]
newValue.forEach(resp=>{if(iniValue.indexOf(resp)==-1)adds.push(resp)})
iniValue.forEach(resp=>{if(newValue.indexOf(resp)==-1)removes.push(resp)})
await ITEM.fetchUpdateRespByRespMulti(me.reg.env.wsp,me,[SRC.srcRef(me.reg.env.longDesc)],me.resp.code,adds,removes)}}}catch(e){const resp=me.resp.name
await ERROR.report(`Échec lors de la mise à jour de la responsabilité \'${resp}\'`,e)}}isWritable(){return this.reg.hasPerm("action.item#set.resps")}_update(){const longDesc=this.reg.env.longDesc
const rspUsrs=RESPS.toRespsList(longDesc.rspUsrs)
this._inputSingleUser.value=rspUsrs[this.resp.code]||[]
this._inputSingleUser.disabled=!this.isWritable()}}customElements.define("resp-field-edit",RespEditField)
REG.reg.registerSkin("resp-field-edit",1,`\n\tc-input-users-panel:invalid {\n\t\tborder-color: var(--error-color);\n\t}\n\n\tc-input-users-panel {\n\t\tborder: 1px solid transparent;\n\t}\n\n`)

//# sourceMappingURL=respEdit.js.map