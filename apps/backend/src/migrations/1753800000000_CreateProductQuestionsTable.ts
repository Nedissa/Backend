export const up = async ({ context }: any) => {
  const sequelize = context.sequelize

  await sequelize.getQueryInterface().createTable("product_question", {
    id: {
      type: sequelize.DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    product_id: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
    },
    customer_name: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
    },
    customer_email: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
    },
    question: {
      type: sequelize.DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: sequelize.DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    created_at: {
      type: sequelize.DataTypes.DATE,
      defaultValue: sequelize.fn("now"),
    },
    answered_at: {
      type: sequelize.DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: sequelize.DataTypes.DATE,
      defaultValue: sequelize.fn("now"),
    },
  })
}

export const down = async ({ context }: any) => {
  const sequelize = context.sequelize
  await sequelize.getQueryInterface().dropTable("product_question")
}
