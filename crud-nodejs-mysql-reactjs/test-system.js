#!/usr/bin/env node

/**
 * Script de Prueba del Sistema de Gestión de Productos
 * Verifica que todos los componentes estén funcionando correctamente
 */

const http = require('http');

// Configuración
const CONFIG = {
  API_BASE_URL: 'http://localhost:5000',
  ENDPOINTS: {
    HEALTH: '/',
    PRODUCTOS: '/productos',
    CATEGORIAS: '/categorias',
    ESTADISTICAS: '/estadisticas'
  }
};

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Función para hacer peticiones HTTP
function makeRequest(url, method = 'GET', data = null) {
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

    if (data) {
      req.write(JSON.stringify(data));
    }

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

// Función principal de pruebas
async function runTests() {
  console.log(`${colors.bright}${colors.blue}🚀 INICIANDO PRUEBAS DEL SISTEMA DE GESTIÓN DE PRODUCTOS${colors.reset}\n`);
  
  let passedTests = 0;
  let totalTests = 0;

  try {
    // Prueba 1: Verificar que el servidor esté funcionando
    console.log(`${colors.yellow}📡 Prueba 1: Verificar conectividad del servidor${colors.reset}`);
    totalTests++;
    
    try {
      const healthResponse = await makeRequest(CONFIG.ENDPOINTS.HEALTH);
      const passed = healthResponse.status === 200;
      showTestResult('Servidor funcionando', passed, `Status: ${healthResponse.status}`);
      if (passed) passedTests++;
    } catch (error) {
      showTestResult('Servidor funcionando', false, `Error: ${error.message}`);
    }

    // Prueba 2: Verificar endpoint de productos
    console.log(`\n${colors.yellow}📦 Prueba 2: Verificar endpoint de productos${colors.reset}`);
    totalTests++;
    
    try {
      const productosResponse = await makeRequest(CONFIG.ENDPOINTS.PRODUCTOS);
      const passed = productosResponse.status === 200 && Array.isArray(productosResponse.data);
      showTestResult('Endpoint productos', passed, `Status: ${productosResponse.status}, Productos: ${productosResponse.data.length}`);
      if (passed) passedTests++;
    } catch (error) {
      showTestResult('Endpoint productos', false, `Error: ${error.message}`);
    }

    // Prueba 3: Verificar endpoint de categorías
    console.log(`\n${colors.yellow}🏷️ Prueba 3: Verificar endpoint de categorías${colors.reset}`);
    totalTests++;
    
    try {
      const categoriasResponse = await makeRequest(CONFIG.ENDPOINTS.CATEGORIAS);
      const passed = categoriasResponse.status === 200 && Array.isArray(categoriasResponse.data);
      showTestResult('Endpoint categorías', passed, `Status: ${categoriasResponse.status}, Categorías: ${categoriasResponse.data.length}`);
      if (passed) passedTests++;
    } catch (error) {
      showTestResult('Endpoint categorías', false, `Error: ${error.message}`);
    }

    // Prueba 4: Verificar endpoint de estadísticas
    console.log(`\n${colors.yellow}📊 Prueba 4: Verificar endpoint de estadísticas${colors.reset}`);
    totalTests++;
    
    try {
      const estadisticasResponse = await makeRequest(CONFIG.ENDPOINTS.ESTADISTICAS);
      const passed = estadisticasResponse.status === 200 && typeof estadisticasResponse.data === 'object';
      showTestResult('Endpoint estadísticas', passed, `Status: ${estadisticasResponse.status}`);
      if (passed) passedTests++;
    } catch (error) {
      showTestResult('Endpoint estadísticas', false, `Error: ${error.message}`);
    }

    // Prueba 5: Verificar estructura de datos de productos
    console.log(`\n${colors.yellow}🔍 Prueba 5: Verificar estructura de datos${colors.reset}`);
    totalTests++;
    
    try {
      const productosResponse = await makeRequest(CONFIG.ENDPOINTS.PRODUCTOS);
      if (productosResponse.status === 200 && productosResponse.data.length > 0) {
        const producto = productosResponse.data[0];
        const requiredFields = ['id', 'nombre', 'precio', 'categoria', 'stock'];
        const hasAllFields = requiredFields.every(field => producto.hasOwnProperty(field));
        
        showTestResult('Estructura de productos', hasAllFields, `Campos requeridos: ${requiredFields.join(', ')}`);
        if (hasAllFields) passedTests++;
      } else {
        showTestResult('Estructura de productos', false, 'No hay productos para verificar');
      }
    } catch (error) {
      showTestResult('Estructura de productos', false, `Error: ${error.message}`);
    }

  } catch (error) {
    console.error(`${colors.red}Error general en las pruebas: ${error.message}${colors.reset}`);
  }

  // Resumen final
  console.log(`\n${colors.bright}${colors.blue}📋 RESUMEN DE PRUEBAS${colors.reset}`);
  console.log(`${colors.bright}Total de pruebas:${colors.reset} ${totalTests}`);
  console.log(`${colors.bright}Pruebas exitosas:${colors.reset} ${colors.green}${passedTests}${colors.reset}`);
  console.log(`${colors.bright}Pruebas fallidas:${colors.reset} ${colors.red}${totalTests - passedTests}${colors.reset}`);
  
  const successRate = (passedTests / totalTests) * 100;
  console.log(`${colors.bright}Tasa de éxito:${colors.reset} ${successRate >= 80 ? colors.green : successRate >= 60 ? colors.yellow : colors.red}${successRate.toFixed(1)}%${colors.reset}`);

  if (passedTests === totalTests) {
    console.log(`\n${colors.green}🎉 ¡TODAS LAS PRUEBAS PASARON! El sistema está funcionando correctamente.${colors.reset}`);
  } else if (passedTests >= totalTests * 0.8) {
    console.log(`\n${colors.yellow}⚠️ La mayoría de las pruebas pasaron. Revisar las fallidas.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}❌ Muchas pruebas fallaron. Revisar la configuración del sistema.${colors.reset}`);
  }

  console.log(`\n${colors.cyan}💡 Para ejecutar el sistema completo:${colors.reset}`);
  console.log(`  1. Servidor: cd server && npm start`);
  console.log(`  2. Cliente: cd client && npm start`);
}

// Ejecutar pruebas si el script se ejecuta directamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, makeRequest };
