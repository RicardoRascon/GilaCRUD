import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/navegacion/Navbar';
import Inicio from './components/paginas/Inicio';
import Categoria from './components/paginas/Categoria';
import Producto from './components/paginas/Producto';
import Atributo from './components/paginas/Atributo';

function App() {
  return(
    <div className='App'>
      <Router>
        <Navbar/>
        <Switch>
          <Route path='/' exact component={Inicio}/>
          <Route path='/Categoria' exact component={Categoria}/>
          <Route path='/Producto' exact component={Producto}/>
          <Route path='/Atributo' exact component={Atributo}/>
          
        </Switch>
      </Router>
    </div>
  );
}

export default App;
