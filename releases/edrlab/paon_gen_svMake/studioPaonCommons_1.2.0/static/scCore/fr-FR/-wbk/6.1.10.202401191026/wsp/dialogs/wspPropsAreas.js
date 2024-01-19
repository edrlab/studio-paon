import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{Wsp,WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{BoolCheckInputArea,ControlArea,ControlAsyncArea,InputArea,InputChoiceArea,InputTextArea,LabelArea,LabelAsyncArea,StringInputArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{WspTypeSelector}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/wspType/wspTypeSelector.js"
import{BaseElementAsync,MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{SkinSetSelector}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/skinSet/skinSetSelector.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{AutoMigrWspAction,ReloadWspAction,RemoveCacheWspAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/wspActions.js"
import{WSP_DRV}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/drv.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{InputOrderedSetPanel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/inputs.js"
export class WspArea extends LabelArea{isVisible(ctx){if(!ctx.reg.env.wsp)return false
return super.isVisible(ctx)}}class WspCodeInputArea extends StringInputArea{constructor(){super("code","text")
this.setLabel("Code")
this.setPattern("[a-zA-Z0-9_]+")
this.setRequired(true)
this.setInputCustomValidity((async function(ctx){if(!this.checkValidity())return"Seuls les caractères alpha-numériques et _ sont autorisés"
if(this.value){const code=this.value
let infoWsp=await ctx.reg.env.universe.wspServer.config.adminWspUrl.fetchJson(IO.qs("cdaction","InfoWsp","param",code))
if(infoWsp&&infoWsp.status!="noWsp"){return`L\'atelier avec le code \'${code}\' existe déjà.`}}return""}),500,true)}_buildControl(ctx,name){let input=super._buildControl(ctx,name)
DOM.setAttr(input,"spellcheck","false")
DOM.setAttr(input,"autocomplete","current-password")
return input}}class WspCodeArea extends WspArea{constructor(){super("code")
this.setLabel("Code")}_buildControl(ctx,name){return JSX.createElement("div",null,ctx.reg.env.wsp.code)}}class WspStatusArea extends WspArea{constructor(){super("code")
this.setLabel("Statut")}_buildControl(ctx,name){return JSX.createElement(WspStatus,{"î":{reg:ctx.reg}})}}export class WspStatus extends BaseElementAsync{async _initialize(init){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.reg=REG.findReg(this,init)
this.labelElt=sr.appendChild(JSX.createElement(MsgLabel,{class:"status","î":{label:"Chargement de l\'atelier en cours..."}}))
sr.appendChild(JSX.createElement("div",{class:"spacer"}))
this.migrlBtn=sr.appendChild(JSX.createElement(ActionBtn,{"î":{reg:init.reg,actionContext:init,label:"Migrer",action:new AutoMigrWspAction,uiContext:"custom"}}))
await this._refreshAll()}async _refreshAll(){let infoWsp=this.reg.env.wsp.infoWsp||this.reg.env.wsp.infoWspError
if(this.reg.env.wsp.migrating){this.labelElt.setCustomMsg("Migration de l\'atelier en cours...","info")}else if(infoWsp===null||infoWsp===void 0?void 0:infoWsp.isMigrationNeeded){this.labelElt.setCustomMsg("Migration des contenus nécessaire","warning")}else if(this.reg.env.wsp.isInError===true){if(this.reg.env.wsp.infoWsp&&!this.reg.env.wsp.wspMetaUi)this.labelElt.setCustomMsg("Échec au chargement du modèle documentaire","error")
else this.labelElt.setCustomMsg(this.reg.env.wsp.infoWspError&&this.reg.env.wsp.infoWspError.status==="noWsp"?"Atelier non trouvé":"Atelier en erreur","error")}else if(this.reg.env.wsp.isDeleted===true){this.labelElt.setCustomMsg("Atelier supprimé","error")}else if(this.reg.env.wsp.isAccessDenied===true){this.labelElt.setCustomMsg("Accès non autorisé","error")}else if(this.reg.env.wsp.wspMetaUi===null){this.labelElt.setCustomMsg("Accès impossible aux propriétés de l\'atelier","error")}else if(this.reg.env.wsp.fullLoading){this.labelElt.setCustomMsg("Chargement de l\'atelier en cours...","info")}else{this.labelElt.setCustomMsg("Opérationnel")}this.migrlBtn.refresh()}extractJson(parent){this.reg.env.wsp.waitForLoad().then(()=>{this._refreshAll()})
return false}fillJson(parent,root){}}customElements.define("wsptype-status",WspStatus)
REG.reg.registerSkin("wsptype-status",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex: 1;\n\t}\n\n\tc-msg {\n\t\tflex: unset;\n\t}\n\n\t.spacer {\n\t\tflex: 1;\n\t}\n`)
class WspTitleInputArea extends StringInputArea{constructor(){super("title","text")
this.setLabel("Titre")}}class WspDescInputArea extends InputTextArea{constructor(){super("desc")
this.setLabel("Description")}_buildControl(ctx,name){let textElt=super._buildControl(ctx,name)
DOM.setAttr(textElt,"rows","1")
return textElt}}export class WspAliasInputArea extends StringInputArea{constructor(){super("alias","text")
this.setLabel("Alias de l\'atelier")
this.setPattern("^(?!(^[0-9A-Za-z]{22}$))[A-Za-z0-9_-]*$")
this.isReadOnly=updatePropReadonly}}class WspDraftTitleInputArea extends StringInputArea{constructor(){super("draftTitle","text")
this.setLabel("Titre du calque de travail")}}class WspDrfRefWspTitleArea extends LabelAsyncArea{constructor(){super("wspMaster")
this.setLabel("")}async _loadControl(ctx,name){let infoWsp=ctx.reg.env.wsp.infoWsp||ctx.reg.env.wsp.infoWspError
let str
if(infoWsp){let masterWspCd=infoWsp.props.drfRefWsp
let masterWsp=new Wsp(ctx.reg.env.wsp.wspServer,masterWspCd)
await masterWsp.waitForLoad()
const wspTitle=masterWsp.wspTitle
str=`Calque de travail de \'${wspTitle}\'`}else str="Calque de travail"
return JSX.createElement("div",null,JSX.createElement("span",{class:"important"},str))}}class WspDrfRefWspArea extends LabelAsyncArea{constructor(){super("wspMaster")
this.setLabel("Atelier maitre")}async _loadControl(ctx,name){let infoWsp=ctx.reg.env.wsp.infoWsp||ctx.reg.env.wsp.infoWspError
if(infoWsp){let masterWspCd=infoWsp.props.drfRefWsp
return JSX.createElement("div",null,masterWspCd)}}}class WspDrvMasterTitleArea extends LabelAsyncArea{constructor(){super("wspMaster")
this.setLabel("")}async _loadControl(ctx,name){let infoWsp=ctx.reg.env.wsp.infoWsp||ctx.reg.env.wsp.infoWspError
let str
if(infoWsp){let masterWspCd=ctx.reg.env.wsp.infoWsp.props.drvMasterWsp
let masterWsp=new Wsp(ctx.reg.env.wsp.wspServer,masterWspCd)
await masterWsp.waitForLoad()
const wspTitle=masterWsp.wspTitle
str=`Dérivation de \'${wspTitle}\'`}else str="Dérivation"
return JSX.createElement("div",null,JSX.createElement("span",{class:"important"},str))}}class WspDrvMasterArea extends LabelAsyncArea{constructor(){super("wspMaster")
this.setLabel("Atelier source de dérivation")}async _loadControl(ctx,name){let infoWsp=ctx.reg.env.wsp.infoWsp||ctx.reg.env.wsp.infoWspError
if(infoWsp){let masterWspCd=infoWsp.props.drvMasterWsp
return JSX.createElement("div",null,masterWspCd)}}}class WspDrvDefaultSrcFindPathInputArea extends ControlAsyncArea{constructor(){super("drvDefaultSrcFindPath")
this._label="Sources de dérivation"
this._description="Sources intermédiaires de dérivation (optionnel)"}isEnabled(ctx){let infoWsp=ctx.reg.env.wsp.infoWsp||ctx.reg.env.wsp.infoWspError
if(!infoWsp)return false
return super.isEnabled(ctx)}async _loadControl(ctx,name){let infoWsp=ctx.reg.env.wsp.infoWsp||ctx.reg.env.wsp.infoWspError
let dataSet={}
if(infoWsp){if(WSP_DRV.isDrv(infoWsp.props)){let currentDrvAxis=infoWsp.props.drvAxis
let masterWspCd=infoWsp.props.drvMasterWsp
let masterWsp=new Wsp(ctx.reg.env.wsp.wspServer,masterWspCd)
await masterWsp.waitForLoad()
if(masterWsp.infoWsp)masterWsp.infoWsp.props.listDrvs.split(" ").forEach(drvAxis=>{if(drvAxis!==currentDrvAxis)dataSet[drvAxis]={label:drvAxis}})}else{let infoWsp=await ctx.reg.env.wsp.wspServer.config.adminWspUrl.fetchJson(IO.qs("cdaction","InfoWsp","param",ctx.reg.env.wsp.code,"wspPropsOpts","(drvWspUsedBy 'true' listDrvs 'true' listDrfs 'true')"))
if(infoWsp.props.listDrvs)infoWsp.props.listDrvs.split(" ").forEach(drvCode=>{dataSet[drvCode]={label:drvCode}})}}const inputElt=(new InputOrderedSetPanel).initialize({dataSet:dataSet,selectionLabel:"Sources sélectionnées",availableLabel:"Sources disponibles",emptySelectionMsg:"Aucune",name:name})
inputElt.title=this.getDescription(ctx)
const defaultValue=this.getDefaultValue(ctx)
if(defaultValue!=null)inputElt.value=defaultValue
return inputElt}}class WspDrvAxisInputArea extends StringInputArea{constructor(){super("drvAxis","text")
this.setLabel("Code de dérivation")
this.setPattern("[a-zA-Z0-9-_]+")
this.setInputCustomValidity((async function(ctx){let infoWsp=await ctx.reg.env.wsp.wspServer.config.adminWspUrl.fetchJson(IO.qs("cdaction","InfoWsp","param",ctx.reg.env.wsp.code,"wspPropsOpts","(drvWspUsedBy 'true' listDrvs 'true' listDrfs 'true')"))
if(!this.checkValidity())return"Seuls les caractères alpha-numériques, tiret et underscore sont autorisés"
const code=this.value
if(infoWsp&&infoWsp.props.listDrvs&&infoWsp.props.listDrvs.split(" ").indexOf(this.value)>-1)return`Le code de dérivation \'${code}\' a déjà été utilisé.`
return""}),500)}}class WspSelectScarInputArea extends InputArea{constructor(){super("scwspFile")
this.setLabel("Archive à importer")
this.setInputType("file")}_buildControl(ctx,name){let inputElt=super._buildControl(ctx,name)
inputElt.type="file"
inputElt.accept=".scar,.scwsp"
inputElt.multiple=false
return inputElt}}class WspDeleteGenInputArea extends BoolCheckInputArea{constructor(){super("deleteGen")
this.setLabel("Supprimer le répertoire de génération")
this.setDefaultValue(true)}}class WspDeleteFsInputArea extends BoolCheckInputArea{constructor(){super("deleteContent")
this.setLabel("Supprimer le répertoire des données")
this.setDefaultValue(false)}}class WspOptionsInputArea extends ControlArea{constructor(noPublicWsp=false,noExtIt=false,noAirIt=false){super("wspOptions")
this.noPublicWsp=noPublicWsp
this.noExtIt=noExtIt
this.noAirIt=noAirIt
this.setLabel("Options")
this.setReadOnly(updatePropReadonly)}_buildControl(ctx,name){let rootElt=JSX.createElement("div",null)
let isInDrfWspCtx=undefined
let isInDrvWspCtx=undefined
if(ctx.reg.env.wsp){const wspDefProps=ctx.reg.env.wsp.wspDefProps
if(wspDefProps===null||wspDefProps===void 0?void 0:wspDefProps.drfRefWsp)isInDrfWspCtx=true
if(wspDefProps===null||wspDefProps===void 0?void 0:wspDefProps.drvAxis)isInDrvWspCtx=true}function fAssignFormInput(input){Object.assign(input,{fillJson:function(parent,root){parent[input.name]=input.checked?true:false},extractJson:function(parent){const value=parent[input.name]
input.checked=value==true?true:false
if(input.parentElement.classList.contains("deprecated"))DOM.setHidden(input.parentElement,!input.checked)
return true}})}const publicWsp=ctx.reg.env.universe.getWspFeatureStatus("publicWsp")
if(!this.noPublicWsp&&publicWsp&&publicWsp!="alwaysFalse"){let id=this.getId()+"~publicWsp"
const inputElt=JSX.createElement("input",{name:"publicWsp",id:id,type:"checkbox",disabled:this.isReadOnly(ctx)||publicWsp.startsWith("always")?true:null,checked:publicWsp.toLocaleLowerCase().indexOf("True")>=0?true:null})
rootElt.appendChild(JSX.createElement("div",{class:`optionslist ${publicWsp=="deprecated"?"deprecated":""}`,title:"Passe cet atelier dans un statut \'public\'. Tout utilisateur connecté dispose d\'un accès en lecture à un atelier dit \'public\'. Cette option doit être activée pour permettre à d\'autres ateliers d\'y référencer des items étrangers (liens directs)."},inputElt,JSX.createElement("label",{for:id},"Atelier public"),publicWsp==="deprecated"?JSX.createElement("span",{class:"titleDeprecated"},"fonction dépréciée"):""))
fAssignFormInput(inputElt)}const extIt=ctx.reg.env.universe.getWspFeatureStatus("extIt")
if(!this.noExtIt&&!isInDrfWspCtx&&!isInDrvWspCtx&&extIt!="alwaysFalse"){let id=this.getId()+"~extIt"
const inputElt=JSX.createElement("input",{name:"extIt",id:id,type:"checkbox",disabled:this.isReadOnly(ctx)||extIt.startsWith("always")?true:null,checked:extIt.toLocaleLowerCase().indexOf("True")>=0?true:null})
rootElt.appendChild(JSX.createElement("div",{class:`optionslist ${extIt=="deprecated"?"deprecated":""}`,title:"Active les fonctions de liens inter-ateliers directs (items étrangers). Cela permet aux items de cet atelier de référencer des items d\'un autre atelier \'public\'."},inputElt,JSX.createElement("label",{for:id},"Liens inter-ateliers directs"),extIt==="deprecated"?JSX.createElement("span",{class:"titleDeprecated"},"fonction dépréciée"):""))
fAssignFormInput(inputElt)}const airIt=ctx.reg.env.universe.getWspFeatureStatus("airIt")
if(!this.noAirIt&&!isInDrfWspCtx&&!isInDrvWspCtx&&airIt&&airIt!="alwaysFalse"){let id=this.getId()+"~airIt"
const inputElt=JSX.createElement("input",{name:"airIt",id:id,type:"checkbox",disabled:this.isReadOnly(ctx)||airIt.startsWith("always")?true:null,checked:airIt.toLocaleLowerCase().indexOf("True")>=0?true:null})
rootElt.appendChild(JSX.createElement("div",{class:`optionslist ${airIt=="deprecated"?"deprecated":""}`,title:"Active les fonctions liées aux items \'flottants\' (non ancrés dans un espace)."},inputElt,JSX.createElement("label",{for:id},"Items \'flottants\'"),airIt==="deprecated"?JSX.createElement("span",{class:"titleDeprecated"},"fonction dépréciée"):""))
fAssignFormInput(inputElt)}return rootElt}isVisible(ctx){if((!ctx.reg.env.universe.getWspFeatureStatus("airIt")||ctx.reg.env.universe.getWspFeatureStatus("airIt")=="alwaysFalse")&&(!ctx.reg.env.universe.getWspFeatureStatus("extIt")||ctx.reg.env.universe.getWspFeatureStatus("extIt")=="alwaysFalse")&&(!ctx.reg.env.universe.getWspFeatureStatus("airIt")||ctx.reg.env.universe.getWspFeatureStatus("airIt")=="alwaysFalse"))return false
return super.isVisible(ctx)}}class DoMigrateIfNecessaryArea extends InputChoiceArea{constructor(){super("doMigrateIfNecessary","checkbox")
this.setLabel("Migration").setDataset({true:{label:"Déclencher la migration si pertinent"}})
this.setDefaultValue("true")}}class WspTypeInstNewInputArea extends ControlAsyncArea{constructor(){super("wspType")
this.setLabel("Modèle")
this.setRequired(true)}async _loadControl(ctx){let fromWsp=ctx.reg&&"wsp"in ctx.reg.env&&ctx.reg.env.wsp
let wspTypeSelector=(new WspTypeSelector).initialize({mode:"new",reg:ctx.reg,fromWspCode:fromWsp?fromWsp.code:null,name:this._id,disabled:!this.isEnabled(ctx),required:this.isRequired(ctx)})
wspTypeSelector.className="formElt"
return wspTypeSelector.initializedAsync}}class WspTypeInstEditArea extends ControlAsyncArea{constructor(){super("wspType")
this.setLabel("Modèle")}async _loadControl(ctx,name){var _a
let wspTypeSelector=(new WspTypeSelector).initialize({mode:"edit",reg:ctx.reg,fromWspCode:(_a=ctx.reg.env.wsp)===null||_a===void 0?void 0:_a.code,name:this._id,disabled:!this.isEnabled(ctx),required:this.isRequired(ctx),readonly:this.isReadOnly(ctx)})
wspTypeSelector.className="formElt"
return wspTypeSelector.initializedAsync}isReadOnly(ctx){return!ctx.reg.hasPerm("action.wspProps#update.wsptype")}}class AdminWspToolbarArea extends LabelArea{constructor(id){super(id)
this.setLabel("Administration de l\'atelier")
this.requireVisiblePerm("action.wspProps#admin.wsp")}_buildControl(ctx,name){return JSX.createElement("c-bar-actions",{"î":{reg:REG.getReg(ctx),actions:REG.getReg(ctx).getList(`actions:wspProps:${this.getId()}`),actionContext:{reg:REG.getReg(ctx)},disableFullOverlay:true,uiContext:"dialog"},id:"actions",hidden:"true"})}}export class SkinsetEditInputArea extends ControlAsyncArea{constructor(){super("skins")
this.setLabel("Habillages graphiques")
this.setDescription("Habillages graphiques des générateurs du modèle documentaire")}async loadBody(ctx,lastDatas){let body=await super.loadBody(ctx,lastDatas)
if(!await WSP.checkWspSvc(ctx.reg.env.wsp,body,"skinSet"))DOM.setHidden(body,true)
return body}async _loadControl(ctx,name){const skinsetSelector=(new SkinSetSelector).initialize({reg:ctx.reg,wsp:ctx.reg.env.wsp,propsJsonName:this._id,disabled:!this.isEnabled(ctx)})
return skinsetSelector.initializedAsync}isEnabled(ctx){return ctx.reg.hasPerm("action.wspProps#update.wsptype")}}function updatePropReadonly(ctx){return!ctx.reg.hasPerm("action.wspProps#update.props")}function fromWspPropReadonly(ctx){return!ctx.reg.env.wsp.isLoaded}REG.reg.addToList("wspProps:create:fromScratch","WspTypeInstInputArea",1,new WspTypeInstNewInputArea,101)
REG.reg.addToList("wspProps:create:fromScwsp","WspSelectScarInputArea",1,(new WspSelectScarInputArea).setRequired(true),101)
REG.reg.addToList("wspProps:edit:commons:infos","WspStatusArea",1,new WspStatusArea,31)
REG.reg.addToList("wspProps:edit:commons:infos","WspTypeInstEditArea",1,new WspTypeInstEditArea,101)
REG.reg.addToList("wspProps:edit:commons:advanced","AdminWspToolbarArea",1,new AdminWspToolbarArea("adminWsp"),51)
REG.reg.addToList("actions:wspProps:adminWsp","ReloadWspAction",1,(new ReloadWspAction).setLabel("Recharger"))
REG.reg.addToList("actions:wspProps:adminWsp","RemoveCacheWspAction",1,(new RemoveCacheWspAction).setLabel("Vider le cache"))
REG.reg.addToList("wspProps:editAll:commons","DoMigrateIfNecessaryArea",1,new DoMigrateIfNecessaryArea,101)
REG.reg.addToList("wspProps:editAll:commons","WspTypeInstEditArea",1,new WspTypeInstEditArea,102)
REG.reg.addToList("wspProps:remove:commons","WspDeleteGenInputArea",1,new WspDeleteGenInputArea,21)
REG.reg.addToList("wspProps:removeAll:commons","WspDeleteGenInputArea",1,(new WspDeleteGenInputArea).setLabel("Supprimer les répertoires de génération"),21)
REG.reg.addToList("wspProps:create:fs","WspCodeInputArea",1,new WspCodeInputArea,11)
REG.reg.addToList("wspProps:edit:fs:infos","WspCodeArea",1,new WspCodeArea,11)
REG.reg.addToList("wspProps:remove:fs","WspDeleteFsInputArea",1,new WspDeleteFsInputArea,11)
REG.reg.addToList("wspProps:removeAll:fs","WspDeleteFsInputArea",1,(new WspDeleteFsInputArea).setLabel("Supprimer les répertoires des données"),21)
REG.reg.addToList("wspProps:create:db","WspDescInputArea",1,new WspDescInputArea,41)
REG.reg.addToList("wspProps:edit:db:infos","WspDescInputArea",1,(new WspDescInputArea).setReadOnly(updatePropReadonly),41)
REG.reg.addToList("wspProps:edit:db:advanced","WspCodeArea",1,new WspCodeArea,21)
REG.reg.addToList("wspProps:edit:db:infos","WspOptionsInputArea",1,(new WspOptionsInputArea).setReadOnly(updatePropReadonly),51)
REG.reg.addToList("wspProps:create:db:other","WspTitleInputArea",1,(new WspTitleInputArea).setRequired(true),21)
REG.reg.addToList("wspProps:create:db:other","WspOptionsInputArea",1,new WspOptionsInputArea,51)
REG.reg.addToList("wspProps:edit:db:other:infos","WspTitleInputArea",1,(new WspTitleInputArea).setRequired(true).setReadOnly(updatePropReadonly),21)
REG.reg.addToList("wspProps:edit:db:other:skins","SkinsetEditInputArea",1,new SkinsetEditInputArea,61)
REG.reg.addToList("wspProps:create:db:drf","WspDraftTitleInputArea",1,(new WspDraftTitleInputArea).setRequired(true).setReadOnly(fromWspPropReadonly),21)
REG.reg.addToList("wspProps:create:db:drf","WspOptionsInputArea",1,new WspOptionsInputArea(false,true,true),51)
REG.reg.addToList("wspProps:edit:db:drf:infos","WspDrfRefWspTitleArea",1,new WspDrfRefWspTitleArea,1)
REG.reg.addToList("wspProps:edit:db:drf:infos","WspDraftTitleInputArea",1,(new WspDraftTitleInputArea).setRequired(true).setReadOnly(updatePropReadonly),11)
REG.reg.addToList("wspProps:edit:db:drf:advanced","WspDrfRefWspArea",1,new WspDrfRefWspArea,21)
REG.reg.addToList("wspProps:create:db:drv","WspDrvAxisInputArea",1,(new WspDrvAxisInputArea).setRequired(true).setReadOnly(fromWspPropReadonly),31)
REG.reg.addToList("wspProps:create:db:drv","WspDrvDefaultSrcFindPathInputArea",1,(new WspDrvDefaultSrcFindPathInputArea).setReadOnly(fromWspPropReadonly),41)
REG.reg.addToList("wspProps:create:db:drv","WspOptionsInputArea",1,new WspOptionsInputArea(false,true,true),51)
REG.reg.addToList("wspProps:edit:db:drv:infos","WspDrvMasterTitleArea",1,new WspDrvMasterTitleArea,1)
REG.reg.addToList("wspProps:edit:db:drv:infos","WspTitleInputArea",1,(new WspTitleInputArea).setReadOnly(true),21)
REG.reg.addToList("wspProps:edit:db:drv:infos","WspDrvDefaultSrcFindPathInputArea",1,(new WspDrvDefaultSrcFindPathInputArea).setReadOnly(updatePropReadonly),41)
REG.reg.addToList("wspProps:edit:db:drv:advanced","WspDrvMasterArea",1,new WspDrvMasterArea,21)

//# sourceMappingURL=wspPropsAreas.js.map