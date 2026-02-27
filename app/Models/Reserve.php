<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reserve extends Model
{
    /** @use HasFactory<\Database\Factories\ReserveFactory> */
    use HasFactory;

    protected $fillable = [
        'appartement_id',
        'immeuble_id',
        'secteur_id',
        'projet_id',
        'user_id',
        'agent_id',
        'title',
        'description',
        'categor_id',
        'priority',
        'fichie_id',
        'reported_at',
        'closed_at',
    ];

    protected $casts = [
        'reported_at' => 'date',
        'closed_at' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function appartement()
    {
        return $this->belongsTo(Appartement::class);
    }

    public function immeuble()
    {
        return $this->belongsTo(Immeuble::class);
    }

    public function secteur()
    {
        return $this->belongsTo(Secteur::class);
    }

    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }

    public function suivi()
    {
        return $this->hasMany(Suivi::class);
    }

    public function categor()
    {
        return $this->belongsTo(Categor::class);
    }

    public function fichie()
    {
        return $this->belongsTo(Fichie::class);
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }
}
