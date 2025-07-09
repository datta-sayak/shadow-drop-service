export function requestLogs ( req, res, next ) {
    const startTime = Date.now()
    res.on("finish", () => {
        const endTime = Date.now()
        const elapsedTime = endTime - startTime
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${elapsedTime}ms IP-[${req.ip}]`);
    })
    next();
}