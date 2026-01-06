import { fn } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import InputField from './index';
import React from 'react';

const meta: Meta<typeof InputField> = {
  title: 'Components/Input Field',
  component: InputField,
  parameters: {
    layout: 'centered',
  },
  args: { onClick: fn() },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof InputField>;

export const Default: Story = {
  args: {},
};

export const InputFieldVariants = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <InputField
        label="Label"
        placeholder="Placeholder Value"
        helperText="Info to guide the user."
      />
      <InputField label="Label" placeholder="Placeholder Value" errorText="Required." />
    </div>
  ),
};
