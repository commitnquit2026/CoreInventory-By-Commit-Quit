"""
Email sending utility for CoreInventory
Uses SMTP for sending password reset emails
"""
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

class EmailUtils:
    """Email utility for sending emails"""
    
    # SMTP Configuration
    SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
    SENDER_EMAIL = os.getenv('SENDER_EMAIL', 'coreinventory@gmail.com')
    SENDER_PASSWORD = os.getenv('SENDER_PASSWORD', '')
    
    @staticmethod
    def send_password_reset_email(user_email, user_name, reset_token, otp_code):
        """
        Send password reset email with OTP
        
        Args:
            user_email: User's email address
            user_name: User's full name
            reset_token: Token for identifying reset request
            otp_code: One-time password for verification
        
        Returns:
            tuple: (success: bool, message: str)
        """
        try:
            if not EmailUtils.SENDER_PASSWORD:
                return True, "Email service not configured (OTP will still work)"
            
            # Email subject
            subject = "CoreInventory - Password Reset Request"
            
            # HTML email body
            html_body = f"""
            <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #0066cc; color: white; padding: 20px; border-radius: 5px; text-align: center; }}
                        .content {{ padding: 20px; background-color: #f5f5f5; margin: 20px 0; border-radius: 5px; }}
                        .otp-box {{ background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }}
                        .otp-code {{ font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #ff6b6b; }}
                        .footer {{ font-size: 12px; color: #666; text-align: center; margin-top: 20px; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Password Reset Request</h1>
                        </div>
                        
                        <div class="content">
                            <p>Hi {user_name},</p>
                            
                            <p>We received a request to reset your CoreInventory password. If you did not make this request, please ignore this email.</p>
                            
                            <p>To complete your password reset, use the following one-time password (OTP) in the password reset form:</p>
                            
                            <div class="otp-box">
                                <p>Your OTP:</p>
                                <p class="otp-code">{otp_code}</p>
                                <p style="margin-top: 10px; font-size: 12px;">This OTP will expire in 1 hour.</p>
                            </div>
                            
                            <p><strong>Steps to reset your password:</strong></p>
                            <ol>
                                <li>Go to the password reset page</li>
                                <li>Enter your email address</li>
                                <li>Enter the OTP code above</li>
                                <li>Create a new password</li>
                                <li>Save and log in with your new password</li>
                            </ol>
                            
                            <p style="color: red; font-size: 12px;">
                                <strong>Security Note:</strong> Never share your OTP with anyone. We will never ask for your password via email.
                            </p>
                        </div>
                        
                        <div class="footer">
                            <p>CoreInventory © 2026 | All rights reserved</p>
                            <p>This is an automated email. Please do not reply to this message.</p>
                        </div>
                    </div>
                </body>
            </html>
            """
            
            # Plain text fallback
            text_body = f"""
            CoreInventory - Password Reset Request
            
            Hi {user_name},
            
            We received a request to reset your CoreInventory password.
            
            Your one-time password (OTP) is: {otp_code}
            
            This OTP will expire in 1 hour.
            
            If you did not request this, please ignore this email.
            
            ---
            CoreInventory © 2026
            """
            
            # Create message
            message = MIMEMultipart('alternative')
            message['Subject'] = subject
            message['From'] = EmailUtils.SENDER_EMAIL
            message['To'] = user_email
            
            # Attach both text and HTML
            part1 = MIMEText(text_body, 'plain')
            part2 = MIMEText(html_body, 'html')
            message.attach(part1)
            message.attach(part2)
            
            # Send email
            with smtplib.SMTP(EmailUtils.SMTP_SERVER, EmailUtils.SMTP_PORT) as server:
                server.starttls()  # Secure connection
                server.login(EmailUtils.SENDER_EMAIL, EmailUtils.SENDER_PASSWORD)
                server.send_message(message)
            
            return True, "Password reset email sent successfully"
        
        except smtplib.SMTPAuthenticationError:
            return False, "Email service authentication failed. Check SMTP credentials."
        except smtplib.SMTPException as e:
            return False, f"SMTP error: {str(e)}"
        except Exception as e:
            return False, f"Error sending email: {str(e)}"
    
    @staticmethod
    def send_welcome_email(user_email, user_name):
        """
        Send welcome email to new user
        
        Args:
            user_email: User's email address
            user_name: User's full name
        
        Returns:
            tuple: (success: bool, message: str)
        """
        try:
            if not EmailUtils.SENDER_PASSWORD:
                return True, "Email service not configured"
            
            subject = "Welcome to CoreInventory"
            
            html_body = f"""
            <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #0066cc; color: white; padding: 20px; border-radius: 5px; text-align: center; }}
                        .content {{ padding: 20px; background-color: #f5f5f5; margin: 20px 0; border-radius: 5px; }}
                        .footer {{ font-size: 12px; color: #666; text-align: center; margin-top: 20px; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to CoreInventory</h1>
                        </div>
                        
                        <div class="content">
                            <p>Hi {user_name},</p>
                            
                            <p>Thank you for signing up for CoreInventory! Your account has been created successfully.</p>
                            
                            <p>You can now log in and start managing your inventory. Here's what you can do:</p>
                            
                            <ul>
                                <li>Create and manage products</li>
                                <li>Track receipts and deliveries</li>
                                <li>Monitor stock levels</li>
                                <li>Generate reports</li>
                                <li>Manage warehouses and locations</li>
                            </ul>
                            
                            <p>If you have any questions or need help, please contact our support team.</p>
                            
                            <p>Happy inventory management!</p>
                        </div>
                        
                        <div class="footer">
                            <p>CoreInventory © 2026 | All rights reserved</p>
                        </div>
                    </div>
                </body>
            </html>
            """
            
            text_body = f"""
            Welcome to CoreInventory
            
            Hi {user_name},
            
            Thank you for signing up! Your account has been created.
            
            You can now log in and start managing your inventory.
            
            ---
            CoreInventory © 2026
            """
            
            message = MIMEMultipart('alternative')
            message['Subject'] = subject
            message['From'] = EmailUtils.SENDER_EMAIL
            message['To'] = user_email
            
            part1 = MIMEText(text_body, 'plain')
            part2 = MIMEText(html_body, 'html')
            message.attach(part1)
            message.attach(part2)
            
            with smtplib.SMTP(EmailUtils.SMTP_SERVER, EmailUtils.SMTP_PORT) as server:
                server.starttls()
                server.login(EmailUtils.SENDER_EMAIL, EmailUtils.SENDER_PASSWORD)
                server.send_message(message)
            
            return True, "Welcome email sent successfully"
        
        except Exception as e:
            return False, f"Error sending email: {str(e)}"
