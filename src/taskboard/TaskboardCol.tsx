import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Button, Card } from 'antd';
import { TaskboardItem, TaskboardItemStatus } from './TaskboardTypes';
import TaskboardItemCard, { TaskboardItemCardProps } from './TaskboardItemCard';
import { colors } from '../shared/SharedUtils';
import {Content} from "antd/lib/layout/layout";

const TaskboardColRoot = styled(Card)`
  user-select: none;
  flex: 1;
  margin: 0 1.5rem ;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-radius: 10px ;
  
  > .ant-card-body {
    overflow: hidden;
    height: 100%;
    padding: 0;
  }

`;


interface DroppableRootProps {
  isDraggingOver: boolean;
}

const DroppableRoot = styled.div<DroppableRootProps>`
  height: 100%;
  overflow-y: auto;
`;

export type TaskboardColProps = Pick<
  TaskboardItemCardProps,
  'onEdit' | 'onDelete'
> & {
  items: TaskboardItem[];
  status: TaskboardItemStatus;
  onClickAdd?: VoidFunction;
};

function TaskboardCol({
  items,
  status,
  onClickAdd,
  onEdit,
  onDelete,
}: TaskboardColProps) {
  return (
    <TaskboardColRoot
      title={`${status} `}
      extra={
        onClickAdd && (
          <Button   onClick={onClickAdd}  >
            Add
          </Button>
        )
      }
    >
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <DroppableRoot
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {items.map((item, index) => {
              return (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      key={item.id}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskboardItemCard
                        item={item}
                        status={status}
                        onEdit={onEdit}
                        isDragging={snapshot.isDragging}
                        onDelete={onDelete}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </DroppableRoot>
        )}
      </Droppable>
    </TaskboardColRoot>
  );
}

export default TaskboardCol;
