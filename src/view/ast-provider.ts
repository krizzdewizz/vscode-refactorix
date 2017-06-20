import * as vscode from 'vscode';
import * as ts from 'typescript';
import { childrenOf } from '../core/refactor';
import { createSourceFileFromActiveEditor } from '../refactor';

export class AstProvider implements vscode.TreeDataProvider<ts.Node> {

    private _onDidChangeTreeData: vscode.EventEmitter<ts.Node | null> = new vscode.EventEmitter<ts.Node | null>();
    readonly onDidChangeTreeData: vscode.Event<ts.Node | null> = this._onDidChangeTreeData.event;

    private tree: ts.Node;
    private editor: vscode.TextEditor;

    constructor(private context: vscode.ExtensionContext) {
        // vscode.window.onDidChangeTextEditorSelection(e => {
        //     const sel = e.selections[0];
        //     if (!sel || !this.tree) {
        //         return;
        //     }

        // });
        vscode.window.onDidChangeActiveTextEditor(editor => {
            this.parseTree();
            this._onDidChangeTreeData.fire();
        });
        vscode.workspace.onDidChangeTextDocument(e => {
        });
        this.parseTree();
    }

    private parseTree(): void {
        this.tree = undefined;
        this.editor = undefined;
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document && editor.document.languageId === 'typescript') {
            const source = createSourceFileFromActiveEditor();
            if (source) {
                this.tree = source.sourceFile;
                this.editor = source.editor;
            }
        }
    }

    getTreeItem(element: ts.Node): vscode.TreeItem | Thenable<vscode.TreeItem> {
        const children = this.getChildren(element) as ts.Node[];
        const hasChildren = children && children.length > 0;
        const it = new vscode.TreeItem(`${ts.SyntaxKind[element.kind]} (${element.getStart()}, ${element.getEnd()})`,
            hasChildren ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        it.command = {
            command: 'refactorix.openAstSelection',
            title: '',
            arguments: [new vscode.Range(this.editor.document.positionAt(element.pos), this.editor.document.positionAt(element.end))]
        };
        return it;
    }

    getChildren(element?: ts.Node): vscode.ProviderResult<ts.Node[]> {
        const children = element ? childrenOf(element) : this.tree ? childrenOf(this.tree) : [];
        return children.length === 0 ? undefined : children;
    }

    select(range: vscode.Range) {
        this.editor.selection = new vscode.Selection(range.start, range.end);
        this.editor.revealRange(range);
    }
}