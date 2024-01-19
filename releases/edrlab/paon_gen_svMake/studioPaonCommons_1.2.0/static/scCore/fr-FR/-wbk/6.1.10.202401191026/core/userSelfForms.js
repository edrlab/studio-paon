import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
export function initLoginForm(form,userSelfServer,authServer,options={}){checkForm(form)
const accountInput=form.elements.namedItem("account")
const passwordInput=form.elements.namedItem("password")
const pwdLostElt=form.querySelector(".pwdLost")
const msgElt=form.querySelector(".message")
const errorElt=form.querySelector(".error")
if(!userSelfServer.config.pwdLostUrl)DOM.setHidden(pwdLostElt,true)
accountInput.value=passwordInput.value=""
accountInput.required=passwordInput.required=true
if(options.fixedAccount){accountInput.value=options.fixedAccount
accountInput.readOnly=true}else{accountInput.value=options.defaultAccount||authServer.currentAccount||""}if(accountInput.value)passwordInput.focus()
else accountInput.focus()
if(options.startMessage)showMsg(msgElt,options.startMessage)
accountInput.onchange=resetValidity
accountInput.onkeydown=resetValidity
passwordInput.onchange=resetValidity
passwordInput.onkeydown=resetValidity
if(pwdLostElt){pwdLostElt.onclick=async event=>{showMsg(errorElt)
event.preventDefault()
if(!accountInput.checkValidity()){form.reportValidity()
return}showMsg(msgElt,"Veuillez patienter...",null,null,"pending")
const response=await userSelfServer.pwdLost({nickOrAccount:accountInput.value})
showMsg(msgElt)
const result=response?response.result:"otherFailure"
switch(result){case"accountNotFound":accountInput.setCustomValidity(getMsg("Ce compte n\'existe pas.","accountNotFound",options.msgs))
form.reportValidity()
break
case"datasNotAvailable":showMsg(errorElt,"Nous ne disposons pas des informations nécessaires pour vous envoyer les instructions.","datasNotAvailable",options.msgs)
break
case"instructionsSent":accountInput.setCustomValidity("")
showMsg(msgElt,"Les instructions pour renouveler votre mot de passe vous ont été envoyées.","instructionsSent",options.msgs)
break
case"otherFailure":showMsg(errorElt,"Le système de validation des mots de passe est indisponible. Veuillez essayer ultérieurement.","otherFailure",options.msgs)
break
default:console.log(`Unknow auth result: ${result}'`)
break}}}form.onsubmit=async function(event){event.preventDefault()
const props={nickOrAccount:accountInput.value,currentPwd:passwordInput.value}
if(Desk.electron)props.cookieMaxAge=999999999
const{result:result,secondaryResults:secondaryResults}=await userSelfServer.login(props)
switch(result){case"logged":showMsg(errorElt)
accountInput.setCustomValidity("")
passwordInput.setCustomValidity("")
localStorage.setItem("login:lastAccount",props.nickOrAccount)
break
case"invalidPassword":showMsg(errorElt)
passwordInput.setCustomValidity(getMsg("Ce mot de passe est incorrect.","invalidPassword",options.msgs))
form.reportValidity()
break
case"obsoletPassword":if(options.showRenewPwd){showMsg(errorElt)
const renewPwdFrom=options.showRenewPwd()
initRenewPwdForm(renewPwdFrom,userSelfServer,authServer,{fixedAccount:accountInput.value,startMessage:getMsg("Votre mot de passe a expiré, vous devez le renouveler.","obsoletPassword",options.msgs),renewPwdDone:()=>{if(options.hideRenewPwd)options.hideRenewPwd(renewPwdFrom)
return form},showRenewPwd:options.showRenewPwd,msgs:options.msgs})}else{showMsg(errorElt,"Votre mot de passe a expiré, vous devez le renouveler.","obsoletPassword",options.msgs)}break
case"accountNotFound":showMsg(errorElt)
accountInput.setCustomValidity(getMsg("Ce compte n\'existe pas.","accountNotFound",options.msgs))
form.reportValidity()
break
case"accountDisabled":const ts=secondaryResults?secondaryResults.disabledEndDt:0
if(ts>Date.now()-5e3){const lang=document.documentElement.lang||"fr"
const date=new Date(ts)
const localeDate=date.toLocaleDateString(lang)
const localeTime=date.toLocaleTimeString(lang,{hour:"numeric",minute:"numeric"})
showMsg(errorElt,`Ce compte a été temporairement désactivé. Il sera de nouveau actif le ${localeDate} vers ${localeTime}.`,"accountDisabled",options.msgs)}else{showMsg(errorElt,"Votre compte est désactivé.","accountDisabled",options.msgs)}break
case"otherFailure":showMsg(errorElt,"Le système de validation des mots de passe est indisponible. Veuillez essayer ultérieurement.","otherFailure",options.msgs)
break
default:console.log(`Unknow auth result: '${result}'`)
break}}}export function initRenewPwdForm(form,userSelfServer,authServer,options){checkForm(form)
const accountInput=form.elements.namedItem("account")
const currentPwdInput=form.elements.namedItem("currentPwd")
const newPwdInput=form.elements.namedItem("newPwd")
const confirmPwdInput=form.elements.namedItem("confirmPwd")
const errorElt=form.querySelector(".error")
let account={value:options.fixedAccount||authServer.currentAccount}
if(accountInput){if(account.value){accountInput.value=account.value
accountInput.readOnly=true}else{accountInput.required=true
account=accountInput}}if(options.startMessage)showMsg(form.querySelector(".message"),options.startMessage)
currentPwdInput.value=newPwdInput.value=confirmPwdInput.value=""
currentPwdInput.required=newPwdInput.required=confirmPwdInput.required=true
currentPwdInput.addEventListener("input",()=>{currentPwdInput.setCustomValidity("")})
initEditPwdFields(newPwdInput,confirmPwdInput,userSelfServer,options.msgs)
form.onsubmit=async function(event){event.preventDefault()
const response=await userSelfServer.renewPwd({nickOrAccount:account.value,currentPwd:currentPwdInput.value,password:newPwdInput.value})
switch(response.result){case"updated":confirmPwdInput.setCustomValidity("")
newPwdInput.setCustomValidity("")
confirmPwdInput.setCustomValidity("")
showMsg(errorElt)
if(options.renewPwdDone){const form=options.renewPwdDone()
if(form)initLoginForm(form,userSelfServer,authServer,{defaultAccount:account.value,startMessage:"Votre mot de passe a bien été renouvelé, authentifiez-vous avec ce dernier.",showRenewPwd:options.showRenewPwd,msgs:options.msgs})}break
case"invalidToken":currentPwdInput.setCustomValidity("Votre mot de passe actuel est incorrect.")
form.reportValidity()
break
case"failedInvalidDatas":const msg=response.secondaryResults&&response.secondaryResults.msgs&&response.secondaryResults.msgs[0]
if(msg)newPwdInput.setCustomValidity(msg)
else newPwdInput.setCustomValidity("Ce mot de passe n\'est pas autorisé.")
form.reportValidity()
break
case"otherFailure":showMsg(errorElt,"Le système de validation des mots de passe est indisponible. Veuillez essayer ultérieurement.","otherFailure",options.msgs)
break
default:console.log(`Unknown auth result: '${response.result}'`)
break}}}export function initInitPwdForm(form,userSelfServer,authServer,options){checkForm(form)
const accountInput=form.elements.namedItem("account")
const newPwdInput=form.elements.namedItem("newPwd")
const confirmPwdInput=form.elements.namedItem("confirmPwd")
const errorElt=form.querySelector(".error")
if(accountInput){accountInput.value=options.account
accountInput.readOnly=true}initEditPwdFields(newPwdInput,confirmPwdInput,userSelfServer,options.msgs)
form.onsubmit=async function(event){event.preventDefault()
const response=await userSelfServer.pwdLostUpdate({nickOrAccount:options.account,updateToken:options.updateToken,password:newPwdInput.value})
switch(response.result){case"updated":confirmPwdInput.setCustomValidity("")
newPwdInput.setCustomValidity("")
confirmPwdInput.setCustomValidity("")
showMsg(errorElt)
if(options.initPwdDone){const form=options.initPwdDone()
if(form)initLoginForm(form,userSelfServer,authServer,{defaultAccount:options.account,startMessage:"Votre mot de passe a bien été initialisé, authentifiez-vous avec ce dernier.",showRenewPwd:options.showRenewPwd,msgs:options.msgs})}break
case"tooOldToken":showMsg(errorElt,getMsg("Votre demande de changement de mot de passe a expiré. Veuillez faire une nouvelle demande.","tooOldToken",options.msgs))
break
case"invalidToken":case"accountNotFound":showMsg(errorElt,"Nous n\'avons pas reconnu votre identité, l\'URL de cette page obtenue à partir du mail que vous avez reçu est probablement incorrecte. Veuillez faire une nouvelle demande.")
break
case"accountDisabled":showMsg(errorElt,"Votre demande ne peut pas être prise en compte car votre compte est désactivé.")
break
case"failedInvalidDatas":const msg=response.secondaryResults&&response.secondaryResults.msgs&&response.secondaryResults.msgs[0]
if(msg)newPwdInput.setCustomValidity(msg)
else newPwdInput.setCustomValidity("Ce mot de passe n\'est pas autorisé.")
form.reportValidity()
break
case"otherFailure":showMsg(errorElt,"Le système de validation des mots de passe est indisponible. Veuillez essayer ultérieurement.","otherFailure",options.msgs)
break
default:console.log(`Unknown auth result: '${response.result}'`)
break}}}function initEditPwdFields(newPwdInput,confirmPwdInput,userSelfServer,msgs){newPwdInput.onchange=async function(){if(this.value){if(confirmPwdInput.value===this.value){confirmPwdInput.setCustomValidity("")}const response=await userSelfServer.checkPwd({password:this.value})
if(response.result!="ok")this.setCustomValidity(response.secondaryResults.msgs[0])
else this.setCustomValidity("")}else{this.setCustomValidity("")}}
newPwdInput.onkeydown=resetValidity
confirmPwdInput.onchange=async function(){if(this.value&&this.value!==newPwdInput.value){this.setCustomValidity("Cette confirmation ne correspond pas au nouveau mot de passe saisi.")}else{this.setCustomValidity("")}}
confirmPwdInput.onkeydown=resetValidity}function resetValidity(){this.setCustomValidity("")}function getMsg(message,key,map){return map&&key&&map[key]?map[key]:message}function showMsg(msgElt,message,key,map,msgType){if(map&&key&&map[key])message=map[key]
if(msgElt){DOM.setAttr(msgElt,"data-type",msgType)
if(message){msgElt.innerHTML=message
msgElt.hidden=false}else{msgElt.innerHTML=""
msgElt.hidden=true}}else if(message){alert(message)}}function checkForm(form){if(!(form instanceof HTMLFormElement)){document.body.textContent="Configuration error"
throw Error("form is not a HTMLFormElement : "+form)}if(form.method!=="post")form.method="post"}
//# sourceMappingURL=userSelfForms.js.map