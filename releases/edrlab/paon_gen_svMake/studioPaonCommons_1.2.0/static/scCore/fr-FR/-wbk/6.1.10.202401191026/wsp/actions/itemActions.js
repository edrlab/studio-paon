import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{SrcAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{EItemTypeFamily}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/actions_Perms.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{ActionMenuDep}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
export class ImportRes extends SrcAction{constructor(id){super(id||"importSrc")
this._group="importExport"
this._label="Remplacer..."
this.exactOne=true
this.families=[EItemTypeFamily.res]
this._enablePerms="action.item#import.resFile"}async execute(ctx,ev){const[shortDesc]=ctx.shortDescs
if(!shortDesc)return
const{env:env}=ctx.reg
const input=document.createElement("input")
input.type="file"
const itemType=env.wsp.wspMetaUi.getItemType(shortDesc.itModel)
const exts=itemType.getExtensions()
input.accept=Array.isArray(exts)?exts.join(","):exts
input.click()
const file=await new Promise(resolve=>{input.onchange=function(){resolve(this.files.length?this.files[0]:null)}})
if(!file)return
const progress=POPUP.showProgress(ctx.emitter,"Import en cours...")
try{await ITEM.update(env.wsp,ctx.emitter,ctx.shortDescs[0].srcUri,file,progress.progressCallback)
progress.close()}catch(e){progress.close()
await ERROR.report("Une erreur est survenue lors de l\'import de la ressource.",e,ctx)}}}ImportRes.SINGLETON=()=>ImportRes._S||(ImportRes._S=new ImportRes)
export class ImportFolder extends SrcAction{constructor(id){super(id||"importSrc")
this._group="importExport"
this._label="Importer un dossier..."
this.exactOne=true
this.families=[EItemTypeFamily.folder]}async execute(ctx,ev){const[shortDesc]=ctx.shortDescs
if(!shortDesc)return
const{env:env}=ctx.reg
const input=document.createElement("input")
input.type="file"
input.setAttribute("webkitdirectory","")
input.setAttribute("directory","")
input.click()
const files=await new Promise(resolve=>{input.onchange=function(){resolve(this.files)}})
if(!files.length)return
const progress=POPUP.showProgress(ctx.emitter,"Import en cours...")
let fileDone=0
try{await LANG.promisesMap(files,async file=>{const relPath=file.webkitRelativePath.substr(file.webkitRelativePath.indexOf("/")+1)
await ITEM.update(env.wsp,ctx.emitter,`${ctx.shortDescs[0].srcUri}/${relPath}`,file)
progress.onProgress(++fileDone,files.length+1)},4)
progress.close()}catch(e){progress.close()
await ERROR.report("Une erreur est survenue lors de l\'import du dossier.",e,ctx)}}}ImportFolder.SINGLETON=()=>ImportFolder._S||(ImportFolder._S=new ImportFolder)
export class ExportRes extends SrcAction{constructor(id){super(id||"downloadSrc")
this._group="importExport"
this._label="Exporter vers un fichier..."
this.exactOne=true
this.noFamilies=[EItemTypeFamily.folder]
this._enableSrcPerms=["read.node.export"]}async execute(ctx,ev){const[shortDesc]=ctx.shortDescs
if(!shortDesc)return
const{env:env}=ctx.reg
const link=document.createElement("a")
const itemType=env.wsp.wspMetaUi.getItemType(shortDesc.itModel)
link.href=WSP.getStreamUrl(env.wsp,itemType.getMainStreamSrcUri(shortDesc)).url
link.download=SRC.extractLeafFromUri(shortDesc.srcUri)
link.click()}}ExportRes.SINGLETON=()=>ExportRes._S||(ExportRes._S=new ExportRes)
export class ItemsSetResonsabilities extends ActionMenuDep{constructor(id){super(id||"setResonsability")
this._label="Modifier les responsabilités..."
this._group="edit"
this.setVisible(ctx=>ctx.reg.env.wsp.hasFeature("resp")&&ctx.reg.env.wsp.wspMetaUi.hasResps)
this.requireVisiblePerm("action.item#set.resps")}getActions(ctx){const list=[]
ctx.reg.env.wsp.wspMetaUi.listResps("item").forEach(resp=>list.push(new ItemsSetResponsability(resp)))
return list}}ItemsSetResonsabilities.SINGLETON=()=>ItemsSetResonsabilities._S||(ItemsSetResonsabilities._S=new ItemsSetResonsabilities)
export class ItemsSetResponsability extends SrcAction{constructor(resp){super(resp.code)
this.resp=resp
this._label=resp.name
this._description=resp.desc
this.atLeastOne=true
this.setVisible(ctx=>ctx.reg.env.wsp.hasFeature("resp")&&ctx.reg.env.wsp.wspMetaUi.hasResps)
this.requireVisiblePerm("action.item#set.resps")}isEnabled(ctx){if(!super.isEnabled(ctx))return false
for(const sd of ctx.shortDescs){const itemType=ctx.reg.env.wsp.wspMetaUi.getItemType(sd.itModel)
if(!itemType.getResp(this.resp.code))return false}return true}async execute(ctx,ev){const reg=ctx.reg
const{SrcEditResp:SrcEditResp}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/srcEditResp.js")
const nb=ctx.shortDescs.length
let itemsTitle=""
if(nb==1){itemsTitle=ITEM.getItemUriLabel(ctx.shortDescs[0].srcUri,ctx.shortDescs[0])}else itemsTitle=`${nb} items`
const repName=this.resp.name
await POPUP.showDialog((new SrcEditResp).initialize({reg:ctx.reg,resp:this.resp,shortDescs:ctx.shortDescs}),ctx.reg.env.uiRoot,{titleBar:{barLabel:{label:`Responsabilité \'${repName}\' sur ${itemsTitle}`},closeButton:{}},resizer:{},initWidth:"min(40vw,30em)",initHeight:"20vh"}).onNextClose()}}
//# sourceMappingURL=itemActions.js.map