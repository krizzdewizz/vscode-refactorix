/**
 * Provides the 'Extract variable' command.
 */

import * as vscode from 'vscode';
import {toggleSingleStatementBlockExpression, singleStatementBlockToExpression, expressionToBlock} from './arrow-function-vscode';
import {extractVariable} from './extract-variable';
import {semicolons} from './semicolon-vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.ExtractVariable', extractVariable));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.ArrowFunction.ToggleSingleStatementBlockExpression', toggleSingleStatementBlockExpression));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.ArrowFunction.SingleStatementBlockToExpressionAll', () => singleStatementBlockToExpression(true)));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.ArrowFunction.ExpressionToBlock', expressionToBlock));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.Semicolons.Add', () => semicolons(true)));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.Semicolons.Remove', () => semicolons(false)));
}
