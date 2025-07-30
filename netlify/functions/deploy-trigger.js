exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      message: 'Deploy trigger function working',
      timestamp: new Date().toISOString(),
      functions: ['tasks', 'notes', 'notes-simple', 'notes-minimal', 'deploy-trigger']
    })
  };
}; 