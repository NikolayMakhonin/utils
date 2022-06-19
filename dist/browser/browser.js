!function(t){"use strict";var e=function(){
function t(t){
this.size=0,this._stack=[null],this.maxSize=t}
return t.prototype.get=function(){
var t=this.size-1;if(t>=0){var e=this._stack[t]
;if(this._stack[t]=null,this.size=t,
null===e)throw new Error("obj === null");return e}
return null},t.prototype.release=function(t){
this.size<this.maxSize&&(this._stack[this.size]=t,
this.size++)},t}();function r(t,e){return t<e}
var n=function(){function t(t){
var e=t.objectPool,n=t.lessThanFunc
;this._size=0,this._root=null,this.merge=i,this.collapse=o,
this._objectPool=e,this._lessThanFunc=n||r}
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
var t=this._root;if(null!=t){var e=t.item
;return this.delete(t),e}
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
;function i(t,e,r){var n,i
;return null==t?e:null==e||t===e?t:(r(e.item,t.item)?(n=e,
i=t):(n=t,i=e),i.next=n.child,
null!=n.child&&(n.child.prev=i),i.prev=n,n.child=i,
n.next=null,n.prev=null,n)}function o(t,e){
var r,n,o,u,s;if(null==t)return null
;for(u=t,r=null;null!=u;){
if(null==(o=(n=u).next)){n.prev=r,r=n;break}
u=o.next,(s=i(n,o,e)).prev=r,r=s}
for(s=null;null!=r;)u=r.prev,s=i(s,r,e),r=u
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
;for(var r=t.brunch,n=e.brunch,i=r.length,o=n.length,u=i<o?i:o,s=0;s<u;s++){
var l=r[i-1-s],c=n[o-1-s];if(l!==c)return l>c?1:-1
}
return i<o?n[o-u-1]<=0?1:-1:i>o?r[i-u-1]<=0?-1:1:0
}var l=function(){var t,e
;this.promise=new Promise((function(r,n){t=r,e=n
})),this.resolve=t,this.reject=e};function c(t,e){
return new Promise((function(r,n){var i,o
;e&&e.aborted?n(e.reason):(t.then((function(t){
i&&i(),r(t)})).catch(u),e&&(i=e.subscribe(u)))
;function u(t){o||(o=!0,i&&i(),n(t))}}))}
var a=setTimeout,h=clearTimeout,p={now:function(){
return Date.now()},
setTimeout:"undefined"==typeof window?setTimeout:function(){
return a.apply(window,arguments)},
clearTimeout:"undefined"==typeof window?clearTimeout:function(){
return h.apply(window,arguments)}}
;function f(t,e,r,n){
return new(r||(r=Promise))((function(i,o){
function u(t){try{l(n.next(t))}catch(t){o(t)}}
function s(t){try{l(n.throw(t))}catch(t){o(t)}}
function l(t){var e
;t.done?i(t.value):(e=t.value,e instanceof r?e:new r((function(t){
t(e)}))).then(u,s)}l((n=n.apply(t,e||[])).next())
}))}function v(t,e){var r,n,i,o,u={label:0,
sent:function(){if(1&i[0])throw i[1];return i[1]},
trys:[],ops:[]};return o={next:s(0),throw:s(1),
return:s(2)
},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){
return this}),o;function s(o){return function(s){
return function(o){
if(r)throw new TypeError("Generator is already executing.")
;for(;u;)try{
if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),
0):n.next)&&!(i=i.call(n,o[1])).done)return i
;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:
case 1:i=o;break;case 4:return u.label++,{
value:o[1],done:!1};case 5:u.label++,n=o[1],o=[0]
;continue;case 7:o=u.ops.pop(),u.trys.pop()
;continue;default:
if(!(i=u.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){
u=0;continue}
if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){
u.label=o[1];break}if(6===o[0]&&u.label<i[1]){
u.label=i[1],i=o;break}if(i&&u.label<i[2]){
u.label=i[2],u.ops.push(o);break}
i[2]&&u.ops.pop(),u.trys.pop();continue}
o=e.call(t,u)}catch(t){o=[6,t],n=0}finally{r=i=0}
if(5&o[0])throw o[1];return{
value:o[0]?o[1]:void 0,done:!0}}([o,s])}}}
var _=function(){};function b(t,e){
return s(t.priority,e.priority)<0}
var m=function(){function t(t){
var e=(void 0===t?{}:t).objectPool
;this._queue=new n({objectPool:e,lessThanFunc:b})}
return t.prototype.run=function(t,e,r){var n=new l
;return this._queue.add({priority:e,func:t,
abortSignal:r,resolve:n.resolve,reject:n.reject
}),this._process(),c(n.promise,r)
},t.prototype._process=function(){
return f(this,void 0,void 0,(function(){
var t,e,r,n;return v(this,(function(i){
switch(i.label){case 0:
if(this._processRunning)return[2]
;this._processRunning=!0,i.label=1;case 1:
return[4,Promise.resolve().then(_)];case 2:
if(i.sent(),this._queue.isEmpty)return[3,8]
;t=this._queue.deleteMin(),i.label=3;case 3:
return i.trys.push([3,6,,7]),(r=t.func)?[4,t.func(t.abortSignal)]:[3,5]
;case 4:r=i.sent(),i.label=5;case 5:
return e=r,t.resolve(e),[3,7];case 6:
return n=i.sent(),t.reject(n),[3,7];case 7:
return[3,1];case 8:
return this._processRunning=!1,[2]}}))}))},t
}(),y=function(){function t(t){
var e=t.maxCount,r=t.timeMs,n=t.priorityQueue,i=t.timeController,o=this
;this._activeCount=0,
this._tickPromise=new l,this._timeController=i||p,this._maxCount=e,
this._timeMs=r,
this._priorityQueue=n,this._releaseFunc=function(){
o._release()},this._tickFunc=function(t){
return o.tick(t)}}
return t.prototype._release=function(){
this._activeCount--;var t=this._tickPromise
;this._tickPromise=new l,t.resolve()
},t.prototype.tick=function(t){
return c(this._tickPromise.promise,t)
},t.prototype.available=function(){
return this._activeCount<this._maxCount
},t.prototype.run=function(t,e,r){
return f(this,void 0,void 0,(function(){
return v(this,(function(n){switch(n.label){case 0:
return this._priorityQueue?[4,this._priorityQueue.run(null,e,r)]:[3,2]
;case 1:n.sent(),n.label=2;case 2:
return this.available()?[3,7]:this._priorityQueue?[4,this._priorityQueue.run(this._tickFunc,e,r)]:[3,4]
;case 3:return n.sent(),[3,6];case 4:
return[4,this.tick(r)];case 5:n.sent(),n.label=6
;case 6:return[3,2];case 7:
this._activeCount++,n.label=8;case 8:
return n.trys.push([8,,10,11]),[4,t(r)];case 9:
return[2,n.sent()];case 10:
return this._timeController.setTimeout(this._releaseFunc,this._timeMs),
[7];case 11:return[2]}}))}))},t}(),d=function(){
function t(t){
var e=t.timeLimits,r=t.priorityQueue,n=this
;this._timeLimits=e,this._priorityQueue=r,
this._tickFunc=function(t){return n.tick(t)}}
return t.prototype.tick=function(t){
return Promise.race(this._timeLimits.map((function(e){
return e.tick(t)})))
},t.prototype.available=function(){
return this._timeLimits.every((function(t){
return t.available()}))
},t.prototype.run=function(t,e,r){
return f(this,void 0,void 0,(function(){var n,i,o
;return v(this,(function(u){switch(u.label){
case 0:
return this._priorityQueue?[4,this._priorityQueue.run(null,e,r)]:[3,2]
;case 1:u.sent(),u.label=2;case 2:
return this.available()?[3,7]:this._priorityQueue?[4,this._priorityQueue.run(this._tickFunc,e,r)]:[3,4]
;case 3:return u.sent(),[3,6];case 4:
return[4,this.tick(r)];case 5:u.sent(),u.label=6
;case 6:return[3,2];case 7:
for(n=new l,i=function(){return n.promise
},o=0;o<this._timeLimits.length;o++)this._timeLimits[o].run(i)
;u.label=8;case 8:
return u.trys.push([8,,10,11]),[4,t(r)];case 9:
return[2,u.sent()];case 10:return n.resolve(),[7]
;case 11:return[2]}}))}))},t}()
;t.CustomPromise=l,t.ObjectPool=e,t.PairingHeap=n,
t.Priority=u,t.PriorityQueue=m,
t.TimeLimit=y,t.TimeLimits=d,t.delay=function(t,e,r){
return new Promise((function(n,i){
if(e&&e.aborted)i(e.reason);else{
var o,u=r||p,s=u.setTimeout((function(){o&&o(),n()
}),t);e&&(o=e.subscribe((function(t){
u.clearTimeout(s),i(t)})))}}))
},t.priorityCompare=s,t.priorityCreate=function(t,e){
return new u(t,e)
},t.promiseToAbortable=c,Object.defineProperty(t,"__esModule",{
value:!0})}({});
