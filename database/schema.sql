-- PostgreSQL schema for Event Management (Neon-compatible)
-- Run once to initialise the database.

-- Drop tables in dependency order
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS events (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255)     NOT NULL,
    description TEXT,
    category    VARCHAR(100)     NOT NULL DEFAULT 'General',
    date        TIMESTAMP        NOT NULL,
    location    VARCHAR(255)     NOT NULL,
    price       NUMERIC(12, 2)   NOT NULL DEFAULT 0.00,
    inclusions  TEXT,
    image_url   VARCHAR(500),
    created_at  TIMESTAMP        NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_category ON events (category);
CREATE INDEX IF NOT EXISTS idx_events_date     ON events (date);

CREATE TABLE IF NOT EXISTS bookings (
    id          SERIAL PRIMARY KEY,
    event_id    INTEGER          REFERENCES events (id) ON DELETE SET NULL,
    name        VARCHAR(255)     NOT NULL,
    email       VARCHAR(255)     NOT NULL,
    phone       VARCHAR(15)      NOT NULL,
    event_type  VARCHAR(100)     NOT NULL,
    event_date  DATE             NOT NULL,
    guests      INTEGER          NOT NULL DEFAULT 1,
    message     TEXT,
    status      VARCHAR(20)      NOT NULL DEFAULT 'pending',
    created_at  TIMESTAMP        NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings (email);

CREATE TABLE IF NOT EXISTS contact_messages (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    subject    VARCHAR(255),
    message    TEXT         NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_messages (email);

CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    full_name       VARCHAR(120) NOT NULL,
    email           VARCHAR(180) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Seed demo events (skip if already present)
INSERT INTO events (title, description, category, date, location, price, inclusions, image_url)
SELECT * FROM (VALUES
  ('Grand Indian Wedding Celebration',
   'A three-day wedding with mehndi, sangeet and a full reception for up to 500 guests. Includes venue, decor, catering and an on-site event manager.',
   'Wedding', '2026-11-14 18:00:00'::TIMESTAMP, 'The Grand Palace Hall, Mumbai', 150000.00,
   E'Venue hire for 3 days\nCatering for 500 guests\nFloral & stage decor\nPhotography & cinematography\nLive music and DJ',
   '/images/events/wedding-grand.svg'),

  ('Beachside Destination Wedding',
   'An intimate destination wedding on the coast with a sunset ceremony and a beachside reception. Travel and stay packages available.',
   'Wedding', '2026-12-05 17:00:00'::TIMESTAMP, 'Goa Beachfront Resort', 225000.00,
   E'Beachfront ceremony setup\n5-star accommodation for 40 guests\nCatering & bar service\nHenna & makeup artists\nAirport transfers',
   '/images/events/wedding-beach.svg'),

  ('Traditional Sangeet Night',
   'A colourful pre-wedding celebration filled with classical dance, dhol beats and a buffet dinner for up to 200 guests.',
   'Wedding', '2026-10-18 19:30:00'::TIMESTAMP, 'Heritage Courtyard, Jaipur', 85000.00,
   E'Courtyard venue hire\nTraditional decor & drapping\nDhol and live music duo\nBuffet dinner for 200\nChoreography support',
   '/images/events/wedding-sangeet.svg'),

  ('Tech Innovators Summit 2026',
   'A full-day technology summit with keynote talks, panel discussions and networking breaks for 300 attendees.',
   'Corporate', '2026-11-21 09:00:00'::TIMESTAMP, 'ITC Grand Bharat, Noida', 75000.00,
   E'Conference hall for the day\nAV and stage setup\nTwo breakaway tracks\nLunch and coffee breaks\nEvent photography',
   '/images/events/corporate-summit.svg'),

  ('Annual Sales Kickoff',
   'A high-energy kickoff to set sales targets for the year, with team awards, a keynote talk and an evening social.',
   'Corporate', '2026-12-12 08:30:00'::TIMESTAMP, 'Taj Palace Convention Centre, Bengaluru', 110000.00,
   E'Full-day venue hire\nAward ceremony setup\nEvening social with bar\nBranded merchandise\nPresentation equipment',
   '/images/events/corporate-kickoff.svg'),

  ('Milestone 50th Birthday Gala',
   'A sophisticated evening celebrating five decades, with a sit-down dinner, live band and a keepsake cake for up to 80 guests.',
   'Birthday', '2026-10-30 19:00:00'::TIMESTAMP, 'The Conservatory, Bengaluru', 25000.00,
   E'Private dining room\nLive band for 3 hours\nFive-course dinner\nCustom celebration cake\nBalloon & photo booth decor',
   '/images/events/birthday-50th.svg'),

  ('Kids Garden Birthday Party',
   'A cheerful outdoor birthday party for children with games, a magic show, an art station and a cake of their choice.',
   'Birthday', '2026-10-25 16:00:00'::TIMESTAMP, 'Botanical Gardens Lawn, Pune', 12000.00,
   E'Garden lawn for 3 hours\nMagic show and games\nArt and craft station\nBirthday cake\nReturn gifts for 25 kids',
   '/images/events/birthday-garden.svg'),

  ('Global Music Festival',
   'A two-day outdoor music festival across four stages with 20+ artists, food courts and a camping zone.',
   'Concert', '2026-12-20 16:00:00'::TIMESTAMP, 'Marine Drive Grounds, Chennai', 9999.00,
   E'Weekend pass for all stages\nFood and beverage stalls\nCamping zone access\nFree shuttle service\nFirst aid on site',
   '/images/events/concert-festival.svg'),

  ('Standup Comedy Night Live',
   'An evening of stand-up with six performers, a host and an open mic segment in an intimate 250-seat venue.',
   'Concert', '2026-11-07 20:00:00'::TIMESTAMP, 'The Basement, New Delhi', 4500.00,
   E'Entry to the live show\nSix comedy performances\nWelcome drink\nOpen mic participation\nStandby queue priority',
   '/images/events/concert-comedy.svg')
) AS v(title, description, category, date, location, price, inclusions, image_url)
WHERE NOT EXISTS (SELECT 1 FROM events LIMIT 1);