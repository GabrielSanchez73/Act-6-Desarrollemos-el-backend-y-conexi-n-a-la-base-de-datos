import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

function ProductTable({ products }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Nombre</TableCell>
          <TableCell>Descripción</TableCell>
          <TableCell>Precio</TableCell>
          <TableCell>Categoría</TableCell>
          <TableCell>Stock</TableCell>
          <TableCell>Proveedor</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.nombre}</TableCell>
            <TableCell>{p.descripcion}</TableCell>
            <TableCell>${Number(p.precio).toFixed(2)}</TableCell>
            <TableCell>{p.categoria}</TableCell>
            <TableCell>{p.stock}</TableCell>
            <TableCell>{p.proveedor}</TableCell>
            <TableCell>
              {/* Botones de editar/eliminar aquí */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ProductTable;