const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;
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

// User.drop();
// sequelize.drop({mach: /_test$/}); // drop all tables with name ending with _test
// sequelize.models.user // get all models
 
User.sync({alter: true}).then(() =>{
    // working with updated table
    // const user = User.build({
    //     username: 'test',
    //     password: 'test',
    //     email: 'test',
    //     is_admin: false
    // });
    // return user.save();

    // better way
    return User.create({
        username: 'someone new',
        password: 'test',
        email: 'test@mail.com',
        is_admin: true
    })
}).then((data) => {
    console.log(data);
    console.log(`User created: ${data.dataValues.username}`);
}).catch((err) => {
    console.error('Unable to sync table and model:', err);
});