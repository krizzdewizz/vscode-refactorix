# vscode-refactorix
Refactoring tools for Visual Studio Code.

## Installation
Download [Refactorix](https://github.com/krizzdewizz/vscode-refactorix/raw/master/dist/vscode-refactorix-0.0.1.vsix) and run

`code vscode-refactorix-0.0.1.vsix`

Restarting Visual Studio Code.

By pressing `F1` and entering `x:` you should now see Refactorix commands in the drop down.

## Refactorings

### Semicolons.Add / Semicolons.Remove
Adds or removes semicolons for all statements in the active documents.

### ArrowFunction.ExpressionToBlock
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

### ArrowFunction.SingleStatementBlockToExpression
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

Place the cursor inside such a function and invoke the command. `ArrowFunction.SingleStatementBlockToExpressionAll` operates on all occurences in the active document.

### ExtractVariable
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

