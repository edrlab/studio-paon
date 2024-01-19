import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{CellBuilderIconLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{GridSmall}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{GridColTreeDef,GridDataHolderJsonTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tree.js"
import{SrcPointerDblClick,SrcPointerFastSelect,SrcPointerInline}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcDrawer.js"
import{FORMS,MxFormElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{SEC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/security.js"
import{render,xhtml}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/htmlLit.js"
import{BaseAreaView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{InfoCurrentItem,InfoReqCurrentItem,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{EventMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{CID,ECidSessionState}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/cid.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{DynGen}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/dynGen.js"
import{AREAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{UiThemeDeskFeat}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/plugins/optionsPlg.js"
export class GeneratorTabs extends BaseAreaView{_initialize(init){super._initialize(init)
this.wsp=this.reg.env.wsp
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.pubNodeMatchFilter=init.pubNodeMatchFilter
this.genTabs=sr.appendChild(JSX.createElement("c-arrow-scroll-box",{id:"tabs"}))
this.genTabs.onkeydown=function(ev){switch(ev.code){case"ArrowLeft":{const genView=DOMSH.findHost(this)
const tab=genView.currentTab.tab.previousElementSibling
if(tab)tab.genTab.tab.genTab.itemPtr.focus()
break}case"ArrowRight":{const genView=DOMSH.findHost(this)
const tab=genView.currentTab.tab.nextElementSibling
if(tab)tab.genTab.tab.genTab.itemPtr.focus()
break}default:return}ev.stopPropagation()
ev.preventDefault()}
this.genTabs.ondragover=function(ev){ev.preventDefault()
ev.stopImmediatePropagation()
const me=DOMSH.findHost(this)
const shortDescs=ITEM.getShortDescsTransferFromDragSession(me.reg,ev.dataTransfer,{targetSrcType:"item"},this)
ev.dataTransfer.dropEffect=!shortDescs||shortDescs.srcRefs.length<1||shortDescs.wspCd!==me.reg.env.wsp.code?"none":"link"}
this.genTabs.ondrop=function(ev){ev.preventDefault()
ev.stopImmediatePropagation()
const me=DOMSH.findHost(this)
const shortDescs=ITEM.getShortDescsTransferFromDragSession(me.reg,ev.dataTransfer,{targetSrcType:"item"},this)
if(!shortDescs||shortDescs.isImport||shortDescs.srcRefs.length<1||shortDescs.wspCd!==me.reg.env.wsp.code)return
me.setCurrentTab(new GeneratorTab(me,false,{srcRef:shortDescs.srcRefs[0]}))}
this.gens=sr.appendChild((new Generators).initialize(init))
this.gens.onCodePubChange.add((function(gens){const me=DOMSH.findHost(gens)
if(me.currentTab)me.currentTab.codePub=me.gens.codePub}))
if(this.reg.env.infoBroker)this.reg.env.infoBroker.addConsumer(this)
this.reg.env.place.eventsMgr.on("onConnectionRenewed",()=>{this.refreshStates()})
this.liveTab=new GeneratorTab(this,true)
this.genTabs.appendChild(JSX.createElement(Button,{id:"addTab",onclick:this.onAddTab,"tabindex-custom":"-1",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/generators/addtab.svg","ui-context":"bar",title:"Ajoute un onglet pour un accès stable aux publications d\'un item"}))
if(init.lastDatas&&init.lastDatas.tabs){for(let i=0,s=init.lastDatas.tabs.length;i<s;i++){const t=new GeneratorTab(this,false,init.lastDatas.tabs[i])
if(init.lastDatas.currentTab===i)this.setCurrentTab(t)}}if(!this.currentTab)this.setCurrentTab(this.liveTab)}setCurrentTab(genTab){if(this.currentTab)this.currentTab.setAsCurrentTab(false)
this.currentTab=genTab
this.currentTab.setAsCurrentTab(true)
this.gens.setSrc(genTab.itemPtr.shortDescs[0],genTab.codePub)}buildLastDatas(parentLastDatas){const lastDatasKey=this.getAttribute("last-datas")
if(lastDatasKey){let tab=DOM.findFirstChild(this.genTabs,isGeneratorTabPointer)
if(this.liveTab===tab.genTab)tab=DOM.findNextSibling(tab,isGeneratorTabPointer)
if(tab){const ld=parentLastDatas[lastDatasKey]={}
ld.tabs=[]
do{const srcRef=tab.genTab.itemPtr.srcRef
if(srcRef){if(this.currentTab===tab.genTab)ld.currentTab=ld.tabs.length
ld.tabs.push({srcRef:srcRef,codeGen:tab.genTab.codePub})}}while(tab=DOM.findNextSibling(tab,isGeneratorTabPointer))}}}async refreshStates(){await this.wsp.waitForAvailable(this)
let tab=DOM.findFirstChild(this.genTabs,isGeneratorTabPointer)
while(tab){tab.genTab.itemPtr.fetchSrc()
tab=DOM.findNextSibling(this.genTabs,isGeneratorTabPointer)}}async onAddTab(ev){const me=DOMSH.findHost(this)
const genTab=new GeneratorTab(me,false,{srcRef:null})
genTab.genView.setCurrentTab(genTab)
await SrcPointerFastSelect.SINGLETON.execute(genTab.itemPtr,ev)
if(!genTab.itemPtr.srcRef)genTab.closeTab()}onInfo(info){if(this.hidden)return
if(info instanceof InfoCurrentItem)this.liveTab.itemPtr.setSrcRef(info.srcUri,info.shortDesc)}onViewShown(){this.gens.onViewShown()
this.liveTab.refreshLiveTab()}visitViews(visitor,options){return visitor(this.gens)}visitViewsAsync(visitor,options){return visitor(this.gens)}}REG.reg.registerSkin("wsp-generator-tabs",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t#tabs {\n\t\tdisplay: flex;\n\t\tflex-wrap: wrap;\n\t\talign-items: center;\n\t\tmargin-bottom: -1px;\n\t}\n\n\t#headTi {\n\t\tpadding: 0 .3em;\n\t\tfont-size: 80%;\n\t\twhite-space: nowrap;\n\t\tcolor: var(--fade-color);\n\t}\n\n\t.genTab {\n\t\tdisplay: flex;\n\t\tpadding: 2px 4px;\n\t\tborder-bottom: solid 2px transparent;\n\t}\n\n\t.genTab:first-of-type > wsp-src-pointer-inline.empty {\n\t\tdisplay: none;\n\t}\n\n\t.genTab:first-of-type > wsp-src-pointer-inline.empty + .dupTab {\n\t\tdisplay: none;\n\t}\n\n\t#addTab {\n\t\tborder-inline: 1px solid var(--border-color);\n\t\tmin-height: calc(6px + var(--icon-size))\n\t}\n\n\t.genTab.currentTab {\n\t\tborder-color: var(--tabl-select-color);\n\t}\n\n\t.genTab:hover {\n\t\tbackground: var(--pressed-bgcolor);\n\t}\n\n\twsp-generators {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tborder-top: 1px solid var(--border-color);\n\t}\n`)
customElements.define("wsp-generator-tabs",GeneratorTabs)
class GeneratorTab{constructor(genView,atFirst,lastDatas){this.genView=genView
this.tab=genView.genTabs.insertBefore(JSX.createElement("span",{class:"genTab"}),atFirst?genView.genTabs.firstChild:null)
this.tab.genTab=this
this.itemPtr=this.tab.appendChild((new SrcPointerInline).initialize({reg:genView.reg,defaultAction:genView.reg.getSvc("ptrItemDblClick",SrcPointerDblClick.SINGLETON),sgnPattern:genView.reg.env.wsp.wspMetaUi.getGenOrCidSgnPattern(),showStatus:true,draggable:true,dropable:true,dispatchHighlight:true}))
this.setPinState(lastDatas!=null)
this.itemPtr.classList.add("fixedIconSize")
this.itemPtr.tabIndex=-1
this.itemPtr.addEventListener("focus",(function(ev){const genTab=this.parentElement.genTab
genTab.genView.setCurrentTab(genTab)}))
this.itemPtr.onSrcRefChange.add((function(drawer){const genTab=drawer.parentElement.genTab
const src=drawer.shortDescs[0]
if(!src||src.srcSt<0){if(genTab.pinned)genTab.closeTab()
else drawer.setSrcRef(null)}if(genTab.genView.currentTab===genTab)genTab.genView.gens.setSrc(src,genTab.codePub)}))
if(this.pinned){this.codePub=lastDatas.codeGen
this.itemPtr.setSrcRef(lastDatas.srcRef)
this.btn=this.tab.appendChild(this._newCloseButton("-1"))}else{this.btn=this.tab.appendChild(JSX.createElement(Button,{class:"dupTab",onclick:this.onPin,"tabindex-custom":"-1",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/generators/duptab.svg","ui-context":"bar",title:"Duplique cet onglet pour un accès stable aux publications de l\'item"}))
this.refreshLiveTab()}}setAsCurrentTab(current){this.tab.classList.toggle("currentTab",current)
this.itemPtr.tabIndex=current?0:-1
this.btn.tabIndexCustom=current?0:-1}refreshLiveTab(){const req=new InfoReqCurrentItem
this.genView.reg.env.infoBroker.dispatchInfo(req,this)
if(req.srcUri)this.itemPtr.setSrcRef(req.srcUri,req.shortDesc)
else this.itemPtr.setSrcRef(null)}closeTab(){var _a
if(!this.pinned)return
if(this.genView.currentTab===this)this.genView.setCurrentTab((_a=DOM.findNextSibling(this.tab,isGeneratorTabPointer)||DOM.findPreviousSibling(this.tab,isGeneratorTabPointer))===null||_a===void 0?void 0:_a.genTab)
this.tab.remove()}_newCloseButton(tabIndex){return JSX.createElement(Button,{onclick:this.onClose,"tabindex-custom":tabIndex,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/close.svg","ui-context":"bar",title:"Ferme la vue des publications de cet item"})}onClose(){this.parentElement.genTab.closeTab()}onPin(ev){const spanTab=this.parentElement
const genTab=spanTab.genTab
genTab.genView.liveTab=new GeneratorTab(genTab.genView,true)
genTab.setPinState(true)
this.parentNode.insertBefore(genTab._newCloseButton(this.tabIndexCustom.toString()),this)
this.remove()
spanTab.parentNode.insertBefore(spanTab,DOM.findNextSibling(spanTab,isGeneratorTabPointer))
genTab.genView.setCurrentTab(genTab)}setPinState(pinned){if(pinned){this.pinned=true
this.itemPtr.readOnly=false
this.itemPtr.title=""}else{this.pinned=false
this.itemPtr.readOnly=true
this.itemPtr.title="Publications de l\'item actif"}}}function isGeneratorTabPointer(n){return(n===null||n===void 0?void 0:n.genTab)instanceof GeneratorTab}export class Generators extends BaseAreaView{constructor(){super(...arguments)
this.onCodePubChange=new EventMgr
this.datas=new GridDataHolderJsonTree("ch").setDefaultOpenState(defaultOpenStates)}get shortDesc(){return this.pubActions.actionContext.shortDesc}_initialize(init){var _a
super._initialize(init)
this.wsp=this.reg.env.wsp
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("scroll/small",sr)
this.reg.installSkin("form-control-areas",sr)
this._initAndInstallSkin(this.localName,init)
const layoutV=((_a=init.area)===null||_a===void 0?void 0:_a.layout)==="v"
this.reg.installSkin(layoutV?"wsp-generators/v":"wsp-generators/h",sr)
this.pubNodeMatchFilter=init.pubNodeMatchFilter
this.customDestPath=init.customDestPath
this.pubTree=sr.appendChild(JSX.createElement(GridSmall,{id:"tree","î":{reg:this.reg,columnDefs:[new GridColTreeDef("genTree").setFlex("1rem",1,1).setMinWidth("55px").setChildrenIndent(1.5).setCellBuilder(new CellBuilderGen)],hideHeaders:true,autoSelOnFocus:"first",skinScroll:"scroll/small",emptyBody:JSX.createElement("div",{style:"font-style:italic;"},"Aucune fonction de publication disponible")},"c-resizable":""}))
this.pubTree.dataHolder=this.datas
this.pubTree.addEventListener("grid-select",this.onGridSelect)
sr.appendChild(JSX.createElement("c-resizer",{"c-orient":layoutV?"column":"row"}))
const body=sr.appendChild(JSX.createElement("section",{id:"body","c-resizable":""}))
this.genRoot=body.appendChild(JSX.createElement("div",{id:"genRoot",hidden:"true"}))
const genTop=this.genRoot.appendChild(JSX.createElement("div",{id:"genTop"}))
const genTopMain=genTop.appendChild(JSX.createElement("div",{id:"genTopMain"}))
this.genRefreshBtn=genTop.appendChild(JSX.createElement(Button,{id:"refresh","î":{icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/refresh.svg",uiContext:"bar"},onclick:this.refreshGenRootUi,title:"Rafraichir"}))
this.genIllus=genTopMain.appendChild(JSX.createElement("div",{id:"illusCtn"},JSX.createElement("img",{id:"illus"}))).firstChild
const topInfos=genTopMain.appendChild(JSX.createElement("div",{id:"topInfos"}))
this.genInfos=topInfos.appendChild(JSX.createElement("div",{id:"infos"}))
this.genSkins=topInfos.appendChild(JSX.createElement("form",{id:"skins"}))
this.genSkins.addEventListener("change",this.onSkinChange)
this.genProps=this.genRoot.appendChild(JSX.createElement("form",{id:"props"}))
this.cidRoot=body.appendChild(JSX.createElement("div",{id:"cidRoot",hidden:"true"}))
this.cidManifestHead=this.cidRoot.appendChild(JSX.createElement("div",{id:"cidManifest"}))
this.cidDetails=this.cidRoot.appendChild(JSX.createElement("div",{id:"cidDetails"}))
this.pubActions=body.appendChild(JSX.createElement("c-bar-actions",{"î":{reg:this.reg,actionContext:{reg:null,uiContext:this,wsp:this.wsp,shortDesc:null,pubNode:null,genInfo:null,async genProps(){if(this.uiContext.genRoot.hidden)return null
const skins=this.uiContext.genSkins
const rootProps=this.uiContext.genProps
if(skins.hidden&&rootProps.hidden)return null
if(!rootProps.reportValidity())return false
const props={}
if(!skins.hidden)FORMS.formToJson(skins,props)
if(!rootProps.hidden)FORMS.formToJson(rootProps,props)
return props},customDestPath:this.customDestPath},uiContext:"dialog",disableFullOverlay:true},id:"actions",hidden:"true"}))}setSrc(shortDesc,codeGenToSelect){const ctx=this.pubActions.actionContext
if(ctx.shortDesc===shortDesc)return
ctx.shortDesc=shortDesc
if(!shortDesc||shortDesc.srcSt<0){this.datas.setDatas([])}else{const itemType=this.wsp.wspMetaUi.getItemType(shortDesc.itModel)
const itemReg=ctx.reg=REG.createSubReg(this.reg,itemType)
itemReg.env.securityCtx=SEC.createSub(this.reg.env.securityCtx,shortDesc.srcRoles,shortDesc.srcRi)
const tree=itemType.buildPubTree(itemReg.env.securityCtx,this.pubNodeMatchFilter)
this.datas.setDatas(tree)
if(codeGenToSelect){const newGen=itemType.getPub(codeGenToSelect,tree)
if(newGen){this.datas.openFolder(newGen)
const offset=this.datas.getOffset(newGen)
if(offset>=0)this.pubTree.setSelectedRows(offset)}}else{const pub=tree[0]
if(pub&&(pub.genNodeType==="gen"||pub.genNodeType==="cid")){this.pubTree.setSelectedRows(0)}}}}onGridSelect(ev){const generators=DOMSH.findHost(this)
const newPubNode=generators.datas.getDataByOffset(this.getSelectedRow())
if(newPubNode){generators.codePub=newPubNode.codeGenStack
generators.onCodePubChange.emit(generators)}if(newPubNode!==generators.pubActions.actionContext.pubNode)generators.setPubNode(newPubNode)}onSkinChange(ev){const generators=DOMSH.findHost(this)
generators.setGenIllus(ev.target.value)}async setPubNode(pubNode){if(pubNode){if(pubNode.genNodeType==="cid"){DOM.setHidden(this.cidRoot,false)
DOM.setHidden(this.genRoot,true)
return this.initViewCid(pubNode)}else if(pubNode.genNodeType!=="dir"){DOM.setHidden(this.genRoot,false)
DOM.setHidden(this.cidRoot,true)
return this.initViewGen(pubNode)}}this.initViewEmpty()}initViewEmpty(){this.pubActions.actionContext.pubNode=null
this.pubActions.actionContext.genInfo=null
this.pubActions.actionContext.cidInfo=null
DOM.setHidden(this.genRoot,true)
DOM.setHidden(this.cidRoot,true)
DOM.setHidden(this.pubActions,true)}refreshGenRootUi(){const generators=DOMSH.findHost(this)
generators.initViewGen(generators.pubActions.actionContext.pubNode)}async initViewGen(genNode){try{const ctx=this.pubActions.actionContext
const idx=genNode.codeGenStack.lastIndexOf("_")
const cdGen=idx<0?genNode.codeGenStack:genNode.codeGenStack.substring(idx+1)
ctx.pubNode=genNode
const genInfoSvc=ctx.reg.getSvc("gen.action.genInfo")||ITEM.fetchGenInfo
const genInfo=await genInfoSvc.call(this,this.wsp,this,SRC.srcRef(ctx.shortDesc),genNode.codeGenStack,genNode.needExtraProps,this.customDestPath)
if(ctx.pubNode!==genNode)return
DOM.setHidden(this.genRoot,false)
DOM.setHidden(this.genRefreshBtn,!genNode.showRefreshBtn||genInfo.status==="working")
ctx.genInfo=genInfo
ctx.cidInfo=null
if(genInfo.skins&&genInfo.skins.length>1){genInfo.skins.sort((skinA,skinB)=>skinA.title.localeCompare(skinB.title,"en",{sensitivity:"base"}))
DOM.setHidden(this.genSkins,false)
render(this.skinsTpl(ctx),this.genSkins)
this.genSkins["skin"].value=genInfo.skin||"default"}else{DOM.setHidden(this.genSkins,true)}this.setGenIllus(genInfo.skin)
render(await(genNode.infos||this.infosTpl)(ctx),this.genInfos)
const propsLists=[]
propsLists.push(`params:gen:${cdGen}`)
if(genNode.codeGenStack!=cdGen)propsLists.push(`params:gen:${genNode.codeGenStack}`)
propsLists.push(`params:genNature:${genNode.genNature}`)
propsLists.push("params:gen")
const propsListsAreas=ctx.reg.mergeLists(...propsLists)
if(genNode.props||propsListsAreas){DOM.setHidden(this.genProps,false)
let tpl=genNode.props?await genNode.props(ctx):xhtml`<fieldset>
					<div class="fields" area-ids="*"/>
				</fieldset>`
if(this.genProps.hasChildNodes())render(null,this.genProps)
render(tpl,this.genProps,{})
let areaCtx=Object.create(ctx)
areaCtx.buildControlLabel=true
if(propsListsAreas)await AREAS.applyLayout(this.genProps,await Promise.all(propsListsAreas),areaCtx,true)
FORMS.jsonToForm(ctx.genInfo.storedProps||{},this.genProps,false,false)
DOM.setAttrBool(this.genProps,"disabled",genInfo.status==="working")}else{DOM.setHidden(this.genProps,true)}if(genInfo.status==="working"){DOM.setHidden(this.pubActions,true)
setTimeout(()=>{if(ctx.pubNode===genNode)this.initViewGen(genNode)},1e4)}else{DOM.setHidden(this.pubActions,false)
const actionsLists=[]
actionsLists.push(`actions:gen:${cdGen}`)
if(genNode.codeGenStack!=cdGen)actionsLists.push(`actions:gen:${genNode.codeGenStack}`)
actionsLists.push(`actions:genNature:${genNode.genNature}`)
actionsLists.push("actions:gen")
if(genNode.actionListsCode)actionsLists.push(...genNode.actionListsCode)
this.pubActions.actions=await Promise.all(ctx.reg.mergeLists(...actionsLists))}}catch(e){console.error(e)
this.initViewEmpty()}}async initViewCid(cidNode){try{const ctx=this.pubActions.actionContext
ctx.pubNode=cidNode
const allHosts=await CID.getCidHostsForOutput(this.reg)
ctx.genInfo=null
ctx.cidInfo={cidHosts:cidNode.cidHostIs===null?[]:cidNode.cidHostIs?Array.from(CID.filterIsOr(allHosts,cidNode.cidHostIs)):allHosts}
if(ctx.pubNode!==cidNode)return
DOM.setHidden(this.cidRoot,false)
if(cidNode.cidManifestUrlInput||ctx.cidInfo.cidHosts.length!==1){this.cidSeletHost()}else{ctx.cidInfo.lastManifest=await ctx.cidInfo.cidHosts[0].fetchManifest()
if(ctx.pubNode!==cidNode)return
this.cidOnManifestKnown()}}catch(e){console.error(e)
this.initViewEmpty()}}cidSeletHost(){const ctx=this.pubActions.actionContext
DOM.setHidden(this.pubActions,true)
this.pubActions.actions=null
this.cidDetails.textContent=null
if(ctx.cidInfo.cidHosts.length>0){this.cidManifestHead.textContent="Sélection du serveur cible"
const group=this.cidDetails.appendChild(JSX.createElement("ul",null))
for(let i=0,s=ctx.cidInfo.cidHosts.length;i<s;i++){const host=ctx.cidInfo.cidHosts[i]
group.appendChild(JSX.createElement("li",null,JSX.createElement("a",{onclick:this.onCidSelectHost,href:i},host.label)))}if(ctx.pubNode.cidManifestUrlInput)this.buildInputManifest(group.appendChild(JSX.createElement("li",null)),"Autre")}else{this.cidManifestHead.textContent="Définition du serveur cible"
this.buildInputManifest(this.cidDetails.appendChild(JSX.createElement("div",{id:"manifestAlone"})),"URL du serveur")}}buildInputManifest(parent,label){parent.appendChild(JSX.createElement("div",{class:"manifestLabel"},label))
parent.appendChild(JSX.createElement("div",{id:"manifestEdit"},JSX.createElement("input",{id:"manifestInput",type:"url",oninput:this.onManifestInput,onchange:function(){DOMSH.findHost(this).onManifestChange(this)}}),JSX.createElement("c-button",{id:"manifestValid","î":{reg:this.reg,label:"Valider",disabled:true},onclick:function(){DOMSH.findHost(this).cidUseManifest(this.cidManifest)}})))
parent.appendChild(JSX.createElement("c-msg",{id:"manifestInputResult","î":{noShadow:true}}))}async onManifestChange(input){const msg=this.shadowRoot.getElementById("manifestInputResult")
const btn=this.shadowRoot.getElementById("manifestValid")
btn.cidManifest=null
if(!input.validity.valid){msg.setCustomMsg("Saisissez une URL valide permettant d\'obtenir les caractéristiques du serveur (manifeste CID)","info")
btn.cidManifest=null
btn.disabled=true}else{const ctx=this.pubActions.actionContext
const pubNode=ctx.pubNode
try{btn.cidManifest=await CID.getCidManifest(input.value)
if(pubNode!==ctx.pubNode)return}catch(e){console.log(e)}if(btn.cidManifest){msg.setCustomMsg("Serveur reconnu : "+CID.getCidManifestLabel(this.pubActions.actionContext.cidInfo.cidHosts,btn.cidManifest),"info")
btn.disabled=false}else{msg.setCustomMsg("Aucun serveur reconnu à cette URL (manifeste CID non trouvé), ou politique de sécurité du serveur incompatible","error")
btn.disabled=true}}}onManifestInput(ev){const me=DOMSH.findHost(this)
if(me._cidMnInputWaiter)clearTimeout(me._cidMnInputWaiter)
me._cidMnInputWaiter=setTimeout(()=>me.onManifestChange(this),800)}cidUseManifest(manifest){if(!manifest)return
const ctx=this.pubActions.actionContext
ctx.cidInfo.lastManifest=manifest
this.cidOnManifestKnown()}async onCidSelectHost(ev){ev.preventDefault()
const me=DOMSH.findHost(this)
const ctx=me.pubActions.actionContext
const cidNode=ctx.pubNode
ctx.cidInfo.lastManifest=await ctx.cidInfo.cidHosts[parseInt(this.getAttribute("href"))].fetchManifest()
if(ctx.pubNode!==cidNode)return
me.cidOnManifestKnown()}async cidOnManifestKnown(){const ctx=this.pubActions.actionContext
const cidNode=ctx.pubNode
const manifest=ctx.cidInfo.lastManifest
if(!manifest)return this.cidSeletHost()
this.cidManifestHead.textContent="Serveur : "+CID.getCidManifestLabel(this.pubActions.actionContext.cidInfo.cidHosts,manifest)
if(ctx.pubNode.cidManifestUrlInput||ctx.cidInfo.cidHosts.length!==1){this.cidManifestHead.appendChild(JSX.createElement("c-button",{class:"changeBtn",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/generators/change.svg",title:"Changer de serveur",onclick:function(ev){return DOMSH.findHost(this).cidSeletHost()}}))}if(cidNode.cidProcessSelector){ctx.cidInfo.cidProcesses=await cidNode.cidProcessSelector(ctx)
if(cidNode!==ctx.pubNode)return}else if(cidNode.cidProcessIs){ctx.cidInfo.cidProcesses=manifest.getProcesses(...cidNode.cidProcessIs)}DOM.setHidden(this.pubActions,false)
this.pubActions.actions=await Promise.all(ctx.reg.mergeLists(...cidNode.actionListsCode||[],`actions:cid:${ctx.pubNode.codeGenStack}`,ctx.pubNode.codeGenStack.indexOf("_")>0?"actions:cidGen":"actions:cidScar"))
this.cidRefreshOnSessionChange()}cidRefreshOnSessionChange(){const ctx=this.pubActions.actionContext
if(!ctx.cidInfo)return
this.pubActions.refreshContent()
if(ctx.cidInfo.cidSession){switch(ctx.cidInfo.cidSession.state){case ECidSessionState.authenticating:this.cidDetails.textContent=null
this.cidDetails.appendChild(JSX.createElement("div",{class:"cidUploading"},JSX.createElement("span",null,"Authentification en cours...")))
return
case ECidSessionState.inStep:case ECidSessionState.uiProcessSel:case ECidSessionState.notStarted:this.cidDetails.textContent=null
this.cidDetails.appendChild(JSX.createElement("div",{class:"cidUploading"},JSX.createElement("span",null,"Déploiement en cours...")))
return
case ECidSessionState.uiAuth:return
case ECidSessionState.failed:case ECidSessionState.ended:case ECidSessionState.aborted:}}this.cidDetails.textContent=null}setGenIllus(skinCode){const genInfo=this.pubActions.actionContext.genInfo
const genNode=this.pubActions.actionContext.pubNode
const skin=skinCode&&genInfo&&genInfo.skins?genInfo.skins.find(s=>s.code===skinCode):null
const src=skin&&skin.hasIllus?ITEM.getGenSkinIllusUrl(this.wsp,genNode,skin):genNode.illusUrl
if(src!==this.prevIllusSrc)this.genIllus.src=this.prevIllusSrc=src}onViewHidden(closed){if(closed){this.reg.env.place.eventsMgr.removeListener("onConnectionRenewed",this._onConnectionRenewed)
this.reg.env.universe.wsFrames.ws.msgListeners.removeListener("wspGen",this._onMsgWspGen)
this._onMsgWspGen=null
this._onConnectionRenewed=null}}onViewShown(){if(!this._onMsgWspGen){this._onMsgWspGen=m=>{const ctx=this.pubActions.actionContext
if(!ctx.pubNode||ctx.shortDesc.srcUri!==m.srcUri||m.wsp!==ctx.wsp.code||m.customDestPath!==this.customDestPath)return
this.setPubNode(ctx.pubNode)}
this._onConnectionRenewed=()=>{const ctx=this.pubActions.actionContext
if(ctx.pubNode)this.setPubNode(ctx.pubNode)}
this.reg.env.place.eventsMgr.on("onConnectionRenewed",this._onConnectionRenewed)
this.reg.env.universe.wsFrames.ws.msgListeners.on("wspGen",this._onMsgWspGen)}}infosTpl(ctx){let dt
const deploy=ctx.pubNode.genNature==="deploy"
if(ctx.genInfo.status==="working"){dt=deploy?"Transfert en cours...":"Génération en cours..."}else if(ctx.genInfo.lastGen){const lastGenDate=DTFormatter.format(ctx.genInfo.lastGen)
if(ctx.genInfo.status==="failed")dt=deploy?`Transfert en erreur le ${lastGenDate}`:`Généré en erreur le ${lastGenDate}`
else if(ctx.genInfo.status==="warning")dt=deploy?`Transféré avec anomalies le ${lastGenDate}`:`Généré avec anomalies le ${lastGenDate}`
else dt=deploy?`Transféré le ${lastGenDate}`:`Généré le ${lastGenDate}`}else if(ctx.genInfo.status==="failed"){dt=deploy?"Dernier transfert en erreur":"Dernière génération en erreur"}else{dt=deploy?"Non transféré":"Non généré"}return xhtml`<div class="genTi ${ctx.genInfo.status}">${ctx.pubNode.genTitle||ctx.genInfo.title}</div>
<div class="reason ${ctx.genInfo.reason?"":"hidden"}">Un fichier de la génération est verrouillé. FERMEZ les applications tierces et recommencez.</div>
<div class="dt ${ctx.genInfo.status}">${dt}</div>`}skinsTpl(ctx){return xhtml`${ctx.genInfo.skins.map(skin=>xhtml`<span class="skin"><input type="radio" name="skin" value="${skin.code}" id="sk_${skin.code}"/><label for="sk_${skin.code}">${skin.title}</label></span>`)}`}async webAuth(session,step){const frame=JSX.createElement("iframe",{style:"flex:1; border: none;"})
if(UiThemeDeskFeat.isIn(desk))frame.injectTheme=UiThemeDeskFeat.injectTheme
const dialog=POPUP.showDialog(frame,this,{titleBar:"Authentification",initHeight:"min(60vh,40em)",initWidth:"60vw"})
dialog.onNextClose().then(r=>{if(!r)session.onCidFrameMessage({cidAuth:"failed"})})
const res=await step.initFrame(frame,session)
dialog.close("ok")
return res}async uiWait(session,step){this.cidDetails.textContent=null
const iframe=this.cidDetails.appendChild(JSX.createElement("iframe",{class:"cidWaiting"}))
if(UiThemeDeskFeat.isIn(desk))iframe.injectTheme=UiThemeDeskFeat.injectTheme
return step.initFrame(iframe,session)}async interact(session,step){const ctx=this.pubActions.actionContext
if(session.config.cidPassOptionalInteraction&&step.def.getAttribute("required")==="false")return{}
const frame=JSX.createElement("iframe",{style:"flex:1; border: none;"})
if(UiThemeDeskFeat.isIn(desk))frame.injectTheme=UiThemeDeskFeat.injectTheme
const dialog=POPUP.showDialog(frame,this,{initHeight:"min(90vh,50em)",initWidth:"min(90vw,80em)",titleBar:{barLabel:{label:session.cidProcess.label.getStr("fr")}},resizer:{}})
dialog.onNextClose().then(r=>{if(!r)session.onCidFrameMessage({cidInteraction:"aborted"})})
const res=await step.initFrame(frame,session)
dialog.close("ok")
return res}async selectProcess(session,choices){return choices.values().next().value}}REG.reg.registerSkin("wsp-generators",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\t:focus-visible {\n\t\toutline: var(--focus-outline);\n\t}\n\n\t[hidden] {\n\t\tdisplay: none !important;\n\t}\n\n\tinput,\n\tselect,\n\ttextarea {\n\t\tbackground-color: var(--form-bgcolor);\n\t\tcolor: var(--form-color);\n\t\tborder: 1px solid var(--border-color);\n\t\tfont-size: inherit;\n\t}\n\n\tinput:invalid,\n\tselect:invalid,\n\ttextarea:invalid {\n\t\tborder: 1px solid var(--error-color);\n\t}\n\n\t#tree {\n\t\tflex: 1 1 30%;\n\t\tborder: none;\n\t\tbackground-color: var(--row-bgcolor);\n\t}\n\n\t#body {\n\t\tflex: 3 1 70%;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t#genRoot {\n\t\tflex: 1;\n\t\toverflow: auto;\n\t}\n\n\t#genTop {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\talign-items: start;\n\t}\n\n\t#genTopMain {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tjustify-content: center;\n\t}\n\n\t#topInfos {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\ttext-align: center;\n\t\tjustify-content: center;\n\t}\n\n\t#illusCtn {\n\t\tdisplay: flex;\n\t\tjustify-content: center;\n\t\talign-items: center;\n\t\tuser-select: none;\n\t}\n\n\t#illus {\n\t\tmargin: .5em;\n\t\tmin-width: calc(var(--icon-size) * 2);\n\t\tmin-height: calc(var(--icon-size) * 2);\n\t}\n\n\t#cidRoot,\n\t#cidDetails {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t#cidRoot {\n\t\toverflow: auto;\n\t}\n\n\t#cidManifest {\n\t\tmargin: .2em;\n\t\tfont-weight: bold;\n\t\tfont-size: 1.2em;\n\t\ttext-align: center;\n\t\tuser-select: none;\n\t}\n\n\t#actions {\n\t\tborder-top: 1px solid var(--border-color);\n\t}\n\n\t.manifestLabel {\n\t\tuser-select: none;\n\t}\n\n\t#manifestInput {\n\t\tflex: 1;\n\t}\n\n\t#manifestAlone {\n\t\tmargin: 2em;\n\t}\n\n\t#manifestEdit {\n\t\tdisplay: flex;\n\t}\n\n\t#manifestInput:focus {\n\t\toutline: var(--focus-outline);\n\t}\n\n\t#manifestInputResult {\n\t\tfont-style: italic;\n\t\tcolor: var(--fade-color);\n\t}\n\n\t.genTi {\n\t\tmargin: .2em;\n\t\tfont-weight: bold;\n\t\tfont-size: 1.2em;\n\t\tuser-select: none;\n\t}\n\n\t.ok {\n\t\tcolor: var(--valid-color);\n\t}\n\n\t.warning {\n\t\tcolor: var(--warning-color);\n\t}\n\n\t.failed {\n\t\tcolor: var(--error-color);\n\t}\n\n\t.null {\n\t\tcolor: var(--fade-color);\n\t}\n\n\t.working {\n\t\tcolor: var(--fade-color);\n\t}\n\n\t.dt {\n\t\tfont-style: italic;\n\t}\n\n\t.dt.working {\n\t\tbackground: left no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/generators/generating.webp);\n\t\tpadding-left: 30px;\n\t\tmin-height: 30px;\n\t\tdisplay: flex;\n\t\talign-items: center;\n\t}\n\n\t.reason {\n\t\tfont-weight: bold;\n\t\tcolor: var(--error-color);\n\t\tmargin: .1em;\n\t\tpadding: .1em;\n\t}\n\n\t.reason.hidden {\n\t\tdisplay: none;\n\t}\n\n\t.skin {\n\t\tdisplay: inline-block;\n\t\tmargin: .2em;\n\t\tuser-select: none;\n\t}\n\n\t#props {\n\t\tmargin-block-start: .5em;\n\t}\n\n\t#props[disabled] {\n\t\tdisplay: none;\n\t}\n\n\tfieldset {\n\t\tborder: none;\n\t\tpadding: 0;\n\t\tmargin: 0;\n\t\tmin-width: 0;\n\t}\n\n\t/* control en dehors d'un ctrlLbl => s'étend sur les deux colonnes */\n\t.fields > .ctrl {\n\t\tgrid-column-start: span 2;\n\t}\n\n\t/** Contrôle sans */\n\t.ctrlFull {\n\t\tgrid-column-start: span 2;\n\t}\n\n\tinput, textarea, select,\n\t.formElt {\n\t\tmargin-inline-end: .5em;\n\t}\n\n\t.lbl, input, textarea, select,\n\t.formElt, .ctrl {\n\t\tmargin-block-start: .5em;\n\t}\n\n\t/** Pour compat asc pack. A supprimer en 5.1 */\n\t.fieldLabel {\n\t\tcolor: var(--alt1-color);\n\t\tdisplay: inline-block;\n\t\tuser-select: none;\n\t\tmargin-inline-end: .5rem;\n\t\tmargin-inline-start: .3rem;\n\t}\n\n\t/** Pour compat asc pack. A supprimer en 5.1 */\n\t.fieldValue {\n\t\tmargin-inline-start: 0.5em;\n\t\tgrid-column: 2;\n\t}\n\n\t/** Pour compat asc pack. A supprimer en 5.1 */\n\tinput.fieldValue {\n\t\twidth: fit-content;\n\t}\n\n\n\t.changeBtn {\n\t\tdisplay: inline-flex;\n\t}\n\n\t.cidWaiting {\n\t\tflex: 1;\n\t\tborder: none;\n\t\tborder-top: 1px solid var(--border-color);\n\t}\n\n\t.cidUploading {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\talign-items: center;\n\t\tfont-style: italic;\n\t\tmargin: 0 2em;\n\t}\n`)
REG.reg.registerSkin("wsp-generators/h",1,`\n\tc-resizer {\n\t\twidth: 1px;\n\t}\n\n\t#props > div,\n\t.fields /* deprecated ? */\n\t{\n\t\tflex: 1;\n\t\tdisplay: grid;\n\t\tmin-width: 10em;\n\t\tgrid-template-columns: auto 1fr;\n\t\tgrid-row-gap: .5rem;\n\t\tgrid-auto-rows: max-content;\n\t}\n\n\t.fields > .ctrlLbl,\n\t.field {\n\t\tdisplay: contents;\n\t}\n\n\t.lbl {\n\t\tmargin-inline-start: .5em;\n\t}\n`)
REG.reg.registerSkin("wsp-generators/v",1,`\n\t:host {\n\t\tflex-direction: column;\n\t}\n\n\tc-resizer {\n\t\theight: 1px;\n\t}\n\n\t.ctrlLbl {\n\t\tdisplay: block;\n\t\tmargin-inline-start: .5em;\n\t}\n`)
customElements.define("wsp-generators",Generators)
const DTFormatter=new Intl.DateTimeFormat("fr",{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"})
function defaultOpenStates(d){return d.genNodeType==="dir"}class CellBuilderGen extends CellBuilderIconLabel{constructor(){super("label")
this.iconKey="iconUrl"
this.iconFilter="var(--filter)"}redrawCell(row,root){super.redrawCell(row,root)
const span=root.firstElementChild
if(row.rowDatas.genNodeType==="dir"){span.style.display=row.rowDatas.iconUrl?"":"none"
root.style.fontWeight="bold"}else{span.style.display=""
root.style.fontWeight="normal"}}}export class DynGenParam extends(MxFormElement(BaseElement)){constructor(){super(...arguments)
this._lastProps=null}get viewGenPropsMgr(){if(this.view&&this.view.genFrame&&this.view.genFrame.contentWindow)return this.view.genFrame.contentWindow._genPropsMgr
return null}_initialize(init){this.config=init
this.reg=this.findReg(init)
this.view=(new DynGen).initialize(Object.assign({reg:this.reg,w:this.reg.env.wsp.code,autoResize:true},this.config))
this.view.tabIndex=-1
this.view.genFrame.addEventListener("load",()=>{this._refreshUi()})
this._attach(this.localName,init,this.view)
this._initializeForm(init)}_refreshUi(forceDisabled){if(this.viewGenPropsMgr)this.viewGenPropsMgr.refresh(this._lastProps,forceDisabled?true:this.disabled,false)
this._refreshValidity()}visitViews(visitor){if(this.view)return visitor(this.view)}visitViewsAsync(visitor,options){return this.view?visitor(this.view):Promise.resolve(undefined)}fillJson(parent,root){var _a
Object.assign(parent,((_a=this.viewGenPropsMgr)===null||_a===void 0?void 0:_a.get())||{})}extractJson(parent){var _a
this._lastProps=parent;(_a=this.view)===null||_a===void 0?void 0:_a.load()
return true}formDisabledCallback(disabled){this._refreshUi(disabled)}_refreshValidity(){var _a
let validity=(_a=this.viewGenPropsMgr)===null||_a===void 0?void 0:_a.checkValidity()
this.setValidity({badInput:!validity},validity?"":"Valeur incorrecte",this.view)}}REG.reg.registerSkin("wsp-generator-params-dyngen",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex: 1;\n\t\tflex-direction: column;\n\t}\n\n\twsp-dyngen {\n\t\twidth: 100%;\n\t\theight: 100%;\n\t}\n\n\n\twsp-dyngen:focus {\n\t\toutline: var(--focus-outline);\n\t}\n`)
customElements.define("wsp-generator-params-dyngen",DynGenParam)

//# sourceMappingURL=generators.js.map