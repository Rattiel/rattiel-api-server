const parser = require('lambda-multipart-parser');

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*'
}

exports.handler = async (event) => {
    const formData = new FormData(event.body);

    return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
            message: JSON.stringify(formData)
        })
    }
};
