export const errHandl = (error, req, res, next) => {
    try {
        const err = JSON.parse(error.message);
        res.status(err.number).end(err.message);
    }
    catch (e) {
        res.status(500).end(`Unknown erroreSomething went wrong ${error.message}`);
    }
};
