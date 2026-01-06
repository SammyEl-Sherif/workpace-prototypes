import React from 'react';
import { fn } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import Button from './index';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  args: { onClick: fn() },
  argTypes: {
    variant: { control: 'select' },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Variants = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="brand-primary">brand-primary</Button>
      <Button variant="brand-secondary">brand-secondary</Button>
      <Button variant="default-primary">default-primary</Button>
      <Button variant="default-secondary">default-secondary</Button>
    </div>
  ),
};

export const Primary: Story = {
  args: {
    children: 'Primary',
    variant: 'default-primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'default-secondary',
  },
};

export const BrandPrimary: Story = {
  args: {
    children: 'Brand Primary',
    variant: 'brand-primary',
  },
};

export const BrandSecondary: Story = {
  args: {
    children: 'Brand Secondary',
    variant: 'brand-secondary',
  },
};
