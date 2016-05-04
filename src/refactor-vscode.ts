import * as ts from 'typescript';
import * as vs from 'vscode';
import {getIndent, ParseDiagnostics} from './refactor';

export function getTabs(editor: vs.TextEditor, nTabs: number): string {
    return (editor.options.insertSpaces ? ' ' : '\t').repeat(editor.options.tabSize * nTabs);
}

export function getIndentAtLine(doc: vs.TextDocument, line: number): string {
    const lineText = doc.getText(new vs.Range(new vs.Position(line, 0), new vs.Position(line, 30)));
    return getIndent(lineText);
}

export function selectionToSpan(doc: vs.TextDocument, sel: vs.Selection): ts.TextSpan {
    return { start: doc.offsetAt(sel.start), length: doc.offsetAt(sel.end) - doc.offsetAt(sel.start) };
}

export function changeToRange(doc: vs.TextDocument, change: ts.TextChange): vs.Range {
    return new vs.Range(doc.positionAt(change.span.start), doc.positionAt(change.span.start + change.span.length));
}

export function createSourceFileFromActiveEditor(): { editor: vs.TextEditor, sourceFile: ts.SourceFile } {
    const editor = vs.window.activeTextEditor;
    if (!editor) {
        return undefined;
    }
    const doc = editor.document;
    const sourceFile = ts.createSourceFile(doc.fileName, doc.getText(), ts.ScriptTarget.ES6, true);
    return { editor, sourceFile };
}

export * from  './refactor';