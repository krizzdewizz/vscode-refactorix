import * as vs from 'vscode';
import * as ts from 'typescript';

import {semicolons as coreSemicolons} from './core';
import {createSourceFileFromActiveEditor, changeToRange} from './refactor';

export function semicolons(add: boolean) {
    const source = createSourceFileFromActiveEditor();
    if (!source) {
        return;
    }

    const editor = source.editor;
    const {document, selection} = editor;

    const changes = coreSemicolons(source.sourceFile, add);
    if (changes.length === 0) {
        return;
    }

    editor.edit(builder => {
        const doIt = add
            ? change => builder.insert(document.positionAt(change), ';')
            : change => builder.replace(new vs.Range(document.positionAt(change - 1), document.positionAt(change)), '');
        changes.forEach(doIt);
    }).then(ok => {
        if (ok) {
            editor.selection = selection;
        }
    });
}
