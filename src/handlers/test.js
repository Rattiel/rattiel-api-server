const parser = require('lambda-multipart-parser');

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*'
}

exports.handler = async (event) => {
    const formData = JSON.parse(event.body);

    return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
            message: JSON.stringify(event)
        })
    }
};
