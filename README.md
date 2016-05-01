# vscode-refactorix
Refactoring tools for Visual Studio Code.

## Installation
Copy the folder `dist/vscode-refactorix` folder to your VS Code extension folder:

- Windows: `%USERPROFILE%\.vscode\extensions`
- Mac/Linux: `$HOME/.vscode/extensions`

Run `npm install --production` in the `vscode-refactorix` folder you just created.

Restart Visual Studio Code.

By pressing `F1` and entering `x:` you should now see Refactorix commands in the drop down.

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
}
```

## Development setup
- run `npm install` inside the project folder.
- open VS Code on the project folder.

## Build
- run `npm run compile`.

