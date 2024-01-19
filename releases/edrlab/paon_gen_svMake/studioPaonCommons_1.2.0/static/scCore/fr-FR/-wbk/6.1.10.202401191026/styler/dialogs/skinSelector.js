import{BaseElement,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{GridSmall}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{CellBuilderIconLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{STYLER}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/styler/styler.js"
import{GridDataHolderJsonTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{SKINPACK}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/pack.js"
export class SkinSelectorForSkinClassStl extends BaseElement{constructor(){super(...arguments)
this.skinDH=new GridDataHolderJsonTree("ch")}_initialize(init){this.reg=this.findReg(init)
this.wsp=this.reg.env.wsp
this.conf=init
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
REG.reg.installSkin("standard-dialog",sr)
this._initAndInstallSkin(this.localName,init)
this.skinGrid=sr.appendChild((new GridSmall).initialize(Object.assign({selType:"mono",autoSelOnFocus:"first",columnDefs:[new GridColDef("value").setFlex("1rem",1,1).setCellBuilder(new CellBuilderIconLabel("name").setIconKey("iconUrl").setDescriptionFunc(row=>row.getData("name")))],dataHolder:this.skinDH.setOpenAll(true),hideHeaders:true,lineDrawer:this,skinOver:"styler-skins-selector/grid",emptyBody:()=>JSX.createElement("c-msg",{label:"Aucun skin compatible installé",level:"info"})},BASIS.newInit(init.skinGrid,this.reg))))
this.skinGrid.addEventListener("grid-select",this._onGridSelect)
this.refreshDatasTree()
const footer=sr.appendChild(JSX.createElement("div",{id:"footer"}))
this.msgArea=footer.appendChild(JSX.createElement("div",{id:"msg"}))
this.selectBtn=footer.appendChild(JSX.createElement(Button,{id:"select",label:init.buttonLabel||"Sélectionner",class:"default","ui-context":"dialog",onclick:this.onSelectBtn}))
footer.appendChild(JSX.createElement(Button,{id:"cancel",label:"Annuler","ui-context":"dialog",onclick:this.onCancelBtn}))
if(init.startSkinSel)this.selectBySkin(init.startSkinSel)
this._refresh()}_refresh(){const selection=this.getSelectedSkin()
this.selectBtn.disabled=!selection}async refreshDatasTree(){const datas=new Map
const currentSkinClassStl=STYLER.getSkinClassStl(this.wsp,this.conf.skinClassStl)
const currentSkinClass=currentSkinClassStl===null||currentSkinClassStl===void 0?void 0:currentSkinClassStl.skinClass(this.wsp)
if(currentSkinClassStl){const skinsFromSkinsPacks=new Set
const skinsFromSkinsPacksEntries=[]
const list=await STYLER.listSkinsFromSkinsPacks(this.reg.env.universe.packServer,currentSkinClassStl.class,this.reg.env.uiRoot.lang)
list.forEach(elt=>{if(!skinsFromSkinsPacks.has(elt)){skinsFromSkinsPacks.add(elt)
skinsFromSkinsPacksEntries.push({code:elt.code,name:elt.title,iconUrl:SKINPACK.getIconUrl(this.reg.env.universe.packServer,elt.code),resUrl:STYLER.getSkinUrl(this.reg.env.universe.packServer,elt.code,currentSkinClassStl.class,this.reg.env.uiRoot.lang)})}})
if(skinsFromSkinsPacksEntries.length)datas.set("_skinSet",{isOwner:true,name:"Habillages graphiques installés",ch:skinsFromSkinsPacksEntries})}function skinMatchFilter(skin){if(currentSkinClass&&!currentSkinClass.equals(skin.skinClass(this.wsp)))return false
if(this.conf.skinMatchFilter)return this.conf.skinMatchFilter(skin)
return true}for(const skin of await STYLER.getRegisteredSkins(this.wsp,[currentSkinClassStl.class])){if(skinMatchFilter.call(this,skin)){if(!datas.has(skin.owner.key))datas.set(skin.owner.key,{isOwner:true,name:skin.owner.name,version:skin.owner.version,ch:[]})
const ownerEntry=datas.get(skin.owner.key)
ownerEntry.ch.push({code:skin.code,name:skin.name,iconUrl:skin.getIconUrl(this.reg.env.wsp.wspServer),resUrl:skin.getSrcUrl(this.reg.env.wsp.wspServer)})}}this.skinDH.setDatas(Array.from(datas.values()))}_onGridSelect(){const me=DOMSH.findHost(this)
me._refresh()
if(me.conf.onSelChange)me.conf.onSelChange(me.getSelectedSkin())}getSelectedSkin(){if(this.skinDH){const row=this.skinDH.getRow(this.skinGrid.getSelectedRow())
if(!row)return null
return row.rowDatas.isOwner?null:row.rowDatas}}selectBySkin(skinCode){if(skinCode!=null){const selectedRows=[]
for(let i=0,c=this.skinDH.countRows();i<c;i++){const skinRow=this.skinDH.getRow(i).rowDatas
if(skinRow&&skinRow.code===skinCode){selectedRows.push(i)
break}}if(selectedRows.length>0)this.skinGrid.setSelectedRows(selectedRows)
else this.skinGrid.clearSel()}}setMsg(msg,allowSelect){this.msgArea.textContent=msg
this.selectBtn.disabled=!allowSelect}onCancelBtn(){POPUP.findPopupableParent(this).close()}onSelectBtn(){const me=DOMSH.findHost(this)
const r=me.getSelectedSkin()
if(r)POPUP.findPopupableParent(this).close(r)}visitViews(visitor,options){return visitor(this.skinGrid)}visitViewsAsync(visitor,options){return visitor(this.skinGrid)}redrawLine(row,line){const isOwnerRow=row.rowDatas.isOwner
const ownerVersion=row.rowDatas.version
if(isOwnerRow&&ownerVersion)line.title=ownerVersion
else delete line.title
DOM.setAttrBool(line,"data-is-owner",isOwnerRow)}}REG.reg.registerSkin("styler-skins-selector",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\theight: 50vh;\n\t\tmax-height: 30em;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\twidth: 20em;\n\t}\n\n\t#msg {\n\t\tflex: 1;\n\t\tmargin: 0 .5em;\n\t}\n`)
REG.reg.registerSkin("styler-skins-selector/grid",1,`\n\t*[data-is-owner] {\n\t\tfont-weight: bold;\n\t}\n`)
customElements.define("styler-skins-selector",SkinSelectorForSkinClassStl)

//# sourceMappingURL=skinSelector.js.map