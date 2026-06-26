alter table employees
add column if not exists password_hash text not null default '$2b$10$rR3wCFZBchGJ.b/mF1JHquHPAUX6M.8nrnHHjKsGDAlf8Ddq4qM3m';
