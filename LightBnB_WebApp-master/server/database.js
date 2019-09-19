const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Client } = require("pg");

//Database connection
const db = new Client({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb"
});



db.connect(err => {
  if (err) {
    console.log("Error connecting to database", err);
  } else {
    console.log("Connected to database lightbnb");
  }
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const dbQuery = `SELECT email FROM users WHERE email LIKE $1`;
  const values = [`%${email}%`];
  //Test query
  return db
    .query(dbQuery, values)
    .then(res => {
      res.rows.forEach(user => {
        return user;
      });
    })
    .catch(err => {
      console.log("Query Error Getting user with email Function: ", err.stack);
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  // return Promise.resolve(users[id]);
  const dbQuery = `SELECT * FROM users WHERE id = $1`;
  const values = [id];
  return db
    .query(dbQuery, values)
    .then(res => {
      res.rows.forEach(user => {
        return user;
      });
    })
    .catch(err => console.log("error getting user id", err.stack));
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const dbQuery = `INSERT INTO users (name,email, password) VALUES ($1,$2,$3)`
  values = [user.name,user.email,user.password]
  return db.query(dbQuery, values).then(res => {
  console.log('User added to databse!!')
  }).catch(err=>console.log('Error inserting data',err.stack))


/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const limitedProperties = {};
  for (let i = 1; i <= limit; i++) {
    limitedProperties[i] = properties[i];
  }
  return Promise.resolve(limitedProperties);
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
