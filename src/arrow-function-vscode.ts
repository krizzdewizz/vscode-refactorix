import * as vs from 'vscode';
import * as ts from 'typescript';
import {ParseDiagnostics, singleStatementBlockToExpressions} from './arrow-function';

export function singleStatementBlockToExpression() {
    const editor = vs.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const doc = editor.document;
    const text = doc.getText();
    const sourceFile: ParseDiagnostics = <any>ts.createSourceFile(doc.fileName, text, ts.ScriptTarget.ES6, true);
    if (sourceFile.parseDiagnostics.length > 0) {
        return;
    }

    const sel = editor.selection;

    const all = singleStatementBlockToExpressions(sourceFile, { start: sel.start.character, end: sel.end.character });
    // const newText = writeChanges(sourceFile, all);
    editor.edit(builder => {
        all.changes.forEach(change => {
            builder.replace(new vs.Range(doc.positionAt(change.span.start), doc.positionAt(change.span.start + change.span.length)), change.newText);
        });
    });
}
