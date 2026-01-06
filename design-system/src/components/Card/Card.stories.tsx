import type { Meta, StoryObj } from '@storybook/react';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from './index';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'gradient', 'hero'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a default card with some content.</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </>
    ),
    variant: 'default',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <Card variant="default" style={{ width: '300px' }}>
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a default card with subtle styling.</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>

      <Card variant="gradient" style={{ width: '300px' }}>
        <CardHeader>
          <CardTitle>Gradient Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card has a gradient background.</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>

      <Card variant="hero" style={{ width: '300px' }}>
        <CardHeader center>
          <CardTitle>Hero Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a hero card with prominent styling.</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const WithContent: Story = {
  render: () => (
    <Card variant="default" style={{ width: '400px' }}>
      <CardHeader>
        <CardTitle>Project Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card contains detailed information about a project. It can include multiple paragraphs and other content elements.</p>
        <p>The content area is flexible and can accommodate various types of content including lists, images, and other components.</p>
      </CardContent>
      <CardFooter>
        <button style={{ marginRight: '0.5rem' }}>View Details</button>
        <button>Edit</button>
      </CardFooter>
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card variant="default" as="button" style={{ width: '300px', cursor: 'pointer' }}>
      <CardHeader>
        <CardTitle>Clickable Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card is clickable and can be used as a button or link.</p>
      </CardContent>
    </Card>
  ),
};

