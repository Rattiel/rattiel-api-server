
const {S3Client, ListObjectsV2Command} = require("@aws-sdk/client-s3")

const BUCKET = "rattiel-storage";

const client = new S3Client({
    region: "ap-northeast-2"
});

exports.handler = async (event) => {
    const command = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: "asdasdasd",
       // MaxKeys: 2 // 최대 조회할 객체 갯수
    })

    const response = await client.send(command);

    return {
        statusCode: 200,
        body: JSON.stringify(response.Contents),
    }
};
