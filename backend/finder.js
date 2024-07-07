const Sequelize = require('sequelize');
const { defaultValueSchemable } = require('sequelize/lib/utils');
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

const Student = sequelize.define('student', {
    student_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            length: {
                min: 4,
                max: 20
            }
        },
        // getter method
        get() {
            const rawValue = this.getDataValue('name');
            return rawValue.toUpperCase();
        },
    },
    favorite_class: {
        type: DataTypes.STRING,
        defaultValue: 'Computer Science',
    },
    school_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    subscribed_to_wittcode: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

Student.sync().then(() =>{

   // finder method instead of findAll
//    return Student.findAll({
//     where: { subscribed_to_wittcode: true },
//     raw: true,  // it is like toJSON()
//     })

//    return Student.findByPk(5),
//    Student.findOne(),
//    Student.findOne({
//     where: {
//         subscribed_to_wittcode: true
//     }
// });
    // return Student.findAndCountAll({
    //     where: {
    //         favorite_class: 'Computer Science',
    //     },
    //     raw: true
    // }) 
    return Student.findOne();
})
.then((data) => {
    console.log(data.name)
})
.catch((err) => {
    console.error('Unable to sync table and model:', err);
});