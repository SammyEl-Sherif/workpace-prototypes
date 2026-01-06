import type { Meta, StoryObj } from '@storybook/react';
import Loading from './index';

const meta: Meta<typeof Loading> = {
  title: 'Components/Loading',
  component: Loading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    fullscreen: {
      control: { type: 'boolean' },
    },
    color: {
      control: { type: 'color' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
    fullscreen: false,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Loading size="sm" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Small</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Loading size="md" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Medium</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Loading size="lg" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Large</p>
      </div>
    </div>
  ),
};

export const DifferentColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Loading size="md" color="#2563eb" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Primary</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Loading size="md" color="#10b981" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Success</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Loading size="md" color="#f59e0b" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Warning</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Loading size="md" color="#ef4444" />
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Error</p>
      </div>
    </div>
  ),
};

export const InContainer: Story = {
  render: () => (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '2rem',
      width: '300px',
      height: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Loading size="md" />
    </div>
  ),
};

