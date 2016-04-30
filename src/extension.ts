/**
 * Provides the 'Extract variable' command.
 */

import * as vscode from 'vscode';
import {singleStatementBlockToExpression} from './arrow-function-vscode';
import {extractVariable} from './extract-variable';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.refactorixExtractVariable', extractVariable));
    context.subscriptions.push(vscode.commands.registerCommand('extension.singleStatementBlockToExpression', singleStatementBlockToExpression));
}
