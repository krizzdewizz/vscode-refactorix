import { createSourceFileFromActiveEditor } from './refactor';
import * as vscode from 'vscode';
import * as ts from 'typescript';
import { inRange, childrenOf } from './core/index';
import { inRangeInclusive } from './core/refactor';

let history: vscode.Selection[] = [];

const WHITESPACES = {
    ' ': true,
    '\r': true,
    '\n': true,
    '\t': true
};

export function forgetHistory() {
    history = [];
}

export function shrinkSelection() {
    if (history.length === 0) {
        return;
    }

    vscode.window.activeTextEditor.selection = history.pop();
}

function skipWhitespace(doc: vscode.TextDocument, pos: number): vscode.Position {
    const text = doc.getText();

    while (WHITESPACES[text[pos]]) {
        pos++;
    }

    return doc.positionAt(pos);
}

interface Elem {
    node: ts.Node;
    sel: vscode.Selection;
    text: string;
}

function nextSibling(node: ts.Node, next: boolean): ts.Node {
    const all = childrenOf(node.parent);
    const idx = all.indexOf(node);
    return all[idx + (next ? 1 : -1)];
}

export function growSelection() {
    const source = createSourceFileFromActiveEditor();
    if (!source) {
        return;
    }

    const { editor, sourceFile } = source;
    const doc = editor.document;
    const sel = editor.selection;
    const selStart = doc.offsetAt(sel.start);
    const selEnd = doc.offsetAt(sel.end);
    const startRange: ts.TextSpan = { start: selStart, length: 0 };
    const candidates: Elem[] = [];
    function visitor(node: ts.Node) {

        if (node.getStart() > selEnd) {
            return;
        }

        const text = doc.getText().substring(node.getStart(), node.getEnd());

        if (inRangeInclusive(node, startRange)) {
            candidates.push({ node, sel: makeSel(node), text });
        }

        node.forEachChild(visitor);
    }

    function makeSel(n: ts.Node) {
        return new vscode.Selection(doc.positionAt(n.end), skipWhitespace(doc, n.pos));
    }

    visitor(sourceFile);

    const last = candidates[candidates.length - 1];
    if (!last) {
        return;
    }

    const editorSel = editor.selection;
    let prev;
    candidates.find(it => {
        if (editorSel.isEqual(it.sel)) {
            return true;
        }
        prev = it;
        return false;
    });

    const q: Elem = prev || last;

    history.push(editorSel);
    editor.selection = q.sel;
}

