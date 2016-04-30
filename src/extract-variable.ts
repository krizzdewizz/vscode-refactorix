import * as vscode from 'vscode';

function getIndent(text: string): string {
    let s = '';
    for (let i = 0, n = text.length; i < n; i++) {
        const c = text[i];
        if (c === ' ' || c === '\t') {
            s += c;
        } else {
            break;
        }
    }
    return s;
}

export function extractVariable(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.selection.isEmpty) {
        return;
    }

    const doc = editor.document;
    const sel = editor.selection;
    const text = doc.getText(sel);
    const lineText = doc.getText(new vscode.Range(new vscode.Position(sel.start.line, 0), new vscode.Position(sel.start.line, 30)));
    const indent = getIndent(lineText);
    const line = doc.lineAt(sel.start);
    const theVar = 'xxx';
    const prefix = `${indent}const `;
    const allText = `${prefix}${theVar} = ${text};\n`;

    editor.edit(builder => {
        builder.insert(new vscode.Position(line.lineNumber, 0), allText);
        builder.replace(sel, theVar);
    }).then(ok => {
        if (ok) {
            editor.selections = [
                new vscode.Selection(line.lineNumber, prefix.length, line.lineNumber, prefix.length + theVar.length),
                new vscode.Selection(line.lineNumber + 1, sel.start.character, line.lineNumber + 1, sel.start.character + theVar.length)];
        }
    });
}
