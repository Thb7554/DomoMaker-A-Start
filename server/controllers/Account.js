const models = require('../models');

const Account = models.Account;

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;
  req.body.money = 1000;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      money: 1000,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};


const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const faqPage = (req, res) => {
  res.render('faq', { csrfToken: req.csrfToken() });
};

const premium = (req, res) => {
  res.render('premium', { csrfToken: req.csrfToken() });
};

const changePasswordPage = (req, res) => {
  res.render('changePassword', { csrfToken: req.csrfToken() });
};

const changePassword = (request, response) => {
  const req = request;
  const res = response;

  if (!req.body.pass3 || !req.body.pass4) {
    return res.status(400).json({ error: 'Missing a new password!' });
  }
  if (req.body.pass3 !== req.body.pass4) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }
  const newPassword = `${req.body.pass3}`;

  const savePromise = req.session.account.save();

  savePromise.then(() => res.json({
    username: req.session.account.username,
    salt: req.session.account.salt,
    password: newPassword,
    createdData: req.session.account.createdData,
    money: req.session.account.money,
  }));

  savePromise.catch((err) => {
      console.log(err);

      return res.status(400).json({ error: 'An error occurred' });
    });

  return res;
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR: All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

const getAccount = (request, response) => {
  const req = request;
  const res = response;

  return Account.AccountModel.findByUsername(req.session.account.username, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ account: doc });
  });
};

const makeTransaction = (request, response) => {
  const req = request;
  const res = response;
  Account.money--;

  const savePromise = Account.save();

  savePromise.then(() => res.json({ username: req.session.account.username,
    salt: req.session.account.salt,
    password: req.session.account.password,
    createdData: req.session.account.createdData,
    money: req.session.account.money }));

  savePromise((err) => res.json({ err }));
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.faqPage = faqPage;
module.exports.premium = premium;
module.exports.changePasswordPage = changePasswordPage;
module.exports.changePassword = changePassword;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.getAccount = getAccount;
module.exports.makeTransaction = makeTransaction;
