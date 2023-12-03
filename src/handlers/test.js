const parser = require('lambda-multipart-parser');
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*'
}

exports.handler = async (event) => {
    const formData = await parse(event);
    return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
            result: formData
        })
    }
};

const parse = (event) => new Promise((resolve, reject) => {
    const bodyBuffer = new Buffer(event.body.toString(), "base64");

    const busboy = new Busboy({
        headers: {
            'content-type': event.params.header['content-type'] || event.params.header['Content-Type']
        }
    });
    const formData = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log('File [%s]: filename=%j; encoding=%j; mimetype=%j', fieldname, filename, encoding, mimetype);
        const chunks = [];

        file.on('data', data => {
            chunks.push(data);
        }).on('end', () => {
            formData[fieldname] = [filename, Buffer.concat(chunks), mimetype];
            console.log("File [%s] finished.", filename);
        });
    });

    busboy.on('field', (fieldname, value) => {
        console.log("[" + fieldname + "] >> " + value);
        formData[fieldname] = value;
    });

    busboy.on('error', error => {
        reject(error);
    });

    busboy.on('finish', () => {
        resolve(formData);
    });

    busboy.write(bodyBuffer, event.isBase64Encoded ? 'base64' : 'binary');
    busboy.end();
});
