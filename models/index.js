const { sequelize } = require('../config/dbConfig.js');
const { Sequelize, DataTypes } = require('sequelize');

sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully.'))
  .catch((err) => console.error('❌ Database connection error:', err));

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./users.js')(sequelize, DataTypes);
db.Agency = require('./agency.js')(sequelize, DataTypes);

db.OutdoorActivity = require('./outdoor/outdoor_activities.js')(sequelize, DataTypes);
db.ActivityCategory = require('./outdoor/activity_categories.js')(sequelize, DataTypes);
db.Reservation = require('./outdoor/reservations.js')(sequelize, DataTypes);
db.Spot = require('./outdoor/spots.js')(sequelize, DataTypes);
db.Review = require('./reviews.js')(sequelize, DataTypes);

db.VolunteeringEvent = require('./volunteering/VolunteeringEvent.js')(sequelize, DataTypes);
db.Volunteer = require('./volunteering/VolunteeringParticipant.js')(sequelize, DataTypes);

db.Post = require('./posts/posts.js')(sequelize, DataTypes);
db.Comment = require('./posts/comments.js')(sequelize, DataTypes);
db.Profile = require('./posts/profiles.js')(sequelize, DataTypes);
db.Like = require('./posts/like.js')(sequelize, DataTypes);
db.Follow = require('./posts/follow.js')(sequelize, DataTypes);

db.Product = require('./shop/product.js')(sequelize, DataTypes);
db.Order = require('./shop/orders.js')(sequelize, DataTypes);
db.OrderItem = require('./shop/order_items.js')(sequelize, DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize
  .sync({ alter: false })
  .then(() => console.log('✅ Database synchronized successfully.'))
  .catch((err) => console.error('❌ Error during database synchronization:', err));

module.exports = db;
