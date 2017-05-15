import * as ts from 'typescript';
import {
    childrenOf,
    contains,
    findChildOfKind,
    hasOverlaps,
    inRange
} from './refactor';

export function splitVariableDeclaration(sourceFile: ts.SourceFile, range: ts.TextSpan, indent: string): { change: ts.TextChange, selection?: ts.TextSpan } {
    let change: ts.TextChange;
    let selection: ts.TextSpan;
    const text = sourceFile.getFullText();
    visitor(sourceFile);
    return change ? { change, selection } : undefined;

    function visitor(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.VariableStatement && inRange(node, range)) {
            const varStatement = node as ts.VariableStatement;
            const decl = varStatement.declarationList.declarations[0];
            const initializer = decl.initializer;
            if (!initializer) {
                return;
            }

            const varStatementText = text.substring(varStatement.getStart(), varStatement.getEnd()).trim();
            const declName = text.substring(decl.name.getStart(), decl.name.getEnd());
            const initText = text.substring(initializer.getStart(), initializer.getEnd());
            const semi = varStatementText.endsWith(';') ? ';' : '';

            const wasConst = varStatementText.startsWith('const');
            const declType = varStatementText.startsWith('var') ? 'var' : 'let';

            const initType = decl.type ? text.substring(decl.type.getStart(), decl.type.getEnd()) : 'type';

            const selStartMore = wasConst ? 0 : 2;

            const beforeInitType = `${declType} ${declName}: `;
            const newText = `${beforeInitType}${initType}${semi}\n${indent}${declName} = ${initText}${semi}`;
            change = { span: { start: varStatement.getStart(), length: varStatement.getEnd() - varStatement.getStart() }, newText };
            if (!decl.type) {
                selection = { start: decl.name.getEnd() + selStartMore, length: initType.length };
            }
        }

        if (!change) {
            ts.forEachChild(node, visitor);
        }
    }
}

