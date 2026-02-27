import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, File, Image, FileText, Archive, Music, Video, Grid, List, Check, Edit, Save } from 'lucide-react';

const FileUploadComponent = ({
  // Configuration du composant
  multiple = true,
  maxFiles = null,
  maxFileSize = null, // en bytes
  acceptedTypes = null, // array of mime types ou extensions

  // Callbacks
  onFilesChange = () => { },
  onFileAdd = () => { },
  onFileRemove = () => { },
  onError = () => { },

  // Mode modal
  isModal = false,
  onClose = () => { },
  onConfirm = () => { },
  autoConfirm = false, // Nouvelle prop pour confirmation automatique

  // Configuration UI
  title = "Gestionnaire de Fichiers",
  subtitle = "Glissez-déposez vos fichiers ou cliquez pour les sélectionner",
  showStats = true,
  defaultViewMode = 'grid',

  // Valeurs initiales
  initialFiles = [],
  children
}) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState(defaultViewMode);
  const [errors, setErrors] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [editingName, setEditingName] = useState('');
  const fileInputRef = useRef(null);



  // Initialisation des fichiers une seule fois
  useEffect(() => {
    if (!isInitialized) {
      setFiles(initialFiles);
      setIsInitialized(true);
    }
  }, [initialFiles, isInitialized]);

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image className="w-6 h-6 text-blue-500" />;
    if (fileType.startsWith('video/')) return <Video className="w-6 h-6 text-purple-500" />;
    if (fileType.startsWith('audio/')) return <Music className="w-6 h-6 text-green-500" />;
    if (fileType.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="w-6 h-6 text-orange-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const createFilePreview = (file) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const validateFile = (file) => {
    const errors = [];

    // Vérifier la taille
    if (maxFileSize && file.size > maxFileSize) {
      errors.push(`Le fichier "${file.name}" dépasse la taille maximale autorisée (${formatFileSize(maxFileSize)})`);
    }

    // Vérifier le type
    if (acceptedTypes && acceptedTypes.length > 0) {
      const isAccepted = acceptedTypes.some(type => {
        // Vérifier les extensions (.jpg, .png, etc.)
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }

        // Vérifier les types MIME avec wildcard (image/*, video/*, etc.)
        if (type.includes('*')) {
          const baseType = type.split('/')[0];
          return file.type.startsWith(baseType + '/');
        }

        // Vérifier les types MIME exacts (image/jpeg, application/pdf, etc.)
        return file.type === type || file.type.includes(type);
      });

      if (!isAccepted) {
        errors.push(`Le type de fichier "${file.name}" n'est pas autorisé. Types acceptés: ${acceptedTypes.join(', ')}`);
      }
    }

    return errors;
  };

  const handleFiles = useCallback((newFiles) => {
    const fileArray = Array.from(newFiles);
    let validFiles = [];
    let allErrors = [];


    // Si mode single file, prendre seulement le premier
    const filesToProcess = multiple ? fileArray : fileArray.slice(0, 1);

    // Vérifier le nombre maximum de fichiers
    if (maxFiles && files.length + filesToProcess.length > maxFiles) {
      allErrors.push(`Impossible d'ajouter ${filesToProcess.length} fichier(s). Maximum autorisé: ${maxFiles}`);
      const remainingSlots = maxFiles - files.length;
      filesToProcess.splice(remainingSlots);
    }

    filesToProcess.forEach(file => {
      const fileErrors = validateFile(file);



      if (fileErrors.length === 0) {
        const fileObj = {
          id: Date.now() + Math.random(),
          data: file, // Array [file, name] pour le backend
          name: file.name, // Nom d'affichage (modifiable)
          originalName: file.name, // Nom original du fichier
          size: file.size,
          type: file.type,
          preview: createFilePreview(file),
          uploadedAt: new Date().toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };

        validFiles.push(fileObj);
      } else {
        allErrors.push(...fileErrors);
      }
    });

    if (allErrors.length > 0) {
      setErrors(allErrors);
      onError(allErrors);
      setTimeout(() => setErrors([]), 5000);
    }

    if (validFiles.length > 0) {
      const newFilesList = multiple ? [...files, ...validFiles] : validFiles;

      setFiles(newFilesList);

      // Appeler les callbacks après la mise à jour de l'état
      setTimeout(() => {
        onFilesChange(newFilesList);
        validFiles.forEach(fileObj => onFileAdd(fileObj));

        // Confirmation automatique si activée
        if (autoConfirm && isModal) {
          onConfirm(newFilesList);
        }
      }, 0);
    }
  }, [files, multiple, maxFiles, maxFileSize, acceptedTypes]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  }, [handleFiles]);

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = e.target.files;
    handleFiles(selectedFiles);
  }, [handleFiles]);

  const removeFile = useCallback((id) => {
    const fileToRemove = files.find(f => f.id === id);
    const newFilesList = files.filter(file => file.id !== id);
    setFiles(newFilesList);
    onFilesChange(newFilesList);
    onFileRemove(fileToRemove);
  }, [files, onFilesChange, onFileRemove]);

  const clearAllFiles = useCallback(() => {
    setFiles([]);
    onFilesChange([]);
  }, [onFilesChange]);

  const handleConfirm = useCallback(() => {
    onConfirm(files);
  }, [files, onConfirm]);

  // Fonctions de renommage
  const getFileNameWithoutExtension = (fileName) => {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
  };

  const getFileExtension = (fileName) => {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex > 0 ? fileName.substring(lastDotIndex) : '';
  };

  const startEditing = (fileItem) => {
    setEditingFile(fileItem.id);
    setEditingName(getFileNameWithoutExtension(fileItem.name));
  };

  const cancelEditing = () => {
    setEditingFile(null);
    setEditingName('');
  };

  const saveFileName = (fileId) => {
    if (editingName.trim()) {

      const newName = editingName.trim();

      const updatedFiles = files.map(file =>
        file.id == fileId
          ? {
            ...file,
            name: newName,
          }
          : file
      );
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    }
    setEditingFile(null);
    setEditingName('');
  };

  const resetToOriginalName = (fileId) => {
    const updatedFiles = files.map(file =>
      file.id === fileId
        ? {
          ...file,
          name: file.originalName,
          data: [file.data[0], file.originalName] // Remettre le nom original dans l'array
        }
        : file
    );
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const FileGridItem = ({ fileItem }) => (
    <div className="group relative bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-200">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
          {fileItem.preview ? (
            <img
              src={`/${fileItem.preview}`}
              alt={fileItem.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center">
              {getFileIcon(fileItem.type)}
            </div>
          )}
        </div>

        <div className="text-center w-full">
          {editingFile === fileItem.id ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && saveFileName(fileItem.id)}
                onBlur={() => saveFileName(fileItem.id)}
                autoFocus
              />
              <div className="flex justify-center space-x-1">
                <button
                  onClick={() => saveFileName(fileItem.id)}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                >
                  <Save className="w-3 h-3" />
                </button>
                <button
                  onClick={cancelEditing}
                  className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center space-x-1">
                <h3
                  className="font-medium text-gray-800 text-sm truncate flex-1 cursor-pointer hover:text-blue-600 transition-colors"
                  title={fileItem.name}
                  onDoubleClick={() => startEditing(fileItem)}
                >
                  {fileItem.name}
                </h3>
                <button
                  onClick={() => startEditing(fileItem)}
                  className="p-1 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <Edit className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatFileSize(fileItem.size)}
              </p>
              {fileItem.name !== fileItem.originalName && (
                <button
                  onClick={() => resetToOriginalName(fileItem.id)}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                  title="Revenir au nom original"
                >
                  Nom original
                </button>
              )}
              {fileItem.name !== fileItem.originalName && (
                <p className="text-xs text-green-600 mt-1" title={`Renommé de: ${fileItem.originalName}`}>
                  Renommé
                </p>
              )}
              {!isModal && (
                <p className="text-xs text-gray-400">
                  {fileItem.uploadedAt}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <button
        onClick={() => removeFile(fileItem.id)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );

  const FileListItem = ({ fileItem }) => (
    <div className="group bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md hover:border-blue-300 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
            {fileItem.preview ? (
              <img
                src={`/${fileItem.preview}`}
                alt={fileItem.name}
                className="w-full h-full object-cover"
              />
            ) : (
              getFileIcon(fileItem.type)
            )}
          </div>

          <div className="flex-1 min-w-0">
            {editingFile === fileItem.id ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1 text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && saveFileName(fileItem.id)}
                  onBlur={() => saveFileName(fileItem.id)}
                  autoFocus
                />
                <button
                  onClick={() => saveFileName(fileItem.id)}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={cancelEditing}
                  className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <h3
                    className="font-medium text-gray-800 truncate flex-1 cursor-pointer hover:text-blue-600 transition-colors"
                    onDoubleClick={() => startEditing(fileItem)}
                    title={fileItem.name}
                  >
                    {fileItem.name}
                  </h3>
                  <button
                    onClick={() => startEditing(fileItem)}
                    className="p-1 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                  <span>{formatFileSize(fileItem.size)}</span>
                  {fileItem.name !== fileItem.originalName && (
                    <>
                      <span>•</span>
                      <span className="text-green-600" title={`Renommé de: ${fileItem.originalName}`}>
                        Renommé
                      </span>
                    </>
                  )}
                  {fileItem.name !== fileItem.originalName && (
                    <>
                      <span>•</span>
                      <button
                        onClick={() => resetToOriginalName(fileItem.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Revenir au nom original"
                      >
                        Nom original
                      </button>
                    </>
                  )}
                  {!isModal && (
                    <>
                      <span>•</span>
                      <span>{fileItem.uploadedAt}</span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => removeFile(fileItem.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const containerClasses = isModal
    ? "w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
    : "max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen";

  const mainClasses = isModal
    ? "bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
    : "bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden";

  return (
    <div className={containerClasses}>
      <div className={mainClasses}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`font-bold text-white ${isModal ? 'text-xl' : 'text-3xl'}`}>
                {title}
              </h1>
              <p className="text-blue-100 mt-1 text-sm">
                {subtitle}
                {!multiple && " (fichier unique)"}
                {maxFiles && ` (max: ${maxFiles} fichiers)`}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {files.length > 0 && !isModal && (
                <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'grid' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'
                      }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'list' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'
                      }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              )}

              {isModal ? (
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                files.length > 0 && (
                  <button
                    onClick={clearAllFiles}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Tout supprimer
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Erreurs */}
        {errors.length > 0 && (
          <div className="mx-6 mt-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800 font-medium mb-2">Erreurs détectées :</div>
              <ul className="text-red-700 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {children && <div className='p-2 pb-0'>{children}</div>}
        {/* Zone principale */}
        <div className={isModal ? "p-2" : "p-8"}>
          <div
            className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${isDragging
              ? 'border-blue-500 bg-blue-50 scale-[1.02]'
              : files.length > 0
                ? 'border-gray-300 bg-gray-50'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
              } ${files.length > 0 ? 'p-4' : isModal ? 'p-8' : 'p-12'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple={multiple}
              accept={acceptedTypes ? acceptedTypes.join(',') : undefined}
              className="hidden"
            />

            {files.length === 0 ? (
              <div className="text-center space-y-4">
                <div onClick={() => fileInputRef.current?.click()} className={`mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${isDragging ? 'bg-blue-500 text-white scale-110' : 'bg-gray-200 text-gray-500'
                  } ${isModal ? 'w-16 h-16' : 'w-20 h-20'}`}>
                  <Upload className={isModal ? "w-8 h-8" : "w-10 h-10"} />
                </div>

                <div>
                  <h3 onClick={() => fileInputRef.current?.click()} className={`font-bold text-gray-700 mb-2 ${isModal ? 'text-lg' : 'text-2xl'}`}>
                    {isDragging ? 'Déposez vos fichiers maintenant' : 'Ajoutez vos fichiers'}
                  </h3>
                  <p className={`text-gray-500 mb-4 ${isModal ? 'text-sm' : 'text-lg'}`}>
                    {!multiple ? 'Sélectionnez un fichier' : 'Glissez et déposez vos fichiers ici ou cliquez pour parcourir'}
                  </p>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${isModal ? 'px-6 py-3' : 'px-8 py-4'
                      }`}
                  >
                    Parcourir les fichiers
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {showStats && (
                  <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{files.length}</div>
                        <div className="text-xs text-gray-500">Fichier{files.length > 1 ? 's' : ''}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">
                          {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
                        </div>
                        <div className="text-xs text-gray-500">Taille totale</div>
                      </div>
                    </div>

                    {multiple && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                      >
                        + Ajouter
                      </button>
                    )}
                  </div>
                )}

                {viewMode === 'grid' ? (
                  <div className={`grid gap-3 ${isModal
                    ? 'grid-cols-3 sm:grid-cols-4'
                    : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
                    }`}>
                    {files.map((fileItem) => (
                      <FileGridItem key={fileItem.id} fileItem={fileItem} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {files.map((fileItem) => (
                      <FileListItem key={fileItem.id} fileItem={fileItem} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer pour modal */}
        {isModal && !autoConfirm && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {files.length} fichier{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirm}
                disabled={files.length === 0}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Confirmer</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadComponent;