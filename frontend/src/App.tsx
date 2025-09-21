import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './pages/landing';
import Product from './pages/Product';


function App() {
  return (
<BrowserRouter>
<Routes>
  <Route path="/" element={<Landing/>}/>
  <Route path='/product' element={<Product/>}/>
</Routes>
</BrowserRouter>
  );
}

export default App;