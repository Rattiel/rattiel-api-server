const {S3Client, PutObjectCommand} = require("@aws-sdk/client-s3")
const multipart = require('parse-multipart');

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

    let rootDirectory = `${user}`;
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                message: "bad request - need query string"
            })
        }
    }

    if (event.queryStringParameters.directory) {
        const directory = event.queryStringParameters.directory;
        if (!directory.startsWith("/")) {
            rootDirectory += "/";
        }
        rootDirectory += directory;
        if (!directory.endsWith("/")) {
            rootDirectory += "/";
        }
    }

    if (!event.queryStringParameters.fileName) {
        return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                message: "bad request - need file name"
            })
        }
    }
    const fileName = event.queryStringParameters.fileName;

    if (!event.body) {
        return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                message: "bad request - no file"
            })
        }
    }

    const bodyBuffer = new Buffer(event.body.toString(), "base64");
    let boundary = multipart.getBoundary(event.headers['content-type']);
    let parts = multipart.Parse(bodyBuffer, boundary);

    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: `${rootDirectory}${fileName}`,
    })

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
