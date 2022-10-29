
(function (global) {
    if (!global.console) {
        global.console = {}
    }
    console.log = console.warn = function(...args) {
        $.Msg(args.map((v) => {
            if (typeof v === 'object') {
                return JSON.stringify(v)
            }
            return String(v)
        }).join(' '))
    }
})(this);