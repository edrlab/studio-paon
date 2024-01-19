import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/basis_Perms.js"
const r=REG.reg
r.newPerm("read.UTNode","read",0)
r.newPerm("write.UTNode","write",0)
r.newPerm("admin.UTNode","admin",0)
r.newPerm("view.depot","read",0)
r.newPerm("read.UTNode.webView","read.UTNode",0)
r.newPerm("preview.UTNode.evenIfTrashed","write.UTNode",0)
r.newPerm("write.UTNode.trash","write.UTNode",0)
r.newPerm("admin.UTNode.configRoles","admin.UTNode",0)
r.newPerm("admin.UTNode.configRoles.byAdmin","admin.UTNode",0)
r.newPerm("upload.UTNode.content","write.UTNode",0)
r.newPerm("edit.UTNode.metas","write.UTNode",0)
r.newPerm("write.UTNode.untrash","write.UTNode",0)
r.newPerm("write.UTNode.remove","write.UTNode",0)
r.newPerm("write.UTNode.unlist","write.UTNode",0)
r.newPerm("write.UTNode.relist","write.UTNode",0)
r.newPerm("upload.QueryUTNode","admin.UTNode",0)

//# sourceMappingURL=store_Perms.js.map