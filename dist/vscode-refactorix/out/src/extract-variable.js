"use strict";
var vs = require('vscode');
var refactor_vscode_1 = require('./refactor-vscode');
function extractVariable() {
    var editor = vs.window.activeTextEditor;
    if (!editor || editor.selection.isEmpty) {
        return;
    }
    var doc = editor.document;
    var sel = editor.selection;
    var text = doc.getText(sel);
    var indent = refactor_vscode_1.getIndentAtLine(doc, sel.start.line);
    var line = doc.lineAt(sel.start).lineNumber;
    var theVar = 'xxx';
    var prefix = indent + "const ";
    var allText = "" + prefix + theVar + " = " + text + ";\n";
    editor.edit(function (builder) {
        builder.insert(new vs.Position(line, 0), allText);
        builder.replace(sel, theVar);
    }).then(function (ok) {
        if (ok) {
            editor.selections = [
                new vs.Selection(line, prefix.length, line, prefix.length + theVar.length),
                new vs.Selection(line + 1, sel.start.character, line + 1, sel.start.character + theVar.length)];
        }
    });
}
exports.extractVariable = extractVariable;
//# sourceMappingURL=extract-variable.js.map