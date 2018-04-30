const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getIndustries', mid.requiresLogin, controllers.Industry.getIndustries);
  app.get('/getAccount', mid.requiresLogin, controllers.Account.getAccount);
  app.post('/makeTransaction', mid.requiresLogin, controllers.Account.makeTransaction);
  app.get('/premium', mid.requiresLogin, controllers.Account.premium);
  app.get('/changePassword', mid.requiresLogin, controllers.Account.changePasswordPage);
  app.post('/changePassword', mid.requiresLogin, controllers.Account.changePassword);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/faq', mid.requiresLogin, controllers.Account.faqPage);
  app.get('/maker', mid.requiresLogin, controllers.Industry.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Industry.make);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
