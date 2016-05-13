import * as fs from 'fs';
import * as ts from 'typescript';

import {interpolate} from '../src/core';

describe('stringg-spec-data.ts', () => {

    const fileName = './spec/stringg-spec-data.ts';
    const content = fs.readFileSync(fileName).toString();
    const sourceFile = ts.createSourceFile(fileName, content, ts.ScriptTarget.ES6, true);

    describe('interpolate', () => {

        const changes = interpolate(sourceFile, { start: 39, length: 4 }); // name

        it('should find change', () => {
            expect(changes).toBeDefined();
            expect(changes.length).toBe(1);
            expect(changes[0].newText).toBe('${name}');
        });
    });
});

