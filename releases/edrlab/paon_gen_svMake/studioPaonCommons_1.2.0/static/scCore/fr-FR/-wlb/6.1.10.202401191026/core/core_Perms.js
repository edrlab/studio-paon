import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/basis_Perms.js"
const r=REG.reg
r.newPerm("edit.job","adminSyst",0)
r.newPerm("show.jobs","adminSyst",0)
r.newPerm("show.myJobs","admin",0)
r.newPerm("admin.logs","adminSyst",0)
r.newPerm("use.inMaintenance","adminSyst",0)
r.newPerm("set.maintenance","use.inMaintenance",0)

//# sourceMappingURL=core_Perms.js.map