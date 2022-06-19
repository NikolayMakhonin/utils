'use strict';

var Assert = require('./Assert.cjs');
var helpers = require('./helpers2.cjs');

const xit = helpers.globalScope.xit;
const xdescribe = helpers.globalScope.xdescribe;
function describe(name, func) {
    return helpers.globalScope.describe.call(this, name, function _describe() {
        return func.call(this);
    });
}
Object.assign(describe, helpers.globalScope.describe);
function isFuncWithoutParameters(func) {
    return /^(async\s+)?(function)?\s*?\*?\s*?(\s+\w+)?\(\s*\)/s.test(func.toString());
}
function it(name, func) {
    return helpers.globalScope.it.call(this, name, isFuncWithoutParameters(func)
        ? function _it() {
            try {
                const result = func.call(this);
                if (result && typeof result.then === 'function') {
                    return result
                        .then(o => {
                        Assert.assert.assertNotHandledErrors();
                        return o;
                    })
                        .catch(err => {
                        Assert.assert.assertNotHandledErrors();
                        throw err;
                    });
                }
                Assert.assert.assertNotHandledErrors();
                return result;
            }
            finally {
                Assert.assert.assertNotHandledErrors();
            }
        }
        : function _itAsync(done) {
            try {
                return func.call(this, err => {
                    Assert.assert.assertNotHandledErrors();
                    done(err);
                });
            }
            finally {
                Assert.assert.assertNotHandledErrors();
            }
        });
}
Object.assign(it, helpers.globalScope.it);

exports.describe = describe;
exports.it = it;
exports.xdescribe = xdescribe;
exports.xit = xit;
