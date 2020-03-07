const HttpStatus = require('http-status-codes');
const sha256 = require('js-sha256');


let users = [];

function findUserById(array, id) {
    return array.find(user => {
        return user.id === parseInt(id);
    });
}

const putUser = (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(HttpStatus.BAD_REQUEST).json({error: "Username & password are required fields"});
        return;
    }
    const match = users.find(user => {
        return (user.username === req.body.username);
    });
    if (match) {
        res.status(HttpStatus.CONFLICT).json({error: "User already exists"});
        return;
    }
    users.push({
        id: users.length + 1,
        username: req.body.username,
        password: sha256(req.body.password)
    });
    res.status(HttpStatus.CREATED).send();
};

const getUser = (req, res) => {
    res.json(users)
};

const getUserById = (req, res) => {
    const requestedUser = findUserById(users, req.params.id);
    if (!requestedUser) {
        res.status(HttpStatus.NOT_FOUND).send();
        return;
    }
    res.json(requestedUser);
};

const loginUser = (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(HttpStatus.BAD_REQUEST).json({error: "Username & password are required fields"});
        return;
    }
    const userLogin = req.body;
    const hashedPassword = sha256(userLogin.password);
    const foundUser = users.find(user => {
        return (user.username === userLogin.username && user.password === hashedPassword);

    });
    if (!foundUser) {
        res.status(HttpStatus.FORBIDDEN).send();
        return;
    }
    res.status(HttpStatus.OK).json(foundUser);
};

const updateUser =  (req, res) => {
    const requestedUser = findUserById(users, req.params.id);
    if (!requestedUser) {
        res.status(HttpStatus.NOT_FOUND).send();
        return;
    }

    let userIndex = users.indexOf(requestedUser);
    const updateValues = req.body;
    if ("password" in updateValues) {
        updateValues["password"] = sha256(updateValues["password"]);
    }
    // Creating new object with all fields from `requestedUser` and update those fields from `updateValues`
    const updatedUser = {
        ...requestedUser,
        ...updateValues
    };
    users.splice(userIndex, 1, updatedUser);
    res.status(HttpStatus.OK).json(updatedUser);
};

const deleteUser = (req, res) => {
    const requestedUser = findUserById(users, req.params.id);
    if (!requestedUser) {
        res.status(HttpStatus.NOT_FOUND).send();
        return;
    }
    const index = users.indexOf(requestedUser);
    users.splice(index, 1);
    res.status(HttpStatus.NO_CONTENT).send();
};

module.exports = {
    putUser,
    getUser,
    getUserById,
    loginUser,
    updateUser,
    deleteUser
};
