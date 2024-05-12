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
