const multipart = require("parse-multipart");
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*'
}

exports.handler = async (event) => {
    const bodyBuffer = new Buffer(event.body.toString(), "base64");
    let boundary = multipart.getBoundary(event.params.header['content-type']);
    let parts = multipart.Parse(bodyBuffer, boundary);

    return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
            parts: parts
        })
    }
};
