using MailKit.Net.Smtp;
using MimeKit;

namespace MasterPieceApi.DTOs
{
    public class EmailService : IEmailService
    {
        public async Task SendEmailAsync(string email, string subject, string message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("Ajloun Tour", "Ajlountour@example.com"));
            emailMessage.To.Add(new MailboxAddress("", email));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart("html") { Text = message };

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync("smtp.gmail.com", 465, true);
                await client.AuthenticateAsync("ajlountour@gmail.com", "vtlh hmgs geta srzp");
                await client.SendAsync(emailMessage); // Pass the MimeMessage object here
                await client.DisconnectAsync(true);
            }

        }
    }
}
