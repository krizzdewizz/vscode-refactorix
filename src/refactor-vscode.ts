import * as vs from 'vscode';
import {getIndent} from './refactor';

export function getTabs(editor: vs.TextEditor, nTabs: number): string {
    return (editor.options.insertSpaces ? ' ' : '\t').repeat(editor.options.tabSize + nTabs);
}

export function getIndentAtLine(doc: vs.TextDocument, line: number): string {
    const lineText = doc.getText(new vs.Range(new vs.Position(line, 0), new vs.Position(line, 30)));
    return getIndent(lineText);
}

export * from  './refactor';