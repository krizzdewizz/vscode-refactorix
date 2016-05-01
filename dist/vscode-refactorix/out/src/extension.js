/**
 * Provides the 'Extract variable' command.
 */
"use strict";
var vscode = require('vscode');
var arrow_function_vscode_1 = require('./arrow-function-vscode');
var extract_variable_1 = require('./extract-variable');
var semicolon_vscode_1 = require('./semicolon-vscode');
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.ExtractVariable', extract_variable_1.extractVariable));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.ArrowFunction.SingleStatementBlockToExpression', function () { return arrow_function_vscode_1.singleStatementBlockToExpression(false); }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.ArrowFunction.SingleStatementBlockToExpressionAll', function () { return arrow_function_vscode_1.singleStatementBlockToExpression(true); }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.ArrowFunction.ExpressionToBlock', arrow_function_vscode_1.expressionToBlock));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.Semicolons.Add', function () { return semicolon_vscode_1.semicolons(true); }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.Semicolons.Remove', function () { return semicolon_vscode_1.semicolons(false); }));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map