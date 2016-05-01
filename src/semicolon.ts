import * as ts from 'typescript';

export function semicolons(sourceFile: ts.SourceFile, add: boolean): number[] {
    const changes: number[] = [];
    const text = sourceFile.getFullText();
    visitor(sourceFile);
    return changes;

    function visitor(node: ts.Node) {
        const kind = node.kind;
        if (kind === ts.SyntaxKind.VariableStatement
            || kind === ts.SyntaxKind.ExpressionStatement
            || kind === ts.SyntaxKind.ReturnStatement
            || kind === ts.SyntaxKind.ImportDeclaration
            || kind === ts.SyntaxKind.ExportDeclaration
            || kind === ts.SyntaxKind.DebuggerStatement
            || kind === ts.SyntaxKind.BreakStatement
            || kind === ts.SyntaxKind.ContinueStatement
        ) {
            const last = text.substr(node.getEnd() - 1, 1);
            const semi = last === ';';
            if (add && !semi || !add && semi) {
                changes.push(node.getEnd());
            }
        }

        ts.forEachChild(node, visitor);
    }
}

