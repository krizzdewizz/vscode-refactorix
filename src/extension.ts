/**
 * Provides the 'Extract variable' command.
 */

import * as vscode from 'vscode';
import {singleStatementBlockToExpression, expressionToBlock} from './arrow-function-vscode';
import {extractVariable} from './extract-variable';
import {semicolons} from './semicolon-vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.ExtractVariable', extractVariable));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.SingleStatementBlockToExpression', () => singleStatementBlockToExpression(false)));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.SingleStatementBlockToExpressionAll', () => singleStatementBlockToExpression(true)));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.ExpressionToBlock', expressionToBlock));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.AddSemicolons', () => semicolons(true)));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.RemoveSemicolons', () => semicolons(false)));
}
