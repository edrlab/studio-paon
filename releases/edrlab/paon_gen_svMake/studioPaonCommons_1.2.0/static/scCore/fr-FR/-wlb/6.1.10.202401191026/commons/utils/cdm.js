export const CDM={stringify:function(data){if(data===undefined)return""
let string=""
const type=typeof data
if(data===true)string+="!T!"
else if(data===false)string+="!F!"
else if(type==="number")string+="!"+(isNaN(data)?"N":data.toString())+"!"
else if(data===null)string+="!!"
else if(type!="object"){if(type!=="string")data=new String(data)
string+="'"
string+=data.replace(/'/g,"''")
string+="'"}else if(Array.isArray(data)){string+="*"
if(data.length>0){string+=this.stringify(data[0])
for(let i=1;i<data.length;i++){string+="."
string+=this.stringify(data[i])}}string+="-"}else{string+="("
let first=true
for(const name in data){if(data[name]!==undefined){if(/[^0-z]/.test(name)){string+=first?"'":".'"
string+=name.replace(/'/g,"''")
string+="'."}else{string+=name}string+=this.stringify(data[name])
if(first)first=false}}string+=")"}return string},parse:function(string,pos={idx:0},root=true){if(!string.length)throw new SyntaxError(UNESPECTED_END_ERROR)
let char=skipSpaces(string,pos)
while(char){if(char=="*"){const array=[]
pos.idx++
char=skipSpaces(string,pos)
while(char!="-"){if(!char)throw new SyntaxError(UNESPECTED_END_ERROR)
array.push(this.parse(string,pos,false))
char=skipSpaces(string,pos)}pos.idx++
return array}else if(char=="!"){const valStart=++pos.idx
char=string[pos.idx++]
while(char!="!"){if(!char)throw new SyntaxError(UNESPECTED_END_ERROR)
char=string[pos.idx++]}const val=string.substring(valStart,pos.idx-1)
if(val=="")return null
else if(val=="T")return true
else if(val=="F")return false
else return parseFloat(val)}else if(char=="("||root){let endChar=null
if(char=="("){endChar=")"
pos.idx++}const object={}
char=skipSpaces(string,pos)
while(char!=endChar){if(!char)throw new SyntaxError(UNESPECTED_END_ERROR)
let key
if(char=="'"){key=this.parse(string,pos,false)
pos.idx++
char=skipSpaces(string,pos)}else{const keyStart=pos.idx
while(char&&/[0-z]/.test(char))char=string[++pos.idx]
key=string.substring(keyStart,pos.idx)
char=skipSpaces(string,pos)}if(char==null&&root){return key}object[key]=this.parse(string,pos,false)
char=skipSpaces(string,pos)}pos.idx++
return object}else if(char=="'"){const strStart=++pos.idx
char=string[pos.idx++]
while(char!="'"||string[pos.idx]=="'"){if(!char)throw new SyntaxError(UNESPECTED_END_ERROR)
if(char=="'")pos.idx++
char=string[pos.idx++]}return string.substring(strStart,pos.idx-1).replace(/''/g,"'")}else{throw SyntaxError(`Unexpected token ${char} in CDM at position ${pos.idx}`)}}}}
const UNESPECTED_END_ERROR="Unexpected end of CDM input"
function skipSpaces(string,pos={idx:0}){let char=string[pos.idx]
while(char==" "||char=="."||char=="\t"||char=="\n")char=string[++pos.idx]
return char}
//# sourceMappingURL=cdm.js.map