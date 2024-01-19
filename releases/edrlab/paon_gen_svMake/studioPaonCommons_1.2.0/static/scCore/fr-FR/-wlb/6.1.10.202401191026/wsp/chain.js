import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{CoreUniverse}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/universe.js"
import{configWspSrv,WspSrv}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{configPackSrv,PackSrv}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/pack.js"
import{configExecutorSrv,ExecutorSrv}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/executor.js"
import{AreaAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
export class ChainUniverse extends CoreUniverse{constructor(config){super(config)
const reg=this.reg
REG.reg.addToList("rolesExplorer:tabs",config.id||"chain",1,(new AreaAsync).setLabel(config.name||"Entrepôt").setVisible(ctx=>reg.hasPerm("exportConfig.roles")).requireLib(IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/wspRolesExplorer.js")).setBodyBuilder((function(ctx){const MOD=this._modules[0]
return(new MOD.WspRolesExplorerTab).initialize({reg:reg})})))}buildConfig(config){if(!config.wsFrames)config.wsFrames={}
if(!config.wsFrames.ws)config.wsFrames.ws={}
super.buildConfig(config)
config.wsps=configWspSrv(config.httpFrames.web.execFrameUrl,config.wsps)
if(config.packs!==null)config.packs=configPackSrv(config.httpFrames.web.execFrameUrl,config.packs)
if(config.executor!==null)config.executor=configExecutorSrv(config.httpFrames.web.execFrameUrl,config.executor)}buildUniverse(config){super.buildUniverse(config)
this.wspServer=new WspSrv(this,config.wsps)
if(config.packs!==null)this.packServer=new PackSrv(this,config.packs)
if(config.executor!==null)this.executor=new ExecutorSrv(config.executor)}getWspFeatureStatus(feat){return this.config.wspFeatures?this.config.wspFeatures[feat]:undefined}}
//# sourceMappingURL=chain.js.map