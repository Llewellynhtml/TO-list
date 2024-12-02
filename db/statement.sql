

CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT ,                   
    age INTEGER,                       
    work TEXT,                  
    priority TEXT CHECK(priority IN ('high', 'medium', 'low')), 
    due_date DATE                         
);


INSERT INTO user (name, age, work, priority, due_date) 
VALUES
               ('Lesego ', 30, 'Software Engineer', 'high', '2024-08-01'),


          




            
  