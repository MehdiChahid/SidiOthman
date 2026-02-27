import React from 'react'
import { Head } from '@inertiajs/react'

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
      <Head title="Bienvenue" />
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Bienvenue sur la plateforme de gestion de réserves
        </h1>
        <p className="text-lg text-gray-600">
          Gestion des réserves de chantier pour projets immobiliers
        </p>
      </div>
    </div>
  )
}
