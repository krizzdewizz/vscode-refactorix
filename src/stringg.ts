import * as vs from 'vscode';

import { INTERPOLATE_PREFIX_LEN, interpolate as coreInterpolate } from './core';
import { changeToRange, selectionToSpan, createSourceFileFromActiveEditor } from './refactor';

export function interpolate() {
    const source = createSourceFileFromActiveEditor();
    if (!source) {
        return;
    }
    const editor = source.editor;
    const { document, selection } = editor;

    const changes = coreInterpolate(source.sourceFile, selectionToSpan(document, selection));
    if (!changes) {
        return;
    }

    editor.edit(builder =>
        changes.forEach(change => builder.replace(changeToRange(document, change), change.newText)))
        .then(ok => {
            if (ok) {
                editor.selection = new vs.Selection(
                    new vs.Position(selection.start.line, selection.start.character + INTERPOLATE_PREFIX_LEN),
                    new vs.Position(selection.start.line, selection.end.character + INTERPOLATE_PREFIX_LEN));
            }
        });
}
