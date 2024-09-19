import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

interface MaintenanceChecklistPopupProps {
  maintenanceChecklistOpen: boolean;
  setMaintenanceChecklistOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MaintenanceChecklistPopup({
  maintenanceChecklistOpen,
  setMaintenanceChecklistOpen,
}: MaintenanceChecklistPopupProps) {
  const [site, setSite] = useState('');

  const handleClose = () => {
    setMaintenanceChecklistOpen(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSite(event.target.value as string);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // TODO: Add logic to display the maintenance checklist for the selected site
    event.preventDefault();
    console.log(site);
    handleClose();
  };

  return (
    <Dialog
      open={maintenanceChecklistOpen}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>Maintenance Visit Checklist</Box>
          <Box>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ paddingBottom: '8px' }}>
          Select the site you'd like to see a checklist for:
        </DialogContentText>
        <FormControl fullWidth>
          <InputLabel id="select-site">Site</InputLabel>
          <Select
            id="select-site"
            value={site}
            label="Site"
            onChange={handleChange}
          >
            <MenuItem value={'Rain Garden 1'}>Rain Garden 1</MenuItem>
            <MenuItem value={'Green Roof 2'}>Green Roof 2</MenuItem>
            <MenuItem value={'Tree Trench 3'}>Tree Trench 3</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button type="submit">Next</Button>
      </DialogActions>
    </Dialog>
  );
}
