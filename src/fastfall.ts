import reusify from 'reusify-ts';

let empty: IArguments;

export default function fastfall(context: Function[] | null, template?: Function[]) {
    if (Array.isArray(context)) {
        template = context;
        context = null;
    }

    const queue = reusify(Holder);

    return template ? compiled : fall;

    function fall() {
        let current = queue.get();
        current.release = release;

        if (arguments.length === 3) {
            current.context = arguments[0];
            current.list = arguments[1];
            current.callback = arguments[2] || noop;
        } else {
            current.context = context;
            current.list = arguments[0];
            current.callback = arguments[1] || noop;
        }

        current.work();
    }

    function release(holder: Holder) {
        queue.release(holder);
    }

    function compiled() {
        const current = queue.get();
        current.release = release;

        current.list = template;

        let args;
        let i;
        let len = arguments.length - 1;

        current.context = context;
        current.callback = arguments[len] || noop;

        switch (len) {
            case 0:
                current.work();
                break;
            case 1:
                current.work(null, arguments[0]);
                break;
            case 2:
                current.work(null, arguments[0], arguments[1]);
                break;
            case 3:
                current.work(null, arguments[0], arguments[1], arguments[2]);
                break;
            case 4:
                current.work(null, arguments[0], arguments[1], arguments[2], arguments[3]);
                break;
            default:
                args = new Array(len + 1);
                args[0] = null;
                for (i = 0; i < len; i++) {
                    args[i + 1] = arguments[i];
                }
                current.work.apply(null, args);
        }
    }
}

function noop(...params: any) {}

class Holder {
    list = empty;
    callback = noop;
    count = 0;
    context: Holder | undefined = undefined;
    release = noop;
    next: any;

    work = (...argmts: any) => {
        const that = this;
        if (argmts.length > 0 && argmts[0]) {
            return that.callback.call(that.context, argmts[0]);
        }

        let len = argmts.length;
        let i;
        let args;
        let func: Function;

        if (that.count < that.list.length) {
            func = that.list[that.count++];
            switch (len) {
                case 0:
                case 1:
                    return func.call(that.context, this.work);
                case 2:
                    return func.call(that.context, argmts[1], this.work);
                case 3:
                    return func.call(that.context, argmts[1], argmts[2], this.work);
                case 4:
                    return func.call(that.context, argmts[1], argmts[2], argmts[3], this.work);
                default:
                    args = new Array(len);
                    for (i = 1; i < len; i++) {
                        args[i - 1] = argmts[i];
                    }
                    args[len - 1] = this.work;
                    func.apply(that.context, args);
            }
        } else {
            switch (len) {
                case 0:
                    that.callback.call(that.context!);
                    break;
                case 1:
                    that.callback.call(that.context, argmts[0]);
                    break;
                case 2:
                    that.callback.call(that.context, argmts[0], argmts[1]);
                    break;
                case 3:
                    that.callback.call(that.context, argmts[0], argmts[1], argmts[2]);
                    break;
                case 4:
                    that.callback.call(that.context, argmts[0], argmts[1], argmts[2], argmts[3]);
                    break;
                default:
                    args = new Array(len);
                    for (i = 0; i < len; i++) {
                        args[i] = argmts[i];
                    }
                    that.callback.apply(that.context, args);
            }
            that.context = undefined;
            that.list = empty;
            that.count = 0;
            that.release(that);
        }
    };
}
