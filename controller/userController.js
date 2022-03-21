const fs = require('fs');

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    result: users.length,
    data: {
      users,
    },
  });
};

exports.createUser = (req, res) => {
  const newId = users[users.length - 1].id + 1;
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const newUser = { id: newId, ...req.body };

  users.push(newUser);

  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    () => {
      res.status(201).json({
        status: 'success',
        data: {
          user: newUser,
        },
      });
    }
  );
};

exports.getUser = (req, res) => {
  const id = req.params.id * 1;

  const user = users.find((el) => el.id === id);

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'No tour was found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};

exports.updateUser = (req, res) => {
  const id = req.params.id * 1;

  const user = users.find((el) => el.id === id);

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'No tour was found',
    });
  }

  res.status(201).json({
    status: 'success',
    data: {
      message: 'update is happening',
    },
  });
};

exports.deleteUser = (req, res) => {
  const id = req.params.id * 1;

  const user = users.find((el) => el.id === id);

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'No tour was found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
};
