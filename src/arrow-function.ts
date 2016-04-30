import * as ts from 'typescript';
import {findChildOfKind, contains, childrenOf, hasOverlaps} from './refactor';

const RETURN = 'return ';

function inRange(node: ts.Node, range?: ts.TextSpan) {
    if (!range) {
        return true;
    }
    // return contains(range, node.getStart()) && contains(range, node.getEnd());
    return node.getStart() < range.start && node.getEnd() > range.start + range.length;
}

export function singleStatementBlockToExpressions(sourceFile: ts.SourceFile, range?: ts.TextSpan): { changes: ts.TextChange[], overlaps: boolean } {
    const text = sourceFile.getFullText();
    const changes: ts.TextChange[] = [];
    let overlaps = false;
    visitor(sourceFile);
    return { changes, overlaps };

    function visitor(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.ArrowFunction) {
            const block = <ts.Block>findChildOfKind(node, ts.SyntaxKind.Block);
            if (block) {
                const children = childrenOf(block);
                if (children.length === 1) {
                    const first = children[0];
                    if (first.kind === ts.SyntaxKind.ReturnStatement || first.kind === ts.SyntaxKind.ExpressionStatement && inRange(node, range)) {
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

