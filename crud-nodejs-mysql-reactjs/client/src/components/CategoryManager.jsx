import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Alert,
  Snackbar,
  Tooltip,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { getApiUrl } from '../config';

function CategoryManager({ open, onClose, onCategoryChange }) {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (open) {
      cargarCategorias();
    }
  }, [open]);

  const cargarCategorias = async () => {
    try {
      const response = await fetch(getApiUrl('CATEGORIAS'));
      const data = await response.json();
      console.log('Categorías cargadas:', data);
      setCategorias(data);
    } catch (error) {
      mostrarNotificacion('Error al cargar categorías', 'error');
    }
  };

  const mostrarNotificacion = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const cerrarNotificacion = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const limpiarFormulario = () => {
    setNombre('');
  };

  const abrirFormulario = () => {
    limpiarFormulario();
  };

  const guardarCategoria = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      mostrarNotificacion('El nombre de la categoría es requerido', 'error');
      return;
    }

    setLoading(true);
    try {
      // Crear nueva categoría
      const response = await fetch(getApiUrl('CATEGORIAS'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim() })
      });

      const data = await response.json();
      if (response.ok) {
        setCategorias([...categorias, data]);
        mostrarNotificacion('Categoría creada correctamente');
        onCategoryChange && onCategoryChange();
      } else {
        mostrarNotificacion(data.error || 'Error al crear la categoría', 'error');
      }

      limpiarFormulario();
    } catch (error) {
      mostrarNotificacion('Error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  };

  const eliminarCategoria = async (idx) => {
    const categoria = categorias[idx];
    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoria.nombre}"?`)) {
      setLoading(true);
      try {
        const response = await fetch(`${getApiUrl('CATEGORIAS')}/${categoria.id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setCategorias(categorias.filter((_, i) => i !== idx));
          mostrarNotificacion('Categoría eliminada correctamente');
          onCategoryChange && onCategoryChange();
        } else {
          mostrarNotificacion('Error al eliminar la categoría', 'error');
        }
      } catch (error) {
        mostrarNotificacion('Error de conexión al eliminar', 'error');
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <CategoryIcon />
        Gestión de Categorías
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Formulario */}
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CategoryIcon color="primary" />
                Nueva Categoría
              </Typography>
              <form onSubmit={guardarCategoria}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nombre de la categoría"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={loading}
                        sx={{
                          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                          borderRadius: 2,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                          }
                        }}
                      >
                        Crear
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>

          {/* Lista de categorías */}
          <Typography variant="h6" gutterBottom>
            Categorías Existentes ({categorias.length})
          </Typography>
          
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Nombre</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categorias.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <CategoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No hay categorías registradas
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Crea tu primera categoría usando el formulario de arriba
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  categorias.map((categoria, idx) => {
                    const isString = typeof categoria === 'string';
                    const nombreCategoria = isString
                      ? categoria
                      : (categoria.nombre || categoria.name || categoria.categoria || '');

                    return (
                      <TableRow key={idx} hover>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                            {nombreCategoria || 'Sin nombre'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title={isString ? 'Eliminación no disponible (sin id)' : 'Eliminar categoría'}>
                              <span>
                                <IconButton
                                  color="error"
                                  onClick={() => !isString && eliminarCategoria(idx)}
                                  size="small"
                                  disabled={isString}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Cerrar
        </Button>
      </DialogActions>

      {/* Notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={cerrarNotificacion}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={cerrarNotificacion}
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export default CategoryManager;
