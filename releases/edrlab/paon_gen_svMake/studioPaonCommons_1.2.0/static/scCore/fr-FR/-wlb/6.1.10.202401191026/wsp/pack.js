import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{LOCALE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
export class PackSrv{constructor(universe,config){this.universe=universe
this.config=config}}export function configPackSrv(webFrameUrl,config){if(!config)config={}
if(!config.adminPackUrl)config.adminPackUrl=webFrameUrl.resolve("u/adminPack/")
if(!config.skinPackUrl)config.skinPackUrl=webFrameUrl.resolve("u/skinPack/")
return config}export var WSPPACK;(function(WSPPACK){function isOption(def){return"isOption"in def&&def.isOption?true:false}WSPPACK.isOption=isOption
function buildWspDefTitle(def,options={lang:true,version:true}){let str=def.title||def.key
let opts=[]
let lang=def.lang
if(options.lang&&lang&&lang.length>0)opts.push(options.short?lang:LOCALE.languageToName(lang))
let version=def.version
if(options.version&&version)opts.push(`version ${version}`)
return str+(opts.length>0?" ("+opts.join(", ")+")":"")}WSPPACK.buildWspDefTitle=buildWspDefTitle
function buildWspTypeTitle(def,options={ext:true,lang:true,version:true}){let finalTitle=[]
finalTitle.push(WSPPACK.buildWspDefTitle(def.wspType,options))
let wspOptionList=def.wspOptions||[]
let count=wspOptionList.length
if(options.ext!==false&&count>0){if(options.ext===null){finalTitle.push(count>1?`et ${count} extensions`:"et 1 extension")}else{wspOptionList.forEach(wspOption=>{finalTitle.push(WSPPACK.buildWspDefTitle(wspOption,options))})}}if(finalTitle.length>0)return finalTitle.join(", ")
return"Modèle documentaire"}WSPPACK.buildWspTypeTitle=buildWspTypeTitle
function buildPackTitle(pack){if(pack.title)return pack.title
let finalTitle=[]
if("wspTypeDef"in pack){let wspTypeDefList=pack.wspTypeDef.filter(wspType=>"isOption"in wspType?false:true)
let wspOptionDefList=pack.wspTypeDef.filter(wspType=>"isOption"in wspType?true:false)
if(wspTypeDefList.length>0){wspTypeDefList.sort((wspTypeDefA,wspTypeDefB)=>wspTypeDefA.title.localeCompare(wspTypeDefB.title))
wspTypeDefList.forEach(wspTypeDef=>finalTitle.push(WSPPACK.buildWspDefTitle(wspTypeDef)))
let count=wspOptionDefList.length
if(wspOptionDefList.length>0)finalTitle.push(count>1?`et ${count} extensions`:"et 1 extension")}else{wspOptionDefList.sort((wspTypeDefA,wspTypeDefB)=>wspTypeDefA.title.localeCompare(wspTypeDefB.title))
wspOptionDefList.forEach(wspTypeDef=>finalTitle.push(WSPPACK.buildWspDefTitle(wspTypeDef)))}}if(finalTitle.length>0)return finalTitle.join(", ")
return"Modèle documentaire"}WSPPACK.buildPackTitle=buildPackTitle
function errorToString(packError){if(packError==null)return
let errorsStr=""
switch(packError){case"versionFrameworkPackOutdated":case"versionPackUnknown":errorsStr="Pack obsolète, mise à jour nécessaire"
break
case"versionServerOutdated":errorsStr="Pack trop récent incompatible avec cet entrepôt"
break
case"malformedPack":case"unknownError":default:errorsStr="Pack en erreur"}return errorsStr}WSPPACK.errorToString=errorToString
function isStatusPending(status){return status==="uploadPending"||status==="installPending"}WSPPACK.isStatusPending=isStatusPending
function isStatusInstalled(status){return status==="installed"}WSPPACK.isStatusInstalled=isStatusInstalled
async function listPacks(packServer){return packServer.config.adminPackUrl.fetchJson(IO.qs("cdaction","ListPacks"))}WSPPACK.listPacks=listPacks
async function listWspTypesDef(packServer,skinClasses,pIncludeOptions=false){return packServer.config.adminPackUrl.fetchJson(IO.qs("cdaction","ListWspTypesDef","skinClasses",skinClasses?skinClasses.join(","):null,"includeOptions",pIncludeOptions))}WSPPACK.listWspTypesDef=listWspTypesDef
async function infoPack(packServer,packId){let resp=await packServer.config.adminPackUrl.fetchJson(IO.qs("cdaction","InfoPack","param",packId))
return resp.pack}WSPPACK.infoPack=infoPack
async function installPack(packServer,content,sync=false){let resp=await packServer.config.adminPackUrl.fetchJson(IO.qs("cdaction","InstallPack","sync",sync),{method:"PUT",body:content})
return resp.pack}WSPPACK.installPack=installPack
async function uninstallPack(packServer,packId){return packServer.config.adminPackUrl.fetchVoid(IO.qs("cdaction","UninstallPack","param",packId),{method:"POST"})}WSPPACK.uninstallPack=uninstallPack
async function downloadPack(packServer,packId){return packServer.config.adminPackUrl.fetchBlob(IO.qs("cdaction","DownloadPack","param",packId))}WSPPACK.downloadPack=downloadPack
function getDownloadPackUrl(packServer,packId){return packServer.config.adminPackUrl.resolve(IO.qs("cdaction","DownloadPack","param",packId)).url}WSPPACK.getDownloadPackUrl=getDownloadPackUrl})(WSPPACK||(WSPPACK={}))
export var SKINPACK;(function(SKINPACK){function buildPackTitle(pack){const title=pack.title||"Habillage graphique"
const version=pack.version
return version?`${title} (version ${version})`:title}SKINPACK.buildPackTitle=buildPackTitle
function errorToString(packError){if(packError==null)return
let errorsStr=""
switch(packError){case"malformedPack":errorsStr="Habillage graphique incompatible avec cet environnement"
break
case"unknownError":default:errorsStr="Habillage graphique en erreur"}return errorsStr}SKINPACK.errorToString=errorToString
function isStatusPending(status){return status==="uploadPending"}SKINPACK.isStatusPending=isStatusPending
function isStatusInstalled(status){return status=="installed"?true:false}SKINPACK.isStatusInstalled=isStatusInstalled
async function list(packServer){return packServer.config.skinPackUrl.fetchJson(IO.qs("cdaction","List"))}SKINPACK.list=list
async function install(packServer,content){let resp=await packServer.config.skinPackUrl.fetchJson(IO.qs("cdaction","Install"),{method:"PUT",body:content})
return resp.pack}SKINPACK.install=install
async function deleteSkin(packServer,skinPackId){return packServer.config.skinPackUrl.fetchVoid(IO.qs("cdaction","Delete","skinPackId",skinPackId),{method:"POST"})}SKINPACK.deleteSkin=deleteSkin
async function downloadPack(packServer,skinPackId){return packServer.config.skinPackUrl.fetchBlob(IO.qs("cdaction","Download","skinPackId",skinPackId))}SKINPACK.downloadPack=downloadPack
function getDownloadPackUrl(packServer,skinPackId){return packServer.config.skinPackUrl.resolve(IO.qs("cdaction","Download","skinPackId",skinPackId)).url}SKINPACK.getDownloadPackUrl=getDownloadPackUrl
function getIconUrl(packServer,skinPackCode){return packServer.config.skinPackUrl.resolve(IO.qs("cdaction","GetIcon","param",skinPackCode)).url}SKINPACK.getIconUrl=getIconUrl
function ListSkinClassesForWspType(packServer,skinPackId,keyWspDef,versionWspDef,langWspDef){return packServer.config.skinPackUrl.fetchJson(IO.qs("cdaction","ListSkinClassesForWspType","param",skinPackId,"wspTypeKey",keyWspDef,"version",versionWspDef,"lang",langWspDef))}SKINPACK.ListSkinClassesForWspType=ListSkinClassesForWspType})(SKINPACK||(SKINPACK={}))

//# sourceMappingURL=pack.js.map