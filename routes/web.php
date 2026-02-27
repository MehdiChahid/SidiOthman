<?php

use App\Http\Controllers\Api\RegistrationDataController;
use App\Http\Controllers\FaizaController;
use App\Http\Controllers\FichieController;
use App\Http\Controllers\FichierdetailController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReserveController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', function () {
    if(auth()->user()->role_id == 3){
        return Inertia::render('Manger/index');
    } elseif(auth()->user()->role_id == 4){
        return Inertia::render('Agent/Dashboard');
    }else{
        return Inertia::render('Dashboard');
    }
})->middleware(['auth', 'verified'])->name('dashboard');

// Routes API pour l'inscription en étapes
Route::prefix('api/registration')->group(function () {
    Route::get('/projets', [RegistrationDataController::class, 'getProjets']);
    Route::get('/secteurs', [RegistrationDataController::class, 'getSecteurs']);
    Route::get('/immeubles', [RegistrationDataController::class, 'getImmeubles']);
    Route::get('/appartements', [RegistrationDataController::class, 'getAppartements']);
    Route::get('/appartements-all', [RegistrationDataController::class, 'getAppartementsAll']);
});

// Routes API pour les appartements
Route::prefix('api')->group(function () {
    Route::get('/appartements/{id}/client', [RegistrationDataController::class, 'getClientByAppartement']);
    Route::post('/users/create-with-appartement', [RegistrationDataController::class, 'createUserWithAppartement'])->name('users.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Routes pour les réserves (clients)
    Route::resource('reserves', ReserveController::class);

    // Routes Manager (role_id == 3)
    Route::middleware(\App\Http\Middleware\EnsureUserIsManager::class)->group(function () {
        Route::prefix('manager')->name('manager.')->group(function () {
            // Réserves
            Route::get('/reserves', [\App\Http\Controllers\Manager\ReserveController::class, 'index'])->name('reserves.index');
            Route::get('/reserves/create', [\App\Http\Controllers\Manager\ReserveController::class, 'create'])->name('reserves.create');
            Route::post('/reserves', [\App\Http\Controllers\Manager\ReserveController::class, 'store'])->name('reserves.store');
            Route::get('/reserves/{reserve}', [\App\Http\Controllers\Manager\ReserveController::class, 'show'])->name('reserves.show');
            Route::post('/reserves/{reserve}/validate', [\App\Http\Controllers\Manager\ReserveController::class, 'validateReserve'])->name('reserves.validate');
            Route::post('/reserves/{reserve}/assign', [\App\Http\Controllers\Manager\ReserveController::class, 'assignAgent'])->name('reserves.assign');
            
            // Agents
            Route::resource('agents', \App\Http\Controllers\Manager\AgentController::class);
        });
    });

    // Routes Agent/Technicien (role_id == 4)
    Route::middleware(\App\Http\Middleware\EnsureUserIsAgent::class)->group(function () {
        Route::prefix('agent')->name('agent.')->group(function () {
            // Réserves assignées à l'agent
            Route::get('/reserves', [\App\Http\Controllers\Agent\ReserveController::class, 'index'])->name('reserves.index');
            Route::get('/reserves/{reserve}', [\App\Http\Controllers\Agent\ReserveController::class, 'show'])->name('reserves.show');
            Route::post('/reserves/{reserve}/update-status', [\App\Http\Controllers\Agent\ReserveController::class, 'updateStatus'])->name('reserves.update-status');
        });
    });

    Route::delete('/fichier/delete/{fichierdetail}', [FichierdetailController::class, 'destroy'])->name('fichier.destroy');
    Route::put('/fichier/rename/{fichierdetail}', [FichierdetailController::class, 'update'])->name('fichier.update');
    Route::delete('/fichier/api/delete/{fichierdetail}', [FichieController::class, 'deleteFileApi'])->name('fichier.api.delete');


});


require __DIR__.'/auth.php';
