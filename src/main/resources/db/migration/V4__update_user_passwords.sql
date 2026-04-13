-- Update user passwords with correct bcrypt hash
-- Password for both users: admin123
-- Hash generated with bcrypt cost factor 12

UPDATE users 
SET password = '$2a$12$UAFYjELNJ2pSIZIewtf9ge72VZVaOIuUVYRiN3Kwj9sKqyw744Eii'
WHERE username IN ('admin', 'user');
