import{EWedletEditMode,EWedletEditModeLabel,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{ECidSessionState}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/cid.js"
import{CidInteractionByStepsUi}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/cidUi.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{REMOTE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/remote.js"
export class BoxCidAction extends HTMLElement{constructor(){super(...arguments)
this.metas=new Map
this.cidMetaIn="publicUrl"
this.cidMetaOut="publicUrl"
this.cidHostUse="both"}get label(){return this.getAttribute("label")}get icon(){return this.getAttribute("icon")}async doBtnAction(){if(this.disabled)return
const me=DOMSH.findHost(this)
if(me.filePickerElt)me.filePickerElt.click()
else me.doCidProcess()}onSelectFile(){const me=DOMSH.findHost(this)
me.fileToUpload=this.files?this.files.item(0):null
this.value=null
if(me.fileToUpload)me.doCidProcess()}async doCidProcess(){const ct=JSX.createElement(CidInteractionByStepsUi,null)
ct.overrideMetas=async(ctx,metasIn,foreignMetas)=>{if(this.cidMetaIn){const url=await REMOTE.migrateUrl(this.url,this.reg)
if(url)metasIn[this.cidMetaIn]=url}if(this.fileToUpload)metasIn["fileName"]=this.fileToUpload.name
if(this.metas&&this.metas.size>0){this.metas.forEach((value,key)=>{metasIn[key]=value})}}
const cidSessionConfig={}
if(this.fileToUpload){cidSessionConfig.bodyToUpload=await this.fileToUpload}ct.initialize({reg:this.reg,skinOver:"webzone:panel",cidProcessIs:this.cidProcessIs,cidHostIs:this.cidHostIs,cidManifestUrlInput:this.cidManifestUrlInput,cidPassOptionalInteraction:this.cidPassOptionalInteraction,cidHostUse:this.cidHostUse,cidSessionConfig:cidSessionConfig,onInteractionEndHandler:async cidSession=>{switch(cidSession.state){case ECidSessionState.failed:await ERROR.showError({msg:"Échec d\'interaction avec le serveur de ressources",details:cidSession.failedReason})
break
case ECidSessionState.ended:const xa=this.wedlet.wedAnchor
const batch=this.wedlet.wedMgr.docHolder.newBatch()
let value=cidSession.metasOut[this.cidMetaOut]||""
if(this.injectAlias)value=await REMOTE.aliasUrl(value,this.reg)
if(this.wedlet.isVirtual()){WEDLET.insertDatasFromDisplay(this.wedlet,batch,value)}else{batch.setText(xa,value)}batch.doBatch()}result.close()}})
const result=POPUP.showDialog(ct,this.reg.env.uiRoot,{titleBar:{barLabel:{label:this.label},closeButton:{}},initWidth:"70vw",initHeight:"70vh",resizer:{}})}configWedletElt(tpl,wedlet){this.wedlet=wedlet
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
WEDLET.installSkins(tpl,sr,wedlet,this.localName)
this.reg=wedlet.wedMgr.reg
if(!this.visiblePerms||this.reg.hasPerm(this.visiblePerms)){this._button=sr.appendChild(this.createButton())
this._button.disabled=this.enablePerms&&!this.reg.hasPerm(this.enablePerms)||!WEDLET.isWritableWedlet(this.wedlet)}const metaElts=tpl.querySelectorAll("meta")
metaElts.forEach(metaElt=>{this.metas.set(metaElt.getAttribute("code"),metaElt.getAttribute("value"))})
const filePicker=tpl.querySelector("filePicker")
if(filePicker){this.filePickerElt=JSX.createElement("input",{type:"file",accept:filePicker.getAttribute("accept"),onchange:this.onSelectFile,style:"display:none;"})
sr.appendChild(this.filePickerElt)}const cidProcessIsElts=tpl.querySelectorAll("cidProcesses > cidProcessIs")
if(cidProcessIsElts&&cidProcessIsElts.length>0){this.cidProcessIs=[]
cidProcessIsElts.forEach(entry=>{if(entry.textContent)this.cidProcessIs.push(entry.textContent.split(" "))})}else if(tpl.hasAttribute("cidProcessIs")){this.cidProcessIs=tpl.getAttribute("cidProcessIs").split(" ")}const cidHostIsElts=tpl.querySelectorAll("cidHosts > cidHostIs")
if(cidHostIsElts&&cidHostIsElts.length>0){this.cidHostIs=[]
cidHostIsElts.forEach(entry=>{if(entry.textContent)this.cidHostIs.push(entry.textContent.split(" "))})}else if(tpl.hasAttribute("cidHostIs")){this.cidHostIs=tpl.getAttribute("cidHostIs").split(" ")}if(tpl.hasAttribute("injectAlias"))this.injectAlias=tpl.getAttribute("injectAlias")=="true"
if(tpl.hasAttribute("cidManifestUrlInput"))this.cidManifestUrlInput=tpl.getAttribute("cidManifestUrlInput")=="true"
if(tpl.hasAttribute("cidPassOptionalInteraction"))this.cidPassOptionalInteraction=tpl.getAttribute("cidPassOptionalInteraction")=="true"
if(tpl.hasAttribute("cidHostUse"))this.cidHostUse=tpl.getAttribute("cidHostUse")
if(tpl.hasAttribute("cidMetaIn"))this.cidMetaIn=tpl.getAttribute("cidMetaIn")
if(tpl.hasAttribute("cidMetaOut"))this.cidMetaOut=tpl.getAttribute("cidMetaOut")
if(tpl.hasAttribute("visiblePerms"))this.visiblePerms=tpl.getAttribute("visiblePerms").split(" ")
if(tpl.hasAttribute("enablePerms"))this.enablePerms=tpl.getAttribute("enablePerms").split(" ")}createButton(){return JSX.createElement(Button,{onclick:this.doBtnAction,label:this.label,title:this.title,icon:this.icon})}refreshBindValue(val){this.url=val
WEDLET.clearAnnots(this)}insertChars(from,chars,msg){this.refreshBindValue(LANG.stringInsert(this.url,from,chars))}deleteChars(from,len,msg){this.refreshBindValue(LANG.stringDelete(this.url,from,len))}replaceChars(chars,msg){this.refreshBindValue(chars)}setEditMode(mode){DOM.setAttr(this,"edit-mode",EWedletEditModeLabel[mode])
this.reassessPerms()}reassessPerms(){if(this.visiblePerms&&!this.reg.hasPerm(this.visiblePerms)){if(this._button){this._button.remove()
this._button=null}}else{if(!this._button)this._button=this.shadowRoot.appendChild(this.createButton())}if(this._button){this._button.disabled=this.getAttribute("edit-mode")!==EWedletEditModeLabel[EWedletEditMode.write]||this.enablePerms&&!this.reg.hasPerm(this.enablePerms)}}}window.customElements.define("box-cid-action",BoxCidAction)

//# sourceMappingURL=boxCidAction.js.map