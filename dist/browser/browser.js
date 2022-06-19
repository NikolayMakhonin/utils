!function(t){"use strict";var e=function(){
function t(t){
this.size=0,this._stack=[null],this.maxSize=t}
return t.prototype.get=function(){
var t=this.size-1;if(t>=0){var e=this._stack[t]
;if(this._stack[t]=null,this.size=t,
null===e)throw new Error("obj === null");return e}
return null},t.prototype.release=function(t){
this.size<this.maxSize&&(this._stack[this.size]=t,
this.size++)},t}();function n(t,e){return t<e}
var r=function(){function t(t){
var e=t.objectPool,r=t.lessThanFunc
;this._size=0,this._root=null,this.merge=i,this.collapse=o,
this._objectPool=e,this._lessThanFunc=r||n}
return t.prototype.clear=function(){
this._root=null,this._size=0
},Object.defineProperty(t.prototype,"size",{
get:function(){return this._size},enumerable:!1,
configurable:!0}),t.prototype.add=function(t){
var e=null!=this._objectPool?this._objectPool.get():null
;return null==e?e={child:null,next:null,prev:null,
item:t
}:e.item=t,this._size++,this._root=i(this._root,e,this._lessThanFunc),e
},t.prototype.getMin=function(){var t=this._root
;return null==t?void 0:t.item
},t.prototype.deleteMin=function(){
var t=this._root,e=null==t?void 0:t.item
;return this.delete(t),e
},t.prototype.delete=function(t){var e
;if(t===this._root)this._root=o(t.child,this._lessThanFunc);else{
if(null==t.prev){
if(this._objectPool)throw new Error("The node is already deleted. Don't use the objectPool to prevent this error.")
;return}
t.prev.child===t?t.prev.child=t.next:t.prev.next=t.next,null!=t.next&&(t.next.prev=t.prev),
this._root=i(this._root,o(t.child,this._lessThanFunc),this._lessThanFunc)
}
t.child=null,t.prev=null,t.next=null,t.item=void 0,null===(e=this._objectPool)||void 0===e||e.release(t),
this._size--},t.prototype.decreaseKey=function(t){
t!==this._root&&(t.prev.child===t?t.prev.child=t.next:t.prev.next=t.next,
null!=t.next&&(t.next.prev=t.prev),
this._root=i(this._root,t,this._lessThanFunc))
},Object.defineProperty(t.prototype,"isEmpty",{
get:function(){return null==this._root},
enumerable:!1,configurable:!0}),t}()
;function i(t,e,n){var r,i
;return null==t?e:null==e||t===e?t:(n(e.item,t.item)?(r=e,
i=t):(r=t,i=e),i.next=r.child,
null!=r.child&&(r.child.prev=i),i.prev=r,r.child=i,
r.next=null,r.prev=null,r)}function o(t,e){
var n,r,o,u,s;if(null==t)return null
;for(u=t,n=null;null!=u;){
if(null==(o=(r=u).next)){r.prev=n,n=r;break}
u=o.next,(s=i(r,o,e)).prev=n,n=s}
for(s=null;null!=n;)u=n.prev,s=i(s,n,e),n=u
;return s}var u=function(){function t(t,e){
this._brunch=null,this.order=t,this.parent=e}
return Object.defineProperty(t.prototype,"brunch",{
get:function(){if(!this._brunch){
for(var t=[this.order],e=this.parent;null!=e;)t.push(e.order),
e=e.parent;this._brunch=t}return this._brunch},
enumerable:!1,configurable:!0}),t}()
;function s(t,e){
if(null==t)return null==e?0:e.order<=0?1:-1
;if(null==e)return t.order<=0?-1:1
;for(var n=t.brunch,r=e.brunch,i=n.length,o=r.length,u=i<o?i:o,s=0;s<u;s++){
var l=n[i-1-s],c=r[o-1-s];if(l!==c)return l>c?1:-1
}
return i<o?r[o-u-1]<=0?1:-1:i>o?n[i-u-1]<=0?-1:1:0
}var l=function(){var t,e
;this.promise=new Promise((function(n,r){t=n,e=r
})),this.resolve=t,this.reject=e};function c(t,e){
return new Promise((function(n,r){var i,o
;e&&e.aborted?r(e.reason):(t.then((function(t){
i&&i(),n(t)})).catch(u),e&&(i=e.subscribe(u)))
;function u(t){o||(o=!0,i&&i(),r(t))}}))}var a={
now:function(){return Date.now()},
setTimeout:"undefined"==typeof window?setTimeout:function t(){
return t.apply(window,arguments)},
clearTimeout:"undefined"==typeof window?clearTimeout:function t(){
return t.apply(window,arguments)}}
;function h(t,e,n,r){
return new(n||(n=Promise))((function(i,o){
function u(t){try{l(r.next(t))}catch(t){o(t)}}
function s(t){try{l(r.throw(t))}catch(t){o(t)}}
function l(t){var e
;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){
t(e)}))).then(u,s)}l((r=r.apply(t,e||[])).next())
}))}function p(t,e){var n,r,i,o,u={label:0,
sent:function(){if(1&i[0])throw i[1];return i[1]},
trys:[],ops:[]};return o={next:s(0),throw:s(1),
return:s(2)
},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){
return this}),o;function s(o){return function(s){
return function(o){
if(n)throw new TypeError("Generator is already executing.")
;for(;u;)try{
if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),
0):r.next)&&!(i=i.call(r,o[1])).done)return i
;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:
case 1:i=o;break;case 4:return u.label++,{
value:o[1],done:!1};case 5:u.label++,r=o[1],o=[0]
;continue;case 7:o=u.ops.pop(),u.trys.pop()
;continue;default:
if(!(i=u.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){
u=0;continue}
if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){
u.label=o[1];break}if(6===o[0]&&u.label<i[1]){
u.label=i[1],i=o;break}if(i&&u.label<i[2]){
u.label=i[2],u.ops.push(o);break}
i[2]&&u.ops.pop(),u.trys.pop();continue}
o=e.call(t,u)}catch(t){o=[6,t],r=0}finally{n=i=0}
if(5&o[0])throw o[1];return{
value:o[0]?o[1]:void 0,done:!0}}([o,s])}}}
var f=function(){};function v(t,e){
return s(t.priority,e.priority)<0}
var _=function(){function t(t){
var e=(void 0===t?{}:t).objectPool
;this._queue=new r({objectPool:e,lessThanFunc:v})}
return t.prototype.run=function(t,e,n){var r=new l
;return this._queue.add({priority:e,func:t,
abortSignal:n,resolve:r.resolve,reject:r.reject
}),this._process(),c(r.promise,n)
},t.prototype._process=function(){
return h(this,void 0,void 0,(function(){
var t,e,n,r;return p(this,(function(i){
switch(i.label){case 0:
if(this._processRunning)return[2]
;this._processRunning=!0,i.label=1;case 1:
return[4,Promise.resolve().then(f)];case 2:
if(i.sent(),this._queue.isEmpty)return[3,8]
;t=this._queue.deleteMin(),i.label=3;case 3:
return i.trys.push([3,6,,7]),(n=t.func)?[4,t.func(t.abortSignal)]:[3,5]
;case 4:n=i.sent(),i.label=5;case 5:
return e=n,t.resolve(e),[3,7];case 6:
return r=i.sent(),t.reject(r),[3,7];case 7:
return[3,1];case 8:
return this._processRunning=!1,[2]}}))}))},t
}(),b=function(){function t(t){
var e=t.maxCount,n=t.timeMs,r=t.priorityQueue,i=t.timeController,o=this
;this._activeCount=0,
this._tickPromise=new l,this._timeController=i||a,this._maxCount=e,
this._timeMs=n,
this._priorityQueue=r,this._releaseFunc=function(){
o._release()},this._tickFunc=function(t){
return o.tick(t)}}
return t.prototype._release=function(){
this._activeCount--;var t=this._tickPromise
;this._tickPromise=new l,t.resolve()
},t.prototype.tick=function(t){
return c(this._tickPromise.promise,t)
},t.prototype.available=function(){
return this._activeCount<this._maxCount
},t.prototype.run=function(t,e,n){
return h(this,void 0,void 0,(function(){
return p(this,(function(r){switch(r.label){case 0:
return this._priorityQueue?[4,this._priorityQueue.run(null,e,n)]:[3,2]
;case 1:r.sent(),r.label=2;case 2:
return this.available()?[3,7]:this._priorityQueue?[4,this._priorityQueue.run(this._tickFunc,e,n)]:[3,4]
;case 3:return r.sent(),[3,6];case 4:
return[4,this.tick(n)];case 5:r.sent(),r.label=6
;case 6:return[3,2];case 7:
this._activeCount++,r.label=8;case 8:
return r.trys.push([8,,10,11]),[4,t(n)];case 9:
return[2,r.sent()];case 10:
return this._timeController.setTimeout(this._releaseFunc,this._timeMs),
[7];case 11:return[2]}}))}))},t}(),y=function(){
function t(t){
var e=t.timeLimits,n=t.priorityQueue,r=this
;this._timeLimits=e,this._priorityQueue=n,
this._tickFunc=function(t){return r.tick(t)}}
return t.prototype.tick=function(t){
return Promise.race(this._timeLimits.map((function(e){
return e.tick(t)})))
},t.prototype.available=function(){
return this._timeLimits.every((function(t){
return t.available()}))
},t.prototype.run=function(t,e,n){
return h(this,void 0,void 0,(function(){var r,i,o
;return p(this,(function(u){switch(u.label){
case 0:
return this._priorityQueue?[4,this._priorityQueue.run(null,e,n)]:[3,2]
;case 1:u.sent(),u.label=2;case 2:
return this.available()?[3,7]:this._priorityQueue?[4,this._priorityQueue.run(this._tickFunc,e,n)]:[3,4]
;case 3:return u.sent(),[3,6];case 4:
return[4,this.tick(n)];case 5:u.sent(),u.label=6
;case 6:return[3,2];case 7:
for(r=new l,i=function(){return r.promise
},o=0;o<this._timeLimits.length;o++)this._timeLimits[o].run(i)
;u.label=8;case 8:
return u.trys.push([8,,10,11]),[4,t(n)];case 9:
return[2,u.sent()];case 10:return r.resolve(),[7]
;case 11:return[2]}}))}))},t}()
;t.CustomPromise=l,t.ObjectPool=e,t.PairingHeap=r,
t.Priority=u,t.PriorityQueue=_,
t.TimeLimit=b,t.TimeLimits=y,t.delay=function(t,e,n){
return new Promise((function(r,i){
if(e&&e.aborted)i(e.reason);else{
var o,u=n||a,s=u.setTimeout((function(){o&&o(),r()
}),t);e&&(o=e.subscribe((function(t){
u.clearTimeout(s),i(t)})))}}))
},t.priorityCompare=s,t.priorityCreate=function(t,e){
return new u(t,e)
},t.promiseToAbortable=c,Object.defineProperty(t,"__esModule",{
value:!0})}({});
