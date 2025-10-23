#!/usr/bin/env node

/**
 * Script de Prueba Específico para Filtros de Precio
 * Verifica que los filtros de precio mínimo y máximo funcionen correctamente
 */

const http = require('http');

// Configuración
const BASE_URL = 'http://localhost:5000';

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Función para hacer peticiones HTTP
function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: url,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

// Función para mostrar resultados de pruebas
function showTestResult(testName, passed, details = '') {
  const status = passed ? `${colors.green}✅ PASÓ${colors.reset}` : `${colors.red}❌ FALLÓ${colors.reset}`;
  console.log(`${colors.bright}${testName}:${colors.reset} ${status}`);
  if (details) {
    console.log(`  ${colors.cyan}${details}${colors.reset}`);
  }
  return passed;
}

// Función para probar filtros de precio
async function testFiltrosPrecio() {
  console.log(`${colors.bright}${colors.blue}💰 PRUEBAS DE FILTROS DE PRECIO${colors.reset}\n`);
  
  let passedTests = 0;
  let totalTests = 0;

  try {
    // Prueba 1: Obtener todos los productos (sin filtros)
    console.log(`${colors.yellow}📦 Prueba 1: Obtener todos los productos${colors.reset}`);
    totalTests++;
    
    try {
      const response = await makeRequest('/productos');
      const passed = response.status === 200 && Array.isArray(response.data);
      showTestResult('Productos sin filtros', passed, `Status: ${response.status}, Productos: ${response.data.length}`);
      if (passed) passedTests++;
      
      // Guardar productos para pruebas posteriores
      const productos = response.data;
      console.log(`  Productos disponibles: ${productos.map(p => `${p.nombre} ($${p.precio})`).join(', ')}`);
    } catch (error) {
      showTestResult('Productos sin filtros', false, `Error: ${error.message}`);
    }

    // Prueba 2: Filtro por precio mínimo
    console.log(`\n${colors.yellow}💰 Prueba 2: Filtro por precio mínimo (≥ $30)${colors.reset}`);
    totalTests++;
    
    try {
      const response = await makeRequest('/productos?precio_min=30');
      const passed = response.status === 200 && Array.isArray(response.data);
      
      if (passed) {
        const productosFiltrados = response.data;
        const todosCumplen = productosFiltrados.every(p => parseFloat(p.precio) >= 30);
        showTestResult('Filtro precio mínimo', todosCumplen, `Status: ${response.status}, Productos: ${productosFiltrados.length}, Precios: ${productosFiltrados.map(p => `$${p.precio}`).join(', ')}`);
        if (todosCumplen) passedTests++;
      } else {
        showTestResult('Filtro precio mínimo', false, `Status: ${response.status}`);
      }
    } catch (error) {
      showTestResult('Filtro precio mínimo', false, `Error: ${error.message}`);
    }

    // Prueba 3: Filtro por precio máximo
    console.log(`\n${colors.yellow}💰 Prueba 3: Filtro por precio máximo (≤ $100)${colors.reset}`);
    totalTests++;
    
    try {
      const response = await makeRequest('/productos?precio_max=100');
      const passed = response.status === 200 && Array.isArray(response.data);
      
      if (passed) {
        const productosFiltrados = response.data;
        const todosCumplen = productosFiltrados.every(p => parseFloat(p.precio) <= 100);
        showTestResult('Filtro precio máximo', todosCumplen, `Status: ${response.status}, Productos: ${productosFiltrados.length}, Precios: ${productosFiltrados.map(p => `$${p.precio}`).join(', ')}`);
        if (todosCumplen) passedTests++;
      } else {
        showTestResult('Filtro precio máximo', false, `Status: ${response.status}`);
      }
    } catch (error) {
      showTestResult('Filtro precio máximo', false, `Error: ${error.message}`);
    }

    // Prueba 4: Filtro por rango de precios
    console.log(`\n${colors.yellow}💰 Prueba 4: Filtro por rango de precios ($25-$150)${colors.reset}`);
    totalTests++;
    
    try {
      const response = await makeRequest('/productos?precio_min=25&precio_max=150');
      const passed = response.status === 200 && Array.isArray(response.data);
      
      if (passed) {
        const productosFiltrados = response.data;
        const todosCumplen = productosFiltrados.every(p => {
          const precio = parseFloat(p.precio);
          return precio >= 25 && precio <= 150;
        });
        showTestResult('Filtro rango precios', todosCumplen, `Status: ${response.status}, Productos: ${productosFiltrados.length}, Precios: ${productosFiltrados.map(p => `$${p.precio}`).join(', ')}`);
        if (todosCumplen) passedTests++;
      } else {
        showTestResult('Filtro rango precios', false, `Status: ${response.status}`);
      }
    } catch (error) {
      showTestResult('Filtro rango precios', false, `Error: ${error.message}`);
    }

    // Prueba 5: Filtro combinado (nombre + precio)
    console.log(`\n${colors.yellow}💰 Prueba 5: Filtro combinado (nombre + precio)${colors.reset}`);
    totalTests++;
    
    try {
      const response = await makeRequest('/productos?nombre=logitech&precio_max=50');
      const passed = response.status === 200 && Array.isArray(response.data);
      
      if (passed) {
        const productosFiltrados = response.data;
        const todosCumplen = productosFiltrados.every(p => {
          const nombre = p.nombre.toLowerCase();
          const precio = parseFloat(p.precio);
          return nombre.includes('logitech') && precio <= 50;
        });
        showTestResult('Filtro combinado', todosCumplen, `Status: ${response.status}, Productos: ${productosFiltrados.length}, Filtros: nombre=logitech, precio≤$50`);
        if (todosCumplen) passedTests++;
      } else {
        showTestResult('Filtro combinado', false, `Status: ${response.status}`);
      }
    } catch (error) {
      showTestResult('Filtro combinado', false, `Error: ${error.message}`);
    }

    // Prueba 6: Verificar parámetros de URL
    console.log(`\n${colors.yellow}🔍 Prueba 6: Verificar construcción de URLs${colors.reset}`);
    totalTests++;
    
    try {
      const testCases = [
        { params: { precio_min: '25', precio_max: '100' }, expected: '/productos?precio_min=25&precio_max=100' },
        { params: { nombre: 'logitech', precio_min: '20' }, expected: '/productos?nombre=logitech&precio_min=20' },
        { params: { categoria: 'Accesorios', precio_max: '50' }, expected: '/productos?categoria=Accesorios&precio_max=50' }
      ];

      let allPassed = true;
      for (const testCase of testCases) {
        const params = new URLSearchParams();
        Object.entries(testCase.params).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        
        const url = `/productos${params.toString() ? '?' + params.toString() : ''}`;
        if (url !== testCase.expected) {
          console.log(`    ❌ URL incorrecta: ${url} (esperado: ${testCase.expected})`);
          allPassed = false;
        }
      }
      
      showTestResult('Construcción de URLs', allPassed, 'Verificación de parámetros de filtro');
      if (allPassed) passedTests++;
    } catch (error) {
      showTestResult('Construcción de URLs', false, `Error: ${error.message}`);
    }

  } catch (error) {
    console.error(`${colors.red}Error general en las pruebas: ${error.message}${colors.reset}`);
  }

  // Resumen final
  console.log(`\n${colors.bright}${colors.blue}📋 RESUMEN DE PRUEBAS DE FILTROS DE PRECIO${colors.reset}`);
  console.log(`${colors.bright}Total de pruebas:${colors.reset} ${totalTests}`);
  console.log(`${colors.bright}Pruebas exitosas:${colors.reset} ${colors.green}${passedTests}${colors.reset}`);
  console.log(`${colors.bright}Pruebas fallidas:${colors.reset} ${colors.red}${totalTests - passedTests}${colors.reset}`);
  
  const successRate = (passedTests / totalTests) * 100;
  console.log(`${colors.bright}Tasa de éxito:${colors.reset} ${successRate >= 80 ? colors.green : successRate >= 60 ? colors.yellow : colors.red}${successRate.toFixed(1)}%${colors.reset}`);

  if (passedTests === totalTests) {
    console.log(`\n${colors.green}🎉 ¡TODAS LAS PRUEBAS DE FILTROS DE PRECIO PASARON!${colors.reset}`);
    console.log(`   Los filtros de precio están funcionando correctamente.`);
  } else if (passedTests >= totalTests * 0.8) {
    console.log(`\n${colors.yellow}⚠️ La mayoría de las pruebas pasaron. Revisar las fallidas.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}❌ Muchas pruebas fallaron. Hay problemas con los filtros de precio.${colors.reset}`);
  }

  console.log(`\n${colors.cyan}💡 Para probar manualmente en el navegador:${colors.reset}`);
  console.log(`   http://localhost:5000/productos?precio_min=25&precio_max=100`);
  console.log(`   http://localhost:5000/productos?nombre=logitech&precio_max=50`);
}

// Ejecutar pruebas si el script se ejecuta directamente
if (require.main === module) {
  testFiltrosPrecio().catch(console.error);
}

module.exports = { testFiltrosPrecio };

