<?php

namespace App\Http\Controllers;

use App\Models\Fichierdetail;
use App\Http\Requests\StoreFichierdetailRequest;
use App\Http\Requests\UpdateFichierdetailRequest;

class FichierdetailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFichierdetailRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Fichierdetail $fichierdetail)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Fichierdetail $fichierdetail)
    {
        //
    }

    public function update(UpdateFichierdetailRequest $request, Fichierdetail $fichierdetail)
    {
        // Assuming you want to update the filename or some other attribute
        $fichierdetail->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Fichierdetail $fichierdetail)
    {
        
        $fichierdetail->delete();
    }
}
