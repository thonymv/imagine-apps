import logging
from datetime import UTC, datetime

from app.db.mongo import get_db

logger = logging.getLogger(__name__)


class AuditService:
    COLLECTION = "events"

    async def record_event(
        self, user: str, action: str, ticket_id: int
    ) -> None:
        try:
            await get_db()[self.COLLECTION].insert_one(
                {
                    "user": user,
                    "action": action,
                    "ticket_id": ticket_id,
                    "at": datetime.now(UTC),
                }
            )
        except Exception as exc:
            logger.warning("audit event dropped: %s", exc)
