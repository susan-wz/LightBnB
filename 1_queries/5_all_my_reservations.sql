SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS average_rating
FROM property_reviews
JOIN properties ON property_reviews.property_id = properties.id
JOIN reservations ON property_reviews.reservation_id = reservations.id
JOIN users ON reservations.guest_id = users.id
WHERE users.id = 244
AND reservations.end_date < now()::date
GROUP BY reservations.id, properties.id
ORDER BY reservations.start_date
LIMIT 10