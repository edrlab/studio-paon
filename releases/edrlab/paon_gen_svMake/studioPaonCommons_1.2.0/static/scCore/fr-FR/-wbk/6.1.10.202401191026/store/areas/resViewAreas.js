import{Area,AreaAsync,isArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{LOCALE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{UtBrowserFetcher}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/utBrowser.js"
import{ResLayoutView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/resLayoutView.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{InfoFocusRes}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/res.js"
import{ResVersionsView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/resVersionsView.js"
import{AccelKeyMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{TemplateResult}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/litHtml/lib/template-result.js"
import{render}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/litHtml/lit-html.js"
import{FORMS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
import{Tabs}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/tabs.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/areas/areas_Perms.js"
export class ResLayoutArea extends AreaAsync{constructor(id){super(id||"resLayout")
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/resLayoutView.js"))}setBody(...body){this.body=body
return this}setScroll(scroll){this.scroll=scroll
return this}buildBody(ctx,lastDatas){if(ctx.reg.isClosed)return null
const init={area:this,areaContext:ctx,reg:ctx.reg,lastDatas:lastDatas,skin:this.getSkin(ctx),skinOver:this.getSkinOver(ctx),body:this.body,scroll:this.scroll}
return JSX.createElement("store-res-layout",{"î":init})}}export class ResInfoArea extends AreaAsync{constructor(){super("resInfo")
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/resInfosView.js"))}setLines(...lines){this.lines=lines
return this}addDefaultLines(){if(!this.lines)this.lines=[]
this.lines.push(RESINFO.path,RESINFO.url,RESINFO.status,RESINFO.deploy,RESINFO.prc)
return this}addLines(...lines){if(!this.lines)this.lines=[]
if(lines)this.lines.push(...lines)
return this}buildBody(ctx,lastDatas){if(ctx.reg.isClosed)return null
const init={area:this,areaContext:ctx,reg:ctx.reg,lastDatas:lastDatas,skin:this.getSkin(ctx),skinOver:this.getSkinOver(ctx),lines:this.lines}
return JSX.createElement("store-res-infos",{"î":init})}}export class ResAncArea extends AreaAsync{constructor(){super("resAnc")
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/resAncView.js"))}buildBody(ctx,lastDatas){if(ctx.reg.isClosed)return null
const init={area:this,areaContext:ctx,reg:ctx.reg,lastDatas:lastDatas,skin:this.getSkin(ctx),skinOver:this.getSkinOver(ctx)}
return JSX.createElement("store-res-anc",{"î":init})}}export class ResVersionsArea extends AreaAsync{constructor(){super("resVersions")
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/resVersionsView.js"))}buildBody(ctx,lastDatas){if(ctx.reg.isClosed)return null
const init={reg:ctx.reg,skin:this.getSkin(ctx),skinOver:this.getSkinOver(ctx)}
return JSX.createElement("store-res-versions",{"î":init})}}export class ResChildrenArea extends AreaAsync{constructor(id){super(id||"resChildren")
this.iniLibs()}get depotActions(){return this._modules[0]}get resActions(){return this._modules[1]}iniLibs(){this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/actions/depotActions.js"),IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/actions/resActions.js"),IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/resContentView.js"))}asSelectArea(){if(!this.asSelect){this.asSelect=Object.create(this)
this.asSelect.noEdit="addFolder"
this.asSelect.actions=null}return this.asSelect}asConsultArea(){if(!this.asConsult){this.asConsult=Object.create(this)
this.asConsult.noEdit="strict"
this.asConsult.actions=null}return this.asConsult}asResTreeArea(){const area=new ResTreeArea
area.noEdit=this.noEdit
area.actions=this.actions
return area}async loadBody(ctx,lastDatas){if(!(this instanceof ResTreeArea)){const showMode=ctx.reg.getSvc("storeResChildrenShowMode")
if(typeof showMode==="function"&&showMode()==="tree"){return this.asResTreeArea().loadBody(ctx,lastDatas)}}return super.loadBody(ctx,lastDatas)}needAsync(ctx){return true}buildBody(ctx,lastDatas){if(ctx.reg.isClosed)return null
return JSX.createElement("store-res-children",{"î":{reg:ctx.reg,area:this,areaContext:ctx,filter:this.filter,skin:this.getSkin(ctx),skinOver:this.getSkinOver(ctx),actionsBar:this.getActionsBar(ctx)}})}getActionsBar(ctx){let actions=this.actions
if(actions===undefined){if(this.noEdit==="strict")return null
actions=[]
if(this.noEdit!=="addFolder")actions.push(new this.resActions.AddByImport)
actions.push(new this.resActions.AddFolder)}return actions?{reg:ctx.reg,actions:actions,actionContext:ctx,uiContext:"dialog",disableFullOverlay:true}:null}}export class ResTreeArea extends ResChildrenArea{constructor(){super("resTree")}iniLibs(){this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/actions/depotActions.js"),IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/actions/resActions.js"),IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/utBrowser.js"))}buildBody(ctx,lastDatas){if(ctx.reg.isClosed)return null
const init={reg:ctx.reg,lastDatas:lastDatas===null||lastDatas===void 0?void 0:lastDatas.ch,lastDatasKey:"ch",skin:this.getSkin(ctx),skinOver:this.getSkinOver(ctx),pathRoot:ctx.reg.env.nodeInfos.permaPath,fetcher:new UtBrowserFetcher(ctx.reg.env.universe.adminUrlTree).setFilter(this.filter),infoBroker:ctx.reg.env.infoBroker,defaultAction:new this.depotActions.FocusLiveRes,actionsStart:this.getActionsBar(ctx),grid:{skinScroll:"scroll/large"},actions:ctx.reg.mergeLists("actions:store:ResTreeView","actions:store:resList"),accelKeyMgr:(new AccelKeyMgr).initFromMapActions(ctx.reg.mergeListsAsMap("accelkeys:store:ResTreeView","accelkeys:store:resList"))}
if(this.noEdit)init.resHandlingMode="sel"
return JSX.createElement("store-ut-browser",{"î":init})}}export class ResTabsArea extends Area{constructor(id){super(id||"resTabs")}setTabs(...tabs){this.tabs=tabs
return this}needAsync(ctx){return this.tabs.some(t=>t.needAsync(ctx))}async loadLibs(ctx){await Promise.all(this.tabs.filter(t=>t.needAsync(ctx)).map(t=>t.loadLibs(ctx)))}buildBody(ctx,lastDatas){const tabs=this.tabs.filter(t=>t.isVisible(ctx))
if(tabs.length>1){return JSX.createElement(Tabs,{class:"noBorder","î":{reg:ctx.reg,areas:tabs,areasContext:ctx,skinOver:"store-res-bodytabs"}})}else if(tabs.length===1){return tabs[0].buildBody(ctx,lastDatas)}return null}}REG.reg.registerSkin("store-res-bodytabs",1,`\n\t:host {\n\t\tflex: 1;\n\t}\n\n\tc-tab {\n\t\tflex: 1;\n\t\tborder-width: 3px !important;\n\t\tpadding: .5em !important;\n\t\tfont-weight: bold !important;\n\t\tcolor: var(--fade-color);\n\t}\n`)
class ResContentArea extends AreaAsync{setActionsLists(actionLists){this.actionLists=actionLists
return this}getActionsBar(ctx){return this.actionLists?{reg:ctx.reg,actions:ctx.reg.mergeLists(...this.actionLists),actionContext:ctx,uiContext:"dialog",disableFullOverlay:true}:null}}export class ResNoContentArea extends ResContentArea{constructor(){super("resNoContent")}buildBody(ctx,lastDatas){if(ctx.reg.isClosed)return null
const bar=JSX.createElement(BarActions,{id:this.getId(),"î":this.getActionsBar(ctx)})
return bar}}export class ResFrameArea extends ResContentArea{constructor(subPath,treeSrv){super("resFrame")
this.subPath=subPath
this.treeSrv=treeSrv
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/resContentView.js"))}buildBody(ctx,lastDatas){if(ctx.reg.isClosed)return null
const init={reg:ctx.reg,area:this,areaContext:ctx,skin:this.getSkin(ctx),skinOver:this.getSkinOver(ctx),subPath:this.subPath,treeSrv:ctx.reg.env.universe[this.treeSrv||"urlTree"],actionsBar:this.getActionsBar(ctx)}
return JSX.createElement("store-res-frame",{"î":init})}}export class ResImgArea extends ResContentArea{constructor(subPath,treeSrv){super("resImg")
this.subPath=subPath
this.treeSrv=treeSrv
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/resContentView.js"))}showCheckboard(show){this.checkboard=show
return this}buildBody(ctx,lastDatas){if(ctx.reg.isClosed)return null
const init={reg:ctx.reg,area:this,areaContext:ctx,skin:this.getSkin(ctx),skinOver:this.getSkinOver(ctx),subPath:this.subPath,treeSrv:ctx.reg.env.universe[this.treeSrv||"urlTree"],checkboard:this.checkboard,actionsBar:this.getActionsBar(ctx)}
return JSX.createElement("store-res-img",{"î":init})}}export class ResAudioArea extends ResContentArea{constructor(subPath,treeSrv){super("resAudio")
this.subPath=subPath
this.treeSrv=treeSrv
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/resContentView.js"))}buildBody(ctx,lastDatas){if(ctx.reg.isClosed)return null
const init={reg:ctx.reg,area:this,areaContext:ctx,skin:this.getSkin(ctx),skinOver:this.getSkinOver(ctx),subPath:this.subPath,treeSrv:ctx.reg.env.universe[this.treeSrv||"urlTree"],actionsBar:this.getActionsBar(ctx)}
return JSX.createElement("store-res-audio",{"î":init})}}export class ResVideoArea extends ResContentArea{constructor(subPath,treeSrv){super("resAudio")
this.subPath=subPath
this.treeSrv=treeSrv
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/resContentView.js"))}buildBody(ctx,lastDatas){if(ctx.reg.isClosed)return null
const init={reg:ctx.reg,area:this,areaContext:ctx,skin:this.getSkin(ctx),skinOver:this.getSkinOver(ctx),subPath:this.subPath,treeSrv:ctx.reg.env.universe[this.treeSrv||"urlTree"],actionsBar:this.getActionsBar(ctx)}
return JSX.createElement("store-res-video",{"î":init})}}export class ResBarActionsArea extends Area{constructor(actionLists,id){super(id||"resBarActions")
this.actionLists=actionLists}buildBody(ctx,lastDatas){var _a
const bar=JSX.createElement(BarActions,{id:this.getId(),"î":{reg:ctx,actions:ctx.mergeLists(...this.actionLists),actionContext:ctx,disableFullOverlay:true}});(_a=ctx.env.nodeInfosChange)===null||_a===void 0?void 0:_a.on("histChange",()=>{bar.refreshContent()})
return bar}}export class ResMainArea extends ResLayoutArea{constructor(){super("resMain")
this._skinOver="store-res-main"
this.scroll="large"
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/resMainView.js"))}setContent(...contentView){this.contentViews=contentView
this.body=[ResMainArea.headerTag,{tag:"main",children:[ResMainArea.titleArea,...contentView]}]
return this}asSelectArea(){if(!this._selectArea){this._selectArea=new ResMainArea
this._selectArea.contentViews=this.contentViews.map(cv=>{var _a
return((_a=cv)===null||_a===void 0?void 0:_a.asSelectArea)?cv.asSelectArea():cv})
this._selectArea.body=[ResMainArea.headerSelectTag,{tag:"main",children:[ResMainArea.titleArea,...this._selectArea.contentViews]}]}return this._selectArea}asConsultArea(){if(!this._consultArea){this._consultArea=new ResMainArea
this._consultArea.contentViews=this.contentViews.map(cv=>{var _a
return((_a=cv)===null||_a===void 0?void 0:_a.asConsultArea)?cv.asConsultArea():cv})
this._consultArea.body=[{tag:"main",children:[ResMainArea.titleArea,...this._consultArea.contentViews]}]}return this._consultArea}}ResMainArea.ancArea=new ResAncArea
ResMainArea.actionsArea=new ResBarActionsArea(["actions:depot:resMainView:edit"],"resEdit")
ResMainArea.headerTag={tag:"header",children:[ResMainArea.ancArea,ResMainArea.actionsArea]}
ResMainArea.headerSelectTag={tag:"header",children:[ResMainArea.ancArea]}
ResMainArea.titleLine={drawLine(reg,parent){const ni=reg.env.nodeInfos
const resType=reg.env.resType
const actions=JSX.createElement("c-bar-actions",{"î":{reg:reg,actionContext:reg,actions:reg.getList("actions:depot:resMainView:infos")}})
const versions=(ni.t!=="moved"?resType.prcVersionning==="VCS":ni.hist||ni.succ)&&reg.getPref("depot.showVersions",true)
const name=JSX.createElement("span",{class:"name"},resType.resName(ni))
const versionInTi=!versions&&resType.prcVersionning==="VCB"?JSX.createElement("span",{id:"versionInTi"},"@",JSX.createElement(ResVersionsView,{"î":{reg:reg,showDate:false,onlyChangedContent:true}})):undefined
let flagInTi
if(ni.trashed){flagInTi=JSX.createElement("span",{class:"trashed",title:reg.env.resTypes.visStateDescription(ni)})}else if(ni.unlisted){flagInTi=JSX.createElement("span",{class:"unlisted",title:reg.env.resTypes.visStateDescription(ni)})}parent.appendChild(JSX.createElement("div",{id:"title"},JSX.createElement("img",{class:"icon",src:resType.resIcon(ni)}),JSX.createElement("span",{id:"nameCtn"},name,versionInTi,flagInTi),versions?undefined:actions))
if(versions){parent.appendChild(JSX.createElement("div",{id:"version"},JSX.createElement(ResVersionsView,{"î":{reg:reg,showDate:true,onlyChangedContent:true}}),actions))}const infosArea=resType.resView("infosMain")
if(infosArea){function addInfosMain(view){if(!view)return
view.id="infosMain"
reg.installSkin("store-res-infosMain",view.shadowRoot)
parent.appendChild(view)}if(infosArea.needAsync(reg)){infosArea.loadBody(reg).then(addInfosMain)}else{addInfosMain(infosArea.buildBody(reg))}}}}
ResMainArea.titleArea=(new ResInfoArea).setSkin("store-res-titlebar").setLines(ResMainArea.titleLine)
REG.reg.registerSkin("store-res-infosMain",1,`\n\t:host {\n\t\tpadding: 0 0 .5em 0;\n\t}\n\n\t.label, .lbl {\n\t\tjustify-content: flex-start;\n\t\tfont-variant: all-small-caps;\n\t\tcolor: var(--fade-color);\n\t}\n`)
export class ResHoverArea extends ResLayoutArea{constructor(){super("resHover")
this._skinOver="store-res-hover"}setPreview(...preview){this.body=[(new ResInfoArea).setLines(RESINFO.path,RESINFO.url,RESINFO.status,RESINFO.prc),...preview]
return this}}REG.reg.registerSkin("store-res-hover",1,`\n\t:host {\n\t\tmax-width: 25rem;\n\t\tmin-width: 20rem;\n\t}\n`)
export class ResFormMetasArea extends AreaAsync{constructor(id){super(id||"formMetas")
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/resLayoutView.js"))}setBody(...body){this.body=body
return this}async loadLibs(ctx){await super.loadLibs(ctx)
const promises=[]
ResLayoutView.loadLibs(this.body,ctx,promises)
return Promise.all(promises)}buildBody(ctx,lastDatas){if(ctx.reg.isClosed)return null
const fieldset=document.createElement("fieldset")
for(const v of this.body){ResLayoutView.buildSrcView(v,fieldset,ctx,null)}return fieldset}}export class ResTemplatesArea extends AreaAsync{constructor(id){super(id||"resTemplates")
this._label="Gabarits"
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/resTemplatesView.js"))
this.requireVisiblePerm("ui.store.area.resTemplates")}setTemplatesConfig(config){this.config=config
return this}buildBody(ctx,lastDatas){if(ctx.reg.isClosed)return null
const init=Object.assign({area:this,areaContext:ctx,reg:ctx.reg,skin:this.getSkin(ctx),skinOver:this.getSkinOver(ctx)},this.config)
return JSX.createElement("store-res-templates",{"î":init})}}export var RESINFO;(function(RESINFO){RESINFO.path={drawLine(ctx,parent,view){parent.appendChild(JSX.createElement("div",{class:"line"},JSX.createElement("span",{class:"label"},"Chemin"),JSX.createElement("span",{class:"value"},ctx.reg.env.nodeInfos.permaPath||"/")))}}
RESINFO.url={drawLine(ctx,parent,view){const url=ctx.reg.env.nodeInfos.publicUrl
if(url)parent.appendChild(JSX.createElement("div",{class:"line"},JSX.createElement("span",{class:"label"},"URL"),JSX.createElement("a",{class:"value",href:url,target:"_blank"},url)))}}
RESINFO.deploy={drawLine(ctx,parent,view){const metas=ctx.reg.env.nodeInfos.metas
if(!metas)return
const dt=ctx.reg.env.nodeInfos.m||metas.deployDate
if(!dt)return
const by=metas.deployedBy
parent.appendChild(JSX.createElement("div",{class:"line"},JSX.createElement("span",{class:"label"},"Modification"),JSX.createElement("span",{class:"value"},LOCALE.formatDateDigitsToSec.format(new Date(dt)),by?JSX.createElement("span",null," par ",JSX.createElement("c-userref",{class:"inline","î":{reg:ctx.reg,nickOrAccount:by}})):undefined)))}}
RESINFO.status={drawLine(ctx,parent,view){const ni=ctx.reg.env.nodeInfos
ctx.reg.env.resTypes.visStateMenuLabel
if(ni.trashed||ni.unlisted){parent.appendChild(JSX.createElement("div",{class:"line"},JSX.createElement("span",{class:"label"},ctx.reg.env.resTypes.visStateMenuLabel),JSX.createElement("span",{class:"value",title:ctx.reg.env.resTypes.visStateDescription(ni)},JSX.createElement("img",{style:"height:.7em; vertical-align:center; margin-inline-end:.3em",src:ni.trashed?"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/states/invisible.svg":"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/states/limited.svg"}),ctx.reg.env.resTypes.visStateLabel(ni))))}}}
RESINFO.prc={drawLine(ctx,parent,view){parent.appendChild(JSX.createElement("div",{class:"line"},JSX.createElement("span",{class:"label"},"Traitement"),JSX.createElement("span",{class:"value"},ctx.reg.env.resType.prcLabel)))}}
RESINFO.moved={drawLine(ctx,parent,view){const movedPath=ctx.reg.env.nodeInfos.movedPath
if(movedPath){parent.appendChild(JSX.createElement("div",{class:"line"},JSX.createElement("span",{class:"label"},"Déplacé vers"),JSX.createElement("a",{href:"javascript:void(0)",class:"value",onclick:ev=>{var _a;(_a=ctx.reg.env.infoBroker)===null||_a===void 0?void 0:_a.dispatchInfo(new InfoFocusRes(movedPath),view)}},movedPath)))}}}
RESINFO.debug={async drawLine(ctx,parent,view){parent.appendChild(JSX.createElement("div",{class:"line"},JSX.createElement("span",{class:"label"},"nodeInfos:::"),JSX.createElement("span",{class:"value"},JSON.stringify(ctx.reg.env.nodeInfos))))
const render=JSX.createElement("span",{class:"value"},"loading...")
parent.appendChild(JSX.createElement("div",{class:"line"},JSX.createElement("span",{class:"label"},"renderings:::"),render))
render.textContent=JSON.stringify((await ctx.reg.env.universe.getRenderings(ctx.reg)).datas)}}
class SimpleMeta{constructor(metaLabel,metaName){this.metaLabel=metaLabel
this.metaName=metaName}drawLine(ctx,parent,view){const metas=ctx.reg.env.nodeInfos.metas
if(metas&&this.metaName in metas)parent.appendChild(JSX.createElement("div",{class:"line"},JSX.createElement("span",{class:"label"},this.metaLabel),JSX.createElement("span",{class:"value"},metas[this.metaName])))}}RESINFO.SimpleMeta=SimpleMeta
class BasicResLine{setLabel(label){this.label=label
return this}setValues(...values){this.values=values
return this}appendValues(...values){if(!this.values)this.values=[]
if(values)this.values.push(...values)
return this}isVisible(value){this.visible=value
return this}drawLine(ctx,parent,view){const visible=typeof this.visible==="function"?this.visible(ctx):this.visible
if(visible!==false){let label=typeof this.label==="function"?this.label(ctx):this.label
let labelCtn
if(label instanceof TemplateResult){labelCtn=JSX.createElement("span",{class:"value"})
render(label,labelCtn)}else labelCtn=JSX.createElement("span",{class:"label"},label)
let valuesCtn=JSX.createElement("span",{class:"value"})
if(this.values){this.values.forEach(value=>{const valueEntry=valuesCtn.appendChild(JSX.createElement("span",{class:"valueEntry"}))
if(typeof value==="function")value=value(ctx)
if(value instanceof TemplateResult){render(value,valueEntry)}else if(isArea(value)){valueEntry.appendChild(value.buildBody(ctx,view))}else if(typeof value==="string")valueEntry.appendChild(document.createTextNode(value))
else throw"unknown type : "+typeof value})}parent.appendChild(JSX.createElement("div",{class:"line"},labelCtn,valuesCtn))}}}RESINFO.BasicResLine=BasicResLine
class ResFormAreaLine{constructor(metaName,area,onlyIfHasContent=false){this.metaName=metaName
this.area=area
this.onlyIfHasContent=onlyIfHasContent}setArea(area){this.area=area
return this}drawLine(ctx,parent,view){const metas=ctx.reg.env.nodeInfos.metas
if(!this.onlyIfHasContent||metas&&this.metaName in metas){const elt=parent.appendChild(this.area.buildBody(Object.assign({buildControlLabel:true},ctx),null))
FORMS.jsonToForm(metas||{},elt)}}}RESINFO.ResFormAreaLine=ResFormAreaLine})(RESINFO||(RESINFO={}))
export class ResIdentFieldSetArea extends AreaAsync{constructor(){super("ResIdentFieldSet")
this.requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/widgets/resInputs.js"))}setCustomFields(customInputs,pathBuilder,noFolderSelector,noResNameField){this.customInputs=customInputs
this.pathBuilder=pathBuilder
this.noFolderSelector=noFolderSelector
this.noResNameField=noResNameField
return this}buildBody(ctx){if(ctx.reg.isClosed)return null
const init=Object.create(ctx)
init.area=this
init.skin=this.getSkin(ctx)
init.skinOver=this.getSkinOver(ctx)
return JSX.createElement("store-res-ident-fieldset",{"î":init})}}
//# sourceMappingURL=resViewAreas.js.map