// Utilitaire pour l'impression de listes
export const printList = (title: string, data: any[], columns: {key: string, label: string, format?: (value: any) => string}[]) => {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Impossible d\'ouvrir la fenêtre d\'impression. Veuillez autoriser les pop-ups.');
    return;
  }

  const currentDate = new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date());

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #007bff;
          padding-bottom: 15px;
        }
        .header h1 {
          color: #007bff;
          margin: 0;
          font-size: 28px;
        }
        .header .date {
          color: #666;
          font-size: 14px;
          margin-top: 5px;
        }
        .stats {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
          text-align: center;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px 8px;
          text-align: left;
        }
        th {
          background-color: #007bff;
          color: white;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        tr:hover {
          background-color: #e9ecef;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 15px;
        }
        @media print {
          body { margin: 0; }
          .header { page-break-inside: avoid; }
          tr { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <div class="date">Généré le ${currentDate}</div>
      </div>
      
      <div class="stats">
        <strong>Total d'éléments : ${data.length}</strong>
      </div>

      <table>
        <thead>
          <tr>
            ${columns.map(col => `<th>${col.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(item => `
            <tr>
              ${columns.map(col => {
                const value = getNestedValue(item, col.key);
                const formattedValue = col.format ? col.format(value) : value;
                return `<td>${formattedValue || '-'}</td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        Document généré par le système de gestion de stock
      </div>

      <script>
        // Fonction pour accéder aux propriétés imbriquées
        function getNestedValue(obj, path) {
          return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : '';
          }, obj);
        }
        
        // Impression automatique
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

// Fonction helper pour accéder aux propriétés imbriquées
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : '';
  }, obj);
};