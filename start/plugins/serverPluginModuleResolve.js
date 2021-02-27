const moduleREG = /\/@modules\//;
const fs = require('fs').promises;
const path = require('path');

function vueResolve(root) {
    // vue3 由及部分组成 runtime-demo runtime-core reactivity shared 在后端中解析 .vue 文件 compiler-sfc
    const compilerPkgPath = path.join(root, 'node_modules', '@vue/compiler-sfc/package.json');

    const compilerPkg = require(compilerPkgPath); // 获取的是 json 中的内容
    // node_modules/@vue/compiler-sfc/dist/compiler-scf.cjs.js
    const compilerPath = path.join(path.dirname(compilerPkgPath), compilerPkg.main);

    const resolvePath = name => path.resolve(root, 'node_modules', `@vue/${name}/dist/${name}.esm-bundler.js`);

    const runtimeDomPath = resolvePath('runtime-dom');
    const runtimeCorePath = resolvePath('runtime-core');
    const reactivityPath = resolvePath('reactivity');
    const sharedPath = resolvePath('shared');

    // esmModule 模块 前端

    // 映射关系
    return {
        compiler: compilerPath, // 适用于稍后后端进行编译的文件路径
        '@vue/runtime-dom': runtimeDomPath,
        '@vue/runtime-core': runtimeCorePath,
        '@vue/reactivity': reactivityPath,
        '@vue/shared': sharedPath,
        vue: runtimeDomPath
    }
}

function moduleResolvePlugin({ app, root }) {
    const vueResolved = vueResolve(root)
    
    app.use(async (ctx, next) => {
        if (!moduleREG.test(ctx.path)) {//处理当前请求的路径 是否以 / @modules 开头
            return next(); // 不 return 可以么
        } 
        // 将 /@modules 替换掉 vue

        const id = ctx.path.replace(moduleREG, '')
        console.log('id =====》', ctx.path, id);
        ctx.type = 'js' // 设置响应类型 响应的结果是 js 类型
        // 应该去当前项目下查找 vue 对用的真实的文件
        const content = await fs.readFile(vueResolved[id], 'utf8');

        ctx.body = content; // 返回读取出来的结果

        
    })
}

exports.moduleResolvePlugin = moduleResolvePlugin;