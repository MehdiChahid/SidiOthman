import React, { useState, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
  Upload, 
  X, 
  FileText, 
  ImageIcon, 
  Video, 
  Music, 
  Archive, 
  File, 
  ArrowLeft,
  Plus,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const Create = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const { data, setData, post, processing, errors, progress } = useForm({
    files: [],
    description: ''
  });

  // Fonction pour obtenir l'icône selon le type de fichier
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="w-8 h-8 text-blue-500" />;
    }
    if (type.startsWith('video/')) {
      return <Video className="w-8 h-8 text-purple-500" />;
    }
    if (type.startsWith('audio/')) {
      return <Music className="w-8 h-8 text-green-500" />;
    }
    if (type === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    if (type.includes('zip') || type.includes('rar') || type.includes('archive')) {
      return <Archive className="w-8 h-8 text-yellow-500" />;
    }
    if (type.includes('document') || type.includes('text')) {
      return <FileText className="w-8 h-8 text-blue-600" />;
    }
    return <File className="w-8 h-8 text-gray-500" />;
  };

  // Formater la taille des fichiers
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Valider les fichiers
  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
      'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/zip', 'application/x-rar-compressed',
      'video/mp4', 'video/avi', 'video/quicktime'
    ];

    if (file.size > maxSize) {
      return `${file.name} dépasse la taille maximale de 10MB`;
    }

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx|txt|zip|rar|mp4|avi|mov)$/i)) {
      return `${file.name} n'est pas un type de fichier autorisé`;
    }

    return null;
  };

  // Gérer les fichiers sélectionnés
  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    const fileErrors = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        fileErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (fileErrors.length > 0) {
      alert('Erreurs détectées:\n' + fileErrors.join('\n'));
    }

    if (validFiles.length > 0) {
      const newFiles = [...selectedFiles, ...validFiles];
      setSelectedFiles(newFiles);
      setData('files', newFiles);
    }
  };

  // Gestionnaires d'événements drag & drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Gestionnaire de sélection de fichiers
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  // Supprimer un fichier de la sélection
  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setData('files', newFiles);
  };

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      alert('Veuillez sélectionner au moins un fichier');
      return;
    }

    post(route('fichiers.store'), {
      forceFormData: true,
      onSuccess: () => {
        setSelectedFiles([]);
        setData({ files: [], description: '' });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Télécharger des fichiers" />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href={route('fichiers.index')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Télécharger des fichiers
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Zone de drop */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.zip,.rar,.mp4,.avi,.mov"
            />
            
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className={`w-8 h-8 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Glissez-déposez vos fichiers ici
                </h3>
                <p className="text-gray-600 mb-4">
                  ou cliquez pour sélectionner des fichiers
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Choisir des fichiers
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Types autorisés: JPG, PNG, PDF, DOC, TXT, ZIP, MP4, etc.</p>
                <p>Taille maximale: 10 MB par fichier</p>
              </div>
            </div>
          </div>

          {/* Erreurs */}
          {errors.files && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700">{errors.files}</p>
              </div>
            </div>
          )}

          {/* Liste des fichiers sélectionnés */}
          {selectedFiles.length > 0 && (
            <div className="bg-white rounded-lg shadow border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  Fichiers sélectionnés ({selectedFiles.length})
                </h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatBytes(file.size)} • {file.type}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-lg shadow border p-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnelle)
            </label>
            <textarea
              id="description"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ajoutez une description pour ces fichiers..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6">
            <Link
              href={route('fichiers.index')}
              className="text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </Link>
            
            <button
              type="submit"
              disabled={processing || selectedFiles.length === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Téléchargement...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Télécharger {selectedFiles.length > 0 && `(${selectedFiles.length})`}
                </>
              )}
            </button>
          </div>

          {/* Barre de progression */}
          {progress && (
            <div className="bg-white rounded-lg shadow border p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Téléchargement en cours...
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(progress.percentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Create;