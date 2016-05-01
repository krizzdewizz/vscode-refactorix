"use strict";
var vs = require('vscode');
var ts = require('typescript');
var semicolon_1 = require('./semicolon');
function semicolons(add) {
    var editor = vs.window.activeTextEditor;
    if (!editor) {
        return;
    }
    var doc = editor.document;
    var sourceFile = ts.createSourceFile(doc.fileName, doc.getText(), ts.ScriptTarget.ES6, true);
    if (sourceFile.parseDiagnostics.length > 0) {
        return;
    }
    var sel = editor.selection;
    var changes = semicolon_1.semicolons(sourceFile, add);
    if (changes.length === 0) {
        return;
    }
    editor.edit(function (builder) {
        var doIt = add
            ? function (change) { return builder.insert(doc.positionAt(change), ';'); }
            : function (change) { return builder.replace(new vs.Range(doc.positionAt(change - 1), doc.positionAt(change)), ''); };
        changes.forEach(doIt);
    }).then(function (ok) {
        if (ok) {
            editor.selection = sel;
        }
    });
}
exports.semicolons = semicolons;
//# sourceMappingURL=semicolon-vscode.js.map