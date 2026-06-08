using Common.DTOs.mailing;
using Common.Enums;
using Common.Interfaces;
using Common.Models;
using MailKit.Security;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using MailKit.Net.Smtp;
using MimeKit;
using QRCoder;
using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace MailingService
{
    /// <summary>
    /// An instance of this class is created for each service instance by the Service Fabric runtime.
    /// </summary>
    internal sealed class MailingService : StatelessService, IMailingService
    {
        private readonly string _fromEmail;
        private readonly string _fromPassword;
        private readonly string _fromName;

        public MailingService(StatelessServiceContext context)
            : base(context)
        {
            var config = context.CodePackageActivationContext
                .GetConfigurationPackageObject("Config").Settings;

            var mailSection = config.Sections["MailConfig"];
            _fromEmail = mailSection.Parameters["FromEmail"].Value;
            _fromPassword = mailSection.Parameters["Password"].Value;
            _fromName = mailSection.Parameters["FromName"].Value;
        }

        public async Task<Result<bool>> SendShareEmailAsync(SendShareEmailDto dto)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_fromName, _fromEmail));
                message.To.Add(new MailboxAddress("", dto.ToEmail));
                message.Subject = $"Travel plan '{dto.PlanTitle} has been shared with you'";

                var accessText = dto.AccessType == AccessType.Edit ? "you can view and edit" : "you can only view";

                var builder = new BodyBuilder();

                //HTML template
                builder.HtmlBody = $@"
                    <div style='font-family: ""Segoe UI"", Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; background-color: #ffffff;'>
    
                        <div style='background-color: #2c3e50; padding: 20px; text-align: center; color: #ffffff;'>
                            <h1 style='margin: 0; font-size: 24px;'>Travel Plan Shared</h1>
                        </div>

                        <div style='padding: 30px; color: #333;'>
                            <p style='font-size: 16px;'>Hello,</p>
                            <p>A travel plan <strong>'{dto.PlanTitle}'</strong> has been shared with you.</p>

                            <div style='background-color: #f8f9fa; border-left: 5px solid #3498db; padding: 15px; margin: 20px 0; border-radius: 4px;'>
                                <strong style='color: #2c3e50;'>Access Level:</strong> <span style='color: #34495e;'>{accessText}</span>
                            </div>

                            <p style='text-align: center;'>
                                <a href='{dto.ShareUrl}' style='background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Open Travel Plan</a>
                            </p>

                            <div style='text-align: center; margin-top: 30px;'>
                                <p style='font-size: 14px; color: #7f8c8d;'>Scan the QR code below for quick access:</p>
                                <img src='cid:qr_code_id' alt='QR Code' style='width: 180px; height: 180px; border: 1px solid #ddd; padding: 5px;' />
                            </div>

                            {(dto.ExpiresAt.HasValue
                                  ? $"<p style='font-size: 12px; color: #95a5a6; margin-top: 30px;'>This link expires on: {dto.ExpiresAt.Value:dd.MM.yyyy HH:mm}</p>"
                                  : "")}
            
                            <p style='margin-top: 30px;'>Best regards,<br><strong>The Travel Planning Team</strong></p>
                        </div>

                        <div style='background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #7f8c8d;'>
                            <p>&copy; 2026 Travel Planning Team. All rights reserved.</p>
                        </div>
                    </div>";

                //generisanje i dodavanje QR koda
                using (var qrGenerator = new QRCodeGenerator())
                {
                    var qrCodeData = qrGenerator.CreateQrCode(dto.ShareUrl, QRCodeGenerator.ECCLevel.Q);
                    var pngQrCode = new PngByteQRCode(qrCodeData);
                    byte[] qrCodeImage = pngQrCode.GetGraphic(20);

                    var attachment = builder.Attachments.Add("qr.png", qrCodeImage);
                    attachment.ContentId = "qr_code_id";
                    attachment.ContentDisposition = new ContentDisposition(ContentDisposition.Inline);
                }

                message.Body = builder.ToMessageBody();

                //slanje mejla
                using(var client = new SmtpClient())
                {
                    await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(_fromEmail, _fromPassword);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }

                ServiceEventSource.Current.ServiceMessage(this.Context, "Email successfully sent to: {0}", dto.ToEmail);
                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                ServiceEventSource.Current.ServiceMessage(this.Context, "Error sending email: {0}", ex.Message);
                return Result<bool>.Failure($"Failed to send email: {ex.Message}");
            }
        }

        /// <summary>
        /// Optional override to create listeners (e.g., TCP, HTTP) for this service replica to handle client or user requests.
        /// </summary>
        /// <returns>A collection of listeners.</returns>
        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return this.CreateServiceRemotingInstanceListeners();
        }

        /// <summary>
        /// This is the main entry point for your service instance.
        /// </summary>
        /// <param name="cancellationToken">Canceled when Service Fabric needs to shut down this service instance.</param>
        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            // TODO: Replace the following sample code with your own logic 
            //       or remove this RunAsync override if it's not needed in your service.

            long iterations = 0;

            while (true)
            {
                cancellationToken.ThrowIfCancellationRequested();

                ServiceEventSource.Current.ServiceMessage(this.Context, "Working-{0}", ++iterations);

                await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
            }
        }
    }
}
