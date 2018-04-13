const models = require('../models');

const Industry = models.Industry;

const makerPage = (req, res) => {
  Industry.IndustryModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), industries: docs });
  });
};
const makeIndustry = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Please name your factory!' });
  }
  if (req.body.cost > req.session.account.money) {
    return res.status(400).json({ error: 'You do not have enough to buy this!' });
  }

  const industryData = {
    name: req.body.name,
    cost: 0,
    resource: req.body.resource,
    resourceAmount: 1,
    level: 1,
    levelUpCost: 0,
    levelUpScaling: 2,
    owner: req.session.account._id,
  };

  const newIndustry = new Industry.IndustryModel(industryData);

  const industryPromise = newIndustry.save();

  industryPromise.then(() => res.json({ redirect: '/maker' }));

  industryPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      // return res.status(400).json({ error: 'Domo already exists.' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });
  return industryPromise;
};

const getIndustries = (request, response) => {
  const req = request;
  const res = response;

  return Industry.IndustryModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ industries: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getIndustries = getIndustries;
module.exports.make = makeIndustry;
