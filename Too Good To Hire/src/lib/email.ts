import { Resend } from 'resend';
import { EmailTemplate } from '@/types';

class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY || 'placeholder-resend-key');
  }

  // Email templates
  private templates = {
    invite: {
      subject: 'Invitation à un entretien - {{job_title}}',
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Invitation à un entretien</h2>
          
          <p>Bonjour {{candidate_name}},</p>
          
          <p>Nous avons étudié votre candidature pour le poste de <strong>{{job_title}}</strong> 
          et souhaitons vous proposer un entretien de screening.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Détails du poste :</h3>
            <p><strong>Poste :</strong> {{job_title}}</p>
            <p><strong>Entreprise :</strong> {{company_name}}</p>
            <p><strong>Type :</strong> {{job_type}}</p>
          </div>
          
          <p>
            <a href="{{scheduling_link}}" 
               style="background: #2563eb; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Choisir un créneau
            </a>
          </p>
          
          <p>Nous avons hâte de vous rencontrer !</p>
          
          <p>Cordialement,<br>
          {{recruiter_name}}<br>
          {{company_name}}</p>
        </div>
      `
    },

    confirmation: {
      subject: 'Confirmation entretien - {{job_title}}',
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Entretien confirmé</h2>
          
          <p>Bonjour {{candidate_name}},</p>
          
          <p>Votre entretien est confirmé pour :</p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
            <p><strong>Date :</strong> {{date}}</p>
            <p><strong>Heure :</strong> {{time}}</p>
            <p><strong>Durée :</strong> 30 minutes</p>
            <p><strong>Type :</strong> Visioconférence</p>
          </div>
          
          <p>
            <a href="{{meeting_url}}" 
               style="background: #16a34a; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Rejoindre la réunion
            </a>
          </p>
          
          <p><strong>Conseils pour l'entretien :</strong></p>
          <ul>
            <li>Testez votre connexion internet et votre caméra</li>
            <li>Préparez vos questions sur le poste et l'entreprise</li>
            <li>Ayez votre CV à portée de main</li>
          </ul>
          
          <p>À bientôt !</p>
          
          <p>Cordialement,<br>
          {{recruiter_name}}</p>
        </div>
      `
    },

    acceptance: {
      subject: 'Bonne nouvelle concernant votre candidature - {{job_title}}',
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Félicitations !</h2>
          
          <p>Bonjour {{candidate_name}},</p>
          
          <p>Nous avons le plaisir de vous informer que votre candidature 
          pour le poste de <strong>{{job_title}}</strong> a retenu notre attention.</p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Votre profil correspond parfaitement à nos attentes et nous souhaitons 
            poursuivre le processus de recrutement avec vous.</p>
          </div>
          
          <p>Nous vous recontacterons prochainement pour vous présenter les prochaines étapes.</p>
          
          <p>Encore félicitations !</p>
          
          <p>Cordialement,<br>
          {{recruiter_name}}<br>
          {{company_name}}</p>
        </div>
      `
    },

    rejection: {
      subject: 'Suite à votre candidature - {{job_title}}',
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #64748b;">Merci pour votre candidature</h2>
          
          <p>Bonjour {{candidate_name}},</p>
          
          <p>Nous vous remercions pour l'intérêt porté à notre entreprise 
          et le temps consacré à votre candidature pour le poste de <strong>{{job_title}}</strong>.</p>
          
          <p>Après étude attentive de votre profil et suite à notre entretien, 
          nous avons décidé de ne pas poursuivre le processus de recrutement avec vous pour ce poste.</p>
          
          {{#if reason}}
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Retour :</strong> {{reason}}</p>
          </div>
          {{/if}}
          
          <p>Cette décision ne remet pas en question vos compétences. 
          Nous conservons votre profil dans notre base de données et ne manquerons pas 
          de vous recontacter si une opportunité correspondant davantage à votre profil se présente.</p>
          
          <p>Nous vous souhaitons bonne continuation dans vos recherches.</p>
          
          <p>Cordialement,<br>
          {{recruiter_name}}<br>
          {{company_name}}</p>
        </div>
      `
    }
  };

  // Send invitation email
  async sendInvitation(params: {
    to: string;
    candidateName: string;
    jobTitle: string;
    companyName: string;
    jobType: string;
    schedulingLink: string;
    recruiterName: string;
  }) {
    const template = this.templates.invite;
    const html = this.replaceVariables(template.body, {
      candidate_name: params.candidateName,
      job_title: params.jobTitle,
      company_name: params.companyName,
      job_type: params.jobType,
      scheduling_link: params.schedulingLink,
      recruiter_name: params.recruiterName
    });

    const subject = this.replaceVariables(template.subject, {
      job_title: params.jobTitle
    });

    return this.sendEmail({
      to: params.to,
      subject,
      html
    });
  }

  // Send confirmation email
  async sendConfirmation(params: {
    to: string;
    candidateName: string;
    jobTitle: string;
    date: string;
    time: string;
    meetingUrl: string;
    recruiterName: string;
  }) {
    const template = this.templates.confirmation;
    const html = this.replaceVariables(template.body, {
      candidate_name: params.candidateName,
      job_title: params.jobTitle,
      date: params.date,
      time: params.time,
      meeting_url: params.meetingUrl,
      recruiter_name: params.recruiterName
    });

    const subject = this.replaceVariables(template.subject, {
      job_title: params.jobTitle
    });

    return this.sendEmail({
      to: params.to,
      subject,
      html
    });
  }

  // Send acceptance email
  async sendAcceptance(params: {
    to: string;
    candidateName: string;
    jobTitle: string;
    companyName: string;
    recruiterName: string;
  }) {
    const template = this.templates.acceptance;
    const html = this.replaceVariables(template.body, {
      candidate_name: params.candidateName,
      job_title: params.jobTitle,
      company_name: params.companyName,
      recruiter_name: params.recruiterName
    });

    const subject = this.replaceVariables(template.subject, {
      job_title: params.jobTitle
    });

    return this.sendEmail({
      to: params.to,
      subject,
      html
    });
  }

  // Send rejection email
  async sendRejection(params: {
    to: string;
    candidateName: string;
    jobTitle: string;
    companyName: string;
    recruiterName: string;
    reason?: string;
  }) {
    const template = this.templates.rejection;
    let html = this.replaceVariables(template.body, {
      candidate_name: params.candidateName,
      job_title: params.jobTitle,
      company_name: params.companyName,
      recruiter_name: params.recruiterName,
      reason: params.reason || ''
    });

    // Handle conditional reason display
    if (params.reason) {
      html = html.replace('{{#if reason}}', '').replace('{{/if}}', '');
    } else {
      html = html.replace(/{{#if reason}}[\s\S]*?{{\/if}}/g, '');
    }

    const subject = this.replaceVariables(template.subject, {
      job_title: params.jobTitle
    });

    return this.sendEmail({
      to: params.to,
      subject,
      html
    });
  }

  // Generic send email method
  private async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }) {
    try {
      const result = await this.resend.emails.send({
        from: params.from || 'Hiring Agent <noreply@hiringagent.com>',
        to: params.to,
        subject: params.subject,
        html: params.html,
      });

      return { success: true, id: result.data?.id };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Replace template variables
  private replaceVariables(template: string, variables: Record<string, string>): string {
    let result = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    });

    return result;
  }
}

export const emailService = new EmailService();