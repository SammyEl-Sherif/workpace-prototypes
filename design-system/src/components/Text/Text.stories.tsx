import type { Meta, StoryObj } from '@storybook/react';
import Text from './index';

/** Write a text description. */
const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text as any,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: { children: 'This is a Text' },
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Primary: Story = {
  args: {
    children: 'This is a Text',
  },
};
