const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;
require('dotenv').config();
const bcrypt = require('bcrypt');
const zlib = require('zlib');

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
        get() {
            const rawValue = this.getDataValue('username');
            return rawValue.toUpperCase();
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,

        set(value) {
            const salt = bcrypt.genSaltSync(12);
            const hash = bcrypt.hashSync(value, salt);
            this.setDataValue('password', hash);
        },
        get() {
            const rawValue = this.getDataValue('password');
            return rawValue;
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_admin : {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: 'No description available at the moment',
        // compressing and uncompressing data
        set(value) {
            const compressed = zlib.deflateSync(value).toString('base64');
            this.setDataValue('description', compressed);
        },
        get() {
            const value = this.getDataValue('description');
            const decompressed = zlib.inflateSync(Buffer.from(value, 'base64'));
            return decompressed.toString();
        }   
    },
    // virtual fields
    fullName: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.getDataValue('username')} ${this.getDataValue('email')}`;
        }
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

    // increment and decrement fields
    // example for age: 20;
    // return User.increment({age: 1}, {where: {user_id: 1}});
    // return User.decrement({age: 1}, {where: {user_id: 1}});

    // better way
    // return User.create({
    //     username: 'heLlo',
    //     password: 'test',
    //     email: 'test@mail.com',
    //     is_admin: false
    // })
    // bulk create  - avoid doing this, because of validation
    // return User.bulkCreate([
    //     {
    //         username: 'Bob',
    //         password: 'test',
    //         email: 'test@mail.com',
    //         is_admin: false
    //     },
    //     {
    //         username: 'Alice',
    //         password: 'test',
    //         email: 'test@mail.com',
    //         is_admin: false
    //     },
    //     {
    //         username: 'John',
    //         password: 'test',
    //         email: 'test@mail.com',
    //         is_admin: false
    //     }  
    // ])
    // return User.create({
    //     username: 'Widdabe',
    //     password: 'soccerpizza',
    //     email: 'test@mail.com',
    //     description: 'this is a description that doesn\'t say a thing but we need to keep it here'
    // })
    return User.findOne({where: {username: 'Widdabe'}})
})
.then((data) => {
    // data.forEach(user => console.log(user, user.toJSON()))
    // console.log(data.username);
    // console.log(data.password);
    // console.log(data.email);
    // console.log(data.description);
    console.log(data.fullName);
})
.catch((err) => {
    console.error('Unable to sync table and model:', err);
});