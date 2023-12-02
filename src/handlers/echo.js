// Create clients and set shared const values outside of the handler
exports.handler = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "hello",
            event: event
        }),
    }
};
