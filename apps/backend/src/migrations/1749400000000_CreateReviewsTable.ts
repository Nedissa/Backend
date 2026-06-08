export const up = async ({ context }: any) => {
  const sequelize = context.sequelize

  await sequelize.getQueryInterface().createTable("product_review", {
    id: {
      type: sequelize.DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    product_id: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
    },
    customer_id: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
    },
    customer_name: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: sequelize.DataTypes.TEXT,
      allowNull: true,
    },
    verified_purchase: {
      type: sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: sequelize.DataTypes.DATE,
      defaultValue: sequelize.fn("now"),
    },
    updated_at: {
      type: sequelize.DataTypes.DATE,
      defaultValue: sequelize.fn("now"),
    },
  })
}

export const down = async ({ context }: any) => {
  const sequelize = context.sequelize
  await sequelize.getQueryInterface().dropTable("product_review")
}
