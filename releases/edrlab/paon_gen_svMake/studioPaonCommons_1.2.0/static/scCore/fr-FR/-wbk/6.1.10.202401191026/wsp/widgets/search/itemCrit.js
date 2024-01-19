import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{SearchFullText,SearchItemCodeOrTitle,SearchItemComment,SearchItemLinks,SearchItems,SearchItemSgnRegexp,SearchItemTitleRegexp,SearchLastModif,SearchLastModifIn,SearchLastUser,SearchLifeCycleStates,SearchOrphan,SearchRegexpUri,SearchResponsibilities,SearchStatus}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
import{UiCritArea,UiCritBase,UiCritBool,UiCritFree,UiCritSrcUri,UiCritSubRequest,UiCritUnknown,UiCritXpath}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/search/uiCrit.js"
import{SrcPointerFastSelect,SrcPointerInline}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcDrawer.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{ItemTypesTree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/itemTypesTree.js"
import{EUserAspects,EUserType,USER}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{InputUserPanel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/inputs.js"
import{InputPeriod}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/inputPeriod.js"
import{LC_STATE_DEFAULT_KEY,LC_STATE_DEFAULT_NAME}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js"
import{UserRef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/userRef.js"
REG.reg.registerSvc("wsp-uicrit-bool:and",1,UiCritBool.AREA_AND)
REG.reg.addSvcToList("wsp.crit.items","wsp-uicrit-bool:and",1,"wsp-uicrit-bool:and")
REG.reg.registerSvc("wsp-uicrit-bool:or",1,UiCritBool.AREA_OR)
REG.reg.addSvcToList("wsp.crit.items","wsp-uicrit-bool:or",1,"wsp-uicrit-bool:or")
REG.reg.registerSvc("and",1,UiCritBool.AREA_AND_ROOT)
REG.reg.addSvcToList("wsp.crit.items","and",1,"and")
REG.reg.registerSvc("or",1,UiCritBool.AREA_OR_ROOT)
REG.reg.addSvcToList("wsp.crit.items","or",1,"or")
REG.reg.registerSvc("wsp-uicrit-free",1,UiCritFree.AREA)
REG.reg.addSvcToList("wsp.crit.items","wsp-uicrit-free",1,"wsp-uicrit-free")
REG.reg.registerSvc("wsp-uicrit-srcuri-regexp",1,UiCritSrcUri.AREA)
REG.reg.addSvcToList("wsp.crit.items","wsp-uicrit-srcuri-regexp",1,"wsp-uicrit-srcuri-regexp")
REG.reg.registerSvc("wsp-uicrit-xpath",1,UiCritXpath.AREA)
REG.reg.addSvcToList("wsp.crit.items","wsp-uicrit-xpath",1,"wsp-uicrit-xpath")
REG.reg.registerSvc("wsp-uicrit-subrequest:parents",1,UiCritSubRequest.AREA_PARENTS)
REG.reg.addSvcToList("wsp.crit.items","wsp-uicrit-subrequest:parents",1,"wsp-uicrit-subrequest:parents")
REG.reg.registerSvc("wsp-uicrit-subrequest:children",1,UiCritSubRequest.AREA_CHILDREN)
REG.reg.addSvcToList("wsp.crit.items","wsp-uicrit-subrequest:children",1,"wsp-uicrit-subrequest:children")
REG.reg.registerSvc("wsp-uicrit-subrequest:asc",1,UiCritSubRequest.AREA_ASC)
REG.reg.addSvcToList("wsp.crit.items","wsp-uicrit-subrequest:asc",1,"wsp-uicrit-subrequest:asc")
REG.reg.registerSvc("wsp-uicrit-subrequest:desc",1,UiCritSubRequest.AREA_DESC)
REG.reg.addSvcToList("wsp.crit.items","wsp-uicrit-subrequest:desc",1,"wsp-uicrit-subrequest:desc")
REG.reg.registerSvc("exp",1,UiCritUnknown.AREA)
REG.reg.addSvcToList("wsp.crit.items","exp",1,"exp")
export class ItemCritFullWsp extends UiCritBase{get withAirItems(){return this._airItems?this._airItems.checked:false}get withForeignItems(){return this._foreignItems?this._foreignItems.checked:false}_initialize(init){super._initialize(init)
const wsp=this.reg.env.wsp
const sr=this.shadowRoot
sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Tout l\'atelier"),this.insertAlternativesBtn(init)))
let optsRoot=sr
if(wsp.isAirItem&&wsp.isExtItem)optsRoot=sr.appendChild(JSX.createElement("div",{class:"h"}))
if(wsp.isAirItem)this._airItems=optsRoot.appendChild(JSX.createElement("label",{class:"opt"},JSX.createElement("input",{type:"checkbox",checked:"",onclick:this.onChange}),"Items flottants inclus")).firstElementChild
if(wsp.isExtItem)this._foreignItems=optsRoot.appendChild(JSX.createElement("label",{class:"opt"},JSX.createElement("input",{type:"checkbox",onclick:this.onChange}),"Items étrangers inclus")).firstElementChild}async initFromXmlCrit(xml){if(this._airItems)this._airItems.checked=xml.getAttribute("uiAir")==="true"
if(this._foreignItems)this._foreignItems.checked=xml.getAttribute("uiForeign")==="true"
return this}buildCrit(){const crit=(new SearchItems).excludeAirItems(!this.withAirItems).excludeExtItems(!this.withForeignItems).includeDrfErased(this.reg.env.wsp.wspDefProps.drfRefWsp!=null)
const fixExclude=this.reg.getPref("ItemCritFullWsp.excludeSpaces")
if(fixExclude)crit.excludeSpaces(...fixExclude.split(";"))
return crit}buildUiXmlCrit(){const crit=this.buildCrit().toDom()
crit.setAttribute("uiCrit",this.getUiCritXmlAtt())
if(this.withAirItems)crit.setAttribute("uiAir","true")
if(this.withForeignItems)crit.setAttribute("uiForeign","true")
return crit}}ItemCritFullWsp.AREA=new UiCritArea("wsp-itemcrit-fullwsp").setLabel("Tout l\'atelier").setCritSgn("scope").setReplacePattern(/\bscope\b/).setBuildAbstract((function(xml,ctx){const air=xml.getAttribute("uiAir")==="true"
const foreign=xml.getAttribute("uiForeign")==="true"
return JSX.createElement("span",{class:"crit"},this.getLabel(ctx)+(air?foreign?", items flottants et étrangers inclus":", items flottants inclus":foreign?", items étrangers inclus":""))}))
customElements.define("wsp-itemcrit-fullwsp",ItemCritFullWsp)
REG.reg.registerSvc("wsp-itemcrit-fullwsp",1,ItemCritFullWsp.AREA)
REG.reg.addSvcToList("wsp.crit.items","wsp-itemcrit-fullwsp",1,"wsp-itemcrit-fullwsp")
class UiCritLinksArea extends UiCritArea{constructor(linkAxis,abstractStrPrefix,traitsCodeList="linktraits:search:defaultList"){super("wsp-itemcrit-links")
this.linkAxis=linkAxis
this.abstractStrPrefix=abstractStrPrefix
this.traitsCodeList=traitsCodeList
this.setReplacePattern(/\bscope\b/)
this.setCritSgn("scope")
this.setGroup("scope")}buildAbstract(xml,ctx,options){if(this.abstractStrPrefix){const path=xml.getAttribute("path")||""
let result=super.buildAbstract(xml,ctx,options)
if(path){let srcPointer=JSX.createElement(SrcPointerInline,{"î":{reg:ctx.reg}})
Promise.resolve(srcPointer.setSrcRef(path)).then(()=>{result.innerText=this.abstractStrPrefix
result.appendChild(JSX.createElement("span",{class:"critVal"})).appendChild(srcPointer)
const linkTraitFilter=xml.getAttribute("linkTraitFilter")||""
if(linkTraitFilter){const traits=ctx.reg.getListAsMap(this.traitsCodeList)||{}
result.appendChild(JSX.createElement("span",null,"(filtre '",traits[linkTraitFilter]||linkTraitFilter,"')"))}})}return result}else return super.buildAbstract(xml,ctx,options)}setLinkAxis(linkAxis){this.linkAxis=linkAxis
return this}}export class ItemCritLinks extends UiCritBase{get linkAxis(){return this.critArea.linkAxis}get traitsCodeList(){return this.critArea.traitsCodeList}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
const axis=this.linkAxis
this.itemPtr=JSX.createElement(SrcPointerInline,{"î":{reg:this.reg,defaultAction:SrcPointerFastSelect.SINGLETON}})
sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},axis==="LinkDesc"?"Descendants de":axis==="LinkAsc"?"Ascendants de":axis==="LinkChildren"?"Items liés par":"Items liants"),this.itemPtr,this.insertAlternativesBtn(init)))
if(this.traitsCodeList){const traits=this.reg.getListAsMap(this.traitsCodeList)
if(traits){this.trFilter=JSX.createElement("select",{onchange:this.onChange},JSX.createElement("option",{value:"",selected:true},"Aucun filtre"))
for(const tr in traits)this.trFilter.appendChild(JSX.createElement("option",{value:tr},traits[tr]))
sr.appendChild(JSX.createElement("div",{class:"h"},this.trFilter))}}this.itemPtr.onSrcRefChange.add(this.onChange)}async initFromXmlCrit(xml){const path=xml.getAttribute("path")
if(path){await this.itemPtr.setSrcRef(path)
if(!this.itemPtr.shortDesc||ITEM.getSrcUriType(this.itemPtr.shortDesc.srcUri)!="item")this.itemPtr.setSrcRef(null)}const linkTraitFilter=xml.getAttribute("linkTraitFilter")
if(linkTraitFilter&&this.trFilter)this.trFilter.value=linkTraitFilter
return this}async initFromInsAction(xml){const path=xml?xml.getAttribute("path"):null
if(path){await this.itemPtr.setSrcRef(path)
if(!this.itemPtr.shortDesc||ITEM.getSrcUriType(this.itemPtr.shortDesc.srcUri)!="item"){this.itemPtr.setSrcRef(null)
await this.itemPtr.openFastSelect()}}else if(!this.itemPtr.srcRef){await this.itemPtr.openFastSelect()}const linkTraitFilter=xml?xml.getAttribute("linkTraitFilter"):null
if(linkTraitFilter&&this.trFilter)this.trFilter.value=linkTraitFilter
return this}buildCrit(){var _a
return new SearchItemLinks(this.linkAxis).setPath(this.itemPtr.srcRef).setLinkTraitFilter((_a=this.trFilter)===null||_a===void 0?void 0:_a.value)}getUiCritXmlAtt(){return this.linkAxis}}ItemCritLinks.AREA_DESC=new UiCritLinksArea("LinkDesc","Dans le réseau descendant de l\'item").setLabel("Réseau descendant d\'un item")
ItemCritLinks.AREA_ASC=new UiCritLinksArea("LinkAsc","Dans le réseau ascendant de l\'item").setLabel("Réseau ascendant d\'un item")
ItemCritLinks.AREA_CHILDREN=new UiCritLinksArea("LinkChildren","Dans les items liés de l\'item").setLabel("Items liés par un item")
ItemCritLinks.AREA_PARENTS=new UiCritLinksArea("LinkParents","Dans les items liants l\'item").setLabel("Items liant un item").setBuildWedSearch((xml,criterions)=>({searchId:"item",findRef:xml.getAttribute("path")}))
REG.reg.registerSkin("wsp-itemcrit-links",1,`\n\twsp-src-pointer-inline {\n\t\tflex: 1;\n\t}\n`)
customElements.define("wsp-itemcrit-links",ItemCritLinks)
REG.reg.registerSvc("LinkDesc",1,ItemCritLinks.AREA_DESC)
REG.reg.addSvcToList("wsp.crit.items","LinkDesc",1,"LinkDesc")
REG.reg.registerSvc("LinkAsc",1,ItemCritLinks.AREA_ASC)
REG.reg.addSvcToList("wsp.crit.items","LinkAsc",1,"LinkAsc")
REG.reg.registerSvc("LinkChildren",1,ItemCritLinks.AREA_CHILDREN)
REG.reg.addSvcToList("wsp.crit.items","LinkChildren",1,"LinkChildren")
REG.reg.registerSvc("LinkParents",1,ItemCritLinks.AREA_PARENTS)
REG.reg.addSvcToList("wsp.crit.items","LinkParents",1,"LinkParents")
export class ItemCritInSpace extends UiCritBase{get spaceUri(){return this._spaceUri}set spaceUri(uri){this._spaceUri=ITEM.extractSpaceUri(uri)
this._spaceBtn.label=this.spaceUri||" "}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Dans l\'espace"),this.insertAlternativesBtn(init)))
this._spaceBtn=sr.appendChild(JSX.createElement(Button,{id:"space",icon:this.reg.env.wsp.wspMetaUi.getSpaceIcon(),onclick:this.onChooseSpace,title:"Sélectionner un espace..."}))}async initFromXmlCrit(xml){const path=xml.getAttribute("uiPath")
if(path!=null&&!SRC.isSrcId(path))this.spaceUri=path
return this}async initFromInsAction(xml){const path=xml?xml.getAttribute("uiPath"):null
if(path!=null&&!SRC.isSrcId(path)){this.spaceUri=path}else if(!this.spaceUri){await this.onChooseSpace.call(this._spaceBtn)}return this}buildCrit(){if(this.spaceUri==null)return undefined
return(new SearchItems).inSpace(this.spaceUri)}buildUiXmlCrit(){const crit=super.buildUiXmlCrit()
if(crit&&this.spaceUri)crit.setAttribute("uiPath",this.spaceUri)
return crit}async onChooseSpace(ev){const me=DOMSH.findHost(this)
const{SpaceSelector:SpaceSelector}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/spaceSelector.js")
const ct=(new SpaceSelector).initialize({reg:me.reg,startSel:me.spaceUri,selOnDblClick:true})
const space=await POPUP.showMenuFromEvent(ct,ev||me,me).onNextClose()
if(space){me.spaceUri=space.srcUri
me._spaceBtn.label=me.spaceUri
me.dispatchChangeEvent()}}}ItemCritInSpace.AREA=new UiCritArea("wsp-itemcrit-inspace").setLabel("Dans un espace").setCritSgn("scope").setGroup("scope").setReplacePattern(/\bscope\b/).setBuildAbstract((xml,ctx)=>{const path=xml.getAttribute("uiPath")||""
return path?JSX.createElement("span",{class:"crit"},"Dans l\'espace '",JSX.createElement("span",{class:"critVal"},path),"'"):JSX.createElement("span",{class:"crit"},"Dans un espace")})
REG.reg.registerSkin("wsp-itemcrit-inspace",1,`\n\t#space {\n\t\tjustify-content: start;\n\t\tfont-size: 1em;\n\t\t/*background-color: var(--form-bgcolor);\n\t\tcolor: var(--form-color);*/\n\t}\n`)
customElements.define("wsp-itemcrit-inspace",ItemCritInSpace)
REG.reg.registerSvc("wsp-itemcrit-inspace",1,ItemCritInSpace.AREA)
REG.reg.addSvcToList("wsp.crit.items","wsp-itemcrit-inspace",1,"wsp-itemcrit-inspace")
export class ItemCritFullText extends UiCritBase{_initialize(init){super._initialize(init)
const sr=this.shadowRoot
this._text=sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Texte"),JSX.createElement("input",{type:"search",oninput:this.onChange,placeholder:init.placeholder}),this.insertAlternativesBtn(init))).querySelector("input")
const optsRoot=sr.appendChild(JSX.createElement("div",{class:"h"}))
this._ignoreCase=optsRoot.appendChild(JSX.createElement("label",{class:"opt"},JSX.createElement("input",{type:"checkbox",onclick:this.onChange}),"Respect de la casse")).firstElementChild
this._wholeWord=optsRoot.appendChild(JSX.createElement("label",{class:"opt"},JSX.createElement("input",{type:"checkbox",onclick:this.onChange}),"Mot entier")).firstElementChild}async initFromXmlCrit(xml){this._text.value=xml.getAttribute("textSearch")||""
const opts=xml.getAttribute("options")||""
this._ignoreCase.checked=opts.indexOf(";c;")>=0
this._wholeWord.checked=opts.indexOf(";w;")>=0
return this}buildCrit(){const v=this._text.value
return v?new SearchFullText(v,this._ignoreCase.checked,this._wholeWord.checked):undefined}}ItemCritFullText.AREA=new UiCritArea("wsp-itemcrit-fulltext").setLabel("Texte").setCritSgn("string").setReplacePattern(/\bstring\b/).setGroup("props").setBuildAbstract((xml,ctx)=>{const txt=xml.getAttribute("textSearch")||""
const opts=xml.getAttribute("options")||""
return JSX.createElement("span",{class:"crit"},"Texte contient '",JSX.createElement("span",{class:"critVal"},txt),"'",opts.indexOf(";w;")>=0?", mot entier":undefined,opts.indexOf(";c;")>=0?", casse respectée":undefined)}).setBuildWedSearch((xml,criterions)=>{const opts=xml.getAttribute("options")||""
return{searchId:"text",text:xml.getAttribute("textSearch")||"",wholeWord:opts.indexOf(";w;")>=0,matchCase:opts.indexOf(";c;")>=0}})
customElements.define("wsp-itemcrit-fulltext",ItemCritFullText)
REG.reg.registerSvc("wsp-itemcrit-fulltext",1,ItemCritFullText.AREA)
REG.reg.addSvcToList("wsp.crit.items","wsp-itemcrit-fulltext",1,"wsp-itemcrit-fulltext")
export class ItemCritSrcCode extends UiCritBase{_initialize(init){super._initialize(init)
const sr=this.shadowRoot
this._textElt=sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Code de l\'item"),JSX.createElement("input",{type:"search",oninput:this.onChange}),this.insertAlternativesBtn(init))).querySelector("input")}async initFromXmlCrit(xml){this._textElt.value=xml.getAttribute("uiTextSearch")||""
return this}buildCrit(){const v=this._textElt.value
if(v){const regexp=new RegExp(".*"+v.replace(/\W/g,LANG.escapeChar4Regexp)+"[^/]*","i")
return new SearchRegexpUri(regexp)}else return undefined}buildUiXmlCrit(){const crit=super.buildUiXmlCrit()
if(crit)crit.setAttribute("uiTextSearch",this._textElt.value)
return crit}}ItemCritSrcCode.AREA=new UiCritArea("wsp-itemcrit-srccode").setLabel("Code de l\'item").setCritSgn("string").setReplacePattern(/\bstring\b/).setGroup("props").setBuildAbstract((xml,ctx)=>{const searchTxt=JSX.createElement("span",{class:"critVal"},xml.getAttribute("uiTextSearch")||"")
return JSX.createElement("span",{class:"crit"},"Code de l\'item contient '",searchTxt,"'")})
customElements.define("wsp-itemcrit-srccode",ItemCritSrcCode)
REG.reg.registerSvc("wsp-itemcrit-srccode",1,ItemCritSrcCode.AREA)
REG.reg.addSvcToList("wsp.crit.items","wsp-itemcrit-srccode",1,"wsp-itemcrit-srccode")
export class ItemCritTitleRegExp extends UiCritBase{get isRegExp(){return this._regExpElt?this._regExpElt.checked:false}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
this._textElt=sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Titre"),JSX.createElement("input",{type:"search",oninput:this.onChange,placeholder:init.placeholder}),this.insertAlternativesBtn(init))).querySelector("input")
const optsRoot=sr.appendChild(JSX.createElement("div",{class:"h"}))
this._regExpElt=optsRoot.appendChild(JSX.createElement("label",{class:"opt"},JSX.createElement("input",{type:"checkbox",onclick:this.onChange}),"Expression régulière")).firstElementChild}async initFromXmlCrit(xml){if(xml.hasAttribute("uiTextSearch")){this._textElt.value=xml.getAttribute("uiTextSearch")||""
this._regExpElt.checked=false}else{this._textElt.value=xml.getAttribute("regexp")||""
this._regExpElt.checked=true}return this}buildCrit(){const v=this._textElt.value
if(v&&this.isRegExp){return new SearchItemTitleRegexp(new RegExp(v))}else if(v){const regexp=new RegExp(".*"+v.replace(/\W/g,LANG.escapeChar4Regexp)+".*","i")
return new SearchItemTitleRegexp(regexp)}else return undefined}buildUiXmlCrit(){const crit=super.buildUiXmlCrit()
if(crit&&!this.isRegExp)crit.setAttribute("uiTextSearch",this._textElt.value)
return crit}}ItemCritTitleRegExp.AREA=new UiCritArea("wsp-itemcrit-title").setLabel("Titre").setCritSgn("string").setReplacePattern(/\bstring\b/).setGroup("props").setBuildAbstract((xml,ctx)=>{const searchTxt=JSX.createElement("span",{class:"critVal"},xml.getAttribute("uiTextSearch")||xml.getAttribute("regexp"))
return JSX.createElement("span",{class:"crit"},"Titre contient '",searchTxt,"'")})
customElements.define("wsp-itemcrit-title",ItemCritTitleRegExp)
REG.reg.registerSvc("wsp-itemcrit-title",1,ItemCritTitleRegExp.AREA)
REG.reg.addSvcToList("wsp.crit.items","wsp-itemcrit-title",1,"wsp-itemcrit-title")
export class ItemCritCodeOrTitleFilter extends UiCritBase{_initialize(init){super._initialize(init)
const placeholder="placeholder"in init?init.placeholder:"Filtrer..."
this._textElt=this.shadowRoot.appendChild(JSX.createElement("label",{id:"search"},JSX.createElement("input",{type:"search",oninput:this.onChange,placeholder:placeholder}))).querySelector("input")}buildCrit(){const v=this._textElt.value
const regexp=new RegExp(".*"+v.replace(/\W/g,LANG.escapeChar4Regexp)+".*","i")
if(v)return new SearchItemCodeOrTitle(regexp)
return undefined}async initFromXmlCrit(xml){this._textElt.value=xml.getAttribute("regexp")||""
return this}}REG.reg.registerSkin("wsp-itemcrit-codeortitlefilter",1,`\n\t:host {\n\t\tpadding: 0px;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\t\n\t#search {\n\t\tbackground: 0.1em / 1em no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/filter.svg) var(--form-search-bgcolor);\n\t\tpadding-inline-start: 1.2em;\n\t\tflex: 1;\n\t}\n\n\tinput:focus {\n\t\toutline: var(--focus-outline);\n\t\toutline-offset: -1px;\n\t}\n\t\n\tinput {\n\t\tmargin: 0;\n\t\tpadding: 2px;\n\t\tborder: none;\n\t\twidth: 100%;\n\t\tfont-size: inherit;\n\t}\n\t\n\tinput::placeholder {\n\t\tcolor: var(--fade-color);\n\t\tletter-spacing: 2px;\n\t\tfont-size: var(--label-size);\n\t\tfont-style: italic;\n\t}\n\n\tinput:focus::placeholder {\n\t\tcolor: transparent;\n\t}\n`)
customElements.define("wsp-itemcrit-codeortitlefilter",ItemCritCodeOrTitleFilter)
export class ItemCritOrphan extends UiCritBase{_initialize(init){super._initialize(init)
this.shadowRoot.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Items orphelins (référencés par aucun autre item)"),this.insertAlternativesBtn(init))).querySelector("input")}async initFromXmlCrit(xml){return this}buildCrit(){return new SearchOrphan}}ItemCritOrphan.AREA=new UiCritArea("wsp-itemcrit-orphan").setLabel("Items orphelins").setGroup("item").setCritSgn("noProps").setReplacePattern(/\bnoProps\b/)
customElements.define("wsp-itemcrit-orphan",ItemCritOrphan)
REG.reg.registerSvc("wsp-itemcrit-orphan",1,ItemCritOrphan.AREA)
REG.reg.addSvcToList("wsp.crit.items","wsp-itemcrit-orphan",1,"wsp-itemcrit-orphan")
export class ItemCritForeign extends UiCritBase{_initialize(init){super._initialize(init)
const sr=this.shadowRoot
this.shadowRoot.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Items étrangers"),this.insertAlternativesBtn(init))).querySelector("input")}async initFromXmlCrit(xml){return this}buildCrit(){return new SearchRegexpUri(new RegExp("^"+LANG.escape4Regexp(ITEM.EXT_PREFIX)+".*"))}}ItemCritForeign.AREA=new UiCritArea("wsp-itemcrit-foreign").setLabel("Items étrangers").setDescription("Items appartenant à un autre atelier").setGroup("item").setCritSgn("noProps").setReplacePattern(/\bnoProps\b/).setVisible(ctx=>ctx.reg.env.wsp.isExtItem)
customElements.define("wsp-itemcrit-foreign",ItemCritForeign)
REG.reg.registerSvc("wsp-itemcrit-foreign",1,ItemCritForeign.AREA)
REG.reg.addSvcToList("wsp.crit.items","wsp-itemcrit-foreign",1,"wsp-itemcrit-foreign")
export class ItemCritAir extends UiCritBase{_initialize(init){super._initialize(init)
const sr=this.shadowRoot
this.shadowRoot.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Items flottants"),this.insertAlternativesBtn(init))).querySelector("input")}async initFromXmlCrit(xml){return this}buildCrit(){return new SearchRegexpUri(new RegExp("^"+LANG.escape4Regexp(ITEM.AIR_PREFIX)+".*"))}}ItemCritAir.AREA=new UiCritArea("wsp-itemcrit-air").setLabel("Items flottants").setGroup("item").setCritSgn("noProps").setReplacePattern(/\bnoProps\b/).setVisible(ctx=>ctx.reg.env.wsp.isAirItem)
customElements.define("wsp-itemcrit-air",ItemCritAir)
REG.reg.registerSvc("wsp-itemcrit-air",1,ItemCritAir.AREA)
REG.reg.addSvcToList("wsp.crit.items","wsp-itemcrit-air",1,"wsp-itemcrit-air")
export class ItemCritStatus extends UiCritBase{constructor(){super(...arguments)
this._withWarning=false}_initialize(init){super._initialize(init)
this._withWarning=this.hasAttribute("withWarning")?this.getAttribute("withWarning")=="true":this.reg.getPref("itemCritStatus.withWarning",false)
const sr=this.shadowRoot
this._statusElt=sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Statut"),JSX.createElement("select",{onchange:this.onChange}),this.insertAlternativesBtn(init))).querySelector("select")
this._statusElt.appendChild(JSX.createElement("option",{value:"3-3",selected:true},ItemCritStatus.STATUS["3-3"][0]))
if(this._withWarning)this._statusElt.appendChild(JSX.createElement("option",{value:"2-2"},ItemCritStatus.STATUS["2-2"][0]))
this._statusElt.appendChild(JSX.createElement("option",{value:"1-1"},ItemCritStatus.STATUS["1-1"][0]))
if(this._withWarning)this._statusElt.appendChild(JSX.createElement("option",{value:"2-3"},ItemCritStatus.STATUS["2-3"][0]))
if(this._withWarning)this._statusElt.appendChild(JSX.createElement("option",{value:"1-2"},ItemCritStatus.STATUS["1-2"][0]))}async initFromXmlCrit(xml){const itemStatusMin=Number.parseInt(xml.getAttribute("itemStatusMin"))||3
const itemStatusMax=Number.parseInt(xml.getAttribute("itemStatusMax"))||3
this._statusElt.value=itemStatusMin+"-"+itemStatusMax
return this}buildCrit(){const v=this._statusElt.value.split("-")
return v?new SearchStatus(Number.parseInt(v[0]),Number.parseInt(v[1])):undefined}}ItemCritStatus.STATUS={"3-3":["Items en erreur","en erreur"],"2-2":["Items en alerte","en alerte"],"1-1":["Items valides","valides"],"2-3":["Items en erreur ou en alerte","en erreur ou en alerte"],"1-2":["Items valides ou en alerte","valides ou en alerte"]}
ItemCritStatus.AREA=new UiCritArea("wsp-itemcrit-status").setLabel("Statut de l\'item").setCritSgn("noProps").setReplacePattern(/\bnoProps\b/).setGroup("item").setBuildAbstract((xml,ctx)=>{const itemStatusMin=xml.getAttribute("itemStatusMin")||""
const itemStatusMax=xml.getAttribute("itemStatusMax")||""
return JSX.createElement("span",{class:"crit"},"Statut ",JSX.createElement("span",{class:"critVal"},ItemCritStatus.STATUS[itemStatusMin+"-"+itemStatusMax][1]))})
customElements.define("wsp-itemcrit-status",ItemCritStatus)
REG.reg.registerSvc("wsp-itemcrit-status",1,ItemCritStatus.AREA)
REG.reg.addSvcToList("wsp.crit.items","wsp-itemcrit-status",1,"wsp-itemcrit-status")
export class ItemCritLastModif extends UiCritBase{_initialize(init){super._initialize(init)
const sr=this.shadowRoot
const critHead=sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Date de modification"),JSX.createElement("select",{onchange:this.onChange}),JSX.createElement("input",{type:"date",onchange:this.onChange}),this.insertAlternativesBtn(init)))
this._opElt=critHead.querySelector("select")
this._opElt.appendChild(JSX.createElement("option",{value:"lt",selected:true},ItemCritLastModif.OPERATORS["lt"]))
this._opElt.appendChild(JSX.createElement("option",{value:"gt=",selected:true},ItemCritLastModif.OPERATORS["gt="]))
this._opElt.appendChild(JSX.createElement("option",{value:"lt=.lt",selected:true},ItemCritLastModif.OPERATORS["lt=.lt"]))
this._dateElt=critHead.querySelector("input")
this._dateElt.valueAsDate=new Date}async initFromXmlCrit(xml){const operator=xml.getAttribute("op")
const value=xml.getAttribute("value")
this._opElt.value=operator
this._dateElt.valueAsDate=new Date(Number.parseInt(value.split(",")[0]))
return this}buildCrit(){if(this._dateElt.value){if(this._opElt.value=="lt=.lt"){const vStart=this._dateElt.valueAsDate
const vEnd=new Date(vStart.getFullYear(),vStart.getMonth(),vStart.getDate()+1)
return new SearchLastModifIn(this._opElt.value,vStart,vEnd)}else return new SearchLastModif(this._opElt.value,this._dateElt.valueAsDate)}return undefined}}ItemCritLastModif.OPERATORS={lt:"avant le","gt=":"à partir du","lt=.lt":"le"}
ItemCritLastModif.AREA=new UiCritArea("wsp-itemcrit-lastmodif").setLabel("Date de modification").setDescription("Date de dernière modification").setCritSgn("dateProps").setReplacePattern(/\bdateProps\b/).setGroup("item").setBuildAbstract((xml,ctx)=>{const options={year:"numeric",month:"numeric",day:"numeric"}
const op=xml.getAttribute("op")||""
const date=xml.getAttribute("value")||""
const dateObj=new Date(Number.parseInt(date.split(",")[0]))
const operatorTxt=ItemCritLastModif.OPERATORS[op]
const dateTxt=JSX.createElement("span",{class:"critVal"},dateObj.toLocaleDateString("fr",options))
return JSX.createElement("span",{class:"crit"},"Modifiés ",operatorTxt," ",dateTxt)})
customElements.define("wsp-itemcrit-lastmodif",ItemCritLastModif)
REG.reg.registerSvc("wsp-itemcrit-lastmodif",1,ItemCritLastModif.AREA)
REG.reg.addSvcToList("wsp.crit.items","wsp-itemcrit-lastmodif",1,"wsp-itemcrit-lastmodif")
export class ItemCritLastUser extends UiCritBase{get selectedUsers(){return this._selectedUsers}set selectedUsers(users){this._selectedUsers=users
this.refreshUi()}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
const critHead=sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Dernière personne à avoir modifié l\'item"),this.insertAlternativesBtn(init)))
this._userBtn=sr.appendChild(JSX.createElement(Button,{id:"users",onclick:this.onChooseUser,title:"Sélectionner un utilisateur..."}))
this.refreshUi()}async initFromXmlCrit(xml){const users=xml.getAttribute("users")
if(users)this.selectedUsers=await this.reg.env.universe.useUsers.getUserSet(users.split(" "))
return this}async initFromInsAction(xml){await super.initFromInsAction(xml)
if(!this.selectedUsers||this.selectedUsers.length==0)await this.onChooseUser.call(this._userBtn)
return this}buildCrit(){if(this.selectedUsers==null)return undefined
return new SearchLastUser(this.selectedUsers)}async onChooseUser(ev){const me=DOMSH.findHost(this)
const{UserSelector:UserSelector}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/userSelector.js")
const userSelector=(new UserSelector).initialize({reg:me.reg,startSel:me.selectedUsers,userGrid:{usersSrv:me.reg.env.universe.useUsers,grid:{selType:"multi"},filterTypeInputVisibility:true,filterType:EUserType.user,preserveSelectionOnFilter:true},selectAndCloseOnDblClick:true})
const user=await POPUP.showMenuFromEvent(userSelector,ev||me,me,null,{initWidth:"20em"}).onNextClose()
if(user){me.selectedUsers=user
me.dispatchChangeEvent()}}refreshUi(){while(this._userBtn.lastChild)this._userBtn.removeChild(this._userBtn.lastChild)
if(this.selectedUsers&&this.selectedUsers.length>0){this.selectedUsers.forEach(user=>{this._userBtn.appendChild(JSX.createElement("div",{class:"userEntry"},JSX.createElement("img",{src:USER.getIconUrl(user)}),USER.getPrimaryName(user)))})}else this._userBtn.appendChild(JSX.createElement("div",{class:"noEntry"},"Veuillez sélectionner des utilisateurs..."))}}ItemCritLastUser.AREA=new UiCritArea("wsp-itemcrit-lastuser").setLabel("Dernière personne à avoir modifié l\'item").setCritSgn("userProps").setReplacePattern(/\buserProps\b/).setGroup("item").setBuildAbstract((xml,ctx)=>{const users=xml.getAttribute("users")
if(users){let accounts=users.split(" ")
const usersListVal=JSX.createElement("span",{class:"critVal"},accounts.join(", "))
const resulElt=JSX.createElement("span",{class:"crit"},"Modifié par ",usersListVal)
ctx.reg.env.universe.useUsers.getUserSet(accounts).then(users=>{if(users){accounts=[]
const names=[]
users.forEach(user=>{accounts.push(USER.getPrimaryName(user))
names.push(USER.getLongName(user))})
usersListVal.textContent=accounts.join(", ")
usersListVal.setAttribute("title",names.join(", "))}})
return resulElt}}).setVisible(ctx=>!ctx.reg.env.universe.auth.config.noAuthentication)
REG.reg.registerSkin("wsp-itemcrit-lastuser",1,`\n\tc-button {\n\t\talign-items: start;\n\t\tflex-direction: column;\n\t}\n\n\t#users {\n\t\tjustify-content: start;\n\t\tfont-size: 1em;\n\t}\n\n\t.noEntry {\n\t\tfont-style: italic;\n\t\tcolor: var(--fade-color);\n\t}\n\n\t.userEntry {\n\t\tlist-style: none;\n\t\tdisplay: list-item;\n\t\tmargin-inline-start: 1em;\n\t}\n\n\t.userEntry > img {\n\t\theight: 1em;\n\t\tmargin-inline-end: .5em;\n\t}\n`)
customElements.define("wsp-itemcrit-lastuser",ItemCritLastUser)
REG.reg.registerSvc("wsp-itemcrit-lastuser",1,ItemCritLastUser.AREA)
REG.reg.addSvcToList("wsp.crit.items","wsp-itemcrit-lastuser",1,"wsp-itemcrit-lastuser")
export class ItemCritType extends UiCritBase{constructor(){super(...arguments)
this.itemTypeReducer=null}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Type(s) :"),this.insertAlternativesBtn(init)))
this._itemTypesPopup=JSX.createElement("div",{id:"root"})
this._itemTypesPopup.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("wsp-itemcrit-type/selector",this._itemTypesPopup.shadowRoot)
const itemTypeReducer=this.itemTypeReducer||this.reg.getSvc("itemCritType.itemTypeReducer")
this._itemTypesTree=this._itemTypesPopup.shadowRoot.appendChild((new ItemTypesTree).initialize({reg:this.reg,textFilter:"",itemTypeReducer:itemTypeReducer,forbidHideSelectedRow:true,grid:{selType:"multi"}}))
this._itemTypesTree.setAttribute("style","max-height: 20em;")
const footer=this._itemTypesPopup.shadowRoot.appendChild(JSX.createElement("div",{id:"footer"},JSX.createElement("div",{id:"msg"})))
footer.appendChild(JSX.createElement(Button,{id:"select",label:"Sélectionner","ui-context":"dialog",onclick:this.chooseItems_onSelectBtn.bind(this)}))
footer.appendChild(JSX.createElement(Button,{id:"cancel",label:"Annuler","ui-context":"dialog",onclick:this.chooseItems_onCancelBtn.bind(this)}))
this._itemsBtn=sr.appendChild(JSX.createElement(Button,{id:"itemsTypes",label:" ",onclick:this.onChooseItems,title:"Sélectionner des types d\'item..."}))
this.redraw()}async initFromXmlCrit(xml){const itTypes=xml?xml.getAttribute("uiItModels"):null
this._selectedItModels=itTypes===null||itTypes===void 0?void 0:itTypes.split("|")
this.redraw()
return this}async initFromInsAction(xml){await super.initFromInsAction(xml)
if(!this._selectedItModels||this._selectedItModels.length==0)await this.onChooseItems.call(this._itemsBtn)
return this}buildCrit(){var _a
if(!this._selectedItModels||this._selectedItModels.length==0)return undefined
return new SearchItemSgnRegexp((_a=this._selectedItModels)===null||_a===void 0?void 0:_a.map(entry=>".*@"+LANG.escape4Regexp(entry)+"\\b.*"))}buildUiXmlCrit(){const itModels=[]
const crit=super.buildUiXmlCrit()
if(crit&&this._selectedItModels)crit.setAttribute("uiItModels",this._selectedItModels.join("|"))
return crit}redraw(){while(this._itemsBtn.firstChild)this._itemsBtn.removeChild(this._itemsBtn.firstChild)
if(this._selectedItModels&&this._selectedItModels.length>0){this._selectedItModels.forEach(itModel=>{const itemType=this.reg.env.wsp.wspMetaUi.getItemType(itModel)
if(itemType){this._itemsBtn.appendChild(JSX.createElement("div",{class:"modelEntry"},JSX.createElement("img",{src:itemType.getIcon()}),itemType.getTitle()))}})}else this._itemsBtn.appendChild(JSX.createElement("div",{class:"noEntry"},"Veuillez sélectionner des types d\'item..."))}async onChooseItems(ev){const me=DOMSH.findHost(this)
me._itemTypesTree.clearSearch()
me._itemTypesTree.selectByItModels(me._selectedItModels)
await POPUP.showMenuFromEvent(me._itemTypesPopup,ev||me,me,{skinOver:"wsp-itemcrit-type-popup"}).onNextClose()}chooseItems_onCancelBtn(){POPUP.findPopupableParent(this._itemTypesPopup).close()}chooseItems_onSelectBtn(){this._selectedItModels=[]
this._itemTypesTree.getSelectedItemsTypes().forEach(itemType=>{this._selectedItModels.push(itemType.getModel())})
this.dispatchChangeEvent()
this.redraw()
POPUP.findPopupableParent(this._itemTypesPopup).close()}}ItemCritType.AREA=new UiCritArea("wsp-itemcrit-type").setLabel("Type de l\'item").setGroup("item").setBuildAbstract((xml,ctx)=>{const itModels=xml?xml.getAttribute("uiItModels"):null
const itLabels=[]
if(itModels!=null){const itTypesArray=itModels.split("|")
itTypesArray.forEach(itModel=>{itLabels.push(ctx.reg.env.wsp.wspMetaUi.getItemType(itModel).getTitle())})}if(itLabels.length==1){const itLabel=JSX.createElement("span",{class:"critVal"},itLabels[0])
return JSX.createElement("span",{class:"crit"},"Type '",itLabel,"'")}else{const itCount=JSX.createElement("span",{class:"critVal"},itLabels.length)
return JSX.createElement("span",{class:"crit",title:itLabels.join(", ")},itCount," types")}})
customElements.define("wsp-itemcrit-type",ItemCritType)
REG.reg.registerSkin("wsp-itemcrit-type",1,`\n\tc-button {\n\t\talign-items: start;\n\t\tflex-direction: column;\n\t}\n\n\t.noEntry {\n\t\tfont-style: italic;\n\t\tcolor: var(--fade-color);\n\t}\n\n\t.modelEntry {\n\t\tlist-style: none;\n\t\tdisplay: list-item;\n\t\tmargin-inline-start: 1em;\n\t}\n`)
REG.reg.registerSkin("wsp-itemcrit-type/selector",1,`\n\twsp-itemtypes-tree {\n\t\tmax-height: 20em;\n\t}\n\n\t#footer {\n\t\tborder-top: 1px solid var(--border-color);\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\talign-items: center;\n\t}\n\n\t#msg {\n\t\tflex: 1;\n\t}\n`)
REG.reg.registerSvc("wsp-itemcrit-type",1,ItemCritType.AREA)
REG.reg.addSvcToList("wsp.crit.items","wsp-itemcrit-type",1,"wsp-itemcrit-type")
export class ItemCritComment extends UiCritBase{get withOpenComments(){return this.opened?this.opened.checked:false}get withClosedComments(){return this.closed?this.closed.checked:false}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
const critHead=sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Item commenté"),this.insertAlternativesBtn(init)))
this.opened=critHead.appendChild(JSX.createElement("label",{class:"opt"},JSX.createElement("input",{type:"checkbox",checked:"",onclick:this.onClick}),"ouverts")).firstElementChild
this.closed=critHead.appendChild(JSX.createElement("label",{class:"opt"},JSX.createElement("input",{type:"checkbox",onclick:this.onClick}),"clos")).firstElementChild}async initFromXmlCrit(xml){if(xml.hasAttribute("uiIncludeOpen"))this.opened.checked=true
if(xml.hasAttribute("uiIncludeClosed"))this.closed.checked=true
return this}onClick(){const me=DOMSH.findHost(this)
if(!me.opened.checked&&!me.closed.checked){if(this===me.opened){me.closed.checked=true}else{me.opened.checked=true}}me.onChange()}buildCrit(){return new SearchItemComment(this.withOpenComments,this.withClosedComments)}buildUiXmlCrit(){const crit=super.buildUiXmlCrit()
if(crit&&this.withOpenComments)crit.setAttribute("uiIncludeOpen",null)
if(crit&&this.withClosedComments)crit.setAttribute("uiIncludeClosed",null)
return crit}}ItemCritComment.AREA=new UiCritArea("wsp-itemcrit-comment").setLabel("Item commenté").setGroup("props").setBuildAbstract((xml,ctx)=>{let msg=""
if(xml.hasAttribute("uiIncludeClosed")&&xml.hasAttribute("uiIncludeOpen"))msg="Commentaires ouverts ou clos"
else if(xml.hasAttribute("uiIncludeClosed"))msg="Commentaires clos"
else msg="Commentaires ouverts"
return JSX.createElement("span",{class:"crit",title:msg},"Item commenté")}).setBuildWedSearch((xml,criterions)=>({searchId:"comment",opened:xml.hasAttribute("uiIncludeOpen"),closed:xml.hasAttribute("uiIncludeClosed")}))
customElements.define("wsp-itemcrit-comment",ItemCritComment)
REG.reg.registerSvc("wsp-itemcrit-comment",1,ItemCritComment.AREA)
REG.reg.addSvcToList("wsp.crit.items","wsp-itemcrit-comment",1,"wsp-itemcrit-comment")
export class ItemCritLifeCycle extends UiCritBase{_initialize(init){super._initialize(init)
const sr=this.shadowRoot
this.reg.installSkin("wsp-itemcrit-lifecycle",sr)
this._lcElt=JSX.createElement("select",{onchange:this.onChange,class:"lcSelect",multiple:"true"})
this.reg.env.wsp.wspMetaUi.getLcStates().forEach(tr=>{let opt=this._lcElt.appendChild(JSX.createElement("option",{value:tr.code||LC_STATE_DEFAULT_KEY},tr.name||LC_STATE_DEFAULT_NAME))
opt.style.color=tr.color||"var(--color)"
if(tr.iconUrl)opt.style.backgroundImage=`url("${tr.iconUrl}")`
if(tr.code=="")DOM.setAttrBool(opt,"selected",true)})
this._dateElt=(new InputPeriod).initialize()
this._dateElt.title="Période pendant laquelle l\'état du cycle de vie a été affecté"
this._dateElt.addEventListener("change",this.onChange)
this._dateElt.addEventListener("input",this.onChange)
this._userElt=(new InputUserPanel).initialize({name:"choiceUser",reg:this.reg,emptySelectionMsg:"Sélectionner un utilisateur...",userCard:"multi",usersGridInit:{usersSrv:this.reg.env.universe.useUsers,grid:{selType:"mono"},filterType:EUserType.user,filterTypeInputVisibility:false}})
this._userElt.addEventListener("change",this.onChange)
this._userElt.title="État affecté par l\'un des utilisateurs"
sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},this.reg.env.wsp.wspMetaUi.getLcName()),this._lcElt,this.insertAlternativesBtn(init)))
sr.appendChild(JSX.createElement("div",{class:"h"},JSX.createElement("span",null,"défini"),this._dateElt,JSX.createElement("span",null,"par"),this._userElt))}async initFromXmlCrit(xml){this._lcElt.selectedIndex=-1
const lcStates=xml.getAttribute("lcStates")||""
const lcStatesArr=lcStates.split(" ")
Array.from(this._lcElt.options).forEach(opt=>{opt.selected=lcStatesArr.includes(opt.value)})
this._dateElt.reset(xml.getAttribute("uiCurrentMode"),xml.hasAttribute("uiCurrentLess")?Number.parseInt(xml.getAttribute("uiCurrentLess")):null,xml.hasAttribute("uiCurrentMore")?Number.parseInt(xml.getAttribute("uiCurrentMore")):null)
const lcBys=xml.getAttribute("lcBys")
if(lcBys)this._userElt.value=lcBys.split(" ")
return this}buildCrit(){let crit=this._dateElt.isSpecified()?SearchLifeCycleStates.buildFromInputPeriod(this._dateElt):new SearchLifeCycleStates
crit.lcStates=[]
Array.from(this._lcElt.selectedOptions).forEach(opt=>crit.lcStates.push(opt.value))
crit.lcBys=this._userElt.value
return crit}buildUiXmlCrit(){const crit=super.buildUiXmlCrit()
if(crit&&this._dateElt.isSpecified()){crit.setAttribute("uiCurrentMode",this._dateElt.currentMode.getId())
if(this._dateElt.date1.valueAsNumber)crit.setAttribute("uiCurrentLess",this._dateElt.date1.valueAsNumber.toString())
if(this._dateElt.date2.valueAsNumber)crit.setAttribute("uiCurrentMore",this._dateElt.date2.valueAsNumber.toString())}return crit}}ItemCritLifeCycle.AREA=new UiCritArea("wsp-itemcrit-lifecycle").setLabel(ctx=>ctx.reg.env.wsp.wspMetaUi.getLcName()).setVisible(ctx=>ctx.reg.env.wsp.hasFeature("liveCycle")&&ctx.reg.env.wsp.wspMetaUi.getLcStates()!==null?true:false).setCritSgn("lifecycle").setGroup("item").setBuildAbstract((xml,ctx)=>{const lcStates=xml.getAttribute("lcStates")||""
const lcStatesArr=lcStates.split(" ")
const lcStatesLabels=[]
lcStatesArr.forEach(stateCode=>{const state=ctx.reg.env.wsp.wspMetaUi.getLcState(stateCode!=LC_STATE_DEFAULT_KEY?stateCode:"")
if(state&&state.name)lcStatesLabels.push(state.name)
else if(state&&state.code=="")lcStatesLabels.push(LC_STATE_DEFAULT_NAME)
else lcStatesLabels.push(stateCode)})
let strCplts=[]
if(xml.getAttribute("uiCurrentMode"))strCplts.push(JSX.createElement("span",null,"période donnée"))
const lcBys=xml.getAttribute("lcBys")
if(lcBys){let accounts=lcBys.split(" ")
const usersListVal=JSX.createElement("span",null,"affecté par '",accounts.join(", "),"'")
strCplts.push(usersListVal)
ctx.reg.env.universe.useUsers.getUserSet(accounts).then(users=>{if(users){accounts=[]
const names=[]
users.forEach(user=>{accounts.push(USER.getPrimaryName(user))
names.push(USER.getLongName(user))})
usersListVal.textContent="affecté par '"+accounts.join(", ")+"'"
usersListVal.setAttribute("title",names.join(", "))}})}const lcName=ctx.reg.env.wsp.wspMetaUi.getLcName()
const label=lcStatesLabels.length>1?`États du ${lcName} :`:`État du ${lcName} :`
const result=JSX.createElement("span",{class:"crit"},label," ",JSX.createElement("span",{class:"critVal"},lcStatesLabels.join(", ")))
if(strCplts.length>0){result.appendChild(document.createTextNode(" ("))
strCplts.forEach((elt,pos)=>{if(pos>0&&pos<strCplts.length)result.appendChild(document.createTextNode(", "))
result.appendChild(elt)})
result.appendChild(document.createTextNode(")"))}return result})
customElements.define("wsp-itemcrit-lifecycle",ItemCritLifeCycle)
REG.reg.registerSkin("wsp-itemcrit-lifecycle",1,`\n\n\tc-input-period {\n\t\tmargin-inline-start: 1em;\n\t\tmargin-inline-end: 1em;\n\t}\n\n\tc-input-users-panel {\n\t\tmargin-inline-start: 1em;\n\t\tmin-height: 1.5rem;\n\t}\n\n\t.h {\n\t\tmargin-top: .5em;\n\t}\n\n\t.lcSelect {\n\t\tflex: 1;\n\t\tresize: vertical;\n\t\theight: 10rem;\n\t}\n\n\t.lcSelect > option {\n\t\t/*background-image: url("affecteeDynamiquement");*/\n\t\tbackground-repeat: no-repeat;\n\t\tbackground-size: 1rem auto;\n\t\tbackground-position-y: center;\n\t\tbackground-position-x: 1px;\n\t\tmin-width: 3rem;\n\t\tpadding-inline-start: 1.3rem;\n\t}\n`)
REG.reg.registerSvc("wsp-itemcrit-lifecycle",1,ItemCritLifeCycle.AREA)
REG.reg.addSvcToList("wsp.crit.items","wsp-itemcrit-lifecycle",1,"wsp-itemcrit-lifecycle")
export class ItemCritRespsonsabilities extends UiCritBase{static makeArea(target,tag){return new UiCritArea(tag).setLabel("Responsabilités").setVisible(ctx=>ctx.reg.env.wsp.hasFeature("resp")&&ctx.reg.env.wsp.wspMetaUi.hasResps?true:false).setCritSgn("respsonsabilities").setGroup(target).setBuildAbstract((xml,ctx)=>{const modelResps=ctx.reg.env.wsp.wspMetaUi.listResps(target)
const resps=xml.getAttribute("responsibilities")||""
const respsArr=resps.split(" ")
const respsLabels=[]
respsArr.forEach(resp=>{const currentResp=modelResps.find(entry=>entry.code===resp)
respsLabels.push(currentResp?currentResp.name:resp)})
let usersListVal
const users=xml.getAttribute("users")
if(users){const accounts=users.split(" ")
const usersObj=JSX.createElement("span",null)
accounts.forEach((account,pos)=>{if(pos>0)usersObj.appendChild(JSX.createElement("span",null," ou "))
usersObj.appendChild(JSX.createElement(UserRef,{class:"inline list","î":{reg:ctx.reg,nickOrAccount:account,withIcon:false}}))})
usersListVal=respsLabels.length>1?JSX.createElement("span",null,"attribuées à '",usersObj,"'"):JSX.createElement("span",null,"attribuée à '",usersObj,"'")
if(xml.getAttribute("expandUsers"))usersListVal.appendChild(JSX.createElement("span",null," (étendu aux membres/groupes)"))}if(respsLabels.length>1)return JSX.createElement("span",{class:"crit"},"Responsabilités '",JSX.createElement("span",{class:"critVal"},respsLabels.join(" ou ")),"' ",usersListVal)
else return JSX.createElement("span",{class:"crit"},"Responsabilité '",JSX.createElement("span",{class:"critVal"},respsLabels),"' ",usersListVal)})}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
this.reg.installSkin("wsp-crit-respsonsabilities",sr)
const withGroups=this.reg.env.universe.useUsers.hasAspect(EUserAspects.groupable)
this._respElt=JSX.createElement("select",{onchange:this.onChange,class:"respSelect",multiple:"true"})
this.reg.env.wsp.wspMetaUi.listResps(this.target).forEach(resp=>{let opt=this._respElt.appendChild(JSX.createElement("option",{value:resp.code},resp.name))
if(resp.desc)opt.title=resp.desc})
this._userElt=(new InputUserPanel).initialize({name:"choiceUser",reg:this.reg,emptySelectionMsg:withGroups?"Utilisateurs/groupes...":"Utilisateurs...",userCard:"multi",usersGridInit:{usersSrv:this.reg.env.universe.useUsers,filterTypeInputVisibility:true,filterType:null}})
this._userElt.addEventListener("change",this.onChange)
this._userElt.title=withGroups?"Au mois un utilisateur / groupe est concerné par au moins une responsabilité sélectionnée.":"Au mois un utilisateur est concerné par au moins une responsabilité sélectionnée."
let critGroups
if(withGroups){this._toGroupsElt=JSX.createElement("input",{type:"checkbox",onclick:this.onChange})
this._toMembersElt=JSX.createElement("input",{type:"checkbox",onclick:this.onChange})
critGroups=JSX.createElement("div",{class:"h"},JSX.createElement("label",{class:"opt",title:this.target=="item"?"Inclure les items associés aux groupes auxquels les utilisateurs sélectionnés appartiennent":"Inclure les tâches associées aux groupes auxquels les utilisateurs sélectionnés appartiennent"},this._toGroupsElt,"+ groupes"),JSX.createElement("label",{class:"opt",title:this.target=="item"?"Inclure les items associés aux membres des groupes sélectionnés":"Inclure les tâches associées aux membres des groupes sélectionnés"},this._toMembersElt,"+ membres"))}const critHead=sr.appendChild(JSX.createElement("div",{class:"critHead"},JSX.createElement("span",{class:"critTitle"},"Responsabilités"),this._respElt,this.insertAlternativesBtn(init)))
sr.appendChild(JSX.createElement("div",{class:"h"},JSX.createElement("span",null,"attribuées à"),JSX.createElement("div",{class:"v usersBox"},this._userElt,critGroups)))}async initFromXmlCrit(xml){this._respElt.selectedIndex=-1
const resps=xml.getAttribute("responsibilities")||""
const respsArr=resps.split(" ")
for(const opt of this._respElt.options){opt.selected=respsArr.includes(opt.value)}const users=xml.getAttribute("users")
if(users)this._userElt.value=users.split(" ")
const expandUsers=xml.getAttribute("expandUsers")
if(this._toGroupsElt)this._toGroupsElt.checked=expandUsers===null||expandUsers===void 0?void 0:expandUsers.includes("toGroups")
if(this._toMembersElt)this._toMembersElt.checked=expandUsers===null||expandUsers===void 0?void 0:expandUsers.includes("toMembers")
return this}buildCrit(){var _a,_b
const resps=[]
for(const opt of this._respElt.selectedOptions){resps.push(opt.value)}let crit=new SearchResponsibilities(resps,this._userElt.value,(_a=this._toMembersElt)===null||_a===void 0?void 0:_a.checked,(_b=this._toGroupsElt)===null||_b===void 0?void 0:_b.checked)
return crit}}ItemCritRespsonsabilities.AREA_item=ItemCritRespsonsabilities.makeArea("item","wsp-itemcrit-respsonsabilities")
ItemCritRespsonsabilities.AREA_task=ItemCritRespsonsabilities.makeArea("task","wsp-taskcrit-respsonsabilities")
export class ItemCritRespsonsabilities_item extends ItemCritRespsonsabilities{constructor(){super(...arguments)
this.target="item"}}customElements.define("wsp-itemcrit-respsonsabilities",ItemCritRespsonsabilities_item)
REG.reg.registerSkin("wsp-crit-respsonsabilities",1,`\n\t.respSelect {\n\t\tflex: 1;\n\t}\n\n\t.h {\n\t\tmargin-top: .5em;\n\t}\n\n\t.usersBox {\n\t\tflex: 1\n\t}\n\n\tc-input-users-panel {\n\t\tmargin-inline-start: 1em;\n\t\tflex: 1\n\t}\n`)
REG.reg.registerSvc("wsp-itemcrit-respsonsabilities",1,ItemCritRespsonsabilities.AREA_item)
REG.reg.addSvcToList("wsp.crit.items","wsp-itemcrit-respsonsabilities",1,"wsp-itemcrit-respsonsabilities")

//# sourceMappingURL=itemCrit.js.map