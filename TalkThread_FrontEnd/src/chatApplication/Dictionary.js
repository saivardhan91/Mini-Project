import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress, Stack } from '@mui/material';
import axios from 'axios';

export default function DictionaryModal({ open, onClose }) {
    const [word, setWord] = useState('');
    const [definition, setDefinition] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch word definition
    const fetchDefinition = async () => {
        if (!word) {
            setError("Please enter a word.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            setDefinition(response.data[0].meanings);
            console.log(response);
        } catch (err) {
            setError("Definition not found. Please try another word.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="dictionary-modal-title" aria-describedby="dictionary-modal-description">
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 4
            }}>
                <Typography id="dictionary-modal-title" variant="h6" component="h2">
                    Dictionary Lookup
                </Typography>
                <TextField
                    label="Enter Word"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchDefinition()}
                />
                <Button variant="contained" color="primary" onClick={fetchDefinition} fullWidth>
                    {loading ? <CircularProgress size={24} /> : 'Send'}
                </Button>

                {error && <Typography color="error" mt={2}>{error}</Typography>}
                
                {definition && (
                    <Box mt={3}>
                        <Typography variant="subtitle1">Definitions:</Typography>
                        {definition.map((meaning, index) => (
                            <Stack key={index} mt={1}>
                                <Typography variant="body2">
                                    <strong>Part of Speech:</strong> {meaning.partOfSpeech}
                                </Typography>
                                {meaning.definitions.map((def, i) => (
                                    <Typography variant="body2" key={i}>
                                        {i + 1}. {def.definition}
                                    </Typography>
                                ))}
                            </Stack>
                        ))}
                    </Box>
                )}
            </Box>
        </Modal>
    );
}
