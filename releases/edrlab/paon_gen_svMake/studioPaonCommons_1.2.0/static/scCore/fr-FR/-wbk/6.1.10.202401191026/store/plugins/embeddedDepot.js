import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{BasicUniverse}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/universe.js"
import{isDepotUiEnv}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/depot.js"
import{UtBrowser,UtBrowserFetcher}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/utBrowser.js"
import{AccelKeyMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
export function embeddedAppFactory(config){return async function initEmbeddedApp(init){let depotReg
if(!init.authReg){REG.reg.setPref("lang",21,config.lang)
new BasicUniverse(config.rootUniverseConf)
const[authConf,depotConf]=await Promise.all([config.authConfPath.importJs(),config.depotConfPath.importJs()])
const authReg=REG.createSubReg(REG.reg)
authConf.init(authReg,authReg.parentReg)
depotReg=REG.createSubReg(REG.reg)
depotConf.init(depotReg,authReg,config.depotWs==="auth"?authReg:null)}else{if(init.depotReg){depotReg=init.depotReg}else{depotReg=REG.createSubReg(REG.reg)
const depotConf=await config.depotConfPath.importJs()
depotConf.init(depotReg,init.authReg,null)}}let depotUiReg=isDepotUiEnv(depotReg.env)?depotReg:depotReg.env.universe.newDepotUiReg(init.parentNode)
const utBrowser=(new UtBrowser).initialize({reg:depotUiReg,autoCloseReg:depotReg!==depotUiReg,fetcher:new UtBrowserFetcher(depotReg.env.universe.adminUrlTree),actions:depotReg.mergeLists("actions:embeddedDepot:utBrowser","actions:store:resList"),accelKeyMgr:(new AccelKeyMgr).initFromMapActions(depotReg.mergeListsAsMap("accelkeys:embeddedDepot:utBrowser","accelkeys:store:resList"))})
init.parentNode.textContent=null
init.parentNode.appendChild(utBrowser)}}
//# sourceMappingURL=embeddedDepot.js.map