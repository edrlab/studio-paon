import{BaseElement,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{WspsGrid}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/wsp/wspsGrid.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{STYLER}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/styler/styler.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{ESrcSt,SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{FastFindItem}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/fastFindItem.js"
import{SearchAnd,SearchItemModel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
import{ItemCreator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/itemCreator.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{SrcDrawerInline}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcDrawer.js"
import{Generators}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/generators.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{ItemDynGen}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/item/itemDynGen.js"
import{Tabs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tabs.js"
import{AreaAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{EWspChangesEvts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{WSPPACK}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/pack.js"
export class ItemSkinClassStlTest extends BaseElement{get skinClassStl(){return STYLER.getSkinClassStl(this.reg.env.wsp,this.params.skinClassStlCode)}get privateUri(){return"/~styler/"+SRC.srcRef(this.reg.env.longDesc)+"/@testSkin.json"}_initialize(init){this.reg=this.findReg(init)
this.params=init
if(!this.params.skinClassStlCode)this.params.skinClassStlCode=this.reg.env.longDesc.itAttr_skClassStl
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.testWspBtn=JSX.createElement("c-button",{id:"selectWsp","ui-context":"dialog",role:"menu",onclick:this.findTestWsp})
this.testWspBtn.addEventListener("keydown",async ev=>{if((ev.key==="Delete"||ev.key==="Backspace")&&this===DOMSH.findDocumentOrShadowRoot(this).activeElement){await this.setTestWsp(null)
ev.stopPropagation()
return true}return false})
this.testItemBtn=JSX.createElement("c-button",{id:"selectItem","ui-context":"dialog",role:"menu",onclick:this.findTestItem})
this.testItemBtn.addEventListener("keydown",async ev=>{if((ev.key==="Delete"||ev.key==="Backspace")&&this===DOMSH.findDocumentOrShadowRoot(this).activeElement){await this.setTestItem(null)
ev.stopPropagation()
return true}return false})
const headerElt=sr.appendChild(JSX.createElement("div",{id:"headBar"},JSX.createElement("span",{class:"headTi"},"Contexte de test :"),JSX.createElement("span",{id:"ctxWsp"},JSX.createElement("label",{class:"headSubTi"},"Atelier"),this.testWspBtn),JSX.createElement("span",{id:"levelSeparator"}),JSX.createElement("span",{id:"ctxItem"},JSX.createElement("label",{class:"headSubTi"},"Item"),this.testItemBtn)))
this.msgElt=sr.appendChild((new MsgLabel).setStandardMsg("loading"))
this.contentElt=sr.appendChild(JSX.createElement("div",{id:"contentBox",hidden:true}))
this.setTestWsp(null)
this._onWspUriChange=this.onWspUriChange.bind(this)
this.reg.env.place.eventsMgr.on("wspUriChange",this._onWspUriChange)}async setTestWsp(wspCode,wspTitle){var _a,_b
const wspTypesDefList=await WSPPACK.listWspTypesDef(this.reg.env.universe.packServer,[(_a=this.skinClassStl.skinClass(this.reg.env.wsp))===null||_a===void 0?void 0:_a.class],true)
const wspTypesKeys=wspTypesDefList.map(e=>e.key)
const wspTypesListTitle=wspTypesDefList.map(e=>e.title).join(", ")
let title=wspTitle||wspCode
if(wspCode){if(this.testWsp&&this.testWsp.code===wspCode)return
if(this.testWsp)this.setTestItem(null)
this.testWspBtn.label="..."
const place=this.reg.env.universe.wspServer.wspsLive.newPlace()
this.testWsp=place.getWsp(wspCode).listenChanges()
this.testWspReg=REG.createSubRegMixed(this.reg,this.testWsp.reg)
this.testWspReg.env.uiRoot=this
this.testWspReg.env.place=place
this.initTestWspCtx(this.testWspReg)
this.setMsg(`Chargement de l\'atelier \'${title}\'...`,"info",true)
await this.testWsp.waitForAvailable()
if(this.testWsp.wspTitle)title=this.testWsp.wspTitle
this.testWspBtn.label=title
if(this.testWsp.isAvailable){let isWspAllowed=wspTypesKeys.includes(this.testWsp.infoWsp.wspType.key)||((_b=this.testWsp.infoWsp.wspOptions)===null||_b===void 0?void 0:_b.find(entry=>wspTypesKeys.includes(entry.key)))
if(isWspAllowed){this.testWspBtn.disabled=false
DOM.setAttrBool(this.testWspBtn,"data-isEmpty",false)
DOM.setAttrBool(this.testWspBtn,"data-isError",false)
this.testItemBtn.disabled=false
await this.setTestItem(this.testItem?SRC.srcRef(this.testItem):null)}else{DOM.setAttrBool(this.testWspBtn,"data-isEmpty",false)
DOM.setAttrBool(this.testWspBtn,"data-isError",true)
this.testItemBtn.disabled=true
this.setMsg(`L\'atelier \'${title}\' sélectionné n\'est pas compatible avec ce skin.\nVeuillez sélectionner un atelier de test compatible avec l\'un des modèles suivants : ${wspTypesListTitle}.`,"warning",true)}}else{DOM.setAttrBool(this.testWspBtn,"data-isEmpty",false)
DOM.setAttrBool(this.testWspBtn,"data-isError",true)
this.testItemBtn.disabled=true
await this.setTestItem(null,null,true)
this.setMsg(`L\'atelier \'${title}\' n\'est pas dans un statut valide. Veuillez en corriger les propriétés.`,"warning",true)}}else{DOM.setAttrBool(this.testWspBtn,"data-isEmpty",true)
DOM.setAttrBool(this.testWspBtn,"data-isError",false)
this.testItemBtn.disabled=true
await this.setTestItem(null,null,true)
this.testWsp=null
this.contentElt.innerText=""
this.testWspBtn.label="Sélectionner un atelier..."
this.testItem=null
const skin=this.skinClassStl.skinClass(this.reg.env.wsp).name
this.setMsg(wspTypesListTitle?`Veuillez sélectionner un atelier de test compatible avec l\'un des modèles suivants : ${wspTypesListTitle}.`:`Veuillez installer un modèle documentaire exploitant le skin \'${skin}\'.`,"info",true)}}async setTestItem(srcRef,srcFields,silent){var _a
const gensCodeList_item=new Map
const gensCodeList_dyn=new Map
if(silent===undefined&&this.testItemBtn.disabled)silent=true
let wspTypesDefList
function filterCtxGens(itemGens,dynGens,wsp,src){var _a,_b
if(wspTypesDefList){for(const entry of wspTypesDefList){if(!(wsp.infoWsp.wspType.key===entry.key||((_a=wsp.infoWsp.wspOptions)===null||_a===void 0?void 0:_a.findIndex(wspOption=>wspOption.key===entry.key))>-1))continue
const skinClassGenerators=(_b=entry.generators)===null||_b===void 0?void 0:_b.filter(gen=>gen.skinClass===this.skinClassStl.class)
if(skinClassGenerators){skinClassGenerators.forEach(gen=>{var _a
if(!src||((_a=gen.rootModels)===null||_a===void 0?void 0:_a.indexOf(src.itModel))>-1){if(gen.sgn.match(/.*#dyn\b.*/))dynGens.set(gen.code,gen.name)
else itemGens.set(gen.code,gen.name)}})}}}}if(this.testWsp){wspTypesDefList=await WSPPACK.listWspTypesDef(this.reg.env.universe.packServer,[(_a=this.skinClassStl.skinClass(this.reg.env.wsp))===null||_a===void 0?void 0:_a.class],true)
filterCtxGens.call(this,gensCodeList_item,gensCodeList_dyn,this.testWsp)}let gensTitles=[...new Set(Array.of(...gensCodeList_item.values(),...gensCodeList_dyn.values()))].sort().join(", ")
if(this.testWsp&&srcRef){this.testItemBtn.innerText=""
DOM.setAttrBool(this.testItemBtn,"data-isEmpty",false)
DOM.setAttrBool(this.testItemBtn,"data-isError",false)
const srcDrawer=this.testItemBtn.appendChild(JSX.createElement(SrcDrawerInline,{"î":{reg:this.testWspReg,srcRef:srcRef}}))
const testItemSd=await this.testWsp.fetchShortDesc(srcRef)
gensCodeList_item.clear()
gensCodeList_dyn.clear()
filterCtxGens.call(this,gensCodeList_item,gensCodeList_dyn,this.testWsp,testItemSd)
gensTitles=[...new Set(Array.of(...gensCodeList_item.values(),...gensCodeList_dyn.values()))].sort().join(", ")
if(testItemSd.srcSt===ESrcSt.file){this.testItem=testItemSd
this.contentElt.innerText=""
if(!silent)this.setMsg("Chargement en cours...","info",true)
const tabs=this.contentElt.appendChild(JSX.createElement(Tabs,{id:"tabs","î":{vertical:true,skinOver:"styler-testSkin/tabs",tabSkinOver:"styler-testSkin/tab"}}))
if(this.view)VIEWS.onViewHidden(this.view,true)
this.view=tabs
if(gensCodeList_dyn.size>0){const dynGenGenerators=[]
gensCodeList_dyn.forEach((value,key)=>{dynGenGenerators.push({code:key,label:value,genProps:{skin:ITEM.GEN_SKIN_BY_URI_PREFIX+WSP.buildWspUri(this.reg.env.wsp.code,this.reg.env.longDesc.srcUri)+";transform=facet&facet=resolveSkin"}})})
await tabs.addTab((new AreaAsync).setLabel(dynGenGenerators.length>1?"Aperçus":"Aperçu").setDescription("Skin exploité par des publications dynamiques").setBodyBuilder(ctx=>JSX.createElement(ItemDynGen,{"î":{reg:this.testWspReg,srcRef:ITEM.srcRefSub(testItemSd),generators:dynGenGenerators,toolbar:{skinSelector:false,refresh:true},onViewBehaviour:"refresh"}})),{select:true})}if(gensCodeList_item.size>0){await tabs.addTab((new AreaAsync).setLabel("Publications").setDescription("Skin exploité par des publications").setBodyBuilder(ctx=>{const gensBox=JSX.createElement(Generators,{"î":{reg:this.testWspReg,pubNodeMatchFilter:entry=>{if(entry.genNodeType==="dir")return true
const idx=entry.codeGenStack.lastIndexOf("_")
const cdGen=idx<0?entry.codeGenStack:entry.codeGenStack.substring(idx+1)
return gensCodeList_item.has(cdGen)},customDestPath:WSP.buildWspUri(this.reg.env.wsp.code,this.reg.env.longDesc.srcUri+"/"+WSP.buildWspUri(this.testWsp.code,this.testItem.srcUri))}})
gensBox.setSrc(testItemSd)
return gensBox}),{select:gensCodeList_dyn.size===0})}if(tabs.hasTabs()){if(!silent)this.setMsg(null,null,false)}else if(!silent)this.setMsg(gensTitles?`Veuillez sélectionner un item porteur d\'un générateur à tester : ${gensTitles}.`:"Veuillez sélectionner un item porteur d\'un générateur à tester.","warning",true)}else{DOM.setAttrBool(this.testItemBtn,"data-isEmpty",false)
DOM.setAttrBool(this.testItemBtn,"data-isError",true)
if(!silent)this.setMsg(`L\'item sélectionné est invalide.`,"warning",true)}}else{DOM.setAttrBool(this.testItemBtn,"data-isEmpty",true)
DOM.setAttrBool(this.testItemBtn,"data-isError",false)
this.testItemBtn.innerText="Sélectionner un item..."
this.testItem=null
if(!silent)this.setMsg(gensTitles?`Veuillez sélectionner un item porteur d\'un générateur à tester : ${gensTitles}.`:"Veuillez sélectionner un item porteur d\'un générateur à tester.","info",true)}}async findTestItem(ev){var _a
try{if(this.disabled)return
const me=DOMSH.findHost(this)
const wspTypesDefList=await WSPPACK.listWspTypesDef(me.reg.env.universe.packServer,[(_a=me.skinClassStl.skinClass(me.reg.env.wsp))===null||_a===void 0?void 0:_a.class],true)
const rootModelsKeys=new Set
if(me.testWsp){wspTypesDefList.forEach(entry=>{var _a,_b
const skinClassGenerators=(_a=entry.generators)===null||_a===void 0?void 0:_a.filter(gen=>gen.skinClass===me.skinClassStl.class)
if(skinClassGenerators&&(me.testWsp.infoWsp.wspType.key===entry.key||((_b=me.testWsp.infoWsp.wspOptions)===null||_b===void 0?void 0:_b.findIndex(wspOption=>wspOption.key===entry.key))>-1)){skinClassGenerators===null||skinClassGenerators===void 0?void 0:skinClassGenerators.forEach(gen=>{var _a;(_a=gen.rootModels)===null||_a===void 0?void 0:_a.forEach(md=>rootModelsKeys.add(md))})}})}const ct=(new FastFindItem).initialize({reg:me.testWsp.reg,restrictions:new SearchAnd(new SearchItemModel(Array.from(rootModelsKeys))),emptyBody:()=>JSX.createElement("span",null,"Aucun item disponible pour ce skin"),itemCreator:ItemCreator.setDefaultConfigFromReg(me.reg,{itemTypesTree:{itemTypeReducer:(acc,cur)=>{if(rootModelsKeys.has(cur.getModel()))acc.push(cur)
return acc}}})})
const wspTitle=me.testWsp.wspTitle
const selectedItem=await POPUP.showMenu(ct,{initHeight:"15em",viewPortY:"middle"},this,{titleBar:{barLabel:{label:`Sélection de l\'item de test dans l\'atelier ${wspTitle}`}}}).onNextClose()
if(selectedItem)return me.setTestItem(SRC.srcRef(selectedItem),selectedItem)}catch(e){POPUP.showNotifError("Échec à la recherche de l\'item",this)
ERROR.log(e)}}async findTestWsp(ev){var _a
try{if(this.disabled)return
const me=DOMSH.findHost(this)
const wspTypesDefList=await WSPPACK.listWspTypesDef(me.reg.env.universe.packServer,[(_a=me.skinClassStl.skinClass(me.reg.env.wsp))===null||_a===void 0?void 0:_a.class],true)
const wspTypeWhiteList=[]
wspTypesDefList.forEach(entry=>wspTypeWhiteList.push(entry.key))
const skin=me.skinClassStl.skinClass(me.reg.env.wsp).name
const selectedWsp=await POPUP.showMenuFromEvent((new WspsGrid).initialize({reg:me.reg,wspMatchFilter:ctx=>{if(ctx.wspType&&wspTypeWhiteList.includes(ctx.wspType.key))return true
if(ctx.wspOptions)for(const wspOption of ctx.wspOptions)if(wspTypeWhiteList.includes(wspOption.key))return true},gridInit:{autoSelOnFocus:"first",emptyBody:()=>JSX.createElement("c-msg",{label:`Aucun atelier exploitant le skin \'${skin}\'`,level:"info"})},defaultAction:(new Action).setExecute(ctx=>POPUP.findPopupableParent(ctx).close(ctx.getSelectedWsp())),defaultActionOnClick:true}),ev||me,me,{},{initMaxHeight:"50vh",initWidth:"10em"}).onNextClose()
if(selectedWsp)await me.setTestWsp(selectedWsp.wspCd,selectedWsp.title)}catch(e){POPUP.showNotifError("Échec à la recherche de l\'atelier",this)
await ERROR.log(e)}}setMsg(msg,level,isFatal=false){this.msgElt.setCustomMsg(msg,level)
if(this.contentElt)DOM.setHidden(this.contentElt,isFatal)}async saveItemDatas(){const fields=await this.reg.env.wsp.wspServer.config.privateFolderUrl.fetchJson(IO.qs("cdaction","PutSrc","format","JSON","fields","srcDt","param",this.reg.env.wsp.code,"refUri","","privateUri",this.privateUri),{method:"POST",body:JSON.stringify({testWspCode:this.testWsp?this.testWsp.code:null,testSrcRef:this.testItem?SRC.srcRef(this.testItem):null}),headers:{"Content-Type":"application/json"}})}async loadItemDatas(){if(!this._currentLoadRequest){this._currentLoadRequest=this.reg.env.wsp.wspServer.config.privateFolderUrl.fetch(IO.qs("cdaction","GetSrc","format","stream","fields","srcDt","param",this.reg.env.wsp.code,"refUri","","privateUri",this.privateUri),"json")
const resp=await this._currentLoadRequest
if(resp.status===200){const lastSaveDatas=resp.asJson
await this.setTestWsp(lastSaveDatas.testWspCode)
if(lastSaveDatas.testWspCode)await this.setTestItem(lastSaveDatas.testSrcRef)}}}initTestWspCtx(wspReg){wspReg.registerSvc("gen.action.generate",1,async(wsp,uiContext,srcRef,codeGenStack,props,customFullUriDest)=>{await this.reg.env.wsp.wspServer.wspsLive.saveAllHouses()
let transform="transform=facet&facet=resolveSkin"
props.skin=ITEM.GEN_SKIN_BY_URI_PREFIX+WSP.buildWspUri(this.reg.env.wsp.code,this.reg.env.longDesc.srcUri)+";"+transform
return ITEM.generate(wsp,uiContext,srcRef,codeGenStack,props,customFullUriDest)})
wspReg.registerSvc("gen.action.genInfo",1,async(wsp,uiContext,srcRef,codeGenStack,addExtraInfos,customFullUriDest)=>{let genInfo=await ITEM.fetchGenInfo(wsp,uiContext,srcRef,codeGenStack,addExtraInfos,customFullUriDest)
genInfo.skins=null
return genInfo})}onWspUriChange(msg,from){if(this.reg.env.longDesc){const msgSrcRef=SRC.srcRef(msg)
if(msg.type===EWspChangesEvts.r){if(SRC.srcRef(this.reg.env.longDesc)===msgSrcRef||ITEM.getSrcUriType(msg.srcUri)==="space"&&SRC.isSubUri(msg.srcUri,this.reg.env.longDesc.srcUri)){this.onViewHidden(true)}}}}visitViews(visitor,options){if(this.view)return visitor(this.view)}visitViewsAsync(visitor,options){return this.view?visitor(this.view):Promise.resolve(undefined)}onViewHidden(closed){this.saveItemDatas()
if(closed){this.reg.env.place.eventsMgr.removeListener("wspUriChange",this._onWspUriChange)}VIEWS.onViewHidden(this.view,closed)}onViewShown(){if(!this.view)this.loadItemDatas()
else VIEWS.onViewShown(this.view)}}customElements.define("styler-item-testskin",ItemSkinClassStlTest)
REG.reg.registerSkin("styler-item-testskin",1,`\n\t:host {\n\t\tflex: 1;\n\t\toverflow: auto;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t}\n\n\t:host > c-msg {\n\t\tmax-width: 30rem;\n\t\talign-self: center;\n\t\ttext-align: center;\n\t}\n\n  #headBar {\n\t  display: flex;\n\t  align-items: center;\n\t  /*min-height: 1.5em;*/\n\t  min-width: 0;\n\t  border-bottom: 1px solid var(--border-color);\n\t  padding: .2em;\n\t  background-color: var(--bgcolor);\n\t  color: var(--color);\n\t  flex-wrap: wrap;\n\t  /*\n\t\tbackground-repeat: no-repeat;\n\t\tbackground-size: 1em;\n\t\tbackground-position: left .2em center;\n\t\tpadding-inline-start: 1.5em;\n\t\tbackground-image: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/styler/views/testSkin.svg");\n\t\t*/\n  }\n\n  .headTi {\n\t  padding: 0 .3em;\n\t  white-space: nowrap;\n\t  color: var(--fade-color);\n\t  margin: .8rem 1rem 0 0;\n  }\n\n  .headSubTi {\n\t  font-size: .7rem;\n\t  color: var(--fade-color);\n  }\n\n  #ctxWsp, #ctxItem {\n\t  flex: 1;\n\t  min-width: 10em;\n  }\n\n  #levelSeparator::after {\n\t  content: ">";\n\t  color: var(--fade-color);\n\t  font-size: 1.5rem;\n\t  display: flex;\n\t  padding-inline: .5em;\n\t  padding-block-start: .8rem;\n  }\n\n  #ctxWsp > c-button, #ctxItem > c-button {\n\t  margin: 0;\n  }\n\n  c-button > wsp-src-drawer-inline {\n\t  overflow: hidden;\n\t  text-overflow: ellipsis;\n  }\n\n  c-button[data-isEmpty] {\n\t  font-style: italic;\n  }\n\n  c-button[data-isError] {\n\t  border-color: var(--error-color);\n  }\n\n  #contentBox {\n\t  background-color: var(--bgcolor);\n\t  flex: 1;\n\t  display: flex;\n  }\n\n  #contentBox[hidden] {\n\t  visibility: collapse;\n  }\n\n\t#tabs {\n\t\tflex: 1;\n\t}\n\n`)
REG.reg.registerSkin("styler-testSkin/tabs",1,`\n\tc-tab.selected {\n\t\t-webkit-text-stroke: unset !important;\n\t}\n`)
REG.reg.registerSkin("styler-testSkin/tab",1,`\n\t.label {\n\t\tpadding: 1rem 0;\n\t\twriting-mode: vertical-lr;\n\t\t/* text-orientation: sideways-right; */\n\t\ttransform: rotate(\n\t\t\t\t180deg\n\t\t);\n\t\t/*webkit-text-strok : unset;*/\n\t}\n\n`)

//# sourceMappingURL=testSkin.js.map