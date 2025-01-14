import { ContextTracker, ExternalTokenizer, Parser, NodeProp } from  './lezer.js';

// This file was generated by lezer-generator. You probably shouldn't edit it.
const StartTag = 1,
  StartCloseTag = 2,
  MismatchedStartCloseTag = 3,
  missingCloseTag = 33,
  IncompleteCloseTag = 4,
  SelfCloseEndTag = 5,
  commentContent = 34,
  Element = 10,
  OpenTag = 11,
  RawText = 25,
  Dialect_noMatch = 0;

/* Hand-written tokenizers for HTML. */

const selfClosers = {
  area: true, base: true, br: true, col: true, command: true,
  embed: true, frame: true, hr: true, img: true, input: true,
  keygen: true, link: true, meta: true, param: true, source: true,
  track: true, wbr: true, menuitem: true
};

const implicitlyClosed = {
  dd: true, li: true, optgroup: true, option: true, p: true,
  rp: true, rt: true, tbody: true, td: true, tfoot: true,
  th: true, tr: true
};

const closeOnOpen = {
  dd: {dd: true, dt: true},
  dt: {dd: true, dt: true},
  li: {li: true},
  option: {option: true, optgroup: true},
  optgroup: {optgroup: true},
  p: {
    address: true, article: true, aside: true, blockquote: true, dir: true,
    div: true, dl: true, fieldset: true, footer: true, form: true,
    h1: true, h2: true, h3: true, h4: true, h5: true, h6: true,
    header: true, hgroup: true, hr: true, menu: true, nav: true, ol: true,
    p: true, pre: true, section: true, table: true, ul: true
  },
  rp: {rp: true, rt: true},
  rt: {rp: true, rt: true},
  tbody: {tbody: true, tfoot: true},
  td: {td: true, th: true},
  tfoot: {tbody: true},
  th: {td: true, th: true},
  thead: {tbody: true, tfoot: true},
  tr: {tr: true}
};

function nameChar(ch) {
  return ch == 45 || ch == 46 || ch == 58 || ch >= 65 && ch <= 90 || ch == 95 || ch >= 97 && ch <= 122 || ch >= 161
}

function isSpace(ch) {
  return ch == 9 || ch == 10 || ch == 13 || ch == 32
}

let cachedName = null, cachedInput = null, cachedPos = 0;
function tagNameAfter(input, pos) {
  if (cachedPos == pos && cachedInput == input) return cachedName
  let next = input.get(pos);
  while (isSpace(next)) next = input.get(++pos);
  let start = pos;
  while (nameChar(next)) next = input.get(++pos);
  // Undefined to signal there's a <? or <!, null for just missing
  cachedInput = input; cachedPos = pos;
  return cachedName = pos > start ? input.read(start, pos).toLowerCase() : next == question || next == bang ? undefined : null
}

const lessThan = 60, greaterThan = 62, slash = 47, question = 63, bang = 33;

function ElementContext(name, parent) {
  this.name = name;
  this.parent = parent;
  this.hash = parent ? parent.hash : 0;
  for (let i = 0; i < name.length; i++) this.hash += (this.hash << 4) + name.charCodeAt(i) + (name.charCodeAt(i) << 8);
}

const elementContext = new ContextTracker({
  start: null,
  shift(context, term, input, stack) {
    return term == StartTag ? new ElementContext(tagNameAfter(input, stack.pos) || "", context) : context
  },
  reduce(context, term) {
    return term == Element && context ? context.parent : context
  },
  reuse(context, node, input, stack) {
    let type = node.type.id;
    return type == StartTag || type == OpenTag
      ? new ElementContext(tagNameAfter(input, stack.pos - node.length + 1) || "", context) : context
  },
  hash(context) { return context ? context.hash : 0 },
  strict: false
});

const tagStart = new ExternalTokenizer((input, token, stack) => {
  let pos = token.start, first = input.get(pos), close;
  // End of file, close any open tags
  if (first < 0 && stack.context) token.accept(missingCloseTag, token.start);
  if (first != lessThan) return
  pos++;
  if (close = (input.get(pos) == slash)) pos++;
  let name = tagNameAfter(input, pos);
  if (name === undefined) return
  if (!name) return token.accept(close ? IncompleteCloseTag : StartTag, pos)

  let parent = stack.context ? stack.context.name : null;
  if (close) {
    if (name == parent) return token.accept(StartCloseTag, pos)
    if (parent && implicitlyClosed[parent]) return token.accept(missingCloseTag, token.start)
    if (stack.dialectEnabled(Dialect_noMatch)) return token.accept(StartCloseTag, pos)
    for (let cx = stack.context; cx; cx = cx.parent) if (cx.name == name) return
    token.accept(MismatchedStartCloseTag, pos);
  } else {
    if (parent && closeOnOpen[parent] && closeOnOpen[parent][name]) token.accept(missingCloseTag, token.start);
    else token.accept(StartTag, pos);
  }
});

const selfClosed = new ExternalTokenizer((input, token, stack) => {
  let next = input.get(token.start), end = token.start + 1;
  if (next == slash) {
    if (input.get(end) != greaterThan) return
    end++;
  } else if (next != greaterThan) {
    return
  }
  if (stack.context && selfClosers[stack.context.name]) token.accept(SelfCloseEndTag, end);
});

const commentContent$1 = new ExternalTokenizer((input, token) => {
  let pos = token.start, endPos = 0;
  for (;;) {
    let next = input.get(pos);
    if (next < 0) break
    pos++;
    if (next == "-->".charCodeAt(endPos)) {
      endPos++;
      if (endPos == 3) { pos -= 3; break }
    } else {
      endPos = 0;
    }
  }
  if (pos > token.start) token.accept(commentContent, pos);
});

const openTag = /^<\/?\s*([\.\-\:\w\xa1-\uffff]+)/;

function tagName(tag) {
  let m = openTag.exec(tag);
  return m ? m[1].toLowerCase() : null
}

function attributes(tag) {
  let open = openTag.exec(tag), attrs = {};
  if (open) {
    let attr = /\s*([\.\-\:\w\xa1-\uffff]+)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s=<>"'/]+)))?/g, m;
    attr.lastIndex = open.index + open[0].length;
    while (m = attr.exec(tag)) attrs[m[1]] = m[4] || m[3] || m[2] || m[1];
  }
  return attrs
}

function skip(name) { return token => tagName(token) == name }

// tags: {
//   tag: string,
//   attrs?: ({[attr: string]: string}) => boolean,
//   parser: {startParse: (input: Input, startPos?: number, context?: ParseContext) => IncrementalParse}
// }[]

function resolveContent(tags) {
  let tagMap = null;
  for (let tag of tags) {
    if (!tagMap) tagMap = Object.create(null)
    ;(tagMap[tag.tag] || (tagMap[tag.tag] = [])).push({
      attrs: tag.attrs,
      value: {
        filterEnd: skip(tag.tag),
        startParse: tag.parser.startParse.bind(tag.parser)
      }
    });
  }
  return function(input, stack) {
    let openTag = input.read(stack.ruleStart, stack.pos);
    let name = tagName(openTag), matches, attrs;
    if (!name) return null
    if (tagMap && (matches = tagMap[name])) {
      for (let match of matches) {
        if (!match.attrs || match.attrs(attrs || (attrs = attributes(openTag)))) return match.value
      }
    }
    if (name == "script" || name == "textarea" || name == "style") return {
      filterEnd: skip(name),
      wrapType: RawText
    }
    return null
  }
}

const elementContent = resolveContent([]);

function configureNesting(tags) {
  return {elementContent: resolveContent(tags)}
}

// This file was generated by lezer-generator. You probably shouldn't edit it.
const parser = Parser.deserialize({
  version: 13,
  states: "'OOVOXOOOtQ`O'#CgS!eOXO'#CfOOOP'#Cf'#CfO!oOdO'#CqO!wQ`O'#CsOOOP'#DR'#DROOOP'#Cv'#CvQVOXOOO!|QrO,59ROOOP'#Cz'#CzO#XOXO'#DWO#cOPO,59QOOOS'#C{'#C{O#kOdO,59]OOOP,59],59]O#sQ`O,59_OOOP-E6t-E6tO#xQrO'#CiOOQQ'#Cw'#CwO$WQrO1G.mOOOP1G.m1G.mOOOP1G.v1G.vOOOP-E6x-E6xO$cQ`O'#CoOOOP1G.l1G.lOOOS-E6y-E6yOOOP1G.w1G.wOOOP1G.y1G.yO$hQ!bO,59TOOQQ-E6u-E6uOOOP7+$X7+$XOOOP7+$b7+$bO$sQ`O,59ZO$xO#tO'#ClO%WO&jO'#ClOOQQ1G.o1G.oOOOP1G.u1G.uOOOO'#Cx'#CxO%fO#tO,59WOOQQ,59W,59WOOOO'#Cy'#CyO%tO&jO,59WOOOO-E6v-E6vOOQQ1G.r1G.rOOOO-E6w-E6w",
  stateData: "&X~OtOS~OPPORTOSUOVUOWUOXUOfUOhVO{SO~O[XO~OPPORTOSUOVUOWUOXUOfUO{SO~OQzPqzP~PyOr]O|_O~O[`O~OTfO^bObeO~OQzXqzX~PyOQhOqiO~Or]O|kO~OblO~O_mOT]X^]Xb]X~OTpO^bOboO~O[qO~OatOvrOxsO~ObuO~OWvOXvOvxOwvO~OWyOXyOxxOyyO~OWvOXvOv|OwvO~OWyOXyOx|OyyO~O{fhf~",
  goto: "#k{PPPPPPPPPP|!SP!YPP!^PP!a!d|P|PP!j!p!v!|#S#YPPPPP#`PPPP#hXUOQWZXQOQWZTcXdRtmRi[XROQWZQWORaWQdXRndQwrR{wQzsR}zQZQRgZQ^SRj^SVOWTYQZR[Q",
  nodeNames: "⚠ StartTag StartCloseTag StartCloseTag IncompleteCloseTag SelfCloseEndTag Document Text EntityReference CharacterReference Element OpenTag TagName Attribute AttributeName Is AttributeValue UnquotedAttributeValue EndTag CloseTag SelfClosingTag Comment ProcessingInst MismatchedCloseTag DoctypeDecl RawText",
  maxTerm: 44,
  context: elementContext,
  nodeProps: [
    [NodeProp.closedBy, -2,1,2,"EndTag SelfCloseEndTag",11,"CloseTag"],
    [NodeProp.openedBy, 5,"StartTag",18,"StartTag StartCloseTag",19,"OpenTag"]
  ],
  skippedNodes: [0,25],
  repeatNodeCount: 6,
  tokenData: "!#`!aR!WOX$kXY)sYZ)sZ]$k]^)s^p$kpq)sqr$krs*zsv$kvw+dwx2wx}$k}!O3d!O!P$k!P!Q7]!Q![$k![!]8s!]!^$k!^!_>`!_!`!!n!`!a8R!a!c$k!c!}8s!}#R$k#R#S8s#S#T$k#T#o8s#o$f$k$f$g&R$g%W$k%W%o8s%o%p$k%p&a8s&a&b$k&b1p8s1p4U$k4U4d8s4d4e$k4e$IS8s$IS$I`$k$I`$Ib8s$Ib$Kh$k$Kh%#t8s%#t&/x$k&/x&Et8s&Et&FV$k&FV;'S8s;'S;:j<r;:j?&r$k?&r?Ah8s?Ah?BY$k?BY?Mn8s?Mn~$k!Z$vcVPaWw`ypOX$kXZ&RZ]$k]^&R^p$kpq&Rqr$krs&qsv$kvw)Rwx'rx!P$k!P!Q&R!Q!^$k!^!_(k!_!a&R!a$f$k$f$g&R$g~$k!R&[VVPw`ypOr&Rrs&qsv&Rwx'rx!^&R!^!_(k!_~&Rq&xTVPypOv&qwx'Xx!^&q!^!_'g!_~&qP'^RVPOv'Xw!^'X!_~'Xp'lQypOv'gx~'ga'yUVPw`Or'rrs'Xsv'rw!^'r!^!_(]!_~'r`(bRw`Or(]sv(]w~(]!Q(rTw`ypOr(krs'gsv(kwx(]x~(kW)WXaWOX)RZ])R^p)Rqr)Rsw)Rx!P)R!Q!^)R!a$f)R$g~)R!a*O^VPw`ypt^OX&RXY)sYZ)sZ]&R]^)s^p&Rpq)sqr&Rrs&qsv&Rwx'rx!^&R!^!_(k!_~&R!Z+TTvhVPypOv&qwx'Xx!^&q!^!_'g!_~&q!Z+ibaWOX,qXZ.OZ],q]^.O^p,qqr,qrs.Ost/Ztw,qwx.Ox!P,q!P!Q.O!Q!],q!]!^)R!^!a.O!a$f,q$f$g.O$g~,q!Z,vbaWOX,qXZ.OZ],q]^.O^p,qqr,qrs.Ost)Rtw,qwx.Ox!P,q!P!Q.O!Q!],q!]!^.g!^!a.O!a$f,q$f$g.O$g~,q!R.RTOp.Oqs.Ot!].O!]!^.b!^~.O!R.gOW!R!Z.nXW!RaWOX)RZ])R^p)Rqr)Rsw)Rx!P)R!Q!^)R!a$f)R$g~)R!Z/`aaWOX0eXZ1oZ]0e]^1o^p0eqr0ers1osw0ewx1ox!P0e!P!Q1o!Q!]0e!]!^)R!^!a1o!a$f0e$f$g1o$g~0e!Z0jaaWOX0eXZ1oZ]0e]^1o^p0eqr0ers1osw0ewx1ox!P0e!P!Q1o!Q!]0e!]!^2T!^!a1o!a$f0e$f$g1o$g~0e!R1rSOp1oq!]1o!]!^2O!^~1o!R2TOX!R!Z2[XX!RaWOX)RZ])R^p)Rqr)Rsw)Rx!P)R!Q!^)R!a$f)R$g~)R!Z3QUxxVPw`Or'rrs'Xsv'rw!^'r!^!_(]!_~'r!]3oeVPaWw`ypOX$kXZ&RZ]$k]^&R^p$kpq&Rqr$krs&qsv$kvw)Rwx'rx}$k}!O5Q!O!P$k!P!Q&R!Q!^$k!^!_(k!_!a&R!a$f$k$f$g&R$g~$k!]5]dVPaWw`ypOX$kXZ&RZ]$k]^&R^p$kpq&Rqr$krs&qsv$kvw)Rwx'rx!P$k!P!Q&R!Q!^$k!^!_(k!_!`&R!`!a6k!a$f$k$f$g&R$g~$k!T6vVVPw`yp|QOr&Rrs&qsv&Rwx'rx!^&R!^!_(k!_~&R!X7fXVPw`ypOr&Rrs&qsv&Rwx'rx!^&R!^!_(k!_!`&R!`!a8R!a~&R!X8^VbUVPw`ypOr&Rrs&qsv&Rwx'rx!^&R!^!_(k!_~&R!a9S!Y^S[QVPaWw`ypOX$kXZ&RZ]$k]^&R^p$kpq&Rqr$krs&qsv$kvw)Rwx'rx}$k}!O8s!O!P8s!P!Q&R!Q![8s![!]8s!]!^$k!^!_(k!_!a&R!a!c$k!c!}8s!}#R$k#R#S8s#S#T$k#T#o8s#o$f$k$f$g&R$g$}$k$}%O8s%O%W$k%W%o8s%o%p$k%p&a8s&a&b$k&b1p8s1p4U8s4U4d8s4d4e$k4e$IS8s$IS$I`$k$I`$Ib8s$Ib$Je$k$Je$Jg8s$Jg$Kh$k$Kh%#t8s%#t&/x$k&/x&Et8s&Et&FV$k&FV;'S8s;'S;:j<r;:j?&r$k?&r?Ah8s?Ah?BY$k?BY?Mn8s?Mn~$k!a<}eVPaWw`ypOX$kXZ&RZ]$k]^&R^p$kpq&Rqr$krs&qsv$kvw)Rwx'rx!P$k!P!Q&R!Q!^$k!^!_(k!_!a&R!a$f$k$f$g&R$g;=`$k;=`<%l8s<%l~$k!R>gWw`ypOq(kqr?Prs'gsv(kwx(]x!a(k!a!bKh!b~(k!R?WZw`ypOr(krs'gsv(kwx(]x}(k}!O?y!O!f(k!f!gAP!g#W(k#W#XGx#X~(k!R@QVw`ypOr(krs'gsv(kwx(]x}(k}!O@g!O~(k!R@pTw`yp{POr(krs'gsv(kwx(]x~(k!RAWVw`ypOr(krs'gsv(kwx(]x!q(k!q!rAm!r~(k!RAtVw`ypOr(krs'gsv(kwx(]x!e(k!e!fBZ!f~(k!RBbVw`ypOr(krs'gsv(kwx(]x!v(k!v!wBw!w~(k!RCOVw`ypOr(krs'gsv(kwx(]x!{(k!{!|Ce!|~(k!RClVw`ypOr(krs'gsv(kwx(]x!r(k!r!sDR!s~(k!RDYVw`ypOr(krs'gsv(kwx(]x!g(k!g!hDo!h~(k!RDvWw`ypOrDorsE`svDovwEtwxFdx!`Do!`!aG`!a~DoqEeTypOvE`vxEtx!`E`!`!aFV!a~E`PEwRO!`Et!`!aFQ!a~EtPFVOhPqF^QyphPOv'gx~'gaFiVw`OrFdrsEtsvFdvwEtw!`Fd!`!aGO!a~FdaGVRw`hPOr(]sv(]w~(]!RGiTw`yphPOr(krs'gsv(kwx(]x~(k!RHPVw`ypOr(krs'gsv(kwx(]x#c(k#c#dHf#d~(k!RHmVw`ypOr(krs'gsv(kwx(]x#V(k#V#WIS#W~(k!RIZVw`ypOr(krs'gsv(kwx(]x#h(k#h#iIp#i~(k!RIwVw`ypOr(krs'gsv(kwx(]x#m(k#m#nJ^#n~(k!RJeVw`ypOr(krs'gsv(kwx(]x#d(k#d#eJz#e~(k!RKRVw`ypOr(krs'gsv(kwx(]x#X(k#X#YDo#Y~(k!RKoWw`ypOrKhrsLXsvKhvwLmwxM}x!aKh!a!b! e!b~KhqL^TypOvLXvxLmx!aLX!a!bM[!b~LXPLpRO!aLm!a!bLy!b~LmPL|RO!`Lm!`!aMV!a~LmPM[OfPqMaTypOvLXvxLmx!`LX!`!aMp!a~LXqMwQypfPOv'gx~'gaNSVw`OrM}rsLmsvM}vwLmw!aM}!a!bNi!b~M}aNnVw`OrM}rsLmsvM}vwLmw!`M}!`!a! T!a~M}a! [Rw`fPOr(]sv(]w~(]!R! lWw`ypOrKhrsLXsvKhvwLmwxM}x!`Kh!`!a!!U!a~Kh!R!!_Tw`ypfPOr(krs'gsv(kwx(]x~(k!V!!yV_SVPw`ypOr&Rrs&qsv&Rwx'rx!^&R!^!_(k!_~&R",
  tokenizers: [tagStart, selfClosed, commentContent$1, 0, 1, 2, 3, 4, 5],
  topRules: {"Document":[0,6]},
  nested: [["elementContent", elementContent,"%S~RP!^!_U~XP!P!Q[~_dXY[YZ[]^[pq[![!]!m!c!}!m#R#S!m#T#o!m%W%o!m%p&a!m&b1p!m4U4d!m4e$IS!m$I`$Ib!m$Kh%#t!m&/x&Et!m&FV;'S!m;'S;:j$|?&r?Ah!m?BY?Mn!m~!pkXY$eYZ$e]^$epq$e}!O!m!O!P!m!Q![!m![!]!m!`!a$w!c!}!m#R#S!m#T#o!m$}%O!m%W%o!m%p&a!m&b1p!m1p4U!m4U4d!m4e$IS!m$I`$Ib!m$Je$Jg!m$Kh%#t!m&/x&Et!m&FV;'S!m;'S;:j$|?&r?Ah!m?BY?Mn!m~$hTXY$eYZ$e]^$epq$e!`!a$w~$|Op~~%PP;=`<%l!m", 42]],
  dialects: {noMatch: 0},
  tokenPrec: 234
});

export { configureNesting, parser };
