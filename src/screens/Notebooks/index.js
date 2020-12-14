import { navigate } from '@reach/router';
import { Button, Input, message, Space, Table } from 'antd';
import {
  DeleteOutlined,
} from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useLocalStorage } from 'utils/useLocalStorage';

const columns = (deleteNotebook) => [
  {
    title: 'Name',
    key: 'title',
    dataIndex: 'title',
  },
  {
    title: 'Search results added',
    key: 'searchResultsAdded',
    render: (data) => data.searchResults.length,
  },
  {
    title: 'Created at',
    key: 'createdAt',
    render: (data) => dayjs(data.createdAt).format('DD/MM/YYYY, HH:mm'),
  },
  {
    title: 'Delete',
    key: 'delete',
    render: () => (
      <DeleteOutlined />
    ),
    onCell: (notebook) => ({
      onClick: async (e) => {
        e.stopPropagation();
        deleteNotebook(notebook);
      },

    }),
  },
];

function Notebooks() {
  const [notebooks, setNotebooks] = useLocalStorage('notebooks');

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');

  const initCreateNotebook = () => {
    setCreateModalVisible(true);
  };

  const handleCreateCancel = () => {
    setCreateModalVisible(false);
  };

  const validateUniqueNotebookName = (title) => !notebooks.some((n) => n.title === title);

  const submitNotebookCreation = () => {
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

    setCreateModalVisible(false);
    setNewNotebookName('');
  };

  const deleteNotebook = (notebook) => {
    const notebooksCopy = [...notebooks];
    const selectedNotebookIndex = notebooksCopy.findIndex((d) => d.id === notebook.id);
    notebooksCopy.splice(selectedNotebookIndex, 1);
    setNotebooks(notebooksCopy);
  };

  return (
    <>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ textAlign: 'right' }}>
          <Button onClick={initCreateNotebook}>Create a Notebook</Button>
        </div>
        <Table
          dataSource={notebooks}
          columns={columns(deleteNotebook)}
          bordered
          rowClassName="pointer"
          onRow={(data) => ({
            onClick: (e) => navigate(`/notebooks/${data.id}`),
          })}

        />
      </Space>
      <Modal
        visible={createModalVisible}
        closable={false}
        onOk={submitNotebookCreation}
        onCancel={handleCreateCancel}
      >
        <Input value={newNotebookName} onChange={(e) => setNewNotebookName(e.target.value)} placeholder="Name your new Notebook" />
      </Modal>
    </>
  );
}

export { Notebooks };
export { NotebookItem } from './NotebookItem';
