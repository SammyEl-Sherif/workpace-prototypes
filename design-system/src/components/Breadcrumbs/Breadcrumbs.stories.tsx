import type { Meta, StoryObj } from '@storybook/react';
import Breadcrumbs from './index';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs as any,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    separator: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [{ label: 'Apps', href: '/apps' }, { label: 'Good Stuff List' }],
    size: 'md',
  },
};

export const ThreeLevels: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Apps', href: '/apps' },
      { label: 'Good Stuff List' },
    ],
  },
};

export const CustomSeparator: Story = {
  args: {
    items: [{ label: 'Apps', href: '/apps' }, { label: 'Ralli' }],
    separator: '›',
  },
};

export const ChevronSeparator: Story = {
  args: {
    items: [{ label: 'Apps', href: '/apps' }, { label: 'Templates' }],
    separator: '»',
  },
};

export const SmallSize: Story = {
  args: {
    items: [{ label: 'Apps', href: '/apps' }, { label: 'Good Stuff List' }],
    size: 'sm',
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: 'Apps' }],
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <strong>Small</strong>
        <Breadcrumbs
          size="sm"
          items={[{ label: 'Apps', href: '/apps' }, { label: 'Good Stuff List' }]}
        />
      </div>
      <div>
        <strong>Medium (default)</strong>
        <Breadcrumbs
          size="md"
          items={[{ label: 'Apps', href: '/apps' }, { label: 'Good Stuff List' }]}
        />
      </div>
      <div>
        <strong>Large</strong>
        <Breadcrumbs
          size="lg"
          items={[{ label: 'Apps', href: '/apps' }, { label: 'Good Stuff List' }]}
        />
      </div>
    </div>
  ),
};

export const ManyLevels: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Apps', href: '/apps' },
      { label: 'Category', href: '/apps/category' },
      { label: 'Good Stuff List' },
    ],
  },
};
