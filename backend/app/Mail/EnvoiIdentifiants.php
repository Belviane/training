<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;



class EnvoiIdentifiants extends Mailable
{
    use Queueable, SerializesModels;

    public $utilisateur;
    public $motDePasse;

    /**
     * Create a new message instance.
     */
    public function __construct($utilisateur, $motDePasse)
    {
        $this->utilisateur = $utilisateur;
        $this->motDePasse = $motDePasse;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Envoi Identifiants',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.name',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    public function build()
    {
       return $this->subject('Vos identifiants et vérification email')
                    ->html("
                        <h2>Bonjour {$this->utilisateur->prenom} {$this->utilisateur->nom}</h2>
                        <p>Voici vos identifiants temporaires :</p>
                        <ul>
                            <li><strong>Login :</strong> {$this->utilisateur->login}</li>
                            <li><strong>Mot de passe temporaire :</strong> {$this->motDePasse}</li>
                        </ul>
                        <p>Merci de vérifier votre email avec ce code :</p>
                        <h3>{$this->utilisateur->verification_code}</h3>
                        <p>Après vérification, vous pourrez vous connecter et serez invité à modifier vos identifiants.</p>
                    ");
    }
}
