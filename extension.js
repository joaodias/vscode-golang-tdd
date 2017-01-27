var vscode = require('vscode')
var exec = require('child_process').exec, child
var path = require('path')

let tddIcon

function activate(context) {
    var disposable = vscode.commands.registerCommand('extension.golangTDD', function () {
        tddIcon = vscode.window.createStatusBarItem('left', 1)
        tddIcon.text = "Golang TDD"
        tddIcon.color = "white"
        tddIcon.show()
        setupBuildOnSave()
    })
    context.subscriptions.push(disposable)
}

exports.activate = activate

function setupBuildOnSave() {
    vscode.workspace.onDidSaveTextDocument(document => {
        if (document.languageId !== 'go') {
            tddIcon.hide()
			return;
		}
        testPackage()
    })
}

function testPackage() {
        const editor = vscode.window.activeTextEditor
        if (!editor) {
            vscode.window.showInformationMessage('No editor is active.')
            return;
        }

        const currentDir = path.dirname(editor.document.fileName)

        child = exec('cd ' + currentDir + ' && go test',
        function (error, stdout, stderr) {
            if (stderr != "") {
                testFail(stderr)
            } else {
                if (stdout.includes("--- FAIL")) {
                    testFail(stdout)
                } else {
                    testPass(stdout)
                }
            }
        })
        child()
}

function testFail(message) {
    tddIcon.color = '#B62D05'
    tddIcon.text = "$(x) Failing"
    tddIcon.show()
    console.log(message)
}

function testPass(message) {
    tddIcon.color = '#6BAD5E'
    tddIcon.text = "$(check) Passing"
    tddIcon.show()
    console.log(message)
}

function deactivate() {
}

exports.deactivate = deactivate
