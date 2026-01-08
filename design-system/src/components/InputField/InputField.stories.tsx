import type { Meta, StoryObj } from '@storybook/react';
import InputField from './index';

const meta: Meta<typeof InputField> = {
  title: 'Components/Input Field',
  component: InputField as any,
  parameters: {
    layout: 'centered',
  },
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
