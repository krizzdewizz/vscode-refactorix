import * as fs from 'fs';
import * as ts from 'typescript';

import {semicolons} from '../src/core';

describe('semicolon-spec-data.ts', () => {

    const fileName = './spec/semicolon-spec-data.ts';
    const content = fs.readFileSync(fileName).toString();
    const sourceFile = ts.createSourceFile(fileName, content, ts.ScriptTarget.Latest, true);

    describe('semicolon', () => {

        const changes = semicolons(sourceFile, true);

        it('should find changes', () => {
            expect(changes.length).toBe(15);
        });
    });
});
