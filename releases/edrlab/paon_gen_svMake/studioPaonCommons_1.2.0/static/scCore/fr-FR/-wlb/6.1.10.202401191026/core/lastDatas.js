import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
import{LASTDATAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lastDatas.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
export class LastDatasDeskFeat extends Desk{static add(desk,auth){if(this.isIn(desk))return desk
const d=desk
d.assignProps(this)
d.ldSession=""
REG.reg.addToList(Desk.LC_init,"lastDatas",1,()=>{var _a
d.maxUserSessions=10
if(!document.documentElement.getParentLastDatas){document.documentElement.getParentLastDatas=()=>desk.lastDatas}if(auth===undefined)auth=((_a=REG.reg.env.universe)===null||_a===void 0?void 0:_a.auth)||null
d._fetchLastDatas(auth)
if(auth)auth.listeners.on("loggedUserChanged",(oldUser,newUser)=>{if(oldUser)d.saveLastDatas(oldUser.account)
d._fetchLastDatas(auth)},-10)
if(Desk.electron){window.addEventListener("beforeunload",()=>{if(!auth||auth.currentUser)d.saveLastDatas((auth===null||auth===void 0?void 0:auth.currentAccount)||"")})}else{document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"&&(!auth||auth.currentUser)){d.saveLastDatas((auth===null||auth===void 0?void 0:auth.currentAccount)||"")}})}},0)
return d}_fetchLastDatas(auth){try{const v=localStorage.getItem(`lastDatas:desk:${this.name}:${(auth===null||auth===void 0?void 0:auth.currentAccount)||""}:${this.ldSession}`)
this.lastDatas=v?JSON.parse(v):null}catch(e){this.lastDatas=null}}saveLastDatas(user){const datas=LASTDATAS.buildDocumentLastDatas()
const key=`lastDatas:desk:${this.name}`
localStorage.setItem(`${key}:${user}:${this.ldSession}`,JSON.stringify(datas))
let mapUsers
const map=localStorage.getItem(key)
if(map){mapUsers=JSON.parse(map)
mapUsers=mapUsers.filter(e=>e.u!==user||e.s!==this.ldSession)
while(mapUsers.length>this.maxUserSessions){localStorage.removeItem(key+":"+mapUsers[0].u)
mapUsers.splice(0,1)}}else{mapUsers=[]}mapUsers.push({u:user,t:Date.now(),s:this.ldSession})
localStorage.setItem(key,JSON.stringify(mapUsers))}static isIn(desk){return"_fetchLastDatas"in desk}}
//# sourceMappingURL=lastDatas.js.map