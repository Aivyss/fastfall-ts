"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var reusify_ts_1 = __importDefault(require("reusify-ts"));
var empty;
function fastfall(context, template) {
    if (Array.isArray(context)) {
        template = context;
        context = null;
    }
    var queue = (0, reusify_ts_1.default)(Holder);
    return template ? compiled : fall;
    function fall() {
        var current = queue.get();
        current.release = release;
        if (arguments.length === 3) {
            current.context = arguments[0];
            current.list = arguments[1];
            current.callback = arguments[2] || noop;
        }
        else {
            current.context = context;
            current.list = arguments[0];
            current.callback = arguments[1] || noop;
        }
        current.work();
    }
    function release(holder) {
        queue.release(holder);
    }
    function compiled() {
        var current = queue.get();
        current.release = release;
        current.list = template;
        var args;
        var i;
        var len = arguments.length - 1;
        current.context = this || context;
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
exports.default = fastfall;
function noop() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
}
var Holder = /** @class */ (function () {
    function Holder() {
        var _this = this;
        this.list = empty;
        this.callback = noop;
        this.count = 0;
        this.context = undefined;
        this.release = noop;
        this.work = function () {
            var argmts = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                argmts[_i] = arguments[_i];
            }
            var that = _this;
            if (argmts.length > 0 && argmts[0]) {
                return that.callback.call(that.context, argmts[0]);
            }
            var len = argmts.length;
            var i;
            var args;
            var func;
            if (that.count < that.list.length) {
                func = that.list[that.count++];
                switch (len) {
                    case 0:
                    case 1:
                        return func.call(that.context, _this.work);
                    case 2:
                        return func.call(that.context, argmts[1], _this.work);
                    case 3:
                        return func.call(that.context, argmts[1], argmts[2], _this.work);
                    case 4:
                        return func.call(that.context, argmts[1], argmts[2], argmts[3], _this.work);
                    default:
                        args = new Array(len);
                        for (i = 1; i < len; i++) {
                            args[i - 1] = argmts[i];
                        }
                        args[len - 1] = _this.work;
                        func.apply(that.context, args);
                }
            }
            else {
                switch (len) {
                    case 0:
                        that.callback.call(that.context);
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
    return Holder;
}());
