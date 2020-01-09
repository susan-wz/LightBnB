const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'vagrant',
  password: '123',
  database: 'lightbnb'
})

module.exports = {

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
getUserWithEmail: (email) => {
  return pool.query(`SELECT * FROM users
  WHERE email = $1`, [email])
  .then(res => res.rows[0])
  .catch(err => console.log(err))
},

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
getUserWithId: (id) => {
  return pool.query(`SELECT * FROM users
  WHERE id = $1`, [id])
  .then(res => res.rows[0])
  .catch(err => console.log(err))
},

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
addUser: (user) => {
  return pool.query(`INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`, [user.name, user.email, user.password])
  .then(res => res.rows[0])
  .catch(err => console.log(err))
},

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
getAllReservations: (guest_id, limit = 10) => {
  return pool.query(`SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS average_rating
  FROM property_reviews
  JOIN properties ON property_reviews.property_id = properties.id
  JOIN reservations ON property_reviews.reservation_id = reservations.id
  JOIN users ON reservations.guest_id = users.id
  WHERE users.id = $1
  AND reservations.end_date < now()::date
  GROUP BY reservations.id, properties.id
  ORDER BY reservations.start_date
  LIMIT $2`, [guest_id, limit])
  .then(res => res.rows)
  .catch(err => console.log(err))
},

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
getAllProperties: (options, limit = 5) => {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.length > 0 ? queryString += ` AND ` : queryString += `WHERE `;
    queryParams.push(`${options.owner_id}`);
    queryString += `owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.length > 0 ? queryString += ` AND ` : queryString += `WHERE `;
    queryParams.push(`${options.minimum_price_per_night*100}`);
    queryString += `cost_per_night >= $${queryParams.length}`;
  }  

  if (options.maximum_price_per_night) {
    queryParams.length > 0 ? queryString += ` AND ` : queryString += `WHERE `;
    queryParams.push(`${options.maximum_price_per_night*100}`);
    queryString += `cost_per_night < $${queryParams.length}`;
  }  
  
  queryString += `
  GROUP BY properties.id
  `

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length}`;
  }  

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  return pool.query(queryString, queryParams)
  .then(res => res.rows);
},

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
addProperty: (property) => {
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
  return pool.query(`INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;`, [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms])
  .then(res => res.rows[0])
  .catch(err => console.log(err))
},

}