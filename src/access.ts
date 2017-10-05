import * as vs from 'vscode';

import { toggle as coreToggle, AccessOptions } from './core';
import { changeToRange, createSourceFileFromActiveEditor } from './refactor';

export function toggle() {
    const source = createSourceFileFromActiveEditor();
    if (!source) {
        return;
    }
    const editor = source.editor;
    const { document, selection } = editor;

    const options = vs.workspace.getConfiguration('extension.refactorix.Access.toggle') as AccessOptions;

    const changes = coreToggle(source.sourceFile, document.offsetAt(selection.start), options);
    if (!changes) {
        return;
    }

    editor.edit(builder =>
        changes.forEach(change => builder.replace(changeToRange(document, change), change.newText)))
        .then(ok => {
            if (ok) {
                editor.selection = selection;
            }
        });
}
