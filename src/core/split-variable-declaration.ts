import * as ts from 'typescript';
import * as vs from 'vscode';
import {
    childrenOf,
    contains,
    findChildOfKind,
    hasOverlaps,
    inRange
} from './refactor';

function narrowType(type: string): string {
    if (type.startsWith('"') && type.endsWith('"')) {
        return 'string';
    }

    const first = type[0];
    if (first >= '0' && first <= '9') {
        return 'number';
    }

    if (type === 'true' || type === 'false') {
        return 'boolean';
    }

    return type;
}

function resolveType(expr: ts.Node, doc: vs.TextDocument): Promise<string> {
    return new Promise(resolve => {

        const def = () => resolve(undefined);

        if (expr) {
            vs.commands.executeCommand('vscode.executeHoverProvider', doc.uri, doc.positionAt(expr.getStart())).then(val => {
                const hovers: vs.Hover[] = Array.isArray(val) ? val : [val];
                let value: string;
                hovers.find(hover => {
                    hover.contents.find(ms => {
                        if (typeof ms === 'string') {
                            value = ms;
                        } else if (ms.language === 'typescript') {
                            value = ms.value;
                        }
                        return Boolean(value);
                    });
                    return Boolean(value);
                });

                if (value) {
                    const pos = value.indexOf(':');
                    if (pos >= 0) {
                        const type = value.substring(pos + 1).trim();
                        resolve(narrowType(type));
                        return;
                    }
                }
                def();
            });
        } else {
            def();
        }
    });
}

interface Decl {
    varStatement: ts.VariableStatement;
    declInit: ts.Expression;
    declName: ts.BindingName;
    declType: ts.TypeNode;
}

export function splitVariableDeclaration(sourceFile: ts.SourceFile, doc: vs.TextDocument, range: ts.TextSpan, indent: string): Promise<{ change: ts.TextChange, selection?: ts.TextSpan }> {

    const decls: Decl[] = [];
    const text = sourceFile.getFullText();

    visitor(sourceFile);

    return new Promise(resolve => {

        if (decls.length === 0) {
            resolve(undefined);
            return;
        }

        const { varStatement, declName, declInit, declType } = decls[decls.length - 1];

        function resolveChange(initType: string) {

            const noInitType = !initType;
            initType = initType || 'type';

            const varStatementText = text.substring(varStatement.getStart(), varStatement.getEnd()).trim();
            const declNameText = text.substring(declName.getStart(), declName.getEnd());
            const initText = text.substring(declInit.getStart(), declInit.getEnd());
            const semi = varStatementText.endsWith(';') ? ';' : '';

            const wasConst = varStatementText.startsWith('const');
            const declTypeText = varStatementText.startsWith('var') ? 'var' : 'let';

            const selStartMore = wasConst ? 0 : 2;

            const beforeInitType = `${declTypeText} ${declNameText}: `;
            const newText = `${beforeInitType}${initType}${semi}\n${indent}${declNameText} = ${initText}${semi}`;
            const change = { span: { start: varStatement.getStart(), length: varStatement.getEnd() - varStatement.getStart() }, newText };
            const selection = noInitType ? { start: declName.getEnd() + selStartMore, length: initType.length } : undefined;
            resolve({ change, selection });
        }

        if (declType) {
            resolveChange(text.substring(declType.getStart(), declType.getEnd()));
        } else {
            resolveType(declName, doc).then(resolveChange);
        }
    });

    function visitor(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.VariableStatement && inRange(node, range)) {
            const varStatement = node as ts.VariableStatement;
            const decl = varStatement.declarationList.declarations[0];
            const declInit = decl.initializer;
            if (declInit) {
                decls.push({ varStatement, declName: decl.name, declType: decl.type, declInit });
            }
        }

        ts.forEachChild(node, visitor);
    }
}

