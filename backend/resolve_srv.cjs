const dns = require('dns').promises;

async function resolve() {
  try {
    // Force using Google DNS to bypass local ISP/Antivirus blocks
    dns.setServers(['8.8.8.8']);
    const srvRecords = await dns.resolveSrv('_mongodb._tcp.angel-ecommerce.uiqiwnt.mongodb.net');
    
    // Sort records by priority and weight
    srvRecords.sort((a, b) => {
      if (a.priority === b.priority) {
        return b.weight - a.weight;
      }
      return a.priority - b.priority;
    });

    const hosts = srvRecords.map(record => `${record.name}:${record.port}`).join(',');
    
    // Check TXT records for authSource and replicaSet
    const txtRecords = await dns.resolveTxt('angel-ecommerce.uiqiwnt.mongodb.net');
    const options = txtRecords.flat().join('&');
    
    console.log(`RESOLVED_HOSTS=${hosts}`);
    console.log(`OPTIONS=${options}`);
  } catch (err) {
    console.error('Error resolving:', err);
  }
}

resolve();
