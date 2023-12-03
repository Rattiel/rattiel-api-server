
const {S3Client, ListObjectsV2Command} = require("@aws-sdk/client-s3")

const BUCKET = "rattiel-storage";

const client = new S3Client({
    region: "ap-northeast-2"
});

exports.handler = async (event) => {
    const user = event?.requestContext?.authorizer?.claims?.sub;

    if (!user) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "user not authorized"
            }),
        }
    }

    const command = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: `${user}/`,
    })

    const response = await client.send(command);

    return {
        statusCode: 200,
        body: JSON.stringify(response.Contents)
    }
};
