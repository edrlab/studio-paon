import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/basis_Perms.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/user_Perms.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp_Perms.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/core_Perms.js"
const r=REG.reg
r.newPerm("ui.optionsPlg","use",0)
r.newPerm("ui.optionsPlg.admin","adminSyst",0)
r.newPerm("ui.optionsPlg.notif","adminSyst",0)
r.newPerm("ui.jobsPlg","show.jobs",0)
r.newPerm("ui.usersPlg.users","admin.users",0)
r.newPerm("ui.usersPlg.rolesExplorer","exportConfig.roles",0)
r.newPerm("ui.usersPlg.groups","admin.typeGroup",0)

//# sourceMappingURL=plugins_Perms.js.map