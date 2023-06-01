const UserModel = require('../../models/user.model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.create = (req, res) => {
    const body = req.body;

    let {
        first_name,
        last_name,
        designation,
        email_id,
        password,
        contact,
    } = body;

    UserModel.count({
        where: { email_id: email_id }
    }).then(count => {
        if (count > 0) {
            return res.json({
                status: 201,
                message: 'User with this email is already exist.',
            });
        }

        if (!res.headersSent) {
            UserModel.create({
                first_name,
                last_name,
                designation,
                email_id,
                password,
                contact,
                created_at: new Date(),
                updated_at: new Date(),
            }).then(result => {

                if (!res.headersSent) {
                    return res.json({
                        status: 200,
                        message: 'User created successfully!'
                    });
                }

            }).catch(error => {
                console.log(error);
                if (!res.headersSent) {
                    return res.json({
                        status: 400,
                        message: error
                    });
                }
            });
        }

    }).catch(error => {
        console.log(error);
        if (!res.headersSent) {
            return res.json({
                status: 400,
                message: error
            });
        }
    });

}

exports.update = (req, res) => {
    const body = req.body;

    let {
        first_name,
        last_name,
        designation,
        email_id,
        contact,
        user_id
    } = body;

    UserModel.count({
        where: { id: user_id }
    }).then(count => {
        if (count == 0) {
            return res.json({
                status: 201,
                message: 'No user found with this id.',
            });
        }

        if (!res.headersSent) {
            UserModel.update({
                first_name: first_name,
                last_name: last_name,
                designation: designation,
                email_id: email_id,
                contact: contact,
                updated_at: new Date(),
            }, {
                where: { id: user_id }
            }).then(result => {

                if (!res.headersSent) {
                    return res.json({
                        status: 200,
                        message: 'User updated successfully!'
                    });
                }

            }).catch(error => {
                console.log(error);
                if (!res.headersSent) {
                    return res.json({
                        status: 400,
                        message: error
                    });
                }
            });
        }

    }).catch(error => {
        console.log(error);
        if (!res.headersSent) {
            return res.json({
                status: 400,
                message: error
            });
        }
    });

}

exports.get_all = (req, res) => {
    const user_id = req.query.user_id;
    UserModel.findAll({
        where: { id: { [Op.ne]: user_id } },
    }).then(users => {
        if (!res.headersSent) {
            return res.json({
                status: 200,
                data: users,
                message: 'Users data is in data node.'
            });
        }
    }).catch(error => {
        console.log(error);
        if (!res.headersSent) {
            return res.json({
                status: 400,
                message: error
            });
        }
    });

}

exports.get_one = (req, res) => {
    const user_id = req.query.user_id;
    UserModel.findOne({
        where: { id: user_id },
    }).then(user => {
        if (!res.headersSent) {
            return res.json({
                status: 200,
                data: user,
                message: 'Users data is in data node.'
            });
        }
    }).catch(error => {
        console.log(error);
        if (!res.headersSent) {
            return res.json({
                status: 400,
                message: error
            });
        }
    });
}

exports.update_password = (req, res) => {
    const body = req.body;

    let {
        user_id,
        cpassword,
        npassword
    } = body;

    UserModel.count({
        where: { id: user_id, password: cpassword }
    }).then(count => {
        if (count == 0) {
            return res.json({
                status: 201,
                message: 'Current password does not match.',
            });
        }

        if (!res.headersSent) {
            UserModel.update({
                password: npassword
            }, {
                where: { id: user_id }
            }).then(result => {

                if (!res.headersSent) {
                    return res.json({
                        status: 200,
                        message: 'Password updated successfully!'
                    });
                }

            }).catch(error => {
                console.log(error);
                if (!res.headersSent) {
                    return res.json({
                        status: 400,
                        message: error
                    });
                }
            });
        }

    }).catch(error => {
        if (!res.headersSent) {
            return res.json({
                status: 400,
                message: error
            });
        }
    });
}