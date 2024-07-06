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
    // return User.destroy({ truncate: true }); // delete all data, but keep table
   return User.destroy({
    where: {
        user_id: {
            [Op.lt]: 5}
    }
   })
})
.then((data) => {
    console.log(data)
})
.catch((err) => {
    console.error('Unable to sync table and model:', err);
});