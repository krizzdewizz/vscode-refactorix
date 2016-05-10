import * as ts from 'typescript';

export function dump(sourceFile: ts.SourceFile) {
    let depth = 0;
    visitor(sourceFile);

    function visitor(node: ts.Node) {
        console.log(`${'  '.repeat(depth)}${ts.SyntaxKind[node.kind]}`);
        depth++;
        ts.forEachChild(node, visitor);
        depth--;
    }
}