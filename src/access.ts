import * as vs from 'vscode';
import * as ts from 'typescript';

import { toggle as coreToggle } from './core';
import { getIndentAtLine, getTabs, changeToRange, createSourceFileFromActiveEditor } from './refactor';

export function toggle() {
    const source = createSourceFileFromActiveEditor();
    if (!source) {
        return;
    }
    const editor = source.editor;
    const {document, selection} = editor;

    // const options: GetterSetterOptions = vs.workspace.getConfiguration('extension.refactorix.Property.ToGetterSetter');

    const change = coreToggle(source.sourceFile, document.offsetAt(selection.start));
    if (!change) {
        return;
    }

    editor.edit(builder =>
        builder.replace(changeToRange(document, change), change.newText))
        .then(ok => {
            if (ok) {
                editor.selection = selection;
            }
        });
}
