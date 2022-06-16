'use strict';

class Priority {
    constructor(order, parent) {
        this._brunch = null;
        this.order = order;
        this.parent = parent;
    }
    get brunch() {
        if (!this._brunch) {
            const brunch = [this.order];
            let parent = this.parent;
            while (parent != null) {
                brunch.push(parent.order);
                parent = parent.parent;
            }
            this._brunch = brunch;
        }
        return this._brunch;
    }
}
function priorityCreate(order, parent) {
    return new Priority(order, parent);
}
function priorityCompare(o1, o2) {
    if (o1 == null) {
        if (o2 == null) {
            return 0;
        }
        return o2.order <= 0 ? 1 : -1;
    }
    if (o2 == null) {
        return o1.order <= 0 ? -1 : 1;
    }
    const b1 = o1.brunch;
    const b2 = o2.brunch;
    const len1 = b1.length;
    const len2 = b2.length;
    const len = len1 < len2 ? len1 : len2;
    for (let i = 0; i < len; i++) {
        const order1 = b1[len1 - 1 - i];
        const order2 = b2[len2 - 1 - i];
        if (order1 !== order2) {
            return order1 > order2 ? 1 : -1;
        }
    }
    if (len1 < len2) {
        return b2[len2 - len - 1] <= 0 ? 1 : -1;
    }
    if (len1 > len2) {
        return b1[len1 - len - 1] <= 0 ? -1 : 1;
    }
    return 0;
}

exports.Priority = Priority;
exports.priorityCompare = priorityCompare;
exports.priorityCreate = priorityCreate;
