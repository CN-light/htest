var fs = require("fs");
const fileUtils = {
    // 检查.hest文件是否符合要求
    planFileCheck: function (fileText) {
        var obj = JSON.parse(fileText);
        // var flag = true;
        return obj;
    },
    // 检查写有http请求参数的文件是否符合要求
    httpParaFileCheck: function (fileText) {

    },
    // 检查写有http请求头部参数的文件是否符合要求
    httpHeaderFileCheck: function (fileText) {

    },
    // 检查写有cookie信息的文件是否符合要求
    cookieFileCheck: function (fileText) {

    },
    // 将指定信息保存到指定文件
    fileSave: function (fileText, path) {
        fs.writeFile(path, fileText,  function(err) {
            if (err) {
                return console.error(err);
            }
        })
    },
    // 读取指定文件，返回json对象
    fileRead: function (path) {      
        var data = fs.readFileSync(path);
        var obj = JSON.parse(data);
        return obj;
    }
}
export default fileUtils;