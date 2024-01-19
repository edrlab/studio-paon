import{CellBuilderFlagIcon}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{WSP_GIT}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/git.js"
import{DiffBarPanelAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/diffBar.js"
import{NavigatorArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/areas/wspWorkbench.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{NavigatorFacetText}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/navigator.js"
class CellBuilderGitFlag extends CellBuilderFlagIcon{constructor(){super(...arguments)
this.iconWidth=".8rem"
this.iconFilter="var(--filter)"}_getIcon(row){const st=WSP_GIT.getSimpleState(super._getValue(row))
return st!=="insynch"&&st!=="none"?"--git-"+st+"-url":""}_getValue(row){return WSP_GIT.getGitStateLabel(WSP_GIT.getSimpleState(super._getValue(row)))}}REG.reg.registerSkin("wsp-explorer/grid/git",1,`\n\t:host {\n\t\t--git-untracked-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/gitState/untracked.svg);\n\t\t--git-ignored-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/gitState/ignored.svg);\n\t\t--git-adding-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/gitState/adding.svg);\n\t\t--git-updating-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/gitState/updating.svg);\n\t\t--git-deleting-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/gitState/deleting.svg);\n\t\t--git-conflict-url: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/objects/gitState/conflict.svg);\n\t}\n\n\t.git {\n\t\tborder: none !important;\n\t}\n`)
export function initGitReg(reg){const gitColDef=new GridColDef("git").setFlex("1rem",0,0).setCellBuilder(new CellBuilderGitFlag("gitSt")).setSkin("wsp-explorer/grid/git").setLabel("").setDescription("Statut Git")
gitColDef.isAvailable=function(grid){var _a,_b
return((_b=(_a=reg.env.wsp.infoWsp)===null||_a===void 0?void 0:_a.srcFields)===null||_b===void 0?void 0:_b.gitSt)!=null}
reg.addToList("columns:wspExplorer:secondaryCols","git",1,gitColDef,10)
reg.addToList("columns:netItems:secondaryCols","git",1,gitColDef,10)
reg.addToList("columns:itemFoderTree:secondaryCols","git",1,gitColDef,10)
reg.addToList("columns:wspApp:searches:item","git",1,gitColDef)
class GitHeadDiffAction extends DiffBarPanelAction{constructor(id){super(id||"gitHead")
this._label="Git head"}async buildPanel(ctx,ev){return(new((await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/wed/wspGitDiffBar.js")).GitHeadDiffPanel)).initPanel(this,ctx)}}reg.addToList("wed.diffBar.actions","gitHead",1,new GitHeadDiffAction)
reg.addToList("wspApp:tools:rb","gitChanges",1,new NavigatorArea("gitChanges").setLabel("Git").setDescription("Changements locaux Git").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/navigator/gitChanges.svg").setEmptyTree(n=>JSX.createElement("c-msg",{label:"Aucune différence locale",level:"info"})).setBuildFacets(async(nav,fields)=>new NavigatorFacetGitChanges(fields)).setActionsLists(["actions:wspApp:navigator","actions:wsp:shortDesc"]).setAccelKeysLists(["accelkeys:wspApp:navigator","accelkeys:wsp:shortDesc"]),10)
const lstnFocusWin=()=>{reg.env.universe.httpFrames.web.fetchSvc("u/srcGit","RefreshWspIndexDiff","param="+encodeURIComponent(reg.env.wsp.code))}
window.addEventListener("focus",lstnFocusWin)
reg.onRegClose.add(()=>{window.removeEventListener("focus",lstnFocusWin)})}export class NavigatorFacetGitChanges extends NavigatorFacetText{initSkin(){this.skin=["wsp-navigator/facetText"]}buildUiFacets(nav,lastDatas){this.initRoot(nav).append(JSX.createElement("div",{class:"h"},this.buildTextInput(nav,lastDatas),nav.navigatorBtns))}getCriterions(){const exp=DOM.sharedXmlDoc().createElement("exp")
exp.setAttribute("type","GitState")
exp.setAttribute("gitStates","dirty")
exp.setAttribute("deep","true")
exp.setAttribute("refresh","true")
return LANG.pushIfDefined([exp],this.getTextCriterion())}}
//# sourceMappingURL=gitOverrides.js.map