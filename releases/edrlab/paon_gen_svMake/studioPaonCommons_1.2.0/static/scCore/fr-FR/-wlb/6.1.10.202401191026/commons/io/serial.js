class FactoryRegistry{constructor(name,parent){this.name=name
this._parent=parent
this._msgFactories={}}register(factory){this._msgFactories[factory.type]=factory}getFactory(type){let factory=this._msgFactories[type]
if(!factory){if(this._parent)factory=this._parent.getFactory(type)
if(!factory)throw Error(`Type '${type}' not found in FactoryRegistry ${this.name}`)}return factory}newFromJson(json){const fact=this.getFactory(json.type)
return fact?fact.buildFromJson(json):null}newFromStruct(struct){const fact=this.getFactory(struct.type)
return fact?fact.buildFromStruct(struct):null}}export var ESerialMode;(function(ESerialMode){ESerialMode[ESerialMode["json"]=0]="json"
ESerialMode[ESerialMode["struct"]=1]="struct"
ESerialMode[ESerialMode["clone"]=2]="clone"})(ESerialMode||(ESerialMode={}))
class Serializable{static buildFromJson(json){return(new this).readFrom(json,ESerialMode.json)}static buildFromStruct(struct){return(new this).readFrom(struct,ESerialMode.struct)}get type(){return this.constructor.type}clone(){const clone=new this.constructor
this.writeTo(clone,ESerialMode.clone)
return clone}toJSON(){const json=Object.create(null)
json.type=this.type
this.writeTo(json,ESerialMode.json)
return json}toStruct(){const struct=Object.create(null)
struct.type=this.type
this.writeTo(struct,ESerialMode.struct)
return struct}toString(){return JSON.stringify(this.toJSON())}static serialSerializable(o,mode){if(o==null)return o
switch(mode){case ESerialMode.json:return o
case ESerialMode.clone:return o.clone()
case ESerialMode.struct:return o.toStruct()}throw Error("unknown mode")}static deserialSerializable(o,mode,reg){switch(mode){case ESerialMode.json:return reg.newFromJson(o)
case ESerialMode.struct:return reg.newFromStruct(o)}throw Error("unknown mode")}static serialArrayPrimitives(a,mode){return mode===ESerialMode.clone?a.concat():a}static serialObjectPrimitives(o,mode){return mode===ESerialMode.clone?Object.assign({},o):o}static serialArraySerializables(a,mode){switch(mode){case ESerialMode.json:return a
case ESerialMode.clone:return a.map(m=>m.clone())
case ESerialMode.struct:return a.map(m=>m.toStruct())}throw Error("unknown mode")}static deserialArraySerializables(a,mode,reg){switch(mode){case ESerialMode.json:return a.map(m=>reg.newFromJson(m))
case ESerialMode.struct:return a.map(m=>reg.newFromStruct(m))}throw Error("unknown mode")}static serialObjectSerializables(o,mode){switch(mode){case ESerialMode.json:return o
case ESerialMode.clone:{const res={}
for(const prop in o){res[prop]=o[prop].clone()}return res}case ESerialMode.struct:{const res=Object.create(null)
for(const prop in o){res[prop]=o[prop].toStruct()}return res}}throw Error("unknown mode")}static serialDate(d,mode){return mode===ESerialMode.struct?d:d.getTime()}static deserialDate(d,mode){return mode===ESerialMode.struct?d:new Date(d)}}export{FactoryRegistry,Serializable}

//# sourceMappingURL=serial.js.map