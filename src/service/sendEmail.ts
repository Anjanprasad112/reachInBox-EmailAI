import nodemailer from 'nodemailer';

// Function to send an email
export async function sendEmail(recipient: string, subject: string, text: string): Promise<void> {
    try {
        // Create a transporter using SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Assuming you are using Gmail. You can use other services or provide SMTP details directly
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASSWORD // Your email password or app-specific password
            }
        });

        // Define email options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address (must be the same as authenticated user)
            to: recipient, // Recipient address
            subject: subject, // Subject line
            text: text // Plain text body
        };

        // Send email
        await transporter.sendMail(mailOptions);

        console.log(`Email sent successfully to ${recipient}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}
