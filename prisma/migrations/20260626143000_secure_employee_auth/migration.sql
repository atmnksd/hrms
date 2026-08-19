alter table employees
add column if not exists password_hash text not null default '$2b$10$TyGg/4.4UYa.og383ZLw9.C.2.cxEbUSbj531Y8Er0rr1S4bKZ5ke';
