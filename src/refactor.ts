import * as ts from 'typescript';
import * as vs from 'vscode';

export interface ParseDiagnostics extends ts.SourceFile {
    parseDiagnostics: {
        messageText: string;
    }[];
};

export function getIndent(text: string): string {
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

export function getTabs(editor: vs.TextEditor, nTabs: number): string {
    return (editor.options.insertSpaces ? ' ' : '\t').repeat(editor.options.tabSize + nTabs);
}

export function getIndentAtLine(doc: vs.TextDocument, line: number): string {
    const lineText = doc.getText(new vs.Range(new vs.Position(line, 0), new vs.Position(line, 30)));
    return getIndent(lineText);
}


export function findChildOfKind(node: ts.Node, kind: ts.SyntaxKind): ts.Node {
    return node.getChildren().find(it => it.kind === kind);
}

export function childrenOf(node: ts.Node): ts.Node[] {
    const all = [];
    ts.forEachChild(node, it => all.push(it));
    return all;
}

export function contains(s: ts.TextSpan, pos: number): boolean {
    return pos >= s.start && pos <= s.start + s.length;
}

export function hasOverlaps(change: ts.TextChange, all: ts.TextChange[]): boolean {
    const start = change.span.start;
    const end = start + change.span.length;
    return all.map(it => it.span).some(it => contains(it, start) || contains(it, end));
}
