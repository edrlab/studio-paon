export function markdownParse(str){const arr=str.replace(/</g,"&lt;").split("\n")
let i=0
let j=arr.length
if(j===1){return parse_line(arr[i])}const rtn=[]
for(;i<j;i++){rtn.push(parse_line("\n"+arr[i].trim()+"\n"))}let rtnS=rtn.join("\n")
for(i=0,j=fixes.length;i<j;i++){rtnS=preg_replace(fixes[i][0],fixes[i][1],rtnS)}return rtnS}function parse_line(str){for(let i=0,j=rules.length;i<j;i++){const r=rules[i][0]
const v=rules[i][1]
if(typeof v=="function"){r.lastIndex=-1
const matches=r.exec(str)
if(matches!==null){if(matches.length>1){str=preg_replace(r,v(matches[1],matches[2]),str)}else{str=preg_replace(r,v(matches[0]),str)}}}else{str=preg_replace(r,v,str)}}return str.trim()}function preg_replace(regExp,replace,subject){const i=[]
let j=0,k=0,l=subject,m
if(regExp.flags.indexOf("g")>=0){regExp.lastIndex=-1
do{m=regExp.exec(subject)
if(m===null)break
i.push(m)}while(true)}else{m=regExp.exec(subject)
if(m!==null)i.push(m)}for(j=i.length-1;j>-1;j--){for(m=replace,k=i[j].length;k>-1;k--)m=m.replace("${"+k+"}",i[j][k]).replace("$"+k,i[j][k]).replace("\\"+k,i[j][k])
l=l.replace(i[j][0],m)}return l}const rules=[[/\n(#+)(.*)/g,(chars,header)=>{const level=chars.length
return"<h"+level+">"+header.trim()+"</h"+level+">"}],[/!\[([^\[]+)]\(([^(]+)\)/g,'<img src="\\2" alt="\\1" />'],[/\[([^\[]+)]\(([^(]+)\)/g,'<a href="\\2">\\1</a>'],[/\b(__)(.*?)\1\b/g,"<strong>\\2</strong>"],[/(\*\*)(.*?)\1/g,"<strong>\\2</strong>"],[/\b([_])(.*?)\1\b/g,"<em>\\2</em>"],[/([*])(.*?)\1/g,"<em>\\2</em>"],[/\b(~~)(.*?)\1\b/g,"<del>\\2</del>"],[/:"(.*?)":/g,"<q>\\1</q>"],[/\n[*-](.*)/g,function(item){return"<ul>\n<li>"+item.trim()+"</li>\n</ul>"}],[/\n[0-9]+\.(.*)/g,function(item){return"<ol>\n<li>"+item.trim()+"</li>\n</ol>"}],[/\n\\>(.*)/g,function(str){return"<blockquote>"+str.trim()+"</blockquote>"}],[/\n[^\n]+\n/g,function(line){line=line.trim()
if(line[0]==="<"){return line}return"\n<p>"+line+"</p>\n"}]]
const fixes=[[/<\/ul>\n<ul>/g,"\n"],[/<\/ol>\n<ol>/g,"\n"],[/<\/blockquote>\n<blockquote>/g,"\n"]]

//# sourceMappingURL=markdown.js.map