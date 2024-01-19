
(function(window){
	
window.distribSco = {
	
	fEngine : distribEngine,
	fScoEnv : null,
	fDepotPath : null,

	handleMsg:null, //fonction de manipulation du msg. Permet l'injection de param pour manipuler des sco appertant à d'autres ISkeleton
	
	listeners:[],

	prepareForDepotPath : function(pDepotPath, pCbDepotPath, pCbDepotPathThis){
		this.fDepotPath = pDepotPath;
		this.fScoEnv = null;
		
		var vSession = this.fEngine.getSession();
		if(vSession) {
			this.xCloseApi();
			//console.log("distribSco.prepareForDepotPath.SESSION::::\n" + JSON.stringify(vSession));
			//On recherche dans la session le participant avec un component SCO disponible pour ce depotPath.
			var vScoEnv = this.xFindScoEnvInSession(pDepotPath, vSession);
			if(vScoEnv) {
				//Env. sco trouvé pour ce depotPath, on charge les données.
				this.fScoEnv = vScoEnv;
				this.fCbDepotPath = pCbDepotPath;
				this.fCbDepotPathThis = pCbDepotPathThis;
				var vMsg = {type:"scoGet", scoKey:this.fScoEnv.scoKey};
				if(this.handleMsg) vMsg = this.handleMsg(vMsg);
				this.fEngine.sendParticipantMsgs(
					this.fScoEnv.participantId, vMsg,false,function(pEvt){
						if(pEvt.target.status!=200) {
							//Echec du chargement des scoDatas, sinon cf onEngineEvent()
							this.xActivateApi({});
						}
						pCbDepotPath.call(pCbDepotPathThis);
						
					},this);
				return;//attente de la resp asynch
			} else {
				//Pas de participant avec stockage sco
				this.xActivateApi({});
			}
		}
		pCbDepotPath.call(pCbDepotPathThis);
	},
	
	/** 
	 * Utilisé en cas de création d'un compte à la volée pour récupérer les 
	 * datas sco en cours sur la nouvelle session qui aurait un component sco disponible.
	 */
	moveDatasToNewSession : function(){
		this.fScoEnv = this.xFindScoEnvInSession(this.fDepotPath, this.fEngine.getSession());
	},

	onEngineEvent : function(pMsg, pAsynchExec){
		if(pMsg.type=="scoDatas" || pMsg.type=="scoNotAvailable") {
			if(this.fScoEnv && this.fScoEnv.scoKey==pMsg.scoKey) {
				this.xActivateApi(pMsg);				
			}
		} else if(pMsg.type=="participantUsedInOtherSession") {
			if(this.fScoEnv) {
				this.onParticipantUsedInOtherSession(pMsg);
			}
		} else if(pMsg.type=="willLogout") {
			return this.xCloseApi(pAsynchExec);
		}
	},
	
	/** impl par défaut : on logout le user. */
	onParticipantUsedInOtherSession : function(pMsg){
		//TODO informer le user de la fermeture de la session
		this.fEngine.logout();
	},
	
	addScoListener : function(pFct, pThis){
		this.listeners.push({"fFct":pFct,"fThis":pThis});
	},
	
	xScoEvent : function(pEvent, pParams){
		this.listeners.forEach(function(pListerner){
			pListerner.fFct.call(pListerner.fThis, pEvent, pParams);
		});
	},
	
	xFindScoEnvInSession : function(pDepotPath, pSession) {
		var vParticipants = pSession.participants;
		for(var vParticipId in vParticipants) {
			var vP = vParticipants[vParticipId];
			for(var i=0; i < vP.comps.length; i++) {
				var vComp = vP.comps[i];
				if(vComp.sco=="available" && vComp.depotPath==pDepotPath) {
					return {
						participantId: vParticipId,
						scoKey: vComp.scoKey
					};
				}
			}
		}
		return null;
	},

	xCloseApi : function(pAsynchExec){
		pAsynchExec = this.xCommitApiForClose(window.API, pAsynchExec);
		pAsynchExec = this.xCommitApiForClose(window.API_1484_11, pAsynchExec);
		return pAsynchExec;
	},
	xActivateApi : function(pScoDatas){
		window.API = new Imp_Api12(this, pScoDatas);
		window.API_1484_11 = new Imp_API_1484_11(this, pScoDatas);
		if(this.fCbDepotPath) {
			this.fCbDepotPath.call(this.fCbDepotPathThis);
			delete this.fCbDepotPath;
			delete this.fCbDepotPathThis;
		}
	},
	
	xCommitChange : function(pScoKey, pScoDatas, pCb){
		if(!pScoDatas || !this.fScoEnv || !this.fScoEnv.participantId || !pScoKey) return false; //pas de module de stockage sco disponible.
		pScoDatas.type = "scoPut";
		pScoDatas.scoKey = pScoKey;
		var vMsg = this.handleMsg?this.handleMsg(pScoDatas):pScoDatas;
		this.fEngine.sendParticipantMsgs(
				this.fScoEnv.participantId, 
				vMsg,
				false,
				function(pEvt){
					if(pCb) pCb.call();
					else if(pEvt.target.status!=200) {
						//Echec au commit.
					}
				},
				this);
		return true;
	},
	
	xCommitApiForClose : function(pApi, pAsynchExec) {
		if(!pApi || pApi.fState!="running") return pAsynchExec;
		var vCountDown=2;
		function countDown(){if(--vCountDown==0) pAsynchExec.call()};
		pApi.xBeforeClose();
		if(this.xCommitChange(pApi.fScoKey, pApi.fScoDatasDirty, countDown)) {
			pApi.xClose();
			return countDown;
		} else {
			pApi.xClose();
			return pAsynchExec;
		}
	}
}

distribEngine.addPlugin(distribSco);
distribEngine.addEngineListener(distribSco);

function pad2(pN){
	return pN<10 ? "0"+pN : pN;
}

function formatDuration12(pS){
	if(!pS) return "0000:00:00:00.00";
	var vF = Math.round(pS*100) % 100;
	var vS = Math.floor(pS) % 60;
	var vMn = Math.floor(pS/60) % 60;
	var vH = Math.floor(pS/3600);
	if(vH>9999) vH=9999;
	return pad2(vH).substr(-4) + ":" + pad2(vMn) + ":" + pad2(vS) + (vF>0 ? "." + pad2(vF) : "");
}

function parseDuration12(pTime) {
	if(!pTime) return 0;
	var vParts = pTime.match(/(\d+):(\d+):(\d+)(?:.(\d*))?/);
  var vS = parseInt(vParts[1], 10)*3600 + parseInt(vParts[2], 10) * 60 + parseInt(vParts[3], 10);
  if(vParts[4]) vS+= parseInt(vParts[4].substring(0, 2), 10)/100;
  return vS;
}


function Imp_Api12(pScormComp, pScoDatas) {
	this.fScormComp = pScormComp;
	this.fScoDatas = pScoDatas;
	this.fParticipantId = pScoDatas.participantId;
	this.fScoKey = pScoDatas.scoKey;
	this.fState = "notInit";
}
Imp_Api12.prototype = {
	LMSInitialize : function(p) {
		this.fScormComp.xScoEvent("beforeInit");
		if(this.fState!="notInit") {this.fLastError=301; return "false";}
		this.fLastError = 0;
		this.fState = "running";
		this.fScoDatasDirty = null;
		this.fFields = {cmi:{core:{score:{}}}};
		var vSession = distribEngine.getSession();
		var vUser = vSession.user;
		var vScoDatas = this.fScoDatas;
		delete this.fScoDatas;
		var cmicore = this.fFields.cmi.core;
		cmicore.student_id = vUser.account;
		cmicore.student_name = (vUser.firstName && vUser.lastName) ? vUser.firstName + " " + vUser.lastName : vUser.firstName || vUser.lastName || vUser.email || vUser.account;
		cmicore.lesson_location = vScoDatas.loc;
		cmicore.credit = vScoDatas.credit == "no-credit" ? "no-credit" : "credit";
		cmicore.lesson_status = vScoDatas.status;
		cmicore.entry = vScoDatas.totalTime > 0 ? "resume" : "ab-initio";
		cmicore.score.raw = "scoreRaw" in vScoDatas ? vScoDatas.scoreRaw : "";
		cmicore.score.min = "scoreMin" in vScoDatas ? vScoDatas.scoreMin : "";
		cmicore.score.max = "scoreMax" in vScoDatas ? vScoDatas.scoreMax : "";
		cmicore.total_time = formatDuration12(vScoDatas.totalTime);
		cmicore.lesson_mode = vScoDatas.mode || "normal";
		this.fFields.cmi.suspend_data = vScoDatas.suspendData;
		this.fFields.cmi.launch_data = vScoDatas.launchData;
		//console.log("SCORM12 LMSInitialize()");
		this.fScormComp.xScoEvent("afterInit");
		return "true";
	},
	
	LMSFinish : function(p) {
		this.fScormComp.xScoEvent("beforeClose");
		if(this.fState!="running") {this.fLastError=301; return "false";}
		this.xBeforeClose();
		this.LMSCommit("");
		this.xClose();
		this.fScormComp.xScoEvent("afterClose");
		//console.log("SCORM12 LMSFinish()");
		return "true";
	},
	xBeforeClose : function(){
		if(this.fSessTimeDirty) {
			if(!this.fScoDatasDirty) this.fScoDatasDirty = {};
			this.fScoDatasDirty.sessTime = this.fSessTimeDirty;
		}
	},
	xClose : function(){
		this.fState = "terminated";
	},
	
	LMSGetValue : function(pKey) {
		if(this.fState!="running") {this.fLastError=301; return "false";}
		this.fLastError = 0;
		var vFields = pKey.split(".");
		var vLen = vFields.length;
		var vResult=null;
		switch(vFields[vLen-1]) {
			case "_version" : return "1.0";
			case "_children" : {
				vResult = Imp_Api12._children[vFields[vLen-2]] || "";
				if( ! vResult) this.fLastError = 301;
				break;
			}
			case "_count" : {
				--vLen;
				var vCur = this.fFields;
				for(var i=0; i < vLen; i++) {
					var vF = vCur[vFields[i]];
					if(vF == null) return 0;
					vCur = vF;
				}
				var i = 0;
				for(var vKey in vCur) i++;
				vResult = i;
				break;
			}
			default : {
				var vCur = this.fFields;
				for(var i=0; i < vLen; i++) {
					var vF = vCur[vFields[i]];
					if(vF == null) return null;
					vCur = vF;
				}
				vResult = vCur;			
			}
		}
		//console.log("SCORM12 LMSGetValue('"+pKey+"') -> "+vResult);
		return vResult;
	},
	
	LMSSetValue : function(pKey, pValue) {
		if(this.fState!="running") {this.fLastError=301; return "false";}
		this.fLastError = 0;
		var vFields = pKey.split(".");
		var vCur = this.fFields;
		var imax = vFields.length-1;
		for(var i=0; i<imax; i++) {
			var vF = vCur[vFields[i]];
			if(vF == null) vCur = vCur[vFields[i]] = {}; else vCur = vF;
		}
		if( ! (vFields[imax] in vCur) || vCur[vFields[imax]] != pValue) {
			vCur[vFields[imax]] = pValue;
		}
		//console.log("SCORM12 LMSSetValue('"+pKey+"', '"+pValue+"')");
		
		switch(pKey) {
		case "cmi.core.lesson_location":
			if(!this.fScoDatasDirty) this.fScoDatasDirty = {};
			this.fScoDatasDirty.loc = pValue;
			break;
		case "cmi.core.session_time":
			this.fSessTimeDirty = parseDuration12(pValue);
			break;
		case "cmi.core.lesson_status":
			if(!this.fScoDatasDirty) this.fScoDatasDirty = {};
			this.fScoDatasDirty.status = pValue;
			break;
		case "cmi.core.score.raw":
			if(!this.fScoDatasDirty) this.fScoDatasDirty = {};
			this.fScoDatasDirty.scoreRaw = pValue;
			break;
		case "cmi.core.score.min":
			if(!this.fScoDatasDirty) this.fScoDatasDirty = {};
			this.fScoDatasDirty.scoreMin = pValue;
			break;
		case "cmi.core.score.max":
			if(!this.fScoDatasDirty) this.fScoDatasDirty = {};
			this.fScoDatasDirty.scoreMax = pValue;
			break;
		case "cmi.suspend_data":
			if(!this.fScoDatasDirty) this.fScoDatasDirty = {};
			this.fScoDatasDirty.suspendData = pValue;
			break;
		case "cmi.core.exit":
			//no-op
			break;
		
		default:
			console.log("Store scorm12 field not implemented: "+pKey);
			return "false";
		}
		if(this.fScoDatasDirty.scoreMax != null && this.fScoDatasDirty.scoreMin != null && this.fScoDatasDirty.scoreRaw != null)
			this.fScoDatasDirty.scoreScaled = (this.fScoDatasDirty.scoreRaw - this.fScoDatasDirty.scoreMin) / (this.fScoDatasDirty.scoreMax - this.fScoDatasDirty.scoreMin);
		return "true";
	},

	LMSCommit : function() {
		this.fScormComp.xScoEvent("beforeCommit");
		if(this.fState!="running") {this.fLastError=301; return "false";}
		try {
			this.fLastError = 0;
			if(this.fScoDatasDirty) {
				if(this.fScormComp.xCommitChange(this.fScoKey, this.fScoDatasDirty)) {
					this.fScoDatasDirty = null;
				}
			}
			//console.log("SCORM12 LMSCommit()");
			this.fScormComp.xScoEvent("afterCommit", {"success":true});
			return "true";
		}catch(e){
			this.fLastError = 391;
			console.log("SCORM12 LMSCommit() failed : "+e);
			this.fScormComp.xScoEvent("afterCommit", {"success":false});
			return "false";
		}
	},
	
	LMSGetLastError : function() {
		return this.fLastError;
	},
	
	LMSGetErrorString : function(pKeyError) {
		if (!pKeyError) return "";
		switch(pKeyError) {
			case 0 : return "";
			case 301 : return "Processus d\'initialisation et de clôture non respecté.";
			case 401 : return "Le modèle de donnée ne possède pas de fils."; //TODO corrigé de 301 à revoir...
			case 391 : return "Enregistrement des données impossible. Veuillez contacter votre administrateur.";//General Commit Failure
		}
		return "";
	},
	
	LMSGetDiagnostic : function() {
		return this.LMSGetErrorString(this.fLastError);
	}
}
//interne
Imp_Api12._children = {
	"comments_from_learner" : "comment,location,timestamp",
	"comments_from_lms" : "comment,location,timestamp",
	"interactions" : "id,type,objectives,timestamp,correct_responses,weighting,learner_response,result,latency,description",
	"learner_preference" : "audio_level,language,delivery_speed,audio_captioning",
	"objectives" : "id,score,success_status,completion_status,description",
	"score" : "raw,min,max"
};

//*** Scorm 2004

function formatDuration2k4(pS){
	//format PTxxxxHxxMxx.xxS
	var vF = Math.round(pS*100) % 100;
	var vS = Math.floor(pS) % 60;
	var vM = Math.floor(pS/60) % 60;
	var vH = Math.floor(pS/3600);
	var vTime = "PT";
	if(vH>0) vTime = vTime + vH + "H";
	if(vM>0) vTime = vTime + vM + "M";
	if(vS>0 || vF>0 || vTime == "PT") vTime = vTime + vS + (vF>0 ? '.'+vF : '') + "S";
	return vTime;
}

function parseDuration2k4(pTime) {
	if(!pTime) return 0;
  var vParts = pTime.match(/P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?/);
  var vS=0;
  if(vParts[1]) vS+=parseInt(vParts[1], 10) * 31557600; //365.25 * 86400
  if(vParts[2]) vS+=parseInt(vParts[2], 10) * 2629800; //365.25 /12 * 86400
  if(vParts[3]) vS+=parseInt(vParts[3], 10) * 86400; //24*60*60
  if(vParts[4]) vS+=parseInt(vParts[4], 10) * 3600; //60*60
  if(vParts[5]) vS+=parseInt(vParts[5], 10) * 60;
  if(vParts[6]) vS+=parseFloat(vParts[6]);
  //console.log("parseTimestamp2k4:::" + pTime + "  -->  " + vS);
  return vS;
}


function formatTimestamp2k4(pMS){
	if(!pMS) return "";
	var vD = new Date();
	vD.setTime(pMS);
  return vD.getUTCFullYear() +
    '-' + pad2(vD.getUTCMonth() + 1) +
    '-' + pad2(vD.getUTCDate()) +
    'T' + pad2(vD.getUTCHours()) +
    ':' + pad2(vD.getUTCMinutes()) +
    ':' + pad2(vD.getUTCSeconds()) +
    '.' + pad2(Math.round(vD.getUTCMilliseconds() / 10)) +
    'Z';
}
function parseTimestamp2k4(pTime) {
	//FIXME IE8 impl manuelle.
	return Date.parse(pTime);
}


function Imp_API_1484_11 (pScormComp, pScoDatas) {
	this.fScormComp = pScormComp;
	this.fScoDatas = pScoDatas;
	this.fParticipantId = pScoDatas.participantId;
	this.fScoKey = pScoDatas.scoKey;
	this.fState = "notInit";
}
Imp_API_1484_11.prototype = {
	Initialize : function(p) {
		this.fScormComp.xScoEvent("beforeInit");
		if(this.fState!="notInit") {this.fLastError= this.fState=="running" ? 103 : 104; return "false";}
		this.fLastError = 0;
		this.fState = "running";
		this.fScoDatasDirty = null;
		this.fFields = {cmi:{score:{},comments_from_learner:[]}};
		var vSession = distribEngine.getSession();
		var vUser = vSession.user;
		var vScoDatas = this.fScoDatas;
		delete this.fScoDatas;
		var cmi = this.fFields.cmi;
		cmi.learner_id = vUser.account;
		cmi.learner_name = (vUser.firstName && vUser.lastName) ? vUser.firstName + " " + vUser.lastName : vUser.firstName || vUser.lastName || vUser.email || vUser.account;
		cmi.location = vScoDatas.loc;
		cmi.credit = vScoDatas.credit == "no-credit" ? "no-credit" : "credit";
		cmi.completion_status = vScoDatas.status;
		cmi.entry = vScoDatas.totalTime > 0 ? "resume" : "ab-initio";
		cmi.score.scaled = "scoreScaled" in vScoDatas ? vScoDatas.scoreScaled : "";
		cmi.score.raw = "scoreRaw" in vScoDatas ? vScoDatas.scoreRaw : "";
		cmi.score.min = "scoreMin" in vScoDatas ? vScoDatas.scoreMin : "";
		cmi.score.max = "scoreMax" in vScoDatas ? vScoDatas.scoreMax : "";
		cmi.total_time = formatDuration2k4(vScoDatas.totalTime);
		cmi.mode = vScoDatas.mode || "normal";
		cmi.suspend_data = vScoDatas.suspendData;
		cmi.launch_data = vScoDatas.launchData;
		if(vScoDatas.comments) {
			var cmiCms = cmi.comments_from_learner;
			for(var i=0; i<vScoDatas.comments.length; i++) {
				var vCm = vScoDatas.comments[i];
				cmiCms[vCm.idx] = {
					timestamp : formatTimestamp2k4(vCm.ts),
					location : vCm.loc,
					comment : vCm.txt
				}
			}
		}
		//console.log("SCORM2k4 Initialize()");
		this.fScormComp.xScoEvent("afterInit");
		return "true";
	},
	
	Terminate : function(p) {
		this.fScormComp.xScoEvent("beforeClose");
		if(this.fState!="running") {this.fLastError= this.fState=="notInit" ? 112 : 113; return "false";}
		this.xBeforeClose();
		this.Commit("");
		this.xClose();
		//console.log("SCORM2k4 Terminate()");
		this.fScormComp.xScoEvent("afterClose");
		return "true";
	},
	xBeforeClose : function(){
		if(this.fSessTimeDirty) {
			if(!this.fScoDatasDirty) this.fScoDatasDirty = {};
			this.fScoDatasDirty.sessTime = this.fSessTimeDirty;
			//console.log("add sessionTime:::::" + this.fSessTimeDirty );
		}
	},
	xClose : function(){
		this.fState = "terminated";
	},
	
	GetValue : function(pKey) {
		if(this.fState!="running") {this.fLastError= this.fState=="notInit" ? 122 : 123; return "false";}
		this.fLastError = 0;
		var vFields = pKey.split(".");
		var vLen = vFields.length;
		var vResult = null;
		switch(vFields[vLen-1]) {
			case "_version" : return "1.0";
			case "_children" : {
				vResult = Imp_API_1484_11._children[vFields[vLen-2]] || "";
				if( ! vResult) this.fLastError = 301;
				break;
			}
			case "_count" : {
				--vLen;
				var vCur = this.fFields;
				for(var i=0; i < vLen; i++) {
					var vF = vCur[vFields[i]];
					if(vF == null) return 0;
					vCur = vF;
				}
				vResult = vCur.length;
				if(vResult === undefined) {
					vResult = 0;
					for(var vKey in vCur) vResult++;
				}
				break;
			}
			default : {
				var vCur = this.fFields;
				for(var i=0; i < vLen; i++) {
					var vF = vCur[vFields[i]];
					if(vF == null) return null;
					vCur = vF;
				}
				vResult = vCur;
			}
		}
		//console.log("SCORM2k4 GetValue('"+pKey+"') -> "+vResult);
		return vResult;
	},
	
	SetValue : function(pKey, pValue) {
		if(this.fState!="running") {this.fLastError= this.fState=="notInit" ? 132 : 133; return "false";}
		//console.log("SCORM2k4 SetValue('"+pKey+"', '"+pValue+"')");
		this.fLastError = 0;
		var vFields = pKey.split(".");
		if(vFields[1]=="comments_from_learner" && vFields[0]=="cmi") {
			var vIdx = vFields[2];
			var vCmiCm = this.fFields.cmi.comments_from_learner;
			if(vIdx > vCmiCm.length) {
				this.fLastError = 301;
				return "false";
			} else {
				if(!this.fScoDatasDirty) this.fScoDatasDirty = {};
				if(this.fScoDatasDirty.comments == null) this.fScoDatasDirty.comments = [];
				var vCms = this.fScoDatasDirty.comments; 
				var vCm;
				for(var i=0; i < vCms.length; i++) {
					if(vCms[i].idx==vIdx) {vCm = vCms[i]; break;}
				}
				if(!vCm) {
					vCm = {idx:vIdx};
					this.fScoDatasDirty.comments.push(vCm);
				}
				switch(vFields[3]) {
				case "timestamp":
					vCm.ts = parseTimestamp2k4(pValue);
					break;
				case "location":
					vCm.loc = pValue;
					break;
				case "comment":
					vCm.txt = pValue;
					break;
				default: 
					this.fLastError = 301;
					return "false";
				}
				if(!vCmiCm[vIdx]) vCmiCm[vIdx]={};
				vCmiCm[vIdx][vFields[3]] = pValue;
				return "true";
			}
		}
		
		switch(pKey) {
		case "cmi.location":
			if(!this.fScoDatasDirty) this.fScoDatasDirty = {};
			this.fScoDatasDirty.loc = pValue;
			break;
		case "cmi.session_time":
			this.fSessTimeDirty = parseDuration2k4(pValue);
			break;
		case "cmi.completion_status":
			if(!this.fScoDatasDirty) this.fScoDatasDirty = {};
			this.fScoDatasDirty.status = pValue;
			break;
		case "cmi.score.scaled":
			if(!this.fScoDatasDirty) this.fScoDatasDirty = {};
			this.fScoDatasDirty.scoreScaled = pValue;
			break;
		case "cmi.score.raw":
			if(!this.fScoDatasDirty) this.fScoDatasDirty = {};
			this.fScoDatasDirty.scoreRaw = pValue;
			break;
		case "cmi.score.min":
			if(!this.fScoDatasDirty) this.fScoDatasDirty = {};
			this.fScoDatasDirty.scoreMin = pValue;
			break;
		case "cmi.score.max":
			if(!this.fScoDatasDirty) this.fScoDatasDirty = {};
			this.fScoDatasDirty.scoreMax = pValue;
			break;
		case "cmi.suspend_data":
			if(!this.fScoDatasDirty) this.fScoDatasDirty = {};
			this.fScoDatasDirty.suspendData = pValue;
			break;
		case "cmi.exit":
			//no-op
			break;
		default:
			console.log("Store scorm2k4 field not implemented: "+pKey);
			return "false";
		}		
		//affectation générique
		var vCur = this.fFields;
		var imax = vFields.length-1;
		for(var i=0; i<imax; i++) {
			var vF = vCur[vFields[i]];
			if(vF == null) vCur = vCur[vFields[i]] = {}; else vCur = vF;
		}
		if( ! (vFields[imax] in vCur) || vCur[vFields[imax]] != pValue) {
			vCur[vFields[imax]] = pValue;
		}
		//Recalcul auto du score scaled si scoreMax, Min, Raw connus.
		if(this.fScoDatasDirty.scoreMax != null && this.fScoDatasDirty.scoreMin != null && this.fScoDatasDirty.scoreRaw != null)
			this.fScoDatasDirty.scoreScaled = (this.fScoDatasDirty.scoreRaw - this.fScoDatasDirty.scoreMin) / (this.fScoDatasDirty.scoreMax - this.fScoDatasDirty.scoreMin);

		return "true";
	},

	Commit : function(p) {
		this.fScormComp.xScoEvent("beforeCommit");
		if(this.fState!="running") {this.fLastError= this.fState=="notInit" ? 142 : 143; return "false";}
		try {
			this.fLastError = 0;
			if(this.fScoDatasDirty) {
				if(this.fScormComp.xCommitChange(this.fScoKey, this.fScoDatasDirty)) {
					this.fScoDatasDirty = null;
				}
			}
			//console.log("SCORM2k4 Commit()");
			this.fScormComp.xScoEvent("afterCommit", {"success":true});
			return "true";
		}catch(e){
			this.fLastError = 391;
			//console.log("SCORM2k4 Commit() failed : "+e);
			this.fScormComp.xScoEvent("afterCommit", {"success":false});
			return "false";
		}
	},
	
	GetLastError : function() {
		return this.fLastError;
	},
	
	GetErrorString : function(pKeyError) {
		if (!pKeyError) return "";
		switch(pKeyError) {
			case 0 : return "";
			case 103 : return "Le SCO a déjà été initialisé.";
			case 104 : return "Le SCO a été clos.";
			case 112 : return "Le SCO a été terminé avant d\'être initialisé.";
			case 113 : return "Le SCO a déjà été terminé.";
			case 301 : return "Le modèle de donnée ne possède pas de fils.";
			case 391 : return "Enregistrement des données impossible. Veuillez contacter votre administrateur.";//General Commit Failure
		}
		return "";
	},
	
	GetDiagnostic : function() {
		return this.GetErrorString(this.fLastError);
	}
}

//interne
Imp_API_1484_11._children = {
	"comments_from_learner" : "comment,location,timestamp",
	"comments_from_lms" : "comment,location,timestamp",
	"interactions" : "id,type,objectives,timestamp,correct_responses,weighting,learner_response,result,latency,description",
	"learner_preference" : "audio_level,language,delivery_speed,audio_captioning",
	"objectives" : "id,score,success_status,completion_status,description",
	"score" : "scaled,raw,min,max"
}

})(window);
