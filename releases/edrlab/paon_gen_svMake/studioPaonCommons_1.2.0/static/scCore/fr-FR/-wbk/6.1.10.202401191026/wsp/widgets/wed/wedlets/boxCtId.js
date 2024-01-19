import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{AgEltBoxSelection}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxSel.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{EWedletEditMode,isEditableWedlet}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{BoxId}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxId.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
export class BoxCtId extends BoxId{onFragmentIdChanged(){this.setAttribute("title","Identifiant : "+this.fragmentId)}}AgEltBoxSelection(BoxCtId,{selMode:"box",actionsLists:["actions:wed:box-ctid","actions:wed:box-id"],groupOrder:"* edit"})
REG.reg.registerSkin("wsp-box-ctid",1,`\n\t:host {\n\t\ttab-index: 0;\n\t\tz-index: 2;\n\t\tcursor: default;\n\t\tuser-select: none;\n\t  color: var(--fade-color);\n\t  font-style: italic;\n\t\tborder: 1px solid var(--border-color);\n\t\tborder-radius: 0.75rem;\n\t\theight: 1.5em;\n\t\twidth: 1.5em;\n\t  align-self: end;\n\t\ttext-align: center;\n\t\tmargin: 0.5em 0.5em -2em;\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--focus-outline);\n\t}\n`)
window.customElements.define("wsp-box-ctid",BoxCtId)
REG.reg.addToList("actions:wed:box-ctid","changeId",1,new Action("changeId").setLabel("Changer d\'identifiant").setGroup("edit").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/box/changeId.svg").setVisible(ctx=>!ctx.wedlet.isVirtual()&&isEditableWedlet(ctx.wedlet)&&ctx.wedlet.editMode===EWedletEditMode.write).setEnabled(ctx=>ctx.wedlet.wedMgr.reg.hasPerm("action.wed#change.box-ctid")).setExecute(async ctx=>{if(await POPUP.confirm("Attention : Changer d\'identifiant aura pour effet de casser les liens établis vers ce fragment.",ctx.focusedElt,{okLbl:"Changer d\'identifiant",kind:"warning"})){const wedMgr=ctx.wedlet.wedMgr
const reg=wedMgr.reg
const wsp=reg.env.wsp
const id=await wsp.wspServer.config.wspSvcUrl.resolve(wsp.code+"/ctId").fetchText(IO.qs("param",ITEM.extractItemCode(reg.env.longDesc.srcUri)),{method:"POST"})
ctx.wedlet.wedMgr.docHolder.newBatch().setAttr(ctx.wedlet.wedAnchor,id).doBatch()}}))

//# sourceMappingURL=boxCtId.js.map