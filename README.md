# vscode-refactorix
Refactoring tools for Visual Studio Code.

## Installation
Copy the folder `dist/vscode-refactorix` folder to your VS Code extension folder:

- Windows: `%USERPROFILE%\.vscode\extensions`
- Mac/Linux: `$HOME/.vscode/extensions`

Run `npm install --production` in the `vscode-refactorix` folder you just created.

Restart Visual Studio Code.

By pressing `F1` and entering `x:` you should now see Refactorix commands in the drop down.

## Refactorings

### Add/Remove semicolons
Adds or removes semicolons for all statements in the active documents.

### Arrow function expression to block
Encloses an arrow function expression within a block.

Before:
```
() => 0;
```

After:
```
() => {
    return 0;
}
```

Place the cursor inside such a function and invoke the command.

### Arrow function single statement block to expression
If an arrow function block contains exactly 1 statement, replaces the block with that statement.

Before:
```
() => {
    return 0;
}
```

After:
```
() => 0;
```

Place the cursor inside such a function and invoke the command. `extension.refactorix.ArrowFunction.SingleStatementBlockToExpressionAll` operates on all occurences in the active document.

### Extract variable
Replaces the selected text with a `const` variable declaration. This command operates on text- rather than AST transformation, so the location of the
variable declaration may not be appropriate in all the cases.

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
    "key": "ctrl+[",
    "command": "extension.refactorix.ArrowFunction.ExpressionToBlock",
    "when": "editorTextFocus"
},
{
    "key": "ctrl+]",
    "command": "extension.refactorix.ArrowFunction.SingleStatementBlockToExpression",
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

