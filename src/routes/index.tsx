
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, CidadeLista , CidadeEditor , EventoLista, EventoEditor} from '../pages';
import { KudoEditor } from '../pages/kudo/KudoEditor';
import { useDrawerContext } from '../shared/contexts';

export const AppRoutes = () =>  {

  const { setDrawerOptions } = useDrawerContext();
  
  useEffect(() => {
    setDrawerOptions([
      {
        icon: 'home',
        path: '/pagina-inicial',
        label: 'Página Inicial'
      },
      {
        icon: 'assistant',
        path: '/eventos',
        label: 'Eventos'
      },
      {
        icon: 'location_city',
        path: '/cidades',
        label: 'Cidades'
      }
    ]);
  },[]); 

  return (<Routes>
    <Route path="/pagina-inicial" element={<Dashboard />}/>
    <Route path="/cidades" element={<CidadeLista />}/>
    <Route path="/cidades/detalhe/:id" element={<CidadeEditor />}/>
    <Route path="/eventos" element={<EventoLista/>}/>
    <Route path="/eventos/detalhe/:id" element={<EventoEditor />}/>
    <Route path="/kudo/:token" element={<KudoEditor />}/>
    <Route path="*" element={<Navigate to={'/pagina-inicial'} />} />
  </Routes>
  );
};