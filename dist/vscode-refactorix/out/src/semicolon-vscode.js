"use strict";
var vs = require('vscode');
var semicolon_1 = require('./semicolon');
var refactor_vscode_1 = require('./refactor-vscode');
function semicolons(add) {
    var source = refactor_vscode_1.createSourceFileFromActiveEditor();
    if (!source) {
        return;
    }
    var editor = source.editor;
    var document = editor.document, selection = editor.selection;
    var changes = semicolon_1.semicolons(source.sourceFile, add);
    if (changes.length === 0) {
        return;
    }
    editor.edit(function (builder) {
        var doIt = add
            ? function (change) { return builder.insert(document.positionAt(change), ';'); }
            : function (change) { return builder.replace(new vs.Range(document.positionAt(change - 1), document.positionAt(change)), ''); };
        changes.forEach(doIt);
    }).then(function (ok) {
        if (ok) {
            editor.selection = selection;
        }
    });
}
exports.semicolons = semicolons;
//# sourceMappingURL=semicolon-vscode.js.map