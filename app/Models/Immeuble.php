<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Immeuble extends Model
{
    /** @use HasFactory<\Database\Factories\ImmeubleFactory> */
    use HasFactory;

    protected $fillable = [
        'secteur_id',
        'name',
    ];

    public function secteur()
    {
        return $this->belongsTo(Secteur::class);
    }

    public function appartements()
    {
        return $this->hasMany(Appartement::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
