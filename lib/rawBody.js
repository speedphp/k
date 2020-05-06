module.exports = () => {
    return async (ctx, next) => {
        let rawBody = await addListener(ctx)
        ctx.request.rawBody = rawBody
        await next()
    }
}

function addListener(ctx) {
    let str = ''
    return new Promise((resolve, reject) => {
        ctx.req.addListener('error', (msg) => {
            reject(msg)
        })
        ctx.req.addListener('data', (data) => {
            str += data
        })
        ctx.req.addListener('end', () => {
            resolve(str)
        })
    })
}