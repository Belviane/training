<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vendeur extends Model
{
    use HasFactory;

    protected $table = 'vendeurs';
    protected $fillable = [
        'matriculeVE',
        'utilisateur_id',
        'date_derniere_connexion'
        
    ];

    public function utilisateur() {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }
}
