import React from 'react';
import { Button, Card, Modal, Typography, Dropdown, Menu } from 'antd';
import { TaskboardItem, TaskboardItemStatus } from './TaskboardTypes';
import { DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { red } from '@ant-design/colors';
import styled from 'styled-components';
import BaseTooltip from '../shared/BaseTooltip';

interface StyledCardProps {
  $isDragging: boolean;
}

const StyledCard = styled(Card)<StyledCardProps>`
  margin: 0.5rem;
  padding: 0.5rem;
  background-color: ${({ $isDragging }) => ($isDragging ? '#fafafa' : '#fff')};
`;

const TaskboardItemCardTitle = styled(Typography.Title)`
  white-space: pre-wrap;
  margin-right: 0.25rem;
`;

const DeleteMenuItem = styled(Menu.Item)`
  color: ${red.primary};
`;

export interface TaskboardItemCardProps {
  item: TaskboardItem;
  isDragging: boolean;
  status: TaskboardItemStatus;
  onDelete: (args: {
    status: TaskboardItemStatus;
    itemToDelete: TaskboardItem;
  }) => void;
}

function TaskboardItemCard({
  item,
  status,
  isDragging,
  onDelete,
}: TaskboardItemCardProps) {
  return (
    <StyledCard
      $isDragging={isDragging}
      size="small"
      title={
        <BaseTooltip overlay={item.select}>
          <span>
            <TaskboardItemCardTitle level={5} ellipsis={{ rows: 2 }}>
              {item.select}
            </TaskboardItemCardTitle>
          </span>
        </BaseTooltip>
      }
      extra={
        <Dropdown
          overlay={
            <Menu>
              <DeleteMenuItem
                icon={<DeleteOutlined />}
                onClick={() =>
                  onDelete({
                    status,
                    itemToDelete: item,
                  })
                }
              >
                Delete
              </DeleteMenuItem>
            </Menu>
          }
          trigger={['click']}
        >
          <Button size="small" icon={<MoreOutlined />} />
        </Dropdown>
      }
    >
      <BaseTooltip overlay={item.description}>
        <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
          {item.description}
        </Typography.Paragraph>
      </BaseTooltip>
    </StyledCard>
  );
}

export default TaskboardItemCard;
