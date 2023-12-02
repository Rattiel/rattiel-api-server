// Create clients and set shared const values outside of the handler
exports.handler = async () => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "hello"
        }),
    }
};
