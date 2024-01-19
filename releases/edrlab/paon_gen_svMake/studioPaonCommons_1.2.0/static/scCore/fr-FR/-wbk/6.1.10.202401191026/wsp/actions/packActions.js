import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/actions_Perms.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{SKINPACK,WSPPACK}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/pack.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
export class InstallWspPackAction extends Action{constructor(id){super(id||"installWspPack")
this.defaultAccept=".wsppack"
this.installOnSrvPerm="action.pack#install.wspPack"
this._label="Installer..."
this._description="Installer un modèle documentaire ou une extension"
this._group="packs"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/installPack.svg")}async execute(ctx,ev){let subPackSrvMap=new Map
ctx.packSrvList.forEach(packSrv=>{if(packSrv.universe.reg.hasPerm(this.installOnSrvPerm))subPackSrvMap.set(packSrv.universe.getId(),packSrv)})
let files=ctx.packs
if(!files){const input=document.createElement("input")
input.type="file"
input.accept=(ctx.packExtensions?ctx.packExtensions.join(";"):"")||this.defaultAccept
input.multiple=true
input.click()
files=Array.from(await new Promise(resolve=>{input.onchange=function(){resolve(this.files.length>0?this.files:null)}}))
if(!files||files.length==0)return}if(subPackSrvMap.size>1){const form=JSX.createElement("form",null,JSX.createElement("p",null,"Veuillez sélectionner les environnements cibles dans lesquels réaliser l\'installation :"))
subPackSrvMap.forEach(packSrv=>{form.appendChild(JSX.createElement("p",null,JSX.createElement("label",null,JSX.createElement("input",{type:"checkbox",name:packSrv.universe.getId(),value:packSrv.universe.getId(),checked:"true"}),packSrv.universe.getName())))})
if(!await POPUP.confirm(form,ctx.emitter,{okLbl:"Installer",kind:"question"}))return
subPackSrvMap.forEach(packSrv=>{const inputElt=form.elements.namedItem(packSrv.universe.getId())
if(!inputElt||!inputElt.checked)subPackSrvMap.delete(packSrv.universe.getId())})}if(ctx.globalInstallHandler)await ctx.globalInstallHandler("start",false)
try{if(subPackSrvMap.size>0){await Promise.all(Array.from(subPackSrvMap).map(async value=>{let packSrv=value[1]
await Promise.all(files.map(async packFile=>{if(ctx.packInstallHandler)await ctx.packInstallHandler("start",packFile,packSrv)
let pack
try{pack=await this.doInstallPackOnSrv(packSrv,packFile)}finally{if(ctx.packInstallHandler)await ctx.packInstallHandler("end",packFile,packSrv,pack)}}))}))}}finally{if(ctx.globalInstallHandler)await ctx.globalInstallHandler("end",subPackSrvMap.size>0)}}async doInstallPackOnSrv(packSrv,packFile){return WSPPACK.installPack(packSrv,packFile)}isVisible(ctx){if(ctx.packSrvList&&ctx.packSrvList.findIndex(packSrv=>packSrv.universe.reg.hasPerm(this.installOnSrvPerm))==-1)return false
return super.isVisible(ctx)}}InstallWspPackAction.SINGLETON=new InstallWspPackAction
export class InstallSkinPackAction extends InstallWspPackAction{constructor(id){super(id||"installSkinPack")
this.defaultAccept=".skinpack"
this.installOnSrvPerm="action.pack#install.skinPack"
this._label="Installer..."
this._description="Installer un habillage graphique"
this._group="packs"
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/installPack.svg")}async doInstallPackOnSrv(packSrv,packFile){return SKINPACK.install(packSrv,packFile)}}InstallSkinPackAction.SINGLETON=new InstallSkinPackAction

//# sourceMappingURL=packActions.js.map