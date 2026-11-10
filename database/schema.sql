CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE areas (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  UNIQUE (name, district)
);

CREATE TABLE providers (
  id SERIAL PRIMARY KEY,s
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('individual', 'company')),
  phone TEXT NOT NULL,
  area_id INT NOT NULL REFERENCES areas(id),
  description TEXT,
  experience_years INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE provider_services (
  provider_id INT NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  service_id INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (provider_id, service_id)
);

CREATE INDEX idx_providers_area ON providers(area_id);
CREATE INDEX idx_provider_services_service ON provider_services(service_id);