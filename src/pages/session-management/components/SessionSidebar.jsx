import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SessionSidebar = ({ 
  folders, 
  favorites, 
  smartCollections, 
  selectedFolder, 
  onFolderSelect,
  onCreateFolder,
  onDeleteFolder,
  onToggleFavorite
}) => {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    folders: true,
    favorites: true,
    smart: true
  });

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const handleCancelCreate = () => {
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getFolderIcon = (folder) => {
    if (folder.type === 'system') return 'FolderOpen';
    if (folder.sessionCount === 0) return 'Folder';
    return 'FolderOpen';
  };

  const getSmartCollectionIcon = (collection) => {
    switch (collection.type) {
      case 'recent': return 'Clock';
      case 'running': return 'Play';
      case 'failed': return 'AlertTriangle';
      case 'archived': return 'Archive';
      default: return 'Filter';
    }
  };

  return (
    <div className="w-full h-full bg-card border-r border-border overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Organization</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your sessions</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Folders Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('folders')}
              className="h-auto p-0 font-medium text-foreground hover:text-foreground"
            >
              <Icon 
                name={expandedSections.folders ? 'ChevronDown' : 'ChevronRight'} 
                size={16} 
                className="mr-1" 
              />
              Folders
            </Button>
            <Button
              size="xs"
              variant="ghost"
              onClick={() => setIsCreatingFolder(true)}
              iconName="Plus"
              className="h-6 w-6"
            />
          </div>

          {expandedSections.folders && (
            <div className="space-y-1">
              {folders.map((folder) => (
                <div key={folder.id} className="group flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFolderSelect(folder.id)}
                    className={`flex-1 justify-start h-auto p-2 ${
                      selectedFolder === folder.id ? 'bg-accent/20 text-accent-foreground' : ''
                    }`}
                  >
                    <Icon name={getFolderIcon(folder)} size={16} className="mr-2" />
                    <span className="flex-1 text-left">{folder.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {folder.sessionCount}
                    </span>
                  </Button>
                  {folder.type !== 'system' && (
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => onDeleteFolder(folder.id)}
                      iconName="Trash2"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                </div>
              ))}

              {isCreatingFolder && (
                <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded-md">
                  <Icon name="Folder" size={16} className="text-muted-foreground" />
                  <Input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder name"
                    className="flex-1 h-8 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateFolder();
                      if (e.key === 'Escape') handleCancelCreate();
                    }}
                    autoFocus
                  />
                  <Button size="xs" onClick={handleCreateFolder} iconName="Check" />
                  <Button size="xs" variant="ghost" onClick={handleCancelCreate} iconName="X" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Favorites Section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('favorites')}
              className="h-auto p-0 font-medium text-foreground hover:text-foreground"
            >
              <Icon 
                name={expandedSections.favorites ? 'ChevronDown' : 'ChevronRight'} 
                size={16} 
                className="mr-1" 
              />
              Favorites
            </Button>
            <span className="text-xs text-muted-foreground">{favorites.length}</span>
          </div>

          {expandedSections.favorites && (
            <div className="space-y-1">
              {favorites.length === 0 ? (
                <div className="p-4 text-center">
                  <Icon name="Star" size={24} className="mx-auto mb-2 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">No favorites yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Star sessions to add them here
                  </p>
                </div>
              ) : (
                favorites.map((session) => (
                  <div key={session.id} className="group flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 justify-start h-auto p-2"
                    >
                      <Icon name="Star" size={14} className="mr-2 text-warning" />
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-foreground truncate">
                          {session.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {session.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => onToggleFavorite(session.id)}
                      iconName="X"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Smart Collections Section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('smart')}
              className="h-auto p-0 font-medium text-foreground hover:text-foreground"
            >
              <Icon 
                name={expandedSections.smart ? 'ChevronDown' : 'ChevronRight'} 
                size={16} 
                className="mr-1" 
              />
              Smart Collections
            </Button>
          </div>

          {expandedSections.smart && (
            <div className="space-y-1">
              {smartCollections.map((collection) => (
                <Button
                  key={collection.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onFolderSelect(collection.id)}
                  className={`w-full justify-start h-auto p-2 ${
                    selectedFolder === collection.id ? 'bg-accent/20 text-accent-foreground' : ''
                  }`}
                >
                  <Icon 
                    name={getSmartCollectionIcon(collection)} 
                    size={16} 
                    className="mr-2" 
                  />
                  <span className="flex-1 text-left">{collection.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {collection.count}
                  </span>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Storage Info */}
        <div className="p-4 border-t border-border">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Storage</span>
              <span className="text-xs text-muted-foreground">2.4 GB / 10 GB</span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '24%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Sessions older than 90 days are automatically archived
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionSidebar;