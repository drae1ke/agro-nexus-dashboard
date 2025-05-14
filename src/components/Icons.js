
/**
 * Icons for the Agrovet Dashboard
 * Simple CSS-based icons to avoid external dependencies
 */

export default class Icons {
  static init() {
    const style = document.createElement('style');
    style.textContent = `
      /* Dashboard icons */
      .icon-dashboard::before {
        content: "📊";
      }
      
      .icon-inventory::before {
        content: "📦";
      }
      
      .icon-customers::before {
        content: "👥";
      }
      
      .icon-sales::before {
        content: "💰";
      }
      
      .icon-reports::before {
        content: "📈";
      }
      
      .icon-settings::before {
        content: "⚙️";
      }
      
      .icon-search::before {
        content: "🔍";
      }
      
      .icon-plus::before {
        content: "+";
      }
      
      .icon-x::before {
        content: "✕";
      }
      
      .icon-user::before {
        content: "👤";
      }
      
      .icon-alert::before {
        content: "⚠️";
      }
    `;
    
    document.head.appendChild(style);
  }
}
