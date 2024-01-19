import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{URLTREE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/urlTree.js"
import{ResChildrenArea,ResFrameArea,ResHoverArea,ResIdentFieldSetArea,RESINFO,ResInfoArea,ResMainArea,ResTabsArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/areas/resViewAreas.js"
import{SEC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/security.js"
export class InfoCurrentRes{constructor(resPath,nodeProps){this.resPath=resPath
this.nodeProps=nodeProps}}export class InfoReqCurrentRes{}export class InfoFocusRes{constructor(resPath){this.resPath=resPath}}export class InfoUpdatePendingRes{constructor(resPath,done){this.resPath=resPath
this.done=done}}export class DepotResTypeProv{constructor(){this.prcMap=new Map
this.visStateMenuLabel="Visibilité en ligne"}get dataSets(){return this._dataSets||(this._dataSets||new Map)}get defaultResFileType(){return this.prcMap.get("file")}getResTypeFor(res){if(res==null)return this.nullType
if(res.prc==null){if(res.t==="noContent")return this.defaultFolderType
if(res.t==="moved")return this.movedType
return this.unknownType}return this.prcMap.get(res.prc)||this.unknownType}getResTypeByPrc(prc){if(prc==null)return this.nullType
return this.prcMap.get(prc)||this.unknownType}getResTypesTree(filter){if(!filter)return this.resTypesTree
function copy(tree){const result=[]
for(let entry of tree){if(isDirResType(entry)){const ch=copy(entry.children)
if(ch.length>0){const newEntry=Object.create(entry)
entry.children=ch
result.push(newEntry)}}else if(filter(entry)){result.push(entry)}}return result}return copy(this.resTypesTree)}hasAnyVCB(){if(this._hasAnyVCB===undefined){for(let itemType of this.prcMap.values()){if(itemType.prcVersionning==="VCB"){this._hasAnyVCB=true
return true}}this._hasAnyVCB=false}return this._hasAnyVCB}humanPath(resPath){return resPath||"Accueil"}addPrcResType(resType){this.prcMap.set(resType.prc,resType)
return resType}setPrcResTypes(...resTypes){for(const r of resTypes)this.prcMap.set(r.prc,r)
return this}setDefaultFolderType(resType){this.defaultFolderType=resType
if(resType.prc)this.prcMap.set(resType.prc,resType)
return resType}setUnknownType(resType){this.unknownType=resType
return resType}setNullType(resType){this.nullType=resType
return resType}setMovedType(resType){this.movedType=resType
return resType}setResTypesTree(tree){this.resTypesTree=tree
return this}initDefaults(reg){if(!this.nullType)this.nullType=new ResType(reg,"#null").override("prcLabel","Contenu inexistant").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/objects/res/null.svg")
if(!this.unknownType)this.unknownType=new ResType(reg,"#unknown").override("prcLabel","Autre contenu").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/objects/res/default.svg")
if(!this.defaultFolderType){this.setDefaultFolderType(new ResType(reg,"folder").override("prcLabel","Dossier").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/objects/res/folder.svg").setIconOpened("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/objects/res/folderOpened.svg").addView("main",RESVIEW_main_FOLDER))}if(!this.movedType){this.movedType=new ResType(reg,"#moved").override("prcLabel","Contenu déplacé").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/objects/res/moved.svg").addView("infosMain",RESVIEW_infosMain_MOVED)}if(!this.resTypesTree)this.resTypesTree=Array.from(this.prcMap.values())}visStateLabel(res){if(res.trashed)return"Invisible"
if(res.unlisted)return"Limité"
return"Visible"}visStateDescription(res){if(res.trashed)return"Aucun accès en ligne"
if(res.unlisted)return"Masqué, uniquement accessible par son URL"
return"Normalement affiché et accessible"}visStateIconUrl(res){if(res.trashed)return"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/visResInvisible.svg"
if(res.unlisted)return"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/visResLimited.svg"
return"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/actions/visResVisible.svg"}}export function isDirResType(d){return d&&Array.isArray(d.children)}export function countResTypes(inArray,until=Infinity,filter){let found=0
for(let entry of inArray){if(isDirResType(entry)){found+=countResTypes(entry.children,until-found,filter)
if(found>=until)return found}else if(!filter||filter(entry)){if(++found>=until)return found}}return found}export class ResType{constructor(reg,prc){this.prcIsFolder=false
this.prcIsNoContent=false
this.prcNoCreator=false
this.prcVersionning=null
this.views=new Map
this.reg=REG.createSubReg(reg)
this.reg.env.resType=this
this.prc=prc}resIcon(res,state){if(res.n===""){return"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/objects/res/home.svg"}return state==="opened"?this.prcIconOpened||this.prcIcon:this.prcIcon}resName(res){let n=res.n
if(n)return n
if(n==="")return this.reg.env.universe.getName()
return"?"}resVersion(res){return res.v||""}livePath(resPath){if(this.prcVersionning==="VCB")return resPath
return URLTREE.extractUnversionedLeafPath(resPath)}resView(key){const v=this.views.get(key)
if(v)return v
if(key==="main")return RESVIEW_main
if(key==="infos")return RESVIEW_infos
if(key==="select"){const main=this.views.get("main")||RESVIEW_main
if(main.asSelectArea)return main.asSelectArea()
return RESVIEW_main}if(key==="consult"){const main=this.views.get("main")||RESVIEW_main
if(main.asConsultArea)return main.asConsultArea()
return RESVIEW_main}return null}shortResView(key){const v=this.views.get(key)
if(v)return v
if(key==="hover"){const preview=this.views.get("preview")
if(preview){const hover=(new ResHoverArea).setPreview(preview)
this.views.set(key,hover)
return hover}return RESVIEW_infos}return null}resForm(key){const v=this.views.get(key)
if(v)return v
if(key==="editIdent")return RESFORM_editIdent
return null}matchResName(name){if(!this.prcExts)return false
const n=name.toLowerCase()
return this.prcExts.find(ext=>n.endsWith(ext))!=null}override(name,val){this[name]=val
return this}setIcon(icon){this.prcIcon=this.reg.env.resolver.resolve(icon).url
return this}setIconOpened(icon){this.prcIconOpened=this.reg.env.resolver.resolve(icon).url
return this}addView(key,view){this.views.set(key,view)
return this}addShortView(key,view){this.views.set(key,view)
return this}addEditView(key,view){this.views.set(key,view)
return this}newShortResRegFromDepotReg(from,res){const reg=REG.createSubReg(from)
reg.env.path=res.permaPath
reg.env.nodeInfos=res
reg.env.resType=this
reg.env.securityCtx=SEC.createSub(from.env.securityCtx,res.roles,undefined,res)
return reg}}const RESVIEW_main=(new ResMainArea).setContent(null)
const RESVIEW_infosMain_MOVED=(new ResInfoArea).setLines(RESINFO.moved)
const RESVIEW_main_FOLDER=(new ResMainArea).setContent((new ResTabsArea).setTabs((new ResChildrenArea).setLabel("Gestion"),(new ResFrameArea).setLabel("Rendu")))
const RESVIEW_infos=(new ResInfoArea).setLines(RESINFO.path,RESINFO.url,RESINFO.status,RESINFO.deploy,RESINFO.prc)
const RESFORM_editIdent=new ResIdentFieldSetArea
export var RES;(function(RES){RES.NODEPROPS_short="n*permaPath*v*idx*m*t*trashed*unlisted*prc*resId*roles"})(RES||(RES={}))

//# sourceMappingURL=res.js.map