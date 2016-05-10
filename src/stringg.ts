import * as ts from 'typescript';
import {findChildOfKind, childrenOf} from './refactor';

const PREFIX = '${';
const SUFFIX = '}';
const BACKTICK = '`';

export const INTERPOLATE_PREFIX_LEN = PREFIX.length;

export function interpolate(sourceFile: ts.SourceFile, range: ts.TextSpan): ts.TextChange[] {
    const text = sourceFile.getFullText();
    let changes: ts.TextChange[];
    visitor(sourceFile);
    return changes;

    function visitor(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.StringLiteral || node.kind === ts.SyntaxKind.FirstTemplateToken) {

            const span = { start: node.getStart(), length: node.getEnd() - node.getStart() };
            if (ts.textSpanContainsTextSpan(span, range)) {
                const rangeText = text.substr(range.start, range.length);
                const newText = PREFIX + rangeText + SUFFIX;

                changes = [{ span: range, newText }];

                if (node.kind === ts.SyntaxKind.StringLiteral) {
                    changes = [
                        ...changes,
                        { span: { start: node.getStart(), length: BACKTICK.length }, newText: BACKTICK },
                        { span: { start: node.getEnd() - BACKTICK.length, length: BACKTICK.length }, newText: BACKTICK }
                    ];
                }
            }
        }

        if (!changes) {
            ts.forEachChild(node, visitor);
        }
    }
}