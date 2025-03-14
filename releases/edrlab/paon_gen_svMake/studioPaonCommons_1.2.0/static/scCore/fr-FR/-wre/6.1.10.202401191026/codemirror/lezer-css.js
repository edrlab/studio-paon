import { ExternalTokenizer, Parser, NodeProp } from  './lezer.js';

// This file was generated by lezer-generator. You probably shouldn't edit it.
const 
  descendantOp = 92,
  Unit = 1,
  callee = 93,
  identifier = 94;

/* Hand-written tokenizers for CSS tokens that can't be
   expressed by Lezer's built-in tokenizer. */

const space = [9, 10, 11, 12, 13, 32, 133, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197,
               8198, 8199, 8200, 8201, 8202, 8232, 8233, 8239, 8287, 12288];
const colon = 58, parenL = 40, underscore = 95, bracketL = 91, dash = 45, period = 46,
      hash = 35, percent = 37;

function isAlpha(ch) { return ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122 || ch >= 161 }

function isDigit(ch) { return ch >= 48 && ch <= 57 }

const identifiers = new ExternalTokenizer((input, token) => {
  let start = token.start, pos = start, inside = false;
  for (;;) {
    let next = input.get(pos);
    if (isAlpha(next) || next == dash || next == underscore || (inside && isDigit(next))) {
      if (!inside && (next != dash || pos > start)) inside = true;
      pos++;
      continue
    }
    if (inside)
      token.accept(next == parenL ? callee : identifier, pos);
    break
  }
});

const descendant = new ExternalTokenizer((input, token) => {
  if (space.includes(input.get(token.start - 1))) {
    let next = input.get(token.start);
    if (isAlpha(next) || next == underscore || next == hash || next == period ||
        next == bracketL || next == colon || next == dash)
      token.accept(descendantOp, token.start);
  }
});

const unitToken = new ExternalTokenizer((input, token) => {
  let {start} = token;
  if (!space.includes(input.get(start - 1))) {
    let next = input.get(start);
    if (next == percent) token.accept(Unit, start + 1);
    if (isAlpha(next)) {
      let pos = start + 1;
      while (isAlpha(input.get(pos))) pos++;
      token.accept(Unit, pos);
    }
  }
});

// This file was generated by lezer-generator. You probably shouldn't edit it.
const spec_callee = {__proto__:null,not:30, url:64, "url-prefix":64, domain:64, regexp:64, selector:132};
const spec_AtKeyword = {__proto__:null,"@import":112, "@media":136, "@charset":140, "@namespace":144, "@keyframes":150, "@supports":162};
const spec_identifier = {__proto__:null,not:126, only:126, from:156, to:158};
const parser = Parser.deserialize({
  version: 13,
  states: "7WOYQ[OOOOQP'#Cc'#CcOOQP'#Cb'#CbO!ZQ[O'#CeO!}QXO'#C`O#UQ[O'#CgO#aQ[O'#DOO#fQ[O'#DSOOQP'#Eb'#EbO#kQdO'#DdO$SQ[O'#DqO#kQdO'#DsO$eQ[O'#DuO$pQ[O'#DxO$uQ[O'#EOO%TQ[O'#EQOOQS'#Ea'#EaOOQS'#ER'#ERQYQ[OOOOQP'#Cf'#CfOOQP,59P,59PO!ZQ[O,59PO%[Q[O'#ESO%vQWO,58zO&OQ[O,59RO#aQ[O,59jO#fQ[O,59nO%[Q[O,59rO%[Q[O,59tO%[Q[O,59uO'[Q[O'#D_OOQS,58z,58zOOQP'#Cj'#CjOOQO'#Cp'#CpOOQP,59R,59RO'cQWO,59RO'hQWO,59ROOQP'#DQ'#DQOOQP,59j,59jOOQO'#DU'#DUO'mQ`O,59nOOQS'#Cr'#CrO#kQdO'#CsO'uQvO'#CuO(|QtO,5:OOOQO'#Cz'#CzO'hQWO'#CyO)bQWO'#C{OOQS'#Ef'#EfOOQO'#Dg'#DgO)gQ[O'#DnO)uQWO'#EhO$uQ[O'#DlO*TQWO'#DoOOQO'#Ei'#EiO%yQWO,5:]O*YQpO,5:_OOQS'#Dw'#DwO*bQWO,5:aO*gQ[O,5:aOOQO'#Dz'#DzO*oQWO,5:dO*tQWO,5:jO*|QWO,5:lOOQS-E8P-E8POOQP1G.k1G.kO+pQXO,5:nOOQO-E8Q-E8QOOQS1G.f1G.fOOQP1G.m1G.mO'cQWO1G.mO'hQWO1G.mOOQP1G/U1G/UO+}Q`O1G/YO,hQXO1G/^O-OQXO1G/`O-fQXO1G/aO-|QXO'#CcO.qQWO'#D`OOQS,59y,59yO.vQWO,59yO/OQ[O,59yO/VQ[O'#CnO/^QdO'#CqOOQP1G/Y1G/YO#kQdO1G/YO/eQpO,59_OOQS,59a,59aO#kQdO,59cO/mQWO1G/jOOQS,59e,59eO/rQ!bO,59gO/zQWO'#DgO0VQWO,5:SO0[QWO,5:YO$uQ[O,5:UO$uQ[O'#EXO0dQWO,5;SO0oQWO,5:WO%[Q[O,5:ZOOQS1G/w1G/wOOQS1G/y1G/yOOQS1G/{1G/{O1QQWO1G/{O1VQdO'#D{OOQS1G0O1G0OOOQS1G0U1G0UOOQS1G0W1G0WOOQP7+$X7+$XOOQP7+$t7+$tO#kQdO7+$tO#kQdO,59zO1eQ[O'#EWO1oQWO1G/eOOQS1G/e1G/eO1oQWO1G/eO1wQXO'#EdO2OQWO,59YO2TQtO'#ETO2uQdO'#EeO3PQWO,59]O3UQpO7+$tOOQS1G.y1G.yOOQS1G.}1G.}OOQS7+%U7+%UO3^QWO1G/RO#kQdO1G/nOOQO1G/t1G/tOOQO1G/p1G/pO3cQWO,5:sOOQO-E8V-E8VO3qQXO1G/uOOQS7+%g7+%gO3xQYO'#CuO%yQWO'#EYO4QQdO,5:gOOQS,5:g,5:gO4`QpO<<H`O4hQtO1G/fOOQO,5:r,5:rO4{Q[O,5:rOOQO-E8U-E8UOOQS7+%P7+%PO5VQWO7+%PO5_QWO,5;OOOQP1G.t1G.tOOQS-E8R-E8RO#kQdO'#EUO5gQWO,5;POOQT1G.w1G.wOOQP<<H`<<H`OOQS7+$m7+$mO5oQdO7+%YOOQO7+%a7+%aOOQS,5:t,5:tOOQS-E8W-E8WOOQS1G0R1G0ROOQPAN=zAN=zO5vQtO'#EVO#kQdO'#EVO6nQdO7+%QOOQO7+%Q7+%QOOQO1G0^1G0^OOQS<<Hk<<HkO7OQdO,5:pOOQO-E8S-E8SOOQO<<Ht<<HtO7YQtO,5:qOOQS-E8T-E8TOOQO<<Hl<<Hl",
  stateData: "8W~O#SOSQOS~OTWOWWO[TO]TOsUOwVO!X_O!YXO!fYO!hZO!j[O!m]O!s^O#QPO#VRO~O#QcO~O[hO]hOcfOsiOwjO{kO!OmO#OlO#VeO~O!QnO~P!`O_sO#PqO#QpO~O#QuO~O#QwO~OazOh!QOj!QOp!PO#P}O#QyO#Z{O~Oa!SO!a!UO!d!VO#Q!RO!Q#[P~Oj![Op!PO#Q!ZO~O#Q!^O~Oa!SO!a!UO!d!VO#Q!RO~O!V#[P~P$SOTWOWWO[TO]TOsUOwVO#QPO#VRO~OcfO!QnO~O_!hO#PqO#QpO~OTWOWWO[TO]TOsUOwVO!X_O!YXO!fYO!hZO!j[O!m]O!s^O#Q!oO#VRO~O!P!qO~P&ZOa!tO~Oa!uO~Ou!vOy!wO~OP!yOaiXliX!ViX!aiX!diX#QiX`iXciXhiXjiXpiX#PiX#ZiXuiX!PiX!UiX~Oa!SOl!zO!a!UO!d!VO#Q!RO!V#[P~Oa!}O~Oa!SO!a!UO!d!VO#Q#OO~Oc#SO!_#RO!Q#[X!V#[X~Oa#VO~Ol!zO!V#XO~O!V#YO~Oj#ZOp!PO~O!Q#[O~O!QnO!_#RO~O!QnO!V#_O~O[hO]hOsiOwjO{kO!OmO#OlO#VeO~Oc!va!Q!va`!va~P+UOu#aOy#bO~O[hO]hOsiOwjO#VeO~Oczi{zi!Ozi!Qzi#Ozi`zi~P,VOc|i{|i!O|i!Q|i#O|i`|i~P,VOc}i{}i!O}i!Q}i#O}i`}i~P,VO[VX[!TX]VXcVXsVXwVX{VX!OVX!QVX#OVX#VVX~O[#cO~O!P#fO!V#dO~O!P#fO~P&ZO`#WP~P%[O`#XP~P#kO`#nOl!zO~O!V#pO~Oj#qOq#qO~O[!]X`!ZX!_!ZX~O[#rO~O`#sO!_#RO~Oc#SO!Q#[a!V#[a~O!_#ROc!`a!Q!`a!V!`a`!`a~O!V#xO~O!P#|O!p#zO!q#zO#Z#yO~O!P!zX!V!zX~P&ZO!P$SO!V#dO~O`#WX~P!`O`$VO~Ol!zO`!wXa!wXc!wXh!wXj!wXp!wX#P!wX#Q!wX#Z!wX~Oc$XO`#XX~P#kO`$ZO~Ol!zOu$[O~O`$]O~O!_#ROc!{a!Q!{a!V!{a~O`$_O~P+UOP!yO!QiX~O!P$bO!p#zO!q#zO#Z#yO~Ol!zOu$cO~Oc$eOl!zO!U$gO!P!Si!V!Si~P#kO!P!za!V!za~P&ZO!P$iO!V#dO~OcfO`#Wa~Oc$XO`#Xa~O`$lO~P#kOl!zOa!yXc!yXh!yXj!yXp!yX!P!yX!U!yX!V!yX#P!yX#Q!yX#Z!yX~Oc$eO!U$oO!P!Sq!V!Sq~P#kO`!xac!xa~P#kOl!zOa!yac!yah!yaj!yap!ya!P!ya!U!ya!V!ya#P!ya#Q!ya#Z!ya~Oq#Zl!Ol~",
  goto: "+}#^PPPP#_P#g#uP#g$T#gPP$ZPPP$aP$g$m$v$vP%YP$vP$v%p&SPP#gP&lP#gP&rP#gP#g#gPPP&x'['hPP#_PP'n'n'x'nP'nP'n'nP#_P#_P#_P'{#_P(O(RPP#_P#_(U(d(n(|)S)Y)d)jPPPPPP)p)xP*d*g*jP+`+i]`Obn!s#d$QiWObfklmn!s!t#V#d$QiQObfklmn!s!t#V#d$QQdRR!ceQrTR!ghQ!gsR#`!hQtTR!ihQ!gtQ!|!OR#`!iq!QXZz!u!w!z#b#c#k#r$O$X$^$e$f$jp!QXZz!u!w!z#b#c#k#r$O$X$^$e$f$jT#z#[#{q!OXZz!u!w!z#b#c#k#r$O$X$^$e$f$jp!QXZz!u!w!z#b#c#k#r$O$X$^$e$f$jQ![[R#Z!]QvUR!jiQxVR!kjQoSQ!fgQ#W!XQ#^!`Q#_!aR$`#zQ!rnQ#g!sQ$P#dR$h$QX!pn!s#d$Qa!WY^_|!S!U#R#SR#P!SR!][R!_]R#]!_QbOU!bb!s$QQ!snR$Q#dQgSS!eg$UR$U#hQ#k!uU$W#k$^$jQ$^#rR$j$XQ$Y#kR$k$YQ$f$OR$n$fQ#e!rS$R#e$TR$T#gQ#T!TR#v#TQ#{#[R$a#{]aObn!s#d$Q[SObn!s#d$QQ!dfQ!lkQ!mlQ!nmQ#h!tR#w#VR#i!tR#l!uQ|XQ!YZQ!xz[#j!u#k#r$X$^$jQ#m!wQ#o!zQ#}#bQ$O#cS$d$O$fR$m$eQ!XYQ!a_R!{|U!TY_|Q!`^Q#Q!SQ#U!UQ#t#RR#u#S",
  nodeNames: "⚠ Unit Comment StyleSheet RuleSet UniversalSelector TagSelector TagName NestingSelector ClassSelector ClassName PseudoClassSelector : :: PseudoClassName not ) ( ArgList , PseudoClassName ArgList ValueName ParenthesizedValue ColorLiteral NumberLiteral StringLiteral BinaryExpression BinOp CallExpression Callee CallLiteral CallTag ParenthesizedContent IdSelector # IdName ] AttributeSelector [ AttributeName MatchOp ChildSelector ChildOp DescendantSelector SiblingSelector SiblingOp } { Block Declaration PropertyName Important ; ImportStatement AtKeyword import KeywordQuery FeatureQuery FeatureName BinaryQuery LogicOp UnaryQuery UnaryQueryOp ParenthesizedQuery SelectorQuery callee MediaStatement media CharsetStatement charset NamespaceStatement namespace NamespaceName KeyframesStatement keyframes KeyframeName KeyframeList from to SupportsStatement supports AtRule",
  maxTerm: 105,
  nodeProps: [
    [NodeProp.openedBy, 16,"(",47,"{"],
    [NodeProp.closedBy, 17,")",48,"}"]
  ],
  skippedNodes: [0,2],
  repeatNodeCount: 8,
  tokenData: "Bj~R![OX$wX^%]^p$wpq%]qr(crs+}st,otu2Uuv$wvw2rwx2}xy3jyz3uz{3z{|4_|}8u}!O9Q!O!P9i!P!Q9z!Q![<U![!]<y!]!^=i!^!_$w!_!`=t!`!a>P!a!b$w!b!c>o!c!}$w!}#O?{#O#P$w#P#Q@W#Q#R2U#R#T$w#T#U@c#U#c$w#c#dAb#d#o$w#o#pAq#p#q2U#q#rA|#r#sBX#s#y$w#y#z%]#z$f$w$f$g%]$g#BY$w#BY#BZ%]#BZ$IS$w$IS$I_%]$I_$I|$w$I|$JO%]$JO$JT$w$JT$JU%]$JU$KV$w$KV$KW%]$KW&FU$w&FU&FV%]&FV~$wW$zQOy%Qz~%QW%VQqWOy%Qz~%Q~%bf#S~OX%QX^&v^p%Qpq&vqy%Qz#y%Q#y#z&v#z$f%Q$f$g&v$g#BY%Q#BY#BZ&v#BZ$IS%Q$IS$I_&v$I_$I|%Q$I|$JO&v$JO$JT%Q$JT$JU&v$JU$KV%Q$KV$KW&v$KW&FU%Q&FU&FV&v&FV~%Q~&}f#S~qWOX%QX^&v^p%Qpq&vqy%Qz#y%Q#y#z&v#z$f%Q$f$g&v$g#BY%Q#BY#BZ&v#BZ$IS%Q$IS$I_&v$I_$I|%Q$I|$JO&v$JO$JT%Q$JT$JU&v$JU$KV%Q$KV$KW&v$KW&FU%Q&FU&FV&v&FV~%Q^(fSOy%Qz#]%Q#]#^(r#^~%Q^(wSqWOy%Qz#a%Q#a#b)T#b~%Q^)YSqWOy%Qz#d%Q#d#e)f#e~%Q^)kSqWOy%Qz#c%Q#c#d)w#d~%Q^)|SqWOy%Qz#f%Q#f#g*Y#g~%Q^*_SqWOy%Qz#h%Q#h#i*k#i~%Q^*pSqWOy%Qz#T%Q#T#U*|#U~%Q^+RSqWOy%Qz#b%Q#b#c+_#c~%Q^+dSqWOy%Qz#h%Q#h#i+p#i~%Q^+wQ!UUqWOy%Qz~%Q~,QUOY+}Zr+}rs,ds#O+}#O#P,i#P~+}~,iOj~~,lPO~+}_,tWsPOy%Qz!Q%Q!Q![-^![!c%Q!c!i-^!i#T%Q#T#Z-^#Z~%Q^-cWqWOy%Qz!Q%Q!Q![-{![!c%Q!c!i-{!i#T%Q#T#Z-{#Z~%Q^.QWqWOy%Qz!Q%Q!Q![.j![!c%Q!c!i.j!i#T%Q#T#Z.j#Z~%Q^.qWhUqWOy%Qz!Q%Q!Q![/Z![!c%Q!c!i/Z!i#T%Q#T#Z/Z#Z~%Q^/bWhUqWOy%Qz!Q%Q!Q![/z![!c%Q!c!i/z!i#T%Q#T#Z/z#Z~%Q^0PWqWOy%Qz!Q%Q!Q![0i![!c%Q!c!i0i!i#T%Q#T#Z0i#Z~%Q^0pWhUqWOy%Qz!Q%Q!Q![1Y![!c%Q!c!i1Y!i#T%Q#T#Z1Y#Z~%Q^1_WqWOy%Qz!Q%Q!Q![1w![!c%Q!c!i1w!i#T%Q#T#Z1w#Z~%Q^2OQhUqWOy%Qz~%QY2XSOy%Qz!_%Q!_!`2e!`~%QY2lQyQqWOy%Qz~%QX2wQWPOy%Qz~%Q~3QUOY2}Zw2}wx,dx#O2}#O#P3d#P~2}~3gPO~2}_3oQaVOy%Qz~%Q~3zO`~_4RSTPlSOy%Qz!_%Q!_!`2e!`~%Q_4fUlS!OPOy%Qz!O%Q!O!P4x!P!Q%Q!Q![7_![~%Q^4}SqWOy%Qz!Q%Q!Q![5Z![~%Q^5bWqW#ZUOy%Qz!Q%Q!Q![5Z![!g%Q!g!h5z!h#X%Q#X#Y5z#Y~%Q^6PWqWOy%Qz{%Q{|6i|}%Q}!O6i!O!Q%Q!Q![6z![~%Q^6nSqWOy%Qz!Q%Q!Q![6z![~%Q^7RSqW#ZUOy%Qz!Q%Q!Q![6z![~%Q^7fYqW#ZUOy%Qz!O%Q!O!P8U!P!Q%Q!Q![7_![!g%Q!g!h5z!h#X%Q#X#Y5z#Y~%Q^8]WqW#ZUOy%Qz!Q%Q!Q![8U![!g%Q!g!h5z!h#X%Q#X#Y5z#Y~%Q_8zQcVOy%Qz~%Q^9VUlSOy%Qz!O%Q!O!P4x!P!Q%Q!Q![7_![~%Q_9nS#VPOy%Qz!Q%Q!Q![5Z![~%Q~:PRlSOy%Qz{:Y{~%Q~:_SqWOy:Yyz:kz{;`{~:Y~:nROz:kz{:w{~:k~:zTOz:kz{:w{!P:k!P!Q;Z!Q~:k~;`OQ~~;eUqWOy:Yyz:kz{;`{!P:Y!P!Q;w!Q~:Y~<OQQ~qWOy%Qz~%Q^<ZY#ZUOy%Qz!O%Q!O!P8U!P!Q%Q!Q![7_![!g%Q!g!h5z!h#X%Q#X#Y5z#Y~%QX=OS[POy%Qz![%Q![!]=[!]~%QX=cQ]PqWOy%Qz~%Q_=nQ!VVOy%Qz~%QY=yQyQOy%Qz~%QX>US{POy%Qz!`%Q!`!a>b!a~%QX>iQ{PqWOy%Qz~%QX>rUOy%Qz!c%Q!c!}?U!}#T%Q#T#o?U#o~%QX?]Y!XPqWOy%Qz}%Q}!O?U!O!Q%Q!Q![?U![!c%Q!c!}?U!}#T%Q#T#o?U#o~%QX@QQwPOy%Qz~%Q^@]QuUOy%Qz~%QX@fSOy%Qz#b%Q#b#c@r#c~%QX@wSqWOy%Qz#W%Q#W#XAT#X~%QXA[Q!_PqWOy%Qz~%QXAeSOy%Qz#f%Q#f#gAT#g~%QXAvQ!QPOy%Qz~%Q_BRQ!PVOy%Qz~%QZB^S!OPOy%Qz!_%Q!_!`2e!`~%Q",
  tokenizers: [descendant, unitToken, identifiers, 0, 1, 2, 3],
  topRules: {"StyleSheet":[0,3]},
  specialized: [{term: 93, get: value => spec_callee[value] || -1},{term: 55, get: value => spec_AtKeyword[value] || -1},{term: 94, get: value => spec_identifier[value] || -1}],
  tokenPrec: 1060
});

export { parser };
