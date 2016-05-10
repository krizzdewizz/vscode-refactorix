import * as ts from 'typescript';

export function semicolons(sourceFile: ts.SourceFile, add: boolean): number[] {
    const changes: number[] = [];
    const text = sourceFile.getFullText();
    visitor(sourceFile);
    return changes;

    function checkSemi(node: ts.Node) {
        const last = text.substr(node.getEnd() - 1, 1);
        const semi = last === ';';
        if (add && !semi || !add && semi) {
            changes.push(node.getEnd());
        }
    }

    function visitor(node: ts.Node) {

        switch (node.kind) {
            case ts.SyntaxKind.VariableStatement:
            case ts.SyntaxKind.ExpressionStatement:
            case ts.SyntaxKind.ReturnStatement:
            case ts.SyntaxKind.BreakStatement:
            case ts.SyntaxKind.ContinueStatement:
            case ts.SyntaxKind.ThrowStatement:
            case ts.SyntaxKind.ImportDeclaration:
            case ts.SyntaxKind.ImportEqualsDeclaration:
            case ts.SyntaxKind.DoStatement:
            case ts.SyntaxKind.DebuggerStatement:
            case ts.SyntaxKind.ExportAssignment:
            case ts.SyntaxKind.PropertyDeclaration:
                checkSemi(node);
                break;
            case ts.SyntaxKind.InterfaceDeclaration:
                (node as ts.InterfaceDeclaration).members.forEach(checkSemi);
                break;
        }

        ts.forEachChild(node, visitor);
    }
}

