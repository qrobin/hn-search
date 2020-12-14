import { Button, Col, Input, message, Popover, Row, Space } from 'antd';
import { PlusCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import { useLocalStorage } from 'utils/useLocalStorage';
import { useState } from 'react';

function PopoverContentAdd({ hit, setNotebooks: setNotebooksParent, popoverVisibleChange }) {
  const [notebookQuickCreation, setNotebookQuickCreation] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [notebooks, setNotebooks] = useLocalStorage('notebooks');

  const addResultToNotebook = (notebook, searchResult) => {
    const notebooksCopy = [...notebooks];
    const notebookCopy = { ...notebook };
    const { searchResults } = notebookCopy;

    const selectedNotebookIndex = notebooksCopy.findIndex((d) => d.id === notebookCopy.id);

    searchResults.push(searchResult);
    notebooksCopy.splice(selectedNotebookIndex, 1, notebookCopy);
    setNotebooks(notebooksCopy);
    setNotebooksParent(notebooksCopy);

    message.success(<span><b>{searchResult.title}</b> has been added to <b>{notebook.title} Notebook</b> successfully</span>);
    popoverVisibleChange(false);
  };

  const initNotebookQuickCreation = () => setNotebookQuickCreation(true);

  const validateUniqueNotebookName = (title) => !notebooks.some((n) => n.title === title);

  const submitNotebookQuickCreation = () => {
    if (!newNotebookName) return;
    if (notebooks?.length && !validateUniqueNotebookName(newNotebookName)) {
      message.error(<span>Notebook named <b>{newNotebookName}</b> already exists, choose another name</span>);
      return;
    }

    if (!notebooks?.length) {
      setNotebooks([{ id: 0, title: newNotebookName, searchResults: [], createdAt: new Date() }]);
    } else {
      const lastNotebookId = notebooks[notebooks.length - 1].id;
      setNotebooks([...notebooks, { id: lastNotebookId + 1, title: newNotebookName, searchResults: [], createdAt: new Date() }]);
    }

    message.success(<span>New Notebook named <b>{newNotebookName}</b> has been successfully created</span>);

    setNotebookQuickCreation(false);
    setNewNotebookName('');
  };

  const cancelNotebookQuickCreation = () => {
    setNotebookQuickCreation(false);
    setNewNotebookName('');
  };

  return (
    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
      <Space direction="vertical">

        {notebooks?.length ? notebooks.map((notebook) => (
          <Button
            key={notebook.id}
            type="link"
            onClick={() => addResultToNotebook(notebook, hit)}
          >
            Add to&nbsp;<b>{notebook.title}</b>
          </Button>
        )) : 'Notebooks list is currently empty'}

        {notebookQuickCreation
          ? (
            <>
              <Input value={newNotebookName} onChange={(e) => setNewNotebookName(e.target.value)} placeholder="Name your new Notebook" />
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button size="small" onClick={cancelNotebookQuickCreation}>Cancel</Button>
                <Button size="small" type="primary" onClick={submitNotebookQuickCreation}>Submit</Button>
              </Space>
            </>
          )
          : <Button size="small" type="primary" onClick={initNotebookQuickCreation}>Create new Notebook</Button>}
      </Space>
    </div>
  );
}

function PopoverContentRemove({ hit, popoverVisibleChange, setNotebooks: setNotebooksParent }) {
  const [notebooks, setNotebooks] = useLocalStorage('notebooks');

  const findSearchEntity = (hitTitle) => {
    if (!notebooks?.length) return false;

    let notebookId = null;
    let entityIndex = null;
    notebooks.forEach((notebook) => {
      for (let i = 0; i < notebook.searchResults.length; i++) {
        if (notebook.searchResults[i].title === hitTitle) {
          notebookId = notebook.id;
          entityIndex = i;
          break;
        }
      }
    });

    return { notebookId, entityIndex };
  };

  const deleteConfirm = () => {
    const { notebookId, entityIndex } = findSearchEntity(hit.title);

    const notebooksCopy = [...notebooks];
    const notebookCopy = { ...notebooks.find((n) => n.id === notebookId) };
    const { searchResults } = notebookCopy;

    const selectedNotebookIndex = notebooksCopy.findIndex((d) => d.id === notebookCopy.id);

    searchResults.splice(entityIndex, 1);
    notebooksCopy.splice(selectedNotebookIndex, 1, notebookCopy);
    setNotebooks(notebooksCopy);
    setNotebooksParent(notebooksCopy);

    message.success(<span><b>{hit.title}</b> has been removed from <b>{notebookCopy.title} Notebook</b> successfully</span>);
    popoverVisibleChange(false);
  };

  return (
    <>
      <p>Delete this result from your Notebook?</p>
      <Button size="small" type="primary" block onClick={deleteConfirm}>Delete</Button>
    </>
  );
}

function SearchResultItem({ hit }) {
  const [notebooks, setNotebooks] = useLocalStorage('notebooks');

  const [popoverVisible, setPopoverVisible] = useState(false);

  const checkIfResultAdded = (hitTitle) => {
    if (!notebooks?.length) return false;

    let resultAlreadyAdded = false;
    notebooks.forEach((notebook) => {
      for (let i = 0; i < notebook.searchResults.length; i++) {
        if (notebook.searchResults[i].title === hitTitle) {
          resultAlreadyAdded = true;
          break;
        }
      }
    });

    return resultAlreadyAdded;
  };

  const popoverVisibleChange = (bool) => {
    setPopoverVisible(bool);
  };

  return (
    <Row>
      <Col xs={24}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Button type="link" onClick={() => window.open(hit.url, '_blank')}>
              {hit.title}
            </Button>
          </div>
          <div>
            {!checkIfResultAdded(hit.title)
              ? (
                <Popover
                  title="Add to notebook"
                  trigger="click"
                  placement="rightTop"
                  visible={popoverVisible}
                  onVisibleChange={popoverVisibleChange}
                  destroyTooltipOnHide
                  content={() => (
                    <PopoverContentAdd
                      hit={hit}
                      notebooks={notebooks}
                      setNotebooks={setNotebooks}
                      popoverVisibleChange={popoverVisibleChange}
                    />
                  )}
                >
                  <PlusCircleTwoTone style={{ fontSize: '24px' }} />
                </Popover>
              )
              : (
                <Popover
                  trigger="click"
                  placement="rightTop"
                  visible={popoverVisible}
                  onVisibleChange={popoverVisibleChange}
                  destroyTooltipOnHide
                  content={() => (
                    <PopoverContentRemove
                      hit={hit}
                      notebooks={notebooks}
                      setNotebooks={setNotebooks}
                      popoverVisibleChange={popoverVisibleChange}
                    />
                  )}
                >
                  <MinusCircleTwoTone style={{ fontSize: '24px' }} />
                </Popover>
              )}
          </div>
        </Space>
      </Col>
    </Row>
  );
}

export { SearchResultItem };
