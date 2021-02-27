const static = require('koa-static');
const path = require('path');

function serverPluginServerStatic({ app, root}) {
    // app.use(async (ctx, next) => { // 注册一个中间件

    // })
    console.log(root, '=================')
    // vite 在哪里运行 就以那个目录启动静态服务
    app.use(static(root));
    // 以public作为静态服务
    app.use(static(path.join(root, 'public')));
}



// 解构的方式导出 静态服务插件
exports.serveStaticPlugin = serverPluginServerStatic;