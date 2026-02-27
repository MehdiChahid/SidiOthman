<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fichierdetail extends Model
{
    /** @use HasFactory<\Database\Factories\FichierdetailFactory> */
    use HasFactory;

    protected $fillable = [
        'fichie_id',
        'nom_fichier',
        'nom_stockage',
        'chemin_complet',
        'taille_octets',
        'type_mime',
        'extension',
        'uploadeur_id',
        'statut_id',
        'description',
        'storage_public',
    ];

    protected $casts = [
        'storage_public' => 'boolean',
    ];

    public function fichie()
    {
        return $this->belongsTo(Fichie::class);
    }

    public function uploadeur()
    {
        return $this->belongsTo(User::class, 'uploadeur_id');
    }

    public function statut()
    {
        return $this->belongsTo(Statut::class);
    }
}
