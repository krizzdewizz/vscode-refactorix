import * as ts from 'typescript';

export interface ParseDiagnostics extends ts.SourceFile {
    parseDiagnostics: {
        messageText: string;
    }[];
};

export function getIndent(text: string): string {
    let indent = '';
    for (let i = 0, n = text.length; i < n; i++) {
        const c = text[i];
        if (c === ' ' || c === '\t') {
            indent += c;
        } else {
            break;
        }
    }
    return indent;
}

export function findChildOfKind(node: ts.Node, kind: ts.SyntaxKind): ts.Node {
    return node.getChildren().find(it => it.kind === kind);
}

export function childrenOf(node: ts.Node): ts.Node[] {
    const all = [];
    ts.forEachChild(node, it => all.push(it));
    return all;
}

export function contains(span: ts.TextSpan, pos: number): boolean {
    return pos >= span.start && pos <= span.start + span.length;
}

export function hasOverlaps(change: ts.TextChange, all: ts.TextChange[]): boolean {
    const start = change.span.start;
    const end = start + change.span.length;
    return all.map(it => it.span).some(it => contains(it, start) || contains(it, end));
}
