
export const globalErrorHandler = (err, req, res, next) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            message: err.message
        })
    }

    console.error("Error: ", err);

    res.status(500).json({
        message: "Something went wrong"
    });
}