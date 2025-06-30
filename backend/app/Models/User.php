<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory;

    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $table = 'utilisateurs';

    protected $fillable = [
        'nom',
        'prenom',
        'genre',
        'date_naissance',
        'email',
        'password',
        'role_id',
        'login',
        'login',
        'is_active',
        'verification_code',
        'email_verified',
        'doit_changer_mot_de_passe'
    ];

    protected $casts = [
        'verrouille_jusqua' => 'datetime',
    ];


    protected $hidden = [
        'password',
        //'mdp',
        'remember_token',
    ];

    


    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function formateur()
    {
        return $this->hasOne(Formateur::class, 'utilisateur_id');
    }

    public function apprenant()
    {
        return $this->hasOne(Apprenant::class, 'utilisateur_id');
    }

    public function superviseur()
    {
        return $this->hasOne(Superviseur::class, 'utilisateur_id');
    }

    public function administrateur()
    {
        return $this->hasOne(Administrateur::class, 'utilisateur_id');
    }

    public function parents()
    {
        return $this->hasOne(Parents::class, 'utilisateur_id');
    }

    public function caissier()
    {
        return $this->hasOne(Caissier::class, 'utilisateur_id');
    }

    public function auditeur()
    {
        return $this->hasOne(Auditeur::class, 'utilisateur_id');
    }

    public function vendeur()
    {
        return $this->hasOne(Vendeur::class, 'utilisateur_id');
    }

    public function inscriptionsFormateur()
    {
        return $this->hasMany(Inscriptions::class, 'formateur_id');
    }

    
}
