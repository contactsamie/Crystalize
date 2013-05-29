
(function () {
    var rootWin = this;
    var runonce = false;
    this.Crystalize = {

        script: {

        },

        result: [],

        conf: function () {
            return {
                all: internal.globalSettings,
                api: app._api

            };
        },

        all: function (g) {
            $.extend(internal.globalSettings, g);
        },

        ver: function () {
            return internal.CURRENT_VERSION;
        },

        _api: {},

        make: function () {
            return new internal.ScenarioObject();
        },

        dom: function (o) {
            return internal.createNewElement(o);
        },

        stat: function () {
            return {
                connection: internal.conn
            };
        },

        reset: function (mockClearFunction) {
            if (typeof mockClearFunction === "function") {
                mockClearFunction();
            }

            app.result = [];
            internal = new InternalFactory(this);
            app._api = new internal.CreateAPI().api;
            app.result = [];
        },

        begin: function (selector) {

            if (internal.executed === true)
                return;

            var runScript = function (scr, test) {
                for (var ea in scr) {
                    for (var eb in scr[ea]) {
                        if (eb !== "type") {
                            if (eb === "class") {
                                $(scr[ea]["type"] + ea).addClass(scr[ea][eb]);
                            } else {

                                internal.globalSettings.addAttr(scr[ea]["type"] + ea, eb, scr[ea][eb]);
                            }
                        }
                    }
                }
                if (test === true) {
                  //  var parame = internal.QueryDom(scr[ea]["type"] + ea, othat);
                }

            }

            if (CrystalScript !== undefined) {
                if (typeof CrystalScript === "object") {
                    app.script = CrystalScript;

                    if (runonce === false) {
                        runScript(app.script, true);
                        runonce = true;
                    }
                }
            }
            internal.executed = true;

            internal.globalSettings.whenAllStart();

            var createRequestObject = function (othat) {
                var runOnLoad = internal.getAttr(othat, app._api.xstal_runonload);
                internal.globalSettings.whenEventInvocking();
                var parame = internal.QueryDom(selector, othat);


                var a_obj = {
                    async: internal.getAttr(othat, app._api.xstal_isasync),
                    url: internal.getAttr(othat, app._api.xstal_add),
                    data: {
                        request: [
                          internal.getAttr(othat, app._api.xstal_function),
                          parame
                        ]
                    },
                    contentType: internal.globalSettings.contentType,
                    dataType: internal.globalSettings.dataType,
                    type: internal.globalSettings.type,
                    timeout: parseInt(internal.getAttr(othat, app._api.xstal_timeout), 10),

                    success: function (data, textStatus, jqXHR) {


                        var result = { status: "success", textStatus: textStatus, data: data, JqXHR: jqXHR };

                        var clientHandlingMethod = internal.getAttr(othat, app._api.xstal_ajaxresult);

                        if (clientHandlingMethod !== "") {

                            if (clientHandlingMethod.contains("*")) {
                                var q = clientHandlingMethod.replace("*", "");
                                var s = q.split(",");
                                internal.globalSettings.internalHandler(data, s[0], s[1], s[2], s[3]);
                            } else {
                                internal.globalSettings.evalAFunction(clientHandlingMethod, data);

                            }
                        }

                        // console.log(result);

                    },
                    error: function (jqXHR, textStatus, data) {


                        var result = { status: "error", textStatus: textStatus, data: data, JqXHR: jqXHR };

                        var clientHandlingMethod = internal.getAttr(othat, app._api.xstal_ajaxresult);


                        if (clientHandlingMethod !== "") {
                            if (clientHandlingMethod.contains("*")) {
                                var q = clientHandlingMethod.replace("*", "");
                                var s = q.split(",");
                                internal.globalSettings.internalHandler(data, s[0], s[1], s[2], s[3]);
                            } else {
                                internal.globalSettings.evalAFunction(clientHandlingMethod, "error  " + data);

                            }
                        }
                    }

                };

                if (internal.globalSettings.forceSynchronousOnAllAjaxCalls === true) { //override all assync call specified
                    a_obj.async = false;
                } else {
                    if (a_obj.async === "true") {
                        a_obj.async = true;
                    } else {
                        a_obj.async = false;
                    }
                }

                var mockParameter = {};

                mockParameter = new function () {

                    this.async = a_obj.async;
                    this.url = a_obj.url;
                    this.responseTime = a_obj.timeout;
                    this.dataType = a_obj.dataType;
                    this.response = a_obj.success;
                    this.contentType = 'text/json';
                    this.responseText = internal.globalSettings.resposeOfNoRequest;

                };

                if (internal.globalSettings.forceMockAllAjaxCalls === true) {

                    mockAllAjaxCalls(internal.globalSettings.MockingFxMethod, mockParameter);
                } else if (internal.getAttr(othat, app._api.xstal_test) === "true") {

                    //this is differential mocking by remote locationyet to fully implement diferential ajax mocking
                    mockAllAjaxCalls(internal.globalSettings.MockingFxMethod, mockParameter);
                }

                var resp = {};//= MakeAjaxCall(a_obj, internal.globalSettings.dontMakeJQAjaxCall).responseText;
                if (internal.globalSettings.dontMakeJQAjaxCall === false) {
                    internal.globalSettings.readyToAjaxcall();
                    resp = $.ajax(a_obj);
                    console.log(a_obj);
                } else {
                    internal.conn = false;
                    resp = {
                        responseText: internal.globalSettings.resposeOfNoRequest
                    };
                }



                internal.globalSettings.whenEventInvocked();
                return {
                    response: resp,
                    connection: internal.conn,
                    ranOnLoad: runOnLoad,
                    assync: a_obj.async,
                    element: othat,
                    request: a_obj,
                    settings: app.conf()
                };



            };

            var mockAllAjaxCalls = function (methodMock, paramet) {
                internal.conn = false;
                internal.globalSettings.whenMockSet();

                methodMock(paramet);
            };

            var that = {};
            return (function () {
                $(app._api.xstal_master_class.v).each(function () {
                    internal.globalSettings.whenEachStart();
                    $(this).on(internal.getAttr(this, app._api.xstal_event), function (e) { e.stopPropagation(); return createRequestObject(this); });

                    that = this;

                    internal.globalSettings.whenEventMade();

                    var flag = false;
                    if (internal.globalSettings.execAllEventOnLoad === true) {
                        flag = true;
                    } else if (internal.getAttr(this, app._api.xstal_runonload) === "true") {
                        flag = true;
                    }

                    if (flag === true) {
                        app.result.push(createRequestObject(this));
                    }

                    internal.globalSettings.whenEachStop();
                });
                internal.globalSettings.whenAllStop();

                return app.result;
            })();
        }

    };

    var app = rootWin.Crystalize;

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

        this.createNewElement = function (o) {
            var builder_open = '<' + o.type + '  class="' + app._api.xstal_master_class.n.replace(".", "") + '"  ';
            builder_open += '  ' + app._api.xstal_group_master.n + '="' + o.oxstal_group_master + '"  ';
            builder_open += '  ' + app._api.xstal_group.n + '="' + o.oxstal_group + '"  ';
            builder_open += '  ' + app._api.xstal_ret.n + '="' + o.oxstal_ret + '"  ';
            builder_open += '  ' + app._api.xstal_isasync.n + '="' + o.oxstal_isasync + '"  ';
            builder_open += '  ' + app._api.xstal_add.n + '="' + o.oxstal_add + '"  ';
            builder_open += '  ' + app._api.xstal_function.n + '="' + o.oxstal_function + '"  ';
            builder_open += '  ' + app._api.xstal_event.n + '="' + o.oxstal_event + '"  ';
            builder_open += '  ' + app._api.xstal_test.n + '="' + o.oxstal_test + '"  ';
            builder_open += '  ' + app._api.xstal_pre.n + '="' + o.oxstal_pre + '"  ';
            builder_open += '  ' + app._api.xstal_pos.n + '="' + o.oxstal_pos + '"  ';
            builder_open += '  ' + app._api.xstal_runonload.n + '="' + o.oxstal_runonload + '"  ';
            builder_open += '  ' + app._api.xstal_timeout.n + '="' + o.oxstal_timeout + '"  ';
            builder_open += '   ' + app._api.xstal_ajaxresult.n + '="' + o.oxstal_ajaxresult + '"   ';
            var builder_close = '  >' + o.obody + '</' + o.type + '  >';

            return builder_open + " " + builder_close;


        };
        this.CURRENT_VERSION = '1.0.0';
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
            this.oxstal_ajaxresult = app._api.xstal_ajaxresult.v;
        };
        this.mockFunction = function (o) { };
        this.mockMock = function (o) {
            conn = true; // no mock ajax supplied
        };
        this.globalSettings = {
            dontMakeJQAjaxCall: false,
            forceSynchronousOnAllAjaxCalls: false,
            forceMockAllAjaxCalls: false,
            execAllEventOnLoad: false,
            resposeOfNoRequest: {},
            MockingFxMethod: within.mockMock, //mock ajax place holder
            whenEventInvocking: within.mockFunction,
            whenEventInvocked: within.mockFunction,
            whenAllStart: within.mockFunction, //**
            whenAllStop: within.mockFunction, //**
            whenEachStart: within.mockFunction, //**
            whenEachStop: within.mockFunction, //**
            whenMockSet: within.mockFunction, //**
            whenEventMade: within.mockFunction, //**
            readyToAjaxcall: within.mockFunction, //**
            evalAFunction: function (x, y) {
                eval("try{" + x + "('error  " + y + "');}catch(e){}");
            },
            alertFunction: function (o) {
                alert(o);
            },
            confirmFunction: function (o) {
                return confirm(o);
            },
            internalHandler: function (o, x, y, z, w) {
                if (x !== undefined) {
                    if (x === "alert") {
                        internal.globalSettings.Handlers.alertP(o, y, z);
                    } else if (x === "confirm") {
                        internal.globalSettings.Handlers.confirmP(o, y, z);
                    }
                    else if (x === "in") {
                        internal.globalSettings.Handlers.inP(o, y, z);
                    }
                }
            },
            Handlers: {
                alertP: function (o, y, z, w) {
                    internal.globalSettings.alertFunction(o);
                },
                confirmP: function (o, y, z, w) {
                    var c = internal.globalSettings.confirmFunction(o);

                    if (c === true) {
                        if (y !== undefined) {
                            internal.globalSettings.evalAFunction(y, o);
                        }

                    } else if (z !== undefined) {
                        internal.globalSettings.evalAFunction(z, o);
                    }
                },
                inP: function (o, y, z, w) {
                    if (y !== undefined) {
                        if (z !== undefined) {
                            $(y)[z](o);
                        }
                    }
                }
            },
            addAttr: function (r, a, v) {
                $(r).attr(a, v);
            },
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            dataType: "text",
            type: "POST"
        };
        this.executed = false;
        this.conn = true;
        this.extractDom = function (pa, currentElemen) {
            var s = within.getAttr(currentElemen, app._api.xstal_ret).split(app._api.xstal_querySeparator.n);
            var retval = {};
            if (s[1] !== "attr") {
                retval = ($(currentElemen)[s[1]])();
            } else {
                if (s[2] !== "css") {
                    retval = $(currentElemen).attr(s[2]);
                } else {
                    retval = $(currentElemen).css(s[3]);
                }
            }
            pa[s[0]] = retval;
        };
        this.QueryDom = function (selector, othat) {
            var parame = {};
            $(selector).each(function () {
                if (within.IsInGroup(this, othat) === true) {
                    within.extractDom(parame, this);
                }
            });
            return parame;
        };
        this.IsInGroup = function (ref, refthat, grp) {
            var atrthat = within.getAttr(refthat, app._api.xstal_group_master);
            var atr = within.getAttr(ref, app._api.xstal_group);
            if (atr === undefined) {
                return false;
            }
            if (atrthat === undefined) {
                return false;
            }
            var grpsthat = atrthat.split(app._api.xstal_group_separator.n);
            var grps = atr.split(app._api.xstal_group_separator.n);
            var tot = grps.length;
            var totthat = grpsthat.length;

            for (var i = 0; i < tot; i++) {
                for (var j = 0; j < totthat; j++) {
                    if (grpsthat[j] === grps[i]) {
                        return true;
                    }
                }
            }
            return false;
        };
        this.getAttr = function (ref, attr) {
            var at = $(ref).attr("data-" + attr.n);
            if (at === undefined || at.trim() === "") {
                at = $(ref).attr(attr.n);
            }
            if (at === undefined || at.trim() === "") {
                return attr.v;
            }
            return at;

        };

    };

    var internal = new InternalFactory(rootWin);

    app._api = new internal.CreateAPI().api;

    console.log(this.CrystalScript);
    rootWin.Crystalize.begin("*");


}).call(this);

