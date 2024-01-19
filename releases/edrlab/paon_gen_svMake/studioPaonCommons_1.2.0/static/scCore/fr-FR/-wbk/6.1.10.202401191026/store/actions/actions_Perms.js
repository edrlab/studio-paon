import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/store_Perms.js"
const r=REG.reg
r.newPerm("action.store#add.folder","upload.UTNode.content",0)
r.newPerm("action.store#add.res","upload.UTNode.content",0)
r.newPerm("action.store#edit.metasRes","edit.UTNode.metas",0)
r.newPerm("action.store#edit.res.perms","admin.UTNode.configRoles",0)
r.newPerm("action.store#import.res","upload.UTNode.content",0)
r.newPerm("action.store#moveFrom.res","edit.UTNode.metas",0)
r.newPerm("action.store#relist.res","write.UTNode.relist",0)
r.newPerm("action.store#remove.res","write.UTNode.remove",0)
r.newPerm("action.store#rename.res","edit.UTNode.metas",0)
r.newPerm("action.store#trash.res","write.UTNode.trash",0)
r.newPerm("action.store#unlist.res","write.UTNode.unlist",0)
r.newPerm("action.store#untrash.res","write.UTNode.untrash",0)

//# sourceMappingURL=actions_Perms.js.map