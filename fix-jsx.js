const fs = require('fs');
const path = require('path');

const componentsDir = './src/components';
const files = ['AdminDashboard.js', 'CustomerDashboard.js', 'DeliveryDashboard.js'];

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix common JSX attribute issues
    content = content.replace(/\s+val=/g, ' value=');
    content = content.replace(/\s+onChan=/g, ' onChange=');
    content = content.replace(/\s+sty=/g, ' style=');
    content = content.replace(/\s+onSubm=/g, ' onSubmit=');
    content = content.replace(/n\s+val=/g, ' value=');
    content = content.replace(/"\s+sty=/g, ' style=');
    content = content.replace(/m\s+onSubm=/g, ' onSubmit=');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${file}`);
  }
});

console.log('JSX attribute fixes completed');