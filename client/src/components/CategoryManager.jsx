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
import { categoriesAPI } from '../../../src/api/categories';

function CategoryManager({ open, onClose, onCategoryChange }) {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (open) {
      cargarCategorias();
    }
  }, [open]);

  const cargarCategorias = async () => {
    try {
      const data = await categoriesAPI.getAll();
      console.log('Categorías cargadas:', data);
      setCategorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setCategorias([]);
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
    setEditandoId(null);
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
      let data;
      if (editandoId) {
        // Actualizar categoría existente
        data = await categoriesAPI.update(editandoId, { name: nombre.trim() });
        // Actualizar categoría en la lista
        setCategorias(categorias.map(cat =>
          cat.id === editandoId
            ? { ...cat, name: nombre.trim() }
            : cat
        ));
        mostrarNotificacion('Categoría actualizada correctamente');
      } else {
        // Crear nueva categoría
        data = await categoriesAPI.create({ name: nombre.trim() });
        setCategorias([...categorias, data]);
        mostrarNotificacion('Categoría creada correctamente');
      }
      onCategoryChange && onCategoryChange();
      limpiarFormulario();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al guardar la categoría';
      mostrarNotificacion(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const editarCategoria = (categoria) => {
    setNombre(categoria.name || categoria.nombre);
    setEditandoId(categoria.id);
  };

  const cancelarEdicion = () => {
    limpiarFormulario();
  };

  const eliminarCategoria = async (idx) => {
    const categoria = categorias[idx];
    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoria.name || categoria.nombre}"?`)) {
      setLoading(true);
      try {
        await categoriesAPI.delete(categoria.id);
        setCategorias(categorias.filter((_, i) => i !== idx));
        mostrarNotificacion('Categoría eliminada correctamente');
        onCategoryChange && onCategoryChange();
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Error al eliminar la categoría';
        mostrarNotificacion(errorMessage, 'error');
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
                {editandoId ? 'Editar Categoría' : 'Nueva Categoría'}
              </Typography>
              <form onSubmit={guardarCategoria}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
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
                        {editandoId ? 'Actualizar' : 'Crear'}
                      </Button>
                      {editandoId && (
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={cancelarEdicion}
                          disabled={loading}
                          sx={{ borderRadius: 2 }}
                        >
                          Cancelar
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>

          {/* Lista de categorías */}
          <Typography variant="h6" gutterBottom>
            Categorías Existentes ({Array.isArray(categorias) ? categorias.length : 0})
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
                {!Array.isArray(categorias) || categorias.length === 0 ? (
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
                  Array.isArray(categorias) && categorias.map((categoria, idx) => (
                    <TableRow key={categoria.id || idx} hover>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                          {categoria.name || categoria.nombre || 'Sin nombre'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Editar categoría">
                            <IconButton
                              color="primary"
                              onClick={() => editarCategoria(categoria)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar categoría">
                            <IconButton
                              color="error"
                              onClick={() => eliminarCategoria(idx)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
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
