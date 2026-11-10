INSERT INTO services (name) VALUES
  ('Electrician'), ('Plumber'), ('AC Technician'), ('Carpenter'),
  ('Painter'), ('Mason'), ('Home Cleaning'), ('Appliance Repair'),
  ('Pest Control'), ('Remote / Skilled Worker');

INSERT INTO areas (name, district) VALUES
  ('Kozhikode City', 'Kozhikode'),
  ('Feroke', 'Kozhikode'),
  ('Vadakara', 'Kozhikode'),
  ('Kannur City', 'Kannur'),
  ('Thalassery', 'Kannur'),
  ('Payyanur', 'Kannur'),
  ('Kochi', 'Ernakulam'),
  ('Aluva', 'Ernakulam'),
  ('Thrissur City', 'Thrissur'),
  ('Malappuram', 'Malappuram'),
  ('Thiruvananthapuram City', 'Thiruvananthapuram'),
  ('Kottayam', 'Kottayam');
  INSERT INTO providers (name, type, phone, area_id, description, experience_years) VALUES
  ('Rajesh Kumar', 'individual', '90000 00001', (SELECT id FROM areas WHERE name='Kozhikode City'), 'House wiring and fault repair', 8),
  ('Suresh P', 'individual', '90000 00002', (SELECT id FROM areas WHERE name='Kozhikode City'), 'Plumbing and bathroom fittings', 12),
  ('CoolAir Services', 'company', '90000 00003', (SELECT id FROM areas WHERE name='Kozhikode City'), 'AC installation, service and repair', 6),
  ('Anil Electricals', 'company', '90000 00004', (SELECT id FROM areas WHERE name='Feroke'), 'Electrical work for homes and shops', 10),
  ('Shafeeq M', 'individual', '90000 00005', (SELECT id FROM areas WHERE name='Vadakara'), 'Carpentry and furniture repair', 15),
  ('Vinod K', 'individual', '90000 00006', (SELECT id FROM areas WHERE name='Kannur City'), 'Electrician and appliance repair', 9),
  ('Kannur Home Care', 'company', '90000 00007', (SELECT id FROM areas WHERE name='Kannur City'), 'Cleaning and pest control teams', 5),
  ('Jithin Das', 'individual', '90000 00008', (SELECT id FROM areas WHERE name='Thalassery'), 'Plumber, available same day', 7),
  ('Sajeev T', 'individual', '90000 00009', (SELECT id FROM areas WHERE name='Payyanur'), 'House painting and masonry', 14),
  ('Metro Fix Kochi', 'company', '90000 00010', (SELECT id FROM areas WHERE name='Kochi'), 'Electrical, plumbing and AC under one roof', 11),
  ('Babu Joseph', 'individual', '90000 00011', (SELECT id FROM areas WHERE name='Aluva'), 'Mason and tiling work', 20),
  ('Thrissur Workforce Agency', 'company', '90000 00012', (SELECT id FROM areas WHERE name='Thrissur City'), 'Supplies skilled workers on contract', 8),
  ('Nissar A', 'individual', '90000 00013', (SELECT id FROM areas WHERE name='Malappuram'), 'AC and refrigerator technician', 6),
  ('Prasad N', 'individual', '90000 00014', (SELECT id FROM areas WHERE name='Thiruvananthapuram City'), 'Electrician and CCTV wiring', 13),
  ('Kottayam Painters', 'company', '90000 00015', (SELECT id FROM areas WHERE name='Kottayam'), 'Interior and exterior painting crews', 9);

INSERT INTO provider_services (provider_id, service_id)
SELECT p.id, s.id
FROM (VALUES
  ('Rajesh Kumar', 'Electrician'),
  ('Suresh P', 'Plumber'),
  ('CoolAir Services', 'AC Technician'),
  ('Anil Electricals', 'Electrician'),
  ('Shafeeq M', 'Carpenter'),
  ('Vinod K', 'Electrician'),
  ('Vinod K', 'Appliance Repair'),
  ('Kannur Home Care', 'Home Cleaning'),
  ('Kannur Home Care', 'Pest Control'),
  ('Jithin Das', 'Plumber'),
  ('Sajeev T', 'Painter'),
  ('Sajeev T', 'Mason'),
  ('Metro Fix Kochi', 'Electrician'),
  ('Metro Fix Kochi', 'Plumber'),
  ('Metro Fix Kochi', 'AC Technician'),
  ('Babu Joseph', 'Mason'),
  ('Thrissur Workforce Agency', 'Remote / Skilled Worker'),
  ('Nissar A', 'AC Technician'),
  ('Nissar A', 'Appliance Repair'),
  ('Prasad N', 'Electrician'),
  ('Kottayam Painters', 'Painter')
) AS v(provider_name, service_name)
JOIN providers p ON p.name = v.provider_name
JOIN services s ON s.name = v.service_name;