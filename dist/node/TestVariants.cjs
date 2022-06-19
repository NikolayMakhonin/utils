'use strict';

function expandArray(array, output = []) {
    for (const item of array) {
        if (!item) {
            continue;
        }
        if (Array.isArray(item)) {
            expandArray(item, output);
        }
        else {
            output.push(item);
        }
    }
    return output;
}
const THIS = {};
function* generateOptions(base, optionsVariants, exclude) {
    let hasChilds;
    for (const key in optionsVariants) {
        if (optionsVariants[key]) {
            for (const optionVariant of optionsVariants[key]) {
                const variant = Object.assign(Object.assign({}, base), { [key]: optionVariant });
                const newOptionsVariants = Object.assign({}, optionsVariants);
                newOptionsVariants[key] = null;
                hasChilds = true;
                yield* generateOptions(variant, newOptionsVariants, exclude);
            }
            break;
        }
    }
    if (!hasChilds && (!exclude || !exclude(base))) {
        yield base;
    }
}
class TestVariants {
    test(testCases) {
        const optionsVariants = Object.assign(Object.assign({}, this.baseOptionsVariants), testCases);
        const expected = testCases.expected;
        const exclude = testCases.exclude;
        delete optionsVariants.expected;
        delete optionsVariants.exclude;
        const actionsWithDescriptions = expandArray(optionsVariants.actions);
        delete optionsVariants.actions;
        let variants = generateOptions({}, optionsVariants, exclude);
        // variants = Array.from(variants)
        for (const actionsWithDescription of actionsWithDescriptions) {
            let { actions, description } = actionsWithDescription;
            if (typeof actionsWithDescription === 'function') {
                actions = [actionsWithDescription];
                description = '';
            }
            for (const action of expandArray(actions)) {
                for (const variant of variants) {
                    this.testVariant(Object.assign(Object.assign({}, variant), { action,
                        description,
                        expected }));
                }
            }
        }
    }
}

exports.THIS = THIS;
exports.TestVariants = TestVariants;
exports.expandArray = expandArray;
