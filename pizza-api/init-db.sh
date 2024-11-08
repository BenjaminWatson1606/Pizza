#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE TABLE pizzas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    price DECIMAL(5,2) NOT NULL,
    image_url TEXT
  );

  INSERT INTO pizzas (name, description, price, image_url) VALUES
  ('Margherita', 'Tomato, mozzarella', 8.50, 'https://www.dominos.fr/ManagedAssets/FR/product/PMAR/FR_PMAR_fr_hero_13359.png?v-536408585'),
  ('Pepperoni', 'Tomato, mozzarella, pepperoni', 9.50, 'https://www.dominos.fr/ManagedAssets/FR/product/PCHP/FR_PCHP_fr_hero_13359.png?v1228566597'),
  ('BBQ Chicken', 'BBQ sauce, chicken, and red onions', 10.00, 'https://www.dominos.fr/ManagedAssets/FR/product/PCBQ/FR_PCBQ_fr_hero_13347.png?v1398276305'),
  ('Hawaiian', 'Tomato, mozzarella, chicken, and pineapple', 9.00, 'https://www.dominos.fr/ManagedAssets/FR/product/PHAP/FR_PHAP_fr_hero_13359.png?v504036970'),
  ('Veggie', 'Tomato, mozzarella, bell peppers, onions, mushrooms, and olives', 9.00, 'https://www.dominos.fr/ManagedAssets/FR/product/PSUV/FR_PSUV_fr_hero_13359.png?v-1863212976'),
  ('Meat Lovers', 'Tomato, mozzarella, pepperoni, sausage, ham, and bacon', 11.00, 'https://www.dominos.fr/ManagedAssets/FR/product/PBLO/FR_PBLO_fr_hero_13347.png?v-530112984'),
  ('Four Cheese', 'Tomato, mozzarella, parmesan, gorgonzola, and ricotta', 9.50, 'https://www.dominos.fr/ManagedAssets/FR/product/P4FR/FR_P4FR_fr_hero_13347.png?v1737304999');
EOSQL
