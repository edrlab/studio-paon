export var EGitState;(function(EGitState){EGitState[EGitState["none"]=-1]="none"
EGitState[EGitState["insynch"]=0]="insynch"
EGitState[EGitState["conflicting"]=1]="conflicting"
EGitState[EGitState["untracked"]=2]="untracked"
EGitState[EGitState["ignored"]=4]="ignored"
EGitState[EGitState["added"]=8]="added"
EGitState[EGitState["changed"]=16]="changed"
EGitState[EGitState["modified"]=32]="modified"
EGitState[EGitState["removed"]=64]="removed"
EGitState[EGitState["missing"]=128]="missing"})(EGitState||(EGitState={}))
export var WSP_GIT;(function(WSP_GIT){function getSimpleState(gitSt){if(gitSt===undefined||gitSt===EGitState.none)return"none"
if(gitSt===EGitState.insynch)return"insynch"
if(match(gitSt,EGitState.conflicting))return"conflict"
if(gitSt===EGitState.untracked)return"untracked"
if(gitSt===EGitState.ignored)return"ignored"
if(match(gitSt,EGitState.added))return"adding"
if(match(gitSt,EGitState.missing)||match(gitSt,EGitState.removed))return"deleting"
if(match(gitSt,EGitState.modified)||match(gitSt,EGitState.changed))return"updating"
throw Error("Unkonwn simple GIT status : "+gitSt)}WSP_GIT.getSimpleState=getSimpleState
function match(st,flag){return(st&flag)===flag}WSP_GIT.match=match
function getGitStateLabel(st){return gitSimpleStates[st]||""}WSP_GIT.getGitStateLabel=getGitStateLabel
const gitSimpleStates={none:"Aucun entrepôt Git détecté",insynch:"",untracked:"Fichier non suivi par Git",ignored:"Fichier explicitement ignoré par Git",adding:"Fichier en cours d\'ajout dans Git",updating:"Fichier en cours de modification Git",deleting:"Fichier en cours de suppression Git",conflict:"Fichier en conflit Git"}})(WSP_GIT||(WSP_GIT={}))

//# sourceMappingURL=git.js.map