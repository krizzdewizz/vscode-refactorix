# vscode-refactorix
TypeScript refactoring tools for Visual Studio Code.

After installing, pressing `F1` and entering `x:` you should see the Refactorix commands in the drop down:

![Commands](doc/commands.png "Refactorix commands")

## Refactorings

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

## Assign a shortcut
Insert this into your `keybindings.json`:
```
{
    "key": "ctrl+;",
    "command": "extension.refactorix.Semicolons.Add",
    "when": "editorTextFocus"
},
{
    "key": "ctrl+shift+;",
    "command": "extension.refactorix.Semicolons.Remove",
    "when": "editorTextFocus"
},
{
    "key": "ctrl+]",
    "command": "extension.refactorix.ArrowFunction.ToggleSingleStatementBlockExpression",
    "when": "editorTextFocus"
},
{
    "key": "ctrl+shift+]",
    "command": "extension.refactorix.ArrowFunction.SingleStatementBlockToExpressionAll",
    "when": "editorTextFocus"
},
{
    "key": "alt+shift+l",
    "command": "extension.refactorix.ExtractVariable"
},
```

## Development setup
- run `npm install` inside the project folder.
- open VS Code on the project folder.

## Build
- run `npm run compile`.

## Package
- run `vsce package`.

