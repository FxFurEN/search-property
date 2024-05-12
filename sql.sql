-- Создание таблицы Типов Недвижимости
CREATE TABLE PropertyTypes (
    type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL
);

-- Вставка типов недвижимости
INSERT INTO PropertyTypes (type_name) VALUES
    ('Жилая'),
    ('Коммерческая'),
    ('Гараж');

-- Создание таблицы Городов
CREATE TABLE Cities (
    city_id SERIAL PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL
);

-- Вставка городов
INSERT INTO Cities (city_name) VALUES
    ('Уральск'),
    ('Актобе'),
    ('Атырау'),
    ('Костанай'),
    ('Павлодар');

-- Создание таблицы Недвижимости
CREATE TABLE Properties (
    property_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type_id INTEGER REFERENCES PropertyTypes(type_id),
    price DECIMAL(12, 2) NOT NULL,
    address VARCHAR(255) NOT NULL,
    number_of_rooms INTEGER,
    area DECIMAL(10, 2),
    photos TEXT[],
    coordinates VARCHAR(255) NOT NULL,
    city_id INTEGER REFERENCES Cities(city_id)
);


-- Вставка данных в таблицу Недвижимости
INSERT INTO Properties (title, description, type_id, price, address, number_of_rooms, area, photos, coordinates, city_id)
VALUES
    ('Уютная квартира возле парка', 'Прекрасное место для отдыха и прогулок', 1, 85000.00, 'ул. Парковая, д. 5', 2, 80.5, '{photo1.jpg, photo2.jpg}', '{"latitude": 51.2305, "longitude": 51.3883, "latitudeDelta": 0.0922, "longitudeDelta": 0.0421}', 1),
    ('Просторный офисный блок', 'Отличное место для вашего бизнеса', 2, 150000.00, 'пр. Бизнесный, д. 10', NULL, 200.0, '{photo3.jpg}', '{"latitude": 51.1287, "longitude": 51.3189, "latitudeDelta": 0.0922, "longitudeDelta": 0.0421}', 2),
    ('Гараж для вашего автомобиля', 'Безопасное и удобное место для хранения авто', 3, 30000.00, 'ул. Гаражная, д. 3', NULL, NULL, '{photo4.jpg}', '{"latitude": 51.1223, "longitude": 51.3722, "latitudeDelta": 0.0922, "longitudeDelta": 0.0421}', 1),
    ('Дом с видом на озеро', 'Прекрасное место для уединенного отдыха', 1, 250000.00, 'ул. Озерная, д. 15', 5, 350.0, '{photo5.jpg, photo6.jpg}', '{"latitude": 51.1948, "longitude": 51.3299, "latitudeDelta": 0.0922, "longitudeDelta": 0.0421}', 3),
    ('Офис в центре города', 'Удобное расположение и современный дизайн', 2, 120000.00, 'пр. Центральный, д. 20', NULL, 150.0, '{photo7.jpg}', '{"latitude": 51.2096, "longitude": 51.3457, "latitudeDelta": 0.0922, "longitudeDelta": 0.0421}', 1),
    ('Квартира в новом районе', 'Современная планировка и развитая инфраструктура', 1, 95000.00, 'ул. Новая, д. 8', 3, 100.0, '{photo8.jpg, photo9.jpg}', '{"latitude": 51.1782, "longitude": 51.2985, "latitudeDelta": 0.0922, "longitudeDelta": 0.0421}', 4),
    ('Гараж с подвалом', 'Удобное хранение вещей и автомобиля', 3, 35000.00, 'ул. Складская, д. 12', NULL, NULL, '{photo10.jpg}', '{"latitude": 51.2391, "longitude": 51.3818, "latitudeDelta": 0.0922, "longitudeDelta": 0.0421}', 1),
    ('Просторный коттедж в лесу', 'Идеальное место для семейного отдыха', 1, 350000.00, 'ул. Лесная, д. 25', 6, 400.0, '{photo11.jpg, photo12.jpg}', '{"latitude": 51.2104, "longitude": 51.3122, "latitudeDelta": 0.0922, "longitudeDelta": 0.0421}', 5),
    ('Коммерческое помещение на первом этаже', 'Отличное место для открытия вашего бизнеса', 2, 200000.00, 'ул. Торговая, д. 30', NULL, 180.0, '{photo13.jpg}', '{"latitude": 51.2235, "longitude": 51.3348, "latitudeDelta": 0.0922, "longitudeDelta": 0.0421}', 2),
    ('Гараж с подсобным помещением', 'Возможность использования в различных целях', 3, 28000.00, 'ул. Мастерская, д. 7', NULL, NULL, '{photo14.jpg}', '{"latitude": 51.1893, "longitude": 51.3044, "latitudeDelta": 0.0922, "longitudeDelta": 0.0421}', 4);
