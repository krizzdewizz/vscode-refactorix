import * as vs from 'vscode';
import * as ts from 'typescript';
import {singleStatementBlockToExpressions} from './arrow-function';
import {ParseDiagnostics} from '../src/refactor';

export function singleStatementBlockToExpression(replaceAll?: boolean) {
    const editor = vs.window.activeTextEditor;
    if (!editor) {
        return;
    }

    let overlapsSafetyLeft = 5;

    (function doIt() {
        const doc = editor.document;
        const sourceFile: ParseDiagnostics = <any>ts.createSourceFile(doc.fileName, doc.getText(), ts.ScriptTarget.ES6, true);
        if (sourceFile.parseDiagnostics.length > 0) {
            return;
        }

        const sel = editor.selection;

        let all = singleStatementBlockToExpressions(sourceFile, { start: doc.offsetAt(sel.start), length: doc.offsetAt(sel.end) - doc.offsetAt(sel.start) });
        if (all.changes.length === 0) {
            return;
        }

        if (!replaceAll) {
            all.changes = [all.changes[0]];
        }

        editor.edit(builder =>
            all.changes.forEach(change =>
                builder.replace(new vs.Range(doc.positionAt(change.span.start), doc.positionAt(change.span.start + change.span.length)), change.newText)))
            .then(ok => {
                if (ok) {
                    editor.selection = sel;
                    if (replaceAll && all.overlaps && overlapsSafetyLeft > 0) {
                        doIt();
                        overlapsSafetyLeft--;
                    }
                }
            });
    })();
}
