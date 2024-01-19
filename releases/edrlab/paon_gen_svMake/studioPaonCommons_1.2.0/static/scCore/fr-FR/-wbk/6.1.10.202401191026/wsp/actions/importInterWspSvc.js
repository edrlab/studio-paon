import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{ESrcSt,SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{SrcNewCode}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/srcNewCode.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{DOM,JSX,ShadowJsx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp_Perms.js"
export class WspImportInterWsp{async importSrc(wspFrom,srcFrom,options,reg,uiCtx){this.transientCache=null
const canPrx=this.canPrx(wspFrom,srcFrom,options,reg,uiCtx)
const canCopy=this.canCopy(wspFrom,srcFrom,options,reg,uiCtx)
const canExt=this.canExt(wspFrom,srcFrom,options,reg,uiCtx)
const countChoices=(canCopy?1:0)+(canExt?1:0)+(canPrx?1:0)
if(countChoices>1){const ct=JSX.createElement("form",{id:"main"})
if(canExt){ct.appendChild(JSX.createElement("label",null,JSX.createElement("input",{name:"choice",value:"ext",type:"radio"}),"Lier directement cet item étranger"))}if(canPrx){const transient=await this.getTransient(wspFrom,srcFrom,options,reg,uiCtx)
if(!transient.srcId){ct.appendChild(JSX.createElement("label",{class:"ctrlLbl"},JSX.createElement("input",{name:"choice",value:"prx",type:"radio"}),"Créer une réplique locale de cet item étranger"))}else if(options.refExtItemAcceptable){ct.appendChild(JSX.createElement("label",{class:"ctrlLbl"},JSX.createElement("input",{name:"choice",value:"prx",type:"radio"}),"Lier la réplique locale (déjà créée) de cet item étranger"))}else if(options.uriParentFrozen&&ITEM.isAirItem(transient.srcUri)){ct.appendChild(JSX.createElement("label",{class:"ctrlLbl"},JSX.createElement("input",{name:"choice",value:"prx",type:"radio"}),"Ancrer dans cet espace la réplique locale (déjà créée) de cet item étranger"))}else{const uri=ITEM.getItemUriLabel(transient.srcUri)
ct.appendChild(JSX.createElement("label",null,JSX.createElement("input",{name:"choice",value:"prx",disabled:"",type:"radio"}),`Une réplique de cet item étranger existe déjà :`,JSX.createElement("wsp-src-drawer-inline",{"î":{reg:reg,shortDesc:transient}})))}}if(canCopy){ct.appendChild(JSX.createElement("label",null,JSX.createElement("input",{name:"choice",value:"copy",type:"radio"}),"Dupliquer ce contenu étranger dans l\'atelier"))}const firstOpt=DOM.findNext(ct,ct,elt=>elt instanceof HTMLInputElement&&!elt.disabled)
if(firstOpt)firstOpt.checked=true
const result=await POPUP.showDialog(JSX.createElement("c-box",{skinOver:"webzone:panel form-control-areas standard-dialog",onkeypress:function onKeypress(ev){if(ev.key==="Enter"){ev.preventDefault()
ev.stopImmediatePropagation()
this.shadowRoot.getElementById("ok").click()}}},JSX.createElement(ShadowJsx,null,ct,JSX.createElement("div",{id:"footer"},JSX.createElement("c-button",{id:"ok",label:"Valider",class:"default","ui-context":"dialog",onclick:function(){POPUP.findPopupableParent(this).close(ct.elements.namedItem("choice").value)}}),JSX.createElement("c-button",{label:"Annuler","ui-context":"dialog",onclick:function(){POPUP.findPopupableParent(this).close(null)}})))),uiCtx,{titleBar:"Contenu issu d\'un autre atelier..."}).onNextClose()
switch(result){case"ext":return reg.env.wsp.fetchShortDesc(ITEM.buildTansientUri(wspFrom.code,srcFrom.srcUri),uiCtx)
case"prx":return this.doPrx(wspFrom,srcFrom,options,reg,uiCtx)
case"copy":return this.doCopy(wspFrom,srcFrom,options,reg,uiCtx)}return null}else if(canExt){return reg.env.wsp.fetchShortDesc(ITEM.buildTansientUri(wspFrom.code,srcFrom.srcUri),uiCtx)}else if(canCopy){return this.doCopy(wspFrom,srcFrom,options,reg,uiCtx)}else if(canPrx){return this.doPrx(wspFrom,srcFrom,options,reg,uiCtx)}else if(options.refExtItemAcceptable){if(!wspFrom.isPublic){POPUP.showNotifForbidden("L\'atelier auquel appartiennent les items issus du presse-papier n\'est pas déclaré \'public\', les items ne peuvent pas être directement référencés.",uiCtx)}else if(reg.env.wsp.isExtItem){POPUP.showNotifForbidden("Cet atelier n\'est pas configuré pour pouvoir référencer des items issus d\'autres ateliers.",uiCtx)}else{POPUP.showNotifForbidden("Impossible de copier des contenus issus d\'un autre atelier.",uiCtx)}}else{POPUP.showNotifForbidden("Impossible de copier des contenus issus d\'un autre atelier.",uiCtx)}return null}async getTransient(wspFrom,srcFrom,options,reg,uiCtx){if(!this.transientCache){this.transientCache=reg.env.universe.config.backEnd==="odb"?await WSP.fetchShortDesc(reg.env.wsp,uiCtx,"/~transient/"+wspFrom.code+srcFrom.srcUri):srcFrom}return this.transientCache}canCopy(wspFrom,srcFrom,options,reg,uiCtx){if(!wspFrom.reg.hasPerm("read.node.copyFrom.interWsp"))return false
if(!wspFrom.reg.hasPermission("write.node.duplicate",srcFrom.srcRoles,reg.env.universe.auth.currentUser.isSuperAdmin,srcFrom.srcRi))return false
return options.refExtItemAcceptable?ITEM.getSrcUriType(srcFrom.srcUri)==="item":true}canPrx(wspFrom,srcFrom,options,reg,uiCtx){return false}canExt(wspFrom,srcFrom,options,reg,uiCtx){return options.refExtItemAcceptable&&wspFrom.isPublic&&reg.env.wsp.isExtItem}async doPrx(wspFrom,srcFrom,options,reg,uiCtx){const transient=await this.getTransient(wspFrom,srcFrom,options,reg,uiCtx)
if(transient.srcId){if(transient.srcSt===ESrcSt.none){if(await POPUP.confirm("Une réplique de cet item étranger existe déjà dans cet atelier, mais est en corbeille. Voulez-vous la restaurer ?",uiCtx,{okLbl:"Restaurer"})){await WSP.srcRestore(reg.env.wsp,uiCtx,[transient.srcId])}else return null}if(options.uriParentFrozen){if(ITEM.getSrcUriType(transient.srcUri)==="item"&&ITEM.isAirItem(transient.srcUri)){const ct=(new SrcNewCode).initialize({reg:reg,parentFolder:options.defaultUriParent,defaultCode:SRC.extractLeafFromUri(transient.srcUri),targetSrcUriType:ITEM.getSrcUriType(transient.srcUri),doBtnReplaceLabel:options.allowReplace?"Remplacer le contenu existant":undefined,inputLabel:"Une réplique de cet item étranger existe déjà sous forme d\'un item flottant. Voulez-vous l\'ancrer dans cet espace ?",doBtnLabel:"Ancrer"})
const newCode=await POPUP.showDialog(ct,uiCtx,{titleBar:{barLabel:{label:"Ancrer la réplique de cet item étranger..."}}}).onNextClose()
if(newCode){const newUri=SRC.addLeafToUri(options.defaultUriParent,newCode)
await WSP.srcMove(reg.env.wsp,uiCtx,transient.srcId,newUri)
return WSP.fetchShortDesc(reg.env.wsp,uiCtx,newUri)}return null}else{const uri=ITEM.getItemUriLabel(transient.srcUri)
POPUP.showNotifInfo(`Une réplique de cet item étranger existe déjà : ${uri}`,uiCtx)
return transient}}return transient}if(options.uriParentFrozen){const uri=ITEM.extractSpaceLabel(options.defaultUriParent)
const ct=(new SrcNewCode).initialize({reg:reg,parentFolder:options.defaultUriParent,defaultCode:SRC.extractLeafFromUri(transient.srcUri),targetSrcUriType:ITEM.getSrcUriType(transient.srcUri),inputLabel:`Code de cette réplique dans l\'espace : ${uri}`,doBtnLabel:"Créer"})
const newCode=await POPUP.showDialog(ct,uiCtx,{titleBar:{barLabel:{label:"Créer la réplique de cet item étranger..."}}}).onNextClose()
if(newCode){const srcId=await WSP.fetchSrcId(reg.env.wsp,uiCtx,transient.srcUri,true)
const newUri=SRC.addLeafToUri(options.defaultUriParent,newCode)
await WSP.srcMove(reg.env.wsp,uiCtx,srcId,newUri)
return WSP.fetchShortDesc(reg.env.wsp,uiCtx,newUri)}}else if(await POPUP.confirm("Créer une réplique de cet item étranger dans cet atelier ?",uiCtx)){const srcId=await WSP.fetchSrcId(reg.env.wsp,uiCtx,transient.srcUri,true)
return WSP.fetchShortDesc(reg.env.wsp,uiCtx,srcId)}return null}async doCopy(wspFrom,srcFrom,options,reg,uiCtx){const parentUri=options.defaultUriParent||SRC.URI_ROOT
const uri=options.defaultUriParent||"[Racine de l\'atelier]"
const ct=(new SrcNewCode).initialize({reg:reg,parentFolder:parentUri,defaultCode:SRC.extractLeafFromUri(srcFrom.srcUri),targetSrcUriType:ITEM.getSrcUriType(srcFrom.srcUri),inputLabel:`Code dans : ${uri}`,doBtnLabel:"Dupliquer"})
const newCode=await POPUP.showDialog(ct,uiCtx,{titleBar:{barLabel:{label:"Dupliquer ce contenu étranger..."}}}).onNextClose()
if(newCode){const targetWsp=reg.env.wsp
if(!targetWsp.isAvailable)await targetWsp.waitForAvailable(uiCtx)
const targetUri=SRC.addLeafToUri(parentUri,newCode)
await reg.env.universe.config.wsps.exportUrl.fetchVoid(IO.qs("cdaction","Copy","param",wspFrom.code,"refUris",srcFrom.srcUri,"wspTarget",targetWsp.code,"srcRefTarget",targetUri),{method:"POST"})
return WSP.fetchShortDesc(targetWsp,uiCtx,targetUri)}return null}}
//# sourceMappingURL=importInterWspSvc.js.map