"""Models package.

Importing a model here registers it with SQLAlchemy's metadata, which is what
`Base.metadata.create_all` needs in order to build the tables on startup.
"""

from app.models.booking import Booking
from app.models.contact import ContactMessage
from app.models.event import Event

__all__ = ["Event", "Booking", "ContactMessage"]