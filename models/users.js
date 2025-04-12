module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true }
    },
    password: { type: DataTypes.STRING, allowNull: false },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isNumeric: true, len: [8, 15] }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 13 }
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: true
    },
    terms_accepted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    type: {
      type: DataTypes.ENUM("client", "agency", "admin"),
      allowNull: false,
      defaultValue: "client",
    }
  }, {
    timestamps: true
  });

  return User;
};
