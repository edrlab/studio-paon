import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{Area,AREAS,CustomTagArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
export class UserPrefPageConfig extends Area{constructor(reg){super()
this.reg=reg}get persistUserDatas(){return this.reg.getPersistUserStates()}setAreasList(areasList){this.areasList=areasList
return this}needAsync(ctx){return true}buildBody(ctx){throw Error("not used")}async loadBody(ctx,lastDatas){const form=JSX.createElement("form",null)
const areas=(this.areas||this.reg.getList(this.areasList)).map(a=>typeof a==="function"?a():a)
await AREAS.applyLayout(form,await Promise.all(areas),{userPrefCtn:ctx,editorConfig:this,reg:this.reg})
form.area=this
form.areaContext=ctx
form.onViewBeforeHide=function(){var _a,_b
return(_b=(_a=DOMSH.findHost(this))===null||_a===void 0?void 0:_a.onViewBeforeHide())!==null&&_b!==void 0?_b:true}
form.onViewWaitForHide=function(){var _a
return((_a=DOMSH.findHost(this))===null||_a===void 0?void 0:_a.onViewWaitForHide())||Promise.resolve(true)}
return form}}UserPrefPageConfig.LIST_userPrefPages="user:prefs"
UserPrefPageConfig.ENTRY_PAGE_front="front"
UserPrefPageConfig.LIST_userPrefsFrontPage="user:prefs:front"
REG.reg.addToList(UserPrefPageConfig.LIST_userPrefPages,UserPrefPageConfig.ENTRY_PAGE_front,1,new UserPrefPageConfig(REG.reg).setAreasList(UserPrefPageConfig.LIST_userPrefsFrontPage).setLabel("Général"),1)
export class CheckPrefArea extends CustomTagArea{constructor(prefKey){super(prefKey)
this.isReloadAppNeeded=false
this.invertCheck=false
this.checkStateIfNone=false
this.requireLib(lib)
this.tagName="c-userpref-check"}setReloadAppNeeded(){this.isReloadAppNeeded=true
return this}setInvertCheck(){this.invertCheck=true
return this}setCheckStateIfNone(st){this.checkStateIfNone=st
return this}getInit(ctx){return{reg:ctx.reg,area:this,areaContext:ctx}}}export class SelectPrefArea extends CustomTagArea{constructor(prefKey){super(prefKey)
this.isReloadAppNeeded=false
this.requireLib(lib)
this.tagName="c-userpref-select"}setBuildOptions(buildOptions){this._buildOptions=buildOptions
return this}buildOptions(selectElt,currentVal){this._buildOptions(selectElt,currentVal)}setReloadAppNeeded(){this.isReloadAppNeeded=true
return this}getInit(ctx){return{reg:ctx.reg,area:this,areaContext:ctx}}}const lib=IO.asEndPoint("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/userPrefEditor.js")

//# sourceMappingURL=userPrefEditorConfig.js.map