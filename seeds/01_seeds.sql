INSERT INTO users (name, email, password)
VALUES ('Guy one', 'hi@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Guy two', 'hey@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Guy three', 'ho@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, country, street, city, province, post_code)
VALUES (1, 'Cool apartment', 'description', 'thumbnail.jpeg', 'coverphoto.jpeg', 100, 'Canada', 'Mill St', 'Toronto', 'Ontario', 'M4S 4J6'),
(2, 'Cool house', 'description', 'thumbnail.jpeg', 'coverphoto.jpeg', 100, 'Canada', 'Queen St', 'Toronto', 'Ontario', 'M7S 4J6'),
(3, 'Cool basement', 'description', 'thumbnail.jpeg', 'coverphoto.jpeg', 100, 'Canada', 'King St', 'Toronto', 'Ontario', 'M2S 4J6');

INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
VALUES (1, 7, '2018-09-11', '2018-09-26'),
(2, 8, '2019-01-04', '2019-02-01'),
(3, 9, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, reservation_id, property_id, rating, message)
VALUES (1, 10, 7, 4, 'good place'),
(2, 11, 8, 2, 'nice place'),
(1, 12, 9, 5, 'cool place');