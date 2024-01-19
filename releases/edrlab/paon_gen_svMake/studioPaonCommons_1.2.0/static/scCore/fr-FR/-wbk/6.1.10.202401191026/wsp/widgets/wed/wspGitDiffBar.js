import{DiffPanelBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/diffBar_.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{EXmlDiffMode}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/diff.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/widgets_Perms.js"
import{callDiff}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/wed/wspDiffBar.js"
import{EGitState,WSP_GIT}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/git.js"
export class GitHeadDiffPanel extends DiffPanelBase{initPanel(action,bar){this._initPanel(action,bar)
this.shadowRoot.appendChild(this.result)
this.execDiff()
return this}setDiff(params){this.erased=params===null
this.execDiff()}buildDiffParams(){return{diffId:this.action.getId()}}async execDiff(fullRefresh){if(fullRefresh)this.erased=false
if(this.erased)return callDiff("",this,EXmlDiffMode.diff)
const gitSt=this.reg.env.longDesc.gitSt
if(gitSt===EGitState.insynch||WSP_GIT.match(gitSt,EGitState.changed)||WSP_GIT.match(gitSt,EGitState.modified)){return callDiff("special:git:head",this,EXmlDiffMode.diff)}this.wedMgr.docHolder.setDiffSession(null)
this.updateDiffResult("notFound")}}REG.reg.registerSkin("wed-diff-githead",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tjustify-content: center;\n\t}\n`)
customElements.define("wed-diff-githead",GitHeadDiffPanel)

//# sourceMappingURL=wspGitDiffBar.js.map