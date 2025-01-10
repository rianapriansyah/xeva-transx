import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField  } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface NoteProps {
	note:string;
  isModalOpen: boolean;
  onCloseModal: () => void;
  onSaveNote: (note: string) => void; // Callback for saving the note
}

const NoteModal: React.FC<NoteProps> = ({
    note,
	  isModalOpen,
    onCloseModal,
    onSaveNote
}) => {

  const [localNote, setLocalNote] = useState(note); // Local state for the note

  useEffect(() => {
    setLocalNote(note); // Update setLocalNote when the modal opens
  }, [note]);

  const handleSave = () => {
    setLocalNote(localNote); // 
    onSaveNote(localNote); // Call the callback with the updated note
  };

return (
    <Dialog open={isModalOpen} onClose={onCloseModal} fullWidth={true}>
        <DialogTitle>Catatan</DialogTitle>
        <DialogContent>
        <TextField
                multiline
                maxRows={4}
                fullWidth 
                autoFocus
                margin="dense"
                id="note"
                name="note"
                label="Tambahkan Catatan"
                type="text"
                variant="standard"
                value={localNote}
                onChange={(e) => setLocalNote(e.target.value)}
              />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseModal}>Cancel</Button>
          <Button onClick={handleSave}>Tambah</Button>
        </DialogActions>
    </Dialog>
	);
};

export default NoteModal;
