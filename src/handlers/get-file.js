const {S3Client, GetObjectCommand} = require("@aws-sdk/client-s3")

const BUCKET = "rattiel-storage";

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*'
}

const client = new S3Client({
    region: "ap-northeast-2"
});

exports.handler = async (event) => {
    const user = event?.requestContext?.authorizer?.claims?.sub;

    if (!user) {
        return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                message: "user not authorized"
            }),
        }
    }

    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                message: "bad request - need query string"
            })
        }
    }

    const id = event.queryStringParameters.id;
    if (!id) {
        return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                message: "bad request - no id"
            })
        }
    }

    const command = new GetObjectCommand({
        Bucket: BUCKET,
        Key: `${user}${id}`
    })

    try {
        const response = await client.send(command);

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: new Blob([response.Body.toString()])
        }
    } catch (error) {
        return {
            statusCode: 503,
            headers: CORS_HEADERS,
            body: JSON.stringify(error)
        }
    }
};
