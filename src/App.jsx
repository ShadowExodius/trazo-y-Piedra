import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Bolsa from './components/Bolsa.jsx'
import Home from './pages/Home.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Contacto from './pages/Contacto.jsx'
import { useHashRoute } from './hooks/useHashRoute.js'
import BolsaProvider from './components/BolsaProvider.jsx'

const PAGINAS = {
  '/': Home,
  '/catalogo': Catalogo,
  '/contacto': Contacto,
}

export default function App() {
  const ruta = useHashRoute()
  const Pagina = PAGINAS[ruta]

  return (
    <BolsaProvider>
      <Header ruta={ruta} />
      <Pagina />
      <Footer />
      <Bolsa />
    </BolsaProvider>
  )
}
