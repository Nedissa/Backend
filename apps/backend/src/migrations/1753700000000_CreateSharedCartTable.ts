export const up = async ({ context }: any) => {
  const sequelize = context.sequelize

  await sequelize.getQueryInterface().createTable("shared_cart", {
    id: {
      type: sequelize.DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    items: {
      type: sequelize.DataTypes.JSONB,
      allowNull: false,
    },
    created_at: {
      type: sequelize.DataTypes.DATE,
      defaultValue: sequelize.fn("now"),
    },
    expires_at: {
      type: sequelize.DataTypes.DATE,
      allowNull: false,
    },
  })
}

export const down = async ({ context }: any) => {
  const sequelize = context.sequelize
  await sequelize.getQueryInterface().dropTable("shared_cart")
}
