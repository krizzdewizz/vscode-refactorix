import * as vs from 'vscode';
import * as ts from 'typescript';
import {singleStatementBlockToExpressions, expressionToBlock as coreExpressionToBlock} from './arrow-function';
import {getIndentAtLine, getTabs, changeToRange, selectionToSpan, createSourceFileFromActiveEditor} from './refactor-vscode';

export function expressionToBlock() {
    const source = createSourceFileFromActiveEditor();
    if (!source) {
        return;
    }
    const editor = source.editor;
    const {document, selection} = editor;

    const change = coreExpressionToBlock(source.sourceFile, selectionToSpan(document, selection), getIndentAtLine(document, selection.start.line), getTabs(editor, 1));
    if (!change) {
        return;
    }

    editor.edit(builder => builder.replace(changeToRange(document, change), change.newText))
        .then(ok => {
            if (ok) {
                editor.selection = selection;
            }
        });
}

export function singleStatementBlockToExpression(replaceAll: boolean) {
    let overlapRecursionsLeft = 10;

    (function doIt() {
        const source = createSourceFileFromActiveEditor();
        if (!source) {
            return;
        }
        const editor = source.editor;
        const {document, selection} = editor;

        let all = singleStatementBlockToExpressions(source.sourceFile, replaceAll ? undefined : selectionToSpan(document, selection));
        if (all.changes.length === 0) {
            return;
        }

        if (!replaceAll) {
            all.changes = [all.changes[0]];
        }

        editor.edit(builder =>
            all.changes.forEach(change => builder.replace(changeToRange(document, change), change.newText)))
            .then(ok => {
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
