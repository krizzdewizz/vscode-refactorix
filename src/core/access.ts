import * as ts from 'typescript';

const MODS_NO_PUBLIC = ['private ', 'protected '];
const ALL_MODS = [...MODS_NO_PUBLIC, 'public '];

function findOtherAccessor(node: ts.AccessorDeclaration): ts.Node {
    const parent = node.parent as ts.ClassDeclaration;
    const otherKind = node.kind === ts.SyntaxKind.SetAccessor ? ts.SyntaxKind.GetAccessor : ts.SyntaxKind.SetAccessor;
    const propName = node.name.getText();
    return parent.members.find(it => it.kind === otherKind && it.name.getText() === propName);
}

export interface AccessOptions {
    preferPublic?: boolean;
}

export function toggle(sourceFile: ts.SourceFile, pos: number, options?: AccessOptions): ts.TextChange[] {
    const text = sourceFile.getFullText();
    const preferPublic = options && options.preferPublic;
    let changes: ts.TextChange[];
    visitor(sourceFile);
    return changes;

    function posInside(node: ts.Node): boolean {
        return ts.textSpanContainsPosition({ start: node.getStart(), length: node.getEnd() - node.getStart() }, pos);
    }

    function findNodes(node: ts.Node): ts.Node[] {
        if (
            node.kind === ts.SyntaxKind.PropertyDeclaration ||
            node.kind === ts.SyntaxKind.MethodDeclaration ||
            node.kind === ts.SyntaxKind.SetAccessor || node.kind === ts.SyntaxKind.GetAccessor) {
            if (posInside(node)) {
                const all = [node];
                if (node.kind === ts.SyntaxKind.SetAccessor || node.kind === ts.SyntaxKind.GetAccessor) {
                    const other = findOtherAccessor(node as ts.AccessorDeclaration);
                    if (other) {
                        all.push(other);
                    }
                }
                return all;
            }
        } else if (node.kind === ts.SyntaxKind.Constructor) {
            const ctor = node as ts.ConstructorDeclaration;
            let param = ctor.parameters.find(it => posInside(it));
            if (!param && posInside(ctor)) {
                param = ctor.parameters[0];
            }
            if (param) {
                return [param];
            }
        }
        return [];
    }

    function anyModLength(text: string) {
        for (let i = 0, n = ALL_MODS.length; i < n; i++) {
            const mod = ALL_MODS[i];
            if (text.startsWith(mod)) {
                return mod.length;
            }
        }
        return 0;
    }

    function visitor(node: ts.Node) {
        findNodes(node).forEach(found => {

            const isParam = found.kind === ts.SyntaxKind.Parameter;
            const nodeText = text.substring(found.getStart(), found.getEnd());
            let modFound = false;
            const mods = isParam || preferPublic ? ALL_MODS : MODS_NO_PUBLIC;
            const def = preferPublic && !isParam ? ALL_MODS[0]  : '';
            for (let i = 0, n = mods.length; i < n; i++) {
                const mod = mods[i];
                if (nodeText.startsWith(mod)) {
                    changes = changes || [];
                    changes.push({ span: { start: found.getStart(), length: mod.length }, newText: (i + 1 < n) ? mods[i + 1] : def });
                    modFound = true;
                    break;
                }
            }
            if (!modFound) {
                changes = changes || [];
                changes.push({ span: { start: found.getStart(), length: anyModLength(nodeText) }, newText: mods[0] });
            }
        });

        if (changes) {
            return true;
        }

        ts.forEachChild(node, visitor);
    }
}