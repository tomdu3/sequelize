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
        validators: {
            notEmpty: true,
            length: {
                min: 4,
                max: 20
            }
        }
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

Student.sync({alter: true}).then(() =>{
    return Student.bulkCreate([
        {
            name: 'Bob',
            favorite_class: 'Computer Science',
            school_year: 2021,
            subscribed_to_wittcode: true
        },
        {
            name: 'Alice',
            favorite_class: 'Computer Science',
            school_year: 2021,
            subscribed_to_wittcode: false
        },
        {
            name: 'Charlie',
            school_year: 2022,
            subscribed_to_wittcode: true
        },
        {
            name: 'Dave',
            favorite_class: 'Math',
            school_year: 2022,
            subscribed_to_wittcode: false
        },
        {
            name: 'Eve',
            favorite_class: 'Math',
            school_year: 2024,
            subscribed_to_wittcode: true
        },
        {
            name: 'Frank',
            school_year: 2023,
            subscribed_to_wittcode: false
        }
    ])
})
.then((data) => {
    data.forEach(student => console.log(student.toJSON()))
})
.catch((err) => {
    console.error('Unable to sync table and model:', err);
});