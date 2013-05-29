﻿(function () {
    this.Crystalize = {
        result: [],
        conf: function () {
            return {
                all: internal.globalSettings,
                api: app._api
            }
        },
        all: function (e) {
            $.extend(internal.globalSettings, e)
        },
        ver: function () {
            return internal.CURRENT_VERSION
        },
        _api: {},
        make: function () {
            return new internal.ScenarioObject
        },
        dom: function (e) {
            return internal.createNewElement(e)
        },
        stat: function () {
            return {
                connection: internal.conn
            }
        },
        reset: function (e) {
            if (typeof e === "function") {
                e()
            }
            app.result = [];
            internal = new InternalFactory(this);
            app._api = (new internal.CreateAPI).api;
            app.result = []
        },
        begin: function (e) {
            if (internal.executed === true) return null;
            internal.executed = true;
            internal.globalSettings.whenAllStart();
            var t = function (t) {
                var r = internal.getAttr(t, app._api.xstal_runonload);
                internal.globalSettings.whenEventInvocking();
                var i = internal.QueryDom(e, t);
                var s = {
                    async: internal.getAttr(t, app._api.xstal_isasync),
                    url: internal.getAttr(t, app._api.xstal_add),
                    data: {
                        request: [internal.getAttr(t, app._api.xstal_function), i]
                    },
                    contentType: internal.globalSettings.contentType,
                    dataType: internal.globalSettings.dataType,
                    type: internal.globalSettings.type,
                    timeout: parseInt(internal.getAttr(t, app._api.xstal_timeout), 10),
                    success: function (e, n, r) {
                        var i = {
                            status: "success",
                            textStatus: n,
                            data: e,
                            JqXHR: r
                        };
                        var s = internal.getAttr(t, app._api.xstal_ajaxresult);
                        if (s !== "") {
                            if (s.contains("*")) {
                                var o = s.replace("*", "");
                                var u = o.split(",");
                                internal.globalSettings.internalHandler(e, u[0], u[1], u[2], u[3])
                            } else {
                                internal.globalSettings.evalAFunction(s, e)
                            }
                        }
                    },
                    error: function (e, n, r) {
                        var i = {
                            status: "error",
                            textStatus: n,
                            data: r,
                            JqXHR: e
                        };
                        var s = internal.getAttr(t, app._api.xstal_ajaxresult);
                        if (s !== "") {
                            if (s.contains("*")) {
                                var o = s.replace("*", "");
                                var u = o.split(",");
                                internal.globalSettings.internalHandler(r, u[0], u[1], u[2], u[3])
                            } else {
                                internal.globalSettings.evalAFunction(s, "error  " + r)
                            }
                        }
                    }
                };
                if (internal.globalSettings.forceSynchronousOnAllAjaxCalls === true) {
                    s.async = false
                } else {
                    if (s.async === "true") {
                        s.async = true
                    } else {
                        s.async = false
                    }
                }
                var o = {};
                o = new function () {
                    this.async = s.async;
                    this.url = s.url;
                    this.responseTime = s.timeout;
                    this.dataType = s.dataType;
                    this.response = s.success;
                    this.contentType = "text/json";
                    this.responseText = internal.globalSettings.resposeOfNoRequest
                };
                if (internal.globalSettings.forceMockAllAjaxCalls === true) {
                    n(internal.globalSettings.MockingFxMethod, o)
                } else if (internal.getAttr(t, app._api.xstal_test) === "true") {
                    n(internal.globalSettings.MockingFxMethod, o)
                }
                var u = {};
                if (internal.globalSettings.dontMakeJQAjaxCall === false) {
                    internal.globalSettings.readyToAjaxcall();
                    u = $.ajax(s);
                    console.log(s)
                } else {
                    internal.conn = false;
                    u = {
                        responseText: internal.globalSettings.resposeOfNoRequest
                    }
                }
                internal.globalSettings.whenEventInvocked();
                return {
                    response: u,
                    connection: internal.conn,
                    ranOnLoad: r,
                    assync: s.async,
                    element: t,
                    request: s,
                    settings: app.conf()
                }
            };
            var n = function (e, t) {
                internal.conn = false;
                internal.globalSettings.whenMockSet();
                e(t)
            };
            var r = {};
            return function () {
                $(app._api.xstal_master_class.v).each(function () {
                    internal.globalSettings.whenEachStart();
                    $(this).on(internal.getAttr(this, app._api.xstal_event), function () {
                        return t(this)
                    });
                    r = this;
                    internal.globalSettings.whenEventMade();
                    var e = false;
                    if (internal.globalSettings.execAllEventOnLoad === true) {
                        e = true
                    } else if (internal.getAttr(this, app._api.xstal_runonload) === "true") {
                        e = true
                    }
                    if (e === true) {
                        app.result.push(t(this))
                    }
                    internal.globalSettings.whenEachStop()
                });
                internal.globalSettings.whenAllStop();
                return app.result
            }()
        }
    };
    var app = this.Crystalize;
    var InternalFactory = function (that) {
        that.app = that.Crystalize;
        var within = this;
        this.CreateAPI = function () {
            this.api = {
                xstal_group_master: {
                    n: "xstal-group-master",
                    v: "oxstal_group_master"
                },
                xstal_master_class: {
                    n: ".xstal-master",
                    v: ".xstal-master"
                },
                xstal_group: {
                    n: "xstal-group",
                    v: "oxstal_group"
                },
                xstal_ret: {
                    n: "xstal-ret",
                    v: "oxstal_ret=html"
                },
                xstal_isasync: {
                    n: "xstal-isasync",
                    v: "false"
                },
                xstal_add: {
                    n: "xstal-add",
                    v: "/oxstal_add"
                },
                xstal_function: {
                    n: "xstal-function",
                    v: "oxstal_function"
                },
                xstal_event: {
                    n: "xstal-event",
                    v: "click"
                },
                xstal_querySeparator: {
                    n: "=",
                    v: "="
                },
                xstal_test: {
                    n: "xstal-test",
                    v: "false"
                },
                xstal_group_separator: {
                    n: ",",
                    v: ","
                },
                xstal_pre: {
                    n: "xstal-pre",
                    v: "oxstal_pre"
                },
                xstal_pos: {
                    n: "xstal-pos",
                    v: "oxstal_pos"
                },
                xstal_runonload: {
                    n: "xstal-runonload",
                    v: "false"
                },
                xstal_timeout: {
                    n: "xstal-timeout",
                    v: "2000"
                },
                xstal_ajaxresult: {
                    n: "xstal-ajaxresult",
                    v: ""
                }
            }
        };
        this.createNewElement = function (e) {
            var t = "<" + e.type + '  class="' + app._api.xstal_master_class.n.replace(".", "") + '"  ';
            t += "  " + app._api.xstal_group_master.n + '="' + e.oxstal_group_master + '"  ';
            t += "  " + app._api.xstal_group.n + '="' + e.oxstal_group + '"  ';
            t += "  " + app._api.xstal_ret.n + '="' + e.oxstal_ret + '"  ';
            t += "  " + app._api.xstal_isasync.n + '="' + e.oxstal_isasync + '"  ';
            t += "  " + app._api.xstal_add.n + '="' + e.oxstal_add + '"  ';
            t += "  " + app._api.xstal_function.n + '="' + e.oxstal_function + '"  ';
            t += "  " + app._api.xstal_event.n + '="' + e.oxstal_event + '"  ';
            t += "  " + app._api.xstal_test.n + '="' + e.oxstal_test + '"  ';
            t += "  " + app._api.xstal_pre.n + '="' + e.oxstal_pre + '"  ';
            t += "  " + app._api.xstal_pos.n + '="' + e.oxstal_pos + '"  ';
            t += "  " + app._api.xstal_runonload.n + '="' + e.oxstal_runonload + '"  ';
            t += "  " + app._api.xstal_timeout.n + '="' + e.oxstal_timeout + '"  ';
            t += "   " + app._api.xstal_ajaxresult.n + '="' + e.oxstal_ajaxresult + '"   ';
            var n = "  >" + e.obody + "</" + e.type + "  >";
            return t + " " + n
        };
        this.CURRENT_VERSION = "1.0.0";
        this.ScenarioObject = function () {
            this.type = "div";
            this.obody = "body";
            this.oxstal_group_master = app._api.xstal_group_master.v;
            this.oxstal_group = app._api.xstal_group.v;
            this.oxstal_ret = app._api.xstal_ret.v;
            this.oxstal_isasync = app._api.xstal_isasync.v;
            this.oxstal_add = app._api.xstal_add.v;
            this.oxstal_function = app._api.xstal_function.v;
            this.oxstal_event = app._api.xstal_event.v;
            this.oxstal_test = app._api.xstal_test.v;
            this.oxstal_pre = app._api.xstal_pre.v;
            this.oxstal_pos = app._api.xstal_pos.v;
            this.oxstal_runonload = app._api.xstal_runonload.v;
            this.oxstal_timeout = app._api.xstal_timeout.v;
            this.oxstal_ajaxresult = app._api.xstal_ajaxresult.v
        };
        this.mockFunction = function (e) { };
        this.mockMock = function (e) {
            conn = true
        };
        this.globalSettings = {
            dontMakeJQAjaxCall: false,
            forceSynchronousOnAllAjaxCalls: false,
            forceMockAllAjaxCalls: false,
            execAllEventOnLoad: false,
            resposeOfNoRequest: {},
            MockingFxMethod: within.mockMock,
            whenEventInvocking: within.mockFunction,
            whenEventInvocked: within.mockFunction,
            whenAllStart: within.mockFunction,
            whenAllStop: within.mockFunction,
            whenEachStart: within.mockFunction,
            whenEachStop: within.mockFunction,
            whenMockSet: within.mockFunction,
            whenEventMade: within.mockFunction,
            readyToAjaxcall: within.mockFunction,
            evalAFunction: function (x, y) {
                eval("try{" + x + "('error  " + y + "');}catch(e){}")
            },
            alertFunction: function (e) {
                alert(e)
            },
            confirmFunction: function (e) {
                return confirm(e)
            },
            internalHandler: function (e, t, n, r, i) {
                if (t !== undefined) {
                    if (t === "alert") {
                        internal.globalSettings.Handlers.alertP(e, n, r)
                    } else if (t === "confirm") {
                        internal.globalSettings.Handlers.confirmP(e, n, r)
                    } else if (t === "in") {
                        internal.globalSettings.Handlers.inP(e, n, r)
                    }
                }
            },
            Handlers: {
                alertP: function (e, t, n, r) {
                    internal.globalSettings.alertFunction(e)
                },
                confirmP: function (e, t, n, r) {
                    var i = internal.globalSettings.confirmFunction(e);
                    if (i === true) {
                        if (t !== undefined) {
                            internal.globalSettings.evalAFunction(t, e)
                        }
                    } else if (n !== undefined) {
                        internal.globalSettings.evalAFunction(n, e)
                    }
                },
                inP: function (e, t, n, r) {
                    if (t !== undefined) {
                        if (n !== undefined) {
                            $(t)[n](e)
                        }
                    }
                }
            },
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            dataType: "text",
            type: "POST"
        };
        this.executed = false;
        this.conn = true;
        this.extractDom = function (e, t) {
            var n = within.getAttr(t, app._api.xstal_ret).split(app._api.xstal_querySeparator.n);
            var r = {};
            if (n[1] !== "attr") {
                r = $(t)[n[1]]()
            } else {
                if (n[2] !== "css") {
                    r = $(t).attr(n[2])
                } else {
                    r = $(t).css(n[3])
                }
            }
            e[n[0]] = r
        };
        this.QueryDom = function (e, t) {
            var n = {};
            $(e).each(function () {
                if (within.IsInGroup(this, t) === true) {
                    within.extractDom(n, this)
                }
            });
            return n
        };
        this.IsInGroup = function (e, t, n) {
            var r = within.getAttr(t, app._api.xstal_group_master);
            var i = within.getAttr(e, app._api.xstal_group);
            if (i === undefined) {
                return false
            }
            if (r === undefined) {
                return false
            }
            var s = r.split(app._api.xstal_group_separator.n);
            var o = i.split(app._api.xstal_group_separator.n);
            var u = o.length;
            var a = s.length;
            for (var f = 0; f < u; f++) {
                for (var l = 0; l < a; l++) {
                    if (s[l] === o[f]) {
                        return true
                    }
                }
            }
            return false
        };
        this.getAttr = function (e, t) {
            var n = $(e).attr("data-" + t.n);
            if (n === undefined || n.trim() === "") {
                n = $(e).attr(t.n)
            }
            if (n === undefined || n.trim() === "") {
                return t.v
            }
            return n
        }
    };
    var internal = new InternalFactory(this);
    app._api = (new internal.CreateAPI).api;
    this.Crystalize.begin("*")
}).call(this)