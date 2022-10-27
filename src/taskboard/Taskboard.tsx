import { DragDropContext, DragDropContextProps } from 'react-beautiful-dnd';
import { useMemo, useState } from 'react';
import produce from 'immer';
import styled from 'styled-components';
import { TaskboardItem, TaskboardItemStatus } from './TaskboardTypes';
import TaskboardItemFormModal, {
  TaskboardItemFormValues,
} from './TaskboardItemFormModal';
import TaskboardCol, { TaskboardColProps } from './TaskboardCol';
import { useSyncedState } from '../shared/SharedHooks';

const generateId = () => Date.now().toString();

const TaskboardRoot = styled.div`
  min-height: 0;
  height: 100%;
  width: 80%;
  min-width: 800px;
  max-width: 1400px;
  margin: auto;
`;

const TaskboardContent = styled.div`
  height: 100%;
  padding: 0.5rem;
  display: flex;
`;

const defaultItems = {
  [TaskboardItemStatus.TO_DO]: [],
  [TaskboardItemStatus.DONE]: [],
};

type TaskboardData = Record<TaskboardItemStatus, TaskboardItem[]>;

function Taskboard() {
  const [itemsByStatus, setItemsByStatus] = useSyncedState<TaskboardData>(
    'itemsByStatus',
    defaultItems
  );

  const handleDragEnd: DragDropContextProps ['onDragEnd'] = ({
    source,
    destination,
  }) => {
    setItemsByStatus((current) =>
      produce(current, (draft) => {
        if (!destination) {
          return;
        }
        const [removed] = draft[
          source.droppableId as TaskboardItemStatus
        ].splice(source.index, 1);
        draft[destination.droppableId as TaskboardItemStatus].splice(
          destination.index,
          0,
          removed
        );
      })
    );
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [itemToEdit, setItemToEdit] = useState<TaskboardItem | null>(null);

  const openTaskItemModal = (itemToEdit: TaskboardItem | null) => {
    setItemToEdit(itemToEdit);
    setIsModalVisible(true);
  };

  const closeTaskItemModal = () => {
    setItemToEdit(null);
    setIsModalVisible(false);
  };

  const handleDelete: TaskboardColProps['onDelete'] = ({
    status,
    itemToDelete,
  }) =>
    setItemsByStatus((current) =>
      produce(current, (draft) => {
        draft[status] = draft[status].filter(
          (item) => item.id !== itemToDelete.id
        );
      })
    );

  const initialValues = useMemo<TaskboardItemFormValues>(
    () => ({
      select: itemToEdit?.select ?? '',
      description: itemToEdit?.description ?? '',
    }),
    [itemToEdit]
  );

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <TaskboardRoot>
          <TaskboardContent>
            {Object.values(TaskboardItemStatus).map((status) => (
              <TaskboardCol
                key={status}
                status={status}
                items={itemsByStatus[status]}
                onClickAdd={
                  status === TaskboardItemStatus.TO_DO
                    ? () => openTaskItemModal(null)
                    : undefined
                }
                onEdit={openTaskItemModal}
                onDelete={handleDelete}
              />
            ))}
          </TaskboardContent>
        </TaskboardRoot>
      </DragDropContext>
      <TaskboardItemFormModal
        visible={isModalVisible}
        onCancel={closeTaskItemModal}
        onOk={(values) => {
          setItemsByStatus((current) =>
            produce(current, (draft) => {
              if (itemToEdit) {
                const draftItem = Object.values(draft)
                  .flatMap((items) => items)
                  .find((item) => item.id === itemToEdit.id);
                if (draftItem) {
                  draftItem.select = values.select;
                  draftItem.description = values.description;
                }
              } else {
                draft[TaskboardItemStatus.TO_DO].push({
                  ...values,
                  id: generateId(),
                });
              }
            })
          );
        }}
        initialValues={initialValues}
      />
    </>
  );
}

export default Taskboard;
