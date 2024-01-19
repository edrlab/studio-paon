import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
const defaultErrorLog={logError(error){if(error.adminDetails)console.error(error.msg,error.adminDetails,error.cause)
else console.error(error.msg,error.cause)}}
REG.reg.registerSvc("errorLog",REG.LEVELAUTH_CORE,defaultErrorLog)

//# sourceMappingURL=errorLog.js.map