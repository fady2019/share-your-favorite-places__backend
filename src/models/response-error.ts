class ResponseError extends Error {
    constructor(msg: string, public statusCode: number) {
        super(msg);
    }
}

export default ResponseError;
