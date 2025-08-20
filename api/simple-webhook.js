// api/simple-webhook.js
// Webhook HTTP ultra-simple pour SIM7000G avec restrictions SFR

export default function handler(req, res) {
  // Activer CORS pour tous les domaines
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Gérer OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    console.log('=== WEBHOOK APPELÉ ===');
    console.log('Méthode:', req.method);
    console.log('Headers:', req.headers);
    console.log('Query:', req.query);
    console.log('Body:', req.body);
    
    // Extraire les données (GET ou POST)
    let data = {};
    
    if (req.method === 'GET') {
      data = req.query;
    } else if (req.method === 'POST') {
      data = req.body || {};
      // Si body est string, essayer de parser JSON
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.log('Body non-JSON:', data);
        }
      }
    }
    
    // Ajouter timestamp côté serveur
    const serverData = {
      ...data,
      received_at: new Date().toISOString(),
      server_timestamp: Date.now(),
      method: req.method,
      user_agent: req.headers['user-agent'] || 'unknown',
      ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown'
    };
    
    console.log('Données traitées:', serverData);
    
    // Ici vous pouvez ajouter la logique pour envoyer vers Firebase
    // Pour l'instant, on log juste les données
    
    // Réponse ultra-simple pour SIM7000G
    const response = {
      status: 'ok',
      message: 'Données reçues',
      timestamp: Date.now(),
      data_received: serverData
    };
    
    // Répondre avec du JSON simple
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Erreur webhook:', error);
    
    // Réponse d'erreur simple
    res.status(500).json({
      status: 'error',
      message: 'Erreur serveur',
      error: error.message
    });
  }
}

// Configuration pour les déploiements Edge (optionnel)
export const config = {
  runtime: 'edge', // Plus rapide pour les webhooks simples
}
