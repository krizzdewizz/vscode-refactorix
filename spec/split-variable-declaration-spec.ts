import * as fs from 'fs';
import * as ts from 'typescript';
import { semicolons } from '../src/core';
import { splitVariableDeclaration } from '../src/core/split-variable-declaration';


describe('split-variable-declaration-spec-data.ts', () => {

    const fileName = './spec/split-variable-declaration-spec-data.ts';
    const content = fs.readFileSync(fileName).toString();
    const sourceFile = ts.createSourceFile(fileName, content, ts.ScriptTarget.Latest, true);

    describe('split-variable-declaration', () => {
        it('should find changes', () => {
            expect(splitVariableDeclaration(sourceFile, undefined, { start: 7, length: 0 }, '')).not.toBeUndefined();
        });
    });
});
