import * as vs from 'vscode';
import * as ts from 'typescript';
import {semicolons as coreSemicolons} from './semicolon';
import {ParseDiagnostics, changeToRange} from './refactor-vscode';

export function semicolons(add: boolean) {
    const editor = vs.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const doc = editor.document;
    const sourceFile: ParseDiagnostics = <any>ts.createSourceFile(doc.fileName, doc.getText(), ts.ScriptTarget.ES6, true);
    if (sourceFile.parseDiagnostics.length > 0) {
        return;
    }

    const sel = editor.selection;

    const changes = coreSemicolons(sourceFile, add);
    if (changes.length === 0) {
        return;
    }

    editor.edit(builder => {
        const doIt = add
            ? change => builder.insert(doc.positionAt(change), ';')
            : change => builder.replace(new vs.Range(doc.positionAt(change - 1), doc.positionAt(change)), '');
        changes.forEach(doIt);
    }).then(ok => {
        if (ok) {
            editor.selection = sel;
        }
    });
}
