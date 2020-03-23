const express = require('express');
const redis = require('redis');

const app = express();
const process = require('process');

const client = redis.createClient({
    host: 'redis-server',
    port: 6379
});

app.get("/:fac", (req, resp) => {
    const fac = req.params.fac;
    //console.log('New request');
    //process.exit(0);
    if (fac < 10) {
        client.get(fac, (err, r) => {
            if(err || r === null) {
                const result = countFac(fac);
                client.set(fac, result);
                resp.send('Result: ' + result);
            } else {
                resp.send('Result from cache: ' + r)
            }
        })
    } else {
        process.exit(1);
    }
});


const countFac = n => {
    if (n === 0) {
        return 1;
    } else {
        return n * countFac(n - 1);
    }
}

app.listen(8080, () => {
    console.log("Server listening on port 8080");
});