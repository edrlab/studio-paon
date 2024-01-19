import*as generators from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/gen/genActions.js"
import*as actions from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import*as htmlLit from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/htmlLit.js"
import{xhtml}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/htmlLit.js"
import{Area}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{EndPointResolver,IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{EItResp,EItStatus,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{ESrcSt,SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/remoteView.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/codeView.js"
import{ExportRes,ImportFolder,ImportRes}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/itemActions.js"
import{ETaskStage}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/lcTask.js"
import{DynGen}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/dynGen.js"
export class WspMetaUi{constructor(reg,wspTypeUrl,wspOptionUrls){this._dataItemTypes={}
this._itemTypesMap={}
this._weds={}
this._icon=null
this.reg=REG.createSubReg(reg)
this.chain=reg.env.universe.wspServer.chain
this.wspTypeUrl=wspTypeUrl
this.wspOptionUrls=wspOptionUrls}static async createWspMetaUi(wspServer,wspMeta){const wspTypeEP=WspMetaUi.buildWspTypeUiEndPoint(wspServer,wspMeta.wspType)
const wspOptionEPs=wspMeta.wspOptions?wspMeta.wspOptions.map(opt=>WspMetaUi.buildWspTypeUiEndPoint(wspServer,opt,wspTypeEP)):null
const wspMetaUi=new WspMetaUi(wspServer.reg,wspTypeEP,wspOptionEPs)
let postConfigs
wspMetaUi._currrentWspTypeEP=wspTypeEP
const next=await(await wspTypeEP.importJs("wspType.js")).configWspMeta(wspMetaUi,wspTypeEP,UTILS)
if(next)postConfigs=[next]
if(wspOptionEPs)for(const wpsOptUrl of wspOptionEPs){wspMetaUi._currrentWspTypeEP=wpsOptUrl
const next=await(await wpsOptUrl.importJs("wspOption.js")).configWspMeta(wspMetaUi,wpsOptUrl,UTILS)
if(next)(postConfigs||(postConfigs=[])).push(next)}wspMetaUi._currrentWspTypeEP=null
while((postConfigs===null||postConfigs===void 0?void 0:postConfigs.length)>0){let newPostConfigs
for(const config of postConfigs){const next=await config(wspMetaUi,UTILS)
if(next)(newPostConfigs||(newPostConfigs=[])).push(next)}postConfigs=newPostConfigs}const override=wspMetaUi.reg.getSvc("overrideWspMetaUi")
if(override)await override(wspServer,wspMetaUi,UTILS)
wspMetaUi.hasResps=hasResps(wspMetaUi._dataItemTypes)
if(wspMetaUi.hasResps){wspMetaUi.reg.addToList("srcFields:shortDesc","rspSt",1,"rspSt")
wspMetaUi.reg.addToList("srcFields:longDesc","rspUsrs",1,"rspUsrs")}if(!("hasTasks"in wspMetaUi))wspMetaUi.hasTasks=hasTasks(wspMetaUi._dataItemTypes)
if(wspMetaUi._itemLifeCycle||wspMetaUi.hasTasks){wspMetaUi.reg.addToList("srcFields:shortDesc","lcSt",1,"lcSt")
wspMetaUi.reg.addToList("srcFields:longDesc","lcDt",1,"lcDt")
wspMetaUi.reg.addToList("srcFields:longDesc","lcBy",1,"lcBy")}if(wspMetaUi.hasTasks){wspMetaUi.reg.addToList("srcFields:shortDesc","actTi",1,"actTi")
if(wspMetaUi.flagItemsWithTasks)wspMetaUi.reg.addToList("srcFields:shortDesc","tkPending",1,"tkPending")
wspMetaUi.reg.addToList("srcFields:longDesc","rspUsrs",1,"rspUsrs")
wspMetaUi.reg.addToList("srcFields:longDesc","actCts",1,"actCts")
wspMetaUi.reg.addToList("srcFields:longDesc","actStage",1,"actStage")
wspMetaUi.reg.addToList("srcFields:longDesc","tkDeadline",1,"tkDeadline")}return wspMetaUi}static buildWspTypeUiEndPoint(wspServer,wspType,wspTypeRes){const a=[]
a.push("show!",wspType.key,".wui.wsp")
if(wspType.lang)a.push("~",wspType.lang)
a.push("%23",wspType.version,"%23",wspType.version,"/")
const target=wspServer.config.adminWspUrl.resolve(a.join(""))
const endPoint=wspServer.reg.env.resolver.clone().setBase(target).addEndPoint("wspRes",target)
if(wspTypeRes)endPoint.addEndPoint("wspTypeRes",wspTypeRes).freeze()
return endPoint}get itemTypeNull(){return this._itemTypeNull||(this._itemTypeNull=new ItemTypeNull(this))}get itemTypeNotFound(){return this._itemTypeNotFound||(this._itemTypeNotFound=new ItemTypeNotFound(this))}get itemTypeFallback(){return this._itemTypeFallback||(this._itemTypeFallback=new ItemTypeFallback(this))}getItemType(itModel){if(itModel==null)return this.itemTypeNotFound
let itemType=this._itemTypesMap[itModel]
if(itemType===undefined){const datas=this._dataItemTypes[itModel]
if(datas){switch(datas.family){case EItemTypeFamily.xml:itemType=new ItemTypeXml(this,datas)
break
case EItemTypeFamily.res:itemType=new ItemTypeRes(this,datas)
break
case EItemTypeFamily.folder:itemType=new ItemTypeFolder(this,datas)
break
case EItemTypeFamily.task:itemType=new ItemTypeTask(this,datas)
break
case EItemTypeFamily.undef:itemType=new ItemTypeUndef(this,datas)
break
default:itemType=new ItemTypeOther(this,datas)}if(datas.configItemType)itemType=datas.configItemType(itemType)
this._itemTypesMap[itModel]=itemType}else{this._itemTypesMap[itModel]=null}}return itemType||this.itemTypeFallback}getItemTypes(){if(this._itemTypesSet==null){this._itemTypesSet=[]
for(const md in this._dataItemTypes){const data=this._dataItemTypes[md]
if(data)this._itemTypesSet.push(this.getItemType(data.model))}}return this._itemTypesSet}hasForthcomingTasks(){for(const md in this._dataItemTypes){const data=this._dataItemTypes[md]
if((data===null||data===void 0?void 0:data.family)===EItemTypeFamily.task){if(data.lcStates.find(st=>st.taskStage===ETaskStage.forthcoming))return true}}return false}listResps(family="item"){if(!this._listRespsTasks||!this._listRespsItems){const mapTasks=new Map
const mapItems=new Map
for(const md in this._dataItemTypes){const resps=this._dataItemTypes[md].resps
if(resps){resps.forEach(resp=>{if(this._dataItemTypes[md].family==="task")mapTasks.set(resp.code,resp)
else mapItems.set(resp.code,resp)})}}this._listRespsTasks=Array.from(mapTasks.values())
this._listRespsItems=Array.from(mapItems.values())}return family==="task"?this._listRespsTasks:this._listRespsItems}getItemTypesTree(reducer){function findOrCreateFolder(parent,folder){for(const ch of parent){if(isDirItemType(ch)&&ch.code===folder.code){return ch}}const dir={code:folder.code,sortKey:folder.sortKey,label:folder.label,closed:folder.closed,children:[]}
parent.push(dir)
return dir}let itemTypesFiltered
if(reducer){itemTypesFiltered=[]
this.getItemTypes().reduce(reducer,itemTypesFiltered)}else itemTypesFiltered=this.getItemTypes()
const tree=[]
itemTypesFiltered.forEach(itemType=>{let parent=tree
const folders=itemType.datas.classification
if(folders!=null){for(const folder of folders)parent=findOrCreateFolder(parent,folder).children
parent.push(itemType)}})
function sort(parent){parent.sort((function(e1,e2){return e1.sortKey==e2.sortKey?0:e1.sortKey>e2.sortKey?1:-1}))
for(const ch of parent)if(isDirItemType(ch))sort(ch.children)}sort(tree)
return tree}getDocModels(){let r
for(const type of this.getItemTypes()){if(type.datas.asDoc){if(!r)r=[type.getModel()]
else r.push(type.getModel())}}return r}getDefaultResFileIcon(){if(!this._defaultResIconFile)this._defaultResIconFile=this.chain.config.skinUrl.url+"wsp/itemType/icons/resFile/icovalid.png"
return this._defaultResIconFile}getDefaultResFolderIcon(){if(!this._defaultResIconFolder)this._defaultResIconFolder=this.chain.config.skinUrl.url+"wsp/itemType/icons/resFolder/icovalid.png"
return this._defaultResIconFolder}getDefaultResFolderOpenIcon(){if(!this._defaultResIconOpenFolder)this._defaultResIconOpenFolder=this.chain.config.skinUrl.url+"wsp/itemType/icons/resFolderOpen/icovalid.png"
return this._defaultResIconOpenFolder}getSpaceIcon(src){if(!this._spaceIcon)this._spaceIcon=this.chain.config.skinUrl.url+"wsp/itemType/icons/space/icovalid.png"
return this._spaceIcon}getSpaceOpenIcon(src){if(!this._spaceOpenIcon)this._spaceOpenIcon=this.chain.config.skinUrl.url+"wsp/itemType/icons/spaceOpen/icovalid.png"
return this._spaceOpenIcon}getIcon(){return this._icon}getWedDef(key){const wed=this._weds[key]
if(wed)return wed
return key==="rawXml"?{path:":back:modeling/rawXml.wed.xml"}:null}getLcName(){return this._itemLifeCycle.lcName||LC_DEFAULT_NAME}getLcStates(){return this._itemLifeCycle?this._itemLifeCycle.lcStates:null}getLcState(code){return this._itemLifeCycle?this._itemLifeCycle.lcStates.get(code):null}getLcStateOrUnknown(code){return this._itemLifeCycle?this._itemLifeCycle.lcStates.get(code)||this._itemLifeCycle.lcStates.get("?"):null}getLcTransition(code){return this._itemLifeCycle?this._itemLifeCycle.lcTrans.get(code):null}getLcTransitions(){return this._itemLifeCycle?this._itemLifeCycle.lcTrans:null}getLcTransitionsGroupOrder(){return this._itemLifeCycle?this._itemLifeCycle.lcTransGroupOrder||"*":null}getGenOrCidSgnPattern(){const hasGen=gens=>{if(gens)for(let gen of gens){if(gen.genNodeType==="gen"||gen.genNodeType==="cid")return true
if(gen.ch&&hasGen(gen.ch))return true}return false}
let sgns=[]
for(let itType of this.getItemTypes()){let itData=itType.datas
if(hasGen(itData.generators))sgns.push(itData.sgn)}return sgns.length>0?new RegExp(sgns.join("|")):null}hasHelpDb(){return this._helpSrc!=null||this._helpOptionsSrc!=null}getHelpDbProv(){if(!this._helpDbProv)this._helpDbProv=async()=>{const{getHelpLocalDb:getHelpLocalDb,HelpLocalDb:HelpLocalDb}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/help/helpLocalDb.js")
let helpDb=this._helpSrc?getHelpLocalDb(this._helpSrc):null
if(this._helpOptionsSrc){const{HelpUnionDb:HelpUnionDb}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/help/helpUnionDb.js")
const map=new Map
this._helpOptionsSrc.forEach(optHelp=>map.set(optHelp.key,{db:getHelpLocalDb(optHelp.endPoint,helpDb,optHelp.key),title:optHelp.title}))
return new HelpUnionDb(this.reg,helpDb,map)}return helpDb}
return this._helpDbProv}setItemType(dataItemType){this._dataItemTypes[dataItemType.model]=dataItemType}setWed(key,wedDef){this._weds[key]=wedDef}setSpaceIcon(close,open){this._spaceIcon=close
this._spaceOpenIcon=open}setIcon(ico){this._icon=ico}setItemLcName(name){if(!this._itemLifeCycle)this._itemLifeCycle={lcStates:new Map,lcTrans:new Map}
this._itemLifeCycle.lcName=name}addItemLcState(...lcState){if(!this._itemLifeCycle)this._itemLifeCycle={lcStates:new Map,lcTrans:new Map}
for(const st of lcState){if(st.icon)st.iconUrl=this._currrentWspTypeEP.resolve(st.icon).url
this._itemLifeCycle.lcStates.set(st.code,st)}}addItemLcTrans(...lcTrans){if(!this._itemLifeCycle)this._itemLifeCycle={lcStates:new Map,lcTrans:new Map}
for(const tr of lcTrans){if(tr.icon)tr.iconUrl=this._currrentWspTypeEP.resolve(tr.icon).url
this._itemLifeCycle.lcTrans.set(tr.code,tr)}}setItemLcTransGroupOrder(groupOrder){if(!this._itemLifeCycle)this._itemLifeCycle={lcStates:new Map,lcTrans:new Map}
this._itemLifeCycle.lcTransGroupOrder=groupOrder}addLocalHelp(source,key,title){if(!key){this._helpSrc=this._currrentWspTypeEP.resolve(source)}else{if(!this._helpOptionsSrc)this._helpOptionsSrc=[]
this._helpOptionsSrc.push({endPoint:this._currrentWspTypeEP.resolve(source),key:key,title:title})}}toString(){var _a
return JSON.stringify({wspType:this.wspTypeUrl.url,wspOptions:(_a=this.wspOptionUrls)===null||_a===void 0?void 0:_a.map(v=>v.url)})}}export var EItemTypeFamily;(function(EItemTypeFamily){EItemTypeFamily["xml"]="xml"
EItemTypeFamily["res"]="res"
EItemTypeFamily["folder"]="folder"
EItemTypeFamily["task"]="task"
EItemTypeFamily["undef"]="undef"
EItemTypeFamily["other"]="other"})(EItemTypeFamily||(EItemTypeFamily={}))
export class ItemType{constructor(wspMeta,datas){this.wspMeta=wspMeta
this.datas=datas
this.reg=REG.createSubReg(wspMeta.reg)
this.reg.env.itemType=this}getFamily(){return this.datas.family}isFamily(...family){return family.indexOf(this.datas.family)>=0}getModel(){return this.datas.model}getSgn(){return this.datas.sgn}getTitle(shortDesc){return this.datas.title}getTagRoot(){return null}getIcon(shortDesc){if(shortDesc)switch(shortDesc.itSt){case EItStatus.warnings:return this.datas.wspResUrl.resolve(this.datas.iconsPng+"icowarning.png").url
case EItStatus.errors:case EItStatus.conflict:return this.datas.wspResUrl.resolve(this.datas.iconsPng+"icoerror.png").url}if(shortDesc)switch(shortDesc.rspSt){case EItResp.errors:return this.datas.wspResUrl.resolve(this.datas.iconsPng+"icoerror.png").url}if(!this._iconPngValid)this._iconPngValid=this.datas.wspResUrl.resolve(this.datas.iconsPng+"icovalid.png").url
return this._iconPngValid}getIconOpen(shortDesc){if(shortDesc)switch(shortDesc.itSt){case EItStatus.warnings:return this.datas.wspResUrl.resolve((this.datas.iconsPngOpen||this.datas.iconsPng)+"icowarning.png").url
case EItStatus.errors:case EItStatus.conflict:return this.datas.wspResUrl.resolve((this.datas.iconsPngOpen||this.datas.iconsPng)+"icoerror.png").url}if(shortDesc)switch(shortDesc.rspSt){case EItResp.errors:return this.datas.wspResUrl.resolve((this.datas.iconsPngOpen||this.datas.iconsPng)+"icoerror.png").url}if(!this._iconPngOpenValid)this._iconPngOpenValid=this.datas.wspResUrl.resolve((this.datas.iconsPngOpen||this.datas.iconsPng)+"icovalid.png").url
return this._iconPngOpenValid}getSrcMainArea(ctx){throw Error()}configRegForMainView(ctx,reg){var _a
const configReg=(_a=this.getDataSrcMainView(ctx,true))===null||_a===void 0?void 0:_a.configReg
if(configReg)configReg(reg)
else if(ctx.mainViewCode){if(ctx.mainViewCode.indexOf(":hideWspStruct:")>=0){reg.setPref("wsp.hideWspStruct",REG.LEVELAUTH_MODEL,true)
reg.addToList("ribbon:item","refs",REG.LEVELAUTH_MODEL,null)}}}getConvertersForMainView(ctx){var _a
const cnvs=(_a=this.getDataSrcMainView(ctx,true))===null||_a===void 0?void 0:_a.convertors
if(!cnvs)return null
for(let i=0;i<cnvs.length;i++){const cnv=cnvs[i]
if("executor"in cnv)cnvs[i]=new ItemMainConvert(cnv)}cnvs.sort((c1,c2)=>c1.getLabel(ctx).localeCompare(c2.getLabel(ctx)))
return cnvs}getDataSrcMainView(ctx,strict){if(!ctx.mainViewCode)return this.datas.mainView
return this.datas.otherMainViews?this.datas.otherMainViews[ctx.mainViewCode]||(strict?null:this.datas.mainView):strict?null:this.datas.mainView}getIsolatedView(shortDesc){return this.datas.isolatedView}getMainStreamSrcUri(shortDesc){return shortDesc?shortDesc.srcUri:null}getMainXmlSrcUri(shortDesc){return shortDesc?shortDesc.srcUri:null}getSchema(){if(!this.datas.schema)return getGenericSchema()
if(!this._schema)this._schema=getSchema(this.datas.wspResUrl.resolve(this.datas.schema))
return this._schema}getEditor(code){if(code)return this.finalizeDatasEditor(this.datas.editors[code])
if(this.datas.mainView)return this.finalizeDatasEditor(this.datas.editors[this.datas.mainView.xmlEditor])
return null}finalizeDatasEditor(d){if((d===null||d===void 0?void 0:d.help)&&!d.help.helpDbProv){d.help.helpDbProv=this.wspMeta.getHelpDbProv()
if(d.help.outlineView===undefined)d.help.outlineView={indexKey:"home"}}return d}getWed(key){const wedDef=this.wspMeta.getWedDef(key)
if(!wedDef)throw Error(`Wed editor key '${key}' do not exist in this wspMetaUi ${this.wspMeta.toString()}`)
let endP=this.datas.wspResUrl.resolve(wedDef.path)
if(!(endP instanceof EndPointResolver))endP=this.reg.env.resolver.clone().setBase(endP).addEndPoint("wspRes",this.datas.wspResUrl)
return endP}getPreview(wsp,fields,reg,utils){const preview=this.datas.previewMini
if(!preview)return undefined
if(preview.tag==="wsp-dyngen-preview"){if(fields.srcSt<0||ITEM.isHistoryOrTrashUri(fields.srcUri))return undefined
const dynGen=(new DynGen).initialize({reg:reg||this.reg,w:wsp.code,c:preview.codeGen,r:ITEM.srcRefSub(fields),gp:preview.params})
dynGen.onViewShown()
DOM.setAttr(dynGen,"style",(preview.w?`width:${preview.w};`:"")+(preview.h?`height:${preview.h};`:""))
DOM.setAttr(dynGen,"class","itemPreview dynGenView")
return xhtml`${dynGen}`}else if(preview.tag==="wsp-remote-view"){return xhtml`<wsp-remote-view class="itemPreview" style="${(preview.w?`width:${preview.w};`:"")+(preview.h?`height:${preview.h};`:"")}" p.wsp="${wsp}" p.fields="${fields}" i.="${preview.init}"/>`}else if(preview.tag==="wsp-code-view"){return xhtml`<wsp-code-view class="itemPreview" p.wsp="${wsp}" p.fields="${fields}" p.transform="${preview.transform}" i.="${preview.init}"/>`}const url=preview.transform?WSP.getStreamStampedUrl(wsp,SRC.srcRef(fields),fields.srcDt,preview.transform):WSP.getStreamStampedUrl(wsp,this.getMainStreamSrcUri(fields),fields.srcDt)
switch(preview.tag){case"img":return xhtml`<img class="itemPreview imgView" src="${url}"/>`
case"video":if(preview.poster){const poster=wsp.wspServer.config.wspSrcUrl+IO.qs("cdaction","GetSrc","param",wsp.code,"format","stream","refUri",SRC.srcRef(fields),"transform",preview.poster,"t",fields.srcDt)
return xhtml`<video class="itemPreview videoView" src="${url}" poster="${poster}" controls="controls" style="${(preview.w?`width:${preview.w};`:"")+(preview.h?`height:${preview.h};`:"")}" />`}else{return xhtml`<video class="itemPreview videoView" src="${url}" controls="controls" style="${(preview.w?`width:${preview.w};`:"")+(preview.h?`height:${preview.h};`:"")}"/>`}case"audio":return xhtml`<audio class="itemPreview audioView" src="${url}" controls="controls"/>`
case"iframe":return xhtml`<iframe class="itemPreview iframeView" style="${(preview.w?`width:${preview.w};`:"")+(preview.h?`height:${preview.h};`:"")}" src="${url}"/>`}return undefined}getExtensions(contentType){const ext=this.datas.itemExt
if(Array.isArray(ext))return ext.length>1?ext:ext[0]
return ext||".xml"}resolvePath(path){return this.datas.wspResUrl.resolve(path)}matchType(contentType,fileName){return-1}matchExt(fileName){if(!fileName)return 0
const exts=this.getExtensions()
if(exts==null)return 2
if(Array.isArray(exts))return exts.find(entry=>SRC.matchExt(fileName,entry))?100:-1
return SRC.matchExt(fileName,exts)?100:-1}getSupportModels(){if(!this.datas.asDoc)return null
const supports=this.datas.asDoc.supports
if(!supports)return null
return supports.map(s=>s.itModel)}getSupportEditor(support){const sup=this.datas.asDoc.supports.find(s=>s.itModel===support.getModel())
return sup?support.datas.editors[sup.keyEditor]:null}async buildItemName(wsp,currentSpace,currentExt,isFree){let tpl=this.datas.itemNameTpl||"{folder}_{counter}"
tpl=tpl.replace(/(\{folder\})/g,currentSpace?SRC.extractLeafFromUri(currentSpace):"")
if(tpl.indexOf("{dateStamp")>-1){function str(num){return num>9?num.toString():"0"+num}const format=tpl.match(/\{dateStamp ([^\}]*)\}/)[1]||"%Y-%m-%d"
const d=new Date
const date=format.replace(/(%.)/g,k=>{switch(k){case"%Y":return d.getFullYear().toString()
case"%m":return str(d.getMonth()+1)
case"%d":return str(d.getDate())
case"%H":return str(d.getHours())
case"%M":return str(d.getMinutes())
case"%S":return str(d.getSeconds())}return k})
tpl=tpl.replace(/(\{dateStamp [^\}]*\})/g,date)}let idx=1
let name=tpl
while(true){name=tpl.replace(/(\{optionalCounter\})/g,idx>1?"_"+(idx<10?"0"+idx:idx):"")
name=name.replace(/(\{counter\})/g,idx<10?"0"+idx:idx.toString())
if(name===tpl)break
if(!isFree)break
const itemCode=name+currentExt
if(ITEM.isValidCodeItem(itemCode)){if(isFree&&await isFree(itemCode))break
idx++}else{break}}return name}async getNewContent(reg,space,codeItem,options){return""}hasGenerators(secCtx){if(this.datas.generators)for(const gen of this.datas.generators){if(!gen.perms||this.reg.hasPerm(gen.perms,secCtx))return true}return false}buildPubTree(secCtx,filter){const cloneList=(from,to)=>{if(from)for(const datas of from){if(datas.perms&&!this.reg.hasPerm(datas.perms,secCtx))continue
if(filter&&!filter(datas))continue
if(datas.genNodeType!=="dir"){if(!datas.iconUrl){if(datas.icon)datas.iconUrl=this.datas.wspResUrl.resolve(datas.icon).url
else datas.iconUrl=`https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/generators/gen_${datas.genNature||"cid"}.svg`}if(!datas.illusUrl){if(datas.illus)datas.illusUrl=this.datas.wspResUrl.resolve(datas.illus).url
else datas.illusUrl=`https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/generators/illus_${datas.genNature}.png`}}const genNode=Object.create(datas)
if(datas.ch){const children=cloneList(datas.ch,[])
if(datas.genNodeType==="dir"&&children.length===0)continue
genNode.ch=children.length>0?children:null}to.push(genNode)}return to}
return this.datas.generators?cloneList(this.datas.generators,[]):[]}getPub(codeGenStack,list){if(!list)return null
let found=list.find(g=>g.codeGenStack===codeGenStack)
if(found)return found
for(const child of list){if(child.ch){found=this.getPub(codeGenStack,child.ch)
if(found)return found}}return null}hasResps(){return this.datas.resps&&this.datas.resps.length>0}getResp(code){const resps=this.datas.resps
if(resps)for(const r of resps)if(r.code===code)return r
return null}setEditor(key,editor){(this.datas.editors||(this.datas.editors={}))[key]=editor}addGenerator(genNode,parentCodeGenStack,insertBefore){this.removeGenerator(genNode.codeGenStack)
const parent=parentCodeGenStack?this.getPub(parentCodeGenStack,this.datas.generators):null
const list=parent?parent.ch||(parent.ch=[]):this.datas.generators||(this.datas.generators=[])
const next=insertBefore?list.findIndex(g=>g.codeGenStack.match(insertBefore)):-1
if(next<0)list.push(genNode)
else list.splice(next,0,genNode)}addConvertor(convertor,ctx={}){const mainview=this.getDataSrcMainView(ctx,true)
if(mainview){let cnvs=mainview.convertors
if(!cnvs)cnvs=mainview.convertors=[]
cnvs.push(convertor)}}removeGenerator(codeGenStack,list=this.datas.generators||[]){const idx=list.findIndex(g=>g.codeGenStack===codeGenStack)
if(idx>=0){list.splice(idx,1)
return true}for(const child of list){if(child.ch)if(this.removeGenerator(codeGenStack,child.ch))return true}return false}addMainViewSubTab(itemTab,insertBefore){this.removeMainViewSubTab(itemTab.code)
let mv=this.datas.mainView
if(!mv)mv=this.datas.mainView={}
let sts=mv.subTabs
if(!sts)sts=mv.subTabs=[]
const next=insertBefore?sts.findIndex(st=>st.code===insertBefore):-1
if(next<0)sts.push(itemTab)
else sts.splice(next,0,itemTab)}removeMainViewSubTab(code){const mv=this.datas.mainView
if(mv&&mv.subTabs){const idx=mv.subTabs.findIndex(st=>st.code===code)
if(idx>=0){mv.subTabs.splice(idx,1)
return true}}return false}setAsDoc(){if(!this.datas.asDoc)this.datas.asDoc={}}addDocumentSupport(supportModel,keyEditor,newContentBuilder){this.setAsDoc();(this.datas.asDoc.supports||(this.datas.asDoc.supports=[])).push({itModel:supportModel.getModel(),keyEditor:keyEditor,newContentBuilder:newContentBuilder})}get sortKey(){return this.datas.sortKey}}export class ItemTypeXml extends ItemType{getSrcMainArea(ctx){return this.datas.mainView.resView?defaultItemMainAreaRes:defaultItemMainAreaXml}getTagRoot(){if(this._tagRoot===undefined)this._tagRoot=this.getSgn().replace(/@([^_]*)_([^#]*).*/,"$1:$2")
return this._tagRoot}matchType(type,fileName){if(!type&&!fileName)return 0
let matchExt=this.matchExt(fileName)
if(matchExt!=0)return matchExt
if(["application/xml","text/xml"].indexOf(type)>-1)return 100
return-1}async getNewContent(reg,space,codeItem,options){if(options===null||options===void 0?void 0:options.docShortDesc){const docType=this.wspMeta.getItemType(options.docShortDesc.itModel)
const supDef=docType.datas.asDoc.supports.find(supDef=>supDef.itModel===this.getModel())
return supDef.newContentBuilder(reg.env.wsp,space,codeItem,options)}const schema=await this.getSchema()
if(!schema)return"<x/>"
const doc=JML.jmlToDom(schema.createNewDoc())
if(this.datas.createWithCtIdInAtt){const wsp=reg.env.wsp
const id=await wsp.wspServer.config.wspSvcUrl.resolve(wsp.code+"/ctId").fetchText(IO.qs("param",codeItem),{method:"POST"})
doc.documentElement.setAttribute(this.datas.createWithCtIdInAtt,id)}if(options===null||options===void 0?void 0:options.remoteUrl){const scLocation=DOM.findNext(doc.documentElement,doc.documentElement,n=>n.nodeName==="sc:location")
if(scLocation)scLocation.textContent=options.remoteUrl}return DOM.ser(doc)}}class ItemTypeRes extends ItemType{constructor(wspMeta,datas){super(wspMeta,datas)
this.datas=datas
this.reg.addToList("actions:item:burger","import",1,ImportRes.SINGLETON(),100)
this.reg.addToList("actions:item:burger","download",1,ExportRes.SINGLETON(),101)}getSrcMainArea(ctx){return defaultItemMainAreaRes}getExtensions(contentType){const resTypes=this.datas.resTypes
if(!resTypes)return null
const exts=resTypes.reduce((acc,prev)=>{if(!contentType||prev.ct.indexOf(contentType)>=0)acc.push(...prev.ext)
return acc},[])
return exts.length<2?exts[0]:exts}async getNewContent(reg,space,codeItem){const emptyUrls=this.datas.resEmptyUrl
if(emptyUrls){for(const k of Object.keys(emptyUrls)){if(SRC.matchExt(codeItem,k))return this.datas.wspResUrl.resolve(emptyUrls[k]).fetchBlob()}if(emptyUrls["*"])return this.datas.wspResUrl.resolve(emptyUrls["*"]).fetchBlob()}return""}getMainStreamSrcUri(shortDesc){if(!shortDesc)return null
if(this.datas.withoutFolderMorphology)return shortDesc.srcUri
switch(ITEM.getUriResType(shortDesc)){case ITEM.EUriResType.root:return SRC.addLeafToUri(shortDesc.srcUri,SRC.extractLeafFromUri(shortDesc.srcUri))
case ITEM.EUriResType.folder:return null}return shortDesc.srcUri}getIsolatedView(shortDesc){if(ITEM.extractItemResPath(shortDesc.srcUri)==ItemTypeRes.PATH_META){return{tag:"wsp-item-xmled"}}return this.datas.isolatedView}getMainXmlSrcUri(shortDesc){if(!shortDesc)return null
if(this.datas.withoutFolderMorphology)return shortDesc.srcUri
return ITEM.getUriResType(shortDesc)===ITEM.EUriResType.root?SRC.addLeafToUri(shortDesc.srcUri,ItemTypeRes.PATH_META):shortDesc.srcUri}matchType(type,fileName){if(!this.datas.resTypes&&!this.datas.resExtsMatcher){if(fileName)return fileName.indexOf(".")>0?2:-1
return 2}if(!type&&!fileName)return 0
if(!this.datas.resTypes&&this.datas.resExtsMatcher){if(!fileName)return 0
return this.datas.resExtsMatcher.test(fileName)?2:-1}let matchExt=this.matchExt(fileName)
if(matchExt!=0)return matchExt
for(const resType of this.datas.resTypes){if(resType.ct)for(const t of resType.ct)if(t===type)return 100}return-1}}ItemTypeRes.PATH_META="meta.xml"
class ItemTypeFolder extends ItemType{constructor(wspMeta,datas){super(wspMeta,datas)
this.reg.addToList("actions:item:burger","import",1,ImportFolder.SINGLETON(),100)}getSrcMainArea(ctx){return defaultItemMainAreaFolder}getMainStreamSrcUri(shortDesc){if(shortDesc&&ITEM.getUriResType(shortDesc)===ITEM.EUriResType.file)return shortDesc.srcUri
return null}getMainXmlSrcUri(shortDesc){return null}async getNewContent(reg,space,codeItem,options){return{name:codeItem,entries:[]}}getIcon(shortDesc){if(shortDesc)switch(ITEM.getUriResType(shortDesc)){case ITEM.EUriResType.folder:return this.datas.iconResFolder||this.wspMeta.getDefaultResFolderIcon()
case ITEM.EUriResType.file:return this.datas.iconResFile||this.wspMeta.getDefaultResFileIcon()}return super.getIcon(shortDesc)}getIconOpen(shortDesc){if(shortDesc)switch(ITEM.getUriResType(shortDesc)){case ITEM.EUriResType.folder:return this.datas.iconResFolderOpen||this.wspMeta.getDefaultResFolderOpenIcon()
case ITEM.EUriResType.file:return this.datas.iconResFile||this.wspMeta.getDefaultResFileIcon()}return super.getIconOpen(shortDesc)}matchType(type,fileName){if(type)return-1
if(!fileName)return 0
if(!this.datas.itemExt)return 2
if(typeof this.datas.itemExt==="string")return fileName.endsWith(this.datas.itemExt)?100:-1
return this.datas.itemExt.find(ext=>fileName.endsWith(ext))?100:-1}}export class ItemTypeTask extends ItemType{getSrcMainArea(ctx){return defaultTaskMainArea}getCommentSchema(){if(!this.datas.commentSchema)return getGenericSchema()
if(!this._commentSchema)this._commentSchema=getSchema(this.datas.wspResUrl.resolve(this.datas.commentSchema))
return this._commentSchema}getDesriptionSchema(){if(!this.datas.descriptionSchema)return getGenericSchema()
if(!this._descriptionSchema)this._descriptionSchema=getSchema(this.datas.wspResUrl.resolve(this.datas.descriptionSchema))
return this._descriptionSchema}getLcName(){return this.datas.lcName||LC_DEFAULT_NAME}getLcStates(){this.buildLcStates()
return this._lcStates}getLcState(code){this.buildLcStates()
return this._lcStates.get(code)}getLcStateOrUnknown(code){this.buildLcStates()
return this._lcStates.get(code)||this._lcStates.get("?")}getLcTransitions(){this.buildLcTrans()
return this._lcTrans}getLcTransition(code){this.buildLcTrans()
return this._lcTrans.get(code)}getLcTransitionsGroupOrder(){this.buildLcStates()
return this._lcTrans?this.datas.lcTransGroupOrder||"*":null}getCreateTransitions(){this.buildCreateTrans()
return this._createTrans}getTaskInitStates(ctx){const r={}
const acts=this.datas.onCreate
if(acts)for(const act of acts){if("addUserToResp"in act){if(ctx.reg.env.universe.auth.currentAuthenticatedUser){if(!r.resps)r.resps={}
r.resps[act.addUserToResp]=[ctx.reg.env.universe.auth.currentAccount]}}else if("detailsTpl"in act){if(ctx.shortDescs.length>0){r.desc=act.detailsTpl.replace("${currentItemUri}",SRC.srcRef(ctx.shortDescs[0]))}}else if(typeof act==="function"){act(ctx,this,r)}}return r}buildLcStates(){if(!this._lcStates){this._lcStates=new Map
for(const st of this.datas.lcStates){if(st.icon)st.iconUrl=this.datas.wspResUrl.resolve(st.icon).url
this._lcStates.set(st.code,st)}}}buildLcTrans(){if(!this._lcTrans){this._lcTrans=new Map
for(const trans of this.datas.lcTrans){if(trans.icon)trans.iconUrl=this.datas.wspResUrl.resolve(trans.icon).url
this._lcTrans.set(trans.code,trans)}}}buildCreateTrans(){if(!this._createTrans){this._createTrans=[]
for(const trans of this.datas.createTrans){if(trans.icon)trans.iconUrl=this.datas.wspResUrl.resolve(trans.icon).url
this._createTrans.push(trans)}}}hasFeature(feature){var _a
return((_a=this.datas.features)===null||_a===void 0?void 0:_a.indexOf(feature))>-1}}class ItemTypeOther extends ItemType{constructor(wspMeta,datas){super(wspMeta,datas)
this.reg.addToList("actions:item:burger","download",1,ExportRes.SINGLETON(),101)}async getNewContent(reg,space,codeItem,options){return this.datas.resTypes?"":{name:codeItem,entries:[]}}getSrcMainArea(ctx){var _a
return((_a=ctx.shortDesc)===null||_a===void 0?void 0:_a.srcSt)===ESrcSt.folder?defaultItemMainAreaFolder:defaultItemMainAreaRes}getMainStreamSrcUri(shortDesc){if(!shortDesc)return null
if(ITEM.getUriResType(shortDesc)===ITEM.EUriResType.root&&shortDesc.srcSt===ESrcSt.folder){return SRC.addLeafToUri(shortDesc.srcUri,SRC.extractLeafFromUri(shortDesc.srcUri))}return shortDesc.srcUri}getMainXmlSrcUri(shortDesc){if(!shortDesc)return null
if(ITEM.getUriResType(shortDesc)===ITEM.EUriResType.root&&shortDesc.srcSt===ESrcSt.folder){return SRC.addLeafToUri(shortDesc.srcUri,ItemTypeRes.PATH_META)}return shortDesc.srcUri}}class ItemTypeUndef extends ItemTypeOther{matchType(type,fileName){if(!this.datas.resTypes)return 1
if(!type&&!fileName)return 0
let matchExt=this.matchExt(fileName)
if(matchExt!=0)return matchExt
for(const resType of this.datas.resTypes){if(resType.ct)for(const t of resType.ct)if(t===type)return 1}return-1}matchExt(fileName){if(!fileName)return 0
const exts=this.getExtensions()
if(exts==null)return 1
if(Array.isArray(exts))return exts.find(entry=>SRC.matchExt(fileName,entry))?1:-1
return SRC.matchExt(fileName,exts)?1:-1}}class ItemTypeNull extends ItemType{constructor(wspType){super(wspType,{wspResUrl:wspType.wspTypeUrl,model:"sc_null",title:"Item non renseigné",iconsPng:wspType.chain.config.skinUrl.url+"wsp/itemType/icons/itemNull/"})}getIcon(shortDesc){return super.getIcon(null)}getIconOpen(shortDesc){return super.getIconOpen(null)}}class ItemTypeNotFound extends ItemType{constructor(wspType){super(wspType,{wspResUrl:wspType.wspTypeUrl,model:"sc_notFound",title:"Item non trouvé",iconsPng:wspType.chain.config.skinUrl.url+"wsp/itemType/icons/itemNotFound/"})}getIcon(shortDesc){return super.getIcon(null)}getIconOpen(shortDesc){return super.getIconOpen(null)}}class ItemTypeFallback extends ItemTypeOther{constructor(wspType){super(wspType,{wspResUrl:wspType.wspTypeUrl,model:"sc_undef",title:"Item non reconnu"})}getIcon(shortDesc){if(shortDesc)switch(ITEM.getUriResType(shortDesc)){case ITEM.EUriResType.folder:return this.datas.iconResFolder||this.wspMeta.getDefaultResFolderIcon()
case ITEM.EUriResType.file:return this.datas.iconResFile||this.wspMeta.getDefaultResFileIcon()
default:if(shortDesc.srcSt===ESrcSt.folder)return this.wspMeta.chain.config.skinUrl.url+"wsp/itemType/icons/itemUndefFolder/icovalid.png"}return this.wspMeta.chain.config.skinUrl.url+"wsp/itemType/icons/itemUndef/icovalid.png"}getIconOpen(shortDesc){if(shortDesc)switch(ITEM.getUriResType(shortDesc)){case ITEM.EUriResType.folder:return this.datas.iconResFolderOpen||this.wspMeta.getDefaultResFolderOpenIcon()
case ITEM.EUriResType.file:return this.datas.iconResFile||this.wspMeta.getDefaultResFileIcon()}return this.wspMeta.chain.config.skinUrl.url+"wsp/itemType/icons/itemUndefFolderOpen/icovalid.png"}}export const UTILS={LIT:htmlLit,xhtml:xhtml,generators:generators,actions:actions,loadFreeLib:loadFreeLib}
export var ETaskFeatures;(function(ETaskFeatures){ETaskFeatures["deadline"]="deadline"
ETaskFeatures["scheduling"]="scheduling"})(ETaskFeatures||(ETaskFeatures={}))
export const LC_STATE_DEFAULT_KEY="#default"
export const LC_STATE_DEFAULT_NAME="Non défini"
export const LC_DEFAULT_NAME="Cycle de vie"
export async function loadFreeLib(lib,reg){return lib.importJs().then(async module=>{if(module.initFreeLib&&!module.initFreeLib.called){await module.initFreeLib(reg)
module.initFreeLib.called=true}return module})}export function isDirItemType(d){return d&&Array.isArray(d.children)}export class SrcMainArea extends Area{constructor(tagName,titleAsLabel){super(tagName)
this.tagName=tagName
this.titleAsLabel=titleAsLabel}getLabel(ctx){if(typeof this._label==="function")return this._label(ctx,this)
return this.titleAsLabel?ctx.shortDesc.itTi||SRC.extractLeafFromUri(ctx.shortDesc.srcUri):SRC.extractLeafFromUri(ctx.shortDesc.srcUri)}getIcon(ctx){if(typeof this._icon==="function")return this._icon(ctx,this)
return ctx.reg.env.itemType.getIcon(ctx.shortDesc)}buildBody(ctx,lastDatas){return document.createElement(this.tagName).initialize({reg:ctx.reg,area:this,areaContext:ctx,skin:this.skinMainView,skinOver:this.skinOverMainView,lastDatasKey:this.getLastDatasKey(ctx),lastDatas:lastDatas})}}let genRng
function getGenericSchema(){if(!genRng)genRng=getSchema(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/generic.rng"))
return genRng}async function getSchema(ep){if(!SKMETALIB){const mdWsp=import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/wed/schemaMetaWsp.js")
const mdSk=import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaBuilder.js")
SKMETALIB=(await mdWsp).SKMETALIB_WSP
SchemaBuilder=(await mdSk).RelaxNgSchemaBuilder}return new SchemaBuilder(SKMETALIB).buildRelaxNgFromUrl(ep)}let SKMETALIB
let SchemaBuilder
function hasTasks(types){var _a
for(const md in types){if(((_a=types[md])===null||_a===void 0?void 0:_a.family)===EItemTypeFamily.task)return true}return false}function hasResps(types){var _a
for(const md in types){const resps=(_a=types[md])===null||_a===void 0?void 0:_a.resps
if(resps&&resps.length)return true}return false}class ItemMainConvert extends actions.Action{constructor(dataConvertor){super()
this.dataConvertor=dataConvertor
this._label=dataConvertor.label
this.requireVisiblePerm(dataConvertor.perm)}async execute(ctx,ev){const mod=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemMain.js")
const exec=this.dataConvertor.executor
if(this.dataConvertor.controlBeforeExecute&&!await this.dataConvertor.controlBeforeExecute(ctx,ev))return
switch(exec.algo){case"switch":return mod.convertBySwitchTag(ctx,exec)
case"xsl":return mod.convertByXsl(ctx,exec)}}}const defaultItemMainAreaXml=new SrcMainArea("wsp-itemmain-xml")
const defaultItemMainAreaRes=new SrcMainArea("wsp-itemmain-res")
const defaultItemMainAreaFolder=new SrcMainArea("wsp-itemmain-folder")
const defaultTaskMainArea=new SrcMainArea("wsp-taskmain").setLabel(ctx=>ctx.shortDesc.actTi||ctx.reg.env.itemType.getTitle())

//# sourceMappingURL=wspMetaUi.js.map