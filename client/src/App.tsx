import { Outlet } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollButton from './components/ScrollButton';
import './styles/app.scss';

//===THE QUERY CLIENT===//
const queryClient = new QueryClient();

//===THE APP===///
const App = () => {
  return (
    <>
        <Header />
        <main id="main-content">
        <QueryClientProvider client= { queryClient } >
          <Outlet />
        </QueryClientProvider>
        </main>
        <Footer />
        <ScrollButton />
    </>
  )
};

//Export
export default App;