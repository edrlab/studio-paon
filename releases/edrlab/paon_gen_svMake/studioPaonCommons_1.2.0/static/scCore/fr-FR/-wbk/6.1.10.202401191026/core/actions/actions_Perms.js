import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/user_Perms.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/core_Perms.js"
const r=REG.reg
r.newPerm("action.jobs#delete","edit.job",0)
r.newPerm("action.jobs#forceExecute","edit.job",0)
r.newPerm("action.jobs#moveInQueue","edit.job",0)
r.newPerm("action.jobs#schedule","edit.job",0)
r.newPerm("action.users#create.user","create.user",0)
r.newPerm("action.users#drop.user","drop.user",0)
r.newPerm("action.users#update.user","update.user",0)
r.newPerm("action.users#create.group","create.group",0)
r.newPerm("action.users#drop.group","drop.group",0)
r.newPerm("action.users#update.group","update.group",0)

//# sourceMappingURL=actions_Perms.js.map