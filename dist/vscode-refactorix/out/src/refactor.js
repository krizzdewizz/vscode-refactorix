"use strict";
var ts = require('typescript');
;
function getIndent(text) {
    var indent = '';
    for (var i = 0, n = text.length; i < n; i++) {
        var c = text[i];
        if (c === ' ' || c === '\t') {
            indent += c;
        }
        else {
            break;
        }
    }
    return indent;
}
exports.getIndent = getIndent;
function findChildOfKind(node, kind) {
    return node.getChildren().find(function (it) { return it.kind === kind; });
}
exports.findChildOfKind = findChildOfKind;
function childrenOf(node) {
    var all = [];
    ts.forEachChild(node, function (it) { return all.push(it); });
    return all;
}
exports.childrenOf = childrenOf;
function contains(span, pos) {
    return pos >= span.start && pos <= span.start + span.length;
}
exports.contains = contains;
function hasOverlaps(change, all) {
    var start = change.span.start;
    var end = start + change.span.length;
    return all.map(function (it) { return it.span; }).some(function (it) { return contains(it, start) || contains(it, end); });
}
exports.hasOverlaps = hasOverlaps;
//# sourceMappingURL=refactor.js.map