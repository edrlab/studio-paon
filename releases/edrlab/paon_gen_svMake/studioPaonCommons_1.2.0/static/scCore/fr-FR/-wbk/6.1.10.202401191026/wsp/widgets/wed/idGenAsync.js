import{UNIVERSE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/universe.js"
class IdGenAsyncMgr{constructor(svc,cdaction,params,universe){this.svc=svc
this.cdaction=cdaction
this.params=params
this.universe=universe}needNewVal(schemaDom,nodeOrAttr,rule){const house=schemaDom.house
if(!house.wsp.reg.hasPermission("write.node.update",house.srcFields.srcRoles,this.universe.auth.currentUser.isSuperAdmin,house.srcFields.srcRi))return false
return nodeOrAttr instanceof Attr?!nodeOrAttr.nodeValue:!nodeOrAttr.textContent}async newValue(schemaDom,nodeOrAttr,rule){let itemType=schemaDom.house.itemType
if(!itemType){await Promise.resolve()
itemType=schemaDom.house.itemType}return this.fetchValue(itemType.reg)}async fetchValue(reg){const univ=this.universe||reg.env.universe
const val=(await univ.httpFrames.web.fetchSvcJson(this.svc,this.cdaction,this.params)).nextValue
if(typeof val==="string")return val
if(typeof val==="number")return val.toString()
return null}}export const crossDomMgrFactory=config=>()=>{const univ=config.getAttribute("universe")
const universe=univ?UNIVERSE.all.get(univ):null
const p=config.getAttribute("params")
return new IdGenAsyncMgr(config.getAttribute("svc"),config.getAttribute("cdaction"),p?JSON.parse(p):null,universe)}

//# sourceMappingURL=idGenAsync.js.map