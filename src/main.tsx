import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { useSelectedBoardBlockStore } from './stores/selectedBoardBlockStore.ts';

const Main = () => {
  const {selectedBoardBlock, setSelectedBoardBlock} = useSelectedBoardBlockStore();

  useEffect(() => {
    const handleRightClick = (event: MouseEvent) => {
      event.preventDefault();
      if(selectedBoardBlock){
        setSelectedBoardBlock(null!);
      }
    };
    document.body.addEventListener('contextmenu', handleRightClick);

  }, [selectedBoardBlock]);

  return <App />;
};

createRoot(document.getElementById('root')!).render(

    <Main />

);
