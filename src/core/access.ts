import * as ts from 'typescript';

const MODS = ['private ', 'protected ', 'public '];

export function toggle(sourceFile: ts.SourceFile, pos: number): ts.TextChange {
    const text = sourceFile.getFullText();
    let change: ts.TextChange;
    visitor(sourceFile);
    return change;

    function posInside(node: ts.Node): boolean {
        return ts.textSpanContainsPosition({ start: node.getStart(), length: node.getEnd() - node.getStart() }, pos);
    }

    function findNode(node: ts.Node): ts.Node {
        if (node.kind === ts.SyntaxKind.PropertyDeclaration || node.kind === ts.SyntaxKind.MethodDeclaration) {
            return posInside(node) ? node : undefined;
        } else if (node.kind === ts.SyntaxKind.Constructor) {
            const ctor = node as ts.ConstructorDeclaration;
            let param = ctor.parameters.find(it => posInside(it));
            if (!param && posInside(ctor)) {
                param = ctor.parameters[0];
            }
            return param;
        }
        return undefined;
    }

    function visitor(node: ts.Node) {
        const found = findNode(node);
        if (found) {
            const nodeText = text.substring(found.getStart(), found.getEnd());
            for (let i = 0, n = MODS.length; i < n; i++) {
                const mod = MODS[i];
                if (nodeText.startsWith(mod)) {
                    change = { span: { start: found.getStart(), length: mod.length }, newText: (i + 1 < n) ? MODS[i + 1] : '' };
                    break;
                }
            }
            if (!change) {
                change = { span: { start: found.getStart(), length: 0 }, newText: MODS[0] };
            }
        }

        if (!change) {
            ts.forEachChild(node, visitor);
        }
    }
}