// Create clients and set shared const values outside of the handler

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

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "hello",
            user: user
        }),
    }
};
