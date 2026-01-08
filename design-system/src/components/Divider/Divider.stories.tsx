import type { Meta, StoryObj } from '@storybook/react';
import Divider from './index';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider as any,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
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
    orientation: 'horizontal',
    size: 'md',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <p>Content above</p>
      <Divider size="sm" />
      <p>Small divider</p>
      <Divider size="md" />
      <p>Medium divider</p>
      <Divider size="lg" />
      <p>Large divider</p>
      <p>Content below</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', height: '100px' }}>
      <span>Left content</span>
      <Divider orientation="vertical" size="sm" />
      <span>Small divider</span>
      <Divider orientation="vertical" size="md" />
      <span>Medium divider</span>
      <Divider orientation="vertical" size="lg" />
      <span>Large divider</span>
      <span>Right content</span>
    </div>
  ),
};

export const DifferentColors: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <p>Content above</p>
      <Divider color="#2563eb" />
      <p>Primary color</p>
      <Divider color="#10b981" />
      <p>Success color</p>
      <Divider color="#f59e0b" />
      <p>Warning color</p>
      <Divider color="#ef4444" />
      <p>Error color</p>
      <p>Content below</p>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div style={{ width: '500px', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <h3>Section 1</h3>
      <p>This is the first section of content.</p>

      <Divider />

      <h3>Section 2</h3>
      <p>This is the second section of content.</p>

      <Divider size="lg" color="#2563eb" />

      <h3>Section 3</h3>
      <p>This is the third section with a prominent divider.</p>
    </div>
  ),
};

