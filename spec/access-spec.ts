import * as fs from 'fs';
import * as ts from 'typescript';

import { toggle } from '../src/core';

describe('access-spec-data.ts', () => {

    const fileName = './spec/access-spec-data.ts';
    const content = fs.readFileSync(fileName).toString();
    const sourceFile = ts.createSourceFile(fileName, content, ts.ScriptTarget.ES6, true);

    describe('toggle', () => {

        const changes = toggle(sourceFile, 50); // rgb member

        it('should find change', () => {
            expect(changes).toBeDefined();
        });
    });
});

