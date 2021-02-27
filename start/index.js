const Koa = require('koa')
const { serveStaticPlugin } = require('./plugins/serverPluginServerStatic'); // 服务端 启动静态服务的插件
const { moduleRewritePlugin } = require('./plugins/serverPluginModuleRewrite');
const { moduleResolvePlugin } = require('./plugins/serverPluginModuleResolve');

function createServer() {
    const app = new Koa();
    const root = process.cwd(); // 进程当前的工作目录 输出命令并执行的目录

    // 当用户运行 npm run my-dev 时 会创建服务

    // koa 时基于中间件来运行的
    const context = {
        app,
        root
    }

    
    const resolvedPlugins = [ // 插件的集合
        // 2）解析 import 重写路径
        moduleRewritePlugin,

        // 3) 解析 以@/modules 文件开头的内容 找到对应的结果
        moduleResolvePlugin,

        // 1） 要实现静态服务的功能
        serveStaticPlugin, // 功能是读取文件，将文件的结果放到了 ctx.body 上


    ]

    resolvedPlugins.forEach(plugin => plugin(context))

    return app;
}

module.exports = createServer;