/**
 * Provides the 'Extract variable' command.
 */
var vscode = require('vscode');
function getIndent(text) {
    var s = '';
    for (var i = 0, n = text.length; i < n; i++) {
        var c = text[i];
        if (c === ' ' || c === '\t') {
            s += c;
        }
        else {
            break;
        }
    }
    return s;
}
function extractVariable() {
    var editor = vscode.window.activeTextEditor;
    if (!editor || editor.selection.isEmpty) {
        return;
    }
    var doc = editor.document;
    var sel = editor.selection;
    var text = doc.getText(sel);
    var lineText = doc.getText(new vscode.Range(new vscode.Position(sel.start.line, 0), new vscode.Position(sel.start.line, 30)));
    var indent = getIndent(lineText);
    var line = doc.lineAt(sel.start);
    var theVar = 'xxx';
    var prefix = indent + "const ";
    var allText = "" + prefix + theVar + " = " + text + ";\n";
    editor.edit(function (builder) {
        builder.insert(new vscode.Position(line.lineNumber, 0), allText);
        builder.replace(sel, theVar);
    }).then(function (ok) {
        if (ok) {
            editor.selections = [
                new vscode.Selection(line.lineNumber, prefix.length, line.lineNumber, prefix.length + theVar.length),
                new vscode.Selection(line.lineNumber + 1, sel.start.character, line.lineNumber + 1, sel.start.character + theVar.length)];
        }
    });
}
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorixExtractVariable', extractVariable));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map