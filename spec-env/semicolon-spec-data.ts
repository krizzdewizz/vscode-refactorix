function missingSemicolons() {

    interface Color {
        rgb: string
        foo()
    }

    class X {
        foo
    }

    do {
        // something
    } while ('')

    let editor: any
    let all: any

    editor.edit(builder => {
        all.changes.forEach(change => {
            change()
        })
    })

    all.changes.forEach(change => {
        change()
    })

    debugger

    switch (all) {
        case 0:
            break
    }

    for (let x of all) {
        continue
    }
}
