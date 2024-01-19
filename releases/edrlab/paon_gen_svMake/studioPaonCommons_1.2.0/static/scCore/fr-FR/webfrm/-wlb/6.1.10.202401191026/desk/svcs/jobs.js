
(function(window){

var jobs={};

/**
 * Spécifie un job
 * Context :
 * 	- serverUrl
 *  - newJobCb(pSuccess)
 *  - newJobCbThis
 * 	//TODO :
 * 		- gérer la planification
 * 		- affichage des jobs en cours plus userFriendly (géré par cet objet)
 * 
 * 
 */
jobs.Job = function(pKey) {
	this.fKey= pKey;
	this.fCreateJobBtnLabel = "Exécuter";
	this.fCreateJobConfirmMsg;
}
jobs.Job.prototype = js.create(areas.Area.prototype, {
	/** @API areas - Construction l'inputArea et retourne le noeud implémentant l'api InputAreaNode. */
	buildBody: function(pDomBd, pContext, pOptions){
		var vNode = this.buildDefaultBody(pDomBd, pContext, pOptions);
		return vNode;
	},
	
	/** Code du JOB tel qiue défini dans le service 
	 * 	fId par défaut
	 **/
	getJobDefCode : function(pContext){
		return this.fJobDefCode ? this.fJobDefCode : this.fId;
	},
	setJobDefCode : function(pCode){
		this.fJobDefCode = pCode;
		return this;
	},
	
	/** Gestion du bouton de création du job **/
	getCreateJobBtnLabel : function(pContext){
		return (typeof this.fCreateJobBtnLabel === 'function') ? this.fCreateJobBtnLabel.apply(this, arguments): ("fCreateJobBtnLabel" in this) ? this.fCreateJobBtnLabel : null;
	},
	setCreateJobBtnLabel : function(pLabel){
		this.fCreateJobBtnLabel = pLabel;
		return this;
	},
	getCreateJobConfirmMsg : function(pContext){
		return (typeof this.fCreateJobConfirmMsg === 'function') ? this.fCreateJobConfirmMsg.apply(this, arguments): ("fCreateJobConfirmMsg" in this) ? this.fCreateJobConfirmMsg : null;
	},
	setCreateJobConfirmMsg : function(pMsg){
		this.fCreateJobConfirmMsg = pMsg;
		return this;
	},
	
	/** Contruit le paramètre "jobData" utilisé lors de la création du job **/
	computeJobDatas : function(pDataObj, pContext){
		//A SURCHARGER dans les implémentations du job
	},
	
	/** Mode d'affichage :
	 * 		- simple : action titrée seule
	 * 		- form : action titrée avec zone de choix ou zone descriptive
	 *  **/
	viewMode : function(pContext){
		return this.fViewMode || "simple";
		//A SURCHARGER dans les implémentations du job
	},
		
	/** Construction de base de l'inputArea par défaut. */
	buildDefaultBody: function (pDomBd, pContext, pOptions) {
		var vJobObj = this;
		
		var vBd = dom.newBd(pDomBd.current());
		var vRootElt;
		
		if(this.viewMode(pContext)=="form"){
			// form
			vBd.elt("form").att("style", "padding:5px;");
			vRootElt = vBd.current();
			if(!this.isVisible(pContext)) vBd.att("hidden", "true");
			vBd.elt("fieldset").elt("legend");
		}else{
			// simple div
			vBd.elt("div").att("style", "padding:5px;");
			vRootElt = vBd.current();
		}
		// Titre et bouton d'action
		vBd.text(this.getLabel(pContext));
		vBd.elt("button").style("margin-left", "5px").listen("click", function(pEvt){
			pEvt.preventDefault();
			if(!vJobObj.getCreateJobConfirmMsg(pContext) || confirm(vJobObj.getCreateJobConfirmMsg(pContext))){
				var vJobDatas = {};
				vJobObj.computeJobDatas(vJobDatas, pContext);
				var vUrl = pContext.serverUrl+"/u/executor?cdaction=CreateJob&param="+vJobObj.getJobDefCode();
				var vReq = io.openHttpRequest(vUrl,"POST");
				vReq.onloadend = function(pEvt) {
					if (pEvt.target.status != 200) {
						log.debug("Create Job failed : " + pEvt.target.status + "\n"+ pEvt.target.responseText);
						// TODO : retour UI
						if(pContext.newJobCb) pContext.newJobCb.call(pContext.newJobCbThis, false)
					} else {
						//log.info("RESP :: "+pEvt.target.responseText);
						if(pContext.newJobCb) pContext.newJobCb.call(pContext.newJobCbThis, true)
					}
				}.bind(this);
				
				var vFormData = new FormData();
				vFormData.append("jobDatas", utils.serializeCdm(vJobDatas));
				//vReq.send("jobDatas="+utils.serializeCdm(vJobDatas));
				vReq.send(vFormData);
				return false;
			}
		}).text(this.getCreateJobBtnLabel(pContext));
		vBd.up();
		// Fils
		if(this.viewMode(pContext)=="form"){
			vBd.up();
			if(this.getDescription())
				vBd.elt("header").text(this.getDescription()).up();
		}
		return vRootElt;
	},
})

/**
 * Job de type "relaunchCidTasks"
 */
jobs.RelaunchCidTasksJob = function(pKey) {
	this.fKey= pKey;
	this.fJobDefCode = "relaunchCidTasks";
	this.fCreateJobBtnLabel = "Reconstruire";
	this.fCreateJobConfirmMsg = "Veuillez confirmer la modification des ressources sélectionnées ? Cette opération peut potentiellement être (très) longue.";
	this.fChoiceProcessings= {};
	this.fChoiceOverrideView = {};
	this.fChoiceReplacePersistMeta = {};
	this.fChoiceCondPersistMeta = {};
	this.fChoiceEntryAllProcessing = true;
	this.fRemakeVersions = false;//[false*,true,onDemandByProcessing]
	this.fForceContentIndex = false;
	this.fExtractMetasFromContent = false;
	this.fChoiceForceContentIndex= false;
	this.fOpenUpdatePersisMetaInput = false;
	this.fAppendFreeJobData = [];//function(pDataObj){}
	this.fFilterTrashedRes = false;
	this.fStopAfterFailures = 10;
	this.fViewMode = "form";
}
jobs.RelaunchCidTasksJob.prototype = js.create(jobs.Job.prototype, {
	/** @API job contruit le paramètre "jobData" utilisé lors de la création du job **/
	computeJobDatas : function(pDataObj, pContext){
		pDataObj.preconditions = "";
		//Précondition
		if(this.fFilterTrashedRes)
			this.xAddAndPrecond(pDataObj, "!persistMeta(trashed,true)");
		
		if(this.fRemakeVersions == false)
			this.xAddAndPrecond(pDataObj, "headInUrlTree");
		
		var vRemakeAllVersionsIfPossible = false;
		if(this.fRemakeVersions=="onDemandByProcessing" && this.fForm.remakeAllVersionsIfPossible.value == "true")
			vRemakeAllVersionsIfPossible = true;
		if(this.fForm.processing){
			//log.info(":::"+this.fForm.processing.value);
			if(this.fForm.processing.value){
				this.xAddAndPrecond(pDataObj, "(persistMeta(processing,"+this.fForm.processing.value+") "+ (vRemakeAllVersionsIfPossible && this.fChoiceProcessings[this.fForm.processing.value].canRemakeVersions ? "" : "&headInUrlTree") +")");
			}else{
				// Tous les processings
				if(Object.keys(this.fChoiceProcessings).length>0){
					var vAllProcCond = "(";
					var vIsFirst = true;
					for(var vType in this.fChoiceProcessings){
						if(!vIsFirst)
							vAllProcCond += " | ";
						vIsFirst = false;
						vAllProcCond += "(";
						vAllProcCond += "persistMeta(processing,"+vType+") ";
						if(!vRemakeAllVersionsIfPossible || !this.fChoiceProcessings[vType].canRemakeVersions)
							vAllProcCond += "&headInUrlTree";
						vAllProcCond += ")";
					}
					vAllProcCond += ")";
					this.xAddAndPrecond(pDataObj, vAllProcCond);
				}
			}
		}else if(Object.keys(this.fChoiceProcessings)[0]){
			this.xAddAndPrecond(pDataObj, "persistMeta(processing,"+Object.keys(this.fChoiceProcessings)[0]+")");
		}
		//Précondition : meta
		if(this.fForm.filterMetaKey){
			this.fChoiceCondPersistMeta[this.fForm.filterMetaKey.value].overrideSetFct.call(this, pDataObj, this.fForm.filterMetaValue.value);
		}
		
		//Contrôle des échecs
		pDataObj.stopAfterFailures = this.fStopAfterFailures;
		//Action : overrideViews
		if(this.fForm.overrideViews){
			pDataObj.overrideViews=[];
			this.fChoiceOverrideView[this.fForm.overrideViews.value].overrideSetFct.call(this, pDataObj.overrideViews);
		}
		//Action : updatePersistMetas
		if(this.fForm.persistMetaKey || this.fForm.openUpdatePersisMetaArray){
			pDataObj.updatePersistMetas=[];//{action: "replace", key:this.fForm.persistMetaKey, value:this.fForm.persistMetaValue}];
			// - replace
			if(this.fForm.persistMetaKey){
				this.fChoiceReplacePersistMeta[this.fForm.persistMetaKey.value].overrideSetFct.call(this, pDataObj.updatePersistMetas, this.fForm.persistMetaValue.value);
			}
			// - open
			if(this.fForm.openUpdatePersisMetaArray){
				var vOpenUpdatePersisMetaArray = JSON.parse(this.fForm.openUpdatePersisMetaArray.value);
				pDataObj.updatePersistMetas = pDataObj.updatePersistMetas.concat(vOpenUpdatePersisMetaArray);
			}
		}
		
		// Action : forceContentIndex
		if(this.fForm.forceContentIndex && this.fForm.forceContentIndex.checked){
			pDataObj.forceContentIndex = true;
		}else if(this.fForceContentIndex==true){
			pDataObj.forceContentIndex = true;
		}
		
		// Action : extractMetasFromContent
		// Forcé si overrideViews ou forceContentIndex
		if(this.fExtractMetasFromContent==true || pDataObj.overrideViews || pDataObj.forceContentIndex){
			pDataObj.extractMetasFromContent = true;
		}
		
		//Postcondition
		if(this.fForm.overrideViews){
			// pour le moment, les post-conditions sont limitées à "overrideViews". A réévaluer dans le futur... 
			pDataObj.postconditions = "atLeastOneViewForced";
		}
		
		//Free
		this.fAppendFreeJobData.forEach((pFunction)=>{
			pFunction.call(this, pDataObj);
		});
		
		//log.info("::::::: "+JSON.stringify(pDataObj));
	},
	xAddAndPrecond : function (pDataObj, pPrecondisionTxt){
		if(!pDataObj.preconditions){
			pDataObj.preconditions = pPrecondisionTxt;
		}else{
			pDataObj.preconditions += "&"+pPrecondisionTxt;
		}
	},
	
	/** @API job **/
	buildDefaultBody: function (pDomBd, pContext, pOptions) {
		var vFormElt = jobs.Job.prototype.buildDefaultBody.call(this, pDomBd, pContext, pOptions);
		this.fForm = vFormElt;
		var vBd = dom.newBd(vFormElt.firstElementChild);
		if(true){
			vBd.elt("sc-hbox").att("flex", 1);
			// - Condition : choix du processing
			if(Object.keys(this.fChoiceProcessings).length>0){
				vBd.elt("sc-label").text("Traitement : ").att("flex", 1);
					vBd.elt("select").att("name", "processing");
						if(this.fChoiceEntryAllProcessing)
							vBd.elt("option").att("value", "").text("Tous les types").up();
						for(var vType in this.fChoiceProcessings){
							vBd.elt("option").att("value", vType).text(this.fChoiceProcessings[vType].title).up();
						}
					vBd.up();
				vBd.up()
			}
			// - Condition : choix des properties
			if(Object.keys(this.fChoiceCondPersistMeta).length>0){
				vBd.elt("sc-label").text("Filtre : ").att("flex", 1);
					vBd.elt("select").att("name", "filterMetaKey");
						for(var vCode in this.fChoiceCondPersistMeta){
							vBd.elt("option").att("value", vCode).text(this.fChoiceCondPersistMeta[vCode].title).up();
						}
					vBd.up();
					vBd.elt("input").att("name", "filterMetaValue")
							.att("placeholder", "Valeur")
							.att("style", "margin-left:1em;")
							.att("type", "text")
							.att("pattern", "[^\),]*")
							.att("title", "Les caractères suivants sont interdits : ),");
					vBd.up();
				vBd.up()
			}
			// - Condition : head
			if(this.fRemakeVersions=="onDemandByProcessing"){
				vBd.elt("sc-label").text("Versions :").att("flex", 1);
					vBd.elt("select").att("name", "remakeAllVersionsIfPossible");
						vBd.elt("option").att("value", false).text("La plus récente uniquement").up();
						vBd.elt("option").att("value", true).text("Toutes (si disponibles)").up();
					vBd.up();
				vBd.up()
			}
			
			// - Choix des views
			if(Object.keys(this.fChoiceOverrideView).length>0){
				vBd.elt("sc-label").text("Vues reconstruites : ").att("flex", 1);
					vBd.elt("select").att("name", "overrideViews");
						for(var vCode in this.fChoiceOverrideView){
							vBd.elt("option").att("value", vCode).text(this.fChoiceOverrideView[vCode].title).up();
						}
					vBd.up();
				vBd.up()
			}
			
			// - Action : propertie ForceContentIndex
			if(this.fChoiceForceContentIndex){
				vBd.elt("sc-label").text("Ré-indexation du contenu : ").att("flex", 1);
					vBd.elt("input").att("name", "forceContentIndex")
							.att("style", "margin-left:1em;")
							.att("type", "checkbox")
							.att("title", "Forcer la ré-indexation du contenu. L'indexation des métas est systématique et automatique");
					if(this.fForceContentIndex) 
						vBd.att("checked", "false")
					vBd.up();
				vBd.up()
			}
			
			// - Action : properties replace
			if(Object.keys(this.fChoiceReplacePersistMeta).length>0){
				vBd.elt("sc-label").text("Nouvelle valeur de la métadonnée : ").att("flex", 1);
					vBd.elt("select").att("name", "persistMetaKey");
						vBd.elt("option").att("value", "").up();
						for(var vCode in this.fChoiceReplacePersistMeta){
							vBd.elt("option").att("value", vCode).text(this.fChoiceReplacePersistMeta[vCode].title).up();
						}
					vBd.up();
					vBd.elt("input").att("name", "persistMetaValue")
						.att("placeholder", "Valeur")
						.att("style", "margin-left:1em;");
					vBd.up();
				vBd.up()
			}
			
			// - Action : properties open
			if(this.fOpenUpdatePersisMetaInput){
				vBd.elt("sc-label").text("Actions (tableau json) : ").att("flex", 1);
					vBd.elt("textarea").att("name", "openUpdatePersisMetaArray")
						.att("rows", "5")
						.att("style", "margin-left:1em; flex: 1 1 0%; -webkit-box-flex: 1;")
						.att("flex", 1)
						.text("[\n]");
					vBd.up();
				vBd.up()
			}
			
		}
		return vFormElt;
	},
	/** Nombre d'échec de recalcul des views de ressource tolérées avant arrét et échec du JOB **/
	setStopAfterFailures : function(pInt){
		this.fStopAfterFailures = pInt;
		return this;
	},
	
	/** preconditions : filtre les items "trashed" **/
	setFilterTrashedRes : function(pBool){
		this.fFilterTrashedRes = pBool==true;
		return this;
	},
	
	/** preconditions : déclaration des processings sélectionnables 
	 * 		@pHasVersions : possède des versions qui peuvent être reconstruites
	 **/
	addChoiceProcessing : function(pCode, pTitle, pHasVersions){
		this.fChoiceProcessings[pCode] = {};
		this.fChoiceProcessings[pCode].title = pTitle||pCode;
		if(pHasVersions)
			this.fChoiceProcessings[pCode].title += " (v.)";	
		this.fChoiceProcessings[pCode].canRemakeVersions = pHasVersions !== null ? pHasVersions : false;
		return this;
	},
	/** calculé à partir des addChoiceProcessing renseignés **/
	addChoiceEntryAllProcessing : function(pBool){
		this.fChoiceEntryAllProcessing = pBool;
		return this;
	},
	
	/** precondition : meta **/
	/** action : déclaration des processings sélectionnables **/
	addChoiceCondPersistMetaFree : function(pCodeMeta, pTitle, pOverrideSetFct){
		this.fChoiceCondPersistMeta[pCodeMeta] = pOverrideSetFct ? {title:pTitle||pCodeMeta, overrideSetFct:pOverrideSetFct} : null;
		return this;
	},
	addChoiceCondPersistMeta: function(pCodeMeta, pTitle){
		this.addChoiceCondPersistMetaFree(pCodeMeta, pTitle, (pDataObj, pValue)=>{
			if(pCodeMeta){
				/*function escapeC(pMatch) {
					var vVal = pMatch.charCodeAt(0).toString(16);
					switch(vVal.length) {
					case 1: return "\\x0" + vVal;
					case 2: return "\\x" + vVal;
					case 3: return "\\u0" + vVal;
					case 4: return "\\u" + vVal;	
					}
				};
				vRegExp = pValue.replace(/\W/g, escapeC);//(?i)*/
				if(pValue) this.xAddAndPrecond(pDataObj, "regexpPersistMeta("+pCodeMeta+","+pValue+")");
			}
		});
		return this;
	},
		
	/** action : déclaration des processings sélectionnables 
	 * 	pOverrideFct : array de directives de traitements sur les views. 
	 *     @see eu.scenari.store.service.mkviews.RelaunchCidTasksJob
	 **/
	addChoiceOverrideFreeView : function(pCode, pTitle, pOverrideSetFct){
		this.fChoiceOverrideView[pCode] = pOverrideSetFct ? {title:pTitle||pCode, overrideSetFct:pOverrideSetFct} : null;
		return this;
	},
	addChoiceOverrideView : function(pCode/*all,newOnly,viewCode*/, pTitle, pOptions){
		switch(pCode) {
			case "all" :
				/* pOptions : null */
				this.addChoiceOverrideFreeView("all", pTitle || "Toutes", function(pOverrideArray){
					pOverrideArray.push({forceRemakeInMetas: true, builtBefore : Date.now()});
				});
				break;
			case "newOnly" :
				/* pOptions : null */
				this.addChoiceOverrideFreeView("newOnly", pTitle || "Les nouvelles uniquement", function(pOverrideArray){
					pOverrideArray.push({redirectToPrevious: true});
				});
				break;	
			case "viewCode" :
				/* pOptions : [codeView] */
				this.addChoiceOverrideFreeView("viewCode_"+pOptions.join('_'), pTitle || i18n.formatStr("Les vues de code : %s", pOptions.join(', ')), function(pOverrideArray){
					pOptions.forEach(function(pCode){
						pOverrideArray.push({matchCodeView: '^('+pOptions.join('|')+')$', forceRemakeInMetas: true, builtBefore : Date.now()});
					});
					pOverrideArray.push({redirectToPrevious: true});
				});
				break;	
			default :
				break;
		}
		return this;
	},
	
	/** action : force la reconstruction des index
	 * @param pValue [false*,true]
	 **/
	setForceContentIndexValue : function(pValue){
		this.fForceContentIndex = pValue;
		return this;
	},
	setChoiceForceContentIndex : function(pBool){
		this.fChoiceForceContentIndex = pBool;
		return this;
	},
			
	/** action : force le remake ou pas limité au head
	 * @param pValue [false*,true,onDemandByProcessing]
	 **/
	setRemakeVersions : function(pValue){
		this.fRemakeVersions = pValue;
		return this;
	},
	
	/** action : updatePersistMetas > replace **/
	addChoiceReplacePersistMetaFree : function(pCodeMeta, pTitle, pOverrideSetFct){
		this.fChoiceReplacePersistMeta[pCodeMeta] = pOverrideSetFct ? {title:pTitle||pCodeMeta, overrideSetFct:pOverrideSetFct} : null;
		return this;
	},
	addChoiceReplacePersistMeta: function(pCodeMeta, pTitle){
		this.addChoiceReplacePersistMetaFree(pCodeMeta, pTitle, function(pOverrideArray, pValue){
			pOverrideArray.push({action: "replace", key:pCodeMeta, value:pValue});
		});
		return this;
	},
	
	/** action : updatePersistMetas > free **/
	setOpenUpdatePersistMetaInput : function(pBool){
		this.fOpenUpdatePersisMetaInput = pBool;
		return this;
	},
	
	
	/** Free : ajout d'une directive free
	 * @param pFunction : function(pDataObj){} 
	 **/
	appendFreeJobData : function(pFunction){
		this.fAppendFreeJobData.push(pFunction);
		return this;
	}
	
})



if(!window.extPoints || !extPoints.initSvcLazy("jobs", jobs)) window.jobs = jobs;
})(window);
