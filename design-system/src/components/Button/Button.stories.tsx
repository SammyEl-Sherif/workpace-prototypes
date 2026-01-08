import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Button from './index';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button as any,
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
  render: () => {
    const ButtonComponent = Button as any;
    return (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <ButtonComponent variant="brand-primary">Brand Primary</ButtonComponent>
        <ButtonComponent variant="brand-secondary">Brand Secondary</ButtonComponent>
        <ButtonComponent variant="default-primary">Default Primary</ButtonComponent>
        <ButtonComponent variant="default-secondary">Default Secondary</ButtonComponent>
      </div>
    );
  },
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
