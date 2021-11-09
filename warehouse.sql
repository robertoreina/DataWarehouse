CREATE DATABASE warehouse;

USE warehouse;

-- ----------------------------------------------------------------------------------------------
-- Users 
-- ----------------------------------------------------------------------------------------------

CREATE OR REPLACE TABLE users (
	id int not null primary key AUTO_INCREMENT,
	email varchar(250) not null,
	first_name   varchar(250) not null,
	last_name    varchar (250) not null,
	password    varchar (250) not null,
	is_admin   tinyint default (false),
	update_date timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


insert into users values (null, 'admin@datawarehouse.com', 'admin', 'admin', '12345678', '1', null);

-- ----------------------------------------------------------------------------------------------
-- Regions 
-- ----------------------------------------------------------------------------------------------

CREATE OR REPLACE TABLE regions (
	id int not null primary key AUTO_INCREMENT,
	name varchar(250) not null
);



-- ----------------------------------------------------------------------------------------------
-- Countries 
-- ----------------------------------------------------------------------------------------------

CREATE OR REPLACE TABLE countries (
	id int not null primary key AUTO_INCREMENT,
	name varchar(250) not null,
	region_id int not null,
	constraint fk_regions
	foreign key (region_id) references regions (id)
	on delete cascade
	on update restrict
);



-- ----------------------------------------------------------------------------------------------
-- cities 
-- ----------------------------------------------------------------------------------------------

CREATE OR REPLACE TABLE cities (
	id int not null primary key AUTO_INCREMENT,
	name varchar(250) not null,
	country_id int not null,
	constraint fk_countries
	foreign key (country_id) references countries (id)
	on delete cascade
	on update restrict
);



-- ----------------------------------------------------------------------------------------------
-- companies 
-- ----------------------------------------------------------------------------------------------

CREATE OR REPLACE TABLE companies (
	id int not null primary key AUTO_INCREMENT,
	name   varchar(250) not null,
	address varchar(250) not null,
	email varchar(250) not null,
	phone    varchar (15) not null,
	city_id    int not null,	
	updater_userid   int not null,
	update_date timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	foreign key (city_id) references cities (id),
	foreign key (updater_userid) references users (id)
);



-- ----------------------------------------------------------------------------------------------
-- contacts 
-- ----------------------------------------------------------------------------------------------

CREATE OR REPLACE TABLE contacts (
	id int not null primary key AUTO_INCREMENT,
	first_name  varchar(250) not null,
	last_name   varchar(250) not null,
	job   varchar(250) not null,
	company_id int not null,
	email varchar(250) not null,
	city_id   int,
	address   varchar(250),
	interes   int,
	pixel     mediumblob,
	updater_userid   int not null,
	update_date timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	foreign key (company_id) references companies (id),
	foreign key (city_id) references cities (id),
	foreign key (updater_userid) references users (id)
);


-- ----------------------------------------------------------------------------------------------
-- contact_chanels 
-- ----------------------------------------------------------------------------------------------

CREATE OR REPLACE TABLE contact_chanels (
	id int not null primary key AUTO_INCREMENT,
	name varchar(250) not null
);

insert into contact_chanels values (null, 'Teléfono');
insert into contact_chanels values (null, 'Whatsapp');
insert into contact_chanels values (null, 'Instagram');
insert into contact_chanels values (null, 'Facebook');
insert into contact_chanels values (null, 'Linkedin');



-- ----------------------------------------------------------------------------------------------
-- preferences 
-- ----------------------------------------------------------------------------------------------

CREATE OR REPLACE TABLE preferences (
	id int not null primary key AUTO_INCREMENT,
	name varchar(250) not null
);

insert into preferences values (null, 'Sin Preferencia');
insert into preferences values (null, 'Canal Favorito');
insert into preferences values (null, 'No Molestar');


-- ----------------------------------------------------------------------------------------------
-- contact_has_chanel 
-- ----------------------------------------------------------------------------------------------

CREATE OR REPLACE TABLE contact_has_chanels (
	contact_id   int not null,
	contact_chanel_id int not null,
	user_account   varchar(250) not null,
	preference_id  int not null,
	constraint contact_has_chanel_key Primary Key (contact_id, contact_chanel_id),
	FOREIGN KEY (contact_id) references contacts (id),
	foreign key (contact_chanel_id) references contact_chanels (id),
    foreign key (preference_id) references preferences (id)	
);


	
