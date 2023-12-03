const parser = require('lambda-multipart-parser');
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*'
}

exports.handler = async (event) => {
    const result = await parser.parse(event);

    return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
            result: result
        })
    }
};
