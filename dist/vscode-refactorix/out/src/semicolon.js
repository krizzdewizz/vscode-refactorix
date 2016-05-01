"use strict";
var ts = require('typescript');
function semicolons(sourceFile, add) {
    var changes = [];
    var text = sourceFile.getFullText();
    visitor(sourceFile);
    return changes;
    function visitor(node) {
        var kind = node.kind;
        if (kind === ts.SyntaxKind.VariableStatement
            || kind === ts.SyntaxKind.ExpressionStatement
            || kind === ts.SyntaxKind.ReturnStatement
            || kind === ts.SyntaxKind.ImportDeclaration
            || kind === ts.SyntaxKind.ExportDeclaration
            || kind === ts.SyntaxKind.DebuggerStatement
            || kind === ts.SyntaxKind.BreakStatement
            || kind === ts.SyntaxKind.ContinueStatement) {
            var last = text.substr(node.getEnd() - 1, 1);
            var semi = last === ';';
            if (add && !semi || !add && semi) {
                changes.push(node.getEnd());
            }
        }
        ts.forEachChild(node, visitor);
    }
}
exports.semicolons = semicolons;
//# sourceMappingURL=semicolon.js.map