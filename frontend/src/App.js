import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DeviceManager from './pages/DeviceManager';
import AdminPanel from './pages/AdminPanel';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import TicketPurchase from './components/TicketPurchase';
import PaymentSuccess from './pages/PaymentSuccess';
import QRCodeGenerator from './components/QRCodeGenerator';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/unauthorized" component={Unauthorized} />
            <ProtectedRoute path="/device-manager" component={DeviceManager} roles={['device_manager', 'admin']} />
            <ProtectedRoute path="/admin" component={AdminPanel} roles={['admin']} />
            <Route path="/purchase-ticket" component={TicketPurchase} /> {/* Changed to Route */}
            <Route path="/payment-success" component={PaymentSuccess} />
            <Route path="/payment-cancel" component={() => <div>Payment cancelled. <Link to="/purchase-ticket">Try again</Link></div>} />
            <ProtectedRoute path="/admin/generate-qr" component={QRCodeGenerator} roles={['admin']} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
