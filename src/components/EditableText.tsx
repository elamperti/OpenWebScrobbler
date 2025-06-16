import { useEffect, useRef, useState } from 'react';

import { Button, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faUndoAlt } from '@fortawesome/free-solid-svg-icons';

import type React from 'react';

import './EditableText.css';

interface EditableTextProps {
  value: string;
  onEdit: (newValue: string) => void;
  className?: string;
  disabled?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({ value, onEdit, className = '', disabled = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const { current: originalValue } = useRef(value);
  const [isModified, setIsModified] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleResetClick = () => {
    setInputValue(originalValue);
    setIsModified(false);
    onEdit(originalValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsModified(e.target.value !== originalValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveChanges();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const saveChanges = () => {
    setIsEditing(false);
    if (inputValue !== value) {
      onEdit(inputValue);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setInputValue(value);
    setIsModified(false);
  };

  return (
    <div className={`editable-text d-inline-flex align-items-center ${className}`}>
      {isEditing ? (
        <Input
          innerRef={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={saveChanges}
          bsSize="sm"
          className="editable-text-input"
        />
      ) : (
        <div>
          <span className="editable-text-value">{inputValue}</span>
          {!disabled && (
            <div className="d-inline-flex ms-1 align-items-center gap-1 editable-text-actions">
              <Button
                onClick={handleEditClick}
                className="editable-text-button edit-button"
                title="Edit"
                color="link"
                size="sm"
              >
                <FontAwesomeIcon icon={faPencilAlt} />
              </Button>
              {isModified && (
                <Button
                  onClick={handleResetClick}
                  className="editable-text-button reset-button"
                  title="Reset to original value"
                  color="link"
                  size="sm"
                >
                  <FontAwesomeIcon icon={faUndoAlt} />
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableText;
