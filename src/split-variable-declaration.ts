import * as vs from 'vscode';

import { splitVariableDeclaration as coreSplitVariableDeclaration } from './core';
import { getIndentAtLine, createSourceFileFromActiveEditor, selectionToSpan, changeToRange } from './refactor';

export function splitVariableDeclaration(): void {
    const source = createSourceFileFromActiveEditor();
    if (!source) {
        return;
    }

    const editor = source.editor;
    const { document, selection } = editor;

    const change = coreSplitVariableDeclaration(source.sourceFile, selectionToSpan(document, selection), getIndentAtLine(document, selection.start.line));
    if (!change) {
        return;
    }

    editor.edit(builder => builder.replace(changeToRange(document, change.change), change.change.newText))
        .then(ok => {
            if (ok) {
                const sel = change.selection;
                if (sel) {
                    editor.selection = new vs.Selection(document.positionAt(sel.start), document.positionAt(sel.start + sel.length));
                } else {
                    const nextLine = selection.start.line + 1;
                    const lastCol = 10000;
                    editor.selection = new vs.Selection(nextLine, lastCol, nextLine, lastCol);
                }
            }
        });
}
