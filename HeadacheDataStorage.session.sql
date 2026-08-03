
-- @block
CREATE TABLE Users(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    color_preference INT NOT NULL
);
-- @block
CREATE TABLE HeadacheEvents(
    owner_id VARCHAR(255) NOT NULL,
    start_time DATETIME(0) NOT NULL,
    length_time TIME(0) NULL,
    severity int NULL,
    pain_location VARCHAR(255) NULL,
    start_occurence TEXT NULL,
    end_occurence TEXT NULL,
    notes TEXT NULL,
    PRIMARY KEY (owner_id, start_time),
    FOREIGN KEY (owner_id) REFERENCES Users(id)
);

-- @block
INSERT INTO Users (id, color_preference)
VALUES (
    'TestUser',
    3
);

-- @block
INSERT INTO HeadacheEvents (owner_id, start_time)
VALUES (
    'TestUser',
    NOW()
);

-- @block
SELECT * FROM Users
WHERE id = 'TestUser';

-- @block
SELECT * FROM HeadacheEvents
WHERE owner_id = 'TestUser';

