import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{BoxContainer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{EWedletEditMode,isEditableWedlet}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{JSX,ShadowJsx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlets_Perms.js"
export class BoxId extends BoxContainer{refreshBindValue(val,children){super.refreshBindValue(val,children)
this.fragmentId=val?val.toString():null
this.onFragmentIdChanged()}replaceChars(chars,msg){super.replaceChars(chars,msg)
this.fragmentId=chars
this.onFragmentIdChanged()}onFragmentIdChanged(){}}REG.reg.addToList("actions:wed:box-id","changeId",1,new Action("changeId").setLabel("Changer d\'identifiant").setGroup("edit").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/box/changeId.svg").setVisible(ctx=>!ctx.wedlet.isVirtual()&&isEditableWedlet(ctx.wedlet)&&ctx.wedlet.editMode===EWedletEditMode.write).setEnabled(ctx=>ctx.wedlet.wedMgr.reg.hasPerm("action.wed#change.box-id")).setExecute(async ctx=>{if(await POPUP.confirm("Attention : Changer d\'identifiant aura pour effet de casser les liens établis vers ce fragment.",ctx.focusedElt,{okLbl:"Changer d\'identifiant",kind:"warning"})){const docHolder=ctx.wedlet.wedMgr.docHolder
const xa=ctx.wedlet.wedAnchor
const mgrId=docHolder.getAspect(xa,null,"XmlIdMgr")
if(mgrId)docHolder.newBatch({start:xa}).setAttr(xa,mgrId.generateId(new Set)).doBatch()}}))
REG.reg.addToList("actions:wed:box-id","editId",1,new Action("editId").setLabel("Éditer l\'identifiant").setGroup("edit").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/box/editId.svg").setVisible(ctx=>!ctx.wedlet.isVirtual()&&isEditableWedlet(ctx.wedlet)&&ctx.wedlet.editMode===EWedletEditMode.write).setEnabled(ctx=>ctx.wedlet.wedMgr.reg.hasPerm("action.wed#edit.box-id")).setExecute(async ctx=>{const docHolder=ctx.wedlet.wedMgr.docHolder
const boxId=ctx.focusedElt
const newId=await POPUP.showDialog(JSX.createElement("div",null,JSX.createElement(ShadowJsx,{skin:"standard-dialog",skinOver:"webzone:panel"},JSX.createElement("style",null,`\n\t\t  :host {\n\t\t\t  min-width: 20em;\n\t\t\t  width: 20em;\n\t\t  }\n\n\t\t  #body {\n\t\t\t  display: flex;\n\t\t\t  flex-direction: column;\n\t\t\t  min-height: 0;\n\t\t\t  min-width: 0;\n\t\t\t  padding: .5em;\n\t\t  }\n\n\t\t  #msg {\n\t\t\t  padding: .5em 0;\n\t\t  }\n\n\t\t  label {\n\t\t\t  display: flex;\n\t\t\t  flex-direction: column;\n\t\t\t  min-height: 0;\n\t\t\t  min-width: 0;\n\t\t  }\n\n\t\t\t`),JSX.createElement("div",{id:"body"},JSX.createElement(MsgLabel,{id:"msg","î":{label:"Attention, changer d\'identifiant aura pour effet de casser les liens établis vers ce fragment.",level:"warning",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/popupable/warning.svg"}}),JSX.createElement("label",null,JSX.createElement("div",null,"Nouvel identifiant"),JSX.createElement("input",{id:"input",value:boxId.fragmentId}))),JSX.createElement("div",{id:"footer"},JSX.createElement(Button,{"î":{label:"Changer",uiContext:"dialog"},onclick:function(){POPUP.findPopupableParent(this).close(DOMSH.findDocumentOrShadowRoot(this).getElementById("input").value)}}),JSX.createElement(Button,{"î":{label:"Annuler",uiContext:"dialog"},onclick:function(){POPUP.findPopupableParent(this).close(null)}})))),ctx.focusedElt,{titleBar:"Éditer cet identifiant"}).onNextClose()
const xa=ctx.wedlet.wedAnchor
if(newId&&newId!==boxId.fragmentId)docHolder.newBatch({start:xa}).setAttr(xa,newId).doBatch()}))
REG.reg.addToList("actions:wed:box-id","scComment",2,null)
REG.reg.addToList("actions:wed:box-id","delete",2,null)

//# sourceMappingURL=boxId.js.map