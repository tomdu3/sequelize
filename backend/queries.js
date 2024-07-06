const Sequelize = require('sequelize');
const { DataTypes, Op } = Sequelize;
require('dotenv').config();



if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    define : {
        freezeTableName: true // do not pluralize table names for every model 
    }
});


const User = sequelize.define('user', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_admin : {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},
{
    freezeTableName: true,
    timestamps: false,
});

 
User.sync({alter: true}).then(() =>{
    // return User.findAll();  // get all users
    // return User.findAll({attributes: ['username', 'email']});  // only get username and email
    // return User.findAll({attributes: [['username', 'name'], ['email', 'contact']]});  // alias
    // return User.findAll({attributes: [[sequelize.fn('SUM', sequelize.col('user_id')), 'somethingStupid']]});
    // return User.findAll({attributes: [[sequelize.fn('AVG', sequelize.col('user_id')), 'somethingStupid']]});
    // return User.findAll({attributes: { exclude: ['password', 'is_admin']}});  // exclude password
    // return User.findAll({ attributes: ['username'], where: {password: 'test' }});  // only get username where password is test
    // return User.findAll({ attributes: ['username'], where: {password: 'test', is_admin: true }}); // only get username where password is test and is_admin
    // return User.findAll({ attributes: ['username'], where: {password: 'test' }, limit: 3});  // add limit
    // return User.findAll({ attributes: ['username'], order: [['username', 'DESC']] });  // add order in descending order
    // return User.findAll({
    //   attributes: [ 'is_admin',
    //     [sequelize.fn('COUNT', sequelize.col('user_id')), 'user_id_count']
    //   ],
    //   group: ['is_admin'],
    // });  // add group by is_admin and count user_id (users)
    // return User.findAll({ where:{
    //   [Op.or]: [ {password: 'test', is_admin : true}]
    // }});  // operator OR
    // return User.findAll({ where:{
    //   user_id: {
    //     [Op.gt]: 5  // operator > greater than
    //   }
    // }});  // operator >
    // return User.findAll({ where: 
    //   sequelize.where(sequelize.fn('char_length', sequelize.col('username')), 3) // operator char_length
    return User.max('user_id');  // get max user_id
    // return User.max('user_id', { where:{is_admin: true} });  // get max user_id where is_admin is true
})
.then((data) => {
    console.log(data)
})
.catch((err) => {
    console.error('Unable to sync table and model:', err);
});