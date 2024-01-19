var saas = {}

saas.InstType = function(code){
	this.code = code;
}
saas.InstType.prototype = {
	getLabel : function(props){
		var vCurLabel = this.label;
		while (vCurLabel.indexOf("@[")!=-1){
			vCurLabel =  vCurLabel.substring(0,vCurLabel.indexOf("@[")) + props[vCurLabel.substring(vCurLabel.indexOf("@[")+2,vCurLabel.indexOf("]"))]+vCurLabel.substring(vCurLabel.indexOf("]")+1);
		}
		return vCurLabel;
	},
	setLabelTemplate : function(label){
		this.label = label;
		return this;
	},
	setUrlTemplate : function(url){
		this.url = url;
		return this;
	},
	getUrl : function(props){
		var vCurUrl = this.url;
		while (vCurUrl.indexOf("@[")!=-1){
			vCurUrl =  vCurUrl.substring(0,vCurUrl.indexOf("@[")) + props[vCurUrl.substring(vCurUrl.indexOf("@[")+2,vCurUrl.indexOf("]"))]+vCurUrl.substring(vCurUrl.indexOf("]")+1);
		}
		return vCurUrl;
	}
}

saas.Set = function() {
	this.instTypes = {};
	this.vars = {};
	this.staticVars = {};
	this.sep = "_";
}
saas.Set.prototype = {
	setSep : function(sep){
		this.sep = sep;
		return this;
	},
	getSep : function(){
		return this.sep;
	},
	addInstType : function(instType){
		//Set de instTypes
		this.instTypes[instType.code] = instType;
		return this;
	},

	getInstTypes : function(){
		return Object.keys(this.instTypes);
	},

	//Key peut être une instId ou une instType
	getInstType : function(key){
		if(!key) return null;
		if(this.instTypes[key]) return this.instTypes[key];
		key = key.split("_");
		key = key.pop();
		return this.instTypes[key];
	},

	addVar : function (variable, stored){
		//Set de vars
		this.vars[variable] = stored;
		return this;
	},
	addStaticVar : function (key,value){
		//Set de vars
		this.staticVars[key] = value;
		return this;
	},

	extractAllVars : function(instId){
		var props = this.extractVarsToSend(instId);
		var staticKeys = Object.keys(this.staticVars);
		props["instance.id"] = instId;
		for(var i = 0 ; i < staticKeys.length ; i++) props[staticKeys[i]] = this.staticVars[staticKeys[i]];
		return props;
	},

	extractVarsToSend : function(instId){
		var props = {};
		var values = instId.split(this.sep);
		var keys = Object.keys(this.vars).sort();
		var j = 0;
		for(var i = 0 ; i < keys.length ; i++) {
			switch (this.vars[keys[i]]) {
				case "encoded":
					props[keys[i]] = atob(values[j]);
					j++;
					break;
				case "none":
					break;
				default:
					props[keys[i]] = values[j];
					j++;
					break;
			}
		}
		return props;
	},
	
	extractInstType : function(instId){
		return instId.split(this.sep).pop();
	},


	buildInstId : function(props,instType){
		if(!this.instTypes[instType]) return null;
		return this.buildInstIdFromSetId(this.buildSetId(props),instType);
	},

	buildInstIdFromSetId : function(setId,instType){
		if(!this.instTypes[instType]) return null;
		return setId+this.sep+instType;
	},

	buildSetId : function(props){
		var setId = "";

		var keys = Object.keys(this.vars).sort();
		for(var i = 0 ; i < keys.length ; i++) {
			switch (this.vars[keys[i]]) {
				case "encoded":
					setId+=btoa(props[keys[i]]).replace(/=+/,"");
					break;
				case "none":
					break;
				default:
					setId+=props[keys[i]];
					break;
			}
			if(i +1 != keys.length && this.vars[keys[i]]!="none") setId+=this.sep;
		}
		return setId;
	},

	refreshEnumSetId : function(instances){
		var insts = {};
		instances.forEach(function(inst){
			var setId = inst.instId.split(this.sep);
			setId.pop();
			setId = setId.join(this.sep);
			insts[setId] = setId;
		},this)
		
		extPoints.getSvc('saas:fields:setIdEnum').setSimpleMap(insts);
	}
};