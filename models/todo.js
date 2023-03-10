"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }

    static addTodo({ title, dueDate, userId }) {
      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
        userId,
      });
    }

    static getTodos() {
      return this.findAll();
    }

    static async overdue(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toISOString().split("T")[0],
          },
          userId,
          completed: false,
        },
      });
    }
    static async dueToday(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toISOString().split("T")[0],
          },
          userId,
          completed: false,
        },
      });
    }
    static async dueLater(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toISOString().split("T")[0],
          },
          userId,
          completed: false,
        },
      });
    }

    static async completedItems(userId) {
      return this.findAll({
        where: {
          completed: true,
          userId,
        },
      });
    }

    static async remove(id, userId) {
      return this.destroy({
        where: {
          id,
          userId,
        },
      });
    }

    /* 
      Mark a to-do as complete. Instead of markAsCompleted,
      implement a setCompletionStatus method in the Todo model, 
      which takes a boolean value and updates the todo item accordingly.
    */
    setCompletionStatus(boolean_value) {
      return this.update({ completed: boolean_value });
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
