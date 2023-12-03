const {S3Client, PutObjectCommand} = require("@aws-sdk/client-s3")
const parser = require('lambda-multipart-parser');

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

    let id = event.queryStringParameters.id;
    if (!id) {
        return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                message: "bad request - no id"
            })
        }
    }
    if (!id.startsWith("/")) {
        id = `/${id}`;
    }
    if (!id.endsWith("/")) {
        id = `${id}/`;
    }
    const key = `${user}${id}`;

    let command;
    if (!event.body) {
        command = new PutObjectCommand({
            Bucket: BUCKET,
            Key: key
        })
    } else {
        // parse the event body
        const formData = await parser.parse(event);
        const file = formData.files[0];

        if (!file) {
            return {
                statusCode: 400,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    message: "no file"
                })
            }
        }

        command = new PutObjectCommand({
            Bucket: BUCKET,
            Key: `${key}${file.filename}`,
            Body: file.content,
            ContentType: file.contentType
        })
    }

    try {
        await client.send(command);

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                message: "file uploaded"
            })
        }
    } catch (error) {
        return {
            statusCode: 503,
            headers: CORS_HEADERS,
            body: JSON.stringify(error)
        }
    }
};
