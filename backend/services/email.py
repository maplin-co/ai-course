import os
import logging
from typing import List, Optional
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.api_key = os.getenv("SENDGRID_API_KEY")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@learnflow.ai")
        self.client = SendGridAPIClient(self.api_key) if self.api_key else None

    async def send_email(
        self, 
        to_emails: List[str], 
        subject: str, 
        html_content: str,
        from_email: Optional[str] = None
    ):
        """
        Send an email using SendGrid. 
        If no API key is set, it logs the email content to console (for development).
        """
        if not self.client:
            logger.info(f"DEMO MODE: Email not sent (no API key). To: {to_emails}, Subject: {subject}")
            # In a real dev environment, we would log the content or use a local SMTP tester
            return True

        message = Mail(
            from_email=from_email or self.from_email,
            to_emails=to_emails,
            subject=subject,
            html_content=html_content
        )

        try:
            response = self.client.send(message)
            logger.info(f"Email sent! Status code: {response.status_code}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            return False

# Global instance
email_service = EmailService()
