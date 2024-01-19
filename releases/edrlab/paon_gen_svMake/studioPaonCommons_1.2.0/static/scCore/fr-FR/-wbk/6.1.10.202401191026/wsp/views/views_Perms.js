import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp_Perms.js"
const r=REG.reg
r.newPerm("action.wspList#open.wsp","read.wsp",0)
r.newPerm("action.dynGen#edit.node","write.node.update",4)
r.newPerm("action.itemCodeEd#edit","write.node.update",4)
r.newPerm("action.itemXmlEd#edit","write.node.update",4)
r.newPerm("action.itemMainView#edit.content","write.node.update",4)
r.newPerm("ui.searches.export.items","read.node.export",0)
r.newPerm("ui.searches.export.props","read.node.search",0)
r.newPerm("action.tasks#create.task","write.task.create",0)
r.newPerm("ui.task.fields.deleteBtn","write.task.delete",0)

//# sourceMappingURL=views_Perms.js.map