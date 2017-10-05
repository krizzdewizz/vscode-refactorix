import * as vs from 'vscode';

import { getIndentAtLine } from './refactor';

export interface ExtractVariableOptions {
    noSemicolon?: boolean;
}

export function extractVariable(): void {
    const editor = vs.window.activeTextEditor;
    if (!editor || editor.selection.isEmpty) {
        return;
    }

    const options = vs.workspace.getConfiguration('extension.refactorix.ExtractVariable') as ExtractVariableOptions;
    const semi = options.noSemicolon ? '' : ';';
    const doc = editor.document;
    const sel = editor.selection;
    const text = doc.getText(sel);
    const indent = getIndentAtLine(doc, sel.start.line);
    const line = doc.lineAt(sel.start).lineNumber;
    const theVar = 'xxx';
    const prefix = `${indent}const `;
    const allText = `${prefix}${theVar} = ${text}${semi}\n`;

    editor.edit(builder => {
        builder.insert(new vs.Position(line, 0), allText);
        builder.replace(sel, theVar);
    }).then(ok => {
        if (ok) {
            editor.selections = [
                new vs.Selection(line, prefix.length, line, prefix.length + theVar.length),
                new vs.Selection(line + 1, sel.start.character, line + 1, sel.start.character + theVar.length)];
        }
    });
}
