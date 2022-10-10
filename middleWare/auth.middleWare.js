const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS'){
        return next()
    }
    try{
        const token = req.headers.authorization.split(' ')[1]
        if(!token){
            return res.status(401).json({message: '401 not token'})
        }
        const decoded = jwt.verify(token, 'sekret key')
        req.user = decoded
        next()
    }catch (e) {
        res.status(401).json({message: '401'})
    }
}