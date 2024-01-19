import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{StylerSrcImportSkin}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/styler/widgets/stylerSrcDrawer.js"
import{WSPPACK}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/pack.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{Action4SrcPointer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/wed/ptrItem.js"
REG.reg.addToList("actions:wsp:wed:ptr-item",StylerSrcImportSkin.SINGLETON.getId(),1,new Action4SrcPointer(StylerSrcImportSkin.SINGLETON))
REG.reg.addToList("srcFields:longDesc","itAttr_skClass",1,"itAttr_skClass")
REG.reg.addToList("srcFields:longDesc","itAttr_skClassStl",1,"itAttr_skClassStl")
export class SkinClassStl{constructor(config){this.config=config}get code(){return this.config.code}get name(){return this.config.name}get class(){return this.config.skinClass}get ownerWspTypeStlName(){var _a
return(_a=this.config)===null||_a===void 0?void 0:_a.ownerWspTypeStlName}skinClass(wsp){return STYLER.getSkinClass(wsp,this.config.skinClass)}}export class SkinClass{constructor(config){this.config=config}get class(){var _a
return(_a=this.config)===null||_a===void 0?void 0:_a.class}get name(){var _a
return((_a=this.config)===null||_a===void 0?void 0:_a.name)||this.class}get sgn(){var _a
return(_a=this.config)===null||_a===void 0?void 0:_a.sgn}static isSkinClassOdt(skinClass){return(skinClass===null||skinClass===void 0?void 0:skinClass.sgn.match(/.*#odt\b.*/))?true:false}static isSkinClassDoss(skinClass){return(skinClass===null||skinClass===void 0?void 0:skinClass.sgn.match(/.*#doss\b.*/))?true:false}equals(other){return other&&other.class===this.class}}export class RegisteredSkin{constructor(skin,cLass,wspTypeDef){this.skin=skin
this.cLass=cLass
this.wspTypeDef=wspTypeDef}get code(){var _a
return(_a=this.skin)===null||_a===void 0?void 0:_a.code}get name(){var _a
return((_a=this.skin)===null||_a===void 0?void 0:_a.name)||this.code}skinClass(wsp){return STYLER.getSkinClass(wsp,this.cLass)}get owner(){var _a,_b,_c,_d,_e
return{key:(_a=this.wspTypeDef)===null||_a===void 0?void 0:_a.key,isExt:(_b=this.wspTypeDef)===null||_b===void 0?void 0:_b.isOption,name:(_c=this.wspTypeDef)===null||_c===void 0?void 0:_c.title,version:(_d=this.wspTypeDef)===null||_d===void 0?void 0:_d.version,lang:(_e=this.wspTypeDef)===null||_e===void 0?void 0:_e.lang}}getIconUrl(wspServer){if(this.wspTypeDef&&this.skin.iconPath&&this.skin.keyRes)return wspServer.config.adminWspUrl.resolve(IO.qs("cdaction","GetRes","param",this.skin.keyRes+"~"+this.wspTypeDef.lang+"#"+this.wspTypeDef.version+"#"+this.wspTypeDef.version+"/"+this.skin.iconPath)).url
else if(this.wspTypeDef&&this.skin.iconPath){return wspServer.config.adminWspUrl.resolve(IO.qs("cdaction","GetRes","param",this.wspTypeDef.key+".ss~"+this.wspTypeDef.lang+"#"+this.wspTypeDef.version+"#"+this.wspTypeDef.version+"/"+this.skin.iconPath)).url}else return"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/styler/actions/skinEntry.svg"}getSrcUrl(wspServer){if(this.wspTypeDef&&this.skin.keyRes){return wspServer.config.adminWspUrl.resolve(IO.qs("cdaction","GetRes","param",this.skin.keyRes+"~"+this.wspTypeDef.lang+"#"+this.wspTypeDef.version+"#"+this.wspTypeDef.version+"/"+this.skin.path)).url}else if(this.wspTypeDef){return wspServer.config.adminWspUrl.resolve(IO.qs("cdaction","GetRes","param",this.wspTypeDef.key+".ss~"+this.wspTypeDef.lang+"#"+this.wspTypeDef.version+"#"+this.wspTypeDef.version+"/"+this.skin.path)).url}}}export const LIST_SKIN_CLASSES_STL="styler:skinclasses:stl"
export const LIST_SKIN_CLASSES="styler:skinclasses"
export var STYLER;(function(STYLER){function getSkinClassesStl(wsp){return wsp.reg.getListAsMap(LIST_SKIN_CLASSES_STL)}STYLER.getSkinClassesStl=getSkinClassesStl
function getSkinClassStl(wsp,skinClassStlKey){const skinCLassesStylerDef=wsp.reg.getListAsMap(LIST_SKIN_CLASSES_STL)
return skinCLassesStylerDef?skinCLassesStylerDef[skinClassStlKey]:null}STYLER.getSkinClassStl=getSkinClassStl
function getSkinClass(wsp,skinClassKey){const skinCLassesDef=wsp.reg.getListAsMap(LIST_SKIN_CLASSES)
return skinCLassesDef?skinCLassesDef[skinClassKey]:null}STYLER.getSkinClass=getSkinClass
async function getRegisteredSkins(wsp,skinClasses){const list=await WSPPACK.listWspTypesDef(wsp.reg.env.universe.packServer,skinClasses,true)
const result=new Set
if(list)list.forEach(wspTypeDef=>{if(wspTypeDef.skinClasses)wspTypeDef.skinClasses.forEach(skinCLassDef=>{if(!skinClasses||skinClasses.indexOf(skinCLassDef.class)>-1){const skins=skinCLassDef.skins
if(skins)skins.forEach(skin=>{result.add(new RegisteredSkin(skin,skinCLassDef.class,wspTypeDef))})}})})
return result}STYLER.getRegisteredSkins=getRegisteredSkins
function listSkinsFromSkinsPacks(packServer,skinClass,lang){return packServer.config.skinPackUrl.fetchJson(IO.qs("cdaction","ListSkinsForSkinClass","param",skinClass,"lang",lang))}STYLER.listSkinsFromSkinsPacks=listSkinsFromSkinsPacks
async function getSkin(packServer,skinPackId,skinCLass,lang){return packServer.config.skinPackUrl.fetchBlob(IO.qs("cdaction","GetSkin","param",skinCLass,"skinPackId",skinPackId,"lang",lang))}STYLER.getSkin=getSkin
function getSkinUrl(packServer,skinPackId,skinCLass,lang){return packServer.config.skinPackUrl.resolve(IO.qs("cdaction","GetSkin","param",skinCLass,"skinPackId",skinPackId,"lang",lang)).url}STYLER.getSkinUrl=getSkinUrl
async function installGenAsSkinpack(wsp,uiContext,srcRef,codeGenStack,props,customFullUriDest,lang){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
let resp=await wsp.wspServer.config.wspGenUrl.fetchJson(IO.qs("cdaction","InstallGenAsSkinPack","format","json","param",wsp.code,"refUri",srcRef,"codeGenStack",codeGenStack,"lang",lang),{method:"POST"})
return resp.pack}STYLER.installGenAsSkinpack=installGenAsSkinpack})(STYLER||(STYLER={}))

//# sourceMappingURL=styler.js.map