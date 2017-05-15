import * as vscode from 'vscode';

import { toggleSingleStatementBlockExpression, singleStatementBlockToExpression, expressionToBlock } from './arrow-function';
import { extractVariable } from './extract-variable';
import { semicolons } from './semicolon';
import { toGetterSetter } from './property';
import { interpolate } from './stringg';
import { toggle } from './access';
import { splitVariableDeclaration } from './split-variable-declaration';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.refactorix.SplitVariableDeclaration', splitVariableDeclaration),
        vscode.commands.registerCommand('extension.refactorix.ExtractVariable', extractVariable),
        vscode.commands.registerCommand('extension.refactorix.ArrowFunction.ToggleSingleStatementBlockExpression', toggleSingleStatementBlockExpression),
        vscode.commands.registerCommand('extension.refactorix.ArrowFunction.SingleStatementBlockToExpressionAll', () => singleStatementBlockToExpression(true)),
        vscode.commands.registerCommand('extension.refactorix.ArrowFunction.ExpressionToBlock', expressionToBlock),
        vscode.commands.registerCommand('extension.refactorix.Semicolons.Add', () => semicolons(true)),
        vscode.commands.registerCommand('extension.refactorix.Semicolons.Remove', () => semicolons(false)),
        vscode.commands.registerCommand('extension.refactorix.Property.ToGetterSetter', toGetterSetter),
        vscode.commands.registerCommand('extension.refactorix.String.Interpolate', interpolate),
        vscode.commands.registerCommand('extension.refactorix.Access.toggle', toggle),
    );
}
