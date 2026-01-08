import type { Meta, StoryObj } from '@storybook/react';
import Select from './index';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select as any,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Select>;

const options = () => {
  return (
    <>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </>
  );
};

export const Default: Story = {
  render: () => (
    <Select label="Label" placeholder="Placeholder Value">
      {options()}
    </Select>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <Select label="Label" placeholder="Placeholder Value" errorText="Required." required>
      {options()}
    </Select>
  ),
};

export const SelectVariants = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Select label="Label" placeholder="Placeholder Value">
        {options()}
      </Select>
      <Select label="Label" placeholder="Placeholder Value" errorText="Required." required>
        {options()}
      </Select>
    </div>
  ),
};
