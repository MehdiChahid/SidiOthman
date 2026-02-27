<?php

namespace App\Http\Controllers;

use App\Models\Fichie;
use App\Http\Requests\StoreFichieRequest;
use App\Http\Requests\UpdateFichieRequest;

use App\Models\Fichierdetail;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;


class FichieController extends Controller
{
    public function update(UpdateFichieRequest $request, Fichie $fichier): RedirectResponse
    {
        if ($fichier->user_id !== Auth::id()) {
            abort(403, 'Accès non autorisé');
        }

        try {
            if ($request->hasFile('files')) {
                $this->handleFileStore($request->validated(), 'files', $fichier->id);
            }
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erreur lors de la mise à jour: ' . $e->getMessage())
                ->withInput();
        }
    }



    private static function handleFileUpload($file, $src, $Sipublic = true): string
    {
        $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

        if ($Sipublic) {
            $destinationPath = public_path($src);
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $file->move($destinationPath, $fileName);
        } else {
            $destinationPath = storage_path('app/' . $src);
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $file->move($destinationPath, $fileName);
        }

        return $fileName;
    }

    /**
     * Gérer le stockage des fichiers (méthode principale)
     */
    static function handleFileStore(array $arrFiles, string $src = "files", int $fichier_id = null, $ocr = false, $Sipublic = true): int
    {
        $user_id = Auth::id();
        if ($fichier_id) {
            $fichier = Fichie::find($fichier_id);
            //self::deleteAllFichierdetails($fichier);
        } else {
            $fichier = Fichie::create(['user_id' => $user_id]);
        }

        $fichier_id = $fichier->id;

        foreach ($arrFiles as $fileX) {

            $file = $fileX['data'];
          
            if ($file && $file instanceof UploadedFile) {
             
                $nomOriginal = $fileX['name'];
                $taille = $file->getSize();
                $typeMime = $file->getMimeType();
                $extension = $file->getClientOriginalExtension();
                // dd($file);  
                $nomStockage = self::handleFileUpload($file, $src, $Sipublic);

                Fichierdetail::create([
                    'nom_fichier' => $nomOriginal,
                    'nom_stockage' => $nomStockage,
                    'chemin_complet' => $src,
                    'taille_octets' => $taille,
                    'type_mime' => $typeMime,
                    'extension' => $extension,
                    'description' => null,
                    'uploadeur_id' => $user_id,
                    'fichier_id' => $fichier_id,
                    'ocr' => $ocr,
                    'storage_public' => $Sipublic,
                ]);
            }
        }

        return $fichier_id;
    }



    public static function deleteAllFichierdetails(Fichie $fichier): void
    {

        foreach ($fichier->detailtable as $detail) {
            $filePath = public_path($detail->chemin_complet . '/' . $detail->nom_stockage);

            if (file_exists($filePath)) {
                unlink($filePath); // Supprimer physiquement le fichier
            }

            $detail->delete(); // Supprimer l'entrée dans la base de données
        }
    }

    /**
     * Supprimer plusieurs fichiers par leurs IDs
     */
    public static function deleteFilesByIds(array $fileIds): void
    {
        $fichierdetails = Fichierdetail::whereIn('id', $fileIds)->get();

        foreach ($fichierdetails as $fichierdetail) {
            $filePath = public_path($fichierdetail->chemin_complet . '/' . $fichierdetail->nom_stockage);

            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        Fichierdetail::whereIn('id', $fileIds)->delete();
    }


    public function download(Fichierdetail $fichierdetail)
    {
        // Vérifier les autorisations
        if ($fichierdetail->uploadeur_id !== Auth::id()) {
            abort(403, 'Accès non autorisé');
        }

        $filePath = public_path($fichierdetail->chemin_complet . '/' . $fichierdetail->nom_stockage);

        if (!file_exists($filePath)) {
            abort(404, 'Fichier non trouvé');
        }

        return response()->download($filePath, $fichierdetail->nom_fichier);
    }

    /**
     * Supprimer un fichier spécifique
     */
    public function deleteFile(Fichierdetail $fichierdetail): RedirectResponse
    {
        if ($fichierdetail->uploadeur_id !== Auth::id()) {
            abort(403, 'Accès non autorisé');
        }

        try {
            $filePath = public_path($fichierdetail->chemin_complet . '/' . $fichierdetail->nom_stockage);

            if (file_exists($filePath)) {
                unlink($filePath);
            }

            $fichierdetail->delete();

            return redirect()->back()->with('success', 'Fichier supprimé avec succès.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erreur lors de la suppression: ' . $e->getMessage());
        }
    }

    /**
     * API endpoint pour supprimer un fichier spécifique (pour AJAX)
     */
    public function deleteFileApi(Fichierdetail $fichierdetail): \Illuminate\Http\JsonResponse
    {
        if ($fichierdetail->uploadeur_id !== Auth::id()) {
            return response()->json(['error' => 'Accès non autorisé'], 403);
        }

        try {
            $filePath = public_path($fichierdetail->chemin_complet . '/' . $fichierdetail->nom_stockage);

            if (file_exists($filePath)) {
                unlink($filePath);
            }

            $fichierdetail->delete();

            return response()->json([
                'success' => true,
                'message' => 'Fichier supprimé avec succès',
                'deleted_file_id' => $fichierdetail->id
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la suppression: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * API endpoint pour obtenir les fichiers (pour AJAX)
     */
    public function getFichiers(): \Illuminate\Http\JsonResponse
    {
        $fichiers = Fichie::with('fichierdetails')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'fichiers' => $fichiers->map(function ($fichier) {
                return [
                    'id' => $fichier->id,
                    'created_at' => $fichier->created_at->format('d/m/Y H:i'),
                    'fichierdetails' => $fichier->fichierdetails->map(function ($detail) {
                        return [
                            'id' => $detail->id,
                            'nom_fichier' => $detail->nom_fichier,
                            'extension' => $detail->extension,
                            'taille_humaine' => $this->formatBytes($detail->taille_octets),
                            'type_mime' => $detail->type_mime,
                            'download_url' => route('fichiers.download', $detail->id),
                        ];
                    })
                ];
            })
        ]);
    }

    /**
     * Formater les octets en taille humaine
     */
    private function formatBytes($bytes, $precision = 2): string
    {
        $units = array('B', 'KB', 'MB', 'GB', 'TB');

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
    }
}
