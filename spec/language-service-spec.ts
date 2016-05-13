import * as fs from 'fs';
import * as ts from 'typescript';

describe('language service', () => {

    const fileName = 'test.ts';

    const servicesHost: ts.LanguageServiceHost = {
        getScriptFileNames: () => [fileName],
        getScriptVersion: (fileName) => '1',
        getScriptSnapshot: (fileName) => {
            return ts.ScriptSnapshot.fromString(`'x'`);
        },
        getCurrentDirectory: () => process.cwd(),
        getCompilationSettings: () => ({ module: ts.ModuleKind.CommonJS }),
        getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    };

    const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

    xit('should find changes', () => {
        const def = services.getDefinitionAtPosition(fileName, 8);

        const td = services.getTypeDefinitionAtPosition(fileName, 8);
        const tc = services.getProgram().getTypeChecker();
        // ts.forEachChild(services.getProgram())

        console.log(JSON.stringify(td[0]));

    });
});
