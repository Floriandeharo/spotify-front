export default [
  {
    context: ['/api', '/oauth2', '/login'],
    target: 'http://localhost:8080',
    secure: true, // Requis pour certains serveurs    logLevel: 'debug', // Ajoutez pour plus de détails en cas d'erreurs
  },
];
