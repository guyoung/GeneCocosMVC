MVCHelloWorld：Cocos2d-js MVC模块化开发（02）
===========================================


Browserify 使用

## Browserify简介

Browserify是一个node.js模块，允许你在浏览器中使用require。

Browserify是NPM在前端项目里延伸的神器,有了它之后，前后端可以共用一个CommonJS规范的模块。


Browserify 通过预编译的方法，让Javascript前端可以直接使用Node后端的程序。我们可以用一套代码完成前后端，不仅工作量变少了，程序重用性增强，还可以直接在浏览器中使用大量的NPM第三方开源库的功能。

## 安装 browserify

首先，安装Node.js。

使用NPM，安装browserify
  
    npm install -g browserify
  
因为这是命令行使用的,所以推荐使用-g参数


## Browserify命令

    browserify [entry files] {OPTIONS}
 
OPTIONS：
    
* -outfile, -o: browserify日志打印到文件
* -require, -r: 绑定模块名或文件，用逗号分隔
* -entry, -e: 应用程序的入口
* -ignore, -i: 省略输出
* -external, -x: 从其他绑定引入文件
* -transform, -t: 对上层文件进行转换
* -command, -c: 对上层文件使用转换命令
* -standalone -s: 生成一个UMB的绑定的接口，提供给其他模块使用。
* -debug -d: 激活source maps调试文件
* -help, -h: 显示帮助信息

## 使用 browserify

首先定义一个commonjs规范的模块，功能比较简单,名为calcu.js
  
    var calcu = {
        add: function(a, b){
            return a + b;
        },
        subtract: function(a, b){
            return a - b;
        }
    }
    // 此处对外导出模块功能
    module.exports = calcu;
  
然后我们来定义一个使用这个模块的文件,名为app.js
  
    // 此处引用模块跟`nodejs`里一样
    var app = require('./calcu.js')
  
    alert(calcu.add(8, 5));
    alert(calcu.subtract(8, 5));
    
也可以使用 npm 机制加载 node_modules下的模块。  
  
    var _ = require("underscore")._;

    _.each([1, 2, 3], function (ele, idx) {
        alert(idx + ":" + ele);
    });
  
  
假如直接在html文件里引用app.js文件的话，肯定会报错。
  
执行browserify命令就
  
    browserify app.js app-all.js
  
上面的app-all.js可以自定义别的名字,最后只需要把这个新生成的文件引入到html文件内即可，不用再引入别的文件
  
    <!doctype html>
    <html>
    <head>
        <title></title>
        <meta charset="utf8">
    </head>
    <body>  
        <script src="js/app-all.js"></script>
    </body>
    </html>
  
最后在Chrome里打开这个页面进行测试，

calcu.js文件也可以拿到Node.js里去引用，因为它遵守commonjs规范。




## 源代码

- 本文代码：https://github.com/guyoung/GeneCocosMVC/tree/master/MVCHelloWorld-Part02
- 项目地址：https://github.com/guyoung/GeneCocosMVC

### 编译及运行

browserify

    browserify MVCHelloWorld-Part02\js\app.js -o MVCHelloWorld-Part02\js\app-all.js
    or
    browserify MVCHelloWorld-Part02\js\app.js -o MVCHelloWorld-Part02\js\app-all.js --debug

uglifyjs

    uglifyjs MVCHelloWorld-Part02\js\app-all.js -o MVCHelloWorld-Part02\js\app-all.js


http-server

    node_modules\.bin\http-server.cmd


## 参见

## 参考资料


## 外部链接


------------------------------------------------

<https://github.com/guyoung/GeneCocosMVC>

By Guyoung Studio 

<http://www.guyoung.net>

