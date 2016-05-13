/**
 * Provides the 'Extract variable' command.
 */

import * as vscode from 'vscode';

import { toggleSingleStatementBlockExpression, singleStatementBlockToExpression, expressionToBlock } from './arrow-function';
import { extractVariable } from './extract-variable';
import { semicolons } from './semicolon';
import { toGetterSetter } from './property';
import { interpolate } from './stringg';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.ExtractVariable', extractVariable));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.ArrowFunction.ToggleSingleStatementBlockExpression', toggleSingleStatementBlockExpression));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.ArrowFunction.SingleStatementBlockToExpressionAll', () => singleStatementBlockToExpression(true)));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.ArrowFunction.ExpressionToBlock', expressionToBlock));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.Semicolons.Add', () => semicolons(true)));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.Semicolons.Remove', () => semicolons(false)));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.Property.ToGetterSetter', toGetterSetter));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorix.String.Interpolate', interpolate));
}
