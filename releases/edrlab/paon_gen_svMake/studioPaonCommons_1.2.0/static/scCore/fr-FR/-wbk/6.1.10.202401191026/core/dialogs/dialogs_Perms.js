import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/user_Perms.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/core_Perms.js"
const r=REG.reg
r.newPerm("action.jobsMgr#create.job","edit.job",0)
r.newPerm("action.jobsMgr#freeze.executor","edit.job",0)
r.newPerm("ui.usersMgr.admin.hiddenGroup","admin.props.isHidden.group",0)
r.newPerm("ui.usersMgr.admin.hiddenUser","admin.props.isHidden.user",0)

//# sourceMappingURL=dialogs_Perms.js.map