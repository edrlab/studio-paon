import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{BaseElement,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{JSX,ShadowJsx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{CDM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/cdm.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
export function openNotifUsers(regs){POPUP.showDialog((new NotifUsers).initialize({regs:regs}),document.body,{titleBar:{barLabel:{label:"Notification aux utilisateurs connectés"}},resizer:{}})}export class NotifUsers extends BaseElement{get msgInput(){return this.shadowRoot.getElementById("msg")}get timeInput(){return this.shadowRoot.getElementById("time")}get sendBtn(){return this.shadowRoot.getElementById("send")}get infoArea(){return this.shadowRoot.getElementById("info")}async _initialize(init){this.regs=init.regs
const reg=this.regs[0]
if(!init.reg)init.reg=reg
this._attach(this.localName,init,JSX.createElement(Button,{"î":{reg:reg,label:"Voir les utilisateurs connectés...",uiContext:"dialog"},onclick:this.onShowUsers}),JSX.createElement("div",{class:"tiArea"},"Envoyer un message à tous les utilisateurs connectés :"),JSX.createElement("div",{class:"area"},JSX.createElement("div",null,JSX.createElement("label",{class:"label",for:"time"},"Heure prévue"),JSX.createElement("input",{id:"time",type:"time"})),JSX.createElement("div",{id:"msgTypes"},JSX.createElement("label",{class:"label"},"Message type"),JSX.createElement(Button,{"î":{reg:reg,label:"Mise à jour",uiContext:"dialog"},value:"update",onclick:this.onMsgType}),JSX.createElement(Button,{"î":{reg:reg,label:"Redémarrage",uiContext:"dialog"},value:"restart",onclick:this.onMsgType}),JSX.createElement(Button,{"î":{reg:reg,label:"Arrêt",uiContext:"dialog"},value:"shutdown",onclick:this.onMsgType})),JSX.createElement("label",{for:"msg"},"Message à envoyer"),JSX.createElement("input",{id:"msg"}),JSX.createElement("div",{class:"footer"},JSX.createElement(Button,{id:"send","î":{reg:reg,label:"Envoyer",uiContext:"dialog"},onclick:this.send}),JSX.createElement(MsgLabel,{id:"info",hidden:""}))),JSX.createElement("div",{class:"tiArea"},"Mode maintenance :"),JSX.createElement("div",{class:"area"},JSX.createElement("div",{style:"display:flex"},"État(s) du mode maintenance",JSX.createElement(Button,{"î":{reg:reg,icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/refresh.svg",title:"Rafraîchir l\'état du mode maintenance"},onclick:this.onMtncState})),JSX.createElement("ul",{id:"mtncStates"},this.regs.map(r=>JSX.createElement("li",null,JSX.createElement("span",null,r.env.universe.config.name)," : ",JSX.createElement("span",{id:`mtncSt_${r.env.universe.config.id}`})))),JSX.createElement("div",{class:"footer"},JSX.createElement(Button,{id:"send","î":{reg:reg,label:"Activer la maintenance...",uiContext:"dialog"},onclick:this.setMaintenanceOn}),JSX.createElement(Button,{id:"send","î":{reg:reg,label:"Désactiver la maintenance",uiContext:"dialog"},onclick:this.setMaintenanceOff}))))
reg.installSkin("webzone:panel",this.shadowRoot)
reg.installSkin("form-control-areas",this.shadowRoot)
this.refreshMtncState()}async onShowUsers(){const me=DOMSH.findHost(this)
const lists=await Promise.all(me.regs.map(reg=>reg.env.universe.config.liaiseUrl.fetchJson(IO.qs("cdaction","ListClients","datas","(community'all')"))))
const users=new Set
lists.forEach(entry=>{entry.forEach(u=>{users.add(u.account)})})
const count=users.size
POPUP.showDialog(JSX.createElement("p",{style:"margin: .5em"},Array.from(users).join("\n")),this,{titleBar:{barLabel:{label:`${count} utilisateur(s) connecté(s)`}}})}onMtncState(){DOMSH.findHost(this).refreshMtncState()}refreshMtncState(){this.regs.forEach(async reg=>{const resp=await reg.env.universe.config.maintenanceUrl.fetchText()
const msg=this.shadowRoot.getElementById(`mtncSt_${reg.env.universe.config.id}`)
if(resp){msg.textContent="Maintenance en cours"
msg.title=JSON.parse(resp).msg[0].label
msg.className="mtncOn"}else{msg.textContent="-"
msg.title="Pas de maintenance en cours"
msg.className="mtncOff"}})}onMsgType(){const me=DOMSH.findHost(this)
const type=this.getAttribute("value")
me.previousType=type||undefined
if(!type)return
const tm=me.timeInput.valueAsNumber
let time
if(tm>=0){const dt=new Date
dt.setHours(0,0,0,0)
dt.setTime(dt.getTime()+tm)
time=new Intl.DateTimeFormat("fr",{timeStyle:"short"}).format(dt)}switch(type){case"update":me.msgInput.value=time?`Attention, une mise à jour du serveur est prévue vers ${time}`:"Attention, une mise à jour du serveur est imminente"
break
case"shutdown":me.msgInput.value=time?`Attention, un arrêt du serveur est prévu vers ${time}`:"Attention, l\'arrêt du serveur est imminent"
break
case"restart":me.msgInput.value=time?`Attention, un redémarrage du serveur est prévu vers ${time}`:"Attention, le redémarrage du serveur est imminent"
break}}send(){const me=DOMSH.findHost(this)
const msg=me.msgInput.value
if(!msg){me.infoArea.setCustomMsg("Saisissez un message","error")
return}me.sendBtn.disabled=true
setTimeout(()=>{me.sendBtn.disabled=false
me.infoArea.setCustomMsg(null)},5e3)
const tm=me.timeInput.valueAsNumber
let until
if(tm>=0){const now=Date.now()
const dt=new Date(now)
dt.setHours(0,0,0,0)
dt.setTime(dt.getTime()+tm)
until=now>dt.getTime()?dt.getTime()+864e5:dt.getTime()}try{for(let reg of me.regs){const m={svc:"liaise",type:"maintenance",opType:me.previousType,msg:msg,until:until}
reg.env.universe.config.liaiseUrl.fetchVoid(IO.qs("cdaction","DispatchMsg","datas",CDM.stringify(m)),{method:"POST"})}me.infoArea.setCustomMsg("Le message a été envoyé","info")}catch(e){me.infoArea.setCustomMsg("Envoi du message en échec","error")
console.log(e)}}setMaintenanceOn(){const me=DOMSH.findHost(this)
const popup=POPUP.showDialog(JSX.createElement("div",{style:"margin:.5em"},JSX.createElement(ShadowJsx,{skin:"webzone:panel"},JSX.createElement("div",null,"Message de maintenance aux utilisateurs :"),JSX.createElement("input",{id:"txt",style:"width:40em; font-size:inherit;",value:"Le serveur est actuellement en maintenance, remise en service prévue vers XXXX."}),JSX.createElement(Button,{"î":{reg:me.regs[0],label:"Entrer en maintenance",uiContext:"dialog"},onclick:async function(){this.disabled=true
try{const input=DOMSH.findHost(this).shadowRoot.getElementById("txt")
if(!input.value)POPUP.showNotifError("Saisissez un message de maintenance",this)
else{await me.setMaintenance(input.value)
popup.close()}}catch(e){this.disabled=false
ERROR.report("Set maintenance mode failed",e)}}}))),me,{titleBar:{barLabel:{label:"Mode maintenance"}}})}setMaintenanceOff(){DOMSH.findHost(this).setMaintenance()}async setMaintenance(txt){await Promise.all(this.regs.map(reg=>reg.env.universe.config.maintenanceUrl.fetchVoid(IO.qs("cdaction","SetMaintenanceMode","param",txt),{method:"POST"})))
this.refreshMtncState()}}REG.reg.registerSkin("c-notif-users",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tmin-width: 40em;\n\t}\n\n\t.tiArea {\n\t\tmargin: .5em;\n\t}\n\n\t.area {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tpadding: .5em;\n\t\tborder: 1px solid var(--border-color);\n\t\tmargin: .5em;\n\t}\n\n\t#msgTypes {\n\t\tdisplay: flex;\n\t}\n\n\t#time {\n\t\tmargin: .5em;\n\t}\n\n\n\t#msg {\n\t\tpadding: .5em;\n\t\tfont-weight: bold;\n\t}\n\n\t.footer {\n\t\tdisplay: flex;\n\t\tjustify-content: center;\n\t}\n\n\t.label {\n\t\tdisplay: inline-block;\n\t\tmin-width: 9em;\n\t\tmargin: .5em 0;\n\t}\n\n\t.mtncOff {\n\t\tcolor: var(--fade-color);\n\t}\n\n\t.mtncOn {\n\t\tcolor: var(--warning-color);\n\t}\n`)
customElements.define("c-notif-users",NotifUsers)

//# sourceMappingURL=notifUsers.js.map