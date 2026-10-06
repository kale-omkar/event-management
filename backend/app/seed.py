"""Demo data inserted automatically the first time the database is empty.

Prices are in Indian Rupees and are round, realistic package amounts rather
than converted dollar figures. Image paths are relative so the frontend can
resolve them against frontend/public/ with no API involvement.
"""

from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.event import Event
from app.models.service import Service

# 9 events across 4 categories, ordered by date.
SEED_EVENTS = [
    {
        "title": "Grand Indian Wedding Celebration",
        "category": "Wedding",
        "description": (
            "A three-day wedding with mehndi, sangeet and a full reception for up to "
            "500 guests. Includes venue, decor, catering and an on-site event manager."
        ),
        "date": datetime(2026, 11, 14, 18, 0),
        "location": "The Grand Palace Hall, Mumbai",
        "price": 150000.0,
        "inclusions": "Venue hire for 3 days\nCatering for 500 guests\nFloral & stage decor\nPhotography & cinematography\nLive music and DJ",
        "image_url": "/images/events/wedding-grand.svg",
    },
    {
        "title": "Beachside Destination Wedding",
        "category": "Wedding",
        "description": (
            "An intimate destination wedding on the coast with a sunset ceremony and "
            "a beachside reception. Travel and stay packages available."
        ),
        "date": datetime(2026, 12, 5, 17, 0),
        "location": "Goa Beachfront Resort",
        "price": 225000.0,
        "inclusions": "Beachfront ceremony setup\n5-star accommodation for 40 guests\nCatering & bar service\nHenna & makeup artists\nAirport transfers",
        "image_url": "/images/events/wedding-beach.svg",
    },
    {
        "title": "Traditional Sangeet Night",
        "category": "Wedding",
        "description": (
            "A colourful pre-wedding celebration filled with classical dance, dhol "
            "beats and a buffet dinner for up to 200 guests."
        ),
        "date": datetime(2026, 10, 18, 19, 30),
        "location": "Heritage Courtyard, Jaipur",
        "price": 85000.0,
        "inclusions": "Courtyard venue hire\nTraditional decor & draping\nDhol and live music duo\nBuffet dinner for 200\nChoreography support",
        "image_url": "/images/events/wedding-sangeet.svg",
    },
    {
        "title": "Tech Innovators Summit 2026",
        "category": "Corporate",
        "description": (
            "A full-day technology summit with keynote talks, panel discussions and "
            "networking breaks for 300 attendees."
        ),
        "date": datetime(2026, 11, 21, 9, 0),
        "location": "ITC Grand Bharat, Noida",
        "price": 75000.0,
        "inclusions": "Conference hall for the day\nAV and stage setup\nTwo breakaway tracks\nLunch and coffee breaks\nEvent photography",
        "image_url": "/images/events/corporate-summit.svg",
    },
    {
        "title": "Annual Sales Kickoff",
        "category": "Corporate",
        "description": (
            "A high-energy kickoff to set sales targets for the year, with team "
            "awards, keynote motivational talk and an evening social."
        ),
        "date": datetime(2026, 12, 12, 8, 30),
        "location": "Taj Palace Convention Centre, Bengaluru",
        "price": 110000.0,
        "inclusions": "Full-day venue hire\nAward ceremony setup\nEvening social with bar\nBranded merchandise\nPresentation equipment",
        "image_url": "/images/events/corporate-kickoff.svg",
    },
    {
        "title": "Milestone 50th Birthday Gala",
        "category": "Birthday",
        "description": (
            "A sophisticated evening celebrating five decades, with a sit-down dinner, "
            "live band and a keepsake cake for up to 80 guests."
        ),
        "date": datetime(2026, 10, 30, 19, 0),
        "location": "The Conservatory, Bengaluru",
        "price": 25000.0,
        "inclusions": "Private dining room\nLive band for 3 hours\nFive-course dinner\nCustom celebration cake\nBalloon & photo booth decor",
        "image_url": "/images/events/birthday-50th.svg",
    },
    {
        "title": "Kids Garden Birthday Party",
        "category": "Birthday",
        "description": (
            "A cheerful outdoor birthday party for children with games, magic show, "
            "art station and a cake of their choice."
        ),
        "date": datetime(2026, 10, 25, 16, 0),
        "location": "Botanical Gardens Lawn, Pune",
        "price": 12000.0,
        "inclusions": "Garden lawn for 3 hours\nMagic show and games\nArt and craft station\nBirthday cake\nReturn gifts for 25 kids",
        "image_url": "/images/events/birthday-garden.svg",
    },
    {
        "title": "Global Music Festival",
        "category": "Concert",
        "description": (
            "A two-day outdoor music festival across four stages with 20+ artists, "
            "food courts and a camping zone."
        ),
        "date": datetime(2026, 12, 20, 16, 0),
        "location": "Marine Drive Grounds, Chennai",
        "price": 9999.0,
        "inclusions": "Weekend pass for all stages\nFood and beverage stalls\nCamping zone access\nFree shuttle service\nFirst aid on site",
        "image_url": "/images/events/concert-festival.svg",
    },
    {
        "title": "Standup Comedy Night Live",
        "category": "Concert",
        "description": (
            "An evening of stand-up with six performers, a host and an open mic "
            "segment in an intimate 250-seat venue."
        ),
        "date": datetime(2026, 11, 7, 20, 0),
        "location": "The Basement, New Delhi",
        "price": 4500.0,
        "inclusions": "Entry to the live show\nSix comedy performances\nWelcome drink\nOpen mic participation\nStandby queue priority",
        "image_url": "/images/events/concert-comedy.svg",
    },
]

# Demo services displayed on the Services page.
SEED_SERVICES = [
    {
        "name": "Wedding Planning",
        "description": (
            "Mehndi, sangeet, ceremony and reception planned end to end, "
            "with vendor coordination on the day."
        ),
        "image_url": "/images/services/wedding-planning.svg",
    },
    {
        "name": "Corporate Events",
        "description": (
            "Conferences, kickoffs and award nights with AV, staging and "
            "a run-sheet your team can rely on."
        ),
        "image_url": "/images/services/corporate-events.svg",
    },
    {
        "name": "Birthday Parties",
        "description": (
            "Milestone birthdays and children's parties, with themed decor, "
            "games and a cake of your choice."
        ),
        "image_url": "/images/services/birthday-parties.svg",
    },
    {
        "name": "Live Music & Concerts",
        "description": (
            "Artist booking, sound and lighting for concerts, festivals "
            "and private performances."
        ),
        "image_url": "/images/services/live-music.svg",
    },
    {
        "name": "Catering & Decor",
        "description": (
            "Menus for every budget, from buffet to plated, paired with "
            "themed decor and floral design."
        ),
        "image_url": "/images/services/catering-decor.svg",
    },
    {
        "name": "Photo & Video",
        "description": (
            "Candid photography, highlight films and same-day edits "
            "delivered after your event."
        ),
        "image_url": "/images/services/photo-video.svg",
    },
]


def seed_if_empty(db: Session) -> int:
    """Insert demo events and services when their tables are empty.

    Returns the total number of records inserted.
    Existing data is never overwritten.
    """
    inserted = 0

    existing_events = db.scalar(select(func.count()).select_from(Event))

    if not existing_events:
        db.add_all(
            [
                Event(id=index, **row)
                for index, row in enumerate(SEED_EVENTS, start=1)
            ]
        )
        inserted += len(SEED_EVENTS)

    existing_services = db.scalar(select(func.count()).select_from(Service))

    if not existing_services:
        db.add_all(
            [
                Service(id=index, **row)
                for index, row in enumerate(SEED_SERVICES, start=1)
            ]
        )
        inserted += len(SEED_SERVICES)

    if inserted:
        db.commit()

    return inserted