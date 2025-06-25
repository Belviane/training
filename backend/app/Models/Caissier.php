<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Caissier extends Model
{
    use HasFactory;

    protected $table = 'caissiers';
    protected $fillable = [
        'matriculeCA',
        'date_derniere_action',
        'utilisateur_id'
    ];

    public function utilisateur() {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }
}
