export const up = async ({ context }: any) => {
  const sequelize = context.sequelize

  await sequelize.getQueryInterface().createTable("guide_question", {
    id: {
      type: sequelize.DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    guide_slug: {
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
    ip_address: {
      type: sequelize.DataTypes.STRING,
      allowNull: true,
    },
    question_likes: {
      type: sequelize.DataTypes.INTEGER,
      defaultValue: 0,
    },
    question_dislikes: {
      type: sequelize.DataTypes.INTEGER,
      defaultValue: 0,
    },
    answer_likes: {
      type: sequelize.DataTypes.INTEGER,
      defaultValue: 0,
    },
    answer_dislikes: {
      type: sequelize.DataTypes.INTEGER,
      defaultValue: 0,
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
  await sequelize.getQueryInterface().dropTable("guide_question")
}
