CREATE TABLE IF NOT EXISTS product_question (
  id VARCHAR PRIMARY KEY,
  product_id VARCHAR NOT NULL,
  customer_name VARCHAR NOT NULL,
  customer_email VARCHAR NOT NULL,
  question TEXT NOT NULL,
  answer TEXT,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  answered_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT now()
);
