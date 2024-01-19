import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{CDM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/cdm.js"
import{ESrcSt,SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{WSP,Wsp}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{EWspChangesEvts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{EItemTypeFamily}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js"
import{getFilesOnDrop}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/files.js"
export var EItStatus;(function(EItStatus){EItStatus[EItStatus["null"]=-1]="null"
EItStatus[EItStatus["conflict"]=-2]="conflict"
EItStatus[EItStatus["unknown"]=-99]="unknown"
EItStatus[EItStatus["ok"]=1]="ok"
EItStatus[EItStatus["warnings"]=2]="warnings"
EItStatus[EItStatus["errors"]=3]="errors"})(EItStatus||(EItStatus={}))
export var EItResp;(function(EItResp){EItResp[EItResp["undefined"]=-1]="undefined"
EItResp[EItResp["ok"]=1]="ok"
EItResp[EItResp["errors"]=3]="errors"})(EItResp||(EItResp={}))
REG.reg.setPref("groupOrder.wsp.shortDesc",1,"open clipboard ptrEdit localEdit ins edit clone tools * importExport")
export class InfoFocusItem{constructor(srcRef,shortDesc,lastDatas){this.srcRef=srcRef
this.shortDesc=shortDesc
this.lastDatas=lastDatas}}export class InfoSelectUris{constructor(srcUris){this.srcUris=srcUris}}export class InfoFocusNodeInItem extends InfoFocusItem{constructor(xpath,srcRef,shortDesc,lastDatas){super(srcRef,shortDesc,lastDatas)
this.xpath=xpath}}export class InfoOpenItems{constructor(srcRefs,srcRef){this.srcRefs=srcRefs
this.srcRef=srcRef}}export class InfoRefreshItemDisplays{constructor(srcRef){this.srcRef=srcRef}}export class InfoCurrentItem{constructor(srcUri,shortDesc){this.srcUri=srcUri
this.shortDesc=shortDesc}}export class InfoReqCurrentItem{}export class InfoHighlighItemSgn{constructor(sgnPattern,assigned){this.sgnPattern=sgnPattern
if(assigned)this.assigned=assigned}}export class InfoSrcUriMoved{constructor(oldSrcUri,newSrcUri){this.oldSrcUri=oldSrcUri
this.newSrcUri=newSrcUri}}export function isJShortDescsTransfer(s){return s&&s.sdTrsfId}export function isShortDescsTransfer(s){return s&&s.shortDescs&&isJShortDescsTransfer(s)}class ShortDescsExternal{constructor(reg,uiCtx,fromDrag){this.reg=reg
this.uiCtx=uiCtx
this.fromDrag=fromDrag
this.shortDescs=[]}get sdTrsfId(){return"external"}get server(){return null}get wspCd(){return null}get srcRefs(){return null}get isImport(){return true}}class ShortDescsFromFile extends ShortDescsExternal{async extractDatasNow(data){if(!this._files){if(this.fromDrag){this._files=await getFilesOnDrop(data)}else{this._files=Array.from(data.files)}}}rejectSgnMatch(patternItemSgn){for(let i=0;i<this.shortDescs.length;i++){const sd=this.shortDescs[i]
if(!sd.itemType||patternItemSgn.test(sd.itemType.getSgn()))return false}return true}}class ShortDescToImportFromFile{constructor(transferInfos,itemType,indexItem){this.transferInfos=transferInfos
this.itemType=itemType
this.indexItem=indexItem
transferInfos.shortDescs.push(this)}get itSgn(){var _a
return(_a=this.itemType)===null||_a===void 0?void 0:_a.getSgn()}get itModel(){var _a
return(_a=this.itemType)===null||_a===void 0?void 0:_a.getModel()}async createSrc(options){const svc=this.transferInfos.reg.getSvc("wspImportInWsp")
if(!svc)return null
if(!this.transferInfos._importDone)this.transferInfos._importDone=new Set
else if(this.transferInfos._importDone.has(this.indexItem))return null
this.transferInfos._importDone.add(this.indexItem)
const file=this.transferInfos._files?this.transferInfos._files[this.indexItem]:null
if(!file)return null
return svc.importSrc(file,options,this.transferInfos.reg,this.transferInfos.uiCtx)}}export class ShortDescsFromUrlList extends ShortDescsExternal{constructor(){super(...arguments)
this._extractDone=false}get isImportUrls(){return true}async extractDatasNow(data){if(!this._extractDone){this._extractDone=true
const svc=this.reg.getSvc("wspImportFromUrl")
if(svc)this.shortDescs=await svc.extractShortDescs(data,this.reg,this.uiCtx)}if(this.shortDescs.length===0)return"stop"}rejectSgnMatch(patternItemSgn){const svc=this.reg.getSvc("wspImportFromUrl")
if(svc==null)return true
if(this._extractDone){return false}else{return svc.rejectSgnMatch(patternItemSgn,this.reg)}}}export class FolderEntries{constructor(wsp,uiContext){this.wsp=wsp
this.uiContext=uiContext
this.children=new Set}setFolderUri(folderUri){this.folderUri=folderUri
this.loading=WSP.fetchSrcTree(this.wsp,this.uiContext,folderUri,1,["srcNm"]).then(tree=>{this.children=tree.ch?new Set(tree.ch.map(e=>e.srcNm)):new Set
this.loading=null
return this},()=>{this.children=null
this.loading=null
return this})
return this.loading}async getChildState(childName){return this.loading?this.loading.then(()=>this.getChildStateNow(childName)):this.getChildStateNow(childName)}getChildStateNow(childName){var _a
if((_a=this.children)===null||_a===void 0?void 0:_a.has(childName))return"used"
return"free"}}export class SrcRenderer{getIcon(src,wspMetaUi,open){if(src.itModel!=null){const itemType=wspMetaUi.getItemType(src.itModel)
return open?itemType.getIconOpen(src):itemType.getIcon(src)}return open?wspMetaUi.getSpaceOpenIcon(src):wspMetaUi.getSpaceIcon(src)}getMainName(src,wspMetaUi){if(src.itModel!=null){const itemType=wspMetaUi.getItemType(src.itModel)
if(itemType.getFamily()===EItemTypeFamily.task)return src.actTi||itemType.getTitle(src)
if(src.itSubItem)return SRC.extractLeafFromUri(src.srcUri)+" ⤷ "+ITEM.getSubRefTitle(src)
else return SRC.extractLeafFromUri(src.srcUri)}if(src.srcUri){if(src.srcUri==="/~air")return"[Items flottants]"
if(src.srcUri==="/~ext")return"[Items étrangers]"
return SRC.extractLeafFromUri(src.srcUri)}return src.srcUri==null?"[Non trouvé]":"[Racine de l\'atelier]"}getSecondName(src,wspMetaUi){if(src.itModel!=null){const itemType=wspMetaUi.getItemType(src.itModel)
if(itemType.getFamily()===EItemTypeFamily.task)return src.actTi?itemType.getTitle(src):null}return ITEM.getTitle(src)}}export var ITEM;(function(ITEM){ITEM.KEY_SrcRenderer="SrcRenderer"
ITEM.GEN_SKIN_BY_URI_PREFIX="skinUri:"
function srcRefSub(item){return item.itSubItem?`${item.srcId||item.srcUri}#${item.itSubItem.id}`:item.srcId||item.srcUri}ITEM.srcRefSub=srcRefSub
function getTitle(src){if(src.itSubItem){const subTi=src.itSubItem.ti||src.itSubItem.id
return subTi?`${src.itTi||""} ⤷${subTi}`:src.itTi||""}return src.itTi||src.actTi||""}ITEM.getTitle=getTitle
function getSubRefTitle(src){return src.itSubItem?src.itSubItem.ti:""}ITEM.getSubRefTitle=getSubRefTitle
function getSrcMainName(reg,src,wspMetaUi){return reg.getSvc(ITEM.KEY_SrcRenderer).getMainName(src,wspMetaUi)}ITEM.getSrcMainName=getSrcMainName
function getSrcSecondName(reg,src,wspMetaUi){return reg.getSvc(ITEM.KEY_SrcRenderer).getSecondName(src,wspMetaUi)}ITEM.getSrcSecondName=getSrcSecondName
function getSrcIcon(reg,src,wspMetaUi,open){return reg.getSvc(ITEM.KEY_SrcRenderer).getIcon(src,wspMetaUi,open)}ITEM.getSrcIcon=getSrcIcon
function getSrcUriType(srcUri){const point=srcUri.indexOf(".")
if(point<0)return"space"
const subSlash=srcUri.indexOf("/",point)
return subSlash>=0&&srcUri.length>subSlash+1?"res":"item"}ITEM.getSrcUriType=getSrcUriType
let EUriResType;(function(EUriResType){EUriResType[EUriResType["root"]=0]="root"
EUriResType[EUriResType["folder"]=1]="folder"
EUriResType[EUriResType["file"]=2]="file"})(EUriResType=ITEM.EUriResType||(ITEM.EUriResType={}))
function getUriResType(shortDesc){const srcUri=shortDesc.srcUri
const offsetPoint=srcUri.indexOf(".")
if(offsetPoint<0)return null
const offsetSubRes=srcUri.indexOf("/",offsetPoint+1)
if(offsetSubRes<0)return EUriResType.root
switch(shortDesc.srcSt){case ESrcSt.file:return EUriResType.file
case ESrcSt.folder:return EUriResType.folder
default:return srcUri.lastIndexOf("/")<srcUri.lastIndexOf(".")?EUriResType.file:EUriResType.folder}}ITEM.getUriResType=getUriResType
function extractSpaceLabel(srcUri,ifRootOrSpecial="[Racine de l\'atelier]"){if(!srcUri||isAirItem(srcUri)||isExtItem(srcUri))return ifRootOrSpecial
const idx=srcUri.indexOf(".")
if(idx<0)return srcUri.substring(1)
const idx2=srcUri.lastIndexOf("/",idx)
return idx2>0?srcUri.substring(1,idx2):ifRootOrSpecial}ITEM.extractSpaceLabel=extractSpaceLabel
function extractSrcLabel(srcUri,ifRoot){if(!srcUri)return ifRoot
if(isAirItem(srcUri)||isExtItem(srcUri)){return srcUri.substring(srcUri.lastIndexOf("/",srcUri.indexOf("."))+1)}return srcUri.substring(1)||ifRoot}ITEM.extractSrcLabel=extractSrcLabel
function getItemUriLabel(srcUri,shortDesc){if(!srcUri)return"/"
if(isSpecialUri(srcUri)){if(isAirItem(srcUri))return extractItemCode(srcUri)+" (item flottant)"
if(isExtItem(srcUri))return extractItemCode(srcUri)+" (item étranger)"
if(isTrashUri(srcUri))return extractItemCode(srcUri)+" (en corbeille)"
if(isHistoryUri(srcUri))return extractItemCode(srcUri)+" (historique)"}if(shortDesc&&shortDesc.itSubItem)return srcUri+"⚓"+shortDesc.itSubItem.id
else return srcUri}ITEM.getItemUriLabel=getItemUriLabel
function extractSpaceUri(srcUri){if(!srcUri||isAirItem(srcUri)||isExtItem(srcUri)||isAnnot(srcUri))return""
const idx=srcUri.indexOf(".")
if(idx<0)return srcUri
const idx2=srcUri.lastIndexOf("/",idx)
return idx2>0?srcUri.substring(0,idx2):""}ITEM.extractSpaceUri=extractSpaceUri
function extractItemUri(srcUri){const idx=srcUri.indexOf(".")
if(idx<0)return null
const idx2=srcUri.indexOf("/",idx+1)
return idx2>0?srcUri.substring(0,idx2):srcUri}ITEM.extractItemUri=extractItemUri
function extractItemCode(srcUri){const idx=srcUri.indexOf(".")
if(idx<0)return null
const idx0=srcUri.lastIndexOf("/",idx)+1
const idx2=srcUri.indexOf("/",idx+1)
return idx2>0?srcUri.substring(idx0,idx2):srcUri.substring(idx0)}ITEM.extractItemCode=extractItemCode
function extractItemResPath(srcUri){const idx=srcUri.indexOf(".")
if(idx<0)return null
const idx2=srcUri.indexOf("/",idx+1)
return idx2>0?srcUri.substring(idx2+1):null}ITEM.extractItemResPath=extractItemResPath
function isValidCodeItem(name,fromForNotif){let r=SRC.isValidPartUri(name,fromForNotif)
if(r===true){if(name.indexOf(".")<0)r="Un code d\'item doit contenir une extension séparée par un \'.\'."
if(fromForNotif&&r!==true)POPUP.showNotifWarning(r,fromForNotif)}return r}ITEM.isValidCodeItem=isValidCodeItem
function isValidCode(type,name,fromForNotif){switch(type){case"item":return ITEM.isValidCodeItem(name,fromForNotif)
case"space":return ITEM.isValidCodeSpace(name,fromForNotif)}return SRC.isValidPartUri(name,fromForNotif)}ITEM.isValidCode=isValidCode
function isValidCodeSpace(name,fromForNotif){let r=SRC.isValidPartUri(name,fromForNotif)
if(r===true){if(name.indexOf(".")>=0)r="Un code d\'espace ne doit pas contenir de \'.\'."
if(fromForNotif&&r!==true)POPUP.showNotifWarning(r,fromForNotif)}return r}ITEM.isValidCodeSpace=isValidCodeSpace
function isSrcRefSub(srcRef){return srcRef&&srcRef.indexOf("#")>=0}ITEM.isSrcRefSub=isSrcRefSub
function makeSrcRefSub(srcRef,subItemId){if(!srcRef)return
return srcRef+(subItemId?"#"+subItemId:"")}ITEM.makeSrcRefSub=makeSrcRefSub
function extractSubItemId(srcRef){const i=srcRef===null||srcRef===void 0?void 0:srcRef.indexOf("#")
return i>=0?srcRef.substring(i+1):null}ITEM.extractSubItemId=extractSubItemId
function extractSrcRef(srcRefSub,knownSubItemId){const i=knownSubItemId?srcRefSub.length-knownSubItemId.length-1:srcRefSub===null||srcRefSub===void 0?void 0:srcRefSub.indexOf("#")
return i>=0?srcRefSub.substring(0,i):srcRefSub}ITEM.extractSrcRef=extractSrcRef
function isSameSrcRef(srcRef,srcRefSub){if(!srcRef||!srcRefSub)return false
if(srcRefSub.length>srcRef.length){return srcRefSub.charCodeAt(srcRef.length)===35&&srcRefSub.startsWith(srcRef)}return srcRef===srcRefSub}ITEM.isSameSrcRef=isSameSrcRef
function findSubItem(sid,subItems){if(!sid||!subItems)return undefined
function find(list){if(list)for(const subItem of list){if(subItem.id===sid)return subItem
const ss=find(subItem.subItems)
if(ss)return ss}return undefined}return find(subItems)}ITEM.findSubItem=findSubItem
function findSubItemStack(sid,subItems){if(!sid||!subItems)return undefined
const stack=[]
function find(list){if(list)for(const subItem of list){if(subItem.id===sid){stack.push(subItem)
return true}if(subItem.subItems){stack.push(subItem)
if(find(subItem.subItems))return true
stack.pop()}}return false}return find(subItems)?stack:undefined}ITEM.findSubItemStack=findSubItemStack
function srcRefInContext(ident){if(isHistoryOrTrashUri(ident.srcUri))return ident.srcUri
return ident.srcId||ident.srcUri}ITEM.srcRefInContext=srcRefInContext
function isSpecialUri(srcUri){return srcUri&&(srcUri.startsWith("/~")||srcUri.indexOf(":"))!=-1}ITEM.isSpecialUri=isSpecialUri
ITEM.AIR_PREFIX="/~air/"
function isAirItem(srcUri){return srcUri&&srcUri.startsWith(ITEM.AIR_PREFIX)}ITEM.isAirItem=isAirItem
ITEM.EXT_PREFIX="/~ext/"
function isExtItem(srcUri){return srcUri&&srcUri.startsWith(ITEM.EXT_PREFIX)}ITEM.isExtItem=isExtItem
ITEM.TRANSIENT_PREFIX="/~transient/"
function buildTansientUri(fromWspCode,srcUri){return ITEM.TRANSIENT_PREFIX+fromWspCode+srcUri}ITEM.buildTansientUri=buildTansientUri
ITEM.ANNOT_PREFIX="/~annot/"
function isAnnot(srcUri){return srcUri&&srcUri.startsWith(ITEM.ANNOT_PREFIX)}ITEM.isAnnot=isAnnot
ITEM.HISTOY_PREFIX="/~history/"
function isHistoryUri(srcUri){return srcUri&&srcUri.startsWith(ITEM.HISTOY_PREFIX)}ITEM.isHistoryUri=isHistoryUri
ITEM.TRASH_PREFIX="/~history~trash/"
function isTrashUri(srcUri){return srcUri&&srcUri.startsWith(ITEM.TRASH_PREFIX)}ITEM.isTrashUri=isTrashUri
function isHistoryOrTrashUri(srcUri){return srcUri&&srcUri.startsWith("/~history")}ITEM.isHistoryOrTrashUri=isHistoryOrTrashUri
function isSrcUriInConflict(srcUri){return srcUri.indexOf("~conflict.")>=0}ITEM.isSrcUriInConflict=isSrcUriInConflict
async function fetchDom(wsp,uiContext,srcRef,noneIfTrashed){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const params=["cdaction","GetSrc","format","stream","param",wsp.code,"refUri",srcRef,"204",""]
if(noneIfTrashed)params.push("srcTrashed","false")
return wsp.wspServer.config.wspSrcUrl.fetchDom(IO.qs(...params))}ITEM.fetchDom=fetchDom
async function fetchContent(wsp,uiContext,srcRef,noneIfTrashed,fields){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const params=["param",wsp.code,"refUri",srcRef,"format","stream","204","","fields",Array.isArray(fields)?fields.join("*"):fields]
if(noneIfTrashed)params.push("srcTrashed","false")
return wsp.wspServer.config.wspSrcUrl.fetch(IO.qs(...params))}ITEM.fetchContent=fetchContent
async function fetchSrcNetJson(wsp,uiContext,refUri,fields,dir,mergeLinks,linksAllowed,itemTargeted,maxDepth,maxTracks,fieldsFrom,granularityFrom){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
if(dir==="asc"&&wsp.infoWsp.allItemsLoaded!=="ok")await wsp.forceAllItemsLoaded(uiContext)
return wsp.wspServer.config.wspSrcUrl.fetchJson(IO.qs("param",wsp.code,"refUri",refUri,"fields",Array.isArray(fields)?fields.join("*"):fields,"format","itemNetJson","dir",dir,"mergeLinks",mergeLinks,"granularity","subItem","linksAllowed",linksAllowed,"itemTargeted",itemTargeted,"maxDepth",maxDepth,"maxTracks",maxTracks,"fieldsFrom",Array.isArray(fieldsFrom)?fieldsFrom.join("*"):fieldsFrom||undefined,"granularityFrom",granularityFrom))}ITEM.fetchSrcNetJson=fetchSrcNetJson
async function createItem(wsp,fromPlace,uiContext,body,srcUri){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const created=await wsp.wspServer.config.wspSrcUrl.fetchJson(IO.qs("cdaction","PutSrc","param",wsp.code,"refUri",srcUri,"clId",wsp.wspServer.chain.clId,"asFolder",body!=null?null:"true","fields",wsp.getShortDescDef()),{method:"PUT",body:body})
wsp.wspServer.wspsLive.dispatchLocalChange(fromPlace,wsp,created,EWspChangesEvts.u,created)
return created}ITEM.createItem=createItem
async function createAirItem(wsp,fromPlace,uiContext,body,inFields){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const created=await wsp.wspServer.config.wspSrcUrl.fetchJson(IO.qs("cdaction","CreateAirItem","param",wsp.code,"clId",wsp.wspServer.chain.clId,"options",CDM.stringify(inFields),"asFolder",body?null:"true","fields",wsp.getShortDescDef()),body?{method:"PUT",body:body}:{method:"POST"})
wsp.wspServer.wspsLive.dispatchLocalChange(fromPlace,wsp,created,EWspChangesEvts.u,created)
return created}ITEM.createAirItem=createAirItem
async function createVersion(wsp,uiContext,refUri,comment){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
await wsp.wspServer.config.versionUrl.fetchVoid(IO.qs("cdaction","Create","param",wsp.code,"refUri",refUri,"comment",comment),{method:"PUT"})
const respJson=await wsp.wspServer.config.versionUrl.fetchJson(IO.qs("param",wsp.code,"refUri",refUri,"fields","srcId*srcUri"))
const id=respJson.vers[0].srcId
const srcUriVers=respJson.vers[0].srcUri
return{wsp:new Wsp(wsp.wspServer,SRC.extractIdFromSrcId(id)),srcUri:srcUriVers,srcId:id}}ITEM.createVersion=createVersion
async function update(wsp,uiContext,refUri,content,progress,fields){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const qs=IO.qs("cdaction","PutSrc","param",wsp.code,"refUri",refUri,"asFolder",content==null?"true":undefined,"fields",Array.isArray(fields)?fields.join("*"):fields||"srcUri")
if(progress){return new Promise((resolved,rejected)=>{const xhr=new XMLHttpRequest
xhr.upload.addEventListener("progress",ev=>{progress(ev.loaded,ev.lengthComputable?ev.total:undefined)})
xhr.open("PUT",wsp.wspServer.config.wspSrcUrl.url+qs)
xhr.onload=ev=>{let r
try{r=JSON.parse(xhr.responseText)}catch(e){rejected(e)}resolved(r)}
xhr.onerror=rejected
xhr.send(content)})}return wsp.wspServer.config.wspSrcUrl.fetchJson(qs,{method:"PUT",body:content})}ITEM.update=update
async function importScar(wsp,uiContext,refUri,content,replaceIfExist,progress){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const qs=IO.qs("cdaction","Import","replaceIfExist",replaceIfExist,"wspTarget",wsp.code,"refUriTarget",refUri)
if(progress){return new Promise((resolved,rejected)=>{const xhr=new XMLHttpRequest
xhr.upload.addEventListener("progress",ev=>{progress(ev.loaded,ev.lengthComputable?ev.total:undefined)})
xhr.open("PUT",wsp.wspServer.config.importUrl.url+qs)
xhr.onload=ev=>resolved({status:xhr.status,asText:xhr.responseText})
xhr.onerror=ev=>resolved({status:xhr.status,error:new Error(xhr.statusText)})
xhr.send(content)})}return wsp.wspServer.config.importUrl.fetch(qs,"text",{method:"PUT",body:content})}ITEM.importScar=importScar
async function fetchSrcHistory(wsp,uiContext,refUriLive,fields){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
return wsp.wspServer.config.historyUrl.fetchJson(IO.qs("cdaction","ListHistoryNodes","param",wsp.code,"refUriLive",refUriLive,"fields",fields.join("*")))}ITEM.fetchSrcHistory=fetchSrcHistory
async function fetchUpdateRespByUser(wsp,uiContext,refUris,account,addResps,remResps){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const path=encodeURIComponent(wsp.code)+"/responsibilities"+IO.qs("cdaction","UpdateResp","user",account,"addResp",addResps.join(" "),"remResp",remResps.join(" "))
return wsp.wspServer.config.wspSvcUrl.fetchVoid(path,{method:"PUT",body:IO.fd("refUris",refUris.join("\t"))})}ITEM.fetchUpdateRespByUser=fetchUpdateRespByUser
async function fetchUpdateRespByRespMulti(wsp,uiContext,refUris,resp,addUsers,remUsers){const path=encodeURIComponent(wsp.code)+"/responsibilities"+IO.qs("cdaction","UpdateResp","resp",resp,"addUser",addUsers===null||addUsers===void 0?void 0:addUsers.join(" "),"remUser",remUsers===null||remUsers===void 0?void 0:remUsers.join(" "))
return wsp.wspServer.config.wspSvcUrl.fetchVoid(path,{method:"PUT",body:IO.fd("refUris",refUris.join("\t"))})}ITEM.fetchUpdateRespByRespMulti=fetchUpdateRespByRespMulti
async function fetchUpdateRespByRespSingle(wsp,uiContext,refUris,resp,singleUser){const path=encodeURIComponent(wsp.code)+"/responsibilities"+IO.qs("cdaction","UpdateResp","resp",resp,"singleUser",singleUser)
return wsp.wspServer.config.wspSvcUrl.fetchVoid(path,{method:"PUT",body:IO.fd("refUris",refUris.join("\t"))})}ITEM.fetchUpdateRespByRespSingle=fetchUpdateRespByRespSingle
async function execItemTransition(wsp,uiContext,transition,itemIdents,paramsTransition){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
await wsp.wspServer.wspsLive.saveItems(wsp.code,itemIdents)
const path=`${encodeURIComponent(wsp.code)}/lifeCycle/ExecTransition?codeTransition=${encodeURIComponent(transition)}`
return wsp.wspServer.config.wspSvcUrl.fetch(path,null,{method:"POST",body:IO.fd("refUris",itemIdents.map(SRC.srcRef).join("\t"),"paramsTransition",paramsTransition?JSON.stringify(paramsTransition):null)})}ITEM.execItemTransition=execItemTransition
async function fetchGenInfo(wsp,uiContext,srcRef,codeGenStack,addExtraInfos,customFullUriDest){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
let qs=IO.qs("cdaction","GetGenInfo","format","json","param",wsp.code,"refUri",srcRef,"codeGenStack",codeGenStack,"addExtraInfos",addExtraInfos?"":null)
if(customFullUriDest)qs+=IO.query(false,"customFullUriDest",customFullUriDest)
return wsp.wspServer.config.wspGenUrl.fetchJson(qs)}ITEM.fetchGenInfo=fetchGenInfo
function getGenSkinIllusUrl(wsp,genNode,skin){const idx=genNode.codeGenStack.lastIndexOf("_")
const cdGen=idx<0?genNode.codeGenStack:genNode.codeGenStack.substring(idx+1)
return WSP.skinSetsIconUrl(wsp,skin.code,genNode.genSkinClass)}ITEM.getGenSkinIllusUrl=getGenSkinIllusUrl
async function generate(wsp,uiContext,srcRef,codeGenStack,props,customFullUriDest){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
await wsp.wspServer.wspsLive.saveAllHouses()
let qs=IO.qs("cdaction","Generate","format","none","param",wsp.code,"refUri",srcRef,"codeGenStack",codeGenStack)
if(customFullUriDest)qs+=IO.query(false,"customFullUriDest",customFullUriDest)
if(props){return wsp.wspServer.config.wspGenUrl.fetchVoid(qs,{method:"POST",body:IO.fd("genProps",CDM.stringify(props))})}else{return wsp.wspServer.config.wspGenUrl.fetchVoid(qs)}}ITEM.generate=generate
function getGenPubUrl(wsp,uriPub){const root=wsp.wspServer.config.pubUrl.url
if(root.endsWith("/")&&uriPub.startsWith("/"))uriPub=uriPub.substring(1)
return root+encodeURI(uriPub)+"?auth"}ITEM.getGenPubUrl=getGenPubUrl
function getGenDownloadUrl(wsp,srcRef,codeGenStack,customFullUriDest){let qs=IO.qs("cdaction","Download","param",wsp.code,"refUri",srcRef,"codeGenStack",codeGenStack)
if(customFullUriDest)qs+=IO.query(false,"customFullUriDest",customFullUriDest)
return wsp.wspServer.config.wspGenUrl.url+qs}ITEM.getGenDownloadUrl=getGenDownloadUrl
async function setShortDescTransferToClipboard(ctx,liveProps){const data={sdTrsfId:"scenari:shortDescsTransfer:"+Math.floor(Math.random()*1e9).toString(36),server:ctx.reg.env.universe.config.universeUrl.url,wspCd:ctx.reg.env.wsp.code,srcRefs:[]}
const clipoardWriteAvailable=false
const txt=clipoardWriteAvailable?[]:[data.sdTrsfId,data.server,data.wspCd]
for(const sd of ctx.shortDescs){txt.push(sd.srcUri)
data.srcRefs.push(ITEM.srcRefSub(sd))}let p
if(clipoardWriteAvailable){}else{p=navigator.clipboard.writeText(txt.join("\n"))}data.wsp=ctx.reg.env.wsp
data.shortDescs=ctx.shortDescs
if(liveProps)Object.assign(data,liveProps)
shortDescDatasClipboard=data
return p}ITEM.setShortDescTransferToClipboard=setShortDescTransferToClipboard
function setShortDescTransferToDragSession(ctx,startDragEv,dragImg){const data={sdTrsfId:"scenari:shortDescsTransfer:"+Math.floor(Math.random()*1e9).toString(36),server:ctx.reg.env.universe.config.universeUrl.url,wspCd:ctx.reg.env.wsp.code,srcRefs:ctx.shortDescs.map(ITEM.srcRefSub)}
startDragEv.dataTransfer.effectAllowed="all"
startDragEv.dataTransfer.setData(MIMETYPE_SHORTDESC_ID,data.sdTrsfId)
startDragEv.dataTransfer.setData(MIMETYPE_SHORTDESC_JSON,JSON.stringify(data))
if(dragImg==="build"){const img=new Image
img.src=ctx.reg.env.universe.config.skinUrl.url+"wsp/itemType/icons/itemNull/icovalid.png"
startDragEv.dataTransfer.setDragImage(img,12,12)}data.wsp=ctx.reg.env.wsp
data.shortDescs=ctx.shortDescs
shortDescDatasDrag=data}ITEM.setShortDescTransferToDragSession=setShortDescTransferToDragSession
function resetShortDescTransferToDragSession(){shortDescDatasDrag=null}ITEM.resetShortDescTransferToDragSession=resetShortDescTransferToDragSession
function getShortDescsTransferFromDragSession(reg,dataTransfer,transferCtx,uiCtx){if(shortDescDatasDrag)return shortDescDatasDrag
return getShortDescsTransferFromExternal(reg,dataTransfer,transferCtx,uiCtx,true)}ITEM.getShortDescsTransferFromDragSession=getShortDescsTransferFromDragSession
function getShortDescsTransferFromExternal(reg,dataTransfer,transferCtx,uiCtx,fromDrag){if(!transferCtx.canCreate)return null
if(dataTransfer.types.indexOf("Files")>=0){return reg.getSvc("getShortDescsTransferFromFiles",(function(reg,dataTransfer,uiCtx,fromDrag){let result=null
const wsp=reg.env.wsp
const arr=fromDrag?dataTransfer.items:dataTransfer.files
for(let i=0;i<arr.length;i++){const type=arr[i].type
const file=arr[i]instanceof File?arr[i]:arr[i].getAsFile()
const itemTypes=wsp.wspMetaUi.getItemTypes().filter(it=>it&&(!type&&!file||it.matchType(type,file?file.name:null)>1))
if(!result)result=new ShortDescsFromFile(reg,uiCtx,fromDrag)
if(itemTypes.length>0)for(const it of itemTypes)new ShortDescToImportFromFile(result,it,i)
else new ShortDescToImportFromFile(result,null,i)}return result}))(reg,dataTransfer,uiCtx,fromDrag)}else if(dataTransfer.types.indexOf("text/uri-list")>=0){return reg.getSvc("getShortDescsTransferFromUriList",(function(reg,dataTransfer,uiCtx,fromDrag){return new ShortDescsFromUrlList(reg,uiCtx,fromDrag)}))(reg,dataTransfer,uiCtx,fromDrag)}return null}ITEM.getShortDescsTransferFromExternal=getShortDescsTransferFromExternal
async function getShortDescsTransferFromClipboard(wspContext,uiCtx){try{if(navigator.clipboard&&navigator.clipboard.read){const cbItems=await navigator.clipboard.read()
return getShortDescsTransferFromClipboardItems(cbItems,wspContext,uiCtx)}return getShortDescTransferFromText(await navigator.clipboard.readText(),wspContext,uiCtx)}catch(e){if((await navigator.permissions.query({name:"clipboard-read"})).state==="denied")return false
return null}}ITEM.getShortDescsTransferFromClipboard=getShortDescsTransferFromClipboard
async function getShortDescsTransferFromClipboardItems(cbItems,wspContext,uiCtx){if(cbItems.length!==1)return cbItems
const cbItem=cbItems[0]
if(cbItem.types.indexOf("text/plain")>=0){const blob=await cbItem.getType("text/plain")
if(blob)return getShortDescTransferFromText(await blob.text(),wspContext,uiCtx)}return cbItems}async function getShortDescsTransferFromDataTransfer(data,wspContext,uiCtx){const id=data.getData(MIMETYPE_SHORTDESC_ID)
if(id){if(shortDescDatasClipboard&&shortDescDatasClipboard.sdTrsfId===id)return shortDescDatasClipboard
const json=data.getData(MIMETYPE_SHORTDESC_JSON)
if(json){const data=JSON.parse(json)
if(!isJShortDescsTransfer(data))return null
return getShortDescsTransfer(wspContext,data.wspCd,uiCtx,data)}}if(data.types.indexOf("text/plain")>=0){return getShortDescTransferFromText(data.getData("text/plain"),wspContext,uiCtx)}return null}ITEM.getShortDescsTransferFromDataTransfer=getShortDescsTransferFromDataTransfer
async function getShortDescTransferFromText(txt,wspContext,uiCtx){if(!txt.startsWith("scenari:shortDescsTransfer:"))return null
const lines=txt.split(/[\n\r]+/)
if(lines.length>=3){if(shortDescDatasClipboard&&shortDescDatasClipboard.sdTrsfId===lines[0]&&wspContext.code===shortDescDatasClipboard.wspCd)return shortDescDatasClipboard
const server=lines[1]
const wspCd=lines[2]
if(wspContext.reg.env.universe.config.universeUrl.url!==lines[1]){return{sdTrsfId:lines[0],server:server}}const data={sdTrsfId:lines[0],server:server,wspCd:wspCd,srcRefs:lines.splice(3),wsp:null,shortDescs:null}
return getShortDescsTransfer(wspContext,wspCd,uiCtx,data)}return null}ITEM.getShortDescTransferFromText=getShortDescTransferFromText
async function getShortDescsTransfer(wspContext,wspCd,uiCtx,data){if(data.server&&wspContext.reg.env.universe.config.universeUrl.url!==data.server)return data
if(wspContext.code!==wspCd){try{const wspImportInterWsp=wspContext.reg.getSvc("wspImportInterWsp")
if(!wspImportInterWsp)return null
data.wsp=wspContext.wspServer.wspsLive.findWsp(data.wspCd,true)
if(!data.wsp.isLoaded)await data.wsp.waitForLoad()
const createSrc=async function(opts){return wspImportInterWsp.importSrc(data.wsp,this,opts,wspContext.reg,uiCtx)}
data.shortDescs=(await WSP.fetchShortDescs(data.wsp,uiCtx,...data.srcRefs)).map(src=>{src.createSrc=createSrc
return src})
data.isImport=true}catch(e){console.log(e)
return null}}else{data.wsp=wspContext
data.shortDescs=await WSP.fetchShortDescs(data.wsp,uiCtx,...data.srcRefs)}shortDescDatasClipboard=data
return data}let shortDescDatasClipboard
let shortDescDatasDrag
const MIMETYPE_SHORTDESC_JSON="application/json"
const MIMETYPE_SHORTDESC_ID="text/csv"})(ITEM||(ITEM={}))
REG.reg.registerSvc(ITEM.KEY_SrcRenderer,1,new SrcRenderer)

//# sourceMappingURL=item.js.map