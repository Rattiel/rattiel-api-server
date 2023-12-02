// Create clients and set shared const values outside of the handler

export const handler = (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "hello"
        }),
    }
};
