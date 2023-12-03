const {S3Client, PutObjectCommand} = require("@aws-sdk/client-s3")

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

    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: `${rootDirectory}`,
    })

    try {
        await client.send(command);

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                message: "directory created"
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
