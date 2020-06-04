var fs = require("fs");
const fileUtils = {
    // 检查.hest文件是否符合要求
    planFileCheck: function (fileText) {
        var obj = JSON.parse(fileText);
        //是否存在树的根节点
        if (obj.start.data == undefined) {
            return 1;
        }
        //树的根节点是否符合要求
        var treeData = obj.start.data[0];
        if (treeData.id != "1100001" || treeData.label == "" || treeData.label == undefined || treeData.children == undefined) {
            console.log(treeData.id)
            return 2;
        }
        //根节点的信息是否符合要求
        var testPlan = obj.testPlan;
        if (testPlan.id != "1100001") {
            return 3;
        }
        if (testPlan.mode != "jiaya" && testPlan.mode != "dingshi" && testPlan.mode != "shunxu") {
            return 4;
        }
        if (testPlan.serverIp == "" || testPlan.serverIp == undefined) {
            return 65;
        }
        if (testPlan.date == "dingshi") {
            if (!(/\d{4}-\d{2}-\d{2}/.test(testPlan.date))) {
                return 5;
            }
        }
        if (testPlan.time == "dingshi") {
            if (!(/\d{2}:\d{2}:\d{2}/.test(testPlan.time))) {
                return 6;
            }
        }
        if (testPlan.logLevel != "ERROR" && testPlan.logLevel != "INFO" && testPlan.logLevel != "DEBUG"
            && testPlan.logLevel != "ALL" && testPlan.logLevel != "OFF" && testPlan.logLevel != "TRACE"
            && testPlan.logLevel != "WARN" && testPlan.logLevel != "FATAL" && testPlan.logLevel != "TRACE") {
            return 7;
        }
        if (testPlan.region != "continue" && testPlan.region != "stop") {
            return 8;
        }
        if (testPlan.others == undefined) {
            return 9;
        }
        //检查vuser
        var children1 = treeData.children;
        if (children1 == undefined) {
            return 10;
        }
        for (let i = 0; i < children1.length; i++) {
            if (children1[i].id.substring(0, 1) == "7" || children1[i].id.substring(0, 1) == "2") {
                //是否存在记录此vuser的数据
                var vusers = obj.vUserGroup;
                if (vusers == undefined) {
                    return 11;
                }
                var flag = false;
                for (let j = 0; j < vusers.length; j++) {
                    if (vusers[j].id == children1[i].id) {
                        //存在记录此vuser的数据，检查是否符合要求
                        flag = true;
                        if (children1[i].id.substring(0, 1) == "7") {
                            if (vusers[j].mode != "same") {
                                return 12;
                            }
                        }
                        if (children1[i].id.substring(0, 1) == "2") {
                            if (vusers[j].mode != "different") {
                                return 13;
                            }
                        }
                        if (vusers[j].name != children1[i].label) {
                            return 14;
                        }
                        if (vusers[j].number <= 0 || vusers[j].number > 500 || vusers[j].number == undefined) {
                            return 15;
                        }
                        if (vusers[j].intervalTime < 0 || vusers[j].intervalTime == undefined) {
                            return 16;
                        }
                        if (vusers[j].cycleCount < 1 || vusers[j].cycleCount == undefined) {
                            return 17;
                        }
                        if (vusers[j].increment < 0 || vusers[j].increment > 20 || vusers[j].increment == undefined) {
                            return 18;
                        }
                        if (vusers[j].prefix == undefined) {
                            return 19;
                        }
                        if (children1[i].children == undefined) {
                            return 20;
                        }
                        //检查request
                        if (children1[i].children.length > 0) {
                            let children2 = children1[i].children;
                            for (let k = 0; k < children2.length; k++) {
                                if (children2[k].id.substring(0, 1) == "5") {
                                    //是否存在此request记录的数据
                                    var rflag = false;
                                    var requests = obj.httpRequest;
                                    if (requests == undefined) {
                                        return 21;
                                    }
                                    for (let l = 0; l < requests.length; l++) {
                                        if (requests[l].id == children2[k].id) {
                                            rflag = true;
                                            //存在此request记录的数据，检查是否符合要求
                                            if (requests[l].name != children2[k].label) {
                                                return 22;
                                            }
                                            if (requests[l].ip == "" || requests[l].ip == undefined) {
                                                return 23;
                                            }
                                            if (requests[l].protocol != "http") {
                                                return 24;
                                            }
                                            if (requests[l].port == undefined) {
                                                return 25;
                                            }
                                            if (requests[l].port != "" && !/\d+/.test(requests[l].port)) {
                                                return 26;
                                            }
                                            if (requests[l].path == undefined) {
                                                return 27;
                                            }
                                            if (requests[l].method != "get" && requests[l].method != "post" && requests[l].method != "put"
                                                && requests[l].method != "head" && requests[l].method != "delete" && requests[l].method != "options"
                                                && requests[l].method != "trace" && requests[l].method != "patch") {
                                                return 28;
                                            }
                                            if (requests[l].contentType == undefined) {
                                                return 29;
                                            }
                                            if (requests[l].random != "use" && requests[l].random != "unuse") {
                                                return 30;
                                            }
                                            if (requests[l].random = "use" && obj.randomVars == undefined) {
                                                return 31;
                                            }
                                            if (requests[l].rdata == undefined) {
                                                return 32;
                                            }
                                            if (children2[k].children == undefined) {
                                                return 33;
                                            }
                                            if (children2[k].children.length > 0) {
                                                let children3 = children2[k].children;
                                                for (let m = 0; m < children3.length; m++) {
                                                    if (children3[m].id.substring(0, 1) == "3") {
                                                        let para = obj.paraTable;
                                                        let pflag = false;
                                                        if (para == undefined) {
                                                            return 40;
                                                        }
                                                        for (let n = 0; n < para.length; n++) {
                                                            if (children3[m].id == para[n].id) {
                                                                pflag = true;
                                                                if (para[n].tableData == undefined) {
                                                                    return 41;
                                                                }
                                                            }
                                                        }
                                                        if (!pflag) {
                                                            return 42;
                                                        }
                                                    } else if (children3[m].id.substring(0, 1) == "4") {
                                                        let headers = obj.httpHeader;
                                                        let hflag = false;
                                                        if (headers == undefined) {
                                                            return 43;
                                                        }
                                                        for (let n = 0; n < headers.length; n++) {
                                                            if (children3[m].id == headers[n].id) {
                                                                hflag = true;
                                                            }
                                                            if (headers[n].tableData == undefined) {
                                                                return 44;
                                                            }
                                                        }
                                                        if (!hflag) {
                                                            return 45;
                                                        }
                                                    } else {
                                                        return 46;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (!rflag) {
                                        return 47;
                                    }
                                } else if (children2[k].id.substring(0, 1) == "3") {
                                    let para = obj.paraTable;
                                    let pflag = false;
                                    if (para == undefined) {
                                        return 48;
                                    }
                                    for (let l = 0; l < para.length; l++) {
                                        if (children2[k].id == para[l].id) {
                                            pflag = true;
                                            if (para[l].tableData == undefined) {
                                                return 49;
                                            }
                                        }
                                    }
                                    if (!pflag) {
                                        return 50;
                                    }
                                } else if (children2[k].id.substring(0, 1) == "4") {
                                    let headers = obj.httpHeader;
                                    let hflag = false;
                                    if (headers == undefined) {
                                        return 51;
                                    }
                                    for (let l = 0; l < headers.length; l++) {
                                        if (children2[k].id == headers[l].id) {
                                            hflag = true;
                                        }
                                        if (headers[l].tableData == undefined) {
                                            return 52;
                                        }
                                    }
                                    if (!hflag) {
                                        return 53;
                                    }
                                } else {
                                    return 54;
                                }
                            }
                        }
                    }
                }
                if (!flag) {
                    return 55;
                }
            } else if (children1[i].id.substring(0, 1) == "3") {
                let para = obj.paraTable;
                let pflag = false;
                if (para == undefined) {
                    return 56;
                }
                for (let j = 0; j < para.length; j++) {
                    if (children1[i].id == para[j].id) {
                        pflag = true;
                        if (para[j].tableData == undefined) {
                            return 57;
                        }
                    }
                }
                if (!pflag) {
                    return 58;
                }
            } else if (children1[i].id.substring(0, 1) == "4") {
                let headers = obj.httpHeader;
                let hflag = false;
                if (headers == undefined) {
                    return 59;
                }
                for (let j = 0; j < headers.length; j++) {
                    if (children1[i].id == headers[j].id) {
                        hflag = true;
                    }
                    if (headers[j].tableData == undefined) {
                        return 60;
                    }
                }
                if (!hflag) {
                    return 61;
                }
            } else if (children1[i].id.substring(0, 1) == "8") {
                var vars = obj.randomVars;
                if (vars.id != children1[i].id) {
                    return 62;
                }
                if (vars.tableData == undefined) {
                    return 63;
                }
            } else {
                return 64;
            }
        }

        //判断id是否重复
        var map = new Map();

        return 0;
    },
    // 检查写有http请求参数的文件是否符合要求
    httpParaFileCheck: function (fileText) {
        var t = fileText.replace(/[\r\n]/g, "").replace(/[\{\}\[\]]/g, "").replace(/[ \t]/g, "")+",";
        if(/("key":"[a-zA-Z0-9_\-]*","value":"[a-zA-Z0-9_\-]*","ecoding":"[a-zA-Z0-9_\-]*",)*/.test(fileText)){
            return true;
        }
        return false;
    },
    // 检查写有http请求头部参数的文件是否符合要求
    httpHeaderFileCheck: function (fileText) {
        var t = fileText.replace(/[\r\n]/g, "").replace(/[\{\}\[\]]/g, "").replace(/[ \t]/g, "")+",";
        if(/("key":"[a-zA-Z0-9_\-]*","value":"[a-zA-Z0-9_\-]*",)*/.test(fileText)){
            return true;
        }
        return false;
    },
    // 检查写有随机变量的文件是否符合要求
    randomFileCheck: function (fileText) {
        var t = fileText.replace(/[\r\n]/g, "").replace(/[\{\}\[\]]/g, "").replace(/[ \t]/g, "").replace(/[\"value:]/g,"")+",";
        if(/(.+,)+/.test(fileText)){
            return true;
        }
        return false;
    },
    // 将指定信息保存到指定文件
    fileSave: function (fileText, path) {
        fs.writeFile(path, fileText, function (err) {
            if (err) {
                return console.error(err);
            }
        });
    },
    // 读取指定文件，返回json对象
    fileRead: function (path) {
        var data = fs.readFileSync(path);
        return data.toString();
    },
    planFileRead: function (path) {
        var data = fs.readFileSync(path);
        if (this.planFileCheck(data) == 0) {
            return JSON.parse(data);
        }
        return undefined;
    },
    // 判断文件内容与内存中内容是否一致
    checkFileChanged: function (path, fileText) {
        var fileData = fs.readFileSync(path);
        return (fileData == fileText);
    }
}
export default fileUtils;