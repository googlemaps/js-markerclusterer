var markerClusterer = (function (exports) {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var check = function (it) {
    return it && it.Math == Math && it;
  }; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


  var global$d = // eslint-disable-next-line es-x/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || // eslint-disable-next-line no-new-func -- fallback
  function () {
    return this;
  }() || Function('return this')();

  var objectGetOwnPropertyDescriptor = {};

  var fails$e = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  var fails$d = fails$e; // Detect IE8's incomplete defineProperty implementation

  var descriptors = !fails$d(function () {
    // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
    return Object.defineProperty({}, 1, {
      get: function () {
        return 7;
      }
    })[1] != 7;
  });

  var fails$c = fails$e;
  var functionBindNative = !fails$c(function () {
    // eslint-disable-next-line es-x/no-function-prototype-bind -- safe
    var test = function () {
      /* empty */
    }.bind(); // eslint-disable-next-line no-prototype-builtins -- safe


    return typeof test != 'function' || test.hasOwnProperty('prototype');
  });

  var NATIVE_BIND$2 = functionBindNative;
  var call$6 = Function.prototype.call;
  var functionCall = NATIVE_BIND$2 ? call$6.bind(call$6) : function () {
    return call$6.apply(call$6, arguments);
  };

  var objectPropertyIsEnumerable = {};

  var $propertyIsEnumerable = {}.propertyIsEnumerable; // eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe

  var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

  var NASHORN_BUG = getOwnPropertyDescriptor$2 && !$propertyIsEnumerable.call({
    1: 2
  }, 1); // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable

  objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor$2(this, V);
    return !!descriptor && descriptor.enumerable;
  } : $propertyIsEnumerable;

  var createPropertyDescriptor$3 = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var NATIVE_BIND$1 = functionBindNative;
  var FunctionPrototype$1 = Function.prototype;
  var bind$2 = FunctionPrototype$1.bind;
  var call$5 = FunctionPrototype$1.call;
  var uncurryThis$j = NATIVE_BIND$1 && bind$2.bind(call$5, call$5);
  var functionUncurryThis = NATIVE_BIND$1 ? function (fn) {
    return fn && uncurryThis$j(fn);
  } : function (fn) {
    return fn && function () {
      return call$5.apply(fn, arguments);
    };
  };

  var uncurryThis$i = functionUncurryThis;
  var toString$5 = uncurryThis$i({}.toString);
  var stringSlice = uncurryThis$i(''.slice);

  var classofRaw$1 = function (it) {
    return stringSlice(toString$5(it), 8, -1);
  };

  var uncurryThis$h = functionUncurryThis;
  var fails$b = fails$e;
  var classof$7 = classofRaw$1;
  var $Object$3 = Object;
  var split = uncurryThis$h(''.split); // fallback for non-array-like ES3 and non-enumerable old V8 strings

  var indexedObject = fails$b(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins -- safe
    return !$Object$3('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classof$7(it) == 'String' ? split(it, '') : $Object$3(it);
  } : $Object$3;

  var $TypeError$a = TypeError; // `RequireObjectCoercible` abstract operation
  // https://tc39.es/ecma262/#sec-requireobjectcoercible

  var requireObjectCoercible$4 = function (it) {
    if (it == undefined) throw $TypeError$a("Can't call method on " + it);
    return it;
  };

  var IndexedObject$3 = indexedObject;
  var requireObjectCoercible$3 = requireObjectCoercible$4;

  var toIndexedObject$4 = function (it) {
    return IndexedObject$3(requireObjectCoercible$3(it));
  };

  // https://tc39.es/ecma262/#sec-iscallable

  var isCallable$e = function (argument) {
    return typeof argument == 'function';
  };

  var isCallable$d = isCallable$e;

  var isObject$8 = function (it) {
    return typeof it == 'object' ? it !== null : isCallable$d(it);
  };

  var global$c = global$d;
  var isCallable$c = isCallable$e;

  var aFunction = function (argument) {
    return isCallable$c(argument) ? argument : undefined;
  };

  var getBuiltIn$5 = function (namespace, method) {
    return arguments.length < 2 ? aFunction(global$c[namespace]) : global$c[namespace] && global$c[namespace][method];
  };

  var uncurryThis$g = functionUncurryThis;
  var objectIsPrototypeOf = uncurryThis$g({}.isPrototypeOf);

  var getBuiltIn$4 = getBuiltIn$5;
  var engineUserAgent = getBuiltIn$4('navigator', 'userAgent') || '';

  var global$b = global$d;
  var userAgent = engineUserAgent;
  var process = global$b.process;
  var Deno = global$b.Deno;
  var versions = process && process.versions || Deno && Deno.version;
  var v8 = versions && versions.v8;
  var match, version;

  if (v8) {
    match = v8.split('.'); // in old Chrome, versions of V8 isn't V8 = Chrome / 10
    // but their correct versions are not interesting for us

    version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
  } // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
  // so check `userAgent` even if `.v8` exists, but 0


  if (!version && userAgent) {
    match = userAgent.match(/Edge\/(\d+)/);

    if (!match || match[1] >= 74) {
      match = userAgent.match(/Chrome\/(\d+)/);
      if (match) version = +match[1];
    }
  }

  var engineV8Version = version;

  /* eslint-disable es-x/no-symbol -- required for testing */
  var V8_VERSION$1 = engineV8Version;
  var fails$a = fails$e; // eslint-disable-next-line es-x/no-object-getownpropertysymbols -- required for testing

  var nativeSymbol = !!Object.getOwnPropertySymbols && !fails$a(function () {
    var symbol = Symbol(); // Chrome 38 Symbol has incorrect toString conversion
    // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances

    return !String(symbol) || !(Object(symbol) instanceof Symbol) || // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION$1 && V8_VERSION$1 < 41;
  });

  /* eslint-disable es-x/no-symbol -- required for testing */
  var NATIVE_SYMBOL$1 = nativeSymbol;
  var useSymbolAsUid = NATIVE_SYMBOL$1 && !Symbol.sham && typeof Symbol.iterator == 'symbol';

  var getBuiltIn$3 = getBuiltIn$5;
  var isCallable$b = isCallable$e;
  var isPrototypeOf$1 = objectIsPrototypeOf;
  var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;
  var $Object$2 = Object;
  var isSymbol$3 = USE_SYMBOL_AS_UID$1 ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    var $Symbol = getBuiltIn$3('Symbol');
    return isCallable$b($Symbol) && isPrototypeOf$1($Symbol.prototype, $Object$2(it));
  };

  var $String$3 = String;

  var tryToString$2 = function (argument) {
    try {
      return $String$3(argument);
    } catch (error) {
      return 'Object';
    }
  };

  var isCallable$a = isCallable$e;
  var tryToString$1 = tryToString$2;
  var $TypeError$9 = TypeError; // `Assert: IsCallable(argument) is true`

  var aCallable$3 = function (argument) {
    if (isCallable$a(argument)) return argument;
    throw $TypeError$9(tryToString$1(argument) + ' is not a function');
  };

  var aCallable$2 = aCallable$3; // `GetMethod` abstract operation
  // https://tc39.es/ecma262/#sec-getmethod

  var getMethod$1 = function (V, P) {
    var func = V[P];
    return func == null ? undefined : aCallable$2(func);
  };

  var call$4 = functionCall;
  var isCallable$9 = isCallable$e;
  var isObject$7 = isObject$8;
  var $TypeError$8 = TypeError; // `OrdinaryToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-ordinarytoprimitive

  var ordinaryToPrimitive$1 = function (input, pref) {
    var fn, val;
    if (pref === 'string' && isCallable$9(fn = input.toString) && !isObject$7(val = call$4(fn, input))) return val;
    if (isCallable$9(fn = input.valueOf) && !isObject$7(val = call$4(fn, input))) return val;
    if (pref !== 'string' && isCallable$9(fn = input.toString) && !isObject$7(val = call$4(fn, input))) return val;
    throw $TypeError$8("Can't convert object to primitive value");
  };

  var shared$3 = {exports: {}};

  var global$a = global$d; // eslint-disable-next-line es-x/no-object-defineproperty -- safe

  var defineProperty$4 = Object.defineProperty;

  var defineGlobalProperty$3 = function (key, value) {
    try {
      defineProperty$4(global$a, key, {
        value: value,
        configurable: true,
        writable: true
      });
    } catch (error) {
      global$a[key] = value;
    }

    return value;
  };

  var global$9 = global$d;
  var defineGlobalProperty$2 = defineGlobalProperty$3;
  var SHARED = '__core-js_shared__';
  var store$3 = global$9[SHARED] || defineGlobalProperty$2(SHARED, {});
  var sharedStore = store$3;

  var store$2 = sharedStore;
  (shared$3.exports = function (key, value) {
    return store$2[key] || (store$2[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.24.1',
    mode: 'global',
    copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
    license: 'https://github.com/zloirock/core-js/blob/v3.24.1/LICENSE',
    source: 'https://github.com/zloirock/core-js'
  });

  var requireObjectCoercible$2 = requireObjectCoercible$4;
  var $Object$1 = Object; // `ToObject` abstract operation
  // https://tc39.es/ecma262/#sec-toobject

  var toObject$5 = function (argument) {
    return $Object$1(requireObjectCoercible$2(argument));
  };

  var uncurryThis$f = functionUncurryThis;
  var toObject$4 = toObject$5;
  var hasOwnProperty = uncurryThis$f({}.hasOwnProperty); // `HasOwnProperty` abstract operation
  // https://tc39.es/ecma262/#sec-hasownproperty
  // eslint-disable-next-line es-x/no-object-hasown -- safe

  var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
    return hasOwnProperty(toObject$4(it), key);
  };

  var uncurryThis$e = functionUncurryThis;
  var id = 0;
  var postfix = Math.random();
  var toString$4 = uncurryThis$e(1.0.toString);

  var uid$2 = function (key) {
    return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$4(++id + postfix, 36);
  };

  var global$8 = global$d;
  var shared$2 = shared$3.exports;
  var hasOwn$7 = hasOwnProperty_1;
  var uid$1 = uid$2;
  var NATIVE_SYMBOL = nativeSymbol;
  var USE_SYMBOL_AS_UID = useSymbolAsUid;
  var WellKnownSymbolsStore = shared$2('wks');
  var Symbol$1 = global$8.Symbol;
  var symbolFor = Symbol$1 && Symbol$1['for'];
  var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$1;

  var wellKnownSymbol$8 = function (name) {
    if (!hasOwn$7(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
      var description = 'Symbol.' + name;

      if (NATIVE_SYMBOL && hasOwn$7(Symbol$1, name)) {
        WellKnownSymbolsStore[name] = Symbol$1[name];
      } else if (USE_SYMBOL_AS_UID && symbolFor) {
        WellKnownSymbolsStore[name] = symbolFor(description);
      } else {
        WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
      }
    }

    return WellKnownSymbolsStore[name];
  };

  var call$3 = functionCall;
  var isObject$6 = isObject$8;
  var isSymbol$2 = isSymbol$3;
  var getMethod = getMethod$1;
  var ordinaryToPrimitive = ordinaryToPrimitive$1;
  var wellKnownSymbol$7 = wellKnownSymbol$8;
  var $TypeError$7 = TypeError;
  var TO_PRIMITIVE = wellKnownSymbol$7('toPrimitive'); // `ToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-toprimitive

  var toPrimitive$2 = function (input, pref) {
    if (!isObject$6(input) || isSymbol$2(input)) return input;
    var exoticToPrim = getMethod(input, TO_PRIMITIVE);
    var result;

    if (exoticToPrim) {
      if (pref === undefined) pref = 'default';
      result = call$3(exoticToPrim, input, pref);
      if (!isObject$6(result) || isSymbol$2(result)) return result;
      throw $TypeError$7("Can't convert object to primitive value");
    }

    if (pref === undefined) pref = 'number';
    return ordinaryToPrimitive(input, pref);
  };

  var toPrimitive$1 = toPrimitive$2;
  var isSymbol$1 = isSymbol$3; // `ToPropertyKey` abstract operation
  // https://tc39.es/ecma262/#sec-topropertykey

  var toPropertyKey$3 = function (argument) {
    var key = toPrimitive$1(argument, 'string');
    return isSymbol$1(key) ? key : key + '';
  };

  var global$7 = global$d;
  var isObject$5 = isObject$8;
  var document$1 = global$7.document; // typeof document.createElement is 'object' in old IE

  var EXISTS$1 = isObject$5(document$1) && isObject$5(document$1.createElement);

  var documentCreateElement$2 = function (it) {
    return EXISTS$1 ? document$1.createElement(it) : {};
  };

  var DESCRIPTORS$9 = descriptors;
  var fails$9 = fails$e;
  var createElement = documentCreateElement$2; // Thanks to IE8 for its funny defineProperty

  var ie8DomDefine = !DESCRIPTORS$9 && !fails$9(function () {
    // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
    return Object.defineProperty(createElement('div'), 'a', {
      get: function () {
        return 7;
      }
    }).a != 7;
  });

  var DESCRIPTORS$8 = descriptors;
  var call$2 = functionCall;
  var propertyIsEnumerableModule$1 = objectPropertyIsEnumerable;
  var createPropertyDescriptor$2 = createPropertyDescriptor$3;
  var toIndexedObject$3 = toIndexedObject$4;
  var toPropertyKey$2 = toPropertyKey$3;
  var hasOwn$6 = hasOwnProperty_1;
  var IE8_DOM_DEFINE$1 = ie8DomDefine; // eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe

  var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor

  objectGetOwnPropertyDescriptor.f = DESCRIPTORS$8 ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject$3(O);
    P = toPropertyKey$2(P);
    if (IE8_DOM_DEFINE$1) try {
      return $getOwnPropertyDescriptor$1(O, P);
    } catch (error) {
      /* empty */
    }
    if (hasOwn$6(O, P)) return createPropertyDescriptor$2(!call$2(propertyIsEnumerableModule$1.f, O, P), O[P]);
  };

  var objectDefineProperty = {};

  var DESCRIPTORS$7 = descriptors;
  var fails$8 = fails$e; // V8 ~ Chrome 36-
  // https://bugs.chromium.org/p/v8/issues/detail?id=3334

  var v8PrototypeDefineBug = DESCRIPTORS$7 && fails$8(function () {
    // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
    return Object.defineProperty(function () {
      /* empty */
    }, 'prototype', {
      value: 42,
      writable: false
    }).prototype != 42;
  });

  var isObject$4 = isObject$8;
  var $String$2 = String;
  var $TypeError$6 = TypeError; // `Assert: Type(argument) is Object`

  var anObject$5 = function (argument) {
    if (isObject$4(argument)) return argument;
    throw $TypeError$6($String$2(argument) + ' is not an object');
  };

  var DESCRIPTORS$6 = descriptors;
  var IE8_DOM_DEFINE = ie8DomDefine;
  var V8_PROTOTYPE_DEFINE_BUG$1 = v8PrototypeDefineBug;
  var anObject$4 = anObject$5;
  var toPropertyKey$1 = toPropertyKey$3;
  var $TypeError$5 = TypeError; // eslint-disable-next-line es-x/no-object-defineproperty -- safe

  var $defineProperty = Object.defineProperty; // eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe

  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var ENUMERABLE = 'enumerable';
  var CONFIGURABLE$1 = 'configurable';
  var WRITABLE = 'writable'; // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty

  objectDefineProperty.f = DESCRIPTORS$6 ? V8_PROTOTYPE_DEFINE_BUG$1 ? function defineProperty(O, P, Attributes) {
    anObject$4(O);
    P = toPropertyKey$1(P);
    anObject$4(Attributes);

    if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
      var current = $getOwnPropertyDescriptor(O, P);

      if (current && current[WRITABLE]) {
        O[P] = Attributes.value;
        Attributes = {
          configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
          enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
          writable: false
        };
      }
    }

    return $defineProperty(O, P, Attributes);
  } : $defineProperty : function defineProperty(O, P, Attributes) {
    anObject$4(O);
    P = toPropertyKey$1(P);
    anObject$4(Attributes);
    if (IE8_DOM_DEFINE) try {
      return $defineProperty(O, P, Attributes);
    } catch (error) {
      /* empty */
    }
    if ('get' in Attributes || 'set' in Attributes) throw $TypeError$5('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var DESCRIPTORS$5 = descriptors;
  var definePropertyModule$4 = objectDefineProperty;
  var createPropertyDescriptor$1 = createPropertyDescriptor$3;
  var createNonEnumerableProperty$3 = DESCRIPTORS$5 ? function (object, key, value) {
    return definePropertyModule$4.f(object, key, createPropertyDescriptor$1(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var makeBuiltIn$2 = {exports: {}};

  var DESCRIPTORS$4 = descriptors;
  var hasOwn$5 = hasOwnProperty_1;
  var FunctionPrototype = Function.prototype; // eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe

  var getDescriptor = DESCRIPTORS$4 && Object.getOwnPropertyDescriptor;
  var EXISTS = hasOwn$5(FunctionPrototype, 'name'); // additional protection from minified / mangled / dropped function names

  var PROPER = EXISTS && function something() {
    /* empty */
  }.name === 'something';

  var CONFIGURABLE = EXISTS && (!DESCRIPTORS$4 || DESCRIPTORS$4 && getDescriptor(FunctionPrototype, 'name').configurable);
  var functionName = {
    EXISTS: EXISTS,
    PROPER: PROPER,
    CONFIGURABLE: CONFIGURABLE
  };

  var uncurryThis$d = functionUncurryThis;
  var isCallable$8 = isCallable$e;
  var store$1 = sharedStore;
  var functionToString = uncurryThis$d(Function.toString); // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper

  if (!isCallable$8(store$1.inspectSource)) {
    store$1.inspectSource = function (it) {
      return functionToString(it);
    };
  }

  var inspectSource$3 = store$1.inspectSource;

  var global$6 = global$d;
  var isCallable$7 = isCallable$e;
  var inspectSource$2 = inspectSource$3;
  var WeakMap$1 = global$6.WeakMap;
  var nativeWeakMap = isCallable$7(WeakMap$1) && /native code/.test(inspectSource$2(WeakMap$1));

  var shared$1 = shared$3.exports;
  var uid = uid$2;
  var keys$1 = shared$1('keys');

  var sharedKey$2 = function (key) {
    return keys$1[key] || (keys$1[key] = uid(key));
  };

  var hiddenKeys$4 = {};

  var NATIVE_WEAK_MAP = nativeWeakMap;
  var global$5 = global$d;
  var uncurryThis$c = functionUncurryThis;
  var isObject$3 = isObject$8;
  var createNonEnumerableProperty$2 = createNonEnumerableProperty$3;
  var hasOwn$4 = hasOwnProperty_1;
  var shared = sharedStore;
  var sharedKey$1 = sharedKey$2;
  var hiddenKeys$3 = hiddenKeys$4;
  var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
  var TypeError$2 = global$5.TypeError;
  var WeakMap = global$5.WeakMap;
  var set, get, has;

  var enforce = function (it) {
    return has(it) ? get(it) : set(it, {});
  };

  var getterFor = function (TYPE) {
    return function (it) {
      var state;

      if (!isObject$3(it) || (state = get(it)).type !== TYPE) {
        throw TypeError$2('Incompatible receiver, ' + TYPE + ' required');
      }

      return state;
    };
  };

  if (NATIVE_WEAK_MAP || shared.state) {
    var store = shared.state || (shared.state = new WeakMap());
    var wmget = uncurryThis$c(store.get);
    var wmhas = uncurryThis$c(store.has);
    var wmset = uncurryThis$c(store.set);

    set = function (it, metadata) {
      if (wmhas(store, it)) throw new TypeError$2(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      wmset(store, it, metadata);
      return metadata;
    };

    get = function (it) {
      return wmget(store, it) || {};
    };

    has = function (it) {
      return wmhas(store, it);
    };
  } else {
    var STATE = sharedKey$1('state');
    hiddenKeys$3[STATE] = true;

    set = function (it, metadata) {
      if (hasOwn$4(it, STATE)) throw new TypeError$2(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      createNonEnumerableProperty$2(it, STATE, metadata);
      return metadata;
    };

    get = function (it) {
      return hasOwn$4(it, STATE) ? it[STATE] : {};
    };

    has = function (it) {
      return hasOwn$4(it, STATE);
    };
  }

  var internalState = {
    set: set,
    get: get,
    has: has,
    enforce: enforce,
    getterFor: getterFor
  };

  var fails$7 = fails$e;
  var isCallable$6 = isCallable$e;
  var hasOwn$3 = hasOwnProperty_1;
  var DESCRIPTORS$3 = descriptors;
  var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
  var inspectSource$1 = inspectSource$3;
  var InternalStateModule = internalState;
  var enforceInternalState = InternalStateModule.enforce;
  var getInternalState = InternalStateModule.get; // eslint-disable-next-line es-x/no-object-defineproperty -- safe

  var defineProperty$3 = Object.defineProperty;
  var CONFIGURABLE_LENGTH = DESCRIPTORS$3 && !fails$7(function () {
    return defineProperty$3(function () {
      /* empty */
    }, 'length', {
      value: 8
    }).length !== 8;
  });
  var TEMPLATE = String(String).split('String');

  var makeBuiltIn$1 = makeBuiltIn$2.exports = function (value, name, options) {
    if (String(name).slice(0, 7) === 'Symbol(') {
      name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
    }

    if (options && options.getter) name = 'get ' + name;
    if (options && options.setter) name = 'set ' + name;

    if (!hasOwn$3(value, 'name') || CONFIGURABLE_FUNCTION_NAME && value.name !== name) {
      if (DESCRIPTORS$3) defineProperty$3(value, 'name', {
        value: name,
        configurable: true
      });else value.name = name;
    }

    if (CONFIGURABLE_LENGTH && options && hasOwn$3(options, 'arity') && value.length !== options.arity) {
      defineProperty$3(value, 'length', {
        value: options.arity
      });
    }

    try {
      if (options && hasOwn$3(options, 'constructor') && options.constructor) {
        if (DESCRIPTORS$3) defineProperty$3(value, 'prototype', {
          writable: false
        }); // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
      } else if (value.prototype) value.prototype = undefined;
    } catch (error) {
      /* empty */
    }

    var state = enforceInternalState(value);

    if (!hasOwn$3(state, 'source')) {
      state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
    }

    return value;
  }; // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  // eslint-disable-next-line no-extend-native -- required


  Function.prototype.toString = makeBuiltIn$1(function toString() {
    return isCallable$6(this) && getInternalState(this).source || inspectSource$1(this);
  }, 'toString');

  var isCallable$5 = isCallable$e;
  var definePropertyModule$3 = objectDefineProperty;
  var makeBuiltIn = makeBuiltIn$2.exports;
  var defineGlobalProperty$1 = defineGlobalProperty$3;

  var defineBuiltIn$3 = function (O, key, value, options) {
    if (!options) options = {};
    var simple = options.enumerable;
    var name = options.name !== undefined ? options.name : key;
    if (isCallable$5(value)) makeBuiltIn(value, name, options);

    if (options.global) {
      if (simple) O[key] = value;else defineGlobalProperty$1(key, value);
    } else {
      try {
        if (!options.unsafe) delete O[key];else if (O[key]) simple = true;
      } catch (error) {
        /* empty */
      }

      if (simple) O[key] = value;else definePropertyModule$3.f(O, key, {
        value: value,
        enumerable: false,
        configurable: !options.nonConfigurable,
        writable: !options.nonWritable
      });
    }

    return O;
  };

  var objectGetOwnPropertyNames = {};

  var ceil = Math.ceil;
  var floor = Math.floor; // `Math.trunc` method
  // https://tc39.es/ecma262/#sec-math.trunc
  // eslint-disable-next-line es-x/no-math-trunc -- safe

  var mathTrunc = Math.trunc || function trunc(x) {
    var n = +x;
    return (n > 0 ? floor : ceil)(n);
  };

  var trunc = mathTrunc; // `ToIntegerOrInfinity` abstract operation
  // https://tc39.es/ecma262/#sec-tointegerorinfinity

  var toIntegerOrInfinity$3 = function (argument) {
    var number = +argument; // eslint-disable-next-line no-self-compare -- NaN check

    return number !== number || number === 0 ? 0 : trunc(number);
  };

  var toIntegerOrInfinity$2 = toIntegerOrInfinity$3;
  var max$1 = Math.max;
  var min$2 = Math.min; // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

  var toAbsoluteIndex$2 = function (index, length) {
    var integer = toIntegerOrInfinity$2(index);
    return integer < 0 ? max$1(integer + length, 0) : min$2(integer, length);
  };

  var toIntegerOrInfinity$1 = toIntegerOrInfinity$3;
  var min$1 = Math.min; // `ToLength` abstract operation
  // https://tc39.es/ecma262/#sec-tolength

  var toLength$1 = function (argument) {
    return argument > 0 ? min$1(toIntegerOrInfinity$1(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var toLength = toLength$1; // `LengthOfArrayLike` abstract operation
  // https://tc39.es/ecma262/#sec-lengthofarraylike

  var lengthOfArrayLike$4 = function (obj) {
    return toLength(obj.length);
  };

  var toIndexedObject$2 = toIndexedObject$4;
  var toAbsoluteIndex$1 = toAbsoluteIndex$2;
  var lengthOfArrayLike$3 = lengthOfArrayLike$4; // `Array.prototype.{ indexOf, includes }` methods implementation

  var createMethod$3 = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject$2($this);
      var length = lengthOfArrayLike$3(O);
      var index = toAbsoluteIndex$1(fromIndex, length);
      var value; // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare -- NaN check

      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++]; // eslint-disable-next-line no-self-compare -- NaN check

        if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
      } else for (; length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
      }
      return !IS_INCLUDES && -1;
    };
  };

  var arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.es/ecma262/#sec-array.prototype.includes
    includes: createMethod$3(true),
    // `Array.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod$3(false)
  };

  var uncurryThis$b = functionUncurryThis;
  var hasOwn$2 = hasOwnProperty_1;
  var toIndexedObject$1 = toIndexedObject$4;
  var indexOf = arrayIncludes.indexOf;
  var hiddenKeys$2 = hiddenKeys$4;
  var push$1 = uncurryThis$b([].push);

  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject$1(object);
    var i = 0;
    var result = [];
    var key;

    for (key in O) !hasOwn$2(hiddenKeys$2, key) && hasOwn$2(O, key) && push$1(result, key); // Don't enum bug & hidden keys


    while (names.length > i) if (hasOwn$2(O, key = names[i++])) {
      ~indexOf(result, key) || push$1(result, key);
    }

    return result;
  };

  var enumBugKeys$3 = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

  var internalObjectKeys$1 = objectKeysInternal;
  var enumBugKeys$2 = enumBugKeys$3;
  var hiddenKeys$1 = enumBugKeys$2.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  // eslint-disable-next-line es-x/no-object-getownpropertynames -- safe

  objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return internalObjectKeys$1(O, hiddenKeys$1);
  };

  var objectGetOwnPropertySymbols = {};

  objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

  var getBuiltIn$2 = getBuiltIn$5;
  var uncurryThis$a = functionUncurryThis;
  var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
  var getOwnPropertySymbolsModule$1 = objectGetOwnPropertySymbols;
  var anObject$3 = anObject$5;
  var concat$1 = uncurryThis$a([].concat); // all object keys, includes non-enumerable and symbols

  var ownKeys$1 = getBuiltIn$2('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = getOwnPropertyNamesModule.f(anObject$3(it));
    var getOwnPropertySymbols = getOwnPropertySymbolsModule$1.f;
    return getOwnPropertySymbols ? concat$1(keys, getOwnPropertySymbols(it)) : keys;
  };

  var hasOwn$1 = hasOwnProperty_1;
  var ownKeys = ownKeys$1;
  var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
  var definePropertyModule$2 = objectDefineProperty;

  var copyConstructorProperties$1 = function (target, source, exceptions) {
    var keys = ownKeys(source);
    var defineProperty = definePropertyModule$2.f;
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (!hasOwn$1(target, key) && !(exceptions && hasOwn$1(exceptions, key))) {
        defineProperty(target, key, getOwnPropertyDescriptor(source, key));
      }
    }
  };

  var fails$6 = fails$e;
  var isCallable$4 = isCallable$e;
  var replacement = /#|\.prototype\./;

  var isForced$2 = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true : value == NATIVE ? false : isCallable$4(detection) ? fails$6(detection) : !!detection;
  };

  var normalize = isForced$2.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };

  var data = isForced$2.data = {};
  var NATIVE = isForced$2.NATIVE = 'N';
  var POLYFILL = isForced$2.POLYFILL = 'P';
  var isForced_1 = isForced$2;

  var global$4 = global$d;
  var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
  var createNonEnumerableProperty$1 = createNonEnumerableProperty$3;
  var defineBuiltIn$2 = defineBuiltIn$3;
  var defineGlobalProperty = defineGlobalProperty$3;
  var copyConstructorProperties = copyConstructorProperties$1;
  var isForced$1 = isForced_1;
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

  var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;

    if (GLOBAL) {
      target = global$4;
    } else if (STATIC) {
      target = global$4[TARGET] || defineGlobalProperty(TARGET, {});
    } else {
      target = (global$4[TARGET] || {}).prototype;
    }

    if (target) for (key in source) {
      sourceProperty = source[key];

      if (options.dontCallGetSet) {
        descriptor = getOwnPropertyDescriptor$1(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];

      FORCED = isForced$1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

      if (!FORCED && targetProperty !== undefined) {
        if (typeof sourceProperty == typeof targetProperty) continue;
        copyConstructorProperties(sourceProperty, targetProperty);
      } // add a flag to not completely full polyfills


      if (options.sham || targetProperty && targetProperty.sham) {
        createNonEnumerableProperty$1(sourceProperty, 'sham', true);
      }

      defineBuiltIn$2(target, key, sourceProperty, options);
    }
  };

  var uncurryThis$9 = functionUncurryThis;
  var aCallable$1 = aCallable$3;
  var NATIVE_BIND = functionBindNative;
  var bind$1 = uncurryThis$9(uncurryThis$9.bind); // optional / simple context binding

  var functionBindContext = function (fn, that) {
    aCallable$1(fn);
    return that === undefined ? fn : NATIVE_BIND ? bind$1(fn, that) : function ()
    /* ...args */
    {
      return fn.apply(that, arguments);
    };
  };

  var classof$6 = classofRaw$1; // `IsArray` abstract operation
  // https://tc39.es/ecma262/#sec-isarray
  // eslint-disable-next-line es-x/no-array-isarray -- safe

  var isArray$1 = Array.isArray || function isArray(argument) {
    return classof$6(argument) == 'Array';
  };

  var wellKnownSymbol$6 = wellKnownSymbol$8;
  var TO_STRING_TAG$1 = wellKnownSymbol$6('toStringTag');
  var test = {};
  test[TO_STRING_TAG$1] = 'z';
  var toStringTagSupport = String(test) === '[object z]';

  var TO_STRING_TAG_SUPPORT$2 = toStringTagSupport;
  var isCallable$3 = isCallable$e;
  var classofRaw = classofRaw$1;
  var wellKnownSymbol$5 = wellKnownSymbol$8;
  var TO_STRING_TAG = wellKnownSymbol$5('toStringTag');
  var $Object = Object; // ES3 wrong here

  var CORRECT_ARGUMENTS = classofRaw(function () {
    return arguments;
  }()) == 'Arguments'; // fallback for IE11 Script Access Denied error

  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (error) {
      /* empty */
    }
  }; // getting tag from ES6+ `Object.prototype.toString`


  var classof$5 = TO_STRING_TAG_SUPPORT$2 ? classofRaw : function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O) // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable$3(O.callee) ? 'Arguments' : result;
  };

  var uncurryThis$8 = functionUncurryThis;
  var fails$5 = fails$e;
  var isCallable$2 = isCallable$e;
  var classof$4 = classof$5;
  var getBuiltIn$1 = getBuiltIn$5;
  var inspectSource = inspectSource$3;

  var noop = function () {
    /* empty */
  };

  var empty = [];
  var construct = getBuiltIn$1('Reflect', 'construct');
  var constructorRegExp = /^\s*(?:class|function)\b/;
  var exec = uncurryThis$8(constructorRegExp.exec);
  var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

  var isConstructorModern = function isConstructor(argument) {
    if (!isCallable$2(argument)) return false;

    try {
      construct(noop, empty, argument);
      return true;
    } catch (error) {
      return false;
    }
  };

  var isConstructorLegacy = function isConstructor(argument) {
    if (!isCallable$2(argument)) return false;

    switch (classof$4(argument)) {
      case 'AsyncFunction':
      case 'GeneratorFunction':
      case 'AsyncGeneratorFunction':
        return false;
    }

    try {
      // we can't check .prototype since constructors produced by .bind haven't it
      // `Function#toString` throws on some built-it function in some legacy engines
      // (for example, `DOMQuad` and similar in FF41-)
      return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
    } catch (error) {
      return true;
    }
  };

  isConstructorLegacy.sham = true; // `IsConstructor` abstract operation
  // https://tc39.es/ecma262/#sec-isconstructor

  var isConstructor$1 = !construct || fails$5(function () {
    var called;
    return isConstructorModern(isConstructorModern.call) || !isConstructorModern(Object) || !isConstructorModern(function () {
      called = true;
    }) || called;
  }) ? isConstructorLegacy : isConstructorModern;

  var isArray = isArray$1;
  var isConstructor = isConstructor$1;
  var isObject$2 = isObject$8;
  var wellKnownSymbol$4 = wellKnownSymbol$8;
  var SPECIES$1 = wellKnownSymbol$4('species');
  var $Array = Array; // a part of `ArraySpeciesCreate` abstract operation
  // https://tc39.es/ecma262/#sec-arrayspeciescreate

  var arraySpeciesConstructor$1 = function (originalArray) {
    var C;

    if (isArray(originalArray)) {
      C = originalArray.constructor; // cross-realm fallback

      if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;else if (isObject$2(C)) {
        C = C[SPECIES$1];
        if (C === null) C = undefined;
      }
    }

    return C === undefined ? $Array : C;
  };

  var arraySpeciesConstructor = arraySpeciesConstructor$1; // `ArraySpeciesCreate` abstract operation
  // https://tc39.es/ecma262/#sec-arrayspeciescreate

  var arraySpeciesCreate$2 = function (originalArray, length) {
    return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
  };

  var bind = functionBindContext;
  var uncurryThis$7 = functionUncurryThis;
  var IndexedObject$2 = indexedObject;
  var toObject$3 = toObject$5;
  var lengthOfArrayLike$2 = lengthOfArrayLike$4;
  var arraySpeciesCreate$1 = arraySpeciesCreate$2;
  var push = uncurryThis$7([].push); // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation

  var createMethod$2 = function (TYPE) {
    var IS_MAP = TYPE == 1;
    var IS_FILTER = TYPE == 2;
    var IS_SOME = TYPE == 3;
    var IS_EVERY = TYPE == 4;
    var IS_FIND_INDEX = TYPE == 6;
    var IS_FILTER_REJECT = TYPE == 7;
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    return function ($this, callbackfn, that, specificCreate) {
      var O = toObject$3($this);
      var self = IndexedObject$2(O);
      var boundFunction = bind(callbackfn, that);
      var length = lengthOfArrayLike$2(self);
      var index = 0;
      var create = specificCreate || arraySpeciesCreate$1;
      var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
      var value, result;

      for (; length > index; index++) if (NO_HOLES || index in self) {
        value = self[index];
        result = boundFunction(value, index, O);

        if (TYPE) {
          if (IS_MAP) target[index] = result; // map
          else if (result) switch (TYPE) {
              case 3:
                return true;
              // some

              case 5:
                return value;
              // find

              case 6:
                return index;
              // findIndex

              case 2:
                push(target, value);
              // filter
            } else switch (TYPE) {
              case 4:
                return false;
              // every

              case 7:
                push(target, value);
              // filterReject
            }
        }
      }

      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
    };
  };

  var arrayIteration = {
    // `Array.prototype.forEach` method
    // https://tc39.es/ecma262/#sec-array.prototype.foreach
    forEach: createMethod$2(0),
    // `Array.prototype.map` method
    // https://tc39.es/ecma262/#sec-array.prototype.map
    map: createMethod$2(1),
    // `Array.prototype.filter` method
    // https://tc39.es/ecma262/#sec-array.prototype.filter
    filter: createMethod$2(2),
    // `Array.prototype.some` method
    // https://tc39.es/ecma262/#sec-array.prototype.some
    some: createMethod$2(3),
    // `Array.prototype.every` method
    // https://tc39.es/ecma262/#sec-array.prototype.every
    every: createMethod$2(4),
    // `Array.prototype.find` method
    // https://tc39.es/ecma262/#sec-array.prototype.find
    find: createMethod$2(5),
    // `Array.prototype.findIndex` method
    // https://tc39.es/ecma262/#sec-array.prototype.findIndex
    findIndex: createMethod$2(6),
    // `Array.prototype.filterReject` method
    // https://github.com/tc39/proposal-array-filtering
    filterReject: createMethod$2(7)
  };

  var fails$4 = fails$e;
  var wellKnownSymbol$3 = wellKnownSymbol$8;
  var V8_VERSION = engineV8Version;
  var SPECIES = wellKnownSymbol$3('species');

  var arrayMethodHasSpeciesSupport$3 = function (METHOD_NAME) {
    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/677
    return V8_VERSION >= 51 || !fails$4(function () {
      var array = [];
      var constructor = array.constructor = {};

      constructor[SPECIES] = function () {
        return {
          foo: 1
        };
      };

      return array[METHOD_NAME](Boolean).foo !== 1;
    });
  };

  var $$8 = _export;
  var $map = arrayIteration.map;
  var arrayMethodHasSpeciesSupport$2 = arrayMethodHasSpeciesSupport$3;
  var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport$2('map'); // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  // with adding support of @@species

  $$8({
    target: 'Array',
    proto: true,
    forced: !HAS_SPECIES_SUPPORT$2
  }, {
    map: function map(callbackfn
    /* , thisArg */
    ) {
      return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  /*! *****************************************************************************
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
  function __rest(s, e) {
    var t = {};

    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
  }

  var aCallable = aCallable$3;
  var toObject$2 = toObject$5;
  var IndexedObject$1 = indexedObject;
  var lengthOfArrayLike$1 = lengthOfArrayLike$4;
  var $TypeError$4 = TypeError; // `Array.prototype.{ reduce, reduceRight }` methods implementation

  var createMethod$1 = function (IS_RIGHT) {
    return function (that, callbackfn, argumentsLength, memo) {
      aCallable(callbackfn);
      var O = toObject$2(that);
      var self = IndexedObject$1(O);
      var length = lengthOfArrayLike$1(O);
      var index = IS_RIGHT ? length - 1 : 0;
      var i = IS_RIGHT ? -1 : 1;
      if (argumentsLength < 2) while (true) {
        if (index in self) {
          memo = self[index];
          index += i;
          break;
        }

        index += i;

        if (IS_RIGHT ? index < 0 : length <= index) {
          throw $TypeError$4('Reduce of empty array with no initial value');
        }
      }

      for (; IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
        memo = callbackfn(memo, self[index], index, O);
      }

      return memo;
    };
  };

  var arrayReduce = {
    // `Array.prototype.reduce` method
    // https://tc39.es/ecma262/#sec-array.prototype.reduce
    left: createMethod$1(false),
    // `Array.prototype.reduceRight` method
    // https://tc39.es/ecma262/#sec-array.prototype.reduceright
    right: createMethod$1(true)
  };

  var fails$3 = fails$e;

  var arrayMethodIsStrict$3 = function (METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return !!method && fails$3(function () {
      // eslint-disable-next-line no-useless-call -- required for testing
      method.call(null, argument || function () {
        return 1;
      }, 1);
    });
  };

  var classof$3 = classofRaw$1;
  var global$3 = global$d;
  var engineIsNode = classof$3(global$3.process) == 'process';

  var $$7 = _export;
  var $reduce = arrayReduce.left;
  var arrayMethodIsStrict$2 = arrayMethodIsStrict$3;
  var CHROME_VERSION = engineV8Version;
  var IS_NODE = engineIsNode;
  var STRICT_METHOD$2 = arrayMethodIsStrict$2('reduce'); // Chrome 80-82 has a critical bug
  // https://bugs.chromium.org/p/chromium/issues/detail?id=1049982

  var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83; // `Array.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduce

  $$7({
    target: 'Array',
    proto: true,
    forced: !STRICT_METHOD$2 || CHROME_BUG
  }, {
    reduce: function reduce(callbackfn
    /* , initialValue */
    ) {
      var length = arguments.length;
      return $reduce(this, callbackfn, length, length > 1 ? arguments[1] : undefined);
    }
  });

  var TO_STRING_TAG_SUPPORT$1 = toStringTagSupport;
  var classof$2 = classof$5; // `Object.prototype.toString` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.tostring

  var objectToString = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString() {
    return '[object ' + classof$2(this) + ']';
  };

  var TO_STRING_TAG_SUPPORT = toStringTagSupport;
  var defineBuiltIn$1 = defineBuiltIn$3;
  var toString$3 = objectToString; // `Object.prototype.toString` method
  // https://tc39.es/ecma262/#sec-object.prototype.tostring

  if (!TO_STRING_TAG_SUPPORT) {
    defineBuiltIn$1(Object.prototype, 'toString', toString$3, {
      unsafe: true
    });
  }

  var $$6 = _export;
  var $filter = arrayIteration.filter;
  var arrayMethodHasSpeciesSupport$1 = arrayMethodHasSpeciesSupport$3;
  var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport$1('filter'); // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  // with adding support of @@species

  $$6({
    target: 'Array',
    proto: true,
    forced: !HAS_SPECIES_SUPPORT$1
  }, {
    filter: function filter(callbackfn
    /* , thisArg */
    ) {
      return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

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
  var Cluster = /*#__PURE__*/function () {
    function Cluster(_ref) {
      var markers = _ref.markers,
          position = _ref.position;

      _classCallCheck(this, Cluster);

      this.markers = markers;

      if (position) {
        if (position instanceof google.maps.LatLng) {
          this._position = position;
        } else {
          this._position = new google.maps.LatLng(position);
        }
      }
    }

    _createClass(Cluster, [{
      key: "bounds",
      get: function get() {
        if (this.markers.length === 0 && !this._position) {
          return undefined;
        }

        return this.markers.reduce(function (bounds, marker) {
          return bounds.extend(marker.getPosition());
        }, new google.maps.LatLngBounds(this._position, this._position));
      }
    }, {
      key: "position",
      get: function get() {
        return this._position || this.bounds.getCenter();
      }
      /**
       * Get the count of **visible** markers.
       */

    }, {
      key: "count",
      get: function get() {
        return this.markers.filter(function (m) {
          return m.getVisible();
        }).length;
      }
      /**
       * Add a marker to the cluster.
       */

    }, {
      key: "push",
      value: function push(marker) {
        this.markers.push(marker);
      }
      /**
       * Cleanup references and remove marker from map.
       */

    }, {
      key: "delete",
      value: function _delete() {
        if (this.marker) {
          this.marker.setMap(null);
          delete this.marker;
        }

        this.markers.length = 0;
      }
    }]);

    return Cluster;
  }();

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
  var filterMarkersToPaddedViewport = function filterMarkersToPaddedViewport(map, mapCanvasProjection, markers, viewportPadding) {
    var extendedMapBounds = extendBoundsToPaddedViewport(map.getBounds(), mapCanvasProjection, viewportPadding);
    return markers.filter(function (marker) {
      return extendedMapBounds.contains(marker.getPosition());
    });
  };
  /**
   * Extends a bounds by a number of pixels in each direction.
   */

  var extendBoundsToPaddedViewport = function extendBoundsToPaddedViewport(bounds, projection, pixels) {
    var _latLngBoundsToPixelB = latLngBoundsToPixelBounds(bounds, projection),
        northEast = _latLngBoundsToPixelB.northEast,
        southWest = _latLngBoundsToPixelB.southWest;

    var extendedPixelBounds = extendPixelBounds({
      northEast: northEast,
      southWest: southWest
    }, pixels);
    return pixelBoundsToLatLngBounds(extendedPixelBounds, projection);
  };
  /**
   * @hidden
   */

  var distanceBetweenPoints = function distanceBetweenPoints(p1, p2) {
    var R = 6371; // Radius of the Earth in km

    var dLat = (p2.lat - p1.lat) * Math.PI / 180;
    var dLon = (p2.lng - p1.lng) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  /**
   * @hidden
   */

  var latLngBoundsToPixelBounds = function latLngBoundsToPixelBounds(bounds, projection) {
    return {
      northEast: projection.fromLatLngToDivPixel(bounds.getNorthEast()),
      southWest: projection.fromLatLngToDivPixel(bounds.getSouthWest())
    };
  };
  /**
   * @hidden
   */


  var extendPixelBounds = function extendPixelBounds(_ref, pixels) {
    var northEast = _ref.northEast,
        southWest = _ref.southWest;
    northEast.x += pixels;
    northEast.y -= pixels;
    southWest.x -= pixels;
    southWest.y += pixels;
    return {
      northEast: northEast,
      southWest: southWest
    };
  };
  /**
   * @hidden
   */

  var pixelBoundsToLatLngBounds = function pixelBoundsToLatLngBounds(_ref2, projection) {
    var northEast = _ref2.northEast,
        southWest = _ref2.southWest;
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(projection.fromDivPixelToLatLng(northEast));
    bounds.extend(projection.fromDivPixelToLatLng(southWest));
    return bounds;
  };

  /**
   * @hidden
   */

  var AbstractAlgorithm = /*#__PURE__*/function () {
    function AbstractAlgorithm(_ref) {
      var _ref$maxZoom = _ref.maxZoom,
          maxZoom = _ref$maxZoom === void 0 ? 16 : _ref$maxZoom;

      _classCallCheck(this, AbstractAlgorithm);

      this.maxZoom = maxZoom;
    }
    /**
     * Helper function to bypass clustering based upon some map state such as
     * zoom, number of markers, etc.
     *
     * ```typescript
     *  cluster({markers, map}: AlgorithmInput): Cluster[] {
     *    if (shouldBypassClustering(map)) {
     *      return this.noop({markers, map})
     *    }
     * }
     * ```
     */


    _createClass(AbstractAlgorithm, [{
      key: "noop",
      value: function noop(_ref2) {
        var markers = _ref2.markers;
        return _noop(markers);
      }
    }]);

    return AbstractAlgorithm;
  }();
  /**
   * Abstract viewport algorithm proves a class to filter markers by a padded
   * viewport. This is a common optimization.
   *
   * @hidden
   */

  var AbstractViewportAlgorithm = /*#__PURE__*/function (_AbstractAlgorithm) {
    _inherits(AbstractViewportAlgorithm, _AbstractAlgorithm);

    var _super = _createSuper(AbstractViewportAlgorithm);

    function AbstractViewportAlgorithm(_a) {
      var _this;

      _classCallCheck(this, AbstractViewportAlgorithm);

      var _a$viewportPadding = _a.viewportPadding,
          viewportPadding = _a$viewportPadding === void 0 ? 60 : _a$viewportPadding,
          options = __rest(_a, ["viewportPadding"]);

      _this = _super.call(this, options);
      _this.viewportPadding = 60;
      _this.viewportPadding = viewportPadding;
      return _this;
    }

    _createClass(AbstractViewportAlgorithm, [{
      key: "calculate",
      value: function calculate(_ref3) {
        var markers = _ref3.markers,
            map = _ref3.map,
            mapCanvasProjection = _ref3.mapCanvasProjection;

        if (map.getZoom() >= this.maxZoom) {
          return {
            clusters: this.noop({
              markers: markers,
              map: map,
              mapCanvasProjection: mapCanvasProjection
            }),
            changed: false
          };
        }

        return {
          clusters: this.cluster({
            markers: filterMarkersToPaddedViewport(map, mapCanvasProjection, markers, this.viewportPadding),
            map: map,
            mapCanvasProjection: mapCanvasProjection
          })
        };
      }
    }]);

    return AbstractViewportAlgorithm;
  }(AbstractAlgorithm);
  /**
   * @hidden
   */

  var _noop = function _noop(markers) {
    var clusters = markers.map(function (marker) {
      return new Cluster({
        position: marker.getPosition(),
        markers: [marker]
      });
    });
    return clusters;
  };

  // flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods

  var domIterables = {
    CSSRuleList: 0,
    CSSStyleDeclaration: 0,
    CSSValueList: 0,
    ClientRectList: 0,
    DOMRectList: 0,
    DOMStringList: 0,
    DOMTokenList: 1,
    DataTransferItemList: 0,
    FileList: 0,
    HTMLAllCollection: 0,
    HTMLCollection: 0,
    HTMLFormElement: 0,
    HTMLSelectElement: 0,
    MediaList: 0,
    MimeTypeArray: 0,
    NamedNodeMap: 0,
    NodeList: 1,
    PaintRequestList: 0,
    Plugin: 0,
    PluginArray: 0,
    SVGLengthList: 0,
    SVGNumberList: 0,
    SVGPathSegList: 0,
    SVGPointList: 0,
    SVGStringList: 0,
    SVGTransformList: 0,
    SourceBufferList: 0,
    StyleSheetList: 0,
    TextTrackCueList: 0,
    TextTrackList: 0,
    TouchList: 0
  };

  var documentCreateElement$1 = documentCreateElement$2;
  var classList = documentCreateElement$1('span').classList;
  var DOMTokenListPrototype$1 = classList && classList.constructor && classList.constructor.prototype;
  var domTokenListPrototype = DOMTokenListPrototype$1 === Object.prototype ? undefined : DOMTokenListPrototype$1;

  var $forEach = arrayIteration.forEach;
  var arrayMethodIsStrict$1 = arrayMethodIsStrict$3;
  var STRICT_METHOD$1 = arrayMethodIsStrict$1('forEach'); // `Array.prototype.forEach` method implementation
  // https://tc39.es/ecma262/#sec-array.prototype.foreach

  var arrayForEach = !STRICT_METHOD$1 ? function forEach(callbackfn
  /* , thisArg */
  ) {
    return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined); // eslint-disable-next-line es-x/no-array-prototype-foreach -- safe
  } : [].forEach;

  var global$2 = global$d;
  var DOMIterables = domIterables;
  var DOMTokenListPrototype = domTokenListPrototype;
  var forEach = arrayForEach;
  var createNonEnumerableProperty = createNonEnumerableProperty$3;

  var handlePrototype = function (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
      createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
    } catch (error) {
      CollectionPrototype.forEach = forEach;
    }
  };

  for (var COLLECTION_NAME in DOMIterables) {
    if (DOMIterables[COLLECTION_NAME]) {
      handlePrototype(global$2[COLLECTION_NAME] && global$2[COLLECTION_NAME].prototype);
    }
  }

  handlePrototype(DOMTokenListPrototype);

  var $$5 = _export;
  var call$1 = functionCall; // `URL.prototype.toJSON` method
  // https://url.spec.whatwg.org/#dom-url-tojson

  $$5({
    target: 'URL',
    proto: true,
    enumerable: true
  }, {
    toJSON: function toJSON() {
      return call$1(URL.prototype.toString, this);
    }
  });

  var fastDeepEqual = function equal(a, b) {
    if (a === b) return true;

    if (a && b && typeof a == 'object' && typeof b == 'object') {
      if (a.constructor !== b.constructor) return false;
      var length, i, keys;

      if (Array.isArray(a)) {
        length = a.length;
        if (length != b.length) return false;

        for (i = length; i-- !== 0;) if (!equal(a[i], b[i])) return false;

        return true;
      }

      if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
      if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
      if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
      keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length) return false;

      for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

      for (i = length; i-- !== 0;) {
        var key = keys[i];
        if (!equal(a[key], b[key])) return false;
      }

      return true;
    } // true if both NaN, false otherwise


    return a !== a && b !== b;
  };

  /**
   * The default Grid algorithm historically used in Google Maps marker
   * clustering.
   *
   * The Grid algorithm does not implement caching and markers may flash as the
   * viewport changes. Instead use {@link SuperClusterAlgorithm}.
   */

  var GridAlgorithm = /*#__PURE__*/function (_AbstractViewportAlgo) {
    _inherits(GridAlgorithm, _AbstractViewportAlgo);

    var _super = _createSuper(GridAlgorithm);

    function GridAlgorithm(_a) {
      var _this;

      _classCallCheck(this, GridAlgorithm);

      var _a$maxDistance = _a.maxDistance,
          maxDistance = _a$maxDistance === void 0 ? 40000 : _a$maxDistance,
          _a$gridSize = _a.gridSize,
          gridSize = _a$gridSize === void 0 ? 40 : _a$gridSize,
          options = __rest(_a, ["maxDistance", "gridSize"]);

      _this = _super.call(this, options);
      _this.clusters = [];
      _this.maxDistance = maxDistance;
      _this.gridSize = gridSize;
      _this.state = {
        zoom: null
      };
      return _this;
    }

    _createClass(GridAlgorithm, [{
      key: "calculate",
      value: function calculate(_ref) {
        var markers = _ref.markers,
            map = _ref.map,
            mapCanvasProjection = _ref.mapCanvasProjection;
        var state = {
          zoom: map.getZoom()
        };
        var changed = false;

        if (this.state.zoom > this.maxZoom && state.zoom > this.maxZoom) ; else {
          changed = !fastDeepEqual(this.state, state);
        }

        this.state = state;

        if (map.getZoom() >= this.maxZoom) {
          return {
            clusters: this.noop({
              markers: markers,
              map: map,
              mapCanvasProjection: mapCanvasProjection
            }),
            changed: changed
          };
        }

        return {
          clusters: this.cluster({
            markers: filterMarkersToPaddedViewport(map, mapCanvasProjection, markers, this.viewportPadding),
            map: map,
            mapCanvasProjection: mapCanvasProjection
          })
        };
      }
    }, {
      key: "cluster",
      value: function cluster(_ref2) {
        var _this2 = this;

        var markers = _ref2.markers,
            map = _ref2.map,
            mapCanvasProjection = _ref2.mapCanvasProjection;
        this.clusters = [];
        markers.forEach(function (marker) {
          _this2.addToClosestCluster(marker, map, mapCanvasProjection);
        });
        return this.clusters;
      }
    }, {
      key: "addToClosestCluster",
      value: function addToClosestCluster(marker, map, projection) {
        var maxDistance = this.maxDistance; // Some large number

        var cluster = null;

        for (var i = 0; i < this.clusters.length; i++) {
          var candidate = this.clusters[i];
          var distance = distanceBetweenPoints(candidate.bounds.getCenter().toJSON(), marker.getPosition().toJSON());

          if (distance < maxDistance) {
            maxDistance = distance;
            cluster = candidate;
          }
        }

        if (cluster && extendBoundsToPaddedViewport(cluster.bounds, projection, this.gridSize).contains(marker.getPosition())) {
          cluster.push(marker);
        } else {
          var _cluster = new Cluster({
            markers: [marker]
          });

          this.clusters.push(_cluster);
        }
      }
    }]);

    return GridAlgorithm;
  }(AbstractViewportAlgorithm);

  /**
   * Noop algorithm does not generate any clusters or filter markers by the an extended viewport.
   */

  var NoopAlgorithm = /*#__PURE__*/function (_AbstractAlgorithm) {
    _inherits(NoopAlgorithm, _AbstractAlgorithm);

    var _super = _createSuper(NoopAlgorithm);

    function NoopAlgorithm(_a) {
      _classCallCheck(this, NoopAlgorithm);

      var options = __rest(_a, []);

      return _super.call(this, options);
    }

    _createClass(NoopAlgorithm, [{
      key: "calculate",
      value: function calculate(_ref) {
        var markers = _ref.markers,
            map = _ref.map,
            mapCanvasProjection = _ref.mapCanvasProjection;
        return {
          clusters: this.cluster({
            markers: markers,
            map: map,
            mapCanvasProjection: mapCanvasProjection
          }),
          changed: false
        };
      }
    }, {
      key: "cluster",
      value: function cluster(input) {
        return this.noop(input);
      }
    }]);

    return NoopAlgorithm;
  }(AbstractAlgorithm);

  var internalObjectKeys = objectKeysInternal;
  var enumBugKeys$1 = enumBugKeys$3; // `Object.keys` method
  // https://tc39.es/ecma262/#sec-object.keys
  // eslint-disable-next-line es-x/no-object-keys -- safe

  var objectKeys$2 = Object.keys || function keys(O) {
    return internalObjectKeys(O, enumBugKeys$1);
  };

  var DESCRIPTORS$2 = descriptors;
  var uncurryThis$6 = functionUncurryThis;
  var call = functionCall;
  var fails$2 = fails$e;
  var objectKeys$1 = objectKeys$2;
  var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
  var propertyIsEnumerableModule = objectPropertyIsEnumerable;
  var toObject$1 = toObject$5;
  var IndexedObject = indexedObject; // eslint-disable-next-line es-x/no-object-assign -- safe

  var $assign = Object.assign; // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing

  var defineProperty$2 = Object.defineProperty;
  var concat = uncurryThis$6([].concat); // `Object.assign` method
  // https://tc39.es/ecma262/#sec-object.assign

  var objectAssign = !$assign || fails$2(function () {
    // should have correct order of operations (Edge bug)
    if (DESCRIPTORS$2 && $assign({
      b: 1
    }, $assign(defineProperty$2({}, 'a', {
      enumerable: true,
      get: function () {
        defineProperty$2(this, 'b', {
          value: 3,
          enumerable: false
        });
      }
    }), {
      b: 2
    })).b !== 1) return true; // should work with symbols and should have deterministic property order (V8 bug)

    var A = {};
    var B = {}; // eslint-disable-next-line es-x/no-symbol -- safe

    var symbol = Symbol();
    var alphabet = 'abcdefghijklmnopqrst';
    A[symbol] = 7;
    alphabet.split('').forEach(function (chr) {
      B[chr] = chr;
    });
    return $assign({}, A)[symbol] != 7 || objectKeys$1($assign({}, B)).join('') != alphabet;
  }) ? function assign(target, source) {
    // eslint-disable-line no-unused-vars -- required for `.length`
    var T = toObject$1(target);
    var argumentsLength = arguments.length;
    var index = 1;
    var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
    var propertyIsEnumerable = propertyIsEnumerableModule.f;

    while (argumentsLength > index) {
      var S = IndexedObject(arguments[index++]);
      var keys = getOwnPropertySymbols ? concat(objectKeys$1(S), getOwnPropertySymbols(S)) : objectKeys$1(S);
      var length = keys.length;
      var j = 0;
      var key;

      while (length > j) {
        key = keys[j++];
        if (!DESCRIPTORS$2 || call(propertyIsEnumerable, S, key)) T[key] = S[key];
      }
    }

    return T;
  } : $assign;

  var $$4 = _export;
  var assign = objectAssign; // `Object.assign` method
  // https://tc39.es/ecma262/#sec-object.assign
  // eslint-disable-next-line es-x/no-object-assign -- required for testing

  $$4({
    target: 'Object',
    stat: true,
    arity: 2,
    forced: Object.assign !== assign
  }, {
    assign: assign
  });

  var kdbush = {exports: {}};

  (function (module, exports) {
    (function (global, factory) {
      module.exports = factory() ;
    })(commonjsGlobal, function () {

      function sortKD(ids, coords, nodeSize, left, right, depth) {
        if (right - left <= nodeSize) {
          return;
        }

        var m = left + right >> 1;
        select(ids, coords, m, left, right, depth % 2);
        sortKD(ids, coords, nodeSize, left, m - 1, depth + 1);
        sortKD(ids, coords, nodeSize, m + 1, right, depth + 1);
      }

      function select(ids, coords, k, left, right, inc) {
        while (right > left) {
          if (right - left > 600) {
            var n = right - left + 1;
            var m = k - left + 1;
            var z = Math.log(n);
            var s = 0.5 * Math.exp(2 * z / 3);
            var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
            var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
            var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
            select(ids, coords, k, newLeft, newRight, inc);
          }

          var t = coords[2 * k + inc];
          var i = left;
          var j = right;
          swapItem(ids, coords, left, k);

          if (coords[2 * right + inc] > t) {
            swapItem(ids, coords, left, right);
          }

          while (i < j) {
            swapItem(ids, coords, i, j);
            i++;
            j--;

            while (coords[2 * i + inc] < t) {
              i++;
            }

            while (coords[2 * j + inc] > t) {
              j--;
            }
          }

          if (coords[2 * left + inc] === t) {
            swapItem(ids, coords, left, j);
          } else {
            j++;
            swapItem(ids, coords, j, right);
          }

          if (j <= k) {
            left = j + 1;
          }

          if (k <= j) {
            right = j - 1;
          }
        }
      }

      function swapItem(ids, coords, i, j) {
        swap(ids, i, j);
        swap(coords, 2 * i, 2 * j);
        swap(coords, 2 * i + 1, 2 * j + 1);
      }

      function swap(arr, i, j) {
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
      }

      function range(ids, coords, minX, minY, maxX, maxY, nodeSize) {
        var stack = [0, ids.length - 1, 0];
        var result = [];
        var x, y;

        while (stack.length) {
          var axis = stack.pop();
          var right = stack.pop();
          var left = stack.pop();

          if (right - left <= nodeSize) {
            for (var i = left; i <= right; i++) {
              x = coords[2 * i];
              y = coords[2 * i + 1];

              if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
                result.push(ids[i]);
              }
            }

            continue;
          }

          var m = Math.floor((left + right) / 2);
          x = coords[2 * m];
          y = coords[2 * m + 1];

          if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
            result.push(ids[m]);
          }

          var nextAxis = (axis + 1) % 2;

          if (axis === 0 ? minX <= x : minY <= y) {
            stack.push(left);
            stack.push(m - 1);
            stack.push(nextAxis);
          }

          if (axis === 0 ? maxX >= x : maxY >= y) {
            stack.push(m + 1);
            stack.push(right);
            stack.push(nextAxis);
          }
        }

        return result;
      }

      function within(ids, coords, qx, qy, r, nodeSize) {
        var stack = [0, ids.length - 1, 0];
        var result = [];
        var r2 = r * r;

        while (stack.length) {
          var axis = stack.pop();
          var right = stack.pop();
          var left = stack.pop();

          if (right - left <= nodeSize) {
            for (var i = left; i <= right; i++) {
              if (sqDist(coords[2 * i], coords[2 * i + 1], qx, qy) <= r2) {
                result.push(ids[i]);
              }
            }

            continue;
          }

          var m = Math.floor((left + right) / 2);
          var x = coords[2 * m];
          var y = coords[2 * m + 1];

          if (sqDist(x, y, qx, qy) <= r2) {
            result.push(ids[m]);
          }

          var nextAxis = (axis + 1) % 2;

          if (axis === 0 ? qx - r <= x : qy - r <= y) {
            stack.push(left);
            stack.push(m - 1);
            stack.push(nextAxis);
          }

          if (axis === 0 ? qx + r >= x : qy + r >= y) {
            stack.push(m + 1);
            stack.push(right);
            stack.push(nextAxis);
          }
        }

        return result;
      }

      function sqDist(ax, ay, bx, by) {
        var dx = ax - bx;
        var dy = ay - by;
        return dx * dx + dy * dy;
      }

      var defaultGetX = function (p) {
        return p[0];
      };

      var defaultGetY = function (p) {
        return p[1];
      };

      var KDBush = function KDBush(points, getX, getY, nodeSize, ArrayType) {
        if (getX === void 0) getX = defaultGetX;
        if (getY === void 0) getY = defaultGetY;
        if (nodeSize === void 0) nodeSize = 64;
        if (ArrayType === void 0) ArrayType = Float64Array;
        this.nodeSize = nodeSize;
        this.points = points;
        var IndexArrayType = points.length < 65536 ? Uint16Array : Uint32Array;
        var ids = this.ids = new IndexArrayType(points.length);
        var coords = this.coords = new ArrayType(points.length * 2);

        for (var i = 0; i < points.length; i++) {
          ids[i] = i;
          coords[2 * i] = getX(points[i]);
          coords[2 * i + 1] = getY(points[i]);
        }

        sortKD(ids, coords, nodeSize, 0, ids.length - 1, 0);
      };

      KDBush.prototype.range = function range$1(minX, minY, maxX, maxY) {
        return range(this.ids, this.coords, minX, minY, maxX, maxY, this.nodeSize);
      };

      KDBush.prototype.within = function within$1(x, y, r) {
        return within(this.ids, this.coords, x, y, r, this.nodeSize);
      };

      return KDBush;
    });
  })(kdbush);

  var KDBush = kdbush.exports;

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

  class Supercluster {
    constructor(options) {
      this.options = extend$1(Object.create(defaultOptions), options);
      this.trees = new Array(this.options.maxZoom + 1);
    }

    load(points) {
      const {
        log,
        minZoom,
        maxZoom,
        nodeSize
      } = this.options;
      if (log) console.time('total time');
      const timerId = `prepare ${points.length} points`;
      if (log) console.time(timerId);
      this.points = points; // generate a cluster object for each point and index input points into a KD-tree

      let clusters = [];

      for (let i = 0; i < points.length; i++) {
        if (!points[i].geometry) continue;
        clusters.push(createPointCluster(points[i], i));
      }

      this.trees[maxZoom + 1] = new KDBush(clusters, getX, getY, nodeSize, Float32Array);
      if (log) console.timeEnd(timerId); // cluster points on max zoom, then cluster the results on previous zoom, etc.;
      // results in a cluster hierarchy across zoom levels

      for (let z = maxZoom; z >= minZoom; z--) {
        const now = +Date.now(); // create a new set of clusters for the zoom and index them with a KD-tree

        clusters = this._cluster(clusters, z);
        this.trees[z] = new KDBush(clusters, getX, getY, nodeSize, Float32Array);
        if (log) console.log('z%d: %d clusters in %dms', z, clusters.length, +Date.now() - now);
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
      const clusters = [];

      for (const id of ids) {
        const c = tree.points[id];
        clusters.push(c.numPoints ? getClusterJSON(c) : this.points[c.index]);
      }

      return clusters;
    }

    getChildren(clusterId) {
      const originId = this._getOriginId(clusterId);

      const originZoom = this._getOriginZoom(clusterId);

      const errorMsg = 'No cluster with the specified id.';
      const index = this.trees[originZoom];
      if (!index) throw new Error(errorMsg);
      const origin = index.points[originId];
      if (!origin) throw new Error(errorMsg);
      const r = this.options.radius / (this.options.extent * Math.pow(2, originZoom - 1));
      const ids = index.within(origin.x, origin.y, r);
      const children = [];

      for (const id of ids) {
        const c = index.points[id];

        if (c.parentId === clusterId) {
          children.push(c.numPoints ? getClusterJSON(c) : this.points[c.index]);
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

      this._addTileFeatures(tree.range((x - p) / z2, top, (x + 1 + p) / z2, bottom), tree.points, x, y, z2, tile);

      if (x === 0) {
        this._addTileFeatures(tree.range(1 - p / z2, top, 1, bottom), tree.points, z2, y, z2, tile);
      }

      if (x === z2 - 1) {
        this._addTileFeatures(tree.range(0, top, p / z2, bottom), tree.points, -1, y, z2, tile);
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
            skipped = this._appendLeaves(result, props.cluster_id, limit, offset, skipped); // exit the cluster
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

    _addTileFeatures(ids, points, x, y, z2, tile) {
      for (const i of ids) {
        const c = points[i];
        const isCluster = c.numPoints;
        let tags, px, py;

        if (isCluster) {
          tags = getClusterProperties(c);
          px = c.x;
          py = c.y;
        } else {
          const p = this.points[c.index];
          tags = p.properties;
          px = lngX(p.geometry.coordinates[0]);
          py = latY(p.geometry.coordinates[1]);
        }

        const f = {
          type: 1,
          geometry: [[Math.round(this.options.extent * (px * z2 - x)), Math.round(this.options.extent * (py * z2 - y))]],
          tags
        }; // assign id

        let id;

        if (isCluster) {
          id = c.id;
        } else if (this.options.generateId) {
          // optionally generate id
          id = c.index;
        } else if (this.points[c.index].id) {
          // keep id if already assigned
          id = this.points[c.index].id;
        }

        if (id !== undefined) f.id = id;
        tile.features.push(f);
      }
    }

    _limitZoom(z) {
      return Math.max(this.options.minZoom, Math.min(Math.floor(+z), this.options.maxZoom + 1));
    }

    _cluster(points, zoom) {
      const clusters = [];
      const {
        radius,
        extent,
        reduce,
        minPoints
      } = this.options;
      const r = radius / (extent * Math.pow(2, zoom)); // loop through each point

      for (let i = 0; i < points.length; i++) {
        const p = points[i]; // if we've already visited the point at this zoom level, skip it

        if (p.zoom <= zoom) continue;
        p.zoom = zoom; // find all nearby points

        const tree = this.trees[zoom + 1];
        const neighborIds = tree.within(p.x, p.y, r);
        const numPointsOrigin = p.numPoints || 1;
        let numPoints = numPointsOrigin; // count the number of points in a potential cluster

        for (const neighborId of neighborIds) {
          const b = tree.points[neighborId]; // filter out neighbors that are already processed

          if (b.zoom > zoom) numPoints += b.numPoints || 1;
        } // if there were neighbors to merge, and there are enough points to form a cluster


        if (numPoints > numPointsOrigin && numPoints >= minPoints) {
          let wx = p.x * numPointsOrigin;
          let wy = p.y * numPointsOrigin;
          let clusterProperties = reduce && numPointsOrigin > 1 ? this._map(p, true) : null; // encode both zoom and point index on which the cluster originated -- offset by total length of features

          const id = (i << 5) + (zoom + 1) + this.points.length;

          for (const neighborId of neighborIds) {
            const b = tree.points[neighborId];
            if (b.zoom <= zoom) continue;
            b.zoom = zoom; // save the zoom (so it doesn't get processed twice)

            const numPoints2 = b.numPoints || 1;
            wx += b.x * numPoints2; // accumulate coordinates for calculating weighted center

            wy += b.y * numPoints2;
            b.parentId = id;

            if (reduce) {
              if (!clusterProperties) clusterProperties = this._map(p, true);
              reduce(clusterProperties, this._map(b));
            }
          }

          p.parentId = id;
          clusters.push(createCluster(wx / numPoints, wy / numPoints, id, numPoints, clusterProperties));
        } else {
          // left points as unclustered
          clusters.push(p);

          if (numPoints > 1) {
            for (const neighborId of neighborIds) {
              const b = tree.points[neighborId];
              if (b.zoom <= zoom) continue;
              b.zoom = zoom;
              clusters.push(b);
            }
          }
        }
      }

      return clusters;
    } // get index of the point from which the cluster originated


    _getOriginId(clusterId) {
      return clusterId - this.points.length >> 5;
    } // get zoom of the point from which the cluster originated


    _getOriginZoom(clusterId) {
      return (clusterId - this.points.length) % 32;
    }

    _map(point, clone) {
      if (point.numPoints) {
        return clone ? extend$1({}, point.properties) : point.properties;
      }

      const original = this.points[point.index].properties;
      const result = this.options.map(original);
      return clone && result === original ? extend$1({}, result) : result;
    }

  }

  function createCluster(x, y, id, numPoints, properties) {
    return {
      x: fround(x),
      // weighted cluster center; round for consistency with Float32Array index
      y: fround(y),
      zoom: Infinity,
      // the last zoom the cluster was processed at
      id,
      // encodes index of the first child of the cluster and its zoom level
      parentId: -1,
      // parent cluster id
      numPoints,
      properties
    };
  }

  function createPointCluster(p, id) {
    const [x, y] = p.geometry.coordinates;
    return {
      x: fround(lngX(x)),
      // projected point coordinates
      y: fround(latY(y)),
      zoom: Infinity,
      // the last zoom the point was processed at
      index: id,
      // index of the source feature in the original input array,
      parentId: -1 // parent cluster id

    };
  }

  function getClusterJSON(cluster) {
    return {
      type: 'Feature',
      id: cluster.id,
      properties: getClusterProperties(cluster),
      geometry: {
        type: 'Point',
        coordinates: [xLng(cluster.x), yLat(cluster.y)]
      }
    };
  }

  function getClusterProperties(cluster) {
    const count = cluster.numPoints;
    const abbrev = count >= 10000 ? `${Math.round(count / 1000)}k` : count >= 1000 ? `${Math.round(count / 100) / 10}k` : count;
    return extend$1(extend$1({}, cluster.properties), {
      cluster: true,
      cluster_id: cluster.id,
      point_count: count,
      point_count_abbreviated: abbrev
    });
  } // longitude/latitude to spherical mercator in [0..1] range


  function lngX(lng) {
    return lng / 360 + 0.5;
  }

  function latY(lat) {
    const sin = Math.sin(lat * Math.PI / 180);
    const y = 0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI;
    return y < 0 ? 0 : y > 1 ? 1 : y;
  } // spherical mercator to longitude/latitude


  function xLng(x) {
    return (x - 0.5) * 360;
  }

  function yLat(y) {
    const y2 = (180 - y * 360) * Math.PI / 180;
    return 360 * Math.atan(Math.exp(y2)) / Math.PI - 90;
  }

  function extend$1(dest, src) {
    for (const id in src) dest[id] = src[id];

    return dest;
  }

  function getX(p) {
    return p.x;
  }

  function getY(p) {
    return p.y;
  }

  /**
   * A very fast JavaScript algorithm for geospatial point clustering using KD trees.
   *
   * @see https://www.npmjs.com/package/supercluster for more information on options.
   */

  var SuperClusterAlgorithm = /*#__PURE__*/function (_AbstractAlgorithm) {
    _inherits(SuperClusterAlgorithm, _AbstractAlgorithm);

    var _super = _createSuper(SuperClusterAlgorithm);

    function SuperClusterAlgorithm(_a) {
      var _this;

      _classCallCheck(this, SuperClusterAlgorithm);

      var maxZoom = _a.maxZoom,
          _a$radius = _a.radius,
          radius = _a$radius === void 0 ? 60 : _a$radius,
          options = __rest(_a, ["maxZoom", "radius"]);

      _this = _super.call(this, {
        maxZoom: maxZoom
      });
      _this.superCluster = new Supercluster(Object.assign({
        maxZoom: _this.maxZoom,
        radius: radius
      }, options));
      _this.state = {
        zoom: null
      };
      return _this;
    }

    _createClass(SuperClusterAlgorithm, [{
      key: "calculate",
      value: function calculate(input) {
        var changed = false;

        if (!fastDeepEqual(input.markers, this.markers)) {
          changed = true; // TODO use proxy to avoid copy?

          this.markers = _toConsumableArray(input.markers);
          var points = this.markers.map(function (marker) {
            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [marker.getPosition().lng(), marker.getPosition().lat()]
              },
              properties: {
                marker: marker
              }
            };
          });
          this.superCluster.load(points);
        }

        var state = {
          zoom: input.map.getZoom()
        };

        if (!changed) {
          if (this.state.zoom > this.maxZoom && state.zoom > this.maxZoom) ; else {
            changed = changed || !fastDeepEqual(this.state, state);
          }
        }

        this.state = state;

        if (changed) {
          this.clusters = this.cluster(input);
        }

        return {
          clusters: this.clusters,
          changed: changed
        };
      }
    }, {
      key: "cluster",
      value: function cluster(_ref) {
        var map = _ref.map;
        return this.superCluster.getClusters([-180, -90, 180, 90], Math.round(map.getZoom())).map(this.transformCluster.bind(this));
      }
    }, {
      key: "transformCluster",
      value: function transformCluster(_ref2) {
        var _ref2$geometry$coordi = _slicedToArray(_ref2.geometry.coordinates, 2),
            lng = _ref2$geometry$coordi[0],
            lat = _ref2$geometry$coordi[1],
            properties = _ref2.properties;

        if (properties.cluster) {
          return new Cluster({
            markers: this.superCluster.getLeaves(properties.cluster_id, Infinity).map(function (leaf) {
              return leaf.properties.marker;
            }),
            position: new google.maps.LatLng({
              lat: lat,
              lng: lng
            })
          });
        } else {
          var marker = properties.marker;
          return new Cluster({
            markers: [marker],
            position: marker.getPosition()
          });
        }
      }
    }]);

    return SuperClusterAlgorithm;
  }(AbstractAlgorithm);

  var objectDefineProperties = {};

  var DESCRIPTORS$1 = descriptors;
  var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
  var definePropertyModule$1 = objectDefineProperty;
  var anObject$2 = anObject$5;
  var toIndexedObject = toIndexedObject$4;
  var objectKeys = objectKeys$2; // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  // eslint-disable-next-line es-x/no-object-defineproperties -- safe

  objectDefineProperties.f = DESCRIPTORS$1 && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject$2(O);
    var props = toIndexedObject(Properties);
    var keys = objectKeys(Properties);
    var length = keys.length;
    var index = 0;
    var key;

    while (length > index) definePropertyModule$1.f(O, key = keys[index++], props[key]);

    return O;
  };

  var getBuiltIn = getBuiltIn$5;
  var html$1 = getBuiltIn('document', 'documentElement');

  /* global ActiveXObject -- old IE, WSH */
  var anObject$1 = anObject$5;
  var definePropertiesModule = objectDefineProperties;
  var enumBugKeys = enumBugKeys$3;
  var hiddenKeys = hiddenKeys$4;
  var html = html$1;
  var documentCreateElement = documentCreateElement$2;
  var sharedKey = sharedKey$2;
  var GT = '>';
  var LT = '<';
  var PROTOTYPE = 'prototype';
  var SCRIPT = 'script';
  var IE_PROTO = sharedKey('IE_PROTO');

  var EmptyConstructor = function () {
    /* empty */
  };

  var scriptTag = function (content) {
    return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
  }; // Create object with fake `null` prototype: use ActiveX Object with cleared prototype


  var NullProtoObjectViaActiveX = function (activeXDocument) {
    activeXDocument.write(scriptTag(''));
    activeXDocument.close();
    var temp = activeXDocument.parentWindow.Object;
    activeXDocument = null; // avoid memory leak

    return temp;
  }; // Create object with fake `null` prototype: use iframe Object with cleared prototype


  var NullProtoObjectViaIFrame = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement('iframe');
    var JS = 'java' + SCRIPT + ':';
    var iframeDocument;
    iframe.style.display = 'none';
    html.appendChild(iframe); // https://github.com/zloirock/core-js/issues/475

    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag('document.F=Object'));
    iframeDocument.close();
    return iframeDocument.F;
  }; // Check for document.domain and active x support
  // No need to use active x approach when document.domain is not set
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  // avoid IE GC bug


  var activeXDocument;

  var NullProtoObject = function () {
    try {
      activeXDocument = new ActiveXObject('htmlfile');
    } catch (error) {
      /* ignore */
    }

    NullProtoObject = typeof document != 'undefined' ? document.domain && activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) // old IE
    : NullProtoObjectViaIFrame() : NullProtoObjectViaActiveX(activeXDocument); // WSH

    var length = enumBugKeys.length;

    while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];

    return NullProtoObject();
  };

  hiddenKeys[IE_PROTO] = true; // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  // eslint-disable-next-line es-x/no-object-create -- safe

  var objectCreate = Object.create || function create(O, Properties) {
    var result;

    if (O !== null) {
      EmptyConstructor[PROTOTYPE] = anObject$1(O);
      result = new EmptyConstructor();
      EmptyConstructor[PROTOTYPE] = null; // add "__proto__" for Object.getPrototypeOf polyfill

      result[IE_PROTO] = O;
    } else result = NullProtoObject();

    return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
  };

  var wellKnownSymbol$2 = wellKnownSymbol$8;
  var create = objectCreate;
  var defineProperty$1 = objectDefineProperty.f;
  var UNSCOPABLES = wellKnownSymbol$2('unscopables');
  var ArrayPrototype = Array.prototype; // Array.prototype[@@unscopables]
  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables

  if (ArrayPrototype[UNSCOPABLES] == undefined) {
    defineProperty$1(ArrayPrototype, UNSCOPABLES, {
      configurable: true,
      value: create(null)
    });
  } // add a key to Array.prototype[@@unscopables]


  var addToUnscopables$1 = function (key) {
    ArrayPrototype[UNSCOPABLES][key] = true;
  };

  var $$3 = _export;
  var $includes = arrayIncludes.includes;
  var fails$1 = fails$e;
  var addToUnscopables = addToUnscopables$1; // FF99+ bug

  var BROKEN_ON_SPARSE = fails$1(function () {
    return !Array(1).includes();
  }); // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes

  $$3({
    target: 'Array',
    proto: true,
    forced: BROKEN_ON_SPARSE
  }, {
    includes: function includes(el
    /* , fromIndex = 0 */
    ) {
      return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
    }
  }); // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables

  addToUnscopables('includes');

  var isObject$1 = isObject$8;
  var classof$1 = classofRaw$1;
  var wellKnownSymbol$1 = wellKnownSymbol$8;
  var MATCH$1 = wellKnownSymbol$1('match'); // `IsRegExp` abstract operation
  // https://tc39.es/ecma262/#sec-isregexp

  var isRegexp = function (it) {
    var isRegExp;
    return isObject$1(it) && ((isRegExp = it[MATCH$1]) !== undefined ? !!isRegExp : classof$1(it) == 'RegExp');
  };

  var isRegExp = isRegexp;
  var $TypeError$3 = TypeError;

  var notARegexp = function (it) {
    if (isRegExp(it)) {
      throw $TypeError$3("The method doesn't accept regular expressions");
    }

    return it;
  };

  var classof = classof$5;
  var $String$1 = String;

  var toString$2 = function (argument) {
    if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
    return $String$1(argument);
  };

  var wellKnownSymbol = wellKnownSymbol$8;
  var MATCH = wellKnownSymbol('match');

  var correctIsRegexpLogic = function (METHOD_NAME) {
    var regexp = /./;

    try {
      '/./'[METHOD_NAME](regexp);
    } catch (error1) {
      try {
        regexp[MATCH] = false;
        return '/./'[METHOD_NAME](regexp);
      } catch (error2) {
        /* empty */
      }
    }

    return false;
  };

  var $$2 = _export;
  var uncurryThis$5 = functionUncurryThis;
  var notARegExp = notARegexp;
  var requireObjectCoercible$1 = requireObjectCoercible$4;
  var toString$1 = toString$2;
  var correctIsRegExpLogic = correctIsRegexpLogic;
  var stringIndexOf = uncurryThis$5(''.indexOf); // `String.prototype.includes` method
  // https://tc39.es/ecma262/#sec-string.prototype.includes

  $$2({
    target: 'String',
    proto: true,
    forced: !correctIsRegExpLogic('includes')
  }, {
    includes: function includes(searchString
    /* , position = 0 */
    ) {
      return !!~stringIndexOf(toString$1(requireObjectCoercible$1(this)), toString$1(notARegExp(searchString)), arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  /* eslint-disable es-x/no-array-prototype-indexof -- required for testing */


  var $$1 = _export;
  var uncurryThis$4 = functionUncurryThis;
  var $IndexOf = arrayIncludes.indexOf;
  var arrayMethodIsStrict = arrayMethodIsStrict$3;
  var un$IndexOf = uncurryThis$4([].indexOf);
  var NEGATIVE_ZERO = !!un$IndexOf && 1 / un$IndexOf([1], 1, -0) < 0;
  var STRICT_METHOD = arrayMethodIsStrict('indexOf'); // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof

  $$1({
    target: 'Array',
    proto: true,
    forced: NEGATIVE_ZERO || !STRICT_METHOD
  }, {
    indexOf: function indexOf(searchElement
    /* , fromIndex = 0 */
    ) {
      var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
      return NEGATIVE_ZERO // convert -0 to +0
      ? un$IndexOf(this, searchElement, fromIndex) || 0 : $IndexOf(this, searchElement, fromIndex);
    }
  });

  var $TypeError$2 = TypeError;
  var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

  var doesNotExceedSafeInteger$1 = function (it) {
    if (it > MAX_SAFE_INTEGER) throw $TypeError$2('Maximum allowed index exceeded');
    return it;
  };

  var toPropertyKey = toPropertyKey$3;
  var definePropertyModule = objectDefineProperty;
  var createPropertyDescriptor = createPropertyDescriptor$3;

  var createProperty$1 = function (object, key, value) {
    var propertyKey = toPropertyKey(key);
    if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
  };

  var tryToString = tryToString$2;
  var $TypeError$1 = TypeError;

  var deletePropertyOrThrow$1 = function (O, P) {
    if (!delete O[P]) throw $TypeError$1('Cannot delete property ' + tryToString(P) + ' of ' + tryToString(O));
  };

  var $ = _export;
  var toObject = toObject$5;
  var toAbsoluteIndex = toAbsoluteIndex$2;
  var toIntegerOrInfinity = toIntegerOrInfinity$3;
  var lengthOfArrayLike = lengthOfArrayLike$4;
  var doesNotExceedSafeInteger = doesNotExceedSafeInteger$1;
  var arraySpeciesCreate = arraySpeciesCreate$2;
  var createProperty = createProperty$1;
  var deletePropertyOrThrow = deletePropertyOrThrow$1;
  var arrayMethodHasSpeciesSupport = arrayMethodHasSpeciesSupport$3;
  var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');
  var max = Math.max;
  var min = Math.min; // `Array.prototype.splice` method
  // https://tc39.es/ecma262/#sec-array.prototype.splice
  // with adding support of @@species

  $({
    target: 'Array',
    proto: true,
    forced: !HAS_SPECIES_SUPPORT
  }, {
    splice: function splice(start, deleteCount
    /* , ...items */
    ) {
      var O = toObject(this);
      var len = lengthOfArrayLike(O);
      var actualStart = toAbsoluteIndex(start, len);
      var argumentsLength = arguments.length;
      var insertCount, actualDeleteCount, A, k, from, to;

      if (argumentsLength === 0) {
        insertCount = actualDeleteCount = 0;
      } else if (argumentsLength === 1) {
        insertCount = 0;
        actualDeleteCount = len - actualStart;
      } else {
        insertCount = argumentsLength - 2;
        actualDeleteCount = min(max(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
      }

      doesNotExceedSafeInteger(len + insertCount - actualDeleteCount);
      A = arraySpeciesCreate(O, actualDeleteCount);

      for (k = 0; k < actualDeleteCount; k++) {
        from = actualStart + k;
        if (from in O) createProperty(A, k, O[from]);
      }

      A.length = actualDeleteCount;

      if (insertCount < actualDeleteCount) {
        for (k = actualStart; k < len - actualDeleteCount; k++) {
          from = k + actualDeleteCount;
          to = k + insertCount;
          if (from in O) O[to] = O[from];else deletePropertyOrThrow(O, to);
        }

        for (k = len; k > len - actualDeleteCount + insertCount; k--) deletePropertyOrThrow(O, k - 1);
      } else if (insertCount > actualDeleteCount) {
        for (k = len - actualDeleteCount; k > actualStart; k--) {
          from = k + actualDeleteCount - 1;
          to = k + insertCount - 1;
          if (from in O) O[to] = O[from];else deletePropertyOrThrow(O, to);
        }
      }

      for (k = 0; k < insertCount; k++) {
        O[k + actualStart] = arguments[k + 2];
      }

      O.length = len - actualDeleteCount + insertCount;
      return A;
    }
  });

  var isCallable$1 = isCallable$e;
  var $String = String;
  var $TypeError = TypeError;

  var aPossiblePrototype$1 = function (argument) {
    if (typeof argument == 'object' || isCallable$1(argument)) return argument;
    throw $TypeError("Can't set " + $String(argument) + ' as a prototype');
  };

  /* eslint-disable no-proto -- safe */
  var uncurryThis$3 = functionUncurryThis;
  var anObject = anObject$5;
  var aPossiblePrototype = aPossiblePrototype$1; // `Object.setPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.setprototypeof
  // Works with __proto__ only. Old v8 can't work with null proto objects.
  // eslint-disable-next-line es-x/no-object-setprototypeof -- safe

  var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
    var CORRECT_SETTER = false;
    var test = {};
    var setter;

    try {
      // eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
      setter = uncurryThis$3(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
      setter(test, []);
      CORRECT_SETTER = test instanceof Array;
    } catch (error) {
      /* empty */
    }

    return function setPrototypeOf(O, proto) {
      anObject(O);
      aPossiblePrototype(proto);
      if (CORRECT_SETTER) setter(O, proto);else O.__proto__ = proto;
      return O;
    };
  }() : undefined);

  var isCallable = isCallable$e;
  var isObject = isObject$8;
  var setPrototypeOf = objectSetPrototypeOf; // makes subclassing work correct for wrapped built-ins

  var inheritIfRequired$1 = function ($this, dummy, Wrapper) {
    var NewTarget, NewTargetPrototype;
    if ( // it can work only with native `setPrototypeOf`
    setPrototypeOf && // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) && NewTarget !== Wrapper && isObject(NewTargetPrototype = NewTarget.prototype) && NewTargetPrototype !== Wrapper.prototype) setPrototypeOf($this, NewTargetPrototype);
    return $this;
  };

  var uncurryThis$2 = functionUncurryThis; // `thisNumberValue` abstract operation
  // https://tc39.es/ecma262/#sec-thisnumbervalue

  var thisNumberValue$1 = uncurryThis$2(1.0.valueOf);

  var whitespaces$1 = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' + '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

  var uncurryThis$1 = functionUncurryThis;
  var requireObjectCoercible = requireObjectCoercible$4;
  var toString = toString$2;
  var whitespaces = whitespaces$1;
  var replace = uncurryThis$1(''.replace);
  var whitespace = '[' + whitespaces + ']';
  var ltrim = RegExp('^' + whitespace + whitespace + '*');
  var rtrim = RegExp(whitespace + whitespace + '*$'); // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation

  var createMethod = function (TYPE) {
    return function ($this) {
      var string = toString(requireObjectCoercible($this));
      if (TYPE & 1) string = replace(string, ltrim, '');
      if (TYPE & 2) string = replace(string, rtrim, '');
      return string;
    };
  };

  var stringTrim = {
    // `String.prototype.{ trimLeft, trimStart }` methods
    // https://tc39.es/ecma262/#sec-string.prototype.trimstart
    start: createMethod(1),
    // `String.prototype.{ trimRight, trimEnd }` methods
    // https://tc39.es/ecma262/#sec-string.prototype.trimend
    end: createMethod(2),
    // `String.prototype.trim` method
    // https://tc39.es/ecma262/#sec-string.prototype.trim
    trim: createMethod(3)
  };

  var DESCRIPTORS = descriptors;
  var global$1 = global$d;
  var uncurryThis = functionUncurryThis;
  var isForced = isForced_1;
  var defineBuiltIn = defineBuiltIn$3;
  var hasOwn = hasOwnProperty_1;
  var inheritIfRequired = inheritIfRequired$1;
  var isPrototypeOf = objectIsPrototypeOf;
  var isSymbol = isSymbol$3;
  var toPrimitive = toPrimitive$2;
  var fails = fails$e;
  var getOwnPropertyNames = objectGetOwnPropertyNames.f;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  var defineProperty = objectDefineProperty.f;
  var thisNumberValue = thisNumberValue$1;
  var trim = stringTrim.trim;
  var NUMBER = 'Number';
  var NativeNumber = global$1[NUMBER];
  var NumberPrototype = NativeNumber.prototype;
  var TypeError$1 = global$1.TypeError;
  var arraySlice = uncurryThis(''.slice);
  var charCodeAt = uncurryThis(''.charCodeAt); // `ToNumeric` abstract operation
  // https://tc39.es/ecma262/#sec-tonumeric

  var toNumeric = function (value) {
    var primValue = toPrimitive(value, 'number');
    return typeof primValue == 'bigint' ? primValue : toNumber(primValue);
  }; // `ToNumber` abstract operation
  // https://tc39.es/ecma262/#sec-tonumber


  var toNumber = function (argument) {
    var it = toPrimitive(argument, 'number');
    var first, third, radix, maxCode, digits, length, index, code;
    if (isSymbol(it)) throw TypeError$1('Cannot convert a Symbol value to a number');

    if (typeof it == 'string' && it.length > 2) {
      it = trim(it);
      first = charCodeAt(it, 0);

      if (first === 43 || first === 45) {
        third = charCodeAt(it, 2);
        if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
      } else if (first === 48) {
        switch (charCodeAt(it, 1)) {
          case 66:
          case 98:
            radix = 2;
            maxCode = 49;
            break;
          // fast equal of /^0b[01]+$/i

          case 79:
          case 111:
            radix = 8;
            maxCode = 55;
            break;
          // fast equal of /^0o[0-7]+$/i

          default:
            return +it;
        }

        digits = arraySlice(it, 2);
        length = digits.length;

        for (index = 0; index < length; index++) {
          code = charCodeAt(digits, index); // parseInt parses a string to a first unavailable symbol
          // but ToNumber should return NaN if a string contains unavailable symbols

          if (code < 48 || code > maxCode) return NaN;
        }

        return parseInt(digits, radix);
      }
    }

    return +it;
  }; // `Number` constructor
  // https://tc39.es/ecma262/#sec-number-constructor


  if (isForced(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
    var NumberWrapper = function Number(value) {
      var n = arguments.length < 1 ? 0 : NativeNumber(toNumeric(value));
      var dummy = this; // check on 1..constructor(foo) case

      return isPrototypeOf(NumberPrototype, dummy) && fails(function () {
        thisNumberValue(dummy);
      }) ? inheritIfRequired(Object(n), dummy, NumberWrapper) : n;
    };

    for (var keys = DESCRIPTORS ? getOwnPropertyNames(NativeNumber) : ( // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' + // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,' + // ESNext
    'fromString,range').split(','), j = 0, key; keys.length > j; j++) {
      if (hasOwn(NativeNumber, key = keys[j]) && !hasOwn(NumberWrapper, key)) {
        defineProperty(NumberWrapper, key, getOwnPropertyDescriptor(NativeNumber, key));
      }
    }

    NumberWrapper.prototype = NumberPrototype;
    NumberPrototype.constructor = NumberWrapper;
    defineBuiltIn(global$1, NUMBER, NumberWrapper, {
      constructor: true
    });
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
   * Provides statistics on all clusters in the current render cycle for use in {@link Renderer.render}.
   */
  var ClusterStats = /*#__PURE__*/_createClass(function ClusterStats(markers, clusters) {
    _classCallCheck(this, ClusterStats);

    this.markers = {
      sum: markers.length
    };
    var clusterMarkerCounts = clusters.map(function (a) {
      return a.count;
    });
    var clusterMarkerSum = clusterMarkerCounts.reduce(function (a, b) {
      return a + b;
    }, 0);
    this.clusters = {
      count: clusters.length,
      markers: {
        mean: clusterMarkerSum / clusters.length,
        sum: clusterMarkerSum,
        min: Math.min.apply(Math, _toConsumableArray(clusterMarkerCounts)),
        max: Math.max.apply(Math, _toConsumableArray(clusterMarkerCounts))
      }
    };
  });
  var DefaultRenderer = /*#__PURE__*/function () {
    function DefaultRenderer() {
      _classCallCheck(this, DefaultRenderer);
    }

    _createClass(DefaultRenderer, [{
      key: "render",
      value:
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
      function render(_ref, stats) {
        var count = _ref.count,
            position = _ref.position;
        // change color if this cluster has more markers than the mean cluster
        var color = count > Math.max(10, stats.clusters.markers.mean) ? "#ff0000" : "#0000ff"; // create svg url with fill color

        var svg = window.btoa("\n  <svg fill=\"".concat(color, "\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 240 240\">\n    <circle cx=\"120\" cy=\"120\" opacity=\".6\" r=\"70\" />\n    <circle cx=\"120\" cy=\"120\" opacity=\".3\" r=\"90\" />\n    <circle cx=\"120\" cy=\"120\" opacity=\".2\" r=\"110\" />\n  </svg>")); // create marker using svg icon

        return new google.maps.Marker({
          position: position,
          icon: {
            url: "data:image/svg+xml;base64,".concat(svg),
            scaledSize: new google.maps.Size(45, 45)
          },
          label: {
            text: String(count),
            color: "rgba(255,255,255,0.9)",
            fontSize: "12px"
          },
          title: "Cluster of ".concat(count, " markers"),
          // adjust zIndex to be above other markers
          zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count
        });
      }
    }]);

    return DefaultRenderer;
  }();

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
    for (var property in type2.prototype) {
      type1.prototype[property] = type2.prototype[property];
    }
  }
  /**
   * @ignore
   */


  var OverlayViewSafe = /*#__PURE__*/_createClass(function OverlayViewSafe() {
    _classCallCheck(this, OverlayViewSafe);

    // MarkerClusterer implements google.maps.OverlayView interface. We use the
    // extend function to extend MarkerClusterer with google.maps.OverlayView
    // because it might not always be available when the code is defined so we
    // look for it at the last possible moment. If it doesn't exist now then
    // there is no point going ahead :)
    extend(OverlayViewSafe, google.maps.OverlayView);
  });

  exports.MarkerClustererEvents = void 0;

  (function (MarkerClustererEvents) {
    MarkerClustererEvents["CLUSTERING_BEGIN"] = "clusteringbegin";
    MarkerClustererEvents["CLUSTERING_END"] = "clusteringend";
    MarkerClustererEvents["CLUSTER_CLICK"] = "click";
  })(exports.MarkerClustererEvents || (exports.MarkerClustererEvents = {}));

  var defaultOnClusterClickHandler = function defaultOnClusterClickHandler(_, cluster, map) {
    map.fitBounds(cluster.bounds);
  };
  /**
   * MarkerClusterer creates and manages per-zoom-level clusters for large amounts
   * of markers. See {@link MarkerClustererOptions} for more details.
   *
   */

  var MarkerClusterer = /*#__PURE__*/function (_OverlayViewSafe) {
    _inherits(MarkerClusterer, _OverlayViewSafe);

    var _super = _createSuper(MarkerClusterer);

    function MarkerClusterer(_ref) {
      var _this;

      var map = _ref.map,
          _ref$markers = _ref.markers,
          markers = _ref$markers === void 0 ? [] : _ref$markers,
          _ref$algorithm = _ref.algorithm,
          algorithm = _ref$algorithm === void 0 ? new SuperClusterAlgorithm({}) : _ref$algorithm,
          _ref$renderer = _ref.renderer,
          renderer = _ref$renderer === void 0 ? new DefaultRenderer() : _ref$renderer,
          _ref$onClusterClick = _ref.onClusterClick,
          onClusterClick = _ref$onClusterClick === void 0 ? defaultOnClusterClickHandler : _ref$onClusterClick;

      _classCallCheck(this, MarkerClusterer);

      _this = _super.call(this);
      _this.markers = _toConsumableArray(markers);
      _this.clusters = [];
      _this.algorithm = algorithm;
      _this.renderer = renderer;
      _this.onClusterClick = onClusterClick;

      if (map) {
        _this.setMap(map);
      }

      return _this;
    }

    _createClass(MarkerClusterer, [{
      key: "addMarker",
      value: function addMarker(marker, noDraw) {
        if (this.markers.includes(marker)) {
          return;
        }

        this.markers.push(marker);

        if (!noDraw) {
          this.render();
        }
      }
    }, {
      key: "addMarkers",
      value: function addMarkers(markers, noDraw) {
        var _this2 = this;

        markers.forEach(function (marker) {
          _this2.addMarker(marker, true);
        });

        if (!noDraw) {
          this.render();
        }
      }
    }, {
      key: "removeMarker",
      value: function removeMarker(marker, noDraw) {
        var index = this.markers.indexOf(marker);

        if (index === -1) {
          // Marker is not in our list of markers, so do nothing:
          return false;
        }

        marker.setMap(null);
        this.markers.splice(index, 1); // Remove the marker from the list of managed markers

        if (!noDraw) {
          this.render();
        }

        return true;
      }
    }, {
      key: "removeMarkers",
      value: function removeMarkers(markers, noDraw) {
        var _this3 = this;

        var removed = false;
        markers.forEach(function (marker) {
          removed = _this3.removeMarker(marker, true) || removed;
        });

        if (removed && !noDraw) {
          this.render();
        }

        return removed;
      }
    }, {
      key: "clearMarkers",
      value: function clearMarkers(noDraw) {
        this.markers.length = 0;

        if (!noDraw) {
          this.render();
        }
      }
      /**
       * Recalculates and draws all the marker clusters.
       */

    }, {
      key: "render",
      value: function render() {
        var map = this.getMap();

        if (map instanceof google.maps.Map && this.getProjection()) {
          google.maps.event.trigger(this, exports.MarkerClustererEvents.CLUSTERING_BEGIN, this);

          var _this$algorithm$calcu = this.algorithm.calculate({
            markers: this.markers,
            map: map,
            mapCanvasProjection: this.getProjection()
          }),
              clusters = _this$algorithm$calcu.clusters,
              changed = _this$algorithm$calcu.changed; // allow algorithms to return flag on whether the clusters/markers have changed


          if (changed || changed == undefined) {
            // reset visibility of markers and clusters
            this.reset(); // store new clusters

            this.clusters = clusters;
            this.renderClusters();
          }

          google.maps.event.trigger(this, exports.MarkerClustererEvents.CLUSTERING_END, this);
        }
      }
    }, {
      key: "onAdd",
      value: function onAdd() {
        this.idleListener = this.getMap().addListener("idle", this.render.bind(this));
        this.render();
      }
    }, {
      key: "onRemove",
      value: function onRemove() {
        google.maps.event.removeListener(this.idleListener);
        this.reset();
      }
    }, {
      key: "reset",
      value: function reset() {
        this.markers.forEach(function (marker) {
          return marker.setMap(null);
        });
        this.clusters.forEach(function (cluster) {
          return cluster.delete();
        });
        this.clusters = [];
      }
    }, {
      key: "renderClusters",
      value: function renderClusters() {
        var _this4 = this;

        // generate stats to pass to renderers
        var stats = new ClusterStats(this.markers, this.clusters);
        var map = this.getMap();
        this.clusters.forEach(function (cluster) {
          if (cluster.markers.length === 1) {
            cluster.marker = cluster.markers[0];
          } else {
            cluster.marker = _this4.renderer.render(cluster, stats);

            if (_this4.onClusterClick) {
              cluster.marker.addListener("click",
              /* istanbul ignore next */
              function (event) {
                google.maps.event.trigger(_this4, exports.MarkerClustererEvents.CLUSTER_CLICK, cluster);

                _this4.onClusterClick(event, cluster, map);
              });
            }
          }

          cluster.marker.setMap(map);
        });
      }
    }]);

    return MarkerClusterer;
  }(OverlayViewSafe);

  exports.AbstractAlgorithm = AbstractAlgorithm;
  exports.AbstractViewportAlgorithm = AbstractViewportAlgorithm;
  exports.Cluster = Cluster;
  exports.ClusterStats = ClusterStats;
  exports.DefaultRenderer = DefaultRenderer;
  exports.GridAlgorithm = GridAlgorithm;
  exports.MarkerClusterer = MarkerClusterer;
  exports.NoopAlgorithm = NoopAlgorithm;
  exports.SuperClusterAlgorithm = SuperClusterAlgorithm;
  exports.defaultOnClusterClickHandler = defaultOnClusterClickHandler;
  exports.distanceBetweenPoints = distanceBetweenPoints;
  exports.extendBoundsToPaddedViewport = extendBoundsToPaddedViewport;
  exports.extendPixelBounds = extendPixelBounds;
  exports.filterMarkersToPaddedViewport = filterMarkersToPaddedViewport;
  exports.noop = _noop;
  exports.pixelBoundsToLatLngBounds = pixelBoundsToLatLngBounds;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
