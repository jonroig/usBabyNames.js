CREATE TABLE usNameData ( id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, sex TEXT NOT NULL, births INTEGER NOT NULL, rank INTEGER NOT NULL, year INTEGER NOT NULL );
CREATE INDEX idx_name ON usNameData(name);


CREATE TABLE usNameDetails ( id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, sex TEXT NOT NULL, nameData JSON );
CREATE INDEX idx_name_sex ON nameMeanings(name, sex);