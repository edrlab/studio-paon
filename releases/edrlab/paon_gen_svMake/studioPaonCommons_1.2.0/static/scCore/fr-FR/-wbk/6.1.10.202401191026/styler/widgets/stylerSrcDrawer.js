import{SrcPointerWriteAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcDrawer.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{SkinClass,STYLER}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/styler/styler.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
export class StylerSrcImportSkin extends SrcPointerWriteAction{constructor(){super("stylerImportSkin")
this._label="Importer un habillage graphique..."
this._description="Importer un habillage graphique présent dans ce contexte de travail"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/styler/actions/importSkin.svg"
this._group="edit"}isVisible(ctx){var _a
if(!((_a=ctx.getAttribute("data-styler-act"))===null||_a===void 0?void 0:_a.includes("importSkin"))||!ctx.reg.env.longDesc||!ctx.reg.env.longDesc.itAttr_skClassStl)return false
return super.isVisible(ctx)}async execute(ctx,ev){const{SkinSelectorForSkinClassStl:SkinSelectorForSkinClassStl}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/styler/dialogs/skinSelector.js")
const skinFromClassSelector=(new SkinSelectorForSkinClassStl).initialize({skinClassStl:ctx.reg.env.longDesc.itAttr_skClassStl,reg:ctx.reg,buttonLabel:"Importer ce style"})
const skinClassStl=STYLER.getSkinClassStl(ctx.reg.env.wsp,ctx.reg.env.longDesc.itAttr_skClassStl)
const skinObj=await POPUP.showMenuFromEvent(skinFromClassSelector,ev||ctx,ctx,{titleBar:{barLabel:{label:skinClassStl.name}}}).onNextClose()
if(skinObj){const itTypeSgnMath=SkinClass.isSkinClassOdt(skinClassStl.skinClass(ctx.reg.env.wsp))?/@sf_skinOdt\b.*/:/@sf_skinDoss\b.*/
const isZip=SkinClass.isSkinClassOdt(skinClassStl.skinClass(ctx.reg.env.wsp))?false:true
let data
let result
try{const resp=await fetch(skinObj.resUrl,{method:"get"})
data=await resp.blob()}catch(e){const skinName=skinObj.name
await ERROR.show(`Impossible d\'importer l\'habillage graphique \'${skinName}\'`,e)
return}if(data){const{ItemCreator:ItemCreator}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/itemCreator.js")
const ct=(new ItemCreator).initialize(ItemCreator.setDefaultConfigFromReg(ctx.reg,{body:isZip?null:data,itemTypesTree:{itemTypeReducer:(acc,cur)=>{if(cur.getSgn().match(itTypeSgnMath))acc.push(cur)
return acc}},spaceUri:ctx.shortDescs.length>0?ITEM.extractSpaceUri(ctx.shortDescs[0].srcUri):"",nameBuilder:()=>SRC.filterPartUri(skinClassStl.class+"_"+skinObj.code)}))
result=await POPUP.showDialog(ct,ctx.emitter,{titleBar:{barLabel:{label:"Importer un habillage graphique..."}}}).onNextClose()}else{const skinName=skinObj.name
await ERROR.show(`Impossible d\'importer l\'habillage graphique \'${skinName}\'`)}if(result){if(isZip)await ITEM.importScar(ctx.reg.env.wsp,ctx,result.srcUri,new File([data],"myFile"),true)
ctx.focus()
ctx.setSrcRef(ITEM.srcRefSub(result),result)}}}}StylerSrcImportSkin.SINGLETON=new StylerSrcImportSkin

//# sourceMappingURL=stylerSrcDrawer.js.map