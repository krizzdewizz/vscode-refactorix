"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var vs = require('vscode');
var refactor_1 = require('./refactor');
function getTabs(editor, nTabs) {
    return (editor.options.insertSpaces ? ' ' : '\t').repeat(editor.options.tabSize * nTabs);
}
exports.getTabs = getTabs;
function getIndentAtLine(doc, line) {
    var lineText = doc.getText(new vs.Range(new vs.Position(line, 0), new vs.Position(line, 30)));
    return refactor_1.getIndent(lineText);
}
exports.getIndentAtLine = getIndentAtLine;
function selectionToSpan(doc, sel) {
    return { start: doc.offsetAt(sel.start), length: doc.offsetAt(sel.end) - doc.offsetAt(sel.start) };
}
exports.selectionToSpan = selectionToSpan;
function changeToRange(doc, change) {
    return new vs.Range(doc.positionAt(change.span.start), doc.positionAt(change.span.start + change.span.length));
}
exports.changeToRange = changeToRange;
__export(require('./refactor'));
//# sourceMappingURL=refactor-vscode.js.map