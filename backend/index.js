const Sequelize = require('sequelize');
require('dotenv').config();



if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
});

// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });

const User = sequelize.define('user', {
    user_id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        


    },
    password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    is_admin : {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},
{
    freezeTableName: true,
    timestamps: false,
});

User.sync({alter: true}).then(() =>{
    console.log('Table and model synced successfully');
}).catch((err) => {
    console.error('Unable to sync table and model:', err);
});