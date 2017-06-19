import * as vs from 'vscode';

import { toGetterSetter as coreToGetterSetter, GetterSetterOptions } from './core';
import { getIndentAtLine, getTabs, changeToRange, createSourceFileFromActiveEditor } from './refactor';

export function toGetterSetter() {
    const source = createSourceFileFromActiveEditor();
    if (!source) {
        return;
    }
    const editor = source.editor;
    const { document, selection } = editor;

    const options: GetterSetterOptions = vs.workspace.getConfiguration('extension.refactorix.Property.ToGetterSetter');

    const change = coreToGetterSetter(source.sourceFile, document.offsetAt(selection.start), getIndentAtLine(document, selection.start.line), getTabs(editor, 1), options);
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
