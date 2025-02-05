import React from 'react';
import { within, userEvent, fn, expect } from '@storybook/test';
import type { StoryFn as CSF2Story, StoryObj as CSF3Story, Meta } from '..';

import type { ButtonProps } from './Button';
import { Button } from './Button';

const meta = {
  title: 'Example/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} satisfies Meta<typeof Button>;

export default meta;

const Template: CSF2Story<ButtonProps> = (args) => <Button {...args} />;

export const CSF2Secondary = Template.bind({});
CSF2Secondary.args = {
  children: 'Children coming from story args!',
  primary: false,
};

const getCaptionForLocale = (locale: string) => {
  switch (locale) {
    case 'es':
      return 'Hola!';
    case 'fr':
      return 'Bonjour!';
    case 'kr':
      return '안녕하세요!';
    case 'pt':
      return 'Olá!';
    case 'en':
      return 'Hello!';
    default:
      return undefined;
  }
};

export const CSF2StoryWithLocale: CSF2Story = (args, { globals: { locale } }) => {
  const caption = getCaptionForLocale(locale);
  return (
    <>
      <p>locale: {locale}</p>
      <Button>{caption}</Button>
    </>
  );
};
CSF2StoryWithLocale.storyName = 'WithLocale';

export const CSF2StoryWithParamsAndDecorator: CSF2Story<ButtonProps> = (args) => {
  return <Button {...args} />;
};
CSF2StoryWithParamsAndDecorator.args = {
  children: 'foo',
};
CSF2StoryWithParamsAndDecorator.parameters = {
  layout: 'centered',
};
CSF2StoryWithParamsAndDecorator.decorators = [(StoryFn) => <StoryFn />];

export const CSF3Primary: CSF3Story<ButtonProps> = {
  args: {
    children: 'foo',
    size: 'large',
    primary: true,
  },
};

export const CSF3Button: CSF3Story<ButtonProps> = {
  args: { children: 'foo' },
};

export const CSF3ButtonWithRender: CSF3Story<ButtonProps> = {
  ...CSF3Button,
  render: (args: any) => (
    <div>
      <p data-testid="custom-render">I am a custom render function</p>
      <Button {...args} />
    </div>
  ),
};

export const CSF3InputFieldFilled: CSF3Story = {
  render: () => {
    return <input data-testid="input" />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Step label', async () => {
      const inputEl = canvas.getByTestId('input');
      await userEvent.type(inputEl, 'Hello world!');
      await expect(inputEl).toHaveValue('Hello world!');
    });
  },
};

const mockFn = fn();
export const LoaderStory: CSF3Story<{ mockFn: (val: string) => string }> = {
  args: {
    mockFn,
  },
  loaders: [
    async () => {
      mockFn.mockReturnValueOnce('mockFn return value');
      return {
        value: 'loaded data',
      };
    },
  ],
  render: (args, { loaded }) => {
    const data = args.mockFn('render');
    return (
      <div>
        <div data-testid="loaded-data">{loaded.value}</div>
        <div data-testid="spy-data">{String(data)}</div>
      </div>
    );
  },
  play: async () => {
    expect(mockFn).toHaveBeenCalledWith('render');
  },
};
