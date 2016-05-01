"use strict";
var ts = require('typescript');
var refactor_1 = require('./refactor');
var RETURN = 'return ';
var ARROW = '=>';
function inRange(node, range) {
    if (!range) {
        return true;
    }
    return node.getStart() < range.start && node.getEnd() > range.start + range.length;
}
function expressionToBlock(sourceFile, range, indent, tab) {
    var text = sourceFile.getFullText();
    var change;
    visitor(sourceFile);
    return change;
    function visitor(node) {
        if (node.kind === ts.SyntaxKind.ArrowFunction) {
            if (!refactor_1.findChildOfKind(node, ts.SyntaxKind.Block) && inRange(node, range)) {
                var nodeText = text.substring(node.getStart(), node.getEnd());
                var pos = nodeText.indexOf(ARROW);
                var expr = nodeText.substring(pos + ARROW.length).trim();
                var newText = nodeText.substring(0, pos) + ARROW + ' {\n' + indent + tab + 'return ' + expr + ';\n' + indent + '}';
                change = { span: { start: node.getStart(), length: node.getEnd() - node.getStart() }, newText: newText };
            }
        }
        if (!change) {
            ts.forEachChild(node, visitor);
        }
    }
}
exports.expressionToBlock = expressionToBlock;
function singleStatementBlockToExpressions(sourceFile, range) {
    var text = sourceFile.getFullText();
    var changes = [];
    var overlaps = false;
    visitor(sourceFile);
    return { changes: changes, overlaps: overlaps };
    function visitor(node) {
        if (node.kind === ts.SyntaxKind.ArrowFunction) {
            var block = refactor_1.findChildOfKind(node, ts.SyntaxKind.Block);
            if (block) {
                var children = refactor_1.childrenOf(block);
                if (children.length === 1) {
                    var first = children[0];
                    if ((first.kind === ts.SyntaxKind.ReturnStatement || first.kind === ts.SyntaxKind.ExpressionStatement) && inRange(node, range)) {
                        var newText = text.substring(first.getStart(), first.getEnd());
                        if (newText.endsWith(';')) {
                            newText = newText.substring(0, newText.length - 1);
                        }
                        if (newText.startsWith(RETURN)) {
                            newText = newText.substring(RETURN.length);
                        }
                        var change = { span: { start: block.getStart(), length: block.getEnd() - block.getStart() }, newText: newText };
                        if (refactor_1.hasOverlaps(change, changes)) {
                            overlaps = true;
                        }
                        else {
                            changes.push(change);
                        }
                    }
                }
            }
        }
        ts.forEachChild(node, visitor);
    }
}
exports.singleStatementBlockToExpressions = singleStatementBlockToExpressions;
//# sourceMappingURL=arrow-function.js.map