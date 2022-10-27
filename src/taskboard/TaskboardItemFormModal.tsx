import { useEffect, useRef } from 'react';
import {Modal, Form, ModalProps, Input, Select,} from 'antd';
import { TaskboardItem } from './TaskboardTypes';

export type TaskboardItemFormValues = Pick<
  TaskboardItem,
  'select' | 'description'
>;

type TaskboardItemFormModalProps = Pick<ModalProps, 'visible'> & {
  initialValues: TaskboardItemFormValues;
  onCancel: VoidFunction;
  onOk: (values: TaskboardItemFormValues) => void;
};

function TaskboardItemFormModal({
  visible,
  initialValues,
  onCancel,
  onOk,
}: TaskboardItemFormModalProps) {
  const [form] = Form.useForm<TaskboardItemFormValues>();

  const inputRef = useRef<Input>(null);

  useEffect(() => {
    if (visible) {
      inputRef.current?.focus();
      form.resetFields();
    }
  }, [form, visible]);

  return (
    <Modal
      title="Add Training"
      visible={visible}
      destroyOnClose
      forceRender
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form
        autoComplete="off"
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={(values) => {
          onOk(values);
          form.resetFields();
          onCancel();
        }}
      >
        <Form.Item
            name="select"
            label="Day"
            rules={[
              { required: true, message: "'Day' is required" },
              {
                max: 400,
                message: "'Day' can not be select",
              },
            ]}>
          <Select>
            <Select.Option value="Monday">Monday</Select.Option>
            <Select.Option value="Tuesday">Tuesday</Select.Option>
            <Select.Option value="Wednesday">Wednesday</Select.Option>
            <Select.Option value="Thursday">Thursday</Select.Option>
            <Select.Option value="Friday">Friday</Select.Option>
            <Select.Option value="Saturday">Saturday</Select.Option>
            <Select.Option value="Sunday">Sunday</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "'Description' is required" },
            {
              max: 400,
              message: "'Description' can not be longer than 400 characters",
            },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default TaskboardItemFormModal;
