# vscode-refactorix
TypeScript refactoring tools for Visual Studio Code.

After installing, pressing `F1` and entering `x:` you should see the Refactorix commands in the drop down:

![Commands](doc/commands.png "Refactorix commands")

## Refactorings

### Split variable declaration

Splits the initialization part of a variable declaration.

Place the cursor inside a variable declaration statement and invoke the command.

Before:
```
const x = false;
```

After:
```
let x: boolean;
x = false;
```

### Toggle access modifier
Toggles between `private`, `protected`, `public` and no access modifier.

Place the cursor on a class property, method, constructor parameter, set or get accessor and invoke the command.

When placed on a get or set accessor, the modifier of the other accessor is toggled as well.

#### Settings
Add this configuration block to the VS Code 'User' or 'Workspace' settings:
```
"extension.refactorix.Access.toggle": {
    "preferPublic": true
}
```

`preferPublic` - if `true`, the `public` modifier will be used instead of no modifier. Does not affect constructor parameters.

### Interpolate string part

Surrounds the selected part of a string literal with `${}` and converts the literal to backticks as necessary.

Before - assume you have `refactorix` selected:
```
'my name is refactorix.'
```

After - note the backticks:
```
`my name is ${refactorix}.`
```

Select a part of a string literal and invoke the command. The selection may be empty in which case `${}` is inserted.

### Property to getter/setter
Converts a property to getter/setter.

Before:
```
class Color {
    rgb: string;
}
```

After:
```
class Color {
    private _rgb: string;
    get rgb(): string {
        return this._rgb;
    }
    set rgb(value: string) {
        this._rgb = value;
    }
}
```

Place the cursor on a property and invoke the command.

#### Settings
Add this configuration block to the VS Code 'User' or 'Workspace' settings:
```
"extension.refactorix.Property.ToGetterSetter": {
    "singleLine": false,
     "prefix": "_"
}
```

`singleLine` - if `true`, getter and setter will be written on a single line.

`prefix` - Prefix for the property.

### Add/remove semicolons
Adds or removes semicolons for all statements in the active document.

### Arrow function toggle single statement block <-> expression
Toggles between an arrow function's single statement block and expression.

Toggles between this:
```
() => 0;
```

and this:
```
() => {
    return 0;
};
```

Place the cursor inside such a function and invoke the command.

### Arrow function all single statement blocks to expression
Converts all arrow function single statement blocks to expression.

### Extract variable
Replaces the selected text with a `const` variable declaration. This command operates on text rather than AST, so the location of the variable declaration may not be appropriate in all cases.

#### Settings
Add this configuration block to the VS Code 'User' or 'Workspace' settings:
```
"extension.refactorix.ExtractVariable": {
    "noSemicolon": true
}
```

`noSemicolon` - Whether to add a semicolon to the extracted expression. Default is false (will add a semicolon).

## Release Info

v0.3.6
- 'Split variable declaration' - use inner most declaration.

v0.3.5
- 'Split variable declaration' - resolve variable type.

v0.3.4
- New refactoring 'Split variable declaration'

v0.3.3
- Add 'noSemicolon' configuration setting for Extract variable.
- Add configuration schema to extension.

v0.3.2
- Latest TypeScript.

v0.3.1
- Do not add semicolon to arrow function property with block as newest tslint reports a problem there.

v0.3.0
- Add key bindings to extension
- New refactoring 'Toggle access modifier'

v0.2.0
- Semicolons are now added/removed in all the places where tslint's semicolon rule reports a problem
- New refactoring 'Property to getter/setter'
- New refactoring 'Interpolate string part'

v0.1.0
- Initial release

## Development setup
- run `npm install` inside the project folder
- open VS Code on the project folder

## Build
- run `npm run compile`

## Package
- run `vsce package`

