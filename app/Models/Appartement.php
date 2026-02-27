<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appartement extends Model
{
    /** @use HasFactory<\Database\Factories\AppartementFactory> */
    use HasFactory;

    protected $fillable = [
        'immeuble_id',
        'numero',
        'etage',
        'status',
        'user_id',
    ];

    public function immeuble()
    {
        return $this->belongsTo(Immeuble::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
