import{AgEltBoxSelection}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxSel.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{AccelKeyMgr,Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{AgEltBoxFloating}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxTooltip.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{renderAppend,xhtml}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/htmlLit.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{AppHeader}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/appHeader.js"
import{SrcGrid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcGrid.js"
import{FocusItemSelRef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{BoxId}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxId.js"
export class BoxSubItemId extends BoxId{constructor(){super(...arguments)
this.refsList=BoxSubItemId.DEFAULT_REFS_LIST}configWedletElt(tpl,wedlet){super.configWedletElt(tpl,wedlet)
this.reg=wedlet.wedMgr.reg
if(tpl.hasAttribute("refsList"))this.refsList=tpl.getAttribute("refsList")}onClipboard(ev){ev===null||ev===void 0?void 0:ev.preventDefault()
ev===null||ev===void 0?void 0:ev.stopImmediatePropagation()
if(!this.fragmentId){POPUP.showNotifWarning("Impossible de copier une ancre vide",this)}else{const wedMgr=this.wedlet.wedMgr
const sd=Object.create(wedMgr.reg.env.longDesc)
sd.itSubItem={id:this.fragmentId,mo:this.getAttribute("model")}
ITEM.setShortDescTransferToClipboard({emitter:this,reg:wedMgr.reg,shortDescs:[sd]})}return true}static _templateFloating(box){var _a
const id=box.fragmentId
const wedMgr=box.wedlet.wedMgr
const reg=wedMgr.reg
const sd=Object.create(wedMgr.reg.env.longDesc)
sd.itSubItem={id:box.fragmentId}
const confs=(_a=reg.getList(box.refsList))===null||_a===void 0?void 0:_a.filter(entry=>!entry.isVisible||entry.isVisible.call(box,box,id))
const appHeader=JSX.createElement(AppHeader,{"î":{moreActions:reg.mergeLists("actions:wed:box-subitemid","actions:wed:box-id"),moreBar:{groupOrder:"* edit"},actionContext:{wedlet:box.wedlet,focusedElt:box}}},JSX.createElement("div",{class:"currentId"},`Identifiant de l\'ancre \'${id}\'`))
const confTitle=JSX.createElement("header",null)
if(confs.length===1){box.currentDetailsConf=confs[0]
confTitle.appendChild(JSX.createElement("div",null,box.currentDetailsConf.label))}else{const select=confTitle.appendChild(JSX.createElement("select",{onchange:async()=>{const pos=Number.parseInt(select.value)
box.currentDetailsConf=confs[pos]
const items=await box.currentDetailsConf.fetchSrcList.call(box,box,id)
grid.srcGridDatas.setDatas(items||[])
grid.focus()}}))
confs.forEach((entry,pos)=>{select.appendChild(JSX.createElement("option",{value:pos,label:entry.label,title:entry.description}))})}const grid=(new SrcGrid).initialize({reg:reg,hideHeaders:true,autoSelOnFocus:"first",itemHandlingReact:reg.env.infoBroker,defaultAction:FocusItemSelRef.SINGLETON,actions:reg.mergeLists("actions:boxId:shortDesc","actions:wsp:shortDesc"),accelKeyMgr:(new AccelKeyMgr).initFromMapActions(reg.mergeListsAsMap("accelkeys:boxId:shortDesc","accelkeys:wsp:shortDesc")),emptyBody:()=>{var _a
return JSX.createElement("span",null,((_a=box.currentDetailsConf)===null||_a===void 0?void 0:_a.emptyGridMsg)||"Aucun item")}})
box.currentDetailsConf=confs[0]
const items=box.currentDetailsConf.fetchSrcList.call(box,box,id).then(resp=>{grid.srcGridDatas.setDatas(resp||[])
grid.focus()})
return xhtml`<div id="main">
			${appHeader}
			${confTitle}
			${grid}
		</div>`}}BoxSubItemId.DEFAULT_REFS_LIST="box.subitemid.refs.confs"
AgEltBoxSelection(BoxSubItemId,{selMode:"box",actionsLists:["actions:wed:box-subitemid","actions:wed:box-id","actions:wed:box"],groupOrder:"* edit"})
AgEltBoxFloating(BoxSubItemId,{findFocusableOnShown:true,display:["over"],factory:(owner,tooltip)=>{const reg=REG.findReg(owner)
const tpb=reg.getSvc("box.subitemid.tpl.floating")||BoxSubItemId._templateFloating
if(tpb){const root=JSX.createElement("div",{id:"boxIdRoot"})
reg.installSkin(owner.localName+"/floating",root.attachShadow(DOMSH.SHADOWDOM_INIT))
reg.installSkin("box-subitemid/floating",root.shadowRoot)
tooltip.addEventListener("c-show",ev=>{renderAppend(tpb(owner),root.shadowRoot)})
return root}}})
window.customElements.define("box-subitemid",BoxSubItemId)
REG.reg.registerSkin("box-subitemid/floating",1,`\n\t:host {\n\t\tflex: 0 1 auto;\n\t\tmin-width: 2rem;\n\t\t--row-bgcolor: var(--bgcolor);\n\t  max-width: 40vw;\n  }\n\n  c-appheader {\n\t  min-height: 2rem;\n\t  z-index: 1;\n\t  margin: 0 4px;\n  }\n\n  header {\n\t  display: flex;\n\t  min-height: 0;\n\t  font-size: var(--label-size);\n\t  padding: .2em;\n\t  color: var(--fade-color);\n\t  border-bottom: 1px solid var(--border-color);\n\t  text-align: center;\n\t  justify-content: center;\n  }\n\n  .currentId {\n\t  align-self: center;\n\t  color: var(--alt1-color);\n  }\n\n  select {\n\t  flex: 1;\n\t  min-width: 0;\n\t  border: 1px solid var(--border-color);\n\t  background-color: var(--form-bgcolor);\n\t  color: var(--form-color);\n\t  text-overflow: ellipsis;\n\t  font-size: inherit;\n  }\n\n  wsp-src-grid {\n\t  border: none;\n  }\n\n`)
REG.reg.registerSvc("box-subitemid.confs.revlinks.sub",1,{label:"Références à cette ancre",fetchSrcList:async(ctx,id)=>{var _a
const ascs=await ITEM.fetchSrcNetJson(ctx.reg.env.wsp,this,ITEM.makeSrcRefSub(SRC.srcRef(ctx.reg.env.longDesc),id),ctx.reg.env.wsp.getShortDescDef(),"asc",true,null,null,100,1,null,null)
return(_a=ascs===null||ascs===void 0?void 0:ascs.lnks)===null||_a===void 0?void 0:_a.map(entry=>entry.src)}})
REG.reg.addSvcToList(BoxSubItemId.DEFAULT_REFS_LIST,"revlinks.sub",1,"box-subitemid.confs.revlinks.sub",-1)
REG.reg.addToList("actions:wed:box-subitemid","copySubItemId",1,new Action("copySubItemId").setLabel("Copier").setDescription("Copier le lien vers l\'ancre").setGroup("copy").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/copy.svg").setExecute(async(ctx,ev)=>{const boxId=ctx.focusedElt
boxId.onClipboard()}))

//# sourceMappingURL=ptrSubItem.js.map