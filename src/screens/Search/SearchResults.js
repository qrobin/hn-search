import { Button, Card, Divider, Input, Pagination, Result, Space, Spin } from 'antd';
import { useEffect, useState } from 'react';
import {
  LoadingOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useDebouncedEffect } from 'utils/useDebouncedEffect';
import { useGlobalState } from 'globalState';
import { api } from 'api';
import { navigate } from '@reach/router';
import { SearchResultItem } from './SearchResultItem';

const getNewsSearch = async (query, page = 0, tags = 'story') => {
  const res = await api.get('/search', {
    params: { query, tags, page },
  });

  return res;
};

function SearchResults() {
  const [state, dispatch] = useGlobalState();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const getNewsIntoState = (query, page, tags) => {
    if (query) {
      getNewsSearch(query, page, tags).then((res) => {
        dispatch({
          type: 'SET_SEARCH_RESULTS',
          payload: res,
        });
        setSearchLoading(false);
      });
    } else {
      dispatch({ type: 'CLEAR_SEARCH_RESULTS' });
      setSearchLoading(false);
    }
  };

  useDebouncedEffect(() => {
    getNewsIntoState(searchQuery);
  }, [searchQuery], 1000);

  useEffect(() => {
    getNewsIntoState(searchQuery, currentPage);
  }, [currentPage]);

  const onSearchInputChange = (e) => {
    if (e.target.value) {
      setSearchLoading(true);
    }
    setSearchQuery(e.target.value);
  };

  const onPaginationChange = (page, _pageSize) => {
    setSearchLoading(true);
    setCurrentPage(page - 1);
  };

  return (
    <Space direction="vertical" size={[20, 20]} style={{ width: '100%' }}>
      <Input
        onChange={onSearchInputChange}
        className="input-xl"
        size="large"
        placeholder="Start typing to search articles..."
        // allowClear
        suffix={<LoadingOutlined style={{ display: searchLoading ? 'block' : 'none' }} />}
      />
      <Spin spinning={searchLoading} path="search">
        <Card style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 240px)' }}>
          {state.searchResults.hits?.length ? state.searchResults.hits.map((hit, index, array) => (
            <>
              <SearchResultItem hit={hit} />
              {(index < array.length - 1) && <Divider />}
            </>
          )) : (
            <Result
              icon={<SearchOutlined />}
              title={searchQuery
                ? 'No results found for your query, try another one'
                : 'Drop a word into the field above to start searching, or'}
              extra={searchQuery ? null : <Button onClick={() => navigate('/notebooks')} type="primary">Go to your Notebooks</Button>}
            />
          )}
        </Card>
      </Spin>
      {state.searchResults.nbPages
        ? (
          <Pagination
            hideOnSinglePage
            defaultCurrent={0}
            showSizeChanger={false}
            total={(state.searchResults.nbPages) * 10}
            onChange={onPaginationChange}
            style={{
              textAlign: 'center',
              width: '100%',
            }}
          />
        ) : null}
    </Space>
  );
}

export { SearchResults };
