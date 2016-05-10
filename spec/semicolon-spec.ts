import * as fs from 'fs';
import * as ts from 'typescript';
import {semicolons} from '../src/semicolon';

describe('semicolon-spec-data.ts', () => {

    const fileName = './spec/semicolon-spec-data.ts';
    const content = fs.readFileSync(fileName).toString();
    const sourceFile = ts.createSourceFile(fileName, content, ts.ScriptTarget.ES6, true);

    describe('semicolon', () => {

        const changes = semicolons(sourceFile, true);

        it('should find changes', () => {
            expect(changes.length).toBe(15);
        });
    });
});
