import * as ts from 'typescript';

const RETURN = 'return ';

function findChildOfKind(node: ts.Node, kind: ts.SyntaxKind): ts.Node {
    return node.getChildren().find(it => it.kind === kind);
}

function children(node: ts.Node): ts.Node[] {
    const all = [];
    ts.forEachChild(node, it => all.push(it));
    return all;
}

export function writeChanges(sourceFile: ts.SourceFile, changes: ts.TextChange[]): string {
    let result = sourceFile.getFullText();
    for (let i = changes.length - 1; i >= 0; i--) {
        const change = changes[i];
        const head = result.slice(0, change.span.start);
        const tail = result.slice(change.span.start + change.span.length);
        result = head + change.newText + tail;
    }
    return result;
}

function contains(s: ts.TextSpan, p: number): boolean {
    return p >= s.start && p <= s.start + s.length;
}

function hasOverlaps(change: ts.TextChange, all: ts.TextChange[]): boolean {
    const start = change.span.start;
    const end = start + change.span.length;
    return !!all.map(it => it.span).find(it => contains(it, start) || contains(it, end));
}

export function singleStatementBlockToExpressions(sourceFile: ts.SourceFile, range?: { start: number, end: number }): { changes: ts.TextChange[], overlaps: boolean } {
    const changes: ts.TextChange[] = [];
    let overlaps = false;
    visitor(sourceFile);
    return { changes, overlaps };

    function visitor(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.ArrowFunction) {
            const block = <ts.Block>findChildOfKind(node, ts.SyntaxKind.Block);
            if (block) {
                const kids = children(block);
                if (kids.length === 1) {
                    const first = kids[0];
                    if (first.kind === ts.SyntaxKind.ReturnStatement || first.kind === ts.SyntaxKind.ExpressionStatement) {
                        const text = sourceFile.getFullText();
                        let newText = text.substring(first.getStart(), first.getEnd());
                        if (newText.endsWith(';')) {
                            newText = newText.substring(0, newText.length - 1);
                        }
                        if (newText.startsWith(RETURN)) {
                            newText = newText.substring(RETURN.length);
                        }

                        const change = { span: { start: block.getStart(), length: block.getEnd() - block.getStart() }, newText };
                        if (hasOverlaps(change, changes)) {
                            overlaps = true;
                        } else {
                            changes.push(change);
                        }
                    }
                }
            }
        }
        ts.forEachChild(node, visitor);
    }
}

export interface ParseDiagnostics extends ts.SourceFile {
    parseDiagnostics: {
        messageText: string;
    }[]
};
