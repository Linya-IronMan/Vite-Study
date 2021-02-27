const { Readable } = require('stream');

async function readBody(stream) {
    // koa 中要求所有异步方法必须包装成Promise

    if (stream instanceof Readable) {
        return new Promise((resolve, reject) => {
            let res = '';
            stream.on('data', data => {
                res += data;
            });

            stream.on('end', () => {
                resolve(res);
            })
        })
    } else {
        return stream.toString(); 
    }
}

exports.readBody = readBody;