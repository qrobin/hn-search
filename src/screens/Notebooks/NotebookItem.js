import { navigate } from '@reach/router';
import { Button, Card, Divider, Result } from 'antd';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'utils/useLocalStorage';
import { SearchResultItem } from '../Search/SearchResultItem';

function NotebookItem(props) {
  const [notebooks] = useLocalStorage('notebooks');
  const [currentNotebook, setCurrentNotebook] = useState({});

  useEffect(() => {
    if (notebooks?.length) {
      const notebook = notebooks.find((n) => n.id === +props.id);
      setCurrentNotebook(notebook);
    }
  }, [notebooks]);

  return (
    <>
      <h1>Notebook <b>{currentNotebook?.title}</b></h1>

      <Card style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 240px)' }}>
        {currentNotebook.searchResults?.length ? currentNotebook.searchResults.map((hit, index, array) => (
          <>
            <SearchResultItem hit={hit} />
            {(index < array.length - 1) && <Divider />}
          </>
        )) : (
          <Result
            title="No results recorded into this notebook yet"
            extra={<Button onClick={() => navigate('/notebooks')} type="primary">Go back to your Notebooks</Button>}
          />
        )}
      </Card>
    </>
  );
}

export { NotebookItem };
