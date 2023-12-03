
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

    let rootDirectory = `${user}`;
    if (event.queryStringParameters != null && event.queryStringParameters.directory) {
        const directory = event.queryStringParameters.directory;
        if (!directory.startsWith("/")) {
            rootDirectory += "/";
        }
        rootDirectory += directory;
        if (!directory.endsWith("/")) {
            rootDirectory += "/";
        }
    }

    const command = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: rootDirectory,
    })

    try {
        const response = await client.send(command);

        const objects = response.Contents;
        const result = [];

        objects.forEach((object) => {
            const path = object.Key.replaceAll(rootDirectory, "");
            const keys = path.split("/");

            if ((keys.length >= 2 && object.Size !== 0) || ((keys.length === 1 || keys.length >= 3) && keys.at(-1) === "")) {
                return;
            }

            const extensions = keys.at(-1);
            const directoryCheck = extensions.replaceAll(".", "") === extensions;

            if (directoryCheck && object.Size === 0) {
                result.push({
                    key: object.Key,
                    size: object.Size,
                    type: "directory",
                    lastModified: object.LastModified
                })
            } else {
                result.push({
                    key: object.Key,
                    size: object.Size,
                    type: "file",
                    lastModified: object.LastModified
                })
            }
        })

        return {
            statusCode: 200,
            body: JSON.stringify({
                file: result,
                length: result.length
            })
        }
    } catch (error) {
        return {
            statusCode: 503,
            body: JSON.stringify(error)
        }
    }
};
