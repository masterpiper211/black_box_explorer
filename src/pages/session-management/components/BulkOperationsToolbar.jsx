import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const BulkOperationsToolbar = ({ 
  selectedCount, 
  onBulkAction, 
  onClearSelection,
  onExport,
  onBulkTag
}) => {
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [exportFormat, setExportFormat] = useState('csv');

  const exportOptions = [
    { value: 'csv', label: 'CSV' },
    { value: 'json', label: 'JSON' },
    { value: 'xlsx', label: 'Excel' },
    { value: 'pdf', label: 'PDF Report' }
  ];

  const handleBulkTag = () => {
    if (newTag.trim()) {
      onBulkTag(newTag.trim());
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleExport = () => {
    onExport(exportFormat);
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Selection Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-accent" />
            <span className="font-medium text-foreground">
              {selectedCount} session{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            className="text-muted-foreground hover:text-foreground"
          >
            Clear selection
          </Button>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Archive */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction('archive')}
            iconName="Archive"
            iconPosition="left"
          >
            Archive
          </Button>

          {/* Delete */}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onBulkAction('delete')}
            iconName="Trash2"
            iconPosition="left"
          >
            Delete
          </Button>

          {/* Tag */}
          <div className="flex items-center space-x-2">
            {showTagInput ? (
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter tag name"
                  className="w-32 h-8"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleBulkTag();
                    if (e.key === 'Escape') setShowTagInput(false);
                  }}
                  autoFocus
                />
                <Button size="xs" onClick={handleBulkTag} iconName="Check" />
                <Button 
                  size="xs" 
                  variant="ghost" 
                  onClick={() => setShowTagInput(false)} 
                  iconName="X" 
                />
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTagInput(true)}
                iconName="Tag"
                iconPosition="left"
              >
                Add Tag
              </Button>
            )}
          </div>

          {/* Export */}
          <div className="flex items-center space-x-2">
            <Select
              options={exportOptions}
              value={exportFormat}
              onChange={setExportFormat}
              className="w-24"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
          </div>

          {/* Move to Folder */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction('move')}
            iconName="FolderOpen"
            iconPosition="left"
          >
            Move
          </Button>

          {/* Duplicate */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction('duplicate')}
            iconName="Copy"
            iconPosition="left"
          >
            Duplicate
          </Button>
        </div>
      </div>

      {/* Bulk Action Confirmation */}
      <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-md">
        <div className="flex items-start space-x-2">
          <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
          <div className="text-sm">
            <p className="text-foreground font-medium">Bulk operations affect multiple sessions</p>
            <p className="text-muted-foreground mt-1">
              Some actions like delete and archive cannot be undone. Please review your selection carefully.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsToolbar;