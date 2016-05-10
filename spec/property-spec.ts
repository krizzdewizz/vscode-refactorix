import * as fs from 'fs';
import * as ts from 'typescript';
import {toGetterSetter} from '../src/property';

describe('property-spec-data.ts', () => {

    const fileName = './spec/property-spec-data.ts';
    const content = fs.readFileSync(fileName).toString();
    const sourceFile = ts.createSourceFile(fileName, content, ts.ScriptTarget.ES6, true);

    describe('toGetterSetter', () => {

        const changes = toGetterSetter(sourceFile, 49, '', '');

        it('should find change', () => {
            expect(changes).toBeDefined();
        });
    });
});

