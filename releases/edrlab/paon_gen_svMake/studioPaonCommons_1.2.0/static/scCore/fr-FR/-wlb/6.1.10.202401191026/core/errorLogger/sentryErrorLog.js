import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
export class SentryErrorLogDeskFeat extends Desk{static add(desk,projectDsn){if(this.isIn(desk))return desk
const d=desk
REG.reg.addToList(Desk.LC_init,"sentryErrorLog",1,async()=>{try{const[,projectToken]=projectDsn.match("https://(.+?)@")
const projectScript=document.createElement("script")
projectScript.src=`https://js.sentry-cdn.com/${projectToken}.min.js`
document.head.appendChild(projectScript)
await new Promise((resolve,reject)=>{projectScript.onload=()=>{window.Sentry.forceLoad()
window.Sentry.onLoad(resolve)
document.querySelector("script").addEventListener("error",()=>{reject(new Error("Unable to load the Sentry SDK script"))})}
projectScript.onerror=()=>reject(new Error("Unable to load the Sentry project script"))})
window.Sentry.init({integrations:[new window.Sentry.Integrations.Breadcrumbs({dom:true,console:false,fetch:true,xhr:true})],ignoreErrors:[/^ResizeObserver loop limit exceeded$/]})
REG.reg.registerSvc("errorLog",REG.LEVELAUTH_CORE+1,sentryErrorLog)}catch(e){console.error("Sentry init failed")
console.error(e)}})
return d}static isIn(desk){return"Sentry"in window}}class ReportedError extends Error{constructor(error){super()
this.error=error}get message(){return this.error.msg}get cause(){return this.error.cause}}const sentryErrorLog={logError(error){const sentryError=new ReportedError(error)
window.Sentry.configureScope(scope=>{if(error.ctx){for(const propName in error.ctx){if(propName=="shortDesc"||propName=="shortDescs"){scope.setExtra(propName,error.ctx[propName])}}}if(error.adminDetails)scope.setExtra("adminDetails",error.adminDetails)
window.Sentry.captureException(sentryError)})}}

//# sourceMappingURL=sentryErrorLog.js.map