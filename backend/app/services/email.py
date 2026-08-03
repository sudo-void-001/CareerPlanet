import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def send_email(to_email: str, subject: str, body: str):
    """
    MOCK EMAIL SERVICE
    For the 3-day MVP competition, this simply logs the email to the console.
    """
    logger.info(f"--- EMAIL DISPATCH ---")
    logger.info(f"To: {to_email}")
    logger.info(f"Subject: {subject}")
    logger.info(f"Body: {body}")
    logger.info(f"----------------------")
    return True

def send_welcome_email(user_email: str, full_name: str):
    return send_email(
        to_email=user_email,
        subject="Welcome to Career Planet!",
        body=f"Hi {full_name}, welcome to Career Planet. We are excited to help you find your dream job!"
    )

def send_application_status_update(student_email: str, job_title: str, new_status: str):
    return send_email(
        to_email=student_email,
        subject=f"Update on your application for {job_title}",
        body=f"Your application status has been updated to: {new_status.upper()}."
    )
