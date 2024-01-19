import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{Area,SimpleTagArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{Button,ButtonActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{ACTION,Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{SearchAnd,SearchFree,SearchFullXPath,SearchItemLinks,SearchNot,SearchOccurencesSubExp,SearchOr,SearchRegexpUri}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
export function IS_UiCritWidget(n){return n instanceof HTMLElement&&"buildCrit"in n}export function buildCritAreaFromXml(elt,criterions){if(!elt)return undefined
const key=elt.getAttribute("uiCrit")||elt.localName
return(criterions?criterions[key]:null)||UiCritUnknown.AREA}export class UiCritArea extends SimpleTagArea{buildBody(ctx){const w=super.buildBody(ctx)
w.critArea=this
return w}canReplace(uiCrit,ctx){if(!this.replacePattern||!uiCrit.critArea.critSgn)return false
return this.replacePattern.test(uiCrit.critArea.critSgn)}setCritSgn(critSgn){this.critSgn=critSgn
return this}setReplacePattern(replacePattern){this.replacePattern=replacePattern
return this}setCanReplace(fct){this.canReplace=fct
return this}buildAbstract(xml,ctx,options){return JSX.createElement("span",{class:"crit"},this.getLabel(ctx))}setBuildAbstract(fct){this.buildAbstract=fct
return this}buildWedSearch(xml,criterions){return undefined}setBuildWedSearch(fct){this.buildWedSearch=fct
return this}}export class UiCritBase extends BaseElement{_initialize(init){if(!this.criterions)this.criterions=init.criterions
this.reg=this.findReg(init)
this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("wsp-uicrit",this.shadowRoot)
this._initAndInstallSkin(this.localName,init)
this.onChange=this.dispatchChangeEvent.bind(this)}static initHeadFromArea(critArea,ctx,headElt){if(critArea&&headElt){const desc=critArea.getDescription(ctx)
if(desc)headElt.title=desc}}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
if(!init.criterions){const criterionsHolder=DOMSH.findParentElt(this,null,n=>n.criterions!=null)
if(criterionsHolder)init.criterions=criterionsHolder.criterions}return init}async initFromInsAction(xml){if(xml)await this.initFromXmlCrit(xml)
this.dispatchChangeEvent()
return this}buildUiXmlCrit(){const crit=this.buildCrit()
if(!crit)return undefined
const elt=crit.toDom()
if(elt)elt.setAttribute("uiCrit",this.getUiCritXmlAtt())
return elt}getUiCritXmlAtt(){return this.localName}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent("wsp-uicrit-change",{bubbles:true}))}insertAlternativesBtn(init){if(init.hideAlternativesBtn)return null
class CritAction extends Action{constructor(area,replace){super(area.getId())
this.area=area
this.replace=replace}getLabel(ctx){return this.area.getLabel(ctx)}async execute(ctx,ev){const elt=(await this.area.loadBody(ctx)).initialize(ctx)
const currentCritXml=this.replace.buildUiXmlCrit()
this.replace.parentNode.insertBefore(elt,this.replace)
this.replace.remove()
elt.initFromInsAction(currentCritXml)}}const actions=[]
for(const area of Object.values(init.criterions)){if(area!==this.critArea&&area.canReplace(this,init)&&area.isVisible(this))actions.push(new CritAction(area,this))}return actions.length>0?this.buildAlternativesBtn(actions,this.findReg(init)):null}buildAlternativesBtn(actions,reg){return JSX.createElement(ButtonActions,{class:"altBtn","î":{reg:reg,label:"⇄",actions:actions,actionContext:this}})}}REG.reg.registerSkin("wsp-uicrit",1,`\n\t:host {\n\t\tdisplay: block;\n\t\tpadding: 2px;\n\t\toverflow: hidden;\n\t}\n\n\t:focus-visible {\n\t\toutline: var(--focus-outline);\n\t}\n\n\t.critHead {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tuser-select: none;\n\t\talign-items: center;\n\t}\n\n\t.critTitle {\n\t\tfont-weight: bold;\n\t\tmargin: 2px;\n\t}\n\n\tc-button-actions {\n\t\tmin-width: fit-content;\n\t}\n\n\t.h {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: row;\n\t\talign-items: center;\n\t}\n\n\tinput[type=search] {\n\t\tflex: 1;\n\t}\n\n\t.inputsCtn {\n\t\tmargin-inline-start: 1em;\n\t}\n\n\tinput, select {\n\t\tmargin-inline-start: 1em;\n\t\tbackground-color: var(--form-bgcolor);\n\t\tcolor: var(--form-color);\n\t\tborder: 1px solid var(--border-color);\n\t\tfont-size: inherit;\n\t}\n\n\t.opt {\n\t\tfont-size: var(--label-size);\n\t\tdisplay: flex;\n\t\talign-items: center;\n\t\tuser-select: none;\n\t}\n\n\t:invalid {\n\t\tborder-color: var(--error-color);\n\t\tcolor: var(--error-color);\n\t}\n\n\t.altBtn {\n\t\tdisplay: inline-flex;\n\t\tbackground: var(--insbtn-bg);\n\t\tcolor: var(--insbtn-color);\n\t\tborder: 1px outset var(--border-color);\n\t\tborder-radius: 3px;\n\t\tmargin: 0 2px;\n\t\tpadding: 2px;\n\t}\n\n\t.altBtn:hover {\n\t\tbackground: var(--insbtn-hover-bg);\n\t}\n`)
class UiCritBoolArea extends Area{constructor(id,hideCritHeader){super(id)
this.hideCritHeader=hideCritHeader
if(!hideCritHeader)this._group="bool"}getLabel(ctx){return this._id==="or"?"Groupe de critères (... OU ...)":"Groupe de critères (... ET ...)"}buildBody(ctx){const w=new UiCritBool
w.critArea=this
return w}canReplace(uiCrit,ctx){return uiCrit instanceof UiCritBool}buildAbstract(xml,ctx,options){const liaise=this._id==="or"?" OU ":" ET "
const liaiseNot=this._id==="or"?" OU SAUF ":" ET SAUF "
const chAbstract=[]
for(let ch=xml.firstElementChild;ch;ch=ch.nextElementSibling){const isNot=ch.localName==="not"
const chXml=isNot?ch.firstElementChild:ch
const chCrit=buildCritAreaFromXml(chXml,ctx.criterions)
const sub=chCrit?chCrit.buildAbstract(chXml,ctx):JSX.createElement("span",{class:"critUnknown"},JSX.createElement("span",{class:"xml"},DOM.ser(chXml)))
if(sub){if(chAbstract.length>0)chAbstract.push(JSX.createElement("span",{class:"boolOp"},isNot?liaiseNot:liaise))
else if(isNot)chAbstract.push(JSX.createElement("span",{class:"boolOp"}," SAUF "))
chAbstract.push(sub)}}if(chAbstract.length===0)return undefined
if(this.hideCritHeader)return JSX.createElement("span",null,chAbstract)
return JSX.createElement("span",{class:"boolGroup"},JSX.createElement("span",{class:"boolBracket"},"("),chAbstract,JSX.createElement("span",{class:"boolBracket"},")"))}buildWedSearch(xml,criterions){for(let ch=xml.firstElementChild;ch;ch=ch.nextElementSibling){const chCrit=buildCritAreaFromXml(ch,criterions)
if(chCrit&&"buildWedSearch"in chCrit){const s=chCrit.buildWedSearch(ch,criterions)
if(s)return s}}}}export class UiCritBool extends UiCritBase{get booleanOp(){return this.critArea.getId()}_initialize(init){super._initialize(init)
if(!this.critArea.hideCritHeader){const head=this.shadowRoot.appendChild(JSX.createElement("div",{id:"critHead"}))
this.label=head.appendChild(JSX.createElement("span",null))
head.appendChild(this.buildAlternativesBtn([new Action("altBool").setLabel(ctx=>this.critArea===UiCritBool.AREA_AND?UiCritBool.AREA_OR.getLabel(ctx):UiCritBool.AREA_AND.getLabel(ctx)).setExecute(()=>{this.critArea=this.critArea===UiCritBool.AREA_AND?UiCritBool.AREA_OR:UiCritBool.AREA_AND
this._refresh()})],this.reg))}this.shadowRoot.appendChild(JSX.createElement("slot",{id:"critCh"}))
this.addEventListener("wsp-uicrit-toDelete",ev=>{const ch=ev.target
if(ch&&ch.parentElement===this)this.deleteCrit(ch)
ev.stopImmediatePropagation()})}async initFromXmlCrit(xml){this.refreshFreeze(1)
try{for(let ch=xml.firstElementChild;ch;ch=ch.nextElementSibling){const isNot=ch.localName==="not"
const critXml=isNot?ch.firstElementChild:ch
const critArea=buildCritAreaFromXml(critXml,this.criterions)
if(critArea){const crit=await critArea.loadBody(this)
if(crit){crit.initialize(this)
await crit.initFromXmlCrit(critXml)
this.insertCrit(crit,isNot)}}}}finally{this.refreshFreeze(-1)}return this}buildCrit(){const crit=this.booleanOp==="or"?new SearchOr:new SearchAnd
for(let ch=DOM.findFirstChild(this,IS_UiCritWidget);ch;ch=DOM.findNextSibling(ch,IS_UiCritWidget)){LANG.pushIfDefined(crit,ch.buildCrit())}return crit.length>0?crit:undefined}buildUiXmlCrit(){return JSX.asXml(()=>{const root=this.booleanOp==="or"?JSX.createElement("or",null):JSX.createElement("and",null)
if(!this.critArea.hideCritHeader)root.setAttribute("uiCrit",this.booleanOp==="or"?"wsp-uicrit-bool:or":"wsp-uicrit-bool:and")
for(let ch=DOM.findFirstChild(this,IS_UiCritWidget);ch;ch=DOM.findNextSibling(ch,IS_UiCritWidget)){const sub=ch.buildUiXmlCrit()
if(sub)root.appendChild(sub)}return root})}insertCrit(crit,notOp,insertBefore){const notOpt=(new UiCritNotOptional).initialize(this).initFromContext(this.booleanOp,notOp)
notOpt.appendChild(crit)
this.insertBefore(notOpt,insertBefore)
crit.initFromInsAction()
this.refresh()}deleteCrit(crit){crit.remove()
this.dispatchChangeEvent()
this.refresh()}_refresh(){const op=this.booleanOp
if(this.label)DOM.setTextContent(this.label,op==="and"?"Tous les sous-critères sont remplis":"Au moins un des sous-critères est rempli")
let insFound=false
for(let ch=this.firstElementChild;ch;){const next=ch.nextElementSibling
if(ch instanceof Button){if(insFound)ch.remove()
else insFound=true}else if(ch instanceof UiCritNotOptional){ch.booleanContext=op
if(!insFound)this._insertAddBtn(ch)
else insFound=false}ch=next}if(!insFound)this._insertAddBtn(null)}_insertAddBtn(before){this.insertBefore(JSX.createElement(Button,{class:"insCrit",skin:"wsp-uicrit-bool/insCrit",label:"+",title:"Insérer un critère",onclick:this.onInsert}),before)}onInsert(ev){class CritAction extends Action{constructor(critArea){super(critArea.getId())
this.critArea=critArea}getGroup(ctx){return this.critArea.getGroup(ctx.parentElement)}getLabel(ctx){return this.critArea.getLabel(ctx.parentElement)}getIcon(ctx){return this.critArea.getIcon(ctx.parentElement)}getDescription(ctx){return this.critArea.getDescription(ctx.parentElement)}isVisible(ctx){return this.critArea.isVisible(ctx.parentElement)}isEnabled(ctx){return this.critArea.isEnabled(ctx.parentElement)}async execute(ctx,ev){const critCtn=ctx.parentElement
critCtn.insertCrit(await this.critArea.loadBody(critCtn),false,ctx)}}const critCtn=this.parentElement
let crits=Object.values(critCtn.criterions).filter(area=>area.getGroup(critCtn)).map(area=>new CritAction(area))
crits=ACTION.injectSepByGroup(crits,"props bool scope * advanced",this)
POPUP.showPopupActionsFromEvent({actions:crits,actionContext:this},ev)}}UiCritBool.AREA_AND=new UiCritBoolArea("and")
UiCritBool.AREA_OR=new UiCritBoolArea("or")
UiCritBool.AREA_AND_ROOT=new UiCritBoolArea("and",true)
UiCritBool.AREA_OR_ROOT=new UiCritBoolArea("or",true)
REG.reg.registerSkin("wsp-uicrit-bool",1,`\n\t#critCh {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tmargin: .5em 2px;\n\t}\n`)
REG.reg.registerSkin("wsp-uicrit-bool/insCrit",1,`\n\t:host {\n\t\tcolor: var(--insbtn-color);\n\t\tbackground-color: var(--bgcolor);\n\t\talign-self: start;\n\t\tdisplay: flex;\n\t\talign-items: center;\n\t\tjustify-content: center;\n\t\tbox-sizing: border-box;\n\t\tborder: 1px outset var(--border-color);\n\t\tborder-radius: 3px;\n\t\tcursor: pointer;\n\t\theight: 1.2em;\n\t\twidth: 1.2em;\n\t\tmargin: -.6em 0;\n\t\tpadding: 0 2px;\n\t\tz-index: 1;\n\t\tuser-select: none;\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--focus-outline);\n\t}\n\n\t.label {\n\t\tflex: 1;\n\t\tdisplay: block;\n\t\tbackground: var(--insbtn-bg);\n\t\tline-height: 1.2em;\n\t\tmin-width: 1.2em;\n\t\ttext-align: center;\n\t}\n\n\t:host(:hover) {\n\t\tbackground-color: var(--insbtn-hover-bg);\n\t}\n`)
customElements.define("wsp-uicrit-bool",UiCritBool)
export class UiCritNotOptional extends UiCritBase{get booleanContext(){return this._booleanContext}set booleanContext(v){if(this._booleanContext!==v){this._booleanContext=v
this._refresh()}}get isNot(){return this._isNot}set isNot(v){if(this._isNot!==v){this._isNot=v
this._refresh()
this.dispatchChangeEvent()}}getChildCrit(){return DOM.findFirstChild(this,IS_UiCritWidget)}_initialize(init){super._initialize(init)
class NotAction extends Action{constructor(isNot,crit){super(isNot?"not":"")
this.isNot=isNot
this.crit=crit
if(isNot){this._label=function(ctx){return ctx.booleanContext==="or"?"OU SAUF":"ET SAUF"}}else{this._label=function(ctx){return ctx.booleanContext==="or"?"OU":"ET"}}}isToggle(ctx){return true}getDatas(api,ctx){return this.isNot===ctx.isNot}isEnabled(ctx){if(this.isNot===ctx.isNot)return false
return super.isEnabled(ctx)}execute(ctx,ev){this.crit.isNot=this.isNot}}this.popupBtn=this.shadowRoot.appendChild(JSX.createElement(ButtonActions,{"î":{actionContext:this,actions:[new NotAction(false,this),new NotAction(true,this)]}}))
this.shadowRoot.appendChild(JSX.createElement("slot",null))
this.shadowRoot.appendChild(JSX.createElement(Button,{id:"del",title:"Supprimer",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/delete.svg",onclick:this.onDelete}))}initFromContext(booleanContext,isNot){this._booleanContext=booleanContext
this._isNot=isNot
this.refresh()
return this}buildCrit(){const ch=this.getChildCrit()
if(!ch)return undefined
const crit=ch.buildCrit()
if(!crit)return undefined
return this._isNot?new SearchNot(crit):crit}buildUiXmlCrit(){const ch=this.getChildCrit()
if(!ch)return undefined
const crit=ch.buildUiXmlCrit()
return crit&&this._isNot?JSX.createElement("not",null,crit):crit}onDelete(ev){DOMSH.findHost(this).dispatchEvent(new CustomEvent("wsp-uicrit-toDelete",{bubbles:true,composed:true}))}_refresh(){this.popupBtn.label=this.isNot?this.booleanContext==="or"?"OU SAUF":"ET SAUF":this.booleanContext==="or"?"OU":"ET"}async initFromXmlCrit(xml){return this}}REG.reg.registerSkin("wsp-uicrit-notopt",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tflex-direction: row;\n\t\tborder: 1px solid var(--border-color);\n\t\tmargin-bottom: -1px;\n\t}\n\n\t::slotted(*) {\n\t\tflex: 1;\n\t}\n`)
customElements.define("wsp-uicrit-notopt",UiCritNotOptional)
export class UiCritFree extends UiCritBase{_initialize(init){super._initialize(init)
const sr=this.shadowRoot
this.reg.installSkin("wsp-uicrit-free",sr)
sr.appendChild(JSX.createElement("div",{id:"critHead"},JSX.createElement("span",null,"Condition XML avancée"),this.insertAlternativesBtn(init)))
this.input=sr.appendChild(JSX.createElement("textarea",{onblur:this.onBlur,oninput:this.onInput}))}async initFromXmlCrit(xml){this.input.value=DOM.ser(xml)
this.validateInput()
return this}buildCrit(){if(!this.input.value)return undefined
const dom=DOM.parseDomValid(this.input.value)
if(!dom)return undefined
return new SearchFree(dom.documentElement)}validateInput(){const txt=this.input.value
const dom=txt?DOM.parseDomValid(txt):null
this.input.setCustomValidity(dom?"":"Cette condition XML n\'est pas syntaxiquement correcte")
return this.input.reportValidity()}onInput(){const me=DOMSH.findHost(this)
me._dirty=true}onBlur(){const me=DOMSH.findHost(this)
if(me._dirty){me._dirty=false
if(me.validateInput())me.onChange()}}}UiCritFree.AREA=new UiCritArea("wsp-uicrit-free").setLabel("Condition XML avancée").setGroup("advanced").setBuildAbstract((xml,ctx)=>{const label=xml.getAttribute("uiLabel")
return label?JSX.createElement("span",{class:"crit"},JSX.createElement("span",{class:"critVal"},label)):JSX.createElement("span",{class:"crit"},"Condition avancée")})
customElements.define("wsp-uicrit-free",UiCritFree)
REG.reg.registerSkin("wsp-uicrit-free",1,`\n\ttextarea {\n\t\twidth: -webkit-fill-available;\n\t\theight: -webkit-fill-available;\n\t}\n`)
export class UiCritUnknown extends UiCritFree{buildUiXmlCrit(){const crit=this.buildCrit()
if(!crit)return undefined
return crit.toDom()}}UiCritUnknown.AREA=new UiCritArea("wsp-uicrit-unknown").setLabel("Condition inconnue")
customElements.define("wsp-uicrit-unknown",UiCritUnknown)
export class UiCritSrcUri extends UiCritBase{get isRegExp(){return this._regExpElt?this._regExpElt.checked:false}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
this._textElt=sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Chemin"),JSX.createElement("input",{type:"search",oninput:this.onChange}),this.insertAlternativesBtn(init))).querySelector("input")
const optsRoot=sr.appendChild(JSX.createElement("div",{class:"h"}))
this._regExpElt=optsRoot.appendChild(JSX.createElement("label",{class:"opt"},JSX.createElement("input",{type:"checkbox",onclick:this.onChange}),"Expression régulière")).firstElementChild}async initFromXmlCrit(xml){if(xml.hasAttribute("uiPathSearch")){this._textElt.value=xml.getAttribute("uiPathSearch")||""
this._regExpElt.checked=false}else{this._textElt.value=xml.getAttribute("regexp")||""
this._regExpElt.checked=true}return this}buildCrit(){const v=this._textElt.value
if(v&&this.isRegExp){return new SearchRegexpUri(new RegExp(v))}else if(v){const regexp=new RegExp(".*"+v.replace(/\W/g,LANG.escapeChar4Regexp)+".*","i")
return new SearchRegexpUri(regexp)}else return undefined}buildUiXmlCrit(){const crit=super.buildUiXmlCrit()
if(crit&&!this.isRegExp)crit.setAttribute("uiPathSearch",this._textElt.value)
return crit}}UiCritSrcUri.AREA=new UiCritArea("wsp-uicrit-srcuri-regexp").setLabel("Chemin de l\'item").setCritSgn("string").setReplacePattern(/\bstring\b/).setGroup("advanced").setBuildAbstract((xml,ctx)=>{const searchValue=xml.getAttribute("uiPathSearch")||""
const searchTxt=`Chemin de l\'item contient \"${searchValue}\"`
return JSX.createElement("span",{class:"crit"},JSX.createElement("span",{class:"critVal"},searchTxt))})
customElements.define("wsp-uicrit-srcuri-regexp",UiCritSrcUri)
export class UiCritXpath extends UiCritBase{constructor(nsListCode="namespaces:defaultList"){super()
this.nsListCode=nsListCode
this._Ns=new Map
this._DefaultNsCodeList=nsListCode}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
this._xpathElt=sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"XPath"),JSX.createElement("input",{type:"search",oninput:this.onInput,onblur:this.onBlur}),this.insertAlternativesBtn(init))).querySelector("input")
const nsList=this.reg.getListAsMap(this._DefaultNsCodeList)
if(nsList)for(const prefix in nsList)this._Ns.set(prefix=="#default"?"":prefix,nsList[prefix])}async initFromXmlCrit(xml){this._xpathElt.value=xml.getAttribute("xpathSearch")||""
let ch=xml.firstElementChild
while(ch){if(ch.localName=="ns")this._Ns.set(ch.getAttribute("prefix"),ch.getAttribute("uri"))
ch=ch.nextElementSibling}return this}buildCrit(){const v=this._xpathElt.value
if(v)return new SearchFullXPath(v,this._Ns)
return undefined}onInput(){const me=DOMSH.findHost(this)
me._dirty=true}onBlur(){const me=DOMSH.findHost(this)
if(me._dirty){me._dirty=false
me.onChange()}}}UiCritXpath.AREA=new UiCritArea("wsp-uicrit-xpath").setLabel("XPath").setCritSgn("string").setReplacePattern(/\bstring\b/).setGroup("advanced").setBuildAbstract((xml,ctx)=>{const searchTxt=JSX.createElement("span",{class:"critVal"},xml.getAttribute("xpathSearch")||"")
return JSX.createElement("span",{class:"crit"},"XPath : '",searchTxt,"'")})
customElements.define("wsp-uicrit-xpath",UiCritXpath)
class UiCritSubRequestArea extends UiCritArea{constructor(id,traitsCodeList="linktraits:search:defaultList"){super(id)
this.traitsCodeList=traitsCodeList}getLabel(ctx){switch(this._id){case"desc":return"Sous-requête dans le réseau descendant de l\'item courant"
case"asc":return"Sous-requête dans le réseau ascendant de l\'item courant"
case"children":return"Sous-requête dans les items liés de l\'item courant"
default:return"Sous-requête dans les items liant l\'item courant"}}getGroup(ctx){return"advanced"}buildBody(ctx){const w=new UiCritSubRequest
w.critArea=this
return w}canReplace(uiCrit,ctx){return uiCrit instanceof UiCritSubRequest}buildAbstract(xml,ctx,options){const operator=JSX.createElement("span",{class:"critVal"},UiCritSubRequest.OP[xml.getAttribute("op")][1])
const value=JSX.createElement("span",{class:"critVal"},xml.getAttribute("value"))
const LinkExpXml=UiCritSubRequestArea.findSubExpLinksElement(xml)
const subCritRootXml=LinkExpXml===null||LinkExpXml===void 0?void 0:LinkExpXml.nextElementSibling
const subCritRoot=subCritRootXml?buildCritAreaFromXml(subCritRootXml,ctx.criterions):null
const subCritRootAbstract=subCritRoot===null||subCritRoot===void 0?void 0:subCritRoot.buildAbstract(subCritRootXml,ctx)
const linkTraitFilter=(LinkExpXml===null||LinkExpXml===void 0?void 0:LinkExpXml.getAttribute("linkTraitFilter"))||""
let linkTraitFilterAbstract=null
if(linkTraitFilter){const traits=ctx.reg.getListAsMap(this.traitsCodeList)||{}
linkTraitFilterAbstract=`filtre '${traits[linkTraitFilter]||linkTraitFilter}'`}let areaShortLabel
switch(this._id){case"desc":areaShortLabel=JSX.createElement("span",null,linkTraitFilterAbstract?`Nombre d\'items descendants (${linkTraitFilterAbstract}) tels que :`:"Nombre d\'items descendants tels que :"," ",subCritRootAbstract," ",operator," ",value)
break
case"asc":areaShortLabel=JSX.createElement("span",null,linkTraitFilterAbstract?`Nombre d\'items ascendants (${linkTraitFilterAbstract}) tels que :`:"Nombre d\'items ascendants tels que :"," ",subCritRootAbstract," ",operator," ",value)
break
case"children":areaShortLabel=JSX.createElement("span",null,linkTraitFilterAbstract?`Nombre d\'items liés (${linkTraitFilterAbstract}) tels que :`:"Nombre d\'items liés tels que :"," ",subCritRootAbstract," ",operator," ",value)
break
default:areaShortLabel=JSX.createElement("span",null,linkTraitFilterAbstract?`Nombre d\'items liants (${linkTraitFilterAbstract}) tels que :`:"Nombre d\'items liants tels que :"," ",subCritRootAbstract," ",operator," ",value)}return JSX.createElement("span",{class:"boolGroup"},areaShortLabel)}static findSubExpLinksElement(xml){var _a,_b,_c
if(((_a=xml===null||xml===void 0?void 0:xml.firstElementChild)===null||_a===void 0?void 0:_a.localName)==="and")return((_b=xml.firstElementChild.firstElementChild)===null||_b===void 0?void 0:_b.getAttribute("path"))==="."?xml.firstElementChild.firstElementChild:null
else return((_c=xml===null||xml===void 0?void 0:xml.firstElementChild)===null||_c===void 0?void 0:_c.getAttribute("path"))==="."?xml.firstElementChild:null}}export class UiCritSubRequest extends UiCritBase{get traitsCodeList(){return this.critArea.traitsCodeList}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
const head=sr.appendChild(JSX.createElement("div",{id:"critHead"}))
UiCritBase.initHeadFromArea(this.critArea,{reg:this.reg},head)
head.appendChild(JSX.createElement("span",{class:"critTitle"},this.critArea.getLabel(null)))
const buttonActions=this.insertAlternativesBtn(init)
if(buttonActions)head.appendChild(buttonActions)
if(this.traitsCodeList){const traits=this.reg.getListAsMap(this.traitsCodeList)
if(traits){this._trFilterElt=JSX.createElement("select",{onchange:this.onChange},JSX.createElement("option",{value:"",selected:true},"Aucun filtre"))
for(const tr in traits)this._trFilterElt.appendChild(JSX.createElement("option",{value:tr},traits[tr]))
sr.appendChild(JSX.createElement("div",{class:"h"},this._trFilterElt))}}const optsRoot=sr.appendChild(JSX.createElement("div",{class:"h"}))
this._opElt=optsRoot.appendChild(JSX.createElement("select",{onchange:this.onChange},JSX.createElement("option",{value:"gt",selected:true},UiCritSubRequest.OP["gt"][0]),JSX.createElement("option",{value:"gt="},UiCritSubRequest.OP["gt="][0]),JSX.createElement("option",{value:"lt"},UiCritSubRequest.OP["lt"][0]),JSX.createElement("option",{value:"lt="},UiCritSubRequest.OP["lt="][0]),JSX.createElement("option",{value:"="},UiCritSubRequest.OP["="][0])))
this._opValueElt=optsRoot.appendChild(JSX.createElement("input",{value:"0",type:"number",min:"0",step:"1",oninput:this.onChange,onchange:this.onChange}))
sr.appendChild(JSX.createElement("slot",{id:"critCh"}))
this._subExpElt=this.appendChild(UiCritBool.AREA_AND.buildBody(this))
this._subExpElt.initialize(this)}async initFromXmlCrit(xml){const LinkExpXml=UiCritSubRequestArea.findSubExpLinksElement(xml)
if(xml===null||xml===void 0?void 0:xml.hasAttribute("op"))this._opElt.value=xml.getAttribute("op")
if(xml===null||xml===void 0?void 0:xml.hasAttribute("value"))this._opValueElt.value=xml.getAttribute("value")
const linkTraitFilter=LinkExpXml===null||LinkExpXml===void 0?void 0:LinkExpXml.getAttribute("linkTraitFilter")
if(linkTraitFilter&&this._trFilterElt)this._trFilterElt.value=linkTraitFilter
if(LinkExpXml===null||LinkExpXml===void 0?void 0:LinkExpXml.nextElementSibling)await this._subExpElt.initFromXmlCrit(LinkExpXml.nextElementSibling)
return this}async initFromInsAction(xml){const LinkExpXml=UiCritSubRequestArea.findSubExpLinksElement(xml)
const linkTraitFilter=LinkExpXml===null||LinkExpXml===void 0?void 0:LinkExpXml.getAttribute("linkTraitFilter")
if(linkTraitFilter&&this._trFilterElt)this._trFilterElt.value=linkTraitFilter
return super.initFromInsAction(xml)}buildCrit(){var _a
const subExp=new SearchAnd
const crit=new SearchOccurencesSubExp(this._opElt.value,Number.parseInt(this._opValueElt.value),subExp)
let searchItemLinks
switch(this.critArea){case UiCritSubRequest.AREA_DESC:searchItemLinks=new SearchItemLinks("LinkDesc")
break
case UiCritSubRequest.AREA_ASC:searchItemLinks=new SearchItemLinks("LinkAsc")
break
case UiCritSubRequest.AREA_PARENTS:searchItemLinks=new SearchItemLinks("LinkParents")
break
default:searchItemLinks=new SearchItemLinks("LinkChildren")}searchItemLinks.setPath(".")
searchItemLinks.setLinkTraitFilter((_a=this._trFilterElt)===null||_a===void 0?void 0:_a.value)
subExp.push(searchItemLinks)
LANG.pushIfDefined(subExp,this._subExpElt.buildCrit())
return crit}buildUiXmlCrit(){const crit=super.buildUiXmlCrit()
crit.setAttribute("uiCrit","wsp-uicrit-subrequest:"+this.critArea.getId())
const subExpCritElt=crit.firstElementChild
subExpCritElt.removeChild(subExpCritElt.lastChild)
subExpCritElt.appendChild(this._subExpElt.buildUiXmlCrit())
return crit}}UiCritSubRequest.AREA_DESC=new UiCritSubRequestArea("desc")
UiCritSubRequest.AREA_ASC=new UiCritSubRequestArea("asc")
UiCritSubRequest.AREA_CHILDREN=new UiCritSubRequestArea("children")
UiCritSubRequest.AREA_PARENTS=new UiCritSubRequestArea("parents")
UiCritSubRequest.OP={gt:["Items trouvés supérieur à",">"],"gt=":["Items trouvés supérieur ou égal à",">="],lt:["Items trouvés inférieur à","<"],"lt=":["Items trouvés inférieur ou égal à","<="],"=":["Items trouvés égal à","="]}
customElements.define("wsp-uicrit-subrequest",UiCritSubRequest)

//# sourceMappingURL=uiCrit.js.map