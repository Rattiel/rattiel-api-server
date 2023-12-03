const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*'
}

exports.handler = async (event) => {
    return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
            message: "hello world"
        })
    }
};
