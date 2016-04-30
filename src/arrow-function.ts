import * as ts from 'typescript';
import {findChildOfKind, contains, childrenOf, hasOverlaps} from './refactor';

const RETURN = 'return ';
const ARROW = '=>';

function inRange(node: ts.Node, range?: ts.TextSpan) {
    if (!range) {
        return true;
    }
    return node.getStart() < range.start && node.getEnd() > range.start + range.length;
}

export function expressionToBlock(sourceFile: ts.SourceFile, range: ts.TextSpan, indent: string, tab: string): ts.TextChange {
    const text = sourceFile.getFullText();
    let change: ts.TextChange;
    visitor(sourceFile);
    return change;

    function visitor(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.ArrowFunction) {
            if (!findChildOfKind(node, ts.SyntaxKind.Block) && inRange(node, range)) {
                const nodeText = text.substring(node.getStart(), node.getEnd());
                const pos = nodeText.indexOf(ARROW);
                const expr = nodeText.substring(pos + ARROW.length).trim();
                const newText = nodeText.substring(0, pos) + ARROW + ' {\n' + indent + tab + 'return ' + expr + ';\n' + indent + '}';
                change = { span: { start: node.getStart(), length: node.getEnd() - node.getStart() }, newText };
            }
        }

        if (!change) {
            ts.forEachChild(node, visitor);
        }
    }
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

