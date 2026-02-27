<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Suivi extends Model
{
    /** @use HasFactory<\Database\Factories\SuiviFactory> */
    use HasFactory;

    protected $fillable = [
        'date',
        'statut_id',
        'description',
        'fichie_id',
        'reserve_id',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function statut()
    {
        return $this->belongsTo(Statut::class);
    }

    public function fichie()
    {
        return $this->belongsTo(Fichie::class);
    }

    public function reserves()
    {
        return $this->hasMany(Reserve::class);
    }
}
