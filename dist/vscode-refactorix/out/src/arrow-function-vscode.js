"use strict";
var vs = require('vscode');
var ts = require('typescript');
var arrow_function_1 = require('./arrow-function');
var refactor_vscode_1 = require('./refactor-vscode');
function expressionToBlock() {
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
    var change = arrow_function_1.expressionToBlock(sourceFile, refactor_vscode_1.selectionToSpan(doc, sel), refactor_vscode_1.getIndentAtLine(doc, sel.start.line), refactor_vscode_1.getTabs(editor, 1));
    if (!change) {
        return;
    }
    editor.edit(function (builder) { return builder.replace(refactor_vscode_1.changeToRange(doc, change), change.newText); })
        .then(function (ok) {
        if (ok) {
            editor.selection = sel;
        }
    });
}
exports.expressionToBlock = expressionToBlock;
function singleStatementBlockToExpression(replaceAll) {
    var editor = vs.window.activeTextEditor;
    if (!editor) {
        return;
    }
    var overlapRecursionsLeft = 10;
    (function doIt() {
        var doc = editor.document;
        var sourceFile = ts.createSourceFile(doc.fileName, doc.getText(), ts.ScriptTarget.ES6, true);
        if (sourceFile.parseDiagnostics.length > 0) {
            return;
        }
        var sel = editor.selection;
        var all = arrow_function_1.singleStatementBlockToExpressions(sourceFile, replaceAll ? undefined : refactor_vscode_1.selectionToSpan(doc, sel));
        if (all.changes.length === 0) {
            return;
        }
        if (!replaceAll) {
            all.changes = [all.changes[0]];
        }
        editor.edit(function (builder) {
            return all.changes.forEach(function (change) { return builder.replace(refactor_vscode_1.changeToRange(doc, change), change.newText); });
        })
            .then(function (ok) {
            if (ok) {
                editor.selection = sel;
                if (replaceAll && all.changes.length > 1 && all.overlaps && overlapRecursionsLeft > 0) {
                    doIt();
                    overlapRecursionsLeft--;
                }
            }
        });
    })();
}
exports.singleStatementBlockToExpression = singleStatementBlockToExpression;
//# sourceMappingURL=arrow-function-vscode.js.map