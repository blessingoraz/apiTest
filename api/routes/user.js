const user = require('../controllers/user');
const VerifyToken = require('../auth/VerifyToken');

module.exports = (app) => {
    app.post('/api/user', user.create);

    app.post('/api/login', user.login);

    app.get('/api/users', VerifyToken, user.findAll);

    app.get('/api/user/:userId', VerifyToken, user.findOne);

    app.put('/api/user/:userId', VerifyToken,  user.update);

    app.delete('/api/user/:userId', VerifyToken, user.delete);
};
