-- ====================
--  TABLES CREATION
-- ====================
CREATE table organizations (
	organization_id SERIAL PRIMARY KEY,
	name varchar(150) NOT NULL,
	description text NOT NULL,
	contact_email varchar(255) NOT NULL,
	logo_filename varchar(255) NOT NULL
);


-- ====================
--  INSERT DATA
-- ====================

INSERT INTO organizations (name, description, contact_email, logo_filename) VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png'),
('EcoRoots Sustainability', 'A nonprofit organization dedicated to urban reforestation and the development of community green spaces', 'contact@ecoroots.org', 'placeholder-logo.png');
