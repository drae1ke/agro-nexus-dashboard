/**
 * Icons for the Agrovet Dashboard
 * Simple CSS-based icons to avoid external dependencies
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine,
  faBox,
  faUsers,
  faMoneyBillWave,
  faChartBar,
  faCog,
  faSearch,
  faPlus,
  faTimes,
  faUser,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

export default class Icons {
  static Dashboard = () => <FontAwesomeIcon icon={faChartLine} />;
  static Inventory = () => <FontAwesomeIcon icon={faBox} />;
  static Customers = () => <FontAwesomeIcon icon={faUsers} />;
  static Sales = () => <FontAwesomeIcon icon={faMoneyBillWave} />;
  static Reports = () => <FontAwesomeIcon icon={faChartBar} />;
  static Settings = () => <FontAwesomeIcon icon={faCog} />;
  static Search = () => <FontAwesomeIcon icon={faSearch} />;
  static Plus = () => <FontAwesomeIcon icon={faPlus} />;
  static X = () => <FontAwesomeIcon icon={faTimes} />;
  static User = () => <FontAwesomeIcon icon={faUser} />;
  static Alert = () => <FontAwesomeIcon icon={faExclamationTriangle} />;
}
