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
;this._size=0,this._root=null,this.merge=i,this.collapse=u,
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
var t=this._root,e=null==t?void 0:t.item
;return this.delete(t),e
},t.prototype.delete=function(t){var e
;t===this._root?this._root=u(t.child,this._lessThanFunc):(t.prev.child===t?t.prev.child=t.next:t.prev.next=t.next,
null!=t.next&&(t.next.prev=t.prev),
this._root=i(this._root,u(t.child,this._lessThanFunc),this._lessThanFunc)),
t.child=null,
t.prev=null,t.next=null,t.item=void 0,null===(e=this._objectPool)||void 0===e||e.release(t),
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
n.next=null,n.prev=null,n)}function u(t,e){
var r,n,u,o,s;if(null==t)return null
;for(o=t,r=null;null!=o;){
if(null==(u=(n=o).next)){n.prev=r,r=n;break}
o=u.next,(s=i(n,u,e)).prev=r,r=s}
for(s=null;null!=r;)o=r.prev,s=i(s,r,e),r=o
;return s}var o=function(){function t(t,e){
this._brunch=null,this.order=t,this.parent=e}
return Object.defineProperty(t.prototype,"brunch",{
get:function(){if(!this._brunch){
for(var t=[this.order],e=this.parent;null!=e;)t.push(e.order),
e=e.parent;this._brunch=t}return this._brunch},
enumerable:!1,configurable:!0}),t}()
;function s(t,e){
if(null==t)return null==e?0:e.order<=0?1:-1
;if(null==e)return t.order<=0?-1:1
;for(var r=t.brunch,n=e.brunch,i=r.length,u=n.length,o=i<u?i:u,s=0;s<o;s++){
var c=r[i-1-s],l=n[u-1-s];if(c!==l)return c>l?1:-1
}
return i<u?n[u-o-1]<=0?1:-1:i>u?r[i-o-1]<=0?-1:1:0
}var c=function(){var t,e
;this.promise=new Promise((function(r,n){t=r,e=n
})),this.resolve=t,this.reject=e};function l(t,e){
return new Promise((function(r,n){var i
;e&&e.aborted?n(e.reason):(t.then((function(t){
i&&i(),r(t)})).catch(n),e&&(i=e.subscribe(n)))}))}
function a(t,e,r,n){
return new(r||(r=Promise))((function(i,u){
function o(t){try{c(n.next(t))}catch(t){u(t)}}
function s(t){try{c(n.throw(t))}catch(t){u(t)}}
function c(t){var e
;t.done?i(t.value):(e=t.value,e instanceof r?e:new r((function(t){
t(e)}))).then(o,s)}c((n=n.apply(t,e||[])).next())
}))}function h(t,e){var r,n,i,u,o={label:0,
sent:function(){if(1&i[0])throw i[1];return i[1]},
trys:[],ops:[]};return u={next:s(0),throw:s(1),
return:s(2)
},"function"==typeof Symbol&&(u[Symbol.iterator]=function(){
return this}),u;function s(u){return function(s){
return function(u){
if(r)throw new TypeError("Generator is already executing.")
;for(;o;)try{
if(r=1,n&&(i=2&u[0]?n.return:u[0]?n.throw||((i=n.return)&&i.call(n),
0):n.next)&&!(i=i.call(n,u[1])).done)return i
;switch(n=0,i&&(u=[2&u[0],i.value]),u[0]){case 0:
case 1:i=u;break;case 4:return o.label++,{
value:u[1],done:!1};case 5:o.label++,n=u[1],u=[0]
;continue;case 7:u=o.ops.pop(),o.trys.pop()
;continue;default:
if(!(i=o.trys,(i=i.length>0&&i[i.length-1])||6!==u[0]&&2!==u[0])){
o=0;continue}
if(3===u[0]&&(!i||u[1]>i[0]&&u[1]<i[3])){
o.label=u[1];break}if(6===u[0]&&o.label<i[1]){
o.label=i[1],i=u;break}if(i&&o.label<i[2]){
o.label=i[2],o.ops.push(u);break}
i[2]&&o.ops.pop(),o.trys.pop();continue}
u=e.call(t,o)}catch(t){u=[6,t],n=0}finally{r=i=0}
if(5&u[0])throw u[1];return{
value:u[0]?u[1]:void 0,done:!0}}([u,s])}}}
var p=function(){};function f(t,e){
return s(t.priority,e.priority)<0}
var v=function(){function t(t){
var e=(void 0===t?{}:t).objectPool
;this._queue=new n({objectPool:e,lessThanFunc:f})}
return t.prototype.run=function(t,e,r){var n=new c
;return this._queue.add({priority:e,func:t,
abortSignal:r,resolve:n.resolve,reject:n.reject
}),this._process(),l(n.promise,r)
},t.prototype._process=function(){
return a(this,void 0,void 0,(function(){
var t,e,r,n;return h(this,(function(i){
switch(i.label){case 0:
if(this._processRunning)return[2]
;this._processRunning=!0,i.label=1;case 1:
return[4,Promise.resolve().then(p)];case 2:
if(i.sent(),this._queue.isEmpty)return[3,8]
;t=this._queue.deleteMin(),i.label=3;case 3:
return i.trys.push([3,6,,7]),(r=t.func)?[4,t.func(t.abortSignal)]:[3,5]
;case 4:r=i.sent(),i.label=5;case 5:
return e=r,t.resolve(e),[3,7];case 6:
return n=i.sent(),t.reject(n),[3,7];case 7:
return[3,1];case 8:
return this._processRunning=!1,[2]}}))}))},t
}(),_=function(){function t(t){
var e=t.maxCount,r=t.timeMs,n=t.priorityQueue,i=this
;this._activeCount=0,this._tickPromise=new c,
this._maxCount=e,this._timeMs=r,this._priorityQueue=n,
this._releaseFunc=function(){i._release()
},this._tickFunc=function(t){return i.tick(t)}}
return t.prototype._release=function(){
this._activeCount--;var t=this._tickPromise
;this._tickPromise=new c,t.resolve()
},t.prototype.tick=function(t){
return l(this._tickPromise.promise,t)
},t.prototype.available=function(){
return this._activeCount<this._maxCount
},t.prototype.run=function(t,e,r){
return a(this,void 0,void 0,(function(){
return h(this,(function(n){switch(n.label){case 0:
return this._priorityQueue?[4,this._priorityQueue.run(null,e,r)]:[3,2]
;case 1:n.sent(),n.label=2;case 2:
return this.available()?[3,7]:this._priorityQueue?[4,this._priorityQueue.run(this._tickFunc,e,r)]:[3,4]
;case 3:return n.sent(),[3,6];case 4:
return[4,this.tick(r)];case 5:n.sent(),n.label=6
;case 6:return[3,2];case 7:
this._activeCount++,n.label=8;case 8:
return n.trys.push([8,,10,11]),[4,t(r)];case 9:
return[2,n.sent()];case 10:
return setTimeout(this._releaseFunc,this._timeMs),[7]
;case 11:return[2]}}))}))},t}(),b=function(){
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
return a(this,void 0,void 0,(function(){var n,i,u
;return h(this,(function(o){switch(o.label){
case 0:
return this._priorityQueue?[4,this._priorityQueue.run(null,e,r)]:[3,2]
;case 1:o.sent(),o.label=2;case 2:
return this.available()?[3,7]:this._priorityQueue?[4,this._priorityQueue.run(this._tickFunc,e,r)]:[3,4]
;case 3:return o.sent(),[3,6];case 4:
return[4,this.tick(r)];case 5:o.sent(),o.label=6
;case 6:return[3,2];case 7:
for(n=new c,i=function(){return n.promise
},u=0;u<this._timeLimits.length;u++)this._timeLimits[u].run(i)
;o.label=8;case 8:
return o.trys.push([8,,10,11]),[4,t(r)];case 9:
return[2,o.sent()];case 10:return n.resolve(),[7]
;case 11:return[2]}}))}))},t}()
;t.CustomPromise=c,t.ObjectPool=e,t.PairingHeap=n,
t.Priority=o,t.PriorityQueue=v,
t.TimeLimit=_,t.TimeLimits=b,t.delay=function(t,e){
return new Promise((function(r,n){
if(e&&e.aborted)n(e.reason);else{
var i,u=setTimeout((function(){i&&i(),r()}),t)
;e&&(i=e.subscribe((function(t){
clearTimeout(u),n(t)})))}}))
},t.priorityCompare=s,t.priorityCreate=function(t,e){
return new o(t,e)
},t.promiseToAbortable=l,Object.defineProperty(t,"__esModule",{
value:!0})}({});
