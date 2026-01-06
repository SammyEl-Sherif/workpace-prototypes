import { fn } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import Select from './index';
import React from 'react';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  args: { onClick: fn() },
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

const defaultArgs = {
  label: 'Label',
  placeholder: 'Placeholder Value',
  children: options(),
};

export const Default: Story = {
  args: defaultArgs,
};

const errorStateArgs = {
  label: 'Label',
  placeholder: 'Placeholder Value',
  children: options(),
  errorText: 'Required.',
  required: true,
};

export const ErrorState: Story = {
  args: errorStateArgs,
};

export const SelectVariants = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Select {...defaultArgs}>{options()}</Select>
      <Select {...errorStateArgs}>{options()}</Select>
    </div>
  ),
};
