const { readBody } = require('./utils')
const { parse } = require('es-module-lexer'); // 解析 import 成 AST 语法树的包
const MagicString = require('magic-string'); // 用来修改字符串的 因为字符串具有不变性

function rewriteImports(source) {
    let imports = parse(source)[0];
    let magicString = new MagicString(source)
    if (imports.length) {
        for (let i = 0; i < imports.length; i++) {
            let { s, e } = imports[i],
                id = source.substring(s, e);
            if (/^[^\/\.]/.test(id)) {
                id = `/@modules/${id}`;
                magicString.overwrite(s, e, id);
            }
        }
    }
    // 增加 /@modules 浏览器会再次发送请求， 服务器要拦截 带有 /@modules 前缀的请求进行处理

    return magicString.toString(); // 将替换后的结果返回
}


function moduleRewritePlugin({ app, root }) { // 启动项目时的路径
    app.use(async (ctx, next) => {
        await next();

        // 完善了自己的逻辑 洋葱模型
        
        // 读取流中的数据
        // let content = await readBody(ctx.body); // 重写内容 将重写后的结果返回回去
        
        // console.log('=====', content);
        if (ctx.body && ctx.response.is('js')) {
            let content = await readBody(ctx.body);
            // 重写内容 将重写后的结果返回回去
            const result = rewriteImports(content);

            ctx.body = result; // 将内容重写并且返回
        }
        
    })
}

exports.moduleRewritePlugin = moduleRewritePlugin;