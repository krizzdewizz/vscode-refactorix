"use strict";
var arrow_function_1 = require('./arrow-function');
var refactor_vscode_1 = require('./refactor-vscode');
function expressionToBlock() {
    var source = refactor_vscode_1.createSourceFileFromActiveEditor();
    if (!source) {
        return;
    }
    var editor = source.editor;
    var document = editor.document, selection = editor.selection;
    var change = arrow_function_1.expressionToBlock(source.sourceFile, refactor_vscode_1.selectionToSpan(document, selection), refactor_vscode_1.getIndentAtLine(document, selection.start.line), refactor_vscode_1.getTabs(editor, 1));
    if (!change) {
        return;
    }
    editor.edit(function (builder) { return builder.replace(refactor_vscode_1.changeToRange(document, change), change.newText); })
        .then(function (ok) {
        if (ok) {
            editor.selection = selection;
        }
    });
}
exports.expressionToBlock = expressionToBlock;
function singleStatementBlockToExpression(replaceAll) {
    var overlapRecursionsLeft = 10;
    (function doIt() {
        var source = refactor_vscode_1.createSourceFileFromActiveEditor();
        if (!source) {
            return;
        }
        var editor = source.editor;
        var document = editor.document, selection = editor.selection;
        var all = arrow_function_1.singleStatementBlockToExpressions(source.sourceFile, replaceAll ? undefined : refactor_vscode_1.selectionToSpan(document, selection));
        if (all.changes.length === 0) {
            return;
        }
        if (!replaceAll) {
            all.changes = [all.changes[0]];
        }
        editor.edit(function (builder) {
            return all.changes.forEach(function (change) { return builder.replace(refactor_vscode_1.changeToRange(document, change), change.newText); });
        })
            .then(function (ok) {
            if (ok) {
                editor.selection = selection;
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