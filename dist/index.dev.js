var markerClusterer = (function (exports) {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var esnext_iterator_constructor = {};

	var es_iterator_constructor = {};

	var globalThis_1;
	var hasRequiredGlobalThis;
	function requireGlobalThis() {
	  if (hasRequiredGlobalThis) return globalThis_1;
	  hasRequiredGlobalThis = 1;
	  var check = function (it) {
	    return it && it.Math === Math && it;
	  };

	  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	  globalThis_1 =
	  // eslint-disable-next-line es/no-global-this -- safe
	  check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) ||
	  // eslint-disable-next-line no-restricted-globals -- safe
	  check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || check(typeof globalThis_1 == 'object' && globalThis_1) ||
	  // eslint-disable-next-line no-new-func -- fallback
	  function () {
	    return this;
	  }() || Function('return this')();
	  return globalThis_1;
	}

	var objectGetOwnPropertyDescriptor = {};

	var fails;
	var hasRequiredFails;
	function requireFails() {
	  if (hasRequiredFails) return fails;
	  hasRequiredFails = 1;
	  fails = function (exec) {
	    try {
	      return !!exec();
	    } catch (error) {
	      return true;
	    }
	  };
	  return fails;
	}

	var descriptors;
	var hasRequiredDescriptors;
	function requireDescriptors() {
	  if (hasRequiredDescriptors) return descriptors;
	  hasRequiredDescriptors = 1;
	  var fails = requireFails();

	  // Detect IE8's incomplete defineProperty implementation
	  descriptors = !fails(function () {
	    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	    return Object.defineProperty({}, 1, {
	      get: function () {
	        return 7;
	      }
	    })[1] !== 7;
	  });
	  return descriptors;
	}

	var functionBindNative;
	var hasRequiredFunctionBindNative;
	function requireFunctionBindNative() {
	  if (hasRequiredFunctionBindNative) return functionBindNative;
	  hasRequiredFunctionBindNative = 1;
	  var fails = requireFails();
	  functionBindNative = !fails(function () {
	    // eslint-disable-next-line es/no-function-prototype-bind -- safe
	    var test = function () {/* empty */}.bind();
	    // eslint-disable-next-line no-prototype-builtins -- safe
	    return typeof test != 'function' || test.hasOwnProperty('prototype');
	  });
	  return functionBindNative;
	}

	var functionCall;
	var hasRequiredFunctionCall;
	function requireFunctionCall() {
	  if (hasRequiredFunctionCall) return functionCall;
	  hasRequiredFunctionCall = 1;
	  var NATIVE_BIND = requireFunctionBindNative();
	  var call = Function.prototype.call;
	  // eslint-disable-next-line es/no-function-prototype-bind -- safe
	  functionCall = NATIVE_BIND ? call.bind(call) : function () {
	    return call.apply(call, arguments);
	  };
	  return functionCall;
	}

	var objectPropertyIsEnumerable = {};

	var hasRequiredObjectPropertyIsEnumerable;
	function requireObjectPropertyIsEnumerable() {
	  if (hasRequiredObjectPropertyIsEnumerable) return objectPropertyIsEnumerable;
	  hasRequiredObjectPropertyIsEnumerable = 1;
	  var $propertyIsEnumerable = {}.propertyIsEnumerable;
	  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	  // Nashorn ~ JDK8 bug
	  var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({
	    1: 2
	  }, 1);

	  // `Object.prototype.propertyIsEnumerable` method implementation
	  // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
	  objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	    var descriptor = getOwnPropertyDescriptor(this, V);
	    return !!descriptor && descriptor.enumerable;
	  } : $propertyIsEnumerable;
	  return objectPropertyIsEnumerable;
	}

	var createPropertyDescriptor;
	var hasRequiredCreatePropertyDescriptor;
	function requireCreatePropertyDescriptor() {
	  if (hasRequiredCreatePropertyDescriptor) return createPropertyDescriptor;
	  hasRequiredCreatePropertyDescriptor = 1;
	  createPropertyDescriptor = function (bitmap, value) {
	    return {
	      enumerable: !(bitmap & 1),
	      configurable: !(bitmap & 2),
	      writable: !(bitmap & 4),
	      value: value
	    };
	  };
	  return createPropertyDescriptor;
	}

	var functionUncurryThis;
	var hasRequiredFunctionUncurryThis;
	function requireFunctionUncurryThis() {
	  if (hasRequiredFunctionUncurryThis) return functionUncurryThis;
	  hasRequiredFunctionUncurryThis = 1;
	  var NATIVE_BIND = requireFunctionBindNative();
	  var FunctionPrototype = Function.prototype;
	  var call = FunctionPrototype.call;
	  // eslint-disable-next-line es/no-function-prototype-bind -- safe
	  var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);
	  functionUncurryThis = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
	    return function () {
	      return call.apply(fn, arguments);
	    };
	  };
	  return functionUncurryThis;
	}

	var classofRaw;
	var hasRequiredClassofRaw;
	function requireClassofRaw() {
	  if (hasRequiredClassofRaw) return classofRaw;
	  hasRequiredClassofRaw = 1;
	  var uncurryThis = requireFunctionUncurryThis();
	  var toString = uncurryThis({}.toString);
	  var stringSlice = uncurryThis(''.slice);
	  classofRaw = function (it) {
	    return stringSlice(toString(it), 8, -1);
	  };
	  return classofRaw;
	}

	var indexedObject;
	var hasRequiredIndexedObject;
	function requireIndexedObject() {
	  if (hasRequiredIndexedObject) return indexedObject;
	  hasRequiredIndexedObject = 1;
	  var uncurryThis = requireFunctionUncurryThis();
	  var fails = requireFails();
	  var classof = requireClassofRaw();
	  var $Object = Object;
	  var split = uncurryThis(''.split);

	  // fallback for non-array-like ES3 and non-enumerable old V8 strings
	  indexedObject = fails(function () {
	    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	    // eslint-disable-next-line no-prototype-builtins -- safe
	    return !$Object('z').propertyIsEnumerable(0);
	  }) ? function (it) {
	    return classof(it) === 'String' ? split(it, '') : $Object(it);
	  } : $Object;
	  return indexedObject;
	}

	var isNullOrUndefined;
	var hasRequiredIsNullOrUndefined;
	function requireIsNullOrUndefined() {
	  if (hasRequiredIsNullOrUndefined) return isNullOrUndefined;
	  hasRequiredIsNullOrUndefined = 1;
	  // we can't use just `it == null` since of `document.all` special case
	  // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
	  isNullOrUndefined = function (it) {
	    return it === null || it === undefined;
	  };
	  return isNullOrUndefined;
	}

	var requireObjectCoercible;
	var hasRequiredRequireObjectCoercible;
	function requireRequireObjectCoercible() {
	  if (hasRequiredRequireObjectCoercible) return requireObjectCoercible;
	  hasRequiredRequireObjectCoercible = 1;
	  var isNullOrUndefined = requireIsNullOrUndefined();
	  var $TypeError = TypeError;

	  // `RequireObjectCoercible` abstract operation
	  // https://tc39.es/ecma262/#sec-requireobjectcoercible
	  requireObjectCoercible = function (it) {
	    if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
	    return it;
	  };
	  return requireObjectCoercible;
	}

	var toIndexedObject;
	var hasRequiredToIndexedObject;
	function requireToIndexedObject() {
	  if (hasRequiredToIndexedObject) return toIndexedObject;
	  hasRequiredToIndexedObject = 1;
	  // toObject with fallback for non-array-like ES3 strings
	  var IndexedObject = requireIndexedObject();
	  var requireObjectCoercible = requireRequireObjectCoercible();
	  toIndexedObject = function (it) {
	    return IndexedObject(requireObjectCoercible(it));
	  };
	  return toIndexedObject;
	}

	var isCallable;
	var hasRequiredIsCallable;
	function requireIsCallable() {
	  if (hasRequiredIsCallable) return isCallable;
	  hasRequiredIsCallable = 1;
	  // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
	  var documentAll = typeof document == 'object' && document.all;

	  // `IsCallable` abstract operation
	  // https://tc39.es/ecma262/#sec-iscallable
	  // eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
	  isCallable = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
	    return typeof argument == 'function' || argument === documentAll;
	  } : function (argument) {
	    return typeof argument == 'function';
	  };
	  return isCallable;
	}

	var isObject;
	var hasRequiredIsObject;
	function requireIsObject() {
	  if (hasRequiredIsObject) return isObject;
	  hasRequiredIsObject = 1;
	  var isCallable = requireIsCallable();
	  isObject = function (it) {
	    return typeof it == 'object' ? it !== null : isCallable(it);
	  };
	  return isObject;
	}

	var getBuiltIn;
	var hasRequiredGetBuiltIn;
	function requireGetBuiltIn() {
	  if (hasRequiredGetBuiltIn) return getBuiltIn;
	  hasRequiredGetBuiltIn = 1;
	  var globalThis = requireGlobalThis();
	  var isCallable = requireIsCallable();
	  var aFunction = function (argument) {
	    return isCallable(argument) ? argument : undefined;
	  };
	  getBuiltIn = function (namespace, method) {
	    return arguments.length < 2 ? aFunction(globalThis[namespace]) : globalThis[namespace] && globalThis[namespace][method];
	  };
	  return getBuiltIn;
	}

	var objectIsPrototypeOf;
	var hasRequiredObjectIsPrototypeOf;
	function requireObjectIsPrototypeOf() {
	  if (hasRequiredObjectIsPrototypeOf) return objectIsPrototypeOf;
	  hasRequiredObjectIsPrototypeOf = 1;
	  var uncurryThis = requireFunctionUncurryThis();
	  objectIsPrototypeOf = uncurryThis({}.isPrototypeOf);
	  return objectIsPrototypeOf;
	}

	var environmentUserAgent;
	var hasRequiredEnvironmentUserAgent;
	function requireEnvironmentUserAgent() {
	  if (hasRequiredEnvironmentUserAgent) return environmentUserAgent;
	  hasRequiredEnvironmentUserAgent = 1;
	  var globalThis = requireGlobalThis();
	  var navigator = globalThis.navigator;
	  var userAgent = navigator && navigator.userAgent;
	  environmentUserAgent = userAgent ? String(userAgent) : '';
	  return environmentUserAgent;
	}

	var environmentV8Version;
	var hasRequiredEnvironmentV8Version;
	function requireEnvironmentV8Version() {
	  if (hasRequiredEnvironmentV8Version) return environmentV8Version;
	  hasRequiredEnvironmentV8Version = 1;
	  var globalThis = requireGlobalThis();
	  var userAgent = requireEnvironmentUserAgent();
	  var process = globalThis.process;
	  var Deno = globalThis.Deno;
	  var versions = process && process.versions || Deno && Deno.version;
	  var v8 = versions && versions.v8;
	  var match, version;
	  if (v8) {
	    match = v8.split('.');
	    // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	    // but their correct versions are not interesting for us
	    version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	  }

	  // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	  // so check `userAgent` even if `.v8` exists, but 0
	  if (!version && userAgent) {
	    match = userAgent.match(/Edge\/(\d+)/);
	    if (!match || match[1] >= 74) {
	      match = userAgent.match(/Chrome\/(\d+)/);
	      if (match) version = +match[1];
	    }
	  }
	  environmentV8Version = version;
	  return environmentV8Version;
	}

	var symbolConstructorDetection;
	var hasRequiredSymbolConstructorDetection;
	function requireSymbolConstructorDetection() {
	  if (hasRequiredSymbolConstructorDetection) return symbolConstructorDetection;
	  hasRequiredSymbolConstructorDetection = 1;
	  /* eslint-disable es/no-symbol -- required for testing */
	  var V8_VERSION = requireEnvironmentV8Version();
	  var fails = requireFails();
	  var globalThis = requireGlobalThis();
	  var $String = globalThis.String;

	  // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
	  symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails(function () {
	    var symbol = Symbol('symbol detection');
	    // Chrome 38 Symbol has incorrect toString conversion
	    // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
	    // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
	    // of course, fail.
	    return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
	    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
	  });
	  return symbolConstructorDetection;
	}

	var useSymbolAsUid;
	var hasRequiredUseSymbolAsUid;
	function requireUseSymbolAsUid() {
	  if (hasRequiredUseSymbolAsUid) return useSymbolAsUid;
	  hasRequiredUseSymbolAsUid = 1;
	  /* eslint-disable es/no-symbol -- required for testing */
	  var NATIVE_SYMBOL = requireSymbolConstructorDetection();
	  useSymbolAsUid = NATIVE_SYMBOL && !Symbol.sham && typeof Symbol.iterator == 'symbol';
	  return useSymbolAsUid;
	}

	var isSymbol;
	var hasRequiredIsSymbol;
	function requireIsSymbol() {
	  if (hasRequiredIsSymbol) return isSymbol;
	  hasRequiredIsSymbol = 1;
	  var getBuiltIn = requireGetBuiltIn();
	  var isCallable = requireIsCallable();
	  var isPrototypeOf = requireObjectIsPrototypeOf();
	  var USE_SYMBOL_AS_UID = requireUseSymbolAsUid();
	  var $Object = Object;
	  isSymbol = USE_SYMBOL_AS_UID ? function (it) {
	    return typeof it == 'symbol';
	  } : function (it) {
	    var $Symbol = getBuiltIn('Symbol');
	    return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
	  };
	  return isSymbol;
	}

	var tryToString;
	var hasRequiredTryToString;
	function requireTryToString() {
	  if (hasRequiredTryToString) return tryToString;
	  hasRequiredTryToString = 1;
	  var $String = String;
	  tryToString = function (argument) {
	    try {
	      return $String(argument);
	    } catch (error) {
	      return 'Object';
	    }
	  };
	  return tryToString;
	}

	var aCallable;
	var hasRequiredACallable;
	function requireACallable() {
	  if (hasRequiredACallable) return aCallable;
	  hasRequiredACallable = 1;
	  var isCallable = requireIsCallable();
	  var tryToString = requireTryToString();
	  var $TypeError = TypeError;

	  // `Assert: IsCallable(argument) is true`
	  aCallable = function (argument) {
	    if (isCallable(argument)) return argument;
	    throw new $TypeError(tryToString(argument) + ' is not a function');
	  };
	  return aCallable;
	}

	var getMethod;
	var hasRequiredGetMethod;
	function requireGetMethod() {
	  if (hasRequiredGetMethod) return getMethod;
	  hasRequiredGetMethod = 1;
	  var aCallable = requireACallable();
	  var isNullOrUndefined = requireIsNullOrUndefined();

	  // `GetMethod` abstract operation
	  // https://tc39.es/ecma262/#sec-getmethod
	  getMethod = function (V, P) {
	    var func = V[P];
	    return isNullOrUndefined(func) ? undefined : aCallable(func);
	  };
	  return getMethod;
	}

	var ordinaryToPrimitive;
	var hasRequiredOrdinaryToPrimitive;
	function requireOrdinaryToPrimitive() {
	  if (hasRequiredOrdinaryToPrimitive) return ordinaryToPrimitive;
	  hasRequiredOrdinaryToPrimitive = 1;
	  var call = requireFunctionCall();
	  var isCallable = requireIsCallable();
	  var isObject = requireIsObject();
	  var $TypeError = TypeError;

	  // `OrdinaryToPrimitive` abstract operation
	  // https://tc39.es/ecma262/#sec-ordinarytoprimitive
	  ordinaryToPrimitive = function (input, pref) {
	    var fn, val;
	    if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
	    if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
	    if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
	    throw new $TypeError("Can't convert object to primitive value");
	  };
	  return ordinaryToPrimitive;
	}

	var sharedStore = {exports: {}};

	var isPure;
	var hasRequiredIsPure;
	function requireIsPure() {
	  if (hasRequiredIsPure) return isPure;
	  hasRequiredIsPure = 1;
	  isPure = false;
	  return isPure;
	}

	var defineGlobalProperty;
	var hasRequiredDefineGlobalProperty;
	function requireDefineGlobalProperty() {
	  if (hasRequiredDefineGlobalProperty) return defineGlobalProperty;
	  hasRequiredDefineGlobalProperty = 1;
	  var globalThis = requireGlobalThis();

	  // eslint-disable-next-line es/no-object-defineproperty -- safe
	  var defineProperty = Object.defineProperty;
	  defineGlobalProperty = function (key, value) {
	    try {
	      defineProperty(globalThis, key, {
	        value: value,
	        configurable: true,
	        writable: true
	      });
	    } catch (error) {
	      globalThis[key] = value;
	    }
	    return value;
	  };
	  return defineGlobalProperty;
	}

	var hasRequiredSharedStore;
	function requireSharedStore() {
	  if (hasRequiredSharedStore) return sharedStore.exports;
	  hasRequiredSharedStore = 1;
	  var IS_PURE = requireIsPure();
	  var globalThis = requireGlobalThis();
	  var defineGlobalProperty = requireDefineGlobalProperty();
	  var SHARED = '__core-js_shared__';
	  var store = sharedStore.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});
	  (store.versions || (store.versions = [])).push({
	    version: '3.44.0',
	    mode: IS_PURE ? 'pure' : 'global',
	    copyright: '© 2014-2025 Denis Pushkarev (zloirock.ru)',
	    license: 'https://github.com/zloirock/core-js/blob/v3.44.0/LICENSE',
	    source: 'https://github.com/zloirock/core-js'
	  });
	  return sharedStore.exports;
	}

	var shared;
	var hasRequiredShared;
	function requireShared() {
	  if (hasRequiredShared) return shared;
	  hasRequiredShared = 1;
	  var store = requireSharedStore();
	  shared = function (key, value) {
	    return store[key] || (store[key] = value || {});
	  };
	  return shared;
	}

	var toObject;
	var hasRequiredToObject;
	function requireToObject() {
	  if (hasRequiredToObject) return toObject;
	  hasRequiredToObject = 1;
	  var requireObjectCoercible = requireRequireObjectCoercible();
	  var $Object = Object;

	  // `ToObject` abstract operation
	  // https://tc39.es/ecma262/#sec-toobject
	  toObject = function (argument) {
	    return $Object(requireObjectCoercible(argument));
	  };
	  return toObject;
	}

	var hasOwnProperty_1;
	var hasRequiredHasOwnProperty;
	function requireHasOwnProperty() {
	  if (hasRequiredHasOwnProperty) return hasOwnProperty_1;
	  hasRequiredHasOwnProperty = 1;
	  var uncurryThis = requireFunctionUncurryThis();
	  var toObject = requireToObject();
	  var hasOwnProperty = uncurryThis({}.hasOwnProperty);

	  // `HasOwnProperty` abstract operation
	  // https://tc39.es/ecma262/#sec-hasownproperty
	  // eslint-disable-next-line es/no-object-hasown -- safe
	  hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	    return hasOwnProperty(toObject(it), key);
	  };
	  return hasOwnProperty_1;
	}

	var uid;
	var hasRequiredUid;
	function requireUid() {
	  if (hasRequiredUid) return uid;
	  hasRequiredUid = 1;
	  var uncurryThis = requireFunctionUncurryThis();
	  var id = 0;
	  var postfix = Math.random();
	  var toString = uncurryThis(1.1.toString);
	  uid = function (key) {
	    return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
	  };
	  return uid;
	}

	var wellKnownSymbol;
	var hasRequiredWellKnownSymbol;
	function requireWellKnownSymbol() {
	  if (hasRequiredWellKnownSymbol) return wellKnownSymbol;
	  hasRequiredWellKnownSymbol = 1;
	  var globalThis = requireGlobalThis();
	  var shared = requireShared();
	  var hasOwn = requireHasOwnProperty();
	  var uid = requireUid();
	  var NATIVE_SYMBOL = requireSymbolConstructorDetection();
	  var USE_SYMBOL_AS_UID = requireUseSymbolAsUid();
	  var Symbol = globalThis.Symbol;
	  var WellKnownSymbolsStore = shared('wks');
	  var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;
	  wellKnownSymbol = function (name) {
	    if (!hasOwn(WellKnownSymbolsStore, name)) {
	      WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name) ? Symbol[name] : createWellKnownSymbol('Symbol.' + name);
	    }
	    return WellKnownSymbolsStore[name];
	  };
	  return wellKnownSymbol;
	}

	var toPrimitive;
	var hasRequiredToPrimitive;
	function requireToPrimitive() {
	  if (hasRequiredToPrimitive) return toPrimitive;
	  hasRequiredToPrimitive = 1;
	  var call = requireFunctionCall();
	  var isObject = requireIsObject();
	  var isSymbol = requireIsSymbol();
	  var getMethod = requireGetMethod();
	  var ordinaryToPrimitive = requireOrdinaryToPrimitive();
	  var wellKnownSymbol = requireWellKnownSymbol();
	  var $TypeError = TypeError;
	  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

	  // `ToPrimitive` abstract operation
	  // https://tc39.es/ecma262/#sec-toprimitive
	  toPrimitive = function (input, pref) {
	    if (!isObject(input) || isSymbol(input)) return input;
	    var exoticToPrim = getMethod(input, TO_PRIMITIVE);
	    var result;
	    if (exoticToPrim) {
	      if (pref === undefined) pref = 'default';
	      result = call(exoticToPrim, input, pref);
	      if (!isObject(result) || isSymbol(result)) return result;
	      throw new $TypeError("Can't convert object to primitive value");
	    }
	    if (pref === undefined) pref = 'number';
	    return ordinaryToPrimitive(input, pref);
	  };
	  return toPrimitive;
	}

	var toPropertyKey;
	var hasRequiredToPropertyKey;
	function requireToPropertyKey() {
	  if (hasRequiredToPropertyKey) return toPropertyKey;
	  hasRequiredToPropertyKey = 1;
	  var toPrimitive = requireToPrimitive();
	  var isSymbol = requireIsSymbol();

	  // `ToPropertyKey` abstract operation
	  // https://tc39.es/ecma262/#sec-topropertykey
	  toPropertyKey = function (argument) {
	    var key = toPrimitive(argument, 'string');
	    return isSymbol(key) ? key : key + '';
	  };
	  return toPropertyKey;
	}

	var documentCreateElement;
	var hasRequiredDocumentCreateElement;
	function requireDocumentCreateElement() {
	  if (hasRequiredDocumentCreateElement) return documentCreateElement;
	  hasRequiredDocumentCreateElement = 1;
	  var globalThis = requireGlobalThis();
	  var isObject = requireIsObject();
	  var document = globalThis.document;
	  // typeof document.createElement is 'object' in old IE
	  var EXISTS = isObject(document) && isObject(document.createElement);
	  documentCreateElement = function (it) {
	    return EXISTS ? document.createElement(it) : {};
	  };
	  return documentCreateElement;
	}

	var ie8DomDefine;
	var hasRequiredIe8DomDefine;
	function requireIe8DomDefine() {
	  if (hasRequiredIe8DomDefine) return ie8DomDefine;
	  hasRequiredIe8DomDefine = 1;
	  var DESCRIPTORS = requireDescriptors();
	  var fails = requireFails();
	  var createElement = requireDocumentCreateElement();

	  // Thanks to IE8 for its funny defineProperty
	  ie8DomDefine = !DESCRIPTORS && !fails(function () {
	    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	    return Object.defineProperty(createElement('div'), 'a', {
	      get: function () {
	        return 7;
	      }
	    }).a !== 7;
	  });
	  return ie8DomDefine;
	}

	var hasRequiredObjectGetOwnPropertyDescriptor;
	function requireObjectGetOwnPropertyDescriptor() {
	  if (hasRequiredObjectGetOwnPropertyDescriptor) return objectGetOwnPropertyDescriptor;
	  hasRequiredObjectGetOwnPropertyDescriptor = 1;
	  var DESCRIPTORS = requireDescriptors();
	  var call = requireFunctionCall();
	  var propertyIsEnumerableModule = requireObjectPropertyIsEnumerable();
	  var createPropertyDescriptor = requireCreatePropertyDescriptor();
	  var toIndexedObject = requireToIndexedObject();
	  var toPropertyKey = requireToPropertyKey();
	  var hasOwn = requireHasOwnProperty();
	  var IE8_DOM_DEFINE = requireIe8DomDefine();

	  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	  objectGetOwnPropertyDescriptor.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	    O = toIndexedObject(O);
	    P = toPropertyKey(P);
	    if (IE8_DOM_DEFINE) try {
	      return $getOwnPropertyDescriptor(O, P);
	    } catch (error) {/* empty */}
	    if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
	  };
	  return objectGetOwnPropertyDescriptor;
	}

	var objectDefineProperty = {};

	var v8PrototypeDefineBug;
	var hasRequiredV8PrototypeDefineBug;
	function requireV8PrototypeDefineBug() {
	  if (hasRequiredV8PrototypeDefineBug) return v8PrototypeDefineBug;
	  hasRequiredV8PrototypeDefineBug = 1;
	  var DESCRIPTORS = requireDescriptors();
	  var fails = requireFails();

	  // V8 ~ Chrome 36-
	  // https://bugs.chromium.org/p/v8/issues/detail?id=3334
	  v8PrototypeDefineBug = DESCRIPTORS && fails(function () {
	    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	    return Object.defineProperty(function () {/* empty */}, 'prototype', {
	      value: 42,
	      writable: false
	    }).prototype !== 42;
	  });
	  return v8PrototypeDefineBug;
	}

	var anObject;
	var hasRequiredAnObject;
	function requireAnObject() {
	  if (hasRequiredAnObject) return anObject;
	  hasRequiredAnObject = 1;
	  var isObject = requireIsObject();
	  var $String = String;
	  var $TypeError = TypeError;

	  // `Assert: Type(argument) is Object`
	  anObject = function (argument) {
	    if (isObject(argument)) return argument;
	    throw new $TypeError($String(argument) + ' is not an object');
	  };
	  return anObject;
	}

	var hasRequiredObjectDefineProperty;
	function requireObjectDefineProperty() {
	  if (hasRequiredObjectDefineProperty) return objectDefineProperty;
	  hasRequiredObjectDefineProperty = 1;
	  var DESCRIPTORS = requireDescriptors();
	  var IE8_DOM_DEFINE = requireIe8DomDefine();
	  var V8_PROTOTYPE_DEFINE_BUG = requireV8PrototypeDefineBug();
	  var anObject = requireAnObject();
	  var toPropertyKey = requireToPropertyKey();
	  var $TypeError = TypeError;
	  // eslint-disable-next-line es/no-object-defineproperty -- safe
	  var $defineProperty = Object.defineProperty;
	  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	  var ENUMERABLE = 'enumerable';
	  var CONFIGURABLE = 'configurable';
	  var WRITABLE = 'writable';

	  // `Object.defineProperty` method
	  // https://tc39.es/ecma262/#sec-object.defineproperty
	  objectDefineProperty.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
	    anObject(O);
	    P = toPropertyKey(P);
	    anObject(Attributes);
	    if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
	      var current = $getOwnPropertyDescriptor(O, P);
	      if (current && current[WRITABLE]) {
	        O[P] = Attributes.value;
	        Attributes = {
	          configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
	          enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
	          writable: false
	        };
	      }
	    }
	    return $defineProperty(O, P, Attributes);
	  } : $defineProperty : function defineProperty(O, P, Attributes) {
	    anObject(O);
	    P = toPropertyKey(P);
	    anObject(Attributes);
	    if (IE8_DOM_DEFINE) try {
	      return $defineProperty(O, P, Attributes);
	    } catch (error) {/* empty */}
	    if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
	    if ('value' in Attributes) O[P] = Attributes.value;
	    return O;
	  };
	  return objectDefineProperty;
	}

	var createNonEnumerableProperty;
	var hasRequiredCreateNonEnumerableProperty;
	function requireCreateNonEnumerableProperty() {
	  if (hasRequiredCreateNonEnumerableProperty) return createNonEnumerableProperty;
	  hasRequiredCreateNonEnumerableProperty = 1;
	  var DESCRIPTORS = requireDescriptors();
	  var definePropertyModule = requireObjectDefineProperty();
	  var createPropertyDescriptor = requireCreatePropertyDescriptor();
	  createNonEnumerableProperty = DESCRIPTORS ? function (object, key, value) {
	    return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
	  } : function (object, key, value) {
	    object[key] = value;
	    return object;
	  };
	  return createNonEnumerableProperty;
	}

	var makeBuiltIn = {exports: {}};

	var functionName;
	var hasRequiredFunctionName;
	function requireFunctionName() {
	  if (hasRequiredFunctionName) return functionName;
	  hasRequiredFunctionName = 1;
	  var DESCRIPTORS = requireDescriptors();
	  var hasOwn = requireHasOwnProperty();
	  var FunctionPrototype = Function.prototype;
	  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	  var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;
	  var EXISTS = hasOwn(FunctionPrototype, 'name');
	  // additional protection from minified / mangled / dropped function names
	  var PROPER = EXISTS && function something() {/* empty */}.name === 'something';
	  var CONFIGURABLE = EXISTS && (!DESCRIPTORS || DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable);
	  functionName = {
	    EXISTS: EXISTS,
	    PROPER: PROPER,
	    CONFIGURABLE: CONFIGURABLE
	  };
	  return functionName;
	}

	var inspectSource;
	var hasRequiredInspectSource;
	function requireInspectSource() {
	  if (hasRequiredInspectSource) return inspectSource;
	  hasRequiredInspectSource = 1;
	  var uncurryThis = requireFunctionUncurryThis();
	  var isCallable = requireIsCallable();
	  var store = requireSharedStore();
	  var functionToString = uncurryThis(Function.toString);

	  // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
	  if (!isCallable(store.inspectSource)) {
	    store.inspectSource = function (it) {
	      return functionToString(it);
	    };
	  }
	  inspectSource = store.inspectSource;
	  return inspectSource;
	}

	var weakMapBasicDetection;
	var hasRequiredWeakMapBasicDetection;
	function requireWeakMapBasicDetection() {
	  if (hasRequiredWeakMapBasicDetection) return weakMapBasicDetection;
	  hasRequiredWeakMapBasicDetection = 1;
	  var globalThis = requireGlobalThis();
	  var isCallable = requireIsCallable();
	  var WeakMap = globalThis.WeakMap;
	  weakMapBasicDetection = isCallable(WeakMap) && /native code/.test(String(WeakMap));
	  return weakMapBasicDetection;
	}

	var sharedKey;
	var hasRequiredSharedKey;
	function requireSharedKey() {
	  if (hasRequiredSharedKey) return sharedKey;
	  hasRequiredSharedKey = 1;
	  var shared = requireShared();
	  var uid = requireUid();
	  var keys = shared('keys');
	  sharedKey = function (key) {
	    return keys[key] || (keys[key] = uid(key));
	  };
	  return sharedKey;
	}

	var hiddenKeys;
	var hasRequiredHiddenKeys;
	function requireHiddenKeys() {
	  if (hasRequiredHiddenKeys) return hiddenKeys;
	  hasRequiredHiddenKeys = 1;
	  hiddenKeys = {};
	  return hiddenKeys;
	}

	var internalState;
	var hasRequiredInternalState;
	function requireInternalState() {
	  if (hasRequiredInternalState) return internalState;
	  hasRequiredInternalState = 1;
	  var NATIVE_WEAK_MAP = requireWeakMapBasicDetection();
	  var globalThis = requireGlobalThis();
	  var isObject = requireIsObject();
	  var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
	  var hasOwn = requireHasOwnProperty();
	  var shared = requireSharedStore();
	  var sharedKey = requireSharedKey();
	  var hiddenKeys = requireHiddenKeys();
	  var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	  var TypeError = globalThis.TypeError;
	  var WeakMap = globalThis.WeakMap;
	  var set, get, has;
	  var enforce = function (it) {
	    return has(it) ? get(it) : set(it, {});
	  };
	  var getterFor = function (TYPE) {
	    return function (it) {
	      var state;
	      if (!isObject(it) || (state = get(it)).type !== TYPE) {
	        throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
	      }
	      return state;
	    };
	  };
	  if (NATIVE_WEAK_MAP || shared.state) {
	    var store = shared.state || (shared.state = new WeakMap());
	    /* eslint-disable no-self-assign -- prototype methods protection */
	    store.get = store.get;
	    store.has = store.has;
	    store.set = store.set;
	    /* eslint-enable no-self-assign -- prototype methods protection */
	    set = function (it, metadata) {
	      if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
	      metadata.facade = it;
	      store.set(it, metadata);
	      return metadata;
	    };
	    get = function (it) {
	      return store.get(it) || {};
	    };
	    has = function (it) {
	      return store.has(it);
	    };
	  } else {
	    var STATE = sharedKey('state');
	    hiddenKeys[STATE] = true;
	    set = function (it, metadata) {
	      if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
	      metadata.facade = it;
	      createNonEnumerableProperty(it, STATE, metadata);
	      return metadata;
	    };
	    get = function (it) {
	      return hasOwn(it, STATE) ? it[STATE] : {};
	    };
	    has = function (it) {
	      return hasOwn(it, STATE);
	    };
	  }
	  internalState = {
	    set: set,
	    get: get,
	    has: has,
	    enforce: enforce,
	    getterFor: getterFor
	  };
	  return internalState;
	}

	var hasRequiredMakeBuiltIn;
	function requireMakeBuiltIn() {
	  if (hasRequiredMakeBuiltIn) return makeBuiltIn.exports;
	  hasRequiredMakeBuiltIn = 1;
	  var uncurryThis = requireFunctionUncurryThis();
	  var fails = requireFails();
	  var isCallable = requireIsCallable();
	  var hasOwn = requireHasOwnProperty();
	  var DESCRIPTORS = requireDescriptors();
	  var CONFIGURABLE_FUNCTION_NAME = requireFunctionName().CONFIGURABLE;
	  var inspectSource = requireInspectSource();
	  var InternalStateModule = requireInternalState();
	  var enforceInternalState = InternalStateModule.enforce;
	  var getInternalState = InternalStateModule.get;
	  var $String = String;
	  // eslint-disable-next-line es/no-object-defineproperty -- safe
	  var defineProperty = Object.defineProperty;
	  var stringSlice = uncurryThis(''.slice);
	  var replace = uncurryThis(''.replace);
	  var join = uncurryThis([].join);
	  var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
	    return defineProperty(function () {/* empty */}, 'length', {
	      value: 8
	    }).length !== 8;
	  });
	  var TEMPLATE = String(String).split('String');
	  var makeBuiltIn$1 = makeBuiltIn.exports = function (value, name, options) {
	    if (stringSlice($String(name), 0, 7) === 'Symbol(') {
	      name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
	    }
	    if (options && options.getter) name = 'get ' + name;
	    if (options && options.setter) name = 'set ' + name;
	    if (!hasOwn(value, 'name') || CONFIGURABLE_FUNCTION_NAME && value.name !== name) {
	      if (DESCRIPTORS) defineProperty(value, 'name', {
	        value: name,
	        configurable: true
	      });else value.name = name;
	    }
	    if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
	      defineProperty(value, 'length', {
	        value: options.arity
	      });
	    }
	    try {
	      if (options && hasOwn(options, 'constructor') && options.constructor) {
	        if (DESCRIPTORS) defineProperty(value, 'prototype', {
	          writable: false
	        });
	        // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
	      } else if (value.prototype) value.prototype = undefined;
	    } catch (error) {/* empty */}
	    var state = enforceInternalState(value);
	    if (!hasOwn(state, 'source')) {
	      state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
	    }
	    return value;
	  };

	  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	  // eslint-disable-next-line no-extend-native -- required
	  Function.prototype.toString = makeBuiltIn$1(function toString() {
	    return isCallable(this) && getInternalState(this).source || inspectSource(this);
	  }, 'toString');
	  return makeBuiltIn.exports;
	}

	var defineBuiltIn;
	var hasRequiredDefineBuiltIn;
	function requireDefineBuiltIn() {
	  if (hasRequiredDefineBuiltIn) return defineBuiltIn;
	  hasRequiredDefineBuiltIn = 1;
	  var isCallable = requireIsCallable();
	  var definePropertyModule = requireObjectDefineProperty();
	  var makeBuiltIn = requireMakeBuiltIn();
	  var defineGlobalProperty = requireDefineGlobalProperty();
	  defineBuiltIn = function (O, key, value, options) {
	    if (!options) options = {};
	    var simple = options.enumerable;
	    var name = options.name !== undefined ? options.name : key;
	    if (isCallable(value)) makeBuiltIn(value, name, options);
	    if (options.global) {
	      if (simple) O[key] = value;else defineGlobalProperty(key, value);
	    } else {
	      try {
	        if (!options.unsafe) delete O[key];else if (O[key]) simple = true;
	      } catch (error) {/* empty */}
	      if (simple) O[key] = value;else definePropertyModule.f(O, key, {
	        value: value,
	        enumerable: false,
	        configurable: !options.nonConfigurable,
	        writable: !options.nonWritable
	      });
	    }
	    return O;
	  };
	  return defineBuiltIn;
	}

	var objectGetOwnPropertyNames = {};

	var mathTrunc;
	var hasRequiredMathTrunc;
	function requireMathTrunc() {
	  if (hasRequiredMathTrunc) return mathTrunc;
	  hasRequiredMathTrunc = 1;
	  var ceil = Math.ceil;
	  var floor = Math.floor;

	  // `Math.trunc` method
	  // https://tc39.es/ecma262/#sec-math.trunc
	  // eslint-disable-next-line es/no-math-trunc -- safe
	  mathTrunc = Math.trunc || function trunc(x) {
	    var n = +x;
	    return (n > 0 ? floor : ceil)(n);
	  };
	  return mathTrunc;
	}

	var toIntegerOrInfinity;
	var hasRequiredToIntegerOrInfinity;
	function requireToIntegerOrInfinity() {
	  if (hasRequiredToIntegerOrInfinity) return toIntegerOrInfinity;
	  hasRequiredToIntegerOrInfinity = 1;
	  var trunc = requireMathTrunc();

	  // `ToIntegerOrInfinity` abstract operation
	  // https://tc39.es/ecma262/#sec-tointegerorinfinity
	  toIntegerOrInfinity = function (argument) {
	    var number = +argument;
	    // eslint-disable-next-line no-self-compare -- NaN check
	    return number !== number || number === 0 ? 0 : trunc(number);
	  };
	  return toIntegerOrInfinity;
	}

	var toAbsoluteIndex;
	var hasRequiredToAbsoluteIndex;
	function requireToAbsoluteIndex() {
	  if (hasRequiredToAbsoluteIndex) return toAbsoluteIndex;
	  hasRequiredToAbsoluteIndex = 1;
	  var toIntegerOrInfinity = requireToIntegerOrInfinity();
	  var max = Math.max;
	  var min = Math.min;

	  // Helper for a popular repeating case of the spec:
	  // Let integer be ? ToInteger(index).
	  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	  toAbsoluteIndex = function (index, length) {
	    var integer = toIntegerOrInfinity(index);
	    return integer < 0 ? max(integer + length, 0) : min(integer, length);
	  };
	  return toAbsoluteIndex;
	}

	var toLength;
	var hasRequiredToLength;
	function requireToLength() {
	  if (hasRequiredToLength) return toLength;
	  hasRequiredToLength = 1;
	  var toIntegerOrInfinity = requireToIntegerOrInfinity();
	  var min = Math.min;

	  // `ToLength` abstract operation
	  // https://tc39.es/ecma262/#sec-tolength
	  toLength = function (argument) {
	    var len = toIntegerOrInfinity(argument);
	    return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	  };
	  return toLength;
	}

	var lengthOfArrayLike;
	var hasRequiredLengthOfArrayLike;
	function requireLengthOfArrayLike() {
	  if (hasRequiredLengthOfArrayLike) return lengthOfArrayLike;
	  hasRequiredLengthOfArrayLike = 1;
	  var toLength = requireToLength();

	  // `LengthOfArrayLike` abstract operation
	  // https://tc39.es/ecma262/#sec-lengthofarraylike
	  lengthOfArrayLike = function (obj) {
	    return toLength(obj.length);
	  };
	  return lengthOfArrayLike;
	}

	var arrayIncludes;
	var hasRequiredArrayIncludes;
	function requireArrayIncludes() {
	  if (hasRequiredArrayIncludes) return arrayIncludes;
	  hasRequiredArrayIncludes = 1;
	  var toIndexedObject = requireToIndexedObject();
	  var toAbsoluteIndex = requireToAbsoluteIndex();
	  var lengthOfArrayLike = requireLengthOfArrayLike();

	  // `Array.prototype.{ indexOf, includes }` methods implementation
	  var createMethod = function (IS_INCLUDES) {
	    return function ($this, el, fromIndex) {
	      var O = toIndexedObject($this);
	      var length = lengthOfArrayLike(O);
	      if (length === 0) return !IS_INCLUDES && -1;
	      var index = toAbsoluteIndex(fromIndex, length);
	      var value;
	      // Array#includes uses SameValueZero equality algorithm
	      // eslint-disable-next-line no-self-compare -- NaN check
	      if (IS_INCLUDES && el !== el) while (length > index) {
	        value = O[index++];
	        // eslint-disable-next-line no-self-compare -- NaN check
	        if (value !== value) return true;
	        // Array#indexOf ignores holes, Array#includes - not
	      } else for (; length > index; index++) {
	        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	      }
	      return !IS_INCLUDES && -1;
	    };
	  };
	  arrayIncludes = {
	    // `Array.prototype.includes` method
	    // https://tc39.es/ecma262/#sec-array.prototype.includes
	    includes: createMethod(true),
	    // `Array.prototype.indexOf` method
	    // https://tc39.es/ecma262/#sec-array.prototype.indexof
	    indexOf: createMethod(false)
	  };
	  return arrayIncludes;
	}

	var objectKeysInternal;
	var hasRequiredObjectKeysInternal;
	function requireObjectKeysInternal() {
	  if (hasRequiredObjectKeysInternal) return objectKeysInternal;
	  hasRequiredObjectKeysInternal = 1;
	  var uncurryThis = requireFunctionUncurryThis();
	  var hasOwn = requireHasOwnProperty();
	  var toIndexedObject = requireToIndexedObject();
	  var indexOf = requireArrayIncludes().indexOf;
	  var hiddenKeys = requireHiddenKeys();
	  var push = uncurryThis([].push);
	  objectKeysInternal = function (object, names) {
	    var O = toIndexedObject(object);
	    var i = 0;
	    var result = [];
	    var key;
	    for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
	    // Don't enum bug & hidden keys
	    while (names.length > i) if (hasOwn(O, key = names[i++])) {
	      ~indexOf(result, key) || push(result, key);
	    }
	    return result;
	  };
	  return objectKeysInternal;
	}

	var enumBugKeys;
	var hasRequiredEnumBugKeys;
	function requireEnumBugKeys() {
	  if (hasRequiredEnumBugKeys) return enumBugKeys;
	  hasRequiredEnumBugKeys = 1;
	  // IE8- don't enum bug keys
	  enumBugKeys = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];
	  return enumBugKeys;
	}

	var hasRequiredObjectGetOwnPropertyNames;
	function requireObjectGetOwnPropertyNames() {
	  if (hasRequiredObjectGetOwnPropertyNames) return objectGetOwnPropertyNames;
	  hasRequiredObjectGetOwnPropertyNames = 1;
	  var internalObjectKeys = requireObjectKeysInternal();
	  var enumBugKeys = requireEnumBugKeys();
	  var hiddenKeys = enumBugKeys.concat('length', 'prototype');

	  // `Object.getOwnPropertyNames` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertynames
	  // eslint-disable-next-line es/no-object-getownpropertynames -- safe
	  objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	    return internalObjectKeys(O, hiddenKeys);
	  };
	  return objectGetOwnPropertyNames;
	}

	var objectGetOwnPropertySymbols = {};

	var hasRequiredObjectGetOwnPropertySymbols;
	function requireObjectGetOwnPropertySymbols() {
	  if (hasRequiredObjectGetOwnPropertySymbols) return objectGetOwnPropertySymbols;
	  hasRequiredObjectGetOwnPropertySymbols = 1;
	  // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
	  objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;
	  return objectGetOwnPropertySymbols;
	}

	var ownKeys;
	var hasRequiredOwnKeys;
	function requireOwnKeys() {
	  if (hasRequiredOwnKeys) return ownKeys;
	  hasRequiredOwnKeys = 1;
	  var getBuiltIn = requireGetBuiltIn();
	  var uncurryThis = requireFunctionUncurryThis();
	  var getOwnPropertyNamesModule = requireObjectGetOwnPropertyNames();
	  var getOwnPropertySymbolsModule = requireObjectGetOwnPropertySymbols();
	  var anObject = requireAnObject();
	  var concat = uncurryThis([].concat);

	  // all object keys, includes non-enumerable and symbols
	  ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	    var keys = getOwnPropertyNamesModule.f(anObject(it));
	    var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
	    return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
	  };
	  return ownKeys;
	}

	var copyConstructorProperties;
	var hasRequiredCopyConstructorProperties;
	function requireCopyConstructorProperties() {
	  if (hasRequiredCopyConstructorProperties) return copyConstructorProperties;
	  hasRequiredCopyConstructorProperties = 1;
	  var hasOwn = requireHasOwnProperty();
	  var ownKeys = requireOwnKeys();
	  var getOwnPropertyDescriptorModule = requireObjectGetOwnPropertyDescriptor();
	  var definePropertyModule = requireObjectDefineProperty();
	  copyConstructorProperties = function (target, source, exceptions) {
	    var keys = ownKeys(source);
	    var defineProperty = definePropertyModule.f;
	    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
	    for (var i = 0; i < keys.length; i++) {
	      var key = keys[i];
	      if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
	        defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	      }
	    }
	  };
	  return copyConstructorProperties;
	}

	var isForced_1;
	var hasRequiredIsForced;
	function requireIsForced() {
	  if (hasRequiredIsForced) return isForced_1;
	  hasRequiredIsForced = 1;
	  var fails = requireFails();
	  var isCallable = requireIsCallable();
	  var replacement = /#|\.prototype\./;
	  var isForced = function (feature, detection) {
	    var value = data[normalize(feature)];
	    return value === POLYFILL ? true : value === NATIVE ? false : isCallable(detection) ? fails(detection) : !!detection;
	  };
	  var normalize = isForced.normalize = function (string) {
	    return String(string).replace(replacement, '.').toLowerCase();
	  };
	  var data = isForced.data = {};
	  var NATIVE = isForced.NATIVE = 'N';
	  var POLYFILL = isForced.POLYFILL = 'P';
	  isForced_1 = isForced;
	  return isForced_1;
	}

	var _export;
	var hasRequired_export;
	function require_export() {
	  if (hasRequired_export) return _export;
	  hasRequired_export = 1;
	  var globalThis = requireGlobalThis();
	  var getOwnPropertyDescriptor = requireObjectGetOwnPropertyDescriptor().f;
	  var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
	  var defineBuiltIn = requireDefineBuiltIn();
	  var defineGlobalProperty = requireDefineGlobalProperty();
	  var copyConstructorProperties = requireCopyConstructorProperties();
	  var isForced = requireIsForced();

	  /*
	    options.target         - name of the target object
	    options.global         - target is the global object
	    options.stat           - export as static methods of target
	    options.proto          - export as prototype methods of target
	    options.real           - real prototype method for the `pure` version
	    options.forced         - export even if the native feature is available
	    options.bind           - bind methods to the target, required for the `pure` version
	    options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
	    options.unsafe         - use the simple assignment of property instead of delete + defineProperty
	    options.sham           - add a flag to not completely full polyfills
	    options.enumerable     - export as enumerable property
	    options.dontCallGetSet - prevent calling a getter on target
	    options.name           - the .name of the function if it does not match the key
	  */
	  _export = function (options, source) {
	    var TARGET = options.target;
	    var GLOBAL = options.global;
	    var STATIC = options.stat;
	    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	    if (GLOBAL) {
	      target = globalThis;
	    } else if (STATIC) {
	      target = globalThis[TARGET] || defineGlobalProperty(TARGET, {});
	    } else {
	      target = globalThis[TARGET] && globalThis[TARGET].prototype;
	    }
	    if (target) for (key in source) {
	      sourceProperty = source[key];
	      if (options.dontCallGetSet) {
	        descriptor = getOwnPropertyDescriptor(target, key);
	        targetProperty = descriptor && descriptor.value;
	      } else targetProperty = target[key];
	      FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	      // contained in target
	      if (!FORCED && targetProperty !== undefined) {
	        if (typeof sourceProperty == typeof targetProperty) continue;
	        copyConstructorProperties(sourceProperty, targetProperty);
	      }
	      // add a flag to not completely full polyfills
	      if (options.sham || targetProperty && targetProperty.sham) {
	        createNonEnumerableProperty(sourceProperty, 'sham', true);
	      }
	      defineBuiltIn(target, key, sourceProperty, options);
	    }
	  };
	  return _export;
	}

	var anInstance;
	var hasRequiredAnInstance;
	function requireAnInstance() {
	  if (hasRequiredAnInstance) return anInstance;
	  hasRequiredAnInstance = 1;
	  var isPrototypeOf = requireObjectIsPrototypeOf();
	  var $TypeError = TypeError;
	  anInstance = function (it, Prototype) {
	    if (isPrototypeOf(Prototype, it)) return it;
	    throw new $TypeError('Incorrect invocation');
	  };
	  return anInstance;
	}

	var correctPrototypeGetter;
	var hasRequiredCorrectPrototypeGetter;
	function requireCorrectPrototypeGetter() {
	  if (hasRequiredCorrectPrototypeGetter) return correctPrototypeGetter;
	  hasRequiredCorrectPrototypeGetter = 1;
	  var fails = requireFails();
	  correctPrototypeGetter = !fails(function () {
	    function F() {/* empty */}
	    F.prototype.constructor = null;
	    // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
	    return Object.getPrototypeOf(new F()) !== F.prototype;
	  });
	  return correctPrototypeGetter;
	}

	var objectGetPrototypeOf;
	var hasRequiredObjectGetPrototypeOf;
	function requireObjectGetPrototypeOf() {
	  if (hasRequiredObjectGetPrototypeOf) return objectGetPrototypeOf;
	  hasRequiredObjectGetPrototypeOf = 1;
	  var hasOwn = requireHasOwnProperty();
	  var isCallable = requireIsCallable();
	  var toObject = requireToObject();
	  var sharedKey = requireSharedKey();
	  var CORRECT_PROTOTYPE_GETTER = requireCorrectPrototypeGetter();
	  var IE_PROTO = sharedKey('IE_PROTO');
	  var $Object = Object;
	  var ObjectPrototype = $Object.prototype;

	  // `Object.getPrototypeOf` method
	  // https://tc39.es/ecma262/#sec-object.getprototypeof
	  // eslint-disable-next-line es/no-object-getprototypeof -- safe
	  objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
	    var object = toObject(O);
	    if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
	    var constructor = object.constructor;
	    if (isCallable(constructor) && object instanceof constructor) {
	      return constructor.prototype;
	    }
	    return object instanceof $Object ? ObjectPrototype : null;
	  };
	  return objectGetPrototypeOf;
	}

	var defineBuiltInAccessor;
	var hasRequiredDefineBuiltInAccessor;
	function requireDefineBuiltInAccessor() {
	  if (hasRequiredDefineBuiltInAccessor) return defineBuiltInAccessor;
	  hasRequiredDefineBuiltInAccessor = 1;
	  var makeBuiltIn = requireMakeBuiltIn();
	  var defineProperty = requireObjectDefineProperty();
	  defineBuiltInAccessor = function (target, name, descriptor) {
	    if (descriptor.get) makeBuiltIn(descriptor.get, name, {
	      getter: true
	    });
	    if (descriptor.set) makeBuiltIn(descriptor.set, name, {
	      setter: true
	    });
	    return defineProperty.f(target, name, descriptor);
	  };
	  return defineBuiltInAccessor;
	}

	var createProperty;
	var hasRequiredCreateProperty;
	function requireCreateProperty() {
	  if (hasRequiredCreateProperty) return createProperty;
	  hasRequiredCreateProperty = 1;
	  var DESCRIPTORS = requireDescriptors();
	  var definePropertyModule = requireObjectDefineProperty();
	  var createPropertyDescriptor = requireCreatePropertyDescriptor();
	  createProperty = function (object, key, value) {
	    if (DESCRIPTORS) definePropertyModule.f(object, key, createPropertyDescriptor(0, value));else object[key] = value;
	  };
	  return createProperty;
	}

	var objectDefineProperties = {};

	var objectKeys;
	var hasRequiredObjectKeys;
	function requireObjectKeys() {
	  if (hasRequiredObjectKeys) return objectKeys;
	  hasRequiredObjectKeys = 1;
	  var internalObjectKeys = requireObjectKeysInternal();
	  var enumBugKeys = requireEnumBugKeys();

	  // `Object.keys` method
	  // https://tc39.es/ecma262/#sec-object.keys
	  // eslint-disable-next-line es/no-object-keys -- safe
	  objectKeys = Object.keys || function keys(O) {
	    return internalObjectKeys(O, enumBugKeys);
	  };
	  return objectKeys;
	}

	var hasRequiredObjectDefineProperties;
	function requireObjectDefineProperties() {
	  if (hasRequiredObjectDefineProperties) return objectDefineProperties;
	  hasRequiredObjectDefineProperties = 1;
	  var DESCRIPTORS = requireDescriptors();
	  var V8_PROTOTYPE_DEFINE_BUG = requireV8PrototypeDefineBug();
	  var definePropertyModule = requireObjectDefineProperty();
	  var anObject = requireAnObject();
	  var toIndexedObject = requireToIndexedObject();
	  var objectKeys = requireObjectKeys();

	  // `Object.defineProperties` method
	  // https://tc39.es/ecma262/#sec-object.defineproperties
	  // eslint-disable-next-line es/no-object-defineproperties -- safe
	  objectDefineProperties.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
	    anObject(O);
	    var props = toIndexedObject(Properties);
	    var keys = objectKeys(Properties);
	    var length = keys.length;
	    var index = 0;
	    var key;
	    while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
	    return O;
	  };
	  return objectDefineProperties;
	}

	var html;
	var hasRequiredHtml;
	function requireHtml() {
	  if (hasRequiredHtml) return html;
	  hasRequiredHtml = 1;
	  var getBuiltIn = requireGetBuiltIn();
	  html = getBuiltIn('document', 'documentElement');
	  return html;
	}

	var objectCreate;
	var hasRequiredObjectCreate;
	function requireObjectCreate() {
	  if (hasRequiredObjectCreate) return objectCreate;
	  hasRequiredObjectCreate = 1;
	  /* global ActiveXObject -- old IE, WSH */
	  var anObject = requireAnObject();
	  var definePropertiesModule = requireObjectDefineProperties();
	  var enumBugKeys = requireEnumBugKeys();
	  var hiddenKeys = requireHiddenKeys();
	  var html = requireHtml();
	  var documentCreateElement = requireDocumentCreateElement();
	  var sharedKey = requireSharedKey();
	  var GT = '>';
	  var LT = '<';
	  var PROTOTYPE = 'prototype';
	  var SCRIPT = 'script';
	  var IE_PROTO = sharedKey('IE_PROTO');
	  var EmptyConstructor = function () {/* empty */};
	  var scriptTag = function (content) {
	    return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	  };

	  // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	  var NullProtoObjectViaActiveX = function (activeXDocument) {
	    activeXDocument.write(scriptTag(''));
	    activeXDocument.close();
	    var temp = activeXDocument.parentWindow.Object;
	    // eslint-disable-next-line no-useless-assignment -- avoid memory leak
	    activeXDocument = null;
	    return temp;
	  };

	  // Create object with fake `null` prototype: use iframe Object with cleared prototype
	  var NullProtoObjectViaIFrame = function () {
	    // Thrash, waste and sodomy: IE GC bug
	    var iframe = documentCreateElement('iframe');
	    var JS = 'java' + SCRIPT + ':';
	    var iframeDocument;
	    iframe.style.display = 'none';
	    html.appendChild(iframe);
	    // https://github.com/zloirock/core-js/issues/475
	    iframe.src = String(JS);
	    iframeDocument = iframe.contentWindow.document;
	    iframeDocument.open();
	    iframeDocument.write(scriptTag('document.F=Object'));
	    iframeDocument.close();
	    return iframeDocument.F;
	  };

	  // Check for document.domain and active x support
	  // No need to use active x approach when document.domain is not set
	  // see https://github.com/es-shims/es5-shim/issues/150
	  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	  // avoid IE GC bug
	  var activeXDocument;
	  var NullProtoObject = function () {
	    try {
	      activeXDocument = new ActiveXObject('htmlfile');
	    } catch (error) {/* ignore */}
	    NullProtoObject = typeof document != 'undefined' ? document.domain && activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) // old IE
	    : NullProtoObjectViaIFrame() : NullProtoObjectViaActiveX(activeXDocument); // WSH
	    var length = enumBugKeys.length;
	    while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	    return NullProtoObject();
	  };
	  hiddenKeys[IE_PROTO] = true;

	  // `Object.create` method
	  // https://tc39.es/ecma262/#sec-object.create
	  // eslint-disable-next-line es/no-object-create -- safe
	  objectCreate = Object.create || function create(O, Properties) {
	    var result;
	    if (O !== null) {
	      EmptyConstructor[PROTOTYPE] = anObject(O);
	      result = new EmptyConstructor();
	      EmptyConstructor[PROTOTYPE] = null;
	      // add "__proto__" for Object.getPrototypeOf polyfill
	      result[IE_PROTO] = O;
	    } else result = NullProtoObject();
	    return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
	  };
	  return objectCreate;
	}

	var iteratorsCore;
	var hasRequiredIteratorsCore;
	function requireIteratorsCore() {
	  if (hasRequiredIteratorsCore) return iteratorsCore;
	  hasRequiredIteratorsCore = 1;
	  var fails = requireFails();
	  var isCallable = requireIsCallable();
	  var isObject = requireIsObject();
	  var create = requireObjectCreate();
	  var getPrototypeOf = requireObjectGetPrototypeOf();
	  var defineBuiltIn = requireDefineBuiltIn();
	  var wellKnownSymbol = requireWellKnownSymbol();
	  var IS_PURE = requireIsPure();
	  var ITERATOR = wellKnownSymbol('iterator');
	  var BUGGY_SAFARI_ITERATORS = false;

	  // `%IteratorPrototype%` object
	  // https://tc39.es/ecma262/#sec-%iteratorprototype%-object
	  var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

	  /* eslint-disable es/no-array-prototype-keys -- safe */
	  if ([].keys) {
	    arrayIterator = [].keys();
	    // Safari 8 has buggy iterators w/o `next`
	    if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;else {
	      PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
	      if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
	    }
	  }
	  var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
	    var test = {};
	    // FF44- legacy iterators case
	    return IteratorPrototype[ITERATOR].call(test) !== test;
	  });
	  if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

	  // `%IteratorPrototype%[@@iterator]()` method
	  // https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
	  if (!isCallable(IteratorPrototype[ITERATOR])) {
	    defineBuiltIn(IteratorPrototype, ITERATOR, function () {
	      return this;
	    });
	  }
	  iteratorsCore = {
	    IteratorPrototype: IteratorPrototype,
	    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	  };
	  return iteratorsCore;
	}

	var hasRequiredEs_iterator_constructor;
	function requireEs_iterator_constructor() {
	  if (hasRequiredEs_iterator_constructor) return es_iterator_constructor;
	  hasRequiredEs_iterator_constructor = 1;
	  var $ = require_export();
	  var globalThis = requireGlobalThis();
	  var anInstance = requireAnInstance();
	  var anObject = requireAnObject();
	  var isCallable = requireIsCallable();
	  var getPrototypeOf = requireObjectGetPrototypeOf();
	  var defineBuiltInAccessor = requireDefineBuiltInAccessor();
	  var createProperty = requireCreateProperty();
	  var fails = requireFails();
	  var hasOwn = requireHasOwnProperty();
	  var wellKnownSymbol = requireWellKnownSymbol();
	  var IteratorPrototype = requireIteratorsCore().IteratorPrototype;
	  var DESCRIPTORS = requireDescriptors();
	  var IS_PURE = requireIsPure();
	  var CONSTRUCTOR = 'constructor';
	  var ITERATOR = 'Iterator';
	  var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	  var $TypeError = TypeError;
	  var NativeIterator = globalThis[ITERATOR];

	  // FF56- have non-standard global helper `Iterator`
	  var FORCED = IS_PURE || !isCallable(NativeIterator) || NativeIterator.prototype !== IteratorPrototype
	  // FF44- non-standard `Iterator` passes previous tests
	  || !fails(function () {
	    NativeIterator({});
	  });
	  var IteratorConstructor = function Iterator() {
	    anInstance(this, IteratorPrototype);
	    if (getPrototypeOf(this) === IteratorPrototype) throw new $TypeError('Abstract class Iterator not directly constructable');
	  };
	  var defineIteratorPrototypeAccessor = function (key, value) {
	    if (DESCRIPTORS) {
	      defineBuiltInAccessor(IteratorPrototype, key, {
	        configurable: true,
	        get: function () {
	          return value;
	        },
	        set: function (replacement) {
	          anObject(this);
	          if (this === IteratorPrototype) throw new $TypeError("You can't redefine this property");
	          if (hasOwn(this, key)) this[key] = replacement;else createProperty(this, key, replacement);
	        }
	      });
	    } else IteratorPrototype[key] = value;
	  };
	  if (!hasOwn(IteratorPrototype, TO_STRING_TAG)) defineIteratorPrototypeAccessor(TO_STRING_TAG, ITERATOR);
	  if (FORCED || !hasOwn(IteratorPrototype, CONSTRUCTOR) || IteratorPrototype[CONSTRUCTOR] === Object) {
	    defineIteratorPrototypeAccessor(CONSTRUCTOR, IteratorConstructor);
	  }
	  IteratorConstructor.prototype = IteratorPrototype;

	  // `Iterator` constructor
	  // https://tc39.es/ecma262/#sec-iterator
	  $({
	    global: true,
	    constructor: true,
	    forced: FORCED
	  }, {
	    Iterator: IteratorConstructor
	  });
	  return es_iterator_constructor;
	}

	var hasRequiredEsnext_iterator_constructor;
	function requireEsnext_iterator_constructor() {
	  if (hasRequiredEsnext_iterator_constructor) return esnext_iterator_constructor;
	  hasRequiredEsnext_iterator_constructor = 1;
	  // TODO: Remove from `core-js@4`
	  requireEs_iterator_constructor();
	  return esnext_iterator_constructor;
	}

	requireEsnext_iterator_constructor();

	var esnext_iterator_map = {};

	var es_iterator_map = {};

	var getIteratorDirect;
	var hasRequiredGetIteratorDirect;
	function requireGetIteratorDirect() {
	  if (hasRequiredGetIteratorDirect) return getIteratorDirect;
	  hasRequiredGetIteratorDirect = 1;
	  // `GetIteratorDirect(obj)` abstract operation
	  // https://tc39.es/ecma262/#sec-getiteratordirect
	  getIteratorDirect = function (obj) {
	    return {
	      iterator: obj,
	      next: obj.next,
	      done: false
	    };
	  };
	  return getIteratorDirect;
	}

	var defineBuiltIns;
	var hasRequiredDefineBuiltIns;
	function requireDefineBuiltIns() {
	  if (hasRequiredDefineBuiltIns) return defineBuiltIns;
	  hasRequiredDefineBuiltIns = 1;
	  var defineBuiltIn = requireDefineBuiltIn();
	  defineBuiltIns = function (target, src, options) {
	    for (var key in src) defineBuiltIn(target, key, src[key], options);
	    return target;
	  };
	  return defineBuiltIns;
	}

	var createIterResultObject;
	var hasRequiredCreateIterResultObject;
	function requireCreateIterResultObject() {
	  if (hasRequiredCreateIterResultObject) return createIterResultObject;
	  hasRequiredCreateIterResultObject = 1;
	  // `CreateIterResultObject` abstract operation
	  // https://tc39.es/ecma262/#sec-createiterresultobject
	  createIterResultObject = function (value, done) {
	    return {
	      value: value,
	      done: done
	    };
	  };
	  return createIterResultObject;
	}

	var iteratorClose;
	var hasRequiredIteratorClose;
	function requireIteratorClose() {
	  if (hasRequiredIteratorClose) return iteratorClose;
	  hasRequiredIteratorClose = 1;
	  var call = requireFunctionCall();
	  var anObject = requireAnObject();
	  var getMethod = requireGetMethod();
	  iteratorClose = function (iterator, kind, value) {
	    var innerResult, innerError;
	    anObject(iterator);
	    try {
	      innerResult = getMethod(iterator, 'return');
	      if (!innerResult) {
	        if (kind === 'throw') throw value;
	        return value;
	      }
	      innerResult = call(innerResult, iterator);
	    } catch (error) {
	      innerError = true;
	      innerResult = error;
	    }
	    if (kind === 'throw') throw value;
	    if (innerError) throw innerResult;
	    anObject(innerResult);
	    return value;
	  };
	  return iteratorClose;
	}

	var iteratorCloseAll;
	var hasRequiredIteratorCloseAll;
	function requireIteratorCloseAll() {
	  if (hasRequiredIteratorCloseAll) return iteratorCloseAll;
	  hasRequiredIteratorCloseAll = 1;
	  var iteratorClose = requireIteratorClose();
	  iteratorCloseAll = function (iters, kind, value) {
	    for (var i = iters.length - 1; i >= 0; i--) {
	      if (iters[i] === undefined) continue;
	      try {
	        value = iteratorClose(iters[i].iterator, kind, value);
	      } catch (error) {
	        kind = 'throw';
	        value = error;
	      }
	    }
	    if (kind === 'throw') throw value;
	    return value;
	  };
	  return iteratorCloseAll;
	}

	var iteratorCreateProxy;
	var hasRequiredIteratorCreateProxy;
	function requireIteratorCreateProxy() {
	  if (hasRequiredIteratorCreateProxy) return iteratorCreateProxy;
	  hasRequiredIteratorCreateProxy = 1;
	  var call = requireFunctionCall();
	  var create = requireObjectCreate();
	  var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
	  var defineBuiltIns = requireDefineBuiltIns();
	  var wellKnownSymbol = requireWellKnownSymbol();
	  var InternalStateModule = requireInternalState();
	  var getMethod = requireGetMethod();
	  var IteratorPrototype = requireIteratorsCore().IteratorPrototype;
	  var createIterResultObject = requireCreateIterResultObject();
	  var iteratorClose = requireIteratorClose();
	  var iteratorCloseAll = requireIteratorCloseAll();
	  var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	  var ITERATOR_HELPER = 'IteratorHelper';
	  var WRAP_FOR_VALID_ITERATOR = 'WrapForValidIterator';
	  var NORMAL = 'normal';
	  var THROW = 'throw';
	  var setInternalState = InternalStateModule.set;
	  var createIteratorProxyPrototype = function (IS_ITERATOR) {
	    var getInternalState = InternalStateModule.getterFor(IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER);
	    return defineBuiltIns(create(IteratorPrototype), {
	      next: function next() {
	        var state = getInternalState(this);
	        // for simplification:
	        //   for `%WrapForValidIteratorPrototype%.next` or with `state.returnHandlerResult` our `nextHandler` returns `IterResultObject`
	        //   for `%IteratorHelperPrototype%.next` - just a value
	        if (IS_ITERATOR) return state.nextHandler();
	        if (state.done) return createIterResultObject(undefined, true);
	        try {
	          var result = state.nextHandler();
	          return state.returnHandlerResult ? result : createIterResultObject(result, state.done);
	        } catch (error) {
	          state.done = true;
	          throw error;
	        }
	      },
	      'return': function () {
	        var state = getInternalState(this);
	        var iterator = state.iterator;
	        state.done = true;
	        if (IS_ITERATOR) {
	          var returnMethod = getMethod(iterator, 'return');
	          return returnMethod ? call(returnMethod, iterator) : createIterResultObject(undefined, true);
	        }
	        if (state.inner) try {
	          iteratorClose(state.inner.iterator, NORMAL);
	        } catch (error) {
	          return iteratorClose(iterator, THROW, error);
	        }
	        if (state.openIters) try {
	          iteratorCloseAll(state.openIters, NORMAL);
	        } catch (error) {
	          return iteratorClose(iterator, THROW, error);
	        }
	        if (iterator) iteratorClose(iterator, NORMAL);
	        return createIterResultObject(undefined, true);
	      }
	    });
	  };
	  var WrapForValidIteratorPrototype = createIteratorProxyPrototype(true);
	  var IteratorHelperPrototype = createIteratorProxyPrototype(false);
	  createNonEnumerableProperty(IteratorHelperPrototype, TO_STRING_TAG, 'Iterator Helper');
	  iteratorCreateProxy = function (nextHandler, IS_ITERATOR, RETURN_HANDLER_RESULT) {
	    var IteratorProxy = function Iterator(record, state) {
	      if (state) {
	        state.iterator = record.iterator;
	        state.next = record.next;
	      } else state = record;
	      state.type = IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER;
	      state.returnHandlerResult = !!RETURN_HANDLER_RESULT;
	      state.nextHandler = nextHandler;
	      state.counter = 0;
	      state.done = false;
	      setInternalState(this, state);
	    };
	    IteratorProxy.prototype = IS_ITERATOR ? WrapForValidIteratorPrototype : IteratorHelperPrototype;
	    return IteratorProxy;
	  };
	  return iteratorCreateProxy;
	}

	var callWithSafeIterationClosing;
	var hasRequiredCallWithSafeIterationClosing;
	function requireCallWithSafeIterationClosing() {
	  if (hasRequiredCallWithSafeIterationClosing) return callWithSafeIterationClosing;
	  hasRequiredCallWithSafeIterationClosing = 1;
	  var anObject = requireAnObject();
	  var iteratorClose = requireIteratorClose();

	  // call something on iterator step with safe closing on error
	  callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
	    try {
	      return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
	    } catch (error) {
	      iteratorClose(iterator, 'throw', error);
	    }
	  };
	  return callWithSafeIterationClosing;
	}

	var iteratorHelperThrowsOnInvalidIterator;
	var hasRequiredIteratorHelperThrowsOnInvalidIterator;
	function requireIteratorHelperThrowsOnInvalidIterator() {
	  if (hasRequiredIteratorHelperThrowsOnInvalidIterator) return iteratorHelperThrowsOnInvalidIterator;
	  hasRequiredIteratorHelperThrowsOnInvalidIterator = 1;
	  // Should throw an error on invalid iterator
	  // https://issues.chromium.org/issues/336839115
	  iteratorHelperThrowsOnInvalidIterator = function (methodName, argument) {
	    // eslint-disable-next-line es/no-iterator -- required for testing
	    var method = typeof Iterator == 'function' && Iterator.prototype[methodName];
	    if (method) try {
	      method.call({
	        next: null
	      }, argument).next();
	    } catch (error) {
	      return true;
	    }
	  };
	  return iteratorHelperThrowsOnInvalidIterator;
	}

	var iteratorHelperWithoutClosingOnEarlyError;
	var hasRequiredIteratorHelperWithoutClosingOnEarlyError;
	function requireIteratorHelperWithoutClosingOnEarlyError() {
	  if (hasRequiredIteratorHelperWithoutClosingOnEarlyError) return iteratorHelperWithoutClosingOnEarlyError;
	  hasRequiredIteratorHelperWithoutClosingOnEarlyError = 1;
	  var globalThis = requireGlobalThis();

	  // https://github.com/tc39/ecma262/pull/3467
	  iteratorHelperWithoutClosingOnEarlyError = function (METHOD_NAME, ExpectedError) {
	    var Iterator = globalThis.Iterator;
	    var IteratorPrototype = Iterator && Iterator.prototype;
	    var method = IteratorPrototype && IteratorPrototype[METHOD_NAME];
	    var CLOSED = false;
	    if (method) try {
	      method.call({
	        next: function () {
	          return {
	            done: true
	          };
	        },
	        'return': function () {
	          CLOSED = true;
	        }
	      }, -1);
	    } catch (error) {
	      // https://bugs.webkit.org/show_bug.cgi?id=291195
	      if (!(error instanceof ExpectedError)) CLOSED = false;
	    }
	    if (!CLOSED) return method;
	  };
	  return iteratorHelperWithoutClosingOnEarlyError;
	}

	var hasRequiredEs_iterator_map;
	function requireEs_iterator_map() {
	  if (hasRequiredEs_iterator_map) return es_iterator_map;
	  hasRequiredEs_iterator_map = 1;
	  var $ = require_export();
	  var call = requireFunctionCall();
	  var aCallable = requireACallable();
	  var anObject = requireAnObject();
	  var getIteratorDirect = requireGetIteratorDirect();
	  var createIteratorProxy = requireIteratorCreateProxy();
	  var callWithSafeIterationClosing = requireCallWithSafeIterationClosing();
	  var iteratorClose = requireIteratorClose();
	  var iteratorHelperThrowsOnInvalidIterator = requireIteratorHelperThrowsOnInvalidIterator();
	  var iteratorHelperWithoutClosingOnEarlyError = requireIteratorHelperWithoutClosingOnEarlyError();
	  var IS_PURE = requireIsPure();
	  var MAP_WITHOUT_THROWING_ON_INVALID_ITERATOR = !IS_PURE && !iteratorHelperThrowsOnInvalidIterator('map', function () {/* empty */});
	  var mapWithoutClosingOnEarlyError = !IS_PURE && !MAP_WITHOUT_THROWING_ON_INVALID_ITERATOR && iteratorHelperWithoutClosingOnEarlyError('map', TypeError);
	  var FORCED = IS_PURE || MAP_WITHOUT_THROWING_ON_INVALID_ITERATOR || mapWithoutClosingOnEarlyError;
	  var IteratorProxy = createIteratorProxy(function () {
	    var iterator = this.iterator;
	    var result = anObject(call(this.next, iterator));
	    var done = this.done = !!result.done;
	    if (!done) return callWithSafeIterationClosing(iterator, this.mapper, [result.value, this.counter++], true);
	  });

	  // `Iterator.prototype.map` method
	  // https://tc39.es/ecma262/#sec-iterator.prototype.map
	  $({
	    target: 'Iterator',
	    proto: true,
	    real: true,
	    forced: FORCED
	  }, {
	    map: function map(mapper) {
	      anObject(this);
	      try {
	        aCallable(mapper);
	      } catch (error) {
	        iteratorClose(this, 'throw', error);
	      }
	      if (mapWithoutClosingOnEarlyError) return call(mapWithoutClosingOnEarlyError, this, mapper);
	      return new IteratorProxy(getIteratorDirect(this), {
	        mapper: mapper
	      });
	    }
	  });
	  return es_iterator_map;
	}

	var hasRequiredEsnext_iterator_map;
	function requireEsnext_iterator_map() {
	  if (hasRequiredEsnext_iterator_map) return esnext_iterator_map;
	  hasRequiredEsnext_iterator_map = 1;
	  // TODO: Remove from `core-js@4`
	  requireEs_iterator_map();
	  return esnext_iterator_map;
	}

	requireEsnext_iterator_map();

	/******************************************************************************
	Copyright (c) Microsoft Corporation.

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	PERFORMANCE OF THIS SOFTWARE.
	***************************************************************************** */
	/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

	function __rest(s, e) {
	  var t = {};
	  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
	    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	  }
	  return t;
	}
	typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
	  var e = new Error(message);
	  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
	};

	var esnext_iterator_filter = {};

	var es_iterator_filter = {};

	var hasRequiredEs_iterator_filter;
	function requireEs_iterator_filter() {
	  if (hasRequiredEs_iterator_filter) return es_iterator_filter;
	  hasRequiredEs_iterator_filter = 1;
	  var $ = require_export();
	  var call = requireFunctionCall();
	  var aCallable = requireACallable();
	  var anObject = requireAnObject();
	  var getIteratorDirect = requireGetIteratorDirect();
	  var createIteratorProxy = requireIteratorCreateProxy();
	  var callWithSafeIterationClosing = requireCallWithSafeIterationClosing();
	  var IS_PURE = requireIsPure();
	  var iteratorClose = requireIteratorClose();
	  var iteratorHelperThrowsOnInvalidIterator = requireIteratorHelperThrowsOnInvalidIterator();
	  var iteratorHelperWithoutClosingOnEarlyError = requireIteratorHelperWithoutClosingOnEarlyError();
	  var FILTER_WITHOUT_THROWING_ON_INVALID_ITERATOR = !IS_PURE && !iteratorHelperThrowsOnInvalidIterator('filter', function () {/* empty */});
	  var filterWithoutClosingOnEarlyError = !IS_PURE && !FILTER_WITHOUT_THROWING_ON_INVALID_ITERATOR && iteratorHelperWithoutClosingOnEarlyError('filter', TypeError);
	  var FORCED = IS_PURE || FILTER_WITHOUT_THROWING_ON_INVALID_ITERATOR || filterWithoutClosingOnEarlyError;
	  var IteratorProxy = createIteratorProxy(function () {
	    var iterator = this.iterator;
	    var predicate = this.predicate;
	    var next = this.next;
	    var result, done, value;
	    while (true) {
	      result = anObject(call(next, iterator));
	      done = this.done = !!result.done;
	      if (done) return;
	      value = result.value;
	      if (callWithSafeIterationClosing(iterator, predicate, [value, this.counter++], true)) return value;
	    }
	  });

	  // `Iterator.prototype.filter` method
	  // https://tc39.es/ecma262/#sec-iterator.prototype.filter
	  $({
	    target: 'Iterator',
	    proto: true,
	    real: true,
	    forced: FORCED
	  }, {
	    filter: function filter(predicate) {
	      anObject(this);
	      try {
	        aCallable(predicate);
	      } catch (error) {
	        iteratorClose(this, 'throw', error);
	      }
	      if (filterWithoutClosingOnEarlyError) return call(filterWithoutClosingOnEarlyError, this, predicate);
	      return new IteratorProxy(getIteratorDirect(this), {
	        predicate: predicate
	      });
	    }
	  });
	  return es_iterator_filter;
	}

	var hasRequiredEsnext_iterator_filter;
	function requireEsnext_iterator_filter() {
	  if (hasRequiredEsnext_iterator_filter) return esnext_iterator_filter;
	  hasRequiredEsnext_iterator_filter = 1;
	  // TODO: Remove from `core-js@4`
	  requireEs_iterator_filter();
	  return esnext_iterator_filter;
	}

	requireEsnext_iterator_filter();

	/**
	 * Copyright 2023 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	 * util class that creates a common set of convenience functions to wrap
	 * shared behavior of Advanced Markers and Markers.
	 */
	class MarkerUtils {
	  static isAdvancedMarkerAvailable(map) {
	    return google.maps.marker && map.getMapCapabilities().isAdvancedMarkersAvailable === true;
	  }
	  static isAdvancedMarker(marker) {
	    return google.maps.marker && marker instanceof google.maps.marker.AdvancedMarkerElement;
	  }
	  static setMap(marker, map) {
	    if (this.isAdvancedMarker(marker)) {
	      marker.map = map;
	    } else {
	      marker.setMap(map);
	    }
	  }
	  static getPosition(marker) {
	    // SuperClusterAlgorithm.calculate expects a LatLng instance so we fake it for Adv Markers
	    if (this.isAdvancedMarker(marker)) {
	      if (marker.position) {
	        if (marker.position instanceof google.maps.LatLng) {
	          return marker.position;
	        }
	        // since we can't cast to LatLngLiteral for reasons =(
	        if (Number.isFinite(marker.position.lat) && Number.isFinite(marker.position.lng)) {
	          return new google.maps.LatLng(marker.position.lat, marker.position.lng);
	        }
	      }
	      // @ts-ignore
	      return new google.maps.LatLng(null);
	    }
	    return marker.getPosition();
	  }
	  static getVisible(marker) {
	    if (this.isAdvancedMarker(marker)) {
	      /**
	       * Always return true for Advanced Markers because the clusterer
	       * uses getVisible as a way to count legacy markers not as an actual
	       * indicator of visibility for some reason. Even when markers are hidden
	       * Marker.getVisible returns `true` and this is used to set the marker count
	       * on the cluster. See the behavior of Cluster.count
	       */
	      return true;
	    }
	    return marker.getVisible();
	  }
	}

	class Cluster {
	  constructor(_ref) {
	    let {
	      markers,
	      position
	    } = _ref;
	    this.markers = [];
	    if (markers) this.markers = markers;
	    if (position) {
	      if (position instanceof google.maps.LatLng) {
	        this._position = position;
	      } else {
	        this._position = new google.maps.LatLng(position);
	      }
	    }
	  }
	  get bounds() {
	    if (this.markers.length === 0 && !this._position) {
	      return;
	    }
	    const bounds = new google.maps.LatLngBounds(this._position, this._position);
	    for (const marker of this.markers) {
	      bounds.extend(MarkerUtils.getPosition(marker));
	    }
	    return bounds;
	  }
	  get position() {
	    // @ts-ignore
	    return this._position || this.bounds.getCenter();
	  }
	  /**
	   * Get the count of **visible** markers.
	   */
	  get count() {
	    return this.markers.filter(m => MarkerUtils.getVisible(m)).length;
	  }
	  /**
	   * Add a marker to the cluster.
	   */
	  push(marker) {
	    this.markers.push(marker);
	  }
	  /**
	   * Cleanup references and remove marker from map.
	   */
	  delete() {
	    if (this.marker) {
	      MarkerUtils.setMap(this.marker, null);
	      this.marker = undefined;
	    }
	    this.markers.length = 0;
	  }
	}

	/**
	 * Copyright 2021 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	 * A typescript assertion function used in cases where typescript has to be
	 * convinced that the object in question can not be null.
	 *
	 * @param value
	 * @param message
	 */
	function assertNotNull(value) {
	  let message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "assertion failed";
	  if (value === null || value === undefined) {
	    throw Error(message);
	  }
	}

	/**
	 * Returns the markers visible in a padded map viewport
	 *
	 * @param map
	 * @param mapCanvasProjection
	 * @param markers The list of marker to filter
	 * @param viewportPaddingPixels The padding in pixel
	 * @returns The list of markers in the padded viewport
	 */
	const filterMarkersToPaddedViewport = (map, mapCanvasProjection, markers, viewportPaddingPixels) => {
	  const bounds = map.getBounds();
	  assertNotNull(bounds);
	  const extendedMapBounds = extendBoundsToPaddedViewport(bounds, mapCanvasProjection, viewportPaddingPixels);
	  return markers.filter(marker => extendedMapBounds.contains(MarkerUtils.getPosition(marker)));
	};
	/**
	 * Extends bounds by a number of pixels in each direction
	 */
	const extendBoundsToPaddedViewport = (bounds, projection, numPixels) => {
	  const {
	    northEast,
	    southWest
	  } = latLngBoundsToPixelBounds(bounds, projection);
	  const extendedPixelBounds = extendPixelBounds({
	    northEast,
	    southWest
	  }, numPixels);
	  return pixelBoundsToLatLngBounds(extendedPixelBounds, projection);
	};
	/**
	 * Gets the extended bounds as a bbox [westLng, southLat, eastLng, northLat]
	 */
	const getPaddedViewport = (bounds, projection, pixels) => {
	  const extended = extendBoundsToPaddedViewport(bounds, projection, pixels);
	  const ne = extended.getNorthEast();
	  const sw = extended.getSouthWest();
	  return [sw.lng(), sw.lat(), ne.lng(), ne.lat()];
	};
	/**
	 * Returns the distance between 2 positions.
	 *
	 * @hidden
	 */
	const distanceBetweenPoints = (p1, p2) => {
	  const R = 6371; // Radius of the Earth in km
	  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
	  const dLon = (p2.lng - p1.lng) * Math.PI / 180;
	  const sinDLat = Math.sin(dLat / 2);
	  const sinDLon = Math.sin(dLon / 2);
	  const a = sinDLat * sinDLat + Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * sinDLon * sinDLon;
	  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	  return R * c;
	};
	/**
	 * Converts a LatLng bound to pixels.
	 *
	 * @hidden
	 */
	const latLngBoundsToPixelBounds = (bounds, projection) => {
	  const northEast = projection.fromLatLngToDivPixel(bounds.getNorthEast());
	  const southWest = projection.fromLatLngToDivPixel(bounds.getSouthWest());
	  assertNotNull(northEast);
	  assertNotNull(southWest);
	  return {
	    northEast,
	    southWest
	  };
	};
	/**
	 * Extends a pixel bounds by numPixels in all directions.
	 *
	 * @hidden
	 */
	const extendPixelBounds = (_ref, numPixels) => {
	  let {
	    northEast,
	    southWest
	  } = _ref;
	  northEast.x += numPixels;
	  northEast.y -= numPixels;
	  southWest.x -= numPixels;
	  southWest.y += numPixels;
	  return {
	    northEast,
	    southWest
	  };
	};
	/**
	 * @hidden
	 */
	const pixelBoundsToLatLngBounds = (_ref2, projection) => {
	  let {
	    northEast,
	    southWest
	  } = _ref2;
	  const sw = projection.fromDivPixelToLatLng(southWest);
	  const ne = projection.fromDivPixelToLatLng(northEast);
	  return new google.maps.LatLngBounds(sw, ne);
	};

	/**
	 * @hidden
	 */
	class AbstractAlgorithm {
	  constructor(_ref) {
	    let {
	      maxZoom = 16
	    } = _ref;
	    this.maxZoom = maxZoom;
	  }
	  /**
	   * Helper function to bypass clustering based upon some map state such as
	   * zoom, number of markers, etc.
	   *
	   * ```typescript
	   *  cluster({markers, map}: AlgorithmInput): Cluster[] {
	   *    if (shouldBypassClustering(map)) {
	   *      return this.noop({markers})
	   *    }
	   * }
	   * ```
	   */
	  noop(_ref2) {
	    let {
	      markers
	    } = _ref2;
	    return noop(markers);
	  }
	}
	/**
	 * Abstract viewport algorithm proves a class to filter markers by a padded
	 * viewport. This is a common optimization.
	 *
	 * @hidden
	 */
	class AbstractViewportAlgorithm extends AbstractAlgorithm {
	  constructor(_a) {
	    var {
	        viewportPadding = 60
	      } = _a,
	      options = __rest(_a, ["viewportPadding"]);
	    super(options);
	    this.viewportPadding = 60;
	    this.viewportPadding = viewportPadding;
	  }
	  calculate(_ref3) {
	    let {
	      markers,
	      map,
	      mapCanvasProjection
	    } = _ref3;
	    const zoom = map.getZoom();
	    assertNotNull(zoom);
	    if (zoom >= this.maxZoom) {
	      return {
	        clusters: this.noop({
	          markers
	        }),
	        changed: false
	      };
	    }
	    return {
	      clusters: this.cluster({
	        markers: filterMarkersToPaddedViewport(map, mapCanvasProjection, markers, this.viewportPadding),
	        map,
	        mapCanvasProjection
	      })
	    };
	  }
	}
	/**
	 * @hidden
	 */
	const noop = markers => {
	  const clusters = markers.map(marker => new Cluster({
	    position: MarkerUtils.getPosition(marker),
	    markers: [marker]
	  }));
	  return clusters;
	};

	var esnext_iterator_forEach = {};

	var es_iterator_forEach = {};

	var functionUncurryThisClause;
	var hasRequiredFunctionUncurryThisClause;
	function requireFunctionUncurryThisClause() {
	  if (hasRequiredFunctionUncurryThisClause) return functionUncurryThisClause;
	  hasRequiredFunctionUncurryThisClause = 1;
	  var classofRaw = requireClassofRaw();
	  var uncurryThis = requireFunctionUncurryThis();
	  functionUncurryThisClause = function (fn) {
	    // Nashorn bug:
	    //   https://github.com/zloirock/core-js/issues/1128
	    //   https://github.com/zloirock/core-js/issues/1130
	    if (classofRaw(fn) === 'Function') return uncurryThis(fn);
	  };
	  return functionUncurryThisClause;
	}

	var functionBindContext;
	var hasRequiredFunctionBindContext;
	function requireFunctionBindContext() {
	  if (hasRequiredFunctionBindContext) return functionBindContext;
	  hasRequiredFunctionBindContext = 1;
	  var uncurryThis = requireFunctionUncurryThisClause();
	  var aCallable = requireACallable();
	  var NATIVE_BIND = requireFunctionBindNative();
	  var bind = uncurryThis(uncurryThis.bind);

	  // optional / simple context binding
	  functionBindContext = function (fn, that) {
	    aCallable(fn);
	    return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function /* ...args */
	    () {
	      return fn.apply(that, arguments);
	    };
	  };
	  return functionBindContext;
	}

	var iterators;
	var hasRequiredIterators;
	function requireIterators() {
	  if (hasRequiredIterators) return iterators;
	  hasRequiredIterators = 1;
	  iterators = {};
	  return iterators;
	}

	var isArrayIteratorMethod;
	var hasRequiredIsArrayIteratorMethod;
	function requireIsArrayIteratorMethod() {
	  if (hasRequiredIsArrayIteratorMethod) return isArrayIteratorMethod;
	  hasRequiredIsArrayIteratorMethod = 1;
	  var wellKnownSymbol = requireWellKnownSymbol();
	  var Iterators = requireIterators();
	  var ITERATOR = wellKnownSymbol('iterator');
	  var ArrayPrototype = Array.prototype;

	  // check on default Array iterator
	  isArrayIteratorMethod = function (it) {
	    return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
	  };
	  return isArrayIteratorMethod;
	}

	var toStringTagSupport;
	var hasRequiredToStringTagSupport;
	function requireToStringTagSupport() {
	  if (hasRequiredToStringTagSupport) return toStringTagSupport;
	  hasRequiredToStringTagSupport = 1;
	  var wellKnownSymbol = requireWellKnownSymbol();
	  var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	  var test = {};
	  test[TO_STRING_TAG] = 'z';
	  toStringTagSupport = String(test) === '[object z]';
	  return toStringTagSupport;
	}

	var classof;
	var hasRequiredClassof;
	function requireClassof() {
	  if (hasRequiredClassof) return classof;
	  hasRequiredClassof = 1;
	  var TO_STRING_TAG_SUPPORT = requireToStringTagSupport();
	  var isCallable = requireIsCallable();
	  var classofRaw = requireClassofRaw();
	  var wellKnownSymbol = requireWellKnownSymbol();
	  var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	  var $Object = Object;

	  // ES3 wrong here
	  var CORRECT_ARGUMENTS = classofRaw(function () {
	    return arguments;
	  }()) === 'Arguments';

	  // fallback for IE11 Script Access Denied error
	  var tryGet = function (it, key) {
	    try {
	      return it[key];
	    } catch (error) {/* empty */}
	  };

	  // getting tag from ES6+ `Object.prototype.toString`
	  classof = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
	    var O, tag, result;
	    return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
	  };
	  return classof;
	}

	var getIteratorMethod;
	var hasRequiredGetIteratorMethod;
	function requireGetIteratorMethod() {
	  if (hasRequiredGetIteratorMethod) return getIteratorMethod;
	  hasRequiredGetIteratorMethod = 1;
	  var classof = requireClassof();
	  var getMethod = requireGetMethod();
	  var isNullOrUndefined = requireIsNullOrUndefined();
	  var Iterators = requireIterators();
	  var wellKnownSymbol = requireWellKnownSymbol();
	  var ITERATOR = wellKnownSymbol('iterator');
	  getIteratorMethod = function (it) {
	    if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR) || getMethod(it, '@@iterator') || Iterators[classof(it)];
	  };
	  return getIteratorMethod;
	}

	var getIterator;
	var hasRequiredGetIterator;
	function requireGetIterator() {
	  if (hasRequiredGetIterator) return getIterator;
	  hasRequiredGetIterator = 1;
	  var call = requireFunctionCall();
	  var aCallable = requireACallable();
	  var anObject = requireAnObject();
	  var tryToString = requireTryToString();
	  var getIteratorMethod = requireGetIteratorMethod();
	  var $TypeError = TypeError;
	  getIterator = function (argument, usingIterator) {
	    var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
	    if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
	    throw new $TypeError(tryToString(argument) + ' is not iterable');
	  };
	  return getIterator;
	}

	var iterate;
	var hasRequiredIterate;
	function requireIterate() {
	  if (hasRequiredIterate) return iterate;
	  hasRequiredIterate = 1;
	  var bind = requireFunctionBindContext();
	  var call = requireFunctionCall();
	  var anObject = requireAnObject();
	  var tryToString = requireTryToString();
	  var isArrayIteratorMethod = requireIsArrayIteratorMethod();
	  var lengthOfArrayLike = requireLengthOfArrayLike();
	  var isPrototypeOf = requireObjectIsPrototypeOf();
	  var getIterator = requireGetIterator();
	  var getIteratorMethod = requireGetIteratorMethod();
	  var iteratorClose = requireIteratorClose();
	  var $TypeError = TypeError;
	  var Result = function (stopped, result) {
	    this.stopped = stopped;
	    this.result = result;
	  };
	  var ResultPrototype = Result.prototype;
	  iterate = function (iterable, unboundFunction, options) {
	    var that = options && options.that;
	    var AS_ENTRIES = !!(options && options.AS_ENTRIES);
	    var IS_RECORD = !!(options && options.IS_RECORD);
	    var IS_ITERATOR = !!(options && options.IS_ITERATOR);
	    var INTERRUPTED = !!(options && options.INTERRUPTED);
	    var fn = bind(unboundFunction, that);
	    var iterator, iterFn, index, length, result, next, step;
	    var stop = function (condition) {
	      if (iterator) iteratorClose(iterator, 'normal');
	      return new Result(true, condition);
	    };
	    var callFn = function (value) {
	      if (AS_ENTRIES) {
	        anObject(value);
	        return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
	      }
	      return INTERRUPTED ? fn(value, stop) : fn(value);
	    };
	    if (IS_RECORD) {
	      iterator = iterable.iterator;
	    } else if (IS_ITERATOR) {
	      iterator = iterable;
	    } else {
	      iterFn = getIteratorMethod(iterable);
	      if (!iterFn) throw new $TypeError(tryToString(iterable) + ' is not iterable');
	      // optimisation for array iterators
	      if (isArrayIteratorMethod(iterFn)) {
	        for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
	          result = callFn(iterable[index]);
	          if (result && isPrototypeOf(ResultPrototype, result)) return result;
	        }
	        return new Result(false);
	      }
	      iterator = getIterator(iterable, iterFn);
	    }
	    next = IS_RECORD ? iterable.next : iterator.next;
	    while (!(step = call(next, iterator)).done) {
	      try {
	        result = callFn(step.value);
	      } catch (error) {
	        iteratorClose(iterator, 'throw', error);
	      }
	      if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
	    }
	    return new Result(false);
	  };
	  return iterate;
	}

	var hasRequiredEs_iterator_forEach;
	function requireEs_iterator_forEach() {
	  if (hasRequiredEs_iterator_forEach) return es_iterator_forEach;
	  hasRequiredEs_iterator_forEach = 1;
	  var $ = require_export();
	  var call = requireFunctionCall();
	  var iterate = requireIterate();
	  var aCallable = requireACallable();
	  var anObject = requireAnObject();
	  var getIteratorDirect = requireGetIteratorDirect();
	  var iteratorClose = requireIteratorClose();
	  var iteratorHelperWithoutClosingOnEarlyError = requireIteratorHelperWithoutClosingOnEarlyError();
	  var forEachWithoutClosingOnEarlyError = iteratorHelperWithoutClosingOnEarlyError('forEach', TypeError);

	  // `Iterator.prototype.forEach` method
	  // https://tc39.es/ecma262/#sec-iterator.prototype.foreach
	  $({
	    target: 'Iterator',
	    proto: true,
	    real: true,
	    forced: forEachWithoutClosingOnEarlyError
	  }, {
	    forEach: function forEach(fn) {
	      anObject(this);
	      try {
	        aCallable(fn);
	      } catch (error) {
	        iteratorClose(this, 'throw', error);
	      }
	      if (forEachWithoutClosingOnEarlyError) return call(forEachWithoutClosingOnEarlyError, this, fn);
	      var record = getIteratorDirect(this);
	      var counter = 0;
	      iterate(record, function (value) {
	        fn(value, counter++);
	      }, {
	        IS_RECORD: true
	      });
	    }
	  });
	  return es_iterator_forEach;
	}

	var hasRequiredEsnext_iterator_forEach;
	function requireEsnext_iterator_forEach() {
	  if (hasRequiredEsnext_iterator_forEach) return esnext_iterator_forEach;
	  hasRequiredEsnext_iterator_forEach = 1;
	  // TODO: Remove from `core-js@4`
	  requireEs_iterator_forEach();
	  return esnext_iterator_forEach;
	}

	requireEsnext_iterator_forEach();

	var getOwnPropertyNames = Object.getOwnPropertyNames, getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	 * Combine two comparators into a single comparators.
	 */
	function combineComparators(comparatorA, comparatorB) {
	    return function isEqual(a, b, state) {
	        return comparatorA(a, b, state) && comparatorB(a, b, state);
	    };
	}
	/**
	 * Wrap the provided `areItemsEqual` method to manage the circular state, allowing
	 * for circular references to be safely included in the comparison without creating
	 * stack overflows.
	 */
	function createIsCircular(areItemsEqual) {
	    return function isCircular(a, b, state) {
	        if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
	            return areItemsEqual(a, b, state);
	        }
	        var cache = state.cache;
	        var cachedA = cache.get(a);
	        var cachedB = cache.get(b);
	        if (cachedA && cachedB) {
	            return cachedA === b && cachedB === a;
	        }
	        cache.set(a, b);
	        cache.set(b, a);
	        var result = areItemsEqual(a, b, state);
	        cache.delete(a);
	        cache.delete(b);
	        return result;
	    };
	}
	/**
	 * Get the properties to strictly examine, which include both own properties that are
	 * not enumerable and symbol properties.
	 */
	function getStrictProperties(object) {
	    return getOwnPropertyNames(object).concat(getOwnPropertySymbols(object));
	}
	/**
	 * Whether the object contains the property passed as an own property.
	 */
	var hasOwn = Object.hasOwn ||
	    (function (object, property) {
	        return hasOwnProperty.call(object, property);
	    });
	/**
	 * Whether the values passed are strictly equal or both NaN.
	 */
	function sameValueZeroEqual(a, b) {
	    return a === b || (!a && !b && a !== a && b !== b);
	}

	var PREACT_VNODE = '__v';
	var PREACT_OWNER = '__o';
	var REACT_OWNER = '_owner';
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor, keys = Object.keys;
	/**
	 * Whether the arrays are equal in value.
	 */
	function areArraysEqual(a, b, state) {
	    var index = a.length;
	    if (b.length !== index) {
	        return false;
	    }
	    while (index-- > 0) {
	        if (!state.equals(a[index], b[index], index, index, a, b, state)) {
	            return false;
	        }
	    }
	    return true;
	}
	/**
	 * Whether the dates passed are equal in value.
	 */
	function areDatesEqual(a, b) {
	    return sameValueZeroEqual(a.getTime(), b.getTime());
	}
	/**
	 * Whether the errors passed are equal in value.
	 */
	function areErrorsEqual(a, b) {
	    return (a.name === b.name &&
	        a.message === b.message &&
	        a.cause === b.cause &&
	        a.stack === b.stack);
	}
	/**
	 * Whether the functions passed are equal in value.
	 */
	function areFunctionsEqual(a, b) {
	    return a === b;
	}
	/**
	 * Whether the `Map`s are equal in value.
	 */
	function areMapsEqual(a, b, state) {
	    var size = a.size;
	    if (size !== b.size) {
	        return false;
	    }
	    if (!size) {
	        return true;
	    }
	    var matchedIndices = new Array(size);
	    var aIterable = a.entries();
	    var aResult;
	    var bResult;
	    var index = 0;
	    while ((aResult = aIterable.next())) {
	        if (aResult.done) {
	            break;
	        }
	        var bIterable = b.entries();
	        var hasMatch = false;
	        var matchIndex = 0;
	        while ((bResult = bIterable.next())) {
	            if (bResult.done) {
	                break;
	            }
	            if (matchedIndices[matchIndex]) {
	                matchIndex++;
	                continue;
	            }
	            var aEntry = aResult.value;
	            var bEntry = bResult.value;
	            if (state.equals(aEntry[0], bEntry[0], index, matchIndex, a, b, state) &&
	                state.equals(aEntry[1], bEntry[1], aEntry[0], bEntry[0], a, b, state)) {
	                hasMatch = matchedIndices[matchIndex] = true;
	                break;
	            }
	            matchIndex++;
	        }
	        if (!hasMatch) {
	            return false;
	        }
	        index++;
	    }
	    return true;
	}
	/**
	 * Whether the numbers are equal in value.
	 */
	var areNumbersEqual = sameValueZeroEqual;
	/**
	 * Whether the objects are equal in value.
	 */
	function areObjectsEqual(a, b, state) {
	    var properties = keys(a);
	    var index = properties.length;
	    if (keys(b).length !== index) {
	        return false;
	    }
	    // Decrementing `while` showed faster results than either incrementing or
	    // decrementing `for` loop and than an incrementing `while` loop. Declarative
	    // methods like `some` / `every` were not used to avoid incurring the garbage
	    // cost of anonymous callbacks.
	    while (index-- > 0) {
	        if (!isPropertyEqual(a, b, state, properties[index])) {
	            return false;
	        }
	    }
	    return true;
	}
	/**
	 * Whether the objects are equal in value with strict property checking.
	 */
	function areObjectsEqualStrict(a, b, state) {
	    var properties = getStrictProperties(a);
	    var index = properties.length;
	    if (getStrictProperties(b).length !== index) {
	        return false;
	    }
	    var property;
	    var descriptorA;
	    var descriptorB;
	    // Decrementing `while` showed faster results than either incrementing or
	    // decrementing `for` loop and than an incrementing `while` loop. Declarative
	    // methods like `some` / `every` were not used to avoid incurring the garbage
	    // cost of anonymous callbacks.
	    while (index-- > 0) {
	        property = properties[index];
	        if (!isPropertyEqual(a, b, state, property)) {
	            return false;
	        }
	        descriptorA = getOwnPropertyDescriptor(a, property);
	        descriptorB = getOwnPropertyDescriptor(b, property);
	        if ((descriptorA || descriptorB) &&
	            (!descriptorA ||
	                !descriptorB ||
	                descriptorA.configurable !== descriptorB.configurable ||
	                descriptorA.enumerable !== descriptorB.enumerable ||
	                descriptorA.writable !== descriptorB.writable)) {
	            return false;
	        }
	    }
	    return true;
	}
	/**
	 * Whether the primitive wrappers passed are equal in value.
	 */
	function arePrimitiveWrappersEqual(a, b) {
	    return sameValueZeroEqual(a.valueOf(), b.valueOf());
	}
	/**
	 * Whether the regexps passed are equal in value.
	 */
	function areRegExpsEqual(a, b) {
	    return a.source === b.source && a.flags === b.flags;
	}
	/**
	 * Whether the `Set`s are equal in value.
	 */
	function areSetsEqual(a, b, state) {
	    var size = a.size;
	    if (size !== b.size) {
	        return false;
	    }
	    if (!size) {
	        return true;
	    }
	    var matchedIndices = new Array(size);
	    var aIterable = a.values();
	    var aResult;
	    var bResult;
	    while ((aResult = aIterable.next())) {
	        if (aResult.done) {
	            break;
	        }
	        var bIterable = b.values();
	        var hasMatch = false;
	        var matchIndex = 0;
	        while ((bResult = bIterable.next())) {
	            if (bResult.done) {
	                break;
	            }
	            if (!matchedIndices[matchIndex] &&
	                state.equals(aResult.value, bResult.value, aResult.value, bResult.value, a, b, state)) {
	                hasMatch = matchedIndices[matchIndex] = true;
	                break;
	            }
	            matchIndex++;
	        }
	        if (!hasMatch) {
	            return false;
	        }
	    }
	    return true;
	}
	/**
	 * Whether the TypedArray instances are equal in value.
	 */
	function areTypedArraysEqual(a, b) {
	    var index = a.length;
	    if (b.length !== index) {
	        return false;
	    }
	    while (index-- > 0) {
	        if (a[index] !== b[index]) {
	            return false;
	        }
	    }
	    return true;
	}
	/**
	 * Whether the URL instances are equal in value.
	 */
	function areUrlsEqual(a, b) {
	    return (a.hostname === b.hostname &&
	        a.pathname === b.pathname &&
	        a.protocol === b.protocol &&
	        a.port === b.port &&
	        a.hash === b.hash &&
	        a.username === b.username &&
	        a.password === b.password);
	}
	function isPropertyEqual(a, b, state, property) {
	    if ((property === REACT_OWNER ||
	        property === PREACT_OWNER ||
	        property === PREACT_VNODE) &&
	        (a.$$typeof || b.$$typeof)) {
	        return true;
	    }
	    return (hasOwn(b, property) &&
	        state.equals(a[property], b[property], property, property, a, b, state));
	}

	var ARGUMENTS_TAG = '[object Arguments]';
	var BOOLEAN_TAG = '[object Boolean]';
	var DATE_TAG = '[object Date]';
	var ERROR_TAG = '[object Error]';
	var MAP_TAG = '[object Map]';
	var NUMBER_TAG = '[object Number]';
	var OBJECT_TAG = '[object Object]';
	var REG_EXP_TAG = '[object RegExp]';
	var SET_TAG = '[object Set]';
	var STRING_TAG = '[object String]';
	var URL_TAG = '[object URL]';
	var isArray = Array.isArray;
	var isTypedArray = typeof ArrayBuffer === 'function' && ArrayBuffer.isView
	    ? ArrayBuffer.isView
	    : null;
	var assign = Object.assign;
	var getTag = Object.prototype.toString.call.bind(Object.prototype.toString);
	/**
	 * Create a comparator method based on the type-specific equality comparators passed.
	 */
	function createEqualityComparator(_a) {
	    var areArraysEqual = _a.areArraysEqual, areDatesEqual = _a.areDatesEqual, areErrorsEqual = _a.areErrorsEqual, areFunctionsEqual = _a.areFunctionsEqual, areMapsEqual = _a.areMapsEqual, areNumbersEqual = _a.areNumbersEqual, areObjectsEqual = _a.areObjectsEqual, arePrimitiveWrappersEqual = _a.arePrimitiveWrappersEqual, areRegExpsEqual = _a.areRegExpsEqual, areSetsEqual = _a.areSetsEqual, areTypedArraysEqual = _a.areTypedArraysEqual, areUrlsEqual = _a.areUrlsEqual;
	    /**
	     * compare the value of the two objects and return true if they are equivalent in values
	     */
	    return function comparator(a, b, state) {
	        // If the items are strictly equal, no need to do a value comparison.
	        if (a === b) {
	            return true;
	        }
	        // If either of the items are nullish and fail the strictly equal check
	        // above, then they must be unequal.
	        if (a == null || b == null) {
	            return false;
	        }
	        var type = typeof a;
	        if (type !== typeof b) {
	            return false;
	        }
	        if (type !== 'object') {
	            if (type === 'number') {
	                return areNumbersEqual(a, b, state);
	            }
	            if (type === 'function') {
	                return areFunctionsEqual(a, b, state);
	            }
	            // If a primitive value that is not strictly equal, it must be unequal.
	            return false;
	        }
	        var constructor = a.constructor;
	        // Checks are listed in order of commonality of use-case:
	        //   1. Common complex object types (plain object, array)
	        //   2. Common data values (date, regexp)
	        //   3. Less-common complex object types (map, set)
	        //   4. Less-common data values (promise, primitive wrappers)
	        // Inherently this is both subjective and assumptive, however
	        // when reviewing comparable libraries in the wild this order
	        // appears to be generally consistent.
	        // Constructors should match, otherwise there is potential for false positives
	        // between class and subclass or custom object and POJO.
	        if (constructor !== b.constructor) {
	            return false;
	        }
	        // `isPlainObject` only checks against the object's own realm. Cross-realm
	        // comparisons are rare, and will be handled in the ultimate fallback, so
	        // we can avoid capturing the string tag.
	        if (constructor === Object) {
	            return areObjectsEqual(a, b, state);
	        }
	        // `isArray()` works on subclasses and is cross-realm, so we can avoid capturing
	        // the string tag or doing an `instanceof` check.
	        if (isArray(a)) {
	            return areArraysEqual(a, b, state);
	        }
	        // `isTypedArray()` works on all possible TypedArray classes, so we can avoid
	        // capturing the string tag or comparing against all possible constructors.
	        if (isTypedArray != null && isTypedArray(a)) {
	            return areTypedArraysEqual(a, b, state);
	        }
	        // Try to fast-path equality checks for other complex object types in the
	        // same realm to avoid capturing the string tag. Strict equality is used
	        // instead of `instanceof` because it is more performant for the common
	        // use-case. If someone is subclassing a native class, it will be handled
	        // with the string tag comparison.
	        if (constructor === Date) {
	            return areDatesEqual(a, b, state);
	        }
	        if (constructor === RegExp) {
	            return areRegExpsEqual(a, b, state);
	        }
	        if (constructor === Map) {
	            return areMapsEqual(a, b, state);
	        }
	        if (constructor === Set) {
	            return areSetsEqual(a, b, state);
	        }
	        // Since this is a custom object, capture the string tag to determing its type.
	        // This is reasonably performant in modern environments like v8 and SpiderMonkey.
	        var tag = getTag(a);
	        if (tag === DATE_TAG) {
	            return areDatesEqual(a, b, state);
	        }
	        // For RegExp, the properties are not enumerable, and therefore will give false positives if
	        // tested like a standard object.
	        if (tag === REG_EXP_TAG) {
	            return areRegExpsEqual(a, b, state);
	        }
	        if (tag === MAP_TAG) {
	            return areMapsEqual(a, b, state);
	        }
	        if (tag === SET_TAG) {
	            return areSetsEqual(a, b, state);
	        }
	        if (tag === OBJECT_TAG) {
	            // The exception for value comparison is custom `Promise`-like class instances. These should
	            // be treated the same as standard `Promise` objects, which means strict equality, and if
	            // it reaches this point then that strict equality comparison has already failed.
	            return (typeof a.then !== 'function' &&
	                typeof b.then !== 'function' &&
	                areObjectsEqual(a, b, state));
	        }
	        // If a URL tag, it should be tested explicitly. Like RegExp, the properties are not
	        // enumerable, and therefore will give false positives if tested like a standard object.
	        if (tag === URL_TAG) {
	            return areUrlsEqual(a, b, state);
	        }
	        // If an error tag, it should be tested explicitly. Like RegExp, the properties are not
	        // enumerable, and therefore will give false positives if tested like a standard object.
	        if (tag === ERROR_TAG) {
	            return areErrorsEqual(a, b, state);
	        }
	        // If an arguments tag, it should be treated as a standard object.
	        if (tag === ARGUMENTS_TAG) {
	            return areObjectsEqual(a, b, state);
	        }
	        // As the penultimate fallback, check if the values passed are primitive wrappers. This
	        // is very rare in modern JS, which is why it is deprioritized compared to all other object
	        // types.
	        if (tag === BOOLEAN_TAG || tag === NUMBER_TAG || tag === STRING_TAG) {
	            return arePrimitiveWrappersEqual(a, b, state);
	        }
	        // If not matching any tags that require a specific type of comparison, then we hard-code false because
	        // the only thing remaining is strict equality, which has already been compared. This is for a few reasons:
	        //   - Certain types that cannot be introspected (e.g., `WeakMap`). For these types, this is the only
	        //     comparison that can be made.
	        //   - For types that can be introspected, but rarely have requirements to be compared
	        //     (`ArrayBuffer`, `DataView`, etc.), the cost is avoided to prioritize the common
	        //     use-cases (may be included in a future release, if requested enough).
	        //   - For types that can be introspected but do not have an objective definition of what
	        //     equality is (`Error`, etc.), the subjective decision is to be conservative and strictly compare.
	        // In all cases, these decisions should be reevaluated based on changes to the language and
	        // common development practices.
	        return false;
	    };
	}
	/**
	 * Create the configuration object used for building comparators.
	 */
	function createEqualityComparatorConfig(_a) {
	    var circular = _a.circular, createCustomConfig = _a.createCustomConfig, strict = _a.strict;
	    var config = {
	        areArraysEqual: strict
	            ? areObjectsEqualStrict
	            : areArraysEqual,
	        areDatesEqual: areDatesEqual,
	        areErrorsEqual: areErrorsEqual,
	        areFunctionsEqual: areFunctionsEqual,
	        areMapsEqual: strict
	            ? combineComparators(areMapsEqual, areObjectsEqualStrict)
	            : areMapsEqual,
	        areNumbersEqual: areNumbersEqual,
	        areObjectsEqual: strict
	            ? areObjectsEqualStrict
	            : areObjectsEqual,
	        arePrimitiveWrappersEqual: arePrimitiveWrappersEqual,
	        areRegExpsEqual: areRegExpsEqual,
	        areSetsEqual: strict
	            ? combineComparators(areSetsEqual, areObjectsEqualStrict)
	            : areSetsEqual,
	        areTypedArraysEqual: strict
	            ? areObjectsEqualStrict
	            : areTypedArraysEqual,
	        areUrlsEqual: areUrlsEqual,
	    };
	    if (createCustomConfig) {
	        config = assign({}, config, createCustomConfig(config));
	    }
	    if (circular) {
	        var areArraysEqual$1 = createIsCircular(config.areArraysEqual);
	        var areMapsEqual$1 = createIsCircular(config.areMapsEqual);
	        var areObjectsEqual$1 = createIsCircular(config.areObjectsEqual);
	        var areSetsEqual$1 = createIsCircular(config.areSetsEqual);
	        config = assign({}, config, {
	            areArraysEqual: areArraysEqual$1,
	            areMapsEqual: areMapsEqual$1,
	            areObjectsEqual: areObjectsEqual$1,
	            areSetsEqual: areSetsEqual$1,
	        });
	    }
	    return config;
	}
	/**
	 * Default equality comparator pass-through, used as the standard `isEqual` creator for
	 * use inside the built comparator.
	 */
	function createInternalEqualityComparator(compare) {
	    return function (a, b, _indexOrKeyA, _indexOrKeyB, _parentA, _parentB, state) {
	        return compare(a, b, state);
	    };
	}
	/**
	 * Create the `isEqual` function used by the consuming application.
	 */
	function createIsEqual(_a) {
	    var circular = _a.circular, comparator = _a.comparator, createState = _a.createState, equals = _a.equals, strict = _a.strict;
	    if (createState) {
	        return function isEqual(a, b) {
	            var _a = createState(), _b = _a.cache, cache = _b === void 0 ? circular ? new WeakMap() : undefined : _b, meta = _a.meta;
	            return comparator(a, b, {
	                cache: cache,
	                equals: equals,
	                meta: meta,
	                strict: strict,
	            });
	        };
	    }
	    if (circular) {
	        return function isEqual(a, b) {
	            return comparator(a, b, {
	                cache: new WeakMap(),
	                equals: equals,
	                meta: undefined,
	                strict: strict,
	            });
	        };
	    }
	    var state = {
	        cache: undefined,
	        equals: equals,
	        meta: undefined,
	        strict: strict,
	    };
	    return function isEqual(a, b) {
	        return comparator(a, b, state);
	    };
	}

	/**
	 * Whether the items passed are deeply-equal in value.
	 */
	var deepEqual = createCustomEqual();
	/**
	 * Whether the items passed are deeply-equal in value based on strict comparison.
	 */
	createCustomEqual({ strict: true });
	/**
	 * Whether the items passed are deeply-equal in value, including circular references.
	 */
	createCustomEqual({ circular: true });
	/**
	 * Whether the items passed are deeply-equal in value, including circular references,
	 * based on strict comparison.
	 */
	createCustomEqual({
	    circular: true,
	    strict: true,
	});
	/**
	 * Whether the items passed are shallowly-equal in value.
	 */
	createCustomEqual({
	    createInternalComparator: function () { return sameValueZeroEqual; },
	});
	/**
	 * Whether the items passed are shallowly-equal in value based on strict comparison
	 */
	createCustomEqual({
	    strict: true,
	    createInternalComparator: function () { return sameValueZeroEqual; },
	});
	/**
	 * Whether the items passed are shallowly-equal in value, including circular references.
	 */
	createCustomEqual({
	    circular: true,
	    createInternalComparator: function () { return sameValueZeroEqual; },
	});
	/**
	 * Whether the items passed are shallowly-equal in value, including circular references,
	 * based on strict comparison.
	 */
	createCustomEqual({
	    circular: true,
	    createInternalComparator: function () { return sameValueZeroEqual; },
	    strict: true,
	});
	/**
	 * Create a custom equality comparison method.
	 *
	 * This can be done to create very targeted comparisons in extreme hot-path scenarios
	 * where the standard methods are not performant enough, but can also be used to provide
	 * support for legacy environments that do not support expected features like
	 * `RegExp.prototype.flags` out of the box.
	 */
	function createCustomEqual(options) {
	    if (options === void 0) { options = {}; }
	    var _a = options.circular, circular = _a === void 0 ? false : _a, createCustomInternalComparator = options.createInternalComparator, createState = options.createState, _b = options.strict, strict = _b === void 0 ? false : _b;
	    var config = createEqualityComparatorConfig(options);
	    var comparator = createEqualityComparator(config);
	    var equals = createCustomInternalComparator
	        ? createCustomInternalComparator(comparator)
	        : createInternalEqualityComparator(comparator);
	    return createIsEqual({ circular: circular, comparator: comparator, createState: createState, equals: equals, strict: strict });
	}

	/**
	 * The default Grid algorithm historically used in Google Maps marker
	 * clustering.
	 *
	 * The Grid algorithm does not implement caching and markers may flash as the
	 * viewport changes. Instead use {@link SuperClusterAlgorithm}.
	 */
	class GridAlgorithm extends AbstractViewportAlgorithm {
	  constructor(_a) {
	    var {
	        maxDistance = 40000,
	        gridSize = 40
	      } = _a,
	      options = __rest(_a, ["maxDistance", "gridSize"]);
	    super(options);
	    this.clusters = [];
	    this.state = {
	      zoom: -1
	    };
	    this.maxDistance = maxDistance;
	    this.gridSize = gridSize;
	  }
	  calculate(_ref) {
	    let {
	      markers,
	      map,
	      mapCanvasProjection
	    } = _ref;
	    const zoom = map.getZoom();
	    assertNotNull(zoom);
	    const newState = {
	      zoom
	    };
	    let changed = false;
	    if (this.state.zoom >= this.maxZoom && newState.zoom >= this.maxZoom) ; else {
	      changed = !deepEqual(this.state, newState);
	    }
	    this.state = newState;
	    if (zoom >= this.maxZoom) {
	      return {
	        clusters: this.noop({
	          markers
	        }),
	        changed
	      };
	    }
	    return {
	      clusters: this.cluster({
	        markers: filterMarkersToPaddedViewport(map, mapCanvasProjection, markers, this.viewportPadding),
	        map,
	        mapCanvasProjection
	      })
	    };
	  }
	  cluster(_ref2) {
	    let {
	      markers,
	      map,
	      mapCanvasProjection
	    } = _ref2;
	    this.clusters = [];
	    markers.forEach(marker => {
	      this.addToClosestCluster(marker, map, mapCanvasProjection);
	    });
	    return this.clusters;
	  }
	  addToClosestCluster(marker, map, projection) {
	    let maxDistance = this.maxDistance; // Some large number
	    let cluster = null;
	    for (let i = 0; i < this.clusters.length; i++) {
	      const candidate = this.clusters[i];
	      assertNotNull(candidate.bounds);
	      const distance = distanceBetweenPoints(candidate.bounds.getCenter().toJSON(), MarkerUtils.getPosition(marker).toJSON());
	      if (distance < maxDistance) {
	        maxDistance = distance;
	        cluster = candidate;
	      }
	    }
	    if (cluster) {
	      assertNotNull(cluster.bounds);
	      if (extendBoundsToPaddedViewport(cluster.bounds, projection, this.gridSize).contains(MarkerUtils.getPosition(marker))) {
	        cluster.push(marker);
	      } else {
	        const cluster = new Cluster({
	          markers: [marker]
	        });
	        this.clusters.push(cluster);
	      }
	    } else {
	      const cluster = new Cluster({
	        markers: [marker]
	      });
	      this.clusters.push(cluster);
	    }
	  }
	}

	/**
	 * Noop algorithm does not generate any clusters or filter markers by the an extended viewport.
	 */
	class NoopAlgorithm extends AbstractAlgorithm {
	  constructor(_a) {
	    var options = __rest(_a, []);
	    super(options);
	  }
	  calculate(_ref) {
	    let {
	      markers,
	      map,
	      mapCanvasProjection
	    } = _ref;
	    return {
	      clusters: this.cluster({
	        markers,
	        map,
	        mapCanvasProjection
	      }),
	      changed: false
	    };
	  }
	  cluster(input) {
	    return this.noop(input);
	  }
	}

	const ARRAY_TYPES = [Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];

	/** @typedef {Int8ArrayConstructor | Uint8ArrayConstructor | Uint8ClampedArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Int32ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor} TypedArrayConstructor */

	const VERSION = 1; // serialized format version
	const HEADER_SIZE = 8;
	class KDBush {
	  /**
	   * Creates an index from raw `ArrayBuffer` data.
	   * @param {ArrayBuffer} data
	   */
	  static from(data) {
	    if (!(data instanceof ArrayBuffer)) {
	      throw new Error('Data must be an instance of ArrayBuffer.');
	    }
	    const [magic, versionAndType] = new Uint8Array(data, 0, 2);
	    if (magic !== 0xdb) {
	      throw new Error('Data does not appear to be in a KDBush format.');
	    }
	    const version = versionAndType >> 4;
	    if (version !== VERSION) {
	      throw new Error(`Got v${version} data when expected v${VERSION}.`);
	    }
	    const ArrayType = ARRAY_TYPES[versionAndType & 0x0f];
	    if (!ArrayType) {
	      throw new Error('Unrecognized array type.');
	    }
	    const [nodeSize] = new Uint16Array(data, 2, 1);
	    const [numItems] = new Uint32Array(data, 4, 1);
	    return new KDBush(numItems, nodeSize, ArrayType, data);
	  }

	  /**
	   * Creates an index that will hold a given number of items.
	   * @param {number} numItems
	   * @param {number} [nodeSize=64] Size of the KD-tree node (64 by default).
	   * @param {TypedArrayConstructor} [ArrayType=Float64Array] The array type used for coordinates storage (`Float64Array` by default).
	   * @param {ArrayBuffer} [data] (For internal use only)
	   */
	  constructor(numItems, nodeSize = 64, ArrayType = Float64Array, data) {
	    if (isNaN(numItems) || numItems < 0) throw new Error(`Unpexpected numItems value: ${numItems}.`);
	    this.numItems = +numItems;
	    this.nodeSize = Math.min(Math.max(+nodeSize, 2), 65535);
	    this.ArrayType = ArrayType;
	    this.IndexArrayType = numItems < 65536 ? Uint16Array : Uint32Array;
	    const arrayTypeIndex = ARRAY_TYPES.indexOf(this.ArrayType);
	    const coordsByteSize = numItems * 2 * this.ArrayType.BYTES_PER_ELEMENT;
	    const idsByteSize = numItems * this.IndexArrayType.BYTES_PER_ELEMENT;
	    const padCoords = (8 - idsByteSize % 8) % 8;
	    if (arrayTypeIndex < 0) {
	      throw new Error(`Unexpected typed array class: ${ArrayType}.`);
	    }
	    if (data && data instanceof ArrayBuffer) {
	      // reconstruct an index from a buffer
	      this.data = data;
	      this.ids = new this.IndexArrayType(this.data, HEADER_SIZE, numItems);
	      this.coords = new this.ArrayType(this.data, HEADER_SIZE + idsByteSize + padCoords, numItems * 2);
	      this._pos = numItems * 2;
	      this._finished = true;
	    } else {
	      // initialize a new index
	      this.data = new ArrayBuffer(HEADER_SIZE + coordsByteSize + idsByteSize + padCoords);
	      this.ids = new this.IndexArrayType(this.data, HEADER_SIZE, numItems);
	      this.coords = new this.ArrayType(this.data, HEADER_SIZE + idsByteSize + padCoords, numItems * 2);
	      this._pos = 0;
	      this._finished = false;

	      // set header
	      new Uint8Array(this.data, 0, 2).set([0xdb, (VERSION << 4) + arrayTypeIndex]);
	      new Uint16Array(this.data, 2, 1)[0] = nodeSize;
	      new Uint32Array(this.data, 4, 1)[0] = numItems;
	    }
	  }

	  /**
	   * Add a point to the index.
	   * @param {number} x
	   * @param {number} y
	   * @returns {number} An incremental index associated with the added item (starting from `0`).
	   */
	  add(x, y) {
	    const index = this._pos >> 1;
	    this.ids[index] = index;
	    this.coords[this._pos++] = x;
	    this.coords[this._pos++] = y;
	    return index;
	  }

	  /**
	   * Perform indexing of the added points.
	   */
	  finish() {
	    const numAdded = this._pos >> 1;
	    if (numAdded !== this.numItems) {
	      throw new Error(`Added ${numAdded} items when expected ${this.numItems}.`);
	    }
	    // kd-sort both arrays for efficient search
	    sort(this.ids, this.coords, this.nodeSize, 0, this.numItems - 1, 0);
	    this._finished = true;
	    return this;
	  }

	  /**
	   * Search the index for items within a given bounding box.
	   * @param {number} minX
	   * @param {number} minY
	   * @param {number} maxX
	   * @param {number} maxY
	   * @returns {number[]} An array of indices correponding to the found items.
	   */
	  range(minX, minY, maxX, maxY) {
	    if (!this._finished) throw new Error('Data not yet indexed - call index.finish().');
	    const {
	      ids,
	      coords,
	      nodeSize
	    } = this;
	    const stack = [0, ids.length - 1, 0];
	    const result = [];

	    // recursively search for items in range in the kd-sorted arrays
	    while (stack.length) {
	      const axis = stack.pop() || 0;
	      const right = stack.pop() || 0;
	      const left = stack.pop() || 0;

	      // if we reached "tree node", search linearly
	      if (right - left <= nodeSize) {
	        for (let i = left; i <= right; i++) {
	          const x = coords[2 * i];
	          const y = coords[2 * i + 1];
	          if (x >= minX && x <= maxX && y >= minY && y <= maxY) result.push(ids[i]);
	        }
	        continue;
	      }

	      // otherwise find the middle index
	      const m = left + right >> 1;

	      // include the middle item if it's in range
	      const x = coords[2 * m];
	      const y = coords[2 * m + 1];
	      if (x >= minX && x <= maxX && y >= minY && y <= maxY) result.push(ids[m]);

	      // queue search in halves that intersect the query
	      if (axis === 0 ? minX <= x : minY <= y) {
	        stack.push(left);
	        stack.push(m - 1);
	        stack.push(1 - axis);
	      }
	      if (axis === 0 ? maxX >= x : maxY >= y) {
	        stack.push(m + 1);
	        stack.push(right);
	        stack.push(1 - axis);
	      }
	    }
	    return result;
	  }

	  /**
	   * Search the index for items within a given radius.
	   * @param {number} qx
	   * @param {number} qy
	   * @param {number} r Query radius.
	   * @returns {number[]} An array of indices correponding to the found items.
	   */
	  within(qx, qy, r) {
	    if (!this._finished) throw new Error('Data not yet indexed - call index.finish().');
	    const {
	      ids,
	      coords,
	      nodeSize
	    } = this;
	    const stack = [0, ids.length - 1, 0];
	    const result = [];
	    const r2 = r * r;

	    // recursively search for items within radius in the kd-sorted arrays
	    while (stack.length) {
	      const axis = stack.pop() || 0;
	      const right = stack.pop() || 0;
	      const left = stack.pop() || 0;

	      // if we reached "tree node", search linearly
	      if (right - left <= nodeSize) {
	        for (let i = left; i <= right; i++) {
	          if (sqDist(coords[2 * i], coords[2 * i + 1], qx, qy) <= r2) result.push(ids[i]);
	        }
	        continue;
	      }

	      // otherwise find the middle index
	      const m = left + right >> 1;

	      // include the middle item if it's in range
	      const x = coords[2 * m];
	      const y = coords[2 * m + 1];
	      if (sqDist(x, y, qx, qy) <= r2) result.push(ids[m]);

	      // queue search in halves that intersect the query
	      if (axis === 0 ? qx - r <= x : qy - r <= y) {
	        stack.push(left);
	        stack.push(m - 1);
	        stack.push(1 - axis);
	      }
	      if (axis === 0 ? qx + r >= x : qy + r >= y) {
	        stack.push(m + 1);
	        stack.push(right);
	        stack.push(1 - axis);
	      }
	    }
	    return result;
	  }
	}

	/**
	 * @param {Uint16Array | Uint32Array} ids
	 * @param {InstanceType<TypedArrayConstructor>} coords
	 * @param {number} nodeSize
	 * @param {number} left
	 * @param {number} right
	 * @param {number} axis
	 */
	function sort(ids, coords, nodeSize, left, right, axis) {
	  if (right - left <= nodeSize) return;
	  const m = left + right >> 1; // middle index

	  // sort ids and coords around the middle index so that the halves lie
	  // either left/right or top/bottom correspondingly (taking turns)
	  select(ids, coords, m, left, right, axis);

	  // recursively kd-sort first half and second half on the opposite axis
	  sort(ids, coords, nodeSize, left, m - 1, 1 - axis);
	  sort(ids, coords, nodeSize, m + 1, right, 1 - axis);
	}

	/**
	 * Custom Floyd-Rivest selection algorithm: sort ids and coords so that
	 * [left..k-1] items are smaller than k-th item (on either x or y axis)
	 * @param {Uint16Array | Uint32Array} ids
	 * @param {InstanceType<TypedArrayConstructor>} coords
	 * @param {number} k
	 * @param {number} left
	 * @param {number} right
	 * @param {number} axis
	 */
	function select(ids, coords, k, left, right, axis) {
	  while (right > left) {
	    if (right - left > 600) {
	      const n = right - left + 1;
	      const m = k - left + 1;
	      const z = Math.log(n);
	      const s = 0.5 * Math.exp(2 * z / 3);
	      const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
	      const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
	      const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
	      select(ids, coords, k, newLeft, newRight, axis);
	    }
	    const t = coords[2 * k + axis];
	    let i = left;
	    let j = right;
	    swapItem(ids, coords, left, k);
	    if (coords[2 * right + axis] > t) swapItem(ids, coords, left, right);
	    while (i < j) {
	      swapItem(ids, coords, i, j);
	      i++;
	      j--;
	      while (coords[2 * i + axis] < t) i++;
	      while (coords[2 * j + axis] > t) j--;
	    }
	    if (coords[2 * left + axis] === t) swapItem(ids, coords, left, j);else {
	      j++;
	      swapItem(ids, coords, j, right);
	    }
	    if (j <= k) left = j + 1;
	    if (k <= j) right = j - 1;
	  }
	}

	/**
	 * @param {Uint16Array | Uint32Array} ids
	 * @param {InstanceType<TypedArrayConstructor>} coords
	 * @param {number} i
	 * @param {number} j
	 */
	function swapItem(ids, coords, i, j) {
	  swap(ids, i, j);
	  swap(coords, 2 * i, 2 * j);
	  swap(coords, 2 * i + 1, 2 * j + 1);
	}

	/**
	 * @param {InstanceType<TypedArrayConstructor>} arr
	 * @param {number} i
	 * @param {number} j
	 */
	function swap(arr, i, j) {
	  const tmp = arr[i];
	  arr[i] = arr[j];
	  arr[j] = tmp;
	}

	/**
	 * @param {number} ax
	 * @param {number} ay
	 * @param {number} bx
	 * @param {number} by
	 */
	function sqDist(ax, ay, bx, by) {
	  const dx = ax - bx;
	  const dy = ay - by;
	  return dx * dx + dy * dy;
	}

	const defaultOptions = {
	  minZoom: 0,
	  // min zoom to generate clusters on
	  maxZoom: 16,
	  // max zoom level to cluster the points on
	  minPoints: 2,
	  // minimum points to form a cluster
	  radius: 40,
	  // cluster radius in pixels
	  extent: 512,
	  // tile extent (radius is calculated relative to it)
	  nodeSize: 64,
	  // size of the KD-tree leaf node, affects performance
	  log: false,
	  // whether to log timing info

	  // whether to generate numeric ids for input features (in vector tiles)
	  generateId: false,
	  // a reduce function for calculating custom cluster properties
	  reduce: null,
	  // (accumulated, props) => { accumulated.sum += props.sum; }

	  // properties to use for individual points when running the reducer
	  map: props => props // props => ({sum: props.my_value})
	};
	const fround = Math.fround || (tmp => x => {
	  tmp[0] = +x;
	  return tmp[0];
	})(new Float32Array(1));
	const OFFSET_ZOOM = 2;
	const OFFSET_ID = 3;
	const OFFSET_PARENT = 4;
	const OFFSET_NUM = 5;
	const OFFSET_PROP = 6;
	class Supercluster {
	  constructor(options) {
	    this.options = Object.assign(Object.create(defaultOptions), options);
	    this.trees = new Array(this.options.maxZoom + 1);
	    this.stride = this.options.reduce ? 7 : 6;
	    this.clusterProps = [];
	  }
	  load(points) {
	    const {
	      log,
	      minZoom,
	      maxZoom
	    } = this.options;
	    if (log) console.time('total time');
	    const timerId = `prepare ${points.length} points`;
	    if (log) console.time(timerId);
	    this.points = points;

	    // generate a cluster object for each point and index input points into a KD-tree
	    const data = [];
	    for (let i = 0; i < points.length; i++) {
	      const p = points[i];
	      if (!p.geometry) continue;
	      const [lng, lat] = p.geometry.coordinates;
	      const x = fround(lngX(lng));
	      const y = fround(latY(lat));
	      // store internal point/cluster data in flat numeric arrays for performance
	      data.push(x, y,
	      // projected point coordinates
	      Infinity,
	      // the last zoom the point was processed at
	      i,
	      // index of the source feature in the original input array
	      -1,
	      // parent cluster id
	      1 // number of points in a cluster
	      );
	      if (this.options.reduce) data.push(0); // noop
	    }
	    let tree = this.trees[maxZoom + 1] = this._createTree(data);
	    if (log) console.timeEnd(timerId);

	    // cluster points on max zoom, then cluster the results on previous zoom, etc.;
	    // results in a cluster hierarchy across zoom levels
	    for (let z = maxZoom; z >= minZoom; z--) {
	      const now = +Date.now();

	      // create a new set of clusters for the zoom and index them with a KD-tree
	      tree = this.trees[z] = this._createTree(this._cluster(tree, z));
	      if (log) console.log('z%d: %d clusters in %dms', z, tree.numItems, +Date.now() - now);
	    }
	    if (log) console.timeEnd('total time');
	    return this;
	  }
	  getClusters(bbox, zoom) {
	    let minLng = ((bbox[0] + 180) % 360 + 360) % 360 - 180;
	    const minLat = Math.max(-90, Math.min(90, bbox[1]));
	    let maxLng = bbox[2] === 180 ? 180 : ((bbox[2] + 180) % 360 + 360) % 360 - 180;
	    const maxLat = Math.max(-90, Math.min(90, bbox[3]));
	    if (bbox[2] - bbox[0] >= 360) {
	      minLng = -180;
	      maxLng = 180;
	    } else if (minLng > maxLng) {
	      const easternHem = this.getClusters([minLng, minLat, 180, maxLat], zoom);
	      const westernHem = this.getClusters([-180, minLat, maxLng, maxLat], zoom);
	      return easternHem.concat(westernHem);
	    }
	    const tree = this.trees[this._limitZoom(zoom)];
	    const ids = tree.range(lngX(minLng), latY(maxLat), lngX(maxLng), latY(minLat));
	    const data = tree.data;
	    const clusters = [];
	    for (const id of ids) {
	      const k = this.stride * id;
	      clusters.push(data[k + OFFSET_NUM] > 1 ? getClusterJSON(data, k, this.clusterProps) : this.points[data[k + OFFSET_ID]]);
	    }
	    return clusters;
	  }
	  getChildren(clusterId) {
	    const originId = this._getOriginId(clusterId);
	    const originZoom = this._getOriginZoom(clusterId);
	    const errorMsg = 'No cluster with the specified id.';
	    const tree = this.trees[originZoom];
	    if (!tree) throw new Error(errorMsg);
	    const data = tree.data;
	    if (originId * this.stride >= data.length) throw new Error(errorMsg);
	    const r = this.options.radius / (this.options.extent * Math.pow(2, originZoom - 1));
	    const x = data[originId * this.stride];
	    const y = data[originId * this.stride + 1];
	    const ids = tree.within(x, y, r);
	    const children = [];
	    for (const id of ids) {
	      const k = id * this.stride;
	      if (data[k + OFFSET_PARENT] === clusterId) {
	        children.push(data[k + OFFSET_NUM] > 1 ? getClusterJSON(data, k, this.clusterProps) : this.points[data[k + OFFSET_ID]]);
	      }
	    }
	    if (children.length === 0) throw new Error(errorMsg);
	    return children;
	  }
	  getLeaves(clusterId, limit, offset) {
	    limit = limit || 10;
	    offset = offset || 0;
	    const leaves = [];
	    this._appendLeaves(leaves, clusterId, limit, offset, 0);
	    return leaves;
	  }
	  getTile(z, x, y) {
	    const tree = this.trees[this._limitZoom(z)];
	    const z2 = Math.pow(2, z);
	    const {
	      extent,
	      radius
	    } = this.options;
	    const p = radius / extent;
	    const top = (y - p) / z2;
	    const bottom = (y + 1 + p) / z2;
	    const tile = {
	      features: []
	    };
	    this._addTileFeatures(tree.range((x - p) / z2, top, (x + 1 + p) / z2, bottom), tree.data, x, y, z2, tile);
	    if (x === 0) {
	      this._addTileFeatures(tree.range(1 - p / z2, top, 1, bottom), tree.data, z2, y, z2, tile);
	    }
	    if (x === z2 - 1) {
	      this._addTileFeatures(tree.range(0, top, p / z2, bottom), tree.data, -1, y, z2, tile);
	    }
	    return tile.features.length ? tile : null;
	  }
	  getClusterExpansionZoom(clusterId) {
	    let expansionZoom = this._getOriginZoom(clusterId) - 1;
	    while (expansionZoom <= this.options.maxZoom) {
	      const children = this.getChildren(clusterId);
	      expansionZoom++;
	      if (children.length !== 1) break;
	      clusterId = children[0].properties.cluster_id;
	    }
	    return expansionZoom;
	  }
	  _appendLeaves(result, clusterId, limit, offset, skipped) {
	    const children = this.getChildren(clusterId);
	    for (const child of children) {
	      const props = child.properties;
	      if (props && props.cluster) {
	        if (skipped + props.point_count <= offset) {
	          // skip the whole cluster
	          skipped += props.point_count;
	        } else {
	          // enter the cluster
	          skipped = this._appendLeaves(result, props.cluster_id, limit, offset, skipped);
	          // exit the cluster
	        }
	      } else if (skipped < offset) {
	        // skip a single point
	        skipped++;
	      } else {
	        // add a single point
	        result.push(child);
	      }
	      if (result.length === limit) break;
	    }
	    return skipped;
	  }
	  _createTree(data) {
	    const tree = new KDBush(data.length / this.stride | 0, this.options.nodeSize, Float32Array);
	    for (let i = 0; i < data.length; i += this.stride) tree.add(data[i], data[i + 1]);
	    tree.finish();
	    tree.data = data;
	    return tree;
	  }
	  _addTileFeatures(ids, data, x, y, z2, tile) {
	    for (const i of ids) {
	      const k = i * this.stride;
	      const isCluster = data[k + OFFSET_NUM] > 1;
	      let tags, px, py;
	      if (isCluster) {
	        tags = getClusterProperties(data, k, this.clusterProps);
	        px = data[k];
	        py = data[k + 1];
	      } else {
	        const p = this.points[data[k + OFFSET_ID]];
	        tags = p.properties;
	        const [lng, lat] = p.geometry.coordinates;
	        px = lngX(lng);
	        py = latY(lat);
	      }
	      const f = {
	        type: 1,
	        geometry: [[Math.round(this.options.extent * (px * z2 - x)), Math.round(this.options.extent * (py * z2 - y))]],
	        tags
	      };

	      // assign id
	      let id;
	      if (isCluster || this.options.generateId) {
	        // optionally generate id for points
	        id = data[k + OFFSET_ID];
	      } else {
	        // keep id if already assigned
	        id = this.points[data[k + OFFSET_ID]].id;
	      }
	      if (id !== undefined) f.id = id;
	      tile.features.push(f);
	    }
	  }
	  _limitZoom(z) {
	    return Math.max(this.options.minZoom, Math.min(Math.floor(+z), this.options.maxZoom + 1));
	  }
	  _cluster(tree, zoom) {
	    const {
	      radius,
	      extent,
	      reduce,
	      minPoints
	    } = this.options;
	    const r = radius / (extent * Math.pow(2, zoom));
	    const data = tree.data;
	    const nextData = [];
	    const stride = this.stride;

	    // loop through each point
	    for (let i = 0; i < data.length; i += stride) {
	      // if we've already visited the point at this zoom level, skip it
	      if (data[i + OFFSET_ZOOM] <= zoom) continue;
	      data[i + OFFSET_ZOOM] = zoom;

	      // find all nearby points
	      const x = data[i];
	      const y = data[i + 1];
	      const neighborIds = tree.within(data[i], data[i + 1], r);
	      const numPointsOrigin = data[i + OFFSET_NUM];
	      let numPoints = numPointsOrigin;

	      // count the number of points in a potential cluster
	      for (const neighborId of neighborIds) {
	        const k = neighborId * stride;
	        // filter out neighbors that are already processed
	        if (data[k + OFFSET_ZOOM] > zoom) numPoints += data[k + OFFSET_NUM];
	      }

	      // if there were neighbors to merge, and there are enough points to form a cluster
	      if (numPoints > numPointsOrigin && numPoints >= minPoints) {
	        let wx = x * numPointsOrigin;
	        let wy = y * numPointsOrigin;
	        let clusterProperties;
	        let clusterPropIndex = -1;

	        // encode both zoom and point index on which the cluster originated -- offset by total length of features
	        const id = ((i / stride | 0) << 5) + (zoom + 1) + this.points.length;
	        for (const neighborId of neighborIds) {
	          const k = neighborId * stride;
	          if (data[k + OFFSET_ZOOM] <= zoom) continue;
	          data[k + OFFSET_ZOOM] = zoom; // save the zoom (so it doesn't get processed twice)

	          const numPoints2 = data[k + OFFSET_NUM];
	          wx += data[k] * numPoints2; // accumulate coordinates for calculating weighted center
	          wy += data[k + 1] * numPoints2;
	          data[k + OFFSET_PARENT] = id;
	          if (reduce) {
	            if (!clusterProperties) {
	              clusterProperties = this._map(data, i, true);
	              clusterPropIndex = this.clusterProps.length;
	              this.clusterProps.push(clusterProperties);
	            }
	            reduce(clusterProperties, this._map(data, k));
	          }
	        }
	        data[i + OFFSET_PARENT] = id;
	        nextData.push(wx / numPoints, wy / numPoints, Infinity, id, -1, numPoints);
	        if (reduce) nextData.push(clusterPropIndex);
	      } else {
	        // left points as unclustered
	        for (let j = 0; j < stride; j++) nextData.push(data[i + j]);
	        if (numPoints > 1) {
	          for (const neighborId of neighborIds) {
	            const k = neighborId * stride;
	            if (data[k + OFFSET_ZOOM] <= zoom) continue;
	            data[k + OFFSET_ZOOM] = zoom;
	            for (let j = 0; j < stride; j++) nextData.push(data[k + j]);
	          }
	        }
	      }
	    }
	    return nextData;
	  }

	  // get index of the point from which the cluster originated
	  _getOriginId(clusterId) {
	    return clusterId - this.points.length >> 5;
	  }

	  // get zoom of the point from which the cluster originated
	  _getOriginZoom(clusterId) {
	    return (clusterId - this.points.length) % 32;
	  }
	  _map(data, i, clone) {
	    if (data[i + OFFSET_NUM] > 1) {
	      const props = this.clusterProps[data[i + OFFSET_PROP]];
	      return clone ? Object.assign({}, props) : props;
	    }
	    const original = this.points[data[i + OFFSET_ID]].properties;
	    const result = this.options.map(original);
	    return clone && result === original ? Object.assign({}, result) : result;
	  }
	}
	function getClusterJSON(data, i, clusterProps) {
	  return {
	    type: 'Feature',
	    id: data[i + OFFSET_ID],
	    properties: getClusterProperties(data, i, clusterProps),
	    geometry: {
	      type: 'Point',
	      coordinates: [xLng(data[i]), yLat(data[i + 1])]
	    }
	  };
	}
	function getClusterProperties(data, i, clusterProps) {
	  const count = data[i + OFFSET_NUM];
	  const abbrev = count >= 10000 ? `${Math.round(count / 1000)}k` : count >= 1000 ? `${Math.round(count / 100) / 10}k` : count;
	  const propIndex = data[i + OFFSET_PROP];
	  const properties = propIndex === -1 ? {} : Object.assign({}, clusterProps[propIndex]);
	  return Object.assign(properties, {
	    cluster: true,
	    cluster_id: data[i + OFFSET_ID],
	    point_count: count,
	    point_count_abbreviated: abbrev
	  });
	}

	// longitude/latitude to spherical mercator in [0..1] range
	function lngX(lng) {
	  return lng / 360 + 0.5;
	}
	function latY(lat) {
	  const sin = Math.sin(lat * Math.PI / 180);
	  const y = 0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI;
	  return y < 0 ? 0 : y > 1 ? 1 : y;
	}

	// spherical mercator to longitude/latitude
	function xLng(x) {
	  return (x - 0.5) * 360;
	}
	function yLat(y) {
	  const y2 = (180 - y * 360) * Math.PI / 180;
	  return 360 * Math.atan(Math.exp(y2)) / Math.PI - 90;
	}

	/**
	 * A very fast JavaScript algorithm for geospatial point clustering using KD trees.
	 *
	 * @see https://www.npmjs.com/package/supercluster for more information on options.
	 */
	class SuperClusterAlgorithm extends AbstractAlgorithm {
	  constructor(_a) {
	    var {
	        maxZoom,
	        radius = 60
	      } = _a,
	      options = __rest(_a, ["maxZoom", "radius"]);
	    super({
	      maxZoom
	    });
	    this.markers = [];
	    this.clusters = [];
	    this.state = {
	      zoom: -1
	    };
	    this.superCluster = new Supercluster(Object.assign({
	      maxZoom: this.maxZoom,
	      radius
	    }, options));
	  }
	  calculate(input) {
	    let changed = false;
	    let zoom = input.map.getZoom();
	    assertNotNull(zoom);
	    zoom = Math.round(zoom);
	    const state = {
	      zoom: zoom
	    };
	    if (!deepEqual(input.markers, this.markers)) {
	      changed = true;
	      // TODO use proxy to avoid copy?
	      this.markers = [...input.markers];
	      const points = this.markers.map(marker => {
	        const position = MarkerUtils.getPosition(marker);
	        const coordinates = [position.lng(), position.lat()];
	        return {
	          type: "Feature",
	          geometry: {
	            type: "Point",
	            coordinates
	          },
	          properties: {
	            marker
	          }
	        };
	      });
	      this.superCluster.load(points);
	    }
	    if (!changed) {
	      if (this.state.zoom <= this.maxZoom || state.zoom <= this.maxZoom) {
	        changed = !deepEqual(this.state, state);
	      }
	    }
	    this.state = state;
	    // when input is empty, return right away
	    if (input.markers.length === 0) {
	      this.clusters = [];
	      return {
	        clusters: this.clusters,
	        changed
	      };
	    }
	    if (changed) {
	      this.clusters = this.cluster(input);
	    }
	    return {
	      clusters: this.clusters,
	      changed
	    };
	  }
	  cluster(_ref) {
	    let {
	      map
	    } = _ref;
	    const zoom = map.getZoom();
	    assertNotNull(zoom);
	    return this.superCluster.getClusters([-180, -90, 180, 90], Math.round(zoom)).map(feature => this.transformCluster(feature));
	  }
	  transformCluster(_ref2) {
	    let {
	      geometry: {
	        coordinates: [lng, lat]
	      },
	      properties
	    } = _ref2;
	    if (properties.cluster) {
	      return new Cluster({
	        markers: this.superCluster.getLeaves(properties.cluster_id, Infinity).map(leaf => leaf.properties.marker),
	        position: {
	          lat,
	          lng
	        }
	      });
	    }
	    const marker = properties.marker;
	    return new Cluster({
	      markers: [marker],
	      position: MarkerUtils.getPosition(marker)
	    });
	  }
	}

	/**
	 * A very fast JavaScript algorithm for geospatial point clustering using KD trees.
	 *
	 * @see https://www.npmjs.com/package/supercluster for more information on options.
	 */
	class SuperClusterViewportAlgorithm extends AbstractViewportAlgorithm {
	  constructor(_a) {
	    var {
	        maxZoom,
	        radius = 60,
	        viewportPadding = 60
	      } = _a,
	      options = __rest(_a, ["maxZoom", "radius", "viewportPadding"]);
	    super({
	      maxZoom,
	      viewportPadding
	    });
	    this.markers = [];
	    this.clusters = [];
	    this.superCluster = new Supercluster(Object.assign({
	      maxZoom: this.maxZoom,
	      radius
	    }, options));
	    this.state = {
	      zoom: -1,
	      view: [0, 0, 0, 0]
	    };
	  }
	  calculate(input) {
	    const state = this.getViewportState(input);
	    let changed = !deepEqual(this.state, state);
	    if (!deepEqual(input.markers, this.markers)) {
	      changed = true;
	      // TODO use proxy to avoid copy?
	      this.markers = [...input.markers];
	      const points = this.markers.map(marker => {
	        const position = MarkerUtils.getPosition(marker);
	        const coordinates = [position.lng(), position.lat()];
	        return {
	          type: "Feature",
	          geometry: {
	            type: "Point",
	            coordinates
	          },
	          properties: {
	            marker
	          }
	        };
	      });
	      this.superCluster.load(points);
	    }
	    if (changed) {
	      this.clusters = this.cluster(input);
	      this.state = state;
	    }
	    return {
	      clusters: this.clusters,
	      changed
	    };
	  }
	  cluster(input) {
	    /* recalculate new state because we can't use the cached version. */
	    const state = this.getViewportState(input);
	    return this.superCluster.getClusters(state.view, state.zoom).map(feature => this.transformCluster(feature));
	  }
	  transformCluster(_ref) {
	    let {
	      geometry: {
	        coordinates: [lng, lat]
	      },
	      properties
	    } = _ref;
	    if (properties.cluster) {
	      return new Cluster({
	        markers: this.superCluster.getLeaves(properties.cluster_id, Infinity).map(leaf => leaf.properties.marker),
	        position: {
	          lat,
	          lng
	        }
	      });
	    }
	    const marker = properties.marker;
	    return new Cluster({
	      markers: [marker],
	      position: MarkerUtils.getPosition(marker)
	    });
	  }
	  getViewportState(input) {
	    const mapZoom = input.map.getZoom();
	    const mapBounds = input.map.getBounds();
	    assertNotNull(mapZoom);
	    assertNotNull(mapBounds);
	    return {
	      zoom: Math.round(mapZoom),
	      view: getPaddedViewport(mapBounds, input.mapCanvasProjection, this.viewportPadding)
	    };
	  }
	}

	var esnext_iterator_reduce = {};

	var es_iterator_reduce = {};

	var functionApply;
	var hasRequiredFunctionApply;
	function requireFunctionApply() {
	  if (hasRequiredFunctionApply) return functionApply;
	  hasRequiredFunctionApply = 1;
	  var NATIVE_BIND = requireFunctionBindNative();
	  var FunctionPrototype = Function.prototype;
	  var apply = FunctionPrototype.apply;
	  var call = FunctionPrototype.call;

	  // eslint-disable-next-line es/no-function-prototype-bind, es/no-reflect -- safe
	  functionApply = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
	    return call.apply(apply, arguments);
	  });
	  return functionApply;
	}

	var hasRequiredEs_iterator_reduce;
	function requireEs_iterator_reduce() {
	  if (hasRequiredEs_iterator_reduce) return es_iterator_reduce;
	  hasRequiredEs_iterator_reduce = 1;
	  var $ = require_export();
	  var iterate = requireIterate();
	  var aCallable = requireACallable();
	  var anObject = requireAnObject();
	  var getIteratorDirect = requireGetIteratorDirect();
	  var iteratorClose = requireIteratorClose();
	  var iteratorHelperWithoutClosingOnEarlyError = requireIteratorHelperWithoutClosingOnEarlyError();
	  var apply = requireFunctionApply();
	  var fails = requireFails();
	  var $TypeError = TypeError;

	  // https://bugs.webkit.org/show_bug.cgi?id=291651
	  var FAILS_ON_INITIAL_UNDEFINED = fails(function () {
	    // eslint-disable-next-line es/no-iterator-prototype-reduce, es/no-array-prototype-keys, array-callback-return -- required for testing
	    [].keys().reduce(function () {/* empty */}, undefined);
	  });
	  var reduceWithoutClosingOnEarlyError = !FAILS_ON_INITIAL_UNDEFINED && iteratorHelperWithoutClosingOnEarlyError('reduce', $TypeError);

	  // `Iterator.prototype.reduce` method
	  // https://tc39.es/ecma262/#sec-iterator.prototype.reduce
	  $({
	    target: 'Iterator',
	    proto: true,
	    real: true,
	    forced: FAILS_ON_INITIAL_UNDEFINED || reduceWithoutClosingOnEarlyError
	  }, {
	    reduce: function reduce(reducer /* , initialValue */) {
	      anObject(this);
	      try {
	        aCallable(reducer);
	      } catch (error) {
	        iteratorClose(this, 'throw', error);
	      }
	      var noInitial = arguments.length < 2;
	      var accumulator = noInitial ? undefined : arguments[1];
	      if (reduceWithoutClosingOnEarlyError) {
	        return apply(reduceWithoutClosingOnEarlyError, this, noInitial ? [reducer] : [reducer, accumulator]);
	      }
	      var record = getIteratorDirect(this);
	      var counter = 0;
	      iterate(record, function (value) {
	        if (noInitial) {
	          noInitial = false;
	          accumulator = value;
	        } else {
	          accumulator = reducer(accumulator, value, counter);
	        }
	        counter++;
	      }, {
	        IS_RECORD: true
	      });
	      if (noInitial) throw new $TypeError('Reduce of empty iterator with no initial value');
	      return accumulator;
	    }
	  });
	  return es_iterator_reduce;
	}

	var hasRequiredEsnext_iterator_reduce;
	function requireEsnext_iterator_reduce() {
	  if (hasRequiredEsnext_iterator_reduce) return esnext_iterator_reduce;
	  hasRequiredEsnext_iterator_reduce = 1;
	  // TODO: Remove from `core-js@4`
	  requireEs_iterator_reduce();
	  return esnext_iterator_reduce;
	}

	requireEsnext_iterator_reduce();

	/**
	 * Provides statistics on all clusters in the current render cycle for use in {@link Renderer.render}.
	 */
	class ClusterStats {
	  constructor(markers, clusters) {
	    this.markers = {
	      sum: markers.length
	    };
	    const clusterMarkerCounts = clusters.map(a => a.count);
	    const clusterMarkerSum = clusterMarkerCounts.reduce((a, b) => a + b, 0);
	    this.clusters = {
	      count: clusters.length,
	      markers: {
	        mean: clusterMarkerSum / clusters.length,
	        sum: clusterMarkerSum,
	        min: Math.min(...clusterMarkerCounts),
	        max: Math.max(...clusterMarkerCounts)
	      }
	    };
	  }
	}
	class DefaultRenderer {
	  /**
	   * The default render function for the library used by {@link MarkerClusterer}.
	   *
	   * Currently set to use the following:
	   *
	   * ```typescript
	   * // change color if this cluster has more markers than the mean cluster
	   * const color =
	   *   count > Math.max(10, stats.clusters.markers.mean)
	   *     ? "#ff0000"
	   *     : "#0000ff";
	   *
	   * // create svg url with fill color
	   * const svg = window.btoa(`
	   * <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
	   *   <circle cx="120" cy="120" opacity=".6" r="70" />
	   *   <circle cx="120" cy="120" opacity=".3" r="90" />
	   *   <circle cx="120" cy="120" opacity=".2" r="110" />
	   *   <circle cx="120" cy="120" opacity=".1" r="130" />
	   * </svg>`);
	   *
	   * // create marker using svg icon
	   * return new google.maps.Marker({
	   *   position,
	   *   icon: {
	   *     url: `data:image/svg+xml;base64,${svg}`,
	   *     scaledSize: new google.maps.Size(45, 45),
	   *   },
	   *   label: {
	   *     text: String(count),
	   *     color: "rgba(255,255,255,0.9)",
	   *     fontSize: "12px",
	   *   },
	   *   // adjust zIndex to be above other markers
	   *   zIndex: 1000 + count,
	   * });
	   * ```
	   */
	  render(_ref, stats, map) {
	    let {
	      count,
	      position
	    } = _ref;
	    // change color if this cluster has more markers than the mean cluster
	    const color = count > Math.max(10, stats.clusters.markers.mean) ? "#ff0000" : "#0000ff";
	    // create svg literal with fill color
	    const svg = `<svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="50" height="50">
<circle cx="120" cy="120" opacity=".6" r="70" />
<circle cx="120" cy="120" opacity=".3" r="90" />
<circle cx="120" cy="120" opacity=".2" r="110" />
<text x="50%" y="50%" style="fill:#fff" text-anchor="middle" font-size="50" dominant-baseline="middle" font-family="roboto,arial,sans-serif">${count}</text>
</svg>`;
	    const title = `Cluster of ${count} markers`,
	      // adjust zIndex to be above other markers
	      zIndex = Number(google.maps.Marker.MAX_ZINDEX) + count;
	    if (MarkerUtils.isAdvancedMarkerAvailable(map)) {
	      // create cluster SVG element
	      const parser = new DOMParser();
	      const svgEl = parser.parseFromString(svg, "image/svg+xml").documentElement;
	      svgEl.setAttribute("transform", "translate(0 25)");
	      const clusterOptions = {
	        map,
	        position,
	        zIndex,
	        title,
	        content: svgEl
	      };
	      return new google.maps.marker.AdvancedMarkerElement(clusterOptions);
	    }
	    const clusterOptions = {
	      position,
	      zIndex,
	      title,
	      icon: {
	        url: `data:image/svg+xml;base64,${btoa(svg)}`,
	        anchor: new google.maps.Point(25, 25)
	      }
	    };
	    return new google.maps.Marker(clusterOptions);
	  }
	}

	/**
	 * Copyright 2019 Google LLC. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	 * Extends an object's prototype by another's.
	 *
	 * @param type1 The Type to be extended.
	 * @param type2 The Type to extend with.
	 * @ignore
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function extend(type1, type2) {
	  /* istanbul ignore next */
	  // eslint-disable-next-line prefer-const
	  for (let property in type2.prototype) {
	    type1.prototype[property] = type2.prototype[property];
	  }
	}
	/**
	 * @ignore
	 */
	// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
	class OverlayViewSafe {
	  constructor() {
	    // MarkerClusterer implements google.maps.OverlayView interface. We use the
	    // extend function to extend MarkerClusterer with google.maps.OverlayView
	    // because it might not always be available when the code is defined so we
	    // look for it at the last possible moment. If it doesn't exist now then
	    // there is no point going ahead :)
	    extend(OverlayViewSafe, google.maps.OverlayView);
	  }
	}

	exports.MarkerClustererEvents = void 0;
	(function (MarkerClustererEvents) {
	  MarkerClustererEvents["CLUSTERING_BEGIN"] = "clusteringbegin";
	  MarkerClustererEvents["CLUSTERING_END"] = "clusteringend";
	  MarkerClustererEvents["CLUSTER_CLICK"] = "click";
	  MarkerClustererEvents["GMP_CLICK"] = "gmp-click";
	})(exports.MarkerClustererEvents || (exports.MarkerClustererEvents = {}));
	const defaultOnClusterClickHandler = (_, cluster, map) => {
	  if (cluster.bounds) map.fitBounds(cluster.bounds);
	};
	/**
	 * MarkerClusterer creates and manages per-zoom-level clusters for large amounts
	 * of markers. See {@link MarkerClustererOptions} for more details.
	 *
	 */
	class MarkerClusterer extends OverlayViewSafe {
	  constructor(_ref) {
	    let {
	      map,
	      markers = [],
	      algorithmOptions = {},
	      algorithm = new SuperClusterAlgorithm(algorithmOptions),
	      renderer = new DefaultRenderer(),
	      onClusterClick = defaultOnClusterClickHandler
	    } = _ref;
	    super();
	    /** @see {@link MarkerClustererOptions.map} */
	    this.map = null;
	    this.idleListener = null;
	    this.markers = [...markers];
	    this.clusters = [];
	    this.algorithm = algorithm;
	    this.renderer = renderer;
	    this.onClusterClick = onClusterClick;
	    if (map) {
	      this.setMap(map);
	    }
	  }
	  addMarker(marker, noDraw) {
	    if (this.markers.includes(marker)) {
	      return;
	    }
	    this.markers.push(marker);
	    if (!noDraw) {
	      this.render();
	    }
	  }
	  addMarkers(markers, noDraw) {
	    markers.forEach(marker => {
	      this.addMarker(marker, true);
	    });
	    if (!noDraw) {
	      this.render();
	    }
	  }
	  removeMarker(marker, noDraw) {
	    const index = this.markers.indexOf(marker);
	    if (index === -1) {
	      // Marker is not in our list of markers, so do nothing:
	      return false;
	    }
	    MarkerUtils.setMap(marker, null);
	    this.markers.splice(index, 1); // Remove the marker from the list of managed markers
	    if (!noDraw) {
	      this.render();
	    }
	    return true;
	  }
	  removeMarkers(markers, noDraw) {
	    let removed = false;
	    markers.forEach(marker => {
	      removed = this.removeMarker(marker, true) || removed;
	    });
	    if (removed && !noDraw) {
	      this.render();
	    }
	    return removed;
	  }
	  clearMarkers(noDraw) {
	    this.markers.length = 0;
	    if (!noDraw) {
	      this.render();
	    }
	  }
	  /**
	   * Recalculates and draws all the marker clusters.
	   */
	  render() {
	    const map = this.getMap();
	    if (map instanceof google.maps.Map && map.getProjection()) {
	      google.maps.event.trigger(this, exports.MarkerClustererEvents.CLUSTERING_BEGIN, this);
	      const {
	        clusters,
	        changed
	      } = this.algorithm.calculate({
	        markers: this.markers,
	        map,
	        mapCanvasProjection: this.getProjection()
	      });
	      // Allow algorithms to return flag on whether the clusters/markers have changed.
	      if (changed || changed == undefined) {
	        // Accumulate the markers of the clusters composed of a single marker.
	        // Those clusters directly use the marker.
	        // Clusters with more than one markers use a group marker generated by a renderer.
	        const singleMarker = new Set();
	        for (const cluster of clusters) {
	          if (cluster.markers.length == 1) {
	            singleMarker.add(cluster.markers[0]);
	          }
	        }
	        const groupMarkers = [];
	        // Iterate the clusters that are currently rendered.
	        for (const cluster of this.clusters) {
	          if (cluster.marker == null) {
	            continue;
	          }
	          if (cluster.markers.length == 1) {
	            if (!singleMarker.has(cluster.marker)) {
	              // The marker:
	              // - was previously rendered because it is from a cluster with 1 marker,
	              // - should no more be rendered as it is not in singleMarker.
	              MarkerUtils.setMap(cluster.marker, null);
	            }
	          } else {
	            // Delay the removal of old group markers to avoid flickering.
	            groupMarkers.push(cluster.marker);
	          }
	        }
	        this.clusters = clusters;
	        this.renderClusters();
	        // Delayed removal of the markers of the former groups.
	        requestAnimationFrame(() => groupMarkers.forEach(marker => MarkerUtils.setMap(marker, null)));
	      }
	      google.maps.event.trigger(this, exports.MarkerClustererEvents.CLUSTERING_END, this);
	    }
	  }
	  onAdd() {
	    const map = this.getMap();
	    assertNotNull(map);
	    this.idleListener = map.addListener("idle", this.render.bind(this));
	    this.render();
	  }
	  onRemove() {
	    if (this.idleListener) google.maps.event.removeListener(this.idleListener);
	    this.reset();
	  }
	  reset() {
	    this.markers.forEach(marker => MarkerUtils.setMap(marker, null));
	    this.clusters.forEach(cluster => cluster.delete());
	    this.clusters = [];
	  }
	  renderClusters() {
	    // Generate stats to pass to renderers.
	    const stats = new ClusterStats(this.markers, this.clusters);
	    const map = this.getMap();
	    this.clusters.forEach(cluster => {
	      if (cluster.markers.length === 1) {
	        cluster.marker = cluster.markers[0];
	      } else {
	        // Generate the marker to represent the group.
	        cluster.marker = this.renderer.render(cluster, stats, map);
	        // Make sure all individual markers are removed from the map.
	        cluster.markers.forEach(marker => MarkerUtils.setMap(marker, null));
	        if (this.onClusterClick) {
	          // legacy Marker uses 'click' events, whereas AdvancedMarkerElement uses 'gmp-click'
	          const markerClickEventName = MarkerUtils.isAdvancedMarker(cluster.marker) ? exports.MarkerClustererEvents.GMP_CLICK : exports.MarkerClustererEvents.CLUSTER_CLICK;
	          cluster.marker.addListener(markerClickEventName, /* istanbul ignore next */
	          event => {
	            google.maps.event.trigger(this, exports.MarkerClustererEvents.CLUSTER_CLICK, cluster);
	            this.onClusterClick(event, cluster, map);
	          });
	        }
	      }
	      MarkerUtils.setMap(cluster.marker, map);
	    });
	  }
	}

	exports.AbstractAlgorithm = AbstractAlgorithm;
	exports.AbstractViewportAlgorithm = AbstractViewportAlgorithm;
	exports.Cluster = Cluster;
	exports.ClusterStats = ClusterStats;
	exports.DefaultRenderer = DefaultRenderer;
	exports.GridAlgorithm = GridAlgorithm;
	exports.MarkerClusterer = MarkerClusterer;
	exports.MarkerUtils = MarkerUtils;
	exports.NoopAlgorithm = NoopAlgorithm;
	exports.SuperClusterAlgorithm = SuperClusterAlgorithm;
	exports.SuperClusterViewportAlgorithm = SuperClusterViewportAlgorithm;
	exports.defaultOnClusterClickHandler = defaultOnClusterClickHandler;
	exports.distanceBetweenPoints = distanceBetweenPoints;
	exports.extendBoundsToPaddedViewport = extendBoundsToPaddedViewport;
	exports.extendPixelBounds = extendPixelBounds;
	exports.filterMarkersToPaddedViewport = filterMarkersToPaddedViewport;
	exports.getPaddedViewport = getPaddedViewport;
	exports.noop = noop;
	exports.pixelBoundsToLatLngBounds = pixelBoundsToLatLngBounds;

	return exports;

})({});
