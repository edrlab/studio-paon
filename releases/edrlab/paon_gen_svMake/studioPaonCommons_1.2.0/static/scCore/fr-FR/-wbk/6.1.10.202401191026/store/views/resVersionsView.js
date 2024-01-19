import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{URLTREE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/urlTree.js"
import{ButtonActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{InfoFocusRes}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/res.js"
import{LOCALE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
export class ResVersionsView extends ButtonActions{_initialize(init){var _a
this.reg=this.findReg(init)
super._initialize(init)
this.reg.installSkin(this.localName,this.shadowRoot)
this.showDate=init.showDate
this.onlyChangedContent=init.onlyChangedContent;(_a=this.reg.env.nodeInfosChange)===null||_a===void 0?void 0:_a.on("histChange",this._histLstn=()=>{this.refresh()})}_refresh(){var _a,_b
const env=this.reg.env
if(env.nodeInfos){this._label=this.buildVersionName(env.nodeInfos)
const actions=[]
let ni=env.nodeInfos
while(ni.succ&&ni.succ[0]){ni=ni.succ[0]
actions.push(new GotoNode(ni))}actions.reverse()
actions.push(new ThisNode(env.nodeInfos))
if(env.nodeInfos.hist)for(let node of env.nodeInfos.hist){actions.push(new GotoNode(node))}if(this.onlyChangedContent){let filteredActions=[]
actions.reduce((contentId,currentValue)=>{const resId=currentValue.ni.resId
if(!resId.startsWith(contentId)){contentId=resId.substring(0,ni.resId.length-3)
filteredActions.push(currentValue)}else if(currentValue instanceof ThisNode){filteredActions.push(currentValue)}return contentId},"-")
this.actions=filteredActions}else{this.actions=actions}}else if(env.nodeInfosPending){env.nodeInfosPending.then(this.refresh.bind(this))
return}else{this._label="?"
this.actions=[]}this.disabled=this._actions.length<1
const notHead=((_b=(_a=env.nodeInfos)===null||_a===void 0?void 0:_a.succ)===null||_b===void 0?void 0:_b.length)>0
this.classList.toggle("notHead",notHead)
DOM.setAttr(this,"title",notHead?"Attention, cette version n\'est pas la dernière":null)
super._refresh()}onViewHidden(closed){var _a
if(closed&&this._histLstn){(_a=this.reg.env.nodeInfosChange)===null||_a===void 0?void 0:_a.removeListener("histChange",this._histLstn)}}buildVersionName(ni){const version=ni.v||""
if(this.showDate&&ni.m){const date=LOCALE.formatDateDigitsToSec.format(ni.m)
return`Version ${version} du ${date}`}return ni.v||" "}}class GotoNode extends Action{constructor(ni){super()
this.ni=ni}getIcon(ctx){return ctx.reg.env.resTypes.getResTypeFor(this.ni).resIcon(this.ni)}getLabel(ctx){return ctx.buildVersionName(this.ni)}execute(ctx,ev){ctx.reg.env.infoBroker.dispatchInfo(new InfoFocusRes(URLTREE.switchLeafVersionPath(ctx.reg.env.nodeInfos.permaPath,this.ni.v||this.ni.idx)),ctx)}}class ThisNode extends GotoNode{isToggle(ctx){return true}getDatas(api,ctx){return api==="toggle"?true:null}isEnabled(ctx){return false}}REG.reg.registerSkin("store-res-versions",1,`\n\t:host(.notHead) > span {\n\t\tpadding-inline-start: 1.5em;\n\t\tbackground: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/views/resViews/notHead.svg) no-repeat left / contain;\n\t}\n`)
customElements.define("store-res-versions",ResVersionsView)

//# sourceMappingURL=resVersionsView.js.map