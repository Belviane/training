<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Auditeur extends Model
{
    use HasFactory;

    protected $table = 'auditeurs';
    protected $fillable = [
        'matriculeFO',
        'date_dernier_Audit',
        'utilisateur_id'
    ];

    public function utilisateur() {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }
}
