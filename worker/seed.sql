-- Piece by Piece — Seed Data

INSERT INTO products (name, slug, description, price_cents, category) VALUES
  ('Restored Oak Dresser',         'restored-oak-dresser',    'Six drawers. Dovetail joints. Sanded to satin.',                89500, 'Bedroom'),
  ('Mid-Century Walnut Nightstand','walnut-nightstand',       'Tapered legs. Brass pulls. One careful owner before us.',       34500, 'Bedroom'),
  ('Farmhouse Dining Table',       'farmhouse-dining-table',  'Seats eight. Pine top, chalk-white trestle base.',            120000, 'Dining'),
  ('Art Deco Vanity Mirror',       'art-deco-vanity',         'Beveled glass. Gilded frame brought back to life.',            24500, 'Accent'),
  ('Industrial Pipe Bookshelf',    'industrial-bookshelf',    'Reclaimed lumber. Iron pipe frame. Five shelves of character.',67500, 'Living Room'),
  ('Victorian Writing Desk',       'victorian-writing-desk',  'Roll-top. Hidden compartments. Mahogany, refinished twice.',   95000, 'Office');

INSERT INTO testimonials (customer, location, quote, piece_name, rating) VALUES
  ('Margaret & Paul',    'Asheville, NC',   'The dresser arrived and we just stood there. It looked like it had always been ours.',                    'Restored Oak Dresser', 5),
  ('James T.',           'Savannah, GA',    'Built solid. Finished beautiful. No notes.',                                                              'Farmhouse Dining Table', 5),
  ('Diane Kowalski',     'Portland, ME',    'I called about one piece and left with three. Everything they touch turns to gold.',                       NULL, 5),
  ('The Reeves Family',  'Charleston, SC',  'Our daughter spilled grape juice on it the first week. Wiped right off. That finish is no joke.',         'Mid-Century Walnut Nightstand', 4);
