// Test script for Vercel APIs
const testAPI = async (url, method = 'GET', body = null) => {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log(`\n${method} ${url}`);
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
    
    return { success: response.ok, data };
  } catch (error) {
    console.error(`Error testing ${url}:`, error.message);
    return { success: false, error: error.message };
  }
};

// Test all APIs
const runTests = async () => {
  console.log('🧪 Testing APIs...\n');
  
  // Test health (if exists)
  await testAPI('http://localhost:3000/api/health');
  
  // Test especialidades
  await testAPI('http://localhost:3000/api/especialidades');
  
  // Test medicos
  await testAPI('http://localhost:3000/api/medicos');
  await testAPI('http://localhost:3000/api/medicos?espe_id=9');
  
  // Test auth
  await testAPI('http://localhost:3000/api/auth', 'POST', {
    ci: '1700000001',
    birthDate: '1990-05-20'
  });
  
  // Test agenda
  await testAPI('http://localhost:3000/api/agenda?medi_id=1');
  
  // Test pacientes
  await testAPI('http://localhost:3000/api/pacientes');
  
  console.log('\n✅ Tests completed!');
};

runTests();
