!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).markerClusterer={})}(this,(function(t){"use strict";function e(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function r(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function n(t,e,n){return e&&r(t.prototype,e),n&&r(t,n),t}function o(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&s(t,e)}function i(t){return(i=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function s(t,e){return(s=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function a(t,e){return!e||"object"!=typeof e&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function u(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=i(t);if(e){var o=i(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return a(this,r)}}function c(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var r=[],n=!0,o=!1,i=void 0;try{for(var s,a=t[Symbol.iterator]();!(n=(s=a.next()).done)&&(r.push(s.value),!e||r.length!==e);n=!0);}catch(t){o=!0,i=t}finally{try{n||null==a.return||a.return()}finally{if(o)throw i}}return r}(t,e)||l(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(t){return function(t){if(Array.isArray(t))return p(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||l(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(t,e){if(t){if("string"==typeof t)return p(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?p(t,e):void 0}}function p(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}var h="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},m=function(t){return t&&t.Math==Math&&t},d=m("object"==typeof globalThis&&globalThis)||m("object"==typeof window&&window)||m("object"==typeof self&&self)||m("object"==typeof h&&h)||function(){return this}()||Function("return this")(),g={},v=function(t){try{return!!t()}catch(t){return!0}},y=!v((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]})),b=!v((function(){var t=function(){}.bind();return"function"!=typeof t||t.hasOwnProperty("prototype")})),w=b,k=Function.prototype.call,O=w?k.bind(k):function(){return k.apply(k,arguments)},S={},x={}.propertyIsEnumerable,M=Object.getOwnPropertyDescriptor,P=M&&!x.call({1:2},1);S.f=P?function(t){var e=M(this,t);return!!e&&e.enumerable}:x;var E,j,C=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}},_=b,L=Function.prototype,T=L.bind,I=L.call,A=_&&T.bind(I,I),N=_?function(t){return t&&A(t)}:function(t){return t&&function(){return I.apply(t,arguments)}},z=N,R=z({}.toString),F=z("".slice),Z=function(t){return F(R(t),8,-1)},D=N,G=v,V=Z,B=d.Object,U=D("".split),W=G((function(){return!B("z").propertyIsEnumerable(0)}))?function(t){return"String"==V(t)?U(t,""):B(t)}:B,q=d.TypeError,X=function(t){if(null==t)throw q("Can't call method on "+t);return t},H=W,$=X,J=function(t){return H($(t))},K=function(t){return"function"==typeof t},Y=K,Q=function(t){return"object"==typeof t?null!==t:Y(t)},tt=d,et=K,rt=function(t){return et(t)?t:void 0},nt=function(t,e){return arguments.length<2?rt(tt[t]):tt[t]&&tt[t][e]},ot=N({}.isPrototypeOf),it=d,st=nt("navigator","userAgent")||"",at=it.process,ut=it.Deno,ct=at&&at.versions||ut&&ut.version,ft=ct&&ct.v8;ft&&(j=(E=ft.split("."))[0]>0&&E[0]<4?1:+(E[0]+E[1])),!j&&st&&(!(E=st.match(/Edge\/(\d+)/))||E[1]>=74)&&(E=st.match(/Chrome\/(\d+)/))&&(j=+E[1]);var lt=j,pt=lt,ht=v,mt=!!Object.getOwnPropertySymbols&&!ht((function(){var t=Symbol();return!String(t)||!(Object(t)instanceof Symbol)||!Symbol.sham&&pt&&pt<41})),dt=mt&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,gt=nt,vt=K,yt=ot,bt=dt,wt=d.Object,kt=bt?function(t){return"symbol"==typeof t}:function(t){var e=gt("Symbol");return vt(e)&&yt(e.prototype,wt(t))},Ot=d.String,St=K,xt=function(t){try{return Ot(t)}catch(t){return"Object"}},Mt=d.TypeError,Pt=function(t){if(St(t))return t;throw Mt(xt(t)+" is not a function")},Et=Pt,jt=O,Ct=K,_t=Q,Lt=d.TypeError,Tt={exports:{}},It=d,At=Object.defineProperty,Nt=function(t,e){try{At(It,t,{value:e,configurable:!0,writable:!0})}catch(r){It[t]=e}return e},zt=Nt,Rt="__core-js_shared__",Ft=d[Rt]||zt(Rt,{}),Zt=Ft;(Tt.exports=function(t,e){return Zt[t]||(Zt[t]=void 0!==e?e:{})})("versions",[]).push({version:"3.22.5",mode:"global",copyright:"© 2014-2022 Denis Pushkarev (zloirock.ru)",license:"https://github.com/zloirock/core-js/blob/v3.22.5/LICENSE",source:"https://github.com/zloirock/core-js"});var Dt=X,Gt=d.Object,Vt=function(t){return Gt(Dt(t))},Bt=Vt,Ut=N({}.hasOwnProperty),Wt=Object.hasOwn||function(t,e){return Ut(Bt(t),e)},qt=N,Xt=0,Ht=Math.random(),$t=qt(1..toString),Jt=function(t){return"Symbol("+(void 0===t?"":t)+")_"+$t(++Xt+Ht,36)},Kt=d,Yt=Tt.exports,Qt=Wt,te=Jt,ee=mt,re=dt,ne=Yt("wks"),oe=Kt.Symbol,ie=oe&&oe.for,se=re?oe:oe&&oe.withoutSetter||te,ae=function(t){if(!Qt(ne,t)||!ee&&"string"!=typeof ne[t]){var e="Symbol."+t;ee&&Qt(oe,t)?ne[t]=oe[t]:ne[t]=re&&ie?ie(e):se(e)}return ne[t]},ue=O,ce=Q,fe=kt,le=function(t,e){var r=t[e];return null==r?void 0:Et(r)},pe=function(t,e){var r,n;if("string"===e&&Ct(r=t.toString)&&!_t(n=jt(r,t)))return n;if(Ct(r=t.valueOf)&&!_t(n=jt(r,t)))return n;if("string"!==e&&Ct(r=t.toString)&&!_t(n=jt(r,t)))return n;throw Lt("Can't convert object to primitive value")},he=ae,me=d.TypeError,de=he("toPrimitive"),ge=function(t,e){if(!ce(t)||fe(t))return t;var r,n=le(t,de);if(n){if(void 0===e&&(e="default"),r=ue(n,t,e),!ce(r)||fe(r))return r;throw me("Can't convert object to primitive value")}return void 0===e&&(e="number"),pe(t,e)},ve=ge,ye=kt,be=function(t){var e=ve(t,"string");return ye(e)?e:e+""},we=Q,ke=d.document,Oe=we(ke)&&we(ke.createElement),Se=function(t){return Oe?ke.createElement(t):{}},xe=Se,Me=!y&&!v((function(){return 7!=Object.defineProperty(xe("div"),"a",{get:function(){return 7}}).a})),Pe=y,Ee=O,je=S,Ce=C,_e=J,Le=be,Te=Wt,Ie=Me,Ae=Object.getOwnPropertyDescriptor;g.f=Pe?Ae:function(t,e){if(t=_e(t),e=Le(e),Ie)try{return Ae(t,e)}catch(t){}if(Te(t,e))return Ce(!Ee(je.f,t,e),t[e])};var Ne={},ze=y&&v((function(){return 42!=Object.defineProperty((function(){}),"prototype",{value:42,writable:!1}).prototype})),Re=d,Fe=Q,Ze=Re.String,De=Re.TypeError,Ge=function(t){if(Fe(t))return t;throw De(Ze(t)+" is not an object")},Ve=y,Be=Me,Ue=ze,We=Ge,qe=be,Xe=d.TypeError,He=Object.defineProperty,$e=Object.getOwnPropertyDescriptor,Je="enumerable",Ke="configurable",Ye="writable";Ne.f=Ve?Ue?function(t,e,r){if(We(t),e=qe(e),We(r),"function"==typeof t&&"prototype"===e&&"value"in r&&Ye in r&&!r.writable){var n=$e(t,e);n&&n.writable&&(t[e]=r.value,r={configurable:Ke in r?r.configurable:n.configurable,enumerable:Je in r?r.enumerable:n.enumerable,writable:!1})}return He(t,e,r)}:He:function(t,e,r){if(We(t),e=qe(e),We(r),Be)try{return He(t,e,r)}catch(t){}if("get"in r||"set"in r)throw Xe("Accessors not supported");return"value"in r&&(t[e]=r.value),t};var Qe=Ne,tr=C,er=y?function(t,e,r){return Qe.f(t,e,tr(1,r))}:function(t,e,r){return t[e]=r,t},rr={exports:{}},nr=y,or=Wt,ir=Function.prototype,sr=nr&&Object.getOwnPropertyDescriptor,ar=or(ir,"name"),ur={EXISTS:ar,PROPER:ar&&"something"===function(){}.name,CONFIGURABLE:ar&&(!nr||nr&&sr(ir,"name").configurable)},cr=K,fr=Ft,lr=N(Function.toString);cr(fr.inspectSource)||(fr.inspectSource=function(t){return lr(t)});var pr,hr,mr,dr=fr.inspectSource,gr=K,vr=dr,yr=d.WeakMap,br=gr(yr)&&/native code/.test(vr(yr)),wr=Tt.exports,kr=Jt,Or=wr("keys"),Sr=function(t){return Or[t]||(Or[t]=kr(t))},xr={},Mr=br,Pr=d,Er=N,jr=Q,Cr=er,_r=Wt,Lr=Ft,Tr=Sr,Ir=xr,Ar="Object already initialized",Nr=Pr.TypeError,zr=Pr.WeakMap;if(Mr||Lr.state){var Rr=Lr.state||(Lr.state=new zr),Fr=Er(Rr.get),Zr=Er(Rr.has),Dr=Er(Rr.set);pr=function(t,e){if(Zr(Rr,t))throw new Nr(Ar);return e.facade=t,Dr(Rr,t,e),e},hr=function(t){return Fr(Rr,t)||{}},mr=function(t){return Zr(Rr,t)}}else{var Gr=Tr("state");Ir[Gr]=!0,pr=function(t,e){if(_r(t,Gr))throw new Nr(Ar);return e.facade=t,Cr(t,Gr,e),e},hr=function(t){return _r(t,Gr)?t[Gr]:{}},mr=function(t){return _r(t,Gr)}}var Vr={set:pr,get:hr,has:mr,enforce:function(t){return mr(t)?hr(t):pr(t,{})},getterFor:function(t){return function(e){var r;if(!jr(e)||(r=hr(e)).type!==t)throw Nr("Incompatible receiver, "+t+" required");return r}}},Br=v,Ur=K,Wr=Wt,qr=y,Xr=ur.CONFIGURABLE,Hr=dr,$r=Vr.enforce,Jr=Vr.get,Kr=Object.defineProperty,Yr=qr&&!Br((function(){return 8!==Kr((function(){}),"length",{value:8}).length})),Qr=String(String).split("String"),tn=rr.exports=function(t,e,r){if("Symbol("===String(e).slice(0,7)&&(e="["+String(e).replace(/^Symbol\(([^)]*)\)/,"$1")+"]"),r&&r.getter&&(e="get "+e),r&&r.setter&&(e="set "+e),(!Wr(t,"name")||Xr&&t.name!==e)&&Kr(t,"name",{value:e,configurable:!0}),Yr&&r&&Wr(r,"arity")&&t.length!==r.arity&&Kr(t,"length",{value:r.arity}),r&&Wr(r,"constructor")&&r.constructor){if(qr)try{Kr(t,"prototype",{writable:!1})}catch(t){}}else t.prototype=void 0;var n=$r(t);return Wr(n,"source")||(n.source=Qr.join("string"==typeof e?e:"")),t};Function.prototype.toString=tn((function(){return Ur(this)&&Jr(this).source||Hr(this)}),"toString");var en=d,rn=K,nn=er,on=rr.exports,sn=Nt,an=function(t,e,r,n){var o=!!n&&!!n.unsafe,i=!!n&&!!n.enumerable,s=!!n&&!!n.noTargetGet,a=n&&void 0!==n.name?n.name:e;return rn(r)&&on(r,a,n),t===en?(i?t[e]=r:sn(e,r),t):(o?!s&&t[e]&&(i=!0):delete t[e],i?t[e]=r:nn(t,e,r),t)},un={},cn=Math.ceil,fn=Math.floor,ln=function(t){var e=+t;return e!=e||0===e?0:(e>0?fn:cn)(e)},pn=ln,hn=Math.max,mn=Math.min,dn=function(t,e){var r=pn(t);return r<0?hn(r+e,0):mn(r,e)},gn=ln,vn=Math.min,yn=function(t){return t>0?vn(gn(t),9007199254740991):0},bn=function(t){return yn(t.length)},wn=J,kn=dn,On=bn,Sn=function(t){return function(e,r,n){var o,i=wn(e),s=On(i),a=kn(n,s);if(t&&r!=r){for(;s>a;)if((o=i[a++])!=o)return!0}else for(;s>a;a++)if((t||a in i)&&i[a]===r)return t||a||0;return!t&&-1}},xn={includes:Sn(!0),indexOf:Sn(!1)},Mn=Wt,Pn=J,En=xn.indexOf,jn=xr,Cn=N([].push),_n=function(t,e){var r,n=Pn(t),o=0,i=[];for(r in n)!Mn(jn,r)&&Mn(n,r)&&Cn(i,r);for(;e.length>o;)Mn(n,r=e[o++])&&(~En(i,r)||Cn(i,r));return i},Ln=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],Tn=_n,In=Ln.concat("length","prototype");un.f=Object.getOwnPropertyNames||function(t){return Tn(t,In)};var An={};An.f=Object.getOwnPropertySymbols;var Nn=nt,zn=un,Rn=An,Fn=Ge,Zn=N([].concat),Dn=Nn("Reflect","ownKeys")||function(t){var e=zn.f(Fn(t)),r=Rn.f;return r?Zn(e,r(t)):e},Gn=Wt,Vn=Dn,Bn=g,Un=Ne,Wn=v,qn=K,Xn=/#|\.prototype\./,Hn=function(t,e){var r=Jn[$n(t)];return r==Yn||r!=Kn&&(qn(e)?Wn(e):!!e)},$n=Hn.normalize=function(t){return String(t).replace(Xn,".").toLowerCase()},Jn=Hn.data={},Kn=Hn.NATIVE="N",Yn=Hn.POLYFILL="P",Qn=Hn,to=d,eo=g.f,ro=er,no=an,oo=Nt,io=function(t,e,r){for(var n=Vn(e),o=Un.f,i=Bn.f,s=0;s<n.length;s++){var a=n[s];Gn(t,a)||r&&Gn(r,a)||o(t,a,i(e,a))}},so=Qn,ao=function(t,e){var r,n,o,i,s,a=t.target,u=t.global,c=t.stat;if(r=u?to:c?to[a]||oo(a,{}):(to[a]||{}).prototype)for(n in e){if(i=e[n],o=t.noTargetGet?(s=eo(r,n))&&s.value:r[n],!so(u?n:a+(c?".":"#")+n,t.forced)&&void 0!==o){if(typeof i==typeof o)continue;io(i,o)}(t.sham||o&&o.sham)&&ro(i,"sham",!0),no(r,n,i,t)}},uo=Pt,co=b,fo=N(N.bind),lo=Z,po=Array.isArray||function(t){return"Array"==lo(t)},ho={};ho[ae("toStringTag")]="z";var mo="[object z]"===String(ho),go=d,vo=mo,yo=K,bo=Z,wo=ae("toStringTag"),ko=go.Object,Oo="Arguments"==bo(function(){return arguments}()),So=vo?bo:function(t){var e,r,n;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(r=function(t,e){try{return t[e]}catch(t){}}(e=ko(t),wo))?r:Oo?bo(e):"Object"==(n=bo(e))&&yo(e.callee)?"Arguments":n},xo=N,Mo=v,Po=K,Eo=So,jo=dr,Co=function(){},_o=[],Lo=nt("Reflect","construct"),To=/^\s*(?:class|function)\b/,Io=xo(To.exec),Ao=!To.exec(Co),No=function(t){if(!Po(t))return!1;try{return Lo(Co,_o,t),!0}catch(t){return!1}},zo=function(t){if(!Po(t))return!1;switch(Eo(t)){case"AsyncFunction":case"GeneratorFunction":case"AsyncGeneratorFunction":return!1}try{return Ao||!!Io(To,jo(t))}catch(t){return!0}};zo.sham=!0;var Ro=!Lo||Mo((function(){var t;return No(No.call)||!No(Object)||!No((function(){t=!0}))||t}))?zo:No,Fo=d,Zo=po,Do=Ro,Go=Q,Vo=ae("species"),Bo=Fo.Array,Uo=function(t){var e;return Zo(t)&&(e=t.constructor,(Do(e)&&(e===Bo||Zo(e.prototype))||Go(e)&&null===(e=e[Vo]))&&(e=void 0)),void 0===e?Bo:e},Wo=function(t,e){return new(Uo(t))(0===e?0:e)},qo=function(t,e){return uo(t),void 0===e?t:co?fo(t,e):function(){return t.apply(e,arguments)}},Xo=W,Ho=Vt,$o=bn,Jo=Wo,Ko=N([].push),Yo=function(t){var e=1==t,r=2==t,n=3==t,o=4==t,i=6==t,s=7==t,a=5==t||i;return function(u,c,f,l){for(var p,h,m=Ho(u),d=Xo(m),g=qo(c,f),v=$o(d),y=0,b=l||Jo,w=e?b(u,v):r||s?b(u,0):void 0;v>y;y++)if((a||y in d)&&(h=g(p=d[y],y,m),t))if(e)w[y]=h;else if(h)switch(t){case 3:return!0;case 5:return p;case 6:return y;case 2:Ko(w,p)}else switch(t){case 4:return!1;case 7:Ko(w,p)}return i?-1:n||o?o:w}},Qo={forEach:Yo(0),map:Yo(1),filter:Yo(2),some:Yo(3),every:Yo(4),find:Yo(5),findIndex:Yo(6),filterReject:Yo(7)},ti=v,ei=lt,ri=ae("species"),ni=function(t){return ei>=51||!ti((function(){var e=[];return(e.constructor={})[ri]=function(){return{foo:1}},1!==e[t](Boolean).foo}))},oi=Qo.map;function ii(t,e){var r={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.indexOf(n)<0&&(r[n]=t[n]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(t);o<n.length;o++)e.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(t,n[o])&&(r[n[o]]=t[n[o]])}return r}ao({target:"Array",proto:!0,forced:!ni("map")},{map:function(t){return oi(this,t,arguments.length>1?arguments[1]:void 0)}});var si=Pt,ai=Vt,ui=W,ci=bn,fi=d.TypeError,li=function(t){return function(e,r,n,o){si(r);var i=ai(e),s=ui(i),a=ci(i),u=t?a-1:0,c=t?-1:1;if(n<2)for(;;){if(u in s){o=s[u],u+=c;break}if(u+=c,t?u<0:a<=u)throw fi("Reduce of empty array with no initial value")}for(;t?u>=0:a>u;u+=c)u in s&&(o=r(o,s[u],u,i));return o}},pi={left:li(!1),right:li(!0)},hi=v,mi=function(t,e){var r=[][t];return!!r&&hi((function(){r.call(null,e||function(){return 1},1)}))},di="process"==Z(d.process),gi=pi.left,vi=lt,yi=di;ao({target:"Array",proto:!0,forced:!mi("reduce")||!yi&&vi>79&&vi<83},{reduce:function(t){var e=arguments.length;return gi(this,t,e,e>1?arguments[1]:void 0)}});var bi=So,wi=mo?{}.toString:function(){return"[object "+bi(this)+"]"};mo||an(Object.prototype,"toString",wi,{unsafe:!0});var ki=Qo.filter;ao({target:"Array",proto:!0,forced:!ni("filter")},{filter:function(t){return ki(this,t,arguments.length>1?arguments[1]:void 0)}});var Oi=function(){function t(r){var n=r.markers,o=r.position;e(this,t),this.markers=n,o&&(o instanceof google.maps.LatLng?this._position=o:this._position=new google.maps.LatLng(o))}return n(t,[{key:"bounds",get:function(){if(0!==this.markers.length||this._position)return this.markers.reduce((function(t,e){return t.extend(e.getPosition())}),new google.maps.LatLngBounds(this._position,this._position))}},{key:"position",get:function(){return this._position||this.bounds.getCenter()}},{key:"count",get:function(){return this.markers.filter((function(t){return t.getVisible()})).length}},{key:"push",value:function(t){this.markers.push(t)}},{key:"delete",value:function(){this.marker&&(this.marker.setMap(null),delete this.marker),this.markers.length=0}}]),t}(),Si=function(t,e,r,n){var o=xi(t.getBounds(),e,n);return r.filter((function(t){return o.contains(t.getPosition())}))},xi=function(t,e,r){var n=Pi(t,e),o=n.northEast,i=n.southWest,s=Ei({northEast:o,southWest:i},r);return ji(s,e)},Mi=function(t,e){var r=(e.lat-t.lat)*Math.PI/180,n=(e.lng-t.lng)*Math.PI/180,o=Math.sin(r/2)*Math.sin(r/2)+Math.cos(t.lat*Math.PI/180)*Math.cos(e.lat*Math.PI/180)*Math.sin(n/2)*Math.sin(n/2);return 6371*(2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o)))},Pi=function(t,e){return{northEast:e.fromLatLngToDivPixel(t.getNorthEast()),southWest:e.fromLatLngToDivPixel(t.getSouthWest())}},Ei=function(t,e){var r=t.northEast,n=t.southWest;return r.x+=e,r.y-=e,n.x-=e,n.y+=e,{northEast:r,southWest:n}},ji=function(t,e){var r=t.northEast,n=t.southWest,o=new google.maps.LatLngBounds;return o.extend(e.fromDivPixelToLatLng(r)),o.extend(e.fromDivPixelToLatLng(n)),o},Ci=function(){function t(r){var n=r.maxZoom,o=void 0===n?16:n;e(this,t),this.maxZoom=o}return n(t,[{key:"noop",value:function(t){var e=t.markers;return Li(e)}}]),t}(),_i=function(t){o(i,t);var r=u(i);function i(t){var n;e(this,i);var o=t.viewportPadding,s=void 0===o?60:o,a=ii(t,["viewportPadding"]);return(n=r.call(this,a)).viewportPadding=60,n.viewportPadding=s,n}return n(i,[{key:"calculate",value:function(t){var e=t.markers,r=t.map,n=t.mapCanvasProjection;return r.getZoom()>=this.maxZoom?{clusters:this.noop({markers:e,map:r,mapCanvasProjection:n}),changed:!1}:{clusters:this.cluster({markers:Si(r,n,e,this.viewportPadding),map:r,mapCanvasProjection:n})}}}]),i}(Ci),Li=function(t){return t.map((function(t){return new Oi({position:t.getPosition(),markers:[t]})}))},Ti=Se("span").classList,Ii=Ti&&Ti.constructor&&Ti.constructor.prototype,Ai=Ii===Object.prototype?void 0:Ii,Ni=Qo.forEach,zi=d,Ri={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0},Fi=Ai,Zi=mi("forEach")?[].forEach:function(t){return Ni(this,t,arguments.length>1?arguments[1]:void 0)},Di=er,Gi=function(t){if(t&&t.forEach!==Zi)try{Di(t,"forEach",Zi)}catch(e){t.forEach=Zi}};for(var Vi in Ri)Ri[Vi]&&Gi(zi[Vi]&&zi[Vi].prototype);Gi(Fi);var Bi=O;ao({target:"URL",proto:!0,enumerable:!0},{toJSON:function(){return Bi(URL.prototype.toString,this)}});var Ui=function(t){o(i,t);var r=u(i);function i(t){var n;e(this,i);var o=t.maxDistance,s=void 0===o?4e4:o,a=t.gridSize,u=void 0===a?40:a,c=ii(t,["maxDistance","gridSize"]);return(n=r.call(this,c)).clusters=[],n.maxDistance=s,n.gridSize=u,n}return n(i,[{key:"cluster",value:function(t){var e=this,r=t.markers,n=t.map,o=t.mapCanvasProjection;return this.clusters=[],r.forEach((function(t){e.addToClosestCluster(t,n,o)})),this.clusters}},{key:"addToClosestCluster",value:function(t,e,r){for(var n=this.maxDistance,o=null,i=0;i<this.clusters.length;i++){var s=this.clusters[i],a=Mi(s.bounds.getCenter().toJSON(),t.getPosition().toJSON());a<n&&(n=a,o=s)}if(o&&xi(o.bounds,r,this.gridSize).contains(t.getPosition()))o.push(t);else{var u=new Oi({markers:[t]});this.clusters.push(u)}}}]),i}(_i),Wi=function(t){o(i,t);var r=u(i);function i(t){e(this,i);var n=ii(t,[]);return r.call(this,n)}return n(i,[{key:"calculate",value:function(t){var e=t.markers,r=t.map,n=t.mapCanvasProjection;return{clusters:this.cluster({markers:e,map:r,mapCanvasProjection:n}),changed:!1}}},{key:"cluster",value:function(t){return this.noop(t)}}]),i}(Ci),qi=_n,Xi=Ln,Hi=Object.keys||function(t){return qi(t,Xi)},$i=y,Ji=N,Ki=O,Yi=v,Qi=Hi,ts=An,es=S,rs=Vt,ns=W,os=Object.assign,is=Object.defineProperty,ss=Ji([].concat),as=!os||Yi((function(){if($i&&1!==os({b:1},os(is({},"a",{enumerable:!0,get:function(){is(this,"b",{value:3,enumerable:!1})}}),{b:2})).b)return!0;var t={},e={},r=Symbol(),n="abcdefghijklmnopqrst";return t[r]=7,n.split("").forEach((function(t){e[t]=t})),7!=os({},t)[r]||Qi(os({},e)).join("")!=n}))?function(t,e){for(var r=rs(t),n=arguments.length,o=1,i=ts.f,s=es.f;n>o;)for(var a,u=ns(arguments[o++]),c=i?ss(Qi(u),i(u)):Qi(u),f=c.length,l=0;f>l;)a=c[l++],$i&&!Ki(s,u,a)||(r[a]=u[a]);return r}:os;ao({target:"Object",stat:!0,arity:2,forced:Object.assign!==as},{assign:as});var us={exports:{}};!function(t,e){t.exports=function(){function t(r,n,o,i,s,a){if(!(s-i<=o)){var u=i+s>>1;e(r,n,u,i,s,a%2),t(r,n,o,i,u-1,a+1),t(r,n,o,u+1,s,a+1)}}function e(t,n,o,i,s,a){for(;s>i;){if(s-i>600){var u=s-i+1,c=o-i+1,f=Math.log(u),l=.5*Math.exp(2*f/3),p=.5*Math.sqrt(f*l*(u-l)/u)*(c-u/2<0?-1:1);e(t,n,o,Math.max(i,Math.floor(o-c*l/u+p)),Math.min(s,Math.floor(o+(u-c)*l/u+p)),a)}var h=n[2*o+a],m=i,d=s;for(r(t,n,i,o),n[2*s+a]>h&&r(t,n,i,s);m<d;){for(r(t,n,m,d),m++,d--;n[2*m+a]<h;)m++;for(;n[2*d+a]>h;)d--}n[2*i+a]===h?r(t,n,i,d):r(t,n,++d,s),d<=o&&(i=d+1),o<=d&&(s=d-1)}}function r(t,e,r,o){n(t,r,o),n(e,2*r,2*o),n(e,2*r+1,2*o+1)}function n(t,e,r){var n=t[e];t[e]=t[r],t[r]=n}function o(t,e,r,n,o,i,s){for(var a,u,c=[0,t.length-1,0],f=[];c.length;){var l=c.pop(),p=c.pop(),h=c.pop();if(p-h<=s)for(var m=h;m<=p;m++)a=e[2*m],u=e[2*m+1],a>=r&&a<=o&&u>=n&&u<=i&&f.push(t[m]);else{var d=Math.floor((h+p)/2);a=e[2*d],u=e[2*d+1],a>=r&&a<=o&&u>=n&&u<=i&&f.push(t[d]);var g=(l+1)%2;(0===l?r<=a:n<=u)&&(c.push(h),c.push(d-1),c.push(g)),(0===l?o>=a:i>=u)&&(c.push(d+1),c.push(p),c.push(g))}}return f}function i(t,e,r,n,o,i){for(var a=[0,t.length-1,0],u=[],c=o*o;a.length;){var f=a.pop(),l=a.pop(),p=a.pop();if(l-p<=i)for(var h=p;h<=l;h++)s(e[2*h],e[2*h+1],r,n)<=c&&u.push(t[h]);else{var m=Math.floor((p+l)/2),d=e[2*m],g=e[2*m+1];s(d,g,r,n)<=c&&u.push(t[m]);var v=(f+1)%2;(0===f?r-o<=d:n-o<=g)&&(a.push(p),a.push(m-1),a.push(v)),(0===f?r+o>=d:n+o>=g)&&(a.push(m+1),a.push(l),a.push(v))}}return u}function s(t,e,r,n){var o=t-r,i=e-n;return o*o+i*i}var a=function(t){return t[0]},u=function(t){return t[1]},c=function(e,r,n,o,i){void 0===r&&(r=a),void 0===n&&(n=u),void 0===o&&(o=64),void 0===i&&(i=Float64Array),this.nodeSize=o,this.points=e;for(var s=e.length<65536?Uint16Array:Uint32Array,c=this.ids=new s(e.length),f=this.coords=new i(2*e.length),l=0;l<e.length;l++)c[l]=l,f[2*l]=r(e[l]),f[2*l+1]=n(e[l]);t(c,f,o,0,c.length-1,0)};return c.prototype.range=function(t,e,r,n){return o(this.ids,this.coords,t,e,r,n,this.nodeSize)},c.prototype.within=function(t,e,r){return i(this.ids,this.coords,t,e,r,this.nodeSize)},c}()}(us);var cs=us.exports;const fs={minZoom:0,maxZoom:16,minPoints:2,radius:40,extent:512,nodeSize:64,log:!1,generateId:!1,reduce:null,map:t=>t},ls=Math.fround||(ps=new Float32Array(1),t=>(ps[0]=+t,ps[0]));var ps;class hs{constructor(t){this.options=ks(Object.create(fs),t),this.trees=new Array(this.options.maxZoom+1)}load(t){const{log:e,minZoom:r,maxZoom:n,nodeSize:o}=this.options;e&&console.time("total time");const i=`prepare ${t.length} points`;e&&console.time(i),this.points=t;let s=[];for(let e=0;e<t.length;e++)t[e].geometry&&s.push(ds(t[e],e));this.trees[n+1]=new cs(s,Os,Ss,o,Float32Array),e&&console.timeEnd(i);for(let t=n;t>=r;t--){const r=+Date.now();s=this._cluster(s,t),this.trees[t]=new cs(s,Os,Ss,o,Float32Array),e&&console.log("z%d: %d clusters in %dms",t,s.length,+Date.now()-r)}return e&&console.timeEnd("total time"),this}getClusters(t,e){let r=((t[0]+180)%360+360)%360-180;const n=Math.max(-90,Math.min(90,t[1]));let o=180===t[2]?180:((t[2]+180)%360+360)%360-180;const i=Math.max(-90,Math.min(90,t[3]));if(t[2]-t[0]>=360)r=-180,o=180;else if(r>o){const t=this.getClusters([r,n,180,i],e),s=this.getClusters([-180,n,o,i],e);return t.concat(s)}const s=this.trees[this._limitZoom(e)],a=s.range(ys(r),bs(i),ys(o),bs(n)),u=[];for(const t of a){const e=s.points[t];u.push(e.numPoints?gs(e):this.points[e.index])}return u}getChildren(t){const e=this._getOriginId(t),r=this._getOriginZoom(t),n="No cluster with the specified id.",o=this.trees[r];if(!o)throw new Error(n);const i=o.points[e];if(!i)throw new Error(n);const s=this.options.radius/(this.options.extent*Math.pow(2,r-1)),a=o.within(i.x,i.y,s),u=[];for(const e of a){const r=o.points[e];r.parentId===t&&u.push(r.numPoints?gs(r):this.points[r.index])}if(0===u.length)throw new Error(n);return u}getLeaves(t,e,r){e=e||10,r=r||0;const n=[];return this._appendLeaves(n,t,e,r,0),n}getTile(t,e,r){const n=this.trees[this._limitZoom(t)],o=Math.pow(2,t),{extent:i,radius:s}=this.options,a=s/i,u=(r-a)/o,c=(r+1+a)/o,f={features:[]};return this._addTileFeatures(n.range((e-a)/o,u,(e+1+a)/o,c),n.points,e,r,o,f),0===e&&this._addTileFeatures(n.range(1-a/o,u,1,c),n.points,o,r,o,f),e===o-1&&this._addTileFeatures(n.range(0,u,a/o,c),n.points,-1,r,o,f),f.features.length?f:null}getClusterExpansionZoom(t){let e=this._getOriginZoom(t)-1;for(;e<=this.options.maxZoom;){const r=this.getChildren(t);if(e++,1!==r.length)break;t=r[0].properties.cluster_id}return e}_appendLeaves(t,e,r,n,o){const i=this.getChildren(e);for(const e of i){const i=e.properties;if(i&&i.cluster?o+i.point_count<=n?o+=i.point_count:o=this._appendLeaves(t,i.cluster_id,r,n,o):o<n?o++:t.push(e),t.length===r)break}return o}_addTileFeatures(t,e,r,n,o,i){for(const s of t){const t=e[s],a=t.numPoints;let u,c,f;if(a)u=vs(t),c=t.x,f=t.y;else{const e=this.points[t.index];u=e.properties,c=ys(e.geometry.coordinates[0]),f=bs(e.geometry.coordinates[1])}const l={type:1,geometry:[[Math.round(this.options.extent*(c*o-r)),Math.round(this.options.extent*(f*o-n))]],tags:u};let p;a?p=t.id:this.options.generateId?p=t.index:this.points[t.index].id&&(p=this.points[t.index].id),void 0!==p&&(l.id=p),i.features.push(l)}}_limitZoom(t){return Math.max(this.options.minZoom,Math.min(Math.floor(+t),this.options.maxZoom+1))}_cluster(t,e){const r=[],{radius:n,extent:o,reduce:i,minPoints:s}=this.options,a=n/(o*Math.pow(2,e));for(let n=0;n<t.length;n++){const o=t[n];if(o.zoom<=e)continue;o.zoom=e;const u=this.trees[e+1],c=u.within(o.x,o.y,a),f=o.numPoints||1;let l=f;for(const t of c){const r=u.points[t];r.zoom>e&&(l+=r.numPoints||1)}if(l>f&&l>=s){let t=o.x*f,s=o.y*f,a=i&&f>1?this._map(o,!0):null;const p=(n<<5)+(e+1)+this.points.length;for(const r of c){const n=u.points[r];if(n.zoom<=e)continue;n.zoom=e;const c=n.numPoints||1;t+=n.x*c,s+=n.y*c,n.parentId=p,i&&(a||(a=this._map(o,!0)),i(a,this._map(n)))}o.parentId=p,r.push(ms(t/l,s/l,p,l,a))}else if(r.push(o),l>1)for(const t of c){const n=u.points[t];n.zoom<=e||(n.zoom=e,r.push(n))}}return r}_getOriginId(t){return t-this.points.length>>5}_getOriginZoom(t){return(t-this.points.length)%32}_map(t,e){if(t.numPoints)return e?ks({},t.properties):t.properties;const r=this.points[t.index].properties,n=this.options.map(r);return e&&n===r?ks({},n):n}}function ms(t,e,r,n,o){return{x:ls(t),y:ls(e),zoom:1/0,id:r,parentId:-1,numPoints:n,properties:o}}function ds(t,e){const[r,n]=t.geometry.coordinates;return{x:ls(ys(r)),y:ls(bs(n)),zoom:1/0,index:e,parentId:-1}}function gs(t){return{type:"Feature",id:t.id,properties:vs(t),geometry:{type:"Point",coordinates:[(e=t.x,360*(e-.5)),ws(t.y)]}};var e}function vs(t){const e=t.numPoints,r=e>=1e4?Math.round(e/1e3)+"k":e>=1e3?Math.round(e/100)/10+"k":e;return ks(ks({},t.properties),{cluster:!0,cluster_id:t.id,point_count:e,point_count_abbreviated:r})}function ys(t){return t/360+.5}function bs(t){const e=Math.sin(t*Math.PI/180),r=.5-.25*Math.log((1+e)/(1-e))/Math.PI;return r<0?0:r>1?1:r}function ws(t){const e=(180-360*t)*Math.PI/180;return 360*Math.atan(Math.exp(e))/Math.PI-90}function ks(t,e){for(const r in e)t[r]=e[r];return t}function Os(t){return t.x}function Ss(t){return t.y}var xs=function t(e,r){if(e===r)return!0;if(e&&r&&"object"==typeof e&&"object"==typeof r){if(e.constructor!==r.constructor)return!1;var n,o,i;if(Array.isArray(e)){if((n=e.length)!=r.length)return!1;for(o=n;0!=o--;)if(!t(e[o],r[o]))return!1;return!0}if(e.constructor===RegExp)return e.source===r.source&&e.flags===r.flags;if(e.valueOf!==Object.prototype.valueOf)return e.valueOf()===r.valueOf();if(e.toString!==Object.prototype.toString)return e.toString()===r.toString();if((n=(i=Object.keys(e)).length)!==Object.keys(r).length)return!1;for(o=n;0!=o--;)if(!Object.prototype.hasOwnProperty.call(r,i[o]))return!1;for(o=n;0!=o--;){var s=i[o];if(!t(e[s],r[s]))return!1}return!0}return e!=e&&r!=r},Ms=function(t){o(i,t);var r=u(i);function i(t){var n;e(this,i);var o=t.maxZoom,s=t.radius,a=void 0===s?60:s,u=ii(t,["maxZoom","radius"]);return(n=r.call(this,{maxZoom:o})).superCluster=new hs(Object.assign({maxZoom:n.maxZoom,radius:a},u)),n.state={zoom:null},n}return n(i,[{key:"calculate",value:function(t){var e=!1;if(!xs(t.markers,this.markers)){e=!0,this.markers=f(t.markers);var r=this.markers.map((function(t){return{type:"Feature",geometry:{type:"Point",coordinates:[t.getPosition().lng(),t.getPosition().lat()]},properties:{marker:t}}}));this.superCluster.load(r)}var n={zoom:t.map.getZoom()};return e||this.state.zoom>this.maxZoom&&n.zoom>this.maxZoom||(e=e||!xs(this.state,n)),this.state=n,e&&(this.clusters=this.cluster(t)),{clusters:this.clusters,changed:e}}},{key:"cluster",value:function(t){var e=t.map;return this.superCluster.getClusters([-180,-90,180,90],Math.round(e.getZoom())).map(this.transformCluster.bind(this))}},{key:"transformCluster",value:function(t){var e=c(t.geometry.coordinates,2),r=e[0],n=e[1],o=t.properties;if(o.cluster)return new Oi({markers:this.superCluster.getLeaves(o.cluster_id,1/0).map((function(t){return t.properties.marker})),position:new google.maps.LatLng({lat:n,lng:r})});var i=o.marker;return new Oi({markers:[i],position:i.getPosition()})}}]),i}(Ci),Ps={},Es=y,js=ze,Cs=Ne,_s=Ge,Ls=J,Ts=Hi;Ps.f=Es&&!js?Object.defineProperties:function(t,e){_s(t);for(var r,n=Ls(e),o=Ts(e),i=o.length,s=0;i>s;)Cs.f(t,r=o[s++],n[r]);return t};var Is,As=nt("document","documentElement"),Ns=Ge,zs=Ps,Rs=Ln,Fs=xr,Zs=As,Ds=Se,Gs=Sr("IE_PROTO"),Vs=function(){},Bs=function(t){return"<script>"+t+"</"+"script>"},Us=function(t){t.write(Bs("")),t.close();var e=t.parentWindow.Object;return t=null,e},Ws=function(){try{Is=new ActiveXObject("htmlfile")}catch(t){}var t,e;Ws="undefined"!=typeof document?document.domain&&Is?Us(Is):((e=Ds("iframe")).style.display="none",Zs.appendChild(e),e.src=String("javascript:"),(t=e.contentWindow.document).open(),t.write(Bs("document.F=Object")),t.close(),t.F):Us(Is);for(var r=Rs.length;r--;)delete Ws.prototype[Rs[r]];return Ws()};Fs[Gs]=!0;var qs=Object.create||function(t,e){var r;return null!==t?(Vs.prototype=Ns(t),r=new Vs,Vs.prototype=null,r[Gs]=t):r=Ws(),void 0===e?r:zs.f(r,e)},Xs=Ne,Hs=ae("unscopables"),$s=Array.prototype;null==$s[Hs]&&Xs.f($s,Hs,{configurable:!0,value:qs(null)});var Js=xn.includes,Ks=function(t){$s[Hs][t]=!0};ao({target:"Array",proto:!0,forced:v((function(){return!Array(1).includes()}))},{includes:function(t){return Js(this,t,arguments.length>1?arguments[1]:void 0)}}),Ks("includes");var Ys=Q,Qs=Z,ta=ae("match"),ea=function(t){var e;return Ys(t)&&(void 0!==(e=t[ta])?!!e:"RegExp"==Qs(t))},ra=d.TypeError,na=So,oa=d.String,ia=function(t){if("Symbol"===na(t))throw TypeError("Cannot convert a Symbol value to a string");return oa(t)},sa=ae("match"),aa=ao,ua=function(t){if(ea(t))throw ra("The method doesn't accept regular expressions");return t},ca=X,fa=ia,la=function(t){var e=/./;try{"/./"[t](e)}catch(r){try{return e[sa]=!1,"/./"[t](e)}catch(t){}}return!1},pa=N("".indexOf);aa({target:"String",proto:!0,forced:!la("includes")},{includes:function(t){return!!~pa(fa(ca(this)),fa(ua(t)),arguments.length>1?arguments[1]:void 0)}});var ha=ao,ma=xn.indexOf,da=mi,ga=N([].indexOf),va=!!ga&&1/ga([1],1,-0)<0,ya=da("indexOf");ha({target:"Array",proto:!0,forced:va||!ya},{indexOf:function(t){var e=arguments.length>1?arguments[1]:void 0;return va?ga(this,t,e)||0:ma(this,t,e)}});var ba=be,wa=Ne,ka=C,Oa=ao,Sa=d,xa=dn,Ma=ln,Pa=bn,Ea=Vt,ja=Wo,Ca=function(t,e,r){var n=ba(e);n in t?wa.f(t,n,ka(0,r)):t[n]=r},_a=ni("splice"),La=Sa.TypeError,Ta=Math.max,Ia=Math.min,Aa=9007199254740991,Na="Maximum allowed length exceeded";Oa({target:"Array",proto:!0,forced:!_a},{splice:function(t,e){var r,n,o,i,s,a,u=Ea(this),c=Pa(u),f=xa(t,c),l=arguments.length;if(0===l?r=n=0:1===l?(r=0,n=c-f):(r=l-2,n=Ia(Ta(Ma(e),0),c-f)),c+r-n>Aa)throw La(Na);for(o=ja(u,n),i=0;i<n;i++)(s=f+i)in u&&Ca(o,i,u[s]);if(o.length=n,r<n){for(i=f;i<c-n;i++)a=i+r,(s=i+n)in u?u[a]=u[s]:delete u[a];for(i=c;i>c-n+r;i--)delete u[i-1]}else if(r>n)for(i=c-n;i>f;i--)a=i+r-1,(s=i+n-1)in u?u[a]=u[s]:delete u[a];for(i=0;i<r;i++)u[i+f]=arguments[i+2];return u.length=c-n+r,o}});var za=d,Ra=K,Fa=za.String,Za=za.TypeError,Da=N,Ga=Ge,Va=function(t){if("object"==typeof t||Ra(t))return t;throw Za("Can't set "+Fa(t)+" as a prototype")},Ba=Object.setPrototypeOf||("__proto__"in{}?function(){var t,e=!1,r={};try{(t=Da(Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set))(r,[]),e=r instanceof Array}catch(t){}return function(r,n){return Ga(r),Va(n),e?t(r,n):r.__proto__=n,r}}():void 0),Ua=K,Wa=Q,qa=Ba,Xa=N(1..valueOf),Ha=X,$a=ia,Ja=N("".replace),Ka="[\t\n\v\f\r                　\u2028\u2029\ufeff]",Ya=RegExp("^"+Ka+Ka+"*"),Qa=RegExp(Ka+Ka+"*$"),tu=function(t){return function(e){var r=$a(Ha(e));return 1&t&&(r=Ja(r,Ya,"")),2&t&&(r=Ja(r,Qa,"")),r}},eu={start:tu(1),end:tu(2),trim:tu(3)},ru=y,nu=d,ou=N,iu=Qn,su=an,au=Wt,uu=function(t,e,r){var n,o;return qa&&Ua(n=e.constructor)&&n!==r&&Wa(o=n.prototype)&&o!==r.prototype&&qa(t,o),t},cu=ot,fu=kt,lu=ge,pu=v,hu=un.f,mu=g.f,du=Ne.f,gu=Xa,vu=eu.trim,yu="Number",bu=nu.Number,wu=bu.prototype,ku=nu.TypeError,Ou=ou("".slice),Su=ou("".charCodeAt),xu=function(t){var e=lu(t,"number");return"bigint"==typeof e?e:Mu(e)},Mu=function(t){var e,r,n,o,i,s,a,u,c=lu(t,"number");if(fu(c))throw ku("Cannot convert a Symbol value to a number");if("string"==typeof c&&c.length>2)if(c=vu(c),43===(e=Su(c,0))||45===e){if(88===(r=Su(c,2))||120===r)return NaN}else if(48===e){switch(Su(c,1)){case 66:case 98:n=2,o=49;break;case 79:case 111:n=8,o=55;break;default:return+c}for(s=(i=Ou(c,2)).length,a=0;a<s;a++)if((u=Su(i,a))<48||u>o)return NaN;return parseInt(i,n)}return+c};if(iu(yu,!bu(" 0o1")||!bu("0b1")||bu("+0x1"))){for(var Pu,Eu=function(t){var e=arguments.length<1?0:bu(xu(t)),r=this;return cu(wu,r)&&pu((function(){gu(r)}))?uu(Object(e),r,Eu):e},ju=ru?hu(bu):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,fromString,range".split(","),Cu=0;ju.length>Cu;Cu++)au(bu,Pu=ju[Cu])&&!au(Eu,Pu)&&du(Eu,Pu,mu(bu,Pu));Eu.prototype=wu,wu.constructor=Eu,su(nu,yu,Eu,{constructor:!0})}var _u=n((function t(r,n){e(this,t),this.markers={sum:r.length};var o=n.map((function(t){return t.count})),i=o.reduce((function(t,e){return t+e}),0);this.clusters={count:n.length,markers:{mean:i/n.length,sum:i,min:Math.min.apply(Math,f(o)),max:Math.max.apply(Math,f(o))}}})),Lu=function(){function t(){e(this,t)}return n(t,[{key:"render",value:function(t,e){var r=t.count,n=t.position,o=r>Math.max(10,e.clusters.markers.mean)?"#ff0000":"#0000ff",i=window.btoa('\n  <svg fill="'.concat(o,'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">\n    <circle cx="120" cy="120" opacity=".6" r="70" />\n    <circle cx="120" cy="120" opacity=".3" r="90" />\n    <circle cx="120" cy="120" opacity=".2" r="110" />\n  </svg>'));return new google.maps.Marker({position:n,icon:{url:"data:image/svg+xml;base64,".concat(i),scaledSize:new google.maps.Size(45,45)},label:{text:String(r),color:"rgba(255,255,255,0.9)",fontSize:"12px"},title:"Cluster of ".concat(r," markers"),zIndex:Number(google.maps.Marker.MAX_ZINDEX)+r})}}]),t}();var Tu,Iu=n((function t(){e(this,t),function(t,e){for(var r in e.prototype)t.prototype[r]=e.prototype[r]}(t,google.maps.OverlayView)}));t.MarkerClustererEvents=void 0,(Tu=t.MarkerClustererEvents||(t.MarkerClustererEvents={})).CLUSTERING_BEGIN="clusteringbegin",Tu.CLUSTERING_END="clusteringend",Tu.CLUSTER_CLICK="click";var Au=function(t,e,r){r.fitBounds(e.bounds)},Nu=function(r){o(s,r);var i=u(s);function s(t){var r,n=t.map,o=t.markers,a=void 0===o?[]:o,u=t.algorithm,c=void 0===u?new Ms({}):u,l=t.renderer,p=void 0===l?new Lu:l,h=t.onClusterClick,m=void 0===h?Au:h;return e(this,s),(r=i.call(this)).markers=f(a),r.clusters=[],r.algorithm=c,r.renderer=p,r.onClusterClick=m,n&&r.setMap(n),r}return n(s,[{key:"addMarker",value:function(t,e){this.markers.includes(t)||(this.markers.push(t),e||this.render())}},{key:"addMarkers",value:function(t,e){var r=this;t.forEach((function(t){r.addMarker(t,!0)})),e||this.render()}},{key:"removeMarker",value:function(t,e){var r=this.markers.indexOf(t);return-1!==r&&(t.setMap(null),this.markers.splice(r,1),e||this.render(),!0)}},{key:"removeMarkers",value:function(t,e){var r=this,n=!1;return t.forEach((function(t){n=r.removeMarker(t,!0)||n})),n&&!e&&this.render(),n}},{key:"clearMarkers",value:function(t){this.markers.length=0,t||this.render()}},{key:"render",value:function(){var e=this.getMap();if(e instanceof google.maps.Map&&this.getProjection()){google.maps.event.trigger(this,t.MarkerClustererEvents.CLUSTERING_BEGIN,this);var r=this.algorithm.calculate({markers:this.markers,map:e,mapCanvasProjection:this.getProjection()}),n=r.clusters,o=r.changed;(o||null==o)&&(this.reset(),this.clusters=n,this.renderClusters()),google.maps.event.trigger(this,t.MarkerClustererEvents.CLUSTERING_END,this)}}},{key:"onAdd",value:function(){this.idleListener=this.getMap().addListener("idle",this.render.bind(this)),this.render()}},{key:"onRemove",value:function(){google.maps.event.removeListener(this.idleListener),this.reset()}},{key:"reset",value:function(){this.markers.forEach((function(t){return t.setMap(null)})),this.clusters.forEach((function(t){return t.delete()})),this.clusters=[]}},{key:"renderClusters",value:function(){var e=this,r=new _u(this.markers,this.clusters),n=this.getMap();this.clusters.forEach((function(o){1===o.markers.length?o.marker=o.markers[0]:(o.marker=e.renderer.render(o,r),e.onClusterClick&&o.marker.addListener("click",(function(r){google.maps.event.trigger(e,t.MarkerClustererEvents.CLUSTER_CLICK,o),e.onClusterClick(r,o,n)}))),o.marker.setMap(n)}))}}]),s}(Iu);t.AbstractAlgorithm=Ci,t.AbstractViewportAlgorithm=_i,t.Cluster=Oi,t.ClusterStats=_u,t.DefaultRenderer=Lu,t.GridAlgorithm=Ui,t.MarkerClusterer=Nu,t.NoopAlgorithm=Wi,t.SuperClusterAlgorithm=Ms,t.defaultOnClusterClickHandler=Au,t.distanceBetweenPoints=Mi,t.extendBoundsToPaddedViewport=xi,t.extendPixelBounds=Ei,t.filterMarkersToPaddedViewport=Si,t.noop=Li,t.pixelBoundsToLatLngBounds=ji,Object.defineProperty(t,"__esModule",{value:!0})}));
//# sourceMappingURL=index.umd.js.map