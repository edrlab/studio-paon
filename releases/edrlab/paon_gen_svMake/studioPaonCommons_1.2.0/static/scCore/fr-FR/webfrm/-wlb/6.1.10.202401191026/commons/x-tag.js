/* http://www.x-tags.org/download?byob=,WeakMap,MutationObserver,domtokenlist-polyfill,customelements-polyfill,x-tag-core,htmlimports-polyfill */ 
if (typeof WeakMap === "undefined") {
    (function() {
        var defineProperty = Object.defineProperty;
        var counter = Date.now() % 1e9;
        var WeakMap = function() {
            this.name = "__st" + (Math.random() * 1e9 >>> 0) + (counter++ + "__");
        };
        WeakMap.prototype = {
            set: function(key, value) {
                var entry = key[this.name];
                if (entry && entry[0] === key) entry[1] = value; else defineProperty(key, this.name, {
                    value: [ key, value ],
                    writable: true
                });
            },
            get: function(key) {
                var entry;
                return (entry = key[this.name]) && entry[0] === key ? entry[1] : undefined;
            },
            "delete": function(key) {
                this.set(key, undefined);
            }
        };
        window.WeakMap = WeakMap;
    })();
}
(function(global) {
    var registrationsTable = new WeakMap();
    var setImmediate = window.msSetImmediate;
    if (!setImmediate) {
        var setImmediateQueue = [];
        var sentinel = String(Math.random());
        window.addEventListener("message", function(e) {
        	if (e.origin !== location.origin) return;
            if (e.data === sentinel) {
                var queue = setImmediateQueue;
                setImmediateQueue = [];
                queue.forEach(function(func) {
                    func();
                });
            }
        });
        setImmediate = function(func) {
            setImmediateQueue.push(func);
            window.postMessage(sentinel, location.origin);
        };
    }
    var isScheduled = false;
    var scheduledObservers = [];
    function scheduleCallback(observer) {
        scheduledObservers.push(observer);
        if (!isScheduled) {
            isScheduled = true;
            setImmediate(dispatchCallbacks);
        }
    }
    function wrapIfNeeded(node) {
        return window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.wrapIfNeeded(node) || node;
    }
    function dispatchCallbacks() {
        isScheduled = false;
        var observers = scheduledObservers;
        scheduledObservers = [];
        observers.sort(function(o1, o2) {
            return o1.uid_ - o2.uid_;
        });
        var anyNonEmpty = false;
        observers.forEach(function(observer) {
            var queue = observer.takeRecords();
            removeTransientObserversFor(observer);
            if (queue.length) {
                observer.callback_(queue, observer);
                anyNonEmpty = true;
            }
        });
        if (anyNonEmpty) dispatchCallbacks();
    }
    function removeTransientObserversFor(observer) {
        observer.nodes_.forEach(function(node) {
            var registrations = registrationsTable.get(node);
            if (!registrations) return;
            registrations.forEach(function(registration) {
                if (registration.observer === observer) registration.removeTransientObservers();
            });
        });
    }
    function forEachAncestorAndObserverEnqueueRecord(target, callback) {
        for (var node = target; node; node = node.parentNode) {
            var registrations = registrationsTable.get(node);
            if (registrations) {
                for (var j = 0; j < registrations.length; j++) {
                    var registration = registrations[j];
                    var options = registration.options;
                    if (node !== target && !options.subtree) continue;
                    var record = callback(options);
                    if (record) registration.enqueue(record);
                }
            }
        }
    }
    var uidCounter = 0;
    function JsMutationObserver(callback) {
        this.callback_ = callback;
        this.nodes_ = [];
        this.records_ = [];
        this.uid_ = ++uidCounter;
    }
    JsMutationObserver.prototype = {
        observe: function(target, options) {
            target = wrapIfNeeded(target);
            if (!options.childList && !options.attributes && !options.characterData || options.attributeOldValue && !options.attributes || options.attributeFilter && options.attributeFilter.length && !options.attributes || options.characterDataOldValue && !options.characterData) {
                throw new SyntaxError();
            }
            var registrations = registrationsTable.get(target);
            if (!registrations) registrationsTable.set(target, registrations = []);
            var registration;
            for (var i = 0; i < registrations.length; i++) {
                if (registrations[i].observer === this) {
                    registration = registrations[i];
                    registration.removeListeners();
                    registration.options = options;
                    break;
                }
            }
            if (!registration) {
                registration = new Registration(this, target, options);
                registrations.push(registration);
                this.nodes_.push(target);
            }
            registration.addListeners();
        },
        disconnect: function() {
            this.nodes_.forEach(function(node) {
                var registrations = registrationsTable.get(node);
                for (var i = 0; i < registrations.length; i++) {
                    var registration = registrations[i];
                    if (registration.observer === this) {
                        registration.removeListeners();
                        registrations.splice(i, 1);
                        break;
                    }
                }
            }, this);
            this.records_ = [];
        },
        takeRecords: function() {
            var copyOfRecords = this.records_;
            this.records_ = [];
            return copyOfRecords;
        }
    };
    function MutationRecord(type, target) {
        this.type = type;
        this.target = target;
        this.addedNodes = [];
        this.removedNodes = [];
        this.previousSibling = null;
        this.nextSibling = null;
        this.attributeName = null;
        this.attributeNamespace = null;
        this.oldValue = null;
    }
    function copyMutationRecord(original) {
        var record = new MutationRecord(original.type, original.target);
        record.addedNodes = original.addedNodes.slice();
        record.removedNodes = original.removedNodes.slice();
        record.previousSibling = original.previousSibling;
        record.nextSibling = original.nextSibling;
        record.attributeName = original.attributeName;
        record.attributeNamespace = original.attributeNamespace;
        record.oldValue = original.oldValue;
        return record;
    }
    var currentRecord, recordWithOldValue;
    function getRecord(type, target) {
        return currentRecord = new MutationRecord(type, target);
    }
    function getRecordWithOldValue(oldValue) {
        if (recordWithOldValue) return recordWithOldValue;
        recordWithOldValue = copyMutationRecord(currentRecord);
        recordWithOldValue.oldValue = oldValue;
        return recordWithOldValue;
    }
    function clearRecords() {
        currentRecord = recordWithOldValue = undefined;
    }
    function recordRepresentsCurrentMutation(record) {
        return record === recordWithOldValue || record === currentRecord;
    }
    function selectRecord(lastRecord, newRecord) {
        if (lastRecord === newRecord) return lastRecord;
        if (recordWithOldValue && recordRepresentsCurrentMutation(lastRecord)) return recordWithOldValue;
        return null;
    }
    function Registration(observer, target, options) {
        this.observer = observer;
        this.target = target;
        this.options = options;
        this.transientObservedNodes = [];
    }
    Registration.prototype = {
        enqueue: function(record) {
            var records = this.observer.records_;
            var length = records.length;
            if (records.length > 0) {
                var lastRecord = records[length - 1];
                var recordToReplaceLast = selectRecord(lastRecord, record);
                if (recordToReplaceLast) {
                    records[length - 1] = recordToReplaceLast;
                    return;
                }
            } else {
                scheduleCallback(this.observer);
            }
            records[length] = record;
        },
        addListeners: function() {
            this.addListeners_(this.target);
        },
        addListeners_: function(node) {
            var options = this.options;
            if (options.attributes) node.addEventListener("DOMAttrModified", this, true);
            if (options.characterData) node.addEventListener("DOMCharacterDataModified", this, true);
            if (options.childList) node.addEventListener("DOMNodeInserted", this, true);
            if (options.childList || options.subtree) node.addEventListener("DOMNodeRemoved", this, true);
        },
        removeListeners: function() {
            this.removeListeners_(this.target);
        },
        removeListeners_: function(node) {
            var options = this.options;
            if (options.attributes) node.removeEventListener("DOMAttrModified", this, true);
            if (options.characterData) node.removeEventListener("DOMCharacterDataModified", this, true);
            if (options.childList) node.removeEventListener("DOMNodeInserted", this, true);
            if (options.childList || options.subtree) node.removeEventListener("DOMNodeRemoved", this, true);
        },
        addTransientObserver: function(node) {
            if (node === this.target) return;
            this.addListeners_(node);
            this.transientObservedNodes.push(node);
            var registrations = registrationsTable.get(node);
            if (!registrations) registrationsTable.set(node, registrations = []);
            registrations.push(this);
        },
        removeTransientObservers: function() {
            var transientObservedNodes = this.transientObservedNodes;
            this.transientObservedNodes = [];
            transientObservedNodes.forEach(function(node) {
                this.removeListeners_(node);
                var registrations = registrationsTable.get(node);
                for (var i = 0; i < registrations.length; i++) {
                    if (registrations[i] === this) {
                        registrations.splice(i, 1);
                        break;
                    }
                }
            }, this);
        },
        handleEvent: function(e) {
            e.stopImmediatePropagation();
            switch (e.type) {
              case "DOMAttrModified":
                var name = e.attrName;
                var namespace = e.relatedNode.namespaceURI;
                var target = e.target;
                var record = new getRecord("attributes", target);
                record.attributeName = name;
                record.attributeNamespace = namespace;
                var oldValue = e.attrChange === MutationEvent.ADDITION ? null : e.prevValue;
                forEachAncestorAndObserverEnqueueRecord(target, function(options) {
                    if (!options.attributes) return;
                    if (options.attributeFilter && options.attributeFilter.length && options.attributeFilter.indexOf(name) === -1 && options.attributeFilter.indexOf(namespace) === -1) {
                        return;
                    }
                    if (options.attributeOldValue) return getRecordWithOldValue(oldValue);
                    return record;
                });
                break;

              case "DOMCharacterDataModified":
                var target = e.target;
                var record = getRecord("characterData", target);
                var oldValue = e.prevValue;
                forEachAncestorAndObserverEnqueueRecord(target, function(options) {
                    if (!options.characterData) return;
                    if (options.characterDataOldValue) return getRecordWithOldValue(oldValue);
                    return record;
                });
                break;

              case "DOMNodeRemoved":
                this.addTransientObserver(e.target);

              case "DOMNodeInserted":
                var target = e.relatedNode;
                var changedNode = e.target;
                var addedNodes, removedNodes;
                if (e.type === "DOMNodeInserted") {
                    addedNodes = [ changedNode ];
                    removedNodes = [];
                } else {
                    addedNodes = [];
                    removedNodes = [ changedNode ];
                }
                var previousSibling = changedNode.previousSibling;
                var nextSibling = changedNode.nextSibling;
                var record = getRecord("childList", target);
                record.addedNodes = addedNodes;
                record.removedNodes = removedNodes;
                record.previousSibling = previousSibling;
                record.nextSibling = nextSibling;
                forEachAncestorAndObserverEnqueueRecord(target, function(options) {
                    if (!options.childList) return;
                    return record;
                });
            }
            clearRecords();
        }
    };
    global.JsMutationObserver = JsMutationObserver;
    if (!global.MutationObserver) global.MutationObserver = JsMutationObserver;
})(this);
(function() {
    if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;
    var prototype = Array.prototype, indexOf = prototype.indexOf, slice = prototype.slice, push = prototype.push, splice = prototype.splice, join = prototype.join;
    function DOMTokenList(el) {
        this._element = el;
        if (el.className != this._classCache) {
            this._classCache = el.className;
            if (!this._classCache) return;
            var classes = this._classCache.replace(/^\s+|\s+$/g, "").split(/\s+/), i;
            for (i = 0; i < classes.length; i++) {
                push.call(this, classes[i]);
            }
        }
    }
    function setToClassName(el, classes) {
        el.className = classes.join(" ");
    }
    DOMTokenList.prototype = {
        add: function(token) {
            if (this.contains(token)) return;
            push.call(this, token);
            setToClassName(this._element, slice.call(this, 0));
        },
        contains: function(token) {
            return indexOf.call(this, token) !== -1;
        },
        item: function(index) {
            return this[index] || null;
        },
        remove: function(token) {
            var i = indexOf.call(this, token);
            if (i === -1) {
                return;
            }
            splice.call(this, i, 1);
            setToClassName(this._element, slice.call(this, 0));
        },
        toString: function() {
            return join.call(this, " ");
        },
        toggle: function(token) {
            if (indexOf.call(this, token) === -1) {
                this.add(token);
            } else {
                this.remove(token);
            }
        }
    };
    window.DOMTokenList = DOMTokenList;
    function defineElementGetter(obj, prop, getter) {
        if (Object.defineProperty) {
            Object.defineProperty(obj, prop, {
                get: getter
            });
        } else {
            obj.__defineGetter__(prop, getter);
        }
    }
    defineElementGetter(Element.prototype, "classList", function() {
        return new DOMTokenList(this);
    });
})();

window.HTMLImports = window.HTMLImports || {
    flags: {}
};

(function(scope) {
    var path = scope.path;
    var xhr = scope.xhr;
    var flags = scope.flags;
    var Loader = function(onLoad, onComplete) {
        this.cache = {};
        this.onload = onLoad;
        this.oncomplete = onComplete;
        this.inflight = 0;
        this.pending = {};
    };
    Loader.prototype = {
        addNodes: function(nodes) {
            this.inflight += nodes.length;
            for (var i = 0, l = nodes.length, n; i < l && (n = nodes[i]); i++) {
                this.require(n);
            }
            this.checkDone();
        },
        addNode: function(node) {
            this.inflight++;
            this.require(node);
            this.checkDone();
        },
        require: function(elt) {
            var url = elt.src || elt.href;
            elt.__nodeUrl = url;
            if (!this.dedupe(url, elt)) {
                this.fetch(url, elt);
            }
        },
        dedupe: function(url, elt) {
            if (this.pending[url]) {
                this.pending[url].push(elt);
                return true;
            }
            var resource;
            if (this.cache[url]) {
                this.onload(url, elt, this.cache[url]);
                this.tail();
                return true;
            }
            this.pending[url] = [ elt ];
            return false;
        },
        fetch: function(url, elt) {
            flags.load && console.log("fetch", url, elt);
            if (url.match(/^data:/)) {
                var pieces = url.split(",");
                var header = pieces[0];
                var body = pieces[1];
                if (header.indexOf(";base64") > -1) {
                    body = atob(body);
                } else {
                    body = decodeURIComponent(body);
                }
                setTimeout(function() {
                    this.receive(url, elt, null, body);
                }.bind(this), 0);
            } else {
                var receiveXhr = function(err, resource) {
                    this.receive(url, elt, err, resource);
                }.bind(this);
                xhr.load(url, receiveXhr);
            }
        },
        receive: function(url, elt, err, resource) {
            this.cache[url] = resource;
            var $p = this.pending[url];
            for (var i = 0, l = $p.length, p; i < l && (p = $p[i]); i++) {
                this.onload(url, p, resource);
                this.tail();
            }
            this.pending[url] = null;
        },
        tail: function() {
            --this.inflight;
            this.checkDone();
        },
        checkDone: function() {
            if (!this.inflight) {
                this.oncomplete();
            }
        }
    };
    xhr = xhr || {
        async: true,
        ok: function(request) {
            return request.status >= 200 && request.status < 300 || request.status === 304 || request.status === 0;
        },
        load: function(url, next, nextContext) {
            var request = new XMLHttpRequest();
            if (scope.flags.debug || scope.flags.bust) {
                url += "?" + Math.random();
            }
            request.open("GET", url, xhr.async);
            request.addEventListener("readystatechange", function(e) {
                if (request.readyState === 4) {
                    next.call(nextContext, !xhr.ok(request) && request, request.response || request.responseText, url);
                }
            });
            request.send();
            return request;
        },
        loadDocument: function(url, next, nextContext) {
            this.load(url, next, nextContext).responseType = "document";
        }
    };
    scope.xhr = xhr;
    scope.Loader = Loader;
})(window.HTMLImports);

(function(scope) {
    var IMPORT_LINK_TYPE = "import";
    var flags = scope.flags;
    var isIe = /Trident/.test(navigator.userAgent);
    var mainDoc = window.ShadowDOMPolyfill ? window.ShadowDOMPolyfill.wrapIfNeeded(document) : document;
    var importParser = {
        documentSelectors: "link[rel=" + IMPORT_LINK_TYPE + "]",
        importsSelectors: [ "link[rel=" + IMPORT_LINK_TYPE + "]", "link[rel=stylesheet]", "style", "script:not([type])", 'script[type="text/javascript"]' ].join(","),
        map: {
            link: "parseLink",
            script: "parseScript",
            style: "parseStyle"
        },
        parseNext: function() {
            var next = this.nextToParse();
            if (next) {
                this.parse(next);
            }
        },
        parse: function(elt) {
            if (this.isParsed(elt)) {
                flags.parse && console.log("[%s] is already parsed", elt.localName);
                return;
            }
            var fn = this[this.map[elt.localName]];
            if (fn) {
                this.markParsing(elt);
                fn.call(this, elt);
            }
        },
        markParsing: function(elt) {
            flags.parse && console.log("parsing", elt);
            this.parsingElement = elt;
        },
        markParsingComplete: function(elt) {
            elt.__importParsed = true;
            if (elt.__importElement) {
                elt.__importElement.__importParsed = true;
            }
            this.parsingElement = null;
            flags.parse && console.log("completed", elt);
            this.parseNext();
        },
        parseImport: function(elt) {
            elt.import.__importParsed = true;
            if (HTMLImports.__importsParsingHook) {
                HTMLImports.__importsParsingHook(elt);
            }
            if (elt.__resource) {
                elt.dispatchEvent(new CustomEvent("load", {
                    bubbles: false
                }));
            } else {
                elt.dispatchEvent(new CustomEvent("error", {
                    bubbles: false
                }));
            }
            if (elt.__pending) {
                var fn;
                while (elt.__pending.length) {
                    fn = elt.__pending.shift();
                    if (fn) {
                        fn({
                            target: elt
                        });
                    }
                }
            }
            this.markParsingComplete(elt);
        },
        parseLink: function(linkElt) {
            if (nodeIsImport(linkElt)) {
                this.parseImport(linkElt);
            } else {
                linkElt.href = linkElt.href;
                this.parseGeneric(linkElt);
            }
        },
        parseStyle: function(elt) {
            var src = elt;
            elt = cloneStyle(elt);
            elt.__importElement = src;
            this.parseGeneric(elt);
        },
        parseGeneric: function(elt) {
            this.trackElement(elt);
            document.head.appendChild(elt);
        },
        trackElement: function(elt, callback) {
            var self = this;
            var done = function(e) {
                if (callback) {
                    callback(e);
                }
                self.markParsingComplete(elt);
            };
            elt.addEventListener("load", done);
            elt.addEventListener("error", done);
            if (isIe && elt.localName === "style") {
                var fakeLoad = false;
                if (elt.textContent.indexOf("@import") == -1) {
                    fakeLoad = true;
                } else if (elt.sheet) {
                    fakeLoad = true;
                    var csr = elt.sheet.cssRules;
                    var len = csr ? csr.length : 0;
                    for (var i = 0, r; i < len && (r = csr[i]); i++) {
                        if (r.type === CSSRule.IMPORT_RULE) {
                            fakeLoad = fakeLoad && Boolean(r.styleSheet);
                        }
                    }
                }
                if (fakeLoad) {
                    elt.dispatchEvent(new CustomEvent("load", {
                        bubbles: false
                    }));
                }
            }
        },
        parseScript: function(scriptElt) {
            var script = document.createElement("script");
            script.charset = "UTF-8"
            script.__importElement = scriptElt;
            script.src = scriptElt.src ? scriptElt.src : generateScriptDataUrl(scriptElt);
            scope.currentScript = scriptElt;
            this.trackElement(script, function(e) {
                script.parentNode.removeChild(script);
                scope.currentScript = null;
            });
            document.head.appendChild(script);
        },
        nextToParse: function() {
            return !this.parsingElement && this.nextToParseInDoc(mainDoc);
        },
        nextToParseInDoc: function(doc, link) {
            var nodes = doc.querySelectorAll(this.parseSelectorsForNode(doc));
            for (var i = 0, l = nodes.length, p = 0, n; i < l && (n = nodes[i]); i++) {
                if (!this.isParsed(n)) {
                    if (this.hasResource(n)) {
                        return nodeIsImport(n) ? this.nextToParseInDoc(n.import, n) : n;
                    } else {
                        return;
                    }
                }
            }
            return link;
        },
        parseSelectorsForNode: function(node) {
            var doc = node.ownerDocument || node;
            return doc === mainDoc ? this.documentSelectors : this.importsSelectors;
        },
        isParsed: function(node) {
            return node.__importParsed;
        },
        hasResource: function(node) {
            if (nodeIsImport(node) && !node.import) {
                return false;
            }
            return true;
        }
    };
    function nodeIsImport(elt) {
        return elt.localName === "link" && elt.rel === IMPORT_LINK_TYPE;
    }
    function generateScriptDataUrl(script) {
        var scriptContent = generateScriptContent(script), b64;
        b64 = btoa(unescape(encodeURIComponent(scriptContent)));
        return "data:text/javascript;charset=utf-8;base64," + b64;
    }
    function generateScriptContent(script) {
        return script.textContent + generateSourceMapHint(script);
    }
    function generateSourceMapHint(script) {
        var moniker = script.__nodeUrl;
        if (!moniker) {
            moniker = script.ownerDocument.baseURI;
            var tag = "[" + Math.floor((Math.random() + 1) * 1e3) + "]";
            var matches = script.textContent.match(/Polymer\(['"]([^'"]*)/);
            tag = matches && matches[1] || tag;
            moniker += "/" + tag + ".js";
        }
        return "\n//# sourceURL=" + moniker + "\n";
    }
    function cloneStyle(style) {
        var clone = style.ownerDocument.createElement("style");
        clone.textContent = style.textContent;
        path.resolveUrlsInStyle(clone);
        return clone;
    }
    var CSS_URL_REGEXP = /(url\()([^)]*)(\))/g;
    var CSS_IMPORT_REGEXP = /(@import[\s]+(?!url\())([^;]*)(;)/g;
    var path = {
        resolveUrlsInStyle: function(style) {
            var doc = style.ownerDocument;
            var resolver = doc.createElement("a");
            style.textContent = this.resolveUrlsInCssText(style.textContent, resolver);
            return style;
        },
        resolveUrlsInCssText: function(cssText, urlObj) {
            var r = this.replaceUrls(cssText, urlObj, CSS_URL_REGEXP);
            r = this.replaceUrls(r, urlObj, CSS_IMPORT_REGEXP);
            return r;
        },
        replaceUrls: function(text, urlObj, regexp) {
            return text.replace(regexp, function(m, pre, url, post) {
                var urlPath = url.replace(/["']/g, "");
                urlObj.href = urlPath;
                urlPath = urlObj.href;
                return pre + "'" + urlPath + "'" + post;
            });
        }
    };
    scope.parser = importParser;
    scope.path = path;
    scope.isIE = isIe;
})(HTMLImports);

(function(scope) {
    var hasNative = "import" in document.createElement("link");
    var useNative = hasNative;
    var flags = scope.flags;
    var IMPORT_LINK_TYPE = "import";
    var mainDoc = window.ShadowDOMPolyfill ? ShadowDOMPolyfill.wrapIfNeeded(document) : document;
    if (!useNative) {
        var xhr = scope.xhr;
        var Loader = scope.Loader;
        var parser = scope.parser;
        var importer = {
            documents: {},
            documentPreloadSelectors: "link[rel=" + IMPORT_LINK_TYPE + "]",
            importsPreloadSelectors: [ "link[rel=" + IMPORT_LINK_TYPE + "]" ].join(","),
            loadNode: function(node) {
                importLoader.addNode(node);
            },
            loadSubtree: function(parent) {
                var nodes = this.marshalNodes(parent);
                importLoader.addNodes(nodes);
            },
            marshalNodes: function(parent) {
                return parent.querySelectorAll(this.loadSelectorsForNode(parent));
            },
            loadSelectorsForNode: function(node) {
                var doc = node.ownerDocument || node;
                return doc === mainDoc ? this.documentPreloadSelectors : this.importsPreloadSelectors;
            },
            loaded: function(url, elt, resource) {
                flags.load && console.log("loaded", url, elt);
                elt.__resource = resource;
                if (isDocumentLink(elt)) {
                    var doc = this.documents[url];
                    if (!doc) {
                        doc = makeDocument(resource, url);
                        doc.__importLink = elt;
                        this.bootDocument(doc);
                        this.documents[url] = doc;
                    }
                    elt.import = doc;
                }
                parser.parseNext();
            },
            bootDocument: function(doc) {
                this.loadSubtree(doc);
                this.observe(doc);
                parser.parseNext();
            },
            loadedAll: function() {
                parser.parseNext();
            }
        };
        var importLoader = new Loader(importer.loaded.bind(importer), importer.loadedAll.bind(importer));
        function isDocumentLink(elt) {
            return isLinkRel(elt, IMPORT_LINK_TYPE);
        }
        function isLinkRel(elt, rel) {
            return elt.localName === "link" && elt.getAttribute("rel") === rel;
        }
        function isScript(elt) {
            return elt.localName === "script";
        }
        function makeDocument(resource, url) {
            var doc = resource;
            if (!(doc instanceof Document)) {
                doc = document.implementation.createHTMLDocument(IMPORT_LINK_TYPE);
            }
            doc._URL = url;
            var base = doc.createElement("base");
            base.setAttribute("href", url);
            if (!doc.baseURI) {
                doc.baseURI = url;
            }
            var meta = doc.createElement("meta");
            meta.setAttribute("charset", "utf-8");
            doc.head.appendChild(meta);
            doc.head.appendChild(base);
            if (!(resource instanceof Document)) {
                doc.body.innerHTML = resource;
            }
            if (window.HTMLTemplateElement && HTMLTemplateElement.bootstrap) {
                HTMLTemplateElement.bootstrap(doc);
            }
            return doc;
        }
    } else {
        var importer = {};
    }
    var currentScriptDescriptor = {
        get: function() {
            return HTMLImports.currentScript || document.currentScript;
        },
        configurable: true
    };
    Object.defineProperty(document, "_currentScript", currentScriptDescriptor);
    Object.defineProperty(mainDoc, "_currentScript", currentScriptDescriptor);
    if (!document.baseURI) {
        var baseURIDescriptor = {
            get: function() {
                return window.location.href;
            },
            configurable: true
        };
        Object.defineProperty(document, "baseURI", baseURIDescriptor);
        Object.defineProperty(mainDoc, "baseURI", baseURIDescriptor);
    }
    function whenImportsReady(callback, doc) {
        doc = doc || mainDoc;
        whenDocumentReady(function() {
            watchImportsLoad(callback, doc);
        }, doc);
    }
    var requiredReadyState = HTMLImports.isIE ? "complete" : "interactive";
    var READY_EVENT = "readystatechange";
    function isDocumentReady(doc) {
        return doc.readyState === "complete" || doc.readyState === requiredReadyState;
    }
    function whenDocumentReady(callback, doc) {
        if (!isDocumentReady(doc)) {
            var checkReady = function() {
                if (doc.readyState === "complete" || doc.readyState === requiredReadyState) {
                    doc.removeEventListener(READY_EVENT, checkReady);
                    whenDocumentReady(callback, doc);
                }
            };
            doc.addEventListener(READY_EVENT, checkReady);
        } else if (callback) {
            callback();
        }
    }
    function watchImportsLoad(callback, doc) {
        var imports = doc.querySelectorAll("link[rel=import]");
        var loaded = 0, l = imports.length;
        function checkDone(d) {
            if (loaded == l) {
                //TODO : requestAnimationFrame(callback);
            	setTimeout(callback, 0);
            }
        }
        function loadedImport(e) {
            loaded++;
            checkDone();
        }
        if (l) {
            for (var i = 0, imp; i < l && (imp = imports[i]); i++) {
                if (isImportLoaded(imp)) {
                    loadedImport.call(imp);
                } else {
                    imp.addEventListener("load", loadedImport);
                    imp.addEventListener("error", loadedImport);
                }
            }
        } else {
            checkDone();
        }
    }
    function isImportLoaded(link) {
        return useNative ? link.import && link.import.readyState !== "loading" : link.__importParsed;
    }
    scope.hasNative = hasNative;
    scope.useNative = useNative;
    scope.importer = importer;
    scope.whenImportsReady = whenImportsReady;
    scope.IMPORT_LINK_TYPE = IMPORT_LINK_TYPE;
    scope.isImportLoaded = isImportLoaded;
    scope.importLoader = importLoader;
})(window.HTMLImports);

(function(scope) {
    var IMPORT_LINK_TYPE = scope.IMPORT_LINK_TYPE;
    var importSelector = "link[rel=" + IMPORT_LINK_TYPE + "]";
    var importer = scope.importer;
    function handler(mutations) {
        for (var i = 0, l = mutations.length, m; i < l && (m = mutations[i]); i++) {
            if (m.type === "childList" && m.addedNodes.length) {
                addedNodes(m.addedNodes);
            }
        }
    }
    function addedNodes(nodes) {
        for (var i = 0, l = nodes.length, n; i < l && (n = nodes[i]); i++) {
            if (shouldLoadNode(n)) {
                importer.loadNode(n);
            }
            if (n.children && n.children.length) {
                addedNodes(n.children);
            }
        }
    }
    function shouldLoadNode(node) {
        return node.nodeType === 1 && matches.call(node, importer.loadSelectorsForNode(node));
    }
    var matches = HTMLElement.prototype.matches || HTMLElement.prototype.matchesSelector || HTMLElement.prototype.webkitMatchesSelector || HTMLElement.prototype.mozMatchesSelector || HTMLElement.prototype.msMatchesSelector;
    var observer = new MutationObserver(handler);
    function observe(root) {
        observer.observe(root, {
            childList: true,
            subtree: true
        });
    }
    scope.observe = observe;
    importer.observe = observe;
})(HTMLImports);

(function() {
    if (typeof window.CustomEvent !== "function") {
        window.CustomEvent = function(inType, dictionary) {
            var e = document.createEvent("HTMLEvents");
            e.initEvent(inType, dictionary.bubbles === false ? false : true, dictionary.cancelable === false ? false : true, dictionary.detail);
            return e;
        };
    }
    var doc = window.ShadowDOMPolyfill ? window.ShadowDOMPolyfill.wrapIfNeeded(document) : document;
    HTMLImports.whenImportsReady(function() {
        HTMLImports.ready = true;
        HTMLImports.readyTime = new Date().getTime();
        doc.dispatchEvent(new CustomEvent("HTMLImportsLoaded", {
            bubbles: true
        }));
    });
    if (!HTMLImports.useNative) {
        function bootstrap() {
            HTMLImports.importer.bootDocument(doc);
        }
        if (document.readyState === "complete" || document.readyState === "interactive" && !window.attachEvent) {
            bootstrap();
        } else {
            document.addEventListener("DOMContentLoaded", bootstrap);
        }
    }
})();

if (!window.CustomElements) {
    window.CustomElements = {
        flags: {}
    };
}

(function(scope) {
    var logFlags = window.logFlags || {};
    var IMPORT_LINK_TYPE = window.HTMLImports ? HTMLImports.IMPORT_LINK_TYPE : "none";
    function findAll(node, find, data) {
        var e = node.firstElementChild;
        if (!e) {
            e = node.firstChild;
            while (e && e.nodeType !== Node.ELEMENT_NODE) {
                e = e.nextSibling;
            }
        }
        while (e) {
            if (find(e, data) !== true) {
                findAll(e, find, data);
            }
            e = e.nextElementSibling;
        }
        return null;
    }
    function forRoots(node, cb) {
        var root = node.shadowRoot;
        while (root) {
            forSubtree(root, cb);
            root = root.olderShadowRoot;
        }
    }
    function forSubtree(node, cb) {
        findAll(node, function(e) {
            if (cb(e)) {
                return true;
            }
            forRoots(e, cb);
        });
        forRoots(node, cb);
    }
    function added(node) {
        if (upgrade(node)) {
            insertedNode(node);
            return true;
        }
        inserted(node);
    }
    function addedSubtree(node) {
        forSubtree(node, function(e) {
            if (added(e)) {
                return true;
            }
        });
    }
    function addedNode(node) {
        return added(node) || addedSubtree(node);
    }
    function upgrade(node) {
        if (!node.__upgraded__ && node.nodeType === Node.ELEMENT_NODE) {
            var type = node.getAttribute("is") || node.localName;
            var definition = scope.registry[type];
            if (definition) {
                logFlags.dom && console.group("upgrade:", node.localName);
                scope.upgrade(node);
                logFlags.dom && console.groupEnd();
                return true;
            }
        }
    }
    function insertedNode(node) {
        inserted(node);
        if (inDocument(node)) {
            forSubtree(node, function(e) {
                inserted(e);
            });
        }
    }
    var hasPolyfillMutations = !window.MutationObserver || window.MutationObserver === window.JsMutationObserver;
    scope.hasPolyfillMutations = hasPolyfillMutations;
    var isPendingMutations = false;
    var pendingMutations = [];
    function deferMutation(fn) {
        pendingMutations.push(fn);
        if (!isPendingMutations) {
            isPendingMutations = true;
            var async = window.Platform && window.Platform.endOfMicrotask || setTimeout;
            async(takeMutations);
        }
    }
    function takeMutations() {
        isPendingMutations = false;
        var $p = pendingMutations;
        for (var i = 0, l = $p.length, p; i < l && (p = $p[i]); i++) {
            p();
        }
        pendingMutations = [];
    }
    function inserted(element) {
        if (hasPolyfillMutations) {
            deferMutation(function() {
                _inserted(element);
            });
        } else {
            _inserted(element);
        }
    }
    function _inserted(element) {
        if (element.attachedCallback || element.detachedCallback || element.__upgraded__ && logFlags.dom) {
            logFlags.dom && console.group("inserted:", element.localName);
            if (inDocument(element)) {
                element.__inserted = (element.__inserted || 0) + 1;
                if (element.__inserted < 1) {
                    element.__inserted = 1;
                }
                if (element.__inserted > 1) {
                    logFlags.dom && console.warn("inserted:", element.localName, "insert/remove count:", element.__inserted);
                } else if (element.attachedCallback) {
                    logFlags.dom && console.log("inserted:", element.localName);
                    element.attachedCallback();
                }
            }
            logFlags.dom && console.groupEnd();
        }
    }
    function removedNode(node) {
        removed(node);
        forSubtree(node, function(e) {
            removed(e);
        });
    }
    function removed(element) {
        if (hasPolyfillMutations) {
            deferMutation(function() {
                _removed(element);
            });
        } else {
            _removed(element);
        }
    }
    function _removed(element) {
        if (element.attachedCallback || element.detachedCallback || element.__upgraded__ && logFlags.dom) {
            logFlags.dom && console.group("removed:", element.localName);
            if (!inDocument(element)) {
                element.__inserted = (element.__inserted || 0) - 1;
                if (element.__inserted > 0) {
                    element.__inserted = 0;
                }
                if (element.__inserted < 0) {
                    logFlags.dom && console.warn("removed:", element.localName, "insert/remove count:", element.__inserted);
                } else if (element.detachedCallback) {
                    element.detachedCallback();
                }
            }
            logFlags.dom && console.groupEnd();
        }
    }
    function wrapIfNeeded(node) {
        return window.ShadowDOMPolyfill ? ShadowDOMPolyfill.wrapIfNeeded(node) : node;
    }
    function inDocument(element) {
        var p = element;
        var doc = wrapIfNeeded(document);
        while (p) {
            if (p == doc) {
                return true;
            }
            p = p.parentNode || p.host;
        }
    }
    function watchShadow(node) {
        if (node.shadowRoot && !node.shadowRoot.__watched) {
            logFlags.dom && console.log("watching shadow-root for: ", node.localName);
            var root = node.shadowRoot;
            while (root) {
                watchRoot(root);
                root = root.olderShadowRoot;
            }
        }
    }
    function watchRoot(root) {
        if (!root.__watched) {
            observe(root);
            root.__watched = true;
        }
    }
    function handler(mutations) {
        if (logFlags.dom) {
            var mx = mutations[0];
            if (mx && mx.type === "childList" && mx.addedNodes) {
                if (mx.addedNodes) {
                    var d = mx.addedNodes[0];
                    while (d && d !== document && !d.host) {
                        d = d.parentNode;
                    }
                    var u = d && (d.URL || d._URL || d.host && d.host.localName) || "";
                    u = u.split("/?").shift().split("/").pop();
                }
            }
            console.group("mutations (%d) [%s]", mutations.length, u || "");
        }
        mutations.forEach(function(mx) {
            if (mx.type === "childList") {
                forEach(mx.addedNodes, function(n) {
                    if (!n.localName) {
                        return;
                    }
                    addedNode(n);
                });
                forEach(mx.removedNodes, function(n) {
                    if (!n.localName) {
                        return;
                    }
                    removedNode(n);
                });
            }
        });
        logFlags.dom && console.groupEnd();
    }
    var observer = new MutationObserver(handler);
    function takeRecords() {
        handler(observer.takeRecords());
        takeMutations();
    }
    var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);
    function observe(inRoot) {
        observer.observe(inRoot, {
            childList: true,
            subtree: true
        });
    }
    function observeDocument(doc) {
        observe(doc);
    }
    function upgradeDocument(doc) {
        logFlags.dom && console.group("upgradeDocument: ", doc.baseURI.split("/").pop());
        addedNode(doc);
        logFlags.dom && console.groupEnd();
    }
    function upgradeDocumentTree(doc) {
        doc = wrapIfNeeded(doc);
        var imports = doc.querySelectorAll("link[rel=" + IMPORT_LINK_TYPE + "]");
        for (var i = 0, l = imports.length, n; i < l && (n = imports[i]); i++) {
            if (n.import && n.import.__parsed) {
                upgradeDocumentTree(n.import);
            }
        }
        upgradeDocument(doc);
    }
    scope.IMPORT_LINK_TYPE = IMPORT_LINK_TYPE;
    scope.watchShadow = watchShadow;
    scope.upgradeDocumentTree = upgradeDocumentTree;
    scope.upgradeAll = addedNode;
    scope.upgradeSubtree = addedSubtree;
    scope.insertedNode = insertedNode;
    scope.observeDocument = observeDocument;
    scope.upgradeDocument = upgradeDocument;
    scope.takeRecords = takeRecords;
})(window.CustomElements);

(function(scope) {
    if (!scope) {
        scope = window.CustomElements = {
            flags: {}
        };
    }
    var flags = scope.flags;
    var hasNative = Boolean(document.registerElement);
    var useNative = !flags.register && hasNative && !window.ShadowDOMPolyfill;
    if (useNative) {
        var nop = function() {};
        scope.registry = {};
        scope.upgradeElement = nop;
        scope.watchShadow = nop;
        scope.upgrade = nop;
        scope.upgradeAll = nop;
        scope.upgradeSubtree = nop;
        scope.observeDocument = nop;
        scope.upgradeDocument = nop;
        scope.upgradeDocumentTree = nop;
        scope.takeRecords = nop;
        scope.reservedTagList = [];
    } else {
        function register(name, options) {
            var definition = options || {};
            if (!name) {
                throw new Error("document.registerElement: first argument `name` must not be empty");
            }
            if (name.indexOf("-") < 0) {
                throw new Error("document.registerElement: first argument ('name') must contain a dash ('-'). Argument provided was '" + String(name) + "'.");
            }
            if (isReservedTag(name)) {
                throw new Error("Failed to execute 'registerElement' on 'Document': Registration failed for type '" + String(name) + "'. The type name is invalid.");
            }
            if (getRegisteredDefinition(name)) {
                throw new Error("DuplicateDefinitionError: a type with name '" + String(name) + "' is already registered");
            }
            if (!definition.prototype) {
                throw new Error("Options missing required prototype property");
            }
            definition.__name = name.toLowerCase();
            definition.lifecycle = definition.lifecycle || {};
            definition.ancestry = ancestry(definition.extends);
            resolveTagName(definition);
            resolvePrototypeChain(definition);
            overrideAttributeApi(definition.prototype);
            registerDefinition(definition.__name, definition);
            definition.ctor = generateConstructor(definition);
            definition.ctor.prototype = definition.prototype;
            definition.prototype.constructor = definition.ctor;
            if (scope.ready) {
                scope.upgradeDocumentTree(document);
            }
            return definition.ctor;
        }
        function isReservedTag(name) {
            for (var i = 0; i < reservedTagList.length; i++) {
                if (name === reservedTagList[i]) {
                    return true;
                }
            }
        }
        var reservedTagList = [ "annotation-xml", "color-profile", "font-face", "font-face-src", "font-face-uri", "font-face-format", "font-face-name", "missing-glyph" ];
        function ancestry(extnds) {
            var extendee = getRegisteredDefinition(extnds);
            if (extendee) {
                return ancestry(extendee.extends).concat([ extendee ]);
            }
            return [];
        }
        function resolveTagName(definition) {
            var baseTag = definition.extends;
            for (var i = 0, a; a = definition.ancestry[i]; i++) {
                baseTag = a.is && a.tag;
            }
            definition.tag = baseTag || definition.__name;
            if (baseTag) {
                definition.is = definition.__name;
            }
        }
        function resolvePrototypeChain(definition) {
            if (!Object.__proto__) {
                var nativePrototype = HTMLElement.prototype;
                if (definition.is) {
                    var inst = document.createElement(definition.tag);
                    nativePrototype = Object.getPrototypeOf(inst);
                }
                var proto = definition.prototype, ancestor;
                while (proto && proto !== nativePrototype) {
                    var ancestor = Object.getPrototypeOf(proto);
                    proto.__proto__ = ancestor;
                    proto = ancestor;
                }
            }
            definition.native = Object.getPrototypeOf(document.createElement(definition.tag));
        }
        function instantiate(definition) {
            return upgrade(domCreateElement(definition.tag), definition);
        }
        function upgrade(element, definition) {
            if (definition.is) {
                element.setAttribute("is", definition.is);
            }
            element.removeAttribute("unresolved");
            implement(element, definition);
            element.__upgraded__ = true;
            created(element);
            scope.insertedNode(element);
            scope.upgradeSubtree(element);
            return element;
        }
        function implement(element, definition) {
            if (Object.__proto__) {
            	if (Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').configurable) element.__proto__ = definition.prototype;
            	else customMixin(element, definition.prototype, definition.native);
            } else {
                customMixin(element, definition.prototype, definition.native);
                element.__proto__ = definition.prototype;
            }
        }
        function customMixin(inTarget, inSrc, inNative) {
            var used = {};
            var p = inSrc;
            while (p !== inNative && p !== HTMLElement.prototype) {
                var keys = Object.getOwnPropertyNames(p);
                for (var i = 0, k; k = keys[i]; i++) {
                    if (!used[k]) {
                        Object.defineProperty(inTarget, k, Object.getOwnPropertyDescriptor(p, k));
                        used[k] = 1;
                    }
                }
                p = Object.getPrototypeOf(p);
            }
        }
        function created(element) {
            if (element.createdCallback) {
                element.createdCallback();
            }
        }
        function overrideAttributeApi(prototype) {
            if (prototype.setAttribute._polyfilled) {
                return;
            }
            var setAttribute = prototype.setAttribute;
            prototype.setAttribute = function(name, value) {
                changeAttribute.call(this, name, value, setAttribute);
            };
            var removeAttribute = prototype.removeAttribute;
            prototype.removeAttribute = function(name) {
                changeAttribute.call(this, name, null, removeAttribute);
            };
            prototype.setAttribute._polyfilled = true;
        }
        function changeAttribute(name, value, operation) {
            var oldValue = this.getAttribute(name);
            operation.apply(this, arguments);
            var newValue = this.getAttribute(name);
            if (this.attributeChangedCallback && newValue !== oldValue) {
                this.attributeChangedCallback(name, oldValue, newValue);
            }
        }
        var registry = {};
        function getRegisteredDefinition(name) {
            if (name) {
                return registry[name.toLowerCase()];
            }
        }
        function registerDefinition(name, definition) {
            registry[name] = definition;
        }
        function generateConstructor(definition) {
            return function() {
                return instantiate(definition);
            };
        }
        var HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
        function createElementNS(namespace, tag, typeExtension) {
            if (namespace === HTML_NAMESPACE) {
                return createElement(tag, typeExtension);
            } else {
                return domCreateElementNS(namespace, tag);
            }
        }
        function createElement(tag, typeExtension) {
            var definition = getRegisteredDefinition(typeExtension || tag);
            if (definition) {
                if (tag == definition.tag && typeExtension == definition.is) {
                    return new definition.ctor();
                }
                if (!typeExtension && !definition.is) {
                    return new definition.ctor();
                }
            }
            if (typeExtension) {
                var element = createElement(tag);
                element.setAttribute("is", typeExtension);
                return element;
            }
            var element = domCreateElement(tag);
            if (tag.indexOf("-") >= 0) {
                implement(element, HTMLElement);
            }
            return element;
        }
        function upgradeElement(element) {
            if (!element.__upgraded__ && element.nodeType === Node.ELEMENT_NODE) {
                var is = element.getAttribute("is");
                var definition = getRegisteredDefinition(is || element.localName);
                if (definition) {
                    if (is && definition.tag == element.localName) {
                        return upgrade(element, definition);
                    } else if (!is && !definition.extends) {
                        return upgrade(element, definition);
                    }
                }
            }
        }
        function cloneNode(deep) {
            var n = domCloneNode.call(this, deep);
            scope.upgradeAll(n);
            return n;
        }
        
        function cloneContents() {
        	var n = domCloneContents.call(this);
        	console.log(n.nodeType, n)
        	scope.upgradeAll(n);
            return n;
        }
        var domCreateElement = document.createElement.bind(document);
        var domCreateElementNS = document.createElementNS.bind(document);
        var domCloneNode = Node.prototype.cloneNode;
        var domCloneContents = Range.prototype.cloneContents;
        document.registerElement = register;
        document.createElement = createElement;
        document.createElementNS = createElementNS;
        Node.prototype.cloneNode = cloneNode;
        Range.prototype.cloneContents = cloneContents;
        scope.registry = registry;
        scope.upgrade = upgradeElement;
    }
    var isInstance;
    if (!Object.__proto__ && !useNative) {
        isInstance = function(obj, ctor) {
            var p = obj;
            while (p) {
                if (p === ctor.prototype) {
                    return true;
                }
                p = p.__proto__;
            }
            return false;
        };
    } else {
        isInstance = function(obj, base) {
            return obj instanceof base;
        };
    }
    scope.instanceof = isInstance;
    scope.reservedTagList = reservedTagList;
    document.register = document.registerElement;
    scope.hasNative = hasNative;
    scope.useNative = useNative;
})(window.CustomElements);

(function(scope) {
    var IMPORT_LINK_TYPE = scope.IMPORT_LINK_TYPE;
    var parser = {
        selectors: [ "link[rel=" + IMPORT_LINK_TYPE + "]" ],
        map: {
            link: "parseLink"
        },
        parse: function(inDocument) {
            if (!inDocument.__parsed) {
                inDocument.__parsed = true;
                var elts = inDocument.querySelectorAll(parser.selectors);
                forEach(elts, function(e) {
                    parser[parser.map[e.localName]](e);
                });
                CustomElements.upgradeDocument(inDocument);
                CustomElements.observeDocument(inDocument);
            }
        },
        parseLink: function(linkElt) {
            if (isDocumentLink(linkElt)) {
                this.parseImport(linkElt);
            }
        },
        parseImport: function(linkElt) {
            if (linkElt.import) {
                parser.parse(linkElt.import);
            }
        }
    };
    function isDocumentLink(inElt) {
        return inElt.localName === "link" && inElt.getAttribute("rel") === IMPORT_LINK_TYPE;
    }
    var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);
    scope.parser = parser;
    scope.IMPORT_LINK_TYPE = IMPORT_LINK_TYPE;
})(window.CustomElements);

(function(scope) {
    function bootstrap() {
        CustomElements.parser.parse(document);
        CustomElements.upgradeDocument(document);
        var async = window.Platform && Platform.endOfMicrotask ? Platform.endOfMicrotask : setTimeout;
        async(function() {
            CustomElements.ready = true;
            CustomElements.readyTime = Date.now();
            if (window.HTMLImports) {
                CustomElements.elapsed = CustomElements.readyTime - HTMLImports.readyTime;
            }
            document.dispatchEvent(new CustomEvent("WebComponentsReady", {
                bubbles: true
            }));
            if (window.HTMLImports) {
                HTMLImports.__importsParsingHook = function(elt) {
                    CustomElements.parser.parse(elt.import);
                };
            }
        });
    }
    if (typeof window.CustomEvent !== "function") {
        window.CustomEvent = function(inType) {
            var e = document.createEvent("HTMLEvents");
            e.initEvent(inType, true, true);
            return e;
        };
    }
    if (document.readyState === "complete" || scope.flags.eager) {
        bootstrap();
    } else if (document.readyState === "interactive" && !window.attachEvent && (!window.HTMLImports || window.HTMLImports.ready)) {
        bootstrap();
    } else {
        var loadEvent = window.HTMLImports && !HTMLImports.ready ? "HTMLImportsLoaded" : "DOMContentLoaded";
        window.addEventListener(loadEvent, bootstrap);
    }
})(window.CustomElements);
(function() {
    var win = window, doc = document, container = doc.createElement("div"), noop = function() {}, trueop = function() {
        return true;
    }, regexPseudoSplit = /([\w-]+(?:\([^\)]+\))?)/g, regexPseudoReplace = /(\w*)(?:\(([^\)]*)\))?/, regexDigits = /(\d+)/g, keypseudo = {
        action: function(pseudo, event) {
            return pseudo.value.match(regexDigits).indexOf(String(event.keyCode)) > -1 == (pseudo.name == "keypass") || null;
        }
    }, prefix = function() {
        var styles = win.getComputedStyle(doc.documentElement, ""), pre = (Array.prototype.slice.call(styles).join("").match(/-(moz|webkit|ms)-/) || styles.OLink === "" && [ "", "o" ])[1];
        return {
            dom: pre == "ms" ? "MS" : pre,
            lowercase: pre,
            css: "-" + pre + "-",
            js: pre == "ms" ? pre : pre[0].toUpperCase() + pre.substr(1)
        };
    }(), matchSelector = Element.prototype.matchesSelector || Element.prototype[prefix.lowercase + "MatchesSelector"], mutation = win.MutationObserver || win[prefix.js + "MutationObserver"];
    var typeCache = {}, typeString = typeCache.toString, typeRegexp = /\s([a-zA-Z]+)/;
    function typeOf(obj) {
        var type = typeString.call(obj);
        return typeCache[type] || (typeCache[type] = type.match(typeRegexp)[1].toLowerCase());
    }
    function clone(item, type) {
        var fn = clone[type || typeOf(item)];
        return fn ? fn(item) : item;
    }
    clone.object = function(src) {
        var obj = {};
        for (var key in src) obj[key] = clone(src[key]);
        return obj;
    };
    clone.array = function(src) {
        var i = src.length, array = new Array(i);
        while (i--) array[i] = clone(src[i]);
        return array;
    };
    var unsliceable = [ "undefined", "null", "number", "boolean", "string", "function" ];
    function toArray(obj) {
        return unsliceable.indexOf(typeOf(obj)) == -1 ? Array.prototype.slice.call(obj, 0) : [ obj ];
    }
    var str = "";
    function query(element, selector) {
        return (selector || str).length ? toArray(element.querySelectorAll(selector)) : [];
    }
    function parseMutations(element, mutations) {
        var diff = {
            added: [],
            removed: []
        };
        mutations.forEach(function(record) {
            record._mutation = true;
            for (var z in diff) {
                var type = element._records[z == "added" ? "inserted" : "removed"], nodes = record[z + "Nodes"], length = nodes.length;
                for (var i = 0; i < length && diff[z].indexOf(nodes[i]) == -1; i++) {
                    diff[z].push(nodes[i]);
                    type.forEach(function(fn) {
                        fn(nodes[i], record);
                    });
                }
            }
        });
    }
    function mergeOne(source, key, current) {
        var type = typeOf(current);
        if (type == "object" && typeOf(source[key]) == "object") xtag.merge(source[key], current); else source[key] = clone(current, type);
        return source;
    }
    function wrapMixin(tag, key, pseudo, value, original) {
        var fn = original[key];
        if (!(key in original)) original[key] = value; else if (typeof original[key] == "function") {
            if (!fn.__mixins__) fn.__mixins__ = [];
            fn.__mixins__.push(xtag.applyPseudos(pseudo, value, tag.pseudos));
        }
    }
    var uniqueMixinCount = 0;
    function mergeMixin(tag, mixin, original, mix) {
        if (mix) {
            var uniques = {};
            for (var z in original) uniques[z.split(":")[0]] = z;
            for (z in mixin) {
                wrapMixin(tag, uniques[z.split(":")[0]] || z, z, mixin[z], original);
            }
        } else {
            for (var zz in mixin) {
                original[zz + ":__mixin__(" + uniqueMixinCount++ + ")"] = xtag.applyPseudos(zz, mixin[zz], tag.pseudos);
            }
        }
    }
    function applyMixins(tag) {
        tag.mixins.forEach(function(name) {
            var mixin = xtag.mixins[name];
            for (var type in mixin) {
                var item = mixin[type], original = tag[type];
                if (!original) tag[type] = item; else {
                    switch (type) {
                      case "accessors":
                      case "prototype":
                        for (var z in item) {
                            if (!original[z]) original[z] = item[z]; else mergeMixin(tag, item[z], original[z], true);
                        }
                        break;

                      default:
                        mergeMixin(tag, item, original, type != "events");
                    }
                }
            }
        });
        return tag;
    }
    function delegateAction(pseudo, event) {
        var match, target = event.target;
        if (!target.tagName) return null;
        if (xtag.matchSelector(target, pseudo.value)) match = target; else if (xtag.matchSelector(target, pseudo.value + " *")) {
            var parent = target.parentNode;
            while (!match) {
                if (xtag.matchSelector(parent, pseudo.value)) match = parent;
                parent = parent.parentNode;
            }
        }
        return match ? pseudo.listener = pseudo.listener.bind(match) : null;
    }
    function touchFilter(event) {
        if (event.type.match("touch")) {
            event.target.__touched__ = true;
        } else if (event.target.__touched__ && event.type.match("mouse")) {
            delete event.target.__touched__;
            return;
        }
        return true;
    }
    function createFlowEvent(type) {
        var flow = type == "over";
        return {
            attach: "OverflowEvent" in win ? "overflowchanged" : [],
            condition: function(event, custom) {
                event.flow = type;
                return event.type == type + "flow" || event.orient === 0 && event.horizontalOverflow == flow || event.orient == 1 && event.verticalOverflow == flow || event.orient == 2 && event.horizontalOverflow == flow && event.verticalOverflow == flow;
            }
        };
    }
    function writeProperty(key, event, base, desc) {
        if (desc) event[key] = base[key]; else Object.defineProperty(event, key, {
            writable: true,
            enumerable: true,
            value: base[key]
        });
    }
    var skipProps = {};
    for (var z in doc.createEvent("CustomEvent")) skipProps[z] = 1;
    function inheritEvent(event, base) {
        var desc = Object.getOwnPropertyDescriptor(event, "target");
        for (var z in base) {
            if (!skipProps[z]) writeProperty(z, event, base, desc);
        }
        event.baseEvent = base;
    }
    function getArgs(attr, value) {
        return {
            value: attr.boolean ? "" : value,
            method: (attr.boolean && !value) || value === undefined || value === null ? "removeAttribute" : "setAttribute"
        };
    }
    function modAttr(element, attr, name, value) {
        var args = getArgs(attr, value);
        element[args.method](name, args.value);
    }
    function syncAttr(element, attr, name, value, method) {
        var nodes = attr.property ? [ element.xtag[attr.property] ] : attr.selector ? xtag.query(element, attr.selector) : [], index = nodes.length;
        while (index--) nodes[index][method](name, value);
    }
    function updateView(element, name, value) {
        if (element.__view__) {
            element.__view__.updateBindingValue(element, name, value);
        }
    }
    function attachProperties(tag, prop, z, accessor, attr, name) {
        var key = z.split(":"), type = key[0];
        if (type == "get") {
            key[0] = prop;
            tag.prototype[prop].get = xtag.applyPseudos(key.join(":"), accessor[z], tag.pseudos, accessor[z]);
        } else if (type == "set") {
            key[0] = prop;
            var setter = tag.prototype[prop].set = xtag.applyPseudos(key.join(":"), attr ? function(value) {
                this.xtag._skipSet = true;
                if (!this.xtag._skipAttr) modAttr(this, attr, name, value);
                if (this.xtag._skipAttr && attr.skip) delete this.xtag._skipAttr;
                accessor[z].call(this, attr.boolean ? !!value : value);
                updateView(this, name, value);
                delete this.xtag._skipSet;
            } : accessor[z] ? function(value) {
                accessor[z].call(this, value);
                updateView(this, name, value);
            } : null, tag.pseudos, accessor[z]);
            if (attr) attr.setter = setter;
        } else tag.prototype[prop][z] = accessor[z];
    }
    function parseAccessor(tag, prop) {
        tag.prototype[prop] = {};
        var accessor = tag.accessors[prop], attr = accessor.attribute, name = attr && attr.name ? attr.name.toLowerCase() : prop;
        if (attr) {
            attr.key = prop;
            tag.attributes[name] = attr;
        }
        for (var z in accessor) attachProperties(tag, prop, z, accessor, attr, name);
        if (attr) {
            if (!tag.prototype[prop].get) {
                var method = (attr.boolean ? "has" : "get") + "Attribute";
                tag.prototype[prop].get = function() {
                    return this[method](name);
                };
            }
            if (!tag.prototype[prop].set) tag.prototype[prop].set = function(value) {
                modAttr(this, attr, name, value);
                updateView(this, name, value);
            };
        }
    }
    var readyTags = {};
    function fireReady(name) {
        readyTags[name] = (readyTags[name] || []).filter(function(obj) {
            return (obj.tags = obj.tags.filter(function(z) {
                return z != name && !xtag.tags[z];
            })).length || obj.fn();
        });
    }
    var xtag = {
        tags: {},
        defaultOptions: {
            pseudos: [],
            mixins: [],
            events: {},
            methods: {},
            accessors: {},
            lifecycle: {},
            attributes: {},
            prototype: {
                xtag: {
                    get: function() {
                        return this.__xtag__ ? this.__xtag__ : this.__xtag__ = {
                            data: {}
                        };
                    }
                }
            }
        },
        register: function(name, options) {
            var _name;
            if (typeof name == "string") {
                _name = name.toLowerCase();
            } else {
                return;
            }
            var basePrototype = options.prototype;
            delete options.prototype;
            var tag = xtag.tags[_name] = applyMixins(xtag.merge({}, xtag.defaultOptions, options));
            for (var z in tag.events) tag.events[z] = xtag.parseEvent(z, tag.events[z]);
            for (z in tag.lifecycle) tag.lifecycle[z.split(":")[0]] = xtag.applyPseudos(z, tag.lifecycle[z], tag.pseudos, tag.lifecycle[z]);
            for (z in tag.methods) tag.prototype[z.split(":")[0]] = {
                value: xtag.applyPseudos(z, tag.methods[z], tag.pseudos, tag.methods[z]),
                enumerable: true,
                writable: true
            };
            for (z in tag.accessors) parseAccessor(tag, z);
            var ready = tag.lifecycle.created || tag.lifecycle.ready;
            tag.prototype.createdCallback = {
                enumerable: true,
                value: function() {
                    var element = this;
                    xtag.addEvents(this, tag.events);
                    tag.mixins.forEach(function(mixin) {
                    	var vMixin = xtag.mixins[mixin];
                    	if(!vMixin) throw "Mixin "+mixin+" not found for tag : " + _name;
                       if (vMixin.events) xtag.addEvents(element, vMixin.events);
                    });
                    var output = ready ? ready.apply(this, arguments) : null;
                    for (var name in tag.attributes) {
                        var attr = tag.attributes[name], hasAttr = this.hasAttribute(name);
                        if (hasAttr || attr.boolean) {
                            this[attr.key] = attr.boolean ? hasAttr : this.getAttribute(name);
                        }
                    }
                    tag.pseudos.forEach(function(obj) {
                        obj.onAdd.call(element, obj);
                    });
                    return output;
                }
            };
            var inserted = tag.lifecycle.inserted, removed = tag.lifecycle.removed;
            if (inserted || removed) {
                tag.prototype.attachedCallback = {
                    value: function() {
                        if (removed) this.xtag.__parentNode__ = this.parentNode;
                        if (inserted) return inserted.apply(this, arguments);
                    },
                    enumerable: true
                };
            }
            if (removed) {
                tag.prototype.detachedCallback = {
                    value: function() {
                        var args = toArray(arguments);
                        args.unshift(this.xtag.__parentNode__);
                        var output = removed.apply(this, args);
                        delete this.xtag.__parentNode__;
                        return output;
                    },
                    enumerable: true
                };
            }
            if (tag.lifecycle.attributeChanged) tag.prototype.attributeChangedCallback = {
                value: tag.lifecycle.attributeChanged,
                enumerable: true
            };
            var setAttribute = tag.prototype.setAttribute || HTMLElement.prototype.setAttribute;
            tag.prototype.setAttribute = {
                writable: true,
                enumberable: true,
                value: function(name, value) {
                    var attr = tag.attributes[name.toLowerCase()];
                    if (!this.xtag._skipAttr) setAttribute.call(this, name, attr && attr.boolean ? "" : value);
                    if (attr) {
                        if (attr.setter && !this.xtag._skipSet) {
                            this.xtag._skipAttr = true;
                            attr.setter.call(this, attr.boolean ? true : value);
                        }
                        value = attr.skip ? attr.boolean ? this.hasAttribute(name) : this.getAttribute(name) : value;
                        syncAttr(this, attr, name, attr.boolean ? "" : value, "setAttribute");
                    }
                    delete this.xtag._skipAttr;
                }
            };
            var removeAttribute = tag.prototype.removeAttribute || HTMLElement.prototype.removeAttribute;
            tag.prototype.removeAttribute = {
                writable: true,
                enumberable: true,
                value: function(name) {
                    var attr = tag.attributes[name.toLowerCase()];
                    if (!this.xtag._skipAttr) removeAttribute.call(this, name);
                    if (attr) {
                        if (attr.setter && !this.xtag._skipSet) {
                            this.xtag._skipAttr = true;
                            attr.setter.call(this, attr.boolean ? false : undefined);
                        }
                        syncAttr(this, attr, name, undefined, "removeAttribute");
                    }
                    delete this.xtag._skipAttr;
                }
            };
            var elementProto = basePrototype ? basePrototype : options["extends"] ? Object.create(doc.createElement(options["extends"]).constructor).prototype : win.HTMLElement.prototype;
            var definition = {
                prototype: Object.create(elementProto, tag.prototype)
            };
            if (options["extends"]) {
                definition["extends"] = options["extends"];
            }
            var reg = doc.registerElement(_name, definition);
            fireReady(_name);
            return reg;
        },
        ready: function(names, fn) {
            var obj = {
                tags: toArray(names),
                fn: fn
            };
            if (obj.tags.reduce(function(last, name) {
                if (xtag.tags[name]) return last;
                (readyTags[name] = readyTags[name] || []).push(obj);
            }, true)) fn();
        },
        mixins: {},
        prefix: prefix,
        captureEvents: [ "focus", "blur", "scroll", "underflow", "overflow", "overflowchanged", "DOMMouseScroll" ],
        customEvents: {
            overflow: createFlowEvent("over"),
            underflow: createFlowEvent("under"),
            animationstart: {
                attach: [ prefix.dom + "AnimationStart" ]
            },
            animationend: {
                attach: [ prefix.dom + "AnimationEnd" ]
            },
            transitionend: {
                attach: [ prefix.dom + "TransitionEnd" ]
            },
            move: {
                attach: [ "mousemove", "touchmove" ],
                condition: touchFilter
            },
            enter: {
                attach: [ "mouseover", "touchenter" ],
                condition: touchFilter
            },
            leave: {
                attach: [ "mouseout", "touchleave" ],
                condition: touchFilter
            },
            scrollwheel: {
                attach: [ "DOMMouseScroll", "mousewheel" ],
                condition: function(event) {
                    event.delta = event.wheelDelta ? event.wheelDelta / 40 : Math.round(event.detail / 3.5 * -1);
                    return true;
                }
            },
            tapstart: {
                observe: {
                    mousedown: doc,
                    touchstart: doc
                },
                condition: touchFilter
            },
            tapend: {
                observe: {
                    mouseup: doc,
                    touchend: doc
                },
                condition: touchFilter
            },
            tapmove: {
                attach: [ "tapstart", "dragend", "touchcancel" ],
                condition: function(event, custom) {
                    switch (event.type) {
                      case "move":
                        return true;

                      case "dragover":
                        var last = custom.lastDrag || {};
                        custom.lastDrag = event;
                        return last.pageX != event.pageX && last.pageY != event.pageY || null;

                      case "tapstart":
                        if (!custom.move) {
                            custom.current = this;
                            custom.move = xtag.addEvents(this, {
                                move: custom.listener,
                                dragover: custom.listener
                            });
                            custom.tapend = xtag.addEvent(doc, "tapend", custom.listener);
                        }
                        break;

                      case "tapend":
                      case "dragend":
                      case "touchcancel":
                        if (!event.touches.length) {
                            if (custom.move) xtag.removeEvents(custom.current, custom.move || {});
                            if (custom.tapend) xtag.removeEvent(doc, custom.tapend || {});
                            delete custom.lastDrag;
                            delete custom.current;
                            delete custom.tapend;
                            delete custom.move;
                        }
                    }
                }
            }
        },
        pseudos: {
            __mixin__: {},
            mixins: {
                onCompiled: function(fn, pseudo) {
                    var mixins = pseudo.source.__mixins__;
                    if (mixins) switch (pseudo.value) {
                      case "before":
                        return function() {
                            var self = this, args = arguments;
                            mixins.forEach(function(m) {
                                m.apply(self, args);
                            });
                            return fn.apply(self, args);
                        };

                      case "after":
                      case null:
                        return function() {
                            var self = this, args = arguments;
                            returns = fn.apply(self, args);
                            mixins.forEach(function(m) {
                                m.apply(self, args);
                            });
                            return returns;
                        };
                    }
                }
            },
            keypass: keypseudo,
            keyfail: keypseudo,
            delegate: {
                action: delegateAction
            },
            within: {
                action: delegateAction,
                onAdd: function(pseudo) {
                    var condition = pseudo.source.condition;
                    if (condition) pseudo.source.condition = function(event, custom) {
                        return xtag.query(this, pseudo.value).filter(function(node) {
                            return node == event.target || node.contains ? node.contains(event.target) : null;
                        })[0] ? condition.call(this, event, custom) : null;
                    };
                }
            },
            preventable: {
                action: function(pseudo, event) {
                    return !event.defaultPrevented;
                }
            }
        },
        clone: clone,
        typeOf: typeOf,
        toArray: toArray,
        wrap: function(original, fn) {
            return function() {
                var args = arguments, output = original.apply(this, args);
                fn.apply(this, args);
                return output;
            };
        },
        merge: function(source, k, v) {
            if (typeOf(k) == "string") return mergeOne(source, k, v);
            for (var i = 1, l = arguments.length; i < l; i++) {
                var object = arguments[i];
                for (var key in object) mergeOne(source, key, object[key]);
            }
            return source;
        },
        uid: function() {
            return Math.random().toString(36).substr(2, 10);
        },
        query: query,
        skipTransition: function(element, fn, bind) {
            var prop = prefix.js + "TransitionProperty";
            element.style[prop] = element.style.transitionProperty = "none";
            var callback = fn ? fn.call(bind) : null;
            return xtag.requestFrame(function() {
                xtag.requestFrame(function() {
                    element.style[prop] = element.style.transitionProperty = "";
                    if (callback) xtag.requestFrame(callback);
                });
            });
        },
        requestFrame: function() {
            var raf = win.requestAnimationFrame || win[prefix.lowercase + "RequestAnimationFrame"] || function(fn) {
                return win.setTimeout(fn, 20);
            };
            return function(fn) {
                return raf(fn);
            };
        }(),
        cancelFrame: function() {
            var cancel = win.cancelAnimationFrame || win[prefix.lowercase + "CancelAnimationFrame"] || win.clearTimeout;
            return function(id) {
                return cancel(id);
            };
        }(),
        matchSelector: function(element, selector) {
            return matchSelector.call(element, selector);
        },
        set: function(element, method, value) {
            element[method] = value;
            if (window.CustomElements) CustomElements.upgradeAll(element);
        },
        innerHTML: function(el, html) {
            xtag.set(el, "innerHTML", html);
        },
        hasClass: function(element, klass) {
            return element.className.split(" ").indexOf(klass.trim()) > -1;
        },
        addClass: function(element, klass) {
            var list = element.className.trim().split(" ");
            klass.trim().split(" ").forEach(function(name) {
                if (!~list.indexOf(name)) list.push(name);
            });
            element.className = list.join(" ").trim();
            return element;
        },
        removeClass: function(element, klass) {
            var classes = klass.trim().split(" ");
            element.className = element.className.trim().split(" ").filter(function(name) {
                return name && !~classes.indexOf(name);
            }).join(" ");
            return element;
        },
        toggleClass: function(element, klass) {
            return xtag[xtag.hasClass(element, klass) ? "removeClass" : "addClass"].call(null, element, klass);
        },
        queryChildren: function(element, selector) {
            var id = element.id, guid = element.id = id || "x_" + xtag.uid(), attr = "#" + guid + " > ", noParent = false;
            if (!element.parentNode) {
                noParent = true;
                container.appendChild(element);
            }
            selector = attr + (selector + "").replace(",", "," + attr, "g");
            var result = element.parentNode.querySelectorAll(selector);
            if (!id) element.removeAttribute("id");
            if (noParent) {
                container.removeChild(element);
            }
            return toArray(result);
        },
        createFragment: function(content) {
            var frag = doc.createDocumentFragment();
            if (content) {
                var div = frag.appendChild(doc.createElement("div")), nodes = toArray(content.nodeName ? arguments : !(div.innerHTML = content) || div.children), length = nodes.length, index = 0;
                while (index < length) frag.insertBefore(nodes[index++], div);
                frag.removeChild(div);
            }
            return frag;
        },
        manipulate: function(element, fn) {
            var next = element.nextSibling, parent = element.parentNode, frag = doc.createDocumentFragment(), returned = fn.call(frag.appendChild(element), frag) || element;
            if (next) parent.insertBefore(returned, next); else parent.appendChild(returned);
        },
        applyPseudos: function(key, fn, target, source) {
            var listener = fn, pseudos = {};
            if (key.match(":")) {
                var split = key.match(regexPseudoSplit), i = split.length;
                while (--i) {
                    split[i].replace(regexPseudoReplace, function(match, name, value) {
                        if (!xtag.pseudos[name]) throw "pseudo not found: " + name + " " + split;
                        value = value === "" || typeof value == "undefined" ? null : value;
                        var pseudo = pseudos[i] = Object.create(xtag.pseudos[name]);
                        pseudo.key = key;
                        pseudo.name = name;
                        pseudo.value = value;
                        pseudo["arguments"] = (value || "").split(",");
                        pseudo.action = pseudo.action || trueop;
                        pseudo.source = source;
                        var last = listener;
                        listener = function() {
                            var args = toArray(arguments), obj = {
                                key: key,
                                name: name,
                                value: value,
                                source: source,
                                arguments: pseudo["arguments"],
                                listener: last
                            };
                            var output = pseudo.action.apply(this, [ obj ].concat(args));
                            if (output === null || output === false) return output;
                            return obj.listener.apply(this, args.concat(this));
                        };
                        if (target && pseudo.onAdd) {
                            if (target.nodeName) pseudo.onAdd.call(target, pseudo); else target.push(pseudo);
                        }
                    });
                }
            }
            for (var z in pseudos) {
                if (pseudos[z].onCompiled) listener = pseudos[z].onCompiled(listener, pseudos[z]) || listener;
            }
            return listener;
        },
        removePseudos: function(target, pseudos) {
            pseudos.forEach(function(obj) {
                if (obj.onRemove) obj.onRemove.call(target, obj);
            });
        },
        parseEvent: function(type, fn) {
            var pseudos = type.split(":"), key = pseudos.shift(), custom = xtag.customEvents[key], event = xtag.merge({
                type: key,
                stack: noop,
                condition: trueop,
                attach: [],
                _attach: [],
                pseudos: "",
                _pseudos: [],
                onAdd: noop,
                onRemove: noop
            }, custom || {});
            event.attach = toArray(event.base || event.attach);
            event.chain = key + (event.pseudos.length ? ":" + event.pseudos : "") + (pseudos.length ? ":" + pseudos.join(":") : "");
            var condition = event.condition;
            event.condition = function(e) {
                var t = e.touches, tt = e.targetTouches;
                return condition.apply(this, arguments);
            };
            var stack = xtag.applyPseudos(event.chain, fn, event._pseudos, event);
            event.stack = function(e) {
                e.currentTarget = e.currentTarget || this;
                var t = e.touches, tt = e.targetTouches;
                var detail = e.detail || {};
                if (!detail.__stack__) return stack.apply(this, arguments); else if (detail.__stack__ == stack) {
                    e.stopPropagation();
                    e.cancelBubble = true;
                    return stack.apply(this, arguments);
                }
            };
            event.listener = function(e) {
                var args = toArray(arguments), output = event.condition.apply(this, args.concat([ event ]));
                if (!output) return output;
                if (e.type != key) {
                    xtag.fireEvent(e.target, key, {
                        baseEvent: e,
                        detail: output !== true && (output.__stack__ = stack) ? output : {
                            __stack__: stack
                        }
                    });
                } else return event.stack.apply(this, args);
            };
            event.attach.forEach(function(name) {
                event._attach.push(xtag.parseEvent(name, event.listener));
            });
            if (custom && custom.observe && !custom.__observing__) {
                custom.observer = function(e) {
                    var output = event.condition.apply(this, toArray(arguments).concat([ custom ]));
                    if (!output) return output;
                    xtag.fireEvent(e.target, key, {
                        baseEvent: e,
                        detail: output !== true ? output : {}
                    });
                };
                for (var z in custom.observe) xtag.addEvent(custom.observe[z] || document, z, custom.observer, true);
                custom.__observing__ = true;
            }
            return event;
        },
        addEvent: function(element, type, fn, capture) {
            var event = typeof fn == "function" ? xtag.parseEvent(type, fn) : fn;
            event._pseudos.forEach(function(obj) {
                obj.onAdd.call(element, obj);
            });
            event._attach.forEach(function(obj) {
                xtag.addEvent(element, obj.type, obj);
            });
            event.onAdd.call(element, event, event.listener);
            element.addEventListener(event.type, event.stack, capture || xtag.captureEvents.indexOf(event.type) > -1);
            return event;
        },
        addEvents: function(element, obj) {
            var events = {};
            for (var z in obj) {
                events[z] = xtag.addEvent(element, z, obj[z]);
            }
            return events;
        },
        removeEvent: function(element, type, event) {
            event = event || type;
            event.onRemove.call(element, event, event.listener);
            xtag.removePseudos(element, event._pseudos);
            event._attach.forEach(function(obj) {
                xtag.removeEvent(element, obj);
            });
            element.removeEventListener(event.type, event.stack);
        },
        removeEvents: function(element, obj) {
            for (var z in obj) xtag.removeEvent(element, obj[z]);
        },
        fireEvent: function(element, type, options, warn) {
            var event = doc.createEvent("CustomEvent");
            options = options || {};
            if (warn) console.warn("fireEvent has been modified");
            event.initCustomEvent(type, options.bubbles !== false, options.cancelable !== false, options.detail);
            if (options.baseEvent) inheritEvent(event, options.baseEvent);
            try {
                element.dispatchEvent(event);
            } catch (e) {
                console.warn("This error may have been caused by a change in the fireEvent method", e);
            }
        },
        addObserver: function(element, type, fn) {
            if (!element._records) {
                element._records = {
                    inserted: [],
                    removed: []
                };
                if (mutation) {
                    element._observer = new mutation(function(mutations) {
                        parseMutations(element, mutations);
                    });
                    element._observer.observe(element, {
                        subtree: true,
                        childList: true,
                        attributes: !true,
                        characterData: false
                    });
                } else [ "Inserted", "Removed" ].forEach(function(type) {
                    element.addEventListener("DOMNode" + type, function(event) {
                        event._mutation = true;
                        element._records[type.toLowerCase()].forEach(function(fn) {
                            fn(event.target, event);
                        });
                    }, false);
                });
            }
            if (element._records[type].indexOf(fn) == -1) element._records[type].push(fn);
        },
        removeObserver: function(element, type, fn) {
            var obj = element._records;
            if (obj && fn) {
                obj[type].splice(obj[type].indexOf(fn), 1);
            } else {
                obj[type] = [];
            }
        }
    };
    var touching = false, touchTarget = null;
    doc.addEventListener("mousedown", function(e) {
        touching = true;
        touchTarget = e.target;
    }, true);
    doc.addEventListener("mouseup", function() {
        touching = false;
        touchTarget = null;
    }, true);
    doc.addEventListener("dragend", function() {
        touching = false;
        touchTarget = null;
    }, true);
    var UIEventProto = {
        touches: {
            configurable: true,
            get: function() {
                return this.__touches__ || (this.identifier = 0) || (this.__touches__ = touching ? [ this ] : []);
            }
        },
        targetTouches: {
            configurable: true,
            get: function() {
                return this.__targetTouches__ || (this.__targetTouches__ = touching && this.currentTarget && (this.currentTarget == touchTarget || this.currentTarget.contains && this.currentTarget.contains(touchTarget)) ? (this.identifier = 0) || [ this ] : []);
            }
        },
        changedTouches: {
            configurable: true,
            get: function() {
                return this.__changedTouches__ || (this.identifier = 0) || (this.__changedTouches__ = [ this ]);
            }
        }
    };
    for (z in UIEventProto) {
        UIEvent.prototype[z] = UIEventProto[z];
        Object.defineProperty(UIEvent.prototype, z, UIEventProto[z]);
    }
    function addTap(el, tap, e) {
        if (!el.__tap__) {
            el.__tap__ = {
                click: e.type == "mousedown"
            };
            if (el.__tap__.click) el.addEventListener("click", tap.observer); else {
                el.__tap__.scroll = tap.observer.bind(el);
                window.addEventListener("scroll", el.__tap__.scroll, true);
                el.addEventListener("touchmove", tap.observer);
                el.addEventListener("touchcancel", tap.observer);
                el.addEventListener("touchend", tap.observer);
            }
        }
        if (!el.__tap__.click) {
            el.__tap__.x = e.touches[0].pageX;
            el.__tap__.y = e.touches[0].pageY;
        }
    }
    function removeTap(el, tap) {
        if (el.__tap__) {
            if (el.__tap__.click) el.removeEventListener("click", tap.observer); else {
                window.removeEventListener("scroll", el.__tap__.scroll, true);
                el.removeEventListener("touchmove", tap.observer);
                el.removeEventListener("touchcancel", tap.observer);
                el.removeEventListener("touchend", tap.observer);
            }
            delete el.__tap__;
        }
    }
    function checkTapPosition(el, tap, e) {
        var touch = e.changedTouches[0], tol = tap.gesture.tolerance;
        if (touch.pageX < el.__tap__.x + tol && touch.pageX > el.__tap__.x - tol && touch.pageY < el.__tap__.y + tol && touch.pageY > el.__tap__.y - tol) return true;
    }
    xtag.customEvents.tap = {
        observe: {
            mousedown: document,
            touchstart: document
        },
        gesture: {
            tolerance: 8
        },
        condition: function(e, tap) {
            var el = e.target;
            switch (e.type) {
              case "touchstart":
                if (el.__tap__ && el.__tap__.click) removeTap(el, tap);
                addTap(el, tap, e);
                return;

              case "mousedown":
                if (!el.__tap__) addTap(el, tap, e);
                return;

              case "scroll":
              case "touchcancel":
                removeTap(this, tap);
                return;

              case "touchmove":
              case "touchend":
                if (this.__tap__ && !checkTapPosition(this, tap, e)) {
                    removeTap(this, tap);
                    return;
                }
                return e.type == "touchend" || null;

              case "click":
                removeTap(this, tap);
                return true;
            }
        }
    };
    win.xtag = xtag;
    if (typeof define == "function" && define.amd) define(xtag);
    doc.addEventListener("WebComponentsReady", function() {
        xtag.fireEvent(doc.body, "DOMComponentsLoaded");
    });
})();
