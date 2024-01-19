import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/basis_Perms.js"
const r=REG.reg
r.newPerm("data.role","DATA",0)
r.newPerm("admin.users","admin",0)
r.newPerm("use.users","use",0)
r.newPerm("admin.userSync","adminSyst",0)
r.newPerm("admin.typeGroup","admin.users",0)
r.newPerm("admin.typeUser","admin.users",0)
r.newPerm("create.user","admin.users",0)
r.newPerm("drop.user","admin.users",0)
r.newPerm("update.user","admin.users",0)
r.newPerm("sync.user","admin.users",0)
r.newPerm("admin.props.isHidden.group","admin.typeGroup",0)
r.newPerm("create.group","admin.typeGroup",0)
r.newPerm("drop.group","admin.typeGroup",0)
r.newPerm("update.group","admin.typeGroup",0)
r.newPerm("admin.props.isHidden.user","admin.typeUser",0)

//# sourceMappingURL=user_Perms.js.map