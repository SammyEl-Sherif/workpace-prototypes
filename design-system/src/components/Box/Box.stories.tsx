import type { Meta, StoryObj } from '@storybook/react';
import Box from './index';

const meta: Meta<typeof Box> = {
  title: 'Components/Box',
  component: Box as any,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: { children: 'This is a box' },
};

export default meta;

type Story = StoryObj<typeof Box>;

export const Primary: Story = {
  args: {
    children: 'Primary',
    variant: 'default-primary',
    backgroundColor: 'active-800',
    color: 'neutral-white',
    paddingX: 800,
    paddingY: 500,
  },
};
