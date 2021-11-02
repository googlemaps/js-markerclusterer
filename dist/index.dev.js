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

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var check = function (it) {
    return it && it.Math == Math && it;
  }; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


  var global_1 = // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || // eslint-disable-next-line no-new-func -- fallback
  function () {
    return this;
  }() || Function('return this')();

  var fails = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  var descriptors = !fails(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty({}, 1, {
      get: function () {
        return 7;
      }
    })[1] != 7;
  });

  var call$1 = Function.prototype.call;
  var functionCall = call$1.bind ? call$1.bind(call$1) : function () {
    return call$1.apply(call$1, arguments);
  };

  var $propertyIsEnumerable = {}.propertyIsEnumerable; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

  var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

  var NASHORN_BUG = getOwnPropertyDescriptor$2 && !$propertyIsEnumerable.call({
    1: 2
  }, 1); // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable

  var f$4 = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor$2(this, V);
    return !!descriptor && descriptor.enumerable;
  } : $propertyIsEnumerable;
  var objectPropertyIsEnumerable = {
    f: f$4
  };

  var createPropertyDescriptor = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var FunctionPrototype$1 = Function.prototype;
  var bind$1 = FunctionPrototype$1.bind;
  var call = FunctionPrototype$1.call;
  var callBind = bind$1 && bind$1.bind(call);
  var functionUncurryThis = bind$1 ? function (fn) {
    return fn && callBind(call, fn);
  } : function (fn) {
    return fn && function () {
      return call.apply(fn, arguments);
    };
  };

  var toString$1 = functionUncurryThis({}.toString);
  var stringSlice = functionUncurryThis(''.slice);

  var classofRaw = function (it) {
    return stringSlice(toString$1(it), 8, -1);
  };

  var Object$4 = global_1.Object;
  var split = functionUncurryThis(''.split); // fallback for non-array-like ES3 and non-enumerable old V8 strings

  var indexedObject = fails(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins -- safe
    return !Object$4('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classofRaw(it) == 'String' ? split(it, '') : Object$4(it);
  } : Object$4;

  var TypeError$b = global_1.TypeError; // `RequireObjectCoercible` abstract operation
  // https://tc39.es/ecma262/#sec-requireobjectcoercible

  var requireObjectCoercible = function (it) {
    if (it == undefined) throw TypeError$b("Can't call method on " + it);
    return it;
  };

  var toIndexedObject = function (it) {
    return indexedObject(requireObjectCoercible(it));
  };

  // `IsCallable` abstract operation
  // https://tc39.es/ecma262/#sec-iscallable
  var isCallable = function (argument) {
    return typeof argument == 'function';
  };

  var isObject = function (it) {
    return typeof it == 'object' ? it !== null : isCallable(it);
  };

  var aFunction = function (argument) {
    return isCallable(argument) ? argument : undefined;
  };

  var getBuiltIn = function (namespace, method) {
    return arguments.length < 2 ? aFunction(global_1[namespace]) : global_1[namespace] && global_1[namespace][method];
  };

  var objectIsPrototypeOf = functionUncurryThis({}.isPrototypeOf);

  var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

  var process = global_1.process;
  var Deno = global_1.Deno;
  var versions = process && process.versions || Deno && Deno.version;
  var v8 = versions && versions.v8;
  var match, version;

  if (v8) {
    match = v8.split('.'); // in old Chrome, versions of V8 isn't V8 = Chrome / 10
    // but their correct versions are not interesting for us

    version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
  } // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
  // so check `userAgent` even if `.v8` exists, but 0


  if (!version && engineUserAgent) {
    match = engineUserAgent.match(/Edge\/(\d+)/);

    if (!match || match[1] >= 74) {
      match = engineUserAgent.match(/Chrome\/(\d+)/);
      if (match) version = +match[1];
    }
  }

  var engineV8Version = version;

  /* eslint-disable es/no-symbol -- required for testing */
  // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing

  var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
    var symbol = Symbol(); // Chrome 38 Symbol has incorrect toString conversion
    // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances

    return !String(symbol) || !(Object(symbol) instanceof Symbol) || // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && engineV8Version && engineV8Version < 41;
  });

  /* eslint-disable es/no-symbol -- required for testing */

  var useSymbolAsUid = nativeSymbol && !Symbol.sham && typeof Symbol.iterator == 'symbol';

  var Object$3 = global_1.Object;
  var isSymbol = useSymbolAsUid ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    var $Symbol = getBuiltIn('Symbol');
    return isCallable($Symbol) && objectIsPrototypeOf($Symbol.prototype, Object$3(it));
  };

  var String$4 = global_1.String;

  var tryToString = function (argument) {
    try {
      return String$4(argument);
    } catch (error) {
      return 'Object';
    }
  };

  var TypeError$a = global_1.TypeError; // `Assert: IsCallable(argument) is true`

  var aCallable = function (argument) {
    if (isCallable(argument)) return argument;
    throw TypeError$a(tryToString(argument) + ' is not a function');
  };

  // https://tc39.es/ecma262/#sec-getmethod

  var getMethod = function (V, P) {
    var func = V[P];
    return func == null ? undefined : aCallable(func);
  };

  var TypeError$9 = global_1.TypeError; // `OrdinaryToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-ordinarytoprimitive

  var ordinaryToPrimitive = function (input, pref) {
    var fn, val;
    if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) return val;
    if (isCallable(fn = input.valueOf) && !isObject(val = functionCall(fn, input))) return val;
    if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) return val;
    throw TypeError$9("Can't convert object to primitive value");
  };

  var defineProperty$2 = Object.defineProperty;

  var setGlobal = function (key, value) {
    try {
      defineProperty$2(global_1, key, {
        value: value,
        configurable: true,
        writable: true
      });
    } catch (error) {
      global_1[key] = value;
    }

    return value;
  };

  var SHARED = '__core-js_shared__';
  var store$1 = global_1[SHARED] || setGlobal(SHARED, {});
  var sharedStore = store$1;

  var shared = createCommonjsModule(function (module) {
    (module.exports = function (key, value) {
      return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
    })('versions', []).push({
      version: '3.19.1',
      mode: 'global',
      copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
    });
  });

  var Object$2 = global_1.Object; // `ToObject` abstract operation
  // https://tc39.es/ecma262/#sec-toobject

  var toObject = function (argument) {
    return Object$2(requireObjectCoercible(argument));
  };

  var hasOwnProperty = functionUncurryThis({}.hasOwnProperty); // `HasOwnProperty` abstract operation
  // https://tc39.es/ecma262/#sec-hasownproperty

  var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
    return hasOwnProperty(toObject(it), key);
  };

  var id = 0;
  var postfix = Math.random();
  var toString = functionUncurryThis(1.0.toString);

  var uid = function (key) {
    return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
  };

  var WellKnownSymbolsStore = shared('wks');
  var Symbol$1 = global_1.Symbol;
  var symbolFor = Symbol$1 && Symbol$1['for'];
  var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

  var wellKnownSymbol = function (name) {
    if (!hasOwnProperty_1(WellKnownSymbolsStore, name) || !(nativeSymbol || typeof WellKnownSymbolsStore[name] == 'string')) {
      var description = 'Symbol.' + name;

      if (nativeSymbol && hasOwnProperty_1(Symbol$1, name)) {
        WellKnownSymbolsStore[name] = Symbol$1[name];
      } else if (useSymbolAsUid && symbolFor) {
        WellKnownSymbolsStore[name] = symbolFor(description);
      } else {
        WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
      }
    }

    return WellKnownSymbolsStore[name];
  };

  var TypeError$8 = global_1.TypeError;
  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive'); // `ToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-toprimitive

  var toPrimitive = function (input, pref) {
    if (!isObject(input) || isSymbol(input)) return input;
    var exoticToPrim = getMethod(input, TO_PRIMITIVE);
    var result;

    if (exoticToPrim) {
      if (pref === undefined) pref = 'default';
      result = functionCall(exoticToPrim, input, pref);
      if (!isObject(result) || isSymbol(result)) return result;
      throw TypeError$8("Can't convert object to primitive value");
    }

    if (pref === undefined) pref = 'number';
    return ordinaryToPrimitive(input, pref);
  };

  // https://tc39.es/ecma262/#sec-topropertykey

  var toPropertyKey = function (argument) {
    var key = toPrimitive(argument, 'string');
    return isSymbol(key) ? key : key + '';
  };

  var document$1 = global_1.document; // typeof document.createElement is 'object' in old IE

  var EXISTS$1 = isObject(document$1) && isObject(document$1.createElement);

  var documentCreateElement = function (it) {
    return EXISTS$1 ? document$1.createElement(it) : {};
  };

  var ie8DomDefine = !descriptors && !fails(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
    return Object.defineProperty(documentCreateElement('div'), 'a', {
      get: function () {
        return 7;
      }
    }).a != 7;
  });

  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor

  var f$3 = descriptors ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject(O);
    P = toPropertyKey(P);
    if (ie8DomDefine) try {
      return $getOwnPropertyDescriptor(O, P);
    } catch (error) {
      /* empty */
    }
    if (hasOwnProperty_1(O, P)) return createPropertyDescriptor(!functionCall(objectPropertyIsEnumerable.f, O, P), O[P]);
  };
  var objectGetOwnPropertyDescriptor = {
    f: f$3
  };

  var String$3 = global_1.String;
  var TypeError$7 = global_1.TypeError; // `Assert: Type(argument) is Object`

  var anObject = function (argument) {
    if (isObject(argument)) return argument;
    throw TypeError$7(String$3(argument) + ' is not an object');
  };

  var TypeError$6 = global_1.TypeError; // eslint-disable-next-line es/no-object-defineproperty -- safe

  var $defineProperty = Object.defineProperty; // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty

  var f$2 = descriptors ? $defineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPropertyKey(P);
    anObject(Attributes);
    if (ie8DomDefine) try {
      return $defineProperty(O, P, Attributes);
    } catch (error) {
      /* empty */
    }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError$6('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };
  var objectDefineProperty = {
    f: f$2
  };

  var createNonEnumerableProperty = descriptors ? function (object, key, value) {
    return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var functionToString = functionUncurryThis(Function.toString); // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper

  if (!isCallable(sharedStore.inspectSource)) {
    sharedStore.inspectSource = function (it) {
      return functionToString(it);
    };
  }

  var inspectSource = sharedStore.inspectSource;

  var WeakMap$1 = global_1.WeakMap;
  var nativeWeakMap = isCallable(WeakMap$1) && /native code/.test(inspectSource(WeakMap$1));

  var keys$1 = shared('keys');

  var sharedKey = function (key) {
    return keys$1[key] || (keys$1[key] = uid(key));
  };

  var hiddenKeys$1 = {};

  var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
  var TypeError$5 = global_1.TypeError;
  var WeakMap = global_1.WeakMap;
  var set, get, has;

  var enforce = function (it) {
    return has(it) ? get(it) : set(it, {});
  };

  var getterFor = function (TYPE) {
    return function (it) {
      var state;

      if (!isObject(it) || (state = get(it)).type !== TYPE) {
        throw TypeError$5('Incompatible receiver, ' + TYPE + ' required');
      }

      return state;
    };
  };

  if (nativeWeakMap || sharedStore.state) {
    var store = sharedStore.state || (sharedStore.state = new WeakMap());
    var wmget = functionUncurryThis(store.get);
    var wmhas = functionUncurryThis(store.has);
    var wmset = functionUncurryThis(store.set);

    set = function (it, metadata) {
      if (wmhas(store, it)) throw new TypeError$5(OBJECT_ALREADY_INITIALIZED);
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
    var STATE = sharedKey('state');
    hiddenKeys$1[STATE] = true;

    set = function (it, metadata) {
      if (hasOwnProperty_1(it, STATE)) throw new TypeError$5(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      createNonEnumerableProperty(it, STATE, metadata);
      return metadata;
    };

    get = function (it) {
      return hasOwnProperty_1(it, STATE) ? it[STATE] : {};
    };

    has = function (it) {
      return hasOwnProperty_1(it, STATE);
    };
  }

  var internalState = {
    set: set,
    get: get,
    has: has,
    enforce: enforce,
    getterFor: getterFor
  };

  var FunctionPrototype = Function.prototype; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

  var getDescriptor = descriptors && Object.getOwnPropertyDescriptor;
  var EXISTS = hasOwnProperty_1(FunctionPrototype, 'name'); // additional protection from minified / mangled / dropped function names

  var PROPER = EXISTS && function something() {
    /* empty */
  }.name === 'something';

  var CONFIGURABLE = EXISTS && (!descriptors || descriptors && getDescriptor(FunctionPrototype, 'name').configurable);
  var functionName = {
    EXISTS: EXISTS,
    PROPER: PROPER,
    CONFIGURABLE: CONFIGURABLE
  };

  var redefine = createCommonjsModule(function (module) {
    var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
    var getInternalState = internalState.get;
    var enforceInternalState = internalState.enforce;
    var TEMPLATE = String(String).split('String');
    (module.exports = function (O, key, value, options) {
      var unsafe = options ? !!options.unsafe : false;
      var simple = options ? !!options.enumerable : false;
      var noTargetGet = options ? !!options.noTargetGet : false;
      var name = options && options.name !== undefined ? options.name : key;
      var state;

      if (isCallable(value)) {
        if (String(name).slice(0, 7) === 'Symbol(') {
          name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
        }

        if (!hasOwnProperty_1(value, 'name') || CONFIGURABLE_FUNCTION_NAME && value.name !== name) {
          createNonEnumerableProperty(value, 'name', name);
        }

        state = enforceInternalState(value);

        if (!state.source) {
          state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
        }
      }

      if (O === global_1) {
        if (simple) O[key] = value;else setGlobal(key, value);
        return;
      } else if (!unsafe) {
        delete O[key];
      } else if (!noTargetGet && O[key]) {
        simple = true;
      }

      if (simple) O[key] = value;else createNonEnumerableProperty(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
    })(Function.prototype, 'toString', function toString() {
      return isCallable(this) && getInternalState(this).source || inspectSource(this);
    });
  });

  var ceil = Math.ceil;
  var floor = Math.floor; // `ToIntegerOrInfinity` abstract operation
  // https://tc39.es/ecma262/#sec-tointegerorinfinity

  var toIntegerOrInfinity = function (argument) {
    var number = +argument; // eslint-disable-next-line no-self-compare -- safe

    return number !== number || number === 0 ? 0 : (number > 0 ? floor : ceil)(number);
  };

  var max$1 = Math.max;
  var min$2 = Math.min; // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

  var toAbsoluteIndex = function (index, length) {
    var integer = toIntegerOrInfinity(index);
    return integer < 0 ? max$1(integer + length, 0) : min$2(integer, length);
  };

  var min$1 = Math.min; // `ToLength` abstract operation
  // https://tc39.es/ecma262/#sec-tolength

  var toLength = function (argument) {
    return argument > 0 ? min$1(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  // https://tc39.es/ecma262/#sec-lengthofarraylike

  var lengthOfArrayLike = function (obj) {
    return toLength(obj.length);
  };

  var createMethod$2 = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject($this);
      var length = lengthOfArrayLike(O);
      var index = toAbsoluteIndex(fromIndex, length);
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
    includes: createMethod$2(true),
    // `Array.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod$2(false)
  };

  var indexOf = arrayIncludes.indexOf;
  var push$1 = functionUncurryThis([].push);

  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject(object);
    var i = 0;
    var result = [];
    var key;

    for (key in O) !hasOwnProperty_1(hiddenKeys$1, key) && hasOwnProperty_1(O, key) && push$1(result, key); // Don't enum bug & hidden keys


    while (names.length > i) if (hasOwnProperty_1(O, key = names[i++])) {
      ~indexOf(result, key) || push$1(result, key);
    }

    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

  var hiddenKeys = enumBugKeys.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  // eslint-disable-next-line es/no-object-getownpropertynames -- safe

  var f$1 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return objectKeysInternal(O, hiddenKeys);
  };

  var objectGetOwnPropertyNames = {
    f: f$1
  };

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
  var f = Object.getOwnPropertySymbols;
  var objectGetOwnPropertySymbols = {
    f: f
  };

  var concat$1 = functionUncurryThis([].concat); // all object keys, includes non-enumerable and symbols

  var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = objectGetOwnPropertyNames.f(anObject(it));
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    return getOwnPropertySymbols ? concat$1(keys, getOwnPropertySymbols(it)) : keys;
  };

  var copyConstructorProperties = function (target, source) {
    var keys = ownKeys(source);
    var defineProperty = objectDefineProperty.f;
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!hasOwnProperty_1(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  };

  var replacement = /#|\.prototype\./;

  var isForced = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true : value == NATIVE ? false : isCallable(detection) ? fails(detection) : !!detection;
  };

  var normalize = isForced.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };

  var data = isForced.data = {};
  var NATIVE = isForced.NATIVE = 'N';
  var POLYFILL = isForced.POLYFILL = 'P';
  var isForced_1 = isForced;

  var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
  /*
    options.target      - name of the target object
    options.global      - target is the global object
    options.stat        - export as static methods of target
    options.proto       - export as prototype methods of target
    options.real        - real prototype method for the `pure` version
    options.forced      - export even if the native feature is available
    options.bind        - bind methods to the target, required for the `pure` version
    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
    options.sham        - add a flag to not completely full polyfills
    options.enumerable  - export as enumerable property
    options.noTargetGet - prevent calling a getter on target
    options.name        - the .name of the function if it does not match the key
  */

  var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;

    if (GLOBAL) {
      target = global_1;
    } else if (STATIC) {
      target = global_1[TARGET] || setGlobal(TARGET, {});
    } else {
      target = (global_1[TARGET] || {}).prototype;
    }

    if (target) for (key in source) {
      sourceProperty = source[key];

      if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor$1(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];

      FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

      if (!FORCED && targetProperty !== undefined) {
        if (typeof sourceProperty == typeof targetProperty) continue;
        copyConstructorProperties(sourceProperty, targetProperty);
      } // add a flag to not completely full polyfills


      if (options.sham || targetProperty && targetProperty.sham) {
        createNonEnumerableProperty(sourceProperty, 'sham', true);
      } // extend global


      redefine(target, key, sourceProperty, options);
    }
  };

  var bind = functionUncurryThis(functionUncurryThis.bind); // optional / simple context binding

  var functionBindContext = function (fn, that) {
    aCallable(fn);
    return that === undefined ? fn : bind ? bind(fn, that) : function ()
    /* ...args */
    {
      return fn.apply(that, arguments);
    };
  };

  // https://tc39.es/ecma262/#sec-isarray
  // eslint-disable-next-line es/no-array-isarray -- safe

  var isArray = Array.isArray || function isArray(argument) {
    return classofRaw(argument) == 'Array';
  };

  var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
  var test = {};
  test[TO_STRING_TAG$1] = 'z';
  var toStringTagSupport = String(test) === '[object z]';

  var TO_STRING_TAG = wellKnownSymbol('toStringTag');
  var Object$1 = global_1.Object; // ES3 wrong here

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


  var classof = toStringTagSupport ? classofRaw : function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
    : typeof (tag = tryGet(O = Object$1(it), TO_STRING_TAG)) == 'string' ? tag // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O) // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
  };

  var noop = function () {
    /* empty */
  };

  var empty = [];
  var construct = getBuiltIn('Reflect', 'construct');
  var constructorRegExp = /^\s*(?:class|function)\b/;
  var exec = functionUncurryThis(constructorRegExp.exec);
  var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

  var isConstructorModern = function (argument) {
    if (!isCallable(argument)) return false;

    try {
      construct(noop, empty, argument);
      return true;
    } catch (error) {
      return false;
    }
  };

  var isConstructorLegacy = function (argument) {
    if (!isCallable(argument)) return false;

    switch (classof(argument)) {
      case 'AsyncFunction':
      case 'GeneratorFunction':
      case 'AsyncGeneratorFunction':
        return false;
      // we can't check .prototype since constructors produced by .bind haven't it
    }

    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  }; // `IsConstructor` abstract operation
  // https://tc39.es/ecma262/#sec-isconstructor


  var isConstructor = !construct || fails(function () {
    var called;
    return isConstructorModern(isConstructorModern.call) || !isConstructorModern(Object) || !isConstructorModern(function () {
      called = true;
    }) || called;
  }) ? isConstructorLegacy : isConstructorModern;

  var SPECIES$1 = wellKnownSymbol('species');
  var Array$1 = global_1.Array; // a part of `ArraySpeciesCreate` abstract operation
  // https://tc39.es/ecma262/#sec-arrayspeciescreate

  var arraySpeciesConstructor = function (originalArray) {
    var C;

    if (isArray(originalArray)) {
      C = originalArray.constructor; // cross-realm fallback

      if (isConstructor(C) && (C === Array$1 || isArray(C.prototype))) C = undefined;else if (isObject(C)) {
        C = C[SPECIES$1];
        if (C === null) C = undefined;
      }
    }

    return C === undefined ? Array$1 : C;
  };

  // https://tc39.es/ecma262/#sec-arrayspeciescreate

  var arraySpeciesCreate = function (originalArray, length) {
    return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
  };

  var push = functionUncurryThis([].push); // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation

  var createMethod$1 = function (TYPE) {
    var IS_MAP = TYPE == 1;
    var IS_FILTER = TYPE == 2;
    var IS_SOME = TYPE == 3;
    var IS_EVERY = TYPE == 4;
    var IS_FIND_INDEX = TYPE == 6;
    var IS_FILTER_REJECT = TYPE == 7;
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    return function ($this, callbackfn, that, specificCreate) {
      var O = toObject($this);
      var self = indexedObject(O);
      var boundFunction = functionBindContext(callbackfn, that);
      var length = lengthOfArrayLike(self);
      var index = 0;
      var create = specificCreate || arraySpeciesCreate;
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
    forEach: createMethod$1(0),
    // `Array.prototype.map` method
    // https://tc39.es/ecma262/#sec-array.prototype.map
    map: createMethod$1(1),
    // `Array.prototype.filter` method
    // https://tc39.es/ecma262/#sec-array.prototype.filter
    filter: createMethod$1(2),
    // `Array.prototype.some` method
    // https://tc39.es/ecma262/#sec-array.prototype.some
    some: createMethod$1(3),
    // `Array.prototype.every` method
    // https://tc39.es/ecma262/#sec-array.prototype.every
    every: createMethod$1(4),
    // `Array.prototype.find` method
    // https://tc39.es/ecma262/#sec-array.prototype.find
    find: createMethod$1(5),
    // `Array.prototype.findIndex` method
    // https://tc39.es/ecma262/#sec-array.prototype.findIndex
    findIndex: createMethod$1(6),
    // `Array.prototype.filterReject` method
    // https://github.com/tc39/proposal-array-filtering
    filterReject: createMethod$1(7)
  };

  var SPECIES = wellKnownSymbol('species');

  var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/677
    return engineV8Version >= 51 || !fails(function () {
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

  var $map = arrayIteration.map;
  var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('map'); // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  // with adding support of @@species

  _export({
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
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
              if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                  t[p[i]] = s[p[i]];
          }
      return t;
  }

  // https://tc39.es/ecma262/#sec-object.prototype.tostring


  var objectToString = toStringTagSupport ? {}.toString : function toString() {
    return '[object ' + classof(this) + ']';
  };

  // https://tc39.es/ecma262/#sec-object.prototype.tostring

  if (!toStringTagSupport) {
    redefine(Object.prototype, 'toString', objectToString, {
      unsafe: true
    });
  }

  var $filter = arrayIteration.filter;
  var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('filter'); // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  // with adding support of @@species

  _export({
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

  // iterable DOM collections
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

  var classList = documentCreateElement('span').classList;
  var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;
  var domTokenListPrototype = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;

  var arrayMethodIsStrict = function (METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return !!method && fails(function () {
      // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
      method.call(null, argument || function () {
        throw 1;
      }, 1);
    });
  };

  var $forEach = arrayIteration.forEach;
  var STRICT_METHOD = arrayMethodIsStrict('forEach'); // `Array.prototype.forEach` method implementation
  // https://tc39.es/ecma262/#sec-array.prototype.foreach

  var arrayForEach = !STRICT_METHOD ? function forEach(callbackfn
  /* , thisArg */
  ) {
    return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined); // eslint-disable-next-line es/no-array-prototype-foreach -- safe
  } : [].forEach;

  var handlePrototype = function (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
      createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
    } catch (error) {
      CollectionPrototype.forEach = arrayForEach;
    }
  };

  for (var COLLECTION_NAME in domIterables) {
    if (domIterables[COLLECTION_NAME]) {
      handlePrototype(global_1[COLLECTION_NAME] && global_1[COLLECTION_NAME].prototype);
    }
  }

  handlePrototype(domTokenListPrototype);

  // https://url.spec.whatwg.org/#dom-url-tojson


  _export({
    target: 'URL',
    proto: true,
    enumerable: true
  }, {
    toJSON: function toJSON() {
      return functionCall(URL.prototype.toString, this);
    }
  });

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
      return _this;
    }

    _createClass(GridAlgorithm, [{
      key: "cluster",
      value: function cluster(_ref) {
        var _this2 = this;

        var markers = _ref.markers,
            map = _ref.map,
            mapCanvasProjection = _ref.mapCanvasProjection;
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

  /**
   * @module helpers
   */

  /**
   * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth.
   *
   * @memberof helpers
   * @type {number}
   */
  var earthRadius = 6371008.8;
  /**
   * Unit of measurement factors using a spherical (non-ellipsoid) earth radius.
   *
   * @memberof helpers
   * @type {Object}
   */

  var factors = {
    centimeters: earthRadius * 100,
    centimetres: earthRadius * 100,
    degrees: earthRadius / 111325,
    feet: earthRadius * 3.28084,
    inches: earthRadius * 39.37,
    kilometers: earthRadius / 1000,
    kilometres: earthRadius / 1000,
    meters: earthRadius,
    metres: earthRadius,
    miles: earthRadius / 1609.344,
    millimeters: earthRadius * 1000,
    millimetres: earthRadius * 1000,
    nauticalmiles: earthRadius / 1852,
    radians: 1,
    yards: earthRadius * 1.0936
  };
  /**
   * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
   *
   * @name feature
   * @param {Geometry} geometry input geometry
   * @param {Object} [properties={}] an Object of key-value pairs to add as properties
   * @param {Object} [options={}] Optional Parameters
   * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
   * @param {string|number} [options.id] Identifier associated with the Feature
   * @returns {Feature} a GeoJSON Feature
   * @example
   * var geometry = {
   *   "type": "Point",
   *   "coordinates": [110, 50]
   * };
   *
   * var feature = turf.feature(geometry);
   *
   * //=feature
   */

  function feature(geom, properties, options) {
    if (options === void 0) {
      options = {};
    }

    var feat = {
      type: "Feature"
    };

    if (options.id === 0 || options.id) {
      feat.id = options.id;
    }

    if (options.bbox) {
      feat.bbox = options.bbox;
    }

    feat.properties = properties || {};
    feat.geometry = geom;
    return feat;
  }
  /**
   * Creates a {@link Point} {@link Feature} from a Position.
   *
   * @name point
   * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
   * @param {Object} [properties={}] an Object of key-value pairs to add as properties
   * @param {Object} [options={}] Optional Parameters
   * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
   * @param {string|number} [options.id] Identifier associated with the Feature
   * @returns {Feature<Point>} a Point feature
   * @example
   * var point = turf.point([-75.343, 39.984]);
   *
   * //=point
   */

  function point(coordinates, properties, options) {
    if (options === void 0) {
      options = {};
    }

    if (!coordinates) {
      throw new Error("coordinates is required");
    }

    if (!Array.isArray(coordinates)) {
      throw new Error("coordinates must be an Array");
    }

    if (coordinates.length < 2) {
      throw new Error("coordinates must be at least 2 numbers long");
    }

    if (!isNumber(coordinates[0]) || !isNumber(coordinates[1])) {
      throw new Error("coordinates must contain numbers");
    }

    var geom = {
      type: "Point",
      coordinates: coordinates
    };
    return feature(geom, properties, options);
  }
  /**
   * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
   *
   * @name featureCollection
   * @param {Feature[]} features input features
   * @param {Object} [options={}] Optional Parameters
   * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
   * @param {string|number} [options.id] Identifier associated with the Feature
   * @returns {FeatureCollection} FeatureCollection of Features
   * @example
   * var locationA = turf.point([-75.343, 39.984], {name: 'Location A'});
   * var locationB = turf.point([-75.833, 39.284], {name: 'Location B'});
   * var locationC = turf.point([-75.534, 39.123], {name: 'Location C'});
   *
   * var collection = turf.featureCollection([
   *   locationA,
   *   locationB,
   *   locationC
   * ]);
   *
   * //=collection
   */

  function featureCollection(features, options) {
    if (options === void 0) {
      options = {};
    }

    var fc = {
      type: "FeatureCollection"
    };

    if (options.id) {
      fc.id = options.id;
    }

    if (options.bbox) {
      fc.bbox = options.bbox;
    }

    fc.features = features;
    return fc;
  }
  /**
   * Convert a distance measurement (assuming a spherical Earth) from radians to a more friendly unit.
   * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
   *
   * @name radiansToLength
   * @param {number} radians in radians across the sphere
   * @param {string} [units="kilometers"] can be degrees, radians, miles, inches, yards, metres,
   * meters, kilometres, kilometers.
   * @returns {number} distance
   */

  function radiansToLength(radians, units) {
    if (units === void 0) {
      units = "kilometers";
    }

    var factor = factors[units];

    if (!factor) {
      throw new Error(units + " units is invalid");
    }

    return radians * factor;
  }
  /**
   * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into radians
   * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
   *
   * @name lengthToRadians
   * @param {number} distance in real units
   * @param {string} [units="kilometers"] can be degrees, radians, miles, inches, yards, metres,
   * meters, kilometres, kilometers.
   * @returns {number} radians
   */

  function lengthToRadians(distance, units) {
    if (units === void 0) {
      units = "kilometers";
    }

    var factor = factors[units];

    if (!factor) {
      throw new Error(units + " units is invalid");
    }

    return distance / factor;
  }
  /**
   * Converts an angle in degrees to radians
   *
   * @name degreesToRadians
   * @param {number} degrees angle between 0 and 360 degrees
   * @returns {number} angle in radians
   */

  function degreesToRadians(degrees) {
    var radians = degrees % 360;
    return radians * Math.PI / 180;
  }
  /**
   * Converts a length to the requested unit.
   * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
   *
   * @param {number} length to be converted
   * @param {Units} [originalUnit="kilometers"] of the length
   * @param {Units} [finalUnit="kilometers"] returned unit
   * @returns {number} the converted length
   */

  function convertLength(length, originalUnit, finalUnit) {
    if (originalUnit === void 0) {
      originalUnit = "kilometers";
    }

    if (finalUnit === void 0) {
      finalUnit = "kilometers";
    }

    if (!(length >= 0)) {
      throw new Error("length must be a positive number");
    }

    return radiansToLength(lengthToRadians(length, originalUnit), finalUnit);
  }
  /**
   * isNumber
   *
   * @param {*} num Number to validate
   * @returns {boolean} true/false
   * @example
   * turf.isNumber(123)
   * //=true
   * turf.isNumber('foo')
   * //=false
   */

  function isNumber(num) {
    return !isNaN(num) && num !== null && !Array.isArray(num);
  }

  /**
   * Returns a cloned copy of the passed GeoJSON Object, including possible 'Foreign Members'.
   * ~3-5x faster than the common JSON.parse + JSON.stringify combo method.
   *
   * @name clone
   * @param {GeoJSON} geojson GeoJSON Object
   * @returns {GeoJSON} cloned GeoJSON Object
   * @example
   * var line = turf.lineString([[-74, 40], [-78, 42], [-82, 35]], {color: 'red'});
   *
   * var lineCloned = turf.clone(line);
   */
  function clone(geojson) {
    if (!geojson) {
      throw new Error("geojson is required");
    }

    switch (geojson.type) {
      case "Feature":
        return cloneFeature(geojson);

      case "FeatureCollection":
        return cloneFeatureCollection(geojson);

      case "Point":
      case "LineString":
      case "Polygon":
      case "MultiPoint":
      case "MultiLineString":
      case "MultiPolygon":
      case "GeometryCollection":
        return cloneGeometry(geojson);

      default:
        throw new Error("unknown GeoJSON type");
    }
  }
  /**
   * Clone Feature
   *
   * @private
   * @param {Feature<any>} geojson GeoJSON Feature
   * @returns {Feature<any>} cloned Feature
   */


  function cloneFeature(geojson) {
    var cloned = {
      type: "Feature"
    }; // Preserve Foreign Members

    Object.keys(geojson).forEach(function (key) {
      switch (key) {
        case "type":
        case "properties":
        case "geometry":
          return;

        default:
          cloned[key] = geojson[key];
      }
    }); // Add properties & geometry last

    cloned.properties = cloneProperties(geojson.properties);
    cloned.geometry = cloneGeometry(geojson.geometry);
    return cloned;
  }
  /**
   * Clone Properties
   *
   * @private
   * @param {Object} properties GeoJSON Properties
   * @returns {Object} cloned Properties
   */


  function cloneProperties(properties) {
    var cloned = {};

    if (!properties) {
      return cloned;
    }

    Object.keys(properties).forEach(function (key) {
      var value = properties[key];

      if (typeof value === "object") {
        if (value === null) {
          // handle null
          cloned[key] = null;
        } else if (Array.isArray(value)) {
          // handle Array
          cloned[key] = value.map(function (item) {
            return item;
          });
        } else {
          // handle generic Object
          cloned[key] = cloneProperties(value);
        }
      } else {
        cloned[key] = value;
      }
    });
    return cloned;
  }
  /**
   * Clone Feature Collection
   *
   * @private
   * @param {FeatureCollection<any>} geojson GeoJSON Feature Collection
   * @returns {FeatureCollection<any>} cloned Feature Collection
   */


  function cloneFeatureCollection(geojson) {
    var cloned = {
      type: "FeatureCollection"
    }; // Preserve Foreign Members

    Object.keys(geojson).forEach(function (key) {
      switch (key) {
        case "type":
        case "features":
          return;

        default:
          cloned[key] = geojson[key];
      }
    }); // Add features

    cloned.features = geojson.features.map(function (feature) {
      return cloneFeature(feature);
    });
    return cloned;
  }
  /**
   * Clone Geometry
   *
   * @private
   * @param {Geometry<any>} geometry GeoJSON Geometry
   * @returns {Geometry<any>} cloned Geometry
   */


  function cloneGeometry(geometry) {
    var geom = {
      type: geometry.type
    };

    if (geometry.bbox) {
      geom.bbox = geometry.bbox;
    }

    if (geometry.type === "GeometryCollection") {
      geom.geometries = geometry.geometries.map(function (g) {
        return cloneGeometry(g);
      });
      return geom;
    }

    geom.coordinates = deepSlice(geometry.coordinates);
    return geom;
  }
  /**
   * Deep Slice coordinates
   *
   * @private
   * @param {Coordinates} coords Coordinates
   * @returns {Coordinates} all coordinates sliced
   */


  function deepSlice(coords) {
    var cloned = coords;

    if (typeof cloned[0] !== "object") {
      return cloned.slice();
    }

    return cloned.map(function (coord) {
      return deepSlice(coord);
    });
  }

  /**
   * Callback for coordEach
   *
   * @callback coordEachCallback
   * @param {Array<number>} currentCoord The current coordinate being processed.
   * @param {number} coordIndex The current index of the coordinate being processed.
   * @param {number} featureIndex The current index of the Feature being processed.
   * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
   * @param {number} geometryIndex The current index of the Geometry being processed.
   */

  /**
   * Iterate over coordinates in any GeoJSON object, similar to Array.forEach()
   *
   * @name coordEach
   * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
   * @param {Function} callback a method that takes (currentCoord, coordIndex, featureIndex, multiFeatureIndex)
   * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
   * @returns {void}
   * @example
   * var features = turf.featureCollection([
   *   turf.point([26, 37], {"foo": "bar"}),
   *   turf.point([36, 53], {"hello": "world"})
   * ]);
   *
   * turf.coordEach(features, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
   *   //=currentCoord
   *   //=coordIndex
   *   //=featureIndex
   *   //=multiFeatureIndex
   *   //=geometryIndex
   * });
   */

  function coordEach(geojson, callback, excludeWrapCoord) {
    // Handles null Geometry -- Skips this GeoJSON
    if (geojson === null) return;
    var j,
        k,
        l,
        geometry,
        stopG,
        coords,
        geometryMaybeCollection,
        wrapShrink = 0,
        coordIndex = 0,
        isGeometryCollection,
        type = geojson.type,
        isFeatureCollection = type === "FeatureCollection",
        isFeature = type === "Feature",
        stop = isFeatureCollection ? geojson.features.length : 1; // This logic may look a little weird. The reason why it is that way
    // is because it's trying to be fast. GeoJSON supports multiple kinds
    // of objects at its root: FeatureCollection, Features, Geometries.
    // This function has the responsibility of handling all of them, and that
    // means that some of the `for` loops you see below actually just don't apply
    // to certain inputs. For instance, if you give this just a
    // Point geometry, then both loops are short-circuited and all we do
    // is gradually rename the input until it's called 'geometry'.
    //
    // This also aims to allocate as few resources as possible: just a
    // few numbers and booleans, rather than any temporary arrays as would
    // be required with the normalization approach.

    for (var featureIndex = 0; featureIndex < stop; featureIndex++) {
      geometryMaybeCollection = isFeatureCollection ? geojson.features[featureIndex].geometry : isFeature ? geojson.geometry : geojson;
      isGeometryCollection = geometryMaybeCollection ? geometryMaybeCollection.type === "GeometryCollection" : false;
      stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

      for (var geomIndex = 0; geomIndex < stopG; geomIndex++) {
        var multiFeatureIndex = 0;
        var geometryIndex = 0;
        geometry = isGeometryCollection ? geometryMaybeCollection.geometries[geomIndex] : geometryMaybeCollection; // Handles null Geometry -- Skips this geometry

        if (geometry === null) continue;
        coords = geometry.coordinates;
        var geomType = geometry.type;
        wrapShrink = excludeWrapCoord && (geomType === "Polygon" || geomType === "MultiPolygon") ? 1 : 0;

        switch (geomType) {
          case null:
            break;

          case "Point":
            if (callback(coords, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
            coordIndex++;
            multiFeatureIndex++;
            break;

          case "LineString":
          case "MultiPoint":
            for (j = 0; j < coords.length; j++) {
              if (callback(coords[j], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
              coordIndex++;
              if (geomType === "MultiPoint") multiFeatureIndex++;
            }

            if (geomType === "LineString") multiFeatureIndex++;
            break;

          case "Polygon":
          case "MultiLineString":
            for (j = 0; j < coords.length; j++) {
              for (k = 0; k < coords[j].length - wrapShrink; k++) {
                if (callback(coords[j][k], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
                coordIndex++;
              }

              if (geomType === "MultiLineString") multiFeatureIndex++;
              if (geomType === "Polygon") geometryIndex++;
            }

            if (geomType === "Polygon") multiFeatureIndex++;
            break;

          case "MultiPolygon":
            for (j = 0; j < coords.length; j++) {
              geometryIndex = 0;

              for (k = 0; k < coords[j].length; k++) {
                for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                  if (callback(coords[j][k][l], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
                  coordIndex++;
                }

                geometryIndex++;
              }

              multiFeatureIndex++;
            }

            break;

          case "GeometryCollection":
            for (j = 0; j < geometry.geometries.length; j++) if (coordEach(geometry.geometries[j], callback, excludeWrapCoord) === false) return false;

            break;

          default:
            throw new Error("Unknown Geometry Type");
        }
      }
    }
  }
  /**
   * Callback for featureEach
   *
   * @callback featureEachCallback
   * @param {Feature<any>} currentFeature The current Feature being processed.
   * @param {number} featureIndex The current index of the Feature being processed.
   */

  /**
   * Iterate over features in any GeoJSON object, similar to
   * Array.forEach.
   *
   * @name featureEach
   * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
   * @param {Function} callback a method that takes (currentFeature, featureIndex)
   * @returns {void}
   * @example
   * var features = turf.featureCollection([
   *   turf.point([26, 37], {foo: 'bar'}),
   *   turf.point([36, 53], {hello: 'world'})
   * ]);
   *
   * turf.featureEach(features, function (currentFeature, featureIndex) {
   *   //=currentFeature
   *   //=featureIndex
   * });
   */


  function featureEach(geojson, callback) {
    if (geojson.type === "Feature") {
      callback(geojson, 0);
    } else if (geojson.type === "FeatureCollection") {
      for (var i = 0; i < geojson.features.length; i++) {
        if (callback(geojson.features[i], i) === false) break;
      }
    }
  }
  /**
   * Get all coordinates from any GeoJSON object.
   *
   * @name coordAll
   * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
   * @returns {Array<Array<number>>} coordinate position array
   * @example
   * var features = turf.featureCollection([
   *   turf.point([26, 37], {foo: 'bar'}),
   *   turf.point([36, 53], {hello: 'world'})
   * ]);
   *
   * var coords = turf.coordAll(features);
   * //= [[26, 37], [36, 53]]
   */


  function coordAll(geojson) {
    var coords = [];
    coordEach(geojson, function (coord) {
      coords.push(coord);
    });
    return coords;
  }

  var distance$1 = {
    /**
     * Euclidean distance
     */
    eudist: function eudist(v1, v2, sqrt) {
      var len = v1.length;
      var sum = 0;

      for (var i = 0; i < len; i++) {
        var d = (v1[i] || 0) - (v2[i] || 0);
        sum += d * d;
      } // Square root not really needed


      return sqrt ? Math.sqrt(sum) : sum;
    },
    mandist: function mandist(v1, v2, sqrt) {
      var len = v1.length;
      var sum = 0;

      for (var i = 0; i < len; i++) {
        sum += Math.abs((v1[i] || 0) - (v2[i] || 0));
      } // Square root not really needed


      return sqrt ? Math.sqrt(sum) : sum;
    },

    /**
     * Unidimensional distance
     */
    dist: function dist(v1, v2, sqrt) {
      var d = Math.abs(v1 - v2);
      return sqrt ? d : d * d;
    }
  };

  var eudist$1 = distance$1.eudist,
      dist = distance$1.dist;
  var kinit = {
    kmrand: function kmrand(data, k) {
      var map = {},
          ks = [],
          t = k << 2;
      var len = data.length;
      var multi = data[0].length > 0;

      while (ks.length < k && t-- > 0) {
        var d = data[Math.floor(Math.random() * len)];
        var key = multi ? d.join("_") : "" + d;

        if (!map[key]) {
          map[key] = true;
          ks.push(d);
        }
      }

      if (ks.length < k) throw new Error("Error initializating clusters");else return ks;
    },

    /**
     * K-means++ initial centroid selection
     */
    kmpp: function kmpp(data, k) {
      var distance = data[0].length ? eudist$1 : dist;
      var ks = [],
          len = data.length;
      var multi = data[0].length > 0;
      var map = {}; // First random centroid

      var c = data[Math.floor(Math.random() * len)];
      var key = multi ? c.join("_") : "" + c;
      ks.push(c);
      map[key] = true; // Retrieve next centroids

      while (ks.length < k) {
        // Min Distances between current centroids and data points
        var dists = [],
            lk = ks.length;
        var dsum = 0,
            prs = [];

        for (var i = 0; i < len; i++) {
          var min = Infinity;

          for (var j = 0; j < lk; j++) {
            var _dist = distance(data[i], ks[j]);

            if (_dist <= min) min = _dist;
          }

          dists[i] = min;
        } // Sum all min distances


        for (var _i = 0; _i < len; _i++) {
          dsum += dists[_i];
        } // Probabilities and cummulative prob (cumsum)


        for (var _i2 = 0; _i2 < len; _i2++) {
          prs[_i2] = {
            i: _i2,
            v: data[_i2],
            pr: dists[_i2] / dsum,
            cs: 0
          };
        } // Sort Probabilities


        prs.sort(function (a, b) {
          return a.pr - b.pr;
        }); // Cummulative Probabilities

        prs[0].cs = prs[0].pr;

        for (var _i3 = 1; _i3 < len; _i3++) {
          prs[_i3].cs = prs[_i3 - 1].cs + prs[_i3].pr;
        } // Randomize


        var rnd = Math.random(); // Gets only the items whose cumsum >= rnd

        var idx = 0;

        while (idx < len - 1 && prs[idx++].cs < rnd) {}

        ks.push(prs[idx - 1].v);
        /*
        let done = false;
        while(!done) {
        	// this is our new centroid
        	c = prs[idx-1].v
        	key = multi? c.join("_") : `${c}`;
        	if(!map[key]) {
        		map[key] = true;
        		ks.push(c);
        		done = true;
        	}
        	else {
        		idx++;
        	}
        }
        */
      }

      return ks;
    }
  };

  /*jshint esversion: 6 */


  var eudist = distance$1.eudist,
      kmrand = kinit.kmrand,
      kmpp = kinit.kmpp;
  var MAX = 10000;
  /**
   * Inits an array with values
   */

  function init(len, val, v) {
    v = v || [];

    for (var i = 0; i < len; i++) {
      v[i] = val;
    }

    return v;
  }

  function skmeans(data, k, initial, maxit) {
    var ks = [],
        old = [],
        idxs = [],
        dist = [];
    var conv = false,
        it = maxit || MAX;
    var len = data.length,
        vlen = data[0].length,
        multi = vlen > 0;
    var count = [];

    if (!initial) {
      var _idxs = {};

      while (ks.length < k) {
        var idx = Math.floor(Math.random() * len);

        if (!_idxs[idx]) {
          _idxs[idx] = true;
          ks.push(data[idx]);
        }
      }
    } else if (initial == "kmrand") {
      ks = kmrand(data, k);
    } else if (initial == "kmpp") {
      ks = kmpp(data, k);
    } else {
      ks = initial;
    }

    do {
      // Reset k count
      init(k, 0, count); // For each value in data, find the nearest centroid

      for (var i = 0; i < len; i++) {
        var min = Infinity,
            _idx = 0;

        for (var j = 0; j < k; j++) {
          // Multidimensional or unidimensional
          var dist = multi ? eudist(data[i], ks[j]) : Math.abs(data[i] - ks[j]);

          if (dist <= min) {
            min = dist;
            _idx = j;
          }
        }

        idxs[i] = _idx; // Index of the selected centroid for that value

        count[_idx]++; // Number of values for this centroid
      } // Recalculate centroids


      var sum = [],
          old = [];

      for (var _j = 0; _j < k; _j++) {
        // Multidimensional or unidimensional
        sum[_j] = multi ? init(vlen, 0, sum[_j]) : 0;
        old[_j] = ks[_j];
      } // If multidimensional


      if (multi) {
        for (var _j2 = 0; _j2 < k; _j2++) {
          ks[_j2] = [];
        } // Sum values and count for each centroid


        for (var _i = 0; _i < len; _i++) {
          var _idx2 = idxs[_i],
              // Centroid for that item
          vsum = sum[_idx2],
              // Sum values for this centroid
          vect = data[_i]; // Current vector
          // Accumulate value on the centroid for current vector

          for (var h = 0; h < vlen; h++) {
            vsum[h] += vect[h];
          }
        } // Calculate the average for each centroid


        conv = true;

        for (var _j3 = 0; _j3 < k; _j3++) {
          var ksj = ks[_j3],
              // Current centroid
          sumj = sum[_j3],
              // Accumulated centroid values
          oldj = old[_j3],
              // Old centroid value
          cj = count[_j3]; // Number of elements for this centroid
          // New average

          for (var _h = 0; _h < vlen; _h++) {
            ksj[_h] = sumj[_h] / cj || 0; // New centroid
          } // Find if centroids have moved


          if (conv) {
            for (var _h2 = 0; _h2 < vlen; _h2++) {
              if (oldj[_h2] != ksj[_h2]) {
                conv = false;
                break;
              }
            }
          }
        }
      } // If unidimensional
      else {
          // Sum values and count for each centroid
          for (var _i2 = 0; _i2 < len; _i2++) {
            var _idx3 = idxs[_i2];
            sum[_idx3] += data[_i2];
          } // Calculate the average for each centroid


          for (var _j4 = 0; _j4 < k; _j4++) {
            ks[_j4] = sum[_j4] / count[_j4] || 0; // New centroid
          } // Find if centroids have moved


          conv = true;

          for (var _j5 = 0; _j5 < k; _j5++) {
            if (old[_j5] != ks[_j5]) {
              conv = false;
              break;
            }
          }
        }

      conv = conv || --it <= 0;
    } while (!conv);

    return {
      it: MAX - it,
      k: k,
      idxs: idxs,
      centroids: ks
    };
  }

  var main = skmeans;

  /**
   * Takes a set of {@link Point|points} and partition them into clusters using the k-mean .
   * It uses the [k-means algorithm](https://en.wikipedia.org/wiki/K-means_clustering)
   *
   * @name clustersKmeans
   * @param {FeatureCollection<Point>} points to be clustered
   * @param {Object} [options={}] Optional parameters
   * @param {number} [options.numberOfClusters=Math.sqrt(numberOfPoints/2)] numberOfClusters that will be generated
   * @param {boolean} [options.mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
   * @returns {FeatureCollection<Point>} Clustered Points with an additional two properties associated to each Feature:
   * - {number} cluster - the associated clusterId
   * - {[number, number]} centroid - Centroid of the cluster [Longitude, Latitude]
   * @example
   * // create random points with random z-values in their properties
   * var points = turf.randomPoint(100, {bbox: [0, 30, 20, 50]});
   * var options = {numberOfClusters: 7};
   * var clustered = turf.clustersKmeans(points, options);
   *
   * //addToMap
   * var addToMap = [clustered];
   */

  function clustersKmeans(points, options) {
    if (options === void 0) {
      options = {};
    } // Default Params


    var count = points.features.length;
    options.numberOfClusters = options.numberOfClusters || Math.round(Math.sqrt(count / 2)); // numberOfClusters can't be greater than the number of points
    // fallbacks to count

    if (options.numberOfClusters > count) options.numberOfClusters = count; // Clone points to prevent any mutations (enabled by default)

    if (options.mutate !== true) points = clone(points); // collect points coordinates

    var data = coordAll(points); // create seed to avoid skmeans to drift

    var initialCentroids = data.slice(0, options.numberOfClusters); // create skmeans clusters

    var skmeansResult = main(data, options.numberOfClusters, initialCentroids); // store centroids {clusterId: [number, number]}

    var centroids = {};
    skmeansResult.centroids.forEach(function (coord, idx) {
      centroids[idx] = coord;
    }); // add associated cluster number

    featureEach(points, function (point, index) {
      var clusterId = skmeansResult.idxs[index];
      point.properties.cluster = clusterId;
      point.properties.centroid = centroids[clusterId];
    });
    return points;
  }

  /**
   * Experimental algorithm using Kmeans.
   *
   * The Grid algorithm does not implement caching and markers may flash as the
   * viewport changes. Instead use {@link SuperClusterAlgorithm}.
   *
   * @see https://www.npmjs.com/package/@turf/clusters-kmeans
   */

  var KmeansAlgorithm = /*#__PURE__*/function (_AbstractViewportAlgo) {
    _inherits(KmeansAlgorithm, _AbstractViewportAlgo);

    var _super = _createSuper(KmeansAlgorithm);

    function KmeansAlgorithm(_a) {
      var _this;

      _classCallCheck(this, KmeansAlgorithm);

      var numberOfClusters = _a.numberOfClusters,
          options = __rest(_a, ["numberOfClusters"]);

      _this = _super.call(this, options);
      _this.numberOfClusters = numberOfClusters;
      return _this;
    }

    _createClass(KmeansAlgorithm, [{
      key: "cluster",
      value: function cluster(_ref) {
        var markers = _ref.markers,
            map = _ref.map;
        var clusters = [];

        if (markers.length === 0) {
          return clusters;
        }

        var points = featureCollection(markers.map(function (marker) {
          return point([marker.getPosition().lng(), marker.getPosition().lat()]);
        }));
        var numberOfClusters;

        if (this.numberOfClusters instanceof Function) {
          numberOfClusters = this.numberOfClusters(markers.length, map.getZoom());
        } else {
          numberOfClusters = this.numberOfClusters;
        }

        clustersKmeans(points, {
          numberOfClusters: numberOfClusters
        }).features.forEach(function (point, i) {
          if (!clusters[point.properties.cluster]) {
            clusters[point.properties.cluster] = new Cluster({
              position: {
                lng: point.properties.centroid[0],
                lat: point.properties.centroid[1]
              },
              markers: []
            });
          }

          clusters[point.properties.cluster].push(markers[i]);
        });
        return clusters;
      }
    }]);

    return KmeansAlgorithm;
  }(AbstractViewportAlgorithm);

  // https://tc39.es/ecma262/#sec-object.keys
  // eslint-disable-next-line es/no-object-keys -- safe

  var objectKeys = Object.keys || function keys(O) {
    return objectKeysInternal(O, enumBugKeys);
  };

  var $assign = Object.assign; // eslint-disable-next-line es/no-object-defineproperty -- required for testing

  var defineProperty$1 = Object.defineProperty;
  var concat = functionUncurryThis([].concat); // `Object.assign` method
  // https://tc39.es/ecma262/#sec-object.assign

  var objectAssign = !$assign || fails(function () {
    // should have correct order of operations (Edge bug)
    if (descriptors && $assign({
      b: 1
    }, $assign(defineProperty$1({}, 'a', {
      enumerable: true,
      get: function () {
        defineProperty$1(this, 'b', {
          value: 3,
          enumerable: false
        });
      }
    }), {
      b: 2
    })).b !== 1) return true; // should work with symbols and should have deterministic property order (V8 bug)

    var A = {};
    var B = {}; // eslint-disable-next-line es/no-symbol -- safe

    var symbol = Symbol();
    var alphabet = 'abcdefghijklmnopqrst';
    A[symbol] = 7;
    alphabet.split('').forEach(function (chr) {
      B[chr] = chr;
    });
    return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
  }) ? function assign(target, source) {
    // eslint-disable-line no-unused-vars -- required for `.length`
    var T = toObject(target);
    var argumentsLength = arguments.length;
    var index = 1;
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    var propertyIsEnumerable = objectPropertyIsEnumerable.f;

    while (argumentsLength > index) {
      var S = indexedObject(arguments[index++]);
      var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
      var length = keys.length;
      var j = 0;
      var key;

      while (length > j) {
        key = keys[j++];
        if (!descriptors || functionCall(propertyIsEnumerable, S, key)) T[key] = S[key];
      }
    }

    return T;
  } : $assign;

  // https://tc39.es/ecma262/#sec-object.assign
  // eslint-disable-next-line es/no-object-assign -- required for testing

  _export({
    target: 'Object',
    stat: true,
    forced: Object.assign !== objectAssign
  }, {
    assign: objectAssign
  });

  /**
   * Unwrap a coordinate from a Point Feature, Geometry or a single coordinate.
   *
   * @name getCoord
   * @param {Array<number>|Geometry<Point>|Feature<Point>} coord GeoJSON Point or an Array of numbers
   * @returns {Array<number>} coordinates
   * @example
   * var pt = turf.point([10, 10]);
   *
   * var coord = turf.getCoord(pt);
   * //= [10, 10]
   */

  function getCoord(coord) {
    if (!coord) {
      throw new Error("coord is required");
    }

    if (!Array.isArray(coord)) {
      if (coord.type === "Feature" && coord.geometry !== null && coord.geometry.type === "Point") {
        return coord.geometry.coordinates;
      }

      if (coord.type === "Point") {
        return coord.coordinates;
      }
    }

    if (Array.isArray(coord) && coord.length >= 2 && !Array.isArray(coord[0]) && !Array.isArray(coord[1])) {
      return coord;
    }

    throw new Error("coord must be GeoJSON Point or an Array of numbers");
  }

  //http://www.movable-type.co.uk/scripts/latlong.html

  /**
   * Calculates the distance between two {@link Point|points} in degrees, radians, miles, or kilometers.
   * This uses the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula) to account for global curvature.
   *
   * @name distance
   * @param {Coord | Point} from origin point or coordinate
   * @param {Coord | Point} to destination point or coordinate
   * @param {Object} [options={}] Optional parameters
   * @param {string} [options.units='kilometers'] can be degrees, radians, miles, or kilometers
   * @returns {number} distance between the two points
   * @example
   * var from = turf.point([-75.343, 39.984]);
   * var to = turf.point([-75.534, 39.123]);
   * var options = {units: 'miles'};
   *
   * var distance = turf.distance(from, to, options);
   *
   * //addToMap
   * var addToMap = [from, to];
   * from.properties.distance = distance;
   * to.properties.distance = distance;
   */

  function distance(from, to, options) {
    if (options === void 0) {
      options = {};
    }

    var coordinates1 = getCoord(from);
    var coordinates2 = getCoord(to);
    var dLat = degreesToRadians(coordinates2[1] - coordinates1[1]);
    var dLon = degreesToRadians(coordinates2[0] - coordinates1[0]);
    var lat1 = degreesToRadians(coordinates1[1]);
    var lat2 = degreesToRadians(coordinates2[1]);
    var a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
    return radiansToLength(2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)), options.units);
  }

  var DBSCAN_1 = createCommonjsModule(function (module) {
    /**
     * DBSCAN - Density based clustering
     *
     * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
     * @copyright MIT
     */

    /**
     * DBSCAN class construcotr
     * @constructor
     *
     * @param {Array} dataset
     * @param {number} epsilon
     * @param {number} minPts
     * @param {function} distanceFunction
     * @returns {DBSCAN}
     */
    function DBSCAN(dataset, epsilon, minPts, distanceFunction) {
      /** @type {Array} */
      this.dataset = [];
      /** @type {number} */

      this.epsilon = 1;
      /** @type {number} */

      this.minPts = 2;
      /** @type {function} */

      this.distance = this._euclideanDistance;
      /** @type {Array} */

      this.clusters = [];
      /** @type {Array} */

      this.noise = []; // temporary variables used during computation

      /** @type {Array} */

      this._visited = [];
      /** @type {Array} */

      this._assigned = [];
      /** @type {number} */

      this._datasetLength = 0;

      this._init(dataset, epsilon, minPts, distanceFunction);
    }
    /******************************************************************************/
    // public functions

    /**
     * Start clustering
     *
     * @param {Array} dataset
     * @param {number} epsilon
     * @param {number} minPts
     * @param {function} distanceFunction
     * @returns {undefined}
     * @access public
     */

    DBSCAN.prototype.run = function (dataset, epsilon, minPts, distanceFunction) {
      this._init(dataset, epsilon, minPts, distanceFunction);

      for (var pointId = 0; pointId < this._datasetLength; pointId++) {
        // if point is not visited, check if it forms a cluster
        if (this._visited[pointId] !== 1) {
          this._visited[pointId] = 1; // if closest neighborhood is too small to form a cluster, mark as noise

          var neighbors = this._regionQuery(pointId);

          if (neighbors.length < this.minPts) {
            this.noise.push(pointId);
          } else {
            // create new cluster and add point
            var clusterId = this.clusters.length;
            this.clusters.push([]);

            this._addToCluster(pointId, clusterId);

            this._expandCluster(clusterId, neighbors);
          }
        }
      }

      return this.clusters;
    };
    /******************************************************************************/
    // protected functions

    /**
     * Set object properties
     *
     * @param {Array} dataset
     * @param {number} epsilon
     * @param {number} minPts
     * @param {function} distance
     * @returns {undefined}
     * @access protected
     */


    DBSCAN.prototype._init = function (dataset, epsilon, minPts, distance) {
      if (dataset) {
        if (!(dataset instanceof Array)) {
          throw Error('Dataset must be of type array, ' + typeof dataset + ' given');
        }

        this.dataset = dataset;
        this.clusters = [];
        this.noise = [];
        this._datasetLength = dataset.length;
        this._visited = new Array(this._datasetLength);
        this._assigned = new Array(this._datasetLength);
      }

      if (epsilon) {
        this.epsilon = epsilon;
      }

      if (minPts) {
        this.minPts = minPts;
      }

      if (distance) {
        this.distance = distance;
      }
    };
    /**
     * Expand cluster to closest points of given neighborhood
     *
     * @param {number} clusterId
     * @param {Array} neighbors
     * @returns {undefined}
     * @access protected
     */


    DBSCAN.prototype._expandCluster = function (clusterId, neighbors) {
      /**
       * It's very important to calculate length of neighbors array each time,
       * as the number of elements changes over time
       */
      for (var i = 0; i < neighbors.length; i++) {
        var pointId2 = neighbors[i];

        if (this._visited[pointId2] !== 1) {
          this._visited[pointId2] = 1;

          var neighbors2 = this._regionQuery(pointId2);

          if (neighbors2.length >= this.minPts) {
            neighbors = this._mergeArrays(neighbors, neighbors2);
          }
        } // add to cluster


        if (this._assigned[pointId2] !== 1) {
          this._addToCluster(pointId2, clusterId);
        }
      }
    };
    /**
     * Add new point to cluster
     *
     * @param {number} pointId
     * @param {number} clusterId
     */


    DBSCAN.prototype._addToCluster = function (pointId, clusterId) {
      this.clusters[clusterId].push(pointId);
      this._assigned[pointId] = 1;
    };
    /**
     * Find all neighbors around given point
     *
     * @param {number} pointId,
     * @param {number} epsilon
     * @returns {Array}
     * @access protected
     */


    DBSCAN.prototype._regionQuery = function (pointId) {
      var neighbors = [];

      for (var id = 0; id < this._datasetLength; id++) {
        var dist = this.distance(this.dataset[pointId], this.dataset[id]);

        if (dist < this.epsilon) {
          neighbors.push(id);
        }
      }

      return neighbors;
    };
    /******************************************************************************/
    // helpers

    /**
     * @param {Array} a
     * @param {Array} b
     * @returns {Array}
     * @access protected
     */


    DBSCAN.prototype._mergeArrays = function (a, b) {
      var len = b.length;

      for (var i = 0; i < len; i++) {
        var P = b[i];

        if (a.indexOf(P) < 0) {
          a.push(P);
        }
      }

      return a;
    };
    /**
     * Calculate euclidean distance in multidimensional space
     *
     * @param {Array} p
     * @param {Array} q
     * @returns {number}
     * @access protected
     */


    DBSCAN.prototype._euclideanDistance = function (p, q) {
      var sum = 0;
      var i = Math.min(p.length, q.length);

      while (i--) {
        sum += (p[i] - q[i]) * (p[i] - q[i]);
      }

      return Math.sqrt(sum);
    };

    if (module.exports) {
      module.exports = DBSCAN;
    }
  });

  var KMEANS_1 = createCommonjsModule(function (module) {
    /**
     * KMEANS clustering
     *
     * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
     * @copyright MIT
     */

    /**
     * KMEANS class constructor
     * @constructor
     *
     * @param {Array} dataset
     * @param {number} k - number of clusters
     * @param {function} distance - distance function
     * @returns {KMEANS}
     */
    function KMEANS(dataset, k, distance) {
      this.k = 3; // number of clusters

      this.dataset = []; // set of feature vectors

      this.assignments = []; // set of associated clusters for each feature vector

      this.centroids = []; // vectors for our clusters

      this.init(dataset, k, distance);
    }
    /**
     * @returns {undefined}
     */


    KMEANS.prototype.init = function (dataset, k, distance) {
      this.assignments = [];
      this.centroids = [];

      if (typeof dataset !== 'undefined') {
        this.dataset = dataset;
      }

      if (typeof k !== 'undefined') {
        this.k = k;
      }

      if (typeof distance !== 'undefined') {
        this.distance = distance;
      }
    };
    /**
     * @returns {undefined}
     */


    KMEANS.prototype.run = function (dataset, k) {
      this.init(dataset, k);
      var len = this.dataset.length; // initialize centroids

      for (var i = 0; i < this.k; i++) {
        this.centroids[i] = this.randomCentroid();
      }

      var change = true;

      while (change) {
        // assign feature vectors to clusters
        change = this.assign(); // adjust location of centroids

        for (var centroidId = 0; centroidId < this.k; centroidId++) {
          var mean = new Array(maxDim);
          var count = 0; // init mean vector

          for (var dim = 0; dim < maxDim; dim++) {
            mean[dim] = 0;
          }

          for (var j = 0; j < len; j++) {
            var maxDim = this.dataset[j].length; // if current cluster id is assigned to point

            if (centroidId === this.assignments[j]) {
              for (var dim = 0; dim < maxDim; dim++) {
                mean[dim] += this.dataset[j][dim];
              }

              count++;
            }
          }

          if (count > 0) {
            // if cluster contain points, adjust centroid position
            for (var dim = 0; dim < maxDim; dim++) {
              mean[dim] /= count;
            }

            this.centroids[centroidId] = mean;
          } else {
            // if cluster is empty, generate new random centroid
            this.centroids[centroidId] = this.randomCentroid();
            change = true;
          }
        }
      }

      return this.getClusters();
    };
    /**
     * Generate random centroid
     *
     * @returns {Array}
     */


    KMEANS.prototype.randomCentroid = function () {
      var maxId = this.dataset.length - 1;
      var centroid;
      var id;

      do {
        id = Math.round(Math.random() * maxId);
        centroid = this.dataset[id];
      } while (this.centroids.indexOf(centroid) >= 0);

      return centroid;
    };
    /**
     * Assign points to clusters
     *
     * @returns {boolean}
     */


    KMEANS.prototype.assign = function () {
      var change = false;
      var len = this.dataset.length;
      var closestCentroid;

      for (var i = 0; i < len; i++) {
        closestCentroid = this.argmin(this.dataset[i], this.centroids, this.distance);

        if (closestCentroid != this.assignments[i]) {
          this.assignments[i] = closestCentroid;
          change = true;
        }
      }

      return change;
    };
    /**
     * Extract information about clusters
     *
     * @returns {undefined}
     */


    KMEANS.prototype.getClusters = function () {
      var clusters = new Array(this.k);
      var centroidId;

      for (var pointId = 0; pointId < this.assignments.length; pointId++) {
        centroidId = this.assignments[pointId]; // init empty cluster

        if (typeof clusters[centroidId] === 'undefined') {
          clusters[centroidId] = [];
        }

        clusters[centroidId].push(pointId);
      }

      return clusters;
    }; // utils

    /**
     * @params {Array} point
     * @params {Array.<Array>} set
     * @params {Function} f
     * @returns {number}
     */


    KMEANS.prototype.argmin = function (point, set, f) {
      var min = Number.MAX_VALUE;
      var arg = 0;
      var len = set.length;
      var d;

      for (var i = 0; i < len; i++) {
        d = f(point, set[i]);

        if (d < min) {
          min = d;
          arg = i;
        }
      }

      return arg;
    };
    /**
     * Euclidean distance
     *
     * @params {number} p
     * @params {number} q
     * @returns {number}
     */


    KMEANS.prototype.distance = function (p, q) {
      var sum = 0;
      var i = Math.min(p.length, q.length);

      while (i--) {
        var diff = p[i] - q[i];
        sum += diff * diff;
      }

      return Math.sqrt(sum);
    };

    if (module.exports) {
      module.exports = KMEANS;
    }
  });

  var PriorityQueue_1 = createCommonjsModule(function (module) {
    /**
     * PriorityQueue
     * Elements in this queue are sorted according to their value
     *
     * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
     * @copyright MIT
     */

    /**
     * PriorityQueue class construcotr
     * @constructor
     *
     * @example
     * queue: [1,2,3,4]
     * priorities: [4,1,2,3]
     * > result = [1,4,2,3]
     *
     * @param {Array} elements
     * @param {Array} priorities
     * @param {string} sorting - asc / desc
     * @returns {PriorityQueue}
     */
    function PriorityQueue(elements, priorities, sorting) {
      /** @type {Array} */
      this._queue = [];
      /** @type {Array} */

      this._priorities = [];
      /** @type {string} */

      this._sorting = 'desc';

      this._init(elements, priorities, sorting);
    }
    /**
     * Insert element
     *
     * @param {Object} ele
     * @param {Object} priority
     * @returns {undefined}
     * @access public
     */

    PriorityQueue.prototype.insert = function (ele, priority) {
      var indexToInsert = this._queue.length;
      var index = indexToInsert;

      while (index--) {
        var priority2 = this._priorities[index];

        if (this._sorting === 'desc') {
          if (priority > priority2) {
            indexToInsert = index;
          }
        } else {
          if (priority < priority2) {
            indexToInsert = index;
          }
        }
      }

      this._insertAt(ele, priority, indexToInsert);
    };
    /**
     * Remove element
     *
     * @param {Object} ele
     * @returns {undefined}
     * @access public
     */


    PriorityQueue.prototype.remove = function (ele) {
      var index = this._queue.length;

      while (index--) {
        var ele2 = this._queue[index];

        if (ele === ele2) {
          this._queue.splice(index, 1);

          this._priorities.splice(index, 1);

          break;
        }
      }
    };
    /**
     * For each loop wrapper
     *
     * @param {function} func
     * @returs {undefined}
     * @access public
     */


    PriorityQueue.prototype.forEach = function (func) {
      this._queue.forEach(func);
    };
    /**
     * @returns {Array}
     * @access public
     */


    PriorityQueue.prototype.getElements = function () {
      return this._queue;
    };
    /**
     * @param {number} index
     * @returns {Object}
     * @access public
     */


    PriorityQueue.prototype.getElementPriority = function (index) {
      return this._priorities[index];
    };
    /**
     * @returns {Array}
     * @access public
     */


    PriorityQueue.prototype.getPriorities = function () {
      return this._priorities;
    };
    /**
     * @returns {Array}
     * @access public
     */


    PriorityQueue.prototype.getElementsWithPriorities = function () {
      var result = [];

      for (var i = 0, l = this._queue.length; i < l; i++) {
        result.push([this._queue[i], this._priorities[i]]);
      }

      return result;
    };
    /**
     * Set object properties
     *
     * @param {Array} elements
     * @param {Array} priorities
     * @returns {undefined}
     * @access protected
     */


    PriorityQueue.prototype._init = function (elements, priorities, sorting) {
      if (elements && priorities) {
        this._queue = [];
        this._priorities = [];

        if (elements.length !== priorities.length) {
          throw new Error('Arrays must have the same length');
        }

        for (var i = 0; i < elements.length; i++) {
          this.insert(elements[i], priorities[i]);
        }
      }

      if (sorting) {
        this._sorting = sorting;
      }
    };
    /**
     * Insert element at given position
     *
     * @param {Object} ele
     * @param {number} index
     * @returns {undefined}
     * @access protected
     */


    PriorityQueue.prototype._insertAt = function (ele, priority, index) {
      if (this._queue.length === index) {
        this._queue.push(ele);

        this._priorities.push(priority);
      } else {
        this._queue.splice(index, 0, ele);

        this._priorities.splice(index, 0, priority);
      }
    };

    if (module.exports) {
      module.exports = PriorityQueue;
    }
  });

  var OPTICS_1 = createCommonjsModule(function (module) {
    /**
     * @requires ./PriorityQueue.js
     */
    if (module.exports) {
      var PriorityQueue = PriorityQueue_1;
    }
    /**
     * OPTICS - Ordering points to identify the clustering structure
     *
     * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
     * @copyright MIT
     */

    /**
     * OPTICS class constructor
     * @constructor
     *
     * @param {Array} dataset
     * @param {number} epsilon
     * @param {number} minPts
     * @param {function} distanceFunction
     * @returns {OPTICS}
     */


    function OPTICS(dataset, epsilon, minPts, distanceFunction) {
      /** @type {number} */
      this.epsilon = 1;
      /** @type {number} */

      this.minPts = 1;
      /** @type {function} */

      this.distance = this._euclideanDistance; // temporary variables used during computation

      /** @type {Array} */

      this._reachability = [];
      /** @type {Array} */

      this._processed = [];
      /** @type {number} */

      this._coreDistance = 0;
      /** @type {Array} */

      this._orderedList = [];

      this._init(dataset, epsilon, minPts, distanceFunction);
    }
    /******************************************************************************/
    // pulic functions

    /**
     * Start clustering
     *
     * @param {Array} dataset
     * @returns {undefined}
     * @access public
     */


    OPTICS.prototype.run = function (dataset, epsilon, minPts, distanceFunction) {
      this._init(dataset, epsilon, minPts, distanceFunction);

      for (var pointId = 0, l = this.dataset.length; pointId < l; pointId++) {
        if (this._processed[pointId] !== 1) {
          this._processed[pointId] = 1;
          this.clusters.push([pointId]);
          var clusterId = this.clusters.length - 1;

          this._orderedList.push(pointId);

          var priorityQueue = new PriorityQueue(null, null, 'asc');

          var neighbors = this._regionQuery(pointId); // using priority queue assign elements to new cluster


          if (this._distanceToCore(pointId) !== undefined) {
            this._updateQueue(pointId, neighbors, priorityQueue);

            this._expandCluster(clusterId, priorityQueue);
          }
        }
      }

      return this.clusters;
    };
    /**
     * Generate reachability plot for all points
     *
     * @returns {array}
     * @access public
     */


    OPTICS.prototype.getReachabilityPlot = function () {
      var reachabilityPlot = [];

      for (var i = 0, l = this._orderedList.length; i < l; i++) {
        var pointId = this._orderedList[i];
        var distance = this._reachability[pointId];
        reachabilityPlot.push([pointId, distance]);
      }

      return reachabilityPlot;
    };
    /******************************************************************************/
    // protected functions

    /**
     * Set object properties
     *
     * @param {Array} dataset
     * @param {number} epsilon
     * @param {number} minPts
     * @param {function} distance
     * @returns {undefined}
     * @access protected
     */


    OPTICS.prototype._init = function (dataset, epsilon, minPts, distance) {
      if (dataset) {
        if (!(dataset instanceof Array)) {
          throw Error('Dataset must be of type array, ' + typeof dataset + ' given');
        }

        this.dataset = dataset;
        this.clusters = [];
        this._reachability = new Array(this.dataset.length);
        this._processed = new Array(this.dataset.length);
        this._coreDistance = 0;
        this._orderedList = [];
      }

      if (epsilon) {
        this.epsilon = epsilon;
      }

      if (minPts) {
        this.minPts = minPts;
      }

      if (distance) {
        this.distance = distance;
      }
    };
    /**
     * Update information in queue
     *
     * @param {number} pointId
     * @param {Array} neighbors
     * @param {PriorityQueue} queue
     * @returns {undefined}
     * @access protected
     */


    OPTICS.prototype._updateQueue = function (pointId, neighbors, queue) {
      var self = this;
      this._coreDistance = this._distanceToCore(pointId);
      neighbors.forEach(function (pointId2) {
        if (self._processed[pointId2] === undefined) {
          var dist = self.distance(self.dataset[pointId], self.dataset[pointId2]);
          var newReachableDistance = Math.max(self._coreDistance, dist);

          if (self._reachability[pointId2] === undefined) {
            self._reachability[pointId2] = newReachableDistance;
            queue.insert(pointId2, newReachableDistance);
          } else {
            if (newReachableDistance < self._reachability[pointId2]) {
              self._reachability[pointId2] = newReachableDistance;
              queue.remove(pointId2);
              queue.insert(pointId2, newReachableDistance);
            }
          }
        }
      });
    };
    /**
     * Expand cluster
     *
     * @param {number} clusterId
     * @param {PriorityQueue} queue
     * @returns {undefined}
     * @access protected
     */


    OPTICS.prototype._expandCluster = function (clusterId, queue) {
      var queueElements = queue.getElements();

      for (var p = 0, l = queueElements.length; p < l; p++) {
        var pointId = queueElements[p];

        if (this._processed[pointId] === undefined) {
          var neighbors = this._regionQuery(pointId);

          this._processed[pointId] = 1;
          this.clusters[clusterId].push(pointId);

          this._orderedList.push(pointId);

          if (this._distanceToCore(pointId) !== undefined) {
            this._updateQueue(pointId, neighbors, queue);

            this._expandCluster(clusterId, queue);
          }
        }
      }
    };
    /**
     * Calculating distance to cluster core
     *
     * @param {number} pointId
     * @returns {number}
     * @access protected
     */


    OPTICS.prototype._distanceToCore = function (pointId) {
      var l = this.epsilon;

      for (var coreDistCand = 0; coreDistCand < l; coreDistCand++) {
        var neighbors = this._regionQuery(pointId, coreDistCand);

        if (neighbors.length >= this.minPts) {
          return coreDistCand;
        }
      }

      return;
    };
    /**
     * Find all neighbors around given point
     *
     * @param {number} pointId
     * @param {number} epsilon
     * @returns {Array}
     * @access protected
     */


    OPTICS.prototype._regionQuery = function (pointId, epsilon) {
      epsilon = epsilon || this.epsilon;
      var neighbors = [];

      for (var id = 0, l = this.dataset.length; id < l; id++) {
        if (this.distance(this.dataset[pointId], this.dataset[id]) < epsilon) {
          neighbors.push(id);
        }
      }

      return neighbors;
    };
    /******************************************************************************/
    // helpers

    /**
     * Calculate euclidean distance in multidimensional space
     *
     * @param {Array} p
     * @param {Array} q
     * @returns {number}
     * @access protected
     */


    OPTICS.prototype._euclideanDistance = function (p, q) {
      var sum = 0;
      var i = Math.min(p.length, q.length);

      while (i--) {
        sum += (p[i] - q[i]) * (p[i] - q[i]);
      }

      return Math.sqrt(sum);
    };

    if (module.exports) {
      module.exports = OPTICS;
    }
  });

  var lib = createCommonjsModule(function (module) {
    if (module.exports) {
      module.exports = {
        DBSCAN: DBSCAN_1,
        KMEANS: KMEANS_1,
        OPTICS: OPTICS_1,
        PriorityQueue: PriorityQueue_1
      };
    }
  });
  lib.DBSCAN;
  lib.KMEANS;
  lib.OPTICS;
  lib.PriorityQueue;

  /**
   * Takes a set of {@link Point|points} and partition them into clusters according to {@link DBSCAN's|https://en.wikipedia.org/wiki/DBSCAN} data clustering algorithm.
   *
   * @name clustersDbscan
   * @param {FeatureCollection<Point>} points to be clustered
   * @param {number} maxDistance Maximum Distance between any point of the cluster to generate the clusters (kilometers only)
   * @param {Object} [options={}] Optional parameters
   * @param {string} [options.units="kilometers"] in which `maxDistance` is expressed, can be degrees, radians, miles, or kilometers
   * @param {boolean} [options.mutate=false] Allows GeoJSON input to be mutated
   * @param {number} [options.minPoints=3] Minimum number of points to generate a single cluster,
   * points which do not meet this requirement will be classified as an 'edge' or 'noise'.
   * @returns {FeatureCollection<Point>} Clustered Points with an additional two properties associated to each Feature:
   * - {number} cluster - the associated clusterId
   * - {string} dbscan - type of point it has been classified as ('core'|'edge'|'noise')
   * @example
   * // create random points with random z-values in their properties
   * var points = turf.randomPoint(100, {bbox: [0, 30, 20, 50]});
   * var maxDistance = 100;
   * var clustered = turf.clustersDbscan(points, maxDistance);
   *
   * //addToMap
   * var addToMap = [clustered];
   */

  function clustersDbscan(points, maxDistance, options) {
    // Input validation being handled by Typescript
    // collectionOf(points, 'Point', 'points must consist of a FeatureCollection of only Points');
    // if (maxDistance === null || maxDistance === undefined) throw new Error('maxDistance is required');
    // if (!(Math.sign(maxDistance) > 0)) throw new Error('maxDistance is invalid');
    // if (!(minPoints === undefined || minPoints === null || Math.sign(minPoints) > 0)) throw new Error('options.minPoints is invalid');
    if (options === void 0) {
      options = {};
    } // Clone points to prevent any mutations


    if (options.mutate !== true) points = clone(points); // Defaults

    options.minPoints = options.minPoints || 3; // create clustered ids

    var dbscan = new lib.DBSCAN();
    var clusteredIds = dbscan.run(coordAll(points), convertLength(maxDistance, options.units), options.minPoints, distance); // Tag points to Clusters ID

    var clusterId = -1;
    clusteredIds.forEach(function (clusterIds) {
      clusterId++; // assign cluster ids to input points

      clusterIds.forEach(function (idx) {
        var clusterPoint = points.features[idx];
        if (!clusterPoint.properties) clusterPoint.properties = {};
        clusterPoint.properties.cluster = clusterId;
        clusterPoint.properties.dbscan = "core";
      });
    }); // handle noise points, if any
    // edges points are tagged by DBSCAN as both 'noise' and 'cluster' as they can "reach" less than 'minPoints' number of points

    dbscan.noise.forEach(function (noiseId) {
      var noisePoint = points.features[noiseId];
      if (!noisePoint.properties) noisePoint.properties = {};
      if (noisePoint.properties.cluster) noisePoint.properties.dbscan = "edge";else noisePoint.properties.dbscan = "noise";
    });
    return points;
  }

  var DEFAULT_INTERNAL_DBSCAN_OPTION = {
    units: "kilometers",
    mutate: false,
    minPoints: 1
  };
  /**
   *
   * **This algorithm is not yet ready for use!**
   *
   * Experimental algorithm using DBScan.
   *
   * The Grid algorithm does not implement caching and markers may flash as the
   * viewport changes. Instead use {@link SuperClusterAlgorithm}.
   *
   * @see https://www.npmjs.com/package/@turf/clusters-dbscan
   */

  var DBScanAlgorithm = /*#__PURE__*/function (_AbstractViewportAlgo) {
    _inherits(DBScanAlgorithm, _AbstractViewportAlgo);

    var _super = _createSuper(DBScanAlgorithm);

    function DBScanAlgorithm(_a) {
      var _this;

      _classCallCheck(this, DBScanAlgorithm);

      var _a$maxDistance = _a.maxDistance,
          maxDistance = _a$maxDistance === void 0 ? 200 : _a$maxDistance,
          _a$minPoints = _a.minPoints,
          minPoints = _a$minPoints === void 0 ? DEFAULT_INTERNAL_DBSCAN_OPTION.minPoints : _a$minPoints,
          options = __rest(_a, ["maxDistance", "minPoints"]);

      _this = _super.call(this, options);
      _this.maxDistance = maxDistance;
      _this.options = Object.assign(Object.assign({}, DEFAULT_INTERNAL_DBSCAN_OPTION), {
        minPoints: minPoints
      });
      return _this;
    }

    _createClass(DBScanAlgorithm, [{
      key: "cluster",
      value: function cluster(_ref) {
        var markers = _ref.markers,
            mapCanvasProjection = _ref.mapCanvasProjection;
        var points = featureCollection(markers.map(function (marker) {
          var projectedPoint = mapCanvasProjection.fromLatLngToContainerPixel(marker.getPosition());
          return point([projectedPoint.x, projectedPoint.y]);
        }));
        var grouped = [];
        clustersDbscan(points, this.maxDistance, this.options).features.forEach(function (point, i) {
          if (!grouped[point.properties.cluster]) {
            grouped[point.properties.cluster] = [];
          }

          grouped[point.properties.cluster].push(markers[i]);
        });
        return grouped.map(function (markers) {
          return new Cluster({
            markers: markers
          });
        });
      }
    }]);

    return DBScanAlgorithm;
  }(AbstractViewportAlgorithm);

  function sortKD(ids, coords, nodeSize, left, right, depth) {
    if (right - left <= nodeSize) return;
    const m = left + right >> 1;
    select(ids, coords, m, left, right, depth % 2);
    sortKD(ids, coords, nodeSize, left, m - 1, depth + 1);
    sortKD(ids, coords, nodeSize, m + 1, right, depth + 1);
  }

  function select(ids, coords, k, left, right, inc) {
    while (right > left) {
      if (right - left > 600) {
        const n = right - left + 1;
        const m = k - left + 1;
        const z = Math.log(n);
        const s = 0.5 * Math.exp(2 * z / 3);
        const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
        const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
        const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
        select(ids, coords, k, newLeft, newRight, inc);
      }

      const t = coords[2 * k + inc];
      let i = left;
      let j = right;
      swapItem(ids, coords, left, k);
      if (coords[2 * right + inc] > t) swapItem(ids, coords, left, right);

      while (i < j) {
        swapItem(ids, coords, i, j);
        i++;
        j--;

        while (coords[2 * i + inc] < t) i++;

        while (coords[2 * j + inc] > t) j--;
      }

      if (coords[2 * left + inc] === t) swapItem(ids, coords, left, j);else {
        j++;
        swapItem(ids, coords, j, right);
      }
      if (j <= k) left = j + 1;
      if (k <= j) right = j - 1;
    }
  }

  function swapItem(ids, coords, i, j) {
    swap(ids, i, j);
    swap(coords, 2 * i, 2 * j);
    swap(coords, 2 * i + 1, 2 * j + 1);
  }

  function swap(arr, i, j) {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }

  function range(ids, coords, minX, minY, maxX, maxY, nodeSize) {
    const stack = [0, ids.length - 1, 0];
    const result = [];
    let x, y;

    while (stack.length) {
      const axis = stack.pop();
      const right = stack.pop();
      const left = stack.pop();

      if (right - left <= nodeSize) {
        for (let i = left; i <= right; i++) {
          x = coords[2 * i];
          y = coords[2 * i + 1];
          if (x >= minX && x <= maxX && y >= minY && y <= maxY) result.push(ids[i]);
        }

        continue;
      }

      const m = Math.floor((left + right) / 2);
      x = coords[2 * m];
      y = coords[2 * m + 1];
      if (x >= minX && x <= maxX && y >= minY && y <= maxY) result.push(ids[m]);
      const nextAxis = (axis + 1) % 2;

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
    const stack = [0, ids.length - 1, 0];
    const result = [];
    const r2 = r * r;

    while (stack.length) {
      const axis = stack.pop();
      const right = stack.pop();
      const left = stack.pop();

      if (right - left <= nodeSize) {
        for (let i = left; i <= right; i++) {
          if (sqDist(coords[2 * i], coords[2 * i + 1], qx, qy) <= r2) result.push(ids[i]);
        }

        continue;
      }

      const m = Math.floor((left + right) / 2);
      const x = coords[2 * m];
      const y = coords[2 * m + 1];
      if (sqDist(x, y, qx, qy) <= r2) result.push(ids[m]);
      const nextAxis = (axis + 1) % 2;

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
    const dx = ax - bx;
    const dy = ay - by;
    return dx * dx + dy * dy;
  }

  const defaultGetX = p => p[0];

  const defaultGetY = p => p[1];

  class KDBush {
    constructor(points, getX = defaultGetX, getY = defaultGetY, nodeSize = 64, ArrayType = Float64Array) {
      this.nodeSize = nodeSize;
      this.points = points;
      const IndexArrayType = points.length < 65536 ? Uint16Array : Uint32Array;
      const ids = this.ids = new IndexArrayType(points.length);
      const coords = this.coords = new ArrayType(points.length * 2);

      for (let i = 0; i < points.length; i++) {
        ids[i] = i;
        coords[2 * i] = getX(points[i]);
        coords[2 * i + 1] = getY(points[i]);
      }

      sortKD(ids, coords, nodeSize, 0, ids.length - 1, 0);
    }

    range(minX, minY, maxX, maxY) {
      return range(this.ids, this.coords, minX, minY, maxX, maxY, this.nodeSize);
    }

    within(x, y, r) {
      return within(this.ids, this.coords, x, y, r, this.nodeSize);
    }

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
      return Math.max(this.options.minZoom, Math.min(+z, this.options.maxZoom + 1));
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

  var es6 = function equal(a, b) {
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

      if (a instanceof Map && b instanceof Map) {
        if (a.size !== b.size) return false;

        for (i of a.entries()) if (!b.has(i[0])) return false;

        for (i of a.entries()) if (!equal(i[1], b.get(i[0]))) return false;

        return true;
      }

      if (a instanceof Set && b instanceof Set) {
        if (a.size !== b.size) return false;

        for (i of a.entries()) if (!b.has(i[0])) return false;

        return true;
      }

      if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
        length = a.length;
        if (length != b.length) return false;

        for (i = length; i-- !== 0;) if (a[i] !== b[i]) return false;

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

        if (!es6(input.markers, this.markers)) {
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
            changed = changed || !es6(this.state, state);
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
        return this.superCluster.getClusters([-180, -90, 180, 90], map.getZoom()).map(this.transformCluster.bind(this));
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

  // https://tc39.es/ecma262/#sec-object.defineproperties
  // eslint-disable-next-line es/no-object-defineproperties -- safe

  var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject(O);
    var props = toIndexedObject(Properties);
    var keys = objectKeys(Properties);
    var length = keys.length;
    var index = 0;
    var key;

    while (length > index) objectDefineProperty.f(O, key = keys[index++], props[key]);

    return O;
  };

  var html = getBuiltIn('document', 'documentElement');

  /* global ActiveXObject -- old IE, WSH */

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

  hiddenKeys$1[IE_PROTO] = true; // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create

  var objectCreate = Object.create || function create(O, Properties) {
    var result;

    if (O !== null) {
      EmptyConstructor[PROTOTYPE] = anObject(O);
      result = new EmptyConstructor();
      EmptyConstructor[PROTOTYPE] = null; // add "__proto__" for Object.getPrototypeOf polyfill

      result[IE_PROTO] = O;
    } else result = NullProtoObject();

    return Properties === undefined ? result : objectDefineProperties(result, Properties);
  };

  var UNSCOPABLES = wellKnownSymbol('unscopables');
  var ArrayPrototype = Array.prototype; // Array.prototype[@@unscopables]
  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables

  if (ArrayPrototype[UNSCOPABLES] == undefined) {
    objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
      configurable: true,
      value: objectCreate(null)
    });
  } // add a key to Array.prototype[@@unscopables]


  var addToUnscopables = function (key) {
    ArrayPrototype[UNSCOPABLES][key] = true;
  };

  var $includes = arrayIncludes.includes; // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes

  _export({
    target: 'Array',
    proto: true
  }, {
    includes: function includes(el
    /* , fromIndex = 0 */
    ) {
      return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
    }
  }); // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables

  addToUnscopables('includes');

  var MATCH$1 = wellKnownSymbol('match'); // `IsRegExp` abstract operation
  // https://tc39.es/ecma262/#sec-isregexp

  var isRegexp = function (it) {
    var isRegExp;
    return isObject(it) && ((isRegExp = it[MATCH$1]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
  };

  var TypeError$4 = global_1.TypeError;

  var notARegexp = function (it) {
    if (isRegexp(it)) {
      throw TypeError$4("The method doesn't accept regular expressions");
    }

    return it;
  };

  var String$2 = global_1.String;

  var toString_1 = function (argument) {
    if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
    return String$2(argument);
  };

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

  var stringIndexOf = functionUncurryThis(''.indexOf); // `String.prototype.includes` method
  // https://tc39.es/ecma262/#sec-string.prototype.includes

  _export({
    target: 'String',
    proto: true,
    forced: !correctIsRegexpLogic('includes')
  }, {
    includes: function includes(searchString
    /* , position = 0 */
    ) {
      return !!~stringIndexOf(toString_1(requireObjectCoercible(this)), toString_1(notARegexp(searchString)), arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var createProperty = function (object, key, value) {
    var propertyKey = toPropertyKey(key);
    if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
  };

  var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');
  var TypeError$3 = global_1.TypeError;
  var max = Math.max;
  var min = Math.min;
  var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
  var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded'; // `Array.prototype.splice` method
  // https://tc39.es/ecma262/#sec-array.prototype.splice
  // with adding support of @@species

  _export({
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

      if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
        throw TypeError$3(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
      }

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
          if (from in O) O[to] = O[from];else delete O[to];
        }

        for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
      } else if (insertCount > actualDeleteCount) {
        for (k = len - actualDeleteCount; k > actualStart; k--) {
          from = k + actualDeleteCount - 1;
          to = k + insertCount - 1;
          if (from in O) O[to] = O[from];else delete O[to];
        }
      }

      for (k = 0; k < insertCount; k++) {
        O[k + actualStart] = arguments[k + 2];
      }

      O.length = len - actualDeleteCount + insertCount;
      return A;
    }
  });

  var String$1 = global_1.String;
  var TypeError$2 = global_1.TypeError;

  var aPossiblePrototype = function (argument) {
    if (typeof argument == 'object' || isCallable(argument)) return argument;
    throw TypeError$2("Can't set " + String$1(argument) + ' as a prototype');
  };

  /* eslint-disable no-proto -- safe */
  // `Object.setPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.setprototypeof
  // Works with __proto__ only. Old v8 can't work with null proto objects.
  // eslint-disable-next-line es/no-object-setprototypeof -- safe

  var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
    var CORRECT_SETTER = false;
    var test = {};
    var setter;

    try {
      // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
      setter = functionUncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
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

  var inheritIfRequired = function ($this, dummy, Wrapper) {
    var NewTarget, NewTargetPrototype;
    if ( // it can work only with native `setPrototypeOf`
    objectSetPrototypeOf && // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) && NewTarget !== Wrapper && isObject(NewTargetPrototype = NewTarget.prototype) && NewTargetPrototype !== Wrapper.prototype) objectSetPrototypeOf($this, NewTargetPrototype);
    return $this;
  };

  // https://tc39.es/ecma262/#sec-thisnumbervalue

  var thisNumberValue = functionUncurryThis(1.0.valueOf);

  // a string of all valid unicode whitespaces
  var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' + '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

  var replace = functionUncurryThis(''.replace);
  var whitespace = '[' + whitespaces + ']';
  var ltrim = RegExp('^' + whitespace + whitespace + '*');
  var rtrim = RegExp(whitespace + whitespace + '*$'); // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation

  var createMethod = function (TYPE) {
    return function ($this) {
      var string = toString_1(requireObjectCoercible($this));
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

  var getOwnPropertyNames = objectGetOwnPropertyNames.f;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  var defineProperty = objectDefineProperty.f;
  var trim = stringTrim.trim;
  var NUMBER = 'Number';
  var NativeNumber = global_1[NUMBER];
  var NumberPrototype = NativeNumber.prototype;
  var TypeError$1 = global_1.TypeError;
  var arraySlice = functionUncurryThis(''.slice);
  var charCodeAt = functionUncurryThis(''.charCodeAt); // `ToNumeric` abstract operation
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


  if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
    var NumberWrapper = function Number(value) {
      var n = arguments.length < 1 ? 0 : NativeNumber(toNumeric(value));
      var dummy = this; // check on 1..constructor(foo) case

      return objectIsPrototypeOf(NumberPrototype, dummy) && fails(function () {
        thisNumberValue(dummy);
      }) ? inheritIfRequired(Object(n), dummy, NumberWrapper) : n;
    };

    for (var keys = descriptors ? getOwnPropertyNames(NativeNumber) : ( // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' + // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,' + // ESNext
    'fromString,range').split(','), j = 0, key; keys.length > j; j++) {
      if (hasOwnProperty_1(NativeNumber, key = keys[j]) && !hasOwnProperty_1(NumberWrapper, key)) {
        defineProperty(NumberWrapper, key, getOwnPropertyDescriptor(NativeNumber, key));
      }
    }

    NumberWrapper.prototype = NumberPrototype;
    NumberPrototype.constructor = NumberWrapper;
    redefine(global_1, NUMBER, NumberWrapper);
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
  var ClusterStats = function ClusterStats(markers, clusters) {
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
  };
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


  var OverlayViewSafe = function OverlayViewSafe() {
    _classCallCheck(this, OverlayViewSafe);

    // MarkerClusterer implements google.maps.OverlayView interface. We use the
    // extend function to extend MarkerClusterer with google.maps.OverlayView
    // because it might not always be available when the code is defined so we
    // look for it at the last possible moment. If it doesn't exist now then
    // there is no point going ahead :)
    extend(OverlayViewSafe, google.maps.OverlayView);
  };

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
   * <iframe src="https://googlemaps.github.io/js-three/public/anchor/index.html"></iframe>
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
  exports.DBScanAlgorithm = DBScanAlgorithm;
  exports.DefaultRenderer = DefaultRenderer;
  exports.GridAlgorithm = GridAlgorithm;
  exports.KmeansAlgorithm = KmeansAlgorithm;
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
