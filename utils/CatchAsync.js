//Function to catch failed async when calling to the router

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}