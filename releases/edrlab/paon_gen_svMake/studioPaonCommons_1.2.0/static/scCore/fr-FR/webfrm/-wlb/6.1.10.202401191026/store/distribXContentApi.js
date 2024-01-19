/**
 * Reception des events xContentApi-statement, enrichissement et envoi au serveur.
 */
(function(window){
	
window.distribXContentApi = {
	
	fEngine : distribEngine,
	fDepotPath : null,
	fParticipantId : null,
	
	prepareForDepotPath : function(pDepotPath, pCbDepotPath, pCbDepotPathThis){
		this.fDepotPath = pDepotPath;		
		for(var vPartId in distribEngine.fSession.participants){
			var vParticipant = distribEngine.fSession.participants[vPartId];
			if(distribEngine.fSession.projects[vParticipant.projectId]){
				distribEngine.fSession.projects[vParticipant.projectId].comps.forEach(function(pComp){
					if(pComp.depotPath == pDepotPath) distribXContentApi.fParticipantId = vPartId;
				});
			}
		}
		pCbDepotPath.call(pCbDepotPathThis);
	},
	onResMessage : function(pEvent){
		if(pEvent.data["XContentApi-statement"]) {
			var vEvent = pEvent.data["XContentApi-statement"];
			vEvent.type = "XContentApi";
			vEvent.clt_ts = new Date().getTime();
			vEvent.depot_path = window.distribXContentApi.fDepotPath;
			window.distribEngine.sendParticipantMsgs(window.distribXContentApi.fParticipantId, vEvent, vEvent.verb!="completed");
		}
		if(pEvent.data["XContentApi-flush"]) distribXContentApi.flush();

	},
	flush : function(){
		window.distribEngine.pingServer();
	}
};

distribEngine.addPlugin(distribXContentApi);
window.addEventListener("message", distribXContentApi.onResMessage);

})(window);
